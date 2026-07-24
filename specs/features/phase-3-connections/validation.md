# Phase 3 — Interactive View: Connections: Validation

## Automated

- `npm run build` (`tsc -b && vite build`) passes with no type errors.
- `npm run lint` (oxlint) passes.

## Manual — run in the dev server (`npm run dev`), matching the design source's behavior

1. **Mode toggle**: open a saved map (Edit mode by default) → click "Connect" in the toolbar →
   canvas switches to a full-width, read-only view (sections panel gone, objective text no
   longer editable); click "Edit" → returns to the familiar builder canvas with all prior
   content/edits intact.
2. **Create a connection**: in Connect mode, click one objective box (it gets a visible
   selection ring) → click a different objective box → a bezier curve with an arrowhead
   appears between them, pointing at the second box; the selection ring clears.
3. **Deselect without connecting**: click a box to select it, then click the same box again →
   ring clears, no connection created.
4. **Top-to-bottom routing**: connect two boxes in the same perspective row and two boxes in
   different perspective rows → confirm the curve always exits the sending box's top-center
   and enters the receiving box's bottom-center in both cases (not center-to-center, and not
   dependent on whether the boxes are side by side or in different rows).
4a. **No occlusion by intervening cards**: connect two boxes in the same row with a third box
    positioned between them → the curve stays fully visible on top of that intervening card
    along its whole path, not hidden/clipped behind it.
5. **One edge per pair**: try to connect the same two boxes again (both click orders, A→B and
   B→A) → no duplicate or reverse connector is created either time.
6. **Hover highlight**: hover over an existing connector line → it and its arrowhead switch to
   the "hot" color and thicken, and both of its endpoint boxes show a colored ring; move the
   mouse away → reverts to the default gray, unringed state.
7. **Remove a connection**: click directly on a connector line → it disappears immediately,
   no confirmation step.
8. **Persistence**: create a couple of connections, click Save, reload the page, reopen the
   map → the same connections are present (in Connect mode) and the underlying edit content
   is unaffected.
9. **Resize recalculation**: with a connection present, resize the browser window → the curve
   stays correctly anchored between its two boxes (re-measured, not stale/offset).
10. **Old-map compatibility**: open a map saved before this phase (or manually strip the
    `connections` key from a stored map via devtools) → Connect mode loads without crashing,
    starting with zero connections.
11. **No regressions**: Edit mode still behaves exactly as in Phase 1/2 — toggling
    sections/perspectives, editing text, add/remove objectives/initiatives, Save/Rename/Back,
    and the unsaved-changes warning all still work, including immediately after switching back
    from Connect mode.
