import { useMap } from "../state/useMap";
import { EditableText } from "./EditableText";

export function ValuesRow({ readOnly = false }: { readOnly?: boolean }) {
  const { map, dispatch } = useMap();
  const { values } = map.sections;

  if (!values.visible) return null;

  return (
    <div className="values-section">
      <div className="values-grid">
        {values.items.map((value) => (
          <div key={value.id} className="value-tile">
            <EditableText
              value={value.text}
              onChange={(text) => dispatch({ type: "SET_VALUE_TEXT", id: value.id, text })}
              ariaLabel="Value"
              placeholder="Value"
              readOnly={readOnly}
            />
            {!readOnly && (
              <button
                type="button"
                className="remove-value-btn"
                aria-label={`Remove value: ${value.text}`}
                onClick={() => dispatch({ type: "REMOVE_VALUE", id: value.id })}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            type="button"
            className="add-value-tile"
            onClick={() => dispatch({ type: "ADD_VALUE" })}
          >
            + Add value
          </button>
        )}
      </div>
    </div>
  );
}
