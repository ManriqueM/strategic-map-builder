import { useState } from "react";
import "./styles/map.css";
import { LanguageProvider } from "./i18n/LanguageContext";
import { MyMapsScreen } from "./components/MyMapsScreen";
import { BuilderScreen } from "./components/BuilderScreen";
import type { SavedMap } from "./lib/storage";

function App() {
  const [activeMap, setActiveMap] = useState<SavedMap | null>(null);

  return (
    <LanguageProvider>
      {activeMap ? (
        <BuilderScreen
          savedMap={activeMap}
          onBack={() => setActiveMap(null)}
          onSaved={setActiveMap}
        />
      ) : (
        <MyMapsScreen onOpen={setActiveMap} />
      )}
    </LanguageProvider>
  );
}

export default App;
