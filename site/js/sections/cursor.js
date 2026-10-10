/* Custom cursor: a 10 px ink dot (difference blend) that becomes a ring over links,
   a labelled disc over plates, and shrinks over the Sheet and the menu. Fine pointer only,
   never in the still tier; the native cursor stays visible. */

export function init(ctx) {
  const { gsap, caps, still } = ctx;
  if (!caps.finePointer || still) return;
  const dot = document.getElementById('cursor');
  if (!dot) return;
  document.documentElement.classList.add('has-cursor');
  dot.classList.add('is-off');

  const xTo = gsap.quickTo(dot, 'x', { duration: 0.25, ease: 'power3' });
  const yTo = gsap.quickTo(dot, 'y', { duration: 0.25, ease: 'power3' });
  let shown = false;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    xTo(e.clientX);
    yTo(e.clientY);
    if (!shown) { shown = true; dot.classList.remove('is-off'); }
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => dot.classList.add('is-off'));
  document.documentElement.addEventListener('mouseenter', () => { if (shown) dot.classList.remove('is-off'); });

  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest ? e.target.closest('[data-cursor], a, button, [role="button"], input, select, textarea, label, summary') : null;
    const overlay = e.target.closest ? e.target.closest('#sheet, #menu, #plate-dialog') : null;
    let state = '';
    if (t) state = t.dataset.cursor || (t.matches('input, select, textarea, label') ? 'hide' : 'link');
    else if (overlay) state = 'hide';
    dot.dataset.state = state;
  });
}
