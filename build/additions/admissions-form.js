/* admissions-form: the online admission form on /admissions/how-to-apply/#forms (2026-10-22, founder request).
   Two forms, the same fields and order as the school's own PDFs (read from the files on 2026-10-22):
     pg  Admission Form, Playgroup to Class X (Admission-Form-2025-2026-Final.pdf, 1 page)
     as  AS Level Admission Form (AS-LEVEL-FORM-2025-2026.pdf, 2 pages)
   The parent fills it in, then "Download filled form" builds an A4 copy in the school's layout and opens the print dialog
   (Save as PDF or print). "Print blank form" prints the same layout empty.
   "Send the form online" (website portal, 2026-10-23) sends the same answers to the School Desk through
   window.PPPortal (build/additions/portal.js); the answer is a code (APP-XXXXXX), kept in localStorage and printed on the
   downloaded copy. The button shows only when the portal has a Desk to send to; if the Desk cannot be reached, the status
   line says so and Download works as before.
   Review 2026-10-23: the online copy sends only the minimum (SEND_KEYS: first name, class, year of birth, gender, the
   parents' names, emails and contact number, previous school, a yes for a sibling at Playpen, AS subjects). Address,
   religion, nationality, health, the emergency contact, the sibling names and the O Level grades stay on the printed form.
   The sender ticks that they are the parent or guardian; the visit code goes only with the "join my visits" tick. After a
   send the button reads "Sent as APP-..." until the answers change; a PDF printed after a change says so.
   A draft is kept in this browser only (localStorage, wrapped in try/catch). Markup: [data-admission-form] in the page. */
PP.ready(function () {
  'use strict';
  var root = PP.$('[data-admission-form]');
  if (!root) return;
  var doc = document;
  var html = doc.documentElement;
  var form = PP.$('.af__form', root);
  var status = PP.$('.af__status', root);
  var tabs = PP.$$('[data-af-tab]', root);
  var STORE = 'pp:admission-form:';
  var CODE_KEY = STORE + 'code:';
  var APP_RE = /^APP-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{6}$/;
  var FAIL = 'We could not send the form online. Download it and hand it in at the Front Office, or call the admissions line.';
  var SENT_KEY = STORE + 'sent:';
  /* what the online copy may carry, per form (the server keeps the same list) */
  var SEND_KEYS = {
    pg: ['date', 'year', 'name', 'class', 'birth_year', 'gender', 'f_name', 'm_name', 'f_email', 'm_email', 'res_phone', 'prev', 'sibling'],
    as: ['session', 'name', 'birth_year', 'gender', 'email', 'mobile', 'f_name', 'm_name', 'f_email', 'm_email', 'f_phone', 'm_phone', 'last_school', 'sibling', 'subj']
  };
  var SEND_LABELS = { birth_year: 'Year of birth', sibling: 'Sibling or cousin studying in Playpen', name: 'Student’s first name' };
  var CREST = (doc.body.getAttribute('data-root') || '../../') + 'assets/brand/logo-crest-256.webp';
  var CLASSES = ['Playgroup', 'Nursery', 'KG I', 'KG II', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V',
    'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function F(name, label, type, o) { o = o || {}; o.name = name; o.label = label; o.type = type || 'text'; return o; }
  function H(label) { return { type: 'heading', label: label }; }

  function parent(p, who, occ) {
    return [
      H(who),
      F(p + '_name', who + '’s full name', 'text', { upper: true, wide: true }),
      F(p + '_qual', 'Educational qualification'),
      F(p + '_occ', occ),
      F(p + '_desig', 'Designation'),
      F(p + '_email', 'Email', 'email'),
      F(p + '_office', 'Office address and contact number', 'textarea', { wide: true })
    ];
  }

  var FORMS = {
    pg: {
      title: 'Admission Form',
      sub: 'Playgroup to Class X',
      file: 'Playpen-admission-form',
      sections: [
        { t: 'Form details', fields: [F('date', 'Date', 'date', { today: true }), F('year', 'Academic year applying for', 'text', { ph: 'For example 2026–2027' })] },
        { n: 'A', t: 'Personal information', fields: [
          F('name', 'Student’s name', 'text', { req: true, upper: true, wide: true }),
          F('class', 'Class applying for', 'select', { req: true, options: CLASSES }),
          F('dob', 'Date of birth', 'date', { req: true, age: true }),
          F('gender', 'Gender', 'radio', { options: ['Male', 'Female'] }),
          F('nationality', 'Nationality'),
          F('religion', 'Religion')
        ] },
        { n: 'B', t: 'Family details', fields: [].concat(
          parent('f', 'Father', 'Profession'),
          parent('m', 'Mother', 'Occupation').filter(function (f) { return f.name !== 'm_desig'; })
        ) },
        { n: 'C', t: 'Residential address and contact number', fields: [
          F('res_addr', 'Residential address', 'textarea', { req: true, wide: true }),
          F('res_phone', 'Contact number', 'tel', { req: true })
        ] },
        { n: 'D', t: 'Second person to contact in an emergency', note: 'Must be different from the residential address and contact number.', fields: [
          F('em_name', 'Name'), F('em_rel', 'Relationship with the applicant'),
          F('em_addr', 'Address', 'textarea', { wide: true }), F('em_phone', 'Contact number', 'tel')
        ] },
        { n: 'E', t: 'Previous school attended', fields: [F('prev', 'Previous school', 'text', { wide: true })] },
        { n: 'F', t: 'Single parent', fields: [F('single', 'Single parent', 'radio', { options: ['Yes', 'No'] })] },
        { n: 'G', t: 'Siblings', fields: [F('bro', 'Brothers', 'number'), F('sis', 'Sisters', 'number')] },
        { n: 'H', t: 'Sibling or cousin studying in Playpen', fields: [F('kin', 'Sibling or cousin studying in Playpen', 'table', { cols: ['Name', 'Relationship', 'Class'], rows: 3 })] },
        { n: 'I', t: 'Referred to Playpen by', fields: [F('ref', 'Referred by', 'text', { wide: true })] }
      ]
    },
    as: {
      title: 'Admission Form',
      sub: 'Advanced Subsidiary (AS) Level',
      file: 'Playpen-AS-Level-admission-form',
      sections: [
        { t: 'Form details', fields: [F('session', 'Session applying for', 'text', { ph: 'For example 2026–2027' })] },
        { n: '1', t: 'Personal details', fields: [
          F('name', 'Student’s name (as in passport)', 'text', { req: true, upper: true, wide: true }),
          F('dob', 'Date of birth (as in passport)', 'date', { req: true }),
          F('gender', 'Gender', 'radio', { options: ['Male', 'Female'] }),
          F('email', 'Email', 'email'),
          F('mobile', 'Mobile phone', 'tel', { req: true }),
          F('land', 'Land phone', 'tel'),
          F('nationality', 'Nationality'),
          F('religion', 'Religion')
        ] },
        { n: '2', t: 'Parents’ details', fields: [].concat(
          parent('f', 'Father', 'Current occupation'), [F('f_phone', 'Father’s contact number', 'tel')],
          parent('m', 'Mother', 'Current occupation'), [F('m_phone', 'Mother’s contact number', 'tel')],
          [H('Home'), F('res_addr', 'Residence address', 'textarea', { req: true, wide: true })]
        ) },
        { n: '3', t: 'Emergency contact', fields: [
          F('em_name', 'Name'), F('em_rel', 'Relationship with the applicant'),
          F('em_addr', 'Address', 'textarea', { wide: true }), F('em_phone', 'Contact number', 'tel')
        ] },
        { n: '4', t: 'Family and health', fields: [
          F('single', 'Single parent', 'radio', { options: ['Yes', 'No'] }),
          F('health', 'Health issue of the student, if any', 'text', { wide: true }),
          F('bro', 'Brothers', 'number'), F('sis', 'Sisters', 'number'),
          F('kin', 'Sibling or cousin studying in Playpen', 'table', { cols: ['Name', 'Relationship', 'Class'], rows: 2 })
        ] },
        { n: '5', t: 'Academic performance', fields: [
          F('last_school', 'Last educational institution attended', 'text', { wide: true }),
          F('ol_year', 'Year of O Level exam'),
          F('ol', 'O Level results (if results are not yet published, write the subjects only)', 'table', { cols: ['Subject', 'Grade'], rows: 10, numbered: true })
        ] },
        { n: '6', t: 'Choice of subjects for A Level', note: 'Tick at least 3. At A2 Level students take both P3 and S1 together. Subjects cannot be dropped or changed after one month. A subject runs only when at least 10 students choose it. Every subject chosen must also have been taken at O Level.', fields: [
          F('subj', 'Subjects', 'subjects', { min: 3, list: [
            ['English Language'], ['Physics'], ['Chemistry', 'Business'], ['Further Mathematics', 'Psychology'],
            ['Pure Mathematics (P1) and Mechanics M'], ['Economics'], ['Computer Science'], ['Biology', 'Accounting'],
            ['Environmental Management']
          ] })
        ] },
        { n: '7', t: 'Hobbies and achievements', fields: [
          F('hobbies', 'Hobbies', 'text', { wide: true }), F('achieve', 'Other achievements', 'textarea', { wide: true })
        ] },
        { n: '8', t: 'Undertaking', note: 'We declare that the information in this admission form and all of its attachments is true, correct and complete. Each person signs the printed form.', fields: [
          F('u_father', 'Father’s full name', 'text', { upper: true }), F('u_mother', 'Mother’s full name', 'text', { upper: true }),
          F('u_student', 'Student’s full name', 'text', { upper: true, wide: true })
        ] }
      ]
    }
  };

  var current = 'pg';
  try { if (localStorage.getItem(STORE + 'tab') === 'as') current = 'as'; } catch (e) { /* storage blocked */ }

  /* ---- rendering the on-screen form ---- */
  function id(name) { return 'af-' + current + '-' + name; }
  function fieldHtml(f) {
    var cls = 'field af__f' + (f.wide ? ' af__f--wide' : '');
    var req = f.req ? ' required aria-required="true"' : '';
    var star = f.req ? '<span class="af__req" aria-hidden="true"> *</span>' : '';
    var err = '<p id="' + id(f.name) + '-err" class="field__error" aria-live="polite"></p>';
    var desc = ' aria-describedby="' + id(f.name) + '-err"';
    if (f.type === 'heading') return '<h4 class="af__sub">' + esc(f.label) + '</h4>';
    if (f.type === 'radio') {
      return '<fieldset class="field-group af__f"><legend>' + esc(f.label) + '</legend><div class="af__choices">' +
        f.options.map(function (o) {
          return '<label class="choice"><input type="radio" name="' + f.name + '" value="' + esc(o) + '"> ' + esc(o) + '</label>';
        }).join('') + '</div></fieldset>';
    }
    if (f.type === 'select') {
      return '<div class="' + cls + '"><label for="' + id(f.name) + '">' + esc(f.label) + star + '</label><select id="' + id(f.name) +
        '" name="' + f.name + '"' + req + desc + '><option value="">Choose</option>' +
        f.options.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>' + err + '</div>';
    }
    if (f.type === 'textarea') {
      return '<div class="' + cls + '"><label for="' + id(f.name) + '">' + esc(f.label) + star + '</label><textarea id="' + id(f.name) +
        '" name="' + f.name + '" rows="2"' + req + desc + '></textarea>' + err + '</div>';
    }
    if (f.type === 'table') {
      var head = (f.numbered ? '<th scope="col" class="af__no">No.</th>' : '') + f.cols.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('');
      var body = '';
      for (var r = 0; r < f.rows; r++) {
        body += '<tr>' + (f.numbered ? '<td class="af__no">' + (r + 1) + '</td>' : '') + f.cols.map(function (c, ci) {
          return '<td data-label="' + esc(c) + '"><input type="text" name="' + f.name + '_' + r + '_' + ci + '" aria-label="' + esc(c + ', row ' + (r + 1)) + '"></td>';
        }).join('') + '</tr>';
      }
      return '<div class="af__f af__f--wide"><p class="af__tlabel">' + esc(f.label) + '</p><div class="af__twrap"><table class="af__table"><thead><tr>' +
        head + '</tr></thead><tbody>' + body + '</tbody></table></div></div>';
    }
    if (f.type === 'subjects') {
      return '<fieldset class="field-group af__f af__f--wide" id="' + id(f.name) + '"><legend class="visually-hidden">' + esc(f.label) + '</legend><div class="af__subjects">' +
        f.list.map(function (set) {
          var boxes = set.map(function (s) {
            return '<label class="choice"><input type="checkbox" name="subj" value="' + esc(s) + '"> ' + esc(s) + '</label>';
          });
          return '<div class="af__subj' + (set.length > 1 ? ' af__subj--or' : '') + '">' + boxes.join('<span class="af__or">or</span>') + '</div>';
        }).join('') + '</div><p class="af__count" aria-live="polite"></p>' +
        '<p id="' + id(f.name) + '-err" class="field__error" aria-live="polite"></p></fieldset>';
    }
    var type = f.type === 'number' ? 'number" min="0" max="20" inputmode="numeric' : f.type;
    var auto = f.type === 'email' ? ' autocomplete="email"' : f.type === 'tel' ? ' autocomplete="tel" inputmode="tel"' : '';
    return '<div class="' + cls + (f.upper ? ' af__f--upper' : '') + '"><label for="' + id(f.name) + '">' + esc(f.label) + star + '</label><input id="' + id(f.name) +
      '" name="' + f.name + '" type="' + type + '"' + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : '') + auto + req + desc + '>' +
      (f.age ? '<p class="af__age field__hint" aria-live="polite"></p>' : '') + err + '</div>';
  }
  function render() {
    var spec = FORMS[current];
    form.innerHTML = spec.sections.map(function (s) {
      return '<section class="af__sec" aria-label="' + esc((s.n ? s.n + '. ' : '') + s.t) + '">' +
        '<div class="af__head">' + (s.n ? '<span class="af__n" aria-hidden="true">' + esc(s.n) + '</span>' : '') +
        '<h3 class="af__title">' + esc(s.t) + '</h3>' + (s.note ? '<p class="af__note">' + esc(s.note) + '</p>' : '') + '</div>' +
        '<div class="af__grid">' + s.fields.map(fieldHtml).join('') + '</div></section>';
    }).join('');
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-af-tab') === current;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    restore();
    update();
    showSent(storedCode(), null, false);
    var asNote = PP.$('.af__as-note', root);
    if (asNote) asNote.hidden = current !== 'as';
    syncSendButton();
  }

  /* ---- values, draft, live bits ---- */
  function values() {
    var v = {};
    PP.$$('input, select, textarea', form).forEach(function (el) {
      if (el.type === 'radio') { if (el.checked) v[el.name] = el.value; }
      else if (el.type === 'checkbox') { if (el.checked) (v[el.name] = v[el.name] || []).push(el.value); }
      else if (el.value.trim()) v[el.name] = el.value.trim();
    });
    return v;
  }
  function save() { try { localStorage.setItem(STORE + current, JSON.stringify(values())); } catch (e) { /* storage blocked */ } }
  function restore() {
    var v = {};
    try { v = JSON.parse(localStorage.getItem(STORE + current) || '{}') || {}; } catch (e) { v = {}; }
    PP.$$('input, select, textarea', form).forEach(function (el) {
      var val = v[el.name];
      if (el.type === 'radio') el.checked = val === el.value;
      else if (el.type === 'checkbox') el.checked = Array.isArray(val) && val.indexOf(el.value) > -1;
      else if (val != null) el.value = val;
    });
    var d = PP.$('[name="date"]', form);
    if (d && !d.value) { var now = new Date(); d.value = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10); } /* the family's own day, not UTC */
  }
  function ageText(dob, on) {
    if (!dob) return '';
    var b = new Date(dob + 'T00:00:00'), t = on ? new Date(on + 'T00:00:00') : new Date();
    if (isNaN(b) || isNaN(t) || b > t) return '';
    var m = (t.getFullYear() - b.getFullYear()) * 12 + (t.getMonth() - b.getMonth()) - (t.getDate() < b.getDate() ? 1 : 0);
    return Math.floor(m / 12) + ' years ' + (m % 12) + ' months';
  }
  function update() {
    var v = values();
    var age = PP.$('.af__age', form);
    if (age) { var a = ageText(v.dob, v.date); age.textContent = a ? 'Age on the form date: ' + a : ''; }
    var count = PP.$('.af__count', form);
    if (count) {
      var picked = v.subj || [];
      count.textContent = 'Total number of subjects: ' + picked.length + (picked.length < 3 ? ' (choose at least 3)' : '');
      PP.$$('.af__subj--or', form).forEach(function (pair) {
        var boxes = PP.$$('input', pair);
        boxes.forEach(function (b) { b.disabled = boxes.some(function (o) { return o !== b && o.checked; }); });
      });
    }
  }
  PP.on(form, 'input', function () { update(); save(); syncSendButton(); });
  PP.on(form, 'change', function () { update(); save(); syncSendButton(); });
  PP.on(form, 'submit', function (e) { e.preventDefault(); });

  tabs.forEach(function (t) {
    PP.on(t, 'click', function () {
      current = t.getAttribute('data-af-tab');
      try { localStorage.setItem(STORE + 'tab', current); } catch (e) { /* storage blocked */ }
      say('');
      render();
    });
    PP.on(t, 'keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var other = tabs[(tabs.indexOf(t) + 1) % tabs.length];
      other.focus(); other.click();
    });
  });
  function say(text) { if (status) status.textContent = text; }

  /* ---- checking before download ---- */
  function check() {
    var first = null, v = values();
    PP.$$('[required]', form).forEach(function (el) {
      var err = doc.getElementById(el.id + '-err');
      var bad = !el.value.trim();
      el.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (err) err.textContent = bad ? 'Please fill this in.' : '';
      if (bad && !first) first = el;
    });
    PP.$$('input[type="email"]', form).forEach(function (el) {
      var err = doc.getElementById(el.id + '-err');
      if (el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
        el.setAttribute('aria-invalid', 'true'); if (err) err.textContent = 'Check the email address.'; if (!first) first = el;
      }
    });
    var subj = doc.getElementById(id('subj'));
    if (subj) {
      var serr = doc.getElementById(id('subj') + '-err');
      var few = (v.subj || []).length < 3;
      if (serr) serr.textContent = few ? 'Choose at least 3 subjects.' : '';
      if (few && !first) first = PP.$('input', subj);
    }
    if (first) { first.focus(); say('Some answers are missing. They are marked in the form.'); }
    return !first;
  }

  /* ---- the printable A4 copy ---- */
  function line(label, value, wide) {
    return '<div class="afp__row' + (wide ? ' afp__row--wide' : '') + '"><span class="afp__k">' + esc(label) + '</span><span class="afp__v">' + esc(value || '') + '</span></div>';
  }
  function box(on) { return '<span class="afp__box">' + (on ? '&#10003;' : '') + '</span>'; }
  function printHtml(blank) {
    var spec = FORMS[current], v = blank ? {} : values();
    var out = '<header class="afp__head"><img src="' + CREST + '" alt="" width="64" height="64"><div><p class="afp__school">Playpen School</p>' +
      '<p class="afp__addr">House 545/A, Road 19, Block J, Bashundhara R/A, Dhaka 1229</p></div>' +
      '<div class="afp__title"><p class="afp__t">' + esc(spec.title) + '</p><p class="afp__s">' + esc(spec.sub) + '</p>' +
      (current === 'pg' ? '<p class="afp__receipt">Money receipt no. <span></span></p>' : '') + '</div></header>' +
      (!blank && storedCode() ? '<p class="afp__code">' + (sentUnchanged() ? 'Online application code: ' : 'Changed after it was sent online (code ') + esc(storedCode()) + (sentUnchanged() ? '' : ')') + '</p>' : '') +
      '<p class="afp__hint">Please fill in all information clearly in BLOCK LETTERS.</p>';
    spec.sections.forEach(function (s) {
      out += '<section class="afp__sec"><h2 class="afp__h">' + (s.n ? esc(s.n) + '. ' : '') + esc(s.t) + '</h2>' + (s.note ? '<p class="afp__note">' + esc(s.note) + '</p>' : '') + '<div class="afp__grid">';
      s.fields.forEach(function (f) {
        var val = v[f.name];
        if (f.type === 'heading') { out += '<p class="afp__sub">' + esc(f.label) + '</p>'; return; }
        if (f.type === 'radio') {
          out += '<div class="afp__row"><span class="afp__k">' + esc(f.label) + '</span><span class="afp__opts">' +
            f.options.map(function (o) { return box(val === o) + esc(o); }).join('&ensp;') + '</span></div>';
          return;
        }
        if (f.type === 'table') {
          out += '<table class="afp__table"><thead><tr>' + (f.numbered ? '<th>No.</th>' : '') + f.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
          for (var r = 0; r < f.rows; r++) {
            out += '<tr>' + (f.numbered ? '<td>' + (r + 1) + '</td>' : '') + f.cols.map(function (c, ci) { return '<td>' + esc(v[f.name + '_' + r + '_' + ci] || '') + '</td>'; }).join('') + '</tr>';
          }
          out += '</tbody></table>';
          return;
        }
        if (f.type === 'subjects') {
          var picked = v.subj || [];
          out += '<div class="afp__subjects">' + f.list.map(function (set) {
            return '<span>' + set.map(function (sj) { return box(picked.indexOf(sj) > -1) + esc(sj); }).join(' <em>or</em> ') + '</span>';
          }).join('') + '</div>' + line('Total number of subjects', blank ? '' : String(picked.length));
          return;
        }
        var shown = val || '';
        if (f.upper) shown = shown.toUpperCase();
        if (f.type === 'date' && shown) shown = shown.split('-').reverse().join(' / ');
        out += line(f.label, shown, f.wide || f.type === 'textarea');
        if (f.age) out += line('Age', blank ? '' : ageText(v.dob, v.date));
      });
      out += '</div></section>';
    });
    if (current === 'pg') {
      out += '<section class="afp__office"><h2 class="afp__h">For official use only</h2><p>Decision:</p>' +
        '<p>a) ______ Recommended for admission to Class: ____________ Section: ____________</p>' +
        '<p>b) ______ Recommended for waiting list&emsp;&emsp;c) ______ Not recommended</p>' +
        '<div class="afp__signs"><span>Principal</span><span>Vice Principal, Academic</span></div></section>' +
        '<p class="afp__foot">* Please submit the form in the School along with Tk. 1000.</p>';
    } else {
      out += '<section class="afp__sec"><div class="afp__signs afp__signs--3"><span>Father’s signature</span><span>Mother’s signature</span><span>Student’s signature</span></div></section>' +
        '<section class="afp__sec"><h2 class="afp__h">Submit this form with</h2><ol class="afp__docs"><li>2 recent passport-size photographs of the student in school uniform</li>' +
        '<li>Copy of passport</li><li>Copy of the last report card and mock results from the previous school (new students)</li>' +
        '<li>Copy of the O Level statement of result, when it is published</li></ol></section>' +
        '<section class="afp__office"><h2 class="afp__h">For office use only</h2><p>Decision:</p>' +
        '<p>a) ______ Recommended for admission in A Level&emsp;&emsp;b) ______ Recommended for waiting list</p>' +
        '<p>c) ______ Not recommended (reason below)&emsp;&emsp;d) Comments: ________________________________</p>' +
        '<div class="afp__signs"><span>Principal</span></div></section>' +
        '<p class="afp__foot">Contact: 01755 693 623, 01755 515 885 · info@playpen.edu.bd · www.playpen.edu.bd</p>';
    }
    out += '<p class="afp__made">' + (blank ? 'Blank copy printed from the school website.' : 'Filled in on the school website on ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + '.') + ' Please check every answer before you sign.</p>';
    return out;
  }
  function printSheet(blank) {
    if (!window.print) return;
    var sheet = doc.createElement('div');
    sheet.className = 'af-print';
    sheet.innerHTML = printHtml(blank);
    doc.body.appendChild(sheet);
    html.classList.add('af-printing');
    var oldTitle = doc.title;
    var v = values();
    doc.title = FORMS[current].file + (blank ? '-blank' : (v.name ? '-' + v.name.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') : ''));
    var cleaned = false;
    function done() {
      if (cleaned) return;
      cleaned = true;
      html.classList.remove('af-printing');
      doc.title = oldTitle;
      if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
      window.removeEventListener('afterprint', done);
    }
    window.addEventListener('afterprint', done);
    var img = PP.$('img', sheet);
    function go() { window.print(); window.setTimeout(done, 60000); }
    if (img && !img.complete) { img.onload = img.onerror = go; } else { go(); }
  }

  PP.$$('[data-af-action]', root).forEach(function (btn) {
    var timer = null;
    PP.on(btn, 'click', function () {
      var act = btn.getAttribute('data-af-action');
      if (act === 'download') {
        if (!check()) return;
        say('In the print window, choose “Save as PDF” to download, or pick your printer.');
        printSheet(false);
      } else if (act === 'submit') {
        sendOnline(btn);
      } else if (act === 'blank') {
        say('');
        printSheet(true);
      } else if (act === 'clear') {
        var label = PP.$('.btn__label', btn) || btn;
        if (!btn.classList.contains('is-armed')) {
          btn.classList.add('is-armed');
          label.textContent = 'Click again to clear';
          timer = window.setTimeout(function () { btn.classList.remove('is-armed'); label.textContent = 'Clear form'; }, 4000);
          return;
        }
        window.clearTimeout(timer);
        btn.classList.remove('is-armed');
        label.textContent = 'Clear form';
        try { localStorage.removeItem(STORE + current); localStorage.removeItem(CODE_KEY + current); localStorage.removeItem(SENT_KEY + current); } catch (e) { /* storage blocked */ }
        render();
        say('The form is empty again.');
      }
    });
  });

  /* ---- sending online (website portal) ---- */
  function storedCode() {
    var c = null;
    try { c = localStorage.getItem(CODE_KEY + current); } catch (e) { c = null; }
    return APP_RE.test(c || '') ? c : null;
  }
  /* the online copy: only SEND_KEYS; the date of birth becomes its year, the name its first word, the sibling table a yes */
  function sendValues(v) {
    var out = {}, keys = SEND_KEYS[current];
    var src = {};
    for (var k in v) if (Object.prototype.hasOwnProperty.call(v, k)) src[k] = v[k];
    if (src.dob && /^(19|20)\d{2}/.test(src.dob)) src.birth_year = src.dob.slice(0, 4);
    var kin = Object.keys(src).some(function (k2) { return k2.indexOf('kin_') === 0 && String(src[k2]).trim(); });
    if (kin) src.sibling = 'Yes';
    if (src.name) src.name = String(src.name).trim().split(/\s+/)[0];
    keys.forEach(function (k3) { if (src[k3] != null && src[k3] !== '' && !(Array.isArray(src[k3]) && !src[k3].length)) out[k3] = src[k3]; });
    return out;
  }
  /* the online copy by section, in the form's own order */
  function sectionsFor(sv) {
    var out = [];
    FORMS[current].sections.forEach(function (s) {
      var fields = [];
      s.fields.forEach(function (f) {
        if (f.type === 'heading') return;
        var name = f.name === 'dob' ? 'birth_year' : f.name === 'kin' ? 'sibling' : f.name;
        var val = sv[name];
        if (val == null || val === '' || (Array.isArray(val) && !val.length)) return;
        fields.push({ name: name, label: SEND_LABELS[name] || f.label, value: val });
      });
      if (fields.length) out.push({ n: s.n || null, title: s.t, fields: fields });
    });
    return out;
  }
  /* a short fingerprint of the answers, so a later change is noticed (not a copy of them) */
  function hashOf(v) {
    var s = JSON.stringify(v), h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return String(h >>> 0);
  }
  function sentHash() { try { return localStorage.getItem(SENT_KEY + current); } catch (e) { return null; } }
  function sentUnchanged() { var c = storedCode(); return !!(c && sentHash() === hashOf(values())); }
  /* the Send button: "Sent as APP-..." while the answers match what was sent */
  function syncSendButton() {
    var btn = PP.$('[data-af-action="submit"]', root);
    if (!btn) return;
    var label = PP.$('.btn__label', btn) || btn;
    var c = storedCode();
    if (c && sentUnchanged()) { btn.disabled = true; label.textContent = 'Sent as ' + c; }
    else { btn.disabled = false; label.textContent = c ? 'Send again as a new form' : 'Send the form online'; }
  }
  function showSent(code, v, focus) {
    var box = PP.$('.af__sent', root);
    var P = window.PPPortal;
    if (!code || !P || !P.showCode) { if (box) box.parentNode.removeChild(box); return; }
    if (!box) {
      box = doc.createElement('div');
      box.className = 'af__sent';
      var bar = PP.$('.af__bar', root);
      bar.parentNode.insertBefore(box, bar.nextSibling);
    }
    var cls = current === 'as' ? 'Class XI, AS Level' : ((v || values()).class || '');
    P.showCode(box, 'application', code, { classRaw: cls, focus: focus !== false });
  }
  var sending = false;
  function sendOnline(btn) {
    if (sending) return;
    var P = window.PPPortal;
    if (!check()) return;
    if (sentUnchanged()) { syncSendButton(); return; }
    var phoneKey = current === 'pg' ? 'res_phone' : 'mobile';
    var phoneEl = doc.getElementById(id(phoneKey)), phoneErr = doc.getElementById(id(phoneKey) + '-err');
    if (phoneEl && P && P.isMobile && !P.isMobile(phoneEl.value)) {
      phoneEl.setAttribute('aria-invalid', 'true');
      if (phoneErr) phoneErr.textContent = 'Enter a Bangladeshi mobile number, for example 017XX XXX XXX.';
      phoneEl.focus();
      say('To send online, the contact number must be a Bangladeshi mobile number.');
      return;
    }
    var agree = doc.getElementById('af-guardian'), agreeErr = doc.getElementById('af-guardian-err');
    if (agree && !agree.checked) {
      agree.setAttribute('aria-invalid', 'true');
      if (agreeErr) agreeErr.textContent = 'Tick this box to send the form online.';
      agree.focus();
      say('Tick the box above the buttons to send the form online.');
      return;
    }
    if (agree) agree.removeAttribute('aria-invalid');
    if (agreeErr) agreeErr.textContent = '';
    if (!P || !P.api || !P.submit) { say(FAIL); return; }
    var joinBox = doc.getElementById('af-join');
    var v = values(), sentFor = current, sv = sendValues(v), sentHashNow = hashOf(v);
    var consent = { whatsapp: false, sms: false, email: false };
    PP.$$('input[name="af-consent"]', root).forEach(function (b) { if (consent.hasOwnProperty(b.value)) consent[b.value] = b.checked; });
    var label = PP.$('.btn__label', btn) || btn;
    sending = true;
    btn.disabled = true;
    label.textContent = 'Sending...';
    say('Sending the form...');
    P.submit('application', { form: sentFor, values: sv, sections: sectionsFor(sv), consent: consent, guardian: true, joinVisits: !!(joinBox && joinBox.checked && !joinBox.closest('[hidden]')) }).then(function (r) {
      sending = false;
      btn.disabled = false;
      label.textContent = 'Send the form online';
      if (r && r.ok) {
        try { localStorage.setItem(CODE_KEY + sentFor, r.code); localStorage.setItem(SENT_KEY + sentFor, sentHashNow); } catch (e) { /* storage blocked */ }
        syncSendButton();
        if (current !== sentFor) { say('The form was sent online. Its code is ' + r.code + '.'); return; }
        say('Sent online. Download the form now and the copy shows the code.');
        showSent(r.code, v, true);
        return;
      }
      if (r && r.error === 'invalid' && r.fields && current === sentFor) {
        var first = null;
        Object.keys(r.fields).forEach(function (k) {
          var input = doc.getElementById(id(k)), err = doc.getElementById(id(k) + '-err');
          if (err) err.textContent = String(r.fields[k] || 'Please check this answer.');
          if (input) { input.setAttribute('aria-invalid', 'true'); if (!first) first = input; }
        });
        if (first) { first.focus(); say('Some answers need a change. They are marked in the form.'); return; }
      }
      say(FAIL);
      syncSendButton();
    }, function () {
      sending = false;
      btn.disabled = false;
      label.textContent = 'Send the form online';
      say(FAIL);
      syncSendButton();
    });
  }
  PP.on(doc.getElementById('af-guardian'), 'change', function () {
    var a = doc.getElementById('af-guardian'), e = doc.getElementById('af-guardian-err');
    if (a && a.checked) { a.removeAttribute('aria-invalid'); if (e) e.textContent = ''; }
  });
  /* the join tick shows only while this browser's visits are counted */
  var joinRow = PP.$('.af__join', root);
  if (joinRow && window.PPPortal && !window.PPPortal.counting) joinRow.hidden = true;

  root.classList.add('is-ready');
  render();
});
