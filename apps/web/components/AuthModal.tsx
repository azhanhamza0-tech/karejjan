import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { useApp } from '../context/AppContext';
import type { Locale } from '../types/domain';

type AuthMode = 'login' | 'register' | 'reset';

interface AuthVisualCopy {
  eyebrow: string;
  loginSubtitle: string;
  registerSubtitle: string;
  resetSubtitle: string;
  benefitOne: string;
  benefitTwo: string;
  benefitThree: string;
  trustNote: string;
  divider: string;
  passwordHint: string;
  terms: string;
  close: string;
  showPassword: string;
  hidePassword: string;
  genericError: string;
  invalidCredentials: string;
  invalidEmail: string;
  emailInUse: string;
  weakPassword: string;
  tooManyRequests: string;
  networkError: string;
}

const VISUAL_COPY: Record<Locale, AuthVisualCopy> = {
  en: {
    eyebrow: 'Learn · Build · Grow',
    loginSubtitle: 'Welcome back. Continue your learning journey from where you left off.',
    registerSubtitle: 'Create your free account and turn every lesson into real progress.',
    resetSubtitle: 'Enter your email and we will send you a secure password reset link.',
    benefitOne: 'Structured, practical coding paths',
    benefitTwo: 'Save progress across every device',
    benefitThree: 'Learn in Kurdish, Arabic, or English',
    trustNote: 'Your learning space is private and secure.',
    divider: 'or continue with email',
    passwordHint: 'Use at least 6 characters',
    terms: 'By continuing, you agree to use KARÊJAN responsibly.',
    close: 'Close sign-in dialog',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    genericError: 'We could not complete that request. Please try again.',
    invalidCredentials: 'The email or password is incorrect. Please check and try again.',
    invalidEmail: 'Enter a valid email address.',
    emailInUse: 'An account already exists for this email. Try signing in instead.',
    weakPassword: 'Choose a stronger password with at least 6 characters.',
    tooManyRequests: 'Too many attempts. Please wait a moment and try again.',
    networkError: 'Check your internet connection and try again.',
  },
  ar: {
    eyebrow: 'تعلّم · طبّق · تطوّر',
    loginSubtitle: 'مرحباً بعودتك. واصل رحلة التعلّم من حيث توقفت.',
    registerSubtitle: 'أنشئ حسابك المجاني وحوّل كل درس إلى تقدّم حقيقي.',
    resetSubtitle: 'أدخل بريدك وسنرسل إليك رابطاً آمناً لإعادة تعيين كلمة المرور.',
    benefitOne: 'مسارات برمجية عملية ومنظمة',
    benefitTwo: 'احفظ تقدّمك على جميع أجهزتك',
    benefitThree: 'تعلّم بالكردية أو العربية أو الإنجليزية',
    trustNote: 'مساحة تعلّمك خاصة وآمنة.',
    divider: 'أو تابع باستخدام البريد الإلكتروني',
    passwordHint: 'استخدم 6 أحرف على الأقل',
    terms: 'بالمتابعة، أنت توافق على استخدام KARÊJAN بمسؤولية.',
    close: 'إغلاق نافذة تسجيل الدخول',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    genericError: 'تعذر إكمال الطلب. حاول مرة أخرى.',
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    invalidEmail: 'أدخل بريداً إلكترونياً صحيحاً.',
    emailInUse: 'يوجد حساب بهذا البريد. حاول تسجيل الدخول بدلاً من ذلك.',
    weakPassword: 'اختر كلمة مرور أقوى من 6 أحرف على الأقل.',
    tooManyRequests: 'محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.',
    networkError: 'تحقق من اتصال الإنترنت ثم حاول مجدداً.',
  },
  ckb: {
    eyebrow: 'فێربە · دروستبکە · گەشەبکە',
    loginSubtitle: 'بەخێربێیتەوە. لەو شوێنەی وەستاویت بەردەوام بە لە گەشتی فێربوونت.',
    registerSubtitle: 'هەژماری بێبەرامبەرت دروست بکە و هەر وانەیەک بکە بە پێشکەوتنی ڕاستەقینە.',
    resetSubtitle: 'ئیمەیڵەکەت بنووسە؛ بەستەرێکی پارێزراوی گۆڕینی وشەی نهێنیت بۆ دەنێرین.',
    benefitOne: 'ڕێڕەوی ڕێکخراو و کرداری بەرنامەسازی',
    benefitTwo: 'پاشەکەوتکردنی پێشکەوتن لە هەموو ئامێرەکان',
    benefitThree: 'فێربوون بە کوردی، عەرەبی یان ئینگلیزی',
    trustNote: 'بۆشایی فێربوونەکەت تایبەت و پارێزراوە.',
    divider: 'یان بە ئیمەیڵ بەردەوام بە',
    passwordHint: 'لانیکەم ٦ پیت بەکاربهێنە',
    terms: 'بە بەردەوامبوون، ڕازی دەبیت KARÊJAN بە بەرپرسیاری بەکاربهێنیت.',
    close: 'داخستنی پەنجەرەی چوونەژوورەوە',
    showPassword: 'پیشاندانی وشەی نهێنی',
    hidePassword: 'شاردنەوەی وشەی نهێنی',
    genericError: 'نەتوانرا داواکارییەکە تەواو بکرێت. دووبارە هەوڵ بدەرەوە.',
    invalidCredentials: 'ئیمەیڵ یان وشەی نهێنی هەڵەیە. دووبارە بپشکنەوە.',
    invalidEmail: 'ئیمەیڵێکی دروست بنووسە.',
    emailInUse: 'پێشتر هەژمارێک بەم ئیمەیڵە دروست کراوە. بچۆ ژوورەوە.',
    weakPassword: 'وشەی نهێنییەکی بەهێزتر بە لانیکەم ٦ پیت هەڵبژێرە.',
    tooManyRequests: 'هەوڵی زۆر دراوە. کەمێک چاوەڕێ بکە و دووبارە هەوڵ بدە.',
    networkError: 'پەیوەندی ئینتەرنێت بپشکنە و دووبارە هەوڵ بدەرەوە.',
  },
  kmr: {
    eyebrow: 'Hîn bibe · Çêbike · Pêşbikeve',
    loginSubtitle: 'Bi xêr hatî dîsa. Ji cihê ku rawestiyabûyî rêwîtiya xwe bidomîne.',
    registerSubtitle: 'Hesabê xwe yê belaş çêbike û her dersê bike pêşketineke rastîn.',
    resetSubtitle: 'E-nameya xwe binivîse; em ê lînka ewle ya nûkirina şîfreyê bişînin.',
    benefitOne: 'Rêyên bernamekirinê yên birêkûpêk û pratîk',
    benefitTwo: 'Pêşketina xwe li ser hemû amûran biparêze',
    benefitThree: 'Bi Kurdî, Erebî an Îngilîzî hîn bibe',
    trustNote: 'Cihê hînbûna te taybet û ewle ye.',
    divider: 'an bi e-nameyê bidomîne',
    passwordHint: 'Herî kêm 6 tîpan bi kar bîne',
    terms: 'Bi domandinê, tu qebûl dikî KARÊJAN bi berpirsiyarî bi kar bînî.',
    close: 'Paceya têketinê bigire',
    showPassword: 'Şîfreyê nîşan bide',
    hidePassword: 'Şîfreyê veşêre',
    genericError: 'Daxwaz nehat temamkirin. Ji kerema xwe dîsa biceribîne.',
    invalidCredentials: 'E-name an şîfre şaş e. Dîsa kontrol bike.',
    invalidEmail: 'E-nameyeke derbasdar binivîse.',
    emailInUse: 'Hesabek bi vê e-nameyê heye. Hewl bide têkevî.',
    weakPassword: 'Şîfreyeke bi hêztir bi herî kêm 6 tîpan hilbijêre.',
    tooManyRequests: 'Ceribandin zêde bûn. Hinekî bisekine û dîsa biceribîne.',
    networkError: 'Girêdana înternetê kontrol bike û dîsa biceribîne.',
  },
};

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z" />
    <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.05v2.62A10 10 0 0 0 12 22Z" />
    <path fill="#FBBC05" d="M6.39 13.93A6.02 6.02 0 0 1 6.08 12c0-.67.11-1.32.31-1.93V7.45H3.05A10 10 0 0 0 2 12c0 1.61.38 3.14 1.05 4.55l3.34-2.62Z" />
    <path fill="#EA4335" d="M12 5.94c1.47 0 2.79.5 3.82 1.49l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.95 5.45l3.34 2.62C7.18 7.7 9.39 5.94 12 5.94Z" />
  </svg>
);

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, t, locale, isRtl } = useApp();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const copy = VISUAL_COPY[locale];

  useEffect(() => {
    if (!authModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) setAuthModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [authModalOpen, busy, setAuthModalOpen]);

  if (!authModalOpen) return null;

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

  const changeMode = (nextMode: AuthMode) => {
    resetMessages();
    setShowPassword(false);
    setMode(nextMode);
  };

  const getFriendlyError = (err: unknown) => {
    const code = (err as { code?: string })?.code ?? '';
    if (code === 'auth/operation-not-allowed') {
      return 'Email/Password sign-in is not enabled for this Firebase project.';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
      return copy.invalidCredentials;
    }
    if (code === 'auth/invalid-email') return copy.invalidEmail;
    if (code === 'auth/email-already-in-use') return copy.emailInUse;
    if (code === 'auth/weak-password') return copy.weakPassword;
    if (code === 'auth/too-many-requests') return copy.tooManyRequests;
    if (code === 'auth/network-request-failed') return copy.networkError;
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return null;
    return copy.genericError;
  };

  const handleGoogle = async () => {
    resetMessages();
    setBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setAuthModalOpen(false);
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    resetMessages();
    setBusy(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setAuthModalOpen(false);
      } else if (mode === 'register') {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (displayName.trim()) {
          await updateProfile(credential.user, { displayName: displayName.trim() });
        }
        await sendEmailVerification(credential.user).catch(() => {});
        setAuthModalOpen(false);
      } else {
        await sendPasswordResetEmail(auth, email.trim());
        setInfo(t.auth.resetSent);
      }
    } catch (err) {
      setError(getFriendlyError(err));
    } finally {
      setBusy(false);
    }
  };

  const title = mode === 'login' ? t.auth.signInTitle : mode === 'register' ? t.auth.registerTitle : t.auth.resetTitle;
  const subtitle = mode === 'login' ? copy.loginSubtitle : mode === 'register' ? copy.registerSubtitle : copy.resetSubtitle;
  const DirectionArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#080c14]/80 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) setAuthModalOpen(false);
      }}
    >
      <div className="relative grid w-full max-w-[980px] overflow-hidden rounded-[12px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] shadow-[0_32px_100px_-24px_rgba(2,6,23,0.8)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden min-h-[660px] overflow-hidden bg-[#17272c] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -start-24 -top-24 h-72 w-72 rounded-full bg-[#059669]/25 blur-3xl" />
          <div className="absolute -bottom-32 -end-20 h-80 w-80 rounded-full bg-[#36CFC9]/20 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:32px_32px]" />

          <div className="relative z-10">
            <div className="mb-10 flex items-center gap-3">
              <div className="kj-brandmark h-11 w-11 text-[26px]">
                <span>k</span>
                <i className="kj-brandmark-dot" />
              </div>
              <div>
                <p className="text-lg font-extrabold tracking-[0.12em]">KARÊJAN</p>
                <p className="text-[11px] font-medium text-[#9af0c7]">کاڕێژان · CODING ACADEMY</p>
              </div>
            </div>

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#36d399]/30 bg-[#203b37] px-3 py-1.5 text-xs font-semibold text-[#9af0c7]">
              <Sparkles className="h-3.5 w-3.5" />
              {copy.eyebrow}
            </div>
            <h2 className="max-w-sm text-4xl font-black leading-[1.35] tracking-tight">
              {copy.loginSubtitle}
            </h2>
          </div>

          <div className="relative z-10 space-y-4">
            {[copy.benefitOne, copy.benefitTwo, copy.benefitThree].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm font-medium text-slate-100">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#203b37] text-[#9af0c7]">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <span>{benefit}</span>
              </div>
            ))}
            <div className="mt-7 flex items-center gap-2 border-t border-white/10 pt-6 text-xs text-[#bdc8d6]">
              <ShieldCheck className="h-4 w-4 text-[#72e2b5]" />
              {copy.trustNote}
            </div>
          </div>
        </section>

        <section className="relative flex min-h-[620px] flex-col justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
          <button
            type="button"
            onClick={() => setAuthModalOpen(false)}
            disabled={busy}
            aria-label={copy.close}
            className="absolute end-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-[7px] border border-[var(--kj-border)] bg-[var(--kj-soft)] text-[var(--kj-muted)] transition hover:bg-[var(--kj-elevated)] hover:text-[var(--kj-ink)] disabled:cursor-not-allowed disabled:opacity-50 sm:end-6 sm:top-6"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mx-auto w-full max-w-[430px]">
            <div className="mb-7 pe-10">
              <div className="mb-5 flex items-center gap-2 lg:hidden">
                <div className="kj-brandmark"><span>k</span><i className="kj-brandmark-dot" /></div>
                <span className="font-extrabold tracking-[0.08em] text-[var(--kj-ink)]">KARÊJAN</span>
              </div>
              <h1 id="auth-dialog-title" className="text-2xl font-black tracking-tight text-[var(--kj-ink)] sm:text-[30px]">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[var(--kj-muted)]">{subtitle}</p>
            </div>

            {mode !== 'reset' && (
              <div className="mb-6 grid grid-cols-2 rounded-[7px] border border-[var(--kj-border)] bg-[var(--kj-soft)] p-1" aria-label="Account access mode">
                <button
                  type="button"
                  onClick={() => changeMode('login')}
                  className={`min-h-10 cursor-pointer rounded-[5px] px-3 text-sm font-bold transition ${
                    mode === 'login'
                      ? 'kj-btn-primary'
                      : 'text-[var(--kj-muted)] hover:text-[var(--kj-ink)]'
                  }`}
                >
                  {t.auth.signInBtn}
                </button>
                <button
                  type="button"
                  onClick={() => changeMode('register')}
                  className={`min-h-10 cursor-pointer rounded-[5px] px-3 text-sm font-bold transition ${
                    mode === 'register'
                      ? 'kj-btn-primary'
                      : 'text-[var(--kj-muted)] hover:text-[var(--kj-ink)]'
                  }`}
                >
                  {t.auth.registerBtn}
                </button>
              </div>
            )}

            {mode !== 'reset' && (
              <button
                type="button"
                disabled={busy}
                onClick={handleGoogle}
                className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-[7px] border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-4 text-sm font-bold text-[var(--kj-ink)] transition hover:bg-[var(--kj-elevated)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <GoogleMark />
                {t.auth.continueWithGoogle}
              </button>
            )}

            {mode !== 'reset' && (
              <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--kj-muted)]">
                <span className="h-px flex-1 bg-[var(--kj-border)]" />
                <span>{copy.divider}</span>
                <span className="h-px flex-1 bg-[var(--kj-border)]" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-[var(--kj-ink)]">{t.auth.displayName}</span>
                  <span className="relative block">
                    <UserRound className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--kj-muted)]" />
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      autoComplete="name"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      className="min-h-12 w-full rounded-[7px] border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] ps-10 pe-4 text-sm text-[var(--kj-ink)] outline-none transition placeholder:text-[var(--kj-muted)] focus:border-[var(--kj-green)]"
                    />
                  </span>
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[var(--kj-ink)]">{t.auth.email}</span>
                <span className="relative block">
                  <Mail className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--kj-muted)]" />
                  <input
                    type="email"
                    inputMode="email"
                    required
                    autoFocus
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="min-h-12 w-full rounded-[7px] border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] ps-10 pe-4 text-start text-sm text-[var(--kj-ink)] outline-none transition placeholder:text-[var(--kj-muted)] focus:border-[var(--kj-green)]"
                    dir="ltr"
                  />
                </span>
              </label>

              {mode !== 'reset' && (
                <label className="block">
                  <span className="mb-1.5 flex items-center justify-between gap-3 text-xs font-bold text-[var(--kj-ink)]">
                    <span>{t.auth.password}</span>
                    {mode === 'login' && (
                      <button type="button" onClick={() => changeMode('reset')} className="cursor-pointer font-semibold text-[var(--kj-green)] hover:underline">
                        {t.auth.forgotPassword}
                      </button>
                    )}
                  </span>
                  <span className="relative block">
                    <LockKeyhole className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--kj-muted)]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="min-h-12 w-full rounded-[7px] border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] ps-10 pe-11 text-start text-sm text-[var(--kj-ink)] outline-none transition focus:border-[var(--kj-green)]"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? copy.hidePassword : copy.showPassword}
                      className="absolute end-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-[var(--kj-muted)] transition hover:bg-[var(--kj-elevated)] hover:text-[var(--kj-ink)]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                  {mode === 'register' && <span className="mt-1.5 block text-[11px] text-[var(--kj-muted)]">{copy.passwordHint}</span>}
                </label>
              )}

              {error && (
                <div role="alert" className="rounded-[7px] border border-red-400/50 bg-red-500/10 px-3.5 py-3 text-xs leading-5 text-red-500">
                  {error}
                </div>
              )}
              {info && (
                <div role="status" className="rounded-[7px] border border-[var(--kj-emerald)]/40 bg-[var(--kj-badge-bg)] px-3.5 py-3 text-xs leading-5 text-[var(--kj-badge-ink)]">
                  {info}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="kj-btn-primary flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[7px] px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <DirectionArrow className="h-4 w-4" />}
                {mode === 'login' ? t.auth.signInBtn : mode === 'register' ? t.auth.registerBtn : t.auth.sendResetBtn}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-[var(--kj-muted)]">
              {mode === 'reset' ? (
                <button type="button" onClick={() => changeMode('login')} className="cursor-pointer font-bold text-[var(--kj-green)] hover:underline">
                  {t.auth.backToSignIn}
                </button>
              ) : (
                <p className="leading-5">{copy.terms}</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
