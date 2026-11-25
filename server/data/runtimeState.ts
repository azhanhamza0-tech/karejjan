import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Server-side authoritative runtime state for rate limiting, fair use,
 * timed exam timers, plan/role verification, duplicate reference locks, and generation caps.
 */

export type StaffRole = 'user' | 'editor' | 'admin' | 'super_admin';

export interface MaintenanceConfig {
  enabled: boolean;
  lockedTabs: string[];
  messageCkb: string;
  messageEn: string;
  estimatedReturn: string;
}

export interface ServerCoursePracticeOverride {
  enabled?: boolean;
  lessonsPerGroup?: number;
  requirePassToUnlockNext?: boolean;
  passThresholdPercent?: number;
}

export interface ServerPracticeConfig {
  lessonsPerGroup: number;
  requirePassToUnlockNext: boolean;
  passThresholdPercent: number;
  courseOverrides?: Record<string, ServerCoursePracticeOverride>;
}

export interface ServerSystemSettings {
  freeDailyAiLimit: number;
  proPerMinuteLimit: number;
  proMaxMessageLength: number;
  dailyGenerationJobCap: number;
  autoPublishAfterValidation: boolean;
  maintenance?: MaintenanceConfig;
  practiceConfig?: ServerPracticeConfig;
}

export interface ServerUserPlanState {
  plan: 'free' | 'pro';
  status: 'none' | 'active' | 'expired';
  expiresAt: string | null;
}

export interface TimedExamSession {
  sessionId: string;
  uid: string;
  quizId: string;
  startedAtMs: number;
  expiresAtMs: number;
  submitted: boolean;
}

const WRITABLE_DATA_DIR = process.env.VERCEL ? os.tmpdir() : path.resolve(process.cwd(), 'server/data');
const SETTINGS_SEED_FILE = path.resolve(process.cwd(), 'server/data/persisted_settings.json');
const SETTINGS_FILE = path.join(WRITABLE_DATA_DIR, 'persisted_settings.json');

function loadPersistedSettings(): Partial<ServerSystemSettings> {
  try {
    const readTarget = fs.existsSync(SETTINGS_FILE) ? SETTINGS_FILE : SETTINGS_SEED_FILE;
    if (fs.existsSync(readTarget)) {
      const raw = fs.readFileSync(readTarget, 'utf8');
      return JSON.parse(raw);
    }
  } catch {}
  return {};
}

const initialSettings = loadPersistedSettings();

const PRACTICE_PROGRESS_FILE = path.join(WRITABLE_DATA_DIR, 'persisted_practice_progress.json');

export interface ServerModuleProgressRecord {
  moduleId: string;
  courseId: string;
  groupIndex: number;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  performanceLevel: 'excellent' | 'good' | 'developing' | 'needs_review';
  attemptsCount: number;
  bestScorePercent: number;
  lastSubmittedAt: string;
  lastAnswers?: Record<string, string>;
  lastItemResults?: Array<{
    questionId: string;
    type: string;
    correct: boolean;
    userAnswerSummary: string;
    correctAnswerSummary: string;
    explanation: Record<string, string>;
  }>;
}

function loadPersistedPracticeProgress(): Record<string, Record<string, ServerModuleProgressRecord>> {
  try {
    if (fs.existsSync(PRACTICE_PROGRESS_FILE)) {
      const raw = fs.readFileSync(PRACTICE_PROGRESS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load persisted practice progress:', err);
  }
  return {};
}

export const persistedPracticeProgress: Record<string, Record<string, ServerModuleProgressRecord>> =
  loadPersistedPracticeProgress();

export function persistPracticeProgress(): void {
  try {
    fs.writeFileSync(PRACTICE_PROGRESS_FILE, JSON.stringify(persistedPracticeProgress, null, 2), 'utf8');
  } catch (err) {
    console.warn('Failed to persist practice progress to disk:', err);
  }
}

export const serverSettings: ServerSystemSettings = {
  freeDailyAiLimit: 15,
  proPerMinuteLimit: 12,
  proMaxMessageLength: 4000,
  dailyGenerationJobCap: 25,
  autoPublishAfterValidation: false,
  practiceConfig: {
    lessonsPerGroup: 3,
    requirePassToUnlockNext: true,
    passThresholdPercent: 60,
    courseOverrides: {},
    ...(initialSettings.practiceConfig || {}),
  },
  maintenance: {
    enabled: false,
    lockedTabs: [],
    messageCkb: 'ئەم بەشە لە ئێستادا لەژێر چاکسازی و نوێکردنەوەدایە بۆ پێشکەشکردنی باشترین خزمەتگوزاری.',
    messageEn: 'This section is currently undergoing scheduled maintenance to improve your learning experience.',
    estimatedReturn: 'بە زووترین کات دەگەڕێینەوە',
  },
  ...initialSettings,
};

export function persistServerSettings(): void {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(serverSettings, null, 2), 'utf8');
  } catch (err) {
    console.warn('Failed to persist server settings to disk:', err);
  }
}

// Ensure settings file exists on startup
if (!fs.existsSync(SETTINGS_FILE)) {
  persistServerSettings();
}

// Per-user authoritative plan state (re-checked on every AI / Pro request)
const userPlans = new Map<string, ServerUserPlanState>();

// Staff role registry (Super Admin bootstrapped via verified email + assigned roles)
const staffRoles = new Map<string, StaffRole>();

// Free plan daily AI usage: `${uid}:${YYYY-MM-DD}` -> count
const freeDailyUsage = new Map<string, number>();

// Pro fair-use sliding 60-second timestamps: uid -> epoch ms[]
const proMinuteWindow = new Map<string, number[]>();

// Abuse cooldown detector: uid -> recent message hashes
const recentMessageFingerprints = new Map<string, { text: string; ts: number }[]>();

// Daily studio generation job count: `YYYY-MM-DD` -> count
const dailyStudioJobs = new Map<string, number>();

// Server-enforced timed exam sessions
const timedExamSessions = new Map<string, TimedExamSession>();

// Approved normalized payment references (duplicate protection)
const approvedReferences = new Set<string>();

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getEffectiveUserPlan(uid: string): ServerUserPlanState {
  const rec = userPlans.get(uid);
  if (!rec) {
    return { plan: 'free', status: 'none', expiresAt: null };
  }
  if (rec.plan === 'pro' && rec.expiresAt && new Date(rec.expiresAt).getTime() <= Date.now()) {
    const expired: ServerUserPlanState = {
      plan: 'free',
      status: 'expired',
      expiresAt: rec.expiresAt,
    };
    userPlans.set(uid, expired);
    return expired;
  }
  return rec;
}

export function setAuthoritativeUserPlan(uid: string, state: ServerUserPlanState): void {
  userPlans.set(uid, state);
}

export function getStaffRole(uid: string, email: string, emailVerified: boolean, bootstrapEmail: string): StaffRole {
  if (email && email.toLowerCase().trim() === bootstrapEmail.toLowerCase().trim()) {
    return 'super_admin';
  }
  return staffRoles.get(uid) || 'user';
}

export function setStaffRole(uid: string, role: StaffRole): void {
  if (role === 'user') {
    staffRoles.delete(uid);
  } else {
    staffRoles.set(uid, role);
  }
}

export function getFreeDailyUsage(uid: string): number {
  return freeDailyUsage.get(`${uid}:${todayKey()}`) || 0;
}

export function incrementFreeDailyUsage(uid: string): number {
  const key = `${uid}:${todayKey()}`;
  const next = (freeDailyUsage.get(key) || 0) + 1;
  freeDailyUsage.set(key, next);
  return next;
}

export function checkProFairUse(uid: string, message: string): { ok: true } | { ok: false; code: string; error: string } {
  if (message.length > serverSettings.proMaxMessageLength) {
    return {
      ok: false,
      code: 'MAX_LENGTH_EXCEEDED',
      error: `Message exceeds the fair-use maximum length of ${serverSettings.proMaxMessageLength} characters.`,
    };
  }

  const now = Date.now();
  const windowHits = (proMinuteWindow.get(uid) || []).filter((ts) => now - ts < 60_000);
  if (windowHits.length >= serverSettings.proPerMinuteLimit) {
    return {
      ok: false,
      code: 'FAIR_USE_RATE_LIMIT',
      error: `Fair-use protection active: maximum ${serverSettings.proPerMinuteLimit} requests per minute. Please wait a few seconds.`,
    };
  }

  // Abuse detection: identical message spammed 4+ times within 20 seconds
  const normalized = message.trim().toLowerCase().slice(0, 200);
  const recent = (recentMessageFingerprints.get(uid) || []).filter((item) => now - item.ts < 20_000);
  const identicalCount = recent.filter((item) => item.text === normalized).length;
  if (identicalCount >= 3) {
    return {
      ok: false,
      code: 'ABUSE_DETECTED',
      error: 'Fair-use abuse protection triggered due to repeated identical messages. Please pause briefly before sending again.',
    };
  }

  windowHits.push(now);
  proMinuteWindow.set(uid, windowHits);
  recent.push({ text: normalized, ts: now });
  recentMessageFingerprints.set(uid, recent);
  return { ok: true };
}

export function getDailyStudioJobsCount(): number {
  return dailyStudioJobs.get(todayKey()) || 0;
}

export function incrementDailyStudioJobsCount(): number {
  const key = todayKey();
  const next = (dailyStudioJobs.get(key) || 0) + 1;
  dailyStudioJobs.set(key, next);
  return next;
}

export function createTimedExamSession(uid: string, quizId: string, timeLimitSeconds: number): TimedExamSession {
  const startedAtMs = Date.now();
  const sessionId = `exam_${uid.slice(0, 8)}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const session: TimedExamSession = {
    sessionId,
    uid,
    quizId,
    startedAtMs,
    expiresAtMs: startedAtMs + timeLimitSeconds * 1000,
    submitted: false,
  };
  timedExamSessions.set(sessionId, session);
  return session;
}

export function getTimedExamSession(sessionId: string): TimedExamSession | undefined {
  return timedExamSessions.get(sessionId);
}

export function hasApprovedReference(normalizedRef: string): boolean {
  return approvedReferences.has(normalizedRef);
}

export function lockApprovedReference(normalizedRef: string): void {
  approvedReferences.add(normalizedRef);
}

export function runExpirySweep(): string[] {
  const downgraded: string[] = [];
  const now = Date.now();
  for (const [uid, state] of userPlans.entries()) {
    if (state.plan === 'pro' && state.expiresAt && new Date(state.expiresAt).getTime() <= now) {
      userPlans.set(uid, { plan: 'free', status: 'expired', expiresAt: state.expiresAt });
      downgraded.push(uid);
    }
  }
  return downgraded;
}
