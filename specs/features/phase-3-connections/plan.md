# Phase 3 — Interactive View: Connections: Plan

Aligns with `specs/mission.md` (design-first, incremental) and `specs/tech-stack.md`
(connector visuals/interaction recreated from the Claude Design handoff bundle, option 2a).
Builds directly on Phase 2's `MapProvider`/`mapReducer`/`storage.ts`/`BuilderScreen` — no
structural rework, additive only.

## 1. Data model

- `src/types.ts`: add `export interface Connection { id: string; from: string; to: string }`
  and `connections: Connection[]` to `StrategyMap`.
- `src/lib/defaultMap.ts`: initialize `connections: []` in `createDefaultMap()`.
- `src/lib/storage.ts`: normalize on read — a small `normalizeMap(map: StrategyMap):
  StrategyMap` that defaults `connections` to `[]` if absent, applied in `getMap`/`listMaps` so
  maps saved before this phase load safely.

## 2. Reducer actions

- `src/state/mapReducer.ts`: add to `MapAction`:
  - `{ type: "ADD_CONNECTION"; from: string; to: string }` — no-ops if `from === to` or a
    connection already exists between the pair in either direction; otherwise appends
    `{ id: makeId("conn"), from, to }`.
  - `{ type: "REMOVE_CONNECTION"; id: string }` — filters it out.

## 3. Geometry helper

- `src/lib/connectorGeometry.ts`: pure function — given a container rect and two box rects,
  returns the bezier path `d` string. Always exits the sending ("from") box's top-center and
  enters the receiving ("to") box's bottom-center (fixed rule, not dependent on the two boxes'
  relative position), with cubic bezier control points offset by half the vertical travel
  distance. Keep this pure/testable and separate from DOM measurement/React state.

## 4. Interactive view components

- `src/components/InteractiveMap.tsx`: top-level interactive canvas. Renders (read-only) the
  visible Mission/Vision banner, visible Values, and visible perspectives/objectives in the
  same visual style as the builder, plus an absolutely-positioned SVG overlay for connectors.
  Owns local state: `pendingId: string | null`, `hoveredConnectionId: string | null`, and a
  `Map<string, HTMLElement>` of objective box refs (via a small ref-callback helper, same
  pattern as the design source's `boxRef`).
- `src/components/InteractiveObjectiveCard.tsx`: read-only variant of `ObjectiveCard` — same
  markup/classes minus `EditableText`/remove button, plus `onClick` (select/connect) and a ref
  callback; computes its own ring `box-shadow` inline based on whether it's `pendingId`, an
  endpoint of the hovered connection, or neither.
- `src/components/InteractivePerspectiveRow.tsx` / reuse: read-only perspective row wrapping
  `InteractiveObjectiveCard`s (no add-objective tile, no editable perspective name).
- `src/components/ConnectorsOverlay.tsx`: renders the `<svg>` with `<defs>` arrowhead markers
  (normal + hot) and one hit-path + one visible-path per connection, wired to
  hover/leave/click handlers passed down from `InteractiveMap`.
- A small hook, `src/state/useConnectorPaths.ts`: given the container ref, the box-ref map, and
  `map.connections`, measures on mount (plus settle-timers at ~300ms/800ms for font/layout
  settling, matching the design source) and on window resize; recomputes path `d` strings via
  `connectorGeometry`; only updates state when a path actually changed.

## 5. Mode toggle wiring

- `src/components/BuilderToolbar.tsx`: add an `Edit | Connect` segmented control (two buttons,
  `mode` + `onModeChange` props) between the map name and the Save button.
- `src/components/BuilderScreen.tsx`: add `mode: "edit" | "connect"` state; render the existing
  edit-mode tree (`SectionsPanel` + `Header` + `VisionMissionBanner` + `ValuesRow` +
  `PerspectivesSection`) when `mode === "edit"`, or `InteractiveMap` (full width, no sections
  panel) when `mode === "connect"`. Save/Back/rename/dirty-tracking logic is unchanged and
  shared across both modes since both operate on the same `useMap()` state.

## 6. Styling

- `src/styles/map.css`: add `.mode-toggle` (segmented control), `.interactive-canvas` (full
  width, relative positioning for the SVG overlay), connector hit/visible path styling (colors
  matching the design tokens already in `index.css`: `--color-status-attention`-family for
  "hot", a neutral gray for default), and the ring/glow box-shadow values for pending vs
  hot-endpoint objective cards.
- `.connectors-overlay` needs an explicit `z-index` (e.g. `1`). Objective cards are
  `position: relative` (for their remove button); without a z-index the SVG overlay and the
  cards are both positioned elements with `z-index: auto`, so later-DOM-order cards paint over
  the overlay — invisible/occluded whenever a connector's curve passes behind an intervening
  card (most visible with top-to-bottom routing between same-row boxes, where the curve dips
  through the row and can pass behind a card between the two endpoints).

## 7. Manual validation

- Run through `validation.md` end to end in the browser (dev server) before considering the
  phase done.
