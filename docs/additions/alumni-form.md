# alumni-form: join the alumni community from the Alumni page (2026-10-27)

**Where:** `/community/alumni/#alu-form` (the Register sheet). **Files:** `build/additions/alumni-form.js` and `.css`;
markup in `build/pages/community/alumni.html` (`#alumni-online`, `data-portal-only hidden`, `form.alf[data-alumni-form]`).
Spec: `04-Projects/playpen-school-sample-work/community/spec.md`, sections 1.2 and 2.

Ids and classes use the prefix `alf` (`alf-name`, `.alf__ticks` ...). The spec wrote `af`, but `.af` and `af-*` already
belong to the admission form (`admissions-form.css`, global in pages-additions.css), so `af` would have pulled in that
card's styles.

**What it does**
- The founder's rule: alumni can only apply here. The Website Operator (port 4120, menu "Alumni requests") gets every
  request first; the office checks it against the school's records and, on Accept, hands it to the Community Desk (Playpen Alumni)
  (port 4130, Playpen Alumni), where the office makes a joining code and gives it to the person by hand.
- Fields, in order: full name; name at school, if different (optional); year you left (select, this year down to 1980,
  filled by the script); class you were in when you left (Playgroup ... Class XII, Not sure); email; mobile (optional,
  Bangladeshi or `+` country code); what you do now (optional); city (optional); a message for the office (optional,
  hint "Please do not write about current pupils or your own children."); honeypot `alf-hp`; three ticks under
  "Before you send": 18 or older, was a student and has left, consent (links to Privacy `#c-forms`). No photograph, no
  files, no date of birth, nothing about current children.
- Checks every field in the browser with the same rules and messages as the operator's `checkAlumni`, then posts one
  `text/plain` JSON body (no preflight) to `<portal api>/api/portal/alumni` with its own `fetch` (not
  `PPPortal.submit`, which only knows the admissions kinds; `portal.js` is untouched). Timeout 20 s.
- `visitorCode` and `sessionId` are always `null`, and `P.track` is not called: an adult's request is never joined to
  visits. Nothing is kept in the browser.
- Answers: 201 with `ALU-XXXXXX` shows the `.pp-code.alf__done` box ("Sent. Your reference code is", keep text, "Send
  another request"); 201 with `code:null` (bot check) shows "Sent. The school office has your request." with no code (review fix 2026-10-27); 400 puts each server message under its field
  (`fullName→alf-name, formerName→alf-former, yearLeft→alf-year, classLeft→alf-class, email→alf-email, phone→alf-phone,
  nowDoing→alf-now, city→alf-city, note→alf-note, adult→alf-adult, leftSchool→alf-left, consent→alf-consent`); 429
  "Too many tries ..."; anything else "We could not send this online ... or call the school's general line below."

**The contract** (spec 1.2)

```
POST <api>/api/portal/alumni   Content-Type: text/plain;charset=UTF-8   credentials: omit, mode: cors, cache: no-store
{"v":1,"visitorCode":null,"sessionId":null,"page":"/community/alumni/","elapsedMs":48210,"hp":"",
 "fullName":"…","formerName":"","yearLeft":2015,"classLeft":"Class X","email":"name@example.com","phone":"",
 "nowDoing":"","city":"","note":"","adult":true,"leftSchool":true,"consent":true}
201 {"ok":true,"code":"ALU-7K3Q9M","createdAt":"…"} | 201 {"ok":true,"code":null} | 400 {"ok":false,"error":"invalid","fields":{…}}
413 too_large | 429 rate_limited (+ Retry-After) | 403 origin_not_allowed
```

Rules: name 2 to 80; former name ≤ 80; year 1980 to this year; class from the list; email
`^[^\s@]+@[^\s@]+\.[^\s@]{2,}$` ≤ 120; phone empty, `^(?:\+?8801|01)[3-9]\d{8}$` or `^\+[1-9]\d{7,14}$` after removing
spaces and dashes; now ≤ 120; city ≤ 60; message ≤ 1000; the three ticks must be true.

**The telephone panel rule.** The gold panel "Questions about joining / By telephone" with `{{phone:further}}` stays
below the form in every case (unlike careers, where `about.js` hides the by-hand steps). It has two lines:
`[data-alumni-when="off"]` (call and the office takes your details) and `[data-alumni-when="on"]` (every request goes
through the form; the office can fill it in with you). `alumni-form.js` shows the "on" line when
`window.PPPortal.api` is set, checking again on the next tick in case `portal.js` runs later in the joined bundle. With
JavaScript off, the "off" line shows and the form stays hidden.

**How to test**
1. Portal on (default, `nav.json` `site.portal.api` = `http://localhost:4120`): open
   http://localhost:5180/community/alumni/. The form shows, the panel below says "Every request to join goes through
   the form…". Press Send empty: 7 messages ("Check the 7 fields marked above."). Fill it with an `@example.com` email,
   wait 2 seconds, send: with the Website Operator running you get `ALU-XXXXXX`; with it stopped, the "could not send"
   line.
2. Portal off: open http://localhost:5180/community/alumni/?portal=off (sessionStorage `pp:portal=off`; close the tab
   to undo). No form; the panel says "Call the school's general line…".

**To confirm with the school:** that it will check alumni requests against its records and run Playpen Alumni; whether
the further-queries line takes alumni questions and its hours; "batch" = year left or O Level year; the keep periods
(Privacy, "How long things are kept"). Privacy (`#c-forms`, codes, keep periods) and Terms (fact 4, clause 6) list
this form; change them together.

To rebuild: `python build/build.py --only community/alumni --only privacy --only terms` then `python build/check.py`.
