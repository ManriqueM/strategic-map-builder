# Phase 4 — Interactive View: Status: Plan

Aligns with `specs/mission.md` (design-first, incremental) and `specs/tech-stack.md` (status
palette + colored top border + legend, recreated from the Claude Design handoff bundle,
option 2a). Builds on Phase 3's `InteractiveMap`/`ConnectorsOverlay`/`mapReducer`/`storage.ts`
— additive, with a small parameterization of Phase 3's components rather than new parallel
ones.

## 1. Data model

- `src/types.ts`: add `export type ObjectiveStatus = "none" | "on-track" | "needs-attention" |
  "off-track";` and a `status: ObjectiveStatus` field on `Objective`.
- `src/lib/defaultMap.ts`: `makeObjective` sets `status: "none"`.
- `src/state/mapReducer.ts`: `ADD_OBJECTIVE` creates new objectives with `status: "none"`; add
  `{ type: "SET_OBJECTIVE_STATUS"; perspectiveId: string; objectiveId: string; status:
  ObjectiveStatus }`.
- `src/lib/storage.ts`: extend `normalizeMap` to also backfill `status: "none"` on every
  objective across all perspectives (for maps saved before Phase 3/4), alongside the existing
  `connections` backfill.

## 2. Status palette helper

- `src/lib/statusPalette.ts`: `STATUS_META: Record<ObjectiveStatus, { label: string; color:
  string }>` mapping to the existing CSS custom properties (`var(--color-status-on-track)`
  etc.; `"none"` maps to `var(--color-status-neutral)` with no legend label). `STATUS_CYCLE`
  ordered array and `nextStatus(current)` helper used by the click handler. `LEGEND_STATUSES`
  (the three assignable, non-`"none"` statuses in display order) for rendering the legend.

## 3. Shared top-border color

- `src/components/ObjectiveCard.tsx` (Edit mode) and
  `src/components/InteractiveObjectiveCard.tsx` (Connect/Status modes): apply
  `style={{ borderTopColor: STATUS_META[objective.status].color }}` so the status color shows
  in every mode, on top of the existing `.objective-card` CSS (which keeps the border
  width/style, just not a hardcoded color anymore).

## 4. Mode-aware interactive canvas

- `src/components/BuilderToolbar.tsx`: extend the segmented control to three options —
  `Edit | Connect | Status`.
- `src/components/BuilderScreen.tsx`: `mode` state becomes `"edit" | "connect" | "status"`;
  passes `mode` through to `InteractiveMap` when not `"edit"`.
- `src/components/InteractiveMap.tsx`: accept a `mode: "connect" | "status"` prop.
  - Box click handler branches on `mode`: `"connect"` keeps Phase 3's pending-select logic;
    `"status"` dispatches `SET_OBJECTIVE_STATUS` with `nextStatus(objective.status)`.
  - Hint text is mode-specific (Connect's existing copy vs. a Status-mode line explaining the
    click-to-cycle behavior).
  - Renders the `StatusLegend` (new small component) below the perspective rows when
    `mode === "status"`.
- `src/components/InteractiveObjectiveCard.tsx`: drop the `is-pending`/`is-hot` ring classes
  when `mode === "status"` (those are Connect-mode selection semantics); add a plain hover
  affordance (cursor + subtle background) for Status mode instead.
- `src/components/ConnectorsOverlay.tsx`: add an `interactive: boolean` prop; when `false`
  (Status mode), omit the `onClick` (remove) handler on the hit-path while keeping
  hover-highlight and the visible line — a click over a connector in Status mode still falls
  through to cycle whichever card is under it, never removes the edge.
- `src/components/StatusLegend.tsx`: small presentational component rendering the "Status"
  label + one swatch/label pair per `LEGEND_STATUSES` entry, styled per the design source's
  footer legend row.

## 5. Styling

- `src/styles/map.css`: `.status-legend` row styling (swatch + label, matching the design's
  footer legend), a plain hover state class for Status-mode cards (no ring), and confirm the
  existing `.objective-card` border-top rule no longer hardcodes
  `var(--color-status-neutral)` as the *only* color (inline style takes over per-card).

## 6. Manual validation

- Run through `validation.md` end to end in the browser (dev server) before considering the
  phase done.
