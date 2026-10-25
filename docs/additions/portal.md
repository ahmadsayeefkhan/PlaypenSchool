# Additions: website portal (visit code, connected forms, question helper)

Added 2026-10-23 for the School Desk's new Website section (spec: `playpen-school-sample-work/portal/spec.md`,
section 8). Script `build/additions/portal.js`, styles `build/additions/portal.css`, both joined into
`site/js|css/pages-additions.*` like every group, **and** written alone as `site/js/portal.js` and
`site/css/portal.css` by `build.py` (`STANDALONE_ADDITIONS`), because the hand-built home loads no additions;
`sync_home.py` links them in the home's `seo` region. The script is vanilla (no `PP.*`), runs once
(`if (window.PPPortal) return;`) and never sends anything to another company.

## Where the Desk is

`build/nav.json` `site.portal` = `{ "api": "http://localhost:4104", "chat": true, "privacy": "/privacy/" }`.
`shell.py` `portal_meta()` writes `<meta name="pp:portal-api">` and `<meta name="pp:portal-chat" content="on|off">`
into every inner page and the home. Remove `api` and the whole portal switches off: no code, no chat, every form
behaves as the prototype it was. At go-live the meta points at the hosted app.

For local QA only: `?portal-api=http://localhost:4105` (localhost or 127.0.0.1 only; kept for the tab in
`sessionStorage["pp:portal-api"]`), and `?portal=off` / `?portal=on` for the whole tab (captures).

## What it adds

| Piece | Markup | Behaviour |
|---|---|---|
| Visit code | footer `<p class="foot__visit" data-portal-visit hidden>` (shell.py, also on the home) | "Your visit code: V-7K3Q9M", "Don't count my visits" / "Count my visits again", "About visit codes". Under Do Not Track or Global Privacy Control: "Your browser asks sites not to count visits, so this site does not." Stays hidden with no API. |
| Counting | none | Page views (normalised path, title, outside referrer host, utm, device class, viewport bucket), time on page while visible, scroll depth, button presses (sticky actions, `.btn`, the three admissions pages, `tel:` links, `[data-portal-cta="label"]`), form started / left (field count only) / sent, chat opened, code copied. Batched, every 5 s or at 10 items, `sendBeacon` on hide. Off under DNT, GPC, opt-out or no API. After a failed count it waits 2 minutes before trying again (one failed request in the console, not one per page). |
| Notice | made by the script, bottom left | First page of the first visit only; steps aside when a form field gets focus or the helper opens; "Close" keeps it closed. Never modal. |
| Enquire, Book a visit | `form[data-prototype-form]`, new fields `#e-child` / `#v-child`, `#v-date`, `#v-part`, `input[name="consent"]` | A second submit listener: waits a tick for inner.js's checks, sends, shows "Sent. Your code is ENQ-/VIS-..." (`.pp-code`). Server field errors go to `#<id>-err`. Network, timeout, 5xx, 429: the old `.form-notice` plus "We could not send this online...". |
| Admission form | `[data-af-action="submit"]`, `.af__online` (consent and `#af-agree`), both `data-portal-only hidden` | admissions-form.js builds `{form, values, sections, consent, agree}` and calls `PPPortal.submit("application", ...)`. The code shows under the bar (`.af__sent`), is kept in `localStorage["pp:admission-form:code:<tab>"]` and is printed on the downloaded copy (`.afp__code`). "Clear form" forgets it. |
| Question helper | made by the script | Launcher bottom right (56 px, above the sticky actions), panel `role="dialog"` (non-modal; full-width sheet with a focus loop under 480 px), `role="log"` messages, chips, actions (site links, `tel:`, forms, "Talk to a person"), sources, a short enquiry form inside the panel that returns an ENQ code. Transcript in `sessionStorage["pp:chat"]` (50 messages). API down: the three admissions lines. |

`[data-portal-only]` elements are revealed by the script only when it has an API. `.pp-hp` is the honeypot
("Leave this empty", off screen, `tabindex=-1`, `aria-hidden`).

## window.PPPortal

`{ api, counting, visitorCode(), sessionId(), track(item), submit(kind, body), showCode(container, kind, code, opts?), setCounting(on), lines() }`.
`submit` adds `v`, `visitorCode`, `sessionId`, `page`, `elapsedMs`, `hp` and answers
`{ok:true, code}` / `{ok:false, error, fields?}`; it never throws. `showCode` opts: `classRaw` (picks the
admissions line from the footer's phone rows), `heading` (tag, default `h3`), `before`, `focus`.

## Rules of use

- Never type a phone number in the script: the lines come from the footer rows the shell writes from nav.json.
- Reply text is set with `textContent`, never `innerHTML`; action and source links must be site paths starting
  with `/` (anything else is dropped); `tel:` values must be digits.
- Storage keys: `pp_vid` (also a cookie, 13 months), `pp:optout`, `pp:notice`, `pp_sid` / `pp_sid_at`
  (session, 30 minutes), `pp:chat`, `pp:last-codes`, `pp:portal`, `pp:portal-api`, `pp:portal-down`. All listed on
  the privacy page except the last three (QA switches and the back-off note, no personal data).
- Every fetch is `credentials: "omit"`, `Content-Type: text/plain;charset=UTF-8` (no preflight).
