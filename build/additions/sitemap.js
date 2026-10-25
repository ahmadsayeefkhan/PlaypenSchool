/* Sitemap (integrator, 2026-10-25): the door lists on /sitemap/ (details.sm-door__fold[data-sm-fold]).
   The markup ships them open, so without JavaScript every page is listed. From 900 px they stay open and their summary
   leaves the tab order (it is only a heading there); under 900 px they start closed, so the six doors fit in about four
   phone screens, and a tap on "See the 7 pages" opens one. Nothing animates, so reduced motion needs no switch. */
PP.ready(function () {
  'use strict';
  var folds = PP.$$('[data-sm-fold]');
  if (!folds.length || !window.matchMedia) return;
  var wide = window.matchMedia('(min-width: 900px)');
  function apply() {
    folds.forEach(function (d) {
      var sum = d.querySelector('summary');
      if (wide.matches) {
        d.open = true;
        if (sum) sum.setAttribute('tabindex', '-1');
      } else {
        d.open = false;
        if (sum) sum.removeAttribute('tabindex');
      }
    });
  }
  folds.forEach(function (d) {
    // a wide screen keeps the list open even if the summary is clicked or reached by a screen reader
    PP.on(d, 'toggle', function () { if (wide.matches && !d.open) d.open = true; });
  });
  apply();
  if (wide.addEventListener) wide.addEventListener('change', apply); else if (wide.addListener) wide.addListener(apply);
});
