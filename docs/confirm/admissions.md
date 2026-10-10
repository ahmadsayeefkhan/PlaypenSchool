# To confirm with the school: admissions group

Pages: /admissions/, /admissions/how-to-apply/, /admissions/fees/, /admissions/visit/, /admissions/enquire/, /admissions/starting-at-playpen/ (the FAQ is the Foundation's pilot; its items are in `foundation.md`).
One bullet each: page, claim, why uncertain. Written 2026-10-11 from the school's own pages and the plan's fact ledger. Reviewed the same day against the school's live pages (admission procedure, uniform, bookshop, transport, online payment, identity card, code of conduct, contact and the home notice, all fetched on 2026-10-11); the corrections are noted below.

## /admissions/ (hub)

- **"On 11 October 2026 the school's website offered admission to A Level for the academic year July 2026 to June 2027" (Current notice)**: the notice was on the school's home page on 2026-10-11 (contact numbers and 9.00 AM to 1.00 PM; forms at the admin office and on the website). It expires: the school must say when it should come down. The page names the Classes VII to XII line for it because the notice's first number is that line.
- **Interview with the Principal and the parents at Playgroup, Nursery and KG I to Class IX**: the school's procedure page says students attend an interview with the Principal along with their parents after selection in the assessment or admission test, and that the Principal decides after the test result and the interview. It describes no interview for Class XI, so the page says so for that entry point. Confirm.
- **Entry to Class X and Class XII**: the school's procedure describes Playgroup to Class IX and Class XI only. The page says so and sends families to the line for Classes VII to XII.
- **"Space changes by class and by year"**: follows from the school's "applications for the current year are accepted if there is available space"; the school should say which classes have space now.
- **"Visit the school with your questions" (step 01)**: the school's pages describe visiting the Front Office to enquire and to collect a form; they do not describe a tour or a section visit (see /admissions/visit/).
- **The "Before you apply" cards**: three hand-written cards (Fees and payment, FAQ, Starting at Playpen) instead of `{{children:/admissions/}}`, because the three steps above already link to the other three pages. They use nav.json's summaries; if a page is added to the group, add a card.
- **Photograph `img/admissions-stairs` ("A stairwell in the school building, 2024")** and **`img/admissions-lawn` ("The building seen from the lawn, 2023")**: the school's own files (DSC01235.jpg, March 2024; a Facebook export of May 2023). The captions use the upload year. Confirm they may appear on a public page. The same stairwell is also the hero of /community/alumni/, /learning/cambridge-pathway/ and /about/child-protection/ (other groups): the coordinator may want one of the four changed.

## /admissions/how-to-apply/

- **"The school's procedure ... describes no online application"**: the procedure page has parents collect or download the form and "usually" hand it in at the Front Office, and says families may enquire "through school mail". It describes no online submission. Confirm there is none, or give the online route.
- **Where the completed form is handed in (the Front Office) and that the Admission Department sorts forms**: from the procedure page ("Parents usually submit the Admission Forms in the Front Office which are then sorted by the Admission Department"; the page also says forms may be submitted to the Admissions Office). Confirm it is the same desk.
- **"Once the Principal has approved the form, the school calls the parents for the assessment or test"**: from the procedure page ("Upon approval of the Principal, Parents are then called up"). Confirm how the call is made and by whom.
- **The two PDF forms**: Playgroup to Class IX (`Admission-Form-2025-2026-Final.pdf`, 522,861 bytes, last modified 15 January 2026) and A Level (`AS-LEVEL-FORM-2025-2026.pdf`, 237,155 bytes, last modified 20 October 2025). Sizes and dates re-read from the files' headers on 2026-10-11 and unchanged. The file names say 2025 to 2026: confirm these are the forms for the year families now apply to, and where the files will live once the old site is retired.
- **Admission calendar, deadlines and the age for each class**: not published. The page says so and sends families to the lines. If the school has them, they belong in "Dates and timing".
- **"SMS to parents for bulk Playgroup and Nursery admission"** (the procedure page: "In the case of PG and Nursery bulk admission, an SMS is sent to all Parents of Playpen"): the meaning is unclear, so it is left out.
- **Documents list (form, birth certificate, immunisation record, report cards for the last two years)**: from the procedure page ("School Report Card of past two years"). The previous site added that report cards apply to a child coming from another school, and that A Level may need more documents; neither is on the school's page. The page adds only "ask the admissions line which apply" for a child who has not been at school before. The school should say which documents a Playgroup child needs.
- **Photograph `img/admissions-atrium` ("The atrium, 2024")**: DSC01290.jpg, March 2024; confirm public use and the year.

## /admissions/fees/

- **No fee amounts anywhere**: the school publishes no schedule. The page says the school briefs families on the admission fee and the monthly tuition after selection, and does not guess. No figure from press reports or from an older year (a 2020 report gave one for Class IX) is used.
- **Decision to publish fees**: if the school agrees, the "The amounts" panel becomes a dated table by class (admission fee, monthly tuition) with the year and a review date.
- **Scholarships and concessions**: no policy has been stated; the page makes no claim. A "20 to 50 per cent merit scholarship" figure in press coverage is unverified and is deliberately not used.
- **Refund rules, late-payment rules, whether fees change year to year**: not supplied; the page only lists them as questions to ask.
- **Payment channels (EBL with Visa and Mastercard, DBBL, Nagad, bKash, Rocket, Upay, Epay)**: as on the school's payment page, which ends the list with "and many more". Confirm all are still accepted.
- **"Online payment required since 2021 to 2022"**: from the school's payment page ("mandatory from the 2021-2022 Session").
- **"Its Admission Department deals with the banking formalities"**: from the procedure page ("These banking formalities are dealt with by the concerned Admission Department").
- **The date tuition falls due each month (the 1st to the 10th, through EBL Banani or Bashundhara)**: found only on the school's staging site, so it is not stated. Step 04 says the date is not published.
- **Accounts and Finance telephone numbers**: on the school's contact page (01313-025-955, 01755-515-890, 01730-068-808) but not in `build/nav.json`, and `build/check.py` rejects any typed number that is not in nav.json, so the page sends payment questions to the section lines and the further-queries line. The Foundation should add them as phone keys if the school wants them shown here.
- **"School items" (uniform, sportswear, books and copies, the bus) and "the pages do not say whether any is part of the fees"**: the school has not said what the tuition covers. It should.
- **"Last reviewed 11 October 2026"**: our review date, against the school's own pages. The school should replace it with its own review date.

## /admissions/visit/

- **What a visit includes**: the school's own pages describe only visiting the Front Office to enquire and to collect a form. They say nothing about a tour of the building or of a section, and nav.json's description of this page, the home's "Come and see the school" band and the FAQ's "Can I visit before I apply?" all offer one. This page therefore says the school has not said what a visit includes and tells families to ask when they call. The school must say whether it welcomes such visits, on which days and at what times, who meets the family, how long it takes and who receives bookings.
- **Visit days and times, and how fast the school answers**: none supplied; the page makes no promise.
- **Parking and arrival for visitors**: not published. The page gives the address, the Map link and the school's rule for drivers (follow the school's traffic rules, do not blow the horn, slow down near the premises), from the code of conduct.
- **The form is a prototype**: it validates, shows the line for the chosen class and says nothing was sent. When a mailbox exists, the school should name who answers it.
- **Meta description**: the page overrides nav.json's, which says "Come and see the building and the section your child would join", for the reason above.
- **Photograph `img/admissions-entrance` ("The street frontage, 2024")**: DSC03968.jpg, March 2024, the crest and name on the board-marked concrete. Overhead wires cross the right of the frame; confirm public use.

## /admissions/enquire/

- **Who reads enquiries, how quickly the school replies, and whether it will take questions on WhatsApp**: none supplied; the page shows no WhatsApp number and promises no reply time.
- **Email address for admissions**: the school's address is hidden on its current site, so none is shown (same as the footer). The procedure page also says families may enquire "through school mail".
- **"The school gives admission results by telephone"**: from the procedure page ("the status of the Admission is informed to Parents over the telephone").

## /admissions/starting-at-playpen/

- **Uniform rules (none for Playgroup and Nursery, casual wear; uniform and sportswear compulsory from KG I; salwar-kameez and full pants from Class IV; white keds or sneakers and white socks for all students, especially Classes X to XII; red and black sweaters available at the school in the winter season, black allowed for Classes IX to XII, no hoodies or jackets; sportswear from the school and worn on Games days)**: from the school's uniform page, re-read on 2026-10-11. Colours are not stated there, so none are given. Confirm the rules are current. (Corrected in review: the footwear rule covers all students, not only X to XII; sweaters are a winter-season item; the hoodie and jacket rule is stated for Classes IX to XII.)
- **The tailoring house and its two branches (Pladium Market, Shop 19, Gulshan-2; Rupayan Shopping Square, Shop 310, Bashundhara)**: the school's uniform page speaks of "the Tailoring house" with a Gulshan Branch and a Bashundhara Branch, not of two separate tailors (corrected in review). Confirm both branches are still open. Their telephone numbers (01708 110 010 and 01904 439 184 at Gulshan, 01708 110 009 at Bashundhara) cannot be printed: `build/check.py` allows only the school's own numbers from nav.json. The page tells families to ask the section line. The Foundation should add the three numbers as phone keys if the school wants them shown.
- **Bookshop "8.30 am until 1.00 pm"**: the school gives the hours but not the days of the week. The old site's "Sunday to Thursday" was inferred and is not used. The school's pages do not say where the bookshop is (the previous site's "alongside the library" is not on the school's pages), so the page no longer says so.
- **"There is a cafeteria on the campus"**: from the school's facilities list; hours, menu and prices are not published.
- **Bus "since March 2014" and "apply at the Administrative Office"**: from the school's transport page; no routes or fares are published.
- **Identity card (given after admission, worn every day on school premises, a lost or damaged card must be replaced)**: from the school's identity-card page, which says no more. Who issues it, the photograph, where a replacement is made and any fee are not stated. (Corrected in review: the "through the school office" wording came from the previous site and is not on the school's page.)
- **The portal (academic performance, class tests, homework, report cards, attendance)**: from the school's description. How a new family receives its login is not stated.
- **"Mobile phones are not allowed for students up to Class XII" and the code of conduct covering absence and contact details**: from the school's code of conduct; confirm it is current. The absence rule is not restated.
- **"Dates are published through the school's notices and the portal"; two semesters each ending with a written examination**: from the school's examinations and portal pages. Term dates themselves are not supplied (see /events/).
- **School day timings and a first-week routine**: not supplied; the page has none. It links to /school-life/school-day/.
- **"Before the first day" checklist**: every line restates something above; it is our summary, not a school document.
- **Photograph `media/life-7` ("Annual Sports Day, the field, January 2026")** and **`img/admissions-terrace` ("The terrace garden, 2024")**: the school's own files; the year is the upload year. Confirm public use. The Sports Day frame shows spectators in the foreground, seen from behind or in profile; its alt text was corrected in review (the buildings beyond the wall are apartment blocks, not the school).

## For the coordinator (not the school)

- `docs/image-catalogue.md` lists `media/ascent-3` and `media/menu-3` (children reading at library tables) as "backs of heads", but at least two faces are clearly identifiable (a smiling boy at the left, a girl with glasses at the right). No admissions page uses them. The home does (the menu preview for Learning): the row should say `faces`.
