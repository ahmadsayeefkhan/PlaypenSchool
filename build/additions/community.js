/* community: behaviour for /news/ and /notices/ (2026-10-11).
   A .filter-group (a heading and its list inside a [data-filter-scope]) is hidden when the chips leave no visible item in it,
   so a heading never stands over an empty list. js/inner.js does the filtering; this runs after it on the same click. */
PP.ready(function () {
  'use strict';
  PP.$$('[data-filter-scope]').forEach(function (scope) {
    var groups = PP.$$('.filter-group', scope);
    if (!groups.length) return;
    function sync() {
      groups.forEach(function (g) {
        var items = PP.$$('[data-tags]', g);
        var any = items.some(function (it) { return !it.hidden; });
        g.hidden = items.length > 0 && !any;
      });
    }
    PP.$$('button[data-filter]', scope).forEach(function (btn) { PP.on(btn, 'click', sync); });
    sync();
  });
});
