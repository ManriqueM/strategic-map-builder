import { useRef, useState } from "react";
import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";
import { useConnectorPaths } from "../state/useConnectorPaths";
import { nextStatus } from "../lib/statusPalette";
import { VisionMissionBanner } from "./VisionMissionBanner";
import { ValuesRow } from "./ValuesRow";
import { ConnectorsOverlay } from "./ConnectorsOverlay";
import { InteractivePerspectiveRow } from "./InteractivePerspectiveRow";
import { StatusLegend } from "./StatusLegend";

export function InteractiveMap({ mode }: { mode: "connect" | "status" }) {
  const { map, dispatch } = useMap();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const boxEls = useRef<Map<string, HTMLElement>>(new Map());
  const boxRefCallbacks = useRef<Map<string, (el: HTMLElement | null) => void>>(new Map());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(null);

  const getBoxRef = (id: string) => {
    let cb = boxRefCallbacks.current.get(id);
    if (!cb) {
      cb = (el: HTMLElement | null) => {
        if (el) boxEls.current.set(id, el);
        else boxEls.current.delete(id);
      };
      boxRefCallbacks.current.set(id, cb);
    }
    return cb;
  };

  const paths = useConnectorPaths(containerRef, boxEls, map.connections);
  const hoveredConnection = paths.find((p) => p.id === hoveredConnectionId) ?? null;
  const visiblePerspectives = map.perspectives.filter((p) => p.visible);

  const handleBoxClick = (perspectiveId: string, objectiveId: string) => {
    if (mode === "status") {
      const perspective = map.perspectives.find((p) => p.id === perspectiveId);
      const objective = perspective?.objectives.find((o) => o.id === objectiveId);
      if (!objective) return;
      dispatch({
        type: "SET_OBJECTIVE_STATUS",
        perspectiveId,
        objectiveId,
        status: nextStatus(objective.status),
      });
      return;
    }
    setPendingId((prev) => {
      if (!prev) return objectiveId;
      if (prev === objectiveId) return null;
      dispatch({ type: "ADD_CONNECTION", from: prev, to: objectiveId });
      return null;
    });
  };

  return (
    <div className="interactive-canvas">
      <div className="map-kicker">{t("canvas.kicker")}</div>
      <h1 className="map-title">{map.title || "Untitled Strategy Map"}</h1>
      {map.subtitle && <p className="map-subtitle">{map.subtitle}</p>}
      <VisionMissionBanner readOnly />
      <ValuesRow readOnly />
      <p className="interactive-hint">
        {mode === "status" ? t("interactive.statusHint") : t("interactive.connectHint")}
      </p>
      <div ref={containerRef} className="interactive-rows">
        <ConnectorsOverlay
          paths={paths}
          hoveredConnectionId={hoveredConnectionId}
          onHover={setHoveredConnectionId}
          onRemove={(id) => dispatch({ type: "REMOVE_CONNECTION", id })}
          interactive={mode === "connect"}
        />
        {visiblePerspectives.map((perspective, index) => (
          <InteractivePerspectiveRow
            key={perspective.id}
            perspective={perspective}
            number={index + 1}
            mode={mode}
            pendingId={pendingId}
            hoveredConnection={hoveredConnection}
            onBoxClick={handleBoxClick}
            getBoxRef={getBoxRef}
          />
        ))}
      </div>
      {mode === "status" && <StatusLegend />}
    </div>
  );
}
