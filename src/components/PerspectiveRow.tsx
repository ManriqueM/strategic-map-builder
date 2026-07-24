import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";
import { EditableText } from "./EditableText";
import { ObjectiveCard } from "./ObjectiveCard";
import { perspectiveColor } from "../lib/perspectivePalette";
import type { Perspective } from "../types";

interface PerspectiveRowProps {
  perspective: Perspective;
  number: number;
}

export function PerspectiveRow({ perspective, number }: PerspectiveRowProps) {
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
        <div className="perspective-divider" />
      </div>
      <div className="objective-grid">
        {perspective.objectives.map((objective) => (
          <ObjectiveCard
            key={objective.id}
            perspectiveId={perspective.id}
            objective={objective}
          />
        ))}
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
