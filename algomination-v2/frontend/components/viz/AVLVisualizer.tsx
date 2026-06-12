"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Trash2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface AvlNode {
  id: number;
  value: number;
  left: AvlNode | null;
  right: AvlNode | null;
}

const MAX = 15;
const NODE = 44;
const GAP_X = 58;
const GAP_Y = 74;
const PAD = 30;
let idCounter = 0;

const newNode = (value: number): AvlNode => ({
  id: idCounter++,
  value,
  left: null,
  right: null,
});

const cloneTree = (n: AvlNode | null): AvlNode | null =>
  n ? { id: n.id, value: n.value, left: cloneTree(n.left), right: cloneTree(n.right) } : null;

const nodeHeight = (n: AvlNode | null): number =>
  n ? 1 + Math.max(nodeHeight(n.left), nodeHeight(n.right)) : 0;
const bf = (n: AvlNode | null): number =>
  n ? nodeHeight(n.left) - nodeHeight(n.right) : 0;

function rotateRight(z: AvlNode): AvlNode {
  const y = z.left!;
  z.left = y.right;
  y.right = z;
  return y;
}
function rotateLeft(z: AvlNode): AvlNode {
  const y = z.right!;
  z.right = y.left;
  y.left = z;
  return y;
}

function caseOf(z: AvlNode): string {
  const b = bf(z);
  if (b > 1) return bf(z.left) >= 0 ? "LL — right rotation" : "LR — left-right rotation";
  return bf(z.right) <= 0 ? "RR — left rotation" : "RL — right-left rotation";
}
function rotateCase(z: AvlNode): AvlNode {
  const b = bf(z);
  if (b > 1) {
    if (bf(z.left) < 0) z.left = rotateLeft(z.left!);
    return rotateRight(z);
  }
  if (bf(z.right) > 0) z.right = rotateRight(z.right!);
  return rotateLeft(z);
}

/** Deepest node violating the AVL balance property, or null. */
function findUnbalanced(root: AvlNode | null): AvlNode | null {
  if (!root) return null;
  return (
    findUnbalanced(root.left) ??
    findUnbalanced(root.right) ??
    (Math.abs(bf(root)) > 1 ? root : null)
  );
}

/** Replace the subtree whose root id is `targetId` with `sub`. */
function replaceSubtree(
  root: AvlNode | null,
  targetId: number,
  sub: AvlNode,
): AvlNode | null {
  if (!root) return root;
  if (root.id === targetId) return sub;
  root.left = replaceSubtree(root.left, targetId, sub);
  root.right = replaceSubtree(root.right, targetId, sub);
  return root;
}

function bstInsert(
  root: AvlNode | null,
  v: number,
): { root: AvlNode; id: number; existed: boolean } {
  if (!root) {
    const n = newNode(v);
    return { root: n, id: n.id, existed: false };
  }
  let cur: AvlNode = root;
  while (true) {
    if (v === cur.value) return { root, id: cur.id, existed: true };
    if (v < cur.value) {
      if (!cur.left) {
        cur.left = newNode(v);
        return { root, id: cur.left.id, existed: false };
      }
      cur = cur.left;
    } else {
      if (!cur.right) {
        cur.right = newNode(v);
        return { root, id: cur.right.id, existed: false };
      }
      cur = cur.right;
    }
  }
}

function bstDelete(
  root: AvlNode | null,
  v: number,
): { root: AvlNode | null; deleted: boolean } {
  if (!root) return { root: null, deleted: false };
  if (v < root.value) {
    const r = bstDelete(root.left, v);
    root.left = r.root;
    return { root, deleted: r.deleted };
  }
  if (v > root.value) {
    const r = bstDelete(root.right, v);
    root.right = r.root;
    return { root, deleted: r.deleted };
  }
  if (!root.left) return { root: root.right, deleted: true };
  if (!root.right) return { root: root.left, deleted: true };
  let s = root.right;
  while (s.left) s = s.left;
  root.value = s.value;
  root.right = bstDelete(root.right, s.value).root;
  return { root, deleted: true };
}

/** Insert/delete then rebalance, building one tree clone (with valid AVL) for the result. */
function rebalanceAll(root: AvlNode | null, log: (t: AvlNode | null, hl: Hl, cap: string) => void) {
  let r = root;
  let z: AvlNode | null;
  while ((z = findUnbalanced(r))) {
    log(r, { [z.id]: "unbalanced" }, `Node ${z.value} is unbalanced (balance factor ${bf(z)}). ${caseOf(z)}.`);
    const name = caseOf(z);
    const sub = rotateCase(z);
    r = replaceSubtree(r, z.id, sub);
    log(r, { [sub.id]: "active" }, `Rebalanced: ${name}.`);
  }
  return r;
}

type Hl = Record<number, "active" | "path" | "unbalanced" | "found">;
interface Frame {
  tree: AvlNode | null;
  hl: Hl;
  caption: string;
}

const SAMPLE = [30, 20, 40, 10, 25, 35, 50, 5];
function buildAvl(values: number[]): AvlNode | null {
  let root: AvlNode | null = null;
  for (const v of values) {
    root = bstInsert(root, v).root;
    let z: AvlNode | null;
    while ((z = findUnbalanced(root))) {
      const sub = rotateCase(z);
      root = replaceSubtree(root, z.id, sub);
    }
  }
  return root;
}

export function AVLVisualizer({
  title,
  description,
  complexity,
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
}) {
  const logical = useRef<AvlNode | null>(buildAvl(SAMPLE));
  const [view, setView] = useState<Frame>({
    tree: logical.current,
    hl: {},
    caption:
      "A self-balancing BST. After every insert or delete it rotates so each node's balance factor stays in {-1, 0, 1}.",
  });
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const count = (n: AvlNode | null): number => (n ? 1 + count(n.left) + count(n.right) : 0);

  const play = (frames: Frame[]) => {
    clearTimers();
    frames.forEach((f, i) => {
      const t = setTimeout(() => {
        setView(f);
        if (i === frames.length - 1) {
          const c = setTimeout(() => setView((v) => ({ ...v, hl: {} })), 900);
          timers.current.push(c);
        }
      }, i * 850);
      timers.current.push(t);
    });
  };

  const readValue = (): number | null => {
    const v = Number(input.trim());
    if (input.trim() === "" || !Number.isInteger(v)) {
      setError("Enter a whole number.");
      return null;
    }
    return v;
  };

  const insert = () => {
    clearTimers();
    const v = readValue();
    if (v === null) return;
    if (count(logical.current) >= MAX) return setError(`Tree is full (max ${MAX} nodes).`);
    setError(null);
    setInput("");

    let root = cloneTree(logical.current);
    const res = bstInsert(root, v);
    root = res.root;
    if (res.existed) {
      logical.current = root;
      play([{ tree: cloneTree(root), hl: { [res.id]: "found" }, caption: `${v} is already in the tree.` }]);
      return;
    }
    const frames: Frame[] = [
      { tree: cloneTree(root), hl: { [res.id]: "active" }, caption: `Inserted ${v} as a leaf.` },
    ];
    root = rebalanceAll(root, (t, hl, cap) =>
      frames.push({ tree: cloneTree(t), hl, caption: cap }),
    );
    logical.current = root;
    frames.push({ tree: cloneTree(root), hl: {}, caption: `Done — the tree is balanced.` });
    play(frames);
  };

  const remove = () => {
    clearTimers();
    const v = readValue();
    if (v === null) return;
    setError(null);
    setInput("");

    let root = cloneTree(logical.current);
    const res = bstDelete(root, v);
    root = res.root;
    if (!res.deleted) {
      play([{ tree: cloneTree(logical.current), hl: {}, caption: `${v} is not in the tree.` }]);
      return;
    }
    const frames: Frame[] = [
      { tree: cloneTree(root), hl: {}, caption: `Deleted ${v}.` },
    ];
    root = rebalanceAll(root, (t, hl, cap) =>
      frames.push({ tree: cloneTree(t), hl, caption: cap }),
    );
    logical.current = root;
    frames.push({ tree: cloneTree(root), hl: {}, caption: `Done — the tree is balanced.` });
    play(frames);
  };

  const search = () => {
    clearTimers();
    const v = readValue();
    if (v === null) return;
    setError(null);
    setInput("");

    const tree = logical.current;
    const path: number[] = [];
    let cur = tree;
    let hit: number | null = null;
    while (cur) {
      path.push(cur.id);
      if (v === cur.value) {
        hit = cur.id;
        break;
      }
      cur = v < cur.value ? cur.left : cur.right;
    }
    if (path.length === 0) {
      play([{ tree: cloneTree(tree), hl: {}, caption: "The tree is empty." }]);
      return;
    }
    const frames: Frame[] = path.map((id, i) => {
      const hl: Hl = {};
      for (let k = 0; k < i; k++) hl[path[k]] = "path";
      const isLast = i === path.length - 1;
      hl[id] = isLast && hit !== null ? "found" : "active";
      const caption =
        isLast && hit !== null
          ? `Found ${v}.`
          : isLast
            ? `${v} is not in the tree.`
            : `Comparing ${v}…`;
      return { tree: cloneTree(tree), hl, caption };
    });
    play(frames);
  };

  const clear = () => {
    clearTimers();
    logical.current = null;
    setError(null);
    setView({ tree: null, hl: {}, caption: "Tree cleared." });
  };

  const randomize = () => {
    clearTimers();
    const pool = new Set<number>();
    const len = 7 + Math.floor(Math.random() * 4);
    while (pool.size < len) pool.add(1 + Math.floor(Math.random() * 99));
    logical.current = buildAvl([...pool]);
    setError(null);
    setView({ tree: logical.current, hl: {}, caption: "Generated a random balanced tree." });
  };

  const { nodes, edges, width, height } = layout(view.tree);
  const hl = view.hl;

  const fillFor = (id: number) => {
    switch (hl[id]) {
      case "found":
        return "color-mix(in srgb, var(--success) 28%, var(--surface-2))";
      case "unbalanced":
        return "color-mix(in srgb, var(--danger) 28%, var(--surface-2))";
      case "active":
        return "color-mix(in srgb, var(--brand) 26%, var(--surface-2))";
      case "path":
        return "color-mix(in srgb, var(--accent) 24%, var(--surface-2))";
      default:
        return "var(--surface-2)";
    }
  };
  const borderFor = (id: number, isRoot: boolean) => {
    switch (hl[id]) {
      case "found":
        return "var(--success)";
      case "unbalanced":
        return "var(--danger)";
      case "active":
        return "var(--brand)";
      case "path":
        return "var(--accent)";
      default:
        return isRoot ? "var(--brand)" : "var(--border)";
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
              <Badge tone="brand">Guaranteed {complexity.time}</Badge>
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
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="absolute left-0 top-0 flex items-center justify-center rounded-full border-2 text-sm font-semibold tabular-nums shadow-md"
                  style={{
                    width: NODE,
                    height: NODE,
                    background: fillFor(n.id),
                    borderColor: borderFor(n.id, n.isRoot),
                    color: "var(--foreground)",
                  }}
                >
                  {n.value}
                  <span
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-medium tabular-nums"
                    style={{
                      color: Math.abs(n.bf) > 1 ? "var(--danger)" : "var(--muted)",
                    }}
                  >
                    {n.bf > 0 ? `+${n.bf}` : n.bf}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
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
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
          Active
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--danger)" }} />
          Unbalanced
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--success)" }} />
          Found
        </span>
        <span className="text-muted/70">Small number above each node is its balance factor.</span>
      </div>
    </div>
  );
}

interface Placed {
  id: number;
  value: number;
  bf: number;
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

function layout(root: AvlNode | null): {
  nodes: Placed[];
  edges: Edge[];
  width: number;
  height: number;
} {
  const nodes: Placed[] = [];
  const edges: Edge[] = [];
  const center = new Map<number, { cx: number; cy: number }>();
  let col = 0;
  let maxDepth = 0;

  const visit = (node: AvlNode | null, depth: number) => {
    if (!node) return;
    visit(node.left, depth + 1);
    const cx = PAD + col * GAP_X + NODE / 2;
    const cy = PAD + depth * GAP_Y + NODE / 2;
    col += 1;
    maxDepth = Math.max(maxDepth, depth);
    center.set(node.id, { cx, cy });
    nodes.push({ id: node.id, value: node.value, bf: bf(node), isRoot: depth === 0, cx, cy });
    visit(node.right, depth + 1);
  };
  visit(root, 0);

  const link = (node: AvlNode | null) => {
    if (!node) return;
    const p = center.get(node.id)!;
    for (const c of [node.left, node.right]) {
      if (c) {
        const cc = center.get(c.id)!;
        edges.push({ key: `${node.id}-${c.id}`, x1: p.cx, y1: p.cy, x2: cc.cx, y2: cc.cy });
        link(c);
      }
    }
  };
  link(root);

  return {
    nodes,
    edges,
    width: PAD * 2 + Math.max(0, col - 1) * GAP_X + NODE,
    height: PAD * 2 + maxDepth * GAP_Y + NODE,
  };
}
