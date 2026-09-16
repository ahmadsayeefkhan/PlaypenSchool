# Redirect Map

**Playpen School · old WordPress URLs → new URLs**

Every existing URL must resolve with a **301 permanent redirect**. Skipping this loses the school's accumulated search ranking overnight — several of these pages have been indexed since 2020.

---

## Apache (`.htaccess`)

```apache
RewriteEngine On

# --- About ---------------------------------------------------------------
RewriteRule ^about/?$                          /about.html           [R=301,L]
RewriteRule ^our-history/?$                    /about.html           [R=301,L]
RewriteRule ^mission-vision-and-values/?$      /about.html#values    [R=301,L]
RewriteRule ^school-administration/?$          /leadership.html      [R=301,L]
RewriteRule ^new-campus/?$                     /campus.html          [R=301,L]
RewriteRule ^child-protection-policy/?$        /campus-services.html#safeguarding [R=301,L]
RewriteRule ^playpen-alumni-association/?$     /alumni.html          [R=301,L]
RewriteRule ^career-at-playpen/?$              /careers.html         [R=301,L]
RewriteRule ^contact-us/?$                     /contact.html         [R=301,L]

# --- Academics -----------------------------------------------------------
RewriteRule ^elementary-school/?$              /academics.html#elementary   [R=301,L]
RewriteRule ^junior-school/?$                  /academics.html#junior       [R=301,L]
RewriteRule ^middle-school/?$                  /academics.html#middle       [R=301,L]
RewriteRule ^senior-school/?$                  /academics.html#senior       [R=301,L]
RewriteRule ^library/?$                        /academics.html#facilities   [R=301,L]
RewriteRule ^laboratories/?$                   /academics.html#facilities   [R=301,L]
RewriteRule ^student-support/?$                /academics.html#support      [R=301,L]
RewriteRule ^counsellor/?$                     /academics.html#support      [R=301,L]
RewriteRule ^examinations/?$                   /academics.html#examinations [R=301,L]
RewriteRule ^achievements-of-playpen-students/?$ /achievements.html         [R=301,L]
RewriteRule ^disciplinary-committee/?$         /campus-services.html#policies [R=301,L]
RewriteRule ^the-identity-card/?$              /campus-services.html#policies [R=301,L]

# --- Admissions ----------------------------------------------------------
RewriteRule ^admission-procedure/?$            /admissions.html          [R=301,L]
RewriteRule ^the-school-uniform/?$             /admissions.html#uniform  [R=301,L]
RewriteRule ^code-of-conduct/?$                /campus-services.html#policies [R=301,L]

# --- Student life --------------------------------------------------------
RewriteRule ^annual-sports/?$                  /student-life.html#sports   [R=301,L]
RewriteRule ^extra-curricular-activities/?$    /student-life.html          [R=301,L]
RewriteRule ^community-service/?$              /student-life.html#service  [R=301,L]
RewriteRule ^cultural-programme/?$             /student-life.html#arts     [R=301,L]
RewriteRule ^science-fair/?$                   /student-life.html#science  [R=301,L]
RewriteRule ^workshop-for-students/?$          /student-life.html          [R=301,L]
RewriteRule ^multimedia-projector/?$           /student-life.html#science  [R=301,L]

# --- Campus & services ---------------------------------------------------
RewriteRule ^online-facility-payment/?$        /campus-services.html#online    [R=301,L]
RewriteRule ^health-center/?$                  /campus-services.html#health    [R=301,L]
RewriteRule ^the-school-bookshop/?$            /campus-services.html#bookshop  [R=301,L]
RewriteRule ^school-transportation/?$          /campus-services.html#transport [R=301,L]

# --- News, events, gallery ----------------------------------------------
RewriteRule ^notice/?$                         /news.html#notices   [R=301,L]
RewriteRule ^notice/(.*)$                      /news.html#notices   [R=301,L]
RewriteRule ^event/?$                          /news.html#events    [R=301,L]
RewriteRule ^event/(.*)$                       /news.html#events    [R=301,L]
RewriteRule ^photo-gallery/?$                  /news.html#gallery   [R=301,L]

# --- Feature index pages (duplicates of the hubs) -----------------------
RewriteRule ^feature/academic/?$               /academics.html      [R=301,L]
RewriteRule ^feature/alumni/?$                 /alumni.html         [R=301,L]
RewriteRule ^feature/achievements/?$           /achievements.html   [R=301,L]
RewriteRule ^feature/eca/?$                    /student-life.html   [R=301,L]
RewriteRule ^feature/student-services/?$       /campus-services.html [R=301,L]
RewriteRule ^feature/faculty-members/?$        /leadership.html     [R=301,L]

# --- Keep WordPress uploads reachable ------------------------------------
# The admission-form PDFs are linked from printed material and third-party
# sites. Leave /wp-content/uploads/ in place, or redirect to the new path.
```

---

## Nginx

```nginx
location = /about/                      { return 301 /about.html; }
location = /our-history/                { return 301 /about.html; }
location = /mission-vision-and-values/  { return 301 /about.html#values; }
location = /school-administration/      { return 301 /leadership.html; }
location = /new-campus/                 { return 301 /campus.html; }
location = /child-protection-policy/    { return 301 /campus-services.html#safeguarding; }
location = /playpen-alumni-association/ { return 301 /alumni.html; }
location = /career-at-playpen/          { return 301 /careers.html; }
location = /contact-us/                 { return 301 /contact.html; }

location = /elementary-school/          { return 301 /academics.html#elementary; }
location = /junior-school/              { return 301 /academics.html#junior; }
location = /middle-school/              { return 301 /academics.html#middle; }
location = /senior-school/              { return 301 /academics.html#senior; }
location = /library/                    { return 301 /academics.html#facilities; }
location = /laboratories/               { return 301 /academics.html#facilities; }
location = /student-support/            { return 301 /academics.html#support; }
location = /counsellor/                 { return 301 /academics.html#support; }
location = /examinations/               { return 301 /academics.html#examinations; }
location = /achievements-of-playpen-students/ { return 301 /achievements.html; }
location = /disciplinary-committee/     { return 301 /campus-services.html#policies; }
location = /the-identity-card/          { return 301 /campus-services.html#policies; }

location = /admission-procedure/        { return 301 /admissions.html; }
location = /the-school-uniform/         { return 301 /admissions.html#uniform; }
location = /code-of-conduct/            { return 301 /campus-services.html#policies; }

location = /annual-sports/              { return 301 /student-life.html#sports; }
location = /extra-curricular-activities/{ return 301 /student-life.html; }
location = /community-service/          { return 301 /student-life.html#service; }
location = /cultural-programme/         { return 301 /student-life.html#arts; }
location = /science-fair/               { return 301 /student-life.html#science; }
location = /workshop-for-students/      { return 301 /student-life.html; }
location = /multimedia-projector/       { return 301 /student-life.html#science; }

location = /online-facility-payment/    { return 301 /campus-services.html#online; }
location = /health-center/              { return 301 /campus-services.html#health; }
location = /the-school-bookshop/        { return 301 /campus-services.html#bookshop; }
location = /school-transportation/      { return 301 /campus-services.html#transport; }

location ^~ /notice/                    { return 301 /news.html#notices; }
location ^~ /event/                     { return 301 /news.html#events; }
location = /photo-gallery/              { return 301 /news.html#gallery; }

location = /feature/academic/           { return 301 /academics.html; }
location = /feature/alumni/             { return 301 /alumni.html; }
location = /feature/achievements/       { return 301 /achievements.html; }
location = /feature/eca/                { return 301 /student-life.html; }
location = /feature/student-services/   { return 301 /campus-services.html; }
location = /feature/faculty-members/    { return 301 /leadership.html; }
```

---

## If the site moves to clean URLs

The build outputs `.html` files because the deliverable is static. If the host is configured to serve extensionless URLs (`/about/` → `/about.html`), update the redirect targets and the internal links in `build/shell.py` in one pass, then rebuild. The `NAV`, `FOOTER_*` lists and each page's links are the only places a URL appears.

---

## Post-launch checklist

1. Deploy redirects **before** switching DNS or removing the old site.
2. Crawl the old sitemap and confirm every URL returns 301 → 200 (Screaming Frog free tier covers 500 URLs; this site has ~50).
3. Submit the new `sitemap.xml` in Google Search Console.
4. Use Search Console's **Change of Address** only if the domain changes — it does not here.
5. Watch Search Console coverage for 404s weekly for the first month.
6. Keep `/wp-content/uploads/` reachable, or redirect each PDF individually. The admission forms are linked from printed material the school cannot recall.
