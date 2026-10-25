/* events group: behaviour shared by the events, gallery, news and notices pages (2026-10-24, pages redesign, group
   events-gallery-news). One small thing: the counter.
   egn-count  <span class="egn-count" data-egn-n="11">11</span> counts up from 0 to its number the first time it comes on
              screen (the home's .count does the same with GSAP). The final number is in the markup, so without JavaScript,
              with reduced motion (prefers-reduced-motion or the footer switch) and in print the number is simply there.
              A number with a suffix in the same span ("11", "5", "2023") is counted; anything that is not a whole number
              is left alone. */
PP.ready(function () {
  'use strict';
  var nodes = PP.$$('.egn-count[data-egn-n]');
  if (!nodes.length || PP.reduced()) return;

  function run(el) {
    var target = parseInt(el.getAttribute('data-egn-n'), 10);
    if (!(target >= 0)) return;
    var text = el.textContent;
    var digits = String(target).length;
    var start = null, dur = Math.min(1400, 600 + target * 12);
    function pad(n) { var s = String(n); while (s.length < digits) s = '0' + s; return text.indexOf('0' + String(target)) === 0 ? s : String(n); }
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pad(Math.round(target * eased));
      if (p < 1) PP.raf(tick); else el.textContent = text;
    }
    el.textContent = pad(0);
    PP.raf(tick);
  }

  if (!('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      run(en.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.2 });
  nodes.forEach(function (el) { io.observe(el); });
});


/* ---- the hubs' hero plate on a phone (review r1, 2026-10-24): /events/ and /gallery/ have a 4:5 crop of their hero
   frame (img/events-stage-cover-tall, img/gallery-formation-tall) that the shell's <picture> does not know about
   (hero_image_tall is requested in events-gallery-news-nav-requests.md, item 6). Until the shell carries it, this adds a
   media-switched <source> for screens up to 639 px and marks the body, so the plate is 4:5 instead of a 16:9 cut of a
   21:9 frame (a thin stage with empty wall, letters cut at both sides). Without JavaScript the wide frame stays. */
PP.ready(function () {
  'use strict';
  var TALL = { 'events-stage-cover': [720, 960, 1200], 'gallery-formation': [720, 960, 1200] };
  var img = PP.$('.page-hero__plate img');
  if (!img) return;
  var m = /^(.*\/)([a-z0-9-]+?)-\d{3,4}\.(jpe?g|png)$/i.exec(img.getAttribute('src') || '');
  if (!m || !TALL[m[2]]) return;
  var pic = img.parentNode;
  if (!pic || pic.tagName !== 'PICTURE') return;
  var base = m[1] + m[2] + '-tall-';
  ['jpg', 'webp'].forEach(function (ext) {
    var s = document.createElement('source');
    s.media = '(max-width: 639px)';
    if (ext === 'webp') s.type = 'image/webp';
    s.srcset = TALL[m[2]].map(function (w) { return base + w + '.' + ext + ' ' + w + 'w'; }).join(', ');
    s.sizes = '100vw';
    pic.insertBefore(s, pic.firstChild);
  });
  document.body.classList.add('egn-hero-tall');
});
