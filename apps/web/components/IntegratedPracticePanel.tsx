import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Bug,
  CheckCircle2,
  Code2,
  Eye,
  HelpCircle,
  Lightbulb,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
  XCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cleanTitle, pickLoc } from '../i18n/translations';
import {
  IntegratedPracticeQuestion,
  Locale,
  ModuleAssessmentProgress,
  ModuleAssessmentResultItem,
  PerformanceLevel,
  PracticeModule,
  PracticeQuestionType,
} from '../types/domain';
import {
  CodeRunEvaluation,
  evaluatePracticeSubmission,
  runLocalCodeCheck,
} from '../lib/practiceModuleEngine';
import { Button, Surface } from './ui/Primitives';

interface IntegratedPracticePanelProps {
  module: PracticeModule;
  courseTitle: string;
  savedProgress?: ModuleAssessmentProgress;
  nextModuleFirstLessonId?: string;
  onSelectLesson: (lessonId: string) => void;
  onContinueNextGroup?: () => void;
}

const QUESTION_TYPE_LABELS: Record<PracticeQuestionType, Record<Locale, string>> = {
  mcq: {
    ckb: 'هەڵبژاردنی فرەچەشن',
    kmr: 'Hilbijartina Pirjimar',
    ar: 'اختيار من متعدد',
    en: 'Multiple Choice',
  },
  true_false: {
    ckb: 'ڕاست یان هەڵە',
    kmr: 'Rast yan Şaş',
    ar: 'صحيح أم خطأ',
    en: 'True / False',
  },
  find_fix: {
    ckb: 'دۆزینەوە و چاککردنی هەڵە',
    kmr: 'Dîtin û Rastkirina Şaşiyê',
    ar: 'اكتشف الخطأ وأصلحه',
    en: 'Find & Fix Code Error',
  },
  complete_code: {
    ckb: 'نووسین و تەواوکردنی کۆد',
    kmr: 'Nivîsîn û Temamkirina Kodê',
    ar: 'أكمل الكود البرمجي',
    en: 'Write & Complete Code',
  },
  practical_challenge: {
    ckb: 'بەرەنگاری کۆدنووسی پراکتیکی',
    kmr: 'Erka Kodnivîsîna Pratîkî',
    ar: 'تحدي برمجي عملي',
    en: 'Practical Coding Challenge',
  },
};

const PERFORMANCE_LABELS: Record<
  PerformanceLevel,
  { label: Record<Locale, string>; toneClass: string }
> = {
  excellent: {
    label: {
      ckb: 'نایاب · شارەزایی تەواو',
      kmr: 'Bêhempa · Pisporiya Temam',
      ar: 'ممتاز · إتقان متقدم',
      en: 'Excellent Mastery',
    },
    toneClass:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/35',
  },
  good: {
    label: {
      ckb: 'باش · دەرچووی سەرکەوتوو',
      kmr: 'Baş · Derbasbûna Serkeftî',
      ar: 'جيد · اجتياز ناجح',
      en: 'Good · Passed',
    },
    toneClass:
      'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/35',
  },
  developing: {
    label: {
      ckb: 'پەرەسەندوو · نزیکە لە دەرچوون',
      kmr: 'Pêşketî · Nêzîkî Derbasbûnê',
      ar: 'قيد التطور · قريب من النجاح',
      en: 'Developing',
    },
    toneClass:
      'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35',
  },
  needs_review: {
    label: {
      ckb: 'پێویستە وانەکان ببینیەوە',
      kmr: 'Pêwîstî bi Pêdaçûna Waneyan Heye',
      ar: 'يحتاج إلى مراجعة الدروس',
      en: 'Needs Review',
    },
    toneClass:
      'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/35',
  },
};

function buildLivePreviewHtml(question: IntegratedPracticeQuestion, userCode: string): string {
  const lang = question.codeLanguage || 'html';
  const html = lang === 'html' ? userCode : question.previewHtml || '<div class="kj-preview-card">Preview Output</div>';
  const css = lang === 'css' ? userCode : question.previewCss || '';
  const js = lang === 'javascript' ? userCode : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  body { margin: 0; padding: 14px; font-family: system-ui, -apple-system, sans-serif; color: #0f172a; background: #ffffff; }
  ${css}
</style>
</head>
<body>
${html}
<script>
try {
  ${js}
} catch (err) {
  var pre = document.createElement('pre');
  pre.style.color = '#dc2626';
  pre.textContent = 'Runtime error: ' + err.message;
  document.body.appendChild(pre);
}
</script>
</body>
</html>`;
}

export const IntegratedPracticePanel: React.FC<IntegratedPracticePanelProps> = ({
  module,
  courseTitle,
  savedProgress,
  nextModuleFirstLessonId,
  onSelectLesson,
  onContinueNextGroup,
}) => {
  const { locale, isRtl, saveModuleAssessmentResult, openCodeInEditor } = useApp();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [codeChecks, setCodeChecks] = useState<Record<string, CodeRunEvaluation>>({});
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});
  const [runningQuestionId, setRunningQuestionId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<Record<string, 'console' | 'preview'>>({});
  const [submittedResult, setSubmittedResult] = useState<{
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    passed: boolean;
    performanceLevel: PerformanceLevel;
    itemResults: ModuleAssessmentResultItem[];
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Initialize answers whenever the active module switches
  useEffect(() => {
    const initial: Record<string, string> = {};
    for (const q of module.questions) {
      if (q.type === 'find_fix') {
        initial[q.id] = q.buggyCode || q.starterCode || '';
      } else if (q.type === 'practical_challenge') {
        initial[q.id] = q.starterCode || '';
      } else {
        initial[q.id] = '';
      }
    }
    setAnswers(initial);
    setCodeChecks({});
    setShowHints({});
    setShowSolution({});
    setSubmittedResult(null);
  }, [module.moduleId]);

  const ui = useMemo(() => {
    if (locale === 'ckb') {
      return {
        moduleLabel: 'گڕوپی فێربوون',
        coveredLessons: 'وانە داپۆشراوەکان',
        backToLesson: 'گەڕانەوە بۆ وانە',
        answered: 'وەڵامدراوەتەوە',
        passRule: `بۆ دەرچوون و کردنەوەی گڕوپی داهاتوو: لانیکەم ${module.passThresholdPercent}%`,
        openFlowBadge: `دەستگەیشتنی کراوە · ئامانجی پیشنیازکراو ${module.passThresholdPercent}%`,
        hintBtn: 'ڕێنمایی',
        runBtn: 'کارپێکردن (Run)',
        testBtn: 'تاقیکردنەوە (Test)',
        resetBtn: 'گەڕاندنەوە',
        openFullIde: 'کردنەوە لە ئیدیتەری تەواو',
        consoleTab: 'تێرمیناڵ / دەرئەنجام',
        previewTab: 'پیشاندانی ڕاستەوخۆ',
        submitBtn: 'ناردن و هەڵسەنگاندن',
        retryBtn: 'دووبارە ئەنجامدانی تاقیکردنەوە',
        continueNextBtn: 'بەردەوامبوون بۆ گڕوپی داهاتوو',
        scoreTitle: 'ئەنجامی هەڵسەنگاندنی گڕوپ',
        passedBanner: 'پیرۆزە! ئەم هەڵسەنگاندنەت بە سەرکەوتوویی تێپەڕاند و گڕوپی داهاتوو کرایەوە.',
        retryBanner: `نمرەکەت کەمترە لە ${module.passThresholdPercent}%. دەتوانیت وانەکانی ئەم گڕوپە ببینیەوە و دووبارە هەوڵبدەیتەوە.`,
        correctLabel: 'وەڵامێکی دروستە',
        incorrectLabel: 'پێداچوونەوە پێویستە',
        yourAnswer: 'وەڵامی تۆ',
        correctAnswer: 'وەڵامی دروست',
        explanation: 'ڕوونکردنەوە',
        showSolution: 'بینینی کۆدی چارەسەر',
        hideSolution: 'شاردنەوەی چارەسەر',
        bestPrev: 'باشترین نمرەی پێشوو',
        lessonRef: 'وانەی پەیوەست',
        checksPassed: 'هەموو پشکنینەکان سەرکەوتووبوون ✓',
        checksFailed: 'کۆدەکە هێشتا پێویستی بە چاکسازی هەیە',
        placeholderFill: 'بەشە ونبووەکە لێرە بنووسە...',
        codePromptLabel: 'شablۆنی کۆد',
        typeAnswerLabel: 'وەڵامەکەت بنووسە',
      };
    }
    if (locale === 'kmr') {
      return {
        moduleLabel: 'Koma Fêrbûnê',
        coveredLessons: 'Wanên vê komê',
        backToLesson: 'Veger bo Waneyê',
        answered: 'bersivdayî',
        passRule: `Bo derbasbûn û vekirina koma bê: herî kêm ${module.passThresholdPercent}%`,
        openFlowBadge: `Gihiştina vekirî · Armanc ${module.passThresholdPercent}%`,
        hintBtn: 'Rêberî',
        runBtn: 'Bimeşîne (Run)',
        testBtn: 'Biceribîne (Test)',
        resetBtn: 'Vegerîne',
        openFullIde: 'Di Edîtorê de Veke',
        consoleTab: 'Termînal / Encam',
        previewTab: 'Pêşdîtina Zindî',
        submitBtn: 'Şandin û Nirxandin',
        retryBtn: 'Ezmûnê Dîsa Biceribîne',
        continueNextBtn: 'Berdewam Bike bo Koma Bê',
        scoreTitle: 'Encama Nirxandina Komê',
        passedBanner: 'Pîroz be! Te ev nirxandin bi serkeftî derbas kir û koma bê vebû.',
        retryBanner: `Pûana te ji ${module.passThresholdPercent}% kêmtir e. Tu dikarî waneyan bibînî û dîsa hewl bidî.`,
        correctLabel: 'Bersiveke Durust e',
        incorrectLabel: 'Pêdaçûn Pêwîst e',
        yourAnswer: 'Bersiva Te',
        correctAnswer: 'Bersiva Durust',
        explanation: 'Şirove',
        showSolution: 'Koda Çareseriyê Bibîne',
        hideSolution: 'Çareseriyê Veşêre',
        bestPrev: 'Baştirîn encama berê',
        lessonRef: 'Waneya girêdayî',
        checksPassed: 'Hemû kontrol bi ser ketin ✓',
        checksFailed: 'Kod hîn pêwîstî bi rastkirinê heye',
        placeholderFill: 'Beşa windabûyî li vir binivîse...',
        codePromptLabel: 'Şablona Kodê',
        typeAnswerLabel: 'Bersiva xwe binivîse',
      };
    }
    if (locale === 'ar') {
      return {
        moduleLabel: 'وحدة التعلم',
        coveredLessons: 'الدروس المشمولة',
        backToLesson: 'العودة إلى الدرس',
        answered: 'تمت الإجابة',
        passRule: `الحد المطلوب للنجاح وفتح الوحدة التالية: ${module.passThresholdPercent}%`,
        openFlowBadge: `وصول مفتوح · الهدف الموصى به ${module.passThresholdPercent}%`,
        hintBtn: 'تلميح',
        runBtn: 'تشغيل (Run)',
        testBtn: 'اختبار (Test)',
        resetBtn: 'إعادة ضبط',
        openFullIde: 'فتح في المحرر الكامل',
        consoleTab: 'المخرجات / الطرفية',
        previewTab: 'معاينة حية',
        submitBtn: 'إرسال وتقييم الإجابات',
        retryBtn: 'إعادة المحاولة',
        continueNextBtn: 'المتابعة إلى الوحدة التالية',
        scoreTitle: 'نتيجة التقييم التفاعلي',
        passedBanner: 'أحسنت! لقد اجتزت هذا التقييم بنجاح وتم فتح الوحدة التعليمية التالية.',
        retryBanner: `النتيجة أقل من ${module.passThresholdPercent}%. راجع دروس الوحدة ثم أعد المحاولة.`,
        correctLabel: 'إجابة صحيحة',
        incorrectLabel: 'تحتاج إلى مراجعة',
        yourAnswer: 'إجابتك',
        correctAnswer: 'الإجابة الصحيحة',
        explanation: 'التوضيح',
        showSolution: 'عرض الحل المرجعي',
        hideSolution: 'إخفاء الحل',
        bestPrev: 'أفضل نتيجة سابقة',
        lessonRef: 'الدرس المرتبط',
        checksPassed: 'اجتازت جميع الاختبارات بنجاح ✓',
        checksFailed: 'الكود ما زال يحتاج إلى تعديل',
        placeholderFill: 'اكتب الجزء الناقص هنا...',
        codePromptLabel: 'قالب الكود',
        typeAnswerLabel: 'أدخل إجابتك',
      };
    }
    return {
      moduleLabel: 'Learning Module',
      coveredLessons: 'Covered lessons',
      backToLesson: 'Back to Lesson',
      answered: 'answered',
      passRule: `Pass threshold to unlock next group: ${module.passThresholdPercent}%`,
      openFlowBadge: `Open progression · Target ${module.passThresholdPercent}%`,
      hintBtn: 'Hint',
      runBtn: 'Run',
      testBtn: 'Test Solution',
      resetBtn: 'Reset',
      openFullIde: 'Open in Full IDE',
      consoleTab: 'Console Output',
      previewTab: 'Live Preview',
      submitBtn: 'Submit Practice & Assessment',
      retryBtn: 'Retry Assessment',
      continueNextBtn: 'Continue to Next Learning Group',
      scoreTitle: 'Module Assessment Result',
      passedBanner: 'Well done! You passed this assessment and unlocked the next learning group.',
      retryBanner: `Score is below ${module.passThresholdPercent}%. Review the module lessons and retry anytime.`,
      correctLabel: 'Correct',
      incorrectLabel: 'Needs Review',
      yourAnswer: 'Your Answer',
      correctAnswer: 'Expected Answer',
      explanation: 'Explanation',
      showSolution: 'Show Reference Solution',
      hideSolution: 'Hide Solution',
      bestPrev: 'Best saved score',
      lessonRef: 'Related lesson',
      checksPassed: 'All code checks passed ✓',
      checksFailed: 'Code still needs adjustments',
      placeholderFill: 'Type the missing code token here...',
      codePromptLabel: 'Code Snippet',
      typeAnswerLabel: 'Your Completion',
    };
  }, [locale, module.passThresholdPercent]);

  const answeredCount = useMemo(() => {
    return module.questions.filter((q) => {
      const val = (answers[q.id] || '').trim();
      if (!val) return false;
      if (q.type === 'find_fix' && q.buggyCode && val === q.buggyCode.trim()) return false;
      if (q.type === 'practical_challenge' && q.starterCode && val === q.starterCode.trim() && val.includes('TODO')) return false;
      return true;
    }).length;
  }, [module.questions, answers]);

  const handleRunOrTestCode = async (q: IntegratedPracticeQuestion) => {
    const code = answers[q.id] || '';
    setRunningQuestionId(q.id);
    const localEval = runLocalCodeCheck(q, code);
    setCodeChecks((prev) => ({ ...prev, [q.id]: localEval }));

    if (q.type === 'practical_challenge' && (q.codeLanguage === 'html' || q.codeLanguage === 'css')) {
      setPreviewMode((prev) => ({ ...prev, [q.id]: 'preview' }));
    }

    try {
      const res = await fetch('/api/practice/modules/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: q.codeLanguage || 'javascript',
          code,
          expectedSnippetTokens: q.expectedSnippetTokens || [],
          forbiddenTokens: q.forbiddenTokens || [],
          expectedOutputIncludes: q.expectedOutputIncludes || [],
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.ok) {
          // For JS & HTML/CSS, trust authoritative server sandbox; keep Python/C++ simulator output merged
          const mergedEval: CodeRunEvaluation = {
            valid: q.codeLanguage === 'python' || q.codeLanguage === 'cpp' ? localEval.valid && json.valid : Boolean(json.valid),
            passedChecks:
              q.codeLanguage === 'python' || q.codeLanguage === 'cpp'
                ? localEval.passedChecks && Boolean(json.passedChecks)
                : Boolean(json.passedChecks),
            output:
              Array.isArray(json.output) && json.output.length > 0
                ? json.output
                : localEval.output,
            error: json.error || localEval.error,
            missingTokens: json.missingTokens || localEval.missingTokens,
            forbiddenFound: json.forbiddenFound || localEval.forbiddenFound,
            missingOutputs: json.missingOutputs || localEval.missingOutputs,
          };
          setCodeChecks((prev) => ({ ...prev, [q.id]: mergedEval }));
        }
      }
    } catch {
      // Local check remains active seamlessly
    } finally {
      setRunningQuestionId(null);
    }
  };

  const handleResetCode = (q: IntegratedPracticeQuestion) => {
    const base = q.type === 'find_fix' ? q.buggyCode || q.starterCode || '' : q.starterCode || '';
    setAnswers((prev) => ({ ...prev, [q.id]: base }));
    setCodeChecks((prev) => {
      const copy = { ...prev };
      delete copy[q.id];
      return copy;
    });
  };

  const handleSubmitAssessment = async () => {
    setSubmitting(true);
    try {
      // Run fresh checks for all code exercises
      const freshChecks: Record<string, CodeRunEvaluation> = { ...codeChecks };
      for (const q of module.questions) {
        if (q.type === 'find_fix' || q.type === 'practical_challenge') {
          freshChecks[q.id] = runLocalCodeCheck(q, answers[q.id] || '');
        }
      }
      setCodeChecks(freshChecks);

      const evaluated = evaluatePracticeSubmission(module, answers, freshChecks, locale);
      setSubmittedResult(evaluated);

      const record: ModuleAssessmentProgress = {
        moduleId: module.moduleId,
        courseId: module.courseId,
        groupIndex: module.groupIndex,
        scorePercent: evaluated.scorePercent,
        correctCount: evaluated.correctCount,
        totalQuestions: evaluated.totalQuestions,
        passed: evaluated.passed,
        performanceLevel: evaluated.performanceLevel,
        attemptsCount: (savedProgress?.attemptsCount || 0) + 1,
        bestScorePercent: Math.max(savedProgress?.bestScorePercent || 0, evaluated.scorePercent),
        lastSubmittedAt: new Date().toISOString(),
        lastAnswers: answers,
        lastItemResults: evaluated.itemResults,
      };
      await saveModuleAssessmentResult(record);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    const resetAns: Record<string, string> = {};
    for (const q of module.questions) {
      resetAns[q.id] =
        q.type === 'find_fix'
          ? q.buggyCode || q.starterCode || ''
          : q.type === 'practical_challenge'
            ? q.starterCode || ''
            : '';
    }
    setAnswers(resetAns);
    setCodeChecks({});
    setSubmittedResult(null);
  };

  const pad = (n: number) => String(n).padStart(2, '0');
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;
  const ForwardIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6 transition-all duration-300">
      {/* Module Practice & Assessment Header Banner */}
      <Surface className="p-6 sm:p-8 border-[var(--kj-green)]/35 bg-gradient-to-br from-[var(--kj-card)] via-[var(--kj-card)] to-[var(--kj-green)]/[0.06] shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--kj-green)]/12 border border-[var(--kj-green)]/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--kj-green)]">
                <Sparkles className="w-3.5 h-3.5" />
                {ui.moduleLabel} {pad(module.groupIndex)} · {courseTitle}
              </span>
              {savedProgress && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${
                    savedProgress.passed
                      ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-600 dark:text-emerald-300'
                      : 'bg-amber-500/15 border-amber-500/35 text-amber-600 dark:text-amber-300'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  {ui.bestPrev}: {savedProgress.bestScorePercent}%
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--kj-ink)] tracking-tight">
              {pickLoc(locale, module.title)}
            </h2>
            <p className="text-sm text-[var(--kj-muted-2)] leading-relaxed">
              {pickLoc(locale, module.summary)}
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onSelectLesson(module.lessons[0]?.id)}
          >
            <BackIcon className="w-4 h-4" />
            {ui.backToLesson}
          </Button>
        </div>

        {/* Covered Lesson Chips + Progress */}
        <div className="mt-5 pt-5 border-t border-[var(--kj-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[var(--kj-muted)] me-1">
              {ui.coveredLessons}:
            </span>
            {module.lessons.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => onSelectLesson(l.id)}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--kj-border-strong)] bg-[var(--kj-soft-alt)] px-2.5 py-1 text-xs font-medium text-[var(--kj-ink)] hover:border-[var(--kj-green)] hover:text-[var(--kj-green)] transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[var(--kj-green)]" />
                <span>
                  {pad(l.order)}. {cleanTitle(l.translations[locale]?.title || l.id)}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-[var(--kj-muted)] shrink-0">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[var(--kj-green)]" />
              {module.requirePassToUnlockNext ? ui.passRule : ui.openFlowBadge}
            </span>
          </div>
        </div>

        {/* Interactive Progress Meter */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--kj-muted-2)] mb-1.5">
            <span>
              {answeredCount} / {module.questions.length} {ui.answered}
            </span>
            <span>{Math.round((answeredCount / Math.max(1, module.questions.length)) * 100)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--kj-soft-alt)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--kj-green)] transition-all duration-300"
              style={{ width: `${Math.round((answeredCount / Math.max(1, module.questions.length)) * 100)}%` }}
            />
          </div>
        </div>
      </Surface>

      {/* Graded Results Dashboard Banner (shown after submit) */}
      {submittedResult && (
        <Surface
          className={`p-6 sm:p-7 border-2 transition-all duration-300 ${
            submittedResult.passed
              ? 'border-emerald-500/50 bg-emerald-500/[0.06]'
              : 'border-amber-500/50 bg-amber-500/[0.06]'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 font-black border ${
                  submittedResult.passed
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
                    : 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-300'
                }`}
              >
                <span className="text-xl leading-none">{submittedResult.scorePercent}%</span>
                <span className="text-[10px] font-bold mt-1 opacity-80">
                  {submittedResult.correctCount}/{submittedResult.totalQuestions}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-[var(--kj-ink)]">
                    {ui.scoreTitle}
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                      PERFORMANCE_LABELS[submittedResult.performanceLevel].toneClass
                    }`}
                  >
                    {pickLoc(locale, PERFORMANCE_LABELS[submittedResult.performanceLevel].label)}
                  </span>
                </div>
                <p className="text-sm text-[var(--kj-muted-2)]">
                  {submittedResult.passed ? ui.passedBanner : ui.retryBanner}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button variant="secondary" size="sm" onClick={handleRetry}>
                <RotateCcw className="w-4 h-4" />
                {ui.retryBtn}
              </Button>
              {(submittedResult.passed || !module.requirePassToUnlockNext) &&
                nextModuleFirstLessonId &&
                onContinueNextGroup && (
                  <Button variant="primary" size="md" onClick={onContinueNextGroup}>
                    {ui.continueNextBtn}
                    <ForwardIcon className="w-4 h-4" />
                  </Button>
                )}
            </div>
          </div>
        </Surface>
      )}

      {/* Interactive Questions Stack */}
      <div className="space-y-5">
        {module.questions.map((q, qIdx) => {
          const itemRes = submittedResult?.itemResults.find((r) => r.questionId === q.id);
          const check = codeChecks[q.id];
          const isCodeTask = q.type === 'find_fix' || q.type === 'practical_challenge';
          const canPreviewHtml =
            q.type === 'practical_challenge' &&
            (q.codeLanguage === 'html' || q.codeLanguage === 'css' || Boolean(q.previewHtml));
          const activeTab = previewMode[q.id] || (canPreviewHtml && check ? 'preview' : 'console');
          const relatedLesson = module.lessons.find((l) => l.id === q.lessonId);

          const typeIcon =
            q.type === 'find_fix' ? (
              <Bug className="w-3.5 h-3.5 text-rose-500" />
            ) : q.type === 'complete_code' ? (
              <Code2 className="w-3.5 h-3.5 text-amber-500" />
            ) : q.type === 'practical_challenge' ? (
              <Terminal className="w-3.5 h-3.5 text-[var(--kj-green)]" />
            ) : (
              <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
            );

          return (
            <Surface
              key={q.id}
              className={`p-5 sm:p-6 transition-all duration-200 ${
                itemRes
                  ? itemRes.correct
                    ? 'border-emerald-500/45 bg-emerald-500/[0.02]'
                    : 'border-rose-500/45 bg-rose-500/[0.02]'
                  : 'hover:border-[var(--kj-border-strong)]'
              }`}
            >
              {/* Question Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--kj-soft-alt)] text-xs font-extrabold text-[var(--kj-ink)]">
                    {qIdx + 1}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--kj-border)] bg-[var(--kj-soft-alt)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--kj-muted-2)]">
                    {typeIcon}
                    {pickLoc(locale, QUESTION_TYPE_LABELS[q.type])}
                  </span>
                  {relatedLesson && (
                    <button
                      type="button"
                      onClick={() => onSelectLesson(relatedLesson.id)}
                      className="text-[11px] font-medium text-[var(--kj-muted)] hover:text-[var(--kj-green)] underline-offset-2 hover:underline cursor-pointer"
                    >
                      {ui.lessonRef}: {pad(q.lessonNumber)} ·{' '}
                      {cleanTitle(relatedLesson.translations[locale]?.title || relatedLesson.id)}
                    </button>
                  )}
                </div>

                {itemRes && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      itemRes.correct
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-300'
                    }`}
                  >
                    {itemRes.correct ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    {itemRes.correct ? ui.correctLabel : ui.incorrectLabel}
                  </span>
                )}
              </div>

              {/* Question Prompt */}
              <h4 className="text-base sm:text-lg font-bold text-[var(--kj-ink)] leading-snug mb-4">
                {pickLoc(locale, q.prompt)}
              </h4>

              {/* 1 & 2) MCQ and True/False Options */}
              {(q.type === 'mcq' || q.type === 'true_false') && q.options && (
                <div
                  className={`grid gap-2.5 ${
                    q.type === 'true_false' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {q.options.map((opt, optIdx) => {
                    const selected = answers[q.id] === String(optIdx);
                    const isRightOpt = submittedResult && q.correctOptionIndex === optIdx;
                    const isWrongSelected =
                      submittedResult && selected && q.correctOptionIndex !== optIdx;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={Boolean(submittedResult)}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: String(optIdx) }))
                        }
                        className={`w-full text-start rounded-lg border px-4 py-3 text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${
                          isRightOpt
                            ? 'border-emerald-500 bg-emerald-500/12 text-emerald-700 dark:text-emerald-200 font-semibold'
                            : isWrongSelected
                              ? 'border-rose-500 bg-rose-500/12 text-rose-700 dark:text-rose-200'
                              : selected
                                ? 'border-[var(--kj-green)] bg-[var(--kj-green)]/10 text-[var(--kj-ink)] font-semibold ring-1 ring-[var(--kj-green)]/40'
                                : 'border-[var(--kj-border)] bg-[var(--kj-soft)] text-[var(--kj-ink)] hover:border-[var(--kj-border-strong)] hover:bg-[var(--kj-soft-alt)]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                              selected || isRightOpt
                                ? 'border-current bg-current/10'
                                : 'border-[var(--kj-border-strong)] text-[var(--kj-muted)]'
                            }`}
                          >
                            {q.type === 'true_false'
                              ? optIdx === 0
                                ? '✓'
                                : '✕'
                              : String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{pickLoc(locale, opt)}</span>
                        </div>

                        {isRightOpt && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                        {isWrongSelected && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3) Complete / Fill-in Code */}
              {q.type === 'complete_code' && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-[var(--kj-border)] bg-[#0f172a] p-4 overflow-x-auto" dir="ltr">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      {ui.codePromptLabel} ({q.codeLanguage || 'code'})
                    </div>
                    <pre className="text-sm font-mono text-slate-100 whitespace-pre-wrap leading-relaxed">
                      {q.starterCode}
                    </pre>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-[var(--kj-muted)] mb-1">
                        {ui.typeAnswerLabel}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        disabled={Boolean(submittedResult)}
                        value={answers[q.id] || ''}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        placeholder={ui.placeholderFill}
                        className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-surface)] px-3.5 py-2.5 text-sm font-mono text-[var(--kj-ink)] focus:outline-none focus:border-[var(--kj-green)]"
                      />
                    </div>
                    {q.hint && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="sm:mt-5"
                        onClick={() =>
                          setShowHints((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                        }
                      >
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        {ui.hintBtn}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* 4 & 5) Interactive Code Editor (Find & Fix + Practical Challenge) */}
              {isCodeTask && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-[var(--kj-border-strong)] overflow-hidden bg-[#0b1220]" dir="ltr">
                    {/* Mini IDE Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-[#131d31] border-b border-slate-700/70 text-xs text-slate-300">
                      <div className="flex items-center gap-2 font-mono font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                        <span className="ms-1 text-slate-200">
                          {q.type === 'find_fix' ? 'fix-error' : 'solution'}.{q.codeLanguage === 'python' ? 'py' : q.codeLanguage === 'cpp' ? 'cpp' : q.codeLanguage === 'html' ? 'html' : q.codeLanguage === 'css' ? 'css' : q.codeLanguage === 'tsx' ? 'tsx' : 'js'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {q.hint && (
                          <button
                            type="button"
                            onClick={() =>
                              setShowHints((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                            }
                            className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors cursor-pointer"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            {ui.hintBtn}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleResetCode(q)}
                          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          {ui.resetBtn}
                        </button>
                        <button
                          type="button"
                          disabled={runningQuestionId === q.id}
                          onClick={() => handleRunOrTestCode(q)}
                          className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Play className="w-3.5 h-3.5" />
                          {runningQuestionId === q.id ? '...' : `${ui.runBtn} / ${ui.testBtn}`}
                        </button>
                      </div>
                    </div>

                    {/* Editable Monospace Code Area */}
                    <textarea
                      dir="ltr"
                      spellCheck={false}
                      rows={Math.min(12, Math.max(5, (answers[q.id] || '').split('\n').length + 1))}
                      disabled={Boolean(submittedResult)}
                      value={answers[q.id] || ''}
                      onChange={(e) => {
                        setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }));
                      }}
                      className="w-full bg-[#0b1220] text-slate-100 font-mono text-[13px] leading-relaxed p-4 focus:outline-none resize-y"
                    />
                  </div>

                  {/* Output & Live Preview Pane */}
                  {(check || canPreviewHtml) && (
                    <div className="rounded-lg border border-[var(--kj-border)] bg-[var(--kj-soft)] overflow-hidden">
                      <div className="flex items-center justify-between px-3.5 py-2 border-b border-[var(--kj-border)] bg-[var(--kj-soft-alt)] text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewMode((prev) => ({ ...prev, [q.id]: 'console' }))
                            }
                            className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-semibold cursor-pointer ${
                              activeTab === 'console'
                                ? 'bg-[var(--kj-card)] text-[var(--kj-ink)] shadow-xs'
                                : 'text-[var(--kj-muted)] hover:text-[var(--kj-ink)]'
                            }`}
                          >
                            <Terminal className="w-3.5 h-3.5" />
                            {ui.consoleTab}
                          </button>
                          {canPreviewHtml && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewMode((prev) => ({ ...prev, [q.id]: 'preview' }))
                              }
                              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-semibold cursor-pointer ${
                                activeTab === 'preview'
                                  ? 'bg-[var(--kj-card)] text-[var(--kj-ink)] shadow-xs'
                                  : 'text-[var(--kj-muted)] hover:text-[var(--kj-ink)]'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {ui.previewTab}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {q.type === 'practical_challenge' && (
                            <button
                              type="button"
                              onClick={() =>
                                openCodeInEditor({
                                  html:
                                    q.codeLanguage === 'html'
                                      ? answers[q.id] || q.starterCode || ''
                                      : q.previewHtml || '',
                                  css:
                                    q.codeLanguage === 'css'
                                      ? answers[q.id] || q.starterCode || ''
                                      : q.previewCss || '',
                                  js:
                                    q.codeLanguage !== 'html' && q.codeLanguage !== 'css'
                                      ? answers[q.id] || q.starterCode || ''
                                      : q.previewJs || '',
                                  lessonId: q.lessonId,
                                })
                              }
                              className="text-[11px] font-semibold text-[var(--kj-green)] hover:underline cursor-pointer"
                            >
                              {ui.openFullIde} ↗
                            </button>
                          )}
                        </div>
                      </div>

                      {activeTab === 'preview' && canPreviewHtml ? (
                        <iframe
                          title={`preview-${q.id}`}
                          sandbox="allow-scripts"
                          srcDoc={buildLivePreviewHtml(q, answers[q.id] || '')}
                          className="w-full h-44 bg-white border-0"
                        />
                      ) : (
                        <div className="p-3.5 font-mono text-xs space-y-1.5" dir="ltr">
                          {check ? (
                            <>
                              <div
                                className={`font-bold ${
                                  check.passedChecks ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                                }`}
                              >
                                {check.passedChecks ? ui.checksPassed : ui.checksFailed}
                              </div>
                              {check.error && (
                                <div className="text-rose-500 whitespace-pre-wrap">{check.error}</div>
                              )}
                              {check.missingTokens.length > 0 && (
                                <div className="text-amber-600 dark:text-amber-400">
                                  Missing expected code: {check.missingTokens.join(', ')}
                                </div>
                              )}
                              {check.forbiddenFound.length > 0 && (
                                <div className="text-rose-500">
                                  Buggy code still present: {check.forbiddenFound.join(', ')}
                                </div>
                              )}
                              {check.output.length > 0 && (
                                <pre className="mt-1 rounded bg-[#0f172a] text-emerald-300 p-2.5 overflow-x-auto whitespace-pre-wrap">
                                  {check.output.join('\n')}
                                </pre>
                              )}
                            </>
                          ) : (
                            <div className="text-[var(--kj-muted)]">
                              Click "{ui.runBtn} / {ui.testBtn}" to execute and test your code.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Optional Reference Solution toggle after submission */}
                  {submittedResult && q.solutionCode && (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          setShowSolution((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                        }
                        className="text-xs font-semibold text-[var(--kj-green)] hover:underline cursor-pointer"
                      >
                        {showSolution[q.id] ? ui.hideSolution : ui.showSolution}
                      </button>
                      {showSolution[q.id] && (
                        <pre
                          dir="ltr"
                          className="mt-2 rounded-lg border border-emerald-500/30 bg-[#0b1220] text-emerald-200 font-mono text-xs p-3.5 overflow-x-auto whitespace-pre-wrap"
                        >
                          {q.solutionCode}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Hint Callout */}
              {showHints[q.id] && q.hint && (
                <div className="mt-3 rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <span>{pickLoc(locale, q.hint)}</span>
                </div>
              )}

              {/* Post-Submit Detailed Feedback & Explanation for EVERY question */}
              {itemRes && (
                <div
                  className={`mt-4 rounded-lg border px-4 py-3 text-xs sm:text-sm space-y-1.5 ${
                    itemRes.correct
                      ? 'border-emerald-500/30 bg-emerald-500/[0.07]'
                      : 'border-rose-500/30 bg-rose-500/[0.07]'
                  }`}
                >
                  {!itemRes.correct && (
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
                      <span>
                        <strong className="text-rose-600 dark:text-rose-300">{ui.yourAnswer}:</strong>{' '}
                        <span className="font-mono">{itemRes.userAnswerSummary}</span>
                      </span>
                      <span>
                        <strong className="text-emerald-600 dark:text-emerald-300">{ui.correctAnswer}:</strong>{' '}
                        <span className="font-mono">{itemRes.correctAnswerSummary}</span>
                      </span>
                    </div>
                  )}
                  <p className="text-[var(--kj-ink)] leading-relaxed">
                    <strong className="me-1.5">{ui.explanation}:</strong>
                    {pickLoc(locale, itemRes.explanation)}
                  </p>
                </div>
              )}
            </Surface>
          );
        })}
      </div>

      {/* Bottom Sticky Submit / Retry Bar */}
      <Surface className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-[var(--kj-border-strong)]">
        <div className="text-sm text-[var(--kj-muted-2)]">
          <strong className="text-[var(--kj-ink)]">
            {answeredCount}/{module.questions.length}
          </strong>{' '}
          {ui.answered} · {module.requirePassToUnlockNext ? ui.passRule : ui.openFlowBadge}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {submittedResult ? (
            <>
              <Button variant="secondary" onClick={handleRetry}>
                <RotateCcw className="w-4 h-4" />
                {ui.retryBtn}
              </Button>
              {(submittedResult.passed || !module.requirePassToUnlockNext) &&
                nextModuleFirstLessonId &&
                onContinueNextGroup && (
                  <Button variant="primary" onClick={onContinueNextGroup}>
                    {ui.continueNextBtn}
                    <ForwardIcon className="w-4 h-4" />
                  </Button>
                )}
            </>
          ) : (
            <Button
              variant="primary"
              disabled={submitting}
              onClick={handleSubmitAssessment}
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? '...' : ui.submitBtn}
            </Button>
          )}
        </div>
      </Surface>
    </div>
  );
};
