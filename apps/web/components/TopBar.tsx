import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Globe, Bell, LogOut, User as UserIcon, Search } from 'lucide-react';
import { sendEmailVerification } from 'firebase/auth';
import { useApp } from '../context/AppContext';
import { LOCALE_META, pickLoc } from '../i18n/translations';
import type { ActiveView, Locale } from '../types/domain';
import { Button } from './ui/Primitives';

const LOCALES: Locale[] = ['ckb', 'kmr', 'ar', 'en'];

export const TopBar: React.FC<{ onOpenSearch?: () => void }> = ({ onOpenSearch }) => {
  const {
    locale,
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
  const [verifySent, setVerifySent] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const isStaff = staffRole !== 'user';

  const navItems: { id: ActiveView; label: string }[] = [
    { id: 'home', label: t.nav.home || pickLoc(locale, { ckb: 'سەرەکی', kmr: 'سەرەکی', ar: 'الرئيسية', en: 'Home' }) },
    { id: 'academy', label: t.nav.academy },
    { id: 'challenge', label: t.nav.challenge || pickLoc(locale, { ckb: 'پرسیاری ڕۆژ ⚡', kmr: 'پرسیارا ڕۆژێ ⚡', ar: 'تحدي اليوم ⚡', en: 'Daily Challenge ⚡' }) },
    { id: 'aitools', label: t.nav.aitools || pickLoc(locale, { ckb: 'ئامرازەکانی AI 🤖', kmr: 'ئامرازێن AI 🤖', ar: 'أدوات AI 🤖', en: 'AI Tools & Agents 🤖' }) },
    { id: 'prompts', label: t.nav.prompts || pickLoc(locale, { ckb: 'پرۆمپتە زێڕینەکان 💡', kmr: 'پرۆمپتێن زێڕین 💡', ar: 'الأوامر الذهبية 💡', en: 'AI Prompts 💡' }) },
    { id: 'editor', label: t.nav.editor },
    { id: 'ai', label: t.nav.ai },
    { id: 'discover', label: t.nav.discover },
  ];

  const handleNav = (id: ActiveView) => {
    setActiveView(id);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-40 border-b border-[var(--kj-border)] bg-[var(--kj-paper)]">
      {/* Editorial 3-Zone Header inspired cleanly by dist.zip */}
      <header className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 xl:gap-8">
        {/* Zone 1: Dual-script KARÊJAN brandmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer text-start group"
          aria-label="KARÊJAN Home"
        >
          <span className="kj-brandmark shadow-xs transition-transform group-hover:scale-[1.03]">
            <span>k</span>
            <i className="kj-brandmark-dot" />
          </span>
          <span className="leading-[1.1]">
            <span className="block text-[15px] font-extrabold tracking-[0.04em] text-[var(--kj-ink)]">
              KARÊJAN
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold text-[var(--kj-muted)]">
              {pickLoc(locale, { ckb: 'کاڕێژان', kmr: 'کاڕێژان', ar: 'كاريجان', en: 'Academy' })}
            </span>
          </span>
        </button>

        {/* Zone 2: Crisp single-line navigation links */}
        <nav aria-label="Primary" className="hidden lg:flex flex-1 items-center justify-center gap-2.5 xl:gap-5 overflow-x-auto">
          {navItems.map((item) => {
            const active = activeView === item.id;
            const isLocked = Boolean(
              systemSettings.maintenance?.enabled || systemSettings.maintenance?.lockedTabs?.includes(item.id)
            );
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`inline-flex items-center gap-1 border-b-2 py-2 text-[12.5px] xl:text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-[var(--kj-emerald)] text-[var(--kj-green)]'
                    : 'border-transparent text-[var(--kj-muted-2)] hover:text-[var(--kj-green)]'
                }`}
              >
                <span>{item.label}</span>
                {isLocked && (
                  <span
                    title={pickLoc(locale, {
                      ckb: 'ئەم بەشە لەژێر چاکسازیدایە',
                      kmr: 'ئەڤ بەشە د بن چاکسازیێ دایە',
                      ar: 'هذا القسم قيد الصيانة',
                      en: 'Under maintenance',
                    })}
                    className="inline-flex items-center rounded-full bg-amber-500/20 px-1 text-[10px] text-amber-500"
                  >
                    🛠️
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Quick Search + Theme Icon + Primary Account/CTA + Mobile Drawer */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              title={pickLoc(locale, {
                ckb: 'گەڕانی خێرا (Ctrl+K)',
                kmr: 'لێگەڕیانا بلەز (Ctrl+K)',
                ar: 'بحث سريع (Ctrl+K)',
                en: 'Quick Search (Ctrl+K)',
              })}
              aria-label={t.common.search}
              className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[var(--kj-ink)] hover:bg-[var(--kj-soft-alt)] dark:hover:bg-[#202938] hover:text-[var(--kj-green)] transition-colors cursor-pointer"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? t.common.lightTheme : t.common.darkTheme}
            aria-label="Toggle color mode"
            className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[var(--kj-ink)] hover:bg-[var(--kj-soft-alt)] dark:hover:bg-[#202938] hover:text-[var(--kj-green)] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          {firebaseUser ? (
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAccountMenuOpen((o) => !o)}
                aria-expanded={accountMenuOpen}
              >
                <UserIcon className="h-4 w-4 text-[var(--kj-green)]" />
                <span className="max-w-[110px] truncate">
                  {profile?.displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0]}
                </span>
                {unreadNotifs > 0 && (
                  <span className="font-mono text-[11px] font-bold text-[var(--kj-green)] tabular-nums">
                    ({unreadNotifs})
                  </span>
                )}
              </Button>

              {accountMenuOpen && (
                <div className="absolute end-0 mt-2 w-64 rounded-[9px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] p-3 shadow-xl">
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
                      className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-2 text-start text-sm text-[var(--kj-ink)] hover:bg-[var(--kj-soft-alt)] dark:hover:bg-[#202938] cursor-pointer"
                    >
                      <span>{t.nav.dashboard}</span>
                      {unreadNotifs > 0 && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-[var(--kj-green)] tabular-nums">
                          <Bell className="h-3.5 w-3.5" /> {unreadNotifs}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav('pro')}
                      className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-2 text-start text-sm text-[var(--kj-ink)] hover:bg-[var(--kj-soft-alt)] dark:hover:bg-[#202938] cursor-pointer"
                    >
                      <span>{t.nav.pro}</span>
                    </button>
                    {isStaff && (
                      <button
                        type="button"
                        onClick={() => handleNav('admin')}
                        className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-2 text-start text-sm text-[var(--kj-ink)] hover:bg-[var(--kj-soft-alt)] dark:hover:bg-[#202938] cursor-pointer"
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
                      className="flex w-full items-center gap-2 rounded-[6px] px-2.5 py-2 text-start text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t.common.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={() => setAuthModalOpen(true)}>
              {t.nav.signIn}
            </Button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--kj-border)] text-[var(--kj-ink)] lg:hidden hover:bg-[var(--kj-soft-alt)] dark:hover:bg-[#202938] cursor-pointer"
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
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`rounded-[6px] px-3 py-2.5 text-start text-sm font-semibold cursor-pointer ${
                  activeView === item.id
                    ? 'kj-btn-primary'
                    : 'text-[var(--kj-ink)] hover:bg-[var(--kj-card)] dark:hover:bg-[#202938]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNav('pro')}
              className={`rounded-[6px] px-3 py-2.5 text-start text-sm font-semibold cursor-pointer ${
                activeView === 'pro'
                  ? 'kj-btn-primary'
                  : 'text-[var(--kj-ink)] hover:bg-[var(--kj-card)] dark:hover:bg-[#202938]'
              }`}
            >
              {t.nav.pro}
            </button>
            {isStaff && (
              <button
                type="button"
                onClick={() => handleNav('admin')}
                className={`rounded-[6px] px-3 py-2.5 text-start text-sm font-semibold cursor-pointer ${
                  activeView === 'admin'
                    ? 'kj-btn-primary'
                    : 'text-[var(--kj-ink)] hover:bg-[var(--kj-card)] dark:hover:bg-[#202938]'
                }`}
              >
                {t.nav.admin}
              </button>
            )}
            {firebaseUser && (
              <button
                type="button"
                onClick={() => handleNav('dashboard')}
                className="rounded-[6px] px-3 py-2.5 text-start text-sm font-semibold text-[var(--kj-ink)] hover:bg-[var(--kj-card)] dark:hover:bg-[#202938] cursor-pointer"
              >
                {t.nav.dashboard}
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Email verification reminder */}
      {firebaseUser && !firebaseUser.emailVerified && (
        <div className="border-t border-amber-300 bg-amber-50 px-4 py-2 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2">
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

export const WorkspaceUtilityBar: React.FC = () => {
  const { locale, setLocale, theme, setTheme, t, activeView, setActiveView, effectivePlan, firebaseUser, staffRole } =
    useApp();
  const isStaff = staffRole !== 'user';

  return (
    <div className="border-b border-[var(--kj-border)] bg-[var(--kj-soft)]">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
        {/* Language switcher */}
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t.common.language}>
          <Globe className="me-1 h-3.5 w-3.5 text-[var(--kj-muted)]" />
          {LOCALES.map((code) => {
            const active = locale === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`rounded-[5px] px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'kj-badge'
                    : 'text-[var(--kj-muted-2)] hover:bg-[var(--kj-card)] dark:text-[#cbd5e1] dark:hover:bg-[#202938]'
                }`}
              >
                {LOCALE_META[code].nativeLabel}
              </button>
            );
          })}
        </div>

        {/* Theme toggle + Plan / Admin quick links */}
        <div className="flex items-center gap-3">
          {isStaff && (
            <button
              type="button"
              onClick={() => setActiveView('admin')}
              className={`text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                activeView === 'admin'
                  ? 'text-[var(--kj-green)]'
                  : 'text-[var(--kj-muted-2)] hover:text-[var(--kj-green)]'
              }`}
            >
              {t.nav.admin}
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveView(firebaseUser && activeView === 'pro' ? 'dashboard' : 'pro')}
            className="text-xs font-medium text-[var(--kj-muted-2)] hover:text-[var(--kj-green)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {effectivePlan === 'pro' ? t.common.proPlan : `${t.common.freePlan} · ${t.common.upgradeToPro}`}
          </button>
          <div className="flex items-center rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-paper)] p-0.5">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`inline-flex items-center gap-1 rounded-[4px] px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                theme === 'light'
                  ? 'kj-btn-primary'
                  : 'text-[var(--kj-muted)] hover:text-[var(--kj-ink)]'
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              <span>{t.common.lightTheme}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`inline-flex items-center gap-1 rounded-[4px] px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                theme === 'dark'
                  ? 'kj-btn-primary'
                  : 'text-[var(--kj-muted)] hover:text-[var(--kj-ink)]'
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
              <span>{t.common.darkTheme}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
