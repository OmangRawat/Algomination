"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Trash2, Shuffle } from "lucide-react";
import { useFramePlayer } from "@/lib/engine/useFramePlayer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PlayerControls } from "./PlayerControls";

interface TreeNode {
  id: number;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

const MAX = 15;
const NODE = 44;
const GAP_X = 56;
const GAP_Y = 70;
const PAD = 28;

let idCounter = 0;
const newNode = (value: number): TreeNode => ({
  id: idCounter++,
  value,
  left: null,
  right: null,
});

/** Build a BST from a list of values (ignoring duplicates). */
function build(values: number[]): TreeNode | null {
  let root: TreeNode | null = null;
  for (const v of values) root = insertInto(root, v);
  return root;
}

function insertInto(root: TreeNode | null, value: number): TreeNode {
  if (!root) return newNode(value);
  let cur = root;
  while (true) {
    if (value === cur.value) return root; // no duplicates
    if (value < cur.value) {
      if (!cur.left) {
        cur.left = newNode(value);
        return root;
      }
      cur = cur.left;
    } else {
      if (!cur.right) {
        cur.right = newNode(value);
        return root;
      }
      cur = cur.right;
    }
  }
}

interface Placed {
  id: number;
  value: number;
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

/** Assign each node a column (in-order index) and row (depth) → pixel centers. */
function layout(root: TreeNode | null): {
  nodes: Placed[];
  edges: Edge[];
  width: number;
  height: number;
} {
  const nodes: Placed[] = [];
  const edges: Edge[] = [];
  const centerOf = new Map<number, { cx: number; cy: number }>();
  let col = 0;
  let maxDepth = 0;

  const visit = (node: TreeNode | null, depth: number) => {
    if (!node) return;
    visit(node.left, depth + 1);
    const cx = PAD + col * GAP_X + NODE / 2;
    const cy = PAD + depth * GAP_Y + NODE / 2;
    col += 1;
    maxDepth = Math.max(maxDepth, depth);
    centerOf.set(node.id, { cx, cy });
    nodes.push({ id: node.id, value: node.value, cx, cy });
    visit(node.right, depth + 1);
  };
  visit(root, 0);

  const linkEdges = (node: TreeNode | null) => {
    if (!node) return;
    const p = centerOf.get(node.id)!;
    for (const child of [node.left, node.right]) {
      if (child) {
        const c = centerOf.get(child.id)!;
        edges.push({
          key: `${node.id}-${child.id}`,
          x1: p.cx,
          y1: p.cy,
          x2: c.cx,
          y2: c.cy,
        });
        linkEdges(child);
      }
    }
  };
  linkEdges(root);

  const count = nodes.length;
  const width = PAD * 2 + Math.max(0, count - 1) * GAP_X + NODE;
  const height = PAD * 2 + maxDepth * GAP_Y + NODE;
  return { nodes, edges, width, height };
}

type Seq = { id: number; value: number }[];

function inorderIds(root: TreeNode | null): Seq {
  const out: Seq = [];
  const visit = (n: TreeNode | null) => {
    if (!n) return;
    visit(n.left);
    out.push({ id: n.id, value: n.value });
    visit(n.right);
  };
  visit(root);
  return out;
}

function preorderIds(root: TreeNode | null): Seq {
  const out: Seq = [];
  const visit = (n: TreeNode | null) => {
    if (!n) return;
    out.push({ id: n.id, value: n.value });
    visit(n.left);
    visit(n.right);
  };
  visit(root);
  return out;
}

function postorderIds(root: TreeNode | null): Seq {
  const out: Seq = [];
  const visit = (n: TreeNode | null) => {
    if (!n) return;
    visit(n.left);
    visit(n.right);
    out.push({ id: n.id, value: n.value });
  };
  visit(root);
  return out;
}

/** Breadth-first / level-order using a queue (no recursion). */
function levelOrderIds(root: TreeNode | null): Seq {
  const out: Seq = [];
  if (!root) return out;
  const queue: TreeNode[] = [root];
  while (queue.length) {
    const n = queue.shift()!;
    out.push({ id: n.id, value: n.value });
    if (n.left) queue.push(n.left);
    if (n.right) queue.push(n.right);
  }
  return out;
}

type TraversalKey = "level" | "pre" | "in" | "post";
const TRAVERSALS: Record<
  TraversalKey,
  {
    label: string;
    family: string;
    fn: (r: TreeNode | null) => Seq;
    rule: string;
    detail: string;
  }
> = {
  level: {
    label: "Level-order",
    family: "BFS",
    fn: levelOrderIds,
    rule: "Each level, top → bottom, left → right",
    detail:
      "Breadth-first search uses a queue: dequeue a node, visit it, then enqueue its left and right children. It explores the tree one depth level at a time, so the shallowest nodes are visited first — useful for level-by-level processing and shortest-path-style problems.",
  },
  pre: {
    label: "Pre-order",
    family: "DFS",
    fn: preorderIds,
    rule: "Node → Left → Right",
    detail:
      "Depth-first: process the current node before its subtrees, so the root always comes first. Pre-order is handy for copying or serializing a tree, and for producing a prefix (Polish) expression from an expression tree.",
  },
  in: {
    label: "In-order",
    family: "DFS",
    fn: inorderIds,
    rule: "Left → Node → Right",
    detail:
      "Depth-first: visit the left subtree, then the node, then the right subtree. On a binary search tree this yields values in ascending sorted order — the standard way to read a BST's contents in order.",
  },
  post: {
    label: "Post-order",
    family: "DFS",
    fn: postorderIds,
    rule: "Left → Right → Node",
    detail:
      "Depth-first: process both subtrees before the node itself. Because children are always handled before their parent, post-order is used to safely delete or free a tree, and to evaluate a postfix (Reverse Polish) expression.",
  },
};

const EMPTY_SET = new Set<number>();

interface TreeFrame {
  activeId: number | null;
  visited: number[];
  caption: string;
}

/** Turn a traversal order into playable frames (one node visited per frame). */
function traversalFrames(order: Seq, label: string, family: string): TreeFrame[] {
  const note =
    family === "BFS"
      ? "BFS visits the tree level by level using a queue."
      : "DFS dives down each branch using recursion (a stack).";
  const frames: TreeFrame[] = [
    { activeId: null, visited: [], caption: `${label} (${family}) — ${note}` },
  ];
  const seen: number[] = [];
  order.forEach((node, i) => {
    seen.push(node.id);
    const sofar = order
      .slice(0, i + 1)
      .map((n) => n.value)
      .join(" → ");
    frames.push({
      activeId: node.id,
      visited: [...seen],
      caption: `${label} (${family}): ${sofar}`,
    });
  });
  return frames;
}

export function TreeVisualizer({
  title,
  description,
  complexity,
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
}) {
  const tree = useRef<TreeNode | null>(build([50, 30, 70, 20, 40, 60, 80]));
  const [, force] = useReducer((x) => x + 1, 0);
  const [input, setInput] = useState("");
  const [caption, setCaption] = useState(
    "A binary search tree — every left child is smaller, every right child larger.",
  );
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [foundId, setFoundId] = useState<number | null>(null);
  const [activeTraversal, setActiveTraversal] = useState<TraversalKey | null>(
    null,
  );
  const [frames, setFrames] = useState<TreeFrame[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const player = useFramePlayer(frames);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  // Used by the interactive ops (insert/search/delete) — also exits any
  // traversal playback so the two animation modes never overlap.
  const resetMarks = () => {
    clearTimers();
    setActiveId(null);
    setFoundId(null);
    setFrames([]);
    setActiveTraversal(null);
  };

  const readValue = (): number | null => {
    const v = Number(input.trim());
    if (input.trim() === "" || !Number.isInteger(v)) {
      setError("Enter a whole number.");
      return null;
    }
    return v;
  };

  const count = () => inorderIds(tree.current).length;

  const insert = () => {
    resetMarks();
    const v = readValue();
    if (v === null) return;
    if (count() >= MAX) return setError(`Tree is full (max ${MAX} nodes).`);
    const before = count();
    tree.current = insertInto(tree.current, v);
    if (count() === before) {
      setError(null);
      setCaption(`${v} is already in the tree — no duplicates.`);
      return;
    }
    setError(null);
    setCaption(`Inserted ${v} into the tree.`);
    setInput("");
    force();
  };

  const search = () => {
    resetMarks();
    const v = readValue();
    if (v === null) return;
    setError(null);
    setInput("");

    const path: number[] = [];
    let cur = tree.current;
    let hit: number | null = null;
    while (cur) {
      path.push(cur.id);
      if (v === cur.value) {
        hit = cur.id;
        break;
      }
      cur = v < cur.value ? cur.left : cur.right;
    }

    path.forEach((id, i) => {
      const t = setTimeout(() => {
        setActiveId(id);
        const isLast = i === path.length - 1;
        if (isLast && hit !== null) {
          setFoundId(id);
          setActiveId(null);
          setCaption(`Found ${v} in the tree.`);
        } else if (isLast) {
          setActiveId(null);
          setCaption(`${v} is not in the tree.`);
        } else {
          setCaption(`Comparing ${v} against node…`);
        }
      }, i * 650);
      timers.current.push(t);
    });
    if (path.length === 0) setCaption("The tree is empty.");
  };

  const remove = () => {
    resetMarks();
    const v = readValue();
    if (v === null) return;
    setError(null);
    setInput("");
    const before = count();
    tree.current = deleteFrom(tree.current, v);
    if (count() === before) {
      setCaption(`${v} is not in the tree.`);
      return;
    }
    setCaption(`Deleted ${v} from the tree.`);
    force();
  };

  const runTraversal = (key: TraversalKey) => {
    clearTimers();
    setActiveId(null);
    setFoundId(null);
    setActiveTraversal(key);
    const { label, family, fn } = TRAVERSALS[key];
    const order = fn(tree.current);
    if (order.length === 0) {
      setFrames([]);
      setCaption("The tree is empty.");
      return;
    }
    setFrames(traversalFrames(order, label, family));
  };

  const clear = () => {
    resetMarks();
    tree.current = null;
    setError(null);
    setCaption("Tree cleared.");
    force();
  };

  const randomize = () => {
    resetMarks();
    const len = 6 + Math.floor(Math.random() * 4);
    const pool = new Set<number>();
    while (pool.size < len) pool.add(1 + Math.floor(Math.random() * 99));
    tree.current = build([...pool]);
    setError(null);
    setCaption("Generated a random tree.");
    force();
  };

  const { nodes, edges, width, height } = layout(tree.current);

  // Highlights come from the traversal player while one is loaded, otherwise
  // from the interactive search/insert state.
  const hasRun = frames.length > 0;
  const tf = player.frame;
  const dispActiveId = hasRun ? (tf?.activeId ?? null) : activeId;
  const dispFoundId = hasRun ? null : foundId;
  const dispVisited = hasRun ? new Set(tf?.visited ?? []) : EMPTY_SET;
  const dispCaption = hasRun ? (tf?.caption ?? "") : caption;

  const fillFor = (id: number) =>
    id === dispFoundId
      ? "color-mix(in srgb, var(--success) 28%, var(--surface-2))"
      : id === dispActiveId
        ? "color-mix(in srgb, var(--accent) 28%, var(--surface-2))"
        : dispVisited.has(id)
          ? "color-mix(in srgb, var(--brand) 24%, var(--surface-2))"
          : "var(--surface-2)";
  const borderFor = (id: number) =>
    id === dispFoundId
      ? "var(--success)"
      : id === dispActiveId
        ? "var(--accent)"
        : dispVisited.has(id)
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
              <Badge tone="brand">Avg {complexity.time}</Badge>
              <Badge tone="muted">Space {complexity.space}</Badge>
            </div>
          )}
        </div>
        {description && <p className="text-muted">{description}</p>}
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
            aria-label="Node value"
            className="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:w-28"
          />
          <Button onClick={insert}>Insert</Button>
          <Button variant="secondary" onClick={search}>
            <Search size={16} /> Search
          </Button>
          <Button variant="secondary" onClick={remove}>
            Delete
          </Button>
          <Button variant="ghost" onClick={clear}>
            <Trash2 size={16} /> Clear
          </Button>
          <Button variant="outline" onClick={randomize}>
            <Shuffle size={16} /> Random
          </Button>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}

        {/* Traversals */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted">Traverse:</span>
          {(Object.keys(TRAVERSALS) as TraversalKey[]).map((key) => (
            <Button
              key={key}
              size="sm"
              variant={activeTraversal === key ? "primary" : "outline"}
              onClick={() => runTraversal(key)}
            >
              {TRAVERSALS[key].label} ({TRAVERSALS[key].family})
            </Button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-2xl border border-border bg-surface/60 p-4">
        <div className="overflow-x-auto">
          <div
            className="relative mx-auto"
            style={{ width: Math.max(width, 280), height: Math.max(height, 160) }}
          >
            {nodes.length === 0 && (
              <p className="absolute inset-0 flex items-center justify-center text-sm text-muted">
                Tree is empty.
              </p>
            )}

            {/* Edges */}
            <svg
              className="absolute inset-0 h-full w-full"
              style={{ overflow: "visible" }}
            >
              {edges.map((e) => (
                <motion.line
                  key={e.key}
                  initial={false}
                  animate={{ x1: e.x1, y1: e.y1, x2: e.x2, y2: e.y2 }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  stroke="var(--border)"
                  strokeWidth={2}
                />
              ))}
            </svg>

            {/* Nodes */}
            <AnimatePresence>
              {nodes.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: n.cx - NODE / 2,
                    y: n.cy - NODE / 2,
                  }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="absolute left-0 top-0 flex items-center justify-center rounded-full border-2 text-sm font-semibold tabular-nums shadow-md"
                  style={{
                    width: NODE,
                    height: NODE,
                    background: fillFor(n.id),
                    borderColor: borderFor(n.id),
                    color: "var(--foreground)",
                  }}
                >
                  {n.value}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {dispCaption}
        </div>
      </div>

      {/* Playback controls (only while a traversal is loaded) */}
      {hasRun && <PlayerControls player={player} />}

      {/* Traversal explanation */}
      <AnimatePresence mode="wait">
        {activeTraversal && (
          <motion.div
            key={activeTraversal}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-border bg-surface/60 p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">
                {TRAVERSALS[activeTraversal].label} traversal
              </h3>
              <Badge tone="brand">{TRAVERSALS[activeTraversal].family}</Badge>
              <span className="rounded-md bg-surface-2 px-2 py-1 font-mono text-xs text-muted">
                {TRAVERSALS[activeTraversal].rule}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {TRAVERSALS[activeTraversal].detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          Visiting
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
          Traversed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--success)" }} />
          Found
        </span>
      </div>
    </div>
  );
}

/** Standard BST delete (leaf, one child, two children via in-order successor). */
function deleteFrom(root: TreeNode | null, value: number): TreeNode | null {
  if (!root) return null;
  if (value < root.value) {
    root.left = deleteFrom(root.left, value);
    return root;
  }
  if (value > root.value) {
    root.right = deleteFrom(root.right, value);
    return root;
  }
  // Found the node to delete.
  if (!root.left) return root.right;
  if (!root.right) return root.left;
  // Two children: copy the in-order successor's value, then delete it.
  let succ = root.right;
  while (succ.left) succ = succ.left;
  root.value = succ.value;
  root.right = deleteFrom(root.right, succ.value);
  return root;
}
