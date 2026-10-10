/* Header states (over-hero / solid / hidden / night), aria-current, --nav-h,
   the sticky actions (the phone bottom bar; the desktop pill was removed in the polish pass). */

const state = { pastHero: false, admissions: false, inputFocus: false, sheet: false, menu: false, dialog: false, overHero: true, dir: 0, y: 0, holdUntil: 0 };
let header, actions, bar, html;
let ctxRef;

export function init(ctx) {
  ctxRef = ctx;
  html = document.documentElement;
  header = document.getElementById('top');
  actions = document.getElementById('actions');
  bar = header && header.querySelector('.nav__bar');
  if (!header) return;

  const setNavH = () => { if (bar) html.style.setProperty('--nav-h', bar.offsetHeight + 'px'); };
  setNavH();
  window.addEventListener('resize', setNavH);

  /* an overlay closing hands focus back to a header control: the header is shown for it */
  const hold = (ms) => { state.holdUntil = performance.now() + ms; state.dir = 0; };
  window.addEventListener('pp:sheet', (e) => { state.sheet = !!(e.detail && e.detail.open); if (!state.sheet) hold(1200); apply(); });
  window.addEventListener('pp:menu', (e) => { state.menu = !!(e.detail && e.detail.open); if (!state.menu) hold(1200); apply(); });
  window.addEventListener('pp:dialog', (e) => { state.dialog = !!(e.detail && e.detail.open); apply(); });
  /* a header or menu link scrolls the page on its own (1.4 s): the header stays for the ride and
     500 ms after it, instead of hiding because that scroll runs downward */
  window.addEventListener('pp:anchor', () => { hold(1900); apply(); });
  /* focus inside the header always brings it back on screen */
  document.addEventListener('focusin', (e) => {
    if (header.contains(e.target) && header.classList.contains('is-hidden')) { hold(1500); apply(); }
    if (isField(e.target)) { state.inputFocus = true; applyActions(); }
  });
  document.addEventListener('focusout', (e) => { if (isField(e.target)) { state.inputFocus = false; applyActions(); } });
  apply();
}

function isField(el) {
  return !!(el && el.matches && el.matches('input, select, textarea'));
}

function apply() {
  if (!header) return;
  const { still } = ctxRef;
  const locked = state.sheet || state.menu || state.dialog;
  header.classList.toggle('is-over-hero', state.overHero);
  header.classList.toggle('is-solid', !state.overHero);
  const hide = !state.overHero && state.dir > 0 && !still && !locked;
  header.classList.toggle('is-hidden', hide);
  applyActions();
}

function applyActions() {
  if (!actions) return;
  const visible = state.pastHero && !state.admissions && !state.inputFocus && !state.sheet && !state.menu && !state.dialog;
  actions.classList.toggle('is-visible', visible);
}

export function create(ctx) {
  const { ScrollTrigger } = ctx;
  if (!header) return null;

  /* Direction and the 80 px threshold. `end: 'max'` is re-measured by ScrollTrigger after every
     refresh, once the Ascent's pin spacer is in the page (a function end would be computed before
     the pin and stop short of the real page bottom); refreshPriority -1 orders the refresh after
     the pin as well. */
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    refreshPriority: -1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const y = self.scroll();
      state.y = y;
      state.overHero = y < 80;
      state.dir = performance.now() < state.holdUntil ? 0 : (ctx.lenis ? ctx.lenis.direction : self.direction);
      apply();
    },
  });

  /* Night ground: the Ledger from its top edge at the header's midline (36 px); the footer from
     the line where the header bar meets it, because at some viewport heights the footer's top
     never scrolls past 36 px (1440 × 900: it stops at 64 px) and the header would stay paper */
  [['#ledger', 'top 36px'], ['#contact', () => 'top ' + (bar ? bar.offsetHeight : 72) + 'px']].forEach(([sel, start]) => {
    if (!document.querySelector(sel)) return;
    ScrollTrigger.create({
      trigger: sel,
      start,
      end: 'bottom 36px',
      onToggle: () => {
        const night = ScrollTrigger.getAll().some((t) => t.vars && t.vars.nightMark && t.isActive);
        header.classList.toggle('is-night', night);
      },
      nightMark: true,
    });
  });

  /* aria-current on the primary nav */
  const links = Array.from(document.querySelectorAll('#nav-primary a[data-nav]'));
  links.forEach((a) => {
    const target = document.getElementById(a.dataset.nav);
    if (!target) return;
    ScrollTrigger.create({
      trigger: target,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((l) => l.removeAttribute('aria-current'));
          a.setAttribute('aria-current', 'true');
        } else if (a.getAttribute('aria-current')) {
          a.removeAttribute('aria-current');
        }
      },
    });
  });

  /* Sticky actions: after 60 % of the hero, never over Admissions. At the exact page bottom the
     trigger reports "left" (progress 1, isActive false) and a jump straight there never toggles,
     so the state is read on every update: the pill stays over the footer. */
  const pastHero = (self) => { state.pastHero = self.isActive || self.progress >= 1; applyActions(); };
  ScrollTrigger.create({
    trigger: '#hero',
    start: '60% top',
    end: 'max',
    refreshPriority: -1,
    invalidateOnRefresh: true,
    onToggle: pastHero,
    onUpdate: pastHero,
  });
  ScrollTrigger.create({
    trigger: '#admissions',
    start: 'top 85%',
    end: 'bottom 15%',
    onToggle: (self) => { state.admissions = self.isActive; applyActions(); },
  });
  return null;
}
