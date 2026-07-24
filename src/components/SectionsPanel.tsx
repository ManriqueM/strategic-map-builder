import { useMap } from "../state/useMap";

export function SectionsPanel() {
  const { map, dispatch } = useMap();

  return (
    <aside className="sections-panel">
      <div className="panel-section">
        <h2>Sections</h2>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={map.sections.mission.visible}
            onChange={() => dispatch({ type: "TOGGLE_SECTION", section: "mission" })}
          />
          Mission
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={map.sections.vision.visible}
            onChange={() => dispatch({ type: "TOGGLE_SECTION", section: "vision" })}
          />
          Vision
        </label>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={map.sections.values.visible}
            onChange={() => dispatch({ type: "TOGGLE_SECTION", section: "values" })}
          />
          Values
        </label>
      </div>

      <div className="panel-section">
        <h2>Perspectives</h2>
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
              aria-label={`Move ${perspective.name} up`}
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
              aria-label={`Move ${perspective.name} down`}
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
              aria-label={`Remove perspective: ${perspective.name}`}
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
          + Add perspective
        </button>
      </div>
    </aside>
  );
}
