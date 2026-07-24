# Phase 2 — Save/Load: Plan

Aligns with `specs/mission.md` (design-first, incremental — persistence layered onto the
existing builder without touching its visual language) and `specs/tech-stack.md` (React +
TypeScript + Vite, no backend, `localStorage` as the only persistence target).

## 1. Storage module

- `src/lib/storage.ts`: thin wrapper around a single `localStorage` key (e.g.
  `strategy-map-builder:maps`).
  - Envelope shape: `{ version: 1, maps: Record<string, SavedMap> }`.
  - `SavedMap = { id: string; name: string; createdAt: string; updatedAt: string; map: StrategyMap }`.
  - Functions: `listMaps()`, `getMap(id)`, `saveMap(id, name, map)` (upsert, bumps
    `updatedAt`), `renameMap(id, name)`, `duplicateMap(id, newName)`, `deleteMap(id)`.
  - Handle empty/missing key (first run) by returning an empty envelope; handle JSON parse
    errors defensively (corrupt storage → treat as empty rather than throwing).

## 2. App-level view state

- Introduce a top-level view switch in `App.tsx` (or a small `src/state/ViewContext.tsx` if
  cleaner): `"list" | "builder"`, plus `activeMapId`.
- On initial load, show the My Maps list.
- Opening a map: load its `StrategyMap` via `storage.getMap(id)`, hydrate `MapProvider` with
  it (extend `MapProvider`/`mapReducer` to accept an initial map instead of always the
  Phase 1 default), switch view to `"builder"`.
- "New map" from the list: prompt for a name, create a `SavedMap` from `lib/defaultMap.ts`,
  persist it, open it in the builder.

## 3. My Maps screen

- New component `src/components/MyMapsScreen.tsx`: renders `storage.listMaps()` sorted by
  `updatedAt` desc.
- Each row: map name, last-edited (formatted relative or short date), actions: Open,
  Rename, Duplicate, Delete (with confirm step for Delete).
- Empty state: no saved maps yet, prominent "New map" call to action.
- Style with the existing token set (Manrope, warm white background, navy accents) so it
  reads as part of the same app, not a bolted-on screen.

## 4. Builder header changes

- Extend `src/components/Header.tsx` (or add a small toolbar alongside it):
  - "Save" button — calls `storage.saveMap` with current context state; disabled/no-op if
    no changes since last save (dirty tracking).
  - Map name display, editable inline (consistent with Phase 1's click-to-edit pattern) —
    renaming here updates the same stored record's `name`.
  - "Back to My Maps" control — if dirty, confirm before navigating away.

## 5. Dirty tracking

- Track a simple dirty flag: set on any `mapReducer` action after load/save, cleared on
  successful save. Lives alongside `activeMapId` in whatever holds the view state (App or a
  small context) — not inside `mapReducer`/`StrategyMap` itself, since it's session state,
  not map content.

## 6. Wiring

- `App.tsx` becomes the switch between `MyMapsScreen` and the existing builder tree
  (`SectionsPanel` + `Header` + map canvas), passing `activeMapId` / callbacks down instead
  of always mounting `MapProvider` with the default map.

## 7. Manual validation

- Run through `validation.md` end to end in the browser (dev server) before considering the
  phase done.
