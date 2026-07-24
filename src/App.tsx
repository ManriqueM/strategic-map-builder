import "./styles/map.css";
import { MapProvider } from "./state/MapContext";
import { SectionsPanel } from "./components/SectionsPanel";
import { Header } from "./components/Header";
import { VisionMissionBanner } from "./components/VisionMissionBanner";
import { ValuesRow } from "./components/ValuesRow";
import { PerspectivesSection } from "./components/PerspectivesSection";

function App() {
  return (
    <MapProvider>
      <div className="app-shell">
        <SectionsPanel />
        <main className="map-canvas">
          <Header />
          <VisionMissionBanner />
          <ValuesRow />
          <PerspectivesSection />
        </main>
      </div>
    </MapProvider>
  );
}

export default App;
