# Phase 5 — Responsive Layout: Requirements

## Scope

Replace the "let it horizontally scroll" fallback (Phase 1) with real CSS reflow so the app
is genuinely usable on a phone, not just a desktop viewport shrunk to fit. This is
cross-cutting — My Maps, the builder toolbar, and both Create Strategy Map and Track
Performance views all need adjustment — the same reason Phase 4 (Language Selection) got its
own phase rather than being folded into Phase 1.

### In scope

- **One breakpoint** (`max-width: 767px`, plain CSS media queries in `map.css` — no new
  stylesheet, no CSS-in-JS, no container queries). Above 767px, the app looks and behaves
  exactly as it did before this phase.
- **Sections panel becomes collapsible on phone widths**: hidden by default, toggled open via
  a new "Sections" button in the toolbar (visible only in Create Strategy Map mode, and only
  below the breakpoint). When open, it renders as a full-width block in normal document flow
  above the canvas — not an overlay/drawer, no backdrop or click-outside handling.
- **Perspective rows stack on phone widths**: the header (number + name) — a fixed-width left
  column beside its objective grid above the breakpoint — moves back above the grid,
  full-width, below it. The vertical divider becomes horizontal.
- **Toolbar wraps instead of overflowing or squeezing button text.** This applies at *every*
  width, not just below the breakpoint (see Key decisions) — the toolbar's item count doesn't
  comfortably fit in one row below roughly 1000px even though nothing is phone-sized yet.
- **Reduced padding and font sizes** on `.map-canvas`/`.interactive-canvas`, `.map-title`,
  `.my-maps-screen`/`.my-maps-title` for phone widths, and a slightly lower `minmax()` floor
  on the vision/mission banner grid for extra safety margin at 320–375px.
- **Legend rows and the My Maps header wrap** (`flex-wrap`) instead of overflowing.
- **Touch-reachability fixes**: `.remove-objective-btn` (on every objective card) and
  `.value-tile .remove-value-btn` were hover-only — invisible and unreachable with no mouse.
  Both are forced visible below the breakpoint. The Track Performance initiative-progress
  marker also grows from 13px to 20px for easier tapping.

### Out of scope

- Touch gestures beyond plain tap (no swipe-to-delete, no drag-to-reorder).
- A true overlay/drawer for the Sections panel (in-flow collapse was chosen instead — see
  Key decisions).
- Any change to connector geometry/measurement logic — connectors already re-measure via the
  existing `ResizeObserver` + resize listener (`useConnectorPaths.ts`), so a perspective row
  switching from side-by-side to stacked is a pure CSS reflow from their point of view; no
  code there needed to change for this phase.
- Multiple breakpoints / tablet-specific tuning beyond what one breakpoint plus the
  always-on toolbar wrap already covers.

## Key decisions

- **In-flow collapse, not an overlay drawer, for the Sections panel.** A slide-out drawer
  needs a backdrop, z-index management, and click-outside-to-close handling; an in-flow
  expand/collapse (like an accordion) needs none of that and is simpler to reason about and
  implement, at the cost of pushing the canvas down while open. Given Sections is a
  secondary, occasional-use panel (not something used while actively editing objectives),
  this trade-off favors simplicity.
- **The toolbar's `flex-wrap: wrap` and `.mode-toggle-btn`'s `white-space: nowrap` are base
  rules, not gated by the media query.** Testing at ~820px (tablet landscape, still above the
  767px breakpoint) showed the un-wrapped toolbar squeezing "Create Strategy Map" onto three
  lines *inside* the button — an ugly failure mode distinct from the phone-width case, since
  767–1000px still has the sections panel and side-by-side perspective rows, just not quite
  enough width for every toolbar control on one line. Making the wrap unconditional fixes
  this and is a no-op at the ~1440–1600px design target where everything already fits.
- **Single breakpoint, chosen at 767px** (common phone/tablet portrait boundary) rather than
  multiple tiers — the existing `auto-fill`/`auto-fit` grids (objective grid, values grid,
  vision/mission banner) already reflow column counts on their own at any width in between;
  they don't need their own breakpoint-specific rules, only a lower `minmax()` floor on the
  vision/mission banner for the narrowest phones.
- **Hover-only affordances are real touch bugs, not cosmetic gaps.** `.remove-objective-btn`
  and `.value-tile .remove-value-btn` relied on `:hover` to appear — before this phase there
  was no way to reach them at all on a touch device. Forcing them visible below the
  breakpoint (rather than, say, adding a long-press gesture) was chosen as the simplest fix
  that doesn't change the interaction model.
