import type { DailyChallenge, ChampionRecord } from '../types/domain';

export const CLIENT_DAILY_CHALLENGES: DailyChallenge[] = [
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
      ckb: 'فەنکشنێک دروستبکە بە ناوی `findLargest(numbers)` کە لیستێک لە ژمارە وەردەگرێت و گەورەترین ژمارەی ناو لیستەکە دەگەڕێنێتەوە.',
      kmr: 'فەنکشنەکێ ب ناڤێ `findLargest(numbers)` چێکە کو لیستەکا ژماران وەردگریت و مەزنترین ژمارە دزڤڕینیت.',
      ar: 'قم بإنشاء دالة باسم `findLargest(numbers)` تستقبل مصفوفة أرقام وتُرجع أكبر رقم فيها.',
      en: 'Write a function named `findLargest(numbers)` that takes an array of numbers and returns the largest number found.',
    },
    starterCode: `function findLargest(numbers) {
  // فەنکشنێک دروستبکە کە گەورەترین ژمارە لەناو لیستێکدا بدۆزێتەوە
  // کۆدەکەت لێرە بنووسە:
  
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
        'دەتوانیت سوود لە ڕێگەی ئاسانی Math.max(...numbers) وەربگریت.',
        'یان دەتوانیت گۆڕاوێکی سەرەتایی دابنێیت: let max = numbers[0] و لە ڕێگەی loop بەراوردی بکەیت.',
      ],
      kmr: [
        'دشێی مفای ژ Math.max(...numbers) وەربگری.',
        'یان ب ڕێکا for loop بەراورد بکە.',
      ],
      ar: [
        'يمكنك استخدام Math.max(...numbers) بكل بساطة.',
        'أو تكرار عناصر المصفوفة عبر حلقة for وتحديث المتغير الأكبر.',
      ],
      en: [
        'You can use Math.max(...numbers) with the spread operator.',
        'Or initialize let max = numbers[0] and iterate through the array.',
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
  // کۆدەکەت لێرە بنووسە:
  
}
`,
    solutionCode: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
    difficulty: 'easy',
    points: 40,
    hints: {
      ckb: [
        'دەتوانیت دەقەکە بکەیتە لیست بە .split("")، پاشان .reverse() و پاشان .join("").',
      ],
      kmr: [
        'دشێی بکاربینی: str.split("").reverse().join("").',
      ],
      ar: [
        'استخدم ترکیبة التوابع: split ثم reverse ثم join.',
      ],
      en: [
        'Use str.split("").reverse().join("").',
      ],
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
        inputDescription: '"kurdistan"',
        expectedOutput: '"natsidruk"',
        callExpression: 'reverseString("kurdistan")',
      },
    ],
  },
  {
    id: 'ch-sum-even',
    dateIso: '2026-11-25',
    track: 'js',
    functionName: 'sumEvenNumbers',
    titles: {
      ckb: 'کۆکردنەوەی ژمارە جووتەکان (Sum Even Numbers)',
      kmr: 'کۆمکرنا ژمارێن جووت (Sum Even Numbers)',
      ar: 'مجموع الأرقام الزوجية (Sum Even Numbers)',
      en: 'Sum of Even Numbers',
    },
    descriptions: {
      ckb: 'فەنکشنێک بە ناوی `sumEvenNumbers(numbers)` دروستبکە کە تەنها ژمارە جووتەکانی ناو لیستەکە کۆدەکاتەوە.',
      kmr: 'فەنکشنەکێ ب ناڤێ `sumEvenNumbers(numbers)` چێکە کو بتنێ ژمارێن جووت کۆم دکەت.',
      ar: 'اكتب دالة باسم `sumEvenNumbers(numbers)` تجمع فقط الأرقام الزوجية في القائمة.',
      en: 'Write a function named `sumEvenNumbers(numbers)` that calculates the sum of all even numbers in the array.',
    },
    starterCode: `function sumEvenNumbers(numbers) {
  // کۆکردنەوەی تەنها ژمارە جووتەکان:
  
}
`,
    solutionCode: `function sumEvenNumbers(numbers) {
  return numbers.filter(n => n % 2 === 0).reduce((acc, curr) => acc + curr, 0);
}`,
    difficulty: 'medium',
    points: 75,
    hints: {
      ckb: ['بۆ پشکنینی ژمارەی جووت سەیری بکە ئایا n % 2 === 0 یە.'],
      kmr: ['بۆ ژمارێن جووت بکاربینە: n % 2 === 0.'],
      ar: ['الرقم الزوجي يقبل القسمة على 2 بدون باقي: n % 2 === 0.'],
      en: ['Check if a number is even with n % 2 === 0.'],
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
  // true بگەڕێنەوە ئەگەر وەک یەک بوو لە هەردوو لاوە
  
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

export const INITIAL_FALLBACK_CHAMPIONS: ChampionRecord[] = [
  {
    id: 'champ-seed-1',
    uid: 'hero-1',
    displayName: 'ئارا کاروان (Ara Karwan)',
    solvedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    challengeId: 'ch-largest-number',
    executionTimeMs: 4,
    rank: 1,
  },
  {
    id: 'champ-seed-2',
    uid: 'hero-2',
    displayName: 'لاڤین ئازاد (Lavin Azad)',
    solvedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    challengeId: 'ch-largest-number',
    executionTimeMs: 7,
    rank: 2,
  },
  {
    id: 'champ-seed-3',
    uid: 'hero-3',
    displayName: 'دیار هۆشمەند (Diyar Hoshmand)',
    solvedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    challengeId: 'ch-largest-number',
    executionTimeMs: 11,
    rank: 3,
  },
];
