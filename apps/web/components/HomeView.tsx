import React from 'react';
import {
  Code2,
  Sparkles,
  Zap,
  Terminal,
  BookOpen,
  Award,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Flame,
  Bot,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { pickLoc } from '../i18n/translations';
import { CLIENT_DAILY_CHALLENGES } from '../data/dailyChallengesCatalog';
import type { Locale, TrackId } from '../types/domain';
import { Button } from './ui/Primitives';

interface TrackCardInfo {
  id: TrackId;
  name: string;
  codeGlyph: string;
  lessonsCount: number;
  tags: Record<Locale, string>;
  descriptions: Record<Locale, string>;
}

const FEATURED_TRACKS: TrackCardInfo[] = [
  {
    id: 'html',
    name: 'HTML5',
    codeGlyph: '<>',
    lessonsCount: 110,
    tags: {
      ckb: 'بنچینەی وێب',
      kmr: 'بنەمایێ وێبێ',
      ar: 'أساسيات الويب',
      en: 'Web Foundations',
    },
    descriptions: {
      ckb: 'فێربوونی تەواوی تاگەکان، پێکهاتەی وێبپەڕە، فۆڕم، میدیا، و ستانداردی مۆدێرنی HTML5 لە سەرەتاوە.',
      kmr: 'فێربوونا تەڤایا تاگان، پێکهاتەیا وێبپەڕان، فۆرم، میدیا و ستانداردێن مۆدێرن یێن HTML5 ژ دەستپێکێ.',
      ar: 'تعلّم جميع الوسوم، بنية صفحات الويب، النماذج، الوسائط، ومعايير HTML5 الحديثة من الصفر.',
      en: 'Master semantic tags, document structure, forms, multimedia, and modern HTML5 standards from scratch.',
    },
  },
  {
    id: 'css',
    name: 'CSS3',
    codeGlyph: '#',
    lessonsCount: 105,
    tags: {
      ckb: 'شێواز و دیزاین',
      kmr: 'شێواز و دیزاین',
      ar: 'التنسيق والتصميم',
      en: 'Styling & Layout',
    },
    descriptions: {
      ckb: 'شێوازدانانی پێشکەوتوو بە Flexbox, Grid, ئەنیمەیشن، و دروستکردنی ماڵپەڕی ڕیسپۆنسیڤ بۆ مۆبایل و کۆمپیوتەر.',
      kmr: 'دیزاینکرنا پێشکەفتی ب Flexbox, Grid, ئەنیمەیشن و چێکرنا مالپەڕێن ڕیسپۆنسیڤ بۆ مۆبایل و کۆمپیوتەران.',
      ar: 'تنسيق احترافي باستخدام Flexbox و Grid والرسوم المتحركة وبناء مواقع متجاوبة لجميع الشاشات.',
      en: 'Build responsive, accessible layouts with Flexbox, CSS Grid, transitions, and modern design systems.',
    },
  },
  {
    id: 'js',
    name: 'JavaScript',
    codeGlyph: 'JS',
    lessonsCount: 120,
    tags: {
      ckb: 'مێشکی وێب',
      kmr: 'مێشکێ وێبێ',
      ar: 'برمجة التفاعل',
      en: 'Web Interactivity',
    },
    descriptions: {
      ckb: 'فێربوونی مۆدێرنی JS بە ڕێگەی فەنکشن، Loop، بەڕێوەبردنی DOM، پڕۆمیس و ئاسینک لە سفرەوە تا ئاستی ئەندازیاری.',
      kmr: 'فێربوونا مۆدێرن یا JS ب فەنکشن، Loop، ڕێڤەبرنا DOM، Promise و Async ژ سەرەتا هەتا ئاستێ ئەندازیاریێ.',
      ar: 'تعلّم JavaScript الحديثة من الدوال والحلقات ومعالجة DOM إلى Promises و Async بمستوى هندسي متكامل.',
      en: 'Learn modern ES syntax, functions, loops, DOM manipulation, Promises, and async engineering from step zero.',
    },
  },
  {
    id: 'react',
    name: 'React 19',
    codeGlyph: '⚛',
    lessonsCount: 100,
    tags: {
      ckb: 'فرەیموۆرکی پێشەنگ',
      kmr: 'فرەیموۆرکا سەرەکی',
      ar: 'مكتبة الواجهات',
      en: 'Frontend Architecture',
    },
    descriptions: {
      ckb: 'دروستکردنی سیستەم و ماڵپەڕی زیندوو بە کامپۆنێنت، هۆکەکان (Hooks)، و دۆخی سەردەمیانەی ئەپڵیکەیشن.',
      kmr: 'ئاڤاکرنا سیستەم و ئەپڵیکەیشنێن زیندی ب کامپۆنێنتان، Hooks، و دۆخێ سەردەمێ ئەپان.',
      ar: 'بناء تطبيقات ويب تفاعلية حديثة باستخدام المكونات والخطافات (Hooks) وإدارة الحالة المتقدمة.',
      en: 'Craft interactive web apps using composable components, modern Hooks, and predictable state flows.',
    },
  },
  {
    id: 'vite',
    name: 'Vite & Tooling',
    codeGlyph: '⚡',
    lessonsCount: 100,
    tags: {
      ckb: 'ئامرازی خێرا',
      kmr: 'ئامرازێ بلەز',
      ar: 'أدوات البناء السريعة',
      en: 'Fast Build Tooling',
    },
    descriptions: {
      ckb: 'دامەزراندنی پرۆژەی مۆدێرن، پەیڕەوکردنی کۆد، و ڕێکخستنی سێرڤەری پرۆژە بە خێرایی باڵا.',
      kmr: 'دامەزراندنا پڕۆژەیێن مۆدێرن و ڕێکخستنا سێرڤەر و باندلکرنا کۆدی ب لەزاتیەکا مەزن.',
      ar: 'تهيئة المشاريع الحديثة، تسريع الحزم، وضبط بيئات التطوير بأعلى أداء ممكن.',
      en: 'Configure modern web projects, instantaneous HMR, production bundling, and clean tooling workflows.',
    },
  },
  {
    id: 'tsx',
    name: 'TypeScript (TSX)',
    codeGlyph: 'TS',
    lessonsCount: 100,
    tags: {
      ckb: 'کۆدی پارێزراو',
      kmr: 'کۆدێ پاراستی',
      ar: 'كتابة آمنة للأنواع',
      en: 'Type-Safe Engineering',
    },
    descriptions: {
      ckb: 'تایپکردنی بەهێز و توندوتۆڵ بۆ پڕۆژە گەورەکان و دڵنیابوونەوە لە نەبوونی هەڵەی پرۆگرامینگی باو.',
      kmr: 'تایپکرنا بهێز بۆ پڕۆژەیێن مەزن و دوورکەفتن ژ شاشییێن بەربەلاڤ یێن پرۆگرامسازیێ.',
      ar: 'تطوير مشاريع واسعة النطاق مع التحقق الصارم من الأنواع ومنع أخطاء التشغيل المبكرة.',
      en: 'Write strongly typed React and Node codebases that catch bugs at compile time before shipping.',
    },
  },
  {
    id: 'python',
    name: 'Python',
    codeGlyph: 'Py',
    lessonsCount: 100,
    tags: {
      ckb: 'زیرەکی و داتا',
      kmr: 'زیرەکی و داتا',
      ar: 'الذكاء والبيانات',
      en: 'AI & Automation',
    },
    descriptions: {
      ckb: 'فێربوونی زمانی گونجاو بۆ زیرەکی دەستکرد، ئۆتۆمەیشن، و شیکردنەوەی داتا بە شێوازی هەنگاو بە هەنگاو.',
      kmr: 'فێربوونا زمانێ گونجای بۆ زیرەکییا دەستکرد، ئۆتۆمەیشن و شیکرنا داتایان پێنگاڤ ب پێنگاڤ.',
      ar: 'إتقان لغة بايثون للذكاء الاصطناعي والأتمتة وتحليل البيانات خطوة بخطوة.',
      en: 'Learn the language powering AI engineering, scripting automation, APIs, and data analysis.',
    },
  },
  {
    id: 'cpp',
    name: 'C++',
    codeGlyph: 'C++',
    lessonsCount: 100,
    tags: {
      ckb: 'سیستەم و خێرایی',
      kmr: 'سیستەم و لەزاتی',
      ar: 'الأنظمة والأداء العالي',
      en: 'Systems Performance',
    },
    descriptions: {
      ckb: 'فێربوونی کۆنترۆڵی میمۆری و بنەماکانی سۆفتوێری ئاستی نزم بە تێگەیشتن لە چەمکە سەرەکییەکان.',
      kmr: 'فێربوونا کۆنترۆلکرنا میمۆریێ و بنەمایێن نەرمەکاڵایێن ئاستێ نزم و ئەلگۆریتمان.',
      ar: 'فهم إدارة الذاكرة وبنية البرمجيات منخفضة المستوى والخوارزميات فائقة السرعة.',
      en: 'Understand memory management, pointers, OOP, and high-performance systems fundamentals.',
    },
  },
];

const HOME_COPY: Record<
  Locale,
  {
    heroEyebrow: string;
    heroTitle1: string;
    heroTitle2: string;
    heroDesc: string;
    ctaLessons: string;
    ctaEditor: string;
    ctaChallenge: string;
    heroNote: string;
    yourFirstStep: string;
    codeHeading: string;
    codeSub: string;
    livePreview: string;
    codeWindowFooter: string;
    tracksStripLabel: string;
    pathsEyebrow: string;
    pathsHeading: string;
    pathsSub: string;
    viewAllLessons: string;
    lessonsUnit: string;
    newToCoding: string;
    startFromHtml: string;
    dailyEyebrow: string;
    diffEasy: string;
    diffMedium: string;
    rewardPrefix: string;
    pointsUnit: string;
    every24h: string;
    participateBtn: string;
    todayChampsWindow: string;
    dailyTaskComment: string;
    dailyCommentBottom: string;
    whyEyebrow: string;
    whyTitle1: string;
    whyTitle2: string;
    whyDesc: string;
    p1Title: string;
    p1Desc: string;
    p2Title: string;
    p2Desc: string;
    p3Title: string;
    p3Desc: string;
    p4Title: string;
    p4Desc: string;
    finalEyebrow: string;
    finalTitle: string;
    finalDesc: string;
    finalCta: string;
  }
> = {
  ckb: {
    heroEyebrow: 'پلاتفۆرمی نیشتمانی فێربوونی پرۆگرامینگ و تەکنەلۆژیا',
    heroTitle1: 'فێربوونی پرۆگرامینگ.',
    heroTitle2: 'داهاتووت دروست بکە.',
    heroDesc:
      'خاوەنی زیاتر لە ٨٤٠ وانەی زانستی، تاقیگەی ڕاستەوخۆی کۆد، پرسیاری ڕۆژانە، ٥٠ ئامرازی AI و مامۆستای زیرەک — هەمووی بە کوردی لە یەک شوێن.',
    ctaLessons: 'دەستپێکردنی وانەکان',
    ctaEditor: 'تاقیگەی کۆد',
    ctaChallenge: 'پرسیاری ڕۆژ ⚡',
    heroNote: 'لە سەرەتاوە دەستپێبکە و بە خێرایی خۆت فێربە — زیاد لە ٨ زمان ئامادەن.',
    yourFirstStep: 'هەنگاوی یەکەم',
    codeHeading: 'سڵاو جیهان! · Hello, KARÊJAN!',
    codeSub: 'با پێکەوە بنیات بنێین.',
    livePreview: 'پیشاندانی ڕاستەوخۆ',
    codeWindowFooter: 'دروستکراوە بۆ فێرخوازانی داهێنەر',
    tracksStripLabel: 'زمانە فێرکارییەکانی کاڕێژان',
    pathsEyebrow: 'ڕێڕەوی فێربوونت (LEARNING PATHS)',
    pathsHeading: 'لە هەر شوێنێک بیت، لێرەوە دەست پێبکە.',
    pathsSub: 'زمانێک هەڵبژێرە و هەنگاو بە هەنگاو لە سفرەوە تا ئاستی ئەندازیاری بڕۆ پێشەوە.',
    viewAllLessons: 'بینینی هەموو وانەکان',
    lessonsUnit: 'وانە',
    newToCoding: 'تازەیت لە پرۆگرامینگ؟',
    startFromHtml: 'لە HTML5ەوە دەستپێبکە — هیچ پێشینەیەک ناوێت.',
    dailyEyebrow: 'پرسیاری ڕۆژ و چاڵنجی خێرا (Daily Code Challenge ⚡)',
    diffEasy: 'ئاسان',
    diffMedium: 'ناوەند',
    rewardPrefix: 'پاداشت:',
    pointsUnit: 'خاڵ ⭐',
    every24h: 'هەموو ٢٤ کاتژمێر جارێک',
    participateBtn: 'ئێستا بەشداری بکە و وەڵام بدەرەوە',
    todayChampsWindow: 'پاڵەوانانی ئەمڕۆ',
    dailyTaskComment: '// ئەرکی ئەمڕۆ:',
    dailyCommentBottom: '// ئەوانەی وەڵامی دروست دەدەنەوە دەچنە لیستی پاڵەوانانی ئەمڕۆ',
    whyEyebrow: 'بۆچی پلاتفۆرمی کاڕێژان؟',
    whyTitle1: 'ژاوەژاوی کەمتر.',
    whyTitle2: 'فێربوونی زیاتر.',
    whyDesc: 'هەموو شتێک لە شوێنی دروستی خۆیدایە تا سەرنجت لەسەر فێربوون، تاقیکردنەوە و بنیاتنانی پڕۆژەی ڕاستەقینە بێت.',
    p1Title: 'تاقیگەی زیندووی کۆد (Code Lab)',
    p1Desc: 'ڕاستەوخۆ HTML, CSS و JavaScript بنووسە و ئەنجامەکەی ببینە بەبێ دامەزراندنی هیچ بەرنامەیەک.',
    p2Title: 'مامۆستای هۆشمەند (KARÊJAN AI)',
    p2Desc: 'لە هەر تاگ و کۆدێک تێنەگەیشتی، مامۆستا زیرەکەکە بە سادەیی و ڕوونی پێت دەڵێت بۆ چییە.',
    p3Title: 'TOP 50 ئامراز و ٢٢ پرۆمپتی زێڕین',
    p3Desc: 'هەموو ئامراز و ئەیجنتە جیهانییەکانی پرۆگرامینگ لەگەڵ فەرمانەکانی THINK10X و ELI5 لە یەک شوێن.',
    p4Title: 'ڕاهێنان و تاقیکردنەوەی تێکەڵکراو',
    p4Desc: 'هەڵبژاردن، دۆزینەوەی هەڵەی کۆد، تەواوکردن و کۆدنینگ ڕاستەوخۆ لەناو گڕوپەکانی وانەدا.',
    finalEyebrow: 'ئامادەیت دەست پێبکەیت؟',
    finalTitle: 'گەشتی پرۆگرامینگی تۆ لێرەوە دەست پێدەکات.',
    finalDesc: 'یەک وانە، یەک تاقیکردنەوە، یەک بیرۆکە لە هەر کاتێکدا.',
    finalCta: 'دەستپێکردنی ڕێڕەوی فێربوون',
  },
  kmr: {
    heroEyebrow: 'پلاتفۆرما نیشتمانی یا فێربوونا پرۆگرامسازی و تەکنەلۆژیایێ',
    heroTitle1: 'فێربوونا پرۆگرامسازیێ.',
    heroTitle2: 'پاشەڕۆژا خۆ ئاڤا بکە.',
    heroDesc:
      'پتر ژ ٨٤٠ وانەیێن زانستی، تاقیگەها ڕاستەوخۆ یا کۆدی، پرسیارا ڕۆژانە، ٥٠ ئامرازێن AI و مامۆستایێ زیرەک — هەمی ب کوردی د ئێک جهدا.',
    ctaLessons: 'دەستپێکرنا وانەیان',
    ctaEditor: 'تاقیگەها کۆدی',
    ctaChallenge: 'پرسیارا ڕۆژێ ⚡',
    heroNote: 'ژ سەرەتا دەست پێ بکە و ب لەزا خۆ فێربە — پتر ژ ٨ زمانان ئامادەنە.',
    yourFirstStep: 'پێنگاڤا ئێکێ',
    codeHeading: 'سڵاڤ جیهان! · Hello, KARÊJAN!',
    codeSub: 'دا پێکڤە ئاڤا بکەین.',
    livePreview: 'نیشاندانا ڕاستەوخۆ',
    codeWindowFooter: 'هاتیە چێکرن بۆ مێشکێن داهێنەر',
    tracksStripLabel: 'زمانێن فێرکاری یێن کاڕێژان',
    pathsEyebrow: 'ڕێبازا فێربوونا تە (LEARNING PATHS)',
    pathsHeading: 'ل هەر جهەکی بی، ژ ڤێرێ دەست پێ بکە.',
    pathsSub: 'زمانەکی هەلبژێرە و پێنگاڤ ب پێنگاڤ ژ سفرێ هەتا ئاستێ ئەندازیاریێ پێشڤە هەڕە.',
    viewAllLessons: 'دیتنا هەمی وانەیان',
    lessonsUnit: 'وانە',
    newToCoding: 'تو د پرۆگرامسازیێ دا نوو ی؟',
    startFromHtml: 'ژ HTML5 دەست پێ بکە — چ پاشخان ناڤێت.',
    dailyEyebrow: 'پرسیارا ڕۆژێ و چالێنجا بلەز (Daily Code Challenge ⚡)',
    diffEasy: 'ئاسان',
    diffMedium: 'ناڤنجی',
    rewardPrefix: 'خەلات:',
    pointsUnit: 'خاڵ ⭐',
    every24h: 'هەر ٢٤ دەمژمێران جارەکێ',
    participateBtn: 'نها پشکداریێ بکە و بەرسڤێ بدە',
    todayChampsWindow: 'قارەمانێن ئەڤرۆ',
    dailyTaskComment: '// ئەرکێ ئەڤرۆ:',
    dailyCommentBottom: '// ئەوێن بەرسڤا دروست ددەن دچنە د لیستا قارەمانێن ئەڤرۆ دا',
    whyEyebrow: 'بۆچی پلاتفۆرما کاڕێژان؟',
    whyTitle1: 'کێمتر قەلەبالغ.',
    whyTitle2: 'فێربوونا پتر.',
    whyDesc: 'هەمی تشت د جهێ خۆ یێ دروست دانە دا کو تو تەنها هزر ل فێربوون و ئاڤاکرنا پڕۆژەیان بکەی.',
    p1Title: 'تاقیگەها زیندی یا کۆدی (Code Lab)',
    p1Desc: 'ڕاستەوخۆ HTML, CSS و JavaScript بنڤیسە و ئەنجامی ببینە بێی دامەزراندنا چ بەرنامەیان.',
    p2Title: 'مامۆستایێ زیرەک (KARÊJAN AI)',
    p2Desc: 'د هەر تاگ و کۆدەکی دا نەگەهشتبی، مامۆستایێ زیرەک ب زمانەکێ سادە بۆ تە شڕۆڤە دکەت.',
    p3Title: 'TOP 50 ئامراز و ٢٢ پرۆمپتێن زێڕین',
    p3Desc: 'هەمی ئامراز و ئەجێنتێن جیهانی دگەل فەرمانێن THINK10X و ELI5 د ئێک جهدا.',
    p4Title: 'ڕاهێنان و ئەزموونێن تێکەڵکری',
    p4Desc: 'پرسیارێن هەلبژارتنێ، دیتنا شاشیێن کۆدی، تەمامکرن و تاقیکرنا زیندی د ناڤ کۆمێن وانەیان دا.',
    finalEyebrow: 'ئامادەیی دەست پێ بکەی؟',
    finalTitle: 'گەشتا تە یا پرۆگرامسازیێ ژ ڤێرێ دەست پێ دکەت.',
    finalDesc: 'ئێک وانە، ئێک تاقیکرن، ئێک هزر د هەر دەمەکی دا.',
    finalCta: 'دەستپێکرنا ڕێبازا فێربوونێ',
  },
  ar: {
    heroEyebrow: 'المنصة الوطنية لتعليم البرمجة والتكنولوجيا',
    heroTitle1: 'تعلّم البرمجة.',
    heroTitle2: 'اصنع مستقبلك.',
    heroDesc:
      'أكثر من ٨٤٠ درساً علمياً، مختبر كود مباشر، تحدي برمجي يومي، ٥٠ أداة ذكاء اصطناعي ومعلم ذكي — كل ذلك في مكان واحد.',
    ctaLessons: 'ابدأ الدروس الآن',
    ctaEditor: 'مختبر الكود',
    ctaChallenge: 'تحدي اليوم ⚡',
    heroNote: 'ابدأ من الصفر وتعلّم بالسرعة التي تناسبك — أكثر من ٨ مسارات جاهزة.',
    yourFirstStep: 'خطوتك الأولى',
    codeHeading: 'أهلاً بالعالم! · Hello, KARÊJAN!',
    codeSub: 'لنبني مشاريع حقيقية معاً.',
    livePreview: 'معاينة فورية',
    codeWindowFooter: 'مصمم للعقول الطموحة',
    tracksStripLabel: 'مسارات التعلّم الأساسية في KARÊJAN',
    pathsEyebrow: 'مسارات التعلّم (LEARNING PATHS)',
    pathsHeading: 'من أي مستوى كنت، ابدأ رحلتك هنا.',
    pathsSub: 'اختر لغة برمجة وتقدّم خطوة بخطوة من الأساسيات إلى الهندسة المتقدمة.',
    viewAllLessons: 'عرض جميع الدروس',
    lessonsUnit: 'درس',
    newToCoding: 'مبتدئ في عالم البرمجة؟',
    startFromHtml: 'ابدأ بمسار HTML5 — لا يتطلب أي خبرة سابقة.',
    dailyEyebrow: 'تحدي اليوم البرمجي السريع (Daily Code Challenge ⚡)',
    diffEasy: 'سهل',
    diffMedium: 'متوسط',
    rewardPrefix: 'المكافأة:',
    pointsUnit: 'نقطة ⭐',
    every24h: 'يتجدد كل ٢٤ ساعة',
    participateBtn: 'شارك الآن وأرسل حلك',
    todayChampsWindow: 'أبطال اليوم',
    dailyTaskComment: '// مهمة اليوم:',
    dailyCommentBottom: '// من يقدّم الحل الصحيح يدخل قائمة أبطال اليوم',
    whyEyebrow: 'لماذا منصة KARÊJAN؟',
    whyTitle1: 'تشويش أقل.',
    whyTitle2: 'تعلّم أعمق.',
    whyDesc: 'كل أداة في مكانها الصحيح لتبقي تركيزك منصباً على التعلّم والتطبيق وبناء المشاريع الحقيقية.',
    p1Title: 'مختبر الكود التفاعلي (Code Lab)',
    p1Desc: 'اكتب HTML و CSS و JavaScript وشاهد النتيجة فوراً دون تثبيت أي برامج.',
    p2Title: 'المعلم الذكي (KARÊJAN AI)',
    p2Desc: 'اشرح أي سطر كود أو خطأ برمجي واحصل على إجابة واضحة بلغتك فوراً.',
    p3Title: 'أفضل ٥٠ أداة AI و ٢٢ أمراً ذهنياً',
    p3Desc: 'كل أدوات البرمجة الذكية وأوامر THINK10X و ELI5 الاحترافية في مرجع واحد.',
    p4Title: 'التدريب والتقييم المدمج',
    p4Desc: 'اختيار من متعدد، اكتشاف وإصلاح الأخطاء، إكمال الكود، وتحديات محرر حية داخل كل مجموعة دروس.',
    finalEyebrow: 'هل أنت مستعد للانطلاق؟',
    finalTitle: 'رحلتك البرمجية تبدأ من هنا.',
    finalDesc: 'درس واحد، تحدٍ واحد، وفكرة واحدة في كل خطوة.',
    finalCta: 'ابدأ مسار التعلّم',
  },
  en: {
    heroEyebrow: 'Multilingual Coding Academy & AI Developer Studio',
    heroTitle1: 'Learn to code.',
    heroTitle2: 'Build your future.',
    heroDesc:
      'Explore 840+ structured lessons, an isolated live Code Lab, daily programming challenges, 50 curated AI developer tools, and an interactive AI tutor — all in one unified workspace.',
    ctaLessons: 'Start Learning',
    ctaEditor: 'Open Code Lab',
    ctaChallenge: 'Daily Challenge ⚡',
    heroNote: 'Start from zero and learn at your own pace — 8 complete engineering tracks included.',
    yourFirstStep: 'YOUR FIRST STEP',
    codeHeading: 'Hello, KARÊJAN!',
    codeSub: 'Let us build something remarkable together.',
    livePreview: 'LIVE PREVIEW',
    codeWindowFooter: 'Built for curious engineers',
    tracksStripLabel: 'Core Learning Tracks on KARÊJAN',
    pathsEyebrow: 'Learning Paths',
    pathsHeading: 'Start from wherever you are.',
    pathsSub: 'Pick a language track and progress step-by-step from fundamentals to real engineering.',
    viewAllLessons: 'Browse All Lessons',
    lessonsUnit: 'lessons',
    newToCoding: 'Brand new to programming?',
    startFromHtml: 'Start with HTML5 — zero prior experience required.',
    dailyEyebrow: 'Daily Code Challenge & Champions ⚡',
    diffEasy: 'Easy',
    diffMedium: 'Medium',
    rewardPrefix: 'Reward:',
    pointsUnit: 'pts ⭐',
    every24h: 'Rotates every 24h',
    participateBtn: 'Solve Challenge Now',
    todayChampsWindow: "Today's Champions",
    dailyTaskComment: "// Today's mission:",
    dailyCommentBottom: '// Pass all server test cases to join Today’s Champions leaderboard',
    whyEyebrow: 'Why KARÊJAN?',
    whyTitle1: 'Less noise.',
    whyTitle2: 'Deeper mastery.',
    whyDesc: 'Every surface is structured so your attention stays on writing code, testing ideas, and shipping projects.',
    p1Title: 'Interactive Code Lab',
    p1Desc: 'Write HTML, CSS, and JavaScript side by side with an instant sandbox preview and saved snippets.',
    p2Title: 'Intelligent Tutor (KARÊJAN AI)',
    p2Desc: 'Ask about any concept or bug in Kurdish, Arabic, or English and get clear explanations on demand.',
    p3Title: 'TOP 50 AI Tools & 22 Golden Prompts',
    p3Desc: 'Discover 50 essential developer AI agents alongside proven prompt directives like THINK10X and ELI5.',
    p4Title: 'Integrated Practice & Assessments',
    p4Desc: 'Adaptive MCQs, code debugging, completion, and live editor challenges right inside every learning group.',
    finalEyebrow: 'Ready to begin?',
    finalTitle: 'Your engineering journey starts right here.',
    finalDesc: 'One lesson, one challenge, one idea at a time.',
    finalCta: 'Launch Academy Tracks',
  },
};

export const HomeView: React.FC = () => {
  const { setActiveView, lessons, setActiveLessonId, locale } = useApp();
  const isRtl = locale !== 'en';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const copy = pickLoc(locale, HOME_COPY);

  const todayChallenge = CLIENT_DAILY_CHALLENGES[0];
  const challengeTitle = todayChallenge.titles[locale] || todayChallenge.titles.en || todayChallenge.titles.ckb;
  const challengeDesc = todayChallenge.descriptions[locale] || todayChallenge.descriptions.en || todayChallenge.descriptions.ckb;

  const handleOpenCourse = (trackId: TrackId) => {
    const target = lessons.find((l) => l.courseId === trackId);
    if (target) {
      setActiveLessonId(target.id);
    }
    setActiveView('academy');
  };

  return (
    <div>
      {/* 1. Editorial Hero + Live Code Preview Card (dist.zip Aesthetic) */}
      <section className="kj-hero-band">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
            {/* Hero Copy Side */}
            <div className="text-start">
              <div className="kj-eyebrow">
                <span className="kj-eyebrow-dot" />
                <span>{copy.heroEyebrow}</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.12] tracking-[-0.04em] text-[var(--kj-ink)] sm:text-5xl lg:text-[60px]">
                {copy.heroTitle1}
                <br />
                <em className="not-italic text-[var(--kj-green)]">{copy.heroTitle2}</em>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--kj-muted-2)] sm:text-lg">
                {copy.heroDesc}
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveView('academy')}
                  className="min-h-[48px] px-6 text-sm"
                >
                  <span>{copy.ctaLessons}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setActiveView('editor')}
                  className="min-h-[48px] px-5 text-sm"
                >
                  <Terminal className="h-4 w-4 text-[var(--kj-green)]" />
                  <span>{copy.ctaEditor}</span>
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setActiveView('challenge')}
                  className="min-h-[48px] px-4 text-sm"
                >
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>{copy.ctaChallenge}</span>
                </Button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-[var(--kj-muted)]">
                <Check className="h-4 w-4 text-[var(--kj-green)]" />
                <span>{copy.heroNote}</span>
              </div>
            </div>

            {/* Hero Code Preview Window (dist.zip .hero-editor signature) */}
            <div className="kj-code-window shadow-2xl lg:rotate-[0.8deg]">
              <div className="kj-code-bar flex items-center justify-between px-5 py-3 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#72e2b5]" />
                  <span className="h-2 w-2 rounded-full bg-[#62766b]" />
                  <span className="h-2 w-2 rounded-full bg-[#62766b]" />
                </div>
                <span dir="ltr">hello-karejan.html</span>
                <span className="text-[10px] tracking-widest opacity-80">{copy.yourFirstStep}</span>
              </div>

              <div className="p-6 sm:p-7" dir="ltr">
                <div className="grid grid-cols-[28px_auto] gap-x-2 gap-y-1.5 font-mono text-xs leading-relaxed">
                  <span className="text-[var(--kj-code-num)]">01</span>
                  <code><span className="text-[var(--kj-code-kw)]">&lt;!DOCTYPE html&gt;</span></code>
                  <span className="text-[var(--kj-code-num)]">02</span>
                  <code><span className="text-[var(--kj-code-kw)]">&lt;html&gt;</span></code>
                  <span className="text-[var(--kj-code-num)]">03</span>
                  <code>{'  '}<span className="text-[var(--kj-code-kw)]">&lt;body&gt;</span></code>
                  <span className="text-[var(--kj-code-num)]">04</span>
                  <code>{'    '}<span className="text-[var(--kj-code-kw)]">&lt;h1&gt;</span>{copy.codeHeading}<span className="text-[var(--kj-code-kw)]">&lt;/h1&gt;</span></code>
                  <span className="text-[var(--kj-code-num)]">05</span>
                  <code>{'    '}<span className="text-[var(--kj-code-kw)]">&lt;p&gt;</span>{copy.codeSub}<span className="text-[var(--kj-code-kw)]">&lt;/p&gt;</span></code>
                  <span className="text-[var(--kj-code-num)]">06</span>
                  <code>{'  '}<span className="text-[var(--kj-code-kw)]">&lt;/body&gt;</span></code>
                  <span className="text-[var(--kj-code-num)]">07</span>
                  <code><span className="text-[var(--kj-code-kw)]">&lt;/html&gt;</span></code>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[#95a99a]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--kj-emerald)]" />
                    <span>{copy.livePreview}</span>
                  </div>
                  <div className="rounded-[4px] bg-[#f7fafc] p-4 text-[#1d2939] text-start" dir={isRtl ? 'rtl' : 'ltr'}>
                    <strong className="block text-base font-bold">{copy.codeHeading}</strong>
                    <p className="mt-1 text-xs text-[#46524d]">{copy.codeSub}</p>
                  </div>
                </div>
              </div>

              <div className="kj-code-bar flex items-center justify-between px-5 py-2.5 font-mono text-[10px]">
                <span>● HTML · CSS · JS · Python</span>
                <span>{copy.codeWindowFooter}</span>
              </div>
            </div>
          </div>

          {/* Hero Bottom Language Strip */}
          <div className="kj-hero-foot flex flex-wrap items-center justify-between gap-6 py-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--kj-muted)]">
              {copy.tracksStripLabel}
            </span>
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs font-semibold text-[var(--kj-muted)]">
              {FEATURED_TRACKS.map((tr) => (
                <button
                  key={tr.id}
                  type="button"
                  onClick={() => handleOpenCourse(tr.id)}
                  className="hover:text-[var(--kj-green)] transition-colors cursor-pointer"
                >
                  {tr.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Architectural 4-Column Track Grid (dist.zip .course-grid) */}
      <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 text-start">
          <div>
            <div className="kj-eyebrow">
              <span className="kj-eyebrow-dot" />
              <span>{copy.pathsEyebrow}</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[var(--kj-ink)] sm:text-4xl">
              {copy.pathsHeading}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--kj-muted)]">
              {copy.pathsSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('academy')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--kj-green)] hover:underline cursor-pointer"
          >
            <span>{copy.viewAllLessons}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 border-s border-t border-[var(--kj-border)] sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_TRACKS.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => handleOpenCourse(track.id)}
              className="group flex min-h-[190px] flex-col justify-between border-e border-b border-[var(--kj-border)] bg-[var(--kj-card)] p-6 text-start transition-colors hover:bg-[var(--kj-soft-alt)] dark:hover:bg-[#202938] cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="kj-course-icon grid h-9 w-9 place-items-center text-xs font-bold">
                    {track.codeGlyph}
                  </span>
                  <span className="text-[var(--kj-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--kj-green)]">
                    ↗
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-[var(--kj-ink)] group-hover:text-[var(--kj-green)] transition-colors">
                  {track.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--kj-muted)]">
                  {track.descriptions[locale] || track.descriptions.en}
                </p>
              </div>
              <small className="mt-4 block text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--kj-muted)]">
                +{track.lessonsCount} {copy.lessonsUnit} · {track.tags[locale] || track.tags.en}
              </small>
            </button>
          ))}
        </div>

        <div className="border-x border-b border-[var(--kj-border)] bg-[var(--kj-soft)] px-6 py-4 text-xs text-[var(--kj-muted)] text-start">
          {copy.newToCoding}{' '}
          <button
            type="button"
            onClick={() => handleOpenCourse('html')}
            className="font-bold text-[var(--kj-green)] hover:underline cursor-pointer"
          >
            {copy.startFromHtml}
          </button>
        </div>
      </section>

      {/* 3. Daily Code Challenge Band (dist.zip .why showcase band + code window) */}
      <section className="kj-why-band py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="text-start space-y-4">
              <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9af0c7]">
                <span className="kj-eyebrow-dot" />
                <span>{copy.dailyEyebrow}</span>
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                {challengeTitle}
              </h2>

              <p className="text-sm leading-relaxed text-[#bdc8d6] sm:text-base">
                {challengeDesc}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="rounded-[5px] bg-[#203b37] px-3 py-1 font-semibold text-[#9af0c7]">
                  {todayChallenge.difficulty === 'easy' ? copy.diffEasy : copy.diffMedium}
                </span>
                <span className="rounded-[5px] bg-[#203b37] px-3 py-1 font-semibold text-[#9af0c7]">
                  {copy.rewardPrefix} +{todayChallenge.points} {copy.pointsUnit}
                </span>
                <span className="rounded-[5px] bg-[#203b37] px-3 py-1 font-semibold text-[#9af0c7]">
                  {copy.every24h}
                </span>
              </div>

              <div className="pt-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveView('challenge')}
                  className="px-6"
                >
                  <Zap className="h-4 w-4" />
                  <span>{copy.participateBtn}</span>
                  <ArrowIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="kj-code-window">
              <div className="kj-code-bar flex items-center justify-between px-5 py-3 font-mono text-[11px]">
                <span className="flex items-center gap-2">
                  <Flame className="h-3.5 w-3.5 text-[#72e2b5]" />
                  <span>{copy.todayChampsWindow}</span>
                </span>
                <span>daily-challenge.js</span>
              </div>
              <div className="p-6 space-y-2 font-mono text-xs" dir="ltr">
                <div className="text-[#8796a9]">{copy.dailyTaskComment}</div>
                <div className="text-[#9af0c7]">function findLargest(arr) {'{'} ... {'}'}</div>
                <div className="text-[#b7e6d4]">findLargest([1, 5, 2, 9, 3]) ➜ 9</div>
                <div className="pt-2 text-[11px] text-[#8796a9]">
                  {copy.dailyCommentBottom}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why KARÊJAN? 4-Column Editorial Showcase (dist.zip .benefits style) */}
      <section className="kj-soft-band py-16 lg:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 text-start">
              <div className="kj-eyebrow">
                <span className="kj-eyebrow-dot" />
                <span>{copy.whyEyebrow}</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[var(--kj-ink)] sm:text-4xl">
                {copy.whyTitle1}
                <br />
                {copy.whyTitle2}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--kj-muted)]">
                {copy.whyDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7 text-start">
              <button
                type="button"
                onClick={() => setActiveView('editor')}
                className="border-t border-[var(--kj-border-strong)] pt-5 text-start group cursor-pointer"
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold text-[var(--kj-green)] mb-3">
                  <span>01</span>
                  <Code2 className="h-4 w-4" />
                </div>
                <strong className="block text-sm font-bold text-[var(--kj-ink)] group-hover:text-[var(--kj-green)] transition-colors">
                  {copy.p1Title}
                </strong>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--kj-muted)]">
                  {copy.p1Desc}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('ai')}
                className="border-t border-[var(--kj-border-strong)] pt-5 text-start group cursor-pointer"
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold text-[var(--kj-green)] mb-3">
                  <span>02</span>
                  <Sparkles className="h-4 w-4" />
                </div>
                <strong className="block text-sm font-bold text-[var(--kj-ink)] group-hover:text-[var(--kj-green)] transition-colors">
                  {copy.p2Title}
                </strong>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--kj-muted)]">
                  {copy.p2Desc}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('aitools')}
                className="border-t border-[var(--kj-border-strong)] pt-5 text-start group cursor-pointer"
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold text-[var(--kj-green)] mb-3">
                  <span>03</span>
                  <Bot className="h-4 w-4" />
                </div>
                <strong className="block text-sm font-bold text-[var(--kj-ink)] group-hover:text-[var(--kj-green)] transition-colors">
                  {copy.p3Title}
                </strong>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--kj-muted)]">
                  {copy.p3Desc}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('academy')}
                className="border-t border-[var(--kj-border-strong)] pt-5 text-start group cursor-pointer"
              >
                <div className="flex items-center justify-between font-mono text-xs font-bold text-[var(--kj-green)] mb-3">
                  <span>04</span>
                  <Award className="h-4 w-4" />
                </div>
                <strong className="block text-sm font-bold text-[var(--kj-ink)] group-hover:text-[var(--kj-green)] transition-colors">
                  {copy.p4Title}
                </strong>
                <p className="mt-1.5 text-xs leading-relaxed text-[var(--kj-muted)]">
                  {copy.p4Desc}
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA Band (dist.zip .final-cta) */}
      <section className="kj-final-cta py-16 text-center lg:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="kj-eyebrow justify-center">
            <span className="kj-eyebrow-dot" />
            <span>{copy.finalEyebrow}</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-[var(--kj-ink)] sm:text-4xl">
            {copy.finalTitle}
          </h2>
          <p className="mt-3 text-sm text-[var(--kj-muted)] sm:text-base">
            {copy.finalDesc}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" size="md" onClick={() => setActiveView('academy')} className="px-7">
              <BookOpen className="h-4 w-4" />
              <span>{copy.finalCta}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
