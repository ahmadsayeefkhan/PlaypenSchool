# Additions: contact-legal (/contact/, /privacy/, /terms/)

Files: `build/additions/contact-legal.css`, `build/additions/contact-legal.js`.

### Call sheet (`.contact-lines`) (/contact/, 2026-10-11, contact-legal)
The home's phone list (`{{phones:all}}`) set large on the night ground: the heading and a note on the left, the lines as hairline rows on the right (the section name in gold capitals over a 28 to 42 px serif number; the two further-queries numbers stacked). It is token-driven, so the numbers can never differ from nav.json, and it includes both further-queries numbers, which `{{phone:further}}` (first number only) cannot. Use it once per page, inside `section.page-section.is-night`.

```html
<section class="page-section is-night" aria-labelledby="ct-lines">
  <div class="band">
    <div class="sheet-rule">...</div>
    <div class="contact-lines">
      <div class="contact-lines__intro"><h2 id="ct-lines" class="section-title">...</h2><div class="prose" data-reveal><p>...</p></div></div>
      <div class="contact-lines__list" data-reveal>{{phones:all}}</div>
    </div>
  </div>
</section>
```

### Topic-aware prototype notice (/contact/, 2026-10-11, contact-legal)
`contact-legal.js`. The form's `<select id="ct-topic">` carries a `data-reply="..."` sentence on each `<option>`. On change, the first line of `.form-notice__text` is set to "This form is a prototype: nothing was sent." plus that sentence plus the admissions hours (read from `data-hours` on `<body>`, so it never goes stale). `inner.js` fills that line itself only when it is empty, so setting it on change is enough; nothing is sent or stored. The numbers underneath come from `{{phones:all}}` inside the notice. Rule: every `data-reply` sentence must say only what the school has published (a section line, an office, a page to read).

### `.form-notice__text` (2026-10-11, contact-legal)
`docs/COMPONENTS.md` documents this class in the form snippet, but no stylesheet defined it, so the checker rejected it. A one-line rule (`margin: 0`) is in the additions file. The Foundation may move it into `pages.css`.

### `.legal-table` (/contact/, /privacy/, 2026-10-11, contact-legal)
Add to a `table.table--stack`. Under 640 px `pages.css` turns the table into a block, and its `<caption>` then collapses to the width of its longest word and runs down the page one word to a line. `.legal-table caption { display: block; width: 100% }` fixes it for these pages. **The cause is in `pages.css` (`.table--stack` at max-width 639px): the Foundation should add `display: block` to `.table--stack caption` and this rule can go.**

### Night fact-strip note (/privacy/, 2026-10-11, contact-legal)
`.is-night .fact dd small` is set to `--bone-dim`. `pages.css` styles the night fact strip but leaves the `<small>` line at `--ink-2`, which vanishes on `--night`. The Foundation may move the rule into `pages.css`.

### Hit areas for stand-alone links in a table, a definition or a callout (/contact/, 2026-10-11, contact-legal review)
`pages.css` gives the invisible 44 px hit area only to the footer, where-next, link-list and doc-list links. A link that stands alone in a table cell, a `dd` or a callout was 25 to 28 px high. `.legal-table td a`, `.contact-find dd a` and `.legal-more a` get the same `::before` area (the class goes on the table, the `dl` or the paragraph). The Foundation may fold this into `pages.css` as a rule for `td a`, `dd a` and `.callout a`.

### `.legal-chapter` (/privacy/, 2026-10-11, contact-legal review)
Add to each `section.story-chapter` of a long legal page. It sets the chapter heading (`.section-title`) one step below the home's size (30 to 46 px), so seven chapters in a row read as one document.

## The cc- kit: community-contact redesign (2026-10-24)

Written for the seven pages of the community-contact group (/community/parents/, /community/alumni/, /contact/, /privacy/, /terms/, /search/, /404/), each of which carries `body_class: cc-page`. The pieces copy the home's own sheet grammar (research/design-language.md section 3) at page scale. **When the Foundation's `0-kit.css|js` ships `pk-head`, `pk-foot`, `pk-panel`, `pk-plate` and the mask rise, each cc- piece is replaced by its pk- twin and deleted here.** Tokens only; 44 px targets; the two motions (the H2 mask and the tile arrow) stop under `prefers-reduced-motion` and the footer switch. The old night call sheet `.contact-lines` (2026-10-11) was retired the same day: `/contact/` no longer opens on a dark band.

### `.cc-page` (every page of the group)
`body_class: cc-page` in the front matter. One custom property (`--cc-edge`) and a scope hook. No layout of its own.

### Sheet head `.cc-head` (every content sheet)
The home's `.results__head`: the H2 on 10 of 12 columns at 18ch, the lead on 7 columns at 54ch; one column under 1024 px. The H2 is `display-l` (main.css) and rises through a mask when revealed: the heading hides its overflow and the inner `.cc-head__line` starts below the box (`translateY(115%)`) until the reveal script adds `.is-in`. Rule: a `clip-path` on the heading itself does not work, because Chrome counts a fully clipped box as not intersecting and the IntersectionObserver never reveals it.
```html
<div class="cc-head">
  <h2 id="x" class="display-l cc-head__title" data-reveal><span class="cc-head__line">Call the line for your child's section.</span></h2>
  <p class="lead" data-reveal>One sentence under the heading.</p>
</div>
```

### Sheet foot `.cc-foot` (the end of every fact-heavy sheet)
The home's `.top-events__foot`: a hairline, a plain sentence on 8 columns, one action end-aligned on the right, and the source line as a caption under both. Sources move out of comments onto the page. Night variant included.
```html
<div class="cc-foot" data-reveal>
  <p class="cc-foot__text">A plain sentence.</p>
  <p class="cc-foot__action"><a class="link link--arrow" href="{{link:/notices/}}">All notices</a></p>
  <p class="cc-foot__source caption">From the school's notice board.</p>
</div>
```

### Panel `.cc-panel`, `.cc-panel--gold`, `.cc-panel--ink`, row `.cc-panels`, `--2`, `--3`
The home's `.result` recipe as a general panel: paper-3, 1 px clay, a 3 px coloured top rule, a head on a hairline (`.cc-panel__name` + a `.label`), a body (`.cc-panel__body`: paragraphs, a `.label` + `tag-list`, or a `dl.dl`), one action at the foot (`.cc-panel__action`). `.cc-panels` lays two or three side by side from 720 px (three from 1024 px). Used for the accounts on Parents, the three ways to write on Contact, Your choices on Privacy, Ask the school on Terms (`.cc-panel__tel` holds a `{{phone:... class="contact-card__tel"}}`), the old addresses on 404.
```html
<ul class="cc-panels cc-panels--3" data-reveal-group>
  <li class="cc-panel cc-panel--gold">
    <div class="cc-panel__head"><h3 class="cc-panel__name">Book a visit</h3><span class="label">VIS- code</span></div>
    <div class="cc-panel__body"><p>...</p></div>
    <p class="cc-panel__action"><a class="btn btn--secondary" href="{{link:/admissions/visit/}}">Book a visit</a></p>
  </li>
</ul>
```

### Opening plate `.cc-opening`, `.cc-plate`, `.cc-plate--switch`, `.cc-split`
A page with no `hero_image` opens on a mounted plate inside the band (`section.page-section.cc-opening` right after the type hero). `.cc-plate--switch` holds two crops of one frame, `.cc-plate__wide` (from 720 px) and `.cc-plate__tall` (phones, 4:5); both are lazy, so the hidden one is not fetched. `.cc-split` puts the plate on 7 columns beside a statement (`.cc-split__figure`, `.cc-split__text`), as on Alumni. The curtain comes from `figure.plate[data-reveal]` in pages.css. Rule: no text on the photograph; a frame the catalogue allows only.

### Phone list set large `.cc-lines`
`{{phones:all}}` (or `{{phones}}`) inside `div.cc-lines`: the section as a tracked label, the number in Newsreader 300 at 30 to 44 px on a gold hairline, every number a 44 px `tel:` target; one column under 640 px; capped at 820 px. A `.venue` after the list carries the hours sentence. Night variant included. This is the one phone block a page carries (plus a `{{phones}}` inside a form notice, which is hidden until a submit).

### Contact's first screen `.cc-first` and find-us sheet `.cc-find`, `.cc-map`
`.cc-first`: the lines on 7 columns (`.cc-first__lines`), the 4:5 crest plate, the address `dl` and the one primary button on the right (`.cc-first__side`), written in phone order. `.cc-find` (night): the drawn map and the address on 6 columns, the arrival rows on the right. `.cc-map` is a `figure.plate` holding an inline SVG drawn from the address in nav.json: the blocks and their roads (`.cc-map__road`, `.cc-map__block`), thin unnamed lanes inside the blocks for texture (`.cc-map__lane`), the school's own plot as a maroon tint under a diagonal hatch (`.cc-map__plot`, `.cc-map__plot-hatch` filled by the `<pattern id="ct-map-hatch">` whose lines carry `.cc-map__hatch`), the school's road (`.cc-map__road--main`), the pin, and a small paper label above the road (`.cc-map__label`, with a short `.cc-map__leader` to the pin) that gives the school's name and house number; the road and the block are named beside them (review r1, 2026-10-24). Rules: no north arrow, no scale bar, no landmarks until the school names them; "Not to scale" stays. The three address words (road, block, house number) are typed as the address in nav.json gives them and in upper case, as the map prints them; they are the only address words on the page outside `{{address}}` and must change with nav.json (a `{{address:road}}`-style token is requested in the nav-requests file). The `dl` under the map prints `{{address}}` without a second map link: the page's one "Open in Google Maps" link is in the first screen. Nothing is loaded from Google (`{{map}}` is a link).

### Link chips `.cc-chips`
`ul.chips.cc-chips` whose items are `a.chip` links (the `.chip` look of pages.css on an anchor, 44 px, maroon on hover). Parents' jump row (`#g-everyday` ...) and Search's suggestions (`{{link:/search/}}?q=fees`). `.cc-chips--after` adds the gap under a form.

### Search empty state `.cc-empty`
Shown while the box is empty or nothing matched, hidden by `contact-legal.js` as soon as inner.js has written results (a MutationObserver on `.search-results` and `.search-status`). Holds an `.empty-note` whose title swaps between `.cc-empty__start` ("Start from one of these.") and `.cc-empty__none` ("Nothing matched that word."), a `link-list`, and `.cc-empty__call` with a `.venue` and `{{phones}}`. No fetch, no storage.

### 404 brick band `.cc-mark`
A 3:1 band of brick on a paper mount above the H2 (`div.cc-mark > figure.plate + h2.section-title`): the full width of the column on phones, 480 px from 1024 px. The frame is `img/notfound-brick` (a straight course of bricks on the terrace bench, graded like the home's plates). Review r1 (2026-10-24) retired the first version, a 1:1 `media/swatch-1` mount at 112 to 200 px beside the heading, which was soft at that size and read as a loose thumbnail.

### Two-panel row `.cc-panels--2` starts at the top (review r1, 2026-10-24)
`.cc-panels` stretches its panels so a row of three equal panels (Contact) keeps its buttons on one line; `.cc-panels--2` sets `align-items: start`, because a pair of unequal panels (Parents' portal and fees) would otherwise end the shorter one in blank paper.

### Search results list, empty (`.cc-page .search-results:empty`; review r1, 2026-10-24)
pages.css draws the results list's top rule at all times; on the cc- pages the rule and the margin are removed while the list is empty, so the chips are not followed by a dark hairline with nothing under it. Verified: `?q=fees` draws four results and the rule; with `js/pages-additions.js` blocked the results still appear and the empty-state block stays visible under them (an accepted degradation; inner.js owns the search).

### `.legal-code` (/privacy/ table)
A `<small class="legal-code">pp_vid</small>` under the plain name in the table's first column: the storage note's code name, for a visitor who looks for it in the browser's settings.

### Round-2 fixes (2026-10-25)
- `.cc-foot__action .link` carries the invisible `::before` hit area (inset -4px), so the one action of every foot reaches 44 px like the shared links.
- `.cc-map` on phones (under 640 px): the words are set at 20 viewBox units (name 24), the paper label widens to 228 units, the leader is 4 units, and "Not to scale" stays inside the frame at 16 units (it cannot move to the caption: the build strips every `plate__cap`, founder decision 2026-10-18). Every map word sits on a paper halo (`paint-order: stroke`).
- `.cc-mark .plate` from 1024 px: as wide as the search box under it (40rem), not a 480 px orphan.
- `.legal-chapter .prose strong`: a small uppercase sans run-in label (600, 0.8em). The shipped Newsreader stops at weight 400, so `<strong>` in the serif shows as plain text; the Foundation is asked for the heavier face (nav-requests F1).
