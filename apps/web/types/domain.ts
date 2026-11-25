export type Locale = 'ckb' | 'kmr' | 'ar' | 'en';
export type ThemeMode = 'dark' | 'light';
export type TrackId =
  | 'html'
  | 'css'
  | 'js'
  | 'react'
  | 'vite'
  | 'tsx'
  | 'python'
  | 'cpp'
  | (string & {});
export type StaffRole = 'user' | 'editor' | 'admin' | 'super_admin';
export type PlanId = 'free' | 'pro';
export type PaymentMethodId = 'fib' | 'qi_card' | 'zaincash';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'requires_review';

export type ActiveView =
  | 'home'
  | 'academy'
  | 'editor'
  | 'ai'
  | 'practice'
  | 'challenge'
  | 'aitools'
  | 'prompts'
  | 'discover'
  | 'pro'
  | 'dashboard'
  | 'admin';

export interface DailyChallengeTestCase {
  id: string;
  inputDescription: string;
  expectedOutput: string;
  callExpression: string;
  isSecret?: boolean;
}

export interface DailyChallenge {
  id: string;
  dateIso: string;
  track: TrackId;
  functionName: string;
  titles: Record<Locale, string>;
  descriptions: Record<Locale, string>;
  starterCode: string;
  solutionCode?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  testCases: DailyChallengeTestCase[];
  hints: Record<Locale, string[]>;
  points: number;
}

export interface ChampionRecord {
  id: string;
  uid: string;
  displayName: string;
  email?: string;
  solvedAt: string;
  challengeId: string;
  executionTimeMs?: number;
  rank?: number;
}

export type DiscoverSection = 'knowledge' | 'references' | 'ai-tools' | 'projects';
export type NewsCategory =
  | 'web-platform'
  | 'ai-ml'
  | 'security'
  | 'developer-tools'
  | 'cloud-infra'
  | 'open-source';
export type NewsImportance = 'normal' | 'important' | 'breaking' | 'critical';
export type NewsStatus = 'published' | 'pending_review' | 'rejected';
export type ArticleCategory =
  | 'web-architecture'
  | 'performance'
  | 'security'
  | 'ai-engineering'
  | 'tooling';
export type AiToolCategory =
  | 'coding'
  | 'research'
  | 'design'
  | 'writing'
  | 'models'
  | 'productivity';
export type ProjectTrack = 'html' | 'css' | 'js' | 'fullstack-web';
export type ProjectModerationStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  language: Locale;
  theme: ThemeMode;
  plan: PlanId;
  role: StaffRole;
  subscriptionStatus: 'none' | 'active' | 'expired';
  subscriptionExpiresAt?: string | null;
  aiDailyUsage?: number;
  aiUsageDate?: string;
}

export interface Course {
  id: TrackId;
  slug: string;
  order: number;
  titles: Record<Locale, string>;
  descriptions: Record<Locale, string>;
  practiceConfig?: CoursePracticeOverride;
}

export interface Chapter {
  id: string;
  courseId: TrackId;
  order: number;
  titles: Record<Locale, string>;
}

export interface LessonTranslation {
  title: string;
  intro: string;
  objectives: string[];
  explanation: string;
  syntaxNotes: string;
  tryItPrompt: string;
  commonMistakes: string[];
  summary: string;
}

export interface Lesson {
  id: string;
  courseId: TrackId;
  chapterId: string;
  order: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  published: boolean;
  sharedCode: {
    syntax: string;
    html: string;
    css: string;
    js: string;
  };
  translations: Record<Locale, LessonTranslation>;
}

export interface CodeSnippet {
  id: string;
  uid: string;
  title: string;
  html: string;
  css: string;
  js: string;
  lessonId?: string | null;
  updatedAt?: string;
}

export interface AiChatThread {
  id: string;
  uid: string;
  title: string;
  language: Locale;
  updatedAt?: string;
}

export interface AiChatMessage {
  id: string;
  uid: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export interface MaintenanceConfig {
  enabled: boolean;
  lockedTabs: ActiveView[];
  messageCkb: string;
  messageEn: string;
  estimatedReturn: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CoursePracticeOverride {
  enabled?: boolean;
  lessonsPerGroup?: number;
  requirePassToUnlockNext?: boolean;
  passThresholdPercent?: number;
}

export interface PracticeAssessmentConfig {
  lessonsPerGroup: number;
  requirePassToUnlockNext: boolean;
  passThresholdPercent: number;
  courseOverrides?: Record<string, CoursePracticeOverride>;
}

export type PracticeQuestionType =
  | 'mcq'
  | 'true_false'
  | 'find_fix'
  | 'complete_code'
  | 'practical_challenge';

export type PerformanceLevel = 'excellent' | 'good' | 'developing' | 'needs_review';

export interface IntegratedPracticeQuestion {
  id: string;
  type: PracticeQuestionType;
  lessonId: string;
  lessonNumber: number;
  sourceKind: 'curated_quiz' | 'curated_exercise' | 'adaptive_lesson';
  curatedId?: string;
  track: TrackId;
  prompt: Record<Locale, string>;
  explanation: Record<Locale, string>;
  hint?: Record<Locale, string>;
  options?: Record<Locale, string>[];
  correctOptionIndex?: number;
  codeLanguage?: 'html' | 'css' | 'javascript' | 'typescript' | 'tsx' | 'python' | 'cpp';
  starterCode?: string;
  buggyCode?: string;
  solutionCode?: string;
  expectedSnippetTokens?: string[];
  forbiddenTokens?: string[];
  expectedOutputIncludes?: string[];
  blankPlaceholder?: string;
  acceptableAnswers?: string[];
  previewHtml?: string;
  previewCss?: string;
  previewJs?: string;
}

export interface PracticeModule {
  moduleId: string;
  courseId: TrackId;
  groupIndex: number;
  lessonStartNumber: number;
  lessonEndNumber: number;
  lessonIds: string[];
  lessons: Lesson[];
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  questions: IntegratedPracticeQuestion[];
  passThresholdPercent: number;
  requirePassToUnlockNext: boolean;
}

export interface ModuleAssessmentResultItem {
  questionId: string;
  type: PracticeQuestionType;
  correct: boolean;
  userAnswerSummary: string;
  correctAnswerSummary: string;
  explanation: Record<Locale, string>;
}

export interface ModuleAssessmentProgress {
  moduleId: string;
  courseId: TrackId;
  groupIndex: number;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  performanceLevel: PerformanceLevel;
  attemptsCount: number;
  bestScorePercent: number;
  lastSubmittedAt: string;
  lastAnswers?: Record<string, string>;
  lastItemResults?: ModuleAssessmentResultItem[];
}

export interface SystemSettings {
  freeDailyAiLimit: number;
  proPerMinuteLimit: number;
  proMaxMessageLength: number;
  dailyGenerationJobCap: number;
  autoPublishAfterValidation: boolean;
  maintenance?: MaintenanceConfig;
  practiceConfig?: PracticeAssessmentConfig;
}

export interface SubscriptionPlan {
  id: PlanId;
  priceIqd: number;
  billingPeriod: 'forever' | 'month';
  titles: Record<Locale, string>;
  descriptions: Record<Locale, string>;
  features: Record<Locale, string[]>;
}

export interface PaymentSetting {
  id: PaymentMethodId;
  name: string;
  accountNumber: string;
  enabled: boolean;
  instructions: Record<Locale, string>;
}

export interface PaymentTransaction {
  id: string;
  uid: string;
  userEmail: string;
  methodId: PaymentMethodId;
  transactionRef: string;
  normalizedRef: string;
  paymentDate: string;
  amountIqd: number;
  receiptPath: string;
  receiptFileName: string;
  receiptMimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  receiptSizeBytes: number;
  receiptPreviewUrl?: string | null;
  status: PaymentStatus;
  reviewReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt?: string;
}

export interface SubscriptionRecord {
  uid: string;
  userEmail?: string;
  plan: PlanId;
  status: 'active' | 'expired';
  activatedAt: string;
  expiresAt: string;
  lastTransactionId?: string | null;
  extensionNotes?: string[];
}

export interface AppNotification {
  id: string;
  uid: string;
  type:
    | 'subscription_activated'
    | 'expiry_warning_7d'
    | 'expiry_warning_1d'
    | 'subscription_expired'
    | 'payment_rejected'
    | 'subscription_extended';
  title: string;
  body: string;
  read: boolean;
  createdAt?: string;
}

export interface AuditLogEntry {
  id: string;
  actorUid: string;
  actorEmail: string;
  actorRole: StaffRole;
  action: string;
  targetCollection: string;
  targetId: string;
  reason?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  createdAt?: string;
}

export type ExerciseType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'predict_output'
  | 'find_error'
  | 'complete_code';

export interface PublicExercise {
  id: string;
  lessonId: string;
  courseId: TrackId;
  type: ExerciseType;
  difficulty: 'easy' | 'medium' | 'hard';
  tier: PlanId;
  codeSnippet?: string;
  translations: Record<
    Locale,
    {
      prompt: string;
      options?: string[];
      hint?: string;
    }
  >;
}

export interface PublicQuizQuestion {
  id: string;
  codeSnippet?: string;
  translations: Record<
    Locale,
    {
      prompt: string;
      options: string[];
    }
  >;
}

export interface PublicQuiz {
  id: string;
  quizType: 'lesson_quiz' | 'course_exam' | 'practice_test' | 'timed_exam';
  courseId: TrackId;
  lessonId?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tier: PlanId;
  timeLimitSeconds?: number;
  titles: Record<Locale, string>;
  questions: PublicQuizQuestion[];
}

export interface QuizAttemptRecord {
  id: string;
  uid: string;
  quizId: string;
  quizType: 'lesson_quiz' | 'course_exam' | 'practice_test' | 'timed_exam';
  courseId: TrackId;
  difficulty: 'easy' | 'medium' | 'hard';
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  timedOut: boolean;
  recommendedLessonIds?: string[];
  submittedAt?: string;
}

export interface GeneratedDraft {
  id: string;
  jobId: string;
  courseId: TrackId;
  chapterId?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'draft' | 'flagged' | 'published' | 'rejected';
  sharedCode: {
    syntax: string;
    html: string;
    css: string;
    js: string;
  };
  translations: Partial<Record<Locale, LessonTranslation>>;
  exercises?: Array<{
    id: string;
    type: ExerciseType;
    difficulty: 'easy' | 'medium' | 'hard';
    codeSnippet?: string;
    evaluationMethod: string;
    correctAnswer: string;
    translations: Record<string, { prompt: string; options?: string[]; hint?: string; explanation: string }>;
  }>;
  quiz?: {
    questions: Array<{
      id: string;
      codeSnippet?: string;
      correctOptionIndex: number;
      translations: Record<string, { prompt: string; options: string[]; explanation: string }>;
    }>;
  } | null;
  project?: {
    starterHtml: string;
    starterCss: string;
    starterJs: string;
    translations: Record<string, { title: string; brief: string; requirements: string[] }>;
  } | null;
  validationReport?: {
    passed: boolean;
    sandboxChecked: boolean;
    secondPassQaChecked: boolean;
    issues: string[];
  };
  createdBy: string;
  createdAt?: string;
}

export interface AiGenerationJob {
  id: string;
  languageTrack: TrackId;
  courseId: TrackId;
  topic: string;
  lessonTitle?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  count: number;
  requiredLanguages?: Locale[];
  depth?: 'concise' | 'standard' | 'deep';
  status: 'running' | 'completed' | 'failed';
  attempts: number;
  errors?: string[];
  duplicateWarnings?: string[];
  createdBy: string;
  createdAt?: string;
}

export interface KnowledgeArticleTranslation {
  title: string;
  summary: string;
  body: string;
  keyTakeaways: string[];
}

export interface KnowledgeArticle {
  id: string;
  slug: string;
  category: ArticleCategory;
  readingMinutes: number;
  published: boolean;
  featured?: boolean;
  codeExample?: string;
  translations: Record<Locale, KnowledgeArticleTranslation>;
  authorUid?: string;
  updatedAt?: string;
}

export interface UserArticleState {
  uid: string;
  articleId: string;
  bookmarked: boolean;
  progressPercent: number;
  completed: boolean;
  updatedAt?: string;
}

export interface ReferenceTranslation {
  summary: string;
  details: string;
  notes: string;
}

export interface ReferenceEntry {
  id: string;
  track: TrackId;
  category: string;
  symbol: string;
  syntax: string;
  exampleHtml: string;
  exampleCss: string;
  exampleJs: string;
  browserSupport: string;
  published: boolean;
  translations: Record<Locale, ReferenceTranslation>;
  updatedAt?: string;
}

export interface AiToolTranslation {
  tagline: string;
  description: string;
  bestFor: string;
}

export interface AiTool {
  id: string;
  name: string;
  category: AiToolCategory;
  officialUrl: string;
  pricingModel: 'free' | 'freemium' | 'paid' | 'open_source';
  lastVerifiedAt: string;
  verifiedBy?: string;
  published: boolean;
  translations: Record<Locale, AiToolTranslation>;
  updatedAt?: string;
}

export interface CodeProject {
  id: string;
  title: string;
  description: string;
  track: ProjectTrack;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  html: string;
  css: string;
  js: string;
  authorUid: string;
  authorName: string;
  isOfficial: boolean;
  status: ProjectModerationStatus;
  moderationReason?: string | null;
  moderatedBy?: string | null;
  translations?: Partial<Record<Locale, { title: string; description: string }>>;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  feedUrl: string;
  siteUrl: string;
  defaultCategory: NewsCategory;
  permitted: boolean;
  enabled: boolean;
  lastSyncAt?: string | null;
  lastStatus: 'idle' | 'ok' | 'error';
  lastError?: string | null;
  itemsCollected: number;
  updatedAt?: string;
}

export interface NewsArticleTranslation {
  headline: string;
  summary: string;
}

export interface NewsArticle {
  id: string;
  dedupeKey: string;
  sourceId: string;
  sourceName: string;
  sourceSiteUrl: string;
  originalUrl: string;
  originalTitle: string;
  originalGuid?: string | null;
  category: NewsCategory;
  tags: string[];
  importance: NewsImportance;
  importanceReason?: string | null;
  status: NewsStatus;
  autoPublished: boolean;
  reviewReason?: string | null;
  reviewedBy?: string | null;
  publishedAt: string;
  translations: Record<Locale, NewsArticleTranslation>;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsSyncSourceResult {
  sourceId: string;
  sourceName: string;
  status: 'ok' | 'error' | 'skipped';
  fetched: number;
  duplicatesSkipped: number;
  autoPublished: number;
  queuedForReview: number;
  aiErrors: number;
  error?: string | null;
  durationMs: number;
}

export interface NewsSyncLog {
  id: string;
  trigger: 'scheduled' | 'manual';
  triggeredBy?: string | null;
  runStatus: 'ok' | 'partial' | 'failed';
  sourcesAttempted: number;
  sourcesSucceeded: number;
  sourcesFailed: number;
  fetchedCount: number;
  duplicatesSkipped: number;
  autoPublishedCount: number;
  queuedReviewCount: number;
  sourceResults: NewsSyncSourceResult[];
  startedAt: string;
  finishedAt: string;
  createdAt?: string;
}
