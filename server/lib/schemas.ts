import { z } from 'zod';

export const LocaleSchema = z.enum(['ckb', 'kmr', 'ar', 'en']);
export const TrackSchema = z.string().min(2).max(32);

export const AiChatRequestSchema = z.object({
  chatId: z.string().min(1).max(128),
  message: z.string().min(1).max(20000),
  language: LocaleSchema,
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(20000),
      })
    )
    .max(20)
    .default([]),
});

export const PaymentValidateSchema = z.object({
  methodId: z.enum(['fib', 'qi_card', 'zaincash']),
  transactionRef: z.string().min(3).max(80),
  paymentDate: z.string().min(8).max(32),
  amountIqd: z.number().int().min(1000).max(5000000),
  receiptMimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  receiptSizeBytes: z.number().int().min(1).max(5 * 1024 * 1024),
  receiptFileName: z.string().min(1).max(180),
});

export const StudioGenerateRequestSchema = z.object({
  languageTrack: TrackSchema,
  courseId: TrackSchema,
  topic: z.string().min(1).max(300),
  lessonTitle: z.string().max(300).optional().default(''),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  count: z.number().int().min(1).max(10).default(1),
  requiredLanguages: z.array(LocaleSchema).min(1).max(4),
  depth: z.enum(['concise', 'standard', 'deep']).default('standard'),
  includeExercises: z.boolean().default(true),
  includeQuiz: z.boolean().default(true),
  includeProject: z.boolean().default(false),
  existingTitles: z.array(z.string().max(500)).max(2000).default([]),
  forceDuplicate: z.boolean().default(false),
});

export const LocalizedLessonContentSchema = z.object({
  title: z.string().min(2).max(180),
  intro: z.string().min(10).max(1200),
  objectives: z.array(z.string().min(3).max(300)).min(2).max(6),
  explanation: z.string().min(20).max(4000),
  syntaxNotes: z.string().min(5).max(1200),
  tryItPrompt: z.string().min(5).max(800),
  commonMistakes: z.array(z.string().min(5).max(400)).min(1).max(5),
  summary: z.string().min(10).max(1000),
});

export const GeneratedExerciseSchema = z.object({
  id: z.string().min(2).max(80),
  type: z.enum(['multiple_choice', 'true_false', 'fill_blank', 'predict_output', 'find_error', 'complete_code']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  codeSnippet: z.string().max(6000).optional().default(''),
  evaluationMethod: z.enum(['exact_option', 'boolean', 'normalized_text', 'code_contains', 'sandbox_output']),
  correctAnswer: z.string().min(1).max(2000),
  translations: z.record(
    z.string(),
    z.object({
      prompt: z.string().min(5).max(1000),
      options: z.array(z.string().max(300)).max(6).optional(),
      hint: z.string().max(400).optional(),
      explanation: z.string().min(5).max(1000),
    })
  ),
});

export const GeneratedQuizQuestionSchema = z.object({
  id: z.string().min(2).max(80),
  codeSnippet: z.string().max(4000).optional().default(''),
  correctOptionIndex: z.number().int().min(0).max(3),
  translations: z.record(
    z.string(),
    z.object({
      prompt: z.string().min(5).max(1000),
      options: z.array(z.string().min(1).max(300)).length(4),
      explanation: z.string().min(5).max(1000),
    })
  ),
});

export const GeneratedLessonItemSchema = z.object({
  slug: z.string().min(2).max(80),
  sharedCode: z.object({
    syntax: z.string().min(3).max(4000),
    html: z.string().max(12000),
    css: z.string().max(12000),
    js: z.string().max(12000),
  }),
  translations: z.record(z.string(), LocalizedLessonContentSchema),
  exercises: z.array(GeneratedExerciseSchema).max(6).optional().default([]),
  quizQuestions: z.array(GeneratedQuizQuestionSchema).max(8).optional().default([]),
  project: z
    .object({
      starterHtml: z.string().max(8000),
      starterCss: z.string().max(8000),
      starterJs: z.string().max(8000),
      translations: z.record(
        z.string(),
        z.object({
          title: z.string().min(2).max(160),
          brief: z.string().min(10).max(1200),
          requirements: z.array(z.string().min(3).max(300)).min(1).max(6),
        })
      ),
    })
    .nullable()
    .optional(),
});

export const GeneratedLessonBatchSchema = z.object({
  lessons: z.array(GeneratedLessonItemSchema).min(1).max(5),
});

export const RegenerateSectionSchema = z.object({
  languageTrack: TrackSchema,
  locale: LocaleSchema,
  section: z.enum(['intro', 'explanation', 'commonMistakes', 'summary', 'tryItPrompt']),
  lessonTitle: z.string().min(2).max(200),
  currentContent: z.string().max(5000),
});

export const GradeExerciseRequestSchema = z.object({
  exerciseId: z.string().min(1).max(96),
  answer: z.string().min(1).max(5000),
  language: LocaleSchema.default('en'),
});

export const StartQuizRequestSchema = z.object({
  quizId: z.string().min(1).max(96),
  language: LocaleSchema.default('en'),
});

export const SubmitQuizRequestSchema = z.object({
  quizId: z.string().min(1).max(96),
  sessionId: z.string().max(128).optional(),
  language: LocaleSchema.default('en'),
  answers: z.record(z.string(), z.number().int().min(0).max(5)),
});
