import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Trash2,
  RefreshCw,
  Database,
  Shield,
  Wrench,
} from 'lucide-react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { apiFetch, ApiError } from '../lib/api';
import { useApp } from '../context/AppContext';
import { pickLoc } from '../i18n/translations';
import { cleanTitle } from '../i18n/translations';
import { ALL_COURSES, ALL_CHAPTERS } from '../data/courses/coursesList';
import {
  SEED_CHAPTERS,
  SEED_COURSES,
  SEED_EXERCISES,
  SEED_LESSONS,
  SEED_PAYMENT_SETTINGS,
  SEED_PLANS,
  SEED_QUIZZES,
} from '../data/seedCatalog';
import type {
  AiGenerationJob,
  AuditLogEntry,
  GeneratedDraft,
  Locale,
  PaymentSetting,
  PaymentTransaction,
  SubscriptionRecord,
  TrackId,
} from '../types/domain';
import { Button, Modal, Surface } from './ui/Primitives';
import { AdminDiscoveryPanel } from './AdminDiscoveryPanel';
import { AdminCoursesPanel } from './AdminCoursesPanel';
import { AdminMaintenancePanel } from './AdminMaintenancePanel';
import { AdminDailyChallengePanel } from './AdminDailyChallengePanel';
import { DISCOVERY_COPY } from '../i18n/discoveryCopy';

type AdminTab = 'lessons' | 'courses' | 'studio' | 'challenge' | 'discovery' | 'maintenance' | 'payments' | 'settings' | 'audit';

function addOneMonth(base: Date): Date {
  const next = new Date(base.getTime());
  next.setMonth(next.getMonth() + 1);
  return next;
}

export const AdminView: React.FC = () => {
  const {
    t,
    locale,
    firebaseUser,
    staffRole,
    courses,
    lessons,
    systemSettings,
    updatePracticeConfig,
    paymentSettings,
    plans,
    refreshCatalog,
    refreshServerStatus,
  } = useApp();

  const isSuperAdmin = staffRole === 'super_admin';
  const isPaymentAdmin = staffRole === 'super_admin' || staffRole === 'admin';
  const isStaff = staffRole !== 'user';

  const [tab, setTab] = useState<AdminTab>('lessons');
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Manual Lesson CMS state
  const [lessonId, setLessonId] = useState('');
  const [lessonCourse, setLessonCourse] = useState<TrackId>('html');
  const [lessonOrder, setLessonOrder] = useState(4);
  const [lessonDifficulty, setLessonDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [lessonTitleEn, setLessonTitleEn] = useState('');
  const [lessonTitleAr, setLessonTitleAr] = useState('');
  const [lessonTitleCkb, setLessonTitleCkb] = useState('');
  const [lessonTitleKmr, setLessonTitleKmr] = useState('');
  const [lessonIntroEn, setLessonIntroEn] = useState('');
  const [lessonExplanationEn, setLessonExplanationEn] = useState('');
  const [lessonSyntax, setLessonSyntax] = useState('<section>...</section>');
  const [lessonHtml, setLessonHtml] = useState('<section><h2>Hello KARÊJAN</h2></section>');
  const [lessonCss, setLessonCss] = useState('section { padding: 16px; }');
  const [lessonJs, setLessonJs] = useState('console.log("Lesson ready");');
  const [lessonPublished, setLessonPublished] = useState(true);

  // AI Content Studio state
  const [studioTrack, setStudioTrack] = useState<TrackId>('js');
  const [studioTopic, setStudioTopic] = useState('');
  const [studioTitle, setStudioTitle] = useState('');
  const [studioDifficulty, setStudioDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [studioCount, setStudioCount] = useState(1);
  const [studioLangs, setStudioLangs] = useState<Locale[]>(['ckb', 'kmr', 'ar', 'en']);
  const [studioDepth, setStudioDepth] = useState<'concise' | 'standard' | 'deep'>('standard');
  const [studioExercises, setStudioExercises] = useState(true);
  const [studioQuiz, setStudioQuiz] = useState(true);
  const [studioProject, setStudioProject] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [drafts, setDrafts] = useState<GeneratedDraft[]>([]);
  const [jobs, setJobs] = useState<AiGenerationJob[]>([]);
  const [editingDraft, setEditingDraft] = useState<GeneratedDraft | null>(null);
  const [editLocale, setEditLocale] = useState<Locale>('en');

  // Payments & Subscriptions state
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [paymentSearch, setPaymentSearch] = useState('');
  const [receiptModalTx, setReceiptModalTx] = useState<PaymentTransaction | null>(null);
  const [rejectModalTx, setRejectModalTx] = useState<PaymentTransaction | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [extendModalSub, setExtendModalSub] = useState<SubscriptionRecord | null>(null);
  const [extendDays, setExtendDays] = useState(30);
  const [extendReason, setExtendReason] = useState('');

  const DEFAULT_PRACTICE = {
    lessonsPerGroup: 3,
    requirePassToUnlockNext: true,
    passThresholdPercent: 60,
    courseOverrides: {},
  };

  // Settings & Payment Settings state
  const [settingsForm, setSettingsForm] = useState({
    ...systemSettings,
    practiceConfig: { ...DEFAULT_PRACTICE, ...(systemSettings.practiceConfig || {}) },
  });
  const [paySettingsForm, setPaySettingsForm] = useState<PaymentSetting[]>(paymentSettings);
  const [proPriceIqd, setProPriceIqd] = useState(10000);
  const [staffUidInput, setStaffUidInput] = useState('');
  const [staffEmailInput, setStaffEmailInput] = useState('');
  const [staffRoleInput, setStaffRoleInput] = useState<'editor' | 'admin' | 'super_admin'>('editor');

  // Audit Logs (Super Admin only)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setSettingsForm({
      ...systemSettings,
      practiceConfig: { ...DEFAULT_PRACTICE, ...(systemSettings.practiceConfig || {}) },
    });
  }, [systemSettings]);

  useEffect(() => {
    setPaySettingsForm(paymentSettings);
  }, [paymentSettings]);

  useEffect(() => {
    const pro = plans.find((p) => p.id === 'pro');
    if (pro) setProPriceIqd(pro.priceIqd);
  }, [plans]);

  // Staff listeners
  useEffect(() => {
    if (!firebaseUser || !isStaff) return;

    const unsubDrafts = onSnapshot(
      query(collection(db, 'generated_lessons'), orderBy('createdAt', 'desc')),
      (snap) => {
        setDrafts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GeneratedDraft, 'id'>) })));
      },
      () => {}
    );

    const unsubJobs = onSnapshot(
      query(collection(db, 'ai_generation_jobs'), orderBy('createdAt', 'desc')),
      (snap) => {
        setJobs(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AiGenerationJob, 'id'>) })));
      },
      () => {}
    );

    let unsubTx: (() => void) | undefined;
    let unsubSubs: (() => void) | undefined;
    let unsubLogs: (() => void) | undefined;

    if (isPaymentAdmin) {
      unsubTx = onSnapshot(
        query(collection(db, 'payment_transactions'), orderBy('createdAt', 'desc')),
        (snap) => {
          setTransactions(
            snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PaymentTransaction, 'id'>) }))
          );
        },
        () => {}
      );

      unsubSubs = onSnapshot(
        collection(db, 'subscriptions'),
        (snap) => {
          setSubscriptions(snap.docs.map((d) => d.data() as SubscriptionRecord));
        },
        () => {}
      );
    }

    if (isSuperAdmin) {
      unsubLogs = onSnapshot(
        query(collection(db, 'admin_audit_logs'), orderBy('createdAt', 'desc')),
        (snap) => {
          setAuditLogs(
            snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AuditLogEntry, 'id'>) }))
          );
        },
        () => {}
      );
    }

    return () => {
      unsubDrafts();
      unsubJobs();
      unsubTx?.();
      unsubSubs?.();
      unsubLogs?.();
    };
  }, [firebaseUser, isStaff, isPaymentAdmin, isSuperAdmin]);

  if (!firebaseUser || !isStaff) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
        <Surface className="p-8 text-center">
          <Shield className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          <h1 className="text-lg font-bold text-slate-950 dark:text-white">Admin Access Required</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Sign in with an authorized Super Admin, Admin, or Editor account to access this console.
          </p>
        </Surface>
      </div>
    );
  }

  const notify = (type: 'ok' | 'err', text: string) => setBanner({ type, text });

  const writeAuditLog = async (
    action: string,
    targetCollection: string,
    targetId: string,
    reason?: string,
    before?: Record<string, unknown>,
    after?: Record<string, unknown>
  ) => {
    if (!isStaff) return;
    try {
      await addDoc(collection(db, 'admin_audit_logs'), {
        actorUid: firebaseUser.uid,
        actorEmail: firebaseUser.email || '',
        actorRole: staffRole,
        action,
        targetCollection,
        targetId,
        reason: reason || null,
        before: before || null,
        after: after || null,
        createdAt: serverTimestamp(),
      });
    } catch (auditErr) {
      console.warn('Audit log write skipped:', auditErr);
    }
  };

  // Seed all Phase 1, 2, and 3 data to live Firestore
  const handleSeedFirestore = async () => {
    setSeeding(true);
    setBanner(null);
    try {
      for (const c of (SEED_COURSES || ALL_COURSES || [])) {
        await setDoc(doc(db, 'courses', c.id), {
          ...c,
          titles: {
            en: cleanTitle(c.titles.en),
            ckb: cleanTitle(c.titles.ckb),
            kmr: cleanTitle(c.titles.kmr),
            ar: cleanTitle(c.titles.ar),
          },
          updatedAt: serverTimestamp(),
        });
      }
      for (const ch of (SEED_CHAPTERS || ALL_CHAPTERS || [])) {
        await setDoc(doc(db, 'chapters', ch.id), { ...ch, updatedAt: serverTimestamp() });
      }
      for (const l of SEED_LESSONS) {
        await setDoc(doc(db, 'lessons', l.id), {
          ...l,
          createdBy: firebaseUser.uid,
          updatedAt: serverTimestamp(),
        });
      }
      for (const ex of SEED_EXERCISES) {
        await setDoc(doc(db, 'exercises', ex.id), { ...ex, updatedAt: serverTimestamp() });
      }
      for (const qz of SEED_QUIZZES) {
        await setDoc(doc(db, 'quizzes', qz.id), { ...qz, updatedAt: serverTimestamp() });
      }
      if (isPaymentAdmin) {
        for (const p of SEED_PLANS) {
          await setDoc(doc(db, 'subscription_plans', p.id), { ...p, updatedAt: serverTimestamp() });
        }
        await setDoc(doc(db, 'system_settings', 'global'), {
          ...systemSettings,
          updatedBy: firebaseUser.uid,
          updatedAt: serverTimestamp(),
        });
      }
      if (isSuperAdmin) {
        for (const m of SEED_PAYMENT_SETTINGS) {
          await setDoc(doc(db, 'payment_settings', m.id), {
            ...m,
            updatedBy: firebaseUser.uid,
            updatedAt: serverTimestamp(),
          });
        }
      }
      await refreshCatalog();
      notify('ok', 'All seed courses, 9 multilingual lessons, plans, payment settings, exercises, and quizzes synced to Firestore.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Seed sync failed.');
    } finally {
      setSeeding(false);
    }
  };

  // Manual Lesson Create/Publish
  const handleSaveManualLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = (lessonId.trim() || `${lessonCourse}-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '-');
    const enObj = {
      title: lessonTitleEn.trim(),
      intro: lessonIntroEn.trim() || 'Practical web programming lesson.',
      objectives: ['Understand core syntax', 'Apply concepts in the live Code Lab'],
      explanation: lessonExplanationEn.trim() || 'Review the syntax and code example below.',
      syntaxNotes: 'Follow the standard syntax pattern shown.',
      tryItPrompt: 'Open this example in Code Lab and customize the output.',
      commonMistakes: ['Verify matching tags, brackets, and selectors.'],
      summary: 'Practice the example in the sandbox to solidify the concept.',
    };
    try {
      await setDoc(doc(db, 'lessons', cleanId), {
        id: cleanId,
        courseId: lessonCourse,
        chapterId: `ch-${lessonCourse}-1`,
        order: Number(lessonOrder),
        difficulty: lessonDifficulty,
        published: lessonPublished,
        sharedCode: {
          syntax: lessonSyntax,
          html: lessonHtml,
          css: lessonCss,
          js: lessonJs,
        },
        translations: {
          en: enObj,
          ar: { ...enObj, title: lessonTitleAr.trim() || enObj.title },
          ckb: { ...enObj, title: lessonTitleCkb.trim() || enObj.title },
          kmr: { ...enObj, title: lessonTitleKmr.trim() || enObj.title },
        },
        createdBy: firebaseUser.uid,
        updatedAt: serverTimestamp(),
      });
      await refreshCatalog();
      setLessonId('');
      setLessonTitleEn('');
      setLessonTitleAr('');
      setLessonTitleCkb('');
      setLessonTitleKmr('');
      notify('ok', `Lesson "${cleanId}" saved (${lessonPublished ? 'published' : 'draft'}).`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to save lesson.');
    }
  };

  // AI Content Studio: Generate Lessons with KARÊJAN AI
  const handleGenerateStudio = async (forceDuplicate = false) => {
    if (!studioTopic.trim()) return;
    setGenerating(true);
    setBanner(null);

    const existingTitles = lessons
      .filter((l) => l.courseId === studioTrack)
      .map((l) => (l.translations?.en?.title || l.translations?.ckb?.title || '').slice(0, 180).trim())
      .filter(Boolean)
      .slice(0, 100);

    const jobDocRef = await addDoc(collection(db, 'ai_generation_jobs'), {
      languageTrack: studioTrack,
      courseId: studioTrack,
      topic: studioTopic.trim(),
      lessonTitle: studioTitle.trim() || null,
      difficulty: studioDifficulty,
      count: studioCount,
      requiredLanguages: studioLangs,
      depth: studioDepth,
      includeExercises: studioExercises,
      includeQuiz: studioQuiz,
      includeProject: studioProject,
      status: 'running',
      attempts: 0,
      errors: [],
      duplicateWarnings: [],
      createdBy: firebaseUser.uid,
      createdAt: serverTimestamp(),
    });

    try {
      const result = await apiFetch<{
        status: 'completed';
        attempts: number;
        errors: string[];
        duplicateWarnings: string[];
        autoPublishAllowed: boolean;
        drafts: Array<{
          slug: string;
          status: 'draft' | 'flagged';
          sharedCode: GeneratedDraft['sharedCode'];
          translations: GeneratedDraft['translations'];
          exercises?: GeneratedDraft['exercises'];
          quizQuestions?: Array<{
            id: string;
            codeSnippet?: string;
            correctOptionIndex: number;
            translations: Record<string, { prompt: string; options: string[]; explanation: string }>;
          }>;
          project?: GeneratedDraft['project'];
          validationReport?: GeneratedDraft['validationReport'];
        }>;
      }>('/api/studio/generate', {
        method: 'POST',
        body: {
          languageTrack: studioTrack,
          courseId: studioTrack,
          topic: studioTopic.trim(),
          lessonTitle: studioTitle.trim(),
          difficulty: studioDifficulty,
          count: studioCount,
          requiredLanguages: studioLangs,
          depth: studioDepth,
          includeExercises: studioExercises,
          includeQuiz: studioQuiz,
          includeProject: studioProject,
          existingTitles,
          forceDuplicate,
        },
      });

      await updateDoc(jobDocRef, {
        status: 'completed',
        attempts: result.attempts,
        errors: result.errors,
        duplicateWarnings: result.duplicateWarnings,
      });

      for (const item of result.drafts) {
        const draftRef = await addDoc(collection(db, 'generated_lessons'), {
          jobId: jobDocRef.id,
          courseId: studioTrack,
          chapterId: `ch-${studioTrack}-1`,
          difficulty: studioDifficulty,
          status: item.status,
          sharedCode: item.sharedCode,
          translations: item.translations,
          exercises: item.exercises || [],
          quiz: item.quizQuestions && item.quizQuestions.length > 0 ? { questions: item.quizQuestions } : null,
          project: item.project || null,
          validationReport: item.validationReport || null,
          createdBy: firebaseUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Respect autoPublishAfterValidation (OFF by default) only if validation passed cleanly
        if (result.autoPublishAllowed && item.status === 'draft') {
          await publishDraft({
            id: draftRef.id,
            jobId: jobDocRef.id,
            courseId: studioTrack,
            chapterId: `ch-${studioTrack}-1`,
            difficulty: studioDifficulty,
            status: item.status,
            sharedCode: item.sharedCode,
            translations: item.translations,
            exercises: item.exercises,
            quiz: item.quizQuestions?.length ? { questions: item.quizQuestions } : null,
            project: item.project,
            validationReport: item.validationReport,
            createdBy: firebaseUser.uid,
          });
        }
      }

      notify(
        'ok',
        `Generated ${result.drafts.length} draft(s) in ${result.attempts} attempt(s). Saved to drafts for staff review.`
      );
      void refreshServerStatus();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Generation failed.';
      await updateDoc(jobDocRef, {
        status: 'failed',
        attempts: 3,
        errors: [msg.slice(0, 300)],
      }).catch(() => {});
      notify('err', msg);
    } finally {
      setGenerating(false);
    }
  };

  const publishDraft = async (draft: GeneratedDraft) => {
    const lessonDocId = `${draft.courseId}-studio-${draft.id.slice(0, 8)}`;
    const fallbackEn = draft.translations.en || Object.values(draft.translations)[0];
    if (!fallbackEn) return;

    try {
      await setDoc(doc(db, 'lessons', lessonDocId), {
        id: lessonDocId,
        courseId: draft.courseId,
        chapterId: draft.chapterId || `ch-${draft.courseId}-1`,
        order: lessons.filter((l) => l.courseId === draft.courseId).length + 1,
        difficulty: draft.difficulty,
        published: true,
        sharedCode: draft.sharedCode,
        translations: {
          en: draft.translations.en || fallbackEn,
          ar: draft.translations.ar || fallbackEn,
          ckb: draft.translations.ckb || fallbackEn,
          kmr: draft.translations.kmr || fallbackEn,
        },
        createdBy: firebaseUser.uid,
        updatedAt: serverTimestamp(),
      });

      // Publish public exercises & quizzes WITHOUT answer keys, and register keys privately on server + staff-only Firestore
      const quizId = draft.quiz?.questions?.length ? `quiz-${lessonDocId}` : null;
      if (draft.exercises?.length) {
        for (const ex of draft.exercises) {
          const cleanExId = `${ex.id.replace(/[^a-zA-Z0-9_-]/g, '-')}-${draft.id.slice(0, 4)}`;
          const publicTranslations: Record<string, { prompt: string; options?: string[]; hint?: string }> = {};
          for (const loc of ['en', 'ar', 'ckb', 'kmr'] as Locale[]) {
            const src = ex.translations[loc] || ex.translations.en || Object.values(ex.translations)[0];
            publicTranslations[loc] = { prompt: src.prompt, options: src.options, hint: src.hint };
          }
          await setDoc(doc(db, 'exercises', cleanExId), {
            id: cleanExId,
            lessonId: lessonDocId,
            courseId: draft.courseId,
            type: ex.type,
            difficulty: ex.difficulty,
            tier: 'free',
            codeSnippet: ex.codeSnippet || '',
            translations: publicTranslations,
            updatedAt: serverTimestamp(),
          });
          await setDoc(doc(db, 'exercise_answer_keys', cleanExId), {
            exerciseId: cleanExId,
            evaluationMethod: ex.evaluationMethod || 'exact_option',
            correctAnswer: ex.correctAnswer,
            explanation: { en: ex.translations.en?.explanation || '' },
            updatedAt: serverTimestamp(),
          });
        }
      }

      if (quizId && draft.quiz?.questions?.length) {
        await setDoc(doc(db, 'quizzes', quizId), {
          id: quizId,
          quizType: 'lesson_quiz',
          courseId: draft.courseId,
          lessonId: lessonDocId,
          difficulty: 'medium',
          tier: 'free',
          titles: {
            en: `${(draft.translations.en || fallbackEn).title} Quiz`,
            ar: `${(draft.translations.ar || fallbackEn).title}`,
            ckb: `${(draft.translations.ckb || fallbackEn).title}`,
            kmr: `${(draft.translations.kmr || fallbackEn).title}`,
          },
          questions: draft.quiz.questions.map((q) => ({
            id: q.id,
            codeSnippet: q.codeSnippet || '',
            translations: {
              en: { prompt: q.translations.en?.prompt || '', options: q.translations.en?.options || [] },
              ar: { prompt: (q.translations.ar || q.translations.en)?.prompt || '', options: (q.translations.ar || q.translations.en)?.options || [] },
              ckb: { prompt: (q.translations.ckb || q.translations.en)?.prompt || '', options: (q.translations.ckb || q.translations.en)?.options || [] },
              kmr: { prompt: (q.translations.kmr || q.translations.en)?.prompt || '', options: (q.translations.kmr || q.translations.en)?.options || [] },
            },
          })),
          updatedAt: serverTimestamp(),
        });
      }

      await apiFetch('/api/studio/register-keys', {
        method: 'POST',
        body: {
          lessonId: lessonDocId,
          courseId: draft.courseId,
          exercises: draft.exercises || [],
          quizId,
          quizQuestions: draft.quiz?.questions || [],
        },
      }).catch(() => {});

      await updateDoc(doc(db, 'generated_lessons', draft.id), {
        status: 'published',
        updatedAt: serverTimestamp(),
      });
      await refreshCatalog();
      setEditingDraft(null);
      notify('ok', `Draft published to lessons/${lessonDocId}.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Publish failed.');
    }
  };

  const rejectAndDeleteDraft = async (draftId: string) => {
    try {
      await deleteDoc(doc(db, 'generated_lessons', draftId));
      setEditingDraft(null);
      notify('ok', 'Draft rejected and deleted.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const regenerateDraftSection = async (section: 'intro' | 'explanation' | 'summary' | 'tryItPrompt') => {
    if (!editingDraft) return;
    const locObj = editingDraft.translations[editLocale];
    if (!locObj) return;
    try {
      const res = await apiFetch<{ content: string }>('/api/studio/regenerate-section', {
        method: 'POST',
        body: {
          languageTrack: editingDraft.courseId,
          locale: editLocale,
          section,
          lessonTitle: locObj.title,
          currentContent: String(locObj[section] || ''),
        },
      });
      const updated: GeneratedDraft = {
        ...editingDraft,
        translations: {
          ...editingDraft.translations,
          [editLocale]: { ...locObj, [section]: res.content },
        },
      };
      setEditingDraft(updated);
      await updateDoc(doc(db, 'generated_lessons', editingDraft.id), {
        translations: updated.translations,
        updatedAt: serverTimestamp(),
      });
      notify('ok', `Regenerated "${section}" for ${editLocale.toUpperCase()}.`);
    } catch (err) {
      notify('err', err instanceof ApiError ? err.message : 'Regeneration failed.');
    }
  };

  // Phase 2: Atomic Approve Payment Transaction (tx + ref lock + subscription + user + notification + audit log)
  const handleApprovePayment = async (txItem: PaymentTransaction) => {
    if (!isPaymentAdmin) return;
    setBanner(null);
    try {
      let computedExpiresAt = '';

      await runTransaction(db, async (trx) => {
        const txRef = doc(db, 'payment_transactions', txItem.id);
        const refLockRef = doc(db, 'payment_references', txItem.normalizedRef);
        const subRef = doc(db, 'subscriptions', txItem.uid);
        const userRef = doc(db, 'users', txItem.uid);

        const [txSnap, refLockSnap, subSnap, userSnap] = await Promise.all([
          trx.get(txRef),
          trx.get(refLockRef),
          trx.get(subRef),
          trx.get(userRef),
        ]);

        if (!txSnap.exists()) throw new Error('Transaction not found.');
        const currentStatus = txSnap.data().status;
        if (currentStatus !== 'pending' && currentStatus !== 'requires_review') {
          throw new Error('This payment has already been finalized.');
        }
        if (refLockSnap.exists()) {
          throw new Error(`Duplicate protection: Reference ${txItem.normalizedRef} was already approved.`);
        }

        const nowDate = new Date();
        const existingSub = subSnap.exists() ? (subSnap.data() as SubscriptionRecord) : null;
        const baseDate =
          existingSub?.plan === 'pro' &&
          existingSub?.status === 'active' &&
          new Date(existingSub.expiresAt).getTime() > nowDate.getTime()
            ? new Date(existingSub.expiresAt)
            : nowDate;
        const expiresAt = addOneMonth(baseDate).toISOString();
        computedExpiresAt = expiresAt;
        const activatedAt =
          existingSub?.activatedAt && existingSub.status === 'active'
            ? existingSub.activatedAt
            : nowDate.toISOString();

        // 1. Lock unique transaction reference (prevents double approval)
        trx.set(refLockRef, {
          normalizedRef: txItem.normalizedRef,
          transactionId: txItem.id,
          uid: txItem.uid,
          approvedBy: firebaseUser.uid,
          approvedAt: serverTimestamp(),
        });

        // 2. Mark payment approved
        trx.update(txRef, {
          status: 'approved',
          reviewReason: 'Verified and approved',
          reviewedBy: firebaseUser.uid,
          reviewedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // 3. Create or extend subscription
        trx.set(subRef, {
          uid: txItem.uid,
          userEmail: txItem.userEmail,
          plan: 'pro',
          status: 'active',
          activatedAt,
          expiresAt,
          lastTransactionId: txItem.id,
          extensionNotes: existingSub?.extensionNotes || [],
          updatedAt: serverTimestamp(),
        });

        // 4. Update user plan fields (permitted only for Payment Admin in firestore.rules)
        if (userSnap.exists()) {
          trx.update(userRef, {
            plan: 'pro',
            subscriptionStatus: 'active',
            subscriptionExpiresAt: expiresAt,
            updatedAt: serverTimestamp(),
          });
        }

        // 5. Notify user
        trx.set(doc(collection(db, 'notifications')), {
          uid: txItem.uid,
          type: 'subscription_activated',
          title: 'KARÊJAN Pro Activated',
          body: `Your Pro plan is active until ${expiresAt.slice(0, 10)}. Reference: ${txItem.transactionRef}.`,
          read: false,
          createdAt: serverTimestamp(),
        });

        // 6. Append-only audit log
        trx.set(doc(collection(db, 'admin_audit_logs')), {
          actorUid: firebaseUser.uid,
          actorEmail: firebaseUser.email || '',
          actorRole: staffRole,
          action: 'payment_approved',
          targetCollection: 'payment_transactions',
          targetId: txItem.id,
          reason: `Verified ${txItem.methodId} ref ${txItem.transactionRef}`,
          before: { status: currentStatus, plan: existingSub?.plan || 'free' },
          after: { status: 'approved', plan: 'pro', expiresAt },
          createdAt: serverTimestamp(),
        });
      });

      // Sync authoritative server state for immediate AI & Pro quiz unlock
      await apiFetch('/api/admin/sync-subscription', {
        method: 'POST',
        body: {
          targetUid: txItem.uid,
          plan: 'pro',
          status: 'active',
          expiresAt: computedExpiresAt,
          normalizedTransactionRef: txItem.normalizedRef,
        },
      }).catch(() => {});

      notify('ok', `Approved ${txItem.transactionRef} and activated Pro until ${computedExpiresAt.slice(0, 10)}.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Approval transaction failed.');
    }
  };

  const handleRejectOrFlagPayment = async (
    txItem: PaymentTransaction,
    decision: 'rejected' | 'requires_review',
    reason: string
  ) => {
    if (!isPaymentAdmin) return;
    if (decision === 'rejected' && reason.trim().length < 3) {
      notify('err', 'A rejection reason (at least 3 characters) is required.');
      return;
    }
    try {
      await updateDoc(doc(db, 'payment_transactions', txItem.id), {
        status: decision,
        reviewReason: reason.trim() || 'Marked for manual follow-up',
        reviewedBy: firebaseUser.uid,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (decision === 'rejected') {
        await addDoc(collection(db, 'notifications'), {
          uid: txItem.uid,
          type: 'payment_rejected',
          title: 'Payment Verification Rejected',
          body: `Your payment (${txItem.transactionRef}) was rejected: ${reason.trim()}`,
          read: false,
          createdAt: serverTimestamp(),
        });
      }

      await writeAuditLog(
        decision === 'rejected' ? 'payment_rejected' : 'payment_requires_review',
        'payment_transactions',
        txItem.id,
        reason.trim(),
        { status: txItem.status },
        { status: decision }
      );

      setRejectModalTx(null);
      setRejectReason('');
      notify('ok', `Payment ${txItem.transactionRef} updated to ${decision}.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Update failed.');
    }
  };

  const handleExtendSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendModalSub || !isPaymentAdmin) return;
    if (extendReason.trim().length < 3) {
      notify('err', 'A reason is required to extend a subscription.');
      return;
    }
    try {
      const base =
        new Date(extendModalSub.expiresAt).getTime() > Date.now()
          ? new Date(extendModalSub.expiresAt)
          : new Date();
      const nextExpiry = new Date(base.getTime() + extendDays * 24 * 60 * 60 * 1000).toISOString();
      const note = `${new Date().toISOString().slice(0, 10)}: +${extendDays}d (${extendReason.trim()})`;

      await updateDoc(doc(db, 'subscriptions', extendModalSub.uid), {
        plan: 'pro',
        status: 'active',
        expiresAt: nextExpiry,
        extensionNotes: [...(extendModalSub.extensionNotes || []), note].slice(-50),
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'users', extendModalSub.uid), {
        plan: 'pro',
        subscriptionStatus: 'active',
        subscriptionExpiresAt: nextExpiry,
        updatedAt: serverTimestamp(),
      }).catch(() => {});

      await addDoc(collection(db, 'notifications'), {
        uid: extendModalSub.uid,
        type: 'subscription_extended',
        title: 'Pro Subscription Extended',
        body: `Your Pro plan was extended by ${extendDays} days until ${nextExpiry.slice(0, 10)}. Reason: ${extendReason.trim()}`,
        read: false,
        createdAt: serverTimestamp(),
      });

      await writeAuditLog(
        'subscription_extended',
        'subscriptions',
        extendModalSub.uid,
        extendReason.trim(),
        { expiresAt: extendModalSub.expiresAt },
        { expiresAt: nextExpiry, addedDays: extendDays }
      );

      await apiFetch('/api/admin/sync-subscription', {
        method: 'POST',
        body: { targetUid: extendModalSub.uid, plan: 'pro', status: 'active', expiresAt: nextExpiry },
      }).catch(() => {});

      setExtendModalSub(null);
      setExtendReason('');
      notify('ok', `Extended subscription until ${nextExpiry.slice(0, 10)}.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Extension failed.');
    }
  };

  const handleSaveSystemSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPaymentAdmin) return;
    try {
      const before = { ...systemSettings };
      const normalizedPractice = {
        lessonsPerGroup: Math.max(1, Math.min(12, Number(settingsForm.practiceConfig?.lessonsPerGroup || 3))),
        passThresholdPercent: Math.max(30, Math.min(100, Number(settingsForm.practiceConfig?.passThresholdPercent || 60))),
        requirePassToUnlockNext: settingsForm.practiceConfig?.requirePassToUnlockNext ?? true,
        courseOverrides: settingsForm.practiceConfig?.courseOverrides || systemSettings.practiceConfig?.courseOverrides || {},
      };
      const nextPayload = {
        ...settingsForm,
        practiceConfig: normalizedPractice,
      };

      updatePracticeConfig(normalizedPractice);

      await apiFetch('/api/admin/sync-settings', {
        method: 'POST',
        body: nextPayload,
      }).catch(() => {});

      try {
        await setDoc(doc(db, 'system_settings', 'global'), {
          ...nextPayload,
          updatedBy: firebaseUser?.uid || 'admin',
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Fallback if remote Firestore Console rules haven't added practiceConfig key yet
        const { practiceConfig: _omit, ...coreFields } = nextPayload;
        await setDoc(doc(db, 'system_settings', 'global'), {
          ...coreFields,
          updatedBy: firebaseUser?.uid || 'admin',
          updatedAt: serverTimestamp(),
        }).catch(() => {});
      }

      await setDoc(
        doc(db, 'subscription_plans', 'pro'),
        {
          ...(plans.find((p) => p.id === 'pro') || SEED_PLANS[1]),
          priceIqd: Number(proPriceIqd),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      ).catch(() => {});

      await writeAuditLog(
        'system_settings_updated',
        'system_settings',
        'global',
        'Updated AI limits, Integrated Practice rules, Pro pricing, or studio flags',
        before as unknown as Record<string, unknown>,
        { ...nextPayload, proPriceIqd }
      );
      notify('ok', 'System settings, integrated practice rules, and Pro plan price updated.');
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to save settings.');
    }
  };

  const handleSavePaymentMethod = async (method: PaymentSetting) => {
    if (!isSuperAdmin) return;
    try {
      const before = paymentSettings.find((m) => m.id === method.id);
      await setDoc(doc(db, 'payment_settings', method.id), {
        ...method,
        updatedBy: firebaseUser.uid,
        updatedAt: serverTimestamp(),
      });
      await writeAuditLog(
        'payment_settings_updated',
        'payment_settings',
        method.id,
        `Updated ${method.name}`,
        before ? { accountNumber: before.accountNumber, enabled: before.enabled } : undefined,
        { accountNumber: method.accountNumber, enabled: method.enabled }
      );
      notify('ok', `Saved payment settings for ${method.name}.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to save payment method.');
    }
  };

  const handleAssignStaffRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin || !staffUidInput.trim() || !staffEmailInput.trim()) return;
    try {
      await setDoc(doc(db, 'admins', staffUidInput.trim()), {
        uid: staffUidInput.trim(),
        email: staffEmailInput.trim(),
        role: staffRoleInput,
        grantedBy: firebaseUser.uid,
        createdAt: serverTimestamp(),
      });
      await apiFetch('/api/admin/sync-role', {
        method: 'POST',
        body: { targetUid: staffUidInput.trim(), targetRole: staffRoleInput },
      }).catch(() => {});
      await writeAuditLog(
        'staff_role_assigned',
        'admins',
        staffUidInput.trim(),
        `Assigned ${staffRoleInput}`,
        undefined,
        { email: staffEmailInput.trim(), role: staffRoleInput }
      );
      setStaffUidInput('');
      setStaffEmailInput('');
      notify('ok', `Assigned role ${staffRoleInput}.`);
    } catch (err) {
      notify('err', err instanceof Error ? err.message : 'Failed to assign role.');
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const q = paymentSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      tx.userEmail.toLowerCase().includes(q) ||
      tx.transactionRef.toLowerCase().includes(q) ||
      tx.uid.toLowerCase().includes(q)
    );
  });

  const tabs: { id: AdminTab; label: string; visible: boolean }[] = [
    { id: 'lessons', label: t.admin.lessonsTab, visible: isStaff },
    { id: 'courses', label: locale === 'ckb' ? 'کەتەگۆری و کۆرسەکان' : locale === 'kmr' ? 'کەتەگۆری و کۆرس' : locale === 'ar' ? 'التصنيفات والدورات' : 'Categories & Courses', visible: isStaff },
    { id: 'challenge', label: locale === 'ckb' ? '⚡ پرسیاری ڕۆژ' : locale === 'kmr' ? '⚡ پرسیارا ڕۆژێ' : locale === 'ar' ? '⚡ تحدي اليوم' : '⚡ Daily Challenge', visible: isStaff },
    { id: 'studio', label: t.admin.studioTab, visible: isStaff },
    { id: 'discovery', label: DISCOVERY_COPY[locale].admin.tabLabel, visible: isStaff },
    { id: 'maintenance', label: locale === 'ckb' ? '🛠️ دۆخی چاکسازی' : locale === 'kmr' ? '🛠️ دەلیڤێ چاکسازیێ' : locale === 'ar' ? '🛠️ وضع الصيانة' : '🛠️ Maintenance Mode', visible: isPaymentAdmin },
    { id: 'payments', label: t.admin.paymentsTab, visible: isPaymentAdmin },
    { id: 'settings', label: t.admin.settingsTab, visible: isPaymentAdmin },
    { id: 'audit', label: t.admin.auditTab, visible: isSuperAdmin },
  ];

  return (
    <div>
      <section className="kj-hero-band">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="text-start">
              <div className="kj-eyebrow">
                <span className="kj-eyebrow-dot" />
                <span>
                  Role: <span className="font-mono">{staffRole}</span> · {firebaseUser.email}
                </span>
              </div>
              <h1 className="mt-1.5 text-2xl font-extrabold text-[var(--kj-ink)]">{t.admin.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isPaymentAdmin && (
                <button
                  type="button"
                  onClick={() => setTab('maintenance')}
                  className={`inline-flex items-center gap-1.5 rounded-[6px] border px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    systemSettings.maintenance?.enabled
                      ? 'border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20'
                      : (systemSettings.maintenance?.lockedTabs?.length || 0) > 0
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                      : 'border-[var(--kj-border-strong)] bg-[var(--kj-card)] text-[var(--kj-ink)] hover:bg-[var(--kj-elevated)]'
                  }`}
                >
                  <Wrench className="h-3.5 w-3.5" />
                  <span>
                    {systemSettings.maintenance?.enabled
                      ? pickLoc(locale, {
                          ckb: 'چاکسازی گشتی چالاکە 🚨',
                          kmr: 'چاکسازییا گشتی چالاکە 🚨',
                          ar: 'الصيانة العامة نشطة 🚨',
                          en: 'Global Maintenance Active 🚨',
                        })
                      : (systemSettings.maintenance?.lockedTabs?.length || 0) > 0
                      ? pickLoc(locale, {
                          ckb: `چاکسازی (${systemSettings.maintenance?.lockedTabs?.length}) بەش 🛠️`,
                          kmr: `چاکسازی (${systemSettings.maintenance?.lockedTabs?.length}) بەش 🛠️`,
                          ar: `صيانة (${systemSettings.maintenance?.lockedTabs?.length}) أقسام 🛠️`,
                          en: `Maintenance (${systemSettings.maintenance?.lockedTabs?.length}) Tabs 🛠️`,
                        })
                      : pickLoc(locale, {
                          ckb: 'دۆخی چاکسازی (Maintenance)',
                          kmr: 'دۆخێ چاکسازیێ (Maintenance)',
                          ar: 'وضع الصيانة (Maintenance)',
                          en: 'Maintenance Mode',
                        })}
                  </span>
                </button>
              )}
              <Button variant="secondary" size="sm" disabled={seeding} onClick={() => void handleSeedFirestore()}>
                <Database className="h-4 w-4" />
                <span>{seeding ? t.common.loading : t.admin.seedFirestore}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
        {/* Role-Restricted Tab Switcher */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          {tabs
            .filter((x) => x.visible)
            .map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-[6px] border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  tab === item.id
                    ? 'kj-btn-primary border-transparent'
                    : 'border-[var(--kj-border)] bg-[var(--kj-card)] text-[var(--kj-muted-2)] hover:bg-[var(--kj-soft)] hover:text-[var(--kj-ink)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          {!isPaymentAdmin && (
            <span className="ms-2 text-xs text-[var(--kj-muted)]">
              {t.admin.editorPaymentsBlocked}
            </span>
          )}
        </div>

      {banner && (
        <div
          className={`mb-6 rounded-xl border p-3.5 text-xs ${
            banner.type === 'ok'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
              : 'border-red-300 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300'
          }`}
        >
          {banner.text}
        </div>
      )}

      {/* ==================== PHASE 5: DISCOVERY CMS ==================== */}
      {tab === 'discovery' && <AdminDiscoveryPanel onAudit={writeAuditLog} onBanner={notify} />}

      {/* ==================== DAILY CODE CHALLENGE CMS ==================== */}
      {tab === 'challenge' && <AdminDailyChallengePanel />}

      {/* ==================== MAINTENANCE HUB ==================== */}
      {tab === 'maintenance' && <AdminMaintenancePanel onAudit={writeAuditLog} onBanner={notify} />}

      {/* ==================== CATEGORIES & COURSES CMS ==================== */}
      {tab === 'courses' && <AdminCoursesPanel onAudit={writeAuditLog} onBanner={notify} />}

      {/* ==================== TAB 1: MANUAL LESSONS CMS ==================== */}
      {tab === 'lessons' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Surface className="p-6 lg:col-span-7">
            <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-white">
              Create / Edit Lesson Manually
            </h2>
            <form onSubmit={handleSaveManualLesson} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <input
                  type="text"
                  value={lessonId}
                  onChange={(e) => setLessonId(e.target.value)}
                  placeholder="slug (e.g. html-4-links)"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
                <select
                  value={lessonCourse}
                  onChange={(e) => setLessonCourse(e.target.value as TrackId)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {cleanTitle(c.titles[locale] || c.titles.en || c.id.toUpperCase())} ({c.id})
                    </option>
                  ))}
                </select>
                <select
                  value={lessonDifficulty}
                  onChange={(e) => setLessonDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={lessonOrder}
                  onChange={(e) => setLessonOrder(Number(e.target.value))}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  value={lessonTitleEn}
                  onChange={(e) => setLessonTitleEn(e.target.value)}
                  placeholder="English Title *"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
                <input
                  type="text"
                  dir="rtl"
                  value={lessonTitleAr}
                  onChange={(e) => setLessonTitleAr(e.target.value)}
                  placeholder={pickLoc(locale, {
                    ckb: 'ناونیشانی عەرەبی',
                    kmr: 'ناڤونیشانێ عەرەبی',
                    ar: 'العنوان بالعربية',
                    en: 'Arabic Title',
                  })}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
                <input
                  type="text"
                  dir="rtl"
                  value={lessonTitleCkb}
                  onChange={(e) => setLessonTitleCkb(e.target.value)}
                  placeholder={pickLoc(locale, {
                    ckb: 'ناونیشانی کوردی سۆرانی',
                    kmr: 'ناڤونیشانێ کوردی سۆرانی',
                    ar: 'العنوان بالكردية السورانية',
                    en: 'Kurdish Sorani Title',
                  })}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
                <input
                  type="text"
                  dir="rtl"
                  value={lessonTitleKmr}
                  onChange={(e) => setLessonTitleKmr(e.target.value)}
                  placeholder={pickLoc(locale, {
                    ckb: 'ناونیشانی کوردی بادینی',
                    kmr: 'ناڤونیشانێ کوردی بادینی',
                    ar: 'العنوان بالكردية البادينية',
                    en: 'Kurdish Badini Title',
                  })}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
              </div>

              <textarea
                rows={2}
                value={lessonIntroEn}
                onChange={(e) => setLessonIntroEn(e.target.value)}
                placeholder="Intro paragraph"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
              />
              <textarea
                rows={3}
                value={lessonExplanationEn}
                onChange={(e) => setLessonExplanationEn(e.target.value)}
                placeholder="Core technical explanation"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <textarea
                  dir="ltr"
                  rows={3}
                  value={lessonSyntax}
                  onChange={(e) => setLessonSyntax(e.target.value)}
                  placeholder="Syntax snippet"
                  className="rounded-lg border border-slate-300 bg-white p-2.5 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
                <textarea
                  dir="ltr"
                  rows={3}
                  value={lessonHtml}
                  onChange={(e) => setLessonHtml(e.target.value)}
                  placeholder="Shared HTML code"
                  className="rounded-lg border border-slate-300 bg-white p-2.5 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
                <textarea
                  dir="ltr"
                  rows={2}
                  value={lessonCss}
                  onChange={(e) => setLessonCss(e.target.value)}
                  placeholder="Shared CSS code"
                  className="rounded-lg border border-slate-300 bg-white p-2.5 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
                <textarea
                  dir="ltr"
                  rows={2}
                  value={lessonJs}
                  onChange={(e) => setLessonJs(e.target.value)}
                  placeholder="Shared JS code"
                  className="rounded-lg border border-slate-300 bg-white p-2.5 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={lessonPublished}
                    onChange={(e) => setLessonPublished(e.target.checked)}
                  />
                  <span>Publish immediately</span>
                </label>
                <Button type="submit" size="sm">
                  {t.common.save}
                </Button>
              </div>
            </form>
          </Surface>

          <Surface className="p-6 lg:col-span-5">
            <h2 className="mb-3 text-base font-semibold text-slate-950 dark:text-white">
              Published Catalog ({lessons.length})
            </h2>
            <div className="max-h-[480px] space-y-2 overflow-y-auto">
              {lessons.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-[#2b3442]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">
                      {l.translations.en.title}
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      {l.courseId.toUpperCase()} · {l.id}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLessonId(l.id);
                      setLessonCourse(l.courseId);
                      setLessonOrder(l.order);
                      setLessonDifficulty(l.difficulty);
                      setLessonTitleEn(l.translations.en.title);
                      setLessonTitleAr(l.translations.ar.title);
                      setLessonTitleCkb(l.translations.ckb.title);
                      setLessonTitleKmr(l.translations.kmr.title);
                      setLessonIntroEn(l.translations.en.intro);
                      setLessonExplanationEn(l.translations.en.explanation);
                      setLessonSyntax(l.sharedCode.syntax);
                      setLessonHtml(l.sharedCode.html);
                      setLessonCss(l.sharedCode.css);
                      setLessonJs(l.sharedCode.js);
                    }}
                  >
                    {t.common.edit}
                  </Button>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      )}

      {/* ==================== TAB 2: AI CONTENT STUDIO (PHASE 3) ==================== */}
      {tab === 'studio' && (
        <div className="space-y-6">
          <Surface className="p-6">
            <h2 className="mb-1 text-base font-semibold text-slate-950 dark:text-white">
              KARÊJAN AI Content Studio
            </h2>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Strict Zod JSON pipeline (up to 2 retries) · Identical shared code across languages · 2nd-pass Gemini QA + JS sandbox check · Drafts never auto-publish unless explicitly enabled in settings (currently {systemSettings.autoPublishAfterValidation ? 'ON' : 'OFF'}).
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Language Track</label>
                <select
                  value={studioTrack}
                  onChange={(e) => setStudioTrack(e.target.value as TrackId)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {cleanTitle(c.titles[locale] || c.titles.en || c.id.toUpperCase())} ({c.id})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Difficulty</label>
                <select
                  value={studioDifficulty}
                  onChange={(e) => setStudioDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-medium">Lessons (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={studioCount}
                    onChange={(e) => setStudioCount(Math.min(5, Math.max(1, Number(e.target.value))))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Depth</label>
                  <select
                    value={studioDepth}
                    onChange={(e) => setStudioDepth(e.target.value as 'concise' | 'standard' | 'deep')}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                  >
                    <option value="concise">Concise</option>
                    <option value="standard">Standard</option>
                    <option value="deep">Deep</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={studioTopic}
                onChange={(e) => setStudioTopic(e.target.value)}
                placeholder="Topic (e.g., JavaScript Event Delegation & Bubbling) *"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
              />
              <input
                type="text"
                value={studioTitle}
                onChange={(e) => setStudioTitle(e.target.value)}
                placeholder="Optional exact lesson title"
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-600 dark:text-slate-300">Languages:</span>
                  {(['ckb', 'kmr', 'ar', 'en'] as Locale[]).map((loc) => (
                    <label key={loc} className="inline-flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={studioLangs.includes(loc)}
                        onChange={(e) => {
                          if (e.target.checked) setStudioLangs([...studioLangs, loc]);
                          else if (studioLangs.length > 1) setStudioLangs(studioLangs.filter((x) => x !== loc));
                        }}
                      />
                      <span className="uppercase">{loc}</span>
                    </label>
                  ))}
                </div>

                <label className="inline-flex items-center gap-1.5">
                  <input type="checkbox" checked={studioExercises} onChange={(e) => setStudioExercises(e.target.checked)} />
                  <span>Exercises</span>
                </label>
                <label className="inline-flex items-center gap-1.5">
                  <input type="checkbox" checked={studioQuiz} onChange={(e) => setStudioQuiz(e.target.checked)} />
                  <span>Quiz</span>
                </label>
                <label className="inline-flex items-center gap-1.5">
                  <input type="checkbox" checked={studioProject} onChange={(e) => setStudioProject(e.target.checked)} />
                  <span>Practical Project</span>
                </label>
              </div>

              <Button
                variant="violet"
                disabled={generating || !studioTopic.trim()}
                onClick={() => void handleGenerateStudio(false)}
              >
                <Sparkles className="h-4 w-4" />
                <span>{generating ? t.common.loading : t.admin.generateBtn}</span>
              </Button>
            </div>
          </Surface>

          {/* Draft Review Queue */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Surface className="p-5 lg:col-span-7">
              <h3 className="mb-3 text-sm font-semibold text-slate-950 dark:text-white">
                Generated Lesson Drafts ({drafts.length})
              </h3>
              {drafts.length === 0 ? (
                <p className="text-xs text-slate-500">No unpublished drafts yet.</p>
              ) : (
                <div className="space-y-3">
                  {drafts.map((d) => {
                    const title = d.translations.en?.title || Object.values(d.translations)[0]?.title || d.id;
                    return (
                      <div
                        key={d.id}
                        className="rounded-lg border border-slate-200 p-3.5 dark:border-[#2b3442]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
                            <p className="text-xs text-slate-500">
                              {d.courseId.toUpperCase()} · {d.difficulty} · status: <span className="font-mono">{d.status}</span>
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setEditingDraft(d);
                                setEditLocale('en');
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Review / Edit</span>
                            </Button>
                            {d.status !== 'published' && (
                              <Button size="sm" onClick={() => void publishDraft(d)}>
                                Publish
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => void rejectAndDeleteDraft(d.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        {d.validationReport && d.validationReport.issues.length > 0 && (
                          <div className="mt-2 rounded border border-amber-300 bg-amber-50 p-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                            <p className="font-semibold">Flagged for Admin Review:</p>
                            <ul className="list-disc ps-4">
                              {d.validationReport.issues.map((iss, idx) => (
                                <li key={idx}>{iss}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Surface>

            {/* Generation History */}
            <Surface className="p-5 lg:col-span-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-950 dark:text-white">
                Generation Job History ({jobs.length})
              </h3>
              <div className="max-h-[420px] space-y-2 overflow-y-auto">
                {jobs.map((j) => (
                  <div
                    key={j.id}
                    className="rounded-lg border border-slate-200 p-3 text-xs dark:border-[#2b3442]"
                  >
                    <p className="font-semibold text-slate-900 dark:text-white">{j.topic}</p>
                    <p className="text-slate-500">
                      {j.languageTrack.toUpperCase()} · {j.count} lesson(s) · {j.status} · attempts: {j.attempts}
                    </p>
                    {j.errors && j.errors.length > 0 && (
                      <p className="mt-1 text-red-600 dark:text-red-400">{j.errors[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            </Surface>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: PAYMENTS & SUBSCRIPTIONS (ADMIN / SUPER ADMIN ONLY) ==================== */}
      {tab === 'payments' && isPaymentAdmin && (
        <div className="space-y-6">
          <Surface className="p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Manual Payment Requests ({filteredTransactions.length})
              </h2>
              <input
                type="search"
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                placeholder="Search by user email or reference..."
                className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs dark:border-[#344154] dark:bg-[#10141c]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 dark:border-[#2b3442] dark:text-slate-400">
                    <th className="py-2 text-start">User</th>
                    <th className="py-2 text-start">Method</th>
                    <th className="py-2 text-start">Reference</th>
                    <th className="py-2 text-start">Amount</th>
                    <th className="py-2 text-start">Status</th>
                    <th className="py-2 text-start">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#2b3442]">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-2.5">
                        <p className="font-medium text-slate-900 dark:text-white">{tx.userEmail}</p>
                        <p className="font-mono text-[11px] text-slate-500">{tx.paymentDate}</p>
                      </td>
                      <td className="py-2.5 uppercase">{tx.methodId.replace('_', ' ')}</td>
                      <td className="py-2.5 font-mono">{tx.transactionRef}</td>
                      <td className="py-2.5 font-mono tabular-nums">{tx.amountIqd.toLocaleString()} IQD</td>
                      <td className="py-2.5 font-medium">{tx.status.replace('_', ' ')}</td>
                      <td className="py-2.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Button size="sm" variant="secondary" onClick={() => setReceiptModalTx(tx)}>
                            <Eye className="h-3.5 w-3.5" />
                            <span>Receipt</span>
                          </Button>
                          {(tx.status === 'pending' || tx.status === 'requires_review') && (
                            <>
                              <Button size="sm" onClick={() => void handleApprovePayment(tx)}>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>{t.admin.approve}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => {
                                  setRejectModalTx(tx);
                                  setRejectReason('');
                                }}
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>{t.admin.reject}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  void handleRejectOrFlagPayment(tx, 'requires_review', 'Flagged for secondary check')
                                }
                              >
                                <AlertTriangle className="h-3.5 w-3.5" />
                                <span>{t.admin.requiresReview}</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>

          {/* Active & Expired Subscriptions */}
          <Surface className="p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Subscriptions ({subscriptions.length})
              </h2>
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  const res = await apiFetch<{ downgradedCount: number }>('/api/admin/run-expiry-check', {
                    method: 'POST',
                  }).catch(() => ({ downgradedCount: 0 }));
                  notify('ok', `Expiry sweep complete. Downgraded ${res.downgradedCount} expired user(s).`);
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Run Expiry Check</span>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 dark:border-[#2b3442] dark:text-slate-400">
                    <th className="py-2 text-start">User</th>
                    <th className="py-2 text-start">Plan</th>
                    <th className="py-2 text-start">Status</th>
                    <th className="py-2 text-start">Expires</th>
                    <th className="py-2 text-start">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#2b3442]">
                  {subscriptions.map((sub) => (
                    <tr key={sub.uid}>
                      <td className="py-2.5">{sub.userEmail || sub.uid}</td>
                      <td className="py-2.5 uppercase font-semibold">{sub.plan}</td>
                      <td className="py-2.5">{sub.status}</td>
                      <td className="py-2.5 font-mono tabular-nums">{sub.expiresAt.slice(0, 10)}</td>
                      <td className="py-2.5">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setExtendModalSub(sub);
                            setExtendDays(30);
                            setExtendReason('');
                          }}
                        >
                          {t.admin.extendSub}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Surface>
        </div>
      )}

      {/* ==================== TAB 4: PLANS, SYSTEM & PAYMENT SETTINGS ==================== */}
      {tab === 'settings' && isPaymentAdmin && (
        <div className="space-y-6">
          <Surface className="p-6">
            <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-white">
              System Limits, Fair-Use & Plan Pricing
            </h2>
            <form onSubmit={handleSaveSystemSettings} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Free Daily AI Limit</label>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={settingsForm.freeDailyAiLimit}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, freeDailyAiLimit: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Pro Fair-Use Req / Minute</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={settingsForm.proPerMinuteLimit}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, proPerMinuteLimit: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Pro Max Message Length</label>
                <input
                  type="number"
                  min={200}
                  max={20000}
                  value={settingsForm.proMaxMessageLength}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, proMaxMessageLength: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Daily Studio Job Cap</label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={settingsForm.dailyGenerationJobCap}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, dailyGenerationJobCap: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">Pro Monthly Price (IQD)</label>
                <input
                  type="number"
                  min={0}
                  max={10000000}
                  value={proPriceIqd}
                  onChange={(e) => setProPriceIqd(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="inline-flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={settingsForm.autoPublishAfterValidation}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, autoPublishAfterValidation: e.target.checked })
                    }
                  />
                  <span>Auto-publish after validation (OFF by default)</span>
                </label>
              </div>

              {/* Integrated Practice & Assessment Global Settings */}
              <div className="sm:col-span-3 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.04] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-xs font-bold text-slate-900 dark:text-white">
                    {pickLoc(locale, {
                      ckb: 'ڕێکخستنی سیستەمی ڕاهێنان و تاقیکردنەوەی گڕوپەکان (Integrated Practice)',
                      kmr: 'Rêkxistina Sîstema Rahênan û Ezmûnên Koman (Integrated Practice)',
                      ar: 'إعدادات التدريب والتقييم المدمج بين الدروس',
                      en: 'Integrated Practice & Assessment Rules (Global Default)',
                    })}
                  </strong>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    {pickLoc(locale, {
                      ckb: `هەر ${settingsForm.practiceConfig?.lessonsPerGroup ?? 3} وانە جارێک تاقیکردنەوە`,
                      kmr: `Her ${settingsForm.practiceConfig?.lessonsPerGroup ?? 3} waneyan carekê ezmûn`,
                      ar: `تقييم كل ${settingsForm.practiceConfig?.lessonsPerGroup ?? 3} دروس`,
                      en: `Assessment every ${settingsForm.practiceConfig?.lessonsPerGroup ?? 3} lessons`,
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      {pickLoc(locale, {
                        ckb: 'ژمارەی وانەکان لە نێوان تاقیکردنەوەکان',
                        kmr: 'Hejmara waneyan di navbera ezmûnan de',
                        ar: 'عدد الدروس قبل كل تقييم',
                        en: 'Lessons Between Assessments',
                      })}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={settingsForm.practiceConfig?.lessonsPerGroup ?? 3}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          practiceConfig: {
                            ...DEFAULT_PRACTICE,
                            ...(settingsForm.practiceConfig || {}),
                            lessonsPerGroup: Math.max(1, Math.min(12, Number(e.target.value) || 3)),
                          },
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      {pickLoc(locale, {
                        ckb: 'کەمترین نمرەی دەرچوون (%)',
                        kmr: 'Kêmtirîn pûana derbasbûnê (%)',
                        ar: 'نسبة النجاح المطلوبة (%)',
                        en: 'Pass Threshold (%)',
                      })}
                    </label>
                    <input
                      type="number"
                      min={30}
                      max={100}
                      value={settingsForm.practiceConfig?.passThresholdPercent ?? 60}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          practiceConfig: {
                            ...DEFAULT_PRACTICE,
                            ...(settingsForm.practiceConfig || {}),
                            passThresholdPercent: Math.max(30, Math.min(100, Number(e.target.value) || 60)),
                          },
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                    />
                  </div>

                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsForm.practiceConfig?.requirePassToUnlockNext ?? true}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            practiceConfig: {
                              ...DEFAULT_PRACTICE,
                              ...(settingsForm.practiceConfig || {}),
                              requirePassToUnlockNext: e.target.checked,
                            },
                          })
                        }
                      />
                      <span>
                        {pickLoc(locale, {
                          ckb: 'مەرجی دەرچوون بۆ کردنەوەی گڕوپی داهاتوو',
                          kmr: 'Mercê derbasbûnê bo vekirina koma bê',
                          ar: 'اشتراط النجاح لفتح المجموعة التالية',
                          en: 'Require pass to unlock next group',
                        })}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <Button type="submit" size="sm">
                  Save System Settings
                </Button>
              </div>
            </form>
          </Surface>

          {/* Payment Methods (SUPER ADMIN ONLY) */}
          <Surface className="p-6">
            <h2 className="mb-1 text-base font-semibold text-slate-950 dark:text-white">
              Manual Payment Methods (FIB · Qi Card · ZainCash)
            </h2>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              {t.admin.superAdminOnlySettings}
            </p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {paySettingsForm.map((method, idx) => (
                <div
                  key={method.id}
                  className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-[#2b3442]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{method.name}</span>
                    <label className="inline-flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        disabled={!isSuperAdmin}
                        checked={method.enabled}
                        onChange={(e) => {
                          const next = [...paySettingsForm];
                          next[idx] = { ...method, enabled: e.target.checked };
                          setPaySettingsForm(next);
                        }}
                      />
                      <span>Enabled</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={!isSuperAdmin}
                    dir="ltr"
                    value={method.accountNumber}
                    onChange={(e) => {
                      const next = [...paySettingsForm];
                      next[idx] = { ...method, accountNumber: e.target.value };
                      setPaySettingsForm(next);
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                  />
                  {(['en', 'ar', 'ckb', 'kmr'] as Locale[]).map((loc) => (
                    <textarea
                      key={loc}
                      rows={2}
                      disabled={!isSuperAdmin}
                      dir={loc === 'en' ? 'ltr' : 'rtl'}
                      value={method.instructions[loc] || ''}
                      onChange={(e) => {
                        const next = [...paySettingsForm];
                        next[idx] = {
                          ...method,
                          instructions: { ...method.instructions, [loc]: e.target.value },
                        };
                        setPaySettingsForm(next);
                      }}
                      placeholder={`Instructions (${loc})`}
                      className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                    />
                  ))}
                  {isSuperAdmin && (
                    <Button size="sm" onClick={() => void handleSavePaymentMethod(method)}>
                      Save {method.id.toUpperCase()}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Surface>

          {/* Staff Roles (Super Admin Only) */}
          {isSuperAdmin && (
            <Surface className="p-6">
              <h2 className="mb-3 text-base font-semibold text-slate-950 dark:text-white">
                Assign Staff Role (Super Admin Only)
              </h2>
              <form onSubmit={handleAssignStaffRole} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <input
                  type="text"
                  required
                  value={staffUidInput}
                  onChange={(e) => setStaffUidInput(e.target.value)}
                  placeholder="User UID"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
                <input
                  type="email"
                  required
                  value={staffEmailInput}
                  onChange={(e) => setStaffEmailInput(e.target.value)}
                  placeholder="User Email"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                />
                <select
                  value={staffRoleInput}
                  onChange={(e) => setStaffRoleInput(e.target.value as 'editor' | 'admin' | 'super_admin')}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                >
                  <option value="editor">Editor (Lessons & Studio only)</option>
                  <option value="admin">Admin (Payments + Lessons)</option>
                  <option value="super_admin">Super Admin (Full access)</option>
                </select>
                <Button type="submit" size="sm">
                  Assign Role
                </Button>
              </form>
            </Surface>
          )}
        </div>
      )}

      {/* ==================== TAB 5: APPEND-ONLY AUDIT LOGS (SUPER ADMIN ONLY) ==================== */}
      {tab === 'audit' && isSuperAdmin && (
        <Surface className="p-6">
          <h2 className="mb-1 text-base font-semibold text-slate-950 dark:text-white">
            Admin Audit Logs ({auditLogs.length})
          </h2>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
            {t.admin.superAdminOnlyAudit}
          </p>
          <div className="space-y-2.5">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-lg border border-slate-200 p-3 text-xs dark:border-[#2b3442]"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono font-semibold text-blue-700 dark:text-blue-400">
                    {log.action}
                  </span>
                  <span className="text-slate-500">
                    {log.actorEmail} ({log.actorRole}) → {log.targetCollection}/{log.targetId}
                  </span>
                </div>
                {log.reason && <p className="mt-1 text-slate-700 dark:text-slate-300">Reason: {log.reason}</p>}
                {(log.before || log.after) && (
                  <pre dir="ltr" className="mt-2 overflow-x-auto rounded kj-code-window p-2 font-mono text-[11px]">
                    {JSON.stringify({ before: log.before, after: log.after })}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </Surface>
      )}

      {/* RECEIPT VIEWER MODAL */}
      <Modal
        open={Boolean(receiptModalTx)}
        onClose={() => setReceiptModalTx(null)}
        title={`Receipt · ${receiptModalTx?.transactionRef || ''}`}
        maxWidthClass="max-w-xl"
      >
        {receiptModalTx && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              {receiptModalTx.userEmail} · {receiptModalTx.methodId.toUpperCase()} ·{' '}
              {receiptModalTx.amountIqd.toLocaleString()} IQD · {receiptModalTx.paymentDate}
            </p>
            {receiptModalTx.receiptPreviewUrl ? (
              <img
                src={receiptModalTx.receiptPreviewUrl}
                alt={`Payment receipt ${receiptModalTx.transactionRef}`}
                referrerPolicy="no-referrer"
                className="max-h-[420px] w-full rounded-lg border border-slate-200 object-contain dark:border-[#2b3442]"
              />
            ) : (
              <p className="rounded-lg border border-slate-200 p-4 font-mono text-slate-500 dark:border-[#2b3442]">
                Private Storage path: {receiptModalTx.receiptPath}
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* REJECT REASON MODAL */}
      <Modal
        open={Boolean(rejectModalTx)}
        onClose={() => setRejectModalTx(null)}
        title="Reject Payment Request"
      >
        {rejectModalTx && (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Provide a clear rejection reason for {rejectModalTx.userEmail} ({rejectModalTx.transactionRef}):
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Receipt amount does not match 10,000 IQD or reference unreadable."
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs dark:border-[#344154] dark:bg-[#10141c]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setRejectModalTx(null)}>
                {t.common.cancel}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => void handleRejectOrFlagPayment(rejectModalTx, 'rejected', rejectReason)}
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MANUAL SUBSCRIPTION EXTENSION MODAL */}
      <Modal
        open={Boolean(extendModalSub)}
        onClose={() => setExtendModalSub(null)}
        title="Manually Extend Subscription"
      >
        {extendModalSub && (
          <form onSubmit={handleExtendSubscription} className="space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Extending {extendModalSub.userEmail || extendModalSub.uid} (current expiry:{' '}
              {extendModalSub.expiresAt.slice(0, 10)})
            </p>
            <div>
              <label className="mb-1 block text-xs font-medium">Days to Add</label>
              <input
                type="number"
                min={1}
                max={365}
                value={extendDays}
                onChange={(e) => setExtendDays(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Required Reason</label>
              <textarea
                rows={2}
                required
                minLength={3}
                value={extendReason}
                onChange={(e) => setExtendReason(e.target.value)}
                placeholder="Explain why this subscription is being extended..."
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs dark:border-[#344154] dark:bg-[#10141c]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setExtendModalSub(null)}>
                {t.common.cancel}
              </Button>
              <Button type="submit" size="sm">
                Apply Extension
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* DRAFT REVIEW & INLINE TRANSLATION EDITOR MODAL */}
      <Modal
        open={Boolean(editingDraft)}
        onClose={() => setEditingDraft(null)}
        title="Review & Edit AI Draft"
        maxWidthClass="max-w-3xl"
      >
        {editingDraft && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {(['en', 'ar', 'ckb', 'kmr'] as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setEditLocale(loc)}
                    className={`rounded-md px-2.5 py-1 font-semibold uppercase cursor-pointer ${
                      editLocale === loc
                        ? 'kj-btn-primary'
                        : 'bg-slate-100 text-slate-700 dark:bg-[#202938] dark:text-slate-300'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => void regenerateDraftSection('explanation')}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Regenerate Explanation</span>
                </Button>
                <Button size="sm" onClick={() => void publishDraft(editingDraft)}>
                  Approve & Publish
                </Button>
              </div>
            </div>

            {editingDraft.translations[editLocale] ? (
              <div className="space-y-3" dir={editLocale === 'en' ? 'ltr' : 'rtl'}>
                <input
                  type="text"
                  value={editingDraft.translations[editLocale]!.title}
                  onChange={(e) => {
                    const curr = editingDraft.translations[editLocale]!;
                    setEditingDraft({
                      ...editingDraft,
                      translations: {
                        ...editingDraft.translations,
                        [editLocale]: { ...curr, title: e.target.value },
                      },
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold dark:border-[#344154] dark:bg-[#10141c]"
                />
                <textarea
                  rows={2}
                  value={editingDraft.translations[editLocale]!.intro}
                  onChange={(e) => {
                    const curr = editingDraft.translations[editLocale]!;
                    setEditingDraft({
                      ...editingDraft,
                      translations: {
                        ...editingDraft.translations,
                        [editLocale]: { ...curr, intro: e.target.value },
                      },
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 dark:border-[#344154] dark:bg-[#10141c]"
                />
                <textarea
                  rows={4}
                  value={editingDraft.translations[editLocale]!.explanation}
                  onChange={(e) => {
                    const curr = editingDraft.translations[editLocale]!;
                    setEditingDraft({
                      ...editingDraft,
                      translations: {
                        ...editingDraft.translations,
                        [editLocale]: { ...curr, explanation: e.target.value },
                      },
                    });
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 dark:border-[#344154] dark:bg-[#10141c]"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      await updateDoc(doc(db, 'generated_lessons', editingDraft.id), {
                        translations: editingDraft.translations,
                        updatedAt: serverTimestamp(),
                      });
                      notify('ok', `Saved edits for ${editLocale.toUpperCase()}.`);
                    }}
                  >
                    Save Draft Edits
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-slate-500">No translation generated for {editLocale.toUpperCase()}.</p>
            )}

            <div dir="ltr">
              <p className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
                Shared Untranslated Code (identical across all languages)
              </p>
              <pre className="max-h-48 overflow-auto rounded-lg kj-code-window p-3 font-mono text-[11px]">
                {editingDraft.sharedCode.syntax}
                {'\n\n'}
                {editingDraft.sharedCode.html || editingDraft.sharedCode.css || editingDraft.sharedCode.js}
              </pre>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </div>
  );
};
