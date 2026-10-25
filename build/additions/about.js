/* about group: extra behaviour. Written 2026-10-24, group "about" (pages redesign).
   One thing: numbers that count up once. <span class="abt-count" data-abt-count="67">67</span> holds its final value in
   the markup (no JavaScript, reduced motion and print show it as it is); when it scrolls into view it counts from 0 to
   the value over about 1.1 s, as the home's .count does. Decimals and prefixes stay in the markup around the span. */
PP.ready(function () {
  var nodes = PP.$$('[data-abt-count]');
  if (!nodes.length || PP.reduced() || !('IntersectionObserver' in window)) return;
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  function run(el) {
    var end = parseFloat(el.getAttribute('data-abt-count'));
    if (isNaN(end)) return;
    var start = null, dur = 1100;
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      el.textContent = String(Math.round(end * ease(p)));
      if (p < 1) window.requestAnimationFrame(step); else el.textContent = String(end);
    };
    el.textContent = '0';
    window.requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { io.unobserve(en.target); run(en.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  nodes.forEach(function (n) { io.observe(n); });
});

/* sheet heads (2026-10-24): the H2 rises through a clip-path mask (about.css). A clipped box reports almost no
   intersection, so the head's wrapper (.abt-head, never clipped) is what is watched; when it enters, the title inside
   gets the same is-in class the page's own reveal would give it. */
PP.ready(function () {
  var heads = PP.$$('.abt-head');
  if (!heads.length) return;
  var show = function (head) { PP.$$('.abt-head__title[data-reveal]', head).forEach(function (t) { t.classList.add('is-in'); }); };
  if (PP.reduced() || !('IntersectionObserver' in window)) { heads.forEach(show); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); show(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  heads.forEach(function (h) {
    var r = h.getBoundingClientRect();
    if (r.top < (window.innerHeight || 800) * 0.96) show(h); else io.observe(h);
  });
});

/* the fixed overlays and the first screen (review r3, interim for Foundation X16): while an element marked
   [data-abt-clear] (a cover's media, a hero plate, the class finder) still reaches into the corner where the chat
   launcher and the first-visit notice sit, <html> carries abt-hero-in and about.css moves the overlays below the
   viewport; they come back when the visitor scrolls past it. Measured on scroll and resize through one rAF. */
PP.ready(function () {
  var marks = PP.$$('[data-abt-clear]');
  if (!marks.length) return;
  var html = document.documentElement, raf = 0;
  function measure() {
    raf = 0;
    var vh = window.innerHeight || html.clientHeight;
    var corner = vh - 150;               /* the launcher pill (56 px), the robot's head above it and 16 px of air */
    var over = marks.some(function (m) {
      var r = m.getBoundingClientRect();
      return r.height > 0 && r.bottom > corner && r.top < vh;
    });
    html.classList.toggle('abt-hero-in', over);
  }
  function later() { if (!raf) raf = window.requestAnimationFrame(measure); }
  measure();
  PP.on(window, 'scroll', later, { passive: true });
  PP.on(window, 'resize', later, { passive: true });
  PP.on(window, 'load', later);
});

/* careers (2026-10-24): one route at a time. portal.js reveals #apply-online (data-portal-only) when the site has an
   API; when that happens the by-hand steps (#apply-by-hand) step aside, so the page never shows two routes. */
PP.ready(function () {
  var online = document.getElementById('apply-online'), byHand = document.getElementById('apply-by-hand');
  if (!online || !byHand || !('MutationObserver' in window)) return;
  var sync = function () { byHand.hidden = !online.hidden; };
  new MutationObserver(sync).observe(online, { attributes: true, attributeFilter: ['hidden'] });
  sync();
});
