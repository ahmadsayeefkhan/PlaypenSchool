/* Sheet 07 · Playpen Voices (2026-11-05). Fills the three strips from VOICES and plays a video in a dialog.
 *
 * HOW TO ADD A REAL VIDEO (school or website operator):
 *   set `video` on an entry to either
 *     - a YouTube link or id            e.g. 'https://youtu.be/abc123XYZ' or 'abc123XYZ'
 *     - a video file in the site        e.g. './assets/video/voices/student-01.mp4'
 *   and set `name`, `role`, `poster` (a still from the video) and, if you like, a short `quote` in the speaker's own words.
 *   `portrait: true` for phone-shot (9:16) clips.
 *   Entries without `video` show "Video coming soon" and do not open.
 *
 * Every person on camera (and a parent for every student) must have given written consent before a video is added
 * (docs/CONTENT-TO-CONFIRM.md). Never add quotes the person did not say on camera.
 */
const IMG = './assets/img/';
const VOICES = {
  students: [
    // 2026-11-05 demo: AI-made sample student (fictional, Higgsfield). Label stays until replaced by a real, consented student.
    { name: 'Student voice', role: 'A Level · AI-made sample', poster: './assets/video/voices/student-01-poster.jpg?v=2', video: './assets/video/voices/student-01-ai-sample.mp4', portrait: true, quote: "That's Playpen. Come and see it for yourself!" },
    { name: 'Student voice', role: 'AI-made sample', poster: './assets/video/voices/student-02-poster.jpg' },
    { name: 'Student voice', role: 'AI-made sample', poster: './assets/video/voices/student-03-poster.jpg' },
    { name: 'Student voice', role: 'AI-made sample', poster: './assets/video/voices/student-04-poster.jpg' },
    { name: 'Student voice', role: 'AI-made sample', poster: './assets/video/voices/student-05-poster.jpg' }
  ],
  parents: [
    { name: 'Parent voice', role: 'Parent · AI-made sample', poster: './assets/video/voices/parent-1-poster.jpg' },
    { name: 'Parent voice', role: 'Parent · AI-made sample', poster: './assets/video/voices/parent-2-poster.jpg' },
    { name: 'Parent voice', role: 'Parent · AI-made sample', poster: './assets/video/voices/parent-3-poster.jpg' },
    { name: 'Parent voice', role: 'Parent · AI-made sample', poster: './assets/video/voices/parent-4-poster.jpg' }
  ],
  teachers: [
    { name: 'Teacher voice', role: 'Teacher · AI-made sample', poster: './assets/video/voices/teacher-1-poster.jpg' },
    { name: 'Teacher voice', role: 'Teacher · AI-made sample', poster: './assets/video/voices/teacher-2-poster.jpg' },
    { name: 'Teacher voice', role: 'Teacher · AI-made sample', poster: './assets/video/voices/teacher-3-poster.jpg' },
    { name: 'Teacher voice', role: 'Teacher · AI-made sample', poster: './assets/video/voices/teacher-4-poster.jpg' }
  ],
  // 2026-11-05 (founder): Admin voices = principal + vice principal only. Parent/teacher/admin images are AI-made placeholders (no video yet); replace with real, consented people before the live site.
  admin: [
    { name: 'Admin voice', role: 'Principal · AI-made sample', poster: './assets/video/voices/principal-poster.jpg?v=3' },
    { name: 'Admin voice', role: 'Vice principal · AI-made sample', poster: './assets/video/voices/vice-principal-poster.jpg?v=3' }
  ]
};

const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ytId = v => { const m = String(v).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : (/^[\w-]{11}$/.test(v) ? v : null); };

function panel(v, i, label) {
  const has = !!v.video;
  const src = /^(https?:|\.\/|\/)/.test(v.poster || '') ? v.poster : IMG + (v.poster || 'about-campus-atrium-960.jpg');
  const aria = has ? `Play: ${v.name}, ${v.role}` : `${v.name}, ${v.role}: video coming soon`;
  return `<li class="vpanel${i === 0 ? ' is-active' : ''}${has ? '' : ' vpanel--soon'}" data-i="${i}">
    <button class="vpanel__btn" type="button" aria-label="${esc(aria)}" ${has ? '' : 'aria-disabled="true"'}>
      <img class="vpanel__img" src="${esc(src)}" alt="" loading="lazy" decoding="async">
      <i class="vpanel__shade" aria-hidden="true"></i>
      <span class="vpanel__side" aria-hidden="true"><b>${esc(v.name)}</b><span>${esc(v.role)}</span></span>
      ${has ? `<span class="vpanel__play" aria-hidden="true">${PLAY}</span>` : '<span class="vpanel__soon" aria-hidden="true">Video coming soon</span>'}
      <span class="vpanel__open" aria-hidden="true">
        <span class="vpanel__name">${esc(v.name)}</span>
        <span class="vpanel__role">${esc(v.role)}</span>
        ${v.quote ? `<span class="vpanel__quote">&ldquo;${esc(v.quote)}&rdquo;</span>` : ''}
      </span>
    </button>
  </li>`;
}

function initStrip(ul, list, label) {
  ul.innerHTML = list.map((v, i) => panel(v, i, label)).join('');
  const items = [...ul.children];
  const activate = li => items.forEach(x => x.classList.toggle('is-active', x === li));
  items.forEach(li => {
    const btn = li.querySelector('.vpanel__btn');
    li.addEventListener('mouseenter', () => activate(li));
    btn.addEventListener('focus', () => activate(li));
    btn.addEventListener('click', () => {
      if (!li.classList.contains('is-active') && matchMedia('(min-width: 768px)').matches) { activate(li); return; }
      const v = list[+li.dataset.i];
      if (v.video) openVideo(v, btn);
    });
  });
}

let dialog;
function openVideo(v, opener) {
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.className = 'vdialog';
    dialog.setAttribute('aria-label', 'Video');
    dialog.innerHTML = '<button class="vdialog__close" type="button" aria-label="Close video">&times;</button><div class="vdialog__frame"></div><p class="vdialog__cap"></p>';
    document.body.appendChild(dialog);
    const close = () => dialog.close();
    dialog.querySelector('.vdialog__close').addEventListener('click', close);
    dialog.addEventListener('click', e => { if (e.target === dialog) close(); });
    dialog.addEventListener('close', () => { dialog.querySelector('.vdialog__frame').innerHTML = ''; dialog._opener && dialog._opener.focus(); });
  }
  const frame = dialog.querySelector('.vdialog__frame');
  frame.classList.toggle('is-portrait', !!v.portrait);
  const id = ytId(v.video);
  frame.innerHTML = id
    ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1" title="${esc(v.name)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
    : `<video src="${esc(v.video)}" controls autoplay playsinline ${v.poster ? `poster="${esc(/^(https?:|\.\/|\/)/.test(v.poster) ? v.poster : IMG + v.poster)}"` : ''}></video>`;
  dialog.querySelector('.vdialog__cap').innerHTML = `<b>${esc(v.name)}</b> &middot; ${esc(v.role)}`;
  dialog._opener = opener;
  dialog.showModal();
}

export function init() {
  const root = document.getElementById('voices');
  if (!root) return;
  [['students', 'Student'], ['parents', 'Parent'], ['teachers', 'Teacher'], ['admin', 'Admin']].forEach(([key, label]) => {
    const ul = root.querySelector(`[data-voices="${key}"]`);
    if (!ul) return;
    initStrip(ul, VOICES[key], label);
    const n = root.querySelector(`[data-voices-count="${key}"]`);
    if (n) { const k = VOICES[key].length; n.textContent = `${k} ${k === 1 ? 'video' : 'videos'}`; }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
