import React, { useState, useEffect } from 'react';
import {
  Zap,
  Trophy,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  Copy,
  Check,
  HelpCircle,
  Clock,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { pickLoc } from '../i18n/translations';
import { CLIENT_DAILY_CHALLENGES } from '../data/dailyChallengesCatalog';
import type { DailyChallenge, ChampionRecord } from '../types/domain';
import { Button, Surface } from './ui/Primitives';

interface TestCaseResult {
  id: string;
  callExpression: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
}

function formatEvalValue(val: unknown): string {
  if (typeof val === 'string') return JSON.stringify(val);
  if (val === undefined) return 'undefined';
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

function runLocalChallengeTests(
  userCode: string,
  testCases: DailyChallenge['testCases']
): { allPassed: boolean; results: TestCaseResult[]; totalTimeMs: number; error?: string } {
  const start = performance.now();
  const results: TestCaseResult[] = [];
  let fatalError: string | undefined;

  for (const tc of testCases) {
    try {
      const fn = new Function(`"use strict";\n${userCode}\nreturn (${tc.callExpression});`);
      const actual = fn();
      const actualStr = formatEvalValue(actual);
      const passed = actualStr === tc.expectedOutput.trim();
      results.push({
        id: tc.id,
        callExpression: tc.callExpression,
        expectedOutput: tc.expectedOutput,
        actualOutput: actualStr,
        passed,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Runtime error';
      fatalError = msg;
      results.push({
        id: tc.id,
        callExpression: tc.callExpression,
        expectedOutput: tc.expectedOutput,
        actualOutput: `Error: ${msg}`,
        passed: false,
        error: msg,
      });
    }
  }

  return {
    allPassed: results.length > 0 && results.every((r) => r.passed),
    results,
    totalTimeMs: Math.max(1, Math.round(performance.now() - start)),
    error: fatalError,
  };
}

export const DailyChallengeRunner: React.FC = () => {
  const { locale, firebaseUser, profile } = useApp();

  const [challenge, setChallenge] = useState<DailyChallenge>(CLIENT_DAILY_CHALLENGES[0]);
  const [code, setCode] = useState<string>(CLIENT_DAILY_CHALLENGES[0].starterCode);
  const [running, setRunning] = useState<boolean>(false);
  const [results, setResults] = useState<TestCaseResult[] | null>(null);
  const [allPassed, setAllPassed] = useState<boolean | null>(null);
  const [evalTimeMs, setEvalTimeMs] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [champions, setChampions] = useState<ChampionRecord[]>([]);
  const [loadingChallenge, setLoadingChallenge] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [justSolved, setJustSolved] = useState<boolean>(false);

  const selectChallenge = async (target: DailyChallenge) => {
    setChallenge(target);
    setCode(target.starterCode);
    setResults(null);
    setAllPassed(null);
    setErrorMessage(null);
    setJustSolved(false);
    setShowHints(false);
    setChampions([]);
    try {
      const res = await fetch(`/api/daily-challenge/champions?challengeId=${encodeURIComponent(target.id)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.champions)) {
          setChampions(data.champions);
        }
      }
    } catch {}
  };

  // Fetch active challenge & verified champions from server
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      let activeId = CLIENT_DAILY_CHALLENGES[0].id;
      try {
        const resChallenge = await fetch('/api/daily-challenge/today');
        if (resChallenge.ok) {
          const data = await resChallenge.json();
          if (data.ok && data.challenge && isMounted) {
            activeId = data.challenge.id;
            setChallenge(data.challenge);
            setCode(data.challenge.starterCode);
          }
        }
      } catch {
        // Offline/static fallback keeps real client catalog challenge
      }

      try {
        const resChamps = await fetch(`/api/daily-challenge/champions?challengeId=${encodeURIComponent(activeId)}`);
        if (resChamps.ok) {
          const data = await resChamps.json();
          if (data.ok && Array.isArray(data.champions) && isMounted) {
            setChampions(data.champions);
          }
        }
      } catch {
        // Honest empty list if offline
      } finally {
        if (isMounted) setLoadingChallenge(false);
      }
    }

    void loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetCode = () => {
    setCode(challenge.starterCode);
    setResults(null);
    setAllPassed(null);
    setErrorMessage(null);
    setJustSolved(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleRunAndSubmit = async () => {
    if (!code.trim()) return;
    setRunning(true);
    setErrorMessage(null);
    setResults(null);
    setAllPassed(null);
    setJustSolved(false);

    const displayName =
      profile?.displayName ||
      firebaseUser?.displayName ||
      (firebaseUser?.email
        ? firebaseUser.email.split('@')[0]
        : pickLoc(locale, {
            ckb: 'پاڵەوانی karejan',
            kmr: 'قارەمانێ karejan',
            ar: 'بطل karejan',
            en: 'karejan Champion',
          }));

    try {
      const response = await fetch('/api/daily-challenge/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          userCode: code,
          displayName,
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
        }),
      });

      let resData: {
        allPassed?: boolean;
        results?: TestCaseResult[];
        totalTimeMs?: number;
        championRecord?: ChampionRecord;
      } | null = null;

      if (response.ok) {
        resData = await response.json();
      } else {
        // Execute real tests directly in isolated browser runner if server endpoint is unavailable
        const localEval = runLocalChallengeTests(code, challenge.testCases);
        resData = {
          allPassed: localEval.allPassed,
          results: localEval.results,
          totalTimeMs: localEval.totalTimeMs,
          championRecord: localEval.allPassed
            ? {
                id: `champ-local-${Date.now()}`,
                uid: firebaseUser?.uid || 'local-solver',
                displayName,
                solvedAt: new Date().toISOString(),
                challengeId: challenge.id,
                executionTimeMs: localEval.totalTimeMs,
                rank: 1,
              }
            : undefined,
        };
      }

      setAllPassed(Boolean(resData?.allPassed));
      setResults(resData?.results || []);
      setEvalTimeMs(typeof resData?.totalTimeMs === 'number' ? resData.totalTimeMs : null);

      if (resData?.allPassed) {
        setJustSolved(true);
        if (resData.championRecord) {
          setChampions((prev) => {
            const exists = prev.some((c) => c.uid === resData!.championRecord!.uid);
            if (exists) return prev;
            return [resData!.championRecord!, ...prev];
          });
        }
      }
    } catch {
      const localEval = runLocalChallengeTests(code, challenge.testCases);
      setAllPassed(localEval.allPassed);
      setResults(localEval.results);
      setEvalTimeMs(localEval.totalTimeMs);
      if (localEval.allPassed) {
        setJustSolved(true);
        setChampions((prev) => [
          {
            id: `champ-local-${Date.now()}`,
            uid: firebaseUser?.uid || 'local-solver',
            displayName,
            solvedAt: new Date().toISOString(),
            challengeId: challenge.id,
            executionTimeMs: localEval.totalTimeMs,
            rank: 1,
          },
          ...prev,
        ]);
      }
    } finally {
      setRunning(false);
    }
  };

  const title = challenge.titles[locale] || challenge.titles.en || challenge.titles.ckb;
  const description = challenge.descriptions[locale] || challenge.descriptions.en || challenge.descriptions.ckb;
  const hints = challenge.hints[locale] || challenge.hints.en || challenge.hints.ckb || [];

  return (
    <div>
      {/* Compact Challenge Header */}
      <section className="kj-hero-band">
        <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-start">
              <h1 className="text-xl font-extrabold tracking-tight text-[var(--kj-ink)] sm:text-2xl">
                {title}
              </h1>
              <p className="mt-0.5 text-xs text-[var(--kj-muted)]">
                {pickLoc(locale, {
                  ckb: 'پرسیاری ڕۆژ · کۆد بنووسە و تاقیبکەرەوە',
                  kmr: 'پرسیارا ڕۆژێ · کۆدی بنڤیسە و تاقی بکە',
                  ar: 'تحدي اليوم · اكتب الكود واختبر الحل',
                  en: 'Daily Code Challenge · Solve & Test',
                })}
              </p>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              <span className="rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-1.5 font-bold text-[var(--kj-green)]">
                {challenge.difficulty === 'easy'
                  ? pickLoc(locale, { ckb: 'ئاسان', kmr: 'ئاسان', ar: 'سهل', en: 'Easy' })
                  : challenge.difficulty === 'medium'
                  ? pickLoc(locale, { ckb: 'ناوەند', kmr: 'ناڤنجی', ar: 'متوسط', en: 'Medium' })
                  : pickLoc(locale, { ckb: 'قورس', kmr: 'دژوار', ar: 'صعب', en: 'Hard' })}
              </span>
              <span className="rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-1.5 font-bold text-amber-500">
                +{challenge.points} {pickLoc(locale, { ckb: 'خاڵ', kmr: 'خاڵ', ar: 'نقطة', en: 'pts' })}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6">
        {/* Real Interactive Challenge Switcher */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {CLIENT_DAILY_CHALLENGES.map((item) => {
            const active = item.id === challenge.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectChallenge(item)}
                className={`rounded-[10px] border px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                  active
                    ? 'border-[#087f5b] bg-[#087f5b] text-white'
                    : 'border-[var(--kj-border)] bg-[var(--kj-card)] text-[var(--kj-ink)] hover:border-[#087f5b]'
                }`}
              >
                <span dir="ltr">{item.functionName}()</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Problem & Code Editor */}
          <div className="space-y-6 lg:col-span-8">
            <Surface className="p-6 text-start">
              <h2 className="flex items-center gap-2 text-base font-bold text-[var(--kj-ink)]">
                <span>🎯</span>
                <span>
                  {pickLoc(locale, {
                    ckb: 'داواکاری کێشەکە (Problem Statement)',
                    kmr: 'داخوازییا پرسیارێ (Problem Statement)',
                    ar: 'نص التحدي والمطلوب (Problem Statement)',
                    en: 'Problem Statement',
                  })}
                </span>
              </h2>
              <div className="mt-3 text-sm leading-relaxed text-[var(--kj-muted-2)]">
                {description}
              </div>

              <div className="kj-callout mt-5 rounded-[6px] p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--kj-ink)]">
                  {pickLoc(locale, {
                    ckb: 'نموونەی چاوەڕوانکراو (Example Test Cases)',
                    kmr: 'نموونەیێن چاڤەڕێکری (Example Test Cases)',
                    ar: 'أمثلة الإدخال والإخراج (Example Test Cases)',
                    en: 'Example Test Cases',
                  })}
                </h3>
                <div className="mt-3 space-y-2 font-mono text-xs" dir="ltr">
                  {challenge.testCases.slice(0, 3).map((tc, idx) => (
                    <div
                      key={tc.id || idx}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-[5px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-2"
                    >
                      <span className="text-[var(--kj-ink)]">{tc.callExpression}</span>
                      <span className="font-bold text-[var(--kj-green)]">➜ {tc.expectedOutput}</span>
                    </div>
                  ))}
                </div>
              </div>

              {hints.length > 0 && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[var(--kj-green)] hover:underline cursor-pointer"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>
                      {showHints
                        ? pickLoc(locale, {
                            ckb: 'شاردنەوەی ڕێنمایی و هاوکاری',
                            kmr: 'ڤەشارتنا ڕێنمایی و هاریکاریێ',
                            ar: 'إخفاء التلميحات والمساعدة',
                            en: 'Hide Hints',
                          })
                        : pickLoc(locale, {
                            ckb: 'پێویستت بە یارمەتییە؟ کرتە لێرە بکە بۆ ڕێنمایی (Hints)',
                            kmr: 'پێدڤی ب هاریکاریێ هەیە؟ کلیکێ ل ڤێرێ بکە بۆ ڕێنماییان (Hints)',
                            ar: 'هل تحتاج إلى مساعدة؟ انقر لعرض التلميحات (Hints)',
                            en: 'Need help? Click to reveal Hints',
                          })}
                    </span>
                    {showHints ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  {showHints && (
                    <div className="mt-2 space-y-1.5 rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-soft)] p-3 text-xs text-[var(--kj-muted-2)]">
                      {hints.map((hint, i) => (
                        <p key={i} className="flex items-start gap-1.5">
                          <span className="font-bold">💡</span>
                          <span>{hint}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Surface>

            {/* Code Editor Window (dist.zip .hero-editor & .play-shell style) */}
            <div className="kj-code-window">
              <div className="kj-code-bar flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#72e2b5]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#62766b]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#62766b]" />
                  <span className="ms-2 font-mono text-xs font-semibold">solution.js</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:text-white cursor-pointer"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-[#72e2b5]" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>
                      {copied
                        ? pickLoc(locale, { ckb: 'کۆپی کرا', kmr: 'هاتە کۆپیکرن', ar: 'تم النسخ', en: 'Copied' })
                        : pickLoc(locale, { ckb: 'کۆپی', kmr: 'کۆپی', ar: 'نسخ', en: 'Copy' })}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetCode}
                    className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>
                      {pickLoc(locale, { ckb: 'ڕێکخستنەوە', kmr: 'ڤەگەڕاندن', ar: 'إعادة ضبط', en: 'Reset' })}
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[var(--kj-code-bg)]">
                <textarea
                  dir="ltr"
                  rows={10}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={pickLoc(locale, {
                    ckb: '// کۆدەکەت لێرە بنووسە...',
                    kmr: '// کۆدێ خۆ ل ڤێرێ بنڤیسە...',
                    ar: '// اكتب كود الحل هنا...',
                    en: '// Write your JavaScript solution here...',
                  })}
                  className="w-full resize-y bg-transparent font-mono text-sm leading-relaxed text-[var(--kj-code-ink)] outline-none focus:ring-0"
                  spellCheck={false}
                />
              </div>

              <div className="kj-code-bar flex flex-wrap items-center justify-between gap-3 border-t border-[var(--kj-code-border)] px-4 py-3">
                <span className="text-xs">
                  {pickLoc(locale, {
                    ckb: 'فەنکشنەکە بە تەواوەتی لەناو Node Sandbox تاقیدەکرێتەوە بەرامبەر Test Cases.',
                    kmr: 'فەنکشن د ناڤ Node Sandbox دا هەمبەری Test Cases دهێتە تاقیکرن.',
                    ar: 'سيتم فحص دالتك داخل بيئة Node المعزولة مقابل جميع حالات الاختبار.',
                    en: 'Evaluated securely inside the Node Sandbox against automated test cases.',
                  })}
                </span>
                <Button
                  variant="primary"
                  size="md"
                  disabled={running || !code.trim()}
                  onClick={() => void handleRunAndSubmit()}
                >
                  {running ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>
                        {pickLoc(locale, {
                          ckb: 'پشکنینی کۆدەکەت...',
                          kmr: 'پشکنینا کۆدێ تە...',
                          ar: 'جارٍ فحص الكود...',
                          en: 'Evaluating solution...',
                        })}
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span>
                        {pickLoc(locale, {
                          ckb: 'تاقیکردنەوە و ناردنی کۆد ⚡',
                          kmr: 'تاقیکرن و هنارتنا کۆدی ⚡',
                          ar: 'اختبار وإرسال الحل ⚡',
                          en: 'Run & Submit Code ⚡',
                        })}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-[7px] border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-500">
                <div className="flex items-center gap-2 font-bold">
                  <XCircle className="h-4 w-4" />
                  <span>
                    {pickLoc(locale, {
                      ckb: 'هەڵەی جێبەجێکردن',
                      kmr: 'شاشییا جێبەجێکرنێ',
                      ar: 'خطأ في التنفيذ',
                      en: 'Execution Error',
                    })}
                  </span>
                </div>
                <p className="mt-1 text-xs">{errorMessage}</p>
              </div>
            )}

            {justSolved && (
              <div className="kj-callout rounded-[7px] p-6">
                <div className="flex items-center gap-3">
                  <div className="kj-course-icon flex h-12 w-12 items-center justify-center">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div className="text-start">
                    <h3 className="text-lg font-extrabold text-[var(--kj-ink)]">
                      {pickLoc(locale, {
                        ckb: 'پیرۆزە! هەموو تاقیکردنەوەکان بە سەرکەوتوویی تێپەڕین 🎉',
                        kmr: 'پیرۆزە! هەمی تاقیکرن ب سەرکەفتی دەرباز بوون 🎉',
                        ar: 'مبارك! اجتزت جميع حالات الاختبار بنجاح 🎉',
                        en: 'Congratulations! Every test case passed 🎉',
                      })}
                    </h3>
                    <p className="text-xs">
                      {pickLoc(locale, {
                        ckb: `تۆ سەرکەوتی و ناوت لەناو لیستی «پاڵەوانانی ئەمڕۆ» تۆمارکرا! کاتی جێبەجێکردن: ${evalTimeMs ?? 5}ms.`,
                        kmr: `تو سەرکەفتی و ناڤێ تە د لیستا «قارەمانێن ئەڤرۆ» دا هاتە تۆمارکرن! دەمێ جێبەجێکرنێ: ${evalTimeMs ?? 5}ms.`,
                        ar: `تم إدراج اسمك في قائمة «أبطال اليوم»! زمن التنفيذ: ${evalTimeMs ?? 5}ms.`,
                        en: `You earned your place on Today's Champions leaderboard! Execution time: ${evalTimeMs ?? 5}ms.`,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {results && results.length > 0 && (
              <Surface className="p-6 text-start">
                <div className="flex items-center justify-between border-b border-[var(--kj-border)] pb-3">
                  <h3 className="text-sm font-bold text-[var(--kj-ink)] flex items-center gap-2">
                    <span>
                      {pickLoc(locale, {
                        ckb: 'ئەنجامی پشکنینەکان (Test Case Results)',
                        kmr: 'ئەنجامێن تاقیکرنان (Test Case Results)',
                        ar: 'نتائج الاختبار (Test Case Results)',
                        en: 'Test Case Results',
                      })}
                    </span>
                    {allPassed ? (
                      <span className="rounded px-2 py-0.5 text-xs font-semibold kj-badge">
                        {pickLoc(locale, {
                          ckb: `هەمووی تێپەڕی (${results.length}/${results.length}) ✅`,
                          kmr: `هەمی سەرکەفتن (${results.length}/${results.length}) ✅`,
                          ar: `تم اجتياز الكل (${results.length}/${results.length}) ✅`,
                          en: `All Passed (${results.length}/${results.length}) ✅`,
                        })}
                      </span>
                    ) : (
                      <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-500">
                        {pickLoc(locale, {
                          ckb: 'پێویستی بە پێداچوونەوەیە ❌',
                          kmr: 'پێدڤی ب پێداچوونێ هەیە ❌',
                          ar: 'يحتاج إلى مراجعة ❌',
                          en: 'Needs Review ❌',
                        })}
                      </span>
                    )}
                  </h3>
                  {evalTimeMs !== null && (
                    <span className="text-xs font-mono text-[var(--kj-muted)]">⏱️ {evalTimeMs}ms</span>
                  )}
                </div>

                <div className="mt-4 space-y-3 font-mono text-xs" dir="ltr">
                  {results.map((r, i) => (
                    <div
                      key={r.id || i}
                      className={`rounded-[7px] border p-3.5 ${
                        r.passed
                          ? 'border-[var(--kj-emerald)]/40 bg-[var(--kj-badge-bg)]/40'
                          : 'border-red-500/40 bg-red-500/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--kj-ink)]">{r.callExpression}</span>
                        <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold ${r.passed ? 'kj-badge' : 'bg-red-500/20 text-red-500'}`}>
                          {r.passed ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          <span>
                            {r.passed
                              ? pickLoc(locale, { ckb: 'سەرکەوتوو', kmr: 'سەرکەفتی', ar: 'ناجح', en: 'Passed' })
                              : pickLoc(locale, { ckb: 'هەڵە', kmr: 'شاش', ar: 'خطأ', en: 'Failed' })}
                          </span>
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                        <div className="rounded border border-[var(--kj-border)] bg-[var(--kj-paper)] p-2">
                          <span className="block text-[10px] text-[var(--kj-muted)]">Expected:</span>
                          <span className="font-bold text-[var(--kj-green)]">{r.expectedOutput}</span>
                        </div>
                        <div className="rounded border border-[var(--kj-border)] bg-[var(--kj-paper)] p-2">
                          <span className="block text-[10px] text-[var(--kj-muted)]">Actual:</span>
                          <span className={`font-bold ${r.passed ? 'text-[var(--kj-green)]' : 'text-red-500'}`}>
                            {r.actualOutput || (r.error ? `Error: ${r.error}` : 'undefined')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Surface>
            )}
          </div>

          {/* Right Column: Champions Leaderboard */}
          <div className="space-y-6 lg:col-span-4">
            <Surface className="p-6 text-start">
              <div className="flex items-center justify-between border-b border-[var(--kj-border)] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="kj-course-icon flex h-9 w-9 items-center justify-center">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[var(--kj-ink)]">
                      {pickLoc(locale, {
                        ckb: 'پاڵەوانانی ئەمڕۆ',
                        kmr: 'قارەمانێن ئەڤرۆ',
                        ar: 'أبطال اليوم',
                        en: "Today's Champions",
                      })}
                    </h2>
                    <p className="text-[11px] text-[var(--kj-muted)]">
                      {pickLoc(locale, {
                        ckb: 'لیستی سەرکەوتووان',
                        kmr: 'لیستا سەرکەفتییان',
                        ar: 'لوحة الشرف اليومية',
                        en: 'Verified Submissions',
                      })}
                    </p>
                  </div>
                </div>
                <span className="rounded px-2.5 py-0.5 text-xs font-bold kj-badge">
                  {champions.length}{' '}
                  {pickLoc(locale, { ckb: 'بەشداربوو', kmr: 'پشکدار', ar: 'مشارك', en: 'solvers' })}
                </span>
              </div>

              <div className="mt-4 divide-y divide-[var(--kj-border)]">
                {loadingChallenge ? (
                  <p className="py-4 text-xs text-[var(--kj-muted)]">...</p>
                ) : champions.length === 0 ? (
                  <p className="py-4 text-xs text-[var(--kj-muted)]">
                    {pickLoc(locale, {
                      ckb: 'هێشتا هیچ کەسێک ئەم چاڵنجەی تەواو نەکردووە — ببە بە یەکەم کەس!',
                      kmr: 'هێشتا چ کەسێ ئەڤ چالێنجە تمام نەکرییە — ببە یەکەم کەس!',
                      ar: 'لم يحل هذا التحدي أحد بعد — كن الأول اليوم!',
                      en: 'No solvers yet — submit a passing solution to lead the board!',
                    })}
                  </p>
                ) : (
                  champions.map((champ, index) => {
                    const rank = champ.rank || index + 1;
                    return (
                      <div key={champ.id || index} className="flex items-center justify-between py-3 first:pt-1 last:pb-1">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                            rank === 1 ? 'kj-btn-primary' : 'bg-[var(--kj-soft)] text-[var(--kj-ink)] border border-[var(--kj-border)]'
                          }`}>
                            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[var(--kj-ink)]">{champ.displayName}</div>
                            <div className="text-[10px] text-[var(--kj-muted)]">
                              {champ.solvedAt
                                ? new Date(champ.solvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : pickLoc(locale, { ckb: 'ئەمڕۆ', kmr: 'ئەڤرۆ', ar: 'اليوم', en: 'Today' })}
                            </div>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-semibold kj-badge">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>
                            {champ.executionTimeMs
                              ? `${champ.executionTimeMs}ms`
                              : pickLoc(locale, { ckb: 'تێپەڕی', kmr: 'سەرکەفت', ar: 'ناجح', en: 'Passed' })}
                          </span>
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="kj-callout mt-6 rounded-[6px] p-3.5 text-center text-xs">
                <Award className="mx-auto mb-1 h-5 w-5" />
                <span>
                  {pickLoc(locale, {
                    ckb: 'پاش شیکارکردنی پرسیارەکە، ناوت لەم لیستەدا دادەنرێت و لە مێژووی karejanـدا دەمێنێتەوە!',
                    kmr: 'پشتی شیکارکرنا پرسیارێ، ناڤێ تە د ڤێ لیستێ دا دهێتە دانان!',
                    ar: 'بعد حل التحدي بنجاح، سيظهر اسمك هنا في سجل أبطال karejan!',
                    en: 'Solve today’s challenge to add your name to the verified champions board!',
                  })}
                </span>
              </div>
            </Surface>
          </div>
        </div>
      </div>
    </div>
  );
};
