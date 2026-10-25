# Additions: gallery (2026-10-22, all albums of the school's gallery)

Notes: `../redesign-2026-10-22-gallery/notes.md`. The gallery is generated: `build/gallery-albums.json` (the albums, in the
school's order, and the frames each one may show) is turned into `build/pages/gallery/index.html` and one
`build/pages/gallery/<slug>.html` per album, plus the album entries in `build/nav.json` (ids G01 ...), by
`python build/gallery_albums.py`. Edit the JSON, run the script, then the build. Never edit the generated sources.

Every page of the group carries `body_class: gallery-page`; the viewer rules and the script run only there.

### Filters (`div.alb-filters`), /gallery/
Two chip rows inside the `[data-filter-scope]`: kind (`data-filter`, matches `data-tags`) and year (`data-filter-key="year"`,
matches `data-year`; an album without a year has `data-year="none"`). Each row has a `p.label` and `aria-labelledby`.
On a phone each row scrolls sideways (no wrap) so the cards start sooner. `js/inner.js` filters; nothing new in JS.

### Album card (`ul.alb-cards > li.alb-card`), /gallery/
Cover (4:3, `--pos` for the focus point), kind and year, title (the whole card is the link, via `::after`), and the count
("6 of 51 photographs", "39 photographs, none shown yet", "No photographs yet"). An album with no safe frame shows
`div.alb-card__frame--empty`: its first letter large in maroon and "Photographs added when the school agrees" on a faint
diagonal hatch. Two columns on a phone, three from 900 px, four from 1200 px.

    <li class="alb-card" data-tags="sports" data-year="2026"> div.alb-card__frame, p.alb-card__meta, h3.alb-card__title > a.alb-card__link, p.alb-card__count </li>

### Album grid (`ul.gallery.alb-grid[data-gallery]`), album pages
The shared `.gallery` items in an even grid: two columns (phone), three from 1024 px, thumbnails cut to 4:3 (the viewer
shows the whole frame). No captions (sitewide rule); the alt text says what a frame shows.

### Empty album (`div.alb-empty`) and source line (`p.alb-source`), album pages
The tile for an album with no safe frame (or no photographs at all), and the line under a grid that says how many other
photographs are on the school's current website. Both link with `{{ext}}` to the old site's home (the build allows no
deeper link to playpen.edu.bd) and name the album as it is labelled there.

### Full-screen viewer (`body.gallery-page .lightbox`)
The shared lightbox (`js/inner.js`) is full screen and dark on these pages: the whole photograph, Previous, Next, the
count and Close (44 px, gold focus ring). `build/additions/gallery.js` adds: swipe left or right on a phone, Tab and
Shift+Tab kept inside the open viewer, and `lightbox--single` (no Previous or Next) for a one-photograph album, with focus
moved to Close. Arrows and Escape come from `js/inner.js`; focus returns to the thumbnail on close.


## Pages redesign, 2026-10-24 (group events-gallery-news)

`build/gallery_albums.py` grew (see its docstring): per album the JSON may name `cover` (the hub card and the album's hero plate; default the first frame), `cover_pos` and `sort_year` (hub order only). The hub shows the albums with frames first (newest year first, then undated ones with the most frames first), the rest in one folded list; album pages without a frame are built `noindex: true` and leave the prev/next chain; `--no-nav` leaves nav.json alone. Every page of the group carries `body_class: gallery-page egn-page` (album pages add `egn-album`): see `docs/additions/events.md` for the `egn-` kit.

### Highlights slider (`div.gal-high[data-egn-slider]`), /gallery/ sheet 01
Six cleared frames in the home's ceremonial `.frame` (maroon mount, gold inner line, paper-3 mat), 9 of 12 columns; `ul.gal-high__slides[data-gallery]` holds `li.gal-high__slide` (one `.is-active`; `aria-roledescription="slide"`, `aria-label="1 of 6: ..."`), each wrapping `a.gal-high__link[data-lightbox]`. Beside it `.gal-high__side`: the gold progress line (`gal-high__track` and `gal-high__fill`), the counter (`gal-high__now` maroon, tabular), a visually hidden live `gal-high__status`, `ul.gal-high__caps` (one `li.gal-high__cap` per slide: a label and the album link) and three 44 px round buttons `[data-egn-go=prev|toggle|next]`. `gallery.js` drives it: a cross-dissolve (1.2 s) with a slow settle, a 4.5 s hold, autoplay only on a desktop with a fine pointer, without reduced motion, while the slider is on screen, the tab visible and no viewer open; the toggle pauses and plays (WCAG 2.2.2) and is hidden where autoplay never runs; Left and Right arrows step when focus is inside; a swipe steps on a phone; a click opens the full-screen viewer and stops the timer. Without JavaScript the first frame and its link show; the controls appear with `is-ready`; `is-still` (reduced motion) switches without a dissolve. The six slides are set in `HIGHLIGHTS` in the generator; none is a cover on the same page. Phones: a 3:2 frame, the controls under it.

### Folded list (`details.alb-more`), /gallery/ sheet 02
The albums without a safe frame yet, under the covers: a 22 px serif summary with the count and a round 44 px marker pushed right with `margin-left: auto` (the same fix as the notices page's ended list), one note, then `ul.alb-more__list` of `li.alb-more__item` (the name as a link with a 44 px hit area, kind, year and count). Two columns from 900 px.

### Album card count (`.alb-card__count b`)
Positive wording: "<b>5 photographs shown</b>, 51 in the album".

### Meta line and grid shapes (`p.label.alb-meta`, `.alb-grid--1` to `--5`), album pages
The fact strip is gone: one label line (kind, year, "5 photographs shown", "51 in the album"). The grid takes a shape by count: one frame on 8 of 12 columns at 3:2; two halves at 3:2; three columns; two by two at 3:2; five as a 21:9 lead across the row plus four. Six and eight keep the even three-column grid. The source line moved into an `egn-foot`.

### About this event (`div.alb-about`), album pages sheet 02
Left (`alb-about__event`): an `egn-panel--gold` naming the page that explains the album (`EVENT_OF` in the generator: an event page, `/school-life/sports/` for the football albums, the news report for the NASA visit). Right (`alb-about__more`): up to four other albums of the same kind with frames, as a `link-list`. An album with no event page shows the list only.

### Album without frames (`div.alb-wait > div.venue`)
The one highlighted statement (the home's `.venue`) instead of the hatched tile: how many photographs the album holds and where they are, with the `{{ext}}` link. The same block carries the consent rule on the hub.

### Phone chip rows
A fade on the right edge of each scrolling chip row (`mask-image`), so a cut-off chip is no longer the only hint that the row scrolls.


## Review r1 fixes, 2026-10-24 (group events-gallery-news)

### The cover stays out of the grid (`gallery_albums.py`: `has_hero`, `grid_frames`)
An album with three or more frames opens on the mounted plate of its cover and the cover is left out of the grid, so the same photograph is never shown twice on one page (it was the hero and then the first tile, one screen apart, on thirteen albums). A two-frame album has no hero and shows both frames as two halves at 3:2; a one-frame album shows its frame once. The meta line still counts the cover ("5 photographs shown"); a source comment names it above the grid.

### Grid shapes by count (`.alb-grid--7`, `.alb-grid--8`)
Seven frames: a wide lead (2:1 from 640 px, 21:9 from 1024 px) and two rows of three (Art and Craft, which lost its cover from the grid). Eight frames: two rows of four from 1024 px. No row is left with a hole. The five-frame shape is unchanged; the NASA album leads with the Soyuz frame (`pos` 50% 0%) so the taskbar along the bottom of the projected screen is out of the tile.

### One-frame albums at their own ratio (`.alb-shape--wide|portrait|square|land`, `--alb-max`)
The generator reads the frame's size (`media.read_size`) and sets a shape class from its ratio and `--alb-max` to its source width on the `ul`: a frame 2:1 or wider runs across the band at its own ratio (PIFT 2024, 1200 x 405); a portrait frame is shown at its own ratio up to 520 px (the Book Fair sign, the Math Olympiad board, re-cut at 720 px from the school's original); a square frame up to 560 px and never above its source (the Bangla Olympiad banner, 480 px); a landscape frame keeps the 3:2 box on 8 of 12 columns, capped at its source width. Nothing is upscaled any more.

### Held back for a reason other than consent (`hold_note`)
`gallery-albums.json` may give an album a `hold_note`: the page then says "Photographs added when the school confirms" with that reason, and the hub's folded note reads "...or carries lettering the school must confirm first". Used for Foundation Day: the cake's icing names the school's age (A1). The frame is listed in `held_back`.

### "More albums" (sheet 02 on albums with no event page)
The sheet rule reads "More albums" and the hidden H2 "More albums of this kind" when `EVENT_OF` has no entry (Art and Craft, Colour Week, Class Party, Teacher Training, the Olympiads); "About this event" only where the panel names a page.

### The filter status counts cards (`gallery.js`)
`js/inner.js` counts every `[data-tags]` item in the scope, so the status read "Showing all 38" above 22 cards. On `/gallery/` the script rewrites the line after each chip click: "Showing all 21 albums with photographs, 17 more in the list below" (or "Showing 4 of 21 ..., 2 of 17 in the list below").

## Round-2 fixes (2026-10-25)

### The folded list fills the last row of covers (`gallery.css`, `gallery_albums.py`)
The folded `details.alb-more` is now the last item of `ul.alb-cards` (`li.alb-cards__more`). The generator writes where it sits as `--more-c2`, `--more-c3`, `--more-c4` (the grid at 2, 3 and 4 columns): in the free cells of the last row when two or more are free (21 cards in four columns: columns 2 to 4 of the sixth row), else across a whole row. When a filter hides a card (`.alb-cards:has(> .alb-card[hidden])`) it takes a whole row again.

### Two new album fields (`gallery-albums.json`)
`confirm` (a list): CONFIRM comments written into the album's page source (Bangla Olympiad's year, staff consent on Graduation 2024 and 2025 and Teacher Training). `hero_class`: a focal-point class added to the album page's `body_class` when it has a hero (Graduation 2023: `egn-hero-bottom`, so the crest ribbon leaves the 2:1 plate).
