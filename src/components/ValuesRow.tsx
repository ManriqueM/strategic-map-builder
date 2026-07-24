import { useMap } from "../state/useMap";
import { useTranslation } from "../i18n/useTranslation";
import { EditableText } from "./EditableText";

export function ValuesRow({ readOnly = false }: { readOnly?: boolean }) {
  const { map, dispatch } = useMap();
  const { t } = useTranslation();
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
              ariaLabel={t("canvas.valueAria")}
              placeholder="Value"
              readOnly={readOnly}
            />
            {!readOnly && (
              <button
                type="button"
                className="remove-value-btn"
                aria-label={t("canvas.removeValueAria", { text: value.text })}
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
            {t("canvas.addValue")}
          </button>
        )}
      </div>
    </div>
  );
}
