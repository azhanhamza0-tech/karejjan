import React, { useEffect, useMemo, useState } from 'react';
import { Clock, CheckCircle2, XCircle, Lock, HelpCircle, PlayCircle, Search, Filter } from 'lucide-react';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { apiFetch, ApiError } from '../lib/api';
import { useApp } from '../context/AppContext';
import { pickLoc } from '../i18n/translations';
import { cleanTitle } from '../i18n/translations';
import type { PublicExercise, PublicQuiz } from '../types/domain';
import { Button, Surface } from './ui/Primitives';

interface GradeResult {
  isCorrect: boolean;
  feedback: string;
}

interface QuizResultPayload {
  quizId: string;
  quizType: 'lesson_quiz' | 'course_exam' | 'practice_test' | 'timed_exam';
  courseId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  timedOut: boolean;
  recommendedLessonIds: string[];
  results: Array<{
    questionId: string;
    selectedOptionIndex: number | null;
    correctOptionIndex: number;
    isCorrect: boolean;
    explanation: string;
    lessonId: string;
  }>;
}

export const PracticeView: React.FC = () => {
  const {
    locale,
    t,
    firebaseUser,
    setAuthModalOpen,
    effectivePlan,
    staffRole,
    exercises,
    quizzes,
    lessons,
    setActiveLessonId,
    setActiveView,
    recordQuizAttempt,
  } = useApp();

  const [tab, setTab] = useState<'exercises' | 'quizzes'>('exercises');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const TRACK_FILTER_OPTIONS = [
    { id: 'all', label: pickLoc(locale, { ckb: 'هەموو زمانەکان', kmr: 'هەمی زمان', ar: 'جميع المسارات', en: 'All Tracks' }) },
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'js', label: 'JavaScript' },
    { id: 'react', label: 'React' },
    { id: 'python', label: 'Python' },
    { id: 'cpp', label: 'C++' },
    { id: 'tsx', label: 'TSX' },
    { id: 'vite', label: 'Vite' },
  ];

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      if (selectedTrack !== 'all' && ex.courseId !== selectedTrack) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const loc = ex.translations[locale] || ex.translations.en;
        return (
          ex.id.toLowerCase().includes(q) ||
          ex.courseId.toLowerCase().includes(q) ||
          (loc.prompt && loc.prompt.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [exercises, selectedTrack, searchQuery, locale]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((qz) => {
      if (selectedTrack !== 'all' && qz.courseId !== selectedTrack) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = qz.titles[locale] || qz.titles.en;
        return (
          qz.id.toLowerCase().includes(q) ||
          qz.courseId.toLowerCase().includes(q) ||
          title.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [quizzes, selectedTrack, searchQuery, locale]);

  // Exercise states
  const [exAnswers, setExAnswers] = useState<Record<string, string>>({});
  const [exHintsOpen, setExHintsOpen] = useState<Record<string, boolean>>({});
  const [exResults, setExResults] = useState<Record<string, GradeResult>>({});
  const [exError, setExError] = useState<Record<string, string>>({});
  const [exSubmitting, setExSubmitting] = useState<string | null>(null);

  // Active Quiz / Timed Exam states
  const [activeQuiz, setActiveQuiz] = useState<PublicQuiz | null>(null);
  const [orderedQuestionIds, setOrderedQuestionIds] = useState<string[]>([]);
  const [examSessionId, setExamSessionId] = useState<string | null>(null);
  const [examExpiresAtMs, setExamExpiresAtMs] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<QuizResultPayload | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizBusy, setQuizBusy] = useState(false);

  const hasProAccess = effectivePlan === 'pro' || staffRole !== 'user';

  // Live countdown ticker synced to server expiresAt
  useEffect(() => {
    if (!examExpiresAtMs || quizResult) {
      setSecondsLeft(null);
      return;
    }
    const tick = () => {
      const rem = Math.max(0, Math.ceil((examExpiresAtMs - Date.now()) / 1000));
      setSecondsLeft(rem);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [examExpiresAtMs, quizResult]);

  const submitExercise = async (ex: PublicExercise) => {
    if (!firebaseUser) {
      setAuthModalOpen(true);
      return;
    }
    const answer = (exAnswers[ex.id] || '').trim();
    if (!answer) return;

    setExSubmitting(ex.id);
    setExError((prev) => ({ ...prev, [ex.id]: '' }));
    try {
      const graded = await apiFetch<{
        exerciseId: string;
        lessonId: string;
        isCorrect: boolean;
        feedback: string;
      }>('/api/exercises/grade', {
        method: 'POST',
        body: { exerciseId: ex.id, answer, language: locale },
      });

      setExResults((prev) => ({
        ...prev,
        [ex.id]: { isCorrect: graded.isCorrect, feedback: graded.feedback },
      }));

      if (firebaseUser.emailVerified) {
        const subId = `${firebaseUser.uid}_${ex.id}`;
        await setDoc(doc(db, 'exercise_submissions', subId), {
          uid: firebaseUser.uid,
          exerciseId: ex.id,
          lessonId: ex.lessonId,
          answer: answer.slice(0, 5000),
          isCorrect: graded.isCorrect,
          feedback: graded.feedback.slice(0, 2000),
          submittedAt: serverTimestamp(),
        }).catch(() => {});
      }
    } catch (err) {
      setExError((prev) => ({
        ...prev,
        [ex.id]: err instanceof ApiError ? err.message : 'Grading failed.',
      }));
    } finally {
      setExSubmitting(null);
    }
  };

  const handleStartQuiz = async (quiz: PublicQuiz) => {
    if (!firebaseUser) {
      setAuthModalOpen(true);
      return;
    }
    setQuizError(null);
    setQuizResult(null);
    setQuizAnswers({});
    setQuizBusy(true);
    try {
      const res = await apiFetch<{
        sessionId: string | null;
        expiresAt?: string;
        questionOrder: string[];
      }>('/api/quizzes/start', {
        method: 'POST',
        body: { quizId: quiz.id, language: locale },
      });
      setActiveQuiz(quiz);
      setOrderedQuestionIds(res.questionOrder);
      setExamSessionId(res.sessionId);
      setExamExpiresAtMs(res.expiresAt ? new Date(res.expiresAt).getTime() : null);
    } catch (err) {
      setQuizError(err instanceof ApiError ? err.message : 'Could not start quiz.');
    } finally {
      setQuizBusy(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || !firebaseUser) return;
    setQuizBusy(true);
    setQuizError(null);
    try {
      const graded = await apiFetch<QuizResultPayload>('/api/quizzes/submit', {
        method: 'POST',
        body: {
          quizId: activeQuiz.id,
          sessionId: examSessionId || undefined,
          language: locale,
          answers: quizAnswers,
        },
      });
      setQuizResult(graded);
      setExamExpiresAtMs(null);

      // Record locally for immediate dashboard reflection
      recordQuizAttempt({
        id: `attempt-${Date.now()}`,
        uid: firebaseUser?.uid || 'guest',
        quizId: graded.quizId,
        quizType: graded.quizType,
        courseId: graded.courseId,
        difficulty: graded.difficulty,
        scorePercent: graded.scorePercent,
        correctCount: graded.correctCount,
        totalQuestions: graded.totalQuestions,
        timedOut: graded.timedOut,
        recommendedLessonIds: graded.recommendedLessonIds,
        submittedAt: new Date().toISOString(),
      });

      if (firebaseUser?.emailVerified) {
        await addDoc(collection(db, 'quiz_attempts'), {
          uid: firebaseUser.uid,
          quizId: graded.quizId,
          quizType: graded.quizType,
          courseId: graded.courseId,
          difficulty: graded.difficulty,
          scorePercent: graded.scorePercent,
          correctCount: graded.correctCount,
          totalQuestions: graded.totalQuestions,
          timedOut: graded.timedOut,
          recommendedLessonIds: graded.recommendedLessonIds,
          submittedAt: serverTimestamp(),
        }).catch(() => {});
      }
    } catch (err) {
      setQuizError(err instanceof ApiError ? err.message : 'Submission failed.');
    } finally {
      setQuizBusy(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div>
      <section className="kj-hero-band">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="text-start">
              <div className="kj-eyebrow">
                <span className="kj-eyebrow-dot" />
                <span>{pickLoc(locale, {
  ckb: 'ڕاهێنان و تاقیکردنەوەکان · PRACTICE LAB',
  kmr: 'ڕاهێنان و ئەزموون · PRACTICE LAB',
  ar: 'التمارين والاختبارات · PRACTICE LAB',
  en: 'Practice Lab · Exercises & Quizzes',
})}</span>
              </div>
              <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--kj-ink)]">
                {t.practice.title}
              </h1>
              <p className="mt-1 text-xs text-[var(--kj-muted)]">
                {t.practice.noAnswerKeysClient}
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-[7px] border border-[var(--kj-border)] bg-[var(--kj-soft)] p-1">
              <button
                type="button"
                onClick={() => setTab('exercises')}
                className={`rounded-[5px] px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  tab === 'exercises'
                    ? 'kj-btn-primary'
                    : 'text-[var(--kj-muted-2)] hover:text-[var(--kj-ink)]'
                }`}
              >
                {t.practice.exercisesTab}
              </button>
              <button
                type="button"
                onClick={() => setTab('quizzes')}
                className={`rounded-[5px] px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  tab === 'quizzes'
                    ? 'kj-btn-primary'
                    : 'text-[var(--kj-muted-2)] hover:text-[var(--kj-ink)]'
                }`}
              >
                {t.practice.quizzesTab}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
        {/* TRACK FILTER PILLS & SEARCH */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {TRACK_FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedTrack(opt.id)}
                className={`rounded-[6px] border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  selectedTrack === opt.id
                    ? 'kj-badge border-[var(--kj-emerald)]/40 font-bold'
                    : 'border-[var(--kj-border)] bg-[var(--kj-card)] text-[var(--kj-muted-2)] hover:bg-[var(--kj-soft)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[220px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={pickLoc(locale, {
  ckb: 'گەڕان لە ڕاهێنان و کویزەکان...',
  kmr: 'لێگەڕیان د ڕاهێنان و کویزان دا...',
  ar: 'ابحث في التمارين والاختبارات...',
  en: 'Search exercises & quizzes...',
})}
              className="w-full rounded-[6px] border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-1.5 text-xs text-[var(--kj-ink)] placeholder:text-[var(--kj-muted)] focus:border-[var(--kj-green)] focus:outline-none"
            />
          </div>
        </div>

      {/* EXERCISES TAB */}
      {tab === 'exercises' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredExercises.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-[#2b3442] dark:text-slate-400">
              {pickLoc(locale, {
  ckb: 'هیچ ڕاهێنانێک نەدۆزرایەوە بەم فلتەرە.',
  kmr: 'چ ڕاهێنان ب ڤی فلتەری نەهاتنە دیتن.',
  ar: 'لم يتم العثور على تمارين مطابقة لهذا الفلتر.',
  en: 'No exercises found matching this filter.',
})}
            </div>
          )}
          {filteredExercises.map((ex) => {
            const loc = ex.translations[locale] || ex.translations.en;
            const res = exResults[ex.id];
            const errMsg = exError[ex.id];
            const locked = ex.tier === 'pro' && !hasProAccess;

            return (
              <Surface key={ex.id} className="flex flex-col justify-between p-5">
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      {ex.courseId.toUpperCase()} · {ex.type.replace('_', ' ')} · {ex.difficulty}
                    </span>
                    <span className={ex.tier === 'pro' ? 'font-semibold text-violet-600 dark:text-violet-400' : ''}>
                      {ex.tier === 'pro' ? 'Pro' : 'Free'}
                    </span>
                  </div>

                  <h2 className="mb-3 text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                    {loc.prompt}
                  </h2>

                  {ex.codeSnippet && (
                    <pre
                      dir="ltr"
                      className="kj-code-window mb-3 overflow-x-auto p-3 font-mono text-xs leading-5"
                    >
                      <code>{ex.codeSnippet}</code>
                    </pre>
                  )}

                  {/* Options or Text/Code Input */}
                  {loc.options && loc.options.length > 0 ? (
                    <div className="mb-3 space-y-2">
                      {loc.options.map((opt, idx) => {
                        const val = ex.type === 'true_false' ? opt : String(idx);
                        const selected = exAnswers[ex.id] === val;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={locked}
                            onClick={() => setExAnswers((prev) => ({ ...prev, [ex.id]: val }))}
                            className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-start text-xs transition-colors cursor-pointer ${
                              selected
                                ? 'kj-badge border-[var(--kj-emerald)] font-bold'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-[#2b3442] dark:text-slate-200 dark:hover:bg-[#202938]'
                            }`}
                          >
                            <span className="font-mono text-[11px] opacity-65">
                              {ex.type === 'true_false' ? (opt === 'true' ? 'T' : 'F') : String.fromCharCode(65 + idx)}.
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <textarea
                      dir="ltr"
                      rows={ex.type === 'complete_code' ? 4 : 2}
                      disabled={locked}
                      value={exAnswers[ex.id] || ''}
                      onChange={(e) => setExAnswers((prev) => ({ ...prev, [ex.id]: e.target.value }))}
                      placeholder={
                        ex.type === 'complete_code'
                          ? 'Write JavaScript code here...'
                          : 'Type your answer...'
                      }
                      className="mb-3 w-full rounded-lg border border-slate-300 bg-white p-2.5 font-mono text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
                    />
                  )}

                  {loc.hint && exHintsOpen[ex.id] && (
                    <p className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600 dark:border-[#2b3442] dark:bg-[#151b26] dark:text-slate-300">
                      <span className="font-semibold">{t.practice.hint}: </span>
                      {loc.hint}
                    </p>
                  )}

                  {res && (
                    <div
                      className={`mb-3 rounded-lg border p-3 text-xs leading-5 ${
                        res.isCorrect
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200'
                          : 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200'
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-1.5 font-semibold">
                        {res.isCorrect ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span>{res.isCorrect ? t.practice.correct : t.practice.incorrect}</span>
                      </div>
                      <p>{res.feedback}</p>
                    </div>
                  )}

                  {errMsg && (
                    <p className="mb-3 text-xs text-red-600 dark:text-red-400">{errMsg}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 dark:border-[#2b3442]">
                  {loc.hint ? (
                    <button
                      type="button"
                      onClick={() =>
                        setExHintsOpen((prev) => ({ ...prev, [ex.id]: !prev[ex.id] }))
                      }
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>{t.practice.showHint}</span>
                    </button>
                  ) : (
                    <span />
                  )}

                  {locked ? (
                    <Button variant="violet" size="sm" onClick={() => setActiveView('pro')}>
                      <Lock className="h-3.5 w-3.5" />
                      <span>{t.practice.proLocked}</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={exSubmitting === ex.id || !(exAnswers[ex.id] || '').trim()}
                      onClick={() => void submitExercise(ex)}
                    >
                      {t.practice.checkAnswer}
                    </Button>
                  )}
                </div>
              </Surface>
            );
          })}
        </div>
      )}

      {/* QUIZZES & EXAMS TAB */}
      {tab === 'quizzes' && (
        <div className="space-y-6">
          {quizError && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              {quizError}
            </div>
          )}

          {!activeQuiz ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredQuizzes.length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-[#2b3442] dark:text-slate-400">
                  {pickLoc(locale, {
  ckb: 'هیچ کویزێک نەدۆزرایەوە بەم فلتەرە.',
  kmr: 'چ کویز ب ڤی فلتەری نەهاتنە دیتن.',
  ar: 'لم يتم العثور على اختبارات مطابقة لهذا الفلتر.',
  en: 'No quizzes found matching this filter.',
})}
                </div>
              )}
              {filteredQuizzes.map((qz) => {
                const locked = qz.tier === 'pro' && !hasProAccess;
                return (
                  <Surface key={qz.id} className="flex flex-col justify-between p-5">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {qz.courseId.toUpperCase()} · {qz.quizType.replace('_', ' ')} · {qz.difficulty}
                        {qz.timeLimitSeconds ? ` · ${Math.round(qz.timeLimitSeconds / 60)} min` : ''}
                        {' · '}
                        <span className={qz.tier === 'pro' ? 'font-semibold text-violet-600 dark:text-violet-400' : ''}>
                          {qz.tier === 'pro' ? 'Pro' : 'Free'}
                        </span>
                      </p>
                      <h2 className="mt-1.5 text-base font-semibold text-slate-950 dark:text-white">
                        {cleanTitle(qz.titles[locale] || qz.titles.en)}
                      </h2>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                        {qz.questions.length} questions · randomized order
                      </p>
                    </div>

                    <div className="mt-5 flex justify-end">
                      {locked ? (
                        <Button variant="violet" size="sm" onClick={() => setActiveView('pro')}>
                          <Lock className="h-3.5 w-3.5" />
                          <span>{t.practice.proLocked}</span>
                        </Button>
                      ) : (
                        <Button size="sm" disabled={quizBusy} onClick={() => void handleStartQuiz(qz)}>
                          <PlayCircle className="h-4 w-4" />
                          <span>
                            {qz.quizType === 'timed_exam'
                              ? t.practice.startTimedExam
                              : t.practice.startQuiz}
                          </span>
                        </Button>
                      )}
                    </div>
                  </Surface>
                );
              })}
            </div>
          ) : (
            <Surface className="p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-[#2b3442]">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeQuiz.courseId.toUpperCase()} · {activeQuiz.quizType.replace('_', ' ')} · {activeQuiz.difficulty}
                  </p>
                  <h2 className="mt-0.5 text-lg font-bold text-slate-950 dark:text-white">
                    {cleanTitle(activeQuiz.titles[locale] || activeQuiz.titles.en)}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {secondsLeft !== null && !quizResult && (
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-sm font-semibold tabular-nums ${
                        secondsLeft <= 30
                          ? 'border-red-400 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300'
                          : 'kj-badge border-[var(--kj-emerald)]/40'
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                      <span>
                        {t.practice.timeRemaining}: {formatTimer(secondsLeft)}
                      </span>
                    </div>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setActiveQuiz(null);
                      setQuizResult(null);
                      setExamExpiresAtMs(null);
                    }}
                  >
                    {t.common.close}
                  </Button>
                </div>
              </div>

              {/* Active Questions */}
              <div className="space-y-6">
                {orderedQuestionIds.map((qId, index) => {
                  const q = activeQuiz.questions.find((item) => item.id === qId);
                  if (!q) return null;
                  const qLoc = q.translations[locale] || q.translations.en;
                  const gradedRow = quizResult?.results.find((r) => r.questionId === q.id);

                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-slate-200 p-4 dark:border-[#2b3442]"
                    >
                      <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                        <span className="me-1.5 font-mono text-xs text-slate-500 tabular-nums">
                          {index + 1}.
                        </span>
                        {qLoc.prompt}
                      </p>
                      {q.codeSnippet && (
                        <pre
                          dir="ltr"
                          className="kj-code-window mb-3 overflow-x-auto p-3 font-mono text-xs"
                        >
                          <code>{q.codeSnippet}</code>
                        </pre>
                      )}
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {qLoc.options.map((opt, optIdx) => {
                          const selected = quizAnswers[q.id] === optIdx;
                          const isCorrectOpt = gradedRow && gradedRow.correctOptionIndex === optIdx;
                          const isWrongSelected = gradedRow && selected && !gradedRow.isCorrect;

                          let style =
                            'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-[#2b3442] dark:text-slate-200 dark:hover:bg-[#202938]';
                          if (isCorrectOpt) {
                            style =
                              'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200';
                          } else if (isWrongSelected) {
                            style =
                              'border-red-500 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200';
                          } else if (selected) {
                            style =
                              'kj-badge border-[var(--kj-emerald)] font-bold';
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={Boolean(quizResult)}
                              onClick={() =>
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                              }
                              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-start text-xs transition-colors cursor-pointer ${style}`}
                            >
                              <span className="font-mono text-[11px] opacity-70">
                                {String.fromCharCode(65 + optIdx)}.
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {gradedRow && (
                        <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
                          <span className="font-semibold">
                            {gradedRow.isCorrect ? t.practice.correct : t.practice.incorrect}:{' '}
                          </span>
                          {gradedRow.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizResult ? (
                <div className="mt-6 flex justify-end">
                  <Button disabled={quizBusy} onClick={() => void handleSubmitQuiz()}>
                    {t.practice.submitQuiz}
                  </Button>
                </div>
              ) : (
                <div className="kj-callout mt-6 rounded-[7px] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {t.practice.scoreLabel}
                        {quizResult.timedOut ? ' · Timed Out on Server' : ''}
                      </p>
                      <p className="font-mono text-2xl font-bold text-slate-950 dark:text-white tabular-nums">
                        {quizResult.scorePercent}% ({quizResult.correctCount}/{quizResult.totalQuestions})
                      </p>
                    </div>
                  </div>

                  {quizResult.recommendedLessonIds.length > 0 && (
                    <div className="mt-4 border-t border-blue-200 pt-3 dark:border-blue-900/40">
                      <p className="mb-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {t.practice.recommendedLessons}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {quizResult.recommendedLessonIds.map((lId) => {
                          const target = lessons.find((l) => l.id === lId);
                          if (!target) return null;
                          const label = cleanTitle((target.translations[locale] || target.translations.en).title);
                          return (
                            <Button
                              key={lId}
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setActiveLessonId(lId);
                                setActiveView('academy');
                              }}
                            >
                              {label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Surface>
          )}
        </div>
      )}
      </div>
    </div>
  );
};
