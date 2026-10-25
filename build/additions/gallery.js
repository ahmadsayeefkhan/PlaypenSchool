/* gallery: behaviour for /gallery/ and the album pages (2026-10-22). js/inner.js builds the viewer (a modal <dialog>:
   Left and Right arrows, Escape, focus back to the thumbnail); this adds, on pages with body.gallery-page only:
   1  swipe left or right on a phone to see the next or previous photograph
   2  Tab and Shift+Tab stay inside the open viewer (its buttons), whatever the browser does with a modal dialog
   3  an album with one photograph hides Previous and Next (lightbox--single) */
PP.ready(function () {
  'use strict';
  var body = document.body;
  if (!body || !body.classList.contains('gallery-page')) return;

  function openViewer() { return document.querySelector('dialog.lightbox[open]'); }

  /* 1 swipe */
  var sx = 0, sy = 0, tracking = false;
  PP.on(document, 'touchstart', function (e) {
    var d = openViewer();
    tracking = !!(d && e.touches.length === 1 && d.contains(e.target));
    if (tracking) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }
  }, { passive: true });
  PP.on(document, 'touchend', function (e) {
    if (!tracking) return;
    tracking = false;
    var d = openViewer();
    if (!d || !e.changedTouches.length) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    var btn = d.querySelector(dx < 0 ? '[data-lb="next"]' : '[data-lb="prev"]');
    if (btn && btn.offsetParent !== null) btn.click();
  }, { passive: true });

  /* 2 focus stays in the viewer */
  PP.on(document, 'keydown', function (e) {
    if (e.key !== 'Tab') return;
    var d = openViewer();
    if (!d) return;
    var items = PP.$$('button, a[href]', d).filter(function (el) { return el.offsetParent !== null && !el.disabled; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1], at = document.activeElement;
    if (e.shiftKey && (at === first || !d.contains(at))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (at === last || !d.contains(at))) { e.preventDefault(); first.focus(); }
  });

  /* 3 one photograph: no Previous and Next (runs after js/inner.js has opened the viewer on the same click) */
  PP.on(document, 'click', function (e) {
    var a = e.target.closest ? e.target.closest('a[data-lightbox]') : null;
    if (!a) return;
    var d = document.querySelector('dialog.lightbox');
    if (!d) return;
    var scope = a.closest('[data-gallery]') || document;
    var single = PP.$$('a[data-lightbox]', scope).length < 2;
    d.classList.toggle('lightbox--single', single);
    /* the dialog put focus on Previous, which is now hidden: move it to Close */
    if (d.open && (single || !d.contains(document.activeElement))) {
      var close = d.querySelector('.dialog__close');
      if (close && (!d.contains(document.activeElement) || document.activeElement.offsetParent === null)) close.focus();
    }
  });
});


/* ---- gal-high: the highlights slider on /gallery/ (2026-10-24, pages redesign, group events-gallery-news) -------------
   Markup: div.gal-high[data-egn-slider] > figure.frame > .frame__mat > ul.gal-high__slides[data-gallery] > li.gal-high__slide
   (one .is-active) > a.gal-high__link[data-lightbox] > picture; then .gal-high__side with the counter (.gal-high__now),
   ul.gal-high__caps (one li.gal-high__cap per slide, the album link) and the three buttons [data-egn-go=prev|toggle|next].
   Rules: autoplay only on a desktop with a fine pointer, without reduced motion, while the slider is on screen and no
   viewer is open; the pause button stops it (WCAG 2.2.2); Left and Right arrows and a swipe step it; the first frame
   shows without JavaScript. In the still tier (reduced motion) the slides switch without a dissolve and there is no toggle. */
PP.ready(function () {
  'use strict';
  var root = PP.$('.gal-high[data-egn-slider]');
  if (!root) return;
  var slides = PP.$$('.gal-high__slide', root);
  var caps = PP.$$('.gal-high__cap', root);
  var now = PP.$('.gal-high__now', root);
  var fill = PP.$('.gal-high__fill', root);
  var toggle = PP.$('[data-egn-go="toggle"]', root);
  var live = PP.$('.gal-high__status', root);
  if (slides.length < 2) { root.classList.add('is-ready', 'is-still'); if (toggle) toggle.hidden = true; return; }

  var still = PP.reduced();
  var desktop = window.matchMedia && window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches;
  var HOLD = 4500, FADE = 1200;
  var i = Math.max(0, slides.map(function (s) { return s.classList.contains('is-active'); }).indexOf(true));
  var timer = null, playing = false, wanted = desktop && !still, onScreen = true;

  root.style.setProperty('--gal-hold', HOLD + 'ms');
  if (still) root.classList.add('is-still');
  root.classList.add('is-ready');

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function show(to) {
    to = (to + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('is-active', k === to); s.setAttribute('aria-hidden', k === to ? 'false' : 'true'); });
    caps.forEach(function (c, k) { c.classList.toggle('is-active', k === to); });
    if (now) now.textContent = pad(to + 1);
    if (live) live.textContent = 'Frame ' + (to + 1) + ' of ' + slides.length;
    i = to;
  }
  function stopTimer() { if (timer) { clearTimeout(timer); timer = null; } if (fill) { fill.classList.remove('is-run'); } }
  function arm() {
    stopTimer();
    if (!playing || !onScreen || document.hidden) return;
    if (fill) { void fill.offsetWidth; fill.classList.add('is-run'); }
    timer = setTimeout(function () { show(i + 1); arm(); }, HOLD + (still ? 0 : FADE / 3));
  }
  function setPlaying(on) {
    playing = on;
    if (toggle) {
      toggle.setAttribute('data-state', on ? 'playing' : 'paused');
      toggle.setAttribute('aria-label', on ? 'Pause the slides' : 'Play the slides');
    }
    arm();
  }
  function step(d) { show(i + d); if (playing) arm(); }

  /* the slides start hidden from assistive technology except the active one */
  slides.forEach(function (s, k) { s.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });

  PP.on(root, 'click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-egn-go]') : null;
    if (!b || !root.contains(b)) return;
    var go = b.getAttribute('data-egn-go');
    if (go === 'prev') step(-1);
    else if (go === 'next') step(1);
    else if (go === 'toggle') setPlaying(!playing);
  });
  PP.on(root, 'keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  });

  /* swipe on the frame */
  var sx = 0, sy = 0, tracking = false;
  var win = PP.$('.gal-high__slides', root);
  PP.on(win, 'touchstart', function (e) { if (e.touches.length !== 1) return; tracking = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  PP.on(win, 'touchend', function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    step(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* autoplay pauses while the slider is off screen, the tab is hidden, or a viewer is open */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { onScreen = en.isIntersecting; arm(); });
    }, { threshold: 0.3 }).observe(root);
  }
  PP.on(document, 'visibilitychange', arm);
  PP.on(document, 'click', function (e) {
    if (e.target.closest && e.target.closest('a[data-lightbox]')) stopTimer();
  });
  PP.on(document, 'close', function () { arm(); }, true);

  if (!wanted && toggle) toggle.hidden = true;
  setPlaying(wanted);
});


/* ---- /gallery/ sheet 02: the filter status counts the album cards, and the folded list on its own (review r1,
   2026-10-24). js/inner.js counts every [data-tags] item in the scope, so it said "Showing all 38" above 22 cards; the
   folded albums are listed, not shown. This rewrites the line after inner.js has set it (same click, next frame). */
PP.ready(function () {
  'use strict';
  var section = document.getElementById('albums');
  if (!section) return;
  var scope = section.hasAttribute('data-filter-scope') ? section : PP.$('[data-filter-scope]', section);
  if (!scope) return;
  var status = PP.$('.chips__status', scope);
  var cards = PP.$$('.alb-card', scope), more = PP.$$('.alb-more__item', scope);
  if (!status || !cards.length) return;
  function visible(list) { return list.filter(function (n) { return !n.hidden; }).length; }
  /* final review 2026-10-25: one pattern in every state ("Showing 6 of 38 albums: 3 with photographs, 3 in the list below"),
     and it is re-applied whenever inner.js rewrites the line (it did so after this script on some filters: "Showing 6 of 38") */
  function text() {
    var c = visible(cards), m = visible(more), all = cards.length + more.length, n = c + m;
    var s = (n === all ? 'Showing all ' + all : 'Showing ' + n + ' of ' + all) + ' albums: ' + c + ' with photographs';
    if (more.length) s += ', ' + m + ' in the list below';
    return s;
  }
  function fix() { var t = text(); if (status.textContent !== t) status.textContent = t; }
  PP.on(scope, 'click', function (e) {
    if (e.target.closest && e.target.closest('button[data-filter]')) PP.raf(fix);
  });
  if (window.MutationObserver) new MutationObserver(fix).observe(status, { childList: true, characterData: true, subtree: true });
  fix();
});
