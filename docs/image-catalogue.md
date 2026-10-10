# Image catalogue

Every photograph on the site, with what it shows and whether it can go on a public page. Use it with `{{img src="..." alt="..." sizes="..."}}` (docs/COMPONENTS.md, "Images"). Written by the Foundation, 2026-10-11, from the home's credits table (`playpen-school-v1/docs/CREDITS.md`) and a look at each file. Update the people column when the school answers.

**People column.** `none` = no people. `distance`, `from above`, `crowd`, `backs of heads` = nobody can be identified; acceptable. `faces` = identifiable children: needs the school's written consent before it goes on a public page (the BRIEF asks every page agent to prefer other frames). `printed year` / `printed age` / `text` = the frame carries a figure or lettering that the site must not repeat: do not use.

**This table is enforced, not just advice.** `build/build.py` refuses any frame whose row says "Needs consent", "Do not use", "Never use", "Avoid" or "Check with the school" (and any `faces` row not marked "Acceptable"): `{{img}}`, `hero_image` and `og_image` all stop with the row's reason, and `build/check.py` reports the same frame if it is found in the published HTML. A frame made only for the home (the cover, `media/hero-1`) is refused on inner pages. When the school has agreed in writing to a frame, the coordinator (nobody else) adds its stem to `docs/consent-cleared.txt`. Keep the last two columns honest when you add a row: the words above are what the build reads. A photograph that is not listed here (or in `image-catalogue-new.md`, where `build/images.py` records every new crop) cannot be used at all: nobody has said whether it shows identifiable children.

**Sizes.** The `media/` set is graded, with AVIF, WebP and JPG at each width: `{{img src="media/<stem>" ...}}` uses all of them. The `img/` set is the 44 web-size files from the previous site (JPG only, 800 to 1800 px): `{{img src="img/<file>.jpg" ...}}`.

## media/ (graded, three formats)

| stem | widths | w/h | shows | people | note |
|---|---|---|---|---|---|
| `media/ascent-1` | 960, 1440, 1920 | 1.60 | Courtyard between the wings from above, black-and-white chequerboard floor, bougainvillea | none | Used on /about/ |
| `media/ascent-2` | 960, 1440, 1920 | 1.60 | Students in laboratory coats working with burettes at a chemistry bench | faces | Needs consent |
| `media/ascent-3` | 960, 1440, 1920 | 1.60 | Children in white uniforms reading at long tables in the library | backs of heads | Acceptable; no face is the subject |
| `media/ascent-4` | 960, 1440 | 1.60 | The multipurpose hall full of students for the NASA astronaut visit, high angle | distance | Acceptable |
| `media/ascent-5` | 960, 1440, 1920 | 1.60 | Curved brick benches and flowering shrubs on a rooftop terrace | none | Used on /about/ (the hero) |
| `media/ground-1` | 960, 1440, 1920 | 2.33 | The ten-storey building from the grass playground, brick boxes stepping out of a concrete frame (21:9) | none | Used on the home |
| `media/ground-1-alt` | 960, 1440, 1920 | 1.78 | The same building, 16:9, the whole facade | none | Alternate of ground-1 |
| `media/hero-1` | 960, 1440, 1920, 2560 | 1.78 | Rooftop terrace, three young trees, the Dhaka skyline (the home cover; the sky is baked into the paper) | none | The paper melt is baked in: for the home, not for inner pages |
| `media/learning-1` | 720, 960, 1200 | 0.80 | Hundreds of young children in yellow shirts and blue headbands on the field, morning light (4:5) | distance | Elementary; the home's plate. /learning/elementary/ uses the wide crop `img/elementary-hero` instead |
| `media/learning-2` | 720, 960, 1200 | 0.80 | Students choosing books at the school bookshop shelves (4:5) | faces | Needs consent |
| `media/learning-3` | 720, 960, 1200 | 0.80 | Girls in brown uniform practising a dance on the terrace (4:5) | faces | Needs consent |
| `media/learning-4` | 720, 960, 1200 | 0.80 | Students at a row of monitors in the computer laboratory (4:5) | faces | Needs consent |
| `media/life-0` | 720, 1080, 1440 | 0.67 | The courtyard from above on Pohela Boishakh, painted alpona floor, a crowd in red and white (2:3) | crowd | Acceptable |
| `media/life-1` | 960, 1440, 1920 | 2.00 | Annual Sports Day from above: students in red kneeling in a formation on the field (2:1) | from above | Acceptable |
| `media/life-2` | 720, 960, 1440 | 1.50 | Girls in bright saris dancing on the alpona floor (3:2) | faces (distance) | Check with the school |
| `media/life-3` | 720, 960, 1440 | 1.50 | Students in laboratory coats at a science fair stall (3:2) | faces | Needs consent |
| `media/life-4` | 720, 960, 1200 | 0.80 | Dancers on stage at the annual cultural programme, English banner behind (4:5) | distance | Acceptable |
| `media/life-5` | 960, 1440, 1920 | 2.00 | Rows of seated graduates in caps and gowns in the hall (2:1) | faces | Needs consent |
| `media/life-6` | 720, 960, 1200 | 0.80 | A student-painted portrait of astronaut Joseph M. Acaba (4:5) | a painting | Acceptable |
| `media/life-7` | 720, 960, 1440 | 1.50 | A wide field of students in red with palm trees and the building behind (3:2) | distance | Acceptable |
| `media/life-8` | 720, 960, 1200 | 0.80 | A red-tiled staircase between white walls and metal railings (4:5) | none |  |
| `media/life-9` | 720, 960, 1440 | 1.50 | A graduate in a black gown and maroon sash, parents filming (3:2) | face | Needs consent |
| `media/menu-1` | 960 | 1.60 | The crest cast in the board-marked concrete wall | none | The menu preview for About |
| `media/menu-2` | 960 | 1.60 | Brick terrace steps and planters (the atrium) | none | The menu preview for Community |
| `media/menu-3` | 960 | 1.60 | Children at library tables (same frame as ascent-3) | backs of heads | The menu preview for Learning |
| `media/menu-4` | 960 | 1.60 | Families under bunting on Pohela Boishakh | distance | The menu preview for School life |
| `media/menu-5` | 960 | 1.60 | The building from the lawn (same source as ground-1) | none | The menu preview for Admissions |
| `media/menu-6` | 960 | 1.60 | The terrace garden seen through glass, towards the city | none | The menu preview for Contact |
| `media/news-1` | 480, 960 | 1.50 | Senior athletes on the track, the stepped facade behind (3:2) | distance |  |
| `media/news-2` | 480, 960 | 1.50 | Clay pots and traditional crafts on a Pohela Boishakh stall (3:2) | none |  |
| `media/news-3` | 480, 960 | 1.50 | Project stalls and models at the Science and Technology Fair (3:2) | faces (distance) | Needs consent |
| `media/swatch-1` | 480, 720 | 1.00 | Brick courses, macro (1:1) | none | Texture |
| `media/swatch-2` | 480, 720 | 1.00 | Board-marked concrete, macro (1:1) | none | Texture |
| `media/swatch-4` | 480, 720 | 1.00 | Laboratory glassware on a bench, macro (1:1) | none | Texture |

Also in `media/` and not for inner pages: `hero-1-mobile-*`, `hero-1-depth-960.png`, `hero-1-luma-960.jpg`, `disp-brick-512.png`, `og-1200x630.jpg` (the social card), `favicon-*.png`, `life-0-mobile-*`, `ascent-1-film.mp4`.

## img/ (previous site, JPG only)

| file | size | shows | people | note |
|---|---|---|---|---|
| `img/about-history.jpg` | 1024 x 683 | Staff on stage under a "40 Ruby Jubilee" banner | faces + printed year | Do not use: the banner states an age |
| `img/about-playpen.jpg` | 1024 x 650 | The building from the lawn, blue sky | none | Good, low resolution |
| `img/admission-1.jpg` | 1024 x 768 | The building with children on the lawn, far away | distance |  |
| `img/admission-2.jpg` | 854 x 1024 | A child at a desk with a teacher, stacking rings | faces | Needs consent |
| `img/admission-3.jpg` | 1024 x 768 | Lines of students in red and white in a parade | distance |  |
| `img/campus-1.jpg` | 1024 x 640 | The grass playground and the building | none |  |
| `img/campus-2.jpg` | 1024 x 813 | Staff on a stage, "Campus celebration programme 2018-2019" banner | faces + text | Avoid |
| `img/campus-3.jpg` | 960 x 720 | Children playing on the school field | distance |  |
| `img/campus-exterior.jpg` | 1024 x 801 | The building from the lawn, tall frame | none |  |
| `img/campus-interior.jpg` | 1024 x 768 | The lawn and the building under clouds | none |  |
| `img/cie-top-2025.jpg` | 1800 x 1125 | A board of top Cambridge achievers, names and photographs | faces + names | Do not use without consent |
| `img/community-1.jpg` | 800 x 600 | A community service group with the school bus | faces | Needs consent |
| `img/community-2.jpg` | 800 x 600 | Volunteers carrying bricks | faces | Needs consent |
| `img/community-3.jpg` | 800 x 600 | Students taking a group photograph | faces | Needs consent |
| `img/eca-4.jpg` | 1386 x 700 | Children on a green festival stage | faces (distance) | Check with the school |
| `img/elementary-hero` | 960, 1440, 1920 (JPG and WebP), 21:9 | The Elementary morning on the field, wide: hundreds of children in yellow and orange under palm trees, bunting on the boundary wall (a wide crop of the frame the home uses as `media/learning-1`) | distance | Made by the Foundation with `build/images.py`; used on /learning/elementary/ (the hero) |
| `img/elementary-1.jpg` | 1024 x 683 | Young children in yellow on a stage under a "Campus celebration programme" banner | faces + text | Avoid |
| `img/elementary-2.jpg` | 768 x 1024 | A child in a bright activity room | faces | Needs consent |
| `img/elementary-3.jpg` | 1800 x 1200 | Same stage as elementary-1, larger | faces + text | Avoid |
| `img/examination-1.jpg` | 1024 x 490 | An examination hall with rows of desks | distance | Good for examinations |
| `img/examination-2.jpg` | 1024 x 768 | An examination hall in the building | distance | Good for examinations |
| `img/health-center.jpg` | 1024 x 768 | A child being looked after on the grass | faces | Needs consent |
| `img/hero-48-years.jpg` | 1280 x 640 | The building with a "48 years" badge | printed age | Never use: no age count |
| `img/hero-results.png` | 1800 x 533 | A graphic of results donuts and subject lists | text | Do not use: unverified figures |
| `img/hero-students-1.jpg` | 1800 x 1200 | A large crowd of students around a guest | faces | Needs consent |
| `img/hero-students-2.jpg` | 1800 x 1151 | The NASA astronaut speaking, a slide on a screen | screen | Acceptable (the event is on the home) |
| `img/image-11.jpg` | 1800 x 927 | Students in red in a parade | distance |  |
| `img/junior-1.jpg` | 1024 x 820 | Children on stage with a planet backdrop | faces | Needs consent |
| `img/junior-2.jpg` | 1600 x 1200 | Children with flowers at a ceremony | faces | Needs consent |
| `img/leadership.jpg` | 1024 x 701 | Staff and guests on the terrace | faces | Needs consent |
| `img/middle-senior.jpg` | 1800 x 1702 | A graduate receiving a certificate | faces | Needs consent |
| `img/our-history.jpg` | 1024 x 563 | Staff under a "Silver Jubilee" banner | faces + printed year | Do not use |
| `img/slider-1.jpg` | 1024 x 801 | The building, tall frame | none |  |
| `img/slider-2.jpg` | 1800 x 1200 | A cultural programme stage with posters | faces + Bangla text | Avoid |
| `img/slider-8.jpg` | 1800 x 848 | Children dancing on a space-themed stage | faces (distance) | Check with the school |
| `img/sports-1.jpg` | 800 x 600 | Athletes running | faces | Needs consent |
| `img/sports-2.jpg` | 800 x 600 | A group of children with certificates | faces | Needs consent |
| `img/sports-3.jpg` | 800 x 600 | A group photograph at a sports event | faces | Needs consent |
| `img/sports-4.jpg` | 800 x 600 | A parade of students in red and blue | distance |  |
| `img/sports-5.jpg` | 800 x 600 | A hurdles race | faces (distance) | Check with the school |
| `img/sports-6.jpg` | 800 x 600 | Children in costumes | faces | Needs consent |
| `img/values-1.jpg` | 768 x 1024 | Children on playground equipment | faces | Needs consent |
| `img/values-2.jpg` | 768 x 1024 | Children on a slide with their teachers | faces | Needs consent |
| `img/values-3.jpg` | 1024 x 768 | Teachers and young children on the playground | faces | Needs consent |
| `img/wide-campus.jpg` | 1024 x 528 | Students in red in a parade, wide | distance |  |

## Brand

`assets/brand/logo-mark.svg` (the shield mark), `logo-white-160.png` / `logo-white-1024.png` (white crest for dark grounds), `logo-1024.png` (full crest). Never redraw or recolour the crest. The Cambridge International logo is not used (written approval needed first).
