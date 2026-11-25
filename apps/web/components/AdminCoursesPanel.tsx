import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Database,
  Layers,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { doc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { apiFetch } from '../lib/api';
import { useApp } from '../context/AppContext';
import { Button, Surface } from './ui/Primitives';
import { ALL_COURSES } from '../data/courses/coursesList';
import { SEED_COURSES } from '../data/seedCatalog';
import { getEffectivePracticeConfig } from '../lib/practiceModuleEngine';
import { cleanTitle, pickLoc } from '../i18n/translations';
import type { Course, CoursePracticeOverride } from '../types/domain';

interface AdminCoursesPanelProps {
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

export const AdminCoursesPanel: React.FC<AdminCoursesPanelProps> = ({ onAudit, onBanner }) => {
  const { locale, courses, lessons, staffRole, refreshCatalog, systemSettings, updatePracticeConfig } = useApp();
  const isSuperAdmin = staffRole === 'super_admin';

  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [trackId, setTrackId] = useState('');
  const [order, setOrder] = useState<number>(courses.length + 1);

  const [titleEn, setTitleEn] = useState('');
  const [titleCkb, setTitleCkb] = useState('');
  const [titleKmr, setTitleKmr] = useState('');
  const [titleAr, setTitleAr] = useState('');

  const [descEn, setDescEn] = useState('');
  const [descCkb, setDescCkb] = useState('');
  const [descKmr, setDescKmr] = useState('');
  const [descAr, setDescAr] = useState('');

  // Per-Course Integrated Practice Override State
  const [practiceEnabled, setPracticeEnabled] = useState<boolean>(true);
  const [lessonsPerGroupOverride, setLessonsPerGroupOverride] = useState<string>('');
  const [passThresholdOverride, setPassThresholdOverride] = useState<string>('');
  const [requirePassOverride, setRequirePassOverride] = useState<'inherit' | 'true' | 'false'>('inherit');

  const resetForm = () => {
    setEditingId(null);
    setTrackId('');
    setOrder(courses.length + 1);
    setTitleEn('');
    setTitleCkb('');
    setTitleKmr('');
    setTitleAr('');
    setDescEn('');
    setDescCkb('');
    setDescKmr('');
    setDescAr('');
    setPracticeEnabled(true);
    setLessonsPerGroupOverride('');
    setPassThresholdOverride('');
    setRequirePassOverride('inherit');
  };

  const startEdit = (c: Course) => {
    setEditingId(c.id);
    setTrackId(c.id);
    setOrder(c.order);
    setTitleEn(c.titles.en || '');
    setTitleCkb(c.titles.ckb || '');
    setTitleKmr(c.titles.kmr || '');
    setTitleAr(c.titles.ar || '');
    setDescEn(c.descriptions.en || '');
    setDescCkb(c.descriptions.ckb || '');
    setDescKmr(c.descriptions.kmr || '');
    setDescAr(c.descriptions.ar || '');

    const ov = c.practiceConfig || systemSettings.practiceConfig?.courseOverrides?.[c.id];
    setPracticeEnabled(ov?.enabled !== undefined ? ov.enabled : true);
    setLessonsPerGroupOverride(ov?.lessonsPerGroup !== undefined ? String(ov.lessonsPerGroup) : '');
    setPassThresholdOverride(ov?.passThresholdPercent !== undefined ? String(ov.passThresholdPercent) : '');
    setRequirePassOverride(
      ov?.requirePassToUnlockNext === undefined
        ? 'inherit'
        : ov.requirePassToUnlockNext
          ? 'true'
          : 'false'
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = (editingId || trackId).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

    if (!cleanId || cleanId.length < 2) {
      onBanner('err', 'Course ID must be at least 2 characters (e.g. html, react, python).');
      return;
    }
    if (!titleEn.trim() && !titleCkb.trim()) {
      onBanner('err', 'Please enter at least an English or Kurdish title.');
      return;
    }

    setSaving(true);
    try {
      const courseOverride: CoursePracticeOverride = {
        enabled: practiceEnabled,
      };
      if (lessonsPerGroupOverride.trim()) {
        courseOverride.lessonsPerGroup = Math.max(1, Math.min(12, Number(lessonsPerGroupOverride) || 3));
      }
      if (passThresholdOverride.trim()) {
        courseOverride.passThresholdPercent = Math.max(30, Math.min(100, Number(passThresholdOverride) || 60));
      }
      if (requirePassOverride !== 'inherit') {
        courseOverride.requirePassToUnlockNext = requirePassOverride === 'true';
      }

      const nextPracticeConfig = {
        lessonsPerGroup: systemSettings.practiceConfig?.lessonsPerGroup ?? 3,
        requirePassToUnlockNext: systemSettings.practiceConfig?.requirePassToUnlockNext ?? true,
        passThresholdPercent: systemSettings.practiceConfig?.passThresholdPercent ?? 60,
        courseOverrides: {
          ...(systemSettings.practiceConfig?.courseOverrides || {}),
          [cleanId]: courseOverride,
        },
      };

      updatePracticeConfig(nextPracticeConfig);
      await apiFetch('/api/admin/sync-settings', {
        method: 'POST',
        body: { ...systemSettings, practiceConfig: nextPracticeConfig },
      }).catch(() => {});

      const courseData: Course = {
        id: cleanId,
        slug: cleanId,
        order: Number(order) || 1,
        titles: {
          en: titleEn.trim() || cleanId.toUpperCase(),
          ckb: titleCkb.trim() || titleEn.trim() || cleanId.toUpperCase(),
          kmr: titleKmr.trim() || titleCkb.trim() || titleEn.trim() || cleanId.toUpperCase(),
          ar: titleAr.trim() || titleEn.trim() || cleanId.toUpperCase(),
        },
        descriptions: {
          en: descEn.trim() || `${cleanId.toUpperCase()} programming track.`,
          ckb: descCkb.trim() || `${cleanId.toUpperCase()} وانە و ڕاهێنانەکانی.`,
          kmr: descKmr.trim() || `${cleanId.toUpperCase()} وانە و ڕاهێنانێن.`,
          ar: descAr.trim() || `مسار تعلم ${cleanId.toUpperCase()}.`,
        },
        practiceConfig: courseOverride,
      };

      try {
        await setDoc(doc(db, 'courses', cleanId), {
          ...courseData,
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Fallback if remote Firestore rules reject optional practiceConfig on courses
        const { practiceConfig: _omit, ...coreCourse } = courseData;
        await setDoc(doc(db, 'courses', cleanId), {
          ...coreCourse,
          updatedAt: serverTimestamp(),
        });
      }

      // Also ensure default chapter exists
      const chapterId = `ch-${cleanId}-1`;
      await setDoc(
        doc(db, 'chapters', chapterId),
        {
          id: chapterId,
          courseId: cleanId,
          order: 1,
          titles: {
            en: `${courseData.titles.en} Fundamentals`,
            ckb: `بنەماکانی ${courseData.titles.ckb}`,
            kmr: `بنەمایێن ${courseData.titles.kmr}`,
            ar: `أساسيات ${courseData.titles.ar}`,
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await onAudit(
        editingId ? 'course_updated' : 'course_created',
        'courses',
        cleanId,
        `Course ${cleanId} saved by admin.`
      );

      await refreshCatalog();
      onBanner('ok', `Course "${cleanId}" successfully saved!`);
      resetForm();
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Failed to save course.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!isSuperAdmin) {
      onBanner('err', 'Only Super Admin can delete courses.');
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete category/course "${courseId}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'courses', courseId));
      await onAudit('course_deleted', 'courses', courseId, `Course ${courseId} deleted by super admin.`);
      await refreshCatalog();
      onBanner('ok', `Course "${courseId}" deleted.`);
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Failed to delete course.');
    }
  };

  const handleSyncDefaultTracks = async () => {
    setSyncing(true);
    try {
      let count = 0;
      const targetCourses = (SEED_COURSES || ALL_COURSES || []).map((c) => ({
        ...c,
        titles: {
          en: cleanTitle(c.titles.en),
          ckb: cleanTitle(c.titles.ckb),
          kmr: cleanTitle(c.titles.kmr),
          ar: cleanTitle(c.titles.ar),
        },
      }));
      for (const c of targetCourses) {
        await setDoc(
          doc(db, 'courses', c.id),
          {
            ...c,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        // Ensure default chapter
        const chId = `ch-${c.id}-1`;
        await setDoc(
          doc(db, 'chapters', chId),
          {
            id: chId,
            courseId: c.id,
            order: 1,
            titles: {
              en: `${c.titles.en} Core`,
              ckb: `بەشی ١: بنەماکانی ${c.titles.ckb}`,
              kmr: `پشک ١: بنەمایێن ${c.titles.kmr}`,
              ar: `القسم ١: أساسيات ${c.titles.ar}`,
            },
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        count++;
      }

      await refreshCatalog();
      onBanner('ok', `Successfully synced ${count} default tracks (HTML, CSS, JS, React, Vite, TSX, Python, C++) with clean Kurdish titles to Firestore!`);
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Sync failed.');
    } finally {
      setSyncing(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const t = c.titles[locale] || c.titles.en;
    const d = c.descriptions[locale] || c.descriptions.en;
    return (
      c.id.toLowerCase().includes(q) ||
      t.toLowerCase().includes(q) ||
      d.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 dark:border-blue-500/10 dark:bg-blue-950/20">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-500" />
            {pickLoc(locale, {
              ckb: 'بەڕێوەبردنی کەتەگۆری و بەشەکان (Courses & Categories CMS)',
              kmr: 'ڕێڤەبرنا کەتەگۆری و بەشان (Courses & Categories CMS)',
              ar: 'إدارة التصنيفات والدورات (CMS)',
              en: 'Course & Category Management (CMS)',
            })}
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {pickLoc(locale, {
              ckb: 'لێرە دەتوانیت کەتەگۆریی نوێ (وەک HTML، CSS، JavaScript، React، Vite، TSX، Python، C++) زیاد بکەیت یان دەستکاری بکەیت.',
              kmr: 'ژ ڤێرێ تو دشێی کەتەگۆرییا نوو (وەک HTML، CSS، JS، React، Vite، TSX، Python، C++) زێدە بکەی یان بگوهۆڕی.',
              ar: 'أضف أو عدّل المسارات التعليمية (HTML و CSS و JavaScript و React و Vite و TSX و Python و C++).',
              en: 'Add, edit, or configure curriculum tracks. Lessons can be assigned dynamically to any category.',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={syncing}
            onClick={() => void handleSyncDefaultTracks()}
          >
            <Database className="h-4 w-4" />
            <span>
              {syncing
                ? pickLoc(locale, { ckb: 'هاوکاتکردن...', kmr: 'هەڤدەمکرن...', ar: 'جارٍ المزامنة...', en: 'Syncing...' })
                : pickLoc(locale, {
                    ckb: 'هاوکاتکردنی هەموو ڕێڕەوەکان بۆ Firestore',
                    kmr: 'هەڤدەمکرنا هەمی ڕێبازان بۆ Firestore',
                    ar: 'مزامنة جميع المسارات مع Firestore',
                    en: 'Sync All Tracks to Firestore',
                  })}
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Form: Add or Edit Course */}
        <Surface className="p-5 lg:col-span-5">
          <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {editingId ? <Edit3 className="h-4 w-4 text-amber-500" /> : <Plus className="h-4 w-4 text-blue-500" />}
            {editingId
              ? `${pickLoc(locale, { ckb: 'دەستکاریکردنی کەتەگۆری:', kmr: 'گوهۆڕینا کەتەگۆریێ:', ar: 'تعديل التصنيف:', en: 'Edit Category:' })} ${editingId}`
              : pickLoc(locale, {
                  ckb: 'زیادکردنی کەتەگۆری یان کۆرسی نوێ',
                  kmr: 'زێدەکرنا کەتەگۆری یان کۆرسەکا نوو',
                  ar: 'إضافة تصنيف أو دورة جديدة',
                  en: 'Add New Category / Course',
                })}
          </h3>

          <form onSubmit={handleSaveCourse} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {pickLoc(locale, { ckb: 'ناسنامەی ڕێڕەو / Slug *', kmr: 'ناسنامەیا ڕێبازێ / Slug *', ar: 'معرف المسار / Slug *', en: 'Track ID / Slug *' })}
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingId)}
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder="e.g. react, python, cpp"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 disabled:opacity-50 dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                  {pickLoc(locale, { ckb: 'ڕیزبەندیی پیشاندان', kmr: 'ڕێزبەندییا نیشاندانێ', ar: 'ترتيب العرض', en: 'Display Order' })}
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
                />
              </div>
            </div>

            {/* Titles in 4 Languages */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {pickLoc(locale, {
                  ckb: 'ناونیشانی کۆرسەکان (بە ٤ زمان)',
                  kmr: 'ناڤونیشانێن کۆرسان (ب ٤ زمانان)',
                  ar: 'عناوين المسار (باللغات الأربع)',
                  en: 'Course Titles (Nav & Headings)',
                })}
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder={pickLoc(locale, {
                  ckb: 'ناونیشانی ئینگلیزی (نموونە: React & Modern UI) *',
                  kmr: 'ناڤونیشانێ ئینگلیزی (نموونە: React & Modern UI) *',
                  ar: 'العنوان بالإنجليزية (مثال: React & Modern UI) *',
                  en: 'English Title (e.g. React & Modern UI) *',
                })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
              />
              <input
                type="text"
                dir="rtl"
                value={titleCkb}
                onChange={(e) => setTitleCkb(e.target.value)}
                placeholder={pickLoc(locale, {
                  ckb: 'ناونیشانی کوردی سۆرانی (نموونە: فێربوونی ڕیاکت)',
                  kmr: 'ناڤونیشانێ کوردی سۆرانی (نموونە: فێربوونی ڕیاکت)',
                  ar: 'العنوان بالكردية السورانية',
                  en: 'Kurdish Sorani Title',
                })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
              />
              <input
                type="text"
                dir="rtl"
                value={titleKmr}
                onChange={(e) => setTitleKmr(e.target.value)}
                placeholder={pickLoc(locale, {
                  ckb: 'ناونیشانی کوردی بادینی',
                  kmr: 'ناڤونیشانێ کوردی بادینی',
                  ar: 'العنوان بالكردية البادينية',
                  en: 'Kurdish Badini Title',
                })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
              />
              <input
                type="text"
                dir="rtl"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder={pickLoc(locale, {
                  ckb: 'ناونیشانی عەرەبی',
                  kmr: 'ناڤونیشانێ عەرەبی',
                  ar: 'العنوان بالعربية',
                  en: 'Arabic Title',
                })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
              />
            </div>

            {/* Descriptions in 4 Languages */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {pickLoc(locale, {
                  ckb: 'پێناسەی کۆرس (Overview)',
                  kmr: 'پێناسا کۆرسی (Overview)',
                  ar: 'وصف المسار (Overview)',
                  en: 'Descriptions (Course Overview)',
                })}
              </label>
              <textarea
                rows={2}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder={pickLoc(locale, {
                  ckb: 'پێناسە بە ئینگلیزی...',
                  kmr: 'پێناسە ب ئینگلیزی...',
                  ar: 'الوصف بالإنجليزية...',
                  en: 'English description...',
                })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
              />
              <textarea
                rows={2}
                dir="rtl"
                value={descCkb}
                onChange={(e) => setDescCkb(e.target.value)}
                placeholder={pickLoc(locale, {
                  ckb: 'پێناسەی کەتەگۆری بە کوردی سۆرانی...',
                  kmr: 'پێناسا کەتەگۆریێ ب کوردی سۆرانی...',
                  ar: 'وصف المسار بالكردية السورانية...',
                  en: 'Kurdish Sorani description...',
                })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
              />
            </div>

            {/* Per-Course Practice & Assessment Config */}
            <div className="space-y-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.04] p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {pickLoc(locale, {
                    ckb: 'ڕێکخستنی تاقیکردنەوە بۆ ئەم کۆرسە',
                    kmr: 'Rêkxistina ezmûnê bo vî korsî',
                    ar: 'إعدادات التقييم لهذا المسار',
                    en: 'Course Assessment Rules',
                  })}
                </span>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={practiceEnabled}
                    onChange={(e) => setPracticeEnabled(e.target.checked)}
                  />
                  <span>
                    {pickLoc(locale, { ckb: 'چالاک', kmr: 'Çalak', ar: 'مفعّل', en: 'Enabled' })}
                  </span>
                </label>
              </div>

              {practiceEnabled && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div>
                    <label className="mb-0.5 block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                      {pickLoc(locale, { ckb: 'وانە/گڕوپ', kmr: 'Wane/kom', ar: 'دروس/وحدة', en: 'Lessons/Group' })}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={lessonsPerGroupOverride}
                      onChange={(e) => setLessonsPerGroupOverride(e.target.value)}
                      placeholder={`${systemSettings.practiceConfig?.lessonsPerGroup ?? 3}`}
                      className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                      {pickLoc(locale, { ckb: 'دەرچوون %', kmr: 'Derbasbûn %', ar: 'النجاح %', en: 'Pass %' })}
                    </label>
                    <input
                      type="number"
                      min={30}
                      max={100}
                      value={passThresholdOverride}
                      onChange={(e) => setPassThresholdOverride(e.target.value)}
                      placeholder={`${systemSettings.practiceConfig?.passThresholdPercent ?? 60}`}
                      className="w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs dark:border-[#344154] dark:bg-[#10141c]"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                      {pickLoc(locale, { ckb: 'قوفڵی گڕوپ', kmr: 'Girtina komê', ar: 'قفل التالي', en: 'Gate Next' })}
                    </label>
                    <select
                      value={requirePassOverride}
                      onChange={(e) => setRequirePassOverride(e.target.value as 'inherit' | 'true' | 'false')}
                      className="w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-[#344154] dark:bg-[#10141c]"
                    >
                      <option value="inherit">{pickLoc(locale, { ckb: 'گشتی', kmr: 'Giştî', ar: 'عام', en: 'Default' })}</option>
                      <option value="true">{pickLoc(locale, { ckb: 'قوفڵ کراو', kmr: 'Girtî', ar: 'مطلوب', en: 'Required' })}</option>
                      <option value="false">{pickLoc(locale, { ckb: 'کراوە', kmr: 'Vekirî', ar: 'مفتوح', en: 'Open' })}</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit" variant="primary" size="sm" disabled={saving}>
                <Plus className="h-4 w-4" />
                <span>
                  {saving
                    ? pickLoc(locale, { ckb: 'پاشەکەوت دەکرێت...', kmr: 'دهێتە پاشکەفتکرن...', ar: 'جارٍ الحفظ...', en: 'Saving...' })
                    : editingId
                    ? pickLoc(locale, { ckb: 'نوێکردنەوەی کەتەگۆری', kmr: 'نوێکرنا کەتەگۆریێ', ar: 'تحديث التصنيف', en: 'Update Category' })
                    : pickLoc(locale, { ckb: 'دروستکردنی کەتەگۆری', kmr: 'چێکرنا کەتەگۆریێ', ar: 'إنشاء التصنيف', en: 'Create Category' })}
                </span>
              </Button>
              {editingId && (
                <Button type="button" variant="secondary" size="sm" onClick={resetForm}>
                  <RotateCcw className="h-4 w-4" />
                  <span>{pickLoc(locale, { ckb: 'پاشگەزبوونەوە', kmr: 'پاشڤەگەڕیان', ar: 'إلغاء', en: 'Cancel' })}</span>
                </Button>
              )}
            </div>
          </form>
        </Surface>

        {/* Existing Courses List */}
        <Surface className="p-5 lg:col-span-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {pickLoc(locale, {
                  ckb: `کەتەگۆرییە چالاکەکان (${courses.length})`,
                  kmr: `کەتەگۆریێن چالاک (${courses.length})`,
                  ar: `المسارات النشطة (${courses.length})`,
                  en: `Active Categories (${courses.length})`,
                })}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pickLoc(locale, {
                  ckb: 'ئەو ڕێڕەوانەی لە ئەکادیمیا، تاقیگەی کۆد، ڕاهێنان و ئەدمین بەردەستن.',
                  kmr: 'ئەو ڕێبازێن ل ئەکادیمیا، تاقیگەها کۆدی، ڕاهێنان و ئەدمین بەردەستن.',
                  ar: 'المسارات المتاحة في الأكاديمية والمحرر والتمارين والإدارة.',
                  en: 'Tracks available across Academy, Code Editor, Practice, and Admin.',
                })}
              </p>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={pickLoc(locale, { ckb: 'فلتەری ڕێڕەوەکان...', kmr: 'فلتەرکرنا ڕێبازان...', ar: 'تصفية المسارات...', en: 'Filter tracks...' })}
                className="rounded-lg border border-slate-300 bg-white py-1.5 pe-3 ps-8 text-xs text-slate-900 placeholder:text-slate-400 dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredCourses.map((c) => {
              const activeTitle = cleanTitle(c.titles[locale] || c.titles.en);
              const activeDesc = c.descriptions[locale] || c.descriptions.en;
              const lessonCount = lessons.filter((l) => l.courseId === c.id).length;
              const effPractice = getEffectivePracticeConfig(systemSettings, c);

              return (
                <div
                  key={c.id}
                  className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-3.5 sm:flex-row sm:items-center dark:border-[#2b3442] dark:bg-[#10141c]"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-blue-600/10 px-2 py-0.5 font-mono text-xs font-semibold text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                        {c.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {activeTitle}
                      </h4>
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        #{c.order}
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                        {effPractice.enabled
                          ? `Q/${effPractice.lessonsPerGroup} · ${effPractice.passThresholdPercent}%`
                          : 'Assessments OFF'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1 dark:text-slate-400">
                      {activeDesc}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {lessonCount} {pickLoc(locale, { ckb: 'وانە', kmr: 'وانە', ar: 'درس', en: 'lessons' })}
                      </span>
                      <span>·</span>
                      <span className="font-mono">slug: {c.slug}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-[#2b3442] dark:hover:text-white"
                      title={pickLoc(locale, { ckb: 'دەستکاری', kmr: 'گوهۆڕین', ar: 'تعديل التصنيف', en: 'Edit Category' })}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    {isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => void handleDeleteCourse(c.id)}
                        className="rounded p-1.5 text-red-500 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/40"
                        title={pickLoc(locale, { ckb: 'سڕینەوە', kmr: 'ژێبرن', ar: 'حذف التصنيف', en: 'Delete Category' })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Surface>
      </div>
    </div>
  );
};
