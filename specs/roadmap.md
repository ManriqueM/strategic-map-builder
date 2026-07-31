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
      on-track / needs-attention / off-track status (colored top border + a status legend)
      and per-initiative progress — a blank/unset default plus Not on Track / On Track /
      Complete, each with its own icon (✕ / 💡 / ✓) and color, click-to-cycle, with its own
      legend (ordered to match the status legend's green → amber → red sequence) — both only
      shown in this view, not while authoring.
- [x] **Phase 4 — Language Selection**: Add i18n support and a language switcher for the app
      UI (e.g. English/Spanish to start), so the tool itself — not just map content — can be
      used in the user's preferred language.
- [x] **Phase 5 — Responsive Layout**: Real CSS reflow at a phone-width breakpoint across My
      Maps, the toolbar, and both Create Strategy Map / Track Performance views — a
      collapsible Sections panel, stacked perspective rows, a wrapping toolbar, and
      touch-reachable controls — replacing the earlier horizontal-scroll-at-narrow-widths
      fallback with genuine mobile support.
