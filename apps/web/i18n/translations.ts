import type { Locale } from '../types/domain';

export const LOCALE_META: Record<Locale, { label: string; nativeLabel: string; dir: 'rtl' | 'ltr' }> = {
  ckb: { label: 'Sorani', nativeLabel: 'کوردی (سۆرانی)', dir: 'rtl' },
  kmr: { label: 'Badini', nativeLabel: 'کوردی (بادینی)', dir: 'rtl' },
  ar: { label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl' },
  en: { label: 'English', nativeLabel: 'English', dir: 'ltr' },
};

export function isRtlLocale(locale: Locale): boolean {
  return LOCALE_META[locale].dir === 'rtl';
}

export function pickLoc<T = string>(locale: Locale, map: Record<Locale, T>): T {
  return map[locale] ?? map.en;
}

export function cleanTitle(str?: string): string {
  if (!str) return '';
  return str
    .replace(/[\u200E\u200F\u202A-\u202E\u061C]/g, '')
    .replace(/[\(\[\{（]?\s*سیلابسی\s*W3Schools\s*[\)\]\}）]?/gi, '')
    .replace(/[\(\[\{（]?\s*منهاج\s*W3Schools\s*[\)\]\}）]?/gi, '')
    .replace(/[\(\[\{（]?\s*W3Schools\s*(Curriculum|Syllabus)?\s*[\)\]\}）]?/gi, '')
    .replace(/[\(\[\{（]?\s*سیلابسی\s*[\)\]\}）]?/gi, '')
    .replace(/W3Schools?/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\[\s*\]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export interface UiCopy {
  nav: {
    home?: string;
    challenge?: string;
    aitools?: string;
    prompts?: string;
    academy: string;
    editor: string;
    ai: string;
    practice: string;
    discover: string;
    pro: string;
    dashboard: string;
    admin: string;
    signIn: string;
  };
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    copy: string;
    copied: string;
    reset: string;
    run: string;
    close: string;
    submit: string;
    search: string;
    signOut: string;
    darkTheme: string;
    lightTheme: string;
    language: string;
    theme: string;
    freePlan: string;
    proPlan: string;
    upgradeToPro: string;
    continueLearning: string;
    completion: string;
    signInRequired: string;
    verifyEmailNotice: string;
    resendVerification: string;
  };
  auth: {
    signInTitle: string;
    registerTitle: string;
    resetTitle: string;
    email: string;
    password: string;
    displayName: string;
    continueWithGoogle: string;
    signInBtn: string;
    registerBtn: string;
    sendResetBtn: string;
    forgotPassword: string;
    haveAccount: string;
    noAccount: string;
    backToSignIn: string;
    resetSent: string;
  };
  academy: {
    title: string;
    subtitle: string;
    coursesLabel: string;
    intro: string;
    objectives: string;
    explanation: string;
    syntax: string;
    codeExample: string;
    tryItYourself: string;
    openInEditor: string;
    commonMistakes: string;
    summary: string;
    markComplete: string;
    completed: string;
    previousLesson: string;
    nextLesson: string;
  };
  editor: {
    title: string;
    runCode: string;
    resetCode: string;
    fullscreen: string;
    exitFullscreen: string;
    saveSnippet: string;
    loadSnippet: string;
    snippetTitlePlaceholder: string;
    savedSnippets: string;
    noSnippets: string;
    livePreview: string;
    sandboxNotice: string;
  };
  ai: {
    title: string;
    newChat: string;
    renameChat: string;
    deleteChat: string;
    regenerate: string;
    placeholder: string;
    send: string;
    suggestedTitle: string;
    suggested: string[];
    dailyLimitLabel: string;
    proFairUseLabel: string;
    emptyState: string;
    unavailableError: string;
  };
  practice: {
    title: string;
    exercisesTab: string;
    quizzesTab: string;
    hint: string;
    showHint: string;
    checkAnswer: string;
    correct: string;
    incorrect: string;
    startQuiz: string;
    startTimedExam: string;
    submitQuiz: string;
    timeRemaining: string;
    scoreLabel: string;
    recommendedLessons: string;
    proLocked: string;
    noAnswerKeysClient: string;
  };
  pro: {
    title: string;
    priceHeadline: string;
    freeFairUseNote: string;
    proFairUseNote: string;
    selectMethod: string;
    accountNumber: string;
    instructions: string;
    securityNote: string;
    transactionRef: string;
    paymentDate: string;
    amountIqd: string;
    receiptImage: string;
    receiptRules: string;
    submitRequest: string;
    submittedSuccess: string;
    myRequests: string;
  };
  dashboard: {
    title: string;
    subscriptionCard: string;
    expiresOn: string;
    renewPro: string;
    notificationsTitle: string;
    noNotifications: string;
    quizHistoryTitle: string;
    noQuizAttempts: string;
    profileSettings: string;
  };
  admin: {
    title: string;
    lessonsTab: string;
    studioTab: string;
    paymentsTab: string;
    settingsTab: string;
    auditTab: string;
    seedFirestore: string;
    generateBtn: string;
    approve: string;
    reject: string;
    requiresReview: string;
    extendSub: string;
    editorPaymentsBlocked: string;
    superAdminOnlySettings: string;
    superAdminOnlyAudit: string;
  };
}

export const TRANSLATIONS: Record<Locale, UiCopy> = {
  en: {
    nav: {
      home: 'Home',
      challenge: 'Daily Challenge ⚡',
      aitools: 'AI Tools & Agents 🤖',
      prompts: 'AI Prompts 💡',
      academy: 'Academy',
      editor: 'Code Lab',
      ai: 'karejan AI',
      practice: 'Exercises & Quizzes',
      discover: 'Discover',
      pro: 'Pro Plan',
      dashboard: 'Dashboard',
      admin: 'Admin',
      signIn: 'Sign In',
    },
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      copy: 'Copy',
      copied: 'Copied',
      reset: 'Reset',
      run: 'Run',
      close: 'Close',
      submit: 'Submit',
      search: 'Search',
      signOut: 'Sign Out',
      darkTheme: 'Dark',
      lightTheme: 'Light',
      language: 'Language',
      theme: 'Theme',
      freePlan: 'Free Plan',
      proPlan: 'Pro Plan',
      upgradeToPro: 'Upgrade to Pro',
      continueLearning: 'Continue Learning',
      completion: 'Completion',
      signInRequired: 'Sign in to save progress, run AI chat, submit exercises, and manage subscriptions.',
      verifyEmailNotice: 'Please verify your email address to enable cloud writes, or sign in with Google.',
      resendVerification: 'Resend verification email',
    },
    auth: {
      signInTitle: 'Sign in to karejan',
      registerTitle: 'Create your karejan account',
      resetTitle: 'Reset your password',
      email: 'Email address',
      password: 'Password',
      displayName: 'Full name',
      continueWithGoogle: 'Continue with Google',
      signInBtn: 'Sign In',
      registerBtn: 'Create Account',
      sendResetBtn: 'Send Reset Link',
      forgotPassword: 'Forgot password?',
      haveAccount: 'Already have an account? Sign in',
      noAccount: 'Need an account? Register',
      backToSignIn: 'Back to Sign In',
      resetSent: 'Password reset link sent. Check your inbox.',
    },
    academy: {
      title: 'Web Engineering Academy',
      subtitle: 'Structured HTML, CSS, and JavaScript tracks in Sorani, Badini, Arabic, and English.',
      coursesLabel: 'Courses',
      intro: 'Introduction',
      objectives: 'Learning Objectives',
      explanation: 'Core Explanation',
      syntax: 'Syntax Reference',
      codeExample: 'Code Example',
      tryItYourself: 'Try It Yourself',
      openInEditor: 'Open in Code Lab',
      commonMistakes: 'Common Mistakes to Avoid',
      summary: 'Summary',
      markComplete: 'Mark Lesson Complete',
      completed: 'Completed',
      previousLesson: 'Previous Lesson',
      nextLesson: 'Next Lesson',
    },
    editor: {
      title: 'Sandboxed HTML / CSS / JS Code Lab',
      runCode: 'Run',
      resetCode: 'Reset',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      saveSnippet: 'Save Snippet',
      loadSnippet: 'My Snippets',
      snippetTitlePlaceholder: 'Snippet title (e.g., Responsive Flex Navbar)',
      savedSnippets: 'Saved Snippets',
      noSnippets: 'No saved snippets yet.',
      livePreview: 'Sandboxed Preview',
      sandboxNotice: 'Isolated iframe sandbox (no parent page access).',
    },
    ai: {
      title: 'karejan AI',
      newChat: 'New Chat',
      renameChat: 'Rename',
      deleteChat: 'Delete',
      regenerate: 'Regenerate',
      placeholder: 'Ask karejan AI about HTML, CSS, or JavaScript...',
      send: 'Send',
      suggestedTitle: 'Suggested Questions',
      suggested: [
        'Explain the difference between Flexbox and CSS Grid with a small example.',
        'Why should I use const and let instead of var in JavaScript?',
        'How do semantic HTML tags improve accessibility?',
      ],
      dailyLimitLabel: 'Free daily messages',
      proFairUseLabel: 'Pro · Unlimited normal AI usage, subject to fair use',
      emptyState: 'Ask a coding question in Sorani, Badini, Arabic, or English. Code examples stay clean and runnable.',
      unavailableError: 'karejan AI is temporarily unavailable. Please try again shortly.',
    },
    practice: {
      title: 'Exercises, Quizzes & Timed Exams',
      exercisesTab: 'Interactive Exercises',
      quizzesTab: 'Quizzes & Exams',
      hint: 'Hint',
      showHint: 'Show Hint',
      checkAnswer: 'Submit Answer',
      correct: 'Correct',
      incorrect: 'Needs Review',
      startQuiz: 'Start Quiz',
      startTimedExam: 'Start Timed Exam',
      submitQuiz: 'Submit Answers',
      timeRemaining: 'Time Remaining',
      scoreLabel: 'Score',
      recommendedLessons: 'Recommended Lessons to Review',
      proLocked: 'Pro Plan Required',
      noAnswerKeysClient: 'Graded strictly on the server. Answer keys are never sent to the browser.',
    },
    pro: {
      title: 'karejan Pro Subscription',
      priceHeadline: '10,000 IQD / Month',
      freeFairUseNote: 'Standard HTML/CSS/JS lessons, exercises, quizzes, and daily karejan AI allowance.',
      proFairUseNote: 'Unlimited normal AI usage, subject to fair use, plus advanced Pro quizzes, practice tests, timed exams, and coding challenges.',
      selectMethod: 'Choose Manual Payment Method',
      accountNumber: 'Transfer Account Number',
      instructions: 'Payment Instructions',
      securityNote: 'karejan will NEVER ask for your wallet PIN, password, OTP, or account login.',
      transactionRef: 'Transaction Reference ID',
      paymentDate: 'Payment Date',
      amountIqd: 'Amount Paid (IQD)',
      receiptImage: 'Payment Receipt Image (JPEG, PNG, or WEBP · max 5 MB)',
      receiptRules: 'Receipts are stored privately and visible only to you and payment admins.',
      submitRequest: 'Submit Payment for Verification',
      submittedSuccess: 'Payment request submitted and queued for manual verification.',
      myRequests: 'Your Payment Requests',
    },
    dashboard: {
      title: 'Learner Dashboard',
      subscriptionCard: 'Subscription Status',
      expiresOn: 'Expires on',
      renewPro: 'Renew Pro',
      notificationsTitle: 'Notifications',
      noNotifications: 'No notifications yet.',
      quizHistoryTitle: 'Quiz & Exam Attempt History',
      noQuizAttempts: 'No quiz attempts recorded yet.',
      profileSettings: 'Profile Preferences',
    },
    admin: {
      title: 'karejan Admin Console',
      lessonsTab: 'Lessons CMS',
      studioTab: 'AI Content Studio',
      paymentsTab: 'Payments & Subscriptions',
      settingsTab: 'Plans & Settings',
      auditTab: 'Audit Logs',
      seedFirestore: 'Sync Seed Data to Firestore',
      generateBtn: 'Generate Lessons with karejan AI',
      approve: 'Approve & Activate',
      reject: 'Reject',
      requiresReview: 'Needs Review',
      extendSub: 'Extend Subscription',
      editorPaymentsBlocked: 'Editors do not have access to payments or financial records.',
      superAdminOnlySettings: 'Only Super Admin can edit payment methods (FIB, Qi Card, ZainCash).',
      superAdminOnlyAudit: 'Audit logs are append-only and readable by Super Admin only.',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      challenge: 'تحدي اليوم ⚡',
      aitools: 'أدوات الذكاء الاصطناعي 🤖',
      prompts: 'أوامر الذكاء الاصطناعي 💡',
      academy: 'الأكاديمية',
      editor: 'محرر الكود',
      ai: 'مساعد karejan',
      practice: 'التمارين والاختبارات',
      discover: 'استكشف',
      pro: 'خطة Pro',
      dashboard: 'لوحتي',
      admin: 'الإدارة',
      signIn: 'تسجيل الدخول',
    },
    common: {
      loading: 'جارٍ التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      copy: 'نسخ',
      copied: 'تم النسخ',
      reset: 'إعادة ضبط',
      run: 'تشغيل',
      close: 'إغلاق',
      submit: 'إرسال',
      search: 'بحث',
      signOut: 'تسجيل الخروج',
      darkTheme: 'داكن',
      lightTheme: 'فاتح',
      language: 'اللغة',
      theme: 'المظهر',
      freePlan: 'الخطة المجانية',
      proPlan: 'خطة Pro',
      upgradeToPro: 'الترقية إلى Pro',
      continueLearning: 'متابعة التعلم',
      completion: 'نسبة الإنجاز',
      signInRequired: 'سجّل الدخول لحفظ التقدم واستخدام مساعد karejan والاختبارات والاشتراك.',
      verifyEmailNotice: 'يرجى تأكيد بريدك الإلكتروني لتفعيل الحفظ السحابي، أو الدخول بحساب Google.',
      resendVerification: 'إعادة إرسال رابط التفعيل',
    },
    auth: {
      signInTitle: 'تسجيل الدخول إلى karejan',
      registerTitle: 'إنشاء حساب karejan',
      resetTitle: 'استعادة كلمة المرور',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      displayName: 'الاسم الكامل',
      continueWithGoogle: 'المتابعة عبر Google',
      signInBtn: 'دخول',
      registerBtn: 'إنشاء حساب',
      sendResetBtn: 'إرسال رابط الاستعادة',
      forgotPassword: 'نسيت كلمة المرور؟',
      haveAccount: 'لديك حساب بالفعل؟ سجّل الدخول',
      noAccount: 'ليس لديك حساب؟ أنشئ حساباً',
      backToSignIn: 'العودة لتسجيل الدخول',
      resetSent: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك.',
    },
    academy: {
      title: 'أكاديمية تطوير الويب',
      subtitle: 'مسارات HTML و CSS و JavaScript باللغات الكردية (السورانية والبادينية) والعربية والإنجليزية.',
      coursesLabel: 'الدورات',
      intro: 'مقدمة',
      objectives: 'أهداف الدرس',
      explanation: 'الشرح الأساسي',
      syntax: 'مرجع الصياغة',
      codeExample: 'مثال برمجي',
      tryItYourself: 'جرّب بنفسك',
      openInEditor: 'افتح في محرر الكود',
      commonMistakes: 'أخطاء شائعة يجب تجنبها',
      summary: 'ملخص الدرس',
      markComplete: 'تحديد الدرس كمكتمل',
      completed: 'مكتمل',
      previousLesson: 'الدرس السابق',
      nextLesson: 'الدرس التالي',
    },
    editor: {
      title: 'محرر HTML / CSS / JS المعزول',
      runCode: 'تشغيل',
      resetCode: 'إعادة ضبط',
      fullscreen: 'ملء الشاشة',
      exitFullscreen: 'إنهاء ملء الشاشة',
      saveSnippet: 'حفظ الكود',
      loadSnippet: 'أكوادي المحفوظة',
      snippetTitlePlaceholder: 'عنوان المقطع البرمجي',
      savedSnippets: 'المقاطع المحفوظة',
      noSnippets: 'لا توجد مقاطع محفوظة بعد.',
      livePreview: 'معاينة معزولة',
      sandboxNotice: 'إطار معاينة معزول (sandbox) دون وصول للصفحة الأم.',
    },
    ai: {
      title: 'karejan AI',
      newChat: 'محادثة جديدة',
      renameChat: 'إعادة تسمية',
      deleteChat: 'حذف',
      regenerate: 'إعادة التوليد',
      placeholder: 'اسأل karejan AI عن HTML أو CSS أو JavaScript...',
      send: 'إرسال',
      suggestedTitle: 'أسئلة مقترحة',
      suggested: [
        'اشرح الفرق بين Flexbox و CSS Grid مع مثال بسيط.',
        'لماذا يُفضل استخدام const و let بدلاً من var في JavaScript؟',
        'كيف تساعد وسوم HTML الدلالية في تحسين إمكانية الوصول؟',
      ],
      dailyLimitLabel: 'الحد اليومي المجاني',
      proFairUseLabel: 'Pro · استخدام طبيعي غير محدود للذكاء الاصطناعي خاضع لسياسة الاستخدام العادل',
      emptyState: 'اطرح سؤالك البرمجي بالعربية أو الكردية أو الإنجليزية، وستبقى الأمثلة البرمجية واضحة وقابلة للتنفيذ.',
      unavailableError: 'مساعد karejan غير متاح مؤقتاً. يرجى المحاولة لاحقاً.',
    },
    practice: {
      title: 'التمارين والاختبارات والامتحانات الموقوتة',
      exercisesTab: 'تمارين تفاعلية',
      quizzesTab: 'الاختبارات والامتحانات',
      hint: 'تلميح',
      showHint: 'إظهار التلميح',
      checkAnswer: 'تحقق من الإجابة',
      correct: 'إجابة صحيحة',
      incorrect: 'تحتاج مراجعة',
      startQuiz: 'بدء الاختبار',
      startTimedExam: 'بدء الامتحان الموقوت',
      submitQuiz: 'إرسال الإجابات',
      timeRemaining: 'الوقت المتبقي',
      scoreLabel: 'النتيجة',
      recommendedLessons: 'دروس مقترحة للمراجعة',
      proLocked: 'يتطلب خطة Pro',
      noAnswerKeysClient: 'يتم التصحيح على الخادم فقط ولا تُرسل مفاتيح الإجابة إلى المتصفح أبداً.',
    },
    pro: {
      title: 'اشتراك karejan Pro',
      priceHeadline: '10,000 د.ع / شهرياً',
      freeFairUseNote: 'دروس HTML/CSS/JS الأساسية والتمارين والاختبارات مع حد يومي لمساعد karejan.',
      proFairUseNote: 'استخدام طبيعي غير محدود للذكاء الاصطناعي خاضع لسياسة الاستخدام العادل، مع اختبارات Pro المتقدمة والامتحانات الموقوتة.',
      selectMethod: 'اختر طريقة الدفع اليدوي',
      accountNumber: 'رقم التحويل',
      instructions: 'تعليمات الدفع',
      securityNote: 'لن تطلب karejan أبداً رمز PIN أو كلمة المرور أو رمز OTP أو تسجيل دخول محفظتك.',
      transactionRef: 'رقم مرجع العملية',
      paymentDate: 'تاريخ الدفع',
      amountIqd: 'المبلغ المدفوع (د.ع)',
      receiptImage: 'صورة إيصال الدفع (JPEG أو PNG أو WEBP · حد أقصى 5 ميجابايت)',
      receiptRules: 'الإيصالات خاصة تماماً ولا يراها إلا صاحب الطلب ومسؤولو المدفوعات.',
      submitRequest: 'إرسال طلب التحقق من الدفع',
      submittedSuccess: 'تم إرسال طلب الدفع وهو قيد المراجعة اليدوية.',
      myRequests: 'طلبات الدفع الخاصة بك',
    },
    dashboard: {
      title: 'لوحة المتعلم',
      subscriptionCard: 'حالة الاشتراك',
      expiresOn: 'ينتهي في',
      renewPro: 'تجديد Pro',
      notificationsTitle: 'الإشعارات',
      noNotifications: 'لا توجد إشعارات بعد.',
      quizHistoryTitle: 'سجل محاولات الاختبارات',
      noQuizAttempts: 'لا توجد محاولات مسجلة بعد.',
      profileSettings: 'تفضيلات الحساب',
    },
    admin: {
      title: 'لوحة إدارة karejan',
      lessonsTab: 'إدارة الدروس',
      studioTab: 'استوديو المحتوى بالذكاء الاصطناعي',
      paymentsTab: 'المدفوعات والاشتراكات',
      settingsTab: 'الخطط والإعدادات',
      auditTab: 'سجل التدقيق',
      seedFirestore: 'مزامنة البيانات الأولية إلى Firestore',
      generateBtn: 'توليد الدروس عبر karejan AI',
      approve: 'موافقة وتفعيل',
      reject: 'رفض',
      requiresReview: 'يحتاج مراجعة',
      extendSub: 'تمديد الاشتراك',
      editorPaymentsBlocked: 'المحرر لا يملك صلاحية الوصول إلى المدفوعات.',
      superAdminOnlySettings: 'المشرف الأعلى فقط يمكنه تعديل طرق الدفع (FIB و Qi Card و ZainCash).',
      superAdminOnlyAudit: 'سجلات التدقيق للإضافة فقط ومقروءة من المشرف الأعلى فقط.',
    },
  },
  ckb: {
    nav: {
      home: 'سەرەکی',
      challenge: 'پرسیاری ڕۆژ ⚡',
      aitools: 'ئامرازەکانی AI 🤖',
      prompts: 'پرۆمپتە زێڕینەکان 💡',
      academy: 'ئەکادیمیا',
      editor: 'تاقیگەی کۆد',
      ai: 'karejan AI',
      practice: 'ڕاهێنان و تاقیکردنەوە',
      discover: 'گەڕان',
      pro: 'پلانی Pro',
      dashboard: 'داشبۆرد',
      admin: 'بەڕێوەبردن',
      signIn: 'چوونەژوورەوە',
    },
    common: {
      loading: 'چاوەڕوانبە...',
      save: 'پاشەکەوتکردن',
      cancel: 'هەڵوەشاندنەوە',
      delete: 'سڕینەوە',
      edit: 'دەستکاری',
      copy: 'کۆپی',
      copied: 'کۆپی کرا',
      reset: 'ڕێکخستنەوە',
      run: 'جێبەجێکردن',
      close: 'داخستن',
      submit: 'ناردن',
      search: 'گەڕان',
      signOut: 'چوونەدەرەوە',
      darkTheme: 'تاریک',
      lightTheme: 'ڕووناک',
      language: 'زمان',
      theme: 'ڕووکار',
      freePlan: 'پلانی بێبەرامبەر',
      proPlan: 'پلانی Pro',
      upgradeToPro: 'بەرزکردنەوە بۆ Pro',
      continueLearning: 'بەردەوامبوون لە فێربوون',
      completion: 'ڕێژەی تەواوکردن',
      signInRequired: 'بچۆ ژوورەوە بۆ پاشەکەوتکردنی پێشکەوتن، karejan AI، تاقیکردنەوە و بەشداریکردن.',
      verifyEmailNotice: 'تکایە ئیمەیڵەکەت پشتڕاست بکەرەوە، یان بە Google بچۆ ژوورەوە.',
      resendVerification: 'دووبارە ناردنی پشتڕاستکردنەوە',
    },
    auth: {
      signInTitle: 'چوونەژوورەوە بۆ karejan',
      registerTitle: 'دروستکردنی هەژماری karejan',
      resetTitle: 'گەڕاندنەوەی وشەی نهێنی',
      email: 'ئیمەیڵ',
      password: 'وشەی نهێنی',
      displayName: 'ناوی تەواو',
      continueWithGoogle: 'بەردەوامبوون بە Google',
      signInBtn: 'چوونەژوورەوە',
      registerBtn: 'دروستکردنی هەژمار',
      sendResetBtn: 'ناردنی بەستەری گەڕاندنەوە',
      forgotPassword: 'وشەی نهێنیت لەبیرچووە؟',
      haveAccount: 'هەژمارت هەیە؟ بچۆ ژوورەوە',
      noAccount: 'هەژمارت نییە؟ خۆت تۆمار بکە',
      backToSignIn: 'گەڕانەوە بۆ چوونەژوورەوە',
      resetSent: 'بەستەری گۆڕینی وشەی نهێنی بۆ ئیمەیڵەکەت نێردرا.',
    },
    academy: {
      title: 'ئەکادیمیای گەشەپێدانی وێب',
      subtitle: 'وانەکانی HTML و CSS و JavaScript بە کوردی (سۆرانی و بادینی)، عەرەبی و ئینگلیزی.',
      coursesLabel: 'کۆرسەکان',
      intro: 'پێشەکی',
      objectives: 'ئامانجەکانی وانە',
      explanation: 'ڕوونکردنەوەی سەرەکی',
      syntax: 'ڕێزمان و پێکهاتە',
      codeExample: 'نموونەی کۆد',
      tryItYourself: 'خۆت تاقیبکەرەوە',
      openInEditor: 'کردنەوە لە تاقیگەی کۆد',
      commonMistakes: 'هەڵە باوەکان',
      summary: 'پوختە',
      markComplete: 'دیاریکردن وەک تەواوکراو',
      completed: 'تەواوکراوە',
      previousLesson: 'وانەی پێشوو',
      nextLesson: 'وانەی داهاتوو',
    },
    editor: {
      title: 'تاقیگەی دابڕاوی HTML / CSS / JS',
      runCode: 'جێبەجێکردن',
      resetCode: 'ڕێکخستنەوە',
      fullscreen: 'پڕشاشە',
      exitFullscreen: 'دەرچوون لە پڕشاشە',
      saveSnippet: 'پاشەکەوتکردنی کۆد',
      loadSnippet: 'کۆدەکانم',
      snippetTitlePlaceholder: 'ناونیشانی پارچە کۆد',
      savedSnippets: 'کۆدە پاشەکەوتکراوەکان',
      noSnippets: 'هێشتا هیچ کۆدێک پاشەکەوت نەکراوە.',
      livePreview: 'پیشاندانی دابڕاو',
      sandboxNotice: 'پەنجەرەی دابڕاو (sandbox) بێ دەستڕاگەیشتن بە لاپەڕەی سەرەکی.',
    },
    ai: {
      title: 'karejan AI',
      newChat: 'گفتوگۆی نوێ',
      renameChat: 'ناوگۆڕین',
      deleteChat: 'سڕینەوە',
      regenerate: 'دووبارە وەڵامدانەوە',
      placeholder: 'پرسیار لە karejan AI بکە دەربارەی HTML یان CSS یان JavaScript...',
      send: 'ناردن',
      suggestedTitle: 'پرسیارە پێشنیارکراوەکان',
      suggested: [
        'جیاوازی نێوان Flexbox و CSS Grid چییە بە نموونەوە؟',
        'بۆچی لە JavaScript دا const و let لە var باشترن؟',
        'تاگە واتادارەکانی HTML چۆن یارمەتی بەردەستبوون دەدەن؟',
      ],
      dailyLimitLabel: 'سنووری ڕۆژانەی بێبەرامبەر',
      proFairUseLabel: 'Pro · بەکارهێنانی ئاسایی بێسنووری زیرەکی دەستکرد بەپێی سیاسەتی بەکارهێنانی دادپەروەرانە',
      emptyState: 'پرسیاری پرۆگرامسازی بە سۆرانی، بادینی، عەرەبی یان ئینگلیزی بنووسە.',
      unavailableError: 'karejan AI بە کاتی بەردەست نییە. تکایە دواتر هەوڵبدەرەوە.',
    },
    practice: {
      title: 'ڕاهێنان، کویز و تاقیکردنەوەی کاتدار',
      exercisesTab: 'ڕاهێنانی کارلێککار',
      quizzesTab: 'کویز و تاقیکردنەوەکان',
      hint: 'ئاماژە',
      showHint: 'پیشاندانی ئاماژە',
      checkAnswer: 'ناردنی وەڵام',
      correct: 'ڕاستە',
      incorrect: 'پێویستی بە پێداچوونەوەیە',
      startQuiz: 'دەستپێکردنی کویز',
      startTimedExam: 'دەستپێکردنی تاقیکردنەوەی کاتدار',
      submitQuiz: 'ناردنی وەڵامەکان',
      timeRemaining: 'کاتی ماوە',
      scoreLabel: 'نمرە',
      recommendedLessons: 'وانە پێشنیارکراوەکان بۆ پێداچوونەوە',
      proLocked: 'پلانی Pro پێویستە',
      noAnswerKeysClient: 'هەڵسەنگاندن تەنها لە سێرڤەر ئەنجام دەدرێت و کلیلی وەڵامەکان هەرگیز نانێردرێن بۆ وێبگەڕ.',
    },
    pro: {
      title: 'بەشداربوونی karejan Pro',
      priceHeadline: '10,000 دینار / مانگانە',
      freeFairUseNote: 'وانە و ڕاهێنان و کویزە ستانداردەکان لەگەڵ سنووری ڕۆژانەی karejan AI.',
      proFairUseNote: 'بەکارهێنانی ئاسایی بێسنووری AI بەپێی بەکارهێنانی دادپەروەرانە، لەگەڵ تاقیکردنەوەی پێشکەفتووی Pro و تاقیکردنەوەی کاتدار.',
      selectMethod: 'شێوازی پارەدانی دەستی هەڵبژێرە',
      accountNumber: 'ژمارەی گواستنەوە',
      instructions: 'ڕێنماییەکانی پارەدان',
      securityNote: 'karejan هەرگیز داوای PIN، وشەی نهێنی، OTP یان چوونەژوورەوەی جزدانت ناکات.',
      transactionRef: 'ژمارەی سەرچاوەی مامەڵە',
      paymentDate: 'بەرواری پارەدان',
      amountIqd: 'بڕی پارەی دراو (دینار)',
      receiptImage: 'وێنەی پسووڵەی پارەدان (JPEG، PNG یان WEBP · زۆرترین 5MB)',
      receiptRules: 'پسووڵەکان تایبەتن و تەنها خۆت و بەڕێوەبەرانی پارەدان دەیانبینن.',
      submitRequest: 'ناردنی داواکاری پشتڕاستکردنەوە',
      submittedSuccess: 'داواکاری پارەدانەکەت نێردرا و لە چاوەڕوانی پشتڕاستکردنەوەی دەستیدایە.',
      myRequests: 'داواکارییەکانی پارەدانت',
    },
    dashboard: {
      title: 'داشبۆردی فێرخواز',
      subscriptionCard: 'دۆخی بەشداریکردن',
      expiresOn: 'بەسەردەچێت لە',
      renewPro: 'نوێکردنەوەی Pro',
      notificationsTitle: 'ئاگادارکردنەوەکان',
      noNotifications: 'هێشتا هیچ ئاگادارکردنەوەیەک نییە.',
      quizHistoryTitle: 'مێژووی تاقیکردنەوەکان',
      noQuizAttempts: 'هێشتا هیچ هەوڵێک تۆمار نەکراوە.',
      profileSettings: 'ڕێکخستنەکانی پرۆفایل',
    },
    admin: {
      title: 'پانێڵی بەڕێوەبردنی karejan',
      lessonsTab: 'بەڕێوەبردنی وانەکان',
      studioTab: 'ستۆدیۆی ناوەڕۆکی AI',
      paymentsTab: 'پارەدان و بەشداربوون',
      settingsTab: 'پلان و ڕێکخستنەکان',
      auditTab: 'تۆماری چاودێری',
      seedFirestore: 'هاوکاتکردنی داتای سەرەتایی بۆ Firestore',
      generateBtn: 'دروستکردنی وانە بە karejan AI',
      approve: 'پەسەندکردن و چالاککردن',
      reject: 'ڕەتکردنەوە',
      requiresReview: 'پێویستی بە پێداچوونەوەیە',
      extendSub: 'درێژکردنەوەی بەشداریکردن',
      editorPaymentsBlocked: 'دەستکاریکار (Editor) دەستڕاگەیشتنی بە پارەدانەکان نییە.',
      superAdminOnlySettings: 'تەنها Super Admin دەتوانێت شێوازەکانی پارەدان دەستکاری بکات.',
      superAdminOnlyAudit: 'تۆماری چاودێری تەنها بۆ زیادکردنە و تەنها Super Admin دەتوانێت بیخوێنێتەوە.',
    },
  },
  kmr: {
    nav: {
      home: 'سەرەکی',
      challenge: 'پرسیارا ڕۆژێ ⚡',
      aitools: 'ئامرازێن AI 🤖',
      prompts: 'پرۆمپتێن زێڕین 💡',
      academy: 'ئەکادیمیا',
      editor: 'تاقیگەها کۆدی',
      ai: 'karejan AI',
      practice: 'ڕاهێنان و ئەزموون',
      discover: 'ڤەدیتن',
      pro: 'پلانا Pro',
      dashboard: 'داشبۆرد',
      admin: 'ڕێڤەبەری',
      signIn: 'چوونەژوور',
    },
    common: {
      loading: 'چاڤەڕێ بە...',
      save: 'پاشکەفتکرن',
      cancel: 'هەلوەشاندن',
      delete: 'ژێبرن',
      edit: 'گوهۆڕین',
      copy: 'کۆپی',
      copied: 'هاتە کۆپیکرن',
      reset: 'ڤەگەڕاندن',
      run: 'بکارئینان',
      close: 'داخستن',
      submit: 'هنارتن',
      search: 'لێگەڕیان',
      signOut: 'دەرکەفتن',
      darkTheme: 'تاری',
      lightTheme: 'ڕۆهن',
      language: 'زمان',
      theme: 'شێواز',
      freePlan: 'پلانا بێبەرامبەر',
      proPlan: 'پلانا Pro',
      upgradeToPro: 'بلندکرن بۆ Pro',
      continueLearning: 'بەردەوامی ب فێربوونێ',
      completion: 'ڕێژەیا تمامکرنێ',
      signInRequired: 'بچە ژوور دا پێشکەفتنا خۆ، karejan AI، ئەزموون و بەشداریێ پاشکەفت بکەی.',
      verifyEmailNotice: 'هیڤیە ئیمێلێ خۆ پشتڕاست بکە، یان ب Google بچە ژوور.',
      resendVerification: 'دوبارە هنارتنا پشتڕاستکرنێ',
    },
    auth: {
      signInTitle: 'چوونەژوور بۆ karejan',
      registerTitle: 'چێکرنا هەژمارا karejan',
      resetTitle: 'ڤەگەڕاندنا پەیڤا نهێنی',
      email: 'ئیمێل',
      password: 'پەیڤا نهێنی',
      displayName: 'ناڤێ تەمام',
      continueWithGoogle: 'بەردەوامی ب Google',
      signInBtn: 'چوونەژوور',
      registerBtn: 'چێکرنا هەژمارێ',
      sendResetBtn: 'هنارتنا لینکێ ڤەگەڕاندنێ',
      forgotPassword: 'پەیڤا نهێنی ژ بیرا تە چوویە؟',
      haveAccount: 'هەژمارا تە هەیە؟ بچە ژوور',
      noAccount: 'هەژمارا تە نینە؟ خۆ تۆمار بکە',
      backToSignIn: 'زڤڕین بۆ چوونەژوورێ',
      resetSent: 'لینکێ گوهۆڕینا پەیڤا نهێنی بۆ ئیمێلێ تە هاتە هنارتن.',
    },
    academy: {
      title: 'ئەکادیمیایا گەشەپێدانا وێبی',
      subtitle: 'وانێن HTML و CSS و JavaScript ب سۆرانی، بادینی، عەرەبی و ئینگلیزی.',
      coursesLabel: 'کۆرس',
      intro: 'دەستپێک',
      objectives: 'ئارمانجێن وانێ',
      explanation: 'شڕۆڤەیا سەرەکی',
      syntax: 'ڕێزمان و پێکهاتە',
      codeExample: 'نموونەیا کۆدی',
      tryItYourself: 'ب خۆ تاقی بکە',
      openInEditor: 'ڤەکرن د تاقیگەها کۆدی دا',
      commonMistakes: 'خەلەتیێن بەربەلاڤ',
      summary: 'کورتە',
      markComplete: 'نیشانکرن وەک تمامکری',
      completed: 'تمامبوویە',
      previousLesson: 'وانەیا بەرێ',
      nextLesson: 'وانەیا بهێت',
    },
    editor: {
      title: 'تاقیگەها جوداکری یا HTML / CSS / JS',
      runCode: 'بکارئینان',
      resetCode: 'ڤەگەڕاندن',
      fullscreen: 'پڕشاشە',
      exitFullscreen: 'دەرکەفتن ژ پڕشاشێ',
      saveSnippet: 'پاشکەفتکرنا کۆدی',
      loadSnippet: 'کۆدێن من',
      snippetTitlePlaceholder: 'ناڤنیشانێ پارچە کۆدی',
      savedSnippets: 'کۆدێن پاشکەفتکری',
      noSnippets: 'هێشتا چ کۆد نەهاتینە پاشکەفتکرن.',
      livePreview: 'نیشاندانا جوداکری',
      sandboxNotice: 'پەنجەرەیا جوداکری (sandbox) بێ دەستگەهشتن ب لاپەڕا سەرەکی.',
    },
    ai: {
      title: 'karejan AI',
      newChat: 'گفتوگۆیا نوی',
      renameChat: 'ناڤگوهۆڕین',
      deleteChat: 'ژێبرن',
      regenerate: 'دوبارە بەرسڤدان',
      placeholder: 'پرسیارێ ژ karejan AI بکە لسەر HTML یان CSS یان JavaScript...',
      send: 'هنارتن',
      suggestedTitle: 'پرسیارێن پێشنیارکری',
      suggested: [
        'جوداهیا دناڤبەرا Flexbox و CSS Grid دا چییە ب نموونە؟',
        'بۆچی د JavaScript دا const و let ژ var چێترن؟',
        'تاگێن واتادار یێن HTML چەوا هاریکاریا دەستگەهشتنێ دکەن؟',
      ],
      dailyLimitLabel: 'سنوورێ ڕۆژانە یێ بێبەرامبەر',
      proFairUseLabel: 'Pro · بکارئینانا ئاسایی یا بێسنوور یا AI ل گۆڕ بکارئینانا دادپەروەرانە',
      emptyState: 'پرسیارا خۆ یا پرۆگرامسازیێ ب بادینی، سۆرانی، عەرەبی یان ئینگلیزی بنڤیسە.',
      unavailableError: 'karejan AI ب شێوەیەکێ کاتی بەردەست نینە. هیڤیە پاشی هەول بدە.',
    },
    practice: {
      title: 'ڕاهێنان، کویز و ئەزموونێن دەمدار',
      exercisesTab: 'ڕاهێنانێن کارلێککەر',
      quizzesTab: 'کویز و ئەزموون',
      hint: 'ئاماژە',
      showHint: 'نیشاندانا ئاماژێ',
      checkAnswer: 'هنارتنا بەرسڤێ',
      correct: 'ڕاستە',
      incorrect: 'پێدڤی ب پێداچوونێ یە',
      startQuiz: 'دەستپێکرنا کویزی',
      startTimedExam: 'دەستپێکرنا ئەزموونا دەمدار',
      submitQuiz: 'هنارتنا بەرسڤان',
      timeRemaining: 'دەمێ مای',
      scoreLabel: 'نمرە',
      recommendedLessons: 'وانێن پێشنیارکری بۆ پێداچوونێ',
      proLocked: 'پلانا Pro پێدڤییە',
      noAnswerKeysClient: 'هەلسەنگاندن بتنێ لسەر سێرڤەری دهێتە کرن و کلیلێن بەرسڤان قەت ناهێنە هنارتن بۆ وێبگەڕی.',
    },
    pro: {
      title: 'بەشداربوونا karejan Pro',
      priceHeadline: '10,000 دینار / مەهانە',
      freeFairUseNote: 'وانە و ڕاهێنان و کویزێن ستاندارد دگەل سنوورێ ڕۆژانە یێ karejan AI.',
      proFairUseNote: 'بکارئینانا ئاسایی یا بێسنوور یا AI ل گۆڕ بکارئینانا دادپەروەرانە، دگەل ئەزموونێن پێشکەفتی یێن Pro و ئەزموونێن دەمدار.',
      selectMethod: 'شێوازێ پارەدانا دەستی هەلبژێرە',
      accountNumber: 'ژمارەیا ڤەگوهاستنێ',
      instructions: 'ڕێنمایێن پارەدانێ',
      securityNote: 'karejan قەت داخوازا PIN، پەیڤا نهێنی، OTP یان چوونەژوورەیا جزدانێ تە ناکەت.',
      transactionRef: 'ژمارەیا سەرچاوەیا مامەلێ',
      paymentDate: 'ڕێکەفتا پارەدانێ',
      amountIqd: 'بڕێ پارەیێ دای (دینار)',
      receiptImage: 'وێنێ پسوولەیا پارەدانێ (JPEG، PNG یان WEBP · هەرە زۆر 5MB)',
      receiptRules: 'پسوولە تایبەتن و بتنێ تو و ڕێڤەبەرێن پارەدانێ دبینن.',
      submitRequest: 'هنارتنا داخوازیا پشتڕاستکرنێ',
      submittedSuccess: 'داخوازیا پارەدانا تە هاتە هنارتن و ل چاڤەڕێیا پشتڕاستکرنا دەستی یە.',
      myRequests: 'داخوازیێن پارەدانا تە',
    },
    dashboard: {
      title: 'داشبۆردێ فێرخازی',
      subscriptionCard: 'ڕەوشا بەشداریێ',
      expiresOn: 'ب دوماهی دهێت ل',
      renewPro: 'نویکرنا Pro',
      notificationsTitle: 'ئاگەهدارکرن',
      noNotifications: 'هێشتا چ ئاگەهدارکرن نینن.',
      quizHistoryTitle: 'مێژوویا ئەزموونان',
      noQuizAttempts: 'هێشتا چ هەول نەهاتینە تۆمارکرن.',
      profileSettings: 'ڕێکخستنێن پرۆفایلی',
    },
    admin: {
      title: 'پانێلێ ڕێڤەبەریا karejan',
      lessonsTab: 'ڕێڤەبرنا وانان',
      studioTab: 'ستۆدیۆیا ناڤەڕۆکا AI',
      paymentsTab: 'پارەدان و بەشداربوون',
      settingsTab: 'پلان و ڕێکخستن',
      auditTab: 'تۆمارا چاڤدێریێ',
      seedFirestore: 'هەڤدەمکرنا داتایێن دەستپێکێ بۆ Firestore',
      generateBtn: 'چێکرنا وانان ب karejan AI',
      approve: 'پەسەندکرن و چالاککرن',
      reject: 'ڕەتکرن',
      requiresReview: 'پێدڤی ب پێداچوونێ یە',
      extendSub: 'درێژکرنا بەشداریێ',
      editorPaymentsBlocked: 'دەستکاریکەر (Editor) دەستگەهشتن ب پارەدانان نینە.',
      superAdminOnlySettings: 'بتنێ Super Admin دشێت شێوازێن پارەدانێ بگوهۆڕیت.',
      superAdminOnlyAudit: 'تۆمارێن چاڤدێریێ بتنێ بۆ زێدەکرنێ نە و بتنێ Super Admin دشێت بخوینیت.',
    },
  },
};
