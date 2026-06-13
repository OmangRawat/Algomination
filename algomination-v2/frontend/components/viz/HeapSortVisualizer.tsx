"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import type { HighlightKind, Step } from "@/lib/engine/types";
import { heapSort } from "@/lib/algorithms/heap";
import { useFramePlayer } from "@/lib/engine/useFramePlayer";
import { PlayerControls } from "./PlayerControls";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const NODE = 44;
const PAD = 24;
const LEVEL_H = 70;
const MAX_ITEMS = 15;

function parseInput(raw: string): number[] {
  return raw
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

/** Centres for a complete binary tree of `n` array-indexed nodes. */
function heapLayout(n: number) {
  const cx: number[] = [];
  const cy: number[] = [];
  let maxDepth = 0;
  for (let i = 0; i < n; i++) maxDepth = Math.max(maxDepth, Math.floor(Math.log2(i + 1)));
  const levelWidth = Math.pow(2, maxDepth);
  const span = Math.max(levelWidth * (NODE + 12), 240);
  for (let i = 0; i < n; i++) {
    const depth = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (Math.pow(2, depth) - 1);
    const count = Math.pow(2, depth);
    cx[i] = PAD + ((posInLevel + 0.5) / count) * span;
    cy[i] = PAD + depth * LEVEL_H + NODE / 2;
  }
  return { cx, cy, width: span + PAD * 2, height: PAD * 2 + maxDepth * LEVEL_H + NODE };
}

const FILL: Partial<Record<HighlightKind, string>> = {
  compare: "color-mix(in srgb, var(--accent) 26%, var(--surface-2))",
  swap: "color-mix(in srgb, var(--warning) 26%, var(--surface-2))",
  active: "color-mix(in srgb, var(--brand) 26%, var(--surface-2))",
};
const BORDER: Partial<Record<HighlightKind, string>> = {
  compare: "var(--accent)",
  swap: "var(--warning)",
  active: "var(--brand)",
};

export function HeapSortVisualizer({
  title,
  description,
  complexity,
  defaultInput = "4 10 3 5 1 8 2 7",
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
  defaultInput?: string;
}) {
  const [inputText, setInputText] = useState(defaultInput);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>(() => heapSort(parseInput(defaultInput)));
  const player = useFramePlayer(steps);
  const step = player.frame;

  const generate = (raw: string) => {
    const values = parseInput(raw);
    if (values.length < 2) return setError("Enter at least 2 numbers.");
    if (values.length > MAX_ITEMS) return setError(`Use at most ${MAX_ITEMS} numbers.`);
    if (values.some((v) => v < 0 || v > 999)) return setError("Use numbers between 0 and 999.");
    setError(null);
    setSteps(heapSort(values));
  };

  const randomize = () => {
    const len = 6 + Math.floor(Math.random() * 4);
    const values = Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 99));
    setInputText(values.join(" "));
    setError(null);
    setSteps(heapSort(values));
  };

  const items = step?.items ?? [];
  const n = items.length;
  let sortedCount = 0;
  for (let i = 0; i < n; i++) if (step?.highlights[i] === "sorted") sortedCount++;
  const heapSize = n - sortedCount;
  const layout = heapLayout(heapSize);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {complexity && (
            <div className="flex gap-2">
              <Badge tone="brand">Time {complexity.time}</Badge>
              <Badge tone="muted">Space {complexity.space}</Badge>
            </div>
          )}
        </div>
        {description && <p className="text-muted">{description}</p>}
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate(inputText)}
            placeholder="e.g. 4 10 3 5 1 8 2 7"
            className="h-11 flex-1 rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          />
          <Button onClick={() => generate(inputText)}>Visualize</Button>
          <Button variant="outline" onClick={randomize}>
            <Shuffle size={16} /> Random
          </Button>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      {/* Canvas */}
      <div className="rounded-2xl border border-border bg-surface/60 p-4">
        <div className="overflow-x-auto">
          <div
            className="relative mx-auto"
            style={{ width: Math.max(layout.width, 280), height: Math.max(layout.height, 120) }}
          >
            {heapSize === 0 && (
              <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">
                Heap empty — array fully sorted.
              </p>
            )}

            {/* Edges */}
            <svg className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
              {Array.from({ length: heapSize }).map((_, i) => {
                const kids = [2 * i + 1, 2 * i + 2].filter((c) => c < heapSize);
                return kids.map((c) => (
                  <motion.line
                    key={`${items[i].id}-${items[c].id}`}
                    initial={false}
                    animate={{ x1: layout.cx[i], y1: layout.cy[i], x2: layout.cx[c], y2: layout.cy[c] }}
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    stroke="var(--border)"
                    strokeWidth={2}
                  />
                ));
              })}
            </svg>

            {/* Heap nodes */}
            <AnimatePresence>
              {items.slice(0, heapSize).map((item, i) => {
                const kind = step?.highlights[i];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1, x: layout.cx[i] - NODE / 2, y: layout.cy[i] - NODE / 2 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    className="absolute left-0 top-0 flex items-center justify-center rounded-full border-2 text-sm font-semibold tabular-nums shadow-md"
                    style={{
                      width: NODE,
                      height: NODE,
                      background: (kind && FILL[kind]) || "var(--surface-2)",
                      borderColor: (kind && BORDER[kind]) || (i === 0 ? "var(--brand)" : "var(--border)"),
                      color: "var(--foreground)",
                    }}
                  >
                    {item.value}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Sorted tail */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Sorted (final positions)
          </span>
          <div className="flex min-h-9 flex-wrap items-center justify-center gap-1">
            <AnimatePresence mode="popLayout" initial={false}>
              {sortedCount === 0 ? (
                <span className="text-xs text-muted/60">none yet</span>
              ) : (
                items.slice(heapSize).map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                    className="flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold tabular-nums"
                    style={{
                      borderColor: "var(--success)",
                      background: "color-mix(in srgb, var(--success) 22%, var(--surface-2))",
                      color: "var(--foreground)",
                    }}
                  >
                    {item.value}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-3 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {step?.caption ?? "Enter an array to begin."}
        </div>
      </div>

      {/* Controls */}
      <PlayerControls player={player} />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
          Root / sifting
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          Comparing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--warning)" }} />
          Swapping
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--success)" }} />
          Sorted
        </span>
      </div>
    </div>
  );
}
