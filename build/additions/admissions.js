/* admissions: behaviour for /admissions/ pages (2026-10-11; rewritten 2026-10-24 for the redesign). Each part looks for its
   own markup first and does nothing on a page without it:
   1  the class picker (.adm-picker): a tile or the select chooses a class; one entry card shows, the matching call line is
      highlighted (.call-line.is-chosen) and the class is remembered on the device (localStorage "pp:adm-class", try/catch)
   2  the class chosen in a form picks the admissions line to show under it (select[data-route], data-line on each option) and
      is pre-filled from the remembered class
   3  a button that prints one list, not the whole page ([data-print-list="#id"])
   4  tickable lists (.adm-check[data-adm-store]) remember their ticks on the device
   5  the collapsed online form on How to apply ([data-adm-toggle], #forms-panel): opens on the button, on #forms in the URL
      and on any link to #forms
   6  the FAQ search ([data-adm-search]) filters the questions as you type and says how many are shown
   7  the Enquire topic chips ([data-adm-topics]) show one answer and pre-fill the question; #topic-<key> presses a chip
   8  the "More" disclosure in the online form's action bar on phones ([data-adm-more])
   9  quick picks above a free-text box ([data-adm-picks="<input id>"]): a chip fills the box, typing still works
   Without JavaScript: the picker, the chips, the search and the toggles are hidden by CSS and everything is shown open. */
PP.ready(function () {
  'use strict';
  var doc = document;
  var html = doc.documentElement;
  var CLASS_KEY = 'pp:adm-class';

  function remembered() { return PP.store(CLASS_KEY) || ''; }
  function remember(cls) { if (cls) PP.store(CLASS_KEY, cls); }
  function lineName(key) {
    return key === 'pg-1' ? 'Playgroup to Class I' : key === 'ii-vi' ? 'Classes II to VI' : key === 'vii-xii' ? 'Classes VII to XII' : '';
  }
  function markLines(key) {
    PP.$$('.call-line[data-line]').forEach(function (li) { li.classList.toggle('is-chosen', !!key && li.getAttribute('data-line') === key); });
  }

  /* 1 ---- the class picker */
  PP.$$('.adm-picker').forEach(function (picker) {
    var tiles = PP.$$('button[data-class]', picker);
    var select = PP.$('select', picker);
    var status = PP.$('.chips__status', picker);
    var scope = picker.closest('[data-adm-scope]') || doc;
    var cards = PP.$$('.adm-entry', scope);
    var lists = PP.$$('.adm-entries', scope);
    /* review r2: the KG I to Class IX card names the one line for the chosen class ([data-adm-line-name]); the three-part sentence
       ([data-adm-line-rest]) is the fallback while nothing is chosen and without JavaScript */
    var lineNames = PP.$$('[data-adm-line-name]', scope).map(function (el) { return { el: el, text: el.textContent }; });
    var lineRests = PP.$$('[data-adm-line-rest]', scope);
    if (!tiles.length) return;
    function tileFor(cls) { return tiles.filter(function (t) { return t.getAttribute('data-class') === cls; })[0] || null; }
    function brief(on) { lists.forEach(function (ul) { ul.classList.toggle('adm-entries--brief', on); }); }
    function choose(cls, quiet) {
      var tile = tileFor(cls);
      var bracket = tile ? tile.getAttribute('data-bracket') : '';
      var line = tile ? tile.getAttribute('data-line') : '';
      tiles.forEach(function (t) { t.setAttribute('aria-pressed', t === tile ? 'true' : 'false'); });
      cards.forEach(function (c) { c.hidden = !!tile && c.getAttribute('data-bracket') !== bracket; });
      /* review r2: on phones the cards stay title-only until a class is chosen (admissions.css 8) */
      brief(!tile);
      lineNames.forEach(function (o) { o.el.textContent = tile && line ? 'The ' + lineName(line) + ' line' : o.text; });
      lineRests.forEach(function (r) { r.hidden = !!(tile && line); });
      markLines(line);
      if (select && select.value !== (tile ? cls : '')) select.value = tile ? cls : '';
      if (status && !quiet) {
        status.textContent = tile ? (cls + ': the card below shows the test, the form and what follows. The line to call is ' + lineName(line) + '.') : '';
      }
      if (tile) remember(cls);
    }
    tiles.forEach(function (t) { PP.on(t, 'click', function () { choose(t.getAttribute('data-class')); }); });
    if (select) PP.on(select, 'change', function () { choose(select.value); });
    /* a deep link such as how-to-apply/#entry-kg opens that bracket (the old chip links keep working), also when the hash
       changes on the page */
    function fromHash() {
      var m = /^#entry-(pg|kg|xi|xx)$/.exec(location.hash || '');
      if (!m) return false;
      var first = tiles.filter(function (t) { return t.getAttribute('data-bracket') === m[1]; })[0];
      if (!first) return false;
      choose(first.getAttribute('data-class'), true);
      var card = doc.getElementById('entry-' + m[1]);
      if (card) PP.raf(function () { card.scrollIntoView(); });
      return true;
    }
    window.addEventListener('hashchange', fromHash);
    brief(true);
    if (fromHash()) return;
    var saved = remembered();
    if (saved && tileFor(saved)) choose(saved, true);
  });

  /* 2 ---- class of entry -> the line to call (form pages), pre-filled from the remembered class */
  PP.$$('select[data-route]').forEach(function (select) {
    var box = doc.getElementById(select.getAttribute('data-route'));
    var lines = box ? PP.$$('.route-hint__line', box) : [];
    function update() {
      var opt = select.options[select.selectedIndex];
      var key = opt ? opt.getAttribute('data-line') : '';
      var any = false;
      lines.forEach(function (line) {
        var on = !!key && line.getAttribute('data-line') === key;
        line.hidden = !on;
        if (on) any = true;
      });
      if (box) box.classList.toggle('is-on', any);
      markLines(key || '');
      if (opt && opt.getAttribute('data-line')) remember(opt.value || opt.text);
    }
    var saved = remembered();
    if (saved && !select.value) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].text === saved) { select.selectedIndex = i; break; }
      }
    }
    PP.on(select, 'change', update);
    update();
  });
  if (!PP.$('.adm-picker') && !PP.$('select[data-route]')) {
    /* a page with a call sheet only (Fees, Starting, FAQ): highlight the remembered line */
    var savedCls = remembered();
    if (savedCls) {
      var key = /^(Playgroup|Nursery|KG I|KG II|Class I)$/.test(savedCls) ? 'pg-1' : /^Class (II|III|IV|V|VI)$/.test(savedCls) ? 'ii-vi' : /^Class (VII|VIII|IX|X|XI|XII)/.test(savedCls) ? 'vii-xii' : '';
      markLines(key);
    }
  }

  /* 3 ---- print one list: copy it into a sheet that only the print stylesheet shows, print, remove it */
  PP.$$('[data-print-list]').forEach(function (btn) {
    PP.on(btn, 'click', function () {
      var src = PP.$(btn.getAttribute('data-print-list'));
      if (!src || !window.print) return;
      var sheet = doc.createElement('div');
      sheet.className = 'print-sheet';
      var copy = src.cloneNode(true);
      copy.removeAttribute('id');
      /* a ticked box prints ticked */
      var live = PP.$$('input[type="checkbox"]', src), copies = PP.$$('input[type="checkbox"]', copy);
      live.forEach(function (inp, i) { if (copies[i]) { copies[i].checked = inp.checked; if (inp.checked) copies[i].setAttribute('checked', ''); } });
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

  /* 4 ---- tickable lists: the ticks are remembered on the device; the list is complete without them */
  PP.$$('.adm-check[data-adm-store]').forEach(function (list) {
    var key = 'pp:adm-check:' + list.getAttribute('data-adm-store');
    var saved = {};
    try { saved = JSON.parse(PP.store(key) || '{}') || {}; } catch (e) { saved = {}; }
    var boxes = PP.$$('input[type="checkbox"]', list);
    boxes.forEach(function (b) {
      if (saved[b.value]) b.checked = true;
      PP.on(b, 'change', function () {
        var state = {};
        boxes.forEach(function (x) { if (x.checked) state[x.value] = 1; });
        PP.store(key, JSON.stringify(state));
      });
    });
  });

  /* 5 ---- the collapsed online form on How to apply */
  (function () {
    var btn = PP.$('[data-adm-toggle]');
    var panel = btn ? doc.getElementById((btn.getAttribute('aria-controls') || '').replace(/^#/, '')) : null;
    if (!btn || !panel) return;
    var label = PP.$('.btn__label', btn) || btn;
    var openText = label.textContent;
    function setOpen(open, focus) {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      label.textContent = open ? 'Close the online form' : openText;
      if (open && focus) PP.raf(function () { panel.focus({ preventScroll: true }); panel.scrollIntoView(); });
    }
    PP.on(btn, 'click', function () { setOpen(panel.hidden, panel.hidden); });
    PP.$$('[data-adm-close]', panel).forEach(function (c) { PP.on(c, 'click', function () { setOpen(false); btn.focus(); }); });
    function fromHash() { if ((location.hash || '') === '#forms') setOpen(true, true); }
    fromHash();
    window.addEventListener('hashchange', fromHash);
    /* a link on the same page to #forms opens the panel even when the hash does not change */
    PP.on(doc, 'click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href$="#forms"]') : null;
      if (a && panel.hidden) setOpen(true, true);
    });
  })();

  /* 6 ---- the FAQ search */
  PP.$$('[data-adm-search]').forEach(function (box) {
    var input = PP.$('input', box);
    var status = PP.$('.adm-search__status', box);
    var scope = doc.getElementById(box.getAttribute('data-adm-search')) || doc;
    var items = PP.$$('details.accordion__item', scope);
    var groups = PP.$$('.accordion-group', scope);
    if (!input || !items.length) return;
    var texts = items.map(function (d) { return (d.textContent || '').replace(/\s+/g, ' ').toLowerCase(); });
    function apply() {
      var q = (input.value || '').trim().toLowerCase();
      var shown = 0;
      items.forEach(function (d, i) {
        var ok = !q || texts[i].indexOf(q) !== -1;
        d.hidden = !ok;
        if (ok) shown++;
        if (q && ok && !d.open) d.open = true;
      });
      groups.forEach(function (g) { g.hidden = !!q && !PP.$$('details.accordion__item', g).some(function (d) { return !d.hidden; }); });
      if (status) status.textContent = q ? (shown ? shown + ' of ' + items.length + ' questions match "' + input.value.trim() + '"' : 'No question matches "' + input.value.trim() + '". Try another word, or call the line for your child\'s section.') : '';
    }
    var timer;
    PP.on(input, 'input', function () { window.clearTimeout(timer); timer = window.setTimeout(apply, 120); });
    PP.on(input, 'search', apply);
  });

  /* 7 ---- Enquire topic chips: one answer shows, the question box is pre-filled; #topic-<key> presses a chip */
  PP.$$('[data-adm-topics]').forEach(function (box) {
    var chips = PP.$$('button[data-topic]', box);
    var status = PP.$('.chips__status', box);
    var answers = PP.$$('.adm-answer[data-topic]');
    var msg = doc.getElementById(box.getAttribute('data-adm-topics'));
    if (!chips.length) return;
    function pick(key) {
      var chip = chips.filter(function (c) { return c.getAttribute('data-topic') === key; })[0];
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
      answers.forEach(function (a) { a.hidden = !chip || a.getAttribute('data-topic') !== key; });
      if (!chip) return;
      var topic = chip.textContent.trim();
      if (status) status.textContent = 'Topic: ' + topic + '. The answer already on this site is shown below the topics.';
      if (msg && (!msg.value.trim() || /^About [^:]+:\s*$/.test(msg.value))) msg.value = 'About ' + topic.toLowerCase() + ': ';
    }
    chips.forEach(function (c) { PP.on(c, 'click', function () { pick(c.getAttribute('data-topic')); }); });
    var m = /^#topic-([a-z-]+)$/.exec(location.hash || '');
    if (m) pick(m[1]);
  });

  /* 8 ---- the "More" disclosure in the online form's action bar (phones) */
  PP.$$('[data-adm-more]').forEach(function (btn) {
    var menu = doc.getElementById((btn.getAttribute('aria-controls') || '').replace(/^#/, ''));
    if (!menu) return;
    PP.on(btn, 'click', function () {
      var open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* 9 ---- quick picks: a chip writes its words into the box; the box stays free text, the chip matching it shows pressed */
  PP.$$('[data-adm-picks]').forEach(function (list) {
    var box = doc.getElementById(list.getAttribute('data-adm-picks'));
    if (!box) return;
    var chips = PP.$$('[data-pick]', list);
    function mark() {
      var v = (box.value || '').trim();
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-pick') === v ? 'true' : 'false'); });
    }
    chips.forEach(function (c) {
      PP.on(c, 'click', function () {
        box.value = c.getAttribute('data-pick');
        box.dispatchEvent(new Event('input', { bubbles: true }));
        mark();
      });
    });
    PP.on(box, 'input', mark);
    var form = box.form;
    if (form) PP.on(form, 'reset', function () { window.setTimeout(mark, 0); });
  });
});
