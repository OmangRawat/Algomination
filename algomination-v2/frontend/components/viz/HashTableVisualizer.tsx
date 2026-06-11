"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Trash2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Entry {
  id: number;
  value: number;
}

const BUCKETS = 7;
const MAX = 16;
let idCounter = 0;

const hash = (v: number) => ((v % BUCKETS) + BUCKETS) % BUCKETS;

export function HashTableVisualizer({
  title,
  description,
  complexity,
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
}) {
  const [buckets, setBuckets] = useState<Entry[][]>(() => {
    const b: Entry[][] = Array.from({ length: BUCKETS }, () => []);
    [12, 5, 19, 7, 23].forEach((v) => b[hash(v)].push({ id: idCounter++, value: v }));
    return b;
  });
  const [input, setInput] = useState("");
  const [caption, setCaption] = useState(
    `A hash table with ${BUCKETS} buckets. Each key lands in bucket (value mod ${BUCKETS}); collisions chain.`,
  );
  const [error, setError] = useState<string | null>(null);
  const [activeBucket, setActiveBucket] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [foundId, setFoundId] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const resetMarks = () => {
    clearTimers();
    setActiveBucket(null);
    setActiveId(null);
    setFoundId(null);
  };

  const total = buckets.reduce((s, b) => s + b.length, 0);

  const readValue = (): number | null => {
    const v = Number(input.trim());
    if (input.trim() === "" || !Number.isInteger(v) || v < 0) {
      setError("Enter a non-negative whole number.");
      return null;
    }
    return v;
  };

  const insert = () => {
    resetMarks();
    const v = readValue();
    if (v === null) return;
    if (total >= MAX) return setError(`Table is full (max ${MAX} entries).`);
    const b = hash(v);
    setError(null);
    setBuckets((prev) => {
      const next = prev.map((chain) => [...chain]);
      next[b].push({ id: idCounter++, value: v });
      return next;
    });
    setActiveBucket(b);
    setCaption(`hash(${v}) = ${v} mod ${BUCKETS} = ${b} → inserted into bucket ${b}.`);
    setInput("");
    const t = setTimeout(() => setActiveBucket(null), 900);
    timers.current.push(t);
  };

  const search = () => {
    resetMarks();
    const v = readValue();
    if (v === null) return;
    setError(null);
    setInput("");
    const b = hash(v);
    const chain = buckets[b];
    setActiveBucket(b);
    setCaption(`hash(${v}) = ${v} mod ${BUCKETS} = ${b} → scanning bucket ${b}…`);

    if (chain.length === 0) {
      const t = setTimeout(() => setCaption(`Bucket ${b} is empty — ${v} not found.`), 600);
      timers.current.push(t);
      return;
    }
    chain.forEach((entry, i) => {
      const t = setTimeout(() => {
        setActiveId(entry.id);
        const isLast = i === chain.length - 1;
        if (entry.value === v) {
          setFoundId(entry.id);
          setActiveId(null);
          setCaption(`Found ${v} in bucket ${b}, position ${i}.`);
          clearTimers();
        } else if (isLast) {
          setActiveId(null);
          setCaption(`Scanned bucket ${b} — ${v} is not present.`);
        } else {
          setCaption(`Checking ${entry.value} in bucket ${b}…`);
        }
      }, 600 + i * 600);
      timers.current.push(t);
    });
  };

  const remove = () => {
    resetMarks();
    const v = readValue();
    if (v === null) return;
    setError(null);
    setInput("");
    const b = hash(v);
    const idx = buckets[b].findIndex((e) => e.value === v);
    if (idx === -1) {
      setActiveBucket(b);
      setCaption(`${v} is not in bucket ${b} — nothing to delete.`);
      const t = setTimeout(() => setActiveBucket(null), 900);
      timers.current.push(t);
      return;
    }
    setBuckets((prev) => {
      const next = prev.map((chain) => [...chain]);
      next[b].splice(idx, 1);
      return next;
    });
    setCaption(`Deleted ${v} from bucket ${b}.`);
  };

  const clear = () => {
    resetMarks();
    setBuckets(Array.from({ length: BUCKETS }, () => []));
    setError(null);
    setCaption("Hash table cleared.");
  };

  const randomize = () => {
    resetMarks();
    const len = 5 + Math.floor(Math.random() * 4);
    const next: Entry[][] = Array.from({ length: BUCKETS }, () => []);
    for (let i = 0; i < len; i++) {
      const v = 1 + Math.floor(Math.random() * 40);
      next[hash(v)].push({ id: idCounter++, value: v });
    }
    setBuckets(next);
    setError(null);
    setCaption("Generated a random hash table.");
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
            aria-label="Key to hash"
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
      <div className="rounded-2xl border border-border bg-surface/60 p-4 sm:p-6">
        <div className="flex flex-col gap-2">
          {buckets.map((chain, b) => {
            const bucketActive = b === activeBucket;
            return (
              <div key={b} className="flex items-center gap-3">
                {/* Bucket index */}
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold tabular-nums transition-colors"
                  style={{
                    borderColor: bucketActive ? "var(--accent)" : "var(--border)",
                    background: bucketActive
                      ? "color-mix(in srgb, var(--accent) 20%, var(--surface-2))"
                      : "var(--surface-2)",
                    color: "var(--foreground)",
                  }}
                >
                  {b}
                </div>
                <span className="text-muted">:</span>

                {/* Chain */}
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {chain.length === 0 && (
                      <motion.span
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-muted/60"
                      >
                        empty
                      </motion.span>
                    )}
                    {chain.map((entry, i) => {
                      const isActive = entry.id === activeId;
                      const isFound = entry.id === foundId;
                      return (
                        <motion.div
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ type: "spring", stiffness: 480, damping: 34 }}
                          className="flex items-center gap-2"
                        >
                          {i > 0 && <span className="text-muted">→</span>}
                          <div
                            className="flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 text-sm font-semibold tabular-nums shadow-sm transition-colors"
                            style={{
                              borderColor: isFound
                                ? "var(--success)"
                                : isActive
                                  ? "var(--accent)"
                                  : "var(--border)",
                              background: isFound
                                ? "color-mix(in srgb, var(--success) 24%, var(--surface-2))"
                                : isActive
                                  ? "color-mix(in srgb, var(--accent) 24%, var(--surface-2))"
                                  : "var(--surface-2)",
                              color: "var(--foreground)",
                            }}
                          >
                            {entry.value}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 text-center text-xs text-muted">
          {total} / {MAX} entries
        </div>

        {/* Caption */}
        <div className="mt-3 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {caption}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--accent)" }} />
          Probing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded" style={{ backgroundColor: "var(--success)" }} />
          Found
        </span>
      </div>
    </div>
  );
}
