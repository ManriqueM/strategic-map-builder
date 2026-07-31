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
5. **Initiative progress cycles through all four states**: in Track Performance mode, a new
   initiative's marker starts as a blank gray square (unset); click once → a red ✕ (Not on
   Track); click again → a yellow light bulb (On Track); click again → a green ✓ (Complete);
   click a fourth time → back to the blank square. The parent objective's own status/
   top-border color does not change from these clicks, and clicking the marker never advances
   the objective's own status cycle.
6. **Initiative progress legend order matches the status legend's color sequence**: the
   legend shows exactly three entries — in order, ✓ Complete (green), 💡 On Track (amber), ✕
   Not on Track (red) — the same green → amber → red order as the status legend directly
   above it, even though the click-cycle order is different (unset → Not on Track → On Track
   → Complete). The unset/blank state has no legend entry, matching how the status legend
   omits its own default.
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
    `progress` is the original four-state model's now-retired `"in-progress"` value (set via
    devtools if no such map exists anymore), reload and open it → reads as "On Track" (yellow
    light bulb), not as some unrecognized fifth state.
13. **Migration is idempotent — assigning "Not on Track" survives a reload**: in Track
    Performance, click an initiative's marker once so it reads "Not on Track" (red ✕), click
    Save, reload the page, reopen the map → it still reads "Not on Track", not reset to blank.
    (This is the failure mode of collapsing every stored `"not-on-track"` into the unset
    default on read — it must not happen.)
14. **No regressions**: Create Strategy Map mode's text editing, add/remove
    objectives/initiatives, click-to-connect/hover/remove, and
    Save/Rename/Back/unsaved-changes warning all still work exactly as in Phase 1.
