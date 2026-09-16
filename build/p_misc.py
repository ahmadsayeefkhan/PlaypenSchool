# -*- coding: utf-8 -*-
from shell import (SITE, ICON_ARROW, ICON_CHECK, ICON_PHONE, ICON_MAIL,
                   ICON_PIN, ICON_CLOCK, cta_band, page_hero)

A = ICON_ARROW

# ====================================================================== NEWS
NEWS = page_hero(
    [("News &amp; Events", None)],
    "Notices, events and school life.",
    "Operational announcements, what is coming up in the calendar, and a look at the school in pictures.",
    "hero-students-2.jpg", "A NASA astronaut speaking at a Playpen school event"
) + f'''
<section class="section" id="notices">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Notices</p>
      <h2 class="h2">Current announcements.</h2>
      <p class="lead" style="margin-top:1rem">Operational information for parents and students &mdash; examinations, policy reminders, class instructions and closures.</p>
    </div>
    <div class="notice-list" data-reveal>
      <article class="notice-item">
        <span class="notice-date">Nov 2025</span>
        <div>
          <h3 class="h5">First Semester Examination</h3>
          <p>Examinations are scheduled from 30 November to 11 December 2025. Classes for younger students, PG to KG&ndash;II, continue regular sessions until 8 December 2025. Students are advised to prepare accordingly.</p>
        </div>
        <span class="notice-tag notice-tag--exam">Examination</span>
      </article>
      <article class="notice-item">
        <span class="notice-date">Standing</span>
        <div>
          <h3 class="h5">About Mobile Phones</h3>
          <p>Students are not to bring mobile phones to school. Their bags will be searched at the time of entry in the morning. Students requiring urgent contact with parents may use the Admin Office on Level 2 to make calls.</p>
        </div>
        <span class="notice-tag">Policy</span>
      </article>
      <article class="notice-item">
        <span class="notice-date">2026&ndash;27</span>
        <div>
          <h3 class="h5">A Level Admission Open</h3>
          <p>Playpen offers admission for the academic year July 2026 &ndash; June 2027 for A Level. Kindly contact 01755 693 623, 01755 515 885 or +880 9678 434 241 between 9:00 AM and 1:00 PM. Forms are available in the admin office and on this website.</p>
        </div>
        <span class="notice-tag notice-tag--event">Admissions</span>
      </article>
    </div>
    <div class="callout" style="margin-top:2.5rem" data-reveal>
      <p class="small"><strong>For the school office.</strong> This page is built to run from a content management system. Each notice carries a title, date, category, audience, summary, attachment and archive date, so old announcements drop off automatically instead of being deleted by hand.</p>
    </div>
  </div>
</section>

<section class="section section--sand" id="events">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Events</p>
      <h2 class="h2">Coming up.</h2>
    </div>
    <div class="grid grid-3" data-reveal>
      <div class="contact-card" style="display:flex;gap:1.25rem;align-items:flex-start">
        <div class="date-chip"><strong>26</strong><span>Sep</span></div>
        <div>
          <span class="card-kicker">Meeting</span>
          <h3 class="h5" style="margin-top:.4rem">Parents&ndash;Teachers Meeting 1</h3>
          <p class="small muted" style="margin-top:.5rem">The first parent&ndash;teacher meeting of the academic year. Class-wise timings are issued through the Parent &amp; Student Portal.</p>
        </div>
      </div>
    </div>
    <div class="split" style="margin-top:3.5rem;align-items:start">
      <div data-reveal>
        <h3 class="h3" style="margin-bottom:1rem">The annual calendar</h3>
        <p class="lead">Beyond the dated events above, the school year carries a fixed set of programmes.</p>
        <ul class="chips" style="margin-top:1.5rem">
          <li>Annual Cultural Programme</li><li>Annual Milad</li><li>Science Fair</li>
          <li>International Mother Language Day</li><li>Independence Day</li><li>Pohela Boishakh</li>
          <li>Victory Day</li><li>Graduation Ceremony</li><li>Class Parties</li>
          <li>Educational Tours</li><li>Sports Day</li><li>Football tournaments</li>
        </ul>
      </div>
      <div class="callout" data-reveal data-reveal-delay="1">
        <h3 class="h5">Where to find exact dates</h3>
        <p style="margin-top:.75rem">Semester dates, examination schedules and event timings are published through the Parent &amp; Student Portal alongside the academic calendar, and announced here as notices.</p>
        <div class="btn-row" style="margin-top:1.5rem">
          <a class="btn btn--primary btn--sm" href="{SITE["portal"]}" rel="noopener">Open the portal {A}</a>
          <a class="btn btn--outline btn--sm" href="parents.html#calendar">Calendar overview</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="gallery">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Gallery</p>
      <h2 class="h2">School life in pictures.</h2>
      <p class="lead" style="margin-top:1rem">Campus, classrooms, sport, culture, science and service. Albums are organised by category and academic year.</p>
    </div>
    <div class="btn-row" data-filter-group="#gal" style="margin-bottom:2rem" data-reveal>
      <button class="btn btn--outline btn--sm" data-filter="all" aria-pressed="true">All</button>
      <button class="btn btn--outline btn--sm" data-filter="campus" aria-pressed="false">Campus</button>
      <button class="btn btn--outline btn--sm" data-filter="learning" aria-pressed="false">Classroom</button>
      <button class="btn btn--outline btn--sm" data-filter="sport" aria-pressed="false">Sport</button>
      <button class="btn btn--outline btn--sm" data-filter="culture" aria-pressed="false">Arts &amp; Culture</button>
      <button class="btn btn--outline btn--sm" data-filter="service" aria-pressed="false">Community</button>
    </div>
    <div class="gallery-grid" id="gal" data-reveal>
      <div class="figure" data-category="campus"><img src="assets/img/campus-exterior.jpg" alt="The Playpen campus exterior" loading="lazy"></div>
      <div class="figure" data-category="campus"><img src="assets/img/campus-1.jpg" alt="Playpen campus building" loading="lazy"></div>
      <div class="figure" data-category="campus"><img src="assets/img/about-playpen.jpg" alt="The Playpen campus seen from the playground" loading="lazy"></div>
      <div class="figure" data-category="campus"><img src="assets/img/campus-3.jpg" alt="Playpen campus grounds" loading="lazy"></div>
      <div class="figure" data-category="learning"><img src="assets/img/admission-2.jpg" alt="A young Playpen pupil writing at her desk" loading="lazy"></div>
      <div class="figure" data-category="learning"><img src="assets/img/values-2.jpg" alt="Playpen’s youngest pupils at play with their teachers" loading="lazy"></div>
      <div class="figure" data-category="learning"><img src="assets/img/middle-senior.jpg" alt="Graduation ceremony at Playpen" loading="lazy"></div>
      <div class="figure" data-category="learning"><img src="assets/img/examination-2.jpg" alt="Examinations at Playpen" loading="lazy"></div>
      <div class="figure" data-category="sport"><img src="assets/img/sports-4.jpg" alt="Athletics at Playpen" loading="lazy"></div>
      <div class="figure" data-category="sport"><img src="assets/img/sports-3.jpg" alt="Annual sports at Playpen" loading="lazy"></div>
      <div class="figure" data-category="sport"><img src="assets/img/sports-5.jpg" alt="Playpen students competing" loading="lazy"></div>
      <div class="figure" data-category="sport"><img src="assets/img/sports-6.jpg" alt="Inter-school sport at Playpen" loading="lazy"></div>
      <div class="figure" data-category="culture"><img src="assets/img/slider-8.jpg" alt="Classical dance at a Playpen cultural programme" loading="lazy"></div>
      <div class="figure" data-category="culture"><img src="assets/img/eca-4.jpg" alt="A Playpen cultural performance on stage" loading="lazy"></div>
      <div class="figure" data-category="culture"><img src="assets/img/hero-48-years.jpg" alt="Playpen celebration" loading="lazy"></div>
      <div class="figure" data-category="service"><img src="assets/img/community-1.jpg" alt="Community service at Playpen" loading="lazy"></div>
      <div class="figure" data-category="service"><img src="assets/img/community-2.jpg" alt="Playpen students volunteering" loading="lazy"></div>
      <div class="figure" data-category="service"><img src="assets/img/community-3.jpg" alt="Playpen community outreach" loading="lazy"></div>
    </div>
  </div>
</section>

{cta_band()}
'''

# ==================================================================== ALUMNI
ALUMNI = page_hero(
    [("About", "about.html"), ("Alumni", None)],
    "Once a Playpen student, always part of the community.",
    "Playpen wishes to connect with students who have excelled in their respective fields &mdash; wherever in the world that took them.",
    "hero-48-years.jpg", "Playpen alumni"
) + f'''
<section class="section">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">The alumni association</p>
      <h2 class="h2">A place to find your year again.</h2>
      <p class="lead" style="margin-top:1.25rem">Playpen seeks to reconnect with alumni who have gone on to achieve success at home and abroad. The aim is to establish a platform where former students can find their classmates, share what they remember of their time here, and reflect on it together.</p>
      <p style="margin-top:1rem">If you studied at Playpen &mdash; at any point since 1977 &mdash; we would like to hear from you. Send your details and a photograph to <a href="mailto:{SITE["email_alumni"]}" style="color:var(--crimson);font-weight:600">{SITE["email_alumni"]}</a>, or use the form on this page.</p>
      <div class="quote" style="margin-top:2.5rem">
        <blockquote style="font-size:var(--t-xl)">As versed by Rabindranath Tagore.</blockquote>
        <cite>The alumni page has long carried a verse from Tagore<span>To be reinstated in Bengali on publication</span></cite>
      </div>
    </div>
    <div class="contact-card" data-reveal data-reveal-delay="1">
      <h3 class="h4" style="margin-bottom:1.5rem">Register as an alumnus</h3>
      <form class="form-grid" data-demo-form>
        <div class="field"><label for="al-name">Full name</label><input id="al-name" name="name" type="text" required autocomplete="name"></div>
        <div class="field"><label for="al-year">Year you left Playpen</label><input id="al-year" name="year" type="text" inputmode="numeric" placeholder="e.g. 2014"></div>
        <div class="field"><label for="al-email">Email address</label><input id="al-email" name="email" type="email" required autocomplete="email"></div>
        <div class="field"><label for="al-phone">Phone number</label><input id="al-phone" name="phone" type="tel" autocomplete="tel"></div>
        <div class="field field--full"><label for="al-now">What you are doing now</label><input id="al-now" name="now" type="text" placeholder="University, profession, city"></div>
        <div class="field field--full"><label for="al-memory">A memory of Playpen</label><textarea id="al-memory" name="memory" rows="4"></textarea></div>
        <div class="field--full">
          <button class="btn btn--primary" type="submit">Register {A}</button>
          <p class="small" data-form-note hidden style="margin-top:1rem;color:var(--crimson)"></p>
        </div>
      </form>
    </div>
  </div>
</section>

<section class="section section--dark">
  <div class="container">
    <div class="section-head center" data-reveal>
      <p class="overline">What the network is for</p>
      <h2 class="h2">Three things we want to build.</h2>
    </div>
    <div class="grid grid-3">
      <div data-reveal><div class="feature" style="border-top-color:rgba(255,255,255,.2)"><span class="feature-num">01</span><h3>Reconnection</h3><p>A directory that lets former classmates find each other again, batch by batch, with privacy respected throughout.</p></div></div>
      <div data-reveal data-reveal-delay="1"><div class="feature" style="border-top-color:rgba(255,255,255,.2)"><span class="feature-num">02</span><h3>Alumni stories</h3><p>Where a Playpen education actually led &mdash; universities, professions, countries &mdash; told by the people who lived it.</p></div></div>
      <div data-reveal data-reveal-delay="2"><div class="feature" style="border-top-color:rgba(255,255,255,.2)"><span class="feature-num">03</span><h3>Giving back</h3><p>Alumni talking to current senior students about university applications, subject choices and what comes next.</p></div></div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container container--narrow center">
    <div data-reveal>
      <p class="overline center">Get in touch</p>
      <h2 class="h2">alumni@playpen.edu.bd</h2>
      <p class="lead" style="margin-top:1rem">Send your name, the years you attended, what you are doing now, and a recent photograph.</p>
      <div class="btn-row" style="margin-top:2rem;justify-content:center">
        <a class="btn btn--primary" href="mailto:{SITE["email_alumni"]}">Email the alumni office {A}</a>
        <a class="btn btn--outline" href="{SITE["facebook"]}" rel="noopener">Follow us on Facebook</a>
      </div>
    </div>
  </div>
</section>

{cta_band()}
'''

# =================================================================== CAREERS
CAREERS = page_hero(
    [("About", "about.html"), ("Careers", None)],
    "Teach at Playpen.",
    "Many of our faculty members have served here for thirty or forty years. That is not an accident.",
    "leadership.jpg", "Playpen faculty at a school celebration"
) + f'''
<section class="section">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">Why work here</p>
      <h2 class="h2">Job security, job satisfaction, and a path.</h2>
      <p class="lead" style="margin-top:1.25rem">Many faculty members have been at Playpen for as long as thirty or forty years. They stay because there is job security, job satisfaction and a career path &mdash; three things that are rarer in teaching than they should be.</p>
      <p style="margin-top:1rem">Our faculty includes both locally and internationally qualified teachers. Junior classes are staffed with Class Teachers and Assistant Teachers so that individual students get individual attention; senior classes work with Class and Subject Teachers, most of whom hold advanced international qualifications in their discipline.</p>
      <p style="margin-top:1rem">Teaching is supported by multimedia projectors, science and IT laboratories endorsed by Cambridge and the British Council, and a modernised library &mdash; on a purpose-built campus in Bashundhara.</p>
    </div>
    <div class="figure figure--wide" data-reveal data-reveal-delay="2"><img src="assets/img/values-3.jpg" alt="Playpen teachers with their pupils on the playground" loading="lazy"></div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">How to apply</p>
      <h2 class="h2">Send us your CV.</h2>
      <p class="lead" style="margin-top:1rem">We keep applications on file and make contact for interview when an opening matches a candidate&rsquo;s qualifications.</p>
    </div>
    <div class="steps" data-reveal>
      <div class="step"><div><h3 class="h5">Prepare your CV</h3><p>Accepted file formats are Microsoft Word or PDF. Include your qualifications, teaching experience, and the subjects and year groups you are qualified to teach.</p></div></div>
      <div class="step"><div><h3 class="h5">Attach a photograph</h3><p>A recent passport-sized image in JPEG format.</p></div></div>
      <div class="step"><div><h3 class="h5">Email your application</h3><p>Send everything to <a href="mailto:{SITE["email_career"]}" style="color:var(--crimson);font-weight:600">{SITE["email_career"]}</a>.</p></div></div>
      <div class="step"><div><h3 class="h5">We will be in touch</h3><p>The school initiates contact for interviews when openings align with a candidate&rsquo;s qualifications. Applications are retained for future vacancies.</p></div></div>
    </div>
    <div class="btn-row" style="margin-top:2.5rem" data-reveal>
      <a class="btn btn--primary" href="mailto:{SITE["email_career"]}">Email your application {A}</a>
      <a class="btn btn--outline" href="contact.html">Contact the school office</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container container--narrow">
    <div class="callout" data-reveal>
      <h3 class="h4">Current vacancies</h3>
      <p style="margin-top:.75rem">Specific openings are published here when the school is recruiting. In the meantime, applications are welcome at any time and are kept on file.</p>
      <p style="margin-top:.75rem" class="small muted">For the school office: this section is built to carry structured job postings &mdash; position, department, deadline, eligibility, responsibilities and application method &mdash; as they arise.</p>
    </div>
  </div>
</section>

{cta_band()}
'''

# =================================================================== CONTACT
CONTACT = page_hero(
    [("Contact", None)],
    "We would be happy to hear from you.",
    "Department numbers, email addresses, office hours and directions to the Bashundhara campus.",
    "campus-exterior.jpg", "The Playpen campus"
) + f'''
<section class="section">
  <div class="container">
    <div class="split" style="align-items:start">
      <div data-reveal>
        <p class="overline">Visit us</p>
        <h2 class="h2">House 545/A, Road 19, Block J.</h2>
        <div style="margin-top:2rem">
          <div class="contact-line">{ICON_PIN}<div><strong>Address</strong><br>House 545/A, Road 19, Block J<br>Bashundhara R/A, Dhaka 1229, Bangladesh</div></div>
          <div class="contact-line">{ICON_CLOCK}<div><strong>Office hours</strong><br>{SITE["office_hours"]}<br><span class="small muted">School bookshop: 8:30 AM &ndash; 1:00 PM</span></div></div>
          <div class="contact-line">{ICON_PHONE}<div><strong>General &amp; emergency</strong><br><a href="tel:{SITE["phone_general_href"]}">{SITE["phone_general"]}</a><br><a href="tel:{SITE["phone_hotline_href"]}">{SITE["phone_hotline"]}</a></div></div>
          <div class="contact-line">{ICON_MAIL}<div><strong>Email</strong><br><a href="mailto:{SITE["email_general"]}">{SITE["email_general"]}</a><br><a href="mailto:playpen.center@gmail.com">playpen.center@gmail.com</a></div></div>
        </div>
        <div class="btn-row" style="margin-top:2rem">
          <a class="btn btn--primary" href="admissions.html">Admissions {A}</a>
          <a class="btn btn--outline" href="{SITE["facebook"]}" rel="noopener">Facebook</a>
        </div>
      </div>
      <div class="contact-card" data-reveal data-reveal-delay="1">
        <h3 class="h4" style="margin-bottom:1.5rem">Send an enquiry</h3>
        <form class="form-grid" data-demo-form>
          <div class="field"><label for="c-name">Your name</label><input id="c-name" name="name" type="text" required autocomplete="name"></div>
          <div class="field"><label for="c-phone">Phone number</label><input id="c-phone" name="phone" type="tel" required autocomplete="tel"></div>
          <div class="field field--full"><label for="c-email">Email address</label><input id="c-email" name="email" type="email" required autocomplete="email"></div>
          <div class="field field--full"><label for="c-topic">What is your enquiry about?</label>
            <select id="c-topic" name="topic">
              <option>Admissions</option><option>Academic question</option><option>Fees and accounts</option>
              <option>Transport</option><option>Alumni</option><option>Careers</option><option>Something else</option>
            </select>
          </div>
          <div class="field field--full"><label for="c-msg">Your message</label><textarea id="c-msg" name="message" rows="5" required></textarea></div>
          <div class="field--full">
            <button class="btn btn--primary" type="submit">Send message {A}</button>
            <p class="small" data-form-note hidden style="margin-top:1rem;color:var(--crimson)"></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Departments</p>
      <h2 class="h2">Who to call about what.</h2>
    </div>
    <div class="table-wrap" data-reveal>
      <table class="data">
        <thead><tr><th>Department</th><th>Phone</th><th>Email</th></tr></thead>
        <tbody>
          <tr><td><strong>PG &ndash; Class I &amp; Admissions</strong></td><td><a href="tel:+8801755689482">01755 689 482</a></td><td><a href="mailto:admission1@playpen.edu.bd">admission1@playpen.edu.bd</a></td></tr>
          <tr><td><strong>Class II &ndash; VI &amp; Admissions</strong></td><td><a href="tel:+8801755515893">01755 515 893</a></td><td><a href="mailto:admission2@playpen.edu.bd">admission2@playpen.edu.bd</a></td></tr>
          <tr><td><strong>Class VII &ndash; XII &amp; Admissions</strong></td><td><a href="tel:+8801755693623">01755 693 623</a></td><td><a href="mailto:admission3@playpen.edu.bd">admission3@playpen.edu.bd</a></td></tr>
          <tr><td><strong>Accounts &amp; Finance</strong></td><td><a href="tel:+8801313025955">01313 025 955</a><br><a href="tel:+8801755515890">01755 515 890</a><br><a href="tel:+8801730068808">01730 068 808</a></td><td><a href="mailto:accounts@playpen.edu.bd">accounts@playpen.edu.bd</a></td></tr>
          <tr><td><strong>General queries &amp; emergency</strong></td><td><a href="tel:+8801755515885">01755 515 885</a><br><a href="tel:+8809678434241">+880 9678 434 241</a></td><td><a href="mailto:playpen.center@gmail.com">playpen.center@gmail.com</a><br><a href="mailto:info@playpen.edu.bd">info@playpen.edu.bd</a></td></tr>
          <tr><td><strong>Careers</strong></td><td>&mdash;</td><td><a href="mailto:{SITE["email_career"]}">{SITE["email_career"]}</a></td></tr>
          <tr><td><strong>Alumni</strong></td><td>&mdash;</td><td><a href="mailto:{SITE["email_alumni"]}">{SITE["email_alumni"]}</a></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head" data-reveal><p class="overline">Directions</p><h2 class="h3">Find the campus</h2></div>
    <div class="map-frame" data-reveal>
      <iframe src="{SITE["map_embed"]}" title="Map showing Playpen School in Bashundhara Residential Area, Dhaka" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </div>
    <div class="grid grid-3" style="margin-top:2.5rem">
      <div class="callout" data-reveal><h3 class="h5">Arriving by car</h3><p>Drivers should observe school traffic rules, avoid horn use and reduce speed near the premises.</p></div>
      <div class="callout" data-reveal data-reveal-delay="1"><h3 class="h5">School bus</h3><p>Playpen has run its own bus service since March 2014. Apply at the Administrative Office.</p></div>
      <div class="callout" data-reveal data-reveal-delay="2"><h3 class="h5">Portal support</h3><p>For portal access or fee payment questions, contact Accounts &amp; Finance or the school office.</p></div>
    </div>
  </div>
</section>

{cta_band()}
'''
