# Phase 1 — Builder UI: Validation

Manual visual + functional check (per the chosen validation approach — no automated tests
this phase).

## Setup

1. `npm run dev` and open the app in a browser.

## Visual check

- [ ] Fonts match: Manrope (body/UI), Source Serif 4 (perspective titles), IBM Plex Mono
      (perspective numbers `01`–`0N`).
- [ ] Background is warm white (`#fbfaf8`); Vision/Mission banner and Values tiles are navy
      (`#22303f` / `#2b3c4d`), matching the bundle's `.thumbnail` /
      `Strategy Map Options.dc.html` option **2a**.
- [ ] Objective cards are white with a light border and a neutral (non-colored) top border —
      no status colors appear yet.
- [ ] Overall layout reads as a close visual match to the 2a reference at working width
      (~1440–1600px).
- [ ] Values row stays clean at both extremes: remove down to 3 values (tiles read as a
      balanced row, not stretched full-width) and add up to 8 values (wraps to a second row
      at a consistent, readable tile size — no shrinking, no overflow/clipping).
- [ ] Objective grid stays clean at both extremes within a perspective: down to 2 objectives
      (no awkward empty stretch) and up to 7+ objectives (wraps to additional rows at a
      consistent card width rather than squeezing narrower than the design's card).

## Functional check

- [ ] Default map loads with Mission, Vision, Values, and 4 perspectives (Financial,
      Customer, Internal Process, Learning & Growth) all visible with placeholder content.
- [ ] Toggling a section off (e.g. Values) removes it from the map; toggling back on restores
      it.
- [ ] Editing mission/vision text updates the banner immediately.
- [ ] Editing a value's text works; adding/removing a value works.
- [ ] Editing a perspective's name updates its section title live.
- [ ] Renaming a default perspective to something custom (e.g. "Financial" → "Impact")
      works with no special-casing — confirms perspectives aren't hardcoded.
- [ ] Adding a new perspective inserts a new row with an editable name and starts with an
      empty/placeholder objective grid.
- [ ] Removing a perspective removes its entire row.
- [ ] Reordering perspectives (move up/down) changes their displayed order.
- [ ] Adding/removing/editing objectives within a perspective works.
- [ ] Adding/removing/editing initiatives within an objective works.
- [ ] No save/load UI is present (expected — Phase 2).
- [ ] No node-connection interaction is present (expected — Phase 3).
- [ ] No status-color assignment UI is present (expected — Phase 4).
- [ ] No language switcher is present (expected — Phase 5).

## Sign-off

User reviews the running app against this checklist and confirms before merging
`phase-1-builder-ui` into `main`.
