/**
 * Playpen Version 1 · the preloader (Contract A, final-spec §4 and §10.2). Owner: E2.
 *
 *   import { preloader } from './preloader.js';
 *   preloader.start();            // entry: datum line, crest rise, wordmark, light sweep
 *   preloader.setProgress(p);     // 0..1, drives the ten storey ticks; monotonic; eased 0.4 s
 *   await preloader.finish();     // waits for progress (≥ 900 ms, ≤ 2,500 ms; the tenth tick shown
 *                                 // ≥ 150 ms), exits, removes itself
 *
 * Modes, read from <html> at start():
 *   full   first visit on a motion tier: the whole storyboard, then the crest FLIP to #nav-mark
 *          and the sheet lift (exit 950 ms)
 *   short  html.intro-seen (return visit in the session): paper and the crest, a 300 ms fade
 *   still  html[data-tier="still"]: crest shown at once, a 200 ms fade, nothing moves
 *
 * Events on window: 'pp:preloader' with detail {phase: 'start' | 'exit' | 'done', duration, ...}.
 * Imports only gsap. Never touches Lenis, ScrollTrigger or the hero. Never throws.
 */
import { gsap } from 'gsap';

/* Polish pass 2026-10-09: the storyboard now starts before the renderer and the scenes are built
   (main.js), and the entry and exit are shorter: the lift lands at about 1.7 s on a fast desktop
   instead of 2.3-2.9 s. The entry itself (line 350 ms, crest 500 ms from 200 ms, sweep at 550 ms)
   ends at about 1.1 s, which is the real floor of `min`. */
const T = {
  min: 700,        // the exit never starts earlier than this after start()
  max: 2000,       // ... and never later, whatever the progress says
  hold: 120,       // the tenth tick has been filled at least this long before the exit starts
  skipAt: 900,     // Skip becomes visible (it was focusable from 0 ms)
  flip: 480,       // crest FLIP preloader → nav
  liftDelay: 100,  // the sheet starts lifting this long after the FLIP starts
  lift: 640,       // the sheet lift
  shortMax: 1000,  // return visit: fade at the latest after this
  shortFade: 300,
  stillFade: 200,
  watchdog: 4000,  // finish() never called: exit on our own
};
const EXIT = T.liftDelay + T.lift; // 740 ms

const S = {
  phase: 'idle',   // idle | entering | waiting | exiting | done
  mode: 'full',
  t0: 0,
  target: 0,       // progress asked for (monotonic)
  shown: 0,        // ticks filled so far
  ticksFullAt: 0,  // when the tenth tick filled (the hold counts from here)
  skipped: false,
  el: null,
  finishing: null, // the promise finish() returns
  entry: null,     // the entry timeline (full mode)
  waitResolve: null,
  timers: [],
  tweens: [],
};
const prog = { v: 0 };
let quick = null;

const now = () => performance.now();
const elapsed = () => now() - S.t0;
const emit = (phase, extra = {}) => {
  window.dispatchEvent(new CustomEvent('pp:preloader', { detail: { phase, ...extra } }));
};
const later = (fn, ms) => { const id = setTimeout(fn, ms); S.timers.push(id); return id; };
const delay = (ms) => new Promise((r) => later(r, ms));

function grab() {
  const overlay = document.getElementById('preloader');
  if (!overlay) return null;
  const navMark = document.getElementById('nav-mark');
  return {
    overlay,
    flip: document.getElementById('preloader-flip'),
    line: overlay.querySelector('.preloader__line'),
    crestWrap: overlay.querySelector('.preloader__crest'),
    crest: overlay.querySelector('#preloader-crest') || overlay.querySelector('.preloader__crest img'),
    word: overlay.querySelector('.preloader__word'),
    ticksWrap: overlay.querySelector('.preloader__ticks'),
    ticks: Array.from(overlay.querySelectorAll('.preloader__ticks .tick')),
    skip: overlay.querySelector('#preloader-skip'),
    navMark,
    navImg: navMark ? navMark.querySelector('img') : null,
    navWord: document.querySelector('.nav__word'),
  };
}

/* The rendered rect of an <img>'s picture, not its box (object-fit: contain leaves air). */
function contentRect(img) {
  const r = img.getBoundingClientRect();
  const nw = img.naturalWidth, nh = img.naturalHeight;
  if (!nw || !nh || !r.width || !r.height) return r;
  const fit = getComputedStyle(img).objectFit;
  if (fit !== 'contain' && fit !== 'scale-down') return r;
  const s = Math.min(r.width / nw, r.height / nh);
  const w = nw * s, h = nh * s;
  return { left: r.left + (r.width - w) / 2, top: r.top + (r.height - h) / 2, width: w, height: h };
}

/* Where the crest lands: the nav mark's <img> if it has a box, else the slot, else a sane corner. */
function landingRect(el, src) {
  const { navMark, navImg } = el;
  if (navImg && navImg.getBoundingClientRect().width > 0) return contentRect(navImg);
  if (navMark) {
    const r = navMark.getBoundingClientRect();
    if (r.width > 0) {
      const w = Math.min(r.width, r.height * (src.width / src.height));
      return { left: r.left + (r.width - w) / 2, top: r.top, width: w, height: w * (src.height / src.width) };
    }
  }
  return { left: 24, top: 20, width: 32, height: 32 * (src.height / src.width) };
}

function showNavMark(el) {
  const { navMark, navImg } = el;
  if (navMark) navMark.classList.add('is-landed');   // main.css: html.is-loading .nav__mark.is-landed img
  if (!navImg) return;
  navImg.classList.add('is-visible');
  navImg.style.opacity = '1';
  navImg.style.visibility = 'visible';
}

/* Milliseconds after the exit starts at which the datum line (y = 50 %) passes y = 72 px,
   for the header rule hand-over (spec §4, exit 150–950). */
function lineAtNav(height) {
  const target = 0.5 - 72 / Math.max(height, 1);
  if (target <= 0) return T.liftDelay;
  const ease = gsap.parseEase('power4.inOut');
  let lo = 0, hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (ease(mid) < target) lo = mid; else hi = mid;
  }
  return Math.round(T.liftDelay + lo * T.lift);
}

function paintTicks(v) {
  const n = Math.min(10, Math.round(v * 10));
  if (!S.el || n <= S.shown) return;
  for (let i = S.shown; i < n && i < S.el.ticks.length; i++) S.el.ticks[i].classList.add('is-filled');
  S.shown = n;
  if (n >= 10 && !S.ticksFullAt) S.ticksFullAt = now();
}

function ready() {
  if (S.skipped) return true;
  const e = elapsed();
  if (S.mode === 'full') return (S.target >= 1 && e >= T.min) || e >= T.max;
  if (S.mode === 'short') return S.target >= 1 || e >= T.shortMax;
  return S.target >= 1 || e >= T.max;
}
function check() {
  if (S.waitResolve && ready()) { const r = S.waitResolve; S.waitResolve = null; r(); }
}
const waitForReady = () => (ready() ? Promise.resolve() : new Promise((r) => { S.waitResolve = r; }));

function fontsSettled() {
  const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  return Promise.race([fonts.catch(() => {}), delay(600)]);
}

function onKey(e) {
  if (e.key === 'Escape' && (S.phase === 'entering' || S.phase === 'waiting')) {
    e.preventDefault();
    skip();
  }
}

function enterFull(el) {
  const { overlay, line, crestWrap, crest, word, ticksWrap } = el;
  // The stylesheet holds the same first-paint values; GSAP reads a CSS translateY(110%) back as
  // pixels on `y`, so `y: 0` is set explicitly and only yPercent carries the rise.
  if (line) gsap.set(line, { scaleX: 0, transformOrigin: '0% 50%' });
  if (crest) gsap.set(crest, { y: 0, yPercent: 110 });
  if (word) gsap.set(word, { opacity: 0, y: 8 });
  overlay.classList.add('is-live');

  const tl = gsap.timeline();
  if (line) tl.to(line, { scaleX: 1, duration: 0.35, ease: 'expo.out' }, 0);
  if (crest) tl.to(crest, { yPercent: 0, duration: 0.5, ease: 'power4.out' }, 0.2);
  if (ticksWrap) tl.add(() => ticksWrap.classList.add('is-drawn'), 0.25);
  if (word) {
    tl.add(() => {
      fontsSettled().then(() => {
        if (S.phase === 'entering' || S.phase === 'waiting') {
          S.tweens.push(gsap.to(word, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }));
        }
      });
    }, 0.5);
  }
  if (crestWrap) tl.add(() => crestWrap.classList.add('is-sweep'), 0.55);
  S.tweens.push(tl);
  S.entry = tl;
}

function armSkip(el) {
  const { overlay, skip: btn } = el;
  if (btn) btn.addEventListener('click', skip);
  window.addEventListener('keydown', onKey);
  later(() => {
    if (S.phase !== 'entering' && S.phase !== 'waiting') return;
    overlay.classList.add('is-skippable');
    if (btn && document.hasFocus() && (!document.activeElement || document.activeElement === document.body)) {
      try { btn.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    }
  }, T.skipAt);
}

function cleanup(el, clone) {
  if (clone) clone.remove();
  const active = document.activeElement;
  if (active && el.overlay.contains(active)) active.blur();
  if (el.skip) el.skip.removeEventListener('click', skip);
  window.removeEventListener('keydown', onKey);
  S.timers.forEach(clearTimeout);
  S.timers.length = 0;
  S.tweens.forEach((t) => t.kill());
  S.tweens.length = 0;
  gsap.killTweensOf(prog);
  el.overlay.remove();
  if (el.flip) el.flip.remove();
  S.phase = 'done';
  emit('done');
}

async function exitFull(el) {
  const { overlay, flip, crestWrap, crest, word, navWord } = el;
  S.phase = 'exiting';
  overlay.classList.remove('is-skippable');
  overlay.classList.add('is-exiting');
  overlay.setAttribute('aria-hidden', 'true');

  const src = crest ? contentRect(crest) : { left: 0, top: 0, width: 128, height: 133 };
  // the SVG crest has an intrinsic 1000 × 1039 box; an <img> with no natural size falls back to its rect
  if (crest && (!src.width || !src.height)) { const r = crest.getBoundingClientRect(); src.left = r.left; src.top = r.top; src.width = r.width; src.height = r.height; }
  const dst = landingRect(el, src);
  emit('exit', {
    duration: EXIT, flip: T.flip, liftDelay: T.liftDelay, lift: T.lift,
    lineAtNav: lineAtNav(overlay.getBoundingClientRect().height || window.innerHeight),
  });

  const tl = gsap.timeline();
  let clone = null;
  if (crest && flip && dst.width > 0 && dst.height > 0) {
    clone = crest.cloneNode(false);
    clone.removeAttribute('id');
    clone.removeAttribute('data-critical');
    clone.removeAttribute('fetchpriority');
    clone.alt = '';
    clone.setAttribute('aria-hidden', 'true');
    clone.style.cssText = `position:absolute;left:${dst.left}px;top:${dst.top}px;width:${dst.width}px;height:${dst.height}px;transform-origin:0 0;`;
    flip.appendChild(clone);
    gsap.set(clone, {
      x: src.left - dst.left, y: src.top - dst.top,
      scaleX: src.width / dst.width, scaleY: src.height / dst.height,
    });
    tl.to(clone, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: T.flip / 1000, ease: 'power3.inOut' }, 0);
  }
  if (crestWrap) crestWrap.style.visibility = 'hidden';
  if (word) {
    gsap.killTweensOf(word);
    tl.to(word, { opacity: 0, y: -6, duration: 0.4, ease: 'power3.out' }, 0);
  }
  if (navWord && parseFloat(getComputedStyle(navWord).opacity) < 1) {
    tl.fromTo(navWord, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power3.out' }, 0.3);
  }
  tl.add(() => showNavMark(el), T.flip / 1000);
  tl.to(overlay, { yPercent: -100, duration: T.lift / 1000, ease: 'power4.inOut' }, T.liftDelay / 1000);
  S.tweens.push(tl);
  await tl.then();
  cleanup(el, clone);
}

async function exitFade(el, ms) {
  const { overlay } = el;
  S.phase = 'exiting';
  overlay.classList.remove('is-skippable');
  overlay.setAttribute('aria-hidden', 'true');
  showNavMark(el);
  emit('exit', { duration: ms });
  const tw = gsap.to(overlay, { opacity: 0, duration: ms / 1000, ease: 'power2.out' });
  S.tweens.push(tw);
  await tw.then();
  cleanup(el, null);
}

function start() {
  if (S.phase !== 'idle') return;
  S.t0 = now();
  S.el = grab();
  const html = document.documentElement;
  const tier = html.dataset.tier || 'full';
  S.mode = tier === 'still' ? 'still' : html.classList.contains('intro-seen') ? 'short' : 'full';
  S.phase = 'entering';

  if (!S.el) { emit('start', { mode: S.mode }); return; }
  const el = S.el;

  if (S.mode === 'full') {
    enterFull(el);
    quick = gsap.quickTo(prog, 'v', { duration: 0.4, ease: 'power2.out', onUpdate: () => paintTicks(prog.v) });
    if (S.target > 0) quick(S.target);
  } else {
    el.overlay.classList.add('is-live');
    showNavMark(el);
    prog.v = S.target;
    paintTicks(prog.v);
  }
  armSkip(el);
  later(check, T.min);
  later(check, T.max);
  later(check, T.shortMax);
  later(() => {
    if (!S.finishing && S.phase !== 'done') {
      console.warn('[preloader] finish() was never called; leaving on the watchdog.');
      finish();
    }
  }, T.watchdog);
  emit('start', { mode: S.mode });
}

function setProgress(p) {
  p = Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : 0;
  if (p <= S.target) return;
  S.target = p;
  if (!S.el || S.phase === 'idle' || S.phase === 'exiting' || S.phase === 'done') { check(); return; }
  if (S.mode === 'full' && quick) quick(p);
  else { prog.v = p; paintTicks(p); }
  check();
}

function finish() {
  if (S.finishing) return S.finishing;
  S.finishing = (async () => {
    if (S.phase === 'idle') start();
    const el = S.el;
    if (!el) {
      S.phase = 'done';
      emit('exit', { duration: 0 });
      emit('done');
      return;
    }
    if (S.phase === 'done') return;
    S.phase = 'waiting';
    await waitForReady();
    // The entry never overlaps the exit: in a hidden tab GSAP's ticker is asleep, so the
    // entry finishes (and the exit starts) only once the page is visible again.
    if (S.entry && S.entry.progress() < 1) await S.entry.then();
    if (S.phase !== 'waiting') return;
    gsap.killTweensOf(prog);
    prog.v = 1;
    S.target = 1;
    paintTicks(1);
    // the hold lets the last ticks be seen: 150 ms after the tenth tick filled. On a fast line the
    // ticks were full long before the 900 ms minimum, so the exit then starts at once.
    if (S.mode === 'full' && !S.skipped) {
      const since = S.ticksFullAt ? now() - S.ticksFullAt : 0;
      if (since < T.hold) await delay(T.hold - since);
    }
    if (S.phase !== 'waiting') return;
    if (S.mode === 'full') await exitFull(el);
    else await exitFade(el, S.mode === 'short' ? T.shortFade : T.stillFade);
  })();
  return S.finishing;
}

/* Skip (button, Esc): ignores the minimum time. If finish() is already waiting it exits at once;
   otherwise the next finish() resolves at once. */
function skip() {
  if (S.phase !== 'entering' && S.phase !== 'waiting') return;
  S.skipped = true;
  check();
}

export const preloader = {
  start,
  setProgress,
  finish,
  skip,
  get state() { return S.phase; },
  get mode() { return S.mode; },
  get progress() { return S.target; },
  timings: Object.freeze({ ...T, exit: EXIT }),
};

export default preloader;
