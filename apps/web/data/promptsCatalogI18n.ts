import type { Locale } from '../types/domain';

export interface PromptI18nEntry {
  names: Record<Locale, string>;
  badges: Record<Locale, string>;
  shortDesc: { kmr: string; ar: string };
  directiveExplanation: { kmr: string; ar: string };
  whenToUse: { kmr: string; ar: string };
  promptTemplates: Record<'kmr' | 'ar' | 'en', string>;
  exampleSnippets: Record<'kmr' | 'ar' | 'en', string>;
}

export const PROMPTS_I18N: Record<string, PromptI18nEntry> = {
  'think-10x': {
    names: {
      ckb: 'THINK10X (بیرکردنەوەی دە هێندە و قووڵ)',
      kmr: 'THINK10X (هزرکرنا دەهـ جاران کویرتر)',
      ar: 'THINK10X (التفكير العميق عشرة أضعاف)',
      en: 'THINK10X (10x Deep Reasoning)',
    },
    badges: {
      ckb: 'داواکراوی تایبەت 🔥',
      kmr: 'داخوازکرییا تایبەت 🔥',
      ar: 'الأكثر طلباً 🔥',
      en: 'Top Pick 🔥',
    },
    shortDesc: {
      kmr: 'فەرمان ب مۆدێلی بۆ هزرکرنێ د ١٠ ئاستان دا بەری بەرسڤدانێ و دیتنا هەمی ئاریشێن ڤەشارتی.',
      ar: 'يوجّه النموذج للتفكير عبر ١٠ مستويات مختلفة قبل الإجابة لاكتشاف جميع الحالات الحدية وتقديم أفضل حل.',
    },
    directiveExplanation: {
      kmr: 'ئەڤ پرۆمپتە وە دکەت چاتبۆت بلەز بەرسڤێ نەدەت؛ دەستپێکێ مەبەستا ڕاستەقینە شیکار بکەت، Edge Cases بێخیتە پێش چاڤ، لەزاتی و ئاسایشێ هەلسەنگینیت و پاشان چارەسەریا دروست بدەت.',
      ar: 'يمنع التسرع في الإجابات السطحية عبر إلزام النموذج بتحليل السبب الجذري، والآثار الجانبية، والأداء، والذاكرة قبل صياغة الحل.',
    },
    whenToUse: {
      kmr: 'دەمێ تو ڕووبەڕووی کێشەکا تەکنیکی یا ئاڵۆز دبی یان باگەکا گرنگ د پڕۆدەکشنێ دا دروست دبیت.',
      ar: 'عند مواجهة مشاكل معمارية معقدة أو أخطاء حرجة في بيئة الإنتاج تحتاج دقة تامة.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: THINK10X]
بەری کو چ دێڕێن کۆدی یان بەرسڤان بنڤیسی، هیڤیە د ڤان ئاستان دا ب کویری هزر بکە:
١. مەبەستا بنەڕەتی و سەدەمێ سەرەکی یێ کێشێ چییە؟
٢. چ ئاریشە و حالەتێن نەچاڤەڕێکری (Edge Cases) ڕەنگە ڕووبدەن؟
٣. کارتێکرنا ڤێ چارەسەریێ ل سەر لەزاتی و ئاسایشێ دێ چ بیت؟
٤. چاوا ب پاقژترین شێواز و کێمترین باگ جێبەجێ بکەین؟
٥. پاشان چارەسەرییا دوماهیێ و پێنگاڤان ب ڕۆهنی پێشکێش بکە.

کێشا من ئەڤەیە:
[کێشە یان داخوازا خۆ ل ڤێرێ بنڤیسە]`,
      ar: `[DIRECTIVE: THINK10X]
قبل كتابة أي سطر كود أو إجابة، فكّر بعمق عبر المستويات التالية:
١. ما الهدف الجوهري والسبب الجذري للمشكلة؟
٢. ما الحالات الحدية والأخطاء الخفية (Edge Cases) المحتملة؟
٣. ما تأثير هذا الحل على الأداء والذاكرة والأمان؟
٤. كيف ننفذه بأكثر طريقة نظافة وأقل احتمال للخلل؟
٥. قدّم الحل النهائي والخطوات بوضوح تام.

مشكلتي هي:
[اكتب المشكلة أو المطلوب هنا]`,
      en: `[DIRECTIVE: THINK10X]
Before writing a single line of code or answer, reason deeply through these layers:
1. Root cause and true intent behind this problem.
2. Hidden edge cases, failure modes, and race conditions.
3. Performance, memory footprint, and security impact.
4. Cleanest, most maintainable architecture with zero regressions.
5. Present the final production-ready solution clearly.

My problem:
[Describe your task or issue here]`,
    },
    exampleSnippets: {
      kmr: 'THINK10X: ئەڤ ئەپە پشتی ١٠ خولەکان میمۆرییا وێ تژی دبیت (Memory Leak). دڤێم ژ هەمی لایان ڤە سەدەمان شیکار بکەی و کۆدەکێ پاراستی بدەی.',
      ar: 'THINK10X: يمتلئ استهلاك الذاكرة في هذا التطبيق بعد ١٠ دقائق (Memory Leak). حلّل جميع الأسباب المحتملة وقدّم إصلاحاً آمناً.',
      en: 'THINK10X: This app develops a memory leak after 10 minutes in production. Audit every lifecycle subscription and propose an airtight fix.',
    },
  },
  eli5: {
    names: {
      ckb: 'ELI5 (Explain Like I’m 5 / وەک بۆ ٥ ساڵان)',
      kmr: 'ELI5 (وەک بۆ زارۆکەکێ ٥ سالی شڕۆڤە بکە)',
      ar: 'ELI5 (اشرح كأن عمري ٥ سنوات)',
      en: 'ELI5 (Explain Like I’m 5)',
    },
    badges: {
      ckb: 'فێربوونی خێرا 🎓',
      kmr: 'فێربوونا بلەز 🎓',
      ar: 'تعلّم سريع 🎓',
      en: 'Fast Learning 🎓',
    },
    shortDesc: {
      kmr: 'ڕۆهنکرنا ئاڵۆزترین هزر و تەکنەلۆژیایان ب شێوەکێ زۆر سادە بێی بکارئینانا زاراوێن قورس.',
      ar: 'تبسيط أعقد المفاهيم البرمجية والتقنية عبر تشبيهات حياتية واضحة بعيداً عن التعقيد الأكاديمي.',
    },
    directiveExplanation: {
      kmr: 'فەرمان ب مۆدێلی دکەت ل جهێ گۆتنێن ئەکادیمی، نموونەیێن ژیانا ڕۆژانە بکاربینیت دا کو مێشک بلەز تێبگەهیت.',
      ar: 'يُجبر الذكاء الاصطناعي على استبدال المصطلحات المعقدة بأمثلة حسية من الحياة اليومية لتسريع الاستيعاب.',
    },
    whenToUse: {
      kmr: 'دەمێ تو د تێگەهشتنا چەمکەکی وەک Promises, Recursion, Docker یان JWT دا ئاسێ ببی.',
      ar: 'عند محاولة استيعاب مفهوم جديد مثل Promises أو Recursion أو Docker أو WebSockets لأول مرة.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: ELI5]
هیڤیە ڤی چەمکێ پرۆگرامسازیێ بۆ من وەک بۆ زارۆکەکێ ٥ سالی یان کەسەکێ نوو شڕۆڤە بکە:
- چ زاراوەیێن تەکنیکی یێن قورس بکارنەئینە بێی نموونە.
- نموونەکا ڕاستەقینە یا ژیانا ڕۆژانە بکاربینە.
- ل دوماهیێ ب ٢ دێڕان کورتییا بابەتی بێژە من.

بابەت:
[ناڤێ چەمکی ل ڤێرێ بنڤیسە]`,
      ar: `[DIRECTIVE: ELI5]
اشرح لي هذا المفهوم التقني بأسلوب مبسط جداً كأنك تشرحه لمبتدئ أو لطفل في الخامسة:
- تجنّب المصطلحات المعقدة إلا مع شرحها بمثال ملموس.
- استخدم تشبيهاً من الحياة اليومية (مثل المطعم أو المكتبة).
- اختتم بخلاصة واضحة من سطرين.

المفهوم:
[اكتب اسم المفهوم هنا]`,
      en: `[DIRECTIVE: ELI5]
Explain this programming concept as simply as possible, as if teaching someone completely new:
- Avoid dense academic jargon unless paired with an everyday analogy.
- Use a tangible real-world metaphor (restaurant, postal system, library).
- End with a crisp two-sentence takeaway.

Topic:
[Insert concept here]`,
    },
    exampleSnippets: {
      kmr: 'ELI5: کۆنسێپتا Docker و Containers چییە و چ جوداهی هەیە دگەل ویندۆزێ ئاسایی؟ ب سادەیی شڕۆڤە بکە.',
      ar: 'ELI5: ما مفهوم Docker و Containers وكيف يختلف عن الآلات الافتراضية التقليدية؟',
      en: 'ELI5: What are Docker containers and how do they differ from virtual machines? Use a simple everyday analogy.',
    },
  },
  'first-principles': {
    names: {
      ckb: 'FIRST PRINCIPLES (بیرکردنەوە لە بنەڕەتەوە)',
      kmr: 'FIRST PRINCIPLES (هزرکرن ژ بنەڕەتی ڤە)',
      ar: 'FIRST PRINCIPLES (التفكير من المبادئ الأولى)',
      en: 'FIRST PRINCIPLES (Fundamental Reasoning)',
    },
    badges: {
      ckb: 'شیکاری ئیلۆن ماسک 🚀',
      kmr: 'شیکارییا بنەڕەتی 🚀',
      ar: 'تحليل جوهري 🚀',
      en: 'First Principles 🚀',
    },
    shortDesc: {
      kmr: 'شیکرنا کێشێ بۆ بنەڕەتیترین ڕاستییێن لۆجیکی ل جهێ کۆپیکرنا چارەسەرییێن باو.',
      ar: 'تفكيك المشكلة إلى حقائقها البرمجية الأساسية بدلاً من تقليد الحلول الشائعة أو إضافة مكتبات ثقيلة.',
    },
    directiveExplanation: {
      kmr: 'ڕێگریێ ل دووبارەکرنا چارەسەرییێن کۆن دکەت و پرسیار دکەت کا د بنەڕەتدا پێتڤی ب چ داتا و میکانزمێکێ سادە هەیە.',
      ar: 'يمنع الاعتماد على الأنماط المكررة ويبدأ من مستوى البايت والمعالج والشبكة لبناء أخف وأسرع تصميم.',
    },
    whenToUse: {
      kmr: 'دەمێ تو دڤێت ئاریشەکا بێ مۆدێل ب تەمامی ژ سفرێ ب کێمترین تێچوو چارەسەر بکەی.',
      ar: 'عندما تبدو الحلول الحالية متضخمة وتريد تصميم حل خفيف من الصفر.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: FIRST PRINCIPLES]
چ چارەسەرییێن کۆپی کری بکارنەئینە; ڤێ بابەتی هەلوەشینە بۆ سەرەکیترین ڕاستییان:
١. د بنەڕەتدا چ داتا پێدڤیە بهێتە هنارتن و پاشکەفتکرن؟
٢. سادەترین میکانزم ب کێمترین پێنگاڤ چییە؟
٣. چاوا ب کێمترین کۆد و بێی پاکێجێن زێدە ئاڤا بکەین؟

کێشە:
[کێشا خۆ ل ڤێرێ بنڤیسە]`,
      ar: `[DIRECTIVE: FIRST PRINCIPLES]
لا تعتمد على الحلول التقليدية المنسوخة، وفكّك المشكلة إلى حقائقها الأساسية:
١. ما البيانات الضرورية فعلاً للإرسال والتخزين؟
٢. ما أبسط آلية لتحقيق الهدف بأقل خطوات ممكنة؟
٣. كيف نبني ذلك بأقل كود وتكلفة دون حزم غير ضرورية؟

المشكلة:
[اكتب المشكلة هنا]`,
      en: `[DIRECTIVE: FIRST PRINCIPLES]
Disregard conventional boilerplate and reason from ground truths:
1. What data strictly must be transmitted or persisted?
2. What is the simplest mechanism with the fewest moving parts?
3. How do we build this leanly without unnecessary dependencies?

Problem:
[Insert problem here]`,
    },
    exampleSnippets: {
      kmr: 'FIRST PRINCIPLES: ل جهێ دانانا سیستەمێ ئاڵۆز یێ Redis و RabbitMQ، چاوا د ناڤ Python دا ب سادەترین میتۆد Queue بۆ ١٠ هزار داخوازییان چێکەم؟',
      ar: 'FIRST PRINCIPLES: بدلاً من تثبيت Redis و RabbitMQ، كيف أصمم Queue بسيطاً في Python يتحمل ١٠ آلاف طلب؟',
      en: 'FIRST PRINCIPLES: Before adding Redis and RabbitMQ, how can we handle 10k background jobs cleanly in vanilla Python/Node?',
    },
  },
  'no-fluff': {
    names: {
      ckb: 'NO FLUFF / SENIOR DEV MODE (بەبێ قسەی زیادە)',
      kmr: 'NO FLUFF / SENIOR DEV MODE (بێی گۆتنێن زێدە)',
      ar: 'NO FLUFF / SENIOR DEV MODE (بدون حشو — مستوى خبير)',
      en: 'NO FLUFF / SENIOR DEV MODE',
    },
    badges: {
      ckb: 'خێرا و پڕۆفیشناڵ ⚡',
      kmr: 'بلەز و پرۆفیشنال ⚡',
      ar: 'سريع واحترافي ⚡',
      en: 'Direct & Senior ⚡',
    },
    shortDesc: {
      kmr: 'لابرنا هەمی پێشەکی و گۆتنێن زێدە; تەنها کۆدێ کارا و پێنگاڤێن تەکنیکی یێن دروست ددەت.',
      ar: 'إزالة المقدمات والمجاملات وإعطاء الكود النظيف والحل التقني المباشر والمركّز.',
    },
    directiveExplanation: {
      kmr: 'مۆدێلی دئێخیتە دۆخێ ئەندازیارەکێ بلند کو ڕاستەوخۆ دچیتە سەر چارەسەرییا کۆدی بێی بەرزەکرنا دەمی.',
      ar: 'يضع النموذج في وضع المهندس الخبير الذي يقدّم التعديل والكود الصحيح مباشرة دون إطالة.',
    },
    whenToUse: {
      kmr: 'دەمێ تو د کارێ ڕاستەقینە دای و تە تەنها کۆدێ کارا بلەز دڤێت.',
      ar: 'أثناء البرمجة السريعة عندما تريد الحل والكود الجاهز فوراً.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: NO FLUFF / SENIOR DEV MODE]
- چ پێشەکی، سلاڤ یان دەستخۆشیێ نەنووسە.
- ڕاستەوخۆ کۆدێ پاقژ و تەمام دانێ.
- ئەگەر پێدڤی بوو تەنها ٣ خالێن کورت بۆ ڕۆهنکرنا گوهۆڕینان بنڤیسە.

ئەرک:
[داخوازا خۆ ل ڤێرێ بنڤیسە]`,
      ar: `[DIRECTIVE: NO FLUFF / SENIOR DEV MODE]
- بدون أي مقدمات أو تحيات أو حشو.
- قدّم الكود النظيف المختبر مباشرة.
- أضف عند الحاجة ٣ نقاط موجزة فقط لتوضيح التعديلات.

المهمة:
[اكتب الكود أو الطلب هنا]`,
      en: `[DIRECTIVE: NO FLUFF / SENIOR DEV MODE]
- Zero preamble, greetings, or filler prose.
- Output clean, production-grade code immediately.
- Add at most 3 brief bullets explaining key trade-offs.

Task:
[Insert request here]`,
    },
    exampleSnippets: {
      kmr: 'NO FLUFF: فەنکشنەکا TypeScript بنڤیسە بۆ دیاریکرنا جوداهییا د ناڤبەرا دوو ڕۆژان دا ب دەمژمێر و ڕۆژ.',
      ar: 'NO FLUFF: اكتب دالة TypeScript دقيقة لحساب الفرق بالأيام والساعات بين تاريخين.',
      en: 'NO FLUFF: Write a typed TypeScript utility to compute day/hour diffs between two ISO timestamps.',
    },
  },
  'rubber-duck': {
    names: {
      ckb: 'RUBBER DUCK DEBUGGER (دیباگکەری بەتەی لاستیکی)',
      kmr: 'RUBBER DUCK DEBUGGER (هاریکارێ دیباگێ)',
      ar: 'RUBBER DUCK DEBUGGER (مصحح البطة المطاطية)',
      en: 'RUBBER DUCK DEBUGGER',
    },
    badges: {
      ckb: 'تەکنیکی ئەفسانەیی 🦆',
      kmr: 'تەکنیکا ناڤدار 🦆',
      ar: 'أسلوب عبقري 🦆',
      en: 'Classic Method 🦆',
    },
    shortDesc: {
      kmr: 'مۆدێل پرسیاران ژ تە دکەت دا کو تو بخۆ کەلێنا د ناڤبەرا هزر و کۆدێ خۆ دا ببینی.',
      ar: 'يتقمّص دور المستمع الذكي ويسألك خطوة بخطوة حتى تكتشف الخطأ المنطقي بنفسك.',
    },
    directiveExplanation: {
      kmr: 'ل جهێ کو یەکسەر کۆدەکێ نوو بنڤیسیت، پرسیاران ل سەر بەهایێ گۆڕاوەیان دکەت هەتا سەدەمێ باگی دیار دبیت.',
      ar: 'يطبق منهجية التصحيح التفاعلي باختبار افتراضاتك سطراً بسطر.',
    },
    whenToUse: {
      kmr: 'دەمێ کۆد چ شاشییان نیشان نادەت بەلێ ئەنجام خەلەت دەردچیت.',
      ar: 'عند وجود أخطاء منطقية صامتة أو نتائج غير متوقعة بدون أخطاء مترجم.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: RUBBER DUCK DEBUGGER]
تو ژ ڤێ خولەکێ Rubber Duck یێ منی بۆ دیباگکرنێ. یەکسەر کۆدی نەدە من:
١. بپرسە چاڤەڕێی چ ئەنجامەکی دکەم و نها چ دەردچیت.
٢. ل سەر بەهایێ گۆڕاوەیان پسیار بکە.
٣. پێنگاڤ ب پێنگاڤ هاریکاریا من بکە دێڕا شاش ببینم.

کۆد:
[کۆدی ل ڤێرێ دانێ]`,
      ar: `[DIRECTIVE: RUBBER DUCK DEBUGGER]
أنت الآن بطة التصحيح المطاطية الخاصة بي. لا تعطني الحل فوراً:
١. اسألني ما النتيجة المتوقعة وما الذي يظهر فعلياً.
٢. اسألني عن قيم المتغيرات عند كل خطوة.
٣. ساعدني على اكتشاف السطر المسبب للمشكلة بنفسي.

الكود:
[ضع الكود هنا]`,
      en: `[DIRECTIVE: RUBBER DUCK DEBUGGER]
Act as my interactive Rubber Duck debugger. Do not hand me final code yet:
1. Ask what behavior I expect vs. what I observe.
2. Interrogate variable state and assumptions line-by-line.
3. Guide me to pinpoint the faulty line myself.

Code:
[Paste code here]`,
    },
    exampleSnippets: {
      kmr: 'RUBBER DUCK: ئەڤ فەنکشنە ب شاشی لیستا ناڤان ڤالا دزڤڕینیت، پرسیاران ژ من بکە کا ئاریشە ل کیرێ یە.',
      ar: 'RUBBER DUCK: هذه الدالة تعيد مصفوفة فارغة بدلاً من الأسماء المصفّاة؛ اسألني لأكتشف الخطأ.',
      en: 'RUBBER DUCK: This filter function keeps returning an empty list even with matching entries. Walk me through questioning my assumptions.',
    },
  },
  'code-roast': {
    names: {
      ckb: 'BRUTAL CODE REVIEW (پێداچوونەوەی توند و بێبەزەییانە)',
      kmr: 'BRUTAL CODE REVIEW (پێداچوونا توند و هویر)',
      ar: 'BRUTAL CODE REVIEW (مراجعة صارمة بدون مجاملات)',
      en: 'BRUTAL CODE REVIEW (Zero-Compromise Audit)',
    },
    badges: {
      ckb: 'ئاستی ئەندازیاری باڵا 🎯',
      kmr: 'ئاستێ ئەندازیارێن بلند 🎯',
      ar: 'معيار هندسي صارم 🎯',
      en: 'Staff Engineer Bar 🎯',
    },
    shortDesc: {
      kmr: 'پێداچوونا کۆدی ب تووندی بۆ دیتنا هەمی کەلێنێن ئاسایش، میمۆری و لاوازییێن ئەندازیاری.',
      ar: 'فحص صارم وشامل للكود لاكتشاف الثغرات الأمنية ومشاكل الأداء والأخطاء التصميمية قبل النشر.',
    },
    directiveExplanation: {
      kmr: 'پێشنیارێن سادە و پەسنا بێسوود ڕادوەستینیت و ب تەمامی باسێ SQL Injection، Memory Leak و Clean Code دکەت.',
      ar: 'يكسر عادة المجاملة في الردود ويفكك الثغرات، سباقات البيانات، وتسريبات الذاكرة بدقة.',
    },
    whenToUse: {
      kmr: 'بەری هنارتنا پڕۆژەی بۆ پرۆدەکشنی یان بەری ئەزموونا کاری.',
      ar: 'قبل رفع الكود إلى بيئة الإنتاج أو تقديمه في مقابلات التوظيف.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: BRUTAL CODE REVIEW]
وەک ئەندازیارەکێ سەرەکی یێ توند پێداچوونێ ل کۆدێ من بکە:
١. کەلێنێن ئاسایشێ (XSS / Injection / Auth).
٢. کێشێن لەزاتی و میمۆریێ (Re-renders / Memory Leaks).
٣. ناڕێکی د ناڤونان و بنەمایێن Clean Code دا.
٤. کۆدێ چاککری پێشکێش بکە.

کۆد:
[کۆدێ خۆ ل ڤێرێ دانێ]`,
      ar: `[DIRECTIVE: BRUTAL CODE REVIEW]
راجع كودي بصرامة مهندس معماري رئيسي دون مجاملة:
١. الثغرات الأمنية المحتملة (XSS / SQLi / Auth).
٢. الاختناقات في الأداء وتسريب الذاكرة.
٣. ضعف تسمية المتغيرات ومخالفة Clean Code.
٤. أعد كتابة الكود بأعلى معيار احترافي.

الكود:
[ضع الكود هنا]`,
      en: `[DIRECTIVE: BRUTAL CODE REVIEW]
Audit my code like a strict Principal Engineer with zero sugarcoating:
1. Security vulnerabilities (XSS, injection, auth bypasses).
2. Performance bottlenecks, memory leaks, unnecessary re-renders.
3. Naming smells and Clean Code violations.
4. Provide the hardened, refactored version.

Code:
[Paste code here]`,
    },
    exampleSnippets: {
      kmr: 'BRUTAL CODE REVIEW: ڤی کۆدێ پەڕێ پارەدانێ بخوینە و هەمی کەلێنێن ئەمنی و لۆجیکی ئاشکرا بکە.',
      ar: 'BRUTAL CODE REVIEW: افحص كود صفحة الدفع هذا واكشف كل ثغرة أمنية أو خطأ منطقي.',
      en: 'BRUTAL CODE REVIEW: Tear apart this checkout endpoint and expose any race conditions or validation gaps.',
    },
  },
  'socratic-mentor': {
    names: {
      ckb: 'SOCRATIC MENTOR (مامۆستای سوقراتی)',
      kmr: 'SOCRATIC MENTOR (مامۆستایێ سوقراتی)',
      ar: 'SOCRATIC MENTOR (المعلم السقراطي)',
      en: 'SOCRATIC MENTOR (Guided Discovery)',
    },
    badges: {
      ckb: 'تێگەیشتنی قووڵ 🧠',
      kmr: 'تێگەهشتنا کویر 🧠',
      ar: 'فهم عميق 🧠',
      en: 'Deep Mastery 🧠',
    },
    shortDesc: {
      kmr: 'فێربوون ب ڕێکا پرسیارێن زیرەک دا کو تو بخۆ فەنکشنێ بنڤیسی ل جهێ کۆپیکرنێ.',
      ar: 'توجيهك عبر أسئلة استراتيجية لتستنتج الحل بنفسك بدلاً من النسخ الجاهز.',
    },
    directiveExplanation: {
      kmr: 'مامۆستا وەڵاما ئامادەکری نادەت، بەلکو ب هێنت و پرسیاران مێشکێ تە بەردەوام چالاک دکەت.',
      ar: 'يعزّز التعلّم النشط وترسيخ المفاهيم عبر الاكتشاف الموجه.',
    },
    whenToUse: {
      kmr: 'دەمێ خۆئامادەکرنێ بۆ چاڤپێکەوتنان یان حلکرنا پرسیارا ڕۆژێ.',
      ar: 'أثناء التدريب على المقابلات البرمجية أو حل تحديات الكود اليومية.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: SOCRATIC MENTOR]
تو مامۆستایێ من یێ سوقراتی یی. ب چ ڕەنگان کۆدێ تەمام نەدە من!
١. بپرسە چاوا هزر د ڤێ کێشێ دا دکەم.
٢. تەنها ئاماژەکا (Hint) بچووک بدە.
٣. پێنگاڤ ب پێنگاڤ پرسیارا پاشتر بکە.

ئەو بابەتێ دڤێت فێربم:
[پرسیارێ ل ڤێرێ بنڤیسە]`,
      ar: `[DIRECTIVE: SOCRATIC MENTOR]
أنت معلمي السقراطي. لا تعطني الكود النهائي الجاهز أبداً:
١. اسألني كيف أفكر في هذه المشكلة حالياً.
٢. قدّم لي تلميحاً صغيراً يفتح لي المسار.
٣. كلما تقدمت خطوة، وجّهني بسؤال للخطوة التالية.

ما أريد تعلّمه:
[اكتب سؤالك هنا]`,
      en: `[DIRECTIVE: SOCRATIC MENTOR]
You are my Socratic engineering mentor. Never give me the finished code directly:
1. Ask how I am currently thinking through the problem.
2. Offer one strategic hint at a time.
3. Prompt my next step until I reach the solution myself.

Topic / Problem:
[Insert question here]`,
    },
    exampleSnippets: {
      kmr: 'SOCRATIC MENTOR: چاوا فەنکشنەکێ چێکەم پێلاڤێ پالیندرۆم بپشکنیت؟ پرسیاران ژ من بکە دا بخۆ بنڤیسم.',
      ar: 'SOCRATIC MENTOR: كيف أكتب دالة تتحقق مما إذا كانت الكلمة Palindrome؟ وجّهني بالأسئلة لأكتبها بنفسي.',
      en: 'SOCRATIC MENTOR: Guide me step-by-step with questions to write a palindrome checker without showing the answer.',
    },
  },
  'step-by-step': {
    names: {
      ckb: 'CHAIN OF THOUGHT ("با هەنگاو بە هەنگاو بیربکەینەوە")',
      kmr: 'CHAIN OF THOUGHT (دا پێنگاڤ ب پێنگاڤ هزر بکەین)',
      ar: 'CHAIN OF THOUGHT (التفكير المتسلسل خطوة بخطوة)',
      en: 'CHAIN OF THOUGHT (Step-by-Step Reasoning)',
    },
    badges: {
      ckb: 'سەلمێنراوی زانستی 📐',
      kmr: 'سەلماندی یێ زانستی 📐',
      ar: 'منهجية مثبتة علمياً 📐',
      en: 'Scientifically Proven 📐',
    },
    shortDesc: {
      kmr: 'ناڤدارترین فەرمانا زانستی بۆ کێمکرنا شاشییێن ئەلگۆریزم و بیرکاریێ د مۆدێلان دا.',
      ar: 'أشهر صيغة تفكير متسلسل لتقليل أخطاء المنطق والرياضيات في نماذج الذكاء الاصطناعي.',
    },
    directiveExplanation: {
      kmr: 'مۆدێل هەمی پێنگاڤێن ناڤبڕ پێکڤە گرێددەت بەری نڤیسینا کۆدێ دوماهیێ، ئەو ژی شاشییان کێم دکەت.',
      ar: 'يلزم النموذج بكتابة خطوات الاستنتاج الوسيطة قبل استخلاص النتيجة النهائية.',
    },
    whenToUse: {
      kmr: 'بۆ ئەلگۆریزمێن بیرکاری، Recursion و پەیوەندییێن ئاڵۆز.',
      ar: 'للخوارزميات الرياضية والمنطق المتشعب و Recursion.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: LET'S THINK STEP BY STEP]
هیڤیە ب شێوازێ زنجیرەیی (Chain of Thought) هزر بکە:
پێنگاڤ ١: داتایێن هاتن (Inputs) و دەرچوون (Outputs).
پێنگاڤ ٢: حالەتێن بنەڕەتی (Base Cases).
پێنگاڤ ٣: شیکرنا لووپ و مەرجان دێڕ ب دێڕ.
پێنگاڤ ٤: پێشکێشکرنا کۆدێ تەمام.

ئەرک:
[کێشا خۆ ل ڤێرێ دانێ]`,
      ar: `[DIRECTIVE: LET'S THINK STEP BY STEP]
فكّر بأسلوب سلسلة الأفكار (Chain of Thought):
الخطوة ١: تحديد المدخلات والمخرجات المتوقعة.
الخطوة ٢: تحديد الحالات الأساسية والحدية (Base Cases).
الخطوة ٣: تتبع الحلقات والمنطق سطراً بسطر.
الخطوة ٤: كتابة الكود النهائي المختبر.

المهمة:
[ضع المشكلة هنا]`,
      en: `[DIRECTIVE: LET'S THINK STEP BY STEP]
Reason sequentially using Chain of Thought:
Step 1: Define inputs and expected outputs cleanly.
Step 2: Identify base cases and invariants.
Step 3: Trace loop/state transitions step-by-step.
Step 4: Synthesize the clean final implementation.

Task:
[Insert problem here]`,
    },
    exampleSnippets: {
      kmr: 'LET\'S THINK STEP BY STEP: فەنکشنەکێ بنڤیسە بۆ هژمارتنا پەیڤێن دووبارە د دەقەکی دا و ڕێزبەندکرنا وان.',
      ar: 'LET\'S THINK STEP BY STEP: اكتب دالة تحسب تكرار كل كلمة في نص وترتبها تنازلياً.',
      en: 'LET\'S THINK STEP BY STEP: Build a frequency counter that ranks repeated words in descending order.',
    },
  },
  'clean-code-solid': {
    names: {
      ckb: 'CLEAN CODE & SOLID REFACTOR (ڕێکخستنەوەی مۆدێرن)',
      kmr: 'CLEAN CODE & SOLID REFACTOR (ڕێکخستنا مۆدێرن)',
      ar: 'CLEAN CODE & SOLID REFACTOR (إعادة الهيكلة الاحترافية)',
      en: 'CLEAN CODE & SOLID REFACTOR',
    },
    badges: {
      ckb: 'تەلارسازی پارێزراو 🧼',
      kmr: 'ئەندازیارییا پاقژ 🧼',
      ar: 'بنية نظيفة 🧼',
      en: 'Clean Architecture 🧼',
    },
    shortDesc: {
      kmr: 'گوهۆڕینا کۆدێ تێکەڵ (Spaghetti) بۆ کۆدێ مۆدێرن ل سەر بنەمایێن SOLID و DRY.',
      ar: 'تحويل الكود المتشابك المكرر إلى وحدات نظيفة قابلة للاختبار وفق مبادئ SOLID و DRY.',
    },
    directiveExplanation: {
      kmr: 'فەنکشنێن درێژ دابەش دکەتە یەکێن بچووک و دووبارەبوونێ ناهێلیت.',
      ar: 'يقسّم الدوال الكبيرة إلى مكونات صغيرة محددة المسؤولية ويمنع تكرار المنطق.',
    },
    whenToUse: {
      kmr: 'دەمێ پڕۆژە مەزن دبیت و هەر گوهۆڕینەک مەترسییا تێکچوونێ ل سەر بەشێن دی هەیە.',
      ar: 'عند تراكم الديون التقنية وصعوبة تعديل الكود بأمان.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: REFACTOR TO CLEAN CODE & SOLID]
ڤی کۆدی ژ نو بنڤیسە ل سەر ڤان یاسایان:
١. Single Responsibility: هەر فەنکشنەکێ ئێک کارێ دیار هەبیت.
٢. نەهێلانا دووبارەبوونێ (DRY).
٣. تایپێن تەمام یێن TypeScript یان Typed Python.
٤. کێمکرنا بکارئینانا میمۆری و کاتی.

کۆدێ کۆن:
[کۆدێ خۆ ل ڤێرێ دانێ]`,
      ar: `[DIRECTIVE: REFACTOR TO CLEAN CODE & SOLID]
أعد كتابة هذا الكود وفق القواعد التالية:
١. مبدأ المسؤولية الواحدة (Single Responsibility).
٢. إزالة التكرار (DRY).
٣. استخدام أنواع صارمة (TypeScript / Typed Python).
٤. تحسين الكفاءة وتبسيط التداخلات.

الكود القديم:
[ضع الكود هنا]`,
      en: `[DIRECTIVE: REFACTOR TO CLEAN CODE & SOLID]
Refactor this code following these rules:
1. Single Responsibility Principle for every function/module.
2. Eliminate duplicated branches (DRY).
3. Enforce strict TypeScript / typed contracts.
4. Shallow nesting and early returns.

Legacy code:
[Paste code here]`,
    },
    exampleSnippets: {
      kmr: 'REFACTOR TO SOLID: ئەڤ کۆدێ کرینێ هەمی د ئێک فەنکشن دایە؛ پارچە بکە بۆ پارەدان، داتابەیس و ئیمێل.',
      ar: 'REFACTOR TO SOLID: هذا الكود يدمج الدفع وقاعدة البيانات والإشعارات في دالة واحدة؛ قسّمه إلى خدمات مستقلة.',
      en: 'REFACTOR TO SOLID: Split this 200-line checkout handler into decoupled payment, persistence, and email helpers.',
    },
  },
  'reverse-prompt': {
    names: {
      ckb: 'REVERSE PROMPT ENGINEER (ئەندازیاری پێچەوانەی پرۆمپت)',
      kmr: 'REVERSE PROMPT ENGINEER (ئەندازیارییا پێچەوانە یا پرۆمپتی)',
      ar: 'REVERSE PROMPT ENGINEER (الهندسة العكسية للأوامر)',
      en: 'REVERSE PROMPT ENGINEER',
    },
    badges: {
      ckb: 'دروستکەری پرۆمپت 🔮',
      kmr: 'چێکەرێ پرۆمپتان 🔮',
      ar: 'صانع الأوامر 🔮',
      en: 'Prompt Builder 🔮',
    },
    shortDesc: {
      kmr: 'تو بەرهەمێ دوماهیێ ددەیێ، ئەو ژی باشترین سیستەم پرۆمپت بۆ دووبارەبەرهەمهێنانا وی ددەتە تە.',
      ar: 'تقدّم له النتيجة المطلوبة فيصمم لك أفضل System Prompt لإعادة توليد نفس الجودة تلقائياً.',
    },
    directiveExplanation: {
      kmr: 'شیکارییا شێواز و پێکهاتەیا بەرهەمی دکەت و پرۆمپتەکێ ستاندارد ددەت کو بشێی د AI API دا بکاربینی.',
      ar: 'يحلّل البنية والأسلوب والشروط في المثال المطلوب ليصوغ أمراً قابلاً لإعادة الاستخدام.',
    },
    whenToUse: {
      kmr: 'دەمێ تو دڤێت پرۆمپتەکێ پڕۆفیشناڵ بۆ ئۆتۆمەیشن یان ئەپەکێ چێکەی.',
      ar: 'عند بناء أوامر ثابتة لتدفقات الأتمتة وواجهات برمجة التطبيقات.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: REVERSE PROMPT ENGINEER]
تو شارەزایێ ئەندازیارییا پرۆمپتێ یی. من ئەڤ ئەنجامە دڤێت:
[دەق یان کۆدێ مەبەست ل ڤێرێ دانێ]

هیڤیە باشترین سیستەم پرۆمپت و خالێن ڕێنمایی بۆ من بنڤیسە دا کو هەر دەم هەمان کواڵێتی بدەت.`,
      ar: `[DIRECTIVE: REVERSE PROMPT ENGINEER]
بصفتك خبير هندسة أوامر (Prompt Engineer)، أريد الوصول إلى هذا المخرج النموذجي:
[ضع النتيجة أو الكود المطلوب هنا]

صغ لي أفضل System Prompt وقواعد واضحة تضمن إنتاج نفس النتيجة بدقة متكررة.`,
      en: `[DIRECTIVE: REVERSE PROMPT ENGINEER]
Act as a Principal Prompt Engineer. Here is my target output artifact:
[Paste sample output here]

Reverse-engineer a concise, reusable System Prompt and constraints to reproduce this output reliably.`,
    },
    exampleSnippets: {
      kmr: 'REVERSE PROMPT: دڤێم فۆرما لۆگین ب React و فرە-زمان چێکەم؛ باشترین پرۆمپت چییە؟',
      ar: 'REVERSE PROMPT: أريد صياغة أمر احترافي لتوليد نماذج تسجيل دخول متعددة اللغات في React.',
      en: 'REVERSE PROMPT: Design a reusable prompt that generates accessible, RTL-ready React form components.',
    },
  },
  'devils-advocate': {
    names: {
      ckb: 'DEVIL’S ADVOCATE & RED TEAMING (تاقیکردنەوەی هێرش و شکست)',
      kmr: 'DEVIL’S ADVOCATE & RED TEAMING (تاقیکرنا ئاسایش و شکەستێ)',
      ar: 'DEVIL’S ADVOCATE & RED TEAMING (اختبار الاختراق والأمان)',
      en: 'DEVIL’S ADVOCATE & RED TEAMING',
    },
    badges: {
      ckb: 'ئەمنییەت و پاراستن 🛡️',
      kmr: 'ئەمنیەت و پاراستن 🛡️',
      ar: 'أمان وحماية 🛡️',
      en: 'Security Red Team 🛡️',
    },
    shortDesc: {
      kmr: 'مۆدێل ڕۆلێ هاککەرەکی دگێڕیت بۆ ئاشکراکرنا هەمی کەلێنێن ئەمنی و شکەستێن سیستەمی.',
      ar: 'يتقمص دور مهاجم متمرس لاكتشاف ثغرات النظام وحالات التحايل قبل الإطلاق الفعلي.',
    },
    directiveExplanation: {
      kmr: 'هەمی مەترسیێن وەک Race Condition، DDoS، گوهۆڕینا نرخ و دزینا داتایان دپشکنیت.',
      ar: 'يحاكي اختبارات الاختراق على المصادقة وحدود المعدل والمدفوعات وحقن البيانات.',
    },
    whenToUse: {
      kmr: 'بەری دەستپێکرنا سیستەمێ پارەدانێ یان لۆگینێ.',
      ar: 'خطوة أساسية قبل إطلاق بوابات الدفع، التسجيل، ونقاط الـ API الحساسة.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: DEVIL'S ADVOCATE & RED TEAM]
تو لێکۆلەرەکێ ئاسایشێ یێ توند (Red Team)ی. ڤی کۆدی یان سیستەمی بپشکنە:
١. چاوا دکارن ب گوهۆڕینا پارامیتەران فێڵێ ل ڤی سیستەمی بکەن؟
٢. ل کیرێ مەترسییا Race Condition یان شکەستنا سێرڤەری هەیە؟
٣. کۆدێ پاراستنێ بنڤیسە بۆ گرتنا ڤان کەلێنان.

سیستەم/کۆد:
[کۆدێ خۆ ل ڤێرێ دانێ]`,
      ar: `[DIRECTIVE: DEVIL'S ADVOCATE & RED TEAM]
تقمّص دور مختبر اختراق هجومي (Red Team) وافحص هذا النظام:
١. كيف يمكن استغلال المعاملات أو التحايل على هذا المنطق؟
٢. أين تكمن مخاطر Race Conditions أو سقوط الخادم تحت الضغط؟
٣. قدّم كود الحماية لإغلاق كل ثغرة تكتشفها.

الكود/التصميم:
[ضع الكود أو الوصف هنا]`,
      en: `[DIRECTIVE: DEVIL'S ADVOCATE & RED TEAM]
Act as an adversarial Security Red Teamer reviewing this system:
1. How could an attacker spoof, bypass, or tamper with parameters?
2. Where are race conditions or DoS exhaustion vectors possible?
3. Provide the concrete code patches to close each vulnerability.

System / Code:
[Paste code or spec here]`,
    },
    exampleSnippets: {
      kmr: 'DEVIL\'S ADVOCATE: ئەڤ API یا نوێکرنا بالانسێ بکاردهێت، چاوا ڕێگریێ ل Race Condition بکەین؟',
      ar: 'DEVIL\'S ADVOCATE: نستخدم هذا الـ API لتحديث الرصيد عبر ZainCash و FIB؛ كيف نمنع ثغرة Race Condition؟',
      en: 'DEVIL\'S ADVOCATE: Audit this payment webhook and wallet credit flow for double-spend or replay attacks.',
    },
  },
  'analogy-master': {
    names: {
      ckb: 'ANALOGY MASTER (مامۆستای لێکچواندن)',
      kmr: 'ANALOGY MASTER (مامۆستایێ لێکچوواندنێ)',
      ar: 'ANALOGY MASTER (أستاذ التشبيهات الواقعية)',
      en: 'ANALOGY MASTER (Real-World Metaphors)',
    },
    badges: {
      ckb: 'فێربوونی شێوەیی 🧩',
      kmr: 'فێربوونا وێنەیی 🧩',
      ar: 'فهم بصري 🧩',
      en: 'Visual Thinking 🧩',
    },
    shortDesc: {
      kmr: 'شیکرنا تەکنەلۆژیایێن ئاڵۆز ب گرێدان ب ژیانا ڕۆژانە وەک فڕۆکەخانە، بانک و چێشتخانە.',
      ar: 'ربط البنى الهندسية المجردة بآليات واقعية مألوفة كالمطارات والمصارف والمدن.',
    },
    directiveExplanation: {
      kmr: 'سیستەمێن بەڵاڤکری وەک Kafka یان Load Balancer دکەتە نەخشەیێن ڕاستەقینە کو مێشک بلەز تێبگەهیت.',
      ar: 'ينقل المفاهيم الموزعة إلى أمثلة ملموسة تسهل استيعاب تدفق البيانات والتعافي من الأعطال.',
    },
    whenToUse: {
      kmr: 'دەمێ ڕۆهنکرنا تەکنەلۆژیایێ بۆ کڕیار یان قوتابیێن نوو.',
      ar: 'عند تدريب المطورين الجدد أو شرح الخيارات المعمارية لغير التقنيين.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: ANALOGY MASTER]
ڤێ تەکنەلۆژیایێ بۆ من شیکار بکە ب نموونەیەکا ژیانا ڕاستەقینە:
١. ئەکتەر و ڕۆلێن وان چینە؟
٢. پێزانین چاوا دچن و ل کیرێ دمینن؟
٣. دەمێ ئاریشە دروست دبیت چ ڕووددەت؟

تەکنەلۆژیا:
[ناڤێ تەکنەلۆژیایێ بنڤیسە]`,
      ar: `[DIRECTIVE: ANALOGY MASTER]
اشرح هذه التقنية عبر تشبيه واقعي مترابط:
١. من هي الشخصيات وما دور كل منها؟
٢. كيف تنتقل البيانات وأين تتوقف؟
٣. ماذا يحدث في السيناريو الواقعي عند حدوث عطل؟

التقنية:
[اكتب التقنية هنا]`,
      en: `[DIRECTIVE: ANALOGY MASTER]
Explain this technology through one coherent real-world analogy:
1. Who are the actors and their exact roles?
2. How do requests/data move through the system?
3. What happens when something fails or overflows?

Technology:
[Insert topic here]`,
    },
    exampleSnippets: {
      kmr: 'ANALOGY MASTER: جوداهی د ناڤبەرا WebSockets و HTTP REST دا وەک پەیوەندییا تەلەفۆنێ و نامەیێ شڕۆڤە بکە.',
      ar: 'ANALOGY MASTER: اشرح الفرق بين WebSockets و HTTP REST بتشبيه المكالمة الهاتفية مقابل الرسالة البريدية.',
      en: 'ANALOGY MASTER: Contrast WebSockets and HTTP REST using a phone call vs. postal mail metaphor.',
    },
  },
  'algo-optimizer': {
    names: {
      ckb: 'BIG-O OPTIMIZER (ڕێکخەری خێرایی و میمۆری)',
      kmr: 'BIG-O OPTIMIZER (باشترکەرێ لەزاتی و میمۆریێ)',
      ar: 'BIG-O OPTIMIZER (محسّن السرعة والتعقيد الزمني)',
      en: 'BIG-O OPTIMIZER (Time & Space Tuning)',
    },
    badges: {
      ckb: 'خێرایی بێوێنە ⚡',
      kmr: 'لەزاتییا بێ وێنە ⚡',
      ar: 'أداء فائق ⚡',
      en: 'Peak Speed ⚡',
    },
    shortDesc: {
      kmr: 'ئانالیزا Big-O و کێمکرنا دەما جێبەجێکرنێ ژ O(N²) بۆ O(N) یان O(1).',
      ar: 'تحليل التعقيد الزمني والمكاني Big-O واستبدال الحلقات المتداخلة بخوارزميات O(N) و HashMaps.',
    },
    directiveExplanation: {
      kmr: 'لووپێن د ناڤ لووپان دا دگوهۆڕیت بۆ HashMap, Set یان Sliding Window.',
      ar: 'يكشف عن اختناقات الأداء عند ضخامة البيانات ويعيد كتابة الخوارزمية بكفاءة خطية.',
    },
    whenToUse: {
      kmr: 'دەمێ سیستەم ل سەر داتایێن مەزن خاو دبیت یان د چالێنجێن ئەلگۆریتمان دا.',
      ar: 'عند بطء الواجهات مع المصفوفات الكبيرة أو في تحديات البرمجة التنافسية.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: BIG-O OPTIMIZER]
ڤی کۆدی شیکار بکە ژ لایێ Time و Space Complexity ڤە:
١. نها Big-O چەندە؟
٢. سەدەمێ سەرەکی یێ خاوبوونێ چییە؟
٣. چاوا ب HashMap یان Set بکەینە O(N) یان O(log N)؟

کۆد:
[کۆدێ خۆ ل ڤێرێ دانێ]`,
      ar: `[DIRECTIVE: BIG-O OPTIMIZER]
حلّل هذا الكود من حيث الوقت (Time Complexity) والذاكرة (Space Complexity):
١. ما القيمة الحالية لـ Big-O؟
٢. أين يقع سبب البطء الأكبر؟
٣. كيف نحوّله إلى O(N) أو O(log N) باستخدام HashMap أو Set؟

الكود:
[ضع الكود هنا]`,
      en: `[DIRECTIVE: BIG-O OPTIMIZER]
Analyze this code for Time & Space Complexity:
1. Current Big-O bounds.
2. Primary computational or allocation bottleneck.
3. Optimize to O(N) or O(log N) using Maps, Sets, or sliding windows.

Code:
[Paste code here]`,
    },
    exampleSnippets: {
      kmr: 'BIG-O OPTIMIZER: ئەڤ فەنکشنە ب دوو لووپان ل ٢٠٠ هزار داتایان دگەڕیت (O(N²))؛ چاوا بکەمە O(N)؟',
      ar: 'BIG-O OPTIMIZER: هذه الدالة تستخدم حلقتين متداخلتين لـ ٢٠٠ ألف سجل؛ كيف أحولها إلى O(N)؟',
      en: 'BIG-O OPTIMIZER: Optimize this nested O(N²) user-matching loop down to O(N) time.',
    },
  },
  'sql-wizard': {
    names: {
      ckb: 'SQL & QUERY WIZARD (شارەزای بنکەدراوە)',
      kmr: 'SQL & QUERY WIZARD (شارەزایێ بنگەهێ داتایان)',
      ar: 'SQL & QUERY WIZARD (خبير استعلامات قواعد البيانات)',
      en: 'SQL & QUERY WIZARD (Database Performance)',
    },
    badges: {
      ckb: 'پارێزەری داتابەیس 🗄️',
      kmr: 'پارێزەرێ داتابەیسێ 🗄️',
      ar: 'حارس قاعدة البيانات 🗄️',
      en: 'DBA Mastery 🗄️',
    },
    shortDesc: {
      kmr: 'پشکنینا SQL کوێرییان، دروستکرنا Index و نەهێلانا کێشا N+1 Query.',
      ar: 'كتابة وتحسين استعلامات SQL وبناء الفهارس المركبة والقضاء على مشكلة N+1 Query.',
    },
    directiveExplanation: {
      kmr: 'سکانا تەمام یا خشتەیان لادەت و Composite Indexێن دروست دیاری دکەت.',
      ar: 'يطبق منطق EXPLAIN ANALYZE لتقليل زمن الاستجابة إلى أقل من 10ms.',
    },
    whenToUse: {
      kmr: 'دگەل PostgreSQL, MySQL, SQLite یان Prisma/Supabase.',
      ar: 'عند العمل على قواعد بيانات PostgreSQL و MySQL و Supabase أو ORM مثل Prisma.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: SQL & QUERY WIZARD]
وەک شارەزایێ DBA ئەڤێ داخوازیێ وەربگرە:
١. باشترین SQL کوێری بنڤیسە.
٢. چ Composite Index پێدڤیە دا کو دەم کێمتر بیت ژ 10ms؟
٣. چاوا ڕێگریێ ل N+1 Query د ناڤ ORM دا بکەین؟

داخوازی:
[خشتە یان کوێرییا خۆ بنڤیسە]`,
      ar: `[DIRECTIVE: SQL & QUERY WIZARD]
بصفتك مدير قواعد بيانات خبير (Lead DBA):
١. اكتب أفضل استعلام SQL حديث.
٢. ما الفهارس المركبة (Composite Indexes) المطلوبة لخفض الزمن تحت 10ms؟
٣. كيف نتجنب مشكلة N+1 Query داخل ORM؟

المطلوب:
[صف الجداول أو الاستعلام هنا]`,
      en: `[DIRECTIVE: SQL & QUERY WIZARD]
Act as a Lead DBA and optimize this database query:
1. Provide the clean, modern SQL query.
2. Specify the exact Composite Indexes needed for <10ms latency.
3. Explain how to eliminate any N+1 queries in ORM usage.

Schema / Query:
[Describe tables or query here]`,
    },
    exampleSnippets: {
      kmr: 'SQL WIZARD: داهاتا مەهانە یا هەر پڕۆژەیەکێ بێی خاوکرنا داتابەیسێ هەژمار بکە.',
      ar: 'SQL WIZARD: اكتب استعلاماً يحسب متوسط الدخل الشهري لكل مشروع دون إبطاء قاعدة البيانات.',
      en: 'SQL WIZARD: Aggregate monthly revenue per project across indexed orders tables without N+1 overhead.',
    },
  },
  'tdd-first': {
    names: {
      ckb: 'TDD FIRST (سەرەتا نووسینی تاقیکردنەوە)',
      kmr: 'TDD FIRST (دەستپێکێ نڤیسینا تێستان)',
      ar: 'TDD FIRST (الاختبار أولاً قبل الكود)',
      en: 'TDD FIRST (Red-Green-Refactor)',
    },
    badges: {
      ckb: 'بێ هەڵە لە سەرەتاوە 🧪',
      kmr: 'بێ شاشی ژ دەستپێکێ 🧪',
      ar: 'بلا أخطاء منذ البداية 🧪',
      en: 'Test-First Quality 🧪',
    },
    shortDesc: {
      kmr: 'نڤیسینا تێستان بەری کۆدی ب سیستەمێ Red-Green-Refactor دا چ بەش تێکنەچن.',
      ar: 'تطبيق تطوير البرمجة الموجّه بالاختبارات (TDD) بكتابة حالات الفحص قبل الشيفرة الإنتاجية.',
    },
    directiveExplanation: {
      kmr: 'ڕێگریێ دکەت ژ نڤیسینا کۆدێ بێ تێست و هەمی حالەتێن دەگمەن دەستپێکێ دپشکنیت.',
      ar: 'يضمن التزام التنفيذ بالمواصفات ١٠٠٪ وحماية الدوال الحساسة من التراجعات.',
    },
    whenToUse: {
      kmr: 'بۆ فەنکشنێن پارەدانێ، پشکنینا پاسۆردێ و کارێن هەستیار.',
      ar: 'عند بناء دوال التحقق المالي، المصادقة، والحسابات الدقيقة.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: TDD FIRST]
ب سیستەمێ Red-Green-Refactor کار بکە:
پێنگاڤ ١: سەرەتا Unit Tests ب Jest یان PyTest بنڤیسە بۆ هەمی حالەتان.
پێنگاڤ ٢: پاشان کەمترین و پاقژترین کۆد بنڤیسە بۆ سەرکەفتنا تێستان.
پێنگاڤ ٣: ڕۆهن بکە کا تێست چاوا پشتڕاستییێ ددەن.

فەنکشن:
[فەنکشنێ ل ڤێرێ بنڤیسە]`,
      ar: `[DIRECTIVE: TDD FIRST]
اتبع منهجية TDD الرسمية (Red-Green-Refactor):
الخطوة ١: اكتب اختبارات الوحدة (Jest أو PyTest) لتغطية جميع الحالات الحدية أولاً.
الخطوة ٢: اكتب أنظف كود يحقق نجاح جميع الاختبارات.
الخطوة ٣: اشرح كيف تضمن هذه الاختبارات موثوقية الدالة.

الدالة المطلوبة:
[صف الدالة هنا]`,
      en: `[DIRECTIVE: TDD FIRST]
Follow strict Red-Green-Refactor TDD:
Step 1: Write comprehensive unit tests (Vitest/Jest/PyTest) covering edge cases first.
Step 2: Write the minimal, cleanest implementation passing every assertion.
Step 3: Note any invariants verified by the suite.

Specification:
[Describe feature or function here]`,
    },
    exampleSnippets: {
      kmr: 'TDD FIRST: سەرەتا تێستێن Jest بۆ Password Validator بنڤیسە پاشان فەنکشنێ.',
      ar: 'TDD FIRST: اكتب اختبارات Jest للتحقق من قوة كلمة المرور أولاً ثم اكتب الدالة.',
      en: 'TDD FIRST: Write Jest unit tests for a password strength validator before implementing it.',
    },
  },
  'api-contract': {
    names: {
      ckb: 'API CONTRACT DESIGNER (داڕێژەری پەیماننامەی ڕاژەکار)',
      kmr: 'API CONTRACT DESIGNER (نەخشەکێشێ گرێبەستا API)',
      ar: 'API CONTRACT DESIGNER (مصمم عقود الـ API)',
      en: 'API CONTRACT DESIGNER',
    },
    badges: {
      ckb: 'پەیوەندی پاک لە نێوان تیم 🤝',
      kmr: 'هەڤکارییا پاقژ د ناڤ تیمی دا 🤝',
      ar: 'توافق مثالي للفرق 🤝',
      en: 'Team Alignment 🤝',
    },
    shortDesc: {
      kmr: 'دیزاینکرنا پەیماننامەیا JSON و تایپێن TypeScript بەری فرۆنتێند و باکئێند دەست پێ بکەن.',
      ar: 'تحديد عقود JSON ورموز الحالة وأخطاء API ومخططات TypeScript قبل بدء البرمجة.',
    },
    directiveExplanation: {
      kmr: 'ڕێگریێ دکەت ژ نەگونجانا ناڤێ کلیلان د ناڤبەرا باکئێند و فرۆنتێندێ دا.',
      ar: 'يوحّد التوقعات بين الواجهة الأمامية والخلفية منذ اللحظة الأولى.',
    },
    whenToUse: {
      kmr: 'دەستپێکا هەر تایبەتمەندییەکا نوو یا ناڤبەرا فرۆنتێند و سێرڤەری دا.',
      ar: 'قبل تطوير أي ميزة جديدة تعتمد على تبادل البيانات مع الخادم.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: API CONTRACT DESIGNER]
پەیماننامەیا API بۆ ڤێ تایبەتمەندییێ بنڤیسە:
١. Endpoint (نموونە POST /api/v1/orders).
٢. Request Body و Response (200/201) ب JSON.
٣. کۆدێن شاشییان (400, 401, 403, 404, 500).
٤. تایپێن هەڤپشک یێن TypeScript.

تایبەتمەندی:
[ل ڤێرێ ڕۆهن بکە]`,
      ar: `[DIRECTIVE: API CONTRACT DESIGNER]
صمّم عقد الـ API الرسمي لهذه الميزة:
١. مسار Endpoint وطريقة HTTP.
٢. بنية الطلب (Request JSON) والاستجابة الناجحة (200/201).
٣. جميع حالات الأخطاء (400, 401, 403, 404, 500).
٤. ملف أنواع TypeScript المشترك للواجهة والخادم.

الميزة:
[اشرح الميزة هنا]`,
      en: `[DIRECTIVE: API CONTRACT DESIGNER]
Define the canonical API contract for this feature:
1. HTTP method and endpoint route.
2. Request JSON schema & success responses (200/201).
3. Structured error payloads (400, 401, 403, 404, 500).
4. Shared TypeScript interfaces for client & server.

Feature:
[Describe feature here]`,
    },
    exampleSnippets: {
      kmr: 'API CONTRACT: گرێبەستا API یا نوێکرنا پڕۆفایل و ئاڤاتارێ بکارهێنەری بنڤیسە.',
      ar: 'API CONTRACT: صمّم عقد تحديث ملف المستخدم مع الصورة الرمزية واللغة المختارة.',
      en: 'API CONTRACT: Draft the REST contract and TS types for updating user locale, theme, and profile avatar.',
    },
  },
  'crash-autopsy': {
    names: {
      ckb: 'TERMINAL CRASH AUTOPSY (شیکاری هەڵەی کەوتن)',
      kmr: 'TERMINAL CRASH AUTOPSY (شیکرنا شاشیا تێرمینالێ)',
      ar: 'TERMINAL CRASH AUTOPSY (تشريح أعطال الطرفية)',
      en: 'TERMINAL CRASH AUTOPSY',
    },
    badges: {
      ckb: 'چارەسەری هەڵەی تێرمیناڵ 🚨',
      kmr: 'چارەسەریا بلەز یا تێرمینالێ 🚨',
      ar: 'تشخيص الأعطال الحرجة 🚨',
      en: 'Rapid Diagnostics 🚨',
    },
    shortDesc: {
      kmr: 'شیکرنا لاگێن سوور یێن تێرمینالێ و دیارکرنا ڕاستەوخۆ یا فایلی و فەرمانێ چاککرنێ.',
      ar: 'تحليل مخرجات الخطأ الحمراء (Stack Trace) وتحديد الملف والسطر وأمر الإصلاح الفوري.',
    },
    directiveExplanation: {
      kmr: 'لاپەڕێن درێژ یێن هەڵەیێ کورت دکەتە سەدەمێ ڕاستەقینە و پێنگاڤێن چاککرنێ.',
      ar: 'يتجاوز الضجيج النصي في السجلات لعزل سبب الخطأ الدقيق.',
    },
    whenToUse: {
      kmr: 'دەمێ سێرڤەر ناکەڤیتە کار یان Build Error ڕووددەت.',
      ar: 'عند توقف البناء (Build Error) أو تعطل الخادم فجأة.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: TERMINAL CRASH AUTOPSY]
ڤێ هەڵەیا تێرمینالێ ب هویربینی شیکار بکە:
١. ڕەهـ و سەدەمێ سەرەکی چییە (Root Cause)؟
٢. کیژ فایل و کیژ دێڕ بەرپرسیارە؟
٣. فەرمانێ تێرمینالێ یان گوهۆڕینا پێدڤی چییە؟

دەقێ هەڵەیێ:
[لاگێ هەڵەیێ ل ڤێرێ کۆپی بکە]`,
      ar: `[DIRECTIVE: TERMINAL CRASH AUTOPSY]
حلّل سجل الخطأ هذا بدقة:
١. ما السبب الجذري للعطل (Root Cause)؟
٢. ما الملف ورقم السطر المسؤول تحديداً؟
٣. ما أمر الطرفية أو التعديل المطلوب للإصلاح بخطوات مرقمة؟

سجل الخطأ:
[الصق الخطأ هنا]`,
      en: `[DIRECTIVE: TERMINAL CRASH AUTOPSY]
Analyze this terminal error / stack trace immediately:
1. Exact root cause in plain terms.
2. Responsible file path, line number, or missing dependency.
3. Exact numbered terminal commands or code fix required.

Error log:
[Paste stack trace here]`,
    },
    exampleSnippets: {
      kmr: 'TERMINAL CRASH: Error [ERR_MODULE_NOT_FOUND]: lucide-react نەهاتە دیتن; چاوا چارەسەر بکەم؟',
      ar: 'TERMINAL CRASH: خطأ ERR_MODULE_NOT_FOUND لحزمة lucide-react؛ ما سبب المشكلة وما الحل؟',
      en: 'TERMINAL CRASH: ERR_MODULE_NOT_FOUND for lucide-react during Vite build — diagnose and fix.',
    },
  },
  'system-architect': {
    names: {
      ckb: 'SYSTEM ARCHITECT (تەلارسازی بۆ ١ ملیۆن بەکارهێنەر)',
      kmr: 'SYSTEM ARCHITECT (ئەندازیارییا سیستەمی بۆ ١ ملیۆن بکارهێنەران)',
      ar: 'SYSTEM ARCHITECT (هندسة أنظمة لمليون مستخدم)',
      en: 'SYSTEM ARCHITECT (1M+ Scale)',
    },
    badges: {
      ckb: 'تەلارسازی بەهێز 🏛️',
      kmr: 'تەلارسازییا بهێز 🏛️',
      ar: 'معمارية عالية التوسع 🏛️',
      en: 'Enterprise Scale 🏛️',
    },
    shortDesc: {
      kmr: 'دیزاینکرنا سیستەم و داتابەیسێ دا کو بێی خاوبوون بەرگەیا ١ ملیۆن بکارهێنەران بگریت.',
      ar: 'تصميم بنية أنظمة قابلة للتوسع تتحمل ملايين المستخدمين مع التخزين المؤقت وطوابير المهام.',
    },
    directiveExplanation: {
      kmr: 'هەلبژارتن د ناڤبەرا Monolith و Microservices و پلانا Redis Caching و Rate Limiting دیار دکەت.',
      ar: 'يقارن الخيارات المعمارية ويحدد طبقات Redis و CDN و Queues.',
    },
    whenToUse: {
      kmr: 'ل دەستپێکا پڕۆژەیەکێ مەزن یان دەمێ گەشەسەندنا بلەز.',
      ar: 'عند التخطيط لأنظمة ضخمة أو معالجة اختناقات التوسع.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: SYSTEM ARCHITECT - 1M USERS]
وەک ئەندازیارێ تەلارسازیێ کار بکە بۆ سیستەمەکێ کو بگەهیتە ١ ملیۆن بکارهێنەران:
١. دیزاینا گشتی (Modular Monolith یان Microservices؟).
٢. پلانا داتابەیس و Redis / CDN Caching.
٣. پاراستن ژ قەرەبالغیێ ب Rate Limiting & Queues.

سیستەم:
[پڕۆژەیێ خۆ بناسینە]`,
      ar: `[DIRECTIVE: SYSTEM ARCHITECT - 1M USERS]
بصفتك مهندس معمارية رئيسي لنظام يستهدف أكثر من مليون مستخدم:
١. اقترح البنية العامة (Modular Monolith أم Microservices؟).
٢. صمّم خطة قاعدة البيانات وطبقات Caching (Redis / CDN).
٣. كيف نحمي النظام من الذروة عبر Rate Limiting و Queues؟

المشروع:
[صف النظام هنا]`,
      en: `[DIRECTIVE: SYSTEM ARCHITECT - 1M USERS]
Act as Principal System Architect designing for 1M+ concurrent users:
1. Overall architecture (Modular Monolith vs Microservices trade-offs).
2. Database topology, sharding/read-replicas, and Redis/CDN caching.
3. Overload protection via Rate Limiting and background Queues.

System:
[Describe project here]`,
    },
    exampleSnippets: {
      kmr: 'SYSTEM ARCHITECT: تەلارسازییا پلاتفۆرمەکا پەخشا زیندی و چاتا بلەز بۆ سەدان هزار بکارهێنەران دابڕێژە.',
      ar: 'SYSTEM ARCHITECT: صمّم معمارية منصة بث مباشر ودردشة فورية لمئات الآلاف من المستخدمين المتزامنين.',
      en: 'SYSTEM ARCHITECT: Design a live-streaming and real-time chat architecture for 250k concurrent viewers.',
    },
  },
  'mental-model': {
    names: {
      ckb: 'MENTAL MODEL MAPPING (نەخشەی مۆدێلی زەینی)',
      kmr: 'MENTAL MODEL MAPPING (نەخشەیا مۆدێلێ هزری)',
      ar: 'MENTAL MODEL MAPPING (خرائط النماذج الذهنية)',
      en: 'MENTAL MODEL MAPPING',
    },
    badges: {
      ckb: 'مامۆستای گۆڕانی بیرکردنەوە 🧠',
      kmr: 'گوهۆڕینا شێوازێ هزرکرنێ 🧠',
      ar: 'تطوير الفكر البرمجي 🧠',
      en: 'Paradigm Shift 🧠',
    },
    shortDesc: {
      kmr: 'چاوا شێوازێ هزرکرنا خۆ بگوهۆڕی دەمێ تو ژ زمانەکی (وەک JS/Python) دچیە Rust یان C++؟',
      ar: 'رسم الفروقات الفكرية الجوهرية عند الانتقال بين لغات ذات فلسفات مختلفة مثل Python إلى Rust.',
    },
    directiveExplanation: {
      kmr: 'سێ شاشییێن مەزن یێن فێرخوازێن زمانی کۆن ئاشکرا دکەت و فەلسەفەیا زمانی نوو ڕۆهن دکەت.',
      ar: 'يكشف العادات الخاطئة المنقولة من اللغة السابقة ويقدّم مقارنة كودية واضحة.',
    },
    whenToUse: {
      kmr: 'دەمێ فێربوونا زمانەکێ نوو وەک Rust, Go یان C++.',
      ar: 'عند تعلّم لغة جديدة بفلسفة مختلفة تماماً مثل Rust أو C++ أو Go.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: MENTAL MODEL MAPPING]
ئەز ژ زمانێ [زمانێ کۆن] دێم و نها فێری [زمانێ نوو] دبم:
١. گەورەترین ٣ شاشییێن هزری یێن کو بکارهێنەرێن زمانی کۆن دکەن چینە؟
٢. فەلسەفە و مۆدێلێ هزری یێ زمانێ نوو چییە؟
٣. بەراوردەکێ کۆدی د ناڤبەرا هەردوو زمانان دا نیشان بدە.`,
      ar: `[DIRECTIVE: MENTAL MODEL MAPPING]
أنتقل من لغة [اللغة القديمة] إلى تعلم [اللغة الجديدة]:
١. ما أكبر ٣ أخطاء ذهنية يقع فيها المبرمج القادم من لغتي السابقة؟
٢. ما الفلسفة الأساسية والنموذج الذهني للغة الجديدة؟
٣. قارن بمثال كودي متطابق يرسّخ الفرق في الفهم.`,
      en: `[DIRECTIVE: MENTAL MODEL MAPPING]
I am transitioning from [Previous Language] to [New Language]:
1. What are the top 3 mental-model mistakes people from my background make?
2. How does the new language's core philosophy differ?
3. Show side-by-side idiomatic code comparisons.`,
    },
    exampleSnippets: {
      kmr: 'MENTAL MODEL: ٤ سالان Python نڤیسیە و نها دچمە سەر Rust؛ چاوا Ownership تێبگەهم؟',
      ar: 'MENTAL MODEL: أبرمج بلغة Python منذ ٤ سنوات؛ كيف أفهم Ownership و Lifetimes في Rust بعقلية صحيحة؟',
      en: 'MENTAL MODEL: After 4 years of Python, help me build the right mental model for Rust Ownership and Lifetimes.',
    },
  },
  'readme-pro': {
    names: {
      ckb: 'README & DOCS PRO (دروستکەری ڕیدمی نایاب)',
      kmr: 'README & DOCS PRO (چێکەرێ README یێ پرۆفیشنال)',
      ar: 'README & DOCS PRO (توثيق احترافي للمشاريع)',
      en: 'README & DOCS PRO',
    },
    badges: {
      ckb: 'ڕووکاری سەرنجڕاکێشی پڕۆژە 📄',
      kmr: 'دۆکیومێنتاسیۆنا نایاب 📄',
      ar: 'توثيق احترافي 📄',
      en: 'Open-Source Docs 📄',
    },
    shortDesc: {
      kmr: 'دروستکرنا فایلا README.md یا فەرمی ب باجان، ڕێنماییا دامەزراندنێ و پاراستنا کۆپی ڕایتێ.',
      ar: 'إنشاء ملف README.md احترافي متكامل بالشارات وخطوات التثبيت ومتغيرات البيئة والترخيص.',
    },
    directiveExplanation: {
      kmr: 'ستڕەکچەرێ ستاندارد یێ گیت‌هەبێ ددەتە پڕۆژەیێ تە دا هەر کەسەک بشێت بلەز بکاربینیت.',
      ar: 'يرفع احترافية المستودع البرمجي ويجعل الإعداد الأولي واضحاً للفرق والمستخدمين.',
    },
    whenToUse: {
      kmr: 'دەمێ بەڵاڤکرنا پڕۆژەی ل سەر GitHub یان ڕادەستکرنا کڕیاران.',
      ar: 'عند نشر مشروع مفتوح المصدر على GitHub أو تسليم منتج لعميل.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: README & DOCS PRO]
فایلا README.md یا تەمام و پرۆفیشنال بۆ پڕۆژەیا من چێکە:
١. ناڤونیشان و باجێن فەرمی (Badges).
٢. کورتیا کێشا چارەسەرکری.
٣. پێنگاڤێن دامەزراندنێ و فەرمانێن تێرمینالێ.
٤. مافێ کۆپی‌ڕایتێ و CREATOR: AZHAN HAMMZA.

پڕۆژە:
[پێزانینێن پڕۆژەی بنڤیسە]`,
      ar: `[DIRECTIVE: README & DOCS PRO]
أنشئ ملف README.md احترافياً ومتكاملاً لمشروعي يتضمن:
١. العنوان والشارات الرسمية (Badges).
٢. نبذة واضحة عن المشكلة والمزايا.
٣. خطوات التثبيت والتشغيل ومتغيرات البيئة (.env.example).
٤. الرخصة وحقوق المنشئ: CREATOR: AZHAN HAMMZA.

المشروع:
[صف مشروعك هنا]`,
      en: `[DIRECTIVE: README & DOCS PRO]
Generate an enterprise-grade README.md covering:
1. Title, concise pitch, and status badges.
2. Architecture overview & key features.
3. Prerequisites, installation commands, and .env.example table.
4. License & attribution (CREATOR: AZHAN HAMMZA).

Project details:
[Describe project here]`,
    },
    exampleSnippets: {
      kmr: 'README PRO: فایلا README.md یا پلاتفۆرما فێرکارییا کاڕێژان (KARÊJAN) بۆ GitHub ئامادە بکە.',
      ar: 'README PRO: أنشئ ملف README.md متكاملاً لمنصة KARÊJAN التعليمية للنشر على GitHub.',
      en: 'README PRO: Write a complete GitHub README.md for the KARÊJAN multilingual coding platform.',
    },
  },
  'few-shot-builder': {
    names: {
      ckb: 'FEW-SHOT PATTERN BUILDER (فێرکردن بە نموونەی کرداری)',
      kmr: 'FEW-SHOT PATTERN BUILDER (فێرکرن ب نموونەیێن پراکتیکی)',
      ar: 'FEW-SHOT PATTERN BUILDER (التوجيه بالأمثلة الدقيقة)',
      en: 'FEW-SHOT PATTERN BUILDER',
    },
    badges: {
      ckb: 'ئەنجامی ١٠٠٪ تەواو 🎯',
      kmr: 'ئەنجامێ ١٠٠٪ دروست 🎯',
      ar: 'تنسيق مطابق ١٠٠٪ 🎯',
      en: 'Exact Formatting 🎯',
    },
    shortDesc: {
      kmr: 'ب پێدانا ٢-٣ نموونەیان، مۆدێل ب تەمامی ل سەر هەمان ستایل و فۆرمات وەڵام ددەت.',
      ar: 'توجيه النموذج عبر ٢-٣ أمثلة مسبقة لضمان التزامه بنفس النمط والهيكل بنسبة ١٠٠٪.',
    },
    directiveExplanation: {
      kmr: 'فێرکرنا Few-Shot مۆدێلی نەچار دکەت ب هیچ ڕەنگەکی فۆرماتێ خوار نەکەت.',
      ar: 'يقلل تشتت التنسيق ويضمن اتساق المخرجات البرمجية أو البيانات المهيكلة.',
    },
    whenToUse: {
      kmr: 'بۆ گوهۆڕینا کۆمێن داتایان وەک CSV بۆ JSON یان ستانداردکرنا پەیامان.',
      ar: 'عند تحويل كميات كبيرة من البيانات أو فرض قالب إخراج صارم.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: FEW-SHOT PATTERN BUILDER]
ب تەمامی ل سەر ڤی شێوازێ ل خوارێ بەرسڤێ بدە:

نموونە ١:
داخواز: [داخوازا ١] -> وەڵام: [وەڵاما ١]

نموونە ٢:
داخواز: [داخوازا ٢] -> وەڵام: [وەڵاما ٢]

نها ئەڤێ جێبەجێ بکە:
داخوازا نوو: [ل ڤێرێ دانێ]`,
      ar: `[DIRECTIVE: FEW-SHOT PATTERN BUILDER]
التزم بهذا النمط والهيكل حرفياً دون أي تغيير:

مثال ١:
المدخل: [مثال ١] -> المخرج: [النتيجة ١]

مثال ٢:
المدخل: [مثال ٢] -> المخرج: [النتيجة ٢]

الآن نفّذ المطلوب الجديد بنفس الأسلوب:
[ضع المدخل الحقيقي هنا]`,
      en: `[DIRECTIVE: FEW-SHOT PATTERN BUILDER]
Follow this exact input -> output pattern with zero schema deviation:

Example 1:
Input: [sample 1] -> Output: [expected 1]

Example 2:
Input: [sample 2] -> Output: [expected 2]

Now transform this input identically:
Input: [your input here]`,
    },
    exampleSnippets: {
      kmr: 'FEW-SHOT: شاشییێن داتابەیسێ بکە پەیامێن دۆستانە بۆ بکارهێنەران ل سەر وان دوو نموونەیان.',
      ar: 'FEW-SHOT: حوّل أخطاء قاعدة البيانات الخام إلى رسائل ودّية للمستخدم مع كود الخطأ وفق المثالين.',
      en: 'FEW-SHOT: Map raw Postgres constraint errors into friendly localized JSON messages matching these 2 examples.',
    },
  },
  'git-commit-pro': {
    names: {
      ckb: 'CONVENTIONAL GIT COMMIT & PR (پەیامی کۆمیتی ستاندارد)',
      kmr: 'CONVENTIONAL GIT COMMIT & PR (پەیاما کۆمیتێ ستاندارد)',
      ar: 'CONVENTIONAL GIT COMMIT & PR (رسائل Commit قياسية)',
      en: 'CONVENTIONAL GIT COMMIT & PR',
    },
    badges: {
      ckb: 'ڕێکخستنی مێژووی گیت 🌿',
      kmr: 'ڕێکخستنا مێژوویا گیتێ 🌿',
      ar: 'سجل Git احترافي 🌿',
      en: 'Clean Git History 🌿',
    },
    shortDesc: {
      kmr: 'گوهۆڕینا Git Diff بۆ پەیاما ستاندارد یا Conventional Commits (feat:, fix:, refactor:) و وەسفێ PR.',
      ar: 'تحويل التعديلات البرمجية (Git Diff) إلى رسائل Commit قياسية ووصف احترافي لـ Pull Request.',
    },
    directiveExplanation: {
      kmr: 'ل جهێ پەیامێن وەک "update"، سەردێڕەکێ ژێر ٥٠ پیت و پێناسەیا گوهۆڕینان ئامادە دکەت.',
      ar: 'يسهّل قراءة السجل البرمجي وتوليد ملاحظات الإصدار تلقائياً.',
    },
    whenToUse: {
      kmr: 'بەری git commit یان دروستکرنا Pull Request.',
      ar: 'قبل تنفيذ git commit أو فتح Pull Request جديد.',
    },
    promptTemplates: {
      kmr: `[DIRECTIVE: CONVENTIONAL GIT COMMIT & PR]
ڤان گوهۆڕینان شیکار بکە و:
١. کۆمیتەکا ستاندارد (feat / fix / refactor / docs / test) بنڤیسە ژێر ٥٠ پیتان.
٢. د بەشێ Body دا ب خال گوهۆڕینێن سەرەکی دیار بکە.
٣. وەسفەکێ کورت یێ Pull Request ئامادە بکە.

Git Diff / کورتی:
[ل ڤێرێ دانێ]`,
      ar: `[DIRECTIVE: CONVENTIONAL GIT COMMIT & PR]
حلّل هذه التعديلات (Git Diff) وقدّم:
١. رسالة Commit قياسية (feat, fix, refactor, chore, docs, test) بعُنوان أقل من ٥٠ حرفاً.
٢. نقاطاً مختصرة في المتن (Body) تشرح السبب وأهم التعديلات.
٣. ملخصاً جاهزاً لوصف Pull Request.

التعديلات:
[ضع التعديلات هنا]`,
      en: `[DIRECTIVE: CONVENTIONAL GIT COMMIT & PR]
Inspect this Git diff / summary and generate:
1. A Conventional Commit title (<50 chars, feat/fix/refactor/docs/test).
2. Concise bullet points in the body explaining why & what changed.
3. A clean Pull Request summary ready to paste.

Git diff / summary:
[Paste diff here]`,
    },
    exampleSnippets: {
      kmr: 'GIT COMMIT: مە فایلێ ئاسایشا پاسۆردی نوێکر و ڕێگری ل لۆگینێ دووبارە کر؛ پەیامێ کۆمیتێ بنڤیسە.',
      ar: 'GIT COMMIT: قمت بتحديث أمان كلمات المرور ومنع تكرار الجلسات؛ اكتب رسالة Commit قياسية.',
      en: 'GIT COMMIT: Summarize these authentication rate-limit and token refresh updates into a semantic commit and PR description.',
    },
  },
};

