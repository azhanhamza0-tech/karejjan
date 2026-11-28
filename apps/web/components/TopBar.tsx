import React, { useEffect, useRef, useState } from 'react';
import {
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Bell,
  LogOut,
  User as UserIcon,
  Search,
  ChevronDown,
  Bot,
  Flame,
  Compass,
  Shield,
  Crown,
} from 'lucide-react';
import { sendEmailVerification } from 'firebase/auth';
import { useApp } from '../context/AppContext';
import { LOCALE_META, pickLoc } from '../i18n/translations';
import type { ActiveView, Locale } from '../types/domain';
import { Button } from './ui/Primitives';

const LOCALES: Locale[] = ['ckb', 'kmr', 'ar', 'en'];

const COMPACT_LOCALE_LABEL: Record<Locale, string> = {
  ckb: 'سۆرانی',
  kmr: 'بادینی',
  ar: 'العربية',
  en: 'EN',
};

export const TopBar: React.FC<{ onOpenSearch?: () => void }> = ({ onOpenSearch }) => {
  const {
    locale,
    setLocale,
    t,
    theme,
    setTheme,
    activeView,
    setActiveView,
    firebaseUser,
    profile,
    staffRole,
    effectivePlan,
    notifications,
    systemSettings,
    setAuthModalOpen,
    signOut,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false);
  const [verifySent, setVerifySent] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
        setLangMenuOpen(false);
        setExploreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const isStaff = staffRole !== 'user';

  const primaryNav: { id: ActiveView; label: string }[] = [
    { id: 'academy', label: t.nav.academy },
    { id: 'challenge', label: pickLoc(locale, { ckb: 'چاڵنجی ڕۆژ', kmr: 'پرسیارا ڕۆژێ', ar: 'تحدي اليوم', en: 'Exercises' }) },
    { id: 'editor', label: t.nav.editor },
    { id: 'ai', label: pickLoc(locale, { ckb: 'مامۆستای AI', kmr: 'مامۆستایێ AI', ar: 'المساعد AI', en: 'AI Tutor' }) },
  ];

  const exploreItems: { id: ActiveView; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      id: 'aitools',
      label: pickLoc(locale, { ckb: 'ئامرازەکانی AI', kmr: 'ئامرازێن AI', ar: 'أدوات AI', en: 'AI Tools' }),
      sub: 'TOP 50',
      icon: <Bot className="h-4 w-4 text-[#087f5b] dark:text-[#7ce3b3]" />,
    },
    {
      id: 'prompts',
      label: pickLoc(locale, { ckb: 'پرۆمپتە زێڕینەکان', kmr: 'پرۆمپتێن زێڕین', ar: 'الأوامر الذهبية', en: 'Golden Prompts' }),
      sub: '22',
      icon: <Flame className="h-4 w-4 text-amber-500" />,
    },
    {
      id: 'discover',
      label: t.nav.discover,
      sub: pickLoc(locale, { ckb: 'وتار و پڕۆژە', kmr: 'گۆتار و پڕۆژە', ar: 'مقالات ومشاريع', en: 'Hub' }),
      icon: <Compass className="h-4 w-4 text-sky-500" />,
    },
    {
      id: 'pro',
      label: t.nav.pro,
      sub: 'PRO',
      icon: <Crown className="h-4 w-4 text-emerald-500" />,
    },
  ];

  const isExploreActive =
    activeView === 'aitools' || activeView === 'prompts' || activeView === 'discover' || activeView === 'pro';

  const handleNav = (id: ActiveView) => {
    setActiveView(id);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    setExploreMenuOpen(false);
  };

  return (
    <div ref={headerRef} className="sticky top-0 z-40 border-b border-[var(--kj-border)] bg-[var(--kj-card)]/95 backdrop-blur">
      <header className="mx-auto flex min-h-[72px] max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6">
        {/* Zone 1: CodeNest Brand Mark + karejan */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer text-start group"
          aria-label="karejan Home"
        >
          <span className="kj-codenest-mark shadow-xs transition-transform group-hover:scale-[1.03]" dir="ltr">
            &lt;/&gt;
          </span>
          <span
            dir="ltr"
            className="text-[22px] font-extrabold tracking-[-0.04em] text-[var(--kj-ink)]"
          >
            kare<strong className="font-extrabold text-[#087f5b] dark:text-[#7ce3b3]">jan</strong>
          </span>
        </button>

        {/* Zone 2: Clean Center Primary Navigation */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6">
          {primaryNav.map((item) => {
            const active = activeView === item.id;
            const isLocked = Boolean(
              systemSettings.maintenance?.enabled || systemSettings.maintenance?.lockedTabs?.includes(item.id)
            );
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`inline-flex items-center gap-1.5 border-b-2 py-2 text-[14px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-[#087f5b] text-[#087f5b] dark:border-[#7ce3b3] dark:text-[#7ce3b3]'
                    : 'border-transparent text-[var(--kj-ink)]/85 hover:text-[#087f5b] dark:hover:text-[#7ce3b3]'
                }`}
              >
                <span>{item.label}</span>
                {isLocked && (
                  <span
                    title={pickLoc(locale, {
                      ckb: 'لەژێر چاکسازیدایە',
                      kmr: 'د بن چاکسازیێ دایە',
                      ar: 'قيد الصيانة',
                      en: 'Under maintenance',
                    })}
                    className="h-1.5 w-1.5 rounded-full bg-amber-500"
                  />
                )}
              </button>
            );
          })}

          {/* Explore Dropdown for Secondary Tools */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setExploreMenuOpen((o) => !o);
                setLangMenuOpen(false);
                setAccountMenuOpen(false);
              }}
              className={`inline-flex items-center gap-1 border-b-2 py-2 text-[14px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isExploreActive
                  ? 'border-[#087f5b] text-[#087f5b] dark:border-[#7ce3b3] dark:text-[#7ce3b3]'
                  : 'border-transparent text-[var(--kj-ink)]/85 hover:text-[#087f5b] dark:hover:text-[#7ce3b3]'
              }`}
            >
              <span>
                {pickLoc(locale, {
                  ckb: 'ئامرازەکان',
                  kmr: 'ئامراز',
                  ar: 'الأدوات',
                  en: 'Explore',
                })}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${exploreMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {exploreMenuOpen && (
              <div className="absolute start-0 mt-2 w-60 rounded-[14px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] p-1.5 shadow-xl">
                {exploreItems.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleNav(sub.id)}
                    className={`flex w-full items-center justify-between gap-2.5 rounded-[10px] px-3 py-2.5 text-start text-xs font-semibold transition-colors cursor-pointer ${
                      activeView === sub.id
                        ? 'bg-[#e4f2e9] text-[#087f5b] dark:bg-[#173a2d] dark:text-[#9cebc3]'
                        : 'text-[var(--kj-ink)] hover:bg-[var(--kj-soft)]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {sub.icon}
                      <span>{sub.label}</span>
                    </span>
                    <span className="rounded-md bg-[var(--kj-soft)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--kj-muted)]">
                      {sub.sub}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Inline Search Pill + Language + Theme + Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenSearch && (
            <>
              <button
                type="button"
                onClick={onOpenSearch}
                className="hidden xl:inline-flex h-10 w-[180px] items-center gap-2 rounded-full border border-[var(--kj-border)] bg-[#f5f8f6] px-3.5 text-xs text-[var(--kj-muted)] transition-colors hover:border-[#087f5b] hover:text-[var(--kj-ink)] dark:bg-[#152c24] cursor-pointer"
                aria-label={t.common.search}
              >
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {pickLoc(locale, {
                    ckb: 'گەڕان لە وانەکان...',
                    kmr: 'لێگەڕیان...',
                    ar: 'ابحث في الدروس...',
                    en: 'Search tutorials',
                  })}
                </span>
              </button>
              <button
                type="button"
                onClick={onOpenSearch}
                title={t.common.search}
                aria-label={t.common.search}
                className="flex xl:hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--kj-border)] bg-[var(--kj-soft)] text-[var(--kj-ink)] hover:border-[#087f5b] hover:text-[#087f5b] transition-colors cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setLangMenuOpen((o) => !o);
                setExploreMenuOpen(false);
                setAccountMenuOpen(false);
              }}
              aria-label={t.common.language}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--kj-border)] bg-[var(--kj-soft)] px-2.5 text-xs font-semibold text-[var(--kj-ink)] hover:border-[#087f5b] transition-colors cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-[#087f5b] dark:text-[#7ce3b3]" />
              <span className="hidden sm:inline">{COMPACT_LOCALE_LABEL[locale]}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>

            {langMenuOpen && (
              <div className="absolute end-0 mt-2 w-44 rounded-[14px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] p-1.5 shadow-xl">
                {LOCALES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setLocale(code);
                      setLangMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-start text-xs font-semibold transition-colors cursor-pointer ${
                      locale === code
                        ? 'bg-[#e4f2e9] text-[#087f5b] dark:bg-[#173a2d] dark:text-[#9cebc3]'
                        : 'text-[var(--kj-ink)] hover:bg-[var(--kj-soft)]'
                    }`}
                  >
                    <span>{LOCALE_META[code].nativeLabel}</span>
                    {locale === code && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? t.common.lightTheme : t.common.darkTheme}
            aria-label="Toggle color mode"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--kj-border)] bg-[var(--kj-soft)] text-[var(--kj-ink)] hover:border-[#087f5b] hover:text-[#087f5b] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isStaff && (
            <button
              type="button"
              onClick={() => handleNav('admin')}
              title={t.nav.admin}
              className={`hidden sm:inline-flex h-9 items-center gap-1 rounded-[10px] border px-2.5 text-xs font-bold transition-colors cursor-pointer ${
                activeView === 'admin'
                  ? 'border-[#087f5b] bg-[#e4f2e9] text-[#087f5b] dark:bg-[#173a2d] dark:text-[#9cebc3]'
                  : 'border-[var(--kj-border)] text-[var(--kj-ink)] hover:border-[#087f5b]'
              }`}
            >
              <Shield className="h-3.5 w-3.5 text-[#087f5b] dark:text-[#7ce3b3]" />
              <span>{t.nav.admin}</span>
            </button>
          )}

          {firebaseUser ? (
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setAccountMenuOpen((o) => !o);
                  setLangMenuOpen(false);
                  setExploreMenuOpen(false);
                }}
                aria-expanded={accountMenuOpen}
                className="rounded-[10px]"
              >
                <UserIcon className="h-4 w-4 text-[#087f5b] dark:text-[#7ce3b3]" />
                <span className="max-w-[96px] truncate">
                  {profile?.displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0]}
                </span>
                {unreadNotifs > 0 && (
                  <span className="font-mono text-[11px] font-bold text-[#087f5b] dark:text-[#7ce3b3] tabular-nums">
                    ({unreadNotifs})
                  </span>
                )}
              </Button>

              {accountMenuOpen && (
                <div className="absolute end-0 mt-2 w-60 rounded-[14px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] p-3 shadow-xl">
                  <div className="border-b border-[var(--kj-border)] pb-2.5">
                    <p className="truncate text-sm font-bold text-[var(--kj-ink)]">
                      {profile?.displayName || firebaseUser.displayName || 'Learner'}
                    </p>
                    <p className="truncate text-xs text-[var(--kj-muted)]">
                      {firebaseUser.email}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold kj-badge">
                      {effectivePlan === 'pro' ? t.common.proPlan : t.common.freePlan}
                      {isStaff && ` · ${staffRole.replace('_', ' ')}`}
                    </p>
                  </div>

                  <div className="mt-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => handleNav('dashboard')}
                      className="flex w-full items-center justify-between rounded-[8px] px-2.5 py-2 text-start text-sm text-[var(--kj-ink)] hover:bg-[var(--kj-soft)] cursor-pointer"
                    >
                      <span>{t.nav.dashboard}</span>
                      {unreadNotifs > 0 && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-[#087f5b] dark:text-[#7ce3b3] tabular-nums">
                          <Bell className="h-3.5 w-3.5" /> {unreadNotifs}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('pro')}
                      className="flex w-full items-center justify-between rounded-[8px] px-2.5 py-2 text-start text-sm text-[var(--kj-ink)] hover:bg-[var(--kj-soft)] cursor-pointer"
                    >
                      <span>{t.nav.pro}</span>
                    </button>
                    {isStaff && (
                      <button
                        type="button"
                        onClick={() => handleNav('admin')}
                        className="flex w-full items-center justify-between rounded-[8px] px-2.5 py-2 text-start text-sm text-[var(--kj-ink)] hover:bg-[var(--kj-soft)] cursor-pointer"
                      >
                        <span>{t.nav.admin}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        void signOut();
                      }}
                      className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-start text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t.common.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:inline-flex px-2.5 py-2 text-[13.5px] font-semibold text-[var(--kj-ink)] hover:text-[#087f5b] dark:hover:text-[#7ce3b3] transition-colors whitespace-nowrap cursor-pointer"
              >
                {t.nav.signIn}
              </button>
              <button
                type="button"
                onClick={() => handleNav('academy')}
                className="inline-flex items-center justify-center rounded-[10px] bg-[#087f5b] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#056949] whitespace-nowrap cursor-pointer"
              >
                {pickLoc(locale, {
                  ckb: 'دەستپێبکە',
                  kmr: 'دەستپێبکە',
                  ar: 'ابدأ الآن',
                  en: 'Get started',
                })}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--kj-border)] text-[var(--kj-ink)] lg:hidden hover:bg-[var(--kj-soft)] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-[var(--kj-border)] bg-[var(--kj-soft)] px-4 py-3 lg:hidden"
        >
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'home' as ActiveView, label: t.nav.home || 'Home' },
              ...primaryNav,
              ...exploreItems.map((e) => ({ id: e.id, label: e.label })),
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`rounded-[10px] px-3 py-2.5 text-start text-xs font-semibold cursor-pointer ${
                  activeView === item.id
                    ? 'bg-[#087f5b] text-white'
                    : 'bg-[var(--kj-card)] text-[var(--kj-ink)] border border-[var(--kj-border)]'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isStaff && (
              <button
                type="button"
                onClick={() => handleNav('admin')}
                className={`rounded-[10px] px-3 py-2.5 text-start text-xs font-semibold cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-[#087f5b] text-white'
                    : 'bg-[var(--kj-card)] text-[var(--kj-ink)] border border-[var(--kj-border)]'
                }`}
              >
                {t.nav.admin}
              </button>
            )}
            {firebaseUser ? (
              <button
                type="button"
                onClick={() => handleNav('dashboard')}
                className="rounded-[10px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-2.5 text-start text-xs font-semibold text-[var(--kj-ink)] cursor-pointer"
              >
                {t.nav.dashboard}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="rounded-[10px] border border-[#087f5b] bg-[var(--kj-card)] px-3 py-2.5 text-start text-xs font-bold text-[#087f5b] dark:text-[#7ce3b3] cursor-pointer"
              >
                {t.nav.signIn}
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Email verification reminder */}
      {firebaseUser && !firebaseUser.emailVerified && (
        <div className="border-t border-amber-300 bg-amber-50 px-4 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2">
            <span>{t.common.verifyEmailNotice}</span>
            <button
              type="button"
              onClick={async () => {
                await sendEmailVerification(firebaseUser).catch(() => {});
                setVerifySent(true);
              }}
              className="font-semibold underline cursor-pointer"
            >
              {verifySent
                ? pickLoc(locale, {
                    ckb: 'ئیمێلی پشتڕاستکردنەوە نێردرا',
                    kmr: 'ئیمێلا پشتڕاستکرنێ هاتە هنارتن',
                    ar: 'تم إرسال بريد التحقق',
                    en: 'Verification email sent',
                  })
                : t.common.resendVerification}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const WorkspaceUtilityBar: React.FC = () => null;
