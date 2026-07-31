import { useEffect, useState, type RefObject } from "react";
import { connectorPath } from "../lib/connectorGeometry";
import type { Connection } from "../types";

export interface ConnectorPathData {
  id: string;
  from: string;
  to: string;
  d: string;
}

export function useConnectorPaths(
  containerRef: RefObject<HTMLElement | null>,
  boxEls: RefObject<Map<string, HTMLElement>>,
  connections: Connection[],
): ConnectorPathData[] {
  const [paths, setPaths] = useState<ConnectorPathData[]>([]);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const next: ConnectorPathData[] = [];
      for (const connection of connections) {
        const fromEl = boxEls.current.get(connection.from);
        const toEl = boxEls.current.get(connection.to);
        if (!fromEl || !toEl) continue;
        const d = connectorPath(
          containerRect,
          fromEl.getBoundingClientRect(),
          toEl.getBoundingClientRect(),
        );
        next.push({ id: connection.id, from: connection.from, to: connection.to, d });
      }
      setPaths((prev) => {
        const same =
          prev.length === next.length &&
          prev.every((p, i) => p.id === next[i].id && p.d === next[i].d);
        return same ? prev : next;
      });
    };

    measure();
    const t1 = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 800);
    window.addEventListener("resize", measure);

    const resizeObserver = new ResizeObserver(measure);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    for (const el of boxEls.current.values()) resizeObserver.observe(el);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
      resizeObserver.disconnect();
    };
  }, [containerRef, boxEls, connections]);

  return paths;
}
