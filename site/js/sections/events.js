/* Sheet 05, Events (2026-10-18): five event cards, each photograph opening by curtain (row by row
   on desktop), the words under it rising after. Each card is one link to the event's own page. */

let section;

export function init() {
  section = document.getElementById('top-events');
}

export function create(ctx) {
  if (!section) return null;
  const cards = Array.from(section.querySelectorAll('.ev'));
  cards.forEach((card, i) => {
    const media = card.querySelector('.ev__media');
    // the first row holds two cards, the second three: the delay restarts on each row
    const col = i < 2 ? i : i - 2;
    if (media) ctx.clipReveal(media, { start: 'top 88%', delay: ctx.desktop ? col * 0.12 : 0 });
    ctx.reveal(Array.from(card.querySelectorAll('.ev__n, .ev__name, .ev__text, .ev__more')), { y: 16, stagger: 0.05 });
  });
  return null;
}
