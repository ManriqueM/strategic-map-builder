import type { ObjectiveStatus } from "../types";

export const STATUS_META: Record<ObjectiveStatus, { label: string; color: string }> = {
  none: { label: "No status", color: "var(--color-status-neutral)" },
  "on-track": { label: "On Track", color: "var(--color-status-on-track)" },
  "needs-attention": { label: "Needs Attention", color: "var(--color-status-attention)" },
  "off-track": { label: "Off Track", color: "var(--color-status-off-track)" },
};

export const STATUS_CYCLE: ObjectiveStatus[] = [
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
