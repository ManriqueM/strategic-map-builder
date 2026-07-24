# Strategy Map Builder

> A visual strategy map builder and viewer for teams using the Balanced Scorecard framework.

## Overview

Strategy Map Builder lets you turn your organization's mission, vision, values, and strategic
perspectives into a visual strategy map — then keep it alive. It's built for individuals or
organizations doing strategic planning who want a lightweight, visual, self-serve way to build
and maintain a strategy map without specialized BI or enterprise strategy software. Instead of
letting a strategy map go stale in a slide deck, you can save it, wire objectives together with
connections, and track status over time, right in the browser.

## Features

- **Builder UI** — A visual editor matching a clean, bespoke design. Comes with sensible
  defaults (Mission, Vision, Values, and the four classic Balanced Scorecard perspectives:
  Financial, Customer, Internal Process, Learning & Growth), but nothing is fixed — rename,
  add, remove, reorder, toggle visibility, and edit any section, perspective, objective, or
  initiative inline.
- **Save/Load** — Save named maps to your browser and manage them from a "My Maps" list:
  open, rename, duplicate, or delete any saved map. No account or backend required.
- **Interactive connections** — Switch a saved map into an interactive view and click one
  objective, then another, to draw a directional connection between them. Hover a connection
  to highlight it, click it to remove it.
- **Status tracking** — Assign each objective an On Track / Needs Attention / Off Track status
  with a click. Status is reflected as a colored border everywhere the objective appears, with
  a legend for reference.
- **Language selection** — Switch the app's own interface between English and Spanish from a
  selector on either screen; your choice is remembered. (Map content always stays exactly as
  you typed it, regardless of the interface language.)

## Tech Stack

- **React + TypeScript + Vite** — component-based single-page app
- **Plain CSS** with design tokens (custom properties) — no CSS framework
- **Browser `localStorage`** — client-side persistence, no backend or server required
- **oxlint** — linting
- TypeScript strict mode

## Installation

```bash
git clone https://github.com/ManriqueM/strategic-map-builder
cd strategic-map-builder
npm install
```

## Usage

Start the local development server:

```bash
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`) in your browser.

Other available commands:

```bash
npm run build    # Type-check and build for production
npm run preview  # Preview the production build locally
npm run lint     # Run oxlint
```

**Getting started in the app:**

1. From the **My Maps** screen, click **+ New map** to create a map from the default template.
2. In **Edit** mode, fill in your mission, vision, values, and perspectives — click any text to
   edit it in place, and use the sections panel to show/hide or reorder perspectives.
3. Click **Save** whenever you want to persist your changes.
4. Switch to **Connect** mode to wire objectives together: click one objective, then another,
   to draw a connection; hover a connection to highlight it, click it to remove it.
5. Switch to **Status** mode to assign each objective's status: click a card to cycle it
   through On Track → Needs Attention → Off Track → no status.
6. Use the language selector in the header to switch the interface between English and
   Spanish at any time.

## Project Structure

```
strategy-map-builder/
├── src/
│   ├── components/       # UI components (builder canvas, toolbar, interactive views, etc.)
│   ├── state/            # Map state (reducer, context) and connector-geometry hooks
│   ├── lib/               # Storage layer, default map template, status/perspective palettes
│   ├── i18n/              # Language context, translation dictionaries (en/es)
│   ├── styles/            # Design tokens and component styles
│   ├── types.ts           # Core data model (StrategyMap, Perspective, Objective, etc.)
│   └── App.tsx            # Top-level app shell (My Maps ↔ Builder)
├── specs/
│   ├── mission.md          # Why this project exists
│   ├── tech-stack.md       # Technical decisions and design source
│   ├── roadmap.md          # Phased build plan
│   └── features/           # Per-phase requirements/plan/validation specs
└── package.json
```

## Roadmap

- [x] **Phase 1 — Builder UI**: Static strategy map builder with customizable sections and
      perspectives.
- [x] **Phase 2 — Save/Load**: Persist maps to `localStorage`, with a My Maps list.
- [x] **Phase 3 — Interactive view: connections**: Click-to-connect objectives with bezier
      connectors.
- [x] **Phase 4 — Interactive view: status**: On-track / needs-attention / off-track status
      with color coding and a legend.
- [x] **Phase 5 — Language selection**: English/Spanish interface with a persisted language
      switcher.

## License

MIT
