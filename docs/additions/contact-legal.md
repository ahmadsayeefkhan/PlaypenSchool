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
