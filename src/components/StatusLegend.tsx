import { LEGEND_STATUSES, STATUS_META } from "../lib/statusPalette";

export function StatusLegend() {
  return (
    <div className="status-legend">
      <div className="status-legend-label">Status</div>
      {LEGEND_STATUSES.map((status) => {
        const meta = STATUS_META[status];
        return (
          <div key={status} className="status-legend-item">
            <div className="status-legend-swatch" style={{ background: meta.color }} />
            <div className="status-legend-text">{meta.label}</div>
          </div>
        );
      })}
    </div>
  );
}
