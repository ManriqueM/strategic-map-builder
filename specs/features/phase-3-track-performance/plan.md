# Phase 3 — Track Performance: Plan

Aligns with `specs/mission.md` (design-first, incremental) and `specs/tech-stack.md` (status
palette + colored top border + legend, recreated from the Claude Design handoff bundle,
option 2a). Builds on Phase 1's `ConnectorsOverlay`/`mapReducer`/`storage.ts`/
`useObjectiveBoxRefs`/`useConnectorPaths` — additive, reusing that machinery in a dedicated
read-only view rather than new parallel geometry code.

## 1. Data model

- `src/types.ts`: add `export type ObjectiveStatus = "none" | "on-track" | "needs-attention" |
  "off-track";` and a `status: ObjectiveStatus` field on `Objective`. Add
  `export type InitiativeProgress = "not-on-track" | "on-track" | "complete";` and a
  `progress: InitiativeProgress` field on `Initiative`.
- `src/lib/defaultMap.ts`: `makeObjective` sets `status: "none"`; `makeInitiative` sets
  `progress: "not-on-track"`.
- `src/state/mapReducer.ts`: `ADD_OBJECTIVE` creates new objectives with `status: "none"`;
  `ADD_INITIATIVE` creates new initiatives with `progress: "not-on-track"`; add
  `{ type: "SET_OBJECTIVE_STATUS"; perspectiveId; objectiveId; status: ObjectiveStatus }` and
  `{ type: "SET_INITIATIVE_PROGRESS"; perspectiveId; objectiveId; initiativeId; progress:
  InitiativeProgress }`.
- `src/lib/storage.ts`: extend `normalizeMap` to backfill `status: "none"` on every objective
  and `progress: "not-on-track"` on every initiative missing the field (maps saved before
  Phase 3), alongside the existing `connections` backfill. Additionally **remap** initiative
  `progress` values written under the earlier four-state model (`"none" | "on-track" |
  "in-progress" | "not-on-track"`), since this revision changes the enum itself, not just
  adds a missing field: `"none"` → `"not-on-track"`, `"in-progress"` → `"on-track"`,
  `"on-track"`/`"not-on-track"` pass through unchanged. This is `normalizeMap`'s first
  value-remapping migration (prior backfills only ever filled in a *missing* field) — worth
  a code comment explaining why, so the next migration doesn't have to rediscover the need.

## 2. Status and progress palette helpers

- `src/lib/statusPalette.ts`: `STATUS_META: Record<ObjectiveStatus, { color: string }>`
  mapping to the existing CSS custom properties (`var(--color-status-on-track)` etc.;
  `"none"` maps to `var(--color-status-neutral)`). `STATUS_CYCLE` ordered array and
  `nextStatus(current)` helper used by the click handler. `LEGEND_STATUSES` (the three
  assignable, non-`"none"` statuses in display order) for rendering the legend.
- `src/lib/initiativeProgressPalette.ts`: `INITIATIVE_PROGRESS_META: Record<InitiativeProgress,
  { color: string; icon: "x" | "arrow" | "check" }>` — `"not-on-track"` →
  `var(--color-status-neutral)` + x icon, `"on-track"` → `var(--color-navy-700)` + arrow icon
  (deliberately not the amber token, to avoid colliding with the objective legend's amber
  "Needs Attention"), `"complete"` → `var(--color-status-on-track)` + check icon.
  `INITIATIVE_PROGRESS_CYCLE` (`not-on-track → on-track → complete → not-on-track`) +
  `nextInitiativeProgress(current)`. `INITIATIVE_PROGRESS_LABEL_KEYS` for both the legend
  labels and the marker's tooltip/aria-label — every state gets a key this time (no
  "unlabeled default" state, unlike `LEGEND_STATUSES`).

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
- `src/components/InitiativeProgressLegend.tsx` (new): sibling to `StatusLegend`, rendering an
  "Initiative Progress" label + one icon/label pair per `INITIATIVE_PROGRESS_CYCLE` entry
  (all three, including "Not on Track" — unlike `StatusLegend`, there's no unlabeled default
  here). Rendered directly below `StatusLegend` in `TrackPerformanceView`.

## 5. Initiative progress control

- `src/components/InteractiveObjectiveCard.tsx`: takes a new `perspectiveId` prop (from
  `InteractivePerspectiveRow`, which already has `perspective.id` in scope). Each initiative's
  `.initiative-dot` (previously an inert `<div>`, a plain filled circle) becomes a `<button>`
  rendering the small icon glyph for `initiative.progress` (as inline SVG paths — matching how
  the connector arrowheads were redone as crisp stroke-based icons rather than relying on a
  system font glyph at ~10px) in `INITIATIVE_PROGRESS_META[...].color`, with `title`/
  `aria-label` from `INITIATIVE_PROGRESS_LABEL_KEYS` for discoverability. Its `onClick` calls
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
  keep the check/arrow/x glyph legible, e.g. ~13px) — a small, deliberate size difference from
  Create Strategy Map mode's plain dot, still compact enough not to disrupt the initiative
  row's density. Add a `.interactive-objective-card .initiative-dot:hover`/`:focus-visible`
  ring scoped to the Track Performance variant only. New `.initiative-progress-legend`
  styling mirrors `.status-legend`'s row layout, with each swatch showing the icon (in its
  color) instead of a plain color chip.

## 7. Manual validation

- Run through `validation.md` end to end in the browser (dev server) before considering the
  phase done.
