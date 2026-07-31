import { useRef, useState } from "react";
import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";
import { useConnectorPaths } from "../state/useConnectorPaths";
import { useObjectiveBoxRefs } from "../state/useObjectiveBoxRefs";
import { PerspectiveRow } from "./PerspectiveRow";
import { ConnectorsOverlay } from "./ConnectorsOverlay";

export function PerspectivesSection() {
  const { map, dispatch } = useMap();
  const { t } = useTranslation();
  const visible = map.perspectives.filter((p) => p.visible);
  const containerRef = useRef<HTMLDivElement>(null);
  const { boxEls, getBoxRef } = useObjectiveBoxRefs();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(null);

  const paths = useConnectorPaths(containerRef, boxEls, map.connections);
  const hoveredConnection = paths.find((p) => p.id === hoveredConnectionId) ?? null;

  const handleSelectForConnect = (objectiveId: string) => {
    setPendingId((prev) => {
      if (!prev) return objectiveId;
      if (prev === objectiveId) return null;
      dispatch({ type: "ADD_CONNECTION", from: prev, to: objectiveId });
      return null;
    });
  };

  return (
    <div>
      <p className="interactive-hint">{t("interactive.connectHint")}</p>
      <div ref={containerRef} className="interactive-rows">
        <ConnectorsOverlay
          paths={paths}
          hoveredConnectionId={hoveredConnectionId}
          onHover={setHoveredConnectionId}
          onRemove={(id) => dispatch({ type: "REMOVE_CONNECTION", id })}
          interactive
        />
        {visible.map((perspective, index) => (
          <PerspectiveRow
            key={perspective.id}
            perspective={perspective}
            number={index + 1}
            pendingId={pendingId}
            hoveredConnection={hoveredConnection}
            onSelectForConnect={handleSelectForConnect}
            getBoxRef={getBoxRef}
          />
        ))}
      </div>
    </div>
  );
}
