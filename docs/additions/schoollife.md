# Additions: School life group (schoollife)

Files: `build/additions/schoollife.css` (one component). No script.

### Plate trio (/school-life/culture-and-service/, 2026-10-11, schoollife)
One tall plate beside two landscape plates stacked, equal footprint, one column on a phone. It exists because a tall photograph (the tiger mask board, 5:8) next to a short passage of text leaves a large empty gap in the text column, and `ul.gallery` (CSS columns) leaves a ragged layout when it holds three frames of different shapes inside a story chapter. Each item is an ordinary `figure.plate`, so the plates keep their paper mount, numbered caption and the home's curtain reveal. The prose sits above the trio at full width. (This replaces the earlier `.sl-pair`, which is no longer used.)

```html
<ul class="sl-trio">
  <li>
    <figure class="plate" data-reveal>
      <div class="plate__frame">{{img src="img/sl-tiger-mask" alt="..." sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 100vw" widths="720,960"}}</div>
      <figcaption class="plate__cap"><span class="plate__n">03</span>...</figcaption>
    </figure>
  </li>
  <li>
    <figure class="plate plate--4x3" data-reveal> ... a landscape plate ... </figure>
  </li>
  <li>
    <figure class="plate plate--4x3" data-reveal> ... a second landscape plate ... </figure>
  </li>
</ul>
```
Rule of use: exactly three items; the first is the tall one (it spans both rows from 640 px), the other two are landscape and carry the same crop class; number the plates in page order.
