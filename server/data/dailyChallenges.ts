import type { DailyChallenge, ChampionRecord } from '../../apps/web/types/domain.ts';

export const INITIAL_DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'ch-largest-number',
    dateIso: '2026-11-23',
    track: 'js',
    functionName: 'findLargest',
    titles: {
      ckb: 'دۆزینەوەی گەورەترین ژمارە لەناو لیستێکدا',
      kmr: 'دیتنا مەزنترین ژمارە د ناڤ لیستەکێ دا',
      ar: 'إيجاد أكبر رقم في المصفوفة',
      en: 'Find the Largest Number in an Array',
    },
    descriptions: {
      ckb: 'فەنکشنێک بە ناوی `findLargest(numbers)` دروستبکە کە لیستێک لە ژمارە وەردەگرێت و گەورەترین ژمارەی ناو لیستەکە دەگەڕێنێتەوە.',
      kmr: 'فەنکشنەکێ ب ناڤێ `findLargest(numbers)` چێکە کو لیستەکا ژماران وەردگریت و مەزنترین ژمارە دزڤڕینیت.',
      ar: 'قم بإنشاء دالة باسم `findLargest(numbers)` تستقبل مصفوفة أرقام وتُرجع أكبر رقم فيها.',
      en: 'Write a function named `findLargest(numbers)` that takes an array of numbers and returns the largest number found.',
    },
    starterCode: `function findLargest(numbers) {
  // فۆرمولە و کۆدەکەت لێرە بنووسە
  // دەتوانیت لە ڕێگەی Math.max یان Loop ئەنجامی بدەیت
  
}
`,
    solutionCode: `function findLargest(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  return Math.max(...numbers);
}`,
    difficulty: 'easy',
    points: 50,
    hints: {
      ckb: [
        'دەتوانیت سوود لە Math.max(...numbers) وەربگریت.',
        'یان گۆڕاوێک دابنێ بە ناوی max و لە ڕێگەی for loop هەموو خانەکان بەراورد بکە.',
      ],
      kmr: [
        'دشێی مفا ژ Math.max(...numbers) وەربگری.',
      ],
      ar: [
        'يمكنك استخدام Math.max(...numbers) أو حلقة تكرار for.',
      ],
      en: [
        'You can use Math.max(...numbers) with the spread operator.',
        'Alternatively, initialize a max variable and iterate through the array.',
      ],
    },
    testCases: [
      {
        id: 'tc-1',
        inputDescription: '[1, 5, 2, 9, 3]',
        expectedOutput: '9',
        callExpression: 'findLargest([1, 5, 2, 9, 3])',
      },
      {
        id: 'tc-2',
        inputDescription: '[-10, -5, -2, -100]',
        expectedOutput: '-2',
        callExpression: 'findLargest([-10, -5, -2, -100])',
      },
      {
        id: 'tc-3',
        inputDescription: '[42]',
        expectedOutput: '42',
        callExpression: 'findLargest([42])',
      },
      {
        id: 'tc-4',
        inputDescription: '[100, 250, 80, 250]',
        expectedOutput: '250',
        callExpression: 'findLargest([100, 250, 80, 250])',
        isSecret: true,
      },
    ],
  },
  {
    id: 'ch-reverse-string',
    dateIso: '2026-11-24',
    track: 'js',
    functionName: 'reverseString',
    titles: {
      ckb: 'پێچەوانەکردنەوەی دەق (Reverse String)',
      kmr: 'پێچەوانەکرنا دەقی (Reverse String)',
      ar: 'عكس السلسلة النصية (Reverse String)',
      en: 'Reverse a String',
    },
    descriptions: {
      ckb: 'فەنکشنێک دروستبکە بە ناوی `reverseString(str)` کە دەقێک وەردەگرێت و پیتەکانی لە کۆتاییەوە بۆ سەرەتا دەگەڕێنێتەوە.',
      kmr: 'فەنکشنەکێ ب ناڤێ `reverseString(str)` چێکە کو پیتێن دەقی پێچەوانە دکەت.',
      ar: 'اكتب دالة باسم `reverseString(str)` تقوم بعكس حروف النص المعطى.',
      en: 'Write a function named `reverseString(str)` that takes a string and returns it reversed.',
    },
    starterCode: `function reverseString(str) {
  // کۆدەکەت لێرە بنووسە
  
}
`,
    solutionCode: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
    difficulty: 'easy',
    points: 50,
    hints: {
      ckb: [
        'دەتوانیت بە split("") دەقەکە بکەیتە لیست، پاشان reverse()، و بە join("") بەیەکەوەیان ببەستیتەوە.',
      ],
      kmr: ['مفای ژ split(""), reverse() و join("") وەربگرە.'],
      ar: ['استخدم الدوال split(\'\') ثم reverse() ثم join(\'\').'],
      en: ['Chain split(""), reverse(), and join("").'],
    },
    testCases: [
      {
        id: 'tc-rev-1',
        inputDescription: '"karejan"',
        expectedOutput: '"najerak"',
        callExpression: 'reverseString("karejan")',
      },
      {
        id: 'tc-rev-2',
        inputDescription: '"hello"',
        expectedOutput: '"olleh"',
        callExpression: 'reverseString("hello")',
      },
      {
        id: 'tc-rev-3',
        inputDescription: '"12345"',
        expectedOutput: '"54321"',
        callExpression: 'reverseString("12345")',
      },
    ],
  },
  {
    id: 'ch-sum-even',
    dateIso: '2026-11-25',
    track: 'js',
    functionName: 'sumEvenNumbers',
    titles: {
      ckb: 'کۆکردنەوەی ژمارە جووتەکان لە لیستدا',
      kmr: 'کۆمکرنا ژمارێن جووت د ناڤ لیستێ دا',
      ar: 'جمع الأرقام الزوجية في المصفوفة',
      en: 'Sum of Even Numbers in Array',
    },
    descriptions: {
      ckb: 'فەنکشنێک دروستبکە بە ناوی `sumEvenNumbers(numbers)` کە تەنها کۆی گشتی ژمارە جووتەکان هەژمار دەکات و دەری دەدات.',
      kmr: 'فەنکشنەکێ ب ناڤێ `sumEvenNumbers(numbers)` چێکە کو بتنێ ژمارێن جووت کۆم دکەت.',
      ar: 'قم بإنشاء دالة باسم `sumEvenNumbers(numbers)` تقوم بجمع الأرقام الزوجية فقط.',
      en: 'Write a function named `sumEvenNumbers(numbers)` that calculates and returns the sum of all even numbers.',
    },
    starterCode: `function sumEvenNumbers(numbers) {
  // ژمارەی جووت بە (n % 2 === 0) دەناسرێتەوە
  
}
`,
    solutionCode: `function sumEvenNumbers(numbers) {
  return numbers.filter(n => n % 2 === 0).reduce((sum, n) => sum + n, 0);
}`,
    difficulty: 'easy',
    points: 60,
    hints: {
      ckb: ['بە filter(n => n % 2 === 0) ژمارە جووتەکان جیا بکەرەوە پاشان کۆیان بکەرەوە.'],
      kmr: ['ب رێکا مۆدیولۆ % 2 ژمارێن جووت جودا بکە.'],
      ar: ['استخدم المعامل % للتحقق من الأعداد الزوجية ثم اجمعها.'],
      en: ['Use modulo % 2 === 0 to find even numbers, then sum them up.'],
    },
    testCases: [
      {
        id: 'tc-sum-1',
        inputDescription: '[1, 2, 3, 4, 5, 6]',
        expectedOutput: '12',
        callExpression: 'sumEvenNumbers([1, 2, 3, 4, 5, 6])',
      },
      {
        id: 'tc-sum-2',
        inputDescription: '[1, 3, 5, 7]',
        expectedOutput: '0',
        callExpression: 'sumEvenNumbers([1, 3, 5, 7])',
      },
      {
        id: 'tc-sum-3',
        inputDescription: '[10, 20, 30]',
        expectedOutput: '60',
        callExpression: 'sumEvenNumbers([10, 20, 30])',
      },
    ],
  },
  {
    id: 'ch-palindrome',
    dateIso: '2026-11-26',
    track: 'js',
    functionName: 'isPalindrome',
    titles: {
      ckb: 'پشکنینی دەقی هاوشێوە لە هەردوو لاوە (Palindrome)',
      kmr: 'پشکنینا پەیڤا وەکهەڤ ژ هەردوو ئالیان (Palindrome)',
      ar: 'التحقق من الكلمة المتناظرة (Palindrome)',
      en: 'Check Palindrome Word',
    },
    descriptions: {
      ckb: 'فەنکشنێک بنووسە بە ناوی `isPalindrome(str)` کە بپشکنێت ئایا دەقەکە لە سەرەتاوە و لە کۆتاییەوە وەک یەک دەخوێندرێتەوە (وەک radar) و true یان false بگەڕێنێتەوە.',
      kmr: 'فەنکشنەکێ ب ناڤێ `isPalindrome(str)` بنڤیسە کو بپشکنیت ئەرێ پەیڤ ژ هەردوو ئالیان وەکهەڤە.',
      ar: 'اكتب دالة باسم `isPalindrome(str)` تتحقق إذا كانت الكلمة تُقرأ من اليمين لليسار بنفس الطريقة.',
      en: 'Write a function named `isPalindrome(str)` that checks whether a word reads the same forwards and backwards.',
    },
    starterCode: `function isPalindrome(str) {
  // true بگەڕێنەوە ئەگەر هەمان شت بوو لە هەردوو لاوە
  
}
`,
    solutionCode: `function isPalindrome(str) {
  const clean = str.toLowerCase();
  return clean === clean.split('').reverse().join('');
}`,
    difficulty: 'easy',
    points: 60,
    hints: {
      ckb: ['دەقەکە پێچەوانە بکەرەوە و بەراوردی بکە لەگەڵ دەقی ئەسڵی.'],
      kmr: ['پەیڤێ پێچەوانە بکە و بەراورد بکە دگەل یا سەرەکی.'],
      ar: ['قارن النص الأصلي مع نسخته المعكوسة.'],
      en: ['Compare the original lowercase string with its reversed version.'],
    },
    testCases: [
      {
        id: 'tc-pal-1',
        inputDescription: '"radar"',
        expectedOutput: 'true',
        callExpression: 'isPalindrome("radar")',
      },
      {
        id: 'tc-pal-2',
        inputDescription: '"karejan"',
        expectedOutput: 'false',
        callExpression: 'isPalindrome("karejan")',
      },
      {
        id: 'tc-pal-3',
        inputDescription: '"level"',
        expectedOutput: 'true',
        callExpression: 'isPalindrome("level")',
      },
    ],
  },
];

// In-memory runtime state for daily challenges & champions
export let currentActiveChallengeId: string = INITIAL_DAILY_CHALLENGES[0].id;
export const customChallenges = new Map<string, DailyChallenge>();

// Date string (YYYY-MM-DD) -> Array of ChampionRecord
export const dailyChampionsRegistry = new Map<string, ChampionRecord[]>();

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentDailyChallenge(): DailyChallenge {
  if (customChallenges.has(currentActiveChallengeId)) {
    return customChallenges.get(currentActiveChallengeId)!;
  }
  const found = INITIAL_DAILY_CHALLENGES.find((c) => c.id === currentActiveChallengeId);
  if (found) return found;

  // Rotation fallback based on calendar day
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const idx = Math.abs(dayOfYear) % INITIAL_DAILY_CHALLENGES.length;
  return INITIAL_DAILY_CHALLENGES[idx];
}

export function setCurrentDailyChallengeId(id: string): boolean {
  if (customChallenges.has(id) || INITIAL_DAILY_CHALLENGES.some((c) => c.id === id)) {
    currentActiveChallengeId = id;
    return true;
  }
  return false;
}

export function registerChampion(record: Omit<ChampionRecord, 'rank'>): ChampionRecord {
  const dateKey = getTodayDateString();
  const list = dailyChampionsRegistry.get(dateKey) || [];

  // Check if user already solved it today
  const existingIdx = list.findIndex((c) => c.uid === record.uid && c.challengeId === record.challengeId);
  if (existingIdx !== -1) {
    return { ...list[existingIdx], rank: existingIdx + 1 };
  }

  const newRecord: ChampionRecord = {
    ...record,
    rank: list.length + 1,
  };
  list.push(newRecord);
  dailyChampionsRegistry.set(dateKey, list);
  return newRecord;
}

export function getTodayChampions(challengeId?: string): ChampionRecord[] {
  const dateKey = getTodayDateString();
  const list = dailyChampionsRegistry.get(dateKey) || [];
  if (challengeId) {
    return list.filter((c) => c.challengeId === challengeId);
  }
  return list;
}
