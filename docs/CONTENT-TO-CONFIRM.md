# Content to confirm with the school

The Playpen School website, prepared by Defined Solution. Merged on 2026-10-11 from the seven group files that were in `docs/confirm/` (about, learning, admissions, school-life, community, contact-legal, foundation). This is now the one file to edit; the old files are kept for the record (see `docs/confirm/README.md`).

**How to use it.** Section 1 lists the decisions that change what a page may print, the first five being the ones every page depends on. Section 2 holds the questions that appear on several pages, answered once. Section 3 goes page by page in the order of the menu, and each bullet is *page, claim, why uncertain*; a line "Also see" names the sections above that touch the page. Section 4 is for Defined Solution only. The same notes sit as `<!-- CONFIRM: ... -->` comments next to the place they apply in `build/pages/` (145 at the integration build of 2026-10-11); the build removes them from the published HTML.

**Rule of the site.** Where the school has not said, the page says so calmly, gives the number to call and prints no figure it was not given. Nothing below is printed as fact unless a school source stands behind it; the bullets say which.


## 1. Decisions needed before the site is announced

These are the items that change what a page may print. Each says which pages it touches and what the school needs to give us.

### A1. Founding year: 1977 or 1997?

- **What is printed.** "Founded 1977" appears where the home shows it: the fact strip on /about/, the timeline and standfirst on /about/history/ (with a dagger footnote), the ledger on the home and the School JSON-LD (`foundingDate: 1977`). No page prints an age count ("48 years" or similar), and the 1997 line is deliberately not printed (the printed lines, "began as a kindergarten" and "by 1998 primary classes", fit either reading).
- **Why it is uncertain.** The school's own history page says 1977 and also that the kindergarten began in 1997 and that primary classes came by 1998; no year is given for the secondary classes. The plan also asks how the Banani campus fits (it is not on the site).
- **Needed from the school.** One signed official timeline (the Chairman's office with the Principal): the founding year, what began then, the Banani campus history, and whether a "years of operation" line may be printed. The plan treats this as week 1 because the home, About and History all depend on it.
- **Where it is printed:** the home (the "Founded" cell, the ledger, `data-founded` and the School JSON-LD), /about/ (fact strip and JSON-LD), /about/history/ (standfirst and first timeline entry) and the School JSON-LD on /contact/ (set once in `build/shell.py` as `foundingDate`). No other page prints the year.

### A2. The Principal's welcome (P03, `/about/principal/`) is not built

- **Why.** The page is the head's own words and face. No letter was supplied and none is written for her: a ghost-written letter without her sign-off is a risk the plan names. No page links to it, `nav.json` does not list it and the sitemap omits it. The site has 43 pages without it.
- **Needed from the school.** The letter text (200 to 350 words, in the Principal's own words, edited with her), a portrait (a short session in natural light; consent in writing), the name and title as she wants them printed (the site currently writes "Mrs Sorabon Tohura, Principal", from the school's administration page, September 2026), and optionally a 60-second video with captions and a transcript.
- **When it arrives.** Add `build/pages/about/principal.html` and one entry in `build/nav.json` (P03, slug `/about/principal/`, parent `/about/`), then run `python build/build.py`. The About hub's "Where next" and the Leadership page can then link to it.

### A3. Photographs of children: consent, years, names

The site's rule (stated on /privacy/) is that a photograph in which a child can be recognised is used only where the school holds the family's consent. The school has not confirmed that in writing for any frame yet. The state of the site:

- **Nine frames on the home need consent or replacing.** The graded set marks them "for private presentation only": `media/ascent-2`, `learning-2`, `learning-3`, `learning-4`, `life-2`, `life-3`, `life-5`, `life-9` and `news-3`. The home still uses all nine. `python build/check.py` reports them as one warning on `index.html`, and `--strict` fails on it, so the decision cannot be forgotten: either the school consents in writing (the coordinator then lists the stems in `docs/consent-cleared.txt`) or the frames are replaced. No inner page uses a flagged frame; the build refuses them.
- **The library frame (`media/ascent-3` and `media/menu-3`) shows several faces clearly** (a smiling boy, a girl in glasses, a girl in a blue jacket), although the catalogue calls it "backs of heads, acceptable". `media/menu-3` (the same frame) is the preview picture of the Learning group in the full-screen menu, so it is loaded on every page, the home included; `media/ascent-3` is used on the home's Ascent scene. Three page groups asked for the catalogue row to be changed to `faces`; that has not been done, because the build would then refuse the menu on every page. No inner page uses the frame as a plate (/about/campus/ and /school-life/school-day/ dropped it in review). Decide: get the school's written consent for it, or swap the menu preview (a change in `build/nav.json`, then `python build/sync_home.py`) and the home's Ascent frame.
- **Frames catalogued "distance" where a few faces can be made out at full size:** `media/menu-4` (families under bunting at Pohela Boishakh; the School life menu preview, the school-life hub gallery and the culture page), `media/news-1` (runners on the track, shown at 42 % width on /school-life/sports/), `img/sl-race-wide` (children racing, shown small), `img/examination-1.jpg` (an examination hall seen from above; hub card and Senior hero; heads 8 to 15 px across in the source, no face can be told from another) and `img/examination-2.jpg` (two foreground faces are clear; no page uses it). The school may confirm it is content, or give written consent so the coordinator can clear them.
- **Frames the school's own albums hold but the site does not use** (faces are clear): hurdles, sack race and relay at Annual Sports Day, the service projects, the Science Fair, `media/life-4` (cultural dancers) and `media/learning-1` (the 4:5 crop shows the front row). The school may supply consented photographs of community service, the Science Fair and sports action; each would improve its page.
- **Years in captions are the year of the school's own upload** (2024 for the atrium, terrace, stair, courtyard, laboratory glassware and the hall; January 2026 for the two Annual Sports Day frames; April 2025 for the Pohela Boishakh frames). Two captions carry no year because none is known. The school should confirm each year and that each frame may appear on a public page; every page's own photograph notes are in section 3.
- **Student names are left out everywhere.** The school's list of achievements (August 2023 to April 2024) names children; results appear on /learning/results/, /news/, /school-life/sports/ and /school-life/clubs-and-activities/ without names. The school should say which names, if any, may be published, and confirm the written parent and student consent it holds for each.
- **Takedown.** /privacy/ and /gallery/ say a parent may ask for a photograph of their child to be taken down by calling the further-queries line. That wording is ours; the school must agree to act on it and say which line takes it.

### A4. Fee amounts and fee policy

- **No fee amount is printed anywhere.** The school publishes no schedule. /admissions/fees/ and the FAQ say the school briefs families on the admission fee and the monthly tuition after selection, and give the number to call. No figure from press reports or from an older year (a 2020 report gave one for Class IX) is used, and the "20 to 50 per cent merit scholarship" in press coverage is not used.
- **Needed from the school (Accounts and Finance; the Chairman decides).** Whether to publish amounts at all. If yes: the 2026 to 2027 schedule by class (admission fee, monthly tuition), what the fees include (uniform, sportswear, books and copies, the bus), the payment window and the date tuition falls due each month, late-payment and refund rules, whether fees change from year to year, and the scholarship or concession policy. The "amounts" panel on /admissions/fees/ then becomes a dated table with the year and a review date. Without a decision the page stays as it is.
- **Pages:** `/admissions/fees/`, `/admissions/faq/`, `/admissions/how-to-apply/`.

### A5. Telephone lines, hours, forms and the map: dial and check once

- **Numbers.** All numbers come from `build/nav.json`: the admissions lines (Playgroup to Class I: 01755 689 482; Classes II to VI: 01755 515 893; Classes VII to XII: 01755 693 623; open 9.00 am to 1.00 pm) and the further-queries and emergencies lines (01755 515 885 and +880 9678 434241). The verification checklist asks that each number is dialled once.
- **What is not published.** The days the lines are open (the old draft said Sunday to Thursday; that was inferred and is not printed), the hours of the further-queries and emergency lines (none are printed for them), whether the section lines also take other parents' calls, and which number or office answers fees, bus applications, careers and alumni questions (we send them to "a further-queries line", which is our reading of the school's pages, not a published routing). WhatsApp is not on the site; the school has not said whether it wants a number.
- **Map pin.** The Map link searches the address in `nav.json`; the coordinates in the School JSON-LD (23.817814, 90.440179) come from the old site's Google Maps embed, and the further-queries number 01755 515 885 is used as the school's main telephone in the JSON-LD. Open the pin and check that it lands at the school gate.
- **Forms are prototypes.** The visit, enquiry and contact forms and the alumni registration form check what is typed in the browser and then show the school's numbers; nothing is sent, and each form says so before the visitor types. Wiring them to a mailbox needs the school's email address, a decision on who reads it and how fast it replies, and a rewrite of the "Forms on this site" chapter of /privacy/ (see A6).
- **Admission-form PDFs.** The two forms still live on playpen.edu.bd and are linked from /admissions/how-to-apply/, /learning/a-level/ and /about/policies/. See B9.

### A6. Email addresses and who reads the forms

- **No email address is printed on any page.** The school's address is hidden behind Cloudflare protection on its current site (the school does show addresses; they cannot be read by scripts), so none was copied. The school's admission procedure also says families may enquire "through school mail", and its code of conduct names "the school email" for changing contact details. The footer and the menu say "Email: see the contact page", and the contact page says that no address is printed and asks visitors to telephone. **The footer line leads to a page that says there is none: change one or the other once the school answers.**
- **Addresses the old Defined Solution draft listed and the old checklist marked unverified** (none is used): `info@`, `admission1@`, `admission2@`, `admission3@`, `accounts@`, `career@`, `alumni@playpen.edu.bd` and `playpen.center@gmail.com`.
- **Needed from the school.** The addresses it wants published (general, admissions, accounts, careers, alumni), who reads each, and whether the code of conduct's "school email" for changing contact details is the general one.
- **Pages:** the footer and menu on every page, `/contact/`, `/admissions/enquire/`, `/admissions/visit/`, `/about/careers/`, `/community/alumni/`, `/community/parents/`, `/privacy/`.

### A7. Invented sample content on the home

The home is kept as designed, apart from its generated menu, footer and head. It still carries copy the designer wrote as samples (`data-sample` in `site/index.html`, listed in `playpen-school-v1/docs/sample-copy.md`): the third notice ("Parent-teacher meeting, Classes IV to VII: Thursday 22 October 2026, 9.00 am to 12.00 pm"), the three events (18 November 2026, January 2027, 14 April 2027) and the one-line teasers of the three news cards. **The dates are invented.** They must be replaced by the school's real calendar or removed before the site is announced. `check.py` reports the sample notice as a warning because its hours differ from the admissions hours; that warning is expected until it is replaced. /notices/ and /events/ do not repeat the samples.

### A8. Names, titles and spellings of staff

Mrs Zeba Khan (Founder), Mr A. Mannan Khan (Chairman), Mr Mir Masud Kabir (Managing Director), Mrs Sorabon Tohura (Principal), Mrs Sharmin Hoque (Vice Principal, Playgroup to Class V), Mr Palash Kumar Kundu (Vice Principal, Classes VI to XII) and the six Teachers-in-Charge (Mrs Farhana Rehan, Mrs Farida Yasmin, Mrs Qamar Sultana Hamid, Mrs Samina Abedin, Mrs Roohi Shamima Choudhury, Mrs Khurshida Rahman Rimi), with their class bands, are taken from the school's administration page (September 2026). The verification checklist asks for a current staff list: names, exact titles and spellings, and whether Board of Management names, registration details and the audit report may be published. The site writes "Teacher-in-Charge" and no full stop after "Mr" and "Mrs". No portraits or biographies were supplied; the cards are text only. Pages: `/about/leadership/`, `/about/history/`, the stage pages under `/learning/`.

### A9. Other decisions the school or the founder must make

- **Privacy and terms.** /privacy/ and /terms/ are plain-language texts written by the designer, not legal advice. The school must approve them and may want a legal adviser to read them. See section 3 for each clause.
- **Social links.** The footer carries no social icons because ownership of the Facebook page "PlaypenCenter" is not confirmed. The plan asks which Facebook or Instagram accounts the school actually owns.
- **Cambridge standing.** Is the school registered with Cambridge International under this name, and may its logo be shown? Nothing on the site claims either. See /learning/cambridge-pathway/ in section 3.
- **Houses.** Only House Earth and House Jupiter are evidenced; the school must give the full list and colours.
- **Architects and the second phase.** Whether the architect may be credited by name and the second phase described (see /about/campus/).
- **Who owns notices and news.** The plan asks for a named owner and about two reports a month; an empty or stale news page is worse than none.
- **The school's own accessibility statement** is not among the 43 pages (the plan lists one for the footer). The site is built to WCAG 2.2 AA but no screen-reader test has been done by a person.


## 2. The same question on several pages

Each fact below appears on more than one page. The school answers it once; the pages named are then corrected together.

### B1. Accounts and Finance telephone numbers, and the tailoring house numbers
The school's contact page lists three Accounts and Finance numbers for fee and receipt questions (01313 025 955, 01755 515 890, 01730 068 808; plan F22), and its uniform page lists three for the tailoring house (01708 110 010 and 01904 439 184 at Gulshan, 01708 110 009 at Bashundhara). `build/nav.json` holds only the admissions and further-queries lines, and `build/check.py` rejects any other number typed on a page, so none is printed: fee and receipt questions go to the section lines or the further-queries line, and uniform questions to the section line. If the school confirms the numbers (or confirms that the further-queries line takes fee questions), Defined Solution adds them to `nav.json` as phone keys (an `accounts` entry, two tailoring entries) and each page gets one row. Pages: `/admissions/fees/`, `/community/parents/`, `/contact/`, `/admissions/starting-at-playpen/`.

### B2. Payment channels
The online payment page lists EBL with Visa and Mastercard, DBBL, Nagad, bKash, Rocket, Upay and Epay, and ends the list with "and many more". Confirm each is still accepted. "Online payment required since 2021 to 2022" is from the same page ("mandatory from the 2021-2022 Session"). Pages: `/admissions/fees/`, `/community/parents/`, `/admissions/faq/`.

### B3. Bus service
"The school runs its own bus service since March 2014; apply at the Administrative Office" is from the school's transport page. No routes, areas served, number of buses, attendants, GPS or tracking, fares or transport fee are published, so none is claimed; do not add a claim about tracking or attendants until the school confirms it. Pages: `/about/history/` (the 2014 timeline entry), `/admissions/starting-at-playpen/`, `/admissions/faq/`, `/community/parents/`, `/contact/`, `/community/alumni/` (timeline), `/school-life/transport-and-safety/`.

### B4. Code of conduct rules quoted on several pages
- **Mobile phones.** "No mobile phones up to Class XII", bags checked at entry in the morning, the list of devices, confiscated items returned at the end of the academic year, and the Admin Office on Level 2 for an urgent call. Confirm each is current. Pages: `/about/policies/`, `/admissions/starting-at-playpen/`, `/admissions/faq/`, `/community/parents/`, `/learning/middle/`.
- **Absence.** The code of conduct is read as "an absence of three days needs a signed application from a parent; beyond three consecutive days a medical certificate is also needed". The previous site worded the first threshold "exceeding three days". Confirm the exact thresholds. Pages: `/about/policies/`, `/community/parents/`, `/school-life/school-day/`.

### B5. Bookshop hours
The bookshop is open "8.30 am until 1.00 pm". The school gives the hours, not the days of the week; the old site's "Sunday to Thursday" was inferred and is not used. Where it is: the previous copy of the site says the bookshop is attached to the library, and /learning/, /learning/junior/, /community/parents/ and /school-life/school-day/ print "beside the library"; the admissions group could not find the placement on the school's own current pages, so /admissions/starting-at-playpen/ does not say it. Confirm the placement and the days. Pages: `/admissions/starting-at-playpen/`, `/community/parents/`, `/contact/`, `/school-life/school-day/`, `/learning/`, `/learning/junior/`.

### B6. The A Level admission notice (it expires)
On 11 October 2026 the school's home page offered admission to A Level for the academic year July 2026 to June 2027 (call 9.00 am to 1.00 pm; forms at the admin office and on the website; the notice carries no posting date). It will expire: the school must say when it comes down. The page that names a line for it uses the Classes VII to XII line because the notice's first number is that line. The year July to June is confirmed for A Level only; whether all classes follow it is not stated. Pages: `/admissions/` (hub, "current notice"), `/admissions/faq/`, `/learning/a-level/`, `/notices/`, `/events/`.

### B7. "Last reviewed 11 October 2026"
Several pages end with "last reviewed", "last updated" or "prepared from the school's own website in September 2026" (all /school-life/ pages, /admissions/fees/, /learning/examinations/, /learning/student-support/, /community/parents/, /privacy/, /terms/). The date is the day of this build and the review is Defined Solution's, against the school's published pages; it is not a review by the school. The school should read the page, and the date should then move to the day it does and name who reviews it and how often.

### B8. "Accredited by Cambridge and the British Council" (laboratories)
The school's page says its Physics, Chemistry, Biology and Computer Science laboratories are "accredited by Cambridge and the British Council" (a plan "unverified claim"). The wording is not used on any page until the school confirms it. Pages: `/about/campus/`, `/learning/middle/`. Which laboratory sessions Classes IV to VII have, and how often, is not published.

### B9. Admission-form PDFs
Two forms are linked from the old site: Playgroup to Class IX (`Admission-Form-2025-2026-Final.pdf`, 522,861 bytes, last modified 15 January 2026) and A Level (`AS-LEVEL-FORM-2025-2026.pdf`, 237,155 bytes, last modified 20 October 2025). Sizes and dates were re-read from the files' headers on 2026-10-11. The names say 2025 to 2026, while the notice is for July 2026 to June 2027: confirm they are the forms for the year families now apply to, and where the files will live once the old site is retired. Pages: `/admissions/how-to-apply/`, `/learning/a-level/` (step 2), `/about/policies/`.

### B10. Principal's interview and the admission test
The school's procedure page says students attend an interview with the Principal along with their parents after selection in the assessment or admission test, and that the Principal decides after the test result and the interview; the result is told by telephone. The verification checklist asks whether the Principal interviews at every entry point. Junior, Middle and Senior say "a written test in English, Bengali and Mathematics, then an interview with the Principal and parents; the result by telephone"; the Learning hub's Elementary card says "an assessment for Playgroup and Nursery, a written test from KG I". Documents to bring (the form, birth certificate, immunisation record and two years of report cards) are from the same page. Pages: `/learning/elementary/`, `/learning/junior/`, `/learning/middle/`, `/learning/senior/`, `/admissions/`, `/admissions/how-to-apply/`, `/terms/`.

### B11. Details the school has not published (so no page prints them)
Ages by class, class sizes, waiting lists, sibling rules, mid-year transfers, the weekly timetable, a "day at this stage", daily timings, and whether Junior classes have a class teacher plus an assistant. The stage pages leave them out on purpose (a comment in each source marks the place), and the FAQ's closing callout sends families to the admissions line. Pages: all five stage pages, `/learning/` hub, `/admissions/faq/`, `/school-life/school-day/`.


## 3. Page by page

Pages in the order of the menu. A page with no bullet of its own is covered by the sections above.



#### P01: Home (`/`)

- *Also see:* A1, A3, A7.


#### P02: About (`/about/`)

- **"The founding idea" callout and "The four goals"**: both restate, in plain words, the school's own mission statement ("to realise their full potential, children need a well-balanced programme in a creative learning environment"; four institutional goals). The wording is ours, the content is the school's; the school should approve it.
- **"A child who joins in Playgroup can stay until the end of school"**: follows from the home's "a child can go from Playgroup to Class XII without ever changing school".
- **Hero photograph `media/ascent-5`** ("The rooftop terrace, 2024"): the year is the one on the school's upload of the file (March 2024); confirm it, and that the photograph may appear on a public page.
- *Also see:* A1, A2.

#### P04: History (`/about/history/`)

- **"Secondary classes follow" (1998 entry) and "later it took on the secondary years"**: the school's history says the school "later became a high school"; no year is given.
- **"The first O Level candidate (2003) earns straight A grades in all seven subjects"**: the school's own statement; not independently checked.
- **"Chairman Mr A. Mannan Khan introduces A Level" (2013)** and **"oversaw the construction of the building"**: from the school's history and administration pages; the construction wording comes from the previous copy of the site and should be checked against the school's page.
- **"The first A Level batch enrols" (2015)**: as on the home's ledger.
- **"19 July 2018 ... under Principal Mrs Sorabon Tohura ... architect Mr Ehsan Khan"**: from the school's history page. The plan asks whether the architects may be credited by name; the project architect named in press coverage is not used.
- **"October 2026: the second phase of the building is in progress"**: as on the home (dated October 2026); the footnote says it is being confirmed. Applies to /about/campus/ too.
- **Names and titles (Founder Mrs Zeba Khan, Chairman, Principal)**: spellings and titles as published in September 2026. Earlier principals named only in press and Wikipedia (Sabera Parveen Harun, Shahriar Quader) are not printed; the school should say whether they may be named.
- **Archive photographs with years**: none supplied. The only old photographs on the previous site carry a printed age or year ("40 Ruby Jubilee", "Silver Jubilee") and show identifiable staff, so none is used. The page says the archive is "to be published by the school".
- **Photographs**: `img/about-history-crest` (the crest on the street facade, the school's upload of March 2024) and `img/about-playpen.jpg` ("The building from the lawn, 2021": the year is the school's upload date; the file is a low-resolution web copy).
- *Also see:* A1, A8, B3.

#### P05: Leadership (`/about/leadership/`)

- **Every name, spelling, title and class band** (Chairman Mr A. Mannan Khan; Managing Director Mr Mir Masud Kabir; Principal Mrs Sorabon Tohura; Vice Principals Mrs Sharmin Hoque, Playgroup to Class V, and Mr Palash Kumar Kundu, Classes VI to XII; six Teachers-in-Charge): taken from the school's administration page (September 2026). The verification checklist asks for a current staff list. The previous site spelled "Teacher-In-Charge" and "Mr."; this site uses "Teacher-in-Charge" and no full stop after the title, as the pilot pages do.
- **The notes under the Chairman and the Principal** repeat facts from the history page (A Level in 2013 and the construction; the move on 19 July 2018). The Managing Director has no note because the school gives none.
- **The class-band table** pairs each Teacher-in-Charge with the Vice Principal whose classes the band falls in (Playgroup to Class V: Mrs Hoque; Classes VI to XII: Mr Kundu). The pairing is read from the published class bands; the school does not state it in table form.
- **Portraits and short biographies**: none supplied; the cards are text only on purpose ("to be published by the school").
- **Governance** (Board of Management, registration details, audit report): none supplied; the plan treats the block as optional, so only a one-line note is shown. The school should say whether to publish any of it.
- **Phone lines by section** come from nav.json. They are the admissions lines; whether they also reach the Teacher-in-Charge of a class is not stated by the school, so the page only says "call the line for the section".
- **Hero photograph `img/about-leadership-planter`** (a curved brick planter inside the building, the school's upload of March 2024): confirm it may appear on a public page.
- *Also see:* A2, A5, A8.

#### P06: Campus (`/about/campus/`)

- **"Ten storeys", "in use since 19 July 2018", "designed by the architect Mr Ehsan Khan"**: as on the home and the school's pages; the architect credit needs the school's permission (see History).
- **"The classrooms are air-conditioned, and generators keep classes running through an electricity failure"**: the school's facilities list names generator-backed, air-conditioned classrooms. The previous copy of the site also called the laboratories, library, common room and teacher facilities air-conditioned; that is not printed until the school confirms it. "A day school, with no boarding" is from the school's description of itself as non-residential (also on /about/careers/).
- **"A basketball court sits on the roof"** (also on the home): from press coverage and the home's copy; the school's own list says only "basketball court". Confirm where it is.
- **Library classes for every level monitored by a Librarian, the borrowing rule, the bookshop alongside the library and parents collecting the year's books and copies at the start of each session**: from the school's library, bookshop and admissions pages. No photograph of the library is used (see Photographs).
- **"The Science Fair is one of the events in the school's year"** (Classrooms and laboratories): from the school's list of events and activities. The school lists the Science Fair among its annual events.
- **"The multipurpose hall holds the school's gatherings, from assemblies to cultural programmes and prize-givings; the building also has a students' gallery for group work and presentation, and rooms for art, music, dance, drama and clubs"**: from the school's facilities list. Where the gallery and the activity rooms are in the building is not stated, so none is claimed. The visit of NASA astronaut Joseph M. Acaba (December 2024) is as on the home.
- **A floor-by-floor list of what is where**: not supplied, so the chapters follow the kinds of room, not the floors. Photographs for each floor: none.
- **Second phase**: "in progress" (October 2026), and the planned additions (further laboratories, an expanded cafeteria, an advanced library, more recreational facilities) are from the school's campus page. No date, no plans or renders. Press detail (the plot size, 25 x 25 ft classrooms, the mock forest, nearly 2,000 students, a second architect) is unconfirmed (plan F07, F33) and is not used.
- **Photographs**: `img/about-campus-atrium` (hero), `img/about-campus-facade` ("January 2021": the date in the file name of the phone photograph), `img/about-campus-terrace` (2024), and the graded `media/life-0` (Pohela Boishakh, April 2025), `media/swatch-4` (a laboratory bench, September 2024), and `media/ascent-4` (the hall, December 2024). **`media/ascent-3` (the library) was taken off this page in review**: the catalogue lists it as "backs of heads, acceptable", but the frame shows several children's faces clearly (a boy smiling at the camera, a girl in a blue jacket, a boy reading, a girl with glasses). The coordinator should correct its catalogue row; it is still used on the home (the Learning menu preview, `media/menu-3`) and on /school-life/school-day/ and /school-life/transport-and-safety/.
- **Address, map, phone lines**: from nav.json.
- *Also see:* A3, A9, B8.

#### P07: Child protection (`/about/child-protection/`)

- **The statement ("Playpen adheres to the local and Cambridge Board's guidelines for child protection policy.")**: the school's whole page is that one sentence (plan F27). Check the wording against its page; the previous copy of the site gave a longer version ending "in all areas of imparting education, and in ensuring all manners of safety, security, health and hygiene".
- **The everyday measures** (CCTV, round-the-clock security, fire extinguishers on every floor, the internal telephone system, the sick room, drinking water and toilets on every floor, the Student Counsellor, identity cards worn daily, traffic and bag rules, the code of conduct): each is from the school's own campus, health, counsellor, identity card, transport and code-of-conduct pages. None is written as a policy the school adopted. Confirm each is current.
- **The route to raise a concern**: the school has published no procedure and no named person, and the page says so. It gives the three section lines (the admissions lines, open 9.00 am to 1.00 pm) and the further queries and emergencies line as "its telephone lines". Whether safety concerns go to those lines, and to whom, is for the school to say. The H1 and the meta description say "who to call with a concern", not "how to raise a concern", for the same reason. The previous copy of the site said to raise a concern "with the Class Teacher, the relevant Teacher-In-Charge, or the school office"; that wording is not repeated because the school never published it.
- **To be published by the school** (listed in the table on the page): the full written policy, the designated person and how to reach them, a written reporting procedure, a photograph and filming consent policy, a review date.
- **Hero photograph `img/about-safeguarding-stairs`** (a stairwell, the school's upload of March 2024).

#### P08: Policies (`/about/policies/`)

- **Every summary** is from the school's code of conduct, identity card, library, examinations and transport pages (September 2026). The school should confirm each is current and that these summaries may stand in until the formal documents are published.
- **Suspensions and expulsion**: "three suspensions in one academic year lead to expulsion; physical violence or abusive language leads to immediate expulsion". Confirm the wording and that it is to be public.
- **Disciplinary Committee**: who sits on it and how a case is handled are not published; the page says so.
- **Admissions terms and refund rules**: none supplied; listed in the index as "to be published by the school".
- **Policy PDFs and review dates**: none supplied; the page says the school has given no review dates (prepared September 2026).
- *Also see:* A5, B4, B9.

#### P09: Careers (`/about/careers/`)

- **"Many Faculty Members are serving here for as long as 30-40 years"**: the school's own statement on its careers page (plan F26); quoted and attributed, never stated as a fact. Confirm it, or supply a figure that can be checked.
- **The careers email address**: hidden behind Cloudflare protection on the school's own site, so none is printed. The page tells applicants to call the further queries and emergencies line and ask where to send their CV until the school supplies an address.
- **How to apply (CV as a Word or PDF file, a passport-size photograph as a JPEG)**: from the school's careers page.
- **"The school contacts candidates when an opening matches their qualifications"**: from the previous copy of the site; the school has not said how long it takes or how it replies. The previous copy also said that CVs "are kept on file"; that is not repeated.
- **"No vacancies are listed on this page today"**: the school's vacancies page was not readable in the scrape; the school must supply any open roles, with closing dates, eligibility and how to apply. The page does not promise closing dates. The source has a comment saying where the list goes.
- **Benefits the school is willing to state**: none supplied; none written.
- **Hero photograph `img/about-careers-models`** (clay models made by students on the chequerboard floor, the school's upload of August 2023): chosen because no photograph of teachers is cleared for use. It shows no people. Confirm the caption and that the school is content to use it.
- *Also see:* A6.


#### P10: Learning (`/learning/`)

- **"First O Level candidate 2003", "A Level classes begin 2013", "first A Level batch enrols 2015"**: dates from the school's history page; the same dates are on the home's ledger.
- **"Bengali is taught, and the school says it puts weight on preserving the Bengali language and on knowing Bangladesh's cultural heritage"**: the school's own wording on its academics page, restated.
- **Learning spaces list** (Physics, Chemistry and Biology laboratories; Computer Science laboratory; library with the bookshop; multipurpose hall): from the school's new-campus page.
- **Minimum of three subjects** (hub, Senior, A Level, Cambridge pathway): the school gives "at least three" for A Level only. The pages no longer say it for AS Level; confirm whether the same minimum applies to AS.
- *Also see:* B5, B11.

#### P11: Elementary (`/learning/elementary/`)

- **Hero photograph `img/elementary-hero`** (a wide crop of the Annual Sports Day 2026 frame, Playgroup to KG II, children seen from a distance): the school's own photograph; confirm it may appear on a public page, and that the caption "Annual Sports Day, January 2026" is right (taken from the school's own album title and the file's date).
- *Also see:* A8, B10, B11.

#### P12: Junior (`/learning/junior/`)

- **Subjects (English, Mathematics, Bengali)**: the school's pages describe only these three; the subject list and the weekly structure were not supplied.
- **Library lessons for every level, the Librarian, the borrowing rule**: from the school's library page; "modernised for the new campus" is from the same page.
- **A "pressure-free" approach**: the school's own description of the Junior curriculum; it is stated as the school's, not as a result.
- *Also see:* A8, B5, B10, B11.

#### P13: Middle (`/learning/middle/`)

- **Curriculum outline**: the school describes an approach (core subjects, technology, hands-on work, individual learning styles), not a subject list.
- **Uniform from Class IV (salwar-kameez, full trousers)**: from the school's uniform page.
- **Promotion rule for Classes IV to VII**: the school states the passing-marks rule for its Junior and Senior sections only. The Middle page's FAQ says so and sends families to the phone line; confirm whether Middle follows the same rule.
- **Documents to bring** (Middle School): the form, birth certificate, immunisation record and two years of report cards, from the school's admission-procedure page.
- *Also see:* A8, B4, B8, B10, B11.

#### P14: Senior (`/learning/senior/`)

- **The subject table (12 O Level subjects, 9 A Level subjects; minimums 6 and 3; electives chosen in Class VIII)**: from the school's Senior School page; the verification checklist calls this the highest-stakes content on the site. Confirm the subjects offered for the coming academic year. "Business Studies" at O Level and "Business" at A Level are as the school names them.
- **"Not listed" cells** (Bengali, Additional Mathematics and Art & Design at A Level): the school's A Level list does not include them; confirm that is deliberate.
- **Entry to Class X**: the school gives the written test up to Class IX and the mock-examination rule for Class XI, and nothing for Class X; the page says so and gives the number to call.
- **Cambridge examination series and registration route**: not published (the plan asks for May/June and October/November, with registration through the school); the page says so.
- **"The school says these qualifications give students a wide range of options"**: the school's claim, attributed; its further claim that they are "recognised by the world's best universities and employers" is not repeated.
- *Also see:* A3, A8, B10, B11.

#### P15: A Level (`/learning/a-level/`)

- **"A Level since 2013; first batch enrolled 2015"**: the school's history page.
- **How the AS and A Level years are arranged (which class sits AS, which sits A Level), intake dates, any entry-grade requirement**: not published; the page makes no claim.
- **Can a student who took O Level elsewhere apply?**: the school states only the mock-examination and O Level rule; the page says so and gives the number to call.
- **Where A Level students go next**: no list is published, so the page says nothing about destinations. A list needs the school's evidence and each student's consent.
- **Career guidance by "the Senior Vice-Principal and the Teacher In-Charge"**: the school names the posts, not the people; the page does not guess.
- *Also see:* A5, A8, B6, B9, B11.

#### P16: Cambridge pathway (`/learning/cambridge-pathway/`)

- **Which classes sit O Level, AS and A Level**: not stated by the school; the diagram groups classes by stage and does not place the examinations.
- **Whether Bangladesh Studies is taught as a subject**: the school's pages do not say.
- **Grading scale, examination series, registration route**: not published; the page says so.
- **Recognition and equivalence of O and A Level results in Bangladesh (the education board's certificate, local university entry)**: sources outside the school disagree about who issues what, so the page states nothing. The school should confirm the procedure with the education board.
- **Examination registration costs beyond tuition**: not published.
- **O Level or IGCSE**: the school's pages speak only of O Level; the page says it does not mention IGCSE and sends families to the number to call.
- **Glossary entries "Syllabus D" and "Mock examination"**: written from the school's own use of the words; confirm the wording.
- *Also see:* A9.

#### P17: Examinations (`/learning/examinations/`)

- **Two semesters, a written examination at the end of each, Progress Reports, passing marks in the core subjects, "a yearly aggregate below the minimum may mean no promotion"**: from the school's examinations page. The school states the rule for its Junior and Senior sections; whether Elementary and Middle follow the same rule is not stated.
- **Parent-teacher meetings with class-wise timings issued through the portal**: from the school's events copy; no meeting dates are printed (the old dates were samples).
- **Cambridge examination series, registration, deadlines and fees**: not published; the page says so and lists the school's phone lines.
- **Portal features (academic performance, class tests, class work markings, homework, report cards, attendance, punctuality, disciplinary issues, academic calendar)**: from the school's online-services page; confirm the portal still offers each.
- *Also see:* B7.

#### P18: Results (`/learning/results/`)

- **No examination results by year are published**: the school supplied none (no figures, no cohort sizes, no results documents), so no table is printed. Press and social-media reports of pass rates, "highest marks" and awards are not repeated: the school has not confirmed them.
- **"The first O Level candidate earned straight A grades in all seven subjects" (2003)**: the school's own statement on its history page; no Cambridge document supports it.
- **The eleven achievements (August 2023 to April 2024)**: from the school's achievements list (the first is titled "1st Space Exploration Olympiad" there; "1st" is the edition, not a place). That list names the students; the page does not, until the school confirms written parent and student consent for each name. The school's list has twelve events; the twelfth (an inter-class football event) has no detail in our copy and is not listed. Results after April 2024 are not in our copy.
- **Dates**: "January 2024" (two events), "August 2023" and "2023" (Spell Bee) are as precise as the school's list is; confirm exact dates.
- **"An award from Cambridge is listed only when the school can show the letter from Cambridge"**: a rule this page sets for itself; the school should agree to it.
- **"Names and photographs" note**: the school's own statement about consent, restated.
- *Also see:* A3.

#### P19: Student support (`/learning/student-support/`)

- **The counsellor, the career counsellors, the booking route, the health centre**: the school publishes no names, numbers or booking route; the page says so and gives the section lines.
- **Health centre**: nurse or doctor presence, hours and the hospital arrangement for serious cases are not published; the page says serious cases are handed to parents, as the school states.
- **Workshops and seminars (internet safety and social media, university applications for international institutions, Model United Nations, United World College programmes) and the Duke of Edinburgh's Award**: listed by the school; confirm they are still running.
- **Drinking water, fire extinguishers and separate toilets on every floor; sick room**: from the school's new-campus page.
- *Also see:* B7.


#### P20: Admissions (`/admissions/`)

- **"On 11 October 2026 the school's website offered admission to A Level for the academic year July 2026 to June 2027" (Current notice)**: the notice was on the school's home page on 2026-10-11 (contact numbers and 9.00 AM to 1.00 PM; forms at the admin office and on the website). It expires: the school must say when it should come down. The page names the Classes VII to XII line for it because the notice's first number is that line.
- **Interview with the Principal and the parents at Playgroup, Nursery and KG I to Class IX**: the school's procedure page says students attend an interview with the Principal along with their parents after selection in the assessment or admission test, and that the Principal decides after the test result and the interview. It describes no interview for Class XI, so the page says so for that entry point. Confirm.
- **Entry to Class X and Class XII**: the school's procedure describes Playgroup to Class IX and Class XI only. The page says so and sends families to the line for Classes VII to XII.
- **"Space changes by class and by year"**: follows from the school's "applications for the current year are accepted if there is available space"; the school should say which classes have space now.
- **"Visit the school with your questions" (step 01)**: the school's pages describe visiting the Front Office to enquire and to collect a form; they do not describe a tour or a section visit (see /admissions/visit/).
- **The "Before you apply" cards**: three hand-written cards (Fees and payment, FAQ, Starting at Playpen) instead of `{{children:/admissions/}}`, because the three steps above already link to the other three pages. They use nav.json's summaries; if a page is added to the group, add a card.
- **Photograph `img/admissions-stairs` ("A stairwell in the school building, 2024")** and **`img/admissions-lawn` ("The building seen from the lawn, 2023")**: the school's own files (DSC01235.jpg, March 2024; a Facebook export of May 2023). The captions use the upload year. Confirm they may appear on a public page. The same stairwell is also the hero of /community/alumni/, /learning/cambridge-pathway/ and /about/child-protection/ (other groups): the coordinator may want one of the four changed.
- *Also see:* B6, B10.

#### P21: How to apply (`/admissions/how-to-apply/`)

- **"The school's procedure ... describes no online application"**: the procedure page has parents collect or download the form and "usually" hand it in at the Front Office, and says families may enquire "through school mail". It describes no online submission. Confirm there is none, or give the online route.
- **Where the completed form is handed in (the Front Office) and that the Admission Department sorts forms**: from the procedure page ("Parents usually submit the Admission Forms in the Front Office which are then sorted by the Admission Department"; the page also says forms may be submitted to the Admissions Office). Confirm it is the same desk.
- **"Once the Principal has approved the form, the school calls the parents for the assessment or test"**: from the procedure page ("Upon approval of the Principal, Parents are then called up"). Confirm how the call is made and by whom.
- **Admission calendar, deadlines and the age for each class**: not published. The page says so and sends families to the lines. If the school has them, they belong in "Dates and timing".
- **"SMS to parents for bulk Playgroup and Nursery admission"** (the procedure page: "In the case of PG and Nursery bulk admission, an SMS is sent to all Parents of Playpen"): the meaning is unclear, so it is left out.
- **Documents list (form, birth certificate, immunisation record, report cards for the last two years)**: from the procedure page ("School Report Card of past two years"). The previous site added that report cards apply to a child coming from another school, and that A Level may need more documents; neither is on the school's page. The page adds only "ask the admissions line which apply" for a child who has not been at school before. The school should say which documents a Playgroup child needs.
- **Photograph `img/admissions-atrium` ("The atrium, 2024")**: DSC01290.jpg, March 2024; confirm public use and the year.
- *Also see:* A4, A5, B9, B10.

#### P22: Fees and payment (`/admissions/fees/`)

- **No fee amounts anywhere**: the school publishes no schedule. The page says the school briefs families on the admission fee and the monthly tuition after selection, and does not guess. No figure from press reports or from an older year (a 2020 report gave one for Class IX) is used.
- **Decision to publish fees**: if the school agrees, the "The amounts" panel becomes a dated table by class (admission fee, monthly tuition) with the year and a review date.
- **Scholarships and concessions**: no policy has been stated; the page makes no claim. A "20 to 50 per cent merit scholarship" figure in press coverage is unverified and is deliberately not used.
- **Refund rules, late-payment rules, whether fees change year to year**: not supplied; the page only lists them as questions to ask.
- **"Online payment required since 2021 to 2022"**: from the school's payment page ("mandatory from the 2021-2022 Session").
- **"Its Admission Department deals with the banking formalities"**: from the procedure page ("These banking formalities are dealt with by the concerned Admission Department").
- **The date tuition falls due each month (the 1st to the 10th, through EBL Banani or Bashundhara)**: found only on the school's staging site, so it is not stated. Step 04 says the date is not published.
- **"School items" (uniform, sportswear, books and copies, the bus) and "the pages do not say whether any is part of the fees"**: the school has not said what the tuition covers. It should.
- *Also see:* A4, B1, B2, B7.

#### P23: Book a visit (`/admissions/visit/`)

- **What a visit includes**: the school's own pages describe only visiting the Front Office to enquire and to collect a form. They say nothing about a tour of the building or of a section, and nav.json's description of this page, the home's "Come and see the school" band and the FAQ's "Can I visit before I apply?" all offer one. This page therefore says the school has not said what a visit includes and tells families to ask when they call. The school must say whether it welcomes such visits, on which days and at what times, who meets the family, how long it takes and who receives bookings.
- **Visit days and times, and how fast the school answers**: none supplied; the page makes no promise.
- **Parking and arrival for visitors**: not published. The page gives the address, the Map link and the school's rule for drivers (follow the school's traffic rules, do not blow the horn, slow down near the premises), from the code of conduct.
- **The form is a prototype**: it validates, shows the line for the chosen class and says nothing was sent. When a mailbox exists, the school should name who answers it.
- **Meta description**: the page overrides nav.json's, which says "Come and see the building and the section your child would join", for the reason above.
- **Photograph `img/admissions-entrance` ("The street frontage, 2024")**: DSC03968.jpg, March 2024, the crest and name on the board-marked concrete. Overhead wires cross the right of the frame; confirm public use.
- *Also see:* A5, A6.

#### P24: FAQ (`/admissions/faq/`)

- **Acceptance of O Level and A Level by Bangladeshi universities**: the school has published nothing; the answer says so. The school should supply one.
- *Also see:* A4, B2, B3, B4, B6, B11.

#### P25: Enquire (`/admissions/enquire/`)

- **Who reads enquiries, how quickly the school replies, and whether it will take questions on WhatsApp**: none supplied; the page shows no WhatsApp number and promises no reply time.
- **"The school gives admission results by telephone"**: from the procedure page ("the status of the Admission is informed to Parents over the telephone").
- *Also see:* A5, A6.

#### P26: Starting at Playpen (`/admissions/starting-at-playpen/`)

- **Uniform rules (none for Playgroup and Nursery, casual wear; uniform and sportswear compulsory from KG I; salwar-kameez and full pants from Class IV; white keds or sneakers and white socks for all students, especially Classes X to XII; red and black sweaters available at the school in the winter season, black allowed for Classes IX to XII, no hoodies or jackets; sportswear from the school and worn on Games days)**: from the school's uniform page, re-read on 2026-10-11. Colours are not stated there, so none are given. Confirm the rules are current. (Corrected in review: the footwear rule covers all students, not only X to XII; sweaters are a winter-season item; the hoodie and jacket rule is stated for Classes IX to XII.)
- **The tailoring house and its two branches (Pladium Market, Shop 19, Gulshan-2; Rupayan Shopping Square, Shop 310, Bashundhara)**: the school's uniform page speaks of "the Tailoring house" with a Gulshan Branch and a Bashundhara Branch, not of two separate tailors (corrected in review). Confirm both branches are still open. Their telephone numbers (01708 110 010 and 01904 439 184 at Gulshan, 01708 110 009 at Bashundhara) cannot be printed: `build/check.py` allows only the school's own numbers from nav.json. The page tells families to ask the section line. The Foundation should add the three numbers as phone keys if the school wants them shown.
- **"There is a cafeteria on the campus"**: from the school's facilities list; hours, menu and prices are not published.
- **Identity card (given after admission, worn every day on school premises, a lost or damaged card must be replaced)**: from the school's identity-card page, which says no more. Who issues it, the photograph, where a replacement is made and any fee are not stated. (Corrected in review: the "through the school office" wording came from the previous site and is not on the school's page.)
- **The portal (academic performance, class tests, homework, report cards, attendance)**: from the school's description. How a new family receives its login is not stated.
- **"Dates are published through the school's notices and the portal"; two semesters each ending with a written examination**: from the school's examinations and portal pages. Term dates themselves are not supplied (see /events/).
- **School day timings and a first-week routine**: not supplied; the page has none. It links to /school-life/school-day/.
- **"Before the first day" checklist**: every line restates something above; it is our summary, not a school document.
- **Photograph `media/life-7` ("Annual Sports Day, the field, January 2026")** and **`img/admissions-terrace` ("The terrace garden, 2024")**: the school's own files; the year is the upload year. Confirm public use. The Sports Day frame shows spectators in the foreground, seen from behind or in profile; its alt text was corrected in review (the buildings beyond the wall are apartment blocks, not the school).
- *Also see:* B1, B3, B4, B5.


#### P27: School life (`/school-life/`)

- **Events table, no dates**: the school has not supplied the months or dates of its events for 2026 to 2027. Only the two fixed national dates the school states (International Mother Language Day, 21 February; Victory Day, 16 December) appear. Independence Day and Pohela Boishakh carry no date on purpose.
- **"Five annual events"** (Annual Sports, community service, the Cultural Programme, the Science Fair, student workshops): the home page and the school's activities page say so; confirm the list is current.
- **"The Annual Milad, educational tours and year-group class parties"**: from the previous site's events list; confirm they are still held.
- **Houses**: only House Earth and House Jupiter are evidenced (the school's 2023 inter-house basketball result). The full list of houses and their colours is needed; the page says it has not been published.
- **Dates on the portal**: "the school announces dates as notices and publishes them on the portal with the academic calendar" comes from the previous site's notices page; confirm that this is current.
- **"Arts, Debate, Cookery" in the fact strip** is a short label for the school's own list of activities (Art and Craft, Music, Dance and Drama; Debate; Cookery); no activity was added.
- **Gallery captions and dates** (Annual Sports Day, January 2026; Pohela Boishakh, April 2025; the Annual Cultural Programme, 2024; the astronaut's visit, December 2024): taken from the school's album titles and the home page's captions.
- *Also see:* A3, A9, B7.

#### P28: Sports (`/school-life/sports/`)

- **Results table** (Hurdco Inter School Football, August 2023; inter-house basketball, 26 August 2023; Scholastica Inter School Football, January 2024): from the school's own list of achievements; they are more than a year old. The school should supply the current season. The age groups (U-17, U-15) are as that list gives them.
- **Next Annual Sports Day, tournament fixtures, season calendar, coaches, age groups per team**: not supplied; the page says so and sends families to the notices and the phone lines.
- **"The court is on the roof"**: from the home page ("A basketball court sits on the roof") and the press; the school's own facilities list says only "basketball court". Handball, football and athletics are not placed anywhere in particular because the school does not say where each is played.
- **`img/sl-race-wide`** (children in yellow and blue running to a finish tape, seen from far off, shown small beside the list of games): from the school's April 2023 upload; the media scout labelled it "football" but it shows a race. The event and the date are unknown, so the caption says only "A race on the grass field". Needs the school's caption. Catalogued as `distance`; kept small on purpose because the children's faces would be recognisable at hero size.
- **Plate `media/news-1`** (athletes on the track, Annual Sports Day, January 2026): the album names Annual Sports Day 2026 (Classes I to XII); the exact event on the track is not captioned, so the caption says only "Athletes on the track". Replaces `media/life-7` on this page (it stays on the hub gallery).
- **Hero `img/sl-displays`** (Classes I to XII in formation, a wide crop of the school's photograph "DSC00516", Annual Sports Day 2026): students seen from far off, two teachers in black in front. Catalogued as `distance`; confirm the caption "January 2026" and that the school is content to show the teachers.
- **Action frames not used**: the school's hurdles, sack-race and relay photographs from Annual Sports Day show runners' faces clearly enough to need written consent, so they are not on the page. Consented action photographs would improve this page.
- **`img/campus-1`** (the grass playground): no date known.
- *Also see:* A3, B7.

#### P29: Clubs and activities (`/school-life/clubs-and-activities/`)

- **Club days, age bands and who leads each activity**: not supplied; the page says so.
- **Duke of Edinburgh's Award**: the school lists it, runs workshops on it for senior students and has listed it for Classes VIII to XII; confirm that it is still running, which levels it offers and whether the school is a licensed centre.
- **Competition table (2023 and 2024)**: from the school's achievements list; names omitted; results are more than a year old. The school should supply the current record. The Spell Bee row has no month (the school gives only 2023).
- **Photographs `img/sl-clay-hero` and `img/sl-models`** (clay models on the courtyard floor; models of gardens and houses on the terrace steps): what the models were made for and when the photographs were taken are not stated by the school; the captions say only what is seen.
- **"Art & Design is one of the O Level electives"**: from the school's senior school page; confirm for the coming year.
- **Workshop topics** (internet safety, university applications, Model United Nations, United World College programmes, the Duke of Edinburgh's Award): from the school's workshop page; confirm they are current.
- *Also see:* A3, B7.

#### P30: Culture and service (`/school-life/culture-and-service/`)

- **Cultural Programme**: the school says only that it is its largest performance event, staged in the multipurpose hall. Contents, running order and the date of the next programme are needed.
- **Community service**: described by the school in general terms only (four kinds of service); no projects, dates, partners or numbers. This year's projects are needed.
- **Eco-Schools**: three Class IX students, first runners-up for Best Presentation, 14 October 2023 (the school's achievements list); names omitted.
- **Tiger mask and elephant board (`img/sl-tiger-mask`)**: who made it and where it was shown is not stated; the caption says only that it was on show at Pohela Boishakh, April 2025.
- **Pohela Boishakh 2025 description** (alpona on the courtyard floor, stalls, dance, red and white): from the home page and the school's album "Pohela Boishakh 1432".
- **Hero `img/sl-boishakh-hero`** (a wide crop of the courtyard from above): a crowd, no face identifiable.
- **Mission statement quotation**: the school's own wording from its statement of mission, vision and values (the first sentence only).
- *Also see:* A3, B7.

#### P31: Transport and safety (`/school-life/transport-and-safety/`)

- **Not published, therefore not claimed**: routes and areas served, number of buses, attendants, GPS or any tracking, the transport fee. The page says the school has not published them and sends parents to the Administrative Office. Do not add a claim about tracking or attendants until the school confirms it.
- **Bus rules and arrival and departure rules**: from the school's transport page; the three gate rules are written as "drivers are asked to", as the school words them.
- **CCTV, round-the-clock security, fire extinguishers on each floor, sick room, drinking water and separate toilets on each floor**: from the school's campus page; confirm they are current.
- **Identity cards worn daily** and **contact changes "in writing"**: from the previous site's Identity Card page and code of conduct; confirm current practice.
- **A student who needs a parent urgently reaches them through the school office**: the previous site says the Admin Office on Level 2; the site plan says the Front Office. The page says "the school office".
- **Hero `img/sl-street-hero`** (a wide crop of the street side of the building, school crest) and the stair plate `media/life-8` ("A red-tiled stair in the building, 2024"): year "2024" is the year of the school's upload (March 2024).
- **"Students are asked to carry their own bag instead of using the luggage compartment"**: the school's wording is about the bus ("rather than putting them in the luggage compartment"); the "three rules for the gate" are the school's one paragraph on arrival and departure, so the page no longer counts them.
- **Line for further queries and emergencies**: the first of the two numbers is shown as a card; the second is in the footer.
- *Also see:* B3, B7.

#### P32: The school day (`/school-life/school-day/`)

- **Start and finish times by section, the break and lunch routine**: not supplied. The page has four parts of the day with no clock times, and says timings are not published.
- **Cafeteria menu, prices, how children pay, whether food may be brought from home**: not supplied; the page says so.
- **Promotion rule** ("a set passing mark in the core subjects", Junior and Senior sections) and **"Class VIII students choose O Level electives at the end of the second semester"**: from the school's examinations and senior school pages.
- **"The school says its classes use multimedia projectors"**: the school's own claim (its multimedia projector page).
- **Portal contents** (academic performance, class tests, homework, report cards, attendance, punctuality, the academic calendar): from the previous site's online services section.
- **Photograph `img/examination-1`** (a high-angle view of an examination hall, students looking down at their desks): no date known; the school should supply the year and say which examination it shows. (The credits log names `img/examination-2` by mistake; the page uses `examination-1`.)
- **Hero `img/sl-courtyard-hero`** (the courtyard between the brick wings from above, no one in it; a 21:9 crop of the school's March 2024 photograph DSC01262, the same frame as `media/ascent-1`): the year "2024" is the year of the school's upload. It replaced `media/ascent-3` (the library), which the catalogue lists as `backs of heads` but which shows several children's faces clearly. A library photograph with nobody identifiable, or written consent for that one, would suit this page better.
- **Semester dates, examination schedules and event timings "published through the portal alongside the academic calendar"**: from the previous site's notices page; confirm that it is current.
- *Also see:* A3, B4, B5, B7, B11.


#### P33: Parents (`/community/parents/`)

- **Portal and online payment links**: both open the school's current website (playpen.edu.bd) in a new tab and are marked "current site". They stay there until the school moves them. Source: the school's portal and payment pages, September 2026.
- **How parents receive their portal sign-in, and what to do if it fails**: the school has published neither. The page says the portal runs on the school's own system and sends parents to the section phone lines if it will not open; confirm the school wants that.
- **Changing contact details "through the school email"**: the code of conduct names the school email, but no address is published (it is hidden on the school's current site). The page tells parents to apply in writing, says the code also names the school email, says this site prints no address and sends them to the section line.
- **Sick room and health facility** ("serious cases are handed over to parents"), **library books** (parent replaces or pays for a book not returned after a set period), **raising a concern with the class teacher, the Teacher-in-Charge or the office**: all from the school's own pages (older summaries); confirm the wording.
- **Hero photograph `img/community-parents-hero`** (the street front with the crest, March 2024, a crop of `DSC03968.jpg`, no people) and **`media/life-7`** (the Annual Sports Day display, January 2026; a few adults at the edge of the frame, seen from behind). The caption does not call them parents. Confirm the school is content for both to appear.
- **The question accordion** ("Expand all" added in review) answers eight questions from the code of conduct, the transport, bookshop, health and library pages; each answer follows the school's words, and none gives a number the school has not published.
- *Also see:* A5, A6, B1, B2, B3, B4, B5, B7.

#### P34: Alumni (`/community/alumni/`)

- **The association's purpose and wording**: the school's alumni page (via the previous site) says it wishes to connect with former students "who have excelled in their respective fields", collects details and a photograph by email, and publishes no events and no named alumni. The page restates that in plain words; the school should approve it. **Who may register**: the school does not say whether every former student may. The first draft said "anyone who studied at Playpen can register, in any class and any year"; that was removed in review. **The form's fields** (class and year you left, what you do now, a memory of Playpen) are ours, not the school's: confirm what the association wants to collect.
- **Who coordinates the association, and the email address**: none is named or published (the address is hidden on the school's current site). The form is therefore a prototype that sends nothing. The Foundation's plan holds a place for a coordinator and an inbox.
- **"To reach the school today"** (callout beside the form): the page says the school has published no alumni contact and gives its general further-queries line. Nothing says that line takes alumni registrations, and it has no published hours (none is printed). Confirm, or replace with the association's own contact.
- **A photograph with the registration**: the school asks for one; the prototype form cannot take a file (the plan asked for an upload with a size limit).
- **Personal data**: the form asks for name, class and year, email, phone and what the person does now. The privacy page (`/privacy/`) must cover how the school uses them before the form is wired to anything.
- **Timeline dates**: 2003 (first O Level candidate, top marks in seven subjects), 2013 (A Level begins), March 2014 (own bus service), 19 July 2018 (move to the present building) are from the school's history pages and the checklist; **2025 graduation of Ordinary and Advanced Level** is evidenced by the ceremony banner in the school's own photograph. Founding-year dates are left to /about/history/ because 1977 and 1997 conflict.
- **The Tagore verse** the old alumni page carried is not recoverable and is not reproduced.
- **Stories and events**: none supplied. The note says a story appears only when the person who tells it has agreed, by name. That is our wording of the plan's rule; confirm.
- **Photograph `img/gal-grad-hall`** (graduates seen from behind and above, a crop of the school's `DSC06075.jpg` that leaves out the audience): catalogued as "backs of heads". Confirm it may appear.
- **Hero `img/community-alumni-hero`** (a staircase, 2024, no people): confirm.
- *Also see:* A5, A6, B3.

#### P35: News (`/news/`)

- **Wording of every event report** (Sports Day 2026, Graduation Ceremony 2025, Pohela Boishakh 1432, the astronaut's visit, the Science and Technology Fair 2024, the Annual Cultural Programme 2024, the Playpen Interschool Football Tournament 2024): ours, written from the titles of the school's photograph albums and what the frames show. Replace with the school's own accounts when it supplies them.
- **Dates**: January 2026 (Sports Day; the album files are dated 29 and 31 January), April 2025 (Pohela Boishakh 1432), December 2024 (the astronaut; the home says December 2024), November 2024 (Science Fair; the home says November 2024). The graduation ceremony, the cultural programme and the football tournament are shown by year only, because the albums carry no event date.
- **Competition results**: all eleven are from the school's own achievements list (August 2023 to April 2024), with students deliberately not named. The class bands are kept (Class VII, VIII, IX, I). Confirm the school is content with those, and confirm the consent it holds for each family before any name is published. Award titles "Best Player", "Best Defender" and "Best Presentation" are reworded to avoid superlatives ("a player and a defender", "presentation category"). The Spell Bee result carries 2023 only. "1st Space Exploration Olympiad" is the list's title (first edition), not a ranking.
- **Nothing from the current school year (July 2026 to June 2027)**: no report supplied and no owner named. The plan asks for about two a month and an editor; an empty or stale news page is worse than none, so the cadence needs an owner.
- **Science and Technology Fair 2024 has no photograph here**: its graded frame (`media/news-3`) is flagged in the image catalogue as needing consent.
- **Hero `media/life-0`** (the courtyard at Pohela Boishakh from above, a crowd) and the cards' photographs (`media/life-1`, `img/gal-grad-hall`, `img/gal-boishakh-tiger` (replaced `media/news-2` in review: a paper tiger mask is a livelier card than a stall of pots), `media/ascent-4`): all catalogued as acceptable.
- **Category labels on the competition results** ("Result, olympiad", "Result, football", "Result, language" ...): ours, from the categories the old site's achievements page used (Olympiad, Language, Academic, Sport, Environment); confirm. **Scholastica Inter School Football**: the school's list says "Best Player and Best Defender"; the page says "a player award and a defender award" because the site makes no superlative claims. Confirm the wording.
- *Also see:* A3, A9.

#### P36: Events (`/events/`)

- **No event and no term date is listed**: the school has supplied no 2026 to 2027 calendar. The home still carries three invented sample events (18 November 2026, January 2027, 14 April 2027; already on the Foundation's list). They are not repeated here. When the school sends dates, list each as a row of `ul.rows` (as on /notices/) in place of the "Coming up" note.
- **The Parents-Teachers Meeting "26 September"** on the school's old events page gives no year and has passed; it is left out.
- **Semester structure** (Semester 1 teaching, a written examination at the end of each semester, progress reports after Semester 1, Class VIII electives at the end of Semester 2, promotion decisions for Junior and Senior sections after Semester 2): from the school's pages. The semester start and end dates and the examination dates are on the portal only.
- **Fixed days**: 21 February (International Mother Language Day) and 16 December (Victory Day) are the only days the school's page states. Annual Milad, Independence Day, educational tours and class parties carry no date.
- **"Most recent record here" column**: each link goes to a report on /news/ built from the school's albums (see above).
- *Also see:* A7, B6.

#### P37: Notices (`/notices/`)

- **The three notices** come from the school's own site (the ticker and its notices page, September 2026): the A Level admission notice (academic year July 2026 to June 2027; it carries no posting date), the mobile-phone standing notice (from the code of conduct) and the First Semester Examination notice (30 November to 11 December 2025; classes for Playgroup to KG II continued until 8 December 2025), which has expired and is shown as such.
- **Notice owner**: the plan asks for a named owner and for categories (admissions, academic, transport, general); none has been given. The chips offer Admissions, Academic and Policy, the three the real notices need; add Transport and General when the school sends one.
- **"Forms are available in the admin office and on the school's website"** (A Level notice): as the school's notice says; confirm it is still true.
- **Expired notices stay on the board, marked "Expired"** (standfirst, "How notices work"): our proposal from the plan, not a school rule. Confirm the school will keep them.
- **Hours for the section lines**: where the page sends families to the section lines it says "The school publishes 9.00 am to 1.00 pm for these lines" (the admissions hours); the same applies on /news/ and /events/.
- *Also see:* A7, A9, B6.

#### P38: Gallery (`/gallery/`)

- **Twenty photographs, five albums**: every frame is one the image catalogue allows (no identifiable child). Nine frames are new crops made for this group (and two more for the parents and alumni heroes) (`gal-sports-march`, `gal-boishakh-tiger`, `gal-grad-hall`, `gal-art-clay`, `gal-art-fort`, `gal-art-garden`, `gal-atrium`, `gal-planter`, `gal-terrace`) from the school's own uploads, logged in `docs/credits-log.md` and `docs/image-catalogue-new.md`.
- **Dates in captions**: January 2026, April 2025, December 2024 and 2025 are as above; the Art and Craft frames have no date in the albums; the building frames are from 2021 and 2024 (the school's uploads).
- **Frames the catalogue allows but this gallery does not use**: `media/life-4` (cultural-programme dancers, the faces are fairly visible at the size shown) and `media/learning-1` (the 4:5 crop shows the faces of the front row). The wide crop `img/elementary-hero` is used for Playgroup to KG II instead. The school should confirm both choices, and may consent to more frames in writing (the coordinator then records them in `docs/consent-cleared.txt`).
- **The school's longer gallery** (36 albums by event, on playpen.edu.bd) shows children's faces; none of its frames is used here. The page says so and links to the school's current website.
- **"To ask for a photograph of your child to be taken down, call the school's further-queries line"**: our wording; confirm the school will act on such a request and which line takes it. The line has no published hours, so none is printed.
- **Layout (review)**: the albums are an even grid (every thumbnail cut to 4:3 from a tablet up; the lightbox shows the whole frame). The astronaut's painted portrait and the paper tiger mask are tall frames cut to 4:3 in the grid (the lightbox shows the whole of each).
- **Page weight**: the checker estimates 3.7 MB because it counts every fallback JPG; the photographs are lazy-loaded and served as AVIF or WebP, so a first view loads far less. Fewer albums would bring the estimate under 2 MB; decide at integration.
- *Also see:* A3.


#### P39: Contact (`/contact/`)

- **No email address is printed** (the "Email" note beside the form says "The school's email address is not printed on this site. Please telephone"; reviewed: it no longer says the school has none, because its current site does show addresses, only hidden from scripts by Cloudflare protection, plan F22). The footer and menu say "Email: see the contact page". The previous DS draft of the contact page listed `info@`, `admission1@`, `admission2@`, `admission3@`, `accounts@`, `career@`, `alumni@playpen.edu.bd` and `playpen.center@gmail.com`; the old verification checklist (item 4) marks every one of them unverified, so none is used. The school must supply the addresses it wants published. **The footer line "Email: see the contact page" leads to a page that says there is no address: the coordinator should change one or the other once the school answers.**
- **Routing in the form notice and the "Who to ask" table**: the admissions lines and the section lines are the school's published lines. Sending fees, bus applications (after the Administrative Office), careers and alumni questions to "a further-queries line" is our reading of the school's "further queries and emergencies" lines, not a published routing; the school should say which number or office answers each.
- **"Visiting" row** (reviewed, new): says only "to arrange a visit, call the admissions line for your child's section" and links Book a visit. The school's pages say families may come and see the building and the section; days, times and who takes the booking are not published (the /admissions/visit/ page has the same gap).
- **"By car" arrival note** (follow the school's traffic rules, avoid the horn, slow down near the premises): from the old contact page ("Arriving by car") and the code of conduct; the school has published no parking or drop-off arrangements, so none are described.
- **Map pin**: the map link searches the address in nav.json; the coordinates in the JSON-LD come from the old Google Maps embed. Check that the pin lands at the school gate. No static map image is used (none exists in the media set; a live embed would load Google's scripts).
- **WhatsApp**: not on the page. The plan lists it as a decision for the school; no number has been supplied.
- **Photograph "the school building seen from the grass playground"** (`img/about-playpen.jpg`, no date in the caption; catalogue: people "none", "good, low resolution"): the school's own photograph from its site (uploads/2021/06), children visible only at a distance. Confirm it may appear on a public page.
- **The form is a prototype**: it checks the browser fields and shows the school's lines; nothing is sent. Reviewed: only the topic is required (name, phone and message are optional), so the page asks for as little as it can while it sends nothing; when it is wired to a mailbox the school will want name and phone required again. Wiring it to a mailbox needs the school's email address, a decision on who reads it, and a rewrite of `/privacy/` chapter "Forms on this site".
- *Also see:* A5, A6, B1, B3, B5.


#### U01: Privacy (`/privacy/`)

- **Whole page: approval and legal check.** The text is a plain-language description of the site as built on 11 October 2026 (the plan flags: "Not legal advice; the school should have it checked"). The school must approve it, and may wish to have it read by a legal adviser, before it is relied on. It names no law and no regulator.
- **Search words (reviewed, corrected)**: the search form uses GET, so the words reach the host in the page address (`/search/?q=...`). The first draft said the words "are not sent anywhere"; that was wrong and is now stated plainly. The matching itself happens in the browser.
- **"No cookies, no analytics, no advertising, nothing loaded from other sites"**: true of the site as built on 2026-10-11 (the checker refuses outside loads; `js/` writes no cookie). It stops being true the day the school adds a measuring tool (the pre-launch checklist mentions a Google Analytics or Search Console tag), an advert or a connected form; this page then changes first.
- **Browser storage table and the "three small notes" fact** (Reduce motion, place on the home page, opening animation seen): read from `js/main.js` and `js/inner.js` (`pp:motion` in local storage; `pp:y` and `pp:introSeen` in session storage; the developer-only `?present=1` mode also writes `pp:tier` and `pp:scroll`, which no visitor meets). Reviewed: the at-a-glance strip said "one setting" while the table lists three; it now says three. Update both if the scripts change.
- **Hosting provider and server logs**: the site is served from Vercel today (playpen-school.vercel.app) and may move to the school's own domain. The page names no provider and says only that hosts keep routine logs. The school should say where the logs are kept and for how long.
- **Retention and access for admission records**: the school has published nothing on how long it keeps them, who sees them, or whether it has a written data-protection policy. The page says so and sends parents to the admissions line. If a policy exists, link it here (a `doc-list`).
- **Photographs of children**: the page says the photographs are the school's own (credits log), that a photograph in which a child can be recognised is used only where the school holds the family's consent (reviewed: "the school's consent" in the first draft meant nothing, since the school is the publisher), and that a parent may ask for one to be taken down. None of this is in the school's own pages. This is true on the live site only when the nine frames flagged on the home (`docs/confirm/foundation.md`) are either cleared in writing or replaced. The take-down wording needs the school's approval.
- **"If a form is ever connected" callout**: a promise written by us, not by the school: that a form which sends information would first be explained on this page. The school should agree to it.
- *Also see:* A3, A6, A9, B7.

#### U02: Terms of use (`/terms/`)

- **Whole page: approval and legal check.** Plain-language terms written by the site's designer, not legal advice. The school must approve them. No governing-law, jurisdiction, liability or indemnity clause is included; those are for the school's adviser.
- **Clause 2, "the text and photographs belong to The Playpen School", "name and logo" (reviewed: "crest" changed to "logo", the word in the brand notes), "photographs that show children are not to be copied or reused" (our wording, not a published rule)**: the credits log records every photograph as the school's own, and the text is the school's, set out by Defined Solution; the school should confirm the ownership wording and whether the crest may be used by others on request.
- **Clause 4, admission "is decided by the school through an assessment or a written test, an interview, and the Principal's decision; applications are accepted if there is space"**: from the school's admission procedure (plan F11). The old checklist asks whether the Principal interviews at every entry point.
- **Clause 7, "designed to work with a keyboard, a screen reader and enlarged text"**: the intent of the build (WCAG 2.2 AA). It has not been tested with a screen reader by a person; there is no accessibility statement page (see `docs/confirm/foundation.md`).
- **Dates**: both pages say "Last updated 11 October 2026" (the date they were written). The school should say who reviews them and how often.
- *Also see:* A9, B7, B10.

#### U03: Sitemap (`/sitemap/`)

- Nothing page-specific beyond sections 1 and 2.

#### U04: Search (`/search/`)

- Nothing page-specific beyond sections 1 and 2.

#### U05: Page not found (`/404/`)

- Nothing page-specific beyond sections 1 and 2.

## 4. For Defined Solution (not the school)

Technical and housekeeping items from the page groups, for the coordinator. None needs the school.

- **`site/credits.html`, `site/audit-report.html`, `site/report-summary.html`** are Defined Solution's own pages (the asset register, the audit and the case study of the previous site). They were left untouched, are not linked from the school's site and are disallowed in `robots.txt` (the audit and summary load Google Fonts from a CDN; `credits.html` still says "Private presentation sample"). Decide whether they stay in the school's published folder; moving them out of `site/` is the clean answer.
- **Hours wrap.** `{{hours}}` and `{{hours:between}}` come out with ordinary spaces, so a narrow column can break after "9.00" and leave "am" at the start of the next line (seen on the Junior, Middle, A Level and Student support pages). Non-breaking spaces in `nav.json`'s `hours`, `hours_between` and `hours_note` would fix it for every page, but `check.py` compares those strings, so change both together.
- **`white-space: nowrap` on `tel:` links** (it is in `learning.css`) would suit `pages.css`.
- **Footer "Learning" column** lists Overview, Elementary, Junior, Middle, Senior, A Level and Cambridge pathway; it has no link to Examinations, Results or Student support (they are in the menu, the Learning hub and the sitemap). That is `nav.json` (`footer: learning` on those pages).
- **Catalogue rows to correct** when the decision in A3 is made: `media/ascent-3` and `media/menu-3` (library: `faces`), `img/examination-2.jpg` (two clear faces; the row says "distance").
- **Accessibility.** No accessibility statement page; no screen-reader test by a person.
- **The domain.** The redirects in `vercel.json` also catch the old WordPress paths if `playpen.edu.bd` is ever pointed at this project (see `docs/02-redirect-map.md`). Until the school's own pages move, the portal, online payment, admission form, mission statement and `/wp-content/uploads/` links stay on `playpen.edu.bd` and must keep working there; do not point that domain at this project before those resources have a new home.
