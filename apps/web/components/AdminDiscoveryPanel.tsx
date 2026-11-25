import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Trash2,
  Database,
  Eye,
  ShieldCheck,
  Edit3,
  Plus,
} from 'lucide-react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useApp } from '../context/AppContext';
import { DISCOVERY_COPY } from '../i18n/discoveryCopy';
import {
  isSafeOfficialHttpsUrl,
  SEED_AI_TOOLS,
  SEED_KNOWLEDGE_ARTICLES,
  SEED_PROJECTS,
  SEED_REFERENCES,
} from '../data/discoverySeed';
import type {
  AiTool,
  AiToolCategory,
  ArticleCategory,
  CodeProject,
  KnowledgeArticle,
  ProjectModerationStatus,
  ProjectTrack,
  ReferenceEntry,
  TrackId,
} from '../types/domain';
import { Button, Modal, Surface } from './ui/Primitives';

interface AdminDiscoveryPanelProps {
  onAudit: (
    action: string,
    targetCollection: string,
    targetId: string,
    reason?: string,
    before?: Record<string, unknown>,
    after?: Record<string, unknown>
  ) => Promise<void>;
  onBanner: (type: 'ok' | 'err', text: string) => void;
}

type SubTab = 'articles' | 'references' | 'tools' | 'projects';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildPreviewDoc(html: string, css: string, js: string): string {
  const safeJs = js.replace(/<\/script>/gi, '<\\/script>');
  return `<!doctype html><html><head><meta charset="utf-8"/><style>${css}</style></head><body>${html}<script>try{${safeJs}}catch(e){document.body.append(String(e))}</script></body></html>`;
}

export const AdminDiscoveryPanel: React.FC<AdminDiscoveryPanelProps> = ({ onAudit, onBanner }) => {
  const { locale, firebaseUser, staffRole, refreshCatalog } = useApp();
  const copy = DISCOVERY_COPY[locale].admin;
  const isPaymentAdmin = staffRole === 'super_admin' || staffRole === 'admin';

  const [subTab, setSubTab] = useState<SubTab>('articles');
  const [seeding, setSeeding] = useState(false);

  // Live admin collections
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [references, setReferences] = useState<ReferenceEntry[]>([]);
  const [tools, setTools] = useState<AiTool[]>([]);
  const [projects, setProjects] = useState<CodeProject[]>([]);
  const [projectFilter, setProjectFilter] = useState<ProjectModerationStatus | 'all'>('pending');

  // Article editor state
  const [artId, setArtId] = useState('');
  const [artCategory, setArtCategory] = useState<ArticleCategory>('web-architecture');
  const [artMinutes, setArtMinutes] = useState(5);
  const [artPublished, setArtPublished] = useState(true);
  const [artTitleEn, setArtTitleEn] = useState('');
  const [artTitleAr, setArtTitleAr] = useState('');
  const [artTitleCkb, setArtTitleCkb] = useState('');
  const [artTitleKmr, setArtTitleKmr] = useState('');
  const [artSummaryEn, setArtSummaryEn] = useState('');
  const [artBodyEn, setArtBodyEn] = useState('');
  const [artCode, setArtCode] = useState('');

  // Reference editor state
  const [refId, setRefId] = useState('');
  const [refTrack, setRefTrack] = useState<TrackId>('html');
  const [refCategory, setRefCategory] = useState('Semantic Landmarks');
  const [refSymbol, setRefSymbol] = useState('');
  const [refSyntax, setRefSyntax] = useState('');
  const [refSupport, setRefSupport] = useState('All modern browsers');
  const [refSummaryEn, setRefSummaryEn] = useState('');
  const [refDetailsEn, setRefDetailsEn] = useState('');
  const [refNotesEn, setRefNotesEn] = useState('');
  const [refHtml, setRefHtml] = useState('');
  const [refCss, setRefCss] = useState('');
  const [refJs, setRefJs] = useState('');
  const [refPublished, setRefPublished] = useState(true);

  // AI Tool editor state
  const [toolId, setToolId] = useState('');
  const [toolName, setToolName] = useState('');
  const [toolCategory, setToolCategory] = useState<AiToolCategory>('coding');
  const [toolUrl, setToolUrl] = useState('https://');
  const [toolPricing, setToolPricing] = useState<'free' | 'freemium' | 'paid' | 'open_source'>('freemium');
  const [toolVerifiedAt, setToolVerifiedAt] = useState(todayIso());
  const [toolTaglineEn, setToolTaglineEn] = useState('');
  const [toolDescEn, setToolDescEn] = useState('');
  const [toolBestForEn, setToolBestForEn] = useState('');
  const [toolPublished, setToolPublished] = useState(true);

  // Official Project editor & moderation state
  const [projId, setProjId] = useState('');
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTrack, setProjTrack] = useState<ProjectTrack>('js');
  const [projDiff, setProjDiff] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [projTags, setProjTags] = useState('html, css, js');
  const [projHtml, setProjHtml] = useState('<div class="demo">Official Project</div>');
  const [projCss, setProjCss] = useState('body { font-family: sans-serif; padding: 16px; }');
  const [projJs, setProjJs] = useState('');
  const [reviewingProject, setReviewingProject] = useState<CodeProject | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const u1 = onSnapshot(
      collection(db, 'knowledge_articles'),
      (snap) => setArticles(snap.docs.map((d) => d.data() as KnowledgeArticle)),
      () => {}
    );
    const u2 = onSnapshot(
      collection(db, 'reference_entries'),
      (snap) => setReferences(snap.docs.map((d) => d.data() as ReferenceEntry)),
      () => {}
    );
    const u3 = onSnapshot(
      collection(db, 'ai_tools'),
      (snap) => setTools(snap.docs.map((d) => d.data() as AiTool)),
      () => {}
    );
    const u4 = onSnapshot(
      collection(db, 'code_projects'),
      (snap) => setProjects(snap.docs.map((d) => d.data() as CodeProject)),
      () => {}
    );
    return () => {
      u1();
      u2();
      u3();
      u4();
    };
  }, []);

  const handleSeedPhase5 = async () => {
    if (!firebaseUser) return;
    setSeeding(true);
    try {
      for (const art of SEED_KNOWLEDGE_ARTICLES) {
        await setDoc(doc(db, 'knowledge_articles', art.id), {
          ...art,
          authorUid: firebaseUser.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      for (const r of SEED_REFERENCES) {
        await setDoc(doc(db, 'reference_entries', r.id), {
          ...r,
          updatedAt: serverTimestamp(),
        });
      }
      for (const tool of SEED_AI_TOOLS) {
        await setDoc(doc(db, 'ai_tools', tool.id), {
          ...tool,
          verifiedBy: firebaseUser.uid,
          updatedAt: serverTimestamp(),
        });
      }
      for (const proj of SEED_PROJECTS) {
        await setDoc(doc(db, 'code_projects', proj.id), {
          ...proj,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await onAudit('seed_phase5_discovery', 'discovery', 'phase5', 'Seeded Knowledge Center, References, AI Tools, and Official Projects');
      await refreshCatalog();
      onBanner('ok', 'Phase 5 Discovery catalog synced to Firestore (articles, references, verified AI tools, and official projects).');
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Phase 5 seed failed.');
    } finally {
      setSeeding(false);
    }
  };

  // --- Knowledge Articles CRUD ---
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !artTitleEn.trim()) return;
    const cleanId = (artId.trim() || `art-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '-');
    const baseEn = {
      title: artTitleEn.trim(),
      summary: artSummaryEn.trim() || artTitleEn.trim(),
      body: artBodyEn.trim() || artSummaryEn.trim() || artTitleEn.trim(),
      keyTakeaways: ['Practical engineering takeaways included in this guide.'],
    };
    try {
      await setDoc(doc(db, 'knowledge_articles', cleanId), {
        id: cleanId,
        slug: cleanId.toLowerCase(),
        category: artCategory,
        readingMinutes: Math.max(1, Math.min(90, Number(artMinutes) || 5)),
        published: artPublished,
        featured: false,
        codeExample: artCode.trim() || null,
        translations: {
          en: baseEn,
          ar: { ...baseEn, title: artTitleAr.trim() || baseEn.title },
          ckb: { ...baseEn, title: artTitleCkb.trim() || baseEn.title },
          kmr: { ...baseEn, title: artTitleKmr.trim() || baseEn.title },
        },
        authorUid: firebaseUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await onAudit('save_knowledge_article', 'knowledge_articles', cleanId);
      await refreshCatalog();
      setArtId('');
      setArtTitleEn('');
      setArtTitleAr('');
      setArtTitleCkb('');
      setArtTitleKmr('');
      setArtSummaryEn('');
      setArtBodyEn('');
      setArtCode('');
      onBanner('ok', `Saved knowledge article "${cleanId}".`);
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Failed to save article.');
    }
  };

  // --- References CRUD ---
  const handleSaveReference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refSymbol.trim() || !refSyntax.trim()) return;
    const cleanId = (refId.trim() || `ref-${refTrack}-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '-');
    const tr = {
      summary: refSummaryEn.trim() || `${refSymbol.trim()} reference entry`,
      details: refDetailsEn.trim() || refSummaryEn.trim() || 'Technical reference documentation.',
      notes: refNotesEn.trim() || 'Standard web specification behavior.',
    };
    try {
      await setDoc(doc(db, 'reference_entries', cleanId), {
        id: cleanId,
        track: refTrack,
        category: refCategory.trim() || 'General',
        symbol: refSymbol.trim(),
        syntax: refSyntax.trim(),
        exampleHtml: refHtml,
        exampleCss: refCss,
        exampleJs: refJs,
        browserSupport: refSupport.trim() || 'All modern browsers',
        published: refPublished,
        translations: { en: tr, ar: tr, ckb: tr, kmr: tr },
        updatedAt: serverTimestamp(),
      });
      await onAudit('save_reference_entry', 'reference_entries', cleanId);
      await refreshCatalog();
      setRefId('');
      setRefSymbol('');
      setRefSyntax('');
      setRefSummaryEn('');
      setRefDetailsEn('');
      setRefNotesEn('');
      onBanner('ok', `Saved reference "${refSymbol.trim()}".`);
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Failed to save reference.');
    }
  };

  // --- AI Tools CRUD (Strict Official HTTPS Verification) ---
  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    if (!isSafeOfficialHttpsUrl(toolUrl)) {
      onBanner('err', copy.httpsOnlyError);
      return;
    }
    const cleanId = (toolId.trim() || `tool-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '-');
    const tr = {
      tagline: toolTaglineEn.trim() || toolName.trim(),
      description: toolDescEn.trim() || toolTaglineEn.trim(),
      bestFor: toolBestForEn.trim() || 'Developers and learners',
    };
    try {
      await setDoc(doc(db, 'ai_tools', cleanId), {
        id: cleanId,
        name: toolName.trim(),
        category: toolCategory,
        officialUrl: toolUrl.trim(),
        pricingModel: toolPricing,
        lastVerifiedAt: toolVerifiedAt || todayIso(),
        verifiedBy: firebaseUser.uid,
        published: toolPublished,
        translations: { en: tr, ar: tr, ckb: tr, kmr: tr },
        updatedAt: serverTimestamp(),
      });
      await onAudit('save_ai_tool', 'ai_tools', cleanId, `Verified official URL ${toolUrl.trim()}`);
      await refreshCatalog();
      setToolId('');
      setToolName('');
      setToolUrl('https://');
      setToolTaglineEn('');
      setToolDescEn('');
      setToolBestForEn('');
      setToolVerifiedAt(todayIso());
      onBanner('ok', `Saved verified AI tool "${toolName.trim()}".`);
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Failed to save AI tool.');
    }
  };

  const handleMarkToolVerifiedToday = async (tool: AiTool) => {
    if (!firebaseUser) return;
    const today = todayIso();
    try {
      await updateDoc(doc(db, 'ai_tools', tool.id), {
        lastVerifiedAt: today,
        verifiedBy: firebaseUser.uid,
        updatedAt: serverTimestamp(),
      });
      await onAudit('verify_ai_tool_link', 'ai_tools', tool.id, `Re-verified ${tool.officialUrl} on ${today}`);
      await refreshCatalog();
      onBanner('ok', `Updated last-verified date for ${tool.name} to ${today}.`);
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Failed to update verification date.');
    }
  };

  // --- Official Project CRUD & Community Moderation ---
  const handleSaveOfficialProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    const cleanId = (projId.trim() || `proj-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '-');
    const tags = projTags
      .split(',')
      .map((s) => s.trim().slice(0, 24))
      .filter(Boolean)
      .slice(0, 6);
    try {
      await setDoc(doc(db, 'code_projects', cleanId), {
        id: cleanId,
        title: projTitle.trim(),
        description: projDesc.trim(),
        track: projTrack,
        difficulty: projDiff,
        tags,
        html: projHtml,
        css: projCss,
        js: projJs,
        authorUid: firebaseUser.uid,
        authorName: 'KARÊJAN Team',
        isOfficial: true,
        status: 'approved',
        moderatedBy: firebaseUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await onAudit('save_official_project', 'code_projects', cleanId);
      await refreshCatalog();
      setProjId('');
      setProjTitle('');
      setProjDesc('');
      onBanner('ok', `Published official project "${projTitle.trim()}".`);
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Failed to save project.');
    }
  };

  const handleModerateProject = async (proj: CodeProject, status: 'approved' | 'rejected') => {
    if (!firebaseUser) return;
    if (status === 'rejected' && rejectReason.trim().length < 3) {
      onBanner('err', 'Please provide a short rejection reason (at least 3 characters).');
      return;
    }
    try {
      await updateDoc(doc(db, 'code_projects', proj.id), {
        status,
        moderationReason: status === 'rejected' ? rejectReason.trim() : 'Approved by KARÊJAN staff',
        moderatedBy: firebaseUser.uid,
        updatedAt: serverTimestamp(),
      });
      await onAudit(
        status === 'approved' ? 'project_approved' : 'project_rejected',
        'code_projects',
        proj.id,
        status === 'rejected' ? rejectReason.trim() : 'Approved for public library',
        { status: proj.status },
        { status }
      );
      await refreshCatalog();
      setReviewingProject(null);
      setRejectReason('');
      onBanner('ok', `Project "${proj.title}" marked as ${status}.`);
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Moderation update failed.');
    }
  };

  const handleDeleteDoc = async (colName: string, docId: string) => {
    try {
      await deleteDoc(doc(db, colName, docId));
      await onAudit(`delete_${colName}`, colName, docId);
      await refreshCatalog();
      onBanner('ok', `Deleted ${docId} from ${colName}.`);
    } catch (err) {
      onBanner('err', err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const pendingProjectsCount = projects.filter((p) => p.status === 'pending').length;
  const visibleProjects =
    projectFilter === 'all' ? projects : projects.filter((p) => p.status === projectFilter);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-[#2b3442] dark:bg-[#151b26]">
          {(
            [
              { id: 'articles', label: `${copy.articlesTab} (${articles.length})` },
              { id: 'references', label: `${copy.referencesTab} (${references.length})` },
              { id: 'tools', label: `${copy.aiToolsTab} (${tools.length})` },
              {
                id: 'projects',
                label: `${copy.projectsTab} (${pendingProjectsCount} pending)`,
              },
            ] as { id: SubTab; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubTab(item.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer ${
                subTab === item.id
                  ? 'kj-btn-primary'
                  : 'text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <Button variant="secondary" size="sm" onClick={handleSeedPhase5} disabled={seeding}>
          <Database className="h-4 w-4" />
          <span>{seeding ? 'Syncing...' : copy.seedPhase5}</span>
        </Button>
      </div>

      {/* 1. KNOWLEDGE ARTICLES CMS */}
      {subTab === 'articles' && (
        <div className="grid gap-5 lg:grid-cols-12">
          <Surface className="p-5 lg:col-span-5">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{copy.createNew}</h3>
            <form onSubmit={handleSaveArticle} className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Article ID (optional)"
                  value={artId}
                  onChange={(e) => setArtId(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                />
                <select
                  value={artCategory}
                  onChange={(e) => setArtCategory(e.target.value as ArticleCategory)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                >
                  <option value="web-architecture">Web Architecture</option>
                  <option value="performance">Performance</option>
                  <option value="security">Security</option>
                  <option value="ai-engineering">AI Engineering</option>
                  <option value="tooling">Developer Tooling</option>
                </select>
              </div>
              <input
                type="text"
                required
                placeholder="Title (English)"
                value={artTitleEn}
                onChange={(e) => setArtTitleEn(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Title (AR)"
                  value={artTitleAr}
                  onChange={(e) => setArtTitleAr(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Title (CKB)"
                  value={artTitleCkb}
                  onChange={(e) => setArtTitleCkb(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Title (KMR)"
                  value={artTitleKmr}
                  onChange={(e) => setArtTitleKmr(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Summary (English)"
                value={artSummaryEn}
                onChange={(e) => setArtSummaryEn(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <textarea
                rows={4}
                placeholder="Article body (separate paragraphs with blank line)"
                value={artBodyEn}
                onChange={(e) => setArtBodyEn(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <textarea
                dir="ltr"
                rows={3}
                placeholder="Optional untranslated code example"
                value={artCode}
                onChange={(e) => setArtCode(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100 dark:border-[#2b3442]"
              />
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <span>Minutes:</span>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={artMinutes}
                    onChange={(e) => setArtMinutes(Number(e.target.value))}
                    className="w-16 rounded border border-slate-200 bg-white px-2 py-1 text-xs dark:border-[#2b3442] dark:bg-[#10141c]"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={artPublished}
                    onChange={(e) => setArtPublished(e.target.checked)}
                  />
                  <span>{copy.publishedLabel}</span>
                </label>
              </div>
              <Button type="submit" size="sm" className="w-full">
                <Plus className="h-4 w-4" />
                <span>{copy.saveEntry}</span>
              </Button>
            </form>
          </Surface>

          <Surface className="p-5 lg:col-span-7">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              {copy.articlesTab} ({articles.length})
            </h3>
            <div className="mt-3 space-y-2">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3.5 py-2.5 dark:border-[#2b3442]"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {art.translations.en?.title || art.id}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {art.category} · {art.readingMinutes} min ·{' '}
                      {art.published ? copy.publishedLabel : copy.draftLabel}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setArtId(art.id);
                        setArtCategory(art.category);
                        setArtMinutes(art.readingMinutes);
                        setArtPublished(art.published);
                        setArtTitleEn(art.translations.en?.title || '');
                        setArtTitleAr(art.translations.ar?.title || '');
                        setArtTitleCkb(art.translations.ckb?.title || '');
                        setArtTitleKmr(art.translations.kmr?.title || '');
                        setArtSummaryEn(art.translations.en?.summary || '');
                        setArtBodyEn(art.translations.en?.body || '');
                        setArtCode(art.codeExample || '');
                      }}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    {isPaymentAdmin && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => void handleDeleteDoc('knowledge_articles', art.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      )}

      {/* 2. REFERENCES LIBRARY CMS */}
      {subTab === 'references' && (
        <div className="grid gap-5 lg:grid-cols-12">
          <Surface className="p-5 lg:col-span-5">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{copy.createNew}</h3>
            <form onSubmit={handleSaveReference} className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Ref ID (optional)"
                  value={refId}
                  onChange={(e) => setRefId(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                />
                <select
                  value={refTrack}
                  onChange={(e) => setRefTrack(e.target.value as TrackId)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                >
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="js">JavaScript</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Symbol (e.g. <dialog>)"
                  value={refSymbol}
                  onChange={(e) => setRefSymbol(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={refCategory}
                  onChange={(e) => setRefCategory(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                />
              </div>
              <input
                type="text"
                required
                dir="ltr"
                placeholder="Syntax signature"
                value={refSyntax}
                onChange={(e) => setRefSyntax(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-950 px-3 py-2 font-mono text-xs text-blue-200 dark:border-[#2b3442]"
              />
              <input
                type="text"
                placeholder="Summary"
                value={refSummaryEn}
                onChange={(e) => setRefSummaryEn(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <textarea
                rows={2}
                placeholder="Details"
                value={refDetailsEn}
                onChange={(e) => setRefDetailsEn(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <input
                type="text"
                placeholder="Practical notes"
                value={refNotesEn}
                onChange={(e) => setRefNotesEn(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <input
                type="text"
                placeholder="Browser support"
                value={refSupport}
                onChange={(e) => setRefSupport(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <textarea
                dir="ltr"
                rows={2}
                placeholder="Example HTML"
                value={refHtml}
                onChange={(e) => setRefHtml(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-100 dark:border-[#2b3442]"
              />
              <textarea
                dir="ltr"
                rows={2}
                placeholder="Example CSS"
                value={refCss}
                onChange={(e) => setRefCss(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-100 dark:border-[#2b3442]"
              />
              <textarea
                dir="ltr"
                rows={2}
                placeholder="Example JS"
                value={refJs}
                onChange={(e) => setRefJs(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-100 dark:border-[#2b3442]"
              />
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={refPublished}
                  onChange={(e) => setRefPublished(e.target.checked)}
                />
                <span>{copy.publishedLabel}</span>
              </label>
              <Button type="submit" size="sm" className="w-full">
                {copy.saveEntry}
              </Button>
            </form>
          </Surface>

          <Surface className="p-5 lg:col-span-7">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              {copy.referencesTab} ({references.length})
            </h3>
            <div className="mt-3 space-y-2">
              {references.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3.5 py-2.5 dark:border-[#2b3442]"
                >
                  <div>
                    <p dir="ltr" className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                      {r.symbol}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {r.track.toUpperCase()} · {r.category} ·{' '}
                      {r.published ? copy.publishedLabel : copy.draftLabel}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setRefId(r.id);
                        setRefTrack(r.track);
                        setRefCategory(r.category);
                        setRefSymbol(r.symbol);
                        setRefSyntax(r.syntax);
                        setRefSupport(r.browserSupport);
                        setRefSummaryEn(r.translations.en?.summary || '');
                        setRefDetailsEn(r.translations.en?.details || '');
                        setRefNotesEn(r.translations.en?.notes || '');
                        setRefHtml(r.exampleHtml || '');
                        setRefCss(r.exampleCss || '');
                        setRefJs(r.exampleJs || '');
                        setRefPublished(r.published);
                      }}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    {isPaymentAdmin && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => void handleDeleteDoc('reference_entries', r.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      )}

      {/* 3. AI TOOLS DIRECTORY CMS */}
      {subTab === 'tools' && (
        <div className="grid gap-5 lg:grid-cols-12">
          <Surface className="p-5 lg:col-span-5">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">{copy.createNew}</h3>
            <form onSubmit={handleSaveTool} className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Tool ID (optional)"
                  value={toolId}
                  onChange={(e) => setToolId(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                />
                <input
                  type="text"
                  required
                  placeholder="Tool Name"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                />
              </div>
              <input
                type="url"
                required
                dir="ltr"
                placeholder="https://official-domain.com"
                value={toolUrl}
                onChange={(e) => setToolUrl(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={toolCategory}
                  onChange={(e) => setToolCategory(e.target.value as AiToolCategory)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                >
                  <option value="coding">Coding</option>
                  <option value="models">Models</option>
                  <option value="research">Research</option>
                  <option value="design">Design</option>
                  <option value="writing">Writing</option>
                  <option value="productivity">Productivity</option>
                </select>
                <select
                  value={toolPricing}
                  onChange={(e) =>
                    setToolPricing(e.target.value as 'free' | 'freemium' | 'paid' | 'open_source')
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                >
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                  <option value="open_source">Open Source</option>
                </select>
                <input
                  type="date"
                  required
                  value={toolVerifiedAt}
                  onChange={(e) => setToolVerifiedAt(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 font-mono text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                />
              </div>
              <input
                type="text"
                required
                placeholder="Tagline"
                value={toolTaglineEn}
                onChange={(e) => setToolTaglineEn(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <textarea
                rows={2}
                placeholder="Description"
                value={toolDescEn}
                onChange={(e) => setToolDescEn(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <input
                type="text"
                placeholder="Best for..."
                value={toolBestForEn}
                onChange={(e) => setToolBestForEn(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={toolPublished}
                  onChange={(e) => setToolPublished(e.target.checked)}
                />
                <span>{copy.publishedLabel}</span>
              </label>
              <Button type="submit" size="sm" className="w-full">
                {copy.saveEntry}
              </Button>
            </form>
          </Surface>

          <Surface className="p-5 lg:col-span-7">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              {copy.aiToolsTab} ({tools.length})
            </h3>
            <div className="mt-3 space-y-2">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3.5 py-2.5 dark:border-[#2b3442]"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{tool.name}</p>
                    <p dir="ltr" className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {tool.officialUrl} · Verified {tool.lastVerifiedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => void handleMarkToolVerifiedToday(tool)}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{copy.markVerifiedToday}</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setToolId(tool.id);
                        setToolName(tool.name);
                        setToolCategory(tool.category);
                        setToolUrl(tool.officialUrl);
                        setToolPricing(tool.pricingModel);
                        setToolVerifiedAt(tool.lastVerifiedAt);
                        setToolTaglineEn(tool.translations.en?.tagline || '');
                        setToolDescEn(tool.translations.en?.description || '');
                        setToolBestForEn(tool.translations.en?.bestFor || '');
                        setToolPublished(tool.published);
                      }}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    {isPaymentAdmin && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => void handleDeleteDoc('ai_tools', tool.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      )}

      {/* 4. PROJECTS & MODERATION QUEUE CMS */}
      {subTab === 'projects' && (
        <div className="grid gap-5 lg:grid-cols-12">
          <Surface className="p-5 lg:col-span-5">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
              Publish Official Project
            </h3>
            <form onSubmit={handleSaveOfficialProject} className="mt-3 space-y-3">
              <input
                type="text"
                placeholder="Project ID (optional)"
                value={projId}
                onChange={(e) => setProjId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <input
                type="text"
                required
                minLength={3}
                placeholder="Project title"
                value={projTitle}
                onChange={(e) => setProjTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <textarea
                required
                minLength={10}
                rows={2}
                placeholder="Project description"
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={projTrack}
                  onChange={(e) => setProjTrack(e.target.value as ProjectTrack)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                >
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="js">JavaScript</option>
                  <option value="fullstack-web">HTML+CSS+JS</option>
                </select>
                <select
                  value={projDiff}
                  onChange={(e) =>
                    setProjDiff(e.target.value as 'beginner' | 'intermediate' | 'advanced')
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={projTags}
                onChange={(e) => setProjTags(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
              <textarea
                dir="ltr"
                rows={2}
                placeholder="HTML"
                value={projHtml}
                onChange={(e) => setProjHtml(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-100 dark:border-[#2b3442]"
              />
              <textarea
                dir="ltr"
                rows={2}
                placeholder="CSS"
                value={projCss}
                onChange={(e) => setProjCss(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-100 dark:border-[#2b3442]"
              />
              <textarea
                dir="ltr"
                rows={2}
                placeholder="JavaScript"
                value={projJs}
                onChange={(e) => setProjJs(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-950 px-3 py-1.5 font-mono text-xs text-slate-100 dark:border-[#2b3442]"
              />
              <Button type="submit" size="sm" className="w-full">
                {copy.saveEntry}
              </Button>
            </form>
          </Surface>

          <Surface className="p-5 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
                {copy.moderationQueue}
              </h3>
              <div className="flex items-center gap-1">
                {(['pending', 'approved', 'rejected', 'all'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setProjectFilter(st)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium capitalize cursor-pointer ${
                      projectFilter === st
                        ? 'kj-btn-primary'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#202938]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {visibleProjects.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  No projects in this queue.
                </p>
              ) : (
                visibleProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3.5 py-2.5 dark:border-[#2b3442]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {proj.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {proj.status.toUpperCase()} · {proj.track.toUpperCase()} · {proj.authorName}
                        {proj.isOfficial ? ' · Official' : ' · Community'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setReviewingProject(proj);
                          setRejectReason(proj.moderationReason || '');
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Review</span>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => void handleDeleteDoc('code_projects', proj.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Surface>
        </div>
      )}

      {/* Sandboxed Code Moderation Modal */}
      <Modal
        open={Boolean(reviewingProject)}
        onClose={() => setReviewingProject(null)}
        title={reviewingProject ? `Review Project: ${reviewingProject.title}` : ''}
        maxWidthClass="max-w-3xl"
      >
        {reviewingProject && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Author: {reviewingProject.authorName} · Track: {reviewingProject.track.toUpperCase()} · Current status:{' '}
              {reviewingProject.status}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-200">{reviewingProject.description}</p>

            <iframe
              title="Sandboxed moderation preview"
              sandbox="allow-scripts"
              srcDoc={buildPreviewDoc(reviewingProject.html, reviewingProject.css, reviewingProject.js)}
              className="h-60 w-full rounded-xl border border-slate-200 bg-white dark:border-[#2b3442]"
            />

            <details className="rounded-lg border border-slate-200 p-3 text-xs dark:border-[#2b3442]">
              <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-200">
                Inspect submitted HTML / CSS / JS source code
              </summary>
              <div dir="ltr" className="mt-2 space-y-2 font-mono text-[11px]">
                <pre className="overflow-x-auto rounded bg-slate-950 p-2 text-slate-100">{reviewingProject.html}</pre>
                <pre className="overflow-x-auto rounded bg-slate-950 p-2 text-slate-100">{reviewingProject.css}</pre>
                <pre className="overflow-x-auto rounded bg-slate-950 p-2 text-slate-100">{reviewingProject.js}</pre>
              </div>
            </details>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                {copy.rejectReasonPrompt}
              </label>
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Required if rejecting (e.g., broken script, off-topic, incomplete code)"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-[#2b3442] dark:bg-[#10141c] dark:text-white"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => void handleModerateProject(reviewingProject, 'rejected')}
              >
                <XCircle className="h-4 w-4" />
                <span>{copy.rejectProject}</span>
              </Button>
              <Button
                size="sm"
                onClick={() => void handleModerateProject(reviewingProject, 'approved')}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{copy.approveProject}</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
