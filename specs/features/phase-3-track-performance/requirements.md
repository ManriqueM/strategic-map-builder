# Phase 3 — Track Performance: Requirements

## Scope

Add per-objective status (On Track / Needs Attention / Off Track) and per-initiative progress
(unset / Not on Track / On Track / Complete) with a second toolbar mode, **Track
Performance**, for assigning both — reflected only in Track Performance as a colored top
border on the objective card, and as a small clickable icon on each initiative, each with its
own legend. Objective colors reuse the palette already defined in `index.css`
(`--color-status-on-track`, `--color-status-attention`, `--color-status-off-track`,
`--color-status-neutral`); initiative progress reuses the same three color tokens (its "On
Track" is intentionally the same amber as the objective legend's "Needs Attention" — see Key
decisions) plus a distinct icon per state so the two legends stay unambiguous side by side.

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
- **Initiative progress**: each `Initiative` gets a `progress` field with four states — a
  distinct **unset default** plus three assignable states, **Not on Track**, **On Track** (in
  progress and tracking well), and **Complete**. Every new initiative starts unset — a blank
  square icon, deliberately empty so it visibly prompts the user to fill it in, rather than
  defaulting to a colored/named status they never actively chose. In Track Performance mode,
  each initiative's marker (already present as a bullet next to its text) is clickable and
  shows a distinct icon + color per state, cycling
  `unset → Not on Track → On Track → Complete → unset` on click, independently of the
  objective's own status:
  - **Unset (default)** — a blank square outline, neutral gray (`--color-status-neutral`), no
    legend entry (see Key decisions).
  - **Not on Track** — a red ✕, off-track red (`--color-status-off-track`).
  - **On Track** — a yellow light bulb, amber (`--color-status-attention`).
  - **Complete** — a green ✓, on-track green (`--color-status-on-track`).
  Clicking the marker never also cycles the parent objective's status (it stops event
  propagation before the card's own click handler runs).
  Like objective status, this is Track-Performance-only: initiative markers in Create
  Strategy Map mode stay the plain, non-interactive neutral dot they've always been.
- **Initiative progress legend**: shown alongside the objective status legend at the bottom of
  the Track Performance canvas — an icon + concise label for each of the three *assignable*
  states, in **Complete, On Track, Not on Track** order — matching the objective status
  legend's green → amber → red color sequence (not the click-cycle order above). Like the
  objective legend, the unset default isn't a legend entry.
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
  `"none"` and missing `progress` to `"none"` (unset) on read, same pattern as the
  `connections` backfill. The only other remapping needed is the original four-state model's
  now-retired `"in-progress"` value → `"on-track"` (the closest match to "tracking well"); a
  `"none"`/`"not-on-track"`/`"on-track"`/`"complete"` value already matches the current model
  and passes through unchanged — this has to be idempotent, since it runs on every read, not
  just once.

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
- **Initiative progress is its own type** (`InitiativeProgress`, four states — unset / not on
  track / on track / complete), not a reuse of `ObjectiveStatus` — the label sets and the
  state count genuinely differ from objective status, mutated via a parallel
  `SET_INITIATIVE_PROGRESS` action.
- **The initiative marker itself is the control** — no dropdown or separate button was added;
  the existing bullet marker becomes a clickable icon+color button in Track Performance mode
  only, keeping the initiative row's footprint essentially unchanged from Create Strategy
  Map mode's plain dot (an icon glyph replaces a plain-colored circle, not a new element).
- **Icon, not color alone, carries the meaning**, so initiative progress can safely reuse the
  *same three color tokens* as the objective status legend (green/amber/red) without the two
  legends being ambiguous — the icon (✕ / lightbulb / ✓) disambiguates them, the color alone
  doesn't have to. (An earlier revision of this feature gave "On Track" a separate navy color
  specifically to avoid this collision when the icon was still a plain colored dot; once every
  state got its own icon, that workaround was no longer needed and was reverted in favor of
  the same green/amber/red vocabulary used everywhere else in the app.)
- **A genuinely blank default, distinct from "Not on Track".** Earlier this feature had three
  states and folded "never touched" and "actively failing" into one combined default value,
  reasoned as "both need attention, so they can share a state." This revision reverses that:
  new initiatives now start in a distinct, unassignable-by-click **unset** state (blank square
  icon) that isn't in the legend, precisely so an untouched initiative doesn't visually read
  as a deliberately-assigned "Not on Track" — the blank icon is a visible prompt to assign a
  real status, not a status itself.
- **Legend display order is independent of click-cycle order**, unlike objective status where
  the two happen to coincide (`LEGEND_STATUSES` is just `STATUS_CYCLE` with the default
  dropped). The progress cycle (`unset → not-on-track → on-track → complete`) follows a
  natural lifecycle progression, but its legend is deliberately sorted differently
  (`complete, on-track, not-on-track`) to match the objective status legend's green → amber →
  red color sequence, so the two legends read consistently when shown together.
