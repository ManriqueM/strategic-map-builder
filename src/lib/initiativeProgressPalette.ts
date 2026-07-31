import type { InitiativeProgress } from "../types";

export const INITIATIVE_PROGRESS_META: Record<InitiativeProgress, { color: string }> = {
  "not-on-track": { color: "var(--color-status-neutral)" },
  "on-track": { color: "var(--color-navy-700)" },
  complete: { color: "var(--color-status-on-track)" },
};

export const INITIATIVE_PROGRESS_CYCLE: InitiativeProgress[] = [
  "not-on-track",
  "on-track",
  "complete",
];

export function nextInitiativeProgress(current: InitiativeProgress): InitiativeProgress {
  const index = INITIATIVE_PROGRESS_CYCLE.indexOf(current);
  return INITIATIVE_PROGRESS_CYCLE[(index + 1) % INITIATIVE_PROGRESS_CYCLE.length];
}

export const INITIATIVE_PROGRESS_LABEL_KEYS: Record<InitiativeProgress, string> = {
  "not-on-track": "initiativeProgress.notOnTrack",
  "on-track": "initiativeProgress.onTrack",
  complete: "initiativeProgress.complete",
};
