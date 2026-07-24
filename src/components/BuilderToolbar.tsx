import { useState } from "react";
import { EditableText } from "./EditableText";

export function BuilderToolbar({
  name,
  dirty,
  onSave,
  onRename,
  onBack,
}: {
  name: string;
  dirty: boolean;
  onSave: () => void;
  onRename: (name: string) => void;
  onBack: () => void;
}) {
  const [confirmingLeave, setConfirmingLeave] = useState(false);

  const handleBackClick = () => {
    if (dirty) {
      setConfirmingLeave(true);
      return;
    }
    onBack();
  };

  if (confirmingLeave) {
    return (
      <div className="builder-toolbar builder-toolbar-confirm">
        <span className="builder-toolbar-status">
          You have unsaved changes — leave without saving?
        </span>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setConfirmingLeave(false)}
        >
          Keep editing
        </button>
        <button type="button" className="add-btn builder-toolbar-save" onClick={onBack}>
          Discard &amp; leave
        </button>
      </div>
    );
  }

  return (
    <div className="builder-toolbar">
      <button type="button" className="icon-btn builder-toolbar-back" onClick={handleBackClick}>
        ← My Maps
      </button>
      <EditableText
        as="span"
        className="builder-toolbar-name"
        value={name}
        onChange={onRename}
        ariaLabel="Map name"
        placeholder="Untitled"
      />
      <span className="builder-toolbar-status">{dirty ? "Unsaved changes" : "Saved"}</span>
      <button
        type="button"
        className="add-btn builder-toolbar-save"
        onClick={onSave}
        disabled={!dirty}
      >
        Save
      </button>
    </div>
  );
}
