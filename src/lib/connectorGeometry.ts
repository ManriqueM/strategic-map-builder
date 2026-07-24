export interface BoxRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

// Recreates the connector routing from the design source (Strategy Map Options.dc.html,
// option 2a): compares |dx| vs |dy| between box centers to pick vertical vs horizontal
// routing, exits/enters at the relevant box edge (not center), and uses a cubic bezier with
// control points offset by half the travel distance along the dominant axis.
export function connectorPath(container: BoxRect, from: BoxRect, to: BoxRect): string {
  const scx = from.left + from.width / 2 - container.left;
  const scy = from.top + from.height / 2 - container.top;
  const tcx = to.left + to.width / 2 - container.left;
  const tcy = to.top + to.height / 2 - container.top;

  const dxAbs = Math.abs(tcx - scx);
  const dyAbs = Math.abs(tcy - scy);

  let sx: number, sy: number, tx: number, ty: number;

  if (dyAbs >= dxAbs) {
    sx = scx;
    tx = tcx;
    if (tcy < scy) {
      sy = from.top - container.top;
      ty = to.bottom - container.top;
    } else {
      sy = from.bottom - container.top;
      ty = to.top - container.top;
    }
  } else {
    sy = scy;
    ty = tcy;
    if (tcx < scx) {
      sx = from.left - container.left;
      tx = to.right - container.left;
    } else {
      sx = from.right - container.left;
      tx = to.left - container.left;
    }
  }

  const dx = tx - sx;
  const dy = ty - sy;

  return dyAbs >= dxAbs
    ? `M ${sx} ${sy} C ${sx} ${sy + dy / 2}, ${tx} ${ty - dy / 2}, ${tx} ${ty}`
    : `M ${sx} ${sy} C ${sx + dx / 2} ${sy}, ${tx - dx / 2} ${ty}, ${tx} ${ty}`;
}
