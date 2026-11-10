/* Our location (2026-11-05, founder: "more creative, like JIS 'Our location'").
 * Draws a night map of north-east Dhaka centred on the school: distance rings (straight-line km),
 * simplified main roads and nearby areas with typical drive times. The chips filter areas by drive time,
 * hovering or focusing an area draws the route line. "Street map" swaps in the live Google map (loaded on demand).
 * Positions are projected from real coordinates (school 23.817814, 90.440179; 38 px per km).
 * CONFIRM: drive times are off-peak estimates; ask the school front desk to check them before go-live. */
const PLACES = [
  // name, lat, lon, minutes, label side
  ['Jamuna Future Park', 23.8134, 90.4243, 5, 'l'],
  ['Baridhara', 23.8020, 90.4210, 10, 'l'],
  ['Gulshan 2', 23.7947, 90.4143, 15, 'r'],
  ['Banani', 23.7937, 90.4066, 20, 'l'],
  ['Badda', 23.7805, 90.4266, 20, 'r'],
  ['Airport', 23.8433, 90.3978, 20, 'l'],
  ['Purbachal', 23.8350, 90.5000, 20, 'r'],
  ['Uttara', 23.8740, 90.3984, 30, 'r'],
  ['Mohakhali', 23.7780, 90.4005, 30, 'l'],
  ['Mirpur 10', 23.8069, 90.3687, 40, 'l'],
  ['Tejgaon', 23.7610, 90.3920, 40, 'l'],
  ['Dhanmondi', 23.7461, 90.3742, 45, 'l'],
];
const C = { lat: 23.817814, lon: 90.440179, x: 600, y: 300, k: 38 };
const xy = (lat, lon) => [Math.round(C.x + (lon - C.lon) * 101.8 * C.k), Math.round(C.y - (lat - C.lat) * 110.6 * C.k)];
const band = (m) => (m <= 15 ? 1 : m <= 30 ? 2 : 3);
const BANDS = [[0, 'All areas'], [1, 'Under 15 min'], [2, 'Under 30 min'], [3, 'Under 45 min']];
const NS = 'http://www.w3.org/2000/svg';

function svgMap() {
  const roads = [
    // Airport Road (Uttara to Tejgaon), Kuril link, 300 ft road to Purbachal, Pragati Sarani
    'M438 30 L436 193 L455 330 L451 397 L446 467 L413 539 L372 690',
    'M455 330 Q490 300 522 291',
    'M522 291 L600 292 Q700 270 831 228 L1000 205',
    'M522 291 L540 380 L548 457 L560 690',
  ];
  let dots = '';
  for (let x = 20; x < 1000; x += 28) for (let y = 14; y < 690; y += 28) dots += `M${x} ${y}h.01`;
  let places = '';
  PLACES.forEach(([n, lat, lon, m, side], i) => {
    const [x, y] = xy(lat, lon);
    const tx = side === 'r' ? x + 14 : x - 14;
    const anchor = side === 'r' ? 'start' : 'end';
    places += `<g class="lmap__place" data-band="${band(m)}" style="--i:${i}" tabindex="0" role="img" aria-label="${n}: about ${m} minutes by car">` +
      `<line class="lmap__route" x1="${C.x}" y1="${C.y}" x2="${x}" y2="${y}"/>` +
      `<circle class="lmap__halo" cx="${x}" cy="${y}" r="14"/><circle class="lmap__pt" cx="${x}" cy="${y}" r="5"/>` +
      `<text class="lmap__name" x="${tx}" y="${y - 2}" text-anchor="${anchor}">${n}</text>` +
      `<text class="lmap__time" x="${tx}" y="${y + 15}" text-anchor="${anchor}">${m} min</text></g>`;
  });
  const rings = [[3, 114], [6, 228], [10, 380]].map(([km, r], i) =>
    `<circle class="lmap__ring" style="--d:${i * 160}ms" cx="${C.x}" cy="${C.y}" r="${r}"/>` +
    (km < 10 ? `<text class="lmap__km" x="${C.x + r * 0.707 + 6}" y="${C.y - r * 0.707 - 6}">${km} km</text>` : '')).join('');
  return `<svg class="lmap" viewBox="0 0 1000 690" preserveAspectRatio="xMidYMid slice" aria-hidden="false" role="group" aria-label="Map of nearby areas and typical drive times to Playpen School">` +
    `<path class="lmap__grid" d="${dots}"/>` +
    roads.map((d) => `<path class="lmap__road" d="${d}"/>`).join('') +
    rings + places +
    `<g class="lmap__home"><circle class="lmap__pulse" cx="${C.x}" cy="${C.y}" r="30"/><circle class="lmap__seal" cx="${C.x}" cy="${C.y}" r="26"/>` +
    `<image href="./assets/brand/logo-crest-128.webp" x="${C.x - 20}" y="${C.y - 20}" width="40" height="40"/>` +
    `<text class="lmap__homename" x="${C.x}" y="${C.y - 42}" text-anchor="middle">Playpen School</text></g></svg>`;
}

function init(root) {
  const stage = root.querySelector('[data-lmap]');
  if (!stage) return;
  stage.insertAdjacentHTML('afterbegin', svgMap());
  const svg = stage.querySelector('svg');

  // chips: filter areas by drive time
  const chips = root.querySelector('[data-lmap-chips]');
  chips.innerHTML = BANDS.map(([b, t]) => `<button type="button" class="lchip${b ? ' lchip--b' + b : ''}" data-b="${b}" aria-pressed="${b === 0}">${t}</button>`).join('');
  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    chips.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === btn)));
    const b = +btn.dataset.b;
    svg.querySelectorAll('.lmap__place').forEach((g) => g.classList.toggle('is-out', b > 0 && +g.dataset.band > b));
    list.querySelectorAll('li').forEach((li) => (li.hidden = b > 0 && +li.dataset.band > b));
  });

  // list (phones read this instead of the small map labels)
  const list = root.querySelector('[data-lmap-list]');
  list.innerHTML = PLACES.slice().sort((a, b) => a[3] - b[3]).map(([n, , , m]) =>
    `<li data-band="${band(m)}" data-name="${n}"><span>${n}</span><b>${m} min</b></li>`).join('');

  // street map toggle (Google embed is only loaded when asked for)
  const btn = root.querySelector('[data-lmap-street]');
  btn.addEventListener('click', () => {
    let f = stage.querySelector('iframe');
    if (!f) {
      f = document.createElement('iframe');
      f.className = 'findus__frame';
      f.title = 'Street map showing Playpen School in Bashundhara R/A, Dhaka';
      f.src = 'https://www.google.com/maps?q=The+Playpen+School,+Bashundhara+R%2FA,+Dhaka&z=16&hl=en&output=embed';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      stage.appendChild(f);
    }
    const on = !stage.classList.contains('is-street');
    stage.classList.toggle('is-street', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.textContent = on ? 'Area map' : 'Street map';
  });

  // draw in when seen
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) { stage.classList.add('is-in'); io.disconnect(); }
  }), { threshold: 0.25 });
  io.observe(stage);
}

document.querySelectorAll('[data-findus]').forEach(init);

/* ---- Premium layer (2026-11-05 draft): real map + 3D landmark icons ----------------------------------------
 * Real streets, water and parks from OpenStreetMap (OpenFreeMap vector tiles, free, attribution shown), drawn by
 * MapLibre GL in the Playpen night palette with no map labels (our own markers carry the names).
 * Icons: Higgsfield, style "gold + maroon on walnut plinth" (ai-video-jobs/2026-11-05_playpen-location-map).
 * The SVG map above stays as the fallback when WebGL, the library or the tiles are not available. */
const ICONS = {
  'Jamuna Future Park': 'jamuna', Baridhara: 'baridhara', 'Gulshan 2': 'gulshan', Banani: 'banani', Badda: 'badda',
  Airport: 'airport', Purbachal: 'purbachal', Uttara: 'uttara', Mohakhali: 'mohakhali', 'Mirpur 10': 'mirpur',
  Tejgaon: 'tejgaon', Dhanmondi: 'dhanmondi',
};
const ML = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl';
const IMG = new URL('../../assets/img/location/', import.meta.url).href;
const BOUNDS = [[90.366, 23.744], [90.503, 23.876]];
// road routes area -> school, fetched once from OSRM (OpenStreetMap data) on 2026-11-05 and kept with the site
const ROUTES = new URL('../../assets/data/location-routes.json', import.meta.url).href;
// crowded centre: icons sit a little apart (px) with a gold leader line to the exact spot
const NUDGE = { 'Jamuna Future Park': [158, -8], Baridhara: [201, 51], 'Gulshan 2': [158, 118], Badda: [18, 135], Banani: [-90, 34], Mohakhali: [-196, 45] };

function loadML() {
  if (window.maplibregl) return Promise.resolve(window.maplibregl);
  return new Promise((ok, no) => {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = ML + '.css'; document.head.appendChild(l);
    const s = document.createElement('script'); s.src = ML + '.js'; s.onload = () => ok(window.maplibregl); s.onerror = no;
    document.head.appendChild(s);
  });
}

function nightStyle() {
  const w = (a, b) => ['interpolate', ['exponential', 1.5], ['zoom'], 11, a, 16, b];
  const road = (id, classes, color, width) => ({ id, type: 'line', source: 'omt', 'source-layer': 'transportation',
    filter: ['in', ['get', 'class'], ['literal', classes]], layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': color, 'line-width': width } });
  return {
    version: 8,
    sources: { omt: { type: 'vector', url: 'https://tiles.openfreemap.org/planet',
      attribution: '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors' } },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#14100e' } },
      { id: 'landuse', type: 'fill', source: 'omt', 'source-layer': 'landuse', paint: { 'fill-color': '#1a1512' } },
      { id: 'park', type: 'fill', source: 'omt', 'source-layer': 'park', paint: { 'fill-color': '#1b1d15' } },
      { id: 'green', type: 'fill', source: 'omt', 'source-layer': 'landcover', filter: ['in', ['get', 'class'], ['literal', ['grass', 'wood', 'farmland']]], paint: { 'fill-color': '#191b13' } },
      { id: 'water', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': '#0d171c' } },
      { id: 'waterway', type: 'line', source: 'omt', 'source-layer': 'waterway', paint: { 'line-color': '#12212a', 'line-width': 1.5 } },
      { id: 'building', type: 'fill', source: 'omt', 'source-layer': 'building', minzoom: 14, paint: { 'fill-color': '#211a16', 'fill-outline-color': '#2b221c' } },
      { id: 'runway', type: 'line', source: 'omt', 'source-layer': 'aeroway', filter: ['==', ['get', 'class'], 'runway'], paint: { 'line-color': '#3a2e22', 'line-width': w(2, 18) } },
      road('minor', ['minor', 'service', 'track'], '#241d18', w(0.4, 4)),
      road('major', ['secondary', 'tertiary'], '#3a2d22', w(0.8, 7)),
      road('trunk', ['primary', 'trunk'], '#5a4529', w(1.2, 10)),
      road('motorway', ['motorway'], '#8a6a2e', w(1.6, 12)),
      { id: 'rail', type: 'line', source: 'omt', 'source-layer': 'transportation', filter: ['in', ['get', 'class'], ['literal', ['rail', 'transit']]],
        paint: { 'line-color': '#6b2a22', 'line-width': 1.2, 'line-dasharray': [3, 2] } },
    ],
  };
}

function ring(lon, lat, km) {
  const pts = [];
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    pts.push([lon + (km / 101.8) * Math.cos(a), lat + (km / 110.6) * Math.sin(a)]);
  }
  return { type: 'Feature', properties: { km }, geometry: { type: 'LineString', coordinates: pts } };
}

async function realMap(root, stage) {
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return;
  let gl;
  try { gl = await loadML(); } catch (e) { return; }
  const box = document.createElement('div');
  box.className = 'lmap-real';
  stage.insertBefore(box, stage.querySelector('.lmap-ui'));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const map = new gl.Map({
    container: box, style: nightStyle(), center: [C.lon, C.lat], zoom: 11.6, minZoom: 10, maxZoom: 16,
    attributionControl: { compact: true }, cooperativeGestures: true, dragRotate: false, pitchWithRotate: false,
  });
  map.touchZoomRotate.disableRotation();
  map.addControl(new gl.NavigationControl({ showCompass: false }), 'bottom-right');

  const fc = (coords) => ({ type: 'FeatureCollection', features: coords ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } }] : [] });
  let active = null;
  // hover: straight dashed preview (only while no road route is showing)
  function route(lon, lat, on) {
    const src = map.getSource('route');
    if (src && !active) src.setData(fc(on ? [[C.lon, C.lat], [lon, lat]] : null));
  }

  // click: real road route from that area to the school (pre-fetched OSRM / OpenStreetMap, assets/data)
  let routes = null, anim = 0;
  const getRoutes = () => routes || (routes = fetch(ROUTES).then((r) => r.json()).then((j) => j.routes).catch(() => ({})));
  const card = document.createElement('div');
  card.className = 'lroute';
  card.hidden = true;
  card.setAttribute('role', 'status');
  card.setAttribute('aria-live', 'polite');
  stage.appendChild(card);
  async function drive(i) {
    const [n, lat, lon, m] = PLACES[i];
    const r = (await getRoutes())[n];
    const coords = r ? r.c : [[lon, lat], [C.lon, C.lat]];
    active = n;
    markers.forEach((el, j) => { el.classList.toggle('is-active', j === i); el.classList.toggle('is-dim', j !== i); });
    stage.classList.add('is-route');
    map.getSource('route').setData(fc(null));
    const b = coords.reduce((bb, p) => bb.extend(p), new gl.LngLatBounds(coords[0], coords[0]));
    const narrow = innerWidth < 720;
    map.fitBounds(b, { padding: narrow ? { top: 70, bottom: 150, left: 30, right: 30 } : { top: 160, bottom: 70, left: 380, right: 120 }, maxZoom: 14.6, duration: reduce ? 0 : 1100 });
    cancelAnimationFrame(anim);
    const t0 = performance.now(), D = reduce ? 0 : 1600;
    const step = (t) => {
      const k = D ? Math.min(1, (t - t0) / D) : 1;
      const e = 1 - Math.pow(1 - k, 3);
      map.getSource('drive').setData(fc(coords.slice(0, Math.max(2, Math.ceil(e * coords.length)))));
      if (k < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
    const g = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=The+Playpen+School,+Bashundhara+R%2FA,+Dhaka&travelmode=driving`;
    card.innerHTML = `<p class="lroute__k">Route to Playpen School</p>` +
      `<p class="lroute__t">From <b>${n}</b></p>` +
      `<p class="lroute__m">${r ? `<span>${r.km} km by road</span>` : ''}<span>about ${m} min</span></p>` +
      `<div class="lroute__a"><a href="${g}" target="_blank" rel="noopener">Directions in Google Maps</a>` +
      `<button type="button" data-lroute-close>Close</button></div>`;
    card.hidden = false;
  }
  function clearDrive(refit) {
    if (!active) return;
    active = null;
    cancelAnimationFrame(anim);
    map.getSource('drive').setData(fc(null));
    markers.forEach((el) => el.classList.remove('is-active', 'is-dim'));
    stage.classList.remove('is-route');
    card.hidden = true;
    if (refit) fit(reduce ? 0 : 1000);
  }
  card.addEventListener('click', (e) => { if (e.target.closest('[data-lroute-close]')) clearDrive(true); });

  const markers = PLACES.map(([n, lat, lon, m], i) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'lmk';
    el.dataset.band = band(m);
    el.setAttribute('aria-label', `${n}: about ${m} minutes by car`);
    el.innerHTML = `<img src="${IMG + ICONS[n]}.webp" alt="" width="64" height="64">` +
      `<span class="lmk__tag"><b>${n}</b><i>${m} min</i></span>`;
    const nd = innerWidth < 720 ? null : NUDGE[n];
    if (nd) {
      const len = Math.hypot(nd[0], nd[1]);
      const ang = Math.atan2(-nd[1], -nd[0]) * 180 / Math.PI;
      el.insertAdjacentHTML('afterbegin', `<i class="lmk__leg" style="width:${len}px;transform:rotate(${ang}deg)"></i>`);
    }
    new gl.Marker({ element: el, anchor: 'bottom', offset: nd || [0, 0] }).setLngLat([lon, lat]).addTo(map);
    el.setAttribute('aria-label', `${n}: about ${m} minutes by car. Show the route to the school`); // MapLibre sets "Map marker"
    el.addEventListener('mouseenter', () => route(lon, lat, true));
    el.addEventListener('focus', () => route(lon, lat, true));
    el.addEventListener('mouseleave', () => route(0, 0, false));
    el.addEventListener('blur', () => route(0, 0, false));
    el.addEventListener('click', () => drive(i));
    return el;
  });
  const home = document.createElement('div');
  home.className = 'lmk-home';
  home.innerHTML = `<span class="lmk-home__pulse"></span><img src="${IMG}crest-pin.webp" alt="" width="70" height="74"><span class="lmk-home__name">Playpen School</span>`;
  new gl.Marker({ element: home, anchor: 'bottom' }).setLngLat([C.lon, C.lat]).addTo(map);

  const fit = (d) => {
    const pad = innerWidth < 720 ? 24 : 60;
    map.fitBounds(BOUNDS, { padding: { top: pad + 60, bottom: pad + 20, left: pad, right: pad }, duration: d });
  };
  map.on('load', () => {
    map.addSource('rings', { type: 'geojson', data: { type: 'FeatureCollection', features: [3, 6, 10].map((k) => ring(C.lon, C.lat, k)) } });
    map.addLayer({ id: 'rings', type: 'line', source: 'rings', paint: { 'line-color': '#F5F1EA', 'line-opacity': 0.38, 'line-width': 1.2, 'line-dasharray': [1, 4] } });
    map.addSource('spots', { type: 'geojson', data: { type: 'FeatureCollection', features: PLACES.map(([, lat, lon]) => ({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [lon, lat] } })) } });
    map.addLayer({ id: 'spots', type: 'circle', source: 'spots', paint: { 'circle-radius': 3.5, 'circle-color': '#F5A719', 'circle-stroke-color': '#14100e', 'circle-stroke-width': 1.5 } });
    map.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.addLayer({ id: 'route', type: 'line', source: 'route', layout: { 'line-cap': 'round' }, paint: { 'line-color': '#F5A719', 'line-width': 2.4, 'line-dasharray': [2, 2] } });
    map.addSource('drive', { type: 'geojson', data: fc(null) });
    map.addLayer({ id: 'drive-glow', type: 'line', source: 'drive', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#F5A719', 'line-width': 12, 'line-blur': 8, 'line-opacity': 0.35 } }, 'spots');
    map.addLayer({ id: 'drive-case', type: 'line', source: 'drive', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#14100e', 'line-width': 6.5 } }, 'spots');
    map.addLayer({ id: 'drive', type: 'line', source: 'drive', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#F5C35A', 'line-width': 3.6 } }, 'spots');
    fit(0);
    getRoutes();
    stage.classList.add('is-real');
  });

  const on = root.querySelector('.lchip[aria-pressed="true"]');
  if (on && +on.dataset.b) markers.forEach((el) => el.classList.toggle('is-out', +el.dataset.band > +on.dataset.b));
  root.querySelector('[data-lmap-chips]').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const v = +b.dataset.b;
    markers.forEach((el) => el.classList.toggle('is-out', v > 0 && +el.dataset.band > v));
  });
  const rc = root.querySelector('[data-lmap-recentre]');
  if (rc) rc.addEventListener('click', () => { if (active) clearDrive(false); fit(reduce ? 0 : 1200); });

  // the list beside the map also shows the route
  const list = root.querySelector('[data-lmap-list]');
  list.classList.add('is-live');
  list.querySelectorAll('li').forEach((li) => { li.tabIndex = 0; li.setAttribute('role', 'button'); li.setAttribute('aria-label', `Show the route from ${li.dataset.name}`); });
  const pick = (li) => {
    const i = PLACES.findIndex((p) => p[0] === li.dataset.name);
    if (i < 0) return;
    if (stage.classList.contains('is-street')) root.querySelector('[data-lmap-street]').click();
    const r = stage.getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight) stage.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    drive(i);
  };
  list.addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) pick(li); });
  list.addEventListener('keydown', (e) => { const li = e.target.closest('li'); if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(li); } });
  stage.addEventListener('keydown', (e) => { if (e.key === 'Escape') clearDrive(true); });
}

document.querySelectorAll('[data-findus]').forEach((root) => {
  const stage = root.querySelector('[data-lmap]');
  if (!stage) return;
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { io.disconnect(); realMap(root, stage); }
  }, { rootMargin: '800px 0px' });
  io.observe(stage);
});
