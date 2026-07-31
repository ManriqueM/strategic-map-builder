import { useRef, useState } from "react";
import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";
import { useConnectorPaths } from "../state/useConnectorPaths";
import { useObjectiveBoxRefs } from "../state/useObjectiveBoxRefs";
import { nextStatus } from "../lib/statusPalette";
import { VisionMissionBanner } from "./VisionMissionBanner";
import { ValuesRow } from "./ValuesRow";
import { ConnectorsOverlay } from "./ConnectorsOverlay";
import { InteractivePerspectiveRow } from "./InteractivePerspectiveRow";
import { StatusLegend } from "./StatusLegend";

export function TrackPerformanceView() {
  const { map, dispatch } = useMap();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { boxEls, getBoxRef } = useObjectiveBoxRefs();
  const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(null);

  const paths = useConnectorPaths(containerRef, boxEls, map.connections);
  const hoveredConnection = paths.find((p) => p.id === hoveredConnectionId) ?? null;
  const visiblePerspectives = map.perspectives.filter((p) => p.visible);

  const handleBoxClick = (perspectiveId: string, objectiveId: string) => {
    const perspective = map.perspectives.find((p) => p.id === perspectiveId);
    const objective = perspective?.objectives.find((o) => o.id === objectiveId);
    if (!objective) return;
    dispatch({
      type: "SET_OBJECTIVE_STATUS",
      perspectiveId,
      objectiveId,
      status: nextStatus(objective.status),
    });
  };

  return (
    <div className="interactive-canvas">
      <div className="map-kicker">{t("canvas.kicker")}</div>
      <h1 className="map-title">{map.title || "Untitled Strategy Map"}</h1>
      {map.subtitle && <p className="map-subtitle">{map.subtitle}</p>}
      <VisionMissionBanner readOnly />
      <ValuesRow readOnly />
      <p className="interactive-hint">{t("interactive.statusHint")}</p>
      <div ref={containerRef} className="interactive-rows">
        <ConnectorsOverlay
          paths={paths}
          hoveredConnectionId={hoveredConnectionId}
          onHover={setHoveredConnectionId}
          onRemove={(id) => dispatch({ type: "REMOVE_CONNECTION", id })}
          interactive={false}
        />
        {visiblePerspectives.map((perspective, index) => (
          <InteractivePerspectiveRow
            key={perspective.id}
            perspective={perspective}
            number={index + 1}
            hoveredConnection={hoveredConnection}
            onBoxClick={handleBoxClick}
            getBoxRef={getBoxRef}
          />
        ))}
      </div>
      <StatusLegend />
    </div>
  );
}
