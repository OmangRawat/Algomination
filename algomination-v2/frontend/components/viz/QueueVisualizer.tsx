"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightToLine, ArrowRightFromLine, Eye, Trash2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface QueueItem {
  id: number;
  value: number;
}

const MAX = 8;
let idCounter = 0;

const makeQueue = (values: number[]): QueueItem[] =>
  values.map((value) => ({ id: idCounter++, value }));

export function QueueVisualizer({
  title,
  description,
  complexity,
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
}) {
  const [queue, setQueue] = useState<QueueItem[]>(() => makeQueue([3, 7, 5]));
  const [input, setInput] = useState("");
  const [caption, setCaption] = useState(
    "Enqueue, dequeue, or peek (FIFO — first in, first out).",
  );
  const [error, setError] = useState<string | null>(null);
  const [peekId, setPeekId] = useState<number | null>(null);

  const enqueue = () => {
    const raw = input.trim();
    const value = Number(raw);
    if (raw === "" || !Number.isFinite(value)) {
      setError("Enter a number to enqueue.");
      return;
    }
    if (queue.length >= MAX) {
      setError(`Queue is full (max ${MAX}). Dequeue something first.`);
      return;
    }
    setError(null);
    setQueue((q) => [...q, { id: idCounter++, value }]);
    setCaption(`Enqueued ${value} at the rear.`);
    setInput("");
  };

  const dequeue = () => {
    if (queue.length === 0) {
      setError("Queue is empty — nothing to dequeue.");
      return;
    }
    setError(null);
    const front = queue[0];
    setQueue((q) => q.slice(1));
    setCaption(`Dequeued ${front.value} from the front.`);
  };

  const peek = () => {
    if (queue.length === 0) {
      setError("Queue is empty — nothing to peek.");
      return;
    }
    setError(null);
    const front = queue[0];
    setPeekId(front.id);
    setCaption(`Peek: the front element is ${front.value}.`);
    window.setTimeout(() => setPeekId(null), 900);
  };

  const clear = () => {
    setError(null);
    setQueue([]);
    setCaption("Queue cleared.");
  };

  const randomize = () => {
    const len = 3 + Math.floor(Math.random() * 4);
    setQueue(
      makeQueue(
        Array.from({ length: len }, () => 1 + Math.floor(Math.random() * 99)),
      ),
    );
    setError(null);
    setCaption("Generated a random queue.");
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
            onKeyDown={(e) => e.key === "Enter" && enqueue()}
            inputMode="numeric"
            placeholder="value"
            aria-label="Value to enqueue"
            className="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:w-32"
          />
          <Button onClick={enqueue}>
            <ArrowRightToLine size={16} /> Enqueue
          </Button>
          <Button variant="secondary" onClick={dequeue}>
            <ArrowRightFromLine size={16} /> Dequeue
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
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
          {/* Front / Rear labels */}
          <div className="flex w-full max-w-2xl justify-between px-1 text-xs font-medium text-brand">
            <span>front →</span>
            <span>← rear</span>
          </div>

          <div className="flex min-h-16 w-full items-center justify-center gap-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {queue.length === 0 && (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted"
                >
                  Queue is empty.
                </motion.p>
              )}
              {queue.map((item, idx) => {
                const isFront = idx === 0;
                const isRear = idx === queue.length - 1;
                const isPeek = item.id === peekId;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 28, scale: 0.85 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -28, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 500, damping: 34 }}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border text-lg font-semibold tabular-nums shadow-md"
                    style={{
                      borderColor: isPeek
                        ? "var(--accent)"
                        : isFront
                          ? "var(--brand)"
                          : isRear
                            ? "var(--brand-2)"
                            : "var(--border)",
                      background: isPeek
                        ? "color-mix(in srgb, var(--accent) 22%, var(--surface-2))"
                        : "var(--surface-2)",
                      color: "var(--foreground)",
                    }}
                  >
                    {item.value}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <span className="text-xs text-muted">
            {queue.length} / {MAX} elements
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
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--brand)" }} />
          Front
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--brand-2)" }} />
          Rear
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--accent)" }} />
          Peek
        </span>
      </div>
    </div>
  );
}
