import type { ConnectorPathData } from "../state/useConnectorPaths";

export function ConnectorsOverlay({
  paths,
  hoveredConnectionId,
  onHover,
  onRemove,
  interactive,
}: {
  paths: ConnectorPathData[];
  hoveredConnectionId: string | null;
  onHover: (id: string | null) => void;
  onRemove: (id: string) => void;
  interactive: boolean;
}) {
  return (
    <svg className="connectors-overlay">
      <defs>
        <marker
          id="cxArrow"
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M 3 2 L 10 6 L 3 10"
            fill="none"
            stroke="var(--color-connector)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
        <marker
          id="cxArrowHot"
          markerWidth="13"
          markerHeight="13"
          refX="10.5"
          refY="6.5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d="M 3 2.5 L 10.5 6.5 L 3 10.5"
            fill="none"
            stroke="var(--color-connector-hot)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      {paths.map((p) => {
        const isHot = p.id === hoveredConnectionId;
        return (
          <g key={p.id}>
            <path
              d={p.d}
              className={`connector-hit${interactive ? "" : " connector-hit-inert"}`}
              onMouseEnter={() => onHover(p.id)}
              onMouseLeave={() => onHover(null)}
              onClick={interactive ? () => onRemove(p.id) : undefined}
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
