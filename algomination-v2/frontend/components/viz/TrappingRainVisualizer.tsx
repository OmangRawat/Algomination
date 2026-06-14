"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { trapRainWater } from "@/lib/algorithms/rain";
import { useFramePlayer } from "@/lib/engine/useFramePlayer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PlayerControls } from "./PlayerControls";

const MAX_ITEMS = 16;
const COL_PX = 240;
const DEFAULT = "0 1 0 2 1 0 1 3 2 1 2 1";

const BAR_COLOR = "#4d72a8"; // brighter slate-blue walls
const WATER_COLOR = "#93dbff"; // brighter light blue water

function parse(raw: string): number[] {
  return raw
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

export function TrappingRainVisualizer({
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
  const [frames, setFrames] = useState(() => trapRainWater(parse(DEFAULT)));

  const player = useFramePlayer(frames);
  const frame = player.frame;

  const build = (raw: string) => {
    const heights = parse(raw);
    if (heights.length < 3) {
      setError("Enter at least 3 bar heights.");
      return;
    }
    if (heights.length > MAX_ITEMS) {
      setError(`Please use at most ${MAX_ITEMS} bars.`);
      return;
    }
    if (heights.some((v) => v < 0 || v > 20)) {
      setError("Use heights between 0 and 20 for a clean visualization.");
      return;
    }
    setError(null);
    setFrames(trapRainWater(heights));
  };

  const randomize = () => {
    const len = 9 + Math.floor(Math.random() * 6); // 9–14 bars
    const heights = Array.from({ length: len }, () =>
      Math.floor(Math.random() * 9),
    );
    const text = heights.join(" ");
    setInputText(text);
    setError(null);
    setFrames(trapRainWater(heights));
  };

  const maxLevel = Math.max(...(frame?.heights ?? [1]), 1);

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
            placeholder="e.g. 0 1 0 2 1 0 1 3 2 1 2 1"
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
          <>
            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <Badge tone="muted">Left&#8209;max {frame.leftMax}</Badge>
              <Badge tone="muted">Right&#8209;max {frame.rightMax}</Badge>
              <Badge tone="brand">Water trapped {frame.total}</Badge>
            </div>
            <div
              className="flex items-end justify-center gap-1 px-2 sm:gap-1.5"
              style={{ height: COL_PX + 24 }}
            >
              {frame.heights.map((h, i) => {
                const barPx = (h / maxLevel) * COL_PX;
                const waterPx = (frame.water[i] / maxLevel) * COL_PX;
                const isL = i === frame.left;
                const isR = i === frame.right;
                return (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center justify-end"
                    style={{ maxWidth: 48 }}
                  >
                    <span className="mb-1 flex h-4 items-end text-[10px] font-semibold text-brand">
                      {isL && isR ? "L·R" : isL ? "L" : isR ? "R" : ""}
                    </span>
                    <motion.div
                      animate={{ height: waterPx }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="w-full rounded-t-sm"
                      style={{ height: waterPx, backgroundColor: WATER_COLOR }}
                    />
                    <div
                      className="w-full rounded-t-sm"
                      style={{ height: barPx, backgroundColor: BAR_COLOR }}
                    />
                    <span className="mt-1 text-xs font-medium tabular-nums text-muted">
                      {h}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="mt-4 flex min-h-11 items-center justify-center rounded-xl bg-surface-2 px-4 py-2 text-center text-sm text-foreground">
          {frame?.caption ?? "Enter bar heights to begin."}
        </div>
      </div>

      <PlayerControls player={player} />

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded"
            style={{ backgroundColor: BAR_COLOR }}
          />{" "}
          Wall
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded"
            style={{ backgroundColor: WATER_COLOR }}
          />{" "}
          Trapped water
        </span>
      </div>
    </div>
  );
}
