import type { InitiativeProgress } from "../types";

export const INITIATIVE_PROGRESS_META: Record<InitiativeProgress, { color: string }> = {
  none: { color: "var(--color-status-neutral)" },
  "on-track": { color: "var(--color-status-on-track)" },
  "in-progress": { color: "var(--color-status-attention)" },
  "not-on-track": { color: "var(--color-status-off-track)" },
};

export const INITIATIVE_PROGRESS_CYCLE: InitiativeProgress[] = [
  "none",
  "on-track",
  "in-progress",
  "not-on-track",
];

export function nextInitiativeProgress(current: InitiativeProgress): InitiativeProgress {
  const index = INITIATIVE_PROGRESS_CYCLE.indexOf(current);
  return INITIATIVE_PROGRESS_CYCLE[(index + 1) % INITIATIVE_PROGRESS_CYCLE.length];
}

export const INITIATIVE_PROGRESS_LABEL_KEYS: Record<InitiativeProgress, string> = {
  none: "initiativeProgress.notStarted",
  "on-track": "initiativeProgress.onTrack",
  "in-progress": "initiativeProgress.inProgress",
  "not-on-track": "initiativeProgress.notOnTrack",
};
