import { useMap } from "../state/useMap";
import { EditableText } from "./EditableText";
import type { Initiative } from "../types";

interface InitiativeRowProps {
  perspectiveId: string;
  objectiveId: string;
  initiative: Initiative;
}

export function InitiativeRow({ perspectiveId, objectiveId, initiative }: InitiativeRowProps) {
  const { dispatch } = useMap();

  return (
    <div className="initiative-row">
      <div className="initiative-dot" />
      <EditableText
        as="span"
        className="initiative-text"
        value={initiative.text}
        onChange={(text) =>
          dispatch({
            type: "SET_INITIATIVE_TEXT",
            perspectiveId,
            objectiveId,
            initiativeId: initiative.id,
            text,
          })
        }
        ariaLabel="Initiative"
        placeholder="New initiative"
      />
      <button
        type="button"
        className="icon-btn"
        aria-label={`Remove initiative: ${initiative.text}`}
        onClick={() =>
          dispatch({
            type: "REMOVE_INITIATIVE",
            perspectiveId,
            objectiveId,
            initiativeId: initiative.id,
          })
        }
      >
        ×
      </button>
    </div>
  );
}
