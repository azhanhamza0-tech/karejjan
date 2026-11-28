import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export const Surface: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`rounded-[9px] border border-[var(--kj-border)] bg-[var(--kj-card)] text-[var(--kj-ink)] ${className}`}
  >
    {children}
  </div>
);

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'violet';
    size?: 'sm' | 'md';
  }
> = ({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }) => {
  const sizeClass =
    size === 'sm' ? 'px-3.5 py-1.5 text-xs min-h-[36px]' : 'px-5 py-2.5 text-sm min-h-[42px]';
  const variantClass: Record<string, string> = {
    primary: 'kj-btn-primary disabled:opacity-50',
    violet:
      'bg-[image:var(--kj-gradient-secondary)] text-white font-bold hover:brightness-110 disabled:opacity-50',
    secondary:
      'border border-[var(--kj-border-strong)] bg-[var(--kj-card)] text-[var(--kj-ink)] hover:bg-[var(--kj-soft-alt)] disabled:opacity-50',
    ghost:
      'text-[var(--kj-muted-2)] hover:bg-[var(--kj-soft-alt)] hover:text-[var(--kj-ink)] disabled:opacity-50',
    danger:
      'bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 disabled:opacity-50',
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] font-semibold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer disabled:cursor-not-allowed ${sizeClass} ${variantClass[variant]} ${className}`}
      {...props}
    />
  );
};

export const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}> = ({ open, onClose, title, children, maxWidthClass = 'max-w-md' }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080c14]/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`w-full ${maxWidthClass} max-h-[90vh] overflow-y-auto rounded-[9px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] p-6 shadow-[0_24px_70px_rgba(8,12,20,0.45)]`}
      >
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-[var(--kj-border)] pb-3">
          <h2 className="text-lg font-bold text-[var(--kj-ink)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--kj-muted)] hover:bg-[var(--kj-elevated)] hover:text-[var(--kj-ink)] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message || 'Unexpected application error' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, message: '' });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      const lang = typeof document !== 'undefined' ? document.documentElement.lang : 'en';
      const errCopy =
        lang === 'ckb'
          ? {
            title: 'هەڵەی کارپێکردن · karejan',
            reload: 'دەستپێکردنەوە',
            dismiss: 'پاشگەزبوونەوە',
          }
          : lang === 'kmr'
            ? {
              title: 'شاشیا کارپێکرنێ · karejan',
              reload: 'دەستپێکرن ژ نو',
              dismiss: 'پاشڤەگەڕیان',
            }
            : lang === 'ar'
              ? {
                title: 'خطأ في التشغيل · karejan',
                reload: 'إعادة تحميل',
                dismiss: 'تجاهل',
              }
              : {
                title: 'Application Error · karejan',
                reload: 'Reload View',
                dismiss: 'Dismiss',
              };
      return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--kj-paper)] p-6">
          <div className="max-w-lg rounded-[9px] border border-red-400/50 bg-[var(--kj-card)] p-6 shadow-xl text-start">
            <div className="mb-3 flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="text-base font-bold">{errCopy.title}</h2>
            </div>
            <p className="mb-4 break-words font-mono text-xs text-[var(--kj-muted-2)] bg-[var(--kj-code-bg)] p-3 rounded-lg border border-[var(--kj-border)]">
              {this.state.message}
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={this.handleReload}>
                {errCopy.reload}
              </Button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, message: '' });
                }}
                className="text-xs text-[var(--kj-muted)] hover:text-[var(--kj-ink)] underline cursor-pointer"
              >
                {errCopy.dismiss}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
