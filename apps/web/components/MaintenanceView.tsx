import React from 'react';
import {
  Wrench,
  Clock,
  ShieldAlert,
  ArrowRight,
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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { pickLoc } from '../i18n/translations';
import type { ActiveView, Locale } from '../types/domain';
import { Button } from './ui/Primitives';

interface MaintenanceViewProps {
  view?: ActiveView;
  isGlobal?: boolean;
  message?: string;
  estimatedReturn?: string;
}

const VIEW_METADATA: Record<
  ActiveView,
  { names: Record<Locale, string>; icon: React.ComponentType<{ className?: string }> }
> = {
  home: {
    names: { ckb: 'پەڕەی سەرەکی', kmr: 'بەرپەڕێ سەرەکی', ar: 'الصفحة الرئيسية', en: 'Home Page' },
    icon: Home,
  },
  challenge: {
    names: { ckb: 'پرسیاری ڕۆژ و چاڵنجی خێرا', kmr: 'پرسیارا ڕۆژێ و چالێنجا بلەز', ar: 'تحدي اليوم البرمجي', en: 'Daily Code Challenge' },
    icon: Zap,
  },
  aitools: {
    names: { ckb: 'ئامرازەکانی AI و ئەیجنتەکان', kmr: 'ئامرازێن AI و ئەجێنتان', ar: 'أدوات الذكاء الاصطناعي والوكلاء', en: 'TOP 50 AI Tools & Agents' },
    icon: Bot,
  },
  prompts: {
    names: { ckb: 'پرۆمپتە زێڕینەکان', kmr: 'پرۆمپتێن زێڕین', ar: 'الأوامر الذهبية', en: 'Golden AI Prompts' },
    icon: Flame,
  },
  academy: {
    names: { ckb: 'ئەکادیمیای وانەکان', kmr: 'ئەکادیمیایا وانەیان', ar: 'الأكاديمية التعليمية', en: 'Academy & Courses' },
    icon: BookOpen,
  },
  editor: {
    names: { ckb: 'تاقیگەی کۆد (Code Lab)', kmr: 'تاقیگەها کۆدی (Code Lab)', ar: 'مختبر الكود', en: 'Code Lab & Editor' },
    icon: Code2,
  },
  ai: {
    names: { ckb: 'مێشکی زیرەکی دەستکرد (AI)', kmr: 'یاریدەدەرێ AI', ar: 'المساعد الذكي (AI)', en: 'KARÊJAN AI Assistant' },
    icon: Sparkles,
  },
  practice: {
    names: { ckb: 'ڕاهێنان و تاقیکردنەوەکان', kmr: 'ڕاهێنان و ئەزموون', ar: 'التمارين والاختبارات', en: 'Practice & Quizzes' },
    icon: CheckCircle2,
  },
  discover: {
    names: { ckb: 'گەڕان و سەرچاوەکان', kmr: 'ڤەدیتن و ژێدەر', ar: 'الاستكشاف والموارد', en: 'Discovery & Resources' },
    icon: Compass,
  },
  pro: {
    names: { ckb: 'بەشداریکردنی Pro', kmr: 'بەشداریکرنا Pro', ar: 'خطة Pro', en: 'Pro Subscription' },
    icon: Crown,
  },
  dashboard: {
    names: { ckb: 'داشبۆردی بەکارهێنەر', kmr: 'داشبۆردا بکارهێنەری', ar: 'لوحة المستخدم', en: 'User Dashboard' },
    icon: LayoutDashboard,
  },
  admin: {
    names: { ckb: 'پەنێلی ئەدمین', kmr: 'پەنێلا ڕێڤەبەریێ', ar: 'لوحة الإدارة', en: 'Admin Panel' },
    icon: ShieldAlert,
  },
};

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  view = 'academy',
  isGlobal = false,
  message,
  estimatedReturn,
}) => {
  const { locale, isRtl, setActiveView, systemSettings, firebaseUser, setAuthModalOpen } = useApp();
  const currentMeta = VIEW_METADATA[view] || VIEW_METADATA.academy;
  const TargetIcon = currentMeta.icon;
  const sectionName = pickLoc(locale, currentMeta.names);

  const maintenance = systemSettings.maintenance;
  const lockedTabs = maintenance?.lockedTabs || [];

  // Find other tabs that are currently NOT in maintenance
  const availableViews: ActiveView[] = (
    ['home', 'challenge', 'aitools', 'prompts', 'academy', 'editor', 'practice', 'ai', 'discover', 'dashboard'] as ActiveView[]
  ).filter((v) => v !== view && !lockedTabs.includes(v));

  const displayMessage =
    (message && message.trim()) ||
    pickLoc(locale, {
      ckb: 'تیمەکەمان سەرقاڵی باشترکردن، چاکسازی و زیادکردنی تایبەتمەندی نوێیە بۆ ئەم بەشە تا باشترین ئەزموونت پێشکەش بکات. سوپاس بۆ ئارامگریت.',
      kmr: 'تیمێ مە خەریکی باشترکرن، چاکسازی و زێدەکرنا تایبەتمەندییێن نوو یە بۆ ڤی بەشی دا کو باشترین ئەزموونێ پێشکێش بکەین. سوپاس بۆ بێهنفرەهییا تە.',
      ar: 'يعمل فريقنا حالياً على تحسين هذا القسم وإجراء صيانة مجدولة لتقديم أفضل تجربة تعليمية. شكراً لصبركم.',
      en: 'Our engineering team is currently performing maintenance and system upgrades to provide you with the best possible experience. Thank you for your patience.',
    });

  const displayReturn =
    (estimatedReturn && estimatedReturn.trim()) ||
    pickLoc(locale, {
      ckb: 'بە زووترین کات دەگەڕێینەوە',
      kmr: 'دێ ب زووترین دەم ڤەگەڕین',
      ar: 'سنعود قريباً',
      en: 'Returning shortly',
    });

  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-160px)] max-w-4xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-500">
          <Wrench className="h-9 w-9" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--kj-border)] bg-[var(--kj-card)] text-[var(--kj-green)]">
          <TargetIcon className="h-4 w-4" />
        </div>
      </div>

      <div className="kj-eyebrow mb-4">
        <span className="kj-eyebrow-dot" />
        <span>
          {isGlobal
            ? pickLoc(locale, {
              ckb: 'دۆخی چاکسازی گشتی پلاتفۆرم',
              kmr: 'دۆخێ چاکسازییا گشتی یا پلاتفۆرمێ',
              ar: 'وضع الصيانة العام للمنصة',
              en: 'Global Platform Maintenance',
            })
            : pickLoc(locale, {
              ckb: 'دۆخی چاکسازی ئەم بەشە',
              kmr: 'دۆخێ چاکسازیێ یێ ڤی بەشی',
              ar: 'هذا القسم قيد الصيانة',
              en: 'Section Under Maintenance',
            })}
        </span>
      </div>

      <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-[var(--kj-ink)] sm:text-3xl">
        {isGlobal
          ? pickLoc(locale, {
            ckb: 'پلاتفۆرمی کاڕێژان لەژێر چاکسازی و نوێکردنەوەدایە 🛠️',
            kmr: 'پلاتفۆرما کاڕێژان د بن چاکسازی و نوێکرنێ دایە 🛠️',
            ar: 'منصة KARÊJAN قيد الصيانة والتحديث حالياً 🛠️',
            en: 'KARÊJAN Platform is Under Maintenance 🛠️',
          })
          : pickLoc(locale, {
            ckb: `بەشی ${sectionName} لەژێر چاکسازیدایە 🛠️`,
            kmr: `بەشێ ${sectionName} د بن چاکسازیێ دایە 🛠️`,
            ar: `قسم ${sectionName} قيد الصيانة حالياً 🛠️`,
            en: `${sectionName} is Under Maintenance 🛠️`,
          })}
      </h1>

      <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-[var(--kj-muted-2)]">
        {displayMessage}
      </p>

      <div className="mb-8 inline-flex items-center gap-2.5 rounded-[7px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-4 py-2.5 text-xs text-[var(--kj-ink)]">
        <Clock className="h-4 w-4 text-amber-500" />
        <span>
          <strong>
            {pickLoc(locale, {
              ckb: 'کاتی پێشبینیکراو:',
              kmr: 'دەمێ پێشبینی کری:',
              ar: 'العودة المتوقعة:',
              en: 'Estimated Return:',
            })}
          </strong>{' '}
          {displayReturn}
        </span>
      </div>

      {!isGlobal && availableViews.length > 0 && (
        <div className="w-full max-w-2xl rounded-[9px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-6">
          <h3 className="mb-1 text-sm font-bold text-[var(--kj-ink)]">
            {pickLoc(locale, {
              ckb: 'دەتوانیت لەم کاتەدا سەردانی ئەم بەشانەی تر بکەیت:',
              kmr: 'د ڤی دەمی دا تو دشێی سەرەدانا ڤان بەشێن دی بکەی:',
              ar: 'يمكنك تصفح الأقسام الأخرى المتاحة حالياً:',
              en: 'You can explore other available sections right now:',
            })}
          </h3>
          <p className="mb-4 text-xs text-[var(--kj-muted)]">
            {pickLoc(locale, {
              ckb: 'ئەم بەشانەی خوارەوە بە تەواوی کراوەن و کێشەیان نییە',
              kmr: 'ئەڤ بەشێن ل خوارێ ب تەمامەتی ڤەکرینە و ئاریشە نینن',
              ar: 'الأقسام التالية تعمل بشكل طبيعي بالكامل',
              en: 'These areas are currently operating normally',
            })}
          </p>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {availableViews.map((altView) => {
              const meta = VIEW_METADATA[altView];
              const Icon = meta.icon;
              return (
                <button
                  key={altView}
                  type="button"
                  onClick={() => setActiveView(altView)}
                  className="flex items-center justify-between rounded-[7px] border border-[var(--kj-border)] bg-[var(--kj-soft)] p-3 text-xs font-semibold text-[var(--kj-ink)] transition-colors hover:border-[var(--kj-emerald)] hover:bg-[var(--kj-elevated)] cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="kj-course-icon flex h-7 w-7 items-center justify-center">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span>{pickLoc(locale, meta.names)}</span>
                  </div>
                  <ArrowRight className={`h-3.5 w-3.5 text-[var(--kj-muted)] ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!firebaseUser && (
        <div className="mt-8 text-xs text-[var(--kj-muted)]">
          <span>
            {pickLoc(locale, {
              ckb: 'ئەندامی ستاف یان ئەدمینیت؟',
              kmr: 'تو ئەندامێ ستاف یان ئەدمینی؟',
              ar: 'هل أنت من فريق الإدارة أو الإشراف؟',
              en: 'Are you a staff member or administrator?',
            })}
          </span>{' '}
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="font-bold text-[var(--kj-green)] hover:underline cursor-pointer"
          >
            {pickLoc(locale, {
              ckb: 'چوونەژوورەوەی ستاف',
              kmr: 'چوونەژوورا ستافی',
              ar: 'تسجيل دخول الإدارة',
              en: 'Staff Sign In',
            })}
          </button>
        </div>
      )}
    </div>
  );
};
