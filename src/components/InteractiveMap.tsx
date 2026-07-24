import { useRef, useState } from "react";
import { useMap } from "../state/useMap";
import { useConnectorPaths } from "../state/useConnectorPaths";
import { VisionMissionBanner } from "./VisionMissionBanner";
import { ValuesRow } from "./ValuesRow";
import { ConnectorsOverlay } from "./ConnectorsOverlay";
import { InteractivePerspectiveRow } from "./InteractivePerspectiveRow";

export function InteractiveMap() {
  const { map, dispatch } = useMap();
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

  const handleBoxClick = (id: string) => {
    setPendingId((prev) => {
      if (!prev) return id;
      if (prev === id) return null;
      dispatch({ type: "ADD_CONNECTION", from: prev, to: id });
      return null;
    });
  };

  return (
    <div className="interactive-canvas">
      <div className="map-kicker">Strategy Map</div>
      <h1 className="map-title">{map.title || "Untitled Strategy Map"}</h1>
      {map.subtitle && <p className="map-subtitle">{map.subtitle}</p>}
      <VisionMissionBanner readOnly />
      <ValuesRow readOnly />
      <p className="interactive-hint">
        Click an objective, then click another to connect them. Click a connection to remove it.
      </p>
      <div ref={containerRef} className="interactive-rows">
        <ConnectorsOverlay
          paths={paths}
          hoveredConnectionId={hoveredConnectionId}
          onHover={setHoveredConnectionId}
          onRemove={(id) => dispatch({ type: "REMOVE_CONNECTION", id })}
        />
        {visiblePerspectives.map((perspective, index) => (
          <InteractivePerspectiveRow
            key={perspective.id}
            perspective={perspective}
            number={index + 1}
            pendingId={pendingId}
            hoveredConnection={hoveredConnection}
            onBoxClick={handleBoxClick}
            getBoxRef={getBoxRef}
          />
        ))}
      </div>
    </div>
  );
}
