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
import { EditableText } from "./EditableText";

export function MyMapsScreen({ onOpen }: { onOpen: (savedMap: SavedMap) => void }) {
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
          <div className="map-kicker">Strategy Map Builder</div>
          <h1 className="my-maps-title">My Maps</h1>
        </div>
        <button type="button" className="add-btn my-maps-new-btn" onClick={handleNew}>
          + New map
        </button>
      </div>

      {maps.length === 0 ? (
        <div className="my-maps-empty">
          <p>No saved maps yet.</p>
          <button type="button" className="add-btn my-maps-new-btn" onClick={handleNew}>
            + New map
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
                    ariaLabel={`Rename ${savedMap.name}`}
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
                    Last edited {new Date(savedMap.updatedAt).toLocaleString()}
                  </span>
                </button>
              )}

              {confirmingDeleteId === savedMap.id ? (
                <div className="my-maps-row-actions">
                  <span className="builder-toolbar-status">Delete this map?</span>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => setConfirmingDeleteId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="icon-btn my-maps-delete-confirm"
                    onClick={() => handleDelete(savedMap.id)}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <div className="my-maps-row-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Rename ${savedMap.name}`}
                    onClick={() => setRenamingId(savedMap.id)}
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Duplicate ${savedMap.name}`}
                    onClick={() => handleDuplicate(savedMap)}
                  >
                    Duplicate
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Delete ${savedMap.name}`}
                    onClick={() => setConfirmingDeleteId(savedMap.id)}
                  >
                    Delete
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
