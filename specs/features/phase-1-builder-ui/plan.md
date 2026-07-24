# Phase 1 — Builder UI: Plan

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
  (`id`, `text`, `initiatives`), `Initiative` (`id`, `text`).
- `src/lib/defaultMap.ts`: factory producing the default map — Mission/Vision/Values
  placeholders, 4 default perspectives each with a couple of placeholder objectives/
  initiatives (light placeholder copy, e.g. "New objective" / "New initiative", not demo
  company content).

## 3. State management

- Top-level state in `App` via `useReducer` (actions: edit text, toggle section visibility,
  add/remove/rename/reorder perspective, add/remove objective, add/remove initiative).
- Pass state + dispatch down via React context (`src/state/MapContext.tsx`) so deeply nested
  editable fields can dispatch without prop-drilling through every layer.

## 4. Map rendering components (matches 2a design exactly)

- `Header` — kicker "Strategy Map", title, subtitle.
- `VisionMissionBanner` — navy cards for Vision/Mission.
- `ValuesRow` — navy tile grid for values. Responsive wrapping grid
  (`grid-template-columns: repeat(auto-fill, minmax(160px, 200px))` or equivalent, tuned
  during build), not a hardcoded 4 columns — so 3 values sit as a balanced row and 8 wrap
  cleanly to a second row at the same tile size, instead of stretching or shrinking tiles to
  force a fixed column count.
- `PerspectiveRow` — IBM Plex Mono number + Source Serif 4 title + divider rule + a
  responsive objective grid (same `auto-fill`/`minmax` approach, tuned to the objective
  card's natural width, e.g. `minmax(220px, 1fr)`), so a perspective with 2 objectives and
  one with 7 both look intentional rather than squeezed or sparse.
- `ObjectiveCard` — neutral top border (no status yet), objective text, initiative list.
- `InitiativeRow` — dot + text.
- Each hidden section/perspective (per state) simply isn't rendered.

## 5. Builder chrome (new UI, same design language)

- `SectionsPanel` — toggles for Mission/Vision/Values visibility; list of perspectives with
  visibility toggle, rename (inline edit), remove, reorder (up/down), and an "Add
  perspective" action.
- Inline-edit behavior: a small reusable `EditableText` component (click → contentEditable
  or focused input → commit on blur/Enter) used for every editable string in the map
  (mission/vision/values/perspective names/objective text/initiative text).
- Add/remove affordances on `ObjectiveCard` (add/remove initiative) and `PerspectiveRow`
  (add/remove objective) — small ghost buttons styled per the design tokens.

## 6. Wire-up

- Assemble `App`: `SectionsPanel` + rendered map using `MapContext`.
- Confirm toggling sections/perspectives updates the render live; confirm add/remove/rename/
  reorder perspective works end-to-end including the objective grid underneath it.

## 7. Polish

- Layout at the design's working width (~1440–1600px), with horizontal scroll/responsive
  fallback on narrower viewports rather than broken layout.
- Empty states (e.g. a perspective with zero objectives still renders sensibly).
- Verify the responsive grids from step 4 at count extremes: 1–3 values/objectives (no
  awkward stretch to fill the row) and 7–8+ (wraps to additional rows at a consistent tile
  size rather than shrinking below a readable width).
- Keyboard focus states using the navy accent (2px outline), since option 2a doesn't specify
  its own focus treatment.

## 8. Manual validation

- Execute `specs/features/phase-1-builder-ui/validation.md` and confirm with the user.
