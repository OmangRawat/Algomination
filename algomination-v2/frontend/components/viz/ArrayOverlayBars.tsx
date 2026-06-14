"use client";

import { motion } from "framer-motion";
import type { HighlightKind, Step } from "@/lib/engine/types";
import { HIGHLIGHT_FILL, IDLE_FILL } from "@/lib/engine/highlight";
import { cn } from "@/lib/utils";

const BAR_AREA = 240;

/** Equal-width columns so an absolute overlay grid aligns with the bars. */
const cols = (n: number) => ({
  gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
});
const GRID_CLASS = "gap-1.5 px-2";

const pointerLabels = (step: Step, pos: number) =>
  step.pointers
    ? Object.entries(step.pointers)
        .filter(([, p]) => p === pos)
        .map(([label]) => label)
    : [];

const positionsWithKind = (step: Step, kind: HighlightKind) =>
  step.items.map((_, p) => p).filter((p) => step.highlights[p] === kind);

/** Bar columns shared by both overlays: neutral, with only active cells tinted. */
function BarRow({
  step,
  max,
  fillFor,
}: {
  step: Step;
  max: number;
  fillFor: (kind: HighlightKind | undefined) => string;
}) {
  return (
    <div
      className={cn("grid items-end", GRID_CLASS)}
      style={{ ...cols(step.items.length), height: BAR_AREA }}
    >
      {step.items.map((item, pos) => {
        const kind = step.highlights[pos];
        const labels = pointerLabels(step, pos);
        const height = Math.max(8, (item.value / max) * (BAR_AREA - 44));
        return (
          <motion.div
            key={item.id}
            layout
            transition={{ type: "spring", stiffness: 520, damping: 38 }}
            className="flex h-full flex-col items-center justify-end gap-1"
          >
            <span className="flex h-4 items-end text-[10px] font-semibold text-brand">
              {labels.join(",")}
            </span>
            <motion.div
              layout
              animate={{ height, backgroundColor: fillFor(kind) }}
              transition={{
                height: { type: "spring", stiffness: 300, damping: 30 },
                backgroundColor: { duration: 0.2 },
              }}
              className="w-full rounded-t-md"
              style={{ height }}
            />
            <span className="text-xs font-medium tabular-nums text-muted">
              {item.value}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Sliding-window canvas: neutral bars with a coloured frame drawn *on top* of
 * the window's columns (blue for the current window, green for the best so far).
 * The element leaving (amber) and joining (cyan) are tinted as they move.
 */
export function SlidingWindowBars({ step }: { step: Step }) {
  const n = step.items.length;
  const max = Math.max(...step.items.map((i) => i.value), 1);

  const win = positionsWithKind(step, "window");
  const best = positionsWithKind(step, "found");
  const span = win.length ? win : best;
  const isBest = !win.length && best.length > 0;
  const range = span.length
    ? ([Math.min(...span), Math.max(...span)] as const)
    : null;

  const borderColor = isBest ? "var(--success)" : "var(--brand)";
  const tintColor = isBest
    ? "color-mix(in srgb, var(--success) 12%, transparent)"
    : "color-mix(in srgb, var(--brand) 12%, transparent)";

  const fillFor = (kind: HighlightKind | undefined) =>
    kind === "compare"
      ? HIGHLIGHT_FILL.compare
      : kind === "swap"
        ? HIGHLIGHT_FILL.swap
        : IDLE_FILL;

  return (
    <div className="relative pt-5">
      {range && (
        <div
          className={cn("pointer-events-none absolute inset-x-0 bottom-7 top-5 grid", GRID_CLASS)}
          style={cols(n)}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className="relative rounded-xl border-2"
            style={{
              gridColumn: `${range[0] + 1} / ${range[1] + 2}`,
              borderColor,
              backgroundColor: tintColor,
            }}
          >
            <span
              className="absolute -top-[0.95rem] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ backgroundColor: borderColor }}
            >
              {isBest ? "Best window" : "Window"}
            </span>
          </motion.div>
        </div>
      )}
      <BarRow step={step} max={max} fillFor={fillFor} />
    </div>
  );
}

const REGION_BASE: Record<string, string> = {
  less: "var(--brand-2)",
  equal: "var(--warning)",
  greater: "var(--danger)",
};

/**
 * Dutch-flag canvas: neutral bars with three labelled region bands drawn *below*
 * them — "< pivot", "= pivot", "> pivot" — that grow as the partition forms.
 * The active element (mid) and any swap targets are tinted on the bars.
 */
export function PartitionBars({ step }: { step: Step }) {
  const n = step.items.length;
  const max = Math.max(...step.items.map((i) => i.value), 1);

  const p = step.pointers;
  const has = !!p && "low" in p && "mid" in p && "high" in p;
  const low = has ? p!.low : 0;
  const mid = has ? p!.mid : 0;
  const high = has ? p!.high : n - 1;

  const bands: { from: number; to: number; kind: string; label: string }[] = [];
  if (has) {
    if (low > 0) bands.push({ from: 0, to: low - 1, kind: "less", label: "< pivot" });
    if (mid > low)
      bands.push({ from: low, to: mid - 1, kind: "equal", label: "= pivot" });
    if (high + 1 < n)
      bands.push({ from: high + 1, to: n - 1, kind: "greater", label: "> pivot" });
  }
  const unknown = has && mid <= high ? ([mid, high] as const) : null;

  const fillFor = (kind: HighlightKind | undefined) =>
    kind === "compare"
      ? HIGHLIGHT_FILL.compare
      : kind === "swap"
        ? HIGHLIGHT_FILL.swap
        : IDLE_FILL;

  return (
    <div className="flex flex-col">
      <BarRow step={step} max={max} fillFor={fillFor} />
      <div className={cn("mt-2 grid", GRID_CLASS)} style={cols(n)}>
        {bands.map((b) => (
          <div
            key={b.kind}
            style={{
              gridColumn: `${b.from + 1} / ${b.to + 2}`,
              backgroundColor: `color-mix(in srgb, ${REGION_BASE[b.kind]} 28%, transparent)`,
              color: REGION_BASE[b.kind],
            }}
            className="overflow-hidden rounded-md py-1 text-center text-[11px] font-semibold"
          >
            {b.label}
          </div>
        ))}
        {unknown && (
          <div
            style={{ gridColumn: `${unknown[0] + 1} / ${unknown[1] + 2}` }}
            className="overflow-hidden rounded-md border border-dashed border-border py-1 text-center text-[11px] text-muted"
          >
            unprocessed
          </div>
        )}
      </div>
    </div>
  );
}
