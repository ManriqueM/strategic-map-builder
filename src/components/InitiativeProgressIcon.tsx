import type { InitiativeProgress } from "../types";

const ICON_PATHS: Record<InitiativeProgress, string> = {
  "not-on-track": "M3 3 L9 9 M9 3 L3 9",
  "on-track": "M3 2 L8 6 L3 10",
  complete: "M2.5 6.5 L5 9 L9.5 3",
};

export function InitiativeProgressIcon({ progress }: { progress: InitiativeProgress }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path
        d={ICON_PATHS[progress]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
