/* alumni-form: "Join the alumni community" on /community/alumni/ (2026-10-27). Sends one request from a former student
   (18 or older, has left the school) to the Website Operator app at <api>/api/portal/alumni, which answers with an ALU-
   code. The office checks the request against the school's records; accepted requests go on to the Community app
   (Playpen Alumni). The form is data-portal-only: portal.js reveals it only when the site has an API. The telephone
   panel below it stays in every case; this script only swaps its two lines ("off" / "on").
   Never joins visits: visitorCode and sessionId are always null and P.track is not called. Nothing is kept in the
   browser. Ids and classes use the alf prefix (af is the admission form's). Notes: docs/additions/alumni-form.md. */
PP.ready(function () {
var P0 = window.PPPortal;

// The phone panel: show the "on" line when the portal has an API. portal.js may run later in the joined bundle,
// so look again on the next tick.
function phoneLines() {
  var on = !!(window.PPPortal && window.PPPortal.api);
  var lines = document.querySelectorAll('[data-alumni-when]');
  for (var i = 0; i < lines.length; i++) {
    lines[i].hidden = lines[i].getAttribute('data-alumni-when') !== (on ? 'on' : 'off');
  }
}
if (document.querySelector('[data-alumni-when]')) { phoneLines(); setTimeout(phoneLines, 0); }

// "Already have a joining code?": the Playpen Alumni address comes from data-alumni-app (an http(s) origin only),
// shown only when the portal is on, like the form.
function appLink() {
  var on = !!(window.PPPortal && window.PPPortal.api);
  var box = document.querySelector('[data-alumni-app]');
  if (!box) return;
  var base = String(box.getAttribute('data-alumni-app') || '').replace(/\/+$/, '');
  var a = box.querySelector('[data-alumni-app-link]');
  if (!on || !a || !/^https?:\/\/[^\s\/]+$/.test(base)) { box.hidden = true; return; }
  a.href = base + '/join';
  box.hidden = false;
}
if (document.querySelector('[data-alumni-app]')) { appLink(); setTimeout(appLink, 0); }

var form = document.querySelector('[data-alumni-form]');
if (!form) return;

var TIMEOUT_MS = 20000, FIRST_YEAR = 1980;
var BD_MOBILE = /^(?:\+?8801|01)[3-9]\d{8}$/;
var INTL = /^\+[1-9]\d{7,14}$/;
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var ALU_RE = /^ALU-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{6}$/;
var CLASSES = ['Playgroup', 'Nursery', 'KG I', 'KG II', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI',
  'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII', 'Not sure'];
var loadedAt = Date.now(), sending = false;
var status = form.querySelector('.alf__status');
var btn = form.querySelector('button[type="submit"]');
var label = btn.querySelector('.btn__label');
var thisYear = new Date().getFullYear();

function $(id) { return document.getElementById(id); }
function val(id) { var n = $(id); return n ? String(n.value || '').trim() : ''; }
// Characters as a person counts them (an emoji is 1), the way both apps count them.
function len(s) { return Array.from ? Array.from(s).length : s.length; }
function ticked(id) { var n = $(id); return !!(n && n.checked); }
function setErr(id, msg) {
  var n = $(id), e = $(id + '-err');
  if (e) e.textContent = msg || '';
  if (n) { if (msg) n.setAttribute('aria-invalid', 'true'); else n.removeAttribute('aria-invalid'); }
}

// Years, from this year down to 1980.
var yearSel = $('alf-year');
if (yearSel && yearSel.options.length <= 1) {
  for (var y = thisYear; y >= FIRST_YEAR; y--) {
    var o = document.createElement('option'); o.value = String(y); o.textContent = String(y); yearSel.appendChild(o);
  }
}

var FIELDS = ['alf-name', 'alf-former', 'alf-year', 'alf-class', 'alf-email', 'alf-phone', 'alf-now', 'alf-city', 'alf-note',
  'alf-adult', 'alf-left', 'alf-consent'];
var SERVER_FIELD = { fullName: 'alf-name', formerName: 'alf-former', yearLeft: 'alf-year', classLeft: 'alf-class', email: 'alf-email',
  phone: 'alf-phone', nowDoing: 'alf-now', city: 'alf-city', note: 'alf-note', adult: 'alf-adult', leftSchool: 'alf-left',
  consent: 'alf-consent' };

function phoneOk(raw) {
  var p = String(raw || '').replace(/[\s\-().]/g, '');
  return p === '' || BD_MOBILE.test(p) || INTL.test(p);
}

// The same rules and messages as the operator's checkAlumni (spec section 1.2).
function check() {
  var bad = [];
  function need(id, ok, msg) { setErr(id, ok ? '' : msg); if (!ok) bad.push(id); }
  var name = val('alf-name'), year = Number(val('alf-year')), email = val('alf-email');
  need('alf-name', len(name) >= 2 && len(name) <= 80, 'Enter your full name.');
  need('alf-former', val('alf-former').length <= 80, 'Keep this under 80 characters.');
  need('alf-year', /^\d{4}$/.test(val('alf-year')) && year >= FIRST_YEAR && year <= thisYear, 'Choose the year you left the school.');
  need('alf-class', CLASSES.indexOf(val('alf-class')) !== -1, 'Choose the class you were in when you left.');
  need('alf-email', EMAIL.test(email) && email.length <= 120, 'Enter your email address, for example name@example.com.');
  need('alf-phone', phoneOk(val('alf-phone')), 'Enter a mobile number, for example 017XX XXX XXX, or a number with its country code, or leave it empty.');
  need('alf-now', val('alf-now').length <= 120, 'Keep this under 120 characters.');
  need('alf-city', val('alf-city').length <= 60, 'Keep this under 60 characters.');
  need('alf-note', val('alf-note').length <= 1000, 'Keep the message under 1,000 characters.');
  need('alf-adult', ticked('alf-adult'), 'Tick this box to confirm you are 18 or older. The alumni community is for adults only.');
  need('alf-left', ticked('alf-left'), 'Tick this box to confirm you were a student at Playpen and have left the school.');
  need('alf-consent', ticked('alf-consent'), 'Tick this box so the school office can keep your details and check your request.');
  return bad;
}

function busy(on) {
  sending = on;
  btn.disabled = on;
  label.textContent = on ? 'Sending…' : 'Send my details';
}

function say(text, fail) {
  status.textContent = text;
  status.classList.toggle('alf__status--fail', !!fail);
}

// code = the ALU- reference, or null when the server said "sent" without one (then no code is shown).
function done(code) {
  var box = document.createElement('div');
  box.className = 'pp-code alf__done';
  box.setAttribute('role', 'region');
  box.setAttribute('aria-labelledby', 'alf-done-h');
  var h = document.createElement('h3'); h.className = 'pp-code__h'; h.id = 'alf-done-h'; h.tabIndex = -1; h.textContent = code ? 'Sent. Your reference code is' : 'Sent. The school office has your request.';
  var c = null;
  if (code) { c = document.createElement('p'); c.className = 'pp-code__code'; c.setAttribute('translate', 'no'); c.textContent = code; }
  var k = document.createElement('p'); k.className = 'pp-code__keep';
  k.textContent = code
    ? 'Keep this code. The school office checks your details against its records. If your request is accepted, the office contacts you by email or phone with a joining code for Playpen Alumni. If you have not heard from the office, call 01755 515 885 and give this code.'
    : 'The school office checks your details against its records. If your request is accepted, the office contacts you by email or phone and gives you a joining code for Playpen Alumni. If you have not heard from the office, call 01755 515 885.';
  var again = document.createElement('button'); again.type = 'button'; again.className = 'pp-code__again link'; again.textContent = 'Send another request';
  again.addEventListener('click', function () {
    box.parentNode.removeChild(box); form.hidden = false; form.reset(); say('');
    FIELDS.forEach(function (id) { setErr(id, ''); });
    loadedAt = Date.now();
    $('alf-name').focus();
  });
  box.appendChild(h); if (c) box.appendChild(c); box.appendChild(k); box.appendChild(again);
  form.hidden = true;
  form.parentNode.insertBefore(box, form.nextSibling);
  h.focus();
}

FIELDS.forEach(function (id) {
  var n = $(id);
  if (n) n.addEventListener('change', function () { if (n.getAttribute('aria-invalid')) setErr(id, ''); });
});

form.addEventListener('submit', function (ev) {
  ev.preventDefault();
  if (sending) return;
  say('');
  var bad = check();
  if (bad.length) { say('Check the ' + (bad.length === 1 ? 'field' : bad.length + ' fields') + ' marked above.', true); $(bad[0]).focus(); return; }
  var P = window.PPPortal || P0;
  if (!P || !P.api || !window.fetch) { say('We could not send this online. Please call the school’s general line below.', true); return; }
  busy(true);
  var body = {
    v: 1, visitorCode: null, sessionId: null,
    page: location.pathname, elapsedMs: Date.now() - loadedAt, hp: val('alf-hp'),
    fullName: val('alf-name'), formerName: val('alf-former'), yearLeft: Number(val('alf-year')), classLeft: val('alf-class'),
    email: val('alf-email'), phone: val('alf-phone'), nowDoing: val('alf-now'), city: val('alf-city'), note: val('alf-note'),
    adult: true, leftSchool: true, consent: true
  };
  var ctl = window.AbortController ? new AbortController() : null;
  var timer = ctl ? setTimeout(function () { ctl.abort(); }, TIMEOUT_MS) : null;
  fetch(P.api + '/api/portal/alumni', {
    method: 'POST', body: JSON.stringify(body), credentials: 'omit', mode: 'cors', cache: 'no-store',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, signal: ctl ? ctl.signal : undefined
  }).then(function (res) {
    if (timer) clearTimeout(timer);
    return res.json().catch(function () { return null; }).then(function (d) { return { status: res.status, d: d }; });
  }).then(function (r) {
    busy(false);
    var d = r.d || {};
    if (r.status === 201 && d.ok && ALU_RE.test(d.code || '')) { done(d.code); return; }
    if (r.status === 201 && d.ok) { done(null); return; }
    if (r.status === 400 && d.fields) {
      var first = null;
      Object.keys(d.fields).forEach(function (k) { var id = SERVER_FIELD[k]; if (id) { setErr(id, d.fields[k]); first = first || id; } });
      say('Check the fields marked above.', true);
      if (first) $(first).focus();
      return;
    }
    if (r.status === 429) { say('Too many tries in a short time. Please wait a few minutes and send again.', true); return; }
    say('We could not send this online. Please try again in a few minutes, or call the school’s general line below.', true);
  }).catch(function () {
    if (timer) clearTimeout(timer);
    busy(false);
    say('We could not send this online. Please try again in a few minutes, or call the school’s general line below.', true);
  });
});
});
