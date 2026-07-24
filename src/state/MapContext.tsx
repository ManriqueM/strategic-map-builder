import { useReducer, type ReactNode } from "react";
import { createDefaultMap } from "../lib/defaultMap";
import { mapReducer } from "./mapReducer";
import { MapContext } from "./mapContextDef";

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, dispatch] = useReducer(mapReducer, undefined, createDefaultMap);
  return <MapContext.Provider value={{ map, dispatch }}>{children}</MapContext.Provider>;
}
