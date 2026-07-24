import { LEGEND_STATUSES, STATUS_LABEL_KEYS, STATUS_META } from "../lib/statusPalette";
import { useTranslation } from "../i18n/useTranslation";

export function StatusLegend() {
  const { t } = useTranslation();

  return (
    <div className="status-legend">
      <div className="status-legend-label">{t("status.label")}</div>
      {LEGEND_STATUSES.map((status) => {
        const meta = STATUS_META[status];
        return (
          <div key={status} className="status-legend-item">
            <div className="status-legend-swatch" style={{ background: meta.color }} />
            <div className="status-legend-text">{t(STATUS_LABEL_KEYS[status])}</div>
          </div>
        );
      })}
    </div>
  );
}
