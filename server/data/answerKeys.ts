/**
 * SERVER-ONLY Answer Keys Vault.
 * NEVER imported by apps/web or src/ client bundles.
 * Answer keys are evaluated strictly on the server and never sent to the browser before submission.
 */

export type Locale = 'ckb' | 'kmr' | 'ar' | 'en';

export interface ServerExerciseKey {
  exerciseId: string;
  lessonId: string;
  courseId: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'predict_output' | 'find_error' | 'complete_code';
  tier: 'free' | 'pro';
  evaluationMethod: 'exact_option' | 'boolean' | 'normalized_text' | 'code_contains' | 'sandbox_output';
  correctAnswer: string;
  requiredTokens?: string[];
  explanation: Record<Locale, string>;
}

export interface ServerQuizQuestionKey {
  id: string;
  lessonId: string;
  correctOptionIndex: number;
  explanation: Record<Locale, string>;
}

export interface ServerQuizKey {
  quizId: string;
  quizType: 'lesson_quiz' | 'course_exam' | 'practice_test' | 'timed_exam';
  courseId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tier: 'free' | 'pro';
  timeLimitSeconds?: number;
  questions: ServerQuizQuestionKey[];
}

export const EXERCISE_KEY_VAULT = new Map<string, ServerExerciseKey>([
  // Original exercises
  [
    'ex-html-mc-1',
    {
      exerciseId: 'ex-html-mc-1',
      lessonId: 'html-1-semantic-structure',
      courseId: 'html',
      type: 'multiple_choice',
      tier: 'free',
      evaluationMethod: 'exact_option',
      correctAnswer: '1',
      explanation: {
        en: 'The <main> element identifies the dominant, unique content of a document body and aids screen readers.',
        ar: 'العنصر <main> يحدد المحتوى الرئيسي الفريد في الصفحة ويساعد قارئات الشاشة على التنقل السريع.',
        ckb: 'توخمی <main> ناوەڕۆکی سەرەکی و تاقانەی لاپەڕەکە دیاری دەکات و یارمەتی خوێنەرەوەی شاشە دەدات.',
        kmr: 'توخمێ <main> ناڤەڕۆکا سەرەکی یا لاپەڕێ دیار دکەت و هاریکاریا خواندەڤانێن شاشێ دکەت.',
      },
    },
  ],
  [
    'ex-html-tf-1',
    {
      exerciseId: 'ex-html-tf-1',
      lessonId: 'html-2-forms-accessibility',
      courseId: 'html',
      type: 'true_false',
      tier: 'free',
      evaluationMethod: 'boolean',
      correctAnswer: 'true',
      explanation: {
        en: 'True. Pairing <label for="email"> with <input id="email"> programmatically binds the label and expands the clickable target.',
        ar: 'صحيح. ربط <label for="email"> مع <input id="email"> يربط التسمية برمجياً ويوسع مساحة النقر.',
        ckb: 'ڕاستە. بەستنەوەی <label for="email"> بە <input id="email"> ناونیشانەکە بە خانەکەوە دەبەستێتەوە و بەردەستبوون باشتر دەکات.',
        kmr: 'ڕاستە. گرێدانا <label for="email"> دگەل <input id="email"> ناڤنیشانێ ب خانێ ڤە گرێددەت.',
      },
    },
  ],
  [
    'ex-css-fb-1',
    {
      exerciseId: 'ex-css-fb-1',
      lessonId: 'css-1-flexbox-layout',
      courseId: 'css',
      type: 'fill_blank',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: 'justify-content',
      explanation: {
        en: 'justify-content aligns flex items along the main axis (horizontal in default row direction).',
        ar: 'الخاصية justify-content تقوم بمحاذاة عناصر Flexbox على طول المحور الرئيسي.',
        ckb: 'تایبەتمەندیی justify-content توخمەکانی Flexbox بە درێژایی تەوەری سەرەکی ڕێک دەخات.',
        kmr: 'تایبەتمەندیا justify-content توخمێن Flexbox لسەر تەوەرێ سەرەکی ڕێک دئێخیت.',
      },
    },
  ],
  [
    'ex-js-po-1',
    {
      exerciseId: 'ex-js-po-1',
      lessonId: 'js-1-variables-functions',
      courseId: 'js',
      type: 'predict_output',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: '15',
      explanation: {
        en: 'Calling add(7, 8) returns 7 + 8, which evaluates to 15.',
        ar: 'استدعاء add(7, 8) يُرجع ناتج 7 + 8 وهو 15.',
        ckb: 'بانگکردنی add(7, 8) ئەنجامی 7 + 8 دەگەڕێنێتەوە کە دەکاتە 15.',
        kmr: 'بانگکرنا add(7, 8) ئەنجامێ 7 + 8 دزڤڕینیت کو دبیتە 15.',
      },
    },
  ],
  [
    'ex-js-fe-1',
    {
      exerciseId: 'ex-js-fe-1',
      lessonId: 'js-2-arrays-dom',
      courseId: 'js',
      type: 'find_error',
      tier: 'free',
      evaluationMethod: 'exact_option',
      correctAnswer: '2',
      explanation: {
        en: 'const variables cannot be reassigned; changing total from const to let fixes the TypeError.',
        ar: 'لا يمكن إعادة إسناد قيمة لمتغير معرّف بـ const؛ تغييره إلى let يحل خطأ TypeError.',
        ckb: 'گۆڕاوی const ناتوانرێت دووبارە بەهای پێ بدرێتەوە؛ گۆڕینی بۆ let هەڵەی TypeError چارەسەر دەکات.',
        kmr: 'گۆڕاوێ const ناهێتە گۆڕین؛ گۆڕینا وێ بۆ let خەلەتیا TypeError چارەسەر دکەت.',
      },
    },
  ],
  [
    'ex-js-cc-1',
    {
      exerciseId: 'ex-js-cc-1',
      lessonId: 'js-3-async-fetch',
      courseId: 'js',
      type: 'complete_code',
      tier: 'pro',
      evaluationMethod: 'sandbox_output',
      correctAnswer: '12,16',
      requiredTokens: ['filter', 'map'],
      explanation: {
        en: 'Filter numbers greater than 5 (6, 8) and double each using map to output 12,16.',
        ar: 'صفّ الأرقام الأكبر من 5 (6 و 8) ثم اضرب كل منها في 2 باستخدام map ليصبح الناتج 12,16.',
        ckb: 'ژمارە گەورەترەکان لە 5 بپاڵێوە (6 و 8) پاشان بە map هەریەکەیان دوو هێندە بکە تا 12,16 دەربچێت.',
        kmr: 'ژمارێن ژ 5 مەزنتر بپالێڤە (6 و 8) پاشی ب map دووجارکی بکە دا 12,16 دەرکەڤیت.',
      },
    },
  ],

  // --- W3SCHOOLS INTERACTIVE EXERCISES ---
  // HTML
  [
    'ex-w3-html-href',
    {
      exerciseId: 'ex-w3-html-href',
      lessonId: 'html-3-links-and-anchors',
      courseId: 'html',
      type: 'fill_blank',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: 'href',
      explanation: {
        en: 'The href attribute specifies the URL of the page the link goes to.',
        ckb: 'سیفەتی href کورتکراوەی Hyperlink Referenceـە و ناونیشانی بەستەر دیاری دەکات.',
        kmr: 'سیفەتێ href ناڤنیشانێ لینکێ دیار دکەت.',
        ar: 'السمة href تحدد عنوان الصفحة التي يشير إليها الرابط.',
      },
    },
  ],
  [
    'ex-w3-html-list',
    {
      exerciseId: 'ex-w3-html-list',
      lessonId: 'html-5-lists-ordered-unordered',
      courseId: 'html',
      type: 'multiple_choice',
      tier: 'free',
      evaluationMethod: 'exact_option',
      correctAnswer: '0',
      explanation: {
        en: '<ol> defines an ordered list (1, 2, 3), while <ul> defines an unordered bulleted list.',
        ckb: '<ol> کورتکراوەی Ordered Listـە بۆ لیستی ژمارەیی، و <ul> بۆ لیستی خاڵبەندییە.',
        kmr: '<ol> بۆ لیستا ژمارەیی دهێتە بکارئینان.',
        ar: '<ol> تعرّف قائمة مرتبة رقمياً و <ul> لقائمة غير مرتبة.',
      },
    },
  ],
  [
    'ex-w3-html-img-closing',
    {
      exerciseId: 'ex-w3-html-img-closing',
      lessonId: 'html-4-images-and-figures',
      courseId: 'html',
      type: 'true_false',
      tier: 'free',
      evaluationMethod: 'boolean',
      correctAnswer: 'false',
      explanation: {
        en: 'False. <img> is a void element in HTML and does not have a closing tag.',
        ckb: 'هەڵەیە. تاگی <img> تاگێکی بەتاڵە و پێویستی بە تاگی داخرانی </img> نییە.',
        kmr: 'شاشە. تاگێ <img> پێدڤی ب تاگێ گرتنێ نینە.',
        ar: 'خطأ. عنصر <img> عنصر فارغ أحادي ولا يحتاج لوسم إغلاق.',
      },
    },
  ],
  [
    'ex-w3-html-table-header',
    {
      exerciseId: 'ex-w3-html-table-header',
      lessonId: 'html-6-tables-and-data',
      courseId: 'html',
      type: 'fill_blank',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: 'th',
      explanation: {
        en: '<th> defines a table header cell.',
        ckb: 'تاگی <th> خانەی سەردێڕی سەرەکی خشتە دیاری دەکات بە شێوازی تۆخ (Bold).',
        kmr: 'تاگێ <th> بۆ خانەیا سەردێڕێ خشتێ یە.',
        ar: 'الوسم <th> يحدد خلية ترويسة الجدول.',
      },
    },
  ],

  // CSS
  [
    'ex-w3-css-color',
    {
      exerciseId: 'ex-w3-css-color',
      lessonId: 'css-3-colors-and-units',
      courseId: 'css',
      type: 'fill_blank',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: 'color',
      explanation: {
        en: 'The color property specifies the color of text.',
        ckb: 'تایبەتمەندی color ڕەنگی نووسین دیاری دەکات.',
        kmr: 'تایبەتمەندیا color ڕەنگێ دەقی دیار دکەت.',
        ar: 'خاصية color تحدد لون النص.',
      },
    },
  ],
  [
    'ex-w3-css-flex',
    {
      exerciseId: 'ex-w3-css-flex',
      lessonId: 'css-4-flexbox-container',
      courseId: 'css',
      type: 'fill_blank',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: 'flex',
      explanation: {
        en: 'display: flex defines a flex container.',
        ckb: 'بەهای flex وا دەکات توخمەکە ببێتە سندوقی نەرمی Flexbox.',
        kmr: 'flex کانتینەرێ نەرم یێ Flexbox چێدکەت.',
        ar: 'القيمة flex تجعل العنصر حاوية مرنة.',
      },
    },
  ],
  [
    'ex-w3-css-boxmodel',
    {
      exerciseId: 'ex-w3-css-boxmodel',
      lessonId: 'css-2-the-box-model',
      courseId: 'css',
      type: 'true_false',
      tier: 'free',
      evaluationMethod: 'boolean',
      correctAnswer: 'true',
      explanation: {
        en: 'True. Padding is inside the border; Margin is outside.',
        ckb: 'ڕاستە. پادینگ لە ناوەوەی چوارچێوەیە و مارجین لە دەرەوەی چوارچێوەیە.',
        kmr: 'ڕاستە. پادینگ ناڤخۆیە و مارجین ژ دەرڤەیە.',
        ar: 'صحيح. الحشوة تكون داخل الإطار والهامش خارجه.',
      },
    },
  ],
  [
    'ex-w3-css-id-selector',
    {
      exerciseId: 'ex-w3-css-id-selector',
      lessonId: 'css-1-selectors-and-specificity',
      courseId: 'css',
      type: 'multiple_choice',
      tier: 'free',
      evaluationMethod: 'exact_option',
      correctAnswer: '0',
      explanation: {
        en: 'The # symbol selects elements by ID (#main-content).',
        ckb: 'هێمای هەشتەگ (#) بۆ دەستنیشانکردنی ئایدی (#main-content) بەکاردێت.',
        kmr: 'هێمایێ # بۆ دەستنیشانکرنا ئایدیێ یە.',
        ar: 'رمز الهاشتاغ # يحدد العناصر بمعرفها ID.',
      },
    },
  ],

  // JavaScript
  [
    'ex-w3-js-get-element',
    {
      exerciseId: 'ex-w3-js-get-element',
      lessonId: 'js-10-dom-selection-querying',
      courseId: 'js',
      type: 'fill_blank',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: 'getElementById',
      explanation: {
        en: 'document.getElementById("demo") finds an element with matching id.',
        ckb: 'میتۆدی getElementById توخمێک بەپێی ئایدییەکەی دەدۆزێتەوە.',
        kmr: 'getElementById توخمی ل دویڤ ئایدیێ پەیدا دکەت.',
        ar: 'الدالة getElementById تجلب العنصر المطابق للمعرف ID.',
      },
    },
  ],
  [
    'ex-w3-js-typeof-array',
    {
      exerciseId: 'ex-w3-js-typeof-array',
      lessonId: 'js-1-variables-and-data-types',
      courseId: 'js',
      type: 'predict_output',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: 'object',
      explanation: {
        en: 'In JavaScript, typeof [] evaluates to "object". Use Array.isArray() to check for arrays.',
        ckb: 'لە جاڤاسکریپتدا، جۆری لیست [] ئۆبجێکتە ("object"). بۆ پشکنینی تایبەت Array.isArray() بەکاردێت.',
        kmr: 'د JavaScript دا جۆرێ لیستێ object ە.',
        ar: 'في جافاسكربت ناتج typeof [] هو "object".',
      },
    },
  ],
  [
    'ex-w3-js-strict-equal',
    {
      exerciseId: 'ex-w3-js-strict-equal',
      lessonId: 'js-2-operators-and-expressions',
      courseId: 'js',
      type: 'true_false',
      tier: 'free',
      evaluationMethod: 'boolean',
      correctAnswer: 'false',
      explanation: {
        en: 'False. 5 is a number and "5" is a string; strict equality === checks both value and type.',
        ckb: 'هەڵەیە. 5 ژمارەیە و "5" دەقە، هێمای سێ یەکسان (===) هەردوو جۆر و بەها بەراورد دەکات.',
        kmr: 'شاشە. 5 ژمارەیە و "5" دەقە، === جۆری ژی بەراورد دکەت.',
        ar: 'خطأ. المعامل === يتحقق من النوع والقيمة، والعدد 5 لا يطابق النص "5".',
      },
    },
  ],

  // Python
  [
    'ex-w3-py-def',
    {
      exerciseId: 'ex-w3-py-def',
      lessonId: 'python-14-functions-and-return',
      courseId: 'python',
      type: 'fill_blank',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: 'def',
      explanation: {
        en: 'The def keyword defines a function in Python.',
        ckb: 'وشەی def لە پایتۆندا بەکاردێت بۆ پێناسەکردنی فانکشن.',
        kmr: 'پەیڤا def بۆ پێناسەکرنا فەنکشنێ یە د پایتۆن دا.',
        ar: 'الكلمة المفتاحية def تعرّف الدوال في بايثون.',
      },
    },
  ],
  [
    'ex-w3-py-append',
    {
      exerciseId: 'ex-w3-py-append',
      lessonId: 'python-8-lists-and-list-methods',
      courseId: 'python',
      type: 'fill_blank',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: 'append',
      explanation: {
        en: 'append() adds an item to the end of a list.',
        ckb: 'میتۆدی append() توخمێکی نوێ دەخاتە کۆتایی لیستەکەوە.',
        kmr: 'append توخمەکی بۆ دوماهیکا لیستێ زێدە دکەت.',
        ar: 'الدالة append تضيف عنصراً لنهاية القائمة.',
      },
    },
  ],
  [
    'ex-w3-py-tuple',
    {
      exerciseId: 'ex-w3-py-tuple',
      lessonId: 'python-10-tuples-and-immutability',
      courseId: 'python',
      type: 'true_false',
      tier: 'free',
      evaluationMethod: 'boolean',
      correctAnswer: 'true',
      explanation: {
        en: 'True. Tuples are immutable in Python.',
        ckb: 'ڕاستە. تووپڵەکان (Tuples) لە پایتۆندا نەگۆڕن.',
        kmr: 'ڕاستە. Tuples د پایتۆن دا نەگوهۆڕن.',
        ar: 'صحيح. الـ Tuples في بايثون غير قابلة للتعديل.',
      },
    },
  ],

  // C++
  [
    'ex-w3-cpp-cout',
    {
      exerciseId: 'ex-w3-cpp-cout',
      lessonId: 'cpp-3-standard-io-cin-cout',
      courseId: 'cpp',
      type: 'fill_blank',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: 'cout',
      explanation: {
        en: 'std::cout is the standard character output stream.',
        ckb: 'std::cout بۆ چاپکردنی زانیاری لەسەر شاشە بەکاردێت.',
        kmr: 'std::cout بۆ چاپکرنێ یە د C++ دا.',
        ar: 'std::cout كائن الإخراج القياسي في C++.',
      },
    },
  ],
  [
    'ex-w3-cpp-pointer',
    {
      exerciseId: 'ex-w3-cpp-pointer',
      lessonId: 'cpp-14-pointers-and-memory-address',
      courseId: 'cpp',
      type: 'multiple_choice',
      tier: 'free',
      evaluationMethod: 'exact_option',
      correctAnswer: '0',
      explanation: {
        en: 'int* ptr declares a pointer to an integer in C++.',
        ckb: 'int* ptr پۆینتەرێک بۆ گۆڕاوی ژمارەیی پێناسە دەکات.',
        kmr: 'int* ptr پۆینتەرەکی پێناسە دکەت.',
        ar: 'int* ptr تعلن عن مؤشر يشير لعدد صحيح.',
      },
    },
  ],

  // React
  [
    'ex-w3-react-usestate',
    {
      exerciseId: 'ex-w3-react-usestate',
      lessonId: 'react-5-usestate-state-hook',
      courseId: 'react',
      type: 'fill_blank',
      tier: 'free',
      evaluationMethod: 'normalized_text',
      correctAnswer: 'useState',
      explanation: {
        en: 'useState is the primary React Hook for component local state.',
        ckb: 'هووکی useState بۆ دروستکردن و بەڕێوەبردنی دۆخی ناوخۆیی کۆمپۆنێنت بەکاردێت.',
        kmr: 'useState هووکێ برێڤەبرنا دەلیڤێ یە د React دا.',
        ar: 'useState هو الخطاف الأساسي لإدارة الحالة في رياكت.',
      },
    },
  ],
  [
    'ex-w3-react-key-prop',
    {
      exerciseId: 'ex-w3-react-key-prop',
      lessonId: 'react-8-lists-and-keys',
      courseId: 'react',
      type: 'multiple_choice',
      tier: 'free',
      evaluationMethod: 'exact_option',
      correctAnswer: '0',
      explanation: {
        en: 'The key prop gives elements a stable identity across renders.',
        ckb: 'سیفەتی key ناسنامەیەکی تایبەت بە هەر توخمێک دەدات تا ڕیاکت بزانێت کامەیان گۆڕاوە.',
        kmr: 'key ناسنامەکا جودا ددەتە هەر توخمەکی.',
        ar: 'خاصية key تمنح العناصر هوية فريدة للمطابقة بكفاءة.',
      },
    },
  ],
]);

export const QUIZ_KEY_VAULT = new Map<string, ServerQuizKey>([
  // Original quizzes
  [
    'quiz-html-lesson-1',
    {
      quizId: 'quiz-html-lesson-1',
      quizType: 'lesson_quiz',
      courseId: 'html',
      difficulty: 'easy',
      tier: 'free',
      questions: [
        {
          id: 'q-h1',
          lessonId: 'html-1-semantic-structure',
          correctOptionIndex: 0,
          explanation: {
            en: '<header> represents introductory content or navigation aids.',
            ar: 'العنصر <header> يمثل المحتوى التمهيدي أو روابط التنقل.',
            ckb: 'توخمی <header> بەشی سەرەتا و لینکەکانی ڕێنمایی پیشان دەدات.',
            kmr: 'توخمێ <header> پشکا دەستپێکێ و لینکێن ڕێنمایێ نیشان ددەت.',
          },
        },
        {
          id: 'q-h2',
          lessonId: 'html-2-forms-accessibility',
          correctOptionIndex: 2,
          explanation: {
            en: 'The alt attribute provides descriptive text when an image fails to load.',
            ar: 'السمة alt توفر نصاً بديلاً وصفياً.',
            ckb: 'تایبەتمەندیی alt دەقی جێگرەوە دابین دەکات بۆ وێنە.',
            kmr: 'تایبەتمەندیا alt دەقێ جێگر دابین دکەت.',
          },
        },
      ],
    },
  ],
  [
    'quiz-html-foundations',
    {
      quizId: 'quiz-html-foundations',
      quizType: 'lesson_quiz',
      courseId: 'html',
      difficulty: 'easy',
      tier: 'free',
      questions: [
        {
          id: 'q-html-1',
          lessonId: 'html-1-semantic-structure',
          correctOptionIndex: 0,
          explanation: {
            en: '<header> represents introductory navigation and headings.',
            ckb: 'توخمی <header> بەشی دەستپێک و شریتی ڕێنمایی لە سەرەوەی لاپەڕە دادەنێت.',
            kmr: 'توخمێ <header> پشکا دەستپێکێ نیشان ددەت.',
            ar: 'العنصر <header> يمثل المحتوى التمهيدي وترويسة الصفحة.',
          },
        },
        {
          id: 'q-html-2',
          lessonId: 'html-1-semantic-structure',
          correctOptionIndex: 1,
          explanation: {
            en: 'The <main> tag should appear only once per page to represent core unique content.',
            ckb: 'تاگی <main> تەنها یەکجار لە لاپەڕەدا دادەنرێت بۆ ناوەڕۆکی سەرەکی.',
            kmr: 'تاگێ <main> بتنێ ئێک جار دهێتە دانان.',
            ar: 'وسم <main> يجب أن يظهر مرة واحدة فقط في الصفحة للمحتوى الأساسي.',
          },
        },
        {
          id: 'q-html-3',
          lessonId: 'html-1-semantic-structure',
          correctOptionIndex: 0,
          explanation: {
            en: '<article> is for self-contained, independently distributable content.',
            ckb: 'تاگی <article> بۆ بابەت و بەشی سەربەخۆیە وەک هەواڵ یان پۆست.',
            kmr: 'تاگێ <article> بۆ بابەتێن سەربەخۆیە.',
            ar: 'وسم <article> مخصص للمحتوى المستقل القابل لإعادة النشر.',
          },
        },
        {
          id: 'q-html-4',
          lessonId: 'html-1-semantic-structure',
          correctOptionIndex: 0,
          explanation: {
            en: '<footer> contains copyright, contact info, and legal notes at page bottom.',
            ckb: 'تاگی <footer> ژێرپێ و زانیاری مافی چاپ و پەیوەندی لە بنی لاپەڕە دەگرێتە خۆ.',
            kmr: 'تاگێ <footer> پشکا ژێرپێ و مافێن چاپێ یە.',
            ar: 'وسم <footer> يتضمن حقوق النشر ومعلومات الاتصال في أسفل الصفحة.',
          },
        },
      ],
    },
  ],

  // --- W3SCHOOLS OFFICIAL QUIZZES ---
  // 1. KARÊJAN Official HTML Quiz
  [
    'quiz-w3-html',
    {
      quizId: 'quiz-w3-html',
      quizType: 'course_exam',
      courseId: 'html',
      difficulty: 'medium',
      tier: 'free',
      timeLimitSeconds: 600,
      questions: [
        {
          id: 'qw3-html-1',
          lessonId: 'html-1-semantic-structure',
          correctOptionIndex: 0,
          explanation: {
            en: 'HTML stands for Hyper Text Markup Language.',
            ckb: 'پیتەکانی HTML کورتکراوەی Hyper Text Markup Languageـە.',
            kmr: 'HTML کورتکرنا Hyper Text Markup Language یە.',
            ar: 'HTML اختصار لـ Hyper Text Markup Language.',
          },
        },
        {
          id: 'qw3-html-2',
          lessonId: 'html-1-semantic-structure',
          correctOptionIndex: 0,
          explanation: {
            en: 'The World Wide Web Consortium (W3C) establishes official Web standards.',
            ckb: 'کۆمەڵەی جیهانی وێب (W3C) ستانداردەکانی تەکنەلۆژیای وێب دادەنێت.',
            kmr: 'کۆمەڵەیا W3C ستانداردێن وێبێ دادئێخیت.',
            ar: 'اتحاد شبكة الويب العالمية (W3C) هو الواضع الرسمي لمعايير الويب.',
          },
        },
        {
          id: 'qw3-html-3',
          lessonId: 'html-2-headings-and-paragraphs',
          correctOptionIndex: 1,
          explanation: {
            en: '<h1> defines the largest heading level in HTML.',
            ckb: 'تاگی <h1> گەورەترین و سەرەکیترین سەردێڕ پیشان دەدات لە وێبدا.',
            kmr: '<h1> مەزنترین سەرنڤیسە.',
            ar: 'الوسم <h1> يعبر عن أعلى وأكبر مستوى للعناوين.',
          },
        },
        {
          id: 'qw3-html-4',
          lessonId: 'html-2-headings-and-paragraphs',
          correctOptionIndex: 1,
          explanation: {
            en: '<br> inserts a single line break in text.',
            ckb: 'تاگی <br> دێڕێکی نوێ (Line Break) دەشکێنێت لەناو دەقدا.',
            kmr: '<br> دێڕەکا نوی چێدکەت.',
            ar: 'الوسم <br> يدرج سطراً جديداً.',
          },
        },
        {
          id: 'qw3-html-5',
          lessonId: 'html-1-semantic-structure',
          correctOptionIndex: 0,
          explanation: {
            en: 'Forward slash (/) indicates an end tag, e.g. </h1> or </p>.',
            ckb: 'هێمای هێڵی لار (/) لە پێش ناوی تاگدا بۆ داخستن بەکاردێت.',
            kmr: 'هێمایێ (/) بۆ تاگێ گرتنێ یە.',
            ar: 'رمز الخط المائل للأمام (/) يُستخدم لإغلاق الوسوم.',
          },
        },
        {
          id: 'qw3-html-6',
          lessonId: 'html-3-links-and-anchors',
          correctOptionIndex: 0,
          explanation: {
            en: 'target="_blank" tells the browser to open the hyperlink in a new tab.',
            ckb: 'سیفەتی target="_blank" وادەکات بەستەرەکە لە تابی نوێی وێبگەڕدا بکرێتەوە.',
            kmr: 'target="_blank" بەستەری د تابەکا نوی دا ڤەدکەت.',
            ar: 'السمة target="_blank" تفتح الرابط في لسان تبويب جديد.',
          },
        },
        {
          id: 'qw3-html-7',
          lessonId: 'html-1-semantic-structure',
          correctOptionIndex: 0,
          explanation: {
            en: '<footer> semantically defines the bottom area of a document or section.',
            ckb: 'تاگی <footer> بەشی بنی لاپەڕە بە شێوازی واتادار دەستنیشان دەکات.',
            kmr: '<footer> پشکا ژێرپێ دیار دکەت.',
            ar: 'الوسم <footer> يحدد تذييل الصفحة دلالياً.',
          },
        },
        {
          id: 'qw3-html-8',
          lessonId: 'html-4-images-and-figures',
          correctOptionIndex: 0,
          explanation: {
            en: 'The alt attribute specifies alternative text for accessibility and broken links.',
            ckb: 'سیفەتی alt دەقی جێگرەوەی وێنە پیشان دەدات گەر وێنەکە دیار نەبوو.',
            kmr: 'alt دەقێ جێگر یێ وێنەیێ یە.',
            ar: 'السمة alt توفر نصاً بديلاً للصورة عند تعذر تحميلها.',
          },
        },
      ],
    },
  ],

  // 2. KARÊJAN Official CSS Quiz
  [
    'quiz-w3-css',
    {
      quizId: 'quiz-w3-css',
      quizType: 'course_exam',
      courseId: 'css',
      difficulty: 'medium',
      tier: 'free',
      timeLimitSeconds: 600,
      questions: [
        {
          id: 'qw3-css-1',
          lessonId: 'css-1-selectors-and-specificity',
          correctOptionIndex: 0,
          explanation: {
            en: 'CSS stands for Cascading Style Sheets.',
            ckb: 'پیتەکانی CSS کورتکراوەی Cascading Style Sheetsـە.',
            kmr: 'CSS کورتکرنا Cascading Style Sheets یە.',
            ar: 'CSS اختصار لـ Cascading Style Sheets.',
          },
        },
        {
          id: 'qw3-css-2',
          lessonId: 'css-1-selectors-and-specificity',
          correctOptionIndex: 0,
          explanation: {
            en: 'External stylesheets are linked inside the <head> element using <link>.',
            ckb: 'فایلی دەرەکی CSS لەناو بەشی <head> بە تاگی <link> دەبەسترێتەوە.',
            kmr: 'فایلێ CSS دناڤ <head> دا دهێتە گرێدان.',
            ar: 'تُربط ملفات CSS الخارجية داخل قسم <head> بواسطة الوسم <link>.',
          },
        },
        {
          id: 'qw3-css-3',
          lessonId: 'css-3-colors-and-units',
          correctOptionIndex: 0,
          explanation: {
            en: 'background-color sets the background color of an element.',
            ckb: 'تایبەتمەندی background-color ڕەنگی پاشبنەمای توخمەکە دەگۆڕێت.',
            kmr: 'background-color ڕەنگێ پاشخانێ دگۆڕیت.',
            ar: 'الخاصية background-color تحدد لون خلفية العنصر.',
          },
        },
        {
          id: 'qw3-css-4',
          lessonId: 'css-3-colors-and-units',
          correctOptionIndex: 0,
          explanation: {
            en: 'font-size controls the size of text.',
            ckb: 'تایبەتمەندی font-size قەبارەی نووسین و فۆنت دیاری دەکات.',
            kmr: 'font-size مەزناهیا فۆنتی دیار دکەت.',
            ar: 'خاصية font-size تتحكم في حجم الخط والنص.',
          },
        },
        {
          id: 'qw3-css-5',
          lessonId: 'css-1-selectors-and-specificity',
          correctOptionIndex: 0,
          explanation: {
            en: 'The dot (.) prefix selects elements by class name.',
            ckb: 'خاڵ (.) لە پێش ناوەکە بۆ دەستنیشانکردنی کلاسی CSS بەکاردێت.',
            kmr: 'نیشانا خالا (.) بۆ دەستنیشانکرنا کلاسا CSS یە.',
            ar: 'النقطة (.) تُستخدم لتحديد العناصر باسم الفئة Class.',
          },
        },
      ],
    },
  ],

  // 3. KARÊJAN Official JavaScript Quiz
  [
    'quiz-w3-js',
    {
      quizId: 'quiz-w3-js',
      quizType: 'course_exam',
      courseId: 'js',
      difficulty: 'medium',
      tier: 'free',
      timeLimitSeconds: 600,
      questions: [
        {
          id: 'qw3-js-1',
          lessonId: 'js-1-variables-and-data-types',
          correctOptionIndex: 0,
          explanation: {
            en: '<script> is the HTML element used to embed JavaScript.',
            ckb: 'کۆدی جاڤاسکریپت لەناو تاگی <script> دادەنرێت لە HTMLدا.',
            kmr: 'کۆدێ JavaScript دناڤ تاگێ <script> دا دهێتە دانان.',
            ar: 'الوسم <script> يُستخدم لتضمين شفرات جافاسكربت في HTML.',
          },
        },
        {
          id: 'qw3-js-2',
          lessonId: 'js-1-variables-and-data-types',
          correctOptionIndex: 0,
          explanation: {
            en: 'alert("text") shows a modal dialog with message and OK button.',
            ckb: 'فەرمانی alert() پەنجەرەیەکی وریاکەرەوە بە بەکارهێنەر پیشان دەدات.',
            kmr: 'alert() پەنجەرەکا هشیاریێ پیشان ددەت.',
            ar: 'الدالة alert() تظهر نافذة تنبيه للمستخدم.',
          },
        },
        {
          id: 'qw3-js-3',
          lessonId: 'js-4-functions-arrow-syntax',
          correctOptionIndex: 0,
          explanation: {
            en: 'function name() is the standard function declaration syntax.',
            ckb: 'بە شێوازی function myFunction() فانکشن لە جاڤاسکریپت پێناسە دەکرێت.',
            kmr: 'ب شێوازێ function myFunction() فەنکشن پێناسە دبیت.',
            ar: 'الصيغة القياسية لتعريف دالة هي function myFunction().',
          },
        },
        {
          id: 'qw3-js-4',
          lessonId: 'js-11-dom-events-and-listeners',
          correctOptionIndex: 0,
          explanation: {
            en: 'onclick fires when the user clicks on an element.',
            ckb: 'ڕووداوی onclick لە کاتی کلیککردن لەسەر توخمەکە کارا دەبێت.',
            kmr: 'onclick دەمێ کلیککرنێ کارا دبیت.',
            ar: 'الحدث onclick يُطلق عند نقر المستخدم على العنصر.',
          },
        },
      ],
    },
  ],

  // 4. KARÊJAN Official Python Quiz
  [
    'quiz-w3-python',
    {
      quizId: 'quiz-w3-python',
      quizType: 'course_exam',
      courseId: 'python',
      difficulty: 'medium',
      tier: 'free',
      timeLimitSeconds: 600,
      questions: [
        {
          id: 'qw3-py-1',
          lessonId: 'python-1-python-intro-and-syntax',
          correctOptionIndex: 0,
          explanation: {
            en: 'print() is the built-in function to print values to stdout.',
            ckb: 'فەنکشنی print() لە پایتۆندا بۆ پیشاندانی دەرئەنجام لەسەر شاشە بەکاردێت.',
            kmr: 'print() بۆ چاپکرنا داتایێ دهێتە بکارئینان.',
            ar: 'الدالة print() تُستخدم لطباعة المخرجات في بايثون.',
          },
        },
        {
          id: 'qw3-py-2',
          lessonId: 'python-1-python-intro-and-syntax',
          correctOptionIndex: 0,
          explanation: {
            en: '# begins a single-line comment in Python.',
            ckb: 'هێمای هەشتەگ (#) بۆ نووسینی سەرنج (Comment) بەکاردێت لە پایتۆندا.',
            kmr: 'هێمایێ # بۆ سەرنجان (Comment) دهێتە بکارئینان.',
            ar: 'رمز الهاشتاغ # يُستخدم لبدء التعليقات في بايثون.',
          },
        },
        {
          id: 'qw3-py-3',
          lessonId: 'python-8-lists-and-list-methods',
          correctOptionIndex: 0,
          explanation: {
            en: 'Lists in Python are ordered, changeable, and allow duplicates.',
            ckb: 'لیستەکان (Lists) لە پایتۆندا ڕیزکراون، دەستکاری دەکرێن و بەهای دووبارە وەردەگرن.',
            kmr: 'لیست د پایتۆن دا ڕێزبەندییە و دهێتە دەستکاریکرن.',
            ar: 'القوائم Lists في بايثون مرتبة وقابلة للتعديل وتسمح بالتكرار.',
          },
        },
      ],
    },
  ],

  // 5. KARÊJAN Official React Quiz
  [
    'quiz-w3-react',
    {
      quizId: 'quiz-w3-react',
      quizType: 'course_exam',
      courseId: 'react',
      difficulty: 'medium',
      tier: 'free',
      timeLimitSeconds: 600,
      questions: [
        {
          id: 'qw3-react-1',
          lessonId: 'react-1-intro-to-react-and-jsx',
          correctOptionIndex: 0,
          explanation: {
            en: 'JSX allows writing HTML-like tags directly in JavaScript.',
            ckb: 'لە JSXدا تاگەکان ڕاستەوخۆ بەبێ کەوانەی نووسین دادەنرێن: const el = <h1>...</h1>;',
            kmr: 'د JSX دا تاگ ڕاستەوخۆ دهێنە دانان.',
            ar: 'JSX يتيح كتابة وسوم شبيهة بـ HTML مباشرة في جافاسكربت.',
          },
        },
        {
          id: 'qw3-react-2',
          lessonId: 'react-4-props-and-data-flow',
          correctOptionIndex: 0,
          explanation: {
            en: 'Props pass read-only data downward through the component tree.',
            ckb: 'پرۆپس (Props) زانیاری لە کۆمپۆنێنتی سەرەوە بۆ کۆمپۆنێنتەکانی خوارەوە دەگوازێتەوە.',
            kmr: 'Props پێزانینان ژ کۆمپۆنێنتێ دایکوبابان بۆ زارۆکان دهنێریت.',
            ar: 'الخصائص Props تمرر البيانات للقراءة فقط من المكون الأب إلى الابن.',
          },
        },
      ],
    },
  ],

  // 6. KARÊJAN Official C++ Quiz
  [
    'quiz-w3-cpp',
    {
      quizId: 'quiz-w3-cpp',
      quizType: 'course_exam',
      courseId: 'cpp',
      difficulty: 'medium',
      tier: 'free',
      timeLimitSeconds: 600,
      questions: [
        {
          id: 'qw3-cpp-1',
          lessonId: 'cpp-3-standard-io-cin-cout',
          correctOptionIndex: 0,
          explanation: {
            en: '<iostream> is the header required for standard input/output streams.',
            ckb: 'فایلی سەردێڕی <iostream> پێویستە بۆ کارکردن لەگەڵ cin و cout.',
            kmr: '<iostream> بۆ cin و cout پێدڤییە.',
            ar: '<iostream> ملف الترويسة القياسي لتيارات الإدخال والإخراج cin و cout.',
          },
        },
        {
          id: 'qw3-cpp-2',
          lessonId: 'cpp-14-pointers-and-memory-address',
          correctOptionIndex: 0,
          explanation: {
            en: 'The & (address-of) operator yields the memory address of a variable.',
            ckb: 'هێمای & ناونیشانی بیرگە (Address)ی گۆڕاوێک دەردەهێنێت لە C++دا.',
            kmr: 'هێمایێ & ناڤنیشانێ بیرگەیێ (Address) دەردئێخیت.',
            ar: 'معامل العنوان & يُرجع عنوان موقع المتغير في الذاكرة.',
          },
        },
      ],
    },
  ],
]);
