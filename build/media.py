# -*- coding: utf-8 -*-
"""Responsive image helper for the page builder (Python 3 standard library only).

It finds the files that exist on disk for an image "stem" and writes one <picture> with AVIF and WebP
sources (only the formats that exist), a JPG or PNG fallback, srcset/sizes, real width/height read from
the file headers, and lazy loading. Pages never type the markup: they write

    {{img src="media/learning-1" alt="..." sizes="(min-width: 1024px) 40vw, 100vw"}}

Naming convention it understands (all under site/assets/):

    <stem>-<width>.<ext>      learning-1-720.jpg, learning-1-960.webp, learning-1-1200.avif ...
    <stem>.<ext>              campus-1.jpg (a single file; WebP/AVIF siblings are used when present)

`src` may be a stem ("media/learning-1") or a file ("img/campus-1.jpg"). Paths are relative to
site/assets/.

A trailing "-<3 or 4 digits>" on a file name is read as a width (learning-1-960.jpg) only when the
file really is that many pixels wide; "-1", "-2" are part of the name (campus-1.jpg, campus-2.jpg).

Consent: docs/image-catalogue.md marks the frames that show identifiable children or lettering the
site must not repeat. Those frames cannot be used on a built page (render_img raises MediaError) unless
the coordinator lists the stem in docs/consent-cleared.txt, once the school has agreed.
"""
import os
import re
import struct
from html import escape as esc
from html import unescape

ASSETS_DIR = None            # absolute path of site/assets, set by build.py
_LISTING = {}                # directory -> list of file names (one os.listdir per directory per build)
_SIZES = {}                  # file path -> (w, h) | None
_CONSENT = {}                # cache: {'denied': {key: reason}, 'cleared': set()}

FALLBACK_EXTS = ('jpg', 'jpeg', 'png')
SOURCE_TYPES = (('avif', 'image/avif'), ('webp', 'image/webp'))
WIDTH_RE = r'(?:-(\d{3,4}))?'            # "-960": three or four digits only
DENY_RE = re.compile(r'needs consent|do not use|never use|avoid|check with the school', re.I)
INNER_ONLY_RE = re.compile(r'not for inner pages', re.I)      # a frame made for the home (the cover): fine on the home, wrong elsewhere
CATALOGUE_FILES = ('image-catalogue.md', 'image-catalogue-new.md')


class MediaError(Exception):
    pass


def set_assets_dir(path):
    global ASSETS_DIR
    ASSETS_DIR = os.path.abspath(path)
    _LISTING.clear()
    _SIZES.clear()
    _CONSENT.clear()


def _listing(directory):
    if directory not in _LISTING:
        try:
            _LISTING[directory] = os.listdir(directory)
        except OSError:
            _LISTING[directory] = []
    return _LISTING[directory]


# ---------------------------------------------------------------- header parsing
def _jpeg_size(f):
    f.seek(2)
    while True:
        b = f.read(1)
        while b and b != b'\xff':
            b = f.read(1)
        while b == b'\xff':
            b = f.read(1)
        if not b:
            return None
        m = b[0]
        if 0xC0 <= m <= 0xCF and m not in (0xC4, 0xC8, 0xCC):
            f.read(3)
            h, w = struct.unpack('>HH', f.read(4))
            return w, h
        if m in (0xD8, 0x01) or 0xD0 <= m <= 0xD7:
            continue
        ln = struct.unpack('>H', f.read(2))[0]
        f.seek(ln - 2, 1)


def _png_size(f):
    f.seek(16)
    return struct.unpack('>II', f.read(8))


def _webp_size(f):
    f.seek(12)
    kind = f.read(4)
    f.read(4)
    if kind == b'VP8 ':
        f.read(3 + 3)
        w, h = struct.unpack('<HH', f.read(4))
        return w & 0x3FFF, h & 0x3FFF
    if kind == b'VP8L':
        f.read(1)
        bits = struct.unpack('<I', f.read(4))[0]
        return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
    if kind == b'VP8X':
        f.read(4)
        w = int.from_bytes(f.read(3), 'little') + 1
        h = int.from_bytes(f.read(3), 'little') + 1
        return w, h
    return None


def _gif_size(f):
    f.seek(6)
    return struct.unpack('<HH', f.read(4))


def read_size(path):
    """(width, height) of a jpg, png, webp or gif from its header; None if unknown (svg, avif...)."""
    if path in _SIZES:
        return _SIZES[path]
    size = None
    ext = os.path.splitext(path)[1].lower().lstrip('.')
    try:
        with open(path, 'rb') as f:
            if ext in ('jpg', 'jpeg'):
                size = _jpeg_size(f)
            elif ext == 'png':
                size = _png_size(f)
            elif ext == 'webp':
                size = _webp_size(f)
            elif ext == 'gif':
                size = _gif_size(f)
    except (OSError, struct.error):
        size = None
    _SIZES[path] = size
    return size


# ---------------------------------------------------------------- discovery
def asset_path(rel):
    return os.path.join(ASSETS_DIR, *rel.split('/'))


def asset_exists(rel):
    """True when site/assets/<rel> exists with exactly this spelling (Windows would also accept CAMPUS-1.jpg;
    a Linux host would not, so the case is checked against the directory listing)."""
    if not os.path.isfile(asset_path(rel)):
        return False
    folder, _, name = rel.rpartition('/')
    directory = os.path.join(ASSETS_DIR, *folder.split('/')) if folder else ASSETS_DIR
    return name in _listing(directory)


def _split(src):
    """'media/learning-1' -> ('media', 'learning-1', None); 'img/a.jpg' -> ('img', 'a', 'jpg')."""
    src = src.strip().lstrip('/')
    folder, _, name = src.rpartition('/')
    stem, dot, ext = name.rpartition('.')
    if dot and ext.lower() in FALLBACK_EXTS + ('webp', 'avif'):
        return folder, stem, ext.lower()
    return folder, name, None


def variants(src):
    """{ext: [(width, 'folder/file.ext'), ...]} for every file that exists for this stem."""
    folder, stem, _ = _split(src)
    directory = os.path.join(ASSETS_DIR, *folder.split('/')) if folder else ASSETS_DIR
    pat = re.compile(r'^' + re.escape(stem) + WIDTH_RE + r'\.(avif|webp|jpg|jpeg|png)$', re.I)
    found = {}
    for name in _listing(directory):
        m = pat.match(name)
        if not m:
            continue
        ext = m.group(2).lower()
        rel = (folder + '/' if folder else '') + name
        size = read_size(os.path.join(directory, name))
        width = int(m.group(1)) if m.group(1) else None
        if width is not None and size and abs(size[0] - width) > 2:
            continue                     # "cie-top-2025.jpg" is a file called cie-top-2025, not a 2025 px variant of cie-top
        if width is None:
            width = size[0] if size else None
        found.setdefault(ext, []).append((width, rel))
    for ext in found:
        found[ext].sort(key=lambda t: (t[0] is None, t[0] or 0))
    return found


def _suggest(src):
    folder, stem, _ = _split(src)
    directory = os.path.join(ASSETS_DIR, *folder.split('/')) if folder else ASSETS_DIR
    import difflib
    names = sorted({re.sub(r'-\d{3,4}(?=\.)', '', n).rsplit('.', 1)[0] for n in _listing(directory)})
    close = difflib.get_close_matches(stem, names, n=3, cutoff=0.5)
    return [(folder + '/' if folder else '') + c for c in close]


# ---------------------------------------------------------------- consent (docs/image-catalogue.md)
def consent_key(rel):
    """Catalogue keys a file can answer to: 'media/learning-2-960.webp' -> ['media/learning-2-960', 'media/learning-2'];
    'img/cie-top-2025.jpg' -> ['img/cie-top-2025', 'img/cie-top']."""
    rel = rel.strip().lstrip('/')
    if rel.startswith('assets/'):
        rel = rel[len('assets/'):]
    folder, _, name = rel.rpartition('/')
    stem = re.sub(r'\.(avif|webp|jpe?g|png)$', '', name, flags=re.I)
    keys = [(folder + '/' if folder else '') + stem]
    bare = re.sub(r'-\d{3,4}$', '', stem)
    if bare != stem:
        keys.append((folder + '/' if folder else '') + bare)
    return keys


def _load_consent():
    if _CONSENT:
        return _CONSENT
    docs = os.path.join(os.path.dirname(os.path.dirname(ASSETS_DIR)), 'docs')
    denied, cleared, known = {}, set(), set()
    for catalogue in CATALOGUE_FILES:           # the Foundation's table, and the rows build/images.py appends for new crops
        try:
            with open(os.path.join(docs, catalogue), 'r', encoding='utf-8') as f:
                for line in f:
                    if not line.startswith('|'):
                        continue
                    cells = [c.strip() for c in line.strip().strip('|').split('|')]
                    m = re.match(r'^`([^`]+)`$', cells[0]) if cells else None
                    if not m:
                        continue
                    key = re.sub(r'\.(jpe?g|png|webp|avif)$', '', m.group(1), flags=re.I)
                    known.add(key)
                    rest = ' | '.join(cells[1:])
                    people = cells[-2].lower() if len(cells) >= 2 else ''
                    note = cells[-1]
                    reason = ('%s: %s' % (people, note) if people and note else (note or people or 'flagged in the catalogue')).strip()
                    if DENY_RE.search(rest) or (re.match(r'^faces?\b', people) and 'acceptable' not in note.lower()):
                        denied[key] = (reason, 'consent')
                    elif INNER_ONLY_RE.search(rest):
                        denied[key] = (reason, 'inner')
        except OSError:
            pass
    try:
        with open(os.path.join(docs, 'consent-cleared.txt'), 'r', encoding='utf-8') as f:
            for line in f:
                line = line.split('#', 1)[0].strip()
                if line:
                    cleared.add(re.sub(r'\.(jpe?g|png|webp|avif)$', '', line, flags=re.I))
    except OSError:
        pass
    _CONSENT['denied'], _CONSENT['cleared'], _CONSENT['known'] = denied, cleared, known
    return _CONSENT


def needs_catalogue_row(rel):
    """True for a photograph in site/assets/media/ or site/assets/img/ that the image catalogue does not list. Nobody has
    said whether it shows identifiable children, so it cannot go on a page: add its row (what it shows, the people column);
    build/images.py does it for a new crop."""
    folder = rel.strip().lstrip('/')
    if folder.startswith('assets/'):
        folder = folder[len('assets/'):]
    if folder.split('/', 1)[0] not in ('media', 'img'):
        return False
    known = _load_consent()['known']
    return not any(k in known for k in consent_key(rel))


def consent_problem(rel, home=False):
    """None when the frame may be used; otherwise the catalogue's reason. rel is a path or stem under site/assets/.
    home=True: a frame made only for the home (the cover) is fine there."""
    data = _load_consent()
    for key in consent_key(rel):
        if key in data['cleared']:
            return None
    for key in consent_key(rel):
        if key in data['denied']:
            reason, kind = data['denied'][key]
            if home and kind == 'inner':
                continue
            return reason
    return None


def consent_denied_stems():
    return sorted(_load_consent()['denied'])


def render_img(src, alt, root_assets, sizes=None, cls=None, loading='lazy', fetchpriority=None,
               width=None, height=None, extra_attrs='', widths=None, style=None):
    """Return the <picture> (or a bare <img>) for an image stem or file. Raises MediaError."""
    if alt is None:
        raise MediaError('alt="..." is required (alt="" only for pure decoration)')
    alt = unescape(alt)                  # alt is plain text: "Tom &amp; Jerry" and "Tom & Jerry" both come out right
    if sizes:
        sizes = unescape(sizes)
    reason = consent_problem(src)
    if reason:
        raise MediaError('%s shows identifiable children or lettering the site must not repeat (docs/image-catalogue.md: "%s"); '
                         'the school\'s written consent is needed first. The coordinator lists cleared frames in docs/consent-cleared.txt'
                         % (src, reason))
    if needs_catalogue_row(src):
        raise MediaError('%s is not in docs/image-catalogue.md, so nobody has said whether it shows identifiable children. Add a row '
                         '(what it shows, the people column); build/images.py --people ... --shows ... does it for a new crop' % src)
    found = variants(src)
    fallback_ext = next((e for e in FALLBACK_EXTS if e in found), None)
    if fallback_ext is None:
        hint = _suggest(src)
        raise MediaError('no jpg/jpeg/png file found for image "%s"%s' % (
            src, ('; did you mean ' + ', '.join(hint) + '?') if hint else ''))
    fb = found[fallback_ext]
    if widths:
        wanted = {int(w) for w in widths}
        fb = [v for v in fb if v[0] in wanted] or fb
    # the fallback src: the middle variant when there are three or more, else the largest
    pick = fb[len(fb) // 2] if len(fb) >= 3 else fb[-1]
    pw, ph = width, height
    if not (pw and ph):
        size = read_size(os.path.join(ASSETS_DIR, *pick[1].split('/')))
        if size:
            pw, ph = size
        else:
            raise MediaError('cannot read the size of %s; add width="" and height=""' % pick[1])
    url = lambda rel: root_assets + rel

    def srcset(items):
        multi = [it for it in items if it[0]]
        if len(multi) <= 1 and len(items) <= 1:
            return None
        return ', '.join('%s %dw' % (url(rel), w) for w, rel in items if w)

    img_srcset = srcset(fb)
    attrs = ['src="%s"' % esc(url(pick[1]))]
    if img_srcset:
        attrs.append('srcset="%s"' % esc(img_srcset))
        if sizes:
            attrs.append('sizes="%s"' % esc(sizes))
    attrs.append('width="%d" height="%d"' % (pw, ph))
    attrs.append('alt="%s"' % esc(alt))
    if cls:
        attrs.append('class="%s"' % esc(cls))
    if loading:
        attrs.append('loading="%s"' % esc(loading))
    attrs.append('decoding="async"')
    if fetchpriority:
        attrs.append('fetchpriority="%s"' % esc(fetchpriority))
    if style:
        attrs.append('style="%s"' % esc(style))
    if extra_attrs:
        attrs.append(extra_attrs)
    img = '<img ' + ' '.join(attrs) + '>'

    sources = []
    for ext, mime in SOURCE_TYPES:
        items = found.get(ext)
        if not items:
            continue
        if widths:
            wanted = {int(w) for w in widths}
            items = [v for v in items if v[0] in wanted] or items
        ss = srcset(items) or '%s' % url(items[-1][1])
        s = '<source type="%s" srcset="%s"' % (mime, esc(ss))
        if sizes and srcset(items):
            s += ' sizes="%s"' % esc(sizes)
        sources.append(s + '>')
    if not sources:
        return img
    return '<picture>' + ''.join(sources) + img + '</picture>'


def list_stems(folder):
    """Distinct image stems in site/assets/<folder> (for error hints and the docs)."""
    directory = os.path.join(ASSETS_DIR, *folder.split('/'))
    stems = set()
    for name in _listing(directory):
        m = re.match(r'^(.*?)(?:-\d{3,4})?\.(avif|webp|jpg|jpeg|png)$', name, re.I)
        if m:
            stems.add(m.group(1))
    return sorted(stems)
