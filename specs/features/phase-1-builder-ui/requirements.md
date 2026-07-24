# Phase 1 — Builder UI: Requirements

## Scope

Build the strategy map **builder** as an in-memory (no persistence yet), fully interactive
editor that matches the chosen design (`Strategy Map Options.dc.html`, option 2a — see
`specs/tech-stack.md` for the full visual spec) for the parts it renders, plus new "builder
chrome" (toggles, add/remove/edit controls) that the design mockups don't depict, since those
mockups only show the finished map, not the authoring UI.

### In scope

- Default map on first load: Mission, Vision, Values, and 4 perspectives (Financial,
  Customer, Internal Process, Learning & Growth) — all visible, all editable, with light
  placeholder content (not the "Meridian Manufacturing" demo copy from the design file).
- Toggle visibility of any section (Mission, Vision, Values, each perspective) — hidden
  sections are excluded from the rendered map.
- Edit all text content inline: mission, vision, each value, perspective names, objective
  text, initiative text.
- Add / remove values, objectives, and initiatives.
- **Perspectives are not fixed to the 4 defaults** (per `specs/mission.md`): add a new
  perspective, remove one, rename any of them, and reorder them.
- Visual output matches the 2a design tokens exactly for anything the design depicts:
  fonts (Manrope / Source Serif 4 / IBM Plex Mono), colors, spacing, card/banner styling.

### Out of scope (later phases, per `specs/roadmap.md`)

- Saving/loading maps (`localStorage`) — Phase 2.
- Node-to-node connections between objectives — Phase 3.
- Status color assignment (on track / needs attention / off track) — Phase 4. Objective
  cards render with a neutral (no-status) top border in this phase; the status data model
  and coloring are introduced in Phase 4.
- Language switching / i18n — Phase 5.

## Key decisions

- **No backend, no persistence in this phase.** The map lives in React component state;
  a page refresh resets to the default map. This is expected and will be resolved in Phase 2.
- **Builder chrome is new UI**, not present in the Claude Design bundle. It must stay in the
  same visual language established by option 2a (Manrope, warm white `#fbfaf8` background,
  navy `#22303f` accents, existing radii/shadows) rather than introducing a different style.
- **Editing pattern**: inline, click-to-edit text (click text → it becomes editable in place)
  for titles/objectives/initiatives, rather than modal forms or a separate settings page —
  keeps editing close to the visual output and consistent with the design's direct-
  manipulation feel.
- **Section/perspective management** (show/hide, add/remove/reorder perspective) lives in a
  compact panel/toolbar alongside the map, styled with the same tokens.
- Default perspective set remains Financial / Customer / Internal Process / Learning & Growth
  (matching the design), but nothing in the data model or UI treats these as special/fixed —
  the same add/remove/rename/reorder controls apply to all perspectives including the
  defaults.
- **Grids must stay clean at any item count, not just 4.** The design's fixed 4-column grids
  (Values row, and the objective grid within each perspective) are a starting look, not a
  hard rule — since values, objectives, and perspectives are all addable/removable, the
  layout must not degrade (awkward stretching with few items, cramped squeezing with many)
  as counts move away from 4. Use a responsive wrapping grid with a sensible min/max tile
  width per row type instead of a hardcoded column count, so e.g. 3 values reads as
  intentional and 8 values wraps cleanly to a second row at a readable size.
