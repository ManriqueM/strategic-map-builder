export interface BoxRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

// Connector always exits from the top-center of the sending ("from") box and enters at the
// bottom-center of the receiving ("to") box — matching the Balanced Scorecard convention
// where a lower-perspective objective supports (and connects upward into) the objective it
// points to, regardless of the two boxes' relative position.
export function connectorPath(container: BoxRect, from: BoxRect, to: BoxRect): string {
  const sx = from.left + from.width / 2 - container.left;
  const sy = from.top - container.top;
  const tx = to.left + to.width / 2 - container.left;
  const ty = to.bottom - container.top;

  const dy = ty - sy;

  return `M ${sx} ${sy} C ${sx} ${sy + dy / 2}, ${tx} ${ty - dy / 2}, ${tx} ${ty}`;
}
