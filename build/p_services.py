# -*- coding: utf-8 -*-
from shell import SITE, ICON_ARROW, ICON_CHECK, cta_band, page_hero

A = ICON_ARROW

# ============================================================ CAMPUS SERVICES
SERVICES = page_hero(
    [("Campus &amp; Services", None)],
    "Everything that supports a school day.",
    "Health, transport, the bookshop, online services, safeguarding and the policies that keep the school running.",
    "health-center.jpg", "A Playpen teacher giving first aid to a student"
) + f'''
<section class="section section--tight">
  <div class="container">
    <div class="grid grid-4" data-reveal>
      <a class="callout" href="#health"><h3 class="h5">Health Centre {A}</h3><p>Care during school hours.</p></a>
      <a class="callout" href="#transport"><h3 class="h5">Transport {A}</h3><p>School bus since 2014.</p></a>
      <a class="callout" href="#bookshop"><h3 class="h5">Bookshop {A}</h3><p>Books and exercise copies.</p></a>
      <a class="callout" href="#online"><h3 class="h5">Online services {A}</h3><p>Portal and fee payment.</p></a>
    </div>
  </div>
</section>

<!-- ============ HEALTH ============ -->
<section class="section" id="health">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">Health Centre</p>
      <h2 class="h2">Looking after the health of students.</h2>
      <p class="lead" style="margin-top:1.25rem">The school always looks after the health of its students. A health care facility on campus handles minor health-related issues during the school day.</p>
      <p style="margin-top:1rem">Serious cases are handed over to parents, so that the family can make the decision about treatment. The campus also has a dedicated sick room, fresh water filtration with mineral water on every floor, and fire safety equipment throughout the building.</p>
      <div class="callout callout--crimson" style="margin-top:2rem">
        <p class="small"><strong>Please keep contact details current.</strong> Parents must promptly inform teachers and office staff of changes to address, phone numbers, email addresses and emergency contacts, by written application or through the school email.</p>
      </div>
    </div>
    <div class="figure figure--wide" data-reveal data-reveal-delay="2"><img src="assets/img/health-center.jpg" alt="A Playpen teacher attending to a student on the school field" loading="lazy"></div>
  </div>
</section>

<!-- ============ TRANSPORT ============ -->
<section class="section section--sand" id="transport">
  <div class="container">
    <div class="split split--wide-right" style="align-items:start">
      <div class="figure figure--wide" data-reveal><img src="assets/img/community-1.jpg" alt="Playpen students beside a school bus" loading="lazy"></div>
      <div data-reveal data-reveal-delay="1">
        <p class="overline">School transport</p>
        <h2 class="h2">Our own bus service since March 2014.</h2>
        <p class="lead" style="margin-top:1.25rem">The school has maintained its own bus service since March 2014, prioritising student safety and welfare above everything else.</p>
        <p style="margin-top:1rem">Parents seeking bus service submit an application at the Administrative Office. Routes and availability are confirmed by the office at the time of application.</p>
        <h3 class="h5" style="margin-top:2rem">Student guidelines on the bus</h3>
        <div style="display:grid;gap:.5rem;margin-top:1rem">
          <div class="contact-line">{ICON_CHECK}<div>Listen to and respect teacher instructions</div></div>
          <div class="contact-line">{ICON_CHECK}<div>Speak quietly</div></div>
          <div class="contact-line">{ICON_CHECK}<div>No eating or drinking on board</div></div>
          <div class="contact-line">{ICON_CHECK}<div>Keep hands inside the bus</div></div>
          <div class="contact-line">{ICON_CHECK}<div>Use appropriate language</div></div>
        </div>
      </div>
    </div>
    <div class="callout" style="margin-top:3rem" data-reveal>
      <h3 class="h5">Arrival and departure</h3>
      <p style="margin-top:.75rem">Students should carry their own bags rather than putting them in the luggage compartment &mdash; it reduces congestion and tardiness at the gate. Drivers are asked to observe the school traffic rules, avoid using the horn, and reduce speed near the premises.</p>
    </div>
  </div>
</section>

<!-- ============ BOOKSHOP ============ -->
<section class="section" id="bookshop">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">The school bookshop</p>
      <h2 class="h2">Books, copies and supplies on campus.</h2>
      <p class="lead" style="margin-top:1.25rem">Students can buy books and exercise copies from the school&rsquo;s own bookshop, which sits alongside the modernised library.</p>
      <p style="margin-top:1rem">Parents collect the yearly books and copies at the beginning of every session. The bookshop is open from <strong>8:30 AM until 1:00 PM</strong>.</p>
      <p style="margin-top:1rem">Sportswear must also be bought from the school. Students wear the games uniform on the days they have Games classes, according to the routine.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary" href="admissions.html#uniform">Uniform guide {A}</a>
        <a class="btn btn--outline" href="academics.html#facilities">The library</a>
      </div>
    </div>
    <div class="figure figure--wide" data-reveal data-reveal-delay="2"><img src="assets/img/about-playpen.jpg" alt="The Playpen campus building" loading="lazy"></div>
  </div>
</section>

<!-- ============ ONLINE ============ -->
<section class="section section--dark" id="online">
  <div class="container">
    <div class="split" style="align-items:start">
      <div data-reveal>
        <p class="overline">Online services &amp; payment</p>
        <h2 class="h2">The Parent &amp; Student Portal.</h2>
        <p class="lead" style="margin-top:1.25rem">The school runs a website and management system giving parents access to their child&rsquo;s data &mdash; not just at report time, but as the year goes on.</p>
        <ul class="chips" style="margin-top:1.5rem">
          <li>Academic performance</li><li>Class tests</li><li>Class work markings</li><li>Homework</li>
          <li>Report cards</li><li>Attendance</li><li>Punctuality</li><li>Disciplinary issues</li><li>Academic calendar</li>
        </ul>
        <div class="btn-row" style="margin-top:2rem">
          <a class="btn btn--gold" href="{SITE["portal"]}" rel="noopener">Open the portal {A}</a>
          <a class="btn btn--ghost-light" href="parents.html">For parents hub</a>
        </div>
      </div>
      <div data-reveal data-reveal-delay="1">
        <h3 class="h3" style="margin-bottom:1rem">Fee payment</h3>
        <p style="color:rgba(251,247,240,.78)">Digital fee payment became mandatory from the 2021&ndash;2022 academic year. Tuition can be paid through several channels:</p>
        <ul class="chips" style="margin-top:1.5rem">
          <li>EBL &mdash; Visa / Mastercard</li><li>DBBL</li><li>Nagad</li><li>bKash</li><li>Rocket</li><li>Upay</li><li>Epay</li>
        </ul>
        <div class="callout" style="background:rgba(255,255,255,.06);border-left-color:var(--gold);margin-top:2rem">
          <p style="color:rgba(251,247,240,.85)">Admission payments are made online through a school-authorised bank. For any question about fees or receipts, contact Accounts &amp; Finance on <a href="tel:+8801313025955" style="color:var(--gold)">01313 025 955</a> or <a href="mailto:accounts@playpen.edu.bd" style="color:var(--gold)">accounts@playpen.edu.bd</a>.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ SAFEGUARDING ============ -->
<section class="section" id="safeguarding">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Child protection &amp; safety</p>
      <h2 class="h2">Safeguarding at Playpen.</h2>
      <p class="lead" style="margin-top:1rem">Playpen adheres to local and Cambridge Board guidelines for child protection in all areas of imparting education, and in ensuring all manners of safety, security, health and hygiene.</p>
    </div>
    <div class="grid grid-3">
      <div class="callout" data-reveal><h3 class="h5">Physical security</h3><p>CCTV monitoring across the campus, 24/7 security personnel, and a PABX system connecting offices and floors.</p></div>
      <div class="callout" data-reveal data-reveal-delay="1"><h3 class="h5">Fire &amp; emergency</h3><p>Fire safety equipment installed throughout the building, with generator support so classes stay comfortable through power failures.</p></div>
      <div class="callout" data-reveal data-reveal-delay="2"><h3 class="h5">Health &amp; hygiene</h3><p>A health care facility and sick room, fresh water filtration with mineral water on every floor, and separate boys&rsquo; and girls&rsquo; restrooms per floor.</p></div>
      <div class="callout" data-reveal><h3 class="h5">Identity cards</h3><p>Every student receives an ID card on admission and must wear it daily on school premises. Lost or damaged cards require replacement.</p></div>
      <div class="callout" data-reveal data-reveal-delay="1"><h3 class="h5">Pastoral support</h3><p>A designated Student Counsellor is always on standby for academic concerns, non-academic issues and behavioural matters flagged by teachers.</p></div>
      <div class="callout" data-reveal data-reveal-delay="2"><h3 class="h5">Traffic &amp; the gate</h3><p>Drivers observe school traffic rules, avoid horn use and reduce speed near the premises. Students carry their own bags to reduce congestion.</p></div>
    </div>
    <div class="callout callout--crimson" style="margin-top:2.5rem" data-reveal>
      <h3 class="h5">Raising a concern</h3>
      <p style="margin-top:.75rem">Any concern about a child&rsquo;s safety or wellbeing should be raised with the Class Teacher, the relevant Teacher-In-Charge, or the school office directly on <a href="tel:{SITE["phone_general_href"]}">{SITE["phone_general"]}</a>. The full Child Protection Policy is available from the school office.</p>
    </div>
  </div>
</section>

<!-- ============ POLICIES ============ -->
<section class="section section--sand" id="policies">
  <div class="container container--narrow">
    <div class="section-head" data-reveal>
      <p class="overline">Policies</p>
      <h2 class="h2">Code of conduct and school rules.</h2>
      <p class="lead" style="margin-top:1rem">The rules that apply during school hours, summarised. The school office holds the full policy documents.</p>
    </div>
    <div class="accordion" data-accordion-single data-reveal>
      <details><summary>Discipline and misconduct</summary><div class="accordion-body">
        <p>Any act of misconduct, untoward incident or indecent behaviour will lead to suspension or expulsion, depending on the seriousness of the offence.</p>
        <p>Physical violence or abusive language results in immediate expulsion. Three suspensions within one academic year automatically triggers dismissal. The school reserves the right to expel students in exceptional circumstances regardless of suspension history.</p>
        <p>A Disciplinary Committee of administrators and faculty members oversees behavioural matters occurring during school hours and implements appropriate responses. The school calls on families to reinforce adherence to school regulations with their children.</p>
      </div></details>
      <details><summary>Mobile phones and prohibited items</summary><div class="accordion-body">
        <p>Students are not to bring mobile phones to school. Bags are searched at the time of entry in the morning. Students who need to contact a parent urgently may use the Admin Office on Level 2 to make a call.</p>
        <p>Electronic devices and entertainment media cannot be brought onto campus &mdash; this includes mobile phones, toys, magazines, MP3 players, iPads, cameras and CDs. Confiscated items are returned at the end of the academic year.</p>
      </div></details>
      <details><summary>Attendance and absence</summary><div class="accordion-body">
        <p>Absences exceeding three days require a written explanation from the parent. For consecutive absences beyond three days, both a medical certificate and a parent letter are mandatory.</p>
        <p>Extended illness or absence requires written notification to the school office.</p>
      </div></details>
      <details><summary>Examination rules and promotion</summary><div class="accordion-body">
        <p>The school academic year is divided into two semesters, with a formal written examination at the end of each. Students in the Junior and Senior sections must attain certain passing marks in the core subjects to be considered for promotion to the next class.</p>
      </div></details>
      <details><summary>The identity card</summary><div class="accordion-body">
        <p>Every student receives an ID card after admission at Playpen. Students must wear it daily on school premises. Lost or damaged cards require replacement through the school office.</p>
      </div></details>
      <details><summary>Library borrowing</summary><div class="accordion-body">
        <p>The Librarian notifies parents through the Class Teacher when a child has not returned a borrowed book. If a student cannot return a book after a set period, it becomes the parent&rsquo;s responsibility to buy a similar copy to replace it, or to pay its cost.</p>
      </div></details>
      <details><summary>Keeping records up to date</summary><div class="accordion-body">
        <p>Parents must promptly inform teachers and office staff of any change to address, phone numbers, email addresses and emergency contacts, through written application or through the school email.</p>
      </div></details>
      <details><summary>Child protection</summary><div class="accordion-body">
        <p>Playpen adheres to local and Cambridge Board guidelines for child protection in all areas of imparting education, and in ensuring all manners of safety, security, health and hygiene. See the <a href="#safeguarding">safeguarding section</a> above.</p>
      </div></details>
    </div>
    <div class="callout" style="margin-top:2.5rem" data-reveal>
      <p class="small">These summaries are provided for convenience. The school&rsquo;s formal policy documents are the authoritative versions and are available from the school office on request.</p>
    </div>
  </div>
</section>

{cta_band()}
'''

# =================================================================== PARENTS
PARENTS = page_hero(
    [("For Parents", None)],
    "Everything you need, in one place.",
    "Portal access, fee payment, notices, the calendar, transport, uniform and downloads &mdash; without hunting through the site.",
    "admission-1.jpg", "The Playpen campus and school field"
) + f'''
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Quick links</p>
      <h2 class="h2">The things parents need most.</h2>
    </div>
    <div class="grid grid-4">
      <a class="card" href="{SITE["portal"]}" rel="noopener" data-reveal><div class="card-body"><span class="card-kicker">Daily</span><h3 class="h5">Parent &amp; Student Portal</h3><p>Academic performance, class tests, homework, report cards, attendance and punctuality.</p><span class="link-arrow">Open portal {A}</span></div></a>
      <a class="card" href="{SITE["portal"]}" rel="noopener" data-reveal data-reveal-delay="1"><div class="card-body"><span class="card-kicker">Finance</span><h3 class="h5">Pay School Fees</h3><p>EBL, DBBL, Nagad, bKash, Rocket, Upay and Epay. Digital payment has been mandatory since 2021&ndash;22.</p><span class="link-arrow">Pay online {A}</span></div></a>
      <a class="card" href="news.html#notices" data-reveal data-reveal-delay="2"><div class="card-body"><span class="card-kicker">Updates</span><h3 class="h5">Notices</h3><p>Examination schedules, policy reminders, closures and class instructions.</p><span class="link-arrow">View notices {A}</span></div></a>
      <a class="card" href="#calendar" data-reveal data-reveal-delay="3"><div class="card-body"><span class="card-kicker">Planning</span><h3 class="h5">Academic Calendar</h3><p>Semester dates, examinations, meetings and school events.</p><span class="link-arrow">View calendar {A}</span></div></a>
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="split" style="align-items:start">
      <div data-reveal>
        <p class="overline">Before joining</p>
        <h2 class="h3" style="margin-bottom:1.5rem">If you are still deciding</h2>
        <ul class="footer-links" style="gap:.9rem">
          <li><a class="link-arrow" href="admissions.html">Admissions overview {A}</a></li>
          <li><a class="link-arrow" href="admissions.html#process">The admission process {A}</a></li>
          <li><a class="link-arrow" href="admissions.html#documents">Required documents {A}</a></li>
          <li><a class="link-arrow" href="admissions.html#forms">Download admission forms {A}</a></li>
          <li><a class="link-arrow" href="academics.html">The academic programme {A}</a></li>
          <li><a class="link-arrow" href="campus.html">Campus and facilities {A}</a></li>
          <li><a class="link-arrow" href="admissions.html#uniform">Uniform guide {A}</a></li>
          <li><a class="link-arrow" href="admissions.html#faq">Admissions FAQ {A}</a></li>
        </ul>
      </div>
      <div data-reveal data-reveal-delay="1">
        <p class="overline">After joining</p>
        <h2 class="h3" style="margin-bottom:1.5rem">If your child is already here</h2>
        <ul class="footer-links" style="gap:.9rem">
          <li><a class="link-arrow" href="{SITE["portal"]}" rel="noopener">Parent &amp; Student Portal {A}</a></li>
          <li><a class="link-arrow" href="campus-services.html#online">Online fee payment {A}</a></li>
          <li><a class="link-arrow" href="news.html#notices">Notices and announcements {A}</a></li>
          <li><a class="link-arrow" href="academics.html#examinations">Assessment and examinations {A}</a></li>
          <li><a class="link-arrow" href="academics.html#support">Student support and counselling {A}</a></li>
          <li><a class="link-arrow" href="campus-services.html#transport">School transport {A}</a></li>
          <li><a class="link-arrow" href="campus-services.html#bookshop">School bookshop {A}</a></li>
          <li><a class="link-arrow" href="campus-services.html#policies">Code of conduct {A}</a></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section" id="calendar">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Academic calendar</p>
      <h2 class="h2">How the year is structured.</h2>
      <p class="lead" style="margin-top:1rem">The academic year is divided into two semesters, each ending with a formal written examination. Detailed class-wise dates are published through the portal.</p>
    </div>
    <div class="table-wrap" data-reveal>
      <table class="data">
        <thead><tr><th>Period</th><th>What happens</th><th>Who it affects</th></tr></thead>
        <tbody>
          <tr><td><strong>Semester 1</strong></td><td>Teaching, class tests, class work markings and homework, tracked through the portal.</td><td>All classes</td></tr>
          <tr><td><strong>End of Semester 1</strong></td><td>Formal written examination. Progress Reports issued afterwards.</td><td>All classes</td></tr>
          <tr><td><strong>Semester 2</strong></td><td>Teaching continues. Class VIII students select O Level elective subjects at the end of this semester.</td><td>All classes</td></tr>
          <tr><td><strong>End of Semester 2</strong></td><td>Formal written examination. Promotion decisions for Junior and Senior sections.</td><td>All classes</td></tr>
          <tr><td><strong>Through the year</strong></td><td>Parents&ndash;Teachers Meetings, Annual Sports, Science Fair, Annual Cultural Programme, national day functions and graduation.</td><td>All classes</td></tr>
        </tbody>
      </table>
    </div>
    <p class="small muted" style="margin-top:1rem" data-reveal>Exact dates for each academic year are published on the portal and through notices. Check the <a href="news.html#notices">notices page</a> for current announcements.</p>
  </div>
</section>

<section class="section section--dark" id="downloads">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Downloads</p>
      <h2 class="h2">Forms and documents.</h2>
    </div>
    <div class="grid grid-3">
      <div class="callout" style="background:rgba(255,255,255,.06);border-left-color:var(--gold)" data-reveal>
        <h3 class="h5" style="color:#fff">Admission Form &mdash; PG to Class IX</h3>
        <p style="color:rgba(251,247,240,.75)">PDF. Covers Playgroup through Class IX.</p>
        <div class="btn-row" style="margin-top:1.25rem"><a class="btn btn--gold btn--sm" href="{SITE["form_pg9"]}" rel="noopener">Download {A}</a></div>
      </div>
      <div class="callout" style="background:rgba(255,255,255,.06);border-left-color:var(--gold)" data-reveal data-reveal-delay="1">
        <h3 class="h5" style="color:#fff">A Level Admission Form</h3>
        <p style="color:rgba(251,247,240,.75)">PDF. For entry into Class XI (AS Level).</p>
        <div class="btn-row" style="margin-top:1.25rem"><a class="btn btn--gold btn--sm" href="{SITE["form_alevel"]}" rel="noopener">Download {A}</a></div>
      </div>
      <div class="callout" style="background:rgba(255,255,255,.06);border-left-color:var(--gold)" data-reveal data-reveal-delay="2">
        <h3 class="h5" style="color:#fff">Policies &amp; handbooks</h3>
        <p style="color:rgba(251,247,240,.75)">The Child Protection Policy and Code of Conduct are available from the school office. Summaries are published on this site.</p>
        <div class="btn-row" style="margin-top:1.25rem"><a class="btn btn--ghost-light btn--sm" href="campus-services.html#policies">Read summaries {A}</a></div>
      </div>
    </div>
  </div>
</section>

{cta_band()}
'''
