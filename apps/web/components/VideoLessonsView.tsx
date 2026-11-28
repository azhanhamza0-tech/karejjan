import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Crown,
  Film,
  Filter,
  Globe,
  Layers,
  ListVideo,
  Lock,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Search,
  Settings2,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getThemeDefinition } from '../data/themesCatalog';
import { buildMuxEmbedUrl, buildMuxThumbnailUrl } from '../lib/mux';
import { cleanTitle, LOCALE_META, pickLoc } from '../i18n/translations';
import type { Locale, VideoLesson, VideoLessonCategory } from '../types/domain';
import { Button, Surface } from './ui/Primitives';

const VIDEO_CATEGORY_LABELS: Record<VideoLessonCategory, Record<Locale, string>> = {
  tutorial: {
    ckb: 'فێرکاری قۆناغ بە قۆناغ',
    kmr: 'فێرکاری قۆناغ ب قۆناغ',
    ar: 'شرح تعليمي',
    en: 'Course Tutorial',
  },
  project: {
    ckb: 'دروستکردنی پڕۆژە',
    kmr: 'ئاڤاکرنا پڕۆژەی',
    ar: 'بناء مشروع عملي',
    en: 'Project Build',
  },
  crash_course: {
    ckb: 'کۆرسی خێرا و چڕ',
    kmr: 'کۆرسێ بلەز',
    ar: 'دورة مكثفة',
    en: 'Crash Course',
  },
  tips: {
    ckb: 'فێڵ و تێبینی خێرا',
    kmr: 'تێبینی و فێلێن بلەز',
    ar: 'نصائح سريعة',
    en: 'Quick Tips',
  },
  workshop: {
    ckb: 'وۆرکشۆپی پراکتیکی',
    kmr: 'وۆرکشۆپا پراکتیکی',
    ar: 'ورشة تطبيقية',
    en: 'Workshop',
  },
  problem_solving: {
    ckb: 'شیکاری کێشە و ئەلگۆریتم',
    kmr: 'شیکرنا ئاریشان',
    ar: 'حل المشكلات',
    en: 'Problem Solving',
  },
};

const DIFFICULTY_LABELS: Record<'beginner' | 'intermediate' | 'advanced', Record<Locale, string>> = {
  beginner: { ckb: 'سەرەتایی', kmr: 'دەستپێک', ar: 'مبتدئ', en: 'Beginner' },
  intermediate: { ckb: 'ناوەند', kmr: 'ناڤنجی', ar: 'متوسط', en: 'Intermediate' },
  advanced: { ckb: 'پێشکەوتوو', kmr: 'پێشکەفتی', ar: 'متقدم', en: 'Advanced' },
};

interface VideoUiStrings {
  eyebrow: string;
  heading: string;
  sub: string;
  allTracks: string;
  allTypes: string;
  allLanguages: string;
  allLevels: string;
  savedOnly: string;
  searchPlaceholder: string;
  resetFilters: string;
  manageVideosAdmin: string;
  playlistHeading: string;
  watchedLabel: string;
  markWatched: string;
  bookmarkLabel: string;
  bookmarkedLabel: string;
  theaterOn: string;
  theaterOff: string;
  prevVideo: string;
  nextVideo: string;
  takeawaysTitle: string;
  chaptersTitle: string;
  openInCodeLab: string;
  openRelatedLesson: string;
  instructorLabel: string;
  proLockedTitle: string;
  proLockedDesc: string;
  upgradePro: string;
  emptyTitle: string;
  emptyDesc: string;
  emptyAdminCta: string;
  draftBadge: string;
  hdStreamTag: string;
  episodeWord: string;
}

const VIDEO_UI: Record<Locale, VideoUiStrings> = {
  ckb: {
    eyebrow: 'ئەکادیمیای ڤیدیۆ · MUX HD',
    heading: 'وانە ڤیدیۆییەکان',
    sub: 'فێربە بە شێوەی کرداری لە ڕێگەی پەخشێکی خێرا و پاک بە ڤیدیۆی کوالێتی بەرز و لیستە ڕێکخراوەکان.',
    allTracks: 'هەموو بەشەکان',
    allTypes: 'هەموو جۆرەکان',
    allLanguages: 'هەموو زمانەکان',
    allLevels: 'هەموو ئاستەکان',
    savedOnly: 'سەیڤکراوەکان',
    searchPlaceholder: 'گەڕان لە ناونیشان، مامۆستا یان گڕوپ...',
    resetFilters: 'لابردنی فلتەر',
    manageVideosAdmin: 'بەڕێوەبردنی ڤیدیۆکان (ئەدمین)',
    playlistHeading: 'لیستی وانەکانی ئەم بەشە',
    watchedLabel: 'سەیرکراوە',
    markWatched: 'وەک سەیرکراو دیاری بکە',
    bookmarkLabel: 'پاشەکەوتکردن',
    bookmarkedLabel: 'سەیڤکراوە',
    theaterOn: 'گەورەکردنی فرەیم',
    theaterOff: 'دۆخی ئاسایی',
    prevVideo: 'وانەی پێشوو',
    nextVideo: 'وانەی داهاتوو',
    takeawaysTitle: 'لەم وانە ڤیدیۆییەدا فێردەبیت:',
    chaptersTitle: 'بەشەکانی ناو ڤیدیۆ (Chapters):',
    openInCodeLab: 'تاقیکردنەوەی کۆد لە Code Lab',
    openRelatedLesson: 'کردنەوەی وانەی نووسراو',
    instructorLabel: 'وانەبێژ:',
    proLockedTitle: 'ئەم وانە ڤیدیۆییە تایبەتە بە پلانی Pro',
    proLockedDesc: 'بۆ سەیرکردنی ئەم ڤیدیۆیە و هەموو پڕۆژە پێشکەوتووەکان هەژمارەکەت بەرز بکەرەوە.',
    upgradePro: 'بەرزکردنەوە بۆ Pro',
    emptyTitle: 'هێشتا هیچ وانەیەکی ڤیدیۆیی بڵاونەکراوەتەوە',
    emptyDesc: 'لە ئێستادا بەپێی ئەم فلتەرە هیچ ڤیدیۆیەک نییە، یان بەم زووانە وانەی نوێ زیاد دەکرێت.',
    emptyAdminCta: 'زیادکردنی یەکەم ڤیدیۆ لە Mux »',
    draftBadge: 'ڕەشنووس (تەنها ئەدمین دەیبینێت)',
    hdStreamTag: 'MUX ADAPTIVE HD',
    episodeWord: 'وانەی',
  },
  kmr: {
    eyebrow: 'ئەکادیمییا ڤیدیۆیێ · MUX HD',
    heading: 'وانەیێن ڤیدیۆیی',
    sub: 'ب رێکا پەخشەکێ بلەز و پاقژ دگەل ڤیدیۆیێن ب کوالێتییا بلند فێرببە.',
    allTracks: 'هەمی بەش',
    allTypes: 'هەمی جۆر',
    allLanguages: 'هەمی زمان',
    allLevels: 'هەمی ئاست',
    savedOnly: 'پاشکەفتکری',
    searchPlaceholder: 'لێگەڕیان د ناڤنیشان، مامۆستا یان کۆمێ دا...',
    resetFilters: 'لابرنا فلتەران',
    manageVideosAdmin: 'ڕێڤەبرنا ڤیدیۆیان (ئەدمین)',
    playlistHeading: 'لیستا وانەیێن ڤی بەشی',
    watchedLabel: 'هاتییە دیتن',
    markWatched: 'وەک دیتى نیشان بکە',
    bookmarkLabel: 'پاشکەفتکرن',
    bookmarkedLabel: 'پاشکەفتکریە',
    theaterOn: 'فرەیمێ مەزن',
    theaterOff: 'دۆخێ ئاسایی',
    prevVideo: 'وانەیا بەرێ',
    nextVideo: 'وانەیا بهێت',
    takeawaysTitle: 'د ڤێ وانەیێ دا دێ فێربی:',
    chaptersTitle: 'بەشێن ناڤ ڤیدیۆیێ:',
    openInCodeLab: 'تاقیکرنا کۆدی د Code Lab دا',
    openRelatedLesson: 'ڤەکرنا وانەیا نڤیسکی',
    instructorLabel: 'مامۆستا:',
    proLockedTitle: 'ئەڤ وانەیە تایبەتە ب پلانا Pro',
    proLockedDesc: 'بۆ دیتنا ڤێ ڤیدیۆیێ و پڕۆژەیێن پێشکەفتی پلانا خۆ بلند بکە.',
    upgradePro: 'بلندکرن بۆ Pro',
    emptyTitle: 'هێشتا چ وانەیێن ڤیدیۆیی بەردەست نینن',
    emptyDesc: 'ل دویڤ ڤی فلتەری چ ڤیدیۆ نەهاتنە دیتن، یان دێ د نێزیک دا هێنە زێدەکرن.',
    emptyAdminCta: 'زێدەکرنا ئێکەم ڤیدیۆ ژ Mux »',
    draftBadge: 'ڕەشنڤیس (ب تنێ ئەدمین دبینیت)',
    hdStreamTag: 'MUX ADAPTIVE HD',
    episodeWord: 'وانە',
  },
  ar: {
    eyebrow: 'أكاديمية الفيديو · MUX HD',
    heading: 'دروس الفيديو التفاعلية',
    sub: 'تعلّم عملياً عبر بث فائق الجودة مع قوائم تشغيل منظمة وملاحظات تطبيقية.',
    allTracks: 'كل المسارات',
    allTypes: 'كل الأنواع',
    allLanguages: 'كل اللغات',
    allLevels: 'كل المستويات',
    savedOnly: 'المحفوظة',
    searchPlaceholder: 'ابحث بالعنوان أو المحاضر أو الوحدة...',
    resetFilters: 'إعادة ضبط الفلاتر',
    manageVideosAdmin: 'إدارة الفيديوهات (للإدارة)',
    playlistHeading: 'قائمة دروس هذا المسار',
    watchedLabel: 'تمت المشاهدة',
    markWatched: 'تحديد كمُشاهد',
    bookmarkLabel: 'حفظ الدرس',
    bookmarkedLabel: 'محفوظ',
    theaterOn: 'وضع السينما العريض',
    theaterOff: 'الوضع القياسي',
    prevVideo: 'الدرس السابق',
    nextVideo: 'الدرس التالي',
    takeawaysTitle: 'أهم محاور هذا الدرس:',
    chaptersTitle: 'فصول الفيديو:',
    openInCodeLab: 'تجربة الكود في المختبر',
    openRelatedLesson: 'فتح الدرس النصي المرتبط',
    instructorLabel: 'المحاضر:',
    proLockedTitle: 'هذا الدرس حصري لمشتركي Pro',
    proLockedDesc: 'قم بترقية حسابك للوصول إلى جميع الدروس والمشاريع التطبيقية الكاملة.',
    upgradePro: 'الترقية إلى Pro',
    emptyTitle: 'لا توجد دروس فيديو منشورة بعد',
    emptyDesc: 'لم يتم العثور على دروس مطابقة للفلاتر الحالية، أو سيتم نشر دروس جديدة قريباً.',
    emptyAdminCta: 'إضافة أول فيديو عبر Mux »',
    draftBadge: 'مسودة (مرئية للإدارة فقط)',
    hdStreamTag: 'MUX ADAPTIVE HD',
    episodeWord: 'درس',
  },
  en: {
    eyebrow: 'VIDEO ACADEMY · MUX HD STREAM',
    heading: 'Video Lessons',
    sub: 'Watch structured coding tutorials, project builds, and workshops in an adaptive cinema frame.',
    allTracks: 'All Tracks',
    allTypes: 'All Types',
    allLanguages: 'All Languages',
    allLevels: 'All Levels',
    savedOnly: 'Bookmarked',
    searchPlaceholder: 'Search by title, topic, or instructor...',
    resetFilters: 'Reset filters',
    manageVideosAdmin: 'Manage Videos (Admin)',
    playlistHeading: 'Track Playlist',
    watchedLabel: 'Watched',
    markWatched: 'Mark as watched',
    bookmarkLabel: 'Bookmark',
    bookmarkedLabel: 'Saved',
    theaterOn: 'Theater Frame',
    theaterOff: 'Standard View',
    prevVideo: 'Previous',
    nextVideo: 'Next Video',
    takeawaysTitle: 'What you will learn in this video:',
    chaptersTitle: 'Video Chapters:',
    openInCodeLab: 'Open Code in Code Lab',
    openRelatedLesson: 'Open Written Lesson',
    instructorLabel: 'Instructor:',
    proLockedTitle: 'Pro Exclusive Video Lesson',
    proLockedDesc: 'Upgrade to Pro to unlock this video lesson along with full project walkthroughs.',
    upgradePro: 'Upgrade to Pro',
    emptyTitle: 'No video lessons available yet',
    emptyDesc: 'No published videos match your selected filters right now, or new lessons are being prepared.',
    emptyAdminCta: 'Add First Mux Video »',
    draftBadge: 'Draft (Admin Only)',
    hdStreamTag: 'MUX ADAPTIVE HD',
    episodeWord: 'Ep.',
  },
};

const VideoThumbnail: React.FC<{
  playbackId: string;
  posterTimeSec?: number;
  title: string;
  className?: string;
}> = ({ playbackId, posterTimeSec, title, className = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const src = buildMuxThumbnailUrl(playbackId, { width: 480, timeSec: posterTimeSec });

  useEffect(() => {
    setImgFailed(false);
  }, [playbackId, posterTimeSec]);

  if (!src || imgFailed) {
    return (
      <div
        className={`flex items-center justify-center bg-[var(--kj-band-bg)] text-[var(--kj-band-accent)] ${className}`}
      >
        <Play className="h-6 w-6 opacity-90" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      loading="lazy"
      onError={() => setImgFailed(true)}
      className={`object-cover ${className}`}
    />
  );
};

export const VideoLessonsView: React.FC = () => {
  const {
    locale,
    isRtl,
    theme,
    staffRole,
    effectivePlan,
    courses,
    videoLessons,
    activeVideoId,
    setActiveVideoId,
    watchedVideoIds,
    bookmarkedVideoIds,
    toggleVideoWatched,
    toggleVideoBookmark,
    openCodeInEditor,
    setActiveLessonId,
    setActiveView,
    setAdminRequestedTab,
  } = useApp();

  const copy = pickLoc(locale, VIDEO_UI);
  const isAdmin = staffRole === 'super_admin' || staffRole === 'admin';
  const themeDef = getThemeDefinition(theme);

  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSpokenLang, setSelectedSpokenLang] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theaterMode, setTheaterMode] = useState(false);

  const visibleVideos = useMemo(
    () => videoLessons.filter((v) => isAdmin || v.published),
    [videoLessons, isAdmin]
  );

  const trackCounts = useMemo(() => {
    const map: Record<string, number> = { all: visibleVideos.length };
    visibleVideos.forEach((v) => {
      map[v.track] = (map[v.track] || 0) + 1;
    });
    return map;
  }, [visibleVideos]);

  const availableTrackPills = useMemo(() => {
    const known = courses.map((c) => ({
      id: c.id,
      label: c.id === 'tsx' ? 'TYPESCRIPT' : c.id.toUpperCase(),
    }));
    const knownSet = new Set(known.map((k) => k.id));
    visibleVideos.forEach((v) => {
      if (!knownSet.has(v.track)) {
        knownSet.add(v.track);
        known.push({ id: v.track, label: v.track.toUpperCase() });
      }
    });
    return known;
  }, [courses, visibleVideos]);

  const filteredVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return visibleVideos.filter((v) => {
      if (selectedTrack !== 'all' && v.track !== selectedTrack) return false;
      if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
      if (selectedSpokenLang !== 'all' && v.lessonLanguage !== selectedSpokenLang) return false;
      if (selectedDifficulty !== 'all' && v.difficulty !== selectedDifficulty) return false;
      if (savedOnly && !bookmarkedVideoIds.has(v.id)) return false;
      if (q) {
        const allText = `${v.title} ${v.titles?.ckb || ''} ${v.titles?.kmr || ''} ${v.titles?.ar || ''} ${v.titles?.en || ''} ${v.description} ${v.instructor || ''} ${v.chapterGroup || ''} ${v.track}`.toLowerCase();
        if (!allText.includes(q)) return false;
      }
      return true;
    });
  }, [
    visibleVideos,
    selectedTrack,
    selectedCategory,
    selectedSpokenLang,
    selectedDifficulty,
    savedOnly,
    bookmarkedVideoIds,
    searchQuery,
  ]);

  const activeVideo: VideoLesson | null = useMemo(() => {
    if (filteredVideos.length === 0) return null;
    if (activeVideoId) {
      const found = filteredVideos.find((v) => v.id === activeVideoId);
      if (found) return found;
    }
    return filteredVideos[0];
  }, [filteredVideos, activeVideoId]);

  useEffect(() => {
    if (activeVideo && activeVideo.id !== activeVideoId) {
      setActiveVideoId(activeVideo.id);
    }
  }, [activeVideo, activeVideoId, setActiveVideoId]);

  const getVideoTitle = (v: VideoLesson): string => cleanTitle(v.titles?.[locale] || v.title);

  const activeIndex = activeVideo ? filteredVideos.findIndex((v) => v.id === activeVideo.id) : -1;
  const prevVideo = activeIndex > 0 ? filteredVideos[activeIndex - 1] : null;
  const nextVideo = activeIndex >= 0 && activeIndex < filteredVideos.length - 1 ? filteredVideos[activeIndex + 1] : null;

  const hasActiveFilters =
    selectedTrack !== 'all' ||
    selectedCategory !== 'all' ||
    selectedSpokenLang !== 'all' ||
    selectedDifficulty !== 'all' ||
    savedOnly ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedTrack('all');
    setSelectedCategory('all');
    setSelectedSpokenLang('all');
    setSelectedDifficulty('all');
    setSavedOnly(false);
    setSearchQuery('');
  };

  const openAdminVideosTab = () => {
    setAdminRequestedTab('videos');
    setActiveView('admin');
  };

  const isProLockedForViewer = Boolean(
    activeVideo && activeVideo.accessPlan === 'pro' && effectivePlan !== 'pro' && !isAdmin
  );

  return (
    <div>
      {/* 1. Programming Language / Course Ribbon */}
      <nav
        aria-label="Video coding tracks"
        className="border-b border-[var(--kj-ribbon-border)] bg-[var(--kj-ribbon-bg)] text-[var(--kj-ribbon-ink)] overflow-x-auto transition-colors duration-250"
      >
        <div className="mx-auto flex min-h-[48px] max-w-[1440px] items-center gap-5 px-4 sm:px-6 whitespace-nowrap">
          <button
            type="button"
            onClick={() => setSelectedTrack('all')}
            className={`inline-flex items-center gap-2 border-b-2 py-3 text-[11px] font-bold uppercase tracking-[0.04em] transition-colors shrink-0 cursor-pointer ${
              selectedTrack === 'all'
                ? 'border-[var(--kj-band-accent)] text-[var(--kj-band-accent)]'
                : 'border-transparent text-[var(--kj-ribbon-ink)]/85 hover:text-[var(--kj-band-accent)]'
            }`}
          >
            <span>{copy.allTracks}</span>
            <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] opacity-85 tabular-nums">
              {trackCounts.all || 0}
            </span>
          </button>

          {availableTrackPills.map((tr) => {
            const count = trackCounts[tr.id] || 0;
            const active = selectedTrack === tr.id;
            return (
              <button
                key={tr.id}
                type="button"
                onClick={() => setSelectedTrack(tr.id)}
                className={`inline-flex items-center gap-1.5 border-b-2 py-3 text-[11px] font-bold uppercase tracking-[0.04em] transition-colors shrink-0 cursor-pointer ${
                  active
                    ? 'border-[var(--kj-band-accent)] text-[var(--kj-band-accent)]'
                    : 'border-transparent text-[var(--kj-ribbon-ink)]/80 hover:text-[var(--kj-band-accent)]'
                }`}
              >
                <span dir="ltr">{tr.label}</span>
                {count > 0 && (
                  <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] opacity-90 tabular-nums">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. Header Hero Band */}
      <section className="kj-hero-band">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="text-start max-w-2xl">
              <div className="kj-eyebrow">
                <span className="kj-eyebrow-dot" />
                <span>{copy.eyebrow}</span>
              </div>
              <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--kj-ink)] sm:text-3xl">
                {copy.heading}
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--kj-muted)]">
                {copy.sub}
              </p>
            </div>

            {isAdmin && (
              <Button variant="primary" size="sm" onClick={openAdminVideosTab}>
                <Settings2 className="h-4 w-4" />
                <span>{copy.manageVideosAdmin}</span>
              </Button>
            )}
          </div>

          {/* Search & Structured Filter Controls */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="relative md:col-span-4">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--kj-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={copy.searchPlaceholder}
                className="h-10 w-full rounded-[10px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] ps-9 pe-3 text-xs font-medium text-[var(--kj-ink)] placeholder:text-[var(--kj-muted)] focus:border-[var(--kj-green)] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label={copy.allTypes}
                className="h-10 w-full rounded-[10px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] px-3 text-xs font-semibold text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
              >
                <option value="all">{copy.allTypes}</option>
                {(Object.keys(VIDEO_CATEGORY_LABELS) as VideoLessonCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {pickLoc(locale, VIDEO_CATEGORY_LABELS[cat])}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={selectedSpokenLang}
                onChange={(e) => setSelectedSpokenLang(e.target.value)}
                aria-label={copy.allLanguages}
                className="h-10 w-full rounded-[10px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] px-3 text-xs font-semibold text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
              >
                <option value="all">{copy.allLanguages}</option>
                {(['ckb', 'kmr', 'ar', 'en'] as Locale[]).map((code) => (
                  <option key={code} value={code}>
                    {LOCALE_META[code].nativeLabel}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                aria-label={copy.allLevels}
                className="h-10 w-full rounded-[10px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] px-3 text-xs font-semibold text-[var(--kj-ink)] focus:border-[var(--kj-green)] focus:outline-none"
              >
                <option value="all">{copy.allLevels}</option>
                {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {pickLoc(locale, DIFFICULTY_LABELS[lvl])}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 md:col-span-2">
              <button
                type="button"
                onClick={() => setSavedOnly((s) => !s)}
                aria-pressed={savedOnly}
                className={`inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[10px] border px-3 text-xs font-bold transition-colors cursor-pointer ${
                  savedOnly
                    ? 'border-[var(--kj-green)] bg-[var(--kj-green)] text-[var(--kj-btn-primary-ink)]'
                    : 'border-[var(--kj-border-strong)] bg-[var(--kj-card)] text-[var(--kj-ink)] hover:border-[var(--kj-green)]'
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>{copy.savedOnly}</span>
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  title={copy.resetFilters}
                  aria-label={copy.resetFilters}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] text-[var(--kj-muted)] hover:border-[var(--kj-green)] hover:text-[var(--kj-ink)] cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Cinema Player Frame + Interactive Playlist */}
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
        {!activeVideo ? (
          <Surface className="mx-auto max-w-2xl p-10 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-[var(--kj-soft)] text-[var(--kj-green)]">
              <Film className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-extrabold text-[var(--kj-ink)]">{copy.emptyTitle}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--kj-muted)]">
              {copy.emptyDesc}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {hasActiveFilters && (
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  <Filter className="h-4 w-4" />
                  <span>{copy.resetFilters}</span>
                </Button>
              )}
              {isAdmin && (
                <Button variant="primary" size="sm" onClick={openAdminVideosTab}>
                  <Sparkles className="h-4 w-4" />
                  <span>{copy.emptyAdminCta}</span>
                </Button>
              )}
            </div>
          </Surface>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Primary Mux Theater Player & Lesson Metadata */}
            <div className={theaterMode ? 'lg:col-span-12 space-y-5' : 'lg:col-span-8 space-y-5'}>
              {/* Premium Cinema Bezel Container */}
              <div
                className="overflow-hidden rounded-[22px] border border-[var(--kj-band-border)] bg-[var(--kj-band-bg)] p-2.5 sm:p-4 text-white"
                style={{
                  boxShadow: `0 26px 65px -24px rgba(${themeDef.glowRgb}, 0.35), 0 18px 40px -20px rgba(0, 0, 0, 0.55)`,
                }}
              >
                {/* Studio Top Chrome Strip */}
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider text-[var(--kj-band-accent)]">
                      <span className="h-2 w-2 rounded-full bg-[var(--kj-band-accent)] animate-pulse" />
                      <span>{copy.hdStreamTag}</span>
                    </span>
                    <span className="font-mono text-[11px] font-bold text-white/85 tabular-nums">
                      #{String(activeVideo.order).padStart(2, '0')} · {activeVideo.track.toUpperCase()}
                    </span>
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/90">
                      {LOCALE_META[activeVideo.lessonLanguage]?.nativeLabel || activeVideo.lessonLanguage}
                    </span>
                    {activeVideo.durationLabel && (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-white/75 tabular-nums">
                        <Clock className="h-3 w-3" />
                        <span>{activeVideo.durationLabel}</span>
                      </span>
                    )}
                    {!activeVideo.published && (
                      <span className="rounded-md bg-amber-500/25 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                        {copy.draftBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={!prevVideo}
                      onClick={() => prevVideo && setActiveVideoId(prevVideo.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-white/20 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isRtl ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                      <span className="hidden sm:inline">{copy.prevVideo}</span>
                    </button>
                    <button
                      type="button"
                      disabled={!nextVideo}
                      onClick={() => nextVideo && setActiveVideoId(nextVideo.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-bold text-white transition hover:bg-white/20 disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <span className="hidden sm:inline">{copy.nextVideo}</span>
                      {isRtl ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheaterMode((m) => !m)}
                      title={theaterMode ? copy.theaterOff : copy.theaterOn}
                      className="hidden lg:inline-flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-bold text-[var(--kj-band-accent)] transition hover:bg-white/20 cursor-pointer"
                    >
                      {theaterMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                      <span>{theaterMode ? copy.theaterOff : copy.theaterOn}</span>
                    </button>
                  </div>
                </div>

                {/* Responsive 16:9 Mux Player Viewport */}
                <div className="relative aspect-video w-full overflow-hidden rounded-[14px] bg-black ring-1 ring-white/15">
                  {isProLockedForViewer ? (
                    <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center">
                      <VideoThumbnail
                        playbackId={activeVideo.muxPlaybackId}
                        posterTimeSec={activeVideo.posterTimeSec}
                        title={getVideoTitle(activeVideo)}
                        className="absolute inset-0 h-full w-full opacity-25 blur-xs"
                      />
                      <div className="relative z-10 max-w-md rounded-2xl border border-white/15 bg-black/75 p-6 backdrop-blur-md">
                        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-amber-500/20 text-amber-300">
                          <Lock className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-extrabold text-white">{copy.proLockedTitle}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-white/80">{copy.proLockedDesc}</p>
                        <Button variant="primary" size="sm" className="mt-4" onClick={() => setActiveView('pro')}>
                          <Crown className="h-4 w-4" />
                          <span>{copy.upgradePro}</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      key={`${activeVideo.id}-${activeVideo.muxPlaybackId}-${theme}`}
                      src={buildMuxEmbedUrl(activeVideo.muxPlaybackId, {
                        title: getVideoTitle(activeVideo),
                        accentColor: themeDef.accent,
                        posterTimeSec: activeVideo.posterTimeSec,
                      })}
                      title={getVideoTitle(activeVideo)}
                      className="h-full w-full border-0"
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                    />
                  )}
                </div>
              </div>

              {/* Active Video Details & Interactive Actions */}
              <Surface className="p-6 text-start">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                      <span className="rounded-full bg-[var(--kj-badge-bg)] px-3 py-1 text-[var(--kj-badge-ink)]">
                        {activeVideo.track === 'tsx' ? 'TypeScript' : activeVideo.track.toUpperCase()}
                      </span>
                      <span className="rounded-full bg-[var(--kj-soft)] px-3 py-1 text-[var(--kj-ink)]">
                        {pickLoc(locale, VIDEO_CATEGORY_LABELS[activeVideo.category])}
                      </span>
                      <span className="rounded-full border border-[var(--kj-border)] bg-[var(--kj-paper)] px-3 py-1 text-[var(--kj-muted-2)]">
                        <Globe className="me-1 inline h-3 w-3 text-[var(--kj-green)]" />
                        {LOCALE_META[activeVideo.lessonLanguage]?.nativeLabel}
                      </span>
                      <span className="rounded-full border border-[var(--kj-border)] px-3 py-1 text-[var(--kj-muted)]">
                        {pickLoc(locale, DIFFICULTY_LABELS[activeVideo.difficulty])}
                      </span>
                      {activeVideo.accessPlan === 'pro' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-amber-600 dark:text-amber-300">
                          <Crown className="h-3 w-3" />
                          PRO
                        </span>
                      )}
                    </div>

                    {activeVideo.chapterGroup && (
                      <p className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--kj-green)]">
                        <Layers className="h-3.5 w-3.5" />
                        <span>{activeVideo.chapterGroup}</span>
                      </p>
                    )}

                    <h2 className="text-xl font-extrabold tracking-tight text-[var(--kj-ink)] sm:text-2xl">
                      {getVideoTitle(activeVideo)}
                    </h2>

                    {activeVideo.instructor && (
                      <p className="inline-flex items-center gap-1.5 text-xs text-[var(--kj-muted)]">
                        <UserCheck className="h-3.5 w-3.5 text-[var(--kj-green)]" />
                        <span>{copy.instructorLabel}</span>
                        <strong className="text-[var(--kj-ink)]">{activeVideo.instructor}</strong>
                      </p>
                    )}
                  </div>

                  {/* Watch Progress & Bookmark Controls */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleVideoWatched(activeVideo.id)}
                      aria-pressed={watchedVideoIds.has(activeVideo.id)}
                      className={`inline-flex items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        watchedVideoIds.has(activeVideo.id)
                          ? 'border-[var(--kj-green)] bg-[var(--kj-badge-bg)] text-[var(--kj-badge-ink)]'
                          : 'border-[var(--kj-border-strong)] bg-[var(--kj-soft)] text-[var(--kj-ink)] hover:border-[var(--kj-green)]'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{watchedVideoIds.has(activeVideo.id) ? copy.watchedLabel : copy.markWatched}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleVideoBookmark(activeVideo.id)}
                      aria-pressed={bookmarkedVideoIds.has(activeVideo.id)}
                      className={`inline-flex items-center gap-1.5 rounded-[10px] border px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        bookmarkedVideoIds.has(activeVideo.id)
                          ? 'border-[var(--kj-green)] bg-[var(--kj-green)] text-[var(--kj-btn-primary-ink)]'
                          : 'border-[var(--kj-border-strong)] bg-[var(--kj-card)] text-[var(--kj-ink)] hover:border-[var(--kj-green)]'
                      }`}
                    >
                      <Bookmark className="h-4 w-4" />
                      <span>{bookmarkedVideoIds.has(activeVideo.id) ? copy.bookmarkedLabel : copy.bookmarkLabel}</span>
                    </button>
                  </div>
                </div>

                {activeVideo.description && (
                  <p className="mt-4 text-sm leading-relaxed text-[var(--kj-muted-2)] whitespace-pre-line">
                    {activeVideo.description}
                  </p>
                )}

                {/* Takeaways + Chapters + Code/Lesson Links */}
                {(activeVideo.keyTakeaways?.length || activeVideo.chapters?.length || activeVideo.resourceCode || activeVideo.linkedLessonId) && (
                  <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[var(--kj-border)] pt-5 md:grid-cols-2">
                    {activeVideo.keyTakeaways && activeVideo.keyTakeaways.length > 0 && (
                      <div className="rounded-[12px] bg-[var(--kj-soft)] p-4">
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--kj-green)]">
                          {copy.takeawaysTitle}
                        </h3>
                        <ul className="mt-2.5 list-disc space-y-1.5 ps-4 text-xs leading-relaxed text-[var(--kj-ink)]">
                          {activeVideo.keyTakeaways.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {activeVideo.chapters && activeVideo.chapters.length > 0 && (
                      <div className="rounded-[12px] border border-[var(--kj-border)] bg-[var(--kj-paper)] p-4">
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--kj-green)]">
                          {copy.chaptersTitle}
                        </h3>
                        <ul className="mt-2.5 space-y-1.5 text-xs">
                          {activeVideo.chapters.map((ch, idx) => (
                            <li key={idx} className="flex items-center gap-2.5">
                              <span className="rounded bg-[var(--kj-badge-bg)] px-2 py-0.5 font-mono text-[11px] font-bold text-[var(--kj-badge-ink)] tabular-nums">
                                {ch.time}
                              </span>
                              <span className="font-medium text-[var(--kj-ink)]">{ch.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {(activeVideo.resourceCode || activeVideo.linkedLessonId) && (
                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[var(--kj-border)] pt-4">
                    {activeVideo.resourceCode && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          openCodeInEditor({
                            html:
                              activeVideo.track === 'html' || activeVideo.track === 'react'
                                ? activeVideo.resourceCode!
                                : `<!-- ${getVideoTitle(activeVideo)} -->\n<div id="app">karejan Video Lab</div>`,
                            css:
                              activeVideo.track === 'css'
                                ? activeVideo.resourceCode!
                                : `body { font-family: system-ui, sans-serif; padding: 24px; }`,
                            js:
                              activeVideo.track !== 'html' && activeVideo.track !== 'css'
                                ? activeVideo.resourceCode!
                                : '',
                            lessonId: activeVideo.linkedLessonId || null,
                          })
                        }
                      >
                        <Code2 className="h-4 w-4" />
                        <span>{copy.openInCodeLab}</span>
                      </Button>
                    )}

                    {activeVideo.linkedLessonId && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setActiveLessonId(activeVideo.linkedLessonId!);
                          setActiveView('academy');
                        }}
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>{copy.openRelatedLesson}</span>
                      </Button>
                    )}
                  </div>
                )}
              </Surface>
            </div>

            {/* Right Sidebar Playlist / Grid */}
            <aside className={theaterMode ? 'lg:col-span-12' : 'lg:col-span-4'}>
              <Surface className="p-4 text-start">
                <div className="mb-3 flex items-center justify-between gap-2 border-b border-[var(--kj-border)] pb-3">
                  <div className="flex items-center gap-2">
                    <ListVideo className="h-4 w-4 text-[var(--kj-green)]" />
                    <h2 className="text-sm font-extrabold text-[var(--kj-ink)]">{copy.playlistHeading}</h2>
                  </div>
                  <span className="rounded-full bg-[var(--kj-soft)] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[var(--kj-green)] tabular-nums">
                    {filteredVideos.length}
                  </span>
                </div>

                <div
                  className={
                    theaterMode
                      ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'
                      : 'max-h-[640px] space-y-2.5 overflow-y-auto pe-1'
                  }
                >
                  {filteredVideos.map((vid) => {
                    const isCurrent = activeVideo.id === vid.id;
                    const isWatched = watchedVideoIds.has(vid.id);
                    const vTitle = getVideoTitle(vid);

                    return (
                      <button
                        key={vid.id}
                        type="button"
                        onClick={() => setActiveVideoId(vid.id)}
                        className={`group flex w-full items-start gap-3 rounded-[12px] border p-2.5 text-start transition-all cursor-pointer ${
                          isCurrent
                            ? 'border-[var(--kj-green)] bg-[var(--kj-soft)] shadow-xs'
                            : 'border-[var(--kj-border)] bg-[var(--kj-paper)] hover:border-[var(--kj-green)]'
                        }`}
                      >
                        <div className="relative h-[64px] w-[108px] shrink-0 overflow-hidden rounded-[8px] bg-black">
                          <VideoThumbnail
                            playbackId={vid.muxPlaybackId}
                            posterTimeSec={vid.posterTimeSec}
                            title={vTitle}
                            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                          />
                          {vid.durationLabel && (
                            <span className="absolute bottom-1 end-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white tabular-nums">
                              {vid.durationLabel}
                            </span>
                          )}
                          {isWatched && (
                            <span
                              title={copy.watchedLabel}
                              className="absolute top-1 start-1 grid h-4 w-4 place-items-center rounded-full bg-[var(--kj-green)] text-[10px] font-bold text-[var(--kj-btn-primary-ink)]"
                            >
                              ✓
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-[var(--kj-muted)]">
                            <span className="font-mono text-[var(--kj-green)] tabular-nums">
                              {copy.episodeWord} {String(vid.order).padStart(2, '0')}
                            </span>
                            <span>·</span>
                            <span>{vid.track.toUpperCase()}</span>
                            <span>·</span>
                            <span>{LOCALE_META[vid.lessonLanguage]?.nativeLabel.split(' ')[0]}</span>
                          </div>
                          <h3 className="mt-1 line-clamp-2 text-xs font-extrabold leading-snug text-[var(--kj-ink)] group-hover:text-[var(--kj-green)]">
                            {vTitle}
                          </h3>
                          <p className="mt-1 truncate text-[10px] font-semibold text-[var(--kj-muted)]">
                            {pickLoc(locale, VIDEO_CATEGORY_LABELS[vid.category])}
                            {!vid.published ? ` · ${copy.draftBadge}` : ''}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Surface>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
