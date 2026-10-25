# Additions: About group (/about/, history, school administration, who looks after each class, campus, child protection, policies, careers)

Styles live in `build/additions/about.css`, behaviour in `build/additions/about.js` (both joined into the generated files). Rewritten 2026-10-24 for the pages redesign: the inner page kit proposed in `redesign-2026-10-24-pages/research/design-language.md` is not built yet, so its pieces live here under the `abt-` prefix. When the Foundation ships `build/additions/0-kit.css|js`, the mapping is: `abt-head` → `pk-head`, `abt-foot` → `pk-foot`, `abt-panel` → `pk-panel`, `abt-cover` → `pk-cover` (`hero: cover`), `abt-plate` → `pk-plate`, `abt-count` → `pk-count`, the `abt-head__title` mask → `[data-pk-split]`. The two older global fixes stay at the top of the file.

### Footnote dagger on the dark ground (history, 2026-10-11, kept)
`.is-night .fn { color: var(--gold-text); }`. Markup as the home: `<a class="fn" href="#note-id" aria-label="Footnote: ...">&dagger;</a>` and a `<p id="note-id" class="caption">`.

### Caption of a stacked table (2026-10-11, kept; fixes every `table--stack`)
Under 640 px the `<caption>` of a stacked table takes the full width.

### Cover (`header.abt-cover`; /about/, /about/campus/; 2026-10-24)
A photographic hero at page scale, the home's film hero still. The page leaves `h1:` out of the front matter and writes the header in the body (the build prepends the breadcrumb). Inside: `.band > .sheet-rule.abt-cover__rule` (the eyebrow, written by hand on a child page: "Page 03 of 06 / About"), then `.abt-cover__media` with a hand-written `<picture class="abt-cover__picture">` (a `(max-width: 767px)` source for the 4:5 phone frame, WebP and JPEG, then the 21:9 desktop sources; `{{asset:...}}` for every URL; `width`, `height`, `alt`, `fetchpriority="high"`), `.abt-cover__scrim` (the home's two-direction ink scrim), and `.band.abt-cover__copy` holding `h1.abt-cover__title` (one `<em>` in the hero's lighter gold) and `p.abt-cover__lead`. Height `min(78svh, 760px)`; phones `min(92svh, 640px)` with 96 px clear under the copy. Rule: only for a hub or a page the home sends people to first; a catalogued people-free or distance frame, screened at the rendered size; never a third cover in the group. Review fixes 2026-10-24: `abt-cover--top` (the frame sits high, `object-position: 50% 30%`, Campus) and `abt-cover--low` (50 % 62 %, the hub); the scrim holds 0.55 to 58 % of the height and fades at 78 %, the left band is stronger, and the title and lead carry a text shadow, so the first H1 line passes 3:1 against the brightest quarter of the frame; `p.caption.abt-cover__cap` in a `.band` after the media is the visible one-line caption (what and when).

### Mounted hero plate (`div.band.abt-hero-plate > figure.plate.abt-plate`; 2026-10-24)
The photograph that opens a page, on the paper mount inside the band instead of the shell's bare bleed (`hero_image` is not used). `data-reveal` gives the curtain. Crops: 16:9 by default, `abt-plate--21x9`, `abt-plate--2x1`; `abt-plate--mark` is the small 3:2 plate (max 44 rem) for a page whose first screen is something else. Phones: 4:3. The first image gets `loading="eager" fetchpriority="high"`. Review fixes 2026-10-24: `abt-plate--facade` and `abt-plate--benches` set the phone crop's focus (lower part of the frame); `p.caption.abt-plate__line` after the figure is the visible one-line caption, since the build strips `plate__cap` (every mounted plate in the group carries one).

### Sheet head and foot (`div.abt-head`, `div.abt-foot`; 2026-10-24)
Head: `<div class="abt-head"><h2 class="section-title abt-head__title" data-reveal>…</h2><p class="lead abt-head__lead" data-reveal>…</p></div>`; the H2 at the home's display-l size on 10 columns, the lead on 7; `abt-head--tight` for a head with no lead. The title rises through a clip-path mask (1100 ms, the home's easing); `about.js` watches the `.abt-head` wrapper and adds `is-in` to the title (a fully clipped element never intersects, which is also why 2 px of it stay unclipped). Reduced motion and no JavaScript: the heading is simply there.
Foot: `<div class="abt-foot"><p class="abt-foot__text">…</p><p class="abt-foot__action"><a class="link link--arrow">…</a></p><p class="abt-foot__source caption">…</p></div>`: a hairline, a sentence on 8 columns, an action on the right, the source line on the page. Every fact-bearing section closes with one; `abt-foot__source` may be the only child.

### Panel (`.abt-panel`, `--gold`, `--ink`, `--quote`; `ul.abt-panels`, `--3`, `--4`; 2026-10-24)
The home's results-card recipe as a general card: paper-3, 1 px clay, a 3 px coloured top rule (maroon, gold or ink). Children: `.abt-panel__label.label`, `.abt-panel__title` (`--l` larger), `.abt-panel__text` (`--quiet`), `.abt-panel__more` (a `link link--arrow`), a `checklist`. `abt-panels` lays them in one column, two from 640 px, three or four from 1024 px; in `--3` a last card alone on its row takes the whole row. `--quote` holds a real quotation: `<blockquote class="abt-panel__quote"><p>…</p></blockquote><cite>…</cite>` (a blockquote, so the checker's age-count and banned-word rules treat it as a quotation).

### The one coloured sheet (`page-section page-section--tint abt-tint`; 2026-10-24)
Full `--paper-2`, the home's one coloured ground, instead of the 50 % mix. Both classes are needed (the tint class keeps the section's padding rules). One per page at most.

### Fact strip numbers (`section.abt-facts`, `div.fact.abt-fact--num`; 2026-10-24)
Numbers in maroon; two columns on a phone so five facts take one screen.

### Photo doors (`ul.ev-grid.abt-doors`; 2026-10-24)
The home's event cards (`li.ev`, `a.ev__card`, `span.ev__media > span.plate__frame > {{img}}`, `ev__n label`, `ev__name`, `ev__text`, `ev__more`) as a hub's children with photographs. Review fixes 2026-10-24: every card spans 2 of the 6 columns (two rows of three, each 3:2), also between 640 and 1023 px where main.css would make the first card full width, so the grid closes above the finder panel. On phones the home's snapping row becomes a one-column list (16:9). A door without a photograph takes `span.abt-door-type[aria-hidden="true"]` in the media slot, with eight `span.abt-door-type__row` lines (the Policies door: the rule topics as a small ledger on paper-2; the card's name and text carry the meaning). Hand-written, so the comment at the top of the section lists the slugs that must match nav.json.

### Proof (`div.abt-proof`, `.abt-proof__feats`, `.abt-proof__links`; `span.abt-count[data-abt-count]`; 2026-10-24)
The home's `.feats` on 8 columns beside a `link-list` of evidence pages. `abt-count` counts up once when on screen (`about.js`); the final number is in the markup. Numbers only from the sources, each with its `abt-foot__source`.

### Quotation sheet (`div.abt-belief`, `blockquote.quote.abt-belief__quote`, `.abt-belief__goals`; 2026-10-24)
The home's `.quote` (mark, `quote__line display-l`, `quote__line--2 lead`) on 7 columns and a `dl.dl` on the right.

### Venue panel outside the home grid (`div.venue.abt-venue`; 2026-10-24)
The home's paper-2 panel with the gold left rule, freed from its results-grid column. One highlighted statement per page.

### History eras (`section.page-section.abt-eras`, `div.abt-era`, `figure.abt-era__plate`, `--crest`, `p.caption.abt-era__line`, `.abt-era__dates`; 2026-10-24, stacked since the review fixes of the same day)
Inside a `.story` with the `chapter-nav` as the era index: each `story-chapter` opens with an `abt-head` (an `h3`, under the section's H2), then the era's plate (16:9, 10 of 12 columns from 1024 px, 4:3 on a phone), a visible date line (`abt-era__line`: the year of the photograph, so a 2024 frame beside 2003 to 2015 dates is never read as being from that era), then the dated `ol.timeline` at full width (max 64 rem). An era without a plate simply has the timeline. `--crest` sets the focus of the crest frame.

### Campus facilities and the walk (`ul.tag-list.abt-facilities`; `section.abt-walk`, `figure.abt-walk__plate`, `div.abt-walk__facts`, `p.abt-walk__note`; 2026-10-24)
The home's 14-item ledger as a grid of 44 px rows (two columns on a phone), each item an anchor into the walk. The walk: a `.story` whose six chapters are `abt-head` (h3), one plate at 10 of 12 columns (always 16:9, 4:3 on a phone; no plate is ever smaller), `abt-walk__note` as the visible one-line caption under every plate (what and when; the pool's says it is an illustration), and `dl.dl` facts, grouped under `p.label` lines when a chapter holds several rooms (classrooms, laboratories, library). Review fixes 2026-10-24: `--3x2` and `--small` are gone.

### Chapter-nav phone fade (`:is(.abt-eras, .abt-walk, .abt-rules) .chapter-nav`; review fixes 2026-10-24, interim)
Under 1024 px the group's three story pages (History, Campus, Policies, whose rules section carries `abt-rules`) give the scrolling index 40 px of end padding, a right-edge paper fade (`mask-image`) and scroll-snap, so a chip is never cut mid-word. One Foundation rule in `pages.css` should replace it (nav requests, X12).

### Concern card (`div.abt-panel.abt-concern`, `.abt-concern__grid`, `__lead`, `__lines`, `__text`, `--quiet`; 2026-10-24)
Child protection's first section: the maroon-edged panel with the Admissions `.call-lines` list inside it (the one phone component, critique X10), the numbers large and 44 px `tel:` links. Never in an aside.

### Quick answers (`section.abt-quick` with `[data-filter-scope]`; 2026-10-24)
Filter chips (`chips`, `chips__status`, `filter-empty`) over `abt-panels--4` cards that carry `data-tags`; each card's "The full rule" link opens the accordion item below (`#id`).

### Forms card (`section.accordion-group.abt-forms`; 2026-10-24)
A gold panel with a `doc-list`, as the last group of the rules so the chapter index reaches it; the forms are not policies and the card says so.

### Fast lane (`ul.abt-fastlane`; 2026-10-24)
A hairline list in two columns, 52 px rows, for the current-parents strip that ends Policies.

### Careers steps and one route (`div.abt-steps > ol.steps`; `#apply-online` + `#apply-by-hand`; 2026-10-24)
The home's `.steps` in four columns. `about.js` watches `#apply-online` (`data-portal-only`, revealed by `portal.js` when the site has an API) and hides `#apply-by-hand` when it is shown, so the page never offers two routes.

## Review fixes r3 (2026-10-24, later the same day)

- **Side hero** (`.abt-hero-side`, school administration): a body-built H1 row (the shell's `page-hero__title`, `page-hero__lead`, `page-hero__rule` classes for the type) with a 3:2 plate in columns 8 to 12 beside the standfirst from 1024 px, stacked under it below. The build prepends the breadcrumb band; the eyebrow prints the group name only. Use it when a T11 page's first screen is a chart or a tool and its one photograph is a detail, not a scene.
- **Plate tag** (`.abt-plate__tag` inside `.plate__frame`): a small paper label, top left on the photograph, in the caption style; `aria-hidden` when the alt and the caption already say the same. Used for the pool illustration on Campus.
- **Story pages at desktop width** (`.abt-eras`, `.abt-walk`): from 1024 px the `.chapter-nav` is a sticky index row across the sheet and the chapters take the full width, so the plates (10 of 12 columns) are the size the walk promises. Policies keeps the left column.
- **Chapter-nav under 480 px**: the index wraps into rows (no scroll, no fade); labels shortened in `campus.html`. Interim until the Foundation's X12 rule.
- **Fixed overlays and the first screen** (`[data-abt-clear]` + `html.abt-hero-in`, about.js and about.css): while a cover's media, a hero plate or the class finder reaches into the launcher's corner (the bottom 150 px of the viewport), the chat launcher, its tease and the first-visit notice move below the viewport and come back on scroll. The chat panel itself is never moved. Interim until the Foundation's X16 fix in `portal.css|js`.
- **Concern card lines** (`.abt-concern .phones`): `{{phones:all}}` set at the call-sheet size (both further-queries numbers); the hand-built `.call-lines` copy is gone from Child protection.
- **Lines in two columns** (`.abt-lines .phones`): `{{phones:all}}` as two columns of two from 900 px (Who looks after each class, 03).
- Gold rules everywhere but the concern card: `abt-panel--gold` on the eight Policies cards and the Policies door tile.
