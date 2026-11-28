import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Award, Check, Palette } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { APPEARANCE_THEMES } from '../data/themesCatalog';
import { pickLoc } from '../i18n/translations';
import type { Locale, ThemeMode } from '../types/domain';
import { Button, Surface } from './ui/Primitives';

export const DashboardView: React.FC = () => {
  const {
    locale,
    t,
    theme,
    firebaseUser,
    profile,
    effectivePlan,
    subscription,
    notifications,
    markNotificationRead,
    quizAttempts,
    lessons,
    completedLessonIds,
    setActiveView,
    setActiveLessonId,
    setAuthModalOpen,
    updateProfilePreferences,
  } = useApp();

  const [displayName, setDisplayName] = useState(
    profile?.displayName || firebaseUser?.displayName || ''
  );
  const [prefLang, setPrefLang] = useState<Locale>(locale);
  const [prefTheme, setPrefTheme] = useState<ThemeMode>(theme);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    setPrefTheme(theme);
  }, [theme]);

  if (!firebaseUser) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6">
        <Surface className="p-8 text-center">
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{t.common.signInRequired}</p>
          <Button onClick={() => setAuthModalOpen(true)}>{t.nav.signIn}</Button>
        </Surface>
      </div>
    );
  }

  // Compute live 7-day / 1-day expiry warning banner
  const daysUntilExpiry = subscription?.expiresAt
    ? Math.ceil((new Date(subscription.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const completionPct = lessons.length
    ? Math.round((lessons.filter((l) => completedLessonIds.has(l.id)).length / lessons.length) * 100)
    : 0;

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(null);
    await updateProfilePreferences({
      displayName: displayName.trim() || profile?.displayName || 'Learner',
      language: prefLang,
      theme: prefTheme,
    });
    setSavedNotice('Preferences updated.');
  };

  return (
    <div>
      <section className="kj-hero-band">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 text-start">
          <div className="kj-eyebrow">
            <span className="kj-eyebrow-dot" />
            <span>{pickLoc(locale, {
  ckb: 'فێرخواز و پڕۆفایل · LEARNER DASHBOARD',
  kmr: 'قوتابی و پرۆفایل · LEARNER DASHBOARD',
  ar: 'ملف المتعلم · LEARNER DASHBOARD',
  en: 'Learner Dashboard · Profile & Progress',
})}</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-extrabold text-[var(--kj-ink)]">{t.dashboard.title}</h1>
          <p className="mt-1 text-xs text-[var(--kj-muted)]">
            {firebaseUser.email} · {t.common.completion}:{' '}
            <span className="font-mono font-bold text-[var(--kj-green)] tabular-nums">{completionPct}%</span>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">

      {/* Live Expiry Warning Banner (7-day / 1-day / expired) */}
      {effectivePlan === 'pro' && daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <span>
            {daysUntilExpiry <= 1
              ? 'Your KARÊJAN Pro subscription expires within 24 hours. Renew now to keep uninterrupted access.'
              : `Your KARÊJAN Pro subscription expires in ${daysUntilExpiry} days (${subscription?.expiresAt.slice(0, 10)}).`}
          </span>
          <Button size="sm" variant="violet" onClick={() => setActiveView('pro')}>
            {t.dashboard.renewPro}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Subscription Lifecycle Card */}
        <Surface className="p-6 lg:col-span-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--kj-ink)]">
              {t.dashboard.subscriptionCard}
            </h2>
            <Calendar className="h-4 w-4 text-[var(--kj-muted)]" />
          </div>
          <p className="text-xl font-bold text-[var(--kj-ink)]">
            {effectivePlan === 'pro' ? t.common.proPlan : t.common.freePlan}
          </p>
          <p className="mt-1 text-xs text-[var(--kj-muted)]">
            Status: <span className="font-semibold capitalize">{subscription?.status || profile?.subscriptionStatus || 'none'}</span>
            {subscription?.expiresAt && ` · ${t.dashboard.expiresOn} ${subscription.expiresAt.slice(0, 10)}`}
          </p>
          <p className="mt-3 text-xs leading-5 text-[var(--kj-muted-2)]">
            {effectivePlan === 'pro' ? t.pro.proFairUseNote : t.pro.freeFairUseNote}
          </p>
          <div className="mt-5">
            <Button variant="violet" size="sm" onClick={() => setActiveView('pro')}>
              {effectivePlan === 'pro' ? t.dashboard.renewPro : t.common.upgradeToPro}
            </Button>
          </div>
        </Surface>

        {/* Profile Preferences Card */}
        <Surface className="p-6 lg:col-span-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-[var(--kj-ink)]">
              {t.dashboard.profileSettings}
            </h2>
            <button
              type="button"
              onClick={() => setActiveView('appearance')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--kj-soft)] px-3 py-1.5 text-xs font-bold text-[var(--kj-green)] hover:bg-[var(--kj-elevated)] cursor-pointer"
            >
              <Palette className="h-3.5 w-3.5" />
              <span>
                {pickLoc(locale, {
                  ckb: 'گالەری ٦ ڕووکار »',
                  kmr: 'Galeriya ٦ Rûkaran »',
                  ar: 'معرض المظاهر (٦) »',
                  en: 'Visual Theme Gallery »',
                })}
              </span>
            </button>
          </div>
          <form onSubmit={saveProfile} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--kj-muted-2)]">
                {t.auth.displayName}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={100}
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 text-sm text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--kj-muted-2)]">
                {t.common.language}
              </label>
              <select
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value as Locale)}
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 text-sm text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
              >
                <option value="ckb">کوردی (سۆرانی)</option>
                <option value="kmr">کوردی (بادینی)</option>
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--kj-muted-2)]">
                {t.common.theme}
              </label>
              <select
                value={prefTheme}
                onChange={(e) => setPrefTheme(e.target.value as ThemeMode)}
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 text-sm text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
              >
                {APPEARANCE_THEMES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {pickLoc(locale, item.names)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 sm:col-span-3">
              <Button type="submit" size="sm">
                {t.common.save}
              </Button>
              {savedNotice && (
                <span className="text-xs font-semibold text-[var(--kj-green)]">{savedNotice}</span>
              )}
            </div>
          </form>
        </Surface>

        {/* Notifications */}
        <Surface className="p-6 lg:col-span-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">
              {t.dashboard.notificationsTitle}
            </h2>
            <Bell className="h-4 w-4 text-slate-400" />
          </div>
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.dashboard.noNotifications}</p>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-lg border p-3 text-xs ${
                    n.read
                      ? 'border-slate-200 bg-slate-50/50 dark:border-[#2b3442] dark:bg-[#151b26]/60'
                      : 'kj-callout border-[var(--kj-emerald)]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white">{n.title}</p>
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => void markNotificationRead(n.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--kj-green)] hover:underline cursor-pointer"
                      >
                        <Check className="h-3 w-3" /> Read
                      </button>
                    )}
                  </div>
                  <p className="mt-1 leading-5 text-slate-600 dark:text-slate-300">{n.body}</p>
                </div>
              ))}
            </div>
          )}
        </Surface>

        {/* Quiz Attempt History */}
        <Surface className="p-6 lg:col-span-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">
              {t.dashboard.quizHistoryTitle}
            </h2>
            <Award className="h-4 w-4 text-slate-400" />
          </div>
          {quizAttempts.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.dashboard.noQuizAttempts}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 dark:border-[#2b3442] dark:text-slate-400">
                    <th className="py-2 text-start font-medium">Quiz</th>
                    <th className="py-2 text-start font-medium">Type</th>
                    <th className="py-2 text-start font-medium">Score</th>
                    <th className="py-2 text-start font-medium">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#2b3442]">
                  {quizAttempts.map((att) => (
                    <tr key={att.id}>
                      <td className="py-2.5 font-medium">{att.quizId}</td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-400">
                        {att.quizType.replace('_', ' ')} · {att.difficulty}
                        {att.timedOut ? ' · Timed Out' : ''}
                      </td>
                      <td className="py-2.5 font-mono font-semibold tabular-nums">
                        {att.scorePercent}% ({att.correctCount}/{att.totalQuestions})
                      </td>
                      <td className="py-2.5">
                        {att.recommendedLessonIds && att.recommendedLessonIds.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveLessonId(att.recommendedLessonIds![0]);
                              setActiveView('academy');
                            }}
                            className="text-[var(--kj-green)] hover:underline cursor-pointer"
                          >
                            Review lesson
                          </button>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">Passed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Surface>
      </div>
      </div>
    </div>
  );
};
