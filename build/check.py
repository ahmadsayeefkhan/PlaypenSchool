#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verifier for the built site (Python 3 standard library only). Run it after every build:

    python build/check.py                 check every page in site/ (about 0.5 s)
    python build/check.py about learning  only files under site/about/ and site/learning/
    python build/check.py --strict        also fail on draft stubs, missing pages and warnings
    python build/check.py --weights       print the estimated weight of each page

A selector that matches no file is an error (never a silent "checked 0 files"). In Git Bash write it without
a leading slash (about/history), or Git Bash turns /about/ into a Windows path.

It crawls site/**/*.html and reports, with file and line:
  links     every internal href / src / srcset / poster resolves to a file; every #anchor exists in its target;
            outside links only to the addresses nav.json allows (the portal, payment, forms, Google Maps);
            nothing is loaded from another site; a link that opens a new tab says so
  document  exactly one H1 and a body with real content; a unique <title> and meta description; lang="en"; a skip
            link; one <main>; header, nav and footer landmarks; a canonical URL on the right host; valid JSON-LD;
            no duplicate ids; every aria-labelledby / aria-controls / for points at an id that exists; every class
            and data attribute is one the stylesheets and the script know (a typo is an error); the shell stamp
            (menu, footer, head) matches build/nav.json and build/shell.py
  content   no leftover "{{" tokens, no TODO / lorem / FIXME; no banned brand words, no exclamation marks, in the
            text, the alt texts, the titles and the meta tags; no typed phone number, hours or address that
            differs from nav.json; no age count; no inline script handlers; no double-escaped entities;
            no photograph flagged in docs/image-catalogue.md (unless the coordinator listed it in
            docs/consent-cleared.txt)
  access    images have alt (that says something), width and height; links and buttons have a name and no
            "click here"; target="_blank" has rel="noopener"; form fields have labels; <th> has scope; heading
            levels do not skip; iframes have a title
  files     sitemap.xml is well formed and lists every indexable page; the search index and robots.txt exist; no
            HTML file that nav.json does not know
Exit code 0 = clean, 1 = errors. Warnings do not fail unless --strict.
"""
import argparse
import difflib
import json
import os
import posixpath
import re
import sys
import time
import xml.etree.ElementTree as ET
from urllib.parse import unquote

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import htmlutil  # noqa: E402
import media     # noqa: E402
import shell     # noqa: E402

REPO = os.path.dirname(HERE)
SITE = os.path.join(REPO, 'site')

SKIP_FILES = {'audit-report.html', 'report-summary.html', 'credits.html'}   # Defined Solution's own pages; not the school's site
SKIP_DIRS = {'_kit', 'vendor', 'assets', 'css', 'js'}
BANNED = re.compile(r"\b(unleash\w*|synergy|leverag\w*|revolutionary|game-changing|cutting-edge|best-in-class|world-class|seamless(?:ly)?|robust|disrupt\w*|ninja|rockstar|guru|journey|passionate about)\b", re.I)
HYPE = re.compile(r"\b(best|finest|leading|premier|unparalleled|second to none|number one|top-ranked|state-of-the-art|amazing|incredible|excellence)\b", re.I)
TODO = re.compile(r"\b(TODO|FIXME|XXX|lorem|ipsum)\b", re.I)
SOFT_PLACEHOLDER = re.compile(r"\b(coming soon|tbd|to be announced soon)\b", re.I)
GENERIC_LINK = {'click here', 'here', 'read more', 'learn more', 'more', 'link', 'this link', 'click', 'more info', 'find out more'}
MAIN_BYTES_WARN = 2 * 1024 * 1024

# a Bangladeshi mobile number (01XXX XXX XXX, +880 1XXX ...) or the school's 9678 line, typed in the text
PHONE_RE = re.compile(r'(?<![\d.])(?:\+?880[\s-]?)?(?:0?1[3-9]\d{2}[\s-]?\d{3}[\s-]?\d{3}|9678[\s-]?\d{3}[\s-]?\d{3})(?![\d])')
HOURS_RE = re.compile(r'\b(\d{1,2})[.:](\d{2})\s*(am|pm)\s*(?:to|and|-|–)\s*(\d{1,2})[.:](\d{2})\s*(am|pm)\b', re.I)
ADDRESS_BIT = re.compile(r'\b(?:House|Road)\s+\d+[A-Za-z/]*|\bBlock\s*-?\s*[A-Z]\b')
YEARS_RE = re.compile(r'\b(?:[2-9]\d|\d{3})\s+years?\b', re.I)      # 20 and over: a child's age ("12 years") is not the school's
HOURS_CONTEXT = ('admission', 'call', 'phone', 'telephone', 'line', 'enquir', 'office')   # hours stated next to these words are the admissions hours
DOUBLE_ESCAPED = re.compile(r'&amp;(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);', re.I)
# the few pages that are thin on purpose (a search box, the not-found page) and the listing templates (they may be empty)
THIN_OK_FILES = {'search/index.html', '404/index.html', '404.html'}
THIN_OK_TEMPLATES = {'T08', 'T10'}
# classes that only the hand-built home defines (its Ascent scene). main.css gives them rules, which would hide or
# resize an inner page's block; the inner pages have their own names.
HOME_ONLY_CLASSES = {'chapter': 'story-chapter', 'sheet': 'page-section', 'ledger': 'page-section is-night'}
# data attributes the stylesheets and js/inner.js know; a near miss ("data-revael") is an error, a new name is not
DATA_VOCAB = {'data-reveal', 'data-reveal-group', 'data-accordion-scope', 'data-accordion', 'data-accordion-toggle',
              'data-filter-scope', 'data-filter', 'data-filter-key', 'data-filter-item', 'data-tags', 'data-gallery',
              'data-lightbox', 'data-caption', 'data-alt', 'data-prototype-form', 'data-search', 'data-index', 'data-label',
              'data-root', 'data-template', 'data-actions', 'data-hours', 'data-call', 'data-menu-preview', 'data-preview',
              'data-group', 'data-lenis-prevent', 'data-sample', 'data-motion'}
# classes with no rule of their own that are still right: structural names in the shell's markup and in the documented
# snippets (they carry meaning for a reader of the source, or a hook for the script), and the template classes tpl-t01 ...
ALLOW_CLASSES = {'toggle__label', 'sheet-rule__title', 'menu-btn__label', 'menu__main', 'link--ext', 'is-over-hero', 'foot__ds',
                 'foot__col', 'actions__call', 'cta-band__text', 'pager__link--prev'}
TEMPLATE_CLASS = re.compile(r'^tpl-t\d\d$')


class Report:
    def __init__(self):
        self.items = []     # (sev, rel, line, code, msg)

    def add(self, sev, rel, line, code, msg):
        self.items.append((sev, rel, line, code, msg))

    def count(self, sev):
        return sum(1 for i in self.items if i[0] == sev)


def list_files():
    files, htmls = set(), []
    for root, dirs, fs in os.walk(SITE):
        rel_root = os.path.relpath(root, SITE).replace(os.sep, '/')
        for f in fs:
            rel = f if rel_root == '.' else rel_root + '/' + f
            files.add(rel)
            if f.endswith('.html'):
                top = rel.split('/')[0]
                if top in SKIP_DIRS or rel in SKIP_FILES:
                    continue
                htmls.append(rel)
    return files, sorted(htmls)


def resolve(page_rel, url, files):
    """-> ('skip'|'external'|'bad'|'ok', target_rel|None, fragment)."""
    u = url.strip()
    if not u or u == '#':
        return 'skip', None, ''
    low = u.lower()
    if low.startswith(('mailto:', 'tel:', 'javascript:', 'data:', 'sms:', 'whatsapp:', 'blob:')):
        return 'skip', None, ''
    if low.startswith(('http://', 'https://', '//')):
        return 'external', None, ''
    path, _, frag = u.partition('#')
    path = path.split('?')[0]
    frag = unquote(frag)
    if not path:
        return 'ok', page_rel, frag
    path = unquote(path)
    if path.startswith('/'):
        target = posixpath.normpath(path.lstrip('/')) if path.strip('/') else ''
    else:
        base = posixpath.dirname(page_rel)
        target = posixpath.normpath(posixpath.join(base, path))
        if target.startswith('..'):
            return 'bad', None, frag
    if path.endswith('/') or target in ('', '.'):
        target = (target.rstrip('/') + '/index.html').lstrip('/') if target not in ('', '.') else 'index.html'
    if target in files:
        return 'ok', target, frag
    if (target + '/index.html') in files:
        return 'ok', target + '/index.html', frag
    return 'bad', None, frag


def srcset_urls(value):
    return htmlutil.split_srcset(value)


def blank_scripts(raw):
    """The page with <script> and <style> bodies replaced by empty lines (line numbers stay the same)."""
    return re.sub(r'<(script|style)\b[^>]*>.*?</\1>', lambda m: '\n' * m.group(0).count('\n'), raw, flags=re.S | re.I)


def line_of(raw, needle, flags=re.I):
    m = re.search(needle, raw, flags)
    return raw.count('\n', 0, m.start()) + 1 if m else None


def css_classes():
    """Every class name a stylesheet in site/css/ has a selector for."""
    out = set()
    for name in ('main.css', 'pages.css', 'pages-additions.css', 'preloader.css'):
        try:
            with open(os.path.join(SITE, 'css', name), 'r', encoding='utf-8') as f:
                text = f.read()
        except OSError:
            continue
        text = re.sub(r'/\*.*?\*/', '', text, flags=re.S)
        text = re.sub(r'url\([^)]*\)', '', text)
        text = re.sub(r'"[^"]*"|\'[^\']*\'', '""', text)
        out |= set(re.findall(r'\.(-?[_a-zA-Z][\w-]*)', text))
    return out


def digits_of(number):
    """Canonical digits of a Bangladeshi phone number: '+880 1755 689 482' and '01755 689 482' both give '01755689482'."""
    d = re.sub(r'\D', '', number)
    if d.startswith('880'):
        d = d[3:]
    return d if d.startswith('0') else '0' + d


def hours_of(match):
    h1, m1, a1, h2, m2, a2 = match.groups()
    return ('%d.%s %s' % (int(h1), m1, a1.lower()), '%d.%s %s' % (int(h2), m2, a2.lower()))


def estimate_weight(rel, c, files, size_of):
    total = size_of(rel)
    seen = set()
    for tag, attr, val, line, a, text in c.links:
        if not val:
            continue
        if tag in ('link', 'script') or (tag == 'img' and attr == 'src'):
            kind, target, _ = resolve(rel, val, files)
            if kind == 'ok' and target not in seen and not target.endswith('.html'):
                if tag == 'link' and a.get('rel') not in ('stylesheet', 'preload'):
                    continue
                if tag == 'link' and a.get('rel') == 'preload' and a.get('as') != 'font':
                    continue
                seen.add(target)
                total += size_of(target)
    return total


def main(argv=None):
    ap = argparse.ArgumentParser(description='Verify the built site.')
    ap.add_argument('only', nargs='*', help='check only files whose path starts with one of these (e.g. about learning/elementary)')
    ap.add_argument('--strict', action='store_true', help='draft stubs, missing pages and warnings fail the check')
    ap.add_argument('--weights', action='store_true', help='print the estimated weight of every page')
    ap.add_argument('--all', action='store_true', help="also check Defined Solution's own pages (audit-report, report-summary, credits)")
    args = ap.parse_args(argv)
    t0 = time.time()

    nav_path = os.path.join(HERE, 'nav.json')
    nav = shell.Nav.load(nav_path)
    media.set_assets_dir(os.path.join(SITE, 'assets'))
    files, htmls = list_files()
    if args.all:
        htmls = sorted(set(htmls) | {f for f in files if f in SKIP_FILES})
    if args.only:
        prefixes = []
        for o in args.only:
            norm = o.replace('\\', '/').strip()
            if re.match(r'^[A-Za-z]:/', norm):
                print('ERROR  "%s": Git Bash rewrote the argument into a Windows path. Write the selector without a leading slash '
                      '(about/history) or run with MSYS_NO_PATHCONV=1.' % o)
                return 2
            prefixes.append(norm.strip('/'))
        matched = [h for h in htmls if any(h == p or h.startswith(p + '/') or h == p + '/index.html' for p in prefixes)]
        for p in prefixes:
            if not any(h == p or h.startswith(p + '/') or h == p + '/index.html' for h in htmls):
                tops = sorted({h.split('/')[0] for h in htmls if '/' in h})
                close = difflib.get_close_matches(p, sorted(set(tops + [h[:-len('/index.html')] for h in htmls if h.endswith('/index.html')])), n=2, cutoff=0.5)
                print('ERROR  no built file matches "%s".%s Sections: %s' % (p, (' Did you mean %s?' % ' or '.join(close)) if close else '', ', '.join(tops)))
                return 1
        htmls = matched
    rep = Report()
    sizes = {}
    current_shell = shell.shell_hash(nav_path)
    class_ok = css_classes() | ALLOW_CLASSES

    def size_of(rel):
        if rel not in sizes:
            try:
                sizes[rel] = os.path.getsize(os.path.join(SITE, *rel.split('/')))
            except OSError:
                sizes[rel] = 0
        return sizes[rel]

    id_cache = {}
    tels = {p['tel'] for p in nav.site['phones']} | {n['tel'] for n in nav.site['further']['numbers']} | {nav.site['call_number']['tel']}
    allowed_numbers = {digits_of(t) for t in tels} | {digits_of(p['display']) for p in nav.site['phones']} \
        | {digits_of(n['display']) for n in nav.site['further']['numbers']} | {digits_of(nav.site['call_number']['display'])}
    nav_hours = None
    hm = HOURS_RE.search(nav.site['hours'])
    if hm:
        nav_hours = hours_of(hm)
    titles, descs = {}, {}
    weights = []

    def ids_of(rel):
        if rel not in id_cache:
            try:
                with open(os.path.join(SITE, *rel.split('/')), 'r', encoding='utf-8') as f:
                    id_cache[rel] = htmlutil.collect(f.read()).ids
            except OSError:
                id_cache[rel] = set()
        return id_cache[rel]

    drafts = 0
    for rel in htmls:
        path = os.path.join(SITE, *rel.split('/'))
        try:
            with open(path, 'r', encoding='utf-8') as f:
                raw = f.read()
        except UnicodeDecodeError:
            rep.add('ERROR', rel, None, 'file', 'not valid UTF-8')
            continue
        c = htmlutil.collect(raw)
        is_home = rel == 'index.html'
        is_redirect = c.meta.get('pp:kind') == 'redirect'
        is_draft = c.meta.get('pp:draft') == 'true'
        is_404 = rel == '404.html'
        template = c.body_attrs.get('data-template') or ''
        if is_draft:
            drafts += 1
            rep.add('ERROR' if args.strict else 'warn', rel, None, 'draft', 'draft stub: this page has no source in build/pages yet')

        # ---- document
        for problem in htmlutil.check_balance(raw)[:3]:
            mm = re.match(r'line (\d+): (.*)', problem)
            rep.add('ERROR', rel, int(mm.group(1)) if mm else None, 'markup', mm.group(2) if mm else problem)
        if c.html_lang != 'en':
            rep.add('ERROR', rel, 1, 'lang', '<html lang="en"> is missing')
        if c.h1 != 1:
            rep.add('ERROR', rel, line_of(raw, r'<h1\b'), 'h1', 'the page has %d <h1> elements; it needs exactly one' % c.h1)
        t = (c.title or '').strip()
        if not t:
            rep.add('ERROR', rel, None, 'title', 'missing <title>')
        elif t in titles:
            rep.add('ERROR', rel, None, 'title', 'duplicate <title> "%s" (also %s)' % (t, titles[t]))
        elif not is_404:                       # 404.html is the same page as 404/index.html with absolute URLs
            titles[t] = rel
        d = (c.meta.get('description') or '').strip()
        if not d:
            rep.add('ERROR', rel, None, 'description', 'missing meta description')
        else:
            if d in descs:
                rep.add('ERROR', rel, None, 'description', 'duplicate meta description (also %s)' % descs[d])
            elif not is_404:
                descs[d] = rel
            if not (shell.DESC_MIN <= len(d) <= shell.DESC_MAX) and not is_redirect:
                rep.add('warn', rel, None, 'description', 'meta description is %d characters (aim for %d to %d)' % (len(d), shell.DESC_MIN, shell.DESC_MAX))
        if not is_redirect:
            if 'main' not in c.landmarks or c.main_count != 1:
                rep.add('ERROR', rel, None, 'landmarks', 'the page needs exactly one <main> (found %d)' % c.main_count)
            for lm in ('header', 'nav', 'footer'):
                if lm not in c.landmarks:
                    rep.add('ERROR', rel, None, 'landmarks', 'missing <%s> landmark' % lm)
            if not c.has_skip:
                rep.add('ERROR', rel, None, 'skip', 'missing the "Skip to content" link (a.skip)')
            if 'viewport' not in c.meta:
                rep.add('ERROR', rel, None, 'viewport', 'missing <meta name="viewport">')
            noindex = 'noindex' in (c.meta.get('robots') or '')
            canon = next((a.get('href') for tag, attr, val, line, a, text in c.links if tag == 'link' and a.get('rel') == 'canonical'), None)
            if not is_404:
                expected = shell.SITE_URL + '/' + rel[:-len('index.html')] if rel.endswith('index.html') else None
                if not canon:
                    rep.add('ERROR', rel, None, 'canonical', 'missing <link rel="canonical">')
                elif expected and canon != expected:
                    rep.add('ERROR', rel, None, 'canonical', 'canonical is %s, expected %s' % (canon, expected))
                if not c.meta.get('og:url') or not c.meta.get('og:image', '').startswith('https://'):
                    rep.add('ERROR', rel, None, 'opengraph', 'og:url missing or og:image is not an absolute https URL')
            # a page with no content: an empty body, or only a paragraph, still passes every other rule
            if not (is_draft or is_home or rel in THIN_OK_FILES or template in THIN_OK_TEMPLATES):
                if c.main_sections < 1 or c.main_words < 80:
                    rep.add('ERROR', rel, None, 'empty', 'the page has almost no content (%d words, %d sections in <main>); '
                            'write the sections of its template (docs/COMPONENTS.md, section 5)' % (c.main_words, c.main_sections))
            # a page built before the last change to the menu, the footer or the head
            if not is_home:
                stamp = c.meta.get('pp:shell')
                if not stamp:
                    rep.add('ERROR', rel, None, 'stale-shell', 'no shell stamp: built before the stamp existed; run python build/build.py')
                elif stamp != current_shell:
                    rep.add('ERROR', rel, None, 'stale-shell', 'built with an older menu, footer or head (build/nav.json or build/shell.py changed since); run python build/build.py')
        for blob in c.ldjson:
            try:
                json.loads(blob)
            except ValueError as e:
                rep.add('ERROR', rel, None, 'jsonld', 'invalid JSON-LD: %s' % e)
        for hid, line in c.dup_ids:
            rep.add('ERROR', rel, line, 'id', 'duplicate id "%s"' % hid)
        for attr, ref, line in c.aria_refs:
            if ref not in c.ids:
                rep.add('ERROR', rel, line, 'aria-ref', '%s="%s" points at an id that does not exist on the page%s' % (
                    attr, ref, ' (an <h2> that names its section needs the id)' if attr == 'aria-labelledby' else ''))

        # ---- classes and data attributes (inner pages: a typo styles nothing and breaks no build)
        if not is_home and not is_redirect:
            for tok, line in sorted(c.classes.items(), key=lambda kv: kv[1]):
                if tok in HOME_ONLY_CLASSES:
                    rep.add('ERROR', rel, line, 'class', 'class "%s" belongs to the home\'s own scene (css/main.css gives it rules that hide or resize an inner block); use "%s"' % (tok, HOME_ONLY_CLASSES[tok]))
                elif tok not in class_ok and not TEMPLATE_CLASS.match(tok):
                    close = difflib.get_close_matches(tok, sorted(class_ok), n=1, cutoff=0.75)
                    rep.add('ERROR', rel, line, 'class', 'class "%s" has no rule in css/main.css, css/pages.css or css/pages-additions.css%s' % (
                        tok, ('; did you mean "%s"?' % close[0]) if close else ''))
            for name, line in sorted(c.data_attrs.items(), key=lambda kv: kv[1]):
                if name not in DATA_VOCAB:
                    close = difflib.get_close_matches(name, sorted(DATA_VOCAB), n=1, cutoff=0.85)
                    if close:
                        rep.add('ERROR', rel, line, 'data-attr', '%s is not an attribute the site uses; did you mean %s?' % (name, close[0]))

        # ---- headings
        prev = 0
        for lvl, hid, text, line in c.headings:
            if prev and lvl > prev + 1:
                rep.add('warn' if is_home else 'ERROR', rel, line, 'heading', 'heading level jumps from h%d to h%d ("%s")' % (prev, lvl, text[:40]))
            if not text and not is_redirect:
                rep.add('ERROR', rel, line, 'heading', 'empty <h%d>' % lvl)
            prev = lvl

        # ---- content
        for m in re.finditer(r'\{\{|\}\}', blank_scripts(raw)):
            rep.add('ERROR', rel, raw.count('\n', 0, m.start()) + 1, 'token', 'a "{{" or "}}" token is left in the page')
            break
        for m in re.finditer(r'<!--\s*(TODO|FIXME)', raw, re.I):
            rep.add('ERROR', rel, raw.count('\n', 0, m.start()) + 1, 'todo', 'a TODO comment is left in the page')
        for m in re.finditer(r'<!--\s*CONFIRM\b', raw):
            rep.add('ERROR', rel, raw.count('\n', 0, m.start()) + 1, 'confirm-comment', 'a <!-- CONFIRM --> note reached the published HTML; the build strips them: run python build/build.py')
            break
        if DOUBLE_ESCAPED.search(raw):
            rep.add('ERROR', rel, line_of(raw, DOUBLE_ESCAPED.pattern), 'double-escape', 'a double-escaped entity (&amp;amp; ...) is in the page: alt, title and description are plain text, write & not &amp;')
        text_all = htmlutil.text_of(raw)
        text_plain = htmlutil.text_of(raw, skip=('blockquote', 'cite', 'q'))
        for m in TODO.finditer(text_all):
            rep.add('ERROR', rel, line_of(raw, re.escape(m.group(0)), 0), 'todo', 'placeholder text "%s" on the page' % m.group(0))
            break
        for m in SOFT_PLACEHOLDER.finditer(text_all):
            if not is_draft:
                rep.add('warn', rel, line_of(raw, re.escape(m.group(0))), 'placeholder', '"%s" on the page' % m.group(0))
            break
        for m in BANNED.finditer(text_plain):
            rep.add('ERROR', rel, line_of(raw, r'\b' + re.escape(m.group(0)) + r'\b'), 'banned-word', 'banned word "%s" (brand rules, outside quotations)' % m.group(0))
        for m in HYPE.finditer(text_plain):
            rep.add('warn', rel, line_of(raw, r'\b' + re.escape(m.group(0)) + r'\b'), 'superlative', '"%s": the site makes no superlative claims' % m.group(0))
        if '!' in text_plain:
            i = text_plain.index('!')
            rep.add('ERROR', rel, line_of(raw, re.escape(text_plain[max(0, i - 12):i + 1])), 'exclamation', 'exclamation mark in the text ("...%s"): the site is calm' % text_plain[max(0, i - 25):i + 1])
        # the same voice rules for the words nobody sees on the page: alt texts, titles, aria-labels, the title and the meta tags
        hidden = [(attr, txt, line) for attr, txt, line, tag in c.attr_texts]
        hidden += [('<title>', c.title or '', None)]
        for key in ('description', 'og:title', 'og:description', 'og:image:alt', 'twitter:title', 'twitter:description'):
            if c.meta.get(key):
                hidden.append(('meta ' + key, c.meta[key], None))
        for what, txt, line in hidden:
            bw = BANNED.search(txt)
            if bw:
                rep.add('ERROR', rel, line, 'banned-word', 'banned word "%s" in %s ("%s")' % (bw.group(0), what, txt[:60]))
            if '!' in txt:
                rep.add('ERROR', rel, line, 'exclamation', 'exclamation mark in %s ("%s"): the site is calm' % (what, txt[:60]))
            hw = HYPE.search(txt)
            if hw:
                rep.add('warn', rel, line, 'superlative', '"%s" in %s: the site makes no superlative claims' % (hw.group(0), what))
        for attr, ln in c.handlers:
            rep.add('ERROR', rel, ln, 'handler', 'inline event handler %s=: behaviour comes from js/inner.js' % attr)
        # numbers, hours and the address are written once, in nav.json; a typed copy that differs is a wrong fact
        for m in PHONE_RE.finditer(text_all):
            if digits_of(m.group(0)) not in allowed_numbers:
                rep.add('ERROR', rel, line_of(raw, re.escape(m.group(0).strip())), 'phone', 'the number "%s" is not one of the school\'s numbers in nav.json: use {{phone:...}} or {{phones}}' % m.group(0).strip())
        if nav_hours:
            for m in HOURS_RE.finditer(text_all):
                if hours_of(m) == nav_hours:
                    continue
                # hours of another kind (a school-day timetable, a meeting) are the school's to state; hours written next to
                # "call", "phone", "line" or "admissions" are the admissions line's, and must be nav.json's
                around = text_all[max(0, m.start() - 110):m.end() + 110].lower()
                if any(w in around for w in HOURS_CONTEXT):
                    # on the home it is the dated sample notice (data-sample, listed in docs/confirm/foundation.md): a warning only
                    rep.add('warn' if is_home else 'ERROR', rel, line_of(raw, re.escape(m.group(0))), 'hours', 'the hours "%s" are written next to the admissions line but differ from nav.json (%s): use {{hours}} or {{hours:between}}' % (m.group(0), nav.site['hours']))
        addr_left = text_all.replace(nav.site['address_line'], '')
        am = ADDRESS_BIT.search(addr_left)
        if am:
            rep.add('ERROR', rel, line_of(raw, re.escape(am.group(0))), 'address', 'an address ("%s") that is not nav.json\'s: use {{address}}' % am.group(0))
        if not is_home:
            ym = YEARS_RE.search(text_plain)
            if ym:
                rep.add('warn', rel, line_of(raw, re.escape(ym.group(0))), 'age-count', '"%s": the site never prints the school\'s age or an age count' % ym.group(0))
            for m in re.finditer(r'1977', text_plain):
                if 'founded' not in text_plain[max(0, m.start() - 14):m.start()].lower():
                    rep.add('warn', rel, line_of(raw, '1977'), 'founding-year', '1977 outside the "Founded" cell: the founding year is stated only where the home states it, and is on the confirm list (docs/confirm/foundation.md)')
                    break

        # ---- links and assets
        flagged_frames, uncatalogued = {}, {}
        for tag, attr, val, line, a, text in c.links:
            if tag == 'form':
                if val and not val.startswith('#') and (a.get('method') or 'get').lower() != 'get':
                    rep.add('warn', rel, line, 'form', 'form action "%s": forms are prototypes and send nothing' % val)
                elif val and not val.startswith('#'):
                    kind, target, frag = resolve(rel, val, files)
                    if kind == 'bad':
                        rep.add('ERROR', rel, line, 'link', 'form action="%s" does not resolve to a file' % val)
                continue
            if not val and tag == 'a':
                if a.get('name') is None and not a.get('id'):
                    rep.add('ERROR', rel, line, 'link', '<a> without href')
                continue
            if not val:
                continue
            if tag == 'a' and val.strip().lower().startswith('javascript:'):
                rep.add('ERROR', rel, line, 'javascript-link', 'javascript: link; use a real address or a button')
            urls = srcset_urls(val) if attr == 'srcset' else [val]
            for u in urls:
                if u.lower().startswith('http://'):
                    rep.add('ERROR', rel, line, 'http', 'http:// URL "%s": use https://' % u)
                    continue
                if u.lower().startswith(('https://', '//')):
                    resource = tag in ('img', 'source', 'video', 'audio', 'embed', 'track', 'script') or (
                        tag == 'link' and (a.get('rel') or '') in ('stylesheet', 'preload', 'modulepreload', 'icon', 'apple-touch-icon', 'prefetch'))
                    if resource:
                        rep.add('ERROR', rel, line, 'hot-link', '%s loads "%s" from another site: every file is served from this site (site/assets/, site/vendor/)' % (tag, u[:80]))
                    elif tag == 'iframe' and not u.startswith('https://www.google.com/maps/'):
                        rep.add('ERROR', rel, line, 'hot-link', 'iframe from "%s": only the Google Maps embed is allowed' % u[:80])
                kind, target, frag = resolve(rel, u, files)
                if kind == 'bad':
                    rep.add('ERROR', rel, line, 'link', '%s %s="%s" does not resolve to a file' % (tag, attr, u))
                elif kind == 'ok':
                    if tag in ('img', 'source', 'a') and target.startswith('assets/') and re.search(r'\.(jpe?g|png|webp|avif)$', target, re.I):
                        why = media.consent_problem(target, home=is_home)
                        if why:
                            flagged_frames.setdefault(media.consent_key(target)[-1], (line, why))
                        elif not is_home and media.needs_catalogue_row(target):
                            uncatalogued.setdefault(media.consent_key(target)[-1], line)
                    if frag and tag == 'a' and target.endswith('.html'):
                        if frag not in ids_of(target) and frag not in ('top',):
                            rep.add('ERROR', rel, line, 'anchor', 'anchor #%s does not exist in %s' % (frag, target))
                elif kind == 'external' and tag == 'a':
                    low = u
                    if 'playpen.edu.bd' in low and 'portal.playpen.edu.bd' not in low:
                        ok = any(low.startswith(p) for p in nav.external_ok if p != 'https://playpen.edu.bd/') or low.rstrip('/') == 'https://playpen.edu.bd'
                        if not ok:
                            path = '/' + low.split('playpen.edu.bd/', 1)[-1].split('?')[0].split('#')[0]
                            local = nav.wordpress.get(path if path.endswith('/') else path + '/')
                            rep.add('ERROR' if local else 'warn', rel, line, 'old-site', 'link to the old site %s%s' % (
                                u, ('; this page now exists: use {{link:%s}}' % local) if local else ' (not on the external_ok list)'))
                    elif not shell.external_allowed(nav, u):
                        rep.add('ERROR', rel, line, 'external-link', 'a link to %s: the school\'s pages link only to its own resources (nav.json external_ok), the portal, Google Maps and the designer' % u[:80])
            if tag == 'a' and val.lower().startswith('tel:'):
                num = val[4:].replace(' ', '')
                if num not in tels:
                    rep.add('ERROR', rel, line, 'tel', 'tel:%s is not one of the school\'s numbers in nav.json' % num)
            if tag == 'a':
                if a.get('target') == '_blank' and 'noopener' not in (a.get('rel') or ''):
                    rep.add('ERROR', rel, line, 'noopener', 'target="_blank" without rel="noopener"')
                if a.get('target') == '_blank' and 'new tab' not in (text or '').lower():
                    rep.add('ERROR', rel, line, 'new-tab', 'a link that opens a new tab must say so (a hidden "(opens in a new tab)"): use {{ext href="..." label="..."}}')
                name = re.sub(r'\s+', ' ', (text or '')).strip()
                if not name:
                    name = (a.get('aria-label') or a.get('title') or '').strip()
                if not name:
                    rep.add('ERROR', rel, line, 'link-name', 'link without text or aria-label (href="%s")' % val)
                elif name.lower().rstrip('.') in GENERIC_LINK:
                    rep.add('ERROR', rel, line, 'link-text', 'link text "%s" says nothing out of context (href="%s")' % (name, val))
        # photographs that show identifiable children (docs/image-catalogue.md) need the school's written consent first
        og = c.meta.get('og:image', '')
        if og.startswith(shell.SITE_URL + '/assets/'):
            why = media.consent_problem(og[len(shell.SITE_URL) + 1:], home=is_home)
            if why:
                flagged_frames.setdefault(media.consent_key(og[len(shell.SITE_URL) + 1:])[-1], (None, why))
        for key, line in sorted(uncatalogued.items()):
            rep.add('ERROR', rel, line, 'uncatalogued', '%s is not in docs/image-catalogue.md: nobody has said whether it shows identifiable children. Add its row (what it shows, the people column); build/images.py --people ... does it for a new crop' % key)
        if flagged_frames:
            names = ', '.join(sorted(flagged_frames))
            if is_home:
                rep.add('warn', rel, None, 'consent', 'the home uses %d frame(s) the image catalogue marks as needing the school\'s consent: %s. '
                        'Decision for the coordinator: get the consent and list the stems in docs/consent-cleared.txt, or replace the frames' % (len(flagged_frames), names))
            else:
                for key, (line, why) in sorted(flagged_frames.items()):
                    rep.add('ERROR', rel, line, 'consent', '%s: %s (docs/image-catalogue.md). Use another frame; the coordinator lists cleared frames in docs/consent-cleared.txt' % (key, why))

        # ---- images, buttons, forms, tables
        if not is_redirect:
            for a, line in c.images:
                if 'alt' not in a:
                    rep.add('ERROR', rel, line, 'alt', '<img> without alt (src="%s")' % a.get('src'))
                else:
                    problem = htmlutil.alt_problem(a.get('alt'))
                    if problem:
                        rep.add('ERROR', rel, line, 'alt-quality', 'alt text "%s" %s' % ((a.get('alt') or '')[:50], problem))
                if not (a.get('width') and a.get('height')):
                    rep.add('ERROR', rel, line, 'img-size', '<img> without width and height (src="%s")' % a.get('src'))
            for a, line, text in c.buttons:
                if not (text or a.get('aria-label') or a.get('aria-labelledby') or a.get('title')):
                    rep.add('ERROR', rel, line, 'button-name', '<button> without text or aria-label')
            for a, line, inside in c.inputs:
                if inside or a.get('aria-label') or a.get('aria-labelledby') or (a.get('id') and a['id'] in c.labels_for):
                    continue
                rep.add('ERROR', rel, line, 'label', 'form field "%s" has no <label for>' % (a.get('name') or a.get('id') or a.get('type')))
            for line in c.th_without_scope:
                rep.add('ERROR', rel, line, 'th-scope', '<th> without scope="col" or scope="row"')
            for a, line in c.iframes:
                if not a.get('title'):
                    rep.add('ERROR', rel, line, 'iframe', '<iframe> without a title')
            w = estimate_weight(rel, c, files, size_of)
            weights.append((w, rel))
            if w > MAIN_BYTES_WARN and rel != 'index.html':
                rep.add('warn', rel, None, 'weight', 'estimated weight %.2f MB is over the 2 MB target for inner pages' % (w / 1048576.0))

    # ---- the Foundation's two files stay the Foundation's: groups add rules and behaviour in build/additions/
    for rel_file, marker, tail_re in (('css/pages.css', 'PAGES-ADDITIONS (retired)', r'\*/\s*$'), ('js/inner.js', 'Page groups do not add code here any more', r'\*/\s*\}\)\(\);\s*$')):
        try:
            with open(os.path.join(SITE, *rel_file.split('/')), 'r', encoding='utf-8') as fh:
                body_text = fh.read()
        except OSError:
            continue
        pos = body_text.rfind(marker)
        if pos < 0:
            rep.add('ERROR', rel_file, None, 'additions', 'the retired-additions marker is gone: groups write build/additions/<group>.css and .js (docs/COMPONENTS.md, section 10)')
        else:
            tail = body_text[pos:]
            if not re.search(tail_re, tail[tail.index('*/'):] if '*/' in tail else tail):
                rep.add('ERROR', rel_file, None, 'additions', 'something was appended after the retired-additions marker. Move it to build/additions/<group>.css (or .js); two agents editing this file lose each other\'s work')

    # ---- site-level files and pages
    if not args.only:
        known = {'index.html', '404.html'} | set(nav.redirects) | SKIP_FILES
        for p in nav.pages:
            if p.get('source') == 'handbuilt':
                continue
            out = 'index.html' if p['slug'] == '/' else p['slug'].strip('/') + '/index.html'
            known.add(out)
            if out not in files:
                rep.add('ERROR' if args.strict else 'warn', out, None, 'missing', 'page %s is in nav.json but was not built' % p['slug'])
        for rel in htmls:
            if rel not in known:
                rep.add('warn', rel, None, 'orphan', 'an HTML file that build/nav.json does not know (not a page, a redirect stub or the 404 page); delete it, or add the page to nav.json')
        for f in ('sitemap.xml', 'robots.txt', 'assets/search-index.json', '404.html', 'assets/sitemap.json', 'css/pages-additions.css', 'js/pages-additions.js'):
            if f not in files:
                rep.add('ERROR', f, None, 'missing', 'file is missing: run python build/build.py')
        if 'sitemap.xml' in files:
            with open(os.path.join(SITE, 'sitemap.xml'), 'r', encoding='utf-8') as fh:
                xml = fh.read()
            locs = set()
            try:
                root = ET.fromstring(xml.encode('utf-8'))
                ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
                for url in root.iter(ns + 'url'):
                    loc = url.find(ns + 'loc')
                    if loc is None or not (loc.text or '').startswith(shell.SITE_URL + '/'):
                        rep.add('ERROR', 'sitemap.xml', None, 'sitemap', 'a <url> without a <loc> on %s' % shell.SITE_URL)
                        continue
                    locs.add(loc.text)
                    lm = url.find(ns + 'lastmod')
                    if lm is not None and not re.fullmatch(r'\d{4}-\d{2}-\d{2}', (lm.text or '').strip()):
                        rep.add('ERROR', 'sitemap.xml', None, 'sitemap', '<lastmod> "%s" is not a date like 2026-10-11' % (lm.text or ''))
            except ET.ParseError as e:
                rep.add('ERROR', 'sitemap.xml', None, 'sitemap', 'not well-formed XML: %s' % e)
            for p in nav.pages:
                if p.get('noindex') or p.get('sitemap') is False:
                    continue
                out = 'index.html' if p['slug'] == '/' else p['slug'].strip('/') + '/index.html'
                is_draft_page = False
                if out in files and p['slug'] != '/':
                    with open(os.path.join(SITE, *out.split('/')), 'r', encoding='utf-8') as fh:
                        is_draft_page = htmlutil.is_draft_html(fh.read())
                if is_draft_page or out not in files:
                    continue
                if shell.SITE_URL + p['slug'] not in locs:
                    rep.add('ERROR', 'sitemap.xml', None, 'sitemap', '%s is not listed (run python build/build.py)' % p['slug'])
        for old in nav.redirects:
            if old not in files:
                rep.add('ERROR', old, None, 'redirect', 'redirect stub for the old page is missing: run python build/build.py')
        for dead in ('assets/css/main.css', 'assets/js/main.js'):
            if dead in files:
                rep.add('warn', dead, None, 'old-design', 'the old design file still exists; delete it once the new system is live')

    # ---- report
    by_file = {}
    for sev, rel, line, code, msg in rep.items:
        by_file.setdefault(rel, []).append((sev, line, code, msg))
    for rel in sorted(by_file):
        print(rel)
        for sev, line, code, msg in sorted(by_file[rel], key=lambda x: (x[0] != 'ERROR', x[1] or 0)):
            print('  %-5s %s[%s] %s' % (sev, ('line %d  ' % line) if line else '', code, msg))
    if args.weights:
        print('\nestimated page weights (html + css + js + fonts + fallback images):')
        for w, rel in sorted(weights, reverse=True):
            print('  %6.0f KB  %s' % (w / 1024.0, rel))
    errors = rep.count('ERROR') + (rep.count('warn') if args.strict else 0)
    print('\nchecked %d file(s) in %.2fs: %d error(s), %d warning(s)%s' % (
        len(htmls), time.time() - t0, rep.count('ERROR'), rep.count('warn'), (', %d draft stub(s)' % drafts) if drafts else ''))
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
