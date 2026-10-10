# docs/additions: the entry for every component a page group adds

One file per page group, `docs/additions/<group>.md`, next to the group's `build/additions/<group>.css` and `.js`.
Format of each entry:

```
### <component name> (page, date, your group)
What it is for. The markup snippet. Any rule for its use.
```

The Foundation merges accepted components into `docs/COMPONENTS.md` at integration. Nothing here is read by the build.
