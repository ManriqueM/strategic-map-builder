import { useReducer, type ReactNode } from "react";
import { createDefaultMap } from "../lib/defaultMap";
import { mapReducer } from "./mapReducer";
import { MapContext } from "./mapContextDef";
import type { StrategyMap } from "../types";

export function MapProvider({
  children,
  initialMap,
}: {
  children: ReactNode;
  initialMap?: StrategyMap;
}) {
  const [map, dispatch] = useReducer(mapReducer, undefined, () => initialMap ?? createDefaultMap());
  return <MapContext.Provider value={{ map, dispatch }}>{children}</MapContext.Provider>;
}
