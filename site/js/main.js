/* The Playpen School sample homepage: boot (Contract C, spec §10.4; polish pass 2026-10-09).
   Order: tier and caps → preloader.start() (the storyboard runs from here; the heavy work below
   lands under it, where a long frame pauses the tweens instead of jumping them) → the renderer
   (full tier) → the interaction modules, then the scenes (every ScrollTrigger and SplitText, in
   page order, inside gsap.matchMedia()), always built at scrollY 0 → fonts/images progress →
   preloader.finish(): the one ScrollTrigger.refresh() on the exit's first frame → after the lift:
   html.is-loading off, Lenis, the saved scroll position or the URL's hash restored (then a settle
   pass over anything the restore jumped past), cursor, the motion toggle. The page focuses
   nothing: the next Tab is the first skip link. The idle warm-ups (the Ground plate, the first
   Ascent slides, the medallion rig) wait for the cover's intro to settle. Nothing here touches
   WebGL directly. */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import * as scroll from './sections/scroll.js';
import * as reveals from './sections/reveals.js';
import * as nav from './sections/nav.js';
import * as menu from './sections/menu.js';
import * as sheet from './sections/sheet.js';
import * as cursor from './sections/cursor.js';
import * as magnet from './sections/magnet.js';
import * as cover from './sections/cover.js';
import * as ground from './sections/ground.js';
import * as ascent from './sections/ascent.js';
import * as learning from './sections/learning.js';
import * as life from './sections/life.js';
import * as ledger from './sections/ledger.js';
import * as present from './sections/present.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const html = document.documentElement;
const query = new URLSearchParams(location.search);
const errors = [];
const VERSION = '1.0.0';

function err(where, e) {
  const message = (e && e.message) || String(e);
  errors.push({ where, message, at: Date.now(), stack: (e && e.stack) ? String(e.stack).split('\n').slice(0, 4).join(' | ') : undefined });
  if (html.classList.contains('present')) console.debug('[playpen]', where, message);
}
function emit(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}
function safe(where, fn) {
  try { return fn(); } catch (e) { err(where, e); return undefined; }
}
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const mark = (name) => { try { performance.mark('pp:' + name); } catch (e) { /* no User Timing */ } };

/* 1. Capabilities (the inline gate already set html[data-tier]) ------------ */
let tier = html.dataset.tier || 'light';
const caps = {
  reduce: matchMedia('(prefers-reduced-motion: reduce)').matches || readStorage(localStorage, 'pp:motion') === 'reduced',
  finePointer: matchMedia('(hover: hover) and (pointer: fine)').matches,
  webgl2: (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch (e) { return false; } })(),
  lowEnd: (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 4) <= 2,
  touch: matchMedia('(pointer: coarse)').matches,
  get tier() { return tier; },
};
function readStorage(store, key) { try { return store.getItem(key); } catch (e) { return null; } }
function writeStorage(store, key, value) { try { value === null ? store.removeItem(key) : store.setItem(key, value); } catch (e) { /* private mode */ } }
function setTier(next) {
  tier = next;
  html.dataset.tier = next;
  ctx.tier = next;
  ctx.still = next === 'still';
  emit('pp:tier', { tier: next });
}

let resolveReady;
const ready = new Promise((r) => { resolveReady = r; });
let resolveIntro;
const introSettled = new Promise((r) => { resolveIntro = r; });
/* The idle warm-ups wait for this: the cover's intro has settled and the page has rested 600 ms
   (the loader modules' import is a 60–80 ms task; it lands after the eye has settled too), or
   2.5 s after ready at the latest */
const calm = Promise.race([introSettled.then(() => delay(600)), ready.then(() => delay(2500))]);
/* The renderer's first draw (a cold shader compile) waits for this: the preloader's exit, whose
   first frames ease in so slowly that a long task there costs the viewer nothing */
let releaseDraw = () => {};
const drawGate = new Promise((r) => { releaseDraw = r; });

/* The context every section module receives */
const ctx = {
  gsap, ScrollTrigger, SplitText,
  caps, query, errors, err, emit, safe,
  get tier() { return tier; },
  set tier(v) { tier = v; },
  still: tier === 'still',
  desktop: matchMedia('(min-width: 1024px)').matches,
  mobile: !matchMedia('(min-width: 1024px)').matches,
  lenis: null,
  hero: null,
  getHero: () => (html.classList.contains('gl-ready') ? ctx.hero : null),
  setVar: (name, value) => html.style.setProperty(name, String(value)),
  scrollTo: () => {},
  ready,
};

window.__PLAYPEN = {
  ready, errors, caps, version: VERSION,
  get tier() { return tier; },
  get lenis() { return ctx.lenis; },
  get hero() { return ctx.hero; },
  preloader: null,
};
emit('pp:tier', { tier });

/* 2. Preloader ------------------------------------------------------------- */
async function loadPreloader() {
  for (const path of ['./preloader.js']) {
    try {
      const mod = await import(path);
      if (mod && mod.preloader) return mod.preloader;
    } catch (e) { err('import ' + path, e); }
  }
  return inlinePreloader();
}
function inlinePreloader() {
  const el = document.getElementById('preloader');
  const flip = document.getElementById('preloader-flip');
  let started = 0;
  return {
    start() { started = performance.now(); emit('pp:preloader', { phase: 'start' }); },
    setProgress() {},
    async finish() {
      await delay(Math.max(0, 300 - (performance.now() - started)));
      emit('pp:preloader', { phase: 'exit', duration: 300 });
      if (el) { el.style.transition = 'opacity 300ms'; el.style.opacity = '0'; await delay(300); el.remove(); }
      if (flip) flip.remove();
      emit('pp:preloader', { phase: 'done' });
    },
  };
}

let introStarted = false;
function startIntro() {
  if (introStarted) return;
  introStarted = true;
  // cover.intro resolves when its timeline has settled (the still tier: at once)
  Promise.resolve(safe('intro', () => cover.intro(ctx))).then(() => resolveIntro(), () => resolveIntro());
}

let refreshed = false;
const refreshOnce = () => { if (!refreshed) { refreshed = true; mark('refresh'); ScrollTrigger.refresh(); } };
let fontsReady = false;
document.fonts.ready.then(() => { fontsReady = true; });

window.addEventListener('pp:preloader', (e) => {
  const d = e.detail || {};
  if (d.phase === 'exit') {
    // The exit's first frame: the FLIP and the lift are barely moving (both ease in), so the one
    // global refresh (119 triggers, about 25 ms measured) costs the viewer nothing here, and the
    // lift's last frame keeps only the class change and Lenis (about 3 ms). scrollbar-gutter:
    // stable (main.css §2) keeps the layout identical once html.is-loading goes.
    refreshOnce();
    releaseDraw();   // the plane's first frame, on the next tick: live before the sheet lifts off the hero
    const lead = Math.max(0, (d.duration || 0) - 350);
    setTimeout(startIntro, lead);
  }
});

const preloader = await loadPreloader();
window.__PLAYPEN.preloader = preloader;

/* The storyboard starts now, before the renderer and the scenes: their long tasks (100–400 ms on
   a cold profile) land in the first frames of the entry, where lagSmoothing pauses the tweens
   instead of jumping them, and the exit clock starts that much earlier. A long task during it
   (the cold shader compile at the exit) pauses the tweens for a frame: a frame over 100 ms counts
   as 16 ms. Lenis sets lagSmoothing(0) after the lift, when the scroll must stay in step. */
gsap.ticker.lagSmoothing(100, 16);
safe('preloader.start', () => preloader.start());

/* The restore target: a reload or a back/forward entry comes back to the position saved on
   pagehide; a deep link (#admissions) lands on its section. Either way the scenes are built at
   scrollY 0 (a pinned scene built with the page already past it broke ScrollTrigger's refresh and
   left every later trigger uncreated), and the jump happens after the lift, with Lenis. */
const navType = (() => { try { return (performance.getEntriesByType('navigation')[0] || {}).type || 'navigate'; } catch (e) { return 'navigate'; } })();
let restoreY = null;
if (navType === 'reload' || navType === 'back_forward') {
  const v = parseFloat(readStorage(sessionStorage, 'pp:y'));
  if (Number.isFinite(v) && v > 0) restoreY = v;
}
const restoreId = location.hash && location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1))) ? decodeURIComponent(location.hash.slice(1)) : null;
window.addEventListener('pagehide', () => writeStorage(sessionStorage, 'pp:y', String(Math.round(window.scrollY))));
window.scrollTo(0, 0);

/* Full tier: the renderer is created under the storyboard (three.js was modulepreloaded by the
   gate; the import's evaluation and the WebGL context are the costly part, 50–150 ms on a cold
   profile), while its first draw waits for the exit (createHero's drawAfter): the plane is live
   before the sheet lifts off the hero. A renderer that cannot start drops the tier to light
   before the modules read it. */
let heroApi = null;
let heroBoot = null;   // resolves once the plane has drawn its first frame and html.gl-ready is on
if (tier === 'full') {
  try { heroApi = await bootHero(); } catch (e) { err('createHero', e); setTier('light'); }
  if (heroApi) {
    heroBoot = heroApi.ready.then(() => {
      ctx.hero = heroApi;
      html.classList.add('gl-ready');   // at the exit, under the lifting sheet
      mark('gl-ready');
      emit('pp:gl', { state: 'ready' });
      // the canvas is fixed and the DOM media only change opacity: no layout moved, so the plane
      // just re-reads its rects (a full ScrollTrigger refresh here cost a frame during the intro)
      safe('hero.resize', () => heroApi.resize());
    }).catch((e) => {
      err('createHero', e);
      setTier('light');
    });
  }
}

/* 3. Under the storyboard's first frames: the modules, then the scenes ---------------------------
   Every ScrollTrigger and SplitText instance exists before the exit: the exit and the hero intro
   never pay for them (measured in one task: 180–300 ms on a cold profile, 90–130 warm). The task
   lands while the datum line is drawing; lagSmoothing holds the line for its duration and the
   storyboard continues from where it was, which the eye reads as a slightly later start rather
   than a hitch mid-motion. After the lift it used to freeze the first frame for 130–180 ms. */
safe('reveals.init', () => reveals.init(ctx));      // attaches the split / clipReveal / reveal helpers to ctx
safe('cover.prepare', () => cover.prepare(ctx));   // hides the hero copy until the intro (motion tiers)
safe('magnet.init', () => magnet.init(ctx));        // the preloader's Skip is magnetic too
safe('scroll.init', () => scroll.init(ctx));        // ScrollTrigger config and the anchor handler; Lenis comes after the lift
safe('nav.init', () => nav.init(ctx));
safe('menu.init', () => menu.init(ctx));
safe('sheet.init', () => sheet.init(ctx));
safe('cover.init', () => cover.init(ctx));
safe('ground.init', () => ground.init(ctx));
safe('ascent.init', () => ascent.init(ctx));
safe('learning.init', () => learning.init(ctx));
safe('life.init', () => life.init(ctx));
safe('ledger.init', () => ledger.init(ctx));
if (html.classList.contains('present')) safe('present.init', () => present.init(ctx));

const order = [cover, reveals, nav, ground, ascent, learning, life, ledger];   // page order: the triggers are created in this sequence
const mm = gsap.matchMedia();
mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' }, (c) => {
  ctx.desktop = !!c.conditions.desktop;
  ctx.mobile = !!c.conditions.mobile;
  const cleanups = order.map((m) => safe(m === reveals ? 'reveals.create' : 'scene.create', () => (m.create ? m.create(ctx) : null)));
  ScrollTrigger.sort();
  return () => cleanups.forEach((fn) => { if (typeof fn === 'function') safe('scene.cleanup', fn); });
});
mark('scenes');
window.scrollTo(0, 0);   // a late fragment scroll (the browser's own) must not move the page under the scenes

/* 4. Progress: fonts + decoded critical images ----------------------------- */
const critical = Array.from(document.querySelectorAll('img[data-critical]'));
const total = critical.length + 1;
let done = 0;
const tick = () => safe('setProgress', () => preloader.setProgress(++done / total));
const decode = (img) => (img.decode ? img.decode() : Promise.resolve()).catch(() => {});
const tasks = [
  document.fonts.ready.then(tick, tick),
  ...critical.map((img) => decode(img).then(tick, tick)),
];
document.fonts.ready.then(() => safe('cover.split', () => cover.splitTitle(ctx)));

/* 5. Finish (the preloader enforces the 900 / 2,500 ms window) ------------- */
await Promise.race([Promise.allSettled(tasks), delay(2300)]);
safe('setProgress', () => preloader.setProgress(1));
try { await preloader.finish(); } catch (e) { err('preloader.finish', e); }
startIntro();   // in case the exit event never came
refreshOnce();  // same
releaseDraw();  // same

/* 6. After the lift: the page is live ------------------------------------- */
mark('lift');
html.classList.remove('is-loading');
writeStorage(sessionStorage, 'pp:introSeen', '1');
safe('scroll.createLenis', () => scroll.createLenis(ctx));
/* the saved position (reload, back/forward) or the deep link, in one immediate jump, then the
   settle pass: anything the jump left above the viewport with a reveal still pending is shown */
if (restoreY != null || restoreId) {
  const target = restoreY != null ? restoreY : document.getElementById(restoreId);
  safe('restore', () => ctx.scrollTo(target, { immediate: true }));
  safe('restore.update', () => ScrollTrigger.update());
  requestAnimationFrame(() => safe('settle', () => reveals.settle(ctx)));
  mark('restore');
}
safe('cursor.init', () => cursor.init(ctx));
if (!fontsReady) document.fonts.ready.then(() => ScrollTrigger.refresh());

/* Motion toggle (footer) and the OS setting --------------------------------- */
const toggle = document.getElementById('motion-toggle');
if (toggle) {
  toggle.setAttribute('aria-pressed', tier === 'still' ? 'true' : 'false');
  toggle.addEventListener('click', () => {
    const pressed = toggle.getAttribute('aria-pressed') === 'true';
    writeStorage(localStorage, 'pp:motion', pressed ? null : 'reduced');
    toggle.setAttribute('aria-pressed', pressed ? 'false' : 'true');
    const url = new URL(location.href);
    url.searchParams.delete('tier');
    location.replace(url.toString());
  });
}
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => location.reload());

/* Resize: debounced refresh, then the renderer ----------------------------- */
let resizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
});
ScrollTrigger.addEventListener('refresh', () => { if (ctx.hero) safe('hero.resize', () => ctx.hero.resize()); });
document.addEventListener('visibilitychange', () => {
  if (!ctx.hero) return;
  safe('hero.visibility', () => (document.hidden ? ctx.hero.pause() : ctx.hero.resume()));
  if (!document.hidden) ScrollTrigger.update();
});

/* No programmatic focus: the overlay (and the Skip inside it) sits before the skip links in the
   DOM, so once it is gone sequential navigation starts again from the top and the first Tab is
   "Skip to content". Moving focus to <main> here used to skip the skip links, the header and the
   menu, and landed on a button still hidden by the intro. */
// shown inside the present-mode phone frame: hand Esc up to the presenting page
if (window.parent !== window) {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { try { window.parent.postMessage('pp:escape', location.origin); } catch (e2) { /* cross-origin host */ } }
  });
}

/* 7. Full tier: the one renderer (Contract B); created before the storyboard, drawn at the exit ---- */
async function bootHero() {
  const canvas = document.getElementById('gl');
  if (!canvas) throw Object.assign(new Error('no canvas'), { code: 'NO_CANVAS' });
  let mod = null;
  for (const path of ['./webgl/hero.js']) {
    try { mod = await import(path); if (mod && mod.createHero) break; mod = null; } catch (e) { err('import ' + path, e); }
  }
  if (!mod) throw Object.assign(new Error('hero module missing'), { code: 'THREE_IMPORT_FAILED' });
  mark('hero:module');

  const heroImg = document.getElementById('hero-img');
  const heroVideo = document.getElementById('hero-video');
  const ascentVideo = document.getElementById('ascent-video');
  const chapterImgs = Array.from(document.querySelectorAll('img[data-chapter-img]'));
  const largest = (img) => {
    const set = (img.getAttribute('srcset') || '').split(',').map((s) => s.trim()).filter(Boolean);
    return set.length ? set[set.length - 1].split(/\s+/)[0] : img.currentSrc || img.src;
  };
  // every slide is built from its DOM <img> (createImageBitmap of the <picture>'s own AVIF, one
  // download shared with the page); the 1440 WebP is the fallback if that image fails
  const slides = [
    { src: largest(heroImg), caption: 'The rooftop terrace, 2024', img: heroImg, video: heroVideo,
      depth: './assets/media/hero-1-depth-960.png', luma: './assets/media/hero-1-luma-960.jpg' },
    ...chapterImgs.map((img, i) => ({
      src: './assets/media/ascent-' + (i + 1) + '-1440.webp',
      caption: img.closest('.ascent__pic') ? (document.querySelector('.chapter[data-chapter="' + (i + 1) + '"] .chapter__cap')?.textContent || '') : '',
      img,
      video: i === 0 ? ascentVideo : undefined,
    })),
  ];
  const hero = await mod.createHero({
    canvas,
    slides,
    medallionUrl: './assets/3d/medallion-1k.glb',
    reducedMotion: false,
    onProgress: () => {},
    displacement: './assets/media/disp-brick-512.png',
    warmAfter: calm,       // the medallion's idle preparation waits for the cover's intro
    drawAfter: drawGate,   // the first frame waits for the preloader's exit
  });
  mark('hero:created');
  return hero;
}

/* `ready` resolves after the lift (this code runs after it) and, in the full tier, after the
   plane's first frame; it never hangs on a renderer whose first frame is late (a hidden tab
   draws nothing) */
if (heroBoot) {
  Promise.race([heroBoot, delay(20000)]).then(() => resolveReady(true));
} else {
  resolveReady(true);
}

/* Idle warm-up, once the cover's intro has settled: decode the Ground plate and fetch the first
   two Ascent slides while the page is idle, so the hero → Ground → Ascent handover does not pay
   for them mid-scroll (and the intro never pays for them either). */
Promise.all([ready, calm]).then(() => {
  const warm = () => safe('warm', () => {
    mark('warm');
    const plate = document.querySelector('#ground-plate img');
    if (plate) { plate.loading = 'eager'; if (plate.decode) plate.decode().catch(() => {}); }
    if (ctx.hero && ctx.hero.warm) ctx.hero.warm([1, 2]);
  });
  if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 3000 }); else setTimeout(warm, 1200);
});

/* Glue: scene events → the renderer (it creates no ScrollTriggers itself) -- */
window.addEventListener('pp:scene', (e) => {
  const hero = ctx.getHero();
  if (!hero) return;
  const { id, p } = e.detail || {};
  if (id === 'hero') safe('hero.setScroll', () => hero.setScroll(p));
  else if ((id === 'ascent' || id === 'ledger') && hero.setScene) safe('hero.setScene', () => hero.setScene(id, p));
});
window.addEventListener('pp:chapter', (e) => {
  const hero = ctx.getHero();
  if (!hero) return;
  safe('hero.goTo', () => hero.goTo(e.detail.index));
});
window.addEventListener('pp:gl', (e) => {
  const state = e.detail && e.detail.state;
  if (state === 'degraded' || state === 'disposed') {
    const hero = ctx.hero;
    ctx.hero = null;
    html.classList.remove('gl-ready');
    if (state === 'degraded' && hero) safe('hero.dispose', () => hero.dispose());
    setTier('light');
  }
});
