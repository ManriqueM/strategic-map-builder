# Phase 4 — Language Selection: Plan

Aligns with `specs/mission.md` (a self-serve tool meant to eventually be offered to others,
so its own UI shouldn't be English-locked) and `specs/tech-stack.md` (no framework
dependencies beyond React/TS/Vite — this phase follows that lead for i18n too).

## 1. i18n infrastructure

- `src/i18n/types.ts`: `export type Language = "en" | "es";` and
  `LANGUAGES: { code: Language; label: string }[]` (English, Español) for the switcher.
- `src/i18n/translations/en.ts` and `src/i18n/translations/es.ts`: nested dictionaries keyed
  by feature area (`myMaps`, `builder`, `sections`, `canvas`, `interactive`, `status`), one
  key per chrome string enumerated in `requirements.md`. Support `{{var}}` placeholders for
  the handful of dynamic aria-label templates.
- `src/i18n/LanguageContext.tsx`: `LanguageProvider` — holds `language` state (initialized
  from `localStorage` key `strategy-map-builder:language`, default `"en"`; persists on
  change), and a `t(key, vars?)` function that looks up the dotted-path key in the current
  language's dictionary, falls back to the English dictionary if a key is missing (so a
  partial translation never breaks the UI), and substitutes any `vars`.
- `src/i18n/useTranslation.ts`: `useTranslation()` hook reading `{ language, setLanguage, t }`
  from the context (mirrors the existing `useMap()` pattern in `src/state/useMap.ts`).

## 2. Language switcher component

- `src/components/LanguageSwitcher.tsx`: a small native `<select>` bound to
  `useTranslation()`'s `language`/`setLanguage`, options from `LANGUAGES`. Styled minimally to
  sit inline with each header's existing controls (small, borderless-ish, matching the
  `icon-btn`/toolbar aesthetic already in `map.css`).

## 3. Wire the provider and switcher in

- `src/App.tsx`: wrap the existing My-Maps/Builder screen switch in `<LanguageProvider>`.
- `src/components/MyMapsScreen.tsx`: add `<LanguageSwitcher />` to the header row, next to
  "+ New map".
- `src/components/BuilderToolbar.tsx`: add `<LanguageSwitcher />` next to Save.

## 4. Translate My Maps screen

- `src/components/MyMapsScreen.tsx`: kicker, "My Maps" title, "+ New map" (both instances),
  empty-state copy, "Last edited …" row label, Rename/Duplicate/Delete action labels
  (including their aria-label templates), the inline delete-confirmation prompt and its
  Cancel/Delete buttons.

## 5. Translate builder toolbar

- `src/components/BuilderToolbar.tsx`: "← My Maps", Create Strategy Map/Track Performance
  labels, the mode toggle's group aria-label, the Saved/Unsaved-changes text, "Save", and the
  unsaved-changes-leave confirmation banner (message + Keep-editing/Discard-and-leave
  buttons).

## 6. Translate sections panel and map canvas chrome

- `src/components/SectionsPanel.tsx`: "Sections", Mission/Vision/Values toggle labels,
  "Perspectives", "+ Add perspective", and the move-up/move-down/remove-perspective
  aria-label templates.
- `src/components/Header.tsx` and `src/components/TrackPerformanceView.tsx`: the shared
  "Strategy Map" kicker string (one translation key, used in both places).
- `src/components/ValuesRow.tsx`: "+ Add value" (and its aria-label template).
- `src/components/ObjectiveCard.tsx` / `InitiativeRow.tsx`: "+ Add initiative" and the
  remove-objective/remove-initiative aria-label templates.

## 7. Translate interactive view and status legend

- `src/components/PerspectivesSection.tsx` (Create Strategy Map's connect hint) and
  `src/components/TrackPerformanceView.tsx` (the status-cycle hint): the two instructional
  hint paragraphs.
- `src/components/StatusLegend.tsx` / `src/lib/statusPalette.ts`: the "Status" label and the
  three status names — move the display labels into the translation dictionaries (keep
  `statusPalette.ts`'s color/cycle logic as-is; it stops owning label text).

## 8. Manual validation

- Run through `validation.md` end to end in the browser (dev server) before considering the
  phase done.
