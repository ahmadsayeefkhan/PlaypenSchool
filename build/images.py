#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Make responsive variants of ONE photograph for a page (author tool; needs Pillow, the build itself does not).

    python build/images.py <source.jpg> <name> --people distance --shows "what the frame shows" [--note "..."]
                           [--widths 480,960,1440] [--ratio 3:2] [--focus 0.5,0.4] [--quality 80] [--webp]
                           [--folder img] [--credit "..."] [--source "..."] [--force]

Writes into site/assets/<folder>/ (default img):

    <name>-480.jpg  <name>-960.jpg  <name>-1440.jpg        (progressive JPG, sRGB, no metadata)
    <name>-480.webp ...                                     (with --webp)

which {{img src="img/<name>" alt="..." sizes="..."}} then picks up on its own (see docs/COMPONENTS.md, "Images").
It refuses a name that already exists (so two authors can never overwrite each other's crop, and a later
run with other widths can never leave stale files in a srcset); --force replaces your own earlier crop
and deletes its old variants first. Names already listed in docs/image-catalogue.md are never replaced.
Never upscales: a width larger than the (cropped) source is skipped. --ratio crops to that aspect first
(centred, or around --focus x,y as fractions of the width and height). --credit and --source append one line to
docs/credits-log.md so every photograph used on the site has its source on record.

Run it with python -I when the source file came from outside this repository.
"""
import argparse
import datetime
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
ASSETS = os.path.join(REPO, 'site', 'assets')
LOG = os.path.join(REPO, 'docs', 'credits-log.md')
CATALOGUE_NEW = os.path.join(REPO, 'docs', 'image-catalogue-new.md')
# the "people" column of docs/image-catalogue.md: "faces" frames need the school's written consent (the build refuses them)
PEOPLE = ('none', 'distance', 'from above', 'crowd', 'backs of heads', 'a painting', 'screen', 'faces', 'faces (distance)')


def main(argv=None):
    ap = argparse.ArgumentParser(description='Responsive variants of one photograph.')
    ap.add_argument('source')
    ap.add_argument('name', help='file stem, lower case with hyphens, e.g. campus-library')
    ap.add_argument('--widths', default='480,960,1440')
    ap.add_argument('--ratio', default=None, help='crop to this aspect first, e.g. 3:2, 4:5, 16:9, 1:1')
    ap.add_argument('--focus', default='0.5,0.5', help='crop centre as fractions of width,height')
    ap.add_argument('--quality', type=int, default=80)
    ap.add_argument('--webp', action='store_true', help='also write WebP files')
    ap.add_argument('--folder', default='img', help='folder under site/assets (default img)')
    ap.add_argument('--credit', default=None, help='who owns or took the photograph (adds a line to docs/credits-log.md)')
    ap.add_argument('--source', default=None, dest='src_note', help='where it came from (URL or file), for the log')
    ap.add_argument('--force', action='store_true', help='replace an existing image of this name (its old variants are deleted first)')
    ap.add_argument('--people', default=None, help='who is in the frame, for the image catalogue: %s (required)' % ', '.join(PEOPLE))
    ap.add_argument('--shows', default=None, help='what the frame shows, in one plain sentence, for the image catalogue (required)')
    ap.add_argument('--note', default=None, help='a note for the catalogue row (where it is used)')
    args = ap.parse_args(argv)
    if not args.people or not args.shows:
        print('--people and --shows are required: every photograph on the site is entered in docs/image-catalogue-new.md, with whether '
              'it shows identifiable children (%s). The build refuses a frame the catalogue does not list.' % ', '.join(PEOPLE))
        return 1
    if args.people.lower() not in PEOPLE:
        print('--people must be one of: %s' % ', '.join(PEOPLE))
        return 1
    try:
        from PIL import Image, ImageOps
    except ImportError:
        print('Pillow is needed for this tool: python -m pip install Pillow')
        return 2
    if not os.path.isfile(args.source):
        print('no such file: %s' % args.source)
        return 1
    if not all(c.isalnum() or c == '-' for c in args.name) or args.name != args.name.lower():
        print('name must be lower case letters, digits and hyphens')
        return 1
    out_dir = os.path.join(ASSETS, *args.folder.split('/'))
    # never overwrite another author's photograph: any <name>.<ext> or <name>-<width>.<ext> already there, or a name
    # that the image catalogue already lists, stops the run (use --force to replace your own earlier crop)
    existing = []
    if os.path.isdir(out_dir):
        pat = re.compile(r'^' + re.escape(args.name) + r'(?:-\d{3,4})?\.(jpe?g|png|webp|avif)$', re.I)
        existing = [n for n in os.listdir(out_dir) if pat.match(n)]
    listed = set()
    try:
        with open(os.path.join(REPO, 'docs', 'image-catalogue.md'), 'r', encoding='utf-8') as f:
            for line in f:
                m = re.match(r'^\|\s*`([^`]+)`', line)
                if m:
                    listed.add(re.sub(r'\.(jpe?g|png|webp|avif)$', '', m.group(1), flags=re.I))
    except OSError:
        pass
    if (args.folder + '/' + args.name) in listed and not existing:
        print('"%s/%s" is already named in docs/image-catalogue.md; choose another name' % (args.folder, args.name))
        return 1
    if existing and not args.force:
        print('%s/%s already exists (%s). Choose another name, or add --force to replace it.' % (
            args.folder, args.name, ', '.join(sorted(existing)[:4]) + (' ...' if len(existing) > 4 else '')))
        return 1
    if (args.folder + '/' + args.name) in listed and args.force:
        print('"%s/%s" is a photograph listed in docs/image-catalogue.md; --force will not replace it. Choose another name.' % (args.folder, args.name))
        return 1
    im = ImageOps.exif_transpose(Image.open(args.source)).convert('RGB')
    W, H = im.size
    if args.ratio:
        rw, rh = [float(x) for x in args.ratio.split(':')]
        fx, fy = [float(x) for x in args.focus.split(',')]
        target = rw / rh
        if W / H > target:
            nw, nh = int(H * target), H
        else:
            nw, nh = W, int(W / target)
        x0 = min(max(int(fx * W - nw / 2), 0), W - nw)
        y0 = min(max(int(fy * H - nh / 2), 0), H - nh)
        im = im.crop((x0, y0, x0 + nw, y0 + nh))
        W, H = im.size
    os.makedirs(out_dir, exist_ok=True)
    for old in existing:                 # --force: no stale variant stays behind to be mixed into the new srcset
        os.remove(os.path.join(out_dir, old))
    written = []
    for w in [int(x) for x in args.widths.split(',')]:
        if w > W:
            print('skip %d (the source is only %d px wide)' % (w, W))
            continue
        h = round(H * w / W)
        r = im.resize((w, h), Image.LANCZOS)
        path = os.path.join(out_dir, '%s-%d.jpg' % (args.name, w))
        r.save(path, 'JPEG', quality=args.quality, optimize=True, progressive=True)
        written.append((path, w, h, os.path.getsize(path)))
        if args.webp:
            path = os.path.join(out_dir, '%s-%d.webp' % (args.name, w))
            r.save(path, 'WEBP', quality=max(args.quality - 4, 50), method=6)
            written.append((path, w, h, os.path.getsize(path)))
    if not written:
        print('nothing written: every width is larger than the source')
        return 1
    for path, w, h, size in written:
        print('%-60s %5d x %-5d %7.1f KB' % (os.path.relpath(path, REPO).replace(os.sep, '/'), w, h, size / 1024.0))
    # the catalogue row: what the frame shows and who is in it (build/media.py reads it; "faces" rows are refused by the build)
    key = '%s/%s' % (args.folder, args.name)
    widths_done = sorted({w for _, w, _, _ in written})
    kinds = 'JPG and WebP' if args.webp else 'JPG'
    clean = lambda t: ' '.join((t or '').replace('|', '/').split())
    row = '| `%s` | %s (%s)%s | %s | %s | %s |' % (
        key, ', '.join(str(w) for w in widths_done), kinds, (', %s' % args.ratio) if args.ratio else '', clean(args.shows), clean(args.people),
        clean(args.note) or 'Made with build/images.py')
    os.makedirs(os.path.dirname(CATALOGUE_NEW), exist_ok=True)
    kept = []
    if os.path.isfile(CATALOGUE_NEW):
        with open(CATALOGUE_NEW, 'r', encoding='utf-8') as f:
            kept = [l.rstrip('\n') for l in f if not l.startswith('| `%s`' % key)]      # --force: replace this crop's own row
    else:
        kept = ['# Image catalogue: frames added since', '',
                'One row for every crop made with `python build/images.py ... --people ... --shows ...`, in the format of the `img/` table of '
                '`image-catalogue.md`; `build/media.py` reads both files. A row is added by the tool, never rewritten by hand. The people column '
                'decides what the build allows (see the head of `image-catalogue.md`): `faces` rows are refused until the school has agreed in writing.',
                '', '| file | size | shows | people | note |', '|---|---|---|---|---|']
    kept.append(row)
    with open(CATALOGUE_NEW, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(kept) + '\n')
    print('catalogued in docs/image-catalogue-new.md (people: %s)%s' % (args.people, '  NOTE: the build will refuse this frame until the school consents' if args.people.lower().startswith('faces') else ''))
    if args.credit or args.src_note:
        os.makedirs(os.path.dirname(LOG), exist_ok=True)
        new = not os.path.isfile(LOG)
        with open(LOG, 'a', encoding='utf-8', newline='\n') as f:
            if new:
                f.write('# Credits log\n\nOne line per photograph used on the site that is not already in docs/CREDITS.md. Append only.\n\n')
            f.write('- %s  site/assets/%s/%s-*  credit: %s  source: %s\n' % (
                datetime.date.today().isoformat(), args.folder, args.name, args.credit or 'The Playpen School', args.src_note or args.source))
        print('logged in docs/credits-log.md')
    print('use it: {{img src="%s/%s" alt="..." sizes="(min-width: 1024px) 40vw, 100vw"}}' % (args.folder, args.name))
    return 0


if __name__ == '__main__':
    sys.exit(main())
