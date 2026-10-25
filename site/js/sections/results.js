/* Sheets 01 and 02, Results and Achievement (2026-10-18): each grade ring draws in segment by
   segment, the bars grow and the centre figure counts up once its panel enters; the Achievement
   photograph opens by curtain and its three figures count up. The markup holds the final state, so
   with JavaScript off or in the still tier (reduced motion) the numbers and rings are simply there. */

let results, achievement;

export function init(ctx) {
  results = document.getElementById('results');
  achievement = document.getElementById('achievement');
  // the carousel is built once here, not in create(): create() re-runs on every breakpoint change
  const root = achievement && achievement.querySelector('[data-ach-carousel]');
  if (root && ctx) ctx.safe('achievement.carousel', () => carousel(ctx, root));
}

/* Achievement carousel (2026-10-20): 7 Graduation Ceremony 2025 photographs in the maroon mount.
   A slow cross-dissolve (the outgoing photograph stays opaque underneath until the incoming one is
   fully in, so the mount never flashes), with a gentle continuous drift on each photograph that
   starts slightly enlarged and settles (one direction, never reversing), and a gold line that fills
   during each hold. Autoplay only while the carousel is on screen and the tab is visible; the hold
   pauses on mouse hover and on keyboard focus inside; the pause button stops all motion (WCAG
   2.2.2). Still tier / reduced motion: no autoplay, no drift, a short fade on a manual change only.
   Slides 2-7 carry data-srcset: each one is fetched during the hold before it and decoded before it
   fades in, so a transition never shows a half-loaded image. The drift lives on the <picture>, not
   the <img>, so the curtain reveal's own scale on the first <img> (reveals.js) never fights it. */
const ACH = {
  hold: 5.8,         // seconds each photograph rests
  fade: 1.7,         // the autoplay cross-dissolve
  fadeManual: 1.1,   // a button, key or swipe
  fadeStill: 0.3,    // reduced motion: a short fade, manual changes only
  scale: 1.065,      // where each photograph's drift starts; it settles to 1
};
// transform origins (per cent) and drift direction, varied per slide; origins stay within 40-60 %
// so the enlarged picture always covers the plate while it drifts
const ACH_DRIFT = [[50, 42, -1], [58, 50, 1], [42, 55, -1], [50, 58, 1], [58, 44, -1], [42, 46, 1], [50, 50, -1]];

function carousel(ctx, root) {
  const { gsap } = ctx;
  const still = !!(ctx.still || (ctx.caps && ctx.caps.reduce));
  const slides = Array.from(root.querySelectorAll('[data-ach-slide]'));
  const n = slides.length;
  if (n < 2) return;
  const media = slides.map((s) => s.querySelector('.ach-slide__media') || s);
  const plate = root.querySelector('.ach-plate') || root;
  const now = root.querySelector('[data-ach-current]');
  const fill = root.querySelector('[data-ach-fill]');
  const status = root.querySelector('[data-ach-status]');
  const btnPrev = root.querySelector('[data-ach-prev]');
  const btnNext = root.querySelector('[data-ach-next]');
  const btnToggle = root.querySelector('[data-ach-toggle]');

  let index = 0;        // the photograph fully shown
  let target = 0;       // where the latest request is heading
  let playing = !still; // the viewer's choice (pause button)
  let onScreen = false;
  let hovered = false;
  let focused = false;
  let hold = null;      // the timeline of the current rest (fills the gold line, then moves on)
  let fade = null;      // the cross-dissolve in progress
  let token = 0;
  const drift = new Array(n).fill(null);

  const pad = (i) => String(i + 1).padStart(2, '0');
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const idle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 300));
  const motionOn = () => !still && playing && onScreen && !document.hidden;

  function load(i) {
    const slide = slides[i];
    const img = slide.querySelector('img');
    if (!img) return Promise.resolve();
    if (!slide.dataset.loaded) {
      slide.dataset.loaded = '1';
      slide.querySelectorAll('source[data-srcset]').forEach((s) => { s.srcset = s.dataset.srcset; s.removeAttribute('data-srcset'); });
      img.loading = 'eager';
      if (img.dataset.srcset) { img.srcset = img.dataset.srcset; img.removeAttribute('data-srcset'); }
      if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
    }
    if (!slide._achReady) {
      const p = img.decode ? img.decode() : new Promise((r) => {
        if (img.complete) r();
        else { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); }
      });
      slide._achReady = p.catch(() => {});
    }
    return slide._achReady;
  }

  function startDrift(i, from = ACH.scale) {
    if (drift[i]) { drift[i].kill(); drift[i] = null; }
    if (!motionOn()) { gsap.set(media[i], { scale: 1, xPercent: 0 }); return; }
    const [ox, oy, dir] = ACH_DRIFT[i % ACH_DRIFT.length];
    gsap.set(media[i], { transformOrigin: ox + '% ' + oy + '%' });
    const settle = (from - 1) / (ACH.scale - 1);
    drift[i] = gsap.fromTo(media[i],
      { scale: from, xPercent: dir * 1.2 * settle },
      { scale: 1, xPercent: 0, duration: ACH.fade + ACH.hold + ACH.fade, ease: 'power1.out' });
  }

  // one place decides what moves: the drift runs while motion is on; the hold also waits for
  // the pointer and keyboard focus to leave
  function sync() {
    const m = motionOn();
    drift.forEach((t) => { if (t) (m ? t.resume() : t.pause()); });
    if (hold) (m && !hovered && !focused ? hold.resume() : hold.pause());
  }

  function startHold() {
    if (hold) { hold.kill(); hold = null; }
    if (still) return;
    if (fill) gsap.set(fill, { scaleX: 0, transformOrigin: '0% 50%' });
    hold = gsap.timeline({ paused: true, onComplete: () => go(index + 1, 'auto') });
    if (fill) hold.to(fill, { scaleX: 1, duration: ACH.hold, ease: 'none' });
    else hold.to({}, { duration: ACH.hold });
    sync();
  }

  function setCounter(i, dur) {
    if (!now) return;
    if (still || dur < 0.5) { now.textContent = pad(i); return; }
    gsap.killTweensOf(now);
    gsap.timeline()
      .to(now, { opacity: 0, y: -4, duration: dur * 0.35, ease: 'power2.in', onComplete: () => { now.textContent = pad(i); } })
      .fromTo(now, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: dur * 0.45, ease: 'power2.out', clearProps: 'transform' });
  }

  // the photographs on screen, bottom to top: one when at rest, more while a dissolve runs or
  // after one was interrupted (each keeps the opacity it had, so nothing ever jumps)
  let stack = [slides[0]];
  const restack = () => stack.forEach((s, i) => { s.style.zIndex = String(1 + i); });
  const opacityOf = (s) => parseFloat(getComputedStyle(s).opacity) || 0;

  // a dissolve has ended: only `to` stays, every other layer goes back to rest
  function settle(to) {
    const b = slides[to];
    stack.forEach((s) => {
      if (s === b) return;
      const i = slides.indexOf(s);
      s.classList.remove('is-active', 'is-incoming');
      gsap.set(s, { clearProps: 'opacity,zIndex' });
      if (drift[i]) { drift[i].kill(); drift[i] = null; }
      gsap.set(media[i], { clearProps: 'transform' });
    });
    b.classList.remove('is-incoming');
    b.classList.add('is-active');
    gsap.set(b, { clearProps: 'opacity,zIndex' });
    stack = [b];
    index = to;
  }

  async function go(to, how) {
    to = ((to % n) + n) % n;
    target = to;
    const my = ++token;
    if (hold) { hold.kill(); hold = null; }
    if (to === index && !fade) { startHold(); return; }
    if (fill && !still) gsap.to(fill, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.7, ease: 'power2.inOut', overwrite: true });
    await Promise.race([load(to), wait(how === 'auto' ? 8000 : 4000)]);
    if (my !== token) return;   // a newer request took over while this image loaded
    if (to === index && !fade) { startHold(); return; }   // the running dissolve ended there meanwhile

    // a change during a dissolve: freeze it where it is (no jump to its end) and dissolve on top
    if (fade) { fade.kill(); fade = null; }
    const b = slides[to];
    const dur = still ? ACH.fadeStill : (how === 'auto' ? ACH.fade : ACH.fadeManual);
    const ease = still ? 'none' : 'power2.inOut';
    slides.forEach((s) => { if (s !== b) { s.setAttribute('aria-hidden', 'true'); s.inert = true; } });
    b.removeAttribute('aria-hidden');
    b.inert = false;
    setCounter(to, dur);
    if (status) status.textContent = how === 'auto' ? '' : 'Photograph ' + (to + 1) + ' of ' + n;

    fade = gsap.timeline({
      onComplete: () => {
        fade = null;
        settle(to);
        if (my !== token) return;   // a newer request is still loading its image; it carries on from here
        startHold();
        idle(() => load((to + 1) % n));   // the next photograph arrives during this rest
      },
    });

    const k = stack.indexOf(b);
    if (k === -1) {
      // a new photograph: it goes on top of whatever is showing and dissolves in from 0
      b.classList.add('is-incoming');
      stack.push(b);
      restack();
      startDrift(to);
      fade.fromTo(b, { opacity: 0 }, { opacity: 1, duration: dur, ease });
    } else {
      // already on screen (e.g. Prev during a dissolve): the layers above it dissolve away from
      // their current opacity while it rises to full, so it never drops to 0 first; its drift
      // carries on untouched (restarting it would jump the scale)
      const above = stack.slice(k + 1);
      const left = Math.max(1 - opacityOf(b), ...above.map(opacityOf));
      const d = Math.max(still ? dur : 0.45, dur * left);
      if (opacityOf(b) < 1) fade.to(b, { opacity: 1, duration: d, ease }, 0);
      above.forEach((s) => fade.to(s, { opacity: 0, duration: d, ease }, 0));
      if (!above.length && opacityOf(b) >= 1) fade.to({}, { duration: 0.01 });
    }
  }

  const next = (how) => go(target + 1, how);
  const prev = (how) => go(target - 1, how);

  if (btnNext) btnNext.addEventListener('click', () => next('manual'));
  if (btnPrev) btnPrev.addEventListener('click', () => prev('manual'));
  if (btnToggle) {
    if (still) btnToggle.hidden = true;
    btnToggle.addEventListener('click', () => {
      playing = !playing;
      btnToggle.dataset.state = playing ? 'playing' : 'paused';
      btnToggle.setAttribute('aria-label', playing ? 'Pause the slideshow' : 'Play the slideshow');
      if (playing && !hold && !fade) startHold();
      sync();
    });
  }
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next('manual'); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev('manual'); }
  });
  root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hovered = true; sync(); } });
  root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hovered = false; sync(); } });
  // keyboard focus pauses the hold; a mouse click on a button (focus without the ring) does not
  root.addEventListener('focusin', (e) => {
    let kb = false;
    try { kb = e.target.matches(':focus-visible'); } catch (err) { kb = true; }
    if (kb) { focused = true; sync(); }
  });
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) { focused = false; sync(); }
  });
  // phones: a horizontal swipe on the photograph
  let sx = 0, sy = 0, st = 0;
  plate.addEventListener('touchstart', (e) => { const t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
  plate.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - st < 900) (dx < 0 ? next : prev)('manual');
  }, { passive: true });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((en) => { onScreen = en.isIntersecting; });
      if (onScreen) idle(() => load((index + 1) % n));
      sync();
    }, { threshold: 0.35 }).observe(root);
  } else {
    onScreen = true;
  }

  if (still) root.classList.add('is-still');
  // the first photograph: a softer start (the curtain reveal already settles its <img>)
  if (!still) {
    const [ox, oy, dir] = ACH_DRIFT[0];
    gsap.set(media[0], { transformOrigin: ox + '% ' + oy + '%' });
    drift[0] = gsap.fromTo(media[0], { scale: 1.03, xPercent: dir * 0.6 }, { scale: 1, xPercent: 0, duration: ACH.hold + ACH.fade, ease: 'power1.out', paused: true });
  }
  startHold();
  root.classList.add('is-ready');
}

function countUp(tl, el, at, duration) {
  const end = parseFloat(el.dataset.count);
  if (!Number.isFinite(end)) return;
  const o = { v: 0 };
  el.textContent = '0';
  tl.to(o, {
    v: end, duration, ease: 'power3.out',
    onUpdate: () => { el.textContent = String(Math.round(o.v)); },
    onComplete: () => { el.textContent = String(end); },
  }, at);
}

function panel(ctx, article) {
  const { gsap, ScrollTrigger } = ctx;
  const DRAW = 1.3;   // seconds for the whole ring
  const segs = Array.from(article.querySelectorAll('.donut__seg'));
  const bars = Array.from(article.querySelectorAll('.grades__bar i'));
  const count = article.querySelector('.donut__num .count');
  const tl = gsap.timeline({ paused: true });

  segs.forEach((seg) => {
    const p = parseFloat(seg.dataset.p);
    const at = parseFloat(seg.dataset.at);
    // the drawn length is read once from the markup and kept: a breakpoint change re-runs create()
    // on a ring that may be half drawn
    if (!seg.dataset.d) seg.dataset.d = (seg.getAttribute('stroke-dasharray') || '0').split(/\s+/)[0];
    const full = parseFloat(seg.dataset.d);
    if (!Number.isFinite(p) || !Number.isFinite(full)) return;
    const o = { d: 0 };
    const set = () => seg.setAttribute('stroke-dasharray', o.d.toFixed(2) + ' ' + (100 - o.d).toFixed(2));
    set();
    tl.to(o, { d: full, duration: DRAW * p / 100, ease: 'none', onUpdate: set }, 0.1 + DRAW * at / 100);
  });
  if (bars.length) {
    gsap.set(bars, { scaleX: 0 });
    tl.to(bars, { scaleX: 1, duration: 0.8, ease: 'power3.out', stagger: 0.07, clearProps: 'transform' }, 0.2);
  }
  if (count) countUp(tl, count, 0.1, DRAW + 0.2);

  ScrollTrigger.create({ trigger: article, start: 'top 78%', once: true, onEnter: () => tl.play() });
}

export function create(ctx) {
  const { ScrollTrigger, still } = ctx;

  if (results) {
    const articles = Array.from(results.querySelectorAll('[data-result]'));
    if (!still) articles.forEach((a) => ctx.safe('results.panel', () => panel(ctx, a)));
  }

  if (achievement) {
    const frame = achievement.querySelector('.frame');
    if (frame) ctx.clipReveal(frame, { start: 'top 80%' });
    const counts = Array.from(achievement.querySelectorAll('.feat__n .count'));
    if (!still && counts.length) {
      const tl = ctx.gsap.timeline({ paused: true });
      counts.forEach((el, i) => countUp(tl, el, 0.15 + i * 0.12, 0.9));
      ScrollTrigger.create({ trigger: achievement.querySelector('.feats'), start: 'top 85%', once: true, onEnter: () => tl.play() });
    }
  }
  return null;
}
