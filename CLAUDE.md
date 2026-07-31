# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start Vite dev server (http://localhost:5173)
npm run build     # type-check (tsc -b) then production build
npm run preview   # preview the production build locally
npm run lint      # oxlint
```

There is no test suite/framework configured in this project.

## Architecture

Client-only React + TypeScript + Vite SPA. No backend, no router — `src/App.tsx` toggles
between two screens based on a single piece of local state (`activeMap: SavedMap | null`):
`MyMapsScreen` (list of saved maps) and `BuilderScreen` (editor/viewer for one map).

**Data model** (`src/types.ts`): a `StrategyMap` has `sections` (mission/vision/values),
`perspectives` (each with `objectives`, each with `initiatives`), and `connections` (directed
edges between two objective ids by id).

**State management**: a single reducer (`src/state/mapReducer.ts`, discriminated-union
`MapAction`) exposed via React context (`MapContext`/`useMap`). `MapProvider` initializes
state from a passed-in map or `createDefaultMap()` (`src/lib/defaultMap.ts`). One `MapProvider`
wraps the whole `BuilderScreen` — both modes read/write the same reducer state.

**Modes**: `BuilderToolbar` controls a `mode` state (`"create" | "track"`) in `BuilderScreen`.
**Create Strategy Map** (`"create"`) renders the canvas (`SectionsPanel` + `Header` +
`VisionMissionBanner` + `ValuesRow` + `PerspectivesSection`) with inline-editable fields *and*
click-to-connect wiring on the same objective cards — `PerspectivesSection` owns the
connect-selection state (`pendingId`/`hoveredConnectionId`) and the `ADD_CONNECTION` dispatch.
Since editing and connecting share one card, every editable/button element inside
`ObjectiveCard` (via `EditableText`, remove/add buttons) calls `e.stopPropagation()` on click
so it never also triggers the card's own `onClick` (connect-select); any click that isn't
absorbed by one of those elements reaches the card and toggles its pending-connection state.
**Track Performance** (`"track"`) renders `TrackPerformanceView`, a read-only view reusing the
same connector/box-ref machinery: clicking an objective card cycles `ObjectiveStatus`
(`nextStatus` in `lib/statusPalette.ts`); connections still render (via `ConnectorsOverlay`
with `interactive={false}`) but aren't editable there.

**Status/progress coloring is Track-Performance-only.** `ObjectiveCard` (Create Strategy Map)
never applies `objective.status`'s color — only `InteractiveObjectiveCard` (Track Performance)
does, via inline `style={{ borderTopColor: STATUS_META[...].color }}`. The same split applies
one level down: each initiative has its own `progress: InitiativeProgress` field
(`lib/initiativeProgressPalette.ts`, mirrors `statusPalette.ts`) with four states — `"none"`
(the true default: a blank square icon, deliberately unassigned so it prompts the user to fill
it in), `"not-on-track"` (red ✕), `"on-track"` (amber light bulb — intentionally the *same*
amber token as the objective legend's "Needs Attention"; the icon disambiguates the two, not
the color), and `"complete"` (green ✓). Icons render via the shared
`InitiativeProgressIcon.tsx` (stroke-based SVG shapes, `currentColor`), used by both the
marker and `InitiativeProgressLegend.tsx`. The click-cycle order
(`INITIATIVE_PROGRESS_CYCLE`: none → not-on-track → on-track → complete) and the legend's
display order (`LEGEND_INITIATIVE_PROGRESS`: complete, on-track, not-on-track — sorted to
match the objective legend's green→amber→red sequence) are deliberately different arrays; don't
assume they should stay in sync. The marker is a plain, non-interactive `<div>` in
`InitiativeRow.tsx` (Create mode) but a colored, clickable `<button>` in
`InteractiveObjectiveCard.tsx` (Track Performance) that calls `e.stopPropagation()` before
dispatching `SET_INITIATIVE_PROGRESS`, so clicking it never also cycles the parent card's
objective status. `storage.ts`'s `normalizeMap` must stay idempotent here: every valid current
value (including `"none"` and `"not-on-track"`) has to pass through unchanged on every read —
only the original model's now-retired `"in-progress"` value gets remapped (→ `"on-track"`).
When adding a new per-objective or per-initiative field like these, default it to `"none"` in
both `defaultMap.ts` and the relevant `ADD_*` reducer case, and decide up front which mode(s)
it should render/be editable in — don't assume "shows everywhere."

**Connector geometry** (`src/lib/connectorGeometry.ts` + `state/useConnectorPaths.ts` +
`state/useObjectiveBoxRefs.ts`): connections are always drawn from the top-center of the
"from" box to the bottom-center of the "to" box, regardless of the boxes' actual relative
screen position — this matches the Balanced Scorecard convention that a lower-perspective
objective supports (points upward into) the one it's connected to. `useConnectorPaths`
measures DOM rects via `getBoundingClientRect` on mount, with two delayed re-measures
(300ms/800ms) to catch late layout/font settling, a window resize listener, and a
`ResizeObserver` on the container + each box element (needed because Create Strategy Map mode
lets cards resize from live text edits while connectors are visible). The arrowhead
(`ConnectorsOverlay.tsx`'s `<marker>` defs) is an open, round-capped chevron stroked in the
line's own color/width, not a filled triangle, so it reads as the line tapering to a point.
`.connectors-overlay` carries no elevated `z-index` — it relies on normal DOM/paint order
(it's the first child inside `.interactive-rows`) so that the objective cards and perspective
headers rendered after it, both opaque, paint on top and occlude any curve that would
otherwise cross their content; a curve is only visible in the open space between elements.

**Perspective row layout** (`PerspectiveRow.tsx` / `InteractivePerspectiveRow.tsx` +
`.perspective-row`/`.perspective-row-head` in `map.css`): each perspective is a flex row —
a fixed-width (150px) header column (number + name, wrapping onto a second line for long
names) — a vertical divider (`align-self: stretch`) — then the objective grid filling the
rest of the width. This deviates from the original design source's stacked layout (title
band above the grid) specifically so headers and the objective grid never share horizontal
space: connectors, which are anchored to objective boxes inside the grid, can't geometrically
reach the header column at all, regardless of z-order. Keep this in mind before reintroducing
a full-width header row above the 767px breakpoint — it would reopen the header/connector-
overlap problem this layout was chosen to close structurally. Below 767px it *does* revert to
a stacked header (see Responsive layout below) — that's a deliberate, width-scoped exception,
not a reversal of this decision.

**Persistence** (`src/lib/storage.ts`): all saved maps live in one `localStorage` key
(`strategy-map-builder:maps`) as a versioned envelope (`{ version, maps: Record<id, SavedMap> }`).
`normalizeMap()` runs on every read and backfills fields missing from older saved maps (e.g.
`connections`, objective `status`, initiative `progress`) — when adding a new field to
`StrategyMap`, extend `normalizeMap` so previously-saved maps don't break on load, rather than
assuming fresh state shape.

**i18n** (`src/i18n/`): `LanguageContext` holds only the *interface* language (`en`/`es`,
persisted separately in `localStorage` under `strategy-map-builder:language`); `t(key, vars?)`
does a dot-path lookup into the active dictionary with fallback to English. Map *content*
(mission text, objective text, etc.) is user-typed data and is never translated or run through
`t()`.

**Styling**: plain CSS with custom-property design tokens (`src/styles/map.css`), no CSS
framework. The visual design is a pixel-perfect recreation of a specific Claude Design handoff
(`Strategy map with four perspectives-handoff.zip`, option "2a — Clean corporate + editorial";
details and exact palette/fonts in `specs/tech-stack.md`) — match that source rather than
introducing generic component-library styling.

**Responsive layout**: one breakpoint, `@media (max-width: 767px)`, appended to the end of
`map.css` (no separate stylesheet). Above it, the app is pixel-identical to the ~1440–1600px
desktop design. Below it: the Sections panel collapses to hidden-by-default and expands
in-flow (not an overlay) via a `sectionsOpen` state in `BuilderScreen.tsx`, toggled by a
`.sections-toggle-btn` in `BuilderToolbar.tsx` that only renders in `"create"` mode; the
perspective row stacks (see the caveat above); and two previously hover-only remove buttons
(`.remove-objective-btn`, `.value-tile .remove-value-btn`) are forced visible, since hover
doesn't exist on touch. Two rules are deliberately *not* gated by the media query —
`.builder-toolbar`'s `flex-wrap: wrap` and `.mode-toggle-btn`'s `white-space: nowrap` — because
the toolbar gets tight enough to squeeze button text mid-word around 768–1000px, above the
phone breakpoint; both are no-ops at the full desktop width where everything already fits on
one line. When adding new toolbar controls or canvas chrome, check it at ~768px and ~1024px
too, not just phone width and the 1440px+ design target.

## Spec-driven workflow

This repo tracks work as phases under `specs/`: `specs/mission.md` (why), `specs/tech-stack.md`
(technical decisions/design source), `specs/roadmap.md` (phase list), and
`specs/features/phase-N-<name>/{requirements,plan,validation}.md` per phase. All five roadmap
phases (Create Strategy Map, save/load, Track Performance, language selection, responsive
layout) are currently complete. If asked to add a new feature/phase, follow the same
three-doc structure as the existing `specs/features/phase-*` directories rather than
inventing a different format.
