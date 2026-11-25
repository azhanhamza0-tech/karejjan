import vm from 'node:vm';

export interface SandboxResult {
  valid: boolean;
  output: string[];
  error?: string;
}

/**
 * Safely executes untrusted JavaScript code inside an isolated Node vm context
 * with a strict 150ms CPU timeout and zero access to process, require, fs, or network.
 */
export function runJsInSandbox(code: string): SandboxResult {
  const logs: string[] = [];
  const safeConsole = {
    log: (...args: unknown[]) => {
      if (logs.length < 25) {
        logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      }
    },
    warn: (...args: unknown[]) => {
      if (logs.length < 25) logs.push(args.map(String).join(' '));
    },
    error: (...args: unknown[]) => {
      if (logs.length < 25) logs.push(args.map(String).join(' '));
    },
  };

  // Block obvious infinite loops or forbidden globals
  const forbidden = /\b(process|require|globalThis|global|Function|eval|import|fetch|XMLHttpRequest)\b/;
  if (forbidden.test(code)) {
    return { valid: false, output: [], error: 'Disallowed runtime identifier in sandboxed snippet.' };
  }

  try {
    const context = vm.createContext(
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
    const script = new vm.Script(`"use strict";\n${code}`, { filename: 'karejan-sandbox.js' });
    script.runInContext(context, { timeout: 150 });
    return { valid: true, output: logs };
  } catch (err) {
    return {
      valid: false,
      output: logs,
      error: err instanceof Error ? err.message : 'Sandbox execution error',
    };
  }
}

/**
 * Validates basic HTML/CSS structural sanity for question validation.
 */
export function validateHtmlCssSnippet(track: 'html' | 'css', code: string): { valid: boolean; error?: string } {
  const trimmed = code.trim();
  if (!trimmed) return { valid: false, error: 'Empty code snippet.' };
  if (track === 'html') {
    const hasTag = /<[a-zA-Z][\w-]*(\s[^>]*)?>/.test(trimmed);
    if (!hasTag) return { valid: false, error: 'HTML snippet contains no valid HTML tag.' };
    if (/<script[^>]*src=/i.test(trimmed)) return { valid: false, error: 'External script tags are not permitted.' };
    return { valid: true };
  }
  const openBraces = (trimmed.match(/\{/g) || []).length;
  const closeBraces = (trimmed.match(/\}/g) || []).length;
  if (openBraces === 0 || openBraces !== closeBraces) {
    return { valid: false, error: 'CSS snippet has unbalanced or missing declaration blocks.' };
  }
  return { valid: true };
}
