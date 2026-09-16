# Information Architecture

**Playpen School website redesign · 2026**

---

## The problem with the old structure

The current site has **48 pages across 5 navigation groups**, many of them a single paragraph long. "Multimedia Projector" is a page. So is "The Identity Card". Meanwhile the four school stages — the thing a parent most needs to understand — are split across four separate pages with no overview, and the Senior School page carries the O Level and A Level subject lists that should be the most-visited content on the site.

The redesign consolidates 48 pages into **14**, without losing a single fact.

---

## New sitemap

```
HOME  (index.html)

ABOUT
├── Our Story · Mission, Vision & Values      about.html  (+ #values)
├── Leadership & Administration               leadership.html
├── Our Campus                                campus.html
├── Alumni Association                        alumni.html
└── Careers at Playpen                        careers.html

ACADEMICS                                     academics.html
├── Academic overview                         #top
├── Elementary School  · PG–KG II             #elementary
├── Junior School      · I–III                #junior
├── Middle School      · IV–VII               #middle
├── Senior School      · VIII–XII             #senior
├── O Level & A Level subjects                #subjects
├── Assessment & Examinations                 #examinations
├── Library & Laboratories                    #facilities
└── Student Support & Counselling             #support

ADMISSIONS                                    admissions.html
├── Overview & current intake                 #top
├── Entry points                              #entry
├── The admission process                     #process
├── Required documents                        #documents
├── Download forms                            #forms
├── School uniform                            #uniform
└── Admissions FAQ                            #faq

STUDENT LIFE                                  student-life.html
├── Overview                                  #top
├── Sports & Games                            #sports
├── Arts, Music & Drama                       #arts
├── Clubs & Competitions                      #clubs
├── Science & Technology                      #science
├── Community Service                         #service
├── Events & Celebrations                     #events
└── Achievements                              achievements.html

CAMPUS & SERVICES                             campus-services.html
├── Health Centre                             #health
├── School Transport                          #transport
├── Bookshop                                  #bookshop
├── Online Services & Payment                 #online
├── Child Protection & Safety                 #safeguarding
└── Policies & Code of Conduct                #policies

NEWS & EVENTS                                 news.html
├── Notices                                   #notices
├── Upcoming Events                           #events
└── Gallery                                   #gallery

FOR PARENTS                                   parents.html
├── Quick links                               #top
├── Academic calendar                         #calendar
└── Downloads & forms                         #downloads

CONTACT                                       contact.html
```

**Utility (persistent, top bar):** Parent & Student Portal · Pay Fees · Careers · Alumni
**Header actions:** Visit Us · **Apply Now**

---

## Why consolidation rather than more pages

A hub page with deep-linked sections beats twelve thin pages for three reasons:

1. **Parents read in one pass.** Somebody researching "which school" wants to read the academic story top to bottom, not click twelve times.
2. **SEO concentrates.** One strong `/academics/` page outranks twelve 90-word pages competing with each other.
3. **The school can actually maintain it.** Twelve pages means twelve places for the subject list to go stale. One means one.

Every deep link still works as a distinct destination, so nothing is lost in navigation or in a Google result.

---

## Content mapping — every old page accounted for

| Old page | New location | Treatment |
|---|---|---|
| Home | `index.html` | Rewritten; hero, stages, why, campus, senior, student life, achievements, notices, alumni, visit |
| About | `about.html` | Merged with History |
| Our History | `about.html` | Became a two-column timeline |
| Mission, Vision and Values | `about.html#values` | Split into vision / mission / conviction blocks + four institutional goals |
| School Administration | `leadership.html` | Card layout, ready for headshots and bios |
| Our Campus (new-campus) | `campus.html` | Facilities list became a 20-cell grid; grade structure became a table |
| Child Protection Policy | `campus-services.html#safeguarding` | Expanded into six safeguarding themes + how to raise a concern |
| Playpen Alumni Association | `alumni.html` | Added a registration form and a stated purpose |
| Career at Playpen | `careers.html` | Became a four-step application process |
| Contact Us | `contact.html` | Department table, enquiry form, map, directions |
| Elementary School | `academics.html#elementary` | Kept, restructured |
| Junior School | `academics.html#junior` | Kept, restructured |
| Middle School | `academics.html#middle` | Kept, restructured |
| Senior School | `academics.html#senior` + `#subjects` | Subject lists promoted to 21 individual subject cards |
| Library | `academics.html#facilities` | Merged with Laboratories |
| Laboratories | `academics.html#facilities` | Merged with Library |
| Student Support | `academics.html#support` | Merged with Counsellor |
| Counsellor | `academics.html#support` | Merged with Student Support |
| Examinations | `academics.html#examinations` | Expanded with portal reporting |
| Achievements of Playpen Students | `achievements.html` | Became a filterable archive with categories |
| Disciplinary Committee | `campus-services.html#policies` | Merged into Code of Conduct accordion |
| The Identity Card | `campus-services.html#policies` + `#safeguarding` | Merged; was a one-paragraph page |
| Admission Procedure | `admissions.html` | Became a 5-step flow + entry-point table |
| The School Uniform | `admissions.html#uniform` | Kept, with supplier contacts |
| Code of Conduct | `campus-services.html#policies` | Became a 8-item accordion |
| Annual Sports | `student-life.html#sports` | Merged with sports gallery |
| Extra Curricular Activities | `student-life.html` | Became the page overview |
| Community Service | `student-life.html#service` | Kept with image row |
| Cultural Programme | `student-life.html#arts` + `#events` | Split: programmes vs calendar |
| Science Fair | `student-life.html#science` | Merged with Multimedia Projector |
| Online Facility & Payment | `campus-services.html#online` | Kept; payment channels listed |
| Workshop for Students | `student-life.html` (workshops block) | Kept |
| Multimedia Projector | `student-life.html#science` | Merged; was a one-paragraph page |
| Health Center | `campus-services.html#health` | Kept |
| The School Bookshop | `campus-services.html#bookshop` | Kept |
| School Transportation | `campus-services.html#transport` | Kept, with bus rules |
| Notices | `news.html#notices` | Kept; CMS-ready structure noted |
| Events | `news.html#events` | Kept; annual calendar added |
| Photo Gallery | `news.html#gallery` | Became a filterable grid |
| Feature: Academic / ECA / Student Services / Achievements / Alumni / Faculty | Distributed | These were duplicate index pages; content folded into the hubs |
| Parents'/Students' Portal | External link + `parents.html` | New hub page wraps the external portal |

**Nothing was dropped.** Two pages that were a single sentence ("Multimedia Projector", "The Identity Card") were folded into the sections they belong to.

---

## What is new

| Addition | Why |
|---|---|
| **For Parents hub** (`parents.html`) | Current parents were navigating a prospectus. They now have one destination. |
| **Entry-point table** | Answers "which class, what test, which form" in one glance. |
| **Admissions FAQ** (11 questions) | Reduces phone calls to the Admissions Office. |
| **Filterable achievements archive** | The old page was a wall of text. |
| **Filterable gallery** | The old gallery returned "gallery was not found" in part of its output. |
| **Subject cards** (21) | O Level and A Level subject lists are the highest-intent content on a school site. |
| **Enquiry forms** (3) | The old site had no way to make contact without picking up a phone. |
| **Academic calendar overview** | Semester structure explained without needing portal access. |
| **Structured data** (`School` schema) | None existed. |
| **sitemap.xml / robots.txt** | None existed. |

---

## Navigation rules

- **Six top-level items maximum.** Any more and the dropdown becomes a directory.
- **Every dropdown item has a one-line description.** Parents should not have to guess what "Student Support" means.
- **`Apply Now` is always visible**, on desktop and in the mobile drawer.
- **The portal link is always visible** in the utility bar — current parents outnumber prospective ones daily.
- **Mobile uses accordions**, never a nested drawer. One tap to open a group, one tap to go.
