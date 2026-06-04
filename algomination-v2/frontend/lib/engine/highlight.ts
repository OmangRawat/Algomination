import type { HighlightKind } from "./types";

/** Bar fill colour per highlight kind (theme CSS vars). */
export const HIGHLIGHT_FILL: Record<HighlightKind, string> = {
  compare: "var(--accent)",
  swap: "var(--warning)",
  sorted: "var(--success)",
  active: "var(--brand)",
  min: "var(--brand-2)",
  pivot: "var(--danger)",
  found: "var(--success)",
  range: "color-mix(in srgb, var(--brand) 35%, transparent)",
};

/** Human-readable legend label per highlight kind. */
export const HIGHLIGHT_LABEL: Record<HighlightKind, string> = {
  compare: "Comparing",
  swap: "Swapping",
  sorted: "Sorted",
  active: "Key / Active",
  min: "Minimum",
  pivot: "Pivot",
  found: "Found",
  range: "Sub-array",
};

export const IDLE_FILL = "var(--surface-2)";
