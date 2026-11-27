/**
 * Overlays (modals, the mobile drawer) freeze the page behind them. The guard
 * keeps the helpers safe during server rendering, where `document` does not
 * exist, and in browsers that throw when storage/body access is blocked.
 */
function body(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.body;
}

export function lockBodyScroll(): void {
  const element = body();

  if (element) {
    element.style.overflow = 'hidden';
  }
}

export function unlockBodyScroll(): void {
  const element = body();

  if (element) {
    element.style.overflow = '';
  }
}
