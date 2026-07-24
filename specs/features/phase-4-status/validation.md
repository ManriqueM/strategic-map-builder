# Phase 4 — Interactive View: Status: Validation

## Automated

- `npm run build` (`tsc -b && vite build`) passes with no type errors.
- `npm run lint` (oxlint) passes.

## Manual — run in the dev server (`npm run dev`)

1. **Third mode appears**: open a saved map → toolbar shows `Edit | Connect | Status`; click
   "Status" → canvas switches to the same read-only, full-width interactive layout as Connect
   mode (sections panel gone), with a legend visible below the perspective rows.
2. **Cycle status by clicking a card**: in Status mode, click an objective card once → its top
   border turns the "On Track" green; click again → turns "Needs Attention" amber; click again
   → turns "Off Track" red; click a fourth time → returns to the neutral/no-status border.
3. **Status shows in every mode**: after assigning a status in Status mode, switch to Edit
   mode → the same card shows the same colored top border (not editable-away); switch to
   Connect mode → same colored border, connectors still render normally on top of it.
4. **Legend matches assigned colors**: the three legend swatches (On Track / Needs Attention /
   Off Track) visually match the colors used on the cards; the neutral/no-status state has no
   legend entry (matching the design source).
5. **Connectors are inert in Status mode**: with an existing connection from Phase 3, hover it
   in Status mode → still highlights (harmless); click directly on the connector line in
   Status mode → does not remove it (only Connect mode allows removal); clicking a card
   underneath/near the line still cycles that card's status.
6. **No stray ring styling in Status mode**: cards in Status mode don't show Connect mode's
   blue "pending" or red "hot" selection rings — only a plain hover affordance (cursor
   pointer, subtle background) plus their status-colored border.
7. **Persistence**: assign statuses to a couple of objectives, click Save, reload the page,
   reopen the map → the same statuses/colors are present in all three modes.
8. **Old-map / old-connections-phase compatibility**: strip both `connections` and every
   objective's `status` key from a stored map via devtools, reload, open it → loads without
   crashing; all objectives show the neutral border and zero connections; assigning a new
   status and connecting objectives still works from that point.
9. **No regressions**: Edit mode text editing, add/remove objectives/initiatives,
   Save/Rename/Back/unsaved-changes warning, and Connect mode's click-to-connect/hover/remove
   all still work exactly as in Phases 1–3.
