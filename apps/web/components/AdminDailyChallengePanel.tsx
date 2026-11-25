import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  XCircle,
  Play,
  RefreshCw,
  Trophy,
  Code2,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { apiFetch, ApiError } from '../lib/api';
import { useApp } from '../context/AppContext';
import { CLIENT_DAILY_CHALLENGES } from '../data/dailyChallengesCatalog';
import type { DailyChallenge, ChampionRecord } from '../types/domain';
import { pickLoc } from '../i18n/translations';
import { Button, Surface } from './ui/Primitives';

export const AdminDailyChallengePanel: React.FC = () => {
  const { locale, firebaseUser } = useApp();

  const [activeChallengeId, setActiveChallengeId] = useState<string>(CLIENT_DAILY_CHALLENGES[0].id);
  const [catalog, setCatalog] = useState<DailyChallenge[]>(CLIENT_DAILY_CHALLENGES);
  const [champions, setChampions] = useState<ChampionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [switching, setSwitching] = useState<boolean>(false);
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Test sandbox state
  const [testCode, setTestCode] = useState<string>(CLIENT_DAILY_CHALLENGES[0].solutionCode || CLIENT_DAILY_CHALLENGES[0].starterCode);
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    allPassed: boolean;
    results: Array<{ callExpression: string; expectedOutput: string; actualOutput: string; passed: boolean }>;
    totalTimeMs: number;
    error?: string;
  } | null>(null);

  const fetchCatalogAndChampions = async () => {
    setLoading(true);
    setBanner(null);
    try {
      const data = await apiFetch<{
        ok: boolean;
        activeChallengeId: string;
        catalog: DailyChallenge[];
      }>('/api/admin/daily-challenge/catalog');

      if (data.ok) {
        setCatalog(data.catalog);
        setActiveChallengeId(data.activeChallengeId);
        const current = data.catalog.find((c) => c.id === data.activeChallengeId) || data.catalog[0];
        if (current) {
          setTestCode(current.solutionCode || current.starterCode);
        }
      }
    } catch (err) {
      console.warn('Admin catalog load failed, using client default:', err);
    }

    try {
      const champsData = await apiFetch<{
        ok: boolean;
        champions: ChampionRecord[];
      }>('/api/daily-challenge/champions');
      if (champsData.ok) {
        setChampions(champsData.champions);
      }
    } catch (err) {
      console.warn('Failed to load champions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCatalogAndChampions();
  }, []);

  const handleSetActive = async (challengeId: string) => {
    setSwitching(true);
    setBanner(null);
    try {
      const res = await apiFetch<{ ok: boolean; activeChallengeId: string; challenge: DailyChallenge }>(
        '/api/admin/daily-challenge/set-active',
        {
          method: 'POST',
          body: { challengeId },
        }
      );

      if (res.ok) {
        setActiveChallengeId(res.activeChallengeId);
        setTestCode(res.challenge.solutionCode || res.challenge.starterCode);
        const switchedTitle = res.challenge.titles[locale] || res.challenge.titles.en || res.challenge.titles.ckb;
        setBanner({
          type: 'ok',
          text: `${pickLoc(locale, {
            ckb: 'پرسیاری چالاک گۆڕدرا بۆ:',
            kmr: 'پرسیارا چالاک هاتە گوهۆڕین بۆ:',
            ar: 'تم تغيير التحدي النشط إلى:',
            en: 'Active challenge switched to:',
          })} ${switchedTitle}`,
        });
      }
    } catch (err) {
      setBanner({
        type: 'err',
        text:
          err instanceof ApiError
            ? err.message
            : pickLoc(locale, {
                ckb: 'هەڵە لە گۆڕینی پرسیاری چالاک',
                kmr: 'شاشییەک د گوهۆڕینا پرسیارا چالاک دا',
                ar: 'خطأ في تغيير التحدي النشط',
                en: 'Failed to switch active challenge',
              }),
      });
    } finally {
      setSwitching(false);
    }
  };

  const handleRunAdminTest = async () => {
    if (!testCode.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await apiFetch<{
        ok: boolean;
        allPassed: boolean;
        results: Array<{ callExpression: string; expectedOutput: string; actualOutput: string; passed: boolean }>;
        totalTimeMs: number;
        error?: string;
      }>('/api/daily-challenge/submit', {
        method: 'POST',
        body: {
          challengeId: activeChallengeId,
          userCode: testCode,
          displayName: `Admin Test (${firebaseUser?.displayName || 'Admin'})`,
          uid: firebaseUser?.uid,
        },
      });

      setTestResult(res);
      if (res.allPassed) {
        setBanner({
          type: 'ok',
          text: pickLoc(locale, {
            ckb: `تاقیکردنەوەی سێرڤەر بە سەرکەوتوویی جێبەجێکرا (${res.totalTimeMs}ms).`,
            kmr: `ئەزموونا سێرڤەری ب سەرکەفتی هاتە جێبەجێکرن (${res.totalTimeMs}ms).`,
            ar: `تم تنفيذ اختبار الخادم بنجاح (${res.totalTimeMs}ms).`,
            en: `Server sandbox test passed (${res.totalTimeMs}ms).`,
          }),
        });
      } else {
        setBanner({
          type: 'err',
          text: pickLoc(locale, {
            ckb: 'هەندێک لە تاقیکردنەوەکان هەڵەی تێدابوو.',
            kmr: 'د هندەک ئەزموونان دا شاشی هەبوو.',
            ar: 'فشلت بعض حالات الاختبار.',
            en: 'Some test cases failed.',
          }),
        });
      }
    } catch (err) {
      setBanner({
        type: 'err',
        text:
          err instanceof Error
            ? err.message
            : pickLoc(locale, {
                ckb: 'سێرڤەر نەیتوانی کۆدەکە پشکنین بکات.',
                kmr: 'سێرڤەر نەشیا کۆدی بپشکنیت.',
                ar: 'تعذر على الخادم فحص الكود.',
                en: 'Server failed to verify code.',
              }),
      });
    } finally {
      setTesting(false);
    }
  };

  const activeChallenge = catalog.find((c) => c.id === activeChallengeId) || catalog[0];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      {banner && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-xs font-semibold ${
            banner.type === 'ok'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300'
          }`}
        >
          {banner.type === 'ok' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
          <span>{banner.text}</span>
        </div>
      )}

      {/* Header Overview Card */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 dark:border-amber-500/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Zap className="h-6 w-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {pickLoc(locale, {
                    ckb: 'بەڕێوەبردنی پرسیاری ڕۆژ و چاڵنجی خێرا (Daily Challenge API & CMS)',
                    kmr: 'ڕێڤەبرنا پرسیارا ڕۆژێ و چالێنجا بلەز (Daily Challenge API & CMS)',
                    ar: 'إدارة تحدي اليوم السريع (Daily Challenge API & CMS)',
                    en: 'Daily Challenge Management (API & CMS)',
                  })}
                </h2>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  {pickLoc(locale, {
                    ckb: 'سیستەمی ٢٤ کاتژمێری',
                    kmr: 'سیستەمێ ٢٤ دەمژمێری',
                    ar: 'نظام ٢٤ ساعة',
                    en: '24-Hour System',
                  })}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {pickLoc(locale, {
                  ckb: 'لێرەوە دەتوانیت چاڵنجی چالاکی ماڵپەڕ بگۆڕیت، ئەنجامی Test Case تاقی بکەیتەوە، و لیستی پاڵەوانان کۆنترۆڵ بکەیت.',
                  kmr: 'ژ ڤێرێ تو دشێی چالێنجا چالاک یا مالپەڕی بگوهۆڕی، ئەنجامێن Test Case تاقی بکەی، و لیستا قارەمانان کۆنترۆل بکەی.',
                  ar: 'من هنا يمكنك تبديل التحدي النشط، اختبار حالات الفحص، وإدارة قائمة الأبطال.',
                  en: 'Switch the active platform challenge, run test cases in the sandbox, and monitor today’s champions.',
                })}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            disabled={loading}
            onClick={() => void fetchCatalogAndChampions()}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>
              {pickLoc(locale, {
                ckb: 'نوێکردنەوەی داتا',
                kmr: 'نوێکرنا داتایان',
                ar: 'تحديث البيانات',
                en: 'Refresh Data',
              })}
            </span>
          </Button>
        </div>
      </div>

      {/* Grid: Challenges Catalog & Test Runner */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Catalog & Switcher (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <Surface className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>
                {pickLoc(locale, {
                  ckb: `لیستی کەتەلۆکی پرسیارەکان (${catalog.length} چاڵنج)`,
                  kmr: `لیستا کەتەلۆگا پرسیاران (${catalog.length} چالێنج)`,
                  ar: `كتالوج التحديات (${catalog.length} تحدٍ)`,
                  en: `Challenge Catalog (${catalog.length} challenges)`,
                })}
              </span>
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {pickLoc(locale, {
                ckb: 'کرتە لەسەر هەر پرسیارێک بکەیت، بە یەک کرتە دەبێتە پرسیاری چالاکی ئەمڕۆ لە ماڵپەڕەکەدا.',
                kmr: 'کلیکێ ل سەر هەر پرسیارەکێ بکەی، دێ بیتە پرسیارا چالاک یا ئەڤرۆ ل سەر مالپەڕی.',
                ar: 'انقر على أي تحدٍ لتعيينه كتحدي اليوم النشط فوراً.',
                en: 'Activate any challenge to make it live for all learners immediately.',
              })}
            </p>

            <div className="mt-4 space-y-3">
              {catalog.map((c) => {
                const isCurrent = c.id === activeChallengeId;
                const cTitle = c.titles[locale] || c.titles.en || c.titles.ckb;
                const cDesc = c.descriptions[locale] || c.descriptions.en || c.descriptions.ckb;
                return (
                  <div
                    key={c.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isCurrent
                        ? 'border-amber-500/60 bg-amber-500/10 shadow-md dark:border-amber-500/40'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-[#2b3442] dark:bg-[#1a202b]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          {c.id}
                        </span>
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-slate-950">
                            <Sparkles className="h-3 w-3" />
                            <span>
                              {pickLoc(locale, {
                                ckb: 'پرسیاری چالاکی ئەمڕۆ',
                                kmr: 'پرسیارا چالاک یا ئەڤرۆ',
                                ar: 'تحدي اليوم النشط',
                                en: 'Live Today',
                              })}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          +{c.points} {pickLoc(locale, { ckb: 'خاڵ', kmr: 'خاڵ', ar: 'نقطة', en: 'pts' })}
                        </span>
                        <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {c.difficulty}
                        </span>
                      </div>
                    </div>

                    <h4 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                      {cTitle}
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {cDesc}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                      <span className="text-[11px] font-mono text-slate-400">
                        {pickLoc(locale, { ckb: 'فەنکشن:', kmr: 'فەنکشن:', ar: 'الدالة:', en: 'Fn:' })}{' '}
                        <code className="text-blue-600 dark:text-blue-400">{c.functionName}()</code> · {c.testCases.length}{' '}
                        {pickLoc(locale, { ckb: 'پشکنین', kmr: 'تاقیکرن', ar: 'اختبارات', en: 'tests' })}
                      </span>
                      {!isCurrent ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={switching}
                          onClick={() => void handleSetActive(c.id)}
                          className="text-xs font-semibold cursor-pointer"
                        >
                          <span>
                            {pickLoc(locale, {
                              ckb: 'چالاککردن وەک پرسیاری ڕۆژ ⚡',
                              kmr: 'چالاککرن وەک پرسیارا ڕۆژێ ⚡',
                              ar: 'تفعيل كتحدي اليوم ⚡',
                              en: 'Set Active Challenge ⚡',
                            })}
                          </span>
                        </Button>
                      ) : (
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          ✓ {pickLoc(locale, { ckb: 'چالاکە', kmr: 'چالاکە', ar: 'نشط', en: 'Active' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Surface>
        </div>

        {/* Right Column: Built-in Sandbox API Tester (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <Surface className="p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <Code2 className="h-4 w-4 text-emerald-500" />
              <span>
                {pickLoc(locale, {
                  ckb: 'پشکنەری ڕاستەوخۆ (API Runner Sandbox)',
                  kmr: 'تاقیکەرێ ڕاستەوخۆ (API Runner Sandbox)',
                  ar: 'بيئة اختبار الخادم (API Runner Sandbox)',
                  en: 'Live API Sandbox Tester',
                })}
              </span>
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {pickLoc(locale, {
                ckb: 'کۆدی شیکار لە سێرڤەری Node Sandbox بەراورد دەکات بە Test Cases بەر لە بڵاوبوونەوە.',
                kmr: 'کۆدێ چارەسەریێ د سێرڤەرێ Node Sandbox دا هەمبەری Test Cases دکەت بەری بەڵاڤبوونێ.',
                ar: 'يفحص كود الحل على خادم Node Sandbox مقابل حالات الاختبار قبل النشر.',
                en: 'Verify solution code against test cases on the Node Sandbox before publishing.',
              })}
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-[#10141c] p-3 dark:border-[#2b3442]">
              <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {pickLoc(locale, {
                    ckb: 'فەنکشنی چالاک:',
                    kmr: 'فەنکشنا چالاک:',
                    ar: 'الدالة النشطة:',
                    en: 'Active function:',
                  })}{' '}
                  {activeChallenge?.functionName}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (activeChallenge?.solutionCode) setTestCode(activeChallenge.solutionCode);
                  }}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  {pickLoc(locale, {
                    ckb: 'داگرتنی Solution Code',
                    kmr: 'بارکرنا Solution Code',
                    ar: 'تحميل الحل النموذجي',
                    en: 'Load Solution Code',
                  })}
                </button>
              </div>
              <textarea
                dir="ltr"
                rows={8}
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                className="w-full resize-y bg-transparent font-mono text-xs leading-relaxed text-slate-100 outline-none"
              />
            </div>

            <div className="mt-3 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                disabled={testing || !testCode.trim()}
                onClick={() => void handleRunAdminTest()}
                className="gap-1.5"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>
                  {testing
                    ? pickLoc(locale, { ckb: 'پشکنین...', kmr: 'پشکنین...', ar: 'جارٍ الفحص...', en: 'Testing...' })
                    : pickLoc(locale, {
                        ckb: 'تاقیکردنەوە لە سێرڤەر (Test)',
                        kmr: 'ئەزموون ل سێرڤەری (Test)',
                        ar: 'اختبار على الخادم',
                        en: 'Run Server Test',
                      })}
                </span>
              </Button>
            </div>

            {testResult && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#2b3442] dark:bg-[#151b26]">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={testResult.allPassed ? 'text-emerald-600' : 'text-red-600'}>
                    {testResult.allPassed
                      ? pickLoc(locale, {
                          ckb: 'هەموو Test Cases تێپەڕین ✅',
                          kmr: 'هەمی Test Cases سەرکەفتن ✅',
                          ar: 'نجحت جميع حالات الاختبار ✅',
                          en: 'All Test Cases Passed ✅',
                        })
                      : pickLoc(locale, {
                          ckb: 'شکستی هێنا ❌',
                          kmr: 'سەرنەکەفت ❌',
                          ar: 'فشل ❌',
                          en: 'Failed ❌',
                        })}
                  </span>
                  <span className="font-mono text-slate-400">{testResult.totalTimeMs}ms</span>
                </div>
                <div className="mt-2 space-y-1.5 font-mono text-[11px]">
                  {testResult.results.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>{r.callExpression}</span>
                      <span className={r.passed ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                        {r.passed ? 'PASS' : `FAIL (${r.actualOutput})`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Surface>

          {/* Today's Champions Summary */}
          <Surface className="p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>
                  {pickLoc(locale, {
                    ckb: `پاڵەوانانی ئەمڕۆ (${champions.length})`,
                    kmr: `قارەمانێن ئەڤرۆ (${champions.length})`,
                    ar: `أبطال اليوم (${champions.length})`,
                    en: `Today’s Champions (${champions.length})`,
                  })}
                </span>
              </h3>
            </div>

            <div className="mt-3 max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {champions.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  {pickLoc(locale, {
                    ckb: 'هیچ کەسێک تا ئێستا تۆمار نەکراوە بۆ ئەمڕۆ.',
                    kmr: 'تا نها کەس بۆ ئەڤرۆ نەهاتیە تۆمارکرن.',
                    ar: 'لم يُسجَّل أي بطل لليوم بعد.',
                    en: 'No champions recorded yet today.',
                  })}
                </div>
              ) : (
                champions.map((champ, i) => (
                  <div key={champ.id || i} className="flex items-center justify-between py-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {i + 1}. {champ.displayName}
                      </span>
                    </div>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {champ.executionTimeMs}ms
                    </span>
                  </div>
                ))
              )}
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
};
