# Vendored libraries

Static site, no build step, no CDN at runtime. Every library the page imports lives in this folder and is referenced by relative path through the importmap below.

Vendored on 2026-10-09 from the npm registry (`npm pack <name>@<version>`, tarball extracted in a scratch folder, only the files listed here copied). No file was edited. Total: 1.8 MB on disk, 34 files.

## Versions

| Library | Version | Files kept | License |
|---|---|---|---|
| GSAP | 3.13.0 | `gsap/esm/index.js`, `gsap-core.js`, `CSSPlugin.js`, `ScrollTrigger.js`, `Observer.js`, `SplitText.js` (ES modules; minified once with esbuild 0.24.2 in the polish pass of 2026-10-09, readable sources in `raw/vendor-src/gsap-esm/`); `gsap/gsap.min.js`, `ScrollTrigger.min.js`, `SplitText.min.js`, `Observer.min.js` (UMD, minified, for classic `<script>` use if ever needed) | GreenSock standard "no charge" license. Since 3.13 the whole toolset, SplitText included, is free for commercial use (thanks to Webflow). See `gsap/README-gsap.md` and https://gsap.com/standard-license |
| Lenis | 1.3.26 | `lenis/lenis.esm.js` (ESM), `lenis.js` (UMD), `lenis.min.js` (UMD min), `lenis.css` (required CSS) | MIT, `lenis/LICENSE` |
| three.js | 0.179.1 (r179) | `three/build/three.module.min.js` + `three/build/three.core.min.js` (the module build imports the core build; both are required); addons from `examples/jsm`: `loaders/GLTFLoader.js`, `loaders/DRACOLoader.js`, `utils/BufferGeometryUtils.js` (GLTFLoader depends on it), `environments/RoomEnvironment.js`, `postprocessing/EffectComposer.js`, `RenderPass.js`, `ShaderPass.js`, `OutputPass.js`, `Pass.js`, `MaskPass.js`, `shaders/CopyShader.js`, `OutputShader.js`; Draco decoder `three/draco/gltf/draco_wasm_wrapper.js` + `draco_decoder.wasm` | MIT, `three/LICENSE` |

Why these versions: 3.13.0 is the only 3.13.x release and the first fully free one; 1.3.26 is the current 1.x Lenis; r179 is the latest r17x three release (the task pinned r17x). All three are more than two weeks old.

## Importmap (exact, paste into `<head>` before any `<script type="module">`)

```html
<script type="importmap">
{
  "imports": {
    "three": "./vendor/three/build/three.module.min.js",
    "three/addons/": "./vendor/three/addons/",
    "gsap": "./vendor/gsap/esm/index.js",
    "gsap/ScrollTrigger": "./vendor/gsap/esm/ScrollTrigger.js",
    "gsap/SplitText": "./vendor/gsap/esm/SplitText.js",
    "lenis": "./vendor/lenis/lenis.esm.js"
  }
}
</script>
<link rel="stylesheet" href="./vendor/lenis/lenis.css">
```

Paths are relative to the HTML document, so this snippet is for pages that sit in `site/` next to `vendor/`. A page in a subfolder needs `../vendor/...`.

Usage:

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
```

The addons import the bare specifier `'three'`, which only resolves through the importmap. That is why the map must be in the document before any module loads (import maps do not apply to workers or to `<script src>`).

## Verification (done 2026-10-09)

- `node check-vendor.mjs site/` (static pass, script kept in the session scratchpad): every importmap target exists and is non-empty, and all 28 import specifiers inside the vendored files (relative and bare) resolve. 0 failures.
- `site/vendor-test.html` served with `python -m http.server 8765` from `site/` and opened in Chrome: 12/12 checks pass (three r179, every addon, GSAP 3.13.0, ScrollTrigger 3.13.0, SplitText split of 18 chars, Lenis instance, a RoomEnvironment + EffectComposer render with a lit centre pixel, Draco wasm reachable over HTTP 200). No console errors. The server log shows each vendor file fetched exactly once.
- `site/shader-test.html`: the GLSL snippets in `docs/tech-notes.md` compile and render through three's ShaderMaterial and ShaderPass with no shader errors.

Both test pages are dev-only. At integration (2026-10-09) they were moved to `dev/early-tests/` so that `site/` holds only the published page; to re-run one, copy it back into `site/` (its vendor paths are relative to `site/`) and delete it afterwards.

## Sizes (raw, before gzip or brotli)

| Group | Raw | Notes |
|---|---|---|
| three.module.min.js + three.core.min.js | 719 KB | about 180 KB over the wire with gzip. Load it lazily (`await import('three')`) only after the WebGL capability check passes, so phones without WebGL 2 never download it |
| GSAP ESM (6 files) | 122 KB | minified ESM (esbuild, polish pass 2026-10-09); about 48 KB over gzip. The readable sources are in `raw/vendor-src/gsap-esm/` |
| Lenis ESM | 33 KB | |
| Addons used | about 200 KB | GLTFLoader is 115 KB of that |
| Draco decoder | 251 KB | fetched only when a Draco-compressed GLB loads |

## Notes and limits

- three r179 is WebGL 2 only ("WebGL 1 is not supported since r163" is in the bundle). Gate on `canvas.getContext('webgl2')`, not `'webgl'`.
- `DRACOLoader.setDecoderPath('./vendor/three/draco/gltf/')` is resolved against the page URL, not the module. Only the wasm decoder is vendored (every supported browser has WebAssembly); `draco_decoder.js` (the asm.js fallback, 512 KB) was left out on purpose. Draco is needed only if a GLB was compressed with Draco; plain Meshy exports load without it.
- Not vendored, add from the same `three-0.179.1.tgz` if a scene needs them: `KTX2Loader` + basis transcoder, `MeshoptDecoder`, `OrbitControls`, `UnrealBloomPass`, `SMAAPass`, `RGBELoader` (HDR environments; `RoomEnvironment` needs no file).
- GSAP `ScrollSmoother` is not vendored on purpose: we use Lenis for smooth scroll, and the two should not run together.
- `lenis.css` is required (it sets `html.lenis` heights, `overflow: clip` while stopped and `overscroll-behavior` on `data-lenis-prevent` elements).

## Re-vendoring

```sh
mkdir dl && cd dl
npm pack gsap@3.13.0 lenis@1.3.26 three@0.179.1
tar -xzf gsap-3.13.0.tgz && tar -xzf lenis-1.3.26.tgz && tar -xzf three-0.179.1.tgz
# copy the files listed above into site/vendor/, then copy dev/early-tests/vendor-test.html into site/ and open it over http (remove it again afterwards)
```

Downloaded tarballs are untrusted data: extract them in their own folder, copy what is listed, never run anything from inside the extracted tree.
