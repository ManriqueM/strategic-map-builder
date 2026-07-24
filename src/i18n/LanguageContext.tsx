import { useEffect, useState, type ReactNode } from "react";
import type { Language } from "./types";
import { en } from "./translations/en";
import { es } from "./translations/es";
import { LanguageContext } from "./languageContextDef";

const DICTS = { en, es };
const STORAGE_KEY = "strategy-map-builder:language";

function readStoredLanguage(): Language {
  return localStorage.getItem(STORAGE_KEY) === "es" ? "es" : "en";
}

function getPath(dict: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((obj, part) => {
    if (obj && typeof obj === "object") return (obj as Record<string, unknown>)[part];
    return undefined;
  }, dict);
}

function interpolate(template: string, vars?: Record<string, string>): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? "");
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const t = (key: string, vars?: Record<string, string>): string => {
    const value = getPath(DICTS[language], key) ?? getPath(DICTS.en, key);
    return typeof value === "string" ? interpolate(value, vars) : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
