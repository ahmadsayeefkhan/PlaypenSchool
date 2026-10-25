/* Sheet 01, Notices (2026-10-22): a dormant date guard. A home notice card whose data-ends date (ISO, set only
   where the school gave a real end date) is before today is hidden and the count line follows; with no card
   left, the board says so and the hero's notice chip goes. Today no home card has data-ends. The HTML is
   correct without this script. Spec: redesign-2026-10-22-notices/spec.md section 8. */

export function init() {
  const section = document.getElementById('notices');
  if (!section) return;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const passed = (iso) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    return !!m && new Date(+m[1], +m[2] - 1, +m[3]) < today;
  };
  const cards = Array.from(section.querySelectorAll('.nb-card'));
  let hid = 0;
  cards.forEach((card) => { if (passed(card.dataset.ends)) { card.hidden = true; hid += 1; } });
  if (!hid) return;
  const left = cards.length - hid;
  const count = section.querySelector('.nb-count');
  if (count) count.textContent = left === 1 ? '1 notice applies now.' : left + ' notices apply now.';
  if (left) return;
  const grid = section.querySelector('.nb-grid');
  if (grid) {
    const p = document.createElement('p');
    p.className = 'nb-none';
    p.textContent = 'There is no current notice from the school right now.';
    grid.prepend(p);
  }
  const chip = document.querySelector('#hero .hero__notice');
  if (chip) chip.remove();
}
