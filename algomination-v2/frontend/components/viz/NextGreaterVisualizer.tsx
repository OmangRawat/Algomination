"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { nextGreaterElement } from "@/lib/algorithms/next-greater";
import { useFramePlayer } from "@/lib/engine/useFramePlayer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { PlayerControls } from "./PlayerControls";

const MAX_ITEMS = 10;
const DEFAULT = "4 5 2 25 7 8";

function parse(raw: string): number[] {
  return raw
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

export function NextGreaterVisualizer({
  title,
  description,
  complexity,
}: {
  title: string;
  description?: string;
  complexity?: { time: string; space: string };
}) {
  const [inputText, setInputText] = useState(DEFAULT);
  const [error, setError] = useState<string | null>(null);
  const [frames, setFrames] = useState(() => nextGreaterElement(parse(DEFAULT)));

  const player = useFramePlayer(frames);
  const frame = player.frame;

  const build = (raw: string) => {
    const values = parse(raw);
    if (values.length < 2) {
      setError("Enter at least 2 numbers.");
      return;
    }
    if (values.length > MAX_ITEMS) {
      setError(`Please use at most ${MAX_ITEMS} numbers.`);
      return;
    }
    if (values.some((v) => v < 0 || v > 999)) {
      setError("Use numbers between 0 and 999 for a clean visualization.");
      return;
    }
    setError(null);
    setFrames(nextGreaterElement(values));
  };

  const randomize = () => {
    const len = 6 + Math.floor(Math.random() * 4); // 6–9 values
    const values = Array.from({ length: len }, () =>
      1 + Math.floor(Math.random() * 30),
    );
    setInputText(values.join(" "));
    setError(null);
    setFrames(nextGreaterElement(values));
  };

  const onStack = new Set(frame?.stack ?? []);
  // Past the intro frame, a still-unresolved value at the end means "no greater".
  const reachedEnd = frame?.current === -1 && player.index > 0;

  return (
    <div className="flex flex-col gap-6">
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

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && build(inputText)}
            placeholder="e.g. 4 5 2 25 7 8"
            className="h-11 flex-1 rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          />
          <Button onClick={() => build(inputText)}>Visualize</Button>
          <Button variant="outline" onClick={randomize}>
            <Shuffle size={16} /> Random
          </Button>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      <div className="rounded-2xl border border-border bg-surface/60 p-4">
        {frame && (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* Array with result row */}
            <div className="flex-1 overflow-x-auto">
              <div className="flex justify-center gap-1.5 sm:gap-2">
                {frame.values.map((v, i) => {
                  const isCurrent = i === frame.current;
                  const isResolved = i === frame.resolved;
                  const waiting = onStack.has(i);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <motion.div
                        animate={{
                          backgroundColor: isResolved
                            ? "var(--success)"
                            : isCurrent
                              ? "var(--brand)"
                              : waiting
                                ? "color-mix(in srgb, var(--warning) 30%, transparent)"
                                : "var(--surface-2)",
                        }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-lg text-sm font-semibold",
                          isCurrent || isResolved
                            ? "text-white"
                            : "text-foreground",
                          waiting && "ring-2 ring-[var(--warning)]/60",
                        )}
                      >
                        {v}
                      </motion.div>
                      <span
                        className={cn(
                          "flex h-7 w-12 items-center justify-center rounded-md text-xs font-medium tabular-nums",
                          frame.result[i] !== null
                            ? "bg-success/15 text-success"
                            : "text-muted",
                        )}
                      >
                        {frame.result[i] !== null
                          ? frame.result[i]
                          : reachedEnd
                            ? "−1"
                            : "?"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-center text-xs text-muted">
                next greater element (row below each value)
              </div>
            </div>

            {/* Stack panel */}
            <div className="flex shrink-0 flex-col items-center gap-1.5">
              <span className="text-xs font-medium text-muted">
                Stack (top)
              </span>
              <div className="flex min-h-[3rem] w-24 flex-col-reverse gap-1.5 rounded-xl border border-dashed border-border bg-surface-2/40 p-2">
                <AnimatePresence mode="popLayout">
                  {frame.stack.map((idx) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      className="flex items-center justify-between rounded-md bg-[var(--warning)]/20 px-2 py-1.5 text-xs font-semibold text-foreground ring-1 ring-[var(--warning)]/40"
                    >
                      <span className="text-muted">#{idx}</span>
                      <span>{frame.values[idx]}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <span className="text-xs text-muted">(bottom)</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {frame?.caption ?? "Enter an array to begin."}
        </div>
      </div>

      <PlayerControls player={player} />
    </div>
  );
}
