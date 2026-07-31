# Roadmap

Design-first, incremental: build the visual builder against the chosen design first, then
layer in persistence, then the interactive/populate behaviors.

- [x] **Phase 1 — Create Strategy Map**: A single authoring mode combining the static
      strategy-map builder (default sections, customizable perspectives, inline editing,
      add/remove/reorder) with click-to-connect objective wiring (click node A, click node
      B, rendered as SVG bezier connectors with hover-highlight and click-to-remove).
- [x] **Phase 2 — Save/Load**: Persist a built map to `localStorage` and load it back;
      basic list of saved maps.
- [x] **Phase 3 — Track Performance**: A read-only view for assigning per-objective
      on-track / needs-attention / off-track status and per-initiative on-track / in-progress
      / not-on-track progress, seeing both reflected as color coding (colored top border on
      objective cards, a clickable colored dot on each initiative, and a status legend) —
      these colors only appear in this view, not while authoring.
- [x] **Phase 4 — Language Selection**: Add i18n support and a language switcher for the app
      UI (e.g. English/Spanish to start), so the tool itself — not just map content — can be
      used in the user's preferred language.
