import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, Code2, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { APPEARANCE_THEMES, getThemeDefinition } from '../data/themesCatalog';
import { pickLoc } from '../i18n/translations';
import type { Locale, ThemeMode } from '../types/domain';

interface AppearanceCopy {
  eyebrow: string;
  heading: string;
  subtitle: string;
  appearanceLabel: string;
  hint: string;
  miniTag: string;
  miniHeadline: string;
  announcedSuffix: string;
  tryElsewhere: string;
  openHome: string;
  openAcademy: string;
  openEditor: string;
}

const APPEARANCE_COPY: Record<Locale, AppearanceCopy> = {
  ckb: {
    eyebrow: 'بۆشایی خۆت بڕازێنەوە',
    heading: 'وایبکە لە هی خۆت بچێت.',
    subtitle: 'ئەو ڕەنگانە هەڵبژێرە کە فێربوون بۆت ئاسوودە و چێژبەخش دەکەن.',
    appearanceLabel: 'ڕووکار و ڕەنگ',
    hint: 'ڕووکارێک هەڵبژێرە بۆ ئەوەی لە تەواوی وێبسایتەکەدا جێبەجێ ببێت. هەڵبژاردەکەت لە وێبگەڕ و هەژمارەکەتدا پاشەکەوت دەکرێت.',
    miniTag: 'شتێکی نوێ فێربە',
    miniHeadline: 'تواناکانت بنیات بنێ.',
    announcedSuffix: 'چالاک کرا.',
    tryElsewhere: 'سەیری پەڕەکانی تر بکە بەم ڕووکارە نوێیە:',
    openHome: 'پەڕەی سەرەکی',
    openAcademy: 'ئەکادیمیا',
    openEditor: 'تاقیگەی کۆد',
  },
  kmr: {
    eyebrow: 'جهێ خۆ بشێوازە',
    heading: 'بلا وەک یا تە بیت.',
    subtitle: 'وان ڕەنگان هەلبژێرە یێن فێربوونێ بۆ تە ئارام و خۆش دکەن.',
    appearanceLabel: 'ڕووکار و ڕەنگ',
    hint: 'ڕووکارەکی هەلبژێرە دا ل هەمی لاپەڕێن مالپەڕی دا بهێتە گوهۆڕین. هەلبژاردنا تە دێ هێتە پاراستن.',
    miniTag: 'تشتەکێ نوی فێرببە',
    miniHeadline: 'شیانێن خۆ ئاڤا بکە.',
    announcedSuffix: 'هاتە چالاککرن.',
    tryElsewhere: 'ب ڤی ڕووکارێ نوی سەحکە لاپەڕێن دی:',
    openHome: 'سەرەکی',
    openAcademy: 'ئەکادیمیا',
    openEditor: 'تاقیگەها کۆدی',
  },
  ar: {
    eyebrow: 'خصّص مساحتك',
    heading: 'اجعلها تشبه ذوقك.',
    subtitle: 'اختر الألوان التي تجعل تجربة التعلّم مريحة وممتعة لك.',
    appearanceLabel: 'المظهر',
    hint: 'اختر مظهراً لتطبيقه على جميع صفحات الموقع فوراً. يتم حفظ اختيارك تلقائياً في متصفحك وحسابك.',
    miniTag: 'تعلّم شيئاً جديداً',
    miniHeadline: 'ابنِ مهاراتك البرمجية.',
    announcedSuffix: 'تم تفعيل المظهر.',
    tryElsewhere: 'جرّب تصفّح الموقع بهذا المظهر:',
    openHome: 'الرئيسية',
    openAcademy: 'الأكاديمية',
    openEditor: 'مختبر الكود',
  },
  en: {
    eyebrow: 'PERSONALIZE YOUR SPACE',
    heading: 'Make it feel like yours.',
    subtitle: 'Choose the colors that make learning comfortable for you.',
    appearanceLabel: 'Appearance',
    hint: 'Choose a theme to apply it across every page of karejan. Your choice is saved in this browser and synced with your profile.',
    miniTag: 'LEARN SOMETHING NEW',
    miniHeadline: 'Build your skills.',
    announcedSuffix: 'theme selected.',
    tryElsewhere: 'Preview your new theme across karejan:',
    openHome: 'Home Page',
    openAcademy: 'Academy',
    openEditor: 'Code Lab',
  },
};

export const AppearanceView: React.FC = () => {
  const { locale, theme, setTheme, setActiveView } = useApp();
  const copy = pickLoc(locale, APPEARANCE_COPY);
  const currentThemeDef = getThemeDefinition(theme);

  const [menuOpen, setMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const selectorRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleSelectTheme = (nextId: ThemeMode, closeDropdown = false) => {
    setTheme(nextId);
    const chosen = getThemeDefinition(nextId);
    const label = pickLoc(locale, chosen.names);
    setAnnouncement(`${label} — ${copy.announcedSuffix}`);
    if (closeDropdown) {
      setMenuOpen(false);
      toggleBtnRef.current?.focus();
    }
  };

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!menuOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const activeIdx = optionRefs.current.findIndex((el) => el === document.activeElement);
        const currentIndex =
          activeIdx >= 0 ? activeIdx : APPEARANCE_THEMES.findIndex((t) => t.id === theme);
        const delta = event.key === 'ArrowDown' ? 1 : -1;
        const nextIndex = (currentIndex + delta + APPEARANCE_THEMES.length) % APPEARANCE_THEMES.length;
        optionRefs.current[nextIndex]?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, theme]);

  const handleToggleMenu = () => {
    setMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        const activeIdx = Math.max(
          0,
          APPEARANCE_THEMES.findIndex((t) => t.id === theme)
        );
        window.requestAnimationFrame(() => {
          optionRefs.current[activeIdx]?.focus();
        });
      }
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 pt-12 pb-20 sm:px-6 sm:pt-16">
      {/* Page Heading + Dropdown Theme Selector */}
      <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="text-start">
          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.07em] text-[var(--kj-green)]">
            {copy.eyebrow}
          </p>
          <h1 className="text-[32px] font-extrabold leading-tight tracking-[-0.04em] text-[var(--kj-ink)] sm:text-[40px]">
            {copy.heading}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--kj-muted)] sm:text-base">
            {copy.subtitle}
          </p>
        </div>

        <div ref={selectorRef} className="relative flex-none">
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={handleToggleMenu}
            aria-expanded={menuOpen}
            aria-controls="karejan-theme-menu"
            className="flex min-w-[240px] w-full sm:w-auto items-center justify-between gap-5 rounded-[14px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-4 py-3 text-start text-[var(--kj-ink)] transition-colors hover:border-[var(--kj-green)] cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <span
                className="h-5 w-5 rounded-full border-2 border-white/80 shadow-xs shrink-0"
                style={{ backgroundColor: currentThemeDef.accent }}
                aria-hidden="true"
              />
              <span>
                <small className="block text-[11px] text-[var(--kj-muted)]">{copy.appearanceLabel}</small>
                <strong className="text-sm font-bold text-[var(--kj-ink)]">
                  {pickLoc(locale, currentThemeDef.names)}
                </strong>
              </span>
            </span>
            <span
              aria-hidden="true"
              className={`text-lg text-[var(--kj-green)] transition-transform duration-200 ${
                menuOpen ? 'rotate-180' : ''
              }`}
            >
              ⌄
            </span>
          </button>

          {menuOpen && (
            <div
              id="karejan-theme-menu"
              role="radiogroup"
              aria-label={copy.appearanceLabel}
              className="absolute end-0 top-[calc(100%+8px)] z-30 w-full sm:w-[240px] rounded-[14px] border border-[var(--kj-border-strong)] bg-[var(--kj-card)] p-1.5 shadow-[0_14px_40px_rgba(16,41,28,0.18)]"
            >
              {APPEARANCE_THEMES.map((item, idx) => {
                const active = theme === item.id;
                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      optionRefs.current[idx] = el;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => handleSelectTheme(item.id, true)}
                    className={`flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-2.5 text-start text-sm transition-colors cursor-pointer ${
                      active
                        ? 'bg-[var(--kj-soft)] font-bold text-[var(--kj-ink)]'
                        : 'text-[var(--kj-ink)] hover:bg-[var(--kj-soft)]/70'
                    }`}
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border-2 border-white/75"
                      style={{
                        backgroundColor: item.accent,
                        boxShadow: '0 0 0 1px rgba(82, 103, 91, 0.25)',
                      }}
                    />
                    <span className="truncate">{pickLoc(locale, item.names)}</span>
                    {active && (
                      <span className="ms-auto font-extrabold text-[var(--kj-green)]" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 6 Theme Visual Preview Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {APPEARANCE_THEMES.map((item) => {
          const active = theme === item.id;
          const localizedName = pickLoc(locale, item.names);

          return (
            <article
              key={item.id}
              onClick={() => handleSelectTheme(item.id)}
              className="rounded-[18px] border bg-[var(--kj-card)] p-4 text-[var(--kj-ink)] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              style={{
                borderColor: active ? item.accent : 'var(--kj-border)',
                boxShadow: active ? `0 8px 24px -10px ${item.accent}55` : undefined,
              }}
            >
              {/* Miniature Website Preview */}
              <div
                aria-hidden="true"
                className="h-[164px] rounded-[12px] p-3"
                style={{
                  backgroundColor: item.canvas,
                  color: item.text,
                }}
              >
                <div
                  dir="ltr"
                  className="flex h-[30px] items-center gap-2 rounded-[7px] px-2.5 text-[9px] font-extrabold"
                  style={{ backgroundColor: item.surface }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.accent }}
                  />
                  <span>karejan</span>
                  <div className="ml-auto flex gap-1.5">
                    <i className="h-[5px] w-7 rounded-full not-italic" style={{ backgroundColor: item.soft }} />
                    <i className="h-[5px] w-7 rounded-full not-italic" style={{ backgroundColor: item.soft }} />
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-[1.65fr_1fr] gap-2.5">
                  <div
                    className="h-[100px] rounded-[8px] p-3 text-start"
                    style={{ backgroundColor: item.surface }}
                  >
                    <small className="block text-[8px] font-extrabold tracking-wide" style={{ color: item.accent }}>
                      {copy.miniTag}
                    </small>
                    <strong className="mt-2 block text-[13px] leading-tight font-extrabold">
                      {copy.miniHeadline}
                    </strong>
                    <span
                      className="mt-3 block h-[17px] w-[70px] rounded-[5px]"
                      style={{ backgroundColor: item.accent }}
                    />
                  </div>
                  <div
                    className="h-[100px] rounded-[8px] p-3"
                    style={{ backgroundColor: item.soft }}
                  >
                    <i
                      className="my-2 block h-[5px] w-[70%] rounded-full not-italic"
                      style={{ backgroundColor: item.accent }}
                    />
                    <i
                      className="my-2 block h-[5px] rounded-full not-italic"
                      style={{ backgroundColor: item.border }}
                    />
                    <i
                      className="my-2 block h-[5px] w-[76%] rounded-full not-italic"
                      style={{ backgroundColor: item.border }}
                    />
                    <i
                      className="my-2 block h-[5px] rounded-full not-italic"
                      style={{ backgroundColor: item.border }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="mt-4 flex items-center gap-2.5">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTheme(item.id);
                  }}
                  className="flex flex-1 items-center gap-3 rounded-[12px] border border-[var(--kj-border)] bg-[var(--kj-card)] px-3 py-2.5 text-start font-bold text-[var(--kj-ink)] transition-colors hover:border-[var(--kj-green)] cursor-pointer"
                  style={
                    active
                      ? {
                          boxShadow: '0 0 0 2px var(--kj-green)',
                          borderColor: 'var(--kj-green)',
                        }
                      : undefined
                  }
                >
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px]"
                    style={{ backgroundColor: item.soft }}
                  >
                    <span
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: item.accent }}
                    />
                  </span>
                  <span className="truncate text-sm">{localizedName}</span>
                  {active && (
                    <span className="ms-auto text-sm font-extrabold text-[var(--kj-green)]" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
                <span className="px-1.5 font-mono text-[11px] font-bold text-[var(--kj-muted)] tabular-nums">
                  {item.number}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Persistent Info + Quick Cross-Site Preview */}
      <div className="mt-8 flex flex-col gap-4 rounded-[16px] border border-[var(--kj-border)] bg-[var(--kj-card)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-[var(--kj-muted)] sm:text-sm">
          {copy.hint}
        </p>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="me-1 text-[11px] font-bold text-[var(--kj-muted)]">{copy.tryElsewhere}</span>
          <button
            type="button"
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--kj-border)] bg-[var(--kj-soft)] px-3 py-1.5 text-xs font-bold text-[var(--kj-ink)] hover:border-[var(--kj-green)] cursor-pointer"
          >
            <Home className="h-3.5 w-3.5 text-[var(--kj-green)]" />
            <span>{copy.openHome}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('academy')}
            className="inline-flex items-center gap-1.5 rounded-[10px] border border-[var(--kj-border)] bg-[var(--kj-soft)] px-3 py-1.5 text-xs font-bold text-[var(--kj-ink)] hover:border-[var(--kj-green)] cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-[var(--kj-green)]" />
            <span>{copy.openAcademy}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('editor')}
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-[var(--kj-green)] px-3.5 py-1.5 text-xs font-bold text-[var(--kj-btn-primary-ink)] hover:bg-[var(--kj-accent-hover)] cursor-pointer"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>{copy.openEditor}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
};
