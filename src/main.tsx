import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global bulletproof safety fallback for locale identifier
declare global {
  var locale: string;
}
if (typeof window !== 'undefined') {
  (window as any).locale = 'ckb';
  try {
    const saved = window.localStorage.getItem('karejan_locale');
    if (saved) (window as any).locale = saved;
  } catch {}
}
if (typeof globalThis !== 'undefined') {
  (globalThis as any).locale = (typeof window !== 'undefined' && (window as any).locale) || 'ckb';
}

createRoot(document.getElementById('root')!).render(<App />);
