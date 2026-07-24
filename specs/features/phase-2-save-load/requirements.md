# Phase 2 — Save/Load: Requirements

## Scope

Add persistence to the builder: named maps saved to `localStorage`, a dedicated "My Maps"
landing screen listing them, and the ability to open, rename, duplicate, and delete a saved
map. The builder itself (Phase 1) is unchanged except that it now operates on a specific
saved map instead of one throwaway in-memory map.

### In scope

- **My Maps landing screen**: shown first when the app loads (before the builder). Lists all
  saved maps (name, last-edited timestamp), each row opens that map in the builder. A
  "New map" action creates a new map (from the Phase 1 default template), prompts for a
  name, saves it, and opens the builder on it.
- **Save**: explicit "Save" action in the builder header. First save of a new map may prompt
  for a name if not already named; subsequent saves overwrite that map's stored record and
  update its last-edited timestamp. No autosave.
- **Rename**: rename a saved map, from the My Maps list and/or from the builder header.
- **Duplicate**: copy a saved map under a new name/id, from the My Maps list.
- **Delete**: remove a saved map from `localStorage`, from the My Maps list, with a
  confirmation step (destructive action).
- **Back to My Maps**: navigation control in the builder to return to the list without
  losing unsaved changes silently — warn if there are unsaved edits.
- **Persistence layer**: all saved maps stored under a single `localStorage` key as a
  dictionary of `{ id -> { name, createdAt, updatedAt, map: StrategyMap } }`, so reads/writes
  are one JSON blob (simplest correct approach at this scale — no pagination or quota
  concerns expected for a personal tool).

### Out of scope (later phases, per `specs/roadmap.md`)

- Node-to-node connections between objectives — Phase 3.
- Status color assignment — Phase 4.
- Language switching / i18n — Phase 5.
- Any server/cloud sync — not on the roadmap; `localStorage` is the only persistence target.

## Key decisions

- **Manual named save, not autosave.** Matches the user's explicit choice: multiple named
  maps live side by side in `localStorage`; nothing is written until the user clicks Save,
  so accidental edits don't silently overwrite a saved map. Unsaved-changes are tracked
  in-memory (dirty flag) so navigation away can warn the user.
- **Landing screen, not a panel.** "My Maps" is a distinct top-level view/route (in-app view
  state, not necessarily a router) shown on load and reachable from the builder header,
  rather than a sidebar or header dropdown — matches the user's choice for how the list
  should surface.
- **Map identity**: each saved map gets a stable id (`makeId("map")`, consistent with the
  existing `lib/id.ts` pattern) generated on first save, independent of its display name, so
  renaming never breaks the stored reference.
- **Storage format versioning**: wrap the stored blob with a small envelope (e.g.
  `{ version: 1, maps: {...} }`) so future phases can migrate the shape without guessing.
- **No backend.** Consistent with Phase 1 and the project's tech stack — `localStorage` is
  read/write via a thin persistence module (e.g. `src/lib/storage.ts`), not scattered
  `localStorage.getItem` calls, so the storage shape only needs to be known in one place.
- **Reuses Phase 1's `MapContext`/`mapReducer`** for in-builder editing; persistence is a
  layer on top (load into context on open, serialize context state on save) rather than a
  rewrite of the state model.
