/* Magnetic buttons ([data-magnet]): the button follows the pointer by up to 12 px inside its
   .magnet-area hit zone; the label moves at 0.6×. Fine pointer only, never in the still tier.
   The :focus-visible ring stays on the button itself. */

export function init(ctx) {
  const { gsap, caps, still } = ctx;
  if (!caps.finePointer || still) return;
  const clamp = gsap.utils.clamp(-12, 12);
  const strength = 0.35;

  document.querySelectorAll('[data-magnet]').forEach((el) => {
    if (el.dataset.magnetReady) return;
    el.dataset.magnetReady = '1';
    const area = el.closest('.magnet-area') || el;
    const label = el.querySelector('.btn__label');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    const lx = label ? gsap.quickTo(label, 'x', { duration: 0.5, ease: 'power3' }) : null;
    const ly = label ? gsap.quickTo(label, 'y', { duration: 0.5, ease: 'power3' }) : null;

    area.addEventListener('pointermove', (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const dx = clamp((e.clientX - (r.left + r.width / 2)) * strength);
      const dy = clamp((e.clientY - (r.top + r.height / 2)) * strength);
      xTo(dx); yTo(dy);
      if (lx) { lx(dx * 0.6); ly(dy * 0.6); }
    });
    area.addEventListener('pointerleave', () => {
      xTo(0); yTo(0);
      if (lx) { lx(0); ly(0); }
    });
  });
}
