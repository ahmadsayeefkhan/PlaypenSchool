/* Learning group (page group "learning"): the home's small motions on inner pages (2026-10-24)
   1. Result rings and grade bars (.result.lr-ring) draw from zero when the panel comes into view.
   2. Counters (.lr-count) count up to the number already in the markup.
   Both are off under prefers-reduced-motion and the footer's motion switch (PP.reduced()), without JavaScript, and in
   print: the final values are in the HTML, so nothing depends on this file. The step line draw is CSS only
   (learning.css, --drawn on .is-in). Documented in docs/additions/learning.md. */
PP.ready(function () {
  var rings = PP.$$('.lr-ring');
  var counts = PP.$$('.lr-count');
  if (!rings.length && !counts.length) return;
  if (PP.reduced() || !('IntersectionObserver' in window)) return;   /* at rest: the markup already shows the result */

  function countUp(el) {
    var to = parseFloat(el.getAttribute('data-lr-count') || el.textContent);
    if (!isFinite(to)) return;
    var start = null, dur = 900;
    function tick(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(to * e));
      if (p < 1) PP.raf(tick); else el.textContent = String(to);
    }
    el.textContent = '0';
    PP.raf(tick);
  }

  /* arm the rings (segments and bars at zero) only now that we know they will be released */
  rings.forEach(function (r) { r.classList.add('lr-ring--armed'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      io.unobserve(el);
      if (el.classList.contains('lr-ring')) {
        el.classList.remove('lr-ring--armed');
        PP.$$('.lr-count', el).forEach(countUp);
      } else {
        countUp(el);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });

  rings.forEach(function (r) { io.observe(r); });
  counts.forEach(function (c) { if (!c.closest('.lr-ring')) io.observe(c); });
});

/* 3. Disclosures (.lr-disclose, review fixes 2026-10-24). A phone-only disclosure (.lr-disclose--phone) is written open
   and is closed here under 600 px, so the markup and a page without JavaScript show the grid; any disclosure opens when a
   link points at something inside it (the result cards' "subjects offered" link, or a hash in the address). */
PP.ready(function () {
  var all = PP.$$('.lr-disclose');
  if (!all.length) return;
  var mq = window.matchMedia ? window.matchMedia('(max-width: 599px)') : null;
  function fold() {
    PP.$$('.lr-disclose--phone').forEach(function (d) {
      if (mq && mq.matches) d.removeAttribute('open'); else d.setAttribute('open', '');
    });
  }
  fold();
  if (mq && mq.addEventListener) mq.addEventListener('change', fold);
  function openFor(hash) {
    if (!hash || hash.length < 2) return;
    var t = document.getElementById(hash.slice(1));
    if (!t) return;
    var d = t.closest('.lr-disclose');
    if (d) d.setAttribute('open', '');
  }
  openFor(location.hash);
  window.addEventListener('hashchange', function () { openFor(location.hash); });
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (a) openFor(a.getAttribute('href'));
  });
});
