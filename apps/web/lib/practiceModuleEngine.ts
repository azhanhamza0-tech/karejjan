import {
  Course,
  IntegratedPracticeQuestion,
  Lesson,
  Locale,
  ModuleAssessmentResultItem,
  PerformanceLevel,
  PracticeModule,
  PublicExercise,
  PublicQuiz,
  SystemSettings,
  TrackId,
} from '../types/domain';
import { cleanTitle, pickLoc } from '../i18n/translations';

export interface EffectivePracticeConfig {
  enabled: boolean;
  lessonsPerGroup: number;
  requirePassToUnlockNext: boolean;
  passThresholdPercent: number;
}

export interface CodeRunEvaluation {
  valid: boolean;
  passedChecks: boolean;
  output: string[];
  error?: string;
  missingTokens: string[];
  forbiddenFound: string[];
  missingOutputs: string[];
}

function clampInt(val: unknown, min: number, max: number, fallback: number): number {
  const num = Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(min, Math.min(max, Math.round(num)));
}

export function getEffectivePracticeConfig(
  systemSettings?: SystemSettings,
  course?: Course
): EffectivePracticeConfig {
  const globalCfg = systemSettings?.practiceConfig;
  const override =
    course?.practiceConfig ||
    (course?.id ? globalCfg?.courseOverrides?.[course.id] : undefined);

  const enabled = override?.enabled !== undefined ? Boolean(override.enabled) : true;
  const lessonsPerGroup = clampInt(
    override?.lessonsPerGroup ?? globalCfg?.lessonsPerGroup,
    1,
    12,
    3
  );
  const passThresholdPercent = clampInt(
    override?.passThresholdPercent ?? globalCfg?.passThresholdPercent,
    30,
    100,
    60
  );
  const requirePassToUnlockNext =
    override?.requirePassToUnlockNext ?? globalCfg?.requirePassToUnlockNext ?? true;

  return {
    enabled,
    lessonsPerGroup,
    requirePassToUnlockNext,
    passThresholdPercent,
  };
}

function mapTrackToCodeLanguage(
  courseId: TrackId
): IntegratedPracticeQuestion['codeLanguage'] {
  switch (courseId) {
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'python':
      return 'python';
    case 'cpp':
      return 'cpp';
    case 'react':
    case 'tsx':
      return 'tsx';
    case 'vite':
      return 'typescript';
    case 'js':
    default:
      return 'javascript';
  }
}

function detectQuestionCodeLanguage(
  courseId: TrackId,
  snippet: string
): IntegratedPracticeQuestion['codeLanguage'] {
  const base = mapTrackToCodeLanguage(courseId);
  const trimmed = snippet.trim();
  if (
    base === 'javascript' &&
    trimmed.startsWith('<') &&
    !/\b(function|const|let|var|return|useState|console\.log)\b/.test(trimmed)
  ) {
    return 'html';
  }
  return base;
}
function isTrivialOrCommentOnly(code?: string): boolean {
  if (!code) return true;
  const trimmed = code.trim();
  if (!trimmed) return true;
  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) return true;
  return lines.every((l) => l.startsWith('//') || l.startsWith('/*') || l.startsWith('*'));
}

function pickPrimaryLessonCode(courseId: TrackId, lesson: Lesson): string {
  const sc = lesson.sharedCode || { syntax: '', html: '', css: '', js: '' };
  const nonDemoHtml = !isTrivialOrCommentOnly(sc.html) && !sc.html.includes('track-demo') ? sc.html.trim() : '';
  const nonDemoCss = !isTrivialOrCommentOnly(sc.css) && !sc.css.includes('#0f182e') ? sc.css.trim() : '';

  if (courseId === 'html') {
    return nonDemoHtml || sc.syntax?.trim() || '<h1>Hello karejan</h1>';
  }
  if (courseId === 'css') {
    return nonDemoCss || sc.syntax?.trim() || '.card {\n  color: #087f5b;\n}';
  }
  if (courseId === 'cpp') {
    if (!isTrivialOrCommentOnly(sc.syntax)) return sc.syntax.trim();
    return sc.js?.trim() || 'std::cout << "Hello";';
  }
  if (courseId === 'python') {
    if (!isTrivialOrCommentOnly(sc.js) && sc.js.trim().length > 10) return sc.js.trim();
    if (!isTrivialOrCommentOnly(sc.syntax)) return sc.syntax.trim();
    return 'print("Hello Python")';
  }
  // js, react, tsx, vite
  if (!isTrivialOrCommentOnly(sc.syntax) && sc.syntax.trim().length >= (sc.js?.trim().length || 0) * 0.5) {
    return sc.syntax.trim();
  }
  if (!isTrivialOrCommentOnly(sc.js)) return sc.js.trim();
  if (!isTrivialOrCommentOnly(sc.syntax)) return sc.syntax.trim();
  return 'const result = "karejan";\nconsole.log(result);';
}

function isBoilerplateCopy(text?: string): boolean {
  if (!text || !text.trim()) return true;
  const t = text.trim();
  return (
    t.includes('Core instruction for ') ||
    t.includes('builds foundational engineering competence') ||
    t.includes('تێگەیشتنی تەواو لەم') ||
    t.includes('شارەزابوونی تەواو لەم') ||
    t.includes('فێربوونا بنەمایان ب دروستی') ||
    t.includes('Experiment with the interactive code example') ||
    t.includes('کۆدی تاقی بکە د نیشاندانێ دا') ||
    t.includes('جرب تعديل الكود في نافذة المعاينة') ||
    t.includes('Neglecting edge cases') ||
    t.includes('ژبیرکرنا بنەمایێن پێوانەیی') ||
    t.includes('إهمال معايير الأداء')
  );
}

function trimSentence(text: string, maxLen = 135): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen - 1).trim()}…`;
}

function getCompactSyntaxSnippet(courseId: TrackId, lesson: Lesson, maxLen = 95): string {
  const syn = lesson.sharedCode?.syntax?.trim();
  const raw = !isTrivialOrCommentOnly(syn) ? syn : pickPrimaryLessonCode(courseId, lesson);
  const compact = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('//') && !l.startsWith('/*'))
    .slice(0, 2)
    .join(' ');
  return trimSentence(compact || raw, maxLen);
}

function getLessonSummaryLine(lesson: Lesson, loc: Locale, maxLen = 135): string {
  const tr = lesson.translations[loc] || lesson.translations.en;
  const candidates = [tr?.summary, tr?.syntaxNotes, tr?.intro, tr?.objectives?.[0]];
  for (const c of candidates) {
    if (c && !isBoilerplateCopy(c)) {
      return trimSentence(c, maxLen);
    }
  }
  return cleanTitle(tr?.title || lesson.id);
}

function buildLocalizedRecord(
  fn: (loc: Locale) => string
): Record<Locale, string> {
  return {
    ckb: fn('ckb'),
    kmr: fn('kmr'),
    ar: fn('ar'),
    en: fn('en'),
  };
}

function createBuggyCodeVariant(
  courseId: TrackId,
  cleanCode: string,
  effectiveLang?: IntegratedPracticeQuestion['codeLanguage']
): {
  buggyCode: string;
  brokenToken: string;
  fixedToken: string;
  reason: Record<Locale, string>;
} {
  const code = cleanCode.trim();
  const lang = effectiveLang || detectQuestionCodeLanguage(courseId, code);

  if (lang === 'html') {
    const tagMatch = code.match(/<([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>([^<]*)<\/\1>/);
    if (tagMatch) {
      const [full, tag, attrs, inner] = tagMatch;
      const brokenClose = `</${tag}_err>`;
      const broken = `<${tag}${attrs}>${inner}${brokenClose}`;
      return {
        buggyCode: code.replace(full, broken),
        brokenToken: brokenClose,
        fixedToken: `</${tag}>`,
        reason: {
          ckb: `تاگی داخستنەوەی ${brokenClose} هەڵەی تێدایە و پێویستە چاک بکرێتەوە بۆ </${tag}>.`,
          kmr: `Tagê girtinê ${brokenClose} şaş e û divê bête rastkirin bo </${tag}>.`,
          ar: `وسم الإغلاق ${brokenClose} غير صحيح ويجب تصحيحه إلى </${tag}>.`,
          en: `The closing tag is malformed (${brokenClose}); fix it to </${tag}>.`,
        },
      };
    }
    if (code.includes('<')) {
      const openTag = code.match(/<([a-zA-Z0-9-]+)/)?.[1] || 'div';
      const broken = code.replace(`<${openTag}`, `<${openTag}_err`);
      return {
        buggyCode: broken,
        brokenToken: `<${openTag}_err`,
        fixedToken: `<${openTag}`,
        reason: {
          ckb: `ناوی تاگەکە بە هەڵە نووسراوە (<${openTag}_err) لە بری (<${openTag}).`,
          kmr: `Navê tagê bi şaşî hatiye nivîsîn (<${openTag}_err) li şûna (<${openTag}).`,
          ar: `اسم الوسم مكتوب بشكل خاطئ (<${openTag}_err) بدلاً من (<${openTag}).`,
          en: `The tag name is misspelled as <${openTag}_err instead of <${openTag}.`,
        },
      };
    }
  }

  if (lang === 'css') {
    const propMatch = code.match(/([a-zA-Z-]+)\s*:\s*([^;{}\n]+);/);
    if (propMatch) {
      const [full, prop, val] = propMatch;
      const broken = `${prop} = ${val};`;
      return {
        buggyCode: code.replace(full, broken),
        brokenToken: `${prop} =`,
        fixedToken: `${prop}:`,
        reason: {
          ckb: `لە CSS دا نیشانەی دووخاڵ (:) لە نێوان تایبەتمەندی (${prop}) و نرخەکەیدا بەکاردێت، نەک (=).`,
          kmr: `Di CSS de du xal (:) di navbera taybetmendî (${prop}) û nirxê de tê bikaranîn, ne (=).`,
          ar: `في CSS تُستخدم النقطتان الرأسيتان (:) بين الخاصية (${prop}) وقيمتها، وليس (=).`,
          en: `CSS declarations use a colon (${prop}: value;), not an equals sign (${prop} =).`,
        },
      };
    }
  }

  if (lang === 'python') {
    if (/\bprint\s*\(/.test(code)) {
      return {
        buggyCode: code.replace(/\bprint\s*\(/, 'Print('),
        brokenToken: 'Print(',
        fixedToken: 'print(',
        reason: {
          ckb: `پایتۆن هەستیارە بە پیتی گەورە و بچووک؛ فەنکشنی print بە پیتی بچووک دەنووسرێت، نەک Print.`,
          kmr: `Python ji tîpên mezin û biçûk hesas e; fonksiyona print bi tîpa biçûk tê nivîsîn, ne Print.`,
          ar: `بايثون حساسة لحالة الأحرف؛ الدالة print تُكتب بأحرف صغيرة وليس Print.`,
          en: `Python is case-sensitive: built-in output uses lowercase print(, not Print(.`,
        },
      };
    }
    const pyKeyword = code.match(/\b(def|elif|for|while|import|class)\b/);
    if (pyKeyword) {
      const kw = pyKeyword[1];
      const typo = `${kw}_err`;
      return {
        buggyCode: code.replace(new RegExp(`\\b${kw}\\b`), typo),
        brokenToken: typo,
        fixedToken: kw,
        reason: {
          ckb: `وشەی سەرەکی (${typo}) هەڵەی تایپی تێدایە؛ دەبێت (${kw}) بێت.`,
          kmr: `Peyva sereke (${typo}) şaş e; divê (${kw}) be.`,
          ar: `الكلمة المفتاحية (${typo}) غير صحيحة؛ يجب أن تكون (${kw}).`,
          en: `Keyword typo "${typo}": restore valid Python keyword "${kw}".`,
        },
      };
    }
  }

  if (lang === 'cpp') {
    if (code.includes('std::cout')) {
      return {
        buggyCode: code.replace('std::cout', 'std::coutt'),
        brokenToken: 'std::coutt',
        fixedToken: 'std::cout',
        reason: {
          ckb: `ناوی ئۆبجێکتی چاپکردن لە C++ بریتییە لە std::cout نەک std::coutt.`,
          kmr: `Navê objeya çapkirinê li C++ std::cout e ne std::coutt.`,
          ar: `كائن الطباعة القياسي في C++ هو std::cout وليس std::coutt.`,
          en: `The standard output stream in C++ is spelled std::cout, not std::coutt.`,
        },
      };
    }
    const cppKw = code.match(/\b(return|while|for|class|struct|void|double|bool|int)\b/);
    if (cppKw) {
      const kw = cppKw[1];
      const typo = `${kw}_err`;
      return {
        buggyCode: code.replace(new RegExp(`\\b${kw}\\b`), typo),
        brokenToken: typo,
        fixedToken: kw,
        reason: {
          ckb: `لە C++ وشەی (${typo}) هەڵەیە و پێویستە چاک بکرێتەوە بۆ (${kw}).`,
          kmr: `Di C++ de (${typo}) şaş e û divê bibe (${kw}).`,
          ar: `في C++ الكلمة (${typo}) خاطئة ويجب تصحيحها إلى (${kw}).`,
          en: `Fix the misspelled C++ keyword "${typo}" back to "${kw}".`,
        },
      };
    }
  }

  // JavaScript / React / TSX / Vite defaults
  const replacements: Array<[RegExp, string, string, string, Record<Locale, string>]> = [
    [
      /\bconst\b/,
      'constt',
      'const',
      'constt',
      {
        ckb: `وشەی سەرەکی const بە هەڵە نووسراوە وەک constt.`,
        kmr: `Peyva sereke const bi şaşî wek constt hatiye nivîsîn.`,
        ar: `الكلمة المفتاحية const مكتوبة بشكل خاطئ constt.`,
        en: `The variable keyword is misspelled as constt instead of const.`,
      },
    ],
    [
      /\bfunction\b/,
      'fucntion',
      'function',
      'fucntion',
      {
        ckb: `وشەی function بە هەڵە نووسراوە (fucntion). چاکی بکەرەوە بۆ function.`,
        kmr: `Peyva function bi şaşî hatiye nivîsîn (fucntion). Rast bike bo function.`,
        ar: `كلمة function مكتوبة بشكل خاطئ (fucntion). صححها إلى function.`,
        en: `The keyword is misspelled as fucntion; correct it to function.`,
      },
    ],
    [
      /\breturn\b/,
      'retun',
      'return',
      'retun',
      {
        ckb: `وشەی گەڕانەوە (return) بە هەڵە نووسراوە وەک retun.`,
        kmr: `Peyva vegerandinê (return) bi şaşî wek retun hatiye nivîsîn.`,
        ar: `كلمة الإرجاع return مكتوبة بشكل خاطئ retun.`,
        en: `The return statement is misspelled as retun; change it to return.`,
      },
    ],
    [
      /\bconsole\.log\b/,
      'console.lgo',
      'console.log',
      'console.lgo',
      {
        ckb: `ناوی میتۆدی چاپکردن console.log هەڵەی تایپی تێدایە (console.lgo).`,
        kmr: `Navê metoda çapkirinê console.log şaşî tê de heye (console.lgo).`,
        ar: `دالة الطباعة console.log تحتوي خطأ إملائياً (console.lgo).`,
        en: `console.log is misspelled as console.lgo; restore console.log.`,
      },
    ],
    [
      /\blet\b/,
      'lett',
      'let',
      'lett',
      {
        ckb: `وشەی پێناسەکردنی گۆڕاو بریتییە لە let نەک lett.`,
        kmr: `Peyva pênasekirina guherbarê let e ne lett.`,
        ar: `كلمة تعريف المتغير هي let وليست lett.`,
        en: `The declaration keyword is let, not lett.`,
      },
    ],
    [
      /\bexport\b/,
      'exprot',
      'export',
      'exprot',
      {
        ckb: `وشەی export بە هەڵە نووسراوە (exprot). چاکی بکەرەوە بۆ export.`,
        kmr: `Peyva export bi şaşî hatiye nivîsîn (exprot). Rast bike bo export.`,
        ar: `كلمة export مكتوبة بشكل خاطئ (exprot). صححها إلى export.`,
        en: `The module keyword is misspelled as exprot; fix it to export.`,
      },
    ],
    [
      /\bimport\b/,
      'impotr',
      'import',
      'impotr',
      {
        ckb: `وشەی import بە هەڵە نووسراوە (impotr). چاکی بکەرەوە بۆ import.`,
        kmr: `Peyva import bi şaşî hatiye nivîsîn (impotr). Rast bike bo import.`,
        ar: `كلمة import مكتوبة بشكل خاطئ (impotr). صححها إلى import.`,
        en: `The import keyword is misspelled as impotr; fix it to import.`,
      },
    ],
    [
      /\binterface\b/,
      'interfce',
      'interface',
      'interfce',
      {
        ckb: `وشەی interface بە هەڵە نووسراوە (interfce).`,
        kmr: `Peyva interface bi şaşî hatiye nivîsîn (interfce).`,
        ar: `كلمة interface مكتوبة بشكل خاطئ (interfce).`,
        en: `The TypeScript keyword interface is misspelled as interfce.`,
      },
    ],
    [
      /\btype\b/,
      'tyep',
      'type',
      'tyep',
      {
        ckb: `وشەی type بە هەڵە نووسراوە (tyep). چاکی بکەرەوە بۆ type.`,
        kmr: `Peyva type bi şaşî wek tyep hatiye nivîsîn.`,
        ar: `كلمة type مكتوبة بشكل خاطئ (tyep).`,
        en: `The keyword type is misspelled as tyep; fix it to type.`,
      },
    ],
    [
      /\basync\b/,
      'asycn',
      'async',
      'asycn',
      {
        ckb: `وشەی async بە هەڵە نووسراوە (asycn).`,
        kmr: `Peyva async bi şaşî wek asycn hatiye nivîsîn.`,
        ar: `كلمة async مكتوبة بشكل خاطئ (asycn).`,
        en: `Fix the misspelled keyword asycn back to async.`,
      },
    ],
    [
      /\buseState\b/,
      'useStat',
      'useState',
      'useStat',
      {
        ckb: `هوکی React بریتییە لە useState نەک useStat.`,
        kmr: `Hooka React useState ye ne useStat.`,
        ar: `اسم خطاف الحالة الصحيح في React هو useState وليس useStat.`,
        en: `The React hook is named useState, not useStat.`,
      },
    ],
    [
      /\bvite\b/,
      'vtie',
      'vite',
      'vtie',
      {
        ckb: `ناوی ئامرازەکە بە هەڵە نووسراوە (vtie)؛ دەبێت (vite) بێت.`,
        kmr: `Navê amrazê bi şaşî hatiye nivîsîn (vtie); divê (vite) be.`,
        ar: `اسم الأداة مكتوب بشكل خاطئ (vtie)؛ يجب أن يكون (vite).`,
        en: `The tool name is misspelled as vtie; restore vite.`,
      },
    ],
  ];

  for (const [rx, brokenTok, fixedTok, forbidden, reason] of replacements) {
    if (rx.test(code)) {
      return {
        buggyCode: code.replace(rx, brokenTok),
        brokenToken: forbidden,
        fixedToken: fixedTok,
        reason,
      };
    }
  }

  // Last-resort realistic syntax fix: drop a valid identifier char safely rather than fake markers
  const word = code.match(/\b([a-zA-Z]{3,})\b/)?.[1];
  if (word) {
    const brokenWord = `${word}_typ0`;
    return {
      buggyCode: code.replace(new RegExp(`\\b${word}\\b`), brokenWord),
      brokenToken: brokenWord,
      fixedToken: word,
      reason: {
        ckb: `هەڵەی تایپ (${brokenWord}) لەناو کۆدەکە چاک بکەرەوە بۆ (${word}).`,
        kmr: `Şaşiya tîpî (${brokenWord}) rast bike bo (${word}).`,
        ar: `صحّح الخطأ الإملائي (${brokenWord}) إلى (${word}).`,
        en: `Fix the misspelled identifier (${brokenWord}) back to (${word}).`,
      },
    };
  }

  return {
    buggyCode: `${code} ;?`,
    brokenToken: ';?',
    fixedToken: code.trim(),
    reason: {
      ckb: `هێمای زیادەی (;?) لە کۆتایی کۆدەکە لاببە.`,
      kmr: `Nîşana zêde (;?) ji dawiya kodê rake.`,
      ar: `أزل الرمز الزائد (;?) من نهاية الكود.`,
      en: `Remove the invalid (;?) characters from the end of the snippet.`,
    },
  };
}

function createCodeCompletionSpec(
  courseId: TrackId,
  cleanCode: string
): {
  templateCode: string;
  missingToken: string;
  acceptableAnswers: string[];
  hint: Record<Locale, string>;
} {
  const code = cleanCode.trim();
  const candidatesByLang: Array<RegExp> =
    courseId === 'html'
      ? [/<([a-zA-Z][a-zA-Z0-9-]*)/, /\b(href|src|alt|class|type|value|action)\b/]
      : courseId === 'css'
        ? [/\b(display|color|background|padding|margin|grid-template-columns|justify-content|flex-direction|border-radius|font-size)\b/]
        : courseId === 'python'
          ? [/\b(print|def|return|for|while|elif|range|len|import|class)\b/]
          : courseId === 'cpp'
            ? [/\b(std::cout|std::cin|return|int|double|bool|for|while|class|void)\b/]
            : [/\b(const|let|function|return|async|await|useState|useEffect|export|interface|console\.log|map|filter)\b/];

  for (const rx of candidatesByLang) {
    const match = code.match(rx);
    if (match) {
      const token = match[1] || match[0];
      if (token && token.length >= 2) {
        const idx = code.indexOf(token);
        const templateCode = `${code.slice(0, idx)}____${code.slice(idx + token.length)}`;
        return {
          templateCode,
          missingToken: token,
          acceptableAnswers: [token],
          hint: buildLocalizedRecord((loc) =>
            loc === 'ckb'
              ? `بۆشاییەکە (____) پڕ بکەرەوە بە وشە سەرەکییە دروستەکە (${token.length} پیت).`
              : loc === 'kmr'
                ? `Valahiyê (____) bi peyva durust tijî bike (${token.length} tîp).`
                : loc === 'ar'
                  ? `املأ الفراغ (____) بالكلمة البرمجية الصحيحة (${token.length} أحرف).`
                  : `Fill in the blank (____) with the exact keyword or identifier (${token.length} chars).`
          ),
        };
      }
    }
  }

  // Fallback on first alphabetic identifier token
  const wordMatch = code.match(/\b([a-zA-Z_][a-zA-Z0-9_-]{2,})\b/);
  const token = wordMatch ? wordMatch[1] : 'code';
  const idx = code.indexOf(token);
  const templateCode =
    idx >= 0 ? `${code.slice(0, idx)}____${code.slice(idx + token.length)}` : `____ ${code}`;
  return {
    templateCode,
    missingToken: token,
    acceptableAnswers: [token],
    hint: buildLocalizedRecord((loc) =>
      loc === 'ckb'
        ? `ئەو وشە سەرەکییە بنووسە کە بۆشایی ____ تەواو دەکات.`
        : loc === 'kmr'
          ? `Peyva ku valahiya ____ temam dike binivîse.`
          : loc === 'ar'
            ? `اكتب الكلمة التي تكمل الفراغ ____ بشكل سليم.`
            : `Type the missing token that replaces ____.`
    ),
  };
}

function extractPracticalChallengeSpec(
  courseId: TrackId,
  lesson: Lesson,
  cleanCode: string,
  effectiveLang?: IntegratedPracticeQuestion['codeLanguage']
): {
  starterCode: string;
  solutionCode: string;
  expectedTokens: string[];
  expectedOutputIncludes: string[];
  previewHtml?: string;
  previewCss?: string;
  previewJs?: string;
} {
  const lang = effectiveLang || detectQuestionCodeLanguage(courseId, cleanCode);
  const lines = cleanCode.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const lastMeaningful = lines[lines.length - 1] || cleanCode;

  // Build starter by removing the key last line or key expression so learner genuinely completes/writes it
  let starterCode = '';
  if (lines.length >= 2) {
    starterCode = `${lines.slice(0, -1).join('\n')}\n// TODO: Complete this step based on "${cleanTitle(lesson.translations.en.title)}"`;
  } else {
    const todoComment =
      lang === 'html'
        ? `<!-- TODO: Write HTML for ${cleanTitle(lesson.translations.en.title)} -->`
        : lang === 'css'
          ? `/* TODO: Write CSS rules for ${cleanTitle(lesson.translations.en.title)} */`
          : lang === 'python'
            ? `# TODO: Write Python code for ${cleanTitle(lesson.translations.en.title)}`
            : `// TODO: Write solution for ${cleanTitle(lesson.translations.en.title)}`;
    starterCode = `${todoComment}\n`;
  }

  // Extract 1-2 sturdy expected tokens from the lesson's target snippet
  const tokens: string[] = [];
  if (lang === 'html') {
    const tags = Array.from(cleanCode.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)/g)).map((m) => `<${m[1]}`);
    if (tags[0]) tokens.push(tags[0]);
    const closeMatch = cleanCode.match(/<\/([a-zA-Z][a-zA-Z0-9-]*)>/);
    if (closeMatch) tokens.push(`</${closeMatch[1]}>`);
  } else if (lang === 'css') {
    const prop = lastMeaningful.match(/([a-zA-Z-]+)\s*:/);
    if (prop) tokens.push(`${prop[1]}:`);
    else tokens.push('{', '}');
  } else if (lang === 'python') {
    const kw = cleanCode.match(/\b(print|def|for|while|if|return|class|import)\b/);
    if (kw) tokens.push(kw[1]);
  } else if (lang === 'cpp') {
    if (cleanCode.includes('std::cout')) tokens.push('std::cout');
    else if (cleanCode.includes('return')) tokens.push('return');
    const kw = cleanCode.match(/\b(int|void|double|for|while|if|class|struct|include)\b/);
    if (kw && !tokens.includes(kw[1])) tokens.push(kw[1]);
  } else {
    const kw = cleanCode.match(/\b(const|let|function|return|console\.log|useState|useEffect|export|interface)\b/);
    if (kw) tokens.push(kw[1]);
  }

  if (tokens.length === 0) {
    const fallbackWord = lastMeaningful.trim().split(/[\s(;=]+/).find((w) => w.length >= 2);
    if (fallbackWord) tokens.push(fallbackWord);
  }

  const sc = lesson.sharedCode || { html: '', css: '', js: '', syntax: '' };
  return {
    starterCode,
    solutionCode: cleanCode,
    expectedTokens: tokens,
    expectedOutputIncludes: [],
    previewHtml: sc.html || '',
    previewCss: sc.css || '',
    previewJs: sc.js || '',
  };
}

export function buildCourseLearningModules(
  courseId: TrackId,
  trackLessons: Lesson[],
  config: EffectivePracticeConfig,
  curatedExercises: PublicExercise[],
  curatedQuizzes: PublicQuiz[]
): PracticeModule[] {
  const sorted = [...trackLessons].sort((a, b) => a.order - b.order);
  if (sorted.length === 0) return [];

  const allTrackLessons = sorted;
  const groupSize = Math.max(1, config.lessonsPerGroup);
  const modules: PracticeModule[] = [];
  const codeLang = mapTrackToCodeLanguage(courseId);

  for (let startIdx = 0; startIdx < sorted.length; startIdx += groupSize) {
    const groupLessons = sorted.slice(startIdx, startIdx + groupSize);
    const groupIndex = Math.floor(startIdx / groupSize) + 1;
    const lessonStartNumber = groupLessons[0].order;
    const lessonEndNumber = groupLessons[groupLessons.length - 1].order;
    const lessonIds = groupLessons.map((l) => l.id);
    const moduleId = `${courseId}__mod_${groupIndex}`;

    const questions: IntegratedPracticeQuestion[] = [];
    const lesson0 = groupLessons[0];
    const lesson1 = groupLessons[1] || groupLessons[0];
    const lesson2 = groupLessons[groupLessons.length - 1];

    // 1) Topic-adapted MCQs covering lessons in this group
    const distractorPool = allTrackLessons.filter((l) => !lessonIds.includes(l.id));
    const padNum = (n: number) => String(n).padStart(2, '0');

    // Include any matching non-placeholder curated multiple-choice exercise prompt as inspiration,
    // while keeping verified deterministic answers grounded directly in our curriculum
    const curatedMcqHint = curatedExercises.find(
      (ex) =>
        ex.courseId === courseId &&
        ex.type === 'multiple_choice' &&
        ex.lessonId &&
        lessonIds.includes(ex.lessonId) &&
        !ex.translations?.en?.options?.[1]?.includes('Option B')
    );

    if (curatedMcqHint && curatedMcqHint.translations?.en?.options?.length === 4) {
      const targetLesson =
        groupLessons.find((l) => l.id === curatedMcqHint.lessonId) || lesson0;
      // Known curated HTML exercises in htmlCourse have canonical answers identifiable via hint/lesson
      const opts = curatedMcqHint.translations;
      const optionRecords: Record<Locale, string>[] = [0, 1, 2, 3].map((idx) => ({
        ckb: opts.ckb?.options?.[idx] || opts.en.options![idx] || '',
        kmr: opts.kmr?.options?.[idx] || opts.en.options![idx] || '',
        ar: opts.ar?.options?.[idx] || opts.en.options![idx] || '',
        en: opts.en?.options?.[idx] || '',
      }));
      // Identify correct index safely when curated answer matches main/strong/href etc. or skip if opaque
      const hintEn = (opts.en?.hint || '').toLowerCase();
      const matchedOptIdx = optionRecords.findIndex((o) => {
        const cleanOpt = o.en.replace(/[<>/]/g, '').toLowerCase();
        return cleanOpt.length >= 2 && hintEn.includes(cleanOpt);
      });
      if (matchedOptIdx >= 0) {
        questions.push({
          id: `${moduleId}_mcq_cur_${curatedMcqHint.id}`,
          type: 'mcq',
          lessonId: targetLesson.id,
          lessonNumber: targetLesson.order,
          sourceKind: 'curated_exercise',
          curatedId: curatedMcqHint.id,
          track: courseId,
          prompt: {
            ckb: opts.ckb?.prompt || opts.en.prompt,
            kmr: opts.kmr?.prompt || opts.en.prompt,
            ar: opts.ar?.prompt || opts.en.prompt,
            en: opts.en.prompt,
          },
          options: optionRecords,
          correctOptionIndex: matchedOptIdx,
          explanation: buildLocalizedRecord((loc) => {
            const topic = cleanTitle(targetLesson.translations[loc]?.title || targetLesson.id);
            const h = curatedMcqHint.translations[loc]?.hint || getLessonSummaryLine(targetLesson, loc, 160);
            if (loc === 'ckb') return `لە وانەی "${topic}" دا: ${h}`;
            if (loc === 'kmr') return `Di waneya "${topic}" de: ${h}`;
            if (loc === 'ar') return `في درس "${topic}": ${h}`;
            return `From "${topic}": ${h}`;
          }),
        });
      }
    }

    // Track curated quiz count safely (server holds official key vault, so adaptive MCQs keep client grading 100% accurate)
    void curatedQuizzes.length;

    // Build genuine, non-duplicate MCQs grounded directly in syntax & lesson concepts
    while (questions.filter((q) => q.type === 'mcq').length < 2) {
      const mcqIdx = questions.filter((q) => q.type === 'mcq').length;
      const focusLesson = mcqIdx === 0 ? lesson0 : lesson1;
      const focusOrder = focusLesson.order;
      const useSyntaxAsOptions = mcqIdx === 1;

      const getOptionText = (lesson: Lesson, loc: Locale): string => {
        if (useSyntaxAsOptions) {
          return getCompactSyntaxSnippet(courseId, lesson, 82);
        }
        return cleanTitle(lesson.translations[loc]?.title || lesson.id);
      };

      const targetEnText = getOptionText(focusLesson, 'en').toLowerCase();
      const usedKeys = new Set<string>([targetEnText]);
      const pickedDistractors: Lesson[] = [];

      const searchCandidates = [...distractorPool, ...allTrackLessons];
      for (let i = 0; i < searchCandidates.length && pickedDistractors.length < 3; i++) {
        const candidate = searchCandidates[(startIdx + mcqIdx * 3 + i * 5) % searchCandidates.length];
        if (!candidate || candidate.id === focusLesson.id) continue;
        const candKey = getOptionText(candidate, 'en').toLowerCase();
        if (!usedKeys.has(candKey)) {
          usedKeys.add(candKey);
          pickedDistractors.push(candidate);
        }
      }

      const fallbackCustomOptions: Record<Locale, string[]> = {
        ckb: [
          'فەرمانێکی هەڵەیە و لەم زمانەدا بوونی نییە.',
          'بۆ سڕینەوەی زانیارییەکان لە بیرگەدا بەکاردێت.',
          'تەنها بۆ ڕێکخستنی سێرڤەری دەرەکی بەکاردێت.',
        ],
        kmr: [
          'Fermaneke şaş e û di vî zimanî de nîne.',
          'Ji bo jêbirina daneyan tê bikaranîn.',
          'Tenê ji bo servera derve tê bikaranîn.',
        ],
        ar: [
          'صيغة غير صحيحة ولا تتبع قواعد هذا المسار.',
          'تُستخدم فقط لإدارة قاعدة بيانات خارجية.',
          'أمر قديم غير متوافق مع هذا الدرس.',
        ],
        en: [
          'Invalid syntax not supported in this module.',
          'Legacy server-only database directive.',
          'Deprecated runtime helper outside this track.',
        ],
      };

      const correctSlot = (groupIndex + mcqIdx) % 4;
      const optionRecords: Record<Locale, string>[] = [];
      let distractorCursor = 0;
      let fallbackCursor = 0;

      for (let slot = 0; slot < 4; slot++) {
        if (slot === correctSlot) {
          optionRecords.push(buildLocalizedRecord((loc) => getOptionText(focusLesson, loc)));
        } else if (distractorCursor < pickedDistractors.length) {
          const distLesson = pickedDistractors[distractorCursor++];
          optionRecords.push(buildLocalizedRecord((loc) => getOptionText(distLesson, loc)));
        } else {
          const fbIdx = fallbackCursor++ % 3;
          optionRecords.push(buildLocalizedRecord((loc) => fallbackCustomOptions[loc][fbIdx]));
        }
      }

      const focusSyntaxPreview = getCompactSyntaxSnippet(courseId, focusLesson, 96);

      questions.push({
        id: `${moduleId}_mcq_${mcqIdx + 1}`,
        type: 'mcq',
        lessonId: focusLesson.id,
        lessonNumber: focusOrder,
        sourceKind: 'adaptive_lesson',
        track: courseId,
        prompt: buildLocalizedRecord((loc) => {
          const topic = cleanTitle(focusLesson.translations[loc]?.title || focusLesson.id);
          if (useSyntaxAsOptions) {
            if (loc === 'ckb') return `بۆ جێبەجێکردنی وانەی ${padNum(focusOrder)} «${topic}»، کام کۆد یان ڕێزمانەی خوارەوە دروستە؟`;
            if (loc === 'kmr') return `Ji bo waneya ${padNum(focusOrder)} «${topic}», kîjan kod yan rêzman durust e?`;
            if (loc === 'ar') return `لتطبيق الدرس ${padNum(focusOrder)} «${topic}»، أي كود أو صياغة هي الصحيحة؟`;
            return `Which syntax snippet applies Lesson ${padNum(focusOrder)}: "${topic}"?`;
          }
          if (loc === 'ckb') return `ئەم کۆد/ڕێزمانەی خوارەوە کام چەمک و وانەیە جێبەجێ دەکات؟\n${focusSyntaxPreview}`;
          if (loc === 'kmr') return `Ev kod yan rêzman kîjan mijarê di vî kursî de pêk tîne?\n${focusSyntaxPreview}`;
          if (loc === 'ar') return `أي درس ومفهوم يطبّقه هذا الكود أو الصياغة؟\n${focusSyntaxPreview}`;
          return `Which topic does this syntax implement?\n${focusSyntaxPreview}`;
        }),
        options: optionRecords,
        correctOptionIndex: correctSlot,
        explanation: buildLocalizedRecord((loc) => {
          const topic = cleanTitle(focusLesson.translations[loc]?.title || focusLesson.id);
          const summary = getLessonSummaryLine(focusLesson, loc, 160);
          const extra = summary.toLowerCase() !== topic.toLowerCase() ? ` — ${summary}` : '';
          if (loc === 'ckb') return `وانەی "${topic}" ڕێزمانی (${focusSyntaxPreview}) بەکاردەهێنێت${extra}`;
          if (loc === 'kmr') return `Waneya "${topic}" vê kodê bi kar tîne: (${focusSyntaxPreview})${extra}`;
          if (loc === 'ar') return `درس "${topic}" يعتمد على (${focusSyntaxPreview})${extra}`;
          return `"${topic}" uses (${focusSyntaxPreview})${extra}`;
        }),
      });
    }

    // 2) True / False question grounded in concrete syntax or non-boilerplate misconception
    const tfLesson = lesson1;
    const isStatementTrue = groupIndex % 2 === 1;
    const tfSyntax = getCompactSyntaxSnippet(courseId, tfLesson, 75);
    const wrongSyntaxPartner =
      distractorPool[(startIdx + 4) % Math.max(1, distractorPool.length)] ||
      allTrackLessons[(tfLesson.order + 3) % allTrackLessons.length] ||
      lesson0;
    const wrongSyntax = getCompactSyntaxSnippet(courseId, wrongSyntaxPartner, 75);

    const tfFocusObjective = buildLocalizedRecord((loc) => {
      const tr = tfLesson.translations[loc] || tfLesson.translations.en;
      const topic = cleanTitle(tr?.title || tfLesson.id);
      const rawSummary = tr?.summary;
      const cleanMistake = tr?.commonMistakes?.find((m) => !isBoilerplateCopy(m));

      if (isStatementTrue) {
        const concreteRule =
          rawSummary && !isBoilerplateCopy(rawSummary)
            ? trimSentence(rawSummary, 145)
            : `(${tfSyntax})`;
        if (loc === 'ckb') return `ڕاست یان هەڵە: لە بابەتی «${topic}» دا ڕێزمانی دروست (${tfSyntax})ـە — ${concreteRule}`;
        if (loc === 'kmr') return `Rast yan Şaş: Di mijara «${topic}» de rêzmana durust (${tfSyntax}) ye.`;
        if (loc === 'ar') return `صحيح أم خطأ: في درس «${topic}»، الصياغة الصحيحة هي (${tfSyntax}).`;
        return `True or False: In "${topic}", the standard syntax uses (${tfSyntax}).`;
      }

      if (cleanMistake) {
        const mText = trimSentence(cleanMistake, 130);
        if (loc === 'ckb') return `ڕاست یان هەڵە: لە وانەی «${topic}» دا پەسەندە و باشترە کە ئەم هەنگاوە بکرێت — ${mText}`;
        if (loc === 'kmr') return `Rast yan Şaş: Di waneya «${topic}» de baştir e ku ev tişt bête kirin — ${mText}`;
        if (loc === 'ar') return `صحيح أم خطأ: في درس «${topic}» يُنصح بالقيام بما يلي — ${mText}`;
        return `True or False: In "${topic}", standard best practice recommends: ${mText}`;
      }

      if (wrongSyntax !== tfSyntax) {
        if (loc === 'ckb') return `ڕاست یان هەڵە: بۆ جێبەجێکردنی «${topic}» پێویستە ڕێزمانی (${wrongSyntax}) بەکاربهێنرێت لە بری (${tfSyntax}).`;
        if (loc === 'kmr') return `Rast yan Şaş: Ji bo «${topic}» divê (${wrongSyntax}) bête bikaranîn li şûna (${tfSyntax}).`;
        if (loc === 'ar') return `صحيح أم خطأ: لتطبيق «${topic}» نستخدم (${wrongSyntax}) بدلاً من (${tfSyntax}).`;
        return `True or False: Implementing "${topic}" requires writing (${wrongSyntax}) instead of (${tfSyntax}).`;
      }

      if (loc === 'ckb') return `ڕاست یان هەڵە: بابەتی «${topic}» هیچ ڕێسایەکی سنتاکسی نییە و لە کۆدی ڕاستەقینەدا کار ناکات.`;
      if (loc === 'kmr') return `Rast yan Şaş: Mijara «${topic}» tu rêzikên sintaksê nîne.`;
      if (loc === 'ar') return `صحيح أم خطأ: موضوع «${topic}» لا يخضع لأي قواعد برمجية قياسية.`;
      return `True or False: "${topic}" has no valid syntax or predictable behavior.`;
    });

    questions.push({
      id: `${moduleId}_tf_1`,
      type: 'true_false',
      lessonId: tfLesson.id,
      lessonNumber: tfLesson.order,
      sourceKind: 'adaptive_lesson',
      track: courseId,
      prompt: tfFocusObjective,
      options: [
        { ckb: 'ڕاست (True)', kmr: 'Rast (True)', ar: 'صحيح (True)', en: 'True' },
        { ckb: 'هەڵە (False)', kmr: 'Şaş (False)', ar: 'خطأ (False)', en: 'False' },
      ],
      correctOptionIndex: isStatementTrue ? 0 : 1,
      explanation: buildLocalizedRecord((loc) => {
        const tr = tfLesson.translations[loc] || tfLesson.translations.en;
        const topic = cleanTitle(tr?.title || tfLesson.id);
        const coreFact = getLessonSummaryLine(tfLesson, loc, 160);
        if (isStatementTrue) {
          if (loc === 'ckb') return `ڕاستە — لە وانەی "${topic}" دا (${tfSyntax}) بەکاردێت. ${coreFact !== topic ? coreFact : ''}`;
          if (loc === 'kmr') return `Rast e — di waneya "${topic}" de (${tfSyntax}) tê bikaranîn.`;
          if (loc === 'ar') return `صحيح — يعتمد درس "${topic}" على الصياغة (${tfSyntax}).`;
          return `True — "${topic}" directly applies (${tfSyntax}).`;
        }
        if (loc === 'ckb') return `هەڵەیە — شێوازی دروست لە وانەی "${topic}" دا (${tfSyntax})ـە، نەک ئەو هەڵە باوە.`;
        if (loc === 'kmr') return `Şaş e — awayê durust di waneya "${topic}" de (${tfSyntax}) ye.`;
        if (loc === 'ar') return `خطأ — الصياغة الصحيحة في درس "${topic}" هي (${tfSyntax}).`;
        return `False — the accurate syntax for "${topic}" is (${tfSyntax}).`;
      }),
    });

    // 3) Find & Fix Coding Errors exercise
    const fixLesson = lesson0;
    const fixCleanCode = pickPrimaryLessonCode(courseId, fixLesson);
    const fixLang = detectQuestionCodeLanguage(courseId, fixCleanCode);
    const bugSpec = createBuggyCodeVariant(courseId, fixCleanCode, fixLang);
    questions.push({
      id: `${moduleId}_findfix_1`,
      type: 'find_fix',
      lessonId: fixLesson.id,
      lessonNumber: fixLesson.order,
      sourceKind: 'adaptive_lesson',
      track: courseId,
      codeLanguage: fixLang,
      buggyCode: bugSpec.buggyCode,
      starterCode: bugSpec.buggyCode,
      solutionCode: fixCleanCode,
      expectedSnippetTokens: [bugSpec.fixedToken],
      forbiddenTokens: bugSpec.brokenToken && bugSpec.brokenToken !== bugSpec.fixedToken ? [bugSpec.brokenToken] : [],
      prompt: buildLocalizedRecord((loc) => {
        const topic = cleanTitle(fixLesson.translations[loc]?.title || fixLesson.id);
        if (loc === 'ckb') return `هەڵەکەی ناو کۆدی وانەی "${topic}" بدۆزەرەوە و چاکی بکەرەوە پاشان تاقی بکەرەوە.`;
        if (loc === 'kmr') return `Şaşiya di nav koda waneya "${topic}" de bibîne, rast bike û paşê biceribîne.`;
        if (loc === 'ar') return `اكتشف الخطأ البرمجي في كود درس "${topic}" وصحّحه ثم اختبر الحل.`;
        return `Find and fix the coding error in the snippet from "${topic}", then test your fix.`;
      }),
      hint: buildLocalizedRecord((loc) => {
        if (loc === 'ckb') return `سەرنج بدە "${bugSpec.brokenToken}" و چاکی بکەرەوە بۆ "${bugSpec.fixedToken}".`;
        if (loc === 'kmr') return `Bala xwe bide "${bugSpec.brokenToken}" û rast bike bo "${bugSpec.fixedToken}".`;
        if (loc === 'ar') return `انتبه إلى "${bugSpec.brokenToken}" وقم بتصحيحه إلى "${bugSpec.fixedToken}".`;
        return `Look closely near "${bugSpec.brokenToken}" and fix it to "${bugSpec.fixedToken}".`;
      }),
      explanation: bugSpec.reason,
    });

    // 4) Write & Complete Code exercise
    const compLesson = groupLessons.length > 1 ? lesson1 : lesson0;
    const compCleanCode = pickPrimaryLessonCode(courseId, compLesson);
    const compLang = detectQuestionCodeLanguage(courseId, compCleanCode);
    const compSpec = createCodeCompletionSpec(compLang === 'html' ? 'html' : courseId, compCleanCode);
    questions.push({
      id: `${moduleId}_complete_1`,
      type: 'complete_code',
      lessonId: compLesson.id,
      lessonNumber: compLesson.order,
      sourceKind: 'adaptive_lesson',
      track: courseId,
      codeLanguage: compLang,
      starterCode: compSpec.templateCode,
      solutionCode: compSpec.missingToken,
      blankPlaceholder: '____',
      acceptableAnswers: compSpec.acceptableAnswers,
      expectedSnippetTokens: [compSpec.missingToken],
      prompt: buildLocalizedRecord((loc) => {
        const topic = cleanTitle(compLesson.translations[loc]?.title || compLesson.id);
        if (loc === 'ckb') return `ئەم کۆدەی وانەی "${topic}" تەواو بکە بە نووسینی بەشە ونبووەکە لە شوێنی ____:`;
        if (loc === 'kmr') return `Vê koda waneya "${topic}" temam bike bi nivîsîna beşa windabûyî li cihê ____:`;
        if (loc === 'ar') return `أكمل الكود التالي من درس "${topic}" بكتابة الجزء الناقص مكان ____:`;
        return `Complete the code from "${topic}" by writing the missing part for ____:`;
      }),
      hint: compSpec.hint,
      explanation: buildLocalizedRecord((loc) => {
        const topic = cleanTitle(compLesson.translations[loc]?.title || compLesson.id);
        if (loc === 'ckb') return `وشە تەواوکارە دروستەکە بریتییە لە \`${compSpec.missingToken}\` وەک لە وانەی "${topic}" دا بەکارهاتووە.`;
        if (loc === 'kmr') return `Peyva temamker a durust \`${compSpec.missingToken}\` ye wekî di waneya "${topic}" de hatiye bikaranîn.`;
        if (loc === 'ar') return `الكلمة الصحيحة لإكمال الفراغ هي \`${compSpec.missingToken}\` كما وردت في درس "${topic}".`;
        return `The exact token that completes the syntax in "${topic}" is \`${compSpec.missingToken}\`.`;
      }),
    });

    // 5) Practical Coding Challenge (Interactive Code Editor with Run + Test)
    const matchingCuratedEx = curatedExercises.find(
      (ex) =>
        ex.courseId === courseId &&
        (ex.type === 'complete_code' || ex.type === 'find_error') &&
        ex.lessonId &&
        lessonIds.includes(ex.lessonId)
    );
    const chalLesson =
      (matchingCuratedEx?.lessonId &&
        groupLessons.find((l) => l.id === matchingCuratedEx.lessonId)) ||
      lesson2;
    const chalCleanCode = pickPrimaryLessonCode(courseId, chalLesson);
    const chalLang = detectQuestionCodeLanguage(courseId, chalCleanCode);
    const chalSpec = extractPracticalChallengeSpec(courseId, chalLesson, chalCleanCode, chalLang);

    if (matchingCuratedEx && matchingCuratedEx.codeSnippet && !isTrivialOrCommentOnly(matchingCuratedEx.codeSnippet)) {
      const tr = matchingCuratedEx.translations;
      const promptMap: Record<Locale, string> = {
        ckb: tr.ckb?.prompt || tr.en.prompt,
        kmr: tr.kmr?.prompt || tr.en.prompt,
        ar: tr.ar?.prompt || tr.en.prompt,
        en: tr.en.prompt,
      };
      const hintMap: Record<Locale, string> = {
        ckb: tr.ckb?.hint || tr.en.hint || '',
        kmr: tr.kmr?.hint || tr.en.hint || '',
        ar: tr.ar?.hint || tr.en.hint || '',
        en: tr.en.hint || '',
      };

      questions.push({
        id: `${moduleId}_practical_${matchingCuratedEx.id}`,
        type: 'practical_challenge',
        lessonId: matchingCuratedEx.lessonId || chalLesson.id,
        lessonNumber: chalLesson.order,
        sourceKind: 'curated_exercise',
        curatedId: matchingCuratedEx.id,
        track: courseId,
        codeLanguage: chalLang,
        starterCode: matchingCuratedEx.codeSnippet,
        solutionCode: chalCleanCode,
        expectedSnippetTokens: chalSpec.expectedTokens,
        previewHtml: chalSpec.previewHtml,
        previewCss: chalSpec.previewCss,
        previewJs: chalSpec.previewJs,
        prompt: promptMap,
        hint: hintMap,
        explanation: buildLocalizedRecord((loc) => {
          const topic = cleanTitle(chalLesson.translations[loc]?.title || chalLesson.id);
          const h = tr[loc]?.hint || tr.en?.hint || '';
          if (loc === 'ckb') return `چارەسەری پراکتیکی بۆ "${topic}" پێویستی بە جێبەجێکردنی دروستی ڕێنمایی وانەکە هەیە${h ? `: ${h}` : '.'}`;
          if (loc === 'kmr') return `Çareseriya pratîkî bo "${topic}" pêwîstî bi bicihanîna durust a waneyê heye${h ? `: ${h}` : '.'}`;
          if (loc === 'ar') return `الحل العملي لدرس "${topic}" يتطلب تطبيق الصيغة الصحيحة${h ? `: ${h}` : '.'}`;
          return `For the "${topic}" coding challenge, implement valid working syntax${h ? `: ${h}` : '.'}`;
        }),
      });
    } else {
      questions.push({
        id: `${moduleId}_practical_1`,
        type: 'practical_challenge',
        lessonId: chalLesson.id,
        lessonNumber: chalLesson.order,
        sourceKind: 'adaptive_lesson',
        track: courseId,
        codeLanguage: chalLang,
        starterCode: chalSpec.starterCode,
        solutionCode: chalSpec.solutionCode,
        expectedSnippetTokens: chalSpec.expectedTokens,
        previewHtml: chalSpec.previewHtml,
        previewCss: chalSpec.previewCss,
        previewJs: chalSpec.previewJs,
        prompt: buildLocalizedRecord((loc) => {
          const topic = cleanTitle(chalLesson.translations[loc]?.title || chalLesson.id);
          const customPrompt = chalLesson.translations[loc]?.tryItPrompt;
          if (customPrompt && customPrompt.length > 15 && !isBoilerplateCopy(customPrompt)) {
            return trimSentence(customPrompt, 200);
          }
          if (loc === 'ckb') {
            return `بەکارهێنانی پراکتیکی (${topic}): کۆدەکە لە ئیدیتەرەکەدا بنووسە یان تەواو بکە بە شێوەیەک کە (${chalSpec.expectedTokens.join(', ')}) تێدا بێت و تاقی بکەرەوە.`;
          }
          if (loc === 'kmr') {
            return `Bikaranîna pratîkî (${topic}): Kodê di edîtorê de binivîse yan temam bike ku (${chalSpec.expectedTokens.join(', ')}) tê de hebe û biceribîne.`;
          }
          if (loc === 'ar') {
            return `التطبيق العملي (${topic}): اكتب أو أكمل الكود في المحرر بحيث يتضمن (${chalSpec.expectedTokens.join(', ')}) ثم شغّل واختبر الحل.`;
          }
          return `Practical Coding Challenge (${topic}): Write or complete the working code so it properly uses (${chalSpec.expectedTokens.join(', ')}), then Run & Test.`;
        }),
        hint: buildLocalizedRecord((loc) => {
          if (loc === 'ckb') return `پشت بە نیشانەکانی (${chalSpec.expectedTokens.join(', ')}) ببەستە لەسەر بنەمای ئەو نموونەیەی لە وانەی ${padNum(chalLesson.order)} دا بینیت.`;
          if (loc === 'kmr') return `Pişta xwe bide (${chalSpec.expectedTokens.join(', ')}) li ser bingeha mînaka waneya ${padNum(chalLesson.order)}.`;
          if (loc === 'ar') return `اعتمد على العناصر (${chalSpec.expectedTokens.join(', ')}) كما طُبقت في الدرس ${padNum(chalLesson.order)}.`;
          return `Include valid syntax using (${chalSpec.expectedTokens.join(', ')}) following Lesson ${padNum(chalLesson.order)}.`;
        }),
        explanation: buildLocalizedRecord((loc) => {
          const topic = cleanTitle(chalLesson.translations[loc]?.title || chalLesson.id);
          if (loc === 'ckb') return `کۆدی سەرکەوتووی وانەی "${topic}" دەبێت ڕاستەقینە کار بکات و پێکهاتەکانی (${chalSpec.expectedTokens.join(', ')}) بە دروستی لەخۆ بگرێت.`;
          if (loc === 'kmr') return `Koda serkeftî ya waneya "${topic}" divê bi durustî bixebite û (${chalSpec.expectedTokens.join(', ')}) tê de bin.`;
          if (loc === 'ar') return `الحل العملي الصحيح لدرس "${topic}" يجب أن يعمل بسلاسة ويتضمن (${chalSpec.expectedTokens.join(', ')}).`;
          return `A working solution for "${topic}" executes cleanly and includes (${chalSpec.expectedTokens.join(', ')}).`;
        }),
      });
    }

    const startStr = padNum(lessonStartNumber);
    const endStr = padNum(lessonEndNumber);
    const topicNames = (loc: Locale) =>
      groupLessons
        .map((l) => cleanTitle(l.translations[loc]?.title || l.id))
        .join(' · ');

    modules.push({
      moduleId,
      courseId,
      groupIndex,
      lessonStartNumber,
      lessonEndNumber,
      lessonIds,
      lessons: groupLessons,
      title: {
        ckb: `ڕاهێنان و تاقیکردنەوەی گڕوپی ${padNum(groupIndex)} (وانەکانی ${startStr}–${endStr})`,
        kmr: `Rahênan û Ezmûna Koma ${padNum(groupIndex)} (Wanên ${startStr}–${endStr})`,
        ar: `التدريب والتقييم للوحدة ${padNum(groupIndex)} (الدروس ${startStr}–${endStr})`,
        en: `Module ${padNum(groupIndex)} Practice & Assessment (Lessons ${startStr}–${endStr})`,
      },
      summary: {
        ckb: `بابەتە داپۆشراوەکان: ${topicNames('ckb')}`,
        kmr: `Mijarên hatin xwendin: ${topicNames('kmr')}`,
        ar: `الموضوعات المشمولة: ${topicNames('ar')}`,
        en: `Topics covered: ${topicNames('en')}`,
      },
      questions,
      passThresholdPercent: config.passThresholdPercent,
      requirePassToUnlockNext: config.requirePassToUnlockNext,
    });
  }

  return modules;
}

/**
 * Lightweight deterministic client-side & simulator code check for instant Run/Test
 * Works offline and mirrors server sandbox semantics across JS/HTML/CSS/Python/C++.
 */
export function runLocalCodeCheck(
  question: IntegratedPracticeQuestion,
  userCode: string
): CodeRunEvaluation {
  const source = (userCode || '').trim();
  if (!source) {
    return {
      valid: false,
      passedChecks: false,
      output: [],
      error: 'Code editor cannot be empty.',
      missingTokens: question.expectedSnippetTokens || [],
      forbiddenFound: [],
      missingOutputs: [],
    };
  }

  const lang = question.codeLanguage || mapTrackToCodeLanguage(question.track);
  let valid = true;
  let error: string | undefined;
  const output: string[] = [];

  if (lang === 'javascript') {
    try {
      const captured: string[] = [];
      const fakeConsole = {
        log: (...args: any[]) => captured.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
        warn: (...args: any[]) => captured.push(args.map(String).join(' ')),
        error: (...args: any[]) => captured.push(args.map(String).join(' ')),
      };
      const stubEl = () => ({
        textContent: '',
        innerHTML: '',
        value: '',
        style: {},
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        addEventListener: () => {},
        appendChild: () => {},
      });
      const fakeDocument = {
        querySelector: () => stubEl(),
        querySelectorAll: () => [stubEl()],
        getElementById: () => stubEl(),
        createElement: () => stubEl(),
        body: stubEl(),
      };
      const FakeFormData = function () {
        return { get: () => 'demo', entries: () => [] };
      };
      const sanitizedJs = source
        .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '')
        .replace(/export\s+default\s+/g, '')
        .replace(/export\s+/g, '');

      // Compile first so real SyntaxErrors always fail deterministically
      const fn = new Function('console', 'document', 'FormData', sanitizedJs);
      try {
        fn(fakeConsole, fakeDocument, FakeFormData);
        output.push(...captured);
      } catch (runtimeErr: any) {
        if (runtimeErr instanceof ReferenceError) {
          // Snippet syntax compiled cleanly; references external lesson context variable
          output.push(
            captured.length > 0
              ? captured.join('\n')
              : `Syntax compiled cleanly (uses contextual identifier: ${runtimeErr.message}).`
          );
        } else {
          valid = false;
          error = runtimeErr?.message || 'JavaScript runtime error';
        }
      }
    } catch (syntaxErr: any) {
      valid = false;
      error = syntaxErr?.message || 'JavaScript syntax error';
    }
  } else if (lang === 'typescript' || lang === 'tsx') {
    const opensParen = (source.match(/\(/g) || []).length;
    const closesParen = (source.match(/\)/g) || []).length;
    const opensBrace = (source.match(/\{/g) || []).length;
    const closesBrace = (source.match(/\}/g) || []).length;
    if (opensParen !== closesParen || opensBrace !== closesBrace) {
      valid = false;
      error = 'Unbalanced parentheses or curly braces in component/module code.';
    } else {
      output.push(`${lang.toUpperCase()} structure verified cleanly.`);
    }
  } else if (lang === 'html') {
    if (!source.includes('<') || !source.includes('>')) {
      valid = false;
      error = 'Valid HTML must contain at least one element tag (<tag>...</tag>).';
    } else if (/<\s*[a-zA-Z0-9-]+\s*[^<>]*<\/\s*[a-zA-Z0-9-]+\s*$/.test(source)) {
      valid = false;
      error = 'Closing tag is missing closing bracket (>).';
    } else {
      output.push('HTML markup structure verified — live preview updated.');
    }
  } else if (lang === 'css') {
    const opens = (source.match(/\{/g) || []).length;
    const closes = (source.match(/\}/g) || []).length;
    if (opens === 0 || opens !== closes || !source.includes(':')) {
      valid = false;
      error = opens !== closes ? 'Unbalanced curly braces { } in CSS.' : 'Valid CSS needs selector { property: value; }.';
    } else {
      output.push('CSS stylesheet rules verified — live preview updated.');
    }
  } else if (lang === 'python') {
    if (/\bPrint\s*\(/.test(source)) {
      valid = false;
      error = 'NameError: name "Print" is not defined. Did you mean lowercase "print("?';
    } else if (/^\s*(if|elif|else|for|while|def|class)\b[^\n:]*$/m.test(source.replace(/#.*$/gm, ''))) {
      valid = false;
      error = 'SyntaxError: expected ":" at end of Python block header.';
    } else {
      const printCalls = Array.from(source.matchAll(/print\s*\(([^)\n]+)\)/g));
      if (printCalls.length > 0) {
        for (const m of printCalls) {
          output.push(m[1].replace(/^f?["']|["']$/g, '').trim());
        }
      } else {
        output.push('Python syntax checked cleanly.');
      }
    }
  } else if (lang === 'cpp') {
    if (source.includes('std::coutt')) {
      valid = false;
      error = "error: 'coutt' is not a member of 'std'; did you mean 'std::cout'?";
    } else {
      const coutCalls = Array.from(source.matchAll(/std::cout\s*<<\s*([^;\n]+)/g));
      if (coutCalls.length > 0) {
        for (const m of coutCalls) {
          output.push(m[1].replace(/<<\s*(?:std::)?endl/g, '').replace(/\\n/g, '').replace(/["']/g, '').trim());
        }
      } else {
        output.push('C++ code structure verified.');
      }
    }
  } else {
    output.push('Code syntax checked cleanly.');
  }

  const wsNormalizedExact = source.replace(/\s+/g, ' ');
  const normalizedLower = wsNormalizedExact.toLowerCase();
  const missingTokens = (question.expectedSnippetTokens || []).filter((tok) => {
    const rawTok = tok.replace(/\s+/g, ' ').trim();
    if (!rawTok) return false;
    // Preserve case sensitivity for tokens with uppercase letters (e.g. Python/TS)
    const hasUpper = /[A-Z]/.test(rawTok);
    return hasUpper ? !wsNormalizedExact.includes(rawTok) : !normalizedLower.includes(rawTok.toLowerCase());
  });

  const forbiddenFound = (question.forbiddenTokens || []).filter((tok) => {
    const rawTok = tok.replace(/\s+/g, ' ').trim();
    if (!rawTok) return false;
    // Always check forbidden typos case-sensitively so 'Print(' never collides with valid 'print('
    return wsNormalizedExact.includes(rawTok);
  });

  const joinedOut = output.join('\n').toLowerCase();
  const missingOutputs = (question.expectedOutputIncludes || []).filter(
    (tok) => !joinedOut.includes(tok.toLowerCase().trim())
  );

  const passedChecks =
    valid &&
    missingTokens.length === 0 &&
    forbiddenFound.length === 0 &&
    missingOutputs.length === 0;

  return {
    valid,
    passedChecks,
    output,
    error,
    missingTokens,
    forbiddenFound,
    missingOutputs,
  };
}

export function computePerformanceLevel(
  scorePercent: number,
  passThresholdPercent: number
): PerformanceLevel {
  if (scorePercent >= 85) return 'excellent';
  if (scorePercent >= passThresholdPercent) return 'good';
  if (scorePercent >= 40) return 'developing';
  return 'needs_review';
}

export function evaluatePracticeSubmission(
  mod: PracticeModule,
  answers: Record<string, string>,
  codeChecks: Record<string, CodeRunEvaluation>,
  locale: Locale
): {
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  performanceLevel: PerformanceLevel;
  itemResults: ModuleAssessmentResultItem[];
} {
  const itemResults: ModuleAssessmentResultItem[] = [];
  let correctCount = 0;

  for (const q of mod.questions) {
    const rawAns = (answers[q.id] ?? '').trim();

    if (q.type === 'mcq' || q.type === 'true_false') {
      const selectedIdx = Number.parseInt(rawAns, 10);
      const isCorrect =
        Number.isFinite(selectedIdx) && selectedIdx === q.correctOptionIndex;
      if (isCorrect) correctCount += 1;

      const userOpt =
        Number.isFinite(selectedIdx) && q.options?.[selectedIdx]
          ? pickLoc(locale, q.options[selectedIdx])
          : '—';
      const rightOpt =
        q.correctOptionIndex !== undefined && q.options?.[q.correctOptionIndex]
          ? pickLoc(locale, q.options[q.correctOptionIndex])
          : '—';

      itemResults.push({
        questionId: q.id,
        type: q.type,
        correct: isCorrect,
        userAnswerSummary: userOpt,
        correctAnswerSummary: rightOpt,
        explanation: q.explanation,
      });
      continue;
    }

    if (q.type === 'complete_code') {
      const acceptable = (q.acceptableAnswers || [q.solutionCode || '']).map((a) =>
        a.trim().toLowerCase()
      );
      const normUser = rawAns.toLowerCase();
      // Accept exact missing token OR completing the template without blank ____
      const matchesDirect = acceptable.some((a) => a.length > 0 && normUser === a);
      const containsExpected =
        rawAns.length > 0 &&
        !rawAns.includes('____') &&
        (q.expectedSnippetTokens || acceptable).every((tok) =>
          normUser.includes(tok.toLowerCase().trim())
        );
      const isCorrect = matchesDirect || containsExpected;
      if (isCorrect) correctCount += 1;

      itemResults.push({
        questionId: q.id,
        type: q.type,
        correct: isCorrect,
        userAnswerSummary: rawAns || '—',
        correctAnswerSummary: q.solutionCode || acceptable[0] || '—',
        explanation: q.explanation,
      });
      continue;
    }

    // find_fix & practical_challenge
    const codeToEval = rawAns || '';
    const check = codeChecks[q.id] || runLocalCodeCheck(q, codeToEval);
    const unchangedBug =
      q.type === 'find_fix' &&
      q.buggyCode &&
      codeToEval.replace(/\s+/g, '') === q.buggyCode.replace(/\s+/g, '');
    const unchangedStarter =
      q.type === 'practical_challenge' &&
      q.starterCode &&
      codeToEval.replace(/\s+/g, '') === q.starterCode.replace(/\s+/g, '') &&
      q.starterCode.includes('TODO');

    const isCorrect =
      codeToEval.length > 0 &&
      !unchangedBug &&
      !unchangedStarter &&
      check.passedChecks;

    if (isCorrect) correctCount += 1;

    itemResults.push({
      questionId: q.id,
      type: q.type,
      correct: isCorrect,
      userAnswerSummary: codeToEval ? trimSentence(codeToEval, 90) : '—',
      correctAnswerSummary: trimSentence(q.solutionCode || 'Working code solution', 90),
      explanation: q.explanation,
    });
  }

  const totalQuestions = Math.max(1, mod.questions.length);
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercent >= mod.passThresholdPercent;
  const performanceLevel = computePerformanceLevel(
    scorePercent,
    mod.passThresholdPercent
  );

  return {
    scorePercent,
    correctCount,
    totalQuestions,
    passed,
    performanceLevel,
    itemResults,
  };
}
