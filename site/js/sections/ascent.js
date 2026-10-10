/* Sheet 02, the Ascent: the one pinned scene on the page (desktop), a stacked sequence with a
   sticky rule on phones. Publishes --ascent-p, pp:scene {id:'ascent'} and pp:chapter {index}.
   The WebGL plane (if any) is driven by main.js from those events; this module also keeps the
   DOM images in step so the page is right when the plane is not there.
   Polish pass 2026-10-09: a five-stop rule (one tick per room, lit by chapter), the pin at
   +=350 %, the courtyard film shown only while it plays and only on chapter 1 (the light tier used
   to keep it over chapters 2-5), the phone stage switching when a chapter's top reaches the foot of
   the sticky strip (it ran one chapter ahead), the facilities list inside the last chapter. */

const CHAPTERS = 5;
let section, pin, stage, pics, videoEl, pauseBtn, ticks, railItems, marker, counterCur, chapters, titleSplits;
let current = 0;
let userPaused = false;
let pinTrigger = null;
let ctxRef;
let chapterTweens = [];

export function init(ctx) {
  ctxRef = ctx;
  section = document.getElementById('ascent');
  if (!section) return;
  pin = section.querySelector('.ascent__pin');
  stage = document.getElementById('ascent-stage');
  pics = Array.from(section.querySelectorAll('.ascent__pic'));
  videoEl = document.getElementById('ascent-video');
  pauseBtn = document.getElementById('ascent-pause');
  ticks = Array.from(section.querySelectorAll('#ascent-rule .rule__tick'));
  railItems = Array.from(section.querySelectorAll('#ascent-rail li[data-chapter]'));
  marker = section.querySelector('.rail__marker');
  counterCur = section.querySelector('.counter__cur');
  chapters = Array.from(section.querySelectorAll('.chapter'));
  titleSplits = [];

  /* Rail: jump within the pinned scene instead of a plain anchor */
  const rail = document.getElementById('ascent-rail');
  if (rail) rail.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-chapter]');
    if (!li) return;
    e.preventDefault();
    e.stopPropagation();
    jumpTo(parseInt(li.dataset.chapter, 10));
  });

  if (pauseBtn && videoEl) pauseBtn.addEventListener('click', () => {
    userPaused = !userPaused;
    pauseBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    const label = pauseBtn.querySelector('.visually-hidden');
    if (label) label.textContent = userPaused ? 'Play the courtyard film' : 'Pause the courtyard film';
    syncFilm();
  });
  if (videoEl) {
    // the film is drawn only while it actually plays, and only over chapter 1: 'pause' (ours, the
    // browser's or a tab switch) takes it off the stage again, so the still underneath shows
    videoEl.addEventListener('playing', () => { if (current === 1) stage.classList.add('is-playing'); if (pauseBtn) pauseBtn.hidden = false; });
    videoEl.addEventListener('pause', () => { if (!userPaused || current !== 1) stage.classList.remove('is-playing'); });
    videoEl.addEventListener('ended', () => stage.classList.remove('is-playing'));
  }
  document.addEventListener('visibilitychange', syncFilm);
  ctx.ascentJump = jumpTo;

  document.fonts.ready.then(() => {
    if (ctx.still) return;
    chapters.forEach((ch) => {
      const t = ch.querySelector('.chapter__title');
      const s = ctx.split(t, { manual: true, trigger: null });
      titleSplits.push(s);
      if (!s && t) t.classList.add('is-split');
    });
    // chapter 1 is already active: show its title
    const s = titleSplits[0];
    if (s && s.lines) ctx.gsap.set(s.lines, { yPercent: 0 });
  });
}

/* Progress 0..1 across the scene → the rule's light band (the lit tick follows the chapter) */
function setProgress(p) {
  const ctx = ctxRef;
  ctx.setVar('--ascent-p', p.toFixed(4));
  ctx.emit('pp:scene', { id: 'ascent', p });
}

function lightTick(k) {
  ticks.forEach((t) => t.classList.toggle('is-lit', parseInt(t.dataset.tick, 10) === k));
}

function chapterFromProgress(p) {
  // chapter k spans [(k-1)/5, k/5); a 0.016 hold before each change keeps every chapter readable
  let k = Math.floor(p * CHAPTERS) + 1;
  const local = p * CHAPTERS - (k - 1);
  if (k > 1 && local < 0.08) k -= 1;
  return Math.max(1, Math.min(CHAPTERS, k));
}

function setChapter(k, instant) {
  const ctx = ctxRef;
  const { gsap, still } = ctx;
  if (k === current) return;
  const prev = current;
  current = k;

  lightTick(k);
  railItems.forEach((li) => li.classList.toggle('is-active', parseInt(li.dataset.chapter, 10) === k));
  const activeLi = railItems[k - 1];
  if (marker && activeLi) {
    const y = activeLi.offsetTop + activeLi.offsetHeight / 2;
    marker.style.setProperty('--rail-y', y + 'px');
  }
  if (counterCur) {
    const text = String(k).padStart(2, '0');
    const num = document.createElement('span');
    num.className = 'counter__num';
    num.textContent = text;
    if (still || instant) {
      counterCur.replaceChildren(num);
    } else {
      // crossfade in one grid cell: the outgoing numeral leaves while the incoming one rises, so
      // the counter never reads "/ 05" with nothing in front of it
      const outgoing = Array.from(counterCur.children);
      counterCur.appendChild(num);
      outgoing.forEach((el) => gsap.to(el, { yPercent: -40, opacity: 0, duration: 0.2, ease: 'power2.in', overwrite: true, onComplete: () => el.remove() }));
      gsap.fromTo(num, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3, ease: 'power3.out', overwrite: true });
    }
  }

  chapterTweens.forEach((t) => t.kill());
  chapterTweens = [];
  // Desktop: the plate crossfades over 1.1 s (hero.js TUNING.dispMs, or the DOM clip below), so
  // the outgoing copy leaves at once (0.22 s) and the incoming copy lands at the midpoint of the
  // crossfade: the words never name a photograph that is not there yet.
  const staged = !still && !instant && prev !== 0 && ctx.desktop;
  const lead = staged ? 0.48 : 0;   // title lines start at about a third of the crossfade, the copy past its middle
  chapters.forEach((ch, i) => {
    const active = i + 1 === k;
    if (!active) {
      if (staged && ch.classList.contains('is-active')) {
        chapterTweens.push(gsap.to(ch, {
          opacity: 0, y: -6, duration: 0.22, ease: 'power2.in', overwrite: true,
          onComplete: () => { ch.classList.remove('is-active'); gsap.set(ch, { clearProps: 'opacity,transform' }); },
        }));
      } else {
        ch.classList.remove('is-active');
        gsap.set(ch, { clearProps: 'opacity,transform' });
      }
      return;
    }
    ch.classList.add('is-active');
    gsap.set(ch, { clearProps: 'opacity,transform' });
    // phones and tablets: every chapter is on the page at once, so its copy reveals on its own
    // trigger (create) and is never touched here
    if (still || instant || !ctx.desktop) return;
    const split = titleSplits[i];
    const body = ch.querySelectorAll(':scope > p, :scope > ul');
    if (split && split.lines && split.lines.length) {
      chapterTweens.push(gsap.fromTo(split.lines, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: lead, overwrite: true }));
    } else {
      chapterTweens.push(gsap.fromTo(ch.querySelector('.chapter__title'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', delay: lead, overwrite: true }));
    }
    chapterTweens.push(gsap.fromTo(body, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08, delay: lead + 0.15, overwrite: true }));
  });

  // the stage (DOM): the plane, when present, does the displacement; the DOM stays in step
  const hero = ctx.getHero();
  pics.forEach((pic, i) => {
    const n = i + 1;
    pic.classList.toggle('is-active', n === k);
    pic.classList.toggle('is-prev', n === prev && prev !== 0);
  });
  const pic = pics[k - 1];
  if (pic && !hero && !still && !instant && ctx.desktop) {
    const img = pic.querySelector('img');
    chapterTweens.push(gsap.fromTo(pic, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut', overwrite: true, clearProps: 'clipPath' }));
    if (img) chapterTweens.push(gsap.fromTo(img, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'power3.out', overwrite: true, clearProps: 'transform' }));
  } else if (pic && !hero && !still && !instant) {
    chapterTweens.push(gsap.fromTo(pic, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power4.inOut', overwrite: true, clearProps: 'clipPath' }));
  }
  syncFilm();
  ctx.emit('pp:chapter', { index: k });
}

function syncFilm() {
  if (!videoEl || ctxRef.still || !ctxRef.desktop) return;
  const shouldPlay = current === 1 && !userPaused && !document.hidden && sectionInView();
  if (shouldPlay) {
    if (!videoEl.dataset.started) { videoEl.dataset.started = '1'; videoEl.load(); }
    const p = videoEl.play();
    if (p && p.catch) p.catch(() => { stage.classList.remove('is-playing'); });
  } else {
    // off chapter 1 (or off screen) the film leaves the stage at once, whether or not the browser
    // has already paused it: the chapter's own still must never sit under the courtyard
    if (current !== 1 || !sectionInView()) stage.classList.remove('is-playing');
    if (!videoEl.paused) videoEl.pause();
  }
}

function sectionInView() {
  const r = section.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

/* Present mode and the rail: scroll to the pin's start + (k-1)/5 of its length */
function jumpTo(k) {
  const ctx = ctxRef;
  k = Math.max(1, Math.min(CHAPTERS, k));
  if (pinTrigger) {
    // land just past the 0.08 hold that opens each chapter
    const y = pinTrigger.start + ((k - 1) / CHAPTERS + 0.1 / CHAPTERS) * (pinTrigger.end - pinTrigger.start);
    ctx.scrollTo(y, { offset: 0 });
  } else {
    const ch = chapters[k - 1];
    if (ch) ctx.scrollTo(ch, { offset: -(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72) - 16 - (stage ? stage.getBoundingClientRect().height + 48 : 0) });
  }
}

export function create(ctx) {
  const { gsap, ScrollTrigger, still, desktop } = ctx;
  if (!section) return null;
  current = 0;
  pinTrigger = null;

  const intro = section.querySelector('.ascent__intro .lead');
  if (intro) ctx.reveal([intro]);

  if (still) {
    // static stack: everything visible, the top tick lit, no strip motion
    ctx.setVar('--ascent-p', 1);
    lightTick(5);
    chapters.forEach((ch) => ch.classList.add('is-active'));
    pics.forEach((p) => p.classList.add('is-active'));
    return () => { chapters.forEach((ch, i) => ch.classList.toggle('is-active', i === 0)); };
  }

  setChapter(1, true);
  section.querySelector('.ascent__under') && ctx.reveal([section.querySelector('.ascent__under')]);

  if (desktop) {
    const proxy = { p: 0 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: '+=350%',   // five stills in three and a half screens (500 % was long for five stills)
        pin: true,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => { pinTrigger = self; },
      },
    });
    tl.to(proxy, {
      p: 1, duration: 5, ease: 'none',
      onUpdate: () => {
        setProgress(proxy.p);
        setChapter(chapterFromProgress(proxy.p));
      },
    });
    pinTrigger = tl.scrollTrigger;
    // first reveal of chapter 1's image when the scene arrives
    const first = pics[0];
    if (first) ctx.clipReveal(section.querySelector('.ascent__mount'), { start: 'top 80%' });
    // chapter 1's film plays only while the scene is on screen (and chapter 1 is current)
    ScrollTrigger.create({ trigger: section, start: 'top bottom', end: 'bottom top', onToggle: () => syncFilm() });
    return () => { tl.kill(); };
  }

  /* Phones and tablets: no pin; one scrub for the band, chapter switches when each article's top
     reaches the foot of the sticky strip (the strip is the nav plus the stage: the copy under it is
     the readable block, so the stage and the copy agree) */
  ScrollTrigger.create({
    trigger: section,
    start: () => 'top 50%',
    end: () => 'bottom 100%',
    scrub: true,
    onUpdate: (self) => setProgress(self.progress),
  });
  const media = section.querySelector('.ascent__media');
  const stripFoot = () => {
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    return navH + (media ? media.offsetHeight : 0) + 24;
  };
  chapters.forEach((ch, i) => {
    ScrollTrigger.create({
      trigger: ch,
      start: () => 'top ' + stripFoot() + 'px',
      end: () => 'bottom ' + stripFoot() + 'px',
      invalidateOnRefresh: true,
      onEnter: () => setChapter(i + 1),
      onEnterBack: () => setChapter(i + 1),
    });
    // the stacked copy reveals once as it arrives (title lines from their masks, then the copy);
    // chapter 1 is shown with the scene. Kept apart from setChapter: a fast scroll switches the
    // stage several times a second, and killing another chapter's reveal would leave it blank.
    if (i === 0) return;
    const body = ch.querySelectorAll(':scope > p, :scope > ul');
    gsap.set(body, { opacity: 0, y: 12 });
    ScrollTrigger.create({
      trigger: ch,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        const split = titleSplits[i];
        if (split && split.lines && split.lines.length) gsap.to(split.lines, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, overwrite: true });
        gsap.to(body, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08, delay: 0.15, overwrite: true });
      },
    });
  });
  const mount = section.querySelector('.ascent__mount');
  if (mount) ctx.clipReveal(mount, { start: 'top 85%' });
  return null;
}
