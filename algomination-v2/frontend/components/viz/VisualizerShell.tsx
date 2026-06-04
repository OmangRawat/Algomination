"use client";

import { useMemo, useState } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
} from "lucide-react";
import type { HighlightKind, Step } from "@/lib/engine/types";
import { HIGHLIGHT_FILL, HIGHLIGHT_LABEL } from "@/lib/engine/highlight";
import { useStepPlayer } from "@/lib/engine/useStepPlayer";
import { ArrayBars } from "./ArrayBars";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface VisualizerShellProps {
  title: string;
  description?: string;
  /** Pure step generator. Receives an optional target for search algorithms. */
  generate: (values: number[], target?: number) => Step[];
  defaultInput?: string;
  maxItems?: number;
  complexity?: { time: string; space: string };
  /** Show a target field and pass it to `generate` (search algorithms). */
  needsTarget?: boolean;
  defaultTarget?: number;
  /** Note shown to the user that input will be sorted (binary search). */
  requiresSorted?: boolean;
}

const SPEEDS = [0.5, 1, 2, 4];

function parseInput(raw: string): number[] {
  return raw
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

export function VisualizerShell({
  title,
  description,
  generate,
  defaultInput = "5 3 8 1 9 2 7",
  maxItems = 15,
  complexity,
  needsTarget = false,
  defaultTarget = 0,
  requiresSorted = false,
}: VisualizerShellProps) {
  const [inputText, setInputText] = useState(defaultInput);
  const [targetText, setTargetText] = useState(String(defaultTarget));
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>(() =>
    generate(parseInput(defaultInput), needsTarget ? defaultTarget : undefined),
  );

  const player = useStepPlayer(steps);
  const step = player.step;

  const generateFrom = (rawArray: string, rawTarget: string) => {
    const values = parseInput(rawArray);
    if (values.length < 2) {
      setError("Enter at least 2 numbers, separated by spaces.");
      return;
    }
    if (values.length > maxItems) {
      setError(`Please use at most ${maxItems} numbers.`);
      return;
    }
    if (values.some((v) => v < 0 || v > 999)) {
      setError("Use numbers between 0 and 999 for a clean visualization.");
      return;
    }

    let target: number | undefined;
    if (needsTarget) {
      target = Number(rawTarget);
      if (rawTarget.trim() === "" || !Number.isFinite(target)) {
        setError("Enter a numeric target to search for.");
        return;
      }
    }

    setError(null);
    setSteps(generate(values, target));
  };

  const validateAndGenerate = () => generateFrom(inputText, targetText);

  const randomize = () => {
    const len = 6 + Math.floor(Math.random() * 4); // 6–9 values
    const values = Array.from(
      { length: len },
      () => 5 + Math.floor(Math.random() * 95),
    );
    const text = values.join(" ");
    setInputText(text);

    let target: number | undefined;
    if (needsTarget) {
      // Half the time pick a value that's present, so we see a successful find.
      target =
        Math.random() < 0.5
          ? values[Math.floor(Math.random() * values.length)]
          : 5 + Math.floor(Math.random() * 95);
      setTargetText(String(target));
    }

    setError(null);
    setSteps(generate(values, target));
  };

  const progress = useMemo(
    () => (player.total <= 1 ? 0 : (player.index / (player.total - 1)) * 100),
    [player.index, player.total],
  );

  // Only show legend entries for highlight kinds this algorithm actually uses.
  const usedKinds = useMemo(() => {
    const kinds = new Set<HighlightKind>();
    for (const s of steps) {
      for (const k of Object.values(s.highlights)) kinds.add(k);
    }
    return [...kinds];
  }, [steps]);

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

      {/* Input row */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && validateAndGenerate()}
            placeholder="e.g. 5 3 8 1 9 2 7"
            className="h-11 flex-1 rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          />
          {needsTarget && (
            <input
              value={targetText}
              onChange={(e) => setTargetText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && validateAndGenerate()}
              inputMode="numeric"
              placeholder="target"
              aria-label="Target value"
              className="h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground placeholder:text-muted/60 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:w-28"
            />
          )}
          <Button onClick={validateAndGenerate}>Visualize</Button>
          <Button variant="outline" onClick={randomize}>
            <Shuffle size={16} /> Random
          </Button>
        </div>
        {requiresSorted && (
          <p className="text-xs text-muted">
            Binary search requires sorted data — your array is sorted
            automatically before searching.
          </p>
        )}
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      {/* Canvas */}
      <div className="rounded-2xl border border-border bg-surface/60 p-4">
        {step && <ArrayBars step={step} />}

        {/* Caption */}
        <div className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {step?.caption ?? "Enter an array to begin."}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        {/* Seek bar */}
        <input
          type="range"
          min={0}
          max={Math.max(player.total - 1, 0)}
          value={player.index}
          onChange={(e) => player.seek(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-[var(--brand)]"
          style={{
            background: `linear-gradient(to right, var(--brand) ${progress}%, var(--surface-2) ${progress}%)`,
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={player.reset}
              aria-label="Reset"
            >
              <RotateCcw size={18} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={player.prev}
              disabled={player.index === 0}
              aria-label="Previous step"
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              onClick={player.toggle}
              aria-label={player.isPlaying ? "Pause" : "Play"}
              className="w-28"
            >
              {player.isPlaying ? (
                <>
                  <Pause size={18} /> Pause
                </>
              ) : (
                <>
                  <Play size={18} /> {player.isDone ? "Replay" : "Play"}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={player.next}
              disabled={player.isDone}
              aria-label="Next step"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm tabular-nums text-muted">
              Step {player.total === 0 ? 0 : player.index + 1} / {player.total}
            </span>
            <div className="flex items-center gap-1 rounded-lg bg-surface-2 p-1">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => player.setSpeed(s)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    player.speed === s
                      ? "bg-brand text-white"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Legend kinds={usedKinds} />
    </div>
  );
}

function Legend({ kinds }: { kinds: HighlightKind[] }) {
  if (kinds.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
      {kinds.map((kind) => (
        <span key={kind} className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded"
            style={{ backgroundColor: HIGHLIGHT_FILL[kind] }}
          />
          {HIGHLIGHT_LABEL[kind]}
        </span>
      ))}
    </div>
  );
}
