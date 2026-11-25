import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Code2,
  ExternalLink,
  FolderGit2,
  Search,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Check,
  Plus,
  ShieldCheck,
  Play,
  BookMarked,
} from 'lucide-react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useApp } from '../context/AppContext';
import { pickLoc } from '../i18n/translations';
import { DISCOVERY_COPY } from '../i18n/discoveryCopy';
import { isSafeOfficialHttpsUrl } from '../data/discoverySeed';
import type {
  AiToolCategory,
  ArticleCategory,
  CodeProject,
  DiscoverSection,
  ProjectTrack,
  TrackId,
} from '../types/domain';
import { Button, Modal, Surface } from './ui/Primitives';

function buildSandboxedDoc(html: string, css: string, js: string): string {
  const safeJs = js.replace(/<\/script>/gi, '<\\/script>');
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
${safeJs}
} catch (err) {
  const pre = document.createElement('pre');
  pre.style.color = '#f87171';
  pre.style.padding = '12px';
  pre.textContent = 'Runtime error: ' + (err && err.message ? err.message : String(err));
  document.body.appendChild(pre);
}
</script>
</body>
</html>`;
}

const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'web-architecture',
  'performance',
  'security',
  'ai-engineering',
  'tooling',
];

const AI_TOOL_CATEGORIES: AiToolCategory[] = [
  'coding',
  'models',
  'research',
  'design',
  'writing',
  'productivity',
];

export const DiscoveryView: React.FC = () => {
  const {
    locale,
    t,
    firebaseUser,
    profile,
    staffRole,
    setActiveView,
    setAuthModalOpen,
    articles,
    articleStates,
    toggleArticleBookmark,
    updateArticleProgress,
    references,
    aiTools,
    projects,
    mySubmittedProjects,
    discoverSection: section,
    setDiscoverSection: setSection,
    openCodeInEditor,
    refreshCatalog,
  } = useApp();

  const copy = DISCOVERY_COPY[locale];

  // Knowledge Center state
  const [articleSearch, setArticleSearch] = useState('');
  const [articleCategory, setArticleCategory] = useState<ArticleCategory | 'all'>('all');
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const readerRef = useRef<HTMLDivElement | null>(null);

  // References Library state
  const [refTrack, setRefTrack] = useState<TrackId | 'all'>('all');
  const [refSearch, setRefSearch] = useState('');
  const [selectedRefId, setSelectedRefId] = useState<string>(references[0]?.id || '');

  // AI Tools Directory state
  const [toolSearch, setToolSearch] = useState('');
  const [toolCategory, setToolCategory] = useState<AiToolCategory | 'all'>('all');

  // Projects & Code Library state
  const [projSearch, setProjSearch] = useState('');
  const [projTrack, setProjTrack] = useState<ProjectTrack | 'all'>('all');
  const [showMineOnly, setShowMineOnly] = useState(false);
  const [previewProject, setPreviewProject] = useState<CodeProject | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitBanner, setSubmitBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Project submission form
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTrack, setFormTrack] = useState<ProjectTrack>('js');
  const [formDifficulty, setFormDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [formTags, setFormTags] = useState('html, css, js');
  const [formHtml, setFormHtml] = useState('<div class="card">\n  <h2>My KARÊJAN Project</h2>\n  <button id="btn">Click me</button>\n</div>');
  const [formCss, setFormCss] = useState('body { font-family: system-ui, sans-serif; padding: 20px; background: #151b26; color: #f8fafc; }\n.card { padding: 18px; border: 1px solid #2b3442; border-radius: 10px; background: #1a202b; }');
  const [formJs, setFormJs] = useState('document.getElementById("btn").addEventListener("click", (e) => {\n  e.target.textContent = "Clicked!";\n});');

  const activeArticle = useMemo(
    () => articles.find((a) => a.id === activeArticleId) || null,
    [articles, activeArticleId]
  );

  // Record initial 25% reading progress when opening an article, and track scroll depth inside reader
  useEffect(() => {
    if (!activeArticle) return;
    const current = articleStates[activeArticle.id]?.progressPercent ?? 0;
    if (current < 25) {
      void updateArticleProgress(activeArticle.id, 25);
    }
  }, [activeArticle?.id]);

  const handleCopy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1600);
  };

  // Filtered Knowledge Articles
  const filteredArticles = useMemo(() => {
    const q = articleSearch.trim().toLowerCase();
    return articles.filter((art) => {
      if (articleCategory !== 'all' && art.category !== articleCategory) return false;
      if (bookmarksOnly && !articleStates[art.id]?.bookmarked) return false;
      if (!q) return true;
      const tr = art.translations[locale] || art.translations.en;
      return (
        tr.title.toLowerCase().includes(q) ||
        tr.summary.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q)
      );
    });
  }, [articles, articleCategory, bookmarksOnly, articleSearch, articleStates, locale]);

  // Filtered References
  const filteredRefs = useMemo(() => {
    const q = refSearch.trim().toLowerCase();
    return references.filter((r) => {
      if (refTrack !== 'all' && r.track !== refTrack) return false;
      if (!q) return true;
      const tr = r.translations[locale] || r.translations.en;
      return (
        r.symbol.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        tr.summary.toLowerCase().includes(q)
      );
    });
  }, [references, refTrack, refSearch, locale]);

  const activeRef = useMemo(() => {
    return filteredRefs.find((r) => r.id === selectedRefId) || filteredRefs[0] || null;
  }, [filteredRefs, selectedRefId]);

  // Filtered AI Tools (strictly enforcing official HTTPS URLs at render time too)
  const filteredTools = useMemo(() => {
    const q = toolSearch.trim().toLowerCase();
    return aiTools.filter((tool) => {
      if (!isSafeOfficialHttpsUrl(tool.officialUrl)) return false;
      if (toolCategory !== 'all' && tool.category !== toolCategory) return false;
      if (!q) return true;
      const tr = tool.translations[locale] || tool.translations.en;
      return (
        tool.name.toLowerCase().includes(q) ||
        tr.tagline.toLowerCase().includes(q) ||
        tr.description.toLowerCase().includes(q)
      );
    });
  }, [aiTools, toolCategory, toolSearch, locale]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    const source = showMineOnly ? mySubmittedProjects : projects;
    const q = projSearch.trim().toLowerCase();
    return source.filter((p) => {
      if (projTrack !== 'all' && p.track !== projTrack) return false;
      if (!q) return true;
      const loc = p.translations?.[locale];
      const title = (loc?.title || p.title).toLowerCase();
      const desc = (loc?.description || p.description).toLowerCase();
      return (
        title.includes(q) ||
        desc.includes(q) ||
        (p.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [projects, mySubmittedProjects, showMineOnly, projTrack, projSearch, locale]);

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!firebaseUser.emailVerified) {
      setSubmitBanner({ type: 'err', text: t.common.verifyEmailNotice });
      return;
    }
    const cleanTitle = formTitle.trim();
    const cleanDesc = formDesc.trim();
    if (cleanTitle.length < 3 || cleanDesc.length < 10) {
      setSubmitBanner({ type: 'err', text: 'Title (3+ chars) and description (10+ chars) are required.' });
      return;
    }

    setSubmitting(true);
    setSubmitBanner(null);
    const projectId = `proj_${firebaseUser.uid.slice(0, 8)}_${Date.now()}`;
    const tags = formTags
      .split(',')
      .map((s) => s.trim().slice(0, 24))
      .filter(Boolean)
      .slice(0, 6);

    try {
      await setDoc(doc(db, 'code_projects', projectId), {
        id: projectId,
        title: cleanTitle.slice(0, 120),
        description: cleanDesc.slice(0, 1000),
        track: formTrack,
        difficulty: formDifficulty,
        tags,
        html: formHtml.slice(0, 30000),
        css: formCss.slice(0, 30000),
        js: formJs.slice(0, 30000),
        authorUid: firebaseUser.uid,
        authorName: (profile?.displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Learner').slice(0, 100),
        isOfficial: false,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setSubmitBanner({ type: 'ok', text: copy.projects.submittedPending });
      setFormTitle('');
      setFormDesc('');
      setShowMineOnly(true);
      setTimeout(() => {
        setSubmitModalOpen(false);
        setSubmitBanner(null);
      }, 1100);
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, `code_projects/${projectId}`);
      } catch (wrapped) {
        setSubmitBanner({
          type: 'err',
          text: wrapped instanceof Error ? wrapped.message : 'Project submission failed.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const sectionTabs: { id: DiscoverSection; label: string; icon: React.ReactNode }[] = [
    { id: 'knowledge', label: copy.tabs.knowledge, icon: <BookOpen className="h-4 w-4" /> },
    { id: 'references', label: copy.tabs.references, icon: <BookMarked className="h-4 w-4" /> },
    { id: 'ai-tools', label: copy.tabs.aiTools, icon: <ShieldCheck className="h-4 w-4" /> },
    { id: 'projects', label: copy.tabs.projects, icon: <FolderGit2 className="h-4 w-4" /> },
  ];

  return (
    <div>
      {/* Editorial Hero Header Strip */}
      <section className="kj-hero-band">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="text-start">
              <div className="kj-eyebrow">
                <span className="kj-eyebrow-dot" />
                <span>{pickLoc(locale, {
  ckb: 'سەرچاوە و پڕۆژەکان · DISCOVERY HUB',
  kmr: 'ژێدەر و پڕۆژە · DISCOVERY HUB',
  ar: 'الموارد والمشاريع · DISCOVERY HUB',
  en: 'Discovery Hub · Resources & Community',
})}</span>
              </div>
              <h1 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--kj-ink)]">
                {copy.pageTitle}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-[var(--kj-muted-2)]">
                {copy.pageSubtitle}
              </p>
            </div>

            <div
              role="tablist"
              aria-label={copy.pageTitle}
              className="inline-flex flex-wrap items-center gap-1 rounded-[7px] border border-[var(--kj-border)] bg-[var(--kj-soft)] p-1"
            >
              {sectionTabs.map((item) => {
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => {
                      setSection(item.id);
                      if (item.id !== 'knowledge') setActiveArticleId(null);
                    }}
                    className={`inline-flex items-center gap-2 rounded-[5px] px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'kj-btn-primary'
                        : 'text-[var(--kj-muted-2)] hover:text-[var(--kj-ink)]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">

      {/* ===================================================================== */}
      {/* 1. TECHNOLOGY KNOWLEDGE CENTER                                        */}
      {/* ===================================================================== */}
      {section === 'knowledge' && (
        <div>
          {activeArticle ? (
            <div ref={readerRef} className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="secondary" size="sm" onClick={() => setActiveArticleId(null)}>
                  <ArrowLeft className="h-4 w-4" />
                  <span>{copy.knowledge.backToList}</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => void toggleArticleBookmark(activeArticle.id)}
                  >
                    {articleStates[activeArticle.id]?.bookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-[var(--kj-green)]" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    <span>
                      {articleStates[activeArticle.id]?.bookmarked
                        ? copy.knowledge.bookmarked
                        : copy.knowledge.bookmark}
                    </span>
                  </Button>
                  <Button
                    variant={articleStates[activeArticle.id]?.completed ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => void updateArticleProgress(activeArticle.id, 100)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {articleStates[activeArticle.id]?.completed
                        ? copy.knowledge.completed
                        : copy.knowledge.markRead}
                    </span>
                  </Button>
                </div>
              </div>

              {(() => {
                const tr = activeArticle.translations[locale] || activeArticle.translations.en;
                const progress = articleStates[activeArticle.id]?.progressPercent ?? 0;
                return (
                  <Surface className="p-6 sm:p-8">
                    {/* Reading Progress Bar */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          {copy.knowledge.categories[activeArticle.category]} · {activeArticle.readingMinutes}{' '}
                          {copy.knowledge.minRead}
                        </span>
                        <span className="font-mono tabular-nums">
                          {copy.knowledge.readingProgress}: {progress}%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[#2a3546]">
                        <div
                          className="h-full bg-[var(--kj-emerald)] transition-all duration-200"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                      {tr.title}
                    </h2>
                    <p className="mt-2 text-base text-slate-600 dark:text-slate-300">{tr.summary}</p>

                    <div className="mt-6 space-y-4 border-t border-slate-200 pt-6 text-[15px] leading-7 text-slate-800 dark:border-[#2b3442] dark:text-slate-200">
                      {tr.body.split('\n\n').map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}
                    </div>

                    {/* Reading Milestone Controls */}
                    <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 dark:border-[#2b3442]">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {copy.knowledge.readingProgress}:
                      </span>
                      {[25, 50, 75, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => void updateArticleProgress(activeArticle.id, pct)}
                          className={`rounded-md px-2.5 py-1 font-mono text-xs tabular-nums transition-colors cursor-pointer ${
                            progress >= pct
                              ? 'kj-btn-primary'
                              : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-[#2b3442] dark:text-slate-300 dark:hover:bg-[#202938]'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>

                    {activeArticle.codeExample && (
                      <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            {copy.knowledge.codeExample}
                          </h3>
                          <button
                            type="button"
                            onClick={() => void handleCopy(activeArticle.id, activeArticle.codeExample!)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--kj-green)] hover:underline cursor-pointer"
                          >
                            {copiedKey === activeArticle.id ? (
                              <>
                                <Check className="h-3.5 w-3.5" /> {t.common.copied}
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" /> {t.common.copy}
                              </>
                            )}
                          </button>
                        </div>
                        <pre
                          dir="ltr"
                          className="kj-code-window overflow-x-auto p-4 font-mono text-xs leading-6"
                        >
                          <code>{activeArticle.codeExample}</code>
                        </pre>
                      </div>
                    )}

                    {tr.keyTakeaways?.length > 0 && (
                      <div className="mt-6 border-t border-slate-200 pt-5 dark:border-[#2b3442]">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {copy.knowledge.keyTakeaways}
                        </h3>
                        <ul className="mt-2.5 list-disc space-y-1.5 ps-5 text-sm text-slate-700 dark:text-slate-300">
                          {tr.keyTakeaways.map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Surface>
                );
              })()}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Filter & Search Bar */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={articleSearch}
                    onChange={(e) => setArticleSearch(e.target.value)}
                    placeholder={copy.knowledge.searchPlaceholder}
                    className="w-full rounded-lg border border-slate-200 bg-white py-2 ps-9 pe-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-[#2b3442] dark:bg-[#1a202b] dark:text-white"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setArticleCategory('all')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      articleCategory === 'all'
                        ? 'kj-btn-primary'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#2b3442] dark:bg-[#1a202b] dark:text-slate-300'
                    }`}
                  >
                    {copy.knowledge.allCategories}
                  </button>
                  {ARTICLE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setArticleCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        articleCategory === cat
                          ? 'kj-btn-primary'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#2b3442] dark:bg-[#1a202b] dark:text-slate-300'
                      }`}
                    >
                      {copy.knowledge.categories[cat]}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setBookmarksOnly((v) => !v)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      bookmarksOnly
                        ? 'bg-violet-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#2b3442] dark:bg-[#1a202b] dark:text-slate-300'
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    <span>{copy.knowledge.bookmarksOnly}</span>
                  </button>
                </div>
              </div>

              {filteredArticles.length === 0 ? (
                <Surface className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  {copy.knowledge.noArticles}
                </Surface>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredArticles.map((art) => {
                    const tr = art.translations[locale] || art.translations.en;
                    const st = articleStates[art.id];
                    const progress = st?.progressPercent ?? 0;
                    const isBookmarked = Boolean(st?.bookmarked);
                    return (
                      <Surface key={art.id} className="flex flex-col justify-between p-5">
                        <div>
                          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span>
                              {copy.knowledge.categories[art.category]} · {art.readingMinutes}{' '}
                              {copy.knowledge.minRead}
                            </span>
                            <button
                              type="button"
                              aria-label={isBookmarked ? copy.knowledge.bookmarked : copy.knowledge.bookmark}
                              onClick={() => void toggleArticleBookmark(art.id)}
                              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-[var(--kj-green)] dark:text-slate-400 dark:hover:bg-[#202938] cursor-pointer"
                            >
                              {isBookmarked ? (
                                <BookmarkCheck className="h-4 w-4 text-[var(--kj-green)]" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          <h3 className="mt-2 text-base font-semibold text-slate-950 dark:text-white">
                            {tr.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {tr.summary}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-[#2b3442]">
                          <div className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>{st?.completed ? copy.knowledge.completed : copy.knowledge.readingProgress}</span>
                            <span className="font-mono tabular-nums">{progress}%</span>
                          </div>
                          <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[#2a3546]">
                            <div
                              className="h-full bg-[var(--kj-emerald)]"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full"
                            onClick={() => setActiveArticleId(art.id)}
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>{t.common.continueLearning}</span>
                          </Button>
                        </div>
                      </Surface>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. REFERENCES LIBRARY (HTML / CSS / JS)                               */}
      {/* ===================================================================== */}
      {section === 'references' && (
        <div className="grid gap-5 lg:grid-cols-12">
          {/* Index Sidebar */}
          <Surface className="flex flex-col p-4 lg:col-span-4">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={refSearch}
                onChange={(e) => setRefSearch(e.target.value)}
                placeholder={copy.references.searchPlaceholder}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 ps-9 pe-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
            </div>

            <div className="mt-3 flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-[#10141c]">
              {(['all', 'html', 'css', 'js'] as const).map((tr) => (
                <button
                  key={tr}
                  type="button"
                  onClick={() => setRefTrack(tr)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-semibold uppercase transition-colors cursor-pointer ${
                    refTrack === tr
                      ? 'kj-btn-primary'
                      : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {tr === 'all' ? copy.references.allTracks : tr}
                </button>
              ))}
            </div>

            <div className="mt-3 max-h-[540px] space-y-1 overflow-y-auto pe-1">
              {filteredRefs.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  {copy.references.noEntries}
                </p>
              ) : (
                filteredRefs.map((entry) => {
                  const selected = activeRef?.id === entry.id;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setSelectedRefId(entry.id)}
                      className={`w-full rounded-lg px-3 py-2.5 text-start transition-colors cursor-pointer ${
                        selected
                          ? 'kj-btn-primary'
                          : 'text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-[#202938]'
                      }`}
                    >
                      <div dir="ltr" className="font-mono text-xs font-semibold">
                        {entry.symbol}
                      </div>
                      <div
                        className={`mt-0.5 text-[11px] ${
                          selected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {entry.track.toUpperCase()} · {entry.category}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </Surface>

          {/* Reference Detail View */}
          <div className="lg:col-span-8">
            {activeRef ? (
              (() => {
                const tr = activeRef.translations[locale] || activeRef.translations.en;
                return (
                  <Surface className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {activeRef.track.toUpperCase()} · {activeRef.category}
                        </p>
                        <h2
                          dir="ltr"
                          className="mt-1 font-mono text-xl font-bold text-slate-950 dark:text-white"
                        >
                          {activeRef.symbol}
                        </h2>
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          openCodeInEditor({
                            html: activeRef.exampleHtml || '',
                            css: activeRef.exampleCss || '',
                            js: activeRef.exampleJs || '',
                          })
                        }
                      >
                        <Code2 className="h-4 w-4" />
                        <span>{copy.references.tryInEditor}</span>
                      </Button>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                      {tr.summary}
                    </p>

                    <div className="mt-5">
                      <div className="mb-1.5 flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {copy.references.syntax}
                        </h3>
                        <button
                          type="button"
                          onClick={() => void handleCopy(activeRef.id, activeRef.syntax)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--kj-green)] hover:underline cursor-pointer"
                        >
                          {copiedKey === activeRef.id ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> {t.common.copied}
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" /> {t.common.copy}
                            </>
                          )}
                        </button>
                      </div>
                      <pre
                        dir="ltr"
                        className="kj-code-window overflow-x-auto p-4 font-mono text-xs"
                      >
                        <code>{activeRef.syntax}</code>
                      </pre>
                    </div>

                    <div className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2 dark:border-[#2b3442]">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {copy.references.details}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {tr.details}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {copy.references.notes}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {tr.notes}
                        </p>
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                          {copy.references.browserSupport}: {activeRef.browserSupport}
                        </p>
                      </div>
                    </div>

                    {/* Sandboxed Live Preview of Reference Example */}
                    <div className="mt-5 border-t border-slate-200 pt-5 dark:border-[#2b3442]">
                      <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                        {copy.references.liveExample}
                      </h3>
                      <iframe
                        title={`Reference preview: ${activeRef.symbol}`}
                        sandbox="allow-scripts"
                        srcDoc={buildSandboxedDoc(
                          activeRef.exampleHtml || '',
                          activeRef.exampleCss || '',
                          activeRef.exampleJs || ''
                        )}
                        className="h-44 w-full rounded-xl border border-slate-200 bg-white dark:border-[#2b3442]"
                      />
                    </div>
                  </Surface>
                );
              })()
            ) : (
              <Surface className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                {copy.references.noEntries}
              </Surface>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. AI TOOLS DIRECTORY (VERIFIED OFFICIAL LINKS ONLY)                  */}
      {/* ===================================================================== */}
      {section === 'ai-tools' && (
        <div className="space-y-5">
          <div className="kj-callout rounded-[6px] px-4 py-3 text-xs">
            {copy.aiTools.officialLinkNotice}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                placeholder={copy.aiTools.searchPlaceholder}
                className="w-full rounded-lg border border-slate-200 bg-white py-2 ps-9 pe-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-[#2b3442] dark:bg-[#1a202b] dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setToolCategory('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                  toolCategory === 'all'
                    ? 'kj-btn-primary'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#2b3442] dark:bg-[#1a202b] dark:text-slate-300'
                }`}
              >
                {copy.aiTools.allCategories}
              </button>
              {AI_TOOL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setToolCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                    toolCategory === cat
                      ? 'kj-btn-primary'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#2b3442] dark:bg-[#1a202b] dark:text-slate-300'
                  }`}
                >
                  {copy.aiTools.categories[cat]}
                </button>
              ))}
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <Surface className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {copy.aiTools.noTools}
            </Surface>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => {
                const tr = tool.translations[locale] || tool.translations.en;
                const domain = (() => {
                  try {
                    return new URL(tool.officialUrl).hostname;
                  } catch {
                    return tool.officialUrl;
                  }
                })();
                return (
                  <Surface key={tool.id} className="flex flex-col justify-between p-5">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {copy.aiTools.categories[tool.category]} · {copy.aiTools.pricing[tool.pricingModel]}
                      </p>
                      <h3 className="mt-1.5 text-base font-semibold text-slate-950 dark:text-white">
                        {tool.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">
                        {tr.tagline}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {tr.description}
                      </p>
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {copy.aiTools.bestFor}:
                        </span>{' '}
                        {tr.bestFor}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-[#2b3442]">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="font-mono">{domain}</div>
                        <div className="font-mono tabular-nums">
                          {copy.aiTools.lastVerified}: {tool.lastVerifiedAt}
                        </div>
                      </div>
                      <a
                        href={tool.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="kj-btn-primary inline-flex items-center gap-1.5 rounded-[5px] px-3 py-2 text-xs whitespace-nowrap shrink-0"
                      >
                        <span>{copy.aiTools.visitOfficial}</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </Surface>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. PROJECTS & CODE LIBRARY (WITH MODERATION)                          */}
      {/* ===================================================================== */}
      {section === 'projects' && (
        <div className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-64 sm:w-72">
                <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={projSearch}
                  onChange={(e) => setProjSearch(e.target.value)}
                  placeholder={copy.projects.searchPlaceholder}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 ps-9 pe-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-[#2b3442] dark:bg-[#1a202b] dark:text-white"
                />
              </div>

              {(['all', 'html', 'css', 'js', 'fullstack-web'] as const).map((tr) => (
                <button
                  key={tr}
                  type="button"
                  onClick={() => setProjTrack(tr)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium uppercase whitespace-nowrap cursor-pointer ${
                    projTrack === tr
                      ? 'kj-btn-primary'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-[#2b3442] dark:bg-[#1a202b] dark:text-slate-300'
                  }`}
                >
                  {tr === 'all' ? copy.projects.allTracks : tr}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {firebaseUser && (
                <Button
                  variant={showMineOnly ? 'violet' : 'secondary'}
                  size="sm"
                  onClick={() => setShowMineOnly((v) => !v)}
                >
                  <span>
                    {copy.projects.mySubmissions} ({mySubmittedProjects.length})
                  </span>
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => {
                  if (!firebaseUser) {
                    setAuthModalOpen(true);
                    return;
                  }
                  setSubmitModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                <span>{copy.projects.submitProject}</span>
              </Button>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">{copy.projects.moderationNotice}</p>

          {filteredProjects.length === 0 ? (
            <Surface className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              {copy.projects.noProjects}
            </Surface>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {filteredProjects.map((proj) => {
                const loc = proj.translations?.[locale];
                const title = loc?.title || proj.title;
                const desc = loc?.description || proj.description;
                return (
                  <Surface key={proj.id} className="flex flex-col justify-between overflow-hidden">
                    <div className="p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          {proj.isOfficial ? copy.projects.officialLabel : copy.projects.communityLabel} ·{' '}
                          {proj.track.toUpperCase()} · {proj.difficulty} · {proj.authorName}
                        </span>
                        {showMineOnly && (
                          <span
                            className={`font-semibold ${
                              proj.status === 'approved'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : proj.status === 'rejected'
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {copy.projects.statusLabels[proj.status]}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-1.5 text-base font-semibold text-slate-950 dark:text-white">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {desc}
                      </p>

                      {proj.status === 'rejected' && proj.moderationReason && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                          {proj.moderationReason}
                        </p>
                      )}

                      {proj.tags && proj.tags.length > 0 && (
                        <p className="mt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {proj.tags.join(' · ')}
                        </p>
                      )}
                    </div>

                    <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-3 flex flex-wrap items-center justify-between gap-2 dark:border-[#2b3442] dark:bg-[#151b26]">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPreviewProject(proj)}
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>{copy.projects.livePreview}</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          openCodeInEditor({
                            html: proj.html,
                            css: proj.css,
                            js: proj.js,
                          })
                        }
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        <span>{copy.projects.openInEditor}</span>
                      </Button>
                    </div>
                  </Surface>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sandboxed Live Preview Modal for Projects */}
      <Modal
        open={Boolean(previewProject)}
        onClose={() => setPreviewProject(null)}
        title={previewProject ? previewProject.translations?.[locale]?.title || previewProject.title : ''}
        maxWidthClass="max-w-3xl"
      >
        {previewProject && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {previewProject.track.toUpperCase()} · {previewProject.difficulty} · {previewProject.authorName}
            </p>
            <iframe
              title={`Preview: ${previewProject.title}`}
              sandbox="allow-scripts"
              srcDoc={buildSandboxedDoc(previewProject.html, previewProject.css, previewProject.js)}
              className="h-80 w-full rounded-xl border border-slate-200 bg-white dark:border-[#2b3442]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPreviewProject(null)}>
                {t.common.close}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  const target = previewProject;
                  setPreviewProject(null);
                  openCodeInEditor({ html: target.html, css: target.css, js: target.js });
                }}
              >
                <Code2 className="h-4 w-4" />
                <span>{copy.projects.openInEditor}</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Community Project Submission Modal */}
      <Modal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        title={copy.projects.submitTitle}
        maxWidthClass="max-w-2xl"
      >
        <form onSubmit={handleSubmitProject} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">{copy.projects.moderationNotice}</p>

          {submitBanner && (
            <div
              className={`rounded-lg px-3 py-2 text-xs font-medium ${
                submitBanner.type === 'ok'
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
              }`}
            >
              {submitBanner.text}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                {copy.projects.projectTitle}
              </label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={120}
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {copy.projects.track}
                </label>
                <select
                  value={formTrack}
                  onChange={(e) => setFormTrack(e.target.value as ProjectTrack)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                >
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="js">JavaScript</option>
                  <option value="fullstack-web">HTML+CSS+JS</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {copy.projects.difficulty}
                </label>
                <select
                  value={formDifficulty}
                  onChange={(e) =>
                    setFormDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
              {copy.projects.projectDescription}
            </label>
            <textarea
              required
              minLength={10}
              maxLength={1000}
              rows={2}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
              {copy.projects.tagsPlaceholder}
            </label>
            <input
              type="text"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
            />
          </div>

          <div className="grid gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">HTML</label>
              <textarea
                dir="ltr"
                rows={3}
                value={formHtml}
                onChange={(e) => setFormHtml(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-[var(--kj-code-bg)] px-3 py-2 font-mono text-xs text-[var(--kj-code-ink)] border-[var(--kj-code-border)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">CSS</label>
              <textarea
                dir="ltr"
                rows={3}
                value={formCss}
                onChange={(e) => setFormCss(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-[var(--kj-code-bg)] px-3 py-2 font-mono text-xs text-[var(--kj-code-ink)] border-[var(--kj-code-border)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">JavaScript</label>
              <textarea
                dir="ltr"
                rows={3}
                value={formJs}
                onChange={(e) => setFormJs(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-[var(--kj-code-bg)] px-3 py-2 font-mono text-xs text-[var(--kj-code-ink)] border-[var(--kj-code-border)]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setSubmitModalOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? t.common.loading : t.common.submit}
            </Button>
          </div>
        </form>
      </Modal>
      </div>
    </div>
  );
};
