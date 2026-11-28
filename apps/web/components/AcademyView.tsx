import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Layers,
  Lock,
  Play,
  Sparkles,
  ArrowUpRight,
  ListTree,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_COURSES, ALL_CHAPTERS } from '../data/courses/coursesList';
import { SEED_CHAPTERS, SEED_COURSES } from '../data/seedCatalog';
import { cleanTitle, pickLoc } from '../i18n/translations';
import type { Locale, PracticeModule, TrackId } from '../types/domain';
import { buildCourseLearningModules, getEffectivePracticeConfig } from '../lib/practiceModuleEngine';
import { IntegratedPracticePanel } from './IntegratedPracticePanel';
import { Button, Surface } from './ui/Primitives';

const ACADEMY_UI: Record<
  Locale,
  {
    home: string;
    academy: string;
    learningSpace: string;
    courseSuffix: string;
    progressLabel: (done: number, total: number) => string;
    curriculumLabel: string;
    needHandTitle: string;
    needHandDesc: string;
    askAiLink: string;
    openCodeLabLink: string;
    whatYouLearn: string;
    syntaxTag: string;
    exampleTag: string;
    onThisPage: string;
    keepItUp: string;
    yourProgress: string;
    yourProgressDesc: string;
    overallProgress: string;
    continueLearningHeading: string;
    continueLearningSub: string;
    upNextPractice: string;
    upNextLesson: string;
    continueBtn: string;
    startPracticeBtn: string;
    markCompleteToast: string;
    markIncompleteToast: string;
    minRead: (m: number) => string;
    showMenu: string;
    hideMenu: string;
    lessonLabel: string;
    completedBadge: string;
  }
> = {
  ckb: {
    home: 'سەرەکی',
    academy: 'ئەکادیمیا',
    learningSpace: 'بۆشایی فێربوونت',
    courseSuffix: 'کۆرسی',
    progressLabel: (done, total) => `${done} لە ${total} وانە تەواوکراوە`,
    curriculumLabel: 'پرۆگرامی خوێندن',
    needHandTitle: 'پێویستت بە یارمەتی هەیە؟',
    needHandDesc: 'ئەگەر هەر پرسیارێکت هەیە دەتوانیت لە مامۆستای AI بپرسیت یان کۆد تاقی بکەیتەوە.',
    askAiLink: 'مامۆستای karejan AI',
    openCodeLabLink: 'تاقیگەی کۆد',
    whatYouLearn: 'چی فێردەبیت',
    syntaxTag: 'ڕێزمان و شێواز',
    exampleTag: 'نموونەی کۆد',
    onThisPage: 'لەم پەڕەیەدا',
    keepItUp: 'بەردەوام بە',
    yourProgress: 'پێشکەوتنەکەت',
    yourProgressDesc: 'بە هەنگاوی جێگیر بناغەیەکی بەهێز بنیات دەنێیت.',
    overallProgress: 'کۆی گشتی پلاتفۆرم:',
    continueLearningHeading: 'بەردەوامبە لە فێربوون',
    continueLearningSub: 'لەسەر ئەوەی فێریبوویت هەنگاوی داهاتوو بنێ.',
    upNextPractice: 'دواتر · ڕاهێنان و تاقیکردنەوە',
    upNextLesson: 'وانەی داهاتوو',
    continueBtn: 'وانەی داهاتوو',
    startPracticeBtn: 'دەستپێکردنی تاقیکردنەوە',
    markCompleteToast: 'نایابە! پێشکەوتنەکەت پاشەکەوت کرا.',
    markIncompleteToast: 'وانەکە وەک تەواونەکراو نیشانکرا.',
    minRead: (m) => `${m} خولەک خوێندنەوە`,
    showMenu: 'پیشاندانی لیستی وانەکان',
    hideMenu: 'شاردنەوەی لیست',
    lessonLabel: 'وانە',
    completedBadge: 'تەواوکراوە ✓',
  },
  kmr: {
    home: 'سەرەکی',
    academy: 'ئەکادیمیا',
    learningSpace: 'جهێ فێربوونا تە',
    courseSuffix: 'کۆرسێ',
    progressLabel: (done, total) => `${done} ژ ${total} وانەیان تمامبووینە`,
    curriculumLabel: 'پرۆگرامێ خاندنێ',
    needHandTitle: 'پێدڤی ب هاریکاریێ ی؟',
    needHandDesc: 'دشێی پرسیاران ژ مامۆستایێ AI بکەی یان د تاقیگەهێ دا کۆدی تاقی بکەی.',
    askAiLink: 'مامۆستایێ karejan AI',
    openCodeLabLink: 'تاقیگەها کۆدی',
    whatYouLearn: 'دێ چ فێربی',
    syntaxTag: 'ڕێزمان و شێواز',
    exampleTag: 'نموونەیا کۆدی',
    onThisPage: 'د ڤی لاپەڕەی دا',
    keepItUp: 'بەردەوام بە',
    yourProgress: 'پێشکەفتنا تە',
    yourProgressDesc: 'ب پێنگاڤێن جێگیر بنیاتەکێ بهێز ددانی.',
    overallProgress: 'تەڤایا پلاتفۆرمێ:',
    continueLearningHeading: 'بەردەوام بە د فێربوونێ دا',
    continueLearningSub: 'لسەر تشتێ فێربوویی پێنگاڤا بهێت بهاڤێژە.',
    upNextPractice: 'پاشتر · ڕاهێنان و ئەزموون',
    upNextLesson: 'وانەیا بهێت',
    continueBtn: 'وانەیا بهێت',
    startPracticeBtn: 'دەستپێکرنا ئەزموونێ',
    markCompleteToast: 'دەستخۆش! پێشکەفتنا تە هاتە پاشکەفتکرن.',
    markIncompleteToast: 'وانە وەک تمامنەکری هاتە نیشانکرن.',
    minRead: (m) => `${m} خولەک خواندن`,
    showMenu: 'نیشاندانا لیستەیا وانان',
    hideMenu: 'ڤەشارتنا لیستەیێ',
    lessonLabel: 'وانە',
    completedBadge: 'تمامبوویە ✓',
  },
  ar: {
    home: 'الرئيسية',
    academy: 'الأكاديمية',
    learningSpace: 'مساحة تعلّمك',
    courseSuffix: 'مسار',
    progressLabel: (done, total) => `اكتمل ${done} من ${total} درساً`,
    curriculumLabel: 'المنهج التعليمي',
    needHandTitle: 'هل تحتاج إلى مساعدة؟',
    needHandDesc: 'اسأل المساعد الذكي أو افتح مختبر الكود لتجربة الأمثلة بحرية.',
    askAiLink: 'مساعد karejan AI',
    openCodeLabLink: 'مختبر الكود',
    whatYouLearn: 'ماذا ستتعلّم',
    syntaxTag: 'الصياغة الأساسية',
    exampleTag: 'مثال عملي',
    onThisPage: 'محتويات الدرس',
    keepItUp: 'استمر بالتقدّم',
    yourProgress: 'تقدّمك الدراسي',
    yourProgressDesc: 'أنت تبني أساساً برمجياً متيناً خطوة بخطوة.',
    overallProgress: 'إجمالي المنصة:',
    continueLearningHeading: 'واصل التعلّم',
    continueLearningSub: 'انتقل للخطوة التالية وابنِ على ما تعلّمته الآن.',
    upNextPractice: 'التالي · التدريب والتقييم',
    upNextLesson: 'الدرس التالي',
    continueBtn: 'متابعة الدرس',
    startPracticeBtn: 'بدء التقييم',
    markCompleteToast: 'أحسنت! تم حفظ تقدّمك بنجاح.',
    markIncompleteToast: 'تم تحديد الدرس كغير مكتمل.',
    minRead: (m) => `${m} دقائق للقراءة`,
    showMenu: 'إظهار قائمة الدروس',
    hideMenu: 'إخفاء القائمة',
    lessonLabel: 'درس',
    completedBadge: 'مكتمل ✓',
  },
  en: {
    home: 'Home',
    academy: 'Academy',
    learningSpace: 'YOUR LEARNING SPACE',
    courseSuffix: 'COURSE',
    progressLabel: (done, total) => `${done} of ${total} lessons completed`,
    curriculumLabel: 'YOUR CURRICULUM',
    needHandTitle: 'Need a hand?',
    needHandDesc: 'Ask karejan AI for step-by-step explanations or experiment in Code Lab.',
    askAiLink: 'Open AI Tutor',
    openCodeLabLink: 'Open Code Lab',
    whatYouLearn: 'WHAT YOU’LL LEARN',
    syntaxTag: 'SYNTAX',
    exampleTag: 'EXAMPLE',
    onThisPage: 'ON THIS PAGE',
    keepItUp: 'KEEP IT UP',
    yourProgress: 'Your progress',
    yourProgressDesc: 'You’re building a solid foundation. Keep going!',
    overallProgress: 'Platform overall:',
    continueLearningHeading: 'Continue learning',
    continueLearningSub: 'Build on what you have learned so far.',
    upNextPractice: 'UP NEXT · GROUP PRACTICE & TEST',
    upNextLesson: 'UP NEXT · LESSON',
    continueBtn: 'Continue lesson',
    startPracticeBtn: 'Start practice',
    markCompleteToast: 'Great work! Your progress is saved.',
    markIncompleteToast: 'Lesson marked as incomplete.',
    minRead: (m) => `${m} min read`,
    showMenu: 'Browse all lessons',
    hideMenu: 'Hide curriculum',
    lessonLabel: 'Lesson',
    completedBadge: 'Completed ✓',
  },
};

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
    setActiveView,
  } = useApp();

  const isStaff = staffRole !== 'user';
  const copy = pickLoc(locale, ACADEMY_UI);

  const activeLesson = useMemo(
    () => lessons.find((l) => l.id === activeLessonId) || lessons[0],
    [lessons, activeLessonId]
  );

  const [selectedTrack, setSelectedTrack] = useState<TrackId>(activeLesson?.courseId || 'html');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const [lessonSearch, setLessonSearch] = useState('');
  const [justUnlockedModuleId, setJustUnlockedModuleId] = useState<string | null>(null);
  const [completionFeedback, setCompletionFeedback] = useState<string | null>(null);
  const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeLesson?.courseId && activeLesson.courseId !== selectedTrack) {
      setSelectedTrack(activeLesson.courseId);
    }
  }, [activeLesson?.courseId, selectedTrack]);

  useEffect(() => {
    setCompletionFeedback(null);
  }, [activeLesson?.id]);

  const rawCourses = courses && courses.length > 0 ? courses : SEED_COURSES || ALL_COURSES || [];
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

  const doneInTrack = useMemo(
    () => trackLessons.filter((l) => completedLessonIds.has(l.id)).length,
    [trackLessons, completedLessonIds]
  );

  const trackPercent = trackLessons.length ? Math.round((doneInTrack / trackLessons.length) * 100) : 0;

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
    setMobileCurriculumOpen(false);
    const first = lessons.filter((l) => l.courseId === track).sort((a, b) => a.order - b.order)[0];
    if (first) setActiveLessonId(first.id);
    setActiveModuleIndex(1);
  };

  const handleSelectLessonFromNav = (lessonId: string, mod: PracticeModule) => {
    setMobileCurriculumOpen(false);
    if (!isGroupUnlocked(mod.groupIndex)) {
      const blocker = getFirstBlockingModule(mod.groupIndex) || mod;
      setActiveModuleIndex(blocker.groupIndex);
      setAcademyViewMode('assessment');
      return;
    }
    setActiveLessonId(lessonId);
    setActiveModuleIndex(mod.groupIndex);
    setAcademyViewMode('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenModuleAssessment = (mod: PracticeModule) => {
    setMobileCurriculumOpen(false);
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
    setCompletionFeedback(wasComplete ? copy.markIncompleteToast : copy.markCompleteToast);

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

  const toggleGroupCollapse = (moduleId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
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
  const estimatedReadMins = Math.max(
    4,
    Math.min(14, Math.ceil((content.intro.length + content.explanation.length) / 360))
  );

  const courseDisplayName = cleanTitle(currentCourse.titles[locale] || currentCourse.titles.en);
  const nextModForNextLesson = nextLesson
    ? learningModules.find((m) => m.lessonIds.includes(nextLesson.id))
    : undefined;
  const isNextGroupBlocked = nextModForNextLesson ? !isGroupUnlocked(nextModForNextLesson.groupIndex) : false;

  return (
    <div>
      {/* 1. Deep Forest Course Ribbon matching academy.html .topics */}
      <nav aria-label={t.academy.coursesLabel} className="border-b border-[#20483b] bg-[#17372d] text-[#e0efe7] overflow-x-auto">
        <div className="mx-auto flex min-h-[48px] max-w-[1600px] items-center gap-6 px-4 sm:px-8 whitespace-nowrap">
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
                className={`inline-flex items-center gap-2 border-b-2 py-3 text-[11px] font-bold uppercase tracking-[0.04em] transition-colors shrink-0 cursor-pointer ${
                  active
                    ? 'border-[#7ce3b3] text-[#9cebc3]'
                    : 'border-transparent text-[#e0efe7]/85 hover:text-[#9cebc3]'
                }`}
              >
                <span>{course.id === 'tsx' ? 'TYPESCRIPT' : course.id.toUpperCase()}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] opacity-85 tabular-nums">
                  {doneInCourse}/{courseLessons.length}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. Clean White Breadcrumb Bar matching academy.css .breadcrumb */}
      <div className="border-b border-[var(--kj-border)] bg-[var(--kj-card)]">
        <div className="mx-auto flex min-h-[58px] max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-8 text-[13px] text-[#789185] dark:text-[var(--kj-muted)]">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <button type="button" onClick={() => setActiveView('home')} className="hover:text-[#087f5b] dark:hover:text-[#9cebc3] cursor-pointer">
              {copy.home}
            </button>
            <span aria-hidden="true">/</span>
            <button type="button" onClick={() => setAcademyViewMode('lesson')} className="hover:text-[#087f5b] dark:hover:text-[#9cebc3] cursor-pointer">
              {copy.academy}
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[var(--kj-ink)]">{selectedTrack.toUpperCase()}</span>
            <span aria-hidden="true">/</span>
            <span className="truncate font-bold text-[#087f5b] dark:text-[#7ce3b3]">
              {academyViewMode === 'assessment' && activePracticeModule
                ? pickLoc(locale, activePracticeModule.title)
                : cleanTitle(content.title)}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <strong className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
              {copy.learningSpace}
            </strong>
            {nextIncompleteLesson && (
              <button
                type="button"
                onClick={() => {
                  setSelectedTrack(nextIncompleteLesson.courseId);
                  setActiveLessonId(nextIncompleteLesson.id);
                  setAcademyViewMode('lesson');
                }}
                className="inline-flex items-center gap-1.5 rounded-[9px] bg-[#e4f2e9] px-3 py-1.5 text-xs font-bold text-[#126548] hover:bg-[#d0ebda] dark:bg-[#173a2d] dark:text-[#9cebc3] cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{t.common.continueLearning}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Two-Column Academy Shell matching academy.css .academy-layout */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[296px_minmax(0,1fr)]">
        {/* Left Course Sidebar matching academy.css .sidebar */}
        <aside
          aria-label={t.academy.coursesLabel}
          className="border-b border-[var(--kj-border)] bg-[var(--kj-card)] p-6 text-start lg:border-b-0 lg:border-e lg:px-6 lg:py-8"
        >
          <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
            {isRtl ? `${copy.courseSuffix} ${selectedTrack.toUpperCase()}` : `${selectedTrack.toUpperCase()} ${copy.courseSuffix}`}
          </p>
          <h2 className="mt-2.5 text-[22px] font-extrabold tracking-tight text-[var(--kj-ink)]">
            {courseDisplayName}
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[var(--kj-muted)]">
            {copy.progressLabel(doneInTrack, trackLessons.length)}
          </p>
          <div className="mt-3 h-[7px] w-full overflow-hidden rounded-full bg-[#dcece1] dark:bg-[#1a3c2f]" aria-hidden="true">
            <span
              className="block h-full rounded-full bg-[#10a775] transition-all duration-300"
              style={{ width: `${trackPercent}%` }}
            />
          </div>

          <div className="mt-6 flex items-center justify-between gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileCurriculumOpen((o) => !o)}
              className="inline-flex w-full items-center justify-between rounded-[10px] border border-[var(--kj-border)] bg-[var(--kj-soft)] px-3.5 py-2.5 text-xs font-bold text-[var(--kj-ink)] cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <ListTree className="h-4 w-4 text-[#087f5b] dark:text-[#7ce3b3]" />
                <span>{mobileCurriculumOpen ? copy.hideMenu : copy.showMenu}</span>
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileCurriculumOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className={`${mobileCurriculumOpen ? 'block' : 'hidden'} lg:block`}>
            <p className="mt-7 mb-3 text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#8c9f94]">
              {copy.curriculumLabel}
            </p>

            <input
              type="text"
              value={lessonSearch}
              onChange={(e) => setLessonSearch(e.target.value)}
              placeholder={pickLoc(locale, {
                ckb: 'گەڕان لەناو وانەکان...',
                kmr: 'لێگەڕیان د ناڤ وانەیان دا...',
                ar: 'ابحث في الدروس...',
                en: 'Search lessons...',
              })}
              className="mb-4 w-full rounded-[9px] border border-[var(--kj-border)] bg-[var(--kj-soft)] px-3 py-2 text-xs text-[var(--kj-ink)] placeholder:text-[var(--kj-muted)] outline-none focus:border-[#087f5b]"
            />

            <div className="max-h-[580px] overflow-y-auto pe-1">
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
                          className={`flex w-full items-start justify-between gap-2 rounded-[8px] px-2.5 py-2.5 text-start text-xs transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#e5f5eb] font-bold text-[#087f5b] dark:bg-[#173a2d] dark:text-[#9cebc3]'
                              : !unlocked
                                ? 'text-[var(--kj-muted)] opacity-60 hover:bg-[var(--kj-soft)]'
                                : 'text-[#60786b] hover:bg-[#f1f8f3] hover:text-[#18362b] dark:text-[var(--kj-muted-2)] dark:hover:bg-[var(--kj-soft)]'
                          }`}
                        >
                          <span className="leading-snug">
                            <span className="me-2 font-mono text-[11px] opacity-75 tabular-nums">
                              {done ? '✓' : String(lesson.order).padStart(2, '0')}
                            </span>
                            {cleanTitle(locText.title)}
                          </span>
                          {!unlocked && <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" />}
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
                    const containsActive = mod.lessonIds.includes(currentLesson.id) || isAssessingThisMod;
                    const isCollapsed = collapsedGroups[mod.moduleId] && !containsActive;
                    const pad2 = (n: number) => String(n).padStart(2, '0');

                    return (
                      <div
                        key={mod.moduleId}
                        className={`rounded-[12px] border p-2.5 transition-colors ${
                          containsActive
                            ? 'border-[#9ad4b5] bg-[#f7fbf8] dark:border-[#245743] dark:bg-[#142c24]'
                            : 'border-[var(--kj-border)] bg-[var(--kj-card)]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleGroupCollapse(mod.moduleId)}
                          className="flex w-full items-center justify-between px-1.5 py-1 text-[12px] font-bold text-[var(--kj-ink)] cursor-pointer"
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5 text-[#087f5b] dark:text-[#7ce3b3]" />
                            {pickLoc(locale, {
                              ckb: `گڕوپی ${pad2(mod.groupIndex)}`,
                              kmr: `Koma ${pad2(mod.groupIndex)}`,
                              ar: `الوحدة ${pad2(mod.groupIndex)}`,
                              en: `Group ${pad2(mod.groupIndex)}`,
                            })}
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#93a69a] tabular-nums">
                            <span>{groupUnlocked ? `${modDoneCount}/${mod.lessons.length}` : '🔒'}</span>
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                          </span>
                        </button>

                        {!isCollapsed && (
                          <>
                            <ol className="mt-2 space-y-0.5">
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
                                      className={`flex w-full items-start justify-between gap-2 rounded-[8px] px-2.5 py-2.5 text-start text-xs transition-colors cursor-pointer ${
                                        active
                                          ? 'bg-[#e5f5eb] font-bold text-[#087f5b] dark:bg-[#173a2d] dark:text-[#9cebc3]'
                                          : !groupUnlocked
                                            ? 'text-[var(--kj-muted)] opacity-60 hover:bg-[#f1f8f3] dark:hover:bg-[var(--kj-soft)]'
                                            : 'text-[#60786b] hover:bg-[#f1f8f3] hover:text-[#18362b] dark:text-[var(--kj-muted-2)] dark:hover:bg-[var(--kj-soft)]'
                                      }`}
                                    >
                                      <span className="leading-snug">
                                        <span className="me-2.5 font-mono text-[11px] opacity-80 tabular-nums">
                                          {done ? '✓' : pad2(lesson.order)}
                                        </span>
                                        {cleanTitle(locText.title)}
                                      </span>
                                      {!groupUnlocked && <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-70" />}
                                    </button>
                                  </li>
                                );
                              })}
                            </ol>

                            {effectivePracticeConfig.enabled && (
                              <div className="mt-2 border-t border-dashed border-[var(--kj-border)] pt-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenModuleAssessment(mod)}
                                  className={`flex w-full items-center justify-between gap-2 rounded-[8px] border px-2.5 py-2 text-start text-xs font-semibold transition-all cursor-pointer ${
                                    isAssessingThisMod
                                      ? 'border-[#087f5b] bg-[#e5f5eb] text-[#087f5b] dark:border-[#7ce3b3] dark:bg-[#173a2d] dark:text-[#9cebc3]'
                                      : savedModProgress?.passed
                                        ? 'border-[#9ad4b5] bg-[#e9f7ee] text-[#087f5b] dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300'
                                        : practiceReady
                                          ? 'border-[#77c99c] bg-[#f2faf5] text-[var(--kj-ink)] hover:border-[#087f5b] dark:bg-[#162f25]'
                                          : 'border-[var(--kj-border)] bg-[var(--kj-soft)] text-[var(--kj-muted)]'
                                  }`}
                                >
                                  <span className="flex items-center gap-1.5 min-w-0">
                                    {savedModProgress?.passed ? (
                                      <Award className="h-3.5 w-3.5 shrink-0 text-[#087f5b] dark:text-emerald-400" />
                                    ) : practiceReady ? (
                                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#087f5b] dark:text-[#7ce3b3]" />
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
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Sidebar Help Card matching academy.css .help-card */}
            <div className="mt-8 rounded-[12px] bg-[#f1f8f3] p-4.5 text-start dark:bg-[#152e25]">
              <h3 className="text-sm font-bold text-[var(--kj-ink)]">{copy.needHandTitle}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#789084] dark:text-[var(--kj-muted)]">
                {copy.needHandDesc}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-bold text-[#087f5b] dark:text-[#7ce3b3]">
                <button type="button" onClick={() => setActiveView('ai')} className="hover:underline cursor-pointer">
                  {copy.askAiLink} ↗
                </button>
                <button type="button" onClick={() => openLessonInEditor(currentLesson)} className="hover:underline cursor-pointer">
                  {copy.openCodeLabLink} ↗
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Lesson & Assessment Area matching academy.css .lesson-main */}
        <main id="lesson" className="min-w-0 px-4 py-8 sm:px-8 lg:px-14 lg:py-11">
          {/* Connected Group Stepper Pill Bar */}
          {currentLessonModule && (
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-3.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="me-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--kj-muted)]">
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
                      className={`inline-flex items-center gap-1 rounded-[8px] border px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                        isThisActive
                          ? 'border-[#087f5b] bg-[#e5f5eb] text-[#087f5b] dark:border-[#7ce3b3] dark:bg-[#173a2d] dark:text-[#9cebc3]'
                          : isDone
                            ? 'border-[#9ad4b5] bg-[#e9f7ee] text-[#087f5b] dark:border-emerald-500/35 dark:bg-emerald-500/15 dark:text-emerald-300'
                            : 'border-[var(--kj-border)] bg-[var(--kj-soft)] text-[var(--kj-muted-2)] hover:text-[var(--kj-ink)]'
                      }`}
                    >
                      {isDone && <Check className="h-3 w-3" />}
                      <span>{String(l.order).padStart(2, '0')}</span>
                    </button>
                  );
                })}
                {effectivePracticeConfig.enabled && (
                  <>
                    <span className="px-0.5 text-[var(--kj-muted)]">→</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleOpenModuleAssessment(
                          academyViewMode === 'assessment' ? activePracticeModule : currentLessonModule
                        )
                      }
                      className={`inline-flex items-center gap-1.5 rounded-[8px] border px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                        academyViewMode === 'assessment'
                          ? 'border-[#087f5b] bg-[#087f5b] text-white shadow-xs'
                          : isPracticeReady(currentLessonModule)
                            ? 'border-[#77c99c] bg-[#e9f7ee] text-[#087f5b] dark:bg-[#173a2d] dark:text-[#9cebc3]'
                            : 'border-[var(--kj-border)] bg-[var(--kj-soft)] text-[var(--kj-muted)]'
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
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
                  <BookOpen className="h-3.5 w-3.5" />
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

          {/* Conditional Assessment View vs Academy Lesson View */}
          {academyViewMode === 'assessment' && activePracticeModule ? (
            !isGroupUnlocked(activePracticeModule.groupIndex) ? (
              <Surface className="p-8 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/35 bg-amber-500/15 text-amber-500">
                  <Lock className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[var(--kj-ink)]">
                  {pickLoc(locale, {
                    ckb: `گڕوپی ${String(activePracticeModule.groupIndex).padStart(2, '0')} هێشتا داخراوە`,
                    kmr: `Koma ${String(activePracticeModule.groupIndex).padStart(2, '0')} hîn girtî ye`,
                    ar: `الوحدة ${String(activePracticeModule.groupIndex).padStart(2, '0')} ما زالت مقفلة`,
                    en: `Learning Group ${String(activePracticeModule.groupIndex).padStart(2, '0')} is Locked`,
                  })}
                </h3>
                <p className="mx-auto max-w-lg text-sm text-[var(--kj-muted-2)]">
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
                      <Sparkles className="h-4 w-4" />
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
                  <div className="flex items-center gap-3 rounded-[14px] border border-[#9ad4b5] bg-[#e9f7ee] px-5 py-4 text-sm text-[#0b5c42] dark:border-emerald-500/40 dark:bg-emerald-500/12 dark:text-emerald-200">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#087f5b] dark:text-emerald-400" />
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
                  courseTitle={courseDisplayName}
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
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/35 bg-amber-500/15 text-amber-500">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-extrabold text-[var(--kj-ink)]">
                {pickLoc(locale, {
                  ckb: 'بۆ بەردەوامبوون تاقیکردنەوەی پێشوو تەواو بکە',
                  kmr: 'Bo berdewamkirinê ezmûna berê temam bike',
                  ar: 'أكمل التقييم السابق للمتابعة',
                  en: 'Complete Previous Assessment to Unlock',
                })}
              </h3>
              <p className="mx-auto max-w-lg text-sm text-[var(--kj-muted-2)]">
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
                    <Sparkles className="h-4 w-4" />
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
            <>
              {/* Lesson Heading matching academy.css .lesson-heading */}
              <div className="mb-8 text-start">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
                  {selectedTrack.toUpperCase()}
                  {currentChapter ? ` / ${cleanTitle(currentChapter.titles[locale] || currentChapter.titles.en)}` : ''}
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[var(--kj-ink)] sm:text-[38px] leading-[1.15]">
                  {cleanTitle(content.title)}
                </h1>
                <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-[var(--kj-muted)]">
                  {content.summary}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-[#789084] dark:text-[var(--kj-muted)]">
                  <span className="rounded-full bg-[#ddf2e6] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#087f5b] dark:bg-[#173a2d] dark:text-[#9cebc3]">
                    {currentLesson.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{copy.minRead(estimatedReadMins)}</span>
                  </span>
                  <span>
                    ▤ &nbsp;{copy.lessonLabel} #{String(currentLesson.order).padStart(2, '0')}
                  </span>
                  {isCompleted && (
                    <span className="font-bold text-[#087f5b] dark:text-[#7ce3b3]">
                      {copy.completedBadge}
                    </span>
                  )}
                </div>
              </div>

              {/* Lesson 2-Column Editorial Grid matching academy.css .lesson-grid */}
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,724px)_256px] xl:items-start">
                {/* Main White Editorial Article matching academy.css .lesson-article */}
                <article className="rounded-[16px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-6 sm:p-8 text-start">
                  {/* Section 1: Welcome / Intro + Mint Objective Box */}
                  <section id="welcome">
                    <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[var(--kj-ink)]">
                      {t.academy.intro}
                    </h2>
                    <p className="mt-3 text-[14.5px] leading-[1.78] text-[#5f796b] dark:text-[var(--kj-muted-2)] whitespace-pre-line">
                      {content.intro}
                    </p>

                    {content.objectives.length > 0 && (
                      <div className="mt-7 flex gap-4 rounded-[12px] bg-[#e9f7ee] p-5 dark:bg-[#153428]">
                        <span className="text-xl leading-none text-[#087f5b] dark:text-[#7ce3b3] shrink-0">✦</span>
                        <div>
                          <strong className="block text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
                            {copy.whatYouLearn}
                          </strong>
                          <ul className="mt-2.5 list-disc space-y-1.5 ps-4 text-[13px] leading-relaxed text-[#315748] dark:text-[#d7efe3]">
                            {content.objectives.map((obj, i) => (
                              <li key={i}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Section 2: Explanation */}
                  <section id="explanation" className="mt-10">
                    <h2 className="text-[22px] font-extrabold tracking-[-0.025em] text-[var(--kj-ink)]">
                      {t.academy.explanation}
                    </h2>
                    <p className="mt-3 text-[14.5px] leading-[1.78] text-[#5f796b] dark:text-[var(--kj-muted-2)] whitespace-pre-line">
                      {content.explanation}
                    </p>
                  </section>

                  {/* Section 3: Syntax in CodeNest Soft Mint .example */}
                  <section id="syntax" className="mt-10">
                    <h3 className="text-[17px] font-bold text-[var(--kj-ink)]">
                      {t.academy.syntax}
                    </h3>
                    {content.syntaxNotes && (
                      <p className="mt-2 text-sm leading-relaxed text-[#5f796b] dark:text-[var(--kj-muted-2)] whitespace-pre-line">
                        {content.syntaxNotes}
                      </p>
                    )}
                    <div className="mt-4 rounded-[12px] bg-[#f2f7f3] p-5 dark:border dark:border-[#244538] dark:bg-[#0f211b]">
                      <div className="flex items-center justify-between border-b border-[#dcebe0] pb-3.5 text-[11px] text-[#8a9e92] dark:border-[#224336]">
                        <strong className="font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
                          {copy.syntaxTag}
                        </strong>
                        <button
                          type="button"
                          onClick={() => void copyCode('syntax', currentLesson.sharedCode.syntax)}
                          className="inline-flex items-center gap-1 font-semibold hover:text-[#087f5b] dark:hover:text-[#9cebc3] cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>{copiedBlock === 'syntax' ? t.common.copied : t.common.copy}</span>
                        </button>
                      </div>
                      <pre dir="ltr" className="mt-4 overflow-x-auto font-mono text-[13px] leading-[1.85] text-[#247456] dark:text-[#9cebc3]">
                        <code>{currentLesson.sharedCode.syntax}</code>
                      </pre>
                    </div>
                  </section>

                  {/* Section 4: Code Examples in CodeNest .example boxes */}
                  <section id="example" className="mt-10 space-y-5">
                    <div>
                      <h3 className="text-[17px] font-bold text-[var(--kj-ink)]">
                        {t.academy.codeExample}
                      </h3>
                      {content.tryItPrompt && (
                        <p className="mt-1.5 text-sm leading-relaxed text-[#5f796b] dark:text-[var(--kj-muted-2)] whitespace-pre-line">
                          {content.tryItPrompt}
                        </p>
                      )}
                    </div>

                    {(
                      [
                        { key: 'html', label: 'index.html', code: currentLesson.sharedCode.html },
                        { key: 'css', label: 'style.css', code: currentLesson.sharedCode.css },
                        { key: 'js', label: 'script.js', code: currentLesson.sharedCode.js },
                      ] as const
                    )
                      .filter((b) => b.code.trim().length > 0)
                      .map((block) => (
                        <div key={block.key} className="rounded-[12px] bg-[#f2f7f3] p-5 dark:border dark:border-[#244538] dark:bg-[#0f211b]">
                          <div className="flex items-center justify-between border-b border-[#dcebe0] pb-3.5 text-[11px] text-[#8a9e92] dark:border-[#224336]">
                            <strong className="font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
                              {copy.exampleTag} · {block.label}
                            </strong>
                            <button
                              type="button"
                              onClick={() => void copyCode(block.key, block.code)}
                              className="inline-flex items-center gap-1 font-semibold hover:text-[#087f5b] dark:hover:text-[#9cebc3] cursor-pointer"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span>{copiedBlock === block.key ? t.common.copied : t.common.copy}</span>
                            </button>
                          </div>
                          <pre dir="ltr" className="my-5 overflow-x-auto font-mono text-[13px] leading-[1.85] text-[#247456] dark:text-[#9cebc3]">
                            <code>{block.code}</code>
                          </pre>
                          <button
                            type="button"
                            onClick={() => openLessonInEditor(currentLesson)}
                            className="inline-flex items-center gap-2 rounded-[10px] bg-[#087f5b] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#056949] cursor-pointer"
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>{t.academy.tryItYourself}</span>
                          </button>
                        </div>
                      ))}
                  </section>

                  {/* Section 5: Common Mistakes */}
                  {content.commonMistakes.length > 0 && (
                    <section id="mistakes" className="mt-10">
                      <h3 className="text-[17px] font-bold text-[var(--kj-ink)]">
                        {t.academy.commonMistakes}
                      </h3>
                      <ul className="mt-3 list-disc space-y-2 ps-5 text-[14px] leading-relaxed text-[#5f796b] dark:text-[var(--kj-muted-2)]">
                        {content.commonMistakes.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Section 6: Take a Moment / Complete & Actions matching academy.css .lesson-actions */}
                  <section id="try" className="mt-10 border-t border-[var(--kj-border)] pt-7">
                    <h3 className="text-[17px] font-bold text-[var(--kj-ink)]">
                      {t.academy.summary}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#5f796b] dark:text-[var(--kj-muted-2)]">
                      {content.summary}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleCompleteAndAutoUnlock}
                        aria-pressed={isCompleted}
                        className={`inline-flex items-center gap-2 rounded-[10px] px-5 py-3 text-sm font-bold transition-colors cursor-pointer ${
                          isCompleted
                            ? 'border border-[#77c99c] bg-[#e4f6ea] text-[#087f5b] dark:border-emerald-500/40 dark:bg-[#173a2d] dark:text-[#9cebc3]'
                            : 'bg-[#087f5b] text-white hover:bg-[#056949]'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        <span>{isCompleted ? t.academy.completed : t.academy.markComplete}</span>
                      </button>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {prevLesson && (
                          <button
                            type="button"
                            onClick={() => {
                              const prevMod = learningModules.find((m) => m.lessonIds.includes(prevLesson.id));
                              if (prevMod) handleSelectLessonFromNav(prevLesson.id, prevMod);
                              else setActiveLessonId(prevLesson.id);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--kj-border)] bg-[var(--kj-soft)] px-4 py-3 text-sm font-bold text-[var(--kj-ink)] hover:border-[#087f5b] cursor-pointer"
                          >
                            {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            <span>{t.academy.previousLesson}</span>
                          </button>
                        )}

                        {nextLesson ? (
                          isNextGroupBlocked && currentLessonModule && effectivePracticeConfig.enabled ? (
                            <button
                              type="button"
                              onClick={() => handleOpenModuleAssessment(currentLessonModule)}
                              className="inline-flex items-center gap-2 rounded-[10px] bg-[#e4f2e9] px-5 py-3 text-sm font-bold text-[#126548] hover:bg-[#d0ebda] dark:bg-[#173a2d] dark:text-[#9cebc3] cursor-pointer"
                            >
                              <Sparkles className="h-4 w-4" />
                              <span>{copy.startPracticeBtn} ↗</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (nextModForNextLesson) handleSelectLessonFromNav(nextLesson.id, nextModForNextLesson);
                                else setActiveLessonId(nextLesson.id);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#e4f2e9] px-5 py-3 text-sm font-bold text-[#126548] hover:bg-[#d0ebda] dark:bg-[#173a2d] dark:text-[#9cebc3] cursor-pointer"
                            >
                              <span>{t.academy.nextLesson}</span>
                              <ArrowUpRight className="h-4 w-4" />
                            </button>
                          )
                        ) : currentLessonModule && effectivePracticeConfig.enabled ? (
                          <button
                            type="button"
                            onClick={() => handleOpenModuleAssessment(currentLessonModule)}
                            className="inline-flex items-center gap-2 rounded-[10px] bg-[#e4f2e9] px-5 py-3 text-sm font-bold text-[#126548] hover:bg-[#d0ebda] dark:bg-[#173a2d] dark:text-[#9cebc3] cursor-pointer"
                          >
                            <Sparkles className="h-4 w-4" />
                            <span>{copy.startPracticeBtn} ↗</span>
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {completionFeedback && (
                      <p className="mt-3 text-xs font-bold text-[#087f5b] dark:text-[#7ce3b3]" aria-live="polite">
                        {completionFeedback}
                      </p>
                    )}
                  </section>

                  {/* Connected Integrated Module Practice Callout */}
                  {effectivePracticeConfig.enabled && currentLessonModule && (
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#9ad4b5] bg-[#f1faf4] p-5 dark:border-[#255743] dark:bg-[#142c24]">
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
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#e4f2e9] px-2.5 py-0.5 text-[11px] font-bold text-[#087f5b] dark:bg-[#173a2d] dark:text-[#9cebc3]">
                                  <Sparkles className="h-3 w-3" />
                                  {pickLoc(locale, {
                                    ckb: `گڕوپی ${modPad} · ${modDone}/${modTotal} وانە تەواو بووە`,
                                    kmr: `Koma ${modPad} · ${modDone}/${modTotal} wane temam`,
                                    ar: `الوحدة ${modPad} · اكتمل ${modDone}/${modTotal} دروس`,
                                    en: `Module ${modPad} · ${modDone}/${modTotal} Lessons`,
                                  })}
                                </span>
                                {modSaved?.passed && (
                                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                                    {modSaved.bestScorePercent}% ✓
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-extrabold text-[var(--kj-ink)]">
                                {pickLoc(locale, currentLessonModule.title)}
                              </h4>
                              <p className="text-xs text-[var(--kj-muted)]">
                                {ready
                                  ? pickLoc(locale, {
                                      ckb: 'تاقیکردنەوەی ئەم گڕوپە کراوەیە — هەڵبژاردن، دۆزینەوەی هەڵە و کۆد نووسین!',
                                      kmr: 'Ezmûna vê komê vekirî ye — pirs û edîtorê kodê!',
                                      ar: 'التقييم التفاعلي متاح الآن — اختيار من متعدد وتصحيح أخطاء!',
                                      en: 'Module Practice & Assessment unlocked — MCQs, Find & Fix & Live Editor.',
                                    })
                                  : pickLoc(locale, {
                                      ckb: `هەر ${modTotal} وانەکەی ئەم گڕوپە تەواو بکە تا تاقیکردنەوەکە بکرێتەوە.`,
                                      kmr: `Her ${modTotal} waneyên vê komê temam bike da ezmûn vebe.`,
                                      ar: `أكمل دروس هذه الوحدة (${modTotal}) لفتح التقييم التفاعلي تلقائياً.`,
                                      en: `Complete all ${modTotal} lessons in this group to unlock Practice & Assessment.`,
                                    })}
                              </p>
                            </div>

                            {ready ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleOpenModuleAssessment(currentLessonModule)}
                              >
                                <Sparkles className="h-4 w-4" />
                                <span>
                                  {modSaved?.passed
                                    ? pickLoc(locale, {
                                        ckb: 'دووبارەکردنەوەی تاقیکردنەوە »',
                                        kmr: 'Ezmûnê Biceribîne »',
                                        ar: 'مراجعة التقييم »',
                                        en: 'Review / Retry »',
                                      })
                                    : pickLoc(locale, {
                                        ckb: `تاقیکردنەوەی گڕوپی ${modPad} »`,
                                        kmr: `Ezmûna Koma ${modPad} »`,
                                        ar: `فتح تقييم الوحدة ${modPad} »`,
                                        en: `Start Assessment »`,
                                      })}
                                </span>
                              </Button>
                            ) : nextUnreadInMod ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSelectLessonFromNav(nextUnreadInMod.id, currentLessonModule)}
                              >
                                <span>
                                  {pickLoc(locale, {
                                    ckb: `بڕۆ وانەی ${String(nextUnreadInMod.order).padStart(2, '0')} »`,
                                    kmr: `Waneya ${String(nextUnreadInMod.order).padStart(2, '0')} »`,
                                    ar: `الدرس ${String(nextUnreadInMod.order).padStart(2, '0')} »`,
                                    en: `Lesson ${String(nextUnreadInMod.order).padStart(2, '0')} »`,
                                  })}
                                </span>
                              </Button>
                            ) : null}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </article>

                {/* Right Aside matching academy.css .lesson-aside (.on-page + .progress-card) */}
                <aside className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-1 xl:sticky xl:top-24 text-start">
                  {/* On This Page TOC */}
                  <div className="hidden xl:block rounded-[16px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-5">
                    <h2 className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#8b9e93]">
                      {copy.onThisPage}
                    </h2>
                    <div className="space-y-1 text-xs">
                      <a
                        href="#welcome"
                        className="block border-s-[3px] border-[#087f5b] px-3 py-2.5 font-bold text-[#087f5b] dark:border-[#7ce3b3] dark:text-[#9cebc3]"
                      >
                        {t.academy.intro}
                      </a>
                      <a href="#explanation" className="block px-3 py-2.5 text-[#70877a] hover:text-[#087f5b] dark:text-[var(--kj-muted)] dark:hover:text-[#9cebc3]">
                        {t.academy.explanation}
                      </a>
                      <a href="#syntax" className="block px-3 py-2.5 text-[#70877a] hover:text-[#087f5b] dark:text-[var(--kj-muted)] dark:hover:text-[#9cebc3]">
                        {t.academy.syntax}
                      </a>
                      <a href="#example" className="block px-3 py-2.5 text-[#70877a] hover:text-[#087f5b] dark:text-[var(--kj-muted)] dark:hover:text-[#9cebc3]">
                        {t.academy.codeExample}
                      </a>
                      <a href="#try" className="block px-3 py-2.5 text-[#70877a] hover:text-[#087f5b] dark:text-[var(--kj-muted)] dark:hover:text-[#9cebc3]">
                        {t.academy.tryItYourself}
                      </a>
                    </div>
                  </div>

                  {/* Mint Progress Card */}
                  <div className="rounded-[16px] border border-[#cde8d8] bg-[#e5f5eb] p-5 dark:border-[#214538] dark:bg-[#153428]">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
                      {copy.keepItUp}
                    </p>
                    <h2 className="mt-2 text-[17px] font-extrabold text-[var(--kj-ink)]">
                      {copy.yourProgress}
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-[#678274] dark:text-[#c2dbd0]">
                      {copy.yourProgressDesc}
                    </p>
                    <div className="my-5 h-[7px] w-full overflow-hidden rounded-full bg-[#c9e5d3] dark:bg-[#214d3c]">
                      <span
                        className="block h-full rounded-full bg-[#10a775] transition-all duration-300"
                        style={{ width: `${trackPercent}%` }}
                      />
                    </div>
                    <strong className="block text-[11px] font-bold text-[#4b7860] dark:text-[#9cebc3]">
                      {copy.progressLabel(doneInTrack, trackLessons.length)}
                    </strong>
                    <span className="mt-2 block text-[11px] text-[#678274] dark:text-[#98b4a6] tabular-nums">
                      {copy.overallProgress} {overallPercent}% ({totalCompleted}/{lessons.length})
                    </span>

                    <button
                      type="button"
                      onClick={() => openLessonInEditor(currentLesson)}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-white px-3.5 py-2.5 text-xs font-bold text-[#087f5b] border border-[#c6e2d0] hover:bg-[#f5fbf7] dark:border-[#274b3d] dark:bg-[#11261e] dark:text-[#9cebc3] cursor-pointer"
                    >
                      <Code2 className="h-3.5 w-3.5" />
                      <span>{t.academy.openInEditor}</span>
                    </button>
                  </div>
                </aside>
              </div>

              {/* Bottom Continue Learning Card matching academy.css .continue & .next-card */}
              {(nextLesson || (currentLessonModule && effectivePracticeConfig.enabled)) && (
                <section className="mt-14 max-w-[1014px] text-start">
                  <h2 className="text-[23px] font-extrabold tracking-tight text-[var(--kj-ink)]">
                    {copy.continueLearningHeading}
                  </h2>
                  <p className="mt-1 text-[13px] text-[var(--kj-muted)]">
                    {copy.continueLearningSub}
                  </p>

                  {isNextGroupBlocked && currentLessonModule && effectivePracticeConfig.enabled ? (
                    <div className="mt-6 flex flex-wrap items-center gap-5 rounded-[16px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-6">
                      <span className="cn-icon-green grid h-[54px] w-[54px] shrink-0 place-items-center rounded-[14px] text-base font-extrabold">
                        ✦
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
                          {copy.upNextPractice}
                        </p>
                        <h3 className="mt-2 text-lg font-extrabold text-[var(--kj-ink)]">
                          {pickLoc(locale, currentLessonModule.title)}
                        </h3>
                        <p className="mt-1 text-xs text-[var(--kj-muted)]">
                          {pickLoc(locale, {
                            ckb: 'تاقیکردنەوەی ئەم گڕوپە تەواو بکە بۆ کردنەوەی وانەکانی گڕوپی داهاتوو.',
                            kmr: 'Ezmûna vê komê temam bike bo vekirina waneyên koma bê.',
                            ar: 'أكمل تقييم هذه الوحدة لفتح دروس الوحدة التالية.',
                            en: 'Complete this group practice & test to unlock the next lessons.',
                          })}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenModuleAssessment(currentLessonModule)}
                        className="inline-flex items-center gap-2 rounded-[10px] bg-[#087f5b] px-5 py-3 text-sm font-bold text-white hover:bg-[#056949] cursor-pointer"
                      >
                        <span>{copy.startPracticeBtn}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : nextLesson ? (
                    <div className="mt-6 flex flex-wrap items-center gap-5 rounded-[16px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-6">
                      <span className="cn-icon-green grid h-[54px] w-[54px] shrink-0 place-items-center rounded-[14px] font-mono text-base font-extrabold">
                        {String(nextLesson.order).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
                          {copy.upNextLesson}
                        </p>
                        <h3 className="mt-2 text-lg font-extrabold text-[var(--kj-ink)]">
                          {cleanTitle((nextLesson.translations[locale] || nextLesson.translations.en).title)}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-[var(--kj-muted)]">
                          {(nextLesson.translations[locale] || nextLesson.translations.en).summary}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (nextModForNextLesson) handleSelectLessonFromNav(nextLesson.id, nextModForNextLesson);
                          else setActiveLessonId(nextLesson.id);
                        }}
                        className="inline-flex items-center gap-2 rounded-[10px] bg-[#087f5b] px-5 py-3 text-sm font-bold text-white hover:bg-[#056949] cursor-pointer"
                      >
                        <span>{copy.continueBtn}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
