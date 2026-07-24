import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";
import { EditableText } from "./EditableText";
import type { Initiative } from "../types";

interface InitiativeRowProps {
  perspectiveId: string;
  objectiveId: string;
  initiative: Initiative;
}

export function InitiativeRow({ perspectiveId, objectiveId, initiative }: InitiativeRowProps) {
  const { dispatch } = useMap();
  const { t } = useTranslation();

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
        ariaLabel={t("canvas.initiativeAria")}
        placeholder="New initiative"
      />
      <button
        type="button"
        className="icon-btn"
        aria-label={t("canvas.removeInitiativeAria", { text: initiative.text })}
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
