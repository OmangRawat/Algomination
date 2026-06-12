"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownRight, Trash2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface TrieNode {
  id: number;
  char: string;
  isEnd: boolean;
  children: TrieNode[];
}

const NODE = 40;
const PAD = 24;
const GAP_X = 50;
const LEVEL_H = 68;
const MAX_NODES = 40;
const SAMPLE = ["cat", "car", "card", "dog", "do"];
let idCounter = 0;

const newNode = (char: string): TrieNode => ({
  id: idCounter++,
  char,
  isEnd: false,
  children: [],
});

function childFor(node: TrieNode, ch: string): TrieNode | undefined {
  return node.children.find((c) => c.char === ch);
}

function insertWord(root: TrieNode, word: string): number[] {
  let cur = root;
  const path = [root.id];
  for (const ch of word) {
    let next = childFor(cur, ch);
    if (!next) {
      next = newNode(ch);
      cur.children.push(next);
    }
    cur = next;
    path.push(cur.id);
  }
  cur.isEnd = true;
  return path;
}

function countNodes(root: TrieNode): number {
  let n = 1;
  for (const c of root.children) n += countNodes(c);
  return n;
}

function deleteWord(root: TrieNode, word: string): boolean {
  const path: [TrieNode, TrieNode][] = [];
  let cur = root;
  for (const ch of word) {
    const next = childFor(cur, ch);
    if (!next) return false;
    path.push([cur, next]);
    cur = next;
  }
  if (!cur.isEnd) return false;
  cur.isEnd = false;
  for (let k = path.length - 1; k >= 0; k--) {
    const [parent, node] = path[k];
    if (node.children.length === 0 && !node.isEnd) {
      parent.children = parent.children.filter((c) => c !== node);
    } else break;
  }
  return true;
}

interface Placed {
  id: number;
  char: string;
  isEnd: boolean;
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

/** Tidy layout: leaves get sequential columns; parents centre over children. */
function trieLayout(root: TrieNode): {
  placed: Placed[];
  edges: Edge[];
  width: number;
  height: number;
} {
  const placed: Placed[] = [];
  const edges: Edge[] = [];
  const pos = new Map<number, { cx: number; cy: number }>();
  let col = 0;
  let maxDepth = 0;

  const assign = (node: TrieNode, depth: number): number => {
    maxDepth = Math.max(maxDepth, depth);
    const kids = [...node.children].sort((a, b) =>
      a.char < b.char ? -1 : 1,
    );
    let x: number;
    if (kids.length === 0) {
      x = col++;
    } else {
      const xs = kids.map((k) => assign(k, depth + 1));
      x = (xs[0] + xs[xs.length - 1]) / 2;
    }
    const cx = PAD + x * GAP_X + NODE / 2;
    const cy = PAD + depth * LEVEL_H + NODE / 2;
    pos.set(node.id, { cx, cy });
    placed.push({
      id: node.id,
      char: node.char,
      isEnd: node.isEnd,
      isRoot: depth === 0,
      cx,
      cy,
    });
    return x;
  };
  assign(root, 0);

  const link = (node: TrieNode) => {
    const p = pos.get(node.id)!;
    for (const c of node.children) {
      const cc = pos.get(c.id)!;
      edges.push({ key: `${node.id}-${c.id}`, x1: p.cx, y1: p.cy, x2: cc.cx, y2: cc.cy });
      link(c);
    }
  };
  link(root);

  return {
    placed,
    edges,
    width: PAD * 2 + Math.max(0, col - 1) * GAP_X + NODE,
    height: PAD * 2 + maxDepth * LEVEL_H + NODE,
  };
}

export function TrieVisualizer({
  title,
  description,
  complexity,
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
}) {
  const root = useRef<TrieNode>(buildTrie(SAMPLE));
  const [, force] = useReducer((x) => x + 1, 0);
  const [input, setInput] = useState("");
  const [caption, setCaption] = useState(
    "A trie stores strings character by character. Shared prefixes share a path from the root.",
  );
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [pathIds, setPathIds] = useState<Set<number>>(new Set());
  const [foundId, setFoundId] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const resetMarks = () => {
    clearTimers();
    setActiveId(null);
    setPathIds(new Set());
    setFoundId(null);
  };

  const readWord = (): string | null => {
    const w = input.trim().toLowerCase();
    if (!/^[a-z]+$/.test(w)) {
      setError("Enter a word using letters a–z only.");
      return null;
    }
    return w;
  };

  /** Walk the ids in sequence, highlighting each, then finish. */
  const walk = (
    ids: number[],
    onDone: (lastId: number) => void,
    captionAt: (i: number) => string,
  ) => {
    const seen = new Set<number>();
    ids.forEach((id, i) => {
      const t = setTimeout(() => {
        seen.add(id);
        setPathIds(new Set(seen));
        setActiveId(id);
        setCaption(captionAt(i));
        if (i === ids.length - 1) {
          setActiveId(null);
          onDone(id);
        }
      }, i * 450);
      timers.current.push(t);
    });
  };

  const insert = () => {
    resetMarks();
    const w = readWord();
    if (w === null) return;
    if (countNodes(root.current) + w.length > MAX_NODES) {
      return setError("Trie is getting large — clear it or try a shorter word.");
    }
    setError(null);
    setInput("");
    const path = insertWord(root.current, w);
    force();
    walk(
      path,
      (last) => {
        setFoundId(last);
        setCaption(`Inserted "${w}".`);
      },
      (i) => (i === 0 ? `Start at the root.` : `Add / follow '${w[i - 1]}'.`),
    );
  };

  const search = (prefixMode: boolean) => {
    resetMarks();
    const w = readWord();
    if (w === null) return;
    setError(null);
    setInput("");

    const path = [root.current.id];
    let cur: TrieNode | undefined = root.current;
    let broke = false;
    for (const ch of w) {
      cur = cur ? childFor(cur, ch) : undefined;
      if (!cur) {
        broke = true;
        break;
      }
      path.push(cur.id);
    }
    const exists = !broke && cur !== undefined;
    const isWord = exists && cur!.isEnd;

    walk(
      path,
      (last) => {
        if (prefixMode) {
          if (exists) {
            setFoundId(last);
            setCaption(`Prefix "${w}" exists in the trie.`);
          } else {
            setCaption(`No word starts with "${w}".`);
          }
        } else {
          if (isWord) {
            setFoundId(last);
            setCaption(`Found the word "${w}".`);
          } else if (exists) {
            setCaption(`"${w}" is a prefix, but not a stored word.`);
          } else {
            setCaption(`"${w}" is not in the trie.`);
          }
        }
      },
      (i) =>
        i === 0
          ? `Start at the root.`
          : `Follow '${w[i - 1]}'…`,
    );
    if (broke) {
      // Stop early: the missing character ends the walk.
      const t = setTimeout(() => {
        setCaption(
          prefixMode
            ? `No word starts with "${w}".`
            : `"${w}" is not in the trie.`,
        );
      }, path.length * 450);
      timers.current.push(t);
    }
  };

  const remove = () => {
    resetMarks();
    const w = readWord();
    if (w === null) return;
    setError(null);
    setInput("");
    const ok = deleteWord(root.current, w);
    force();
    setCaption(ok ? `Deleted "${w}".` : `"${w}" is not a stored word.`);
  };

  const clear = () => {
    resetMarks();
    root.current = newNode("");
    setError(null);
    setCaption("Trie cleared.");
    force();
  };

  const randomize = () => {
    resetMarks();
    const pool = ["sun", "sky", "sea", "snow", "star", "stone", "step", "ten", "tea", "team"];
    const k = 3 + Math.floor(Math.random() * 3);
    const picked: string[] = [];
    while (picked.length < k) {
      const w = pool[Math.floor(Math.random() * pool.length)];
      if (!picked.includes(w)) picked.push(w);
    }
    root.current = buildTrie(picked);
    setError(null);
    setCaption(`Built a trie from: ${picked.join(", ")}.`);
    force();
  };

  const { placed, edges, width, height } = trieLayout(root.current);

  const fillFor = (p: Placed) =>
    p.id === foundId
      ? "color-mix(in srgb, var(--success) 28%, var(--surface-2))"
      : p.id === activeId
        ? "color-mix(in srgb, var(--accent) 28%, var(--surface-2))"
        : pathIds.has(p.id)
          ? "color-mix(in srgb, var(--brand) 22%, var(--surface-2))"
          : "var(--surface-2)";
  const borderFor = (p: Placed) =>
    p.id === foundId
      ? "var(--success)"
      : p.id === activeId
        ? "var(--accent)"
        : pathIds.has(p.id)
          ? "var(--brand)"
          : p.isEnd
            ? "var(--success)"
            : p.isRoot
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
              <Badge tone="brand">Ops {complexity.time}</Badge>
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
            placeholder="word (a–z)"
            aria-label="Word"
            className="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:w-40"
          />
          <Button onClick={insert}>Insert</Button>
          <Button variant="secondary" onClick={() => search(false)}>
            <Search size={16} /> Search
          </Button>
          <Button variant="secondary" onClick={() => search(true)}>
            <CornerDownRight size={16} /> Starts with
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
            style={{ width: Math.max(width, 280), height: Math.max(height, 130) }}
          >
            {/* Edges */}
            <svg className="absolute inset-0 h-full w-full" style={{ overflow: "visible" }}>
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
              {placed.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: p.cx - NODE / 2,
                    y: p.cy - NODE / 2,
                  }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="absolute left-0 top-0 flex items-center justify-center rounded-full border-2 text-sm font-semibold shadow-md"
                  style={{
                    width: NODE,
                    height: NODE,
                    background: fillFor(p),
                    borderColor: borderFor(p),
                    color: "var(--foreground)",
                  }}
                >
                  {p.isRoot ? "•" : p.char}
                  {p.isEnd && !p.isRoot && (
                    <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border border-background bg-success" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Caption */}
        <div className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {caption}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          Visiting
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--brand)" }} />
          Matched path
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--success)" }} />
          End of word
        </span>
      </div>
    </div>
  );
}

function buildTrie(words: string[]): TrieNode {
  const root = newNode("");
  for (const w of words) insertWord(root, w);
  return root;
}
