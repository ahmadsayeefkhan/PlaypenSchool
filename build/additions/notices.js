/* notices: behaviour for /notices/ (2026-10-22, spec redesign-2026-10-22-notices/spec.md §7). Small things;
   with JS off the HTML is already right (current notices on the board, ended ones in the closed details).
   1  date guard: a card whose data-ends date has passed becomes Ended and moves into the "Ended notices" details
   2  filter follow-up: after a topic chip is pressed (js/inner.js filters first), open the details when the only
      matching notices are ended ones, and close it again if we opened it and a current notice matches
   3  plain status line: js/inner.js writes "Showing all 3"; this rewrites it to name the split between current and
      ended notices, and puts a "no current notice about ..." line on the board when a topic has none
      (review fixes 2026-10-22, redesign-2026-10-22-notices/review-and-fixes.md) */
PP.ready(function () {
  'use strict';
  var scope = PP.$('.nbp-now');
  if (!scope) return;
  var board = PP.$('.nb-board .nb-grid', scope);
  var details = PP.$('.nbp-ended', scope);
  var endedGrid = details ? PP.$('.nbp-ended__grid', details) : null;
  if (!board || !details || !endedGrid) return;
  var summary = PP.$('.nbp-ended__summary', details);
  var count = PP.$('.nb-count', scope);
  var empty = PP.$('.nb-empty', board);
  var status = PP.$('.chips__status', scope);
  var filterEmpty = PP.$('.filter-empty', scope);
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function currentCards() { return PP.$$('.nb-card', board); }
  function endedCards() { return PP.$$('.nb-card', endedGrid); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

  function refreshCounts() {
    var n = currentCards().length;
    if (count) count.textContent = n === 0 ? 'No notice applies now.' : n === 1 ? '1 notice applies now.' : n + ' notices apply now.';
    if (summary) summary.textContent = 'Ended notices (' + endedCards().length + ')';
    var none = PP.$('.nb-none:not(.nb-none--topic)', board);
    if (n === 0 && !none) {
      none = document.createElement('p');
      none.className = 'nb-none';
      none.textContent = 'There is no current notice from the school right now.';
      board.insertBefore(none, board.firstChild);
    }
  }

  /* 1 ---- date guard */
  try {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var moved = false;
    currentCards().forEach(function (card) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(card.getAttribute('data-ends') || '');
      if (!m || card.classList.contains('nb-card--ended')) return;
      var ends = new Date(+m[1], +m[2] - 1, +m[3]).getTime();
      if (ends >= today) return;                       /* the notice still applies on its last day */
      card.classList.add('nb-card--ended');
      card.classList.remove('nb-card--feature');
      card.setAttribute('data-status', 'ended');
      var chip = PP.$('.nb-status', card);
      if (chip) { chip.className = 'nb-status nb-status--ended'; chip.textContent = 'Ended'; }
      var big = PP.$('.nb-tile__big', card), small = PP.$('.nb-tile__small', card);
      if (big && small) { big.textContent = 'Ended'; small.textContent = (+m[3]) + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1]; }
      var title = PP.$('.nb-card__title', card);
      if (title && !PP.$('.visually-hidden', title)) {
        var sr = document.createElement('span');
        sr.className = 'visually-hidden';
        sr.textContent = ' (ended)';
        title.appendChild(sr);
      }
      if (title && title.tagName === 'H3') {          /* under the "Ended notices" heading, the card title is an h4 */
        var h4 = document.createElement('h4');
        for (var i = 0; i < title.attributes.length; i++) h4.setAttribute(title.attributes[i].name, title.attributes[i].value);
        while (title.firstChild) h4.appendChild(title.firstChild);
        title.parentNode.replaceChild(h4, title);
      }
      var heading = PP.$('h3.visually-hidden', endedGrid);
      endedGrid.insertBefore(card, heading ? heading.nextSibling : endedGrid.firstChild);
      moved = true;
    });
    if (moved) refreshCounts();
  } catch (e) { /* the server-rendered page stays as it is */ }

  /* 2 + 3 ---- filter follow-up and the plain status line */
  try {
    var autoOpened = false;
    var topicLine = null;

    function follow(topic, label) {
      var visible = function (c) { return !c.hidden; };
      var cur = currentCards().filter(visible).length;
      var old = endedCards().filter(visible).length;
      var all = topic === 'all';
      var about = label ? ' about ' + label.toLowerCase() : '';

      if (empty) empty.hidden = !all;

      /* the board never stands empty: say there is no current notice on this topic */
      if (!all && cur === 0) {
        if (!topicLine) {
          topicLine = document.createElement('p');
          topicLine.className = 'nb-none nb-none--topic';
          board.insertBefore(topicLine, board.firstChild);
        }
        topicLine.textContent = old > 0
          ? 'There is no current notice' + about + '. ' + (old === 1 ? 'The ended notice is shown below.' : 'The ended notices are shown below.')
          : 'There is no notice' + about + ' right now. Choose “All topics” to see every notice.';
        topicLine.hidden = false;
        if (filterEmpty) filterEmpty.classList.remove('is-shown');   /* the line on the board says it once */
      } else if (topicLine) {
        topicLine.hidden = true;
      }

      if (status) {
        var text;
        if (all) text = 'Showing ' + plural(cur, 'current notice', 'current notices') + '.' + (old ? ' ' + plural(old, 'ended notice is', 'ended notices are') + ' in the box below.' : '');
        else if (cur > 0) text = 'Showing ' + plural(cur, 'current notice', 'current notices') + about + (old ? ' and ' + plural(old, 'ended notice', 'ended notices') : '') + '.';
        else if (old > 0) text = 'No current notice' + about + '. ' + plural(old, 'ended notice is', 'ended notices are') + ' shown below.';
        else text = 'No notice' + about + ' right now.';
        status.textContent = text;
      }

      if (cur === 0 && old > 0 && !details.open) { details.open = true; autoOpened = true; }
      else if (cur > 0 && autoOpened) { details.open = false; autoOpened = false; }
    }

    var chips = PP.$$('.chip[data-filter]', scope);
    /* review website-content-3: one listener on the scope, so a topic chip the live feed adds later works too */
    PP.on(scope, 'click', function (e) {
      var chip = e.target && e.target.closest ? e.target.closest('.chip[data-filter]') : null;
      if (!chip || !scope.contains(chip)) return;
      setTimeout(function () { follow(chip.getAttribute('data-filter'), chip.textContent.trim()); }, 0);
    });
    PP.on(details, 'toggle', function () { if (!details.open) autoOpened = false; });

    /* first paint: js/inner.js has already written "Showing all 3"; replace it once both scripts have run */
    setTimeout(function () {
      var pressed = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })[0];
      var topic = pressed ? pressed.getAttribute('data-filter') : 'all';
      follow(topic, topic === 'all' ? '' : pressed.textContent.trim());
    }, 0);
  } catch (e) { /* filters still work through js/inner.js */ }
});
