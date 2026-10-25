# Additions: admissions group

Files: `build/additions/admissions.css`, `build/additions/admissions.js` (this note) and `build/additions/admissions-form.css|.js` (the online admission form, `docs/additions/admissions-form.md`). Pages: /admissions/, /admissions/how-to-apply/, /admissions/fees/, /admissions/visit/, /admissions/enquire/, /admissions/starting-at-playpen/, /admissions/faq/. First written 2026-10-11; rebuilt 2026-10-24 for the redesign to the home's grammar (`redesign-2026-10-24-pages/plans/admissions.md`).

Every admissions page carries `body_class: adm` in its front matter, so the group's restyles (`.adm .section-title`, `.adm .steps`, `.adm .feats`, `.adm .ev-grid`, `.adm .venue`) touch no other group. The `adm-` components below are the group's own copies of the inner page kit named in `research/design-language.md` section 3 (`pk-head`, `pk-foot`, `pk-panel`, `pk-plate`, `pk-cover`, the step draw and the H2 rise); when the kit ships as `build/additions/0-kit.css|js`, each `adm-` rule can be deleted and its class renamed in the seven sources.

### Section title voice and rise (`.adm .section-title`, 2026-10-24, admissions)
Inside `.adm`, `h2.section-title` takes the home's `display-l` size (36 to 96 px, 300 weight from 1715 px, 18ch). With `data-reveal` on the H2 it waits at opacity 0 and, when `is-in` arrives, runs the shell's own `pp-title-rise` keyframes once (clip from the bottom and a 0.4em rise). Rule learnt the hard way: never park the hidden H2 at `clip-path: inset(0 0 100% 0)`; an element clipped to nothing is never "intersecting", so the reveal observer never fires. Off under `prefers-reduced-motion` and `html[data-motion="reduced"]`.

### Sheet head (`.adm-head`, 2026-10-24, admissions)
The home's sheet head grid: H2 on 10 of 12 columns, lead on 7, one column on phones, `margin-bottom` clamp(36px, 4.5vw, 64px); `.adm-head--tight` for a head with no lead.
```html
<div class="adm-head">
  <h2 id="x" class="section-title" data-reveal>Start with your child's class.</h2>
  <p class="lead" data-reveal>One paragraph, at most 54ch.</p>
</div>
```

### Sheet foot (`.adm-foot`, 2026-10-24, admissions)
A hairline, a sentence on 8 columns, an action on the right, a `caption` source line under both. Every fact-heavy section ends with it; the source line moves from comments onto the page.
```html
<div class="adm-foot" data-reveal>
  <p class="adm-foot__text">What to bring with the form: ...</p>
  <p class="adm-foot__action"><a class="btn btn--secondary" href="..."><span class="btn__label">How to apply</span></a></p>
  <p class="adm-foot__source caption">From the school's admission procedure page, read on 11 October 2026.</p>
</div>
```

### Panel (`.adm-panel`, `--gold`, `--ink`; `.adm-panels`, `--3`, `--4`; 2026-10-24, admissions)
The home's card recipe: paper-3, 1 px clay, a 3 px coloured top rule (maroon by default, `--adm-edge` token). `.adm-panel__head` (title and an optional `label`, hairline under), `.adm-panel__body`, `.adm-panel__foot` (hairline, a small print and a button), `.adm-panel__go` (a link pinned to the bottom of a card in a row). `ul.adm-panels` lays cards two across from 640 px and three or four from 1024 px; cards in a row stretch to one height. Used for the entry cards, the fee amounts, the printable lists, the two "get the form" cards, the uniform stage cards and the FAQ's most-asked cards. One maroon-ruled panel per screen at most; gold for lists and secondary cards.

### Two-part row (`.adm-row`, `--8`, `__main`, `__side`, `__side--sticky`; 2026-10-24, admissions)
The home's 7 / 5 split (or 8 / 4 with `--8`) from 1024 px, stacked below; the side can stick under the header.

### The opening (`.adm-open`, `.adm-hero-actions`, `.adm-plate`; 2026-10-24, admissions)
The shell writes the breadcrumb, the rule, the H1 and the standfirst; the first body section (`page-section adm-open`, padding-top 0) continues the first screen with a button row (one primary at most) and a mounted, art-directed plate. `figure.plate.adm-plate` holds two `{{img}}`s: `.adm-plate__wide` (shown from 768 px; 16:9 by default, `--21x9`, `--3x2`) and `.adm-plate__tall` (phones; 4:5 by default, `--4x3`, `--3x2`). The hidden one is `display:none` and lazy, so a browser fetches only the one it shows. `--inset` keeps a 1440-wide source inside 72rem. The curtain comes from `figure.plate[data-reveal]` in pages.css. The section needs a visually-hidden H2.
```html
<section class="page-section adm-open" aria-labelledby="x-open">
  <div class="band">
    <h2 id="x-open" class="visually-hidden">The atrium</h2>
    <p class="adm-hero-actions" data-reveal><a class="btn btn--secondary" href="#get-form"><span class="btn__label">Get the form</span></a><a class="btn btn--text" href="#call">Which line do I call?</a></p>
    <figure class="plate adm-plate adm-plate--21x9" data-reveal><div class="plate__frame">
      <span class="adm-plate__wide">{{img src="img/admissions-atrium" alt="..." sizes="100vw" widths="960,1440"}}</span>
      <span class="adm-plate__tall">{{img src="img/apply-atrium-tall" alt="..." sizes="100vw" widths="720,960"}}</span>
    </div></figure>
  </div>
</section>
```

### Cover (`.adm-cover`, hub only; 2026-10-24, admissions)
The home's cover at page scale, written in the body with the page's own `<h1>` because the shell has no `hero: cover` key yet (navRequests N6). A `header.adm-cover`: the rule on paper in a `.band`, then `.adm-cover__media` (`__wide` 16:9 from 768 px, `__tall` 4:5 on phones, `min(78svh, 760px)` / `min(92svh, 640px)` tall), `.adm-cover__scrim` (the home's two-direction ink scrim: 86 % from the bottom, 34 % from the left, as `color-mix` of `--ink`) and `.adm-cover__copy` (H1 at the shell's H1 size, lead, `.adm-cover__actions` with one primary button and a text button, all in paper, `em` in `--gold-text`). The H1 and lead run the shell's `pp-title-rise` / `pp-fade-rise`. Forced colours: the scrim goes and the copy drops under the picture. Only for a hub, and only with a frame whose lower-left quarter is dark enough for 4.5:1 under the scrim.

### Class picker (`.adm-picker`, `.adm-entries`, `.adm-entry`; 2026-10-24, admissions; admissions.js part 1)
`div.adm-picker[role="group"][aria-labelledby]` with a visible label, three bracket groups (`label` + `ul.chips` of `button.chip[data-class][data-bracket][data-line][aria-pressed]`), a `select.adm-picker__select` that replaces the tiles under 480 px, and a `chips__status` live region. The section carries `data-adm-scope`; inside it `ul.adm-entries` holds one `li.adm-entry.adm-panel[data-bracket]` per bracket (`pg`, `kg`, `xi`, `xx`), with ids `entry-pg|kg|xi|xx` so the old deep links still work. Choosing a tile (or the select) presses that one tile, shows the one card, lights the matching `.call-line[data-line]` anywhere on the page (`is-chosen`, a 3 px gold left rule) and remembers the class on the device (`localStorage` `pp:adm-class`, through `PP.store`, try/catch). A `#entry-<bracket>` hash opens that bracket, also on `hashchange`. Without JavaScript the picker is hidden and every card shows (two across from 640 px while nothing is chosen). The picker invents nothing: it routes to facts already on the pages.

### Remembered class on the other pages (admissions.js parts 1 and 2)
On Book a visit and Enquire the remembered class pre-fills `select[data-route]` and the route hint shows; choosing a class there is remembered too. On Fees, Starting at Playpen and the FAQ (no picker, no form) the remembered class only lights its call line. The class is a convenience: every page is complete without it.

### Call sheet (`ul.call-lines`, `.call-line.is-chosen`, `.call-band`, `.adm-call`; 2026-10-11, is-chosen 2026-10-24; admissions)
The three admissions lines set large: the section in small capitals, the number in Newsreader (`{{phone:key class="call-line__tel"}}`, 44 px target), a hairline under each. Works on paper and on the night ground. Each `li` carries `data-line="pg-1|ii-vi|vii-xii"` so the picker can light it. `.call-band` is the two-column band (statement left, lines right; `.call-band__actions` for buttons); `.adm-call` is the plain stack (label, lines, hours line). **Rule since 2026-10-24: one call sheet per page** (the CTA band's own buttons do not count); everything else says "the line for your child's section" and links `#call`.

### Form layout (`.adm-form-layout`, `__side`, `__main`, `.adm-after`; 2026-10-24, admissions)
On Book a visit and Enquire the side (the call sheet, or the answers already on the site) comes **first in the DOM**, so a phone reads it before the form; from 1024 px grid rows place the form left and the side right, sticky (critique X18: DOM order, not CSS `order`). `ol.adm-after` is the small numbered "after you press send" list.

### Tick labels (`.adm .page-form .field.page-form__guardian .choice`, `.page-form__join`; 2026-10-24, admissions)
The guardian and join ticks read at 17 px serif beside their box, like the WhatsApp/SMS ticks (pages.css gave every label inside `.field` 13 px sans and the field's column layout, which stacked the words above the box).

### Tickable list (`.adm-check`, `--cols`, `__item`, `__go`; `[data-adm-store]`; 2026-10-24, admissions; admissions.js part 4)
Real checkboxes in hairline rows (44 px), a label each, an optional link under the label (`p.adm-check__go`, `data-print-skip`). With `data-adm-store="<name>"` the ticks are remembered on the device (`pp:adm-check:<name>`); the list is complete without them. Lives inside a gold `.adm-panel` with a `p.print-only` title and a `[data-print-list]` button. Used for the visit questions, What to bring, the fee questions and Before the first day. Kit candidate (critique section 8).

### Collapsed online form (`.adm-forms`, `[data-adm-toggle]`, `[data-adm-close]`; 2026-10-24, admissions; admissions.js part 5)
On How to apply the `.af` online form sits in `div#forms-panel.adm-forms[hidden][tabindex="-1"]` under the two "get the form" cards. The card's primary button (`aria-expanded`, `aria-controls="forms-panel"`) opens it and moves focus to it; `#forms` in the address, a `hashchange` to it, or a click on any link ending in `#forms` opens it too; a `[data-adm-close]` button closes it. The section keeps `id="forms"`, so every existing link lands here. Without JavaScript the panel is open (and the form, which needs JavaScript, gives way to its note; the PDFs are in the card above).

### Enquire topics (`.adm-topics[data-adm-topics="<textarea id>"]`, `.adm-answer[data-topic]`; 2026-10-24, admissions; admissions.js part 7)
Single-choice chips (`button.chip[data-topic][aria-pressed]`) with a status line; one `.venue.venue--note.adm-answer[data-topic][hidden]` per topic shows under them and the question box is pre-filled with "About <topic>: " when it is empty. `#topic-<key>` in the address presses a chip (the Fees page links `{{link:/admissions/enquire/#topic-fees}}`; each chip's `li` carries the id so the checker finds the anchor). Hidden without JavaScript. The answers repeat facts from the pages they link to; nothing new is claimed.

### FAQ search and topic links (`.adm-search[data-adm-search="<scope id>"]`, `.adm-jump`; 2026-10-24, admissions; admissions.js part 6)
A `type="search"` input in a `.field` filters `details.accordion__item` inside the scope by question and answer text as you type (a group with no match is hidden too), opens the matches, and says "n of N questions match" in its status line; hidden without JavaScript. `.adm-jump` is `ul.chips` of plain anchor links (`a.chip`) to the groups; on this page the `chapter-nav` row is hidden under 1024 px so there is one row of topics, not two.

### Route hint (`select[data-route]`, `.route-hint`; 2026-10-11, admissions; admissions.js part 2)
The class chosen in a form shows the admissions line for that class under it. Each `option` names its line with `data-line`; the hint box is a polite live region with one `p.route-hint__line[data-line]` per line, all `hidden`; `is-on` gives it its panel. Do not put `hidden` on the box.

### Home components on the admissions pages (`.adm .steps`, `.adm-steps--3`, `--col`, `.adm-feats`, `.adm .ev-grid--6`, `.adm .venue`; 2026-10-24, admissions)
`ol.steps` (the home's step grammar: ink top line, gold `display-m` numeral, h3 action, 17 px text; `data-reveal-group` on the list) with `--3` for three steps from 640 px and `--col` for five steps in two columns inside a `layout__main`; the ink line draws as each step comes in (`.step::before` from `scaleX(0)`), off under reduced motion. `ul.feats.adm-feats` lays the home's numeral rows in two columns from 1024 px (numeral `aria-hidden`, a visually-hidden phrase, source in the `adm-foot`). `ul.ev-grid.ev-grid--6` lays six of the home's photo cards three across from 1024 px (the home's own phone row that snaps sideways below). `.venue` (`.venue--note` at 17.5 px) is the one highlighted statement, in flow.

### Printable list (`[data-print-list="#id"]`, `.print-only`, `.print-btn-row`; 2026-10-11, admissions; admissions.js part 3)
A button that prints one list rather than the page. admissions.js copies the element named by `data-print-list` into a `.print-sheet` appended to the body (ticked boxes stay ticked in the copy), adds `print-list` to `<html>`, calls `window.print()` and removes both afterwards (afterprint, with a one-minute fallback). Put a `p.print-only` at the top of the list's wrapper; mark what should not print with `data-print-skip`. The button is hidden without JavaScript.

### Online form bar on phones (`.af__more`, `.af__more-menu`, `[data-adm-more]`; 2026-10-24, admissions-form.css, admissions.js part 8)
Under 640 px the `.af__bar` is static (it covered the fields when sticky) and one column: "Download filled form (PDF)" and a "More" disclosure (`aria-expanded`, `aria-controls="af-more"`) holding Print blank, Clear and, when the portal is on, Send online. From 640 px the disclosure's contents sit in the bar as before (`display: contents`) and "More" is hidden. The same stylesheet fixes `.af__privacy` (a block, not a flex row; the first sentence in `.af__privacy-text`) and stacks the sibling table's cells under 640 px (admissions-form.js writes `data-label` on each cell).

### Removed on 2026-10-24
`ul.entry-points` / `.entry` (the three-column entry points; the `dl.entry__facts` rules stay and are used inside `.adm-entry` and the Visit arrival card), `.fee-panel`, `ol.ask-list`, `.chapter-cards--three`, the night checklist rules (`.is-night .checklist`): no page uses them any more.

## Review fixes r1 (2026-10-24, admissions)

The parent-lens review of the seven pages (`redesign-2026-10-24-pages/review/admissions/r1/lens-parent/`) found one real defect and a set of smaller ones; this is what changed in the group's own files.

### Button weight in the first screen (rule, 2026-10-24)
**Action pages take a primary button, reference pages a secondary one.** The hub ("Book a visit"), Book a visit ("Book a visit"), Enquire ("Ask a question") and How to apply ("Get the form") open with `btn--primary`; Fees and payment ("Ask about fees"), Starting at Playpen ("The first-day list") and the FAQ ("Search the questions") open with `btn--secondary`. The second button in the row is always `btn--text`. One primary per first screen at most; the shell's header button does not count.

### Entry facts (`dl.entry__facts` inside `.adm`, 2026-10-24)
The old `.entry` rules left pages.css with the entry points, so the `dl` had no dt/dd styling and each card read as ten identical serif lines. Inside `.adm` it now follows the home's `nb-card` label/value grammar: `> div` is a hairline row (12 px padding), `dt` a small-caps sans label (11.5 px, 0.08em, `--ink-2`), `dd` 17 px serif. Used by the four entry cards on the hub and How to apply, and the arrival card on Book a visit.

### Tick boxes on one line (`.page-form__guardian`, `.page-form__join`, 2026-10-24)
main.css gives every `input` inside `.field` `min-height: 48px`, which drew the 22 px box in the middle of a 48 px row, a line below its words. The group's rule adds `min-height: 0; max-height: 22px; padding: 0`, so the box sits on the first line of the label.

### Hints above the input line (Book a visit, Enquire; 2026-10-24)
`.field` is a flex column, so a `p.field__hint` placed between the `label` and the `input` in the source sits above the input line and never reads as the label of the next field. Both forms now do this for every hint ("First name only", the phone hint, the time hint); `aria-describedby` is unchanged. The phone hint reads "Leave a number you answer; the office replies by telephone." on both forms (an enquiry has no "result").

### Enquire opening (`.adm-callband`, `.adm-callband__tile`; 2026-10-24)
The call band gets the same `.adm-hero-actions` row as the other six pages (primary "Ask a question" to `#enq-fields`, the form note, `tabindex="-1"`; text "Or call the line" to `#call`). The soft 260 px brick swatch is replaced by the crest cast in concrete, `img/adm-crest` (a 3:2 detail of DSC03968, people none, graded), shown 1:1 on the paper mount: 260 px under the text from 640 px, and a 96 px tile beside "Prefer to call?" on phones (the `.call-band__text` becomes a two-column grid under 640 px), so the first screen has one object at every size.

### Book a visit: the after-send list and the CTA target (2026-10-24)
"After you press send" sits after the form in the source and on the screen (`.adm-after-wrap`), where the act of sending is; the side column keeps the call sheet only. The hero's primary button lands on `#visit-fields` (the form note, `tabindex="-1"`), not on the section's H2, so a phone lands one line above the first field.

### The hub's six cards (`img/adm-card-*`, `.adm .ev-grid--6` under 640 px; 2026-10-24)
One stem per card (`adm-card-visit`, `adm-crest`, `adm-card-apply`, `adm-card-fees`, `adm-card-starting`, `adm-card-faq`; 480 and 960, 3:2), every one cropped from the vault frame and run through `grade()` v2 with a 0.2 EV highlight pull, so the grid reads as one set. The Enquire card is the crest (the Enquire page's own tile) and the Visit card the creepers and brick ground floor, so no two cards show the same wall and the terrace appears once in the grid, on Starting. Under 640 px the home's swipe row (1.2 cards visible, no cue) gives way to a stacked list: 96 px square thumbnails, name, line and arrow, hairline rows; all six pages visible without a gesture.

### Plates and the cover (2026-10-24)
`img/visit-entrance-wide` is re-cropped to x 0 to 0.535 of DSC03968 (16:9), which keeps the overhead wires outside the frame; `img/visit-entrance-tall` (4:5) is the phone crop of the same straight-on frame with the crest large (the oblique `img/admissions-entrance` is no longer used by the group). `img/apply-atrium-wide` (21:9) starts at the concrete column (x 0.50 of DSC01290), so neither painted wall is in the desktop plate. `img/admissions-cover` and `-cover-tall` are re-graded (grade() v2, highlights pulled 0.3 EV: the clipped sky settles towards paper, the lawn dims) and the phone scrim holds 78 % ink to 45 % of the height, so the lead's last line keeps 4.5:1 over the lawn. `.adm-plate--inset` is centred (`margin-inline: auto`), so the Fees plate is inset equally on both sides.

### Fees and payment (2026-10-24)
The gap is said once, in the amounts panel ("The school has not published a fee schedule"); step 03, the section 01 foot and the paying foot say what to do instead. The amounts panel carries `id="call"` (the group's `#call` convention; `adm-call` for the picker's lit line). The section 05 card to Starting at Playpen is gone: the paying foot already carries that route.

### Starting at Playpen, the Books figure (2026-10-24)
`img/adm-bookfair-letters` is a 3:2 crop of the school's painted Book Fair sign on its lettering (from the site's own `gal-bookfair-sign` derivative; people: a painting). It is a photograph of a painted sign; no pupil is photographed, and the painted child figure at the foot of the sign is outside the crop (CONTENT-TO-CONFIRM P26).

### Source comments
The comments that said "no {{cta}}" on the FAQ and Starting at Playpen were token-expanded by the build (a whole CTA band inside a comment); they now say "no cta token".

### Round-2 fixes (2026-10-25)
- `.adm-plate--w3x2`: a 3:2 plate from 768 px only; the phone keeps the `.adm-plate__tall` crop at 4:5 (`.adm-plate--3x2` sets both pictures to 3:2). Book a visit uses it with `.adm-plate--inset`.
- `img/visit-entrance-wide` is now 3:2 (px 0,1330 to 3000,3330 of DSC03968): a 16:9 that holds the whole crest and the entrance cannot keep the overhead wire bundle out, so the plate went 3:2 on the inset mount. The hub's Book a visit card shows the whole picture (3:2 card) and, in the 96 px phone square, its right side (`object-position: 100% 50%`).
- `.adm-panel__head + .entry__facts`: the first fact under a panel head has no rule of its own (one hairline, not two).
- `.adm-entries--brief`: on phones the gold Class X and XII card (no facts) closes on its head while the cards are title-only.

