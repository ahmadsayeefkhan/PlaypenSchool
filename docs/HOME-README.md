# The Playpen School, sample homepage (Playpen Version 1)

> **Update, 2026-10-11.** This folder is now the whole multi-page website and the home is one page of it. How the other pages are built is in `../README.md` and `COMPONENTS.md`. What changed on the home: the header's primary links, the full-screen menu, the footer and the SEO head (canonical, Open Graph, JSON-LD) are written by `build/sync_home.py` from `build/nav.json` (they sit between `pp:begin` / `pp:end` comments in `index.html`; edit `nav.json`, not the block); the menu gained a disclosure per group (`js/sections/menu.js`); every link that pointed at an inner page of playpen.edu.bd now points at the local page; the footer no longer carries the "design sample" notice or the `credits.html` link; the Sheet's enquiry form says it is a prototype. The publishing steps 1 and 2 below are done (canonical and absolute `og:` URLs are in place); the redirects and cache headers are in `../vercel.json`, written by `build/build.py`.

A static, single-page sample homepage for The Playpen School, Dhaka, built by Defined Solution as a private presentation piece. No build step, no CDN at runtime: plain HTML, CSS and ES modules, with every library vendored in this folder. This folder is the whole publishable site; upload it as it is.

## Run it locally

From this folder:

```
python -m http.server 5173
```

Then open http://localhost:5173/ in Chrome, Edge, Firefox or Safari. The page must be served over http (ES modules and the importmap do not load from `file://`).

Better for rehearsals: the project's own server keeps connections alive, serves byte ranges for the film and sends the right MIME types. From the project root (one level up):

```
python -I tools/serve.py 5173 --dir site
```

`python -m http.server` answers HTTP/1.0 with a short listen backlog; on Windows the start-up burst (34 module requests, fonts, the hero image) can occasionally get a connection refused on a cold load. If the page ever stays on its static layout, reload once or use `tools/serve.py`.

## URL parameters (for the presentation, not for visitors)

| Parameter | Effect |
|---|---|
| `?intro=1` | Replay the full preloader storyboard. By default a second load in the same tab uses the short 300 ms fade (`sessionStorage pp:introSeen`). |
| `?tier=full` / `light` / `still` | Force a rendering tier (see below). |
| `?sample=1` | Show the small gold "Sample" tags on every line of sample copy (`docs/sample-copy.md`). Off by default. `?clean=1` is accepted and does nothing extra. |
| `?present=1` | Present mode. Keys: `R` replay the intro, `1`–`5` jump to a Campus chapter, `T` cycle the tier, `M` phone frame, `P` big cursor, `S` toggle the sample tags. |

Deep links work: `/#admissions`, `/#ascent`, and so on. Reload and back/forward restore the scroll position.

## Rendering tiers

The inline gate in `index.html` picks one before any module loads, and `html[data-tier]` carries it:

- **full**: fine-pointer desktops from 1024 px with WebGL 2, not low-end, no Save-Data. three.js draws the hero plate, the Campus slides and the Ledger medallion on the one `<canvas id="gl">`; GSAP ScrollTrigger pins the Campus scene; Lenis smooths the scroll.
- **light**: phones and tablets (coarse pointer or under 1024 px), low-end devices, Save-Data, or a renderer that fails to start. No three.js, no Draco, no GLB is requested. The DOM pictures and the courtyard film carry every scene; the same reveals and pin run in CSS and GSAP.
- **still**: `prefers-reduced-motion: reduce`, or the "Motion" toggle in the footer (`localStorage pp:motion`). No preloader storyboard, no pin, no smooth scroll, no video autoplay; every block is shown at rest.

Degradation beyond that: if the module graph never boots (a 404, a wrong MIME type, no importmap support) the watchdog in `index.html` drops the page to its static, script-free layout after 8 s (`html.no-app`); with JavaScript off the same `html:not(.js)` layout renders directly. Every image is in the DOM with `alt`, `width` and `height`; the WebGL canvas is `aria-hidden` and only ever repeats what the DOM already shows.

## What each folder holds

| Path | Contents |
|---|---|
| `index.html` | The page: every word of copy lives here. The inline gate (tier, watchdog, scroll restoration), the importmap and the module preloads are in `<head>`. |
| `credits.html` | The asset register for the private presentation (`noindex`), generated from `docs/CREDITS.md`. Linked from the footer. |
| `css/main.css` | All page styles: tokens, type scale, the eight sheets, the footer, the Sheet drawer, the Menu overlay, phone and reduced-motion rules, the `html:not(.js)` static layout. |
| `css/preloader.css` | The preloader overlay and its storyboard states. |
| `js/main.js` | Boot: tier and capabilities, preloader start, the renderer (full tier), the section modules, every ScrollTrigger built at scroll 0, the lift, scroll restoration, the motion toggle. Exposes `window.__PLAYPEN` (`tier`, `errors`, `lenis`, `hero`, `ready`) for QA. |
| `js/preloader.js` | The entry and exit storyboard: datum line, crest, ticks, the FLIP of the crest into the header, the lift. |
| `js/sections/` | One module per behaviour: `scroll` (ScrollTrigger config, Lenis, anchors), `reveals` (split headlines, clip and fade reveals, the settle pass), `nav`, `menu`, `sheet` (the Book a visit / How to apply / Enquire drawer), `cursor`, `magnet`, `cover` (hero intro), `ground`, `ascent` (the pinned Campus chapters, rail, ticks, film), `learning`, `life`, `ledger`, `present`. |
| `js/webgl/` | The one three.js renderer (`hero.js`), its shaders (`shaders.js`), the medallion loader (`medallion.js`) and the procedural fallback crest (`medallion-procedural.js`). Loaded in the full tier only. |
| `assets/media/` | Every photograph at the widths the page asks for (480 to 2560), each as AVIF, WebP and JPG; the courtyard film `ascent-1-film.mp4` (the only video); the hero's depth and luma maps; the brick displacement texture; favicons; the Open Graph image. Produced by `tools/pipeline.py` from `../source-media/` (which is never uploaded). |
| `assets/brand/` | The school's mark: `logo-mark.svg` (preloader and header), `logo-white-160.png` (footer), plus the PNG masters and the Meshy inputs kept for the credits record (not requested by the page). |
| `assets/3d/` | `medallion-1k.glb` (the Draco-compressed crest for the Ledger, full tier), its two 512 px texture maps and the `medallion-fallback-1200.webp` still. |
| `vendor/` | GSAP 3.13.0 (ESM, minified once with esbuild; ScrollTrigger, SplitText, Observer), Lenis 1.3.26, three.js r179 with the addons the page imports and the Draco decoder, and the two self-hosted font families (Newsreader, Hanken Grotesk; Latin subsets, SIL OFL). Versions, licences and the importmap are in `vendor/README.md`. |
| `.htaccess`, `_headers` | Server rules for Apache and for Netlify / Cloudflare Pages: MIME types for `.js .wasm .glb .avif .webp .svg .woff2`, compression for text, a one-year immutable cache for `assets/` and `vendor/`, `no-cache` for the HTML. |

Sibling folders in the project (not part of the upload): `../docs/` (spec, tech notes, credits, sample-copy register, QA reports, release notes), `../tools/` (the image and video pipeline, the dev server), `../dev/` (headless QA scripts and early test pages), `../raw/` and `../source-media/` (originals and cut files, 1.2 GB).

## Publishing

1. Upload this folder as it is (about 35 MB). Keep `.htaccess` or `_headers`, whichever the host reads.
2. In `index.html`, fill in the two commented lines after `og:image:alt`: `og:url` and `<link rel="canonical">` with the hosted URL, and make `og:image` and `twitter:image` absolute.
3. On the hosted copy, check with `curl -sI` that `vendor/lenis/lenis.esm.js` is served as `text/javascript`, `vendor/three/draco/gltf/draco_decoder.wasm` as `application/wasm`, an `.avif` as `image/avif`, `assets/3d/medallion-1k.glb` as `model/gltf-binary`, `assets/brand/logo-mark.svg` as `image/svg+xml`, and that `css/main.css` arrives with `content-encoding: br` or `gzip`. Byte ranges must work for `assets/media/ascent-1-film.mp4`.
4. The full checklist, with the reasons, is `../docs/tech-notes.md` §8.6.

## Content rules that the files follow

English only; sentence case; no invented numbers, quotes or results. Every line the school has not supplied is listed in `../docs/sample-copy.md` and carries `data-sample` in the HTML. Every asset and its source is in `../docs/CREDITS.md` (rendered as `credits.html`). Nine photographs show identifiable minors and are for the private presentation only; `../docs/sample-copy.md` names them.
