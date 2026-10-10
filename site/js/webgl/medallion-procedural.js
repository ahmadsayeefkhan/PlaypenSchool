/**
 * Procedural medallion for the Playpen hero (fallback / companion to assets/3d/medallion.glb).
 *
 * buildMedallion(THREE, options) returns a THREE.Group containing:
 *   - a bevelled gold ring (ExtrudeGeometry with bevel)
 *   - a recessed maroon enamel disc inside the ring
 *   - optionally, the school crest as a transparent decal on the front (and back) of the disc
 *
 * The module takes THREE as an argument so it works with whatever three.js build the page
 * imports through its importmap. No imports, no build step, no network calls beyond the
 * optional texture URLs you pass in (keep them relative, e.g. "assets/brand/logo-shield-only-1024.png").
 *
 * The group is centred on the origin and faces +Z. Outer radius = options.radius (default 1).
 * group.userData.ready resolves when every requested texture has loaded (or failed).
 * group.userData.dispose() frees geometries, materials and textures.
 *
 * Suggested use in the hero:
 *   import { buildMedallion } from './js/webgl/medallion-procedural.js';
 *   const medallion = buildMedallion(THREE, {
 *     logoUrl: 'assets/brand/logo-shield-only-1024.png',
 *     normalMapUrl: 'assets/3d/brushed-normal-512.png',
 *     roughnessMapUrl: 'assets/3d/brushed-roughness-512.png',
 *     maxAnisotropy: renderer.capabilities.getMaxAnisotropy(),
 *   });
 *   scene.add(medallion);
 *   // Light it with an environment map (PMREM) for the gold to read as metal.
 */

export const MEDALLION_DEFAULTS = Object.freeze({
  radius: 1,            // outer radius of the gold ring
  ringWidth: 0.15,      // radial width of the gold ring
  ringDepth: 0.14,      // ring thickness (z)
  discDepth: 0.08,      // enamel disc thickness (z); the disc sits recessed behind the ring face
  bevel: 0.035,         // bevel size on the ring; the disc uses 60% of it
  segments: 160,        // curve segments around the circle
  gold: 0xc9a227,       // deeper than the brand amber #F5A719 so the metal reads as gold under light
  maroon: 0x8a0204,     // brand maroon
  logoUrl: null,        // transparent PNG for the front decal
  logoScale: 0.74,      // decal width as a fraction of the inner diameter
  backLogo: true,       // mirror the decal onto the back face
  normalMapUrl: null,   // tileable brushed-metal normal map for the ring
  normalScale: 0.14,    // keep the brushing subtle; above ~0.25 it reads as scratches
  normalRepeat: 3,
  roughnessMapUrl: null,
  maxAnisotropy: 1,
  envMap: null,         // optional pre-filtered environment texture
  envMapIntensity: 1.1,
});

export function buildMedallion(THREE, options = {}) {
  const o = { ...MEDALLION_DEFAULTS, ...options };
  const group = new THREE.Group();
  group.name = 'medallion';

  const innerRadius = o.radius - o.ringWidth;
  const disposables = [];
  const loads = [];
  const loader = new THREE.TextureLoader();

  const loadTexture = (url, setup) => {
    if (!url) return null;
    const tex = loader.load(url, () => {}, undefined, () => {});
    tex.anisotropy = o.maxAnisotropy;
    if (setup) setup(tex);
    disposables.push(tex);
    loads.push(new Promise((resolve) => {
      // TextureLoader fires onLoad asynchronously; resolve on either outcome.
      const img = tex.image;
      if (img && img.complete) return resolve();
      loader.load(url, resolve, undefined, resolve);
    }));
    return tex;
  };

  // --- materials ---------------------------------------------------------------
  const normalMap = loadTexture(o.normalMapUrl, (t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(o.normalRepeat, o.normalRepeat);
  });
  const roughnessMap = loadTexture(o.roughnessMapUrl, (t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(o.normalRepeat, o.normalRepeat);
  });

  const goldMat = new THREE.MeshPhysicalMaterial({
    color: o.gold,
    metalness: 1,
    roughness: 0.32,
    clearcoat: 0.25,
    clearcoatRoughness: 0.2,
    envMap: o.envMap,
    envMapIntensity: o.envMapIntensity,
    normalMap: normalMap || null,
    normalScale: new THREE.Vector2(o.normalScale, o.normalScale),
    roughnessMap: roughnessMap || null,
  });

  const maroonMat = new THREE.MeshPhysicalMaterial({
    color: o.maroon,
    metalness: 0,
    roughness: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMap: o.envMap,
    envMapIntensity: o.envMapIntensity,
  });
  disposables.push(goldMat, maroonMat);

  // --- gold ring ----------------------------------------------------------------
  const ringShape = new THREE.Shape();
  ringShape.absarc(0, 0, o.radius - o.bevel, 0, Math.PI * 2, false);
  const ringHole = new THREE.Path();
  ringHole.absarc(0, 0, innerRadius + o.bevel, 0, Math.PI * 2, true);
  ringShape.holes.push(ringHole);

  const ringGeo = new THREE.ExtrudeGeometry(ringShape, {
    depth: o.ringDepth - o.bevel * 2,
    bevelEnabled: true,
    bevelThickness: o.bevel,
    bevelSize: o.bevel,
    bevelSegments: 6,
    curveSegments: o.segments,
  });
  ringGeo.center();
  ringGeo.computeVertexNormals();
  const ring = new THREE.Mesh(ringGeo, goldMat);
  ring.name = 'ring';
  group.add(ring);
  disposables.push(ringGeo);

  // --- enamel disc --------------------------------------------------------------
  const discBevel = o.bevel * 0.6;
  const discShape = new THREE.Shape();
  // Slight overlap into the ring so no seam shows at the join.
  discShape.absarc(0, 0, innerRadius + 0.01 - discBevel, 0, Math.PI * 2, false);
  const discGeo = new THREE.ExtrudeGeometry(discShape, {
    depth: o.discDepth - discBevel * 2,
    bevelEnabled: true,
    bevelThickness: discBevel,
    bevelSize: discBevel,
    bevelSegments: 4,
    curveSegments: o.segments,
  });
  discGeo.center();
  discGeo.computeVertexNormals();
  const disc = new THREE.Mesh(discGeo, maroonMat);
  disc.name = 'disc';
  group.add(disc);
  disposables.push(discGeo);

  // --- crest decal --------------------------------------------------------------
  const decals = [];
  if (o.logoUrl) {
    const logoTex = loadTexture(o.logoUrl, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
    });
    const decalMat = new THREE.MeshPhysicalMaterial({
      map: logoTex,
      transparent: true,
      alphaTest: 0.02,
      metalness: 0,
      roughness: 0.35,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      envMap: o.envMap,
      envMapIntensity: o.envMapIntensity,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const size = innerRadius * 2 * o.logoScale;
    const decalGeo = new THREE.PlaneGeometry(size, size);
    const zFront = o.discDepth / 2 + 0.0015;
    const front = new THREE.Mesh(decalGeo, decalMat);
    front.name = 'crest-front';
    front.position.z = zFront;
    group.add(front);
    decals.push(front);
    if (o.backLogo) {
      const back = new THREE.Mesh(decalGeo, decalMat);
      back.name = 'crest-back';
      back.position.z = -zFront;
      back.rotation.y = Math.PI;
      group.add(back);
      decals.push(back);
    }
    disposables.push(decalGeo, decalMat);
  }

  group.userData.ring = ring;
  group.userData.disc = disc;
  group.userData.decals = decals;
  group.userData.ready = Promise.all(loads).then(() => group);
  group.userData.dispose = () => {
    for (const d of disposables) if (d && typeof d.dispose === 'function') d.dispose();
    group.clear();
  };
  return group;
}

/**
 * Low-cost idle motion for the hero: slow turn plus a gentle float.
 * Call every frame with elapsed seconds; skip it when prefers-reduced-motion is set.
 */
export function idleMedallion(group, t, amount = 1) {
  group.rotation.y = Math.sin(t * 0.35) * 0.55 * amount;
  group.rotation.x = Math.sin(t * 0.21) * 0.12 * amount;
  group.position.y = Math.sin(t * 0.6) * 0.04 * amount;
}
