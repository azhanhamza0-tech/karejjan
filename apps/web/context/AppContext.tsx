import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  orderBy,
} from 'firebase/firestore';
import {
  auth,
  db,
  BOOTSTRAP_SUPER_ADMIN_EMAIL,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { apiFetch } from '../lib/api';
import { isRtlLocale, TRANSLATIONS, cleanTitle, type UiCopy } from '../i18n/translations';
import { isValidThemeMode } from '../data/themesCatalog';
import { ALL_COURSES } from '../data/courses/coursesList';
import {
  DEFAULT_SYSTEM_SETTINGS,
  SEED_COURSES,
  SEED_CHAPTERS,
  SEED_EXERCISES,
  SEED_LESSONS,
  SEED_PAYMENT_SETTINGS,
  SEED_PLANS,
  SEED_QUIZZES,
} from '../data/seedCatalog';
import {
  SEED_AI_TOOLS,
  SEED_KNOWLEDGE_ARTICLES,
  SEED_PROJECTS,
  SEED_REFERENCES,
} from '../data/discoverySeed';
import type {
  ActiveView,
  AiTool,
  AppNotification,
  CodeProject,
  CodeSnippet,
  Course,
  DiscoverSection,
  KnowledgeArticle,
  Lesson,
  Locale,
  MaintenanceConfig,
  NewsArticle,
  PaymentSetting,
  PlanId,
  PublicExercise,
  PublicQuiz,
  QuizAttemptRecord,
  ReferenceEntry,
  StaffRole,
  SubscriptionPlan,
  SubscriptionRecord,
  SystemSettings,
  PracticeAssessmentConfig,
  ModuleAssessmentProgress,
  ThemeMode,
  UserArticleState,
  UserProfile,
  VideoLesson,
} from '../types/domain';

export interface EditorBuffer {
  html: string;
  css: string;
  js: string;
  lessonId: string | null;
}

interface AppContextValue {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: UiCopy;
  isRtl: boolean;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  activeView: ActiveView;
  setActiveView: (v: ActiveView) => void;
  authReady: boolean;
  firebaseUser: User | null;
  profile: UserProfile | null;
  staffRole: StaffRole;
  effectivePlan: PlanId;
  subscription: SubscriptionRecord | null;
  systemSettings: SystemSettings;
  updateMaintenanceSettings: (maintenance: MaintenanceConfig) => void;
  updatePracticeConfig: (practiceConfig: PracticeAssessmentConfig) => void;
  modulePracticeProgress: Record<string, ModuleAssessmentProgress>;
  saveModuleAssessmentResult: (progress: ModuleAssessmentProgress) => Promise<void>;
  academyViewMode: 'lesson' | 'assessment';
  setAcademyViewMode: (mode: 'lesson' | 'assessment') => void;
  activeModuleIndex: number;
  setActiveModuleIndex: (idx: number) => void;
  freeDailyAiUsed: number;
  refreshServerStatus: () => Promise<void>;
  plans: SubscriptionPlan[];
  paymentSettings: PaymentSetting[];
  lessons: Lesson[];
  exercises: PublicExercise[];
  quizzes: PublicQuiz[];
  activeLessonId: string;
  setActiveLessonId: (id: string) => void;
  completedLessonIds: Set<string>;
  toggleLessonComplete: (lesson: Lesson) => Promise<void>;
  editorBuffer: EditorBuffer;
  setEditorBuffer: React.Dispatch<React.SetStateAction<EditorBuffer>>;
  openLessonInEditor: (lesson: Lesson) => void;
  openCodeInEditor: (code: { html: string; css: string; js: string; lessonId?: string | null }) => void;
  snippets: CodeSnippet[];
  saveSnippet: (snippetData: { title: string; html: string; css: string; js: string; lessonId?: string | null }) => Promise<CodeSnippet>;
  deleteSnippet: (id: string) => Promise<void>;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => Promise<void>;
  quizAttempts: QuizAttemptRecord[];
  recordQuizAttempt: (attempt: QuizAttemptRecord) => void;
  articles: KnowledgeArticle[];
  articleStates: Record<string, UserArticleState>;
  toggleArticleBookmark: (articleId: string) => Promise<void>;
  updateArticleProgress: (articleId: string, progressPercent: number) => Promise<void>;
  references: ReferenceEntry[];
  aiTools: AiTool[];
  projects: CodeProject[];
  mySubmittedProjects: CodeProject[];
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  discoverSection: DiscoverSection;
  setDiscoverSection: (s: DiscoverSection) => void;
  openDiscoverSection: (s: DiscoverSection) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  signOut: () => Promise<void>;
  updateProfilePreferences: (patch: { displayName?: string; language?: Locale; theme?: ThemeMode }) => Promise<void>;
  refreshCatalog: () => Promise<void>;
  videoLessons: VideoLesson[];
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
  watchedVideoIds: Set<string>;
  bookmarkedVideoIds: Set<string>;
  toggleVideoWatched: (videoId: string) => void;
  toggleVideoBookmark: (videoId: string) => void;
  saveVideoLesson: (
    video: Omit<VideoLesson, 'createdAt' | 'updatedAt'>
  ) => Promise<{ video: VideoLesson; savedFirestore: boolean; savedServer: boolean }>;
  deleteVideoLesson: (videoId: string) => Promise<{ deletedFirestore: boolean; deletedServer: boolean }>;
  refreshVideos: () => Promise<void>;
  adminRequestedTab: string | null;
  setAdminRequestedTab: (tab: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const INITIAL_EDITOR: EditorBuffer = {
  html: SEED_LESSONS[0].sharedCode.html,
  css: SEED_LESSONS[0].sharedCode.css,
  js: SEED_LESSONS[0].sharedCode.js,
  lessonId: SEED_LESSONS[0].id,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_locale') : null;
    if (saved === 'ckb' || saved === 'kmr' || saved === 'ar' || saved === 'en') return saved;
    return 'ckb';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved =
      window.localStorage.getItem('karejan_theme') ||
      window.localStorage.getItem('codenest-theme');
    return isValidThemeMode(saved) ? saved : 'dark';
  });

  const [activeView, setActiveViewState] = useState<ActiveView>('home');
  const [academyViewMode, setAcademyViewMode] = useState<'lesson' | 'assessment'>('lesson');
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(1);
  const setActiveView = useCallback((view: ActiveView) => {
    if (view === 'practice') {
      setAcademyViewMode('assessment');
      setActiveViewState('academy');
      return;
    }
    setActiveViewState(view);
  }, []);
  const [authReady, setAuthReady] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [staffRole, setStaffRole] = useState<StaffRole>('user');
  const [effectivePlan, setEffectivePlan] = useState<PlanId>('free');
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_system_settings') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...DEFAULT_SYSTEM_SETTINGS, ...parsed };
        }
      }
    } catch { }
    return DEFAULT_SYSTEM_SETTINGS;
  });
  const [freeDailyAiUsed, setFreeDailyAiUsed] = useState(0);

  const [plans, setPlans] = useState<SubscriptionPlan[]>(SEED_PLANS);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSetting[]>(SEED_PAYMENT_SETTINGS);
  const [lessons, setLessons] = useState<Lesson[]>(SEED_LESSONS);
  const [exercises, setExercises] = useState<PublicExercise[]>(SEED_EXERCISES);
  const [quizzes, setQuizzes] = useState<PublicQuiz[]>(SEED_QUIZZES);

  const [activeLessonId, setActiveLessonId] = useState<string>(SEED_LESSONS[0].id);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_completed_lessons') : null;
      if (saved) return new Set(JSON.parse(saved));
    } catch { }
    return new Set();
  });
  const [editorBuffer, setEditorBuffer] = useState<EditorBuffer>(INITIAL_EDITOR);
  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_saved_snippets') : null;
      if (saved) return JSON.parse(saved);
    } catch { }
    return [];
  });
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptRecord[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_quiz_attempts') : null;
      if (saved) return JSON.parse(saved);
    } catch { }
    return [];
  });
  const [modulePracticeProgress, setModulePracticeProgress] = useState<Record<string, ModuleAssessmentProgress>>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_module_practice_progress') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch { }
    return {};
  });
  const [articles, setArticles] = useState<KnowledgeArticle[]>(SEED_KNOWLEDGE_ARTICLES);
  const [articleStates, setArticleStates] = useState<Record<string, UserArticleState>>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_article_states') : null;
      if (saved) return JSON.parse(saved);
    } catch { }
    return {};
  });
  const [references, setReferences] = useState<ReferenceEntry[]>(SEED_REFERENCES);
  const [aiTools, setAiTools] = useState<AiTool[]>(SEED_AI_TOOLS);
  const [projects, setProjects] = useState<CodeProject[]>(SEED_PROJECTS);
  const [mySubmittedProjects, setMySubmittedProjects] = useState<CodeProject[]>([]);
  const [courses, setCourses] = useState<Course[]>(SEED_COURSES);
  const [discoverSection, setDiscoverSection] = useState<DiscoverSection>('knowledge');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminRequestedTab, setAdminRequestedTab] = useState<string | null>(null);
  const [videoLessons, setVideoLessons] = useState<VideoLesson[]>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_video_lessons_cache') : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch { }
    return [];
  });
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [watchedVideoIds, setWatchedVideoIds] = useState<Set<string>>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_watched_videos') : null;
      if (saved) return new Set(JSON.parse(saved));
    } catch { }
    return new Set();
  });
  const [bookmarkedVideoIds, setBookmarkedVideoIds] = useState<Set<string>>(() => {
    try {
      const saved = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_bookmarked_videos') : null;
      if (saved) return new Set(JSON.parse(saved));
    } catch { }
    return new Set();
  });

  const initialPrefHydratedRef = useRef(false);

  // Sync HTML dir/lang on locale change (NEVER touches lesson/editor state)
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtlLocale(locale) ? 'rtl' : 'ltr';
    window.localStorage.setItem('karejan_locale', locale);
    if (typeof window !== 'undefined') {
      (window as any).locale = locale;
    }
  }, [locale]);

  // Sync document theme attribute, Tailwind v4 .dark class, and localStorage across entire site
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem('karejan_theme', theme);
      window.localStorage.setItem('codenest-theme', theme);
    } catch { }
  }, [theme]);

  // Helper to get stable anonymous client key for local practice persistence
  const getClientKey = useCallback(() => {
    if (typeof window === 'undefined') return 'guest';
    try {
      let key = window.localStorage.getItem('karejan_client_key');
      if (!key) {
        key = `cl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
        window.localStorage.setItem('karejan_client_key', key);
      }
      return key;
    } catch {
      return 'guest';
    }
  }, []);

  // Hydrate server-side module practice progress on startup / auth change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const headers: Record<string, string> = {};
        if (auth.currentUser) {
          const token = await auth.currentUser.getIdToken();
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await fetch(`/api/practice/modules/progress?clientKey=${encodeURIComponent(getClientKey())}`, {
          headers,
        });
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled || !json?.progress || typeof json.progress !== 'object') return;
        setModulePracticeProgress((prev) => {
          const merged: Record<string, ModuleAssessmentProgress> = { ...prev };
          for (const [k, rec] of Object.entries(json.progress as Record<string, ModuleAssessmentProgress>)) {
            const existing = merged[k];
            if (!existing || (rec.attemptsCount || 0) >= (existing.attemptsCount || 0)) {
              merged[k] = rec;
            }
          }
          try {
            window.localStorage.setItem('karejan_module_practice_progress', JSON.stringify(merged));
          } catch { }
          return merged;
        });
      } catch {
        // Non-fatal offline fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [firebaseUser?.uid, getClientKey]);

  const refreshServerStatus = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      const status = await apiFetch<{
        role: StaffRole;
        plan: PlanId;
        freeDailyAiLimit: number;
        freeDailyAiUsed: number;
        proPerMinuteLimit: number;
        proMaxMessageLength: number;
        dailyGenerationJobCap: number;
        autoPublishAfterValidation: boolean;
      }>('/api/me/status');
      setFreeDailyAiUsed(status.freeDailyAiUsed || 0);
      setSystemSettings((prev) => ({
        ...prev,
        freeDailyAiLimit: status.freeDailyAiLimit,
        proPerMinuteLimit: status.proPerMinuteLimit,
        proMaxMessageLength: status.proMaxMessageLength,
        dailyGenerationJobCap: status.dailyGenerationJobCap,
        autoPublishAfterValidation: status.autoPublishAfterValidation,
      }));
    } catch {
      // Non-fatal if offline; Firestore listeners still provide state
    }
  }, []);

  const refreshCatalog = useCallback(async () => {
    try {
      const [lessonsSnap, plansSnap, exSnap, qzSnap] = await Promise.all([
        getDocs(query(collection(db, 'lessons'), where('published', '==', true))).catch(() => null),
        getDocs(collection(db, 'subscription_plans')).catch(() => null),
        getDocs(collection(db, 'exercises')).catch(() => null),
        getDocs(collection(db, 'quizzes')).catch(() => null),
      ]);

      if (lessonsSnap && !lessonsSnap.empty) {
        const remote = lessonsSnap.docs.map((d) => d.data() as Lesson);
        const merged = new Map<string, Lesson>();
        SEED_LESSONS.forEach((l) => {
          const trans = { ...l.translations };
          (Object.keys(trans) as (keyof typeof trans)[]).forEach((lang) => {
            if (trans[lang]?.title) trans[lang] = { ...trans[lang], title: cleanTitle(trans[lang].title) };
          });
          merged.set(l.id, { ...l, translations: trans });
        });
        remote.forEach((l) => {
          const trans = { ...l.translations };
          (Object.keys(trans) as (keyof typeof trans)[]).forEach((lang) => {
            if (trans[lang]?.title) trans[lang] = { ...trans[lang], title: cleanTitle(trans[lang].title) };
          });
          merged.set(l.id, { ...l, translations: trans });
        });
        setLessons(
          Array.from(merged.values()).sort((a, b) =>
            a.courseId === b.courseId ? a.order - b.order : a.courseId.localeCompare(b.courseId)
          )
        );
      }

      if (plansSnap && !plansSnap.empty) {
        const remotePlans = plansSnap.docs.map((d) => d.data() as SubscriptionPlan);
        const mergedPlans = new Map<string, SubscriptionPlan>();
        SEED_PLANS.forEach((p) => mergedPlans.set(p.id, p));
        remotePlans.forEach((p) => mergedPlans.set(p.id, p));
        setPlans(Array.from(mergedPlans.values()));
      }

      if (exSnap && !exSnap.empty) {
        const mergedEx = new Map<string, PublicExercise>();
        SEED_EXERCISES.forEach((e) => mergedEx.set(e.id, e));
        exSnap.docs.forEach((d) => {
          const item = d.data() as PublicExercise;
          mergedEx.set(item.id, item);
        });
        setExercises(Array.from(mergedEx.values()));
      }

      if (qzSnap && !qzSnap.empty) {
        const mergedQz = new Map<string, PublicQuiz>();
        SEED_QUIZZES.forEach((q) => mergedQz.set(q.id, q));
        qzSnap.docs.forEach((d) => {
          const item = d.data() as PublicQuiz;
          mergedQz.set(item.id, item);
        });
        setQuizzes(Array.from(mergedQz.values()));
      }

      // Phase 5 discovery collections (merged cleanly over seed defaults)
      const [artSnap, refSnap, toolSnap, projSnap] = await Promise.all([
        getDocs(query(collection(db, 'knowledge_articles'), where('published', '==', true))).catch(() => null),
        getDocs(query(collection(db, 'reference_entries'), where('published', '==', true))).catch(() => null),
        getDocs(query(collection(db, 'ai_tools'), where('published', '==', true))).catch(() => null),
        getDocs(query(collection(db, 'code_projects'), where('status', '==', 'approved'))).catch(() => null),
      ]);

      if (artSnap && !artSnap.empty) {
        const mergedArt = new Map<string, KnowledgeArticle>();
        SEED_KNOWLEDGE_ARTICLES.forEach((a) => mergedArt.set(a.id, a));
        artSnap.docs.forEach((d) => {
          const item = d.data() as KnowledgeArticle;
          mergedArt.set(item.id, item);
        });
        setArticles(Array.from(mergedArt.values()));
      }

      if (refSnap && !refSnap.empty) {
        const mergedRef = new Map<string, ReferenceEntry>();
        SEED_REFERENCES.forEach((r) => mergedRef.set(r.id, r));
        refSnap.docs.forEach((d) => {
          const item = d.data() as ReferenceEntry;
          mergedRef.set(item.id, item);
        });
        setReferences(Array.from(mergedRef.values()));
      }

      if (toolSnap && !toolSnap.empty) {
        const mergedTools = new Map<string, AiTool>();
        SEED_AI_TOOLS.forEach((tool) => mergedTools.set(tool.id, tool));
        toolSnap.docs.forEach((d) => {
          const item = d.data() as AiTool;
          mergedTools.set(item.id, item);
        });
        setAiTools(Array.from(mergedTools.values()));
      }

      if (projSnap && !projSnap.empty) {
        const mergedProj = new Map<string, CodeProject>();
        SEED_PROJECTS.forEach((p) => mergedProj.set(p.id, p));
        projSnap.docs.forEach((d) => {
          const item = d.data() as CodeProject;
          mergedProj.set(item.id, item);
        });
        setProjects(Array.from(mergedProj.values()));
      }

      // Dynamic Courses & Categories from Firestore (merged cleanly over seed defaults)
      try {
        const sanitizeCourse = (c: Course): { course: Course; changed: boolean } => {
          let changed = false;
          const cleanedTitles = { ...c.titles };
          const langs: (keyof typeof c.titles)[] = ['en', 'ckb', 'kmr', 'ar'];
          langs.forEach((l) => {
            if (cleanedTitles[l]) {
              const cleaned = cleanTitle(cleanedTitles[l]);
              if (cleaned !== cleanedTitles[l]) {
                changed = true;
                cleanedTitles[l] = cleaned;
              }
            }
          });
          return { course: { ...c, titles: cleanedTitles }, changed };
        };

        const mergedCourses = new Map<string, Course>();
        (SEED_COURSES || ALL_COURSES || []).forEach((c) => {
          const { course } = sanitizeCourse(c);
          mergedCourses.set(course.id, course);
        });

        const coursesSnap = await getDocs(collection(db, 'courses'));
        if (!coursesSnap.empty) {
          const coursesToUpdate: Course[] = [];
          coursesSnap.docs.forEach((d) => {
            const raw = d.data() as Course;
            const { course, changed } = sanitizeCourse(raw);
            mergedCourses.set(course.id, course);
            if (changed) {
              coursesToUpdate.push(course);
            }
          });

          // Self-heal Firestore if old course titles contained W3Schools or سیلابسی
          if (coursesToUpdate.length > 0) {
            for (const c of coursesToUpdate) {
              void setDoc(doc(db, 'courses', c.id), { ...c, updatedAt: serverTimestamp() }, { merge: true }).catch(() => { });
            }
          }
        }
        setCourses(Array.from(mergedCourses.values()).sort((a, b) => a.order - b.order));
      } catch {
        // Non-fatal offline fallback
      }
    } catch {
      // Seed catalog remains active if Firestore catalog has not yet been populated
    }
  }, []);

  useEffect(() => {
    void refreshCatalog();
  }, [refreshCatalog]);

  const refreshVideos = useCallback(async () => {
    const isAdminUser = staffRole === 'super_admin' || staffRole === 'admin';
    const merged = new Map<string, VideoLesson>();
    let anyNetworkOk = false;

    try {
      const headers: Record<string, string> = {};
      if (isAdminUser && auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(`/api/videos${isAdminUser ? '?includeDrafts=1' : ''}`, { headers });
      if (res.ok) {
        anyNetworkOk = true;
        const json = await res.json();
        if (Array.isArray(json?.videos)) {
          (json.videos as VideoLesson[]).forEach((v) => {
            if (v?.id && v?.muxPlaybackId) merged.set(v.id, v);
          });
        }
      }
    } catch { }

    try {
      const vidQuery = isAdminUser
        ? collection(db, 'video_lessons')
        : query(collection(db, 'video_lessons'), where('published', '==', true));
      const snap = await getDocs(vidQuery);
      anyNetworkOk = true;
      snap.docs.forEach((d) => {
        const v = d.data() as VideoLesson;
        if (v?.id && v?.muxPlaybackId) merged.set(v.id, v);
      });
    } catch { }

    if (!anyNetworkOk) return;

    const list = Array.from(merged.values())
      .filter((v) => isAdminUser || v.published)
      .sort((a, b) => (a.order ?? 1) - (b.order ?? 1));

    setVideoLessons(list);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('karejan_video_lessons_cache', JSON.stringify(list));
      }
    } catch { }
  }, [staffRole]);

  useEffect(() => {
    void refreshVideos();
  }, [refreshVideos, firebaseUser?.uid]);

  const toggleVideoWatched = useCallback((videoId: string) => {
    setWatchedVideoIds((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) next.delete(videoId);
      else next.add(videoId);
      try {
        window.localStorage.setItem('karejan_watched_videos', JSON.stringify(Array.from(next)));
      } catch { }
      return next;
    });
  }, []);

  const toggleVideoBookmark = useCallback((videoId: string) => {
    setBookmarkedVideoIds((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) next.delete(videoId);
      else next.add(videoId);
      try {
        window.localStorage.setItem('karejan_bookmarked_videos', JSON.stringify(Array.from(next)));
      } catch { }
      return next;
    });
  }, []);

  const saveVideoLesson = useCallback(
    async (
      videoInput: Omit<VideoLesson, 'createdAt' | 'updatedAt'>
    ): Promise<{ video: VideoLesson; savedFirestore: boolean; savedServer: boolean }> => {
      if (staffRole !== 'super_admin' && staffRole !== 'admin') {
        throw new Error('Only administrators can create or edit video lessons.');
      }

      const nowIso = new Date().toISOString();
      const nextVideo: VideoLesson = {
        ...videoInput,
        createdBy: videoInput.createdBy || firebaseUser?.uid || 'admin',
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      let savedServer = false;
      let savedFirestore = false;

      try {
        const res = await apiFetch<{ ok: boolean; video: VideoLesson }>('/api/admin/videos', {
          method: 'POST',
          body: nextVideo,
        });
        if (res?.ok && res.video) {
          Object.assign(nextVideo, res.video);
          savedServer = true;
        }
      } catch { }

      try {
        const fsPayload: Record<string, unknown> = {
          id: nextVideo.id,
          muxPlaybackId: nextVideo.muxPlaybackId,
          title: nextVideo.title,
          description: nextVideo.description,
          track: nextVideo.track,
          lessonLanguage: nextVideo.lessonLanguage,
          category: nextVideo.category,
          difficulty: nextVideo.difficulty,
          order: Math.round(nextVideo.order),
          published: Boolean(nextVideo.published),
          createdBy: nextVideo.createdBy || firebaseUser?.uid || 'admin',
          updatedAt: serverTimestamp(),
        };
        if (nextVideo.titles && Object.keys(nextVideo.titles).length > 0) fsPayload.titles = nextVideo.titles;
        if (nextVideo.durationLabel) fsPayload.durationLabel = nextVideo.durationLabel;
        if (typeof nextVideo.posterTimeSec === 'number') fsPayload.posterTimeSec = Math.floor(nextVideo.posterTimeSec);
        if (nextVideo.instructor) fsPayload.instructor = nextVideo.instructor;
        if (nextVideo.accessPlan) fsPayload.accessPlan = nextVideo.accessPlan;
        if (nextVideo.chapterGroup) fsPayload.chapterGroup = nextVideo.chapterGroup;
        if (nextVideo.keyTakeaways && nextVideo.keyTakeaways.length > 0) fsPayload.keyTakeaways = nextVideo.keyTakeaways;
        if (nextVideo.chapters && nextVideo.chapters.length > 0) fsPayload.chapters = nextVideo.chapters;
        if (nextVideo.resourceCode) fsPayload.resourceCode = nextVideo.resourceCode;
        if (nextVideo.linkedLessonId) fsPayload.linkedLessonId = nextVideo.linkedLessonId;

        await setDoc(doc(db, 'video_lessons', nextVideo.id), fsPayload);
        savedFirestore = true;
      } catch (err) {
        console.warn('Firestore video_lessons save notice (ensure rules are deployed):', err);
      }

      if (!savedServer && !savedFirestore) {
        throw new Error('Could not save video lesson to backend or Firestore. Verify Admin sign-in.');
      }

      setVideoLessons((prev) => {
        const map = new Map<string, VideoLesson>();
        prev.forEach((v) => map.set(v.id, v));
        map.set(nextVideo.id, nextVideo);
        const sorted = Array.from(map.values()).sort((a, b) => (a.order ?? 1) - (b.order ?? 1));
        try {
          window.localStorage.setItem('karejan_video_lessons_cache', JSON.stringify(sorted));
        } catch { }
        return sorted;
      });

      return { video: nextVideo, savedFirestore, savedServer };
    },
    [staffRole, firebaseUser?.uid]
  );

  const deleteVideoLesson = useCallback(
    async (videoId: string): Promise<{ deletedFirestore: boolean; deletedServer: boolean }> => {
      if (staffRole !== 'super_admin' && staffRole !== 'admin') {
        throw new Error('Only administrators can delete video lessons.');
      }

      let deletedServer = false;
      let deletedFirestore = false;

      try {
        await apiFetch(`/api/admin/videos/${encodeURIComponent(videoId)}`, { method: 'DELETE' });
        deletedServer = true;
      } catch { }

      try {
        await deleteDoc(doc(db, 'video_lessons', videoId));
        deletedFirestore = true;
      } catch (err) {
        console.warn('Firestore video_lessons delete notice:', err);
      }

      setVideoLessons((prev) => {
        const next = prev.filter((v) => v.id !== videoId);
        try {
          window.localStorage.setItem('karejan_video_lessons_cache', JSON.stringify(next));
        } catch { }
        return next;
      });

      setActiveVideoId((prev) => (prev === videoId ? null : prev));

      return { deletedFirestore, deletedServer };
    },
    [staffRole]
  );

  // Global authoritative system settings & maintenance sync (public, unauthenticated-safe)
  useEffect(() => {
    let cancelled = false;
    let firestoreLoaded = false;

    const applyFirestoreSettings = (data: Partial<SystemSettings>) => {
      firestoreLoaded = true;
      setSystemSettings((prev) => {
        const next: SystemSettings = {
          ...DEFAULT_SYSTEM_SETTINGS,
          ...prev,
          ...data,
          practiceConfig: data.practiceConfig || prev.practiceConfig || DEFAULT_SYSTEM_SETTINGS.practiceConfig,
          maintenance: data.maintenance || prev.maintenance || DEFAULT_SYSTEM_SETTINGS.maintenance,
        };
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem('karejan_system_settings', JSON.stringify(next));
          }
        } catch { }
        return next;
      });
    };

    // 1. Direct server read from Firestore bypasses stale offline cache across devices/users
    const syncDirectFromFirestore = async () => {
      try {
        const snap = await getDocFromServer(doc(db, 'system_settings', 'global'));
        if (!cancelled && snap.exists()) {
          applyFirestoreSettings(snap.data() as SystemSettings);
          return;
        }
      } catch { }
      // Public Firestore REST fallback if WebChannel/SDK is restricted on mobile network
      try {
        const r = await fetch(
          'https://firestore.googleapis.com/v1/projects/commanding-obelisk-5vc14/databases/ai-studio-9535e249-e869-4564-9680-fb7208c2b03e/documents/system_settings/global'
        );
        if (!r.ok || cancelled) return;
        const j: any = await r.json();
        const mf = j?.fields?.maintenance?.mapValue?.fields;
        if (mf) {
          const decodedMaintenance: MaintenanceConfig = {
            enabled: Boolean(mf.enabled?.booleanValue),
            lockedTabs: Array.isArray(mf.lockedTabs?.arrayValue?.values)
              ? mf.lockedTabs.arrayValue.values.map((v: any) => v?.stringValue).filter(Boolean)
              : [],
            messageCkb: mf.messageCkb?.stringValue || '',
            messageEn: mf.messageEn?.stringValue || '',
            estimatedReturn: mf.estimatedReturn?.stringValue || '',
            updatedAt: mf.updatedAt?.stringValue || '',
            updatedBy: mf.updatedBy?.stringValue || '',
          };
          applyFirestoreSettings({ maintenance: decodedMaintenance });
        }
      } catch { }
    };

    void syncDirectFromFirestore();

    const onWakeSync = () => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        void syncDirectFromFirestore();
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', onWakeSync);
      document.addEventListener('visibilitychange', onWakeSync);
    }

    // 2. Real-time Firestore snapshot for immediate multi-client live updates across devices
    const unsub = onSnapshot(
      doc(db, 'system_settings', 'global'),
      (snap) => {
        if (!cancelled && snap.exists()) {
          applyFirestoreSettings(snap.data() as SystemSettings);
        }
      },
      (err) => {
        console.warn('System settings listener notice:', err);
      }
    );

    // 3. Fallback / Server settings sync (never overrides live Firestore maintenance state)
    fetch('/api/public/system-settings')
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data: any) => {
        if (cancelled) return;
        const payload = data?.settings || data;
        if (payload && typeof payload === 'object') {
          setSystemSettings((prev) => {
            const payloadHasRemoteTimestamp = Boolean(payload?.maintenance?.updatedAt);
            const prevUpdated = prev?.maintenance?.updatedAt || '';
            const nextUpdated = payload?.maintenance?.updatedAt || '';
            const shouldUseServerMaintenance =
              !firestoreLoaded &&
              (!prevUpdated || (payloadHasRemoteTimestamp && nextUpdated >= prevUpdated));

            const next: SystemSettings = {
              ...DEFAULT_SYSTEM_SETTINGS,
              ...prev,
              ...payload,
              maintenance: shouldUseServerMaintenance
                ? (payload.maintenance || prev.maintenance)
                : prev.maintenance,
              practiceConfig: payload.practiceConfig || prev.practiceConfig || DEFAULT_SYSTEM_SETTINGS.practiceConfig,
            };
            try {
              if (typeof window !== 'undefined') {
                window.localStorage.setItem('karejan_system_settings', JSON.stringify(next));
              }
            } catch { }
            return next;
          });
        }
      })
      .catch(() => { });

    return () => {
      cancelled = true;
      unsub();
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', onWakeSync);
        document.removeEventListener('visibilitychange', onWakeSync);
      }
    };
  }, []);

  // Firebase Auth listener + profile bootstrap + user-scoped Firestore subscriptions
  useEffect(() => {
    let unsubProfile: (() => void) | null = null;
    let unsubSub: (() => void) | null = null;
    let unsubProgress: (() => void) | null = null;
    let unsubSnippets: (() => void) | null = null;
    let unsubNotifs: (() => void) | null = null;
    let unsubAttempts: (() => void) | null = null;
    let unsubPaySettings: (() => void) | null = null;
    let unsubArticleStates: (() => void) | null = null;
    let unsubMyProjects: (() => void) | null = null;

    const cleanup = () => {
      unsubProfile?.();
      unsubSub?.();
      unsubProgress?.();
      unsubSnippets?.();
      unsubNotifs?.();
      unsubAttempts?.();
      unsubPaySettings?.();
      unsubArticleStates?.();
      unsubMyProjects?.();
    };

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      cleanup();
      setFirebaseUser(user);
      setAuthReady(true);

      if (!user) {
        setProfile(null);
        setStaffRole('user');
        setEffectivePlan('free');
        setSubscription(null);
        setCompletedLessonIds(new Set());
        setSnippets([]);
        setNotifications([]);
        setQuizAttempts([]);
        setArticleStates({});
        setMySubmittedProjects([]);
        initialPrefHydratedRef.current = false;
        return;
      }

      // Resolve authoritative role from bootstrap email or /admins/{uid}
      let resolvedRole: StaffRole = 'user';
      if (user.email && user.email.toLowerCase().trim() === BOOTSTRAP_SUPER_ADMIN_EMAIL.toLowerCase().trim()) {
        resolvedRole = 'super_admin';
      } else {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          if (adminDoc.exists()) {
            const r = adminDoc.data()?.role;
            if (r === 'super_admin' || r === 'admin' || r === 'editor') resolvedRole = r;
          }
        } catch {
          resolvedRole = 'user';
        }
      }
      setStaffRole(resolvedRole);

      // Ensure users/{uid} exists with plan="free" on first verified signup
      const userRef = doc(db, 'users', user.uid);
      if (user.emailVerified) {
        try {
          const existingSnap = await getDoc(userRef);
          if (!existingSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Learner'),
              language: locale,
              theme,
              plan: 'free',
              role: 'user',
              subscriptionStatus: 'none',
              aiDailyUsage: 0,
              aiUsageDate: new Date().toISOString().slice(0, 10),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (err) {
          console.error('User profile bootstrap note:', err);
        }
      }

      unsubProfile = onSnapshot(
        userRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setProfile(data);
            if (!initialPrefHydratedRef.current) {
              initialPrefHydratedRef.current = true;
              const savedLoc = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_locale') : null;
              if (!savedLoc && (data.language === 'ckb' || data.language === 'kmr' || data.language === 'ar' || data.language === 'en')) {
                setLocaleState(data.language);
              }
              const savedTheme = typeof window !== 'undefined' ? window.localStorage.getItem('karejan_theme') : null;
              if (!savedTheme && isValidThemeMode(data.theme)) setThemeState(data.theme);
            }
            const expired =
              data.subscriptionExpiresAt && new Date(data.subscriptionExpiresAt).getTime() <= Date.now();
            setEffectivePlan(data.plan === 'pro' && !expired ? 'pro' : 'free');
          }
        },
        (error) => {
          try {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
          } catch {
            // Logged structured JSON
          }
        }
      );

      unsubSub = onSnapshot(
        doc(db, 'subscriptions', user.uid),
        (snap) => {
          if (snap.exists()) {
            const subData = snap.data() as SubscriptionRecord;
            setSubscription(subData);
            const isActivePro =
              subData.plan === 'pro' &&
              subData.status === 'active' &&
              new Date(subData.expiresAt).getTime() > Date.now();
            setEffectivePlan(isActivePro ? 'pro' : 'free');
          } else {
            setSubscription(null);
          }
        },
        () => { }
      );

      unsubProgress = onSnapshot(
        query(collection(db, 'user_progress'), where('uid', '==', user.uid)),
        (snap) => {
          const remoteDone = new Set<string>();
          snap.docs.forEach((d) => {
            const data = d.data();
            if (data.completed) remoteDone.add(data.lessonId);
          });
          setCompletedLessonIds((prev) => {
            const merged = new Set([...Array.from(prev), ...Array.from(remoteDone)]);
            try {
              window.localStorage.setItem('karejan_completed_lessons', JSON.stringify(Array.from(merged)));
            } catch { }
            return merged;
          });
        },
        (err) => {
          handleFirestoreError(err, OperationType.LIST, 'user_progress');
        }
      );

      unsubSnippets = onSnapshot(
        query(collection(db, 'code_snippets'), where('uid', '==', user.uid)),
        (snap) => {
          const remoteSnippets: CodeSnippet[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<CodeSnippet, 'id'>),
          }));
          setSnippets((prev) => {
            const localMap = new Map<string, CodeSnippet>();
            prev.forEach((s) => localMap.set(s.id, s));
            remoteSnippets.forEach((s) => localMap.set(s.id, s));
            const merged = Array.from(localMap.values());
            try {
              window.localStorage.setItem('karejan_saved_snippets', JSON.stringify(merged));
            } catch { }
            return merged;
          });
        },
        () => { }
      );

      unsubNotifs = onSnapshot(
        query(collection(db, 'notifications'), where('uid', '==', user.uid), orderBy('createdAt', 'desc')),
        (snap) => {
          setNotifications(
            snap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<AppNotification, 'id'>),
            }))
          );
        },
        () => { }
      );

      unsubAttempts = onSnapshot(
        query(collection(db, 'quiz_attempts'), where('uid', '==', user.uid)),
        (snap) => {
          setQuizAttempts(
            snap.docs
              .map((d) => ({
                id: d.id,
                ...(d.data() as Omit<QuizAttemptRecord, 'id'>),
              }))
              .reverse()
          );
        },
        () => { }
      );

      unsubPaySettings = onSnapshot(
        collection(db, 'payment_settings'),
        (snap) => {
          if (!snap.empty) {
            const merged = new Map<string, PaymentSetting>();
            SEED_PAYMENT_SETTINGS.forEach((m) => merged.set(m.id, m));
            snap.docs.forEach((d) => {
              const item = d.data() as PaymentSetting;
              merged.set(item.id, item);
            });
            setPaymentSettings(Array.from(merged.values()));
          }
        },
        () => { }
      );

      unsubArticleStates = onSnapshot(
        query(collection(db, 'user_article_state'), where('uid', '==', user.uid)),
        (snap) => {
          const map: Record<string, UserArticleState> = {};
          snap.docs.forEach((d) => {
            const st = d.data() as UserArticleState;
            map[st.articleId] = st;
          });
          setArticleStates(map);
        },
        () => { }
      );

      unsubMyProjects = onSnapshot(
        query(collection(db, 'code_projects'), where('authorUid', '==', user.uid)),
        (snap) => {
          setMySubmittedProjects(snap.docs.map((d) => d.data() as CodeProject));
        },
        () => { }
      );

      void refreshServerStatus();
    });

    return () => {
      cleanup();
      unsubAuth();
    };
  }, [refreshServerStatus]);

  const setLocale = useCallback(
    (loc: Locale) => {
      initialPrefHydratedRef.current = true;
      setLocaleState(loc);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('karejan_locale', loc);
        (window as unknown as { locale?: Locale }).locale = loc;
        document.documentElement.lang = loc;
        document.documentElement.dir = loc === 'en' ? 'ltr' : 'rtl';
      }
      if (auth.currentUser && auth.currentUser.emailVerified) {
        updateDoc(doc(db, 'users', auth.currentUser.uid), {
          language: loc,
          updatedAt: serverTimestamp(),
        }).catch(() => { });
      }
    },
    []
  );

  const setTheme = useCallback((mode: ThemeMode) => {
    if (!isValidThemeMode(mode)) return;
    setThemeState(mode);
    if (typeof window !== 'undefined') {
      document.documentElement.dataset.theme = mode;
      document.documentElement.classList.toggle('dark', mode === 'dark');
      try {
        window.localStorage.setItem('karejan_theme', mode);
        window.localStorage.setItem('codenest-theme', mode);
      } catch { }
    }
    if (auth.currentUser && auth.currentUser.emailVerified) {
      updateDoc(doc(db, 'users', auth.currentUser.uid), {
        theme: mode,
        updatedAt: serverTimestamp(),
      }).catch(() => { });
    }
  }, []);

  const updateProfilePreferences = useCallback(
    async (patch: { displayName?: string; language?: Locale; theme?: ThemeMode }) => {
      if (patch.language) setLocaleState(patch.language);
      if (patch.theme && isValidThemeMode(patch.theme)) setThemeState(patch.theme);
      if (!auth.currentUser || !auth.currentUser.emailVerified) return;
      const userRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userRef, {
          ...patch,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.warn('Profile Firestore update notice:', err);
      }
    },
    []
  );

  const toggleLessonComplete = useCallback(
    async (lesson: Lesson) => {
      const nextDone = !completedLessonIds.has(lesson.id);
      const nextSet = new Set(completedLessonIds);
      if (nextDone) {
        nextSet.add(lesson.id);
      } else {
        nextSet.delete(lesson.id);
      }
      setCompletedLessonIds(nextSet);
      try {
        window.localStorage.setItem('karejan_completed_lessons', JSON.stringify(Array.from(nextSet)));
      } catch { }

      if (auth.currentUser) {
        const docId = `${auth.currentUser.uid}_${lesson.id}`;
        try {
          await setDoc(doc(db, 'user_progress', docId), {
            uid: auth.currentUser.uid,
            lessonId: lesson.id,
            courseId: lesson.courseId,
            completed: nextDone,
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `user_progress/${docId}`);
        }
      }
    },
    [completedLessonIds]
  );

  const saveSnippet = useCallback(
    async (snippetData: { title: string; html: string; css: string; js: string; lessonId?: string | null }) => {
      const cleanTitle = snippetData.title.trim() || `Snippet ${new Date().toLocaleTimeString()}`;
      const newSnip: CodeSnippet = {
        id: `snip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        uid: auth.currentUser?.uid || 'local-learner',
        title: cleanTitle.slice(0, 120),
        html: snippetData.html.slice(0, 30000),
        css: snippetData.css.slice(0, 30000),
        js: snippetData.js.slice(0, 30000),
        lessonId: snippetData.lessonId || null,
        updatedAt: new Date().toISOString(),
      };

      setSnippets((prev) => {
        const next = [newSnip, ...prev];
        try {
          window.localStorage.setItem('karejan_saved_snippets', JSON.stringify(next));
        } catch { }
        return next;
      });

      if (auth.currentUser) {
        try {
          await addDoc(collection(db, 'code_snippets'), {
            uid: auth.currentUser.uid,
            title: newSnip.title,
            html: newSnip.html,
            css: newSnip.css,
            js: newSnip.js,
            lessonId: newSnip.lessonId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, 'code_snippets');
        }
      }
      return newSnip;
    },
    []
  );

  const deleteSnippet = useCallback(async (id: string) => {
    setSnippets((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        window.localStorage.setItem('karejan_saved_snippets', JSON.stringify(next));
      } catch { }
      return next;
    });

    if (auth.currentUser && !id.startsWith('snip-')) {
      try {
        await deleteDoc(doc(db, 'code_snippets', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `code_snippets/${id}`);
      }
    }
  }, []);

  const recordQuizAttempt = useCallback((attempt: QuizAttemptRecord) => {
    setQuizAttempts((prev) => {
      const next = [attempt, ...prev];
      try {
        window.localStorage.setItem('karejan_quiz_attempts', JSON.stringify(next));
      } catch { }
      return next;
    });
  }, []);

  const openCodeInEditor = useCallback(
    (code: { html: string; css: string; js: string; lessonId?: string | null }) => {
      setEditorBuffer({
        html: code.html,
        css: code.css,
        js: code.js,
        lessonId: code.lessonId ?? null,
      });
      setActiveView('editor');
    },
    []
  );

  const openLessonInEditor = useCallback(
    (lesson: Lesson) => {
      openCodeInEditor({
        html: lesson.sharedCode.html,
        css: lesson.sharedCode.css,
        js: lesson.sharedCode.js,
        lessonId: lesson.id,
      });
    },
    [openCodeInEditor]
  );

  const toggleArticleBookmark = useCallback(
    async (articleId: string) => {
      const prev = articleStates[articleId];
      const nextBookmarked = !(prev?.bookmarked ?? false);
      const progressPercent = prev?.progressPercent ?? 0;
      const completed = prev?.completed ?? false;
      const uid = auth.currentUser?.uid || 'guest';
      const docId = `${uid}_${articleId}`;
      setArticleStates((cur) => {
        const next = {
          ...cur,
          [articleId]: {
            uid,
            articleId,
            bookmarked: nextBookmarked,
            progressPercent,
            completed,
          },
        };
        try {
          window.localStorage.setItem('karejan_article_states', JSON.stringify(next));
        } catch { }
        return next;
      });

      if (auth.currentUser) {
        try {
          await setDoc(doc(db, 'user_article_state', docId), {
            uid: auth.currentUser.uid,
            articleId,
            bookmarked: nextBookmarked,
            progressPercent,
            completed,
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `user_article_state/${docId}`);
        }
      }
    },
    [articleStates]
  );

  const updateArticleProgress = useCallback(
    async (articleId: string, rawPercent: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(rawPercent)));
      const prev = articleStates[articleId];
      const nextPercent = Math.max(prev?.progressPercent ?? 0, clamped);
      const completed = nextPercent >= 100 || Boolean(prev?.completed);
      const bookmarked = prev?.bookmarked ?? false;
      const uid = auth.currentUser?.uid || 'guest';
      const docId = `${uid}_${articleId}`;

      setArticleStates((cur) => {
        const next = {
          ...cur,
          [articleId]: {
            uid,
            articleId,
            bookmarked,
            progressPercent: nextPercent,
            completed,
          },
        };
        try {
          window.localStorage.setItem('karejan_article_states', JSON.stringify(next));
        } catch { }
        return next;
      });

      if (auth.currentUser) {
        try {
          await setDoc(doc(db, 'user_article_state', docId), {
            uid: auth.currentUser.uid,
            articleId,
            bookmarked,
            progressPercent: nextPercent,
            completed,
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `user_article_state/${docId}`);
        }
      }
    },
    [articleStates]
  );

  const markNotificationRead = useCallback(async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `notifications/${id}`);
    }
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
  }, []);

  const openDiscoverSection = useCallback((section: DiscoverSection) => {
    setDiscoverSection(section);
    setActiveView('discover');
  }, []);

  const updateMaintenanceSettings = useCallback((maintenance: MaintenanceConfig) => {
    setSystemSettings((prev) => {
      const next: SystemSettings = {
        ...prev,
        maintenance,
      };
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('karejan_system_settings', JSON.stringify(next));
        }
      } catch { }
      return next;
    });
  }, []);

  const updatePracticeConfig = useCallback((practiceConfig: PracticeAssessmentConfig) => {
    setSystemSettings((prev) => {
      const next: SystemSettings = {
        ...prev,
        practiceConfig,
      };
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('karejan_system_settings', JSON.stringify(next));
        }
      } catch { }
      return next;
    });
  }, []);

  const saveModuleAssessmentResult = useCallback(async (progress: ModuleAssessmentProgress) => {
    let savedLocally: ModuleAssessmentProgress = progress;
    setModulePracticeProgress((prev) => {
      const existing = prev[progress.moduleId];
      savedLocally = {
        ...progress,
        attemptsCount: Math.max((existing?.attemptsCount || 0) + 1, progress.attemptsCount || 1),
        bestScorePercent: Math.max(existing?.bestScorePercent || 0, progress.scorePercent),
      };
      const next = {
        ...prev,
        [progress.moduleId]: savedLocally,
      };
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('karejan_module_practice_progress', JSON.stringify(next));
        }
      } catch { }
      return next;
    });

    // Also record in quizAttempts history so Dashboard & Analytics stay unified
    recordQuizAttempt({
      id: `${progress.moduleId}_${Date.now().toString(36)}`,
      uid: auth.currentUser?.uid || 'guest',
      quizId: progress.moduleId,
      quizType: 'lesson_quiz',
      courseId: progress.courseId,
      difficulty: 'medium',
      scorePercent: progress.scorePercent,
      correctCount: progress.correctCount,
      totalQuestions: progress.totalQuestions,
      timedOut: false,
      submittedAt: progress.lastSubmittedAt,
    });

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }
      await fetch('/api/practice/modules/progress', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          clientKey: getClientKey(),
          record: savedLocally,
        }),
      });
    } catch {
      // Saved locally even if offline
    }

    if (auth.currentUser) {
      try {
        const cleanQuizId = progress.moduleId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80);
        const attemptId = `${cleanQuizId}_${Date.now().toString(36)}`;
        await setDoc(doc(db, 'quiz_attempts', attemptId), {
          uid: auth.currentUser.uid,
          quizId: cleanQuizId,
          quizType: 'lesson_quiz',
          courseId: progress.courseId,
          difficulty: 'medium',
          scorePercent: Math.round(progress.scorePercent),
          correctCount: Math.round(progress.correctCount),
          totalQuestions: Math.round(progress.totalQuestions),
          timedOut: false,
          submittedAt: serverTimestamp(),
        });
      } catch {
        // Non-fatal if custom courseId or offline
      }
    }
  }, [getClientKey, recordQuizAttempt]);

  const value: AppContextValue = {
    locale,
    setLocale,
    t: TRANSLATIONS[locale],
    isRtl: isRtlLocale(locale),
    theme,
    setTheme,
    activeView,
    setActiveView,
    authReady,
    firebaseUser,
    profile,
    staffRole,
    effectivePlan,
    subscription,
    systemSettings,
    updateMaintenanceSettings,
    updatePracticeConfig,
    modulePracticeProgress,
    saveModuleAssessmentResult,
    academyViewMode,
    setAcademyViewMode,
    activeModuleIndex,
    setActiveModuleIndex,
    freeDailyAiUsed,
    refreshServerStatus,
    plans,
    paymentSettings,
    lessons,
    exercises,
    quizzes,
    activeLessonId,
    setActiveLessonId,
    completedLessonIds,
    toggleLessonComplete,
    editorBuffer,
    setEditorBuffer,
    openLessonInEditor,
    openCodeInEditor,
    snippets,
    saveSnippet,
    deleteSnippet,
    notifications,
    markNotificationRead,
    quizAttempts,
    recordQuizAttempt,
    articles,
    articleStates,
    toggleArticleBookmark,
    updateArticleProgress,
    references,
    aiTools,
    projects,
    mySubmittedProjects,
    courses,
    setCourses,
    discoverSection,
    setDiscoverSection,
    openDiscoverSection,
    authModalOpen,
    setAuthModalOpen,
    signOut,
    updateProfilePreferences,
    refreshCatalog,
    videoLessons,
    activeVideoId,
    setActiveVideoId,
    watchedVideoIds,
    bookmarkedVideoIds,
    toggleVideoWatched,
    toggleVideoBookmark,
    saveVideoLesson,
    deleteVideoLesson,
    refreshVideos,
    adminRequestedTab,
    setAdminRequestedTab,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
