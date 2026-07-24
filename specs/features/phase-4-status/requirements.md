# Phase 4 — Interactive View: Status: Requirements

## Scope

Add per-objective status (On Track / Needs Attention / Off Track) with a third toolbar mode,
"Status", for assigning it — reflected everywhere an objective card renders (Edit, Connect,
Status) as a colored top border, matching the palette already defined in `index.css`
(`--color-status-on-track`, `--color-status-attention`, `--color-status-off-track`,
`--color-status-neutral`) and the design source's `STATUS_META`.

### In scope

- **Status data on objectives**: each `Objective` gets a `status` field:
  `"none" | "on-track" | "needs-attention" | "off-track"`, defaulting to `"none"` for new
  objectives (neutral border, same look as Phases 1–3).
- **Third toolbar mode**: `Edit | Connect | Status` segmented control (extends Phase 3's
  toggle). Status mode reuses the read-only interactive canvas (no sections panel, no text
  editing) — same visible Vision/Mission/Values/perspectives/connectors as Connect mode.
- **Assigning status**: in Status mode, clicking an objective card cycles its status
  `none → on-track → needs-attention → off-track → none`. (Simpler than requiring a precise
  click on the 9px border strip itself — the whole card is the click target, same affordance
  model as Connect mode's whole-card click target.)
- **Status legend**: shown at the bottom of the Status-mode canvas (below the last
  perspective row, matching the design source's footer legend placement) — a color swatch +
  label for each of the three named statuses (neutral/"none" isn't a legend entry, same as the
  design source, which only lists the three assignable statuses).
- **Colored top border everywhere**: the objective card's top border reflects `status` in all
  three modes (Edit, Connect, Status) — not just Status mode — since it's a property of the
  map's content, not a mode-specific view concern.
- **Connectors remain visible in Status mode** (read-only): the same connector lines from
  Phase 3 render in Status mode for context, but hover-highlight/click-to-remove is
  Connect-mode-only — Status mode's card clicks are reserved for cycling status, so connector
  removal there would be ambiguous/accidental.
- **Persistence**: status is part of the `StrategyMap` document (on each `Objective`), saved
  and loaded exactly like text content and connections via the existing Phase 2 Save button —
  no separate save action, no autosave.
- **Old saved maps default to `"none"`**: maps saved before this phase (or before Phase 3)
  won't have a `status` field on their objectives; the storage layer normalizes this to
  `"none"` on read, same pattern as Phase 3's `connections` backfill.

### Out of scope (later phases, per `specs/roadmap.md`)

- Language switching / i18n — Phase 5.
- Editing status from Edit or Connect mode — status assignment is Status-mode-only, to keep
  each mode's click target unambiguous (Edit = text, Connect = wiring, Status = status).

## Key decisions

- **Status mode reuses Phase 3's interactive canvas**, parameterized by a `mode: "connect" |
  "status"` prop, rather than a fourth near-duplicate read-only view — same rows, same
  connectors overlay, same box-ref/geometry machinery; only the click handler and hint/legend
  content differ per mode. Avoids maintaining two parallel copies of the same layout.
- **Whole-card click to cycle**, not a precise click on the border pixel — consistent with
  Connect mode's whole-card click target and far more usable than a 9px hit target.
- **Status colors and labels reuse existing tokens** (`--color-status-on-track` `#3a6f4f`,
  `--color-status-attention` `#c9973d`, `--color-status-off-track` `#b3503f`,
  `--color-status-neutral` `#d8d3c9`) already defined in `index.css` from Phase 1 — these were
  reserved but unused until now, so no new palette work is needed.
- **`status` lives on `Objective`, mutated via a new `SET_OBJECTIVE_STATUS` reducer action**
  (explicit target status, not an implicit "cycle" action) — the Status-mode component
  computes the next status in the cycle and dispatches the explicit value, keeping the
  reducer's action shape consistent with existing `SET_*` actions rather than introducing a
  reducer-side state machine.
- **Connector interactivity is mode-scoped**: `ConnectorsOverlay` gains an `interactive` flag;
  Connect mode wires hover/click-to-remove, Status mode renders the same lines statically
  (hover highlight still fine/harmless, but no click-to-remove) so a click always means
  "cycle this card's status" with no ambiguity.
