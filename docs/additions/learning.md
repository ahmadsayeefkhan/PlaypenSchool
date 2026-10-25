# Additions: learning group

Rules and file names are in `docs/COMPONENTS.md`, section 10. Styles: `build/additions/learning.css`. Script: `build/additions/learning.js` (added 2026-10-24: the ring draw and the counter). Every learning page carries `body_class: lr-page` in its front matter, so the restyles below touch no other group. Prefix: `lr-`. The shared inner-page kit proposed in `redesign-2026-10-24-pages/research/design-language.md` (`pk-*`) was not built, so this group carries its own copies of the four pieces it needed (head, foot, panel, mounted hero); if the Foundation ships the kit, the `lr-head`, `lr-foot`, `lr-panel` and hero rules here can be deleted and the classes renamed in the ten sources.

The home's own classes reused as they are (no new CSS, markup copied from `site/index.html`): `.feats / .feat / .feat__n / .feat__t` (numbers), `.result` with `.donut`, `.grades` and `.result__subj` (the rings), `.sub` (the subject grid), `.steps / .step / .step__n` (how to join), `.venue` (the highlighted statement), `.ev-grid / .ev / .ev__card ...` (photo cards on the hub), `.stage` (stage plates), `.quote` (the mission quotation), `.display-m`, `.lead`, `.caption`, `.label`. Three hook classes in that markup have no rule in `main.css` (`donut__segs`, `grades__g`, `sub__intro`); `learning.css` gives each a harmless one so the checker accepts them.

### Mounted hero plate (all learning pages, 2026-10-24, learning)
`.lr-page .page-hero__plate` pulls the shell's bare full-bleed hero photograph back into the band and mounts it (paper-3, 12 px, clay hairline), like every photograph on the home. Phones show the frame at 3:2 (not the 4:3 strip), tablets 16:9, desktops 21:9. `body_class: lr-page lr-hero-3x2` is for a page whose photograph has no 1920 px file (the hub, Middle, A Level, Examinations, Results): the plate is capped at 1200 px wide, 3:2 on phones and 16:9 from 1024 px, so a 1200 px frame is never stretched.

### One H2 voice (all learning pages, 2026-10-24, learning)
`.lr-page .section-title` is set to the home's `.display-l` size (36 to 96 px, 300 weight from 1715 px, 18ch). `.lr-page .page-section--tint` is full `--paper-2` (pages.css mixes it to 50 %), as the home's one coloured sheet. Rule: one tint section per page (the people sheet on stage pages, the portal or lines sheet on the information pages).

### Sheet head and sheet foot (`lr-head`, `lr-foot`; 2026-10-24, learning)
The home's sheet skeleton. `lr-head`: `<div class="lr-head"><h2 class="section-title">...</h2><p class="lead" data-reveal>...</p></div>`: H2 on 10 of 12 columns, lead on 7 (54ch) from 1024 px. `lr-foot`: `<div class="lr-foot" data-reveal><p class="lr-foot__text">...</p><div class="lr-foot__action"><a class="btn btn--secondary">...</a></div><p class="lr-foot__source caption">...</p></div>`: a hairline, the sentence on 8 columns, the action right-aligned, the source caption under both. Rule: every fact-heavy section ends with a foot whose source line names where the facts come from; a foot may hold only the source.

### Panel (`lr-panel`, `lr-panels`; 2026-10-24, learning)
The home's results-card recipe as a general box: paper-3, clay hairline, a 3 px top rule (`--lr-edge`, maroon; `lr-panel--gold`, `lr-panel--ink`). Inside: `<p class="label">`, `<h3 class="lr-panel__title">`, paragraphs, a `<ul>` whose items get a gold dash, and `<p class="lr-panel__foot">` on a hairline. `<ul class="lr-panels">` lays three in a row from 1024 px (two from 640; `lr-panels--2` for two; `lr-panels--stack` keeps one column, used beside a figure in a split). Used for: the three "what changes" boxes (Middle, Senior, A Level), the three services (Student support), the three portal groups (Examinations), the "What you see in the portal" aside on every stage page.

### Contact panel (`lr-call`; stage pages, Cambridge pathway, 2026-10-24, learning)
`<div class="lr-panel lr-call" id="<pg>-call"><p class="label">The line for this stage</p><ul class="lr-call__rows"><li class="lr-call__row"><span class="lr-call__who">Playgroup to Class I</span>{{phone:pg-1 class="lr-call__num"}}</li></ul><p class="lr-call__hours">Lines are open {{hours}}.</p><div class="lr-call__actions"><a class="btn btn--primary" href="...">Book a visit</a></div></div>`. The number is a 44 px tap row (full width under 560 px) and never breaks. Rule (critique X10): one phone block per page, this one; every other mention of the line on the page is "the line for your child's class, listed above" linking to the panel's `id`, so a stage page prints each number once.

### People sheet grid (`lr-people`; stage pages, 2026-10-24, learning)
`<div class="lr-people"><div class="lr-people__list">people list</div><div class="lr-people__aside">lr-call</div></div>`: names on 8 columns, the panel on 4, from 1024 px. `lr-people__list--wide` (Middle, four people) puts the list across the row and the panel under it on 5 columns.

### Steps (`steps lr-steps lr-steps--3|--4`; 2026-10-24, learning)
The home's `.steps` list with its column count set to the page's step count from 1024 px (main.css lays five). Each `.step` carries `data-reveal`; `learning.css` draws the ink line over it when `is-in` lands (`--drawn` 0 to 1, 700 ms), at rest under `prefers-reduced-motion`. `<div class="lr-actions">` under the steps holds the secondary and text buttons. Step 01 never prints a number (see `lr-call`).

### Numbers and the counter (`feats lr-feats [lr-feats--2]`, `lr-count`; 2026-10-24, learning)
`.feats` rows as on the home; `lr-feats--2` runs them in two columns from 1024 px (the hub's six). `<span class="lr-count" data-lr-count="67">67</span>` inside `.feat__n` or `.donut__num` counts up once when it scrolls into view; the final number is in the markup, so without JavaScript, in print and with reduced motion it simply shows. Rule: every number has its source in the section's `lr-foot__source`, and the `aria-hidden` numeral is followed by the visually-hidden phrase, as on the home.

### Results panels on inner pages (`lr-results`, `lr-ring`, `lr-split`; 2026-10-24, learning)
`.result` markup copied from the home with the final `stroke-dasharray` values in the SVG (the home's `data-p`/`data-at`/`data-count` hooks are dropped: the inner script does not use them and `data-at` would be read as a typo of `data-alt`). `lr-results` is a three-column grid for the three panels (`lr-results--2` for two); `lr-split` is a 5 / 7 split for one panel beside `.feats` lines (the hub, Senior). A panel with class `lr-ring` is armed by `learning.js` (segments and bars at zero) only when motion is allowed and `IntersectionObserver` exists, and released when 25 % of it is on screen. Rule: the numbers are the home's results sheet; when it changes, `/learning/results/`, `/learning/senior/`, `/learning/a-level/`, the hub and the Examinations aside change in the same commit.

### Stage cards as a snap row (`stage-cards lr-snap`; the hub, 2026-10-24, learning)
Under 560 px the four stage plates become one sideways row that snaps (78 % of the screen each), like the home's event cards; from 560 px pages.css lays them two and four across. Use it only for the four stage cards.

### Class path (the hub, Cambridge pathway, Middle; 2026-10-11, revised 2026-10-24, learning)
The sixteen classes in a line, grouped under their four stages, as before (container query: one line from 940 px of its own width, pairs from 560 px, stacked rows under that, now with 44 px cells and tighter gaps). New: the stage names are links to the stage pages (`<p class="class-path__name"><a href="{{link:/learning/junior/}}">Junior</a></p>`, with an invisible 44 px hit area), the Senior marker reads "O Level · AS · A Level" as on the home, and `lr-path-quiet` on a stage dims it (the Middle page shows its own stage in ink and the others quiet, with "Class VIII: O Level electives chosen" under Senior as the bridge). Rule: `--n` of a stage equals its number of classes, the four add up to 16, and the page's own stage never carries a link to itself.

### Subject ledger (/learning/a-level/, 2026-10-11, learning)
Unchanged markup (`ol.subject-ledger`), now eleven items on paper, not night (the footer is the site's only dark block). The night variant stays in the stylesheet for the record.

### Compact achievements timeline (`timeline lr-timeline--compact`; /learning/results/, 2026-10-24, learning)
From 1024 px the eleven dated rows run in two columns with smaller dates and tighter rows, so the competitions do not dominate the page under the results. Filter chips work as before.

### The mission quotation in the home's style (/learning/cambridge-pathway/, 2026-10-24, learning)
The home's `.quote` markup (`quote__mark`, `quote__line display-l`, `quote__line--2 lead`, `quote__cite caption`) replaces `.pull-quote`; `learning.css` only spaces it in the story column. Rule: a real quotation with its source, nothing else.

### Bottom-anchored plate (`lr-plate--bottom`; /learning/senior/, 2026-10-24, learning)
`object-position: 50% 100%` on the plate's image: the glassware swatch (`media/swatch-4`) shows lab coats above the bench when cropped from the centre, so the Senior figure is cropped from the bottom at 3:2. **Superseded 2026-10-25:** `media/swatch-4` is refused by the catalogue (two students in lab coats, a hand); the Senior figure is the labelled AI plate `img/learning-lab-still` at 4:5 in `.lr-split--fig` (panels first on a phone, plate after; 5 / 6 columns from 1024 px), with the `.ill-tag` label.

### Telephone numbers do not break (all learning pages, 2026-10-11)
Inside `.process__body`, `.callout`, `.accordion__body`, `.prose`, `.small-print`, `.lr-panel` and `.venue`, a `tel:` link keeps `white-space: nowrap`.

Removed 2026-10-24 (no longer used by any learning page): `.subject-table`, `.pending-note`, `.learning-cards4`.

### Review fixes, 2026-10-24 (learning)
- **Hero positions** (`.lr-page.lr-hero-low`, `.lr-page.lr-hero-bottom`): `object-position` for the phone's 3:2 cut of a wide hero (Results uses `lr-hero-bottom` so the trophies stay at the lower edge). Set through the page's `body_class`.
- **Phone hero swap** (`.lr-page.lr-hero-swap` + `figure.plate.lr-hero-phone`): under 768 px the shell's hero plate is hidden and the page's own 4:3 figure (first in section 01, `aria-hidden="true"`, `alt=""`) shows in its place; from 768 px the figure is `display: none`, so its lazy image is never requested. Used on Elementary, whose 21:9 lettering cannot be cut to 3:2 (a wide frame in a 3:2 box loses its sides, not its top, so `object-position` cannot help). The shell's eager hero is still fetched on phones: that one file is the cost.
- **Paper behind plates** (`.lr-page .plate__frame { background: var(--paper-2) }`): a decoding picture never shows a white hole. The hub's four stage plates also carry `loading="eager"` and `widths="720"`.
- **Chapter navigation on phones** (`.lr-page .chapter-nav`, under 600 px): the links wrap to rows (44 px each) and `.story-chapter` gets a taller scroll margin. A group-scoped stand-in for the Foundation fix (requests item 8).
- **Disclosure** (`details.lr-disclose > summary > span > .lr-disclose__closed / .lr-disclose__open`, body in `.lr-disclose__body`): the house summary row (hairline, serif, a 44 px plus / minus box). `lr-disclose--phone` is written `open`; `learning.js` closes it under 600 px and re-opens it above, and from 600 px the summary is hidden so the content always shows. Any `.lr-disclose` opens when a link points at an id inside it (hash on load, `hashchange`, or a click on an in-page link). Results folds its subject grid at every width (closed in the markup); Senior folds the same grid on phones only.
- **More answers row** (`div.lr-more` above `nav.pager`): a label and two arrow links on a hairline row, replacing the FAQ sheet's aside on the stage pages.
- No longer used by any page (rules kept, harmless): `.lr-plate--bottom`, `.lr-people__list--wide` (Middle's four names now run two by two in the 8-column list with the lines panel beside them).
