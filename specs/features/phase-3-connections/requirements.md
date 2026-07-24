# Phase 3 — Interactive View: Connections: Requirements

## Scope

Add a read-only **interactive connection mode** to the builder: a toggle that switches the
already-open map from the Phase 1/2 edit canvas into a canvas where objective boxes can be
wired together with directional connectors, matching the connector behavior specified in
`specs/tech-stack.md` and demonstrated in the original design source (`Strategy Map
Options.dc.html`, option 2a, in the committed handoff bundle) — click node A, click node B to
draw a connection; hover a connection to highlight it (and ring both endpoint boxes); click a
connection to remove it.

### In scope

- **Mode toggle in the builder toolbar**: "Edit | Connect" segmented control next to the map
  name. Switching to Connect swaps the edit-mode canvas (sections panel, editable text,
  add/remove controls) for a read-only interactive canvas showing the same visible content
  (Vision/Mission, Values, visible perspectives and their visible objectives) — same
  Save / Rename / Back-to-My-Maps controls remain available in both modes.
- **Click-to-connect**: clicking an objective box selects it (visual ring); clicking a second,
  different box draws a directional connection from the first to the second and clears the
  selection; clicking the same (already-selected) box again deselects it with no connection
  made.
- **One edge per pair**: only one connection may exist between any two given boxes, regardless
  of click order — if a connection already exists in either direction between the two boxes
  clicked, the click sequence is a no-op (selection still clears).
- **Connector rendering**: SVG cubic-bezier curve from edge-to-edge between the two boxes'
  borders (not center-to-center), with an arrowhead marker at the destination end, routed
  vertically or horizontally depending on which axis dominates between the two box centers —
  matches the original design source's geometry exactly.
- **Hover / remove**: hovering a connector (via a wide invisible hit-path over the visible
  thin path) recolors it and its arrowhead to the "hot" (attention-red) color, thickens the
  stroke, and rings both of its endpoint boxes in their status color; clicking the connector
  removes it immediately (no confirmation — trivially undone by reconnecting).
- **Persistence**: connections are stored as part of the `StrategyMap` document (new
  `connections: { id, from, to }[]` field) and saved/loaded exactly like any other map content
  via the existing Phase 2 Save button and `localStorage` layer — no separate save action for
  connections, no autosave.
- **Recalculates on layout change**: connector paths are re-measured after mount (allowing
  fonts/layout to settle) and on window resize, so curves stay anchored to their boxes.

### Out of scope (later phases, per `specs/roadmap.md`)

- Status color assignment / status legend interactivity — Phase 4. Objective cards keep their
  neutral top border in interactive mode this phase, same as the builder.
- Language switching / i18n — Phase 5.
- Editing content (text, add/remove/toggle/reorder) while in Connect mode — stays exclusive to
  Edit mode; switching modes doesn't lose in-progress edits (same underlying map state).

## Key decisions

- **Mode toggle, not a separate route.** A saved map is opened once (as today); "Connect" is a
  view-mode toggle on the already-loaded `StrategyMap`/`MapProvider`, not a new top-level
  screen alongside `MyMapsScreen`/`BuilderScreen`. This matches the roadmap's literal wording
  ("switch a saved map into an interactive view") and avoids a second load/hydrate path.
- **Connections live in the map document.** A `connections` array of `{ id, from, to }` objects
  (`from`/`to` are objective ids) is added to `StrategyMap` and mutated via two new
  `mapReducer` actions (`ADD_CONNECTION`, `REMOVE_CONNECTION`), so connecting/disconnecting
  marks the map dirty and flows through the existing Phase 2 Save/dirty-tracking mechanism
  exactly like any other edit — no special-casing.
- **Selection/hover state is ephemeral, not persisted.** Which box is currently "pending" a
  second click, and which connector is currently hovered, are local component state in the new
  interactive-view component tree — not part of `StrategyMap` — mirroring how Phase 2 keeps the
  dirty flag and map name outside `mapReducer`.
- **Old saved maps get a `connections` default.** Maps saved before this phase won't have a
  `connections` field in their stored JSON; the storage layer normalizes this to `[]` on read
  (`src/lib/storage.ts`), so nothing else needs to guess about missing data.
- **Directed edges, deduplicated by pair.** Connections have a direction (`from` → `to`,
  arrowhead points at `to`), but only one connection is allowed per unordered pair of boxes —
  ADD_CONNECTION checks both `(from,to)` and `(to,from)` before adding.
- **Interactive canvas is read-only and full-width.** The sections panel (visibility toggles,
  perspective management) is Edit-mode-only chrome and is hidden in Connect mode; the
  interactive canvas uses the full content width, matching the finished-map look from the
  design source rather than the builder's two-column authoring layout.
- **Geometry algorithm matches the design source.** Reuse its approach directly (recreated in
  TypeScript, not copied prototype code per `specs/tech-stack.md`): compare `|dx|` vs `|dy|`
  between box centers to decide vertical vs horizontal routing, exit/enter at the relevant box
  edge (not center), and use a cubic bezier with control points offset by half the travel
  distance along the dominant axis.
