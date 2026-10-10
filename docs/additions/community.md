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

### Form first on a phone (`.layout--aside-first`; alumni; review 2026-10-11, community)
Add the class to a `.layout` whose aside holds what to have to hand: below 1024 px the aside comes before the form (`order: -1`); from 1024 px it sits beside it as usual. Put the section heading above the layout, not inside `.layout__main`, so that on a phone the order is heading, checklist, form.
