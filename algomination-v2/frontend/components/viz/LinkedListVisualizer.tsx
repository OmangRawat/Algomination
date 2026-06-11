"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Trash2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ListNode {
  id: number;
  value: number;
}

const MAX = 8;
let idCounter = 0;

const makeList = (values: number[]): ListNode[] =>
  values.map((value) => ({ id: idCounter++, value }));

export function LinkedListVisualizer({
  title,
  description,
  complexity,
  doubly = false,
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
  doubly?: boolean;
}) {
  const [nodes, setNodes] = useState<ListNode[]>(() => makeList([4, 8, 15]));
  const [input, setInput] = useState("");
  const [caption, setCaption] = useState(
    doubly
      ? "A doubly linked list — each node points to both its next and previous node."
      : "A singly linked list — each node points to the next one.",
  );
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [foundId, setFoundId] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const stopSearch = () => {
    if (timer.current) clearTimeout(timer.current);
  };
  useEffect(() => () => stopSearch(), []);

  const reset = () => {
    stopSearch();
    setActiveId(null);
    setFoundId(null);
  };

  const readValue = (): number | null => {
    const v = Number(input.trim());
    if (input.trim() === "" || !Number.isFinite(v)) {
      setError("Enter a number.");
      return null;
    }
    return v;
  };

  const insertHead = () => {
    reset();
    const v = readValue();
    if (v === null) return;
    if (nodes.length >= MAX) return setError(`List is full (max ${MAX}).`);
    setError(null);
    setNodes((n) => [{ id: idCounter++, value: v }, ...n]);
    setCaption(`Inserted ${v} at the head.`);
    setInput("");
  };

  const insertTail = () => {
    reset();
    const v = readValue();
    if (v === null) return;
    if (nodes.length >= MAX) return setError(`List is full (max ${MAX}).`);
    setError(null);
    setNodes((n) => [...n, { id: idCounter++, value: v }]);
    setCaption(`Inserted ${v} at the tail.`);
    setInput("");
  };

  const deleteHead = () => {
    reset();
    if (nodes.length === 0) return setError("List is empty.");
    setError(null);
    const removed = nodes[0];
    setNodes((n) => n.slice(1));
    setCaption(`Removed ${removed.value} from the head.`);
  };

  const deleteTail = () => {
    reset();
    if (nodes.length === 0) return setError("List is empty.");
    setError(null);
    const removed = nodes[nodes.length - 1];
    setNodes((n) => n.slice(0, -1));
    setCaption(`Removed ${removed.value} from the tail.`);
  };

  const search = () => {
    reset();
    const v = readValue();
    if (v === null) return;
    setError(null);
    const snapshot = nodes;
    let i = 0;
    const visit = () => {
      if (i >= snapshot.length) {
        setActiveId(null);
        setCaption(`Traversed the whole list — ${v} is not present.`);
        return;
      }
      setActiveId(snapshot[i].id);
      if (snapshot[i].value === v) {
        setFoundId(snapshot[i].id);
        setActiveId(null);
        setCaption(`Found ${v} at position ${i}.`);
        return;
      }
      setCaption(`Checking position ${i} (${snapshot[i].value})…`);
      i += 1;
      timer.current = setTimeout(visit, 650);
    };
    visit();
  };

  const clear = () => {
    reset();
    setNodes([]);
    setError(null);
    setCaption("List cleared.");
  };

  const randomize = () => {
    reset();
    const len = 3 + Math.floor(Math.random() * 4);
    setNodes(
      makeList(Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 99))),
    );
    setError(null);
    setCaption("Generated a random list.");
  };

  const arrow = doubly ? "⇄" : "→";

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
              <Badge tone="brand">Access {complexity.time}</Badge>
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
            onKeyDown={(e) => e.key === "Enter" && insertTail()}
            inputMode="numeric"
            placeholder="value"
            aria-label="Node value"
            className="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:w-28"
          />
          <Button onClick={insertHead}>Insert head</Button>
          <Button onClick={insertTail}>Insert tail</Button>
          <Button variant="secondary" onClick={deleteHead}>
            Delete head
          </Button>
          <Button variant="secondary" onClick={deleteTail}>
            Delete tail
          </Button>
          <Button variant="secondary" onClick={search}>
            <Search size={16} /> Search
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
      <div className="rounded-2xl border border-border bg-surface/60 p-6">
        <div className="flex min-h-[160px] items-center justify-center overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-xs font-medium text-muted">
              {doubly ? "null ⇄" : "head →"}
            </span>

            <AnimatePresence mode="popLayout" initial={false}>
              {nodes.length === 0 && (
                <motion.span
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted"
                >
                  empty
                </motion.span>
              )}

              {nodes.map((node, i) => {
                const isActive = node.id === activeId;
                const isFound = node.id === foundId;
                const isHead = i === 0;
                const isTail = i === nodes.length - 1;
                return (
                  <motion.div
                    key={node.id}
                    layout
                    initial={{ opacity: 0, y: -24, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -24, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                    className="flex shrink-0 items-center gap-2"
                  >
                    <div className="relative">
                      {/* head / tail pointer labels */}
                      {(isHead || (doubly && isTail)) && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-brand">
                          {isHead && isTail
                            ? "head/tail"
                            : isHead
                              ? "head"
                              : "tail"}
                        </span>
                      )}
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-lg border text-lg font-semibold tabular-nums shadow-md transition-colors"
                        style={{
                          borderColor: isFound
                            ? "var(--success)"
                            : isActive
                              ? "var(--accent)"
                              : isHead
                                ? "var(--brand)"
                                : "var(--border)",
                          background: isFound
                            ? "color-mix(in srgb, var(--success) 22%, var(--surface-2))"
                            : isActive
                              ? "color-mix(in srgb, var(--accent) 22%, var(--surface-2))"
                              : "var(--surface-2)",
                          color: "var(--foreground)",
                        }}
                      >
                        {node.value}
                      </div>
                    </div>
                    <span className="text-muted">{arrow}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <span className="shrink-0 text-xs font-medium text-muted">null</span>
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
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--brand)" }} />
          Head
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--accent)" }} />
          Visiting
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--success)" }} />
          Found
        </span>
      </div>
    </div>
  );
}
