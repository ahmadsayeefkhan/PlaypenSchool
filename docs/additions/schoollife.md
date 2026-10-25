# Additions: School life group (schoollife)

Files: `build/additions/schoollife.css` and `build/additions/schoollife.js` (one behaviour, the hub's card counter, added in the review round of 2026-10-24). Redesigned 2026-10-24 (pages `/school-life/`, `/school-life/school-day/`, `/school-life/transport-and-safety/`, `/school-life/sports/`, `/school-life/clubs-and-activities/`, `/school-life/culture-and-service/`), from the plan in `../redesign-2026-10-24-pages/plans/schoollife.md` and its critique.

Principle: the group reuses the home's own classes from `main.css` where they are not tied to a home layout (`display-l`, `lead`, `caption`, `label`, `feat`/`feat__n`/`feat__t`, `ev-grid`/`ev`/`ev__card`/`ev__media`/`ev__name`/`ev__text`/`ev__more`, `venue`/`venue__text`, `steps`/`step`/`step__n`, `frame`/`frame__mat`). The `sl-` rules only place them, plus four small components the kit does not have yet (head, foot, panel, ask). When the Foundation ships a shared kit (`0-kit.css`), `sl-head`, `sl-foot`, `sl-panel` and `sl-ask` are the candidates to lift into it; the pages would then swap the prefix and nothing else.

### Page marker and mounted hero (`.sl-page`, all six pages, 2026-10-24, schoollife)
The first `section` of every School life page carries `sl-page`. `.page-hero:has(+ .sl-page) .page-hero__plate` turns the shell's bleed hero plate into a mounted plate inside the band (12 px paper-3 mat, 1 px clay line), like every photograph on the home, without touching `shell.py` or `pages.css` and without affecting other groups. Rule: put `sl-page` on the first section only.

### Head (`.sl-head`, 2026-10-24, schoollife)
The home's sheet head: `h2.display-l` on 10 of 12 columns (18ch), `p.lead` on 7 (54ch), one column under 1024 px. `sl-head--tight` for a head with no lead inside a `layout__main`.
```html
<div class="sl-head">
  <h2 id="x" class="display-l">Short sentence with a full stop.</h2>
  <p class="lead" data-reveal>One paragraph.</p>
</div>
```

### Foot (`.sl-foot`, 2026-10-24, schoollife)
The home's sheet foot: a hairline, one sentence (`sl-foot__text`, 8 columns), one or two actions (`sl-foot__action`, right-aligned from 1024 px; links get a 44 px hit area) and a source line (`sl-foot__source caption`). Every fact-heavy section closes with it, so the source moves from an HTML comment onto the page.
```html
<div class="sl-foot" data-reveal>
  <p class="sl-foot__text">One sentence.</p>
  <p class="sl-foot__action"><a class="link link--arrow" href="...">Action</a></p>
  <p class="sl-foot__source caption">Source: ...</p>
</div>
```

### Panel (`.sl-panel`, 2026-10-24, schoollife)
The home's results-card recipe as a general panel: paper-3, 1 px clay, a 3 px top rule (`--sl-edge`: maroon by default, `sl-panel--gold`, `sl-panel--ink`). Inside: `sl-panel__n` (gold numeral), `sl-panel__label label`, `sl-panel__value` (serif 22 to 30 px), `sl-panel__text` (17 px), `sl-panel__meta` (a dated line on a hairline), `sl-panel__links`. Night variant under `.is-night` (night-2 ground, gold-text edge). Grids: `ul.sl-grid` (2 across from 640 px) with `--3`, `--4`, `--5` from 1024 px; each `li` holds one panel.
```html
<ul class="sl-grid sl-grid--4" data-reveal-group>
  <li><div class="sl-panel"><span class="sl-panel__label label">Uniform</span><p class="sl-panel__value">None for Playgroup and Nursery.</p><p class="sl-panel__text">...</p></div></li>
</ul>
```

### Ask the school (`.sl-ask`, all six pages, 2026-10-24, schoollife)
The one place on a page that says what the school has not yet published, with the lines to call. A gold-edged `sl-panel` with a two-column grid from 900 px (`sl-ask__grid`): left the label, `h2.sl-ask__title`, `sl-ask__intro`, the open items as `ul.sl-ask__list` (gold dashes, no ticks) and `ul.sl-ask__more` links; right a `label`, `ul.sl-ask__lines` of `li.sl-ask__line` rows (`span.sl-ask__who` + `{{phone:key}}`, 44 px each), `p.sl-ask__hours caption` with `{{hours}}` and the `sl-ask__review` line. Rules: one per page; the phrase "not published" appears only inside it; it replaces the three contact cards. On the hub it sits in the right column of an `sl-two` without the inner grid.

### Feats in columns (`.sl-feats`, hub, Sports, Clubs, 2026-10-24, schoollife)
The home's `li.feat` rows (big maroon numeral + 15 px phrase) in 2 columns on a phone, `--3` or `--4` from 1024 px. Only numbers the school states; the section's `sl-foot__source` names the source.

### Two columns (`.sl-two`, 2026-10-24, schoollife)
7 / 5 columns from 1024 px (`sl-two--even` for 6 / 6), one column under. Used for a `venue` beside an Ask panel (hub), a plate beside a `venue` (Sports), the Where-next title beside a panel (School day). `.sl-venue` on a `venue` lets it fill its column (main.css gives `.venue` 7 of 12 columns inside its own grid).

### Hub photo cards (`.sl-cards`, `/school-life/`, 2026-10-24, schoollife)
The home's `ul.ev-grid` with hand-written `li.ev` cards (the `{{children:}}` token writes text cards only): the first two `ev--wide`. Each card is one link (`a.ev__card`), a mounted photograph (`span.ev__media > span.plate__frame > {{img}}`), `ev__n label`, `ev__name`, `ev__text`, `ev__more`. The crop's focal point is set per card with `style="--sl-pos: 50% 60%"` (a custom property, the only inline style the build allows). On a phone the grid is the home's snap row. Rule: a card shows its destination page's own hero frame, so each frame is on at most two pages.

### The day (`.sl-day`, `/school-life/school-day/`, 2026-10-24, schoollife)
The home's `ol.steps > li.step` (ink top line, `step__n display-m`, an action as the `h3`, 17 px text) in a 3 x 2 grid from 1024 px, 2 across from 640 px; a step may carry a small mounted `figure.plate.sl-day__plate` (3:2). No clock times.

### Bus steps (`.sl-steps.sl-steps--3`, `/school-life/transport-and-safety/`, 2026-10-24, schoollife)
Three `steps` in a row from 1024 px inside a `layout__main`.

### Safety ledger (`.sl-safe`, `/school-life/transport-and-safety/`, 2026-10-24, schoollife)
`sl-grid--5` of numbered `sl-panel`s on the `is-night` ground: the page's one dark block.

### The seven games (`.sl-games`, `/school-life/sports/`, 2026-10-24, schoollife)
Three groups (`li.sl-games__group--3`, `--1`, `--3b`; 5 + 2 + 5 of 12 columns from 1024 px), each a `label` on an ink rule and `ul.sl-games__tiles` of `li.sl-games__tile` (gold `sl-games__n`, serif `sl-games__name`, `sl-games__place`). Text only, no icons.

### Activity tiles and chips (`.sl-tiles`, `.sl-tile`, `.sl-chips`, `/school-life/clubs-and-activities/`, 2026-10-24, schoollife)
Inside the existing `[data-filter-scope]`: `ul.chips.sl-chips` (on a phone one scrolling row with a fade at the right edge; the `li`s do not shrink) and `ul.sl-tiles` of `li[data-tags]` holding `div.sl-panel.sl-tile` (gold edge; `sl-tile--proof` maroon edge when the tile carries a dated result in `p.sl-panel__meta.sl-tile__proof`). 1 / 2 / 3 / 4 columns at 0 / 640 / 1024 / 1440 px. `li[hidden]` is hidden by the group's own rule.

### Pair (`.sl-pair`, `/school-life/clubs-and-activities/`, 2026-10-24, schoollife)
Two mounted plates stacked in a `split__figure` column (side by side between 560 and 899 px).

### Plate trio (`.sl-trio`, `/school-life/culture-and-service/`, 2026-10-11, schoollife)
One tall plate beside two landscape plates stacked, equal footprint, one column on a phone. Exactly three items; the first is the tall one (it spans both rows from 640 px), the other two carry the same crop class.

### Days rail and frame column (`.sl-days`, `.sl-frame-col`, `/school-life/culture-and-service/`, 2026-10-24, schoollife)
`sl-days`: the `ol.timeline` on 7 columns and a right column on 5 from 1024 px. `sl-frame-col`: the home's ceremonial `figure.frame > div.frame__mat > {{img}}` (maroon mount, gold inner line; `grid-column` reset so it fills the column) with an optional small `figure.plate` under it. One `.frame` per page at most.

### Chapter index cue (`.sl-chapnav`, `/school-life/culture-and-service/`, 2026-10-24, schoollife)
Under 1024 px the scrolling `chapter-nav` row gets 56 px of room after the last link and a mask fade at its right edge, so the last chapter never looks cut. Scoped to this group; the shared component is unchanged (the Foundation fix is requested in `../redesign-2026-10-24-pages/build/schoollife-nav-requests.md`).

### Visit prompt (`.sl-visit`, hub and Sports, 2026-10-24, schoollife)
One sentence (`sl-visit__text`) and one `btn btn--secondary` on a hairline, at the point of interest. The sentence follows the admissions rule: call first, the office confirms the day; no tour is promised.

## Review round, 2026-10-24 (later the same day)

### Focal point on a plate (`.sl-pos`, Sports, Clubs, 2026-10-24, schoollife)
`figure.plate.sl-pos` with `style="--sl-pos: 50% 15%"` moves the crop's focal point (custom properties are the one inline style the build allows; the hub's cards already used `--sl-pos` on `.ev__media img`). Used on the Sports Day band (`50% 15%`: the spectators at the foot of `media/life-7` leave the 16:9 crop), the games plate (`50% 85%`: the match, not the top storeys) and the paper-craft plate on Clubs (`50% 25%`: the half-cut label at the foot leaves the 4:3 crop). Only works where the plate's ratio differs from the file's.

### Capped band plate (`.sl-band`, Sports, 2026-10-24, schoollife)
`max-width: 1440px; margin-inline: auto` on the Sports Day band: `media/life-7` is catalogued "distance" and its 100% check covered the 1440 file; at 1920 px the front rank would be shown a third larger. No effect under 1440 px plus margins.

### Portrait plate at 3:4 (`.sl-plate--3x4`, Culture, 2026-10-24, schoollife)
`pages.css` has 16:9, 3:2, 4:3, 4:5 and 21:9; the 2024 welcome board (`img/gal-acp24-welcome`) is 3:4 and lost its "2024" blocks in a 4:3 plate. This one rule shows the whole frame.

### Pair in a row (`.sl-pair--row`, Clubs, 2026-10-24, schoollife)
`ul.sl-pair.sl-pair--row` sets two columns from 640 px (the plain `.sl-pair` stacks inside a split's figure column). In the studio now runs the pair across `layout__main` (8 columns) with the prose in `layout__aside`, so the section is one screen deep.

### Column inside `.sl-two` (`.sl-two__col`, hub, Sports, 2026-10-24, schoollife)
A `div.sl-two__col` stacks two blocks in one column of `.sl-two` (the hub's Houses venue over its visit prompt; the Sports games plate over the Kit note), with `clamp(24px, 3vw, 40px)` between them, so a short venue no longer sits beside a tall panel with a void under it. `.sl-venue .link-list` gets 16 px above it.

### Caption under the maroon frame (Culture, 2026-10-24, schoollife)
`.sl-frame-col .frame .plate__cap` places the house caption inside the maroon frame under the mat, paper text and a gold number, so the frame takes a plate number like every other photograph (the plates no longer jump 05 to 07).

### Card counter (`.sl-counter` + `schoollife.js`, hub, 2026-10-24, schoollife)
Under the hub's `.sl-cards` row: `<p class="sl-counter" aria-hidden="true"><span class="counter__cur"><span class="counter__num">01</span></span><span class="counter__sep"> / </span><span class="counter__total">05</span></p>`, the home's Ascent counter markup. Shown under 640 px only, where the row scrolls and snaps; `schoollife.js` moves the number with the row's scroll position (passive listener, one frame at a time) and fills the total from the number of cards. Without JavaScript it reads "01 / 05" and stays. `counter__cur` / `counter__num` come from `main.css`; `counter__sep` and `counter__total` get their colour here.

### Activity tiles on a phone (Clubs, 2026-10-24, schoollife)
From 360 to 639 px `.sl-tiles` is two columns with 12 px gaps and compact type (value 19 px, text 15 px, 14 px padding), so the eleven tiles take six rows; under 360 px they fall back to one column. The desktop grid is unchanged (3 columns from 1024, 4 from 1440).

### Eyebrow override (all five child pages, 2026-10-24, schoollife)
Not a component: the five child pages carry `eyebrow: School life` in their front matter so the shell prints the group name instead of "Page N of 05", which contradicted the hub's card order while `nav.json` lists the group as Sports, Clubs, Culture, Transport, School day (nav request 1). Delete the line from the five sources when `nav.json` is reordered.

## Review round 3, 2026-10-24 (schoollife)

### Band cap and 3:1 band (`.sl-band`, `.sl-band--3x1`, Sports)
`.sl-band` is now capped at **1200 px** (was 1440): the Sports Day band is `img/sl-march-band`, a 3:1 cut from the `media/life-7` source whose 100 % check covered the 1200 file. `.sl-band--3x1 img` sets `aspect-ratio: 3 / 1`; under 640 px the same image is shown 16:9 (the middle of the frame, scaled down). The band no longer uses `.sl-pos`.

### Three feats on a phone (`.sl-feats--3`, hub, Sports, Clubs)
Under 640 px the third `.feat` spans both columns (`grid-column: 1 / -1`), so three figures stack 2 + 1 with no empty cell.

### Day plates at the foot of the step (`.sl-day`, School day)
`.sl-day .step` is a flex column and `.sl-day__plate` has `margin-top: auto` (18 px of padding above); from 1024 px the plate image is 16:9. A step's photograph sits at the row's bottom edge and the hairline tops stay level.

### Night panels at their own height (`.sl-safe`, Transport)
`.sl-safe { align-items: start }` and `min-height: 0` on its panels: the three one-line safeguards no longer stretch to the height of the two with a text line.

### Days rail date column (`.sl-days`, Culture)
From 768 px the timeline item is `minmax(13rem, 3fr) 6fr` with 36 px of left padding, and the date does not wrap ("16 December" on one line; the tick clear of "Each year").

### Activity names as headings (Clubs)
Inside `.sl-tile` and the Trips panels the name is `h3.sl-panel__value` (the class sets the font, so an `h3` and a `p` look the same). Use the heading in a tile or panel whose name a reader may want to jump to.
