import { useState } from "react";
import { useTranslation } from "../i18n/useTranslation";
import { EditableText } from "./EditableText";
import { LanguageSwitcher } from "./LanguageSwitcher";

export type BuilderMode = "edit" | "connect" | "status";

export function BuilderToolbar({
  name,
  dirty,
  mode,
  onModeChange,
  onSave,
  onRename,
  onBack,
}: {
  name: string;
  dirty: boolean;
  mode: BuilderMode;
  onModeChange: (mode: BuilderMode) => void;
  onSave: () => void;
  onRename: (name: string) => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
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
        <span className="builder-toolbar-status">{t("builder.leaveConfirm")}</span>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setConfirmingLeave(false)}
        >
          {t("builder.keepEditing")}
        </button>
        <button type="button" className="add-btn builder-toolbar-save" onClick={onBack}>
          {t("builder.discardAndLeave")}
        </button>
      </div>
    );
  }

  return (
    <div className="builder-toolbar">
      <button type="button" className="icon-btn builder-toolbar-back" onClick={handleBackClick}>
        {t("builder.back")}
      </button>
      <EditableText
        as="span"
        className="builder-toolbar-name"
        value={name}
        onChange={onRename}
        ariaLabel={t("builder.mapNameAria")}
        placeholder="Untitled"
      />
      <div className="mode-toggle" role="group" aria-label={t("builder.viewModeAria")}>
        <button
          type="button"
          className={`mode-toggle-btn${mode === "edit" ? " is-active" : ""}`}
          onClick={() => onModeChange("edit")}
        >
          {t("builder.modeEdit")}
        </button>
        <button
          type="button"
          className={`mode-toggle-btn${mode === "connect" ? " is-active" : ""}`}
          onClick={() => onModeChange("connect")}
        >
          {t("builder.modeConnect")}
        </button>
        <button
          type="button"
          className={`mode-toggle-btn${mode === "status" ? " is-active" : ""}`}
          onClick={() => onModeChange("status")}
        >
          {t("builder.modeStatus")}
        </button>
      </div>
      <span className="builder-toolbar-status">
        {dirty ? t("builder.unsavedChanges") : t("builder.saved")}
      </span>
      <LanguageSwitcher />
      <button
        type="button"
        className="add-btn builder-toolbar-save"
        onClick={onSave}
        disabled={!dirty}
      >
        {t("builder.save")}
      </button>
    </div>
  );
}
