# Playpen School — Brand Guidelines

**Version 1.0 · 2026** · Plain-text specification for developers, printers and vendors.
Visual versions: [`brand-board.html`](brand-board.html) (one page) · [`brand-guidelines.html`](brand-guidelines.html) (full document).

---

## 1. Foundation

**Positioning**
> For families in Dhaka choosing an English-medium education, **Playpen** is the Cambridge school that carries a child from Playgroup to A Level in one continuous, unhurried programme — on a campus built for the purpose, by teachers who stay.

**Mission** — To give every student a well-balanced programme in a creative learning environment: grounded in history and culture, proficient in language, with a practical education they can apply to daily life.

**Vision** — That every child who passes through Playpen reaches their full potential, and leaves prepared to take part in the world as a global citizen of the 21st century.

**Values** — Care · Balance · Curiosity · Rootedness · Continuity

**Personality** — Warm · Specific · Plain · Settled

**Audience priority** — Prospective parents → parents comparing schools → current parents → students → alumni → teachers and applicants.

---

## 2. Colour

### Palette

| Name | HEX | RGB | CMYK | Job |
|---|---|---|---|---|
| **Playpen Crimson** | `#8A171A` | 138 23 26 | 21 96 89 12 | Primary. CTAs, active nav, headings on light, links. |
| Crimson Deep | `#6E1215` | 110 18 21 | 26 97 90 22 | Hover / pressed state for Crimson only. |
| **Deep Maroon** | `#5C0F12` | 92 15 18 | 32 95 88 43 | Dark sections, hero overlays, signage ground. |
| Maroon Ink | `#3A0A0C` | 58 10 12 | 40 92 85 62 | Footer, utility bar, deepest gradient stop. |
| **Playpen Gold** | `#C89B3C` | 200 155 60 | 22 39 89 4 | Accent **on dark only**. Overlines, rules, stat figures. |
| Gold Light | `#F1DD6D` | 241 221 109 | 8 9 68 0 | Highlight inside the shield gradient; emphasis on dark. |
| **Bronze** | `#8A5C22` | 138 92 34 | 30 58 100 21 | Accent **on light**. All overlines and labels on Parchment. |
| **Ink** | `#1A1614` | 26 22 20 | 68 63 62 62 | Body copy and headings on light surfaces. |
| Ink Soft | `#4A423D` | 74 66 61 | 60 58 61 39 | Lead paragraphs, card copy, table body. |
| Ink Muted | `#6E645D` | 110 100 93 | 52 50 54 20 | Captions, metadata, helper text. |
| **Parchment** | `#FBF7F0` | 251 247 240 | 1 2 5 0 | Default page background. |
| **Sand** | `#EFE7DA` | 239 231 218 | 6 8 15 0 | Alternating sections, table headers, callouts. |

Pantone nearest matches: Crimson ≈ **1815 C**, Deep Maroon ≈ **490 C**, Gold ≈ **8383 C**.
Always proof against a physical swatch — the gold shifts significantly between coated and uncoated stock.

### Contrast (calculated, WCAG 2.1)

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| Ink | Parchment | 16.3:1 | AAA |
| Ink Soft | Parchment | 9.0:1 | AAA |
| Ink Muted | Parchment | 5.1:1 | AA |
| Crimson | Parchment | 8.9:1 | AAA |
| Bronze | Parchment | 5.4:1 | AA |
| White | Crimson | 9.4:1 | AAA |
| Parchment | Deep Maroon | 14.3:1 | AAA |
| Playpen Gold | Deep Maroon | 5.3:1 | AA |
| Gold Light | Deep Maroon | 10.6:1 | AAA |
| Maroon Ink | Playpen Gold | 6.4:1 | AA |
| **Playpen Gold** | **Parchment** | **2.4:1** | ❌ Fails — use Bronze |
| **Crimson** | **Deep Maroon** | **1.6:1** | ❌ Fails — never pair |
| **White** | **Playpen Gold** | **2.1:1** | ❌ Fails — use Maroon Ink |

### Rules

1. **Gold is a hairline, not a fill.** Rules, borders, small figures, icons on dark. Large gold fields cheapen the crest.
2. **Gold text becomes Bronze on light ground.** No exceptions.
3. **One accent per element.** Crimson carries the action; Bronze or Gold carries the label — never both.
4. **Sections alternate Parchment → Sand → Deep Maroon.** Never two dark sections in a row.
5. **No colour outside this list**, including the brighter reds on the old site.
6. **No gradients** except the shield's own gold border and the Deep Maroon scrims over photography.

---

## 3. Typography

| Family | Role | Licence | Source |
|---|---|---|---|
| **Fraunces** | Display and headings | SIL OFL 1.1 | Google Fonts |
| **Plus Jakarta Sans** | Body, UI, labels | SIL OFL 1.1 | Google Fonts |

Both are free for web, print, app and merchandise with no seat or page-view limits.

```css
--font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
--font-body:    'Plus Jakarta Sans', 'Segoe UI', 'Helvetica Neue', sans-serif;
```

Office / Workspace substitutions: **Georgia** for Fraunces, **Segoe UI** or **Arial** for Plus Jakarta Sans. Nothing else.

### Scale (fluid — mobile min → desktop max)

| Role | Family / weight | Size | Line height | Tracking |
|---|---|---|---|---|
| Display / Hero | Fraunces 600 | 44–104px | 0.96 | −0.035em |
| H1 | Fraunces 600 | 40–80px | 1.02 | −0.03em |
| H2 | Fraunces 600 | 32–56px | 1.08 | −0.025em |
| H3 | Fraunces 600 | 26–40px | 1.08 | −0.02em |
| H4 | Fraunces 600 | 21–28px | 1.2 | −0.015em |
| H5 / card title | Fraunces 600 | 18–21px | 1.3 | −0.01em |
| Lead | Jakarta 400 | 18–21px | 1.55 | 0 |
| Body | Jakarta 400 | 16–17px | 1.65 | 0 |
| Small | Jakarta 400 | 14–15px | 1.6 | 0 |
| Caption | Jakarta 400 | 12–13px | 1.45 | 0 |
| Overline | Jakarta 600 | 12–13px | 1.2 | 0.18em, uppercase |
| Button | Jakarta 600 | 14–15px | 1 | 0.02em |

### Rules

- Fraunces sets **headings only** — never body copy.
- Body copy never below **16px** on screen or **10pt** in print.
- Measure capped at **68 characters**.
- Headings take negative tracking; body copy takes none.
- Italic Fraunces marks **one** emphasised phrase per page, in the hero.
- **Two families is a hard limit** — decks and PDFs included.
- **Never** set Fraunces in all caps. Uppercase is Plus Jakarta Sans 600 at 0.18em tracking.

---

## 4. Logo system

| Asset | File | Use for | Min size |
|---|---|---|---|
| Heritage crest | `logo/heritage-crest.png` | Certificates, ID cards, uniforms, signage, ceremonial print | 100px / 32mm |
| Shield mark | `logo/playpen-shield-mark.svg` | Favicon, app icon, avatar, compact header, watermark | 24px / 8mm |
| Wordmark | `logo/playpen-wordmark.svg` | Document headers, email signatures, co-branded material | 140px / 32mm |
| Horizontal lockup | `logo/playpen-lockup-horizontal.svg` | Site header, letterhead, banners, vehicle livery | 180px / 40mm |
| Inverted lockup | `logo/playpen-lockup-horizontal-inverted.svg` | Deep Maroon / Crimson grounds, photography with a dark block | 180px / 40mm |
| Stacked lockup | `logo/playpen-lockup-stacked.svg` | Square and portrait formats, social, merchandise | 120px / 28mm |
| Single colour | `logo/playpen-mark-mono.svg` | Embossing, foil, engraving, stamps, single-ink transfer | 24px / 8mm |

**The heritage crest is not being replaced.** The shield mark is derived from it — same shield geometry, same five stars, same colours — and exists because the crest is illegible below 100px.

**Clear space:** on all four sides, equal to the height of the shield's crown (top edge of shield → centre of the middle star ≈ 22% of the mark's height). Nothing enters that zone.

**Approved backgrounds:** Parchment, White, Sand, Deep Maroon, Maroon Ink, Crimson. Gold only with the single-colour mark in Deep Maroon. Photography only with a colour block or gradient scrim behind the mark.

**Never:**
- Stretch, squash, skew or rotate any mark
- Add shadows, glows, bevels, outlines or strokes
- Recolour the shield field beyond Crimson, Deep Maroon or one flat ink
- Remove, reorder or change the count of the five stars
- Rebuild the wordmark in another typeface or re-track it
- Place the crest on a busy photograph without a colour block
- Use the crest below 100px — switch to the shield mark
- Enclose a mark in a box, circle or badge it did not ship with

**Co-branding:** partner mark sits to the right, separated by a 1px Bronze rule with clear space both sides. Neither mark exceeds the other's cap height by more than 15%. Playpen leads on Playpen-owned surfaces.

> **Print production:** the SVGs carry live text. **Outline the text before sending to a printer** and keep outlined EPS/PDF versions on file.

---

## 5. Imagery

**Do**
- Real Playpen students and staff, mid-activity — writing, climbing, performing, experimenting
- Teachers in frame with students (the proof behind "individual attention")
- Natural daylight
- Alternate wide frames that show scale with close frames that show a face
- Caption everything; write alt text describing what is happening

**Don't**
- Stock photography of any kind
- Event banners photographed as the subject — shoot the people in front of them
- Heavy filters, HDR, duotones or coloured overlays
- Publish an identifiable student without consent on record

**Treatment**
- Corner radius 4px
- Dark sections: Deep Maroon gradient at 60–95% opacity from the bottom
- Light sections: untinted
- Ratios — 4:3 cards · 3:4 portraits · 16:10 full-width · 1:1 gallery
- Max 1800px long edge, JPEG q78–82, under 400KB

**Illustration** — Playpen does not use illustration. Build diagrams from type, rules and numbers in the brand palette.

**Icons** — stroke-based, 1.4–1.6px on a 20px grid, rounded caps, Bronze on light / Gold on dark. Always paired with a label.

---

## 6. Voice and tone

| Attribute | Means | Is not |
|---|---|---|
| **Warm** | Writes to a parent, not a market segment | Sentimental; cute about children |
| **Specific** | "Junior classes have both a Class Teacher and an Assistant Teacher." | "A world-class holistic educational ecosystem." |
| **Plain** | Short sentences, active voice, one idea per paragraph | Bureaucratic; a notice written as a decree |
| **Settled** | Age stated once, then demonstrated | Nostalgic; defensive about competitors |

### Tone by context

| Context | Dial |
|---|---|
| Homepage & admissions | Confident, welcoming. Lead with the child, close with a next step. |
| Academic pages | Precise. Subject lists, requirements, dates. Almost no adjectives. |
| Notices | Calm, operational. What, when, who it affects, what to do. |
| Policies & conduct | Neutral, exact. Preserve official meaning; simplify grammar only. |
| Achievements | Factual. Name, class, competition, placing, date. |
| Alumni | Personal, inviting. |
| Careers | Honest, grounded. |
| Social media | Lighter, still specific. A real photograph beats a graphic. |

### Vocabulary

**Use:** students · parents · teachers · school · Cambridge curriculum · CAIE · O Level · A Level · learning · wellbeing · student support · Playgroup · Class I–XII

**Avoid:** best · No. 1 · world-class · unparalleled · premier · leverage · guaranteed admission · CIE (use CAIE) · switching between pupils / children / learners / students

### House style

- **Classes:** Roman numerals — Class I, Class VIII, Class XII. Never "Class 8".
- **Stages:** Elementary School, Junior School, Middle School, Senior School — capitalised, always with "School".
- **Qualifications:** O Level, A Level, AS Level — no hyphen, no apostrophe, both words capitalised.
- **Board:** Cambridge Assessment International Education on first mention, CAIE after. Never CIE.
- **Academic year:** July 2026 – June 2027 (en dash, spaced).
- **Dates:** 19 July 2018 — no ordinal suffix.
- **Phone:** display as 01755 515 885; use full international format in `tel:` links.
- **Spelling:** British English — programme, organised, enrolment, practise (verb).
- Time-sensitive pages carry a visible *Last updated: Month Year*.

---

## 7. Digital UI tokens

```css
/* Colour */
--crimson: #8A171A;   --crimson-deep: #6E1215;
--maroon: #5C0F12;    --maroon-ink: #3A0A0C;
--gold: #C89B3C;      --gold-light: #F1DD6D;   --bronze: #8A5C22;
--ink: #1A1614;       --ink-soft: #4A423D;     --ink-muted: #6E645D;
--parchment: #FBF7F0; --sand: #EFE7DA;

/* Radius, rules, shadow */
--radius: 2px;  --radius-lg: 4px;
--rule: rgba(26,22,20,.12);
--rule-gold: rgba(200,155,60,.45);
--shadow-md: 0 2px 4px rgba(26,22,20,.04), 0 8px 24px rgba(26,22,20,.07);

/* Motion */
--ease:      cubic-bezier(0.22, 1, 0.36, 1);   /* entrances, reveals */
--ease-soft: cubic-bezier(0.4, 0, 0.2, 1);     /* colour, opacity */

/* Spacing — 4px base */
4 · 8 · 12 · 16 · 24 · 32 · 44 · 56 · 80 · 112 · 144
```

### Components

| Component | Spec |
|---|---|
| Primary button | Crimson fill, white label, Jakarta 600 14–15px, padding 0.95em/1.6em, radius 2px. Hover: Crimson Deep, lift 2px. |
| Gold button | Gold fill, Maroon Ink label. Dark sections only, once per section. |
| Outline button | 1px `rgba(26,22,20,.28)` border, Ink label. Hover: Crimson border + label, 4% tint. |
| Ghost button | 1px `rgba(251,247,240,.35)` border on dark. Hover: Gold. |
| Text link | Crimson 600 with a 1px underline wiping in from the left over 0.4s. |
| Card | White, 1px rule border, radius 4px. Hover: lift 5px, shadow, gold-tinted border; image scales to 1.06 over 1s. |
| Overline | Bronze on light / Gold on dark. 12–13px, 600, 0.18em, uppercase, 28px hairline prefix. |
| Input | 1px rule border, radius 2px, 16px text. Focus: Crimson border + 3px `rgba(138,23,26,.1)` ring. |
| Table | Sand header, 11px uppercase labels, 1px row rules, 6% gold row hover. |
| Accordion | Fraunces 600 summary, Bronze plus-to-cross marker rotating 135° over 0.35s. |

### Motion

- Scroll reveals: 26px rise + fade, 0.9s, `--ease`, triggered at 8% into the viewport, once.
- Stagger between siblings: 0.09s, up to five steps.
- Hover 0.3s · page transitions 0.6–1.2s.
- Fast in, slow out.
- `prefers-reduced-motion: reduce` disables **everything** and shows all content immediately. Not optional.

---

## 8. Applications

**Website** — Parchment ground, alternating Sand and Deep Maroon sections, 1280px container. Crest at 46px in the header, shield mark as favicon. One primary Crimson action per screen.

**Letterhead A4** — Horizontal lockup top left at 40mm. Contact block bottom in Jakarta 8pt Ink Muted, 0.5pt Bronze rule above. Body 10.5pt.

**Business card 90×55mm** — Front: Maroon Ink, shield mark top left at 12mm, name in Fraunces 11pt white, role in Jakarta 6.5pt Gold at 0.16em. Reverse: Parchment, wordmark at 32mm, address in Jakarta 6.5pt Ink Muted.

**Certificates** — Heritage crest centred at 45mm, recipient name in Fraunces 28pt, double gold rule border (1.5pt + 0.5pt) 12mm inside the trim.

**Student ID** — Shield mark, photograph, name in Fraunces, class and ID in Jakarta, Crimson band across the head.

**Social** — Profile: shield mark on Maroon Ink with a 2px Gold ring, 400×400px. Cover: campus photograph with a Deep Maroon gradient from the left and the inverted lockup on that side. Posts: photograph-led; graphics use Deep Maroon ground, Fraunces headline, Gold overline, shield mark bottom right at 48px. Type inside a 10% safe margin, never over a face.

**Presentations** — Title slide: Maroon Ink, Fraunces headline white, Gold overline, inverted lockup bottom left. Content: Parchment, Crimson H2, Ink body 18pt minimum. Charts use Crimson → Bronze → Gold → Ink Muted. Embed or substitute fonts before sharing.

**Email** — Inline styles, single column at 600px, web-safe fallbacks on every rule, logo as a linked 2× PNG with alt text, buttons as bulletproof table cells.

**Signage** — Deep Maroon ground, heritage crest at scale, 1pt gold rule, descriptor tracked to 0.2em. Nothing else. Wayfinding in Plus Jakarta Sans 600, white on Deep Maroon.

**Print production** — CMYK only, never RGB or hex. Bleed 3mm all sides, critical content 5mm inside the trim. Proof against Pantone before bulk runs.

---

## 9. Accessibility

- All text meets WCAG AA; body and headings on Parchment exceed AAA.
- Body type never below 16px; captions never below 12px and never carrying essential information alone.
- Visible focus ring on every interactive element — 2px Crimson at 3px offset. Never `outline: none`.
- Tap targets at least 44×44px.
- Every image has alt text; decorative images take `alt=""`.
- Heading levels descend in order; one `h1` per page.
- Skip link to main content is the first focusable element.
- Colour never carries meaning alone — a notice tag has a word as well as a colour.
- `prefers-reduced-motion` fully honoured, including the hero crossfade.
- Forms have visible labels, not placeholder-only fields; errors announced in text.

---

## 10. Governance

| Content | Owner | Review |
|---|---|---|
| Homepage | Leadership & communications | Monthly |
| Admissions pages & forms | Admissions Office | Monthly during admission periods |
| Academic pages & subject lists | Academic leadership | Each academic year |
| Notices | Administration | As required; archive on expiry |
| Events & calendar | Administration | Weekly |
| Achievements | Academic & ECA coordinators | Monthly |
| Gallery | Communications | After each major event |
| Faculty & leadership | HR / Administration | Each academic year |
| Policies & child protection | Management | Annually or on change |
| Fees & payment | Finance | Each academic year |
| Contact details | Administration | Monthly verification |
| Careers | HR | As vacancies arise |
| Alumni | Alumni coordinator | Quarterly |

Any new asset carrying the crest is approved by the Principal's office against the checklist below before production. Give vendors **this document and the logo folder** — never a screenshot of the website.

---

## 11. Audit checklist

- [ ] Colours are exact palette values — no approximations
- [ ] Gold appears as a hairline or small accent, never a large fill
- [ ] Gold text on light ground has been changed to Bronze
- [ ] Typefaces are Fraunces and Plus Jakarta Sans only, correct weights
- [ ] Body text ≥16px screen / 10pt print, under 68 characters per line
- [ ] Correct logo variant for the size and background, full clear space
- [ ] Logo not stretched, rotated, shadowed, outlined or recoloured
- [ ] Photography is genuine Playpen material, unposed, consent on record
- [ ] Every image has meaningful alt text or is marked decorative
- [ ] Copy matches the voice attributes — no superlatives, no unsupported claims
- [ ] House style applied: Roman class numerals, CAIE not CIE, British spelling
- [ ] Dates, phone numbers, emails and subject lists verified as current
- [ ] Contrast passes AA for every text and UI element
- [ ] Co-branding follows partner sizing and spacing rules
- [ ] Time-sensitive content carries a *Last updated* date
