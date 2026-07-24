# Roadmap

Design-first, incremental: build the visual builder against the chosen design first, then
layer in persistence, then the interactive/populate behaviors.

- [ ] **Phase 1 — Builder UI**: Static strategy map builder matching the 2a design. Default
      sections (Mission, Vision, Values, and the 4 perspectives: Financial, Customer,
      Internal Process, Learning & Growth) shown by default; user can toggle which sections
      are visible and edit their content (objectives, initiatives). Perspectives are not
      fixed to the 4 defaults — user can rename, add, remove, and reorder them.
- [ ] **Phase 2 — Save/Load**: Persist a built map to `localStorage` and load it back;
      basic list of saved maps.
- [ ] **Phase 3 — Interactive view: connections**: Switch a saved map into an interactive
      view where objective boxes can be connected to each other (click node A, click node B),
      rendered as SVG bezier curves with hover-highlight and click-to-remove, matching the
      design's connector behavior.
- [ ] **Phase 4 — Interactive view: status**: Assign on-track / needs-attention / off-track
      status and see it reflected as color coding on the map (colored top border on objective
      cards, status legend), matching the design's status palette.
- [ ] **Phase 5 — Language selection**: Add i18n support and a language switcher for the app
      UI (e.g. English/Spanish to start), so the tool itself — not just map content — can be
      used in the user's preferred language.
