# careers-form: apply online from the careers page (2026-10-23)

**Where:** `/about/careers/#apply-online`. **Files:** `build/additions/careers-form.js` and `.css`; markup in
`build/pages/about/careers.html` (`[data-careers-form]`, section `#apply-online`, `data-portal-only hidden`).

**What it does**
- Fields: full name, mobile (Bangladesh), email, position (Teacher / Teaching assistant / Office and administration /
  Other), classes (optional), subject or role, highest qualification, years of experience, current workplace
  (optional), CV (PDF, 5 MB), passport photo (JPEG or PNG, 2 MB), short note (optional), a consent tick, honeypot.
- Checks every field in the browser, then sends one JSON body (files as base64, `text/plain`, no preflight) to
  `<portal api>/api/portal/job` on the Website Operator app (port 4120). The answer is a code `JOB-XXXXXX`, shown in
  the `.pp-code` box. Server field errors show under each field.
- The section shows only when the portal is on (portal.js reveals `[data-portal-only]`). With the portal off, the page
  keeps the old "send a CV by email" steps, which stay below the form in every case.
- Nothing is kept in the browser.

**Office side:** Website Operator app, menu **Job applications** (`/jobs`): tabs New, Being reviewed, Shortlisted,
Interview, Decided, All; search; one page per candidate with the photo, details, Open/Download the CV, stage buttons
(Start reviewing, Shortlist, Set the interview with date and time, Offered, Not selected, Withdrew), an office note,
history, and Remove (deletes the files too). Code: `lib/jobs.ts`, migration 3 in `lib/db.ts`, routes
`app/api/portal/job`, `app/api/op/jobs/[code]` and `[code]/file`. Files live in `.data/jobs/` and are served only to a
signed-in office.

**To confirm with the school:** the position list, whether a photo is required, how long applications are kept, and
the careers email address for the fallback steps.

To rebuild the page: `python build/build.py --only about/careers`.
