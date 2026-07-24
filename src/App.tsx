import { useState } from "react";
import "./styles/map.css";
import { MyMapsScreen } from "./components/MyMapsScreen";
import { BuilderScreen } from "./components/BuilderScreen";
import type { SavedMap } from "./lib/storage";

function App() {
  const [activeMap, setActiveMap] = useState<SavedMap | null>(null);

  if (activeMap) {
    return (
      <BuilderScreen
        savedMap={activeMap}
        onBack={() => setActiveMap(null)}
        onSaved={setActiveMap}
      />
    );
  }

  return <MyMapsScreen onOpen={setActiveMap} />;
}

export default App;
