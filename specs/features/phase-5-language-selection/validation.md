# Phase 5 — Language Selection: Validation

## Automated

- `npm run build` (`tsc -b && vite build`) passes with no type errors.
- `npm run lint` (oxlint) passes.

## Manual — run in the dev server (`npm run dev`)

1. **Switcher present on both screens**: My Maps screen shows a language selector next to
   "+ New map"; open a map, the builder toolbar shows the same selector next to Save.
2. **Switching translates chrome, immediately**: on My Maps, switch to Español → kicker,
   title, "+ New map", empty state (if no maps), and each map row's Rename/Duplicate/Delete
   all switch to Spanish immediately, no reload needed.
3. **Builder chrome translates**: open a map, switch to Español → "← Mis Mapas", the
   Edit/Connect/Status labels, the Saved/Unsaved-changes text, "Guardar", and the sections
   panel (Secciones/Misión/Visión/Valores/Perspectivas/+ Agregar perspectiva) all translate.
4. **Interactive view + status legend translate**: switch to Connect mode → hint text is in
   Spanish; switch to Status mode → hint text and the legend ("Estado", "En curso", "Necesita
   atención", "Fuera de curso") are in Spanish.
5. **Map content is unaffected**: with an existing map that has custom mission/vision/values/
   objective/perspective text, switching languages does not alter any of that text — only the
   surrounding chrome (labels, buttons, hints) changes.
6. **Confirmation flows translate**: trigger the unsaved-changes-leave banner and the
   delete-map confirmation in Español → both the prompt text and their buttons (Seguir
   editando/Descartar y salir, Cancelar/Eliminar) are in Spanish.
7. **Preference persists**: switch to Español, reload the page → the app still shows Spanish
   chrome (on both My Maps and, after reopening a map, the builder) without re-selecting it.
8. **Switch back to English**: confirm every string that changed in steps 2–6 reverts to its
   English wording, and nothing is left half-translated.
9. **No regressions**: all Phase 1–4 functionality (editing, save/load, connections, status
   cycling) still works identically regardless of which language is active.
