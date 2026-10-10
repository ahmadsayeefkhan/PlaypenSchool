/**
 * The medallion for the Ledger (final-spec.md section 9): the GLB rig with RoomEnvironment
 * lighting, the procedural fallback through medallion-procedural.js, the motion with its
 * clamps (the back is never presented), residency and disposal.
 *
 * Used only by js/webgl/hero.js. This module never touches the DOM, never creates listeners
 * and never creates ScrollTriggers. three.js is passed in; the loaders and RoomEnvironment are
 * imported here, dynamically, so nothing 3D is fetched until the Ledger is near.
 */
import { buildMedallion } from './medallion-procedural.js';

/** Rotation limits in radians (section 9): within these the plainer back face never shows. */
export const LIMITS = Object.freeze({ yMin: -1.2, yMax: 0.10, xMin: -0.20, xMax: 0.20 });
/** Rest pose. */
export const REST = Object.freeze({ y: -0.35, x: 0.08 });

const TWO_PI = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const MAP_KEYS = ['map', 'normalMap', 'metalnessMap', 'roughnessMap', 'aoMap', 'emissiveMap'];

/**
 * Phase one of the medallion: the loader modules, the GLB fetch, the Draco decode (in the
 * loader's worker) and the texture decode, with nothing uploaded to the GPU. hero.js calls this
 * at idle after boot and hands the result to createMedallion when the Ledger is near, so the
 * section's arrival pays only for the rig and the uploads (spread over frames there).
 * @returns {Promise<{gltf: object, loadMs: number}>}
 */
export async function loadMedallionGltf(THREE, { url, dracoPath = './vendor/three/draco/gltf/', onProgress = null } = {}) {
  const t0 = performance.now();
  const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/loaders/DRACOLoader.js'),
  ]);
  const draco = new DRACOLoader().setDecoderPath(dracoPath).setDecoderConfig({ type: 'wasm' });
  const loader = new GLTFLoader().setDRACOLoader(draco);
  try {
    const gltf = await new Promise((resolve, reject) => {
      loader.load(
        url,
        resolve,
        (ev) => { if (onProgress && ev && ev.lengthComputable) onProgress(clamp(ev.loaded / ev.total, 0, 1)); },
        (err) => reject(err instanceof Error ? err : new Error('GLB load failed: ' + (err && err.message ? err.message : url))),
      );
    });
    return { gltf, loadMs: Math.round(performance.now() - t0) };
  } finally {
    draco.dispose();   // the decoder workers are not kept around
  }
}

/** Dispose a loaded-but-unused gltf (textures closed, geometries freed). */
export function disposeGltf(gltf) {
  if (!gltf || !gltf.scene) return;
  gltf.scene.traverse((node) => {
    if (!node.isMesh) return;
    const mats = Array.isArray(node.material) ? node.material : [node.material];
    for (const m of mats) {
      for (const k of MAP_KEYS) {
        const t = m[k];
        if (t) { if (t.image && typeof t.image.close === 'function') { try { t.image.close(); } catch {} } t.dispose(); }
      }
      m.dispose();
    }
    node.geometry.dispose();
  });
}

/**
 * @param {object} THREE   the three.js module
 * @param {object} renderer the shared WebGLRenderer (for PMREM and anisotropy)
 * @param {object} opts
 *   url            GLB url or null (null = procedural straight away)
 *   gltf           a model from loadMedallionGltf ({gltf, loadMs}); when given, nothing is fetched
 *   dracoPath      decoder folder, page-relative
 *   fill           fraction of the frame height the crest fills (0.46 desktop, 0.70 phones)
 *   fov            camera field of view in degrees (28)
 *   roughnessBias  added to the GLB material roughness (day-1 gate 4: 0.05 if the rim reads as a game asset)
 *   logoUrl, normalMapUrl, roughnessMapUrl   procedural fallback inputs
 *   maxAnisotropy
 *   onProgress(p)  0..1 while the GLB downloads
 *   log(fn)        optional logger for dev builds
 * @returns {Promise<Medallion>}
 */
export async function createMedallion(THREE, renderer, opts = {}) {
  const o = {
    url: null,
    gltf: null,
    dracoPath: './vendor/three/draco/gltf/',
    fill: 0.46,
    fov: 28,
    roughnessBias: 0,
    logoUrl: './assets/brand/logo-shield-only-1024.png',
    normalMapUrl: './assets/3d/brushed-normal-512.png',
    roughnessMapUrl: './assets/3d/brushed-roughness-512.png',
    maxAnisotropy: 1,
    onProgress: null,
    log: null,
    ...opts,
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(o.fov, 1, 0.05, 20);
  const pivot = new THREE.Group();
  pivot.name = 'medallion-pivot';
  scene.add(pivot);

  // Lighting: a procedural studio through PMREM (no HDR file), a warm key from the upper left,
  // a rim from the right; nothing behind the crest, no shadow maps.
  const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
  let envTarget = null;
  const buildEnvironment = () => {
    if (envTarget) envTarget.dispose();
    const pmrem = new THREE.PMREMGenerator(renderer);
    envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    pmrem.dispose();
    scene.environment = envTarget.texture;
    scene.environmentIntensity = 1.1;
  };
  buildEnvironment();

  const key = new THREE.DirectionalLight(0xffd9a0, 1.4);
  key.position.set(-3, 3.5, 4);
  const rim = new THREE.DirectionalLight(0xffe8c8, 0.8);
  rim.position.set(4, 0.6, 1.4);
  scene.add(key, rim);

  // The model: GLB first, the procedural crest if the GLB is missing or broken.
  let kind = 'none';
  let root = null;
  let disposeModel = () => {};
  let tris = 0;
  let textureBytes = 0;
  let geometryBytes = 0;
  let loadMs = 0;
  let lastError = null;

  if (o.gltf || o.url) {
    try {
      let gltf = o.gltf && o.gltf.gltf ? o.gltf.gltf : o.gltf;   // {gltf, loadMs} or a bare gltf
      if (gltf) {
        loadMs = (o.gltf && o.gltf.loadMs) || 0;
      } else {
        const loaded = await loadMedallionGltf(THREE, { url: o.url, dracoPath: o.dracoPath, onProgress: o.onProgress });
        gltf = loaded.gltf;
        loadMs = loaded.loadMs;
      }
      const materials = new Set();
      const geometries = new Set();
      const textures = new Set();
      gltf.scene.traverse((node) => {
        if (!node.isMesh) return;
        node.frustumCulled = false;
        geometries.add(node.geometry);
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        for (const m of mats) {
          materials.add(m);
          m.side = THREE.FrontSide;            // the back is never presented (rotation clamps)
          m.envMapIntensity = 1.1;
          if (typeof m.roughness === 'number') m.roughness = clamp(m.roughness + o.roughnessBias, 0, 1);
          for (const k of ['map', 'normalMap', 'metalnessMap', 'roughnessMap', 'aoMap', 'emissiveMap']) {
            const t = m[k];
            if (t && t.image && t.image.width && !textures.has(t)) {   // glTF shares one texture for metalness + roughness
              textures.add(t);
              t.anisotropy = Math.min(4, o.maxAnisotropy);
              textureBytes += t.image.width * t.image.height * 4 * 1.33;   // mipmapped
            }
          }
        }
        const g = node.geometry;
        tris += g.index ? g.index.count / 3 : g.attributes.position.count / 3;
        for (const name in g.attributes) geometryBytes += g.attributes[name].array.byteLength;
        if (g.index) geometryBytes += g.index.array.byteLength;
      });
      if (!tris) throw new Error('GLB has no mesh');
      root = gltf.scene;
      kind = 'glb';
      disposeModel = () => {
        for (const m of materials) {
          for (const k of ['map', 'normalMap', 'metalnessMap', 'roughnessMap', 'aoMap', 'emissiveMap']) {
            const t = m[k];
            if (t) { if (t.image && typeof t.image.close === 'function') { try { t.image.close(); } catch {} } t.dispose(); }
          }
          m.dispose();
        }
        for (const g of geometries) g.dispose();
      };
      if (o.onProgress) o.onProgress(1);
    } catch (e) {
      lastError = e;
      if (o.log) o.log('medallion: GLB failed, using the procedural crest', e && e.message);
    }
  }

  if (!root) {
    try {
      const group = buildMedallion(THREE, {
        logoUrl: o.logoUrl,
        normalMapUrl: o.normalMapUrl,
        roughnessMapUrl: o.roughnessMapUrl,
        maxAnisotropy: Math.min(4, o.maxAnisotropy),
        envMapIntensity: 1.1,
        backLogo: false,
      });
      await group.userData.ready;
      group.traverse((node) => {
        if (!node.isMesh) return;
        node.frustumCulled = false;
        const g = node.geometry;
        tris += g.index ? g.index.count / 3 : g.attributes.position.count / 3;
        for (const name in g.attributes) geometryBytes += g.attributes[name].array.byteLength;
        if (g.index) geometryBytes += g.index.array.byteLength;
      });
      textureBytes = 1024 * 1024 * 4 * 1.33 + 2 * (512 * 512 * 4 * 1.33);
      root = group;
      kind = 'procedural';
      disposeModel = () => group.userData.dispose();
      if (o.onProgress) o.onProgress(1);
    } catch (e) {
      lastError = e;
    }
  }

  if (!root) {
    if (envTarget) envTarget.dispose();
    const err = new Error('medallion: no model could be built');
    err.code = 'MEDALLION_FAILED';
    err.cause = lastError;
    throw err;
  }

  // Normalise: height 1, centred on the origin, facing +z. The pivot carries every rotation.
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const centre = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(centre);
  const s = 1 / Math.max(size.y, 1e-6);
  root.scale.setScalar(s);
  root.position.copy(centre).multiplyScalar(-s);
  pivot.add(root);
  const widthOverHeight = size.x / Math.max(size.y, 1e-6);

  // Camera: distance so the crest fills `fill` of the frame height.
  let fill = o.fill;
  const placeCamera = () => {
    const d = (1 / fill) / (2 * Math.tan((o.fov * Math.PI) / 360));
    camera.position.set(0, 0, d);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  placeCamera();

  // Motion state
  const pointerLerp = { x: 0, y: 0 };   // lerped pointer contribution (radians)
  const current = { rotY: REST.y, rotX: REST.x };
  const observed = { minY: Infinity, maxY: -Infinity, minX: Infinity, maxX: -Infinity };

  /**
   * Advance the motion. Call once per rendered frame.
   * @param {object} s
   *   time          seconds
   *   dt            ms since the previous rendered frame
   *   ledgerP       0..1 scroll turn (-1.2 rad -> -0.35 rad); 1 when nobody drives it
   *   pointer       {x, y} in -1..1 over the Ledger, or null
   *   rectHeight    the slot's CSS height, for the 6 px float
   *   reducedMotion true = no float, no sway
   */
  function update(s) {
    const p = clamp(s.ledgerP == null ? 1 : s.ledgerP, 0, 1);
    const base = LIMITS.yMin + (REST.y - LIMITS.yMin) * p;
    const tx = s.pointer ? s.pointer.y * 0.20 : 0;
    const ty = s.pointer ? s.pointer.x * 0.45 : 0;
    const k = 1 - Math.pow(1 - 0.06, (s.dt || 16.7) / 16.7);
    pointerLerp.x += (tx - pointerLerp.x) * k;
    pointerLerp.y += (ty - pointerLerp.y) * k;
    const sway = s.reducedMotion ? 0 : 0.12 * Math.sin((s.time * TWO_PI) / 10);
    const floatPx = s.reducedMotion ? 0 : 6 * Math.sin((s.time * TWO_PI) / 5);
    current.rotY = clamp(base + pointerLerp.y + sway, LIMITS.yMin, LIMITS.yMax);
    current.rotX = clamp(REST.x + pointerLerp.x, LIMITS.xMin, LIMITS.xMax);
    pivot.rotation.set(current.rotX, current.rotY, 0);
    const worldPerPx = (1 / fill) / Math.max(s.rectHeight || 480, 1);
    pivot.position.y = floatPx * worldPerPx;
    if (current.rotY < observed.minY) observed.minY = current.rotY;
    if (current.rotY > observed.maxY) observed.maxY = current.rotY;
    if (current.rotX < observed.minX) observed.minX = current.rotX;
    if (current.rotX > observed.maxX) observed.maxX = current.rotX;
  }

  function setAspect(a) {
    if (Math.abs(camera.aspect - a) > 1e-4) {
      camera.aspect = a;
      camera.updateProjectionMatrix();
    }
  }

  function setFill(f) {
    if (f !== fill) { fill = f; placeCamera(); }
  }

  /** Every texture the model's materials reference (for hero.js to upload one per frame). */
  function textures() {
    const out = [];
    if (!root) return out;
    root.traverse((node) => {
      if (!node.isMesh) return;
      const mats = Array.isArray(node.material) ? node.material : [node.material];
      for (const m of mats) for (const k of MAP_KEYS) { const t = m[k]; if (t && !out.includes(t)) out.push(t); }
    });
    return out;
  }

  function stats() {
    return {
      kind,
      tris: Math.round(tris),
      loadMs,
      mb: +((textureBytes + geometryBytes + 6 * 256 * 256 * 8) / 1048576).toFixed(1),   // PMREM ~ 3 MB
      widthOverHeight: +widthOverHeight.toFixed(3),
      rotY: +current.rotY.toFixed(3),
      rotX: +current.rotX.toFixed(3),
      limits: { ...LIMITS },
      observed: {
        minY: +observed.minY.toFixed(3), maxY: +observed.maxY.toFixed(3),
        minX: +observed.minX.toFixed(3), maxX: +observed.maxX.toFixed(3),
        withinLimits: observed.minY >= LIMITS.yMin - 1e-6 && observed.maxY <= LIMITS.yMax + 1e-6 &&
          observed.minX >= LIMITS.xMin - 1e-6 && observed.maxX <= LIMITS.xMax + 1e-6,
      },
    };
  }

  /** Free the GPU copies of the model's textures and geometry and keep everything else (the
   *  decoded images, the attribute arrays, the environment, the compiled programs), so the
   *  crest can be re-uploaded on a later approach without a fetch, a decode or a compile. */
  function unload() {
    for (const t of textures()) t.dispose();
    if (root) root.traverse((node) => { if (node.isMesh && node.geometry) node.geometry.dispose(); });
  }

  function dispose() {
    disposeModel();
    if (envTarget) { envTarget.dispose(); envTarget = null; }
    scene.environment = null;
    scene.clear();
  }

  return {
    kind,
    scene,
    camera,
    pivot,
    error: lastError,
    update,
    setAspect,
    setFill,
    textures,
    unload,
    rebuildEnvironment: buildEnvironment,   // after a WebGL context restore
    stats,
    dispose,
  };
}
