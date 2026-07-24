import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";
import { EditableText } from "./EditableText";

export function VisionMissionBanner({ readOnly = false }: { readOnly?: boolean }) {
  const { map, dispatch } = useMap();
  const { t } = useTranslation();
  const { vision, mission } = map.sections;

  if (!vision.visible && !mission.visible) return null;

  return (
    <div className="vm-banner">
      {vision.visible && (
        <div className="vm-card vision">
          <div className="vm-label">{t("sections.vision")}</div>
          <EditableText
            className="vm-text"
            value={vision.text}
            onChange={(text) => dispatch({ type: "SET_VISION_TEXT", text })}
            ariaLabel={t("canvas.visionAria")}
            placeholder="Add your vision statement here."
            readOnly={readOnly}
          />
        </div>
      )}
      {mission.visible && (
        <div className="vm-card mission">
          <div className="vm-label">{t("sections.mission")}</div>
          <EditableText
            className="vm-text"
            value={mission.text}
            onChange={(text) => dispatch({ type: "SET_MISSION_TEXT", text })}
            ariaLabel={t("canvas.missionAria")}
            placeholder="Add your mission statement here."
            readOnly={readOnly}
          />
        </div>
      )}
    </div>
  );
}
