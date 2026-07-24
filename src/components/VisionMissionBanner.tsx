import { useMap } from "../state/useMap";
import { EditableText } from "./EditableText";

export function VisionMissionBanner() {
  const { map, dispatch } = useMap();
  const { vision, mission } = map.sections;

  if (!vision.visible && !mission.visible) return null;

  return (
    <div className="vm-banner">
      {vision.visible && (
        <div className="vm-card vision">
          <div className="vm-label">Vision</div>
          <EditableText
            className="vm-text"
            value={vision.text}
            onChange={(text) => dispatch({ type: "SET_VISION_TEXT", text })}
            ariaLabel="Vision statement"
            placeholder="Add your vision statement here."
          />
        </div>
      )}
      {mission.visible && (
        <div className="vm-card mission">
          <div className="vm-label">Mission</div>
          <EditableText
            className="vm-text"
            value={mission.text}
            onChange={(text) => dispatch({ type: "SET_MISSION_TEXT", text })}
            ariaLabel="Mission statement"
            placeholder="Add your mission statement here."
          />
        </div>
      )}
    </div>
  );
}
