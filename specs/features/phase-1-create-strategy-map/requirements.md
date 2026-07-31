# Phase 1 — Create Strategy Map: Requirements

## Scope

Build the **Create Strategy Map** mode: a single authoring canvas matching the chosen design
(`Strategy Map Options.dc.html`, option 2a — see `specs/tech-stack.md` for the full visual
spec) that combines full inline editing of the map's content with click-to-connect wiring
between objectives, in one mode with one click model — not two separate modes.

### In scope

- Default map on first load: Mission, Vision, Values, and 4 perspectives (Financial,
  Customer, Internal Process, Learning & Growth) — all visible, all editable, with light
  placeholder content (not the "Meridian Manufacturing" demo copy from the design file).
- Toggle visibility of any section (Mission, Vision, Values, each perspective) — hidden
  sections are excluded from the rendered map.
- Edit all text content inline: mission, vision, each value, perspective names, objective
  text, initiative text.
- Add / remove values, objectives, and initiatives.
- **Perspectives are not fixed to the 4 defaults** (per `specs/mission.md`): add a new
  perspective, remove one, rename any of them, and reorder them.
- **Click-to-connect objectives**, in the same mode as the above: clicking an objective card
  (outside its text/buttons — see "Click model" below) selects it; clicking a second,
  different card draws a directional connection from the first to the second and clears the
  selection; clicking the same (already-selected) card again deselects it with no connection
  made.
- **One edge per pair**: only one connection may exist between any two given objectives,
  regardless of click order — if a connection already exists in either direction between the
  two clicked, the click sequence is a no-op (selection still clears).
- **Connector rendering**: SVG cubic-bezier curve exiting the top-center of the sending
  ("from") box and entering the bottom-center of the receiving ("to") box, with an arrowhead
  marker at the destination end — a fixed top-to-bottom routing rule (not dependent on the
  two boxes' relative position), matching the Balanced Scorecard convention where a
  lower-perspective objective supports, and visually connects upward into, the objective it
  points to. The arrowhead is an open, round-capped chevron drawn in the same stroke color/
  weight as the line (not a solid filled triangle), so it reads as the line itself tapering
  to a point rather than a separate shape glued onto the end.
- **Hover / remove**: hovering a connector (via a wide invisible hit-path over the visible
  thin path) recolors it and its arrowhead to the "hot" (attention-red) color, thickens the
  stroke, and rings both of its endpoint boxes in their status color; clicking the connector
  removes it immediately (no confirmation — trivially undone by reconnecting).
- **Connectors never draw over card or header content**: the SVG overlay paints in normal
  document order (no elevated `z-index`), so objective cards and perspective headers — both
  opaque — paint on top of it. A curve is only ever visible in the open space between
  elements; wherever it would cross a card or header it disappears behind that element's
  background instead of overlapping its text.
- **Perspective headers sit in a left column, not a top band**: each perspective's number +
  name occupies a fixed-width column beside its objective grid (separated by a vertical
  divider), rather than a full-width row above the grid. This keeps the header out of the
  grid's horizontal space entirely — connectors between objectives, which are anchored
  within the grid, can never geometrically cross the header — and long perspective names
  wrap onto a second line within that fixed column instead of overlapping the cards.
- Visual output matches the 2a design tokens exactly for anything the design depicts: fonts
  (Manrope / Source Serif 4 / IBM Plex Mono), colors, spacing, card/banner styling.

### Out of scope (later phases, per `specs/roadmap.md`)

- Saving/loading maps (`localStorage`) — Phase 2.
- Status color assignment (on track / needs attention / off track) and initiative progress
  (on track / in progress / not on track) — both Phase 3 (Track Performance). In this mode,
  objective cards always render with the neutral top border and initiative dots are always
  the plain neutral marker — regardless of whatever status/progress has been assigned in
  Track Performance, since those are Track-Performance-only indicators, not something shown
  while authoring.
- Language switching / i18n — Phase 4.

## Click model

Editing and connecting share one card and one click surface, so the click target must be
unambiguous without a mode switch:

- Clicking directly on an editable text field (mission/vision/value/perspective
  name/objective/initiative) enters inline editing for that field only.
- Clicking a remove button (objective, initiative, value) or an add button (initiative,
  objective, perspective) performs that action only.
- Any other click that lands on the objective card (its padding/background/border — not
  absorbed by one of the above) toggles that card's connect-selection.
- Every editable/button element stops click propagation so it never also triggers the card's
  connect-selection; nothing outside those elements needs special handling.
- Connector paths re-measure not just on mount/resize but also as cards resize from live text
  edits (via `ResizeObserver` on the container and each objective box), since editing and
  connector display now coexist on the same canvas.

## Key decisions

- **No backend, no persistence in this phase.** The map lives in React component state;
  a page refresh resets to the default map. This is expected and will be resolved in Phase 2.
- **Builder chrome is new UI**, not present in the Claude Design bundle. It must stay in the
  same visual language established by option 2a (Manrope, warm white `#fbfaf8` background,
  navy `#22303f` accents, existing radii/shadows) rather than introducing a different style.
- **Editing pattern**: inline, click-to-edit text (click text → it becomes editable in place)
  for titles/objectives/initiatives, rather than modal forms or a separate settings page —
  keeps editing close to the visual output and consistent with the design's direct-
  manipulation feel.
- **Connections live in the map document.** A `connections` array of `{ id, from, to }`
  objects (`from`/`to` are objective ids) is part of `StrategyMap`, mutated via
  `ADD_CONNECTION`/`REMOVE_CONNECTION` reducer actions, so connecting/disconnecting marks the
  map dirty and flows through the Phase 2 Save/dirty-tracking mechanism exactly like any
  other edit — no special-casing.
- **Selection/hover state is ephemeral, not persisted.** Which box is currently "pending" a
  second click, and which connector is currently hovered, are local component state, not
  part of `StrategyMap`.
- **Fixed top-to-bottom geometry, not axis-dependent.** Every connector always exits the
  sending box's top-center and enters the receiving box's bottom-center, with a cubic bezier
  whose control points are offset by half the vertical travel distance — a deliberate
  deviation from the original design source (which picked vertical vs. horizontal routing by
  axis dominance) to match the Balanced Scorecard's bottom-up causal-chain convention
  regardless of the two objectives' relative row/column position.
- **Section/perspective management** (show/hide, add/remove/reorder perspective) lives in a
  compact panel alongside the map at all times in this mode — it isn't hidden behind a
  separate view, since editing and connecting now coexist. Default perspective set remains
  Financial / Customer / Internal Process / Learning & Growth (matching the design), but
  nothing in the data model or UI treats these as special/fixed.
- **Perspective row layout deviates from the design source's stacked header** (title band
  above the grid) **in favor of a side-by-side layout** (fixed-width label column + vertical
  divider + grid), the same kind of deliberate deviation already made for connector geometry
  — here specifically to make header/connector overlap structurally impossible rather than
  papering over it with z-order tricks alone.
- **Grids must stay clean at any item count, not just 4.** The design's fixed 4-column grids
  (Values row, and the objective grid within each perspective) are a starting look, not a
  hard rule — since values, objectives, and perspectives are all addable/removable, the
  layout must not degrade (awkward stretching with few items, cramped squeezing with many)
  as counts move away from 4. Use a responsive wrapping grid with a sensible min/max tile
  width per row type instead of a hardcoded column count, so e.g. 3 values reads as
  intentional and 8 values wraps cleanly to a second row at a readable size.
