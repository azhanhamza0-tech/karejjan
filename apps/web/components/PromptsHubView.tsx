import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Copy,
  Check,
  Terminal,
  Cpu,
  Layers,
  ShieldAlert,
  Zap,
  BookOpen,
  Filter,
  Flame,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { GOLDEN_PROMPTS, GoldenPrompt, PromptCategory } from '../data/promptsCatalog';
import { useApp } from '../context/AppContext';
import { pickLoc } from '../i18n/translations';
import type { Locale } from '../types/domain';

function locField(field: { ckb: string; en: string; kmr?: string; ar?: string }, locale: Locale): string {
  if (locale === 'ckb') return field.ckb;
  if (locale === 'kmr') return field.kmr || field.ckb;
  if (locale === 'ar') return field.ar || field.en;
  return field.en;
}

const CATEGORY_META: Record<
  PromptCategory,
  { labels: Record<Locale, string>; icon: React.ComponentType<{ className?: string }> }
> = {
  reasoning: {
    labels: {
      ckb: 'شیکاری و بیرکردنەوەی قووڵ',
      kmr: 'شیکاری و هزرکرنا کویر',
      ar: 'التحليل والتفكير العميق',
      en: 'Deep Reasoning',
    },
    icon: Sparkles,
  },
  learning: {
    labels: {
      ckb: 'فێربوون و ڕوونکردنەوەی سادە',
      kmr: 'فێربوون و ڕۆهنکرنا سادە',
      ar: 'التعلّم والتبسيط',
      en: 'Learning & Concept Clarity',
    },
    icon: BookOpen,
  },
  debugging: {
    labels: {
      ckb: 'دیباگکردن و پشکنینی هەڵە',
      kmr: 'دیباگکرن و پشکنینا شاشییان',
      ar: 'تتبع الأخطاء والتصحيح',
      en: 'Debugging & Diagnostics',
    },
    icon: Terminal,
  },
  refactoring: {
    labels: {
      ckb: 'خاوێنکردنەوە و ڕێکخستنی کۆد',
      kmr: 'پاقژکرن و ڕێکخستنا کۆدی',
      ar: 'إعادة الهيكلة ونظافة الكود',
      en: 'Refactoring & Clean Code',
    },
    icon: Layers,
  },
  architecture: {
    labels: {
      ckb: 'تەلارسازی و ئاستی باڵا',
      kmr: 'ئەندازیاری و تەلارسازی',
      ar: 'هندسة الأنظمة والمعمارية',
      en: 'System Architecture',
    },
    icon: Cpu,
  },
  security: {
    labels: {
      ckb: 'ئاسایش و لاوازییەکان',
      kmr: 'ئەمنیەت و لاوازی',
      ar: 'الأمن السيبراني و Red Teaming',
      en: 'Security & Red Teaming',
    },
    icon: ShieldAlert,
  },
  productivity: {
    labels: {
      ckb: 'خێرایی و بەرهەمهێنان',
      kmr: 'لەزاتی و بەرهەمداری',
      ar: 'الإنتاجية وسير العمل',
      en: 'Productivity & Workflows',
    },
    icon: Zap,
  },
};

export const PromptsHubView: React.FC = () => {
  const { locale, setActiveView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModalPrompt, setActiveModalPrompt] = useState<GoldenPrompt | null>(null);

  const getTemplate = (p: GoldenPrompt) =>
    p.promptTemplates?.[locale] || p.promptTemplates?.en || p.promptTemplate;
  const getSnippet = (p: GoldenPrompt) =>
    p.exampleSnippets?.[locale] || p.exampleSnippets?.en || p.exampleSnippet;
  const getName = (p: GoldenPrompt) => (p.names ? pickLoc(locale, p.names) : p.name);
  const getBadge = (p: GoldenPrompt) => (p.badges ? pickLoc(locale, p.badges) : p.badge);

  const filteredPrompts = useMemo(() => {
    return GOLDEN_PROMPTS.filter((prompt) => {
      if (selectedCategory !== 'all' && prompt.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const inName = getName(prompt).toLowerCase().includes(q) || prompt.name.toLowerCase().includes(q);
        const inShort = locField(prompt.shortDesc, locale).toLowerCase().includes(q) || prompt.shortDesc.en.toLowerCase().includes(q);
        const inDirective = locField(prompt.directiveExplanation, locale).toLowerCase().includes(q);
        const inWhen = locField(prompt.whenToUse, locale).toLowerCase().includes(q);
        const inTags = prompt.tags.some((t) => t.toLowerCase().includes(q));
        return inName || inShort || inDirective || inWhen || inTags;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, locale]);

  const handleCopy = (prompt: GoldenPrompt, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(getTemplate(prompt));
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTryInChat = (prompt: GoldenPrompt, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(getTemplate(prompt));
    setActiveView('ai');
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
                  ckb: 'پرۆمپتە زێڕینە تاقیکراوەکان · PROMPT DIRECTIVES',
                  kmr: 'پرۆمپتێن زێڕین یێن تاقیکری · PROMPT DIRECTIVES',
                  ar: 'الأوامر الذهبية المجربة · PROMPT DIRECTIVES',
                  en: 'GOLDEN PROMPT DIRECTIVES · THINK10X & MORE',
                })}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--kj-ink)] sm:text-4xl lg:text-5xl">
              {pickLoc(locale, {
                ckb: 'فەرمان و پرۆمپتە زێڕینەکانی AI (THINK10X, ELI5 و ٢٠ فەرمانی تر)',
                kmr: 'فەرمان و پرۆمپتێن زێڕین یێن AI (THINK10X, ELI5 و ٢٠ فەرمانێن دی)',
                ar: 'الأوامر الذهبية للذكاء الاصطناعي (THINK10X و ELI5 و ٢٠ أمراً احترافياً)',
                en: 'Golden AI Prompts & Directives (THINK10X, ELI5 & 20+ Directives)',
              })}
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-[var(--kj-muted-2)]">
              {pickLoc(locale, {
                ckb: 'ئەو دەستەواژە و فەرمانە ئەفسانەییانەی کە شێوازی وەڵامدانەوەی مۆدێلە زیرەکەکان (ChatGPT, Claude, DeepSeek, KARÊJAN AI) دەگۆڕن بۆ ئاستی ئەندازیاری باڵا؛ هەڵەکان کەم دەکەنەوە و وردبینی دەگەیەننە لووتکە.',
                kmr: 'ئەو فەرمانێن بهێز یێن کو شێوازێ بەرسڤدانا مۆدێلێن AI (ChatGPT, Claude, DeepSeek, KARÊJAN AI) دگوهۆڕن بۆ ئاستێ ئەندازیارێن بلند و شاشییان کێم دکەن.',
                ar: 'أهم الصيغ والتوجيهات البرمجية التي ترفع جودة إجابات نماذج الذكاء الاصطناعي إلى مستوى كبار المهندسين وتقلل الأخطاء.',
                en: 'The battle-tested prompting patterns, meta-prompts, and directives that unlock senior-level reasoning and zero-fluff answers from modern LLMs.',
              })}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-1.5 font-semibold text-[var(--kj-ink)]">
                <CheckCircle2 className="h-4 w-4 text-[var(--kj-green)]" />
                <span>
                  {pickLoc(locale, {
                    ckb: '٢٢ فەرمانی تاقیکراوە',
                    kmr: '٢٢ فەرمانێن تاقیکری',
                    ar: '٢٢ أمراً مجرباً',
                    en: '22 Proven Directives',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-1.5 font-semibold text-[var(--kj-ink)]">
                <Zap className="h-4 w-4 text-[var(--kj-green)]" />
                <span>
                  {pickLoc(locale, {
                    ckb: 'کاریگەری تا %٩٩',
                    kmr: 'کارتێکرن هەتا %٩٩',
                    ar: 'فعالية تصل إلى ٩٩٪',
                    en: 'Up to 99% Impact Score',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-1.5 font-semibold text-[var(--kj-ink)]">
                <Copy className="h-4 w-4 text-[var(--kj-green)]" />
                <span>
                  {pickLoc(locale, {
                    ckb: 'کۆپیکردنی دەستبەجێ بە یەک کلیک',
                    kmr: 'کۆپیکرنا بلەز ب ئێک کلیک',
                    ar: 'نسخ فوري بنقرة واحدة',
                    en: 'One-Click Copy & Chat',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
        {/* Interactive Search & Filter Controls */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--kj-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={pickLoc(locale, {
                ckb: 'گەڕان لەناو پرۆمپتەکان (ناوی فەرمانەکە، کێشە، تاگ)...',
                kmr: 'لێگەڕیان د ناڤ پرۆمپتان دا (ناڤێ فەرمانێ، ئاریشە، تاگ)...',
                ar: 'ابحث في الأوامر الذهبية (الاسم، الاستخدام، الوسوم)...',
                en: 'Search prompts by directive, use case, or tags...',
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

          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--kj-border)] pb-3">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${selectedCategory === 'all'
                  ? 'kj-btn-primary'
                  : 'text-[var(--kj-muted-2)] hover:bg-[var(--kj-soft)] hover:text-[var(--kj-ink)]'
                }`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>
                {pickLoc(locale, {
                  ckb: 'هەموو پرۆمپتەکان',
                  kmr: 'هەمی پرۆمپت',
                  ar: 'جميع الأوامر',
                  en: 'All Prompts',
                })}{' '}
                ({GOLDEN_PROMPTS.length})
              </span>
            </button>

            {(Object.keys(CATEGORY_META) as PromptCategory[]).map((cat) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta.icon;
              const count = GOLDEN_PROMPTS.filter((p) => p.category === cat).length;
              const active = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${active
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
              ckb: `نیشاندانی ${filteredPrompts.length} لە کۆی ${GOLDEN_PROMPTS.length} فەرمانی زێڕین`,
              kmr: `نیشاندانا ${filteredPrompts.length} ژ سەرجەمێ ${GOLDEN_PROMPTS.length} فەرمانێن زێڕین`,
              ar: `عرض ${filteredPrompts.length} من أصل ${GOLDEN_PROMPTS.length} أمراً ذهنياً`,
              en: `Showing ${filteredPrompts.length} of ${GOLDEN_PROMPTS.length} golden directives`,
            })}
            {searchQuery && ` · "${searchQuery}"`}
          </p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
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

        {/* Grid of Prompts */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => {
            const catMeta = CATEGORY_META[prompt.category];
            const isCopied = copiedId === prompt.id;
            const badgeText = getBadge(prompt);

            return (
              <div
                key={prompt.id}
                onClick={() => setActiveModalPrompt(prompt)}
                className="group relative flex flex-col justify-between rounded-[9px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-5 transition-colors hover:bg-[var(--kj-soft)] dark:hover:bg-[#202938] cursor-pointer text-start"
              >
                <div>
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {badgeText && (
                        <span className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-bold kj-badge">
                          {badgeText}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded border border-[var(--kj-border)] bg-[var(--kj-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--kj-muted-2)]">
                        <catMeta.icon className="h-3 w-3 text-[var(--kj-green)]" />
                        <span>{pickLoc(locale, catMeta.labels)}</span>
                      </span>
                    </div>

                    <span className="inline-flex items-center rounded px-2 py-0.5 font-mono text-[11px] font-bold kj-badge">
                      {prompt.impactScore}%
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[var(--kj-ink)] group-hover:text-[var(--kj-green)] transition-colors">
                    {getName(prompt)}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[var(--kj-muted-2)]">
                    {locField(prompt.shortDesc, locale)}
                  </p>

                  <div className="kj-callout mt-3 rounded-[5px] p-2.5 text-xs">
                    <span className="font-bold text-[var(--kj-ink)]">
                      {pickLoc(locale, {
                        ckb: 'کەی بەکاریبهێنیت؟ ',
                        kmr: 'کەنگی بکاربینی؟ ',
                        ar: 'متى تستخدمه؟ ',
                        en: 'When to use: ',
                      })}
                    </span>
                    <span>{locField(prompt.whenToUse, locale)}</span>
                  </div>

                  <div className="kj-code-window mt-3 p-3 text-[11px] line-clamp-3">
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                      {getTemplate(prompt)}
                    </pre>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    {prompt.tags.map((tg, i) => (
                      <span
                        key={i}
                        className="rounded border border-[var(--kj-border)] bg-[var(--kj-soft)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--kj-muted)]"
                      >
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--kj-border)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleCopy(prompt, e)}
                    className="kj-btn-primary inline-flex items-center gap-1.5 rounded-[5px] px-3 py-1.5 text-xs cursor-pointer"
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>
                      {isCopied
                        ? pickLoc(locale, { ckb: 'کۆپی کرا!', kmr: 'هاتە کۆپیکرن!', ar: 'تم النسخ!', en: 'Copied!' })
                        : pickLoc(locale, { ckb: 'کۆپیکردنی پرۆمپت', kmr: 'کۆپیکرنا پرۆمپتی', ar: 'نسخ الأمر', en: 'Copy Prompt' })}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleTryInChat(prompt, e)}
                    title={pickLoc(locale, {
                      ckb: 'تاقیکردنەوە لە چاتی کاڕێژان',
                      kmr: 'تاقیکرن د چاتا کاڕێژان دا',
                      ar: 'جرّبه في محادثة KARÊJAN AI',
                      en: 'Try inside KARÊJAN AI Chat',
                    })}
                    className="inline-flex items-center gap-1 rounded-[5px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] px-2.5 py-1.5 text-xs font-semibold text-[var(--kj-ink)] hover:bg-[var(--kj-elevated)] transition-colors cursor-pointer"
                  >
                    <span>{pickLoc(locale, { ckb: 'چات 💬', kmr: 'چات 💬', ar: 'محادثة 💬', en: 'AI Chat 💬' })}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="my-16 rounded-[9px] border border-dashed border-[var(--kj-border-strong)] p-12 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-[var(--kj-muted)]" />
            <h3 className="mt-3 text-base font-bold text-[var(--kj-ink)]">
              {pickLoc(locale, {
                ckb: 'هیچ پرۆمپتێک بەم ناوانە نەدۆزرایەوە',
                kmr: 'چ پرۆمپت ب ڤان ناڤان نەهاتنە دیتن',
                ar: 'لم يتم العثور على أي أوامر مطابقة',
                en: 'No matching prompts found',
              })}
            </h3>
            <p className="mt-1 text-xs text-[var(--kj-muted)]">
              {pickLoc(locale, {
                ckb: 'تکایە گەڕانەکەت بگۆڕە یان فلتەری کەتەگۆرییەکان لابدە.',
                kmr: 'هیڤیە لێگەڕیانا خۆ بگوهۆڕە یان فلتەرێ کەتەگۆریێ ژێ ببە.',
                ar: 'جرّب تغيير البحث أو إزالة فلتر الفئة.',
                en: 'Try modifying your search query or clearing category filters.',
              })}
            </p>
          </div>
        )}

        {/* Full Modal Viewer matching dist.zip dialog */}
        {activeModalPrompt && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#080c14]/75 p-4 backdrop-blur-xs"
            onClick={() => setActiveModalPrompt(null)}
          >
            <div
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[9px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] p-6 shadow-[0_24px_70px_rgba(8,12,20,0.5)] text-start"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-[var(--kj-border)] pb-4">
                <div>
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="rounded px-2 py-0.5 text-xs font-bold kj-badge">
                      {getBadge(activeModalPrompt) ||
                        pickLoc(locale, {
                          ckb: 'فەرمانی تایبەت',
                          kmr: 'فەرمانا تایبەت',
                          ar: 'توجيه خاص',
                          en: 'Pro Directive',
                        })}
                    </span>
                    <span className="font-mono text-xs font-bold text-[var(--kj-green)]">
                      {pickLoc(locale, {
                        ckb: `کاریگەری: %${activeModalPrompt.impactScore}`,
                        kmr: `کارتێکرن: %${activeModalPrompt.impactScore}`,
                        ar: `الأثر: ${activeModalPrompt.impactScore}٪`,
                        en: `Impact: ${activeModalPrompt.impactScore}%`,
                      })}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-[var(--kj-ink)]">
                    {getName(activeModalPrompt)}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalPrompt(null)}
                  className="rounded-[6px] p-1.5 text-[var(--kj-muted)] hover:bg-[var(--kj-elevated)] hover:text-[var(--kj-ink)] cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 space-y-2 text-xs leading-relaxed text-[var(--kj-muted-2)]">
                <h4 className="font-bold text-[var(--kj-green)] flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {pickLoc(locale, {
                      ckb: 'فەلسەفە و هۆکاری سەرکەوتنی ئەم فەرمانە:',
                      kmr: 'فەلسەفە و سەدەمێن سەرکەفتنا ڤێ فەرمانێ:',
                      ar: 'فلسفة وسبب فعالية هذا الأمر:',
                      en: 'Why this directive works:',
                    })}
                  </span>
                </h4>
                <p className="rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-soft)] p-3">
                  {locField(activeModalPrompt.directiveExplanation, locale)}
                </p>
              </div>

              <div className="mb-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--kj-ink)]">
                    {pickLoc(locale, {
                      ckb: 'دەقی تەواوی پرۆمپتەکە بۆ کۆپیکردن (Prompt Template):',
                      kmr: 'دەقێ تەمام یێ پرۆمپتی بۆ کۆپیکرنێ (Prompt Template):',
                      ar: 'نص الأمر الكامل للنسخ (Prompt Template):',
                      en: 'Full Copyable Prompt Template:',
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeModalPrompt)}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold kj-badge cursor-pointer"
                  >
                    {copiedId === activeModalPrompt.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>
                      {copiedId === activeModalPrompt.id
                        ? pickLoc(locale, { ckb: 'کۆپی کرا!', kmr: 'هاتە کۆپیکرن!', ar: 'تم النسخ!', en: 'Copied!' })
                        : pickLoc(locale, { ckb: 'کۆپیکردن', kmr: 'کۆپیکرن', ar: 'نسخ', en: 'Copy' })}
                    </span>
                  </button>
                </div>

                <div className="kj-code-window p-4 text-xs">
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                    {getTemplate(activeModalPrompt)}
                  </pre>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-xs font-bold text-[var(--kj-ink)]">
                  {pickLoc(locale, {
                    ckb: 'نموونەی بەکارهێنانی کرداری لە ژیانی ڕاستەقینە:',
                    kmr: 'نموونەیا بکارئینانا پراکتیکی:',
                    ar: 'مثال عملي للاستخدام:',
                    en: 'Real-world Usage Example:',
                  })}
                </span>
                <div className="kj-callout mt-1.5 rounded-[5px] p-3 text-xs">
                  <p className="font-mono text-[11px]">{getSnippet(activeModalPrompt)}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--kj-border)]">
                <button
                  type="button"
                  onClick={() => setActiveModalPrompt(null)}
                  className="rounded-[6px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] px-4 py-2 text-xs font-semibold text-[var(--kj-ink)] hover:bg-[var(--kj-elevated)] cursor-pointer"
                >
                  {pickLoc(locale, { ckb: 'داخستن', kmr: 'داخستن', ar: 'إغلاق', en: 'Close' })}
                </button>

                <button
                  type="button"
                  onClick={() => handleTryInChat(activeModalPrompt)}
                  className="kj-btn-primary inline-flex items-center gap-1.5 rounded-[6px] px-4 py-2 text-xs cursor-pointer"
                >
                  <span>
                    {pickLoc(locale, {
                      ckb: 'کۆپیکردن و کردنەوە لە چاتی کاڕێژان 💬',
                      kmr: 'کۆپیکرن و ڤەکرن د چاتا کاڕێژان دا 💬',
                      ar: 'نسخ وفتح في محادثة KARÊJAN AI 💬',
                      en: 'Copy & Open in KARÊJAN AI 💬',
                    })}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
