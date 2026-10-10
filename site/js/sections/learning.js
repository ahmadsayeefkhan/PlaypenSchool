/* Sheet 03, Learning: four stages (plates reveal by curtain, names rise), the class rail
   whose pencil mark slides from PG to XII as the section passes (--learning-p). Not pinned. */

let section;

export function init() {
  section = document.getElementById('learning');
}

export function create(ctx) {
  const { gsap, ScrollTrigger, still, emit } = ctx;
  if (!section) return null;

  const stages = Array.from(section.querySelectorAll('.stage'));
  stages.forEach((stage, i) => {
    const plate = stage.querySelector('.plate[data-clip]');
    if (plate) ctx.clipReveal(plate, { start: 'top 85%', delay: ctx.desktop ? i * 0.12 : 0 });
    const texts = Array.from(stage.querySelectorAll(':scope > :not(.plate)'));
    ctx.reveal(texts, { y: 24, stagger: 0.06 });
  });

  if (still) {
    ctx.setVar('--learning-p', 1);
    return null;
  }
  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: true,
    onUpdate: (self) => {
      ctx.setVar('--learning-p', self.progress.toFixed(4));
      emit('pp:scene', { id: 'learning', p: self.progress });
    },
  });
  const end = section.querySelector('.rule__end');
  if (end) gsap.from(end, { opacity: 0, x: 12, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '#learning-rule', start: 'top 90%', once: true } });
  return null;
}
