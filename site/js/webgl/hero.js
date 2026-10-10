/**
 * Contract B (final-spec.md section 10.3): the one renderer for the Playpen sample homepage.
 *
 *   createHero({ canvas, slides, medallionUrl, reducedMotion, onProgress, warmAfter, drawAfter })
 *     -> { ready, setScroll, setPointer, goTo, resize, pause, resume, dispose,
 *          setScene, setVideo, stats, debug }
 *
 * Three WebGL moments, one WebGLRenderer, one fixed canvas (#gl):
 *   - the hero plane: melt + relight + grain, synced to [data-gl="hero"]'s rect
 *   - the Ascent plane: brick displacement between chapters, synced to [data-gl="ascent"]
 *   - the medallion: GLB (or the procedural crest) rendered into a small multisampled target,
 *     composited as a third plane at [data-gl="medallion"]
 *
 * Rules kept (section 10.3): rejects with .code 'WEBGL_UNAVAILABLE' before importing three, or
 * 'THREE_IMPORT_FAILED'; never throws after `ready`; creates no ScrollTriggers and no Lenis; the
 * only window listeners are the DPR resize; the canvas gets webglcontextlost / restored
 * (.is-lost); three is imported dynamically here; the GLTF / Draco loaders and the GLB itself are
 * fetched and decoded at idle after boot and after the caller's `warmAfter` promise (main.js: the
 * cover's intro has settled) (CPU only, medallion.js loadMedallionGltf) and the rig,
 * the shader program (compileAsync) and the texture uploads happen one per frame within two
 * viewports of the Ledger, so the section's arrival costs no long task; DPR cap 1.5 (1 on <= 4
 * cores), 2 for the medallion target while the hero plane is off screen; 90-frame adaptive
 * quality; residency: hero within one viewport, Ascent slides i-1, i, i+1, the GLB on the GPU
 * within two viewports of the Ledger; <= 48 MB resident.
 *
 * Frame loop: gsap.ticker (one loop with Lenis and ScrollTrigger; registered after them, so the
 * rects read here are post-scroll). Every rect is read with getBoundingClientRect() each frame
 * while its element is within 25 % of the viewport (the canvas is fixed, no scroll offset).
 *
 * Events on window: pp:gl { state: 'ready' | 'lost' | 'restored' | 'degraded' | 'medallion' | 'disposed', info }
 */
import { gsap } from 'gsap';
import { VERT_PLANE, FRAG_HERO, FRAG_ASCENT, FRAG_COMPOSITE } from './shaders.js';
import { createMedallion, loadMedallionGltf, disposeGltf } from './medallion.js';

export const DEFAULT_PATHS = Object.freeze({
  depth: './assets/media/hero-1-depth-960.png',
  luma: './assets/media/hero-1-luma-960.jpg',
  displacement: './assets/media/disp-brick-512.png',
  draco: './vendor/three/draco/gltf/',
  logo: './assets/brand/logo-shield-only-1024.png',
  normal: './assets/3d/brushed-normal-512.png',
  roughness: './assets/3d/brushed-roughness-512.png',
});

export const TUNING = Object.freeze({
  dprCap: 1.5,
  dprCapLowEnd: 1,
  dprMedallion: 1.5,       // and the target's long side is capped at 1024 px (polish pass: 2 × 4 MSAA half-float was ~60 MB at DPR 2)
  medallionMaxPx: 1024,
  pointerLerp: 0.08,       // per 60 Hz frame
  lightLerp: 0.05,
  idleAfterMs: 1500,
  idlePeriodS: 14,
  idleY: 0.62,
  grain: 0.035,
  meltTop: 0.66,
  dispMs: 1100,
  dispIntensity: 0.35,
  chroma: 0.003,
  dolly: 0.06,
  videoMixMs: 600,
  warmupFrames: 30,
  sampleFrames: 90,
  slowMs: 20,
  hitchMs: 100,
  masksTimeoutMs: 1500,
  residentMb: 48,
});

const PAPER = [0xf5 / 255, 0xf1 / 255, 0xea / 255];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const now = () => performance.now();

function glError(code, message, cause) {
  const e = new Error(message);
  e.code = code;
  if (cause) e.cause = cause;
  return e;
}

function emit(state, info) {
  try {
    window.dispatchEvent(new CustomEvent('pp:gl', { detail: info === undefined ? { state } : { state, info } }));
  } catch {}
}

function sourceSize(src) {
  if (!src) return { w: 1, h: 1 };
  if (src instanceof HTMLImageElement) return { w: src.naturalWidth || 1, h: src.naturalHeight || 1 };
  if (src instanceof HTMLVideoElement) return { w: src.videoWidth || 1, h: src.videoHeight || 1 };
  return { w: src.width || 1, h: src.height || 1 };
}

/** fetch with byte progress, then decode off the main thread. */
async function fetchBitmap(url, onBytes) {
  const res = await fetch(url, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const total = Number(res.headers.get('content-length')) || 0;
  let blob;
  if (res.body && typeof res.body.getReader === 'function') {
    const reader = res.body.getReader();
    const chunks = [];
    let got = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      got += value.byteLength;
      if (onBytes && total) onBytes(clamp(got / total, 0, 0.98));
    }
    blob = new Blob(chunks, { type: res.headers.get('content-type') || '' });
  } else {
    blob = await res.blob();
  }
  const bmp = await createImageBitmap(blob, { premultiplyAlpha: 'none', colorSpaceConversion: 'default' });
  if (onBytes) onBytes(1);
  return bmp;
}

function waitForImage(img, timeoutMs) {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve(img);
  return new Promise((resolve, reject) => {
    const done = (ok) => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
      clearTimeout(timer);
      ok ? resolve(img) : reject(new Error('image failed: ' + (img.currentSrc || img.src)));
    };
    const onLoad = () => done(true);
    const onError = () => done(false);
    const timer = setTimeout(() => done(false), timeoutMs);
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
  });
}

export async function createHero(options = {}) {
  const { canvas, slides, medallionUrl = null, reducedMotion = false, onProgress = null, warmAfter = null, drawAfter = null } = options;
  const paths = {
    depth: (slides && slides[0] && slides[0].depth) || DEFAULT_PATHS.depth,
    luma: (slides && slides[0] && slides[0].luma) || DEFAULT_PATHS.luma,
    displacement: options.displacement || DEFAULT_PATHS.displacement,
    draco: options.dracoPath || DEFAULT_PATHS.draco,
    logo: options.logoUrl || DEFAULT_PATHS.logo,
    normal: options.normalMapUrl || DEFAULT_PATHS.normal,
    roughness: options.roughnessMapUrl || DEFAULT_PATHS.roughness,
  };
  const debugLog = /[?&]gldebug=1/.test(location.search) ? (...a) => console.debug('[gl]', ...a) : null;

  if (!(canvas instanceof HTMLCanvasElement)) throw glError('WEBGL_UNAVAILABLE', 'createHero: `canvas` is not a <canvas>');
  if (!Array.isArray(slides) || !slides.length || !slides[0]) throw glError('WEBGL_UNAVAILABLE', 'createHero: `slides[0]` is required');

  // The capability check happens on a throwaway canvas, before three is imported.
  let probe = null;
  try { probe = document.createElement('canvas').getContext('webgl2'); } catch {}
  if (!probe) throw glError('WEBGL_UNAVAILABLE', 'WebGL 2 is not available');
  try { const lose = probe.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext(); } catch {}

  let THREE;
  try {
    THREE = await import('three');
  } catch (e) {
    throw glError('THREE_IMPORT_FAILED', 'three.js failed to import', e);
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });
  } catch (e) {
    throw glError('WEBGL_UNAVAILABLE', 'WebGLRenderer could not be created', e);
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;
  renderer.sortObjects = true;

  // ------------------------------------------------------------------ state
  const lowEnd = (navigator.hardwareConcurrency || 4) <= 4;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const state = {
    disposed: false,
    running: true,
    lost: false,
    w: 1,
    h: 1,
    dpr: 1,
    dprScale: 1,
    degraded: false,
    scroll: 0,
    ascentP: 0,
    ledgerP: null,
    cur: slides.length > 1 ? 1 : 0,
    ascentActive: false,
    pointer: { x: 0, y: 0, tx: 0, ty: 0, active: false, at: 0 },
    light: { x: 0.5, y: TUNING.idleY },
    medPointer: null,
    heroVideoEl: (slides[0] && slides[0].video) || null,
    heroMix: 0,
    ascentMix: 0,
    ascentVideoSlot: -1,
    needsClear: true,
    readyWanted: false,
    heroReady: false,
    held: false,       // the first draw waits for `drawAfter` (the renderer, observers and loads proceed)
    wantHero: true,
    wantAscent: false,
    wantMedallion: false,
    keepMedallion: false,   // the 200 % observer's first report decides (a background tab used to fetch the GLB at boot)
    medallionLoading: false,
    rtWarnedOnce: false,
  };
  const near = { hero: false, ascent: false, medallion: false };
  const rects = {
    hero: { left: 0, top: 0, width: 0, height: 0, visible: false },
    ascent: { left: 0, top: 0, width: 0, height: 0, visible: false },
    medallion: { left: 0, top: 0, width: 0, height: 0, visible: false },
  };
  const transition = { a: state.cur, b: state.cur, p: 1, tween: null, dollyA: 1 };
  const t0 = now();

  const els = {
    hero: document.querySelector('[data-gl="hero"]'),
    ascent: document.querySelector('[data-gl="ascent"]'),
    medallion: document.querySelector('[data-gl="medallion"]'),
  };

  // The depth of the plate's dissolve into the paper (css --hero-fade, a registered <length>, so
  // it computes to px; the fallback reads the lift the CSS applies through the copy's margin).
  const heroSection = els.hero ? (els.hero.closest('.hero') || els.hero) : null;
  function readFade() {
    if (!heroSection) return 110;
    const v = parseFloat(getComputedStyle(heroSection).getPropertyValue('--hero-fade'));
    if (Number.isFinite(v) && v > 0) return v;
    const top = heroSection.querySelector('.hero__top');
    const lift = top ? -parseFloat(getComputedStyle(top).marginBottom) : 0;
    return lift > 0 ? lift + 32 : 110;
  }

  // ------------------------------------------------------------------ textures and memory
  const bytes = new Map();       // Texture -> bytes on the GPU
  const uploadQueue = [];        // one renderer.initTexture per frame
  const bitmaps = new Map();     // slide index -> ImageBitmap | HTMLImageElement
  const failed = new Set();      // slide indices that could not be loaded
  const tex = { hero: null, depth: null, luma: null, disp: null, heroVideo: null, ascentVideo: null, ascent: new Map() };
  let heroLoadedSrc = '';
  let masksOk = false;
  let rt = null;
  let rtSize = { w: 0, h: 0 };
  let medallion = null;
  let medallionGen = 0;
  const limitMb = TUNING.residentMb;

  function makeTexture(source, opts = {}) {
    const t = new THREE.Texture(source);
    t.flipY = false;
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.wrapS = t.wrapT = opts.wrap || THREE.ClampToEdgeWrapping;
    t.colorSpace = THREE.NoColorSpace;
    t.premultiplyAlpha = false;
    t.needsUpdate = true;
    const sz = sourceSize(source);
    bytes.set(t, sz.w * sz.h * 4);
    if (opts.immediate) renderer.initTexture(t); else uploadQueue.push(t);
    return t;
  }

  function dropTexture(t) {
    if (!t) return null;
    const i = uploadQueue.indexOf(t);
    if (i >= 0) uploadQueue.splice(i, 1);
    bytes.delete(t);
    t.dispose();
    return null;
  }

  function residentMb() {
    let b = 0;
    for (const v of bytes.values()) b += v;
    if (rt) {
      // the multisampled colour buffer (samples ×), its resolve copy, and a 24-bit depth buffer per sample
      const bpp = rt.texture.type === THREE.HalfFloatType ? 8 : 4;
      const s = Math.max(1, rt.samples || 1);
      b += rtSize.w * rtSize.h * (bpp * (s + 1) + 3 * s);
    }
    if (medallion) b += medallion.stats().mb * 1048576;
    return b / 1048576;
  }

  /* The crest's share of its slot: a small seal (the Ledger's 220 px slot since the polish pass)
     fills most of its box; a wide slot keeps the spec's 0.46 / 0.70 */
  function fillFor() {
    const r = els.medallion ? els.medallion.getBoundingClientRect() : null;
    if (r && r.width > 0 && r.width < 320) return 0.82;
    return window.innerWidth < 768 ? 0.70 : 0.46;
  }
  /* The medallion target's DPR: the device's, capped (TUNING.dprMedallion), and never more than
     TUNING.medallionMaxPx on the long side */
  function medallionDpr(r, base) {
    const cap = TUNING.medallionMaxPx / Math.max(1, r.width, r.height);
    return Math.min(base, cap) * state.dprScale;
  }

  // ------------------------------------------------------------------ scene: three DOM-synced planes
  const scene2d = new THREE.Scene();
  const cam2d = new THREE.OrthographicCamera(0, 1, 0, -1, -1, 1);
  const unitPlane = new THREE.PlaneGeometry(1, 1);
  const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  blank.needsUpdate = true;

  const heroU = {
    uTex: { value: blank },
    uVideo: { value: blank },
    uDepth: { value: blank },
    uLuma: { value: blank },
    uMix: { value: 0 },
    uMasks: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uLight: { value: new THREE.Vector2(0.5, TUNING.idleY) },
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uImgSize: { value: new THREE.Vector2(16, 9) },
    uPaper: { value: new THREE.Vector3(PAPER[0], PAPER[1], PAPER[2]) },
    uGrain: { value: TUNING.grain },
    uMeltTop: { value: TUNING.meltTop },
    uBreath: { value: reducedMotion ? 0 : 1 },
    uDissolve: { value: 110 },
  };
  const heroMat = new THREE.ShaderMaterial({
    vertexShader: VERT_PLANE, fragmentShader: FRAG_HERO, uniforms: heroU,
    depthTest: false, depthWrite: false, transparent: false, blending: THREE.NoBlending, toneMapped: false,
  });
  const heroMesh = new THREE.Mesh(unitPlane, heroMat);
  heroMesh.frustumCulled = false;
  heroMesh.visible = false;
  heroMesh.renderOrder = 0;

  const ascentU = {
    uTexA: { value: blank },
    uTexB: { value: blank },
    uDisp: { value: blank },
    uVideo: { value: blank },
    uProgress: { value: 1 },
    uIntensity: { value: TUNING.dispIntensity },
    uChroma: { value: TUNING.chroma },
    uVideoMix: { value: 0 },
    uVideoSlot: { value: -1 },
    uDollyA: { value: 1 },
    uDollyB: { value: 1 },
    uPlaneSize: { value: new THREE.Vector2(16, 10) },
    uImgSizeA: { value: new THREE.Vector2(16, 10) },
    uImgSizeB: { value: new THREE.Vector2(16, 10) },
    uVideoSize: { value: new THREE.Vector2(16, 10) },
  };
  const ascentMat = new THREE.ShaderMaterial({
    vertexShader: VERT_PLANE, fragmentShader: FRAG_ASCENT, uniforms: ascentU,
    depthTest: false, depthWrite: false, transparent: false, blending: THREE.NoBlending, toneMapped: false,
  });
  const ascentMesh = new THREE.Mesh(unitPlane, ascentMat);
  ascentMesh.frustumCulled = false;
  ascentMesh.visible = false;
  ascentMesh.renderOrder = 1;

  const compU = { uTex: { value: blank } };
  const compMat = new THREE.ShaderMaterial({
    vertexShader: VERT_PLANE, fragmentShader: FRAG_COMPOSITE, uniforms: compU,
    depthTest: false, depthWrite: false, transparent: true, toneMapped: true,
    blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  });
  const medMesh = new THREE.Mesh(unitPlane, compMat);
  medMesh.frustumCulled = false;
  medMesh.visible = false;
  medMesh.renderOrder = 2;
  scene2d.add(heroMesh, ascentMesh, medMesh);

  const halfFloatOk = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
  const maxSamples = renderer.capabilities.maxSamples || 0;

  // ------------------------------------------------------------------ sizing and DPR
  function applyDpr() {
    const base = Math.min(window.devicePixelRatio || 1, lowEnd ? TUNING.dprCapLowEnd : TUNING.dprCap);
    state.dpr = base;
    renderer.setPixelRatio(base * state.dprScale);
    renderer.setSize(state.w, state.h, false);
  }

  function resize() {
    if (state.disposed) return;
    const w = canvas.clientWidth || window.innerWidth || 1;
    const h = canvas.clientHeight || window.innerHeight || 1;
    state.w = w;
    state.h = h;
    cam2d.left = 0; cam2d.right = w; cam2d.top = 0; cam2d.bottom = -h;
    cam2d.updateProjectionMatrix();
    applyDpr();
    const wasActive = state.ascentActive;
    state.ascentActive = window.innerWidth >= 1024 && slides.length > 1;
    if (state.ascentActive !== wasActive) {
      syncAscentResidency();
      if (state.ascentActive && state.wantAscent) ensureAscentBitmaps();
    }
    if (medallion) medallion.setFill(fillFor());
    heroU.uDissolve.value = readFade();
    // the <picture> may have switched source (desktop <-> phone crop): rebuild the hero texture
    const img = slides[0].img;
    if (img instanceof HTMLImageElement && state.heroReady && img.complete && img.naturalWidth > 0 && img.currentSrc && img.currentSrc !== heroLoadedSrc) {
      rebuildHeroFromImg(img).catch(() => {});
    }
    state.needsClear = true;
  }

  let resizeTimer = 0;
  const onWindowResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  };
  window.addEventListener('resize', onWindowResize, { passive: true });

  // ------------------------------------------------------------------ context loss
  const onLost = () => {
    state.lost = true;
    canvas.classList.add('is-lost');
    emit('lost');
  };
  const onRestored = () => {
    state.lost = false;
    canvas.classList.remove('is-lost');
    if (rt) { rt.dispose(); rt = null; rtSize = { w: 0, h: 0 }; }
    const rig = medallion || medallionRig;
    if (rig) { try { rig.rebuildEnvironment(); } catch {} }
    for (const t of bytes.keys()) t.needsUpdate = true;
    state.needsClear = true;
    emit('restored');
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  // ------------------------------------------------------------------ observers (residency and render gating)
  const observers = [];
  function observe(el, rootMargin, cb) {
    if (!el || typeof IntersectionObserver !== 'function') return;
    const io = new IntersectionObserver((entries) => { for (const e of entries) cb(e.isIntersecting); }, { rootMargin, threshold: 0 });
    io.observe(el);
    observers.push(io);
  }
  observe(els.hero, '25% 0px', (v) => { near.hero = v; });
  observe(els.ascent, '25% 0px', (v) => { near.ascent = v; });
  observe(els.medallion, '25% 0px', (v) => { near.medallion = v; });
  observe(els.hero, '100% 0px', (v) => { state.wantHero = v; syncHeroResidency(); });
  observe(els.ascent, '100% 0px', (v) => { state.wantAscent = v; if (v) ensureAscentBitmaps(); syncAscentResidency(); });
  observe(els.medallion, '100% 0px', (v) => { state.wantMedallion = v; if (v) ensureMedallion(); });
  // two viewports out: the rig is built and warmed (uploads one per frame) on the way in, and
  // released on the way out
  observe(els.medallion, '200% 0px', (v) => { state.keepMedallion = v; if (v) ensureMedallion(); else releaseMedallion(); });

  // ------------------------------------------------------------------ loading: hero, masks, displacement
  const progress = { hero: 0, depth: 0, luma: 0, disp: 0, last: 0 };
  function reportProgress(key, p) {
    progress[key] = Math.max(progress[key], clamp(p, 0, 1));
    const total = progress.hero * 0.6 + progress.depth * 0.15 + progress.luma * 0.15 + progress.disp * 0.1;
    if (onProgress && total > progress.last) {
      progress.last = total;
      try { onProgress(total); } catch {}
    }
  }

  const inflight = new Map();    // slide index -> pending fetch, so warm() and the residency never fetch twice
  function slideBitmap(i, onP) {
    if (bitmaps.has(i)) return Promise.resolve(bitmaps.get(i));
    if (inflight.has(i)) return inflight.get(i);
    const p = (async () => {
      const s = slides[i];
      let source = null;
      // every slide comes from its DOM <img> (the <picture>'s own AVIF, one download shared with
      // the page; a lazy image is switched to eager so the fetch starts now); the separate WebP
      // in s.src is the fallback only (polish pass: the Ascent slides were fetched twice before)
      if (s.img instanceof HTMLImageElement) {
        try {
          if (s.img.loading === 'lazy') s.img.loading = 'eager';
          const img = await waitForImage(s.img, 8000);
          if (i === 0) heroLoadedSrc = img.currentSrc || img.src;
          try { source = await createImageBitmap(img, { premultiplyAlpha: 'none', colorSpaceConversion: 'default' }); }
          catch { source = img; }
          if (onP) onP(1);
        } catch { source = null; }
      }
      if (!source && s.src) {
        source = await fetchBitmap(s.src, onP);
      }
      if (!source && s.img instanceof HTMLImageElement) {
        const img = await waitForImage(s.img, 8000);
        source = img;
        if (onP) onP(1);
      }
      if (!source) throw new Error('slide ' + i + ' has no source');
      if (state.disposed) { if (source.close) source.close(); throw new Error('disposed'); }
      bitmaps.set(i, source);
      return source;
    })();
    inflight.set(i, p);
    p.finally(() => inflight.delete(i)).catch(() => {});
    return p;
  }

  /** Idle warm-up (main.js, after ready): fetch and decode the given slides ahead of the scroll
   *  and keep them resident until the Ascent's own residency window takes over, so the first
   *  chapter change never waits on a fetch or a first upload. Memory: two 1440-px slides, 10 MB. */
  const warmed = new Set();
  async function warm(indices) {
    if (state.disposed || !state.ascentActive) return;
    for (const i of indices) {
      if (i < 1 || i >= slides.length || failed.has(i)) continue;
      try { await slideBitmap(i); } catch (e) { failed.add(i); continue; }
      if (state.disposed) return;
      warmed.add(i);
      syncAscentResidency();
    }
  }

  async function rebuildHeroFromImg(img) {
    const old = bitmaps.get(0);
    heroLoadedSrc = img.currentSrc || img.src;
    let source;
    try { source = await createImageBitmap(img, { premultiplyAlpha: 'none', colorSpaceConversion: 'default' }); }
    catch { source = img; }
    if (state.disposed) { if (source.close) source.close(); return; }
    bitmaps.set(0, source);
    if (old && old.close && old !== source) { try { old.close(); } catch {} }
    if (tex.hero) {
      tex.hero = dropTexture(tex.hero);
      syncHeroResidency();
    }
  }

  async function loadMask(key, url) {
    try {
      const bmp = await fetchBitmap(url, (p) => reportProgress(key, p));
      if (state.disposed) { bmp.close(); return null; }
      return makeTexture(bmp);
    } catch (e) {
      if (debugLog) debugLog('mask missing, shader runs without it:', url, e && e.message);
      reportProgress(key, 1);
      return null;
    }
  }

  function noiseDisplacement() {
    const n = 256;
    const c = document.createElement('canvas');
    c.width = c.height = n;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(n, n);
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const v = 0.5 + 0.2 * Math.sin(y * 0.35 + Math.sin(x * 0.11) * 2.0) * Math.cos(x * 0.07 + y * 0.03);
      const i = (y * n + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.round(v * 255);
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  async function loadDisplacement() {
    let source = null;
    try {
      source = await fetchBitmap(paths.displacement, (p) => reportProgress('disp', p));
    } catch (e) {
      if (debugLog) debugLog('displacement map missing, using generated noise:', e && e.message);
      source = noiseDisplacement();
      reportProgress('disp', 1);
    }
    if (state.disposed) return;
    tex.disp = makeTexture(source, { wrap: THREE.MirroredRepeatWrapping });
    ascentU.uDisp.value = tex.disp;
  }

  function syncHeroResidency() {
    if (state.disposed) return;
    const bmp = bitmaps.get(0);
    if (state.wantHero && bmp && !tex.hero) {
      tex.hero = makeTexture(bmp, { immediate: !state.heroReady && !state.held });   // held: uploaded by the first frame after the gate
      const sz = sourceSize(bmp);
      heroU.uTex.value = tex.hero;
      heroU.uImgSize.value.set(sz.w, sz.h);
    } else if (!state.wantHero && tex.hero) {
      tex.hero = dropTexture(tex.hero);
      heroU.uTex.value = blank;
    }
  }

  let ascentFetching = false;
  let pendingGoTo = null;
  async function ensureAscentBitmaps() {
    if (ascentFetching || state.disposed || !state.ascentActive) return;
    ascentFetching = true;
    try {
      for (;;) {
        if (state.disposed) return;
        // the chapter a goTo is waiting for comes first, then the rest in page order
        let i = pendingGoTo != null && !bitmaps.has(pendingGoTo) && !failed.has(pendingGoTo) ? pendingGoTo : -1;
        if (i < 0) for (let k = 1; k < slides.length; k++) if (!bitmaps.has(k) && !failed.has(k)) { i = k; break; }
        if (i < 0) break;
        try { await slideBitmap(i); }
        catch (e) { failed.add(i); if (debugLog) debugLog('slide failed', i, e && e.message); }
        syncAscentResidency();
        if (pendingGoTo === i) { pendingGoTo = null; goTo(i); }
      }
    } finally {
      ascentFetching = false;
    }
  }

  function ensureSlideTexture(i) {
    if (tex.ascent.has(i)) return tex.ascent.get(i);
    const bmp = bitmaps.get(i);
    if (!bmp) return null;
    const t = makeTexture(bmp);
    tex.ascent.set(i, t);
    return t;
  }

  function syncAscentResidency() {
    if (state.disposed) return;
    const want = new Set();
    if (state.wantAscent) warmed.clear();   // the scene is near: its own window rules from here on
    if (state.wantAscent && state.ascentActive) {
      // slides i-1, i, i+1 around the current chapter (slide 0, the hero, only when QA asked for it)
      for (const i of [state.cur - 1, state.cur, state.cur + 1]) {
        if (i >= 1 && i < slides.length) want.add(i);
      }
      for (const i of [transition.a, transition.b]) {
        if (i >= 0 && i < slides.length) want.add(i);
      }
    } else if (state.ascentActive) {
      for (const i of warmed) want.add(i);   // the idle warm-up, uploaded one per frame
    }
    for (const [i, t] of tex.ascent) {
      if (!want.has(i)) { dropTexture(t); tex.ascent.delete(i); }
    }
    for (const i of want) ensureSlideTexture(i);
    if (debugLog && residentMb() > limitMb) debugLog('resident MB over budget', residentMb().toFixed(1));
  }

  // ------------------------------------------------------------------ medallion
  // The crest is prepared in steps at idle after boot, each in a scroll-quiet moment, so that the
  // Ledger's arrival (the night transition) costs no long task and no shader compile. On a cold
  // shader cache (every first visit) the rig's compiles are the expensive part: the PMREM room
  // environment is three programs and the crest's PBR material a fourth, hundreds of ms on ANGLE.
  //   1. the GLB: loader modules, fetch, Draco decode in the loader's worker, texture decode (CPU)
  //   2. the rig: scene, lights, PMREM environment (createMedallion; the GPU holds ~3 MB from here)
  //   3. the program: renderer.compileAsync (KHR_parallel_shader_compile links off the main thread),
  //      then one 4 × 4 draw with 1 × 1 stand-in maps, which makes ANGLE build the executable
  //      (warmDraw; the real textures stay on the CPU)
  //   4. within two viewports of the Ledger (keepMedallion): each texture uploaded on its own
  //      frame, then one 4 × 4 draw for the geometry buffers; only then does the rig become
  //      `medallion` (drawn, counted in the budget, announced to ledger.js).
  // Two viewports out again the GPU copies are freed (unload) and the rig kept, so a return costs
  // the uploads only. Nothing here touches the DOM or adds a listener: the scroll-quiet test
  // reads scrollY in tick().
  let medallionPrefetch = null;    // Promise<{gltf, loadMs} | null>
  let medallionRig = null;         // the prepared Medallion (steps 1–3 done), uploaded or not
  let medallionRigPromise = null;  // steps 1–3 in flight
  const medallionWarm = { prefetched: false, loadMs: 0, rigMs: 0, compileMs: 0, drawMs: 0, uploadMs: 0, steps: 0, phases: [], parallelCompile: null, readyAt: 0 };
  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
  const idle = (timeout) => new Promise((r) => ('requestIdleCallback' in window ? requestIdleCallback(() => r(), { timeout }) : setTimeout(r, 300)));
  const scrollQuiet = { lastY: -1, lastAt: 0 };
  // ensureMedallion (the Ledger near) rushes a lazy chain past its idle and quiet waits
  let rigRushed = false;
  let rushRig = () => {};
  const rushed = new Promise((r) => { rushRig = () => { rigRushed = true; r(); }; });
  // a scroll-quiet moment: no scroll for 350 ms, or 3 s of waiting, whichever comes first
  async function whenQuiet(maxMs = 3000) {
    const t0 = now();
    while (!rigRushed && now() - scrollQuiet.lastAt < 350 && now() - t0 < maxMs) await new Promise((r) => setTimeout(r, 120));
  }
  const phase = (name, t0) => { const ms = Math.round(now() - t0); medallionWarm.phases.push({ name, ms, at: Math.round(now()) }); if (debugLog) debugLog('medallion', name, ms + ' ms'); return ms; };

  function prefetchMedallion() {
    if (medallionPrefetch || !medallionUrl || state.disposed) return medallionPrefetch;
    const t0 = now();
    medallionPrefetch = loadMedallionGltf(THREE, { url: medallionUrl, dracoPath: paths.draco })
      .then((loaded) => {
        if (state.disposed) { disposeGltf(loaded.gltf); return null; }
        medallionWarm.loadMs = loaded.loadMs;
        phase('glb', t0);
        return loaded;
      })
      .catch((e) => {
        if (debugLog) debugLog('medallion prefetch failed', e && e.message);
        phase('glb-failed', t0);
        return null;   // the rig falls back to a direct load, then to the procedural crest
      });
    return medallionPrefetch;
  }

  /** Steps 1–3. `lazy` waits for idle, scroll-quiet moments between the steps (after boot);
   *  ensureMedallion calls it without, when the Ledger is already near. */
  function prepareRig(lazy) {
    if (medallionRig) return Promise.resolve(medallionRig);
    if (medallionRigPromise) return medallionRigPromise;
    medallionRigPromise = (async () => {
      let loaded = null;
      if (medallionUrl) {
        loaded = await prefetchMedallion();
        if (state.disposed) return null;
        medallionWarm.prefetched = !!loaded;
        medallionPrefetch = null;   // consumed (or failed): the rig owns the model from here
      }
      if (lazy) { await Promise.race([idle(4000), rushed]); await whenQuiet(); }
      if (state.disposed || state.lost) { if (loaded) disposeGltf(loaded.gltf); return null; }
      let t0 = now();
      const m = await createMedallion(THREE, renderer, {
        url: loaded ? null : medallionUrl,
        gltf: loaded,
        dracoPath: paths.draco,
        fill: fillFor(),
        roughnessBias: options.medallionRoughnessBias || 0,
        logoUrl: paths.logo,
        normalMapUrl: paths.normal,
        roughnessMapUrl: paths.roughness,
        maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
        log: debugLog,
      });
      medallionWarm.rigMs = phase('rig', t0);
      if (state.disposed) { m.dispose(); return null; }
      if (lazy) { await Promise.race([idle(4000), rushed]); await whenQuiet(); }
      if (state.disposed || state.lost) { m.dispose(); return null; }
      t0 = now();
      medallionWarm.parallelCompile = renderer.extensions.has('KHR_parallel_shader_compile');
      try { await renderer.compileAsync(m.scene, m.camera); }
      catch { try { renderer.compile(m.scene, m.camera); } catch {} }
      medallionWarm.compileMs = phase('compile', t0);
      if (state.disposed) { m.dispose(); return null; }
      if (lazy) { await Promise.race([idle(4000), rushed]); await whenQuiet(); }
      if (state.disposed || state.lost) { m.dispose(); return null; }
      t0 = now();
      warmDraw(m);
      medallionWarm.drawMs = phase('first-draw', t0);
      medallionRig = m;
      medallionWarm.readyAt = Math.round(now());
      return m;
    })().catch((e) => {
      if (debugLog) debugLog('medallion rig failed', e && e.message);
      medallionWarm.phases.push({ name: 'rig-failed', error: e && e.message, at: Math.round(now()) });
      return null;
    }).finally(() => { medallionRigPromise = null; });
    return medallionRigPromise;
  }

  /** Step 3b, at idle: one 4 × 4 draw of the real geometry with 1 × 1 stand-ins for the maps.
   *  compileAsync links the program, but ANGLE on D3D11 builds the executable for a program's
   *  input layout on its first draw (100–200 ms on a cold cache), which is the long task the
   *  Ledger used to pay. The stand-ins keep the program key identical (same map slots, uv
   *  channels and colour spaces) while the real 1024² textures stay off the GPU; the geometry
   *  buffers are freed again afterwards and come back in step 4. */
  const MAP_KEYS = ['map', 'normalMap', 'metalnessMap', 'roughnessMap', 'aoMap', 'emissiveMap'];
  function warmDraw(m) {
    const swaps = [];
    const standIns = new Map();
    const standIn = (t) => {
      if (standIns.has(t)) return standIns.get(t);
      const s = new THREE.DataTexture(new Uint8Array([128, 128, 255, 255]), 1, 1);
      s.colorSpace = t.colorSpace; s.channel = t.channel; s.flipY = t.flipY; s.mapping = t.mapping;
      s.wrapS = t.wrapS; s.wrapT = t.wrapT; s.needsUpdate = true;
      standIns.set(t, s);
      return s;
    };
    const geometries = new Set();
    m.scene.traverse((node) => {
      if (!node.isMesh) return;
      geometries.add(node.geometry);
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      for (const mat of mats) {
        const saved = {};
        for (const k of MAP_KEYS) if (mat[k]) { saved[k] = mat[k]; mat[k] = standIn(mat[k]); }
        swaps.push([mat, saved]);
      }
    });
    try {
      const scratch = new THREE.WebGLRenderTarget(4, 4, { depthBuffer: true, stencilBuffer: false });
      renderer.setRenderTarget(scratch);
      renderer.clear();
      renderer.render(m.scene, m.camera);
      // the composite plane's program (tone mapping + sRGB) gets its first draw here as well,
      // instead of on the Ledger's first visible frame
      const wasVisible = { hero: heroMesh.visible, ascent: ascentMesh.visible, med: medMesh.visible };
      heroMesh.visible = ascentMesh.visible = false;
      medMesh.visible = true;
      medMesh.position.set(2, -2, 0); medMesh.scale.set(4, 4, 1);
      renderer.clear();
      renderer.render(scene2d, cam2d);
      heroMesh.visible = wasVisible.hero; ascentMesh.visible = wasVisible.ascent; medMesh.visible = wasVisible.med;
      renderer.setRenderTarget(null);
      scratch.dispose();
      state.needsClear = true;
    } catch {}
    for (const [mat, saved] of swaps) for (const k in saved) mat[k] = saved[k];
    for (const s of standIns.values()) s.dispose();
    for (const g of geometries) g.dispose();   // the arrays stay; step 4 re-uploads them
  }

  /** Step 4: the GPU uploads, spread over frames. */
  async function uploadMedallion(m, gen) {
    const alive = () => !state.disposed && !state.lost && gen === medallionGen;
    const t0 = now();
    let steps = 0;
    for (const t of m.textures()) {
      await nextFrame();
      if (!alive()) return false;
      try { renderer.initTexture(t); steps++; } catch {}
    }
    await nextFrame();
    if (!alive()) return false;
    // one tiny draw uploads the geometry buffers and binds the program once
    try {
      const scratch = new THREE.WebGLRenderTarget(4, 4, { depthBuffer: true, stencilBuffer: false });
      renderer.setRenderTarget(scratch);
      renderer.clear();
      renderer.render(m.scene, m.camera);
      renderer.setRenderTarget(null);
      scratch.dispose();
      state.needsClear = true;
      steps++;
    } catch {}
    await nextFrame();
    if (!alive()) return false;
    // the multisampled target at the slot's current size, so the first visible frame allocates nothing
    try {
      const r = els.medallion ? els.medallion.getBoundingClientRect() : null;
      if (r && r.width > 0 && r.height > 0) {
        const medDpr = medallionDpr(r, Math.min(window.devicePixelRatio || 1, TUNING.dprMedallion));
        ensureRenderTarget(Math.max(2, Math.round(r.width * medDpr)), Math.max(2, Math.round(r.height * medDpr)));
        renderer.setRenderTarget(rt);
        renderer.clear();
        renderer.setRenderTarget(null);
        steps++;
      }
    } catch {}
    medallionWarm.uploadMs = phase('upload', t0);
    medallionWarm.steps = steps;
    return alive();
  }

  async function ensureMedallion() {
    if (medallion || state.medallionLoading || state.disposed || state.lost) return;
    state.medallionLoading = true;
    const gen = ++medallionGen;
    try {
      // the Ascent's idle warm-up slides are not needed from here on
      if (warmed.size) { warmed.clear(); syncAscentResidency(); }
      rushRig();
      const m = await prepareRig(false);
      if (!m) { emit('medallion', { kind: 'none', error: 'no rig' }); return; }
      if (state.disposed || gen !== medallionGen || !state.keepMedallion) return;   // released meanwhile; the rig stays
      const ok = await uploadMedallion(m, gen);
      if (!ok || !state.keepMedallion) { m.unload(); return; }
      medallion = m;
      emit('medallion', { kind: m.kind, ...m.stats(), prefetched: medallionWarm.prefetched, warmMs: medallionWarm.rigMs + medallionWarm.compileMs + medallionWarm.drawMs + medallionWarm.uploadMs, uploadMs: medallionWarm.uploadMs });
    } catch (e) {
      if (debugLog) debugLog('medallion failed', e && e.message);
      emit('medallion', { kind: 'none', error: e && e.message });
    } finally {
      state.medallionLoading = false;
    }
  }

  /** Two viewports out: the GPU copies go, the rig stays for the way back. */
  function releaseMedallion() {
    medallionGen++;
    const had = !!medallion;
    if (medallion) { medallion.unload(); medallion = null; }
    if (rt) { rt.dispose(); rt = null; rtSize = { w: 0, h: 0 }; }
    compU.uTex.value = blank;
    medMesh.visible = false;
    if (had && !state.disposed) emit('medallion', { kind: 'none', released: true });   // ledger.js shows the WebP again
  }

  function disposeMedallionAll() {
    releaseMedallion();
    if (medallionRig) { medallionRig.dispose(); medallionRig = null; }
    if (medallionPrefetch) { const p = medallionPrefetch; medallionPrefetch = null; p.then((loaded) => { if (loaded) disposeGltf(loaded.gltf); }).catch(() => {}); }
  }

  function ensureRenderTarget(w, h) {
    if (rt && rtSize.w === w && rtSize.h === h) return rt;
    if (rt) rt.dispose();
    const samples = Math.min(finePointer ? 4 : 2, maxSamples);
    const type = halfFloatOk ? THREE.HalfFloatType : THREE.UnsignedByteType;
    rt = new THREE.WebGLRenderTarget(w, h, {
      samples, type,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      generateMipmaps: false, depthBuffer: true, stencilBuffer: false,
    });
    rt.texture.colorSpace = THREE.NoColorSpace;
    rtSize = { w, h };
    compU.uTex.value = rt.texture;
    return rt;
  }

  // Pointer over the Ledger drives the medallion's tilt (an element listener, not a window one).
  const medHost = els.medallion ? (els.medallion.closest('section') || els.medallion.parentElement) : null;
  const onMedMove = (e) => {
    if (!finePointer || !medHost) return;
    const r = medHost.getBoundingClientRect();
    if (!r.width || !r.height) return;
    state.medPointer = {
      x: clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1),
      y: clamp(-(((e.clientY - r.top) / r.height) * 2 - 1), -1, 1),
    };
  };
  const onMedLeave = () => { state.medPointer = null; };
  if (medHost) {
    medHost.addEventListener('pointermove', onMedMove, { passive: true });
    medHost.addEventListener('pointerleave', onMedLeave, { passive: true });
  }

  // ------------------------------------------------------------------ video textures
  function videoPlaying(v) {
    return v instanceof HTMLVideoElement && v.readyState >= 2 && !v.paused && !v.ended && v.videoWidth > 0;
  }

  function videoTexture(v) {
    const t = new THREE.VideoTexture(v);
    t.flipY = false;
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.colorSpace = THREE.NoColorSpace;
    bytes.set(t, v.videoWidth * v.videoHeight * 4);
    return t;
  }

  function updateHeroVideo(dt) {
    const v = state.heroVideoEl;
    const step = dt / TUNING.videoMixMs;
    if (!reducedMotion && v && videoPlaying(v) && heroMesh.visible) {
      if (!tex.heroVideo || tex.heroVideo.image !== v) {
        if (tex.heroVideo) tex.heroVideo = dropTexture(tex.heroVideo);
        tex.heroVideo = videoTexture(v);
        heroU.uVideo.value = tex.heroVideo;
      }
      state.heroMix = Math.min(1, state.heroMix + step);
    } else if (v && v.paused && !v.ended && tex.heroVideo && state.heroMix > 0 && heroMesh.visible && v.readyState >= 2) {
      // paused by the visitor: hold the frame, like the DOM video would
    } else {
      state.heroMix = Math.max(0, state.heroMix - step);
      if (state.heroMix === 0 && tex.heroVideo) {
        tex.heroVideo = dropTexture(tex.heroVideo);
        heroU.uVideo.value = blank;
      }
    }
    heroU.uMix.value = state.heroMix;
  }

  function updateAscentVideo(dt) {
    const step = dt / TUNING.videoMixMs;
    let slot = -1;
    let v = null;
    const vb = slides[transition.b] && slides[transition.b].video;
    const va = slides[transition.a] && slides[transition.a].video;
    if (!reducedMotion && ascentMesh.visible) {
      if (videoPlaying(vb)) { slot = 1; v = vb; }
      else if (transition.p < 1 && videoPlaying(va)) { slot = 0; v = va; }
      else if (tex.ascentVideo && state.ascentMix > 0) {
        const held = tex.ascentVideo.image;
        if (held && held.paused && !held.ended && (held === vb || held === va)) { slot = held === vb ? 1 : 0; v = held; }
      }
    }
    if (v) {
      if (!tex.ascentVideo || tex.ascentVideo.image !== v) {
        if (tex.ascentVideo) tex.ascentVideo = dropTexture(tex.ascentVideo);
        tex.ascentVideo = videoTexture(v);
        ascentU.uVideo.value = tex.ascentVideo;
        ascentU.uVideoSize.value.set(v.videoWidth, v.videoHeight);
      }
      state.ascentVideoSlot = slot;
      if (!(v.paused && state.ascentMix > 0)) state.ascentMix = Math.min(1, state.ascentMix + step);
    } else {
      state.ascentMix = Math.max(0, state.ascentMix - step);
      if (state.ascentMix === 0 && tex.ascentVideo) {
        tex.ascentVideo = dropTexture(tex.ascentVideo);
        ascentU.uVideo.value = blank;
        state.ascentVideoSlot = -1;
      }
    }
    ascentU.uVideoMix.value = state.ascentMix;
    ascentU.uVideoSlot.value = state.ascentVideoSlot;
  }

  // ------------------------------------------------------------------ pointer, light, idle sun
  function updatePointerAndLight(dt, t) {
    const p = state.pointer;
    if (p.active && t - p.at > TUNING.idleAfterMs) p.active = false;
    const kP = 1 - Math.pow(1 - TUNING.pointerLerp, dt / 16.7);
    const kL = 1 - Math.pow(1 - TUNING.lightLerp, dt / 16.7);
    const ptx = p.active ? p.tx : 0;
    const pty = p.active ? p.ty : 0;
    p.x += (ptx - p.x) * kP;
    p.y += (pty - p.y) * kP;
    let lx, ly;
    if (p.active) {
      lx = (p.tx + 1) / 2;
      ly = (p.ty + 1) / 2;
    } else if (reducedMotion) {
      lx = 0.5;
      ly = TUNING.idleY;
    } else {
      // the idle sun: a shallow arc left -> right -> left over 14 s
      const u = 0.5 - 0.5 * Math.cos(((t - t0) / 1000 / TUNING.idlePeriodS) * Math.PI * 2);
      lx = 0.18 + 0.64 * u;
      ly = TUNING.idleY + 0.05 * Math.sin(u * Math.PI);
    }
    state.light.x += (lx - state.light.x) * kL;
    state.light.y += (ly - state.light.y) * kL;
    heroU.uPointer.value.set(p.x, p.y);
    heroU.uLight.value.set(state.light.x, state.light.y);
  }

  // ------------------------------------------------------------------ rects
  function readRect(key, el) {
    const r = rects[key];
    if (!el || !near[key]) { r.visible = false; return false; }
    const b = el.getBoundingClientRect();
    r.left = b.left; r.top = b.top; r.width = b.width; r.height = b.height;
    r.visible = b.width > 0 && b.height > 0 && b.bottom > 0 && b.top < state.h && b.right > 0 && b.left < state.w;
    return r.visible;
  }

  function place(mesh, r) {
    mesh.position.set(r.left + r.width / 2, -(r.top + r.height / 2), 0);
    mesh.scale.set(r.width, r.height, 1);
  }

  // ------------------------------------------------------------------ frame timing and adaptive quality
  const timing = { prev: 0, frames: 0, sum: 0, n: 0, ema: 16.7, fps: 60, cpu: 0, phase: 0, lastDt: 0 };
  function recordFrame(dt) {
    timing.lastDt = dt;
    timing.ema += (dt - timing.ema) * 0.1;
    timing.fps = 1000 / Math.max(timing.ema, 1e-3);
    if (state.degraded || timing.phase > 2) return;
    timing.frames++;
    if (timing.frames <= TUNING.warmupFrames) return;
    if (dt > TUNING.hitchMs) return;          // a hitch (tab switch, a long task) is not GPU cost
    timing.sum += dt;
    timing.n++;
    if (timing.n < TUNING.sampleFrames) return;
    const avg = timing.sum / timing.n;
    timing.sum = 0; timing.n = 0;
    if (avg <= TUNING.slowMs) { timing.phase = 3; return; }   // fast enough; stop measuring
    if (timing.phase === 0) {
      timing.phase = 1;
      state.dprScale = 0.5;
      applyDpr();
      if (debugLog) debugLog('slow frames (' + avg.toFixed(1) + ' ms): DPR halved');
    } else {
      timing.phase = 2;
      state.degraded = true;
      emit('degraded', { frameMs: +avg.toFixed(1), dpr: state.dpr * state.dprScale });
      if (debugLog) debugLog('still slow (' + avg.toFixed(1) + ' ms): degraded');
    }
  }

  // ------------------------------------------------------------------ the frame
  let readyResolve, readyReject;
  const ready = new Promise((res, rej) => { readyResolve = res; readyReject = rej; });
  ready.catch(() => {});   // the caller awaits it; keep an unobserved rejection quiet here

  function tick() {
    if (state.disposed || !state.running || state.lost || document.hidden || state.held) { timing.prev = 0; return; }
    const t = now();
    const y = window.scrollY;
    if (y !== scrollQuiet.lastY) { scrollQuiet.lastY = y; scrollQuiet.lastAt = t; }
    const up = uploadQueue.shift();
    if (up) renderer.initTexture(up);

    const heroVis = readRect('hero', els.hero) && !!tex.hero;
    const ascentVis = readRect('ascent', els.ascent) && state.ascentActive;
    const medVis = readRect('medallion', els.medallion) && !!medallion;
    const any = heroVis || ascentVis || medVis;

    if (!any) {
      if (state.needsClear) {
        renderer.setRenderTarget(null);
        renderer.setScissorTest(false);
        renderer.clear();
        state.needsClear = false;
      }
      heroMesh.visible = ascentMesh.visible = medMesh.visible = false;
      updateHeroVideo(16.7);      // mixes decay while nothing is drawn, so video textures are released
      updateAscentVideo(16.7);
      timing.prev = 0;
      if (state.readyWanted) finishReady();
      return;
    }

    const dt = timing.prev ? clamp(t - timing.prev, 1, 250) : 16.7;
    timing.prev = t;
    const cpu0 = now();
    const time = ((t - t0) / 1000) % 3600;
    updatePointerAndLight(dt, t);

    // hero plane
    heroMesh.visible = heroVis;
    if (heroVis) {
      const r = rects.hero;
      place(heroMesh, r);
      heroU.uRes.value.set(r.width, r.height);
      heroU.uTime.value = time;
      heroU.uScroll.value = state.scroll;
    }
    updateHeroVideo(dt);

    // ascent plane
    const texB = ascentVis ? tex.ascent.get(transition.b) : null;
    const texA = ascentVis ? (tex.ascent.get(transition.a) || texB) : null;
    ascentMesh.visible = !!(ascentVis && texB);
    if (ascentMesh.visible) {
      const r = rects.ascent;
      place(ascentMesh, r);
      ascentU.uPlaneSize.value.set(r.width, r.height);
      ascentU.uTexA.value = texA;
      ascentU.uTexB.value = texB;
      const sa = sourceSize(texA.image), sb = sourceSize(texB.image);
      ascentU.uImgSizeA.value.set(sa.w, sa.h);
      ascentU.uImgSizeB.value.set(sb.w, sb.h);
      ascentU.uProgress.value = transition.p;
      const local = transition.b >= 1 ? clamp(state.ascentP * (slides.length - 1) - (transition.b - 1), 0, 1) : 0;
      ascentU.uDollyB.value = 1 + TUNING.dolly * local;
      ascentU.uDollyA.value = transition.dollyA;
    }
    updateAscentVideo(dt);

    // medallion: a small multisampled pass, then composited as the third plane
    medMesh.visible = medVis;
    if (medVis) {
      const r = rects.medallion;
      const medDpr = medallionDpr(r, heroVis ? state.dpr : Math.min(window.devicePixelRatio || 1, TUNING.dprMedallion));
      const w = Math.max(2, Math.round(r.width * medDpr));
      const h = Math.max(2, Math.round(r.height * medDpr));
      const target = ensureRenderTarget(w, h);
      medallion.setAspect(r.width / r.height);
      medallion.update({ time, dt, ledgerP: state.ledgerP, pointer: state.medPointer, rectHeight: r.height, reducedMotion });
      renderer.setRenderTarget(target);
      renderer.clear();
      renderer.render(medallion.scene, medallion.camera);
      renderer.setRenderTarget(null);
      place(medMesh, r);
    }

    renderer.setScissorTest(false);
    renderer.clear();
    renderer.render(scene2d, cam2d);
    state.needsClear = true;
    timing.cpu += (now() - cpu0 - timing.cpu) * 0.1;
    recordFrame(dt);
    if (state.readyWanted) finishReady();
  }

  function finishReady() {
    state.readyWanted = false;
    state.heroReady = true;
    readyResolve();
    emit('ready', { dpr: state.dpr, w: state.w, h: state.h, masks: masksOk, lowEnd });
  }

  // ------------------------------------------------------------------ boot
  // The first draw (the hero program's compile and the texture uploads: 50–100 ms on a cold shader
  // cache) waits for the caller's `drawAfter` when one is given. main.js passes the preloader's
  // exit, whose first frames ease in so slowly that the task costs the viewer nothing, and creates
  // the renderer itself on the static overlay; the plane is then live before the sheet lifts off
  // the hero. The renderer, its observers and the loads proceed meanwhile; `ready` resolves on the
  // first frame drawn after the gate. The gate never holds longer than six seconds.
  if (drawAfter && typeof drawAfter.then === 'function') {
    state.held = true;
    const release = () => { if (state.held) { state.held = false; state.needsClear = true; } };
    drawAfter.then(release, release);
    setTimeout(release, 6000);
  }
  resize();
  gsap.ticker.add(tick);

  (async () => {
    try {
      const masks = Promise.all([loadMask('depth', paths.depth), loadMask('luma', paths.luma)]).then(([d, l]) => {
        if (state.disposed) return;
        tex.depth = d; tex.luma = l;
        masksOk = !!(d && l);
        heroU.uDepth.value = d || blank;
        heroU.uLuma.value = l || blank;
        heroU.uMasks.value = masksOk ? 1 : 0;
      });
      loadDisplacement().catch(() => {});
      await slideBitmap(0, (p) => reportProgress('hero', p));
      reportProgress('hero', 1);
      syncHeroResidency();
      await Promise.race([masks, new Promise((r) => setTimeout(r, TUNING.masksTimeoutMs))]);
      if (state.disposed) return;
      state.readyWanted = true;       // the next tick draws the first frame and resolves `ready`
      if (state.wantAscent) ensureAscentBitmaps();
      // the medallion only when its observers have reported it within two viewports (keepMedallion
      // starts false): a page loaded at the top, or in a background tab, fetches nothing for it here
      if (state.wantMedallion || state.keepMedallion) ensureMedallion();
      // the medallion's steps 1–3 at idle, once the first frame is up and the caller's `warmAfter`
      // has resolved (main.js passes the cover intro's settling, so the loader modules, the Draco
      // decode and the rig's compiles never land in the first motion the viewer sees; main.js
      // warms the Ground plate and the first Ascent slides in its own idle callback after the
      // same promise). ensureMedallion still rushes the chain when the Ledger is already near.
      const after = warmAfter && typeof warmAfter.then === 'function' ? warmAfter.catch(() => {}) : Promise.resolve();
      Promise.all([ready, after]).then(() => {
        const go = () => { if (!state.disposed && !medallion && !medallionRig) prepareRig(true); };
        if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 6000 }); else setTimeout(go, 2500);
      }).catch(() => {});
    } catch (e) {
      if (state.disposed) return;
      readyReject(glError('HERO_TEXTURE_FAILED', 'the hero still could not be loaded', e));
    }
  })();

  if (debugLog) {
    const id = setInterval(() => {
      if (state.disposed) { clearInterval(id); return; }
      debugLog('memory', renderer.info.memory, 'resident MB', residentMb().toFixed(1), 'fps', timing.fps.toFixed(0));
    }, 5000);
  }

  // ------------------------------------------------------------------ API
  function setScroll(p) {
    state.scroll = clamp(Number(p) || 0, 0, 1);
  }

  function setPointer(x, y) {
    const p = state.pointer;
    if (!Number.isFinite(x) || !Number.isFinite(y)) { p.active = false; return; }
    p.tx = clamp(x, -1, 1);
    p.ty = clamp(y, -1, 1);
    p.active = true;
    p.at = now();
  }

  function killTween() {
    if (transition.tween) { transition.tween.kill(); transition.tween = null; }
  }

  function goTo(i) {
    if (state.disposed) return;
    i = clamp(Math.round(Number(i) || 0), 0, slides.length - 1);
    if (failed.has(i)) return;
    if (!bitmaps.has(i)) {
      // not fetched yet: keep the current slide on the plane and run the transition when it lands
      pendingGoTo = i;
      ensureAscentBitmaps();
      return;
    }
    pendingGoTo = null;
    if (i === transition.b && (transition.p >= 1 || transition.tween)) return;   // already there, or on the way
    const retarget = !!transition.tween && transition.p < 1;
    if (reducedMotion) {
      killTween();
      transition.a = transition.b = i;
      transition.p = 1;
      transition.dollyA = 1;
      state.cur = i;
      syncAscentResidency();
      return;
    }
    if (retarget) {
      transition.b = i;
    } else {
      transition.a = transition.b;
      transition.dollyA = ascentU.uDollyB.value;
      transition.b = i;
      transition.p = 0;
    }
    state.cur = i;
    syncAscentResidency();
    killTween();
    transition.tween = gsap.to(transition, {
      p: 1,
      duration: (TUNING.dispMs / 1000) * (retarget ? 1 - transition.p : 1),
      ease: retarget ? 'power2.out' : 'power3.inOut',
      overwrite: true,
      onComplete() { transition.tween = null; transition.a = transition.b; syncAscentResidency(); },
    });
  }

  function setScene(id, p) {
    const v = clamp(Number(p) || 0, 0, 1);
    if (id === 'ascent') state.ascentP = v;
    else if (id === 'ledger') state.ledgerP = v;
  }

  function setVideo(el) {
    state.heroVideoEl = el instanceof HTMLVideoElement ? el : null;
  }

  function pause() { state.running = false; timing.prev = 0; }
  function resume() { if (!state.disposed) { state.running = true; state.needsClear = true; } }

  function stats() {
    const resident = [];
    if (tex.hero) resident.push('hero');
    if (tex.depth) resident.push('depth');
    if (tex.luma) resident.push('luma');
    if (tex.heroVideo) resident.push('hero-video');
    if (tex.disp) resident.push('disp');
    for (const i of tex.ascent.keys()) resident.push('ascent-' + i);
    if (tex.ascentVideo) resident.push('ascent-video');
    if (medallion) resident.push('medallion-' + medallion.kind);
    return {
      fps: +timing.fps.toFixed(1),
      frameMs: +timing.ema.toFixed(2),
      cpuMs: +timing.cpu.toFixed(2),
      textures: renderer.info.memory.textures,
      geometries: renderer.info.memory.geometries,
      mb: +residentMb().toFixed(1),
      dpr: +(state.dpr * state.dprScale).toFixed(2),
      dprScale: state.dprScale,
      degraded: state.degraded,
      adaptivePhase: timing.phase,
      size: { w: state.w, h: state.h },
      slide: state.cur,
      transition: { a: transition.a, b: transition.b, p: +transition.p.toFixed(3) },
      heroMix: +state.heroMix.toFixed(2),
      masks: masksOk,
      resident,
      visible: { hero: heroMesh.visible, ascent: ascentMesh.visible, medallion: medMesh.visible },
      light: { x: +state.light.x.toFixed(3), y: +state.light.y.toFixed(3), pointer: state.pointer.active },
      medallion: medallion ? medallion.stats() : null,
      medallionWarm: { ...medallionWarm, pending: !!medallionPrefetch || !!medallionRigPromise, rig: !!medallionRig, loading: state.medallionLoading },
      rt: rt ? { ...rtSize, samples: rt.samples, halfFloat: rt.texture.type === THREE.HalfFloatType } : null,
      lost: state.lost,
      dissolvePx: heroU.uDissolve.value,
    };
  }

  function dispose() {
    if (state.disposed) return;
    state.disposed = true;
    state.readyWanted = false;
    gsap.ticker.remove(tick);
    killTween();
    clearTimeout(resizeTimer);
    window.removeEventListener('resize', onWindowResize);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    if (medHost) {
      medHost.removeEventListener('pointermove', onMedMove);
      medHost.removeEventListener('pointerleave', onMedLeave);
    }
    for (const io of observers) io.disconnect();
    observers.length = 0;
    disposeMedallionAll();
    for (const t of [tex.hero, tex.depth, tex.luma, tex.disp, tex.heroVideo, tex.ascentVideo]) if (t) dropTexture(t);
    for (const t of tex.ascent.values()) dropTexture(t);
    tex.ascent.clear();
    for (const t of [...bytes.keys()]) dropTexture(t);
    uploadQueue.length = 0;
    for (const b of bitmaps.values()) { if (b && typeof b.close === 'function') { try { b.close(); } catch {} } }
    bitmaps.clear();
    blank.dispose();
    heroMat.dispose(); ascentMat.dispose(); compMat.dispose();
    unitPlane.dispose();
    scene2d.clear();
    try {
      if (!state.lost) {
        renderer.setRenderTarget(null);
        renderer.setScissorTest(false);
        renderer.clear();
      }
    } catch {}
    renderer.dispose();
    canvas.classList.remove('is-lost');
    emit('disposed');
  }

  const api = {
    ready,
    setScroll,
    setPointer,
    goTo,
    resize,
    pause,
    resume,
    dispose,
    setScene,
    setVideo,
    warm,
    stats,
    debug: {
      renderer,
      THREE,
      state,
      loseContext() { renderer.forceContextLoss(); },
      restoreContext() { renderer.forceContextRestore(); },
      medallion() { return medallion; },
      uniforms: { hero: heroU, ascent: ascentU },
    },
  };
  return api;
}
