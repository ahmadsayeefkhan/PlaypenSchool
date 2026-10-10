# Fonts (self-hosted, Latin subset)

Two families from Google Fonts, SIL Open Font License 1.1, downloaded 2026-10-09 with a current Chrome user agent so the CSS API served the variable WOFF2 files; only the `/* latin */` subset of each was kept. No CDN request at runtime; `css/main.css` declares them with `@font-face` and metric-matched fallbacks (Georgia for Newsreader, Arial for Hanken Grotesk) tuned from the fonts' own `hhea`/`OS/2` tables.

| File | Family | Source | Axes kept | Size |
|---|---|---|---|---|
| `newsreader-var.woff2` | Newsreader, roman | https://fonts.gstatic.com/s/newsreader/v26/cY9AfjOCX1hbuyalUrK4397yjA.woff2 (via https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800) | `wght` 300–400, `opsz` 16–72 | 81 KB |
| `newsreader-italic-var.woff2` | Newsreader, italic | https://fonts.gstatic.com/s/newsreader/v26/cY9CfjOCX1hbuyalUrK439vCjohC.woff2 (same CSS) | `wght` 300–400, `opsz` 64–72 (display use only: one italic word per headline) | 60 KB |
| `hanken-grotesk-var.woff2` | Hanken Grotesk | https://fonts.gstatic.com/s/hankengrotesk/v12/ieVn2YZDLWuGJpnzaiwFXS9tYtpd59A.woff2 (via https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900) | `wght` 400–600 | 20 KB |

Total 159 KB (budget ≤ 200 KB, spec §2.2).

Processing (fontTools 4.x in a scratch virtualenv, run with `python -I` on the downloaded files, which are never executed): `pyftsubset` to the Latin ranges the page uses (`U+0020-007E, U+00A0-00FF, U+2013-2014, U+2018-201E, U+2020-2022, U+2026, U+2212` and a few more), all layout features kept, hinting dropped; then `fontTools.varLib.instancer` narrowed the variable axes to the ranges in the table (the page sets Newsreader 300 for display and 400 for prose, Hanken 400 and 500). Everything else about the fonts is unchanged. The unmodified Google files are in the session scratch folder only; re-download with the URLs above to rebuild.

Licence: SIL OFL 1.1 for both families (https://openfontlicense.org). Newsreader is by Production Type; Hanken Grotesk by Hanken Design Co.
