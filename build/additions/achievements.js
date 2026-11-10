/* Our Recent Updates (2026-11-05, founder): achievement and study tour stories. One data file, three places
 * ([data-ach-section="achievement|study-tour"] filters a strip or list by each story's "section"):
 *   [data-ach-circles]  story circles (home + /achievements/); a tap opens the full-screen story viewer
 *   [data-ach-list]     story cards (/achievements/)
 *   [data-ach-story]    the full story (/achievements/story/?s=<id>)
 * Data: site/assets/data/achievements.json (newest first). Also copied to site/js/achievements.js for the hand-built home.
 */
var mainCss = document.querySelector('link[href*="css/main.css"]');
var ROOT = mainCss ? new URL('../', mainCss.href) : new URL('./', location.href);
var ASSETS = new URL('assets/', ROOT);
var hooks = document.querySelectorAll('[data-ach-circles], [data-ach-list], [data-ach-story]');

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function fmtDate(iso) { var p = String(iso || '').split('-'); return p.length === 3 ? (+p[2]) + ' ' + MONTHS[+p[1] - 1] + ' ' + p[0] : ''; }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function img(src) { return new URL(src, ASSETS).href; }
function storyUrl(id) { return new URL('achievements/story/?s=' + encodeURIComponent(id), ROOT).href; }
function inSection(stories, sec) { return sec ? stories.filter(function (s) { return (s.section || 'achievement') === sec; }) : stories; }
function reduced() { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; }

if (hooks.length) loadStories();

function loadStories() {
fetch(new URL('data/achievements.json', ASSETS).href, { cache: 'no-cache' })
  .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(function (data) {
    var stories = (data && data.stories) || [];
    document.querySelectorAll('[data-ach-circles]').forEach(function (el) { renderCircles(el, stories); });
    document.querySelectorAll('[data-ach-list]').forEach(function (el) { renderList(el, stories); });
    document.querySelectorAll('[data-ach-story]').forEach(function (el) { renderStory(el, stories); });
  })
  .catch(function (e) {
    if (window.console) console.error('[achievements]', e);
    document.querySelectorAll('[data-ach-list], [data-ach-story]').forEach(function (el) {
      el.innerHTML = '<p class="ach-empty">The stories could not be loaded. Please try again later.</p>';
    });
  });
}

/* ---------- circles ---------- */
function renderCircles(el, stories) {
  var max = +(el.getAttribute('data-ach-max') || 8);
  var sec = el.getAttribute('data-ach-section');
  var list = inSection(stories, sec).slice(0, max);
  var all = el.getAttribute('data-ach-all') !== 'false';
  var allHref = new URL('achievements/' + (sec ? '#' + sec : ''), ROOT).href;
  if (!list.length) {
    el.innerHTML = '<li><span class="ach-circle ach-circle--soon"><span class="ach-circle__ring"><span class="ach-circle__all" aria-hidden="true">&#9733;</span></span>' +
      '<span class="ach-circle__label">Coming soon</span></span></li>';
    return;
  }
  var html = list.map(function (s, i) {
    var cover = s.images && s.images[0];
    return '<li><button class="ach-circle" type="button" data-i="' + i + '" aria-label="' + esc('Open story: ' + s.title + (s.person ? ', ' + s.person : '')) + '">' +
      '<span class="ach-circle__ring"><img src="' + esc(cover ? img(cover.src) : '') + '" alt="" loading="lazy" decoding="async"></span>' +
      '<span class="ach-circle__play" aria-hidden="true">&#9654;</span>' +
      '<span class="ach-circle__label">' + esc(s.circle || s.category) + '</span></button></li>';
  }).join('');
  if (all) html += '<li><a class="ach-circle ach-circle--all" href="' + esc(allHref) + '">' +
    '<span class="ach-circle__ring"><span class="ach-circle__all" aria-hidden="true">&rarr;</span></span><span class="ach-circle__label">See all</span></a></li>';
  el.innerHTML = html;
  el.querySelectorAll('button.ach-circle').forEach(function (b) {
    b.addEventListener('click', function () { openViewer(list, +b.getAttribute('data-i'), b); });
  });
}

/* ---------- cards ---------- */
function renderList(el, all) {
  var sec = el.getAttribute('data-ach-section');
  var stories = inSection(all, sec);
  if (!stories.length) { el.innerHTML = '<p class="ach-empty">' + (sec === 'study-tour' ? 'Study tour stories are coming soon.' : 'No stories yet.') + '</p>'; return; }
  el.innerHTML = stories.map(function (s) {
    var cover = s.images && s.images[0];
    return '<article class="ach-card" data-reveal>' +
      '<a class="ach-card__link" href="' + esc(storyUrl(s.id)) + '">' +
        '<span class="ach-card__media">' + (cover ? '<img src="' + esc(img(cover.src)) + '" alt="" loading="lazy" decoding="async">' : '') +
          '<span class="ach-card__tag">' + esc(s.category) + '</span></span>' +
        '<span class="ach-card__body">' +
          '<time class="ach-card__date" datetime="' + esc(s.date) + '">' + esc(fmtDate(s.date)) + '</time>' +
          '<span class="ach-card__title">' + esc(s.title) + '</span>' +
          '<span class="ach-card__who">' + esc(s.person || '') + (s['class'] ? ' &middot; ' + esc(s['class']) : '') + '</span>' +
          '<span class="ach-card__more">Read the story <span aria-hidden="true">&rarr;</span></span>' +
        '</span></a></article>';
  }).join('');
}

/* ---------- full story ---------- */
function renderStory(el, stories) {
  var id = new URLSearchParams(location.search).get('s');
  var i = -1;
  for (var k = 0; k < stories.length; k++) if (stories[k].id === id) i = k;
  if (i < 0) i = 0;
  var s = stories[i];
  if (!s) { el.innerHTML = '<p class="ach-empty">This story was not found. <a href="' + esc(new URL('achievements/', ROOT).href) + '">See all stories</a>.</p>'; return; }
  document.title = s.title + ' | Playpen School, Dhaka';
  var h1 = document.querySelector('h1');
  if (h1) h1.innerHTML = esc(s.title);
  var lede = document.querySelector('.page-hero__lead, .standfirst, [data-ach-lede]');
  if (lede) lede.textContent = s.summary;
  var prev = stories[i + 1], next = stories[i - 1];
  el.innerHTML =
    '<div class="ach-story">' +
      '<div class="ach-story__media">' + (s.images || []).map(function (m) {
        return '<figure class="ach-story__fig"><img src="' + esc(img(m.src)) + '" width="' + (m.w || '') + '" height="' + (m.h || '') + '" alt="' + esc(m.alt) + '" loading="lazy" decoding="async">' +
          (m.caption ? '<figcaption class="caption">' + esc(m.caption) + '</figcaption>' : '') + '</figure>';
      }).join('') + '</div>' +
      '<div class="ach-story__text">' +
        '<p class="ach-story__meta"><span class="ach-story__tag">' + esc(s.category) + '</span><time datetime="' + esc(s.date) + '">' + esc(fmtDate(s.date)) + '</time></p>' +
        '<p class="ach-story__headline">' + esc(s.headline) + '</p>' +
        (s.subline ? '<p class="ach-story__subline">' + esc(s.subline) + '</p>' : '') +
        (s.facts && s.facts.length ? '<dl class="ach-story__facts">' + s.facts.map(function (f) { return '<div><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' : '') +
        (s.body || []).map(function (p) { return '<p class="ach-story__p">' + esc(p) + '</p>'; }).join('') +
        (s.source ? '<p class="ach-story__source caption">First shared: ' + esc(s.source) + '</p>' : '') +
        '<div class="ach-story__actions">' +
          '<button class="btn btn--primary ach-story__play" type="button"><span class="btn__label">Watch as a story</span></button>' +
          '<a class="btn btn--text" href="' + esc(new URL('achievements/', ROOT).href) + '">All recent updates</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
    ((prev || next) ? '<nav class="ach-pager" aria-label="More stories">' +
      (next ? '<a class="ach-pager__a" href="' + esc(storyUrl(next.id)) + '"><span class="label">Newer</span>' + esc(next.title) + '</a>' : '<span></span>') +
      (prev ? '<a class="ach-pager__a ach-pager__a--prev" href="' + esc(storyUrl(prev.id)) + '"><span class="label">Older</span>' + esc(prev.title) + '</a>' : '<span></span>') +
    '</nav>' : '');
  var play = el.querySelector('.ach-story__play');
  if (play) play.addEventListener('click', function () { openViewer(stories, i, play); });
}

/* ---------- full-screen story viewer ---------- */
var V = null;
function slidesFor(s) {
  var out = [];
  (s.images || []).forEach(function (m, k) {
    out.push({ kind: 'image', src: img(m.src), alt: m.alt, top: k === 0 ? s.headline : (m.caption || ''), bottom: k === 0 ? (s.person || '') + (s['class'] ? ' · ' + s['class'] : '') : (s.subline || '') });
  });
  out.push({ kind: 'text', s: s });
  return out;
}
function openViewer(stories, si, opener) {
  if (!V) buildViewer();
  V.stories = stories; V.si = si; V.opener = opener;
  document.documentElement.classList.add('ach-viewer-open');
  V.el.hidden = false;
  requestAnimationFrame(function () { V.el.classList.add('is-open'); });
  show(si, 0);
  V.close.focus();
}
function closeViewer() {
  if (!V || V.el.hidden) return;
  stop();
  V.el.classList.remove('is-open');
  document.documentElement.classList.remove('ach-viewer-open');
  setTimeout(function () { V.el.hidden = true; V.stage.innerHTML = ''; }, reduced() ? 0 : 250);
  if (V.opener && V.opener.focus) V.opener.focus();
}
function buildViewer() {
  var el = document.createElement('div');
  el.className = 'ach-viewer';
  el.hidden = true;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Story');
  el.innerHTML =
    '<div class="ach-viewer__card">' +
      '<div class="ach-viewer__bars" aria-hidden="true"></div>' +
      '<div class="ach-viewer__head"><span class="ach-viewer__who"></span>' +
        '<button class="ach-viewer__btn ach-viewer__pause" type="button" aria-label="Pause">&#10074;&#10074;</button>' +
        '<button class="ach-viewer__btn ach-viewer__close" type="button" aria-label="Close story">&times;</button></div>' +
      '<div class="ach-viewer__stage" aria-live="polite"></div>' +
      '<button class="ach-viewer__tap ach-viewer__tap--prev" type="button" aria-label="Previous"></button>' +
      '<button class="ach-viewer__tap ach-viewer__tap--next" type="button" aria-label="Next"></button>' +
    '</div>' +
    '<button class="ach-viewer__arrow ach-viewer__arrow--prev" type="button" aria-label="Previous story">&larr;</button>' +
    '<button class="ach-viewer__arrow ach-viewer__arrow--next" type="button" aria-label="Next story">&rarr;</button>';
  document.body.appendChild(el);
  V = { el: el, bars: el.querySelector('.ach-viewer__bars'), stage: el.querySelector('.ach-viewer__stage'), who: el.querySelector('.ach-viewer__who'),
        close: el.querySelector('.ach-viewer__close'), pause: el.querySelector('.ach-viewer__pause'), timer: null, paused: false, t0: 0, left: 0, DUR: 6000 };
  V.close.addEventListener('click', closeViewer);
  V.pause.addEventListener('click', function () { V.paused ? resume() : hold(true); });
  el.querySelector('.ach-viewer__tap--prev').addEventListener('click', function () { step(-1); });
  el.querySelector('.ach-viewer__tap--next').addEventListener('click', function () { step(1); });
  el.querySelector('.ach-viewer__arrow--prev').addEventListener('click', function () { jumpStory(-1); });
  el.querySelector('.ach-viewer__arrow--next').addEventListener('click', function () { jumpStory(1); });
  el.addEventListener('click', function (e) { if (e.target === el) closeViewer(); });
  document.addEventListener('keydown', function (e) {
    if (!V || V.el.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeViewer(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    else if (e.key === ' ') { if (e.target && e.target.tagName === 'A') return; e.preventDefault(); V.paused ? resume() : hold(true); }
    else if (e.key === 'Tab') { // keep focus inside
      var f = [].slice.call(V.el.querySelectorAll('button, a[href]')).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  // hold to pause, swipe down to close
  var y0 = null, held = null;
  var card = el.querySelector('.ach-viewer__card');
  card.addEventListener('pointerdown', function (e) { y0 = e.clientY; held = setTimeout(function () { hold(false); held = 'on'; }, 220); });
  card.addEventListener('pointerup', function (e) {
    if (held === 'on') { resume(); held = null; e.preventDefault(); return; }
    clearTimeout(held); held = null;
    if (y0 !== null && e.clientY - y0 > 90) closeViewer();
    y0 = null;
  });
  card.addEventListener('pointercancel', function () { clearTimeout(held); if (held === 'on') resume(); held = null; y0 = null; });
}
function show(si, k) {
  stop();
  var s = V.stories[si]; V.si = si; V.slides = slidesFor(s); V.k = k;
  V.who.innerHTML = '<b>' + esc(s.person || s.circle || s.category) + '</b><span>' + esc(fmtDate(s.date)) + '</span>';
  V.bars.innerHTML = V.slides.map(function (_, j) { return '<i class="' + (j < k ? 'is-done' : '') + '"><b></b></i>'; }).join('');
  var sl = V.slides[k];
  V.el.querySelector('.ach-viewer__card').classList.toggle('is-text', sl.kind === 'text');
  if (sl.kind === 'image') {
    V.stage.innerHTML = '<div class="ach-slide ach-slide--image"><img class="ach-slide__bg" src="' + esc(sl.src) + '" alt=""><img class="ach-slide__img" src="' + esc(sl.src) + '" alt="' + esc(sl.alt) + '">' +
      '<div class="ach-slide__cap">' + (sl.top ? '<p class="ach-slide__top">' + esc(sl.top) + '</p>' : '') + (sl.bottom ? '<p class="ach-slide__bottom">' + esc(sl.bottom) + '</p>' : '') + '</div></div>';
  } else {
    var t = sl.s;
    V.stage.innerHTML = '<div class="ach-slide ach-slide--text"><p class="ach-slide__kicker">' + esc(t.category) + ' &middot; ' + esc(fmtDate(t.date)) + '</p>' +
      '<p class="ach-slide__title">' + esc(t.title) + '</p><p class="ach-slide__sum">' + esc(t.summary) + '</p>' +
      '<a class="btn btn--gold ach-slide__go" href="' + esc(storyUrl(t.id)) + '"><span class="btn__label">Read the full story</span></a></div>';
    // the home's page-transition script listens for link clicks; go straight to the story instead
    var go = V.stage.querySelector('.ach-slide__go');
    go.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    go.addEventListener('pointerup', function (e) { e.stopPropagation(); });
    go.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); stop(); location.assign(go.href); }, true);
  }
  V.el.querySelector('.ach-viewer__arrow--prev').disabled = si === 0;
  V.el.querySelector('.ach-viewer__arrow--next').disabled = si === V.stories.length - 1;
  V.left = V.DUR;
  if (reduced()) hold(true); else run();
}
function bar() { return V.bars.children[V.k] && V.bars.children[V.k].firstChild; }
function run() {
  V.paused = false; V.pause.innerHTML = '&#10074;&#10074;'; V.pause.setAttribute('aria-label', 'Pause');
  V.t0 = Date.now();
  var b = bar();
  if (b) { var done = 1 - V.left / V.DUR; b.style.transition = 'none'; b.style.transform = 'scaleX(' + done + ')'; b.offsetWidth; b.style.transition = 'transform ' + V.left + 'ms linear'; b.style.transform = 'scaleX(1)'; }
  V.timer = setTimeout(function () { step(1); }, V.left);
}
function stop() { clearTimeout(V && V.timer); }
function hold(button) {
  if (!V || V.paused) return;
  stop(); V.paused = true; V.left = Math.max(0, V.left - (Date.now() - V.t0));
  var b = bar(); if (b) { var done = 1 - V.left / V.DUR; b.style.transition = 'none'; b.style.transform = 'scaleX(' + done + ')'; }
  V.pause.innerHTML = '&#9654;'; V.pause.setAttribute('aria-label', 'Play');
}
function resume() { if (V && V.paused) run(); }
function step(d) {
  var k = V.k + d;
  if (k >= V.slides.length) { if (V.si < V.stories.length - 1) show(V.si + 1, 0); else closeViewer(); return; }
  if (k < 0) { if (V.si > 0) show(V.si - 1, 0); else show(V.si, 0); return; }
  show(V.si, k);
}
function jumpStory(d) { var si = V.si + d; if (si >= 0 && si < V.stories.length) show(si, 0); }
