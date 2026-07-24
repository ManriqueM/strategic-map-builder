import type { ConnectorPathData } from "../state/useConnectorPaths";

export function ConnectorsOverlay({
  paths,
  hoveredConnectionId,
  onHover,
  onRemove,
}: {
  paths: ConnectorPathData[];
  hoveredConnectionId: string | null;
  onHover: (id: string | null) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <svg className="connectors-overlay">
      <defs>
        <marker
          id="cxArrow"
          markerWidth="8"
          markerHeight="8"
          refX="8"
          refY="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--color-connector)" />
        </marker>
        <marker
          id="cxArrowHot"
          markerWidth="8"
          markerHeight="8"
          refX="8"
          refY="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--color-connector-hot)" />
        </marker>
      </defs>
      {paths.map((p) => {
        const isHot = p.id === hoveredConnectionId;
        return (
          <g key={p.id}>
            <path
              d={p.d}
              className="connector-hit"
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              onClick={() => onRemove(p.id)}
            />
            <path
              d={p.d}
              className={`connector-line${isHot ? " connector-line-hot" : ""}`}
              markerEnd={isHot ? "url(#cxArrowHot)" : "url(#cxArrow)"}
            />
          </g>
        );
      })}
    </svg>
  );
}
