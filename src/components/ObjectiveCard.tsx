import { useMap } from "../state/useMap";
import { EditableText } from "./EditableText";
import { InitiativeRow } from "./InitiativeRow";
import type { Objective } from "../types";

interface ObjectiveCardProps {
  perspectiveId: string;
  objective: Objective;
}

export function ObjectiveCard({ perspectiveId, objective }: ObjectiveCardProps) {
  const { dispatch } = useMap();

  return (
    <div className="objective-card">
      <button
        type="button"
        className="icon-btn remove-objective-btn"
        aria-label={`Remove objective: ${objective.text}`}
        onClick={() =>
          dispatch({ type: "REMOVE_OBJECTIVE", perspectiveId, objectiveId: objective.id })
        }
      >
        ×
      </button>
      <EditableText
        className="objective-text"
        value={objective.text}
        onChange={(text) =>
          dispatch({ type: "SET_OBJECTIVE_TEXT", perspectiveId, objectiveId: objective.id, text })
        }
        ariaLabel="Objective"
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
          onClick={() =>
            dispatch({ type: "ADD_INITIATIVE", perspectiveId, objectiveId: objective.id })
          }
        >
          + Add initiative
        </button>
      </div>
    </div>
  );
}
