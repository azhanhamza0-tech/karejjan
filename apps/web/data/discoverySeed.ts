import type { AiTool, CodeProject, KnowledgeArticle, ReferenceEntry } from '../types/domain';

/**
 * Strict HTTPS-only validator for verified official URLs.
 * Rejects javascript:, data:, http:, relative URLs, and malformed domains.
 */
export function isSafeOfficialHttpsUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (trimmed.length < 12 || trimmed.length > 300) return false;
  if (!/^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' && Boolean(parsed.hostname) && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}

export const SEED_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-critical-rendering-path',
    slug: 'critical-rendering-path',
    category: 'performance',
    readingMinutes: 6,
    published: true,
    featured: true,
    codeExample: `<!-- Defer non-critical scripts so HTML parsing is not blocked -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin />
<script type="module" src="/app.js" defer></script>`,
    translations: {
      en: {
        title: 'How the Browser Critical Rendering Path Works',
        summary: 'Understand how browsers transform HTML, CSS, and JavaScript bytes into painted pixels—and how to eliminate render-blocking bottlenecks.',
        body: `When a browser downloads an HTML document, it incrementally constructs the DOM tree while fetching linked stylesheets to build the CSSOM tree. Because CSS determines visual layout, stylesheets are render-blocking by default.\n\nOnce both the DOM and CSSOM are ready, the browser merges them into the Render Tree, computes element geometry during Layout (reflow), paints layers into bitmaps, and composites those layers on the GPU.\n\nTo optimize first render speed, keep critical CSS lean, mark JavaScript modules with defer, avoid synchronous layout reads after DOM writes (layout thrashing), and animate compositor-friendly properties like transform and opacity.`,
        keyTakeaways: [
          'DOM + CSSOM combine into the Render Tree before Layout and Paint.',
          'External synchronous scripts pause HTML parsing; use defer or ES modules.',
          'Animate transform and opacity instead of top, left, width, or height.',
        ],
      },
      ar: {
        title: 'كيف يعمل مسار التصيير الحرج في المتصفح (Critical Rendering Path)',
        summary: 'تعرّف على كيفية تحويل المتصفح لملفات HTML و CSS و JavaScript إلى وحدات بكسل مرئية وكيفية إزالة العوائق التي تبطئ العرض.',
        body: `عندما يحمّل المتصفح مستند HTML، يبدأ ببناء شجرة DOM تدريجياً أثناء جلب ملفات الأنماط لبناء شجرة CSSOM. وبما أن CSS تحدد التخطيط المرئي، فإنها تُعد مانعة للتصيير افتراضياً.\n\nبعد جاهزية DOM و CSSOM، يدمجهما المتصفح في شجرة التصيير (Render Tree)، ثم يحسب مواقع وأحجام العناصر في مرحلة التخطيط (Layout)، ثم يرسم الطبقات ويدمجها عبر معالج الرسوميات.\n\nلتسريع العرض الأولي، حافظ على صغر حجم CSS الحرج، واستخدم defer مع ملفات JavaScript، وتجنب التسبب بإعادة التخطيط المتكرر، وحرّك الخصائص الملائمة للمركّب مثل transform و opacity.`,
        keyTakeaways: [
          'تندمج شجرة DOM مع CSSOM لتكوين شجرة التصيير قبل التخطيط والرسم.',
          'السكربتات المتزامنة توقف تحليل HTML؛ استخدم defer أو وحدات ES.',
          'حرّك transform و opacity بدلاً من width و height و top.',
        ],
      },
      ckb: {
        title: 'ڕێڕەوی نیشاندانی سەرەکی لە وێبگەڕدا (Critical Rendering Path)',
        summary: 'بزانە وێبگەڕ چۆن کۆدەکانی HTML و CSS و JavaScript دەگۆڕێت بۆ وێنەی سەر شاشە و چۆن خێرایی بارکردن باشتر بکەیت.',
        body: `کاتێک وێبگەڕ پەڕگەی HTML دادەبەزێنێت، بە هەنگاو شەجەرەی DOM دروست دەکات و لە هەمان کاتدا CSS دەخوێنێتەوە بۆ دروستکردنی CSSOM. لەبەر ئەوەی CSS شێوەی پەڕەکە دیاری دەکات، نیشاندان ڕادەگرێت تا ئامادە دەبێت.\n\nدوای ئامادەبوونی هەردووکیان، وێبگەڕ Render Tree دروست دەکات، پاشان قەبارە و شوێنی هەر توخمێک لە قۆناغی Layout حیساب دەکات و دواجار وێنەکە دەکێشێت.\n\nبۆ خێراکردنی لاپەڕە، CSSـی سەرەتایی کەم بکەرەوە، defer بۆ فایلەکانی JavaScript بەکاربهێنە، و بۆ جووڵاندن تەنها transform و opacity بەکاربهێنە.`,
        keyTakeaways: [
          'DOM و CSSOM یەکدەگرن بۆ دروستکردنی Render Tree پێش قۆناغی Layout.',
          'بەکارهێنانی defer ڕێگری دەکات لە وەستاندنی خوێندنەوەی HTML.',
          'جووڵاندنی transform و opacity زۆر خێراترە لە گۆڕینی قەبارە و شوێن.',
        ],
      },
      kmr: {
        title: 'ڕێکا نیشاندانا سەرەکی د وێبگەڕی دا (Critical Rendering Path)',
        summary: 'بزانە کا وێبگەڕ چاوا HTML و CSS و JavaScript دگۆڕیتە پێکسلێن لسەر شاشێ و چاوا لەزاتیێ باشتر بکەی.',
        body: `دەمێ وێبگەڕ پەڕگەها HTML دئێخیتە خوار، دارا DOM چێدکەت و پەڕگەهێن CSS دخوینیت دا CSSOM ئاڤا بکەت.\n\nپشتی هەردوو ئامادە دبن، وێبگەڕ Render Tree چێدکەت، قەبارە و جهێ توخمان د Layout دا حیساب دکەت و پاشی وێنەی لسەر شاشێ دکێشیت.\n\nبۆ لەزاتیا پەڕێ، defer بۆ JavaScript بکاربینە و بۆ لڤینێ بتنێ transform و opacity بکاربینە.`,
        keyTakeaways: [
          'DOM و CSSOM پێکڤە Render Tree چێدکەن.',
          'بکارئینانا defer ڕێگریێ ل ڕاوەستاندنا HTML دکەت.',
          'لڤاندنا transform و opacity باشترینە بۆ کارکرنا خێرا.',
        ],
      },
    },
  },
  {
    id: 'art-client-xss-defense',
    slug: 'client-side-xss-defense',
    category: 'security',
    readingMinutes: 7,
    published: true,
    featured: true,
    codeExample: `// SAFE: textContent treats untrusted strings strictly as text
const commentEl = document.createElement('p');
commentEl.textContent = userComment;

// SAFE: validate protocol before rendering dynamic links
function isSafeUrl(url) {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}`,
    translations: {
      en: {
        title: 'Preventing Cross-Site Scripting (XSS) in Frontend Apps',
        summary: 'Practical patterns for keeping user-generated text, dynamic URLs, and embedded code previews safe from script injection.',
        body: `Cross-Site Scripting occurs when untrusted input is interpreted by the browser as executable HTML or JavaScript. Even a single innerHTML assignment or an unvalidated javascript: link can expose session data or hijack user actions.\n\nAlways default to textContent or framework text interpolation (such as JSX curly braces in React), which automatically escapes HTML metacharacters. Whenever your interface accepts external URLs, parse them with the URL constructor and allow only https: (or http: when explicitly required).\n\nWhen executing user-authored HTML/CSS/JS inside learning platforms, isolate execution in an iframe with sandbox="allow-scripts" and never add allow-same-origin alongside allow-scripts for untrusted code.`,
        keyTakeaways: [
          'Prefer textContent or framework JSX bindings over innerHTML.',
          'Allowlist https: URLs before placing dynamic values in href or src.',
          'Isolate live code previews in sandbox="allow-scripts" iframes.',
        ],
      },
      ar: {
        title: 'الوقاية من ثغرات حقن السكربت (XSS) في تطبيقات الواجهة الأمامية',
        summary: 'أنماط عملية لحماية النصوص المدخلة من المستخدمين والروابط الديناميكية ومعاينات الكود من الحقن البرمجي.',
        body: `تحدث ثغرة XSS عندما يفسر المتصفح مدخلات غير موثوقة ككود HTML أو JavaScript قابل للتنفيذ. حتى استخدام واحد غير آمن لـ innerHTML أو رابط يبدأ بـ javascript: قد يعرّض بيانات المستخدم للخطر.\n\nاستخدم دائماً textContent أو الربط النصي الآمن في أطر العمل مثل JSX في React لتفادي تنفيذ وسوم HTML. وعند عرض روابط خارجية، تحقق عبر كائن URL من أن البروتوكول هو https: فقط.\n\nوعند تشغيل كود يكتبه المستخدمون، اعزله داخل عنصر iframe باستخدام السمة sandbox="allow-scripts" دون السماح بالوصول إلى الصفحة الأب.`,
        keyTakeaways: [
          'استخدم textContent أو ربط النصوص في React بدلاً من innerHTML.',
          'تحقق من أن الروابط الديناميكية تبدأ ببروتوكول https: فقط.',
          'اعزل معاينة الكود داخل iframe محمي بسمة sandbox.',
        ],
      },
      ckb: {
        title: 'ڕێگریکردن لە هێرشی XSS لە بەرنامەکانی وێبدا',
        summary: 'شێوازە پراکتیکییەکان بۆ پاراستنی دەقی بەکارهێنەر، بەستەرەکان، و پێشبینینی کۆد لە جێبەجێکردنی کۆدی زیانبەخش.',
        body: `هێرشی XSS کاتێک ڕوودەدات کە داتای نەپشکنراو وەک HTML یان JavaScript لەلایەن وێبگەڕەوە جێبەجێ بکرێت.\n\nهەمیشە textContent یان نیشاندانی دەقی سەلامەتی React بەکاربهێنە لە جیاتی innerHTML. بۆ بەستەرە دەرەکییەکان دڵنیا ببە کە تەنها بە https: دەست پێدەکەن.\n\nبۆ کارپێکردنی کۆدی بەکارهێنەران، هەمیشە iframe بە sandbox="allow-scripts" بەکاربهێنە بۆ دابڕینی تەواو لە لاپەڕەی سەرەکی.`,
        keyTakeaways: [
          'textContent لە جیاتی innerHTML بەکاربهێنە بۆ دەقی بەکارهێنەر.',
          'بۆ بەستەرەکان تەنها پرۆتۆکۆڵی https: قبووڵ بکە.',
          'کۆدی پێشبینین لەناو iframeـی ساندبۆکسدا داببڕە.',
        ],
      },
      kmr: {
        title: 'ڕێگریکرن ژ هێرشێن XSS د ئەپێن وێب دا',
        summary: 'ڕێکێن پراکتیکی بۆ پاراستنا دەقێن بکارهێنەران و لینکێن دەرەکی ژ کۆدێن زیانبەخش.',
        body: `هێرشا XSS دەمێ ڕووددەت کو داتایێن نەپشکنینکراو وەک HTML یان JavaScript بهێنە کارپێکرن.\n\nهەردەم textContent بکاربینە ل جهێ innerHTML و بۆ لینکان بتنێ https: قەبوول بکە. هەروەسا کۆدێ پێشبینینێ دناڤ iframeـا sandbox دا جودا بکە.`,
        keyTakeaways: [
          'textContent بکاربینە ل جهێ innerHTML.',
          'بتنێ لینکێن https: پەسەند بکە.',
          'کۆدێن بکارهێنەران دناڤ sandbox iframe دا بکاربینە.',
        ],
      },
    },
  },
  {
    id: 'art-css-grid-vs-flexbox',
    slug: 'css-grid-vs-flexbox',
    category: 'web-architecture',
    readingMinutes: 5,
    published: true,
    featured: false,
    codeExample: `.page-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}
.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`,
    translations: {
      en: {
        title: 'Modern CSS Layout Strategy: When to Choose Grid vs Flexbox',
        summary: 'A clear engineering guide to combining CSS Grid for two-dimensional page structures with Flexbox for component-level alignment.',
        body: `Flexbox and CSS Grid are complementary layout systems rather than competitors. Flexbox excels at one-dimensional distribution—aligning buttons in a navigation bar, spacing items inside a toolbar, or centering content along a single axis.\n\nCSS Grid shines when you control rows and columns simultaneously: responsive card grids, sidebar-plus-article documentation layouts, and multi-panel dashboards.\n\nUsing repeat(auto-fit, minmax(260px, 1fr)) lets cards adapt gracefully across mobile, tablet, and desktop widths without brittle breakpoint calculations.`,
        keyTakeaways: [
          'Use Flexbox for 1D alignment (navbars, action rows, chip groups).',
          'Use CSS Grid for 2D page geometry and equal-height card matrices.',
          'Combine both: Grid for the outer container, Flexbox inside each card.',
        ],
      },
      ar: {
        title: 'استراتيجية تخطيط CSS الحديثة: متى تختار Grid ومتى تختار Flexbox؟',
        summary: 'دليل عملي للجمع بين CSS Grid لتخطيط الصفحة ثنائي الأبعاد و Flexbox لمحاذاة العناصر داخل المكونات.',
        body: `لا يتنافس Flexbox مع CSS Grid بل يكمل كل منهما الآخر. يتفوق Flexbox في التوزيع أحادي البعد مثل شريط التنقل وصفوف الأزرار.\n\nأما CSS Grid فيتألق عند التحكم بالصفوف والأعمدة معاً مثل شبكات البطاقات المتجاوبة وتخطيطات لوحات التحكم.\n\nباستخدام repeat(auto-fit, minmax(260px, 1fr)) تتكيف البطاقات تلقائياً مع كل الشاشات بسلاسة.`,
        keyTakeaways: [
          'استخدم Flexbox للمحاذاة أحادية البعد داخل المكونات.',
          'استخدم CSS Grid للتخطيط ثنائي الأبعاد وشبكات البطاقات.',
          'ادمج الاثنين معاً للحصول على واجهات مرنة ونظيفة.',
        ],
      },
      ckb: {
        title: 'ستراتیژی ڕێکخستنی CSS: کەی Grid و کەی Flexbox بەکاربهێنین؟',
        summary: 'ڕێبەرێکی ڕوون بۆ تێکەڵکردنی CSS Grid بۆ پێکهاتەی دووڕەهەندی و Flexbox بۆ ڕیزکردنی ناو پێکهاتەکان.',
        body: `Flexbox و CSS Grid تەواوکەری یەکترن. Flexbox باشترینە بۆ یەک ڕەهەند وەک ڕیزکردنی دوگمەکان یان مینۆی سەرەوە.\n\nCSS Grid باشترینە کاتێک دەتەوێت لە هەمان کاتدا ڕیز و ستوون کۆنترۆڵ بکەیت وەک تۆڕی کارتەکان و داشبۆردەکان.`,
        keyTakeaways: [
          'Flexbox بۆ یەک ڕەهەند بەکاربهێنە.',
          'CSS Grid بۆ تۆڕی دووڕەهەندی و ڕیز و ستوون بەکاربهێنە.',
          'هەردووکیان پێکەوە بەکاربهێنە بۆ دیزاینی ڕیسپۆنسیڤ.',
        ],
      },
      kmr: {
        title: 'ستراتیژیا CSS: کەنگی Grid و کەنگی Flexbox بکاربینین؟',
        summary: 'ڕێبەرەکا ڕۆن بۆ بکارئینانا CSS Grid بۆ پێکهاتێن دوو-ڕەهەندی و Flexbox بۆ ڕێکخستنا ئێک-ڕەهەندی.',
        body: `Flexbox بۆ ڕێکخستنا ئێک-ڕەهەندی (وەک ڕێزا دوگمە و ناڤیگەیشن) گەلەک گونجایە، و CSS Grid بۆ کۆنترۆلکرنا ڕێز و ستوونان پێکڤە باشترینە.`,
        keyTakeaways: [
          'Flexbox بۆ ئێک ڕەهەند بکاربینە.',
          'CSS Grid بۆ دوو ڕەهەندان بکاربینە.',
          'هەردووکان پێکڤە بکاربینە.',
        ],
      },
    },
  },
  {
    id: 'art-structured-ai-outputs',
    slug: 'structured-ai-outputs-for-developers',
    category: 'ai-engineering',
    readingMinutes: 6,
    published: true,
    featured: false,
    codeExample: `import { z } from 'zod';

const LessonSchema = z.object({
  title: z.string().min(3),
  objectives: z.array(z.string()).min(2),
});

// Always validate model JSON on the server before storing
const parsed = LessonSchema.safeParse(JSON.parse(rawModelOutput));`,
    translations: {
      en: {
        title: 'Building Reliable AI Features with Strict JSON & Schema Validation',
        summary: 'How production apps enforce server-side API keys, schema validation (Zod), retry policies, and honest failure states.',
        body: `Integrating large language models into production software requires treating model output as untrusted external data. Never call model APIs directly from browser bundles—always route requests through a server endpoint or Cloud Function where API keys stay protected.\n\nWhen generating structured educational content, request strict JSON output and validate every field with a schema library such as Zod. If validation fails, retry with concise corrective feedback up to a strict cap, then fail cleanly rather than saving malformed records.\n\nFinally, keep generated drafts behind human review before publishing to learners.`,
        keyTakeaways: [
          'Keep model API keys exclusively on the server or in Secret Manager.',
          'Validate every structured response with a strict schema (e.g., Zod).',
          'Surface honest temporary error messages instead of fabricating fallback answers.',
        ],
      },
      ar: {
        title: 'بناء ميزات ذكاء اصطناعي موثوقة باستخدام JSON الصارم والتحقق من المخطط',
        summary: 'كيف تطبّق الأنظمة الإنتاجية حماية المفاتيح على الخادم، التحقق عبر Zod، وسياسات إعادة المحاولة والشفافية عند الأعطال.',
        body: `يتطلب دمج نماذج الذكاء الاصطناعي في التطبيقات الإنتاجية التعامل مع مخرجات النموذج كبيانات خارجية يجب التحقق منها. لا تستدعِ واجهة النموذج من المتصفح أبداً؛ بل عبر الخادم أو Cloud Functions فقط.\n\nعند توليد محتوى منظم، اطلب مخرجات JSON صارمة وتحقق منها بمكتبة مثل Zod، وأبقِ المسودات قيد المراجعة البشرية قبل النشر.`,
        keyTakeaways: [
          'احتفظ بمفاتيح API حصراً في الخادم أو Secret Manager.',
          'تحقق من كل استجابة مهيكلة باستخدام مخطط صارم مثل Zod.',
          'اعرض رسالة خطأ واضحة عند التعذر بدلاً من اختلاق إجابة.',
        ],
      },
      ckb: {
        title: 'دروستکردنی تایبەتمەندیی زیرەکی دەستکرد بە JSON و پشکنینی سکێما',
        summary: 'چۆن بەرنامە پێشکەوتووەکان کلیلی API لە سێرڤەردا دەپارێزن و بە Zod دڵنیا دەبن لە دروستیی داتا.',
        body: `لە سیستەمی ڕاستەقینەدا هەرگیز کلیلی API لە کۆدی وێبگەڕدا دامەنێ؛ تەنها لە سێرڤەر یان Cloud Functions بەکاری بهێنە.\n\nهەمیشە ئەنجامی JSON بە سکێمایەکی وەک Zod بپشکنە و بەر لە بڵاوکردنەوە پێداچوونەوەی مرۆیی بۆ بکە.`,
        keyTakeaways: [
          'کلیلی API تەنها لە سێرڤەر یان Secret Manager بپارێزە.',
          'هەموو داتایەکی JSON بە Zod بپشکنە.',
          'لە کاتی کێشەدا پەیامی ڕاستگۆ نیشان بدە.',
        ],
      },
      kmr: {
        title: 'ئاڤاکرنا تایبەتمەندیێن AI یێن باوەرپێکری ب JSON و پشکنینا سکێمایێ',
        summary: 'چاوا کلیلا API لسەر سێرڤەری دهێتە پاراستن و داتا ب Zod دهێتە پشکنین.',
        body: `کلیلا API هەردەم لسەر سێرڤەری بهێلە، داتایێن JSON ب Zod بپشکنە، و بەری بەلاڤکرنێ پێداچوونێ ل سەر بکە.`,
        keyTakeaways: [
          'کلیلا API بتنێ لسەر سێرڤەری بپارێزە.',
          'بەرسڤێن JSON ب Zod بپشکنە.',
          'پەیامێن خەلەتیێ یێن ڕاستگۆ نیشان بدە.',
        ],
      },
    },
  },
  {
    id: 'art-wcag-accessibility',
    slug: 'wcag-accessibility-checklist',
    category: 'web-architecture',
    readingMinutes: 5,
    published: true,
    featured: false,
    codeExample: `<button type="button" aria-expanded="false" aria-controls="faq-1">
  How does semantic HTML help screen readers?
</button>`,
    translations: {
      en: {
        title: 'Web Accessibility (WCAG AA) Checklist for Developers',
        summary: 'High-impact habits—semantic landmarks, keyboard focus visibility, contrast ratios, and RTL support—that make apps usable by everyone.',
        body: `Accessibility starts with choosing the right HTML element: use <button> for actions, <a> for navigation, and semantic landmarks (<header>, <nav>, <main>, <footer>) so assistive technologies can jump directly to content.\n\nEnsure body text meets at least 4.5:1 contrast in both light and dark modes, never hide focus rings without providing a high-contrast focus-visible replacement, and use CSS logical properties (margin-inline, padding-inline, text-start) so RTL languages such as Kurdish Sorani, Badini, and Arabic mirror cleanly.`,
        keyTakeaways: [
          'Use native <button> and <a> elements instead of clickable <div>s.',
          'Verify 4.5:1 contrast in both light and dark themes.',
          'Use logical CSS properties (start/end) for effortless RTL + LTR layouts.',
        ],
      },
      ar: {
        title: 'قائمة التحقق لإتاحة الويب (WCAG AA) للمطورين',
        summary: 'عادات عملية عالية الأثر: الوسوم الدلالية، وضوح تركيز لوحة المفاتيح، تباين الألوان، ودعم RTL.',
        body: `تبدأ الإتاحة باختيار العنصر الصحيح: <button> للإجراءات و<a> للتنقل والمعالم الدلالية مثل <main> و<nav>.\n\nاحرص على تباين ألوان لا يقل عن 4.5:1 في الوضعين الفاتح والداكن واستخدم الخصائص المنطقية مثل text-start لدعم اللغات من اليمين إلى اليسار بسلاسة.`,
        keyTakeaways: [
          'استخدم <button> و <a> الأصلية بدلاً من <div> القابلة للنقر.',
          'تحقق من تباين 4.5:1 في الوضع الفاتح والداكن.',
          'استخدم الخصائص المنطقية لدعم RTL و LTR.',
        ],
      },
      ckb: {
        title: 'لیستی پشکنینی بەردەستبوونی وێب (WCAG AA) بۆ گەشەپێدەران',
        summary: 'هەنگاوە گرنگەکان بۆ وێبێکی بەردەست: HTMLـی واتادار، کۆنترۆڵی کیبۆرد، تۆخیی ڕەنگ، و پشتگیری RTL.',
        body: `بەردەستبوون بە هەڵبژاردنی توخمی دروست دەست پێدەکات وەک <button> و <nav> و <main>. دڵنیابە لە تۆخیی ڕەنگی گونجاو لە هەردوو دۆخی تاریک و ڕووناکدا و تایبەتمەندیی لۆجیکیی وەک start/end بۆ کوردی و عەرەبی بەکاربهێنە.`,
        keyTakeaways: [
          'توخمە بنەڕەتییەکانی وەک <button> بەکاربهێنە.',
          'تۆخیی ڕەنگ لە دۆخی تاریک و ڕووناکدا بپشکنە.',
          'تایبەتمەندیی لۆجیکی بۆ RTL بەکاربهێنە.',
        ],
      },
      kmr: {
        title: 'لیستا بەردەستبوونا وێبی (WCAG AA) بۆ گەشەپێدەران',
        summary: 'خوویێن گرنگ بۆ HTMLـا واتادار، کیبۆرد، ڕۆناهیا ڕەنگان و پشتگیریا RTL.',
        body: `توخمێن دروست وەک <button> و <main> بکاربینە، ڕۆناهیا ڕەنگان د هەردوو مۆدێن تاری و ڕۆن دا بپشکنە و تایبەتمەندیێن لۆجیکی بۆ RTL بکاربینە.`,
        keyTakeaways: [
          'توخمێن بنەڕەتی وەک <button> بکاربینە.',
          'تۆخیا ڕەنگان بپشکنە.',
          'تایبەتمەندیێن لۆجیکی بۆ RTL بکاربینە.',
        ],
      },
    },
  },
  {
    id: 'art-modern-js-tooling',
    slug: 'modern-web-tooling-vite-ts',
    category: 'tooling',
    readingMinutes: 5,
    published: true,
    featured: false,
    codeExample: `// Strict TypeScript interfaces catch bugs before runtime
interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}`,
    translations: {
      en: {
        title: 'Why TypeScript and Vite Speed Up Modern Web Engineering',
        summary: 'How static type checking and native ES module bundling eliminate entire classes of runtime bugs while keeping local feedback instant.',
        body: `TypeScript lets teams describe API contracts, component props, and Firestore document shapes explicitly. When a field changes, the compiler highlights every affected call site immediately instead of failing silently in a user's browser.\n\nVite pairs native browser ES modules in development with Rollup production bundling, giving fast startup times and tree-shaken production assets.`,
        keyTakeaways: [
          'TypeScript catches mismatched API payloads and null errors at compile time.',
          'Vite delivers fast dev feedback and optimized production bundles.',
          'Run tsc --noEmit alongside production builds in every workflow.',
        ],
      },
      ar: {
        title: 'لماذا يسرّع TypeScript و Vite هندسة الويب الحديثة',
        summary: 'كيف يمنع الفحص الساكن للأنواع وحزم ES الحديثة فئات كاملة من الأخطاء مع تسريع التطوير.',
        body: `يتيح TypeScript توثيق أشكال البيانات وعقود واجهات API بوضوح؛ وعند تعديل أي حقل ينبهك المصرّف فوراً قبل الوصول للمستخدم.\n\nويجمع Vite بين سرعة وحدات ES في التطوير وحزم الإنتاج المحسّنة.`,
        keyTakeaways: [
          'يكتشف TypeScript أخطاء البيانات قبل وقت التشغيل.',
          'يوفر Vite بيئة تطوير سريعة وبناءً محسّناً للإنتاج.',
          'شغّل الفحص النوعي مع كل بناء إنتاجي.',
        ],
      },
      ckb: {
        title: 'بۆچی TypeScript و Vite گەشەپێدانی وێب خێراتر دەکەن',
        summary: 'چۆن پشکنینی جۆری داتا و بوندڵکردنی نوێ هەڵەکان پێش کارکردن ئاشکرا دەکات.',
        body: `TypeScript یارمەتیت دەدات پێکهاتەی داتا و API بە وردی دیاری بکەیت و هەڵەکان بەر لە بڵاوکردنەوە بدۆزیتەوە، و Vite خێراییەکی بەرز لە کاتی گەشەپێدان و بڵاوکردنەوەدا دەبەخشێت.`,
        keyTakeaways: [
          'TypeScript هەڵەکان لە کاتی کۆمپایلدا دەگرێت.',
          'Vite خێرایی بەرز و فایلی بەرهەمهێنراوی بچووک دەدات.',
          'هەمیشە tsc --noEmit پێش بڵاوکردنەوە کار پێ بکە.',
        ],
      },
      kmr: {
        title: 'بۆچی TypeScript و Vite گەشەپێدانا وێبی خێراتر دکەن',
        summary: 'چاوا پشکنینا جۆرێن داتایان خەلەتیان بەری کارپێکرنێ دبینیت.',
        body: `TypeScript خەلەتیێن داتایان بەری کارکرنێ دگریت و Vite ژینگەهەکا گەلەک خێرا بۆ گەشەپێدانێ دابین دکەت.`,
        keyTakeaways: [
          'TypeScript خەلەتیان بەری کارکرنێ دبینیت.',
          'Vite کارکرنێ خێرا دکەت.',
          'tsc --noEmit دگەل هەر buildـەکێ بکاربینە.',
        ],
      },
    },
  },
];

export const SEED_REFERENCES: ReferenceEntry[] = [
  // HTML References
  {
    id: 'ref-html-main',
    track: 'html',
    category: 'Semantic Landmarks',
    symbol: '<main>',
    syntax: '<main> ...primary unique page content... </main>',
    exampleHtml: '<header><h1>KARÊJAN</h1></header>\n<main>\n  <h2>Main Content</h2>\n  <p>Unique content of this page lives here.</p>\n</main>',
    exampleCss: 'main { padding: 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-family: sans-serif; }',
    exampleJs: '',
    browserSupport: 'All modern browsers (Baseline Widely Available)',
    published: true,
    translations: {
      en: {
        summary: 'Defines the dominant, unique content of the document <body>.',
        details: 'A document should contain only one visible <main> element. Screen readers use it to skip repeated navigation headers.',
        notes: 'Do not nest <main> inside <article>, <aside>, <footer>, <header>, or <nav>.',
      },
      ar: {
        summary: 'يحدد المحتوى الرئيسي الفريد داخل جسم الصفحة <body>.',
        details: 'يجب أن تحتوي الصفحة على عنصر <main> واحد مرئي لتسهيل انتقال قارئات الشاشة مباشرة للمحتوى.',
        notes: 'تجنب وضع <main> داخل <header> أو <nav> أو <footer>.',
      },
      ckb: {
        summary: 'ناوەڕۆکی سەرەکی و تاقانەی ناو <body> دیاری دەکات.',
        details: 'پێویستە تەنها یەک <main>ـی دیار لە لاپەڕەکەدا هەبێت بۆ یارمەتیدانی خوێنەرەوەی شاشە.',
        notes: '<main> مەخەرە ناو <header> یان <nav> یان <footer>.',
      },
      kmr: {
        summary: 'ناڤەڕۆکا سەرەکی یا دناڤ <body> دا دیار دکەت.',
        details: 'دڤێت بتنێ ئێک <main> د لاپەڕێ دا هەبیت دا خواندەڤانێن شاشێ ب ساناهی بگەهنە ناڤەڕۆکێ.',
        notes: '<main> نەئێخە دناڤ <nav> یان <footer> دا.',
      },
    },
  },
  {
    id: 'ref-html-dialog',
    track: 'html',
    category: 'Interactive Elements',
    symbol: '<dialog>',
    syntax: '<dialog id="modal">...</dialog>  // dialog.showModal()',
    exampleHtml: '<button id="openBtn">Open Dialog</button>\n<dialog id="demoDialog">\n  <h3>Native Modal</h3>\n  <p>Press Esc or click Close.</p>\n  <button id="closeBtn">Close</button>\n</dialog>',
    exampleCss: 'dialog { border: 1px solid #3b82f6; border-radius: 12px; padding: 20px; font-family: sans-serif; }\ndialog::backdrop { background: rgba(15, 23, 42, 0.55); }',
    exampleJs: 'const dlg = document.getElementById("demoDialog");\ndocument.getElementById("openBtn").addEventListener("click", () => dlg.showModal());\ndocument.getElementById("closeBtn").addEventListener("click", () => dlg.close());',
    browserSupport: 'Chrome 37+, Firefox 98+, Safari 15.4+',
    published: true,
    translations: {
      en: {
        summary: 'Creates a native accessible modal or non-modal dialog box.',
        details: 'Calling showModal() automatically adds a ::backdrop, traps Escape key dismissal, and manages focus.',
        notes: 'Style the overlay with the ::backdrop pseudo-element.',
      },
      ar: {
        summary: 'ينشئ نافذة حوارية أصلية متاحة للوصول (Modal أو غير Modal).',
        details: 'استدعاء showModal() يضيف طبقة خلفية ::backdrop تلقائياً ويدعم الإغلاق بزر Escape.',
        notes: 'يمكن تنسيق الخلفية عبر ::backdrop.',
      },
      ckb: {
        summary: 'پەنجەرەیەکی گفتوگۆی بنەڕەتی (Modal) بە بەردەستبوونی تەواو دروست دەکات.',
        details: 'بانگکردنی showModal() بە خۆکارانە باکگراوندی ::backdrop و داخستن بە دوگمەی Escape چالاک دەکات.',
        notes: 'بۆ ڕازاندنەوەی پشتەوەی پەنجەرەکە ::backdrop بەکاربهێنە.',
      },
      kmr: {
        summary: 'پەنجەرەکا گفتوگۆیێ یا بنەڕەتی (Modal) دروست دکەت.',
        details: 'بانگکرنا showModal() پاشبنەمایێ ::backdrop و داخستنێ ب Escape ب خۆکارانە چالاک دکەت.',
        notes: 'بۆ دیزاینا پاشبنەمای ::backdrop بکاربینە.',
      },
    },
  },
  {
    id: 'ref-html-details',
    track: 'html',
    category: 'Interactive Elements',
    symbol: '<details> & <summary>',
    syntax: '<details>\n  <summary>Toggle label</summary>\n  <p>Hidden details revealed on click</p>\n</details>',
    exampleHtml: '<details open>\n  <summary>What is KARÊJAN?</summary>\n  <p>A multilingual platform for mastering HTML, CSS, and JavaScript.</p>\n</details>',
    exampleCss: 'details { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 16px; font-family: sans-serif; }\nsummary { font-weight: 600; cursor: pointer; }',
    exampleJs: '',
    browserSupport: 'All modern browsers (Zero JavaScript required)',
    published: true,
    translations: {
      en: {
        summary: 'Builds an expandable disclosure widget without any JavaScript.',
        details: 'The <summary> element acts as the visible clickable heading; add the open attribute to show content initially.',
        notes: 'Ideal for FAQs, code hints, and collapsible documentation sections.',
      },
      ar: {
        summary: 'ينشئ عنصر طيّ وتوسيع تفاعلي دون الحاجة لأي كود JavaScript.',
        details: 'يعمل عنصر <summary> كعنوان قابل للنقر، ويمكن إضافة السمة open لفتحه افتراضياً.',
        notes: 'مثالي للأسئلة الشائعة والتلميحات القابلة للفتح.',
      },
      ckb: {
        summary: 'بەشێکی کرانەوە و داخران دروست دەکات بەبێ هیچ کۆدێکی JavaScript.',
        details: 'توخمی <summary> وەک سەردێڕی کلیکپێکراو کار دەکات و تایبەتمەندیی open بە کراوەیی دەیهێڵێتەوە.',
        notes: 'زۆر گونجاوە بۆ پرسیارە باوەکان (FAQ) و ئاماژەکان.',
      },
      kmr: {
        summary: 'پشکەکا ڤەکرن و داخستنێ بێی JavaScript چێدکەت.',
        details: 'توخمێ <summary> وەک سەردێڕێ کلیککرنێ کار دکەت.',
        notes: 'بۆ FAQ و تێبینیێن ڤەشارتی گونجایە.',
      },
    },
  },
  {
    id: 'ref-html-form-label',
    track: 'html',
    category: 'Forms & Accessibility',
    symbol: '<label for="...">',
    syntax: '<label for="email">Email</label>\n<input id="email" type="email" required />',
    exampleHtml: '<form id="f">\n  <label for="userEmail">Email Address</label>\n  <input id="userEmail" type="email" placeholder="you@example.com" required />\n  <button type="submit">Check</button>\n</form>',
    exampleCss: 'form { display: flex; flex-direction: column; gap: 8px; max-width: 280px; font-family: sans-serif; }\ninput { padding: 8px; border: 1px solid #94a3b8; border-radius: 6px; }',
    exampleJs: 'document.getElementById("f").addEventListener("submit", (e) => { e.preventDefault(); alert("Valid email!"); });',
    browserSupport: 'All browsers',
    published: true,
    translations: {
      en: {
        summary: 'Associates an accessible caption with a form input via matching id/for attributes.',
        details: 'Clicking the label focuses the linked input and announces its purpose to screen readers.',
        notes: 'Never rely solely on placeholder text as a replacement for <label>.',
      },
      ar: {
        summary: 'يربط تسمية نصية واضحة بحقل الإدخال عبر تطابق السمتين for و id.',
        details: 'النقر على التسمية ينقل التركيز تلقائياً للحقل المرتبط ويساعد قارئات الشاشة.',
        notes: 'لا تعتمد على placeholder وحده كبديل عن <label>.',
      },
      ckb: {
        summary: 'ناونیشانی خانەی فۆرم دەبەستێتەوە بە input لە ڕێگەی for و id.',
        details: 'کلیککردن لەسەر label تەرکیز دەباتە سەر خانەکە و بەردەستبوون باشتر دەکات.',
        notes: 'هەرگیز placeholder وەک جێگرەوەی تەواوی <label> بەکارمەهێنە.',
      },
      kmr: {
        summary: 'ناڤنیشانێ خانێ ب input ڤە گرێددەت ب ڕێکا for و id.',
        details: 'کلیککرن لسەر label فۆکەسێ دبەتە سەر خانێ.',
        notes: 'placeholder ل جهێ <label> بکارنەئینە.',
      },
    },
  },
  // CSS References
  {
    id: 'ref-css-grid-columns',
    track: 'css',
    category: 'Grid Layout',
    symbol: 'grid-template-columns',
    syntax: 'grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));',
    exampleHtml: '<div class="grid">\n  <div class="box">01</div>\n  <div class="box">02</div>\n  <div class="box">03</div>\n</div>',
    exampleCss: '.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; font-family: sans-serif; }\n.box { background: #1d4ed8; color: white; padding: 20px; border-radius: 8px; text-align: center; font-weight: 600; }',
    exampleJs: '',
    browserSupport: 'All modern browsers',
    published: true,
    translations: {
      en: {
        summary: 'Defines the number and sizing tracks of columns in a CSS Grid container.',
        details: 'Use fr units for proportional tracks and repeat(auto-fit, minmax(...)) for responsive grids without media queries.',
        notes: 'Requires display: grid on the parent container.',
      },
      ar: {
        summary: 'تحدد عدد وعرض الأعمدة داخل حاوية CSS Grid.',
        details: 'استخدم وحدة fr لتوزيع المساحة نسبياً و repeat(auto-fit, minmax(...)) لشبكة متجاوبة تلقائياً.',
        notes: 'تتطلب وجود display: grid على العنصر الأب.',
      },
      ckb: {
        summary: 'ژمارە و قەبارەی ستوونەکانی ناو CSS Grid دیاری دەکات.',
        details: 'یەکەی fr و repeat(auto-fit, minmax(...)) بەکاربهێنە بۆ تۆڕی ڕیسپۆنسیڤ.',
        notes: 'پێویستی بە display: grid هەیە لەسەر توخمە دایکەکە.',
      },
      kmr: {
        summary: 'ژمارە و فرەهیا ستوونێن CSS Grid دیار دکەت.',
        details: 'یەکەیا fr و repeat(auto-fit, minmax(...)) بۆ تۆڕا ڕیسپۆنسیڤ بکاربینە.',
        notes: 'دڤێت display: grid لسەر هەلگری هەبیت.',
      },
    },
  },
  {
    id: 'ref-css-clamp',
    track: 'css',
    category: 'Math Functions',
    symbol: 'clamp(min, preferred, max)',
    syntax: 'font-size: clamp(1.25rem, 2.5vw, 2.5rem);',
    exampleHtml: '<h1 class="fluid">Fluid Typography with clamp()</h1>',
    exampleCss: '.fluid { font-family: sans-serif; font-size: clamp(1.25rem, 4vw, 2.75rem); color: #1e3a8a; }',
    exampleJs: '',
    browserSupport: 'Chrome 79+, Firefox 75+, Safari 13.1+',
    published: true,
    translations: {
      en: {
        summary: 'Clamps a fluid CSS value smoothly between an upper and lower bound.',
        details: 'Replaces multiple font-size or padding media queries with a single responsive expression.',
        notes: 'Combine rem with vw in the middle value so users can still zoom text accessibly.',
      },
      ar: {
        summary: 'تضبط قيمة مرنة في CSS بسلاسة بين حد أدنى وحد أقصى.',
        details: 'تغنيك عن كتابة عدة استعلامات وسائط لتغيير أحجام الخطوط والمسافات.',
        notes: 'ادمج rem مع vw في القيمة الوسطى للحفاظ على قابلية تكبير الخط.',
      },
      ckb: {
        summary: 'بەهایەکی نەرمی CSS لە نێوان کەمترین و زۆرترین سنووردا دەبەستێتەوە.',
        details: 'بێ نووسینی media queryـی زۆر، قەبارەی فۆنت بە نەرمی لەگەڵ شاشە دەگۆڕێت.',
        notes: 'rem لەگەڵ vw تێکەڵ بکە بۆ پاراستنی توانای گەورەکردن (zoom).',
      },
      kmr: {
        summary: 'بهایەکێ نەرم د CSS دا دناڤبەرا کێمترین و زۆرترین سنوور دا دپارێزیت.',
        details: 'قەبارێ فۆنتی ب نەرمی لدویڤ شاشێ دگۆڕیت.',
        notes: 'rem دگەل vw بکاربینە.',
      },
    },
  },
  {
    id: 'ref-css-sticky',
    track: 'css',
    category: 'Positioning',
    symbol: 'position: sticky',
    syntax: 'position: sticky; top: 0; z-index: 20;',
    exampleHtml: '<div class="bar">Sticky Header</div>\n<div class="tall">Scroll down to see the header stick.</div>',
    exampleCss: '.bar { position: sticky; top: 0; background: #1e293b; color: white; padding: 10px 14px; font-family: sans-serif; }\n.tall { height: 420px; padding: 16px; background: linear-gradient(#f8fafc, #e2e8f0); font-family: sans-serif; }',
    exampleJs: '',
    browserSupport: 'All modern browsers',
    published: true,
    translations: {
      en: {
        summary: 'Switches an element between relative and fixed positioning based on scroll offset.',
        details: 'Must specify at least one inset threshold such as top: 0 to activate sticking.',
        notes: 'Avoid overflow: hidden on ancestor elements, which prevents sticky positioning from working.',
      },
      ar: {
        summary: 'تحوّل تموضع العنصر بين نسبي وثابت حسب موضع التمرير.',
        details: 'يجب تحديد مسافة مثل top: 0 ليعمل التثبيت.',
        notes: 'تجنب استخدام overflow: hidden على العناصر الأب وإلا سيتوقف التثبيت.',
      },
      ckb: {
        summary: 'توخمەکە لە کاتی سکڕۆڵدا بە شێوەی جێگیر لە سەرەوە ڕادەگرێت.',
        details: 'پێویستە لانیکەم یەک بەهای وەک top: 0 دابنرێت.',
        notes: 'overflow: hidden لەسەر توخمە دایکەکان دامەنێ چونکە sticky ڕادەگرێت.',
      },
      kmr: {
        summary: 'دەمێ سکڕۆلێ دا توخمی لسەرێ پەڕێ جێگیر دکەت.',
        details: 'دڤێت top: 0 بهێتە دانان.',
        notes: 'overflow: hidden لسەر هەلگرێن سەرڤە نەدانە.',
      },
    },
  },
  {
    id: 'ref-css-aspect-ratio',
    track: 'css',
    category: 'Sizing & Media',
    symbol: 'aspect-ratio',
    syntax: 'aspect-ratio: 16 / 9;',
    exampleHtml: '<div class="frame">16 : 9 Responsive Frame</div>',
    exampleCss: '.frame { width: 100%; max-width: 360px; aspect-ratio: 16 / 9; display: grid; place-items: center; background: #2563eb; color: #fff; border-radius: 10px; font-family: sans-serif; }',
    exampleJs: '',
    browserSupport: 'Chrome 88+, Firefox 89+, Safari 15+',
    published: true,
    translations: {
      en: {
        summary: 'Sets a preferred width-to-height ratio for responsive media and cards.',
        details: 'Prevents Cumulative Layout Shift (CLS) while images or video containers load.',
        notes: 'Pair with object-fit: cover on <img> elements.',
      },
      ar: {
        summary: 'تحدد نسبة العرض إلى الارتفاع للحاويات والوسائط المتجاوبة.',
        details: 'تمنع قفزات التخطيط (CLS) أثناء تحميل الصور والفيديوهات.',
        notes: 'استخدمها مع object-fit: cover لعناصر الصور.',
      },
      ckb: {
        summary: 'ڕێژەی پانی بۆ بەرزی (وەک 16/9) بۆ وێنە و کارتەکان دیاری دەکات.',
        details: 'ڕێگری دەکات لە جووڵانی ناڕێکی پەڕە (CLS) لە کاتی بارکردنی وێنەدا.',
        notes: 'لەگەڵ object-fit: cover بۆ وێنەکان بەکاری بهێنە.',
      },
      kmr: {
        summary: 'ڕێژەیا فرەهی بۆ بلنداهیێ (وەک 16/9) دیار دکەت.',
        details: 'ڕێگریێ ل تێکچوونا دیزاینێ دەمێ بارکرنا وێنەیان دکەت.',
        notes: 'دگەل object-fit: cover بکاربینە.',
      },
    },
  },
  // JavaScript References
  {
    id: 'ref-js-array-reduce',
    track: 'js',
    category: 'Array Methods',
    symbol: 'Array.prototype.reduce()',
    syntax: 'array.reduce((accumulator, current) => nextAcc, initialValue)',
    exampleHtml: '<pre id="out"></pre>',
    exampleCss: 'pre { font-family: monospace; background: #0f172a; color: #e2e8f0; padding: 14px; border-radius: 8px; }',
    exampleJs: 'const prices = [10000, 15000, 5000];\nconst total = prices.reduce((sum, price) => sum + price, 0);\ndocument.getElementById("out").textContent = "Total IQD: " + total;',
    browserSupport: 'All modern browsers (ES5+)',
    published: true,
    translations: {
      en: {
        summary: 'Executes a reducer callback on each element to accumulate a single output value.',
        details: 'Commonly used for sums, grouping items into an object/Map, or flattening nested structures.',
        notes: 'Always supply an explicit initialValue so empty arrays do not throw a TypeError.',
      },
      ar: {
        summary: 'تُنفّذ دالة تجميع على كل عنصر في المصفوفة لإنتاج قيمة واحدة نهائية.',
        details: 'تُستخدم لحساب المجاميع أو تجميع العناصر في كائن أو Map.',
        notes: 'قدّم دائماً قيمة ابتدائية (initialValue) لتجنب الأخطاء مع المصفوفات الفارغة.',
      },
      ckb: {
        summary: 'فانکشنێکی کۆکەرەوە لەسەر هەموو توخمەکانی لیستەکە جێبەجێ دەکات بۆ دەرهێنانی یەک ئەنجام.',
        details: 'بەکارهێنانی باو بۆ کۆکردنەوەی ژمارەکان یان گرووپکردنی داتا.',
        notes: 'هەمیشە بەهای سەرەتایی (initialValue) دابنێ تا لە لیستی بەتاڵدا هەڵە ڕوونەدات.',
      },
      kmr: {
        summary: 'فەنکشنەکا کۆمکرنێ لسەر هەمی توخمێن لیستێ جێبەجێ دکەت دا ئێک ئەنجام بدەت.',
        details: 'بۆ کۆمکرنا ژماران یان گرووپکرنا داتایان دهێتە بکارئینان.',
        notes: 'هەردەم بهایێ دەستپێکێ (initialValue) بدە.',
      },
    },
  },
  {
    id: 'ref-js-fetch',
    track: 'js',
    category: 'Network & Async',
    symbol: 'fetch(url, options)',
    syntax: 'const res = await fetch(url);\nif (!res.ok) throw new Error(res.status);\nconst data = await res.json();',
    exampleHtml: '<pre id="log">Ready</pre>',
    exampleCss: 'pre { font-family: monospace; background: #0f172a; color: #93c5fd; padding: 14px; border-radius: 8px; }',
    exampleJs: 'async function demo() {\n  const payload = await Promise.resolve({ ok: true, status: 200, message: "Always check response.ok before parsing JSON" });\n  document.getElementById("log").textContent = JSON.stringify(payload, null, 2);\n}\ndemo();',
    browserSupport: 'All modern browsers & Node 18+',
    published: true,
    translations: {
      en: {
        summary: 'Performs asynchronous HTTP requests and returns a Promise resolving to a Response.',
        details: 'fetch() only rejects on network failures, not on HTTP 404 or 500 statuses—always verify response.ok.',
        notes: 'Use AbortController to cancel in-flight requests when components unmount.',
      },
      ar: {
        summary: 'تُرسل طلبات HTTP غير متزامنة وتُرجع Promise يحتوي على كائن Response.',
        details: 'تذكّر أن fetch() لا ترفض الطلب عند 404 أو 500؛ تحقق دائماً من response.ok أولاً.',
        notes: 'استخدم AbortController لإلغاء الطلبات عند الحاجة.',
      },
      ckb: {
        summary: 'داواکاریی HTTP بە شێوەی هاوکاتنەبوو (async) دەنێرێت و Promise دەگەڕێنێتەوە.',
        details: 'لە هەڵەی 404 یان 500 دا fetch ڕەت ناکرێتەوە، بۆیە هەمیشە response.ok بپشکنە.',
        notes: 'بۆ هەڵوەشاندنەوەی داواکاری دەتوانیت AbortController بەکاربهێنیت.',
      },
      kmr: {
        summary: 'داخوازێن HTTP ب شێوێ async دهنێریت و Promise دزڤڕینیت.',
        details: 'هەردەم response.ok بپشکنە بەری خواندنا JSON.',
        notes: 'بۆ هەلوەشاندنا داخوازیێ AbortController بکاربینە.',
      },
    },
  },
  {
    id: 'ref-js-addEventListener',
    track: 'js',
    category: 'DOM Events',
    symbol: 'EventTarget.addEventListener()',
    syntax: 'element.addEventListener("click", (event) => { ... });',
    exampleHtml: '<button id="counterBtn">Clicked 0 times</button>',
    exampleCss: 'button { padding: 10px 16px; border: none; border-radius: 8px; background: #2563eb; color: white; font-weight: 600; cursor: pointer; }',
    exampleJs: 'let count = 0;\nconst btn = document.getElementById("counterBtn");\nbtn.addEventListener("click", () => {\n  count += 1;\n  btn.textContent = `Clicked ${count} times`;\n});',
    browserSupport: 'All modern browsers',
    published: true,
    translations: {
      en: {
        summary: 'Registers a listener function to run whenever a specified DOM event fires.',
        details: 'Supports multiple handlers on the same element plus options such as { once: true } and { passive: true }.',
        notes: 'Prefer addEventListener over inline onclick HTML attributes for cleaner separation and CSP compatibility.',
      },
      ar: {
        summary: 'تُسجّل دالة استماع تُنفَّذ عند وقوع حدث DOM محدد.',
        details: 'تدعم تسجيل عدة مستمعين على نفس العنصر مع خيارات مثل { once: true }.',
        notes: 'يفضل استخدامها بدلاً من سمات onclick المضمنة في HTML.',
      },
      ckb: {
        summary: 'فانکشنێک تۆمار دەکات بۆ وەڵامدانەوەی ڕووداوێکی دیاریکراوی DOM وەک کلیک.',
        details: 'دەکرێت چەند گوێگرێک لەسەر هەمان توخم دابنرێت و بژاردەی وەک { once: true } پشتگیری دەکات.',
        notes: 'زۆر باشتر و پارێزراوترە لە نووسینی onclick لەناو HTML.',
      },
      kmr: {
        summary: 'فەنکشنەکێ تۆمار دکەت دا دەمێ ڕوودانەکا DOM (وەک کلیک) کار بکەت.',
        details: 'پشتگیریا چەند گوهـدێران و بژاردەیا { once: true } دکەت.',
        notes: 'ژ onclick یا دناڤ HTML دا پاقژتر و پارێزراوترە.',
      },
    },
  },
  {
    id: 'ref-js-array-map-filter',
    track: 'js',
    category: 'Array Methods',
    symbol: 'Array.prototype.filter() & .map()',
    syntax: 'items.filter(predicate).map(transform)',
    exampleHtml: '<pre id="res"></pre>',
    exampleCss: 'pre { font-family: monospace; background: #0f172a; color: #86efac; padding: 14px; border-radius: 8px; }',
    exampleJs: 'const scores = [45, 78, 92, 61, 88];\nconst passing = scores.filter(s => s >= 70).map(s => `${s}% PASS`);\ndocument.getElementById("res").textContent = passing.join("\\n");',
    browserSupport: 'All modern browsers (ES5+)',
    published: true,
    translations: {
      en: {
        summary: 'Non-mutating array pipelines for selecting matching items and transforming each into a new array.',
        details: 'Chaining filter() followed by map() keeps data transformations declarative and leaves the original array untouched.',
        notes: 'Both methods always return a brand-new array.',
      },
      ar: {
        summary: 'دوال مصفوفات غير معدِّلة للأصل لاختيار العناصر المطابقة وتحويلها إلى مصفوفة جديدة.',
        details: 'سلسلة filter() متبوعة بـ map() تجعل معالجة البيانات واضحة وآمنة.',
        notes: 'تُرجع كلتا الدالتين مصفوفة جديدة بالكامل.',
      },
      ckb: {
        summary: 'دوو فانکشنی لیستن بۆ پاڵاوتن و گۆڕینی داتا بێ دەستکاریکردنی لیستی بنەڕەتی.',
        details: 'پێکەوەبەستنی filter() و map() کۆدێکی خاوێن و ئاسان بۆ خوێندنەوە دروست دەکات.',
        notes: 'هەردووکیان هەمیشە لیستێکی نوێ دەگەڕێننەوە.',
      },
      kmr: {
        summary: 'دوو فەنکشنێن لیستێنە بۆ پالافتن و گۆڕینا داتایان بێ دەستکاریکرنا لیستا سەرەکی.',
        details: 'گرێدانا filter() و map() کۆدەکێ پاقژ چێدکەت.',
        notes: 'هەردوو هەردەم لیستەکا نوی دزڤڕینن.',
      },
    },
  },
];

export const SEED_AI_TOOLS: AiTool[] = [
  {
    id: 'tool-google-ai-studio',
    name: 'Google AI Studio',
    category: 'models',
    officialUrl: 'https://aistudio.google.com',
    pricingModel: 'freemium',
    lastVerifiedAt: '2026-11-22',
    published: true,
    translations: {
      en: {
        tagline: 'Official prototyping workspace and API console for Gemini models.',
        description: 'Build prompts, test structured JSON schemas, and inspect multimodal inputs directly with Gemini models.',
        bestFor: 'Prototyping prompts, testing structured outputs, and developer API integration.',
      },
      ar: {
        tagline: 'بيئة التطوير الرسمية وواجهة برمجة نماذج Gemini من جوجل.',
        description: 'اختبر الأوامر ومخططات JSON الصارمة والمدخلات متعددة الوسائط مباشرة مع نماذج Gemini.',
        bestFor: 'بناء النماذج الأولية واختبار المخرجات المهيكلة ودمج API.',
      },
      ckb: {
        tagline: 'پلاتفۆرمی فەرمیی گووگڵ بۆ تاقیکردنەوە و APIـی مۆدێلەکانی Gemini.',
        description: 'پرۆمپتەکان و سکێمای JSON و تێخراوە فرەمیدیاکان ڕاستەوخۆ لەسەر مۆدێلەکانی Gemini تاقی بکەرەوە.',
        bestFor: 'تاقیکردنەوەی پرۆمپت و بەستنەوەی API بۆ گەشەپێدەران.',
      },
      kmr: {
        tagline: 'پلاتفۆرما فەرمی یا گووگڵێ بۆ تاقیکرن و API یا مۆدێلێن Gemini.',
        description: 'پرۆمپتان و JSONـا ڕێکخستی لسەر مۆدێلێن Gemini تاقی بکە.',
        bestFor: 'تاقیکرنا پرۆمپتان و گرێدانا API.',
      },
    },
  },
  {
    id: 'tool-gemini',
    name: 'Google Gemini',
    category: 'research',
    officialUrl: 'https://gemini.google.com',
    pricingModel: 'freemium',
    lastVerifiedAt: '2026-11-22',
    published: true,
    translations: {
      en: {
        tagline: 'Multimodal AI assistant for reasoning, coding explanations, and research.',
        description: 'Official web assistant supporting long-context technical documents, coding help, and multilingual learning.',
        bestFor: 'Explaining concepts, reviewing architecture ideas, and multilingual study.',
      },
      ar: {
        tagline: 'مساعد ذكاء اصطناعي متعدد الوسائط للبحث والشرح البرمجي.',
        description: 'المساعد الرسمي عبر الويب لدعم المستندات الطويلة والمساعدة البرمجية والتعلم متعدد اللغات.',
        bestFor: 'شرح المفاهيم والمراجعة المعمارية والتعلم بعدة لغات.',
      },
      ckb: {
        tagline: 'یارمەتیدەری زیرەکی دەستکردی فەرمی بۆ لێکۆڵینەوە و فێربوونی پرۆگرامسازی.',
        description: 'یارمەتیدەری فەرمیی وێب بۆ شیکردنەوەی کۆد، لێکۆڵینەوە، و فێربوون بە چەند زمان.',
        bestFor: 'ڕوونکردنەوەی چەمکەکان و لێکۆڵینەوەی تەکنیکی.',
      },
      kmr: {
        tagline: 'هاریکارێ فەرمی یێ AI بۆ لێکۆلین و فێربوونا پرۆگرامسازیێ.',
        description: 'هاریکارێ فەرمی بۆ شیکرنێن کۆدی و خواندنا ب چەند زمانان.',
        bestFor: 'ڕۆنکرنا تێگەهان و لێکۆلینا تەکنیکی.',
      },
    },
  },
  {
    id: 'tool-github-copilot',
    name: 'GitHub Copilot',
    category: 'coding',
    officialUrl: 'https://github.com/features/copilot',
    pricingModel: 'freemium',
    lastVerifiedAt: '2026-11-22',
    published: true,
    translations: {
      en: {
        tagline: 'In-editor AI pair programmer integrated with VS Code and GitHub.',
        description: 'Provides context-aware code completions, inline refactoring, and pull-request explanations directly in your IDE.',
        bestFor: 'Inline code completion, unit test generation, and IDE refactoring.',
      },
      ar: {
        tagline: 'مساعد برمجي مدمج داخل محرر الأكواد VS Code ومنصة GitHub.',
        description: 'يوفّر إكمالاً ذكياً للكود وإعادة هيكلة فورية وشرحاً لطلبات الدمج.',
        bestFor: 'إكمال الكود داخل المحرر وكتابة الاختبارات.',
      },
      ckb: {
        tagline: 'یارمەتیدەری پرۆگرامسازی لەناو VS Code و GitHub.',
        description: 'تەواوکردنی کۆد، ڕێکخستنەوەی کۆد، و یارمەتی نووسینی تێست ڕاستەوخۆ لەناو ئیدیتەردا دابین دەکات.',
        bestFor: 'تەواوکردنی خێرای کۆد و نووسینی تێست.',
      },
      kmr: {
        tagline: 'هاریکارێ پرۆگرامسازیێ دناڤ VS Code و GitHub دا.',
        description: 'تەمامکرنا کۆدی و چێکرنا تێستان ڕاستەوخۆ دناڤ ئیدیتەری دا.',
        bestFor: 'تەمامکرنا کۆدی و ڕێکخستنا پڕۆژەیان.',
      },
    },
  },
  {
    id: 'tool-claude',
    name: 'Claude (Anthropic)',
    category: 'coding',
    officialUrl: 'https://claude.ai',
    pricingModel: 'freemium',
    lastVerifiedAt: '2026-11-22',
    published: true,
    translations: {
      en: {
        tagline: 'Conversational AI assistant focused on clear technical writing and code analysis.',
        description: 'Well suited for dissecting complex codebases, writing documentation, and step-by-step debugging.',
        bestFor: 'Code reviews, technical specifications, and debugging guidance.',
      },
      ar: {
        tagline: 'مساعد ذكاء اصطناعي يركز على الكتابة التقنية الدقيقة وتحليل الكود.',
        description: 'مناسب لمراجعة الكود وكتابة التوثيق البرمجي وتتبع الأخطاء خطوة بخطوة.',
        bestFor: 'مراجعة الأكواد وكتابة التوثيق التقني.',
      },
      ckb: {
        tagline: 'یارمەتیدەری AI بۆ شیکردنەوەی قووڵی کۆد و نووسینی بەڵگەنامەی تەکنیکی.',
        description: 'زۆر باشە بۆ پێداچوونەوەی کۆد، دۆزینەوەی هەڵە، و نووسینی ڕوونکردنەوەی تەکنیکی.',
        bestFor: 'پێداچوونەوەی کۆد و نووسینی بەڵگەنامە.',
      },
      kmr: {
        tagline: 'هاریکارێ AI بۆ شیکرنا کۆدی و نڤیسینا بەلگەنامەیێن تەکنیکی.',
        description: 'گونجایە بۆ پێداچوونا کۆدی و دیتنا خەلەتیان.',
        bestFor: 'پێداچوونا کۆدی و نڤیسینا بەلگەنامەیان.',
      },
    },
  },
  {
    id: 'tool-chatgpt',
    name: 'ChatGPT (OpenAI)',
    category: 'productivity',
    officialUrl: 'https://chatgpt.com',
    pricingModel: 'freemium',
    lastVerifiedAt: '2026-11-22',
    published: true,
    translations: {
      en: {
        tagline: 'General-purpose AI workspace for coding, writing, and problem solving.',
        description: 'Official web interface supporting interactive coding help, data formatting, and study practice.',
        bestFor: 'Brainstorming solutions, explaining error messages, and drafting docs.',
      },
      ar: {
        tagline: 'مساحة عمل ذكاء اصطناعي شاملة للبرمجة والكتابة وحل المشكلات.',
        description: 'الواجهة الرسمية للمساعدة البرمجية وتنسيق البيانات والتدريب الدراسي.',
        bestFor: 'شرح رسائل الأخطاء والعصف الذهني وصياغة المستندات.',
      },
      ckb: {
        tagline: 'یارمەتیدەری گشتگیر بۆ پرۆگرامسازی و نووسین و چارەسەرکردنی کێشە.',
        description: 'پلاتفۆرمی فەرمی بۆ یارمەتی کۆد و ڕوونکردنەوەی پەیامەکانی هەڵە.',
        bestFor: 'ڕوونکردنەوەی هەڵەکانی کۆد و داڕشتنی بیرۆکە.',
      },
      kmr: {
        tagline: 'هاریکارێ گشتی یێ AI بۆ پرۆگرامسازی و نڤیسینێ.',
        description: 'پلاتفۆرما فەرمی بۆ هاریکاریا کۆدی و ڕۆنکرنا خەلەتیان.',
        bestFor: 'ڕۆنکرنا خەلەتیێن کۆدی و هزرکرنێ.',
      },
    },
  },
  {
    id: 'tool-huggingface',
    name: 'Hugging Face',
    category: 'models',
    officialUrl: 'https://huggingface.co',
    pricingModel: 'open_source',
    lastVerifiedAt: '2026-11-22',
    published: true,
    translations: {
      en: {
        tagline: 'Open-source hub for machine learning models, datasets, and demos.',
        description: 'Explore open-weight models, inspect model cards, and test live community Spaces.',
        bestFor: 'Discovering open-source models, datasets, and ML libraries.',
      },
      ar: {
        tagline: 'المنصة المفتوحة المصدر لنماذج الذكاء الاصطناعي ومجموعات البيانات.',
        description: 'استكشف النماذج المفتوحة وبطاقات التوثيق والتجارب التفاعلية.',
        bestFor: 'استكشاف النماذج المفتوحة المصدر ومجموعات البيانات.',
      },
      ckb: {
        tagline: 'ناوەندی سەرچاوە-کراوە بۆ مۆدێلەکانی فێربوونی ئامێر و داتاسێتەکان.',
        description: 'مۆدێلە کراوەکان و داتاسێتەکان و نموونە زیندووەکان بگەڕێ.',
        bestFor: 'دۆزینەوەی مۆدێلی سەرچاوە-کراوە و داتاسێت.',
      },
      kmr: {
        tagline: 'ناڤەندا سەرچاوە-ڤەکری بۆ مۆدێلێن AI و داتاسێتان.',
        description: 'ل مۆدێلێن ڤەکری و داتاسێتان بگەڕە.',
        bestFor: 'دیتنا مۆدێلێن سەرچاوە-ڤەکری.',
      },
    },
  },
  {
    id: 'tool-perplexity',
    name: 'Perplexity',
    category: 'research',
    officialUrl: 'https://www.perplexity.ai',
    pricingModel: 'freemium',
    lastVerifiedAt: '2026-11-22',
    published: true,
    translations: {
      en: {
        tagline: 'Citation-backed AI search engine for up-to-date technical research.',
        description: 'Synthesizes web documentation with inline source links so developers can verify claims quickly.',
        bestFor: 'Comparing libraries, checking recent browser API specs, and cited research.',
      },
      ar: {
        tagline: 'محرك بحث بالذكاء الاصطناعي مدعوم بالمصادر للبحث التقني الحديث.',
        description: 'يلخص التوثيق الرسمي مع روابط مصادر مباشرة للتحقق السريع.',
        bestFor: 'مقارنة المكتبات والبحث الموثق بالمصادر.',
      },
      ckb: {
        tagline: 'بزوێنەری گەڕانی AI بە سەرچاوەی فەرمییەوە بۆ لێکۆڵینەوەی تەکنیکی.',
        description: 'وەڵامەکان لەگەڵ بەستەری سەرچاوەکان دەداتەوە تا بە خێرایی دڵنیا ببیتەوە.',
        bestFor: 'بەراوردکردنی کتێبخانەکان و گەڕانی پشتڕاستکراو.',
      },
      kmr: {
        tagline: 'گەڕیانا AI ب سەرچاوێن فەرمی بۆ لێکۆلینا تەکنیکی.',
        description: 'بەرسڤان دگەل لینکێن سەرچاوەیان ددەت.',
        bestFor: 'بەراوردکرنا کتێبخانەیان و لێکۆلینا پشتڕاستکری.',
      },
    },
  },
  {
    id: 'tool-v0',
    name: 'v0 by Vercel',
    category: 'design',
    officialUrl: 'https://v0.dev',
    pricingModel: 'freemium',
    lastVerifiedAt: '2026-11-22',
    published: true,
    translations: {
      en: {
        tagline: 'UI generation workspace producing React and Tailwind CSS interfaces.',
        description: 'Iterate on layout prototypes visually and inspect clean component code.',
        bestFor: 'Rapid frontend UI prototyping with Tailwind CSS.',
      },
      ar: {
        tagline: 'بيئة لتوليد واجهات React و Tailwind CSS بسرعة.',
        description: 'اختبر نماذج الواجهات بصرياً واستعرض كود المكونات النظيف.',
        bestFor: 'تصميم النماذج الأولية للواجهات باستخدام Tailwind CSS.',
      },
      ckb: {
        tagline: 'ژینگەی دروستکردنی ڕووکاری React و Tailwind CSS.',
        description: 'نموونەی سەرەتایی دیزاینی ڕووکار تاقی بکەرەوە و کۆدەکەی ببینە.',
        bestFor: 'دروستکردنی خێرای نموونەی ڕووکار بە Tailwind CSS.',
      },
      kmr: {
        tagline: 'جهێ چێکرنا ڕووکارێن React و Tailwind CSS.',
        description: 'دیزاینا ڕووکاران تاقی بکە و کۆدێ پاقژ ببینە.',
        bestFor: 'دروستکرنا خێرا یا نموونێن UI.',
      },
    },
  },
];

export const SEED_PROJECTS: CodeProject[] = [
  {
    id: 'proj-responsive-pricing-card',
    title: 'Responsive Pricing Comparison Grid',
    description: 'Clean two-tier HTML & CSS Grid pricing layout with accessible semantic markup and clear typography.',
    track: 'css',
    difficulty: 'beginner',
    tags: ['css-grid', 'responsive', 'ui'],
    html: `<section class="plans" aria-label="Plans">
  <article class="card">
    <p class="kicker">Starter</p>
    <h2>Free</h2>
    <p class="price">0 IQD / month</p>
    <ul>
      <li>HTML, CSS &amp; JavaScript lessons</li>
      <li>Sandboxed live code editor</li>
      <li>Daily AI learning quota</li>
    </ul>
    <button type="button" class="btn secondary">Start Free</button>
  </article>
  <article class="card featured">
    <p class="kicker">Recommended</p>
    <h2>Pro Learner</h2>
    <p class="price">10,000 IQD / month</p>
    <ul>
      <li>Unlimited normal AI usage (fair use)</li>
      <li>Timed exams &amp; advanced practice</li>
      <li>Full progress analytics</li>
    </ul>
    <button type="button" class="btn primary">Choose Pro</button>
  </article>
</section>`,
    css: `body { margin: 0; padding: 20px; background: #0b1326; color: #f8fafc; font-family: system-ui, sans-serif; }
.plans { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; max-width: 640px; margin: 0 auto; }
.card { background: #0f182e; border: 1px solid #1e2b48; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
.card.featured { border-color: #3b82f6; }
.kicker { margin: 0; font-size: 12px; color: #94a3b8; }
h2 { margin: 0; font-size: 20px; }
.price { margin: 0; font-size: 18px; font-weight: 700; color: #93c5fd; }
ul { margin: 4px 0 12px; padding-inline-start: 18px; color: #cbd5e1; font-size: 14px; line-height: 1.6; }
.btn { padding: 10px 16px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; margin-top: auto; }
.btn.primary { background: #2563eb; color: #fff; }
.btn.secondary { background: #172442; color: #e2e8f0; border: 1px solid #2b3c63; }`,
    js: `document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.textContent = 'Selected';
  });
});`,
    authorUid: 'karejan-official',
    authorName: 'KARÊJAN Team',
    isOfficial: true,
    status: 'approved',
    translations: {
      en: {
        title: 'Responsive Pricing Comparison Grid',
        description: 'Clean two-tier HTML & CSS Grid pricing layout with accessible semantic markup and clear typography.',
      },
      ar: {
        title: 'شبكة مقارنة خطط متجاوبة (CSS Grid)',
        description: 'تخطيط نظيف لبطاقات خطط باستخدام CSS Grid ووسوم HTML الدلالية.',
      },
      ckb: {
        title: 'تۆڕی بەراوردکردنی پلانەکان بە CSS Grid',
        description: 'دیزاینێکی ڕیسپۆنسیڤ و خاوێن بۆ پلانەکان بە HTML و CSS Grid.',
      },
      kmr: {
        title: 'تۆڕا بەراوردکرنا پلانان ب CSS Grid',
        description: 'دیزاینەکا ڕیسپۆنسیڤ و پاقژ ب HTML و CSS Grid.',
      },
    },
  },
  {
    id: 'proj-vanilla-task-tracker',
    title: 'Interactive Study Checklist (Vanilla JS)',
    description: 'State-driven DOM rendering with filter controls, completion counter, and zero external libraries.',
    track: 'js',
    difficulty: 'intermediate',
    tags: ['javascript', 'dom', 'state'],
    html: `<main class="app">
  <h2>Study Checklist</h2>
  <form id="taskForm" class="row">
    <input id="taskInput" type="text" placeholder="Add a coding goal..." required />
    <button type="submit">Add</button>
  </form>
  <p id="stats" class="meta"></p>
  <ul id="list"></ul>
</main>`,
    css: `body { margin: 0; padding: 20px; background: #0b1326; color: #f8fafc; font-family: system-ui, sans-serif; }
.app { max-width: 440px; margin: 0 auto; background: #0f182e; border: 1px solid #1e2b48; border-radius: 12px; padding: 20px; }
h2 { margin: 0 0 12px; font-size: 18px; }
.row { display: flex; gap: 8px; }
input { flex: 1; padding: 8px 10px; border-radius: 8px; border: 1px solid #334155; background: #080e1e; color: #fff; }
button { padding: 8px 14px; border-radius: 8px; border: none; background: #2563eb; color: #fff; font-weight: 600; cursor: pointer; }
.meta { font-size: 12px; color: #94a3b8; margin: 12px 0 8px; }
ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; }
li { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: #16233f; border-radius: 8px; font-size: 14px; cursor: pointer; }
li.done span { text-decoration: line-through; color: #94a3b8; }`,
    js: `const tasks = [
  { text: 'Build semantic HTML layout', done: true },
  { text: 'Practice CSS Flexbox alignment', done: false },
  { text: 'Solve Array filter & map exercise', done: false }
];
const list = document.getElementById('list');
const stats = document.getElementById('stats');
function render() {
  list.textContent = '';
  const doneCount = tasks.filter(t => t.done).length;
  stats.textContent = doneCount + ' of ' + tasks.length + ' completed';
  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');
    const span = document.createElement('span');
    span.textContent = task.text;
    const state = document.createElement('small');
    state.textContent = task.done ? 'Done' : 'Todo';
    li.append(span, state);
    li.addEventListener('click', () => { task.done = !task.done; render(); });
    list.appendChild(li);
  });
}
document.getElementById('taskForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('taskInput');
  if (!input.value.trim()) return;
  tasks.push({ text: input.value.trim(), done: false });
  input.value = '';
  render();
});
render();`,
    authorUid: 'karejan-official',
    authorName: 'KARÊJAN Team',
    isOfficial: true,
    status: 'approved',
    translations: {
      en: {
        title: 'Interactive Study Checklist (Vanilla JS)',
        description: 'State-driven DOM rendering with completion counter and safe textContent updates.',
      },
      ar: {
        title: 'قائمة مهام دراسية تفاعلية (JavaScript)',
        description: 'إدارة حالة وتحديث آمن للـ DOM باستخدام textContent وعداد للإنجاز.',
      },
      ckb: {
        title: 'لیستی ئەرکەکانی خوێندن بە JavaScript',
        description: 'نوێکردنەوەی DOM بە شێوەی سەلامەت بە textContent لەگەڵ ژمێرەری تەواوکردن.',
      },
      kmr: {
        title: 'لیستا ئەرکێن خواندنێ ب JavaScript',
        description: 'نویکرنا DOM ب textContent دگەل هژمێرەرێ تەمامکرنێ.',
      },
    },
  },
  {
    id: 'proj-accessible-faq',
    title: 'Zero-JS Accessible FAQ Accordion',
    description: 'Uses native HTML <details> and <summary> elements with crisp CSS transitions and keyboard support.',
    track: 'html',
    difficulty: 'beginner',
    tags: ['html', 'accessibility', 'accordion'],
    html: `<section class="faq">
  <h2>Frequently Asked Questions</h2>
  <details open>
    <summary>Why use semantic HTML tags?</summary>
    <p>Semantic tags improve accessibility, search indexing, and code readability without extra ARIA boilerplate.</p>
  </details>
  <details>
    <summary>Do I need JavaScript for an accordion?</summary>
    <p>Not for basic expand/collapse behavior—native &lt;details&gt; works with keyboard and screen readers automatically.</p>
  </details>
</section>`,
    css: `body { margin: 0; padding: 20px; background: #0b1326; color: #f8fafc; font-family: system-ui, sans-serif; }
.faq { max-width: 520px; margin: 0 auto; display: grid; gap: 10px; }
h2 { margin: 0 0 6px; font-size: 18px; }
details { background: #0f182e; border: 1px solid #1e2b48; border-radius: 10px; padding: 14px 16px; }
summary { font-weight: 600; cursor: pointer; color: #e2e8f0; }
p { margin: 10px 0 0; font-size: 14px; color: #94a3b8; line-height: 1.6; }`,
    js: '',
    authorUid: 'karejan-official',
    authorName: 'KARÊJAN Team',
    isOfficial: true,
    status: 'approved',
    translations: {
      en: {
        title: 'Zero-JS Accessible FAQ Accordion',
        description: 'Uses native HTML <details> and <summary> elements with crisp CSS and keyboard support.',
      },
      ar: {
        title: 'أكورديون أسئلة شائعة متاح بدون JavaScript',
        description: 'يعتمد على <details> و <summary> الأصلية مع دعم تلقائي للوحة المفاتيح.',
      },
      ckb: {
        title: 'بەشی پرسیارە باوەکان (FAQ) بەبێ JavaScript',
        description: 'توخمەکانی <details> و <summary> بەکاردەهێنێت بە پشتگیریی خۆکارانەی کیبۆرد.',
      },
      kmr: {
        title: 'پشکا پرسیارێن بەربەلاڤ (FAQ) بێی JavaScript',
        description: 'توخمێن <details> و <summary> بکاردهینیت.',
      },
    },
  },
  {
    id: 'proj-password-strength-meter',
    title: 'Real-Time Password Strength Validator',
    description: 'Accessible form validation demonstrating regex rules, live feedback text, and progressive strength bar.',
    track: 'fullstack-web',
    difficulty: 'intermediate',
    tags: ['forms', 'validation', 'security'],
    html: `<main class="box">
  <label for="pw">Test Password Strength</label>
  <input id="pw" type="password" placeholder="Enter sample password" autocomplete="new-password" />
  <div class="meter"><div id="bar"></div></div>
  <p id="verdict" class="meta">Enter at least 8 characters</p>
</main>`,
    css: `body { margin: 0; padding: 20px; background: #0b1326; color: #f8fafc; font-family: system-ui, sans-serif; }
.box { max-width: 400px; margin: 0 auto; background: #0f182e; border: 1px solid #1e2b48; border-radius: 12px; padding: 20px; display: grid; gap: 10px; }
label { font-size: 14px; font-weight: 600; }
input { padding: 10px 12px; border-radius: 8px; border: 1px solid #334155; background: #080e1e; color: #fff; font-size: 14px; }
.meter { height: 8px; background: #1e293b; border-radius: 99px; overflow: hidden; }
#bar { height: 100%; width: 0%; background: #ef4444; transition: width 160ms ease, background 160ms ease; }
.meta { margin: 0; font-size: 13px; color: #cbd5e1; }`,
    js: `const pw = document.getElementById('pw');
const bar = document.getElementById('bar');
const verdict = document.getElementById('verdict');
pw.addEventListener('input', () => {
  const v = pw.value;
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/\\d/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const pct = (score / 4) * 100;
  bar.style.width = pct + '%';
  const levels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#22c55e'];
  bar.style.background = colors[score];
  verdict.textContent = levels[score] + ' (' + score + '/4 checks)';
});`,
    authorUid: 'karejan-official',
    authorName: 'KARÊJAN Team',
    isOfficial: true,
    status: 'approved',
    translations: {
      en: {
        title: 'Real-Time Password Strength Validator',
        description: 'Accessible form validation demonstrating regex rules, live feedback text, and progressive strength bar.',
      },
      ar: {
        title: 'مقياس قوة كلمة المرور الفوري',
        description: 'تحقق تفاعلي من قوة كلمة المرور باستخدام التعابير النمطية وشريط قياس متدرج.',
      },
      ckb: {
        title: 'پێوەری بەهێزیی وشەی نهێنی بە شێوەی زیندوو',
        description: 'پشکنینی فۆرم بە Regex و پێوەری ڕەنگی هەنگاو بە هەنگاو.',
      },
      kmr: {
        title: 'پیڤەرێ بهێزیا پەیڤا نهێنی یا ڕاستەوخۆ',
        description: 'پشکنینا فۆرمێ ب Regex و شریتا ڕەنگی.',
      },
    },
  },
];
