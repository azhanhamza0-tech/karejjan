import React, { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { html as htmlLang } from '@codemirror/lang-html';
import { css as cssLang } from '@codemirror/lang-css';
import { javascript as jsLang } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Play, RotateCcw, Copy, Maximize2, Minimize2, Save, Trash2, FolderOpen, Sparkles } from 'lucide-react';
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useApp } from '../context/AppContext';
import { pickLoc } from '../i18n/translations';
import { SEED_LESSONS } from '../data/seedCatalog';
import { STARTER_TEMPLATES, type StarterTemplate } from '../data/starterTemplates';
import { Button, Surface } from './ui/Primitives';

type CodeTab = 'html' | 'css' | 'js';

function buildSandboxedSrcDoc(html: string, css: string, js: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>${css}</style>
</head>
<body>
${html}
<script>
try {
${js}
} catch (err) {
  const pre = document.createElement('pre');
  pre.style.cssText = 'color:#f87171;background:#1e1b2e;padding:12px;border-radius:8px;font-family:monospace;font-size:12px;margin:12px;';
  pre.textContent = 'Runtime Error: ' + (err && err.message ? err.message : String(err));
  document.body.appendChild(pre);
}
</script>
</body>
</html>`;
}

export const CodeEditorView: React.FC = () => {
  const {
    locale,
    t,
    theme,
    firebaseUser,
    setAuthModalOpen,
    editorBuffer,
    setEditorBuffer,
    snippets,
    saveSnippet,
    deleteSnippet,
    lessons,
  } = useApp();

  const [activeTab, setActiveTab] = useState<CodeTab>('html');
  const [srcDoc, setSrcDoc] = useState(() =>
    buildSandboxedSrcDoc(editorBuffer.html, editorBuffer.css, editorBuffer.js)
  );
  const [runKey, setRunKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [showSnippets, setShowSnippets] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const editorHostRef = useRef<HTMLDivElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  // Recreate CodeMirror view only when activeTab or theme changes; preserves buffer on language switch!
  useEffect(() => {
    if (!editorHostRef.current) return;
    editorViewRef.current?.destroy();

    const langExt =
      activeTab === 'html' ? htmlLang() : activeTab === 'css' ? cssLang() : jsLang();

    const state = EditorState.create({
      doc: editorBuffer[activeTab],
      extensions: [
        basicSetup,
        langExt,
        ...(theme === 'dark' ? [oneDark] : []),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const nextDoc = update.state.doc.toString();
            setEditorBuffer((prev) => ({ ...prev, [activeTab]: nextDoc }));
          }
        }),
      ],
    });

    const view = new EditorView({ state, parent: editorHostRef.current });
    editorViewRef.current = view;

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
    // Intentionally omit editorBuffer[activeTab] to avoid cursor jump on each keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, theme]);

  // Keep external buffer loads (like Reset or Load Snippet) synced into CodeMirror
  const syncDocToView = (code: string) => {
    const view = editorViewRef.current;
    if (view && view.state.doc.toString() !== code) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: code },
      });
    }
  };

  const handleRun = () => {
    setSrcDoc(buildSandboxedSrcDoc(editorBuffer.html, editorBuffer.css, editorBuffer.js));
    setRunKey((k) => k + 1);
  };

  const handleReset = () => {
    const sourceLesson =
      lessons.find((l) => l.id === editorBuffer.lessonId) || SEED_LESSONS[0];
    const resetBuf = {
      html: sourceLesson.sharedCode.html,
      css: sourceLesson.sharedCode.css,
      js: sourceLesson.sharedCode.js,
      lessonId: sourceLesson.id,
    };
    setEditorBuffer(resetBuf);
    syncDocToView(resetBuf[activeTab]);
    setSrcDoc(buildSandboxedSrcDoc(resetBuf.html, resetBuf.css, resetBuf.js));
    setRunKey((k) => k + 1);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editorBuffer[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleSaveSnippet = async () => {
    const cleanTitle = snippetTitle.trim() || `Snippet ${new Date().toLocaleTimeString()}`;
    setSaving(true);
    setStatusMsg(null);
    try {
      await saveSnippet({
        title: cleanTitle,
        html: editorBuffer.html,
        css: editorBuffer.css,
        js: editorBuffer.js,
        lessonId: editorBuffer.lessonId || null,
      });
      setSnippetTitle('');
      setStatusMsg(pickLoc(locale, {
      ckb: 'کۆدەکە لە تاقیگە پاشەکەوت کرا.',
      kmr: 'کۆد د تاقیگەهێ دا هاتە پاشکەفتکرن.',
      ar: 'تم حفظ الكود في المختبر.',
      en: 'Snippet saved to Code Lab.',
    }));
    } catch {
      setStatusMsg('Could not save snippet.');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadSnippet = (s: { html: string; css: string; js: string; lessonId?: string | null }) => {
    const next = { html: s.html, css: s.css, js: s.js, lessonId: s.lessonId || null };
    setEditorBuffer(next);
    syncDocToView(next[activeTab]);
    setSrcDoc(buildSandboxedSrcDoc(next.html, next.css, next.js));
    setRunKey((k) => k + 1);
    setShowSnippets(false);
  };

  const handleDeleteSnippet = async (id: string) => {
    await deleteSnippet(id);
  };

  const handleLoadTemplate = (tpl: StarterTemplate) => {
    const next = { html: tpl.html, css: tpl.css, js: tpl.js, lessonId: null };
    setEditorBuffer(next);
    syncDocToView(next[activeTab]);
    setSrcDoc(buildSandboxedSrcDoc(next.html, next.css, next.js));
    setRunKey((k) => k + 1);
    setShowTemplates(false);
  };

  return (
    <div
      className={
        fullscreen
          ? 'fixed inset-0 z-50 flex flex-col bg-[var(--kj-paper)] p-4'
          : 'mx-auto max-w-[1440px] px-4 py-6 sm:px-6'
      }
    >
      {/* Editorial Header + Toolbar */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--kj-border)] pb-4">
        <div className="text-start">
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--kj-ink)] sm:text-2xl">
            {t.editor.title}
          </h1>
          <p className="mt-0.5 text-xs text-[var(--kj-muted)]">{t.editor.sandboxNotice}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={handleRun}>
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{t.editor.runCode}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t.editor.resetCode}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => void handleCopy()}>
            <Copy className="h-3.5 w-3.5" />
            <span>{copied ? t.common.copied : t.common.copy}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowTemplates((s) => !s)}>
            <Sparkles className="h-3.5 w-3.5 text-[var(--kj-green)]" />
            <span>{pickLoc(locale, { ckb: 'تێمپلەیتەکان', kmr: 'تێمپلەیت', ar: 'القوالب', en: 'Templates' })} ({STARTER_TEMPLATES.length})</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowSnippets((s) => !s)}>
            <FolderOpen className="h-3.5 w-3.5" />
            <span>
              {t.editor.loadSnippet} ({snippets.length})
            </span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setFullscreen((f) => !f)}>
            {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span>{fullscreen ? t.editor.exitFullscreen : t.editor.fullscreen}</span>
          </Button>
        </div>
      </div>

      {/* Save Snippet Bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={snippetTitle}
          onChange={(e) => setSnippetTitle(e.target.value)}
          placeholder={t.editor.snippetTitlePlaceholder}
          maxLength={120}
          className="min-w-[220px] flex-1 rounded-[6px] border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3.5 py-2 text-sm text-[var(--kj-ink)] placeholder:text-[var(--kj-muted)] focus:border-[var(--kj-green)] focus:outline-none"
        />
        <Button variant="violet" size="sm" disabled={saving} onClick={() => void handleSaveSnippet()}>
          <Save className="h-3.5 w-3.5" />
          <span>{t.editor.saveSnippet}</span>
        </Button>
        {statusMsg && <span className="text-xs font-semibold text-[var(--kj-green)]">{statusMsg}</span>}
      </div>

      {/* Starter Templates Drawer */}
      {showTemplates && (
        <Surface className="mb-4 p-4 bg-[var(--kj-soft)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--kj-ink)] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--kj-green)]" />
              <span>{pickLoc(locale, {
  ckb: 'تێمپلەیت و کۆدە ئامادەکراوەکانی karejan',
  kmr: 'تێمپلەیت و کۆدێن ئامادەکری یێن karejan',
  ar: 'قوالب وأكواد karejan الجاهزة',
  en: 'karejan Ready-Made Starter Templates',
})}</span>
            </h2>
            <span className="text-xs text-[var(--kj-muted)]">
              {pickLoc(locale, {
  ckb: 'کلیک بکە بۆ بارکردنی دەستبەجێی کۆدەکان',
  kmr: 'کلیک بکە بۆ بارکرنا بلەز یا کۆدان',
  ar: 'انقر لتحميل القالب مباشرة في المحرر',
  en: 'Click any template to load into editor',
})}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STARTER_TEMPLATES.map((tpl) => {
              const title = tpl.title[locale] || tpl.title.en;
              const desc = tpl.description[locale] || tpl.description.en;
              return (
                <div
                  key={tpl.id}
                  onClick={() => handleLoadTemplate(tpl)}
                  className="group flex flex-col justify-between rounded-[7px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-3.5 transition-colors hover:border-[var(--kj-emerald)] hover:bg-[var(--kj-elevated)] cursor-pointer text-start"
                >
                  <div>
                    <h3 className="text-sm font-bold text-[var(--kj-ink)] group-hover:text-[var(--kj-green)] transition-colors">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--kj-muted)] line-clamp-2">
                      {desc}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[var(--kj-green)]">
                    <span className="uppercase tracking-wider">{tpl.category}</span>
                    <span>{pickLoc(locale, { ckb: 'بارکردن ❯', kmr: 'بارکرن ❯', ar: 'تحميل ❯', en: 'Load ❯' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Surface>
      )}

      {/* Saved Snippets Drawer */}
      {showSnippets && (
        <Surface className="mb-4 p-4">
          <h2 className="mb-2 text-sm font-bold text-[var(--kj-ink)]">
            {t.editor.savedSnippets}
          </h2>
          {snippets.length === 0 ? (
            <p className="text-xs text-[var(--kj-muted)]">{t.editor.noSnippets}</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {snippets.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-2 rounded-[6px] border border-[var(--kj-border)] bg-[var(--kj-soft)] px-3 py-2"
                >
                  <button
                    type="button"
                    onClick={() => handleLoadSnippet(s)}
                    className="truncate text-start text-sm font-semibold text-[var(--kj-green)] hover:underline cursor-pointer"
                  >
                    {s.title}
                  </button>
                  <button
                    type="button"
                    aria-label={t.common.delete}
                    onClick={() => void handleDeleteSnippet(s.id)}
                    className="p-1 text-[var(--kj-muted)] hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Surface>
      )}

      {/* Playground Shell matching dist.zip .play-shell */}
      <div className={`kj-code-window flex flex-col ${fullscreen ? 'min-h-0 flex-1' : 'h-[580px]'}`}>
        <div className="kj-code-bar flex flex-wrap items-center justify-between border-b border-[var(--kj-code-border)]">
          <div className="flex items-center" role="tablist">
            {(['html', 'css', 'js'] as CodeTab[]).map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3.5 font-mono text-xs font-semibold uppercase transition-colors cursor-pointer ${
                    active
                      ? 'bg-[var(--kj-code-bg)] text-white shadow-[inset_0_2px_0_var(--kj-emerald)]'
                      : 'text-[#a9baae] hover:bg-[#2a3546] hover:text-white'
                  }`}
                >
                  {tab === 'js' ? 'JavaScript' : tab.toUpperCase()}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="hidden sm:inline font-mono text-[10px] tracking-widest uppercase text-[#8fa297]">
              CodeMirror 6 · {activeTab === 'html' ? 'index.html' : activeTab === 'css' ? 'style.css' : 'script.js'}
            </span>
            <button
              type="button"
              onClick={handleRun}
              className="kj-btn-primary rounded-[5px] px-3.5 py-1.5 text-xs cursor-pointer"
            >
              ▶ {t.editor.runCode}
            </button>
          </div>
        </div>

        {/* Split Editor & Sandboxed Live Preview */}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
          <div className="flex min-h-[260px] flex-col border-b border-[var(--kj-code-border)] lg:border-b-0 lg:border-e">
            <div className="flex items-center justify-between border-b border-[var(--kj-code-border)] px-4 py-2 font-mono text-[10px] tracking-widest text-[#8fa297]">
              <span>EDITOR</span>
              <span>LTR</span>
            </div>
            <div ref={editorHostRef} dir="ltr" className="min-h-0 flex-1 overflow-hidden" />
          </div>

          <div className="flex min-h-[260px] flex-col bg-white">
            <div className="flex items-center justify-between border-b border-[var(--kj-code-border)] bg-[var(--kj-code-bg)] px-4 py-2 font-mono text-[10px] tracking-widest text-[#8fa297]">
              <span>{t.editor.livePreview}</span>
              <span className="inline-flex items-center gap-1.5 text-[var(--kj-emerald)]">
                <i className="h-1.5 w-1.5 rounded-full bg-[var(--kj-emerald)]" />
                sandbox=&quot;allow-scripts&quot;
              </span>
            </div>
            <iframe
              key={runKey}
              title="karejan Sandboxed Live Preview"
              sandbox="allow-scripts"
              srcDoc={srcDoc}
              className="h-full w-full flex-1 bg-white"
            />
          </div>
        </div>

        <div className="kj-code-bar flex flex-wrap items-center justify-between gap-2 border-t border-[var(--kj-code-border)] px-4 py-2.5 text-[11px]">
          <span>{t.editor.sandboxNotice}</span>
          <span className="font-mono text-[#72e2b5]">● Ready</span>
        </div>
      </div>
    </div>
  );
};
