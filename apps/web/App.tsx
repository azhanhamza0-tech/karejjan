import React, { useEffect, useMemo, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ui/Primitives';
import { TopBar } from './components/TopBar';
import { CursorGlow } from './components/CursorGlow';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './components/HomeView';
import { AcademyView } from './components/AcademyView';
import { CodeEditorView } from './components/CodeEditorView';
import { DailyChallengeRunner } from './components/DailyChallengeRunner';
import { AiToolsHubView } from './components/AiToolsHubView';
import { PromptsHubView } from './components/PromptsHubView';
import { AiChatView } from './components/AiChatView';
import { DiscoveryView } from './components/DiscoveryView';
import { ProPurchaseView } from './components/ProPurchaseView';
import { DashboardView } from './components/DashboardView';
import { AdminView } from './components/AdminView';
import { MaintenanceView } from './components/MaintenanceView';
import { TOP_50_AI_TOOLS } from './data/top50AiTools';
import { GOLDEN_PROMPTS } from './data/promptsCatalog';
import { cleanTitle, pickLoc } from './i18n/translations';
import type { ActiveView, Locale } from './types/domain';

const TAB_NAMES_LOC: Record<Locale, Record<ActiveView, string>> = {
  ckb: {
    home: 'سەرەکی',
    academy: 'ئەکادیمیا',
    challenge: 'چاڵنجی ڕۆژ',
    aitools: 'ئامرازەکانی AI',
    prompts: 'پرۆمپتەکان',
    editor: 'تاقیگەی کۆد',
    ai: 'چاتی AI',
    practice: 'ڕاهێنان',
    discover: 'سەرچاوەکان',
    pro: 'پلانی Pro',
    dashboard: 'داشبۆرد',
    admin: 'ئەدمین',
  },
  kmr: {
    home: 'سەرەکی',
    academy: 'ئەکادیمیا',
    challenge: 'پرسیارا ڕۆژێ',
    aitools: 'ئامرازێن AI',
    prompts: 'پرۆمپت',
    editor: 'تاقیگەها کۆدی',
    ai: 'چاتا AI',
    practice: 'ڕاهێنان',
    discover: 'ژێدەر',
    pro: 'پلانا Pro',
    dashboard: 'داشبۆرد',
    admin: 'ڕێڤەبەر',
  },
  ar: {
    home: 'الرئيسية',
    academy: 'الأكاديمية',
    challenge: 'تحدي اليوم',
    aitools: 'أدوات AI',
    prompts: 'الأوامر',
    editor: 'مختبر الكود',
    ai: 'مساعد AI',
    practice: 'التمارين',
    discover: 'الموارد',
    pro: 'خطة Pro',
    dashboard: 'لوحتي',
    admin: 'الإدارة',
  },
  en: {
    home: 'Home',
    academy: 'Academy',
    challenge: 'Challenge',
    aitools: 'AI Tools',
    prompts: 'Prompts',
    editor: 'Code Lab',
    ai: 'AI Tutor',
    practice: 'Practice',
    discover: 'Resources',
    pro: 'Pro Plan',
    dashboard: 'Dashboard',
    admin: 'Admin',
  },
};

const QuickSearchDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { locale, courses, lessons, setActiveView, setActiveLessonId } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out: { label: string; sub: string; action: () => void }[] = [];

    if (!q) {
      courses.slice(0, 6).forEach((c) => {
        const title = cleanTitle(c.titles[locale] || c.titles.en);
        out.push({
          label: title,
          sub: pickLoc(locale, {
            ckb: 'کۆرسی فەرمی · ئەکادیمیا',
            kmr: 'کۆرسێ فەرمی · ئەکادیمیا',
            ar: 'مسار رسمي · الأكاديمية',
            en: 'Course Track · Academy',
          }),
          action: () => {
            const first = lessons.find((l) => l.courseId === c.id);
            if (first) setActiveLessonId(first.id);
            setActiveView('academy');
            onClose();
          },
        });
      });
      return out;
    }

    courses.forEach((c) => {
      const title = cleanTitle(c.titles[locale] || c.titles.en);
      if (title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)) {
        out.push({
          label: title,
          sub: pickLoc(locale, { ckb: 'کۆرس', kmr: 'کۆرس', ar: 'مسار', en: 'Track' }),
          action: () => {
            const first = lessons.find((l) => l.courseId === c.id);
            if (first) setActiveLessonId(first.id);
            setActiveView('academy');
            onClose();
          },
        });
      }
    });

    lessons.forEach((l) => {
      if (out.length >= 12) return;
      const loc = l.translations[locale] || l.translations.en;
      const title = cleanTitle(loc.title);
      if (title.toLowerCase().includes(q)) {
        out.push({
          label: `${title} (${l.courseId.toUpperCase()})`,
          sub: pickLoc(locale, {
            ckb: `وانە #${l.order}`,
            kmr: `وانە #${l.order}`,
            ar: `درس #${l.order}`,
            en: `Lesson #${l.order}`,
          }),
          action: () => {
            setActiveLessonId(l.id);
            setActiveView('academy');
            onClose();
          },
        });
      }
    });

    TOP_50_AI_TOOLS.forEach((tool) => {
      if (out.length >= 15) return;
      const toolTag = tool.tagline[locale] || tool.tagline.en || tool.tagline.ckb;
      if (tool.name.toLowerCase().includes(q) || toolTag.toLowerCase().includes(q)) {
        out.push({
          label: `${tool.name} (#${tool.rank})`,
          sub: pickLoc(locale, { ckb: 'ئامرازەکانی AI', kmr: 'ئامرازێن AI', ar: 'أداة ذكاء اصطناعي', en: 'AI Tool' }),
          action: () => {
            setActiveView('aitools');
            onClose();
          },
        });
      }
    });

    GOLDEN_PROMPTS.forEach((pr) => {
      if (out.length >= 18) return;
      const promptDesc = pr.shortDesc[locale] || pr.shortDesc.en || pr.shortDesc.ckb;
      if (pr.name.toLowerCase().includes(q) || promptDesc.toLowerCase().includes(q)) {
        out.push({
          label: pr.name,
          sub: pickLoc(locale, { ckb: 'پرۆمپتە زێڕینەکان', kmr: 'پرۆمپتێن زێڕین', ar: 'أمر احترافي', en: 'Golden Prompt' }),
          action: () => {
            setActiveView('prompts');
            onClose();
          },
        });
      }
    });

    return out.slice(0, 12);
  }, [query, courses, lessons, locale, setActiveLessonId, setActiveView, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#080c14]/70 p-4 pt-20 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={pickLoc(locale, {
        ckb: 'گەڕان لە پلاتفۆرم',
        kmr: 'لێگەڕیان د پلاتفۆرمێ دا',
        ar: 'البحث في المنصة',
        en: 'Search learning paths',
      })}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[560px] rounded-[9px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] p-6 shadow-[0_24px_70px_rgba(8,12,20,0.45)] text-[var(--kj-ink)]">
        <div className="flex items-center justify-between gap-3">
          <strong className="text-sm font-bold">
            {pickLoc(locale, {
              ckb: 'گەڕانی خێرا لە ڕێڕەوەکان، وانەکان و ئامرازەکان',
              kmr: 'لێگەڕیانا بلەز د ڕێباز، وانە و ئامرازان دا',
              ar: 'البحث السريع في المسارات والدروس والأدوات',
              en: 'Search learning paths, lessons & tools',
            })}
          </strong>
          <button
            type="button"
            onClick={onClose}
            aria-label={pickLoc(locale, { ckb: 'داخستن', kmr: 'داخستن', ar: 'إغلاق', en: 'Close search' })}
            className="rounded-[6px] px-2 py-1 text-base text-[var(--kj-muted)] hover:bg-[var(--kj-elevated)] hover:text-[var(--kj-ink)] cursor-pointer"
          >
            ✕
          </button>
        </div>
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={pickLoc(locale, {
            ckb: 'گەڕان بۆ HTML, Python, Cursor, THINK10X...',
            kmr: 'لێگەڕیان بۆ HTML, Python, Cursor, THINK10X...',
            ar: 'ابحث عن HTML، Python، Cursor، THINK10X...',
            en: 'Search HTML, Python, JavaScript, Cursor, THINK10X...',
          })}
          className="mt-4 w-full rounded-[5px] border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3.5 py-3 text-sm text-[var(--kj-ink)] placeholder:text-[var(--kj-muted)] focus:border-[var(--kj-green)] focus:outline-none"
        />
        <div className="mt-2 max-h-[300px] overflow-y-auto divide-y divide-[var(--kj-border)]">
          {results.length === 0 ? (
            <p className="py-4 text-xs text-[var(--kj-muted)]">
              {pickLoc(locale, {
                ckb: 'هیچ ئەنجامێکی گونجاو نەدۆزرایەوە.',
                kmr: 'چ ئەنجامەکێ گونجای نەهاتە دیتن.',
                ar: 'لم يتم العثور على نتائج مطابقة.',
                en: 'No matching topics found.',
              })}
            </p>
          ) : (
            results.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={item.action}
                className="flex w-full items-center justify-between gap-3 px-2.5 py-2.5 text-start text-xs hover:bg-[var(--kj-soft-alt)] dark:hover:bg-[#202938] cursor-pointer"
              >
                <span className="font-semibold text-[var(--kj-ink)]">{item.label}</span>
                <span className="shrink-0 rounded px-2 py-0.5 text-[10px] font-bold kj-badge">{item.sub}</span>
              </button>
            ))
          )}
        </div>
        <p className="mt-3 text-[11px] text-[var(--kj-muted)]">
          {pickLoc(locale, {
            ckb: 'بابەتێک هەڵبژێرە بۆ کردنەوەی ڕاستەوخۆ (Ctrl+K).',
            kmr: 'بابەتەکی هەلبژێرە بۆ ڤەکرنا ڕاستەوخۆ (Ctrl+K).',
            ar: 'اختر موضوعاً لفتحه مباشرة (Ctrl+K).',
            en: 'Choose a topic to explore the learning paths (Ctrl+K).',
          })}
        </p>
      </div>
    </div>
  );
};

const KarejanShell: React.FC = () => {
  const { locale, setLocale, activeView, staffRole, systemSettings, setActiveView } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const isStaff = staffRole === 'super_admin' || staffRole === 'admin' || staffRole === 'editor';

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const maintenance = systemSettings.maintenance || {
    enabled: false,
    lockedTabs: [],
    messageCkb: '',
    messageEn: '',
    estimatedReturn: '',
  };

  const isGlobalMaintenance = Boolean(maintenance.enabled);
  const isCurrentViewLocked = Boolean(maintenance.lockedTabs?.includes(activeView));
  const showMaintenance = !isStaff && activeView !== 'admin' && (isGlobalMaintenance || isCurrentViewLocked);

  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--kj-paper)] text-[var(--kj-ink)]">
      <CursorGlow />
      {/* Staff Awareness Banner when maintenance is active */}
      {isStaff && (isGlobalMaintenance || (maintenance.lockedTabs && maintenance.lockedTabs.length > 0)) && (
        <div className="border-b border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-700 dark:text-amber-300">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <span>🛠️</span>
              <span>
                <strong>
                  {pickLoc(locale, {
                    ckb: 'دۆخی چاکسازی چالاکە:',
                    kmr: 'دۆخێ چاکسازیێ چالاکە:',
                    ar: 'وضع الصيانة نشط:',
                    en: 'Maintenance Mode Active:',
                  })}
                </strong>{' '}
                {isGlobalMaintenance
                  ? pickLoc(locale, {
                      ckb: 'هەموو ماڵپەڕەکە لەژێر چاکسازیدایە (قفڵی گشتی)',
                      kmr: 'تەڤایا مالپەڕی د بن چاکسازیێ دایە (قفلێ گشتی)',
                      ar: 'الموقع بالكامل قيد الصيانة (قفل عام)',
                      en: 'Entire platform is in maintenance mode (global lock)',
                    })
                  : `${pickLoc(locale, {
                      ckb: 'ئەم بەشانە بۆ بەکارهێنەر قفڵن:',
                      kmr: 'ئەڤ بەشە بۆ بکارهێنەران قفلن:',
                      ar: 'هذه الأقسام مغلقة للمستخدمين:',
                      en: 'Locked sections for learners:',
                    })} (${maintenance.lockedTabs.map((tabId) => TAB_NAMES_LOC[locale]?.[tabId] || tabId).join(', ')})`}{' '}
                {pickLoc(locale, {
                  ckb: '(تۆ وەک ستاف دەتوانیت هەمووی ببینی).',
                  kmr: '(تو وەک ستاف دشێی هەمییان ببینی).',
                  ar: '(بصفتك مشرفاً يمكنك معاينة كل شيء).',
                  en: '(Staff bypass enabled).',
                })}
              </span>
            </span>
            <button
              onClick={() => setActiveView('admin')}
              className="rounded-md bg-amber-500/20 px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-500/30 dark:text-amber-200 cursor-pointer"
            >
              {pickLoc(locale, {
                ckb: 'بەڕێوەبردن لە ئەدمین ❯',
                kmr: 'ڕێڤەبرن د ئەدمین دا ❯',
                ar: 'إدارة الصيانة ❯',
                en: 'Manage in Admin ❯',
              })}
            </button>
          </div>
        </div>
      )}

      <TopBar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1">
        {showMaintenance ? (
          <MaintenanceView
            view={activeView}
            isGlobal={isGlobalMaintenance}
            message={locale === 'ckb' ? maintenance.messageCkb : locale === 'en' ? maintenance.messageEn : ''}
            estimatedReturn={maintenance.estimatedReturn}
          />
        ) : (
          <>
            {activeView === 'home' && <HomeView />}
            {activeView === 'academy' && <AcademyView />}
            {activeView === 'challenge' && <DailyChallengeRunner />}
            {activeView === 'aitools' && <AiToolsHubView />}
            {activeView === 'prompts' && <PromptsHubView />}
            {activeView === 'editor' && <CodeEditorView />}
            {activeView === 'ai' && <AiChatView />}
            {activeView === 'practice' && <AcademyView />}
            {activeView === 'discover' && <DiscoveryView />}
            {activeView === 'pro' && <ProPurchaseView />}
            {activeView === 'dashboard' && <DashboardView />}
            {activeView === 'admin' && <AdminView />}
          </>
        )}
      </main>

      {/* Deep Forest Footer matching CodeNest layout while preserving CREATOR attribution */}
      <footer className="border-t border-[#1c4236] bg-[#102d25] px-4 pb-9 pt-14 text-[#d7eadf] sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-[2.2fr_1fr_1fr_1fr]">
            <div className="col-span-2 md:col-span-1 text-start">
              <button
                type="button"
                onClick={() => setActiveView('home')}
                className="inline-flex items-center gap-2.5 cursor-pointer text-start"
              >
                <span className="kj-codenest-mark" dir="ltr">&lt;/&gt;</span>
                <span dir="ltr" className="text-2xl font-extrabold tracking-[-0.04em] text-white">
                  kare<strong className="font-extrabold text-[#9cebc3]">jan</strong>
                </span>
              </button>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#b2cfc0]">
                {pickLoc(locale, {
                  ckb: 'فێربە، ڕاهێنان بکە، و پڕۆژەی ڕاستەقینە بنیات بنێ بە ٤ زمان.',
                  kmr: 'فێرببە، ڕاهێنان بکە، و پڕۆژەیێن ڕاستەقینە ئاڤا بکە ب ٤ زمانان.',
                  ar: 'تعلّم، تدرّب، وابنِ مشاريع حقيقية بأربع لغات.',
                  en: 'Learn, practice, and build something great in 4 languages.',
                })}
              </p>
              <span className="mt-4 inline-flex items-center rounded-[8px] border border-[#2a5948] bg-[#17372d] px-3 py-1 text-[11px] font-bold text-[#9cebc3]">
                CREATOR: AZHAN HAMMZA
              </span>
            </div>

            <div className="text-start">
              <h3 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#80cba3]">
                {pickLoc(locale, { ckb: 'فێربوون', kmr: 'فێربوون', ar: 'تعلّم', en: 'LEARN' })}
              </h3>
              <div className="space-y-2.5 text-sm">
                <button type="button" onClick={() => setActiveView('academy')} className="block hover:text-[#9cebc3] cursor-pointer">
                  {TAB_NAMES_LOC[locale].academy}
                </button>
                <button type="button" onClick={() => setActiveView('challenge')} className="block hover:text-[#9cebc3] cursor-pointer">
                  {TAB_NAMES_LOC[locale].challenge}
                </button>
                <button type="button" onClick={() => setActiveView('practice')} className="block hover:text-[#9cebc3] cursor-pointer">
                  {TAB_NAMES_LOC[locale].practice}
                </button>
                <button type="button" onClick={() => setActiveView('discover')} className="block hover:text-[#9cebc3] cursor-pointer">
                  {TAB_NAMES_LOC[locale].discover}
                </button>
              </div>
            </div>

            <div className="text-start">
              <h3 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#80cba3]">
                {pickLoc(locale, { ckb: 'ئامرازەکان', kmr: 'ئامراز', ar: 'الأدوات', en: 'TOOLS' })}
              </h3>
              <div className="space-y-2.5 text-sm">
                <button type="button" onClick={() => setActiveView('editor')} className="block hover:text-[#9cebc3] cursor-pointer">
                  {TAB_NAMES_LOC[locale].editor}
                </button>
                <button type="button" onClick={() => setActiveView('ai')} className="block hover:text-[#9cebc3] cursor-pointer">
                  {TAB_NAMES_LOC[locale].ai}
                </button>
                <button type="button" onClick={() => setActiveView('aitools')} className="block hover:text-[#9cebc3] cursor-pointer">
                  {TAB_NAMES_LOC[locale].aitools}
                </button>
                <button type="button" onClick={() => setActiveView('prompts')} className="block hover:text-[#9cebc3] cursor-pointer">
                  {TAB_NAMES_LOC[locale].prompts}
                </button>
              </div>
            </div>

            <div className="text-start">
              <h3 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#80cba3]">
                {pickLoc(locale, { ckb: 'پلاتفۆرم', kmr: 'پلاتفۆرم', ar: 'المنصة', en: 'PLATFORM' })}
              </h3>
              <div className="space-y-2.5 text-sm">
                <button type="button" onClick={() => setActiveView('pro')} className="block hover:text-[#9cebc3] cursor-pointer">
                  {TAB_NAMES_LOC[locale].pro}
                </button>
                <button type="button" onClick={() => setActiveView('dashboard')} className="block hover:text-[#9cebc3] cursor-pointer">
                  {TAB_NAMES_LOC[locale].dashboard}
                </button>
                {isStaff && (
                  <button type="button" onClick={() => setActiveView('admin')} className="block text-[#9cebc3] hover:underline cursor-pointer">
                    {TAB_NAMES_LOC[locale].admin}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#8aab99]">
            <span>© 2026 karejan · CREATOR: AZHAN HAMMZA</span>
            <div className="flex flex-wrap items-center gap-3">
              {(['ckb', 'kmr', 'ar', 'en'] as Locale[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`cursor-pointer transition-colors ${
                    locale === code ? 'font-bold text-[#9cebc3]' : 'hover:text-white'
                  }`}
                >
                  {code === 'ckb' ? 'سۆرانی' : code === 'kmr' ? 'بادینی' : code === 'ar' ? 'العربية' : 'English'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <AuthModal />
      <QuickSearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export function KarejanApp() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <KarejanShell />
      </AppProvider>
    </ErrorBoundary>
  );
}
