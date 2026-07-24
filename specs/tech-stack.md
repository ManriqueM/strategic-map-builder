# Tech Stack

## Frontend

- **React + TypeScript + Vite** — component-based SPA. Fits the two app modes (builder,
  interactive viewer) and the interactive connector/status logic well.
- Plain CSS with design tokens (custom properties), not a CSS framework — the visual design
  is a specific, bespoke look (see Design source below), not a generic component library
  aesthetic.

## Persistence

- **Browser `localStorage`** for v1. No backend. Strategy maps are saved client-side, scoped
  to the browser/device used to create them. A saved map is a JSON document (sections,
  content, connections, statuses).
- Design the storage layer (`src/lib/storage.ts` or similar) behind a small interface so a
  backend-backed implementation could be swapped in later without reshaping the app.

## Design source

The visual design comes from a Claude Design handoff bundle (`Strategy map with four
perspectives-handoff.zip`, committed to this repo). The chosen direction is option **2a**
("Clean corporate + editorial") from `Strategy Map Options.dc.html`, confirmed by the
bundle's thumbnail:

- Fonts: **Manrope** (UI text), **Source Serif 4** (perspective section titles),
  **IBM Plex Mono** (perspective numbers, e.g. `01`).
- Warm white background `#fbfaf8`, ink text `#22262b`.
- Navy vision/mission banner (`#22303f` / `#2b3c4d`), core-values row as navy tiles.
- Four perspective rows (Financial, Customer, Internal Process, Learning & Growth), each a
  serif section title + 4 objective cards in a grid.
- Objective cards: white, `1px solid #e6e2db` border, rounded, with a colored top border
  indicating status, and a nested list of initiatives (colored dot + text).
- Status palette: On Track `#3a6f4f` (tint `#eaf3ee`), Needs Attention `#c9973d`
  (tint `#faf1de`), Off Track `#b3503f` (tint `#f7e9e6`).
- Connections between objective boxes are drawn as SVG cubic-bezier curves with arrowheads,
  routed edge-to-edge between box midpoints; hover highlights a connection, click removes it.

Recreate this pixel-perfectly in real component code — don't copy the prototype's internal
HTML/JS structure (`sc-for`, `DCLogic`, etc. are prototype-only constructs), just its visual
output and interaction behavior. Full source is under
`Strategy map with four perspectives-handoff.zip` →
`strategy-map-with-four-perspectives/project/`.

## Tooling

- Vite dev server + build.
- TypeScript strict mode.
- (Testing/linting choices to be finalized when the first feature spec is written.)
