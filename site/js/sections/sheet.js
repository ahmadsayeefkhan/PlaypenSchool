/* The Sheet: the right-side drawer with the Visit / Enquire / Apply variants, a prototype
   enquiry form that sends nothing and says so, focus management, Esc, inert page. */

const STATUS = "This enquiry form is a prototype: nothing was sent. To reach the school, call the admissions line for your child's section between 9.00 am and 1.00 pm.";
const INERT = ['content', 'top', 'contact', 'actions', 'menu'];

let sheet, panel, title, closeBtn, variants, status, form, ctxRef;
let open = false;
let opener = null;
let closeTimer = 0;

export function init(ctx) {
  ctxRef = ctx;
  sheet = document.getElementById('sheet');
  if (!sheet) return;
  panel = sheet.querySelector('.sheet__panel');
  title = document.getElementById('sheet-title');
  closeBtn = sheet.querySelector('.sheet__close');
  variants = Array.from(sheet.querySelectorAll('.sheet__variant'));
  status = sheet.querySelector('.sheet__status');
  form = document.getElementById('enquiry');

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-sheet-open]');
    if (!b) return;
    e.preventDefault();
    show(b.dataset.sheetOpen, b);
  });
  closeBtn.addEventListener('click', () => close());
  sheet.addEventListener('click', (e) => { if (e.target === sheet) close(); });
  document.addEventListener('keydown', onKey);
  if (form) {
    form.addEventListener('submit', onSubmit);
    form.querySelectorAll('input, select').forEach((f) => f.addEventListener('input', () => setError(f, '')));
  }
}

function setInert(on) {
  INERT.forEach((id) => { const el = document.getElementById(id); if (el) el.inert = on; });
}

function focusables() {
  return Array.from(panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    .filter((el) => el.offsetParent !== null);
}

function onKey(e) {
  if (!open) return;
  if (e.key === 'Escape') { e.preventDefault(); close(); return; }
  if (e.key !== 'Tab') return;
  const list = focusables();
  if (!list.length) return;
  const first = list[0], last = list[list.length - 1];
  const active = document.activeElement;
  if (e.shiftKey && (active === first || active === title || !panel.contains(active))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (active === last || !panel.contains(active))) { e.preventDefault(); first.focus(); }
}

export function show(variant, by) {
  const { gsap, still, lenis, emit } = ctxRef;
  const v = variants.find((x) => x.dataset.variant === variant) || variants[0];
  variant = v.dataset.variant;
  clearTimeout(closeTimer);
  opener = by || document.activeElement;
  sheet.dataset.variant = variant;
  title.textContent = v.dataset.title || title.textContent;
  if (!open) {
    open = true;
    sheet.hidden = false;
    sheet.classList.remove('is-closing');
    document.documentElement.classList.add('sheet-open');
    setInert(true);
    if (lenis) lenis.stop();
    requestAnimationFrame(() => sheet.classList.add('is-open'));
  }
  emit('pp:sheet', { open: true, variant });
  if (!still) {
    gsap.fromTo(Array.from(v.children), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.15, clearProps: 'transform', overwrite: true });
  }
  setTimeout(() => { if (open) title.focus({ preventScroll: true }); }, 60);
}

export function close() {
  if (!open) return;
  const { lenis, emit, still } = ctxRef;
  open = false;
  sheet.classList.remove('is-open');
  sheet.classList.add('is-closing');
  document.documentElement.classList.remove('sheet-open');
  setInert(false);
  if (lenis) lenis.start();
  emit('pp:sheet', { open: false, variant: sheet.dataset.variant });
  closeTimer = setTimeout(() => { sheet.hidden = true; sheet.classList.remove('is-closing'); }, still ? 50 : 360);
  const target = opener && opener.isConnected ? opener : null;
  if (target && target.focus) target.focus({ preventScroll: true });
  opener = null;
}

function setError(field, text) {
  const err = document.getElementById(field.id + '-err');
  if (err) err.textContent = text;
  if (text) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
}

function onSubmit(e) {
  e.preventDefault();
  const name = form.querySelector('#f-name');
  const phone = form.querySelector('#f-phone');
  const cls = form.querySelector('#f-class');
  let firstBad = null;
  const check = (field, ok, msg) => { setError(field, ok ? '' : msg); if (!ok && !firstBad) firstBad = field; };
  check(name, name.value.trim().length > 1, "Enter the parent's name.");
  check(phone, (phone.value.match(/\d/g) || []).length >= 8, 'Enter a phone number with at least 8 digits.');
  check(cls, !!cls.value, "Choose your child's class of entry.");
  if (firstBad) { firstBad.focus(); return; }
  const variant = form.closest('.sheet__variant');
  variant.classList.add('is-sent');
  status.textContent = STATUS;
  status.setAttribute('tabindex', '-1');
  status.focus({ preventScroll: true });
}

export const isOpen = () => open;
