"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpFromLine, Eye, Trash2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface HeapItem {
  id: number;
  value: number;
}
type Mode = "min" | "max";

const MAX = 15;
const NODE = 44;
const PAD = 24;
const LEVEL_H = 70;
let idCounter = 0;

const makeItems = (values: number[]): HeapItem[] =>
  values.map((value) => ({ id: idCounter++, value }));

/** A single animation frame: a heap snapshot plus what to highlight. */
interface Frame {
  arr: HeapItem[];
  compare: number[];
  swap: number[];
  active: number[];
  caption: string;
}

export function HeapVisualizer({
  title,
  description,
  complexity,
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
}) {
  const [mode, setMode] = useState<Mode>("min");
  const [heap, setHeap] = useState<HeapItem[]>(() =>
    heapify(makeItems([5, 9, 3, 12, 7, 1]), "min"),
  );
  const [input, setInput] = useState("");
  const [caption, setCaption] = useState(
    "A binary heap: every parent is smaller than its children (min-heap). The root is always the minimum.",
  );
  const [error, setError] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [swapIds, setSwapIds] = useState<number[]>([]);
  const [activeIds, setActiveIds] = useState<number[]>([]);
  const [peekId, setPeekId] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const resetMarks = () => {
    clearTimers();
    setCompareIds([]);
    setSwapIds([]);
    setActiveIds([]);
    setPeekId(null);
  };

  /** Compare helper: is `a` higher priority than `b` for the current mode? */
  const prefers = (a: number, b: number) => (mode === "min" ? a < b : a > b);

  /** Play precomputed frames on a timer; commits each snapshot to state. */
  const play = (frames: Frame[]) => {
    resetMarks();
    frames.forEach((f, i) => {
      const t = setTimeout(() => {
        setHeap(f.arr);
        setCompareIds(f.compare);
        setSwapIds(f.swap);
        setActiveIds(f.active);
        setCaption(f.caption);
        if (i === frames.length - 1) {
          const done = setTimeout(() => resetMarks(), 700);
          timers.current.push(done);
        }
      }, i * 750);
      timers.current.push(t);
    });
  };

  const snap = (
    arr: HeapItem[],
    extra: Partial<Omit<Frame, "arr">>,
  ): Frame => ({
    arr: arr.map((it) => ({ ...it })),
    compare: [],
    swap: [],
    active: [],
    caption: "",
    ...extra,
  });

  const readValue = (): number | null => {
    const v = Number(input.trim());
    if (input.trim() === "" || !Number.isInteger(v)) {
      setError("Enter a whole number.");
      return null;
    }
    return v;
  };

  const insert = () => {
    resetMarks();
    const v = readValue();
    if (v === null) return;
    if (heap.length >= MAX) return setError(`Heap is full (max ${MAX}).`);
    setError(null);
    setInput("");

    const arr = heap.map((it) => ({ ...it }));
    arr.push({ id: idCounter++, value: v });
    const frames: Frame[] = [];
    let i = arr.length - 1;
    frames.push(
      snap(arr, { active: [arr[i].id], caption: `Insert ${v} at the end, then sift it up.` }),
    );
    while (i > 0) {
      const parent = (i - 1) >> 1;
      frames.push(
        snap(arr, {
          compare: [arr[i].id, arr[parent].id],
          caption: `Compare ${arr[i].value} with parent ${arr[parent].value}.`,
        }),
      );
      if (prefers(arr[i].value, arr[parent].value)) {
        [arr[i], arr[parent]] = [arr[parent], arr[i]];
        frames.push(
          snap(arr, {
            swap: [arr[i].id, arr[parent].id],
            caption: `Swap up — ${arr[parent].value} moves toward the root.`,
          }),
        );
        i = parent;
      } else {
        frames.push(
          snap(arr, { active: [arr[i].id], caption: `Heap order restored.` }),
        );
        break;
      }
    }
    if (i === 0) {
      frames.push(snap(arr, { active: [arr[0].id], caption: `${v} reached the root.` }));
    }
    play(frames);
  };

  const extract = () => {
    resetMarks();
    if (heap.length === 0) return setError("Heap is empty.");
    setError(null);

    const arr = heap.map((it) => ({ ...it }));
    const rootVal = arr[0].value;
    const frames: Frame[] = [];
    frames.push(
      snap(arr, {
        active: [arr[0].id],
        caption: `Extract the ${mode === "min" ? "minimum" : "maximum"} (${rootVal}) from the root.`,
      }),
    );
    const last = arr.pop()!;
    if (arr.length > 0) {
      arr[0] = last;
      frames.push(
        snap(arr, {
          active: [arr[0].id],
          caption: `Move last element ${last.value} to the root, then sift it down.`,
        }),
      );
      let i = 0;
      const n = arr.length;
      while (true) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let best = i;
        if (l < n) {
          frames.push(
            snap(arr, {
              compare: [arr[best].id, arr[l].id],
              caption: `Compare with left child ${arr[l].value}.`,
            }),
          );
          if (prefers(arr[l].value, arr[best].value)) best = l;
        }
        if (r < n) {
          frames.push(
            snap(arr, {
              compare: [arr[best].id, arr[r].id],
              caption: `Compare with right child ${arr[r].value}.`,
            }),
          );
          if (prefers(arr[r].value, arr[best].value)) best = r;
        }
        if (best === i) {
          frames.push(
            snap(arr, { active: [arr[i].id], caption: `Heap order restored.` }),
          );
          break;
        }
        [arr[i], arr[best]] = [arr[best], arr[i]];
        frames.push(
          snap(arr, {
            swap: [arr[i].id, arr[best].id],
            caption: `Swap down with the higher-priority child.`,
          }),
        );
        i = best;
      }
    }
    frames.push(snap(arr, { caption: `Removed ${rootVal}.` }));
    play(frames);
  };

  const peek = () => {
    resetMarks();
    if (heap.length === 0) return setError("Heap is empty.");
    setError(null);
    setPeekId(heap[0].id);
    setCaption(
      `Peek: the root holds the ${mode === "min" ? "minimum" : "maximum"} (${heap[0].value}).`,
    );
    const t = setTimeout(() => setPeekId(null), 1100);
    timers.current.push(t);
  };

  const switchMode = (next: Mode) => {
    if (next === mode) return;
    resetMarks();
    setMode(next);
    setHeap((h) => heapify(h.map((it) => ({ ...it })), next));
    setCaption(
      next === "min"
        ? "Min-heap: every parent ≤ its children, so the root is the minimum."
        : "Max-heap: every parent ≥ its children, so the root is the maximum.",
    );
  };

  const clear = () => {
    resetMarks();
    setHeap([]);
    setError(null);
    setCaption("Heap cleared.");
  };

  const randomize = () => {
    resetMarks();
    const len = 5 + Math.floor(Math.random() * 5);
    const vals = Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 99));
    setHeap(heapify(makeItems(vals), mode));
    setError(null);
    setCaption("Generated a random heap.");
  };

  const positions = heapLayout(heap.length);
  const width = positions.width;
  const height = positions.height;

  const fillFor = (id: number) =>
    peekId === id || swapIds.includes(id)
      ? "color-mix(in srgb, var(--warning) 26%, var(--surface-2))"
      : compareIds.includes(id)
        ? "color-mix(in srgb, var(--accent) 26%, var(--surface-2))"
        : activeIds.includes(id)
          ? "color-mix(in srgb, var(--brand) 26%, var(--surface-2))"
          : "var(--surface-2)";
  const borderFor = (id: number, isRoot: boolean) =>
    peekId === id
      ? "var(--accent)"
      : swapIds.includes(id)
        ? "var(--warning)"
        : compareIds.includes(id)
          ? "var(--accent)"
          : activeIds.includes(id)
            ? "var(--brand)"
            : isRoot
              ? "var(--brand)"
              : "var(--border)";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {complexity && (
            <div className="flex gap-2">
              <Badge tone="brand">Push/Pop {complexity.time}</Badge>
              <Badge tone="muted">Space {complexity.space}</Badge>
            </div>
          )}
        </div>
        {description && <p className="text-muted">{description}</p>}
      </div>

      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted">Type:</span>
        <div className="flex items-center gap-1 rounded-lg bg-surface-2 p-1">
          {(["min", "max"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors",
                mode === m
                  ? "bg-brand text-white"
                  : "text-muted hover:text-foreground",
              )}
            >
              {m}-heap
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && insert()}
            inputMode="numeric"
            placeholder="value"
            aria-label="Value to insert"
            className="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:w-28"
          />
          <Button onClick={insert}>Insert</Button>
          <Button variant="secondary" onClick={extract}>
            <ArrowUpFromLine size={16} /> Extract {mode}
          </Button>
          <Button variant="secondary" onClick={peek}>
            <Eye size={16} /> Peek
          </Button>
          <Button variant="ghost" onClick={clear}>
            <Trash2 size={16} /> Clear
          </Button>
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
            style={{ width: Math.max(width, 280), height: Math.max(height, 120) }}
          >
            {heap.length === 0 && (
              <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">
                Heap is empty.
              </p>
            )}

            {/* Edges */}
            <svg className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
              {heap.map((_, i) => {
                const children = [2 * i + 1, 2 * i + 2].filter((c) => c < heap.length);
                return children.map((c) => (
                  <motion.line
                    key={`${heap[i].id}-${heap[c].id}`}
                    initial={false}
                    animate={{
                      x1: positions.cx[i],
                      y1: positions.cy[i],
                      x2: positions.cx[c],
                      y2: positions.cy[c],
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 32 }}
                    stroke="var(--border)"
                    strokeWidth={2}
                  />
                ));
              })}
            </svg>

            {/* Nodes */}
            <AnimatePresence>
              {heap.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: positions.cx[i] - NODE / 2,
                    y: positions.cy[i] - NODE / 2,
                  }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="absolute left-0 top-0 flex items-center justify-center rounded-full border-2 text-sm font-semibold tabular-nums shadow-md"
                  style={{
                    width: NODE,
                    height: NODE,
                    background: fillFor(item.id),
                    borderColor: borderFor(item.id, i === 0),
                    color: "var(--foreground)",
                  }}
                >
                  {item.value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Array backing */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Array backing
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1">
            <AnimatePresence mode="popLayout" initial={false}>
              {heap.length === 0 ? (
                <span className="text-xs text-muted/60">empty</span>
              ) : (
                heap.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded border text-xs font-semibold tabular-nums"
                      style={{
                        background: fillFor(item.id),
                        borderColor: borderFor(item.id, i === 0),
                        color: "var(--foreground)",
                      }}
                    >
                      {item.value}
                    </div>
                    <span className="text-[10px] text-muted/60">{i}</span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-3 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {caption}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
          Root / active
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          Comparing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--warning)" }} />
          Swapping
        </span>
      </div>
    </div>
  );
}

/** Floyd build-heap: rearrange items in place to satisfy the heap property. */
function heapify(arr: HeapItem[], mode: Mode): HeapItem[] {
  const prefers = (a: number, b: number) => (mode === "min" ? a < b : a > b);
  const n = arr.length;
  const siftDown = (start: number) => {
    let i = start;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let best = i;
      if (l < n && prefers(arr[l].value, arr[best].value)) best = l;
      if (r < n && prefers(arr[r].value, arr[best].value)) best = r;
      if (best === i) return;
      [arr[i], arr[best]] = [arr[best], arr[i]];
      i = best;
    }
  };
  for (let i = (n >> 1) - 1; i >= 0; i--) siftDown(i);
  return arr;
}

/** Positions for a complete binary tree laid out by array index. */
function heapLayout(n: number): {
  cx: number[];
  cy: number[];
  width: number;
  height: number;
} {
  const cx: number[] = [];
  const cy: number[] = [];
  let maxDepth = 0;
  for (let i = 0; i < n; i++) {
    const depth = Math.floor(Math.log2(i + 1));
    maxDepth = Math.max(maxDepth, depth);
  }
  const levelWidth = Math.pow(2, maxDepth);
  const span = Math.max(levelWidth * (NODE + 12), 240);
  for (let i = 0; i < n; i++) {
    const depth = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (Math.pow(2, depth) - 1);
    const count = Math.pow(2, depth);
    cx[i] = PAD + ((posInLevel + 0.5) / count) * span;
    cy[i] = PAD + depth * LEVEL_H + NODE / 2;
  }
  return {
    cx,
    cy,
    width: span + PAD * 2,
    height: PAD * 2 + maxDepth * LEVEL_H + NODE,
  };
}
