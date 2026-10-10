/* Sheet 00, the cover: the hero intro (H1 lines from masks, then the blocks), the exit scrub
   (--hero-p, pp:scene hero, the headline 12 % faster than the page), pointer parallax of the
   copy. The terrace loop code stays for a real locked-off take (the generated clip was cut in the
   polish pass: the markup ships no <video>, so this path is idle). */

let split = null;
let titleEl, section, media, video, pauseBtn;
let prepared = false;
let introDone = false;
let userPaused = false;
let inView = true;
let ctxRef;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const BLOCKS = '.hero__label, .hero__lead, .hero__actions, .hero__caption, .hero__cue';

/* Called before the preloader exits: hide what the intro will reveal (motion tiers only; in the
   still tier the cover is complete the moment the overlay lifts) */
export function prepare(ctx) {
  ctxRef = ctx;
  const { gsap } = ctx;
  section = document.getElementById('hero');
  titleEl = document.getElementById('hero-title');
  if (!section) return;
  prepared = true;
  if (ctx.still) return;
  gsap.set(section.querySelectorAll(BLOCKS), { opacity: 0, y: 24 });
}

/* Called once fonts are ready: split the H1 into masked lines (lines only, never characters).
   Skipped when the intro has already played (the split is reverted at the end of the intro). */
export function splitTitle(ctx) {
  if (!titleEl) return;
  if (split || ctx.still || introDone) { titleEl.classList.add('is-split'); return; }
  split = ctx.split(titleEl, { manual: true, trigger: null });
  if (!split) titleEl.classList.add('is-split');
}

/* The intro timeline, started 350 ms before the preloader's lift ends. Resolves once the timeline
   has settled (main.js holds the idle warm-ups until then); at once when there is nothing to play. */
export async function intro(ctx) {
  const { gsap, still } = ctx;
  if (!section || introDone) return;
  const blocks = Array.from(section.querySelectorAll(BLOCKS));
  if (still) {
    introDone = true;
    titleEl.classList.add('is-split');
    return;   // nothing was hidden (prepare)
  }
  // the split happens on fonts.ready; give it a moment so the lines rise from their masks
  if (!split) {
    try { await Promise.race([document.fonts.ready, delay(600)]); } catch (e) { /* ignore */ }
    if (!split && document.fonts.status === 'loaded') splitTitle(ctx);
  }
  if (introDone) return;
  introDone = true;
  const tl = gsap.timeline({ defaults: { overwrite: true } });
  if (split && split.lines && split.lines.length) {
    tl.to(split.lines, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }, 0);
  } else {
    titleEl.classList.add('is-split');
    // overwrite stays off here: the scroll scrub (create) already owns the headline's y
    tl.from(titleEl, { y: 24, opacity: 0, duration: 1.1, ease: 'expo.out', overwrite: false }, 0);
  }
  tl.to(blocks, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform' }, 0.45);
  tl.add(() => {
    // the one-shot reveal is done: drop the extra nodes so a resize can never hide the headline again
    if (split) { try { split.revert(); } catch (e) { /* ignore */ } split = null; }
    titleEl.classList.add('is-split');
  });
  await tl.then();
}

export function init(ctx) {
  ctxRef = ctx;
  media = section && section.querySelector('.hero__media');
  video = document.getElementById('hero-video');
  pauseBtn = document.getElementById('hero-pause');
  if (!section) return;
  if (!prepared) prepare(ctx);

  /* Pointer: the light in the shader, the H1 and the lead 6 px opposite (the caption stays) */
  if (ctx.caps.finePointer && !ctx.still) {
    const movers = [section.querySelector('.hero__text'), section.querySelector('.hero__aside')].filter(Boolean);
    const xs = movers.map((el) => ctx.gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' }));
    const ys = movers.map((el) => ctx.gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' }));
    section.addEventListener('pointermove', (e) => {
      const r = media.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 2 - 1;
      const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      const hero = ctx.getHero();
      if (hero) hero.setPointer(Math.max(-1.5, Math.min(1.5, x)), Math.max(-1.5, Math.min(1.5, y)));
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      xs.forEach((f) => f(-nx * 6)); ys.forEach((f) => f(-ny * 6));
    }, { passive: true });
    section.addEventListener('pointerleave', () => {
      const hero = ctx.getHero();
      if (hero) hero.setPointer(NaN, NaN);
      xs.forEach((f) => f(0)); ys.forEach((f) => f(0));
    });
  }

  /* Light tier: the CSS relight travels the same 14 s arc as the shader's idle sun (desktop only) */
  if (ctx.tier === 'light' && !ctx.still && matchMedia('(min-width: 768px)').matches) {
    const sun = { x: 0.3 };
    const arc = ctx.gsap.to(sun, { x: 0.7, duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1, onUpdate: () => ctx.setVar('--sun-x', sun.x.toFixed(3)) });
    new IntersectionObserver(([entry]) => { entry.isIntersecting ? arc.play() : arc.pause(); }, { threshold: 0 }).observe(section);
    window.addEventListener('pp:tier', (e) => { if (e.detail && e.detail.tier !== 'light') arc.kill(); });
  }

  /* The terrace loop: desktop only, full and light tiers, after LCP + 1.5 s idle */
  if (video && !ctx.still && matchMedia('(min-width: 1024px)').matches) {
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.05 });
    io.observe(section);
    document.addEventListener('visibilitychange', syncPlayback);
    if (pauseBtn) pauseBtn.addEventListener('click', () => {
      userPaused = !userPaused;
      pauseBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
      const label = pauseBtn.querySelector('.visually-hidden');
      if (label) label.textContent = userPaused ? 'Play the terrace film' : 'Pause the terrace film';
      syncPlayback();
    });
    video.addEventListener('canplaythrough', () => {
      const hero = ctx.getHero();
      if (hero && hero.setVideo) ctx.safe('hero.setVideo', () => hero.setVideo(video));
    }, { once: true });
    video.addEventListener('playing', () => { media.classList.add('is-playing'); if (pauseBtn) pauseBtn.hidden = false; });
    // the DOM loop steps back whenever it is not actually playing (a paused loop must never sit over the still)
    video.addEventListener('pause', () => { if (!userPaused) media.classList.remove('is-playing'); });
    ctx.ready.then(() => {
      const start = () => setTimeout(() => startLoop(), 1500);
      if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 4000 }); else setTimeout(start, 500);
    });
  }
}

function startLoop() {
  if (!video || video.dataset.started) return;
  video.dataset.started = '1';
  video.load();
  syncPlayback();
}

function syncPlayback() {
  if (!video || !video.dataset.started) return;
  const shouldPlay = inView && !userPaused && !document.hidden;
  if (shouldPlay) {
    const p = video.play();
    if (p && p.catch) p.catch(() => { media.classList.remove('is-playing'); });
  } else {
    video.pause();
  }
}

export function create(ctx) {
  const { gsap, ScrollTrigger, still, emit } = ctx;
  if (!section || still) return null;
  const triggerVars = { trigger: section, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true };
  gsap.to(titleEl, {
    y: () => -0.12 * section.offsetHeight,
    ease: 'none',
    scrollTrigger: {
      ...triggerVars,
      onUpdate: (self) => {
        ctx.setVar('--hero-p', self.progress.toFixed(4));
        emit('pp:scene', { id: 'hero', p: self.progress });
      },
    },
  });
  return null;
}
