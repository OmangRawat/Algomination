"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { useFramePlayer } from "@/lib/engine/useFramePlayer";
import { PlayerControls } from "./PlayerControls";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const CELL = 36;
const LEVEL_H = 66;
const PADX = 16;
const PADY = 16;
const BOXH = 42;
const MAX_ITEMS = 8;

type NodeState = "hidden" | "idle" | "merging" | "done";
interface Cell {
  id: number;
  value: number;
}
interface NState {
  values: Cell[];
  state: NodeState;
  compare: number[];
  placed: number[];
}
interface MFrame {
  nodes: Record<number, NState>;
  caption: string;
}
interface BoxGeo {
  key: number;
  left: number;
  top: number;
  width: number;
}

function parseInput(raw: string): number[] {
  return raw
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

/** Build the recursion tree, then a frame timeline that divides then merges. */
function buildMerge(values: number[]): {
  frames: MFrame[];
  layout: BoxGeo[];
  width: number;
  height: number;
} {
  const items: Cell[] = values.map((value, id) => ({ id, value }));
  const n = items.length;

  const geo: { key: number; lo: number; hi: number; depth: number }[] = [];
  const byRange = new Map<string, number>();
  let key = 0;
  let maxDepth = 0;
  const make = (lo: number, hi: number, depth: number) => {
    const k = key++;
    maxDepth = Math.max(maxDepth, depth);
    geo.push({ key: k, lo, hi, depth });
    byRange.set(`${lo}-${hi}`, k);
    if (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      make(lo, mid, depth + 1);
      make(mid, hi, depth + 1);
    }
  };
  make(0, n, 0);
  const keyOf = (lo: number, hi: number) => byRange.get(`${lo}-${hi}`)!;

  const state: Record<number, NState> = {};
  for (const node of geo) {
    state[node.key] = {
      values: items.slice(node.lo, node.hi),
      state: node.depth === 0 ? "idle" : "hidden",
      compare: [],
      placed: [],
    };
  }

  const frames: MFrame[] = [];
  const snap = (caption: string) => {
    const nodes: Record<number, NState> = {};
    for (const k in state) {
      const s = state[k];
      nodes[k] = {
        values: s.values.map((v) => ({ ...v })),
        state: s.state,
        compare: [...s.compare],
        placed: [...s.placed],
      };
    }
    frames.push({ nodes, caption });
  };
  const fmt = (arr: Cell[]) => arr.map((x) => x.value).join(", ");

  snap(`Start with the whole array of ${n} elements.`);

  // Divide: reveal each deeper level of sub-arrays.
  for (let d = 1; d <= maxDepth; d++) {
    let any = false;
    for (const node of geo) {
      if (node.depth === d) {
        state[node.key].state = "idle";
        any = true;
      }
    }
    if (any) snap(`Divide: split each sub-array into two halves (level ${d}).`);
  }

  // Conquer: merge sorted halves back up the tree.
  const merge = (lo: number, hi: number): Cell[] => {
    const node = state[keyOf(lo, hi)];
    if (hi - lo <= 1) return node.values;
    const mid = (lo + hi) >> 1;
    const L = merge(lo, mid);
    const R = merge(mid, hi);
    const ln = state[keyOf(lo, mid)];
    const rn = state[keyOf(mid, hi)];
    node.state = "merging";
    ln.state = "merging";
    rn.state = "merging";
    node.values = [];
    snap(`Merge [${fmt(L)}] and [${fmt(R)}].`);

    let i = 0;
    let j = 0;
    const merged: Cell[] = [];
    const take = (c: Cell, msg: string) => {
      merged.push(c);
      node.values = merged.map((v) => ({ ...v }));
      node.placed = [c.id];
      snap(msg);
    };
    while (i < L.length && j < R.length) {
      ln.compare = [L[i].id];
      rn.compare = [R[j].id];
      snap(`Compare ${L[i].value} and ${R[j].value} — take the smaller.`);
      ln.compare = [];
      rn.compare = [];
      if (L[i].value <= R[j].value) take(L[i++], `Place ${L[i - 1].value}.`);
      else take(R[j++], `Place ${R[j - 1].value}.`);
    }
    while (i < L.length) take(L[i++], `Append remaining ${L[i - 1].value}.`);
    while (j < R.length) take(R[j++], `Append remaining ${R[j - 1].value}.`);

    node.placed = [];
    node.state = "done";
    ln.state = "done";
    rn.state = "done";
    node.values = merged;
    snap(`Merged into [${fmt(merged)}].`);
    return merged;
  };
  merge(0, n);
  state[keyOf(0, n)].state = "done";
  snap(`Sorted! 🎉`);

  const layout: BoxGeo[] = geo.map((node) => ({
    key: node.key,
    left: PADX + node.lo * CELL,
    top: PADY + node.depth * LEVEL_H,
    width: (node.hi - node.lo) * CELL,
  }));

  return {
    frames,
    layout,
    width: PADX * 2 + n * CELL,
    height: PADY * 2 + maxDepth * LEVEL_H + BOXH,
  };
}

export function MergeSortVisualizer({
  title,
  description,
  complexity,
  defaultInput = "6 3 8 1 5 2 7 4",
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
  defaultInput?: string;
}) {
  const [inputText, setInputText] = useState(defaultInput);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(() => buildMerge(parseInput(defaultInput)));
  const player = useFramePlayer(data.frames);
  const frame = player.frame;

  const generate = (raw: string) => {
    const values = parseInput(raw);
    if (values.length < 2) return setError("Enter at least 2 numbers.");
    if (values.length > MAX_ITEMS)
      return setError(`Use at most ${MAX_ITEMS} numbers (the split tree stays readable).`);
    if (values.some((v) => v < 0 || v > 999)) return setError("Use numbers between 0 and 999.");
    setError(null);
    setData(buildMerge(values));
  };

  const randomize = () => {
    const len = 6 + Math.floor(Math.random() * 3);
    const values = Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 99));
    setInputText(values.join(" "));
    setError(null);
    setData(buildMerge(values));
  };

  const boxStyle = (s: NodeState) => {
    switch (s) {
      case "merging":
        return { border: "var(--brand)", bg: "color-mix(in srgb, var(--brand) 8%, var(--surface))" };
      case "done":
        return { border: "color-mix(in srgb, var(--success) 60%, var(--border))", bg: "var(--surface)" };
      default:
        return { border: "var(--border)", bg: "color-mix(in srgb, var(--surface-2) 60%, transparent)" };
    }
  };
  const cellStyle = (ns: NState, id: number) => {
    if (ns.compare.includes(id))
      return { border: "var(--accent)", bg: "color-mix(in srgb, var(--accent) 26%, var(--surface-2))" };
    if (ns.placed.includes(id))
      return { border: "var(--success)", bg: "color-mix(in srgb, var(--success) 26%, var(--surface-2))" };
    return { border: "var(--border)", bg: "var(--surface-2)" };
  };

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
            placeholder="e.g. 6 3 8 1 5 2 7 4"
            className="h-11 flex-1 rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          />
          <Button onClick={() => generate(inputText)}>Visualize</Button>
          <Button variant="outline" onClick={randomize}>
            <Shuffle size={16} /> Random
          </Button>
        </div>
        <p className="text-xs text-muted">
          Up to {MAX_ITEMS} numbers — each level shows the array split in half, then merged back sorted.
        </p>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      {/* Canvas */}
      <div className="rounded-2xl border border-border bg-surface/60 p-4">
        <div className="overflow-x-auto">
          <div
            className="relative mx-auto"
            style={{ width: Math.max(data.width, 280), height: Math.max(data.height, 120) }}
          >
            <AnimatePresence>
              {data.layout.map((box) => {
                const ns = frame?.nodes[box.key];
                if (!ns || ns.state === "hidden") return null;
                const bs = boxStyle(ns.state);
                return (
                  <motion.div
                    key={box.key}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute flex items-center justify-center gap-1 rounded-lg border"
                    style={{
                      left: box.left + 3,
                      top: box.top,
                      width: box.width - 6,
                      height: BOXH,
                      borderColor: bs.border,
                      background: bs.bg,
                    }}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {ns.values.map((c) => {
                        const cs = cellStyle(ns, c.id);
                        return (
                          <motion.div
                            key={`${box.key}:${c.id}`}
                            layout
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ type: "spring", stiffness: 500, damping: 34 }}
                            className="flex h-7 w-7 items-center justify-center rounded border text-xs font-semibold tabular-nums"
                            style={{ borderColor: cs.border, background: cs.bg, color: "var(--foreground)" }}
                          >
                            {c.value}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {frame?.caption ?? "Enter an array to begin."}
        </div>
      </div>

      {/* Controls */}
      <PlayerControls player={player} />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--brand)" }} />
          Merging
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--accent)" }} />
          Comparing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--success)" }} />
          Placed / sorted
        </span>
      </div>
    </div>
  );
}
