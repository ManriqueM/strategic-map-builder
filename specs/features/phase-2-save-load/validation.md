# Phase 2 — Save/Load: Validation

## Automated

- `npm run build` (or `tsc` via the existing project script) passes with no type errors.
- `npm run lint` (if configured) passes.

## Manual — run in the dev server (`npm run dev`)

1. **First load, empty state**: with `localStorage` cleared, load the app → lands on My
   Maps screen showing an empty state with a "New map" action (no crash on missing key).
2. **Create + save**: click "New map", give it a name, confirm the builder opens with the
   Phase 1 default template. Edit some content (e.g. mission text, add an objective). Click
   "Save". Reload the page → My Maps list shows the map with an updated "last edited" time.
3. **Load persists edits**: open the saved map again → the edits from step 2 are present
   (not reset to the default template).
4. **Multiple maps**: create a second map with a different name. Confirm My Maps lists both,
   independently editable, and saving one does not affect the other's stored content.
5. **Rename**: rename a map from the My Maps list (or builder header) → new name shows in
   the list; the underlying id/content is unchanged (open it, content intact).
6. **Duplicate**: duplicate a map → a second entry appears with a distinct name/id and the
   same content at time of duplication; editing the duplicate doesn't affect the original.
7. **Delete**: delete a map with confirmation → it disappears from the list and
   `localStorage` no longer contains it (check via devtools Application tab or
   `localStorage.getItem(...)`).
8. **Dirty-state warning**: open a map, make an edit, click "Back to My Maps" without
   saving → warned about unsaved changes before leaving (cancel keeps you in the builder;
   confirm discards and returns to the list).
9. **No regressions**: all Phase 1 builder interactions (toggle sections, add/remove/rename
   perspectives, edit objectives/initiatives) still work identically once inside the
   builder for a loaded map.
10. **Corrupt storage resilience**: manually set the `localStorage` key to invalid JSON via
    devtools, reload → app falls back to an empty My Maps list rather than crashing.
