import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";
import { STATUS_META } from "../lib/statusPalette";
import {
  INITIATIVE_PROGRESS_LABEL_KEYS,
  INITIATIVE_PROGRESS_META,
  nextInitiativeProgress,
} from "../lib/initiativeProgressPalette";
import type { Objective } from "../types";
import type { ConnectorPathData } from "../state/useConnectorPaths";

export function InteractiveObjectiveCard({
  perspectiveId,
  objective,
  boxRef,
  hoveredConnection,
  onClick,
}: {
  perspectiveId: string;
  objective: Objective;
  boxRef: (el: HTMLElement | null) => void;
  hoveredConnection: ConnectorPathData | null;
  onClick: () => void;
}) {
  const { dispatch } = useMap();
  const { t } = useTranslation();

  const isHotEndpoint =
    !!hoveredConnection &&
    (hoveredConnection.from === objective.id || hoveredConnection.to === objective.id);

  const stateClass = isHotEndpoint ? " is-hot status-mode-card" : " status-mode-card";

  return (
    <div
      ref={boxRef}
      className={`objective-card interactive-objective-card${stateClass}`}
      style={{ borderTopColor: STATUS_META[objective.status].color }}
      onClick={onClick}
    >
      <div className="objective-text">{objective.text || "New objective"}</div>
      <div className="initiatives-list">
        {objective.initiatives.map((initiative) => (
          <div key={initiative.id} className="initiative-row">
            <button
              type="button"
              className="initiative-dot"
              style={{ background: INITIATIVE_PROGRESS_META[initiative.progress].color }}
              title={t(INITIATIVE_PROGRESS_LABEL_KEYS[initiative.progress])}
              aria-label={t("interactive.initiativeProgressAria", {
                text: initiative.text,
                progress: t(INITIATIVE_PROGRESS_LABEL_KEYS[initiative.progress]),
              })}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({
                  type: "SET_INITIATIVE_PROGRESS",
                  perspectiveId,
                  objectiveId: objective.id,
                  initiativeId: initiative.id,
                  progress: nextInitiativeProgress(initiative.progress),
                });
              }}
            />
            <span className="initiative-text">{initiative.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
