# build/additions: one pair of files per page group

Page agents never edit `site/css/pages.css` or `site/js/inner.js`. A component or behaviour that is not in
`docs/COMPONENTS.md` goes here, in the group's own files:

```
build/additions/<group>.css    extra rules       }  python build/build.py joins them (file-name order) into
build/additions/<group>.js     extra behaviour   }  site/css/pages-additions.css and site/js/pages-additions.js
docs/additions/<group>.md      the entry for each component (what, markup, rules of use)
```

`<group>` is the name of the group's `docs/confirm/<group>.md`. Files starting with `_` and this README are ignored.
The two generated files are rewritten by every build (also `--only`); do not edit them.

CSS: prefix classes with the component's name, mobile first, tokens only (`var(--ink)`), 44 px targets, a
`prefers-reduced-motion` rule for any motion. JS: write `PP.ready(function () { ... })` and use `PP.$`, `PP.$$`, `PP.on`,
`PP.raf`. A broken file (an unclosed brace, a JavaScript syntax error) is left out of the joined file and named in an error.
