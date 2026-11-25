import vm from 'node:vm';
import type { DailyChallengeTestCase } from '../../apps/web/types/domain.ts';

export interface TestCaseEvaluationResult {
  id: string;
  callExpression: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
  isSecret?: boolean;
}

export interface ChallengeRunSummary {
  allPassed: boolean;
  results: TestCaseEvaluationResult[];
  totalTimeMs: number;
  error?: string;
}

/**
 * Safely evaluates user code against challenge test cases in an isolated Node VM.
 */
export function runChallengeTestCases(
  userCode: string,
  testCases: DailyChallengeTestCase[]
): ChallengeRunSummary {
  const startTime = Date.now();

  // Block dangerous operations
  const forbidden = /\b(process|require|globalThis|global|Function|eval|import|fetch|XMLHttpRequest)\b/;
  if (forbidden.test(userCode)) {
    return {
      allPassed: false,
      results: [],
      totalTimeMs: 0,
      error: 'کۆدەکەت زاراوەی ڕێپێنەدراوی تێدایە (Security Restriction).',
    };
  }

  const logs: string[] = [];
  const safeConsole = {
    log: (...args: unknown[]) => {
      if (logs.length < 20) {
        logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      }
    },
  };

  try {
    const sandboxContext = vm.createContext(
      Object.freeze({
        console: Object.freeze(safeConsole),
        Math,
        JSON,
        Number,
        String,
        Boolean,
        Array,
        Object,
        Date,
        Map,
        Set,
        parseInt,
        parseFloat,
        isNaN,
      })
    );

    // 1. Evaluate user code to declare functions
    const userScript = new vm.Script(`"use strict";\n${userCode}`, {
      filename: 'user-challenge-code.js',
    });
    userScript.runInContext(sandboxContext, { timeout: 300 });

    const results: TestCaseEvaluationResult[] = [];
    let allPassed = true;

    // 2. Evaluate each test case
    for (const tc of testCases) {
      try {
        const testScript = new vm.Script(
          `"use strict";\n(() => {
            const res = ${tc.callExpression};
            return typeof res === 'object' || typeof res === 'string' ? JSON.stringify(res) : String(res);
          })()`,
          { filename: `tc-${tc.id}.js` }
        );

        const actualRaw = testScript.runInContext(sandboxContext, { timeout: 200 });
        const actualStr = String(actualRaw ?? '');
        const expectedClean = tc.expectedOutput.trim();

        // Compare JSON or trimmed strings
        const passed = actualStr === expectedClean || actualStr.replace(/\s+/g, '') === expectedClean.replace(/\s+/g, '');

        if (!passed) allPassed = false;

        results.push({
          id: tc.id,
          callExpression: tc.callExpression,
          expectedOutput: tc.expectedOutput,
          actualOutput: actualStr,
          passed,
          isSecret: tc.isSecret,
        });
      } catch (tcErr) {
        allPassed = false;
        results.push({
          id: tc.id,
          callExpression: tc.callExpression,
          expectedOutput: tc.expectedOutput,
          actualOutput: 'Error',
          passed: false,
          error: tcErr instanceof Error ? tcErr.message : String(tcErr),
          isSecret: tc.isSecret,
        });
      }
    }

    const totalTimeMs = Date.now() - startTime;
    return {
      allPassed,
      results,
      totalTimeMs,
    };
  } catch (err) {
    return {
      allPassed: false,
      results: [],
      totalTimeMs: Date.now() - startTime,
      error: err instanceof Error ? err.message : 'هەڵە لە جێبەجێکردنی کۆدەکەدا ڕوویدا.',
    };
  }
}
