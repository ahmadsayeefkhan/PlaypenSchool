# Additions: admissions group

Files: `build/additions/admissions.css` and `build/additions/admissions.js`. Pages: /admissions/, /admissions/how-to-apply/, /admissions/fees/, /admissions/visit/, /admissions/enquire/, /admissions/starting-at-playpen/ (2026-10-11).

### Entry points (`ul.entry-points`, hub and how to apply, 2026-10-11, admissions)
Three columns on a desktop (stacked on a phone): the classes in large type, then a short `dl` of what the school does at that entry point. On /admissions/how-to-apply/ the same list sits inside a `[data-filter-scope]` band with chips (`data-filter="pg|kg|xi"`) and each `li` carries `data-tags` and an id (`entry-pg`, `entry-kg`, `entry-xi`); with one chip chosen the remaining card takes a column of its own. A link such as `how-to-apply/#entry-kg` presses the matching chip (admissions.js, section 1) and scrolls to the card; without JavaScript all three cards show.
```html
<ul class="entry-points" data-reveal-group>
  <li class="entry" id="entry-pg" data-tags="pg">
    <p class="entry__n label">Entry point 01</p>
    <h3 class="entry__title">Playgroup and Nursery</h3>
    <dl class="entry__facts"><div><dt>How the child is assessed</dt><dd>An assessment</dd></div></dl>
    <p class="entry__go"><a class="link link--arrow" href="{{link:/admissions/how-to-apply/#entry-pg}}">How to apply for Playgroup or Nursery</a></p>
  </li>
</ul>
```
Rule: use it for a short set of parallel choices (three is the shape); heading level h3 under an h2. Without JavaScript the chips, their status line and the empty message are hidden (they would do nothing) and all three entry points show.

### Call sheet (`ul.call-lines`, `.call-band`, 2026-10-11, admissions)
The three admissions lines set large: the section on the left, the number in Newsreader on the right (stacked under 480 px). Works on paper and on the night ground (rules, labels and numbers turn paper and gold). Each number is `{{phone:key class="call-line__tel"}}`, so it can never differ from nav.json. `.call-band` is the two-column band around it (statement left, lines right).
```html
<div class="call-band">
  <div class="call-band__text"><h2 class="section-title">Call the line for your child's section.</h2><p>Lines are open {{hours}}.</p></div>
  <ul class="call-lines"><li class="call-line"><span class="call-line__who">Playgroup to Class I</span>{{phone:pg-1 class="call-line__tel"}}</li></ul>
</div>
```
`/contact/` has its own night call sheet (`.contact-lines`, contact-legal group); the two were written separately.

### Class-to-line hint (`select[data-route]`, `.route-hint`, 2026-10-11, admissions)
On a form page the class chosen in the select shows the admissions line for that class under it. Each `option` names its line with `data-line="pg-1|ii-vi|vii-xii"` (an option without it, such as "Not sure yet", shows nothing); the select's `data-route` is the id of the hint box; the box holds one `p.route-hint__line[data-line]` per line, all `hidden`. The box is a polite live region (`role="status" aria-live="polite"`) that is always in the page and has no size until a class is chosen (admissions.js adds `is-on`, which gives it its panel), so a screen reader announces the line when the choice changes. Do not put `hidden` on the box: a region that is `display: none` is not announced. The numbers are `{{phone:key}}` tokens. Without JavaScript the box stays empty and the form's `noscript` note and phone lists carry the numbers.

### Fee panel (`.fee-panel`, 2026-10-11, admissions)
A rule, a large light statement on the left and the explanation with `{{phones}}` on the right. Used on /admissions/fees/ to say plainly that no amounts are published. It is meant for a missing fact, not for a call to action.

### Ask list (`ol.ask-list`, 2026-10-11, admissions)
Numbered one-line questions on hairline rows, gold two-digit numbers. For a short list of things to put to the school.

### Night checklist and two-column checklist (`.is-night .checklist`, `.checklist--cols`, 2026-10-11, admissions)
`.checklist` (pages.css) gains night colours (hairlines, gold ticks) and an optional two-column layout from 900 px.

### Printable list (`[data-print-list="#id"]`, `.print-only`, `.print-btn-row`, 2026-10-11, admissions)
A button that prints one list rather than the page. admissions.js copies the element named by `data-print-list` into a `.print-sheet` appended to the body, adds `print-list` to `<html>`, calls `window.print()` and removes both afterwards (afterprint, with a one-minute fallback). The print stylesheet shows only the sheet. Put a `p.print-only` (hidden on screen, shown in the print) at the top of the list's wrapper with the school's name and the list's title. The button is hidden without JavaScript.
```html
<div id="apply-bring"><p class="print-only">The Playpen School, Dhaka: what to bring with the admission form.</p><p class="label">What to bring</p><ul class="checklist">...</ul></div>
<p class="print-btn-row"><button class="btn btn--secondary" type="button" data-print-list="#apply-bring"><span class="btn__label">Print this list</span></button></p>
```

### Spacing helpers for lists (2026-10-11, admissions, review)
Four small rules at the end of `admissions.css`: a `.label` straight above a `.checklist` sits 14 px over it (it sat on the list's top rule); a `.small-print` straight under a `.label` sits 10 px under it; a `.contact-cards` straight under a `.small-print` sits 18 px under it; and `.contact-cards` inside a `.layout__aside` is a single column with 16 px between cards (the Foundation's rule gives two or three columns, too narrow for an aside). Used on /admissions/how-to-apply/ (What to bring) and /admissions/starting-at-playpen/ (the two uniform branches in the aside).

### Three chapter cards in a row (`ul.chapter-cards--three`, 2026-10-11, admissions, review)
The Foundation's `.chapter-cards` has two columns from 640 px and three from 1024 px, so three hand-written cards leave one alone on a tablet. `chapter-cards chapter-cards--three` gives three columns from 720 px. Used on the hub ("Before you apply").
