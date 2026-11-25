import type { Locale } from '../types/domain';
import { PROMPTS_I18N } from './promptsCatalogI18n';

export type PromptCategory =
  | 'reasoning'
  | 'learning'
  | 'debugging'
  | 'refactoring'
  | 'architecture'
  | 'security'
  | 'productivity';

export interface GoldenPrompt {
  id: string;
  name: string;
  names?: Record<Locale, string>;
  category: PromptCategory;
  badge?: string;
  badges?: Record<Locale, string>;
  shortDesc: {
    ckb: string;
    en: string;
    kmr?: string;
    ar?: string;
  };
  directiveExplanation: {
    ckb: string;
    en: string;
    kmr?: string;
    ar?: string;
  };
  whenToUse: {
    ckb: string;
    en: string;
    kmr?: string;
    ar?: string;
  };
  promptTemplate: string;
  promptTemplates?: Record<Locale, string>;
  exampleSnippet: string;
  exampleSnippets?: Record<Locale, string>;
  impactScore: number;
  tags: string[];
}

const RAW_GOLDEN_PROMPTS: GoldenPrompt[] = [
  // 1. THINK10X
  {
    id: 'think-10x',
    name: 'THINK10X (بیرکردنەوەی دە هێندە و قووڵ)',
    category: 'reasoning',
    badge: 'داواکراوی تایبەت 🔥',
    shortDesc: {
      ckb: 'فەرمان بە مۆدێلەکە بۆ بیرکردنەوە لە ١٠ ئاستی جیاواز پێش وەڵامدانەوە، دۆزینەوەی هەموو کێشە نادیارەکان و پێشکەشکردنی باشترین چارەسەر.',
      en: 'Forces the model to reason through 10 distinct layers of problem-space before generating output, eliminating superficial answers.',
    },
    directiveExplanation: {
      ckb: 'ئەم پرۆمپتە وا لە چاتبۆت دەکات پەلە نەکات لە وەڵامی سەرپێیی؛ سەرەتا مەبەستی ڕاستەقینە شیبکاتەوە، سیناریۆ دەگمەنەکان (Edge Cases) بهێنێتە پێش چاو، کارامەیی میمۆری و سڕینەوەی باگە شاراوەکان لەبەرچاو بگرێت و تەنها دوای ئەوە وەڵامێکی تەواو تۆکمە پێشکەش بکات.',
      en: 'Instructs the LLM to simulate multiple evaluation passes internally: root-cause analysis, side effects, backward compatibility, performance bottlenecks, and UX constraints.',
    },
    whenToUse: {
      ckb: 'کاتێک ڕووبەڕووی کێشەیەکی تەکنیکی ئاڵۆز دەبیتەوە، پڕۆژەیەکی گرنگ لەبەردەستدایە، یان باگێکی لەناکاو لە پرۆدەکشندا دروستبووە و ناتەوێت هیچ هەڵەیەک ڕووبدات.',
      en: 'Use for complex architectural migrations, persistent hard-to-trace bugs, or high-stakes production features.',
    },
    promptTemplate: `[DIRECTIVE: THINK10X]
پێش ئەوەی هیچ دێڕێک کۆد یان وەڵام بنووسیت، تکایە لەم ١٠ ئاستەدا بە قووڵی بیربکەرەوە:
١. مەبەستی بنەڕەتی و هۆکاری سەرەکی کێشەکە چییە؟
٢. چ کێشە و هەڵەیەکی شاراوە (Edge Cases) ڕەنگە ڕووبدات؟
٣. کاریگەری ئەم چارەسەرە لەسەر خێرایی (Performance) و ئاسایش چی دەبێت؟
٤. چۆن بە پاکترین شێواز و کەمترین ئەگەری باگ جێبەجێی بکەین؟
٥. پاشان چارەسەری کۆتایی و هەنگاوەکانم بە ڕوونی پێشکەش بکە.

کێشەکەم ئەمەیە:
[کێشە یان داواکارییەکەت لێرە بنووسە]`,
    exampleSnippet: `THINK10X: ئەم ئەپە دوای ١٠ خولەک کارکردن میمۆری پڕ دەبێت (Memory Leak). دەمەوێت لە هەموو لایەنێکەوە هۆکارەکانی شیکار بکەیت و کۆدێکی پارێزراو دابنێیت.`,
    impactScore: 98,
    tags: ['#THINK10X', '#DeepReasoning', '#NoBugs', '#Production'],
  },

  // 2. ELI5
  {
    id: 'eli5',
    name: 'ELI5 (Explain Like I’m 5 / وەک بۆ ٥ ساڵان)',
    category: 'learning',
    badge: 'فێربوونی خێرا 🎓',
    shortDesc: {
      ckb: 'ڕوونکردنەوەی ئاڵۆزترین بیرۆکە، ئەلگۆریزم و تەکنەلۆژیاکان بە شێوازێکی زۆر سادە بەبێ بەکارهێنانی زاراوەی ئاڵۆز.',
      en: 'Breaks down complex computing and architectural concepts into intuitive, jargon-free metaphors understandable by anyone.',
    },
    directiveExplanation: {
      ckb: 'وشەی ELI5 کورتکراوەی "Explain Like I\'m 5"ە. فەرمان بە مۆدێلەکە دەکات لەبری قسەی ئەکادیمی و پێناسەی وشک، نموونەی ڕۆژانەی ژیان بەکاربهێنێت تا مێشک دەستبەجێ چەمکەکە هەرس بکات.',
      en: 'Forces the AI to ditch convoluted CS jargon and instead use real-life physical analogies, clarifying why something exists before detailing how it works.',
    },
    whenToUse: {
      ckb: 'کاتێک لە تێگەیشتنی چەمکێکی وەک Promises, Recursion, Docker, Kubernetes, WebSockets, یان JWT گیری خواردووە.',
      en: 'Use when grasping a new unfamiliar framework, complex protocol, or conceptual abstraction for the first time.',
    },
    promptTemplate: `[DIRECTIVE: ELI5]
تکایە ئەم چەمکە پرۆگرامینگییە بۆ من وەک بۆ منداڵێکی ٥ ساڵان یان کەسێکی تەواو سەرەتایی ڕوونبکەرەوە:
- هیچ زاراوەیەکی تەکنیکی قورس بەکارمەهێنە مەگەر بە نموونەی ڕۆژانەی ژیان لێکی بدەیتەوە.
- نموونەیەکی واقیعی (وەک چێشتخانە، قوتابخانە، یاری منداڵان) بەکاربهێنە.
- لە کۆتاییدا لە ٢ دێڕدا کۆی مەبەستەکەم پێ بڵێ.

بابەتەکە:
[ناوی چەمکەکە یان ئەو شتەی تێینەگەیشتوویت لێرە دابنێ]`,
    exampleSnippet: `ELI5: کۆنسێپتی Docker و Containers چییە و چۆن جیاوازە لە ویندۆزی ئاسایی؟ بە شێوازێکی ڕۆژانە ڕوونی بکەرەوە.`,
    impactScore: 95,
    tags: ['#ELI5', '#BeginnerFriendly', '#Analogies', '#ConceptLearning'],
  },

  // 3. FIRST PRINCIPLES
  {
    id: 'first-principles',
    name: 'FIRST PRINCIPLES (بیرکردنەوە لە بنەڕەتەوە)',
    category: 'reasoning',
    badge: 'شیکاری ئیلۆن ماسک 🚀',
    shortDesc: {
      ckb: 'شیکردنەوەی کێشەکە بۆ بنەڕەتیترین ڕاستییە فیزیکی و لۆجیکییەکان لەبری کۆپیکردنی چارەسەری باو.',
      en: 'Deconstructs the problem to its fundamental computational truths rather than reasoning by analogy or convention.',
    },
    directiveExplanation: {
      ckb: 'ئەم پرۆمپتە وادەکات چاتبۆتەکە پێشنیاری کۆن و باوی خەڵک دووبارە نەکاتەوە؛ بەڵکو لە "کۆمپیوتەر چۆن کاردەکات"، "بایتەکان چۆن دەجووڵێن" و "سەرچاوە سەرەکییەکان چین" دەستپێبکات بۆ دۆزینەوەی کەمترین تێچوو و بەرزترین خێرایی.',
      en: 'Prevents boilerplate complacency. Forces the AI to ask: what is strictly required at the byte, CPU, and network level, then build the leanest possible system.',
    },
    whenToUse: {
      ckb: 'کاتێک دەتەوێت کێشەیەک بە تەواوی نوێ چارەسەر بکەیت کە هیچ لایبرەرییەکی ئامادەکراو نییە یان دەستکاری ستانداردێک دەکەیت.',
      en: 'Use when existing libraries feel bloated, when redesigning a workflow from zero, or optimizing cost at massive scale.',
    },
    promptTemplate: `[DIRECTIVE: FIRST PRINCIPLES]
لەم کێشەیەدا هیچ چارەسەرێکی باو و کۆپیکراو لەبەرچاو مەگرە. 
تکایە بابەتەکە هەڵوەشێنەرەوە بۆ سەرەکیترین ڕاستییە نەگۆڕەکان:
١. لە بنەڕەتدا کام داتایە پێویستە بنێردرێت و پاشەکەوت بکرێت؟
٢. سادەترین میکانیزم بۆ گەیشتن بەم ئامانجە بە کەمترین هەنگاو چییە؟
٣. چۆن بە کەمترین تێچوو و کۆد بنیاتی بنێین بەبێ زیادکردنی پاکێجی ناپێویست؟

کێشەکە:
[کێشەکەت لێرە دابنێ]`,
    exampleSnippet: `FIRST PRINCIPLES: لەبری دانانی سیستەمێکی ئاڵۆزی ڕیدیس و ڕابیت ئێم کیو، چۆن بە سادەترین میتۆد لەناو پایتۆندا سیستەمی صف (Queue) بۆ ١٠ هەزار داواکاری دروستبکەم؟`,
    impactScore: 92,
    tags: ['#FirstPrinciples', '#Architecture', '#Minimalist', '#Innovation'],
  },

  // 4. NO FLUFF / SENIOR DEV MODE
  {
    id: 'no-fluff',
    name: 'NO FLUFF / SENIOR DEV MODE (بەبێ قسەی زیادە)',
    category: 'productivity',
    badge: 'خێرا و پڕۆفیشناڵ ⚡',
    shortDesc: {
      ckb: 'سڕینەوەی هەموو پێشەکی، دەستخۆشی، و دەقی بێسوود؛ تەنها پێدانی کۆدی کارا، تێستی پێویست و هەنگاوە تەکنیکییەکان.',
      en: 'Eliminates pleasantries, conversational filler, and generic advice. Delivers code, rationale, and diffs only.',
    },
    directiveExplanation: {
      ckb: 'پرۆگرامەرانی پێشکەوتوو کاتیان نییە بۆ خوێندنەوەی "دەستت خۆش بێت بۆ ئەم پرسیارە نایابە!". ئەم پرۆمپتە مۆدێلەکە دەخاتە دۆخی ئەندازیارێکی باڵا کە ڕاستەوخۆ دەچێتە سەر کێشەکە و کۆدی دروست دەخاتە بەردەستت.',
      en: 'Enforces senior engineering brevity: zero preamble, minimal markdown overhead, syntax-highlighted code blocks, and pinpointed line edits.',
    },
    whenToUse: {
      ckb: 'کاتێک لە کاتی کارکردنی ڕاستەقینەدایت و تەنها کۆد و چارەسەرت بەپەلە دەوێت بەبێ کات بەفیڕۆدان.',
      en: 'Ideal during fast coding sprints when you need drop-in solutions without reading narrative essays.',
    },
    promptTemplate: `[DIRECTIVE: NO FLUFF / SENIOR DEV MODE]
- هیچ پێشەکی، سڵاو، دەستخۆشی، یان دەقی زیادە لە سەرەتا و کۆتایی مەنووسە.
- ڕاستەوخۆ کۆدی پاک، تاقیکراوە، و تەواوی چارەسەرەکە دابنێ.
- ئەگەر پێویست بوو تەنها ٣ خاڵی سەرەکی زۆر کورت بۆ ڕوونکردنەوەی گۆڕانکارییەکان بنووسە.
- کۆدەکە با بەرزترین ستانداردی TypeScript / Clean Code پەیڕەو بکات.

ئەرکەکەم:
[کۆد یان داواکارییەکەت لێرە بنووسە]`,
    exampleSnippet: `NO FLUFF: فەنکشنێکی TypeScript بۆ دیاریکردنی جیاوازی نێوان دوو بەروار بە ڕۆژ و کاتژمێر بنووسە بەپێی کاتی کوردستان.`,
    impactScore: 97,
    tags: ['#NoFluff', '#SeniorDev', '#Direct', '#FastCode'],
  },

  // 5. RUBBER DUCK DEBUGGER
  {
    id: 'rubber-duck',
    name: 'RUBBER DUCK DEBUGGER (دیباگکەری بەتەی لاستیکی)',
    category: 'debugging',
    badge: 'تەکنیکی ئەفسانەیی 🦆',
    shortDesc: {
      ckb: 'مۆدێلەکە دەبێتە بەتەی لاستیکی زیرەک کە پرسیاری ئاراستەکراوت لێدەکات بۆ ئەوەی خۆت کەلێنی نێوان هزر و کۆدەکەت بدۆزیتەوە.',
      en: 'Interactive debugging persona that interrogates your assumptions line-by-line until the root bug surfaces.',
    },
    directiveExplanation: {
      ckb: 'لە پرۆگرامینگدا کاتێک کێشەکەت بۆ بەتەیەکی سەر مێزەکەت ڕووندەکەیتەوە، مێشکت کێشەکە دەبینێت. ئەم پرۆمپتە وا لە AI دەکات لەبری ئەوەی یەکسەر کۆدی تر بنووسێت، لێت بپرسێت: "لە دێڕی ٥ پێت وایە ئەم گۆڕاوە چ بەهایەکی هەبێت؟"',
      en: 'Simulates the proven pedagogical method of rubber-ducking: rather than handing down arbitrary code, it tests the developer’s mental model to uncover faulty logic.',
    },
    whenToUse: {
      ckb: 'کاتێک کۆدەکە هیچ هەڵەیەکی سینتاکسی نادات بەڵام ئەنجامەکەی بە هەڵە دەردەچێت و سەرت لێ تێکچووە.',
      en: 'Use for silent logic bugs, off-by-one errors, state race conditions, and unexpected output flows.',
    },
    promptTemplate: `[DIRECTIVE: RUBBER DUCK DEBUGGER]
تۆ لەم ساتەوە بەتەی لاستیکی (Rubber Duck)ی منیت بۆ دیباگکردن. 
یەکسەر کۆدم پێ مەدە؛ بەڵکو:
١. سەرەتا پرسیارم لێبکە کە چاوەڕوانی چ ئەنجامێک دەکەم و ئێستا چ ئەنجامێک دەبینم.
٢. بپرسە لەسەر بەهای گۆڕاوەکان لە کاتی جێبەجێکردندا.
٣. هەنگاو بە هەنگاو یارمەتیم بدە بە قسەکردن دەستنیشانی ئەو دێڕە بکەم کە ئەنجامەکەی تێکداوە.

کۆدەکەم ئەمەیە:
[کۆدەکە دابنێ]`,
    exampleSnippet: `RUBBER DUCK: ئەم کۆدە بە هەڵە فلتەری ناوەکان ناکات و هەمووی بە بەتاڵی دەگەڕێنێتەوە، پرسیارم لێبکە بزانە کێشەکەم لە کوێیە.`,
    impactScore: 94,
    tags: ['#RubberDuck', '#InteractiveDebugging', '#LogicBugs', '#Methodology'],
  },

  // 6. CODE ROAST & BRUTAL CODE REVIEW
  {
    id: 'code-roast',
    name: 'BRUTAL CODE REVIEW (پێداچوونەوەی توند و بێبەزەییانە)',
    category: 'refactoring',
    badge: 'ئاستی ئەندازیاری باڵا 🎯',
    shortDesc: {
      ckb: 'پێداچوونەوەی کۆد وەک سەرپەرشتیارێکی زۆر تووندی Google یان Meta بە دۆزینەوەی هەموو کەلێنێکی ئاسایش و خێرایی.',
      en: 'Unflinchingly honest, zero-compromise code audit pointing out every single flaw, inefficiency, and smell.',
    },
    directiveExplanation: {
      ckb: 'زۆرجار چاتبۆتەکان تەنها بەسەر کۆددا هەڵدەدەن و دەڵێن کۆدەکەت نایابە! ئەم پرۆمپتە پێی دەڵێت هیچ چاوپۆشییەک نەکات؛ بە تووندی باسی کەلێنەکانی ئاسایش، ناڕێکی ناوەکان، تێچووی زۆری میمۆری و باگە ئەگەرییەکان بکات.',
      en: 'Overrides the AI’s default sycophancy. Demands an uncompromising technical tear-down covering security vulnerabilities, race conditions, memory leaks, and anti-patterns.',
    },
    whenToUse: {
      ckb: 'پێش ناردنی پڕۆژە بۆ بەرهەمهێنان (Production) یان پێش تێستی چاوپێکەوتنی کار (Technical Interview).',
      en: 'Use before shipping mission-critical code to production or submitting code for critical enterprise review.',
    },
    promptTemplate: `[DIRECTIVE: BRUTAL CODE REVIEW & ROAST]
وەک سەرپەرشتیارێکی ئەندازیاری سۆفتوێری توند و بێبەزەیی (Principal Staff Engineer) بە کۆدەکەمدا بچۆرەوە. 
هیچ دەستخۆشییەک مەکە؛ بە ڕوونی پێم بڵێ:
١. کەلێنە ئەمنییەکان (Security Vulnerabilities) و ئەگەری SQL Injection / XSS.
٢. کێشەکانی خێرایی و باری قورس لەسەر میمۆری (Memory Leaks, Unnecessary Re-renders).
٣. ناڕێکی لە ناونانی گۆڕاوەکان و پێشێلکردنی بنەماکانی Clean Code.
٤. کۆدە چاککراوەکە بە بەرزترین ستاندارد پێشکەش بکە.

کۆدی من:
[کۆدەکەت لێرە دابنێ]`,
    exampleSnippet: `BRUTAL CODE REVIEW: ئەم کۆدی لاپەڕەی پارەدانە بخوێنەرەوە و هەموو کەموکوڕییەکی ئاسایش و هەڵەی لۆجیکی ئاشکرا بکە.`,
    impactScore: 96,
    tags: ['#BrutalReview', '#SecurityAudit', '#PrincipalEngineer', '#CleanCode'],
  },

  // 7. SOCRATIC MENTOR
  {
    id: 'socratic-mentor',
    name: 'SOCRATIC MENTOR (مامۆستای سوقراتی)',
    category: 'learning',
    badge: 'تێگەیشتنی قووڵ 🧠',
    shortDesc: {
      ckb: 'فێربوون لە ڕێگەی دیالۆگی فیکری؛ مۆدێلەکە پرسیارت لێ دەکات تا خۆت فەنکشنەکە دابڕێژیت لەبری پێدانی کۆپی.',
      en: 'Guides you to derive solutions through strategic inquiry rather than spoon-feeding finished code.',
    },
    directiveExplanation: {
      ckb: 'ئەگەر هەمیشە وەڵامی ئامادەکراو وەربگریت، هەرگیز پرۆگرامەرێکی بەهێز دروست نابیت. سوقراتی فێرکار سەرەتا بیرت دەخاتەوە کە کام ئامراز لەبەردەستتدایە و بە پرسیاری زیرەکانە دەتباتە سەر وەڵامە دروستەکە.',
      en: 'Enhances cognitive retention. Instead of acting as an outsourced coder, the AI becomes a master professor leading you to the "Aha!" realization.',
    },
    whenToUse: {
      ckb: 'لە کاتی خۆئامادەکردن بۆ چاوپێکەوتنی پرۆگرامینگ، شیکارکردنی پرسیارەکانی ڕۆژ، یان فێربوونی زمانێکی نوێ.',
      en: 'Perfect for students, boot campers, and engineers preparing for coding interviews.',
    },
    promptTemplate: `[DIRECTIVE: SOCRATIC MENTOR]
تۆ لەم ساتەوە مامۆستای سوقراتی منیت. لە هیچ حاڵەتێکدا وەڵامی کۆتایی یان کۆدی تەواو پێم مەدە!
بەڵکو:
١. لێم بپرسە چۆن بیر لەم کێشەیە دەکەمەوە.
٢. ئاماژەیەک (Hint)م پێبدە کە چاوەکانم بکاتەوە.
٣. هەر کاتێک هەنگاوێک چوومە پێشەوە، هانم بدە و پرسیاری هەنگاوی دواتر بکە.

ئەو شتەی دەمەوێت فێری بم:
[پرسیارەکە یان کێشەکە لێرە بنووسە]`,
    exampleSnippet: `SOCRATIC MENTOR: چۆن فەنکشنێک دروستبکەم کە وشەیەک وەربگرێت و بپشکنێت کە ئایا پالیندرۆمە (واتا پێچەوانەکەشی هەمان وشەیە)؟ پرسیارم لێبکە تا خۆم کۆدەکە بنووسم.`,
    impactScore: 93,
    tags: ['#Socratic', '#ActiveLearning', '#DeepUnderstanding', '#InterviewPrep'],
  },

  // 8. STEP-BY-STEP (CHAIN OF THOUGHT)
  {
    id: 'step-by-step',
    name: 'CHAIN OF THOUGHT ("با هەنگاو بە هەنگاو بیربکەینەوە")',
    category: 'reasoning',
    badge: 'سەلمێنراوی زانستی 📐',
    shortDesc: {
      ckb: 'بەناوبانگترین فەرمانی لێکۆڵینەوە لە جیهاندا کە ڕێژەی هەڵەی مۆدێلەکان بە شێوەیەکی سەرسوڕهێنەر کەمدەکاتەوە.',
      en: 'Forces sequential step-by-step inference, mathematically proven to slash hallucination and logic errors.',
    },
    directiveExplanation: {
      ckb: 'توێژینەوەکانی زانکۆی تۆکیۆ و گۆگڵ سەلماندیان کە تەنها نووسینی "Let\'s think step by step" زیرەکی مۆدێلەکان لە ماتماتیک و کۆد بە ڕێژەی زیاتر لە %٣٠ زیاد دەکات، چونکە کۆنتێکستی پێشوو دەبێتە مێشک بۆ هەنگاوی دواتر.',
      en: 'Chain-of-thought prompting forces the model to tokenize intermediate reasoning steps before arriving at a final assertion, minimizing leap-of-faith hallucinations.',
    },
    whenToUse: {
      ckb: 'بۆ هەر ئەلگۆریزمێکی ماتماتیکی، لۆجیکی بازنەیی (Recursion)، یان دابەشکردنی پەیوەندی داتابەیس.',
      en: 'Use whenever calculating complex states, combinatorics, or multi-branch logic.',
    },
    promptTemplate: `[DIRECTIVE: LET'S THINK STEP BY STEP]
تکایە بە شێوازی زنجیرەیی بیربکەرەوە (Chain of Thought):
هەنگاو ١: پێناسەکردنی داتای هاتوو (Inputs) و دەرچوو (Expected Outputs).
هەنگاو ٢: دیاریکردنی حاڵەتە بنەڕەتییەکان (Base Cases).
هەنگاو ٣: شیکردنەوەی سووڕەکان (Loops / Logic) دێڕ بە دێڕ.
هەنگاو ٤: کۆکردنەوەی هەموو بەشەکان لە کۆدێکی تەواو و تاقیکراوەدا.

ئەرکەکە:
[کێشەکەت لێرە دابنێ]`,
    exampleSnippet: `LET'S THINK STEP BY STEP: فەنکشنێک بۆ ژماردنی ژمارەی وشە دووبارەبووەکانی ناو دەقێکی کوردی بەپێی دووبارەبوونەوە بە ڕێزبەندی گەورە بۆ بچووک.`,
    impactScore: 99,
    tags: ['#ChainOfThought', '#StepByStep', '#ProvenBenchmark', '#LogicMaster'],
  },

  // 9. REFACTOR TO CLEAN CODE & SOLID
  {
    id: 'clean-code-solid',
    name: 'CLEAN CODE & SOLID REFACTOR (ڕێکخستنەوەی مۆدێرن)',
    category: 'refactoring',
    badge: 'تەلارسازی پارێزراو 🧼',
    shortDesc: {
      ckb: 'گۆڕینی کۆدی شێواوی پڕ لە دووبارەبوونەوە (Spaghetti Code) بۆ کۆدێکی مۆدێرن بە پەیڕەوکردنی بنەماکانی SOLID و DRY.',
      en: 'Transforms tangled spaghetti code into modular, readable, decoupled classes or functions adhering to SOLID and DRY.',
    },
    directiveExplanation: {
      ckb: 'ئەم پرۆمپتە ئەرکی ئەوەیە کلاسی گەورە و فەنکشنی ٢٠٠ دێڕی دابەشبکات بۆ فەنکشنی بچووکی تاک-ئەرک (Single Responsibility Principle) و دووبارەبوونەوەکان نەهێڵێت.',
      en: 'Deconstructs god-objects and giant functions into decoupled units, eliminating duplicated logic and simplifying future testability.',
    },
    whenToUse: {
      ckb: 'کاتێک پڕۆژەکەت زۆر گەورە بووە و ترست هەیە دەستکاری هەر دێڕێک بکەیت شتێکی تر تێکبچێت.',
      en: 'Use when technical debt becomes paralyzing and codebase modifications risk breaking adjacent features.',
    },
    promptTemplate: `[DIRECTIVE: REFACTOR TO CLEAN CODE & SOLID]
ئەم کۆدە دووبارە بنووسەرەوە بە ڕەچاوکردنی ئەم یاسایانە:
١. بنەمای بەرپرسیاریەتی تاک (Single Responsibility): هەر فەنکشنێک تەنها یەک کاری دیاریکراو بکات.
٢. نەهێشتنی دووبارەبوونەوە (Don't Repeat Yourself - DRY).
٣. پێناسەکردنی تایپی تەواو لە TypeScript / Typed Python بۆ گەرەنتی سەلامەتی داتا.
٤. کەمکردنەوەی کات و میمۆری لە سووڕەکاندا.

کۆدە کۆنەکە:
[کۆدە کۆنەکەت لێرە دابنێ]`,
    exampleSnippet: `REFACTOR TO SOLID: ئەم کۆدە لێشاوی داواکاری کڕین لە فرۆشگادا بەڕێوەدەبات بەڵام هەمووی لە یەک فەنکشنی گەورەدایە؛ بیبەشە بە فەنکشنی جیا بۆ پارەدان، هەڵگرتنی بنکەدراوە، و ناردنی ئیمەیڵ.`,
    impactScore: 94,
    tags: ['#CleanCode', '#SOLID', '#Refactoring', '#Architecture'],
  },

  // 10. REVERSE PROMPT ENGINEER
  {
    id: 'reverse-prompt',
    name: 'REVERSE PROMPT ENGINEER (ئەندازیاری پێچەوانەی پرۆمپت)',
    category: 'productivity',
    badge: 'دروستکەری پرۆمپت 🔮',
    shortDesc: {
      ckb: 'تۆ ئەنجامە کۆتاییەکەی دەتەوێت دەدەیتە چاتبۆت، ئەویش پرۆمپتێکی ئەندازیاری نموونەییت بۆ دادەڕێژێت تا هەمان ئەنجامت دەستبکەوێت.',
      en: 'Give the AI your desired finished artifact, and it Reverse-Engineers the optimal system prompt to reproduce it reliably.',
    },
    directiveExplanation: {
      ckb: 'زۆرجار کۆد یان سیستەمێک لە وێبسایتێک دەبینیت بەڵام نازانی چۆن بە AI بڵێیت هاوشێوەی ئەوەت بۆ دروستبکات. ئەم پرۆمپتە شیکاری بۆ بەرهەمەکە دەکات و پرۆمپتێکی تەواو ستانداردت بۆ دەنووسێت.',
      en: 'Analyzes a target output format, constraints, and tonal structure to construct repeatable, robust system prompts.',
    },
    whenToUse: {
      ckb: 'کاتێک دەتەوێت پرۆمپتێک دروستبکەیت کە بۆ چەندین جار یان لەناو ئەپەکەتدا بەکاریبهێنیتەوە.',
      en: 'Use when designing prompts for automated API pipelines, agent tool definitions, or consistent batch tasks.',
    },
    promptTemplate: `[DIRECTIVE: REVERSE PROMPT ENGINEER]
تۆ شارەزای باڵای ئەندازیاری پرۆمپت (Prompt Engineering)یت.
من ئەم بەرهەمە کۆتاییەم دەوێت:
[دەق، کۆد، یان دەرئەنجامە دڵخوازەکەت لێرە دابنێ]

تکایە:
١. باشترین و تۆکمەترین پرۆمپت (Prompt)م بۆ بنووسە کە بتوانم لە Claude یان ChatGPT بەکاریبهێنم بۆ بەدەستهێنانی ئەم ئەنجامە.
٢. سیستەم پرۆمپت و ڕێنماییە پێویستەکان بە خاڵ ڕێکبخە.`,
    exampleSnippet: `REVERSE PROMPT: دەمەوێت فۆرمێکی لۆگینی ڕیاکت دروستبکەم بە ئەنیمەیشنی سەرنجڕاکێش و پشتگیری فرە-زمان، باشترین پرۆمپت بۆ ئەم داواکارییە چییە؟`,
    impactScore: 91,
    tags: ['#ReverseEngineering', '#PromptCraft', '#Automation', '#SystemPrompts'],
  },

  // 11. DEVIL'S ADVOCATE & RED TEAMING
  {
    id: 'devils-advocate',
    name: 'DEVIL’S ADVOCATE & RED TEAMING (تاقیکردنەوەی هێرش و شکست)',
    category: 'security',
    badge: 'ئەمنییەت و پاراستن 🛡️',
    shortDesc: {
      ckb: 'مۆدێلەکە ڕۆڵی هاککەر یان تێکدەری سیستەم دەگێڕێت تا هەموو ڕێگاکانی هاککردن و شکانی پرۆگرامەکەت ئاشکرا بکات.',
      en: 'Adopts an aggressive adversarial mindset to discover how attackers can break, exploit, or bypass your software.',
    },
    directiveExplanation: {
      ckb: 'پێش ئەوەی بەکارهێنەری خراپەکاری ئینتەرنێت پڕۆژەکەت تێکبدات، ئەم پرۆمپتە هەموو کەلێنەکانی وەک دەستکاریکردنی نرخ، زۆر ناردنی داواکاری (DDoS/Spam)، شکاندنی داتابەیس و دزینی زانیاری دەخاتە ڕوو.',
      en: 'Simulates active black-hat penetration testing against authentication boundaries, rate-limits, injection surfaces, and payment logic.',
    },
    whenToUse: {
      ckb: 'پێش خستنەکاری سیستەمی پارەدان، لۆگین، یان ئەو ئەپانەی داتای هەستیاری خەڵکیان لایە.',
      en: 'Mandatory review step for financial transactions, auth workflows, and public API endpoints.',
    },
    promptTemplate: `[DIRECTIVE: DEVIL'S ADVOCATE & RED TEAM]
تۆ لەم ساتەوە تێکدەر و هاککەرێکی بەتوانایت (Adversarial Security Analyst).
ئەم تەلارسازییە یان کۆدە پبشکنە و پێم بڵێ:
١. چۆن دەتوانیت لە ڕێگەی دەستکاریکردنی پارامیتەرەکانەوە ئەم سیستەمە بخەیت یان فێڵی لێبکەیت؟
٢. لە چ خاڵێکدا ئەگەری شکانی داتابەیس یان سێرڤەر هەیە کاتێک ١٠ هەزار داواکاری پێکەوە بێن؟
٣. کۆدی پارێزەری پێویست دابنێ بۆ داخستنی ئەم کەلێنانە.

کۆد یان سیستەمەکەم:
[کۆد یان بیرۆکەکەت دابنێ]`,
    exampleSnippet: `DEVIL'S ADVOCATE: من ئەم APIیە بەکاردەهێنم بۆ نوێکردنەوەی باڵانسی بەکارهێنەر لەگەڵ ZainCash و FIB، چۆن هاککەر دەتوانێت سوود لە Race Condition وەربگرێت بۆ زیادکردنی باڵانس؟`,
    impactScore: 97,
    tags: ['#RedTeam', '#Security', '#PenTesting', '#FinancialSafety'],
  },

  // 12. ANALOGY MASTER
  {
    id: 'analogy-master',
    name: 'ANALOGY MASTER (مامۆستای لێکچواندن)',
    category: 'learning',
    badge: 'فێربوونی شێوەیی 🧩',
    shortDesc: {
      ckb: 'شیکردنەوەی تەکنەلۆژیای زۆر ئاڵۆز بە بەستنەوەیان بە ژیانی ڕۆژانە وەک چێشتخانە، بانک، ئۆتۆمبێل و شارسازی.',
      en: 'Bridges deep abstract architecture to tangible physical mechanisms through relatable real-world metaphors.',
    },
    directiveExplanation: {
      ckb: 'مێشکی مرۆڤ کاتێک لێکچواندن دەبینێت هەزار هێندە خێراتر فێردەبێت. ئەم پرۆمپتە سیستەمی ئاڵۆزی وەک Kafka دەکاتە سیستەمی پۆستەخانە، یان Load Balancer دەکاتە بەڕێوەبەری سەرەی فڕۆکەخانە.',
      en: 'Activates spatial and associative memory pathways by mapping distributed software topologies to everyday physical institutions.',
    },
    whenToUse: {
      ckb: 'کاتێک دەتەوێت تەکنەلۆژیایەکی نوێ بۆ کڕیار، قوتابی، یان ئەندازیارانی تیمی پڕۆژەکەت شیبکەیتەوە.',
      en: 'Use when onboarding junior developers or explaining technical trade-offs to non-technical stakeholders.',
    },
    promptTemplate: `[DIRECTIVE: ANALOGY MASTER]
تکایە ئەم تەکنەلۆژیا یان ئەلگۆریزمەم بۆ شیبکەرەوە بە بەکارهێنانی نموونەی بەهێزی لێکچواندن لە ژیانی واقیعی:
١. ئەکتەرەکان و ڕۆڵەکانیان (کێ کێیە لەم شارە یان کارگەیەدا؟).
٢. زانیارییەکان چۆن دەڕۆن و لە کوێ دەمێننەوە؟
٣. لە کاتی کێشەدا لە ژیانی واقیعی چ ڕوودەدات و لە پڕۆگرامینگ چۆن چارەسەر دەکرێت؟

تەکنەلۆژیاکە:
[ناوی تەکنەلۆژیا یان ئەلگۆریزمەکە بنووسە]`,
    exampleSnippet: `ANALOGY MASTER: سیستەمی WebSockets و جیاوازی لەگەڵ HTTP REST API چۆنە؟ وەک پەیوەندی تەلەفۆنی لە بەرامبەر نامەی پۆستەچی لێکی بدەرەوە.`,
    impactScore: 90,
    tags: ['#Analogy', '#Teaching', '#MentalModels', '#Communication'],
  },

  // 13. ALGORITHM OPTIMIZER (BIG-O)
  {
    id: 'algo-optimizer',
    name: 'BIG-O OPTIMIZER (ڕێکخەری خێرایی و میمۆری)',
    category: 'refactoring',
    badge: 'خێرایی بێوێنە ⚡',
    shortDesc: {
      ckb: 'شیکردنەوەی ئاڵۆزی کات O(N) و میمۆری لە ئەلگۆریزمەکاندا و کەمکردنەوەیان لە O(N²) بۆ O(N log N) یان O(1).',
      en: 'Analyzes Big-O time and space complexity, eliminating nested loops and heavy heap allocations.',
    },
    directiveExplanation: {
      ckb: 'زۆرجار کۆد لەسەر ١٠ بەکارهێنەر کاردەکات بەڵام لەسەر ١٠ هەزار بەکارهێنەر سیستەمەکە قفڵ دەبێت چونکە سووڕی ناو سووڕ (Nested Loop O(N²))ی تێدایە. ئەم پرۆمپتە داتابەیس و مێشک دەگۆڕێت بۆ HashMaps یان Binary Search.',
      en: 'Pinpoints computational bottlenecks, replacing polynomial time complexity with linear or logarithmic algorithms via HashMaps, sets, and sliding windows.',
    },
    whenToUse: {
      ckb: 'لە کاتی کێشەی خاوبوونەوەی وێبسایت، کارکردن لەگەڵ داتای گەورە (Big Data)، یان تاقیکردنەوەکانی LeetCode.',
      en: 'Use when endpoints lag under heavy data arrays or to pass strict time-limit benchmarks.',
    },
    promptTemplate: `[DIRECTIVE: BIG-O ALGORITHM OPTIMIZER]
ئەم کۆدە شیبکەرەوە لە ڕووی ئاڵۆزی کات (Time Complexity) و شوێن (Space Complexity):
١. ئێستا Big-O چەندە؟
٢. گەورەترین هۆکاری خاوبوونەوەی چییە؟
٣. چۆن بە بەکارهێنانی HashMap, Set, یان ئەلگۆریزمی خێراتر بیکەینە O(N) یان O(log N)؟
٤. کۆدی کەمکراوە و بەراوردی خێرایی پێشکەش بکە.

کۆدەکەم:
[کۆدەکە دابنێ]`,
    exampleSnippet: `BIG-O OPTIMIZER: ئەم فەنکشنە گەڕان بەناو دوو لیستی گەورەی ٢٠٠ هەزار کەسی دەکات بە دوو لووپ (O(N²))، چۆن بیکەمە O(N)؟`,
    impactScore: 96,
    tags: ['#BigO', '#Performance', '#Optimization', '#DataStructures'],
  },

  // 14. SQL & QUERY WIZARD
  {
    id: 'sql-wizard',
    name: 'SQL & QUERY WIZARD (شارەزای بنکەدراوە)',
    category: 'architecture',
    badge: 'پارێزەری داتابەیس 🗄️',
    shortDesc: {
      ckb: 'نووسین و پشکنینی کوێرییەکانی SQL بۆ خێراترین کاتی وەڵامدانەوە، نەهێشتنی N+1 Query و دروستکردنی ئیندێکسی پێویست.',
      en: 'Diagnoses slow database queries, designs composite indexes, and eliminates the dreaded N+1 problem.',
    },
    directiveExplanation: {
      ckb: 'زۆربەی کات خاوبوونەوەی ئەپڵیکەیشن بەهۆی کۆدی فرۆنتێند نییە، بەڵکو بەهۆی کوێرییەکی هەڵەی داتابەیسە کە هەموو ڕیزەکان سکان دەکات. ئەم پرۆمپتە نەخشەی خشتەکان شی دەکاتەوە و ئیندێکسی دروست دیاری دەکات.',
      en: 'Leverages EXPLAIN ANALYZE execution plan logic to eliminate full table scans, structuring foreign keys and joins with minimal lock overhead.',
    },
    whenToUse: {
      ckb: 'کاتێک پڕۆژەکەت بە PostgreSQL, MySQL, SQLite, یان Supabase کاردەکات و دەتەوێت وەڵامەکان لە ژێر 10ms بگەڕێنەوە.',
      en: 'Essential when scaling relational databases beyond thousands of concurrent queries.',
    },
    promptTemplate: `[DIRECTIVE: SQL & QUERY WIZARD]
وەک پسپۆڕێکی داتابەیس (Database Administrator / Lead DBA) ئەم داواکارییە وەربگرە:
١. باشترین کوێری SQL بەپێی ستانداردی مۆدێرن بنووسە.
٢. کام ئیندێکس (Index / Composite Index) پێویستە دروستبکرێت تا خێراییەکەی بۆ کەمتر لە 10ms دابەزێت؟
٣. چۆن ڕێگری لە کێشەی باوی N+1 Query لە ناو ORM (Prisma / TypeORM / Drizzle) بکەین؟

داواکاری داتابەیسەکە:
[کێشە یان شێوازی خشتەکانت بنووسە]`,
    exampleSnippet: `SQL WIZARD: من خشتەی خاوەنکار و پڕۆژە و پارەدانم هەیە، چۆن کوێرییەک بنووسم کە تێکڕای داهاتی مانگانەی هەر پڕۆژەیەک بەبێ سستکردنی داتابەیس بپشکنێت؟`,
    impactScore: 95,
    tags: ['#SQL', '#Postgres', '#DatabaseOptimization', '#Indexes'],
  },

  // 15. TEST-DRIVEN DEVELOPMENT (TDD FIRST)
  {
    id: 'tdd-first',
    name: 'TDD FIRST (سەرەتا نووسینی تاقیکردنەوە)',
    category: 'debugging',
    badge: 'بێ هەڵە لە سەرەتاوە 🧪',
    shortDesc: {
      ckb: 'پەیڕەوکردنی سیستەمی فەرمی TDD: سەرەتا نووسینی تێستی شکستخواردوو (Red)، پاشان کۆدی سەرکەوتوو (Green)، پاشان ڕێکخستنەوە (Refactor).',
      en: 'Automates strict Test-Driven Development: generates failing test specifications before writing production code.',
    },
    directiveExplanation: {
      ckb: 'ئەندازیارە دەگمەنەکان سەرەتا تێست دەنووسن پاشان کۆد. ئەم پرۆمپتە بە تەواوی ڕێگری دەکات لەوەی کۆدی ناتاقیکراوە بنووسیت و گەرەنتی دەکات لە داهاتوودا هیچ بەشێک تێکناچێت.',
      en: 'Guarantees 100% specification compliance by locking behavior into test assertions prior to writing implementation logic.',
    },
    whenToUse: {
      ckb: 'لە کاتی نووسینی فەنکشنی هەستیاری وەک پارەدان، شیکارکردنی پاسۆرد، بەروارەکان، یان لۆجیکی قورسی لێکدانەوە.',
      en: 'Crucial for financial logic, authentication rules, and core mathematical utilities.',
    },
    promptTemplate: `[DIRECTIVE: TEST-DRIVEN DEVELOPMENT (TDD)]
ئێمە بە شێوازی فەرمی TDD (Red-Green-Refactor) کاردەکەین:
هەنگاو ١: سەرەتا تاقیکردنەوەی تێستەکان (Unit Tests بە Jest یان PyTest) بنووسە کە هەموو حاڵەتەکان و حاڵەتە دەگمەنەکان دەگرێتەوە.
هەنگاو ٢: دوای تێستەکان، کەمترین و پاکترین دێڕی کۆدی فەنکشنەکە بنووسە کە هەموو تێستەکان بە سەوز دەربچوێنێت.
هەنگاو ٣: ڕوونکردنەوە بدە کە چۆن تێستەکان دڵنیایی لە کارکردنی دەدەن.

فەنکشنەکە:
[فەنکشنەکە و داواکارییەکەی بنووسە]`,
    exampleSnippet: `TDD FIRST: دەمەوێت فەنکشنێک بۆ پشکنینی تەندروستی کۆدی نهێنی (Password Validator) بنووسم؛ سەرەتا تێستەکان بە Jest بنووسە پاشان کۆدی فەنکشنەکە.`,
    impactScore: 93,
    tags: ['#TDD', '#UnitTests', '#Jest', '#PyTest', '#RobustCode'],
  },

  // 16. API CONTRACT DESIGNER
  {
    id: 'api-contract',
    name: 'API CONTRACT DESIGNER (داڕێژەری پەیماننامەی ڕاژەکار)',
    category: 'architecture',
    badge: 'پەیوەندی پاک لە نێوان تیم 🤝',
    shortDesc: {
      ckb: 'دیزاینکردنی ڕێکەوتنی JSON و ستانداردەکانی REST/GraphQL پێش ئەوەی بکئێند یان فرۆنتێند یەک دێڕ کۆد بنووسن.',
      en: 'Formalizes deterministic JSON request/response schemas and status codes before frontend or backend teams start coding.',
    },
    directiveExplanation: {
      ckb: 'زۆرجار کاتێک ئەپڵیکەیشن دروست دەکرێت، فڕۆنتێند و باکئێند تووشی کێشە دەبن چونکە ناوی کلیلەکان لەیەک ناچن. ئەم پرۆمپتە گرێبەستێکی بێ کەموکوڕی JSON و هەڵەکان (Errors) دادەڕێژێت تا هەردووکیان بە هاوتەریبی کاربکەن.',
      en: 'Prevents interface friction between frontend and backend engineers by locking OpenAPI/TypeScript schemas early.',
    },
    whenToUse: {
      ckb: 'لە سەرەتای دەستپێکردنی هەر تایبەتمەندییەکی نوێ کە فڕۆنتێند پێویستی بە داتای سێرڤەر هەیە.',
      en: 'Use before initiating feature development across distributed engineering teams.',
    },
    promptTemplate: `[DIRECTIVE: API CONTRACT DESIGNER]
تکایە پەیماننامەی فەرمی (API Contract) بۆ ئەم تایبەتمەندییە دابڕێژە:
١. ناونیشانی endpoint (وەک POST /api/v1/orders).
٢. شێوەی داواکاری هاتوو (Request Body بە فۆرماتی ڕوونی JSON لەگەڵ تایپەکان).
٣. شێوەی وەڵامدانەوەی سەرکەوتوو (Success Response 200/201).
٤. هەموو حاڵەتەکانی هەڵە (Errors بە کۆدەکانی 400, 401, 403, 404, 500 بە پەیامی ڕوون).
٥. فایلی تایپی هاوبەشی TypeScript بۆ فڕۆنتێند و باکئێند.

تایبەتمەندییەکە:
[تایبەتمەندییەکە ڕوونبکەرەوە]`,
    exampleSnippet: `API CONTRACT: دەمانەوێت سیستەمی نوێکردنەوەی پڕۆفایلی بەکارهێنەر دروستبکەین کە وێنەی ئاڤاتار و ناوی تەواو و زمانی هەڵبژێردراو وەردەگرێت. گرێبەستی تەواوی API دابنێ.`,
    impactScore: 92,
    tags: ['#APIContract', '#RESTful', '#JSONSchema', '#TypeScriptTypes'],
  },

  // 17. TERMINAL CRASH AUTOPSY
  {
    id: 'crash-autopsy',
    name: 'TERMINAL CRASH AUTOPSY (شیکاری هەڵەی کەوتن)',
    category: 'debugging',
    badge: 'چارەسەری هەڵەی تێرمیناڵ 🚨',
    shortDesc: {
      ckb: 'پێدانی تەواوی هەڵەی سووری تێرمیناڵ (Stack Trace) و دەستنیشانکردنی دەستبەجێی فەرمانی پێویست بۆ چارەسەر.',
      en: 'Performs immediate root-cause diagnosis of catastrophic stack traces, build failures, and runtime panics.',
    },
    directiveExplanation: {
      ckb: 'کاتێک لاگێکی سوور لە تێرمیناڵدا دەردەکەوێت کە ٥٠ دێڕە، پرۆگرامەر سەرلێشێواو دەبێت. ئەم پرۆمپتە ڕاستەوخۆ دەڵێت: "کێشەکە لە دێڕی ٢٣ی فایلی Xە و هۆکارەکەی نەبوونی پاکێجی Yە؛ ئەم فەرمانە لێبدە بۆ چاککردنەوە".',
      en: 'Filters out noisy runtime boilerplate to isolate the exact line number, missing environment variable, or dependency collision responsible for the failure.',
    },
    whenToUse: {
      ckb: 'کاتێک سێرڤەر ناکەوێتە کار، کاتی بنیاتنان (Build Error)، یان هەڵەی نەناسراوی Docker و Node.js.',
      en: 'Deploy during emergency build breaks, fatal server panics, or cryptic compiler exceptions.',
    },
    promptTemplate: `[DIRECTIVE: TERMINAL CRASH AUTOPSY]
ئەم لاگی هەڵەیەی تێرمیناڵ بە وردی بخوێنەرەوە:
١. بە کورتی بە کوردی پێم بڵێ ڕەگی کێشەکە چییە (The Root Cause)؟
٢. کام فایل و کام دێڕ بەرپرسە لەم کێشەیە؟
٣. ئەو فەرمانەی تێرمیناڵ یان دەستکارییەی پێویستە بۆ چاککردنەوەی بە هەنگاوی ١، ٢، ٣ بنووسە.

دەقی هەڵەکە (Error Log / Stack Trace):
[تەواوی لاگەکە لێرە کۆپی بکە]`,
    exampleSnippet: `TERMINAL CRASH: Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'lucide-react' imported from /apps/web/TopBar.tsx. چۆن چارەسەری بکەم؟`,
    impactScore: 98,
    tags: ['#CrashAutopsy', '#Debugging', '#TerminalErrors', '#Stacktrace'],
  },

  // 18. SYSTEM ARCHITECT (SCALABILITY)
  {
    id: 'system-architect',
    name: 'SYSTEM ARCHITECT (تەلارسازی بۆ ١ ملیۆن بەکارهێنەر)',
    category: 'architecture',
    badge: 'تەلارسازی بەهێز 🏛️',
    shortDesc: {
      ckb: 'دیزاینکردنی سیستەم و داتابەیس بۆ ئەوەی بەبێ خاوبوونەوە و کەوتن بەرگەی زیاتر لە ١ ملیۆن بەکارهێنەر بگرێت.',
      en: 'Designs scalable, fault-tolerant enterprise system topologies ready to handle millions of concurrent users.',
    },
    directiveExplanation: {
      ckb: 'ئەم پرۆمپتە مۆدێلەکە دەباتە سەر ئاستی ئەندازیارێکی باڵای سیستەم (System Architect) بۆ هەڵبژاردنی نێوان Monolith vs Microservices، دانانی Caching (Redis)، دابەشکردنی بنکەدراوە و Load Balancers.',
      en: 'Forces high-level architectural trade-off evaluations: horizontal vs vertical scaling, synchronous vs event-driven queues, and caching topologies.',
    },
    whenToUse: {
      ckb: 'لە سەرەتای داڕشتنی بیرۆکەی پڕۆژەیەکی گەورە یان کاتێک ئەپەکەت بە خێرایی لە گەشەسەندندایە.',
      en: 'Use during initial system design phases or when redesigning applications suffering from scaling bottlenecks.',
    },
    promptTemplate: `[DIRECTIVE: SYSTEM ARCHITECT - 1M USERS]
وەک ئەندازیاری سەرەکی تەلارسازی (Principal System Architect) کاربکە:
ئێمە سیستەمێک بنیات دەنێین کە پێشبینی دەکرێت لە ماوەی کورتدا بۆ زیاتر لە ١ ملیۆن بەکارهێنەر بەرزبێتەوە.
تکایە:
١. پێشنیاری دیزاینی تەلارسازی گشتی بکە (Microservices یان Modular Monolith؟).
٢. پلانی داتابەیس و چۆنیەتی ڕێکخستنی Caching (وەک Redis / CDN).
٣. چۆن بەکارهێنەر لە کەوتنی سیستەم بپارێزین لە کاتی قەرەباڵغی لەناکاو (Rate Limiting & Queues)؟
٤. دیزاینەکەم بە هێڵکارییەکی ڕوونی دەقی نیشان بدە.

سیستەمەکە:
[پڕۆژەکەت لێرە بناسێنە]`,
    exampleSnippet: `SYSTEM ARCHITECT: دەمانەوێت پلاتفۆرمێکی پەخشی زیندوی ڤیدیۆیی و چاتی ڕاستەوخۆ بۆ پێشبڕکێکانی کوردستان دروستبکەین کە لە کاتی یارییەکاندا سەدان هەزار کەس سەردانی دەکەن. تەلارسازی سیستەمەکە چۆن بێت؟`,
    impactScore: 96,
    tags: ['#SystemDesign', '#Scalability', '#Microservices', '#EnterpriseArch'],
  },

  // 19. MENTAL MODEL MAPPING
  {
    id: 'mental-model',
    name: 'MENTAL MODEL MAPPING (نەخشەی مۆدێلی زەینی)',
    category: 'learning',
    badge: 'مامۆستای گۆڕانی بیرکردنەوە 🧠',
    shortDesc: {
      ckb: 'کاتێک لە زمانێکەوە دەچیتە زمانێکی تر (وەک JS بۆ Rust یان Python بۆ C++)، چۆن مێشکت گۆڕانکاری لە تێگەیشتندا بکات؟',
      en: 'Maps the cognitive paradigm shift required when transitioning between fundamentally different languages or paradigms.',
    },
    directiveExplanation: {
      ckb: 'پرۆگرامەر کاتێک لە پایتۆنەوە دەچێتە سەر ڕەست (Rust)، ئەگەر وەک پایتۆن بیربکاتەوە تووشی سەرئێشە دەبێت بەهۆی Borrow Checker. ئەم پرۆمپتە شێوازی بیرکردنەوەی زمانە نوێیەکە لە مێشکدا دادەڕێژێت.',
      en: 'Helps engineers rewire their problem-solving patterns when switching paradigms (e.g. OOP to Functional, Garbage-collected to Manual Memory).',
    },
    whenToUse: {
      ckb: 'کاتێک زمانێکی نوێ فێردەبیت کە فەلسەفەی جیاوازە لەو زمانەی پێشتر فێری بوویت.',
      en: 'Essential when learning a language with an unfamiliar paradigm like Rust, Haskell, Go, or C++.',
    },
    promptTemplate: `[DIRECTIVE: MENTAL MODEL MAPPING]
من لە زمانی [زمانی کۆن، وەک JavaScript]ەوە دێم و ئێستا خەریکی فێربوونی [زمانی نوێ، وەک Rust / C++]م.
تکایە:
١. مەهێڵە بە عەقڵیەتی کۆنم بیربکەمەوە؛ گەورەترین ٣ هەڵەی کە خەڵکی زمانی کۆنم دەیکەن لەم زمانە نوێیەدا چییە؟
٢. فەلسەفە و مۆدێلی زەینی ئەم زمانە نوێیە بە کورتی چۆن کاردەکات؟
٣. بەراوردێکی کۆدی لەیەکچوو لە نێوان هەردووکیاندا پیشان بدە کە تێگەیشتنەکە بچەسپێنێت.`,
    exampleSnippet: `MENTAL MODEL: من ٤ ساڵە پایتۆن دەنووسم، ئێستا دەمەوێت فێری Rust ببم. چۆن لە چەمکی Ownership و Lifetimes تێبگەم بێ ئەوەی وەک پایتۆن سەیری بکەم؟`,
    impactScore: 91,
    tags: ['#MentalModel', '#LanguageTransition', '#Rust', '#Python', '#Mindset'],
  },

  // 20. DOCUMENTATION & README PRO
  {
    id: 'readme-pro',
    name: 'README & DOCS PRO (دروستکەری ڕیدمی نایاب)',
    category: 'productivity',
    badge: 'ڕووکاری سەرنجڕاکێشی پڕۆژە 📄',
    shortDesc: {
      ckb: 'دروستکردنی فایلی فەرمی README.mdی پڕۆژە بە باجی گیت‌هەب، ڕێنمایی دانان، نموونەی بەکارهێنان و مۆڵەت.',
      en: 'Generates professional, open-source standard README.md documentation complete with badges, architecture maps, and CLI guides.',
    },
    directiveExplanation: {
      ckb: 'زۆربەی پڕۆژە نایابەکان کەس بەکاریان ناهێنێت تەنها لەبەر ئەوەی فایلی README یان دۆکیومێنتی ناشرین و ناڕوونیان هەیە. ئەم پرۆمپتە لەسەر ستانداردی پڕۆژە پێشەنگەکانی گیت‌هەب پەڕەیەکی سەرنجڕاکێشت بۆ دادەنێت.',
      en: 'Ensures repositories look enterprise-grade with structured getting-started guides, architecture overviews, environment variables tables, and contribution guidelines.',
    },
    whenToUse: {
      ckb: 'کاتێک پڕۆژەکەت تەواو کردووە و دەتەوێت لەسەر GitHub یان بۆ کڕیار بڵاویبکەیتەوە.',
      en: 'Use whenever open-sourcing a repository or preparing project deliverables for clients.',
    },
    promptTemplate: `[DIRECTIVE: README & DOCS PRO]
تکایە فایلی فەرمی README.mdی تەواو و پرۆفیشناڵ بۆ پڕۆژەکەم دروستبکە کە ئەم بەشانە لەخۆبگرێت:
١. ناونیشان و لۆگۆ بە کورتی لەگەڵ باجە فەرمییەکان (Badges بۆ Build, License, Version).
٢. ناساندنی کورت و کێشەی چارەسەرکراو.
٣. وێنەی ڕووکار یان هێڵکاری سەرەکی.
٤. ڕێنمایی هەنگاو بە هەنگاوی دانان (Prerequisites & Installation Steps).
٥. نموونەی فەرمانی تێرمیناڵ و گۆڕاوەکانی ژینگە (.env.example).
٦. مافەکانی کۆپی‌ڕایت (License) و ناوی دروستکەر: CREATOR: AZHAN HAMMZA.

پڕۆژەکەم ئەمەیە:
[زانیاری پڕۆژەکەت بنووسە]`,
    exampleSnippet: `README PRO: پلاتفۆرمی کاڕێژان (KARÊJAN) پلاتفۆرمێکی نیشتمانییە بۆ فێربوونی پرۆگرامینگ بە زمانی کوردی، فایلی README.md بۆ گیت‌هەب دابنێ.`,
    impactScore: 94,
    tags: ['#README', '#Documentation', '#GitHub', '#OpenSourceGuide'],
  },

  // 21. FEW-SHOT PATTERN BUILDER
  {
    id: 'few-shot-builder',
    name: 'FEW-SHOT PATTERN BUILDER (فێرکردن بە نموونەی کرداری)',
    category: 'reasoning',
    badge: 'ئەنجامی ١٠٠٪ تەواو 🎯',
    shortDesc: {
      ckb: 'فەرمانێک کە بە پێدانی ٢ بۆ ٣ نموونەی پێشوەختە مۆدێلەکە دەهێنێتە سەر هەمان ستایل، تۆن، و پێکهاتەی دەرچوونی دڵخواز.',
      en: 'Injects few-shot exemplar patterns to constrain output variance, forcing the model to match precise formatting guidelines.',
    },
    directiveExplanation: {
      ckb: 'بەپێی زانستی پرۆمپتینگ، "Few-Shot" بەهێزترین ڕێگەیە بۆ ئەوەی چاتبۆتەکە بە تەواوی لە ستایلی دەرچوونی کۆد یان دەق تێبگات بەبێ ئەوەی فۆرماتەکە تێکبدات.',
      en: 'Few-shot demonstration primes the model’s latent representations, ensuring zero deviations from custom domain schemas.',
    },
    whenToUse: {
      ckb: 'کاتێک دەتەوێت دەیان داتا یان فایل بە هەمان فۆرماتی تایبەت وەربگریتەوە (وەک گۆڕینی فایلی CSV بۆ JSON).',
      en: 'Use for batch data transforms, syntax translation, or strict structural outputs.',
    },
    promptTemplate: `[DIRECTIVE: FEW-SHOT PATTERN BUILDER]
تکایە بەپێی ئەم شێواز و ڕێچکەیەی خوارەوە بە تەواوی وەڵام بدەرەوە و هیچ گۆڕانکارییەک لە ستایلەکەدا مەکە:

نموونەی ١:
داواکاری: [داواکاری نموونەی یەکەم]
وەڵام: [وەڵامی نموونەی یەکەم]

نموونەی ٢:
داواکاری: [داواکاری نموونەی دووەم]
وەڵام: [وەڵامی نموونەی دووەم]

ئێستا ئەمە بۆ من بە هەمان شێوازی سەرەوە جێبەجێ بکە:
داواکاری نوێ:
[داواکارییە ڕاستەقینەکەت لێرە دابنێ]`,
    exampleSnippet: `FEW-SHOT: گۆڕینی هەڵەکانی بنکەدراوە بۆ پەیامی کوردی دۆستانە بۆ بەکارهێنەر لەگەڵ کۆدی هەڵە، بەپێی ئەو دوو نموونەیەی پێم دایت.`,
    impactScore: 93,
    tags: ['#FewShot', '#ConsistentFormat', '#DataParsing', '#PromptEngineering'],
  },

  // 22. GIT COMMIT & PR SYNTHESIS
  {
    id: 'git-commit-pro',
    name: 'CONVENTIONAL GIT COMMIT & PR (پەیامی کۆمیتی ستاندارد)',
    category: 'productivity',
    badge: 'ڕێکخستنی مێژووی گیت 🌿',
    shortDesc: {
      ckb: 'گۆڕینی هەموو گۆڕانکارییە ناڕێکەکان بۆ پەیامی ستانداردی Conventional Commits (feat:, fix:, refactor:) لەگەڵ کورتەی PR.',
      en: 'Translates raw git diffs into semantic conventional commits and detailed Pull Request release notes.',
    },
    directiveExplanation: {
      ckb: 'پرۆگرامەرانی سەرکەوتوو پەیامی کورت و بێمانای وەک "update" یان "fix bug" ناکەنە کۆمیت. ئەم پرۆمپتە شیکاری بۆ گۆڕانکارییەکە دەکات و کۆمیتێکی ستانداردی ئەندازیاری دروست دەکات.',
      en: 'Adheres strictly to the Conventional Commits specification, improving automated changelog generation and CI/CD semantic versioning.',
    },
    whenToUse: {
      ckb: 'پێش ناردنی گۆڕانکاری بۆ ناو ڕیپۆزیتۆری گیت‌هەب یان دروستکردنی Pull Request.',
      en: 'Use prior to git commit and git push to preserve clean, auditable repository histories.',
    },
    promptTemplate: `[DIRECTIVE: CONVENTIONAL GIT COMMIT & PR]
تکایە ئەم گۆڕانکارییانە (Git Diff) شیبکەرەوە و:
١. پەیامی کۆمیت بە ستانداردی فەرمی (Conventional Commits: feat, fix, refactor, chore, docs, test) بنووسە.
٢. دەقی کورتی سەردێڕ لە ژێر ٥٠ پیت بێت.
٣. لە بەشی لەشدا (Body) بە کورتی بە خاڵ باسی کێشەی چارەسەرکراو و کلیلە گۆڕانکارییەکان بکە.
٤. ئەگەر شیاوە، وەسفێکی کورتی Pull Requestیش ئامادە بکە.

گۆڕانکارییەکانی کۆد (Git Diff یان پوختەی کارەکەت):
[لێرە دابنێ]`,
    exampleSnippet: `GIT COMMIT: فایلی ئاسایشی پاسۆردم نوێکردەوە و ڕێگریم کرد لە لۆگینی دووبارە بەبێ نوێکردنەوەی تۆکن. پەیامی کۆمیتی ستاندارد دابنێ.`,
    impactScore: 92,
    tags: ['#GitCommit', '#ConventionalCommits', '#PullRequest', '#Workflow'],
  },
];

export const GOLDEN_PROMPTS: GoldenPrompt[] = RAW_GOLDEN_PROMPTS.map((item) => {
  const extra = PROMPTS_I18N[item.id];
  if (!extra) return item;
  return {
    ...item,
    names: extra.names,
    badges: extra.badges,
    shortDesc: { ...item.shortDesc, ...extra.shortDesc },
    directiveExplanation: { ...item.directiveExplanation, ...extra.directiveExplanation },
    whenToUse: { ...item.whenToUse, ...extra.whenToUse },
    promptTemplates: {
      ckb: item.promptTemplate,
      ...extra.promptTemplates,
    },
    exampleSnippets: {
      ckb: item.exampleSnippet,
      ...extra.exampleSnippets,
    },
  };
});
