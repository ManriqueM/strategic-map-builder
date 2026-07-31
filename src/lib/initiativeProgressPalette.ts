import type { InitiativeProgress } from "../types";

export const INITIATIVE_PROGRESS_META: Record<InitiativeProgress, { color: string }> = {
  none: { color: "var(--color-status-neutral)" },
  "not-on-track": { color: "var(--color-status-off-track)" },
  "on-track": { color: "var(--color-status-attention)" },
  complete: { color: "var(--color-status-on-track)" },
};

// Click-to-cycle order: a natural lifecycle progression (unset -> struggling -> on track ->
// done), independent of the legend's display order below.
export const INITIATIVE_PROGRESS_CYCLE: InitiativeProgress[] = [
  "none",
  "not-on-track",
  "on-track",
  "complete",
];

export function nextInitiativeProgress(current: InitiativeProgress): InitiativeProgress {
  const index = INITIATIVE_PROGRESS_CYCLE.indexOf(current);
  return INITIATIVE_PROGRESS_CYCLE[(index + 1) % INITIATIVE_PROGRESS_CYCLE.length];
}

// Legend display order matches the objective status legend's color sequence
// (green -> amber/yellow -> red), not the click-cycle order above. Like the status legend,
// the default ("none") isn't a legend entry.
export const LEGEND_INITIATIVE_PROGRESS: InitiativeProgress[] = [
  "complete",
  "on-track",
  "not-on-track",
];

export const INITIATIVE_PROGRESS_LABEL_KEYS: Record<InitiativeProgress, string> = {
  none: "initiativeProgress.notSet",
  "not-on-track": "initiativeProgress.notOnTrack",
  "on-track": "initiativeProgress.onTrack",
  complete: "initiativeProgress.complete",
};
