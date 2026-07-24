import { useEffect, useRef, useState } from "react";
import { MapProvider } from "../state/MapContext";
import { useMap } from "../state/useMap";
import { saveMap, type SavedMap } from "../lib/storage";
import { SectionsPanel } from "./SectionsPanel";
import { Header } from "./Header";
import { VisionMissionBanner } from "./VisionMissionBanner";
import { ValuesRow } from "./ValuesRow";
import { PerspectivesSection } from "./PerspectivesSection";
import { BuilderToolbar, type BuilderMode } from "./BuilderToolbar";
import { InteractiveMap } from "./InteractiveMap";

function BuilderInner({
  savedMap,
  onBack,
  onSaved,
}: {
  savedMap: SavedMap;
  onBack: () => void;
  onSaved: (updated: SavedMap) => void;
}) {
  const { map } = useMap();
  const [name, setName] = useState(savedMap.name);
  const [dirty, setDirty] = useState(false);
  const [mode, setMode] = useState<BuilderMode>("edit");
  const lastSavedMapRef = useRef(map);

  useEffect(() => {
    if (map !== lastSavedMapRef.current) {
      setDirty(true);
    }
  }, [map]);

  const handleSave = () => {
    const updated = saveMap(savedMap.id, name, map);
    lastSavedMapRef.current = map;
    setDirty(false);
    onSaved(updated);
  };

  const handleRename = (next: string) => {
    if (!next.trim()) return;
    setName(next.trim());
    setDirty(true);
  };

  return (
    <div className="builder-shell">
      <BuilderToolbar
        name={name}
        dirty={dirty}
        mode={mode}
        onModeChange={setMode}
        onSave={handleSave}
        onRename={handleRename}
        onBack={onBack}
      />
      {mode === "connect" || mode === "status" ? (
        <InteractiveMap mode={mode} />
      ) : (
        <div className="app-shell">
          <SectionsPanel />
          <main className="map-canvas">
            <Header />
            <VisionMissionBanner />
            <ValuesRow />
            <PerspectivesSection />
          </main>
        </div>
      )}
    </div>
  );
}

export function BuilderScreen({
  savedMap,
  onBack,
  onSaved,
}: {
  savedMap: SavedMap;
  onBack: () => void;
  onSaved: (updated: SavedMap) => void;
}) {
  return (
    <MapProvider initialMap={savedMap.map}>
      <BuilderInner savedMap={savedMap} onBack={onBack} onSaved={onSaved} />
    </MapProvider>
  );
}
