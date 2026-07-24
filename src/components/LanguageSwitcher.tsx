import { LANGUAGES, type Language } from "../i18n/types";
import { useTranslation } from "../i18n/useTranslation";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <select
      className="language-switcher"
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      aria-label={t("common.languageAria")}
    >
      {LANGUAGES.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}
