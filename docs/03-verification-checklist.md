# Pre-Launch Verification Checklist

**The school must confirm every item below before this site goes live.**

All copy on the new site was written from content scraped from playpen.edu.bd in September 2026. Some of that content is dated, internally inconsistent, or describes arrangements that may have changed. Nothing here was invented — but some of it needs a human at the school to say "yes, that is still true."

Items are marked:
**🔴 Blocking** — do not launch without confirming
**🟠 Important** — confirm within the first week
**🟡 Enrichment** — improves the site, not blocking

---

## 🔴 Blocking

### 1. The founding timeline
The old site says Playpen was **founded in 1977** but also refers to a kindergarten beginning in **1997**, with primary classes by **1998**. Those two statements cannot both be right. A 2026 recruitment page describes the school as having **49 years** of history while the homepage banner says **48**.

**The new site currently says:** founded 1977, kindergarten first, primary by 1998, "48 years" in the homepage statistic.

**Needed:** the official timeline from school management, and a decision on whether the year count is stated at all (it goes stale annually) or replaced with "Since 1977".

*Appears on:* `index.html` (hero, stats), `about.html` (story, timeline)

### 2. Current admission availability
The site currently promotes **A Level admission for July 2026 – June 2027**, taken from the live homepage notice.

**Needed:** confirmation this is still open, and which other classes are accepting applications. The announcement bar is set in one place — `build/build.py`, the `ANNOUNCE` constant.

*Appears on:* announcement bar, `admissions.html`, `news.html`

### 3. O Level and A Level subject lists
The site publishes **12 O Level subjects** (3 compulsory + 9 elective) and **9 A Level subjects**, taken from the Senior School page.

**Needed:** confirmation these are the subjects actually offered for the coming academic year. Subject availability changes with staffing and student numbers, and this is the highest-stakes content on the site — a family may choose Playpen because of a subject.

*Appears on:* `academics.html#subjects`, `index.html` (senior section), homepage stats

### 4. Every phone number and email address
The site publishes 11 phone numbers and 8 email addresses across five departments.

**Needed:** each one dialled and each one emailed. Old school sites accumulate dead numbers faster than any other content type.

*Appears on:* `contact.html`, `admissions.html`, `index.html`, footer on all 14 pages

### 5. Admission form PDFs
The site links to two PDFs still hosted on the WordPress uploads directory:
- `Admission-Form-2025-2026-Final.pdf` (PG–Class IX)
- `AS-LEVEL-FORM-2025-2026.pdf` (A Level)

**Needed:** confirmation these are the current forms for the coming year, and a plan for where they will live after the WordPress site is retired.

*Appears on:* `admissions.html#forms`, `admissions.html#entry`, `parents.html#downloads`

### 6. Leadership names and titles
Chairman, Managing Director, Principal, two Vice Principals, six Teacher-In-Charges — 11 named individuals with class assignments.

**Needed:** confirmation that every name, spelling, title and class band is current.

*Appears on:* `leadership.html`

### 7. Student names in achievements
Twelve achievement entries name individual students and their classes.

**Needed:** confirmation that consent is held for each, per the school's child protection policy. Any student whose family has withdrawn consent must be removed before launch.

*Appears on:* `achievements.html`, `index.html` (achievements section)

---

## 🟠 Important

### 8. The assessment process
The site states: assessment for PG and Nursery; written tests in English, Bengali and Mathematics from KG I to Class IX; Principal interviews; Class XI based on Mock Examination and O Level results.

**Needed:** confirmation this is how admissions actually run — particularly whether the Principal interviews at every entry point.

### 9. Uniform suppliers
Two authorised branches are published with four phone numbers (Gulshan: Pladium Market Shop 19; Bashundhara: Rupayan Shopping Square Shop 310).

**Needed:** confirmation both branches are still authorised and the numbers still work.

### 10. Payment channels
The site lists EBL (Visa/Mastercard), DBBL, Nagad, bKash, Rocket, Upay and Epay.

**Needed:** confirmation all seven are still accepted.

### 11. Office hours
Published as **9:00 AM – 1:00 PM** for the Admissions Office and **8:30 AM – 1:00 PM** for the bookshop. The old site did not state which days.

**Needed:** the days of the week. The site currently says "Sunday to Thursday" — this was inferred from standard Bangladeshi school practice and **must be confirmed or corrected**.

### 12. Transport routes
The site says the bus service has run since March 2014 and that parents apply at the Administrative Office. No routes are published.

**Needed:** decide whether to publish current routes. If yes, they need an owner who updates them each year.

### 13. Duke of Edinburgh's Award
Listed as an active programme for Classes VIII–XII.

**Needed:** confirmation the programme is still running.

### 14. Phase 2 construction
The site says the second phase of the building is "in progress" with additional laboratories, an expanded cafeteria, an advanced library and more recreational facilities.

**Needed:** current status. If Phase 2 has completed, the copy needs to move from future to present tense on `campus.html`.

### 15. Notice dates
The First Semester Examination notice refers to **30 November – 11 December 2025**, and the Parents–Teachers Meeting to **26 September**. Both were live on the old site.

**Needed:** current notices. These are placeholders demonstrating the layout.

### 16. Child Protection Policy and Code of Conduct
The site publishes **summaries** of both. The full policy documents were not available on the old site.

**Needed:** the official documents, so they can be linked as downloads, and legal/management sign-off on the summary wording.

---

## 🟡 Enrichment

| Item | What it unlocks |
|---|---|
| **Leadership headshots + short bios** | `leadership.html` is built for them; the cards drop straight in |
| **Faculty directory** | A searchable list would be a genuine differentiator — no competitor publishes one |
| **Principal's message** | Referenced in the old strategy documents but not on the live site; a strong trust asset for the About page |
| **Parent testimonials** | The site has none; two or three would strengthen admissions materially |
| **University destinations** | "Alumni study at premier universities globally" is a claim without evidence. A list of 15 destinations would fix that. |
| **Cambridge results data** | Results are the single highest-intent content for A Level admissions |
| **Fee structure** | Only publish if management wants it public and will keep it current |
| **Professional photography** | The existing library is usable but uneven. A half-day shoot covering classrooms, labs, library, sport and the campus exterior would lift every page. |
| **Alumni stories** | 3–5 profiles would make the alumni page live rather than aspirational |
| **Virtual campus tour** | High-effort, high-return for parents who cannot visit |
| **Bengali Tagore verse** | The alumni page historically carried a Tagore verse in Bengali; the text was not recoverable from the scrape and needs to be reinstated |

---

## Technical pre-launch

- [ ] 301 redirects deployed (see `02-redirect-map.md`) **before** DNS switch
- [ ] Enquiry forms wired to a mail handler or CRM — currently they show a prototype notice
- [ ] `sitemap.xml` submitted to Google Search Console
- [ ] Canonical URLs in `build/shell.py` confirmed against the live domain
- [ ] Google Analytics / Search Console verification tag added
- [ ] Favicon confirmed across browsers (currently the crest PNG; consider the shield-mark SVG)
- [ ] `/wp-content/uploads/` kept reachable, or each PDF redirected individually
- [ ] SSL certificate valid on the new host
- [ ] Test on a mid-range Android device on a 4G connection — that is the real user
- [ ] Keyboard-only navigation pass on all 14 pages
- [ ] Screen-reader pass on `index.html`, `admissions.html`, `contact.html`

---

## A note on what was not done

Two things in the source material were **deliberately not carried over**:

1. **The motto "Enter to Learn, Leave to Serve."** One of the strategy documents attributes this motto to Playpen. It does not appear anywhere on the live site, on the About page, or on the Mission page. It has not been used. If the school does have an official motto, it belongs in the hero and on the crest documentation — but it needed confirming, not assuming.

2. **Claims about results and rankings.** Some source material referenced "near-100% pass rates", "country highest" and "world highest" scores from external coverage. None of this was verifiable from the school's own site, so none of it was published. If the school holds the records, these are among the strongest assets available for the admissions section.
