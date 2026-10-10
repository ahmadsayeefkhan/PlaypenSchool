/* The full-screen menu: clip-path wipe, staggered items, preview crossfade (CSS),
   focus trap, Esc, inert page, Lenis stopped. */

let menu, btn, links, imgs, items, ctxRef;
let open = false;
let lastFocus = null;
let anim = null;

const INERT = ['content', 'contact', 'actions', 'sheet', 'nav-primary'];

export function init(ctx) {
  ctxRef = ctx;
  menu = document.getElementById('menu');
  btn = document.getElementById('menu-btn');
  if (!menu || !btn) return;
  links = Array.from(menu.querySelectorAll('.menu__link'));
  imgs = Array.from(menu.querySelectorAll('.menu__img'));
  items = Array.from(menu.querySelectorAll('.menu__list > li, .menu__aside > *'));

  btn.addEventListener('click', () => (open ? close() : show()));
  /* each group's pages open under its heading (a disclosure button, one group at a time); the same
     behaviour as js/inner.js on the inner pages */
  const groups = Array.from(menu.querySelectorAll('.menu__item'));
  const setGroup = (item, on) => {
    item.classList.toggle('is-open', on);
    const t = item.querySelector('.menu__toggle');
    if (t) t.setAttribute('aria-expanded', on ? 'true' : 'false');
  };
  groups.forEach((item) => {
    const t = item.querySelector('.menu__toggle');
    if (t) t.addEventListener('click', () => { const on = !item.classList.contains('is-open'); groups.forEach((g) => setGroup(g, false)); setGroup(item, on); });
  });
  links.forEach((a) => {
    const k = a.dataset.menuPreview;
    const preview = () => imgs.forEach((img) => img.classList.toggle('is-current', img.dataset.preview === k));
    a.addEventListener('pointerenter', preview);
    a.addEventListener('focus', preview);
    a.addEventListener('click', () => close({ restoreFocus: false }));
  });
  document.addEventListener('keydown', onKey);
  window.addEventListener('pp:anchor', () => { if (open) close({ restoreFocus: false }); });
  window.addEventListener('pp:sheet', (e) => { if (open && e.detail && e.detail.open) close({ restoreFocus: false }); });
}

/* the button reads "Menu" closed and "Close" open (the icon becomes a cross at the same time) */
function setLabel(text) {
  const label = btn.querySelector('.menu-btn__label');
  if (label) label.textContent = text;
}

function setInert(on) {
  INERT.forEach((id) => { const el = document.getElementById(id); if (el) el.inert = on; });
  const visit = document.getElementById('nav-visit');
  if (visit) visit.closest('.magnet-area').inert = on;
  const util = document.querySelector('.nav__util');
  if (util) util.inert = on;
}

function focusables() {
  return [btn, ...Array.from(menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))]
    .filter((el) => el.offsetParent !== null || el === btn);
}

function onKey(e) {
  if (!open) return;
  if (e.key === 'Escape') { e.preventDefault(); close(); return; }
  if (e.key !== 'Tab') return;
  const list = focusables();
  if (!list.length) return;
  const first = list[0], last = list[list.length - 1];
  const active = document.activeElement;
  if (e.shiftKey && (active === first || !list.includes(active))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (active === last || !list.includes(active))) { e.preventDefault(); first.focus(); }
}

export function show() {
  if (open) return;
  const { gsap, still, lenis, emit } = ctxRef;
  open = true;
  lastFocus = document.activeElement;
  if (anim) anim.kill();
  menu.hidden = false;
  menu.classList.add('is-open');
  document.documentElement.classList.add('menu-open');
  btn.setAttribute('aria-expanded', 'true');
  setLabel('Close');
  setInert(true);
  if (lenis) lenis.stop();
  emit('pp:menu', { open: true });

  if (still) {
    anim = gsap.fromTo(menu, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' });
  } else {
    anim = gsap.timeline();
    anim.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power4.inOut' }, 0);
    anim.fromTo(items, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.05, clearProps: 'transform' }, 0.3);
  }
  const first = links[0];
  setTimeout(() => { if (open && first) first.focus({ preventScroll: true }); }, 80);
}

export function close(opts = {}) {
  if (!open) return;
  const { gsap, still, lenis, emit } = ctxRef;
  open = false;
  if (anim) anim.kill();
  document.documentElement.classList.remove('menu-open');
  btn.setAttribute('aria-expanded', 'false');
  setLabel('Menu');
  setInert(false);
  if (lenis) lenis.start();
  emit('pp:menu', { open: false });
  const finish = () => {
    menu.hidden = true;
    menu.classList.remove('is-open');
    gsap.set(menu, { clearProps: 'clipPath,opacity' });
  };
  if (still) anim = gsap.to(menu, { opacity: 0, duration: 0.2, ease: 'none', onComplete: finish });
  else anim = gsap.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.35, ease: 'power4.inOut', onComplete: finish });
  if (opts.restoreFocus !== false && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  else if (opts.restoreFocus !== false) btn.focus({ preventScroll: true });
}

export const isOpen = () => open;
