/* portal: the website portal (2026-10-23, founder request; spec: playpen-school-sample-work/portal/spec.md section 8).
   One first-party script, no outside service, no PP.* dependency (the hand-built home loads it alone, as js/portal.js):
     1. a visit code (V-7K3Q9M) kept in this browser, page views and button presses counted against it
        (off under Do Not Track, Global Privacy Control, "Don't count my visits", or with no API);
     2. the Enquire and Book a visit forms, and the admission form, sent to the School Desk, each answered with a code;
     3. the footer line "Your visit code", the first-visit notice and the question helper (chat).
   The API origin comes from <meta name="pp:portal-api"> (shell.py, sync_home.py, from nav.json site.portal), or from
   ?portal-api=http://localhost:NNNN, honoured only while the site itself runs on localhost (local QA). ?portal=off turns
   everything off for the tab. With no API, or with the API down, every form behaves exactly as before (the prototype
   notice, the Download button).
   Review 2026-10-23: the visit code has a private key (pp_vkey) only this browser holds; forms carry the visit code only
   when the family ticks "Join my earlier visits"; every form asks the sender to confirm they are the parent or guardian;
   a chat has a key the server hands back with its first answer. */
(function () {
  'use strict';
  if (window.PPPortal) return;

  var doc = document, win = window, html = doc.documentElement;
  var ALPHA = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
  var V_RE = /^V-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{6}$/;
  var KEY_RE = /^[A-Za-z0-9_-]{16,64}$/;
  var BD_MOBILE = /^(?:\+?8801|01)[3-9]\d{8}$/;
  var MSG_MOBILE = 'Enter a Bangladeshi mobile number, for example 017XX XXX XXX.';
  var CODE_RE = /^(V|ENQ|VIS|APP|CHAT)-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{6}$/;
  var SID_RE = /^S-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{10}$/;
  var SESSION_IDLE_MS = 30 * 60 * 1000;
  var COOKIE_AGE = 34128000;                       /* 13 months, in seconds */
  var DOWN_MS = 2 * 60 * 1000;                     /* after a failed count, wait this long before trying again */
  var TIMEOUT_MS = 8000;
  var LOADED_AT = Date.now();
  var CLASSES = ['Playgroup', 'Nursery', 'KG I', 'KG II', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V',
    'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI, AS Level', 'Class XII', 'Not sure yet'];

  /* ------------------------------------------------------------------ small helpers */
  function ready(fn) {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', fn); else fn();
  }
  function $(s, c) { return (c || doc).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }
  function on(el, ev, fn, opt) { if (el) el.addEventListener(ev, fn, opt || false); }
  function el(tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function lsGet(k) { try { return win.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { win.localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  function lsDel(k) { try { win.localStorage.removeItem(k); } catch (e) { /* storage blocked */ } }
  function ssGet(k) { try { return win.sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { win.sessionStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  function ssDel(k) { try { win.sessionStorage.removeItem(k); } catch (e) { /* storage blocked */ } }
  function cookieGet(k) {
    try {
      var m = doc.cookie.match(new RegExp('(?:^|;\\s*)' + k + '=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : null;
    } catch (e) { return null; }
  }
  function cookieSet(k, v, age) {
    try { doc.cookie = k + '=' + encodeURIComponent(v) + '; max-age=' + age + '; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); } catch (e) { /* blocked */ }
  }
  function rand(n) {
    var out = '', c = win.crypto || win.msCrypto;
    while (out.length < n) {
      var buf = new Uint8Array(n * 2);
      if (c && c.getRandomValues) c.getRandomValues(buf);
      else for (var j = 0; j < buf.length; j++) buf[j] = Math.floor(Math.random() * 256);
      for (var i = 0; i < buf.length && out.length < n; i++) {
        if (buf[i] < 240) out += ALPHA.charAt(buf[i] % 30);   /* 240 = 8 x 30: no bias */
      }
    }
    return out;
  }
  function dhakaToday(addDays) {
    return new Date(Date.now() + 6 * 3600000 + (addDays || 0) * 86400000).toISOString().slice(0, 10);
  }
  function clip(s, n) { s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) : s; }
  function json(k) { try { return JSON.parse(ssGet(k) || 'null'); } catch (e) { return null; } }

  /* the path rule the server uses too: no query or hash, index.html -> its folder, folders end with a slash */
  function normPath(p) {
    p = String(p || '/').split('#')[0].split('?')[0];
    if (p.charAt(0) !== '/') p = '/' + p;
    p = p.replace(/\/{2,}/g, '/').replace(/\/index\.html?$/i, '/');
    var last = p.split('/').pop();
    if (last && last.indexOf('.') === -1) p += '/';
    return p.slice(0, 200);
  }
  var PATH = normPath(location.pathname);
  var OWN_HOSTS = ['localhost', '127.0.0.1', 'playpen.edu.bd', 'www.playpen.edu.bd', location.hostname];

  /* ------------------------------------------------------------------ configuration */
  var params;
  try { params = new URLSearchParams(location.search); } catch (e) { params = { get: function () { return null; } }; }
  if (params.get('portal') === 'off') ssSet('pp:portal', 'off');
  if (params.get('portal') === 'on') ssDel('pp:portal');
  var OFF = ssGet('pp:portal') === 'off';
  function metaOf(name) { var m = $('meta[name="' + name + '"]'); return m ? (m.getAttribute('content') || '').trim() : ''; }
  function localOrigin(v) { return /^http:\/\/(localhost|127\.0\.0\.1):\d{2,5}\/?$/.test(v || ''); }
  /* the QA override counts only while the site itself is on this computer: on a public host the meta tag always wins */
  var LOCAL_SITE = /^(localhost|127\.0\.0\.1)$/.test(location.hostname || '');
  var qApi = params.get('portal-api');
  if (LOCAL_SITE && qApi && localOrigin(qApi)) ssSet('pp:portal-api', qApi.replace(/\/$/, ''));
  if (!LOCAL_SITE) ssDel('pp:portal-api');
  var API = null;
  if (!OFF) {
    var sApi = LOCAL_SITE ? ssGet('pp:portal-api') : null;
    var mApi = metaOf('pp:portal-api');
    if (sApi && localOrigin(sApi)) API = sApi.replace(/\/$/, '');
    else if (/^https?:\/\/[^\s"'<>]+$/.test(mApi)) API = mApi.replace(/\/$/, '');
  }
  var CHAT_ON = !!API && metaOf('pp:portal-chat') !== 'off';
  var nav = win.navigator || {};
  var DNT = nav.doNotTrack === '1' || win.doNotTrack === '1' || nav.msDoNotTrack === '1';
  var GPC = nav.globalPrivacyControl === true;
  function optedOut() { return lsGet('pp:optout') === '1'; }
  var counting = !!API && !DNT && !GPC && !optedOut();

  /* ------------------------------------------------------------------ visit code and session */
  var vid = null, vkey = null;
  function keyChars(n) {
    var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_', out = '', c = win.crypto || win.msCrypto;
    var buf = new Uint8Array(n);
    if (c && c.getRandomValues) c.getRandomValues(buf); else for (var j = 0; j < n; j++) buf[j] = Math.floor(Math.random() * 256);
    for (var i = 0; i < n; i++) out += abc.charAt(buf[i] % 64);
    return out;
  }
  /* the visit code and its key travel together; a code without its key (storage half cleared) is replaced */
  function loadVisitor(create) {
    var a = lsGet('pp_vid'), b = cookieGet('pp_vid'), ka = lsGet('pp_vkey'), kb = cookieGet('pp_vkey');
    var v = V_RE.test(a || '') ? a : (V_RE.test(b || '') ? b : null);
    var k = KEY_RE.test(ka || '') ? ka : (KEY_RE.test(kb || '') ? kb : null);
    if (v && !k) v = null;
    if (!v && create) { v = 'V-' + rand(6); k = keyChars(22); }
    if (v) {
      if (a !== v) lsSet('pp_vid', v);
      if (b !== v) cookieSet('pp_vid', v, COOKIE_AGE);
      if (ka !== k) lsSet('pp_vkey', k);
      if (kb !== k) cookieSet('pp_vkey', k, COOKIE_AGE);
    }
    vkey = v ? k : null;
    return v;
  }
  function dropVisitor() {
    lsDel('pp_vid');
    lsDel('pp_vkey');
    cookieSet('pp_vid', '', 0);
    cookieSet('pp_vkey', '', 0);
    vid = null;
    vkey = null;
  }
  function sessionId() {
    var now = Date.now();
    var sid = ssGet('pp_sid'), at = parseInt(ssGet('pp_sid_at') || '0', 10);
    if (!SID_RE.test(sid || '') || !at || now - at > SESSION_IDLE_MS) sid = 'S-' + rand(10);
    ssSet('pp_sid', sid);
    ssSet('pp_sid_at', String(now));
    return sid;
  }

  /* ------------------------------------------------------------------ network */
  function post(path, body, opts) {
    opts = opts || {};
    var url = API + path, data = JSON.stringify(body);
    if (!win.fetch) return Promise.resolve({ status: 0, data: null, error: 'network' });
    var ctl = win.AbortController ? new win.AbortController() : null;
    var timer = ctl ? win.setTimeout(function () { ctl.abort(); }, opts.timeout || TIMEOUT_MS) : null;
    return win.fetch(url, {
      method: 'POST', body: data, credentials: 'omit', mode: 'cors', keepalive: !!opts.keepalive, cache: 'no-store',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, signal: ctl ? ctl.signal : undefined
    }).then(function (res) {
      if (timer) win.clearTimeout(timer);
      if (res.status === 204) return { status: 204, data: null };
      return res.text().then(function (t) {
        var d = null;
        try { d = t ? JSON.parse(t) : null; } catch (e) { d = null; }
        return { status: res.status, data: d };
      });
    }, function (err) {
      if (timer) win.clearTimeout(timer);
      return { status: 0, data: null, error: err && err.name === 'AbortError' ? 'timeout' : 'network' };
    });
  }
  function markDown() { ssSet('pp:portal-down', String(Date.now())); }
  function isDown() { var t = parseInt(ssGet('pp:portal-down') || '0', 10); return t && Date.now() - t < DOWN_MS; }
  function markUp() { ssDel('pp:portal-down'); }

  /* ------------------------------------------------------------------ tracker */
  var queue = [], flushTimer = null, pv = null;
  function stopCounting() {
    /* "Don't count my visits" in another tab: this tab stops too, at once (review correctness-1) */
    if (flushTimer) { win.clearTimeout(flushTimer); flushTimer = null; }
    queue = [];
    pv = null;
    counting = false;
    vid = null;
    vkey = null;
    api.counting = false;
  }
  function track(item) {
    if (counting && optedOut()) { stopCounting(); renderVisitLine(); }
    if (!counting || !item || isDown()) return;
    if (!vid) vid = loadVisitor(true);
    item._t = Date.now();
    queue.push(item);
    if (queue.length > 60) queue.splice(0, queue.length - 60);
    if (queue.length >= 10) flush(false);
    else if (!flushTimer) flushTimer = win.setTimeout(function () { flushTimer = null; flush(false); }, 5000);
  }
  function flush(beacon) {
    if (flushTimer) { win.clearTimeout(flushTimer); flushTimer = null; }
    if (counting && optedOut()) stopCounting();
    if (!counting || !queue.length || isDown()) { if (!counting) queue = []; return; }
    var now = Date.now();
    while (queue.length) {
      /* each item says how long ago it happened, so the Desk keeps the order the family saw (review ux-3) */
      var items = queue.splice(0, 20).map(function (it) {
        var o = {};
        for (var k in it) if (Object.prototype.hasOwnProperty.call(it, k) && k !== '_t') o[k] = it[k];
        o.ago = Math.max(0, now - (it._t || now));
        return o;
      });
      var batch = { v: 1, visitorCode: vid, visitorKey: vkey, sessionId: sessionId(), items: items };
      var body = JSON.stringify(batch), url = API + '/api/portal/track', sent = false;
      if (beacon && nav.sendBeacon) {
        try { sent = nav.sendBeacon(url, new Blob([body], { type: 'text/plain;charset=UTF-8' })); } catch (e) { sent = false; }
      }
      if (!sent) {
        post('/api/portal/track', batch, { keepalive: true }).then(function (r) {
          if (r.status === 0) { markDown(); queue = []; }
        });
      }
    }
  }
  function deviceClass() {
    var w = win.innerWidth || html.clientWidth || 1024;
    var coarse = false;
    try { coarse = win.matchMedia('(pointer: coarse)').matches; } catch (e) { coarse = false; }
    if (w < 600) return 'mobile';
    return coarse ? 'tablet' : (w < 1024 ? 'tablet' : 'desktop');
  }
  function viewport() {
    var w = win.innerWidth || html.clientWidth || 1024;
    return w < 360 ? 'xs' : w < 600 ? 'sm' : w < 900 ? 'md' : w < 1280 ? 'lg' : 'xl';
  }
  function refHost() {
    try {
      if (!doc.referrer) return null;
      var host = new URL(doc.referrer).hostname.toLowerCase();
      return (!host || OWN_HOSTS.indexOf(host) > -1) ? null : host.slice(0, 120);
    } catch (e) { return null; }
  }
  function utm() {
    var s = params.get('utm_source'), m = params.get('utm_medium'), c = params.get('utm_campaign');
    if (!s && !m && !c) return null;
    return { source: s ? s.slice(0, 64) : null, medium: m ? m.slice(0, 64) : null, campaign: c ? c.slice(0, 64) : null };
  }
  function pageTitle() { return clip(String(doc.title || '').replace(/\s*\|\s*The Playpen School, Dhaka\s*$/, ''), 120); }

  function startPageview() {
    if (!counting) return;
    pv = { id: 'pv_' + rand(12), acc: 0, since: doc.visibilityState === 'hidden' ? 0 : Date.now(), sent: -1, scroll: 0 };
    measureScroll();
    track({ t: 'pageview', id: pv.id, path: PATH, title: pageTitle(), ref: refHost(), utm: utm(), device: deviceClass(), vp: viewport() });
  }
  function measureScroll() {
    if (!pv) return;
    var h = Math.max(doc.body ? doc.body.scrollHeight : 0, html.scrollHeight);
    var seen = (win.scrollY || html.scrollTop || 0) + (win.innerHeight || 0);
    var pct = h > 0 ? Math.min(100, Math.round(seen / h * 100)) : 100;
    if (pct > pv.scroll) pv.scroll = pct;
  }
  var scrollRaf = 0;
  on(win, 'scroll', function () {
    if (!pv || scrollRaf) return;
    var next = function () { scrollRaf = 0; measureScroll(); };
    scrollRaf = win.requestAnimationFrame ? win.requestAnimationFrame(next) : win.setTimeout(next, 16);
  }, { passive: true });
  function leave() {
    if (!pv) return;
    if (pv.since) { pv.acc += Date.now() - pv.since; pv.since = 0; }
    if (pv.acc !== pv.sent) {
      pv.sent = pv.acc;
      track({ t: 'pageleave', id: pv.id, durationMs: Math.min(pv.acc, 86400000), scrollPct: pv.scroll });
    }
  }
  on(doc, 'visibilitychange', function () {
    if (doc.visibilityState === 'hidden') { leave(); abandonForms(); flush(true); botStop(); }
    else { if (pv && !pv.since) pv.since = Date.now(); botStart(); }
  });
  on(win, 'pagehide', function () { leave(); abandonForms(); flush(true); botStop(); });
  on(win, 'pageshow', function (e) {
    if (!e.persisted) return;
    if (counting) startPageview();
    botStart(); /* a back/forward-cache restore: pagehide stopped the robot and not every browser fires visibilitychange here */
  });

  /* button presses: the sticky actions, .btn, the three admissions pages, telephone links, data-portal-cta */
  var CTA_PATHS = ['/admissions/visit/', '/admissions/enquire/', '/admissions/how-to-apply/'];
  function linkPath(a) {
    try {
      var u = new URL(a.getAttribute('href'), location.href);
      if (u.protocol === 'tel:') return 'tel';
      if (u.origin !== location.origin) return null;
      return normPath(u.pathname);
    } catch (e) { return null; }
  }
  on(doc, 'click', function (e) {
    if (!counting) return;
    var t = e.target && e.target.closest ? e.target.closest('a[href], button, [data-portal-cta]') : null;
    if (!t) return;
    var fixed = t.getAttribute('data-portal-cta');
    if (!fixed && t.closest('.ppc, .pp-notice, .foot__visit')) return;    /* the portal's own controls */
    var href = t.tagName === 'A' ? (t.getAttribute('href') || '') : '';
    var target = t.tagName === 'A' ? linkPath(t) : null;
    var isTel = /^tel:/i.test(href);
    var wanted = fixed || isTel || t.closest('.actions') || (t.classList && t.classList.contains('btn')) ||
      (target && CTA_PATHS.indexOf(target) > -1);
    if (!wanted) return;
    var label;
    if (fixed) label = fixed;
    else if (isTel) {
      var shown = (t.textContent || '').replace(/[^\d+ ]/g, ' ').replace(/\s+/g, ' ').trim();
      label = 'Call ' + (/\d{4}/.test(shown) ? shown : href.slice(4));
    } else label = t.getAttribute('aria-label') && !(t.textContent || '').trim() ? t.getAttribute('aria-label') : t.textContent;
    label = clip(label, 60);
    if (!label) return;
    track({ t: 'cta', path: PATH, label: label, target: isTel ? 'tel' : target });
  }, true);

  /* forms started and left: counts only, never what was typed */
  var forms = [];   /* {kind, el, started, done} */
  function watchForm(kind, formEl) {
    if (!formEl) return null;
    var f = { kind: kind, el: formEl, started: 0, done: false };
    forms.push(f);
    on(formEl, 'input', function () {
      if (f.started) return;
      f.started = Date.now();
      track({ t: 'form_start', path: PATH, form: kind });
    });
    return f;
  }
  function filled(formEl) {
    return $$('input, select, textarea', formEl).filter(function (x) {
      if (x.type === 'hidden' || x.type === 'submit' || x.type === 'button' || x.name === 'pp_website') return false;
      if (x.type === 'checkbox' || x.type === 'radio') return x.checked;
      return (x.value || '').trim() !== '';
    }).length;
  }
  function abandonForms() {
    forms.forEach(function (f) {
      if (f.started && !f.done && !f.abandoned) {
        f.abandoned = true;
        track({ t: 'form_abandon', path: PATH, form: f.kind, fields: filled(f.el) });
      }
    });
  }
  function formByKind(kind) { for (var i = 0; i < forms.length; i++) if (forms[i].kind === kind) return forms[i]; return null; }

  /* ------------------------------------------------------------------ submitting a form */
  function rememberCode(kind, code) {
    var list = [];
    try { list = JSON.parse(lsGet('pp:last-codes') || '[]') || []; } catch (e) { list = []; }
    list = list.filter(function (x) { return x && x.code !== code; });
    list.unshift({ code: code, kind: kind, date: dhakaToday() });
    lsSet('pp:last-codes', JSON.stringify(list.slice(0, 5)));
  }
  function submit(kind, body) {
    if (!API) return Promise.resolve({ ok: false, error: 'off' });
    if (['enquiry', 'visit', 'application'].indexOf(kind) < 0) return Promise.resolve({ ok: false, error: 'invalid' });
    var f = formByKind(kind);
    /* the visit code goes with a form only when the family ticked "Join my earlier visits" (review safeguard-3) */
    var join = !!(body && body.joinVisits) && counting;
    var payload = {
      v: 1, visitorCode: join ? (vid || loadVisitor(true)) : null, sessionId: join ? sessionId() : null, page: PATH,
      /* the admission form restores a saved draft, so a family may send it within seconds of a touch: count from page load */
      elapsedMs: Date.now() - ((kind !== 'application' && f && f.started) || LOADED_AT), hp: ''
    };
    for (var k in body) if (Object.prototype.hasOwnProperty.call(body, k)) payload[k] = body[k];
    return post('/api/portal/' + kind, payload).then(function (r) {
      var d = r.data || {};
      if ((r.status === 201 || r.status === 200) && d.ok && typeof d.code === 'string' && CODE_RE.test(d.code)) {
        markUp();
        rememberCode(kind, d.code);
        if (f) f.done = true;
        track({ t: 'form_submit', path: PATH, form: kind });
        return { ok: true, code: d.code, createdAt: d.createdAt || null };
      }
      if (r.status === 400 && d.fields && typeof d.fields === 'object') return { ok: false, error: 'invalid', fields: d.fields };
      if (r.status === 429) return { ok: false, error: 'rate_limited' };
      if (r.status === 0) return { ok: false, error: r.error || 'network' };
      return { ok: false, error: d.error || ('http_' + r.status) };
    });
  }

  /* the school's lines, read from the footer the shell writes (nav.json), so no number is typed in this script */
  function schoolLines() {
    var rows = $$('.foot__phones li').map(function (li) {
      var who = $('.phones__who', li), links = $$('a[href^="tel:"]', li);
      return who && links.length ? { who: who.textContent.trim(), links: links } : null;
    }).filter(Boolean);
    return { sections: rows.slice(0, 3), further: rows[3] || null };
  }
  function lineIndex(classRaw) {
    var i = CLASSES.indexOf(classRaw);
    if (i < 0 || classRaw === 'Not sure yet') return -1;
    return i <= 4 ? 0 : i <= 9 ? 1 : 2;
  }
  function telLink(a, cls) {
    var n = el('a', cls || 'link', a.textContent.trim());
    n.href = a.getAttribute('href');
    return n;
  }
  function linesList(cls) {
    var ul = el('ul', cls || 'pp-lines');
    schoolLines().sections.forEach(function (row) {
      var li = el('li', 'pp-lines__row');
      li.appendChild(el('span', 'pp-lines__who', row.who));
      li.appendChild(telLink(row.links[0], 'pp-lines__tel'));
      ul.appendChild(li);
    });
    return ul;
  }

  /* the confirmation panel: "Sent. Your code is ..." */
  var panelSeq = 0;
  var WHAT = { enquiry: 'your enquiry', visit: 'your visit request', application: 'your form' };
  function showCode(container, kind, code, opts) {
    opts = opts || {};
    if (!container || !CODE_RE.test(code || '')) return null;
    var old = $('.pp-code', container);
    if (old) old.parentNode.removeChild(old);
    var id = 'pp-code-' + (++panelSeq);
    var box = el('div', 'pp-code');
    box.setAttribute('role', 'region');
    box.setAttribute('aria-labelledby', id);
    var h = el(opts.heading || 'h3', 'pp-code__h', 'Sent. Your code is');
    h.id = id;
    h.tabIndex = -1;
    var c = el('p', 'pp-code__code', code);
    c.setAttribute('translate', 'no');
    var copy = el('button', 'pp-code__copy');
    copy.type = 'button';
    copy.appendChild(el('span', 'pp-code__copy-label', 'Copy the code'));
    on(copy, 'click', function () {
      var label = $('.pp-code__copy-label', copy);
      function done(ok) {
        label.textContent = ok ? 'Copied' : 'Select the code to copy it';
        win.setTimeout(function () { label.textContent = 'Copy the code'; }, 2000);
        if (ok) track({ t: 'code_copy', path: PATH, label: kind });
      }
      if (nav.clipboard && nav.clipboard.writeText) nav.clipboard.writeText(code).then(function () { done(true); }, function () { done(fallbackCopy(c)); });
      else done(fallbackCopy(c));
    });
    box.appendChild(h);
    box.appendChild(c);
    box.appendChild(copy);
    box.appendChild(el('p', 'pp-code__keep', 'Keep this code. Quote it when you call the admissions line, so the office finds ' + (WHAT[kind] || 'your form') + ' at once.'));
    if (kind === 'visit' || kind === 'application') box.appendChild(el('p', 'pp-code__keep', 'When the office has confirmed your day, give this code at the school’s Front Office when you arrive.'));
    var li = lineIndex(opts.classRaw || ''), lines = schoolLines().sections;
    if (li > -1 && lines[li]) {
      var p = el('p', 'pp-code__line', 'The admissions line for ' + lines[li].who + ' is ');
      p.appendChild(telLink(lines[li].links[0]));
      p.appendChild(doc.createTextNode('.'));
      box.appendChild(p);
    } else if (lines.length) {
      box.appendChild(el('p', 'pp-code__line', 'Call the line for your child’s section:'));
      box.appendChild(linesList());
    }
    box.appendChild(el('p', 'pp-code__small', 'Sample build: this goes to a sample office app on this computer, not to the school.'));
    if (opts.before) container.insertBefore(box, opts.before); else container.appendChild(box);
    if (opts.focus !== false) win.setTimeout(function () { try { h.focus({ preventScroll: false }); } catch (e) { h.focus(); } }, 0);
    return box;
  }
  function fallbackCopy(node) {
    try {
      var r = doc.createRange();
      r.selectNodeContents(node);
      var s = win.getSelection();
      s.removeAllRanges();
      s.addRange(r);
      var ok = doc.execCommand && doc.execCommand('copy');
      return !!ok;
    } catch (e) { return false; }
  }

  /* ------------------------------------------------------------------ the public object */
  var api = window.PPPortal = {
    api: API, counting: counting,
    visitorCode: function () { return counting ? vid : null; },
    sessionId: sessionId,
    track: track,
    submit: submit,
    showCode: showCode,
    setCounting: setCounting,
    lines: schoolLines,
    isMobile: function (v) { return BD_MOBILE.test(String(v || '').replace(/[\s-]/g, '')); }
  };
  function setCounting(onNow) {
    if (onNow) {
      lsDel('pp:optout');
      counting = !!API && !DNT && !GPC;
      if (counting) { vid = loadVisitor(true); startPageview(); }
    } else {
      lsSet('pp:optout', '1');
      var old = vid || loadVisitor(false), oldKey = vkey;
      queue = [];
      pv = null;
      counting = false;
      dropVisitor();
      if (API && old && oldKey) post('/api/portal/forget', { v: 1, visitorCode: old, visitorKey: oldKey }, { keepalive: true });
    }
    api.counting = counting;
    renderVisitLine();
    hideNotice();
  }

  if (!API) return;   /* no API (or ?portal=off): nothing below runs, the site is exactly the prototype */

  /* another tab pressed "Don't count my visits" (or counted again): follow it here */
  on(win, 'storage', function (e) {
    if (!e || (e.key !== 'pp:optout' && e.key !== 'pp_vid' && e.key !== null)) return;
    if (optedOut()) { if (counting) stopCounting(); }
    else if (!counting && !DNT && !GPC && e.key === 'pp:optout') { counting = true; api.counting = true; vid = loadVisitor(true); startPageview(); }
    renderVisitLine();
  });

  /* the sticky actions bar on phones: the launcher and the notice sit above it */
  function measureActions() {
    var wrap = $('.actions'), bar = $('.actions__bar');
    function set() {
      var hgt = 0;
      if (wrap && bar && wrap.classList.contains('is-visible')) {
        var cs = win.getComputedStyle(bar);
        if (cs.display !== 'none') hgt = Math.round(bar.getBoundingClientRect().height);
      }
      html.style.setProperty('--pp-actions-h', hgt + 'px');
    }
    set();
    on(win, 'resize', set, { passive: true });
    if (wrap && win.MutationObserver) new win.MutationObserver(set).observe(wrap, { attributes: true, attributeFilter: ['class'] });
  }

  /* the home hero's "Pause video" button sits in the launcher's corner on phones: while it shows, the launcher rises above
     it, so the only control that stops the moving video can always be tapped (review ux-1, WCAG 2.2.2) */
  var heroRemeasure = null; /* set by measureHeroPause(): re-run the measurement (used when the launcher's robot slot appears) */
  function measureHeroPause() {
    var pause = $('.hero__pause');
    if (!pause) return;
    var raf = 0;
    function set() {
      raf = 0;
      var off = 0;
      if (!pause.hidden && pause.offsetParent !== null) {
        var r = pause.getBoundingClientRect(), vh = win.innerHeight || html.clientHeight, vw = win.innerWidth || html.clientWidth;
        var actions = parseInt(win.getComputedStyle(html).getPropertyValue('--pp-actions-h'), 10) || 0;
        /* the launcher is a pill now, so its real size is measured (its resting place, before any hero offset) */
        var lb = $('.ppc-launch'), lr = lb ? lb.getBoundingClientRect() : null;
        var lw = lr && lr.width ? lr.width : 56, lh = lr && lr.height ? lr.height : 56;
        var launchTop = vh - 16 - actions - lh, launchLeft = vw - 16 - lw;
        /* the robot's head and its "?" bubble stand above the pill's top edge: that overhang counts too */
        var over = lb && lb.classList.contains('has-robot') ? (vw < 480 ? 34 : 54) : 0;
        var overlaps = r.bottom > launchTop - 8 - over && r.top < vh - 16 - actions && r.right > launchLeft - 8;
        if (overlaps && r.bottom > 0) off = Math.max(0, Math.round(vh - r.top + 8 - 16 - actions));
      }
      html.style.setProperty('--pp-hero-offset', off + 'px');
    }
    function later() { if (!raf) raf = win.requestAnimationFrame ? win.requestAnimationFrame(set) : win.setTimeout(set, 16); }
    heroRemeasure = later;
    set();
    on(win, 'scroll', later, { passive: true });
    on(win, 'resize', later, { passive: true });
    if (win.MutationObserver) new win.MutationObserver(later).observe(pause, { attributes: true, attributeFilter: ['hidden', 'class', 'style'] });
  }

  /* ------------------------------------------------------------------ footer line: "Your visit code" */
  function renderVisitLine() {
    var line = $('[data-portal-visit]');
    if (!line || !API) return;
    var had = line.contains(doc.activeElement);
    line.textContent = '';
    line.hidden = false;
    if (DNT || GPC) {
      line.appendChild(doc.createTextNode('Your browser asks sites not to count visits, so this site does not.'));
      return;
    }
    var btn = el('button', 'foot__visit-btn');
    btn.type = 'button';
    if (counting && vid) {
      line.appendChild(doc.createTextNode('Your visit code: '));
      var c = el('span', 'foot__visit-code', vid);
      c.setAttribute('translate', 'no');
      line.appendChild(c);
      btn.textContent = 'Don’t count my visits';
      on(btn, 'click', function () { setCounting(false); });
    } else {
      line.appendChild(doc.createTextNode('Your visits are not counted.'));
      btn.textContent = 'Count my visits again';
      on(btn, 'click', function () { setCounting(true); });
    }
    line.appendChild(btn);
    var more = el('a', 'link foot__visit-more', 'About visit codes');
    more.href = siteHref('/privacy/#c-visit');
    line.appendChild(more);
    if (had) btn.focus();
  }
  function siteRoot() {
    var r = doc.body && doc.body.getAttribute('data-root');
    if (r) return r;
    return location.protocol === 'file:' ? './' : '/';
  }
  function siteHref(h) {
    if (typeof h !== 'string' || h.charAt(0) !== '/' || h.charAt(1) === '/') return null;
    return siteRoot() + h.slice(1);
  }

  /* ------------------------------------------------------------------ first-visit notice */
  var notice = null;
  function showNotice() {
    if (!counting) return;
    /* the first page of the first visit only; it steps aside as soon as the visitor starts a form or opens the helper, so it
       never sits over a form's buttons. The footer line says the same on every page. */
    if (lsGet('pp:notice')) return;
    lsSet('pp:notice', 'shown');
    on(doc, 'focusin', function (e) {
      var t = e.target;
      if (notice && t && t.closest && t.closest('input, select, textarea') && !notice.contains(t)) hideNotice();
    });
    notice = el('div', 'pp-notice');
    notice.setAttribute('role', 'region');
    notice.setAttribute('aria-label', 'About visit codes');
    var p = el('p', 'pp-notice__text', 'This site counts visits with a short code kept in your browser. No names unless you send a form and choose to join your visits to it. No advertising trackers. ');
    var a = el('a', 'link pp-notice__more', 'Read more');
    a.appendChild(el('span', 'visually-hidden', ' about visit codes'));
    a.href = siteHref('/privacy/#c-visit');
    p.appendChild(a);
    var close = el('button', 'pp-notice__close', 'Close');
    close.type = 'button';
    on(close, 'click', function () { lsSet('pp:notice', 'closed'); hideNotice(); });
    notice.appendChild(p);
    notice.appendChild(close);
    doc.body.appendChild(notice);
    /* on narrow screens the launcher folds to its crest while the notice shows, so the two never overlap; on phones the
       notice is a bottom bar and the launcher stands on top of it (its height is measured here, final review 2026-10-25) */
    html.classList.add('pp-noticed');
    measureNotice();
    on(win, 'resize', measureNotice, { passive: true });
    if (launcher) launcher.setAttribute('aria-label', 'Ask the Admissions Desk, AI assistant');
  }
  function measureNotice() {
    html.style.setProperty('--pp-notice-h', (notice && notice.parentNode ? Math.round(notice.getBoundingClientRect().height) : 0) + 'px');
  }
  function hideNotice() {
    html.classList.remove('pp-noticed');
    html.style.setProperty('--pp-notice-h', '0px');
    if (launcher) launcher.removeAttribute('aria-label');
    if (notice && notice.parentNode) {
      var had = notice.contains(doc.activeElement);
      notice.parentNode.removeChild(notice);
      notice = null;
      if (had) { var f = $('[data-portal-visit] button') || $('#content'); if (f) f.focus(); }
    }
  }

  /* ------------------------------------------------------------------ Enquire and Book a visit */
  var FIELD_IDS = { guardianName: 'name', name: 'name', phone: 'phone', email: 'email', childFirstName: 'child', child: 'child',
    classRaw: 'class', 'class': 'class', message: 'msg', preferredDate: 'date', preferredPart: 'part', whenRaw: 'when', guardian: 'guardian' };
  function bdMobile(v) { return BD_MOBILE.test(String(v || '').replace(/[\s-]/g, '')); }
  function ticked(id) { var n = doc.getElementById(id); return !!(n && n.checked); }
  function consentOf(scope, name) {
    var c = { whatsapp: false, sms: false, email: false };
    $$('input[type="checkbox"][name="' + name + '"]', scope).forEach(function (b) { if (c.hasOwnProperty(b.value)) c[b.value] = b.checked; });
    return c;
  }
  function honeypot(scope, idp) {
    if ($('input[name="pp_website"]', scope)) return;
    var w = el('div', 'pp-hp');
    w.setAttribute('aria-hidden', 'true');
    var l = el('label', null, 'Leave this empty');
    l.htmlFor = idp + '-website';
    var i = el('input');
    i.type = 'text'; i.id = idp + '-website'; i.name = 'pp_website'; i.tabIndex = -1; i.autocomplete = 'off';
    w.appendChild(l); w.appendChild(i);
    scope.appendChild(w);
  }
  function val(id) { var n = doc.getElementById(id); return n ? (n.value || '').trim() : ''; }
  function wirePageForm() {
    var kind = /\/admissions\/enquire\/$/.test(PATH) ? 'enquiry' : /\/admissions\/visit\/$/.test(PATH) ? 'visit' : null;
    if (!kind) return;
    var form = $('form[data-prototype-form]');
    if (!form) return;
    var p = kind === 'enquiry' ? 'e' : 'v';
    var notice = $('.form-notice', form.parentNode) || $('.form-notice');
    var btn = $('button[type="submit"]', form), label = btn && $('.btn__label', btn);
    var labelText = label ? label.textContent : '';
    var sending = false;
    honeypot(form, p);
    watchForm(kind, form);
    /* the join tick shows only while visits are counted in this browser */
    var joinRow = doc.getElementById(p + '-join-row');
    if (joinRow) joinRow.hidden = !counting;
    var date = doc.getElementById('v-date');
    if (date) { date.min = dhakaToday(0); date.max = dhakaToday(90); }

    function setErr(key, msg) {
      var id = p + '-' + key, f = doc.getElementById(id), err = doc.getElementById(id + '-err');
      if (err) err.textContent = msg;
      if (f) { if (msg) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid'); }
      return f;
    }
    function failNotice() {
      if (!notice) return;
      var lead = $('.pp-fail', notice);
      if (!lead) {
        lead = el('p', 'form-notice__text pp-fail', 'We could not send this online. Please call the admissions line for your child’s section.');
        notice.insertBefore(lead, notice.firstChild);
      }
      notice.classList.add('is-shown');
      notice.setAttribute('tabindex', '-1');
      try { notice.focus({ preventScroll: false }); } catch (e) { notice.focus(); }
    }
    function busy(onNow) {
      sending = onNow;
      if (!btn) return;
      btn.disabled = onNow;
      btn.setAttribute('aria-busy', onNow ? 'true' : 'false');
      if (label) label.textContent = onNow ? 'Sending...' : labelText;
    }

    on(form, 'submit', function () {
      win.setTimeout(function () {
        if (sending) return;
        if ($('[aria-invalid="true"]', form)) return;
        if ($$('.field__error', form).some(function (x) { return x.textContent.trim() !== ''; })) return;
        if (!bdMobile(val(p + '-phone'))) {
          var badPhone = setErr('phone', MSG_MOBILE);
          if (notice) notice.classList.remove('is-shown');
          if (badPhone) badPhone.focus();
          return;
        }
        var hp = $('input[name="pp_website"]', form);
        var body = {
          guardianName: val(p + '-name'), phone: val(p + '-phone'), email: val(p + '-email'),
          childFirstName: val(p + '-child'), classRaw: val(p + '-class'), consent: consentOf(form, 'consent'),
          guardian: ticked(p + '-guardian'), joinVisits: ticked(p + '-join'),
          hp: hp ? hp.value : ''
        };
        if (kind === 'enquiry') {
          body.message = val('e-msg');
          body.source = 'site_form';
          body.chatCode = null;
        } else {
          var d = val('v-date');
          if (d && (d < dhakaToday(0) || d > dhakaToday(90))) {
            var bad = setErr('date', 'Choose a day between today and 90 days from now, or leave it empty.');
            if (notice) notice.classList.remove('is-shown');
            if (bad) bad.focus();
            return;
          }
          body.preferredDate = d;
          body.preferredPart = val('v-part') || 'any';
          body.whenRaw = val('v-when');
        }
        /* the request is going out: the prototype notice inner.js just showed is not the answer */
        if (notice) notice.classList.remove('is-shown');
        var classRaw = body.classRaw;
        busy(true);
        submit(kind, body).then(function (r) {
          busy(false);
          if (r.ok) {
            var failLine = notice && $('.pp-fail', notice);
            if (failLine) failLine.parentNode.removeChild(failLine);
            if (notice) notice.classList.remove('is-shown');
            form.reset();
            var sel = doc.getElementById(p + '-class');
            if (sel) { try { sel.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) { /* old browser */ } }
            $$('[aria-invalid]', form).forEach(function (x) { x.removeAttribute('aria-invalid'); });
            var f = formByKind(kind);
            if (f) { f.started = 0; f.done = false; f.abandoned = false; }
            /* the form steps aside once it is sent, so nobody sends it twice by mistake (review ux-5) */
            form.hidden = true;
            var shown = showCode(form.parentNode, kind, r.code, { before: form.nextSibling, classRaw: classRaw });
            if (shown) {
              var again = el('button', 'pp-code__again link', kind === 'visit' ? 'Ask for another visit' : 'Send another enquiry');
              again.type = 'button';
              on(again, 'click', function () {
                form.hidden = false;
                if (shown.parentNode) shown.parentNode.removeChild(shown);
                var first = doc.getElementById(p + '-name');
                if (first) first.focus();
              });
              shown.appendChild(again);
            }
            return;
          }
          if (r.error === 'invalid' && r.fields) {
            var first = null;
            Object.keys(r.fields).forEach(function (k) {
              var key = FIELD_IDS[k];
              if (!key) return;
              var f2 = setErr(key, String(r.fields[k] || 'Check this answer.'));
              if (f2 && !first) first = f2;
            });
            if (first) { first.focus(); return; }
          }
          failNotice();
        });
      }, 0);
    });
  }

  /* ------------------------------------------------------------------ the question helper (chat) */
  var STATE_KEY = 'pp:chat';
  var state = json(STATE_KEY) || {};
  if (!state || typeof state !== 'object' || state.v !== 1) state = { v: 1, chatCode: null, chatKey: null, context: null, messages: [], lastUnanswered: null };
  var launcher = null, panel = null, log = null, input = null, sendBtn = null, typing = null, waiting = false;
  var FIRST = {
    from: 'bot', kind: 'hello',
    text: 'This is the Admissions Desk, an AI assistant. I answer from the school’s published pages. Ask about admission, the curriculum, visits or school life.',
    chips: ['What curriculum do you follow?', 'How do I apply?', 'Can I visit the school?', 'Which number do I call?']
  };
  function saveState() {
    if (state.messages.length > 50) state.messages = state.messages.slice(-50);
    ssSet(STATE_KEY, JSON.stringify(state));
  }
  function reduced() {
    if (html.getAttribute('data-motion') === 'reduced' || html.getAttribute('data-tier') === 'still') return true;
    try { return win.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  function svg(path, size) {
    var ns = 'http://www.w3.org/2000/svg', s = doc.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', size || 24);
    s.setAttribute('height', size || 24);
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    var pth = doc.createElementNS(ns, 'path');
    pth.setAttribute('d', path);
    pth.setAttribute('fill', 'none');
    pth.setAttribute('stroke', 'currentColor');
    pth.setAttribute('stroke-width', '1.6');
    pth.setAttribute('stroke-linecap', 'round');
    pth.setAttribute('stroke-linejoin', 'round');
    s.appendChild(pth);
    return s;
  }
  var ICON_CHAT = 'M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9l-4.5 3.5v-3.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z M7.5 10.5h9 M7.5 13.5h5.5';
  var ICON_CLOSE = 'M6 6l12 12 M18 6L6 18';

  /* the launcher is the "Admissions Desk" (2026-10-23 v3, figure edition): a maroon pill with a gold-ringed crest, a
     title and a status line. No face, no looping motion: one fade-in, one gold sheen, one breath of the halo and one
     visor pulse on arrival, then it stays still. The crest shows a thin spinning arc only while an answer the visitor
     asked for is on its way. Under reduced motion nothing moves at all.
     The crest holds the assistant figure (a robot bust, site/assets/chat/assistant.png) when that file exists; until it
     does, or if it fails to load, the gold "P" monogram stays and nothing looks broken. The <img> is made by script only,
     so no page references a file that may not be there yet. */
  var titleEl = null, titleShort = null, statusEl = null;
  var TITLE_IDLE = 'Ask the Admissions Desk', TITLE_SHORT = 'Ask the Desk · AI', STATUS_IDLE = 'AI assistant · replies in seconds';
  var FIG_SRC = '/assets/chat/assistant.png', figOk = null; /* null = not known yet, true = drawn, false = missing */
  function figImg(size, cls, onOk, onFail) {
    var im = doc.createElement('img'), settled = false;
    im.className = cls;
    im.width = size;
    im.height = size;
    im.alt = '';
    im.setAttribute('loading', 'lazy');
    im.setAttribute('decoding', 'async');
    im.draggable = false;
    function ok() {
      if (settled) return;
      if (!(im.naturalWidth > 0)) { fail(); return; }
      settled = true;
      figOk = true;
      if (onOk) onOk();
    }
    function fail() {
      if (settled) return;
      settled = true;
      figOk = false;
      /* a 404, a blocked request or a corrupt file: the image leaves so no broken-image glyph can show */
      if (im.parentNode) im.parentNode.removeChild(im);
      if (onFail) onFail();
    }
    on(im, 'load', ok);
    on(im, 'error', fail);
    im.src = FIG_SRC;
    if (im.complete && im.naturalWidth > 0) ok();
    return im;
  }
  function circleSvg(s, r, stroke, width, opacity) {
    var c = doc.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', '22');
    c.setAttribute('cy', '22');
    c.setAttribute('r', r);
    c.setAttribute('fill', 'none');
    c.setAttribute('stroke', stroke);
    c.setAttribute('stroke-width', width);
    if (opacity) c.setAttribute('opacity', opacity);
    s.appendChild(c);
  }
  /* the same medallion at other sizes: the teaser card and the panel header. The figure is used only once the launcher
     has drawn it; otherwise the monogram. */
  function medallion(cls, size, still) {
    var fig = el('span', cls + ' is-mono');
    fig.setAttribute('aria-hidden', 'true');
    fig.appendChild(el('span', cls + '__halo'));
    fig.appendChild(el('span', cls + '__mono', 'P'));
    /* the robot edition (v4): once the launcher's robot has drawn (this page or an earlier one in the session), the
       medallion shows the same robot's head with its glowing face; if that file fails after all, the assistant crest
       of v3 takes over below, exactly as before */
    if (botOn || ssGet(BOT_KEY) === '1') {
      var face = faceSvg(cls + '__face');
      var pic = botPic(size, cls + '__img is-robot', function () {
        fig.classList.remove('is-mono');
        fig.appendChild(face);
        /* blinks in step with the launcher robot; the panel header stays still. A card dismissed before its image
           drew is not registered (the blink would otherwise keep toggling a detached svg) */
        if (!still && html.contains(fig)) faces.push(face);
      }, function () {
        if (figOk !== false) fig.appendChild(figImg(size, cls + '__img', function () { fig.classList.remove('is-mono'); }, null));
      });
      fig.appendChild(pic);
      return fig;
    }
    /* the monogram stays until the figure has drawn; a late failure simply leaves it there. A figure not known yet
       (the launcher's lazy image still loading) is attempted too: same cached URL, and the error path removes the <img> */
    if (figOk !== false) fig.appendChild(figImg(size, cls + '__img', function () { fig.classList.remove('is-mono'); }, null));
    return fig;
  }

  /* ---- the live robot (2026-10-23 v4, robot edition) ----
     The founder's robot (site/assets/chat/robot.*: pearl shell, gold trim, a black glass screen with nothing on it) stands
     in a slot at the pill's left end, head and a "?" bubble peeking above the pill. Its eyes and smile are drawn by this
     script as an SVG over the blank screen, so they can blink, look around and change: a dot-matrix pattern in the
     brand's gold on the glass. Loops (float, bob, blink, the 12-15 s curious nudge, pointer tilt) run only while the
     tab is visible, the panel is closed and motion is not reduced; the site's motion switch (html[data-motion] /
     html[data-tier="still"]) and the system setting both stop everything and leave the figure still with the "?" shown.
     Nothing here is read by assistive tech (aria-hidden), nothing opens by itself, nothing makes a sound. */
  var BOT = { png: '/assets/chat/robot.png', webp: '/assets/chat/robot.webp', webp2: '/assets/chat/robot@2x.webp' };
  var BOT_KEY = 'pp:robot'; /* sessionStorage "1" once the robot drew: later pages reserve its slot before the file loads */
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var bot = null, botOn = false, faces = [], faceN = 0, bubbleQ = null, crestEl = null;
  function svgEl(tag, attrs, cls) {
    var n = doc.createElementNS(SVG_NS, tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (cls) n.setAttribute('class', cls);
    return n;
  }
  /* the face: a 100 x 100 box laid exactly over the robot image, so the face map's percentages are user units.
     Eyes are a 55 % gold underlay plus a dot pattern (reads as LEDs without strobing); the ^ ^ lids show on hover;
     three dots replace the face while an answer is on its way. The glow is one CSS drop-shadow on the whole svg. */
  function faceSvg(extraCls) {
    var n = ++faceN, pid = 'ppcD' + n;
    var s = svgEl('svg', { viewBox: '0 0 100 100', 'aria-hidden': 'true', focusable: 'false' }, 'ppc-bot__face' + (extraCls ? ' ' + extraCls : ''));
    var defs = svgEl('defs'), pat = svgEl('pattern', { id: pid, patternUnits: 'userSpaceOnUse', width: '1.3', height: '1.3' });
    pat.appendChild(svgEl('circle', { cx: '.65', cy: '.65', r: '.5' })); /* fill: the CSS (var(--gold-light)) */
    defs.appendChild(pat);
    s.appendChild(defs);
    var eyes = svgEl('g', {}, 'ppc-bot__eyes');
    [['l', 34.9, 39.5, 'M28.6 42 Q34.9 34.6 41.2 42'], ['r', 64.9, 39.4, 'M58.6 42 Q64.9 34.6 71.2 42']].forEach(function (e) {
      var g = svgEl('g', {}, 'ppc-bot__eye ppc-bot__eye--' + e[0]);
      g.appendChild(svgEl('ellipse', { cx: e[1], cy: e[2], rx: '6.6', ry: '4.4', opacity: '.55' }, 'ppc-bot__eye-o')); /* fill: the CSS (var(--gold-text)) */
      g.appendChild(svgEl('ellipse', { cx: e[1], cy: e[2], rx: '6.6', ry: '4.4', fill: 'url(#' + pid + ')' }, 'ppc-bot__eye-o'));
      g.appendChild(svgEl('path', { d: e[3] }, 'ppc-bot__eye-h'));
      eyes.appendChild(g);
    });
    s.appendChild(eyes);
    s.appendChild(svgEl('path', { d: 'M40.4 49 Q49.6 56 58.8 49' }, 'ppc-bot__smile'));
    var think = svgEl('g', {}, 'ppc-bot__think');
    [43.6, 49.6, 55.6].forEach(function (x) { think.appendChild(svgEl('circle', { cx: x, cy: '44', r: '1.7' })); });
    s.appendChild(think);
    return s;
  }
  /* the robot picture: webp (1x / 2x) with the png as the fallback; the same drawn / missing guard as figImg */
  function botPic(size, cls, onOk, onFail) {
    var pic = el('picture', 'ppc-bot__pic'), src = el('source'), im = doc.createElement('img'), settled = false;
    src.setAttribute('type', 'image/webp');
    src.setAttribute('srcset', BOT.webp + ' 1x, ' + BOT.webp2 + ' 2x');
    im.className = cls || 'ppc-bot__img';
    im.width = size;
    im.height = size;
    im.alt = '';
    im.setAttribute('decoding', 'async');
    im.setAttribute('loading', 'eager');
    im.setAttribute('fetchpriority', 'low');
    im.draggable = false;
    function ok() {
      if (settled) return;
      if (!(im.naturalWidth > 0)) { fail(); return; }
      settled = true;
      if (onOk) onOk();
    }
    function fail() {
      if (settled) return;
      settled = true;
      if (pic.parentNode) pic.parentNode.removeChild(pic); /* no broken-image glyph, ever */
      if (onFail) onFail();
    }
    on(im, 'load', ok);
    on(im, 'error', fail);
    pic.appendChild(src);
    pic.appendChild(im);
    im.src = BOT.png;
    if (im.complete && im.naturalWidth > 0) ok();
    return pic;
  }
  function buildBot() {
    bot = el('span', 'ppc-bot');
    bot.setAttribute('aria-hidden', 'true');
    var float = el('span', 'ppc-bot__float'), tilt = el('span', 'ppc-bot__tilt');
    var face = faceSvg(), bubble = el('span', 'ppc-bot__bubble');
    bubbleQ = el('span', 'ppc-bot__bubble-q', '?');
    bubble.appendChild(bubbleQ);
    bubble.appendChild(el('span', 'ppc-bot__bubble-a', 'Ask me'));
    bubble.appendChild(el('span', 'ppc-bot__tail'));
    tilt.appendChild(botPic(96, 'ppc-bot__img', function () {
      botOn = true;
      ssSet(BOT_KEY, '1');
      launcher.classList.add('has-robot');
      html.classList.add('ppc-robot');
      faces.push(face);
      botStart();
      if (heroRemeasure) heroRemeasure(); /* the head and bubble now stand above the pill: the hero's Pause button must clear them */
    }, function () {
      /* the file is missing or blocked: the v3 crest layout of the pill comes back and nothing else changes */
      botOn = false;
      ssDel(BOT_KEY);
      launcher.classList.remove('has-robot');
      html.classList.remove('ppc-robot');
      if (bot && bot.parentNode) bot.parentNode.removeChild(bot);
      bot = null;
      bubbleQ = null;
      /* the crest's figure was skipped while the robot was expected: it is fetched now, so the v3 fallback is complete */
      if (crestEl && !$('.ppc-crest__fig', crestEl)) crestEl.appendChild(figImg(48, 'ppc-crest__fig', function () { launcher.classList.add('has-fig'); }, null));
      if (heroRemeasure) heroRemeasure();
    }));
    tilt.appendChild(face);
    tilt.appendChild(el('span', 'ppc-bot__sheen'));
    tilt.appendChild(el('span', 'ppc-bot__hit')); /* the head's hit disc: the only part of the slot above the pill that takes the pointer */
    tilt.appendChild(bubble);
    float.appendChild(tilt);
    bot.appendChild(el('span', 'ppc-bot__shadow'));
    bot.appendChild(float);
    /* a page later in the session: the slot is reserved at build, so the pill never jumps when the file arrives */
    if (ssGet(BOT_KEY) === '1') { launcher.classList.add('has-robot'); html.classList.add('ppc-robot'); }
    launcher.insertBefore(bot, launcher.firstChild);
  }
  /* timers and pointer tracking */
  var blinkT = 0, nudgeT = 0, curiousT = 0, botRaf = 0, nudges = 0, tracking = false, fine = false, px = 0, py = 0;
  try { fine = win.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) { fine = false; }
  function botActive() { return botOn && !reduced() && doc.visibilityState === 'visible' && !(panel && !panel.hidden); }
  function blinkOnce() {
    faces.forEach(function (f) { f.classList.add('is-blink'); });
    win.setTimeout(function () { faces.forEach(function (f) { f.classList.remove('is-blink'); }); }, 200);
  }
  function blink() {
    if (!botActive()) return;
    blinkOnce();
    if (Math.random() < 0.25) win.setTimeout(function () { if (botActive()) blinkOnce(); }, 260); /* a double blink now and then */
    scheduleBlink();
  }
  function scheduleBlink() { win.clearTimeout(blinkT); blinkT = win.setTimeout(blink, 2500 + Math.random() * 3000); } /* 2.5-5.5 s */
  /* the curious moment: the bubble nudges, one eye widens, the head tilts; every third time the bubble says "…" */
  function nudge() {
    if (!bot || !launcher) return;
    nudges++;
    if (bubbleQ) bubbleQ.textContent = (nudges % 3 === 0) ? '…' : '?';
    launcher.classList.remove('is-curious');
    void launcher.offsetWidth; /* restart the one-shot nudge animation */
    launcher.classList.add('is-curious');
    win.clearTimeout(curiousT);
    curiousT = win.setTimeout(function () { launcher.classList.remove('is-curious'); }, 1400);
    scheduleNudge();
  }
  function scheduleNudge() { win.clearTimeout(nudgeT); nudgeT = win.setTimeout(function () { if (botActive()) nudge(); }, 12000 + Math.random() * 3000); } /* 12-15 s */
  function onMove(e) { px = e.clientX; py = e.clientY; if (!botRaf) botRaf = win.requestAnimationFrame(look); } /* one frame per burst of moves */
  function look() {
    botRaf = 0;
    if (!bot) return;
    var r = bot.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * 0.45;
    var dx = px - cx, dy = py - cy, R = 320, dist = Math.sqrt(dx * dx + dy * dy);
    var fx = Math.max(-1, Math.min(1, dx / R)), fy = Math.max(-1, Math.min(1, dy / R));
    var fade = dist <= R ? 1 : Math.max(0, 1 - (dist - R) / 160); /* beyond 320 px it relaxes back to centre over the next 160 px */
    bot.style.setProperty('--ry', (fx * 8 * fade).toFixed(2) + 'deg');
    bot.style.setProperty('--rx', (-fy * 8 * fade).toFixed(2) + 'deg');
    bot.style.setProperty('--ex', (fx * 1.6 * fade).toFixed(2));
    bot.style.setProperty('--ey', (fy * 1.2 * fade).toFixed(2));
    bot.style.setProperty('--sx', (-fx * 3 * fade).toFixed(2) + 'px');
  }
  function relax() {
    if (!bot) return;
    bot.style.setProperty('--rx', '0deg');
    bot.style.setProperty('--ry', '0deg');
    bot.style.setProperty('--ex', '0');
    bot.style.setProperty('--ey', '0');
    bot.style.setProperty('--sx', '0px');
  }
  function botStart() {
    if (!bot || !launcher) return;
    if (!botActive()) { launcher.classList.add('is-still'); return; }
    launcher.classList.remove('is-still');
    scheduleBlink();
    scheduleNudge();
    if (fine && !tracking) {
      tracking = true;
      on(doc, 'pointermove', onMove, { passive: true });
      on(doc, 'pointerleave', relax);
    }
  }
  function botStop() {
    /* review website-content-6: with ?portal=off the script stops before the robot is set up */
    if (!bot || !faces) return;
    win.clearTimeout(blinkT); win.clearTimeout(nudgeT); win.clearTimeout(curiousT);
    blinkT = nudgeT = curiousT = 0;
    if (botRaf) { win.cancelAnimationFrame(botRaf); botRaf = 0; }
    if (tracking) {
      tracking = false;
      doc.removeEventListener('pointermove', onMove);
      doc.removeEventListener('pointerleave', relax);
    }
    if (launcher) { launcher.classList.remove('is-curious'); launcher.classList.add('is-still'); }
    faces.forEach(function (f) { f.classList.remove('is-blink'); });
    relax();
  }
  function botMotionWatch() {
    /* the footer switch writes html[data-motion] with no event, the home's gate writes html[data-tier]: watch both,
       and the system setting too */
    try {
      if (win.MutationObserver) new win.MutationObserver(function () { if (reduced()) botStop(); else botStart(); })
        .observe(html, { attributes: true, attributeFilter: ['data-motion', 'data-tier'] });
    } catch (e) { /* no observer: the CSS stills the figure anyway */ }
    try {
      var mq = win.matchMedia('(prefers-reduced-motion: reduce)');
      var onMq = function () { if (reduced()) botStop(); else botStart(); };
      if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
    } catch (e) { /* no matchMedia */ }
  }
  function buildLauncher() {
    launcher = el('button', 'ppc-launch');
    launcher.type = 'button';
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'ppc');
    buildBot(); /* the robot slot comes first in the DOM; the crest below is its fallback */
    var crest = crestEl = el('span', 'ppc-crest');
    crest.setAttribute('aria-hidden', 'true');
    var ring = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ring.setAttribute('class', 'ppc-crest__ring');
    ring.setAttribute('viewBox', '0 0 44 44');
    ring.setAttribute('width', '44');
    ring.setAttribute('height', '44');
    ring.setAttribute('focusable', 'false');
    circleSvg(ring, '20.5', 'var(--gold)', '1.5');
    circleSvg(ring, '16.5', 'var(--gold-light)', '.75', '.7');
    crest.appendChild(el('span', 'ppc-crest__halo')); /* the gold breathing light behind the figure */
    crest.appendChild(ring);
    crest.appendChild(el('span', 'ppc-crest__mono', 'P'));
    /* the figure: shown (and the monogram hidden) only once the file has really drawn. When the robot is expected
       (drawn already, or its slot reserved from an earlier page) the crest stays faded out, so its file is not fetched;
       buildBot's failure path appends it then. */
    if (!(botOn || ssGet(BOT_KEY) === '1')) crest.appendChild(figImg(48, 'ppc-crest__fig', function () { launcher.classList.add('has-fig'); }, null));
    crest.appendChild(el('span', 'ppc-crest__visor')); /* the visor light, lit only with the figure */
    crest.appendChild(el('span', 'ppc-crest__lamp'));
    launcher.appendChild(crest);
    var text = el('span', 'ppc-launch__text');
    titleEl = el('span', 'ppc-launch__title', TITLE_IDLE);
    titleShort = el('span', 'ppc-launch__title ppc-launch__title--short', TITLE_SHORT);
    statusEl = el('span', 'ppc-launch__status', STATUS_IDLE);
    text.appendChild(titleEl);
    text.appendChild(titleShort);
    text.appendChild(statusEl);
    launcher.appendChild(text);
    /* while the first-visit notice collapses the pill to its crest, the hidden text is read from this label instead */
    if (notice) launcher.setAttribute('aria-label', 'Ask the Admissions Desk, AI assistant');
    on(launcher, 'click', function () { if (panel && !panel.hidden) closeChat(); else openChat(); });
    on(launcher, 'animationend', function (e) { if (e.animationName === 'ppc-ringpulse') launcher.classList.remove('is-pulse'); });
    doc.body.appendChild(launcher);
  }
  function launcherText(title, short, status) {
    if (titleEl) titleEl.textContent = title;
    if (titleShort) titleShort.textContent = short;
    if (statusEl) statusEl.textContent = status;
  }

  /* the teaser: a small card above the launcher with three real questions for this page. It comes once the visitor
     has read for 12 s or scrolled past 60 %, never at load, at most twice per session (never twice on the same page),
     never again once dismissed or once the chat has been opened, and it leaves by itself after 20 s. */
  var TEASE_KEY = 'pp:tease';
  var tease = null, teaseHide = 0;
  var TEASES = [
    [/^\/$/, 'Thinking about admission? Ask me the steps, the curriculum and how to visit.', ['How do I apply?', 'What curriculum do you follow?', 'Can I visit the school?']],
    [/^\/admissions(\/|\.html$|$)/, 'Applying this year? Ask me the steps, the test and how to visit.', ['How do I apply?', 'Is there an admission test?', 'Can I visit the school?']],
    [/^\/(learning|academics)(\/|\.html$|$)/, 'Cambridge pathway, O and A Levels: ask me about any class.', ['What curriculum do you follow?', 'What is the parent portal?', 'How do I apply?']],
    [/^\/(school-life|student-life|campus)(\/|\.html$|$)/, 'Timings, uniform, buses and clubs: ask me anything.', ['What time does school start and finish?', 'Is there a school bus?', 'What sports can children play?']],
    [/^\/contact(\/|\.html$|$)/, 'Prefer to ask first? I answer in seconds.', ['Can I visit the school?', 'Which number do I call?', 'How do I send an enquiry?']]
  ];
  function teaseRead() {
    var t = json(TEASE_KEY);
    if (!t || typeof t !== 'object') return { n: 0, d: 0, p: '' };
    return { n: parseInt(t.n, 10) || 0, d: t.d ? 1 : 0, p: typeof t.p === 'string' ? t.p : '' };
  }
  function teaseWrite(t) { ssSet(TEASE_KEY, JSON.stringify(t)); }
  /* opening the chat ends the teasers for this session */
  function teaseStop() { var t = teaseRead(); if (!t.d) { t.d = 1; teaseWrite(t); } }
  function deskTeaser() {
    if (!launcher) return;
    var t = teaseRead();
    /* with storage blocked the caps cannot be kept, so the card never shows */
    try { win.sessionStorage.setItem(TEASE_KEY + '-ok', '1'); } catch (e) { return; }
    if (t.d === 1 || t.n >= 2 || t.p === PATH || state.messages.length > 0) return;
    var pick = null;
    for (var i = 0; i < TEASES.length; i++) if (TEASES[i][0].test(PATH)) { pick = TEASES[i]; break; }
    if (!pick) return;
    var timer = win.setTimeout(tryShow, 12000), raf = 0, tries = 0, done = false;
    function check() {
      raf = 0;
      var sh = html.scrollHeight || 1, y = win.pageYOffset || html.scrollTop || 0;
      if ((y + (win.innerHeight || html.clientHeight)) / sh >= 0.6) tryShow();
    }
    function onScroll() { if (!raf) raf = win.requestAnimationFrame ? win.requestAnimationFrame(check) : win.setTimeout(check, 16); }
    on(win, 'scroll', onScroll, { passive: true });
    function blocked() {
      return html.classList.contains('ppc-open') || html.classList.contains('menu-open') || html.classList.contains('lightbox-open')
        || doc.visibilityState !== 'visible' || ((win.innerWidth || 1024) < 700 && !!notice)
        || (win.innerHeight || html.clientHeight || 768) < 520; /* too short for the card above the robot (phones in landscape) */
    }
    function tryShow() {
      if (done) return;
      done = true;
      win.clearTimeout(timer);
      win.removeEventListener('scroll', onScroll);
      attempt();
    }
    function attempt() {
      if (teaseRead().d === 1 || tease) return;
      if (blocked()) { if (++tries >= 8) return; win.setTimeout(attempt, 2000); return; }
      showTease(pick, t);
    }
  }
  function showTease(pick, t) {
    tease = el('div', 'ppc-tease');
    tease.setAttribute('role', 'region');
    tease.setAttribute('aria-label', 'Suggested questions for the Admissions Desk');
    /* the medallion rises above the card's top edge; the text sits to its right, the chips use the full width */
    tease.appendChild(medallion('ppc-tease__fig', 72));
    var body = el('div', 'ppc-tease__body');
    body.appendChild(el('p', 'ppc-tease__eyebrow', 'Admissions Desk · AI assistant'));
    body.appendChild(el('p', 'ppc-tease__q', pick[1]));
    body.appendChild(el('p', 'ppc-tease__trust', 'Answers come from the school’s published pages. Not a person.'));
    tease.appendChild(body);
    var chips = el('div', 'ppc-tease__chips');
    chips.setAttribute('role', 'group');
    chips.setAttribute('aria-label', 'Ask one of these');
    pick[2].forEach(function (q) {
      var b = el('button', 'ppc__chip ppc-tease__chip', q);
      b.type = 'button';
      on(b, 'click', function () {
        if (waiting) return;
        hideTease(true);
        openChat();
        ask(q);
        track({ t: 'tease_chip', path: PATH });
      });
      chips.appendChild(b);
    });
    tease.appendChild(chips);
    var foot = el('div', 'ppc-tease__foot');
    var later = el('button', 'ppc-tease__later', 'Not now');
    later.type = 'button';
    on(later, 'click', function () { hideTease(true); track({ t: 'tease_dismiss' }); });
    foot.appendChild(later);
    tease.appendChild(foot);
    var close = el('button', 'ppc-tease__close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Dismiss suggested questions');
    close.appendChild(svg(ICON_CLOSE, 18));
    on(close, 'click', function () { hideTease(true); track({ t: 'tease_dismiss' }); });
    tease.appendChild(close);
    on(tease, 'keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); e.stopPropagation(); hideTease(true); track({ t: 'tease_dismiss' }); }
    });
    doc.body.appendChild(tease);
    var node = tease;
    if (reduced()) node.classList.add('is-in');
    else {
      win.requestAnimationFrame(function () { win.requestAnimationFrame(function () { node.classList.add('is-in'); }); });
      launcher.classList.add('is-pulse');
      if (botActive()) nudge(); /* the robot looks curious as the card lands; the 12-15 s cycle re-arms from here */
    }
    teaseWrite({ n: t.n + 1, d: 0, p: PATH });
    track({ t: 'tease_show', path: PATH });
    /* the card leaves by itself after 20 s, but never while the visitor is reading it: a pointer resting on it or
       focus inside it holds the timer (WCAG 2.2.1); it restarts once they move on. Dismissing is always theirs. */
    function arm() { if (teaseHide) win.clearTimeout(teaseHide); teaseHide = win.setTimeout(function () { hideTease(false); }, 20000); }
    function hold() { if (teaseHide) { win.clearTimeout(teaseHide); teaseHide = 0; } }
    on(node, 'mouseenter', hold);
    on(node, 'focusin', hold);
    on(node, 'mouseleave', function () { if (tease === node && !node.contains(doc.activeElement)) arm(); });
    on(node, 'focusout', function (e) { if (tease === node && !(e.relatedTarget && node.contains(e.relatedTarget)) && !(node.matches && node.matches(':hover'))) arm(); });
    arm();
  }
  function hideTease(dismiss) {
    if (teaseHide) { win.clearTimeout(teaseHide); teaseHide = 0; }
    if (dismiss) { var t = teaseRead(); teaseWrite({ n: t.n, d: 1, p: t.p || PATH }); }
    if (!tease) return;
    var node = tease;
    tease = null;
    var had = node.contains(doc.activeElement);
    faces = faces.filter(function (f) { return !node.contains(f) && html.contains(f); }); /* the card's robot face stops blinking with the rest */
    node.classList.remove('is-in');
    var drop = function () { if (node.parentNode) node.parentNode.removeChild(node); };
    if (reduced()) drop(); else win.setTimeout(drop, 240);
    if (had && launcher) launcher.focus();
  }
  function buildPanel() {
    panel = el('section', 'ppc');
    panel.id = 'ppc';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.setAttribute('aria-labelledby', 'ppc-title');
    panel.setAttribute('data-lenis-prevent', '');
    var head = el('header', 'ppc__head');
    head.appendChild(medallion('ppc__fig', 36, true)); /* decoration only, eyes still; the h2 below labels the dialog */
    var hText = el('div', 'ppc__htext');
    var title = el('h2', 'ppc__title', 'Admissions Desk');
    title.id = 'ppc-title';
    title.tabIndex = -1;
    hText.appendChild(title);
    hText.appendChild(el('p', 'ppc__sub', 'An AI assistant, not a person. Answers come from the school’s published pages. Admissions staff may read this conversation, kept for 30 days. A person at the school decides every admission.'));
    var close = el('button', 'ppc__close');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close the Admissions Desk');
    close.appendChild(svg(ICON_CLOSE, 20));
    on(close, 'click', closeChat);
    head.appendChild(hText);
    head.appendChild(close);

    log = el('ol', 'ppc__log');
    log.setAttribute('role', 'log');
    log.setAttribute('aria-live', 'polite');
    log.setAttribute('aria-label', 'Conversation');
    log.tabIndex = 0;

    var formEl = el('form', 'ppc__form');
    formEl.setAttribute('novalidate', '');
    var lab = el('label', 'ppc__label', 'Your question');
    lab.htmlFor = 'ppc-input';
    var row = el('div', 'ppc__row');
    input = el('input', 'ppc__input');
    input.id = 'ppc-input';
    input.type = 'text';
    input.maxLength = 500;
    input.autocomplete = 'off';
    input.setAttribute('enterkeyhint', 'send');
    input.setAttribute('aria-describedby', 'ppc-hint');
    sendBtn = el('button', 'ppc__send', 'Ask');
    sendBtn.type = 'submit';
    row.appendChild(input);
    row.appendChild(sendBtn);
    var foot = el('div', 'ppc__foot');
    var hint = el('p', 'ppc__hint', 'Please do not type your child’s full name, ID numbers, address or health details.');
    hint.id = 'ppc-hint';
    var person = el('button', 'ppc__person', 'Talk to a person');
    person.type = 'button';
    on(person, 'click', function () { openHandoff(); });
    foot.appendChild(hint);
    foot.appendChild(person);
    formEl.appendChild(lab);
    formEl.appendChild(row);
    formEl.appendChild(foot);
    on(formEl, 'submit', function (e) {
      e.preventDefault();
      var q = (input.value || '').trim();
      if (!q || waiting) return;
      input.value = '';
      ask(q);
    });

    panel.appendChild(head);
    panel.appendChild(log);
    panel.appendChild(formEl);
    on(panel, 'keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); closeChat(); return; }
      /* Tab wraps inside the helper at every width, so the chips above the input are reached with Tab too (review correctness-6) */
      if (e.key === 'Tab') trapTab(e);
    });
    /* Esc closes the helper even when focus has gone back to the launcher or the page */
    on(doc, 'keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && panel && !panel.hidden && !panel.contains(doc.activeElement)) {
        var a = doc.activeElement;
        if (!a || a === doc.body || a === launcher || !(a.closest && a.closest('input, select, textarea, dialog'))) { e.preventDefault(); closeChat(); }
      }
    });
    doc.body.appendChild(panel);
    renderAll();
  }
  function isSheet() { return (win.innerWidth || 1024) < 480; }
  function trapTab(e) {
    var items = $$('a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]', panel)
      .filter(function (n) { return n.offsetParent !== null || n === doc.activeElement; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  var openedOnce = false;
  function openChat() {
    if (!panel) buildPanel();
    hideNotice();
    hideTease(true);
    teaseStop();
    panel.hidden = false;
    html.classList.add('ppc-open');
    botStop(); /* the robot sits down into the pill (CSS on html.ppc-open) and its loops stop */
    launcher.setAttribute('aria-expanded', 'true');
    launcherText('Close the Admissions Desk', 'Close', 'Open · Esc closes');
    scrollLog();
    var coarse = false;
    try { coarse = win.matchMedia('(pointer: coarse)').matches; } catch (e) { coarse = false; }
    (coarse ? $('#ppc-title') : input).focus();
    if (!openedOnce) { openedOnce = true; track({ t: 'chat_open', path: PATH }); }
  }
  function closeChat() {
    if (!panel) return;
    panel.hidden = true;
    html.classList.remove('ppc-open');
    botStart();
    launcher.setAttribute('aria-expanded', 'false');
    launcherText(TITLE_IDLE, TITLE_SHORT, waiting ? 'Writing your answer…' : STATUS_IDLE);
    launcher.focus();
  }
  function scrollLog() { if (log) log.scrollTop = log.scrollHeight; }

  function renderAll() {
    log.textContent = '';
    renderMsg(FIRST, state.messages.length === 0);
    state.messages.forEach(function (m, i) { renderMsg(m, i === state.messages.length - 1); });
    scrollLog();
  }
  function clearChips() { $$('.ppc__chips', log).forEach(function (c) { c.parentNode.removeChild(c); }); }
  function safeTel(t) { return typeof t === 'string' && /^\+?\d{6,15}$/.test(t); }
  function renderMsg(m, isLast) {
    var li = el('li', 'ppc__msg ppc__msg--' + (m.from === 'me' ? 'me' : 'bot'));
    var who = el('span', 'visually-hidden', m.from === 'me' ? 'You: ' : 'Helper: ');
    if (m.code) {
      li.classList.add('ppc__msg--code');
      showCode(li, m.codeKind || 'enquiry', m.code, { focus: false, classRaw: m.classRaw || '' });
      log.appendChild(li);
      return li;
    }
    var p = el('p', 'ppc__text');
    p.appendChild(who);
    p.appendChild(doc.createTextNode(String(m.text || '')));
    li.appendChild(p);
    if (m.offline) li.appendChild(linesList('pp-lines ppc__lines'));
    var acts = Array.isArray(m.actions) ? m.actions : [];
    if (acts.length) {
      var row = el('div', 'ppc__acts');
      acts.slice(0, 4).forEach(function (a) {
        if (!a || typeof a.label !== 'string') return;
        var n = null;
        if ((a.type === 'link' || a.type === 'form') && siteHref(a.href)) {
          n = el('a', 'ppc__act' + (a.type === 'form' ? ' ppc__act--form' : ''), a.label);
          n.href = siteHref(a.href);
          n.setAttribute('data-portal-cta', clip('Question helper: ' + a.label, 60));
        } else if (a.type === 'call' && safeTel(a.tel)) {
          n = el('a', 'ppc__act ppc__act--call', a.label);
          n.href = 'tel:' + a.tel;
          n.setAttribute('data-portal-cta', clip('Question helper: ' + a.label, 60));
        } else if (a.type === 'handoff') {
          n = el('button', 'ppc__act ppc__act--handoff', a.label);
          n.type = 'button';
          on(n, 'click', function () { openHandoff(); });
        }
        if (n) row.appendChild(n);
      });
      if (row.childNodes.length) li.appendChild(row);
    }
    var srcs = Array.isArray(m.sources) ? m.sources : [];
    srcs.slice(0, 3).forEach(function (s) {
      if (!s || typeof s.label !== 'string' || !siteHref(s.href)) return;
      var sp = el('p', 'ppc__src', 'From: ');
      var a = el('a', 'link', s.label);
      a.href = siteHref(s.href);
      sp.appendChild(a);
      li.appendChild(sp);
    });
    if (isLast && Array.isArray(m.chips) && m.chips.length) li.appendChild(chipRow(m.chips));
    log.appendChild(li);
    return li;
  }
  function chipRow(chips) {
    var row = el('div', 'ppc__chips');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', 'Suggested questions');
    chips.slice(0, 4).forEach(function (c) {
      if (typeof c !== 'string' || !c.trim()) return;
      var b = el('button', 'ppc__chip', c);
      b.type = 'button';
      on(b, 'click', function () { if (!waiting) ask(c); });
      row.appendChild(b);
    });
    return row;
  }
  function push(m) {
    clearChips();
    state.messages.push(m);
    saveState();
    renderMsg(m, true);
    scrollLog();
  }
  function showTyping(onNow) {
    if (launcher) launcher.classList.toggle('is-thinking', !!onNow);
    /* the launcher's status line follows the request; while the panel is open it says so instead */
    if (statusEl) {
      var open = panel && !panel.hidden;
      statusEl.textContent = onNow ? 'Writing your answer…' : (open ? 'Open · Esc closes' : STATUS_IDLE);
    }
    if (onNow) {
      typing = el('li', 'ppc__typing');
      typing.setAttribute('aria-hidden', 'true');
      if (reduced()) typing.appendChild(el('span', 'ppc__typing-text', 'AI assistant is writing'));
      else for (var i = 0; i < 3; i++) typing.appendChild(el('span', 'ppc__dot'));
      log.appendChild(typing);
      scrollLog();
    } else if (typing && typing.parentNode) {
      typing.parentNode.removeChild(typing);
      typing = null;
    }
  }
  function busyChat(onNow) {
    waiting = onNow;
    if (sendBtn) sendBtn.disabled = onNow;
  }
  function wait(ms) { return new Promise(function (r) { win.setTimeout(r, ms); }); }
  function ask(q) {
    q = String(q).slice(0, 500);
    push({ from: 'me', text: q });
    busyChat(true);
    showTyping(true);
    var minWait = wait(400 + Math.floor(Math.random() * 500));
    var req = post('/api/portal/chat', {
      v: 1, visitorCode: counting ? vid : null, sessionId: counting ? sessionId() : null, chatCode: state.chatCode,
      chatKey: state.chatKey || null, page: PATH, message: q, context: state.context, hp: ''
    });
    Promise.all([req, minWait]).then(function (both) {
      var r = both[0], d = r.data || {};
      showTyping(false);
      busyChat(false);
      if (r.status === 200 && d.ok && d.reply && typeof d.reply.text === 'string') {
        markUp();
        if (typeof d.chatCode === 'string' && CODE_RE.test(d.chatCode)) {
          if (d.chatCode !== state.chatCode) state.chatKey = null;
          state.chatCode = d.chatCode;
        }
        if (typeof d.chatKey === 'string' && KEY_RE.test(d.chatKey)) state.chatKey = d.chatKey;
        var rep = d.reply;
        state.context = rep.context && typeof rep.context === 'object' ? rep.context : state.context;
        if (rep.answered === false && rep.kind !== 'care') state.lastUnanswered = q;
        push({ from: 'bot', kind: rep.kind, text: rep.text, actions: rep.actions, sources: rep.sources, chips: rep.chips });
      } else if (r.status === 429) {
        push({ from: 'bot', kind: 'busy', text: 'That was a lot of questions in a short time. Please wait a minute and ask again, or call the admissions line for your child’s section.', offline: true });
      } else {
        push({ from: 'bot', kind: 'offline', text: 'The question helper is not available right now. Please call the admissions line for your child’s section.', offline: true });
      }
      if (panel && !panel.hidden && panel.contains(doc.activeElement) === false) input.focus();
    });
  }

  /* "Talk to a person": a short enquiry form inside the helper, sent as an enquiry from the chat */
  var handoffEl = null;
  function openHandoff() {
    if (!panel) buildPanel();
    if (handoffEl && handoffEl.parentNode) { var f0 = $('input', handoffEl); if (f0) f0.focus(); return; }
    clearChips();
    var li = el('li', 'ppc__msg ppc__msg--bot ppc__msg--form');
    var f = el('form', 'ppc__hand');
    f.setAttribute('novalidate', '');
    f.setAttribute('aria-labelledby', 'ppc-h-title');
    var h = el('h3', 'ppc__hand-title', 'Send your question to the admissions office');
    h.id = 'ppc-h-title';
    h.tabIndex = -1;
    f.appendChild(h);
    f.appendChild(el('p', 'ppc__hand-note', 'The office reads it and calls you back on the number you give.'));
    function field(id, labelText, type, extra) {
      var w = el('div', 'field ppc__field');
      var l = el('label', null, labelText);
      l.htmlFor = id;
      var i;
      if (type === 'select') {
        i = el('select');
        var o0 = el('option', null, 'Choose a class');
        o0.value = '';
        i.appendChild(o0);
        CLASSES.forEach(function (c) { i.appendChild(el('option', null, c)); });
      } else if (type === 'textarea') {
        i = el('textarea');
        i.rows = 3;
        i.maxLength = 500;
      } else {
        i = el('input');
        i.type = type;
      }
      i.id = id;
      i.required = !(extra && extra.optional);
      if (extra && extra.auto) i.autocomplete = extra.auto;
      if (extra && extra.max) i.maxLength = extra.max;
      if (type === 'tel') i.inputMode = 'tel';
      var described = [];
      w.appendChild(l);
      w.appendChild(i);
      if (extra && extra.hint) {
        var hh = el('p', 'field__hint ppc__fhint', extra.hint);
        hh.id = id + '-hint';
        described.push(hh.id);
        w.appendChild(hh);
      }
      var err = el('p', 'field__error');
      err.id = id + '-err';
      err.setAttribute('aria-live', 'polite');
      described.push(err.id);
      i.setAttribute('aria-describedby', described.join(' '));
      w.appendChild(err);
      on(i, 'input', function () { err.textContent = ''; i.removeAttribute('aria-invalid'); });
      f.appendChild(w);
      return i;
    }
    var iName = field('ppc-h-name', 'Parent’s name', 'text', { auto: 'name', max: 80 });
    var iPhone = field('ppc-h-phone', 'Phone', 'tel', { auto: 'tel', max: 20 });
    var iChild = field('ppc-h-child', 'Child’s first name', 'text', { auto: 'off', max: 40, hint: 'First name only' });
    var iClass = field('ppc-h-class', 'Class', 'select');
    var iMsg = field('ppc-h-msg', 'Your question', 'textarea');
    iMsg.value = state.lastUnanswered || '';
    var fs = el('fieldset', 'ppc__consent');
    fs.appendChild(el('legend', null, 'The school may also reach me on (optional)'));
    function tick(id, text, required) {
      var w = el('div', 'field ppc__field');
      var l = el('label', 'ppc__check');
      var b = el('input');
      b.type = 'checkbox'; b.id = id; if (required) b.required = true;
      l.appendChild(b);
      l.appendChild(doc.createTextNode(' ' + text));
      w.appendChild(l);
      var er = el('p', 'field__error');
      er.id = id + '-err';
      er.setAttribute('aria-live', 'polite');
      b.setAttribute('aria-describedby', er.id);
      w.appendChild(er);
      on(b, 'change', function () { er.textContent = ''; b.removeAttribute('aria-invalid'); });
      return { wrap: w, box: b };
    }
    [['whatsapp', 'WhatsApp'], ['sms', 'SMS'], ['email', 'Email']].forEach(function (c) {
      var l = el('label', 'ppc__check');
      var b = el('input');
      b.type = 'checkbox'; b.name = 'ppc-consent'; b.value = c[0];
      l.appendChild(b);
      l.appendChild(doc.createTextNode(' ' + c[1]));
      fs.appendChild(l);
    });
    f.appendChild(fs);
    var tGuard = tick('ppc-h-guardian', 'I am the child’s parent or guardian', true);
    f.appendChild(tGuard.wrap);
    var tJoin = counting ? tick('ppc-h-join', 'Join my earlier visits on this site to this question, so the office can see which pages I read (optional)', false) : null;
    if (tJoin) f.appendChild(tJoin.wrap);
    var pnote = el('p', 'ppc__hand-note', 'The school uses these details only to answer you. ');
    var pl = el('a', 'link', 'Privacy');
    pl.href = siteHref('/privacy/#c-forms');
    pnote.appendChild(pl);
    f.appendChild(pnote);
    honeypot(f, 'ppc-h');
    var status = el('div', 'ppc__hand-status');
    status.setAttribute('role', 'status');
    var row = el('div', 'ppc__hand-row');
    var go = el('button', 'btn btn--primary btn--small ppc__hand-send');
    go.type = 'submit';
    go.appendChild(el('span', 'btn__label', 'Send to the admissions office'));
    var cancel = el('button', 'ppc__hand-cancel', 'Cancel');
    cancel.type = 'button';
    row.appendChild(go);
    row.appendChild(cancel);
    f.appendChild(row);
    f.appendChild(status);
    var touched = 0;
    on(f, 'input', function () { if (!touched) touched = Date.now(); });
    /* while the short form is open, the helper's own question box steps aside: one question field, one send button (review ux-6) */
    var mainForm = $('.ppc__form', panel);
    function restoreMain() { if (mainForm) { mainForm.hidden = false; mainForm.removeAttribute('inert'); } }
    if (mainForm) { mainForm.hidden = true; mainForm.setAttribute('inert', ''); }
    on(cancel, 'click', function () {
      li.parentNode.removeChild(li);
      handoffEl = null;
      restoreMain();
      input.focus();
    });
    var sending = false;
    on(f, 'submit', function (e) {
      e.preventDefault();
      if (sending) return;
      status.textContent = '';
      var first = null;
      function bad(i, msg) { var er = doc.getElementById(i.id + '-err'); if (er) er.textContent = msg; i.setAttribute('aria-invalid', 'true'); if (!first) first = i; }
      if (iName.value.trim().length < 2) bad(iName, 'Enter your name.');
      if (!bdMobile(iPhone.value)) bad(iPhone, MSG_MOBILE);
      if (!iChild.value.trim()) bad(iChild, 'Enter your child’s first name.');
      if (!iClass.value) bad(iClass, 'Choose a class.');
      if (!iMsg.value.trim()) bad(iMsg, 'Enter your question.');
      if (!tGuard.box.checked) bad(tGuard.box, 'Tick this box to send the question.');
      if (first) { first.focus(); return; }
      var join = !!(tJoin && tJoin.box.checked) && counting;
      sending = true;
      go.disabled = true;
      $('.btn__label', go).textContent = 'Sending...';
      var hp = $('input[name="pp_website"]', f);
      post('/api/portal/enquiry', {
        v: 1, visitorCode: join ? vid : null, sessionId: join ? sessionId() : null, page: PATH, guardian: true, joinVisits: join,
        elapsedMs: Date.now() - (touched || LOADED_AT), hp: hp ? hp.value : '',
        guardianName: iName.value.trim(), phone: iPhone.value.trim(), email: '', childFirstName: iChild.value.trim(),
        classRaw: iClass.value, message: iMsg.value.trim(), consent: consentOf(f, 'ppc-consent'), source: 'chat',
        chatCode: state.chatCode, chatKey: state.chatKey || null
      }).then(function (r) {
        sending = false;
        go.disabled = false;
        $('.btn__label', go).textContent = 'Send to the admissions office';
        var d = r.data || {};
        if ((r.status === 201 || r.status === 200) && d.ok && typeof d.code === 'string' && CODE_RE.test(d.code)) {
          markUp();
          rememberCode('enquiry', d.code);
          track({ t: 'form_submit', path: PATH, form: 'enquiry' });
          var classRaw = iClass.value;
          li.parentNode.removeChild(li);
          handoffEl = null;
          restoreMain();
          state.lastUnanswered = null;
          var m = { from: 'bot', code: d.code, codeKind: 'enquiry', classRaw: classRaw };
          state.messages.push(m);
          saveState();
          var node = renderMsg(m, true);
          scrollLog();
          var hh = $('.pp-code__h', node);
          if (hh) hh.focus();
          return;
        }
        if (r.status === 400 && d.fields) {
          var map = { guardianName: iName, phone: iPhone, childFirstName: iChild, classRaw: iClass, message: iMsg, guardian: tGuard.box };
          Object.keys(d.fields).forEach(function (k) { if (map[k]) bad(map[k], String(d.fields[k] || 'Check this answer.')); });
          if (first) { first.focus(); return; }
        }
        status.textContent = '';
        status.appendChild(el('p', 'ppc__hand-fail', 'We could not send this online. Please call the admissions line for your child’s section.'));
        status.appendChild(linesList('pp-lines ppc__lines'));
      });
    });
    li.appendChild(f);
    log.appendChild(li);
    handoffEl = li;
    if (panel.hidden) openChat();
    li.scrollIntoView ? li.scrollIntoView({ block: 'start' }) : scrollLog();
    h.focus();
  }

  /* ------------------------------------------------------------------ page wiring (last: a deferred script runs while
     the document is "interactive", so ready() may call this at once; every variable above must be set first) */
  ready(function () {
    $$('[data-portal-only]').forEach(function (n) { n.hidden = false; });
    var afJoin = $('[data-admission-form] .af__join');
    if (afJoin) afJoin.hidden = !counting;
    if (counting) { vid = loadVisitor(true); startPageview(); }
    api.counting = counting;
    measureActions();
    measureHeroPause();
    renderVisitLine();
    showNotice();
    wirePageForm();
    watchForm('application', $('[data-admission-form] .af__form'));
    if (CHAT_ON) {
      buildLauncher();
      if (heroRemeasure) heroRemeasure(); /* the first measurement above ran before the pill existed: take its real size now */
      botMotionWatch();
      /* founder 2026-10-23: only the robot figure shows, no teaser card. deskTeaser() is kept for later use. */
    }
  });
})();
