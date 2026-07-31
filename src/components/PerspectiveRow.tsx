import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";
import { EditableText } from "./EditableText";
import { ObjectiveCard } from "./ObjectiveCard";
import { perspectiveColor } from "../lib/perspectivePalette";
import type { Perspective } from "../types";
import type { ConnectorPathData } from "../state/useConnectorPaths";

interface PerspectiveRowProps {
  perspective: Perspective;
  number: number;
  pendingId: string | null;
  hoveredConnection: ConnectorPathData | null;
  onSelectForConnect: (objectiveId: string) => void;
  getBoxRef: (id: string) => (el: HTMLElement | null) => void;
}

export function PerspectiveRow({
  perspective,
  number,
  pendingId,
  hoveredConnection,
  onSelectForConnect,
  getBoxRef,
}: PerspectiveRowProps) {
  const { dispatch } = useMap();
  const { t } = useTranslation();
  const label = String(number).padStart(2, "0");

  return (
    <div className="perspective-row">
      <div className="perspective-row-head">
        <div className="perspective-num" style={{ color: perspectiveColor(number - 1) }}>
          {label}
        </div>
        <EditableText
          as="span"
          className="perspective-name"
          value={perspective.name}
          onChange={(name) => dispatch({ type: "RENAME_PERSPECTIVE", id: perspective.id, name })}
          ariaLabel={t("canvas.perspectiveNameAria")}
          placeholder="New Perspective"
        />
      </div>
      <div className="perspective-divider" />
      <div className="objective-grid">
        {perspective.objectives.map((objective) => {
          const isHot =
            !!hoveredConnection &&
            (hoveredConnection.from === objective.id || hoveredConnection.to === objective.id);
          return (
            <ObjectiveCard
              key={objective.id}
              perspectiveId={perspective.id}
              objective={objective}
              boxRef={getBoxRef(objective.id)}
              isPending={pendingId === objective.id}
              isHot={isHot}
              onSelectForConnect={() => onSelectForConnect(objective.id)}
            />
          );
        })}
        <button
          type="button"
          className="add-objective-card"
          onClick={() => dispatch({ type: "ADD_OBJECTIVE", perspectiveId: perspective.id })}
        >
          {t("canvas.addObjective")}
        </button>
      </div>
    </div>
  );
}
