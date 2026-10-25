/* administration group: the class finder on /about/leadership/. Written 2026-10-24, group "about" (pages redesign).
   <div class="adm-finder" data-adm-finder> holds a <select> whose options carry data-adm-band="pg-kg1" and one result
   block per band, <div class="adm-finder__result" data-adm-band="pg-kg1" hidden>. Choosing a class shows its block and
   says so in the role="status" live region. All the answers are in the HTML, so without JavaScript the intro line
   sends the reader to the table under the finder. */
PP.ready(function () {
  PP.$$('[data-adm-finder]').forEach(function (box) {
    var select = PP.$('select', box);
    var intro = PP.$('.adm-finder__intro', box);
    var example = PP.$('[data-adm-example]', box);   /* the worked example shown until a class is chosen (r3) */
    var status = PP.$('[role="status"]', box);
    var results = PP.$$('.adm-finder__result', box);
    if (!select || !results.length) return;
    select.disabled = false;
    function show() {
      var opt = select.options[select.selectedIndex];
      var band = opt ? opt.getAttribute('data-adm-band') : '';
      var shown = null;
      results.forEach(function (r) {
        var on = band && r.getAttribute('data-adm-band') === band;
        r.hidden = !on;
        if (on) shown = r;
      });
      if (intro) intro.hidden = !!shown;
      if (example) example.hidden = !!shown;
      if (status) {
        if (shown && opt) {
          var tic = PP.$('[data-adm-tic]', shown), vp = PP.$('[data-adm-vp]', shown);
          status.textContent = opt.text + ': ' + (tic ? tic.textContent : '') + ' is the Teacher-in-Charge, under ' + (vp ? vp.textContent : '') + '. The line to call is shown.';
        } else {
          status.textContent = '';
        }
      }
    }
    PP.on(select, 'change', show);
    show();
  });
});
