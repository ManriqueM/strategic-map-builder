# Phase 3 — Track Performance: Plan

Aligns with `specs/mission.md` (design-first, incremental) and `specs/tech-stack.md` (status
palette + colored top border + legend, recreated from the Claude Design handoff bundle,
option 2a). Builds on Phase 1's `ConnectorsOverlay`/`mapReducer`/`storage.ts`/
`useObjectiveBoxRefs`/`useConnectorPaths` — additive, reusing that machinery in a dedicated
read-only view rather than new parallel geometry code.

## 1. Data model

- `src/types.ts`: add `export type ObjectiveStatus = "none" | "on-track" | "needs-attention" |
  "off-track";` and a `status: ObjectiveStatus` field on `Objective`. Add
  `export type InitiativeProgress = "none" | "on-track" | "in-progress" | "not-on-track";` and
  a `progress: InitiativeProgress` field on `Initiative`.
- `src/lib/defaultMap.ts`: `makeObjective` sets `status: "none"`; `makeInitiative` sets
  `progress: "none"`.
- `src/state/mapReducer.ts`: `ADD_OBJECTIVE` creates new objectives with `status: "none"`;
  `ADD_INITIATIVE` creates new initiatives with `progress: "none"`; add
  `{ type: "SET_OBJECTIVE_STATUS"; perspectiveId; objectiveId; status: ObjectiveStatus }` and
  `{ type: "SET_INITIATIVE_PROGRESS"; perspectiveId; objectiveId; initiativeId; progress:
  InitiativeProgress }`.
- `src/lib/storage.ts`: extend `normalizeMap` to also backfill `status: "none"` on every
  objective and `progress: "none"` on every initiative (for maps saved before this phase),
  alongside the existing `connections` backfill.

## 2. Status and progress palette helpers

- `src/lib/statusPalette.ts`: `STATUS_META: Record<ObjectiveStatus, { color: string }>`
  mapping to the existing CSS custom properties (`var(--color-status-on-track)` etc.;
  `"none"` maps to `var(--color-status-neutral)`). `STATUS_CYCLE` ordered array and
  `nextStatus(current)` helper used by the click handler. `LEGEND_STATUSES` (the three
  assignable, non-`"none"` statuses in display order) for rendering the legend.
- `src/lib/initiativeProgressPalette.ts`: same shape as `statusPalette.ts` but for
  `InitiativeProgress` — `INITIATIVE_PROGRESS_META` maps to the *same* three CSS custom
  properties (no new color tokens), `INITIATIVE_PROGRESS_CYCLE` +
  `nextInitiativeProgress(current)`, and `INITIATIVE_PROGRESS_LABEL_KEYS` for the tooltip
  text (there's no legend for this one, per the "don't eat screen space" requirement).

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

## 5. Initiative progress control

- `src/components/InteractiveObjectiveCard.tsx`: takes a new `perspectiveId` prop (from
  `InteractivePerspectiveRow`, which already has `perspective.id` in scope). Each initiative's
  `.initiative-dot` (previously an inert `<div>`) becomes a `<button>` colored via
  `INITIATIVE_PROGRESS_META[initiative.progress].color`, with `title`/`aria-label` from
  `INITIATIVE_PROGRESS_LABEL_KEYS` for discoverability. Its `onClick` calls
  `e.stopPropagation()` first (so it never also fires the card's own `onClick`, which cycles
  objective status), then dispatches `SET_INITIATIVE_PROGRESS` with
  `nextInitiativeProgress(initiative.progress)`.
- `src/components/InitiativeRow.tsx` (Create Strategy Map mode): untouched — its dot stays a
  plain, non-interactive `<div>`.

## 6. Styling

- `src/styles/map.css`: `.status-legend` row styling (swatch + label), the
  `.status-mode-card:hover` affordance, and confirm the existing `.objective-card` border-top
  rule no longer hardcodes `var(--color-status-neutral)` as the *only* color (inline style
  takes over per-card in `InteractiveObjectiveCard`, but not in `ObjectiveCard`). Reset
  default button chrome on `.initiative-dot` (border, padding) so the interactive variant
  keeps the same 7px circular footprint as the static one, and add a
  `.interactive-objective-card .initiative-dot:hover`/`:focus-visible` ring scoped to the
  Track Performance variant only (the plain `<div>` in Create Strategy Map mode gets no hover
  state, since it isn't interactive there).

## 7. Manual validation

- Run through `validation.md` end to end in the browser (dev server) before considering the
  phase done.
