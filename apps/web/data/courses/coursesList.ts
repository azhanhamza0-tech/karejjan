import type { Course, Chapter } from '../../types/domain';

export const ALL_COURSES: Course[] = [
  {
    id: 'html',
    slug: 'html',
    order: 1,
    titles: {
      en: 'HTML Fundamentals',
      ckb: 'بنەماکانی پرۆگرامینگی HTML',
      kmr: 'بنەمایێن HTML',
      ar: 'أساسيات HTML',
    },
    descriptions: {
      en: 'Semantic document structure, accessible forms, tables, media, and SEO best practices.',
      ckb: 'پێکهاتەی واتاداری لاپەڕە، فۆرمەکان، خشتە، میدیا و بنەماکانی پێوانەیی وێب.',
      kmr: 'پێکهاتەیا واتادار یا لاپەڕان، فۆرم، خشتە، میدیا و بنەمایێن پێوانەیی.',
      ar: 'هيكلة المستندات الدلالية، النماذج المتاحة، الجداول والوسائط المتعددة.',
    },
  },
  {
    id: 'css',
    slug: 'css',
    order: 2,
    titles: {
      en: 'Modern CSS Layout & Design',
      ckb: 'داڕشتن و دیزاینی CSS',
      kmr: 'داڕشتن و دیزاینا CSS',
      ar: 'تخطيط وتصميم CSS الحديث',
    },
    descriptions: {
      en: 'Flexbox alignment, responsive CSS Grid systems, animations, variables, and dark mode.',
      ckb: 'ڕێکخستنی Flexbox، سیستەمی تۆڕی Grid، ئەنیمەیشن، گۆڕاوەکان و ڕووکاری تاریک.',
      kmr: 'ڕێکخستنا Flexbox، سیستەمێ Grid، ئەنیمەیشن، گۆڕاو و شێوازێ تاریک.',
      ar: 'محاذاة Flexbox، شبكات Grid المتجاوبة، التحريكات، المتغيرات والوضع الليلي.',
    },
  },
  {
    id: 'js',
    slug: 'js',
    order: 3,
    titles: {
      en: 'JavaScript Core & Async',
      ckb: 'پرۆگرامسازیی JavaScript',
      kmr: 'پرۆگرامسازیا JavaScript',
      ar: 'برمجة JavaScript الأساسية',
    },
    descriptions: {
      en: 'Modern ES6+ syntax, arrays, objects, DOM manipulation, promises, and async/await.',
      ckb: 'سینتاکسی مۆدێرنی ES6+، لیستەکان، ئۆبجێکت، کارلێکی DOM و پڕۆسەی ناهاوکات.',
      kmr: 'سینتاکسێ مۆدێرن یێ ES6+، لیست، ئۆبجێکت، کارلێککرنا DOM و پرۆسێن async.',
      ar: 'قواعد ES6+ الحديثة، المصفوفات، الكائنات، معالجة DOM والبرمجة غير المتزامنة.',
    },
  },
  {
    id: 'react',
    slug: 'react',
    order: 4,
    titles: {
      en: 'React & Component UI',
      ckb: 'فێربوونی ڕیاکت (React)',
      kmr: 'فێربوونا ڕیاکت (React)',
      ar: 'رياكت وواجهات المستخدم (React)',
    },
    descriptions: {
      en: 'Functional components, hooks (useState, useEffect, useRef, useContext), props, and state.',
      ckb: 'کۆمپۆنێنتە کاراییەکان، هوکەکانی useState و useEffect، پرۆپس و بەڕێوەبردنی دۆخ.',
      kmr: 'کۆمپۆنێنتێن کارایی، هووکێن useState و useEffect، پرۆپس و برێڤەبرنا دەلیڤێ.',
      ar: 'المكونات الدالية، خطافات Hooks، الخصائص Props، وإدارة الحالة التفاعلية.',
    },
  },
  {
    id: 'vite',
    slug: 'vite',
    order: 5,
    titles: {
      en: 'Vite & Build Tooling',
      ckb: 'ئامرازی ڤایت (Vite)',
      kmr: 'ئامرازێ ڤایت (Vite)',
      ar: 'أداة البناء الحديثة (Vite)',
    },
    descriptions: {
      en: 'Lightning-fast ESM dev server, HMR, bundling with Rollup, plugins, and deployment.',
      ckb: 'سێرڤەری گەشەپێدانی زۆر خێرا، گۆڕانکاری دەستبەجێ (HMR)، پەڕگەبەندی و پلاگینەکان.',
      kmr: 'سێرڤەرێ گەشەپێدانێ یێ ب لەز، گوهۆڕینا ئێکسەر (HMR)، پلاگین و بەلاڤکرن.',
      ar: 'خادم التطوير فائق السرعة عبر ESM، التحديث الحي HMR، الحزم والإضافات والرفع.',
    },
  },
  {
    id: 'tsx',
    slug: 'tsx',
    order: 6,
    titles: {
      en: 'TypeScript & TSX',
      ckb: 'تایپسکریپت و TSX',
      kmr: 'تایپسکریپت و TSX',
      ar: 'تايب سكريبت و TSX',
    },
    descriptions: {
      en: 'Static type safety, interfaces, generics, utility types, and typing React components.',
      ckb: 'پاراستنی جۆری داتا، ڕووکارەکان (Interfaces)، جێنێریکس و بەکارهێنانی تایپ لەگەڵ React.',
      kmr: 'پاراستنا جۆرێن داتایان، Interface، Generics و بکارئینانا تایپی دگەل React.',
      ar: 'أمان الأنواع الثابتة، الواجهات Interfaces، القوالب Generics، وتنسيق مكونات React بأمان.',
    },
  },
  {
    id: 'python',
    slug: 'python',
    order: 7,
    titles: {
      en: 'Python Programming',
      ckb: 'پرۆگرامسازیی پایتۆن (Python)',
      kmr: 'پرۆگرامسازیا پایتۆن (Python)',
      ar: 'لغة البرمجة بايثون (Python)',
    },
    descriptions: {
      en: 'Clean syntax, data structures (lists, dicts, tuples), loops, functions, and file I/O.',
      ckb: 'سینتاکسی ئاسان، پێکهاتەی داتا (لیست و فەرهەنگ)، ئەڵقەکان، فانکشن و کارکردن لەگەڵ فایل.',
      kmr: 'سینتاکسێ سادە، پێکهاتەیێن داتایێ (لیست و فەرهەنگ)، ئەلقە، فەنکشن و فایل.',
      ar: 'قواعد اللغة المبسطة، هياكل البيانات (قوائم وقواميس)، الحلقات، الدوال والتعامل مع الملفات.',
    },
  },
  {
    id: 'cpp',
    slug: 'cpp',
    order: 8,
    titles: {
      en: 'C++ Modern Programming',
      ckb: 'سی پڵەس پڵەس (C++)',
      kmr: 'سی پڵەس پڵەس (C++)',
      ar: 'لغة البرمجة سي بلس بلس (C++)',
    },
    descriptions: {
      en: 'High-performance programming, variables, pointers, references, memory, vectors, and classes.',
      ckb: 'پرۆگرامسازیی خێرا، پۆینتەر، ئاماژەکان، بیرگە (Memory)، کڵاس و ئۆبجێکت.',
      kmr: 'پرۆگرامسازیا ب لەز، پۆینتەر، ئاماژە، بیرگە (Memory)، کلاسی و ئۆبجێکت.',
      ar: 'البرمجة عالية الأداء، المؤشرات Pointers، إدارة الذاكرة، المتجهات والكائنات Classes.',
    },
  },
];

export const ALL_CHAPTERS: Chapter[] = [
  // HTML Modules
  { id: 'ch-html-1', courseId: 'html', order: 1, titles: { en: 'HTML Basic & Document Structure', ckb: 'بەشی ١: بنەماکانی HTML و پێکهاتە', kmr: 'پشک ١: بنەمایێن HTML و پێکهاتە', ar: 'الفصل ١: أساسيات HTML وهيكلة المستند' } },
  { id: 'ch-html-2', courseId: 'html', order: 2, titles: { en: 'HTML Elements, Links & Tables', ckb: 'بەشی ٢: توخمەکان، لینک و خشتەکان', kmr: 'پشک ٢: توخم، لینک و خشتە', ar: 'الفصل ٢: العناصر والروابط والجداول' } },
  { id: 'ch-html-3', courseId: 'html', order: 3, titles: { en: 'HTML Forms & Inputs', ckb: 'بەشی ٣: فۆرمەکان و وەرگرتنی زانیاری', kmr: 'پشک ٣: فۆرم و وەرگرتنا پێزانینان', ar: 'الفصل ٣: النماذج ومدخلات البيانات' } },
  { id: 'ch-html-4', courseId: 'html', order: 4, titles: { en: 'HTML Media & Advanced Features', ckb: 'بەشی ٤: میدیا، گرافیک و تایبەتمەندییە نوێیەکان', kmr: 'پشک ٤: میدیا و گرافیک', ar: 'الفصل ٤: الوسائط والميزات المتقدمة' } },

  // CSS Modules
  { id: 'ch-css-1', courseId: 'css', order: 1, titles: { en: 'CSS Basics, Selectors & Box Model', ckb: 'بەشی ١: بنەماکان، دەستنیشانکەر و Box Model', kmr: 'پشک ١: بنەما و Box Model', ar: 'الفصل ١: الأساسيات والمحددات ونموذج الصندوق' } },
  { id: 'ch-css-2', courseId: 'css', order: 2, titles: { en: 'CSS Modern Layouts (Flexbox & Grid)', ckb: 'بەشی ٢: داڕشتنی مۆدێرن (Flexbox و Grid)', kmr: 'پشک ٢: داڕشتنا مۆدێرن (Flexbox و Grid)', ar: 'الفصل ٢: التخطيطات الحديثة (Flexbox و Grid)' } },
  { id: 'ch-css-3', courseId: 'css', order: 3, titles: { en: 'CSS Animations, Transitions & Effects', ckb: 'بەشی ٣: ئەنیمەیشن، گواستنەوە و سێبەر', kmr: 'پشک ٣: ئەنیمەیشن و کاریگەری', ar: 'الفصل ٣: التحريكات والانتقالات والمؤثرات' } },
  { id: 'ch-css-4', courseId: 'css', order: 4, titles: { en: 'CSS Responsive & Modern Features', ckb: 'بەشی ٤: دیزاینی وەڵامدەرەوە و ڕووکاری تاریک', kmr: 'پشک ٤: دیزاینا وەڵامدەر و ڕووکارێ تاریک', ar: 'الفصل ٤: التصميم المتجاوب والميزات المتقدمة' } },

  // JavaScript Modules
  { id: 'ch-js-1', courseId: 'js', order: 1, titles: { en: 'JS Fundamentals & Control Flow', ckb: 'بەشی ١: بنەماکان، گۆڕاوەکان و مەرجەکان', kmr: 'پشک ١: بنەما، گۆڕاو و مەرج', ar: 'الفصل ١: أساسيات اللغة والتحكم بالتدفق' } },
  { id: 'ch-js-2', courseId: 'js', order: 2, titles: { en: 'JS Functions, Arrays & Objects', ckb: 'بەشی ٢: فەنکشنەکان، لیست و ئۆبجێکت', kmr: 'پشک ٢: فەنکشن، لیست و ئۆبجێکت', ar: 'الفصل ٢: الدوال والمصفوفات والكائنات' } },
  { id: 'ch-js-3', courseId: 'js', order: 3, titles: { en: 'JS DOM Manipulation & Events', ckb: 'بەشی ٣: کۆنتڕۆڵی DOM و ڕووداوەکان', kmr: 'پشک ٣: کۆنترۆلا DOM و ڕوودان', ar: 'الفصل ٣: معالجة DOM والأحداث التفاعلية' } },
  { id: 'ch-js-4', courseId: 'js', order: 4, titles: { en: 'JS Async, Promises & Modern APIs', ckb: 'بەشی ٤: پرۆسەی ناهاوکات و مۆدیوڵەکان', kmr: 'پشک ٤: پرۆسێن async و مۆدیوڵ', ar: 'الفصل ٤: البرمجة غير المتزامنة والواجهات الحديثة' } },

  // React Modules
  { id: 'ch-react-1', courseId: 'react', order: 1, titles: { en: 'React Fundamentals & JSX', ckb: 'بەشی ١: ناساندن، JSX و کۆمپۆنێنت', kmr: 'پشک ١: ناساندن، JSX و کۆمپۆنێنت', ar: 'الفصل ١: أساسيات React وJSX' } },
  { id: 'ch-react-2', courseId: 'react', order: 2, titles: { en: 'React State & Event Handling', ckb: 'بەشی ٢: بەڕێوەبردنی دۆخ و ڕووداوەکان', kmr: 'پشک ٢: برێڤەبرنا دەلیڤێ و ڕوودان', ar: 'الفصل ٢: إدارة الحالة والأحداث' } },
  { id: 'ch-react-3', courseId: 'react', order: 3, titles: { en: 'React Essential Hooks', ckb: 'بەشی ٣: هوکە سەرەکییەکان (useEffect, useRef, Context)', kmr: 'پشک ٣: هووکێن سەرەکی', ar: 'الفصل ٣: خطافات Hooks الأساسية' } },
  { id: 'ch-react-4', courseId: 'react', order: 4, titles: { en: 'React Performance & Production', ckb: 'بەشی ٤: خێرایی، پەڕینەوە و بەرهەمهێنان', kmr: 'پشک ٤: خێرایی و بەرهەمهێنان', ar: 'الفصل ٤: الأداء والأنماط الإنتاجية' } },

  // Vite Modules
  { id: 'ch-vite-1', courseId: 'vite', order: 1, titles: { en: 'Vite Architecture & Fast Dev', ckb: 'بەشی ١: سیستەمی ڤایت و سێرڤەری خێرا', kmr: 'پشک ١: سیستەمێ ڤایت و سێرڤەرێ لەز', ar: 'الفصل ١: معمارية Vite وخادم التطوير' } },
  { id: 'ch-vite-2', courseId: 'vite', order: 2, titles: { en: 'Vite Assets, PostCSS & Modules', ckb: 'بەشی ٢: ستایل، پەڕگە و گۆڕاوە ژینگەییەکان', kmr: 'پشک ٢: ستایل و پەڕگە', ar: 'الفصل ٢: الملفات والأنماط والمتغيرات' } },
  { id: 'ch-vite-3', courseId: 'vite', order: 3, titles: { en: 'Vite Production Bundling & Rollup', ckb: 'بەشی ٣: پەڕگەبەندی بۆ بڵاوکردنەوە و ڕێکخستن', kmr: 'پشک ٣: پەڕگەبەندی و بەلاڤکرن', ar: 'الفصل ٣: الحزم الإنتاجية والإعدادات المتقدمة' } },

  // TypeScript (TSX) Modules
  { id: 'ch-tsx-1', courseId: 'tsx', order: 1, titles: { en: 'TypeScript Types & Interfaces', ckb: 'بەشی ١: جۆرەکانی داتا و Interfaces', kmr: 'پشک ١: جۆرێن داتایێ و Interfaces', ar: 'الفصل ١: أنواع البيانات والواجهات' } },
  { id: 'ch-tsx-2', courseId: 'tsx', order: 2, titles: { en: 'TypeScript Functions & Generics', ckb: 'بەشی ٢: فەنکشن و جێنێریکس (Generics)', kmr: 'پشک ٢: فەنکشن و Generics', ar: 'الفصل ٢: الدوال والقوالب العامة' } },
  { id: 'ch-tsx-3', courseId: 'tsx', order: 3, titles: { en: 'TypeScript with React & TSX', ckb: 'بەشی ٣: تایپکردنی React و کۆمپۆنێنتەکانی TSX', kmr: 'پشک ٣: تایپکرنا React دگەل TSX', ar: 'الفصل ٣: تايب سكريبت مع React وTSX' } },

  // Python Modules
  { id: 'ch-python-1', courseId: 'python', order: 1, titles: { en: 'Python Basics & Syntax', ckb: 'بەشی ١: بنەماکانی پایتۆن و سینتاکس', kmr: 'پشک ١: بنەمایێن پایتۆن و سینتاکس', ar: 'الفصل ١: أساسيات بايثون والقواعد' } },
  { id: 'ch-python-2', courseId: 'python', order: 2, titles: { en: 'Python Control Flow & Loops', ckb: 'بەشی ٢: مەرجەکان و ئەڵقەی دووبارەبوونەوە', kmr: 'پشک ٢: مەرج و ئەلقە', ar: 'الفصل ٢: الجمل الشرطية والحلقات' } },
  { id: 'ch-python-3', courseId: 'python', order: 3, titles: { en: 'Python Data Collections', ckb: 'بەشی ٣: پێکهاتەی داتاکان (لیست، فەرهەنگ، سێت)', kmr: 'پشک ٣: پێکهاتەیێن داتایێ (لیست، فەرهەنگ)', ar: 'الفصل ٣: هياكل البيانات (قوائم، قواميس)' } },
  { id: 'ch-python-4', courseId: 'python', order: 4, titles: { en: 'Python Functions, Files & OOP', ckb: 'بەشی ٤: فەنکشن، فایل و کڵاسەکان (OOP)', kmr: 'پشک ٤: فەنکشن، فایل و کلاسی (OOP)', ar: 'الفصل ٤: الدوال والملفات والبرمجة كائنية التوجه' } },

  // C++ Modules
  { id: 'ch-cpp-1', courseId: 'cpp', order: 1, titles: { en: 'C++ Basics, Types & I/O', ckb: 'بەشی ١: بنەماکان، جۆرەکانی داتا و cin/cout', kmr: 'پشک ١: بنەما، جۆرێن داتایێ و cin/cout', ar: 'الفصل ١: الأساسيات والأنواع ومدخلات cin/cout' } },
  { id: 'ch-cpp-2', courseId: 'cpp', order: 2, titles: { en: 'C++ Control Flow, Loops & Arrays', ckb: 'بەشی ٢: کۆنتڕۆڵ، ئەڵقەکان و ئارەی', kmr: 'پشک ٢: کۆنترۆڵ، ئەلقە و ئارەی', ar: 'الفصل ٢: التحكم والحلقات والمصفوفات' } },
  { id: 'ch-cpp-3', courseId: 'cpp', order: 3, titles: { en: 'C++ Functions, Pointers & Memory', ckb: 'بەشی ٣: فەنکشن، پۆینتەر، بیرگە و ڤێکتەر', kmr: 'پشک ٣: فەنکشن، پۆینتەر و بیرگە', ar: 'الفصل ٣: الدوال والمؤشرات وإدارة الذاكرة' } },
  { id: 'ch-cpp-4', courseId: 'cpp', order: 4, titles: { en: 'C++ OOP, Structs & Templates', ckb: 'بەشی ٤: کڵاس، تەنخوازی (OOP) و تێمپلێتەکان', kmr: 'پشک ٤: کلاسی و OOP و تێمپلێت', ar: 'الفصل ٤: البرمجة كائنية التوجه والقوالب STL' } },
];
