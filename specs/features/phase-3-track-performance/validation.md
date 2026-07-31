# Phase 3 — Track Performance: Validation

## Automated

- `npm run build` (`tsc -b && vite build`) passes with no type errors.
- `npm run lint` (oxlint) passes.

## Manual — run in the dev server (`npm run dev`)

1. **Second mode appears**: open a saved map → toolbar shows
   `Create Strategy Map | Track Performance`; click "Track Performance" → canvas switches to
   a read-only, full-width interactive layout (sections panel gone), with a legend visible
   below the perspective rows.
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
5. **Initiative progress cycles independently**: in Track Performance mode, click an
   initiative's dot once → it turns green (On Track); click again → amber (In Progress);
   click again → red (Not On Track); click a fourth time → back to neutral. The parent
   objective's own status/top-border color does not change from these clicks, and clicking
   the dot never advances the objective's own status cycle.
6. **Initiative progress is Track-Performance-only**: switch to Create Strategy Map mode →
   every initiative dot is plain neutral gray and not clickable (hovering it shows no pointer
   cursor or ring), regardless of progress assigned in Track Performance.
7. **Connectors are inert in Track Performance mode**: with an existing connection from
   Create Strategy Map mode, hover it in Track Performance → still highlights (harmless);
   click directly on the connector line → does not remove it (only Create Strategy Map mode
   allows removal); clicking a card underneath/near the line still cycles that card's status.
8. **No stray ring styling in Track Performance mode**: cards don't show Create Strategy
   Map's blue "pending" selection ring — only a plain hover affordance (cursor pointer,
   subtle background) plus their status-colored border and, if a connector is hovered, the
   red "hot" endpoint ring.
9. **Persistence**: assign statuses and initiative progress to a few objectives/initiatives,
   click Save, reload the page, reopen the map → the same statuses/colors are present in
   Track Performance, and Create Strategy Map still shows neutral borders/dots throughout.
10. **Old-map compatibility**: strip `connections`, every objective's `status` key, and every
    initiative's `progress` key from a stored map via devtools, reload, open it → loads
    without crashing; all objectives/initiatives show neutral indicators and zero
    connections; assigning a new status, initiative progress, and connecting objectives all
    still work from that point.
11. **No regressions**: Create Strategy Map mode's text editing, add/remove
    objectives/initiatives, click-to-connect/hover/remove, and
    Save/Rename/Back/unsaved-changes warning all still work exactly as in Phase 1.
