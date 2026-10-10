/* Generic reveals: [data-reveal] rises, sheet rules draw, [data-split] headlines mask up,
   [data-clip] curtains, the quotation, parents, admissions, where-next. Shared helpers are
   attached to ctx for the section modules (split, clipReveal, redrawRule). */

const DEFAULT = { y: 32, opacity: 0, duration: 0.9, ease: 'power3.out', start: 'top 85%' };

export function init(ctx) {
  ctx.split = (el, opts) => splitLines(ctx, el, opts);
  ctx.clipReveal = (figure, opts) => clipReveal(ctx, figure, opts);
  ctx.redrawRule = (rule) => redrawRule(ctx, rule);
  ctx.reveal = (targets, opts) => reveal(ctx, targets, opts);
  /* Keyboard: Tab can reach a control whose block is still waiting for its reveal (opacity 0);
     show that block at once so focus never lands on something invisible */
  if (!ctx.still) {
    document.addEventListener('focusin', (e) => {
      const el = e.target;
      if (!(el instanceof Element)) return;
      const block = el.closest('[data-reveal], .cell, .step, .date, .chapter, .stage, .news-card, .plate');
      if (!block) return;
      ctx.safe('reveal.focus', () => showNow(ctx, block));
    });
  }
}

/* The resting state for one block, written at once (the settle pass and the focus guard) */
function showNow(ctx, block) {
  const { gsap } = ctx;
  if (block.style.opacity === '0' || parseFloat(getComputedStyle(block).opacity) === 0) gsap.set(block, { opacity: 1, clearProps: 'transform' });
  block.querySelectorAll('[style*="opacity"]').forEach((el) => { if (el.style.opacity === '0') gsap.set(el, { opacity: 1, clearProps: 'transform' }); });
  block.querySelectorAll('[data-clip] .plate__frame, .plate__frame').forEach((f) => { if (f.style.clipPath) gsap.set(f, { clearProps: 'clipPath' }); const img = f.querySelector('img'); if (img) gsap.set(img, { clearProps: 'transform' }); });
  block.querySelectorAll('.line').forEach((l) => gsap.set(l, { yPercent: 0 }));
  if (block.classList.contains('step')) gsap.set(block, { '--drawn': 1 });
  block.querySelectorAll('.date__year').forEach((y) => gsap.set(y, { clearProps: 'clipPath' }));
}

/* After a restored position or a deep link (main.js): whatever the jump left above the viewport
   with its reveal still pending is shown in its resting state. ScrollTrigger fires onEnter for
   the triggers it passed in one update (it prioritises the enter), so this is the safety net
   for anything built later or hidden by a module's own set(). */
export function settle(ctx) {
  const { gsap, still } = ctx;
  if (still) return;
  const above = (el) => el.getBoundingClientRect().bottom < 0;
  document.querySelectorAll('[data-reveal], .cell, .step, .date, .stage, .news-card, .chapter, .sheet-rule, [data-clip], [data-split]').forEach((block) => {
    if (!above(block)) return;
    showNow(ctx, block);
    if (block.classList.contains('sheet-rule')) {
      const line = block.querySelector('.sheet-rule__line');
      if (line) gsap.set(line, { clearProps: 'transform' });
      gsap.set(block.querySelectorAll(':scope > span'), { opacity: 1, clearProps: 'transform' });
    }
    if (block.classList.contains('chapter')) gsap.set(block.querySelectorAll(':scope > p, :scope > ul'), { opacity: 1, clearProps: 'transform' });
  });
}

/* Lines-only SplitText with a mask; returns the SplitText instance (or null in the still tier). */
export function splitLines(ctx, el, opts = {}) {
  const { gsap, SplitText, still } = ctx;
  if (!el) return null;
  if (still) { el.classList.add('is-split'); return null; }
  const trigger = opts.trigger !== undefined ? opts.trigger : el;
  try {
    const split = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      linesClass: 'line',
      aria: 'auto',
      onSplit(self) {
        el.classList.add('is-split');
        if (opts.manual) return gsap.set(self.lines, { yPercent: 110 });
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: opts.duration || 1.1,
          ease: opts.ease || 'expo.out',
          stagger: opts.stagger !== undefined ? opts.stagger : 0.06,
          scrollTrigger: trigger ? { trigger, start: opts.start || 'top 85%', once: true } : undefined,
        });
      },
    });
    return split;
  } catch (e) {
    ctx.err('split', e);
    el.classList.add('is-split');
    return null;
  }
}

/* Curtain: the frame clips from the bottom while the image settles from 1.08 → 1.
   Still tier: nothing (the plate is simply there; no trigger, no inline style). */
export function clipReveal(ctx, figure, opts = {}) {
  const { gsap, still } = ctx;
  if (still) return null;
  const frame = figure.querySelector('.plate__frame') || figure;
  const img = figure.querySelector('img');
  const trigger = opts.trigger || figure;
  const tl = gsap.timeline({ scrollTrigger: { trigger, start: opts.start || 'top 80%', once: true }, delay: opts.delay || 0 });
  tl.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut', clearProps: 'clipPath' }, 0);
  // clearProps at the end: the inline transform would otherwise block the CSS hover scale (main.css §5)
  if (img) tl.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'power3.out', clearProps: 'transform' }, 0);
  const cap = figure.querySelector(':scope > .plate__cap');
  if (cap) tl.from(cap, { opacity: 0, y: 8, duration: 0.5, ease: 'power3.out' }, 0.5);
  return tl;
}

export function redrawRule(ctx, rule) {
  const { gsap, still } = ctx;
  const line = rule.querySelector('.sheet-rule__line');
  if (!line || still) return;
  gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: 'power3.out', overwrite: true });
}

/* A reveal for a list of elements; uses ScrollTrigger.batch so rows stagger naturally.
   Still tier (reduced motion): nothing is hidden and no trigger is made, so a cell at the foot of
   the screen is readable at once instead of fading in when it passes 85 % of the viewport. */
export function reveal(ctx, targets, opts = {}) {
  const { gsap, ScrollTrigger, still } = ctx;
  if (still) return;
  const els = Array.isArray(targets) ? targets : Array.from(targets);
  if (!els.length) return;
  const o = { ...DEFAULT, ...opts };
  gsap.set(els, { opacity: 0, y: o.y });
  ScrollTrigger.batch(els, {
    start: o.start,
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1, y: 0, duration: o.duration, ease: o.ease, stagger: o.stagger !== undefined ? o.stagger : 0.08, overwrite: true,
      onComplete: o.onComplete,
    }),
  });
}

export function create(ctx) {
  const { gsap, ScrollTrigger, still } = ctx;

  /* Sheet rules: every section opens with the hairline drawing from the left (still tier: drawn).
     Each rule and each headline is created on its own (try/catch): one failure never skips the rest. */
  document.querySelectorAll('.sheet-rule').forEach((rule) => {
    if (still) return;
    ctx.safe('rule', () => {
      const line = rule.querySelector('.sheet-rule__line');
      const texts = rule.querySelectorAll(':scope > span');
      const tl = gsap.timeline({ scrollTrigger: { trigger: rule, start: 'top 90%', once: true } });
      if (line) tl.from(line, { scaleX: 0, duration: 0.9, ease: 'expo.out' }, 0);
      tl.from(texts, { opacity: 0, y: 6, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, 0.15);
    });
  });

  /* Headlines (every h2[data-split] except the hero's H1, which cover.js owns) */
  document.querySelectorAll('main h2[data-split]').forEach((h) => ctx.safe('split', () => splitLines(ctx, h)));

  /* In their own words: the quotation lines and the opening mark */
  const quote = document.querySelector('#mission .quote__line[data-split]');
  if (quote) splitLines(ctx, quote, { duration: 0.9, stagger: 0.09 });
  const mark = document.querySelector('.quote__mark');
  if (mark && !still) gsap.from(mark, { scaleY: 0, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '#mission', start: 'top 85%', once: true } });

  /* Generic reveals outside the sections that choreograph their own */
  const own = '#hero, #ground, #ascent, #learning, #life, #ledger';
  const generic = Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => !el.closest(own));
  const parents = generic.filter((el) => el.closest('#parents'));
  const steps = generic.filter((el) => el.classList.contains('step'));
  const rest = generic.filter((el) => !parents.includes(el) && !steps.includes(el));

  reveal(ctx, parents, { y: 16, duration: 0.4, stagger: 0.06 });
  reveal(ctx, rest);

  /* Admissions: numerals rise, hairlines draw, steps left to right (still tier: already drawn) */
  if (steps.length) {
    if (still) {
      /* nothing to do */
    } else {
      gsap.set(steps, { '--drawn': 0 });
      gsap.set(steps.map((s) => s.querySelector('.step__n')), { y: 24, opacity: 0 });
      gsap.set(steps.flatMap((s) => Array.from(s.querySelectorAll('h3, p'))), { y: 16, opacity: 0 });
      ScrollTrigger.create({
        trigger: '#steps', start: 'top 80%', once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          steps.forEach((s, i) => {
            const at = i * 0.12;
            tl.to(s, { '--drawn': 1, duration: 0.7, ease: 'power3.out' }, at);
            tl.to(s.querySelector('.step__n'), { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, at + 0.05);
            tl.to(s.querySelectorAll('h3, p'), { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.06 }, at + 0.15);
          });
        },
      });
    }
  }
  return null;
}
