import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";
import { EditableText } from "./EditableText";
import { InitiativeRow } from "./InitiativeRow";
import type { Objective } from "../types";

interface ObjectiveCardProps {
  perspectiveId: string;
  objective: Objective;
  boxRef: (el: HTMLElement | null) => void;
  isPending: boolean;
  isHot: boolean;
  onSelectForConnect: () => void;
}

export function ObjectiveCard({
  perspectiveId,
  objective,
  boxRef,
  isPending,
  isHot,
  onSelectForConnect,
}: ObjectiveCardProps) {
  const { dispatch } = useMap();
  const { t } = useTranslation();

  const stateClass = isPending ? " is-pending" : isHot ? " is-hot" : "";

  return (
    <div
      ref={boxRef}
      className={`objective-card${stateClass}`}
      onClick={onSelectForConnect}
    >
      <button
        type="button"
        className="icon-btn remove-objective-btn"
        aria-label={t("canvas.removeObjectiveAria", { text: objective.text })}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "REMOVE_OBJECTIVE", perspectiveId, objectiveId: objective.id });
        }}
      >
        ×
      </button>
      <EditableText
        className="objective-text"
        value={objective.text}
        onChange={(text) =>
          dispatch({ type: "SET_OBJECTIVE_TEXT", perspectiveId, objectiveId: objective.id, text })
        }
        ariaLabel={t("canvas.objectiveAria")}
        placeholder="New objective"
      />
      <div className="initiatives-list">
        {objective.initiatives.map((initiative) => (
          <InitiativeRow
            key={initiative.id}
            perspectiveId={perspectiveId}
            objectiveId={objective.id}
            initiative={initiative}
          />
        ))}
        <button
          type="button"
          className="add-initiative-btn"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "ADD_INITIATIVE", perspectiveId, objectiveId: objective.id });
          }}
        >
          {t("canvas.addInitiative")}
        </button>
      </div>
    </div>
  );
}
