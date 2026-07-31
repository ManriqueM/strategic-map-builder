# Phase 5 — Responsive Layout: Validation

## Automated

- `npm run build` (`tsc -b && vite build`) passes with no type errors.
- `npm run lint` (oxlint) passes.

## Manual — run in the dev server (`npm run dev`), tested at ~375px, ~820px, and desktop width

1. **Desktop (≳1024px) is pixel-identical to before this phase**: My Maps, the builder
   toolbar, the Sections panel sidebar, and side-by-side perspective rows all look and behave
   exactly as they did prior to Phase 5 — no visual regression at the design's target width.
2. **Tablet width (~768–1000px) toolbar no longer squeezes button text**: open a map at
   ~820px — "Create Strategy Map" and "Track Performance" render on a single line each inside
   their buttons (not wrapped mid-word across two or three lines); the Sections panel is
   still a permanent sidebar and the "Sections" toggle button is absent (only shown below
   767px).
3. **Phone width (≤767px) toolbar wraps cleanly**: back button + map name on one line (or
   wrapping gracefully), "Sections" toggle + mode toggle fitting without horizontal overflow,
   language switcher + Save on their own line if needed, and the Saved/Unsaved status text
   always on its own line below everything else. No horizontal scrollbar appears anywhere on
   the page at 375px.
4. **Sections panel collapses and expands in place**: below 767px, in Create Strategy Map
   mode, the "Sections" toggle button appears in the toolbar; clicking it expands the
   Sections panel as a full-width block in normal flow (pushing the canvas down, not
   overlaying it), with the toggle button showing an active/pressed state; clicking again
   collapses it. Switching to Track Performance mode hides the toggle button entirely (no
   Sections panel there to toggle).
5. **Perspective rows stack below 767px**: each perspective's number + name renders as a
   full-width block above its objective grid (not beside it), with a horizontal divider line
   between them; objective cards render one per row, full width. Above 767px, the header
   reverts to the fixed-width left column beside the grid with a vertical divider.
6. **Connectors stay correctly anchored through the reflow**: with an existing connection
   between two objectives, resize across the breakpoint (or reload at each width) — the
   connector curve/arrowhead still points at the correct top/bottom edges of both boxes at
   every width tested, with no stale or detached-looking lines.
7. **Remove buttons are reachable without hovering below 767px**: every objective card's "×"
   button and every value tile's remove button are visible without a hover state; above
   767px they remain hover-to-reveal as before.
8. **Initiative progress marker is easier to tap below 767px**: in Track Performance mode,
   the initiative progress icon/button is visibly larger (~20px) than its desktop size
   (~13px), and still cycles correctly through all four states on tap.
9. **Legends and My Maps header wrap instead of overflowing below 767px**: the status legend
   and initiative-progress legend each wrap their swatch/label pairs onto additional lines
   rather than being clipped or forcing horizontal scroll; the My Maps header (title +
   language switcher + New map button) and each map row wrap sensibly at 375px.
10. **No regressions**: all Phase 1–4 functionality (editing, connecting, save/load, status/
    progress cycling, language switching) still works identically at every width tested.
