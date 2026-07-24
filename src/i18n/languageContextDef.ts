import { createContext } from "react";
import type { Language } from "./types";

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
