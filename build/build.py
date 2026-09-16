# -*- coding: utf-8 -*-
"""
Playpen School — static site builder.

Run:  python build.py
Out:  ../site/*.html
"""
import os
import sys
import io

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from shell import page
import p_home, p_about, p_academics, p_admissions, p_life, p_services, p_misc

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "site")

ANNOUNCE = ("A&rsquo; Level admission is open for the academic year "
            "July 2026 &ndash; June 2027.")

PAGES = [
    dict(slug="index.html", active="", announce=ANNOUNCE, body=p_home.BODY,
         title="Playpen School | Cambridge Education from Playgroup to A Level, Bashundhara Dhaka",
         description="Playpen is an English-medium school in Bashundhara, Dhaka, teaching the Cambridge curriculum from Playgroup to A Level since 1977. Explore admissions, academics, campus and student life."),

    dict(slug="about.html", active="about.html", body=p_about.ABOUT,
         title="About Playpen School | Our Story, Mission and Values Since 1977",
         description="Playpen was founded in 1977 by Mrs. Zeba Khan and moved to its purpose-built Bashundhara campus in 2018. Read the school's history, mission, vision and institutional goals."),

    dict(slug="leadership.html", active="about.html", body=p_about.LEADERSHIP,
         title="Leadership & Administration | Playpen School",
         description="The Chairman, Managing Director, Principal, Vice Principals and Teacher-In-Charges who lead Playpen School, and how the school is staffed."),

    dict(slug="campus.html", active="about.html", body=p_about.CAMPUS,
         title="Our Campus | Playpen School, Bashundhara R/A, Dhaka",
         description="Playpen's purpose-built ten-storey campus in Bashundhara: air-conditioned classrooms, science and IT laboratories, library, multi-purpose hall, playground and basketball court."),

    dict(slug="academics.html", active="academics.html", body=p_academics.ACADEMICS,
         title="Academics | Cambridge Curriculum, Playgroup to A Level | Playpen School",
         description="Playpen follows the Cambridge curriculum across four stages from Playgroup to Class XII, with O Level and A Level subjects, examinations, library, laboratories and student support."),

    dict(slug="admissions.html", active="admissions.html", announce=ANNOUNCE, body=p_admissions.ADMISSIONS,
         title="Admissions | How to Apply to Playpen School, Dhaka",
         description="Entry points, the five-step admission process, required documents, downloadable forms, the school uniform and answers to the questions parents ask most."),

    dict(slug="student-life.html", active="student-life.html", body=p_life.STUDENT_LIFE,
         title="Student Life | Sports, Arts, Clubs and Community Service | Playpen School",
         description="Sport, music, dance, drama, debate, Olympiads, the Science Fair, the Duke of Edinburgh's Award and community service at Playpen School, Dhaka."),

    dict(slug="achievements.html", active="student-life.html", body=p_life.ACHIEVEMENTS,
         title="Student Achievements | Olympiads, Competitions and Sport | Playpen School",
         description="A record of Playpen students' results in Olympiads, spelling and language competitions, mathematics, sport and environmental programmes."),

    dict(slug="campus-services.html", active="campus-services.html", body=p_services.SERVICES,
         title="Campus & Services | Health, Transport, Bookshop and Safeguarding | Playpen School",
         description="The health centre, school bus service, bookshop, online portal and fee payment, safeguarding arrangements and the school's code of conduct."),

    dict(slug="parents.html", active="", body=p_services.PARENTS,
         title="For Parents | Portal, Fees, Calendar and Downloads | Playpen School",
         description="Parent and student portal access, online fee payment, notices, the academic calendar, transport, uniform and downloadable forms, in one place."),

    dict(slug="news.html", active="news.html", body=p_misc.NEWS,
         title="News, Notices & Events | Playpen School",
         description="Current notices, upcoming events, the annual calendar and a gallery of school life at Playpen School, Bashundhara, Dhaka."),

    dict(slug="alumni.html", active="about.html", body=p_misc.ALUMNI,
         title="Alumni Association | Playpen School",
         description="Playpen's alumni network: reconnect with your year, share your story, and register your details with the school."),

    dict(slug="careers.html", active="about.html", body=p_misc.CAREERS,
         title="Careers at Playpen | Teaching Jobs in Bashundhara, Dhaka",
         description="Teach at Playpen School. Many faculty members have served here for decades. How to apply, what to send, and what the school offers."),

    dict(slug="contact.html", active="", body=p_misc.CONTACT,
         title="Contact Us | Playpen School, Bashundhara R/A, Dhaka 1229",
         description="Department phone numbers and email addresses, office hours, an enquiry form and a map showing the Playpen campus in Bashundhara Residential Area."),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    written = []
    for p in PAGES:
        html = page(
            slug=p["slug"], title=p["title"], description=p["description"],
            body=p["body"], active=p.get("active", ""), announce=p.get("announce"),
        )
        path = os.path.join(OUT, p["slug"])
        with io.open(path, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(html)
        written.append((p["slug"], len(html)))

    # sitemap.xml
    urls = "\n".join(
        '  <url><loc>https://playpen.edu.bd/%s</loc><changefreq>%s</changefreq><priority>%s</priority></url>'
        % ("" if p["slug"] == "index.html" else p["slug"],
           "weekly" if p["slug"] in ("index.html", "news.html", "admissions.html") else "monthly",
           "1.0" if p["slug"] == "index.html" else ("0.9" if p["slug"] in ("admissions.html", "academics.html") else "0.7"))
        for p in PAGES)
    sitemap = ('<?xml version="1.0" encoding="UTF-8"?>\n'
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
               + urls + "\n</urlset>\n")
    with io.open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write(sitemap)

    robots = ("User-agent: *\nAllow: /\n\n"
              "Sitemap: https://playpen.edu.bd/sitemap.xml\n")
    with io.open(os.path.join(OUT, "robots.txt"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write(robots)

    total = sum(n for _, n in written)
    for slug, n in written:
        print("  %-24s %7d bytes" % (slug, n))
    print("\n%d pages + sitemap.xml + robots.txt written to /site  (%.0f KB HTML)"
          % (len(written), total / 1024.0))


if __name__ == "__main__":
    main()
