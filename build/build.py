#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Static site builder for The Playpen School (Python 3 standard library only).

    python build/build.py                    build every page, the shared files and the redirect stubs
    python build/build.py --only learning    build only /learning/... (use this while you write your pages)
    python build/build.py --only /admissions/faq/ --only about/history
    python build/build.py --strict           also fail when a page in nav.json has no source yet
    python build/build.py --list             list every page with its source and status
    python build/build.py --kit              build the dev-only component kit at site/_kit/ (never published)
    python build/build.py --base /PlaypenSchool/   absolute base path for 404.html (GitHub Pages sub-path only; a
                                             Vercel or root deploy must NOT use it)

A selector that matches no page (a typo, or Git Bash rewriting "/admissions/faq/" into a Windows path) is an
error, never a silent "0 pages written". In Git Bash write the selector without a leading slash
(--only admissions/faq) or set MSYS_NO_PATHCONV=1.

Input
    build/nav.json                  the information architecture (pages, menu, footer, phones, redirects)
    build/pages/<slug>.html         one source per page: front matter + the body of <main>
                                    (hubs: build/pages/<slug>/index.html is also accepted)
    build/additions/<group>.css     a page group's own extra styles  } joined, in file-name order, into
    build/additions/<group>.js      a page group's own extra script   } site/css|js/pages-additions.*

Output (site/)
    <slug>/index.html               every page, wrapped in the shell (build/shell.py)
    404.html                        the /404/ page with absolute URLs (hosts serve it at any depth)
    <old>.html                      meta-refresh stubs for the old flat pages (about.html ...)
    sitemap.xml, robots.txt, assets/search-index.json, assets/sitemap.json
    css/pages-additions.css, js/pages-additions.js     generated from build/additions/ (never edit by hand)

It never writes site/index.html (the hand-built home) and never touches site/audit-report.html,
site/report-summary.html or site/credits.html. It fails loudly (exit code 1, readable messages) on an
unknown {{link:}} target, a missing asset, a duplicate or missing H1, a missing title or description,
unknown tokens or front matter keys, broken tag nesting and other source mistakes.
"""
import argparse
import datetime
import difflib
import json
import os
import re
import shutil
import subprocess
import sys
import time
from html import unescape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import htmlutil  # noqa: E402
import media     # noqa: E402
import shell     # noqa: E402

REPO = os.path.dirname(HERE)
SITE = os.path.join(REPO, 'site')
PAGES_DIR = os.path.join(HERE, 'pages')
DEV_DIR = os.path.join(HERE, 'dev')
ADDITIONS_DIR = os.path.join(HERE, 'additions')
NAV_JSON = os.path.join(HERE, 'nav.json')

TOKEN_RE = re.compile(r'\{\{\s*([a-z][a-z0-9_]*)(.*?)\}\}', re.S)
ATTR_RE = re.compile(r'([a-zA-Z_][\w-]*)\s*=\s*(?:"([^"]*)"|\'([^\']*)\')')
BOOL_KEYS = {'noindex', 'actions'}
DATE_KEYS = ('date', 'updated', 'lastmod')
SCHEMAS = {'school', 'faq', 'contact', 'about', 'collection', 'article', 'webpage'}
KNOWN_TOKENS = ('link', 'asset', 'root', 'no', 'breadcrumb', 'phones', 'phone', 'address', 'maps_url', 'map', 'hours', 'cta',
                'children', 'sitemap', 'img', 'ext')
DRAFT_MARK = 'name="pp:draft"'
GENERATED_ASSETS = {'search-index.json', 'sitemap.json'}      # written by this script, so {{asset:...}} may name them
CONFIRM_RE = re.compile(r'[ \t]*<!--\s*CONFIRM\b.*?-->[ \t]*\n?', re.S)   # notes for the coordinator: kept in the source, never published
BLOCK_TOKENS = ('phones', 'children', 'sitemap', 'cta')       # tokens that output a list or a section (they end a <p>)


def whole_number(value, what):
    """int(value), or a readable error (a token handler's failure becomes a build error with the line number)."""
    try:
        return int(value)
    except (TypeError, ValueError):
        raise ValueError('%s must be a whole number, not "%s"' % (what, value))


class SourceError(Exception):
    """A mistake in a page source. Carries a line number relative to the source file."""

    def __init__(self, message, line=None):
        super().__init__(message)
        self.line = line


# --------------------------------------------------------------------------- reading sources
def discover(nav):
    """({slug: path}, problems, warnings) for every source in build/pages. A file that would be skipped without a word
    (a .htm file, a name that starts with an underscore) is reported, so a page never silently stays a stub."""
    found, problems, warns = {}, [], []
    for root, dirs, files in os.walk(PAGES_DIR):
        for d in dirs:
            if d.startswith('_'):
                warns.append('%s/: the folder name starts with an underscore, so the build ignores everything in it'
                             % os.path.relpath(os.path.join(root, d), PAGES_DIR).replace(os.sep, '/'))
        dirs[:] = sorted(d for d in dirs if not d.startswith('_'))
        for f in sorted(files):
            if f.startswith('.'):
                continue
            if not f.endswith('.html'):
                problems.append('%s: only .html sources are built (rename it, or move it out of build/pages)'
                                % os.path.relpath(os.path.join(root, f), PAGES_DIR).replace(os.sep, '/'))
                continue
            if f.startswith('_'):
                warns.append('%s: the name starts with an underscore, so the build ignores it'
                             % os.path.relpath(os.path.join(root, f), PAGES_DIR).replace(os.sep, '/'))
                continue
            full = os.path.join(root, f)
            rel = os.path.relpath(full, PAGES_DIR).replace(os.sep, '/')
            stem = rel[:-5]
            if stem.endswith('/index'):
                stem = stem[:-6]
            if stem == 'index':
                problems.append('%s: the home page is hand-built (site/index.html); do not add a source for "/"' % rel)
                continue
            slug = '/' + stem + '/'
            if slug not in nav.by_slug:
                close = difflib.get_close_matches(slug, list(nav.by_slug), n=2, cutoff=0.6)
                problems.append('%s: "%s" is not a page in build/nav.json%s' % (
                    rel, slug, ('; did you mean ' + ' or '.join(close) + '?') if close else ' (add it to nav.json first)'))
                continue
            if slug in found:
                problems.append('%s: duplicate source for %s (also %s)' % (rel, slug, os.path.relpath(found[slug], PAGES_DIR)))
                continue
            found[slug] = full
    return found, problems, warns


def parse_front_matter(text):
    """(dict, body, number of lines the front matter occupies). Raises SourceError."""
    if text.startswith('﻿'):
        text = text[1:]
    lines = text.split('\n')
    if not lines or lines[0].strip() != '---':
        raise SourceError('the file must start with a front matter block: a line with ---, key: value lines, a line with ---', 1)
    fm, key, i = {}, None, 1
    while i < len(lines) and lines[i].strip() != '---':
        raw = lines[i]
        if not raw.strip() or raw.lstrip().startswith('#'):
            i += 1
            continue
        if raw[:1] in (' ', '\t') and key:
            fm[key] = (fm[key] + ' ' + raw.strip()).strip()
            i += 1
            continue
        m = re.match(r'^([a-z_][a-z0-9_]*)\s*:\s*(.*)$', raw)
        if not m:
            raise SourceError('front matter line is not "key: value": %r' % raw.strip(), i + 1)
        key, val = m.group(1), m.group(2).strip()
        if key not in shell.ALLOWED_FRONT_MATTER:
            close = difflib.get_close_matches(key, sorted(shell.ALLOWED_FRONT_MATTER), n=2, cutoff=0.5)
            raise SourceError('unknown front matter key "%s"%s. Allowed: %s' % (
                key, ('; did you mean "%s"?' % close[0]) if close else '', ', '.join(sorted(shell.ALLOWED_FRONT_MATTER))), i + 1)
        if key in fm:
            raise SourceError('front matter key "%s" appears twice (the second would silently win); keep one' % key, i + 1)
        # outer quotes are optional; they are stripped only when they are the one pair around the whole value
        # (title: "Class I" to "III" keeps its quotes)
        if len(val) >= 2 and val[0] == val[-1] and val[0] in '"\'' and val.count(val[0]) == 2:
            val = val[1:-1]
        fm[key] = val
        i += 1
    if i >= len(lines):
        raise SourceError('the front matter block is never closed (missing the second --- line)', 1)
    for k in DATE_KEYS:
        if k in fm:
            try:
                if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', fm[k]):
                    raise ValueError
                datetime.date.fromisoformat(fm[k])
            except ValueError:
                raise SourceError('front matter "%s" must be a real date written 2026-10-11, not "%s"' % (k, fm[k]))
    for k in BOOL_KEYS & set(fm):
        v = fm[k].lower()
        if v in ('true', 'yes', 'on', '1'):
            fm[k] = True
        elif v in ('false', 'no', 'off', '0'):
            fm[k] = False
        else:
            raise SourceError('front matter "%s" must be true or false, not %r' % (k, fm[k]))
    body = '\n'.join(lines[i + 1:])
    return fm, body, i + 1


def parse_breadcrumb(value, nav):
    """'Home=/ ; About=/about/ ; History' -> [('Home','/'), ('About','/about/'), ('History', None)]"""
    out = []
    for part in value.split(';'):
        part = part.strip()
        if not part:
            continue
        if '=' in part:
            label, slug = [x.strip() for x in part.rsplit('=', 1)]
            if slug not in nav.by_slug:
                raise SourceError('breadcrumb: %s is not a page in nav.json' % slug)
            out.append((label, slug))
        else:
            out.append((part, None))
    if not out or out[-1][1] is not None:
        raise SourceError('breadcrumb: the last item is the current page and must have no =link')
    return out


# --------------------------------------------------------------------------- tokens
def parse_attrs(rest):
    attrs = {}
    for m in ATTR_RE.finditer(rest):
        attrs[m.group(1)] = m.group(2) if m.group(2) is not None else m.group(3)
    leftover = ATTR_RE.sub('', rest).strip()
    return attrs, leftover


def expand_tokens(body, ctx, nav, page, crumb_items, line0, errors):
    """Replace every {{token}} in a body. Appends (message, line) tuples to errors. Returns the new text."""
    counters = {'no': 0}
    results = {}

    def line_of(m):
        return body.count('\n', 0, m.start()) + 1 + line0

    def fail(m, msg):
        errors.append((msg, line_of(m)))
        return ''

    def repl(m):
        out = repl_inner(m)
        results[m.start()] = out
        return out

    def repl_inner(m):
        name, rest = m.group(1), m.group(2).strip()
        if name not in KNOWN_TOKENS:
            close = difflib.get_close_matches(name, KNOWN_TOKENS, n=1, cutoff=0.5)
            return fail(m, 'unknown token {{%s}}%s. Known tokens: %s' % (
                name, (' (did you mean {{%s}}?)' % close[0]) if close else '', ', '.join('{{%s}}' % t for t in KNOWN_TOKENS)))
        arg = rest[1:].strip() if rest.startswith(':') else None
        try:
            if name == 'link':
                if not arg:
                    return fail(m, '{{link:}} needs a target, e.g. {{link:/about/history/}}')
                slug, frag = shell.split_target(arg)
                if slug not in nav.by_slug:
                    close = difflib.get_close_matches(slug, list(nav.by_slug), n=3, cutoff=0.5)
                    hint = ''
                    if slug + '/' in nav.by_slug:
                        hint = ' (add the trailing slash: %s/)' % slug
                    elif close:
                        hint = '; did you mean ' + ', '.join(close) + '?'
                    return fail(m, 'unknown link target %s: not a page in nav.json%s' % (slug, hint))
                return ctx.link(arg)
            if name == 'asset':
                if not arg:
                    return fail(m, '{{asset:}} needs a path under site/assets/, e.g. {{asset:img/campus-1.jpg}}')
                path = arg.split('#')[0].split('?')[0]
                if not media.asset_exists(path) and path not in GENERATED_ASSETS:
                    folder, _, base = path.rpartition('/')
                    d = os.path.join(media.ASSETS_DIR, *folder.split('/')) if folder else media.ASSETS_DIR
                    names = os.listdir(d) if os.path.isdir(d) else []
                    same_word = [n for n in names if n.lower() == base.lower()]       # right name, wrong capitals (a Linux host is case-sensitive)
                    close = same_word or difflib.get_close_matches(base, names, n=3, cutoff=0.5)
                    note = ' (the file is spelled that way, in lower case: Vercel is case-sensitive)' if same_word else ''
                    return fail(m, 'missing asset site/assets/%s%s%s' % (path, ('; did you mean ' + ', '.join((folder + '/' if folder else '') + c for c in close) + '?') if close else '', note))
                return ctx.asset(arg)
            if name == 'root':
                return ctx.root
            if name == 'no':
                counters['no'] += 1
                return '%02d' % counters['no']
            if name == 'breadcrumb':
                return shell.render_breadcrumb(ctx, crumb_items)
            if name == 'phones':
                kind = arg or 'sections'
                if kind not in ('sections', 'all'):
                    return fail(m, '{{phones:%s}}: use {{phones}} or {{phones:all}}' % kind)
                return shell.phones_list(nav, kind)
            if name == 'phone':
                key, _, tail = (arg or '').partition(' ')
                attrs, left = parse_attrs(tail)
                if left.strip() or set(attrs) - {'class'}:
                    return fail(m, '{{phone:%s ...}}: only class="..." may follow the key' % key)
                try:
                    return shell.phone_link(nav, key, attrs.get('class') or 'link')
                except KeyError:
                    keys = [p['key'] for p in nav.site['phones']] + ['further', 'call']
                    return fail(m, '{{phone:%s}}: unknown line. Use one of %s' % (key, ', '.join(keys)))
            if name == 'address':
                return shell.h(nav.site['address_line'])
            if name == 'maps_url':
                return shell.h(nav.site['maps_url'])
            if name == 'map':
                attrs, left = parse_attrs(rest)
                if left.strip() or set(attrs) - {'class', 'label'}:
                    return fail(m, '{{map}} takes only label="..." and class="..."')
                return shell.maps_link(nav, attrs.get('class') or 'link', attrs.get('label') or 'Map')
            if name == 'hours':
                if not arg:
                    return shell.h(nav.site['hours'])
                if arg == 'between':
                    return shell.h(nav.site['hours_between'])
                return fail(m, '{{hours:%s}}: use {{hours}} (%s) or {{hours:between}} (%s)' % (arg, nav.site['hours'], nav.site['hours_between']))
            if name == 'ext':
                # {{ext:portal}} / {{ext:pay}} (from nav.json utility), or {{ext href="https://playpen.edu.bd/..." label="..."}}
                if arg is not None:
                    key, _, tail = arg.partition(' ')
                    attrs, left = parse_attrs(tail)
                    item = next((u for u in nav.utility if u.get('key') == key and u.get('external')), None)
                    if item is None:
                        keys = ', '.join('{{ext:%s}}' % u['key'] for u in nav.utility if u.get('external'))
                        return fail(m, '{{ext:%s}}: unknown. Use %s, or {{ext href="https://..." label="..."}}' % (key, keys))
                    href, label = item['href'], attrs.get('label') or item['label']
                else:
                    attrs, left = parse_attrs(rest)
                    href, label = attrs.get('href'), attrs.get('label')
                    if not href or not label:
                        return fail(m, '{{ext}} needs href="https://..." and label="..."')
                if left.strip() or set(attrs) - {'href', 'label', 'class'}:
                    return fail(m, '{{ext}} takes only href, label and class, each as key="value"')
                href = unescape(href)
                if not shell.external_allowed(nav, href):
                    return fail(m, '%s is not an outside address the site may link to (nav.json external_ok: the portal, online payment, '
                                   'admission forms, the mission statement, uploads, Google Maps). A page that exists here is linked with {{link:...}}' % href)
                return shell.ext_link(label, href, attrs.get('class') or 'link link--ext')
            if name == 'cta':
                attrs, left = parse_attrs(rest)
                return shell.render_cta(ctx, attrs.get('heading') or 'Come and see the school.', attrs.get('text'))
            if name == 'children':
                if not arg:
                    return fail(m, '{{children:/about/}} needs a parent page (or group=about)')
                first, _, tail = arg.partition(' ')
                attrs, left = parse_attrs(tail)
                kw = {'level': whole_number(attrs.get('level', 3), 'level')}
                if first.startswith('group='):
                    kw['group'] = first[6:]
                    if kw['group'] not in nav.group_by_key:
                        return fail(m, '{{children:%s}}: unknown group' % first)
                else:
                    if first not in nav.by_slug:
                        return fail(m, '{{children:%s}}: not a page in nav.json' % first)
                    kw['parent'] = first
                if 'template' in attrs:
                    kw['template'] = attrs['template']
                if 'not' in attrs:
                    kw['not_template'] = attrs['not']
                cards = shell.render_children(ctx, **kw)
                if '<li' not in cards:
                    return fail(m, '{{children:%s}} found no child pages' % first)
                return cards
            if name == 'sitemap':
                return shell.render_sitemap(ctx)
            if name == 'img':
                attrs, left = parse_attrs(rest)
                allowed = {'src', 'alt', 'sizes', 'class', 'loading', 'fetchpriority', 'widths', 'style', 'width', 'height'}
                bad = set(attrs) - allowed
                if bad:
                    return fail(m, '{{img}}: unknown attribute %s. Allowed: %s' % (', '.join(sorted(bad)), ', '.join(sorted(allowed))))
                if left:
                    return fail(m, '{{img}}: could not read %r; attributes must be key="value"' % left)
                if 'src' not in attrs:
                    return fail(m, '{{img}} needs src="media/learning-1" (a stem or file under site/assets/)')
                widths = [whole_number(w.strip(), 'widths') for w in attrs['widths'].split(',')] if attrs.get('widths') else None
                try:
                    out = media.render_img(
                        attrs['src'], attrs.get('alt'), ctx.asset(''), sizes=attrs.get('sizes'), cls=attrs.get('class'),
                        loading=attrs.get('loading', 'lazy'), fetchpriority=attrs.get('fetchpriority'),
                        width=whole_number(attrs['width'], 'width') if attrs.get('width') else None,
                        height=whole_number(attrs['height'], 'height') if attrs.get('height') else None, widths=widths, style=attrs.get('style'))
                except media.MediaError as e:
                    return fail(m, '{{img}}: %s' % e)
                img_tag = out.split('<img', 1)[1].split('>', 1)[0]
                if 'srcset=' in img_tag and 'sizes=' not in img_tag:
                    errors.append(('{{img src="%s"}} has several widths but no sizes="..." (say how wide it renders, e.g. sizes="(min-width: 1024px) 40vw, 100vw")' % attrs['src'], line_of(m)))
                return out
        except Exception as e:  # a token handler must never crash the build
            return fail(m, '{{%s}} failed: %s' % (name, e))
        return fail(m, 'token {{%s}} is not implemented' % name)

    final = TOKEN_RE.sub(repl, body)
    # "flat" copy: every token's output on one line, so line numbers in validation messages match the source file
    flat = TOKEN_RE.sub(lambda m: results.get(m.start(), '').replace('\n', ' '), body)
    return final, flat


# --------------------------------------------------------------------------- validating a body
RAW_FORBIDDEN = [
    (re.compile(r'<\s*/?\s*(html|head|body|main)\b', re.I), 'do not write <html>, <head>, <body> or <main>: the shell wraps your body'),
    (re.compile(r'<\s*script\b', re.I), 'no <script> in a page body: behaviour comes from js/inner.js (data attributes); ask the Foundation for new behaviour'),
    (re.compile(r'<\s*style\b', re.I), 'no <style> in a page body: add rules to the PAGES-ADDITIONS section of site/css/pages.css'),
    (re.compile(r'<\s*link\b', re.I), 'no <link> in a page body'),
    (re.compile(r'<\s*meta\b', re.I), 'no <meta> in a page body: use front matter'),
    (re.compile(r'<\s*(header|nav|footer)\b[^>]*\bid\s*=\s*"(top|contact|menu|nav-primary)"', re.I), 'do not redefine the shell\'s header, menu or footer ids'),
    (re.compile(r'<[^>]*\son[a-z]+\s*=', re.I), 'no inline event handlers (onclick ...): behaviour comes from js/inner.js through data attributes'),
    (re.compile(r'\bhref\s*=\s*["\']\s*javascript:', re.I), 'no javascript: links'),
]


def validate_body(body, line0, errors, warnings, in_kit=False):
    """Source-level checks on the expanded body. Appends (message, line) tuples."""
    for rx, msg in RAW_FORBIDDEN:
        for m in rx.finditer(body):
            errors.append((msg, body.count('\n', 0, m.start()) + 1 + line0))
    for m in re.finditer(r'\bstyle\s*=\s*"([^"]*)"', body):
        decl = m.group(1).strip()
        if decl and not re.fullmatch(r'(\s*--[\w-]+\s*:[^;]+;?)+', decl):
            errors.append(('inline style "%s": only custom properties (style="--i:2") are allowed; use components or the PAGES-ADDITIONS section of pages.css' % decl[:60],
                           body.count('\n', 0, m.start()) + 1 + line0))
    for m in re.finditer(r'<img\b[^>]*>', body, re.I):
        tag = m.group(0)
        ln = body.count('\n', 0, m.start()) + 1 + line0
        if not re.search(r'\balt\s*=', tag):
            errors.append(('<img> without alt (alt="" only for pure decoration)', ln))
        else:
            alt = re.search(r'\balt\s*=\s*"([^"]*)"', tag)
            problem = htmlutil.alt_problem(unescape(alt.group(1))) if alt else None
            if problem:
                errors.append(('alt text "%s" %s' % (unescape(alt.group(1))[:50], problem), ln))
        if not (re.search(r'\bwidth\s*=', tag) and re.search(r'\bheight\s*=', tag)):
            errors.append(('<img> without width and height (use {{img src=... alt=...}}, which adds them)', ln))
        if re.search(r'\bsrc\s*=\s*"https?://', tag, re.I):
            errors.append(('<img> from another site: no hot-linking; every picture is a file under site/assets/', ln))
    for m in re.finditer(r'<a\b[^>]*\btarget\s*=\s*"_blank"[^>]*>(.*?)</a>', body, re.I | re.S):
        ln = body.count('\n', 0, m.start()) + 1 + line0
        if 'noopener' not in m.group(0).split('>', 1)[0]:
            errors.append(('target="_blank" link without rel="noopener"', ln))
        if 'new tab' not in re.sub(r'\s+', ' ', htmlutil.text_of(m.group(1))).lower():
            errors.append(('a link that opens a new tab must say so to a screen reader: use {{ext href="..." label="..."}} (it adds the hidden text) '
                           'or put <span class="visually-hidden"> (opens in a new tab)</span> inside the link', ln))
    for m in re.finditer(r'(?:href|src)\s*=\s*"http://', body, re.I):
        errors.append(('http:// link or source; use https://', body.count('\n', 0, m.start()) + 1 + line0))
    for m in re.finditer(r'<iframe\b[^>]*>', body, re.I):
        tag = m.group(0)
        ln = body.count('\n', 0, m.start()) + 1 + line0
        if 'https://www.google.com/maps/' not in tag:
            errors.append(('<iframe> only for the Google Maps embed (https://www.google.com/maps/...); no other third-party content', ln))
        elif 'title=' not in tag:
            errors.append(('<iframe> needs a title attribute', ln))
    for problem in htmlutil.check_balance(body, line0):
        mm = re.match(r'line (\d+): (.*)', problem)
        if mm:
            errors.append((mm.group(2), int(mm.group(1))))
        else:
            errors.append((problem, None))


# --------------------------------------------------------------------------- building one page
class Built:
    def __init__(self, slug, html, page, m, body_final, draft=False):
        self.slug, self.html, self.page, self.m, self.body, self.draft = slug, html, page, m, body_final, draft
        self.confirm = 0            # number of <!-- CONFIRM --> notes in the source (stripped from the HTML)


def build_page(nav, page, src_path, root_override=None, kit=False):
    """Return (Built | None, errors, warnings). errors/warnings are lists of (message, line|None)."""
    errors, warnings = [], []
    slug = page['slug']
    try:
        with open(src_path, 'r', encoding='utf-8') as f:
            text = f.read().replace('\r\n', '\n')
        fm, body, fm_lines = parse_front_matter(text)
    except SourceError as e:
        return None, [(str(e), e.line)], warnings
    except UnicodeDecodeError as e:
        return None, [('file is not valid UTF-8: %s' % e, None)], warnings

    ctx = shell.Ctx(nav, slug, root=root_override)
    try:
        crumbs = parse_breadcrumb(fm['breadcrumb'], nav) if fm.get('breadcrumb') else shell.breadcrumb_items(nav, page)
    except SourceError as e:
        return None, [(str(e), None)], warnings

    # title, description and alt texts are plain text: "Tom &amp; Jerry" and "Tom & Jerry" both come out right
    title = unescape((fm.get('title') or page['title']).strip())
    description = unescape((fm.get('description') or page['description']).strip())
    if not title:
        errors.append(('missing title (set "title:" in the front matter or in nav.json)', None))
    if not description:
        errors.append(('missing description (set "description:" in the front matter or in nav.json)', None))
    elif not (shell.DESC_MIN <= len(description) <= shell.DESC_MAX):
        warnings.append(('description is %d characters; aim for %d to %d so search results do not cut it'
                         % (len(description), shell.DESC_MIN, shell.DESC_MAX), None))
    template = fm.get('template') or page['template']
    if template not in nav.templates:
        errors.append(('unknown template %s' % template, None))
    schema = fm.get('schema')
    if schema and schema not in SCHEMAS:
        errors.append(('unknown schema "%s". Use one of %s' % (schema, ', '.join(sorted(SCHEMAS))), None))
    if fm.get('og_image') and not media.asset_exists(fm['og_image']):
        errors.append(('og_image: missing asset site/assets/%s' % fm['og_image'], None))

    # tokens first, so {{img}} and {{link}} inside the body are real markup when validated
    raw_body = body
    body, flat = expand_tokens(body, ctx, nav, page, crumbs, fm_lines, errors)
    # front matter fields may carry tokens and inline HTML (h1, standfirst, hero_caption)
    for k in ('h1', 'standfirst', 'hero_caption'):
        if fm.get(k):
            fm[k], _ = expand_tokens(fm[k], ctx, nav, page, crumbs, 0, errors)
    if fm.get('h1') and len(re.findall(r'<em\b', fm['h1'], re.I)) > 1:
        errors.append(('h1: at most one <em> word (it turns maroon italic, as on the home)', None))
    if fm.get('hero_image'):
        problem = htmlutil.alt_problem(unescape(fm.get('hero_alt', '')))
        if problem:
            errors.append(('hero_alt "%s" %s' % (unescape(fm.get('hero_alt', ''))[:50], problem), None))
    for m in re.finditer(r'\{\{|\}\}', flat):
        errors.append(('a "{{" or "}}" is left in the body: unclosed or mistyped token', flat.count('\n', 0, m.start()) + 1 + fm_lines))
        break
    validate_body(flat, fm_lines, errors, warnings, in_kit=kit)
    if any(msg.startswith('</p> has no matching') for msg, _ in errors) and re.search(
            r'<p\b[^>]*>(?:(?!</p>).)*?\{\{\s*(?:%s)\b' % '|'.join(BLOCK_TOKENS), raw_body, re.S):
        hint = (' (a {{phones}}, {{children}}, {{sitemap}} or {{cta}} token sits inside a <p>: those tokens output a list or a '
                'section, which ends the paragraph, so the </p> is left over. Put the token outside the <p>, for instance in a <div>)')
        errors[:] = [((msg + hint) if msg.startswith('</p> has no matching') else msg, ln) for msg, ln in errors]

    has_body_h1 = bool(re.search(r'<h1[\s>]', body, re.I))
    body_h1s = len(re.findall(r'<h1[\s>]', body, re.I))
    if body_h1s > 1:
        errors.append(('duplicate H1: the body has %d <h1> elements (a page has exactly one)' % body_h1s, None))
    if has_body_h1 and fm.get('h1'):
        errors.append(('duplicate H1: the front matter has "h1:" (the shell renders the hero) and the body also has an <h1>; keep one', None))
    hero_needed = not has_body_h1
    if hero_needed and not fm.get('h1'):
        fm['h1'] = shell.h(title)
    if has_body_h1 and 'class="breadcrumb"' not in body:
        body = '<div class="band page-crumbs">%s</div>\n%s' % (shell.render_breadcrumb(ctx, crumbs), body)

    if errors:
        return None, errors, warnings

    m = {
        'title': title, 'title_full': title if slug == '/' else title + nav.site['title_suffix'], 'description': description,
        'template': template, 'eyebrow': fm.get('eyebrow'), 'og_image': fm.get('og_image'), 'og_alt': fm.get('og_alt'),
        'schema': schema, 'noindex': fm.get('noindex'), 'actions': fm.get('actions', page.get('actions', True)),
        'h1': fm.get('h1'), 'standfirst': fm.get('standfirst'), 'hero_image': fm.get('hero_image'), 'hero_alt': fm.get('hero_alt', ''),
        'hero_caption': fm.get('hero_caption'), 'hero_sizes': fm.get('hero_sizes'), 'hero_n': fm.get('hero_n'),
        'body_class': fm.get('body_class'), 'date': fm.get('date'), 'updated': fm.get('updated'), 'lastmod': fm.get('lastmod'),
        'breadcrumb_items': crumbs,
    }
    if fm.get('hero_image') and not fm.get('hero_alt') and 'hero_alt' not in fm:
        return None, [('hero_image needs hero_alt (alt text; hero_alt: "" only for decoration)', None)], warnings
    hero_html = ''
    if hero_needed:
        try:
            hero_html = shell.render_hero(ctx, m, page, shell.render_breadcrumb(ctx, crumbs))
        except media.MediaError as e:
            return None, [('hero_image: %s' % e, None)], warnings
    # <!-- CONFIRM: ... --> notes are for the coordinator and the school: they stay in the source and never reach the published HTML
    body, n_confirm = CONFIRM_RE.subn('', body)
    doc = shell.render_document(nav, ctx, page, m, body, hero_html, canonical=(root_override is None))
    built = Built(slug, doc, page, m, body)
    built.confirm = n_confirm
    return built, errors, warnings


# --------------------------------------------------------------------------- output helpers
def write_if_changed(path, content):
    """Atomic write; skip when identical. Returns 'new' | 'changed' | 'same'."""
    data = content.encode('utf-8')
    if os.path.isfile(path):
        with open(path, 'rb') as f:
            if f.read() == data:
                return 'same'
        status = 'changed'
    else:
        status = 'new'
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + '.tmp%d' % os.getpid()
    with open(tmp, 'wb') as f:
        f.write(data)
    for attempt in range(6):
        try:
            os.replace(tmp, path)
            break
        except PermissionError:
            time.sleep(0.15)
    else:
        os.replace(tmp, path)
    return status


def out_path(slug):
    return os.path.join(SITE, *[s for s in slug.strip('/').split('/') if s], 'index.html')


def is_draft_file(path):
    """True for a stub this script wrote for a page with no source yet (the marker is in the <head>, wherever the head ends)."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return htmlutil.is_draft_html(f.read())
    except OSError:
        return False


def normalise_selector(o):
    """'/admissions/faq/' | 'admissions\\faq' | 'about' -> 'admissions/faq' | 'about'."""
    return o.replace('\\', '/').strip().strip('/')


def selected(slug, only):
    if not only:
        return True
    s = slug.strip('/')
    for o in only:
        o = normalise_selector(o)
        if s == o or s.startswith(o + '/') or (o == '' and s == ''):
            return True
    return False


def check_selectors(nav, only):
    """Error text for a --only selector that cannot match a page (a typo, or Git Bash turning /about/ into a Windows
    path), or None. Without this, a mistyped selector builds nothing and still ends with exit code 0."""
    prefixes = sorted({p['slug'].strip('/').split('/')[0] for p in nav.pages if p['slug'] != '/' and p.get('source') != 'handbuilt'})
    for raw in only:
        o = raw.replace('\\', '/').strip()
        if re.match(r'^[A-Za-z]:/', o):
            return ('--only "%s": Git Bash rewrote the argument into a Windows path. Write the selector without a leading slash '
                    '(--only admissions/faq) or run with MSYS_NO_PATHCONV=1.' % raw)
        o = normalise_selector(raw)
        if not any(p['slug'].strip('/') == o or p['slug'].strip('/').startswith(o + '/') for p in nav.pages
                   if p['slug'] != '/' and p.get('source') != 'handbuilt') or not o:
            close = difflib.get_close_matches(o, [p['slug'].strip('/') for p in nav.pages], n=3, cutoff=0.5)
            return ('--only "%s": no page in nav.json starts with that path.%s Sections: %s'
                    % (raw, (' Did you mean %s?' % ' or '.join(close)) if close else '', ', '.join(prefixes)))
    return None


def page_text_summary(built):
    """(headings list, plain text) of the final body, for the search index."""
    c = htmlutil.collect(built.body)
    heads = []
    for lvl, hid, txt, line in c.headings:
        if txt and lvl in (2, 3) and txt not in heads:
            heads.append(txt)
    return heads


# --------------------------------------------------------------------------- shared outputs
def write_sitemap(nav, built_by_slug):
    urls = []
    for p in nav.pages:
        if p.get('sitemap') is False or p.get('noindex'):
            continue
        b = built_by_slug.get(p['slug'])
        if b is not None and (b.draft or b.m.get('noindex')):
            continue
        if p['slug'] == '/':
            src = os.path.join(SITE, 'index.html')
        else:
            src = out_path(p['slug'])
            if b is None and (not os.path.isfile(src) or is_draft_file(src)):
                continue
        # <lastmod> only when the page says so (front matter lastmod, updated or date, all validated as YYYY-MM-DD).
        # A file's modification time would change with every clone and every checkout, so it is never used.
        lastmod = ''
        if b is not None:
            lastmod = b.m.get('lastmod') or b.m.get('updated') or b.m.get('date') or ''
        urls.append('  <url><loc>%s</loc>%s</url>' % (shell.h(shell.SITE_URL + p['slug']), ('<lastmod>%s</lastmod>' % lastmod) if lastmod else ''))
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n%s\n</urlset>\n' % '\n'.join(urls)
    return write_if_changed(os.path.join(SITE, 'sitemap.xml'), xml), len(urls)


def write_robots():
    txt = ('User-agent: *\nAllow: /\n'
           'Disallow: /audit-report.html\nDisallow: /report-summary.html\nDisallow: /credits.html\n\n'
           'Sitemap: %s/sitemap.xml\n' % shell.SITE_URL)
    return write_if_changed(os.path.join(SITE, 'robots.txt'), txt)


def home_summary(nav):
    """Title, description and headings of the hand-built home, read (never written) from site/index.html."""
    path = os.path.join(SITE, 'index.html')
    with open(path, 'r', encoding='utf-8') as f:
        c = htmlutil.collect(f.read())
    heads = [t for lvl, hid, t, ln in c.headings if lvl in (2, 3) and t]
    return heads


def write_search_index(nav, built_by_slug):
    entries = []
    for p in nav.pages:
        if p.get('sitemap') is False or p.get('noindex'):
            continue
        b = built_by_slug.get(p['slug'])
        if p['slug'] == '/':
            heads = home_summary(nav)
            entries.append({'t': p['title'], 'u': '', 'd': p['description'], 'h': heads[:24], 'g': 'Home'})
            continue
        if b is None or b.draft or b.m.get('noindex'):
            continue
        g = nav.group_of(p)
        entries.append({'t': b.m['title'], 'u': p['slug'].strip('/') + '/', 'd': b.m['description'],
                        'h': page_text_summary(b)[:24], 'g': g['label'] if g else ''})
    data = json.dumps(entries, ensure_ascii=False, separators=(',', ':'))
    return write_if_changed(os.path.join(SITE, 'assets', 'search-index.json'), data + '\n'), len(entries)


def write_sitemap_json(nav):
    groups = []
    for g in nav.groups:
        kids = [{'title': k['title'], 'label': k['label'], 'url': k['slug'].strip('/') + '/', 'summary': k['summary']}
                for k in nav.menu_children(g['key'])]
        groups.append({'key': g['key'], 'label': g['label'], 'url': (g['hub'] or '').strip('/') + ('/' if g['hub'] else ''), 'pages': kids})
    other = [{'title': p['title'], 'label': p['label'], 'url': p['slug'].strip('/') + '/'} for p in nav.pages
             if not p.get('group') and p['slug'] not in ('/', '/404/')]
    data = json.dumps({'home': '', 'groups': groups, 'other': other}, ensure_ascii=False, indent=1)
    return write_if_changed(os.path.join(SITE, 'assets', 'sitemap.json'), data + '\n')


def write_vercel_json(nav):
    """vercel.json at the repo root: clean folder URLs, 301s from the old WordPress paths, cache and security headers."""
    redirects = []
    for old, new in nav.wordpress.items():
        redirects.append({'source': old, 'destination': new, 'permanent': True})
        redirects.append({'source': old.rstrip('/'), 'destination': new, 'permanent': True})
    redirects.append({'source': '/notice/:path*', 'destination': '/notices/', 'permanent': True})
    redirects.append({'source': '/event/:path*', 'destination': '/events/', 'permanent': True})
    # "immutable" only where a file never changes under its name (the vendored libraries and fonts). The photographs,
    # the brand files and the 3D crest keep their names when they are re-cropped or replaced, so they are re-checked daily.
    forever = [{'key': 'Cache-Control', 'value': 'public, max-age=31536000, immutable'}]
    daily = [{'key': 'Cache-Control', 'value': 'public, max-age=86400, must-revalidate'}]
    hour = [{'key': 'Cache-Control', 'value': 'public, max-age=3600, must-revalidate'}]
    headers = [{'source': '/vendor/(.*)', 'headers': forever}]
    headers += [{'source': '/%s/(.*)' % d, 'headers': daily} for d in ('assets/media', 'assets/img', 'assets/brand', 'assets/logo', 'assets/3d')]
    headers += [{'source': '/css/(.*)', 'headers': hour}, {'source': '/js/(.*)', 'headers': hour},
                {'source': '/assets/(search-index|sitemap).json', 'headers': hour},
                {'source': '/(.*)', 'headers': [
                    {'key': 'X-Content-Type-Options', 'value': 'nosniff'},
                    {'key': 'X-Frame-Options', 'value': 'SAMEORIGIN'},
                    {'key': 'Referrer-Policy', 'value': 'strict-origin-when-cross-origin'},
                    {'key': 'Permissions-Policy', 'value': 'geolocation=(), microphone=(), camera=()'}]}]
    data = {'$schema': 'https://openapi.vercel.sh/vercel.json', 'framework': None, 'buildCommand': None, 'installCommand': None,
            'outputDirectory': 'site', 'trailingSlash': True, 'redirects': redirects, 'headers': headers}
    return write_if_changed(os.path.join(REPO, 'vercel.json'), json.dumps(data, indent=2) + '\n')


# --------------------------------------------------------------------------- additions (one file per page group)
ADDITIONS_NOTE = ('GENERATED by build/build.py from build/additions/*.%s, in file-name order. Do not edit this file: '
                  'edit your own file in build/additions/ and run the build.')


def _css_problem(text):
    """A reason this stylesheet would damage the rules around it (an unclosed brace swallows everything after it), or None."""
    t = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
    if '/*' in t:
        return 'a /* comment is never closed'
    t = re.sub(r'"(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\'', '""', t)
    depth = 0
    for ch in t:
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth < 0:
                return 'a closing brace } has no opening brace'
    return 'a brace { is never closed' if depth else None


def build_additions(quiet=False):
    """Join build/additions/<group>.css and <group>.js into site/css/pages-additions.css and site/js/pages-additions.js.
    Each page group writes only its own two files, so six authors never edit the same file; one broken file is left out
    (with an error) instead of damaging the others. Returns the number of errors."""
    errors = 0
    node = shutil.which('node')
    parts = {'css': [], 'js': []}
    names = sorted(os.listdir(ADDITIONS_DIR)) if os.path.isdir(ADDITIONS_DIR) else []
    for name in names:
        ext = name.rsplit('.', 1)[-1].lower() if '.' in name else ''
        if name.startswith(('_', '.')) or name.lower() == 'readme.md':
            continue
        if ext not in parts:
            print('ERROR  build/additions/%s: only <group>.css and <group>.js belong here' % name)
            errors += 1
            continue
        path = os.path.join(ADDITIONS_DIR, name)
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read().replace('\r\n', '\n')
        if ext == 'css':
            problem = _css_problem(text)
            if problem:
                print('ERROR  build/additions/%s: %s; the file was left out of pages-additions.css' % (name, problem))
                errors += 1
                continue
            for mm in re.finditer(r'#[0-9a-fA-F]{3,8}\b', re.sub(r'/\*.*?\*/', '', text, flags=re.S)):
                print('warn   build/additions/%s: colour %s: use a token, var(--ink), var(--maroon), var(--gold) ...' % (name, mm.group(0)))
                break
            parts['css'].append('/* ---- additions/%s ---- */\n%s\n' % (name, text.strip('\n')))
        else:
            if node:
                try:
                    done = subprocess.run([node, '--check', path], capture_output=True, text=True, timeout=30)
                except (OSError, subprocess.SubprocessError):
                    done = None
                if done is not None and done.returncode != 0:
                    print('ERROR  build/additions/%s: JavaScript syntax error; the file was left out of pages-additions.js\n       %s'
                          % (name, '\n       '.join((done.stderr or '').strip().splitlines()[:4])))
                    errors += 1
                    continue
            parts['js'].append('/* ---- additions/%s ---- */\n(function () {\n  \'use strict\';\n  try {\n%s\n  } catch (e) {\n'
                               '    if (window.console) console.error(\'[additions/%s]\', e);\n  }\n})();\n' % (name, text.strip('\n'), name))
    css = '/* %s */\n%s' % (ADDITIONS_NOTE % 'css', '\n'.join(parts['css']))
    js = '/* %s */\n%s' % (ADDITIONS_NOTE % 'js', '\n'.join(parts['js']))
    write_if_changed(os.path.join(SITE, 'css', 'pages-additions.css'), css)
    write_if_changed(os.path.join(SITE, 'js', 'pages-additions.js'), js)
    if not quiet and (parts['css'] or parts['js']):
        print('additions: %d stylesheet(s) and %d script(s) joined' % (len(parts['css']), len(parts['js'])))
    return errors


# --------------------------------------------------------------------------- main
SOURCE_PATHS = {}


def main(argv=None):
    ap = argparse.ArgumentParser(description='Build the Playpen School site.')
    ap.add_argument('--only', action='append', default=[], metavar='PREFIX', help='build only pages under this slug prefix (repeatable)')
    ap.add_argument('--strict', action='store_true', help='fail when a page in nav.json has no source (final integration)')
    ap.add_argument('--list', action='store_true', help='list pages, sources and status, then exit')
    ap.add_argument('--kit', action='store_true', help='build the dev-only component kit at site/_kit/')
    ap.add_argument('--base', default=None, help='absolute base path for 404.html (default /)')
    ap.add_argument('--quiet', action='store_true')
    args = ap.parse_args(argv)
    if args.base:
        base = args.base.replace('\\', '/')
        if re.match(r'^[A-Za-z]:/', base):
            print('ERROR  --base "%s": Git Bash rewrote the argument into a Windows path. Run it as '
                  'MSYS_NO_PATHCONV=1 python build/build.py --base /PlaypenSchool/' % args.base)
            return 2
        if not base.endswith('/'):
            base += '/'
        if not re.fullmatch(r'/([A-Za-z0-9._~-]+/)*', base):
            print('ERROR  --base must be an absolute path of letters, digits and . _ ~ - such as /PlaypenSchool/, not "%s"' % args.base)
            return 2
        shell.BASE_PATH = base

    media.set_assets_dir(os.path.join(SITE, 'assets'))
    nav = shell.Nav.load(NAV_JSON)
    nav_errs, nav_warns = nav.validate()
    if nav_errs:
        print('nav.json has errors:')
        for e in nav_errs:
            print('  ERROR', e)
        return 1
    for w in nav_warns:
        print('  note', w)
    shell.SHELL_HASH = shell.shell_hash(NAV_JSON)
    sources, problems, source_warns = discover(nav)
    SOURCE_PATHS.update(sources)
    if args.only and not args.list:
        bad = check_selectors(nav, args.only)
        if bad:
            print('ERROR  ' + bad)
            return 1

    if args.list:
        for p in nav.pages:
            if p.get('source') == 'handbuilt':
                st = 'hand-built (site/index.html)'
            elif p['slug'] in sources:
                st = os.path.relpath(sources[p['slug']], REPO).replace(os.sep, '/')
            else:
                st = '(no source yet: draft stub)'
            print('%-4s %-38s %-4s %s' % (p['id'], p['slug'], p['template'], st))
        return 0

    t0 = time.time()
    errors_total, built_by_slug, rows = 0, {}, []
    for problem in problems:
        print('ERROR  %s' % problem)
        errors_total += 1
    for w in source_warns:
        print('warn   build/pages/%s' % w)
    errors_total += build_additions(args.quiet)

    def report(slug, errs, warns, src):
        nonlocal errors_total
        rel = os.path.relpath(src, REPO).replace(os.sep, '/') if src else slug
        for msg, line in errs:
            print('ERROR  %s%s: %s' % (rel, (':%d' % line) if line else '', msg))
            errors_total += 1
        for msg, line in warns:
            print('warn   %s%s: %s' % (rel, (':%d' % line) if line else '', msg))

    only = args.only
    for page in nav.pages:
        slug = page['slug']
        if page.get('source') == 'handbuilt' or not selected(slug, only):
            continue
        src = sources.get(slug)
        if src:
            built, errs, warns = build_page(nav, page, src)
            report(slug, errs, warns, src)
            if built:
                st = write_if_changed(out_path(slug), built.html)
                built_by_slug[slug] = built
                rows.append((slug, st, len(built.html)))
                if slug == '/404/':
                    ctx404 = shell.Ctx(nav, slug, root=shell.BASE_PATH)
                    b404, e2, w2 = build_page(nav, page, src, root_override=shell.BASE_PATH)
                    report(slug, e2, [], src)
                    if b404:
                        write_if_changed(os.path.join(SITE, '404.html'), b404.html)
        else:
            if args.strict:
                print('ERROR  %s: no source (build/pages/%s.html); strict mode needs every page in nav.json written' % (slug, slug.strip('/')))
                errors_total += 1
                continue
            target = out_path(slug)
            if os.path.isfile(target) and not is_draft_file(target):
                rows.append((slug, 'kept', os.path.getsize(target)))   # built earlier from a source that is gone: leave it alone
                continue
            m = {'title': page['title'], 'title_full': page['title'] + nav.site['title_suffix'], 'description': page['description'],
                 'template': page['template'], 'h1': shell.h(page['title']), 'standfirst': shell.h(page['summary']),
                 'breadcrumb_items': shell.breadcrumb_items(nav, page), 'noindex': True, 'schema': None}
            ctx = shell.Ctx(nav, slug)
            hero = shell.render_hero(ctx, m, page, shell.render_breadcrumb(ctx, m['breadcrumb_items']))
            doc = shell.render_document(nav, ctx, page, m, shell.render_draft_body(nav, ctx, page), hero, draft=True)
            st = write_if_changed(target, doc)
            built_by_slug[slug] = Built(slug, doc, page, m, '', draft=True)
            rows.append((slug, 'STUB', len(doc)))

    # redirect stubs, shared files: full builds only
    if not only:
        for old, r in nav.redirects.items():
            html = shell.render_redirect(nav, old, r['to'], r.get('hashes', {}))
            write_if_changed(os.path.join(SITE, old), html)
        sm, count = write_sitemap(nav, built_by_slug)
        write_robots()
        si, n_index = write_search_index(nav, built_by_slug)
        write_sitemap_json(nav)
        write_vercel_json(nav)
    if args.kit:
        errors_total += build_kit(nav)

    if not args.quiet:
        for slug, st, size in rows:
            print('  %-7s %-40s %6.1f KB' % (st, slug, size / 1024.0))
        stubs = sum(1 for r in rows if r[1] == 'STUB')
        print('%d page(s) written in %.2fs%s%s' % (len(rows), time.time() - t0,
                                                   ('; %d draft stub(s) for pages with no source yet' % stubs) if stubs else '',
                                                   '' if only else '; %d redirect stub(s), sitemap.xml (%d urls), robots.txt, search index (%d)' % (len(nav.redirects), count, n_index)))
        confirm = sum(b.confirm for b in built_by_slug.values())
        if confirm:
            print('%d <!-- CONFIRM --> note(s) in these sources, for the school to confirm (kept out of the published HTML; see docs/confirm/)' % confirm)
    if errors_total:
        print('\nBUILD FAILED: %d error(s). Pages with errors were not written.' % errors_total)
        return 1
    return 0


def build_kit(nav):
    """Build build/dev/kit.html (the component kit) to site/_kit/index.html. Dev only; gitignored."""
    src = os.path.join(DEV_DIR, 'kit.html')
    if not os.path.isfile(src):
        print('kit: build/dev/kit.html does not exist')
        return 0
    page = {'id': 'DEV', 'slug': '/_kit/', 'label': 'Component kit', 'title': 'Component kit', 'template': 'T05', 'parent': None,
            'group': None, 'menu': False, 'footer': None,
            'description': 'The inner-page components of The Playpen School site, rendered for review. Development only.',
            'summary': 'Development only.', 'noindex': True}
    nav.by_slug[page['slug']] = page
    built, errs, warns = build_page(nav, page, src, kit=True)
    count = 0
    for msg, line in errs:
        print('ERROR  build/dev/kit.html%s: %s' % ((':%d' % line) if line else '', msg))
        count += 1
    if built:
        write_if_changed(out_path('/_kit/'), built.html)
        print('kit written: site/_kit/index.html')
    return count


if __name__ == '__main__':
    sys.exit(main())
