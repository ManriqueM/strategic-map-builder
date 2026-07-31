# Phase 3 — Track Performance: Plan

Aligns with `specs/mission.md` (design-first, incremental) and `specs/tech-stack.md` (status
palette + colored top border + legend, recreated from the Claude Design handoff bundle,
option 2a). Builds on Phase 1's `ConnectorsOverlay`/`mapReducer`/`storage.ts`/
`useObjectiveBoxRefs`/`useConnectorPaths` — additive, reusing that machinery in a dedicated
read-only view rather than new parallel geometry code.

## 1. Data model

- `src/types.ts`: add `export type ObjectiveStatus = "none" | "on-track" | "needs-attention" |
  "off-track";` and a `status: ObjectiveStatus` field on `Objective`. Add
  `export type InitiativeProgress = "none" | "not-on-track" | "on-track" | "complete";` and a
  `progress: InitiativeProgress` field on `Initiative` — `"none"` is the true unset default,
  distinct from `"not-on-track"`.
- `src/lib/defaultMap.ts`: `makeObjective` sets `status: "none"`; `makeInitiative` sets
  `progress: "none"`.
- `src/state/mapReducer.ts`: `ADD_OBJECTIVE` creates new objectives with `status: "none"`;
  `ADD_INITIATIVE` creates new initiatives with `progress: "none"`; add
  `{ type: "SET_OBJECTIVE_STATUS"; perspectiveId; objectiveId; status: ObjectiveStatus }` and
  `{ type: "SET_INITIATIVE_PROGRESS"; perspectiveId; objectiveId; initiativeId; progress:
  InitiativeProgress }`.
- `src/lib/storage.ts`: extend `normalizeMap` to backfill `status: "none"` on every objective
  and `progress: "none"` on every initiative missing the field, alongside the existing
  `connections` backfill. The only value **remap** needed is the original four-state model's
  now-retired `"in-progress"` → `"on-track"`; every other value (`"none"`, `"not-on-track"`,
  `"on-track"`, `"complete"`) already matches the current model and must pass through
  unchanged — `normalizeMap` runs on *every* read, so this has to be idempotent, not a one-time
  fixup. (An earlier revision of this migration tried to also collapse `"not-on-track"` into
  the default on the theory that most stored `"not-on-track"` values were just untouched
  defaults from a prior model — that's unsound, because `"not-on-track"` is *also* a valid,
  meaningful value going forward, and collapsing it on every read would silently erase a
  user's deliberate "Not on Track" assignment the next time the map loads.)

## 2. Status and progress palette helpers

- `src/lib/statusPalette.ts`: `STATUS_META: Record<ObjectiveStatus, { color: string }>`
  mapping to the existing CSS custom properties (`var(--color-status-on-track)` etc.;
  `"none"` maps to `var(--color-status-neutral)`). `STATUS_CYCLE` ordered array and
  `nextStatus(current)` helper used by the click handler. `LEGEND_STATUSES` (the three
  assignable, non-`"none"` statuses in display order) for rendering the legend.
- `src/lib/initiativeProgressPalette.ts`: `INITIATIVE_PROGRESS_META: Record<InitiativeProgress,
  { color: string }>` — `"none"` → `var(--color-status-neutral)`, `"not-on-track"` →
  `var(--color-status-off-track)`, `"on-track"` → `var(--color-status-attention)` (the same
  amber as the objective legend — the icon disambiguates, not the color; see Key decisions),
  `"complete"` → `var(--color-status-on-track)`. `INITIATIVE_PROGRESS_CYCLE`
  (`none → not-on-track → on-track → complete → none`) + `nextInitiativeProgress(current)` for
  the click handler. A separate `LEGEND_INITIATIVE_PROGRESS` array
  (`["complete", "on-track", "not-on-track"]`) — deliberately a *different* order from the
  cycle, sorted to match `LEGEND_STATUSES`'s green → amber → red sequence — drives the legend
  instead. `INITIATIVE_PROGRESS_LABEL_KEYS` covers all four states (including `"none"`, for the
  marker's tooltip/aria-label even though it has no legend entry).

## 3. Top-border color is Track-Performance-only

- `src/components/InteractiveObjectiveCard.tsx` (Track Performance mode): applies
  `style={{ borderTopColor: STATUS_META[objective.status].color }}`.
- `src/components/ObjectiveCard.tsx` (Create Strategy Map mode): applies **no** inline
  `borderTopColor` — falls back to the CSS default (`border-top: 9px solid
  var(--color-status-neutral)`), so it never shows the status color regardless of
  `objective.status`.

## 4. Track Performance view

- `src/components/BuilderToolbar.tsx`: `BuilderMode` is `"create" | "track"`; toolbar shows
  `Create Strategy Map | Track Performance`.
- `src/components/BuilderScreen.tsx`: renders `TrackPerformanceView` when `mode === "track"`.
- `src/components/TrackPerformanceView.tsx`: read-only canvas — box click handler dispatches
  `SET_OBJECTIVE_STATUS` with `nextStatus(objective.status)`; hint text explains the
  click-to-cycle behavior; renders `StatusLegend` below the perspective rows; uses the shared
  `useObjectiveBoxRefs`/`useConnectorPaths` hooks and `ConnectorsOverlay` with
  `interactive={false}`.
- `src/components/InteractiveObjectiveCard.tsx`: no `is-pending`/connect-selection classes
  (that's Create-Strategy-Map-mode-only) — a `status-mode-card` hover affordance (cursor +
  subtle background) plus the `is-hot` ring when a hovered connector touches this card.
- `src/components/StatusLegend.tsx`: small presentational component rendering the "Status"
  label + one swatch/label pair per `LEGEND_STATUSES` entry, styled per the design source's
  footer legend row.
- `src/components/InitiativeProgressLegend.tsx` (new): sibling to `StatusLegend`, rendering a
  "Progress" label + one icon/label pair per `LEGEND_INITIATIVE_PROGRESS` entry (the three
  assignable states only, in green/amber/red order — like `StatusLegend`, the unset default
  has no entry). Rendered directly below `StatusLegend` in `TrackPerformanceView`.

## 5. Initiative progress control

- `src/components/InitiativeProgressIcon.tsx` (new): a small shared icon renderer, switching
  on `InitiativeProgress` to render inline SVG shapes (matching how the connector arrowheads
  were redone as crisp stroke-based icons rather than relying on system-font glyphs at ~10px)
  — a blank rounded `<rect>` outline for `"none"`, a `<path>` X for `"not-on-track"`, a
  `<circle>` + short base `<path>` (a simplified light bulb) for `"on-track"`, a checkmark
  `<path>` for `"complete"`. All stroke `currentColor`, so the wrapping element's `color`
  (from `INITIATIVE_PROGRESS_META`) controls the icon color without passing it separately.
  Used by both the marker button and the legend swatch, so the two always render identically.
- `src/components/InteractiveObjectiveCard.tsx`: takes a `perspectiveId` prop (from
  `InteractivePerspectiveRow`, which already has `perspective.id` in scope). Each initiative's
  `.initiative-dot` (previously an inert `<div>`, a plain filled circle) becomes a `<button>`
  rendering `<InitiativeProgressIcon progress={initiative.progress} />` colored via
  `INITIATIVE_PROGRESS_META[...].color`, with `title`/`aria-label` from
  `INITIATIVE_PROGRESS_LABEL_KEYS` for discoverability. Its `onClick` calls
  `e.stopPropagation()` first (so it never also fires the card's own `onClick`, which cycles
  objective status), then dispatches `SET_INITIATIVE_PROGRESS` with
  `nextInitiativeProgress(initiative.progress)`.
- `src/components/InitiativeRow.tsx` (Create Strategy Map mode): untouched — its dot stays a
  plain, non-interactive, uncolored `<div>`.

## 6. Styling

- `src/styles/map.css`: `.status-legend` row styling (swatch + label), the
  `.status-mode-card:hover` affordance, and confirm the existing `.objective-card` border-top
  rule no longer hardcodes `var(--color-status-neutral)` as the *only* color (inline style
  takes over per-card in `InteractiveObjectiveCard`, but not in `ObjectiveCard`). The
  interactive `.initiative-dot` variant grows slightly from the static 7px circle (enough to
  keep the check/bulb/x glyph legible, e.g. ~13px) — a small, deliberate size difference from
  Create Strategy Map mode's plain dot, still compact enough not to disrupt the initiative
  row's density. Add a `.interactive-objective-card .initiative-dot:hover`/`:focus-visible`
  ring scoped to the Track Performance variant only. New `.initiative-progress-legend`
  styling mirrors `.status-legend`'s row layout, with each swatch centering the icon (in its
  color) instead of showing a plain color chip.

## 7. Manual validation

- Run through `validation.md` end to end in the browser (dev server) before considering the
  phase done.
