import { useState } from "react";
import { createDefaultMap } from "../lib/defaultMap";
import { makeId } from "../lib/id";
import {
  deleteMap,
  duplicateMap,
  listMaps,
  renameMap,
  saveMap,
  type SavedMap,
} from "../lib/storage";
import { useTranslation } from "../i18n/useTranslation";
import { EditableText } from "./EditableText";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function MyMapsScreen({ onOpen }: { onOpen: (savedMap: SavedMap) => void }) {
  const { t } = useTranslation();
  const [maps, setMaps] = useState<SavedMap[]>(() => listMaps());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const refresh = () => setMaps(listMaps());

  const handleNew = () => {
    const saved = saveMap(makeId("map"), "Untitled Strategy Map", createDefaultMap());
    refresh();
    onOpen(saved);
  };

  const handleRename = (savedMap: SavedMap, name: string) => {
    if (name.trim()) renameMap(savedMap.id, name.trim());
    refresh();
  };

  const handleDuplicate = (savedMap: SavedMap) => {
    duplicateMap(savedMap.id, makeId("map"), `${savedMap.name} copy`);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteMap(id);
    setConfirmingDeleteId(null);
    refresh();
  };

  return (
    <div className="my-maps-screen">
      <div className="my-maps-header">
        <div>
          <div className="map-kicker">{t("myMaps.kicker")}</div>
          <h1 className="my-maps-title">{t("myMaps.title")}</h1>
        </div>
        <div className="my-maps-header-actions">
          <LanguageSwitcher />
          <button type="button" className="add-btn my-maps-new-btn" onClick={handleNew}>
            {t("myMaps.newMap")}
          </button>
        </div>
      </div>

      {maps.length === 0 ? (
        <div className="my-maps-empty">
          <p>{t("myMaps.empty")}</p>
          <button type="button" className="add-btn my-maps-new-btn" onClick={handleNew}>
            {t("myMaps.newMap")}
          </button>
        </div>
      ) : (
        <ul className="my-maps-list">
          {maps.map((savedMap) => (
            <li key={savedMap.id} className="my-maps-row">
              {renamingId === savedMap.id ? (
                <div
                  className="my-maps-row-rename"
                  onBlur={() => setRenamingId(null)}
                >
                  <EditableText
                    as="span"
                    className="my-maps-row-name-edit"
                    value={savedMap.name}
                    onChange={(name) => handleRename(savedMap, name)}
                    ariaLabel={t("myMaps.renameAria", { name: savedMap.name })}
                    autoFocus
                  />
                </div>
              ) : (
                <button
                  type="button"
                  className="my-maps-row-open"
                  onClick={() => onOpen(savedMap)}
                >
                  <span className="my-maps-row-name">{savedMap.name || "Untitled"}</span>
                  <span className="my-maps-row-date">
                    {t("myMaps.lastEdited", {
                      date: new Date(savedMap.updatedAt).toLocaleString(),
                    })}
                  </span>
                </button>
              )}

              {confirmingDeleteId === savedMap.id ? (
                <div className="my-maps-row-actions">
                  <span className="builder-toolbar-status">
                    {t("myMaps.deleteConfirmPrompt")}
                  </span>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setConfirmingDeleteId(null)}
                  >
                    {t("myMaps.cancel")}
                  </button>
                  <button
                    type="button"
                    className="icon-btn my-maps-delete-confirm"
                    onClick={() => handleDelete(savedMap.id)}
                  >
                    {t("myMaps.delete")}
                  </button>
                </div>
              ) : (
                <div className="my-maps-row-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={t("myMaps.renameAria", { name: savedMap.name })}
                    onClick={() => setRenamingId(savedMap.id)}
                  >
                    {t("myMaps.rename")}
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={t("myMaps.duplicateAria", { name: savedMap.name })}
                    onClick={() => handleDuplicate(savedMap)}
                  >
                    {t("myMaps.duplicate")}
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={t("myMaps.deleteAria", { name: savedMap.name })}
                    onClick={() => setConfirmingDeleteId(savedMap.id)}
                  >
                    {t("myMaps.delete")}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
