# Phase 1 — Create Strategy Map: Plan

Aligned with `specs/mission.md` (perspectives are customizable, not fixed) and
`specs/tech-stack.md` (React + TypeScript + Vite, design tokens from option 2a).

## 1. Project scaffold

- `npm create vite@latest . -- --template react-ts` (into this repo).
- Install dependencies; verify `npm run dev` serves a blank app.
- Load Google Fonts (Manrope, Source Serif 4, IBM Plex Mono) as documented in
  `specs/tech-stack.md`.
- Global CSS: define design tokens as CSS custom properties (background, text, navy accent
  shades, status neutral, card border, radii, shadows) so components consume variables, not
  hardcoded hex values.

## 2. Data model

- TypeScript types in `src/types.ts`: `StrategyMap`, `Section` (mission/vision/values
  visibility flags), `Perspective` (`id`, `name`, `visible`, `objectives`), `Objective`
  (`id`, `text`, `initiatives`), `Initiative` (`id`, `text`), `Connection`
  (`id`, `from`, `to`).
- `src/lib/defaultMap.ts`: factory producing the default map — Mission/Vision/Values
  placeholders, 4 default perspectives each with a couple of placeholder objectives/
  initiatives (light placeholder copy, e.g. "New objective" / "New initiative", not demo
  company content), `connections: []`.

## 3. State management

- Top-level state via `useReducer` (`src/state/mapReducer.ts`): edit text, toggle section
  visibility, add/remove/rename/reorder perspective, add/remove objective, add/remove
  initiative, `ADD_CONNECTION`/`REMOVE_CONNECTION`.
- Pass state + dispatch down via React context (`src/state/MapContext.tsx`) so deeply nested
  editable fields can dispatch without prop-drilling through every layer.

## 4. Map rendering components (matches 2a design exactly)

- `Header` — kicker "Strategy Map", title, subtitle.
- `VisionMissionBanner` — navy cards for Vision/Mission.
- `ValuesRow` — navy tile grid for values. Responsive wrapping grid, not a hardcoded 4
  columns — so 3 values sit as a balanced row and 8 wrap cleanly to a second row at the same
  tile size.
- `PerspectivesSection` — owns the connect-selection state (`pendingId`,
  `hoveredConnectionId`), a `containerRef` + per-objective box refs (via the shared
  `useObjectiveBoxRefs` hook, `src/state/useObjectiveBoxRefs.ts`), and
  `useConnectorPaths(...)` (`src/state/useConnectorPaths.ts`) to compute SVG paths; renders
  `ConnectorsOverlay` plus one `PerspectiveRow` per visible perspective.
- `PerspectiveRow` — a flex row with a fixed-width (150px) header column (IBM Plex Mono
  number + Source Serif 4 title, wrapping onto multiple lines for long names), a vertical
  divider (`align-self: stretch`, spanning the row's full height), and the responsive
  objective grid filling the remaining width; threads the connect props (`pendingId`,
  `hoveredConnection`, `onSelectForConnect`, `getBoxRef`) down to each `ObjectiveCard`.
- `ObjectiveCard` — neutral-or-status top border, editable objective text, initiative list,
  and now also: `ref={boxRef}` for connector geometry, `is-pending`/`is-hot` state classes,
  and an `onClick={onSelectForConnect}` on the card's outer div (see click-model wiring
  below).
- `InitiativeRow` — dot + editable text + remove button.
- `ConnectorsOverlay` — SVG layer (`src/components/ConnectorsOverlay.tsx`) rendering bezier
  paths with hover/click-to-remove, reused unchanged from the prior Connect-mode
  implementation, but with an open, round-capped chevron `<marker>` (matching the line's
  stroke) instead of a solid filled triangle, and no elevated `z-index` on the `<svg>` itself
  so it paints behind — not on top of — the objective cards and perspective headers that
  come after it in the DOM.
- Each hidden section/perspective (per state) simply isn't rendered.

## 5. Click-model wiring (edit + connect coexisting)

- `EditableText` (`src/components/EditableText.tsx`): in its editable branch, add
  `onClick={(e) => e.stopPropagation()}` so entering edit never bubbles up to the card's
  connect-select handler.
- `ObjectiveCard`'s remove-objective button, add-initiative button, and `InitiativeRow`'s
  remove button each call `e.stopPropagation()` before dispatching, for the same reason.
- Any click that isn't absorbed by one of the above reaches `ObjectiveCard`'s outer
  `onClick`, which calls `onSelectForConnect` — the same toggle-pending/`ADD_CONNECTION`
  logic the old Connect mode used, now owned by `PerspectivesSection`.
- `useConnectorPaths` gains a `ResizeObserver` on the container and each box element
  (alongside the existing mount/timeout/window-resize measurement) so connector paths stay
  anchored correctly as a card's height changes from live text edits.

## 6. Builder chrome (new UI, same design language)

- `SectionsPanel` — toggles for Mission/Vision/Values visibility; list of perspectives with
  visibility toggle, rename (inline edit), remove, reorder (up/down), and an "Add
  perspective" action. Stays visible at all times in this mode (not hidden behind a
  view-mode switch).
- Inline-edit behavior: the reusable `EditableText` component (click → contentEditable,
  commit on blur/Enter) used for every editable string in the map.
- Add/remove affordances on `ObjectiveCard` (add/remove initiative) and `PerspectiveRow`
  (add/remove objective) — small ghost buttons styled per the design tokens.

## 7. Wire-up

- Assemble `BuilderScreen`: `SectionsPanel` + rendered map using `MapContext`, with
  `PerspectivesSection` handling both editing and connecting.
- Confirm toggling sections/perspectives updates the render live; confirm add/remove/rename/
  reorder perspective works end-to-end including the objective grid underneath it; confirm
  click-to-connect and text editing coexist correctly on the same card.

## 8. Polish

- Layout at the design's working width (~1440–1600px), with horizontal scroll/responsive
  fallback on narrower viewports rather than broken layout.
- Empty states (e.g. a perspective with zero objectives still renders sensibly).
- Verify the responsive grids at count extremes: 1–3 values/objectives (no awkward stretch)
  and 7–8+ (wraps to additional rows at a consistent tile size).
- Keyboard focus states using the navy accent (2px outline).
- Verify long perspective names (e.g. "Aprendizaje y Crecimiento") wrap cleanly within the
  150px header column at both perspective-name font sizes tested, and that connector curves
  never visibly cross a header or card regardless of how many perspectives/objectives exist.

## 9. Manual validation

- Execute `specs/features/phase-1-create-strategy-map/validation.md` and confirm with the
  user.
