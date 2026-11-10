/* Accessibility button + panel (founder, 2026-11-03). Vanilla: the hand-built home loads it without inner.js.
   Settings live in localStorage pp:a11y = {size:0|1|2, contrast, font, spacing, links, guide};
   "Stop animations" uses the site's shared pp:motion key and html[data-motion="reduced"]. Styles: additions/a11y.css. */
(function () {
  if (window.__ppA11y) return;
  window.__ppA11y = true;

  var html = document.documentElement;
  var KEY = 'pp:a11y';
  var FLAGS = ['contrast', 'font', 'spacing', 'links', 'guide'];
  var state = { size: 0 };

  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY) || '{}'); if (s && typeof s === 'object') state = s; } catch (e) { /* private window */ }
    if (!(state.size >= 0 && state.size <= 2)) state.size = 0;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function motionReduced() { return html.getAttribute('data-motion') === 'reduced'; }

  function apply() {
    html.classList.toggle('a11y-size-1', state.size === 1);
    html.classList.toggle('a11y-size-2', state.size === 2);
    FLAGS.forEach(function (f) { if (f !== 'guide') html.classList.toggle('a11y-' + f, !!state[f]); });
    if (guide) guide.hidden = !state.guide;
    if (btn) btn.classList.toggle('is-on', state.size > 0 || FLAGS.some(function (f) { return state[f]; }) || motionReduced());
  }

  load();
  apply();   // before the page paints the panel, so a returning visitor sees their settings at once

  var ICON = {
    person: '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
      '<circle cx="16" cy="8.6" r="2.4" fill="currentColor"/>' +
      '<path d="M8.2 12.4c2.6.7 5.2 1 7.8 1s5.2-.3 7.8-1" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M16 13.6v5.2M16 18.8l-3.2 6.4M16 18.8l3.2 6.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    speak: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    stop: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>',
    contrast: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/></svg>',
    font: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 19 9 5h1.5L16 19M5.6 14h8.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.5 12.5v6.5M17.5 14.5c.5-1.3 1.6-2 3-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    spacing: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6h11M9 12h11M9 18h11M4.5 4.5v15M2.8 6.5l1.7-2 1.7 2M2.8 17.5l1.7 2 1.7-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    links: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4 21.5h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    guide: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="2.5" y="9" width="19" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 4.5h14M5 19.5h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".45"/></svg>',
    motion: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 8.5v7M14.5 8.5v7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  var TILES = [
    ['contrast', 'High contrast', ICON.contrast],
    ['font', 'Easy-read font', ICON.font],
    ['spacing', 'Wider spacing', ICON.spacing],
    ['links', 'Show links', ICON.links],
    ['guide', 'Reading guide', ICON.guide],
    ['motion', 'Stop animations', ICON.motion]
  ];

  var btn, panel, guide, readBtn;
  var canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  function build() {
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ppa-btn';
    btn.setAttribute('aria-label', 'Accessibility options');
    btn.setAttribute('title', 'Accessibility options');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'ppa-panel');
    btn.innerHTML = ICON.person;

    panel = document.createElement('div');
    panel.id = 'ppa-panel';
    panel.className = 'ppa-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'ppa-title');
    panel.hidden = true;

    var tiles = TILES.map(function (t) {
      return '<button type="button" class="ppa-tile" data-ppa="' + t[0] + '" aria-pressed="false">' + t[2] + '<span>' + t[1] + '</span></button>';
    }).join('');

    panel.innerHTML =
      '<div class="ppa-head"><h2 id="ppa-title">Accessibility</h2>' +
      '<button type="button" class="ppa-close" aria-label="Close accessibility options">&times;</button></div>' +
      '<div class="ppa-body">' +
        '<div><p class="ppa-label" id="ppa-size-l">Text size</p>' +
        '<div class="ppa-size" role="group" aria-labelledby="ppa-size-l">' +
          '<button type="button" data-size="0" aria-label="Normal text">A</button>' +
          '<button type="button" data-size="1" aria-label="Larger text">A</button>' +
          '<button type="button" data-size="2" aria-label="Largest text">A</button>' +
        '</div></div>' +
        (canSpeak ? '<div><button type="button" class="ppa-read" aria-pressed="false"></button>' +
          '<p class="ppa-hint">Reads this page out loud. Select some text first to hear only that part.</p></div>' : '') +
        '<div class="ppa-grid">' + tiles + '</div>' +
        '<button type="button" class="ppa-reset">Reset all settings</button>' +
      '</div>';

    guide = document.createElement('div');
    guide.className = 'ppa-guide';
    guide.setAttribute('aria-hidden', 'true');
    guide.hidden = true;

    document.body.appendChild(guide);
    document.body.appendChild(panel);
    document.body.appendChild(btn);
    readBtn = panel.querySelector('.ppa-read');
    setReadLabel(false);

    btn.addEventListener('click', function () { toggle(panel.hidden); });
    panel.querySelector('.ppa-close').addEventListener('click', function () { toggle(false); btn.focus(); });
    panel.addEventListener('click', onPanelClick);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) { toggle(false); btn.focus(); }
    });
    document.addEventListener('click', function (e) {
      var path = e.composedPath ? e.composedPath() : [e.target];   // a clicked label may have been replaced already
      if (!panel.hidden && path.indexOf(panel) < 0 && path.indexOf(btn) < 0) toggle(false);
    });
    function moveGuide(y) { guide.style.transform = 'translateY(' + Math.round(y - 28) + 'px)'; }
    document.addEventListener('pointermove', function (e) { if (state.guide) moveGuide(e.clientY); }, { passive: true });
    document.addEventListener('touchmove', function (e) { if (state.guide && e.touches[0]) moveGuide(e.touches[0].clientY); }, { passive: true });

    // the footer's own motion switch stays in step with the tile
    var foot = document.getElementById('motion-toggle');
    if (foot) foot.addEventListener('click', function () { setTimeout(sync, 0); });

    apply();
    sync();
  }

  function toggle(open) {
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    html.classList.toggle('ppa-open', !!open);
    if (open) { sync(); var first = panel.querySelector('.ppa-size button'); if (first) first.focus(); }
  }

  function sync() {
    Array.prototype.forEach.call(panel.querySelectorAll('.ppa-size button'), function (b) {
      b.setAttribute('aria-pressed', String(+b.getAttribute('data-size') === state.size));
    });
    Array.prototype.forEach.call(panel.querySelectorAll('.ppa-tile'), function (b) {
      var k = b.getAttribute('data-ppa');
      b.setAttribute('aria-pressed', String(k === 'motion' ? motionReduced() : !!state[k]));
    });
    apply();
  }

  function setMotion(reduce) {
    try { if (reduce) localStorage.setItem('pp:motion', 'reduced'); else localStorage.removeItem('pp:motion'); } catch (e) { /* ignore */ }
    if (reduce) html.setAttribute('data-motion', 'reduced'); else html.removeAttribute('data-motion');
    var foot = document.getElementById('motion-toggle');
    if (foot) foot.setAttribute('aria-pressed', reduce ? 'true' : 'false');
    if (window.PP && typeof window.PP.revealAll === 'function') {
      if (reduce) window.PP.revealAll();
    } else {
      location.reload();   // the home's scenes read the setting once, at load
    }
  }

  function onPanelClick(e) {
    var t = e.target.closest('button');
    if (!t || !panel.contains(t)) return;
    if (t.hasAttribute('data-size')) {
      state.size = +t.getAttribute('data-size'); save(); sync();
      // let the scroll scenes measure again at the new size
      setTimeout(function () { window.dispatchEvent(new Event('resize')); if (window.ScrollTrigger && window.ScrollTrigger.refresh) window.ScrollTrigger.refresh(); }, 50);
      return;
    }
    if (t.classList.contains('ppa-tile')) {
      var k = t.getAttribute('data-ppa');
      if (k === 'motion') { setMotion(!motionReduced()); sync(); return; }
      state[k] = !state[k]; save(); sync(); return;
    }
    if (t === readBtn) { if (speaking) stopReading(); else startReading(); return; }
    if (t.classList.contains('ppa-reset')) {
      stopReading();
      state = { size: 0 }; save();
      if (motionReduced()) setMotion(false);
      sync();
    }
  }

  /* ---- read aloud (the browser's own voice; nothing leaves the visitor's device) ---- */
  var speaking = false, queue = [], marked = null;

  function setReadLabel(on) {
    if (!readBtn) return;
    readBtn.innerHTML = (on ? ICON.stop : ICON.speak) + '<span>' + (on ? 'Stop reading' : 'Read this page aloud') + '</span>';
    readBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function pickVoice() {
    var voices = window.speechSynthesis.getVoices() || [];
    var pref = ['en-GB', 'en-IN', 'en-US'];
    for (var i = 0; i < pref.length; i++) {
      for (var j = 0; j < voices.length; j++) if (voices[j].lang === pref[i]) return voices[j];
    }
    for (var k = 0; k < voices.length; k++) if (/^en/i.test(voices[k].lang)) return voices[k];
    return null;
  }

  function visible(el) {
    if (el.closest('[hidden], [aria-hidden="true"], .ppa-panel, nav, script, style, noscript')) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function collect() {
    var sel = window.getSelection && String(window.getSelection()).trim();
    if (sel) return [{ el: null, text: sel }];
    var root = document.querySelector('main') || document.body;
    var out = [];
    Array.prototype.forEach.call(root.querySelectorAll('h1, h2, h3, h4, p, li, dt, dd, figcaption, blockquote, td, th'), function (el) {
      if (!visible(el)) return;
      if (el.parentElement && el.parentElement.closest('p, li, dd, blockquote, td, th')) return;   // read nested text once
      var text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.length > 1) out.push({ el: el, text: text });
    });
    return out;
  }

  function chunks(text) {   // some browsers stop long utterances, so speak sentence-sized pieces
    var parts = text.match(/[^.!?।]+[.!?।]*\s*/g) || [text];
    var out = [], cur = '';
    parts.forEach(function (p) {
      if ((cur + p).length > 220 && cur) { out.push(cur); cur = ''; }
      cur += p;
    });
    if (cur.trim()) out.push(cur);
    return out;
  }

  function mark(el) {
    if (marked) marked.classList.remove('ppa-reading');
    marked = el;
    if (el) {
      el.classList.add('ppa-reading');
      var r = el.getBoundingClientRect();
      if (r.top < 80 || r.bottom > window.innerHeight - 80) el.scrollIntoView({ block: 'center', behavior: motionReduced() ? 'auto' : 'smooth' });
    }
  }

  function startReading() {
    var blocks = collect();
    if (!blocks.length) return;
    window.speechSynthesis.cancel();
    queue = [];
    blocks.forEach(function (b) { chunks(b.text).forEach(function (c) { queue.push({ el: b.el, text: c }); }); });
    speaking = true;
    setReadLabel(true);
    next();
  }

  function next() {
    if (!speaking) return;
    var item = queue.shift();
    if (!item) { stopReading(); return; }
    mark(item.el);
    var u = new SpeechSynthesisUtterance(item.text);
    var v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-GB'; }
    u.rate = 0.95;
    u.onend = next;
    u.onerror = function () { stopReading(); };
    window.speechSynthesis.speak(u);
  }

  function stopReading() {
    speaking = false;
    queue = [];
    if (canSpeak) window.speechSynthesis.cancel();
    mark(null);
    setReadLabel(false);
  }

  window.addEventListener('pagehide', function () { if (canSpeak) window.speechSynthesis.cancel(); });

  /* ---- go to top (founder, 2026-11-03) ---- */
  function buildTop() {
    var top = document.createElement('button');
    top.type = 'button';
    top.className = 'ppt-btn';
    top.setAttribute('aria-label', 'Back to top');
    top.setAttribute('title', 'Back to top');
        top.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V6M6 11.5 12 5.5l6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(top);

    var shown = false, ticking = false;
    function check() {
      ticking = false;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var want = y > window.innerHeight * 1.5;
      if (want !== shown) { shown = want; top.classList.toggle('is-shown', want); }
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    check();

    top.addEventListener('click', function (e) {
      var instant = motionReduced() || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      var lenis = window.__PLAYPEN && window.__PLAYPEN.lenis;   // the home scrolls through Lenis
      if (lenis && typeof lenis.scrollTo === 'function') lenis.scrollTo(0, instant ? { immediate: true } : { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });
      // keyboard and screen-reader users (no mouse click: e.detail is 0) land at the top too
      var first = e.detail === 0 && (document.querySelector('.nav__brand') || document.querySelector('header a'));
      if (first && first.focus) { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }
    });
  }

  function start() { build(); buildTop(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
