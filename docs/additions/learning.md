# Additions: learning group

Rules and file names are in `docs/COMPONENTS.md`, section 10. Styles: `build/additions/learning.css`. No script was needed: the filter chips, accordions and chapter index on these pages are the Foundation's own.

### Class path (the hub /learning/ and /learning/cambridge-pathway/, 2026-10-11, learning)

The sixteen classes (Playgroup to Class XII) in a line, grouped under their four stages, like the rule on the home. Each stage is a list item whose width in classes is the custom property `--n` (the only inline style allowed). It is built as nested lists, so a screen reader reads "Elementary: Playgroup, Nursery, KG I, KG II" and so on; short forms ("PG", "N", "I") carry their full names in `visually-hidden` text. The block answers to the width of its own box (a container query), not the screen: from 940 px of its own width the four stages run in one line (16 columns), from 560 px they pair up, below that they stack. (Reviewed 2026-10-11: the one-line version was first allowed from 760 px and "KG II" ran into its neighbour in the story column, so the threshold was raised and the numerals made a little smaller, `clamp(18px, 2cqw, 28px)`.) The optional `class-path__cambridge` line under a stage names the Cambridge levels that belong to it.

```html
<div class="class-path" data-reveal>
  <ol class="class-path__stages" aria-label="The classes, grouped by stage">
    <li class="class-path__stage" style="--n: 4">
      <p class="class-path__name">Elementary</p>
      <ol class="class-path__classes">
        <li><span aria-hidden="true">PG</span><span class="visually-hidden">Playgroup</span></li>
        <li>KG I</li>
      </ol>
    </li>
    <li class="class-path__stage" style="--n: 5">
      <p class="class-path__name">Senior</p>
      <ol class="class-path__classes">...</ol>
      <p class="class-path__cambridge">Cambridge O Level, AS and A Level</p>
    </li>
  </ol>
</div>
```

Rule: the `--n` of a stage must equal the number of classes in it, and the four stages must add up to 16. The classes are not links: the stage cards or the chapter cards under it are the way in.

### Subject ledger (/learning/a-level/, 2026-10-11, learning)

A numbered, single-column list of subjects in large serif type, with a hairline under each. It is meant for the one night section of a page (it has a night variant) and reads well on paper too.

```html
<ol class="subject-ledger" data-reveal-group aria-label="A Level subjects">
  <li class="subject-ledger__item"><span class="subject-ledger__n">01</span><span class="subject-ledger__name">English Language</span></li>
</ol>
```

Rule: only for a list the school has published as a list of subjects; the numbers are order, not rank.

### Subject table (/learning/senior/, 2026-10-11, learning)

`table.table.table--stack.subject-table` with a first column of `th scope="row"` subjects. Cells that say the subject is not on the school's list carry `is-quiet` (a quieter grey) and cells that say "Compulsory" carry `is-fixed` (heavier). The word is what carries the meaning; the colour and weight only help. Use only for a comparison the school's own pages support.

### Four chapter cards in a row (/learning/, 2026-10-11, learning)

`{{children:}}` writes three columns from 1024 px. When a hub has exactly four non-stage children, wrap the token in `<div class="mt-m learning-cards4">` and the cards sit four to a row, still generated from `nav.json`.

### Pending note (/learning/examinations/ and /learning/results/, 2026-10-11, learning)

`callout pending-note` is a callout headed "Not published by the school" that holds a sentence and one `{{phone:key}}` for the line to call. It is the honest empty state for content the school has not supplied (a results table, the Cambridge series). It makes no promise about when the content will appear. Never use it to hide a gap the school could fill from its own site; use it only after the sources have been searched, and log the gap in `docs/confirm/<group>.md`.

### Telephone numbers do not break (all learning pages, 2026-10-11, learning)

Inside `.process__body`, `.callout`, `.accordion__body`, `.prose` and `.small-print`, a `tel:` link keeps `white-space: nowrap`, so "01755 693 623" is never split across two lines. The Foundation may want to move this into `pages.css` for every group.
