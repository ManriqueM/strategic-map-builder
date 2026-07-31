import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";

export function SectionsPanel({ isOpen }: { isOpen: boolean }) {
  const { map, dispatch } = useMap();
  const { t } = useTranslation();

  return (
    <aside className={`sections-panel${isOpen ? " is-open" : ""}`}>
      <div className="panel-section">
        <h2>{t("sections.heading")}</h2>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={map.sections.mission.visible}
            onChange={() => dispatch({ type: "TOGGLE_SECTION", section: "mission" })}
          />
          {t("sections.mission")}
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={map.sections.vision.visible}
            onChange={() => dispatch({ type: "TOGGLE_SECTION", section: "vision" })}
          />
          {t("sections.vision")}
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={map.sections.values.visible}
            onChange={() => dispatch({ type: "TOGGLE_SECTION", section: "values" })}
          />
          {t("sections.values")}
        </label>
      </div>

      <div className="panel-section">
        <h2>{t("sections.perspectivesHeading")}</h2>
        {map.perspectives.map((perspective, index) => (
          <div key={perspective.id} className="perspective-row-control">
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={perspective.visible}
                onChange={() => dispatch({ type: "TOGGLE_PERSPECTIVE", id: perspective.id })}
              />
              <span className="perspective-name">{perspective.name || "Untitled"}</span>
            </label>
            <button
              type="button"
              className="icon-btn"
              aria-label={t("sections.moveUpAria", { name: perspective.name })}
              disabled={index === 0}
              onClick={() =>
                dispatch({ type: "MOVE_PERSPECTIVE", id: perspective.id, direction: "up" })
              }
            >
              ↑
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label={t("sections.moveDownAria", { name: perspective.name })}
              disabled={index === map.perspectives.length - 1}
              onClick={() =>
                dispatch({ type: "MOVE_PERSPECTIVE", id: perspective.id, direction: "down" })
              }
            >
              ↓
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label={t("sections.removePerspectiveAria", { name: perspective.name })}
              onClick={() => dispatch({ type: "REMOVE_PERSPECTIVE", id: perspective.id })}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="add-btn"
          onClick={() => dispatch({ type: "ADD_PERSPECTIVE" })}
        >
          {t("sections.addPerspective")}
        </button>
      </div>
    </aside>
  );
}
