# Redirect map

**The Playpen School: old URLs to new URLs.** Rewritten 2026-10-11 for the finished 43-page site. Everything here is generated from `build/nav.json` (`wordpress` and `redirects`) by `python build/build.py`, which writes `vercel.json` and the meta-refresh stubs. Edit `nav.json`, never `vercel.json`.

The old WordPress site (playpen.edu.bd) has been indexed since 2020, so each old address answers with a **301 permanent redirect** to the page that replaces it. Skipping this loses the school's search ranking overnight.

## What exists today

| Layer | What it does | Where it is written |
|---|---|---|
| `vercel.json` `redirects` | 301 for each old WordPress path (with and without the trailing slash, plus `/notice/*` and `/event/*`): 90 rules for 44 old paths | `build/build.py`, from `nav.json` `wordpress` |
| `vercel.json` `trailingSlash: true` | every page lives at `/<slug>/`; `/about` is sent to `/about/` | `build/build.py` |
| `site/<name>.html` stubs | the 13 flat pages of the previous site (`about.html`, `academics.html` ...) are meta-refresh pages to the new URL; a script in each reads an old `#anchor` and picks a better target | `build/build.py`, from `nav.json` `redirects` |
| `site/404.html` | the page-not-found page, written with absolute URLs so it works at any depth | `build/build.py` |

Checked on 2026-10-11: every destination is a page of the site, no rule points at another redirect, no rule points at itself and no redirect source is also a page (no loops, no chains).

## Old WordPress paths (playpen.edu.bd)

| Old path | New page | Title |
|---|---|---|
| `/our-history/` | `/about/history/` | History |
| `/mission-vision-and-values/` | `/about/` | About |
| `/school-administration/` | `/about/leadership/` | Leadership |
| `/new-campus/` | `/about/campus/` | Campus |
| `/child-protection-policy/` | `/about/child-protection/` | Child protection |
| `/playpen-alumni-association/` | `/community/alumni/` | Alumni |
| `/career-at-playpen/` | `/about/careers/` | Careers |
| `/current-vacancy/` | `/about/careers/` | Careers |
| `/contact-us/` | `/contact/` | Contact |
| `/elementary-school/` | `/learning/elementary/` | Elementary |
| `/junior-school/` | `/learning/junior/` | Junior |
| `/middle-school/` | `/learning/middle/` | Middle |
| `/senior-school/` | `/learning/senior/` | Senior |
| `/library/` | `/about/campus/` | Campus |
| `/laboratories/` | `/about/campus/` | Campus |
| `/student-support/` | `/learning/student-support/` | Student support |
| `/counsellor/` | `/learning/student-support/` | Student support |
| `/examinations/` | `/learning/examinations/` | Examinations |
| `/achievements-of-playpen-students/` | `/learning/results/` | Results |
| `/disciplinary-committee/` | `/about/policies/` | Policies |
| `/the-identity-card/` | `/about/policies/` | Policies |
| `/admission-procedure/` | `/admissions/how-to-apply/` | How to apply |
| `/the-school-uniform/` | `/admissions/starting-at-playpen/` | Starting at Playpen |
| `/code-of-conduct/` | `/about/policies/` | Policies |
| `/annual-sports/` | `/school-life/sports/` | Sports |
| `/extra-curricular-activities/` | `/school-life/clubs-and-activities/` | Clubs and activities |
| `/community-service/` | `/school-life/culture-and-service/` | Culture and service |
| `/cultural-programme/` | `/school-life/culture-and-service/` | Culture and service |
| `/science-fair/` | `/school-life/clubs-and-activities/` | Clubs and activities |
| `/workshop-for-students/` | `/school-life/clubs-and-activities/` | Clubs and activities |
| `/multimedia-projector/` | `/school-life/clubs-and-activities/` | Clubs and activities |
| `/online-facility-payment/` | `/admissions/fees/` | Fees and payment |
| `/health-center/` | `/school-life/transport-and-safety/` | Transport and safety |
| `/the-school-bookshop/` | `/admissions/starting-at-playpen/` | Starting at Playpen |
| `/school-transportation/` | `/school-life/transport-and-safety/` | Transport and safety |
| `/notice/` | `/notices/` | Notices |
| `/event/` | `/events/` | Events |
| `/photo-gallery/` | `/gallery/` | Gallery |
| `/feature/academic/` | `/learning/` | Learning |
| `/feature/alumni/` | `/community/alumni/` | Alumni |
| `/feature/achievements/` | `/learning/results/` | Results |
| `/feature/eca/` | `/school-life/` | School life |
| `/feature/student-services/` | `/school-life/transport-and-safety/` | Transport and safety |
| `/feature/faculty-members/` | `/about/leadership/` | Leadership |
| `/notice/<anything>` | `/notices/` | Notices |
| `/event/<anything>` | `/events/` | Events |

Not redirected on purpose: `/wp-content/uploads/...` (the admission-form PDFs and photographs, linked from printed material and from this site), `portal.playpen.edu.bd` and the online payment page. See "Links that stay on the old site" below.

## Flat pages of the previous site (`site/*.html`)

| Old file | Goes to | Old `#anchor` to better target |
|---|---|---|
| `/about.html` | `/about/` | `#values` to `/about/` |
| `/academics.html` | `/learning/` | `#elementary` to `/learning/elementary/`; `#junior` to `/learning/junior/`; `#middle` to `/learning/middle/`; `#senior` to `/learning/senior/`; `#subjects` to `/learning/senior/`; `#examinations` to `/learning/examinations/`; `#facilities` to `/about/campus/`; `#support` to `/learning/student-support/` |
| `/achievements.html` | `/learning/results/` | none |
| `/admissions.html` | `/admissions/` | `#entry` to `/admissions/how-to-apply/`; `#process` to `/admissions/how-to-apply/`; `#documents` to `/admissions/how-to-apply/`; `#forms` to `/admissions/how-to-apply/`; `#uniform` to `/admissions/starting-at-playpen/`; `#faq` to `/admissions/faq/` |
| `/alumni.html` | `/community/alumni/` | none |
| `/campus.html` | `/about/campus/` | none |
| `/campus-services.html` | `/school-life/transport-and-safety/` | `#safeguarding` to `/about/child-protection/`; `#policies` to `/about/policies/`; `#transport` to `/school-life/transport-and-safety/`; `#health` to `/school-life/transport-and-safety/`; `#bookshop` to `/admissions/starting-at-playpen/`; `#online` to `/admissions/fees/` |
| `/careers.html` | `/about/careers/` | none |
| `/contact.html` | `/contact/` | none |
| `/leadership.html` | `/about/leadership/` | none |
| `/news.html` | `/news/` | `#notices` to `/notices/`; `#events` to `/events/`; `#gallery` to `/gallery/` |
| `/parents.html` | `/community/parents/` | `#calendar` to `/events/` |
| `/student-life.html` | `/school-life/` | `#sports` to `/school-life/sports/`; `#arts` to `/school-life/clubs-and-activities/`; `#clubs` to `/school-life/clubs-and-activities/`; `#science` to `/school-life/clubs-and-activities/`; `#service` to `/school-life/culture-and-service/`; `#events` to `/events/` |

## Links that stay on the old site

The school's own resources have no home on this site yet, so a few links stay on `playpen.edu.bd` (each opens in a new tab, says "current site" and is on the `external_ok` list in `nav.json`):

- `https://portal.playpen.edu.bd/`
- `https://playpen.edu.bd/online-facility-payment/`
- `https://playpen.edu.bd/admission-procedure/`
- `https://playpen.edu.bd/mission-vision-and-values/`
- `https://playpen.edu.bd/wp-content/uploads/`
- `https://playpen.edu.bd/`

**Before the domain moves:** if `playpen.edu.bd` is ever pointed at this project, the rules above would catch `/online-facility-payment/` and `/admission-procedure/` and send visitors to this site's pages, and the `/wp-content/uploads/` forms would stop resolving. Do not switch DNS until the portal, the online payment, the admission-form PDFs and the mission statement have a new address, and the `external_ok` links have been changed to it.

## If the site is hosted somewhere other than Vercel

The same table as server rules. Destinations are the page folders (`/about/history/` is `site/about/history/index.html`).

```nginx
location = /our-history/ { return 301 /about/history/; }
location = /mission-vision-and-values/ { return 301 /about/; }
location = /school-administration/ { return 301 /about/leadership/; }
location = /new-campus/ { return 301 /about/campus/; }
location = /child-protection-policy/ { return 301 /about/child-protection/; }
location = /playpen-alumni-association/ { return 301 /community/alumni/; }
location = /career-at-playpen/ { return 301 /about/careers/; }
location = /current-vacancy/ { return 301 /about/careers/; }
location = /contact-us/ { return 301 /contact/; }
location = /elementary-school/ { return 301 /learning/elementary/; }
location = /junior-school/ { return 301 /learning/junior/; }
location = /middle-school/ { return 301 /learning/middle/; }
location = /senior-school/ { return 301 /learning/senior/; }
location = /library/ { return 301 /about/campus/; }
location = /laboratories/ { return 301 /about/campus/; }
location = /student-support/ { return 301 /learning/student-support/; }
location = /counsellor/ { return 301 /learning/student-support/; }
location = /examinations/ { return 301 /learning/examinations/; }
location = /achievements-of-playpen-students/ { return 301 /learning/results/; }
location = /disciplinary-committee/ { return 301 /about/policies/; }
location = /the-identity-card/ { return 301 /about/policies/; }
location = /admission-procedure/ { return 301 /admissions/how-to-apply/; }
location = /the-school-uniform/ { return 301 /admissions/starting-at-playpen/; }
location = /code-of-conduct/ { return 301 /about/policies/; }
location = /annual-sports/ { return 301 /school-life/sports/; }
location = /extra-curricular-activities/ { return 301 /school-life/clubs-and-activities/; }
location = /community-service/ { return 301 /school-life/culture-and-service/; }
location = /cultural-programme/ { return 301 /school-life/culture-and-service/; }
location = /science-fair/ { return 301 /school-life/clubs-and-activities/; }
location = /workshop-for-students/ { return 301 /school-life/clubs-and-activities/; }
location = /multimedia-projector/ { return 301 /school-life/clubs-and-activities/; }
location = /online-facility-payment/ { return 301 /admissions/fees/; }
location = /health-center/ { return 301 /school-life/transport-and-safety/; }
location = /the-school-bookshop/ { return 301 /admissions/starting-at-playpen/; }
location = /school-transportation/ { return 301 /school-life/transport-and-safety/; }
location = /notice/ { return 301 /notices/; }
location = /event/ { return 301 /events/; }
location = /photo-gallery/ { return 301 /gallery/; }
location = /feature/academic/ { return 301 /learning/; }
location = /feature/alumni/ { return 301 /community/alumni/; }
location = /feature/achievements/ { return 301 /learning/results/; }
location = /feature/eca/ { return 301 /school-life/; }
location = /feature/student-services/ { return 301 /school-life/transport-and-safety/; }
location = /feature/faculty-members/ { return 301 /about/leadership/; }
location ^~ /notice/ { return 301 /notices/; }
location ^~ /event/  { return 301 /events/; }
```

```apache
RewriteEngine On
RewriteRule ^our-history/?$ /about/history/ [R=301,L]
RewriteRule ^mission-vision-and-values/?$ /about/ [R=301,L]
RewriteRule ^school-administration/?$ /about/leadership/ [R=301,L]
RewriteRule ^new-campus/?$ /about/campus/ [R=301,L]
RewriteRule ^child-protection-policy/?$ /about/child-protection/ [R=301,L]
RewriteRule ^playpen-alumni-association/?$ /community/alumni/ [R=301,L]
RewriteRule ^career-at-playpen/?$ /about/careers/ [R=301,L]
RewriteRule ^current-vacancy/?$ /about/careers/ [R=301,L]
RewriteRule ^contact-us/?$ /contact/ [R=301,L]
RewriteRule ^elementary-school/?$ /learning/elementary/ [R=301,L]
RewriteRule ^junior-school/?$ /learning/junior/ [R=301,L]
RewriteRule ^middle-school/?$ /learning/middle/ [R=301,L]
RewriteRule ^senior-school/?$ /learning/senior/ [R=301,L]
RewriteRule ^library/?$ /about/campus/ [R=301,L]
RewriteRule ^laboratories/?$ /about/campus/ [R=301,L]
RewriteRule ^student-support/?$ /learning/student-support/ [R=301,L]
RewriteRule ^counsellor/?$ /learning/student-support/ [R=301,L]
RewriteRule ^examinations/?$ /learning/examinations/ [R=301,L]
RewriteRule ^achievements-of-playpen-students/?$ /learning/results/ [R=301,L]
RewriteRule ^disciplinary-committee/?$ /about/policies/ [R=301,L]
RewriteRule ^the-identity-card/?$ /about/policies/ [R=301,L]
RewriteRule ^admission-procedure/?$ /admissions/how-to-apply/ [R=301,L]
RewriteRule ^the-school-uniform/?$ /admissions/starting-at-playpen/ [R=301,L]
RewriteRule ^code-of-conduct/?$ /about/policies/ [R=301,L]
RewriteRule ^annual-sports/?$ /school-life/sports/ [R=301,L]
RewriteRule ^extra-curricular-activities/?$ /school-life/clubs-and-activities/ [R=301,L]
RewriteRule ^community-service/?$ /school-life/culture-and-service/ [R=301,L]
RewriteRule ^cultural-programme/?$ /school-life/culture-and-service/ [R=301,L]
RewriteRule ^science-fair/?$ /school-life/clubs-and-activities/ [R=301,L]
RewriteRule ^workshop-for-students/?$ /school-life/clubs-and-activities/ [R=301,L]
RewriteRule ^multimedia-projector/?$ /school-life/clubs-and-activities/ [R=301,L]
RewriteRule ^online-facility-payment/?$ /admissions/fees/ [R=301,L]
RewriteRule ^health-center/?$ /school-life/transport-and-safety/ [R=301,L]
RewriteRule ^the-school-bookshop/?$ /admissions/starting-at-playpen/ [R=301,L]
RewriteRule ^school-transportation/?$ /school-life/transport-and-safety/ [R=301,L]
RewriteRule ^notice/?$ /notices/ [R=301,L]
RewriteRule ^event/?$ /events/ [R=301,L]
RewriteRule ^photo-gallery/?$ /gallery/ [R=301,L]
RewriteRule ^feature/academic/?$ /learning/ [R=301,L]
RewriteRule ^feature/alumni/?$ /community/alumni/ [R=301,L]
RewriteRule ^feature/achievements/?$ /learning/results/ [R=301,L]
RewriteRule ^feature/eca/?$ /school-life/ [R=301,L]
RewriteRule ^feature/student-services/?$ /school-life/transport-and-safety/ [R=301,L]
RewriteRule ^feature/faculty-members/?$ /about/leadership/ [R=301,L]
RewriteRule ^notice/(.*)$ /notices/ [R=301,L]
RewriteRule ^event/(.*)$ /events/ [R=301,L]
```

## Post-launch checklist

1. Deploy the redirects **before** switching DNS or removing the old site.
2. Crawl the old sitemap and confirm every old URL returns 301 then 200 (Screaming Frog free tier covers 500 URLs). The 44 old paths above are the ones the school's WordPress site is known to have used.
3. Submit the new `sitemap.xml` (41 URLs: every page except `/404/` and `/search/`, which are `noindex`) in Google Search Console.
4. Use Search Console's **Change of Address** only if the domain changes.
5. Watch Search Console coverage for 404s weekly for the first month.
6. Keep `/wp-content/uploads/` reachable, or redirect each PDF individually: the admission forms are linked from printed material the school cannot recall.
