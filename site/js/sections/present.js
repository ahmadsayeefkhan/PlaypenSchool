/* Present mode (?present=1 only): R replay, 1–5 chapters, T tier cycle, M phone frame,
   P big cursor, S sample tags. Nothing here runs without the parameter. */

const TIERS = ['full', 'light', 'still'];

export function init(ctx) {
  const html = document.documentElement;
  const box = document.getElementById('present');
  const frame = document.getElementById('present-frame');
  let phoneOpen = false;

  /* Restore the position after a T reload */
  try {
    const y = sessionStorage.getItem('pp:scroll');
    if (y !== null) {
      sessionStorage.removeItem('pp:scroll');
      ctx.ready.then(() => setTimeout(() => ctx.scrollTo(parseFloat(y) || 0, { immediate: true, offset: 0 }), 50));
    }
  } catch (e) { /* storage blocked */ }

  console.info('[playpen] present mode: R replay · 1–5 chapters · T tier (' + ctx.tier + ') · M phone · P cursor · S sample tags');

  function showPhone() {
    if (!box || !frame) return;
    phoneOpen = true;
    const url = new URL(location.href);
    url.searchParams.set('present', '0');
    url.searchParams.set('intro', '0');
    url.hash = '';
    frame.src = url.toString();
    box.hidden = false;
    box.setAttribute('tabindex', '-1');
    box.focus({ preventScroll: true });   // keep the keys on this document, not inside the frame
    if (ctx.hero) ctx.safe('hero.pause', () => ctx.hero.pause());
    if (ctx.lenis) ctx.lenis.stop();
  }
  function hidePhone() {
    if (!box || !frame) return;
    phoneOpen = false;
    // focus back on this document before the frame hides: a focused frame (a click inside it)
    // would keep every key from here on
    const active = document.activeElement;
    if (active && (active === frame || box.contains(active))) { try { active.blur(); } catch (e) { /* ignore */ } }
    box.hidden = true;
    frame.src = 'about:blank';
    if (ctx.hero) ctx.safe('hero.resume', () => ctx.hero.resume());
    if (ctx.lenis) ctx.lenis.start();
  }
  if (box) {
    box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('.present__close')) hidePhone(); });
    // Esc pressed while the frame itself has focus reaches the frame's document; main.js posts it up
    window.addEventListener('message', (e) => { if (e.origin === location.origin && e.data === 'pp:escape' && phoneOpen) hidePhone(); });
  }

  document.addEventListener('keydown', (e) => {
    if (e.target && e.target.matches && e.target.matches('input, select, textarea')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 'escape' && phoneOpen) { hidePhone(); return; }
    if (k === 'r') {
      try { sessionStorage.removeItem('pp:introSeen'); } catch (err) { /* ignore */ }
      const url = new URL(location.href);
      url.searchParams.set('intro', '1');
      location.replace(url.toString());
    } else if (k >= '1' && k <= '5') {
      if (ctx.ascentJump) ctx.ascentJump(parseInt(k, 10));
    } else if (k === 't') {
      const next = TIERS[(TIERS.indexOf(ctx.tier) + 1) % TIERS.length];
      try { localStorage.setItem('pp:tier', next); sessionStorage.setItem('pp:scroll', String(window.scrollY)); } catch (err) { /* ignore */ }
      const url = new URL(location.href);
      url.searchParams.set('tier', next);
      url.searchParams.set('intro', '0');
      location.replace(url.toString());
    } else if (k === 'm') {
      phoneOpen ? hidePhone() : showPhone();
    } else if (k === 'p') {
      html.classList.toggle('cursor-big');
    } else if (k === 's') {
      html.classList.toggle('clean');
    }
  });
}
