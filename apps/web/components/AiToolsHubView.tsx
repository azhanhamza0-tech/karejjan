import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Check,
  Copy,
  Terminal,
  Cpu,
  Layers,
  Bot,
  Code2,
  ShieldCheck,
  SearchCode,
  Zap,
  Filter,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { TOP_50_AI_TOOLS, TopAiTool, AiToolGroup, AiPricing } from '../data/top50AiTools';
import { useApp } from '../context/AppContext';
import { pickLoc } from '../i18n/translations';
import type { Locale } from '../types/domain';

function locField(field: { ckb: string; en: string; kmr?: string; ar?: string }, locale: Locale): string {
  if (locale === 'ckb') return field.ckb;
  if (locale === 'kmr') return field.kmr || field.ckb;
  if (locale === 'ar') return field.ar || field.en;
  return field.en;
}

const GROUP_LABELS: Record<
  AiToolGroup,
  { labels: Record<Locale, string>; icon: React.ComponentType<{ className?: string }> }
> = {
  'coding-ide': {
    labels: {
      ckb: 'ئیدیتۆر و یاریدەدەری کۆد',
      kmr: 'ئیدیتۆر و هاریکارێ کۆدی',
      ar: 'محررات الكود و IDE',
      en: 'Coding IDE & Editors',
    },
    icon: Code2,
  },
  'autonomous-agents': {
    labels: {
      ckb: 'ئەیجنتە سەربەخۆکان',
      kmr: 'ئەجێنتێن سەربەخۆ',
      ar: 'الوكلاء المستقلون',
      en: 'Autonomous Agents',
    },
    icon: Bot,
  },
  'chat-reasoning': {
    labels: {
      ckb: 'مۆدێلی شیکاری و بیرکردنەوە',
      kmr: 'مۆدێلێن شیکاری و هزرکرنێ',
      ar: 'نماذج التحليل والتفكير',
      en: 'Reasoning Models & Chat',
    },
    icon: Sparkles,
  },
  'frontend-ui': {
    labels: {
      ckb: 'دروستکردنی UI و وێب',
      kmr: 'چێکرنا UI و وێبێ',
      ar: 'بناء الواجهات والويب',
      en: 'Frontend & UI Generation',
    },
    icon: Layers,
  },
  'terminal-cli': {
    labels: {
      ckb: 'تێرمیناڵ و شێڵ',
      kmr: 'تێرمینال و شێل',
      ar: 'أدوات الطرفية و CLI',
      en: 'Terminal & CLI Agents',
    },
    icon: Terminal,
  },
  'local-models': {
    labels: {
      ckb: 'مۆدێلی لۆکاڵ و ئۆفلاین',
      kmr: 'مۆدێلێن لۆکاڵ و ئۆفلاین',
      ar: 'النماذج المحلية والأوفلاين',
      en: 'Local & Offline LLMs',
    },
    icon: Cpu,
  },
  'review-testing': {
    labels: {
      ckb: 'پشکنینی کۆد و تێست',
      kmr: 'پشکنینا کۆدی و تێست',
      ar: 'مراجعة الكود والاختبار',
      en: 'Testing & Code Review',
    },
    icon: ShieldCheck,
  },
  frameworks: {
    labels: {
      ckb: 'فڕەیمۆرکی دروستکردنی AI',
      kmr: 'فرەیموۆرکێن ئاڤاکرنا AI',
      ar: 'أُطر عمل الذكاء الاصطناعي',
      en: 'Agent Frameworks',
    },
    icon: Zap,
  },
  'docs-search': {
    labels: {
      ckb: 'گەڕان لە بەڵگەنامە و API',
      kmr: 'لێگەڕیان د بەڵگەنامە و API دا',
      ar: 'البحث في الوثائق و API',
      en: 'Documentation & Search',
    },
    icon: SearchCode,
  },
};

const PRICING_LABELS: Record<AiPricing, Record<Locale, string>> = {
  free: { ckb: 'بێبەرامبەر (Free)', kmr: 'بێبەرامبەر (Free)', ar: 'مجاني (Free)', en: 'Free' },
  open_source: { ckb: 'کراوەکۆد (Open Source)', kmr: 'کۆدڤەکری (Open Source)', ar: 'مفتوح المصدر', en: 'Open Source' },
  freemium: { ckb: 'Freemium', kmr: 'Freemium', ar: 'مجاني جزئياً (Freemium)', en: 'Freemium' },
  paid: { ckb: 'بە پارە (Paid)', kmr: 'ب پارە (Paid)', ar: 'مدفوع (Paid)', en: 'Paid' },
};

export const AiToolsHubView: React.FC = () => {
  const { locale, setActiveView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<AiToolGroup | 'all'>('all');
  const [selectedPricing, setSelectedPricing] = useState<AiPricing | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    return TOP_50_AI_TOOLS.filter((tool) => {
      if (selectedGroup !== 'all' && tool.group !== selectedGroup) return false;
      if (selectedPricing !== 'all' && tool.pricing !== selectedPricing) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const inName = tool.name.toLowerCase().includes(q);
        const inTagline = locField(tool.tagline, locale).toLowerCase().includes(q) || tool.tagline.en.toLowerCase().includes(q);
        const inCore = locField(tool.coreJob, locale).toLowerCase().includes(q) || tool.coreJob.en.toLowerCase().includes(q);
        const inDesc = locField(tool.description, locale).toLowerCase().includes(q) || tool.description.en.toLowerCase().includes(q);
        const inTags = tool.tags.some((t) => t.toLowerCase().includes(q));
        return inName || inTagline || inCore || inDesc || inTags;
      }
      return true;
    });
  }, [searchQuery, selectedGroup, selectedPricing, locale]);

  const handleCopy = (tool: TopAiTool) => {
    const coreLabel = pickLoc(locale, {
      ckb: 'کارە سەرەکییەکەی:',
      kmr: 'کارێ سەرەکی:',
      ar: 'المهمة الأساسية:',
      en: 'Core Job:',
    });
    const siteLabel = pickLoc(locale, {
      ckb: 'ماڵپەڕ:',
      kmr: 'مالپەڕ:',
      ar: 'الموقع الرسمي:',
      en: 'Official URL:',
    });
    const text = `${tool.name} (Rank #${tool.rank})\n${locField(tool.tagline, locale)}\n${coreLabel} ${locField(tool.coreJob, locale)}\n${siteLabel} ${tool.officialUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedId(tool.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      {/* Editorial Hero Header Band matching dist.zip */}
      <section className="kj-hero-band">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 text-start">
          <div className="max-w-4xl space-y-4">
            <div className="kj-eyebrow">
              <span className="kj-eyebrow-dot" />
              <span>
                {pickLoc(locale, {
                  ckb: 'پێڕستی هەڵبژێردراوی ٢٠٢٥ - ٢٠٢٦ · TOP 50 AI HUB',
                  kmr: 'لیستا هەلبژارتی ٢٠٢٥ - ٢٠٢٦ · TOP 50 AI HUB',
                  ar: 'الدليل المختار ٢٠٢٥ - ٢٠٢٦ · TOP 50 AI HUB',
                  en: 'CURATED DEVELOPER DIRECTORY · TOP 50 AI HUB',
                })}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--kj-ink)] sm:text-4xl lg:text-5xl">
              {pickLoc(locale, {
                ckb: 'باشترین ٥٠ ئامراز، ئەیجنت و چاتبۆتی AI بۆ پرۆگرامەران',
                kmr: 'باشترین ٥٠ ئامراز، ئەجێنت و چاتبۆتێن AI بۆ پرۆگرامسازان',
                ar: 'أفضل ٥٠ أداة ووكيل ذكاء اصطناعي للمبرمجين',
                en: 'TOP 50 AI Tools & Agents for Developers',
              })}
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-[var(--kj-muted-2)]">
              {pickLoc(locale, {
                ckb: 'کۆمەڵەیەکی دەوڵەمەند و پوختەکراو لە زیرەکترین و کاریگەرترین ئامرازەکانی زیرەکی دەستکرد لە جیهاندا؛ بە تەواوی ڕوونکردنەوەی فەرمی، کارە سەرەکییەکەیان و هۆکاری سەرکەوتووییان بۆ هەموو گەشەپێدەرێکی نەرمەکاڵا.',
                kmr: 'کۆمەڵەکا دەوڵەمەند و پوخت ژ زیرەکترین ئامرازێن AI د جیهانێ دا، دگەل شیکرنا کارێ وان یێ سەرەکی و سەدەمێن سەرکەفتنێ بۆ پرۆگرامسازان.',
                ar: 'دليل شامل ومنتقى لأقوى ٥٠ أداة ووكيل ذكاء اصطناعي للمبرمجين مع شرح المهمة الأساسية ومميزات كل أداة.',
                en: 'A curated directory of the 50 most essential, battle-tested AI tools, autonomous coding agents, and frontier models empowering modern software engineers.',
              })}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-1.5 font-semibold text-[var(--kj-ink)]">
                <CheckCircle2 className="h-4 w-4 text-[var(--kj-green)]" />
                <span>
                  {pickLoc(locale, {
                    ckb: '٥٠ ئامرازی تاقیکراوە',
                    kmr: '٥٠ ئامرازێن تاقیکری',
                    ar: '٥٠ أداة مجربة',
                    en: '50 Verified Tools',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-1.5 font-semibold text-[var(--kj-ink)]">
                <Layers className="h-4 w-4 text-[var(--kj-green)]" />
                <span>
                  {pickLoc(locale, {
                    ckb: '٩ کەتەگۆری تایبەتمەند',
                    kmr: '٩ کەتەگۆریێن تایبەتمەند',
                    ar: '٩ تصنيفات متخصصة',
                    en: '9 Specialized Categories',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-1.5 font-semibold text-[var(--kj-ink)]">
                <Bot className="h-4 w-4 text-[var(--kj-green)]" />
                <span>
                  {pickLoc(locale, {
                    ckb: 'ئەیجنتە سەربەخۆکان و IDE',
                    kmr: 'ئەجێنتێن سەربەخۆ و IDE',
                    ar: 'الوكلاء المستقلون و IDEs',
                    en: 'Autonomous Agents & IDEs',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-1.5 font-semibold text-[var(--kj-ink)]">
                <Zap className="h-4 w-4 text-[var(--kj-green)]" />
                <span>
                  {pickLoc(locale, {
                    ckb: 'کۆدی کراوە (Open Source) و بێبەرامبەر',
                    kmr: 'کۆدڤەکری (Open Source) و بێبەرامبەر',
                    ar: 'مفتوح المصدر ومجاني',
                    en: 'Open Source & Free Tiers',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
        {/* Interactive Search & Filter Strip */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--kj-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={pickLoc(locale, {
                  ckb: 'گەڕان لەناو ٥٠ ئامرازەکە (ناو، کارە سەرەکییەکەی، تاگ)...',
                  kmr: 'لێگەڕیان د ناڤ ٥٠ ئامرازان دا (ناڤ، کارێ سەرەکی، تاگ)...',
                  ar: 'ابحث في ٥٠ أداة (الاسم، المهمة الأساسية، الوسوم)...',
                  en: 'Search 50 tools by name, core job, or tags...',
                })}
                className="w-full rounded-[6px] border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] py-2.5 pe-4 ps-10 text-sm text-[var(--kj-ink)] placeholder:text-[var(--kj-muted)] focus:border-[var(--kj-green)] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[var(--kj-muted)] hover:text-[var(--kj-ink)] cursor-pointer"
                >
                  {pickLoc(locale, { ckb: 'سڕینەوە', kmr: 'ژێبرن', ar: 'مسح', en: 'Clear' })}
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-medium text-[var(--kj-muted)] shrink-0">
                {pickLoc(locale, { ckb: 'نرخ:', kmr: 'بها:', ar: 'التسعير:', en: 'Pricing:' })}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPricing('all')}
                className={`rounded-[6px] border px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  selectedPricing === 'all'
                    ? 'kj-btn-primary border-transparent'
                    : 'border-[var(--kj-border)] bg-[var(--kj-card)] text-[var(--kj-muted-2)] hover:bg-[var(--kj-soft)]'
                }`}
              >
                {pickLoc(locale, { ckb: 'هەمووی', kmr: 'هەمی', ar: 'الكل', en: 'All' })} ({TOP_50_AI_TOOLS.length})
              </button>
              {(['free', 'open_source', 'freemium', 'paid'] as AiPricing[]).map((p) => {
                const count = TOP_50_AI_TOOLS.filter((t) => t.pricing === p).length;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPricing(p)}
                    className={`rounded-[6px] border px-2.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      selectedPricing === p
                        ? 'kj-btn-primary border-transparent'
                        : 'border-[var(--kj-border)] bg-[var(--kj-card)] text-[var(--kj-muted-2)] hover:bg-[var(--kj-soft)]'
                    }`}
                  >
                    {pickLoc(locale, PRICING_LABELS[p])} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--kj-border)] pb-3">
            <button
              type="button"
              onClick={() => setSelectedGroup('all')}
              className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                selectedGroup === 'all'
                  ? 'kj-btn-primary'
                  : 'text-[var(--kj-muted-2)] hover:bg-[var(--kj-soft)] hover:text-[var(--kj-ink)]'
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>
                {pickLoc(locale, {
                  ckb: 'هەموو بەشەکان',
                  kmr: 'هەمی بەش',
                  ar: 'جميع الفئات',
                  en: 'All Categories',
                })}{' '}
                ({TOP_50_AI_TOOLS.length})
              </span>
            </button>

            {(Object.keys(GROUP_LABELS) as AiToolGroup[]).map((grp) => {
              const meta = GROUP_LABELS[grp];
              const Icon = meta.icon;
              const count = TOP_50_AI_TOOLS.filter((t) => t.group === grp).length;
              const active = selectedGroup === grp;
              return (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setSelectedGroup(grp)}
                  className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'kj-badge font-bold'
                      : 'text-[var(--kj-muted-2)] hover:bg-[var(--kj-soft)] hover:text-[var(--kj-ink)]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{pickLoc(locale, meta.labels)}</span>
                  <span className="ms-0.5 font-mono text-[10px] opacity-80">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between text-xs text-[var(--kj-muted)]">
          <p>
            {pickLoc(locale, {
              ckb: `نیشاندانی ${filteredTools.length} لە کۆی ${TOP_50_AI_TOOLS.length} ئامرازی پێشەنگ`,
              kmr: `نیشاندانا ${filteredTools.length} ژ سەرجەمێ ${TOP_50_AI_TOOLS.length} ئامرازان`,
              ar: `عرض ${filteredTools.length} من أصل ${TOP_50_AI_TOOLS.length} أداة رائدة`,
              en: `Showing ${filteredTools.length} of ${TOP_50_AI_TOOLS.length} top AI tools`,
            })}
            {searchQuery && ` · "${searchQuery}"`}
          </p>
          {(searchQuery || selectedGroup !== 'all' || selectedPricing !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('all');
                setSelectedPricing('all');
              }}
              className="font-bold text-[var(--kj-green)] hover:underline cursor-pointer"
            >
              {pickLoc(locale, {
                ckb: 'پاککردنەوەی فلتەرەکان ↺',
                kmr: 'پاقژکرنا فلتەران ↺',
                ar: 'إعادة ضبط الفلاتر ↺',
                en: 'Reset Filters ↺',
              })}
            </button>
          )}
        </div>

        {/* Architectural Grid of 50 AI Tools */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const groupMeta = GROUP_LABELS[tool.group];
            const pricingLabel = pickLoc(locale, PRICING_LABELS[tool.pricing]);
            const isCopied = copiedId === tool.id;
            const isKarejan = tool.id === 'karejan-ai';
            const badgeText = tool.badges ? pickLoc(locale, tool.badges) : tool.badge;

            return (
              <div
                key={tool.id}
                className={`group relative flex flex-col justify-between rounded-[9px] border p-5 transition-colors text-start ${
                  isKarejan
                    ? 'border-[var(--kj-emerald)] bg-[var(--kj-soft)]'
                    : 'border-[var(--kj-border)] bg-[var(--kj-card)] hover:bg-[var(--kj-soft)] dark:hover:bg-[#202938]'
                }`}
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="kj-course-icon flex h-7 w-7 items-center justify-center text-xs font-bold">
                        #{tool.rank}
                      </span>
                      {badgeText && (
                        <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold kj-badge">
                          {badgeText}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center rounded border border-[var(--kj-border)] bg-[var(--kj-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--kj-muted-2)] whitespace-nowrap">
                      {pricingLabel}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h3 className="text-lg font-extrabold text-[var(--kj-ink)] group-hover:text-[var(--kj-green)] transition-colors">
                      {tool.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-[var(--kj-muted)] leading-snug">
                      {locField(tool.tagline, locale)}
                    </p>
                  </div>

                  <div className="mb-4 inline-flex items-center gap-1 rounded bg-[var(--kj-soft)] px-2 py-1 text-[11px] font-semibold text-[var(--kj-muted-2)] border border-[var(--kj-border)]">
                    <groupMeta.icon className="h-3.5 w-3.5 text-[var(--kj-green)]" />
                    <span>{pickLoc(locale, groupMeta.labels)}</span>
                  </div>

                  {/* Core Job Callout (dist.zip .lesson-callout) */}
                  <div className="kj-callout mb-4 rounded-[5px] p-3">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[var(--kj-ink)]">
                      <Zap className="h-3.5 w-3.5 text-[var(--kj-green)]" />
                      <span>
                        {pickLoc(locale, {
                          ckb: 'کارە سەرەکییەکەی (Core Job):',
                          kmr: 'کارێ سەرەکی (Core Job):',
                          ar: 'المهمة الأساسية (Core Job):',
                          en: 'Core Job:',
                        })}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed">{locField(tool.coreJob, locale)}</p>
                  </div>

                  <p className="mb-4 text-xs leading-relaxed text-[var(--kj-muted-2)]">
                    {locField(tool.description, locale)}
                  </p>

                  <div className="mb-4 text-xs">
                    <span className="font-bold text-[var(--kj-ink)]">
                      {pickLoc(locale, {
                        ckb: 'بۆچی بۆ پرۆگرامەران بێوێنەیە؟ ',
                        kmr: 'بۆچی بۆ پرۆگرامسازان نایابە؟ ',
                        ar: 'لماذا يفضّلها المبرمجون؟ ',
                        en: 'Why developers love it: ',
                      })}
                    </span>
                    <span className="text-[var(--kj-muted-2)]">{locField(tool.whyBestForDevs, locale)}</span>
                  </div>

                  <div className="mb-4 space-y-1">
                    <p className="text-[11px] font-bold text-[var(--kj-muted)]">
                      {pickLoc(locale, {
                        ckb: 'تایبەتمەندییە کلیلەکان:',
                        kmr: 'تایبەتمەندییێن سەرەکی:',
                        ar: 'المميزات الرئيسية:',
                        en: 'Key Features:',
                      })}
                    </p>
                    <ul className="space-y-1 text-xs text-[var(--kj-muted-2)]">
                      {tool.keyFeatures.map((kf, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-[var(--kj-green)] shrink-0" />
                          <span>{kf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-5 flex flex-wrap items-center gap-1">
                    {tool.tags.map((tg, i) => (
                      <span
                        key={i}
                        className="rounded border border-[var(--kj-border)] bg-[var(--kj-soft)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--kj-muted)]"
                      >
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--kj-border)] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={tool.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="kj-btn-primary inline-flex items-center gap-1.5 rounded-[5px] px-3.5 py-1.5 text-xs"
                    >
                      <span>
                        {pickLoc(locale, {
                          ckb: 'سەردانکردن',
                          kmr: 'سەرەدان',
                          ar: 'زيارة الموقع',
                          en: 'Visit Site',
                        })}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>

                    {isKarejan && (
                      <button
                        type="button"
                        onClick={() => setActiveView('ai')}
                        className="inline-flex items-center gap-1 rounded-[5px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] px-3 py-1.5 text-xs font-semibold text-[var(--kj-ink)] hover:bg-[var(--kj-elevated)] cursor-pointer"
                      >
                        <span>{pickLoc(locale, { ckb: 'چات 💬', kmr: 'چات 💬', ar: 'محادثة 💬', en: 'Open Chat 💬' })}</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(tool)}
                    title={pickLoc(locale, {
                      ckb: 'کۆپیکردنی زانیاری',
                      kmr: 'کۆپیکرنا پێزانینان',
                      ar: 'نسخ المعلومات',
                      en: 'Copy details',
                    })}
                    className="flex h-8 w-8 items-center justify-center rounded-[5px] border border-[var(--kj-border)] text-[var(--kj-muted-2)] hover:bg-[var(--kj-soft)] hover:text-[var(--kj-ink)] transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5 text-[var(--kj-green)]" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="my-16 rounded-[9px] border border-dashed border-[var(--kj-border-strong)] p-12 text-center">
            <Bot className="mx-auto h-12 w-12 text-[var(--kj-muted)]" />
            <h3 className="mt-3 text-base font-bold text-[var(--kj-ink)]">
              {pickLoc(locale, {
                ckb: 'هیچ ئامرازێک نەدۆزرایەوە بەم مەرجە',
                kmr: 'چ ئامراز ب ڤی مەرجی نەهاتنە دیتن',
                ar: 'لم يتم العثور على أي أداة مطابقة',
                en: 'No AI tools match your filters',
              })}
            </h3>
            <p className="mt-1 text-xs text-[var(--kj-muted)]">
              {pickLoc(locale, {
                ckb: 'تکایە گەڕانەکەت بگۆڕە یان فلتەری کەتەگۆری و نرخەکان لابدە.',
                kmr: 'هیڤیە لێگەڕیانا خۆ بگوهۆڕە یان فلتەران ژێ ببە.',
                ar: 'حاول تغيير كلمات البحث أو مسح الفلاتر المحددة.',
                en: 'Try adjusting your search query or clearing the category/pricing filters.',
              })}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('all');
                setSelectedPricing('all');
              }}
              className="kj-btn-primary mt-4 rounded-[6px] px-4 py-2 text-xs cursor-pointer"
            >
              {pickLoc(locale, {
                ckb: 'گەڕانەوە بۆ هەموو ٥٠ ئامرازەکە',
                kmr: 'ڤەگەڕیان بۆ هەمی ٥٠ ئامرازان',
                ar: 'عرض جميع الأدوات الـ ٥٠',
                en: 'Show All 50 AI Tools',
              })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
