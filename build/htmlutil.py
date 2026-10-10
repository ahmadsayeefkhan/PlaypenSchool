# -*- coding: utf-8 -*-
"""Small HTML helpers shared by build.py and check.py (standard library only):
tag-balance checking with line numbers, plain-text extraction, and a light element collector."""
import re
from html.parser import HTMLParser

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
# elements whose end tag HTML lets you omit
OPTIONAL_END = {'p', 'li', 'dt', 'dd', 'tr', 'td', 'th', 'thead', 'tbody', 'tfoot', 'option', 'optgroup', 'colgroup', 'caption', 'rp', 'rt'}
CLOSES_P = {'address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset', 'figcaption', 'figure', 'footer',
            'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul'}
IMPLIES_CLOSE = {
    'li': {'li'}, 'dt': {'dt', 'dd'}, 'dd': {'dt', 'dd'}, 'tr': {'td', 'th', 'tr'}, 'td': {'td', 'th'}, 'th': {'td', 'th'},
    'thead': {'tr', 'td', 'th', 'thead', 'tbody', 'tfoot'}, 'tbody': {'tr', 'td', 'th', 'thead', 'tbody', 'tfoot'},
    'tfoot': {'tr', 'td', 'th', 'thead', 'tbody', 'tfoot'}, 'option': {'option'}, 'optgroup': {'option', 'optgroup'},
}


# alt text that says nothing: a file name, or "image of ..." (the screen reader already says it is an image)
_ALT_FILE = re.compile(r'\.(?:jpe?g|png|webp|avif|gif|svg)\s*$|^(?:dsc|img|pxl|image|photo|screenshot)[-_ ]?\d+\b', re.I)
_ALT_FILLER = re.compile(r'^\s*(?:an?\s+)?(?:image|photo|photograph|picture|pic|graphic|screenshot)\s*(?:of\b|showing\b|:)|^\s*(?:image|photo|photograph|picture|graphic)\s*$', re.I)


def alt_problem(alt):
    """Why an alt text is poor, or None. An empty alt is fine (pure decoration)."""
    a = (alt or '').strip()
    if not a:
        return None
    if _ALT_FILE.search(a):
        return 'looks like a file name; say what the picture shows'
    if _ALT_FILLER.match(a):
        return 'starts with "image of" or "photo of"; say what is shown, in one sentence'
    return None


def is_draft_html(text):
    """True for a draft stub written by build.py: its <meta name="pp:draft"> sits in the <head> (at any depth into the file)."""
    return 'name="pp:draft"' in text.split('</head>', 1)[0]


class _Balance(HTMLParser):
    def __init__(self, line0=0):
        super().__init__(convert_charrefs=True)
        self.stack = []          # (tag, line)
        self.errors = []
        self.line0 = line0

    def handle_starttag(self, tag, attrs):
        line = self.getpos()[0] + self.line0
        if tag in CLOSES_P and self.stack and self.stack[-1][0] == 'p':
            self.stack.pop()
        if tag in IMPLIES_CLOSE:
            while self.stack and self.stack[-1][0] in IMPLIES_CLOSE[tag] and self.stack[-1][0] in OPTIONAL_END:
                self.stack.pop()
        if tag in VOID:
            return
        self.stack.append((tag, line))

    def handle_startendtag(self, tag, attrs):
        # <div/> style: treat void and svg-ish self-closing tags as complete
        return

    def handle_endtag(self, tag):
        line = self.getpos()[0] + self.line0
        if tag in VOID:
            return
        # find the matching open tag
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                skipped = [t for t in self.stack[i + 1:] if t[0] not in OPTIONAL_END]
                if skipped:
                    t, l = skipped[0]
                    self.errors.append('line %d: </%s> closes <%s> but <%s> opened at line %d was never closed' % (line, tag, tag, t, l))
                del self.stack[i:]
                return
        self.errors.append('line %d: </%s> has no matching opening tag' % (line, tag))


def check_balance(text, line0=0):
    """List of problems ('line N: ...') in tag nesting; line0 is added to every line number (the lines of the file
    that come before this text). Empty list = balanced."""
    p = _Balance(line0)
    try:
        p.feed(text)
        p.close()
    except Exception as e:  # malformed beyond recovery
        p.errors.append('parser error: %s' % e)
    for tag, line in p.stack:
        if tag not in OPTIONAL_END:
            p.errors.append('line %d: <%s> is never closed' % (line, tag))
    return p.errors


class _Text(HTMLParser):
    SKIP = {'script', 'style', 'template'}

    def __init__(self, skip_extra=()):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.depth = 0
        self.skip_extra = set(skip_extra)

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP or tag in self.skip_extra:
            self.depth += 1
        elif tag in ('br', 'p', 'li', 'div', 'section', 'h1', 'h2', 'h3', 'h4', 'tr', 'dt', 'dd'):
            self.parts.append(' ')

    def handle_endtag(self, tag):
        if (tag in self.SKIP or tag in self.skip_extra) and self.depth:
            self.depth -= 1
        elif tag in ('p', 'li', 'div', 'section', 'h1', 'h2', 'h3', 'h4', 'tr', 'td', 'th', 'dt', 'dd'):
            self.parts.append(' ')

    def handle_data(self, data):
        if not self.depth:
            self.parts.append(data)


def text_of(fragment, skip=()):
    """Visible text of an HTML fragment (scripts, styles and comments dropped), whitespace collapsed."""
    p = _Text(skip)
    try:
        p.feed(fragment)
        p.close()
    except Exception:
        pass
    return re.sub(r'\s+', ' ', ''.join(p.parts)).strip()


class Collector(HTMLParser):
    """Collects headings (with ids), h1 count, anchors, ids, images, links, scripts, title and meta tags of a document."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.h1 = 0
        self.headings = []        # (level, id, text, line)
        self.ids = set()
        self.dup_ids = []
        self.links = []           # (tag, attr, value, line, attrs dict, text)
        self.images = []          # (attrs dict, line)
        self.title = None
        self.meta = {}
        self.ldjson = []
        self.html_lang = None
        self.landmarks = set()
        self.has_skip = False
        self.main_count = 0
        self._cur_heading = None
        self._in_title = False
        self._in_ld = False
        self._ld_buf = []
        self._a_stack = []
        self._text_skip = 0
        self.body_text = []
        self.labels_for = set()
        self.inputs = []          # (attrs, line, inside_label)
        self.th_without_scope = []   # lines of <th> without scope
        self.tables = 0
        self.iframes = []
        self.buttons = []         # (attrs, line, text)
        self._label_depth = 0
        self._button = None
        self.attr_texts = []      # (attr, text, line, tag) for alt, title and aria-label values
        self.aria_refs = []       # (attr, id, line) for aria-labelledby / aria-controls / aria-describedby / label for
        self.classes = {}         # class token -> first line
        self.data_attrs = {}      # data-* attribute name -> first line
        self.handlers = []        # (attr, line) inline event handlers (onclick ...)
        self.body_attrs = {}
        self._main_depth = 0
        self.main_words = 0
        self.main_sections = 0

    # ------------------------------------------------------------------ parser callbacks
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        line = self.getpos()[0]
        if tag == 'html':
            self.html_lang = a.get('lang')
        elif tag == 'body':
            self.body_attrs = a
        for key, val in attrs:
            if key.startswith('data-'):
                self.data_attrs.setdefault(key, line)
            elif len(key) > 2 and key.startswith('on') and key.isalpha() and val is not None:
                self.handlers.append((key, line))
        if a.get('class'):
            for tok in a['class'].split():
                self.classes.setdefault(tok, line)
        for key in ('alt', 'title', 'aria-label'):
            if a.get(key):
                self.attr_texts.append((key, a[key], line, tag))
        for key in ('aria-labelledby', 'aria-controls', 'aria-describedby'):
            if a.get(key):
                for ref in a[key].split():
                    self.aria_refs.append((key, ref, line))
        if tag == 'label' and a.get('for'):
            self.aria_refs.append(('for', a['for'], line))
        if tag == 'main':
            self._main_depth += 1
        elif tag == 'section' and self._main_depth:
            self.main_sections += 1
        if 'id' in a and a['id']:
            if a['id'] in self.ids:
                self.dup_ids.append((a['id'], line))
            self.ids.add(a['id'])
        if tag == 'a' and a.get('name'):
            self.ids.add(a['name'])
        if tag == 'title':
            self._in_title = True
            self.title = ''
        elif tag == 'meta':
            key = a.get('name') or a.get('property') or a.get('http-equiv')
            if key:
                self.meta[key.lower()] = a.get('content', '')
        elif tag == 'script':
            self._text_skip += 1
            if (a.get('type') or '').lower() == 'application/ld+json':
                self._in_ld = True
                self._ld_buf = []
            if a.get('src'):
                self.links.append(('script', 'src', a['src'], line, a, ''))
        elif tag == 'style':
            self._text_skip += 1
        elif tag == 'link':
            if a.get('href'):
                self.links.append(('link', 'href', a['href'], line, a, ''))
            for key in ('imagesrcset',):
                if a.get(key):
                    self.links.append(('link', 'srcset', a[key], line, a, ''))
        elif tag in ('header', 'nav', 'main', 'footer', 'aside'):
            self.landmarks.add(tag)
            if tag == 'main':
                self.main_count += 1
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            if tag == 'h1':
                self.h1 += 1
            self._cur_heading = [int(tag[1]), a.get('id'), [], line]
        if tag == 'a':
            self.links.append(('a', 'href', a.get('href'), line, a, ''))
            self._a_stack.append(len(self.links) - 1)
            if 'skip' in (a.get('class') or '').split():
                self.has_skip = True
        elif tag in ('img', 'source', 'video', 'audio', 'iframe', 'embed', 'track'):
            if tag == 'img':
                self.images.append((a, line))
            for key in ('src', 'srcset', 'poster', 'data-src'):
                if a.get(key):
                    self.links.append((tag, key, a[key], line, a, ''))
        if tag == 'label':
            self._label_depth += 1
            if a.get('for'):
                self.labels_for.add(a['for'])
        elif tag in ('input', 'select', 'textarea'):
            if (a.get('type') or 'text').lower() not in ('hidden', 'submit', 'button', 'reset', 'image'):
                self.inputs.append((a, line, self._label_depth > 0))
        elif tag == 'th':
            if not a.get('scope') and not a.get('id'):
                self.th_without_scope.append(line)
        elif tag == 'table':
            self.tables += 1
        elif tag == 'iframe':
            self.iframes.append((a, line))
        elif tag == 'button':
            self._button = [a, line, []]
        if tag == 'form':
            self.links.append(('form', 'action', a.get('action'), line, a, ''))
        if tag == 'img' and self._a_stack:
            # an image inside a link contributes its alt to the link's text
            idx = self._a_stack[-1]
            t = self.links[idx]
            self.links[idx] = t[:5] + (t[5] + ' ' + (a.get('alt') or ''),)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag == 'main' and self._main_depth:
            self._main_depth -= 1
        if tag == 'title':
            self._in_title = False
        elif tag == 'script':
            self._text_skip = max(0, self._text_skip - 1)
            if self._in_ld:
                self._in_ld = False
                self.ldjson.append(''.join(self._ld_buf))
        elif tag == 'style':
            self._text_skip = max(0, self._text_skip - 1)
        elif tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6') and self._cur_heading:
            lvl, hid, parts, line = self._cur_heading
            self.headings.append((lvl, hid, re.sub(r'\s+', ' ', ''.join(parts)).strip(), line))
            self._cur_heading = None
        elif tag == 'a' and self._a_stack:
            self._a_stack.pop()
        elif tag == 'label' and self._label_depth:
            self._label_depth -= 1
        elif tag == 'button' and self._button:
            a, line, parts = self._button
            self.buttons.append((a, line, re.sub(r'\s+', ' ', ''.join(parts)).strip()))
            self._button = None

    def handle_data(self, data):
        if self._in_title and self.title is not None:
            self.title += data
        if self._in_ld:
            self._ld_buf.append(data)
        if self._text_skip:
            return
        if self._cur_heading is not None:
            self._cur_heading[2].append(data)
        if self._button is not None:
            self._button[2].append(data)
        if self._a_stack:
            idx = self._a_stack[-1]
            t = self.links[idx]
            self.links[idx] = t[:5] + (t[5] + data,)
        if self._main_depth:
            self.main_words += len(data.split())
        self.body_text.append(data)


def collect(text):
    c = Collector()
    try:
        c.feed(text)
        c.close()
    except Exception:
        pass
    return c


def split_srcset(value):
    """URLs inside a srcset attribute value."""
    out = []
    for part in re.split(r',\s+|,(?=\S)', value.strip()):
        part = part.strip()
        if part:
            out.append(part.split()[0])
    return out
