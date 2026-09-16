# -*- coding: utf-8 -*-
"""
Playpen School — static site shell.
Holds the document template, navigation, header, footer and shared partials
so every page is guaranteed to be structurally identical.
"""

SITE = {
    "name": "Playpen School",
    "legal": "Playpen",
    "tagline": "Established 1977",
    "domain": "https://playpen.edu.bd",
    "address_line1": "House 545/A, Road 19, Block J",
    "address_line2": "Bashundhara R/A, Dhaka 1229, Bangladesh",
    "phone_general": "+880 1755 515 885",
    "phone_general_href": "+8801755515885",
    "phone_hotline": "+880 9678 434 241",
    "phone_hotline_href": "+8809678434241",
    "email_general": "info@playpen.edu.bd",
    "email_admissions": "admission1@playpen.edu.bd",
    "email_alumni": "alumni@playpen.edu.bd",
    "email_career": "career@playpen.edu.bd",
    "portal": "http://portal.playpen.edu.bd/login",
    "facebook": "https://www.facebook.com/playpencenter",
    "office_hours": "9:00 AM – 1:00 PM, Sunday to Thursday",
    "map_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3069.2904856717564!2d90.44017933190598!3d23.817813743521523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c791291754f3%3A0x537753061717569f!2sPlaypen%20(Permanent%20Campus)!5e0!3m2!1sen!2sbd!4v1595771154326!5m2!1sen!2sbd",
    "form_pg9": "https://playpen.edu.bd/wp-content/uploads/2026/01/Admission-Form-2025-2026-Final.pdf",
    "form_alevel": "https://playpen.edu.bd/wp-content/uploads/2025/10/AS-LEVEL-FORM-2025-2026.pdf",
}

# ---------------------------------------------------------------- icons
ICON_ARROW = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
ICON_CHEV = '<svg class="chev" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
ICON_PHONE = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 3h3l1.5 4-2 1.3a11 11 0 005.2 5.2l1.3-2 4 1.5v3a1.5 1.5 0 01-1.7 1.5A14.5 14.5 0 013 4.7 1.5 1.5 0 014.5 3z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>'
ICON_MAIL = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M3 5.5l7 5 7-5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
ICON_PIN = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 18s6-5.2 6-9.5A6 6 0 004 8.5C4 12.8 10 18 10 18z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="10" cy="8.5" r="2.2" stroke="currentColor" stroke-width="1.4"/></svg>'
ICON_CLOCK = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7.3" stroke="currentColor" stroke-width="1.4"/><path d="M10 5.8V10l3 1.8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
ICON_CHECK = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10.5l4 4 8-9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
ICON_FB = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M9.5 16V9h2.3l.35-2.7H9.5V4.6c0-.78.22-1.31 1.34-1.31h1.43V.88A19 19 0 0010.18.77C8.11.77 6.7 2.03 6.7 4.35V6.3H4.4V9h2.3v7z"/></svg>'
ICON_YT = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M15.4 4.6a1.95 1.95 0 00-1.37-1.38C12.8 2.9 8 2.9 8 2.9s-4.8 0-6.03.32A1.95 1.95 0 00.6 4.6C.28 5.83.28 8 .28 8s0 2.17.32 3.4c.17.66.68 1.18 1.37 1.36C3.2 13.1 8 13.1 8 13.1s4.8 0 6.03-.34a1.95 1.95 0 001.37-1.36C15.72 10.17 15.72 8 15.72 8s0-2.17-.32-3.4zM6.47 10.35V5.65L10.5 8z"/></svg>'

# ---------------------------------------------------------------- nav
NAV = [
    ("About", "about.html", [
        ("Our Story", "about.html", "48 years, 1977 to today"),
        ("Mission, Vision &amp; Values", "about.html#values", "What we stand for"),
        ("Leadership &amp; Administration", "leadership.html", "Who leads the school"),
        ("Our Campus", "campus.html", "Purpose-built in Bashundhara"),
        ("Child Protection &amp; Safety", "campus-services.html#safeguarding", "Safeguarding commitment"),
        ("Alumni", "alumni.html", "The Playpen network"),
        ("Careers", "careers.html", "Teach at Playpen"),
    ]),
    ("Academics", "academics.html", [
        ("Academic Overview", "academics.html", "The Cambridge pathway"),
        ("Elementary School", "academics.html#elementary", "Playgroup &ndash; KG II"),
        ("Junior School", "academics.html#junior", "Class I &ndash; III"),
        ("Middle School", "academics.html#middle", "Class IV &ndash; VII"),
        ("Senior School", "academics.html#senior", "Class VIII &ndash; XII"),
        ("O Level &amp; A Level Subjects", "academics.html#subjects", "Full subject lists"),
        ("Assessment &amp; Examinations", "academics.html#examinations", "How progress is measured"),
        ("Library &amp; Laboratories", "academics.html#facilities", "Learning resources"),
        ("Student Support &amp; Counselling", "academics.html#support", "Academic and career guidance"),
    ]),
    ("Admissions", "admissions.html", [
        ("Admissions Overview", "admissions.html", "Start here"),
        ("Entry Points", "admissions.html#entry", "Which class to apply for"),
        ("Admission Process", "admissions.html#process", "Five clear steps"),
        ("Required Documents", "admissions.html#documents", "What to bring"),
        ("Download Forms", "admissions.html#forms", "PG&ndash;IX and A Level"),
        ("School Uniform", "admissions.html#uniform", "What students wear"),
        ("Admissions FAQ", "admissions.html#faq", "Common questions"),
    ]),
    ("Student Life", "student-life.html", [
        ("Student Life Overview", "student-life.html", "Beyond the classroom"),
        ("Sports &amp; Games", "student-life.html#sports", "Seven disciplines"),
        ("Arts, Music &amp; Drama", "student-life.html#arts", "Creative programmes"),
        ("Clubs &amp; Competitions", "student-life.html#clubs", "Debate, Olympiads, Spelling Bee"),
        ("Science &amp; Technology", "student-life.html#science", "Fairs and projects"),
        ("Community Service", "student-life.html#service", "Serving beyond the gate"),
        ("Events &amp; Celebrations", "student-life.html#events", "The school year"),
        ("Achievements", "achievements.html", "Results and recognition"),
    ]),
    ("Campus &amp; Services", "campus-services.html", [
        ("Campus Facilities", "campus.html", "The ten-storey campus"),
        ("Health Centre", "campus-services.html#health", "Care during school hours"),
        ("School Transport", "campus-services.html#transport", "Bus service since 2014"),
        ("Bookshop", "campus-services.html#bookshop", "Books and supplies"),
        ("Online Services &amp; Payment", "campus-services.html#online", "Portal and fee payment"),
        ("Safety &amp; Security", "campus-services.html#safeguarding", "How we keep students safe"),
        ("Policies &amp; Code of Conduct", "campus-services.html#policies", "School rules"),
    ]),
    ("News &amp; Events", "news.html", [
        ("Notices", "news.html#notices", "Operational announcements"),
        ("Upcoming Events", "news.html#events", "What is coming up"),
        ("Achievements", "achievements.html", "Student success"),
        ("Gallery", "news.html#gallery", "School life in pictures"),
    ]),
]

FOOTER_EXPLORE = [
    ("About Playpen", "about.html"), ("Academics", "academics.html"),
    ("Admissions", "admissions.html"), ("Student Life", "student-life.html"),
    ("Our Campus", "campus.html"), ("Achievements", "achievements.html"),
    ("News &amp; Events", "news.html"), ("Contact Us", "contact.html"),
]
FOOTER_PARENTS = [
    ("Parent &amp; Student Portal", SITE["portal"]), ("Pay School Fees", SITE["portal"]),
    ("Notices", "news.html#notices"), ("Academic Calendar", "parents.html#calendar"),
    ("School Transport", "campus-services.html#transport"), ("Uniform Guide", "admissions.html#uniform"),
    ("Downloads &amp; Forms", "parents.html#downloads"), ("For Parents Hub", "parents.html"),
]
FOOTER_MORE = [
    ("Leadership", "leadership.html"), ("Alumni Association", "alumni.html"),
    ("Careers at Playpen", "careers.html"), ("Campus &amp; Services", "campus-services.html"),
    ("Child Protection", "campus-services.html#safeguarding"), ("Code of Conduct", "campus-services.html#policies"),
]


def nav_html(active):
    out = []
    for label, href, children in NAV:
        cls = "nav-link is-active" if active == href else "nav-link"
        out.append('<div class="nav-item">')
        out.append(f'<a class="{cls}" href="{href}">{label}{ICON_CHEV}</a>')
        out.append('<div class="dropdown">')
        for c_label, c_href, c_desc in children:
            out.append(f'<a href="{c_href}">{c_label}<span>{c_desc}</span></a>')
        out.append('</div></div>')
    return "\n".join(out)


def mobile_nav_html():
    out = ['<nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">']
    for label, href, children in NAV:
        out.append('<details>')
        out.append(f'<summary>{label}</summary><div>')
        out.append(f'<a href="{href}"><strong>{label} overview</strong></a>')
        for c_label, c_href, _ in children[1:]:
            out.append(f'<a href="{c_href}">{c_label}</a>')
        out.append('</div></details>')
    out.append('<a class="m-top" href="parents.html">For Parents</a>')
    out.append('<a class="m-top" href="contact.html">Contact</a>')
    out.append('<div class="m-cta">')
    out.append(f'<a class="btn btn--primary" href="admissions.html">Apply for Admission {ICON_ARROW}</a>')
    out.append(f'<a class="btn btn--outline" href="{SITE["portal"]}" rel="noopener">Parent &amp; Student Portal</a>')
    out.append('</div></nav>')
    return "\n".join(out)


def header_html(active, announce=None):
    ann = ""
    if announce:
        ann = f'''<div class="announce"><div class="container">
      <span class="announce-tag">Admissions Open</span>
      <span>{announce}</span>
      <a class="link-arrow" href="admissions.html">Admission details {ICON_ARROW}</a>
    </div></div>'''
    return f'''<div class="utility-bar"><div class="container">
    <div class="utility-list">
      <a href="{SITE["portal"]}" rel="noopener">Parent &amp; Student Portal</a>
      <a href="{SITE["portal"]}" rel="noopener">Pay Fees</a>
      <a href="careers.html">Careers</a>
      <a href="alumni.html">Alumni</a>
    </div>
    <div class="utility-contact">
      <a href="tel:{SITE["phone_general_href"]}">{ICON_PHONE} {SITE["phone_general"]}</a>
      <a href="mailto:{SITE["email_general"]}">{ICON_MAIL} {SITE["email_general"]}</a>
    </div>
  </div></div>
{ann}
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="Playpen School home">
        <img src="assets/logo/logo-crest.png" alt="" width="46" height="46">
        <span><span class="brand-name">Playpen</span><span class="brand-tag">School &middot; Est. 1977</span></span>
      </a>
      <nav class="nav" aria-label="Main">
        {nav_html(active)}
      </nav>
      <div class="header-actions">
        <a class="btn btn--outline btn--sm" href="contact.html">Visit Us</a>
        <a class="btn btn--primary btn--sm" href="admissions.html">Apply Now</a>
        <button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
  {mobile_nav_html()}'''


def cta_band():
    return f'''<section class="cta-band section">
    <div class="container cta-inner">
      <div data-reveal>
        <p class="overline">Admissions</p>
        <h2 class="h2">Come and see the school for yourself.</h2>
        <p class="lead" style="max-width:46ch;margin-top:1rem;color:rgba(255,255,255,.85)">Speak to our Admissions Office, collect a form, or arrange a campus visit during office hours.</p>
      </div>
      <div class="btn-row" data-reveal data-reveal-delay="2">
        <a class="btn btn--gold" href="admissions.html">Start an application {ICON_ARROW}</a>
        <a class="btn btn--ghost-light" href="tel:{SITE["phone_hotline_href"]}">Call {SITE["phone_hotline"]}</a>
      </div>
    </div>
  </section>'''


def footer_html():
    def links(items):
        return "\n".join(
            f'<li><a href="{h}"{" rel=\"noopener\"" if h.startswith("http") else ""}>{l}</a></li>'
            for l, h in items)
    return f'''<footer class="site-footer">
    <div class="footer-top"><div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <img src="assets/logo/logo-crest.png" alt="" width="52" height="52">
            <span><strong>Playpen School</strong><span>Established 1977</span></span>
          </div>
          <p>An English-medium school in Bashundhara, Dhaka, offering the Cambridge curriculum from Playgroup through to A Level. A balanced programme in a creative learning environment &mdash; the idea Playpen was founded on.</p>
          <div class="social-row">
            <a href="{SITE["facebook"]}" rel="noopener" aria-label="Playpen on Facebook">{ICON_FB}</a>
            <a href="{SITE["facebook"]}" rel="noopener" aria-label="Playpen on YouTube">{ICON_YT}</a>
          </div>
          <div class="footer-accred">
            <img src="assets/logo/cambridge-cie.png" alt="Cambridge Assessment International Education">
            <p>Cambridge curriculum from the early years through Ordinary, Advanced Subsidiary and Advanced Level.</p>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <ul class="footer-links">{links(FOOTER_EXPLORE)}</ul>
        </div>
        <div>
          <h4>For Parents</h4>
          <ul class="footer-links">{links(FOOTER_PARENTS)}</ul>
        </div>
        <div>
          <h4>Contact</h4>
          <div class="footer-contact">
            <p style="margin:0">{SITE["address_line1"]}<br>{SITE["address_line2"]}</p>
            <a href="tel:{SITE["phone_general_href"]}">{SITE["phone_general"]}</a>
            <a href="tel:{SITE["phone_hotline_href"]}">{SITE["phone_hotline"]}</a>
            <a href="mailto:{SITE["email_general"]}">{SITE["email_general"]}</a>
            <p style="margin:0;font-size:var(--t-xs);opacity:.75">Office hours: {SITE["office_hours"]}</p>
          </div>
          <h4 style="margin-top:2rem">More</h4>
          <ul class="footer-links">{links(FOOTER_MORE)}</ul>
        </div>
      </div>
    </div></div>
    <div class="footer-bottom"><div class="container">
      <p style="margin:0">&copy; <span data-year>2026</span> Playpen School. All rights reserved.</p>
      <div class="footer-legal">
        <a href="campus-services.html#safeguarding">Child Protection</a>
        <a href="campus-services.html#policies">Code of Conduct</a>
        <a href="campus-services.html#policies">Privacy</a>
        <a href="contact.html">Contact</a>
      </div>
    </div></div>
  </footer>'''


SCHEMA = '''{
  "@context": "https://schema.org",
  "@type": "School",
  "name": "Playpen School",
  "alternateName": "Playpen Center",
  "foundingDate": "1977",
  "url": "https://playpen.edu.bd/",
  "logo": "https://playpen.edu.bd/assets/logo/logo-crest.png",
  "description": "Playpen School is an English-medium school in Bashundhara, Dhaka, offering the Cambridge curriculum from Playgroup through O Level and A Level.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "House 545/A, Road 19, Block J, Bashundhara R/A",
    "addressLocality": "Dhaka",
    "postalCode": "1229",
    "addressCountry": "BD"
  },
  "telephone": "+8801755515885",
  "email": "info@playpen.edu.bd",
  "sameAs": ["https://www.facebook.com/playpencenter"]
}'''


def page(slug, title, description, body, active="", announce=None, extra_head=""):
    """Assemble one complete HTML document."""
    canonical = f'{SITE["domain"]}/{"" if slug == "index.html" else slug}'
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="{canonical}">
<meta name="theme-color" content="#8A171A">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Playpen School">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE["domain"]}/assets/img/campus-exterior.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/logo/logo-crest.png" type="image/png">
<link rel="apple-touch-icon" href="assets/logo/logo-crest.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/main.css">
<script type="application/ld+json">{SCHEMA}</script>
{extra_head}</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<div class="grain" aria-hidden="true"></div>
{header_html(active, announce)}
<main id="main">
{body}
</main>
{footer_html()}
<script src="assets/js/main.js" defer></script>
</body>
</html>
'''


def page_hero(kicker_trail, h1, lead, image, alt=""):
    crumbs = " ".join(
        f'<a href="{h}">{l}</a><span>/</span>' if h else f"{l}"
        for l, h in kicker_trail)
    return f'''<section class="page-hero">
    <div class="page-hero-media"><img src="assets/img/{image}" alt="{alt}" loading="eager" fetchpriority="high"></div>
    <div class="container">
      <p class="breadcrumb"><a href="index.html">Home</a><span>/</span>{crumbs}</p>
      <h1 class="h1">{h1}</h1>
      <p class="lead">{lead}</p>
    </div>
  </section>'''
