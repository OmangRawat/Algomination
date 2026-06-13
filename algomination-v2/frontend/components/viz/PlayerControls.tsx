"use client";

import { Pause, Play, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const SPEEDS = [0.25, 0.5, 1, 2, 4];

/** The playback surface of a frame player (everything except the frame data). */
export interface PlayerControlSurface {
  index: number;
  total: number;
  isPlaying: boolean;
  isDone: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  seek: (i: number) => void;
  setSpeed: (s: number) => void;
}

/**
 * Shared transport controls — seek bar, reset / step / play-pause, step
 * counter and speed selector. Used by every animated visualizer so playback
 * looks and behaves identically across the site.
 */
export function PlayerControls({ player }: { player: PlayerControlSurface }) {
  const progress =
    player.total <= 1 ? 0 : (player.index / (player.total - 1)) * 100;

  return (
    <div className="flex flex-col gap-4">
      {/* Seek bar */}
      <input
        type="range"
        min={0}
        max={Math.max(player.total - 1, 0)}
        value={player.index}
        onChange={(e) => player.seek(Number(e.target.value))}
        aria-label="Seek"
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-[var(--brand)]"
        style={{
          background: `linear-gradient(to right, var(--brand) ${progress}%, var(--surface-2) ${progress}%)`,
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={player.reset} aria-label="Reset">
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
  );
}
