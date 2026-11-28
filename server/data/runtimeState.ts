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

const SETTINGS_FILE = path.resolve(process.cwd(), 'server/data/persisted_settings.json');

function loadPersistedSettings(): Partial<ServerSystemSettings> {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch {}
  return {};
}

const initialSettings = loadPersistedSettings();

const PRACTICE_PROGRESS_FILE = path.resolve(process.cwd(), 'server/data/persisted_practice_progress.json');

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

export interface ServerVideoChapterMarker {
  time: string;
  seconds: number;
  title: string;
}

export interface ServerVideoLesson {
  id: string;
  muxPlaybackId: string;
  title: string;
  titles?: Partial<Record<'ckb' | 'kmr' | 'ar' | 'en', string>>;
  description: string;
  track: string;
  lessonLanguage: 'ckb' | 'kmr' | 'ar' | 'en';
  category: 'tutorial' | 'project' | 'crash_course' | 'tips' | 'workshop' | 'problem_solving';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  durationLabel?: string;
  posterTimeSec?: number;
  instructor?: string;
  accessPlan?: 'free' | 'pro';
  chapterGroup?: string;
  keyTakeaways?: string[];
  chapters?: ServerVideoChapterMarker[];
  resourceCode?: string;
  linkedLessonId?: string | null;
  published: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

const VIDEOS_FILE = path.resolve(process.cwd(), 'server/data/persisted_videos.json');

function loadPersistedVideos(): ServerVideoLesson[] {
  try {
    if (fs.existsSync(VIDEOS_FILE)) {
      const raw = fs.readFileSync(VIDEOS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load persisted videos:', err);
  }
  return [];
}

export let persistedVideoLessons: ServerVideoLesson[] = loadPersistedVideos();

export function persistVideoLessonsToDisk(): void {
  try {
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(persistedVideoLessons, null, 2), 'utf8');
  } catch (err) {
    console.warn('Failed to persist video lessons to disk:', err);
  }
}

const VALID_VIDEO_CATEGORIES = new Set([
  'tutorial',
  'project',
  'crash_course',
  'tips',
  'workshop',
  'problem_solving',
]);
const VALID_VIDEO_LOCALES = new Set(['ckb', 'kmr', 'ar', 'en']);
const VALID_DIFFICULTIES = new Set(['beginner', 'intermediate', 'advanced']);
const MUX_ID_REGEX = /^[a-zA-Z0-9_-]{8,80}$/;

function extractServerMuxPlaybackId(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (MUX_ID_REGEX.test(trimmed)) return trimmed;
  try {
    const u = new URL(trimmed);
    const seg = u.pathname.split('/').filter(Boolean)[0]?.replace(/\.(m3u8|mp4|jpg|jpeg|png|webp|gif)$/i, '');
    if (seg && u.hostname.toLowerCase().includes('mux') && MUX_ID_REGEX.test(seg)) return seg;
  } catch {}
  return '';
}

export function upsertPersistedVideoLesson(
  rawBody: Record<string, unknown>,
  actorUid: string
): { ok: true; video: ServerVideoLesson } | { ok: false; error: string } {
  const playbackId = extractServerMuxPlaybackId(rawBody?.muxPlaybackId);
  if (!playbackId) {
    return { ok: false, error: 'Valid Mux Playback ID is required (8-80 alphanumeric chars or Mux URL).' };
  }
  const title = typeof rawBody?.title === 'string' ? rawBody.title.trim().slice(0, 200) : '';
  if (!title) {
    return { ok: false, error: 'Video lesson title is required.' };
  }
  const trackRaw = typeof rawBody?.track === 'string' ? rawBody.track.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') : '';
  const track = trackRaw.length >= 2 && trackRaw.length <= 32 ? trackRaw : 'html';

  const rawId = typeof rawBody?.id === 'string' ? rawBody.id.trim().replace(/[^a-zA-Z0-9_-]/g, '') : '';
  const id = rawId && rawId.length >= 2 ? rawId.slice(0, 96) : `vid-${track}-${Date.now().toString(36)}`;
  const existing = persistedVideoLessons.find((v) => v.id === id);

  const lessonLanguage =
    typeof rawBody?.lessonLanguage === 'string' && VALID_VIDEO_LOCALES.has(rawBody.lessonLanguage)
      ? (rawBody.lessonLanguage as ServerVideoLesson['lessonLanguage'])
      : 'ckb';
  const category =
    typeof rawBody?.category === 'string' && VALID_VIDEO_CATEGORIES.has(rawBody.category)
      ? (rawBody.category as ServerVideoLesson['category'])
      : 'tutorial';
  const difficulty =
    typeof rawBody?.difficulty === 'string' && VALID_DIFFICULTIES.has(rawBody.difficulty)
      ? (rawBody.difficulty as ServerVideoLesson['difficulty'])
      : 'beginner';

  const titlesInput = rawBody?.titles && typeof rawBody.titles === 'object' ? (rawBody.titles as Record<string, unknown>) : undefined;
  const cleanTitles: Partial<Record<'ckb' | 'kmr' | 'ar' | 'en', string>> | undefined = titlesInput
    ? {
        ...(typeof titlesInput.ckb === 'string' && titlesInput.ckb.trim() ? { ckb: titlesInput.ckb.trim().slice(0, 200) } : {}),
        ...(typeof titlesInput.kmr === 'string' && titlesInput.kmr.trim() ? { kmr: titlesInput.kmr.trim().slice(0, 200) } : {}),
        ...(typeof titlesInput.ar === 'string' && titlesInput.ar.trim() ? { ar: titlesInput.ar.trim().slice(0, 200) } : {}),
        ...(typeof titlesInput.en === 'string' && titlesInput.en.trim() ? { en: titlesInput.en.trim().slice(0, 200) } : {}),
      }
    : undefined;

  const takeaways = Array.isArray(rawBody?.keyTakeaways)
    ? rawBody.keyTakeaways.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).map((x) => x.trim().slice(0, 220)).slice(0, 25)
    : undefined;

  const chapters = Array.isArray(rawBody?.chapters)
    ? rawBody.chapters
        .filter((c): c is { time: string; seconds: number; title: string } => Boolean(c && typeof c === 'object' && typeof (c as any).time === 'string' && typeof (c as any).title === 'string'))
        .map((c) => ({
          time: c.time.trim().slice(0, 16),
          seconds: Math.max(0, Math.min(36000, Number(c.seconds) || 0)),
          title: c.title.trim().slice(0, 120),
        }))
        .slice(0, 60)
    : undefined;

  const nowIso = new Date().toISOString();
  const nextVideo: ServerVideoLesson = {
    id,
    muxPlaybackId: playbackId,
    title,
    ...(cleanTitles && Object.keys(cleanTitles).length > 0 ? { titles: cleanTitles } : {}),
    description: typeof rawBody?.description === 'string' ? rawBody.description.trim().slice(0, 4000) : '',
    track,
    lessonLanguage,
    category,
    difficulty,
    order: typeof rawBody?.order === 'number' && Number.isFinite(rawBody.order) ? Math.max(0, Math.min(5000, Math.round(rawBody.order))) : 1,
    ...(typeof rawBody?.durationLabel === 'string' && rawBody.durationLabel.trim() ? { durationLabel: rawBody.durationLabel.trim().slice(0, 24) } : {}),
    ...(typeof rawBody?.posterTimeSec === 'number' && Number.isFinite(rawBody.posterTimeSec) && rawBody.posterTimeSec >= 0 ? { posterTimeSec: Math.min(36000, Math.floor(rawBody.posterTimeSec)) } : {}),
    ...(typeof rawBody?.instructor === 'string' && rawBody.instructor.trim() ? { instructor: rawBody.instructor.trim().slice(0, 100) } : {}),
    accessPlan: rawBody?.accessPlan === 'pro' ? 'pro' : 'free',
    ...(typeof rawBody?.chapterGroup === 'string' && rawBody.chapterGroup.trim() ? { chapterGroup: rawBody.chapterGroup.trim().slice(0, 120) } : {}),
    ...(takeaways && takeaways.length > 0 ? { keyTakeaways: takeaways } : {}),
    ...(chapters && chapters.length > 0 ? { chapters } : {}),
    ...(typeof rawBody?.resourceCode === 'string' && rawBody.resourceCode.trim() ? { resourceCode: rawBody.resourceCode.slice(0, 30000) } : {}),
    ...(typeof rawBody?.linkedLessonId === 'string' && rawBody.linkedLessonId.trim() ? { linkedLessonId: rawBody.linkedLessonId.trim().slice(0, 96) } : {}),
    published: typeof rawBody?.published === 'boolean' ? rawBody.published : true,
    createdBy: existing?.createdBy || actorUid,
    createdAt: existing?.createdAt || nowIso,
    updatedAt: nowIso,
  };

  const idx = persistedVideoLessons.findIndex((v) => v.id === id);
  if (idx >= 0) {
    persistedVideoLessons[idx] = nextVideo;
  } else {
    persistedVideoLessons.push(nextVideo);
  }
  persistedVideoLessons.sort((a, b) => a.order - b.order);
  persistVideoLessonsToDisk();
  return { ok: true, video: nextVideo };
}

export function deletePersistedVideoLesson(videoId: string): boolean {
  const before = persistedVideoLessons.length;
  persistedVideoLessons = persistedVideoLessons.filter((v) => v.id !== videoId);
  if (persistedVideoLessons.length !== before) {
    persistVideoLessonsToDisk();
    return true;
  }
  return false;
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
