/* admissions: behaviour for /admissions/ pages (2026-10-11). Three small things, each looks for its own markup first:
   1  deep link into the entry-point chips on /admissions/how-to-apply/ (#entry-pg, #entry-kg, #entry-xi)
   2  the class chosen in a form picks the admissions line to show under it (select[data-route] with data-line on each option)
   3  a button that prints one list, not the whole page ([data-print-list="#id"]) */
PP.ready(function () {
  'use strict';
  var doc = document;
  var html = doc.documentElement;

  /* 1 ---- entry points: a link such as how-to-apply/#entry-kg presses the matching chip and scrolls to the card */
  (function () {
    var m = /^#entry-(pg|kg|xi)$/.exec(location.hash || '');
    if (!m) return;
    var chip = PP.$('[data-filter-scope] .chip[data-filter="' + m[1] + '"]');
    var card = doc.getElementById('entry-' + m[1]);
    if (!chip || !card) return;
    chip.click();
    PP.raf(function () { card.scrollIntoView(); });
  })();

  /* 2 ---- class of entry -> the line to call. Each option names its line: <option data-line="pg-1">. The hint box holds
     one .route-hint__line per line (data-line="pg-1"), all hidden; the box is a live region that fills when a class is chosen. */
  PP.$$('select[data-route]').forEach(function (select) {
    var box = doc.getElementById(select.getAttribute('data-route'));
    if (!box) return;
    var lines = PP.$$('.route-hint__line', box);
    function update() {
      var opt = select.options[select.selectedIndex];
      var key = opt ? opt.getAttribute('data-line') : '';
      var any = false;
      lines.forEach(function (line) {
        var on = !!key && line.getAttribute('data-line') === key;
        line.hidden = !on;
        if (on) any = true;
      });
      box.classList.toggle('is-on', any);
    }
    PP.on(select, 'change', update);
    update();
  });

  /* 3 ---- print one list: copy it into a sheet that only the print stylesheet shows, print, remove it */
  PP.$$('[data-print-list]').forEach(function (btn) {
    PP.on(btn, 'click', function () {
      var src = PP.$(btn.getAttribute('data-print-list'));
      if (!src || !window.print) return;
      var sheet = doc.createElement('div');
      sheet.className = 'print-sheet';
      var copy = src.cloneNode(true);
      copy.removeAttribute('id');
      sheet.appendChild(copy);
      doc.body.appendChild(sheet);
      html.classList.add('print-list');
      function done() {
        html.classList.remove('print-list');
        if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
        window.removeEventListener('afterprint', done);
      }
      window.addEventListener('afterprint', done);
      window.print();
      /* a browser that never fires afterprint still cleans up, a minute later */
      window.setTimeout(done, 60000);
    });
  });
});
