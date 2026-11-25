import React, { useEffect, useState } from 'react';
import { Copy, ShieldCheck, Upload, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { apiFetch, ApiError } from '../lib/api';
import { useApp } from '../context/AppContext';
import type { PaymentMethodId, PaymentTransaction } from '../types/domain';
import { Button, Surface } from './ui/Primitives';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

function compressPreviewDataUrl(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 900;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const url = canvas.toDataURL('image/jpeg', 0.72);
        resolve(url.length <= 320000 ? url : null);
      };
      img.onerror = () => resolve(null);
      img.src = String(reader.result || '');
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export const ProPurchaseView: React.FC = () => {
  const {
    locale,
    t,
    firebaseUser,
    setAuthModalOpen,
    plans,
    paymentSettings,
    effectivePlan,
    subscription,
  } = useApp();

  const enabledMethods = paymentSettings.filter((m) => m.enabled);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>(
    enabledMethods[0]?.id || 'fib'
  );
  const [copiedNum, setCopiedNum] = useState(false);

  const [transactionRef, setTransactionRef] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amountIqd, setAmountIqd] = useState(10000);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [myTxs, setMyTxs] = useState<PaymentTransaction[]>([]);

  const proPlan = plans.find((p) => p.id === 'pro') || plans[1];
  const freePlan = plans.find((p) => p.id === 'free') || plans[0];
  const activeMethod =
    enabledMethods.find((m) => m.id === selectedMethod) || enabledMethods[0] || paymentSettings[0];

  useEffect(() => {
    if (!firebaseUser) {
      setMyTxs([]);
      return;
    }
    const q = query(
      collection(db, 'payment_transactions'),
      where('uid', '==', firebaseUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setMyTxs(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<PaymentTransaction, 'id'>),
          }))
        );
      },
      () => {}
    );
    return () => unsub();
  }, [firebaseUser]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0] || null;
    if (!file) {
      setReceiptFile(null);
      return;
    }
    if (!ALLOWED_MIME.has(file.type)) {
      setError('Only image files (JPEG, PNG, WEBP) are accepted for payment receipts.');
      e.target.value = '';
      setReceiptFile(null);
      return;
    }
    if (file.size <= 0 || file.size > MAX_BYTES) {
      setError('Receipt image must be under 5 MB.');
      e.target.value = '';
      setReceiptFile(null);
      return;
    }
    setReceiptFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!firebaseUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!firebaseUser.emailVerified) {
      setError(t.common.verifyEmailNotice);
      return;
    }
    if (!receiptFile) {
      setError('Please upload a payment receipt image (JPEG, PNG, or WEBP).');
      return;
    }
    if (!activeMethod) {
      setError('No payment method is currently enabled.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Validate inputs and duplicate reference server-side
      const validated = await apiFetch<{ ok: boolean; normalizedRef: string }>(
        '/api/payments/validate',
        {
          method: 'POST',
          body: {
            methodId: activeMethod.id,
            transactionRef: transactionRef.trim(),
            paymentDate,
            amountIqd: Number(amountIqd),
            receiptMimeType: receiptFile.type,
            receiptSizeBytes: receiptFile.size,
            receiptFileName: receiptFile.name.slice(0, 180),
          },
        }
      );

      // 2. Upload receipt image to private Firebase Storage path receipts/{uid}/...
      const safeName = `${Date.now()}_${receiptFile.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120)}`;
      const receiptPath = `receipts/${firebaseUser.uid}/${safeName}`;
      let previewUrl: string | null = null;

      try {
        const storageRef = ref(storage, receiptPath);
        await uploadBytes(storageRef, receiptFile, { contentType: receiptFile.type });
        previewUrl = await getDownloadURL(storageRef);
      } catch {
        // If Firebase Storage bucket isn't initialized yet on Starter Tier, keep private compressed preview on the owner/admin-only Firestore doc
        previewUrl = await compressPreviewDataUrl(receiptFile);
      }

      // 3. Create pending transaction record (Firestore rules strictly require status === 'pending' & owner uid)
      await addDoc(collection(db, 'payment_transactions'), {
        uid: firebaseUser.uid,
        userEmail: firebaseUser.email || '',
        methodId: activeMethod.id,
        transactionRef: transactionRef.trim(),
        normalizedRef: validated.normalizedRef,
        paymentDate,
        amountIqd: Number(amountIqd),
        receiptPath,
        receiptFileName: receiptFile.name.slice(0, 180),
        receiptMimeType: receiptFile.type as 'image/jpeg' | 'image/png' | 'image/webp',
        receiptSizeBytes: receiptFile.size,
        receiptPreviewUrl: previewUrl,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setTransactionRef('');
      setReceiptFile(null);
      setSuccess(t.pro.submittedSuccess);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        try {
          handleFirestoreError(err, OperationType.CREATE, 'payment_transactions');
        } catch (wrapped) {
          setError(wrapped instanceof Error ? wrapped.message : 'Payment submission failed.');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="kj-hero-band">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 text-start">
          <div className="kj-eyebrow">
            <span className="kj-eyebrow-dot" />
            <span>{proPlan?.priceIqd?.toLocaleString() || '10,000'} IQD / MONTH · KARÊJAN PRO</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-[var(--kj-ink)] sm:text-3xl">
            {t.pro.title}
          </h1>
          {effectivePlan === 'pro' && subscription?.expiresAt && (
            <p className="mt-1.5 text-sm font-semibold text-[var(--kj-green)]">
              Active Pro Plan · Expires {subscription.expiresAt.slice(0, 10)}. Renewing extends from your current expiry date.
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">

      {/* Free vs Pro Comparison */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Surface className="p-6">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              {freePlan.titles[locale] || freePlan.titles.en}
            </h2>
            <span className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              {freePlan.priceIqd.toLocaleString()} IQD
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.pro.freeFairUseNote}</p>
          <ul className="mt-4 list-disc space-y-1.5 ps-5 text-sm text-slate-700 dark:text-slate-300">
            {(freePlan.features[locale] || freePlan.features.en).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </Surface>

        <Surface className="border-violet-400/70 p-6 dark:border-violet-500/50">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              {proPlan.titles[locale] || proPlan.titles.en}
            </h2>
            <span className="font-mono text-lg font-bold text-violet-700 dark:text-violet-300 tabular-nums">
              {t.pro.priceHeadline}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t.pro.proFairUseNote}</p>
          <ul className="mt-4 list-disc space-y-1.5 ps-5 text-sm text-slate-700 dark:text-slate-300">
            {(proPlan.features[locale] || proPlan.features.en).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </Surface>
      </div>

      {/* Manual Payment Flow */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Step 1: Payment Method & Instructions */}
        <Surface className="p-6 lg:col-span-5">
          <h2 className="mb-3 text-base font-semibold text-slate-950 dark:text-white">
            {t.pro.selectMethod}
          </h2>

          <div className="mb-5 grid grid-cols-3 gap-2">
            {enabledMethods.map((method) => {
              const active = activeMethod?.id === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={`rounded-lg border px-3 py-2.5 text-center text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'kj-btn-primary border-transparent'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-[#2b3442] dark:bg-[#151b26] dark:text-slate-200'
                  }`}
                >
                  {method.id === 'fib' ? 'FIB' : method.id === 'qi_card' ? 'Qi Card' : 'ZainCash'}
                </button>
              );
            })}
          </div>

          {activeMethod && (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-[#2b3442] dark:bg-[#151b26]">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeMethod.name} · {t.pro.accountNumber}
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span dir="ltr" className="font-mono text-xl font-bold text-slate-950 dark:text-white tabular-nums">
                    {activeMethod.accountNumber}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(activeMethod.accountNumber).catch(() => {});
                      setCopiedNum(true);
                      setTimeout(() => setCopiedNum(false), 1500);
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedNum ? t.common.copied : t.common.copy}</span>
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="mb-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.pro.instructions}
                </h3>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {activeMethod.instructions[locale] || activeMethod.instructions.en}
                </p>
              </div>

              <div className="flex items-start gap-2.5 rounded-lg border border-emerald-300 bg-emerald-50/70 p-3.5 text-xs leading-5 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{t.pro.securityNote}</span>
              </div>
            </div>
          )}
        </Surface>

        {/* Step 2: Payment Verification Submission Form */}
        <Surface className="p-6 lg:col-span-7">
          <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-white">
            {t.pro.submitRequest}
          </h2>

          {!firebaseUser ? (
            <div className="py-6">
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
                {t.common.signInRequired}
              </p>
              <Button onClick={() => setAuthModalOpen(true)}>{t.nav.signIn}</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.pro.transactionRef}
                  </label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={80}
                    dir="ltr"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. FIB-2026-88412"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.pro.paymentDate}
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.pro.amountIqd}
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    max={5000000}
                    step={500}
                    value={amountIqd}
                    onChange={(e) => setAmountIqd(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-[#344154] dark:bg-[#10141c] dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.pro.receiptImage}
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-700 hover:border-blue-500 dark:border-[#344154] dark:bg-[#10141c] dark:text-slate-300">
                    <Upload className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {receiptFile ? `${receiptFile.name} (${Math.round(receiptFile.size / 1024)} KB)` : 'Select JPEG, PNG, or WEBP'}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">{t.pro.receiptRules}</p>

              {error && (
                <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {success}
                </p>
              )}

              <Button type="submit" disabled={submitting} variant="violet">
                {submitting ? t.common.loading : t.pro.submitRequest}
              </Button>
            </form>
          )}
        </Surface>
      </div>

      {/* User's own payment requests */}
      {firebaseUser && myTxs.length > 0 && (
        <Surface className="mt-6 p-6">
          <h2 className="mb-3 text-base font-semibold text-slate-950 dark:text-white">
            {t.pro.myRequests}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-[#2b3442] dark:text-slate-400">
                  <th className="py-2 text-start font-medium">Method</th>
                  <th className="py-2 text-start font-medium">Reference</th>
                  <th className="py-2 text-start font-medium">Date</th>
                  <th className="py-2 text-start font-medium">Amount</th>
                  <th className="py-2 text-start font-medium">Status</th>
                  <th className="py-2 text-start font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#2b3442]">
                {myTxs.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-2.5 font-medium uppercase">{tx.methodId.replace('_', ' ')}</td>
                    <td className="py-2.5 font-mono">{tx.transactionRef}</td>
                    <td className="py-2.5 font-mono tabular-nums">{tx.paymentDate}</td>
                    <td className="py-2.5 font-mono tabular-nums">{tx.amountIqd.toLocaleString()} IQD</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 font-medium">
                        {tx.status === 'approved' && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                        {tx.status === 'pending' && <Clock className="h-3.5 w-3.5 text-amber-500" />}
                        {tx.status === 'rejected' && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                        {tx.status === 'requires_review' && <AlertCircle className="h-3.5 w-3.5 text-blue-500" />}
                        <span>{tx.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-500 dark:text-slate-400">{tx.reviewReason || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      )}
      </div>
    </div>
  );
};
