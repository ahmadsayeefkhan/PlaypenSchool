# Additions: sitemap and the Community hub (integrator, 2026-10-25)

Files: `build/additions/sitemap.css` (prefix `sm-`) and `build/additions/sitemap.js` (one behaviour). Pages: `/sitemap/` (`body_class: sm-page`) and `/community/` (`body_class: sm-hub`). Plan: `../redesign-2026-10-24-pages/plans/sitemap-ia.md`, section 1 and 3.1, and its founder decision of 2026-10-24 (the group keeps the label Community and gets the hub). Integration notes: `../redesign-2026-10-24-pages/build/integration.md`.

Principle: the sitemap is built from `nav.json`, so it cannot drift from the menu and the footer. Counts come from `{{sitemap:count ...}}`, long lists from `{{children:... as="list"}}` (both in `docs/COMPONENTS.md`, section 3). The home's own classes are reused where they are not tied to a home layout (`steps`/`step`/`step__n`, `ev-grid`/`ev`, `display-l`, `display-m`, `lead`, `label`, `caption`). The `sm-` rules place them and add the pieces below. When `0-kit.css` ships, `sm-head`, `sm-foot` and `sm-panel` are the kit's `pk-head`, `pk-foot` and `pk-panel` under this prefix.

### Hero with a search form (`.sm-hero`, `.sm-search`)
The shell's `page-hero` markup written in the body (so the search form can sit in the band): breadcrumb token, the sheet rule, the one `<h1>`, the lead, then `form.search-form.sm-search` (GET to `/search/`, which reads `?q=`). From 1280 px the form spans 7 of 12 columns; under 560 px the field and the button stack, each 48 px tall.

### Head, foot, panel (`.sm-head`, `.sm-foot`, `.sm-panel`)
`sm-head`: `h2.display-l` on 9 of 12 columns, `p.lead` on 7. `sm-foot`: a hairline, a sentence (`sm-foot__text`), a caption on the right (`sm-foot__note`); `sm-foot--end` for the closing one. `sm-panel`: paper-3, 1 px clay, a 3 px maroon top rule (`sm-panel--gold` for gold), `h3.sm-panel__title`, a `link-list` with 44 px rows, `{{phones}}`, `sm-panel__note`. `sm-panels` sets two side by side from 720 px.

### The four steps (`ol.steps.sm-steps`)
The home's `.steps` four across from 1024 px, two by two from 640 px, one column under; each step's links are `ul.link-list.sm-step__links` (44 px rows; on phones they wrap as a row).

### The class ladder (`ol.sm-ladder`)
Five `li.sm-ladder__step`, each one link (`a.sm-ladder__link`, at least 72 px tall) with `sm-ladder__n` (maroon numeral, hidden from screen readers), `sm-ladder__name` (serif) and `sm-ladder__range` (sans 15 px). A 2 px gold rule joins the steps: horizontal from 900 px, on the left under it. `ul.sm-chips` is the row of related links under it.

### Doors (`.sm-doors`, `article.sm-door`)
Six cards, two across from 900 px. `sm-door__media` (the picture, 21:9 on phones, 16:10 from 900 px, `alt=""` because the heading names the door), `sm-door__n` (number and computed page count), `h3.sm-door__name > a.sm-door__link` (the hub), `sm-door__text`, then `details.sm-door__fold[data-sm-fold]` holding the list. **Behaviour (`sitemap.js`)**: the folds ship open (no script: everything listed); from 900 px they stay open and their summary leaves the tab order; under 900 px they start closed. `sm-door__more` is a link under the fold.

### Page list (`.sm-list`, written by `{{children:... as="list"}}`)
`ul.sm-list > li.sm-list__row > a.link.sm-list__link + span.sm-list__note`. `ol.sm-list` numbers the rows 01, 02 ... in maroon (Admissions, in the order families use it). Inside `.sm-fold__body` it runs in two columns from 900 px.

### Long folds (`details.sm-fold`)
Native `details` (keyboard and print safe), closed by default: `summary.sm-fold__sum` (64 px tall) with `sm-fold__title` (serif) and a 44 px round `sm-fold__icon`; `sm-fold__body` holds `sm-fold__lead`, the list and `sm-fold__note`.

### Help (`.sm-help`)
Two `link-list` columns from 720 px, each under an `h3.label`.

### Community hub (`body.sm-hub`)
The shell's hero plate mounted inside the band (12 px paper-3 mat, 1 px clay line), the home's `ev-grid` photo cards (`ul.ev-grid.sm-hub-cards`, six `li.ev`), and `sm-hub-two` (heading and lead on 6 of 12 columns, the current-parents `sm-panel` on 8 to 12).

Reduced motion: the only transitions (ladder border, door link underline, fold icons) are switched off under `prefers-reduced-motion` and `html[data-motion="reduced"]`. Print: the search form is hidden, the folds print as the reader left them.
