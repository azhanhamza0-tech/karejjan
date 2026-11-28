import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Plus,
  Send,
  Trash2,
  Pencil,
  Copy,
  RefreshCw,
  Check,
  MessageSquare,
} from 'lucide-react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { apiFetch, ApiError } from '../lib/api';
import { useApp } from '../context/AppContext';
import type { AiChatMessage, AiChatThread } from '../types/domain';
import { Button, Surface } from './ui/Primitives';

export const AiChatView: React.FC = () => {
  const {
    locale,
    t,
    firebaseUser,
    setAuthModalOpen,
    effectivePlan,
    systemSettings,
    freeDailyAiUsed,
    refreshServerStatus,
  } = useApp();

  const [threads, setThreads] = useState<AiChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load user's chat threads
  useEffect(() => {
    if (!firebaseUser) {
      setThreads([]);
      setActiveThreadId(null);
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, 'ai_chats'),
      where('uid', '==', firebaseUser.uid),
      orderBy('updatedAt', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<AiChatThread, 'id'>),
        }));
        setThreads(list);
        if (!activeThreadId && list.length > 0) {
          setActiveThreadId(list[0].id);
        }
      },
      () => {}
    );
    return () => unsub();
  }, [firebaseUser, activeThreadId]);

  // Load messages for selected thread
  useEffect(() => {
    if (!firebaseUser || !activeThreadId) {
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, 'ai_chats', activeThreadId, 'messages'),
      where('uid', '==', firebaseUser.uid),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setMessages(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<AiChatMessage, 'id'>),
          }))
        );
      },
      () => {}
    );
    return () => unsub();
  }, [firebaseUser, activeThreadId]);

  const createNewChat = async (initialTitle?: string): Promise<string | null> => {
    if (!firebaseUser) {
      setAuthModalOpen(true);
      return null;
    }
    const title = (initialTitle || t.ai.newChat).slice(0, 140);
    try {
      const ref = await addDoc(collection(db, 'ai_chats'), {
        uid: firebaseUser.uid,
        title,
        language: locale,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setActiveThreadId(ref.id);
      return ref.id;
    } catch {
      const localId = `local-chat-${Date.now()}`;
      setThreads((prev) => [
        {
          id: localId,
          uid: firebaseUser.uid,
          title,
          language: locale,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setActiveThreadId(localId);
      return localId;
    }
  };

  const handleRename = async (id: string) => {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    try {
      await updateDoc(doc(db, 'ai_chats', id), {
        title: renameValue.trim().slice(0, 140),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `ai_chats/${id}`);
    } finally {
      setRenamingId(null);
    }
  };

  const handleDeleteThread = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'ai_chats', id));
      if (activeThreadId === id) {
        setActiveThreadId(null);
        setMessages([]);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `ai_chats/${id}`);
    }
  };

  const sendMessage = async (textOverride?: string, isRegenerate = false) => {
    const promptText = (textOverride ?? input).trim();
    if (!promptText || sending) return;
    if (!firebaseUser) {
      setAuthModalOpen(true);
      return;
    }

    setError(null);
    setSending(true);
    if (!textOverride) setInput('');

    try {
      let threadId = activeThreadId;
      if (!threadId) {
        threadId = await createNewChat(promptText.slice(0, 56));
      }
      if (!threadId) return;

      const historyPayload = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Save user message first unless regenerating
      if (!isRegenerate) {
        setMessages((prev) => [
          ...prev,
          { id: `u-${Date.now()}`, uid: firebaseUser.uid, role: 'user', content: promptText },
        ]);
        if (firebaseUser.emailVerified) {
          addDoc(collection(db, 'ai_chats', threadId, 'messages'), {
            uid: firebaseUser.uid,
            role: 'user',
            content: promptText,
            createdAt: serverTimestamp(),
          }).catch(() => {});
        }
      }

      // Server-side Gemini call with auth, daily limit / fair-use enforcement
      const result = await apiFetch<{
        reply: string;
        plan: 'free' | 'pro';
      }>('/api/ai/chat', {
        method: 'POST',
        body: {
          chatId: threadId,
          message: promptText,
          language: locale,
          history: historyPayload,
        },
      });

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, uid: firebaseUser.uid, role: 'assistant', content: result.reply },
      ]);

      if (firebaseUser.emailVerified) {
        addDoc(collection(db, 'ai_chats', threadId, 'messages'), {
          uid: firebaseUser.uid,
          role: 'assistant',
          content: result.reply,
          createdAt: serverTimestamp(),
        }).catch(() => {});
        updateDoc(doc(db, 'ai_chats', threadId), {
          updatedAt: serverTimestamp(),
        }).catch(() => {});
      }

      void refreshServerStatus();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t.ai.unavailableError);
      }
    } finally {
      setSending(false);
    }
  };

  const handleRegenerate = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      void sendMessage(lastUserMsg.content, true);
    }
  };

  const copyMessage = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {}
  };

  return (
    <div>
      <section className="kj-hero-band">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-start">
              <h1 className="text-xl font-extrabold tracking-tight text-[var(--kj-ink)] sm:text-2xl">
                {t.ai.title}
              </h1>
              <p className="mt-0.5 text-xs text-[var(--kj-muted)]">
                {effectivePlan === 'pro'
                  ? t.ai.proFairUseLabel
                  : `${t.ai.dailyLimitLabel}: ${freeDailyAiUsed} / ${systemSettings.freeDailyAiLimit}`}
              </p>
            </div>
            <Button size="sm" onClick={() => void createNewChat()}>
              <Plus className="h-4 w-4" />
              <span>{t.ai.newChat}</span>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
        {!firebaseUser ? (
          <Surface className="p-8 text-center">
            <p className="mb-4 text-sm text-[var(--kj-muted-2)]">{t.common.signInRequired}</p>
            <Button onClick={() => setAuthModalOpen(true)}>{t.nav.signIn}</Button>
          </Surface>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Chat History Rail */}
            <aside className="lg:col-span-3">
              <div className="rounded-[9px] border border-[var(--kj-border)] bg-[var(--kj-soft)] p-3">
                <div className="space-y-1">
                  {threads.length === 0 ? (
                    <p className="px-2 py-4 text-xs text-[var(--kj-muted)]">
                      {t.ai.newChat}
                    </p>
                  ) : (
                    threads.map((th) => {
                      const active = th.id === activeThreadId;
                      return (
                        <div
                          key={th.id}
                          className={`flex items-center justify-between gap-1 rounded-[6px] px-2.5 py-2 ${
                            active
                              ? 'kj-badge font-bold'
                              : 'text-[var(--kj-muted-2)] hover:bg-[var(--kj-card)] hover:text-[var(--kj-ink)]'
                          }`}
                        >
                          {renamingId === th.id ? (
                            <div className="flex flex-1 items-center gap-1">
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && void handleRename(th.id)}
                                className="w-full rounded border border-[var(--kj-green)] bg-[var(--kj-paper)] px-2 py-1 text-xs"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => void handleRename(th.id)}
                                className="p-1 text-[var(--kj-green)] cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => setActiveThreadId(th.id)}
                                className="flex min-w-0 flex-1 items-center gap-2 text-start text-xs font-semibold cursor-pointer"
                              >
                                <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
                                <span className="truncate">{th.title}</span>
                              </button>
                              <div className="flex items-center gap-0.5 shrink-0">
                                <button
                                  type="button"
                                  aria-label={t.ai.renameChat}
                                  onClick={() => {
                                    setRenamingId(th.id);
                                    setRenameValue(th.title);
                                  }}
                                  className="p-1 text-[var(--kj-muted)] hover:text-[var(--kj-ink)] cursor-pointer"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  aria-label={t.ai.deleteChat}
                                  onClick={() => void handleDeleteThread(th.id)}
                                  className="p-1 text-[var(--kj-muted)] hover:text-red-500 cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </aside>

            {/* Main Conversation Panel */}
            <Surface className="flex min-h-[540px] flex-col lg:col-span-9">
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {messages.length === 0 ? (
                  <div className="py-8 text-start">
                    <p className="mb-5 max-w-xl text-sm text-[var(--kj-muted-2)]">
                      {t.ai.emptyState}
                    </p>
                    <p className="mb-2.5 text-xs font-bold text-[var(--kj-muted)]">
                      {t.ai.suggestedTitle}
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {t.ai.suggested.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => void sendMessage(q)}
                          className="rounded-[7px] border border-[var(--kj-border)] bg-[var(--kj-soft)] p-3 text-start text-xs leading-5 text-[var(--kj-ink)] hover:border-[var(--kj-emerald)] hover:bg-[var(--kj-elevated)] cursor-pointer transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={msg.id}
                      className={`rounded-[8px] border p-4 ${
                        msg.role === 'user'
                          ? 'kj-callout ms-auto max-w-2xl border-[var(--kj-border)]'
                          : 'max-w-3xl border-[var(--kj-border)] bg-[var(--kj-soft)]'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2 text-xs text-[var(--kj-muted)]">
                        <span className="font-bold text-[var(--kj-ink)]">
                          {msg.role === 'user' ? 'You' : 'karejan AI'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => void copyMessage(msg.id, msg.content)}
                            className="inline-flex items-center gap-1 hover:text-[var(--kj-ink)] cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span>{copiedId === msg.id ? t.common.copied : t.common.copy}</span>
                          </button>
                          {msg.role === 'assistant' && idx === messages.length - 1 && (
                            <button
                              type="button"
                              disabled={sending}
                              onClick={handleRegenerate}
                              className="inline-flex items-center gap-1 hover:text-[var(--kj-green)] cursor-pointer"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                              <span>{t.ai.regenerate}</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none text-[var(--kj-ink)] dark:prose-invert [&_pre]:overflow-x-auto [&_pre]:rounded-[6px] [&_pre]:border [&_pre]:border-[var(--kj-code-border)] [&_pre]:bg-[var(--kj-code-bg)] [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:text-[var(--kj-code-ink)]">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))
                )}

                {sending && (
                  <div className="rounded-[7px] border border-[var(--kj-border)] bg-[var(--kj-soft)] p-4 text-xs text-[var(--kj-muted)]">
                    {t.common.loading}
                  </div>
                )}

                {error && (
                  <div className="rounded-[7px] border border-red-400/50 bg-red-500/10 p-4 text-xs text-red-500">
                    {error}
                  </div>
                )}
              </div>

              {/* Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendMessage();
                }}
                className="flex items-end gap-2 border-t border-[var(--kj-border)] p-4"
              >
                <textarea
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage();
                    }
                  }}
                  placeholder={t.ai.placeholder}
                  className="flex-1 resize-none rounded-[6px] border border-[var(--kj-border-strong)] bg-[var(--kj-paper)] px-3.5 py-2.5 text-sm text-[var(--kj-ink)] placeholder:text-[var(--kj-muted)] focus:border-[var(--kj-green)] focus:outline-none"
                />
                <Button type="submit" disabled={sending || !input.trim()}>
                  <Send className="h-4 w-4" />
                  <span>{t.ai.send}</span>
                </Button>
              </form>
            </Surface>
          </div>
        )}
      </div>
    </div>
  );
};
