# illustration: the Illustration tag

Added 2026-10-25 (AI plates round). File: `build/additions/illustration.css`.

## `.ill-tag`

A small paper label that says "Illustration", top left on a picture that is an AI plate and not a photograph of the school. Same look as the Campus pool plate's `.abt-plate__tag`.

```html
<div class="plate__frame">{{img src="img/ev-victory-still" alt="An illustration, not a photograph of the school: ..." sizes="..."}}<span class="ill-tag" aria-hidden="true">Illustration</span></div>
```

Rules of use:
- Only on an image catalogued as an AI plate (`shows` starts "AI illustration, not the school"). Every such image carries it.
- The parent must be positioned (`.plate__frame` and `.ev-card__frame` already are).
- Under a plate, the visible line is `<figcaption class="caption ill-note">Illustration, not a photograph of the school. ...</figcaption>` (not `.plate__cap`: the build strips those from inner pages). On an event page the `ev-mark__line` under the facts says it instead.
- The alt starts "An illustration, not a photograph of the school:" and a visible line near the picture (an `ill-note` caption or an `ev-mark__line`) says the same, so the tag stays `aria-hidden`.
- Each placement also has a `<!-- CONFIRM: real photograph wanted -->` line in the page source, a bullet in `docs/CONTENT-TO-CONFIRM.md` and a line in `docs/credits-log.md`.
