# Phase 3 — Track Performance: Requirements

## Scope

Add per-objective status (On Track / Needs Attention / Off Track) and per-initiative progress
(Not on Track / On Track / Complete) with a second toolbar mode, **Track Performance**, for
assigning both — reflected only in Track Performance as a colored top border on the objective
card, and as a small clickable icon (not just a color) on each initiative, each with its own
legend. Objective colors reuse the palette already defined in `index.css`
(`--color-status-on-track`, `--color-status-attention`, `--color-status-off-track`,
`--color-status-neutral`); initiative progress uses its own icon+color set (see below) chosen
to stay visually distinct from the objective legend.

### In scope

- **Status data on objectives**: each `Objective` gets a `status` field:
  `"none" | "on-track" | "needs-attention" | "off-track"`, defaulting to `"none"` for new
  objectives (neutral border, same look as Phase 1).
- **Second toolbar mode**: `Create Strategy Map | Track Performance` segmented control. Track
  Performance is a read-only canvas (no sections panel, no text editing, no connect-selection)
  — same visible Vision/Mission/Values/perspectives/connectors as Create Strategy Map, minus
  the authoring controls.
- **Assigning status**: in Track Performance mode, clicking an objective card cycles its
  status `none → on-track → needs-attention → off-track → none`. (Simpler than requiring a
  precise click on the 9px border strip itself — the whole card is the click target.)
- **Status legend**: shown at the bottom of the Track Performance canvas (below the last
  perspective row, matching the design source's footer legend placement) — a color swatch +
  label for each of the three named statuses (neutral/"none" isn't a legend entry, same as the
  design source, which only lists the three assignable statuses). The legend's own label stays
  "Status" (it labels the objective's status field, not the mode name).
- **Colored top border is Track-Performance-only**: the objective card's top border reflects
  `status` only when rendered in Track Performance (`InteractiveObjectiveCard`). In Create
  Strategy Map mode (`ObjectiveCard`), the border is always the neutral color regardless of
  the objective's assigned status — status is something you *view* while authoring, not
  something visible while editing.
- **Initiative progress**: each `Initiative` gets a `progress` field with three states —
  **Not on Track** (default for every new initiative — covers both "hasn't been started yet"
  and "actively failing," a deliberate simplification: an unstarted initiative reads the same
  as a stalled one, both needing attention), **On Track** (in progress and tracking well), and
  **Complete**. In Track Performance mode, each initiative's marker (already present as a
  bullet next to its text) is clickable and shows a distinct icon + color per state, cycling
  `Not on Track → On Track → Complete → Not on Track` on click, independently of the
  objective's own status:
  - **Not on Track** — ✕, neutral gray (`--color-status-neutral`).
  - **On Track** — → (right-facing arrow/chevron), navy accent (`--color-navy-700`) —
    deliberately *not* amber, so it can't be misread as the objective legend's amber
    "Needs Attention" (a warning) when the two legends sit close together.
  - **Complete** — ✓, on-track green (`--color-status-on-track`).
  Clicking the marker never also cycles the parent objective's status (it stops event
  propagation before the card's own click handler runs).
  Like objective status, this is Track-Performance-only: initiative markers in Create
  Strategy Map mode stay the plain, non-interactive neutral dot they've always been.
- **Initiative progress legend**: shown alongside the objective status legend at the bottom of
  the Track Performance canvas — an icon + concise label for each of the three states
  ("Not on Track", "On Track", "Complete"), unlike the objective legend, every state
  (including the default) gets an entry here, since "Not on Track" is itself meaningful
  information the user should be able to look up, not a "nothing set yet" placeholder.
- **Connectors remain visible in Track Performance mode** (read-only): the same connector
  lines from Phase 1 render for context, but hover-highlight/click-to-remove is
  Create-Strategy-Map-mode-only — Track Performance's card clicks are reserved for cycling
  status, so connector removal there would be ambiguous/accidental.
- **Persistence**: status and initiative progress are part of the `StrategyMap` document (on
  each `Objective`/`Initiative`), saved and loaded exactly like text content and connections
  via the existing Phase 2 Save button — no separate save action, no autosave.
- **Old saved maps get sensible defaults**: maps saved before this phase (or before this
  initiative-progress revision) won't have a `status` field on their objectives or a
  `progress` field on their initiatives; the storage layer normalizes missing `status` to
  `"none"` and missing `progress` to `"not-on-track"` on read, same pattern as the
  `connections` backfill. Maps saved under the previous four-state initiative model
  (`"none" | "on-track" | "in-progress" | "not-on-track"`) also get remapped on read: `"none"`
  (not started) → `"not-on-track"`; `"in-progress"` (actively being worked, the closest prior
  match to the new "tracking well" meaning) → `"on-track"`; `"on-track"` and `"not-on-track"`
  keep their labels. There was no prior `"complete"` value, so nothing maps to it — existing
  data never silently becomes "Complete".

### Out of scope (later phases, per `specs/roadmap.md`)

- Language switching / i18n — Phase 4.
- Editing status or initiative progress from Create Strategy Map mode — both are
  Track-Performance-only, to keep each mode's click target unambiguous (Create Strategy Map =
  text/wiring, Track Performance = status/progress).

## Key decisions

- **Track Performance reuses the same interactive-canvas machinery as Create Strategy Map**
  (box refs, `useConnectorPaths`, `ConnectorsOverlay`) via a dedicated read-only view
  (`TrackPerformanceView`), rather than a parameterized shared component — Create Strategy
  Map's canvas mixes editable and connectable cards, while Track Performance's canvas is
  fully read-only apart from the status-cycle click, so the two click models don't share a
  component the way the old three-mode Edit/Connect/Status split once did.
- **Whole-card click to cycle**, not a precise click on the border pixel.
- **Status colors and labels reuse existing tokens** (`--color-status-on-track` `#3a6f4f`,
  `--color-status-attention` `#c9973d`, `--color-status-off-track` `#b3503f`,
  `--color-status-neutral` `#d8d3c9`) already defined in `index.css` from Phase 1.
- **`status` lives on `Objective`, mutated via a `SET_OBJECTIVE_STATUS` reducer action**
  (explicit target status, not an implicit "cycle" action) — the Track Performance component
  computes the next status in the cycle and dispatches the explicit value, keeping the
  reducer's action shape consistent with existing `SET_*` actions.
- **Connector interactivity is mode-scoped**: `ConnectorsOverlay` takes an `interactive` flag;
  Create Strategy Map mode wires hover/click-to-remove, Track Performance renders the same
  lines statically (hover highlight still fine/harmless, but no click-to-remove) so a click
  always means "cycle this card's status" with no ambiguity.
- **Initiative progress is its own type** (`InitiativeProgress`, three states — not on track /
  on track / complete), not a reuse of `ObjectiveStatus` — the label sets and even the state
  count genuinely differ from objective status (four states) and from each other, mutated via
  a parallel `SET_INITIATIVE_PROGRESS` action.
- **The initiative marker itself is the control** — no dropdown or separate button was added;
  the existing bullet marker becomes a clickable icon+color button in Track Performance mode
  only, keeping the initiative row's footprint essentially unchanged from Create Strategy
  Map mode's plain dot (an icon glyph replaces a plain-colored circle, not a new element).
- **Icon, not color alone, carries the meaning.** The Phase-3-original design used color only
  (mirroring the objective legend's green/amber/red) with no initiative legend, reasoned as
  "the three colors already mean the same thing as the objective legend." In practice that
  reuse was the problem: same color, different meaning, with no legend to disambiguate. This
  revision gives initiative progress its own icon set (✕ / → / ✓) and its own legend, and
  swaps the "on track" color from amber to navy specifically to stop colliding with the
  objective legend's amber "Needs Attention".
