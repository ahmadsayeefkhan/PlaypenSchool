# -*- coding: utf-8 -*-
from shell import SITE, ICON_ARROW, ICON_CHECK, cta_band

A = ICON_ARROW

BODY = f'''
<section class="hero">
  <div class="hero-media">
    <img src="assets/img/hero-students-1.jpg" alt="Playpen students at a school event" fetchpriority="high">
    <img src="assets/img/campus-exterior.jpg" alt="The Playpen campus in Bashundhara" loading="lazy">
    <img src="assets/img/slider-8.jpg" alt="Students in a Playpen classroom" loading="lazy">
    <img src="assets/img/middle-senior.jpg" alt="Senior students at Playpen" loading="lazy">
  </div>
  <div class="hero-dots" role="group" aria-label="Hero images"></div>
  <div class="container hero-inner">
    <p class="hero-badge">Playgroup to A Level &middot; Bashundhara, Dhaka</p>
    <h1 class="hero-title">A balanced education, <em>from first steps to A Level.</em></h1>
    <p class="hero-sub">Playpen has taught in Dhaka since 1977. We follow the Cambridge curriculum from the early years right through to Ordinary and Advanced Level &mdash; in small groups, on a purpose-built campus, with teachers who know every child by name.</p>
    <div class="btn-row hero-actions">
      <a class="btn btn--gold" href="admissions.html">Explore admissions {A}</a>
      <a class="btn btn--ghost-light" href="academics.html">The academic journey</a>
    </div>
    <div class="hero-meta">
      <div><strong>1977</strong><span>Founded</span></div>
      <div><strong>PG&ndash;XII</strong><span>Playgroup to Class XII</span></div>
      <div><strong>CAIE</strong><span>Cambridge curriculum</span></div>
      <div><strong>Bashundhara</strong><span>Purpose-built campus</span></div>
    </div>
  </div>
</section>

<!-- ============ WELCOME ============ -->
<section class="section">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">Welcome to Playpen</p>
      <h2 class="h2">&ldquo;We assure you of the best possible care and education for your child.&rdquo;</h2>
      <p class="lead" style="margin-top:1.5rem">That sentence has been on the front of this school for years, and it still sets the standard we work to. Playpen was founded on a simple conviction: to realise their full potential, children need a well-balanced programme in a creative learning environment.</p>
      <p style="margin-top:1rem">Everything that follows &mdash; the Cambridge curriculum, the small teaching groups, the labs and the library, the sports and the science fairs &mdash; exists to serve that conviction. We are not trying to be the loudest school in Dhaka. We are trying to be the one where your child is known, challenged and looked after.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary" href="about.html">Our story since 1977 {A}</a>
        <a class="btn btn--outline" href="leadership.html">Meet the leadership</a>
      </div>
    </div>
    <div class="figure-stack" data-reveal data-reveal-delay="2">
      <div class="figure figure--tall"><img src="assets/img/about-playpen.jpg" alt="Playpen students working together in class" loading="lazy"></div>
      <div class="figure figure--square"><img src="assets/img/admission-2.jpg" alt="A young Playpen pupil writing at her desk with a teacher" loading="lazy"></div>
      <div class="figure figure--square"><img src="assets/img/sports-3.jpg" alt="Playpen students in a mass display at Annual Sports" loading="lazy"></div>
    </div>
  </div>
</section>

<!-- ============ AT A GLANCE ============ -->
<div class="stats">
  <div class="stat" data-reveal><strong><span data-count="48">48</span></strong><span>Years of teaching</span></div>
  <div class="stat" data-reveal data-reveal-delay="1"><strong><span data-count="4">4</span></strong><span>School stages</span></div>
  <div class="stat" data-reveal data-reveal-delay="2"><strong><span data-count="12">12</span></strong><span>O Level subjects offered</span></div>
  <div class="stat" data-reveal data-reveal-delay="3"><strong><span data-count="9">9</span></strong><span>A Level subjects offered</span></div>
</div>

<!-- ============ ACADEMIC JOURNEY ============ -->
<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">The Playpen journey</p>
      <h2 class="h2">Four stages, one continuous education.</h2>
      <p class="lead" style="margin-top:1rem">A child can join Playpen at Playgroup and leave with A Levels &mdash; without ever changing school, curriculum or community. Each stage is designed around what children of that age actually need.</p>
    </div>
    <div class="grid grid-4">
      <a class="stage-card" href="academics.html#elementary" data-reveal>
        <div class="stage-media"><img src="assets/img/values-2.jpg" alt="Early years children on the Playpen playground with their teachers" loading="lazy"></div>
        <div class="stage-overlay">
          <span class="stage-num">Stage 01</span>
          <h3>Elementary</h3>
          <p>Playgroup &ndash; KG II</p>
        </div>
      </a>
      <a class="stage-card" href="academics.html#junior" data-reveal data-reveal-delay="1">
        <div class="stage-media"><img src="assets/img/junior-1.jpg" alt="Junior school pupils singing on stage at Playpen" loading="lazy"></div>
        <div class="stage-overlay">
          <span class="stage-num">Stage 02</span>
          <h3>Junior</h3>
          <p>Class I &ndash; III</p>
        </div>
      </a>
      <a class="stage-card" href="academics.html#middle" data-reveal data-reveal-delay="2">
        <div class="stage-media"><img src="assets/img/eca-4.jpg" alt="Middle school students performing at a Playpen cultural programme" loading="lazy"></div>
        <div class="stage-overlay">
          <span class="stage-num">Stage 03</span>
          <h3>Middle</h3>
          <p>Class IV &ndash; VII</p>
        </div>
      </a>
      <a class="stage-card" href="academics.html#senior" data-reveal data-reveal-delay="3">
        <div class="stage-media"><img src="assets/img/middle-senior.jpg" alt="A Playpen student receiving a certificate at the graduation ceremony" loading="lazy"></div>
        <div class="stage-overlay">
          <span class="stage-num">Stage 04</span>
          <h3>Senior</h3>
          <p>Class VIII &ndash; XII</p>
        </div>
      </a>
    </div>
    <div style="margin-top:2.5rem" data-reveal>
      <a class="link-arrow" href="academics.html">See the full academic programme {A}</a>
    </div>
  </div>
</section>

<!-- ============ WHY PLAYPEN ============ -->
<section class="section section--dark">
  <div class="container">
    <div class="split" style="align-items:start">
      <div class="sticky-col" data-reveal>
        <p class="overline">Why families choose Playpen</p>
        <h2 class="h2">Six things this school is built around.</h2>
        <p class="lead" style="margin-top:1.25rem">No superlatives &mdash; just what we actually do, and what you can come and see for yourself.</p>
        <div class="btn-row" style="margin-top:2rem">
          <a class="btn btn--gold" href="contact.html">Arrange a campus visit {A}</a>
        </div>
      </div>
      <div>
        <div class="feature" data-reveal><span class="feature-num">01</span><h3>One curriculum, all the way through</h3><p>The Cambridge curriculum runs from the Elementary Level right up to Advanced Level, so nothing has to be unlearned when a child moves up a stage.</p></div>
        <div class="feature" data-reveal data-reveal-delay="1"><span class="feature-num">02</span><h3>Small groups and individual attention</h3><p>Junior classes have both a Class Teacher and an Assistant Teacher so that every child gets attention. Senior classes work with Class and Subject Teachers.</p></div>
        <div class="feature" data-reveal data-reveal-delay="2"><span class="feature-num">03</span><h3>A purpose-built campus</h3><p>Ten storeys in Bashundhara, with air-conditioned classrooms, science and IT labs, a library, a multi-purpose hall, a basketball court and a large playground.</p></div>
        <div class="feature" data-reveal data-reveal-delay="3"><span class="feature-num">04</span><h3>Learning without pressure</h3><p>In the Junior School the curriculum is deliberately structured so that children are not put under pressure, and learn at their own pace.</p></div>
        <div class="feature" data-reveal data-reveal-delay="4"><span class="feature-num">05</span><h3>Support that does not stop at academics</h3><p>A designated Student Counsellor for day-to-day concerns, and career guidance from the Senior Vice-Principal and Teacher In-Charge for university applications.</p></div>
        <div class="feature" data-reveal data-reveal-delay="5"><span class="feature-num">06</span><h3>Safety taken seriously</h3><p>Child protection guidance from both local and Cambridge Board standards, CCTV, 24/7 security, fire safety equipment, a sick room and filtered drinking water on every floor.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ CAMPUS ============ -->
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Our campus</p>
      <h2 class="h2">Built for this school, on our own land.</h2>
      <p class="lead" style="margin-top:1rem">Playpen moved to its permanent campus at Bashundhara Residential Area on 19 July 2018 &mdash; a building designed for the school by architect Mr. Ehsan Khan, not an apartment block converted into classrooms.</p>
    </div>
    <div class="figure figure--wide" data-reveal><img src="assets/img/campus-exterior.jpg" alt="The Playpen campus building in Bashundhara Residential Area" loading="lazy"></div>
    <div class="grid grid-4" style="margin-top:2.5rem">
      <div data-reveal><h3 class="h5">Learning spaces</h3><p class="small muted">Air-conditioned classrooms, a students&rsquo; gallery and hall room, and collaborative areas across ten floors.</p></div>
      <div data-reveal data-reveal-delay="1"><h3 class="h5">Science &amp; IT</h3><p class="small muted">Physics, Chemistry, Biology and Computer Science laboratories endorsed by Cambridge and the British Council.</p></div>
      <div data-reveal data-reveal-delay="2"><h3 class="h5">Sport &amp; recreation</h3><p class="small muted">A large playground, a basketball court, indoor games and ECA rooms for clubs and activities.</p></div>
      <div data-reveal data-reveal-delay="3"><h3 class="h5">Care &amp; safety</h3><p class="small muted">Sick room, cafeteria, CCTV monitoring, PABX, fire safety equipment, generator backup and 24/7 security.</p></div>
    </div>
    <div style="margin-top:2.5rem" data-reveal><a class="link-arrow" href="campus.html">Explore the campus in full {A}</a></div>
  </div>
</section>

<!-- ============ SENIOR PATHWAY ============ -->
<section class="section section--sand">
  <div class="container split split--wide-right">
    <div class="figure figure--tall" data-reveal><img src="assets/img/examination-2.jpg" alt="Senior students preparing for Cambridge examinations" loading="lazy"></div>
    <div data-reveal data-reveal-delay="1">
      <p class="overline">Senior School &middot; Class VIII&ndash;XII</p>
      <h2 class="h2">From the classroom to O Level and A Level.</h2>
      <p class="lead" style="margin-top:1.25rem">In the Senior School we prepare students for CAIE examinations at Ordinary, Advanced Subsidiary and Advanced Level &mdash; international qualifications recognised by the world&rsquo;s best universities and employers.</p>
      <p style="margin-top:1rem">Our aim in the senior segment is to balance knowledge, understanding and skills, so that students leave with an informed curiosity and a lasting passion for learning &mdash; not just a transcript.</p>
      <div class="grid grid-2" style="margin-top:2rem;gap:1.5rem">
        <div>
          <h3 class="h5">O Level</h3>
          <p class="small muted">Subjects chosen at the end of Class VIII, second semester. Minimum six subjects. English Language, Bengali and Mathematics (Syllabus D) are compulsory.</p>
        </div>
        <div>
          <h3 class="h5">A Level</h3>
          <p class="small muted">Minimum three subjects from nine offered, across sciences, commerce and computing. Introduced at Playpen in 2013.</p>
        </div>
      </div>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary" href="academics.html#senior">Explore the senior programme {A}</a>
        <a class="btn btn--outline" href="academics.html#subjects">View all subjects</a>
      </div>
    </div>
  </div>
</section>

<!-- ============ STUDENT LIFE ============ -->
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Student life</p>
      <h2 class="h2">Believing that academic excellence alone does not guarantee a sound education.</h2>
      <p class="lead" style="margin-top:1rem">The school year at Playpen carries as much outside the timetable as inside it &mdash; sport, performance, competition and service.</p>
    </div>
    <div class="grid grid-4">
      <a class="card" href="student-life.html#sports" data-reveal>
        <div class="card-media"><img src="assets/img/sports-4.jpg" alt="Playpen students competing in athletics" loading="lazy"></div>
        <div class="card-body"><span class="card-kicker">Sport</span><h3 class="h5">Games &amp; Athletics</h3><p>Football, basketball, handball, athletics, table tennis, chess and carom, with inter-school and inter-class tournaments.</p><span class="link-arrow">Explore {A}</span></div>
      </a>
      <a class="card" href="student-life.html#arts" data-reveal data-reveal-delay="1">
        <div class="card-media"><img src="assets/img/slider-8.jpg" alt="Playpen students performing a classical dance" loading="lazy"></div>
        <div class="card-body"><span class="card-kicker">Creative</span><h3 class="h5">Arts, Music &amp; Drama</h3><p>Art and craft, instrumental and vocal music, dance and drama, culminating in the Annual Cultural Programme.</p><span class="link-arrow">Explore {A}</span></div>
      </a>
      <a class="card" href="student-life.html#clubs" data-reveal data-reveal-delay="2">
        <div class="card-media"><img src="assets/img/hero-students-2.jpg" alt="A NASA astronaut speaking to Playpen students" loading="lazy"></div>
        <div class="card-body"><span class="card-kicker">Competition</span><h3 class="h5">Clubs &amp; Olympiads</h3><p>Debate, Spelling Bee, language, science and mathematics Olympiads, and the Duke of Edinburgh&rsquo;s Award Programme.</p><span class="link-arrow">Explore {A}</span></div>
      </a>
      <a class="card" href="student-life.html#service" data-reveal data-reveal-delay="3">
        <div class="card-media"><img src="assets/img/community-2.jpg" alt="Playpen students helping to build homes for low-income families" loading="lazy"></div>
        <div class="card-body"><span class="card-kicker">Service</span><h3 class="h5">Community Service</h3><p>Winter clothing drives, volunteering with social organisations, and building small homes for low-income families.</p><span class="link-arrow">Explore {A}</span></div>
      </a>
    </div>
  </div>
</section>

<!-- ============ ACHIEVEMENTS ============ -->
<section class="section section--deep">
  <div class="container">
    <div class="split" style="align-items:end;margin-bottom:3rem">
      <div data-reveal>
        <p class="overline">Recent achievements</p>
        <h2 class="h2">What our students have been winning.</h2>
      </div>
      <div style="justify-self:end" data-reveal data-reveal-delay="1"><a class="btn btn--ghost-light" href="achievements.html">View the full record {A}</a></div>
    </div>
    <div class="grid grid-3">
      <div data-reveal>
        <div class="feature" style="border-top-color:rgba(255,255,255,.2)">
          <span class="feature-num">2024</span>
          <h3>1st Space Exploration Olympiad</h3>
          <p>Quazi Jorjis Nivaan and Adyan Omair Islam both took 2nd runner-up at the Bangladesh Innovation Forum event held at AIUB.</p>
        </div>
        <div class="feature" style="border-top-color:rgba(255,255,255,.2)">
          <span class="feature-num">2024</span>
          <h3>13th Bangla Olympiad</h3>
          <p>Fahmiah Fahreen of Class VII took 1st position in Essay Writing; the group dance team also placed first.</p>
        </div>
      </div>
      <div data-reveal data-reveal-delay="1">
        <div class="feature" style="border-top-color:rgba(255,255,255,.2)">
          <span class="feature-num">2024</span>
          <h3>Math and Tech Fest</h3>
          <p>Class VIII students took 1st position in Crypto Craft Chronicles. Mujtoba Siraj won the Rube Goldberg competition and the campus ambassador award.</p>
        </div>
        <div class="feature" style="border-top-color:rgba(255,255,255,.2)">
          <span class="feature-num">2024</span>
          <h3>National Abacus &amp; Mental Arithmetic</h3>
          <p>Sameeha Binte Firoz secured third runner-up at the 16th national competition.</p>
        </div>
      </div>
      <div data-reveal data-reveal-delay="2">
        <div class="feature" style="border-top-color:rgba(255,255,255,.2)">
          <span class="feature-num">2024</span>
          <h3>Inter-School Football</h3>
          <p>Best Player and Best Defender awards at the Scholastica Inter School tournament; runners-up at Hurdco Inter School.</p>
        </div>
        <div class="feature" style="border-top-color:rgba(255,255,255,.2)">
          <span class="feature-num">2023</span>
          <h3>Eco-Schools Programme</h3>
          <p>Three Class IX students earned 1st Runner Up for Best Presentation in the national Eco-Schools Programme.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ NOTICES & EVENTS ============ -->
<section class="section">
  <div class="container">
    <div class="split" style="align-items:start;gap:4rem">
      <div data-reveal>
        <p class="overline">Notices</p>
        <h2 class="h3" style="margin-bottom:2rem">Current announcements</h2>
        <div class="notice-list">
          <a class="notice-item" href="news.html#notices">
            <span class="notice-date">Nov 2025</span>
            <div><h4 class="h5">First Semester Examination</h4><p>Examinations run from 30 November to 11 December 2025. PG to KG&ndash;II continue regular classes until 8 December.</p></div>
            <span class="notice-tag notice-tag--exam">Examination</span>
          </a>
          <a class="notice-item" href="news.html#notices">
            <span class="notice-date">Standing</span>
            <div><h4 class="h5">About Mobile Phones</h4><p>Students are not to bring mobile phones to school. Bags are searched on entry. Urgent calls can be made from the Admin Office on Level 2.</p></div>
            <span class="notice-tag">Policy</span>
          </a>
          <a class="notice-item" href="admissions.html">
            <span class="notice-date">2026&ndash;27</span>
            <div><h4 class="h5">A Level Admission Open</h4><p>Playpen is offering admission for the academic year July 2026 &ndash; June 2027 for A Level. Forms are available at the admin office and on this website.</p></div>
            <span class="notice-tag notice-tag--event">Admissions</span>
          </a>
        </div>
        <div style="margin-top:2rem"><a class="link-arrow" href="news.html#notices">All notices {A}</a></div>
      </div>
      <div data-reveal data-reveal-delay="2">
        <p class="overline">Upcoming</p>
        <h2 class="h3" style="margin-bottom:2rem">School calendar</h2>
        <div style="display:grid;gap:1.25rem">
          <div style="display:flex;gap:1.25rem;align-items:flex-start">
            <div class="date-chip"><strong>26</strong><span>Sep</span></div>
            <div><h4 class="h5">Parents&ndash;Teachers Meeting 1</h4><p class="small muted" style="margin-top:.35em">The first parent&ndash;teacher meeting of the academic year. Class-wise timings are issued through the portal.</p></div>
          </div>
        </div>
        <div class="callout" style="margin-top:2rem">
          <h4 class="h5">Parent &amp; Student Portal</h4>
          <p>Academic performance, class tests, homework, report cards, attendance, the academic calendar and online fee payment &mdash; all in one place.</p>
          <div class="btn-row" style="margin-top:1.25rem">
            <a class="btn btn--primary btn--sm" href="{SITE["portal"]}" rel="noopener">Open the portal {A}</a>
            <a class="btn btn--outline btn--sm" href="parents.html">For parents</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ ALUMNI ============ -->
<section class="section section--sand">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">Alumni</p>
      <h2 class="h2">Once a Playpen student, always part of the community.</h2>
      <p class="lead" style="margin-top:1.25rem">Playpen wishes to connect with students who have excelled in their respective fields &mdash; to build a platform where former students can find their classmates again, share what they remember, and tell us where their education took them.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary" href="alumni.html">Join the alumni network {A}</a>
        <a class="btn btn--outline" href="mailto:{SITE["email_alumni"]}">{SITE["email_alumni"]}</a>
      </div>
    </div>
    <div class="figure figure--wide" data-reveal data-reveal-delay="2"><img src="assets/img/hero-48-years.jpg" alt="Playpen alumni and students" loading="lazy"></div>
  </div>
</section>

<!-- ============ VISIT ============ -->
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Visit Playpen</p>
      <h2 class="h2">Come and see us in Bashundhara.</h2>
      <p class="lead" style="margin-top:1rem">The Admissions Office is open {SITE["office_hours"]}. You are welcome to visit, collect a form, and look around the campus.</p>
    </div>
    <div class="split">
      <div class="map-frame" data-reveal>
        <iframe src="{SITE["map_embed"]}" title="Map showing Playpen School in Bashundhara Residential Area, Dhaka" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </div>
      <div data-reveal data-reveal-delay="1">
        <div class="contact-card">
          <h3>Admissions &amp; general enquiries</h3>
          <div class="contact-line">{ICON_CHECK}<div><strong>PG &ndash; Class I</strong><br><a href="tel:+8801755689482">01755 689 482</a> &middot; <a href="mailto:admission1@playpen.edu.bd">admission1@playpen.edu.bd</a></div></div>
          <div class="contact-line">{ICON_CHECK}<div><strong>Class II &ndash; VI</strong><br><a href="tel:+8801755515893">01755 515 893</a> &middot; <a href="mailto:admission2@playpen.edu.bd">admission2@playpen.edu.bd</a></div></div>
          <div class="contact-line">{ICON_CHECK}<div><strong>Class VII &ndash; XII</strong><br><a href="tel:+8801755693623">01755 693 623</a> &middot; <a href="mailto:admission3@playpen.edu.bd">admission3@playpen.edu.bd</a></div></div>
          <hr style="margin:1.5rem 0">
          <p class="small muted" style="margin:0">{SITE["address_line1"]}<br>{SITE["address_line2"]}</p>
          <div class="btn-row" style="margin-top:1.5rem">
            <a class="btn btn--primary btn--sm" href="contact.html">All contact details {A}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{cta_band()}
'''
