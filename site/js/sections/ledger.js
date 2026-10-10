/* Sheet 05, the Ledger (night): the glow, the dates revealing by clip-path on each year,
   --ledger-p for the medallion's scroll-turn, the WebP fallback's light sweep (light tier),
   .is-3d on the slot when the renderer reports the GLB. */

let section, slot, fallback, sticky;
let has3d = false;   // the renderer currently holds a medallion (GLB or procedural)

export function init(ctx) {
  section = document.getElementById('ledger');
  if (!section) return;
  slot = document.getElementById('medallion-slot');
  fallback = section.querySelector('.medallion__fallback');
  sticky = section.querySelector('.ledger__sticky');
  window.addEventListener('pp:gl', (e) => {
    const d = e.detail || {};
    const state = d.state;
    if (!slot) return;
    if (state === 'medallion') {
      // hero.js reports {kind: 'glb' | 'procedural' | 'none'}; kind 'none' means the load failed
      // or the GLB was released two viewports away ({released: true}): the WebP shows again.
      const info = d.info || {};
      has3d = (info.kind === 'glb' || info.kind === 'procedural') && !info.released;
      slot.classList.toggle('is-3d', has3d);
    }
    if (state === 'lost') slot.classList.remove('is-3d');
    if (state === 'restored' && has3d && ctx.getHero()) slot.classList.add('is-3d');
    if (state === 'disposed' || state === 'degraded') { has3d = false; slot.classList.remove('is-3d'); }
  });
}

export function create(ctx) {
  const { gsap, ScrollTrigger, still, emit } = ctx;
  if (!section) return null;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      if (sticky) sticky.classList.add('is-visible');
      if (fallback && !still) {
        fallback.classList.add('is-sweep');
        setTimeout(() => fallback.classList.remove('is-sweep'), 1400);
      }
    },
  });

  const dates = Array.from(section.querySelectorAll('.date'));
  const note = section.querySelector('.ledger__note');
  const link = section.querySelector('.ledger__dates > p:last-child');
  if (still) {
    ctx.reveal([...dates, note, link].filter(Boolean));
  } else {
    const years = dates.map((d) => d.querySelector('.date__year'));
    const texts = dates.map((d) => d.querySelector('.date__text'));
    gsap.set(years, { clipPath: 'inset(0% 100% 0% 0%)' });
    gsap.set(texts, { opacity: 0, y: 12 });
    ScrollTrigger.batch(dates, {
      start: 'top 85%',
      once: true,
      onEnter: (batch) => {
        const ys = batch.map((d) => d.querySelector('.date__year'));
        const ts = batch.map((d) => d.querySelector('.date__text'));
        gsap.to(ys, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.out', stagger: 0.1, overwrite: true });
        gsap.to(ts, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1, delay: 0.1, overwrite: true, clearProps: 'transform' });
      },
    });
    ctx.reveal([note, link].filter(Boolean), { y: 16 });
    ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'top 30%',
      scrub: 0.8,
      onUpdate: (self) => {
        ctx.setVar('--ledger-p', self.progress.toFixed(4));
        emit('pp:scene', { id: 'ledger', p: self.progress });
      },
    });
  }
  const cap = section.querySelector('.ledger__crest-cap');
  if (cap) ctx.reveal([cap], { y: 12 });
  return null;
}
