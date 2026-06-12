"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Base delay (ms) between frames at 1× speed. */
export const BASE_DELAY = 650;

export interface FramePlayer<T> {
  index: number;
  frame: T | undefined;
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
 * Drives playback over an array of frames of any shape. Resets whenever
 * `frames` changes (i.e. a new sequence was generated). Used by the array
 * step player, the graph traversal, and the tree traversals so they all share
 * identical play / pause / speed / step controls.
 */
export function useFramePlayer<T>(
  frames: T[],
  baseDelay = BASE_DELAY,
): FramePlayer<T> {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const total = frames.length;
  const isDone = total === 0 || index >= total - 1;

  // Reset when a new frame list arrives.
  useEffect(() => {
    setIndex(0);
    setIsPlaying(false);
  }, [frames]);

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
    }, baseDelay / speed);
    return () => clearTimeout(timer.current);
  }, [isPlaying, index, total, speed, baseDelay]);

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
    frame: frames[index],
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
