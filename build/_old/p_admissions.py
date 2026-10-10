# -*- coding: utf-8 -*-
from shell import SITE, ICON_ARROW, ICON_CHECK, cta_band, page_hero

A = ICON_ARROW


def _faq(q, a_):
    return f'<details><summary>{q}</summary><div class="accordion-body">{a_}</div></details>'


ADMISSIONS = page_hero(
    [("Admissions", None)],
    "Start your child&rsquo;s journey at Playpen.",
    "Entry points, the application process, the documents you will need, and the forms to download &mdash; in one place.",
    "admission-1.jpg", "Playpen students on admission day"
) + f'''
<section class="section section--tight section--crimson">
  <div class="container cta-inner">
    <div data-reveal>
      <p class="overline">Currently open</p>
      <h2 class="h3" style="color:#fff">A Level admission, academic year July 2026 &ndash; June 2027.</h2>
      <p style="margin-top:.75rem;color:rgba(255,255,255,.85)">Forms are available at the admin office and on this page. Please call between 9:00 AM and 1:00 PM.</p>
    </div>
    <div class="btn-row" data-reveal data-reveal-delay="1">
      <a class="btn btn--gold" href="tel:+8801755693623">Call 01755 693 623</a>
      <a class="btn btn--ghost-light" href="#forms">Download forms</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">Before you apply</p>
      <h2 class="h2">What you are actually choosing.</h2>
      <p class="lead" style="margin-top:1.25rem">Playpen is an English-medium school in Bashundhara following the Cambridge curriculum from Playgroup through to A Level. It has been teaching in Dhaka since 1977 and moved into its purpose-built campus in 2018.</p>
      <p style="margin-top:1rem">For most families the decision comes down to a few practical questions: is the class my child needs open, what will they be taught, who will look after them, and how do I apply. Those are the questions this section answers &mdash; and the Admissions Office will answer anything it does not.</p>
      <div class="btn-row" style="margin-top:2rem">
        <a class="btn btn--primary" href="#process">See the process {A}</a>
        <a class="btn btn--outline" href="academics.html">The academic programme</a>
      </div>
    </div>
    <div class="grid grid-2" style="gap:1rem" data-reveal data-reveal-delay="2">
      <div class="callout"><h4 class="h5">Cambridge throughout</h4><p>One curriculum from the Elementary Level to Advanced Level.</p></div>
      <div class="callout"><h4 class="h5">Purpose-built campus</h4><p>Ten storeys, laboratories, library, hall and playground.</p></div>
      <div class="callout"><h4 class="h5">Individual attention</h4><p>Class and Assistant Teachers in the junior classes.</p></div>
      <div class="callout"><h4 class="h5">Transport available</h4><p>The school&rsquo;s own bus service, running since 2014.</p></div>
    </div>
  </div>
</section>

<!-- ============ ENTRY POINTS ============ -->
<section class="section section--sand" id="entry">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Entry points</p>
      <h2 class="h2">Which class should you apply for?</h2>
      <p class="lead" style="margin-top:1rem">Applications are accepted based on available space. Availability by class is confirmed by the Admissions Office each year &mdash; please call before submitting a form.</p>
    </div>
    <div class="table-wrap" data-reveal>
      <table class="data">
        <thead><tr><th>Stage</th><th>Classes</th><th>How applicants are assessed</th><th>Form</th></tr></thead>
        <tbody>
          <tr><td><strong>Elementary</strong></td><td>Playgroup &ndash; KG II</td><td>Assessment for PG and Nursery; written test in English, Bengali and Mathematics from KG I.</td><td><a href="{SITE["form_pg9"]}" rel="noopener">PG&ndash;IX form</a></td></tr>
          <tr><td><strong>Junior</strong></td><td>Class I &ndash; III</td><td>Written test in English, Bengali and Mathematics, followed by an interview with the Principal.</td><td><a href="{SITE["form_pg9"]}" rel="noopener">PG&ndash;IX form</a></td></tr>
          <tr><td><strong>Middle</strong></td><td>Class IV &ndash; VII</td><td>Written test in English, Bengali and Mathematics, followed by an interview with the Principal.</td><td><a href="{SITE["form_pg9"]}" rel="noopener">PG&ndash;IX form</a></td></tr>
          <tr><td><strong>Senior</strong></td><td>Class VIII &ndash; IX</td><td>Written test in English, Bengali and Mathematics, followed by an interview with the Principal.</td><td><a href="{SITE["form_pg9"]}" rel="noopener">PG&ndash;IX form</a></td></tr>
          <tr><td><strong>A Level</strong></td><td>Class XI (AS)</td><td>Based on Mock Examination results and O Level results.</td><td><a href="{SITE["form_alevel"]}" rel="noopener">A Level form</a></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<!-- ============ PROCESS ============ -->
<section class="section" id="process">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">The process</p>
      <h2 class="h2">Five steps from enquiry to enrolment.</h2>
    </div>
    <div class="split" style="align-items:start">
      <div class="steps" data-reveal>
        <div class="step"><div><h3 class="h5">Enquire</h3><p>Visit the Front Office, email the school, or contact the Admissions Department directly to ask about availability in the class you need.</p></div></div>
        <div class="step"><div><h3 class="h5">Collect or download the form</h3><p>Forms can be collected from the Front Office or downloaded from this page. Read the instructions carefully before filling it in.</p></div></div>
        <div class="step"><div><h3 class="h5">Submit the form and documents</h3><p>Completed forms are submitted at the Front Office and are then sorted by the Admissions Department.</p></div></div>
        <div class="step"><div><h3 class="h5">Assessment and interview</h3><p>Assessment for PG and Nursery. Written tests in English, Bengali and Mathematics from KG I to Class IX. The Principal conducts interviews. Class XI admission is based on Mock Examination and O Level results.</p></div></div>
        <div class="step"><div><h3 class="h5">Decision and enrolment</h3><p>Application status is communicated by telephone. Payment is made online through a school-authorised bank.</p></div></div>
      </div>
      <div data-reveal data-reveal-delay="1">
        <div class="figure figure--tall" style="margin-bottom:1.5rem"><img src="assets/img/admission-2.jpg" alt="Admission at Playpen School" loading="lazy"></div>
        <div class="callout callout--crimson">
          <h4 class="h5">Applications are subject to space</h4>
          <p>Playpen accepts applications based on available seats in each class. Applying early, and confirming availability by phone first, saves everyone time.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ DOCUMENTS ============ -->
<section class="section section--dark" id="documents">
  <div class="container">
    <div class="split split--wide-right" style="align-items:center">
      <div class="figure figure--wide" data-reveal><img src="assets/img/admission-3.jpg" alt="Parents at the Playpen admissions office" loading="lazy"></div>
      <div data-reveal data-reveal-delay="1">
        <p class="overline">Required documents</p>
        <h2 class="h2">What to bring with the form.</h2>
        <div style="display:grid;gap:1rem;margin-top:2rem">
          <div class="contact-line" style="color:rgba(251,247,240,.85)">{ICON_CHECK}<div><strong style="color:#fff">Completed admission form</strong><br><span class="small">Downloaded from this page or collected from the Front Office.</span></div></div>
          <div class="contact-line" style="color:rgba(251,247,240,.85)">{ICON_CHECK}<div><strong style="color:#fff">Birth certificate</strong><br><span class="small">An official copy for the applying student.</span></div></div>
          <div class="contact-line" style="color:rgba(251,247,240,.85)">{ICON_CHECK}<div><strong style="color:#fff">Immunisation record</strong><br><span class="small">The student&rsquo;s vaccination history.</span></div></div>
          <div class="contact-line" style="color:rgba(251,247,240,.85)">{ICON_CHECK}<div><strong style="color:#fff">School report cards</strong><br><span class="small">Covering the past two years, for students transferring from another school.</span></div></div>
        </div>
        <p class="small" style="margin-top:2rem;color:rgba(251,247,240,.65)">Additional documents may be requested for A Level entry. The current admission form is the authoritative list &mdash; please read it in full before submitting.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============ FORMS ============ -->
<section class="section" id="forms">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">Download</p>
      <h2 class="h2">Admission forms.</h2>
      <p class="lead" style="margin-top:1rem">Download the correct form for your child&rsquo;s stage, read the instructions carefully, and submit it to the Admissions Office.</p>
    </div>
    <div class="grid grid-2">
      <div class="contact-card" data-reveal>
        <p class="card-kicker">Playgroup to Class IX</p>
        <h3 class="h4" style="margin:.5rem 0 1rem">Admission Form</h3>
        <p class="small muted">Covers Playgroup, KG I, KG II and Classes I through IX. PDF document.</p>
        <div class="btn-row" style="margin-top:1.5rem"><a class="btn btn--primary btn--sm" href="{SITE["form_pg9"]}" rel="noopener">Download PDF {A}</a></div>
      </div>
      <div class="contact-card" data-reveal data-reveal-delay="1">
        <p class="card-kicker">AS &amp; A Level</p>
        <h3 class="h4" style="margin:.5rem 0 1rem">A Level Admission Form</h3>
        <p class="small muted">For entry into Class XI (AS Level). PDF document.</p>
        <div class="btn-row" style="margin-top:1.5rem"><a class="btn btn--primary btn--sm" href="{SITE["form_alevel"]}" rel="noopener">Download PDF {A}</a></div>
      </div>
    </div>
    <div class="callout" style="margin-top:2rem" data-reveal>
      <p class="small">Parents may also collect printed forms from the Front Office, or submit them directly to the Admissions Office. Completed forms are sorted by the Admissions Department, and application status is communicated by telephone.</p>
    </div>
  </div>
</section>

<!-- ============ ENQUIRY FORM ============ -->
<section class="section section--sand">
  <div class="container split split--wide-left">
    <div data-reveal>
      <p class="overline">Enquire</p>
      <h2 class="h2">Send us a question.</h2>
      <p class="lead" style="margin-top:1.25rem">Tell us which class you are enquiring about and we will come back to you with availability, requirements and next steps.</p>
      <div style="margin-top:2rem">
        <div class="contact-line">{ICON_CHECK}<div><strong>PG &ndash; Class I &amp; Admissions</strong><br><a href="tel:+8801755689482">01755 689 482</a> &middot; <a href="mailto:admission1@playpen.edu.bd">admission1@playpen.edu.bd</a></div></div>
        <div class="contact-line">{ICON_CHECK}<div><strong>Class II &ndash; VI &amp; Admissions</strong><br><a href="tel:+8801755515893">01755 515 893</a> &middot; <a href="mailto:admission2@playpen.edu.bd">admission2@playpen.edu.bd</a></div></div>
        <div class="contact-line">{ICON_CHECK}<div><strong>Class VII &ndash; XII &amp; Admissions</strong><br><a href="tel:+8801755693623">01755 693 623</a> &middot; <a href="mailto:admission3@playpen.edu.bd">admission3@playpen.edu.bd</a></div></div>
      </div>
      <p class="small muted" style="margin-top:1.5rem">Office hours: {SITE["office_hours"]}</p>
    </div>
    <div class="contact-card" data-reveal data-reveal-delay="1">
      <form class="form-grid" data-demo-form>
        <div class="field"><label for="a-name">Parent / guardian name</label><input id="a-name" name="name" type="text" required autocomplete="name"></div>
        <div class="field"><label for="a-phone">Phone number</label><input id="a-phone" name="phone" type="tel" required autocomplete="tel"></div>
        <div class="field"><label for="a-email">Email address</label><input id="a-email" name="email" type="email" required autocomplete="email"></div>
        <div class="field"><label for="a-class">Class applying for</label>
          <select id="a-class" name="class" required>
            <option value="">Select a class</option>
            <option>Playgroup</option><option>KG I</option><option>KG II</option>
            <option>Class I</option><option>Class II</option><option>Class III</option>
            <option>Class IV</option><option>Class V</option><option>Class VI</option>
            <option>Class VII</option><option>Class VIII</option><option>Class IX</option>
            <option>Class XI (AS / A Level)</option>
          </select>
        </div>
        <div class="field field--full"><label for="a-child">Child&rsquo;s name and age</label><input id="a-child" name="child" type="text"></div>
        <div class="field field--full"><label for="a-msg">Your question</label><textarea id="a-msg" name="message" rows="5"></textarea></div>
        <div class="field--full">
          <button class="btn btn--primary" type="submit">Send enquiry {A}</button>
          <p class="small" data-form-note hidden style="margin-top:1rem;color:var(--crimson)"></p>
        </div>
      </form>
    </div>
  </div>
</section>

<!-- ============ UNIFORM ============ -->
<section class="section" id="uniform">
  <div class="container">
    <div class="section-head" data-reveal>
      <p class="overline">School uniform</p>
      <h2 class="h2">What students wear.</h2>
      <p class="lead" style="margin-top:1rem">There is no uniform for Playgroup and Nursery classes; children should simply be dressed in casual wear. Compulsory uniforms begin from KG I onwards.</p>
    </div>
    <div class="grid grid-3" style="margin-bottom:3rem">
      <div class="callout" data-reveal>
        <h3 class="h5">From Class IV</h3>
        <p>Girls wear salwar-kameez. Boys wear full trousers.</p>
      </div>
      <div class="callout" data-reveal data-reveal-delay="1">
        <h3 class="h5">Footwear, Class X&ndash;XII</h3>
        <p>White keds or sneakers with white socks.</p>
      </div>
      <div class="callout" data-reveal data-reveal-delay="2">
        <h3 class="h5">Seasonal items</h3>
        <p>Red and black sweaters are available seasonally. Classes IX&ndash;XII may wear black sweaters &mdash; not hoodies or jackets.</p>
      </div>
    </div>
    <div class="split" style="align-items:start">
      <div data-reveal>
        <h3 class="h4" style="margin-bottom:1rem">Where to buy the uniform</h3>
        <p class="small muted" style="margin-bottom:1.5rem">Uniforms for KG I through Class XII must be tailored to school specifications at one of the two authorised branches.</p>
        <div class="contact-line">{ICON_CHECK}<div><strong>Gulshan branch</strong><br>Pladium Market, Shop #19<br><a href="tel:+8801708110010">01708 110 010</a> &middot; <a href="tel:+8801904439184">01904 439 184</a></div></div>
        <div class="contact-line">{ICON_CHECK}<div><strong>Bashundhara branch</strong><br>Rupayan Shopping Square, Shop 310<br><a href="tel:+8801708110009">01708 110 009</a></div></div>
      </div>
      <div class="callout callout--crimson" data-reveal data-reveal-delay="1">
        <h3 class="h5">Sportswear</h3>
        <p style="margin-top:.75rem">Sportswear must be bought from the school. Students wear the games uniform on the days they have Games classes, according to the routine.</p>
        <p style="margin-top:.75rem">Books and exercise copies are also available from the school bookshop, which is open 8:30 AM to 1:00 PM. Parents collect the yearly books and copies at the beginning of each session.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============ FAQ ============ -->
<section class="section section--sand" id="faq">
  <div class="container container--narrow">
    <div class="section-head" data-reveal>
      <p class="overline">Admissions FAQ</p>
      <h2 class="h2">Questions we are asked most.</h2>
    </div>
    <div class="accordion" data-accordion-single data-reveal>
      {_faq("Which classes are open for admission?", "Applications are accepted based on available space, and availability changes by class and by year. A Level admission for the academic year July 2026 &ndash; June 2027 is currently open. For every other class, please call the Admissions Office to confirm availability before submitting a form.")}
      {_faq("Where do I collect the admission form?", "Forms can be collected from the Front Office, or downloaded as a PDF from the <a href='#forms'>Download</a> section of this page. There is one form covering Playgroup to Class IX, and a separate A Level form.")}
      {_faq("What documents do I need to submit?", "A completed admission form, the child&rsquo;s birth certificate, their immunisation record, and school report cards covering the past two years. The admission form itself is the authoritative list &mdash; read it in full before submitting.")}
      {_faq("Is there an entrance test?", "Yes, from KG I upwards. Applicants for PG and Nursery go through an assessment rather than a written test. From KG I to Class IX there are written tests in English, Bengali and Mathematics. The Principal conducts interviews. Class XI admission is based on Mock Examination results together with O Level results.")}
      {_faq("How will I know the outcome?", "Application status is communicated by telephone, so please make sure the contact number on the form is one you can be reached on.")}
      {_faq("How are fees paid?", "Payment is made online through a school-authorised bank. Digital fee payment has been mandatory since the 2021&ndash;2022 academic year, and the portal supports EBL (Visa and Mastercard), DBBL, Nagad, bKash, Rocket, Upay and Epay.")}
      {_faq("Is transport available?", "Yes. The school has operated its own bus service since March 2014. Parents seeking bus service submit an application at the Administrative Office.")}
      {_faq("Is there a uniform?", "There is no uniform for Playgroup and Nursery &mdash; casual wear is fine. Compulsory uniform begins from KG I. See the <a href='#uniform'>uniform section</a> above for details and the two authorised tailoring branches.")}
      {_faq("What are the school office hours?", f"The Admissions Office can be reached between 9:00 AM and 1:00 PM. The school bookshop is open 8:30 AM to 1:00 PM.")}
      {_faq("How are A Level subjects chosen?", "A Level students take a minimum of three subjects from the nine offered. Subject combinations are discussed with the Senior Vice-Principal and Teacher In-Charge, who also advise on university requirements. See the <a href='academics.html#subjects'>subject lists</a> for what is currently offered.")}
      {_faq("Where is the school?", f"House 545/A, Road 19, Block J, Bashundhara Residential Area, Dhaka 1229. There is a map on the <a href='contact.html'>contact page</a>.")}
    </div>
  </div>
</section>

{cta_band()}
'''
