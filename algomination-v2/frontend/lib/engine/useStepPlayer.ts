"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Step } from "./types";

/** Base delay (ms) between frames at 1× speed. */
const BASE_DELAY = 650;

export interface StepPlayer {
  index: number;
  step: Step | undefined;
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
 * Drives playback over an array of steps. Resets whenever `steps` changes
 * (i.e. a new visualization was generated).
 */
export function useStepPlayer(steps: Step[]): StepPlayer {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const total = steps.length;
  const isDone = total === 0 || index >= total - 1;

  // Reset when a new step list arrives.
  useEffect(() => {
    setIndex(0);
    setIsPlaying(false);
  }, [steps]);

  // Advance on a timer while playing.
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (!isPlaying) return;
    if (index >= total - 1) {
      setIsPlaying(false);
      return;
    }
    timer.current = setTimeout(() => {
      setIndex((i) => Math.min(i + 1, total - 1));
    }, BASE_DELAY / speed);
    return () => clearTimeout(timer.current);
  }, [isPlaying, index, total, speed]);

  const play = useCallback(() => {
    if (total === 0) return;
    // Restart if we're at the end.
    setIndex((i) => (i >= total - 1 ? 0 : i));
    setIsPlaying(true);
  }, [total]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(
    () => (isPlaying ? pause() : play()),
    [isPlaying, pause, play],
  );

  const next = useCallback(() => {
    setIsPlaying(false);
    setIndex((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const prev = useCallback(() => {
    setIsPlaying(false);
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIndex(0);
  }, []);

  const seek = useCallback(
    (i: number) => {
      setIsPlaying(false);
      setIndex(Math.max(0, Math.min(i, total - 1)));
    },
    [total],
  );

  return {
    index,
    step: steps[index],
    total,
    isPlaying,
    isDone,
    speed,
    play,
    pause,
    toggle,
    next,
    prev,
    reset,
    seek,
    setSpeed,
  };
}
