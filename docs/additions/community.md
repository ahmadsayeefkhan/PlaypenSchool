# Additions: Community group (/community/parents/, /community/alumni/, /news/, /events/, /notices/, /gallery/)

Files: `build/additions/community.css` and `build/additions/community.js`. Written 2026-10-11. All classes use the component's own name; tokens only; 44 px targets; the one transition (an arrow) is switched off by the reduced-motion rule.

### Empty note (`.empty-note`; events, notices, news, alumni, gallery; 2026-10-11, community)
A calm statement where the school has not yet given the site anything to list: a label, one plain sentence as the title, then what to do instead. Same ink rule as `.rows` and `.timeline`, so it reads as a list that has not been filled. Replace it with the real rows the day the school supplies them.

```html
<div class="empty-note" data-reveal>
  <div>
    <p class="label">To be published by the school</p>
    <p class="empty-note__title">No event or term date has been given to this website yet.</p>
  </div>
  <div class="empty-note__body">
    <p>One or two plain sentences: where the information is kept today.</p>
    {{phones}}            <!-- optional; a list, so never inside a <p> -->
  </div>
</div>
```
Rule: the label says "To be published by the school" (or what the missing thing is); the title never says "coming soon". Add a `<!-- CONFIRM: ... -->` comment and a line in `docs/confirm/<group>.md`.

### Filter group (`.filter-group` + `js/pages-additions.js`; news; 2026-10-11, community)
A heading and its list inside a `[data-filter-scope]`. The core filter (`js/inner.js`) hides items; this group hides the whole block, heading included, when the chips leave nothing visible in it, so a heading is never left over an empty list. The group itself carries no `data-tags`; its items do.

```html
<div class="band" data-filter-scope>
  <ul class="chips">...</ul><p class="chips__status" role="status" aria-live="polite"></p>
  <div class="filter-group">
    <h3 class="label filter-group__title">Event reports</h3>
    <ul class="rows"><li class="row" data-tags="report" data-year="2025">...</li></ul>
  </div>
  <p class="filter-empty">...</p>
</div>
```
Two chip rows work together (`data-filter-key="year"` on the second; items carry `data-tags` and `data-year`).

### News feed (`ul.news-feed > li.news-item`; news; 2026-10-11, community)
Photo-led event reports: a top rule, the picture (`figure.plate.plate--flat`), a dated kicker (`.news-item__meta`), the title with the link stretched over the card (`.news-item__title a`), one sentence (`.news-item__text`) and an arrow (`.news-item__go`, decorative). The first card is `--lead` (7 of 12 columns from 1024 px; 19:10 there, so its picture is as tall as the 4:3 picture of the `--side` card beside it, and the dates and titles line up; 16:9 on a tablet), the second `--side` (5 of 12, 4:3), the rest span 6. `--pos` (a custom property on the `li`, for example `style="--pos: 50% 26%"`) says which part of a tall frame the 4:3 crop keeps.

```html
<ul class="news-feed" data-reveal-group>
  <li class="news-item news-item--lead" id="r-sports-2026" data-tags="report" data-year="2026">
    <figure class="plate plate--flat" data-reveal><div class="plate__frame">{{img src="media/life-1" alt="..." sizes="..."}}</div></figure>
    <p class="news-item__meta"><time datetime="2026-01">January 2026</time><span>Event report</span></p>
    <h4 class="news-item__title"><a href="{{link:/gallery/#sports}}">Annual Sports Day 2026</a></h4>
    <p class="news-item__text">One plain sentence.</p>
    <span class="news-item__go" aria-hidden="true"></span>
  </li>
</ul>
```
Rule: give every card an `id` (`r-...`) so other pages can link to it. Use a photograph the catalogue allows.

### Notice date and validity line (`.row__day--text`, `.row__valid`, `.row__body`; notices; 2026-10-11, community)
`.row__day` is a large number. A notice with no single day sets its word in `.row__day--text` ("Standing", "2026 to 27") inside a plain `span.row__date`; a dated notice keeps `<time class="row__date">`. `.row__valid` says in words the period a notice covers ("Covers the academic year July 2026 to June 2027", "Expired on 11 December 2025"). `.row__body` gets `min-width: 0` (the class was in COMPONENTS.md but had no rule). An expired notice keeps `row--expired` and the word "Expired" in its kicker.

### Photo album (`section.album`; gallery; 2026-10-11, community)
One event or subject: a rule, the title and its date and count, a note on what it shows, then the `.gallery` grid with its own lightbox (the viewer steps through one album at a time because each album is its own `[data-gallery]`). The chips show or hide whole albums (`data-tags` on the `section`). Give each album an `id` so the news cards can link to it.

```html
<section class="album" id="sports" data-tags="sports" aria-labelledby="album-sports-h">
  <header class="album__head">
    <div><h3 id="album-sports-h" class="album__title">Annual Sports Day 2026</h3><p class="album__meta">January 2026, 5 photographs</p></div>
    <p class="album__note">What the album shows.</p>
  </header>
  <ul class="gallery" data-gallery>...</ul>
</section>
```
Rule: a photograph needs alt text that says what is seen, a caption that says what and when, and a catalogue row that allows it (no identifiable child without the school's written consent).

**Even grid (review, 2026-10-11).** The shared `.gallery` is a masonry (CSS columns), which leaves ragged columns and gaps when the frames differ in shape. Inside `.album` the list is a grid instead: one column under 560 px (each frame keeps its own proportions), two from 560 px, three from 1024 px, every thumbnail cut to 4:3 (the lightbox still shows the whole photograph). Modifiers on the `li`:

- `gallery__item--wide`: two columns from 1024 px and the full row from 560 px. Put it first, beside one other frame: from 1024 px it takes that frame's height, so the row stays level.
- `gallery__item--tablet-wide`: the last frame of a three-frame album. The full row at 560 to 1023 px (so no frame stands alone beside an empty cell), an ordinary tile from 1024 px.
- `style="--pos: 50% 30%"` on the `li` (a custom property, which the build allows): which part of a tall or wide frame the 4:3 crop keeps.

```html
<li class="gallery__item gallery__item--wide" style="--pos: 50% 45%"> ... </li>
```
Plan an album in whole rows: 3, 6 (3 + 3), or 5 (one wide frame beside one, then three).

### Start-here card tag (`.chapter-card__link .link__site`; parents; 2026-10-11, community)
A chapter card that opens the school's current website carries the "current site" tag inside its link. The tag sits on its own line under the title so external and internal cards line up. The link needs `target="_blank" rel="noopener"` and the hidden "(opens in a new tab)".

## Community-contact redesign, Parents and Alumni pieces (2026-10-24)

The shared cc- kit (`cc-head`, `cc-foot`, `cc-panel`, `cc-plate`, `cc-lines`, `cc-chips`) is documented in `docs/additions/contact-legal.md`. Below are the pieces only `/community/parents/` and `/community/alumni/` use. Two 2026-10-11 entries were retired the same day: `.layout--aside-first` (CSS `order`, replaced by `.cc-aside-first`, which keeps the DOM order) and the start-here `.chapter-card__link .link__site` rule (the cards became `.cc-tiles`).

### Start-here tiles `.cc-tiles` (Parents)
Four doors a current parent opens most: `ul.cc-tiles > li.cc-tile` with a `.cc-tile__n.label`, an `h3.cc-tile__title > a.cc-tile__link` (stretched over the tile), one `p.cc-tile__text` and the `.cc-tile__go` arrow. 2 x 2 from 0 px so all four sit in one phone screen (under 480 px the text line is clamped to two lines, so the tile still says what it opens; review r1, 2026-10-24), four across from 1024 px. A tile that opens the school's current website carries the `link__site` tag and the hidden "(opens in a new tab)" text, as `{{ext}}` writes them.

### Notices mirrored on a page `.cc-notices` (Parents; review r1, 2026-10-24)
Add to the `page-section` that holds a feed-synced `nb-grid` (`data-feed="notices-current"`) outside the Notices board. content.js adds `nb-card--feature` to a pinned notice and main.css then spans it over both columns, which only makes sense next to the board's sticky `nb-ask`; here the cards stay two equal columns with the ordinary title size and fact grid, and every card action keeps the outlined (secondary) button, so the page does not end up with one filled admissions button as its only priority. The lead sentence carries a `<span data-feed-line="notices-current">` with count-free built text ("The notices that apply now."); the feed writes "N notices apply now." into it.

### Day-to-day grid `.cc-faq` (Parents)
Written in phone order: `.cc-faq__worried` (the safeguarding `.venue`, which carries `id="q-concern"` so older `#q-concern` links land on it; the answer is not repeated in the accordion), `.cc-faq__main` (the `.cc-chips` jump row and the `[data-accordion-scope]` with its `accordion-group`s: `h3.label` group titles, `h4.accordion__q` questions, because the sheet already has an H2), `.cc-faq__aside` (the plate and the document links). From 1024 px the questions take 7 columns over two rows and the two side blocks sit on the right, so reading order and focus order stay the DOM order at every width (no CSS `order`).

### Checklist before the panel `.cc-aside-first` (Alumni)
Add to `.layout` when the aside comes first in the DOM (the phone order); from 1024 px both columns are pinned to grid row 1, so `.layout`'s column rules place them side by side. On Alumni the main column held the prototype form until review r1 (2026-10-24 evening) withdrew it (held in `redesign-2026-10-24-pages/build/alumni-form-held.html`); since 2026-10-27 it holds the online form "Join the alumni community" (`#alumni-online`, `data-portal-only hidden`, `form.alf[data-alumni-form]`; it sends to the Website Operator with an ALU- code and accepted requests go on to the Community app, Playpen Alumni; see `alumni-form.md`) and, below it in every case, the gold "Questions about joining" `.cc-panel` with the further-queries number (`{{phone:further class="contact-card__tel"}}` in `p.cc-panel__tel`, as on Terms) and two lines swapped by `alumni-form.js` (`data-alumni-when="off"` / `"on"`).

### Graduation albums `.cc-years` (Alumni)
A wrapper for the home's `.ev-grid` photo cards, one per album year (`li.ev > a.ev__card` with `.ev__media > .plate__frame` + `{{img}}`, `.ev__n.label`, `h3.ev__name`, `.ev__text`, `.ev__more`): a stack on phones (the home's snapping row would hide the fourth card), 2 x 2 from 640 px, four across from 1200 px. Each card links to its album; the texts are the albums' `summary` lines from nav.json; the covers are the albums' own people-free frames.

### Night timeline with its plate `.cc-dates` (Alumni)
`.cc-dates__plate` first (under the lead on phones), then `ol.timeline.cc-dates__list`; from 1024 px the timeline takes 7 columns and the plate column sits on the right in the same grid row, stretched to the timeline's height: the `figure.plate` inside it is sticky at the top, and `.cc-dates__more` (a label and a two-link `link-list` to other sheets of the page, hidden under 1024 px) sits at the foot of the column with `margin-top: auto`, so a full-page view does not show 900 px of empty ground under a short plate (review r1, 2026-10-24). The night plate is a darker, warmer graded copy of the stage frame (`img/alumni-stage-night`), not a CSS filter.

### Round-2 fixes (2026-10-25)
- `.cc-dates` (Alumni night sheet): the plate column is five of twelve columns from 1024 px with a 4:5 plate (`img/alumni-grad23-night`) at full width; the two "On this page" links sit directly under it (no `margin-top: auto`) and stick with it. This replaces the r1 note above about the links at the foot of the column.
- `.cc-years` under 640 px: the four albums are a 2 x 2 grid (the card text hidden, the year kept on one line), not a 1,900 px stack.
- `.cc-notices` under 640 px: each notice card shows its tile, chips, title and one action; the For / What to do / When facts and the source line are hidden, because the action opens the full notice.
- `.cc-tile__long` / `.cc-tile__short` under 480 px: each Start-here tile shows its own short line instead of a two-line clamp that cut sentences mid-phrase.
- `.cc-callrow` (Parents phone sheet): the phone list on seven columns and the Book Fair plate on the right from 1024 px, so the row is not half empty.
