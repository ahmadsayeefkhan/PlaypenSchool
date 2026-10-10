# -*- coding: utf-8 -*-
from shell import SITE, ICON_ARROW, ICON_CHECK, cta_band, page_hero

A = ICON_ARROW

# ===================================================================== ABOUT
ABOUT = page_hero(
    [("About", None)],
    "Since 1977, a school built around one idea.",
    "To realise their full potential, children need a well-balanced programme in a creative learning environment. Playpen was born with this in mind.",
    "about-history.jpg", "Playpen students through the years"
) + f'''
<section class="section">
  <div class="container split split--wide-left">
    <div class="prose" data-reveal>
      <p class="overline">Our story</p>
      <h2 class="h2">From a kindergarten to a Cambridge school.</h2>
      <p class="lead" style="margin-top:1.25rem">Playpen began in 1977, founded by the educationalist Mrs. Zeba Khan. It started small &mdash; a kindergarten &mdash; and grew, one stage at a time, as its first families asked for the next year and then the one after that.</p>
      <p>Primary classes followed. Then secondary. In 2003 Playpen sent its first candidate to sit the Ordinary Level Examination; that student achieved top marks across seven subjects. Advanced Level instruction began in 2013.</p>
      <p>Chairman Mr. A Mannan Khan oversaw the construction of a permanent campus, designed by the architect Mr. Ehsan Khan. On 19 July 2018, Principal Mrs. Sorabon Tohura moved the school into its own building in Bashundhara Residential Area &mdash; where it teaches today, from Play Group to Class XII.</p>
    </div>
    <div class="figure figure--tall" data-reveal data-reveal-delay="2"><img src="assets/img/our-history.jpg" alt="Playpen School through its history" loading="lazy"></div>
  </div>
</section>

<section class="section section--dark">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Milestones</p>
      <h2 class="h2">A timeline of the school.</h2>
    </div>
    <div class="split" style="align-items:start">
      <div class="timeline" data-reveal>
        <div class="timeline-item"><span class="timeline-year">1977</span><p>Playpen is established by the educationalist Mrs. Zeba Khan, operating as a kindergarten.</p></div>
        <div class="timeline-item"><span class="timeline-year">1998</span><p>The school expands into primary classes, and later adds secondary levels.</p></div>
        <div class="timeline-item"><span class="timeline-year">2003</span><p>Playpen&rsquo;s first Ordinary Level candidate sits the examination and achieves top marks across seven subjects.</p></div>
      </div>
      <div class="timeline" data-reveal data-reveal-delay="1">
        <div class="timeline-item"><span class="timeline-year">2013</span><p>Advanced Level classes are introduced, completing the Playgroup-to-A-Level pathway.</p></div>
        <div class="timeline-item"><span class="timeline-year">2014</span><p>The school begins operating its own bus service, in March, prioritising student safety and welfare.</p></div>
        <div class="timeline-item"><span class="timeline-year">2018</span><p>On 19 July, Playpen moves into its purpose-built permanent campus in Bashundhara Residential Area.</p></div>
        <div class="timeline-item"><span class="timeline-year">Today</span><p>Phase 2 of the building is in progress: additional laboratories, an expanded cafeteria, an advanced library and more recreational facilities.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="values">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Mission, vision and values</p>
      <h2 class="h2">What we are trying to build.</h2>
    </div>
    <div class="grid grid-3" style="margin-bottom:3.5rem">
      <div class="callout" data-reveal>
        <h3 class="h4">Our vision</h3>
        <p>That every child reaches their full potential &mdash; which requires a well-balanced programme delivered in a creative and appropriate environment that genuinely fosters learning.</p>
      </div>
      <div class="callout" data-reveal data-reveal-delay="1">
        <h3 class="h4">Our mission</h3>
        <p>To give students a grounding in history and culture, real proficiency in language, and a practical education they can apply to daily life &mdash; not knowledge that stops at the exam hall.</p>
      </div>
      <div class="callout" data-reveal data-reveal-delay="2">
        <h3 class="h4">Our conviction</h3>
        <p>Children learn best when they are happy and confident, and when learning is not driven by fear, anxiety or stress. Playpen was born with this in mind.</p>
      </div>
    </div>

    <div class="split split--wide-right" style="align-items:start">
      <div class="figure figure--tall" data-reveal><img src="assets/img/values-1.jpg" alt="Playpen’s youngest pupils on the playground with their teacher" loading="lazy"></div>
      <div data-reveal data-reveal-delay="1">
        <h3 class="h3" style="margin-bottom:1.5rem">Our institutional goals</h3>
        <div class="steps">
          <div class="step"><div><h3 class="h5">Global citizens of the 21st century</h3><p>Developing the skills our students need, and preparing them to meet the challenges of becoming global citizens.</p></div></div>
          <div class="step"><div><h3 class="h5">Human rights and democracy</h3><p>Nursing our students to be acquainted with human rights and to hold a sound knowledge of democracy.</p></div></div>
          <div class="step"><div><h3 class="h5">Economic participation</h3><p>Enabling our students to advance towards the future and to take part in economic activity successfully.</p></div></div>
          <div class="step"><div><h3 class="h5">A logical and analytical society</h3><p>Educating our students to establish and be part of a society that reasons and analyses.</p></div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container container--narrow center">
    <div class="quote" style="border-left:0;padding-left:0" data-reveal>
      <blockquote>&ldquo;To realize the full potential, children need to be given a well-balanced programme in a creative learning environment. Playpen was born with this in mind.&rdquo;</blockquote>
      <cite>The founding idea<span>Carried forward since 1977</span></cite>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head" data-reveal><p class="overline">Explore further</p><h2 class="h3">More about the school</h2></div>
    <div class="grid grid-3">
      <a class="card" href="leadership.html" data-reveal><div class="card-media"><img src="assets/img/leadership.jpg" alt="Playpen school leadership" loading="lazy"></div><div class="card-body"><span class="card-kicker">People</span><h3 class="h5">Leadership &amp; Administration</h3><p>The Chairman, Managing Director, Principal, Vice Principals and Teacher-In-Charges who run the school.</p><span class="link-arrow">Read more {A}</span></div></a>
      <a class="card" href="campus.html" data-reveal data-reveal-delay="1"><div class="card-media"><img src="assets/img/campus-exterior.jpg" alt="The Playpen campus building in Bashundhara" loading="lazy"></div><div class="card-body"><span class="card-kicker">Place</span><h3 class="h5">Our Campus</h3><p>Ten storeys in Bashundhara: classrooms, laboratories, library, playground, hall and more.</p><span class="link-arrow">Read more {A}</span></div></a>
      <a class="card" href="alumni.html" data-reveal data-reveal-delay="2"><div class="card-media"><img src="assets/img/hero-48-years.jpg" alt="Playpen alumni" loading="lazy"></div><div class="card-body"><span class="card-kicker">Community</span><h3 class="h5">Alumni Association</h3><p>Reconnecting with students who have gone on to excel in their fields, in Bangladesh and abroad.</p><span class="link-arrow">Read more {A}</span></div></a>
    </div>
  </div>
</section>

{cta_band()}
'''

# ================================================================ LEADERSHIP
def _person(name, role, note=""):
    n = f'<p class="small muted" style="margin-top:.4em">{note}</p>' if note else ""
    return f'''<div class="contact-card" data-reveal>
      <p class="card-kicker">{role}</p>
      <h3 class="h4" style="margin-top:.5rem">{name}</h3>{n}
    </div>'''


LEADERSHIP = page_hero(
    [("About", "about.html"), ("Leadership", None)],
    "The people who run the school.",
    "Vice Principals and Teacher-In-Charges oversee assigned classes, supervising academic and administrative matters under the Principal&rsquo;s coordination.",
    "leadership.jpg", "Playpen School leadership and faculty"
) + f'''
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">School leadership</p>
      <h2 class="h2">Governance and direction.</h2>
    </div>
    <div class="grid grid-3">
      {_person("Mr. A. Mannan Khan", "Chairman", "Oversaw the construction of the permanent Bashundhara campus.")}
      {_person("Mr. Mir Masud Kabir", "Managing Director")}
      {_person("Mrs. Sorabon Tohura", "Principal", "Moved Playpen to its own campus in Bashundhara Residential Area on 19 July 2018.")}
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Academic leadership</p>
      <h2 class="h2">Vice Principals</h2>
      <p class="lead" style="margin-top:1rem">Each Vice Principal takes responsibility for a band of classes, supervising both teaching and day-to-day administration within it.</p>
    </div>
    <div class="grid grid-2" style="margin-bottom:4rem">
      {_person("Mrs. Sharmin Hoque", "Vice Principal", "Playgroup to Class V")}
      {_person("Mr. Palash Kumar Kundu", "Vice Principal", "Class VI to Class XII")}
    </div>

    <div class="section-head" data-reveal>
      <h2 class="h2">Teacher-In-Charges</h2>
      <p class="lead" style="margin-top:1rem">Teacher-In-Charges look after a narrower band of classes, and are usually the first point of contact for parents with a question about a particular year group.</p>
    </div>
    <div class="grid grid-3">
      {_person("Mrs. Khurshida Rahman Rimi", "Teacher-In-Charge", "Class VIII to XII")}
      {_person("Mrs. Roohi Shamima Choudhury", "Teacher-In-Charge", "Class VI to VII")}
      {_person("Mrs. Samina Abedin", "Teacher-In-Charge", "Class IV to V")}
      {_person("Mrs. Qamar Sultana Hamid", "Teacher-In-Charge", "Class II to III")}
      {_person("Mrs. Farida Yasmin", "Teacher-In-Charge", "KG II to Class I")}
      {_person("Mrs. Farhana Rehan", "Teacher-In-Charge", "Playgroup to KG I")}
    </div>
  </div>
</section>

<section class="section">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">How the school is staffed</p>
      <h2 class="h2">Two teachers in every junior classroom.</h2>
      <p class="lead" style="margin-top:1.25rem">Junior classes at Playpen have both a Class Teacher and an Assistant Teacher, so that individual students get individual attention. Senior classes work with Class Teachers and Subject Teachers.</p>
      <p style="margin-top:1rem">Our faculty includes both locally and internationally qualified teachers. Many have served at Playpen for thirty or forty years &mdash; a continuity that matters more in a school than in almost any other institution.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary" href="careers.html">Teach at Playpen {A}</a>
        <a class="btn btn--outline" href="contact.html">Contact the school office</a>
      </div>
    </div>
    <div class="figure figure--wide" data-reveal data-reveal-delay="2"><img src="assets/img/values-3.jpg" alt="Playpen teachers supervising their youngest pupils at play" loading="lazy"></div>
  </div>
</section>

<section class="section section--dark">
  <div class="container container--narrow">
    <div class="callout" style="background:rgba(255,255,255,.06);border-left-color:var(--gold)" data-reveal>
      <h3 class="h4" style="color:#fff">A note for the school office</h3>
      <p style="color:rgba(251,247,240,.8)">This page is ready to carry professional headshots and short biographies for each member of leadership, plus a searchable faculty directory. Supply photographs and approved bios and they drop straight into the existing card layout.</p>
    </div>
  </div>
</section>

{cta_band()}
'''

# ==================================================================== CAMPUS
def _facility(title, desc):
    return f'<div class="facility">{ICON_CHECK}<div><strong>{title}</strong><span>{desc}</span></div></div>'


CAMPUS = page_hero(
    [("About", "about.html"), ("Our Campus", None)],
    "Ten storeys, designed for this school.",
    "House 545/A, Road 19, Block J, Bashundhara Residential Area &mdash; a purpose-built campus the school moved into on 19 July 2018.",
    "campus-exterior.jpg", "The Playpen campus building"
) + f'''
<section class="section">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">The building</p>
      <h2 class="h2">A campus, not a converted building.</h2>
      <p class="lead" style="margin-top:1.25rem">Playpen&rsquo;s permanent campus was designed for the school by the architect Mr. Ehsan Khan and built under the direction of Chairman Mr. A Mannan Khan. It runs classes from Play Group to Class XII across ten floors.</p>
      <p style="margin-top:1rem">Classrooms, laboratories, the library, the common room and teacher facilities are all air-conditioned. Every floor has separate restrooms for boys and girls, and mineral water for drinking. Generators keep classes running comfortably through an electricity failure.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary" href="contact.html">Arrange a visit {A}</a>
      </div>
    </div>
    <div class="figure-stack" data-reveal data-reveal-delay="2">
      <div class="figure figure--tall"><img src="assets/img/about-playpen.jpg" alt="The Playpen campus seen from the playground" loading="lazy"></div>
      <div class="figure figure--square"><img src="assets/img/campus-1.jpg" alt="The playground and football pitch at Playpen" loading="lazy"></div>
      <div class="figure figure--square"><img src="assets/img/campus-3.jpg" alt="Playpen pupils on the school field" loading="lazy"></div>
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Grade structure</p>
      <h2 class="h2">Who is taught where.</h2>
    </div>
    <div class="table-wrap" data-reveal>
      <table class="data">
        <thead><tr><th>Stage</th><th>Classes</th><th>What defines it</th></tr></thead>
        <tbody>
          <tr><td><strong>Elementary School</strong></td><td>Playgroup &ndash; KG II</td><td>Fine motor skills, functional English, social confidence, activity-based learning.</td></tr>
          <tr><td><strong>Junior School</strong></td><td>Class I &ndash; III</td><td>Self-paced learning, strong English foundations, behaviour and social etiquette.</td></tr>
          <tr><td><strong>Middle School</strong></td><td>Class IV &ndash; VII</td><td>Core subjects, technology-supported learning, independent critical thinking.</td></tr>
          <tr><td><strong>Senior School</strong></td><td>Class VIII &ndash; XII</td><td>CAIE Ordinary, Advanced Subsidiary and Advanced Level preparation.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Facilities</p>
      <h2 class="h2">Everything on campus.</h2>
      <p class="lead" style="margin-top:1rem">The full list of what the building holds &mdash; academic, recreational and pastoral.</p>
    </div>
    <div class="facilities" data-reveal>
      {_facility("Air-conditioned classrooms", "Across all ten floors, alongside labs, library, common room and teacher facilities.")}
      {_facility("Science laboratories", "Physics, Chemistry and Biology, endorsed by Cambridge and the British Council.")}
      {_facility("IT laboratory", "Computer Science facilities with international-standard equipment.")}
      {_facility("Modernised library", "With the school bookshop attached, plus library classes for every level.")}
      {_facility("Multi-purpose hall", "For assemblies, cultural programmes, prize-givings and school events.")}
      {_facility("Students&rsquo; gallery &amp; hall room", "Collaborative areas for group work and presentation.")}
      {_facility("Large playground", "Outdoor space for games, athletics and annual sports.")}
      {_facility("Basketball court", "Home to the boys&rsquo; and girls&rsquo; house basketball championships.")}
      {_facility("Indoor games", "Table tennis, chess and carom, played through the year.")}
      {_facility("ECA rooms", "Dedicated spaces for art, music, dance, drama and club activity.")}
      {_facility("Cafeteria", "On-site catering, being expanded in Phase 2 of the building.")}
      {_facility("Sick room", "Staffed health facility for minor health issues during school hours.")}
      {_facility("CCTV monitoring", "Coverage across the campus, supporting student safety.")}
      {_facility("24/7 security personnel", "Security staffed around the clock.")}
      {_facility("Fire safety equipment", "Installed and maintained across the building.")}
      {_facility("PABX system", "Internal telephone network connecting offices and floors.")}
      {_facility("Generator support", "Classes continue comfortably through electricity failures.")}
      {_facility("Fresh water filtration", "Mineral water for drinking provided on each floor.")}
      {_facility("Separate restrooms", "Boys&rsquo; and girls&rsquo; facilities on every floor.")}
      {_facility("Transport facility", "The school&rsquo;s own bus service, operating since March 2014.")}
    </div>
  </div>
</section>

<section class="section section--dark">
  <div class="container split split--wide-right">
    <div class="figure figure--wide" data-reveal><img src="assets/img/slider-1.jpg" alt="The Playpen school building" loading="lazy"></div>
    <div data-reveal data-reveal-delay="1">
      <p class="overline">What comes next</p>
      <h2 class="h2">Phase 2 is in progress.</h2>
      <p class="lead" style="margin-top:1.25rem">The second phase of the Playpen School building is under way. Planned additions include further laboratories, an expanded cafeteria, an advanced library and more recreational facilities.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--gold" href="campus-services.html">Campus services {A}</a>
        <a class="btn btn--ghost-light" href="news.html#gallery">See the gallery</a>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head" data-reveal><p class="overline">Find us</p><h2 class="h3">House 545/A, Road 19, Block J, Bashundhara R/A</h2></div>
    <div class="map-frame" data-reveal>
      <iframe src="{SITE["map_embed"]}" title="Map showing Playpen School in Bashundhara Residential Area, Dhaka" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </div>
  </div>
</section>

{cta_band()}
'''
