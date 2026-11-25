import type { Locale } from '../types/domain';

export interface DiscoveryCopy {
  navLabel: string;
  pageTitle: string;
  pageSubtitle: string;
  tabs: {
    knowledge: string;
    references: string;
    aiTools: string;
    projects: string;
  };
  knowledge: {
    searchPlaceholder: string;
    allCategories: string;
    bookmarksOnly: string;
    bookmark: string;
    bookmarked: string;
    readingProgress: string;
    markRead: string;
    completed: string;
    minRead: string;
    keyTakeaways: string;
    codeExample: string;
    backToList: string;
    noArticles: string;
    categories: Record<'web-architecture' | 'performance' | 'security' | 'ai-engineering' | 'tooling', string>;
  };
  references: {
    searchPlaceholder: string;
    allTracks: string;
    syntax: string;
    details: string;
    notes: string;
    browserSupport: string;
    liveExample: string;
    tryInEditor: string;
    noEntries: string;
  };
  aiTools: {
    searchPlaceholder: string;
    allCategories: string;
    officialLinkNotice: string;
    visitOfficial: string;
    lastVerified: string;
    bestFor: string;
    pricing: Record<'free' | 'freemium' | 'paid' | 'open_source', string>;
    categories: Record<'coding' | 'research' | 'design' | 'writing' | 'models' | 'productivity', string>;
    noTools: string;
  };
  projects: {
    searchPlaceholder: string;
    allTracks: string;
    submitProject: string;
    mySubmissions: string;
    officialLabel: string;
    communityLabel: string;
    openInEditor: string;
    livePreview: string;
    moderationNotice: string;
    submitTitle: string;
    projectTitle: string;
    projectDescription: string;
    track: string;
    difficulty: string;
    tagsPlaceholder: string;
    submittedPending: string;
    statusLabels: Record<'pending' | 'approved' | 'rejected', string>;
    noProjects: string;
  };
  admin: {
    tabLabel: string;
    seedPhase5: string;
    articlesTab: string;
    referencesTab: string;
    aiToolsTab: string;
    projectsTab: string;
    moderationQueue: string;
    approveProject: string;
    rejectProject: string;
    rejectReasonPrompt: string;
    markVerifiedToday: string;
    httpsOnlyError: string;
    saveEntry: string;
    createNew: string;
    publishedLabel: string;
    draftLabel: string;
  };
}

export const DISCOVERY_COPY: Record<Locale, DiscoveryCopy> = {
  en: {
    navLabel: 'Discover',
    pageTitle: 'Content & Discovery',
    pageSubtitle: 'Curated technology articles, quick HTML/CSS/JS references, verified AI tools, and moderated community code projects.',
    tabs: {
      knowledge: 'Knowledge Center',
      references: 'References Library',
      aiTools: 'AI Tools Directory',
      projects: 'Projects & Code',
    },
    knowledge: {
      searchPlaceholder: 'Search technology articles...',
      allCategories: 'All Categories',
      bookmarksOnly: 'Bookmarked',
      bookmark: 'Bookmark',
      bookmarked: 'Bookmarked',
      readingProgress: 'Reading progress',
      markRead: 'Mark as read (100%)',
      completed: 'Completed',
      minRead: 'min read',
      keyTakeaways: 'Key Takeaways',
      codeExample: 'Code Example',
      backToList: 'Back to articles',
      noArticles: 'No articles match your current filter.',
      categories: {
        'web-architecture': 'Web Architecture',
        performance: 'Performance',
        security: 'Security',
        'ai-engineering': 'AI Engineering',
        tooling: 'Developer Tooling',
      },
    },
    references: {
      searchPlaceholder: 'Search HTML tags, CSS properties, JS methods...',
      allTracks: 'All',
      syntax: 'Syntax',
      details: 'How It Works',
      notes: 'Practical Notes',
      browserSupport: 'Browser Support',
      liveExample: 'Code Example',
      tryInEditor: 'Open in Editor',
      noEntries: 'No reference entries found.',
    },
    aiTools: {
      searchPlaceholder: 'Search verified AI tools...',
      allCategories: 'All Categories',
      officialLinkNotice: 'Every link in this directory is verified to point exclusively to an official HTTPS vendor domain.',
      visitOfficial: 'Official Website',
      lastVerified: 'Last verified',
      bestFor: 'Best for',
      pricing: {
        free: 'Free',
        freemium: 'Freemium',
        paid: 'Paid',
        open_source: 'Open Source',
      },
      categories: {
        coding: 'Coding',
        research: 'Research',
        design: 'Design & UI',
        writing: 'Writing',
        models: 'Models & APIs',
        productivity: 'Productivity',
      },
      noTools: 'No verified AI tools match your filter.',
    },
    projects: {
      searchPlaceholder: 'Search projects and templates...',
      allTracks: 'All',
      submitProject: 'Submit Project',
      mySubmissions: 'My Submissions',
      officialLabel: 'Official',
      communityLabel: 'Community',
      openInEditor: 'Open in Editor',
      livePreview: 'Sandboxed Live Preview',
      moderationNotice: 'Community submissions are reviewed by KARÊJAN staff before appearing publicly.',
      submitTitle: 'Submit a Code Project for Review',
      projectTitle: 'Project Title',
      projectDescription: 'Short Description',
      track: 'Track',
      difficulty: 'Difficulty',
      tagsPlaceholder: 'Tags (comma-separated, max 6)',
      submittedPending: 'Project submitted! It is now pending staff moderation.',
      statusLabels: {
        pending: 'Pending review',
        approved: 'Approved',
        rejected: 'Rejected',
      },
      noProjects: 'No projects match your current filter.',
    },
    admin: {
      tabLabel: 'Discovery CMS',
      seedPhase5: 'Seed Phase 5 Content',
      articlesTab: 'Knowledge Articles',
      referencesTab: 'References Library',
      aiToolsTab: 'AI Tools Directory',
      projectsTab: 'Projects & Moderation',
      moderationQueue: 'Submission Moderation Queue',
      approveProject: 'Approve',
      rejectProject: 'Reject',
      rejectReasonPrompt: 'Moderation note / rejection reason',
      markVerifiedToday: 'Verify Today',
      httpsOnlyError: 'Official URL must start with https:// and point to a valid domain.',
      saveEntry: 'Save Entry',
      createNew: 'New Entry',
      publishedLabel: 'Published',
      draftLabel: 'Unpublished',
    },
  },
  ar: {
    navLabel: 'استكشف',
    pageTitle: 'المحتوى والاستكشاف',
    pageSubtitle: 'مقالات تقنية متخصصة، مكتبة مراجع HTML/CSS/JS، دليل أدوات الذكاء الاصطناعي الموثّقة، ومكتبة المشاريع البرمجية الخاضعة للمراجعة.',
    tabs: {
      knowledge: 'مركز المعرفة التقنية',
      references: 'مكتبة المراجع',
      aiTools: 'دليل أدوات الذكاء الاصطناعي',
      projects: 'المشاريع والكود',
    },
    knowledge: {
      searchPlaceholder: 'ابحث في المقالات التقنية...',
      allCategories: 'جميع التصنيفات',
      bookmarksOnly: 'المحفوظات',
      bookmark: 'حفظ',
      bookmarked: 'محفوظ',
      readingProgress: 'تقدم القراءة',
      markRead: 'تحديد كمقروء (100%)',
      completed: 'مكتمل',
      minRead: 'دقيقة قراءة',
      keyTakeaways: 'أهم النقاط',
      codeExample: 'مثال برمجي',
      backToList: 'العودة إلى المقالات',
      noArticles: 'لا توجد مقالات مطابقة للبحث.',
      categories: {
        'web-architecture': 'معمارية الويب',
        performance: 'الأداء',
        security: 'الأمن البرمجي',
        'ai-engineering': 'هندسة الذكاء الاصطناعي',
        tooling: 'أدوات المطورين',
      },
    },
    references: {
      searchPlaceholder: 'ابحث عن وسوم HTML، خصائص CSS، دوال JS...',
      allTracks: 'الكل',
      syntax: 'الصيغة',
      details: 'كيف يعمل',
      notes: 'ملاحظات عملية',
      browserSupport: 'دعم المتصفحات',
      liveExample: 'مثال عملي',
      tryInEditor: 'افتح في المحرر',
      noEntries: 'لا توجد مراجع مطابقة.',
    },
    aiTools: {
      searchPlaceholder: 'ابحث في أدوات الذكاء الاصطناعي الموثّقة...',
      allCategories: 'جميع التصنيفات',
      officialLinkNotice: 'جميع الروابط في هذا الدليل موثّقة وتقود حصرياً إلى المواقع الرسمية عبر HTTPS.',
      visitOfficial: 'الموقع الرسمي',
      lastVerified: 'آخر تحقق',
      bestFor: 'الأفضل لـ',
      pricing: {
        free: 'مجاني',
        freemium: 'مجاني + مدفوع',
        paid: 'مدفوع',
        open_source: 'مفتوح المصدر',
      },
      categories: {
        coding: 'البرمجة',
        research: 'البحث',
        design: 'التصميم والواجهات',
        writing: 'الكتابة',
        models: 'النماذج و APIs',
        productivity: 'الإنتاجية',
      },
      noTools: 'لا توجد أدوات مطابقة.',
    },
    projects: {
      searchPlaceholder: 'ابحث في المشاريع والقوالب...',
      allTracks: 'الكل',
      submitProject: 'إرسال مشروع',
      mySubmissions: 'مشاريعي المرسلة',
      officialLabel: 'رسمي',
      communityLabel: 'المجتمع',
      openInEditor: 'افتح في المحرر',
      livePreview: 'معاينة معزولة آمنة',
      moderationNotice: 'تُراجع مشاريع المجتمع من قِبل فريق KARÊJAN قبل نشرها للعامة.',
      submitTitle: 'إرسال مشروع برمجي للمراجعة',
      projectTitle: 'عنوان المشروع',
      projectDescription: 'وصف مختصر',
      track: 'المسار',
      difficulty: 'المستوى',
      tagsPlaceholder: 'الوسوم (مفصولة بفاصلة، بحد أقصى 6)',
      submittedPending: 'تم إرسال المشروع وهو الآن بانتظار مراجعة الفريق.',
      statusLabels: {
        pending: 'قيد المراجعة',
        approved: 'معتمد',
        rejected: 'مرفوض',
      },
      noProjects: 'لا توجد مشاريع مطابقة.',
    },
    admin: {
      tabLabel: 'إدارة المحتوى (المرحلة 5)',
      seedPhase5: 'تعبئة محتوى المرحلة 5',
      articlesTab: 'مقالات المعرفة',
      referencesTab: 'مكتبة المراجع',
      aiToolsTab: 'أدوات الذكاء الاصطناعي',
      projectsTab: 'المشاريع والمراجعة',
      moderationQueue: 'قائمة مراجعة المشاريع',
      approveProject: 'اعتماد',
      rejectProject: 'رفض',
      rejectReasonPrompt: 'ملاحظة المراجعة / سبب الرفض',
      markVerifiedToday: 'تحديث التحقق اليوم',
      httpsOnlyError: 'يجب أن يبدأ الرابط الرسمي بـ https:// لنطاق صحيح.',
      saveEntry: 'حفظ العنصر',
      createNew: 'عنصر جديد',
      publishedLabel: 'منشور',
      draftLabel: 'غير منشور',
    },
  },
  ckb: {
    navLabel: 'گەڕان',
    pageTitle: 'ناوەڕۆک و دۆزینەوە',
    pageSubtitle: 'وتارە تەکنەلۆجییەکان، کتێبخانەی سەرچاوەکانی HTML/CSS/JS، ڕێبەری ئامرازە فەرمییەکانی AI، و پڕۆژە پەسەندکراوەکان.',
    tabs: {
      knowledge: 'ناوەندی زانیاریی تەکنەلۆجیا',
      references: 'کتێبخانەی سەرچاوەکان',
      aiTools: 'ڕێبەری ئامرازەکانی AI',
      projects: 'پڕۆژە و کۆدەکان',
    },
    knowledge: {
      searchPlaceholder: 'گەڕان لە وتارە تەکنەلۆجییەکاندا...',
      allCategories: 'هەموو پۆلەکان',
      bookmarksOnly: 'پاشەکەوتکراوەکان',
      bookmark: 'پاشەکەوت',
      bookmarked: 'پاشەکەوتکراوە',
      readingProgress: 'پێشکەوتنی خوێندنەوە',
      markRead: 'وەک خوێندراو نیشان بکە (100%)',
      completed: 'تەواوبوو',
      minRead: 'خولەک خوێندنەوە',
      keyTakeaways: 'خاڵە سەرەکییەکان',
      codeExample: 'نموونەی کۆد',
      backToList: 'گەڕانەوە بۆ وتارەکان',
      noArticles: 'هیچ وتارێک نەدۆزرایەوە.',
      categories: {
        'web-architecture': 'تەلارسازیی وێب',
        performance: 'خێرایی و کارایی',
        security: 'ئاسایشی ئەپ',
        'ai-engineering': 'ئەندازیاریی AI',
        tooling: 'ئامرازەکانی گەشەپێدان',
      },
    },
    references: {
      searchPlaceholder: 'گەڕان بۆ تاگی HTML، تایبەتمەندیی CSS، میسۆدی JS...',
      allTracks: 'هەمووی',
      syntax: 'شێوازی نووسین',
      details: 'چۆن کار دەکات',
      notes: 'تێبینییە پراکتیکییەکان',
      browserSupport: 'پشتگیریی وێبگەڕەکان',
      liveExample: 'نموونەی کۆد',
      tryInEditor: 'کردنەوە لە ئیدیتەردا',
      noEntries: 'هیچ سەرچاوەیەک نەدۆزرایەوە.',
    },
    aiTools: {
      searchPlaceholder: 'گەڕان لە ئامرازە پشتڕاستکراوەکانی AI...',
      allCategories: 'هەموو پۆلەکان',
      officialLinkNotice: 'هەموو بەستەرەکانی ئەم ڕێبەرە پشتڕاستکراون و تەنها دەچنە سەر ماڵپەڕی فەرمیی HTTPS.',
      visitOfficial: 'ماڵپەڕی فەرمی',
      lastVerified: 'دوا پشکنین',
      bestFor: 'باشترینە بۆ',
      pricing: {
        free: 'خۆڕایی',
        freemium: 'خۆڕایی + پارەدار',
        paid: 'پارەدار',
        open_source: 'سەرچاوە-کراوە',
      },
      categories: {
        coding: 'پرۆگرامسازی',
        research: 'لێکۆڵینەوە',
        design: 'دیزاین و ڕووکار',
        writing: 'نووسین',
        models: 'مۆدێل و API',
        productivity: 'بەرهەمهێنان',
      },
      noTools: 'هیچ ئامرازێک نەدۆزرایەوە.',
    },
    projects: {
      searchPlaceholder: 'گەڕان لە پڕۆژە و قاڵبەکاندا...',
      allTracks: 'هەمووی',
      submitProject: 'ناردنی پڕۆژە',
      mySubmissions: 'پڕۆژە نێردراوەکانم',
      officialLabel: 'فەرمی',
      communityLabel: 'کۆمەڵگە',
      openInEditor: 'کردنەوە لە ئیدیتەردا',
      livePreview: 'پێشبینینی زیندووی سەلامەت',
      moderationNotice: 'پڕۆژە نێردراوەکانی بەکارهێنەران پێش بڵاوکردنەوە لەلایەن ستافی KARÊJAN پێداچوونەوەیان بۆ دەکرێت.',
      submitTitle: 'ناردنی پڕۆژەی کۆد بۆ پێداچوونەوە',
      projectTitle: 'ناونیشانی پڕۆژە',
      projectDescription: 'کورتە باس',
      track: 'بوار',
      difficulty: 'ئاست',
      tagsPlaceholder: 'تاگەکان (بە کۆما جیاکراوە، زۆرترین 6)',
      submittedPending: 'پڕۆژەکەت نێردرا و ئێستا لە چاوەڕوانی پێداچوونەوەی ستافدایە.',
      statusLabels: {
        pending: 'لە چاوەڕوانی پێداچوونەوە',
        approved: 'پەسەندکراو',
        rejected: 'ڕەتکراوە',
      },
      noProjects: 'هیچ پڕۆژەیەک نەدۆزرایەوە.',
    },
    admin: {
      tabLabel: 'بەڕێوەبردنی ناوەڕۆک (قۆناغی 5)',
      seedPhase5: 'تۆمارکردنی داتای قۆناغی 5',
      articlesTab: 'وتارەکانی زانیاری',
      referencesTab: 'سەرچاوەکان',
      aiToolsTab: 'ئامرازەکانی AI',
      projectsTab: 'پڕۆژە و پێداچوونەوە',
      moderationQueue: 'لیستی پێداچوونەوەی پڕۆژەکان',
      approveProject: 'پەسەندکردن',
      rejectProject: 'ڕەتکردنەوە',
      rejectReasonPrompt: 'تێبینی / هۆکاری ڕەتکردنەوە',
      markVerifiedToday: 'پشتڕاستکردنەوەی ئەمڕۆ',
      httpsOnlyError: 'بەستەری فەرمی دەبێت بە https:// دەست پێبکات.',
      saveEntry: 'پاشەکەوتکردن',
      createNew: 'زیادکردنی نوێ',
      publishedLabel: 'بڵاوکراوەتەوە',
      draftLabel: 'بڵاونەکراوەتەوە',
    },
  },
  kmr: {
    navLabel: 'ڤەدیتن',
    pageTitle: 'ناڤەڕۆک و ڤەدیتن',
    pageSubtitle: 'گۆتارێن تەکنۆلۆژی، کتێبخانا سەرچاوێن HTML/CSS/JS، ڕێبەرا ئامرازێن فەرمی یێن AI، و پڕۆژێن کۆدی.',
    tabs: {
      knowledge: 'ناڤەندا زانیاریا تەکنۆلۆژی',
      references: 'کتێبخانا سەرچاوەیان',
      aiTools: 'ڕێبەرا ئامرازێن AI',
      projects: 'پڕۆژە و کۆد',
    },
    knowledge: {
      searchPlaceholder: 'ل گۆتارێن تەکنۆلۆژی بگەڕە...',
      allCategories: 'هەمی پۆل',
      bookmarksOnly: 'پاراستی',
      bookmark: 'بپارێزە',
      bookmarked: 'پاراستیە',
      readingProgress: 'پێشکەفتنا خواندنێ',
      markRead: 'وەک خواندی نیشان بکە (100%)',
      completed: 'تەمامبوو',
      minRead: 'خۆلەک خواندن',
      keyTakeaways: 'خاڵێن سەرەکی',
      codeExample: 'نموونەیا کۆدی',
      backToList: 'زڤڕین بۆ گۆتاران',
      noArticles: 'چو گۆتار نەهاتنە دیتن.',
      categories: {
        'web-architecture': 'ئاڤاکرنا وێبی',
        performance: 'لەزاتی و کارکرن',
        security: 'پاراستن',
        'ai-engineering': 'ئەندازیاریا AI',
        tooling: 'ئامرازێن گەشەپێدانێ',
      },
    },
    references: {
      searchPlaceholder: 'ل تاگێ HTML، تایبەتمەندیا CSS، فەنکشنا JS بگەڕە...',
      allTracks: 'هەمی',
      syntax: 'ڕێنڤیس',
      details: 'چاوا کار دکەت',
      notes: 'تێبینیێن پراکتیکی',
      browserSupport: 'پشتگیریا وێبگەڕان',
      liveExample: 'نموونەیا کۆدی',
      tryInEditor: 'د ئیدیتەری دا ڤەکە',
      noEntries: 'چو سەرچاوە نەهاتنە دیتن.',
    },
    aiTools: {
      searchPlaceholder: 'ل ئامرازێن پشتڕاستکری یێن AI بگەڕە...',
      allCategories: 'هەمی پۆل',
      officialLinkNotice: 'هەمی لینکێن ڤێ ڕێبەرێ پشتڕاستکرینە و بتنێ دچنە مالپەڕێن فەرمی یێن HTTPS.',
      visitOfficial: 'مالپەڕێ فەرمی',
      lastVerified: 'دووماهیک پشکنین',
      bestFor: 'باشترینە بۆ',
      pricing: {
        free: 'بێبەرامبەر',
        freemium: 'بێبەرامبەر + پارەدار',
        paid: 'پارەدار',
        open_source: 'سەرچاوە-ڤەکری',
      },
      categories: {
        coding: 'پرۆگرامسازی',
        research: 'لێکۆلین',
        design: 'دیزاین و UI',
        writing: 'نڤیسین',
        models: 'مۆدێل و API',
        productivity: 'بەرهەمهێنان',
      },
      noTools: 'چو ئامراز نەهاتنە دیتن.',
    },
    projects: {
      searchPlaceholder: 'ل پڕۆژە و نموونەیان بگەڕە...',
      allTracks: 'هەمی',
      submitProject: 'هنارتنا پڕۆژەی',
      mySubmissions: 'پڕۆژێن من یێن هنارتی',
      officialLabel: 'فەرمی',
      communityLabel: 'جڤاک',
      openInEditor: 'د ئیدیتەری دا ڤەکە',
      livePreview: 'پێشبینینا پاراستی',
      moderationNotice: 'پڕۆژێن بکارهێنەران بەری بەلاڤکرنێ ژ لایێ ستافێ KARÊJAN ڤە دهێنە پشکنین.',
      submitTitle: 'هنارتنا پڕۆژێ کۆدی بۆ پشکنینێ',
      projectTitle: 'ناڤنیشانێ پڕۆژەی',
      projectDescription: 'وەسفا کورت',
      track: 'بوار',
      difficulty: 'ئاست',
      tagsPlaceholder: 'تاگ (ب کۆما جودا بکە، هەتا 6)',
      submittedPending: 'پڕۆژێ تە هاتە هنارتن و نوکە ل هیڤیا پشکنینا ستافێ یە.',
      statusLabels: {
        pending: 'ل هیڤیا پشکنینێ',
        approved: 'پەسەندکری',
        rejected: 'ڕەتکری',
      },
      noProjects: 'چو پڕۆژە نەهاتنە دیتن.',
    },
    admin: {
      tabLabel: 'بڕێڤەبرنا ناڤەڕۆکێ (قۆناغا 5)',
      seedPhase5: 'تۆمارکرنا داتایێن قۆناغا 5',
      articlesTab: 'گۆتارێن زانیاری',
      referencesTab: 'سەرچاوە',
      aiToolsTab: 'ئامرازێن AI',
      projectsTab: 'پڕۆژە و پشکنین',
      moderationQueue: 'لیستا پشکنینا پڕۆژەیان',
      approveProject: 'پەسەندکرن',
      rejectProject: 'ڕەتکرن',
      rejectReasonPrompt: 'ئەگەرێ ڕەتکرنێ / تێبینی',
      markVerifiedToday: 'پشتڕاستکرنا ئەڤرۆ',
      httpsOnlyError: 'لینکا فەرمی دڤێت ب https:// دەست پێ بکەت.',
      saveEntry: 'تۆمارکرن',
      createNew: 'تۆمارا نوی',
      publishedLabel: 'بەلاڤکری',
      draftLabel: 'نەبەلاڤکری',
    },
  },
};
