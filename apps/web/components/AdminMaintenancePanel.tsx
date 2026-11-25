import React, { useEffect, useState, useMemo } from 'react';
import {
  Wrench,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Code2,
  CheckSquare,
  Compass,
  Crown,
  LayoutDashboard,
  Save,
  Clock,
  Radio,
  Zap,
  Home,
  Flame,
} from 'lucide-react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { apiFetch } from '../lib/api';
import { useApp } from '../context/AppContext';
import { pickLoc } from '../i18n/translations';
import { Button, Surface } from './ui/Primitives';
import type { ActiveView, Locale, MaintenanceConfig } from '../types/domain';

interface AdminMaintenancePanelProps {
  onAudit: (
    action: string,
    targetCollection: string,
    targetId: string,
    reason?: string,
    before?: Record<string, unknown>,
    after?: Record<string, unknown>
  ) => Promise<void>;
  onBanner: (type: 'ok' | 'err', text: string) => void;
}

interface TabMetadata {
  id: ActiveView;
  names: Record<Locale, string>;
  descs: Record<Locale, string>;
  icon: React.ComponentType<{ className?: string }>;
}

const CORE_TAB_METADATA: Record<ActiveView, TabMetadata> = {
  challenge: {
    id: 'challenge',
    names: {
      ckb: 'پرسیاری ڕۆژ و چاڵنجی خێرا (Daily Challenge ⚡)',
      kmr: 'پرسیارا ڕۆژێ و چالێنجا بلەز (Daily Challenge ⚡)',
      ar: 'تحدي اليوم البرمجي ⚡',
      en: 'Daily Code Challenge & Champions',
    },
    descs: {
      ckb: 'چاڵنجی ٢٤ کاتژمێری پرۆگرامینگ، تاقیکردنەوە و تابلۆی پاڵەوانانی ئەمڕۆ',
      kmr: 'چالێنجا ٢٤ دەمژمێری یا پرۆگرامسازیێ و لیستا قارەمانێن ئەڤرۆ',
      ar: 'تحدي البرمجة كل ٢٤ ساعة، الاختبارات ولوحة أبطال اليوم',
      en: '24-hour coding challenge, test runner, and daily champions leaderboard',
    },
    icon: Zap,
  },
  aitools: {
    id: 'aitools',
    names: {
      ckb: 'ئامرازەکانی AI و ئەیجنتەکان (TOP 50 AI Hub)',
      kmr: 'ئامرازێن AI و ئەجێنتان (TOP 50 AI Hub)',
      ar: 'أدوات الذكاء الاصطناعي والوكلاء (TOP 50)',
      en: 'TOP 50 AI Tools & Agents Hub',
    },
    descs: {
      ckb: 'پێڕستی ٥٠ ئامرازی پێشەنگی زیرەکی دەستکرد، ئەیجنتە خۆکارەکان و مۆدێلەکان بۆ پرۆگرامەران',
      kmr: 'لیستا ٥٠ باشترین ئامرازێن زیرەکییا دەستکرد و ئەجێنتان بۆ پرۆگرامسازان',
      ar: 'دليل أفضل ٥٠ أداة ووكيل ذكاء اصطناعي للمبرمجين',
      en: 'Curated directory of 50 AI coding assistants, autonomous agents, and models',
    },
    icon: Sparkles,
  },
  prompts: {
    id: 'prompts',
    names: {
      ckb: 'پرۆمپتە زێڕینەکان (Golden Prompts & Directives)',
      kmr: 'پرۆمپتێن زێڕین (Golden Prompts & Directives)',
      ar: 'الأوامر الذهبية للذكاء الاصطناعي',
      en: 'Golden AI Prompts & Directives',
    },
    descs: {
      ckb: 'فەرمان و پرۆمپتە ئەفسانەییە تاقیکراوەکان بۆ چاتبۆت و مۆدێلەکان (THINK10X, ELI5 و زیاتر)',
      kmr: 'فەرمان و پرۆمپتێن تاقیکری بۆ چاتبۆت و مۆدێلێن AI (THINK10X, ELI5 و پتر)',
      ar: 'مجموعة الأوامر والتوجيهات الاحترافية المجربة (THINK10X, ELI5 والمزيد)',
      en: 'Battle-tested prompt directives (THINK10X, ELI5, and 20 more workflows)',
    },
    icon: Flame,
  },
  home: {
    id: 'home',
    names: {
      ckb: 'پەڕەی سەرەکی (Home Page)',
      kmr: 'بەرپەڕێ سەرەکی (Home Page)',
      ar: 'الصفحة الرئيسية (Home Page)',
      en: 'Home Landing Page',
    },
    descs: {
      ckb: 'پەڕەی سەرەکی ماڵپەڕ، ناساندنی زمانەکان و ڕێڕەوەکان',
      kmr: 'بەرپەڕێ سەرەکی یێ مالپەڕی و ناساندنا زمان و ڕێبازان',
      ar: 'واجهة الموقع الرئيسية ومسارات التعلم',
      en: 'Platform overview, track cards, and quick navigation',
    },
    icon: Home,
  },
  editor: {
    id: 'editor',
    names: {
      ckb: 'تاقیگەی کۆد (Code Lab)',
      kmr: 'تاقیگەها کۆدی (Code Lab)',
      ar: 'مختبر الكود (Code Lab)',
      en: 'Code Lab & Live Editor',
    },
    descs: {
      ckb: 'دەستکاریکەری ڕاستەوخۆ، تێمپلەیتەکان و تاقیکردنەوەی خێرا',
      kmr: 'دەستکاریکەرێ ڕاستەوخۆ، تێمپلەیت و تاقیکرنا بلەز',
      ar: 'محرر الكود التفاعلي والقوالب الجاهزة',
      en: 'Live HTML/CSS/JS sandbox, templates, and preview',
    },
    icon: Code2,
  },
  academy: {
    id: 'academy',
    names: {
      ckb: 'ئەکادیمیای وانەکان (Academy)',
      kmr: 'ئەکادیمیایا وانەیان (Academy)',
      ar: 'الأكاديمية التعليمية (Academy)',
      en: 'Academy & 840+ Lessons',
    },
    descs: {
      ckb: 'تەواوی وانەکانی ٨ زمانەکە و شیکردنەوەی تەکنیکی',
      kmr: 'تەڤایا وانەیێن ٨ زمانان و شیکرنا تەکنیکی',
      ar: 'جميع دروس المسارات الثمانية والشرح التطبيقي',
      en: 'Interactive curriculum across all 8 coding tracks',
    },
    icon: BookOpen,
  },
  ai: {
    id: 'ai',
    names: {
      ckb: 'مێشکی زیرەکی دەستکرد (AI Assistant)',
      kmr: 'یاریدەدەرێ زیرەکییا دەستکرد (AI Assistant)',
      ar: 'مساعد الذكاء الاصطناعي (AI Assistant)',
      en: 'KARÊJAN AI Assistant',
    },
    descs: {
      ckb: 'سیستەمی چات و یاریدەدەری زیرەکی پرۆگرامینگ',
      kmr: 'سیستەمێ چات و هاریکارێ زیرەک بۆ پرۆگرامسازیێ',
      ar: 'نظام المحادثة والمساعد الذكي للبرمجة',
      en: 'AI coding tutor and debugging chat assistant',
    },
    icon: Sparkles,
  },
  practice: {
    id: 'practice',
    names: {
      ckb: 'ڕاهێنان و تاقیکردنەوەکان (Practice)',
      kmr: 'ڕاهێنان و ئەزموون (Practice)',
      ar: 'التمارين والاختبارات (Practice)',
      en: 'Practice & Quizzes',
    },
    descs: {
      ckb: 'کویزە فەرمییەکان، کۆدە چاڵنجییەکان و تاقیکردنەوەکان',
      kmr: 'کویزێن فەرمی، چالێنجێن کۆدی و ئەزموون',
      ar: 'الاختبارات الرسمية وتمارين الكود المقيّمة',
      en: 'Graded coding exercises, quizzes, and timed exams',
    },
    icon: CheckSquare,
  },
  discover: {
    id: 'discover',
    names: {
      ckb: 'گەڕان و سەرچاوەکان (Discovery)',
      kmr: 'ڤەدیتن و ژێدەر (Discovery)',
      ar: 'الاستكشاف والموارد (Discovery)',
      en: 'Discovery & Community Projects',
    },
    descs: {
      ckb: 'وتارە تەکنیکییەکان، پێڕست و ئامرازە بەسودەکانی AI',
      kmr: 'گۆتارێن تەکنیکی و پڕۆژەیێن کۆمەڵگەهێ',
      ar: 'المقالات التقنية ومشاريع المجتمع',
      en: 'Technical articles, open resources, and community builds',
    },
    icon: Compass,
  },
  pro: {
    id: 'pro',
    names: {
      ckb: 'بەشداریکردنی Pro (Subscription)',
      kmr: 'بەشداریکرنا Pro (Subscription)',
      ar: 'الاشتراك الاحترافي (Pro)',
      en: 'Pro Purchase & Upgrade',
    },
    descs: {
      ckb: 'پەڕەی کڕینی بەشداریکردنی پێشکەوتوو بە ZainCash و FIB',
      kmr: 'بەرپەڕێ کڕینا پلانا Pro ب ZainCash و FIB',
      ar: 'صفحة الترقية والاشتراك عبر ZainCash و FIB و Qi Card',
      en: 'Pro subscription upgrade and payment verification',
    },
    icon: Crown,
  },
  dashboard: {
    id: 'dashboard',
    names: {
      ckb: 'داشبۆردی بەکارهێنەر (Dashboard)',
      kmr: 'داشبۆردا بکارهێنەری (Dashboard)',
      ar: 'لوحة المستخدم (Dashboard)',
      en: 'User Profile & Dashboard',
    },
    descs: {
      ckb: 'پڕۆفایلی بەکارهێنەر، پڕۆژە خەزنکراوەکان و دەستکەوتەکان',
      kmr: 'پرۆفایلا بکارهێنەری، پڕۆژەیێن پاشکەفتکری و دەستکەفت',
      ar: 'الملف الشخصي، المقاطع المحفوظة، وسجل الإنجازات',
      en: 'Profile preferences, saved snippets, and progress stats',
    },
    icon: LayoutDashboard,
  },
  admin: {
    id: 'admin',
    names: {
      ckb: 'پەنێلی ئەدمین (Admin Control)',
      kmr: 'پەنێلا ڕێڤەبەریێ (Admin Control)',
      ar: 'لوحة الإدارة (Admin Control)',
      en: 'Admin Control Panel',
    },
    descs: {
      ckb: 'بەڕێوەبردنی گشتی پلاتفۆرم و سیستم',
      kmr: 'ڕێڤەبرنا گشتی یا پلاتفۆرم و سیستەمی',
      ar: 'الإدارة العامة للمنصة والنظام',
      en: 'Platform management and governance tools',
    },
    icon: ShieldAlert,
  },
};

function getDynamicManageableTabs(currentLockedTabs: ActiveView[] = []): TabMetadata[] {
  const standardViews: ActiveView[] = [
    'challenge',
    'aitools',
    'prompts',
    'editor',
    'academy',
    'ai',
    'discover',
    'home',
    'pro',
    'dashboard',
  ];

  const allViewKeys = Array.from(new Set([...standardViews, ...currentLockedTabs])).filter(
    (key) => key !== 'admin'
  );

  return allViewKeys.map((id) => {
    const meta = CORE_TAB_METADATA[id];
    if (meta) {
      return { ...meta };
    }
    return {
      id,
      names: {
        ckb: `تابی ${id}`,
        kmr: `تابا ${id}`,
        ar: `تبويب ${id}`,
        en: `Tab: ${id}`,
      },
      descs: {
        ckb: `بەشی چالاکی پلاتفۆرمی کاڕێژان (${id})`,
        kmr: `بەشێ چالاک یێ پلاتفۆرما کاڕێژان (${id})`,
        ar: `قسم نشط في منصة KARÊJAN (${id})`,
        en: `Active KARÊJAN platform section (${id})`,
      },
      icon: LayoutDashboard,
    };
  });
}

export const AdminMaintenancePanel: React.FC<AdminMaintenancePanelProps> = ({ onAudit, onBanner }) => {
  const { locale, systemSettings, firebaseUser, updateMaintenanceSettings } = useApp();

  const currentMaintenance = systemSettings.maintenance || {
    enabled: false,
    lockedTabs: [],
    messageCkb: 'ئەم بەشە لە ئێستادا لەژێر چاکسازی و نوێکردنەوەدایە بۆ پێشکەشکردنی باشترین خزمەتگوزاری.',
    messageEn: 'This section is currently undergoing scheduled maintenance to improve your learning experience.',
    estimatedReturn: '',
  };

  // Local form state
  const [enabled, setEnabled] = useState<boolean>(Boolean(currentMaintenance.enabled));
  const [lockedTabs, setLockedTabs] = useState<ActiveView[]>(currentMaintenance.lockedTabs || []);
  const [messageCkb, setMessageCkb] = useState<string>(
    currentMaintenance.messageCkb || 'ئەم بەشە لە ئێستادا لەژێر چاکسازی و نوێکردنەوەدایە بۆ پێشکەشکردنی باشترین خزمەتگوزاری.'
  );
  const [messageEn, setMessageEn] = useState<string>(
    currentMaintenance.messageEn || 'This section is currently undergoing scheduled maintenance to improve your learning experience.'
  );
  const [estimatedReturn, setEstimatedReturn] = useState<string>(
    currentMaintenance.estimatedReturn || ''
  );
  const [saving, setSaving] = useState(false);

  // Keep form synced whenever live Firestore settings arrive or update from another session
  useEffect(() => {
    const m = systemSettings.maintenance;
    if (!m) return;
    setEnabled(Boolean(m.enabled));
    setLockedTabs(Array.isArray(m.lockedTabs) ? m.lockedTabs : []);
    if (typeof m.messageCkb === 'string' && m.messageCkb.trim()) setMessageCkb(m.messageCkb);
    if (typeof m.messageEn === 'string' && m.messageEn.trim()) setMessageEn(m.messageEn);
    if (typeof m.estimatedReturn === 'string') setEstimatedReturn(m.estimatedReturn);
  }, [
    systemSettings.maintenance?.enabled,
    systemSettings.maintenance?.updatedAt,
    (systemSettings.maintenance?.lockedTabs || []).join(','),
  ]);

  // Dynamic manageable tabs list
  const manageableTabs = useMemo(() => getDynamicManageableTabs(lockedTabs), [lockedTabs]);

  // Toggle single tab in locked list
  const toggleTabLock = (tabId: ActiveView) => {
    setLockedTabs((prev) => {
      if (prev.includes(tabId)) {
        return prev.filter((id) => id !== tabId);
      } else {
        return [...prev, tabId];
      }
    });
  };

  // Quick preset: Lock All
  const applyLockAll = () => {
    setEnabled(true);
    setLockedTabs(manageableTabs.map((t) => t.id));
    onBanner(
      'ok',
      pickLoc(locale, {
        ckb: 'پێشوەختەی قفڵکردنی گشتی هەڵبژێردرا (کلیک لە پاشەکەوتکردن بکە).',
        kmr: 'پێشەکی قفلکرنا گشتی هاتە هەڵبژارتن (کلیک ل پاشکەفتکرنێ بکە).',
        ar: 'تم اختيار القفل العام المسبق (انقر على حفظ للتطبيق).',
        en: 'Global lockdown preset selected (click Save to deploy).',
      })
    );
  };

  // Quick preset: Normal Mode (Unlock all)
  const applyUnlockAll = () => {
    setEnabled(false);
    setLockedTabs([]);
    onBanner(
      'ok',
      pickLoc(locale, {
        ckb: 'پێشوەختەی کردنەوەی هەموو بەشەکان هەڵبژێردرا (کلیک لە پاشەکەوتکردن بکە).',
        kmr: 'پێشەکی ڤەکرنا هەمی بەشان هاتە هەڵبژارتن (کلیک ل پاشکەفتکرنێ بکە).',
        ar: 'تم اختيار فتح جميع الأقسام (انقر على حفظ للتطبيق).',
        en: 'Unlock all preset selected (click Save to deploy).',
      })
    );
  };

  // Quick preset: Challenge Only
  const applyLockChallengeOnly = () => {
    setEnabled(false);
    setLockedTabs(['challenge']);
    onBanner(
      'ok',
      pickLoc(locale, {
        ckb: 'تەنها بەشی پرسیاری ڕۆژ (Daily Challenge) هەڵبژێردرا بۆ چاکسازی.',
        kmr: 'تەنها بەشێ پرسیارا ڕۆژێ (Daily Challenge) هاتە هەڵبژارتن بۆ چاکسازیێ.',
        ar: 'تم اختيار قسم تحدي اليوم فقط للصيانة.',
        en: 'Daily Challenge tab selected for maintenance.',
      })
    );
  };

  // Quick preset: Editor Only
  const applyLockEditorOnly = () => {
    setEnabled(false);
    setLockedTabs(['editor']);
    onBanner(
      'ok',
      pickLoc(locale, {
        ckb: 'تەنها بەشی تاقیگەی کۆد هەڵبژێردرا بۆ چاکسازی.',
        kmr: 'تەنها بەشێ تاقیگەها کۆدی هاتە هەڵبژارتن بۆ چاکسازیێ.',
        ar: 'تم اختيار قسم مختبر الكود فقط للصيانة.',
        en: 'Code Lab tab selected for maintenance.',
      })
    );
  };

  // Quick preset: AI Only
  const applyLockAiOnly = () => {
    setEnabled(false);
    setLockedTabs(['ai']);
    onBanner(
      'ok',
      pickLoc(locale, {
        ckb: 'تەنها بەشی زیرەکی دەستکرد هەڵبژێردرا بۆ چاکسازی.',
        kmr: 'تەنها بەشێ زیرەکییا دەستکرد هاتە هەڵبژارتن بۆ چاکسازیێ.',
        ar: 'تم اختيار قسم المساعد الذكي فقط للصيانة.',
        en: 'AI Assistant tab selected for maintenance.',
      })
    );
  };

  // Save changes to Firestore and sync to Server
  const handleSaveMaintenance = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const updatedConfig: MaintenanceConfig = {
        enabled,
        lockedTabs,
        messageCkb: messageCkb.trim(),
        messageEn: messageEn.trim(),
        estimatedReturn: estimatedReturn.trim(),
        updatedAt: new Date().toISOString(),
        updatedBy: firebaseUser?.uid || 'admin',
      };

      // Optimistically update React AppContext immediately
      updateMaintenanceSettings(updatedConfig);
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            'karejan_system_settings',
            JSON.stringify({ ...systemSettings, maintenance: updatedConfig })
          );
        }
      } catch {}

      const before = { ...systemSettings.maintenance };

      // 1. Update Firestore system_settings/global using strictly whitelisted fields so existing rules accept it globally
      const firestorePayload = {
        freeDailyAiLimit: Math.max(1, Math.min(500, Math.round(Number(systemSettings.freeDailyAiLimit || 15)))),
        proPerMinuteLimit: Math.max(1, Math.min(120, Math.round(Number(systemSettings.proPerMinuteLimit || 12)))),
        proMaxMessageLength: Math.max(200, Math.min(20000, Math.round(Number(systemSettings.proMaxMessageLength || 4000)))),
        dailyGenerationJobCap: Math.max(1, Math.min(500, Math.round(Number(systemSettings.dailyGenerationJobCap || 25)))),
        autoPublishAfterValidation: Boolean(systemSettings.autoPublishAfterValidation),
        maintenance: updatedConfig,
        updatedBy: firebaseUser?.uid || 'admin',
        updatedAt: serverTimestamp(),
      };

      let firestoreSynced = false;
      let firestoreErrorText = '';
      try {
        const fsPromise = setDoc(doc(db, 'system_settings', 'global'), firestorePayload);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore timeout — check internet or database rules')), 8000)
        );
        await Promise.race([fsPromise, timeoutPromise]);
        firestoreSynced = true;
      } catch (fsErr) {
        firestoreErrorText = fsErr instanceof Error ? fsErr.message : String(fsErr);
        console.warn('Firestore maintenance write failed:', fsErr);
      }

      // 2. Sync to authoritative server state with 3s timeout
      try {
        const apiPromise = apiFetch('/api/admin/sync-settings', {
          method: 'POST',
          body: {
            ...systemSettings,
            maintenance: updatedConfig,
          },
        });
        const apiTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('API timeout')), 3000)
        );
        await Promise.race([apiPromise, apiTimeout]);
      } catch (apiErr) {
        console.warn('Server sync warning:', apiErr);
      }

      // 3. Write Audit Log (non-blocking)
      void onAudit(
        'maintenance_mode_updated',
        'system_settings',
        'global',
        `Maintenance set to: global=${enabled}, lockedTabs=[${lockedTabs.join(', ')}]`,
        before as unknown as Record<string, unknown>,
        updatedConfig as unknown as Record<string, unknown>
      ).catch(() => {});

      if (!firestoreSynced) {
        onBanner(
          'err',
          pickLoc(locale, {
            ckb: `ئاگاداری: دۆخی چاکسازی تەنها لەسەر ئەم ئامێرە پاشەکەوت بوو و نەنێردرا بۆ داتابەیس (${firestoreErrorText}). دڵنیابە بە ئیمێڵی ئەدمینی فەرمی لەژوورەوەیت و Firestore Rules دیپلۆی کراوە.`,
            kmr: `Agahdarî: Doxa çaksaziyê tenê li ser vê amûrê hate tomar kirin û neçû bo databêjê (${firestoreErrorText}).`,
            ar: `تنبيه: تم الحفظ محلياً فقط وفشل الإرسال إلى قاعدة البيانات (${firestoreErrorText}). تأكد من صلاحية حساب الإدارة وقواعد Firestore.`,
            en: `Warning: Saved locally only — failed to sync globally to Firestore (${firestoreErrorText}). Verify admin sign-in and deployed Firestore rules.`,
          })
        );
        return;
      }

      onBanner(
        'ok',
        enabled
          ? pickLoc(locale, {
              ckb: 'دۆخی چاکسازی گشتی لەسەر هەموو پلاتفۆرمەکە چالاک کرا!',
              kmr: 'دۆخێ چاکسازییا گشتی ل سەر هەمی پلاتفۆرمێ هاتە چالاککرن!',
              ar: 'تم تفعيل وضع الصيانة العام على المنصة بالكامل!',
              en: 'Global maintenance mode enabled across the entire platform!',
            })
          : lockedTabs.length > 0
          ? pickLoc(locale, {
              ckb: `دۆخی چاکسازی بە سەرکەوتوویی بۆ ${lockedTabs.length} بەش جێگیر کرا.`,
              kmr: `دۆخێ چاکسازیێ ب سەرکەفتی بۆ ${lockedTabs.length} بەشان هاتە جێگیرکرن.`,
              ar: `تم تفعيل وضع الصيانة لـ ${lockedTabs.length} قسم بنجاح.`,
              en: `Maintenance mode enabled for ${lockedTabs.length} section(s).`,
            })
          : pickLoc(locale, {
              ckb: 'هەموو بەشەکان کرانەوە و ماڵپەڕ لە دۆخی ئاساییدایە.',
              kmr: 'هەمی بەش هاتنە ڤەکرن و مالپەڕ د دۆخێ ئاسایی دایە.',
              ar: 'تم فتح جميع الأقسام والموقع في الوضع الطبيعي.',
              en: 'All sections unlocked; platform is operating normally.',
            })
      );
    } catch (err) {
      onBanner(
        'err',
        err instanceof Error
          ? err.message
          : pickLoc(locale, {
              ckb: 'پاشەکەوتکردنی دۆخی چاکسازی سەرکەوتوو نەبوو.',
              kmr: 'پاشکەفتکرنا دۆخێ چاکسازیێ سەرکەفتی نەبوو.',
              ar: 'فشل حفظ إعدادات وضع الصيانة.',
              en: 'Failed to save maintenance settings.',
            })
      );
    } finally {
      setSaving(false);
    }
  };

  const isGlobalActive = enabled;
  const isAnyTabLocked = lockedTabs.length > 0;

  return (
    <div className="space-y-6">
      {/* Hero Overview Card */}
      <Surface className="p-6 border-l-4 border-l-amber-500">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Wrench className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {pickLoc(locale, {
                  ckb: 'پەنێلی بەڕێوەبردنی دۆخی چاکسازی (Maintenance Hub)',
                  kmr: 'پەنێلا ڕێڤەبرنا دۆخێ چاکسازیێ (Maintenance Hub)',
                  ar: 'لوحة إدارة وضع الصيانة (Maintenance Hub)',
                  en: 'Maintenance Mode Hub',
                })}
              </h2>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 max-w-2xl">
              {pickLoc(locale, {
                ckb: 'لێرەوە دەتوانیت بە تەواوی ئازاد بیت: یاخود هەموو ماڵپەڕەکە پێکەوە بخەیتە دۆخی چاکسازییەوە، یان تەنها بەشێکی دیاریکراو قفڵ بکەیت تا دەستکاری دەکەیت. ئەندامانی ستاف و ئەدمین هەمیشە دەتوانن بەشەکان ببینن.',
                kmr: 'ژ ڤێرێ تو دشێی تەڤایا مالپەڕی بکەیە دۆخێ چاکسازیێ، یان تەنها بەشەکێ دیاریکری قفل بکەی. ستاف و ئەدمین هەردەم دشێن هەمی بەشان ببینن.',
                ar: 'يمكنك قفل المنصة بالكامل أو قفل أقسام محددة بشكل مستقل أثناء التعديل. يمكن للمشرفين دائماً الوصول لجميع الأقسام.',
                en: 'Configure granular maintenance locks for single tabs, multiple sections, or lock down the entire platform globally. Staff and admins automatically bypass maintenance.',
              })}
            </p>
          </div>

          {/* Master Status Pill */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold ${
                isGlobalActive
                  ? 'border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400'
                  : isAnyTabLocked
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <Radio className="h-4 w-4 animate-pulse" />
              <span>
                {isGlobalActive
                  ? pickLoc(locale, {
                      ckb: 'دۆخی چاکسازی گشتی (قفڵە) 🚨',
                      kmr: 'دۆخێ چاکسازییا گشتی (قفلە) 🚨',
                      ar: 'وضع الصيانة العام (مغلق) 🚨',
                      en: 'Global Maintenance (Locked) 🚨',
                    })
                  : isAnyTabLocked
                  ? pickLoc(locale, {
                      ckb: `چاکسازی لەسەر (${lockedTabs.length}) بەش چالاکە 🛠️`,
                      kmr: `چاکسازی ل سەر (${lockedTabs.length}) بەشان چالاکە 🛠️`,
                      ar: `الصيانة نشطة على (${lockedTabs.length}) قسم 🛠️`,
                      en: `Maintenance on (${lockedTabs.length}) tab(s) 🛠️`,
                    })
                  : pickLoc(locale, {
                      ckb: 'سیستم ئاساییە و کراوەیە ✅',
                      kmr: 'سیستەم ئاساییە و ڤەکریە ✅',
                      ar: 'النظام طبيعي ومفتوح ✅',
                      en: 'System Normal & Open ✅',
                    })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Presets */}
        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-[#2b3442]">
          <h3 className="mb-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {pickLoc(locale, {
              ckb: 'کردارە خێراکان و پێشوەختەکان (Quick Presets):',
              kmr: 'کردارێن بلەز (Quick Presets):',
              ar: 'الإعدادات السريعة (Quick Presets):',
              en: 'Quick Presets:',
            })}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={isGlobalActive ? 'danger' : 'secondary'}
              onClick={applyLockAll}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>
                {pickLoc(locale, {
                  ckb: '🔴 قفڵکردنی هەموو ماڵپەڕ (گشتی)',
                  kmr: '🔴 قفلکرنا هەمی مالپەڕی (گشتی)',
                  ar: '🔴 قفل الموقع بالكامل (عام)',
                  en: '🔴 Lock All (Global)',
                })}
              </span>
            </Button>

            <Button
              size="sm"
              variant={!isGlobalActive && lockedTabs.length === 1 && lockedTabs.includes('challenge') ? 'primary' : 'secondary'}
              onClick={applyLockChallengeOnly}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>
                {pickLoc(locale, {
                  ckb: '⚡ تەنها پرسیاری ڕۆژ (Challenge)',
                  kmr: '⚡ تەنها پرسیارا ڕۆژێ (Challenge)',
                  ar: '⚡ تحدي اليوم فقط',
                  en: '⚡ Daily Challenge Only',
                })}
              </span>
            </Button>

            <Button
              size="sm"
              variant={!isGlobalActive && lockedTabs.length === 1 && lockedTabs.includes('editor') ? 'primary' : 'secondary'}
              onClick={applyLockEditorOnly}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>
                {pickLoc(locale, {
                  ckb: '🟡 تەنها تاقیگەی کۆد (Code Lab)',
                  kmr: '🟡 تەنها تاقیگەها کۆدی (Code Lab)',
                  ar: '🟡 مختبر الكود فقط',
                  en: '🟡 Code Lab Only',
                })}
              </span>
            </Button>

            <Button
              size="sm"
              variant={!isGlobalActive && lockedTabs.length === 1 && lockedTabs.includes('ai') ? 'primary' : 'secondary'}
              onClick={applyLockAiOnly}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {pickLoc(locale, {
                  ckb: '🟡 تەنها چاتی AI',
                  kmr: '🟡 تەنها چاتا AI',
                  ar: '🟡 المساعد الذكي فقط',
                  en: '🟡 AI Chat Only',
                })}
              </span>
            </Button>

            <Button
              size="sm"
              variant={!isGlobalActive && lockedTabs.length === 0 ? 'primary' : 'secondary'}
              onClick={applyUnlockAll}
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>
                {pickLoc(locale, {
                  ckb: '🟢 کوژاندنەوەی هەمووی (ئاسایی)',
                  kmr: '🟢 ڤەکرنا هەمییان (ئاسایی)',
                  ar: '🟢 فتح الجميع (وضع عادي)',
                  en: '🟢 Unlock All (Normal)',
                })}
              </span>
            </Button>
          </div>
        </div>
      </Surface>

      {/* Main Configuration Grid */}
      <form onSubmit={handleSaveMaintenance} className="space-y-6">
        {/* Global Master Switch */}
        <Surface className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-500" />
                <span>
                  {pickLoc(locale, {
                    ckb: 'سوویچی گشتی: قفڵکردنی تەواوی پلاتفۆرم',
                    kmr: 'سویچا گشتی: قفلکرنا تەڤایا پلاتفۆرمێ',
                    ar: 'المفتاح العام: قفل المنصة بالكامل',
                    en: 'Global Lockdown Master Switch',
                  })}
                </span>
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {pickLoc(locale, {
                  ckb: 'کاتێک ئەمە هەڵبکەیت، تەواوی پەڕە و بەشەکان بۆ بەکارهێنەران دادەخرێن بە یەکجاری و تەنها پەیامی چاکسازی دەردەکەوێت.',
                  kmr: 'دەمێ تو ڤێ هەلدکەی، هەمی پەڕ و بەش بۆ بکارهێنەران دێ هێنە داخستن.',
                  ar: 'عند تفعيل هذا الخيار، يتم إغلاق جميع الصفحات والأقسام للمستخدمين ويظهر إشعار الصيانة فقط.',
                  en: 'When enabled, all pages and sections are locked simultaneously for non-staff users.',
                })}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-red-600"></div>
            </label>
          </div>
        </Surface>

        {/* Tab-by-Tab Granular Locking Grid */}
        <Surface className="p-6">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-blue-500" />
                <span>
                  {pickLoc(locale, {
                    ckb: 'دیاریکردنی بەشەکان بە جیاوازی (Granular Per-Tab Lock)',
                    kmr: 'دیاریکرنا بەشان ب جوداهی (Granular Per-Tab Lock)',
                    ar: 'قفل الأقسام بشكل مستقل (Granular Per-Tab Lock)',
                    en: 'Granular Per-Tab Lock',
                  })}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pickLoc(locale, {
                  ckb: 'دەتوانیت هەر بەشێک کە دەتەوێت چاکسازی تێدا بکەیت بە جیا دیاری بکەیت بەبێ ئەوەی بەشەکانی تر بوەستێنیت:',
                  kmr: 'تو دشێی هەر بەشەکێ تە بڤێت ب جودا بۆ چاکسازیێ دیار بکەی بێی کو بەشێن دی ڕاوستن:',
                  ar: 'اختر الأقسام التي تريد وضعها تحت الصيانة دون إيقاف بقية الأقسام:',
                  en: 'Select which specific tabs to lock independently while keeping other sections live:',
                })}
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
              {lockedTabs.length} / {manageableTabs.length}{' '}
              {pickLoc(locale, { ckb: 'بەش هەڵبژێردراوە', kmr: 'بەش هاتینە هەڵبژارتن', ar: 'محدد', en: 'selected' })}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {manageableTabs.map((tabItem) => {
              const Icon = tabItem.icon;
              const isLocked = enabled || lockedTabs.includes(tabItem.id);

              return (
                <div
                  key={tabItem.id}
                  onClick={() => toggleTabLock(tabItem.id)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 transition-all cursor-pointer ${
                    isLocked
                      ? 'border-amber-500 bg-amber-500/10 shadow-sm dark:border-amber-500/60 dark:bg-amber-500/15'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-[#2b3442] dark:bg-[#151b26] dark:hover:border-[#344154]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isLocked
                              ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {tabItem.names[locale] || tabItem.names.en}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            ID: {tabItem.id}
                          </span>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isLocked
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="h-3 w-3" />
                            <span>{pickLoc(locale, { ckb: 'قفڵکراو', kmr: 'قفلکری', ar: 'مقفل', en: 'Locked' })}</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3 w-3" />
                            <span>{pickLoc(locale, { ckb: 'کراوە', kmr: 'ڤەکری', ar: 'مفتوح', en: 'Live' })}</span>
                          </>
                        )}
                      </span>
                    </div>

                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                      {tabItem.descs[locale] || tabItem.descs.en}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">
                      {isLocked
                        ? pickLoc(locale, { ckb: 'کلیک بکە بۆ کردنەوە', kmr: 'کلیک بکە بۆ ڤەکرنێ', ar: 'انقر للفتح', en: 'Click to unlock' })
                        : pickLoc(locale, { ckb: 'کلیک بکە بۆ قفڵکردن', kmr: 'کلیک بکە بۆ قفلکرنێ', ar: 'انقر للقفل', en: 'Click to lock' })}
                    </span>
                    <input
                      type="checkbox"
                      checked={lockedTabs.includes(tabItem.id)}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 pointer-events-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Surface>

        {/* Custom Maintenance Message & Estimated Return Time */}
        <Surface className="p-6">
          <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span>
              {pickLoc(locale, {
                ckb: 'پەیامی چاکسازی و کاتی پێشبینیکراو',
                kmr: 'پەیاما چاکسازیێ و دەمێ پێشبینی کری',
                ar: 'رسالة الصيانة والوقت المتوقع للعودة',
                en: 'Maintenance Notice & Schedule',
              })}
            </span>
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {pickLoc(locale, {
                  ckb: 'پەیامی چاکسازی (کوردی سۆرانی):',
                  kmr: 'پەیاما چاکسازیێ (کوردی سۆرانی):',
                  ar: 'رسالة الصيانة (الكردية السورانية):',
                  en: 'Maintenance Message (Kurdish):',
                })}
              </label>
              <textarea
                rows={3}
                value={messageCkb}
                onChange={(e) => setMessageCkb(e.target.value)}
                placeholder={pickLoc(locale, {
                  ckb: 'پەیامێک بنووسە کە بۆ بەکارهێنەر پیشان بدرێت...',
                  kmr: 'پەیامەکێ بنڤیسە بۆ بکارهێنەران...',
                  ar: 'اكتب الرسالة التي ستظهر للمستخدمين...',
                  en: 'Write a Kurdish maintenance notice for learners...',
                })}
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 dark:border-[#2b3442] dark:bg-[#151b26] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {pickLoc(locale, {
                  ckb: 'پەیامی چاکسازی (ئینگلیزی):',
                  kmr: 'پەیاما چاکسازیێ (ئینگلیزی):',
                  ar: 'رسالة الصيانة (الإنجليزية):',
                  en: 'Maintenance Message (English):',
                })}
              </label>
              <textarea
                rows={3}
                value={messageEn}
                onChange={(e) => setMessageEn(e.target.value)}
                placeholder={pickLoc(locale, {
                  ckb: 'پەیامی ئینگلیزی بۆ فێرخوازان...',
                  kmr: 'پەیاما ئینگلیزی بۆ قوتابییان...',
                  ar: 'رسالة الإشعار باللغة الإنجليزية للطلبة...',
                  en: 'English notification message for students...',
                })}
                className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 dark:border-[#2b3442] dark:bg-[#151b26] dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4 max-w-sm">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {pickLoc(locale, {
                ckb: 'کاتی پێشبینیکراوی تەواوبوون:',
                kmr: 'دەمێ پێشبینی کری یێ تمامبوونێ:',
                ar: 'الوقت المتوقع للانتهاء:',
                en: 'Estimated Return Time:',
              })}
            </label>
            <input
              type="text"
              value={estimatedReturn}
              onChange={(e) => setEstimatedReturn(e.target.value)}
              placeholder={pickLoc(locale, {
                ckb: 'نموونە: بە زووترین کات دەگەڕێینەوە / ٣٠ خولەکی تر',
                kmr: 'نموونە: دێ ب زوترین دەم ڤەگەڕین / ٣٠ خولەکان دا',
                ar: 'مثال: سنعود قريباً / خلال ٣٠ دقيقة',
                en: 'e.g. Back soon / In 30 minutes',
              })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 dark:border-[#2b3442] dark:bg-[#151b26] dark:text-white"
            />
          </div>
        </Surface>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setEnabled(Boolean(currentMaintenance.enabled));
              setLockedTabs(currentMaintenance.lockedTabs || []);
              setMessageCkb(currentMaintenance.messageCkb || '');
              setMessageEn(currentMaintenance.messageEn || '');
              setEstimatedReturn(currentMaintenance.estimatedReturn || '');
              onBanner(
                'ok',
                pickLoc(locale, {
                  ckb: 'گۆڕانکارییەکان گەڕێندرانەوە بۆ دۆخی خەزنکراو.',
                  kmr: 'گوهۆڕین هاتنە ڤەگەڕاندن بۆ دۆخێ پاشکەفتکری.',
                  ar: 'تمت استعادة الإعدادات المحفوظة.',
                  en: 'Changes reverted to last saved settings.',
                })
              );
            }}
          >
            <RotateCcw className="h-4 w-4" />
            <span>
              {pickLoc(locale, {
                ckb: 'پاشگەزبوونەوە',
                kmr: 'پاشڤەگەڕیان',
                ar: 'تراجع',
                en: 'Reset Changes',
              })}
            </span>
          </Button>

          <Button type="submit" variant="primary" disabled={saving}>
            <Save className="h-4 w-4" />
            <span>
              {saving
                ? pickLoc(locale, {
                    ckb: 'پاشەکەوت دەکرێت...',
                    kmr: 'دهێتە پاشکەفتکرن...',
                    ar: 'جارٍ الحفظ...',
                    en: 'Saving...',
                  })
                : pickLoc(locale, {
                    ckb: 'پاشەکەوتکردن و جێبەجێکردنی دەستبەجێ',
                    kmr: 'پاشکەفتکرن و جێبەجێکرنا بلەز',
                    ar: 'حفظ وتطبيق الآن',
                    en: 'Save & Deploy Now',
                  })}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};
