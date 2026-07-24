// Rotating tint for the perspective number (echoes option 2a's per-row "deep" tint),
// generic enough to apply to any number of user-defined perspectives.
const PALETTE = ["#2f4f6b", "#2f6b53", "#7a5e28", "#6b3f66", "#7a3f3f", "#3f6b7a"];

export function perspectiveColor(index: number): string {
  return PALETTE[index % PALETTE.length];
}
