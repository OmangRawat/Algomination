"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link2, Search, Shuffle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const N = 8;
const NODE = 46;
const GAP_X = 60;
const GAP_Y = 72;
const PAD = 28;
const PALETTE = ["--brand", "--accent", "--success", "--warning", "--brand-2", "--danger"];

type Kind = "path" | "active" | "found";
type Hl = Record<number, Kind>;
interface Frame {
  parent: number[];
  hl: Hl;
  caption: string;
}

const clone = (a: number[]) => [...a];

function rootOf(parent: number[], x: number): number {
  let i = x;
  while (parent[i] !== i) i = parent[i];
  return i;
}
function pathToRoot(parent: number[], x: number): number[] {
  const path = [x];
  let i = x;
  while (parent[i] !== i) {
    i = parent[i];
    path.push(i);
  }
  return path;
}

export function UnionFindVisualizer({
  title,
  description,
  complexity,
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
}) {
  const parentRef = useRef<number[]>(Array.from({ length: N }, (_, i) => i));
  const rankRef = useRef<number[]>(Array(N).fill(0));
  const [view, setView] = useState<Frame>({
    parent: clone(parentRef.current),
    hl: {},
    caption: `${N} separate elements. Union to merge sets; Find to locate a set's root.`,
  });
  const [a, setA] = useState("0");
  const [b, setB] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const play = (frames: Frame[]) => {
    clearTimers();
    frames.forEach((f, i) => {
      const t = setTimeout(() => {
        setView(f);
        if (i === frames.length - 1) {
          const c = setTimeout(() => setView((v) => ({ ...v, hl: {} })), 1000);
          timers.current.push(c);
        }
      }, i * 800);
      timers.current.push(t);
    });
  };

  const readEl = (s: string, label: string): number | null => {
    const v = Number(s.trim());
    if (!Number.isInteger(v) || v < 0 || v >= N) {
      setError(`${label} must be an element 0–${N - 1}.`);
      return null;
    }
    return v;
  };

  /** Frames that walk x up to its root, accumulating the path highlight. */
  const walkFrames = (parent: number[], x: number, verb: string): Frame[] => {
    const path = pathToRoot(parent, x);
    return path.map((id, i) => {
      const hl: Hl = {};
      for (let k = 0; k < i; k++) hl[path[k]] = "path";
      hl[id] = i === path.length - 1 ? "found" : "active";
      const caption =
        i === path.length - 1
          ? `${verb} ${x}: root is ${id}.`
          : `${verb} ${x}: ${id} → ${parent[id]}…`;
      return { parent: clone(parent), hl, caption };
    });
  };

  const find = () => {
    clearTimers();
    const x = readEl(a, "Element");
    if (x === null) return;
    setError(null);

    const parent = clone(parentRef.current);
    const frames = walkFrames(parent, x, "Find");
    const r = rootOf(parent, x);
    const path = pathToRoot(parent, x);
    // Path compression: point every node on the path straight at the root.
    if (path.length > 2) {
      const compressed = clone(parent);
      for (const id of path) compressed[id] = r;
      parentRef.current = compressed;
      const hl: Hl = {};
      for (const id of path) hl[id] = "path";
      hl[r] = "found";
      frames.push({
        parent: compressed,
        hl,
        caption: `Path compression: point every node on the path straight at root ${r}.`,
      });
    }
    play(frames);
  };

  const union = () => {
    clearTimers();
    const x = readEl(a, "First element");
    const y = readEl(b, "Second element");
    if (x === null || y === null) return;
    setError(null);

    const parent = clone(parentRef.current);
    const rank = clone(rankRef.current);
    const frames: Frame[] = [
      ...walkFrames(parent, x, "Find"),
      ...walkFrames(parent, y, "Find"),
    ];
    const rx = rootOf(parent, x);
    const ry = rootOf(parent, y);

    if (rx === ry) {
      frames.push({
        parent: clone(parent),
        hl: { [rx]: "found" },
        caption: `${x} and ${y} are already in the same set (root ${rx}).`,
      });
      play(frames);
      return;
    }

    let child = rx;
    let par = ry;
    if (rank[rx] > rank[ry]) {
      child = ry;
      par = rx;
    } else if (rank[rx] === rank[ry]) {
      rank[par] += 1; // tie → attach rx under ry and bump ry's rank
    }
    const next = clone(parent);
    next[child] = par;
    parentRef.current = next;
    rankRef.current = rank;
    frames.push({
      parent: next,
      hl: { [child]: "active", [par]: "found" },
      caption: `Union by rank: attach root ${child} under root ${par}.`,
    });
    play(frames);
  };

  const connected = () => {
    clearTimers();
    const x = readEl(a, "First element");
    const y = readEl(b, "Second element");
    if (x === null || y === null) return;
    setError(null);

    const parent = clone(parentRef.current);
    const frames: Frame[] = [
      ...walkFrames(parent, x, "Find"),
      ...walkFrames(parent, y, "Find"),
    ];
    const same = rootOf(parent, x) === rootOf(parent, y);
    frames.push({
      parent: clone(parent),
      hl: same
        ? { [rootOf(parent, x)]: "found" }
        : { [rootOf(parent, x)]: "active", [rootOf(parent, y)]: "active" },
      caption: same
        ? `${x} and ${y} are connected — same root.`
        : `${x} and ${y} are in different sets — not connected.`,
    });
    play(frames);
  };

  const reset = () => {
    clearTimers();
    parentRef.current = Array.from({ length: N }, (_, i) => i);
    rankRef.current = Array(N).fill(0);
    setError(null);
    setView({
      parent: clone(parentRef.current),
      hl: {},
      caption: `Reset — ${N} separate singleton sets.`,
    });
  };

  const randomize = () => {
    clearTimers();
    const parent = Array.from({ length: N }, (_, i) => i);
    const rank = Array(N).fill(0);
    const uni = (p: number[], rk: number[], x: number, y: number) => {
      const rx = rootOf(p, x);
      const ry = rootOf(p, y);
      if (rx === ry) return;
      if (rk[rx] < rk[ry]) p[rx] = ry;
      else if (rk[rx] > rk[ry]) p[ry] = rx;
      else {
        p[ry] = rx;
        rk[rx]++;
      }
    };
    const ops = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < ops; i++) {
      uni(parent, rank, Math.floor(Math.random() * N), Math.floor(Math.random() * N));
    }
    parentRef.current = parent;
    rankRef.current = rank;
    setError(null);
    setView({ parent: clone(parent), hl: {}, caption: "Generated some random unions." });
  };

  const { placed, edges, width, height } = forestLayout(view.parent);
  const hl = view.hl;
  const colorVar = (root: number) => `var(${PALETTE[root % PALETTE.length]})`;

  const fillFor = (id: number, root: number) => {
    switch (hl[id]) {
      case "found":
        return "color-mix(in srgb, var(--success) 30%, var(--surface-2))";
      case "active":
        return "color-mix(in srgb, var(--brand) 28%, var(--surface-2))";
      case "path":
        return "color-mix(in srgb, var(--accent) 24%, var(--surface-2))";
      default:
        return `color-mix(in srgb, ${colorVar(root)} 16%, var(--surface-2))`;
    }
  };
  const borderFor = (id: number, root: number) => {
    switch (hl[id]) {
      case "found":
        return "var(--success)";
      case "active":
        return "var(--brand)";
      case "path":
        return "var(--accent)";
      default:
        return colorVar(root);
    }
  };

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
              <Badge tone="brand">Find/Union {complexity.time}</Badge>
              <Badge tone="muted">Space {complexity.space}</Badge>
            </div>
          )}
        </div>
        {description && <p className="text-muted">{description}</p>}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex items-center gap-2">
            <input
              value={a}
              onChange={(e) => setA(e.target.value)}
              inputMode="numeric"
              aria-label="First element"
              className="h-11 w-16 rounded-xl border border-border bg-surface-2 px-3 text-center text-sm text-foreground focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            />
            <input
              value={b}
              onChange={(e) => setB(e.target.value)}
              inputMode="numeric"
              aria-label="Second element"
              className="h-11 w-16 rounded-xl border border-border bg-surface-2 px-3 text-center text-sm text-foreground focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            />
          </div>
          <Button onClick={union}>
            <Link2 size={16} /> Union(a, b)
          </Button>
          <Button variant="secondary" onClick={connected}>
            Connected?
          </Button>
          <Button variant="secondary" onClick={find}>
            <Search size={16} /> Find(a)
          </Button>
          <Button variant="ghost" onClick={reset}>
            <RotateCcw size={16} /> Reset
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
            style={{ width: Math.max(width, 280), height: Math.max(height, 130) }}
          >
            {/* Edges (child → parent) */}
            <svg className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
              {edges.map((e) => (
                <motion.line
                  key={e.key}
                  initial={false}
                  animate={{ x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  stroke="var(--border)"
                  strokeWidth={2}
                />
              ))}
            </svg>

            {/* Nodes */}
            {placed.map((p) => (
              <motion.div
                key={p.id}
                initial={false}
                animate={{ x: p.cx - NODE / 2, y: p.cy - NODE / 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="absolute left-0 top-0 flex items-center justify-center rounded-full border-2 text-sm font-semibold tabular-nums shadow-md"
                style={{
                  width: NODE,
                  height: NODE,
                  background: fillFor(p.id, p.root),
                  borderColor: borderFor(p.id, p.root),
                  color: "var(--foreground)",
                }}
              >
                {p.id}
                {p.isRoot && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-muted">
                    root
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Caption */}
        <div className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {view.caption}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          On path
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--success)" }} />
          Root / result
        </span>
        <span className="text-muted/70">Each set is outlined in its own colour.</span>
      </div>
    </div>
  );
}

interface Placed {
  id: number;
  root: number;
  isRoot: boolean;
  cx: number;
  cy: number;
}
interface Edge {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Lay out the parent[] forest: each set is a tree, placed side by side. */
function forestLayout(parent: number[]): {
  placed: Placed[];
  edges: Edge[];
  width: number;
  height: number;
} {
  const n = parent.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  const roots: number[] = [];
  for (let i = 0; i < n; i++) {
    if (parent[i] === i) roots.push(i);
    else children[parent[i]].push(i);
  }
  children.forEach((c) => c.sort((a, b) => a - b));

  const placed: Placed[] = [];
  const pos = new Map<number, { cx: number; cy: number }>();
  let colBase = 0;
  let maxCx = 0;
  let maxCy = 0;

  for (const root of roots) {
    let leafCol = 0;
    const assign = (i: number, depth: number): number => {
      const kids = children[i];
      let x: number;
      if (kids.length === 0) {
        x = leafCol++;
      } else {
        const xs = kids.map((k) => assign(k, depth + 1));
        x = (xs[0] + xs[xs.length - 1]) / 2;
      }
      const cx = PAD + (colBase + x) * GAP_X + NODE / 2;
      const cy = PAD + depth * GAP_Y + NODE / 2;
      pos.set(i, { cx, cy });
      maxCx = Math.max(maxCx, cx);
      maxCy = Math.max(maxCy, cy);
      placed.push({ id: i, root, isRoot: i === root, cx, cy });
      return x;
    };
    assign(root, 0);
    colBase += Math.max(leafCol, 1) + 1; // gap between trees
  }

  const edges: Edge[] = [];
  for (let i = 0; i < n; i++) {
    if (parent[i] !== i) {
      const c = pos.get(i)!;
      const p = pos.get(parent[i])!;
      edges.push({ key: `${i}-${parent[i]}`, x1: c.cx, y1: c.cy, x2: p.cx, y2: p.cy });
    }
  }

  return {
    placed,
    edges,
    width: maxCx + NODE / 2 + PAD,
    height: maxCy + NODE / 2 + PAD,
  };
}
