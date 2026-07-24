import { useMap } from "../state/useMap";
import { EditableText } from "./EditableText";

export function Header() {
  const { map, dispatch } = useMap();

  return (
    <div>
      <div className="map-kicker">Strategy Map</div>
      <EditableText
        as="h1"
        className="map-title"
        value={map.title}
        onChange={(text) => dispatch({ type: "SET_TITLE", text })}
        ariaLabel="Strategy map title"
        placeholder="Untitled Strategy Map"
      />
      <EditableText
        as="p"
        className="map-subtitle"
        value={map.subtitle}
        onChange={(text) => dispatch({ type: "SET_SUBTITLE", text })}
        ariaLabel="Strategy map subtitle"
        placeholder="Add a short description of this strategy."
      />
    </div>
  );
}
