/* Sheet 00, the cover (2026-10-20: the school's film, full screen): the hero intro (H1 lines from
   masks, then the blocks), the exit scrub (--hero-p, pp:scene hero), and the film itself: one file
   picked for the screen, started after the preloader lifts, paused off screen and in a hidden tab,
   and a visible Pause / Play button (WCAG 2.2.2). Reduced motion (the still tier) and Save-Data get
   the poster only until the visitor presses Play. The film is a plain DOM <video>; the WebGL
   renderer no longer draws the hero (js/main.js passes heroPlane: false). */

let split = null;
let titleEl, section, media, video, pauseBtn;
let prepared = false;
let introDone = false;
let userPaused = false;   // the visitor's choice, or "not yet": poster-only modes, a blocked autoplay
let inView = true;
let menuOpen = false;     // the full-screen menu covers the film: no decoding behind it
let useMask = false;      // the masked line rise: full tier, 768 px and wider only (set in prepare)
let ctxRef;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const BLOCKS = '.hero__label, .hero__lead, .hero__actions';
const SRC = './assets/video/hero/';
const KEY = 'pp:heroPaused';

/* v3 "clean" film (2026-11-03, from the 4K source). Codec strings from ffprobe: AV1 Main 10-bit,
   H.264 High. 'hero-1440' is AV1 only (no H.264 file): without AV1 it falls back to hero-1080.mp4. */
const FILES = {
  'hero-9x16-720': { av1: 'av01.0.05M.10', h264: 'avc1.64001F', w: 720, h: 1280 },
  'hero-9x16-1080': { av1: 'av01.0.08M.10', h264: 'avc1.640028', w: 1080, h: 1920 },
  'hero-720': { av1: 'av01.0.05M.10', h264: 'avc1.64001F', w: 1280, h: 720 },
  'hero-1080': { av1: 'av01.0.08M.10', h264: 'avc1.640028', w: 1920, h: 1080 },
  'hero-1440': { av1: 'av01.0.12M.10', h264: null, w: 2560, h: 1440 },
};

const readSession = (k) => { try { return sessionStorage.getItem(k); } catch (e) { return null; } };
const writeSession = (k, v) => { try { if (v == null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } };

/* Called before the preloader exits: offset what the intro will settle (motion tiers only; in the
   still tier the cover is complete the moment the overlay lifts). Fix round 2026-10-20: the copy is
   never hidden (opacity stays 1), so the headline paints in the first frame under the preloader and
   the phone LCP lands at first paint instead of after the intro (Lighthouse mobile: 92 % of a 5.6 s
   LCP was render delay). Only the full tier on 768 px and wider keeps the masked line rise; the
   poster is the LCP element there. */
export function prepare(ctx) {
  ctxRef = ctx;
  const { gsap } = ctx;
  section = document.getElementById('hero');
  titleEl = document.getElementById('hero-title');
  if (!section) return;
  prepared = true;
  if (ctx.still) return;
  useMask = ctx.tier === 'full' && window.innerWidth >= 768;
  if (!useMask && titleEl) {
    titleEl.classList.add('is-split');   // visible now; it settles from a small offset in the intro
    gsap.set(titleEl, { y: 24 });
  }
  gsap.set(section.querySelectorAll(BLOCKS), { y: 24 });
}

/* Called once fonts are ready: split the H1 into masked lines (lines only, never characters).
   Skipped when the intro has already played (the split is reverted at the end of the intro). */
export function splitTitle(ctx) {
  if (!titleEl) return;
  if (split || ctx.still || introDone || !useMask) { titleEl.classList.add('is-split'); return; }
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
  if (!split && useMask) {
    try { await Promise.race([document.fonts.ready, delay(600)]); } catch (e) { /* ignore */ }
    if (!split && document.fonts.status === 'loaded') splitTitle(ctx);
  }
  if (introDone) return;
  introDone = true;
  const tl = gsap.timeline({ defaults: { overwrite: true } });
  // the headline lands first, the label, lead and buttons 0.6 s later
  if (split && split.lines && split.lines.length) {
    tl.to(split.lines, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }, 0);
  } else {
    titleEl.classList.add('is-split');
    tl.to(titleEl, { y: 0, duration: 1.1, ease: 'expo.out', clearProps: 'transform' }, 0);
  }
  tl.to(blocks, { y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform' }, 0.6);
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
  if (!video || !pauseBtn || !media) return;

  // muted as a property too: some browsers only allow autoplay when the property is set
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  const saveData = document.documentElement.dataset.save === '1';
  const optIn = ctx.still || saveData;            // poster only until the visitor presses Play
  userPaused = optIn || readSession(KEY) === '1'; // a pause is remembered for the session
  pauseBtn.hidden = false;                        // on screen whenever there is a film to control
  setButton();

  pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    writeSession(KEY, userPaused ? '1' : null);
    setButton();
    if (!userPaused && !video.dataset.started) startLoop();
    else syncPlayback();
  });

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncPlayback();
  }, { threshold: 0 }).observe(section);
  document.addEventListener('visibilitychange', syncPlayback);
  window.addEventListener('pp:menu', (e) => { menuOpen = !!(e.detail && e.detail.open); syncPlayback(); });

  video.addEventListener('playing', () => media.classList.add('is-playing'));
  // a play the page did not ask for (autoplay after the source is set) is held back
  video.addEventListener('play', () => { if (userPaused || !inView || document.hidden) video.pause(); });
  // a file that fails leaves the poster in place and the button reads "Play video"
  video.addEventListener('error', () => {
    media.classList.remove('is-playing');
    delete video.dataset.started;
    userPaused = true;
    setButton();
  });

  // right after the lift: the poster (frame 0) is on screen until the first frame plays over it
  if (!userPaused) ctx.ready.then(() => startLoop());
}

function setButton() {
  if (!pauseBtn) return;
  const label = pauseBtn.querySelector('.hero__pause-label');
  if (label) label.textContent = userPaused ? 'Play video' : 'Pause video';
  pauseBtn.dataset.state = userPaused ? 'paused' : 'playing';
}

/* One file for this screen, chosen once per visit (a rotate keeps it: cover still fills the screen).
   Portrait screens under 1024 px: the 9:16 phone cut (1080x1920 on sharp screens, 720x1280 on
   low-density ones). Landscape: up to 1280 px wide 720p, above that 1080p, and 1440p on screens
   with more than 2200 device pixels across (AV1 only).
   AV1 where the device decodes it smoothly and power-efficiently (MediaCapabilities), else H.264. */
async function pickFile() {
  const w = window.innerWidth, h = window.innerHeight;
  const dpr = window.devicePixelRatio || 1;
  let name;
  if (w < 1024 && h >= w) name = (w * dpr >= 800) ? 'hero-9x16-1080' : 'hero-9x16-720';
  else if (w <= 1280) name = 'hero-720';
  else name = (w * dpr > 2200) ? 'hero-1440' : 'hero-1080';
  let f = FILES[name];
  let av1 = video.canPlayType('video/webm; codecs="' + f.av1 + '"') === 'probably';
  if (av1 && navigator.mediaCapabilities && navigator.mediaCapabilities.decodingInfo) {
    try {
      const info = await Promise.race([
        navigator.mediaCapabilities.decodingInfo({ type: 'file', video: { contentType: 'video/webm; codecs="' + f.av1 + '"', width: f.w, height: f.h, bitrate: 1200000, framerate: 25 } }),
        delay(400).then(() => null),
      ]);
      if (info) av1 = !!(info.supported && info.smooth && info.powerEfficient);
    } catch (e) { /* keep the canPlayType answer */ }
  }
  if (!av1 && !f.h264) { name = 'hero-1080'; f = FILES[name]; }
  return SRC + name + (av1 ? '.av1.webm' : '.mp4');
}

async function startLoop() {
  if (!video || video.dataset.started) return;
  video.dataset.started = '1';
  const src = await pickFile();
  if (!video.dataset.started) return;
  video.preload = 'auto';
  video.src = src;
  syncPlayback();
}

function syncPlayback() {
  if (!video || !video.dataset.started || !video.getAttribute('src')) return;
  const shouldPlay = inView && !userPaused && !document.hidden && !menuOpen;
  if (shouldPlay) {
    const p = video.play();
    if (p && p.catch) {
      p.catch((e) => {
        if (e && e.name === 'AbortError') return;   // a pause() raced the play(): not a refusal
        // autoplay refused (a battery saver, a data saver): the poster stays, the visitor can press Play
        userPaused = true;
        setButton();
      });
    }
  } else if (!video.paused) {
    video.pause();   // the frame holds (no jump back to the poster)
  }
}

export function create(ctx) {
  const { gsap, still, emit } = ctx;
  if (!section || still) return null;
  const copy = section.querySelector('.hero__top');
  const triggerVars = { trigger: section, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true };
  // the copy drifts up a little faster than the page and the film a little slower (both calm)
  gsap.to(copy, {
    y: () => -0.1 * section.offsetHeight,
    ease: 'none',
    scrollTrigger: {
      ...triggerVars,
      onUpdate: (self) => {
        ctx.setVar('--hero-p', self.progress.toFixed(4));
        emit('pp:scene', { id: 'hero', p: self.progress });
      },
    },
  });
  if (media) gsap.to(media, { y: () => 0.18 * section.offsetHeight, ease: 'none', scrollTrigger: { ...triggerVars } });
  // the copy fades out before it reaches the header (it printed under the clear header's wordmark):
  // gone after 38 % of the hero height (1440 x 900: the label meets the 72 px bar after about 360 px)
  gsap.fromTo(copy, { opacity: 1 }, {
    opacity: 0,
    ease: 'none',
    immediateRender: false,
    scrollTrigger: { trigger: section, start: 'top top', end: () => '+=' + Math.round(section.offsetHeight * 0.38), scrub: true, invalidateOnRefresh: true },
  });
  return null;
}
