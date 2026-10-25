/* careers-form: "Apply online" on /about/careers/ (2026-10-23). Sends one job application (details, a PDF CV and a
   photograph) to the Website Operator app at <api>/api/portal/job, which answers with a JOB- code. The section is
   data-portal-only: portal.js reveals it only when the site has an API, so with the portal off the page keeps the
   email steps only. Files go as base64 inside a text/plain JSON body (no preflight, like every portal form).
   Nothing is kept in the browser. Notes: docs/additions/careers-form.md. */
PP.ready(function () {
var form = document.querySelector('[data-careers-form]');
if (!form) return;

var MAX_CV = 5 * 1024 * 1024, MAX_PHOTO = 2 * 1024 * 1024, TIMEOUT_MS = 60000;
var BD_MOBILE = /^(?:\+?8801|01)[3-9]\d{8}$/;
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var JOB_RE = /^JOB-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{6}$/;
var loadedAt = Date.now(), sending = false;
var status = form.querySelector('.cf__status');
var btn = form.querySelector('button[type="submit"]');
var label = btn.querySelector('.btn__label');

function $(id) { return document.getElementById(id); }
function val(id) { var n = $(id); return n ? String(n.value || '').trim() : ''; }
function setErr(id, msg) {
  var n = $(id), e = $(id + '-err');
  if (e) e.textContent = msg || '';
  if (n) { if (msg) n.setAttribute('aria-invalid', 'true'); else n.removeAttribute('aria-invalid'); }
}
function fileOf(id) { var n = $(id); return n && n.files && n.files[0] ? n.files[0] : null; }

var FIELDS = ['cf-name', 'cf-phone', 'cf-email', 'cf-position', 'cf-level', 'cf-subject', 'cf-qual', 'cf-exp', 'cf-work', 'cf-cv', 'cf-photo', 'cf-note', 'cf-consent'];
var SERVER_FIELD = { fullName: 'cf-name', phone: 'cf-phone', email: 'cf-email', position: 'cf-position', level: 'cf-level', subject: 'cf-subject',
  qualification: 'cf-qual', experience: 'cf-exp', workplace: 'cf-work', cv: 'cf-cv', photo: 'cf-photo', note: 'cf-note', consent: 'cf-consent' };

function check() {
  var bad = [];
  function need(id, ok, msg) { setErr(id, ok ? '' : msg); if (!ok) bad.push(id); }
  var name = val('cf-name'), phone = val('cf-phone').replace(/[\s-]/g, ''), exp = val('cf-exp');
  need('cf-name', name.length >= 2, 'Enter your full name.');
  need('cf-phone', BD_MOBILE.test(phone), 'Enter a Bangladeshi mobile number, for example 017XX XXX XXX.');
  need('cf-email', EMAIL.test(val('cf-email')), 'Enter your email address, for example name@example.com.');
  need('cf-position', !!val('cf-position'), 'Choose the position you are applying for.');
  need('cf-subject', val('cf-subject').length >= 2, 'Say which subject or role, for example English.');
  need('cf-qual', val('cf-qual').length >= 2, 'Enter your highest qualification.');
  need('cf-exp', /^\d{1,2}$/.test(exp) && Number(exp) <= 50, 'Enter your years of experience as a number, 0 if none.');
  var cv = fileOf('cf-cv');
  need('cf-cv', !!cv && /\.pdf$/i.test(cv.name) && cv.size > 0 && cv.size <= MAX_CV,
    !cv ? 'Add your CV as a PDF file.' : !/\.pdf$/i.test(cv.name) ? 'Your CV must be a PDF file. Save it as PDF and add it again.' : 'Your CV is larger than 5 MB. Choose a smaller file.');
  var ph = fileOf('cf-photo');
  need('cf-photo', !!ph && /\.(jpe?g|png)$/i.test(ph.name) && ph.size > 0 && ph.size <= MAX_PHOTO,
    !ph ? 'Add a passport-size photograph.' : !/\.(jpe?g|png)$/i.test(ph.name) ? 'The photograph must be a JPEG or PNG file.' : 'The photograph is larger than 2 MB. Choose a smaller file.');
  need('cf-consent', $('cf-consent').checked, 'Tick this box to send your application.');
  return bad;
}

function readB64(file) {
  return new Promise(function (resolve, reject) {
    var r = new FileReader();
    r.onload = function () { var s = String(r.result || ''); resolve(s.slice(s.indexOf(',') + 1)); };
    r.onerror = function () { reject(r.error); };
    r.readAsDataURL(file);
  });
}

function busy(on) {
  sending = on;
  btn.disabled = on;
  label.textContent = on ? 'Sending…' : 'Send application';
}

function say(text, fail) {
  status.textContent = text;
  status.classList.toggle('cf__status--fail', !!fail);
}

function done(code) {
  var box = document.createElement('div');
  box.className = 'pp-code cf__done';
  box.setAttribute('role', 'region');
  box.setAttribute('aria-labelledby', 'cf-done-h');
  var h = document.createElement('h3'); h.className = 'pp-code__h'; h.id = 'cf-done-h'; h.tabIndex = -1; h.textContent = 'Sent. Your reference code is';
  var c = document.createElement('p'); c.className = 'pp-code__code'; c.setAttribute('translate', 'no'); c.textContent = code;
  var k = document.createElement('p'); k.className = 'pp-code__keep';
  k.textContent = 'Keep this code. Quote it if you call the school about your application. The school contacts candidates when an opening matches their qualifications.';
  var again = document.createElement('button'); again.type = 'button'; again.className = 'pp-code__again link'; again.textContent = 'Send another application';
  again.addEventListener('click', function () { box.parentNode.removeChild(box); form.hidden = false; form.reset(); say(''); $('cf-name').focus(); });
  box.appendChild(h); box.appendChild(c); box.appendChild(k); box.appendChild(again);
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
  var P = window.PPPortal;
  if (!P || !P.api || !window.fetch) { say('We could not send this online. Please use the steps below to send your CV.', true); return; }
  busy(true);
  var cv = fileOf('cf-cv'), ph = fileOf('cf-photo');
  Promise.all([readB64(cv), readB64(ph)]).then(function (files) {
    var body = {
      v: 1, visitorCode: P.visitorCode ? P.visitorCode() : null, sessionId: P.sessionId ? P.sessionId() : null,
      page: location.pathname, elapsedMs: Date.now() - loadedAt, hp: val('cf-hp'),
      fullName: val('cf-name'), phone: val('cf-phone'), email: val('cf-email'), position: val('cf-position'), level: val('cf-level'),
      subject: val('cf-subject'), qualification: val('cf-qual'), experience: Number(val('cf-exp')), workplace: val('cf-work'),
      note: val('cf-note'), consent: true,
      cv: { name: cv.name, data: files[0] }, photo: { name: ph.name, data: files[1] }
    };
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, TIMEOUT_MS) : null;
    return fetch(P.api + '/api/portal/job', {
      method: 'POST', body: JSON.stringify(body), credentials: 'omit', mode: 'cors', cache: 'no-store',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, signal: ctl ? ctl.signal : undefined
    }).then(function (res) {
      if (timer) clearTimeout(timer);
      return res.json().catch(function () { return null; }).then(function (d) { return { status: res.status, d: d }; });
    });
  }).then(function (r) {
    busy(false);
    var d = r.d || {};
    if (r.status === 201 && d.ok && JOB_RE.test(d.code || '')) {
      if (P.track) P.track({ t: 'form_submit', path: location.pathname, form: 'job' });
      done(d.code);
      return;
    }
    if (r.status === 201 && d.ok) { done('JOB-SENT'); return; }
    if (r.status === 400 && d.fields) {
      var first = null;
      Object.keys(d.fields).forEach(function (k) { var id = SERVER_FIELD[k]; if (id) { setErr(id, d.fields[k]); first = first || id; } });
      say('Check the fields marked above.', true);
      if (first) $(first).focus();
      return;
    }
    if (r.status === 413) { say('Your files are too large to send together. Choose a smaller CV or photograph.', true); return; }
    if (r.status === 429) { say('Too many tries in a short time. Please wait a few minutes and send again.', true); return; }
    say('We could not send this online. Please try again in a few minutes, or use the steps below to send your CV.', true);
  }).catch(function () {
    busy(false);
    say('We could not send this online. Check your connection and try again, or use the steps below to send your CV.', true);
  });
});
});
