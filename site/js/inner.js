/* The Playpen School: behaviour of the inner pages (js/inner.js).
   Vanilla JavaScript, no libraries, no modules, one file, loaded with defer by every page the build writes
   (the home has its own modules). Every feature is progressive: the pages read and work without it, and each
   block below checks that its markup exists before it does anything.

   1  Header: solid after 80 px, hides on scroll down, shows on scroll up, night over dark sections
   2  Menu: open and close, focus trap, Escape, inert page, disclosure of a group's pages, preview image
   3  Sticky actions (phones): after a screen of scroll, never over the CTA band or a focused field
   4  Reveal on scroll (IntersectionObserver); content is visible without JavaScript
   5  Accordions: expand all, open by #hash, single-open groups, open before print
   6  Filter chips (data-filter / data-tags)
   7  Gallery lightbox (a[data-lightbox] in [data-gallery]; keyboard, Escape)
   8  Prototype forms: validate in the browser, then show the notice; nothing is ever sent
   9  Client-side search (assets/search-index.json)
  10  Chapter navigation highlight, scrollable tables, current-page links, the reduce-motion switch
  --  Page groups' own behaviour: build/additions/<group>.js, joined by build/build.py into js/pages-additions.js,
      which every page loads after this file. Write PP.ready(function () { ... }) and use PP.$, PP.$$, PP.on, PP.raf.
*/
(function () {
  'use strict';

  var doc = document;
  var html = doc.documentElement;
  var body = doc.body;
  var ROOT = (body && body.getAttribute('data-root')) || './';

  /* ---------------------------------------------------------------- helpers */
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function on(el, type, fn, opts) { if (el) el.addEventListener(type, fn, opts || false); }
  function reducedMotion() {
    return html.getAttribute('data-motion') === 'reduced' ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      if (value === null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, value);
    } catch (e) { /* private mode */ }
    return null;
  }
  function raf(fn) { return (window.requestAnimationFrame || function (f) { return setTimeout(f, 16); })(fn); }
  function focusable(root) {
    return $$('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])', root)
      .filter(function (el) { return el.offsetParent !== null || el === doc.activeElement; });
  }

  /* The hook for the page groups' own scripts (build/additions/<group>.js, loaded after this file): PP.ready(fn) runs fn once
     the steps below have run; the helpers are the ones this file uses. */
  var PP = window.PP = window.PP || {};
  var readyFns = [];
  PP.ready = function (fn) { if (PP._started) fn(); else readyFns.push(fn); };
  PP.root = ROOT;
  PP.reduced = reducedMotion;
  PP.$ = $; PP.$$ = $$; PP.on = on; PP.raf = raf; PP.store = store;

  /* ---------------------------------------------------------------- 1. header */
  function initHeader() {
    var header = $('#top');
    if (!header) return;
    var lastY = window.pageYOffset || 0;
    var ticking = false;
    var locked = false;          // menu open
    var holdUntil = 0;
    var nights = $$('.is-night').filter(function (el) { return !header.contains(el) && el.id !== 'menu'; });

    function update() {
      ticking = false;
      var y = window.pageYOffset || 0;
      var dir = y - lastY;
      lastY = y;
      header.classList.toggle('is-over-hero', y < 80);
      header.classList.toggle('is-solid', y >= 80);
      var wasHidden = header.classList.contains('is-hidden');
      var hide = wasHidden;
      if (y < 80 || locked || reducedMotion()) hide = false;
      else if (dir > 4 && y > 160 && Date.now() > holdUntil) hide = true;
      else if (dir < -4) hide = false;
      if (hide !== wasHidden) header.classList.toggle('is-hidden', hide);
      /* night: a dark block under the header's midline */
      var night = false;
      for (var i = 0; i < nights.length; i++) {
        var r = nights[i].getBoundingClientRect();
        if (r.top <= 36 && r.bottom >= 36) { night = true; break; }
      }
      header.classList.toggle('is-night', night && !locked);
    }
    function onScroll() { if (!ticking) { ticking = true; raf(update); } }
    on(window, 'scroll', onScroll, { passive: true });
    on(window, 'resize', onScroll, { passive: true });
    /* focus inside the header always brings it back */
    on(doc, 'focusin', function (e) {
      if (header.contains(e.target) && header.classList.contains('is-hidden')) { holdUntil = Date.now() + 1500; header.classList.remove('is-hidden'); }
    });
    PP.setHeaderLocked = function (v) { locked = !!v; holdUntil = Date.now() + 1200; if (locked) header.classList.remove('is-hidden'); header.classList.remove('is-night'); update(); };
    update();
  }

  /* ---------------------------------------------------------------- 2. menu */
  function initMenu() {
    var menu = $('#menu');
    var btn = $('#menu-btn');
    if (!menu || !btn) return;
    var label = $('.menu-btn__label', btn);
    var isOpen = false;
    var lastFocus = null;
    var closeTimer = 0;
    var items = $$('.menu__item', menu);
    var previews = $$('.menu__img', menu);
    var INERT = ['content', 'contact', 'actions', 'nav-primary'];

    function setInert(v) {
      INERT.forEach(function (id) { var el = doc.getElementById(id); if (el) el.inert = v; });
      var visit = $('#nav-visit');
      if (visit && visit.closest) { var area = visit.closest('.magnet-area'); if (area) area.inert = v; }
    }
    function setGroup(item, open) {
      item.classList.toggle('is-open', open);
      var t = $('.menu__toggle', item);
      if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    function openOnly(item) { items.forEach(function (g) { setGroup(g, g === item); }); }
    function preview(k) {
      previews.forEach(function (img) { img.classList.toggle('is-current', img.getAttribute('data-preview') === k); });
    }
    function show() {
      if (isOpen) return;
      isOpen = true;
      clearTimeout(closeTimer);
      lastFocus = doc.activeElement;
      menu.hidden = false;
      menu.classList.remove('is-closing');
      void menu.offsetWidth;                       /* the wipe starts from the closed state */
      menu.classList.add('is-open');
      html.classList.add('menu-open');
      btn.setAttribute('aria-expanded', 'true');
      if (label) label.textContent = 'Close';
      setInert(true);
      if (PP.setHeaderLocked) PP.setHeaderLocked(true);
      /* open the group of the current page; the preview follows it */
      var cur = $('.menu__link[aria-current]', menu);
      var item = cur && cur.closest ? cur.closest('.menu__item') : null;
      if (item) { openOnly(item); preview(cur.getAttribute('data-menu-preview')); }
      var first = cur || $('.menu__link', menu);
      setTimeout(function () { if (isOpen && first) first.focus({ preventScroll: true }); }, 90);
    }
    function close(restoreFocus) {
      if (!isOpen) return;
      isOpen = false;
      menu.classList.remove('is-open');
      menu.classList.add('is-closing');
      html.classList.remove('menu-open');
      btn.setAttribute('aria-expanded', 'false');
      if (label) label.textContent = 'Menu';
      setInert(false);
      if (PP.setHeaderLocked) PP.setHeaderLocked(false);
      var done = function () { if (!isOpen) { menu.hidden = true; menu.classList.remove('is-closing'); } };
      if (reducedMotion()) done(); else closeTimer = setTimeout(done, 380);
      if (restoreFocus !== false) {
        var target = lastFocus && lastFocus.focus && doc.contains(lastFocus) ? lastFocus : btn;
        target.focus({ preventScroll: true });
      }
    }
    PP.menu = { open: show, close: close, isOpen: function () { return isOpen; } };

    on(btn, 'click', function () { if (isOpen) close(); else show(); });
    on(doc, 'keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var list = [btn].concat(focusable(menu));
      var first = list[0];
      var last = list[list.length - 1];
      var active = doc.activeElement;
      if (e.shiftKey && (active === first || list.indexOf(active) === -1)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (active === last || list.indexOf(active) === -1)) { e.preventDefault(); first.focus(); }
    });
    /* disclosure of a group's pages; one group open at a time */
    items.forEach(function (item) {
      var t = $('.menu__toggle', item);
      if (t) on(t, 'click', function () { var open = !item.classList.contains('is-open'); items.forEach(function (g) { setGroup(g, false); }); setGroup(item, open); });
    });
    /* the preview crossfades on hover and on keyboard focus (pointer: preview only, no layout change) */
    $$('.menu__link', menu).forEach(function (a) {
      var k = a.getAttribute('data-menu-preview');
      on(a, 'pointerenter', function () { preview(k); });
      on(a, 'focus', function () { preview(k); });
    });
    /* a click on a link to this same page's anchor closes the menu; other links navigate away */
    on(menu, 'click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href]') : null;
      if (a && a.getAttribute('href').charAt(0) === '#') close(false);
    });
    /* back/forward cache: a restored page must not come back with the menu open */
    on(window, 'pageshow', function (e) { if (e.persisted && isOpen) { isOpen = true; close(false); menu.hidden = true; } });
  }

  /* ---------------------------------------------------------------- 3. sticky actions */
  function initActions() {
    var bar = $('#actions');
    if (!bar || body.getAttribute('data-actions') === 'off') return;
    var state = { past: false, field: false, cta: false };
    function apply() { bar.classList.toggle('is-visible', state.past && !state.field && !state.cta && !html.classList.contains('menu-open')); }
    var ticking = false;
    function onScroll() {
      if (ticking) return; ticking = true;
      raf(function () { ticking = false; state.past = (window.pageYOffset || 0) > Math.min(360, window.innerHeight * 0.5); apply(); });
    }
    on(window, 'scroll', onScroll, { passive: true });
    on(doc, 'focusin', function (e) { if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) { state.field = true; apply(); } });
    on(doc, 'focusout', function (e) { if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName)) { state.field = false; apply(); } });
    var cta = $('.cta-band');
    if (cta && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { state.cta = entries[0].isIntersecting; apply(); }, { threshold: 0.15 }).observe(cta);
    }
    if (window.MutationObserver) new MutationObserver(apply).observe(html, { attributes: true, attributeFilter: ['class'] });
    onScroll();
  }

  /* ---------------------------------------------------------------- 4. reveal */
  function initReveal() {
    var targets = $$('[data-reveal], [data-reveal-group] > *, .sheet-rule');
    if (!targets.length) return;
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    $$('[data-reveal-group]').forEach(function (g) {
      Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', Math.min(i, 7)); });
    });
    var h = window.innerHeight || 800;
    var pending = [];
    targets.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h * 0.96) el.classList.add('is-in'); else pending.push(el);   /* on screen, or already scrolled past */
    });
    html.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    pending.forEach(function (el) { io.observe(el); });
    PP.revealAll = function () { targets.forEach(function (el) { el.classList.add('is-in'); }); };
    on(window, 'beforeprint', PP.revealAll);
    /* a focused control inside a block that has not been revealed shows it at once */
    on(doc, 'focusin', function (e) { var b = e.target.closest ? e.target.closest('[data-reveal], [data-reveal-group] > *') : null; if (b) b.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------------- 5. accordions */
  function initAccordions() {
    var all = $$('details.accordion__item');
    if (!all.length) return;
    function openFor(el) {
      /* open every closed <details> that contains el (or is el) */
      var changed = false;
      var n = el;
      while (n && n !== doc.body) {
        if (n.tagName === 'DETAILS' && !n.open) { n.open = true; changed = true; }
        n = n.parentNode;
      }
      return changed;
    }
    function fromHash() {
      var id = (location.hash || '').slice(1);
      try { id = decodeURIComponent(id); } catch (e) { /* a malformed address such as #100%: use it as it is */ }
      if (!id) return;
      var el = doc.getElementById(id);
      if (el && openFor(el)) raf(function () { el.scrollIntoView(); });
    }
    fromHash();
    on(window, 'hashchange', fromHash);
    /* expand all / collapse all */
    $$('[data-accordion-toggle]').forEach(function (b) {
      var target = b.getAttribute('data-accordion-toggle');
      var scope = (target && doc.getElementById(target.replace(/^#/, ''))) || b.closest('[data-accordion-scope]') || doc;
      function items() { return $$('details.accordion__item', scope); }
      if (scope && scope.id) b.setAttribute('aria-controls', scope.id);
      function sync() {
        var every = items().every(function (d) { return d.open; });
        b.textContent = every ? 'Collapse all' : 'Expand all';
        b.setAttribute('aria-expanded', every ? 'true' : 'false');
      }
      on(b, 'click', function () {
        var every = items().every(function (d) { return d.open; });
        items().forEach(function (d) { d.open = !every; });
        sync();
      });
      items().forEach(function (d) { on(d, 'toggle', sync); });
      sync();
    });
    /* data-accordion="single": one open at a time inside the group */
    $$('[data-accordion="single"]').forEach(function (g) {
      $$('details.accordion__item', g).forEach(function (d) {
        on(d, 'toggle', function () {
          if (!d.open) return;
          $$('details.accordion__item', g).forEach(function (o) { if (o !== d) o.open = false; });
        });
      });
    });
    /* printing shows every answer */
    var was = [];
    on(window, 'beforeprint', function () { was = all.map(function (d) { return d.open; }); all.forEach(function (d) { d.open = true; }); });
    on(window, 'afterprint', function () { all.forEach(function (d, i) { d.open = was[i]; }); });
  }

  /* ---------------------------------------------------------------- 6. filter chips */
  function initFilters() {
    $$('[data-filter-scope]').forEach(function (scope) {
      var chips = $$('button[data-filter]', scope);
      var items = $$('[data-tags], [data-filter-item]', scope);
      if (!chips.length || !items.length) return;
      var status = $('.chips__status', scope);
      var empty = $('.filter-empty', scope);
      var state = {};
      function keyOf(chip) { return chip.getAttribute('data-filter-key') || 'tags'; }
      chips.forEach(function (c) { var k = keyOf(c); if (!(k in state)) state[k] = 'all'; if (c.getAttribute('aria-pressed') === 'true') state[k] = c.getAttribute('data-filter'); });
      function matches(item) {
        for (var k in state) {
          if (state[k] === 'all') continue;
          var tokens = (item.getAttribute('data-' + k) || '').split(/\s+/);
          if (tokens.indexOf(state[k]) === -1) return false;
        }
        return true;
      }
      function apply() {
        var shown = 0;
        items.forEach(function (it) { var ok = matches(it); it.hidden = !ok; if (ok) shown++; });
        chips.forEach(function (c) { c.setAttribute('aria-pressed', state[keyOf(c)] === c.getAttribute('data-filter') ? 'true' : 'false'); });
        if (status) status.textContent = shown === items.length ? 'Showing all ' + items.length : 'Showing ' + shown + ' of ' + items.length;
        if (empty) empty.classList.toggle('is-shown', shown === 0);
      }
      chips.forEach(function (c) { on(c, 'click', function () { state[keyOf(c)] = c.getAttribute('data-filter'); apply(); }); });
      apply();
    });
  }

  /* ---------------------------------------------------------------- 7. gallery lightbox */
  function initLightbox() {
    var links = $$('a[data-lightbox]');
    if (!links.length || typeof HTMLDialogElement === 'undefined') return;
    var dlg = null, img, cap, count, current = -1, group = [], opener = null;
    function build() {
      dlg = doc.createElement('dialog');
      dlg.className = 'dialog lightbox';
      dlg.setAttribute('aria-label', 'Photograph viewer');
      dlg.innerHTML = '<figure class="dialog__figure"><img class="dialog__img" alt="" width="1600" height="1067"><figcaption class="dialog__cap plate__cap"></figcaption></figure>' +
        '<div class="dialog__nav"><button type="button" class="dialog__btn" data-lb="prev">Previous</button><button type="button" class="dialog__btn" data-lb="next">Next</button><span class="dialog__count" aria-live="polite"></span></div>' +
        '<button class="dialog__close" type="button">Close</button>';
      doc.body.appendChild(dlg);
      img = $('.dialog__img', dlg); cap = $('.dialog__cap', dlg); count = $('.dialog__count', dlg);
      on($('.dialog__close', dlg), 'click', function () { dlg.close(); });
      on($('[data-lb="prev"]', dlg), 'click', function () { go(-1); });
      on($('[data-lb="next"]', dlg), 'click', function () { go(1); });
      on(dlg, 'click', function (e) { if (e.target === dlg) dlg.close(); });
      on(dlg, 'keydown', function (e) { if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } });
      on(dlg, 'close', function () { html.classList.remove('lightbox-open'); if (opener && doc.contains(opener)) opener.focus({ preventScroll: true }); });
    }
    function captionOf(a) {
      var c = a.getAttribute('data-caption');
      if (c) return c;
      var li = a.closest ? a.closest('.gallery__item, figure, li') : null;
      var fc = li && $('.gallery__cap, figcaption', li);
      return fc ? fc.textContent : '';
    }
    function show(i) {
      var a = group[i];
      current = i;
      var thumb = $('img', a);
      img.src = a.getAttribute('href');
      img.alt = a.getAttribute('data-alt') || (thumb ? thumb.alt : '');
      if (thumb && thumb.naturalWidth) { img.width = thumb.naturalWidth; img.height = thumb.naturalHeight; }
      cap.textContent = captionOf(a);
      count.textContent = (i + 1) + ' of ' + group.length;
    }
    function go(d) { if (!group.length) return; show((current + d + group.length) % group.length); }
    links.forEach(function (a) {
      on(a, 'click', function (e) {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
        e.preventDefault();
        if (!dlg) build();
        var scope = a.closest('[data-gallery]') || doc;
        group = $$('a[data-lightbox]', scope);
        opener = a;
        show(group.indexOf(a));
        html.classList.add('lightbox-open');
        dlg.showModal();
      });
    });
  }

  /* ---------------------------------------------------------------- 8. prototype forms */
  /* the hours and the number come from build/nav.json, through data-hours and data-call on <body> (shell.py) */
  function schoolHours() { return (body && body.getAttribute('data-hours')) || ''; }
  function schoolCall() { return (body && body.getAttribute('data-call')) || ''; }
  function defaultNotice() {
    return "This form is a prototype: nothing was sent. To reach the school, call the line for your child's section" + (schoolHours() ? ' ' + schoolHours() : '') + '.';
  }
  function initForms() {
    $$('form[data-prototype-form]').forEach(function (form) {
      var notice = $('.form-notice', form.parentNode) || $('.form-notice');
      function labelOf(f) {
        var l = f.id && $('label[for="' + f.id + '"]', form.ownerDocument);
        if (!l && f.closest) l = f.closest('label');
        return l ? l.textContent.replace(/\s*\(optional\)\s*/i, '').trim() : (f.name || 'this field');
      }
      function setError(f, msg) {
        var err = f.id && doc.getElementById(f.id + '-err');
        if (err) err.textContent = msg;
        if (msg) f.setAttribute('aria-invalid', 'true'); else f.removeAttribute('aria-invalid');
      }
      function check(f) {
        var v = (f.value || '').trim();
        var label = labelOf(f).toLowerCase();
        if (f.type === 'radio') return '';          /* radio groups: fieldset[data-required] */
        if (f.type === 'checkbox') return (f.required && !f.checked) ? 'Tick ' + label + '.' : '';
        if (f.required && !v) return f.tagName === 'SELECT' ? 'Choose ' + label + '.' : 'Enter ' + label + '.';
        if (v && f.type === 'tel' && (v.match(/\d/g) || []).length < 8) return 'Enter a phone number with at least 8 digits.';
        if (v && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter an email address like name@example.com.';
        return '';
      }
      var fields = $$('input, select, textarea', form).filter(function (f) { return f.type !== 'submit' && f.type !== 'button' && f.type !== 'hidden'; });
      fields.forEach(function (f) { on(f, 'input', function () { setError(f, ''); }); on(f, 'change', function () { setError(f, ''); }); });
      on(form, 'submit', function (e) {
        e.preventDefault();
        var firstBad = null;
        fields.forEach(function (f) { var msg = check(f); setError(f, msg); if (msg && !firstBad) firstBad = f; });
        /* required radio / checkbox groups */
        $$('fieldset[data-required]', form).forEach(function (fs) {
          var any = $$('input:checked', fs).length > 0;
          var err = $('.field__error', fs);
          if (err) err.textContent = any ? '' : 'Choose one.';
          if (!any && !firstBad) firstBad = $('input', fs);
        });
        if (firstBad) { firstBad.focus(); if (notice) notice.classList.remove('is-shown'); return; }
        if (notice) {
          var lead = $('.form-notice__text', notice);
          if (lead && !lead.textContent.trim()) lead.textContent = defaultNotice();
          notice.classList.add('is-shown');
          notice.setAttribute('tabindex', '-1');
          notice.focus({ preventScroll: false });
        }
      });
    });
  }

  /* ---------------------------------------------------------------- 9. search */
  function initSearch() {
    var box = $('[data-search]');
    if (!box) return;
    var form = $('form', box);
    var input = $('input[type="search"], input[name="q"]', box);
    var list = $('.search-results', box);
    var status = $('.search-status', box);
    var indexUrl = box.getAttribute('data-index');
    var data = null;
    function words(s) { return (s || '').toLowerCase().replace(/[^a-z0-9À-ɏ]+/g, ' ').trim().split(' ').filter(Boolean); }
    function score(entry, terms) {
      var t = words(entry.t).join(' '), h = words((entry.h || []).join(' ')).join(' '), d = words(entry.d).join(' '), g = words(entry.g).join(' ');
      var total = 0;
      for (var i = 0; i < terms.length; i++) {
        var w = terms[i], s = 0;
        if (t.indexOf(w) !== -1) s += 8 + (t.indexOf(' ' + w) !== -1 || t.indexOf(w) === 0 ? 3 : 0);
        if (h.indexOf(w) !== -1) s += 4;
        if (d.indexOf(w) !== -1) s += 2;
        if (g.indexOf(w) !== -1) s += 1;
        if (!s) return 0;                 /* every word must appear somewhere */
        total += s;
      }
      return total;
    }
    function render(q) {
      var terms = words(q);
      list.innerHTML = '';
      if (!terms.length) { status.textContent = ''; return; }
      var hits = data.map(function (e) { return { e: e, s: score(e, terms) }; }).filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s; }).slice(0, 20);
      status.textContent = hits.length ? hits.length + (hits.length === 1 ? ' page matches ' : ' pages match ') + '“' + q + '”.' :
        'No page matches “' + q + '”. Try a shorter word' + (schoolCall() ? ', or call the school on ' + schoolCall() : '') + '.';
      hits.forEach(function (x) {
        var li = doc.createElement('li');
        li.className = 'search-result';
        var h3 = doc.createElement('h3'), a = doc.createElement('a'), p = doc.createElement('p'), sp = doc.createElement('span');
        a.className = 'link'; a.href = ROOT + x.e.u; a.textContent = x.e.t;
        h3.appendChild(a); p.textContent = x.e.d;
        sp.className = 'search-result__path'; sp.textContent = x.e.g ? x.e.g : 'Home';
        li.appendChild(h3); li.appendChild(p); li.appendChild(sp);
        list.appendChild(li);
      });
    }
    function run(q) {
      if (data) { render(q); return; }
      status.textContent = 'Searching...';
      var req = new XMLHttpRequest();
      req.open('GET', indexUrl);
      req.onload = function () { try { data = JSON.parse(req.responseText); } catch (e) { data = []; } render(q); };
      req.onerror = function () { status.textContent = 'Search is not available right now. Use the menu to find a page.'; };
      req.send();
    }
    var q0 = (new URLSearchParams(location.search)).get('q');
    if (q0) { input.value = q0; run(q0); }
    on(form, 'submit', function (e) {
      e.preventDefault();
      var q = input.value.trim();
      try { history.replaceState(null, '', q ? '?q=' + encodeURIComponent(q) : location.pathname); } catch (err) { /* file: */ }
      run(q);
    });
  }

  /* ---------------------------------------------------------------- 10. small things */
  function initMisc() {
    /* the chapter navigation follows the chapter on screen */
    var nav = $('.chapter-nav');
    if (nav) {
      var chapters = [];
      $$('a[href^="#"]', nav).forEach(function (a) {
        var el = doc.getElementById(a.getAttribute('href').slice(1));
        if (el) chapters.push({ el: el, a: a });
      });
      /* the current chapter is the last one whose top has passed the line at 35% of the screen; above the first
         chapter nothing is current. Looked at again on scroll and resize (one frame at a time), so a jump to the
         end of the page or back to the top is right too. */
      var row = $('ol', nav);
      var update = function () {
        var line = (window.innerHeight || 800) * 0.35, cur = null;
        chapters.forEach(function (c) { if (c.el.getBoundingClientRect().top <= line) cur = c; });
        chapters.forEach(function (c) {
          if (cur && c === cur) c.a.setAttribute('aria-current', 'true'); else c.a.removeAttribute('aria-current');
        });
        /* below 1024 px the index is a row that scrolls sideways: keep the current link in view (no animation, so it
           respects reduced motion); on desktop the list is not a scroller and nothing moves */
        if (row && row.scrollWidth > row.clientWidth + 1) {
          var want = cur ? cur.a.offsetLeft - (row.clientWidth - cur.a.offsetWidth) / 2 : 0;   /* above the first chapter: back to the start */
          if (Math.abs(row.scrollLeft - want) > 4) row.scrollLeft = want;
        }
      };
      var queued = false;
      var schedule = function () {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(function () { queued = false; update(); });
      };
      if (chapters.length) {
        on(window, 'scroll', schedule, { passive: true });
        on(window, 'resize', schedule);
        update();
      }
    }
    /* a table that scrolls sideways can be scrolled from the keyboard, and the stop has a name (its caption). The test runs
       again when the window changes size (a phone turned round, a zoom), so the stop appears and goes with the overflow. */
    var wraps = $$('.table-wrap');
    var wrapSeq = 0;
    function tableStops() {
      wraps.forEach(function (w) {
        var scrolls = w.scrollWidth > w.clientWidth + 1;
        if (scrolls) {
          w.setAttribute('tabindex', '0');
          w.setAttribute('role', 'region');
          if (!w.getAttribute('aria-label') && !w.getAttribute('aria-labelledby')) {
            var cap = $('caption', w);
            if (cap) {
              if (!cap.id) cap.id = 'table-cap-' + (++wrapSeq);
              w.setAttribute('aria-labelledby', cap.id);
            } else {
              w.setAttribute('aria-label', 'Table, scrolls sideways');
            }
          }
        } else if (w.getAttribute('data-stop') === 'auto') {
          w.removeAttribute('tabindex'); w.removeAttribute('role'); w.removeAttribute('aria-labelledby'); w.removeAttribute('aria-label');
        }
        if (scrolls && !w.hasAttribute('data-stop')) w.setAttribute('data-stop', 'auto');
      });
    }
    if (wraps.length) { tableStops(); on(window, 'resize', tableStops); }
    /* links to this page's own address carry aria-current when the build did not set it */
    var here = location.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
    $$('#nav-primary a, .menu__sub a').forEach(function (a) {
      if (a.hasAttribute('aria-current')) return;
      try { if (new URL(a.href, location.href).pathname.replace(/index\.html$/, '').replace(/\/?$/, '/') === here) a.setAttribute('aria-current', 'page'); } catch (e) { /* ignore */ }
    });
    /* the reduce-motion switch in the footer (shared with the home through localStorage pp:motion) */
    var t = $('#motion-toggle');
    if (t) {
      t.setAttribute('aria-pressed', store('pp:motion') === 'reduced' ? 'true' : 'false');
      on(t, 'click', function () {
        var pressed = t.getAttribute('aria-pressed') === 'true';
        store('pp:motion', pressed ? null : 'reduced');
        t.setAttribute('aria-pressed', pressed ? 'false' : 'true');
        if (pressed) html.removeAttribute('data-motion'); else html.setAttribute('data-motion', 'reduced');
        if (!pressed && PP.revealAll) PP.revealAll();
      });
    }
  }

  /* ---------------------------------------------------------------- start */
  function start() {
    var steps = [initHeader, initMenu, initActions, initReveal, initAccordions, initFilters, initLightbox, initForms, initSearch, initMisc];
    steps.forEach(function (fn) { try { fn(); } catch (e) { if (window.console) console.error('[inner.js] ' + (fn.name || 'step') + ' failed', e); } });
    PP._started = true;
    readyFns.forEach(function (fn) { try { fn(); } catch (e) { if (window.console) console.error('[inner.js] addition failed', e); } });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();

  /* Page groups do not add code here any more: six agents editing one file lose each other's work, and a block added after
     the closing line of this function cannot see the helpers. Write build/additions/<group>.js (see the head of this file). */
})();
