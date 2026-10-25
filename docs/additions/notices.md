# Additions: notices (2026-10-22, notices redesign)

Spec: `redesign-2026-10-22-notices/spec.md` §7. The notice card and its parts (`nb-card`, `nb-status`, `nb-topic`,
`nb-tile`, `nb-grid`, `nb-board`, `nb-empty`, `nb-ask`, `nb-count`, `nb-none`) are shared with the home page and live in
`site/css/main.css` (see `docs/COMPONENTS.md` §4.15). This group adds only the `nbp-` page layout and one script.
Notice wording comes from spec §6, word for word; do not paraphrase it here.

### Notices-now band (`div.band.nbp-now`), /notices/
The first section's band. Warm `--paper-2` board, painted full width behind the band (box-shadow plus `clip-path`, so no
layout change and no horizontal scroll), with its own top and bottom padding (72 px at the bottom on phones, for the
sticky call bar). It is also the `data-filter-scope` for the topic chips and the hook for `notices.js`.

    <div class="band nbp-now" data-filter-scope> sheet-rule, h2, p.nb-count, chips, div.nb-board, details.nbp-ended, p.filter-empty </div>

### Ended notices (`details.nbp-ended`)
Ended notices folded in a native `<details>`, closed by default, works without JS. The summary is a 22 px serif line
with the count and a round 44 px +/− marker (`::after`); the native marker is hidden; focus ring in maroon.

    <details class="nbp-ended">
      <summary class="nbp-ended__summary">Ended notices (1)</summary>
      <div class="nb-grid nbp-ended__grid"> article.nb-card.nb-card--ended ... </div>
    </details>

Rules: keep the count in the summary right by hand (the script corrects it only when it moves a card). An ended card
keeps `data-tags` so the topic chips still find it.

### Script (`build/additions/notices.js`)
Runs only when `.nbp-now` is on the page.
1. **Date guard.** A board card with `data-ends="YYYY-MM-DD"` whose date has passed (compared with today's local date;
   the last day still counts) gets `nb-card--ended`, the status chip "Ended", a visually hidden " (ended)" in its title,
   and moves into `.nbp-ended__grid`. The summary count and the `nb-count` line are updated ("1 notice applies now.").
   If no current card is left, it adds `<p class="nb-none">There is no current notice from the school right now.</p>`.
   Set `data-ends` only where the school gave a real end date.
2. **Filter follow-up.** After a topic chip is pressed (`js/inner.js` filters first, the script waits one tick), it
   opens the Ended details when only ended notices match, and closes it again (if it opened it) when a current one
   matches. The "No other notice" slot hides while a topic other than "All topics" is chosen.
Everything is wrapped in try/catch; `js/inner.js` is not edited.


## Pages redesign, 2026-10-24 (group events-gallery-news)

- **Ended notices summary fixed.** The label is one `span.nbp-ended__label` and the round marker is pushed right with `margin-left: auto` (no `justify-content: space-between`), so "Ended notices (1)" reads as one phrase. `notices.js` still rewrites the summary text when it moves a card.
- **No reference card on the board.** The plan's permanent "school year" card waits for the founder's decision (critique 7.5): the home's board is built from the same notices, so the `nb-empty` slot stays. The two lines that were the "How notices work" prose now close sheet 01 as an `egn-foot` (with its source), and the "No other notice has been given" `empty-note` is gone; its CONFIRM is in the sheet 01 source.
- **Sheet 02 "Three places a notice reaches you"**: three `egn-panel`s (this page, the parent portal, SMS and email) in `egn-panels--3`, with an `egn-foot` carrying the phone line and the source. The `egn-` classes are documented in `docs/additions/events.md`.
- **No `{{cta}}`** (critique X5): a current-parent page ends on its routes. The page carries `body_class: egn-page` for the kit classes only; it has no hero photograph.
