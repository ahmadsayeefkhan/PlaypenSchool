# To confirm with the school: Foundation (shell, home links, the three pilot pages)

One bullet each: page, claim, why uncertain. Other agents keep their own file in this folder.

## Site-wide

- **Every page, School JSON-LD (`foundingDate: 1977`) and the "Founded 1977" cells**: the school's history page says 1977 and also that the kindergarten began in 1997; the home states 1977. The year count ("48 years") is not printed anywhere.
- **Every page, School JSON-LD (`geo`, `telephone`)**: the coordinates (23.817814, 90.440179) come from the Google Maps embed in the old site; the further-queries number 01755 515 885 is used as the school's main telephone. Check both.
- **Footer and menu, "Email: see the contact page"**: the school's email address is hidden behind Cloudflare protection on its current site, so no address is published here. The school must supply one for the contact page.
- **Footer, no social links**: ownership of the Facebook page "PlaypenCenter" is not confirmed, so no social icons appear.
- **Home (`site/index.html`), sample content that is still in the file**: the third notice ("Parent-teacher meeting, Classes IV to VII: Thursday 22 October 2026"), the three events (18 November 2026, January 2027, 14 April 2027) and the one-line teasers of the three news cards were written as samples (`data-sample`, listed in `playpen-school-v1/docs/sample-copy.md`). The dates are invented. They must be replaced by the school's real calendar or removed before the site is announced.
- **`site/credits.html`, `site/audit-report.html`, `site/report-summary.html`**: Defined Solution's own pages (asset register, the audit and the case study of the previous site). They were left untouched, are not linked from the school's site and are disallowed in `robots.txt`. credits.html still says "Private presentation sample". Decide whether they stay in the school's published folder.
- **No accessibility statement page**: the plan lists one in the footer; it is not among the 43 pages.
- **Photographs on the home**: nine frames of the graded set show identifiable children and are for private presentation only (`docs/image-catalogue.md`): `media/ascent-2`, `learning-2`, `learning-3`, `learning-4`, `life-2`, `life-3`, `life-5`, `life-9` and `news-3`. The home still uses all nine. `python build/check.py` reports them as one warning on `index.html`, and `--strict` fails on it, so the decision cannot be forgotten: either the school consents in writing and the stems go into `docs/consent-cleared.txt`, or the frames are replaced before the site is announced. No inner page can use a flagged frame (the build refuses it); the pilot pages use none.
- **The home's sample notice** ("Parent-teacher meeting ... 9.00 am to 12.00 pm") carries hours that differ from the admissions hours (9.00 am to 1.00 pm). It is dated sample copy (`data-sample`); `check.py` warns about it so it is replaced with the school's real notice.

## /about/

- **"Founded 1977"** (fact strip): as above.
- **"The founding idea" callout and "The four goals"**: both restate, in plain words, the school's own mission statement ("to realise their full potential, children need a well-balanced programme in a creative learning environment"; four institutional goals). The wording is ours, the content is the school's; the school should approve it.
- **"A child who joins in Playgroup can stay until the end of school"**: follows from the home's "a child can go from Playgroup to Class XII without ever changing school".
- **Hero photograph `media/ascent-5`** ("The rooftop terrace, 2024"): the year is the one on the school's upload of the file (March 2024); confirm it, and that the photograph may appear on a public page.

## /learning/elementary/

- **Ages by class and class size**: not published by the school; left out on purpose (a comment in the source marks the place).
- **Daily timings and routine** (the plan's "a day at this stage"): not supplied; the section is not on the page.
- **Names, spellings and current posts**: Mrs Sharmin Hoque (Vice Principal, Playgroup to Class V), Mrs Farhana Rehan (Teacher-in-Charge, Playgroup to KG I), Mrs Farida Yasmin (Teacher-in-Charge, KG II to Class I), from the school's administration page (September 2026). No photographs or biographies supplied.
- **"The Principal and the parents meet for an interview"**: the verification checklist asks whether the Principal interviews at every entry point.
- **Hero photograph `img/elementary-hero`** (a wide crop of the Annual Sports Day 2026 frame, Playgroup to KG II, children seen from a distance): the school's own photograph; confirm it may appear on a public page, and that the caption "Annual Sports Day, January 2026" is right (taken from the school's own album title and the file's date).

## /admissions/faq/

- **A Level admission "July 2026 to June 2027 is open"**: a dated notice from the school's site; it will expire.
- **Fee amounts**: not published; the answer says so and gives the number to call.
- **Payment channels** (EBL, DBBL, Nagad, bKash, Rocket, Upay, Epay): as listed on the school's payment page; confirm each is still accepted.
- **Bus service "since March 2014" and "apply at the Administrative Office"**: from the school's transport page.
- **Acceptance of O Level and A Level by Bangladeshi universities**: the school has published nothing; the answer says so. The school should supply one.
- **Ages by class, class sizes, waiting lists, siblings, mid-year transfers**: no answers supplied; the closing callout sends families to the admissions line.
- **Mobile phones not allowed up to Class XII**: from the school's code of conduct; confirm it is current.
