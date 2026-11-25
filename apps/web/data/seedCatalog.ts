import type {
  Chapter,
  Course,
  Lesson,
  MaintenanceConfig,
  PaymentSetting,
  PublicExercise,
  PublicQuiz,
  SubscriptionPlan,
  SystemSettings,
} from '../types/domain';
import { ALL_COURSES, ALL_CHAPTERS } from './courses/coursesList';
import {
  ALL_LESSONS,
  ALL_EXERCISES,
  ALL_QUIZZES,
} from './courses';

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  enabled: false,
  lockedTabs: [],
  messageCkb: 'ئەم بەشە لە ئێستادا لەژێر چاکسازی و نوێکردنەوەدایە بۆ پێشکەشکردنی باشترین خزمەتگوزاری.',
  messageEn: 'This section is currently undergoing scheduled maintenance to improve your learning experience.',
  estimatedReturn: 'بە زووترین کات دەگەڕێینەوە',
};

export const DEFAULT_PRACTICE_CONFIG = {
  lessonsPerGroup: 3,
  requirePassToUnlockNext: true,
  passThresholdPercent: 60,
  courseOverrides: {},
};

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  freeDailyAiLimit: 15,
  proPerMinuteLimit: 12,
  proMaxMessageLength: 4000,
  dailyGenerationJobCap: 25,
  autoPublishAfterValidation: false,
  maintenance: DEFAULT_MAINTENANCE_CONFIG,
  practiceConfig: DEFAULT_PRACTICE_CONFIG,
};

export const SEED_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    priceIqd: 0,
    billingPeriod: 'forever',
    titles: {
      en: 'Free Plan',
      ar: 'الخطة المجانية',
      ckb: 'پلانی بێبەرامبەر',
      kmr: 'پلانا بێبەرامبەر',
    },
    descriptions: {
      en: 'Complete access to HTML, CSS, and JavaScript lessons, sandboxed Code Lab, standard exercises, and daily KARÊJAN AI.',
      ar: 'وصول كامل لدروس HTML و CSS و JavaScript ومحرر الكود والتمارين الأساسية مع حد يومي لمساعد KARÊJAN.',
      ckb: 'دەستڕاگەیشتنی تەواو بە وانەکانی HTML و CSS و JavaScript و تاقیگەی کۆد و سنووری ڕۆژانەی KARÊJAN AI.',
      kmr: 'دەستگەهشتنا تەمام ب وانێن HTML و CSS و JavaScript و تاقیگەها کۆدی دگەل سنوورێ ڕۆژانە یێ KARÊJAN AI.',
    },
    features: {
      en: [
        'All published HTML, CSS & JavaScript lessons in 4 languages',
        'Sandboxed CodeMirror live editor & saved snippets',
        'Standard interactive exercises & lesson quizzes',
        'KARÊJAN AI with configurable daily message limit',
      ],
      ar: [
        'جميع دروس HTML و CSS و JavaScript بـ 4 لغات',
        'محرر CodeMirror معزول وحفظ المقاطع البرمجية',
        'التمارين التفاعلية والاختبارات الأساسية',
        'مساعد KARÊJAN بحد يومي قابل للضبط',
      ],
      ckb: [
        'هەموو وانەکانی HTML و CSS و JavaScript بە ٤ زمان',
        'تاقیگەی دابڕاوی CodeMirror و پاشەکەوتکردنی کۆد',
        'ڕاهێنان و کویزە ستانداردەکان',
        'KARÊJAN AI بە سنووری ڕۆژانەی دیاریکراو',
      ],
      kmr: [
        'هەمی وانێن HTML و CSS و JavaScript ب ٤ زمانان',
        'تاقیگەها CodeMirror و پاشکەفتکرنا کۆدان',
        'ڕاهێنان و کویزێن ستاندارد',
        'KARÊJAN AI ب سنوورێ ڕۆژانە',
      ],
    },
  },
  {
    id: 'pro',
    priceIqd: 10000,
    billingPeriod: 'month',
    titles: {
      en: 'KARÊJAN Pro',
      ar: 'KARÊJAN Pro',
      ckb: 'KARÊJAN Pro',
      kmr: 'KARÊJAN Pro',
    },
    descriptions: {
      en: 'Unlimited normal AI usage, subject to fair use, plus advanced Pro quizzes, timed exams, and coding challenges.',
      ar: 'استخدام طبيعي غير محدود للذكاء الاصطناعي خاضع لسياسة الاستخدام العادل، بالإضافة إلى اختبارات Pro المتقدمة والامتحانات الموقوتة.',
      ckb: 'بەکارهێنانی ئاسایی بێسنووری زیرەکی دەستکرد بەپێی سیاسەتی بەکارهێنانی دادپەروەرانە، لەگەڵ تاقیکردنەوە پێشکەوتووەکانی Pro.',
      kmr: 'بکارئینانا ئاسایی یا بێسنوور یا AI ل گۆڕ بکارئینانا دادپەروەرانە، دگەل ئەزموونێن پێشکەفتی یێن Pro.',
    },
    features: {
      en: [
        'Unlimited normal AI usage, subject to fair use',
        'Advanced Pro practice tests & server-timed exams',
        'Advanced sandboxed JavaScript coding challenges',
        'Manual verification via FIB, Qi Card, or ZainCash (10,000 IQD / Month)',
      ],
      ar: [
        'استخدام طبيعي غير محدود للذكاء الاصطناعي خاضع لسياسة الاستخدام العادل',
        'اختبارات Pro التدريبية والامتحانات الموقوتة من الخادم',
        'تحديات برمجية متقدمة بلغة JavaScript',
        'تفعيل يدوي موثوق عبر FIB أو Qi Card أو ZainCash (10,000 د.ع / شهرياً)',
      ],
      ckb: [
        'بەکارهێنانی ئاسایی بێسنووری AI بەپێی بەکارهێنانی دادپەروەرانە',
        'تاقیکردنەوەی مەشقی Pro و تاقیکردنەوەی کاتداری سێرڤەر',
        'چاڵنجی پێشکەوتووی کۆدنووسینی JavaScript',
        'پشتڕاستکردنەوەی دەستی لە ڕێگەی FIB، Qi Card یان ZainCash (10,000 دینار / مانگانە)',
      ],
      kmr: [
        'بکارئینانا ئاسایی یا بێسنوور یا AI ل گۆڕ بکارئینانا دادپەروەرانە',
        'ئەزموونێن مەشقێ یێن Pro و ئەزموونێن دەمدار',
        'چاڵنجێن پێشکەفتی یێن JavaScript',
        'پشتڕاستکرنا دەستی ب FIB، Qi Card یان ZainCash (10,000 دینار / مەهانە)',
      ],
    },
  },
];

export const SEED_PAYMENT_SETTINGS: PaymentSetting[] = [
  {
    id: 'fib',
    name: 'FIB (First Iraqi Bank)',
    accountNumber: '07501151634',
    enabled: true,
    instructions: {
      en: 'Open your FIB app, transfer 10,000 IQD to 07501151634, save the transfer receipt screenshot, and enter the transaction reference below. Never share your PIN or OTP.',
      ar: 'افتح تطبيق FIB، حوّل 10,000 د.ع إلى الرقم 07501151634، احفظ لقطة شاشة لإيصال التحويل، وأدخل رقم المرجع أدناه. لا تشارك رمز PIN أو OTP أبداً.',
      ckb: 'ئەپی FIB بکەرەوە، بڕی 10,000 دینار بگوازەرەوە بۆ 07501151634، وێنەی پسووڵەکە هەڵبگرە و ژمارەی سەرچاوەی مامەڵەکە لە خوارەوە بنووسە. هەرگیز PIN یان OTP هاوبەش مەکە.',
      kmr: 'ئەپێ FIB ڤەکە، 10,000 دینار ڤەگوهێزە بۆ 07501151634، وێنێ پسوولێ هەلگرە و ژمارەیا سەرچاوێ ل خوارێ بنڤیسە. قەت PIN یان OTP نەدە کەسێ.',
    },
  },
  {
    id: 'qi_card',
    name: 'Qi Card',
    accountNumber: '07701931916',
    enabled: true,
    instructions: {
      en: 'Send 10,000 IQD via Qi Card to 07701931916, capture a clear screenshot of the completed transfer receipt, and submit the reference ID below. Never enter card passwords or OTP.',
      ar: 'أرسل 10,000 د.ع عبر Qi Card إلى الرقم 07701931916، التقط صورة واضحة لإيصال العملية المكتملة، ثم أدخل رقم المرجع أدناه. لا تشارك كلمة السر أو OTP أبداً.',
      ckb: 'بڕی 10,000 دینار لە ڕێگەی Qi Card بنێرە بۆ 07701931916، وێنەی ڕوونی پسووڵەکە بگرە و ژمارەی سەرچاوەکە بنێرە. هەرگیز وشەی نهێنی یان OTP مەنووسە.',
      kmr: '10,000 دینار ب ڕێکا Qi Card بنێرە بۆ 07701931916، وێنەکێ ڕۆهن یێ پسوولێ بگرە و ژمارەیا سەرچاوێ بنێرە. قەت پەیڤا نهێنی یان OTP نەنڤیسە.',
    },
  },
  {
    id: 'zaincash',
    name: 'ZainCash',
    accountNumber: '07701931916',
    enabled: true,
    instructions: {
      en: 'Transfer 10,000 IQD using ZainCash to wallet 07701931916, save the confirmation receipt image, and enter the transaction reference number below. KARÊJAN never asks for your PIN or OTP.',
      ar: 'حوّل 10,000 د.ع عبر محفظة ZainCash إلى الرقم 07701931916، احفظ صورة إيصال التأكيد، وأدخل رقم المرجع أدناه. لن نطلب رمز PIN أو OTP أبداً.',
      ckb: 'بڕی 10,000 دینار بە ZainCash بنێرە بۆ 07701931916، وێنەی پسووڵەی دڵنیاکردنەوە هەڵبگرە و ژمارەی سەرچاوە بنێرە. KARÊJAN هەرگیز داوای PIN یان OTP ناکات.',
      kmr: '10,000 دینار ب ZainCash ڤەگوهێزە بۆ 07701931916، وێنێ پسوولێ هەلگرە و ژمارەیا سەرچاوێ بنێرە. KARÊJAN قەت داخوازا PIN یان OTP ناکەت.',
    },
  },
];

export const SEED_COURSES: Course[] = ALL_COURSES;
export const SEED_CHAPTERS: Chapter[] = ALL_CHAPTERS;
export const SEED_LESSONS: Lesson[] = ALL_LESSONS;
export const SEED_EXERCISES: PublicExercise[] = ALL_EXERCISES;
export const SEED_QUIZZES: PublicQuiz[] = ALL_QUIZZES;
