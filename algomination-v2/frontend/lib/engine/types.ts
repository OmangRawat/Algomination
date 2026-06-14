/**
 * Core types for the client-side visualization engine.
 *
 * Every algorithm is a pure function `(input) => Step[]`. Each Step is one
 * animation frame: the current array order plus how each position should be
 * highlighted and an optional human-readable caption. A player component walks
 * the steps and renders them with Framer Motion.
 */

export type HighlightKind =
  | "compare" // two elements being compared
  | "swap" // elements being swapped
  | "sorted" // in final/settled position
  | "active" // current focus (e.g. the key in insertion sort)
  | "min" // current minimum (selection sort)
  | "pivot" // pivot element (quick sort)
  | "found" // search hit
  | "range" // active sub-array / search window
  | "window" // sliding-window members
  | "less" // Dutch flag: < pivot region
  | "equal" // Dutch flag: = pivot region
  | "greater"; // Dutch flag: > pivot region

/** A value with a stable identity, so reordering can animate by `id`. */
export interface ArrayItem {
  id: number;
  value: number;
}

export interface Step {
  /** Current order of items (left → right). */
  items: ArrayItem[];
  /** Position index → highlight kind. */
  highlights: Record<number, HighlightKind>;
  /** Optional named pointers (label → position index), e.g. { low, mid, high }. */
  pointers?: Record<string, number>;
  /** Short description of what's happening this frame. */
  caption: string;
}

let idCounter = 0;

/** Wrap raw numbers into items with unique, stable ids. */
export function makeItems(values: number[]): ArrayItem[] {
  return values.map((value) => ({ id: idCounter++, value }));
}
