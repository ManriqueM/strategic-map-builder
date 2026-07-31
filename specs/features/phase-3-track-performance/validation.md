# Phase 3 — Track Performance: Validation

## Automated

- `npm run build` (`tsc -b && vite build`) passes with no type errors.
- `npm run lint` (oxlint) passes.

## Manual — run in the dev server (`npm run dev`)

1. **Second mode appears**: open a saved map → toolbar shows
   `Create Strategy Map | Track Performance`; click "Track Performance" → canvas switches to
   a read-only, full-width interactive layout (sections panel gone), with both the status
   legend and the initiative progress legend visible below the perspective rows.
2. **Cycle status by clicking a card**: in Track Performance mode, click an objective card
   once → its top border turns the "On Track" green; click again → turns "Needs Attention"
   amber; click again → turns "Off Track" red; click a fourth time → returns to the
   neutral/no-status border.
3. **Status color is Track-Performance-only**: after assigning a status in Track Performance
   mode, switch to Create Strategy Map mode → the same card shows the plain neutral top border
   (not the colored one) — the assigned status still exists (switching back to Track
   Performance shows it again), it's just not rendered while authoring.
4. **Legend matches assigned colors**: the three legend swatches (On Track / Needs Attention /
   Off Track) visually match the colors used on the cards; the neutral/no-status state has no
   legend entry.
5. **Initiative progress cycles independently**: in Track Performance mode, an initiative's
   marker starts as a gray ✕ (Not on Track); click once → turns a navy → arrow (On Track);
   click again → turns a green ✓ (Complete); click a third time → back to the gray ✕. The
   parent objective's own status/top-border color does not change from these clicks, and
   clicking the marker never advances the objective's own status cycle.
6. **Initiative progress legend matches the marker colors/icons**: the legend shows all three
   states — ✕ Not on Track, → On Track, ✓ Complete — and the On Track color is visibly
   distinct from the status legend's amber "Needs Attention" swatch (not the same color, to
   avoid the two legends being misread against each other).
7. **Initiative progress is Track-Performance-only**: switch to Create Strategy Map mode →
   every initiative marker is a plain, uncolored, non-interactive dot (hovering it shows no
   pointer cursor or ring), regardless of progress assigned in Track Performance.
8. **Connectors are inert in Track Performance mode**: with an existing connection from
   Create Strategy Map mode, hover it in Track Performance → still highlights (harmless);
   click directly on the connector line → does not remove it (only Create Strategy Map mode
   allows removal); clicking a card underneath/near the line still cycles that card's status.
9. **No stray ring styling in Track Performance mode**: cards don't show Create Strategy
   Map's blue "pending" selection ring — only a plain hover affordance (cursor pointer,
   subtle background) plus their status-colored border and, if a connector is hovered, the
   red "hot" endpoint ring.
10. **Persistence**: assign statuses and initiative progress to a few objectives/initiatives,
    click Save, reload the page, reopen the map → the same statuses/colors/icons are present
    in Track Performance, and Create Strategy Map still shows neutral borders/dots throughout.
11. **Old-map compatibility**: strip `connections`, every objective's `status` key, and every
    initiative's `progress` key from a stored map via devtools, reload, open it → loads
    without crashing; all objectives/initiatives show neutral indicators and zero
    connections; assigning a new status, initiative progress, and connecting objectives all
    still work from that point.
12. **Old initiative-progress-model migration**: on a map with an initiative whose stored
    `progress` is one of the previous model's values (`"none"` or `"in-progress"` — e.g. set
    via devtools if no such map exists anymore), reload and open it → `"none"` reads as
    "Not on Track" (✕) and `"in-progress"` reads as "On Track" (→), not as some fourth,
    unrecognized state.
13. **No regressions**: Create Strategy Map mode's text editing, add/remove
    objectives/initiatives, click-to-connect/hover/remove, and
    Save/Rename/Back/unsaved-changes warning all still work exactly as in Phase 1.
