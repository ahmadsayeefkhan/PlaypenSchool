/**
 * GLSL for js/webgl/hero.js (Contract B, final-spec.md section 5 and 10.3).
 *
 * Written in GLSL ES 1.00 style (varying, texture2D, gl_FragColor): three.js r179 prepends
 * `#version 300 es` and the compatibility defines when the renderer runs on WebGL 2, so these
 * strings go straight into ShaderMaterial.
 *
 * Texture convention: every 2D texture hero.js creates has `flipY = false` (ImageBitmap,
 * HTMLImageElement and HTMLVideoElement uploads all behave the same that way), so the shaders
 * flip the v coordinate at the lookup: `look(uv)` turns y-up plane space into texture space.
 *
 * Colour: the stills are uploaded without colour-space conversion (`NoColorSpace`) and written
 * to the canvas as they are. The thresholds and `uPaper` below are therefore in display (sRGB)
 * space, the space the spec's constants were written in. Only the medallion composite is linear
 * in and sRGB out (three skips tone mapping and the sRGB encode when rendering into a render
 * target, so the composite applies both).
 */

// 2D simplex noise. Ian McEwan, Ashima Arts. MIT. https://github.com/stegu/webgl-noise
export const SIMPLEX2D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const COMMON = /* glsl */ `
vec2 look(vec2 uv) { return vec2(uv.x, 1.0 - uv.y); }
float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
// object-fit: cover, centred. plane and img in the same unit (px); returns y-up image space 0..1.
vec2 coverUv(vec2 uv, vec2 plane, vec2 img) {
  vec2 s = plane / img;
  float sc = max(s.x, s.y);
  vec2 scaled = img * sc;
  vec2 off = (plane - scaled) * 0.5;
  return (uv * plane - off) / scaled;
}
// object-fit: cover anchored to the top edge: centred horizontally, the bottom is cropped first.
vec2 coverUvTop(vec2 uv, vec2 plane, vec2 img) {
  vec2 s = plane / img;
  float sc = max(s.x, s.y);
  vec2 scaled = img * sc;
  vec2 off = vec2((plane.x - scaled.x) * 0.5, plane.y - scaled.y);
  return (uv * plane - off) / scaled;
}
`;

/** Vertex shader for every DOM-synced plane (the ortho camera works in CSS px). */
export const VERT_PLANE = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * The hero plane: cover fit anchored to the top, depth parallax, the still mixed with the loop,
 * the golden-hour relight, the paper melt that breathes, highlight-masked film grain and the
 * scroll dim, in the order of final-spec.md section 5.
 */
export const FRAG_HERO = SIMPLEX2D + COMMON + /* glsl */ `
uniform sampler2D uTex;      // the hero still (the baked melt is already in it)
uniform sampler2D uVideo;    // the terrace loop, once it plays
uniform sampler2D uDepth;    // 3-tone depth mask: sky 0, building 0.5, planters and deck 1
uniform sampler2D uLuma;     // the still's luminance, blurred
uniform float uMix;          // still -> loop, 0..1
uniform float uMasks;        // 1 when uDepth and uLuma are real textures, else 0
uniform vec2  uPointer;      // -1..1, lerped in JS (parallax)
uniform vec2  uLight;        // 0..1 in plane space, lerped in JS (the light)
uniform float uTime;         // seconds
uniform float uScroll;       // hero scroll progress 0..1
uniform vec2  uRes;          // plane size in CSS px
uniform vec2  uImgSize;      // texture size in px
uniform vec3  uPaper;        // (0.961, 0.945, 0.918)
uniform float uGrain;        // 0.035
uniform float uMeltTop;      // 0.66: plane-space height where the melt ramp starts
uniform float uBreath;       // 1 = the melt edge breathes, 0 = static (reduced motion)
uniform float uDissolve;     // px from the top edge over which the plate dissolves into the paper (css --hero-fade)
varying vec2 vUv;

void main() {
  float aspect = uRes.x / uRes.y;

  // 1. cover fit anchored to the top edge, zoom 1 -> 1.06 about the centre with scroll
  vec2 uv = coverUvTop(vUv, uRes, uImgSize);
  uv = (uv - 0.5) / (1.0 + 0.06 * uScroll) + 0.5;

  // 2. depth parallax: at most about 12 px on a 1,920 px plane, too small to smear
  float depth = mix(0.5, texture2D(uDepth, look(uv)).r, uMasks);
  uv += uPointer * depth * 0.006;

  // 3. the still, and the loop once it can play
  vec3 rgb = texture2D(uTex, look(uv)).rgb;
  if (uMix > 0.001) rgb = mix(rgb, texture2D(uVideo, look(uv)).rgb, uMix);

  // 4. golden-hour relight weighted by the blurred luminance; a cool lift on the far side.
  //    The light moves; the bricks and the railing never bend (no UV warp here).
  float lm = mix(luma(rgb), texture2D(uLuma, look(uv)).r, uMasks);
  float dist = length((vUv - uLight) * vec2(aspect, 1.0));
  rgb *= 1.0 + 0.12 * smoothstep(0.45, 0.0, dist) * lm * vec3(1.0, 0.86, 0.62);
  rgb *= 1.0 - 0.04 * smoothstep(0.5, 1.0, dist);

  // 5. the paper melt: the baked still already carries it; the live mask only breathes its edge.
  //    The noise is only evaluated in the band where it has weight (a coherent branch: the lower
  //    two thirds of the plane skip it).
  float vert = smoothstep(uMeltTop, 1.0, vUv.y);
  float m = smoothstep(0.82, 0.97, luma(rgb)) * vert;
  float band = smoothstep(uMeltTop - 0.12, uMeltTop + 0.2, vUv.y) * uBreath;
  if (band > 0.001) m += snoise(uv * 2.0 + uTime * 0.03) * 0.06 * band;
  m = clamp(m, 0.0, 1.0);
  //    The top uDissolve px dissolve fully into the paper: the baked sky is a shade darker than the
  //    page, which otherwise reads as a hard seam where the plate begins, and the cover's copy sits
  //    in this zone since the plate was lifted under the lead (css: the same mask on the DOM).
  float topPx = (1.0 - vUv.y) * uRes.y;
  m = max(m, 1.0 - smoothstep(0.0, max(uDissolve, 1.0), topPx));
  rgb = mix(rgb, uPaper, m);

  // 6. film grain, pixel-locked and re-seeded each frame, masked in the highlights, none on paper
  float g = hash(gl_FragCoord.xy + fract(uTime) * 1000.0) - 0.5;
  float w = 1.0 - smoothstep(0.6, 1.0, luma(rgb));
  rgb += g * uGrain * (1.0 + 0.6 * uScroll) * w * (1.0 - m);

  // 7. scroll dim
  rgb *= 1.0 - 0.18 * uScroll * (1.0 - m);

  gl_FragColor = vec4(rgb, 1.0);
}
`;

/**
 * The Ascent plane: two slides, the brick displacement between them (heat haze over brick,
 * rising with the climb), a chromatic split that exists only mid-transition, the dolly across
 * a chapter, and the chapter film mixed into whichever slot holds its slide.
 */
export const FRAG_ASCENT = COMMON + /* glsl */ `
uniform sampler2D uTexA;     // the slide leaving
uniform sampler2D uTexB;     // the slide arriving (the current slide at rest)
uniform sampler2D uDisp;     // brick displacement map, levels 0.3-0.7, mirrored repeat
uniform sampler2D uVideo;    // a chapter film
uniform float uProgress;     // 0 -> 1, eased in JS
uniform float uIntensity;    // 0.35
uniform float uChroma;       // split in uv units at mid-transition, 0.003
uniform float uVideoMix;     // 0..1
uniform float uVideoSlot;    // -1 none, 0 = the film belongs to A, 1 = to B
uniform float uDollyA;       // 1.0 -> 1.06
uniform float uDollyB;
uniform vec2  uPlaneSize;    // CSS px
uniform vec2  uImgSizeA;
uniform vec2  uImgSizeB;
uniform vec2  uVideoSize;
varying vec2 vUv;

vec3 slide(sampler2D tex, vec2 uv, vec2 off, vec2 split) {
  vec3 c = texture2D(tex, look(uv + off)).rgb;
  if (split.y > 0.00001) {
    c.r = texture2D(tex, look(uv + off + split)).r;
    c.b = texture2D(tex, look(uv + off - split)).b;
  }
  return c;
}

void main() {
  float aspect = uPlaneSize.x / uPlaneSize.y;
  float p = uProgress;
  float k = 4.0 * p * (1.0 - p);                       // 0 at rest, 1 mid-transition
  float d = texture2D(uDisp, vec2(vUv.x * aspect, 1.0 - vUv.y)).r - 0.5;   // -0.2..0.2
  vec2 dir = vec2(0.18, 1.0);
  vec2 offA = -dir * (d + 0.15) * uIntensity * p;          // A lifts away
  vec2 offB =  dir * (d + 0.15) * uIntensity * (1.0 - p);  // B rises into place
  vec2 split = dir * uChroma * k;

  vec2 uvA = coverUv(vUv, uPlaneSize, uImgSizeA);
  uvA = (uvA - 0.5) / uDollyA + 0.5;
  vec2 uvB = coverUv(vUv, uPlaneSize, uImgSizeB);
  uvB = (uvB - 0.5) / uDollyB + 0.5;

  vec3 a = slide(uTexA, uvA, offA, split);
  vec3 b = slide(uTexB, uvB, offB, split);

  if (uVideoMix > 0.001) {
    vec2 uvV = coverUv(vUv, uPlaneSize, uVideoSize);
    if (uVideoSlot < 0.5) {
      uvV = (uvV - 0.5) / uDollyA + 0.5;
      a = mix(a, slide(uVideo, uvV, offA, split), uVideoMix);
    } else {
      uvV = (uvV - 0.5) / uDollyB + 0.5;
      b = mix(b, slide(uVideo, uvV, offB, split), uVideoMix);
    }
  }

  gl_FragColor = vec4(mix(a, b, p), 1.0);
}
`;

/**
 * The medallion composite: the Ledger's 3D region is rendered into a small multisampled,
 * half-float render target (linear light, premultiplied by coverage), then drawn as one more
 * DOM-synced plane. Three's tone mapping and sRGB chunks run here because the render target
 * pass skipped them; the output is premultiplied for ONE / ONE_MINUS_SRC_ALPHA blending on the
 * transparent canvas, so the night ground and the CSS glow show through around the crest.
 */
export const FRAG_COMPOSITE = /* glsl */ `
uniform sampler2D uTex;
varying vec2 vUv;
void main() {
  vec4 t = texture2D(uTex, vUv);
  vec3 c = t.rgb / max(t.a, 0.0001);
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  gl_FragColor = vec4(gl_FragColor.rgb * t.a, t.a);
}
`;
