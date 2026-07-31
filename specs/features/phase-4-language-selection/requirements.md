# Phase 4 — Language Selection: Requirements

## Scope

Translate the app's own interface chrome (not map content) into English and Spanish, with a
language switcher reachable from both top-level screens, and the choice persisted across
sessions.

### In scope

- **i18n infrastructure**: a small, dependency-free `LanguageContext` + `en`/`es` dictionaries
  + a `useTranslation()` hook exposing `t(key, vars?)`, mirroring the project's existing
  "no framework, bespoke" approach (plain CSS tokens, no UI library) rather than pulling in
  react-i18next for a currently small, finite string set.
- **Language switcher**: a small native `<select>` in each screen's existing header —
  next to "+ New map" on the My Maps screen, next to Save in the builder toolbar — rather
  than a new floating/persistent element. Starts with English and Spanish.
- **Persisted preference**: the chosen language is saved to `localStorage` under its own key
  (separate from the maps envelope) and restored on load; defaults to English if unset.
- **Translate all interface chrome**, i.e. every string that is navigation, a button/action
  label, a heading, an instructional hint, a confirmation prompt, an empty state, or the
  status legend. Concretely:
  - My Maps screen: kicker, "My Maps" title, "+ New map", empty state, "Last edited …" row
    label, Rename/Duplicate/Delete actions, the inline delete-confirmation prompt/buttons.
  - Builder toolbar: "← My Maps", the Create Strategy Map/Track Performance mode labels, the
    Saved/Unsaved-changes indicator, "Save", the unsaved-changes-leave confirmation banner.
  - Sections panel: "Sections", Mission/Vision/Values toggle labels, "Perspectives",
    "+ Add perspective", and the move-up/move-down/remove-perspective action labels.
  - Map canvas chrome: the "Strategy Map" kicker (Create Strategy Map and Track Performance
    modes both), "+ Add value", "+ Add initiative".
  - Interactive view: the connect and track-performance instructional hint text.
  - Status legend: "Status" label and the three status names (On Track / Needs Attention /
    Off Track).
- **Dynamic aria-labels get translated templates**: labels that interpolate a user's own text
  (e.g. "Remove objective: {text}", "Rename {mapName}") are translated as templates with the
  interpolated value left as-is (the label wording translates, the user's own text inside it
  does not).

### Out of scope

- **Map content stays exactly as authored, in whatever language the user typed it** — mission,
  vision, values, perspective names, objective/initiative text, map/save names. This is the
  explicit distinction in the roadmap ("the tool itself — not just map content").
- **Default seed content and field placeholders stay English-only.** Text inserted as real
  document content when the user adds a new item (`"New objective"`, `"New Perspective"`,
  `"New value"`, `"New initiative"` from `mapReducer`/`defaultMap.ts`) and the matching
  `EditableText` `placeholder` props that mirror them are content-adjacent, not interface
  chrome — translating them would require per-language default map templates, which conflates
  with the "map content" boundary above and is not what this phase is asking for.
- More languages beyond English/Spanish, browser-locale auto-detection, RTL layout support,
  pluralization rules — not requested; can be added later without restructuring since the
  dictionary/key shape supports more languages trivially.

## Key decisions

- **No i18n library.** A plain `Record<string, string>`-shaped (nested by feature area)
  dictionary per language, a context + hook, and a tiny `{{var}}`-style interpolation
  function cover this app's needs without adding a dependency for ~50 short strings.
- **Two switcher instances, not one persistent overlay.** Each already has its own header row
  (My Maps' top bar, the builder toolbar); adding the switcher into each keeps it visually
  consistent with existing controls in that screen rather than introducing a new floating
  element that has to avoid colliding with per-screen headers.
- **Chrome vs. content boundary is the organizing principle** for exactly which strings move
  into the dictionaries — anything that ends up stored as part of a `StrategyMap` document
  (including its English-language seed/default values) is left alone.
- **`LanguageProvider` wraps the whole app** (above the My-Maps/Builder screen switch in
  `App.tsx`), so the language choice is a single piece of state shared across navigation
  between screens, not re-derived per screen.
