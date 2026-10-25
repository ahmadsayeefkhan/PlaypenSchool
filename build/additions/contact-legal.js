/* contact-legal: /contact/ (2026-10-11) and /search/ (2026-10-24).
   The first block is left from the retired prototype form on /contact/ (it exits at once when #ct-topic is absent): asks what the question is about. When the topic changes, the first line of the notice
   (the one inner.js shows after a valid submit) is set to the sentence on the chosen <option data-reply="...">, so the
   notice says which number suits the question. inner.js fills that line itself only when it is empty, so setting it on
   change is enough. Nothing is sent and nothing is stored. */
PP.ready(function () {
  var select = PP.$('#ct-topic');
  var notice = PP.$('.form-notice');
  if (!select || !notice) return;
  var lead = PP.$('.form-notice__text', notice);
  if (!lead) return;
  var hours = (document.body && document.body.getAttribute('data-hours')) || '';
  PP.on(select, 'change', function () {
    var opt = select.options[select.selectedIndex];
    var reply = opt && opt.getAttribute('data-reply');
    if (!reply) { lead.textContent = ''; return; }
    lead.textContent = 'This form is a prototype: nothing was sent. ' + reply + (hours ? ' The admissions lines are open ' + hours + '.' : '');
  });
});


/* search empty state (/search/, 2026-10-24, community-contact).
   The page carries a .cc-empty block (pages most families need, a "no result? call" line and the phone list) that is shown
   while the box is empty or nothing matched, and hidden as soon as js/inner.js has written results. inner.js owns the search;
   this only watches its two outputs (.search-results, .search-status) and the input, and swaps the note's title between
   "Start from one of these." and "Nothing matched that word." (both are in the markup; one is hidden). No fetch, no storage. */
PP.ready(function () {
  'use strict';
  var box = PP.$('[data-search]');
  var empty = PP.$('.cc-empty');
  if (!box || !empty) return;
  var input = PP.$('input[name="q"]', box);
  var list = PP.$('.search-results', box);
  var status = PP.$('.search-status', box);
  var start = PP.$('.cc-empty__start', empty);
  var none = PP.$('.cc-empty__none', empty);
  function sync() {
    var hits = list ? list.children.length : 0;
    var text = status ? status.textContent : '';
    var searching = /^Searching/.test(text);
    var nothing = /^No page matches/.test(text);
    empty.hidden = hits > 0 || searching;
    if (start) start.hidden = nothing;
    if (none) none.hidden = !nothing;
  }
  if (window.MutationObserver) {
    var mo = new MutationObserver(function () { PP.raf(sync); });
    if (list) mo.observe(list, { childList: true });
    if (status) mo.observe(status, { childList: true, characterData: true, subtree: true });
  }
  if (input) PP.on(input, 'input', function () { if (!input.value.trim() && list && !list.children.length) sync(); });
  sync();
});
