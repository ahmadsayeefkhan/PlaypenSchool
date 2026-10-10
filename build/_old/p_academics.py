# -*- coding: utf-8 -*-
from shell import SITE, ICON_ARROW, ICON_CHECK, cta_band, page_hero

A = ICON_ARROW


def _subject(name, desc):
    return f'''<div class="card" data-reveal><div class="card-body">
      <h3 class="h5">{name}</h3><p>{desc}</p>
    </div></div>'''


ACADEMICS = page_hero(
    [("Academics", None)],
    "A Cambridge education, from the early years to A Level.",
    "Playpen follows the Cambridge curriculum from the Elementary Level right up to the Senior Levels &mdash; Ordinary and Advanced. One pathway, four stages, no discontinuity.",
    "admission-2.jpg", "A young Playpen pupil writing at her desk with a teacher"
) + f'''
<section class="section">
  <div class="container">
    <div class="split split--wide-left" style="align-items:start">
      <div class="prose" data-reveal>
        <p class="overline">Academic overview</p>
        <h2 class="h2">One curriculum, followed all the way through.</h2>
        <p class="lead" style="margin-top:1.25rem">The advantage of a single curriculum from Playgroup to Class XII is that nothing has to be unlearned. A child who joins Playpen at three and leaves at eighteen has been taught within one coherent framework the whole time.</p>
        <p>Within that framework, each stage is designed around what children of that age actually need: play and fine motor skills in the early years; unhurried consolidation in the junior classes; independent thinking and technology in the middle school; and rigorous examination preparation in the senior school.</p>
        <p>The medium of instruction is English throughout, with a deliberate emphasis on preserving the Bengali language and on awareness of Bangladesh&rsquo;s cultural heritage and its secular community values.</p>
      </div>
      <div data-reveal data-reveal-delay="1">
        <div class="callout">
          <h3 class="h5">Jump to a stage</h3>
          <ul class="footer-links" style="margin-top:1rem;gap:.7rem">
            <li><a class="link-arrow" href="#elementary">Elementary &middot; Playgroup&ndash;KG II {A}</a></li>
            <li><a class="link-arrow" href="#junior">Junior &middot; Class I&ndash;III {A}</a></li>
            <li><a class="link-arrow" href="#middle">Middle &middot; Class IV&ndash;VII {A}</a></li>
            <li><a class="link-arrow" href="#senior">Senior &middot; Class VIII&ndash;XII {A}</a></li>
            <li><a class="link-arrow" href="#subjects">O Level &amp; A Level subjects {A}</a></li>
            <li><a class="link-arrow" href="#examinations">Assessment &amp; examinations {A}</a></li>
            <li><a class="link-arrow" href="#facilities">Library &amp; laboratories {A}</a></li>
            <li><a class="link-arrow" href="#support">Student support {A}</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ ELEMENTARY ============ -->
<section class="section section--sand" id="elementary">
  <div class="container">
    <div class="split split--wide-right" style="align-items:center">
      <div class="figure figure--tall" data-reveal><img src="assets/img/values-2.jpg" alt="Playpen’s youngest pupils on the playground with their teachers" loading="lazy"></div>
      <div data-reveal data-reveal-delay="1">
        <p class="overline">Stage 01 &middot; Playgroup to KG II</p>
        <h2 class="h2">Elementary School</h2>
        <p class="lead" style="margin-top:1.25rem">The curriculum at the Elementary Level aims to develop a child&rsquo;s moral, mental and physical capabilities, focusing on basic learning tools that build competence.</p>
        <p style="margin-top:1rem">In the early years &mdash; Playgroup and Nursery &mdash; the focus is on communicative and social skills, with attention to cognitive growth and the practice of logical thinking. We work on fine motor skills through structured activity, and teachers accompany students throughout the day to help social skills develop alongside academic ones.</p>
        <div class="grid grid-2" style="margin-top:2rem;gap:1.5rem">
          <div><h3 class="h5">Playgroup</h3><p class="small muted">Students develop self-esteem and the foundational skills that shape their future academic aptitude and attitude.</p></div>
          <div><h3 class="h5">KG I &amp; KG II</h3><p class="small muted">Emotional, physical and mental growth supported by trained teachers and engaging activities, prioritising safety and confidence.</p></div>
        </div>
        <ul class="chips" style="margin-top:2rem">
          <li>Functional English</li><li>Fine motor skills</li><li>Group work</li><li>Discipline &amp; punctuality</li><li>Social skills</li><li>Activity-based learning</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ============ JUNIOR ============ -->
<section class="section" id="junior">
  <div class="container">
    <div class="split split--wide-left" style="align-items:center">
      <div data-reveal>
        <p class="overline">Stage 02 &middot; Class I to III</p>
        <h2 class="h2">Junior School</h2>
        <div class="quote" style="margin:1.5rem 0 2rem">
          <blockquote style="font-size:var(--t-xl)">&ldquo;Children must be taught how to think, not what to think.&rdquo;</blockquote>
        </div>
        <p class="lead">The Junior curriculum is structured so that students are never put under pressure. They are encouraged to learn at their own pace, while developing good behaviour, interpersonal communication skills and social etiquette.</p>
        <p style="margin-top:1rem">A strong foundation in English at the primary level matters because it unlocks everything else &mdash; Mathematics, Science, Bangla and the rest. The lessons acquired here equip students with the skills the next stages demand.</p>
        <div class="grid grid-3" style="margin-top:2.5rem;gap:1.5rem">
          <div><h3 class="h5">English</h3><p class="small muted">Foundation-level instruction, treated as essential for acquiring knowledge in every other discipline.</p></div>
          <div><h3 class="h5">Mathematics</h3><p class="small muted">Fundamental and logical concepts, beginning with addition and subtraction using visual aids.</p></div>
          <div><h3 class="h5">Bangla</h3><p class="small muted">Reading, writing and recitation, developing communication ability and cultural awareness.</p></div>
        </div>
        <div class="callout" style="margin-top:2rem"><p><strong>Assessment.</strong> The school uses multiple assessment tools and issues Progress Reports across two semesters each year.</p></div>
      </div>
      <div class="figure-stack" data-reveal data-reveal-delay="2">
        <div class="figure figure--tall"><img src="assets/img/junior-1.jpg" alt="Junior pupils singing on stage at Playpen" loading="lazy"></div>
        <div class="figure figure--square"><img src="assets/img/junior-2.jpg" alt="Junior pupils at a Playpen school ceremony" loading="lazy"></div>
        <div class="figure figure--square"><img src="assets/img/values-3.jpg" alt="Playpen teachers with young pupils on the playground" loading="lazy"></div>
      </div>
    </div>
  </div>
</section>

<!-- ============ MIDDLE ============ -->
<section class="section section--dark" id="middle">
  <div class="container">
    <div class="split split--wide-right" style="align-items:center">
      <div class="figure figure--wide" data-reveal><img src="assets/img/eca-4.jpg" alt="Middle school students performing at a Playpen cultural programme" loading="lazy"></div>
      <div data-reveal data-reveal-delay="1">
        <p class="overline">Stage 03 &middot; Class IV to VII</p>
        <h2 class="h2">Middle School</h2>
        <p class="lead" style="margin-top:1.25rem">Playpen prides itself on putting students&rsquo; educational needs at the forefront through innovative teaching techniques and strategies.</p>
        <p style="margin-top:1rem;color:rgba(251,247,240,.78)">Students from Class IV to VII study their core subjects through dynamic learning, picking up concepts and ideas from their texts and from classroom discussion. They also connect to technology to advance their skills and knowledge, extending that learning through hands-on experience.</p>
        <p style="margin-top:1rem;color:rgba(251,247,240,.78)">Learning is engrained better when students are fully engaged. Our highly qualified teachers design their curriculum around students, encouraging them to develop individual learning styles as education constantly evolves. Students are encouraged to think outside the box and are motivated to approach their academics with real zest.</p>
        <ul class="chips" style="margin-top:2rem">
          <li>Core subjects</li><li>Technology integration</li><li>Hands-on projects</li><li>Collaborative problem solving</li><li>Independent critical thinking</li><li>Bengali &amp; cultural heritage</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ============ SENIOR ============ -->
<section class="section" id="senior">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Stage 04 &middot; Class VIII to XII</p>
      <h2 class="h2">Senior School &mdash; the Cambridge examinations.</h2>
      <p class="lead" style="margin-top:1rem">In the Senior School we prepare students for CAIE (Cambridge Assessment International Education) through Ordinary, Advanced Subsidiary and Advanced Level examinations &mdash; international qualifications recognised by the world&rsquo;s best universities and employers.</p>
    </div>
    <div class="split" style="align-items:start">
      <div data-reveal>
        <p>These qualifications give students a wide range of options in their education and their careers. Our aim in the senior segment is also to balance knowledge, understanding and skills, providing a solid foundation for the rest of their educational journey &mdash; and, along the way, helping them develop an informed curiosity and a lasting passion for learning.</p>
        <p style="margin-top:1rem">Alumni go on to study at premier universities around the world. Our staff hold advanced international qualifications in their respective disciplines.</p>
        <div class="btn-row" style="margin-top:2rem">
          <a class="btn btn--primary" href="#subjects">View all subjects {A}</a>
          <a class="btn btn--outline" href="admissions.html">A Level admissions</a>
        </div>
      </div>
      <div class="figure figure--wide" data-reveal data-reveal-delay="1"><img src="assets/img/middle-senior.jpg" alt="A Playpen student receiving a certificate at graduation" loading="lazy"></div>
    </div>

    <div class="grid grid-2" style="margin-top:4rem">
      <div class="callout callout--crimson" data-reveal>
        <h3 class="h4">The O Level pathway</h3>
        <p style="margin-top:.75rem">Students in Class VIII select their elective subjects at the end of the second semester. The minimum requirement is <strong>six subjects</strong>.</p>
        <p style="margin-top:.75rem"><strong>Compulsory:</strong> English Language, Bengali, and Mathematics (Syllabus D).</p>
        <p style="margin-top:.75rem"><strong>Electives:</strong> nine further subjects across sciences, commerce, computing and art.</p>
      </div>
      <div class="callout callout--crimson" data-reveal data-reveal-delay="1">
        <h3 class="h4">The A Level pathway</h3>
        <p style="margin-top:.75rem">A Level instruction began at Playpen in 2013. The minimum requirement is <strong>three subjects</strong>.</p>
        <p style="margin-top:.75rem">Nine subjects are offered, covering the science, commerce and computing routes that Bangladeshi and international universities most commonly ask for.</p>
        <p style="margin-top:.75rem">Students receive university and career guidance from the Senior Vice-Principal and Teacher In-Charge throughout.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============ SUBJECTS ============ -->
<section class="section section--sand" id="subjects">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Subjects</p>
      <h2 class="h2">What students can study.</h2>
      <p class="lead" style="margin-top:1rem">The current offering at Ordinary and Advanced Level. Subject availability is confirmed by the school each academic year.</p>
    </div>

    <h3 class="h3" style="margin-bottom:1.5rem" data-reveal>O Level &middot; minimum 6 subjects</h3>
    <p class="overline" data-reveal>Compulsory</p>
    <div class="grid grid-3" style="margin-bottom:2.5rem">
      {_subject("English Language", "The medium of instruction throughout the school, and the foundation for every other subject.")}
      {_subject("Bengali", "Reading, writing and recitation, sustaining the language and the cultural heritage that goes with it.")}
      {_subject("Mathematics (Syllabus D)", "The standard Cambridge O Level mathematics syllabus, building on the logical foundations laid in the junior classes.")}
    </div>
    <p class="overline" data-reveal>Elective</p>
    <div class="grid grid-3">
      {_subject("Physics", "Mechanics, waves, electricity and modern physics, supported by practical work in the school laboratory.")}
      {_subject("Chemistry", "Physical, inorganic and organic chemistry, with laboratory practicals endorsed by Cambridge and the British Council.")}
      {_subject("Biology", "Cells, physiology, genetics and ecology, with dissection and microscopy in the biology laboratory.")}
      {_subject("Additional Mathematics", "For students intending to take Mathematics, Physics or Engineering further at A Level and beyond.")}
      {_subject("Economics", "Micro and macroeconomics, and the reasoning that underpins policy and business decisions.")}
      {_subject("Accounting", "Financial record-keeping, statements and analysis &mdash; the groundwork for commerce at A Level.")}
      {_subject("Business Studies", "How organisations are structured, financed, marketed and managed.")}
      {_subject("Computer Science", "Computational thinking, programming and systems, taught in the school&rsquo;s IT laboratory.")}
      {_subject("Art &amp; Design", "Studio practice and design thinking, connected to the school&rsquo;s art and craft programme.")}
    </div>

    <h3 class="h3" style="margin:4rem 0 1.5rem" data-reveal>A Level &middot; minimum 3 subjects</h3>
    <div class="grid grid-3">
      {_subject("English Language", "Advanced language and analysis, for students heading into humanities, law, media or communications.")}
      {_subject("Mathematics", "Pure mathematics with mechanics and statistics, the prerequisite for most engineering and science degrees.")}
      {_subject("Physics", "The advanced syllabus, with the practical component taught in the school&rsquo;s physics laboratory.")}
      {_subject("Chemistry", "Required for medicine, pharmacy, biochemistry and most engineering routes.")}
      {_subject("Biology", "The foundation for medicine, dentistry, biotechnology and the life sciences.")}
      {_subject("Economics", "Advanced micro and macroeconomics, widely required for business and economics degrees.")}
      {_subject("Accounting", "Advanced financial and management accounting, for students heading towards professional qualification.")}
      {_subject("Business", "Strategy, operations, marketing and human resources at advanced level.")}
      {_subject("Computer Science", "Algorithms, data structures, architecture and advanced programming.")}
    </div>

    <div class="callout" style="margin-top:3rem" data-reveal>
      <p class="small"><strong>Please confirm before applying.</strong> Subject availability can change from year to year depending on staffing and student numbers. Contact the Admissions Office to confirm the current offering for your child&rsquo;s intended entry year.</p>
    </div>
  </div>
</section>

<!-- ============ EXAMINATIONS ============ -->
<section class="section" id="examinations">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">Assessment &amp; examinations</p>
      <h2 class="h2">How progress is measured.</h2>
      <p class="lead" style="margin-top:1.25rem">The school academic year is divided into two semesters. A formal written examination is taken at the end of each semester.</p>
      <p style="margin-top:1rem">Students in the Junior and Senior sections must attain certain passing marks in the core subjects to be considered for promotion to the next class. Progress Reports are issued across the two semesters, and in the junior classes a range of assessment tools is used alongside the formal papers.</p>
      <p style="margin-top:1rem">Parents can follow academic performance, class tests, class work markings, homework, report cards, attendance and punctuality through the Parent &amp; Student Portal, rather than waiting for a report at the end of term.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary" href="{SITE["portal"]}" rel="noopener">Open the portal {A}</a>
        <a class="btn btn--outline" href="parents.html">For parents</a>
      </div>
    </div>
    <div class="figure-stack" data-reveal data-reveal-delay="2">
      <div class="figure figure--tall"><img src="assets/img/examination-2.jpg" alt="Students sitting an examination at Playpen" loading="lazy"></div>
      <div class="figure figure--square"><img src="assets/img/examination-1.jpg" alt="An examination hall at Playpen" loading="lazy"></div>
      <div class="figure figure--square"><img src="assets/img/cie-top-2025.jpg" alt="Playpen’s Cambridge examination results board" loading="lazy"></div>
    </div>
  </div>
</section>

<!-- ============ LIBRARY & LABS ============ -->
<section class="section section--dark" id="facilities">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Learning resources</p>
      <h2 class="h2">Library and laboratories.</h2>
    </div>
    <div class="split" style="align-items:start">
      <div data-reveal>
        <h3 class="h3" style="margin-bottom:1rem">The Library</h3>
        <p style="color:rgba(251,247,240,.78)">Children should read Reader&rsquo;s Digest, books, magazines, periodicals and newspapers available in the library, to improve both their English and their ideas. Library Classes run for all levels, supervised by a Librarian; students typically gravitate towards story and adventure titles.</p>
        <p style="margin-top:1rem;color:rgba(251,247,240,.78)">The library was modernised in the new campus and has the school bookshop attached to it.</p>
        <div class="callout" style="background:rgba(255,255,255,.06);border-left-color:var(--gold);margin-top:1.5rem">
          <p style="color:rgba(251,247,240,.85)"><strong style="color:#fff">Borrowing.</strong> The Librarian notifies parents through the Class Teacher when a book has not been returned. If a student cannot return a book after a set period, it becomes the parent&rsquo;s responsibility to replace it with a similar copy or to pay its cost.</p>
        </div>
      </div>
      <div data-reveal data-reveal-delay="1">
        <h3 class="h3" style="margin-bottom:1rem">The Laboratories</h3>
        <p style="color:rgba(251,247,240,.78)">The Physics, Chemistry, Biology and Computer Science Laboratories carry state-of-the-art, international facilities. They are endorsed by Cambridge and the British Council.</p>
        <p style="margin-top:1rem;color:rgba(251,247,240,.78)">The laboratories are spacious, completely equipped, and secure for both students and instructors &mdash; which matters as much as the equipment itself.</p>
        <ul class="chips" style="margin-top:1.5rem">
          <li>Physics Laboratory</li><li>Chemistry Laboratory</li><li>Biology Laboratory</li><li>Computer Science Laboratory</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ============ SUPPORT ============ -->
<section class="section" id="support">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Student support</p>
      <h2 class="h2">Someone is always on standby.</h2>
    </div>
    <div class="grid grid-2" style="margin-bottom:3rem">
      <div class="callout" data-reveal>
        <h3 class="h4">Student Counsellor</h3>
        <p style="margin-top:.75rem">A designated member of the faculty is always on standby to answer any query, or to provide advice and support to our students as and when they need it. The counsellor assists with academic concerns, non-academic issues, and behavioural matters flagged by educators.</p>
      </div>
      <div class="callout" data-reveal data-reveal-delay="1">
        <h3 class="h4">Career Counsellor</h3>
        <p style="margin-top:.75rem">The Senior Vice-Principal and Teacher In-Charge are always available to give guidance and advice on career choices, university applications, procedures and the guidelines students need to embark on higher study at home and abroad.</p>
      </div>
    </div>
    <div class="split split--wide-left" style="align-items:start">
      <div data-reveal>
        <h3 class="h3" style="margin-bottom:1rem">University and college applications</h3>
        <p>Senior class students receive support materials for their college and university applications &mdash; including recommendation letters, transcripts and testimonials, with emphasis on both academic results and extracurricular achievement.</p>
        <p style="margin-top:1rem">Workshops and seminars run through the year covering internet safety and responsible social media use, university application support for international institutions, Model United Nations, United World College programmes, and the Duke of Edinburgh&rsquo;s Award.</p>
        <div class="btn-row" style="margin-top:2rem">
          <a class="btn btn--primary" href="student-life.html">Student life and activities {A}</a>
        </div>
      </div>
      <div class="figure figure--wide" data-reveal data-reveal-delay="1"><img src="assets/img/hero-students-2.jpg" alt="A NASA astronaut speaking to Playpen students at a school workshop" loading="lazy"></div>
    </div>
  </div>
</section>

{cta_band()}
'''
