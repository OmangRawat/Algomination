"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, Eye, Trash2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface StackItem {
  id: number;
  value: number;
}

const MAX = 8;
let idCounter = 0;

const makeStack = (values: number[]): StackItem[] =>
  values.map((value) => ({ id: idCounter++, value }));

export function StackVisualizer({
  title,
  description,
  complexity,
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
}) {
  const [stack, setStack] = useState<StackItem[]>(() => makeStack([3, 7, 5]));
  const [input, setInput] = useState("");
  const [caption, setCaption] = useState(
    "Push, pop, or peek to manipulate the stack (LIFO — last in, first out).",
  );
  const [error, setError] = useState<string | null>(null);
  const [peekId, setPeekId] = useState<number | null>(null);

  const topIndex = stack.length - 1;

  const push = () => {
    const raw = input.trim();
    const value = Number(raw);
    if (raw === "" || !Number.isFinite(value)) {
      setError("Enter a number to push.");
      return;
    }
    if (stack.length >= MAX) {
      setError(`Stack is full (max ${MAX}). Pop something first.`);
      return;
    }
    setError(null);
    setStack((s) => [...s, { id: idCounter++, value }]);
    setCaption(`Pushed ${value} onto the top.`);
    setInput("");
  };

  const pop = () => {
    if (stack.length === 0) {
      setError("Stack is empty — nothing to pop.");
      return;
    }
    setError(null);
    const popped = stack[topIndex];
    setStack((s) => s.slice(0, -1));
    setCaption(`Popped ${popped.value} off the top.`);
  };

  const peek = () => {
    if (stack.length === 0) {
      setError("Stack is empty — nothing to peek.");
      return;
    }
    setError(null);
    const top = stack[topIndex];
    setPeekId(top.id);
    setCaption(`Peek: the top element is ${top.value}.`);
    window.setTimeout(() => setPeekId(null), 900);
  };

  const clear = () => {
    setError(null);
    setStack([]);
    setCaption("Stack cleared.");
  };

  const randomize = () => {
    const len = 3 + Math.floor(Math.random() * 4);
    setStack(
      makeStack(
        Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 99)),
      ),
    );
    setError(null);
    setCaption("Generated a random stack.");
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
            onKeyDown={(e) => e.key === "Enter" && push()}
            inputMode="numeric"
            placeholder="value"
            aria-label="Value to push"
            className="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:w-32"
          />
          <Button onClick={push}>
            <ArrowDownToLine size={16} /> Push
          </Button>
          <Button variant="secondary" onClick={pop}>
            <ArrowUpFromLine size={16} /> Pop
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
      <div className="rounded-2xl border border-border bg-surface/60 p-6">
        <div className="flex min-h-[340px] flex-col items-center justify-end gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {stack.length === 0 && (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-12 text-sm text-muted"
              >
                Stack is empty.
              </motion.p>
            )}

            {/* Render top-to-bottom: last array element (top) appears first. */}
            {[...stack].reverse().map((item) => {
              const isTop = item.id === stack[topIndex]?.id;
              const isPeek = item.id === peekId;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -28, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -28, scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  className="relative flex h-12 w-48 items-center justify-center rounded-lg border text-lg font-semibold tabular-nums shadow-md"
                  style={{
                    borderColor: isPeek
                      ? "var(--accent)"
                      : isTop
                        ? "var(--brand)"
                        : "var(--border)",
                    background: isPeek
                      ? "color-mix(in srgb, var(--accent) 22%, var(--surface-2))"
                      : "var(--surface-2)",
                    color: "var(--foreground)",
                  }}
                >
                  {item.value}
                  {isTop && (
                    <span className="absolute left-full ml-3 flex items-center gap-1 whitespace-nowrap text-xs font-medium text-brand">
                      ← top
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Base plate */}
          <div className="mt-1 h-2 w-56 rounded-full bg-border" />
          <span className="text-xs text-muted">
            {stack.length} / {MAX} elements
          </span>
        </div>

        {/* Caption */}
        <div className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {caption}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded"
            style={{ backgroundColor: "var(--brand)" }}
          />
          Top of stack
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded"
            style={{ backgroundColor: "var(--accent)" }}
          />
          Peek
        </span>
      </div>
    </div>
  );
}
