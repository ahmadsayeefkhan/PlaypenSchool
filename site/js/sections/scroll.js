/* Lenis + ScrollTrigger sync, anchors, scrollTo. The only module that creates Lenis
   or configures ScrollTrigger (spec §6, TN §2.1). Not created in the still tier.
   init() runs under the preloader (ScrollTrigger config, the anchor handler); createLenis() runs
   once the overlay has lifted, so nothing can scroll the page before the cover is on screen. */
import Lenis from 'lenis';

let lenis = null;
let ctxRef = null;

const expo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function init(ctx) {
  ctxRef = ctx;
  ctx.ScrollTrigger.config({ ignoreMobileResize: true });
  ctx.lenis = null;
  ctx.scrollTo = scrollTo;
  document.addEventListener('click', onAnchorClick);
}

/* Motion tiers, after the lift: the smooth scroll (0.8 ms to create, measured) */
export function createLenis(ctx) {
  if (lenis || ctx.still) return lenis;
  const { gsap, ScrollTrigger } = ctx;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: false, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ctx.lenis = lenis;
  return lenis;
}

/* Where an element lands: the root's scroll-padding-top (main.css: the nav height + 16 px), the
   same line native anchors, the skip links and focus scrolling use. Lenis subtracts it itself in
   its scrollTo (lenis.mjs), so an element goes to Lenis with offset 0; the native fallback (the
   still tier) subtracts it here. An explicit opts.offset is measured from the element's top edge
   in both paths. */
function landingPad() {
  const cs = getComputedStyle(document.documentElement);
  const pad = parseFloat(cs.scrollPaddingTop);
  if (Number.isFinite(pad)) return pad;
  const v = parseFloat(cs.getPropertyValue('--nav-h'));
  return (Number.isFinite(v) ? v : 72) + 16;
}

/* target: element, selector or a pixel position */
export function scrollTo(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : (target instanceof Element ? target : null);
  const isNumber = typeof target === 'number';
  if (!el && !isNumber) return;
  const done = () => { if (opts.onComplete) opts.onComplete(); };

  if (lenis) {
    let offset = 0;
    if (isNumber) offset = opts.offset || 0;
    else if (opts.offset !== undefined) offset = opts.offset + landingPad();   // Lenis takes the padding off again
    lenis.scrollTo(isNumber ? target : el, {
      offset,
      duration: opts.immediate ? 0 : (opts.duration !== undefined ? opts.duration : 1.4),
      easing: expo,
      immediate: !!opts.immediate,
      lock: false,
      force: true,
      onComplete: done,
    });
    return;
  }
  const offset = opts.offset !== undefined ? opts.offset : (isNumber ? 0 : -landingPad());
  const top = isNumber ? target : el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: 'auto' });
  requestAnimationFrame(done);
}

function onAnchorClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.classList.contains('skip') || a.hasAttribute('data-no-smooth')) return;
  const id = a.getAttribute('href').slice(1);
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  ctxRef.emit('pp:anchor', { id });
  scrollTo(target, {
    onComplete: () => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      const rule = target.querySelector('.sheet-rule');
      if (rule && ctxRef.redrawRule) ctxRef.redrawRule(rule);
    },
  });
  try { history.pushState(null, '', '#' + id); } catch (err) { /* file: URLs */ }
}

export function stop() { if (lenis) lenis.stop(); }
export function start() { if (lenis) lenis.start(); }
