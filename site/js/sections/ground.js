/* Sheet 01, Ground: the title block (cells by row, four numerals count once),
   the material swatches, the full-bleed building plate (curtain). */

let section;

export function init() {
  section = document.getElementById('ground');
}

function formatCount(value, plain, prefix) {
  const n = Math.round(value);
  return (prefix || '') + (plain ? String(n) : n.toLocaleString('en-GB'));
}

export function create(ctx) {
  const { gsap, ScrollTrigger, still } = ctx;
  if (!section) return null;

  const lead = section.querySelector('.ground__lead');
  if (lead) ctx.reveal([lead]);

  const cells = Array.from(section.querySelectorAll('.cell'));
  const note = section.querySelector('.title-block__note');
  const counters = Array.from(section.querySelectorAll('[data-count]'));

  if (still) {
    ctx.reveal(cells, { stagger: 0.04 });
    if (note) ctx.reveal([note]);
  } else {
    gsap.set(cells, { opacity: 0, y: 12 });
    if (note) gsap.set(note, { opacity: 0 });
    const block = section.querySelector('#title-block');
    gsap.set(block, { '--block-line': 0 });
    ScrollTrigger.create({
      trigger: block, start: 'top 82%', once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(cells, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04, clearProps: 'transform' }, 0.1);
        if (note) tl.to(note, { opacity: 1, duration: 0.5 }, 0.5);
        counters.forEach((dd) => {
          const end = parseFloat(dd.dataset.count);
          const plain = dd.hasAttribute('data-count-plain');
          const prefix = dd.dataset.countPrefix || '';
          const span = dd.querySelector('.count');
          if (!span || !Number.isFinite(end)) return;
          const from = { v: plain ? end - 40 : 0 };
          tl.to(from, {
            v: end, duration: 0.9, ease: 'power3.out',
            onUpdate: () => { span.textContent = formatCount(from.v, plain, prefix); },
            onComplete: () => { span.textContent = formatCount(end, plain, prefix); },
          }, 0.2);
        });
      },
    });
  }

  const materialsLabel = section.querySelector('.ground__materials > .label');
  const swatches = Array.from(section.querySelectorAll('.swatches > li'));
  if (materialsLabel) ctx.reveal([materialsLabel]);
  ctx.reveal(swatches, { stagger: 0.08, y: 20 });

  const plate = section.querySelector('#ground-plate');
  if (plate) ctx.clipReveal(plate, { start: 'top 75%' });
  return null;
}
