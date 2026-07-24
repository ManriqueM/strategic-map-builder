import { perspectiveColor } from "../lib/perspectivePalette";
import { InteractiveObjectiveCard } from "./InteractiveObjectiveCard";
import type { Perspective } from "../types";
import type { ConnectorPathData } from "../state/useConnectorPaths";

export function InteractivePerspectiveRow({
  perspective,
  number,
  pendingId,
  hoveredConnection,
  onBoxClick,
  getBoxRef,
}: {
  perspective: Perspective;
  number: number;
  pendingId: string | null;
  hoveredConnection: ConnectorPathData | null;
  onBoxClick: (id: string) => void;
  getBoxRef: (id: string) => (el: HTMLElement | null) => void;
}) {
  const label = String(number).padStart(2, "0");

  return (
    <div className="perspective-row">
      <div className="perspective-row-head">
        <div className="perspective-num" style={{ color: perspectiveColor(number - 1) }}>
          {label}
        </div>
        <span className="perspective-name">{perspective.name || "Untitled"}</span>
        <div className="perspective-divider" />
      </div>
      <div className="objective-grid">
        {perspective.objectives.map((objective) => (
          <InteractiveObjectiveCard
            key={objective.id}
            objective={objective}
            boxRef={getBoxRef(objective.id)}
            isPending={pendingId === objective.id}
            hoveredConnection={hoveredConnection}
            onClick={() => onBoxClick(objective.id)}
          />
        ))}
      </div>
    </div>
  );
}
