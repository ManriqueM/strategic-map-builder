# Phase 1 — Create Strategy Map: Validation

Manual visual + functional check (per the chosen validation approach — no automated tests
this phase).

## Setup

1. `npm run dev` and open the app in a browser. Open (or create) a map so you're in the
   **Create Strategy Map** mode.

## Visual check

- [ ] Fonts match: Manrope (body/UI), Source Serif 4 (perspective titles), IBM Plex Mono
      (perspective numbers `01`–`0N`).
- [ ] Background is warm white (`#fbfaf8`); Vision/Mission banner and Values tiles are navy
      (`#22303f` / `#2b3c4d`), matching the bundle's `.thumbnail` /
      `Strategy Map Options.dc.html` option **2a**.
- [ ] Objective cards are white with a light border and a neutral (non-colored) top border —
      no status colors appear yet (Track Performance is Phase 3).
- [ ] Overall layout reads as a close visual match to the 2a reference at working width
      (~1440–1600px).
- [ ] Values row stays clean at both extremes: remove down to 3 values (tiles read as a
      balanced row) and add up to 8 values (wraps to a second row at a consistent, readable
      tile size — no shrinking, no overflow/clipping).
- [ ] Objective grid stays clean at both extremes within a perspective: down to 2 objectives
      (no awkward empty stretch) and up to 7+ objectives (wraps to additional rows at a
      consistent card width).

## Functional check — editing

- [ ] Default map loads with Mission, Vision, Values, and 4 perspectives (Financial,
      Customer, Internal Process, Learning & Growth) all visible with placeholder content.
- [ ] Toggling a section off (e.g. Values) removes it from the map; toggling back on restores
      it. The Sections Panel is visible at all times in this mode.
- [ ] Editing mission/vision text updates the banner immediately.
- [ ] Editing a value's text works; adding/removing a value works.
- [ ] Editing a perspective's name updates its section title live.
- [ ] Renaming a default perspective to something custom (e.g. "Financial" → "Impact")
      works with no special-casing.
- [ ] Adding a new perspective inserts a new row with an editable name and an empty
      objective grid; removing a perspective removes its row; reordering (up/down) changes
      displayed order.
- [ ] Adding/removing/editing objectives within a perspective works.
- [ ] Adding/removing/editing initiatives within an objective works.
- [ ] Clicking directly into any text field (objective, initiative, value, perspective name,
      mission/vision) starts editing it — it never also selects the card for a connection.
- [ ] Clicking a remove/add button (objective, initiative, value) performs only that action —
      it never also selects the card for a connection.

## Functional check — connecting

- [ ] Clicking an objective card's empty space (not its text or buttons) shows a visible
      pending-selection ring; clicking a second, different card draws a connection from the
      first to the second and clears the selection.
- [ ] Clicking the same (already-pending) card again clears the selection with no connection
      made.
- [ ] Attempting to connect two boxes that already have a connection (in either direction) is
      a no-op — selection still clears, no duplicate edge is created.
- [ ] Connector renders as a curve from the top-center of the "from" box to the bottom-center
      of the "to" box with an arrowhead at the destination, regardless of the two boxes'
      relative screen position.
- [ ] Hovering a connector recolors it (and its arrowhead) to the "hot" color, thickens the
      stroke, and rings both endpoint boxes.
- [ ] Clicking a connector removes it immediately, no confirmation prompt.
- [ ] Editing an objective's text so its card grows/shrinks keeps connected paths correctly
      anchored to the card's edges (no stale/detached-looking curves).
- [ ] Arrowheads read as an open chevron matching the line's color/weight (not a solid
      triangle), in both the normal and hovered ("hot") states.
- [ ] A connector whose curve happens to pass near or through an objective card's area
      disappears behind that card (never draws its line/arrowhead over the card's border or
      text); the same connector is still visible and hoverable in the open space around it.
- [ ] Each perspective's number + name sits in a column to the left of its objective grid
      (not a band above it), separated by a vertical divider; renaming a perspective to a
      long name (e.g. "Aprendizaje y Crecimiento") wraps the text onto a second line within
      that column and never overlaps the objective grid.
- [ ] A connector crossing between two perspectives' objective columns never overlaps either
      perspective's header text, regardless of how the two connected objectives are
      positioned.

## Out of scope this phase

- [ ] No save/load UI is present (expected — Phase 2).
- [ ] No status-color assignment UI is present (expected — Phase 3, Track Performance).
- [ ] No language switcher is present (expected — Phase 4).

## Sign-off

User reviews the running app against this checklist and confirms before merging
`phase-1-create-strategy-map` into `main`.
