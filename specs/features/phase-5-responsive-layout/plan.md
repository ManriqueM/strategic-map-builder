# Phase 5 — Responsive Layout: Plan

Additive to every prior phase's markup/CSS — no data model, reducer, or storage changes.
Purely presentation layer plus the minimum interactive state needed for the Sections panel
toggle.

## 1. Sections panel toggle

- `src/components/BuilderScreen.tsx`: new `sectionsOpen` state (default `false`) alongside
  the existing `mode`/`dirty`/`name` state; passed to both `BuilderToolbar` and
  `SectionsPanel`.
- `src/components/SectionsPanel.tsx`: accepts an `isOpen: boolean` prop, appends `" is-open"`
  to its className when true. No other logic changes — the component's content and
  dispatches are unaffected.
- `src/components/BuilderToolbar.tsx`: accepts `sectionsOpen`/`onToggleSections` props;
  renders a toggle button (class `sections-toggle-btn`, reusing `.icon-btn` for base
  styling) only when `mode === "create"` — Track Performance has no Sections panel to toggle.
  Uses a new i18n key (`builder.toggleSections`) for both the label and `aria-label`, plus
  `aria-expanded={sectionsOpen}`.

## 2. CSS: base-rule adjustments (apply at every width)

- `src/styles/map.css`: `.builder-toolbar` gains `flex-wrap: wrap`; `.mode-toggle-btn` gains
  `white-space: nowrap`. See requirements.md's Key decisions for why these aren't gated by
  the media query. `.sections-toggle-btn` gets a base `display: none` (shown only inside the
  media query, so it never appears above the breakpoint even though the button always
  renders in the DOM when `mode === "create"`).

## 3. CSS: the `@media (max-width: 767px)` block

Appended to the end of `map.css`, in this order:

- **Toolbar**: tighter `gap`/`padding`, smaller `.mode-toggle-btn` font-size/padding, and
  `.builder-toolbar-status` forced onto its own line (`flex-basis: 100%; order: 1`) so the
  Saved/Unsaved indicator doesn't compete for space with the actionable controls.
- **Sections panel collapse**: `.sections-toggle-btn { display: inline-flex }` (+ an
  `.is-active` state matching `.mode-toggle-btn.is-active`'s navy fill); `.app-shell {
  flex-direction: column }`; `.sections-panel { display: none; position: static; width:
  100%; height: auto; border-right: none; border-bottom: 1px solid var(--color-border) }`
  overridden to `display: block` by `.sections-panel.is-open`; the existing
  `.builder-shell .sections-panel { height: calc(100vh - 53px); top: 53px }` sticky-sidebar
  rule reset to `height: auto; top: auto`.
- **Canvas spacing**: reduced padding on `.map-canvas`/`.interactive-canvas`, reduced
  `.map-title` font-size, reduced `.vm-banner` `minmax()` floor.
- **Perspective row stacking**: `.perspective-row { flex-direction: column }`;
  `.perspective-row-head { flex: initial; width: 100% }`; `.perspective-divider { width:
  auto; height: 1px }` — `align-self: stretch` (already on the base rule) automatically
  stretches along whichever axis is the cross axis, so flipping the parent to column
  direction is enough to turn the vertical rule into a horizontal one without touching that
  property.
- **Wrapping rows**: `flex-wrap: wrap` on `.status-legend`, `.my-maps-header`,
  `.my-maps-header-actions`.
- **Touch-reachability**: `.remove-objective-btn { opacity: 1 }`; `.value-tile
  .remove-value-btn { display: flex }`; `.interactive-objective-card .initiative-dot`
  (and its `svg`) enlarged; `.icon-btn` padding increased slightly.
- **My Maps screen**: reduced `.my-maps-screen` padding, reduced `.my-maps-title` font-size.

## 4. i18n

- `en.ts`/`es.ts`: one new key, `builder.toggleSections` — `"Sections"` / `"Secciones"`.

## 5. Manual validation

Since there's no real mobile device/emulator in this environment, verification used an
`<iframe>` of fixed pixel width injected via the browser tool (media queries evaluate against
the iframe's own viewport, same as a real narrow window) rather than relying on the browser
window's own resize, which didn't reliably shrink in this sandboxed setup. Run through
`validation.md` at ~375px (phone), ~820px (tablet, still above the breakpoint), and full
desktop width before considering the phase done.
