import React from 'react';
import {
  Clock,
  ShieldAlert,
  BookOpen,
  Code2,
  Sparkles,
  CheckCircle2,
  Compass,
  Crown,
  LayoutDashboard,
  Home,
  Zap,
  Bot,
  Flame,
  RefreshCw,
  Globe,
  ArrowUpRight,
  Film,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { APPEARANCE_THEMES } from '../data/themesCatalog';
import { LOCALE_META, pickLoc } from '../i18n/translations';
import type { ActiveView, Locale } from '../types/domain';

interface MaintenanceViewProps {
  view?: ActiveView;
  isGlobal?: boolean;
  message?: string;
  estimatedReturn?: string;
}

const LOCALES: Locale[] = ['ckb', 'kmr', 'ar', 'en'];

const VIEW_METADATA: Record<
  ActiveView,
  { names: Record<Locale, string>; icon: React.ComponentType<{ className?: string }> }
> = {
  home: {
    names: { ckb: 'پەڕەی سەرەکی', kmr: 'بەرپەڕێ سەرەکی', ar: 'الصفحة الرئيسية', en: 'Home Page' },
    icon: Home,
  },
  challenge: {
    names: { ckb: 'چاڵنجی ڕۆژ', kmr: 'پرسیارا ڕۆژێ', ar: 'تحدي اليوم', en: 'Daily Challenge' },
    icon: Zap,
  },
  aitools: {
    names: { ckb: 'ئامرازەکانی AI (50)', kmr: 'ئامرازێن AI (50)', ar: 'أدوات الذكاء الاصطناعي (50)', en: 'TOP 50 AI Tools' },
    icon: Bot,
  },
  prompts: {
    names: { ckb: '٢٢ پرۆمپتی زێڕین', kmr: '٢٢ پرۆمپتێن زێڕین', ar: '٢٢ أمراً ذهبياً', en: '22 Golden Prompts' },
    icon: Flame,
  },
  academy: {
    names: { ckb: 'ئەکادیمیا و وانەکان', kmr: 'ئەکادیمیا و وانە', ar: 'الأكاديمية والدروس', en: 'Academy & Courses' },
    icon: BookOpen,
  },
  videos: {
    names: { ckb: 'وانە ڤیدیۆییەکان (Mux)', kmr: 'وانەیێن ڤیدیۆ (Mux)', ar: 'دروس الفيديو (Mux)', en: 'Video Lessons' },
    icon: Film,
  },
  editor: {
    names: { ckb: 'تاقیگەی کۆد (Code Lab)', kmr: 'تاقیگەها کۆدی (Code Lab)', ar: 'مختبر الكود المباشر', en: 'Live Code Lab' },
    icon: Code2,
  },
  ai: {
    names: { ckb: 'مامۆستای karejan AI', kmr: 'مامۆستایێ karejan AI', ar: 'مساعد karejan AI', en: 'karejan AI Tutor' },
    icon: Sparkles,
  },
  practice: {
    names: { ckb: 'ڕاهێنان و تاقیکردنەوە', kmr: 'ڕاهێنان و ئەزموون', ar: 'التدريب والتقييم', en: 'Practice & Assessment' },
    icon: CheckCircle2,
  },
  discover: {
    names: { ckb: 'سەرچاوە و پڕۆژەکان', kmr: 'ژێدەر و پڕۆژە', ar: 'الاستكشاف والمشاريع', en: 'Discovery Hub' },
    icon: Compass,
  },
  appearance: {
    names: { ckb: 'ڕووکار و ڕەنگ', kmr: 'ڕووکار و ڕەنگ', ar: 'المظهر والألوان', en: 'Appearance' },
    icon: Sparkles,
  },
  pro: {
    names: { ckb: 'پلانی Pro', kmr: 'پلانا Pro', ar: 'خطة Pro', en: 'Pro Subscription' },
    icon: Crown,
  },
  dashboard: {
    names: { ckb: 'داشبۆردی فێرخواز', kmr: 'داشبۆردا فێرخازی', ar: 'لوحة المتعلّم', en: 'Learner Dashboard' },
    icon: LayoutDashboard,
  },
  admin: {
    names: { ckb: 'پانێڵی ئەدمین', kmr: 'پەنێلا ڕێڤەبەریێ', ar: 'لوحة الإدارة', en: 'Admin Console' },
    icon: ShieldAlert,
  },
};

const MAINT_COPY: Record<
  Locale,
  {
    statusGlobal: string;
    statusSection: string;
    headlineLine1: string;
    headlineLine2: string;
    sectionHeadline2: string;
    defaultMessage: string;
    makingBetterTitle: string;
    estimatedLabel: string;
    defaultReturn: string;
    backHome: string;
    staffSignIn: string;
    adminPanel: string;
    reloadBtn: string;
    windowTitle: string;
    windowSub: string;
    badgeUpdating: string;
    badgeInProgress: string;
    availableTitle: string;
    availableSub: string;
    languagesLabel: string;
  }
> = {
  ckb: {
    statusGlobal: 'دۆخی چاکسازی گشتی',
    statusSection: 'دۆخی چاکسازی بەش',
    headlineLine1: 'پشوویەکی کورت.',
    headlineLine2: 'ئەزموونێکی باشتر.',
    sectionHeadline2: 'لەژێر نوێکردنەوەدایە.',
    defaultMessage:
      'لە پشت پەردەوە سەرقاڵی باشترکردن و نوێکردنەوەی پلاتفۆرمی karejanـین. هەر کە هەموو شتێک ئامادە بوو دەگەڕێینەوە.',
    makingBetterTitle: 'باشترکردنی سیستەم',
    estimatedLabel: 'کاتی پێشبینیکراو:',
    defaultReturn: 'بە زووترین کات دەگەڕێینەوە',
    backHome: 'گەڕانەوە بۆ سەرەکی',
    staffSignIn: 'چوونەژوورەوەی ستاف',
    adminPanel: 'پانێڵی ئەدمین',
    reloadBtn: 'نوێکردنەوەی پەڕە',
    windowTitle: 'ئەزموونێکی ڕووناکتر',
    windowSub: 'بەم زووانە ئامادە دەبێت',
    badgeUpdating: 'نوێدەکرێتەوە',
    badgeInProgress: 'لەژێر کارکردندایە',
    availableTitle: 'بەشە کراوەکانی تری پلاتفۆرم:',
    availableSub: 'ئەم بەشانە لە ئێستادا بە تەواوی چالاک و بەردەستن',
    languagesLabel: 'فەرهەنگ و زمانەکان:',
  },
  kmr: {
    statusGlobal: 'دۆخێ چاکسازییا گشتی',
    statusSection: 'دۆخێ چاکسازییا بەشی',
    headlineLine1: 'پشوویەکا کورت.',
    headlineLine2: 'ئەزموونەکا باشتر.',
    sectionHeadline2: 'د بن نویکرنێ دایە.',
    defaultMessage:
      'تیمێ مە خەریکی باشترکرن و نویکرنا پلاتفۆرما karejan یە. دەمێ هەمی تشت بەرهەڤ بن دێ زڤڕین.',
    makingBetterTitle: 'باشترکرنا سیستەمی',
    estimatedLabel: 'دەمێ پێشبینیکری:',
    defaultReturn: 'دێ ب زووترین دەم ڤەگەڕین',
    backHome: 'زڤڕین بۆ سەرەکی',
    staffSignIn: 'چوونەژوورا ستافی',
    adminPanel: 'پانێلێ ڕێڤەبەریێ',
    reloadBtn: 'نویکرنا لاپەڕی',
    windowTitle: 'ئەزموونەکا گەشتر',
    windowSub: 'د ڕێکێ دایە',
    badgeUpdating: 'تێ نویکرن',
    badgeInProgress: 'د کارکرنێ دایە',
    availableTitle: 'بەشێن دی یێن ڤەکری د پلاتفۆرمێ دا:',
    availableSub: 'ئەڤ بەشە نها ب تەمامی کارانە و بەردەستن',
    languagesLabel: 'زمان و فەرهەنگ:',
  },
  ar: {
    statusGlobal: 'وضع الصيانة العام',
    statusSection: 'صيانة هذا القسم',
    headlineLine1: 'استراحة قصيرة.',
    headlineLine2: 'لتجربة أفضل.',
    sectionHeadline2: 'قيد التحديث حالياً.',
    defaultMessage:
      'نجري بعض التحسينات والتحديثات خلف الكواليس في منصة karejan، وسنعود للعمل فوراً فور جاهزية كل شيء.',
    makingBetterTitle: 'نعمل على التحسين',
    estimatedLabel: 'العودة المتوقعة:',
    defaultReturn: 'سنعود قريباً',
    backHome: 'العودة للرئيسية',
    staffSignIn: 'دخول فريق الإدارة',
    adminPanel: 'لوحة الإدارة',
    reloadBtn: 'تحديث الصفحة',
    windowTitle: 'تجربة أكثر إشراقاً',
    windowSub: 'في الطريق إليكم',
    badgeUpdating: 'جارٍ التحديث',
    badgeInProgress: 'قيد التنفيذ',
    availableTitle: 'الأقسام الأخرى المتاحة حالياً:',
    availableSub: 'جميع هذه الأقسام تعمل بشكل طبيعي ويمكنك زيارتها الآن',
    languagesLabel: 'اللغات المتاحة:',
  },
  en: {
    statusGlobal: 'MAINTENANCE MODE',
    statusSection: 'SECTION MAINTENANCE',
    headlineLine1: 'A little pause.',
    headlineLine2: 'A better experience.',
    sectionHeadline2: 'is updating.',
    defaultMessage:
      'We’re making a few improvements behind the scenes on karejan. We’ll be back as soon as everything is ready.',
    makingBetterTitle: 'Making things better',
    estimatedLabel: 'Estimated return:',
    defaultReturn: 'Thank you for your patience while we work.',
    backHome: 'Back to home',
    staffSignIn: 'Staff Sign In',
    adminPanel: 'Admin Console',
    reloadBtn: 'Refresh page',
    windowTitle: 'A brighter experience',
    windowSub: 'is on the way',
    badgeUpdating: 'UPDATING',
    badgeInProgress: 'IN PROGRESS',
    availableTitle: 'Available sections you can explore right now:',
    availableSub: 'These sections of karejan are operating normally',
    languagesLabel: 'Languages:',
  },
};

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  view = 'academy',
  isGlobal = false,
  message,
  estimatedReturn,
}) => {
  const { locale, setLocale, theme, setTheme, setActiveView, systemSettings, firebaseUser, staffRole, setAuthModalOpen } = useApp();
  const copy = pickLoc(locale, MAINT_COPY);
  const currentMeta = VIEW_METADATA[view] || VIEW_METADATA.academy;
  const sectionName = pickLoc(locale, currentMeta.names);
  const isStaff = staffRole !== 'user';

  const maintenance = systemSettings.maintenance;
  const lockedTabs = maintenance?.lockedTabs || [];
  const homeUnlocked = !isGlobal && !lockedTabs.includes('home');

  const availableViews: ActiveView[] = (
    ['home', 'academy', 'videos', 'editor', 'ai', 'challenge', 'aitools', 'prompts', 'discover', 'appearance', 'pro', 'dashboard'] as ActiveView[]
  ).filter((v) => v !== view && !lockedTabs.includes(v));

  const displayMessage = (message && message.trim()) || copy.defaultMessage;
  const displayReturn = (estimatedReturn && estimatedReturn.trim()) || copy.defaultReturn;

  return (
    <div className="bg-[var(--kj-paper)] text-[var(--kj-ink)]">
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:py-14">
        {/* Main Asymmetric 2-Column Layout matching CodeNest Maintenance Design */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_540px] lg:gap-12">
          {/* Animated Orbit & Browser Window Art (Right on Desktop, Top on Mobile) */}
          <div
            aria-hidden="true"
            dir="ltr"
            className="order-1 lg:order-2 relative flex h-[380px] sm:h-[480px] lg:h-[540px] items-center justify-center overflow-hidden"
          >
            <div className="relative flex h-[480px] w-[540px] shrink-0 items-center justify-center scale-[0.7] sm:scale-[0.9] lg:scale-100">
              {/* Outer Orbit */}
              <div className="absolute h-[466px] w-[466px] rounded-full border border-[var(--kj-border)]" />
              {/* Middle Orbit */}
              <div className="absolute h-[376px] w-[376px] rounded-full border border-[var(--kj-border-strong)]" />
              {/* Soft Halo */}
              <div className="relative flex h-[296px] w-[296px] items-center justify-center rounded-full bg-[var(--kj-soft)]">
                <div className="h-[236px] w-[236px] rounded-full bg-[var(--kj-elevated)]" />
              </div>

              {/* Twinkle Sparks & Theme Orb */}
              <span className="kj-maint-twinkle absolute left-[78px] top-[125px] text-2xl text-[var(--kj-emerald)] select-none">
                ✦
              </span>
              <span className="kj-maint-twinkle-delay absolute bottom-[125px] right-[78px] text-2xl text-[var(--kj-emerald)] select-none">
                ✧
              </span>
              <div className="absolute right-[115px] top-[95px] h-3 w-3 rounded-full bg-[var(--kj-green)]" />

              {/* Central Floating Window Card */}
              <div className="kj-maint-float relative z-10 h-[248px] w-[370px] overflow-hidden rounded-[18px] border border-[var(--kj-border)] bg-[var(--kj-card)] shadow-[0_18px_38px_rgba(16,41,28,0.16)]">
                <div className="flex h-[51px] items-center gap-12 bg-[var(--kj-soft)] px-[18px] text-[10px] text-[var(--kj-muted)]">
                  <span className="tracking-widest">● ● ●</span>
                  <span className="rounded-full bg-[var(--kj-card)] px-5 py-1.5 font-mono text-[11px] font-semibold text-[var(--kj-muted-2)]">
                    karejan / update
                  </span>
                </div>

                <div className="px-6 text-center">
                  <div className="mt-6 font-mono text-[38px] font-extrabold leading-none tracking-[-3px] text-[var(--kj-green)]">
                    &lt;/&gt;
                  </div>
                  <strong className="mt-3.5 block text-[13px] font-bold text-[var(--kj-ink)]">
                    {copy.windowTitle}
                  </strong>
                  <p className="mt-1.5 mb-5 text-xs text-[var(--kj-muted)]">
                    {copy.windowSub}
                  </p>
                  <div className="kj-maint-loading-bar mx-auto h-[7px] w-[242px] overflow-hidden rounded-full bg-[var(--kj-soft)]" />
                </div>
              </div>

              {/* Floating Deep Surface Badge: UPDATING */}
              <div className="kj-maint-float-reverse absolute right-[48px] top-[72px] z-20 flex items-center gap-3 rounded-[14px] border border-[var(--kj-band-border)] bg-[var(--kj-band-bg)] px-4 py-3.5 text-[11px] font-extrabold tracking-[0.03em] text-white shadow-[0_8px_16px_rgba(16,41,28,0.18)]">
                <span className="text-base text-[var(--kj-band-accent)]">✦</span>
                <span>{copy.badgeUpdating}</span>
              </div>

              {/* Floating Surface Badge: IN PROGRESS */}
              <div className="kj-maint-float absolute bottom-[85px] left-[28px] z-20 flex items-center gap-3 rounded-[14px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-4 py-3.5 text-[11px] font-extrabold tracking-[0.03em] text-[var(--kj-muted-2)] shadow-[0_8px_16px_rgba(16,41,28,0.14)]">
                <span className="font-mono text-base text-[var(--kj-green)]">{'{ }'}</span>
                <span>{copy.badgeInProgress}</span>
              </div>
            </div>
          </div>

          {/* Copy, Status, Notice, Language & Theme Switcher Column */}
          <div className="order-2 lg:order-1 text-center lg:text-start">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-[var(--kj-badge-bg)] px-4 py-2 text-[10.5px] font-extrabold uppercase tracking-[0.05em] text-[var(--kj-badge-ink)]">
              <span className="kj-maint-pulse h-2 w-2 rounded-full bg-[var(--kj-emerald)]" />
              <span>{isGlobal ? copy.statusGlobal : `${copy.statusSection} · ${sectionName}`}</span>
            </div>

            <h1 className="my-7 text-[36px] font-extrabold leading-[1.18] tracking-[-0.04em] text-[var(--kj-ink)] sm:text-[48px] lg:text-[54px]">
              {isGlobal ? copy.headlineLine1 : sectionName}
              <br />
              <span className="text-[var(--kj-green)]">
                {isGlobal ? copy.headlineLine2 : copy.sectionHeadline2}
              </span>
            </h1>

            <p className="mx-auto max-w-lg text-[15px] leading-[1.8] text-[var(--kj-muted-2)] sm:text-base lg:mx-0">
              {displayMessage}
            </p>

            {/* Status & ETA Card (.notice) */}
            <div
              role="status"
              className="mx-auto mt-8 flex max-w-[530px] items-center gap-4 rounded-[14px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-4.5 text-start shadow-xs lg:mx-0"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[13px] bg-[var(--kj-badge-bg)] text-xl text-[var(--kj-green)]">
                ✦
              </span>
              <div className="min-w-0 flex-1">
                <strong className="block text-sm font-bold text-[var(--kj-ink)]">
                  {copy.makingBetterTitle}
                </strong>
                <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-[var(--kj-muted)]">
                  <Clock className="h-3.5 w-3.5 text-[var(--kj-green)] shrink-0" />
                  <span className="font-semibold text-[var(--kj-ink)]">{copy.estimatedLabel}</span>{' '}
                  <span>{displayReturn}</span>
                </p>
              </div>
              <span className="kj-maint-pulse text-lg tracking-widest text-[var(--kj-emerald)] shrink-0" aria-hidden="true">
                •••
              </span>
            </div>

            {/* All 4 Website Language Dictionaries Switcher */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--kj-muted)] me-1">
                <Globe className="h-3.5 w-3.5 text-[var(--kj-green)]" />
                <span>{copy.languagesLabel}</span>
              </span>
              {LOCALES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                    locale === code
                      ? 'border-[var(--kj-green)] bg-[var(--kj-green)] text-[var(--kj-btn-primary-ink)]'
                      : 'border-[var(--kj-border)] bg-[var(--kj-card)] text-[var(--kj-ink)] hover:border-[var(--kj-green)]'
                  }`}
                >
                  {LOCALE_META[code].nativeLabel}
                </button>
              ))}
            </div>

            {/* Quick 6-Theme Swatch Switcher */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {APPEARANCE_THEMES.map((item) => {
                const active = theme === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTheme(item.id)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                      active
                        ? 'border-[var(--kj-green)] bg-[var(--kj-soft)] text-[var(--kj-ink)]'
                        : 'border-[var(--kj-border)] bg-[var(--kj-card)] text-[var(--kj-muted)] hover:text-[var(--kj-ink)]'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.accent }}
                    />
                    <span>{pickLoc(locale, item.names).split(' (')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Primary & Secondary Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {homeUnlocked ? (
                <button
                  type="button"
                  onClick={() => setActiveView('home')}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-[10px] bg-[var(--kj-green)] px-6 py-3 text-sm font-bold text-[var(--kj-btn-primary-ink)] transition-colors hover:bg-[var(--kj-accent-hover)] cursor-pointer"
                >
                  <span>{copy.backHome}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-[10px] bg-[var(--kj-green)] px-6 py-3 text-sm font-bold text-[var(--kj-btn-primary-ink)] transition-colors hover:bg-[var(--kj-accent-hover)] cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>{copy.reloadBtn}</span>
                </button>
              )}

              {isStaff ? (
                <button
                  type="button"
                  onClick={() => setActiveView('admin')}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-[10px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] px-6 py-3 text-sm font-bold text-[var(--kj-green)] transition-colors hover:bg-[var(--kj-soft)] cursor-pointer"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>{copy.adminPanel}</span>
                </button>
              ) : !firebaseUser ? (
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-[10px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] px-6 py-3 text-sm font-bold text-[var(--kj-green)] transition-colors hover:bg-[var(--kj-soft)] cursor-pointer"
                >
                  <span>{copy.staffSignIn}</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Unlocked Platform Sections Grid during Partial Maintenance */}
        {!isGlobal && availableViews.length > 0 && (
          <section className="mt-14 rounded-[18px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-6 sm:p-8 text-start">
            <h2 className="text-base font-extrabold text-[var(--kj-ink)]">
              {copy.availableTitle}
            </h2>
            <p className="mt-1 mb-5 text-xs text-[var(--kj-muted)]">
              {copy.availableSub}
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableViews.map((altView) => {
                const meta = VIEW_METADATA[altView];
                const Icon = meta.icon;
                return (
                  <button
                    key={altView}
                    type="button"
                    onClick={() => setActiveView(altView)}
                    className="group flex items-center justify-between gap-3 rounded-[12px] border border-[var(--kj-border)] bg-[var(--kj-soft)] px-4 py-3 text-start text-xs font-bold text-[var(--kj-ink)] transition-colors hover:border-[var(--kj-green)] hover:bg-[var(--kj-elevated)] cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[var(--kj-card)] text-[var(--kj-green)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{pickLoc(locale, meta.names)}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--kj-muted)] group-hover:text-[var(--kj-green)]" />
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
