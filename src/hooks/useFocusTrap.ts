import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',');

type Options = {
  background: RefObject<HTMLElement>;    // made inert while the trap is active
  onEscape: () => void;
  fallback?: () => HTMLElement | null;   // where focus goes if the trigger is gone
};

/*
 * Active for as long as the calling component is mounted. Inert and focus
 * are handled in one effect so the order is guaranteed: background goes
 * inert after we remember the trigger, and comes back before we refocus it.
 */
export function useFocusTrap(ref: RefObject<HTMLElement>, options: Options) {
  const opts = useRef(options);
  opts.current = options;

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const trigger = document.activeElement as HTMLElement | null;
    const background = opts.current.background.current;

    if (background) background.inert = true;
    root.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        opts.current.onEscape();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)]
        .filter(el => !(el instanceof HTMLInputElement && el.type === 'radio' && !el.checked));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === root)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      if (background) background.inert = false;
      const target = trigger?.isConnected && trigger !== document.body
        ? trigger
        : opts.current.fallback?.();
      target?.focus();
    };
  }, [ref]);
}
