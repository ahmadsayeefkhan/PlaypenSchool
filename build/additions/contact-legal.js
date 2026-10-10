/* contact-legal: /contact/ (2026-10-11).
   The prototype form on /contact/ asks what the question is about. When the topic changes, the first line of the notice
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
