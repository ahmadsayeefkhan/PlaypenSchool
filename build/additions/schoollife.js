/* School life group (schoollife): one small behaviour, added in the review round of 2026-10-24.
   sl-counter  Under the hub's photo-card row (/school-life/, .sl-cards), which scrolls sideways and snaps on a phone,
               a "01 / 05" counter like the home's Ascent counter (counter__cur / counter__num from main.css) says which
               card is in view. The markup is in the page with "01" already set, so without JavaScript the counter is
               simply static; the stylesheet shows it under 640 px only, where the row scrolls. The number follows the
               row's scroll position (passive scroll listener, one frame at a time); nothing animates, so reduced motion
               needs no switch. */
PP.ready(function () {
  'use strict';
  var rows = PP.$$('.sl-cards');
  rows.forEach(function (row) {
    var counter = row.parentNode.querySelector('.sl-counter');
    if (!counter) return;
    var num = counter.querySelector('.counter__num');
    var total = counter.querySelector('.counter__total');
    var cards = row.children;
    if (!num || !cards.length) return;
    if (total) total.textContent = (cards.length < 10 ? '0' : '') + cards.length;
    var ticking = false, last = -1;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function update() {
      ticking = false;
      var x = row.scrollLeft, best = 0, bestD = Infinity;
      for (var i = 0; i < cards.length; i++) {
        var d = Math.abs(cards[i].offsetLeft - row.offsetLeft - x);
        if (d < bestD) { bestD = d; best = i; }
      }
      if (best !== last) { last = best; num.textContent = pad(best + 1); }
    }
    PP.on(row, 'scroll', function () { if (!ticking) { ticking = true; PP.raf(update); } }, { passive: true });
    update();
  });
});
