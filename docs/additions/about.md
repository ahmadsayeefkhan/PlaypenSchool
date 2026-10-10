# Additions: About group (history, leadership, campus, child protection, policies, careers)

Styles live in `build/additions/about.css` (joined into `site/css/pages-additions.css`). No script.

### Footnote dagger on the dark ground (history, 2026-10-11, about)
`.is-night .fn { color: var(--gold-text); }`. `main.css` draws the footnote dagger (`<a class="fn">&dagger;</a>`) maroon, which fails contrast on the night ground. The home gives its own Ledger the gold rule (`.ledger .fn`); this one covers any night section on an inner page. Use the same markup as the home: `<a class="fn" href="#note-id" aria-label="Footnote: ...">&dagger;</a>` and a `<p id="note-id" class="caption">` with the note (`.is-night .caption` already uses the quiet bone colour).

### Larger management row (leadership, 2026-10-11, about)
`<ul class="people people--2 about-people--lead">` sets `.person__name` to 28..40 px (the other tiers stay at 23..30 px), so the top of the page's hierarchy reads as the top. Use it only on the first tier of a People page.

### Caption of a stacked table (leadership, 2026-10-11, about; fixes every `table--stack`)
Under 640 px `.table--stack` makes the table, its rows and its cells `display: block`, but the `<caption>` stayed a table-caption box, which shrink-wrapped to a few characters wide ("WHO / LOOKS / AFTER ...", six lines on a 390 px phone). `@media (max-width: 639px) { .table--stack caption { display: block; width: 100%; } }` gives it the full width. The rule is global because the component is: the Foundation may want to move it into `pages.css` section 14 and delete it here.

### 44 px link in a table row header (policies, 2026-10-11, about; added in review)
`<a class="about-index__link" href="#conduct">` inside a `<th scope="row">`. A link that fills a one-line row header is only 18 px high; `display: inline-block; padding: 13px 0; margin: -13px 0;` gives it a 44 px hit area without changing the row's height (the rows are 42 px apart, so neighbouring hit areas meet and do not overlap by more than a pixel). Use it for the links in any index table whose rows are one line high.

### Narrow figure when a split stacks (campus, 2026-10-11, about; added in review)
`<figure class="plate plate--flat split__figure about-plate--narrow">`. Between 560 and 899 px a `.split` stacks and its figure takes the full width, which makes a portrait or square frame taller than the screen. The class caps the figure at 24 rem in that range only. Use it on portrait (2:3) or square frames inside a split.
