import type { Objective } from "../types";
import type { ConnectorPathData } from "../state/useConnectorPaths";

export function InteractiveObjectiveCard({
  objective,
  boxRef,
  isPending,
  hoveredConnection,
  onClick,
}: {
  objective: Objective;
  boxRef: (el: HTMLElement | null) => void;
  isPending: boolean;
  hoveredConnection: ConnectorPathData | null;
  onClick: () => void;
}) {
  const isHotEndpoint =
    !!hoveredConnection &&
    (hoveredConnection.from === objective.id || hoveredConnection.to === objective.id);

  const stateClass = isPending ? " is-pending" : isHotEndpoint ? " is-hot" : "";

  return (
    <div
      ref={boxRef}
      className={`objective-card interactive-objective-card${stateClass}`}
      onClick={onClick}
    >
      <div className="objective-text">{objective.text || "New objective"}</div>
      <div className="initiatives-list">
        {objective.initiatives.map((initiative) => (
          <div key={initiative.id} className="initiative-row">
            <div className="initiative-dot" />
            <span className="initiative-text">{initiative.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
