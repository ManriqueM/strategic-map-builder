import type { ObjectiveStatus } from "../types";

export const STATUS_META: Record<ObjectiveStatus, { color: string }> = {
  none: { color: "var(--color-status-neutral)" },
  "on-track": { color: "var(--color-status-on-track)" },
  "needs-attention": { color: "var(--color-status-attention)" },
  "off-track": { color: "var(--color-status-off-track)" },
};

const STATUS_CYCLE: ObjectiveStatus[] = [
  "none",
  "on-track",
  "needs-attention",
  "off-track",
];

export function nextStatus(current: ObjectiveStatus): ObjectiveStatus {
  const index = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(index + 1) % STATUS_CYCLE.length];
}

export const LEGEND_STATUSES: ObjectiveStatus[] = ["on-track", "needs-attention", "off-track"];

export const STATUS_LABEL_KEYS: Record<string, string> = {
  "on-track": "status.onTrack",
  "needs-attention": "status.needsAttention",
  "off-track": "status.offTrack",
};
