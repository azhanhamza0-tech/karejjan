import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  Layers,
  Lock,
  Play,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_COURSES, ALL_CHAPTERS } from '../data/courses/coursesList';
import { SEED_CHAPTERS, SEED_COURSES } from '../data/seedCatalog';
import { cleanTitle, pickLoc } from '../i18n/translations';
import type { PracticeModule, TrackId } from '../types/domain';
import { buildCourseLearningModules, getEffectivePracticeConfig } from '../lib/practiceModuleEngine';
import { IntegratedPracticePanel } from './IntegratedPracticePanel';
import { Button, Surface } from './ui/Primitives';

export const AcademyView: React.FC = () => {
  const {
    locale,
    isRtl,
    t,
    staffRole,
    systemSettings,
    courses,
    lessons,
    exercises,
    quizzes,
    activeLessonId,
    setActiveLessonId,
    completedLessonIds,
    toggleLessonComplete,
    modulePracticeProgress,
    academyViewMode,
    setAcademyViewMode,
    activeModuleIndex,
    setActiveModuleIndex,
    openLessonInEditor,
  } = useApp();

  const isStaff = staffRole !== 'user';

  const activeLesson = useMemo(
    () => lessons.find((l) => l.id === activeLessonId) || lessons[0],
    [lessons, activeLessonId]
  );

  const [selectedTrack, setSelectedTrack] = useState<TrackId>(activeLesson?.courseId || 'html');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const [lessonSearch, setLessonSearch] = useState('');
  const [justUnlockedModuleId, setJustUnlockedModuleId] = useState<string | null>(null);

  useEffect(() => {
    if (activeLesson?.courseId && activeLesson.courseId !== selectedTrack) {
      setSelectedTrack(activeLesson.courseId);
    }
  }, [activeLesson?.courseId]);

  const rawCourses = courses && courses.length > 0 ? courses : (SEED_COURSES || ALL_COURSES || []);
  const availableCourses = useMemo(() => {
    return rawCourses.map((c) => ({
      ...c,
      titles: {
        ...c.titles,
        en: cleanTitle(c.titles.en),
        ckb: cleanTitle(c.titles.ckb),
        kmr: cleanTitle(c.titles.kmr),
        ar: cleanTitle(c.titles.ar),
      },
    }));
  }, [rawCourses]);

  const currentCourse = useMemo(
    () => availableCourses.find((c) => c.id === selectedTrack) || availableCourses[0],
    [availableCourses, selectedTrack]
  );

  const effectivePracticeConfig = useMemo(
    () => getEffectivePracticeConfig(systemSettings, currentCourse),
    [systemSettings, currentCourse]
  );

  const trackLessons = useMemo(
    () => lessons.filter((l) => l.courseId === selectedTrack).sort((a, b) => a.order - b.order),
    [lessons, selectedTrack]
  );

  const learningModules = useMemo(
    () =>
      buildCourseLearningModules(
        selectedTrack,
        trackLessons,
        effectivePracticeConfig,
        exercises,
        quizzes
      ),
    [selectedTrack, trackLessons, effectivePracticeConfig, exercises, quizzes]
  );

  const displayedTrackLessons = useMemo(() => {
    if (!lessonSearch.trim()) return trackLessons;
    const q = lessonSearch.toLowerCase();
    return trackLessons.filter((l) => {
      const loc = l.translations[locale] || l.translations.en;
      return loc.title.toLowerCase().includes(q) || String(l.order).includes(q);
    });
  }, [trackLessons, lessonSearch, locale]);

  const currentLesson = useMemo(() => {
    if (activeLesson && activeLesson.courseId === selectedTrack) return activeLesson;
    return trackLessons[0] || lessons[0];
  }, [activeLesson, selectedTrack, trackLessons, lessons]);

  const currentIdx = trackLessons.findIndex((l) => l.id === currentLesson?.id);
  const prevLesson = currentIdx > 0 ? trackLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx >= 0 && currentIdx < trackLessons.length - 1 ? trackLessons[currentIdx + 1] : null;

  const isGroupUnlocked = (groupIndex: number): boolean => {
    if (groupIndex <= 1 || isStaff || !effectivePracticeConfig.enabled || !effectivePracticeConfig.requirePassToUnlockNext) {
      return true;
    }
    return learningModules
      .filter((m) => m.groupIndex < groupIndex)
      .every((m) => Boolean(modulePracticeProgress[m.moduleId]?.passed));
  };

  const getFirstBlockingModule = (targetGroupIndex: number): PracticeModule | undefined => {
    return learningModules.find(
      (m) => m.groupIndex < targetGroupIndex && !modulePracticeProgress[m.moduleId]?.passed
    );
  };

  const isPracticeReady = (mod: PracticeModule): boolean => {
    if (!effectivePracticeConfig.enabled) return false;
    if (isStaff) return true;
    if (!isGroupUnlocked(mod.groupIndex)) return false;
    const allGroupLessonsDone = mod.lessons.every((l) => completedLessonIds.has(l.id));
    return allGroupLessonsDone || Boolean(modulePracticeProgress[mod.moduleId]);
  };

  const currentLessonModule = useMemo(
    () => learningModules.find((m) => m.lessonIds.includes(currentLesson?.id || '')) || learningModules[0],
    [learningModules, currentLesson?.id]
  );

  const activePracticeModule = useMemo(
    () => learningModules.find((m) => m.groupIndex === activeModuleIndex) || currentLessonModule || learningModules[0],
    [learningModules, activeModuleIndex, currentLessonModule]
  );

  const totalCompleted = lessons.filter((l) => completedLessonIds.has(l.id)).length;
  const overallPercent = lessons.length ? Math.round((totalCompleted / lessons.length) * 100) : 0;

  const nextIncompleteLesson = lessons.find((l) => !completedLessonIds.has(l.id)) || lessons[0];

  const handleTrackSwitch = (track: TrackId) => {
    setSelectedTrack(track);
    setJustUnlockedModuleId(null);
    setAcademyViewMode('lesson');
    const first = lessons.filter((l) => l.courseId === track).sort((a, b) => a.order - b.order)[0];
    if (first) setActiveLessonId(first.id);
    setActiveModuleIndex(1);
  };

  const handleSelectLessonFromNav = (lessonId: string, mod: PracticeModule) => {
    if (!isGroupUnlocked(mod.groupIndex)) {
      const blocker = getFirstBlockingModule(mod.groupIndex) || mod;
      setActiveModuleIndex(blocker.groupIndex);
      setAcademyViewMode('assessment');
      return;
    }
    setActiveLessonId(lessonId);
    setActiveModuleIndex(mod.groupIndex);
    setAcademyViewMode('lesson');
  };

  const handleOpenModuleAssessment = (mod: PracticeModule) => {
    if (!isGroupUnlocked(mod.groupIndex)) {
      const blocker = getFirstBlockingModule(mod.groupIndex) || mod;
      setActiveModuleIndex(blocker.groupIndex);
      setAcademyViewMode('assessment');
      return;
    }
    setActiveModuleIndex(mod.groupIndex);
    setAcademyViewMode('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteAndAutoUnlock = () => {
    if (!currentLesson) return;
    const wasComplete = completedLessonIds.has(currentLesson.id);
    toggleLessonComplete(currentLesson);

    if (!wasComplete && effectivePracticeConfig.enabled && currentLessonModule) {
      const groupNowComplete = currentLessonModule.lessons.every(
        (l) => l.id === currentLesson.id || completedLessonIds.has(l.id)
      );
      if (groupNowComplete) {
        setJustUnlockedModuleId(currentLessonModule.moduleId);
        setActiveModuleIndex(currentLessonModule.groupIndex);
        setAcademyViewMode('assessment');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const copyCode = async (label: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlock(label);
      setTimeout(() => setCopiedBlock(null), 1600);
    } catch {}
  };

  if (!currentLesson) return null;
  const content = currentLesson.translations[locale] || currentLesson.translations.en;
  const isCompleted = completedLessonIds.has(currentLesson.id);
  const allChapters = SEED_CHAPTERS || ALL_CHAPTERS || [];
  const currentChapter = allChapters.find((ch) => ch.id === currentLesson.chapterId);

  return (
    <div>
      {/* Editorial Hero Header Strip matching dist.zip */}
      <section className="kj-hero-band">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl text-start">
              <div className="kj-eyebrow">
                <span className="kj-eyebrow-dot" />
                <span>
                  {cleanTitle(currentCourse.titles[locale] || currentCourse.titles.en)}
                  {currentChapter ? ` · ${cleanTitle(currentChapter.titles[locale] || currentChapter.titles.en)}` : ''}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--kj-ink)] sm:text-3xl">
                {t.academy.title}
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--kj-muted-2)]">
                {t.academy.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="min-w-[180px]">
                <div className="mb-1 flex items-center justify-between text-xs text-[var(--kj-muted-2)]">
                  <span>{t.common.completion}</span>
                  <span className="font-mono font-bold text-[var(--kj-green)] tabular-nums">
                    {overallPercent}% ({totalCompleted}/{lessons.length})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--kj-border)]">
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${overallPercent}%`, background: 'var(--kj-gradient-primary)' }}
                  />
                </div>
              </div>

              {nextIncompleteLesson && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedTrack(nextIncompleteLesson.courseId);
                    setActiveLessonId(nextIncompleteLesson.id);
                    setAcademyViewMode('lesson');
                  }}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{t.common.continueLearning}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
        {/* Course Selector Tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-2" role="tablist" aria-label={t.academy.coursesLabel}>
          {availableCourses.map((course) => {
            const courseLessons = lessons.filter((l) => l.courseId === course.id);
            const doneInCourse = courseLessons.filter((l) => completedLessonIds.has(l.id)).length;
            const active = selectedTrack === course.id;
            return (
              <button
                key={course.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleTrackSwitch(course.id)}
                className={`rounded-[6px] border px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'kj-btn-primary border-transparent'
                    : 'border-[var(--kj-border)] bg-[var(--kj-card)] text-[var(--kj-muted-2)] hover:bg-[var(--kj-soft)] hover:text-[var(--kj-ink)]'
                }`}
              >
                {cleanTitle(course.titles[locale] || course.titles.en || course.id.toUpperCase())}{' '}
                <span className="ms-1 font-mono text-[11px] opacity-80 tabular-nums">
                  {doneInCourse}/{courseLessons.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Two-column dist.zip .lesson-shell Workspace */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Lesson Navigation Rail */}
          <aside className="lg:col-span-3">
            <div className="rounded-[9px] border border-[var(--kj-border)] bg-[var(--kj-soft)] p-4">
              <h2 className="mb-2 text-sm font-bold text-[var(--kj-ink)]">
                {cleanTitle(currentCourse.titles[locale] || currentCourse.titles.en)}
              </h2>
              <p className="mb-4 text-xs leading-relaxed text-[var(--kj-muted)]">
                {currentCourse.descriptions[locale] || currentCourse.descriptions.en}
              </p>

              {/* Quick search input for lessons */}
              <input
                type="text"
                value={lessonSearch}
                onChange={(e) => setLessonSearch(e.target.value)}
                placeholder={pickLoc(locale, { ckb: 'گەڕان لەناو وانەکان...', kmr: 'لێگەڕیان د ناڤ وانەیان دا...', ar: 'ابحث في الدروس...', en: 'Search lessons...' })}
                className="mb-3 w-full rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-paper)] px-3 py-2 text-xs text-[var(--kj-ink)] placeholder:text-[var(--kj-muted)] outline-none focus:border-[var(--kj-green)]"
              />

              <div className="max-h-[calc(100vh-280px)] overflow-y-auto pe-1">
                {lessonSearch.trim() ? (
                  <ol className="space-y-1">
                    {displayedTrackLessons.map((lesson) => {
                      const locText = lesson.translations[locale] || lesson.translations.en;
                      const ownerMod =
                        learningModules.find((m) => m.lessonIds.includes(lesson.id)) || learningModules[0];
                      const unlocked = ownerMod ? isGroupUnlocked(ownerMod.groupIndex) : true;
                      const active = academyViewMode === 'lesson' && lesson.id === currentLesson.id;
                      const done = completedLessonIds.has(lesson.id);
                      return (
                        <li key={lesson.id}>
                          <button
                            type="button"
                            onClick={() => ownerMod && handleSelectLessonFromNav(lesson.id, ownerMod)}
                            className={`flex w-full items-start justify-between gap-2 rounded-[5px] px-3 py-2.5 text-start text-xs transition-colors cursor-pointer ${
                              active
                                ? 'kj-badge font-bold'
                                : !unlocked
                                  ? 'text-[var(--kj-muted)] opacity-60 hover:bg-[var(--kj-card)]'
                                  : 'text-[var(--kj-muted-2)] hover:bg-[var(--kj-card)] hover:text-[var(--kj-ink)]'
                            }`}
                          >
                            <span className="leading-snug">
                              <span className="me-1.5 font-mono text-[11px] opacity-70 tabular-nums">
                                {String(lesson.order).padStart(2, '0')}.
                              </span>
                              {cleanTitle(locText.title)}
                            </span>
                            {!unlocked ? (
                              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" />
                            ) : done ? (
                              <Check
                                aria-label={t.academy.completed}
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--kj-emerald)]"
                              />
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <div className="space-y-3">
                    {learningModules.map((mod) => {
                      const groupUnlocked = isGroupUnlocked(mod.groupIndex);
                      const modDoneCount = mod.lessons.filter((l) => completedLessonIds.has(l.id)).length;
                      const practiceReady = isPracticeReady(mod);
                      const savedModProgress = modulePracticeProgress[mod.moduleId];
                      const isAssessingThisMod =
                        academyViewMode === 'assessment' && activePracticeModule?.moduleId === mod.moduleId;
                      const pad2 = (n: number) => String(n).padStart(2, '0');

                      return (
                        <div
                          key={mod.moduleId}
                          className={`rounded-[8px] border p-2 transition-all ${
                            isAssessingThisMod || mod.lessonIds.includes(currentLesson.id)
                              ? 'border-[var(--kj-green)]/40 bg-[var(--kj-card)]'
                              : 'border-[var(--kj-border)] bg-[var(--kj-card)]/60'
                          }`}
                        >
                          {/* Group Header */}
                          <div className="mb-1.5 flex items-center justify-between px-1.5 py-1 text-[11px] font-bold">
                            <span className="inline-flex items-center gap-1 text-[var(--kj-ink)]">
                              <Layers className="h-3 w-3 text-[var(--kj-green)]" />
                              {pickLoc(locale, {
                                ckb: `گڕوپی ${pad2(mod.groupIndex)}`,
                                kmr: `Koma ${pad2(mod.groupIndex)}`,
                                ar: `الوحدة ${pad2(mod.groupIndex)}`,
                                en: `Group ${pad2(mod.groupIndex)}`,
                              })}
                            </span>
                            <span className="font-mono text-[10px] text-[var(--kj-muted)] tabular-nums">
                              {groupUnlocked ? `${modDoneCount}/${mod.lessons.length}` : '🔒'}
                            </span>
                          </div>

                          {/* Group Lessons */}
                          <ol className="space-y-0.5">
                            {mod.lessons.map((lesson) => {
                              const locText = lesson.translations[locale] || lesson.translations.en;
                              const active =
                                academyViewMode === 'lesson' && lesson.id === currentLesson.id;
                              const done = completedLessonIds.has(lesson.id);
                              return (
                                <li key={lesson.id}>
                                  <button
                                    type="button"
                                    onClick={() => handleSelectLessonFromNav(lesson.id, mod)}
                                    className={`flex w-full items-start justify-between gap-2 rounded-[5px] px-2.5 py-2 text-start text-xs transition-colors cursor-pointer ${
                                      active
                                        ? 'kj-badge font-bold'
                                        : !groupUnlocked
                                          ? 'text-[var(--kj-muted)] opacity-60 hover:bg-[var(--kj-soft-alt)]'
                                          : 'text-[var(--kj-muted-2)] hover:bg-[var(--kj-soft-alt)] hover:text-[var(--kj-ink)]'
                                    }`}
                                  >
                                    <span className="leading-snug">
                                      <span className="me-1.5 font-mono text-[11px] opacity-70 tabular-nums">
                                        {pad2(lesson.order)}.
                                      </span>
                                      {cleanTitle(locText.title)}
                                    </span>
                                    {!groupUnlocked ? (
                                      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" />
                                    ) : done ? (
                                      <Check
                                        aria-label={t.academy.completed}
                                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--kj-emerald)]"
                                      />
                                    ) : null}
                                  </button>
                                </li>
                              );
                            })}
                          </ol>

                          {/* Integrated Practice & Assessment Divider Card */}
                          {effectivePracticeConfig.enabled && (
                            <div className="mt-2 border-t border-dashed border-[var(--kj-border-strong)] pt-2">
                              <button
                                type="button"
                                onClick={() => handleOpenModuleAssessment(mod)}
                                className={`flex w-full items-center justify-between gap-2 rounded-[6px] border px-2.5 py-2 text-start text-xs font-semibold transition-all cursor-pointer ${
                                  isAssessingThisMod
                                    ? 'border-[var(--kj-green)] bg-[var(--kj-green)]/15 text-[var(--kj-green)] shadow-xs'
                                    : savedModProgress?.passed
                                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/15'
                                      : practiceReady
                                        ? 'border-[var(--kj-green)]/40 bg-[var(--kj-green)]/[0.08] text-[var(--kj-ink)] hover:border-[var(--kj-green)]'
                                        : 'border-[var(--kj-border)] bg-[var(--kj-soft)] text-[var(--kj-muted)] hover:border-[var(--kj-border-strong)]'
                                }`}
                              >
                                <span className="flex items-center gap-1.5 min-w-0">
                                  {savedModProgress?.passed ? (
                                    <Award className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                  ) : practiceReady ? (
                                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-[var(--kj-green)]" />
                                  ) : (
                                    <Lock className="h-3.5 w-3.5 shrink-0 opacity-75" />
                                  )}
                                  <span className="truncate">
                                    {pickLoc(locale, {
                                      ckb: `تاقیکردنەوەی ${pad2(mod.groupIndex)}`,
                                      kmr: `Ezmûna ${pad2(mod.groupIndex)}`,
                                      ar: `تقييم الوحدة ${pad2(mod.groupIndex)}`,
                                      en: `Practice & Test ${pad2(mod.groupIndex)}`,
                                    })}
                                  </span>
                                </span>
                                <span className="font-mono text-[10px] shrink-0">
                                  {savedModProgress?.passed
                                    ? `${savedModProgress.bestScorePercent}% ✓`
                                    : practiceReady
                                      ? pickLoc(locale, { ckb: 'کراوەیە', kmr: 'Vekirî', ar: 'متاح', en: 'Ready' })
                                      : `${modDoneCount}/${mod.lessons.length}`}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Learning & Assessment Workspace */}
          <article className="space-y-6 lg:col-span-9">
            {/* Connected Learning Group Flow Stepper */}
            {currentLessonModule && (
              <div className="rounded-[9px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--kj-muted)] me-1">
                    {pickLoc(locale, {
                      ckb: `گڕوپی ${String((academyViewMode === 'assessment' ? activePracticeModule : currentLessonModule).groupIndex).padStart(2, '0')}:`,
                      kmr: `Koma ${String((academyViewMode === 'assessment' ? activePracticeModule : currentLessonModule).groupIndex).padStart(2, '0')}:`,
                      ar: `الوحدة ${String((academyViewMode === 'assessment' ? activePracticeModule : currentLessonModule).groupIndex).padStart(2, '0')}:`,
                      en: `Group ${String((academyViewMode === 'assessment' ? activePracticeModule : currentLessonModule).groupIndex).padStart(2, '0')}:`,
                    })}
                  </span>
                  {(academyViewMode === 'assessment' ? activePracticeModule : currentLessonModule).lessons.map((l) => {
                    const isThisActive = academyViewMode === 'lesson' && l.id === currentLesson.id;
                    const isDone = completedLessonIds.has(l.id);
                    const modRef = academyViewMode === 'assessment' ? activePracticeModule : currentLessonModule;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => handleSelectLessonFromNav(l.id, modRef)}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer border ${
                          isThisActive
                            ? 'border-[var(--kj-green)] bg-[var(--kj-green)]/12 text-[var(--kj-green)]'
                            : isDone
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                              : 'border-[var(--kj-border)] bg-[var(--kj-soft)] text-[var(--kj-muted-2)] hover:text-[var(--kj-ink)]'
                        }`}
                      >
                        {isDone && <Check className="w-3 h-3" />}
                        <span>{String(l.order).padStart(2, '0')}</span>
                      </button>
                    );
                  })}
                  {effectivePracticeConfig.enabled && (
                    <>
                      <span className="text-[var(--kj-muted)] px-0.5">→</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenModuleAssessment(
                            academyViewMode === 'assessment' ? activePracticeModule : currentLessonModule
                          )
                        }
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer border ${
                          academyViewMode === 'assessment'
                            ? 'border-[var(--kj-green)] bg-[var(--kj-green)] text-white shadow-xs'
                            : isPracticeReady(currentLessonModule)
                              ? 'border-[var(--kj-green)]/45 bg-[var(--kj-green)]/10 text-[var(--kj-green)]'
                              : 'border-[var(--kj-border)] bg-[var(--kj-soft)] text-[var(--kj-muted)]'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {pickLoc(locale, {
                            ckb: 'ڕاهێنان و تاقیکردنەوە',
                            kmr: 'Rahênan & Ezmûn',
                            ar: 'التدريب والتقييم',
                            en: 'Practice & Assessment',
                          })}
                        </span>
                      </button>
                    </>
                  )}
                </div>

                {academyViewMode === 'assessment' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const targetL = activePracticeModule?.lessons[0] || currentLesson;
                      if (targetL) setActiveLessonId(targetL.id);
                      setAcademyViewMode('lesson');
                    }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      {pickLoc(locale, {
                        ckb: 'بینینی وانەکان',
                        kmr: 'Wanê Bibîne',
                        ar: 'عرض الدروس',
                        en: 'View Lessons',
                      })}
                    </span>
                  </Button>
                )}
              </div>
            )}

            {academyViewMode === 'assessment' && activePracticeModule ? (
              !isGroupUnlocked(activePracticeModule.groupIndex) ? (
                <Surface className="p-8 text-center space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-500">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[var(--kj-ink)]">
                    {pickLoc(locale, {
                      ckb: `گڕوپی ${String(activePracticeModule.groupIndex).padStart(2, '0')} هێشتا داخراوە`,
                      kmr: `Koma ${String(activePracticeModule.groupIndex).padStart(2, '0')} hîn girtî ye`,
                      ar: `الوحدة ${String(activePracticeModule.groupIndex).padStart(2, '0')} ما زالت مقفلة`,
                      en: `Learning Group ${String(activePracticeModule.groupIndex).padStart(2, '0')} is Locked`,
                    })}
                  </h3>
                  <p className="max-w-lg mx-auto text-sm text-[var(--kj-muted-2)]">
                    {pickLoc(locale, {
                      ckb: `بۆ کردنەوەی ئەم بەشە، پێویستە سەرەتا وانەکانی گڕوپی پێشوو تەواو بکەیت و بە نمرەی ${effectivePracticeConfig.passThresholdPercent}% یان زیاتر لە تاقیکردنەوەکە دەربچیت.`,
                      kmr: `Bo vekirina vê beşê, pêşî divê waneyên koma berê temam bikî û bi ${effectivePracticeConfig.passThresholdPercent}% yan zêdetir derbas bibî.`,
                      ar: `لفتح هذه الوحدة، أكمل دروس الوحدة السابقة واجتز التقييم الخاص بها بنسبة ${effectivePracticeConfig.passThresholdPercent}% على الأقل.`,
                      en: `Complete the previous learning group and pass its Practice & Assessment with at least ${effectivePracticeConfig.passThresholdPercent}% to unlock this group.`,
                    })}
                  </p>
                  {(() => {
                    const blocker = getFirstBlockingModule(activePracticeModule.groupIndex);
                    return blocker ? (
                      <Button variant="primary" onClick={() => handleOpenModuleAssessment(blocker)}>
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {pickLoc(locale, {
                            ckb: `چوون بۆ تاقیکردنەوەی گڕوپی ${String(blocker.groupIndex).padStart(2, '0')} »`,
                            kmr: `Biçe Ezmûna Koma ${String(blocker.groupIndex).padStart(2, '0')} »`,
                            ar: `الانتقال إلى تقييم الوحدة ${String(blocker.groupIndex).padStart(2, '0')} »`,
                            en: `Open Group ${String(blocker.groupIndex).padStart(2, '0')} Assessment »`,
                          })}
                        </span>
                      </Button>
                    ) : null;
                  })()}
                </Surface>
              ) : (
                <div className="space-y-4">
                  {justUnlockedModuleId === activePracticeModule.moduleId && (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/12 px-5 py-4 flex items-center gap-3 text-sm text-emerald-800 dark:text-emerald-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <strong className="font-bold">
                          {pickLoc(locale, {
                            ckb: 'هەموو وانەکانی ئەم گڕوپەت تەواو کرد! ',
                            kmr: 'Te hemû waneyên vê komê temam kirin! ',
                            ar: 'أكملت جميع دروس هذه الوحدة بنجاح! ',
                            en: 'Learning group lessons complete! ',
                          })}
                        </strong>
                        <span>
                          {pickLoc(locale, {
                            ckb: 'ڕاهێنان و تاقیکردنەوەی ئەم گڕوپە بە شێوەی خۆکار کرایەوە.',
                            kmr: 'Rahênan û ezmûna vê komê bi xwekarî hate vekirin.',
                            ar: 'تم فتح التدريب والتقييم التفاعلي تلقائياً لهذه الوحدة.',
                            en: 'Your adapted Practice & Assessment unlocked automatically below.',
                          })}
                        </span>
                      </div>
                    </div>
                  )}

                  <IntegratedPracticePanel
                    module={activePracticeModule}
                    courseTitle={cleanTitle(currentCourse.titles[locale] || currentCourse.titles.en)}
                    savedProgress={modulePracticeProgress[activePracticeModule.moduleId]}
                    nextModuleFirstLessonId={
                      learningModules.find((m) => m.groupIndex === activePracticeModule.groupIndex + 1)?.lessons[0]?.id
                    }
                    onSelectLesson={(lessonId) => {
                      setActiveLessonId(lessonId);
                      setAcademyViewMode('lesson');
                    }}
                    onContinueNextGroup={() => {
                      const nextMod = learningModules.find(
                        (m) => m.groupIndex === activePracticeModule.groupIndex + 1
                      );
                      if (nextMod?.lessons[0]) {
                        setActiveLessonId(nextMod.lessons[0].id);
                        setActiveModuleIndex(nextMod.groupIndex);
                        setAcademyViewMode('lesson');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  />
                </div>
              )
            ) : !isGroupUnlocked(currentLessonModule?.groupIndex || 1) ? (
              <Surface className="p-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center text-amber-500">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[var(--kj-ink)]">
                  {pickLoc(locale, {
                    ckb: 'بۆ بەردەوامبوون تاقیکردنەوەی پێشوو تەواو بکە',
                    kmr: 'Bo berdewamkirinê ezmûna berê temam bike',
                    ar: 'أكمل التقييم السابق للمتابعة',
                    en: 'Complete Previous Assessment to Unlock',
                  })}
                </h3>
                <p className="max-w-lg mx-auto text-sm text-[var(--kj-muted-2)]">
                  {pickLoc(locale, {
                    ckb: `وانەکان بە شێوەی گڕوپی ${effectivePracticeConfig.lessonsPerGroup} وانەیی ڕێکخراون. تکایە تاقیکردنەوەی گڕوپی پێشوو بە ${effectivePracticeConfig.passThresholdPercent}% یان زیاتر تێپەڕێنە.`,
                    kmr: `Wane bi komên ${effectivePracticeConfig.lessonsPerGroup} waneyî hatine rêzkirin. Ji kerema xwe ezmûna koma berê derbas bike.`,
                    ar: `الدروس منظمة في مجموعات من ${effectivePracticeConfig.lessonsPerGroup} دروس. يرجى اجتياز تقييم الوحدة السابقة بنسبة ${effectivePracticeConfig.passThresholdPercent}% على الأقل.`,
                    en: `Lessons are organized in groups of ${effectivePracticeConfig.lessonsPerGroup}. Pass the previous module's Practice & Assessment (${effectivePracticeConfig.passThresholdPercent}%+) to unlock this group.`,
                  })}
                </p>
                {(() => {
                  const blocker = getFirstBlockingModule(currentLessonModule?.groupIndex || 2);
                  return blocker ? (
                    <Button variant="primary" onClick={() => handleOpenModuleAssessment(blocker)}>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {pickLoc(locale, {
                          ckb: `کردنەوەی تاقیکردنەوەی گڕوپی ${String(blocker.groupIndex).padStart(2, '0')} »`,
                          kmr: `Vekirina Ezmûna Koma ${String(blocker.groupIndex).padStart(2, '0')} »`,
                          ar: `فتح تقييم الوحدة ${String(blocker.groupIndex).padStart(2, '0')} »`,
                          en: `Open Practice & Assessment ${String(blocker.groupIndex).padStart(2, '0')} »`,
                        })}
                      </span>
                    </Button>
                  ) : null;
                })()}
              </Surface>
            ) : (
            <Surface className="p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[var(--kj-border)] pb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--kj-muted)]">
                    {currentLesson.courseId.toUpperCase()} · {currentLesson.difficulty}
                    {isCompleted ? ` · ${t.academy.completed}` : ''}
                  </p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--kj-ink)]">
                    {cleanTitle(content.title)}
                  </h2>
                </div>
                <Button
                  variant={isCompleted ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={handleCompleteAndAutoUnlock}
                >
                  <Check className="h-4 w-4" />
                  <span>{isCompleted ? t.academy.completed : t.academy.markComplete}</span>
                </Button>
              </div>

              {/* Intro */}
              <section className="mb-7">
                <h3 className="mb-2 text-base font-bold text-[var(--kj-ink)]">
                  {t.academy.intro}
                </h3>
                <p className="max-w-[72ch] text-[15px] leading-7 text-[var(--kj-muted-2)] whitespace-pre-line">
                  {content.intro}
                </p>
              </section>

              {/* Objectives */}
              <section className="mb-7">
                <h3 className="mb-2.5 text-base font-bold text-[var(--kj-ink)]">
                  {t.academy.objectives}
                </h3>
                <ul className="list-disc space-y-1.5 ps-5 text-sm leading-6 text-[var(--kj-muted-2)]">
                  {content.objectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </section>

              {/* Explanation */}
              <section className="mb-7">
                <h3 className="mb-2 text-base font-bold text-[var(--kj-ink)]">
                  {t.academy.explanation}
                </h3>
                <div className="max-w-[72ch] text-[15px] leading-7 text-[var(--kj-muted-2)] whitespace-pre-line">
                  {content.explanation}
                </div>
              </section>

              {/* Syntax (never translated, strictly LTR) */}
              <section className="mb-7">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-[var(--kj-ink)]">
                    {t.academy.syntax}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void copyCode('syntax', currentLesson.sharedCode.syntax)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedBlock === 'syntax' ? t.common.copied : t.common.copy}</span>
                  </Button>
                </div>
                <p className="mb-3 text-sm text-[var(--kj-muted)] whitespace-pre-line">{content.syntaxNotes}</p>
                <pre
                  dir="ltr"
                  className="kj-code-window overflow-x-auto p-4 font-mono text-xs leading-6"
                >
                  <code>{currentLesson.sharedCode.syntax}</code>
                </pre>
              </section>

              {/* Full Code Examples */}
              <section className="mb-7 space-y-4">
                <h3 className="text-base font-bold text-[var(--kj-ink)]">
                  {t.academy.codeExample}
                </h3>
                {(
                  [
                    { key: 'html', label: 'HTML', code: currentLesson.sharedCode.html },
                    { key: 'css', label: 'CSS', code: currentLesson.sharedCode.css },
                    { key: 'js', label: 'JavaScript', code: currentLesson.sharedCode.js },
                  ] as const
                )
                  .filter((b) => b.code.trim().length > 0)
                  .map((block) => (
                    <div key={block.key} className="kj-code-window">
                      <div className="kj-code-bar flex items-center justify-between px-4 py-2.5">
                        <span className="font-mono text-xs font-semibold">
                          {block.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openLessonInEditor(currentLesson)}
                            className="kj-btn-primary inline-flex items-center gap-1 rounded-[5px] px-3 py-1 text-xs cursor-pointer"
                            title="Try it Yourself in Code Lab"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            <span>{t.academy.tryItYourself} »</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => void copyCode(block.key, block.code)}
                            className="inline-flex items-center gap-1 text-xs hover:text-white cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span>{copiedBlock === block.key ? t.common.copied : t.common.copy}</span>
                          </button>
                        </div>
                      </div>
                      <pre
                        dir="ltr"
                        className="overflow-x-auto p-4 font-mono text-xs leading-6"
                      >
                        <code>{block.code}</code>
                      </pre>
                    </div>
                  ))}
              </section>

              {/* Try It Yourself Callout (dist.zip .lesson-callout) */}
              <section className="kj-callout mb-7 rounded-[6px] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[var(--kj-ink)]">
                      {t.academy.tryItYourself}
                    </h3>
                    <p className="mt-1 text-sm whitespace-pre-line">
                      {content.tryItPrompt}
                    </p>
                  </div>
                  <Button onClick={() => openLessonInEditor(currentLesson)}>
                    <Code2 className="h-4 w-4" />
                    <span>{t.academy.openInEditor}</span>
                  </Button>
                </div>
              </section>

              {/* Common Mistakes */}
              <section className="mb-7">
                <h3 className="mb-2.5 text-base font-bold text-[var(--kj-ink)]">
                  {t.academy.commonMistakes}
                </h3>
                <ul className="list-disc space-y-1.5 ps-5 text-sm leading-6 text-[var(--kj-muted-2)]">
                  {content.commonMistakes.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </section>

              {/* Summary */}
              <section className="rounded-[7px] border border-[var(--kj-border)] bg-[var(--kj-soft)] p-4">
                <h3 className="mb-1 text-sm font-bold text-[var(--kj-ink)]">
                  {t.academy.summary}
                </h3>
                <p className="text-sm leading-6 text-[var(--kj-muted-2)] whitespace-pre-line">
                  {content.summary}
                </p>
              </section>

              {/* Integrated Module Practice & Assessment Connector Card */}
              {effectivePracticeConfig.enabled && currentLessonModule && (
                <div className="kj-callout mt-7 flex flex-wrap items-center justify-between gap-4 rounded-[8px] border border-[var(--kj-green)]/30 p-5">
                  {(() => {
                    const modDone = currentLessonModule.lessons.filter((l) =>
                      completedLessonIds.has(l.id)
                    ).length;
                    const modTotal = currentLessonModule.lessons.length;
                    const modSaved = modulePracticeProgress[currentLessonModule.moduleId];
                    const ready = isPracticeReady(currentLessonModule);
                    const nextUnreadInMod = currentLessonModule.lessons.find(
                      (l) => !completedLessonIds.has(l.id) && l.id !== currentLesson.id
                    );
                    const modPad = String(currentLessonModule.groupIndex).padStart(2, '0');

                    return (
                      <>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--kj-green)]/12 px-2.5 py-0.5 text-[11px] font-bold text-[var(--kj-green)]">
                              <Sparkles className="h-3 w-3" />
                              {pickLoc(locale, {
                                ckb: `گڕوپی ${modPad} · ${modDone}/${modTotal} وانە تەواو بووە`,
                                kmr: `Koma ${modPad} · ${modDone}/${modTotal} wane temam`,
                                ar: `الوحدة ${modPad} · اكتمل ${modDone}/${modTotal} دروس`,
                                en: `Module ${modPad} · ${modDone}/${modTotal} Lessons Completed`,
                              })}
                            </span>
                            {modSaved?.passed && (
                              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                {pickLoc(locale, {
                                  ckb: `دەرچوویت · ${modSaved.bestScorePercent}% ✓`,
                                  kmr: `Derbas bû · ${modSaved.bestScorePercent}% ✓`,
                                  ar: `تم الاجتياز · ${modSaved.bestScorePercent}% ✓`,
                                  en: `Passed · ${modSaved.bestScorePercent}% ✓`,
                                })}
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-bold text-[var(--kj-ink)]">
                            {pickLoc(locale, currentLessonModule.title)}
                          </h4>
                          <p className="text-xs text-[var(--kj-muted-2)]">
                            {ready
                              ? pickLoc(locale, {
                                  ckb: 'ڕاهێنان و تاقیکردنەوەی ئەم گڕوپە کراوەیە — هەڵبژاردن، دۆزینەوەی هەڵە، تەواوکردن و کۆدنینگ!',
                                  kmr: 'Rahênan û ezmûna vê komê vekirî ye — pirsên curbecur û edîtorê kodê!',
                                  ar: 'التدريب والتقييم التفاعلي متاح الآن — اختيار من متعدد، إصلاح أخطاء، إكمال كود، ومحرر تفاعلي!',
                                  en: 'Interactive module assessment is unlocked — MCQs, Find & Fix bugs, Code completion, and Live Editor challenges.',
                                })
                              : pickLoc(locale, {
                                  ckb: `هەر ${modTotal} وانەکەی ئەم گڕوپە تەواو بکە تا تاقیکردنەوەکە بە خۆکار بکرێتەوە.`,
                                  kmr: `Her ${modTotal} waneyên vê komê temam bike da ku ezmûn bi xwekarî vebe.`,
                                  ar: `أكمل دروس هذه الوحدة (${modTotal}) لفتح التقييم التفاعلي تلقائياً.`,
                                  en: `Complete all ${modTotal} lessons in this group to automatically unlock its Practice & Assessment.`,
                                })}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {ready ? (
                            <Button
                              variant="primary"
                              onClick={() => handleOpenModuleAssessment(currentLessonModule)}
                            >
                              <Sparkles className="h-4 w-4" />
                              <span>
                                {modSaved?.passed
                                  ? pickLoc(locale, {
                                      ckb: 'پێداچوونەوە / دووبارەکردنەوەی تاقیکردنەوە »',
                                      kmr: 'Pêdaçûn / Ezmûnê Dîsa Biceribîne »',
                                      ar: 'مراجعة / إعادة التقييم »',
                                      en: 'Review or Retry Assessment »',
                                    })
                                  : pickLoc(locale, {
                                      ckb: `کردنەوەی تاقیکردنەوەی گڕوپی ${modPad} »`,
                                      kmr: `Ezmûna Koma ${modPad} Veke »`,
                                      ar: `فتح تقييم الوحدة ${modPad} »`,
                                      en: `Start Module ${modPad} Assessment »`,
                                    })}
                              </span>
                            </Button>
                          ) : nextUnreadInMod ? (
                            <Button
                              variant="secondary"
                              onClick={() => handleSelectLessonFromNav(nextUnreadInMod.id, currentLessonModule)}
                            >
                              <span>
                                {pickLoc(locale, {
                                  ckb: `بڕۆ بۆ وانەی ${String(nextUnreadInMod.order).padStart(2, '0')} »`,
                                  kmr: `Biçe Waneya ${String(nextUnreadInMod.order).padStart(2, '0')} »`,
                                  ar: `انتقل إلى الدرس ${String(nextUnreadInMod.order).padStart(2, '0')} »`,
                                  en: `Go to Lesson ${String(nextUnreadInMod.order).padStart(2, '0')} »`,
                                })}
                              </span>
                            </Button>
                          ) : null}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Previous / Next Navigation */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--kj-border)] pt-5">
                {prevLesson ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const prevMod = learningModules.find((m) => m.lessonIds.includes(prevLesson.id));
                      if (prevMod) handleSelectLessonFromNav(prevLesson.id, prevMod);
                      else setActiveLessonId(prevLesson.id);
                    }}
                  >
                    {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    <span>{t.academy.previousLesson}</span>
                  </Button>
                ) : (
                  <div />
                )}
                {nextLesson ? (
                  (() => {
                    const nextMod = learningModules.find((m) => m.lessonIds.includes(nextLesson.id));
                    const nextGroupLocked = nextMod ? !isGroupUnlocked(nextMod.groupIndex) : false;
                    if (nextGroupLocked && currentLessonModule && effectivePracticeConfig.enabled) {
                      return (
                        <Button
                          variant="primary"
                          onClick={() => handleOpenModuleAssessment(currentLessonModule)}
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>
                            {pickLoc(locale, {
                              ckb: `تاقیکردنەوەی گڕوپی ${String(currentLessonModule.groupIndex).padStart(2, '0')} بۆ کردنەوەی داهاتوو »`,
                              kmr: `Ezmûna Koma ${String(currentLessonModule.groupIndex).padStart(2, '0')} bo vekirina bê »`,
                              ar: `تقييم الوحدة ${String(currentLessonModule.groupIndex).padStart(2, '0')} لفتح التالي »`,
                              en: `Practice & Assessment ${String(currentLessonModule.groupIndex).padStart(2, '0')} »`,
                            })}
                          </span>
                        </Button>
                      );
                    }
                    return (
                      <Button
                        onClick={() => {
                          if (nextMod) handleSelectLessonFromNav(nextLesson.id, nextMod);
                          else setActiveLessonId(nextLesson.id);
                        }}
                      >
                        <span>{t.academy.nextLesson}</span>
                        {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    );
                  })()
                ) : currentLessonModule && effectivePracticeConfig.enabled ? (
                  <Button
                    variant="primary"
                    onClick={() => handleOpenModuleAssessment(currentLessonModule)}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {pickLoc(locale, {
                        ckb: `تاقیکردنەوەی کۆتایی گڕوپی ${String(currentLessonModule.groupIndex).padStart(2, '0')} »`,
                        kmr: `Ezmûna Koma ${String(currentLessonModule.groupIndex).padStart(2, '0')} »`,
                        ar: `التقييم النهائي للوحدة ${String(currentLessonModule.groupIndex).padStart(2, '0')} »`,
                        en: `Module ${String(currentLessonModule.groupIndex).padStart(2, '0')} Assessment »`,
                      })}
                    </span>
                  </Button>
                ) : null}
              </div>
            </Surface>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};
