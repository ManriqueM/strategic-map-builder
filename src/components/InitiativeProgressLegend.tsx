import {
  LEGEND_INITIATIVE_PROGRESS,
  INITIATIVE_PROGRESS_LABEL_KEYS,
  INITIATIVE_PROGRESS_META,
} from "../lib/initiativeProgressPalette";
import { InitiativeProgressIcon } from "./InitiativeProgressIcon";
import { useTranslation } from "../i18n/useTranslation";

export function InitiativeProgressLegend() {
  const { t } = useTranslation();

  return (
    <div className="status-legend initiative-progress-legend">
      <div className="status-legend-label">{t("initiativeProgress.label")}</div>
      {LEGEND_INITIATIVE_PROGRESS.map((progress) => {
        const meta = INITIATIVE_PROGRESS_META[progress];
        return (
          <div key={progress} className="status-legend-item">
            <div
              className="status-legend-swatch initiative-progress-legend-swatch"
              style={{ color: meta.color }}
            >
              <InitiativeProgressIcon progress={progress} />
            </div>
            <div className="status-legend-text">{t(INITIATIVE_PROGRESS_LABEL_KEYS[progress])}</div>
          </div>
        );
      })}
    </div>
  );
}
