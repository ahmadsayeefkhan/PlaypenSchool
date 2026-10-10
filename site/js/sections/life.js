/* Sheet 04, School life: the opener (curtain + the page's one parallax, ±6 %), nine plates with
   curtain reveals, the lightbox dialog with the plate large and its caption. */

let section, dialog, dialogImg, dialogCap, lastOpener, ctxRef;

export function init(ctx) {
  ctxRef = ctx;
  section = document.getElementById('life');
  dialog = document.getElementById('plate-dialog');
  if (!section || !dialog) return;
  dialogImg = dialog.querySelector('.dialog__img');
  dialogCap = dialog.querySelector('.dialog__cap');

  section.addEventListener('click', (e) => {
    const btn = e.target.closest('.plate__open');
    if (!btn) return;
    e.preventDefault();
    openPlate(btn);
  });
  dialog.querySelector('.dialog__close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    if (ctx.lenis) ctx.lenis.start();
    ctx.emit('pp:dialog', { open: false });
    if (lastOpener && lastOpener.isConnected) lastOpener.focus({ preventScroll: true });
  });
}

function largest(img) {
  const set = (img.getAttribute('srcset') || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!set.length) return img.currentSrc || img.src;
  return set[set.length - 1].split(/\s+/)[0];
}

function openPlate(btn) {
  const img = btn.querySelector('img');
  const figure = btn.closest('figure');
  const cap = figure && figure.querySelector('.plate__cap');
  if (!img) return;
  lastOpener = btn;
  dialogImg.src = largest(img);
  dialogImg.alt = img.alt || '';
  dialogImg.width = img.naturalWidth || img.width;
  dialogImg.height = img.naturalHeight || img.height;
  dialogCap.innerHTML = cap ? cap.innerHTML : '';
  if (ctxRef.lenis) ctxRef.lenis.stop();
  ctxRef.emit('pp:dialog', { open: true });
  if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
}

export function create(ctx) {
  const { gsap, still } = ctx;
  if (!section) return null;

  const opener = section.querySelector('#life-opener');
  if (opener) {
    ctx.clipReveal(opener, { start: 'top 80%' });
    if (!still) {
      const img = opener.querySelector('img');
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: opener, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  }

  const body = section.querySelector('.life__body');
  const gridTitle = section.querySelector('.life__grid-title');
  ctx.reveal([body, gridTitle].filter(Boolean));

  const plates = Array.from(section.querySelectorAll('#plates .plate[data-clip]'));
  plates.forEach((plate, i) => ctx.clipReveal(plate, { start: 'top 88%', delay: ctx.desktop ? (i % 3) * 0.12 : 0 }));

  const tail = [section.querySelector('.life__clubs'), section.querySelector('.life__link')].filter(Boolean);
  ctx.reveal(tail);
  return null;
}
