# -*- coding: utf-8 -*-
from shell import SITE, ICON_ARROW, ICON_CHECK, cta_band, page_hero

A = ICON_ARROW

# =============================================================== STUDENT LIFE
STUDENT_LIFE = page_hero(
    [("Student Life", None)],
    "Learning happens beyond the classroom.",
    "Believing that academic excellence alone does not guarantee a sound education, we aim to ensure the well-rounded development of our students.",
    "sports-3.jpg", "Playpen students in a mass display at Annual Sports"
) + f'''
<section class="section">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">Overview</p>
      <h2 class="h2">Eleven programmes running alongside the timetable.</h2>
      <p class="lead" style="margin-top:1.25rem">The academic curriculum covers what CAIE examines. Everything on this page covers what it does not &mdash; and Playpen treats the second list as seriously as the first.</p>
      <p style="margin-top:1rem">Playpen is considered to be one of the leading innovators in the field of education in Bangladesh, and much of that reputation was built outside the exam syllabus: in the sports hall, on the stage, at the science fair, and in the communities our students go out to serve.</p>
    </div>
    <div data-reveal data-reveal-delay="2">
      <ul class="chips">
        <li>Games and Sports</li><li>Art &amp; Craft</li><li>Music &mdash; instrumental</li><li>Music &mdash; vocal</li>
        <li>Dance</li><li>Drama</li><li>Debate</li><li>Cookery</li><li>Spelling Bee</li>
        <li>Olympiads</li><li>Science clubs</li><li>Language clubs</li><li>Duke of Edinburgh&rsquo;s Award</li>
      </ul>
    </div>
  </div>
</section>

<!-- ============ SPORTS ============ -->
<section class="section section--dark" id="sports">
  <div class="container">
    <div class="split" style="align-items:end;margin-bottom:3rem">
      <div data-reveal>
        <p class="overline">Sports &amp; games</p>
        <h2 class="h2">Seven disciplines, indoors and out.</h2>
        <p class="lead" style="margin-top:1.25rem">Annual Sports is an integral part of our yearly non-academic programme. The campus is structured with both indoor and outdoor sports facilities, and the school maintains teams for boys and girls across all formats.</p>
      </div>
      <div data-reveal data-reveal-delay="1">
        <ul class="chips">
          <li>Football</li><li>Basketball</li><li>Handball</li><li>Athletics</li><li>Table Tennis</li><li>Chess</li><li>Carom</li>
        </ul>
        <p class="small" style="margin-top:1.25rem;color:rgba(251,247,240,.7)">The school organises both inter-school and inter-class tournaments through the year.</p>
      </div>
    </div>
    <div class="gallery-grid" data-reveal>
      <div class="figure"><img src="assets/img/sports-1.jpg" alt="Playpen students on the school field" loading="lazy"></div>
      <div class="figure"><img src="assets/img/sports-2.jpg" alt="A Playpen team at an inter-school tournament" loading="lazy"></div>
      <div class="figure"><img src="assets/img/sports-3.jpg" alt="Playpen annual sports day" loading="lazy"></div>
      <div class="figure"><img src="assets/img/sports-4.jpg" alt="Playpen students competing in athletics" loading="lazy"></div>
      <div class="figure"><img src="assets/img/sports-5.jpg" alt="Playpen students competing" loading="lazy"></div>
      <div class="figure"><img src="assets/img/sports-6.jpg" alt="Playpen inter-school sport" loading="lazy"></div>
    </div>
  </div>
</section>

<!-- ============ ARTS ============ -->
<section class="section" id="arts">
  <div class="container split split--wide-right">
    <div class="figure-stack" data-reveal>
      <div class="figure figure--tall"><img src="assets/img/slider-8.jpg" alt="Playpen students performing a classical dance" loading="lazy"></div>
      <div class="figure figure--square"><img src="assets/img/eca-4.jpg" alt="A Playpen cultural programme on stage" loading="lazy"></div>
      <div class="figure figure--square"><img src="assets/img/slider-2.jpg" alt="Playpen students marking International Mother Language Day" loading="lazy"></div>
    </div>
    <div data-reveal data-reveal-delay="1">
      <p class="overline">Arts, music &amp; drama</p>
      <h2 class="h2">Performing arts enhance creativity.</h2>
      <p class="lead" style="margin-top:1.25rem">Performing arts enhance creativity and an appreciation for aesthetics and for our vibrant culture. Art and craft, instrumental and vocal music, dance and drama all run as regular programmes.</p>
      <p style="margin-top:1rem">The year builds towards the Annual Cultural Programme, and takes in the national days that matter to Bangladesh along the way.</p>
      <div class="grid grid-2" style="margin-top:2rem;gap:1.25rem">
        <div class="callout"><h4 class="h5">Art &amp; Craft</h4><p>Studio work connected to the O Level Art &amp; Design syllabus.</p></div>
        <div class="callout"><h4 class="h5">Music</h4><p>Both instrumental and vocal, performed at school events.</p></div>
        <div class="callout"><h4 class="h5">Dance</h4><p>Group and solo work &mdash; Playpen&rsquo;s group dance team took first position at the 13th Bangla Olympiad.</p></div>
        <div class="callout"><h4 class="h5">Drama</h4><p>Staged in the campus multi-purpose hall.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ CLUBS ============ -->
<section class="section section--sand" id="clubs">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Clubs &amp; competitions</p>
      <h2 class="h2">Where students test themselves against other schools.</h2>
    </div>
    <div class="grid grid-3">
      <div class="card" data-reveal><div class="card-body"><span class="card-kicker">Speaking</span><h3 class="h5">Debate</h3><p>Structured argument and public speaking, practised through the year and taken to inter-school competition.</p></div></div>
      <div class="card" data-reveal data-reveal-delay="1"><div class="card-body"><span class="card-kicker">Language</span><h3 class="h5">Spelling Bee</h3><p>Playpen students have earned medals and certificates at the International Spell Bee Competition.</p></div></div>
      <div class="card" data-reveal data-reveal-delay="2"><div class="card-body"><span class="card-kicker">Academic</span><h3 class="h5">Olympiads</h3><p>Languages, science and mathematics &mdash; including the Bangla Olympiad, the Regional Physics Olympiad and the Space Exploration Olympiad.</p></div></div>
      <div class="card" data-reveal><div class="card-body"><span class="card-kicker">Clubs</span><h3 class="h5">Science &amp; Language Clubs</h3><p>Student-led clubs meeting through the year, feeding into fairs, competitions and the Science Fair.</p></div></div>
      <div class="card" data-reveal data-reveal-delay="1"><div class="card-body"><span class="card-kicker">Leadership</span><h3 class="h5">Duke of Edinburgh&rsquo;s Award</h3><p>The international self-development programme, combining skill, service, physical activity and an expedition.</p></div></div>
      <div class="card" data-reveal data-reveal-delay="2"><div class="card-body"><span class="card-kicker">Practical</span><h3 class="h5">Cookery</h3><p>A practical life-skills programme, run as part of the extra-curricular timetable.</p></div></div>
    </div>
  </div>
</section>

<!-- ============ SCIENCE ============ -->
<section class="section" id="science">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">Science &amp; technology</p>
      <h2 class="h2">The Science Fair.</h2>
      <p class="lead" style="margin-top:1.25rem">We have always been very particular about holding, or taking part in, science fairs of all formats &mdash; inside the school and outside it.</p>
      <p style="margin-top:1rem">Faculty stay actively engaged with the students who enter, at internal and external events alike, and the school has picked up a number of awards along the way. Students apply what they learn in class through projects, experiments, presentations and competition.</p>
      <p style="margin-top:1rem">Classes are conducted through multimedia projectors, which lets teachers run lessons more effectively and gives students more to work with than a textbook alone.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary" href="academics.html#facilities">See the laboratories {A}</a>
        <a class="btn btn--outline" href="achievements.html">Competition results</a>
      </div>
    </div>
    <div class="figure figure--wide" data-reveal data-reveal-delay="2"><img src="assets/img/hero-students-2.jpg" alt="A NASA astronaut speaking to Playpen students" loading="lazy"></div>
  </div>
</section>

<!-- ============ COMMUNITY SERVICE ============ -->
<section class="section section--dark" id="service">
  <div class="container">
    <div class="split" style="align-items:start;margin-bottom:3rem">
      <div class="sticky-col" data-reveal>
        <p class="overline">Community service</p>
        <h2 class="h2">Serving beyond the school gate.</h2>
        <p class="lead" style="margin-top:1.25rem">This is very much an ongoing practice at Playpen. Every year our students are directly involved in serving their communities in one form or another.</p>
      </div>
      <div data-reveal data-reveal-delay="1">
        <div style="display:grid;gap:1rem">
          <div class="contact-line" style="color:rgba(251,247,240,.85)">{ICON_CHECK}<div>Helping the poor and the needy</div></div>
          <div class="contact-line" style="color:rgba(251,247,240,.85)">{ICON_CHECK}<div>Donating clothes during winter</div></div>
          <div class="contact-line" style="color:rgba(251,247,240,.85)">{ICON_CHECK}<div>Volunteering with social organisations</div></div>
          <div class="contact-line" style="color:rgba(251,247,240,.85)">{ICON_CHECK}<div>Designing and building small homes for low-income families</div></div>
        </div>
      </div>
    </div>
    <div class="grid grid-3" data-reveal>
      <div class="figure figure--wide"><img src="assets/img/community-1.jpg" alt="Playpen community service project" loading="lazy"></div>
      <div class="figure figure--wide"><img src="assets/img/community-2.jpg" alt="Playpen students volunteering" loading="lazy"></div>
      <div class="figure figure--wide"><img src="assets/img/community-3.jpg" alt="Playpen community outreach" loading="lazy"></div>
    </div>
  </div>
</section>

<!-- ============ EVENTS ============ -->
<section class="section" id="events">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">The school year</p>
      <h2 class="h2">Events and celebrations.</h2>
      <p class="lead" style="margin-top:1rem">The calendar that shapes a year at Playpen &mdash; academic, cultural and national.</p>
    </div>
    <div class="grid grid-3">
      <div data-reveal>
        <div class="feature"><span class="feature-num">01</span><h3>Annual Cultural Programme</h3><p>The school&rsquo;s largest performance event, staged in the multi-purpose hall.</p></div>
        <div class="feature"><span class="feature-num">02</span><h3>Annual Milad</h3><p>Held each year as part of the school&rsquo;s calendar.</p></div>
        <div class="feature"><span class="feature-num">03</span><h3>Science Fair</h3><p>Student projects, experiments and presentations, judged internally and entered externally.</p></div>
        <div class="feature"><span class="feature-num">04</span><h3>International Mother Language Day</h3><p>Marked every 21 February.</p></div>
      </div>
      <div data-reveal data-reveal-delay="1">
        <div class="feature"><span class="feature-num">05</span><h3>Independence Day</h3><p>The national day marked with a school function.</p></div>
        <div class="feature"><span class="feature-num">06</span><h3>Pohela Boishakh</h3><p>The Bengali new year, celebrated across the school.</p></div>
        <div class="feature"><span class="feature-num">07</span><h3>Victory Day</h3><p>Commemorated each 16 December.</p></div>
        <div class="feature"><span class="feature-num">08</span><h3>Graduation Ceremony</h3><p>For the outgoing senior cohort.</p></div>
      </div>
      <div data-reveal data-reveal-delay="2">
        <div class="feature"><span class="feature-num">09</span><h3>Sports Day</h3><p>Annual Sports, with inter-house and inter-class competition.</p></div>
        <div class="feature"><span class="feature-num">10</span><h3>Football &amp; other tournaments</h3><p>Inter-school fixtures through the sporting calendar.</p></div>
        <div class="feature"><span class="feature-num">11</span><h3>Educational Tours</h3><p>Study trips connected to the curriculum.</p></div>
        <div class="feature"><span class="feature-num">12</span><h3>Class Parties</h3><p>Year-group celebrations at key points in the calendar.</p></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ WORKSHOPS ============ -->
<section class="section section--sand">
  <div class="container split split--wide-right">
    <div class="figure figure--wide" data-reveal><img src="assets/img/examination-2.jpg" alt="Playpen senior students in an examination hall" loading="lazy"></div>
    <div data-reveal data-reveal-delay="1">
      <p class="overline">Workshops &amp; seminars</p>
      <h2 class="h2">Preparing for what comes after school.</h2>
      <p class="lead" style="margin-top:1.25rem">Regular workshops and seminars run through the year, aimed mainly at senior students.</p>
      <ul class="chips" style="margin-top:1.5rem">
        <li>Internet safety &amp; responsible social media</li>
        <li>University applications &mdash; international institutions</li>
        <li>Model United Nations</li>
        <li>United World College programmes</li>
        <li>Duke of Edinburgh&rsquo;s Award</li>
      </ul>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary" href="academics.html#support">Student support &amp; counselling {A}</a>
      </div>
    </div>
  </div>
</section>

{cta_band()}
'''

# =============================================================== ACHIEVEMENTS
def _ach(cat, year, title, detail, tags):
    return f'''<article class="card" data-category="{tags}" data-reveal>
      <div class="card-body">
        <span class="card-kicker">{cat} &middot; {year}</span>
        <h3 class="h5">{title}</h3>
        <p>{detail}</p>
      </div>
    </article>'''


ACHIEVEMENTS = page_hero(
    [("Student Life", "student-life.html"), ("Achievements", None)],
    "What our students have won.",
    "A record of competition results across academics, sport and environmental work &mdash; updated as new results come in.",
    "cie-top-2025.jpg", "Playpen’s Cambridge examination results board"
) + f'''
<section class="section">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Filter</p>
      <h2 class="h2">Browse the record.</h2>
      <p class="lead" style="margin-top:1rem">Filter by category, or scroll the full list. Where students are named, it is because the result was published by the school.</p>
    </div>
    <div class="btn-row" data-filter-group="#ach-list" style="margin-bottom:2.5rem" data-reveal>
      <button class="btn btn--outline btn--sm" data-filter="all" aria-pressed="true">All</button>
      <button class="btn btn--outline btn--sm" data-filter="academic" aria-pressed="false">Academic</button>
      <button class="btn btn--outline btn--sm" data-filter="olympiad" aria-pressed="false">Olympiads</button>
      <button class="btn btn--outline btn--sm" data-filter="language" aria-pressed="false">Language</button>
      <button class="btn btn--outline btn--sm" data-filter="sport" aria-pressed="false">Sport</button>
      <button class="btn btn--outline btn--sm" data-filter="environment" aria-pressed="false">Environment</button>
    </div>
    <div class="grid grid-3" id="ach-list">
      {_ach("Olympiad", "2024", "1st Space Exploration Olympiad", "Organised by the Bangladesh Innovation Forum at AIUB on 27 April 2024. Quazi Jorjis Nivaan and Adyan Omair Islam both achieved 2nd runner-up.", "olympiad academic")}
      {_ach("Olympiad", "2024", "Regional Physics Olympiad", "Adyan Omair Islam placed sixth in Category A on 9 February 2024.", "olympiad academic")}
      {_ach("Language", "2024", "13th Bangla Olympiad", "Fahmiah Fahreen of Class VII took 1st position in Essay Writing on 24 February 2024. The group dance team also achieved first position.", "language olympiad")}
      {_ach("Academic", "2024", "Math and Tech Fest", "Students of Class VIII, including Razika Khan, took 1st position in Crypto Craft Chronicles in January 2024. Mujtoba Siraj earned first place in the Rube Goldberg competition and the campus ambassador award.", "academic")}
      {_ach("Academic", "2024", "16th National Abacus &amp; Mental Arithmetic Competition", "Sameeha Binte Firoz secured third runner-up on 23 February 2024.", "academic")}
      {_ach("Language", "2024", "Bakeman&rsquo;s 3rd International Language League", "Three Class IX students achieved runner-up for their presentation on Bangladeshi folk art, on 24 February 2024.", "language")}
      {_ach("Language", "2023", "International Spell Bee Competition", "Areebah Saifee Siddiqui of Class I received an Appreciation Medal, as did Yasarah Dewan. Three further students earned participation certificates.", "language academic")}
      {_ach("Sport", "2024", "Scholastica Inter School Football", "Best Player and Best Defender awards, January 2024.", "sport")}
      {_ach("Sport", "2023", "Hurdco Inter School Football", "Runners-up, August 2023.", "sport")}
      {_ach("Sport", "2023", "Inter-House Basketball", "Boys Champion: House Earth Boys. Girls Champion: House Jupiter Girls. 26 August 2023.", "sport")}
      {_ach("Environment", "2023", "Eco-Schools Programme", "Three Class IX students earned 1st Runner Up for Best Presentation, 14 October 2023.", "environment academic")}
      {_ach("Academic", "2003", "First O Level candidate", "Playpen&rsquo;s first Ordinary Level candidate sat the examination in 2003 and achieved top marks across seven subjects.", "academic")}
    </div>
  </div>
</section>

<section class="section section--dark">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">Cambridge results</p>
      <h2 class="h2">Results are published each year.</h2>
      <p class="lead" style="margin-top:1.25rem">Playpen students sit CAIE examinations at Ordinary, Advanced Subsidiary and Advanced Level. Results are released by Cambridge and published by the school as they become available.</p>
      <p style="margin-top:1rem;color:rgba(251,247,240,.78)">Alumni go on to study at premier universities globally, supported through the application process by the Senior Vice-Principal and Teacher In-Charge.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--gold" href="academics.html#senior">The senior programme {A}</a>
        <a class="btn btn--ghost-light" href="alumni.html">Where alumni went</a>
      </div>
    </div>
    <div class="figure figure--wide" data-reveal data-reveal-delay="1"><img src="assets/img/hero-results.png" alt="Playpen Cambridge examination results" loading="lazy"></div>
  </div>
</section>

<section class="section">
  <div class="container container--narrow">
    <div class="callout" data-reveal>
      <h3 class="h4">A note on publishing student results</h3>
      <p style="margin-top:.75rem">Playpen obtains parent and student consent where required before publishing identifiable student information and photographs. Families who would prefer a name or photograph removed should contact the school office.</p>
    </div>
  </div>
</section>

{cta_band()}
'''
