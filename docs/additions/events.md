# Additions: events (2026-10-18, pages redesign)

### Featured event cards (`ul.ev-feature > li.ev-card`), /events/
Five cards, the whole card one link (`a.ev-card__link` stretched). First card `ev-card--lead` (four of six columns, two rows high from 1100 px). Frame `div.ev-card__frame` holds an `{{img}}` or a typographic plate.

    <li class="ev-card"><div class="ev-card__frame">{{img src="..." alt="..." sizes="..."}}</div>
      <p class="ev-card__meta"><span>Culture</span><span>14 April</span></p>
      <h3 class="ev-card__title"><a class="ev-card__link" href="{{link:/events/pohela-boishakh/}}">Pohela Boishakh</a></h3>
      <p class="ev-card__text">One line.</p><span class="ev-card__go" aria-hidden="true"></span></li>

### Typographic plate (`div.ev-type`, `figure.ev-mark`)
For an event with no photograph we may show: the name or the fixed date set large on maroon, gold hairline frame. Decorative (`aria-hidden="true"`); never a fake photograph.

    <figure class="split__figure ev-mark" aria-hidden="true" data-reveal><div class="ev-type"><span class="ev-type__kicker">National days &middot; Every year</span><span class="ev-type__word">21<small>February</small></span><span class="ev-type__rule"></span></div></figure>

### Index "when" column (`.ev-when`, `.ev-when__yearly`)
On `.row__date`: a fixed date uses `.row__day` + month; any other event `<span class="ev-when__yearly">Each year</span>`.

### Event photographs (`ul.ev-photos`, `ev-photos--3`)
Two (or three) 3:2 plates, no captions.

### Captions
`.dialog__cap:empty` hides the lightbox caption now that photographs carry none (see build/media.py `strip_captions`).

Event pages are ordinary sources: edit `build/pages/events/<slug>.html` by hand. Order (pager): the five featured, the three national days, Annual Drama, Annual Milad, Orientation Day, Book Fair, Education Fair, Business Week, Study Tour.


## Pages redesign, 2026-10-24 (group events-gallery-news: /events/, the 15 event pages, /news/)

The inner page kit (`redesign-2026-10-24-pages/research/design-language.md` section 3) had not landed as `build/additions/0-kit.css`, so the pieces this group needs sit at the end of `build/additions/events.css` under the prefix `egn-` (events, gallery, news). They map one to one onto the kit (`pk-head`, `pk-foot`, `pk-panel`, `[data-pk-split]`, `pk-count`, `pk-plate`) and can be deleted when it lands. `build/additions/events.js` (new) holds the counter.

### Sheet head (`div.egn-head`)
The home's head grid: the H2 (`h2.display-l.egn-rise[data-reveal]`) on 10 of 12 columns, 18ch; the one `p.lead[data-reveal]` on 7 columns, 54ch. `egn-head--tight` for a shorter gap before chips or a list.

    <div class="egn-head"><h2 id="x" class="display-l egn-rise" data-reveal>One short sentence.</h2><p class="lead" data-reveal>One paragraph.</p></div>

### Headline rise (`.egn-rise`)
On `.is-in` (js/inner.js's reveal) the heading rises through a mask: a CSS animation (`egn-rise`, 1100 ms, `--ease-mask`). The resting state is pages.css's own (opacity 0, 28 px). Never put a `clip-path` on the resting state: IntersectionObserver applies it to the target's box and the heading would never be revealed. Off with reduced motion, the footer switch and in print.

### Sheet foot (`div.egn-foot`)
Every fact-heavy sheet closes on a hairline: `p.egn-foot__text` (8 columns, 62ch), `p.egn-foot__action` (end-aligned; an arrow link, a `btn--secondary` or both), `p.egn-foot__source.caption` (the source line, moved out of comments onto the page). Phones: stacked, a button goes full width.

### Panel (`div.egn-panel`, `div.egn-panels--2|--3`)
The results-card recipe: paper-3, clay border, a 3 px top rule in maroon (`egn-panel--gold`, `egn-panel--ink` change it). `egn-panel__head` (name 24 to 34 px serif plus a `.label` or `egn-panel__sub` on the right, hairline under), 17 px body, `ul.egn-panel__list` (hairline rows), `p.egn-panel__foot` (pinned to the bottom). `egn-panels--3` is three columns from 1024 px, two from 720 px.

### Counter (`span.egn-count[data-egn-n]`)
Counts up from 0 once when it comes on screen (`events.js`). The final number is in the markup; no JavaScript, reduced motion and print show it as it is. Used inside the home's `.feats` on /news/.

### Mounted hero plate (`body.egn-page`, `body.egn-album`)
Front matter `body_class: egn-page` puts the shell's bleed hero plate back on the paper mount inside the band, with the home's curtain on load (`egn-curtain` and `egn-settle`, off with reduced motion); a wide frame is cut to 16:9 on phones (not 4:3) and 21:9 from 1024 px. `egn-album` (album pages, /news/, event pages whose frame is 1200 px wide) caps the plate at 1200 px and 2:1, so a 1200 px frame is never upscaled.

### Year strip (`div.ev-year`), /events/ sheet 02
The school year as one object: two `ev-year__sem` blocks (a maroon and a gold `ev-year__bar` that draws left to right on reveal), each an `ol.ev-year__months` of six `li.ev-year__month` (name plus `ul.ev-year__marks`). Marks: `a.ev-year__mark.ev-year__mark--fixed` (`<b>21</b>Shaheed Dibosh`), `a.ev-year__mark` with a gold `.label` ("On record, 2026") for a month a current page already gives, `span.ev-year__mark--exam` for the examination that closes a semester (a label, not a date). A month with nothing is `ev-year__month--quiet`. From 900 px the months are six columns per semester; below, rows (name left, marks right). Then `.ev-year__announced` (a `.label` and `ul.ev-year__pills` of `a.ev-year__pill`, 44 px) and `.ev-year__panels` (three `egn-panel`s). Rule: only the four national days and the months the pages already call "most recent on record" go on the strip; everything else is a CONFIRM. Words never break mid-word (`overflow-wrap: normal`); a long name takes a soft hyphen in the source.

### Index by kind (`div.ev-index`), /events/ sheet 03
Four `section.ev-index__group` (an `h3.label.ev-index__kind` with `span.ev-index__count`, then `ul.ev-index__list`); each entry is one `a.ev-index__item` (name, `ev-index__when` with a maroon `<b>` for a fixed date, `ev-index__line`), 44 px or more. Replaces the filter chips and the twenty rows: grouping, not filtering.

### Facts that say something (`.fact--num`, `.fact-strip--2`)
On an event page the strip keeps Kind, When, and Who and Where only when they name a class or a place. A fixed date is a maroon numeral (`div.fact.fact--num`); otherwise "Announced each year, as a notice" links to /notices/ with the month on record in `<small>`. A strip of two facts takes `fact-strip--2`.

### From the album (`ul.ev-album[data-gallery]`, `ul.ev-grid.ev-years`)
Three (or two) 3:2 plates from the event's own album, each `li > a.gallery__link[data-lightbox] > span.gallery__frame > {{img}}` (the page carries `body_class: ... gallery-page`, so the full-screen viewer and the swipe of `gallery.js` apply); `ev-album--3` is three columns from 1024 px. The Graduation page shows four album covers as the home's `.ev-grid` cards (`ev-years ev-years--4`). An album with no cleared frame shows the head and the foot only ("holds 44 photographs; none may be shown here yet", "See the album").

### Hook (`div.ev-hook > div.venue`)
One admissions moment per event page: the home's `.venue` panel in a 12-column grid (7 of 12 from 1024 px), a `.label`, one `venue__text` sentence made of facts already on the site, and `p.ev-hook__actions` with one arrow link and the `btn--secondary` "Book a visit". No claim about what a visit includes (critique X4).

### Band mark (`figure.ev-mark.ev-mark--band` and `p.ev-mark__line`)
On the five event pages with no cleared frame (Victory Day, Annual Drama, Annual Milad, Orientation Day, Business Week) and the three whose only frame is portrait or square (Science and Technology Fair, Book Fair, Study Tour): the typographic plate at band width, first in sheet 01, and under it one honest line: the school's photographs come when it agrees to them. No image is generated for these.

### /news/ (`.news-status`, `.news-ledger`, `.news-feats`)
`news-status`: the first sheet's `.venue` statement with its link list beside it and the phone lines under. `news-ledger`: the home's `.feats` (with `egn-count`), then one `egn-panel--gold` per kind of competition with its `.rows` inside (date column 96 px from 768 px); `egn-panel--span` lets the last panel take the full row. The news feed's `plate--flat` figures are mounted again and cut 3:2 (16:9 for the lead from 1024 px).


## Review r1 fixes, 2026-10-24 (group events-gallery-news)

### Glance grid (`div.ev-glance`, `.ev-glance__mark`, `.ev-glance__facts`, `.ev-mark--side`, `.ev-glance__photo`)
Sheet 01 of an event page that has no wide hero: from 1024 px the typographic plate (`figure.ev-mark.ev-mark--side.ev-glance__mark`, word at 36 to 60 px, 220 to 320 px tall) sits on 5 of 12 columns beside the fact strip (`--cols: 2` in its 7 columns) with the honest line under the facts; below 1024 px the plate stacks over the facts. It replaces the band-wide plate (`ev-mark--band`, about 1180 x 380 at 1366) that repeated the H1 directly under the H1. Where the page has one cleared frame that is square or portrait, the frame takes the first slot instead of the plate as `figure.plate.ev-glance__photo` (the Science and Technology Fair's glassware and the Book Fair's sign at 4:5 with a `--pos`, the Education Fair's Mughal model at its own ratio) and sheet 02 is prose and links (`.layout`), so no frame is shown twice. `ev-mark--band` stays in the stylesheet, unused.

### The album foot under sheet 02
On the six pages whose album has no cleared plate for a strip (Science and Technology Fair, Shaheed Dibosh, Independence Day, Book Fair, Education Fair, Study Tour), sheet 03 "From the album" was a display H2 and a lead for one sentence. It is now the `egn-foot` of sheet 02: the sentence (how many photographs the album holds and which one is on this page), "See the album" and the source. The numbered sheet stays only where plates exist (Sports Day, Pohela Boishakh, the Cultural Programme, Graduation).

### Hero focal point by body class (`body.egn-hero-top`, `body.egn-hero-bottom`)
Until the shell has a `hero_pos` key, a page sets the plate's `object-position` with a body class: `/news/` uses `egn-hero-top` so the taskbar along the bottom of the projected screen in `img/gal-nasa-soyuz` is cut off.

### The hubs' phone hero (`events.js`, `body.egn-hero-tall`)
`/events/` and `/gallery/` have 4:5 crops of their hero frames (`img/events-stage-cover-tall`, `img/gallery-formation-tall`) that the shell's `<picture>` does not carry (`hero_image_tall` is requested, nav-requests item 6). `events.js` adds a `<source media="(max-width: 639px)">` for each format from a small map of stems and marks the body, and the plate is 4:5 on phones. Without JavaScript the wide frame stays at 16:9.

### Smaller rules
The lead card on `/events/` keeps 3:2 from 1100 px and aligns to the top of its two rows (the frame grew to about 900 x 860 and the wave formation became grey sand). The year strip's marks are 14 px, `text-wrap: balance`, no soft hyphens in the markup. `/news/`: `.news-ledger` aligns its panels to the start; the feats are set at the home's size and the third number is a span of dates (`.news-feat__span`), not a count of one. The glassware frame carries `--pos: 50% 75%` wherever it is cut (hub card, event page), and its alt says who is in it.

## Round-2 fixes (2026-10-25)

- The rules added under "review r2" at the end of `events.css` stand: `/news/` third feat (first column `minmax(92px, max-content)`, the span on one line from 640 px), the hero plate's curtain with `backwards` fill and no delay (the resting state is the whole frame), the `/events/` index from 1100 px (Academic over two columns in two sub-columns, National days and Sports sharing the fourth), `ev-glance__photo--small` (the glassware at 4:3, 360 px at most).
- `body.egn-hero-right` (72 % 50 %) is unused after the Graduation 2025 banner re-cut; kept for the next frame that needs it.
- `content.js reportInner()` keeps a built photograph unless the figure carries `data-feed-img` (the `featureFrame()` rule); the news year chips come from the reports only; feed titles are `h3`.
- Second pass (2026-10-25): the operator's event records now match the built pages beyond the featured block too: E01 `heroImage` `img/gal-sports26-wave` (was `media/life-1`) and `body.about.figure` `img/sl-displays` (was `gal-sports-march`), "the school field at the foot of the building" (was "grass"); E04 `body.about.figure` `img/gal-acp24-welcome` (was `media/life-4`); E05 `body.about.figure` `img/gal-grad24-lectern` (was `gal-grad-hall`). The website renders only `featured`, `home` and the news blocks, so this is for the office app's own views; `media/life-4` and `media/life-1` stay only in the `home` blocks (A3, the fixed home).
