/* footer accordions, 2026-10-18 (pages redesign, markup agreed with home-builder; the home carries the same code in js/main.js).
   Under 720 px each footer link group is a closed <details>; from 720 px up the groups stay open and their summaries
   leave the tab order, so the accordion exists only on phones. */
PP.ready(function () {
  var groups = PP.$$('[data-foot-group]');
  if (!groups.length || !window.matchMedia) return;
  var mq = window.matchMedia('(min-width: 720px)');
  var sync = function () {
    groups.forEach(function (d) {
      d.open = mq.matches;
      var s = d.querySelector('summary');
      if (s) { if (mq.matches) s.setAttribute('tabindex', '-1'); else s.removeAttribute('tabindex'); }
    });
  };
  groups.forEach(function (d) {
    var s = d.querySelector('summary');
    if (s) PP.on(s, 'click', function (e) { if (mq.matches) e.preventDefault(); });
  });
  sync();
  if (mq.addEventListener) mq.addEventListener('change', sync); else if (mq.addListener) mq.addListener(sync);
});


/* reveal safety net (final review 2026-10-25). A fast scroll (or a jump to an anchor, or printing) could pass a [data-reveal]
   block without the observer ever seeing it intersect, leaving it blank. On every scroll frame, any block whose top is
   already above the bottom of the viewport is shown; printing shows everything. inner.js still does the reveal itself. */
PP.ready(function () {
  var sel = '[data-reveal]:not(.is-in), [data-reveal-group] > :not(.is-in)';
  var queued = false;
  function sweep() {
    queued = false;
    var h = window.innerHeight || document.documentElement.clientHeight;
    PP.$$(sel).forEach(function (el) { if (el.getBoundingClientRect().top < h) el.classList.add('is-in'); });
  }
  PP.on(window, 'scroll', function () { if (!queued) { queued = true; PP.raf(sweep); } }, { passive: true });
  PP.on(window, 'beforeprint', function () { if (PP.revealAll) PP.revealAll(); else PP.$$(sel).forEach(function (el) { el.classList.add('is-in'); }); });
  window.setTimeout(sweep, 400);
});
