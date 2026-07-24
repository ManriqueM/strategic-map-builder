import { createContext } from "react";
import type { MapAction } from "./mapReducer";
import type { StrategyMap } from "../types";

export interface MapContextValue {
  map: StrategyMap;
  dispatch: React.Dispatch<MapAction>;
}

export const MapContext = createContext<MapContextValue | null>(null);
