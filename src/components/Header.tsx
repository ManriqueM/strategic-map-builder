import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";
import { EditableText } from "./EditableText";

export function Header() {
  const { map, dispatch } = useMap();
  const { t } = useTranslation();

  return (
    <div>
      <div className="map-kicker">{t("canvas.kicker")}</div>
      <EditableText
        as="h1"
        className="map-title"
        value={map.title}
        onChange={(text) => dispatch({ type: "SET_TITLE", text })}
        ariaLabel={t("canvas.titleAria")}
        placeholder="Untitled Strategy Map"
      />
      <EditableText
        as="p"
        className="map-subtitle"
        value={map.subtitle}
        onChange={(text) => dispatch({ type: "SET_SUBTITLE", text })}
        ariaLabel={t("canvas.subtitleAria")}
        placeholder="Add a short description of this strategy."
      />
    </div>
  );
}
