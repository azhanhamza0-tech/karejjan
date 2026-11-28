import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Ambient emerald-mint cursor spotlight that smoothly follows mouse movement
 * across the entire karejan workspace without interrupting clicks or text selection.
 */
export const CursorGlow: React.FC = () => {
  const { theme } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches;
    if (reducedMotion || coarsePointer) return;

    const containerEl = containerRef.current;
    const glowEl = glowRef.current;
    if (!containerEl || !glowEl) return;

    let targetX = -9999;
    let targetY = -9999;
    let currentX = -9999;
    let currentY = -9999;
    let visible = false;
    let rafId: number | null = null;

    const renderFrame = () => {
      rafId = null;
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      currentX += dx * 0.24;
      currentY += dy * 0.24;

      glowEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      if (visible && (Math.abs(dx) > 0.35 || Math.abs(dy) > 0.35)) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;

      targetX = e.clientX;
      targetY = e.clientY;

      if (!visible) {
        visible = true;
        currentX = targetX;
        currentY = targetY;
        glowEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        containerEl.style.opacity = '1';
      }

      if (rafId === null) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    const onPointerLeave = () => {
      visible = false;
      containerEl.style.opacity = '0';
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave, { passive: true });
    window.addEventListener('blur', onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] overflow-hidden opacity-0 transition-opacity duration-300"
    >
      <div
        ref={glowRef}
        className="will-change-transform absolute left-0 top-0 h-[520px] w-[520px] rounded-full"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(156, 235, 195, 0.17) 0%, rgba(24, 169, 116, 0.09) 28%, rgba(8, 127, 91, 0.03) 54%, transparent 72%)'
            : 'radial-gradient(circle, rgba(24, 169, 116, 0.16) 0%, rgba(8, 127, 91, 0.08) 28%, rgba(16, 167, 117, 0.03) 54%, transparent 72%)',
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
          style={{
            background: isDark
              ? 'radial-gradient(circle, rgba(156, 235, 195, 0.18) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
};
