"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Shuffle, RotateCcw } from "lucide-react";
import { useFramePlayer } from "@/lib/engine/useFramePlayer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PlayerControls } from "./PlayerControls";

interface GNode {
  id: number;
  x: number;
  y: number;
}
interface Graph {
  nodes: GNode[];
  adj: number[][];
}

const VIEW_W = 560;
const VIEW_H = 380;
const R = 20;
const label = (id: number) => String.fromCharCode(65 + id);

/** A hand-laid default graph that looks tidy. */
function defaultGraph(): Graph {
  const nodes: GNode[] = [
    { id: 0, x: 90, y: 90 },
    { id: 1, x: 270, y: 60 },
    { id: 2, x: 460, y: 100 },
    { id: 3, x: 130, y: 240 },
    { id: 4, x: 320, y: 210 },
    { id: 5, x: 490, y: 270 },
    { id: 6, x: 250, y: 340 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 3],
    [1, 2],
    [1, 4],
    [2, 5],
    [3, 4],
    [3, 6],
    [4, 6],
    [5, 6],
  ];
  return toGraph(nodes, edges);
}

function toGraph(nodes: GNode[], edges: [number, number][]): Graph {
  const adj: number[][] = nodes.map(() => []);
  for (const [a, b] of edges) {
    adj[a].push(b);
    adj[b].push(a);
  }
  adj.forEach((list) => list.sort((x, y) => x - y));
  return { nodes, adj };
}

function randomGraph(): Graph {
  const n = 6 + Math.floor(Math.random() * 2); // 6–7 nodes
  const nodes: GNode[] = [];
  const minDist = 110;
  let guard = 0;
  while (nodes.length < n && guard++ < 500) {
    const x = 70 + Math.random() * (VIEW_W - 140);
    const y = 60 + Math.random() * (VIEW_H - 120);
    if (nodes.every((p) => Math.hypot(p.x - x, p.y - y) > minDist)) {
      nodes.push({ id: nodes.length, x, y });
    }
  }
  // Spanning tree so the graph is always connected.
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  const addEdge = (a: number, b: number) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (a !== b && !edgeSet.has(k)) {
      edgeSet.add(k);
      edges.push([a, b]);
    }
  };
  for (let i = 1; i < nodes.length; i++) {
    addEdge(i, Math.floor(Math.random() * i));
  }
  // A few extra edges for branching.
  const extra = 2 + Math.floor(Math.random() * 2);
  for (let i = 0; i < extra; i++) {
    addEdge(
      Math.floor(Math.random() * nodes.length),
      Math.floor(Math.random() * nodes.length),
    );
  }
  return toGraph(nodes, edges);
}

interface Frame {
  active: number | null;
  visited: number[];
  frontier: number[];
  caption: string;
}

function bfsFrames(g: Graph, start: number): Frame[] {
  const frames: Frame[] = [];
  const seen = new Set<number>([start]);
  const queue = [start];
  const order: number[] = [];
  frames.push({
    active: null,
    visited: [],
    frontier: [...queue],
    caption: `Start BFS at ${label(start)} — enqueue it.`,
  });
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    const added: number[] = [];
    for (const nb of g.adj[node]) {
      if (!seen.has(nb)) {
        seen.add(nb);
        queue.push(nb);
        added.push(nb);
      }
    }
    frames.push({
      active: node,
      visited: [...order],
      frontier: [...queue],
      caption:
        `Dequeue ${label(node)} and visit it.` +
        (added.length
          ? ` Enqueue neighbours ${added.map(label).join(", ")}.`
          : " No new neighbours."),
    });
  }
  frames.push({
    active: null,
    visited: [...order],
    frontier: [],
    caption: `BFS complete: ${order.map(label).join(" → ")}`,
  });
  return frames;
}

function dfsFrames(g: Graph, start: number): Frame[] {
  const frames: Frame[] = [];
  const seen = new Set<number>();
  const stack = [start];
  const order: number[] = [];
  frames.push({
    active: null,
    visited: [],
    frontier: [...stack],
    caption: `Start DFS at ${label(start)} — push it onto the stack.`,
  });
  while (stack.length) {
    const node = stack.pop()!;
    if (seen.has(node)) continue;
    seen.add(node);
    order.push(node);
    const added: number[] = [];
    // Push neighbours high→low so the smallest is explored first.
    for (const nb of [...g.adj[node]].sort((a, b) => b - a)) {
      if (!seen.has(nb)) {
        stack.push(nb);
        added.push(nb);
      }
    }
    frames.push({
      active: node,
      visited: [...order],
      frontier: [...stack],
      caption:
        `Pop ${label(node)} and visit it.` +
        (added.length
          ? ` Push neighbours ${added.reverse().map(label).join(", ")}.`
          : " No new neighbours."),
    });
  }
  frames.push({
    active: null,
    visited: [...order],
    frontier: [],
    caption: `DFS complete: ${order.map(label).join(" → ")}`,
  });
  return frames;
}

export function GraphVisualizer({
  title,
  description,
  complexity,
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
}) {
  const [graph, setGraph] = useState<Graph>(() => defaultGraph());
  const [start, setStart] = useState(0);
  const [mode, setMode] = useState<"bfs" | "dfs" | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [idleCaption, setIdleCaption] = useState(
    "Pick a start node, then run BFS (queue) or DFS (stack) to watch the frontier expand.",
  );

  const player = useFramePlayer(frames);

  // Auto-play as soon as a traversal is generated.
  useEffect(() => {
    if (frames.length) player.play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames]);

  const run = (which: "bfs" | "dfs") => {
    setMode(which);
    setFrames(
      which === "bfs" ? bfsFrames(graph, start) : dfsFrames(graph, start),
    );
  };

  const reset = () => {
    setFrames([]);
    setMode(null);
    setIdleCaption("Pick a start node, then run BFS or DFS.");
  };

  const randomize = () => {
    setFrames([]);
    setMode(null);
    setGraph(randomGraph());
    setStart(0);
    setIdleCaption("New random graph — pick a start node and run a traversal.");
  };

  const pickStart = (id: number) => {
    setFrames([]);
    setMode(null);
    setStart(id);
    setIdleCaption(`Start node set to ${label(id)}.`);
  };

  const frame = player.frame ?? null;
  const hasRun = frames.length > 0;
  const caption = hasRun ? (frame?.caption ?? "") : idleCaption;
  const visitedSet = new Set(frame?.visited ?? []);
  const activeId = frame?.active ?? null;
  const frontier = frame?.frontier ?? [];

  const nodeFill = (id: number) =>
    id === activeId
      ? "color-mix(in srgb, var(--accent) 30%, var(--surface-2))"
      : visitedSet.has(id)
        ? "color-mix(in srgb, var(--brand) 28%, var(--surface-2))"
        : "var(--surface-2)";
  const nodeStroke = (id: number) =>
    id === activeId
      ? "var(--accent)"
      : visitedSet.has(id)
        ? "var(--brand)"
        : id === start
          ? "var(--success)"
          : "var(--border)";

  // Edges drawn once (a < b).
  const drawnEdges: [number, number][] = [];
  graph.adj.forEach((list, a) =>
    list.forEach((b) => {
      if (a < b) drawnEdges.push([a, b]);
    }),
  );

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
              <Badge tone="brand">Time {complexity.time}</Badge>
              <Badge tone="muted">Space {complexity.space}</Badge>
            </div>
          )}
        </div>
        {description && <p className="text-muted">{description}</p>}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button onClick={() => run("bfs")}>
          <Play size={16} /> Run BFS
        </Button>
        <Button variant="secondary" onClick={() => run("dfs")}>
          <Play size={16} /> Run DFS
        </Button>
        <Button variant="ghost" onClick={reset}>
          <RotateCcw size={16} /> Reset
        </Button>
        <Button variant="outline" onClick={randomize}>
          <Shuffle size={16} /> Random graph
        </Button>
        <span className="flex items-center text-sm text-muted">
          Start: <span className="ml-1 font-semibold text-foreground">{label(start)}</span>
          <span className="ml-2 hidden sm:inline">(click a node to change)</span>
        </span>
      </div>

      {/* Canvas */}
      <div className="rounded-2xl border border-border bg-surface/60 p-4">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-auto w-full"
          style={{ maxHeight: 420 }}
        >
          {drawnEdges.map(([a, b]) => {
            const na = graph.nodes[a];
            const nb = graph.nodes[b];
            const onPath = visitedSet.has(a) && visitedSet.has(b);
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={onPath ? "var(--brand)" : "var(--border)"}
                strokeWidth={onPath ? 3 : 2}
              />
            );
          })}
          {graph.nodes.map((n) => (
            <g
              key={n.id}
              onClick={() => pickStart(n.id)}
              style={{ cursor: "pointer" }}
            >
              <motion.circle
                cx={n.x}
                cy={n.y}
                r={R}
                initial={false}
                animate={{
                  fill: nodeFill(n.id),
                  stroke: nodeStroke(n.id),
                  scale: n.id === activeId ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                strokeWidth={3}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
              <text
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="select-none text-sm font-semibold"
                fill="var(--foreground)"
              >
                {label(n.id)}
              </text>
            </g>
          ))}
        </svg>

        {/* Frontier (queue / stack) */}
        <div className="mt-3 flex min-h-9 flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            {mode === "dfs" ? "Stack" : "Queue"}
          </span>
          {frontier.length === 0 ? (
            <span className="text-xs text-muted/60">empty</span>
          ) : (
            frontier.map((id, i) => (
              <span
                key={`${id}-${i}`}
                className="flex h-7 min-w-7 items-center justify-center rounded-md border border-border bg-surface-2 px-1.5 text-xs font-semibold text-foreground"
              >
                {label(id)}
              </span>
            ))
          )}
          {mode === "dfs" && frontier.length > 0 && (
            <span className="text-[10px] text-muted">← top</span>
          )}
        </div>

        {/* Caption */}
        <div className="mt-3 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {caption}
        </div>
      </div>

      {/* Playback controls (only once a traversal has been generated) */}
      {hasRun && <PlayerControls player={player} />}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--success)" }} />
          Start
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          Visiting
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
          Visited
        </span>
      </div>
    </div>
  );
}
