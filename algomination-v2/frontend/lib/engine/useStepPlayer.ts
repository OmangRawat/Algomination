"use client";

import type { Step } from "./types";
import { useFramePlayer, type FramePlayer } from "./useFramePlayer";

export interface StepPlayer extends FramePlayer<Step> {
  /** Alias of `frame`, kept for the array visualizer's call sites. */
  step: Step | undefined;
}

/**
 * Drives playback over an array of algorithm steps. Thin wrapper over the
 * generic frame player that exposes the current frame as `step`.
 */
export function useStepPlayer(steps: Step[]): StepPlayer {
  const player = useFramePlayer(steps);
  return { ...player, step: player.frame };
}
