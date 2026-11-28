import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  Eye,
  Film,
  Layers,
  Play,
  Plus,
  RotateCcw,
  Save,
  Search,
  ShieldAlert,
  Trash2,
  Video,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  buildMuxEmbedUrl,
  buildMuxThumbnailUrl,
  extractMuxPlaybackId,
  parseChaptersText,
} from '../lib/mux';
import { cleanTitle, LOCALE_META, pickLoc } from '../i18n/translations';
import type { Locale, TrackId, VideoLesson, VideoLessonCategory } from '../types/domain';
import { Button, Surface } from './ui/Primitives';

interface AdminVideosPanelProps {
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

const VIDEO_TYPE_OPTIONS: { id: VideoLessonCategory; names: Record<Locale, string> }[] = [
  { id: 'tutorial', names: { ckb: 'فێرکاری قۆناغ بە قۆناغ', kmr: 'فێرکاری', ar: 'شرح تعليمي', en: 'Course Tutorial' } },
  { id: 'project', names: { ckb: 'دروستکردنی پڕۆژە', kmr: 'پڕۆژە', ar: 'بناء مشروع', en: 'Project Build' } },
  { id: 'crash_course', names: { ckb: 'کۆرسی خێرا و چڕ', kmr: 'کۆرسێ بلەز', ar: 'دورة مكثفة', en: 'Crash Course' } },
  { id: 'tips', names: { ckb: 'فێڵ و تێبینی خێرا', kmr: 'تێبینیێن بلەز', ar: 'نصائح سريعة', en: 'Quick Tip' } },
  { id: 'workshop', names: { ckb: 'وۆرکشۆپی پراکتیکی', kmr: 'وۆرکشۆپ', ar: 'ورشة عمل', en: 'Workshop' } },
  { id: 'problem_solving', names: { ckb: 'شیکاری کێشە و ئەلگۆریتم', kmr: 'شیکرنا ئاریشان', ar: 'حل المشكلات', en: 'Problem Solving' } },
];

export const AdminVideosPanel: React.FC<AdminVideosPanelProps> = ({ onAudit, onBanner }) => {
  const {
    locale,
    theme,
    staffRole,
    courses,
    lessons,
    videoLessons,
    saveVideoLesson,
    deleteVideoLesson,
    setActiveVideoId,
    setActiveView,
  } = useApp();

  const isAdmin = staffRole === 'super_admin' || staffRole === 'admin';

  const [editingId, setEditingId] = useState<string | null>(null);
  const [muxInput, setMuxInput] = useState('');
  const [title, setTitle] = useState('');
  const [titleCkb, setTitleCkb] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [titleKmr, setTitleKmr] = useState('');
  const [showMultiLangTitles, setShowMultiLangTitles] = useState(false);

  const [track, setTrack] = useState<TrackId>('html');
  const [lessonLanguage, setLessonLanguage] = useState<Locale>('ckb');
  const [category, setCategory] = useState<VideoLessonCategory>('tutorial');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [order, setOrder] = useState<number>(videoLessons.length + 1);
  const [durationLabel, setDurationLabel] = useState('');
  const [posterTimeSec, setPosterTimeSec] = useState<string>('');
  const [instructor, setInstructor] = useState('AZHAN HAMMZA');
  const [accessPlan, setAccessPlan] = useState<'free' | 'pro'>('free');
  const [chapterGroup, setChapterGroup] = useState('');
  const [description, setDescription] = useState('');
  const [takeawaysText, setTakeawaysText] = useState('');
  const [chaptersText, setChaptersText] = useState('');
  const [resourceCode, setResourceCode] = useState('');
  const [linkedLessonId, setLinkedLessonId] = useState<string>('');
  const [published, setPublished] = useState(true);

  const [showMuxPreview, setShowMuxPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filterTrack, setFilterTrack] = useState<string>('all');

  const extractedPlaybackId = useMemo(() => extractMuxPlaybackId(muxInput), [muxInput]);

  const trackLessons = useMemo(
    () => lessons.filter((l) => l.courseId === track).slice(0, 60),
    [lessons, track]
  );

  const filteredVideos = useMemo(() => {
    const q = search.trim().toLowerCase();
    return videoLessons.filter((v) => {
      if (filterTrack !== 'all' && v.track !== filterTrack) return false;
      if (q) {
        const text = `${v.title} ${v.muxPlaybackId} ${v.track} ${v.chapterGroup || ''} ${v.category}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [videoLessons, filterTrack, search]);

  if (!isAdmin) {
    return (
      <Surface className="p-8 text-center">
        <ShieldAlert className="mx-auto mb-3 h-8 w-8 text-amber-500" />
        <h2 className="text-lg font-bold text-[var(--kj-ink)]">
          {pickLoc(locale, {
            ckb: 'تەنها ئەدمین دەتوانێت وانە ڤیدیۆییەکان بەڕێوەببات',
            kmr: 'ب تنێ ئەدمین دشێت وانەیێن ڤیدیۆیی ڕێڤەببەت',
            ar: 'المشرف فقط يمكنه إدارة دروس الفيديو',
            en: 'Admin Only Video Management',
          })}
        </h2>
        <p className="mt-1 text-xs text-[var(--kj-muted)]">
          {pickLoc(locale, {
            ckb: 'ئەم بەشە تەنها بۆ Admin و Super Admin کراوەیە.',
            kmr: 'ئەڤ بەشە ب تنێ بۆ Admin و Super Admin ڤەکرییە.',
            ar: 'هذه الصلاحية محصورة بحسابات Admin و Super Admin.',
            en: 'Creating, editing, and deleting Mux video lessons is restricted to Admin accounts.',
          })}
        </p>
      </Surface>
    );
  }

  const resetForm = () => {
    setEditingId(null);
    setMuxInput('');
    setTitle('');
    setTitleCkb('');
    setTitleEn('');
    setTitleAr('');
    setTitleKmr('');
    setShowMultiLangTitles(false);
    setTrack('html');
    setLessonLanguage('ckb');
    setCategory('tutorial');
    setDifficulty('beginner');
    setOrder(videoLessons.length + 1);
    setDurationLabel('');
    setPosterTimeSec('');
    setInstructor('AZHAN HAMMZA');
    setAccessPlan('free');
    setChapterGroup('');
    setDescription('');
    setTakeawaysText('');
    setChaptersText('');
    setResourceCode('');
    setLinkedLessonId('');
    setPublished(true);
    setShowMuxPreview(false);
  };

  const startEdit = (v: VideoLesson) => {
    setEditingId(v.id);
    setMuxInput(v.muxPlaybackId);
    setTitle(v.title);
    setTitleCkb(v.titles?.ckb || '');
    setTitleEn(v.titles?.en || '');
    setTitleAr(v.titles?.ar || '');
    setTitleKmr(v.titles?.kmr || '');
    setShowMultiLangTitles(Boolean(v.titles && Object.keys(v.titles).length > 0));
    setTrack(v.track);
    setLessonLanguage(v.lessonLanguage);
    setCategory(v.category);
    setDifficulty(v.difficulty);
    setOrder(v.order ?? 1);
    setDurationLabel(v.durationLabel || '');
    setPosterTimeSec(typeof v.posterTimeSec === 'number' ? String(v.posterTimeSec) : '');
    setInstructor(v.instructor || 'AZHAN HAMMZA');
    setAccessPlan(v.accessPlan || 'free');
    setChapterGroup(v.chapterGroup || '');
    setDescription(v.description || '');
    setTakeawaysText((v.keyTakeaways || []).join('\n'));
    setChaptersText((v.chapters || []).map((c) => `${c.time} - ${c.title}`).join('\n'));
    setResourceCode(v.resourceCode || '');
    setLinkedLessonId(v.linkedLessonId || '');
    setPublished(Boolean(v.published));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractedPlaybackId) {
      onBanner(
        'err',
        pickLoc(locale, {
          ckb: 'تکایە Mux Playback IDـی دروست دابنێ.',
          kmr: 'هیڤیە Mux Playback ID یێ دروست بنڤیسە.',
          ar: 'يرجى إدخال Mux Playback ID صحيح.',
          en: 'Please enter a valid Mux Playback ID or Mux URL.',
        })
      );
      return;
    }
    if (!title.trim()) {
      onBanner(
        'err',
        pickLoc(locale, {
          ckb: 'تکایە تایتڵی وانە بنووسە.',
          kmr: 'هیڤیە ناڤنیشانێ وانەیێ بنڤیسە.',
          ar: 'يرجى إدخال عنوان الدرس.',
          en: 'Please enter a lesson title.',
        })
      );
      return;
    }

    setSaving(true);
    try {
      const cleanId = editingId || `vid-${String(track).replace(/[^a-z0-9_-]/g, '')}-${Date.now().toString(36)}`;
      const parsedTakeaways = takeawaysText
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);
      const parsedChapters = parseChaptersText(chaptersText);
      const parsedPosterTime = posterTimeSec.trim() ? Math.max(0, Number(posterTimeSec) || 0) : undefined;

      const localizedTitles: Partial<Record<Locale, string>> = {};
      if (titleCkb.trim()) localizedTitles.ckb = titleCkb.trim();
      if (titleKmr.trim()) localizedTitles.kmr = titleKmr.trim();
      if (titleAr.trim()) localizedTitles.ar = titleAr.trim();
      if (titleEn.trim()) localizedTitles.en = titleEn.trim();

      const res = await saveVideoLesson({
        id: cleanId,
        muxPlaybackId: extractedPlaybackId,
        title: title.trim(),
        ...(Object.keys(localizedTitles).length > 0 ? { titles: localizedTitles } : {}),
        description: description.trim(),
        track,
        lessonLanguage,
        category,
        difficulty,
        order: Number(order) || 1,
        ...(durationLabel.trim() ? { durationLabel: durationLabel.trim() } : {}),
        ...(typeof parsedPosterTime === 'number' ? { posterTimeSec: parsedPosterTime } : {}),
        ...(instructor.trim() ? { instructor: instructor.trim() } : {}),
        accessPlan,
        ...(chapterGroup.trim() ? { chapterGroup: chapterGroup.trim() } : {}),
        ...(parsedTakeaways.length > 0 ? { keyTakeaways: parsedTakeaways } : {}),
        ...(parsedChapters.length > 0 ? { chapters: parsedChapters } : {}),
        ...(resourceCode.trim() ? { resourceCode: resourceCode } : {}),
        ...(linkedLessonId.trim() ? { linkedLessonId: linkedLessonId.trim() } : { linkedLessonId: null }),
        published,
      });

      await onAudit(
        editingId ? 'update_video_lesson' : 'create_video_lesson',
        'video_lessons',
        res.video.id,
        `Mux Playback ID: ${res.video.muxPlaybackId}`,
        undefined,
        { title: res.video.title, track: res.video.track, lessonLanguage: res.video.lessonLanguage, published: res.video.published }
      );

      onBanner(
        'ok',
        pickLoc(locale, {
          ckb: `وانە ڤیدیۆییەکە "${res.video.title}" بە سەرکەوتوویی پاشەکەوت کرا (${res.savedFirestore ? 'Firestore + ' : ''}${res.savedServer ? 'Server' : 'Local'}).`,
          kmr: `وانەیا ڤیدیۆیی "${res.video.title}" ب سەرکەفتی هاتە پاشکەفتکرن.`,
          ar: `تم حفظ درس الفيديو "${res.video.title}" بنجاح.`,
          en: `Video lesson "${res.video.title}" saved successfully.`,
        })
      );
      resetForm();
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Failed to save video lesson.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (v: VideoLesson) => {
    setDeletingId(v.id);
    try {
      await deleteVideoLesson(v.id);
      await onAudit('delete_video_lesson', 'video_lessons', v.id, `Removed Mux video "${v.title}" (${v.muxPlaybackId})`);
      setConfirmDeleteId(null);
      if (editingId === v.id) resetForm();
      onBanner(
        'ok',
        pickLoc(locale, {
          ckb: `وانەی "${v.title}" سڕایەوە.`,
          kmr: `وانەیا "${v.title}" هاتە ژێبرن.`,
          ar: `تم حذف درس "${v.title}".`,
          en: `Deleted video lesson "${v.title}".`,
        })
      );
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Failed to delete video.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublished = async (v: VideoLesson) => {
    try {
      await saveVideoLesson({ ...v, published: !v.published });
      onBanner(
        'ok',
        v.published
          ? pickLoc(locale, { ckb: 'وانە خرایە ڕەشنووسەوە', kmr: 'بوو ڕەشنڤیس', ar: 'تم التحويل لمسودة', en: 'Moved to draft' })
          : pickLoc(locale, { ckb: 'وانە بڵاوکرایەوە', kmr: 'هاتە بەلاڤکرن', ar: 'تم النشر', en: 'Published live' })
      );
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Failed to update status.');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Form: Add / Edit Mux Video Lesson (Admin Only) */}
      <Surface className="p-6 lg:col-span-5 text-start">
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-[var(--kj-border)] pb-3">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-[var(--kj-green)]" />
            <h2 className="text-base font-extrabold text-[var(--kj-ink)]">
              {editingId
                ? pickLoc(locale, { ckb: 'دەستکاریکردنی وانەی ڤیدیۆ', kmr: 'گوهۆڕینا وانەیا ڤیدیۆ', ar: 'تعديل درس الفيديو', en: 'Edit Mux Video Lesson' })
                : pickLoc(locale, { ckb: 'زیادکردنی وانەی ڤیدیۆ (Mux)', kmr: 'زێدەکرنا وانەیا ڤیدیۆ (Mux)', ar: 'إضافة درس فيديو جديد (Mux)', en: 'Add Mux Video Lesson' })}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--kj-muted)] hover:text-[var(--kj-ink)] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{pickLoc(locale, { ckb: 'نوێ', kmr: 'نوی', ar: 'جديد', en: 'New' })}</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Mux Playback ID + Live Preview Toggle */}
          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <label className="text-xs font-bold text-[var(--kj-ink)]">
                Mux Playback ID *
              </label>
              {extractedPlaybackId && (
                <button
                  type="button"
                  onClick={() => setShowMuxPreview((s) => !s)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--kj-green)] hover:underline cursor-pointer"
                >
                  <Play className="h-3 w-3" />
                  <span>{showMuxPreview ? 'Hide Player' : 'Test Mux Stream'}</span>
                </button>
              )}
            </div>
            <input
              type="text"
              required
              dir="ltr"
              value={muxInput}
              onChange={(e) => setMuxInput(e.target.value)}
              placeholder="e.g. DS00Spx1CV902MCtPj5WknGlR102V5HFkDe or https://player.mux.com/..."
              className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 font-mono text-xs text-[var(--kj-ink)] placeholder:text-[var(--kj-muted)] focus:border-[var(--kj-green)] focus:outline-none"
            />
            {muxInput.trim() && (
              <p className={`mt-1 font-mono text-[11px] ${extractedPlaybackId ? 'text-[var(--kj-green)]' : 'text-red-500'}`}>
                {extractedPlaybackId
                  ? `✓ Playback ID: ${extractedPlaybackId}`
                  : 'Invalid Mux Playback ID format (paste raw ID or player.mux.com / stream.mux.com URL)'}
              </p>
            )}

            {showMuxPreview && extractedPlaybackId && (
              <div className="mt-2.5 overflow-hidden rounded-xl border border-[var(--kj-border)] bg-black">
                <iframe
                  src={buildMuxEmbedUrl(extractedPlaybackId, {
                    title: title || 'Mux Preview',
                    posterTimeSec: posterTimeSec ? Number(posterTimeSec) : undefined,
                  })}
                  title="Admin Mux Preview"
                  className="aspect-video w-full border-0"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* Primary Title + Optional Localized Titles */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--kj-ink)]">
                {pickLoc(locale, { ckb: 'تایتڵی وانە *', kmr: 'ناڤنیشانێ وانەیێ *', ar: 'عنوان الدرس *', en: 'Lesson Title *' })}
              </label>
              <button
                type="button"
                onClick={() => setShowMultiLangTitles((s) => !s)}
                className="text-[11px] font-bold text-[var(--kj-green)] hover:underline cursor-pointer"
              >
                {showMultiLangTitles
                  ? pickLoc(locale, { ckb: 'شاردنەوەی زمانەکان', kmr: 'ڤەشارتنا زمانان', ar: 'إخفاء اللغات', en: 'Hide translations' })
                  : pickLoc(locale, { ckb: '+ تایتڵ بە ٤ زمان', kmr: '+ ناڤنیشان ب ٤ زمانان', ar: '+ عناوين بـ ٤ لغات', en: '+ Multilingual titles' })}
              </button>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={pickLoc(locale, {
                ckb: 'نموونە: فێربوونی Flexbox و Grid لە سفڕەوە',
                kmr: 'نموونە: فێربوونا Flexbox و Grid',
                ar: 'مثال: شرح Flexbox و Grid بالتفصيل',
                en: 'e.g. Mastering CSS Flexbox & Grid Layouts',
              })}
              className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 text-xs text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
            />
          </div>

          {showMultiLangTitles && (
            <div className="grid grid-cols-1 gap-2.5 rounded-xl border border-[var(--kj-border)] bg-[var(--kj-soft)]/50 p-3 sm:grid-cols-2">
              <input
                type="text"
                value={titleCkb}
                onChange={(e) => setTitleCkb(e.target.value)}
                placeholder="تایتڵ (سۆرانی)"
                className="rounded-lg border border-[var(--kj-border)] bg-[var(--kj-card)] px-2.5 py-1.5 text-xs text-[var(--kj-ink)]"
              />
              <input
                type="text"
                value={titleKmr}
                onChange={(e) => setTitleKmr(e.target.value)}
                placeholder="ناڤنیشان (بادینی)"
                className="rounded-lg border border-[var(--kj-border)] bg-[var(--kj-card)] px-2.5 py-1.5 text-xs text-[var(--kj-ink)]"
              />
              <input
                type="text"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="العنوان (العربية)"
                className="rounded-lg border border-[var(--kj-border)] bg-[var(--kj-card)] px-2.5 py-1.5 text-xs text-[var(--kj-ink)]"
              />
              <input
                type="text"
                dir="ltr"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Title (English)"
                className="rounded-lg border border-[var(--kj-border)] bg-[var(--kj-card)] px-2.5 py-1.5 text-xs text-[var(--kj-ink)]"
              />
            </div>
          )}

          {/* Course / Programming Track & Spoken Language */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--kj-ink)]">
                {pickLoc(locale, { ckb: 'بەشی زمانی پرۆگرامینگ', kmr: 'بەشێ زمانێ پرۆگرامێ', ar: 'المسار / لغة البرمجة', en: 'Programming Track' })}
              </label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 text-xs font-semibold text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id.toUpperCase()} · {cleanTitle(c.titles[locale] || c.titles.en)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--kj-ink)]">
                {pickLoc(locale, { ckb: 'زمانی قسەکردن لە ڤیدیۆ', kmr: 'زمانێ وانەیێ', ar: 'لغة الشرح الصوتي', en: 'Spoken Language' })}
              </label>
              <select
                value={lessonLanguage}
                onChange={(e) => setLessonLanguage(e.target.value as Locale)}
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 text-xs font-semibold text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
              >
                {(['ckb', 'kmr', 'ar', 'en'] as Locale[]).map((code) => (
                  <option key={code} value={code}>
                    {LOCALE_META[code].nativeLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lesson Type ("جۆری وانە") & Difficulty */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--kj-ink)]">
                {pickLoc(locale, { ckb: 'جۆری وانە', kmr: 'جۆرێ وانەیێ', ar: 'نوع الدرس', en: 'Lesson Type' })}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VideoLessonCategory)}
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 text-xs font-semibold text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
              >
                {VIDEO_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {pickLoc(locale, opt.names)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--kj-ink)]">
                {pickLoc(locale, { ckb: 'ئاستی وانە', kmr: 'ئاستێ وانەیێ', ar: 'المستوى', en: 'Difficulty' })}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 text-xs font-semibold text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
              >
                <option value="beginner">{pickLoc(locale, { ckb: 'سەرەتایی', kmr: 'دەستپێک', ar: 'مبتدئ', en: 'Beginner' })}</option>
                <option value="intermediate">{pickLoc(locale, { ckb: 'ناوەند', kmr: 'ناڤنجی', ar: 'متوسط', en: 'Intermediate' })}</option>
                <option value="advanced">{pickLoc(locale, { ckb: 'پێشکەوتوو', kmr: 'پێشکەفتی', ar: 'متقدم', en: 'Advanced' })}</option>
              </select>
            </div>
          </div>

          {/* Order, Duration, Poster Time, Plan */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-bold text-[var(--kj-muted-2)]">Order #</label>
              <input
                type="number"
                min={0}
                max={5000}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-2.5 py-2 text-xs text-[var(--kj-ink)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold text-[var(--kj-muted-2)]">
                {pickLoc(locale, { ckb: 'ماوە (Duration)', kmr: 'دەم', ar: 'المدة', en: 'Duration' })}
              </label>
              <input
                type="text"
                dir="ltr"
                value={durationLabel}
                onChange={(e) => setDurationLabel(e.target.value)}
                placeholder="14:30"
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-2.5 py-2 font-mono text-xs text-[var(--kj-ink)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold text-[var(--kj-muted-2)]">
                {pickLoc(locale, { ckb: 'چرکەی پۆستەر', kmr: 'پۆستەر (s)', ar: 'ثانية الغلاف', en: 'Poster (sec)' })}
              </label>
              <input
                type="number"
                min={0}
                max={36000}
                value={posterTimeSec}
                onChange={(e) => setPosterTimeSec(e.target.value)}
                placeholder="5"
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-2.5 py-2 font-mono text-xs text-[var(--kj-ink)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold text-[var(--kj-muted-2)]">Plan</label>
              <select
                value={accessPlan}
                onChange={(e) => setAccessPlan(e.target.value as 'free' | 'pro')}
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-2 py-2 text-xs font-semibold text-[var(--kj-ink)]"
              >
                <option value="free">Free</option>
                <option value="pro">Pro Only</option>
              </select>
            </div>
          </div>

          {/* Series / Group & Instructor */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--kj-ink)]">
                {pickLoc(locale, { ckb: 'گڕوپ / بەش (Series)', kmr: 'کۆم / زنجیرە', ar: 'السلسلة / الفصل', en: 'Series / Chapter Group' })}
              </label>
              <input
                type="text"
                value={chapterGroup}
                onChange={(e) => setChapterGroup(e.target.value)}
                placeholder={pickLoc(locale, { ckb: 'نموونە: بەشی یەکەم - بنەماکان', kmr: 'نموونە: بەشێ ئێکێ', ar: 'مثال: الأساسيات', en: 'e.g. Module 1: Fundamentals' })}
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 text-xs text-[var(--kj-ink)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--kj-ink)]">
                {pickLoc(locale, { ckb: 'ناوی وانەبێژ', kmr: 'ناڤێ مامۆستای', ar: 'اسم المحاضر', en: 'Instructor Name' })}
              </label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="AZHAN HAMMZA"
                className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 text-xs text-[var(--kj-ink)]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-xs font-bold text-[var(--kj-ink)]">
              {pickLoc(locale, { ckb: 'شیکردنەوەی وانە', kmr: 'شیکرنا وانەیێ', ar: 'وصف الدرس', en: 'Description / Notes' })}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={pickLoc(locale, {
                ckb: 'پوختەیەک دەربارەی ئەم وانە ڤیدیۆییە بنووسە...',
                kmr: 'کورتە شیکرنەکێ بنڤیسە...',
                ar: 'اكتب ملخصاً حول محتوى هذا الفيديو...',
                en: 'Summarize what learners will master in this video...',
              })}
              className="w-full rounded-lg border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3 py-2 text-xs text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
            />
          </div>

          {/* Key Takeaways & Timestamps */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-bold text-[var(--kj-muted-2)]">
                {pickLoc(locale, { ckb: 'خاڵە سەرەکییەکان (دێڕ بە دێڕ)', kmr: 'خاڵێن سەرەکی (هەر دێڕەک)', ar: 'أبرز النقاط (سطر لكل نقطة)', en: 'Key Takeaways (one per line)' })}
              </label>
              <textarea
                rows={3}
                value={takeawaysText}
                onChange={(e) => setTakeawaysText(e.target.value)}
                placeholder={'Flex container & axis\nJustify vs Align\nResponsive wrap'}
                className="w-full rounded-lg border border-[var(--kj-border)] bg-[var(--kj-paper)] px-2.5 py-2 text-xs text-[var(--kj-ink)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold text-[var(--kj-muted-2)]">
                {pickLoc(locale, { ckb: 'بەشە کاتییەکان (00:00 پێشەکی)', kmr: 'بەشێن دەمى (00:00 پێشەکی)', ar: 'فواصل الفيديو (00:00 مقدمة)', en: 'Chapters (00:00 Intro)' })}
              </label>
              <textarea
                rows={3}
                value={chaptersText}
                onChange={(e) => setChaptersText(e.target.value)}
                placeholder={'00:00 پێشەکی\n04:20 نموونەی یەکەم\n11:15 کۆتایی'}
                className="w-full rounded-lg border border-[var(--kj-border)] bg-[var(--kj-paper)] px-2.5 py-2 text-xs text-[var(--kj-ink)]"
              />
            </div>
          </div>

          {/* Linked Lesson & Starter Code */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold text-[var(--kj-muted-2)]">
                {pickLoc(locale, { ckb: 'بەستنەوە بە وانەی نووسراوی ئەکادیمیا (ئارەزوومەندانە)', kmr: 'گرێدان دگەل وانەیا ئەکادیمیێ', ar: 'ربط بدرس نصي في الأكاديمية (اختياري)', en: 'Link Written Academy Lesson (Optional)' })}
              </label>
              <select
                value={linkedLessonId}
                onChange={(e) => setLinkedLessonId(e.target.value)}
                className="w-full rounded-lg border border-[var(--kj-border)] bg-[var(--kj-paper)] px-2.5 py-2 text-xs text-[var(--kj-ink)]"
              >
                <option value="">
                  {pickLoc(locale, { ckb: 'بێ بەستنەوە', kmr: 'بێ گرێدان', ar: 'بدون ربط', en: 'None' })}
                </option>
                {trackLessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    #{String(l.order).padStart(2, '0')} · {cleanTitle((l.translations[locale] || l.translations.en).title)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold text-[var(--kj-muted-2)]">
                {pickLoc(locale, { ckb: 'کۆدی نموونە بۆ تاقیگەی کۆد (ئارەزوومەندانە)', kmr: 'کۆدێ نموونە بۆ Code Lab', ar: 'كود تطبيقي لمختبر الكود (اختياري)', en: 'Starter Code for Code Lab (Optional)' })}
              </label>
              <textarea
                rows={2}
                dir="ltr"
                value={resourceCode}
                onChange={(e) => setResourceCode(e.target.value)}
                placeholder="<div class='box'>Hello karejan</div>"
                className="w-full rounded-lg border border-[var(--kj-border)] bg-[var(--kj-paper)] px-2.5 py-2 font-mono text-xs text-[var(--kj-ink)]"
              />
            </div>
          </div>

          {/* Publish Switch */}
          <label className="flex items-center gap-2.5 rounded-lg border border-[var(--kj-border)] bg-[var(--kj-soft)]/40 px-3 py-2.5 text-xs font-bold text-[var(--kj-ink)] cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-[var(--kj-green)]"
            />
            <span>
              {pickLoc(locale, {
                ckb: 'بڵاوبکرێتەوە بۆ هەموو فێرخوازان (Published)',
                kmr: 'بۆ هەمی قوتابییان بهێتە بەلاڤکرن (Published)',
                ar: 'نشر الدرس للجميع فوراً (Published)',
                en: 'Publish immediately for learners (uncheck for Draft)',
              })}
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button type="submit" variant="primary" size="md" disabled={saving} className="flex-1">
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>
                {saving
                  ? '...'
                  : editingId
                    ? pickLoc(locale, { ckb: 'نوێکردنەوەی وانە', kmr: 'نویکرنا وانەیێ', ar: 'حفظ التعديلات', en: 'Update Video Lesson' })
                    : pickLoc(locale, { ckb: 'زیادکردنی وانە بۆ ماڵپەڕ', kmr: 'زێدەکرنا وانەیێ', ar: 'إضافة ونشر الفيديو', en: 'Publish Video Lesson' })}
              </span>
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" size="md" onClick={resetForm}>
                {pickLoc(locale, { ckb: 'پاشگەزبوونەوە', kmr: 'پاشڤەگەڕیان', ar: 'إلغاء', en: 'Cancel' })}
              </Button>
            )}
          </div>
        </form>
      </Surface>

      {/* Right Library Table / Cards (Admin Manage + Delete + Live Preview) */}
      <Surface className="p-6 lg:col-span-7 text-start">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--kj-border)] pb-3">
          <div>
            <h2 className="flex items-center gap-2 text-base font-extrabold text-[var(--kj-ink)]">
              <Film className="h-5 w-5 text-[var(--kj-green)]" />
              <span>
                {pickLoc(locale, { ckb: 'کتێبخانەی ڤیدیۆکان', kmr: 'پەرتووکخانا ڤیدیۆیان', ar: 'مكتبة دروس الفيديو', en: 'Mux Video Library' })}
              </span>
              <span className="rounded-full bg-[var(--kj-badge-bg)] px-2.5 py-0.5 font-mono text-xs font-bold text-[var(--kj-badge-ink)] tabular-nums">
                {videoLessons.length}
              </span>
            </h2>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveView('videos')}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>
              {pickLoc(locale, { ckb: 'بینینی پەڕەی ڤیدیۆ', kmr: 'دیتنا لاپەڕێ ڤیدیۆ', ar: 'معاينة صفحة الفيديو', en: 'Open Video Tab' })}
            </span>
          </Button>
        </div>

        {/* Admin Filter Row */}
        <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--kj-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={pickLoc(locale, { ckb: 'گەڕان لە ڤیدیۆکان یان Playback ID...', kmr: 'لێگەڕیان...', ar: 'بحث بالعنوان أو Playback ID...', en: 'Search title or Playback ID...' })}
              className="h-9 w-full rounded-lg border border-[var(--kj-border)] bg-[var(--kj-paper)] ps-9 pe-3 text-xs text-[var(--kj-ink)]"
            />
          </div>
          <select
            value={filterTrack}
            onChange={(e) => setFilterTrack(e.target.value)}
            className="h-9 rounded-lg border border-[var(--kj-border)] bg-[var(--kj-paper)] px-2.5 text-xs font-semibold text-[var(--kj-ink)]"
          >
            <option value="all">{pickLoc(locale, { ckb: 'هەموو بەشەکان', kmr: 'هەمی بەش', ar: 'كل المسارات', en: 'All Tracks' })}</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--kj-border-strong)] bg-[var(--kj-soft)]/30 p-8 text-center">
            <Layers className="mx-auto mb-2 h-8 w-8 text-[var(--kj-muted)]" />
            <p className="text-sm font-bold text-[var(--kj-ink)]">
              {pickLoc(locale, { ckb: 'هیچ وانەیەکی ڤیدیۆیی تۆمار نەکراوە', kmr: 'چ وانە نەهاتنە تۆمارکرن', ar: 'لا توجد دروس فيديو مضافة بعد', en: 'No Mux video lessons yet' })}
            </p>
            <p className="mt-1 text-xs text-[var(--kj-muted)]">
              {pickLoc(locale, {
                ckb: 'Playback IDـی Mux لە فۆڕمی لاوە بنووسە بۆ زیادکردنی یەکەم وانەی ڤیدیۆیی.',
                kmr: 'Playback ID یێ Mux بنڤیسە بۆ زێدەکرنا ئێکەم ڤیدیۆ.',
                ar: 'أدخل Mux Playback ID من النموذج الجانبي لنشر أول درس.',
                en: 'Paste a Mux Playback ID in the form to publish your first lesson.',
              })}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[780px] overflow-y-auto pe-1">
            {filteredVideos.map((v) => {
              const thumbUrl = buildMuxThumbnailUrl(v.muxPlaybackId, { width: 320, timeSec: v.posterTimeSec });
              const typeMeta = VIDEO_TYPE_OPTIONS.find((x) => x.id === v.category);
              const confirmDelete = confirmDeleteId === v.id;

              return (
                <div
                  key={v.id}
                  className={`rounded-xl border p-3.5 transition-colors ${
                    editingId === v.id
                      ? 'border-[var(--kj-green)] bg-[var(--kj-soft)]/50'
                      : 'border-[var(--kj-border)] bg-[var(--kj-paper)]'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="relative h-[74px] w-full sm:w-[130px] shrink-0 overflow-hidden rounded-lg bg-black">
                      {thumbUrl ? (
                        <img
                          src={thumbUrl}
                          alt={v.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      <span className="absolute bottom-1 start-1 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
                        #{String(v.order).padStart(2, '0')}
                      </span>
                      {v.durationLabel && (
                        <span className="absolute bottom-1 end-1 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] text-white">
                          {v.durationLabel}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                        <span className="rounded bg-[var(--kj-badge-bg)] px-2 py-0.5 text-[var(--kj-badge-ink)]">
                          {v.track.toUpperCase()}
                        </span>
                        <span className="rounded bg-[var(--kj-soft)] px-2 py-0.5 text-[var(--kj-ink)]">
                          {typeMeta ? pickLoc(locale, typeMeta.names) : v.category}
                        </span>
                        <span className="rounded border border-[var(--kj-border)] px-2 py-0.5 text-[var(--kj-muted-2)]">
                          {LOCALE_META[v.lessonLanguage]?.nativeLabel}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 ${
                            v.published
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-300'
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          {v.published ? 'Live' : 'Draft'}
                        </span>
                      </div>

                      <h3 className="mt-1.5 text-sm font-extrabold text-[var(--kj-ink)]">{v.title}</h3>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-[var(--kj-muted)]" dir="ltr">
                        Mux ID: {v.muxPlaybackId}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveVideoId(v.id);
                            setActiveView('videos');
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--kj-border)] bg-[var(--kj-card)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--kj-ink)] hover:border-[var(--kj-green)] cursor-pointer"
                        >
                          <Play className="h-3 w-3 text-[var(--kj-green)]" />
                          <span>{pickLoc(locale, { ckb: 'بینین', kmr: 'دیتن', ar: 'مشاهدة', en: 'Watch' })}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => startEdit(v)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--kj-border)] bg-[var(--kj-card)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--kj-ink)] hover:border-[var(--kj-green)] cursor-pointer"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>{pickLoc(locale, { ckb: 'دەستکاری', kmr: 'گوهۆڕین', ar: 'تعديل', en: 'Edit' })}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleTogglePublished(v)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[var(--kj-border)] bg-[var(--kj-card)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--kj-muted-2)] hover:border-[var(--kj-green)] cursor-pointer"
                        >
                          <span>{v.published ? 'Unpublish' : 'Publish'}</span>
                        </button>

                        {confirmDelete ? (
                          <div className="inline-flex items-center gap-1.5 ms-auto">
                            <button
                              type="button"
                              disabled={deletingId === v.id}
                              onClick={() => void handleDelete(v)}
                              className="rounded-lg bg-red-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-red-700 cursor-pointer"
                            >
                              {deletingId === v.id
                                ? '...'
                                : pickLoc(locale, { ckb: 'دڵنیایت؟ بسڕەوە', kmr: 'بەلێ، ژێببە', ar: 'تأكيد الحذف', en: 'Confirm Delete' })}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-lg border border-[var(--kj-border)] bg-[var(--kj-card)] px-2 py-1.5 text-[11px] font-bold text-[var(--kj-muted)] cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(v.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-400/40 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-bold text-red-500 hover:bg-red-500/20 ms-auto cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>{pickLoc(locale, { ckb: 'سڕینەوە', kmr: 'ژێبرن', ar: 'حذف', en: 'Delete' })}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Surface>
    </div>
  );
};
