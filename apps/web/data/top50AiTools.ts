import type { Locale } from '../types/domain';
import { TOP_50_TOOLS_I18N } from './top50AiToolsI18n';

export type AiToolGroup =
  | 'coding-ide'
  | 'autonomous-agents'
  | 'chat-reasoning'
  | 'frontend-ui'
  | 'terminal-cli'
  | 'local-models'
  | 'review-testing'
  | 'frameworks'
  | 'docs-search';

export type AiPricing = 'free' | 'freemium' | 'paid' | 'open_source';

export interface TopAiTool {
  id: string;
  name: string;
  rank: number;
  group: AiToolGroup;
  pricing: AiPricing;
  officialUrl: string;
  githubUrl?: string;
  badge?: string;
  badges?: Record<Locale, string>;
  tagline: {
    ckb: string;
    en: string;
    kmr?: string;
    ar?: string;
  };
  coreJob: {
    ckb: string;
    en: string;
    kmr?: string;
    ar?: string;
  };
  description: {
    ckb: string;
    en: string;
    kmr?: string;
    ar?: string;
  };
  whyBestForDevs: {
    ckb: string;
    en: string;
    kmr?: string;
    ar?: string;
  };
  keyFeatures: string[];
  tags: string[];
}

const RAW_TOP_50_AI_TOOLS: TopAiTool[] = [
  // 1. Cursor
  {
    id: 'cursor',
    name: 'Cursor',
    rank: 1,
    group: 'coding-ide',
    pricing: 'freemium',
    officialUrl: 'https://www.cursor.com',
    badge: 'ژمارە ١ بۆ پرۆگرامەران 🌟',
    tagline: {
      ckb: 'ئیدیتۆری زیرەکی پرۆگرامینگ (VS Code Fork) بە تەواوی ئاوێتەکراو لەگەڵ AI',
      en: 'The AI-first Code Editor built for pairing with frontier models',
    },
    coreJob: {
      ckb: 'کۆدنووسین، گۆڕینی چەندین فایل پێکەوە (Composer)، و ئیندێکسکردنی تەواوی پڕۆژەکە بۆ تێگەیشتن لە پەیوەندی نێوان فایلەکان.',
      en: 'Multi-file codebase synthesis, semantic project indexing, and inline AI pair programming.',
    },
    description: {
      ckb: 'کۆرسەر لە ئێستادا پێشەنگی ئیدیتۆرەکانی جیهانە بۆ گەشەپێدەران؛ لەسەر بنەمای VS Code دروستکراوە بەڵام سیستەمی مۆدێلە هۆشمەندەکانی وەک Claude 3.5 Sonnet و GPT-4o لە ناخی داڕێژراوە. دەتوانێت بە چەند وشەیەک گۆڕانکاری لە دەیان فایلی کۆددا بکات بەبێ ئەوەی باگ دروست بکات.',
      en: 'Cursor is the leading AI-native code editor, engineered with deep codebase indexing, automated multi-file editing, and frictionless agentic composition.',
    },
    whyBestForDevs: {
      ckb: 'چونکە لەبری تەواوکردنی دێڕێک، تەواوی فایلەکان و ستڕەکچەری پڕۆژەکەت دەبینێت و کارامەیی کۆدنووسین بەلایەنی کەم ٥ هێندە خێراتر دەکات.',
      en: 'Understands your entire repository via AST & embeddings, editing multiple files simultaneously without losing project context.',
    },
    keyFeatures: ['Multi-file Composer', 'Full-codebase semantic search (@codebase)', 'Instant terminal command generation', 'Tab to edit anywhere'],
    tags: ['#IDE', '#VSCodeFork', '#Claude35', '#Composer', '#Top1'],
  },

  // 2. GitHub Copilot
  {
    id: 'github-copilot',
    name: 'GitHub Copilot & Copilot Workspace',
    rank: 2,
    group: 'coding-ide',
    pricing: 'paid',
    officialUrl: 'https://github.com/features/copilot',
    badge: 'ستانداردی پیشەسازی 🏆',
    tagline: {
      ckb: 'یاریدەدەری فەرمی GitHub و مایکرۆسۆفت لەناو هەموو ژینگەیەکی پەرەپێدان',
      en: 'The world’s most widely adopted AI developer tool',
    },
    coreJob: {
      ckb: 'پێشنیارکردنی کۆد لە کاتی نووسیندا (Autocomplete)، چاتی ڕاستەوخۆ دەربارەی فایلەکان، و پشکنینی کەلێنی ئاسایش.',
      en: 'Inline code autocompletion, natural language code chat, and pull-request pull plans.',
    },
    description: {
      ckb: 'کۆپایلەت یەکەم ئامرازی مەزن بوو کە شۆڕشی هۆشمەندی دەستپێکرد. ئێستا لەگەڵ Copilot Chat و Copilot Workspace تەواوی کێشەکانی ناو گیت‌هەب Issue دەگۆڕێت بۆ پلان و کۆد.',
      en: 'GitHub Copilot turns natural language prompts into coding suggestions across dozens of languages, natively integrated into Visual Studio, VS Code, and JetBrains.',
    },
    whyBestForDevs: {
      ckb: 'پەیوەندی ڕاستەوخۆی بە گیت‌هەبەوە هەیە و پشتگیری فەرمی هەموو کۆمپانیا گەورەکانی لەپشتە.',
      en: 'Direct integration with GitHub enterprise ecosystems, pull requests, and automated security scanning.',
    },
    keyFeatures: ['Inline completions', 'Copilot Chat in IDE', 'CLI assistance', 'GitHub PR summaries'],
    tags: ['#GitHub', '#Microsoft', '#Autocomplete', '#IndustryStandard'],
  },

  // 3. Claude 3.5 Sonnet & Claude Code
  {
    id: 'claude-code',
    name: 'Claude 3.5 Sonnet & Claude Code (Anthropic)',
    rank: 3,
    group: 'chat-reasoning',
    pricing: 'freemium',
    officialUrl: 'https://claude.ai',
    badge: 'بەهێزترین ژیری بۆ پرۆگرامینگ 🧠',
    tagline: {
      ckb: 'بەرزترین نمرەی شیکاری ئەلگۆریزم و کۆدنووسینی قووڵ لەگەڵ ئەیجنتی CLI',
      en: 'The gold standard LLM for programming logic and terminal-driven agentic engineering',
    },
    coreJob: {
      ckb: 'شیکردنەوەی ئەلگۆریزمی ئاڵۆز، نووسینی فەنکشنی ماتماتیکی، دیباگکردنی باگی قورس، و بەڕێوەبردنی کۆد لە تێرمیناڵ بە Claude Code.',
      en: 'Deep algorithmic problem solving, complex refactoring, test-driven development, and terminal-native autonomous coding.',
    },
    description: {
      ckb: 'کلۆد ٣.٥ سۆنێت لەلایەن بەشی زۆری ئەندازیارانی گەورەی جیهان بە باشترین مۆدێلی بیرکردنەوە دادەنرێت. شێوازی تێگەیشتنی لە لۆجیک و نەهێشتنی باگ کەمترین هەڵەی هەیە لە تەواوی مۆدێلەکان.',
      en: 'Claude 3.5 Sonnet achieves state-of-the-art coding benchmarks, offering high nuance, zero fluff, and exceptional adherence to system specifications.',
    },
    whyBestForDevs: {
      ckb: 'کەمترین هالوسینەیشنی هەیە و کۆدەکەی زۆر پاک و ڕێکخراو و پارێزراوە لە هەڵەی سینتاکسی.',
      en: 'Lowest hallucination rate on code syntax, phenomenal context handling (200k tokens), and unmatched artifact rendering.',
    },
    keyFeatures: ['200K token context', 'Artifacts live preview', 'Claude Code CLI agent', 'Vision for UI mockups'],
    tags: ['#Anthropic', '#ClaudeSonnet', '#Reasoning', '#BenchmarkLeader'],
  },

  // 4. Devin by Cognition
  {
    id: 'devin',
    name: 'Devin (Cognition Labs)',
    rank: 4,
    group: 'autonomous-agents',
    pricing: 'paid',
    officialUrl: 'https://cognition.ai',
    badge: 'یەکەم ئەندازیاری سەربەخۆ 🤖',
    tagline: {
      ckb: 'ئەیجنتی سەربەخۆی سۆفتوێر کە بە تەنیا پڕۆژە وەردەگرێت و بەتەواوی دروستی دەکات',
      en: 'The first autonomous AI software engineer capable of end-to-end development',
    },
    coreJob: {
      ckb: 'خوێندنەوەی API، دروستکردنی کلاود ئینڤایرۆنمێنت، نووسینی پڕۆژەی تەواو لە سەرەتاوە تا کۆتایی، تێپەڕاندنی تێست، و ناردنی Pull Request.',
      en: 'Autonomous bug resolution, sandbox deployment, documentation parsing, and production PR creation.',
    },
    description: {
      ckb: 'دێڤین ڕکابەری شێوازی کارکردنی ئەندازیارێکە: تێرمیناڵی تایبەت، وێبگەڕی تایبەت بۆ گەڕان بەناو دۆکیومێنت، و کۆد ئیدیتۆری هەیە. هەموو کردارەکان بە شێوازی سەربەخۆ ئەنجام دەدات.',
      en: 'Devin plans and executes complex engineering tasks in a fully sandboxed browser and shell environment, autonomously building and testing codebases.',
    },
    whyBestForDevs: {
      ckb: 'دەتوانیت کێشەیەکی سەختی پڕۆژەکەت یان کۆچکردنی لایبرەرییەکی کۆنی پێ بسپێریت و بێ دەستتێوەردان چارەسەری بکات.',
      en: 'Handles entire engineering tickets independently, navigating documentation, terminal errors, and test suites.',
    },
    keyFeatures: ['Sandboxed browser & shell', 'Autonomous planning loop', 'Real-world SWE-bench leader', 'PR submission'],
    tags: ['#AutonomousAgent', '#Devin', '#Cognition', '#Enterprise'],
  },

  // 5. Windsurf by Codeium
  {
    id: 'windsurf',
    name: 'Windsurf Editor (Codeium)',
    rank: 5,
    group: 'coding-ide',
    pricing: 'freemium',
    officialUrl: 'https://codeium.com/windsurf',
    badge: 'ئیدیتۆری هاوڕێی ئەیجنت 🌊',
    tagline: {
      ckb: 'ئیدیتۆرێکی نوێی خێرا بە سیستەمی Cascade بۆ بەڕێوەبردنی پڕۆژە لەگەڵ پرۆگرامەر',
      en: 'The Agentic IDE where developers and AI collaborate in seamless flow',
    },
    coreJob: {
      ckb: 'تێکەڵکردنی گفتوگۆ و کرداری دەستبەجێ لەناو فایلەکان بە سیستەمی Cascade، لەگەڵ تەواوکردنی خێرای کۆد لە کاتی نووسیندا.',
      en: 'Agentic flows with Cascade, real-time context-aware chat, and rapid inline prediction.',
    },
    description: {
      ckb: 'ویندسەرف بەرهەمی کۆمپانیای بەناوبانگی Codeiumە. تایبەتمەندی "Cascade"ی هەیە کە ئەیجنتێکە لەناو ئیدیتۆرەکەت دەژیت و هەموو نیازەکانت بۆ گۆڕانکاری لە چەندین فایل دەگۆڕێت بە کۆدی واقعی.',
      en: 'Windsurf combines Copilot-style speed with Cursor-style agentic power, featuring Cascade for deep multi-step execution.',
    },
    whyBestForDevs: {
      ckb: 'خێراییەکەی لە کۆرسەر و کۆپایلەت زیاترە و پێشنیارەکانی بەبێ کات بەفیڕۆدان دەردەکەون.',
      en: 'Ultra-fast predictive engine, stateful developer memory, and powerful live workspace integration.',
    },
    keyFeatures: ['Cascade agentic flow', 'Supercomplete multi-line prediction', 'Live terminal integration', 'Deep repo context'],
    tags: ['#Windsurf', '#Codeium', '#Cascade', '#IDE'],
  },

  // 6. v0 by Vercel
  {
    id: 'v0-vercel',
    name: 'v0 (Vercel)',
    rank: 6,
    group: 'frontend-ui',
    pricing: 'freemium',
    officialUrl: 'https://v0.dev',
    badge: 'پاشای دروستکردنی UI 🎨',
    tagline: {
      ckb: 'دروستکەری ڕووکاری وێب (UI) لە چەند چرکەیەکدا بە React و Tailwind و Shadcn',
      en: 'Generative UI system by Vercel producing production-ready React & Tailwind',
    },
    coreJob: {
      ckb: 'گۆڕینی بیرۆکە و سکێچ بۆ کۆدی کۆمپۆنێنتی مۆدێرنی React، Tailwind CSS و Shadcn UI بە شێوازی مۆدێرن و وەڵامدەرەوە.',
      en: 'Generates polished, fully responsive, copy-pasteable React, Tailwind, and Shadcn UI components from prompts or mockups.',
    },
    description: {
      ckb: 'ڤی زێرۆ بەرهەمی ڤێرسێلە (دروستکەری Next.js). دەتوانیت لە ڕێگەی وەسفکردنی ئەپڵیکەیشن یان بارکردنی وێنەیەک، دەستبەجێ کۆدی پاک و ستانداردی فرۆنتێند بەدەستبهێنیت و لەگەڵ پڕۆژەکەت تێکی بدەیت.',
      en: 'v0 generates accessible and responsive UI components using modern best practices, designed to fit cleanly into Next.js and React codebases.',
    },
    whyBestForDevs: {
      ckb: 'کۆدەکە تەواو پاکە و ناوی کلاسی ستاندارد بەکاردەهێنێت، ڕاستەوخۆ دەتوانیت بیبەیتە ناو پڕۆژەکەت بە فەرمانی npx shadcn add.',
      en: 'Produces production-ready JSX that requires minimal cleanup and integrates seamlessly with existing design systems.',
    },
    keyFeatures: ['Shadcn UI native', 'Figma/Screenshot to code', 'Live interactive preview', 'NPM package integration'],
    tags: ['#Vercel', '#React', '#Tailwind', '#Frontend', '#Shadcn'],
  },

  // 7. Bolt.new (StackBlitz)
  {
    id: 'bolt-new',
    name: 'Bolt.new (StackBlitz)',
    rank: 7,
    group: 'frontend-ui',
    pricing: 'freemium',
    officialUrl: 'https://bolt.new',
    badge: 'ئەپڵیکەیشنی تەواو لە وێبگەڕدا ⚡',
    tagline: {
      ckb: 'دروستکردنی تەواوی پڕۆژەی فولستاک و کارپێکردنی ڕاستەوخۆ لەناو وێبگەڕ بە WebContainers',
      en: 'Prompt, build, run and deploy full-stack web applications entirely in your browser',
    },
    coreJob: {
      ckb: 'دامەزراندنی تەواوی ئەپی فولستاک (Node.js, Vite, Database, API)، جێبەجێکردنی پاکێجەکانی npm، و بڵاوکردنەوەی بە یەک کلیک.',
      en: 'In-browser full-stack application creation, dependency installation, package execution, and instant cloud deployment.',
    },
    description: {
      ckb: 'بۆڵت پشتبەستووە بە تەکنەلۆژیای WebContainersی StackBlitz کە کێرنڵی نۆدی لەناو برۆوسەر دەخاتە کار. ئەیجنتەکەی دەتوانێت پاکێج دامەزرێنێت، سێرڤەر دابنێت و باگەکان بە خۆکاری چاک بکات.',
      en: 'Bolt.new runs an AI developer agent in WebContainers, giving it direct access to a Node.js runtime, terminal, and live browser preview.',
    },
    whyBestForDevs: {
      ckb: 'پێویست بە هیچ دانانێکی لۆکاڵ ناکات؛ لە چەند چرکەیەکدا پڕۆتۆتایپی پڕۆژەیەکی ئاڵۆزت بۆ دروست دەکات.',
      en: 'Zero local setup friction; instant proof-of-concept synthesis with live package execution and testing.',
    },
    keyFeatures: ['WebContainers in-browser Node', 'NPM install automation', 'Full-stack frontend + backend', 'One-click Netlify deploy'],
    tags: ['#StackBlitz', '#Fullstack', '#InBrowser', '#NodeJS'],
  },

  // 8. Lovable.dev
  {
    id: 'lovable-dev',
    name: 'Lovable.dev (GPT Engineer)',
    rank: 8,
    group: 'frontend-ui',
    pricing: 'freemium',
    officialUrl: 'https://lovable.dev',
    badge: 'دروستکەری ئەپی سەردەمیانە 💖',
    tagline: {
      ckb: 'پلاتفۆرمی دروستکردنی ئەپی تەواوی وێب بە شێوازی سەربەخۆ لەگەڵ گیت‌هەب و سوپابەیس',
      en: 'The last piece of software you will ever need to build software',
    },
    coreJob: {
      ckb: 'دروستکردنی سەکۆ و ساس (SaaS) لە بیرۆکەوە بۆ پڕۆژەیەکی فرۆشتن بە بەستنەوە بە داتابەیسی Supabase و گیت‌هەب.',
      en: 'Full-stack SaaS app generation with Supabase database integrations, auth, and automated GitHub commits.',
    },
    description: {
      ckb: 'لۆڤەبڵ یەکێکە لە گەرمترین ئامرازەکانی ٢٠٢٥-٢٠٢٦. پڕۆژەی گەورە لە سفرەوە دروست دەکات بە دیزاینی سەرنجڕاکێش و کۆدی زۆر ڕێکوپێک کە دەتوانیت بە گیت‌هەبی خۆتەوە بیبەستیتەوە.',
      en: 'Lovable turns conversation into full-stack software with enterprise-grade React code, authentic animations, and seamless backend infrastructure.',
    },
    whyBestForDevs: {
      ckb: 'کۆدەکە لە گیت‌هەبی خۆت خەزن دەبێت و دەتوانیت خۆت لە کۆرسەر یان ڤی ئێس کۆد دەستکاری بکەیت.',
      en: 'Direct GitHub two-way synchronization: AI updates code in your repository, and manual edits are respected by the AI.',
    },
    keyFeatures: ['GitHub 2-way sync', 'Supabase instant auth & db', 'Design-first aesthetics', 'Production export'],
    tags: ['#SaaS', '#Supabase', '#GitHubSync', '#FullStack'],
  },

  // 9. DeepSeek Coder & R1
  {
    id: 'deepseek-r1',
    name: 'DeepSeek Coder & DeepSeek R1',
    rank: 9,
    group: 'chat-reasoning',
    pricing: 'open_source',
    officialUrl: 'https://www.deepseek.com',
    githubUrl: 'https://github.com/deepseek-ai/DeepSeek-Coder',
    badge: 'شۆڕشی کراوەکۆد و هەرزانی 🚀',
    tagline: {
      ckb: 'بەهێزترین مۆدێلی شیکاری و پرۆگرامینگ بە کێشی کراوە و نرخی زۆر کەم',
      en: 'Frontier open-weights reasoning and code generation at disruptive performance',
    },
    coreJob: {
      ckb: 'ئەنجامدانی شیکارییە قورسەکان، بەرهەمهێنانی کۆدی سیستەمی، چارەسەری کێشەی ئەلگۆریزم و بەکارهێنان بە API یان لۆکاڵ.',
      en: 'Complex algorithm design, systems programming, and high-performance inference via open weights.',
    },
    description: {
      ckb: 'دیپ‌سیک جیهانی تەکنەلۆژیای هەژاند بە نیشاندانی ئەوەی کە دەکرێت بە دەیەکی تێچووی کۆمپانیا ئەمریکییەکان مۆدێلێک بەرهەمبهێنرێت کە ڕکابەری GPT-4o و Claude 3.5 بکات لە پرۆگرامینگدا.',
      en: 'DeepSeek R1 and Coder models challenge frontier closed models on coding logic, mathematical proofs, and system benchmarks at unmatched price efficiency.',
    },
    whyBestForDevs: {
      ckb: 'دەتوانیت کێشە کراوەکەی دابگریت و لەسەر سێرڤەری خۆت بەخۆڕایی کاری پێبکەیت بەبێ ترس لە دزەپێکردنی داتاکانت.',
      en: 'Fully open weights allowing self-hosting, fine-tuning, and zero data leakage for enterprise environments.',
    },
    keyFeatures: ['Open weights', 'Reinforcement learning reasoning', 'Affordable API', 'Local deployment with Ollama'],
    tags: ['#DeepSeek', '#OpenSource', '#R1', '#Reasoning'],
  },

  // 10. Replit Agent
  {
    id: 'replit-agent',
    name: 'Replit Agent',
    rank: 10,
    group: 'autonomous-agents',
    pricing: 'paid',
    officialUrl: 'https://replit.com/agent',
    badge: 'ئەیجنتی دەستبەجێی کلیک 📱',
    tagline: {
      ckb: 'دروستکردنی تەواوی پرۆگرام، ئەپ، و داتابەیس لەسەر مۆبایل و کۆمپیوتەر لە ژینگەی کلاوددا',
      en: 'Autonomous builder that turns plain English into deployed web applications',
    },
    coreJob: {
      ckb: 'دروستکردن، ڕێکخستنی ژینگە، دانانی داتابەیسی PostgreSQL، چارەسەری هەڵەی پاکێجەکان و بڵاوکردنەوە بە دۆمەینی فەرمی.',
      en: 'Autonomous provisioning of Postgres databases, backend APIs, client interfaces, and production URLs.',
    },
    description: {
      ckb: 'ڕێپڵیت ئەیجنت ڕاستەوخۆ لەناو ژینگەی کلاودی Replit کاردەکات. پێویست ناکات هیچ فایلێک دەستکاری بکەیت، تەنها داواکاری پێدەدەیت و ئەو هەموو هەنگاوەکان دەگرێتە ئەستۆ.',
      en: 'Replit Agent orchestrates the entire deployment stack: architecture planning, code composition, database migrations, and public domain hosting.',
    },
    whyBestForDevs: {
      ckb: 'تەنانەت لەسەر مۆبایلیش کاردەکات و لە ماوەی ٥ خولەکدا ئەپی ڕاستەقینەت بۆ دەخاتە کار لەسەر ئینتەرنێت.',
      en: 'Instant deployment to production domains with zero DevOps setup required.',
    },
    keyFeatures: ['Full cloud environment', 'Built-in Postgres', 'Autonomous error recovery', 'Mobile friendly'],
    tags: ['#Replit', '#AutonomousAgent', '#CloudIDE', '#Postgres'],
  },

  // 11. Ollama
  {
    id: 'ollama',
    name: 'Ollama',
    rank: 11,
    group: 'local-models',
    pricing: 'open_source',
    officialUrl: 'https://ollama.com',
    githubUrl: 'https://github.com/ollama/ollama',
    badge: 'پاشای مۆدێلی لۆکاڵ 🦙',
    tagline: {
      ckb: 'کارپێکردنی مۆدێلە بەهێزەکانی AI (وەک Llama 3, DeepSeek, Qwen) لەسەر کۆمپیوتەری خۆت بە یەک فەرمان',
      en: 'Get up and running with large language models locally on macOS, Linux, and Windows',
    },
    coreJob: {
      ckb: 'داگرتن و کارپێکردنی مۆدێلەکان لەسەر ئامێری خۆت بەبێ ئینتەرنێت، لەگەڵ دابینکردنی ڕاژەی API بە ستانداردی OpenAI بۆ بەستنەوە بە ئیدیتۆرەکەت.',
      en: 'Runs LLMs locally with an OpenAI-compatible REST API, supporting CPU, CUDA, and Apple Silicon acceleration.',
    },
    description: {
      ckb: 'ئۆلاما ژیانی پرۆگرامەرانی گۆڕی بە دروستکردنی ئامرازێکی وەک Docker بۆ AI. بە فەرمانی `ollama run deepseek-r1` دەتوانیت زیرەکترین مۆدێل بهێنیتە سەر ڕامی ئامێرەکەت بە تەواوی ئۆفلاین و بێبەرامبەر.',
      en: 'Ollama packages model weights, configurations, and GPU kernels into single Modelfiles, providing high-efficiency local inference.',
    },
    whyBestForDevs: {
      ckb: 'داتاکانت هەرگیز لە کۆمپیوتەرەکەت دەرناچێت، هیچ تێچوویەکی مانگانە نییە، و دەبەسترێتەوە بە Continue.dev یان VS Code.',
      en: 'Total privacy with zero network calls; works offline and easily pairs with local developer tools.',
    },
    keyFeatures: ['CLI one-line runners', 'OpenAI-compatible /v1/chat API', 'Apple Metal & Nvidia CUDA acceleration', 'Quantization support (Q4/Q8)'],
    tags: ['#LocalAI', '#Ollama', '#Privacy', '#OpenSource', '#Offline'],
  },

  // 12. Aider
  {
    id: 'aider',
    name: 'Aider (Command-line Pair Programmer)',
    rank: 12,
    group: 'terminal-cli',
    pricing: 'open_source',
    officialUrl: 'https://aider.chat',
    githubUrl: 'https://github.com/paul-gauthier/aider',
    badge: 'ئامرازی تێرمیناڵی پلە یەک 💻',
    tagline: {
      ckb: 'هاوڕێی پرۆگرامینگی تێرمیناڵ کە ڕاستەوخۆ کۆدەکان لە گیتدا کۆمیت دەکات بە پەیامی جوان',
      en: 'AI pair programming in your terminal, auto-committing git changes with sensible commit messages',
    },
    coreJob: {
      ckb: 'نووسین و دیباگکردنی کۆد لەناو فۆڵدەری ڕاستەقینەی پڕۆژەکەت، چارەسەری کۆنفڵیکتی گیت، و پشکنینی نەخشەی تەواوی کۆدبەیزی پڕۆژەکە (Repo Map).',
      en: 'Terminal-based code editing directly against local Git repos, generating clean atomic commits.',
    },
    description: {
      ckb: 'ئایدەر یەکێکە لە سەرسوڕهێنەرترین ئامرازە کراوەکۆدەکان کە لە تێرمیناڵ دادەنیشێت. نەخشەی تەواوی پڕۆژەکەت (Repository Map) دروست دەکات بە دارێژەی سی-تەگەکان و فەرمانەکانت بە کۆمیتەوە جێبەجێ دەکات.',
      en: 'Aider reads your Git status, builds a concise tree-sitter map of your repository, and coordinates code changes directly to disk.',
    },
    whyBestForDevs: {
      ckb: 'چونکە لەگەڵ شێوازی کارکردنی پرۆگرامەرانی ڕاستەقینە دەگونجێت کە تێرمیناڵ و گیت بەکاردەهێنن، و هەموو گۆڕانکارییەک پارێزراوە لە مێژووی گیتدا.',
      en: 'Respects git conventions: each prompt turns into an atomic git commit with descriptive messages that can be rolled back.',
    },
    keyFeatures: ['Repo Map tree-sitter indexing', 'Git auto-commit integration', 'Multi-model support', 'Voice-to-code in terminal'],
    tags: ['#Aider', '#Git', '#Terminal', '#CLI', '#PairProgramming'],
  },

  // 13. Supermaven
  {
    id: 'supermaven',
    name: 'Supermaven (Babak Pahlavan & Jacob Jackson)',
    rank: 13,
    group: 'coding-ide',
    pricing: 'freemium',
    officialUrl: 'https://supermaven.com',
    badge: 'خێراترین تەواوکەری کۆد ⚡',
    tagline: {
      ckb: 'خێراترین مۆدێلی تەواوکردنی کۆد لە جیهاندا بە پەنجەرەی یادگەی ١ ملیۆن تۆکن',
      en: 'The fastest AI code completion with a 1,000,000 token context window',
    },
    coreJob: {
      ckb: 'پێشبینیکردنی دەستبەجێی دێڕ و بلۆکی کۆد لە کاتی نووسیندا بە خێراییەکی سەرسوڕهێنەر (Latency کەمتر لە ٥٠ میلیچرکە).',
      en: 'Ultra-low-latency real-time code completion trained on high-throughput proprietary neural architecture.',
    },
    description: {
      ckb: 'سوپەرمەیڤن لەلایەن یەکێک لە دروستکەرانی سەرەکی تابلین دروستکراوە. تەکنەلۆژیایەک بەکاردەهێنێت کە پێی دەوترێت Babble کە ڕێگە دەدات بە خوێندنەوەی ١ ملیۆن تۆکن لە کۆد و پێشنیارکردنی کۆد بەبێ هیچ چاوەڕوانییەک.',
      en: 'Supermaven offers unmatched typing velocity: its 1M token context grasps your entire workspace while serving completions in milliseconds.',
    },
    whyBestForDevs: {
      ckb: 'کاتێک کۆد دەنووسیت هەست دەکەیت بیرۆکەکانت دەخوێنێتەوە بەبێ هیچ ڕاوەستانێک.',
      en: 'Zero typing lag; understands large repos and legacy architectures effortlessly.',
    },
    keyFeatures: ['1 Million token context', 'Sub-50ms latency', 'VS Code, Neovim, JetBrains plugins', 'Low battery consumption'],
    tags: ['#Supermaven', '#Speed', '#AutoComplete', '#MillionContext'],
  },

  // 14. Continue.dev
  {
    id: 'continue-dev',
    name: 'Continue.dev',
    rank: 14,
    group: 'coding-ide',
    pricing: 'open_source',
    officialUrl: 'https://continue.dev',
    githubUrl: 'https://github.com/continuedev/continue',
    badge: 'کراوەکۆدترین یاریدەدەر 🛠️',
    tagline: {
      ckb: 'سەکۆی کراوەکۆدی زیادکراوی VS Code و JetBrains بۆ بەستنەوە بە هەر مۆدێلێکی دڵخوازت',
      en: 'The leading open-source AI code assistant inside VS Code and JetBrains',
    },
    coreJob: {
      ckb: 'دروستکردنی ژینگەی چات، تەواوکردنی کۆد، و ڕیفاکتەرکردن بە بەکارهێنانی هەر مۆدێلێک (Ollama, Claude, OpenAI, DeepSeek).',
      en: 'Open source copilot extension connecting local or cloud LLMs directly to your development IDE.',
    },
    description: {
      ckb: 'کۆنتینیو باشترین بەدیلی کراوەکۆدە بۆ کۆپایلەت. لەبری ئەوەی پابەند بیت بە یەک کۆمپانیا، دەتوانیت لە ڕێگەی کۆنتینیوەوە چاتی کۆد و دەستکاری لەگەڵ هەر مۆدێلێک بکەیت کە خۆت دەتەوێت.',
      en: 'Continue gives teams complete control over their coding assistant stack, supporting custom prompts, local LLMs, and enterprise privacy rules.',
    },
    whyBestForDevs: {
      ckb: 'تەواو خۆڕایی و دەستکراوەیە و لەگەڵ ئۆلاما و کلاود ڕاستەوخۆ دەگونجێت.',
      en: 'Zero vendor lock-in; highly customizable config.json allowing model mixing for autocomplete and chat.',
    },
    keyFeatures: ['Open source MIT license', 'Supports Ollama, Anthropic, Mistral', 'Tab autocomplete + inline edits', 'Slash commands (@docs, @codebase)'],
    tags: ['#OpenSource', '#ContinueDev', '#NoVendorLockIn', '#JetBrains', '#VSCode'],
  },

  // 15. Sourcegraph Cody
  {
    id: 'sourcegraph-cody',
    name: 'Sourcegraph Cody',
    rank: 15,
    group: 'coding-ide',
    pricing: 'freemium',
    officialUrl: 'https://sourcegraph.com/cody',
    badge: 'شارەزای کۆدبەیزی گەورە 🏢',
    tagline: {
      ckb: 'یاریدەدەری زیرەک پشتبەستووە بە تەکنەلۆژیای پێشکەوتووی گەڕان لە کۆدی Sourcegraph',
      en: 'The AI coding assistant that knows your entire codebase using Code Graph',
    },
    coreJob: {
      ckb: 'گەڕان، وەڵامدانەوەی پرسیار، و نووسینی کۆد لەناو کۆدبەیزی ملیۆنان دێڕی کۆمپانیا گەورەکاندا.',
      en: 'Semantic code intelligence across massive distributed codebases using Code Graph technology.',
    },
    description: {
      ckb: 'کۆدی لەلایەن Sourcegraph دروستکراوە کە پادشای گەڕانە لەناو کۆدی پڕۆژە گەورەکان. دەتوانێت بە وردی بزانێت کام فەنکشن لە کام پڕۆژەی پەیوەندیداردا نووسراوە و وەڵامی زۆر دروست بداتەوە.',
      en: 'Cody leverages Sourcegraph’s Code Graph to understand multi-repo architectures and cross-repository dependencies.',
    },
    whyBestForDevs: {
      ckb: 'بۆ پڕۆژە گەورە و کۆنەکان (Enterprise Monorepos) کەمترین هەڵە دەکات چونکە نەخشەی کۆدەکە بە تەواوی لایە.',
      en: 'Excels at complex legacy code navigation where standard LLMs fail due to missing context.',
    },
    keyFeatures: ['Code Graph context engine', 'Multi-repo awareness', 'Custom prompts & commands', 'Enterprise SSO & security'],
    tags: ['#Sourcegraph', '#Cody', '#Enterprise', '#Monorepo'],
  },

  // 16. Qodo (formerly CodiumAI)
  {
    id: 'qodo-codiumai',
    name: 'Qodo (formerly CodiumAI)',
    rank: 16,
    group: 'review-testing',
    pricing: 'freemium',
    officialUrl: 'https://www.qodo.ai',
    badge: 'پارێزەری تێست و کوالێتی 🛡️',
    tagline: {
      ckb: 'سیستەمی پێشکەوتووی نووسینی تاقیکردنەوەی خۆکار (Unit Tests) و پشکنینی تۆکمەیی کۆد',
      en: 'Quality-first generative AI platform for test generation and code integrity',
    },
    coreJob: {
      ckb: 'نووسینی تێستی یەکەیی (Unit Tests)، دۆزینەوەی که‌لێنه‌ نادیاره‌کانی کۆد، و دڵنیابوونەوە لەوەی کۆدەکە لە هەموو حاڵەتەکاندا کاردەکات.',
      en: 'Automated test suite generation, edge-case identification, and test-driven code integrity assurance.',
    },
    description: {
      ckb: 'کۆدۆ سەرنجی لەسەر "کوالیتی و سەلامەتی کۆد"ە نەک تەنها نووسینی کۆدی خێرا. یارمەتیت دەدات بۆ هەموو فەنکشنێک تێستی تایبەت بە بارودۆخە دەگمەنەکان (Edge Cases) دروستبکەیت.',
      en: 'Qodo helps developers write meaningful unit and integration tests, analyzing behavior to discover uncovered logic vulnerabilities.',
    },
    whyBestForDevs: {
      ckb: 'ڕێگری دەکات لە کەوتنی سیستەم و هەڵە لە پرۆدەکشندا لە ڕێگەی دۆزینەوەی ئەو هەڵانەی پرۆگرامەر بیری لێنەکردۆتەوە.',
      en: 'Boosts test coverage from 20% to 90% without tedious manual mocking and assertion writing.',
    },
    keyFeatures: ['Automated test generation (Jest, PyTest, JUnit)', 'Edge-case behavior discovery', 'PR Agent integration', 'Code integrity reports'],
    tags: ['#Testing', '#UnitTests', '#QualityAssurance', '#Qodo'],
  },

  // 17. CodeRabbit
  {
    id: 'coderabbit',
    name: 'CodeRabbit',
    rank: 17,
    group: 'review-testing',
    pricing: 'freemium',
    officialUrl: 'https://coderabbit.ai',
    badge: 'پێداچوونەوەکاری خێرای PR 🐇',
    tagline: {
      ckb: 'ئەیجنتی ژیری دەستکرد بۆ پێداچوونەوەی وردی Pull Request لە GitHub و GitLab',
      en: 'AI-first code review agent providing conversational PR feedback and summaries',
    },
    coreJob: {
      ckb: 'پشکنینی دێڕ بە دێڕی گۆڕانکارییەکانی گیت‌هەب (Diffs)، دۆزینەوەی هەڵەی لۆجیکی و ئەمنییەت، و پێشکەشکردنی کۆدی پێشنیارکراو بە یەک کلیک.',
      en: 'Line-by-line PR analysis, security scanning, breaking-change warnings, and automated release summaries.',
    },
    description: {
      ckb: 'کۆدرابیت بە هەزاران تیم بەکاریدەهێنن. کاتێک گۆڕانکاری دەکەیت و PR دەکەیتەوە، وەک ئەندازیارێکی باڵا پێداچوونەوە بۆ کۆدەکە دەکات و دەستبەجێ کێشەکان دیاری دەکات.',
      en: 'CodeRabbit integrates directly as a GitHub App, commenting on exact lines of code with context-aware, reproducible improvements.',
    },
    whyBestForDevs: {
      ckb: 'کاتێکی ئێجگار زۆر بۆ سەرپەرشتیارانی پڕۆژە دەگەڕێنێتەوە و ڕێگری دەکات لە دزەکردنی هەڵە بۆ ناو برانچی سەرەکی.',
      en: 'Reduces code review turnaround times by 70% while maintaining rigorous code health standards.',
    },
    keyFeatures: ['Interactive line comments', 'Auto-generated sequence diagrams', 'Security & vulnerability alerts', '1-click suggested diff apply'],
    tags: ['#CodeReview', '#PullRequests', '#GitHubApp', '#Security'],
  },

  // 18. Cline (formerly Claude Dev)
  {
    id: 'cline',
    name: 'Cline (formerly Claude Dev)',
    rank: 18,
    group: 'autonomous-agents',
    pricing: 'open_source',
    officialUrl: 'https://cline.bot',
    githubUrl: 'https://github.com/cline/cline',
    badge: 'ئەیجنتی تێرمیناڵی VS Code 🦾',
    tagline: {
      ckb: 'ئەیجنتی سەربەخۆی ناو VS Code کە ڕێپێدانی تێرمیناڵ و دەستکاری فایلی هەیە بە مۆڵەتی خۆت',
      en: 'Autonomous coding agent right in your VS Code sidebar with command execution',
    },
    coreJob: {
      ckb: 'جێبەجێکردنی فەرمانی تێرمیناڵ، دروستکردنی فایل، دیباگکردنی کێشەکان و پشکنینی پڕۆژە لە ڕێگەی کۆنتڕۆڵی تەواوەوە.',
      en: 'Autonomous tool usage: edits files, executes terminal commands, and opens browser devtools directly.',
    },
    description: {
      ckb: 'کلاین زیاتر لە نیو ملیۆن پرۆگرامەر بەکاریدەهێنن لەناو VS Code. دەتوانێت پڕۆژەکەت بیخوێنێتەوە، کێشە لە تێرمیناڵ چارەسەر بکات، و لە هەموو هەنگاوێکدا داوای مۆڵەت بکات.',
      en: 'Cline executes end-to-end coding loops inside VS Code, using tool-calling to safely read files, build, and test applications.',
    },
    whyBestForDevs: {
      ckb: 'تەواو پارێزراوە چونکە بەبێ پەسەندکردنی تۆ هیچ فەرمانێکی تێرمیناڵ ناخاتە کار.',
      en: 'Human-in-the-loop safety: prompts for approval before executing any destructive shell operation.',
    },
    keyFeatures: ['Human-in-the-loop approval', 'Browser testing tools', 'Direct file modification', 'OpenAI / Anthropic / Ollama support'],
    tags: ['#Cline', '#Agent', '#VSCodeExtension', '#OpenSource'],
  },

  // 19. Roo Code
  {
    id: 'roo-code',
    name: 'Roo Code (Roo Vetere)',
    rank: 19,
    group: 'autonomous-agents',
    pricing: 'open_source',
    officialUrl: 'https://roocode.com',
    githubUrl: 'https://github.com/RooVetGit/Roo-Cline',
    badge: 'ئەیجنتی چەند شێوازی 🦘',
    tagline: {
      ckb: 'پێشکەوتووترین فرۆکی کلاین بە شێوازەکانی ئەندازیار (Code)، داڕێژەر (Architect)، و وەڵامدەرەوە (Ask)',
      en: 'Advanced community fork of Cline featuring custom personas, multi-mode reasoning, and token optimizer',
    },
    coreJob: {
      ckb: 'دابەشکردنی ئەرکەکان بەپێی ڕۆڵ: پلاندانانی تەلارسازی ئەپ پێش نووسینی یەک دێڕی کۆد، پاشان جێبەجێکردنی پاک.',
      en: 'Multi-persona agent orchestration: separate modes for system design, code execution, and technical inquiry.',
    },
    description: {
      ckb: 'ڕوو کۆد بە خێراییەکی زۆر گەشەی کرد لەنێو کۆمەڵگەی پرۆگرامەراندا. ڕێگە دەدات مۆدێلی جیاواز بەکاربهێنیت بۆ پلاندانان (وەک o1 یان R1) و مۆدێلی تر بۆ نووسینی کۆد (وەک Sonnet).',
      en: 'Roo Code adds customized developer modes, sound notifications, and model switching based on task complexity.',
    },
    whyBestForDevs: {
      ckb: 'تێچووی تۆکن کەم دەکاتەوە و بە ڕێکخستنی شێوازەکان پڕۆژەی تەلارسازی گەورە لە باگ دەپارێزێت.',
      en: 'Saves token costs and prevents context pollution through specialized architectural and coding phases.',
    },
    keyFeatures: ['Architect / Code / Ask / Debug modes', 'Custom prompt presets', 'Sound & visual cues', 'Diff viewer support'],
    tags: ['#RooCode', '#MultiMode', '#Architect', '#ClineFork'],
  },

  // 20. OpenHands (formerly OpenDevin)
  {
    id: 'openhands',
    name: 'OpenHands (formerly OpenDevin)',
    rank: 20,
    group: 'autonomous-agents',
    pricing: 'open_source',
    officialUrl: 'https://all-hands.dev',
    githubUrl: 'https://github.com/All-Hands-AI/OpenHands',
    badge: 'ئەیجنتی سەربەخۆی کراوەکۆد 🌐',
    tagline: {
      ckb: 'پلاتفۆرمی کراوەکۆدی ئەندازیاری سۆفتوێری هاوشێوەی دێڤین بۆ جێبەجێکردنی ئەرکە ئاڵۆزەکان لەناو دۆکەردا',
      en: 'An open-source platform for autonomous software development agents running safely in Docker',
    },
    coreJob: {
      ckb: 'دەستکاریکردنی ڕاستەقینەی پڕۆژە لەناو کانتەینەری دۆکەردا، چارەسەرکردنی تیکێتەکانی گیت‌هەب بە شێوەی سەربەخۆ.',
      en: 'Docker-sandboxed autonomous coding agent resolving real-world software tickets and benchmark evaluations.',
    },
    description: {
      ckb: 'ئۆپن هاندس وەکو دەستپێشخەرییەکی کراوەی جیهانی دەستیپێکرد بۆ ئەوەی جێگرەوەیەکی ئازاد بۆ Devin دابین بکات. لە کانتەینەرێکی دابڕاودا کۆدەکانت تاقی دەکاتەوە بەبێ ئەوەی مەترسی بۆ سەر سیستەمەکەت دروست بکات.',
      en: 'OpenHands provides a full agentic sandbox with shell, browser, and editor control, backed by a vibrant global research community.',
    },
    whyBestForDevs: {
      ckb: 'تەواو لەژێر دەسەڵاتی خۆتدایە، کراوەکۆدە، و دەتوانیت لەسەر لۆکاڵ یان سێرڤەری گەورە دایبمەزرێنیت.',
      en: 'Safe sandbox execution in Docker containers with transparent event streams and agent telemetry.',
    },
    keyFeatures: ['Full Docker sandbox', 'Web browser & terminal interactions', 'GitHub Issue resolution', 'Benchmarking suite'],
    tags: ['#OpenHands', '#OpenDevin', '#Docker', '#Research', '#Agent'],
  },

  // 21. SWE-agent (Princeton NLP)
  {
    id: 'swe-agent',
    name: 'SWE-agent (Princeton University)',
    rank: 21,
    group: 'autonomous-agents',
    pricing: 'open_source',
    officialUrl: 'https://swe-agent.com',
    githubUrl: 'https://github.com/princeton-nlp/SWE-agent',
    badge: 'ئەکادیمی و زانستی 🎓',
    tagline: {
      ckb: 'ئەیجنتی بەناوبانگی زانکۆی پرینستۆن کە لە ڕێگەی ڕووکاری تایبەت بە AI تیکێتی گیت‌هەب چارەسەر دەکات',
      en: 'Turns LM into software engineering agents capable of fixing real GitHub issues autonomously',
    },
    coreJob: {
      ckb: 'شیکردنەوەی باگ لە ڕیپۆزیتۆرییە گەورەکان بە ڕووکاری Agent-Computer Interface (ACI).',
      en: 'Autonomous bug resolution on complex repositories using customized agent-computer interfaces.',
    },
    description: {
      ckb: 'دروستکراوی تاقیگەی پرینستۆنە؛ ڕووکارێکی داهێنەرانەی هەیە بە ناوی ACI کە فەرمانەکانی تێرمیناڵی بۆ مۆدێلەکە کورت و پوخت کردووەتەوە تا بتوانێت کێشەی زۆر گەورە بە کەمترین تۆکن چارەسەر بکات.',
      en: 'SWE-agent pioneered the Agent-Computer Interface (ACI) paradigm, proving that tailored command vocabularies dramatically improve agent task completion.',
    },
    whyBestForDevs: {
      ckb: 'نمرەی بەرزی هەیە لە تاقیکردنەوەی ستانداردی جیهانی SWE-bench و بۆ لێکۆڵینەوە و چارەسەری کێشەی تەکنیکی زۆر بەهێزە.',
      en: 'Scientific benchmark rigor; exceptionally efficient at navigating massive codebases and running reproduction scripts.',
    },
    keyFeatures: ['Agent-Computer Interface (ACI)', 'SWE-bench verified performance', 'Automated patch generation', 'Test reproduction suites'],
    tags: ['#SWEagent', '#Princeton', '#Research', '#SWEbench'],
  },

  // 22. Gemini Code Assist (Google)
  {
    id: 'gemini-code-assist',
    name: 'Gemini Code Assist (Google Cloud)',
    rank: 22,
    group: 'coding-ide',
    pricing: 'freemium',
    officialUrl: 'https://cloud.google.com/gemini-code-assist',
    badge: 'سیستەمی فەرمی گووگڵ 🌐',
    tagline: {
      ckb: 'یاریدەدەری فەرمی گووگڵ بۆ پرۆگرامینگ لەناو VS Code و IntelliJ بە پەنجەرەی گەورەی ناوەڕۆک',
      en: 'Enterprise AI code completion, full-codebase awareness, and GCP cloud assistance by Google',
    },
    coreJob: {
      ckb: 'تەواوکردنی کۆد، گۆڕینی کۆدی کۆن بۆ زمانە مۆدێرنەکان، دیباگکردن و ئۆتۆماتیککردنی کارەکانی کلاودی گووگڵ.',
      en: 'Full-repository context awareness, code refactoring, enterprise security review, and GCP management.',
    },
    description: {
      ckb: 'جێمینای کۆد ئەسیست لەلایەن ئەندازیارانی گووگڵەوە بۆ هەردوو کۆدی خۆماڵی و خزمەتگوزارییەکانی گووگڵ پەرەی پێدراوە. پەنجەرەی تا سەرووی یەک ملیۆن تۆکنی هەیە بۆ تێگەیشتن لە هەموو پڕۆژە دێرین و هاوچەرخەکان.',
      en: 'Gemini Code Assist integrates deep codebase custom context with Google’s frontier multi-modal reasoning capabilities.',
    },
    whyBestForDevs: {
      ckb: 'ئەگەر لەسەر کلاودی گووگڵ یان ئەندرۆید یان کۆمەڵەی ئەپەکانی کاردەکەیت، زیرەکترین ڕێنماییت پێشکەش دەکات.',
      en: 'Native synergy with Google Cloud, Firebase, Flutter, and enterprise monorepo infrastructure.',
    },
    keyFeatures: ['Massive context window', 'Enterprise license compliance', 'Private repository awareness', 'GCP CLI & Terraform generation'],
    tags: ['#Google', '#Gemini', '#Cloud', '#Enterprise'],
  },

  // 23. Amazon Q Developer
  {
    id: 'amazon-q-developer',
    name: 'Amazon Q Developer (AWS)',
    rank: 23,
    group: 'coding-ide',
    pricing: 'freemium',
    officialUrl: 'https://aws.amazon.com/q/developer',
    badge: 'پسپۆڕی کلاود و ئاسایش ☁️',
    tagline: {
      ckb: 'یاریدەدەری تایبەتی ئەمازۆن بۆ کۆدنووسین، کۆچکردنی زمانەکان، و بەڕێوەبردنی AWS',
      en: 'Generative AI-powered assistant for software development and AWS cloud operations',
    },
    coreJob: {
      ckb: 'نووسینی کۆد، نوێکردنەوەی خۆکاری پڕۆژەی Javaی کۆن بۆ ڤێرژنە نوێیەکان، و پشکنینی ئاسایش و ڕێکخستنی سێرڤەر.',
      en: 'Code generation, automated Java version upgrades, security vulnerability remediation, and AWS resource orchestration.',
    },
    description: {
      ckb: 'ئەمازۆن کیو باشترین ئامرازە ئەگەر پڕۆژەکەت لەسەر AWS بێت یان کۆدی جاڤای کۆنت هەبێت کە دەتەوێت لە ماوەی یەک ڕۆژدا لە Java 8ەوە بگۆڕدرێت بۆ Java 17 یان 21.',
      en: 'Amazon Q Developer excels at code transformation and security vulnerability patching with high enterprise security guarantees.',
    },
    whyBestForDevs: {
      ckb: 'سیستەمی نوێکردنەوەی Java Transformationی مانگانە هەزاران کاتژمێری ئەندازیاران دەگەڕێنێتەوە.',
      en: 'Industry-leading legacy application migration and in-depth AWS infrastructure debugging.',
    },
    keyFeatures: ['Automated code transformation (Java upgrade)', 'Security vulnerability scanning', 'AWS console integration', 'IDE chat & autocomplete'],
    tags: ['#AWS', '#AmazonQ', '#JavaUpgrade', '#CloudSecurity'],
  },

  // 24. Tabnine
  {
    id: 'tabnine',
    name: 'Tabnine',
    rank: 24,
    group: 'coding-ide',
    pricing: 'freemium',
    officialUrl: 'https://www.tabnine.com',
    badge: 'پارێزراوترین لە ڕووی تایبەتمەندی 🔒',
    tagline: {
      ckb: 'یاریدەدەری کۆدنووسین بە فۆکەسی تەواو لەسەر نهێنی داتاکان، پاراستنی کۆپی ڕایت، و کارکردنی لۆکاڵ',
      en: 'The AI code assistant that you control — private, secure, and personalized',
    },
    coreJob: {
      ckb: 'تەواوکردنی کۆد لە کاتی نووسیندا بەبێ ئەوەی یەک دێڕ لە کۆدەکەت بۆ سێرڤەری گشتی بنێردرێت (بژاردەی On-Premise).',
      en: 'Secure code completions and chat with zero data retention and on-premises deployment options.',
    },
    description: {
      ckb: 'تابلاین یەکێک لە کۆنترین و ناسراوترین ئامرازەکانە بۆ کۆمپانیا بانک و دامەزراوە هەستیارەکان، چونکە گەرەنتی دەکات کۆدەکەت بۆ مەشقپێکردنی مۆدێلی تر بەکارناهێنرێت.',
      en: 'Tabnine runs locally, on a private server, or in compliant cloud configurations, trained exclusively on permissively licensed code.',
    },
    whyBestForDevs: {
      ckb: 'گەرەنتی تەواوی پاراستنی کۆدەکەت دەدات و هەرگیز کێشەی یاسایی کۆپی‌ڕایت بۆ پڕۆژەکەت دروست ناکات.',
      en: 'Total compliance with enterprise intellectual property and zero third-party training data exposure.',
    },
    keyFeatures: ['On-premise / air-gapped hosting', 'Zero data retention policy', 'Permissive license guarantees', 'Custom private model tuning'],
    tags: ['#Tabnine', '#Privacy', '#Enterprise', '#OnPremise'],
  },

  // 25. Perplexity Pro (Technical Search)
  {
    id: 'perplexity-pro',
    name: 'Perplexity Pro (for Developers)',
    rank: 25,
    group: 'docs-search',
    pricing: 'freemium',
    officialUrl: 'https://www.perplexity.ai',
    badge: 'مەکینەی گەڕانی دۆکیومێنت 🔍',
    tagline: {
      ckb: 'مەکینەی زیرەکی وەڵامدانەوە بە بەستەری فەرمی دۆکیومێنت، پاکێج و کتێبخانە نوێیەکان',
      en: 'Real-time conversational answer engine with verified technical citations and library documentation',
    },
    coreJob: {
      ckb: 'گەڕان بەدوای کێشە و باگە نوێیەکاندا بە ئینتەرنێتی ڕاستەوخۆ، دەرهێنانی نموونەی بەکارهێنانی API، و هێنانی سەرچاوەی فەرمی.',
      en: 'Real-time web research, library documentation synthesis, and debugging cutting-edge technical issues.',
    },
    description: {
      ckb: 'پێرپلێکستی بووەتە جێگرەوەی سەرەکی گەڕانی گووگڵ بۆ پرۆگرامەران؛ کاتێک لەگەڵ کتێبخانەیەکی نوێدا کاردەکەیت کە مۆدێلە ئاساییەکان نایناسن، ڕاستەوخۆ وێب دەگەڕێت و کۆدی دروستت بۆ دەهێنێت.',
      en: 'Perplexity aggregates live documentation across GitHub, StackOverflow, and official SDK docs with precise clickable source citations.',
    },
    whyBestForDevs: {
      ckb: 'هیچ کۆدێکی بەسەرچوو ناهێنێت و هەموو وەڵامێک بەستەری فەرمی بەڵگەنامەی ڕاستەقینەی لەگەڵدایە.',
      en: 'Eliminates outdated training cutoffs by continuously verifying API specs against live documentation.',
    },
    keyFeatures: ['Live web search with citations', 'Code execution in browser', 'File/repo upload and query', 'Choice of Claude 3.5, Sonar & GPT-4o'],
    tags: ['#Perplexity', '#Search', '#Documentation', '#LiveCitations'],
  },

  // 26. Phind
  {
    id: 'phind',
    name: 'Phind (Search for Developers)',
    rank: 26,
    group: 'docs-search',
    pricing: 'freemium',
    officialUrl: 'https://www.phind.com',
    badge: 'تایبەت بە کێشەی تەکنیکی 💡',
    tagline: {
      ckb: 'مەکینەی گەڕانی تایبەتمەند کە مەشقی پێکراوە تەنها بۆ وەڵامدانەوەی پرسیارە تەکنیکی و پرۆگرامینگییەکان',
      en: 'The intelligent search engine built exclusively for software engineers',
    },
    coreJob: {
      ckb: 'وەڵامدانەوەی پرسیارە قورسەکانی پرۆگرامینگ بە کەمترین قسەی زیادە، پیشاندانی کۆد و لۆجیکی جێبەجێکردن لە چەند چرکەیەکدا.',
      en: 'Instant technical troubleshooting, terminal error resolution, and API reference retrieval.',
    },
    description: {
      ckb: 'فایند ڕاستەوخۆ لەناو کێشەکە قووڵ دەبێتەوە و کۆدی ڕوون و ئامادەکراو بۆ تاقیکردنەوە پێشکەش دەکات بەبێ ئەوەی پرسیاری ناپێویست بکات.',
      en: 'Phind leverages custom fine-tuned code models optimized to synthesize clean technical answers from the web.',
    },
    whyBestForDevs: {
      ckb: 'وەڵامەکانی زۆر خێران و ڕێک ئەو کۆدە دەهێنن کە دەتوانیت لە پڕۆژەکەتدا کۆپی بکەیت.',
      en: 'Direct, distraction-free technical summaries with code snippets prioritized at the top of results.',
    },
    keyFeatures: ['Phind-70B model', 'VS Code extension integration', 'Instant code snippet copy', 'Technical link references'],
    tags: ['#Phind', '#DeveloperSearch', '#FastAnswers'],
  },

  // 27. LM Studio
  {
    id: 'lm-studio',
    name: 'LM Studio',
    rank: 27,
    group: 'local-models',
    pricing: 'free',
    officialUrl: 'https://lmstudio.ai',
    badge: 'ڕووکاری گرافیکی بۆ مۆدێلی لۆکاڵ 🖥️',
    tagline: {
      ckb: 'بەرنامەی شایستەی دێسکتۆپ بۆ دۆزینەوە، داگرتن و کارپێکردنی مۆدێلە لۆکاڵەکان بە ڕووکارێکی زۆر جوان',
      en: 'Discover, download, and run local LLMs offline on your computer with a polished GUI',
    },
    coreJob: {
      ckb: 'گەڕان لە Hugging Face و داگرتنی مۆدێلە نوێیەکان بە فۆرماتی GGUF، کارپێکردنیان لەسەر کارت شاشە (GPU)، و دروستکردنی سێرڤەری لۆکاڵ.',
      en: 'Local GGUF model manager and runner with native GPU offloading and local REST API server.',
    },
    description: {
      ckb: 'ئێڵ ئێم ستۆدیۆ ئەزموونی مۆدێلی خۆماڵی کرد بە کارێکی زۆر ئاسان. پێویست ناکات هیچ فەرمانێک بزانیت؛ تەنها ناوی مۆدێلەکە دەنووسیت و بە یەک کلیک دایدەگریت و چاتی لەگەڵ دەکەیت.',
      en: 'LM Studio gives developers a native desktop application with hardware detection, chat playground, and one-click local server host.',
    },
    whyBestForDevs: {
      ckb: 'ڕێگە دەدات بە بەستنەوەی سێرڤەری لۆکاڵ بە کۆرسەر یان VS Code تا بەبێ ئینتەرنێت و بێ پارە کۆد بنووسیت.',
      en: 'Instant local OpenAI drop-in endpoint: replaces external API calls in your apps with 127.0.0.1:1234.',
    },
    keyFeatures: ['Hugging Face direct search', 'Apple Silicon Metal & CUDA offload', 'Built-in local developer server', 'System prompt presets'],
    tags: ['#LMStudio', '#GUI', '#GGUF', '#LocalLLM', '#Offline'],
  },

  // 28. vLLM
  {
    id: 'vllm',
    name: 'vLLM',
    rank: 28,
    group: 'local-models',
    pricing: 'open_source',
    officialUrl: 'https://vllm.ai',
    githubUrl: 'https://github.com/vllm-project/vllm',
    badge: 'پێشەنگی سێرڤەری بەرهەمهێنان 🚀',
    tagline: {
      ckb: 'خێراترین مەکینەی سێرڤەری LLM لە جیهاندا بە تەکنەلۆژیای PagedAttention بۆ کۆمپانیاکان',
      en: 'A high-throughput and memory-efficient inference and serving engine for LLMs',
    },
    coreJob: {
      ckb: 'خستنەگەڕی مۆدێلەکان لەسەر سێرڤەری بەرهەمهێنان (Production) بە بەرزترین ژمارەی ڕێژەی تۆکن لە چرکەیەکدا.',
      en: 'High-concurrency LLM serving with near-zero KV-cache memory waste via PagedAttention.',
    },
    description: {
      ckb: 'ڤی ئێڵ ئێڵ ئێم لەلایەن زانکۆی بێرکلی داهێنرا و بووە پێوەرێکی ستاندارد بۆ هەموو ئەو پڕۆژانەی دەیانەوێت مۆدێلی خۆیان بۆ هەزاران بەکارهێنەر بە خێرایی بەردەست بکەن.',
      en: 'vLLM delivers up to 24x higher throughput than HuggingFace TGI by treating attention key-values like virtual memory pages.',
    },
    whyBestForDevs: {
      ckb: 'تێچووی سێرڤەر و کارت شاشەکان (GPUs) بە ڕێژەی لە %٧٠ کەم دەکاتەوە لە ڕێگەی ڕێکخستنی میمۆری بەهێز.',
      en: 'Drastically cuts infrastructure cloud costs while maintaining maximum token throughput.',
    },
    keyFeatures: ['PagedAttention memory management', 'Continuous batching', 'OpenAI-compatible server', 'Quantization (AWQ, GPTQ, FP8)'],
    tags: ['#vLLM', '#Inference', '#Production', '#HighThroughput'],
  },

  // 29. LangChain
  {
    id: 'langchain',
    name: 'LangChain & LangGraph',
    rank: 29,
    group: 'frameworks',
    pricing: 'open_source',
    officialUrl: 'https://www.langchain.com',
    githubUrl: 'https://github.com/langchain-ai/langchain',
    badge: 'فڕەیمۆرکی ستاندارد بۆ دروستکردنی ئەپی AI 🦜',
    tagline: {
      ckb: 'فڕەیمۆرکی سەرەکی لە Python و TypeScript بۆ بەستنەوەی مۆدێلەکان، داتابەیس، و زنجیرەی بیرکردنەوە',
      en: 'The industry-standard framework to build context-aware, reasoning LLM applications',
    },
    coreJob: {
      ckb: 'دروستکردنی سیستەمی RAG، پێکەوەبەستنی زنجیرە ئەرکەکان (Chains)، و دروستکردنی ئەیجنتی سوڕاوەی فرە-هەنگاو بە LangGraph.',
      en: 'RAG pipelines, multi-agent orchestration, stateful graph execution, and tool-calling interfaces.',
    },
    description: {
      ckb: 'لانگ‌چەین بەناوبانگترین فڕەیمۆرکە کە یارمەتیت دەدات ئەپڵیکەیشنی ڕاستەقینە لەسەر مۆدێلەکان دروستبکەیت. فڕەیمۆرکی LangGraphیشی هەیە بۆ ئەیجنتە ئاڵۆزەکان.',
      en: 'LangChain provides composable abstractions to construct production-ready AI workflows with pre-built integrations for hundreds of providers.',
    },
    whyBestForDevs: {
      ckb: 'زیاتر لە ٨٠٠ ئینتەگرەیشنی ئامادەکراوی هەیە لەگەڵ هەموو جۆرە داتابەیسی ڤێکتەر و مۆدێلەکان.',
      en: 'Extensive ecosystem with pre-built connectors for virtually every vector database, model, and embedding service.',
    },
    keyFeatures: ['LangGraph state machines', 'RAG retrieval architectures', 'LangSmith evaluation integration', 'Python & TypeScript parity'],
    tags: ['#LangChain', '#LangGraph', '#RAG', '#Python', '#TypeScript'],
  },

  // 30. LlamaIndex
  {
    id: 'llamaindex',
    name: 'LlamaIndex',
    rank: 30,
    group: 'frameworks',
    pricing: 'open_source',
    officialUrl: 'https://www.llamaindex.ai',
    githubUrl: 'https://github.com/run-llama/llama_index',
    badge: 'پاشای RAG و بەستنەوەی داتا 🦙',
    tagline: {
      ckb: 'فڕەیمۆرکی ژمارە یەک بۆ بەستنەوەی داتابەیس، فایلی PDF، و داتای تایبەت بە مۆدێلەکانی AI',
      en: 'The leading data framework for building LLM applications over your private enterprise data',
    },
    coreJob: {
      ckb: 'پارچەکردن و ئیندێکسکردنی دۆکیومێنت (Chunking & Indexing)، گەڕانی ڤێکتەری و هایبرید (Hybrid Search)، و بەستنەوەی داتای کۆمپانیا بە مۆدێلەکان.',
      en: 'Document ingestion, semantic chunking, vector indexing, and high-accuracy retrieval-augmented generation.',
    },
    description: {
      ckb: 'لاما ئیندێکس فۆکەسی لەسەر "داتا"یە. ئەگەر پڕۆژەکەت پێویستی بەوەیە چەندین فایلی PDF یان داتابەیسی SQL بخوێنێتەوە و لەسەر بنەمای ئەو داتایە وەڵام بداتەوە، ئەم فڕەیمۆرکە یەکەم هەڵبژاردنە.',
      en: 'LlamaIndex turns unstructured data into structured vector knowledge graphs, ensuring LLMs answer based on factual context.',
    },
    whyBestForDevs: {
      ckb: 'کەمترین هالوسینەیشن دروست دەکات و بەستەری ڕاستەقینەی ئەو دێڕانە دەهێنێتەوە کە وەڵامەکەی لێ وەرگرتووە.',
      en: 'Unmatched query engine accuracy for enterprise document Q&A with deep retrieval evaluation tools.',
    },
    keyFeatures: ['LlamaParse complex PDF parser', 'Advanced reranking & hybrid search', 'Workflows event-driven execution', 'Native VectorStore integrations'],
    tags: ['#LlamaIndex', '#RAG', '#VectorDB', '#DataPipelines'],
  },

  // 31. CrewAI
  {
    id: 'crewai',
    name: 'CrewAI',
    rank: 31,
    group: 'frameworks',
    pricing: 'open_source',
    officialUrl: 'https://crewai.com',
    githubUrl: 'https://github.com/crewAIInc/crewAI',
    badge: 'تیمی ئەیجنتە زیرەکەکان 👥',
    tagline: {
      ckb: 'فڕەیمۆرک بۆ دروستکردنی تیمی ئەیجنتی هاوکار کە هەریەکەیان ڕۆڵ و کارامەیی تایبەتی هەیە',
      en: 'Framework for orchestrating role-playing autonomous AI agents that work together',
    },
    coreJob: {
      ckb: 'دابەشکردنی پڕۆژە بۆ چەندین ڕۆڵ (وەک: توێژەر، نووسەری کۆد، پێداچوونەوەکار) و بەڕێوەبردنی گفتوگۆ و هاوکاری نێوانیان تا تەواوبوونی کارەکە.',
      en: 'Multi-agent role-playing orchestration with structured workflows, tools, and shared task goals.',
    },
    description: {
      ckb: 'کروو ئەی ئای ڕێگەت پێدەدات لەبری یەک مۆدێل، تیمێک دروستبکەیت: یەکێکیان سەرپەرشتیار بێت، ئەوی تریان کۆد بنووسێت، و سێیەمیان تێست بکات. هەموویان بە هاوبەشی کێشەکە چارەسەر دەکەن.',
      en: 'CrewAI enables autonomous agents to delegate tasks, collaborate, and execute complex workflows mimicking human agile engineering teams.',
    },
    whyBestForDevs: {
      ckb: 'سینتاکسەکەی زۆر سادە و دۆستانەیە و لە ماوەی چەند خولەکێکدا سیستەمی فرە-ئەیجنتی پێ دادەمەزرێت.',
      en: 'Clean, intuitive Python abstractions for defining agent personas, goals, backstories, and task dependencies.',
    },
    keyFeatures: ['Role-playing agent personas', 'Autonomous task delegation', 'Process management (Sequential/Hierarchical)', 'Rich tool ecosystem'],
    tags: ['#CrewAI', '#MultiAgent', '#Automation', '#Python'],
  },

  // 32. Microsoft AutoGen
  {
    id: 'autogen',
    name: 'Microsoft AutoGen & AG2',
    rank: 32,
    group: 'frameworks',
    pricing: 'open_source',
    officialUrl: 'https://microsoft.github.io/autogen',
    githubUrl: 'https://github.com/microsoft/autogen',
    badge: 'سیستەمی پێشکەوتووی مایکرۆسۆفت 🏢',
    tagline: {
      ckb: 'فڕەیمۆرکی بەهێزی لێکۆڵینەوەی مایکرۆسۆفت بۆ گفتوگۆی فرە-ئەیجنت و کارپێکردنی کۆد لەناو ژینگەدا',
      en: 'A multi-agent conversation framework to enable next-generation LLM applications',
    },
    coreJob: {
      ckb: 'ئاسانکاری گفتوگۆی ئۆتۆماتیکی نێوان چەندین ئەیجنت و بەکارهێنەر بۆ نووسین، بەڕێوەبردن، و ڕاستکردنەوەی هەڵەکانی کۆد.',
      en: 'Multi-agent conversational choreography with built-in code execution and human feedback loops.',
    },
    description: {
      ckb: 'ئۆتۆجێن لەلایەن توێژەرانی مایکرۆسۆفت پەرەی پێدراوە. تایبەتمەندی بەهێزی جێبەجێکردنی کۆدی لۆکاڵی هەیە و دەتوانێت فەنکشنەکان لەناو کانتەینەر تاقی بکاتەوە تا وەڵامی دروست بەدەستدەهێنێت.',
      en: 'AutoGen allows developers to compose customizable, conversable agents that integrate LLMs, human inputs, and safe code execution environments.',
    },
    whyBestForDevs: {
      ckb: 'بۆ پڕۆژە زانستییەکان و تاقیکردنەوەی چارەسەری ئاڵۆز یەکێک لە ستانداردە جیهانییەکانە.',
      en: 'Battle-tested academic grounding with powerful asynchronous messaging and Docker-isolated code runners.',
    },
    keyFeatures: ['Conversable agent architecture', 'Safe Docker execution', 'Human-in-the-loop support', 'AutoGen Studio visual builder'],
    tags: ['#AutoGen', '#Microsoft', '#MultiAgent', '#Research'],
  },

  // 33. Warp AI
  {
    id: 'warp-ai',
    name: 'Warp AI (Terminal)',
    rank: 33,
    group: 'terminal-cli',
    pricing: 'freemium',
    officialUrl: 'https://www.warp.dev',
    badge: 'تێرمیناڵی نەوەی نوێ ⚡',
    tagline: {
      ckb: 'تێرمیناڵی مۆدێرن بە شێوازی IDE بە GPU ئەکسێلەرەیتکراو لەگەڵ زیرەکی دەستکرد بۆ ڕوونکردنەوەی هەڵەکان',
      en: 'The modern, Rust-based, GPU-accelerated terminal with built-in AI assistance',
    },
    coreJob: {
      ckb: 'گۆڕینی زمانی سروشتی بۆ فەرمانی تێرمیناڵی دروست (Bash, Zsh, PowerShell)، شیکردنەوەی هەڵەی کۆماندەکان، و گەڕان لە مێژوو.',
      en: 'Natural language terminal command generation, live error debugging, and collaborative shell workflows.',
    },
    description: {
      ckb: 'وارپ تێرمیناڵی کلاسیکی گۆڕی بۆ ئامرازێکی سەردەمیانە. کاتێک فەرمانێک هەڵە دەبێت، دوگمەیەک دادەگریت و AI بە کورتی پێت دەڵێت چۆن چاکی بکەیتەوە و فەرمانی دروستت بۆ دادەنێت.',
      en: 'Warp combines high-performance Rust architecture with native AI command prediction and interactive multi-line terminal blocks.',
    },
    whyBestForDevs: {
      ckb: 'ئیتر پێویست ناکات فەرمانە دوورودرێژ و ئاڵۆزەکانی وەک Docker، Git، و Kubernetes لەبەر بکەیت.',
      en: 'No more memorizing obscure regex or flags for grep, tar, or kubectl; prompt in plain language directly in the command prompt.',
    },
    keyFeatures: ['Warp AI inline agent', 'Block-based terminal architecture', 'Workflows shared snippets', 'Rust-based 60fps rendering'],
    tags: ['#Warp', '#Terminal', '#CLI', '#Rust'],
  },

  // 34. Mintlify
  {
    id: 'mintlify',
    name: 'Mintlify',
    rank: 34,
    group: 'docs-search',
    pricing: 'freemium',
    officialUrl: 'https://mintlify.com',
    badge: 'پاشای دۆکیومێنتاسیۆنی مۆدێرن 📚',
    tagline: {
      ckb: 'دروستکردنی دۆکیومێنت و بەڵگەنامەی پرۆگرامینگ بە دیزاینی سەرنجڕاکێش و بەخۆکاری لە کۆدەکەتەوە',
      en: 'The modern documentation platform built for developers, powered by AI maintenance',
    },
    coreJob: {
      ckb: 'خوێندنەوەی کۆدبەیزی پڕۆژەکەت، نووسینی بەڵگەنامەی ڕوون لەسەر API، دروستکردنی نموونەی کۆد و بەستنەوە بە گیت‌هەب.',
      en: 'Automated documentation synthesis from code comments, OpenAPI specs, and interactive code playgrounds.',
    },
    description: {
      ckb: 'مینتلیفای لەلایەن گەورەترین کۆمپانیاکانی تەکنەلۆژیا بەکاردەهێنرێت بۆ نووسینی پەیجی دۆکیومێنت (وەک Stripe یان Anthropic). کاتێک کۆدەکەت نوێ دەکەیتەوە، دۆکیومێنتەکە خۆی نوێ دەبێتەوە.',
      en: 'Mintlify automatically generates and synchronizes world-class developer documentation directly from code repositories and OpenAPI definitions.',
    },
    whyBestForDevs: {
      ckb: 'بێزاری نووسینی دەستیی دۆکیومێنت ناهێڵێت و دیزاینەکەی هەمیشە وەک پڕۆژەی ملیۆن دۆلاری دەردەکەوێت.',
      en: 'Eliminates documentation rot with automated PRs that keep API guides updated as codebase evolves.',
    },
    keyFeatures: ['MDX interactive components', 'AI automated doc generation', 'Git synchronization', 'API playground testing'],
    tags: ['#Mintlify', '#Documentation', '#API', '#DeveloperExperience'],
  },

  // 35. Pieces for Developers
  {
    id: 'pieces-app',
    name: 'Pieces for Developers',
    rank: 35,
    group: 'coding-ide',
    pricing: 'free',
    officialUrl: 'https://pieces.app',
    badge: 'یادگەی هۆشمەندی کۆدەکانت 🧩',
    tagline: {
      ckb: 'بەڕێوەبەری کۆدە بچووکەکان (Snippets) بە مۆدێلی ئۆن-دیڤایس کە بیرگەی هەموو ئیشەکانت لەخۆدەگرێت',
      en: 'On-device AI copilot and snippet manager that captures full developer workflow context',
    },
    coreJob: {
      ckb: 'خەزنکردن و پۆلێنکردنی کۆدە بەسوودەکان بە شێوەی خۆکار لەگەڵ تاگ و ڕوونکردنەوە و بەستنەوەی نێوان ئیدیتۆر و وێبگەڕ.',
      en: 'Context-aware snippet capture, code extraction from screenshots, and multi-IDE synchronization.',
    },
    description: {
      ckb: 'پیسیز بە تەواوی لەسەر کۆمپیوتەری خۆت کاردەکات. هەر کۆدێک کۆپی دەکەیت یان کاری لەسەر دەکەیت دەتوانێت بە هۆشمەندی بیپارێزێت و دواتر بە گەڕانێکی سادە پێشکەشت بکات.',
      en: 'Pieces runs on-device neural engines to index developer snippets, terminal traces, and browser lookups into a unified personal memory graph.',
    },
    whyBestForDevs: {
      ckb: 'دەتوانیت لە ڕێگەی OCR ڕاستەوخۆ لەناو ڤیدیۆ یان وێنەیەک کۆد دەربهێنیت بەبێ نووسینەوە.',
      en: 'Seamless screenshot-to-code OCR and completely local execution for zero data-leak security.',
    },
    keyFeatures: ['On-device local processing', 'Screenshot to code OCR', 'Deep integrations with Chrome, VS Code, JetBrains', 'Auto-tagging & metadata generation'],
    tags: ['#Pieces', '#Snippets', '#Productivity', '#LocalAI'],
  },

  // 36. Postman Postbot
  {
    id: 'postman-postbot',
    name: 'Postman Postbot',
    rank: 36,
    group: 'review-testing',
    pricing: 'freemium',
    officialUrl: 'https://www.postman.com/product/postbot',
    badge: 'یاریدەدەری فەرمی API 📬',
    tagline: {
      ckb: 'یاریدەدەری ژیری دەستکرد لەناو پۆستمان بۆ نووسینی تێستی API و دۆکیومێنت بە زمانی ئاسایی',
      en: 'AI assistant inside Postman to design, test, and document APIs with natural language',
    },
    coreJob: {
      ckb: 'نووسینی سکریپتی تاقیکردنەوەی API، دروستکردنی داتای درۆینە (Mocks)، و ڕوونکردنەوەی وەڵامەکانی ڕاژەکار.',
      en: 'Automated API test scripting, mock data generation, response debugging, and documentation drafting.',
    },
    description: {
      ckb: 'پۆستبۆت ڕاستەوخۆ لەناو بەرنامەی بەناوبانگی Postman کاردەکات. بە پێدانی ڕستەیەکی وەک "دڵنیابەوە کۆدی ٢٠٠ دەگەڕێتەوە و تۆکنەکە بوونی هەیە"، هەموو سکریپتی پشکنینەکەت بۆ دەنووسێت.',
      en: 'Postbot simplifies API workflows by letting engineers generate test suites and analyze responses without manual JavaScript test boilerplate.',
    },
    whyBestForDevs: {
      ckb: 'نووسینی تێست لە پۆستمان کە پێشتر کاتێکی زۆری دەویست، ئێستا لە چەند چرکەیەکدا تەواو دەبێت.',
      en: 'Saves backend engineers hours of writing repetitive assertions and mocking structures.',
    },
    keyFeatures: ['Instant test generation', 'Visualization of response data', 'Automated mock servers', 'API payload documentation'],
    tags: ['#Postman', '#Postbot', '#APITesting', '#Backend'],
  },

  // 37. Blackbox AI
  {
    id: 'blackbox-ai',
    name: 'Blackbox AI',
    rank: 37,
    group: 'coding-ide',
    pricing: 'freemium',
    officialUrl: 'https://www.blackbox.ai',
    badge: 'خێرا و ئاسان بۆ دەرهێنانی کۆد 📦',
    tagline: {
      ckb: 'پلاتفۆرمی خێرای گەڕان بەدوای کۆد و دەرهێنانی دەقی کۆد لەناو ڤیدیۆکانی یوتیوب و وێنەکاندا',
      en: 'Fast code search, video code extraction, and multi-model coding assistant',
    },
    coreJob: {
      ckb: 'دەرهێنانی دەستبەجێی کۆد لە ناو وانە ڤیدیۆییەکان و وێنەکان، لەگەڵ وەڵامدانەوەی خێرای پرسیارەکانی پرۆگرامینگ.',
      en: 'Extracts code from YouTube tutorials, images, and provides real-time web code completion.',
    },
    description: {
      ckb: 'بلاکبۆکس لەلایەن چەندین ملیۆن خوێندکار و پرۆگرامەرەوە بەکاردەهێنرێت بۆ بینینی کۆدەکان لە کاتی سەیرکردنی وانەکانی ئۆنلاین بەبێ پێویستی بە دووبارە نووسینەوەیان.',
      en: 'Blackbox AI specializes in fast developer question answering and optical character recognition for educational video streams.',
    },
    whyBestForDevs: {
      ckb: 'بۆ فێربوون و دەرهێنانی کۆدی سەر شاشە کاتێکی زۆرت بۆ دەگەڕێنێتەوە.',
      en: 'High-speed OCR specifically trained on code font ligatures and IDE syntax highlighting.',
    },
    keyFeatures: ['Video to code extraction', 'Code autocomplete in browser', 'Fast multi-language generation', 'Repo code search'],
    tags: ['#Blackbox', '#OCR', '#VideoToCode', '#Learning'],
  },

  // 38. Augment Code
  {
    id: 'augment-code',
    name: 'Augment Code',
    rank: 38,
    group: 'coding-ide',
    pricing: 'paid',
    officialUrl: 'https://www.augmentcode.com',
    badge: 'تایبەت بە کۆدبەیزی ئەندازیاری باڵا 🚀',
    tagline: {
      ckb: 'ئیدیتۆری پێشکەوتووی پەرەپێدەران بە تەکنەلۆژیای دەگمەنی هێنانەوەی کۆدی ئینتەرپرایز',
      en: 'The developer AI platform built for large, complex enterprise codebases',
    },
    coreJob: {
      ckb: 'ئیندێکسکردنی کۆدبەیزی قەبارە زەبەلاح بە چەند میلیچرکەیەک بەبێ خاوبوونەوە و دابینکردنی چاتی تەواو ئاگادار لە سیستەمەکە.',
      en: 'Ultra-fast sub-second semantic retrieval across repositories containing tens of millions of lines of code.',
    },
    description: {
      ckb: 'ئۆگمێنت لەلایەن وەبەرهێنەرە گەورەکانی وەک سوتەر هێڵ پشتگیری دەکرێت و بە تایبەتی بۆ ئەو تیمە ئەندازیارییانە دروستکراوە کە ڕووبەڕووی ڕیپۆزیتۆرییە ملیۆن دێڕییەکان دەبنەوە و ئامرازەکانی تر تێیدا پەکدەخەن.',
      en: 'Augment indexes complex monorepos into proprietary graph-vector stores, ensuring AI recommendations stay grounded in company-wide code patterns.',
    },
    whyBestForDevs: {
      ckb: 'هیچ کات پڕۆژە گەورەکان خاو ناکاتەوە و تەواوی ستانداردی کۆدی کۆمپانیاکەت ڕەچاو دەکات.',
      en: 'Handles massive enterprise scale where other tools fail due to context window saturation.',
    },
    keyFeatures: ['Instant whole-repo indexing', 'Accurate cross-file dependency maps', 'Strict security & isolation', 'Zero false-refactor suggestions'],
    tags: ['#AugmentCode', '#EnterpriseScale', '#Monorepo', '#FastSearch'],
  },

  // 39. JetBrains AI Assistant
  {
    id: 'jetbrains-ai',
    name: 'JetBrains AI Assistant',
    rank: 39,
    group: 'coding-ide',
    pricing: 'paid',
    officialUrl: 'https://www.jetbrains.com/ai',
    badge: 'هاوڕێی ڕاستەقینەی IntelliJ و WebStorm 💎',
    tagline: {
      ckb: 'ئاوێتەکراوی تەواو لەگەڵ هەموو IDEیە بەناوبانگەکانی JetBrains (PyCharm, WebStorm, IDEA, GoLand)',
      en: 'Deeply integrated AI across the entire suite of JetBrains development IDEs',
    },
    coreJob: {
      ckb: 'نووسینی کۆد، تەلارسازی بەپێی تایپەکانی زمانەکە (Type Awareness)، نووسینی لێدوانی گیت و دروستکردنی فایلی پشکنین.',
      en: 'Deep AST-aware code refactoring, context-driven completions, and automated commit message generation.',
    },
    description: {
      ckb: 'ئەگەر لەسەر ئیدیتۆرەکانی جێت‌برەینز کاردەکەیت، ئەم ئامرازە ڕاستەوخۆ دەستڕاگەیشتنی بە شیکەرەوەی ناوخۆیی (Language Server Protocol) هەیە و هەڵەی تێگەیشتن لە جۆری داتاکان ناکات.',
      en: 'JetBrains AI Assistant leverages JetBrains’ industry-leading code PSI (Program Structure Interface) for unmatched type precision.',
    },
    whyBestForDevs: {
      ckb: 'پەیوەندی بە هەموو فەرمانەکانی دەستکاری و ڕیفاکتەرکردنی تایبەت بە جێت‌برەینزەوە هەیە.',
      en: 'Seamless integration with built-in JetBrains debuggers, test runners, and refactoring utilities.',
    },
    keyFeatures: ['PSI tree-based type intelligence', 'Commit message generation', 'Multi-IDE ecosystem coverage', 'Seamless documentation search'],
    tags: ['#JetBrains', '#IntelliJ', '#WebStorm', '#PyCharm'],
  },

  // 40. Mistral Codestral
  {
    id: 'mistral-codestral',
    name: 'Mistral Codestral',
    rank: 40,
    group: 'chat-reasoning',
    pricing: 'open_source',
    officialUrl: 'https://mistral.ai/news/codestral',
    badge: 'شارەزای زیاتر لە ٨٠ زمانی کۆد 🌪️',
    tagline: {
      ckb: 'مۆدێلی تایبەتمەندی فەڕەنسی ڕاهێنراو تەنها لەسەر کۆد بە توانای پڕکردنەوە لە ناوەڕاستدا (Fill-in-the-Middle)',
      en: 'Open-weight generative AI model explicitly designed for code generation tasks across 80+ languages',
    },
    coreJob: {
      ckb: 'تەواوکردنی کۆد، پڕکردنەوەی کەلێنەکانی نێوان دوو بەشی کۆد (FIM)، و نووسینی فەنکشنی خێرا لە هەموو زمانەکاندا.',
      en: 'High-speed code completion and Fill-in-the-Middle (FIM) operations supporting 80+ programming languages.',
    },
    description: {
      ckb: 'کۆدسترال بەرهەمی کۆمپانیای Mistral AIیە. خێراییەکی زۆری هەیە و بە تایبەتی لە زمانە باوەکانی وەک پایتۆن، جاڤاسکریپت، C++، ڕەست، و گۆ نمرەی زۆر بەرزی هەیە.',
      en: 'Codestral was pre-trained from scratch on high-quality source code, providing specialized 22B and 2501 variations that punch far above their parameter weight.',
    },
    whyBestForDevs: {
      ckb: 'توانای هەیە لە ناوەڕاستی فایلێکدا کە دوو بەشی پێشوو و پاشووی نووسراوە، بە تەواوی ئەو بەشەی نێوان دەستنیشان بکات.',
      en: 'Superior Fill-in-the-Middle (FIM) mastery makes it the ultimate open engine for tab-autocomplete extensions.',
    },
    keyFeatures: ['Fill-in-the-Middle (FIM) native', '80+ programming languages', '32k context window', 'Permissive research & dev license'],
    tags: ['#Codestral', '#Mistral', '#FIM', '#OpenWeights'],
  },

  // 41. OpenAI ChatGPT Plus (o1 & o3-mini)
  {
    id: 'chatgpt-o1-o3',
    name: 'OpenAI ChatGPT (o1 & o3-mini)',
    rank: 41,
    group: 'chat-reasoning',
    pricing: 'freemium',
    officialUrl: 'https://chatgpt.com',
    badge: 'لووتکەی شیکاری بیرکردنەوە 🧠',
    tagline: {
      ckb: 'مۆدێلی بەهێزی زنجیرەی بیرکردنەوە (Chain of Thought) بۆ ئەلگۆریزمی زۆر قورس و پێشبڕکێکانی پرۆگرامینگ',
      en: 'Frontier reasoning models designed to spend more time thinking before answering programming puzzles',
    },
    coreJob: {
      ckb: 'دیزاینکردنی سیستەم، داڕشتنی ئەلگۆریزمی پێشکەوتوو (وەک لە پێشبڕکێکانی Codeforces و LeetCode)، و شیکردنەوەی هاوکێشەی ماتماتیکی.',
      en: 'Complex algorithm formulation, architectural trade-off evaluation, and competitive programming solutions.',
    },
    description: {
      ckb: 'مۆدێلەکانی o1 و o3-miniی ئۆپن ئەی ئای کاتێکی زیاتر بیر دەکەنەوە پێش وەڵامدانەوە. ئەمەش دەبێتە هۆی ئەوەی کێشە زۆر ئاڵۆزەکان بە هەنگاو بە هەنگاو شیکار بکەن بەبێ ئەوەی هەڵەی سەرەتایی بکەن.',
      en: 'OpenAI o1 and o3-mini employ hidden chains of thought to plan, backtrack, and rigorously test code logic before outputting solutions.',
    },
    whyBestForDevs: {
      ckb: 'بۆ ئەو کێشانەی کە هیچ مۆدێلێکی تر نەیتوانیوە چارەسەری بکات، o1 توانای بینینی لۆجیکەکەی هەیە بە چەند چرکە بیرکردنەوە.',
      en: 'Cracks difficult algorithmic tasks and concurrency race conditions that stump traditional single-turn LLMs.',
    },
    keyFeatures: ['Chain of Thought internal reasoning', 'LeetCode Hard mastery', 'System architecture design', 'Code interpreter live sandbox'],
    tags: ['#OpenAI', '#o1', '#o3mini', '#Reasoning'],
  },

  // 42. PR-Agent by Qodo
  {
    id: 'pr-agent',
    name: 'Qodo PR-Agent',
    rank: 42,
    group: 'review-testing',
    pricing: 'open_source',
    officialUrl: 'https://github.com/qodo-ai/pr-agent',
    githubUrl: 'https://github.com/qodo-ai/pr-agent',
    badge: 'کراوەکۆد بۆ پێداچوونەوەی Git 🤖',
    tagline: {
      ckb: 'ئەیجنتی کراوەکۆد بۆ پێداچوونەوە، پشکنین، و نووسینی دەقی بڵاوکردنەوەی PR لە GitHub, GitLab و Bitbucket',
      en: 'Open-source autonomous tool for automated pull request review and documentation',
    },
    coreJob: {
      ckb: 'نووسینی وەسفی خۆکاری PR، پێداچوونەوە بۆ کەلێنەکان، وەڵامدانەوەی پرسیاری پرۆگرامەر لەسەر کۆمێنتەکان (/review, /describe, /improve).',
      en: 'Automated PR descriptions, line-by-line review comments, /ask interactions, and changelog updates.',
    },
    description: {
      ckb: 'پی ئاڕ ئەیجنت دەتوانیت لە ڕێگەی GitHub Actions یان سێرڤەری خۆت بەخۆڕایی دایبمەزرێنیت. هەر کاتێک کەسێک PR دەکات، ئەیجنتەکە دەچێتە ناو گفتوگۆکە و هەموو کەموکوڕییەکان پیشان دەدات.',
      en: 'PR-Agent is fully open-source and customizable, supporting commands like `/review`, `/describe`, `/improve`, and `/ask` right inside PR threads.',
    },
    whyBestForDevs: {
      ckb: 'تەواو خۆڕایی و دەستکراوەیە و دەتوانیت لە ناو کۆمپانیاکەت بە ئاسانی بیبەستیتەوە بە هەر سێرڤەرێکی گیت.',
      en: 'Runs via GitHub Actions, CLI, or webhooks on self-hosted environments with custom model backends.',
    },
    keyFeatures: ['Interactive /commands in GitHub/GitLab', 'Automated PR title & description', 'Test generation on PR diffs', 'Self-hostable via Docker/Actions'],
    tags: ['#PRAgent', '#OpenSource', '#GitHubActions', '#GitLab'],
  },

  // 43. Sentry AI & Seer
  {
    id: 'sentry-ai',
    name: 'Sentry AI (Seer)',
    rank: 43,
    group: 'review-testing',
    pricing: 'freemium',
    officialUrl: 'https://sentry.io/features/ai',
    badge: 'دکتۆری هەڵە و کەوتنەکانی سیستەم 🩺',
    tagline: {
      ckb: 'سیستەمی ناسینەوە و پێشنیارکردنی چاککردنەوەی دەستبەجێ بۆ ئەو باگانەی لە پرۆدەکشندا ڕوودەدەن',
      en: 'AI-powered root-cause analysis and automated pull requests to fix production crashes',
    },
    coreJob: {
      ckb: 'شیکردنەوەی هەڵەی لاگی سێرڤەر و برۆوسەر، دۆزینەوەی سەرچاوەی باگەکە لە ناو کۆدەکەتدا، و نووسینی چارەسەر.',
      en: 'Automatic crash trace debugging, stack trace root cause analysis, and auto-generated fix pull requests.',
    },
    description: {
      ckb: 'سێنتری ناسراوترین پلاتفۆرمی مۆنیتۆرینگ و تۆمارکردنی هەڵەیە. تەکنەلۆژیای Seerی بەکاردەهێنێت کە لە کاتی کەوتنی وێبسایتێک یان سێرڤەرێک، ڕاستەوخۆ دەڵێت کام دێڕ کێشەکەی دروستکردووە و کۆدی چاککراو پیشان دەدات.',
      en: 'Sentry Seer bridges the gap between production crash monitoring and automated source code remediation.',
    },
    whyBestForDevs: {
      ckb: 'کاتی خەواندنی سیستەم و چارەسەری کارەسات لە چەند کاتژمێرێکەوە دەهێنێتە سەر چەند خولەکێک.',
      en: 'Cuts Mean Time to Resolution (MTTR) dramatically by delivering actionable fixes for crash reports.',
    },
    keyFeatures: ['Stack trace root-cause intelligence', 'Auto-fix PR generation', 'Error clustering & de-duplication', 'Production performance insights'],
    tags: ['#Sentry', '#Monitoring', '#AutoFix', '#DevOps'],
  },

  // 44. Goose by Block
  {
    id: 'goose-block',
    name: 'Goose (Block / Square)',
    rank: 44,
    group: 'terminal-cli',
    pricing: 'open_source',
    officialUrl: 'https://block.github.io/goose',
    githubUrl: 'https://github.com/block/goose',
    badge: 'ئەیجنتی تێرمیناڵی فەرمی Block 🪿',
    tagline: {
      ckb: 'ئەیجنتی کراوەکۆدی کۆمپانیای Block کە لە تێرمیناڵ دادەنیشێت و کۆمپیوتەرەکەت دەکاتە هاوکاری ئەندازیاریت',
      en: 'An open-source on-machine developer agent that supercharges your engineering workflows',
    },
    coreJob: {
      ckb: 'نووسینی سکریپت، بەستنەوەی کەرەستە و APIیە ناوخۆییەکان، دەستکاریکردنی فایل و بەڕێوەبردنی تەواوی پڕۆژە بە فەرمانی ئاسایی.',
      en: 'On-device developer agent executing multi-step tasks across terminal, editor, and custom tool extensions.',
    },
    description: {
      ckb: 'گووس لەلایەن کۆمپانیای گەورەی Block (Square & Cash App) دروستکراوە بە فەلسەفەی ئەوەی کە دەبێت هەموو پرۆگرامەرێک ئەیجنتێکی سەربەخۆی لەناو تێرمیناڵەکەی هەبێت بەبێ بەستنەوە بە کۆمپانیایەکی دیاریکراو.',
      en: 'Goose is designed to integrate into existing CLI toolchains, extending developer capabilities with tool-calling and local autonomy.',
    },
    whyBestForDevs: {
      ckb: 'تەواو کراوەکۆدە و ڕێگەت پێدەدات تۆڵزی تایبەتی خۆتی بۆ دروستبکەیت بە پرۆتۆکۆڵی کراوە.',
      en: 'Extensible architecture supporting Model Context Protocol (MCP) and custom automation tools.',
    },
    keyFeatures: ['Model Context Protocol (MCP) support', 'CLI autonomous runtime', 'Cross-platform Linux, macOS, Windows', 'Local & cloud model flexibility'],
    tags: ['#Goose', '#Block', '#TerminalAgent', '#MCP'],
  },

  // 45. Greptile
  {
    id: 'greptile',
    name: 'Greptile',
    rank: 45,
    group: 'review-testing',
    pricing: 'paid',
    officialUrl: 'https://www.greptile.com',
    badge: 'مێشکی ڕیپۆزیتۆرییە گەورەکان 🧠',
    tagline: {
      ckb: 'ئەیجنتی هۆشمەند کە تەواوی گیت‌هەب کۆدبەیزی کۆمپانیاکەت دەخوێنێتەوە بۆ پێداچوونەوە و وەڵامدانەوە',
      en: 'AI code review and codebase understanding bot indexing full enterprise repositories',
    },
    coreJob: {
      ckb: 'ئیندێکسکردنی بەردەوامی هەموو کۆمیت و لقەکانی گیت‌هەب، و بەشداریکردن لە پێداچوونەوەی PR بە تێگەیشتن لە هەموو لایەنە پەیوەندیدارەکان.',
      en: 'Continuous full-repository graph indexing to review PRs with complete understanding of complex architectures.',
    },
    description: {
      ckb: 'گریپتایل جیاوازە لە پێداچوونەوەکارە ئاساییەکان؛ کاتێک لە فایلی A دەستکاری دەکەیت، دەزانێت کە فایلی Z لە ئەوپەڕی پڕۆژەکە پێویستی بە گۆڕانکاری دەبێت و هۆشدارت پێدەدات.',
      en: 'Greptile builds a live knowledge graph of your entire codebase, reasoning across deep dependencies during every code review.',
    },
    whyBestForDevs: {
      ckb: 'ڕێگری دەکات لە تێکچوونی ئەو بەشانەی پڕۆژەکە کە پەیوەندی ناڕاستەوخۆیان هەیە بە کۆدی نوێکراوەوە.',
      en: 'Catches subtle cross-module breaking changes that human reviewers and linters routinely miss.',
    },
    keyFeatures: ['Live codebase graph indexing', 'Cross-repository dependency mapping', 'Slack / GitHub bot integration', 'Deep API analysis'],
    tags: ['#Greptile', '#CodebaseGraph', '#PRReview', '#Enterprise'],
  },

  // 46. CodeGPT
  {
    id: 'codegpt',
    name: 'CodeGPT',
    rank: 46,
    group: 'coding-ide',
    pricing: 'freemium',
    officialUrl: 'https://codegpt.ee',
    badge: 'پردی بەستنەوەی هەموو مۆدێلەکان 🔌',
    tagline: {
      ckb: 'زیادکراوی فرە-مۆدێلی ناو VS Code کە ڕێگە دەدات بە یەک کلیک مۆدێل و کلیلەکانت بگۆڕیت',
      en: 'Multi-provider AI extension connecting any LLM API directly into your code editor',
    },
    coreJob: {
      ckb: 'دابینکردنی چات و دەستکاری کۆد بە بەکارهێنانی APIی خۆت لە (OpenAI, Anthropic, Cohere, AI21, Ollama).',
      en: 'Brings custom API keys and specialized agents into VS Code with granular prompt management.',
    },
    description: {
      ckb: 'کۆد جی پی تی زیاتر لە ١ ملیۆن دابەزاندنی هەیە لە VS Code. یارمەتیت دەدات بۆ هەر ئەرکێک مۆدێلێکی تایبەت هەڵبژێریت و چات لەسەر پڕۆژەکەت بکەیت.',
      en: 'CodeGPT provides custom agent builders, team-shared prompts, and provider flexibility inside your local IDE workspace.',
    },
    whyBestForDevs: {
      ckb: 'دەتوانیت کلیلەکانی APIی کۆمپانیا یان خۆت بەکاربهێنیت بەبێ ئەوەی پارەی بەشداریکردنی زیادە بدەیت.',
      en: 'Pay only for the tokens you consume via your own direct API accounts with zero middleman markup.',
    },
    keyFeatures: ['Multi-provider API support', 'Custom AI agent store', 'Contextual code chat', 'On-premises model connection'],
    tags: ['#CodeGPT', '#BYOK', '#VSCodeExtension', '#MultiProvider'],
  },

  // 47. Plandex
  {
    id: 'plandex',
    name: 'Plandex',
    rank: 47,
    group: 'terminal-cli',
    pricing: 'open_source',
    officialUrl: 'https://plandex.ai',
    githubUrl: 'https://github.com/plandex-ai/plandex',
    badge: 'ئامرازی پلاندانانی سەختی تێرمیناڵ 📋',
    tagline: {
      ckb: 'ئامرازی تێرمیناڵی گەورە بۆ نووسین و جێبەجێکردنی پلانی ئاڵۆزی چەند فایلی بە شێوازی سەلامەت و کۆنتڕۆڵکراو',
      en: 'Terminal-based AI coding engine for complex, multi-file software engineering tasks',
    },
    coreJob: {
      ckb: 'دروستکردنی پلانێکی تەواو بۆ ئەرکێکی سەختی پرۆگرامینگ، جێبەجێکردنی گۆڕانکاری لە دەیان فایل، و پیشاندانی گۆڕانکارییەکان پێش پەسەندکردن.',
      en: 'Multi-file architectural changes with sandbox branches, visual diff reviews, and rollback checkpoints.',
    },
    description: {
      ckb: 'پلاندێکس دروستکراوە بۆ ئەوەی کاتێک داوای کارێکی گەورە دەکەیت (وەک نووسینی تەواوی سیستەمێکی پارەدان)، سەرەتا پلانی هەنگاوەکان دابنێت و کۆنترۆڵی هەموو فایلەکانت پێبدات پێش دەستکاریکردنی ڕاستەقینە.',
      en: 'Plandex runs tasks in background branches, allowing developers to review atomic diffs and revert steps cleanly without cluttering git working trees.',
    },
    whyBestForDevs: {
      ckb: 'دەتوانیت پلانەکە هەڵسەنگێنیت و ئەگەر بە دڵت نەبوو بە یەک دوگمە هەموو گۆڕانکارییەکان بگەڕێنیتەوە دواوە.',
      en: 'Isolates AI experiments in protected sandboxes, ensuring your live repository never gets corrupted by broken generated code.',
    },
    keyFeatures: ['Sandboxed branch execution', 'Visual interactive diff viewer', 'Git commit history protection', 'Long-context project reasoning'],
    tags: ['#Plandex', '#Terminal', '#MultiFile', '#SafeExecution'],
  },

  // 48. Replit Ghostwriter / Workspace
  {
    id: 'replit-core',
    name: 'Replit Core & AI Workspace',
    rank: 48,
    group: 'coding-ide',
    pricing: 'freemium',
    officialUrl: 'https://replit.com',
    badge: 'ئیکۆسیستەمی تەواوی کلاود ☁️',
    tagline: {
      ckb: 'ژینگەی گەشەپێدانی تەواو لە کلاود بە یارمەتی AI بۆ فێربوون، پەرەپێدان و بڵاوکردنەوەی خێرا',
      en: 'Collaborative cloud development environment with context-aware AI pairing',
    },
    coreJob: {
      ckb: 'پرۆگرامینگی هاوبەشی فرە-بەکارهێنەر، دیباگکردنی کلاود، و تاقیکردنەوەی خێرای پرۆژەکان لە هەر ئامێرێکەوە.',
      en: 'Real-time collaborative cloud coding, multi-language package execution, and automated deployment.',
    },
    description: {
      ckb: 'ڕێپڵیت کلاود ژینگەیەکی نموونەییە بۆ هەموو ئاستەکان؛ بەبێ ئەوەی پێویستت بە دانانی هیچ شتێک بێت لەسەر کۆمپیوتەرەکەت، یارمەتیت دەدات بە زیاتر لە ٥٠ زمان کۆد بنووسیت و بڵاویبکەیتەوە.',
      en: 'Replit provides an instant, zero-setup browser IDE equipped with interactive AI chat, terminal generation, and collaborative multiplayer sessions.',
    },
    whyBestForDevs: {
      ckb: 'لە هەر کۆمپیوتەرێک یان مۆبایلێک بیت، هەمان پڕۆژەکەت لەبەردەستە لەگەڵ زیرەکی دەستکرددا.',
      en: 'Ubiquitous cross-device access with integrated web hosting and instant database provisioning.',
    },
    keyFeatures: ['Multiplayer live collaboration', 'Zero local installation', 'Built-in container runtime', 'AI explain & debug'],
    tags: ['#Replit', '#CloudIDE', '#Multiplayer', '#Education'],
  },

  // 49. Morph / Magic.dev
  {
    id: 'magic-dev',
    name: 'Magic.dev & Morph',
    rank: 49,
    group: 'autonomous-agents',
    pricing: 'paid',
    officialUrl: 'https://magic.dev',
    badge: 'نەوەی داهاتووی کۆنتێکست (100M Tokens) 🔮',
    tagline: {
      ckb: 'کۆمپانیای لێکۆڵینەوەی پێشەنگ کە کار لەسەر مۆدێلی زەبەلاحی ١٠٠ ملیۆن تۆکن دەکات بۆ تەواوی سیستەم',
      en: 'Frontier AI research creating superintelligent software engineers with 100M+ token context',
    },
    coreJob: {
      ckb: 'تێگەیشتنی یەکجارەکی لە ملیۆنان فایلی گەورەترین سیستمەکانی جیهان و پێشبینیکردنی تەواوی نەرمەکاڵا بە شێوازی سەربەخۆ.',
      en: 'Synthesizing complex multi-repo architectures by ingesting millions of lines of code into a single context window.',
    },
    description: {
      ckb: 'ماجیک دێڤ یەکێکە لە پڕ وەبەرهێنراوترین کۆمپانیاکانی جیهان کە سەرقاڵی دروستکردنی مۆدێلی "LTM-2-mini"یە بە پەنجەرەی ١٠٠ ملیۆن تۆکن؛ توانای هەیە تەواوی کتێبخانە و سیستمە گەورەکان لە یەک چرکەدا شیبکاتەوە.',
      en: 'Magic is pioneering ultra-long-context neural architectures designed to understand entire software organizations and legacy systems in a single pass.',
    },
    whyBestForDevs: {
      ckb: 'نوێنەرایەتی داهاتووی پرۆگرامینگ دەکات کە تێیدا هیچ کێشەیەکی لەبیرچوونەوە یان پچڕانی زانیاری نابێت.',
      en: 'Eliminates RAG chunking artifacts by keeping the entire corporate codebase in active attention memory.',
    },
    keyFeatures: ['100M token Ultra-long context', 'LTM neural architecture', 'Enterprise-first security', 'Frontier engineering synthesis'],
    tags: ['#MagicDev', '#FutureOfCode', '#100MTokens', '#FrontierAI'],
  },

  // 50. KARÊJAN AI (Official Kurdish Programming Copilot)
  {
    id: 'karejan-ai',
    name: 'KARÊJAN AI (کاڕێژان)',
    rank: 50,
    group: 'coding-ide',
    pricing: 'free',
    officialUrl: 'https://karejan.dev',
    badge: 'پلاتفۆرمی نیشتمانی کوردی 🌟',
    tagline: {
      ckb: 'یاریدەدەری فەرمی کوردی لەناو پلاتفۆرمی کاڕێژان بە تێگەیشتنی تەواو لە زمانی کوردی (سۆرانی و بادینی) و تاقیگەی کۆد',
      en: 'The national Kurdish-native AI copilot and live learning tutor embedded inside the KARÊJAN platform',
    },
    coreJob: {
      ckb: 'فێرکردنی پرۆگرامینگ بە زمانی کوردی، دیباگکردنی ڕاستەوخۆ لەناو تاقیگەی کۆدی کاڕێژان، ڕوونکردنەوەی هەڵەکان، و بەستنەوە بە کۆرس و پرسیاری ڕۆژ.',
      en: 'Kurdish-native code explanation, sandbox debugging, algorithmic tutoring, and daily challenge guidance.',
    },
    description: {
      ckb: 'کاڕێژان ئەی ئای تایبەت دروستکراوە بۆ گەنجان و فێرخوازانی کوردستان. پێویست ناکات بە ئینگلیزی پرسیار بکەیت؛ دەتوانیت بە کوردییەکی زۆر پاک پرسیاری هەڵەی کۆدەکەت بکەیت، ڕێنمایی لەسەر تەکنەلۆژیا وەربگریت، و کۆدەکە ڕاستەوخۆ لە تاقیگەکەدا تاقی بکەیتەوە.',
      en: 'KARÊJAN AI brings frontier programming capabilities directly to Kurdish learners in Sorani and Badini, bridging the global tech language divide with native educational context.',
    },
    whyBestForDevs: {
      ckb: 'یەکەم سیستەمی زیرەکی دەستکردە کە بە تایبەتی لەسەر شێوازی فێربوونی پرۆگرامەرانی کورد و زمانەکانی (HTML, CSS, JS, React, Python, C++) ڕاهێنراوە و بەستراوەتەوە بە پلاتفۆرمی فەرمی کاڕێژان.',
      en: '100% optimized for Kurdish software education with direct playground execution and curriculum alignment.',
    },
    keyFeatures: ['Kurdish native comprehension (Sorani & Badini)', 'Integrated live sandbox runner', 'Zero external dependencies', 'Daily challenge coaching'],
    tags: ['#KarejanAI', '#Kurdish', '#Education', '#NationalPlatform', '#Free'],
  },
];

export const TOP_50_AI_TOOLS: TopAiTool[] = RAW_TOP_50_AI_TOOLS.map((tool) => {
  const extra = TOP_50_TOOLS_I18N[tool.id];
  if (!extra) return tool;
  return {
    ...tool,
    badges: extra.badges,
    tagline: { ...tool.tagline, ...extra.tagline },
    coreJob: { ...tool.coreJob, ...extra.coreJob },
    description: { ...tool.description, ...extra.description },
    whyBestForDevs: { ...tool.whyBestForDevs, ...extra.whyBestForDevs },
  };
});
