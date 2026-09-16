# Playpen School — Website Redesign & Brand System

A complete redesign of [playpen.edu.bd](https://playpen.edu.bd/): **14 rebuilt pages**, a **brand guideline document**, and a **brand board** — built from the school's own content, its own crest, and its own words.

---

## What's here

```
Playpen-Redesign/
├── site/                          ← the website (open index.html)
│   ├── index.html                   Home
│   ├── about.html                   Our story, mission, vision, values
│   ├── leadership.html              Leadership & administration
│   ├── campus.html                  The Bashundhara campus
│   ├── academics.html               Cambridge pathway, 4 stages, subjects, exams, support
│   ├── admissions.html              Entry points, process, documents, forms, uniform, FAQ
│   ├── student-life.html            Sport, arts, clubs, science, service, events
│   ├── achievements.html            Filterable competition archive
│   ├── campus-services.html         Health, transport, bookshop, portal, safeguarding, policies
│   ├── parents.html                 For Parents hub
│   ├── news.html                    Notices, events, gallery
│   ├── alumni.html                  Alumni association + registration
│   ├── careers.html                 Teach at Playpen
│   ├── contact.html                 Departments, enquiry form, map
│   ├── sitemap.xml · robots.txt
│   └── assets/  css · js · img (44 photos) · logo
│
├── brand/
│   ├── brand-board.html           ← one-page visual brand board
│   ├── brand-guidelines.html      ← full 11-section specification
│   ├── BRAND-GUIDELINES.md          plain-text spec for vendors & developers
│   └── logo/                        7 logo assets (SVG + the heritage crest)
│
├── build/                           the static-site generator
│   ├── shell.py                     document template, nav, header, footer, schema
│   ├── p_*.py                       page content
│   └── build.py                     run this to rebuild
│
└── docs/
    ├── 01-information-architecture.md   48 old pages → 14 new, fully mapped
    ├── 02-redirect-map.md               301 rules for Apache and Nginx
    └── 03-verification-checklist.md     what the school must confirm before launch
```

---

## Viewing it

Open `site/index.html` in a browser. Everything is static — no build step, no server, no dependencies.

For the gallery filters and map to behave exactly as they will in production, serve it instead:

```bash
cd site
python -m http.server 8000
# → http://localhost:8000
```

The brand documents are standalone: open `brand/brand-board.html` and `brand/brand-guidelines.html` directly. Both are formatted to print cleanly to PDF (Ctrl-P → Save as PDF).

---

## Rebuilding

Content lives in `build/p_*.py`; the shared shell lives in `build/shell.py`.

```bash
cd build
python build.py
```

That regenerates all 14 pages plus `sitemap.xml` and `robots.txt`. The header, navigation, footer and structured data are defined **once** in `shell.py`, so a nav change propagates everywhere in a single edit — which is the main reason the site is generated rather than hand-written.

Needs Python 3.8+. No packages.

---

## The redesign in short

**The problem.** The old site had 48 pages, several of them a single paragraph ("Multimedia Projector" was a page). The four school stages were split across four pages with no overview. The O Level and A Level subject lists — the highest-intent content on any school website — were buried inside the Senior School page. There was no way to contact the school without picking up a phone, no structured data, no sitemap, and the gallery returned "gallery was not found."

**The approach.** Consolidate 48 pages into 14 hubs with deep-linked sections. Nothing was dropped: every fact from every old page is mapped in `docs/01-information-architecture.md`. Rewrite the copy in one consistent voice. Put admissions everywhere it matters without letting it dominate. Give current parents their own destination instead of making them navigate a prospectus.

**The design.** *Editorial heritage* — a crest school treated like a good magazine. Crimson and gold sampled directly from the school's own shield, warm parchment ground, an expressive variable serif (Fraunces) against a clean geometric sans (Plus Jakarta Sans). Gold used as a hairline rather than a fill, because a school with a real crest should not look like a trophy shop.

**The brand.** The crest stays — it is 48 years of genuine equity. What it lacked was a system: a simplified mark that survives at 24px, a wordmark that works without the crest, accessible colour values, and rules for all of it.

---

## Notable decisions

| Decision | Reasoning |
|---|---|
| **Kept the crest, added a shield mark** | The heritage crest is illegible below ~100px. Rather than redraw it, a simplified digital mark derived from it — same shield, same five stars, same colours — handles favicons, app icons and avatars. |
| **Bronze `#8A5C22` alongside Playpen Gold** | The gold from the crest reaches only 2.4:1 on a light background and fails WCAG AA. Bronze is the same hue family at 5.4:1, so accent text stays legible without leaving the palette. |
| **No third-party JavaScript** | The design method supplied recommends GSAP and Lenis via CDN, and also flags the supply-chain risk. For a school site handling parent enquiries, that risk is not worth it. All motion is vanilla JS plus `IntersectionObserver` — under 5KB, and it degrades to plain HTML if the script fails. |
| **Hub pages, not more pages** | One strong `/academics` page outranks twelve 90-word pages competing with each other — and gives the school one place to update the subject list rather than twelve. |
| **Forms are prototypes** | The enquiry forms validate and respond, but display a notice rather than submitting. They need wiring to the school's mail handler or CRM before launch. |
| **Nothing invented** | Every claim traces to the school's own published content. Where the source was inconsistent (the 1977/1997 founding dates) or unverifiable (the motto attributed in one strategy document but absent from the live site), it is flagged in the verification checklist rather than guessed at. |

---

## Technical

- **No dependencies.** Two Google Fonts and nothing else loaded from a third party.
- **Accessibility.** WCAG AA throughout; body copy and headings exceed AAA. Skip links, visible focus rings, keyboard navigation, 44px tap targets, full `prefers-reduced-motion` support.
- **Performance.** 44 images optimised to 8.1MB total (from 12.6MB), all below-fold images lazy-loaded, no render-blocking JavaScript.
- **SEO.** Unique title and meta description per page, canonical URLs, `School` structured data, Open Graph tags, `sitemap.xml`, `robots.txt`.
- **Responsive.** Tested from 360px to ultrawide. Mobile navigation is an accordion drawer with a persistent *Apply Now*.
- **Print.** Every page prints cleanly; navigation and decoration drop out.

---

## Before launch

Read **`docs/03-verification-checklist.md`** first. Seven items are marked blocking — most importantly the founding timeline (the old site contradicts itself on 1977 vs 1997), the current subject lists, and every phone number.

Then deploy the 301 redirects in **`docs/02-redirect-map.md`** *before* switching DNS. Several of these URLs have been indexed since 2020, and losing them loses the school's search ranking overnight.
