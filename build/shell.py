# -*- coding: utf-8 -*-
"""The shared page shell of The Playpen School site (Python 3 standard library only).

Everything that is the same on every page lives here, so a change is one edit:
document head (meta, canonical, Open Graph, Twitter, icons, preloads, JSON-LD), skip link, header, the
full-screen menu, breadcrumb, page hero, footer, sticky actions and the scripts. The look comes from
site/css/main.css (the home's tokens and chrome) and site/css/pages.css (the inner-page components); the
behaviour from site/js/inner.js.

What exists, what it is called and how it is linked is defined once, in build/nav.json. Page content
comes from build/pages/*.html and is wrapped by build.py through render_document().

The home page (site/index.html) is hand-built and is never written by the build; build/sync_home.py
copies this shell's menu, primary links, footer and SEO head into marked regions of it, using the same
render functions, so the two cannot drift.
"""
import hashlib
import json
import os
import re
from html import escape as esc
from html import unescape

import media  # hero images; build.py sets the assets dir (modules sit side by side in build/)

# --------------------------------------------------------------------------- constants
SITE_URL = 'https://playpen-school.vercel.app'     # canonical host: no trailing slash
BASE_PATH = '/'                                     # only the absolute-URL 404.html uses it (build.py --base)
DESC_MIN, DESC_MAX = 60, 170                        # meta description length, in characters (nav.json, build.py and check.py agree)
NEW_TAB = '<span class="visually-hidden"> (opens in a new tab)</span>'
SHELL_HASH = ''                                     # set by build.py: stamps every page so check.py can see a stale shell
DEFAULT_OG_IMAGE = 'media/og-1200x630.jpg'          # under site/assets/
DEFAULT_OG_SIZE = (1200, 630)
DEFAULT_OG_ALT = ('The rooftop terrace of The Playpen School, three young trees in planters against a '
                  'paper-white sky, with the page title set above.')
THEME_COLOR = '#F5F1EA'
PRELOAD_FONTS = ('vendor/fonts/newsreader-var.woff2', 'vendor/fonts/hanken-grotesk-var.woff2')

ALLOWED_FRONT_MATTER = {
    'title', 'description', 'template', 'eyebrow', 'breadcrumb', 'og_image', 'og_alt', 'schema', 'noindex',
    'h1', 'standfirst', 'hero_image', 'hero_alt', 'hero_caption', 'hero_sizes', 'hero_n', 'actions', 'body_class',
    'date', 'updated', 'lastmod',
}


# --------------------------------------------------------------------------- helpers
def h(value):
    """HTML-escape text for element content and attribute values."""
    return esc('' if value is None else str(value), quote=True)


def hp(value):
    """Escape plain text that an author may have written with entities ("Tom &amp; Jerry"): decode first, so it is
    escaped exactly once."""
    return h(unescape('' if value is None else str(value)))


def shell_hash(nav_path):
    """Short hash of nav.json and shell.py (line endings normalised). Every built page carries it in
    <meta name="pp:shell">; check.py recomputes it, so a page built before the last change to the menu, the
    footer or the head is reported as stale."""
    digest = hashlib.sha1()
    for path in (nav_path, os.path.abspath(__file__)):
        with open(path, 'rb') as f:
            digest.update(f.read().replace(b'\r\n', b'\n'))
    return digest.hexdigest()[:12]


def split_target(target):
    """'/about/#x' -> ('/about/', 'x'); '/' -> ('/', '')."""
    slug, _, frag = target.partition('#')
    return (slug or '/'), frag


def depth(slug):
    return len([s for s in slug.strip('/').split('/') if s])


def root_prefix(slug):
    d = depth(slug)
    return './' if d == 0 else '../' * d


# --------------------------------------------------------------------------- navigation model
class NavError(Exception):
    pass


class Nav:
    def __init__(self, data):
        self.data = data
        self.site = data['site']
        self.pages = data['pages']
        self.groups = data['groups']
        self.footer = data['footer']
        self.utility = data['utility']
        self.sticky = data['sticky_actions']
        self.templates = data['templates']
        self.redirects = {k: v for k, v in data['redirects'].items() if not k.startswith('_')}
        self.wordpress = {k: v for k, v in data.get('wordpress', {}).items() if not k.startswith('_')}
        self.external_ok = data.get('external_ok', [])
        self.by_slug = {p['slug']: p for p in self.pages}
        self.group_by_key = {g['key']: g for g in self.groups}

    @classmethod
    def load(cls, path):
        with open(path, 'r', encoding='utf-8') as f:
            return cls(json.load(f))

    # ---- lookups
    def page(self, slug):
        return self.by_slug.get(slug)

    def group_of(self, page):
        return self.group_by_key.get(page.get('group')) if page.get('group') else None

    def menu_children(self, group_key):
        return [p for p in self.pages if p.get('group') == group_key and p.get('menu')]

    def children_of(self, parent_slug):
        return [p for p in self.pages if p.get('parent') == parent_slug]

    def trail(self, slug):
        out, p, seen = [], self.by_slug.get(slug), set()
        while p and p['slug'] not in seen:
            seen.add(p['slug'])
            out.append(p)
            p = self.by_slug.get(p['parent']) if p.get('parent') else None
        out.reverse()
        return out

    def footer_links(self, col_key):
        return [p for p in self.pages if p.get('footer') == col_key]

    def sheet_info(self, page):
        """(group label, n, total) for the 'Page 02 of 06' eyebrow, or (label, None, None)."""
        g = self.group_of(page)
        if not g:
            return None
        items = []
        if g['hub']:
            items.append(g['hub'])
        items += [p['slug'] for p in self.menu_children(g['key'])]
        if page['slug'] not in items:
            return (g['label'], None, None)
        if g['hub']:
            n, total = items.index(page['slug']), len(items) - 1
        else:
            n, total = items.index(page['slug']) + 1, len(items)
        if total < 1:
            return (g['label'], None, None)
        return (g['label'], n, total)

    # ---- validation
    def validate(self):
        errs, warns = [], []
        slug_re = re.compile(r'^/([a-z0-9-]+/)*$')
        ids, seen = set(), set()
        for p in self.pages:
            s = p.get('slug', '')
            if not slug_re.match(s):
                errs.append('bad slug %r (lower case, leading and trailing slash)' % s)
            if s in seen:
                errs.append('duplicate slug %s' % s)
            seen.add(s)
            if p.get('id') in ids:
                errs.append('duplicate id %s' % p.get('id'))
            ids.add(p.get('id'))
            for k in ('id', 'label', 'title', 'template', 'description', 'summary'):
                if not p.get(k):
                    errs.append('%s: missing "%s"' % (s, k))
            if p.get('template') not in self.templates:
                errs.append('%s: unknown template %r' % (s, p.get('template')))
            if p.get('parent') and p['parent'] not in self.by_slug:
                errs.append('%s: parent %s is not a page' % (s, p['parent']))
            if p.get('group') and p['group'] not in self.group_by_key:
                errs.append('%s: unknown group %r' % (s, p['group']))
            if p.get('footer') and p['footer'] not in {c['key'] for c in self.footer['columns']}:
                errs.append('%s: unknown footer column %r' % (s, p['footer']))
            d = p.get('description', '')
            if d and not (DESC_MIN <= len(d) <= DESC_MAX):
                warns.append('%s: description is %d characters (aim for %d to %d)' % (s, len(d), DESC_MIN, DESC_MAX))
        if '/' not in self.by_slug:
            errs.append('the home page "/" is missing')
        for g in self.groups:
            for k in ('hub', 'landing'):
                if g.get(k) and g[k] not in self.by_slug:
                    errs.append('group %s: %s %s is not a page' % (g['key'], k, g[k]))
        for k in ('always', 'legal', 'current_parents'):
            for s in self.footer.get(k, []):
                if s not in self.by_slug:
                    errs.append('footer.%s: %s is not a page' % (k, s))
        for it in self.utility + self.sticky:
            if it.get('slug') and it['slug'] not in self.by_slug:
                errs.append('utility/sticky item %s: %s is not a page' % (it['label'], it['slug']))
        for old, r in self.redirects.items():
            for target in [r['to']] + list(r.get('hashes', {}).values()):
                if target not in self.by_slug:
                    errs.append('redirect %s: target %s is not a page' % (old, target))
        for old, target in self.wordpress.items():
            if target not in self.by_slug:
                errs.append('wordpress %s: target %s is not a page' % (old, target))
        # parent cycles
        for p in self.pages:
            seen_p, q = set(), p
            while q and q.get('parent'):
                if q['slug'] in seen_p:
                    errs.append('%s: parent cycle' % p['slug'])
                    break
                seen_p.add(q['slug'])
                q = self.by_slug.get(q['parent'])
        return errs, warns


# --------------------------------------------------------------------------- URL context
class Ctx:
    """URL helper for one output file. root is the relative prefix back to site/ ('../../'), or an
    absolute base ('/') for 404.html."""

    def __init__(self, nav, slug, root=None):
        self.nav = nav
        self.slug = slug
        self.root = root if root is not None else root_prefix(slug)

    def link(self, target):
        slug, frag = split_target(target)
        return self.root + slug.lstrip('/') + ('#' + frag if frag else '')

    def asset(self, rel):
        return self.root + 'assets/' + rel.lstrip('/')

    def file(self, rel):
        return self.root + rel.lstrip('/')

    def canonical(self, slug=None):
        return SITE_URL + (slug or self.slug)


# --------------------------------------------------------------------------- small renderers
def ext_link(label, href, cls='link link--ext'):
    """A link to an external resource of the school's own (portal, payment, forms): new tab, noopener,
    the quiet 'current site' tag that the home uses, and a hidden '(opens in a new tab)' for screen readers."""
    return ('<a class="%s" href="%s" target="_blank" rel="noopener">%s<span class="link__site">current site</span>%s</a>'
            % (cls, h(href), hp(label), NEW_TAB))


def external_allowed(nav, href):
    """True for the outside addresses a page may link to: the school's own resources (nav.json external_ok), the portal,
    Google Maps and the designer's site. Everything else is a mistake on a school website."""
    if href.startswith('https://www.google.com/maps/'):
        return True
    if href.startswith(nav.site['designer']['url']):
        return True
    return any(href.startswith(p) for p in nav.external_ok if p != 'https://playpen.edu.bd/') or href.rstrip('/') == 'https://playpen.edu.bd'


def phones_list(nav, kind='sections', cls='phones'):
    """The phone lines by section, exactly as on the home. kind: 'sections' (3 rows) or 'all' (adds further queries)."""
    rows = []
    for ph in nav.site['phones']:
        rows.append('<li class="phones__row"><span class="phones__who">%s</span><a href="tel:%s">%s</a></li>'
                    % (h(ph['who']), h(ph['tel']), h(ph['display'])))
    if kind == 'all':
        f = nav.site['further']
        nums = '<span class="foot__dot" aria-hidden="true">&middot;</span>'.join(
            '<a href="tel:%s">%s</a>' % (h(n['tel']), h(n['display'])) for n in f['numbers'])
        rows.append('<li class="phones__row"><span class="phones__who">%s</span><span class="phones__nums">%s</span></li>'
                    % (h(f['who']), nums))
    return '<ul class="%s">%s</ul>' % (cls, ''.join(rows))


def phone_link(nav, key, cls='link'):
    """One phone number as a tel: link, by key ('pg-1', 'ii-vi', 'vii-xii', 'further', 'call'). class="link" by default,
    so the number carries the house's gold underline wherever it stands (a bare <a> would not)."""
    if key in ('further', 'call'):
        n = nav.site['call_number'] if key == 'call' else nav.site['further']['numbers'][0]
        return '<a class="%s" href="tel:%s">%s</a>' % (h(cls), h(n['tel']), h(n['display']))
    for ph in nav.site['phones']:
        if ph['key'] == key:
            return '<a class="%s" href="tel:%s">%s</a>' % (h(cls), h(ph['tel']), h(ph['display']))
    raise KeyError(key)


def maps_link(nav, cls='link', label='Map'):
    return ('<a class="%s" href="%s" target="_blank" rel="noopener">%s<span class="visually-hidden"> (opens Google Maps in a new tab)</span></a>'
            % (h(cls), h(nav.site['maps_url']), hp(label)))


def breadcrumb_items(nav, page, override=None):
    """[(label, slug|None), ...] from Home to the page; the last item has no slug (current page)."""
    if override is not None:
        return override
    items = [('Home', '/')]
    for p in nav.trail(page['slug']):
        items.append((p['label'], p['slug']))
    items[-1] = (items[-1][0], None)
    return items


def render_breadcrumb(ctx, items):
    lis = []
    for i, (label, slug) in enumerate(items):
        if slug is None or i == len(items) - 1:
            lis.append('<li aria-current="page">%s</li>' % h(label))
        else:
            lis.append('<li><a href="%s">%s</a></li>' % (h(ctx.link(slug)), h(label)))
    return '<nav class="breadcrumb" aria-label="Breadcrumb"><ol>%s</ol></nav>' % ''.join(lis)


def eyebrow_text(nav, page):
    """('Page 02 of 06', 'Learning'): the page's place among the pages of its group. "Sheet" is kept for the numbered
    sections inside a page ({{no}}), as on the home. A hub is not counted among its own pages: it shows the group name only."""
    info = nav.sheet_info(page)
    if info is None:
        return None, page['label']
    label, n, total = info
    if not n:
        return None, label
    return 'Page %02d of %02d' % (n, total), label


# --------------------------------------------------------------------------- header, menu, footer, actions
def current_state(page, group):
    if page is None:
        return None
    if page['slug'] in (group.get('hub'), group.get('landing')):
        return 'page'
    if page.get('group') == group['key']:
        return 'true'
    return None


def render_primary_links(ctx, page=None):
    """The <a> items of the header's primary nav (also copied into the home by sync_home.py)."""
    out = []
    for g in ctx.nav.groups:
        cur = current_state(page, g)
        out.append('<a href="%s"%s>%s</a>' % (h(ctx.link(g['landing'])), (' aria-current="%s"' % cur) if cur else '', h(g['label'])))
    return '\n      '.join(out)


def render_header(ctx, page=None):
    nav = ctx.nav
    visit = next(a for a in nav.sticky if a.get('primary'))
    return '''<header id="top" class="nav is-over-hero">
  <div class="nav__bar">
    <a class="nav__brand" href="%(home)s" aria-label="The Playpen School, home">
      <span id="nav-mark" class="nav__mark"><img src="%(mark)s" width="1000" height="1039" alt=""></span>
      <span class="nav__word">The Playpen School</span>
    </a>
    <nav id="nav-primary" class="nav__primary" aria-label="Primary">
      %(links)s
    </nav>
    <div class="nav__right">
      <span class="magnet-area">
        <a id="nav-visit" class="btn btn--primary btn--small" href="%(visit)s"><span class="btn__label">%(visit_label)s</span></a>
      </span>
      <button id="menu-btn" class="menu-btn" type="button" aria-expanded="false" aria-controls="menu">
        <span class="menu-btn__label">Menu</span>
        <span class="menu-btn__icon" aria-hidden="true"><i></i><i></i></span>
      </button>
      <noscript><a class="menu-btn menu-btn--link" href="%(sitemap)s"><span class="menu-btn__label">Sitemap</span></a></noscript>
    </div>
  </div>
</header>''' % {
        'home': h(ctx.link('/')), 'mark': h(ctx.asset('brand/logo-mark.svg')),
        'links': render_primary_links(ctx, page), 'visit': h(ctx.link(visit['slug'])), 'visit_label': h(visit['label']),
        'sitemap': h(ctx.link('/sitemap/')),
    }


def _utility_html(ctx):
    out = []
    for it in ctx.nav.utility:
        if it.get('external'):
            out.append(ext_link(it['label'], it['href']))
        else:
            out.append('<a class="link" href="%s">%s</a>' % (h(ctx.link(it['slug'])), h(it['label'])))
    return '\n        '.join(out)


def render_menu(ctx, page=None):
    """The full-screen menu: top-level groups with a disclosure for their pages, a preview image per
    group (desktop), utility links, the three admissions actions, address and phone lines."""
    nav = ctx.nav
    items, previews = [], []
    for i, g in enumerate(nav.groups, 1):
        cur = current_state(page, g)
        kids = nav.menu_children(g['key'])
        row = ('<a class="menu__link" href="%s" data-menu-preview="%d"%s><span class="menu__i" aria-hidden="true">%02d</span>%s</a>'
               % (h(ctx.link(g['landing'])), i, (' aria-current="%s"' % cur) if cur else '', i, h(g['label'])))
        if kids:
            sub_id = 'menu-sub-' + g['key']
            row += ('<button class="menu__toggle" type="button" aria-expanded="false" aria-controls="%s">'
                    '<span class="visually-hidden">%s pages</span><span class="menu__toggle-icon" aria-hidden="true"></span></button>'
                    % (sub_id, h(g['label'])))
            sub = '<ul class="menu__sub" id="%s">%s</ul>' % (sub_id, ''.join(
                '<li><a href="%s"%s>%s</a></li>' % (
                    h(ctx.link(k['slug'])), ' aria-current="page"' if page and page['slug'] == k['slug'] else '', h(k['label']))
                for k in kids))
        else:
            sub = ''
        items.append('<li class="menu__item" data-group="%s"><div class="menu__row">%s</div>%s</li>' % (g['key'], row, sub))
        previews.append('<img class="menu__img%s" data-preview="%d" src="%s" width="960" height="600" alt="" loading="lazy" decoding="async">'
                        % (' is-current' if i == 1 else '', i, h(ctx.asset(g['preview']))))
    acts = []
    for a in nav.sticky:
        if a.get('primary'):
            acts.append('<a class="btn btn--primary btn--small" href="%s"><span class="btn__label">%s</span></a>' % (h(ctx.link(a['slug'])), h(a['label'])))
        else:
            acts.append('<a class="link" href="%s">%s</a>' % (h(ctx.link(a['slug'])), h(a['label'])))
    # role="dialog" without aria-modal: the Close control is the header's own Menu button, which sits outside this element,
    # and a modal dialog would hide it from a screen reader. The page behind is made inert by the script instead.
    return '''<div id="menu" class="menu" role="dialog" aria-label="Menu" hidden data-lenis-prevent>
  <div class="menu__panel">
    <div class="menu__main">
      <nav aria-label="All pages">
        <ol class="menu__list">
          %(items)s
        </ol>
      </nav>
    </div>
    <div class="menu__aside">
      <div class="menu__preview" aria-hidden="true">
        %(previews)s
      </div>
      <div class="menu__util">
        %(util)s
      </div>
      <div class="menu__actions">
        %(acts)s
      </div>
      <div class="menu__contact">
        <p>%(addr)s</p>
        %(phones)s
        <p class="caption">%(note)s</p>
      </div>
    </div>
  </div>
</div>''' % {
        'items': '\n          '.join(items), 'previews': '\n        '.join(previews), 'util': _utility_html(ctx),
        'acts': '\n        '.join(acts), 'addr': h(nav.site['address_line']), 'phones': phones_list(nav, 'sections'),
        'note': h(nav.site['external_note']),
    }


def render_footer(ctx):
    nav = ctx.nav
    cols = []
    for c in nav.footer['columns']:
        links = ''.join('<li><a class="link" href="%s">%s</a></li>' % (h(ctx.link(p['slug'])), h(p.get('footer_label') or p['label'])) for p in nav.footer_links(c['key']))
        head = h(c['heading'])
        cols.append('''<nav class="foot__links" aria-labelledby="foot-%(k)s">
        <h2 id="foot-%(k)s" class="label foot__h">%(head)s</h2>
        <ul>%(links)s</ul>
      </nav>''' % {'k': c['key'], 'head': head, 'links': links})
    f = nav.site['further']
    phone_rows = ''.join('<li><span class="phones__who">%s</span><a href="tel:%s">%s</a></li>' % (h(p['who']), h(p['tel']), h(p['display']))
                         for p in nav.site['phones'])
    nums = '<span class="foot__dot" aria-hidden="true">&middot;</span>'.join('<a href="tel:%s">%s</a>' % (h(n['tel']), h(n['display'])) for n in f['numbers'])
    phone_rows += '<li><span class="phones__who">%s</span><span class="foot__nums">%s</span></li>' % (h(f['who']), nums)
    util = []
    for it in nav.utility:
        if it.get('external'):
            util.append(ext_link(it['label'], it['href']))
    for s in nav.footer['current_parents']:
        p = nav.by_slug[s]
        util.append('<a class="link" href="%s">%s</a>' % (h(ctx.link(s)), h(p['label'])))
    legal = []
    for s in nav.footer['always'] + nav.footer['legal']:
        p = nav.by_slug[s]
        legal.append('<a class="link" href="%s">%s</a>' % (h(ctx.link(s)), h(p['label'])))
    d = nav.site['designer']
    return '''<footer id="contact" class="foot is-night">
  <div class="band">
    <div class="foot__top">
      <div class="foot__brand">
        <img class="foot__crest" src="%(crest)s" width="160" height="160" alt="" loading="lazy" decoding="async">
        <p class="foot__name">The Playpen School</p>
      </div>
      <address class="foot__address">
        <span>%(addr)s</span>
        %(map)s
      </address>
    </div>
    <div class="foot__grid">
      <div class="foot__col foot__col--phones">
        <h2 class="label foot__h">Telephone</h2>
        <ul class="foot__phones">%(phones)s</ul>
        <p class="foot__email">Email: see the <a class="link" href="%(contact)s">contact page</a></p>
      </div>
      %(cols)s
    </div>
    <div class="foot__util">
      <p class="label foot__h">For current parents</p>
      <ul>%(util)s</ul>
    </div>
    <div class="foot__bottom">
      <p class="foot__legal">%(legal)s</p>
      <p class="foot__ds caption">Website by <a class="link" href="%(durl)s" target="_blank" rel="noopener">%(dname)s%(newtab)s</a></p>
      <div class="foot__display">
        <button id="motion-toggle" class="toggle" type="button" aria-pressed="false">
          <span class="toggle__switch" aria-hidden="true"></span>
          <span class="toggle__label">Reduce motion</span>
        </button>
      </div>
    </div>
  </div>
</footer>''' % {
        'crest': h(ctx.asset('brand/logo-white-160.png')), 'addr': h(nav.site['address_line']), 'map': maps_link(nav),
        'phones': phone_rows, 'contact': h(ctx.link('/contact/')), 'cols': '\n      '.join(cols),
        'util': ''.join('<li>%s</li>' % u for u in util), 'legal': '<span class="foot__dot" aria-hidden="true">&middot;</span>'.join(legal),
        'durl': h(d['url']), 'dname': h(d['label']), 'newtab': NEW_TAB,
    }


def render_actions(ctx):
    """Phones only: the bottom bar. Same three targets as the home (visit, enquire, call)."""
    nav = ctx.nav
    primary = next(a for a in nav.sticky if a.get('primary'))
    others = [a for a in nav.sticky if not a.get('primary')]
    enquire = others[0]
    call = nav.site['call_number']
    # the bar is the landmark (a labelled <nav>); the wrapper only carries the id and the visible state
    return '''<div id="actions" class="actions">
  <nav class="actions__bar" aria-label="Admissions shortcuts">
    <a class="actions__item actions__item--primary" href="%s">%s</a>
    <a class="actions__item" href="%s">%s</a>
    <a class="actions__item actions__call" href="tel:%s">Call<span class="visually-hidden"> the school, %s</span></a>
  </nav>
</div>''' % (h(ctx.link(primary['slug'])), h(primary['label']), h(ctx.link(enquire['slug'])), h(enquire['label']),
             h(call['tel']), h(call['display']))


# --------------------------------------------------------------------------- hero, cards, cta, sitemap (also token targets)
def render_hero(ctx, m, page, crumbs):
    """The type-led page hero: breadcrumb, sheet rule with the eyebrow, H1, standfirst, optional plate."""
    nav = ctx.nav
    sheet, label = eyebrow_text(nav, page)
    if m.get('eyebrow'):
        sheet, label = None, m['eyebrow']
    rule = ['<i class="sheet-rule__line" aria-hidden="true"></i>']
    if sheet:
        rule.append('<span class="sheet-rule__n">%s</span>' % h(sheet))
    rule.append('<span class="sheet-rule__title">%s</span>' % h(label))
    figure = ''
    if m.get('hero_image'):
        img = media.render_img(m['hero_image'], m.get('hero_alt', ''), ctx.asset(''), sizes=m.get('hero_sizes') or '100vw',
                               loading='eager', fetchpriority='high')
        cap = ''
        if m.get('hero_caption'):
            n = '<span class="plate__n">%s</span>' % h(m['hero_n']) if m.get('hero_n') else ''
            cap = '<figcaption class="plate__cap">%s%s</figcaption>' % (n, m['hero_caption'])
        figure = '<figure class="plate plate--bleed page-hero__plate"><div class="plate__frame">%s</div>%s</figure>' % (img, cap)
    return '''<header class="page-hero">
  <div class="band">
    %(crumbs)s
    <div class="sheet-rule page-hero__rule">%(rule)s</div>
    <h1 class="page-hero__title">%(h1)s</h1>%(lead)s
  </div>
  %(figure)s
</header>''' % {
        'crumbs': crumbs, 'rule': ''.join(rule), 'h1': m['h1'],
        'lead': ('\n    <p class="page-hero__lead lead">%s</p>' % m['standfirst']) if m.get('standfirst') else '',
        'figure': figure,
    }


def render_children(ctx, parent=None, group=None, template=None, not_template=None, level=3, start=1):
    """Chapter cards for the children of a page (url tree) or the menu children of a group.
    Each card is one link (the heading's own link, stretched over the card by CSS)."""
    nav = ctx.nav
    pages = nav.menu_children(group) if group else nav.children_of(parent)
    if template:
        pages = [p for p in pages if p['template'] == template]
    if not_template:
        pages = [p for p in pages if p['template'] != not_template]
    card = ('<li class="chapter-card" data-reveal>\n'
            '        <span class="chapter-card__n">%02d</span>\n'
            '        <h%d class="chapter-card__title"><a class="chapter-card__link" href="%s">%s</a></h%d>\n'
            '        <p class="chapter-card__text">%s</p>\n'
            '        <span class="chapter-card__go" aria-hidden="true"></span>\n'
            '      </li>')
    lis = [card % (i, level, h(ctx.link(p['slug'])), h(p['label']), level, h(p['summary']))
           for i, p in enumerate(pages, start)]
    return '<ul class="chapter-cards">\n      ' + '\n      '.join(lis) + '\n    </ul>'


def render_cta(ctx, heading='Come and see the school.', text=None):
    nav = ctx.nav
    primary = next(a for a in nav.sticky if a.get('primary'))
    enquire = [a for a in nav.sticky if not a.get('primary')][0]
    apply_ = [a for a in nav.sticky if not a.get('primary')][1]
    text = text or ("Call the admissions line for your child's section %s, or book a visit." % nav.site['hours_between'])
    # a light sheet like the home's "Visit, enquire, apply": the footer is the only dark block at the end of a page
    return '''<section class="cta-band" aria-labelledby="cta-title">
  <div class="band cta-band__inner">
    <div class="cta-band__text">
      <p class="label">Admissions</p>
      <h2 id="cta-title" class="cta-band__title">%s</h2>
      <p class="cta-band__lead">%s</p>
    </div>
    <div class="cta-band__actions">
      <a class="btn btn--primary" href="%s"><span class="btn__label">%s</span></a>
      <a class="btn btn--secondary" href="%s">%s</a>
      <a class="btn btn--text" href="%s">%s</a>
    </div>
  </div>
</section>''' % (hp(heading), hp(text), h(ctx.link(primary['slug'])), h(primary['label']), h(ctx.link(enquire['slug'])),
                 h(enquire['label']), h(ctx.link(apply_['slug'])), 'How to apply' if apply_['slug'].endswith('how-to-apply/') else h(apply_['label']))


def render_sitemap(ctx):
    """The human sitemap as nested lists (the {{sitemap}} token)."""
    nav = ctx.nav
    parts = ['<ul class="sitemap-list"><li><a class="link" href="%s">Home</a></li></ul>' % h(ctx.link('/'))]
    for g in nav.groups:
        kids = nav.menu_children(g['key'])
        head = ('<a class="link" href="%s">%s</a>' % (h(ctx.link(g['hub'])), h(g['label']))) if g['hub'] else h(g['label'])
        inner = ''.join('<li><a class="link" href="%s">%s</a><span class="sitemap-list__note">%s</span></li>'
                        % (h(ctx.link(k['slug'])), h(k['title']), h(k['summary'])) for k in kids)
        parts.append('<section class="sitemap-group"><h2 class="sitemap-group__title">%s</h2>%s</section>'
                     % (head, ('<ul class="sitemap-list">%s</ul>' % inner) if inner else ''))
    other = [p for p in nav.pages if not p.get('group') and p['slug'] not in ('/', '/404/')]
    if other:
        parts.append('<section class="sitemap-group"><h2 class="sitemap-group__title">Site information</h2><ul class="sitemap-list">%s</ul></section>'
                     % ''.join('<li><a class="link" href="%s">%s</a></li>' % (h(ctx.link(p['slug'])), h(p['title'])) for p in other))
    return '\n'.join(parts)


# --------------------------------------------------------------------------- structured data
def ld_json(data):
    """JSON for a <script type="application/ld+json"> block. '<' is written as \\u003c (still valid JSON), so no text
    inside a string can ever close the script element."""
    return json.dumps(data, ensure_ascii=False, indent=2).replace('<', '\\u003c').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')


def school_node(nav, ctx_root=SITE_URL):
    a = nav.site['address']
    return {
        '@type': ['School', 'EducationalOrganization'],
        '@id': SITE_URL + '/#school',
        'name': nav.site['name'],
        'alternateName': 'Playpen School',
        'url': SITE_URL + '/',
        'logo': SITE_URL + '/assets/brand/logo-1024.png',
        'image': SITE_URL + '/' + DEFAULT_OG_IMAGE.replace('media/', 'assets/media/'),
        'description': nav.by_slug['/']['description'],
        'foundingDate': '1977',
        'address': {'@type': 'PostalAddress', 'streetAddress': a['street'], 'addressLocality': a['city'],
                    'postalCode': a['postcode'], 'addressCountry': a['country']},
        'geo': {'@type': 'GeoCoordinates', 'latitude': round(nav.site['geo']['lat'], 6), 'longitude': round(nav.site['geo']['lng'], 6)},
        'telephone': nav.site['call_number']['tel'],
        'contactPoint': [{'@type': 'ContactPoint', 'contactType': 'admissions', 'telephone': ph['tel'], 'name': ph['who'],
                          'areaServed': 'BD'} for ph in nav.site['phones']],
    }


def website_node():
    return {'@type': 'WebSite', '@id': SITE_URL + '/#website', 'url': SITE_URL + '/', 'name': 'The Playpen School',
            'inLanguage': 'en', 'publisher': {'@id': SITE_URL + '/#school'}}


def home_jsonld(nav):
    """JSON-LD for the home page: the School, the WebSite and the home WebPage."""
    home = nav.by_slug['/']
    page = {'@type': 'WebPage', '@id': SITE_URL + '/#webpage', 'url': SITE_URL + '/', 'name': home['title'],
            'description': home['description'], 'inLanguage': 'en', 'isPartOf': {'@id': SITE_URL + '/#website'},
            'about': {'@id': SITE_URL + '/#school'},
            'primaryImageOfPage': {'@type': 'ImageObject', 'url': SITE_URL + '/assets/' + DEFAULT_OG_IMAGE,
                                   'width': DEFAULT_OG_SIZE[0], 'height': DEFAULT_OG_SIZE[1]}}
    return ld_json({'@context': 'https://schema.org', '@graph': [school_node(nav), website_node(), page]})


def faq_items(body_html):
    """[(question, answer text)] from <details class="accordion__item"> in a body (for FAQPage JSON-LD)."""
    from htmlutil import text_of
    out = []
    for m in re.finditer(r'<details\b[^>]*>\s*<summary\b[^>]*>(.*?)</summary>(.*?)</details>', body_html, re.S | re.I):
        q = text_of(m.group(1))
        a = text_of(m.group(2))
        if q and a:
            out.append((q, a))
    return out


def jsonld_for(ctx, nav, page, m, body_html, crumb_items):
    canon = ctx.canonical()
    graph = []
    kind = m.get('schema') or page.get('schema') or 'webpage'
    page_type = {'about': 'AboutPage', 'contact': 'ContactPage', 'collection': 'CollectionPage', 'faq': 'FAQPage',
                 'article': 'Article', 'school': 'WebPage', 'webpage': 'WebPage'}.get(kind, 'WebPage')
    node = {'@type': page_type, '@id': canon + '#webpage', 'url': canon, 'name': m['title_full'], 'description': m['description'],
            'inLanguage': 'en', 'isPartOf': {'@id': SITE_URL + '/#website'}}
    if kind in ('school', 'about', 'contact'):
        node['about'] = {'@id': SITE_URL + '/#school'}
        graph.append(school_node(nav))
        graph.append(website_node())
    if kind == 'faq':
        qa = faq_items(body_html)
        if qa:
            node['mainEntity'] = [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in qa]
    if kind == 'article':
        if m.get('date'):
            node['datePublished'] = m['date']
        if m.get('updated'):
            node['dateModified'] = m['updated']
        node['headline'] = m['title']
    graph.append(node)
    if crumb_items and len(crumb_items) > 1:
        lst = []
        for i, (label, slug) in enumerate(crumb_items, 1):
            item = {'@type': 'ListItem', 'position': i, 'name': label}
            url = SITE_URL + (slug if slug else page['slug'])
            item['item'] = url
            lst.append(item)
        graph.append({'@type': 'BreadcrumbList', '@id': canon + '#breadcrumb', 'itemListElement': lst})
    return ld_json({'@context': 'https://schema.org', '@graph': graph})


# --------------------------------------------------------------------------- head and document
def render_seo_head(ctx, title_full, description, og_image, og_size=None, og_alt=None, og_type='website',
                    noindex=False, canonical=True, extra='', with_title=True):
    """Title, description, canonical, robots, Open Graph and Twitter tags (also written into the home by sync_home.py,
    which keeps its own <title> and passes with_title=False)."""
    canon = ctx.canonical()
    img_abs = SITE_URL + '/assets/' + og_image
    lines = ['<title>%s</title>' % h(title_full)] if with_title else []
    lines.append('<meta name="description" content="%s">' % h(description))
    if noindex:
        lines.append('<meta name="robots" content="noindex, follow">')
    if canonical:
        lines.append('<link rel="canonical" href="%s">' % h(canon))
    lines += [
        '<meta name="theme-color" content="%s">' % THEME_COLOR,
        '<meta property="og:site_name" content="The Playpen School">',
        '<meta property="og:type" content="%s">' % h(og_type),
        '<meta property="og:title" content="%s">' % h(title_full),
        '<meta property="og:description" content="%s">' % h(description),
    ]
    if canonical:
        lines.append('<meta property="og:url" content="%s">' % h(canon))
    lines.append('<meta property="og:image" content="%s">' % h(img_abs))
    if og_size:
        lines.append('<meta property="og:image:width" content="%d">' % og_size[0])
        lines.append('<meta property="og:image:height" content="%d">' % og_size[1])
    lines.append('<meta property="og:image:alt" content="%s">' % h(og_alt or DEFAULT_OG_ALT))
    lines += [
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:title" content="%s">' % h(title_full),
        '<meta name="twitter:description" content="%s">' % h(description),
        '<meta name="twitter:image" content="%s">' % h(img_abs),
    ]
    if extra:
        lines.append(extra)
    return '\n'.join(lines)


HEAD_SCRIPT = ("<script>(function(){var d=document.documentElement;d.classList.add('js');"
               "try{if(localStorage.getItem('pp:motion')==='reduced'){d.setAttribute('data-motion','reduced');}}catch(e){}})();</script>")


def render_document(nav, ctx, page, m, body_html, hero_html='', canonical=True, draft=False, extra_head=''):
    """Wrap a page body in the shell and return the complete HTML document."""
    tpl = m.get('template') or page['template']
    title_full = m['title_full']
    og_image = m.get('og_image') or DEFAULT_OG_IMAGE
    og_size = DEFAULT_OG_SIZE if og_image == DEFAULT_OG_IMAGE else media.read_size(media.asset_path(og_image))
    noindex = bool(m.get('noindex') or page.get('noindex') or draft)
    crumbs = m['breadcrumb_items']
    ld = jsonld_for(ctx, nav, page, m, body_html, crumbs)
    head_seo = render_seo_head(ctx, title_full, m['description'], og_image, og_size, m.get('og_alt'),
                               'article' if (m.get('schema') or page.get('schema')) == 'article' else 'website', noindex, canonical)
    preloads = '\n'.join('<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' % h(ctx.file(f)) for f in PRELOAD_FONTS)
    body_cls = 'inner tpl-%s%s' % (tpl.lower(), (' ' + m['body_class']) if m.get('body_class') else '')
    # data-hours and data-call give js/inner.js the school's hours and number (nav.json), so no text in the script repeats them
    attrs = 'class="%s" data-template="%s" data-root="%s" data-hours="%s" data-call="%s"' % (
        h(body_cls), h(tpl), h(ctx.root), h(nav.site['hours_between']), h(nav.site['call_number']['display']))
    show_actions = m.get('actions', page.get('actions', True)) not in (False, 'off', 'false', 'no')
    if not show_actions:
        attrs += ' data-actions="off"'
    if draft:
        extra_head += '\n<meta name="pp:draft" content="true">'
    if SHELL_HASH:
        extra_head += '\n<meta name="pp:shell" content="%s">' % h(SHELL_HASH)
    return '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
%(seo)s
<link rel="icon" type="image/png" sizes="32x32" href="%(i32)s">
<link rel="icon" type="image/png" sizes="512x512" href="%(i512)s">
<link rel="apple-touch-icon" sizes="180x180" href="%(i180)s">
%(preloads)s
%(script)s
<link rel="stylesheet" href="%(maincss)s">
<link rel="stylesheet" href="%(pagescss)s">
<link rel="stylesheet" href="%(addcss)s">
<script type="application/ld+json">
%(ld)s
</script>%(extra)s
<script src="%(js)s" defer></script>
<script src="%(addjs)s" defer></script>
</head>
<body %(attrs)s>
<a class="skip" href="#content">Skip to content</a>

%(header)s

%(menu)s

<main id="content" tabindex="-1">
%(hero)s
%(body)s
</main>

%(footer)s

%(actions)s

</body>
</html>
''' % {
        'seo': head_seo, 'i32': h(ctx.asset('media/favicon-32.png')), 'i512': h(ctx.asset('media/favicon-512.png')),
        'i180': h(ctx.asset('media/favicon-180.png')), 'preloads': preloads, 'script': HEAD_SCRIPT,
        'maincss': h(ctx.file('css/main.css')), 'pagescss': h(ctx.file('css/pages.css')),
        'addcss': h(ctx.file('css/pages-additions.css')), 'addjs': h(ctx.file('js/pages-additions.js')), 'ld': ld,
        'extra': ('\n' + extra_head) if extra_head else '', 'js': h(ctx.file('js/inner.js')), 'attrs': attrs,
        'header': render_header(ctx, page), 'menu': render_menu(ctx, page), 'hero': hero_html, 'body': body_html,
        'footer': render_footer(ctx), 'actions': render_actions(ctx),
    }


def render_draft_body(nav, ctx, page):
    """The body of a page that has no source yet: a plain notice, flagged noindex and pp:draft. Never ships:
    build.py --strict and check.py --strict fail on it."""
    return '''<section class="page-section">
  <div class="band">
    <div class="callout">
      <span class="callout__label label">Page in preparation</span>
      <p>This page is being written. For now, call the admissions line for your child's section %s:</p>
      %s
    </div>
  </div>
</section>''' % (h(nav.site['hours_between']), phones_list(nav, 'sections'))


def render_redirect(nav, slug_old, target, hashes, base_root='./'):
    """Meta-refresh stub for an old flat page. Lives at site/<slug_old>, so its root prefix is './'."""
    ctx = Ctx(nav, '/', root=base_root)
    page = nav.by_slug[target]
    dest = ctx.link(target)
    title = 'Moved: %s' % page['title']
    desc = 'This page has moved to %s.' % page['title']
    maps = {k: ctx.link(v) for k, v in hashes.items()}
    script = ''
    if maps:
        script = ('<script>(function(){var m=%s,k=(location.hash||"").slice(1);if(k&&m[k]){location.replace(m[k]);}})();</script>'
                  % json.dumps(maps))
    canon = SITE_URL + target
    return '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>%(title)s%(suffix)s</title>
<meta name="description" content="%(desc)s">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="%(canon)s">
<meta name="pp:kind" content="redirect">
<meta http-equiv="refresh" content="0; url=%(dest)s">
<meta name="theme-color" content="%(theme)s">
<link rel="icon" type="image/png" sizes="32x32" href="%(icon)s">
<link rel="stylesheet" href="%(css)s">
<link rel="stylesheet" href="%(pagescss)s">
%(script)s
</head>
<body class="moved-page">
<main id="content" class="moved band">
  <p class="label">The Playpen School</p>
  <h1 class="display-m">This page has moved</h1>
  <p class="lead">The page you asked for is now <a class="link" href="%(dest)s">%(ptitle)s</a>. If your browser does not take you there, use that link.</p>
  <p><a class="link" href="%(home)s">Go to the home page</a></p>
</main>
</body>
</html>
''' % {'title': h(title), 'suffix': h(nav.site['title_suffix']), 'desc': h(desc), 'canon': h(canon), 'dest': h(dest),
       'theme': THEME_COLOR, 'icon': h(ctx.asset('media/favicon-32.png')), 'css': h(ctx.file('css/main.css')),
       'pagescss': h(ctx.file('css/pages.css')),
       'script': script, 'ptitle': h(page['title']), 'home': h(ctx.link('/'))}
