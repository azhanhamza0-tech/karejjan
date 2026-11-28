import React, { useMemo, useRef, useState } from 'react';
import {
  Search,
  X,
  Terminal,
  Sparkles,
  Bot,
  Flame,
  Compass,
  LayoutDashboard,
  Crown,
  BookOpen,
  Zap,
  Play,
  CheckCircle2,
  Shield,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { pickLoc } from '../i18n/translations';
import { CLIENT_DAILY_CHALLENGES } from '../data/dailyChallengesCatalog';
import { TOP_50_AI_TOOLS } from '../data/top50AiTools';
import { GOLDEN_PROMPTS } from '../data/promptsCatalog';
import type { ActiveView, Locale, TrackId } from '../types/domain';

type PastelTone = 'green' | 'yellow' | 'purple' | 'blue' | 'peach' | 'teal';

interface TrackCardInfo {
  id: TrackId;
  num: string;
  toneClass: string;
  name: string;
  searchKeys: string;
  lessonsFallback: number;
  levelLabel: Record<Locale, string>;
  tags: Record<Locale, string>;
  descriptions: Record<Locale, string>;
}

const TONE_MAP: Record<PastelTone, string> = {
  green: 'cn-icon-green',
  yellow: 'cn-icon-yellow',
  purple: 'cn-icon-purple',
  blue: 'cn-icon-blue',
  peach: 'cn-icon-peach',
  teal: 'cn-icon-teal',
};

const FEATURED_TRACKS: TrackCardInfo[] = [
  {
    id: 'html',
    num: '01',
    toneClass: TONE_MAP.green,
    name: 'HTML5',
    searchKeys: 'html html5 web structure tags forms semantics',
    lessonsFallback: 110,
    levelLabel: { ckb: 'سەرەتایی', kmr: 'دەستپێک', ar: 'مبتدئ', en: 'BEGINNER' },
    tags: {
      ckb: 'پێکهاتەی وێب',
      kmr: 'پێکهاتەیا وێبێ',
      ar: 'أساسيات الويب',
      en: 'Structure the web',
    },
    descriptions: {
      ckb: 'بنچینەی هەموو ماڵپەڕێک بە تاگ، فۆڕم، و میدیا.',
      kmr: 'بنەمایێ هەر مالپەڕەکێ ب تاگ، فۆرم و میدیایێ.',
      ar: 'اللبنة الأساسية لكل موقع عبر الوسوم والنماذج.',
      en: 'The building blocks of every modern website.',
    },
  },
  {
    id: 'css',
    num: '02',
    toneClass: TONE_MAP.yellow,
    name: 'CSS3',
    searchKeys: 'css css3 style layout design flexbox grid responsive',
    lessonsFallback: 105,
    levelLabel: { ckb: 'سەرەتایی', kmr: 'دەستپێک', ar: 'مبتدئ', en: 'BEGINNER' },
    tags: {
      ckb: 'شێواز و دیزاین',
      kmr: 'شێواز و دیزاین',
      ar: 'التنسيق والتصميم',
      en: 'Style your ideas',
    },
    descriptions: {
      ckb: 'دیزاینی جوان و ڕیسپۆنسیڤ بە Flexbox و Grid.',
      kmr: 'دیزاینێن جوان و ڕیسپۆنسیڤ ب Flexbox و Grid.',
      ar: 'تصاميم عصرية متجاوبة باستخدام Flexbox و Grid.',
      en: 'Make beautiful, responsive designs cleanly.',
    },
  },
  {
    id: 'js',
    num: '03',
    toneClass: TONE_MAP.purple,
    name: 'JavaScript',
    searchKeys: 'js javascript interactive dom async es6 logic',
    lessonsFallback: 120,
    levelLabel: { ckb: 'باوترین', kmr: 'بەربەلاڤ', ar: 'الأكثر طلباً', en: 'POPULAR' },
    tags: {
      ckb: 'زیندووکردنی وێب',
      kmr: 'زیندوکرنا وێبێ',
      ar: 'برمجة التفاعل',
      en: 'Bring pages to life',
    },
    descriptions: {
      ckb: 'کارلێکی DOM، فەنکشن و پرۆگرامینگی مۆدێرن.',
      kmr: 'کارلێکا DOM، فەنکشن و پرۆگرامسازیا مۆدێرن.',
      ar: 'إضافة التفاعل والدوال والبرمجة الحديثة للمتصفح.',
      en: 'Make websites interactive with modern ES+ code.',
    },
  },
  {
    id: 'react',
    num: '04',
    toneClass: TONE_MAP.teal,
    name: 'React 19',
    searchKeys: 'react hooks jsx ui components frontend',
    lessonsFallback: 100,
    levelLabel: { ckb: 'ناوەند', kmr: 'ناڤنجی', ar: 'متوسط', en: 'INTERMEDIATE' },
    tags: {
      ckb: 'ڕووکاری مۆدێرن',
      kmr: 'ڕووکارێ مۆدێرن',
      ar: 'واجهات تفاعلية',
      en: 'Build modern UIs',
    },
    descriptions: {
      ckb: 'کامپۆنێنتی دووبارەبەکارهاتوو و Hooks.',
      kmr: 'کامپۆنێنتێن دوبارەبکارهاتی و Hooks.',
      ar: 'بناء واجهات مرنة عبر المكونات وخطافات Hooks.',
      en: 'Create reusable, component-driven interfaces.',
    },
  },
  {
    id: 'python',
    num: '05',
    toneClass: TONE_MAP.blue,
    name: 'Python',
    searchKeys: 'python py ai data automation backend',
    lessonsFallback: 100,
    levelLabel: { ckb: 'سەرەتایی', kmr: 'دەستپێک', ar: 'مبتدئ', en: 'BEGINNER' },
    tags: {
      ckb: 'زیرەکی و داتا',
      kmr: 'زیرەکی و داتا',
      ar: 'الذكاء والبيانات',
      en: 'Create with code',
    },
    descriptions: {
      ckb: 'زمانێکی ئاسان بۆ زیرەکی دەستکرد و ئۆتۆمەیشن.',
      kmr: 'زمانەکێ سادە بۆ زیرەکییا دەستکرد و ئۆتۆمەیشن.',
      ar: 'لغة ودودة للأفكار الكبرى والذكاء الاصطناعي.',
      en: 'A friendly language for AI, data, and big ideas.',
    },
  },
  {
    id: 'tsx',
    num: '06',
    toneClass: TONE_MAP.peach,
    name: 'TypeScript',
    searchKeys: 'ts tsx typescript types safety interfaces',
    lessonsFallback: 100,
    levelLabel: { ckb: 'ئەندازیاری', kmr: 'ئەندازیاری', ar: 'هندسة', en: 'TYPE-SAFE' },
    tags: {
      ckb: 'کۆدی پارێزراو',
      kmr: 'کۆدێ پاراستی',
      ar: 'أمان الأنواع',
      en: 'Write safer JavaScript',
    },
    descriptions: {
      ckb: 'دۆزینەوەی هەڵەکان پێش کارپێکردنی پڕۆژە.',
      kmr: 'دیتنا شاشییان بەری بکارئینانا پڕۆژەی.',
      ar: 'كتابة كود موثوق يمنع أخطاء التشغيل المبكرة.',
      en: 'Catch bugs early with strict types and React TSX.',
    },
  },
  {
    id: 'vite',
    num: '07',
    toneClass: TONE_MAP.yellow,
    name: 'Vite',
    searchKeys: 'vite tooling build hmr bundler',
    lessonsFallback: 100,
    levelLabel: { ckb: 'خێرا', kmr: 'بلەز', ar: 'سريع', en: 'TOOLING' },
    tags: {
      ckb: 'بنیاتنانی خێرا',
      kmr: 'ئاڤاکرنا بلەز',
      ar: 'أدوات البناء',
      en: 'Ship lightning fast',
    },
    descriptions: {
      ckb: 'سێرڤەری خێرا و ئامادەکردنی پڕۆژە بۆ بڵاوکردنەوە.',
      kmr: 'سێرڤەرێ بلەز و ئامادەکرنا پڕۆژان.',
      ar: 'تهيئة وبناء مشاريع الويب الحديثة بأعلى سرعة.',
      en: 'Instant HMR and clean production bundling.',
    },
  },
  {
    id: 'cpp',
    num: '08',
    toneClass: TONE_MAP.purple,
    name: 'C++',
    searchKeys: 'c++ cpp systems pointers memory oop',
    lessonsFallback: 100,
    levelLabel: { ckb: 'سیستەم', kmr: 'سیستەم', ar: 'أنظمة', en: 'SYSTEMS' },
    tags: {
      ckb: 'خێرایی و میمۆری',
      kmr: 'لەزاتی و میمۆری',
      ar: 'الأداء العالي',
      en: 'Master performance',
    },
    descriptions: {
      ckb: 'پۆینتەر، بەڕێوەبردنی میمۆری و ئەلگۆریتمەکان.',
      kmr: 'پۆینتەر، ڕێڤەبرنا میمۆریێ و ئەلگۆریتم.',
      ar: 'إدارة الذاكرة والمؤشرات والبرمجة عالية الأداء.',
      en: 'Understand memory, pointers, OOP, and speed.',
    },
  },
];

interface PlatformFeatureItem {
  id: string;
  view: ActiveView;
  badge: string;
  toneClass: string;
  searchKeys: string;
  icon: React.ReactNode;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  desc: Record<Locale, string>;
  cta: Record<Locale, string>;
}

const HOME_COPY: Record<
  Locale,
  {
    heroEyebrow: string;
    heroTitle1: string;
    heroTitle2: string;
    heroDesc: string;
    searchPlaceholder: string;
    searchBtn: string;
    popularLabel: string;
    clearSearch: string;
    foundResults: (n: number, q: string) => string;
    runCodeBtn: string;
    togglePreview: string;
    hidePreview: string;
    editorReady: string;
    editorGreeting: string;
    editorSub: string;
    b1Title: string;
    b1Sub: string;
    b2Title: string;
    b2Sub: string;
    b3Title: string;
    b3Sub: string;
    b4Title: string;
    b4Sub: string;
    coursesEyebrow: string;
    coursesHeading: string;
    coursesSub: string;
    viewAllCourses: string;
    exploreCourse: string;
    lessonsUnit: string;
    completedLabel: string;
    practiceCardBadge: string;
    practiceCardTitle: string;
    practiceCardSub: string;
    practiceCardDesc: string;
    practiceCardCta: string;
    featuresEyebrow: string;
    featuresHeading: string;
    featuresSub: string;
    adminShortcut: string;
    practiceEyebrow: string;
    practiceTitle1: string;
    practiceTitle2: string;
    practiceDesc: string;
    solveChallengeBtn: string;
    openAcademyBtn: string;
    quickQuizEyebrow: string;
    quizQuestion: string;
    quizInitialFeedback: string;
    quizCorrectFeedback: string;
    quizWrongFeedback: string;
    todayLiveChallenge: string;
    ptsUnit: string;
  }
> = {
  ckb: {
    heroEyebrow: 'شوێنی فێربوونی پرۆگرامینگ',
    heroTitle1: 'توانات بنیات بنێ.',
    heroTitle2: 'داهاتوو دروست بکە.',
    heroDesc: 'وانەی پراکتیکی و تاقیگەی کۆد لە یەک شوێن.',
    searchPlaceholder: 'گەڕان لە کۆرسەکان...',
    searchBtn: 'گەڕان',
    popularLabel: 'باوترین:',
    clearSearch: 'پاککردنەوە',
    foundResults: (n, q) => `${n} ئەنجام دۆزرایەوە بۆ "${q}"`,
    runCodeBtn: 'تاقیبکەرەوە',
    togglePreview: 'پێشبینین',
    hidePreview: 'شاردنەوە',
    editorReady: 'Code Lab',
    editorGreeting: 'سڵاو، karejan!',
    editorSub: 'یەکەم وێبپەڕت بە خێرایی دروست بکە.',
    b1Title: 'ئاسان بۆ سەرەتا',
    b1Sub: '٨ کۆرس و ٨٤٠+ وانە لە سفرەوە',
    b2Title: 'فێربوون بە کردار',
    b2Sub: 'تاقیکردنەوە لەدوای هەر ٣ وانەیەک',
    b3Title: 'تاقیگە و مامۆستای AI',
    b3Sub: 'کۆد بنووسە و یەکسەر تاقیبکەرەوە',
    b4Title: 'بە ٤ زمان بەردەستە',
    b4Sub: 'سۆرانی · بادینی · عەرەبی · ئینگلیزی',
    coursesEyebrow: 'هەموو ڕێڕەوەکان بگەڕێ',
    coursesHeading: 'دەتەوێت چی فێربیت؟',
    coursesSub: 'زمانێک هەڵبژێرە، ٣ وانە بخوێنە و ڕاستەوخۆ تاقیکردنەوەکە بکە.',
    viewAllCourses: 'هەموو وانەکان',
    exploreCourse: 'کردنەوەی کۆرس',
    lessonsUnit: 'وانە',
    completedLabel: 'تەواوکراو',
    practiceCardBadge: 'چاڵنج',
    practiceCardTitle: 'چاڵنج و ڕاهێنان',
    practiceCardSub: 'بە کردار بیسەلمێنە',
    practiceCardDesc: 'چاڵنجی ڕۆژانەی JavaScript و ڕاهێنانە تێکەڵکراوەکان.',
    practiceCardCta: 'کردنەوەی چاڵنج',
    featuresEyebrow: 'ئامراز و تایبەتمەندییەکانی karejan',
    featuresHeading: 'هەموو ئامرازەکانی وێبسایت لە یەک شوێن',
    featuresSub: 'لە تاقیگەی کۆدەوە تا مامۆستای زیرەک و ٥٠ ئامرازی AI.',
    adminShortcut: 'پانێڵی ئەدمین',
    practiceEyebrow: 'فێربوون بە ئەنجامدان',
    practiceTitle1: 'ڕاهێنان',
    practiceTitle2: 'پێشکەوتن دەهێنێت.',
    practiceDesc: 'لەدوای هەر ٣ وانەیەک تاقیکردنەوەی ئۆتۆماتیکی دەکرێتەوە، لەگەڵ چاڵنجی ڕۆژانە و لیستی پاڵەوانان.',
    solveChallengeBtn: 'شیکارکردنی چاڵنجی ئەمڕۆ',
    openAcademyBtn: 'ڕاهێنان لە ئەکادیمیا',
    quickQuizEyebrow: 'تاقیکردنەوەی خێرا',
    quizQuestion: 'کام تاگ لە HTML لینک دروست دەکات؟',
    quizInitialFeedback: 'وەڵامێک هەڵبژێرە بۆ تاقیکردنەوە.',
    quizCorrectFeedback: 'دروستە! تاگی <a> بەستەر (link) دروست دەکات.',
    quizWrongFeedback: 'نزیک بوو! وەڵامێکی تر تاقی بکەرەوە.',
    todayLiveChallenge: 'چاڵنجی ئەمڕۆ:',
    ptsUnit: 'خاڵ',
  },
  kmr: {
    heroEyebrow: 'جهێ فێربوونا پرۆگرامسازیێ',
    heroTitle1: 'شیانان ئاڤا بکە.',
    heroTitle2: 'پڕۆژەیان چێبکە.',
    heroDesc: 'وانەیێن پراکتیکی و تاقیگەها کۆدی د ئێک جهدا.',
    searchPlaceholder: 'لێگەڕیان د کۆرسان دا...',
    searchBtn: 'لێگەڕیان',
    popularLabel: 'بەربەلاڤ:',
    clearSearch: 'پاقژکرن',
    foundResults: (n, q) => `${n} ئەنجام هاتنە دیتن بۆ "${q}"`,
    runCodeBtn: 'ب خۆ تاقیبکە',
    togglePreview: 'پێشدیتن',
    hidePreview: 'ڤەشارتن',
    editorReady: 'Code Lab',
    editorGreeting: 'سڵاڤ، karejan!',
    editorSub: 'ئێکەم وێبپەڕا خۆ ب سادەهی چێبکە.',
    b1Title: 'گونجای بۆ دەستپێکێ',
    b1Sub: '٨ کۆرس و ٨٤٠+ وانە ژ سفرێ',
    b2Title: 'فێربوون ب پراکتیک',
    b2Sub: 'ئەزموون پشتی هەر ٣ وانەیان',
    b3Title: 'تاقیگە و یاریدەدەرێ AI',
    b3Sub: 'کۆدی بنڤیسە و ڕاستەوخۆ تاقیبکە',
    b4Title: 'ب ٤ زمانان بەردەستە',
    b4Sub: 'سۆرانی · بادینی · عەرەبی · ئینگلیزی',
    coursesEyebrow: 'هەمی دەلیڤان بگەڕێ',
    coursesHeading: 'تە دڤێت چ فێرببی؟',
    coursesSub: 'زمانەکی هەلبژێرە و پێنگاڤ ب پێنگاڤ پڕۆژان چێبکە.',
    viewAllCourses: 'هەمی وانە',
    exploreCourse: 'ڤەکرنا کۆرسی',
    lessonsUnit: 'وانە',
    completedLabel: 'تمامبوویە',
    practiceCardBadge: 'چالێنج',
    practiceCardTitle: 'چالێنج و ڕاهێنان',
    practiceCardSub: 'ب کردار بسەلمینە',
    practiceCardDesc: 'چالێنجا ڕۆژانە یا JavaScript و ئەزموونێن تێکەڵکری.',
    practiceCardCta: 'ڤەکرنا چالێنجێ',
    featuresEyebrow: 'ئامراز و تایبەتمەندیێن karejan',
    featuresHeading: 'هەمی تایبەتمەندیێن وێبسایتی د ئێک جهدا',
    featuresSub: 'ژ تاقیگەها کۆدی هەتا مامۆستایێ AI و ٥٠ ئامرازێن زیرەک.',
    adminShortcut: 'پانێلێ ڕێڤەبەریێ',
    practiceEyebrow: 'فێربوون ب کارکرنێ',
    practiceTitle1: 'ڕاهێنان',
    practiceTitle2: 'پێشکەفتنێ دئینیت.',
    practiceDesc: 'پشتی هەر ٣ وانەیان ئەزموونەکا کارلێککەر ڤەدبیت، دگەل چالێنجا ڕۆژانە و لیستەیا قارەمانان.',
    solveChallengeBtn: 'شیکارکرنا چالێنجا ئەڤرۆ',
    openAcademyBtn: 'ڕاهێنان د ئەکادیمیایێ دا',
    quickQuizEyebrow: 'ئەزموونا بلەز',
    quizQuestion: 'کیژ تاگ د HTML دا لینکی دروست دکەت؟',
    quizInitialFeedback: 'بەرسڤەکێ هەلبژێرە دا تاقیبکەی.',
    quizCorrectFeedback: 'دروستە! تاگێ <a> لینکی دروست دکەت.',
    quizWrongFeedback: 'نێزیک بوو! بەرسڤەکا دی تاقیبکە.',
    todayLiveChallenge: 'چالێنجا ئەڤرۆ:',
    ptsUnit: 'خاڵ',
  },
  ar: {
    heroEyebrow: 'المكان الأسهل لتعلّم البرمجة',
    heroTitle1: 'ابنِ مهاراتك.',
    heroTitle2: 'اصنع مشاريعك.',
    heroDesc: 'دروس عملية ومختبر كود في مكان واحد.',
    searchPlaceholder: 'ابحث في المسارات...',
    searchBtn: 'بحث',
    popularLabel: 'الشائع:',
    clearSearch: 'مسح',
    foundResults: (n, q) => `تم العثور على ${n} نتيجة لـ "${q}"`,
    runCodeBtn: 'جرّب الكود',
    togglePreview: 'معاينة',
    hidePreview: 'إخفاء',
    editorReady: 'Code Lab',
    editorGreeting: 'مرحباً، karejan!',
    editorSub: 'أنشئ صفحتك الأولى بكل سلاسة.',
    b1Title: 'مناسب للمبتدئين',
    b1Sub: '٨ مسارات و٨٤٠+ درساً من الصفر',
    b2Title: 'تعلّم بالممارسة',
    b2Sub: 'تقييم مدمج بعد كل ٣ دروس',
    b3Title: 'مختبر كود ومساعد AI',
    b3Sub: 'اكتب الكود وجرّبه في نفس اللحظة',
    b4Title: 'بأربع لغات متكاملة',
    b4Sub: 'سوراني · باديني · عربي · إنجليزي',
    coursesEyebrow: 'استكشف المسارات التعليمية',
    coursesHeading: 'ماذا تريد أن تتعلّم؟',
    coursesSub: 'اختر لغة برمجة وابدأ التعلّم مع اختبارات بعد كل ٣ دروس.',
    viewAllCourses: 'كل الدروس',
    exploreCourse: 'ابدأ المسار',
    lessonsUnit: 'درس',
    completedLabel: 'مكتمل',
    practiceCardBadge: 'التحديات',
    practiceCardTitle: 'التحدي اليومي والتمارين',
    practiceCardSub: 'طبّق ما تعلّمته',
    practiceCardDesc: 'تحديات JavaScript اليومية والاختبارات المدمجة.',
    practiceCardCta: 'ابدأ التحدي',
    featuresEyebrow: 'أدوات ومميزات karejan',
    featuresHeading: 'جميع مميزات المنصة في متناول يدك',
    featuresSub: 'من مختبر الكود الحي إلى المساعد الذكي ودليل الأدوات.',
    adminShortcut: 'لوحة الإدارة',
    practiceEyebrow: 'التعلّم بالتطبيق',
    practiceTitle1: 'الممارسة تصنع',
    practiceTitle2: 'التقدّم الحقيقي.',
    practiceDesc: 'بعد كل ٣ دروس يُفتح لك تقييم عملي تفاعلي، إضافةً إلى تحدي البرمجة اليومي ولوحة الأبطال.',
    solveChallengeBtn: 'حل تحدي اليوم الآن',
    openAcademyBtn: 'التمارين في الأكاديمية',
    quickQuizEyebrow: 'تحدٍ سريع',
    quizQuestion: 'أي وسم في HTML يُستخدم لإنشاء رابط؟',
    quizInitialFeedback: 'اختر إجابة لتجربة التحدي فوراً.',
    quizCorrectFeedback: 'إجابة صحيحة! وسم <a> ينشئ الروابط.',
    quizWrongFeedback: 'ليست هذه الإجابة، جرّب خياراً آخر.',
    todayLiveChallenge: 'تحدي اليوم:',
    ptsUnit: 'نقطة',
  },
  en: {
    heroEyebrow: 'THE PLACE TO LEARN TO CODE',
    heroTitle1: 'Build skills.',
    heroTitle2: 'Make things.',
    heroDesc: 'Guided coding lessons and live Code Lab in one place.',
    searchPlaceholder: 'Search courses...',
    searchBtn: 'Search',
    popularLabel: 'Popular:',
    clearSearch: 'Clear',
    foundResults: (n, q) => `${n} result${n === 1 ? '' : 's'} found for "${q}".`,
    runCodeBtn: 'Try it yourself',
    togglePreview: 'Preview',
    hidePreview: 'Hide preview',
    editorReady: 'Code Lab',
    editorGreeting: 'Hello, karejan!',
    editorSub: 'Build your first webpage here.',
    b1Title: 'Beginner friendly',
    b1Sub: '8 structured tracks, 840+ lessons',
    b2Title: 'Learn by doing',
    b2Sub: 'Built-in quiz after every 3 lessons',
    b3Title: 'Live Code Lab & AI',
    b3Sub: 'Write code and get instant help',
    b4Title: '4 Native Languages',
    b4Sub: 'Sorani · Badini · Arabic · English',
    coursesEyebrow: 'EXPLORE THE POSSIBILITIES',
    coursesHeading: 'What do you want to learn?',
    coursesSub: 'Start with a track and unlock interactive practice after every 3 lessons.',
    viewAllCourses: 'View all courses',
    exploreCourse: 'Explore course',
    lessonsUnit: 'lessons',
    completedLabel: 'completed',
    practiceCardBadge: 'PRACTICE',
    practiceCardTitle: 'Challenges & Tests',
    practiceCardSub: 'Prove your skills',
    practiceCardDesc: 'Daily JavaScript missions and integrated quizzes.',
    practiceCardCta: 'Start practice',
    featuresEyebrow: 'ALL karejan FEATURES',
    featuresHeading: 'Every tool you need in one place',
    featuresSub: 'Code Lab, AI Tutor, 50 AI Tools, Golden Prompts, Discovery Hub & Dashboard.',
    adminShortcut: 'Admin Console',
    practiceEyebrow: 'LEARN BY DOING',
    practiceTitle1: 'Practice makes',
    practiceTitle2: 'progress.',
    practiceDesc: 'Put your new skills to work with automatic practice every 3 lessons, plus today’s live coding challenge.',
    solveChallengeBtn: 'Solve today’s challenge',
    openAcademyBtn: 'Open Academy practice',
    quickQuizEyebrow: 'QUICK CHALLENGE',
    quizQuestion: 'Which tag creates a link?',
    quizInitialFeedback: 'Choose an answer to try it out.',
    quizCorrectFeedback: 'Correct! The <a> tag creates a hyperlink.',
    quizWrongFeedback: 'Not quite. Try another answer.',
    todayLiveChallenge: 'Live challenge:',
    ptsUnit: 'pts',
  },
};

export const HomeView: React.FC = () => {
  const {
    locale,
    lessons,
    completedLessonIds,
    staffRole,
    setActiveLessonId,
    setActiveView,
    openCodeInEditor,
  } = useApp();

  const copy = pickLoc(locale, HOME_COPY);
  const [searchQuery, setSearchQuery] = useState('');
  const tutorialsRef = useRef<HTMLElement>(null);

  const isStaff = staffRole !== 'user';
  const todayChallenge = CLIENT_DAILY_CHALLENGES[0];
  const challengeTitle = todayChallenge.titles[locale] || todayChallenge.titles.en || todayChallenge.titles.ckb;

  const lessonCountsByTrack = useMemo(() => {
    const counts: Record<string, { total: number; done: number }> = {};
    lessons.forEach((lesson) => {
      const entry = counts[lesson.courseId] || { total: 0, done: 0 };
      entry.total += 1;
      if (completedLessonIds.has(lesson.id)) entry.done += 1;
      counts[lesson.courseId] = entry;
    });
    return counts;
  }, [lessons, completedLessonIds]);

  const handleOpenCourse = (trackId: TrackId) => {
    const trackLessons = lessons.filter((l) => l.courseId === trackId);
    const nextUnfinished = trackLessons.find((l) => !completedLessonIds.has(l.id)) || trackLessons[0];
    if (nextUnfinished) setActiveLessonId(nextUnfinished.id);
    setActiveView('academy');
  };

  const handleHeroRunInLab = () => {
    openCodeInEditor({
      html: `<!DOCTYPE html>\n<html>\n  <body>\n    <div class="hero-card">\n      <h1>${copy.editorGreeting}</h1>\n      <p>${copy.editorSub}</p>\n    </div>\n  </body>\n</html>`,
      css: `body {\n  font-family: Inter, system-ui, sans-serif;\n  background: #f8faf8;\n  color: #18362b;\n  padding: 2rem;\n}\n.hero-card {\n  background: #ffffff;\n  border: 1px solid #d8e8df;\n  border-left: 5px solid #087f5b;\n  border-radius: 14px;\n  padding: 24px;\n}`,
      js: `console.log("karejan Code Lab ready!");`,
      lessonId: null,
    });
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tutorialsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const platformFeatures: PlatformFeatureItem[] = useMemo(
    () => [
      {
        id: 'code-lab',
        view: 'editor',
        badge: 'HTML · CSS · JS',
        toneClass: TONE_MAP.green,
        searchKeys: 'code lab editor playground sandbox live preview',
        icon: <Terminal className="h-5 w-5" />,
        title: { ckb: 'تاقیگەی کۆد (Code Lab)', kmr: 'تاقیگەها کۆدی', ar: 'مختبر الكود المباشر', en: 'Live Code Lab' },
        subtitle: { ckb: 'نووسین و تاقیکردنەوەی کۆد', kmr: 'نڤیسین و تاقیکرنا کۆدی', ar: 'كتابة وتشغيل الأكواد', en: 'Interactive sandbox editor' },
        desc: {
          ckb: 'تاقیکردنەوەی ڕاستەوخۆی HTML و CSS و JS لەگەڵ تێمپلەیت و پاشەکەوتکردنی کۆد.',
          kmr: 'تاقیکرنا ڕاستەوخۆ یا HTML و CSS و JS دگەل تێمپلەیت و پاشکەفتکرنا کۆدی.',
          ar: 'اكتب HTML و CSS و JS مع معاينة معزولة وحفظ مقاطعك الخاصة.',
          en: 'Write HTML, CSS & JS side-by-side with starter templates and cloud snippets.',
        },
        cta: { ckb: 'کردنەوەی تاقیگە', kmr: 'ڤەکرنا تاقیگەهێ', ar: 'افتح المختبر', en: 'Open Code Lab' },
      },
      {
        id: 'ai-tutor',
        view: 'ai',
        badge: '4 LANGUAGES',
        toneClass: TONE_MAP.purple,
        searchKeys: 'ai tutor assistant chat bot mentor karejan',
        icon: <Sparkles className="h-5 w-5" />,
        title: { ckb: 'مامۆستای karejan AI', kmr: 'مامۆستایێ karejan AI', ar: 'المساعد الذكي karejan AI', en: 'karejan AI Tutor' },
        subtitle: { ckb: 'یاریدەدەری ٢٤ کاتژمێری', kmr: 'هاریکارێ ٢٤ دەمژمێری', ar: 'مساعد برمجي فوري', en: 'Instant coding mentor' },
        desc: {
          ckb: 'پرسیار بکە و هەڵەی کۆدەکانت بە کوردی، عەرەبی یان ئینگلیزی چاک بکە.',
          kmr: 'پرسیاران بکە و شاشییێن کۆدێ خۆ ب کوردی یان ئینگلیزی چارەسەر بکە.',
          ar: 'اسأل عن أي مفهوم أو أصلح أخطاء الكود بلغتك مع أمثلة قابلة للتشغيل.',
          en: 'Debug code, get clear explanations, and learn faster in all 4 languages.',
        },
        cta: { ckb: 'دەستپێکردنی چات', kmr: 'دەستپێکرنا چاتێ', ar: 'ابدأ المحادثة', en: 'Chat with AI' },
      },
      {
        id: 'ai-tools',
        view: 'aitools',
        badge: `TOP ${TOP_50_AI_TOOLS.length}`,
        toneClass: TONE_MAP.blue,
        searchKeys: 'ai tools top 50 directory cursor agents coding',
        icon: <Bot className="h-5 w-5" />,
        title: { ckb: 'باشترین ٥٠ ئامرازی AI', kmr: '٥٠ باشترین ئامرازێن AI', ar: 'أفضل ٥٠ أداة ذكاء اصطناعي', en: 'TOP 50 AI Tools' },
        subtitle: { ckb: 'ڕیزبەندی و ڕێنمایی', kmr: 'ڕیزبەندی و ڕێنما', ar: 'دليل مصنّف ومحدّث', en: 'Curated tools directory' },
        desc: {
          ckb: 'هەڵبژاردەی باشترین ئامرازەکانی AI بۆ گەشەپێدان، دیزاین و خێراکردنی کارەکان.',
          kmr: 'باشترین ئامرازێن AI بۆ پرۆگرامسازی، دیزاین و لەزکرنا کاران.',
          ar: 'أهم أدوات الذكاء الاصطناعي للبرمجة والتصميم ورفع الإنتاجية.',
          en: 'Explore 50 top developer & creative AI tools with guides and filters.',
        },
        cta: { ckb: 'بینینی ٥٠ ئامراز', kmr: 'دیتنا ٥٠ ئامرازان', ar: 'تصفح الأدوات', en: 'Browse TOP 50' },
      },
      {
        id: 'golden-prompts',
        view: 'prompts',
        badge: `${GOLDEN_PROMPTS.length} PROMPTS`,
        toneClass: TONE_MAP.peach,
        searchKeys: 'prompts golden templates directives copy chat',
        icon: <Flame className="h-5 w-5" />,
        title: { ckb: '٢٢ پرۆمپتی زێڕین', kmr: '٢٢ پرۆمپتێن زێڕین', ar: '٢٢ أمراً احترافياً (Prompts)', en: '22 Golden Prompts' },
        subtitle: { ckb: 'کۆپی بکە و بەکاری بهێنە', kmr: 'کۆپی بکە و بکاربینە', ar: 'قوالب جاهزة للنسخ', en: 'Engineered prompt library' },
        desc: {
          ckb: 'پرۆمپتی پڕۆفیشناڵ و تاقیکراوە بۆ کۆد، فێربوون و پڕۆژە بە یەک کلیک.',
          kmr: 'پرۆمپتێن تاقیکری بۆ کۆد و فێربوونێ ب ئێک کلیک د چاتێ دا.',
          ar: 'أوامر برمجية وتعليمية عالية التأثير يمكن نسخها وتجربتها فوراً.',
          en: 'Copy high-impact engineering prompts or run them right in AI Chat.',
        },
        cta: { ckb: 'بینینی پرۆمپتەکان', kmr: 'دیتنا پرۆمپتان', ar: 'عرض الأوامر', en: 'View Prompts' },
      },
      {
        id: 'discover-hub',
        view: 'discover',
        badge: 'HUB',
        toneClass: TONE_MAP.teal,
        searchKeys: 'discover articles references docs projects templates',
        icon: <Compass className="h-5 w-5" />,
        title: { ckb: 'سەرچاوە و پڕۆژەکان', kmr: 'ژێدەر و پڕۆژە', ar: 'الاستكشاف والمشاريع', en: 'Discovery & References' },
        subtitle: { ckb: 'وتار و ڕێنمایی خێرا', kmr: 'گۆتار و ڕێنما', ar: 'مقالات ومراجع تقنية', en: 'Articles, docs & projects' },
        desc: {
          ckb: 'وتاری فێرکاری، سەرچاوەی HTML/CSS/JS و پڕۆژە بەنرخەکانی فێرخوازان.',
          kmr: 'گۆتارێن فێرکاری، ژێدەرێن خێرا و پڕۆژەیێن فێرخازان.',
          ar: 'مقالات معرفية، مراجع فورية للوسوم والأكواد، ومشاريع جاهزة.',
          en: 'Read curated articles, browse quick syntax docs, and inspect projects.',
        },
        cta: { ckb: 'کردنەوەی سەرچاوەکان', kmr: 'ڤەکرنا ژێدەران', ar: 'استكشف الآن', en: 'Open Discovery' },
      },
      {
        id: 'dashboard-pro',
        view: 'dashboard',
        badge: 'PROGRESS & PRO',
        toneClass: TONE_MAP.yellow,
        searchKeys: 'dashboard profile progress certificate pro plan stats',
        icon: <LayoutDashboard className="h-5 w-5" />,
        title: { ckb: 'داشبۆرد و پلانی Pro', kmr: 'داشبۆرد و پلانا Pro', ar: 'لوحتي وخطة Pro', en: 'Dashboard & Pro Plan' },
        subtitle: { ckb: 'پێشکەوتن و ئەندامێتی', kmr: 'پێشکەفتن و بەشداربوون', ar: 'تتبع التقدم والاشتراك', en: 'Track growth & unlock Pro' },
        desc: {
          ckb: 'بینینی ئاماری وانە تەواوکراوەکان، نمرەی تاقیکردنەوەکان و بەرزکردنەوەی هەژمار.',
          kmr: 'دیتنا ئامارێن وانەیان، نمرەیێن ئەزموونان و بلندکرنا هەژمارێ.',
          ar: 'تابع إنجازك في الدروس وسجل اختباراتك، أو ارتقِ لخطة Pro.',
          en: 'Monitor completed lessons, quiz scores, notifications, and Pro status.',
        },
        cta: { ckb: 'چوونە داشبۆرد', kmr: 'ڤەکرنا داشبۆردێ', ar: 'عرض لوحتي', en: 'Open Dashboard' },
      },
    ],
    []
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredTracks = useMemo(() => {
    if (!normalizedQuery) return FEATURED_TRACKS;
    return FEATURED_TRACKS.filter((track) => {
      const text = `${track.name} ${track.searchKeys} ${track.tags[locale]} ${track.descriptions[locale]}`.toLowerCase();
      return text.includes(normalizedQuery);
    });
  }, [normalizedQuery, locale]);

  const filteredFeatures = useMemo(() => {
    if (!normalizedQuery) return platformFeatures;
    return platformFeatures.filter((item) => {
      const text = `${item.title[locale]} ${item.subtitle[locale]} ${item.desc[locale]} ${item.searchKeys}`.toLowerCase();
      return text.includes(normalizedQuery);
    });
  }, [normalizedQuery, locale, platformFeatures]);

  const totalMatches = filteredTracks.length + filteredFeatures.length;

  const topicStripItems: { label: string; action: () => void }[] = [
    { label: 'HTML', action: () => handleOpenCourse('html') },
    { label: 'CSS', action: () => handleOpenCourse('css') },
    { label: 'JavaScript', action: () => handleOpenCourse('js') },
    { label: 'Python', action: () => handleOpenCourse('python') },
    { label: 'React', action: () => handleOpenCourse('react') },
    { label: 'Code Lab', action: () => setActiveView('editor') },
    { label: 'AI Tutor', action: () => setActiveView('ai') },
  ];

  return (
    <div>
      {/* 0. Clean Compact Topic Ribbon */}
      <nav aria-label="Popular tracks and tools" className="border-b border-[#20483b] bg-[#17372d] text-[#e0efe7] overflow-x-auto">
        <div className="mx-auto flex min-h-[44px] max-w-[1200px] items-center justify-center gap-7 px-4 sm:px-6 whitespace-nowrap text-xs font-semibold">
          {topicStripItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className="shrink-0 py-2 transition-colors hover:text-[#9cebc3] cursor-pointer"
            >
              <span dir="ltr">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 1. Minimal Deep Forest Hero */}
      <section className="cn-hero border-b border-[#1d4438]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_470px] lg:gap-14 lg:py-16">
          {/* Left Hero Copy + Search */}
          <div className="text-start">
            <h1 className="text-[40px] font-extrabold leading-[1.15] tracking-[-0.04em] text-white sm:text-[50px] lg:text-[56px]">
              {copy.heroTitle1}
              <br />
              <span className="text-[#9cebc3]">{copy.heroTitle2}</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#c7ded2]">
              {copy.heroDesc}
            </p>

            {/* Simple Search Pill */}
            <form
              onSubmit={handleHeroSearchSubmit}
              role="search"
              className="mt-7 flex max-w-[460px] items-center rounded-[12px] bg-white p-1.5 text-[#688279] shadow-lg"
            >
              <Search className="ms-3 me-2 h-4 w-4 shrink-0 text-[#688279]" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={copy.searchPlaceholder}
                aria-label={copy.searchPlaceholder}
                className="min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-sm text-[#18362b] placeholder:text-[#8a9c93] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={copy.clearSearch}
                  className="me-1 grid h-8 w-8 place-items-center rounded-lg text-[#688279] hover:bg-[#edf4ef] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="shrink-0 rounded-[9px] bg-[#18a974] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#128b5f] cursor-pointer"
              >
                {copy.searchBtn}
              </button>
            </form>

            {/* 3 Quick Popular Shortcuts */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#9cb8a8]">
              <span>{copy.popularLabel}</span>
              <button type="button" onClick={() => handleOpenCourse('html')} className="font-semibold text-[#e5f6ec] hover:text-[#9cebc3] cursor-pointer">
                HTML
              </button>
              <button type="button" onClick={() => handleOpenCourse('python')} className="font-semibold text-[#e5f6ec] hover:text-[#9cebc3] cursor-pointer">
                Python
              </button>
              <button type="button" onClick={() => setActiveView('editor')} className="font-semibold text-[#9cebc3] hover:underline cursor-pointer">
                Code Lab
              </button>
            </div>
          </div>

          {/* Minimal Clean Code Card */}
          <div
            aria-label="Example HTML code"
            className="overflow-hidden rounded-[18px] bg-[#f3f8f4] text-[#187e5d] shadow-[0_20px_38px_rgba(0,24,15,0.4)] dark:border dark:border-[#244538] dark:bg-[#0f211b] dark:text-[#9cebc3]"
          >
            <div dir="ltr" className="flex h-[48px] items-center justify-between bg-[#e8f1eb] px-5 text-xs font-semibold text-[#799586] dark:bg-[#162e26] dark:text-[#98b4a6]">
              <span className="tracking-widest">● &nbsp;● &nbsp;●</span>
              <span className="font-mono">index.html</span>
            </div>

            <div className="grid grid-cols-[20px_1fr] gap-x-3 gap-y-3 px-6 py-6 font-mono text-[13px] sm:text-[14px]" dir="ltr">
              <span className="text-[#9bac9f] dark:text-[#6e8c7e]">1</span>
              <code>&lt;!DOCTYPE html&gt;</code>
              <span className="text-[#9bac9f] dark:text-[#6e8c7e]">2</span>
              <code>&lt;html&gt;</code>
              <span className="text-[#9bac9f] dark:text-[#6e8c7e]">3</span>
              <code>&nbsp; &lt;body&gt;</code>
              <span className="text-[#9bac9f] dark:text-[#6e8c7e]">4</span>
              <code>&nbsp; &nbsp; &lt;h1&gt;Hello, karejan!&lt;/h1&gt;</code>
              <span className="text-[#9bac9f] dark:text-[#6e8c7e]">5</span>
              <code>&nbsp; &lt;/body&gt;</code>
              <span className="text-[#9bac9f] dark:text-[#6e8c7e]">6</span>
              <code>&lt;/html&gt;</code>
            </div>

            <div className="px-6 pb-6">
              <button
                type="button"
                onClick={handleHeroRunInLab}
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#087f5b] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#056949] cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{copy.runCodeBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Clean 4-Column Benefits Bar matching CodeNest .benefits */}
      <section aria-label="Why learn with karejan" className="border-b border-[var(--kj-border)] bg-[var(--kj-card)]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-5 px-4 py-7 sm:px-6 lg:grid-cols-4">
          <button
            type="button"
            onClick={() => setActiveView('academy')}
            className="flex items-center gap-4 text-start group cursor-pointer"
          >
            <b className="text-xl text-[#087f5b] dark:text-[#7ce3b3] shrink-0">✦</b>
            <p className="text-sm">
              <strong className="block font-bold text-[var(--kj-ink)] group-hover:text-[#087f5b] dark:group-hover:text-[#7ce3b3] transition-colors">
                {copy.b1Title}
              </strong>
              <span className="mt-1 block text-xs text-[var(--kj-muted)]">{copy.b1Sub}</span>
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('academy')}
            className="flex items-center gap-4 text-start group cursor-pointer"
          >
            <b className="text-xl text-[#087f5b] dark:text-[#7ce3b3] shrink-0">◉</b>
            <p className="text-sm">
              <strong className="block font-bold text-[var(--kj-ink)] group-hover:text-[#087f5b] dark:group-hover:text-[#7ce3b3] transition-colors">
                {copy.b2Title}
              </strong>
              <span className="mt-1 block text-xs text-[var(--kj-muted)]">{copy.b2Sub}</span>
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('editor')}
            className="flex items-center gap-4 text-start group cursor-pointer"
          >
            <b className="text-xl text-[#087f5b] dark:text-[#7ce3b3] shrink-0">⌘</b>
            <p className="text-sm">
              <strong className="block font-bold text-[var(--kj-ink)] group-hover:text-[#087f5b] dark:group-hover:text-[#7ce3b3] transition-colors">
                {copy.b3Title}
              </strong>
              <span className="mt-1 block text-xs text-[var(--kj-muted)]">{copy.b3Sub}</span>
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('challenge')}
            className="flex items-center gap-4 text-start group cursor-pointer"
          >
            <b className="text-xl text-[#087f5b] dark:text-[#7ce3b3] shrink-0">✓</b>
            <p className="text-sm">
              <strong className="block font-bold text-[var(--kj-ink)] group-hover:text-[#087f5b] dark:group-hover:text-[#7ce3b3] transition-colors">
                {copy.b4Title}
              </strong>
              <span className="mt-1 block text-xs text-[var(--kj-muted)]">{copy.b4Sub}</span>
            </p>
          </button>
        </div>
      </section>

      {/* 3. Courses Grid (#tutorials) matching CodeNest .tutorials & .cards */}
      <section ref={tutorialsRef} id="tutorials" className="mx-auto max-w-[1200px] px-4 pt-16 pb-12 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 text-start">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
              {copy.coursesEyebrow}
            </p>
            <h2 className="mt-2.5 text-3xl font-extrabold tracking-[-0.035em] text-[var(--kj-ink)] sm:text-[36px] leading-[1.2]">
              {copy.coursesHeading}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[var(--kj-muted)]">
              {copy.coursesSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('academy')}
            className="inline-flex items-center justify-center rounded-[10px] bg-[#e4f2e9] px-5 py-3 text-sm font-bold text-[#126548] transition-colors hover:bg-[#d0ebda] dark:bg-[#173a2d] dark:text-[#9cebc3] dark:hover:bg-[#1f4d3c] cursor-pointer"
          >
            {copy.viewAllCourses}
          </button>
        </div>

        {normalizedQuery && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#cce3d4] bg-[#e9f5ee] px-4 py-3 text-xs font-semibold text-[#126548] dark:border-[#214538] dark:bg-[#132d24] dark:text-[#9cebc3]">
            <span role="status" aria-live="polite">
              {copy.foundResults(totalMatches, searchQuery.trim())}
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="rounded-md bg-white/80 px-2.5 py-1 font-bold text-[#087f5b] hover:bg-white dark:bg-[#1a3a2f] dark:text-[#9cebc3] cursor-pointer"
            >
              {copy.clearSearch}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTracks.map((track) => {
            const stats = lessonCountsByTrack[track.id];
            const totalCount = stats?.total || track.lessonsFallback;
            const doneCount = stats?.done || 0;

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => handleOpenCourse(track.id)}
                className="group flex min-h-[248px] flex-col rounded-[16px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-6 text-start transition-all hover:-translate-y-0.5 hover:border-[#77c99c] hover:shadow-md cursor-pointer"
              >
                <div className="flex w-full items-start justify-between">
                  <span className={`grid h-[54px] w-[54px] place-items-center rounded-[14px] text-base font-extrabold ${track.toneClass}`}>
                    {track.num}
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#438667] dark:text-[#7ce3b3]">
                      {track.levelLabel[locale]}
                    </span>
                    {doneCount > 0 && (
                      <span className="rounded-full bg-[#e4f6ea] px-2 py-0.5 text-[10px] font-bold text-[#087f5b] dark:bg-[#173a2d] dark:text-[#9cebc3] tabular-nums">
                        {doneCount}/{totalCount} {copy.completedLabel}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-6 text-[24px] font-extrabold tracking-tight text-[var(--kj-ink)] group-hover:text-[#087f5b] dark:group-hover:text-[#7ce3b3] transition-colors">
                  {track.name}
                </h3>
                <h4 className="mt-1.5 text-sm font-bold text-[var(--kj-ink)]">
                  {track.tags[locale]}
                </h4>
                <p className="mt-1.5 mb-5 text-xs leading-relaxed text-[var(--kj-muted)]">
                  {track.descriptions[locale]}
                </p>

                <span className="mt-auto flex w-full items-center justify-between text-xs font-bold text-[#087f5b] dark:text-[#7ce3b3]">
                  <span>
                    {copy.exploreCourse} ({totalCount} {copy.lessonsUnit})
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </button>
            );
          })}

          {/* 9th Card (Completes clean 3x3 Grid unless filtered out) */}
          {(!normalizedQuery ||
            `${copy.practiceCardTitle} ${copy.practiceCardDesc} challenge quiz practice exercise`.toLowerCase().includes(normalizedQuery)) && (
            <button
              type="button"
              onClick={() => setActiveView('challenge')}
              className="group flex min-h-[248px] flex-col rounded-[16px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-6 text-start transition-all hover:-translate-y-0.5 hover:border-[#77c99c] hover:shadow-md cursor-pointer"
            >
              <div className="flex w-full items-start justify-between">
                <span className={`grid h-[54px] w-[54px] place-items-center rounded-[14px] text-base font-extrabold ${TONE_MAP.green}`}>
                  09
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-[#438667] dark:text-[#7ce3b3]">
                  {copy.practiceCardBadge}
                </span>
              </div>

              <h3 className="mt-6 text-[22px] font-extrabold tracking-tight text-[var(--kj-ink)] group-hover:text-[#087f5b] dark:group-hover:text-[#7ce3b3] transition-colors">
                {copy.practiceCardTitle}
              </h3>
              <h4 className="mt-1.5 text-sm font-bold text-[var(--kj-ink)]">
                {copy.practiceCardSub}
              </h4>
              <p className="mt-1.5 mb-5 text-xs leading-relaxed text-[var(--kj-muted)]">
                {copy.practiceCardDesc}
              </p>

              <span className="mt-auto flex w-full items-center justify-between text-xs font-bold text-[#087f5b] dark:text-[#7ce3b3]">
                <span>{copy.practiceCardCta}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>
          )}
        </div>
      </section>

      {/* 4. All karejan Website Features Ecosystem */}
      {filteredFeatures.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 text-start">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
                {copy.featuresEyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[var(--kj-ink)] sm:text-[32px]">
                {copy.featuresHeading}
              </h2>
              <p className="mt-1.5 text-sm text-[var(--kj-muted)]">{copy.featuresSub}</p>
            </div>
            {isStaff && (
              <button
                type="button"
                onClick={() => setActiveView('admin')}
                className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] px-4 py-2.5 text-xs font-bold text-[var(--kj-ink)] hover:border-[#087f5b] cursor-pointer"
              >
                <Shield className="h-4 w-4 text-[#087f5b] dark:text-[#7ce3b3]" />
                <span>{copy.adminShortcut}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFeatures.map((feat) => (
              <div
                key={feat.id}
                onClick={() => setActiveView(feat.view)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveView(feat.view);
                  }
                }}
                className="group flex flex-col rounded-[16px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-5 text-start transition-all hover:-translate-y-0.5 hover:border-[#77c99c] hover:shadow-md cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-[12px] ${feat.toneClass}`}>
                    {feat.icon}
                  </span>
                  <span className="rounded-md bg-[var(--kj-soft)] px-2 py-1 font-mono text-[10px] font-bold text-[#438667] dark:text-[#9cebc3]">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-[var(--kj-ink)] group-hover:text-[#087f5b] dark:group-hover:text-[#7ce3b3] transition-colors">
                  {feat.title[locale]}
                </h3>
                <p className="mt-0.5 text-xs font-bold text-[var(--kj-muted-2)]">{feat.subtitle[locale]}</p>
                <p className="mt-2 mb-5 text-xs leading-relaxed text-[var(--kj-muted)]">
                  {feat.desc[locale]}
                </p>

                <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-[var(--kj-border)]">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#087f5b] dark:text-[#7ce3b3]">
                    <span>{feat.cta[locale]}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                  {feat.id === 'dashboard-pro' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveView('pro');
                      }}
                      className="inline-flex items-center gap-1 rounded-md bg-[#e4f6ea] px-2.5 py-1 text-[11px] font-bold text-[#087f5b] hover:bg-[#d0ebda] dark:bg-[#173a2d] dark:text-[#9cebc3] cursor-pointer"
                    >
                      <Crown className="h-3 w-3" />
                      <span>PRO</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Real Integrated Practice & Daily Challenge Banner (Zero Demo Data) */}
      <section id="practice" className="mx-auto max-w-[1200px] px-4 pt-6 pb-20 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[22px] border border-[#cde8d8] bg-[#ddf2e6] p-7 sm:p-10 lg:flex-row lg:items-center dark:border-[#214538] dark:bg-[#132d24]">
          <div className="text-start max-w-xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-[#087f5b] dark:text-[#7ce3b3]">
              {copy.practiceEyebrow}
            </p>
            <h2 className="mt-2.5 text-2xl font-extrabold tracking-[-0.03em] leading-tight text-[var(--kj-ink)] sm:text-[32px]">
              {copy.practiceTitle1}{' '}
              <span className="text-[#087f5b] dark:text-[#9cebc3]">{copy.practiceTitle2}</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#416657] dark:text-[#c2dbd0]">
              {copy.practiceDesc}
            </p>
            <p className="mt-2.5 inline-flex items-center gap-2 text-xs font-bold text-[#087f5b] dark:text-[#9cebc3]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                {copy.todayLiveChallenge} {challengeTitle} (+{todayChallenge.points} {copy.ptsUnit})
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setActiveView('academy')}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#087f5b] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#056949] cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span>{copy.openAcademyBtn}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('challenge')}
              className="inline-flex items-center gap-2 rounded-[10px] border border-[#b7dcc6] bg-white px-5 py-3 text-sm font-bold text-[#126548] transition-colors hover:bg-[#f2faf5] dark:border-[#274b3d] dark:bg-[#173a2d] dark:text-[#9cebc3] cursor-pointer"
            >
              <Zap className="h-4 w-4" />
              <span>{copy.solveChallengeBtn}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
