/* =====================================================================
   PLAYPEN SCHOOL — Interaction layer
   Dependency-free. No third-party CDNs (no supply-chain surface).
   Respects prefers-reduced-motion throughout.
   ===================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Scroll reveals ------------------------------------------- */
  function initReveals() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- 2. Sticky header shadow ------------------------------------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---- 3. Mobile navigation ---------------------------------------- */
  function initMobileNav() {
    var burger = document.querySelector('.burger');
    var nav = document.querySelector('.mobile-nav');
    if (!burger || !nav) return;

    function setOpen(open) {
      if (open) {
        // The utility bar and announcement bar sit above the sticky header and
        // scroll away, so the drawer's top offset has to be measured, not assumed.
        var header = document.querySelector('.site-header');
        var bottom = header ? header.getBoundingClientRect().bottom : 78;
        nav.style.paddingTop = Math.max(bottom, 60) + 28 + 'px';
      }
      burger.classList.toggle('is-open', open);
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    }
    burger.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); burger.focus(); }
    });
  }

  /* ---- 4. Homepage hero crossfade ---------------------------------- */
  function initHero() {
    var media = document.querySelector('.hero-media');
    if (!media) return;
    var slides = media.querySelectorAll('img');
    var dotWrap = document.querySelector('.hero-dots');
    if (slides.length < 2) { if (slides[0]) slides[0].classList.add('is-active'); return; }

    var index = 0;
    var timer = null;
    var dots = [];

    if (dotWrap) {
      for (var i = 0; i < slides.length; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show image ' + (i + 1) + ' of ' + slides.length);
        (function (n) { b.addEventListener('click', function () { show(n); restart(); }); })(i);
        dotWrap.appendChild(b);
        dots.push(b);
      }
    }

    function show(n) {
      index = n % slides.length;
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle('is-active', i === index);
        if (dots[i]) dots[i].setAttribute('aria-current', i === index ? 'true' : 'false');
      }
    }
    function next() { show(index + 1); }
    function restart() { if (timer) { clearInterval(timer); } if (!reduce) { timer = setInterval(next, 6500); } }

    show(0);
    if (!reduce) restart();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { clearInterval(timer); } else { restart(); }
    });
  }

  /* ---- 5. Count-up statistics -------------------------------------- */
  function initCounters() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.textContent = n.getAttribute('data-count') + (n.getAttribute('data-suffix') || ''); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var start = null, dur = 1500;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ---- 6. Accordion — single-open groups --------------------------- */
  function initAccordions() {
    document.querySelectorAll('[data-accordion-single]').forEach(function (group) {
      var items = group.querySelectorAll('details');
      items.forEach(function (d) {
        d.addEventListener('toggle', function () {
          if (!d.open) return;
          items.forEach(function (other) { if (other !== d) other.open = false; });
        });
      });
    });
  }

  /* ---- 7. Achievement / gallery filters ---------------------------- */
  function initFilters() {
    document.querySelectorAll('[data-filter-group]').forEach(function (group) {
      var buttons = group.querySelectorAll('[data-filter]');
      var targetSel = group.getAttribute('data-filter-group');
      var items = document.querySelectorAll(targetSel + ' [data-category]');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var val = btn.getAttribute('data-filter');
          buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
          items.forEach(function (item) {
            var cats = (item.getAttribute('data-category') || '').split(' ');
            var match = val === 'all' || cats.indexOf(val) !== -1;
            item.hidden = !match;
          });
        });
      });
    });
  }

  /* ---- 8. Enquiry forms (static demo — wire to a backend on launch) - */
  function initForms() {
    document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var note = form.querySelector('[data-form-note]');
        if (note) {
          note.hidden = false;
          note.textContent = 'This is a design prototype. Connect this form to the school’s mail handler or CRM before launch — then submissions will reach the Admissions Office.';
          note.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* ---- 9. Current year in footer ----------------------------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---- Boot -------------------------------------------------------- */
  function boot() {
    initHeader();
    initMobileNav();
    initReveals();
    initHero();
    initCounters();
    initAccordions();
    initFilters();
    initForms();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
