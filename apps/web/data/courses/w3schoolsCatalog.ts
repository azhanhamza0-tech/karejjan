import type { PublicExercise, PublicQuiz } from '../../types/domain';

export const W3_INTERACTIVE_EXERCISES: PublicExercise[] = [
  // --- HTML EXERCISES ---
  {
    id: 'ex-w3-html-href',
    lessonId: 'html-3-links-and-anchors',
    courseId: 'html',
    type: 'fill_blank',
    difficulty: 'easy',
    tier: 'free',
    codeSnippet: '<a ________="https://karejan.org">بەستەری کاڕێژان</a>',
    translations: {
      en: {
        prompt: 'Use the correct HTML attribute to specify the destination URL of a link.',
        hint: 'Hyperlink Reference attribute',
      },
      ckb: {
        prompt: 'ئەو سیفەتە (Attribute)یەی HTML بنووسە کە بۆ دیاریکردنی بەستەری ناونیشانی ماڵپەڕ (URL) بەکاردێت لە تاگی <a> دا.',
        hint: 'کورتکراوەی Hyperlink Referenceـە (٤ پیتە)',
      },
      kmr: {
        prompt: 'سیفەتێ ڕاست یێ HTML بنڤیسە بۆ دەستنیشانکرنا بەستەرێ URL د تاگێ <a> دا.',
        hint: 'Hyperlink Reference (٤ پیتە)',
      },
      ar: {
        prompt: 'اكتب السمة الصحيحة لتحديد وجهة الرابط في وسم <a>.',
        hint: 'اختصار Hyperlink Reference',
      },
    },
  },
  {
    id: 'ex-w3-html-list',
    lessonId: 'html-5-lists-ordered-unordered',
    courseId: 'html',
    type: 'multiple_choice',
    difficulty: 'easy',
    tier: 'free',
    translations: {
      en: {
        prompt: 'How can you create a numbered ordered list in HTML?',
        options: ['<ol>', '<ul>', '<dl>', '<list>'],
        hint: 'Ordered List tag',
      },
      ckb: {
        prompt: 'چۆن دەتوانیت لیستێکی ژمارەیی ڕێکخراو (Ordered List: 1, 2, 3...) دروست بکەیت لە HTMLدا؟',
        options: ['<ol>', '<ul>', '<dl>', '<list>'],
        hint: 'کورتکراوەی Ordered List',
      },
      kmr: {
        prompt: 'چەوا دکاری لیستەکا ژمارەیی یا ڕێکخستی د HTML دا چێکەی؟',
        options: ['<ol>', '<ul>', '<dl>', '<list>'],
        hint: 'Ordered List',
      },
      ar: {
        prompt: 'كيف تنشئ قائمة مرقمة ومرتبة في HTML؟',
        options: ['<ol>', '<ul>', '<dl>', '<list>'],
        hint: 'Ordered List',
      },
    },
  },
  {
    id: 'ex-w3-html-img-closing',
    lessonId: 'html-4-images-and-figures',
    courseId: 'html',
    type: 'true_false',
    difficulty: 'easy',
    tier: 'free',
    translations: {
      en: {
        prompt: 'True or False: The <img> element in HTML requires an explicit closing tag </img>.',
        options: ['True', 'False'],
        hint: '<img> is an empty/void self-closing element.',
      },
      ckb: {
        prompt: 'ڕاستە یان هەڵە: لە HTMLدا تاگی وێنە <img> پێویستی بە تاگی داخرانی </img> هەیە بە جیا.',
        options: ['ڕاستە', 'هەڵەیە'],
        hint: 'تاگی <img> تاگێکی بەتاڵە (Void element) و بە تەنیا دادەنرێت.',
      },
      kmr: {
        prompt: 'ڕاستە یان شاشە: تاگێ وێنەیێ <img> پێدڤی ب تاگێ داگریێ </img> هەیە.',
        options: ['ڕاستە', 'شاشە'],
        hint: '<img> توخمەکێ بەتالە (Void).',
      },
      ar: {
        prompt: 'صح أم خطأ: عنصر الصورة <img> يتطلب وسم إغلاق منفصل </img>.',
        options: ['صح', 'خطأ'],
        hint: 'عنصر <img> من العناصر الفارغة أحادية الوسم.',
      },
    },
  },
  {
    id: 'ex-w3-html-table-header',
    lessonId: 'html-6-tables-and-data',
    courseId: 'html',
    type: 'fill_blank',
    difficulty: 'easy',
    tier: 'free',
    codeSnippet: '<table>\n  <tr>\n    <________>ناوی وانە</________>\n  </tr>\n</table>',
    translations: {
      en: {
        prompt: 'Which HTML element defines a table header cell with bold centered text?',
        hint: 'Table Header',
      },
      ckb: {
        prompt: 'ئەو تاگەی HTML بنووسە کە بۆ خانەی سەردێڕی سەرەکی خشتە (Table Header) بەکاردێت.',
        hint: 'کورتکراوەی Table Header (دوو پیتە)',
      },
      kmr: {
        prompt: 'ئەو تاگێ HTML بنڤیسە یێ دهێتە بکارئینان بۆ سەردێڕێ خشتەیێ.',
        hint: 'Table Header (دوو پیتە)',
      },
      ar: {
        prompt: 'اكتب اسم الوسم الذي يحدد خلية ترويسة الجدول في HTML.',
        hint: 'Table Header',
      },
    },
  },

  // --- CSS EXERCISES ---
  {
    id: 'ex-w3-css-color',
    lessonId: 'css-3-colors-and-units',
    courseId: 'css',
    type: 'fill_blank',
    difficulty: 'easy',
    tier: 'free',
    codeSnippet: 'h1 {\n  ________: red;\n}',
    translations: {
      en: {
        prompt: 'Set the text color of the <h1> element to red.',
        hint: 'CSS text color property',
      },
      ckb: {
        prompt: 'ناوی ئەو تایبەتمەندییە (Property)یەی CSS بنووسە کە بۆ گۆڕینی ڕەنگی نووسین لە <h1>دا بەکاردێت بۆ سوور.',
        hint: 'تایبەتمەندی ڕەنگ (Color)',
      },
      kmr: {
        prompt: 'تایبەتمەندیا CSS بنڤیسە بۆ گوهۆڕینا ڕەنگێ دەقی بۆ سوور.',
        hint: 'Color',
      },
      ar: {
        prompt: 'اكتب خاصية CSS لتغيير لون النص إلى الأحمر في عنصر <h1>.',
        hint: 'خاصية لون النص',
      },
    },
  },
  {
    id: 'ex-w3-css-flex',
    lessonId: 'css-4-flexbox-container',
    courseId: 'css',
    type: 'fill_blank',
    difficulty: 'easy',
    tier: 'free',
    codeSnippet: '.container {\n  display: ________;\n}',
    translations: {
      en: {
        prompt: 'Make the .container element a flexible layout container.',
        hint: 'Flexible Box value',
      },
      ckb: {
        prompt: 'بەهای تایبەتمەندی display بنووسە بۆ ئەوەی .container ببێتە سندوقێکی نەرم و چالاکی Flexbox.',
        hint: 'وشەی flex',
      },
      kmr: {
        prompt: 'بهایێ display بنڤیسە دا کو ببتە کانتینەرەکێ Flexbox.',
        hint: 'flex',
      },
      ar: {
        prompt: 'اكتب قيمة display المناسبة لجعل العنصر حاوية مرنة بنظام Flexbox.',
        hint: 'flex',
      },
    },
  },
  {
    id: 'ex-w3-css-boxmodel',
    lessonId: 'css-2-the-box-model',
    courseId: 'css',
    type: 'true_false',
    difficulty: 'easy',
    tier: 'free',
    translations: {
      en: {
        prompt: 'True or False: In the CSS Box Model, Padding is the transparent space INSIDE the border, while Margin is space OUTSIDE the border.',
        options: ['True', 'False'],
        hint: 'Padding pushes inward from the border; margin pushes other elements away.',
      },
      ckb: {
        prompt: 'ڕاستە یان هەڵە: لە مۆدێلی سندوقی CSS (Box Model)دا، Padding مەودای ناوەوەی چوارچێوەیە، بەڵام Margin مەودای دەرەوەی چوارچێوەیە.',
        options: ['ڕاستە', 'هەڵەیە'],
        hint: 'پادینگ لە ناوەوەیە و مارجین لە دەرەوەیە.',
      },
      kmr: {
        prompt: 'ڕاستە یان شاشە: د CSS Box Model دا، Padding مەودایا ناڤخۆیە و Margin مەودایا دەرڤەیە.',
        options: ['ڕاستە', 'شاشە'],
        hint: 'پادینگ ناڤخۆ، مارجین ژ دەرڤە.',
      },
      ar: {
        prompt: 'صح أم خطأ: في نموذج الصندوق CSS، الحشوة Padding تكون داخل الإطار بينما الهامش Margin يكون خارجه.',
        options: ['صح', 'خطأ'],
        hint: 'الحشوة داخلية والهامش خارجي.',
      },
    },
  },
  {
    id: 'ex-w3-css-id-selector',
    lessonId: 'css-1-selectors-and-specificity',
    courseId: 'css',
    type: 'multiple_choice',
    difficulty: 'easy',
    tier: 'free',
    translations: {
      en: {
        prompt: 'Which CSS selector symbol selects an element with id="main-content"?',
        options: ['#main-content', '.main-content', '*main-content', '@main-content'],
        hint: 'Hash/Pound symbol for IDs',
      },
      ckb: {
        prompt: 'کام هێمایە لە CSSدا بۆ دیاریکردنی توخمێک بەپێی ئایدی (id="main-content") بەکاردێت؟',
        options: ['#main-content', '.main-content', '*main-content', '@main-content'],
        hint: 'هێمای هەشتەگ (#)',
      },
      kmr: {
        prompt: 'کیژ هێما د CSS دا بۆ دەستنیشانکرنا توخمەکی ب ئایدیێ (id="main-content") دهێتە بکارئینان؟',
        options: ['#main-content', '.main-content', '*main-content', '@main-content'],
        hint: 'هێمایێ #',
      },
      ar: {
        prompt: 'ما هو الرمز المستخدم في CSS لاختيار عنصر حسب المعرف id="main-content"؟',
        options: ['#main-content', '.main-content', '*main-content', '@main-content'],
        hint: 'رمز الهاشتاغ #',
      },
    },
  },

  // --- JAVASCRIPT EXERCISES ---
  {
    id: 'ex-w3-js-get-element',
    lessonId: 'js-10-dom-selection-querying',
    courseId: 'js',
    type: 'fill_blank',
    difficulty: 'easy',
    tier: 'free',
    codeSnippet: 'const el = document.________("demo");',
    translations: {
      en: {
        prompt: 'Fill in the method to select an HTML element by its ID "demo".',
        hint: 'getElementById',
      },
      ckb: {
        prompt: 'ناوی ئەو میتۆدە کلاسیکییەی DOM بنووسە کە بەکاردێت بۆ دەرهێنانی توخمێک لە ڕێگەی ئایدییەکەیەوە.',
        hint: 'وشەی getElementById (ئاگاداری پیتە گەورە و بچووکەکان بە)',
      },
      kmr: {
        prompt: 'میتۆدێ DOM بنڤیسە بۆ دەستنیشانکرنا توخمەکی ب ڕێکا ئایدیێ.',
        hint: 'getElementById',
      },
      ar: {
        prompt: 'أكمل دالة DOM المستخدمة لتحديد عنصر HTML من خلال المعرف ID الخاص به.',
        hint: 'getElementById',
      },
    },
  },
  {
    id: 'ex-w3-js-typeof-array',
    lessonId: 'js-1-variables-and-data-types',
    courseId: 'js',
    type: 'predict_output',
    difficulty: 'easy',
    tier: 'free',
    codeSnippet: 'console.log(typeof [1, 2, 3]);',
    translations: {
      en: {
        prompt: 'What will be printed to the console in JavaScript?',
        hint: 'Arrays are objects under the hood.',
      },
      ckb: {
        prompt: 'چی لە کۆنسۆڵی جاڤاسکریپتدا چاپ دەبێت بە فەرمانی typeof [1, 2, 3]؟',
        hint: 'لە جاڤاسکریپتدا، ئارەی (لیست) لەژێرەوە وەک ئۆبجێکت پێناسە کراوە.',
      },
      kmr: {
        prompt: 'چ دێ هێتە چاپکرن د کۆنسۆڵێ دا بۆ typeof [1, 2, 3]؟',
        hint: 'object',
      },
      ar: {
        prompt: 'ما هي القيمة المطبوعة في وحدة التحكم console لـ typeof [1, 2, 3]؟',
        hint: 'المصفوفات كائنات في باطن جافاسكربت',
      },
    },
  },
  {
    id: 'ex-w3-js-strict-equal',
    lessonId: 'js-2-operators-and-expressions',
    courseId: 'js',
    type: 'true_false',
    difficulty: 'easy',
    tier: 'free',
    translations: {
      en: {
        prompt: 'True or False: In JavaScript, 5 === "5" evaluates to true.',
        options: ['True', 'False'],
        hint: 'Strict equality (===) compares both value and type without coercion.',
      },
      ckb: {
        prompt: 'ڕاستە یان هەڵە: لە جاڤاسکریپتدا هاوکێشەی (5 === "5") ئەنجامەکەی دەبێتە true.',
        options: ['ڕاستە', 'هەڵەیە'],
        hint: 'هێمای سێ یەکسان (===) بەراوردی جۆری داتاش دەکات، ژمارە و دەق وەک یەک نین!',
      },
      kmr: {
        prompt: 'ڕاستە یان شاشە: د JavaScript دا (5 === "5") دبیتە true.',
        options: ['ڕاستە', 'شاشە'],
        hint: '=== جۆرێ داتایێ ژی بەراورد دکەت.',
      },
      ar: {
        prompt: 'صح أم خطأ: في جافاسكربت التعبير 5 === "5" ينتج true.',
        options: ['صح', 'خطأ'],
        hint: 'المعامل === يتحقق من القيمة والنوع معاً دون تحويل.',
      },
    },
  },

  // --- PYTHON EXERCISES ---
  {
    id: 'ex-w3-py-def',
    lessonId: 'python-14-functions-and-return',
    courseId: 'python',
    type: 'fill_blank',
    difficulty: 'easy',
    tier: 'free',
    codeSnippet: '________ greet_user(name):\n    return f"Hello, {name}!"',
    translations: {
      en: {
        prompt: 'Which keyword is used to declare and define a function in Python?',
        hint: '3 letters keyword',
      },
      ckb: {
        prompt: 'کام وشەی کلیل لە پایتۆندا بەکاردێت بۆ دروستکردن و پێناسەکردنی فانکشن؟',
        hint: 'وشەی def (٣ پیتە)',
      },
      kmr: {
        prompt: 'کیژ پەیڤا سەرەکی د پایتۆن دا بۆ پێناسەکرنا فەنکشنێ دهێتە بکارئینان؟',
        hint: 'def',
      },
      ar: {
        prompt: 'ما هي الكلمة المفتاحية المستخدمة لتعريف دالة في بايثون؟',
        hint: 'def',
      },
    },
  },
  {
    id: 'ex-w3-py-append',
    lessonId: 'python-8-lists-and-list-methods',
    courseId: 'python',
    type: 'fill_blank',
    difficulty: 'easy',
    tier: 'free',
    codeSnippet: 'fruits = ["apple", "banana"]\nfruits.________("orange")',
    translations: {
      en: {
        prompt: 'Which list method adds a single element to the end of a list in Python?',
        hint: 'append method',
      },
      ckb: {
        prompt: 'ناوی ئەو میتۆدەی پایتۆن بنووسە کە بەشێکی نوێ دەخاتە کۆتایی لیستێکەوە.',
        hint: 'وشەی append',
      },
      kmr: {
        prompt: 'میتۆدێ پایتۆن بنڤیسە بۆ زێدەکرنا توخمەکی بۆ دوماهیکا لیستێ.',
        hint: 'append',
      },
      ar: {
        prompt: 'ما هي الدالة المستخدمة لإضافة عنصر جديد إلى نهاية القائمة في بايثون؟',
        hint: 'append',
      },
    },
  },
  {
    id: 'ex-w3-py-tuple',
    lessonId: 'python-10-tuples-and-immutability',
    courseId: 'python',
    type: 'true_false',
    difficulty: 'easy',
    tier: 'free',
    translations: {
      en: {
        prompt: 'True or False: In Python, Tuples are immutable and cannot be changed after creation.',
        options: ['True', 'False'],
        hint: 'Tuples are read-only sequences, unlike lists.',
      },
      ckb: {
        prompt: 'ڕاستە یان هەڵە: لە پایتۆندا، تووپڵەکان (Tuples) نەگۆڕن و ناتوانرێت دوای دروستکردن دەستکاری بکرێن.',
        options: ['ڕاستە', 'هەڵەیە'],
        hint: 'تووپڵەکان بە کەوانەی خڕ () دروست دەکرێن و نەگۆڕن.',
      },
      kmr: {
        prompt: 'ڕاستە یان شاشە: د پایتۆن دا Tuples نەگوهۆڕن.',
        options: ['ڕاستە', 'شاشە'],
        hint: 'Tuples نەگوهۆڕن.',
      },
      ar: {
        prompt: 'صح أم خطأ: في بايثون، الصفوف Tuples غير قابلة للتعديل بعد إنشائها.',
        options: ['صح', 'خطأ'],
        hint: 'Tuples غير قابلة للتعديل (Immutable).',
      },
    },
  },

  // --- C++ EXERCISES ---
  {
    id: 'ex-w3-cpp-cout',
    lessonId: 'cpp-3-standard-io-cin-cout',
    courseId: 'cpp',
    type: 'fill_blank',
    difficulty: 'easy',
    tier: 'free',
    codeSnippet: '#include <iostream>\nint main() {\n  std::________ << "Hello, Karejan!";\n  return 0;\n}',
    translations: {
      en: {
        prompt: 'Which standard stream object is used to output text to the console in C++?',
        hint: 'Character Output (cout)',
      },
      ckb: {
        prompt: 'ناوی ئەو ئۆبجێکتە ستانداردەی C++ بنووسە کە لەگەڵ << بەکاردێت بۆ چاپکردنی نووسین لەسەر شاشە.',
        hint: 'وشەی cout (کورتکراوەی Character Output)',
      },
      kmr: {
        prompt: 'ئۆبجێکتێ ستاندارد یێ C++ بنڤیسە بۆ چاپکرنا دەقی لسەر شاشێ.',
        hint: 'cout',
      },
      ar: {
        prompt: 'اكتب الكائن القياسي في C++ المستخدم لطباعة النصوص على الشاشة مع المعامل <<.',
        hint: 'cout',
      },
    },
  },
  {
    id: 'ex-w3-cpp-pointer',
    lessonId: 'cpp-14-pointers-and-memory-address',
    courseId: 'cpp',
    type: 'multiple_choice',
    difficulty: 'easy',
    tier: 'free',
    translations: {
      en: {
        prompt: 'How do you declare a pointer variable pointing to an integer in C++?',
        options: ['int* ptr;', 'int &ptr;', 'pointer<int> ptr;', 'int ptr*;'],
        hint: 'Asterisk (*) indicates a pointer.',
      },
      ckb: {
        prompt: 'چۆن پۆینتەرێک (Pointer) پێناسە دەکەیت لە زمانی C++ کە ئاماژە بە ژمارەیەکی تەواو (Integer) بکات؟',
        options: ['int* ptr;', 'int &ptr;', 'pointer<int> ptr;', 'int ptr*;'],
        hint: 'ئەستێرە (*) لە تەنیشت جۆری داتاکە دادەنرێت.',
      },
      kmr: {
        prompt: 'چەوا پۆینتەرەکی پێناسە دکەی د C++ دا؟',
        options: ['int* ptr;', 'int &ptr;', 'pointer<int> ptr;', 'int ptr*;'],
        hint: 'int* ptr;',
      },
      ar: {
        prompt: 'كيف تعلن عن متغير مؤشر Pointer يشير إلى عدد صحيح في C++؟',
        options: ['int* ptr;', 'int &ptr;', 'pointer<int> ptr;', 'int ptr*;'],
        hint: 'رمز النجمة * مع النوع',
      },
    },
  },

  // --- REACT EXERCISES ---
  {
    id: 'ex-w3-react-usestate',
    lessonId: 'react-5-usestate-state-hook',
    courseId: 'react',
    type: 'fill_blank',
    difficulty: 'easy',
    tier: 'free',
    codeSnippet: 'import { ________ } from "react";\nconst [score, setScore] = ________(0);',
    translations: {
      en: {
        prompt: 'Which built-in React Hook adds state variables to a functional component?',
        hint: 'useState',
      },
      ckb: {
        prompt: 'ناوی ئەو هوکە بەناوبانگەی ڕیاکت بنووسە کە بۆ بەڕێوەبردنی دۆخ (State) لە کۆمپۆنێنتدا بەکاردێت.',
        hint: 'هووکی useState',
      },
      kmr: {
        prompt: 'هووکێ فەرمی یێ React بنڤیسە بۆ برێڤەبرنا دەلیڤێ (State).',
        hint: 'useState',
      },
      ar: {
        prompt: 'اكتب اسم الخطاف الأساسي في React المستخدم لإضافة حالة تفاعلية للمكون.',
        hint: 'useState',
      },
    },
  },
  {
    id: 'ex-w3-react-key-prop',
    lessonId: 'react-8-lists-and-keys',
    courseId: 'react',
    type: 'multiple_choice',
    difficulty: 'easy',
    tier: 'free',
    translations: {
      en: {
        prompt: 'When rendering a list of elements using .map(), which special prop must be provided to each item?',
        options: ['key', 'id', 'index', 'ref'],
        hint: 'React uses "key" to identify which items have changed, added, or removed.',
      },
      ckb: {
        prompt: 'لە کاتی پیشاندانی لیستێک لە ڕیاکت بە بەکارهێنانی .map()، کام تایبەتمەندییە تایبەتە پێویستە بۆ هەموو توخمێک دابنرێت؟',
        options: ['key', 'id', 'index', 'ref'],
        hint: 'تایبەتمەندیی key',
      },
      kmr: {
        prompt: 'دەمێ لیستەکێ د React دا ب .map() نیشان ددەی، کیژ پرۆپ پێدڤییە بۆ هەر توخمەکی؟',
        options: ['key', 'id', 'index', 'ref'],
        hint: 'key',
      },
      ar: {
        prompt: 'عند تصيير قائمة عناصر في React بواسطة .map()، ما هي الخاصية الفريدة المطلوبة لكل عنصر؟',
        options: ['key', 'id', 'index', 'ref'],
        hint: 'خاصية key المميزة',
      },
    },
  },
];

export const W3_OFFICIAL_QUIZZES: PublicQuiz[] = [
  // 1. KARÊJAN Official HTML Quiz
  {
    id: 'quiz-w3-html',
    quizType: 'course_exam',
    courseId: 'html',
    difficulty: 'medium',
    tier: 'free',
    timeLimitSeconds: 600,
    titles: {
      en: 'KARÊJAN Official HTML Certification Exam',
      ckb: 'تاقیکردنەوەی فەرمی و پێشکەوتووی HTML (ستانداردی کاڕێژان)',
      kmr: 'تاقیکرنا فەرمی و پێشکەفتی یا HTML (ستانداردێ کارێژان)',
      ar: 'اختبار شهادة HTML الرسمي الشامل (منهاج كاريزان)',
    },
    questions: [
      {
        id: 'qw3-html-1',
        translations: {
          en: {
            prompt: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Manipulation Language',
              'High Tech Machine Language',
            ],
          },
          ckb: {
            prompt: 'پیتەکانی HTML کورتکراوەی چییە؟',
            options: [
              'Hyper Text Markup Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Manipulation Language',
              'High Tech Machine Language',
            ],
          },
          kmr: {
            prompt: 'پیتێن HTML کورتکرنا چ تشتینە؟',
            options: [
              'Hyper Text Markup Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Manipulation Language',
              'High Tech Machine Language',
            ],
          },
          ar: {
            prompt: 'ما هو المعنى الكامل لاختصار HTML؟',
            options: [
              'Hyper Text Markup Language',
              'Home Tool Markup Language',
              'Hyperlinks and Text Manipulation Language',
              'High Tech Machine Language',
            ],
          },
        },
      },
      {
        id: 'qw3-html-2',
        translations: {
          en: {
            prompt: 'Who is making the Web standards?',
            options: [
              'The World Wide Web Consortium (W3C)',
              'Google and Mozilla',
              'Microsoft Corporation',
              'Apple Developer Alliance',
            ],
          },
          ckb: {
            prompt: 'کێ ستاندارد و پێوەرەکانی وێب دادەنێت؟',
            options: [
              'کۆمەڵەی جیهانی وێب (W3C)',
              'گووگڵ و مۆزیلا',
              'کۆمپانیای مایکرۆسۆفت',
              'کۆمپانیای ئەپڵ',
            ],
          },
          kmr: {
            prompt: 'کی ستانداردێن وێبێ دادئێخیت؟',
            options: [
              'کۆمەڵەیا جیهانی یا وێبێ (W3C)',
              'گووگڵ و مۆزیلا',
              'مایکرۆسۆفت',
              'ئەپڵ',
            ],
          },
          ar: {
            prompt: 'من هي الجهة المسؤولة عن وضع معايير الويب العالمية؟',
            options: [
              'اتحاد شبكة الويب العالمية (W3C)',
              'جوجل وموزيلا',
              'شركة مايكروسوفت',
              'شركة أبل',
            ],
          },
        },
      },
      {
        id: 'qw3-html-3',
        translations: {
          en: {
            prompt: 'Choose the correct HTML element for the largest heading:',
            options: ['<h6>', '<h1>', '<heading>', '<head>'],
          },
          ckb: {
            prompt: 'کام تاگ لەمانەی خوارەوە گەورەترین سەردێڕ پیشان دەدات لە وێبدا؟',
            options: ['<h6>', '<h1>', '<heading>', '<head>'],
          },
          kmr: {
            prompt: 'کیژ تاگ مەزنترین سەرنڤیس نیشان ددەت د وێبێ دا؟',
            options: ['<h6>', '<h1>', '<heading>', '<head>'],
          },
          ar: {
            prompt: 'اختر وسم HTML الصحيح لأكبر عنوان رئيسي:',
            options: ['<h6>', '<h1>', '<heading>', '<head>'],
          },
        },
      },
      {
        id: 'qw3-html-4',
        translations: {
          en: {
            prompt: 'What is the correct HTML element for inserting a line break?',
            options: ['<break>', '<br>', '<lb>', '<newline>'],
          },
          ckb: {
            prompt: 'تاگی دروست لە HTMLدا بۆ دابەزین بۆ دێڕی نوێ (Line Break) کامەیە؟',
            options: ['<break>', '<br>', '<lb>', '<newline>'],
          },
          kmr: {
            prompt: 'تاگێ ڕاست د HTML دا بۆ دێڕەکا نوی کیژە؟',
            options: ['<break>', '<br>', '<lb>', '<newline>'],
          },
          ar: {
            prompt: 'ما هو الوسم الصحيح لإدراج سطر جديد في HTML؟',
            options: ['<break>', '<br>', '<lb>', '<newline>'],
          },
        },
      },
      {
        id: 'qw3-html-5',
        translations: {
          en: {
            prompt: 'Which character is used to indicate an end/closing tag?',
            options: ['/', '<', '*', '^'],
          },
          ckb: {
            prompt: 'کام هێما بەکاردێت لە دەستپێکی تاگی داخراندا وەک </p>؟',
            options: ['/', '<', '*', '^'],
          },
          kmr: {
            prompt: 'کیژ نیشان دهێتە بکارئینان بۆ تاگێ گرتنێ؟',
            options: ['/', '<', '*', '^'],
          },
          ar: {
            prompt: 'أي رمز يُستخدم للإشارة إلى إغلاق الوسم؟',
            options: ['/', '<', '*', '^'],
          },
        },
      },
      {
        id: 'qw3-html-6',
        translations: {
          en: {
            prompt: 'How can you open a hyperlink in a new browser tab or window?',
            options: [
              '<a href="url" target="_blank">',
              '<a href="url" new>',
              '<a href="url" target="new">',
              '<a href="url" window="blank">',
            ],
          },
          ckb: {
            prompt: 'چۆن دەتوانیت وای لێبکەیت بەستەرێک لە پەنجەرە یان تابی نوێدا بکرێتەوە؟',
            options: [
              '<a href="url" target="_blank">',
              '<a href="url" new>',
              '<a href="url" target="new">',
              '<a href="url" window="blank">',
            ],
          },
          kmr: {
            prompt: 'چەوا بەستەرەکی د تابەکا نوی دا ڤەدکەی؟',
            options: [
              '<a href="url" target="_blank">',
              '<a href="url" new>',
              '<a href="url" target="new">',
              '<a href="url" window="blank">',
            ],
          },
          ar: {
            prompt: 'كيف يمكنك فتح رابط في لسان تبويب أو نافذة جديدة بالمتصفح؟',
            options: [
              '<a href="url" target="_blank">',
              '<a href="url" new>',
              '<a href="url" target="new">',
              '<a href="url" window="blank">',
            ],
          },
        },
      },
      {
        id: 'qw3-html-7',
        translations: {
          en: {
            prompt: 'Which HTML element is used to specify a footer for a document or section?',
            options: ['<footer>', '<bottom>', '<section-end>', '<foot>'],
          },
          ckb: {
            prompt: 'کام تاگی واتاداری HTML بەکاردێت بۆ دانانی بەشی کۆتایی و ژێرپێی ماڵپەڕ؟',
            options: ['<footer>', '<bottom>', '<section-end>', '<foot>'],
          },
          kmr: {
            prompt: 'کیژ تاگ دهێتە بکارئینان بۆ دوماهیکا لاپەڕێ (ژێرپێ)؟',
            options: ['<footer>', '<bottom>', '<section-end>', '<foot>'],
          },
          ar: {
            prompt: 'أي عنصر HTML دلالي يُستخدم لتحديد تذييل المستند أو الصفحة؟',
            options: ['<footer>', '<bottom>', '<section-end>', '<foot>'],
          },
        },
      },
      {
        id: 'qw3-html-8',
        translations: {
          en: {
            prompt: 'Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?',
            options: ['alt', 'title', 'src', 'description'],
          },
          ckb: {
            prompt: 'کام سیفەت لە تاگی وێنەدا بەکاردێت بۆ دانانی دەقی جێگرەوە کاتێک وێنەکە ناکرێتەوە؟',
            options: ['alt', 'title', 'src', 'description'],
          },
          kmr: {
            prompt: 'کیژ سیفەت بۆ دەقێ جهگر دهێتە دانان دەمێ وێنە ڤەنەبیت؟',
            options: ['alt', 'title', 'src', 'description'],
          },
          ar: {
            prompt: 'ما هي السمة المستخدمة لتحديد نص بديل للصورة في حال تعذر عرضها؟',
            options: ['alt', 'title', 'src', 'description'],
          },
        },
      },
    ],
  },

  // 2. KARÊJAN Official CSS Quiz
  {
    id: 'quiz-w3-css',
    quizType: 'course_exam',
    courseId: 'css',
    difficulty: 'medium',
    tier: 'free',
    timeLimitSeconds: 600,
    titles: {
      en: 'KARÊJAN Official CSS Certification Exam',
      ckb: 'تاقیکردنەوەی فەرمی و پێشکەوتووی CSS (ستانداردی کاڕێژان)',
      kmr: 'تاقیکرنا فەرمی و پێشکەفتی یا CSS (ستانداردێ کارێژان)',
      ar: 'اختبار شهادة CSS الرسمي الشامل (منهاج كاريزان)',
    },
    questions: [
      {
        id: 'qw3-css-1',
        translations: {
          en: {
            prompt: 'What does CSS stand for?',
            options: [
              'Cascading Style Sheets',
              'Creative Style Systems',
              'Computer Style Sheets',
              'Colorful Style Sheets',
            ],
          },
          ckb: {
            prompt: 'پیتەکانی CSS کورتکراوەی چییە؟',
            options: [
              'Cascading Style Sheets',
              'Creative Style Systems',
              'Computer Style Sheets',
              'Colorful Style Sheets',
            ],
          },
          kmr: {
            prompt: 'پیتێن CSS کورتکرنا چ تشتینە؟',
            options: [
              'Cascading Style Sheets',
              'Creative Style Systems',
              'Computer Style Sheets',
              'Colorful Style Sheets',
            ],
          },
          ar: {
            prompt: 'ما هو المعنى الكامل لاختصار CSS؟',
            options: [
              'Cascading Style Sheets',
              'Creative Style Systems',
              'Computer Style Sheets',
              'Colorful Style Sheets',
            ],
          },
        },
      },
      {
        id: 'qw3-css-2',
        translations: {
          en: {
            prompt: 'Where in an HTML document is the correct place to refer to an external style sheet?',
            options: [
              'In the <head> section',
              'In the <body> section',
              'At the very end of the file',
              'Inside a <div> tag',
            ],
          },
          ckb: {
            prompt: 'شوێنی دروست بۆ بەستنەوەی فایلی دەرەکی CSS لە کوێی پەڕەی HTMLدایە؟',
            options: [
              'لە بەشی <head>دا',
              'لە بەشی <body>دا',
              'لە کۆتایی فایلی HTML',
              'لەناو تاگی <div>دا',
            ],
          },
          kmr: {
            prompt: 'جهێ ڕاست بۆ گرێدانا فایلی دەرەکی یێ CSS کیژە؟',
            options: [
              'د پشکا <head> دا',
              'د پشکا <body> دا',
              'ل دوماهیکا فایلێ',
              'دناڤ تاگێ <div> دا',
            ],
          },
          ar: {
            prompt: 'أين هو المكان الصحيح لربط ملف CSS خارجي في مستند HTML؟',
            options: [
              'داخل قسم الترويسة <head>',
              'داخل قسم الجسم <body>',
              'في نهاية الملف تماماً',
              'داخل وسم <div>',
            ],
          },
        },
      },
      {
        id: 'qw3-css-3',
        translations: {
          en: {
            prompt: 'Which CSS property is used to change the background color of an element?',
            options: ['background-color', 'color', 'bgcolor', 'surface-fill'],
          },
          ckb: {
            prompt: 'کام تایبەتمەندیی CSS بەکاردێت بۆ گۆڕینی ڕەنگی پاشبنەمای توخمێک؟',
            options: ['background-color', 'color', 'bgcolor', 'surface-fill'],
          },
          kmr: {
            prompt: 'کیژ تایبەتمەندی دهێتە بکارئینان بۆ گوهۆڕینا ڕەنگێ پاشخانێ؟',
            options: ['background-color', 'color', 'bgcolor', 'surface-fill'],
          },
          ar: {
            prompt: 'ما هي الخاصية المستخدمة لتغيير لون خلفية العنصر في CSS؟',
            options: ['background-color', 'color', 'bgcolor', 'surface-fill'],
          },
        },
      },
      {
        id: 'qw3-css-4',
        translations: {
          en: {
            prompt: 'Which CSS property controls the text size?',
            options: ['font-size', 'text-size', 'font-style', 'text-style'],
          },
          ckb: {
            prompt: 'کام تایبەتمەندی قەبارەی فۆنت و دەق دیاری دەکات لە CSSدا؟',
            options: ['font-size', 'text-size', 'font-style', 'text-style'],
          },
          kmr: {
            prompt: 'کیژ تایبەتمەندی مەزناهیا فۆنتی دیار دکەت؟',
            options: ['font-size', 'text-size', 'font-style', 'text-style'],
          },
          ar: {
            prompt: 'أي خاصية CSS تتحكم في حجم الخط والنص؟',
            options: ['font-size', 'text-size', 'font-style', 'text-style'],
          },
        },
      },
      {
        id: 'qw3-css-5',
        translations: {
          en: {
            prompt: 'How do you select all elements with the class name "highlight"?',
            options: ['.highlight', '#highlight', 'highlight', '*highlight'],
          },
          ckb: {
            prompt: 'چۆن هەموو ئەو توخمانە دەستنیشان دەکەیت کە کلاسی class="highlight"یان هەیە؟',
            options: ['.highlight', '#highlight', 'highlight', '*highlight'],
          },
          kmr: {
            prompt: 'چەوا توخمێن خودان کلاسا class="highlight" دەستنیشان دکەی؟',
            options: ['.highlight', '#highlight', 'highlight', '*highlight'],
          },
          ar: {
            prompt: 'كيف تحدد جميع العناصر التي تحمل اسم الفئة class="highlight"؟',
            options: ['.highlight', '#highlight', 'highlight', '*highlight'],
          },
        },
      },
    ],
  },

  // 3. KARÊJAN Official JavaScript Quiz
  {
    id: 'quiz-w3-js',
    quizType: 'course_exam',
    courseId: 'js',
    difficulty: 'medium',
    tier: 'free',
    timeLimitSeconds: 600,
    titles: {
      en: 'KARÊJAN Official JavaScript Certification Exam',
      ckb: 'تاقیکردنەوەی فەرمی و پێشکەوتووی JavaScript (ستانداردی کاڕێژان)',
      kmr: 'تاقیکرنا فەرمی و پێشکەفتی یا JavaScript (ستانداردێ کارێژان)',
      ar: 'اختبار شهادة JavaScript الرسمي الشامل (منهاج كاريزان)',
    },
    questions: [
      {
        id: 'qw3-js-1',
        translations: {
          en: {
            prompt: 'Inside which HTML element do we put JavaScript code?',
            options: ['<script>', '<javascript>', '<js>', '<scripting>'],
          },
          ckb: {
            prompt: 'لەناو کام تاگی HTMLدا کۆدی جاڤاسکریپت دادەنێین؟',
            options: ['<script>', '<javascript>', '<js>', '<scripting>'],
          },
          kmr: {
            prompt: 'دناڤ کیژ تاگێ HTML دا کۆدێ JavaScript دادئێخین؟',
            options: ['<script>', '<javascript>', '<js>', '<scripting>'],
          },
          ar: {
            prompt: 'داخل أي وسم HTML نضع شفرات جافاسكربت البرمجية؟',
            options: ['<script>', '<javascript>', '<js>', '<scripting>'],
          },
        },
      },
      {
        id: 'qw3-js-2',
        translations: {
          en: {
            prompt: 'How do you write "Hello World" in an alert box in JavaScript?',
            options: [
              'alert("Hello World");',
              'msg("Hello World");',
              'alertBox("Hello World");',
              'msgBox("Hello World");',
            ],
          },
          ckb: {
            prompt: 'چۆن پەیامی وریاکەرەوە (Alert Box) دروست دەکەیت لە وێبگەڕدا؟',
            options: [
              'alert("Hello World");',
              'msg("Hello World");',
              'alertBox("Hello World");',
              'msgBox("Hello World");',
            ],
          },
          kmr: {
            prompt: 'چەوا Alert Box د JavaScript دا دروست دکەی؟',
            options: [
              'alert("Hello World");',
              'msg("Hello World");',
              'alertBox("Hello World");',
              'msgBox("Hello World");',
            ],
          },
          ar: {
            prompt: 'كيف تعرض نافذة تنبيه للمستخدم في جافاسكربت؟',
            options: [
              'alert("Hello World");',
              'msg("Hello World");',
              'alertBox("Hello World");',
              'msgBox("Hello World");',
            ],
          },
        },
      },
      {
        id: 'qw3-js-3',
        translations: {
          en: {
            prompt: 'How do you create a function in JavaScript?',
            options: [
              'function myFunction()',
              'def myFunction()',
              'function:myFunction()',
              'create myFunction()',
            ],
          },
          ckb: {
            prompt: 'چۆن فانکشنێکی دروست لە جاڤاسکریپتدا پێناسە دەکەیت؟',
            options: [
              'function myFunction()',
              'def myFunction()',
              'function:myFunction()',
              'create myFunction()',
            ],
          },
          kmr: {
            prompt: 'چەوا فەنکشنەکی د JavaScript دا دروست دکەی؟',
            options: [
              'function myFunction()',
              'def myFunction()',
              'function:myFunction()',
              'create myFunction()',
            ],
          },
          ar: {
            prompt: 'كيف تنشئ دالة معرفة في جافاسكربت؟',
            options: [
              'function myFunction()',
              'def myFunction()',
              'function:myFunction()',
              'create myFunction()',
            ],
          },
        },
      },
      {
        id: 'qw3-js-4',
        translations: {
          en: {
            prompt: 'Which event occurs when the user clicks on an HTML element?',
            options: ['onclick', 'onmouseclick', 'onchange', 'onhover'],
          },
          ckb: {
            prompt: 'کام ڕووداو (Event) لە جاڤاسکریپتدا ڕوودەدات کاتێک بەکارهێنەر کلیک لە توخمێک دەکات؟',
            options: ['onclick', 'onmouseclick', 'onchange', 'onhover'],
          },
          kmr: {
            prompt: 'کیژ ڕوودان چێدبیت دەمێ بکارهێنەر کلیک دکەت؟',
            options: ['onclick', 'onmouseclick', 'onchange', 'onhover'],
          },
          ar: {
            prompt: 'أي حدث يُطلق عند نقر المستخدم على عنصر في الصفحة؟',
            options: ['onclick', 'onmouseclick', 'onchange', 'onhover'],
          },
        },
      },
    ],
  },

  // 4. KARÊJAN Official Python Quiz
  {
    id: 'quiz-w3-python',
    quizType: 'course_exam',
    courseId: 'python',
    difficulty: 'medium',
    tier: 'free',
    timeLimitSeconds: 600,
    titles: {
      en: 'KARÊJAN Official Python Certification Exam',
      ckb: 'تاقیکردنەوەی فەرمی و پێشکەوتووی Python (ستانداردی کاڕێژان)',
      kmr: 'تاقیکرنا فەرمی و پێشکەفتی یا Python (ستانداردێ کارێژان)',
      ar: 'اختبار شهادة بايثون الرسمي الشامل (منهاج كاريزان)',
    },
    questions: [
      {
        id: 'qw3-py-1',
        translations: {
          en: {
            prompt: 'What is a correct syntax to output "Hello World" in Python?',
            options: [
              'print("Hello World")',
              'echo "Hello World"',
              'p("Hello World")',
              'Console.WriteLine("Hello World")',
            ],
          },
          ckb: {
            prompt: 'سینتاکسی دروست بۆ چاپکردنی "Hello World" لە پایتۆندا کامەیە؟',
            options: [
              'print("Hello World")',
              'echo "Hello World"',
              'p("Hello World")',
              'Console.WriteLine("Hello World")',
            ],
          },
          kmr: {
            prompt: 'سینتاکسێ ڕاست بۆ چاپکرنا "Hello World" د پایتۆن دا کیژە؟',
            options: [
              'print("Hello World")',
              'echo "Hello World"',
              'p("Hello World")',
              'Console.WriteLine("Hello World")',
            ],
          },
          ar: {
            prompt: 'ما هي الصيغة الصحيحة لطباعة "Hello World" في بايثون؟',
            options: [
              'print("Hello World")',
              'echo "Hello World"',
              'p("Hello World")',
              'Console.WriteLine("Hello World")',
            ],
          },
        },
      },
      {
        id: 'qw3-py-2',
        translations: {
          en: {
            prompt: 'How do you insert comments in Python code?',
            options: ['# This is a comment', '// This is a comment', '/* This is a comment */', '-- This is a comment'],
          },
          ckb: {
            prompt: 'چۆن سەرنج و لێدوان (Comment) لە کۆدی پایتۆندا دەنووسیت؟',
            options: ['# This is a comment', '// This is a comment', '/* This is a comment */', '-- This is a comment'],
          },
          kmr: {
            prompt: 'چەوا سەرنجێ (Comment) د پایتۆن دا دئێخیە د کۆدێ دا؟',
            options: ['# This is a comment', '// This is a comment', '/* This is a comment */', '-- This is a comment'],
          },
          ar: {
            prompt: 'كيف تدرج تعليقاً في شفرة بايثون؟',
            options: ['# This is a comment', '// This is a comment', '/* This is a comment */', '-- This is a comment'],
          },
        },
      },
      {
        id: 'qw3-py-3',
        translations: {
          en: {
            prompt: 'Which collection type is ordered, changeable, and allows duplicate members in Python?',
            options: ['List', 'Set', 'Tuple', 'Dictionary keys'],
          },
          ckb: {
            prompt: 'کام جۆری کۆمەڵەی داتا لە پایتۆندا ڕیزبەندی پارێزراوە، دەستکاری دەکرێت، و دووبارەبوونەوە وەردەگرێت؟',
            options: ['List', 'Set', 'Tuple', 'Dictionary keys'],
          },
          kmr: {
            prompt: 'کیژ جۆرێ کۆمەلەیا داتایان دهێتە گوهۆڕین و ڕێزبەندییە؟',
            options: ['List', 'Set', 'Tuple', 'Dictionary keys'],
          },
          ar: {
            prompt: 'أي هيكل بيانات في بايثون يعتبر مرتباً وقابلاً للتعديل ويسمح بالتكرار؟',
            options: ['List', 'Set', 'Tuple', 'Dictionary keys'],
          },
        },
      },
    ],
  },

  // 5. KARÊJAN Official React Quiz
  {
    id: 'quiz-w3-react',
    quizType: 'course_exam',
    courseId: 'react',
    difficulty: 'medium',
    tier: 'free',
    timeLimitSeconds: 600,
    titles: {
      en: 'KARÊJAN Official React Certification Exam',
      ckb: 'تاقیکردنەوەی فەرمی و پێشکەوتووی React (ستانداردی کاڕێژان)',
      kmr: 'تاقیکرنا فەرمی و پێشکەفتی یا React (ستانداردێ کارێژان)',
      ar: 'اختبار شهادة React الرسمي الشامل (منهاج كاريزان)',
    },
    questions: [
      {
        id: 'qw3-react-1',
        translations: {
          en: {
            prompt: 'What is the correct syntax for writing JSX elements in React?',
            options: [
              'const el = <h1>Hello Karejan</h1>;',
              'const el = "<h1>Hello Karejan</h1>";',
              'const el = createTag(h1, "Hello Karejan");',
              'const el = <h1:Hello Karejan>;',
            ],
          },
          ckb: {
            prompt: 'سینتاکسی دروست بۆ نووسینی توخمێکی JSX لە ڕیاکت کامەیە؟',
            options: [
              'const el = <h1>Hello Karejan</h1>;',
              'const el = "<h1>Hello Karejan</h1>";',
              'const el = createTag(h1, "Hello Karejan");',
              'const el = <h1:Hello Karejan>;',
            ],
          },
          kmr: {
            prompt: 'سینتاکسێ ڕاست یێ JSX د React دا کیژە؟',
            options: [
              'const el = <h1>Hello Karejan</h1>;',
              'const el = "<h1>Hello Karejan</h1>";',
              'const el = createTag(h1, "Hello Karejan");',
              'const el = <h1:Hello Karejan>;',
            ],
          },
          ar: {
            prompt: 'ما هي الصيغة الصحيحة لكتابة عنصر JSX في رياكت؟',
            options: [
              'const el = <h1>Hello Karejan</h1>;',
              'const el = "<h1>Hello Karejan</h1>";',
              'const el = createTag(h1, "Hello Karejan");',
              'const el = <h1:Hello Karejan>;',
            ],
          },
        },
      },
      {
        id: 'qw3-react-2',
        translations: {
          en: {
            prompt: 'What tool is used to pass data from a parent component down to a child component?',
            options: ['Props', 'State', 'Redux store only', 'DOM attributes'],
          },
          ckb: {
            prompt: 'لە ڕیاکتدا چی بەکاردێت بۆ ناردنی داتا لە کۆمپۆنێنتی باوکەوە بۆ کۆمپۆنێنتی منداڵ؟',
            options: ['Props', 'State', 'Redux store only', 'DOM attributes'],
          },
          kmr: {
            prompt: 'د React دا چ دهێتە بکارئینان بۆ هنارتنا داتایێ ژ دایکوبابان بۆ زارۆکان؟',
            options: ['Props', 'State', 'Redux store only', 'DOM attributes'],
          },
          ar: {
            prompt: 'ما هي الوسيلة المستخدمة لتمرير البيانات من المكون الأب إلى المكون الابن؟',
            options: ['Props', 'State', 'Redux store only', 'DOM attributes'],
          },
        },
      },
    ],
  },

  // 6. KARÊJAN Official C++ Quiz
  {
    id: 'quiz-w3-cpp',
    quizType: 'course_exam',
    courseId: 'cpp',
    difficulty: 'medium',
    tier: 'free',
    timeLimitSeconds: 600,
    titles: {
      en: 'KARÊJAN Official C++ Certification Exam',
      ckb: 'تاقیکردنەوەی فەرمی و پێشکەوتووی C++ (ستانداردی کاڕێژان)',
      kmr: 'تاقیکرنا فەرمی و پێشکەفتی یا C++ (ستانداردێ کارێژان)',
      ar: 'اختبار شهادة C++ الرسمي الشامل (منهاج كاريزان)',
    },
    questions: [
      {
        id: 'qw3-cpp-1',
        translations: {
          en: {
            prompt: 'Which header file in C++ lets us work with input and output objects like cin and cout?',
            options: ['<iostream>', '<stdio.h>', '<stream>', '<inputoutput>'],
          },
          ckb: {
            prompt: 'کام فایلی سەردێڕ لە C++دا بەکاردێت بۆ کارکردن لەگەڵ cin و cout؟',
            options: ['<iostream>', '<stdio.h>', '<stream>', '<inputoutput>'],
          },
          kmr: {
            prompt: 'کیژ فایلی سەرەکی د C++ دا پێدڤییە بۆ کارکرن دگەل cin و cout؟',
            options: ['<iostream>', '<stdio.h>', '<stream>', '<inputoutput>'],
          },
          ar: {
            prompt: 'ما هو ملف الترويسة القياسي في C++ للتعامل مع كائنات الإدخال والإخراج مثل cin و cout؟',
            options: ['<iostream>', '<stdio.h>', '<stream>', '<inputoutput>'],
          },
        },
      },
      {
        id: 'qw3-cpp-2',
        translations: {
          en: {
            prompt: 'Which operator is used to return the memory address of a variable in C++?',
            options: ['& (Address-of operator)', '* (Dereference operator)', '%', '->'],
          },
          ckb: {
            prompt: 'کام هێما بەکاردێت بۆ وەرگرتنی ناونیشانی بیرگە (Memory Address)ی گۆڕاوێک لە C++دا؟',
            options: ['& (Address-of operator)', '* (Dereference operator)', '%', '->'],
          },
          kmr: {
            prompt: 'کیژ هێما بۆ وەرگرتنا ناڤنیشانێ بیرگەیێ (Memory Address) دهێتە بکارئینان؟',
            options: ['& (Address-of operator)', '* (Dereference operator)', '%', '->'],
          },
          ar: {
            prompt: 'أي معامل يُستخدم للحصول على عنوان الذاكرة لمتغير في C++؟',
            options: ['& (معامل العنوان)', '* (معامل إلغاء الإشارة)', '%', '->'],
          },
        },
      },
    ],
  },
];
