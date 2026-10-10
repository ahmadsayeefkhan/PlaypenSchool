# Writing pages for The Playpen School site: the contract

This file is the contract between the Foundation (the shell, the stylesheet, the script, the build) and the agents who write pages. Everything here has been run: the snippets are the ones in the component kit (`python build/build.py --kit`, then http://localhost:5180/_kit/) and in the three pilot pages (`build/pages/about/index.html`, `build/pages/learning/elementary.html`, `build/pages/admissions/faq.html`). If a snippet and your page disagree, the snippet wins.

Read this once, copy from it, and run the two commands. All commands run from the repository root (`repo/`).

```
python build/build.py --only learning     # build the pages under /learning/ (your section); fails loudly on any mistake
python build/check.py learning            # crawl them: links, anchors, H1, titles, alt, banned words, classes, facts ...
```

Look at the result at **http://localhost:5180/** (the server is already running and serves `site/`; never use `file://`). Check each page at 390 px and 1366 px wide. The screenshot tool lives next to the repository, not inside it, so its path starts with `../`:

```
node ../qa-tools/shot.mjs http://localhost:5180/learning/elementary/ ../qa-tools/out/<your-group>/elementary --sizes=390x844,1366x768 --full
```

**Selectors.** `--only` and the checker's arguments are slug prefixes: `learning`, `learning/elementary`, `admissions/faq`. A selector that matches nothing is an error, never a quiet "0 pages written". In **Git Bash** write the selector without a leading slash: Git Bash turns `/admissions/faq/` into `C:/Program Files/Git/admissions/faq/` (the tools recognise that and say so; `MSYS_NO_PATHCONV=1` switches the rewrite off). The same goes for `--base` and for the page URLs you give `shot.mjs` (`http://localhost:5180/...` is safe; a bare `/about/` is not).

### The contract at a glance

| | |
|---|---|
| Your files | `build/pages/<slug>.html`; your own extra rules in `build/additions/<group>.css` and script in `build/additions/<group>.js` (section 10); notes in `docs/confirm/<group>.md`; credits appended to `docs/credits-log.md` |
| Never edit | `build/nav.json`, `build/shell.py`, `build/build.py`, `build/check.py`, `build/media.py`, `build/htmlutil.py`, `site/index.html`, `site/css/main.css`, `site/css/pages.css`, `site/js/inner.js`, another group's files, `docs/consent-cleared.txt` |
| Tokens | `{{link:/slug/}}` `{{asset:path}}` `{{img src= alt= sizes=}}` `{{no}}` `{{children:/slug/}}` `{{phones}}` `{{phone:key}}` `{{hours}}` `{{hours:between}}` `{{address}}` `{{maps_url}}` `{{map}}` `{{ext:portal}}` `{{ext:pay}}` `{{ext href= label=}}` `{{cta}}` `{{sitemap}}` `{{breadcrumb}}` `{{root}}` |
| Facts | A phone number, the hours and the address are written once, in `nav.json`; the checker fails on a typed one that differs |
| Photographs | Only frames the catalogue allows; the build refuses the rest (section 6) |
| Targets | 44 px; links in a sentence follow WCAG 2.5.8 (section 8) |

---

## 1. What you own, what you do not

| You write | Where |
|---|---|
| Your pages | `build/pages/<slug>.html` (a hub is `build/pages/<slug>/index.html`) |
| Photographs you add | `site/assets/img/` (see "Images") |
| Things the school must confirm | `docs/confirm/<your-group>.md` (one bullet each: page, claim, why uncertain) |
| Photo sources | append a line to `docs/credits-log.md`: `build/images.py --credit ... --source ...` does it, or a shell append (`echo "- 2026-10-11  media/life-7  /school-life/ plate. Source: ... <group>" >> docs/credits-log.md`). Only ever append; rewriting the whole file loses what the others appended meanwhile |
| A component that does not exist yet | your own `build/additions/<group>.css` (and `<group>.js` for behaviour), documented in `docs/additions/<group>.md` (section 10). Nobody edits `pages.css` or `inner.js` any more: six agents writing one file lose each other's work |

You never edit: `build/nav.json`, `build/shell.py`, `build/build.py`, `build/check.py`, `build/media.py`, `build/htmlutil.py`, `site/index.html`, `site/css/*.css`, `site/js/*.js`, `docs/consent-cleared.txt`, another agent's page or additions. If you need a page added, a label or a description changed, or a behaviour that is not here, ask the Foundation (the coordinator).

The set of pages is fixed in `build/nav.json`: 43 pages, P03 (the Principal's welcome) is not built. You may read it; it lists every page's slug, label, title, template and SEO description.

## 2. How a page is built

A page is one file: a **front matter block**, then the **body** (the sections inside `<main>`). The shell adds everything else: the head (title, description, canonical, Open Graph, Twitter, icons, JSON-LD, the shell stamp), the skip link, the header, the full-screen menu, the **breadcrumb and the hero** (from the front matter), the footer and the phone bar. Comments of the form `<!-- CONFIRM: ... -->` stay in your source and are removed from the published HTML (the build prints how many it saw).

```
build/pages/learning/junior.html   ->   site/learning/junior/index.html   ->   https://playpen-school.vercel.app/learning/junior/
```

Slug rules: `/a/b/` is `build/pages/a/b.html`. A page that has children may also be `build/pages/a/index.html` (the hubs use this). A file whose slug is not in `nav.json` is an error, with a suggestion.

### Front matter

```
---
title: Junior School: Class I to III
description: Junior School at Playpen, Classes I to III: English, Bengali and Mathematics, library lessons for every level, and how to join.
standfirst: Classes I to III. English, Bengali and Mathematics, and library lessons for every level.
---
<section class="page-section" ...>
```

A line is `key: value`. Quotes are optional (they are removed only when one pair wraps the whole value: `title: "Class I" to "III"` keeps its quotes). A line that starts with a space continues the line above. Unknown keys, a key written twice and a date that is not `2026-10-11` are errors.

| Key | Needed | What it does |
|---|---|---|
| `title` | no (nav.json has it) | The page title. Shown as `<title>` with the suffix ` \| The Playpen School, Dhaka`, and the default H1. Plain text: write `&`, not `&amp;` (entities are decoded, then escaped once). |
| `description` | no (nav.json has it) | The meta description, 60 to 170 characters (the build warns outside that range). Write a better one if yours differs from nav.json. Plain text, no entities. |
| `h1` | no | A different H1 from the title. HTML allowed: one `<em>` word at most (more is an error; it turns maroon italic, like the home). |
| `standfirst` | no | One or two sentences under the H1. HTML allowed (links). |
| `eyebrow` | no | Replaces the group name in the hero's rule (the line above the H1). Normally leave it: the shell writes "Page 02 of 06 / Learning" (a hub shows just the group name). "Sheet" is kept for the numbered sections inside a page, as on the home. |
| `hero_image`, `hero_alt`, `hero_caption`, `hero_n`, `hero_sizes` | no | A full-width plate under the hero: the photograph that opens the page. `hero_image` is a stem like `media/ascent-5` or `img/elementary-hero`; `hero_alt` is required with it and must say what is seen (not "image of ..."). `hero_n` is the plate number ("01"). The plate is 21:9 on a desktop, 16:9 on a tablet and 4:3 on a phone, cropped from the centre: make a wide crop with `build/images.py --ratio 21:9 --focus x,y` (section 6) when the frame is not already wide. Give every page of a group a different first photograph, and never the home's cover or its Ground frame. |
| `breadcrumb` | no | Override: `Home=/ ; About=/about/ ; History`. The last item has no link. |
| `template` | no | `T01`..`T12`. Normally nav.json's. |
| `og_image`, `og_alt` | no | A 1200 x 630 JPG under `site/assets/` for social previews. Default: the home's card. |
| `schema` | no | `school`, `about`, `contact`, `collection`, `faq`, `article`, `webpage`. `faq` builds FAQPage JSON-LD from your `<details class="accordion__item">`. |
| `noindex` | no | `true` keeps the page out of search engines, the sitemap and the search index. |
| `actions` | no | `false` hides the phone bar on this page (forms and the contact page do). |
| `date`, `updated`, `lastmod` | no | `YYYY-MM-DD`, validated. Articles (JSON-LD) and the sitemap's `<lastmod>`, which is written only when the page gives one of these (never from a file's modification time, so a build is the same on every machine). |

### The hero comes from the front matter

You do **not** write the page header. The shell writes: breadcrumb, the rule with the page's place in its group ("Page 02 of 06"), the `<h1>`, the standfirst and the plate. So the body starts with the first section.

If a page needs a different opening, leave `h1:` out and write your own `<h1>` in the body (inside a `.band`). The build then adds the breadcrumb above it. A page has exactly one H1: two (front matter `h1:` plus a body `<h1>`) is an error.

### A body is a stack of sections

```html
<section class="page-section" aria-labelledby="history-intro">
  <div class="band">
    <div class="sheet-rule"><i class="sheet-rule__line" aria-hidden="true"></i><span class="sheet-rule__n">{{no}}</span><span class="sheet-rule__title">The beginning</span><span class="sheet-rule__purpose">Optional: one line, dropped on phones</span></div>
    <h2 id="history-intro" class="section-title">A sentence that names the section.</h2>
    <div class="prose" data-reveal>
      <p>...</p>
    </div>
  </div>
</section>
```

- `section.page-section` is one band of the page. Variants: `page-section--tint` (a quiet recessed panel, half way to `--paper-2`, no hairlines; **at most one per page**, because the home separates its sheets by space and the sheet rule, not by boxes), `page-section is-night` (the dark ground of the home's ledger and footer; use once at most; the page then has two dark blocks, this one and the footer. The CTA band is light, so the footer is otherwise the only dark block).
- `.band` is the wide column (page margins, at most 1600 px). `.band--narrow` keeps the left edge and a 60 rem measure.
- `.sheet-rule` is the house device: a hairline, the section number and its name. `{{no}}` writes `01`, `02`, ... in order. The hero's rule carries the page's place in its group ("Page 02 of 06"). The rule's name says what the section is; the heading under it says something else (not the same words twice).
- Every section has a heading (`h2.section-title`, or `h2.visually-hidden` when the content speaks for itself) and `aria-labelledby` pointing at it. Headings go in order: H1 (hero), H2 (sections), H3 inside.
- `data-reveal` on a block makes it rise once as it scrolls into view (content is visible without JavaScript and with reduced motion). On a list, `data-reveal-group` rises the children one after another.
- Spacing is automatic: plain sections touch, tinted and night sections carry their own padding.

---

## 3. Tokens

Tokens are written `{{name}}`, `{{name:argument}}` or `{{name attr="value"}}`. The build replaces them. An unknown token, an unknown link target or a missing file stops the build with the line number.

| Token | Gives | Example |
|---|---|---|
| `{{link:/path/}}` | The correct relative URL to a page in nav.json, from wherever your page is. Optional `#anchor`. | `<a href="{{link:/admissions/faq/#q-fees}}">` |
| `{{asset:path}}` | The relative URL of a file under `site/assets/`. The file must exist. | `href="{{asset:img/form.pdf}}"` |
| `{{img src="..." alt="..." sizes="..."}}` | A responsive `<picture>` (AVIF, WebP, JPG, srcset, width, height, lazy). See "Images". | |
| `{{no}}` | The next section number, `01`, `02`, ... | `<span class="sheet-rule__n">{{no}}</span>` |
| `{{children:/about/}}` | Chapter cards for the pages whose parent is `/about/`, in nav.json order. Options: `template="T04"` (only that template), `not="T04"`, `level="2"` (heading level, default 3). `{{children:group=community}}` takes a menu group. | see section 4.5 |
| `{{phones}}`, `{{phones:all}}` | The phone lines by section, exactly as on the home (`:all` adds the further-queries line). It is a list: never put it inside a `<p>`. | |
| `{{phone:pg-1}}` | One number as a `tel:` link with the house's gold underline (`class="link"`). Keys: `pg-1`, `ii-vi`, `vii-xii`, `further`, `call`. `class="..."` replaces the class (a contact card uses `contact-card__tel`). | `call {{phone:ii-vi}}`, `{{phone:pg-1 class="contact-card__tel"}}` |
| `{{address}}`, `{{maps_url}}` | The address line, the Google Maps URL. | |
| `{{map}}` | The "Map" link: a new tab, `rel="noopener"`, with its hidden "(opens Google Maps in a new tab)". `label="..."` renames it. | `{{map}}` |
| `{{hours}}`, `{{hours:between}}` | "9.00 am to 1.00 pm", and "between 9.00 am and 1.00 pm" (so a sentence reads right). | `Lines are open {{hours}}.` `Call {{hours:between}}.` |
| `{{ext:portal}}`, `{{ext:pay}}` | The portal and the online fee payment: new tab, `rel="noopener"`, the quiet "current site" tag and the hidden "(opens in a new tab)". `label="..."` renames the link. | `<li>{{ext:portal}}</li>` |
| `{{ext href="..." label="..."}}` | Any other outside address the school's pages may keep (the admission form, the mission statement, files under `/wp-content/uploads/`): `href` must be on the `external_ok` list in nav.json. Anything else is an error. | `{{ext href="https://playpen.edu.bd/admission-procedure/" label="Download the form"}}` |
| `{{cta}}` | The closing band: "Come and see the school." and the three admissions actions. Optional `heading="..." text="..."` (plain text). Put it last. | |
| `{{sitemap}}` | The human sitemap (used by /sitemap/). A list of sections: never inside a `<p>`. | |
| `{{breadcrumb}}` | The breadcrumb (only needed in a page with its own `<h1>`). | |
| `{{root}}` | The relative path back to the site root (`../../`). Rarely needed. | |

Token attributes are plain text: `alt="Tom & Jerry"` and `alt="Tom &amp; Jerry"` both come out right.

**The facts are written once, in nav.json.** Never type a phone number, the hours or the address: use `{{phone:...}}`, `{{phones}}`, `{{hours}}`, `{{address}}`. The checker rejects a `tel:` or a typed number that is not one of the school's, hours written next to the admissions line ("call", "phone", "admissions") that differ from nav.json's (other hours, such as a school-day timetable, are yours to state), and an address that is not nav.json's. Never type `https://playpen.edu.bd/...` for a page that exists here: use `{{link:}}` (the checker names the replacement). The checker also rejects every other outside address (`https://example.org/`, a social network, a hot-linked image): the school's pages link only to its own resources, the portal, Google Maps and the designer.

---

## 4. Components

Every component below is in `site/css/pages.css`, built from the home's tokens (paper `#F5F1EA`, ink `#1C1715`, maroon `#8A0204`, gold and clay hairlines, Newsreader and Hanken Grotesk). Maroon is the one primary button; gold is lines and numbers. Do not add colours, shadows, gradients, rounded cards or icons.

### 4.1 Fact strip (`dl.fact-strip`)

Three to five labelled facts side by side (stacked on phones). Use it right after the hero on hubs and stage pages. Each value is short; put a smaller line in `<small>`.

```html
<dl class="fact-strip" data-reveal>            <!-- fact-strip--3 / --5 for three or five columns -->
  <div class="fact"><dt>Classes</dt><dd>Playgroup, Nursery, KG I and KG II</dd></div>
  <div class="fact"><dt>Section head</dt><dd>Mrs Sharmin Hoque<small>Vice Principal, Playgroup to Class V</small></dd></div>
</dl>
```

Accessibility: it is a real description list, so the labels are read with the values. Numbers need their label ("A Level since", not just "2013").

### 4.2 Prose (`div.prose`)

The reading column: 65 characters, Newsreader 18 px (20 px from 1440). Plain `p`, `h2`, `h3`, `ul`, `ol`, `strong`, `a`, `hr` inside it are styled. Links need no class. Do not put components inside it.

```html
<div class="prose" data-reveal>
  <p>Playpen is an English-medium school in Bashundhara R/A, Dhaka. <a href="{{link:/learning/}}">See how the four stages fit together.</a></p>
  <h3>A smaller heading</h3>
  <ul><li>One idea to a line</li></ul>
</div>
```

Rules: sentence case, plain warm sentences, no exclamation marks, no hype. Link text says where it goes ("How to apply", never "click here", "read more", "here"). `prose--small` for 17 px, `small-print` for a 14 px note.

Links outside `.prose`: a plain `<a href>` inside a paragraph, a definition, a table cell or a caption (a callout, a process step, an answer, a person's note) gets the same gold hairline, so write `<a class="link" href="...">` or leave the class off: both look the same. The one thing never to do is leave a link unstyled by some other markup (a `<span onclick>`, a link with `style=`).

### 4.3 Layout helpers

```html
<div class="layout">                                   <!-- main column and an aside from 1024 px -->
  <div class="layout__main">...</div>
  <div class="layout__aside layout__aside--sticky">...</div>
</div>

<div class="split split--center">                      <!-- text and one figure; split--reverse puts the figure first -->
  <div class="split__text">...</div>
  <figure class="plate split__figure">...</figure>
</div>
```

Spacing helpers: `mt-m` and `mt-l` (margin-top), `stack` (vertical rhythm), `cluster` (a row that wraps). `section-title`, `section-lead` are the heading and lead styles.

### 4.4 Figures and plates (`figure.plate`)

Every photograph sits on a paper mount with a numbered caption. Number the plates on the page from 01.

```html
<figure class="plate" data-reveal>
  <div class="plate__frame">{{img src="media/ascent-1" alt="Courtyard between the brick wings seen from above, with a black-and-white chequerboard floor." sizes="(min-width: 900px) 40vw, 100vw"}}</div>
  <figcaption class="plate__cap"><span class="plate__n">02</span>The courtyard between the wings, 2024</figcaption>
</figure>
```

`data-reveal` on the figure gives it the home's curtain: with JavaScript the frame is unveiled from the bottom as it scrolls into view and the picture settles from a slight zoom; without JavaScript, with reduced motion and in print it is simply there.

Crops: `plate--16x9`, `plate--3x2`, `plate--4x3`, `plate--4x5`, `plate--21x9` on the `figure`. A full-bleed band between sections:

```html
<div class="figure-band">
  <figure class="plate plate--bleed" data-reveal>
    <div class="plate__frame">{{img src="media/life-7" alt="..." sizes="100vw"}}</div>
    <figcaption class="plate__cap"><span class="plate__n">05</span>Annual Sports Day, the field, January 2026</figcaption>
  </figure>
</div>
```

The hero's own plate comes from the front matter (`hero_image`). Captions say what and when ("The library, 2024"), never "Image of". Alt text describes what is seen, in one sentence; `alt=""` only for pure decoration.

### 4.5 Chapter cards (`{{children:...}}`, `ul.chapter-cards`)

The whole card is one link (the heading's link is stretched over it). Use `{{children:}}` on a hub so the cards can never fall out of step with nav.json. Cards are numbered, titled with the page label and described with its one-line `summary` from nav.json.

```html
<h2 id="about-more" class="section-title">More about the school.</h2>
<div class="mt-m">
  {{children:/about/}}
</div>
```

Hand-written cards (for a subset or other wording) use the same markup:

```html
<ul class="chapter-cards">
  <li class="chapter-card" data-reveal>
    <span class="chapter-card__n">01</span>
    <h3 class="chapter-card__title"><a class="chapter-card__link" href="{{link:/about/history/}}">History</a></h3>
    <p class="chapter-card__text">The school in dates, from the first O Level candidate to the move into its own building.</p>
    <span class="chapter-card__go" aria-hidden="true"></span>
  </li>
</ul>
```

`chapter-cards--2` and `--4` change the column count. Use level `h3` under an `h2`. One link per card, with descriptive text.

### 4.6 Stage cards (`ul.stage-cards`)

The home's four stage plates as a list, for the Learning hub and anywhere the stages are compared. Reuse the home's `stage` markup; the name is the one link.

```html
<ul class="stage-cards" data-reveal-group>               <!-- stage-cards--3 for three columns -->
  <li class="stage">
    <figure class="plate"><div class="plate__frame">{{img src="media/learning-1" alt="..." sizes="(min-width: 1024px) 22vw, (min-width: 560px) 45vw, 100vw"}}</div><figcaption class="plate__cap"><span class="plate__n">01</span>Elementary morning on the field, January 2026</figcaption></figure>
    <p class="stage__n label">01</p>
    <h3 class="stage__name display-m"><a href="{{link:/learning/elementary/}}">Elementary</a></h3>
    <p class="stage__classes label">Playgroup, Nursery, KG I, KG II</p>
    <p>The first classrooms. Admission by assessment; no uniform until KG I.</p>
  </li>
</ul>
```

### 4.7 Pager (`nav.pager`)

Previous and next page of a set (the five stages, the chapters of a story). One side may be missing.

```html
<nav class="pager" aria-label="Stages">
  <a class="pager__link pager__link--prev" href="{{link:/learning/}}"><span class="pager__label">All stages</span><span class="pager__title">Learning at Playpen</span><span class="pager__sub">One path from Playgroup to A Level</span></a>
  <a class="pager__link pager__link--next" href="{{link:/learning/junior/}}"><span class="pager__label">Next stage</span><span class="pager__title">Junior School</span><span class="pager__sub">Classes I to III</span></a>
</nav>
```

### 4.8 Pull quote (`figure.pull-quote`)

Only a quotation someone actually said or wrote, with its source. Never invent, paraphrase inside quote marks, or attribute to "a parent". The school's mission statement is the model. The first paragraph is set large (28 to 72 px, like the home's quote); keep it to one sentence.

```html
<figure class="pull-quote" data-reveal>
  <blockquote cite="https://playpen.edu.bd/mission-vision-and-values/">
    <p>It is essential that children understand their own history and culture, as well as appreciate the traditions of other people and places.</p>
    <p>They must also have a firm grasp of language ...</p>
  </blockquote>
  <figcaption><cite>From the school's {{ext href="https://playpen.edu.bd/mission-vision-and-values/" label="statement of mission, vision and values"}}.</cite></figcaption>
</figure>
```

### 4.9 Timeline (`ol.timeline`)

Dated entries on an engraver's rail. Dates are absolute. A year alone is large; a full date uses `timeline__date--sm`.

```html
<ol class="timeline" data-reveal-group>
  <li class="timeline__item">
    <time class="timeline__date" datetime="2013">2013</time>
    <div class="timeline__body"><h3 class="timeline__title">A Level classes begin</h3><p>The school completes the path from Playgroup to A Level.</p></div>
  </li>
  <li class="timeline__item">
    <time class="timeline__date timeline__date--sm" datetime="2018-07-19">19 July 2018</time>
    <div class="timeline__body"><h3 class="timeline__title">The move to the new building</h3><p>...</p></div>
  </li>
</ol>
```

### 4.10 Process steps (`ol.process`)

Numbered steps, any count. `process--row process--3` (or `--4`, or none for five) lays three to five steps in columns from 1024 px.

```html
<ol class="process process--row process--3" data-reveal-group>
  <li class="process__step"><span class="process__n">01</span><div class="process__body"><h3>Call or visit.</h3><p>Call the admissions line, {{phone:pg-1}}, {{hours:between}}.</p></div></li>
  <li class="process__step"><span class="process__n">02</span><div class="process__body"><h3>Assessment or test.</h3><p>...</p></div></li>
</ol>
```

Step titles name an action ("Collect the form."), not a topic.

### 4.11 Accordion and FAQ (`details.accordion__item`)

Native `details`/`summary`, so it works with the keyboard, without JavaScript and in print (all answers open). The question is an `h3` inside the summary. Give each item an `id`: a link to `#q-fees` opens it and scrolls to it. Group questions under `h2.label.accordion-group__title` headings.

```html
<div id="faq" data-accordion-scope>
  <div class="accordion__controls"><button class="link link--btn" type="button" data-accordion-toggle="faq">Expand all</button></div>
  <section class="accordion-group" id="g-fees" aria-labelledby="g-fees-h">
    <h2 id="g-fees-h" class="label accordion-group__title">Fees and payment</h2>
    <div class="accordion">
      <details class="accordion__item" id="q-fees">
        <summary class="accordion__summary"><h3 class="accordion__q">What are the fees?</h3><span class="accordion__icon" aria-hidden="true"></span></summary>
        <div class="accordion__body"><p>The school explains fees after a child has been selected.</p></div>
      </details>
    </div>
  </section>
</div>
```

The "Expand all" button is shown only when JavaScript runs; it carries `aria-controls` (the scope's id) and `aria-expanded` for you. `data-accordion="single"` on a container opens one item at a time. With `schema: faq` in the front matter the questions and answers become FAQPage structured data. Answer only what the school's sources say; where they say nothing, say so and give the number to call (see the FAQ pilot).

### 4.12 Tables (`div.table-wrap > table.table`)

`<th scope>` is required on every header cell (the checker fails without it). The wrapper scrolls sideways on a phone, or add `table--stack` and a `data-label` on each `td` to turn rows into small cards under 640 px.

```html
<div class="table-wrap" data-reveal>
  <table class="table table--stack">
    <caption>Entry points</caption>
    <thead><tr><th scope="col">Stage</th><th scope="col">Classes</th><th scope="col">How the child is assessed</th></tr></thead>
    <tbody>
      <tr><th scope="row">Elementary</th><td data-label="Classes">Playgroup to KG II</td><td data-label="How the child is assessed">An assessment for Playgroup and Nursery; a written test from KG I</td></tr>
    </tbody>
  </table>
</div>
```

Numbers right-aligned with `class="num"`. Never put a number in a table without its year and its source line (results, fees). A table that scrolls sideways on a narrow screen becomes a keyboard stop named by its `<caption>` (so give every table a caption); the test runs again when the screen is turned or zoomed.

### 4.13 Callout (`div.callout`)

A short note with a gold edge; `callout--important` has a maroon edge for what must not be missed (use rarely). Always a label.

```html
<div class="callout" data-reveal>
  <span class="callout__label label">Uniform</span>
  <p>There is no uniform for Playgroup and Nursery. A uniform is compulsory from KG I.</p>
</div>
```

### 4.14 Contact cards and phone lines

```html
<ul class="contact-cards" data-reveal-group>                 <!-- contact-cards--2 / --4 -->
  <li class="contact-card"><h3>Playgroup to Class I</h3><p>{{phone:pg-1 class="contact-card__tel"}}</p><p>Admissions line, {{hours}}</p></li>
</ul>

{{phones}}        <!-- the three lines as a hairline list; {{phones:all}} adds further queries -->
```

The numbers come from `{{phone:key}}` and `{{phones}}`, never from your keyboard: the checker rejects a typed number that is not one of the school's.

### 4.15 List rows: notices, events, news (`ul.rows`)

The whole row is one link. Dates are absolute and in a `<time>`. Tags are optional.

```html
<ul class="rows">
  <li class="row" data-tags="admissions">
    <time class="row__date" datetime="2026-10-22"><span class="row__day">22</span><span>Oct 2026</span></time>
    <div class="row__body">
      <p class="row__kicker label">Notice</p>
      <h3 class="row__title"><a href="{{link:/notices/}}">Parent-teacher meeting, Classes IV to VII</a></h3>
      <p class="row__text">One line of summary.</p>
    </div>
  </li>
</ul>
```

An expired notice gets `row--expired` **and** the word "Expired" in its kicker (`<p class="row__kicker label">Expired notice</p>`): the class only quietens the row (85 % opacity, contrast stays above 4.5:1), the word is what says so. Invent no dates: a notice or an event comes from the school.

### 4.16 Filter chips (`[data-filter-scope]`)

Buttons filter rows or cards by tag. Items carry `data-tags="a b"` and can be any block (a row, a chapter card, a person, a timeline entry, a gallery item: the script sets `hidden` and the stylesheet hides every kind). The status line is announced; an empty message appears when nothing matches. For a second dimension add `data-filter-key="year"` on its chips and `data-year="2025"` on the items.

```html
<div class="band" data-filter-scope>
  <ul class="chips" aria-label="Filter by kind">
    <li><button class="chip" type="button" data-filter="all" aria-pressed="true">All</button></li>
    <li><button class="chip" type="button" data-filter="notice" aria-pressed="false">Notices</button></li>
  </ul>
  <p class="chips__status" role="status" aria-live="polite"></p>
  <ul class="rows"> <li class="row" data-tags="notice">...</li> </ul>
  <p class="filter-empty">Nothing matches that filter.</p>
</div>
```

### 4.17 Article and event box

```html
<div class="layout">
  <article class="layout__main">
    <p class="article__meta"><span>News</span><time datetime="2026-01-24">24 January 2026</time></p>
    <h2 id="a-title" class="section-title mt-m">Annual Sports Day 2026</h2>
    <div class="article__body prose"><p>...</p></div>
  </article>
  <aside class="layout__aside">
    <div class="event-box"><h2>Details</h2><dl><dt>Date</dt><dd>24 January 2026</dd><dt>Venue</dt><dd>The school field</dd></dl></div>
  </aside>
</div>
```

### 4.18 Gallery and lightbox (`ul.gallery[data-gallery]`)

Each link points to the large file; with JavaScript it opens a keyboard-operable viewer (Left and Right arrows, Escape, focus returns to the thumbnail); without it, the link opens the image.

```html
<ul class="gallery" data-gallery>
  <li class="gallery__item">
    <a class="gallery__link" href="{{asset:media/life-1-1440.jpg}}" data-lightbox data-caption="Annual Sports Day from above, January 2026">
      <span class="gallery__frame">{{img src="media/life-1" alt="Students in red kneeling in a formation on the white-lined field, seen from above." sizes="(min-width: 1024px) 30vw, (min-width: 560px) 45vw, 100vw" widths="960"}}</span>
    </a>
    <p class="gallery__cap">Annual Sports Day from above, January 2026</p>
  </li>
</ul>
```

Photographs of identifiable children need the school's written consent: see the image catalogue.

### 4.19 People (`ul.people`)

Text first: a role, a name and the classes looked after. A portrait is optional and only with consent. Never invent a biography.

```html
<ul class="people" data-reveal-group>                         <!-- people--2 / --4 -->
  <li class="person"><p class="person__role">Vice Principal</p><h3 class="person__name">Mrs Sharmin Hoque</h3><p class="person__scope">Playgroup to Class V</p></li>
</ul>
```

Group several lists with `div.people-group` and an `h2.label.people-group__title`. With a portrait add `<figure class="person__photo plate plate--flat">{{img ...}}</figure>` first inside the `li`.

### 4.20 Forms and the prototype notice

There is no mail server behind any form. Every form validates in the browser and then shows `.form-notice` with the school's phone numbers; it never says anything was sent, and says so before you type. The notice is yours to place; its first paragraph is filled in by the script if you leave it empty.

```html
<p class="form-note">This form is a prototype. It checks what you type, then shows the school's numbers. Nothing is sent.</p>
<form class="page-form" data-prototype-form novalidate action="#" method="post">
  <div class="form-row form-row--2">
    <div class="field"><label for="f-name">Parent's name</label><input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="f-name-err"><p id="f-name-err" class="field__error" aria-live="polite"></p></div>
    <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required aria-describedby="f-phone-err"><p id="f-phone-err" class="field__error" aria-live="polite"></p></div>
  </div>
  <div class="field"><label for="f-class">Child's class of entry</label><select id="f-class" name="class" required aria-describedby="f-class-err"><option value="">Choose a class</option><option>Playgroup</option></select><p id="f-class-err" class="field__error" aria-live="polite"></p></div>
  <fieldset class="field-group" data-required><legend>How should we reply?</legend>
    <label class="choice"><input type="radio" name="reply" value="phone"> By phone</label>
    <label class="choice"><input type="radio" name="reply" value="visit"> I would like to visit</label>
    <p class="field__error" aria-live="polite"></p>
  </fieldset>
  <div class="field"><label for="f-msg">Message (optional)</label><textarea id="f-msg" name="message" rows="4"></textarea></div>
  <button class="btn btn--primary" type="submit"><span class="btn__label">Send enquiry</span></button>
</form>
<div class="form-notice" role="status"><p class="form-notice__text"></p>{{phones}}</div>
<noscript><div class="form-note"><p>This form needs JavaScript. Please call the line for your child's section:</p>{{phones}}</div></noscript>
```

Rules: a visible `<label for>` on every field (the checker fails otherwise); an error element `#<id>-err` per field; the button names the outcome ("Send enquiry", "Book a visit"), never "Submit"; ask for as few fields as you can. Put `actions: false` in the front matter of form pages. `{{phones}}` is a list, so it never goes inside a `<p>` (that is why the no-script note is a `div` holding a `p`; the build explains the error if you forget). A single required checkbox (a consent line) works with `required` on the input; a group of radio buttons needs `<fieldset class="field-group" data-required>`. The default notice reads its hours from nav.json (the page's `data-hours`), so the text never goes stale.

### 4.21 Where next? (`div.where-next`)

Role routing at the foot of a page: two to four columns of two to four links.

```html
<section class="page-section" aria-labelledby="wn-title">
  <div class="band where-next">
    <div class="sheet-rule"><i class="sheet-rule__line" aria-hidden="true"></i><span class="sheet-rule__n">{{no}}</span><span class="sheet-rule__title">Routes</span></div>
    <h2 id="wn-title" class="where-next__title">Where next?</h2>
    <div class="where-next__grid">                                  <!-- where-next--3 for three columns -->
      <div class="where-next__col"><h3>New families</h3><ul><li><a class="link" href="{{link:/admissions/visit/}}">Book a visit</a></li></ul></div>
    </div>
  </div>
</section>
```

The About pilot has the full four-column version (new families, current parents, former pupils, teachers).

### 4.22 CTA band (`{{cta}}`)

The last thing on most pages: "Come and see the school." with Book a visit, Enquire and How to apply. It is a **light sheet** closed by an ink rule, like the home's "Visit, enquire, apply", so the footer is the only dark block at the end of a page. Write `{{cta}}` after the last section; do not repeat the actions elsewhere on the page. Do not use it on the pages that already are the action (visit, enquire, contact). `heading="..."` and `text="..."` are plain text.

### 4.23 Small lists

```html
<dl class="dl"><div class="dl__row"><dt>Term</dt><dd>A definition on a hairline row.</dd></div></dl>

<ul class="doc-list">                                           <!-- downloads: name, type, size, date -->
  <li>{{ext href="https://playpen.edu.bd/admission-procedure/" label="Admission form"}}<span class="doc-list__meta">PDF</span></li>
</ul>

<ul class="checklist"><li>The completed admission form</li></ul>            <!-- what to bring -->
<ul class="tag-list"><li>Functional English</li><li>Group work</li></ul>      <!-- short items in even columns, each led by a gold dash -->
<ul class="link-list"><li><a class="link link--arrow" href="{{link:/admissions/faq/}}">Admissions FAQ</a></li></ul>
```

A `<p class="label">` straight above a `tag-list`, `link-list`, `chips` or `doc-list` sits 14 px over it; you need no spacing class.

### 4.24 Story pages: chapter navigation (`.story`, `.chapter-nav`)

For the long pages (history, campus, Cambridge pathway, culture and service): a sticky index on the left from 1024 px, a scrolling row of links under the header on phones. It highlights the chapter on screen.

```html
<div class="story">
  <nav class="chapter-nav" aria-label="Chapters"><ol><li><a href="#c-beginning">The beginning</a></li><li><a href="#c-building">The building</a></li></ol></nav>
  <div class="story__chapters">
    <section class="story-chapter" id="c-beginning" aria-labelledby="c-beginning-h"><h2 id="c-beginning-h" class="section-title">The beginning</h2>...</section>
    <section class="story-chapter" id="c-building" aria-labelledby="c-building-h"><h2 id="c-building-h" class="section-title">The building</h2>...</section>
  </div>
</div>
```

The chapter class is **`story-chapter`**. Never write `class="chapter"`: that name belongs to the home's Ascent scene, and `css/main.css` gives it `opacity: 0; pointer-events: none` from 1024 px, so a story page written with it is blank on a desktop (the checker refuses it). The FAQ pilot uses the same index (with `accordion-group` instead of `story-chapter`). A chapter target must carry the class `story-chapter` or `accordion-group`: they set the scroll margin that keeps the heading clear of the fixed header and the sticky index when a link jumps to it (an accordion question has the same margin). The current chapter is the last one whose top has passed 35% of the screen height (none above the first), looked up again on scroll and resize; on a phone the row scrolls to keep the current link in view, and returns to its start above the first chapter. On a desktop the index moves up when the header hides. In-page links jump at once; the inner pages do not use CSS smooth scrolling.

### 4.25 Night section

`<section class="page-section is-night">` turns rules, labels, numbers and links gold on the dark ground; fact strips, timelines, process steps, chapter cards and accordions all have night variants. Use it at most once per page, for the one passage that should be quiet and dark (the home uses it for the ledger of dates). The CTA band is light, so with a night section the page has two dark blocks (that one and the footer), not three. Focus rings on a night ground are amber, as on the home.

### 4.26 Links and buttons

- Inline link: `<a class="link" href="...">` (or no class inside a paragraph, a definition, a table cell or a caption: it gets the same gold hairline).
- Link to the school's own resource on the old site (portal, fee payment, admission form): use the token, `{{ext:portal}}`, `{{ext:pay}}` or `{{ext href="https://playpen.edu.bd/admission-procedure/" label="Download the form"}}`. It writes `<a class="link link--ext" href="..." target="_blank" rel="noopener">Pay fees<span class="link__site">current site</span><span class="visually-hidden"> (opens in a new tab)</span></a>`: a link that opens a new tab must say so to a screen reader, and the build and the checker fail on one that does not. Only these may stay external: `portal.playpen.edu.bd`, `/online-facility-payment/`, `/admission-procedure/`, `/mission-vision-and-values/`, anything under `/wp-content/uploads/`, Google Maps (`{{map}}`).
- Buttons: `<a class="btn btn--primary" href="..."><span class="btn__label">Book a visit</span></a>` (one per screen), `btn btn--secondary`, `btn btn--text`. They name outcomes.
- `link--arrow` adds a small arrow to a short standalone link (not inside a sentence).

---

## 5. Templates: which components go together

The component set is the same on every page; a template is a recommended order. The three pilots are the models. Photography: every page of a group opens on a different photograph, a long page carries one every screen or two (the home has about one in 600 px), and never the home's cover (`media/hero-1`) nor the frame that opens the home's Ground sheet (`media/ground-1`).

| Template | Pages | Order of sections |
|---|---|---|
| **T02 Hub** | about, learning, admissions, school-life | hero (H1, standfirst, plate) → fact strip → the argument (split with a figure) → `{{children:}}` cards (Learning: stage cards first) → where next → `{{cta}}`. Model: `about/index.html`. |
| **T03 Story** | history, campus, cambridge-pathway, culture-and-service | hero → `.story` with chapter nav → `story-chapter`s (prose, one plate, timeline or pull quote) → pager or where next → `{{cta}}`. |
| **T04 Stage** | elementary, junior, middle, senior, a-level | hero with its own wide plate (the stage's photograph) → fact strip (classes, admission, uniform, section head) → what children learn (prose and a definition list in the main column, the short list in the aside; a split with a second figure only if the stage has a second frame, never the hero's again) → who looks after the stage (people) → how to join (process row, callout) → questions (accordion, 3 to 5) → pager (previous and next stage) → `{{cta}}`. Same H2 order on every stage page, so parents can compare. Model: `learning/elementary.html`. |
| **T05 Information** | policies, careers, examinations, student-support, starting-at-playpen, sports, clubs, transport, school-day, parents, alumni, privacy, terms | hero → `layout` (prose or accordion in the main column, a contact card or links in the aside) → doc-list for documents → a "last reviewed" line (`small-print`) → where next. |
| **T06 Admissions step** | how-to-apply, fees, faq | hero → process steps / table / accordion groups → checklist → callout → `{{cta}}`. Model: `admissions/faq.html`. |
| **T07 Form** | visit, enquire, contact | hero → intro with what happens next → `form-note` + `page-form` + `form-notice` → alternative channels (contact cards, address, Map link) → no CTA band; front matter `actions: false`. |
| **T08 Listing** | news, events, notices | hero → `[data-filter-scope]` chips + `ul.rows` + `filter-empty` → a short note on where else to look. |
| **T09 Article** | (dynamic) | `article__meta`, title, plate, `article__body`, `event-box`, `related`. |
| **T10 Gallery** | gallery | hero → chips (optional) → `ul.gallery[data-gallery]` with the lightbox. |
| **T11 People** | leadership | hero → `people-group` per tier (Management, Senior leadership, Teachers-in-Charge) → note on how classes are shared out. |
| **T12 Facts and results** | results | hero → fact strip of headline figures with year and cohort → a table per year → dated achievements (named only with consent) → a method callout (what is and is not claimed) → doc-list. Nothing without a source line. |

---

## 6. Images

### Which photographs exist

`docs/image-catalogue.md` lists every photograph on the site: the 44 school photographs in `site/assets/img/`, the crops made since, and the graded set in `site/assets/media/` (the home's), with widths, subject, source and **a consent column** (which frames show identifiable children). Use frames marked "none" or "distance". Do not use a frame that carries a printed age or year count ("48 years", "40 Ruby Jubilee").

**The catalogue is enforced.** A frame whose row says "Needs consent", "Do not use", "Never use", "Avoid" or "Check with the school" (or shows `faces` without being marked acceptable) cannot be used: `{{img}}`, `hero_image` and `og_image` stop the build with the row's reason, and the checker reports the frame if it is found in the published HTML. When the school has agreed to a frame in writing, the coordinator adds its stem to `docs/consent-cleared.txt`; nobody else touches that file. Nine frames the home uses are flagged today (see `docs/confirm/foundation.md`): that is the coordinator's decision, not yours.

### Writing an image

```
{{img src="media/learning-1" alt="Hundreds of young children in yellow shirts and blue headbands on the field." sizes="(min-width: 900px) 34vw, 100vw"}}
```

- `src` is a stem or a file under `site/assets/` (`media/learning-1`, `img/campus-1.jpg`). The helper finds every file for that stem (`-480.avif`, `-960.webp`, `-1440.jpg` ...) and writes the `<picture>` with AVIF, WebP and JPG, `srcset`, the real `width` and `height`, `loading="lazy"` and `decoding="async"`. A stem with several widths needs `sizes`. Only a trailing `-` and three or four digits is read as a width, and only when the file really is that wide: `campus-1.jpg`, `campus-2.jpg` and `cie-top-2025.jpg` are names, so `src="img/campus"` finds nothing (and suggests `img/campus-1`) instead of blending three photographs into one picture.
- `alt` is required and is plain text. Describe what is seen in one plain sentence. `alt=""` only for pure decoration. The build and the checker refuse an alt that is a file name (`DSC01234.jpg`) or begins "Image of" or "Photo of", and they apply the voice rules (no banned words, no exclamation marks) to it.
- Optional: `class`, `loading="eager"` and `fetchpriority="high"` (only for the first image on a page, and only if it is above the fold), `widths="960,1440"` (use only these), `width` and `height` (when the helper cannot read them).

`sizes` recipes (what share of the screen the picture occupies):

| Layout | sizes |
|---|---|
| Full width | `100vw` |
| Split figure (about 38 % wide from 900 px) | `(min-width: 900px) 38vw, 100vw` |
| Four stage cards | `(min-width: 1024px) 22vw, (min-width: 560px) 45vw, 100vw` |
| Three-column gallery | `(min-width: 1024px) 30vw, (min-width: 560px) 45vw, 100vw` |
| Card on a hub | `(min-width: 1024px) 30vw, 100vw` |

Pages stay under 2 MB without video: load few photographs, never hot-link another site.

### Making a new crop or size

Use `build/images.py` (needs Pillow; run it with `python -I` for files from outside the repository):

```
python -I build/images.py "C:/path/to/original.jpg" campus-hall --people none --shows "The library hall, tables and shelves, no one in it" --ratio 3:2 --focus 0.5,0.4 --widths 480,960,1440 --webp --credit "The Playpen School" --source "playpen.edu.bd/wp-content/uploads/2024/03/DSC01234.jpg"
```

It writes JPG (and WebP) files into `site/assets/img/`, never upscales, and appends the credit line to `docs/credits-log.md`. Then `{{img src="img/campus-hall" ...}}`. 1920 px wide is the maximum for a full-width plate, 1600 px for anything else. It **refuses a name that already exists** (another author's crop, one of the 44 photographs, a frame named in the catalogue), so two authors can never overwrite each other and a later run with other widths can never leave stale files in a `srcset`; `--force` replaces your own earlier crop and deletes its old variants first. A wide hero from a landscape original: `--ratio 21:9 --widths 960,1440,1920`. **`--people` and `--shows` are required**: the tool appends the frame's row to `docs/image-catalogue-new.md` (what it shows; who is in it: `none`, `distance`, `from above`, `crowd`, `backs of heads`, `a painting`, `screen`, `faces`), and the build reads that file with the main catalogue. **A photograph the catalogue does not list cannot be used** (the build and the checker say so), and a `faces` frame is refused until the school has agreed in writing: so never describe a frame as `distance` that you would not want a parent to find. Never read the 1.2 GB `source-media` folder into a chat; make crops with the tool.

---

## 7. Voice and facts

- English only. Calm, warm, specific. Sentence case. No exclamation marks, no hype, no superlatives ("best", "leading", "excellence"). Never the banned words: unleash, synergy, leverage, revolutionary, game-changing, cutting-edge, best-in-class, world-class, seamlessly, robust, disrupt, ninja, rockstar, guru, journey, passionate about. (The checker fails on them outside quotations: in the text, in alt texts, titles and `aria-label`s, in the page title and in the meta tags.)
- **Facts only from the sources**: `build/_old/p_*.py` (the school's scraped copy), the plan at `playpen-school-v1/docs/full-site-plan.json` (`factsHeld` F01 to F33), `old-ref/docs/03-verification-checklist.md`, the research files. No invented number, name, date, price, quote or result.
- Founding year: "1977" appears only where the home shows it (fact strips and the ledger), never "48 years" or any age (the checker warns on both). Log it as a confirm item.
- If a fact is missing, write the page honestly without it, add `<!-- CONFIRM: what, why uncertain -->` next to the place, and one bullet to `docs/confirm/<your-group>.md`. Never write "Lorem", "TBD", "coming soon".
- Dates are absolute (`24 January 2026`). Times as the home writes them: `9.00 am to 1.00 pm`, from `{{hours}}`; in a sentence that needs "between", `{{hours:between}}` ("between 9.00 am and 1.00 pm"), never "between {{hours}}" (that reads "between 9.00 am to 1.00 pm"). Class names as the home: Playgroup, Nursery, KG I, KG II, Class I to Class XII.
- Fees: no amounts anywhere unless the school supplies them. Say how fees are explained and paid.

## 8. Accessibility checklist (AA)

- One `<h1>` (the hero); `h2` per section; no skipped levels. Landmarks come from the shell.
- Every image has `alt`, `width`, `height`. Every link has a name that makes sense alone; external links open in a new tab with `rel="noopener"`.
- Every form field has a visible label; errors are text. Tables have `<th scope>`.
- Contrast is built into the palette. Never put text on a photograph; never rely on colour alone.
- Everything is reachable and operable with the keyboard; focus rings are built in (maroon on paper, amber on the dark ground, drawn inside the link where a scrolling row would clip them). A link that opens a new tab says so (`{{ext}}` and `{{map}}` do it for you).
- **Targets are 44 px**, measured by hit-testing and not by the box: buttons, chips, accordion questions, the chapter index, the breadcrumb, the header and menu links, form fields and the footer are 44 px or more; a short standalone link (a link list, a where-next column, a document, the sitemap, the footer, a phone number) keeps its look and has an invisible 44 px hit area, which is why those lists have 19 to 23 px between rows. A link inside a sentence follows WCAG 2.5.8 (the inline exception, 24 px). A radio or a checkbox is operated through its 44 px label. If you add a list of standalone links, keep 22 px between its rows, or give the links `min-height: 44px`.
- Motion: `data-reveal` only (a block rises 28 px, a photograph is unveiled from the bottom, the page title rises through a mask); the script honours `prefers-reduced-motion` and the footer switch, which switch off exactly the same things. High-contrast mode keeps every icon and rule.
- On a phone the tracked small capitals are 12.5 px; a long web address or email wraps inside its box instead of running off the screen.

## 9. When the build or the checker complains

| Message | Fix |
|---|---|
| `unknown link target /x/: not a page in nav.json` | Use a slug from nav.json, with the trailing slash. The message suggests the closest. |
| `missing asset site/assets/...` | The file is not there; check the name (the message suggests close names). |
| `{{img ...}}: no jpg/jpeg/png file found for image ...` | Wrong stem; see `docs/image-catalogue.md`. |
| `{{img src=...}} has several widths but no sizes` | Add `sizes="..."` (table above). |
| `duplicate H1` / `the page has 0 <h1>` | Put `h1:` in the front matter or one `<h1>` in the body, not both. |
| `unknown front matter key` | A typo; the message lists the allowed keys. |
| `</div> closes <section> but <div> ... was never closed` | A tag is not closed; the message has the line. |
| `inline style ...` | Only custom properties are allowed (`style="--i:2"`). Use a component, or your own `build/additions/<group>.css`. |
| `no <script> in a page body` | Behaviour comes from `js/inner.js` through data attributes. Ask the Foundation, or write your own `build/additions/<group>.js`. |
| `--only "...": no page in nav.json starts with that path` / `no built file matches` | A typo in the selector (the message suggests the closest and lists the sections). |
| `Git Bash rewrote the argument into a Windows path` | Write the selector without a leading slash (`--only admissions/faq`), or set `MSYS_NO_PATHCONV=1`. |
| `{{img}}: ... shows identifiable children or lettering ...` | The frame is flagged in `docs/image-catalogue.md`: choose a frame marked none or distance. Do not edit `docs/consent-cleared.txt`. |
| `a link that opens a new tab must say so` | Use `{{ext:...}}`, `{{ext href=... label=...}}` or `{{map}}`, which add the hidden text. |
| `{{ext}} ... is not an outside address the site may link to`, `[external-link]` | Only the school's own resources, the portal, Google Maps and the designer; a page that exists here is linked with `{{link:}}`. |
| `</p> has no matching opening tag (a {{phones}} ... token sits inside a <p>)` | `{{phones}}`, `{{children}}`, `{{sitemap}}` and `{{cta}}` output a list or a section: put them outside the `<p>`. |
| `no inline event handlers`, `no javascript: links` | Behaviour comes from `js/inner.js`; a link goes to an address. |
| `alt text "..." looks like a file name`, `starts with "image of"` | Say what the picture shows, in one sentence. |
| `[class] class "x" has no rule ...` | A typo (the message suggests the closest class). `[class] ... belongs to the home's own scene`: use `story-chapter`, not `chapter`. |
| `[aria-ref] aria-labelledby="x" points at an id that does not exist` | Give the heading the id its section names. |
| `[phone]`, `[hours]`, `[address]` | A typed number, hours or address that is not nav.json's: use the tokens. |
| `[stale-shell] built with an older menu, footer or head` | `build/nav.json` or `build/shell.py` changed after this page was built: run `python build/build.py`. |
| `[empty] the page has almost no content` | Write the sections of the page's template. |
| `[consent]` | A built page uses a flagged photograph (on the home: the coordinator has not yet decided on the nine frames). |
| `[age-count]`, `[founding-year]` | Warnings: the site prints no age count, and "1977" only where the home does. |
| `heading level jumps` | An error on inner pages: h2, then h3, never h2 then h4. |
| `link text "here" says nothing` | Name the destination. |
| `tel:... is not one of the school's numbers` | Use `{{phone:...}}` or `{{phones}}`. |
| `link to the old site ...; this page now exists: use {{link:...}}` | Replace it. |
| `banned word`, `exclamation mark` | Rewrite the sentence. |
| `draft stub: this page has no source yet` | Not yours until you write `build/pages/<slug>.html`. |

`python build/check.py --strict` (used at integration) also fails on drafts, missing pages and warnings. Warnings mean: fix them unless you can say why not.

## 10. Additions: a component or behaviour that does not exist yet

Several agents write pages at the same time, so nobody edits `site/css/pages.css` or `site/js/inner.js` any more (two agents saving the same file lose each other's work, and nothing would notice). Each page group has **its own files**:

| File | What it is | Where it ends up |
|---|---|---|
| `build/additions/<group>.css` | your extra rules | joined, in file-name order, into `site/css/pages-additions.css`, which every page loads after `pages.css` |
| `build/additions/<group>.js` | your extra behaviour | joined into `site/js/pages-additions.js`, which every page loads after `inner.js` (each file in its own function and its own `try`, so one group's error stops no other group's script) |
| `docs/additions/<group>.md` | the entry for each component: what it is for, the markup snippet, the rule for its use | read by the coordinator and the next author |

`<group>` is the name you use for `docs/confirm/<group>.md` (`learning`, `admissions`, `school-life` ...). `python build/build.py` rebuilds both generated files every time (also with `--only`), so you see your rules at once. **Never edit the two generated files**: they begin with a comment that says so and are overwritten on the next build.

The build checks your files before it joins them and leaves a broken one out, with an error naming the file: an unclosed `{` or comment in the CSS (it would swallow every group's rules after it), a syntax error in the JavaScript (checked with `node --check`). It warns about a hex colour.

Rules: prefix every class with the component's own name (`.fee-table`, never `.table2`), mobile first, tokens only (`var(--ink)`, never `#1C1715`), a comment above each block with the page, the component and the date. Touch targets 44 px, focus rings kept, a `prefers-reduced-motion` rule for any motion. In the script use the page's own helpers and wait for the page: `PP.ready(function () { var box = PP.$('.fee-table'); PP.on(box, 'click', ...); })`. `PP.$`, `PP.$$`, `PP.on`, `PP.raf`, `PP.store`, `PP.root` and `PP.reduced()` exist; a block outside `PP.ready` runs before the page's own code. The checker's class list reads `pages-additions.css`, so your classes are known to it.

The entry in `docs/additions/<group>.md`:

```
### <component name> (page, date, your group)
What it is for. The markup snippet. Any rule for its use.
```

*(No additions yet.)*
