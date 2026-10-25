# admissions-form: online admission form (2026-10-22)

**Where:** `/admissions/how-to-apply/#forms`. **Files:** `build/additions/admissions-form.js` and `.css`; markup in
`build/pages/admissions/how-to-apply.html` (`[data-admission-form]`).

**What it does**
- Two tabs: *Playgroup to Class X* and *AS and A Level (Class XI)*. Fields, order and section letters follow the
  school's own PDFs (`Admission-Form-2025-2026-Final.pdf`, `AS-LEVEL-FORM-2025-2026.pdf`, read 2026-10-22).
- **Download filled form (PDF):** checks the required fields (name, class, date of birth, contact, address; at least 3
  A Level subjects), builds an A4 copy (`.af-print`) and opens the print dialog. The page title becomes the file name
  (`Playpen-admission-form-<Student-Name>`), so "Save as PDF" names the file.
- **Print blank form:** the same A4 layout, empty. The school's own PDF links stay below it.
- The A Level "or" pairs (Chemistry/Business, Further Mathematics/Psychology, Biology/Accounting) lock each other.
- Age is worked out from the date of birth and the form date (Playgroup form).
- **Sends nothing.** The draft is kept in the visitor's browser (`localStorage` key `pp:admission-form:<pg|as>`) and
  removed with *Clear form*.

**To change a field:** edit the `FORMS` object at the top of the script, then run `python build/build.py --only admissions/how-to-apply`.

**To confirm with the school:** that a form printed from this page is accepted in place of the printed form, and the
academic year to show.
