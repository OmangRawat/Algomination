import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Kadane's algorithm for the maximum subarray sum. Scans left to right keeping
 * the best sum of a subarray that ends at the current index: if the running sum
 * has gone negative, dragging it forward can only hurt, so we restart the window
 * at the current element. The best window seen so far is tracked separately.
 * Works with negative numbers.
 */
export function kadaneMaxSubarray(values: number[]): Step[] {
  const items = makeItems(values);
  const n = items.length;
  const steps: Step[] = [];

  const rangeMarks = (
    lo: number,
    hi: number,
    kind: HighlightKind,
  ): Record<number, HighlightKind> => {
    const m: Record<number, HighlightKind> = {};
    for (let p = lo; p <= hi; p++) m[p] = kind;
    return m;
  };

  const push = (
    highlights: Record<number, HighlightKind>,
    caption: string,
    pointers?: Record<string, number>,
  ) => {
    steps.push({
      items: items.map((it) => ({ ...it })),
      highlights,
      pointers,
      caption,
    });
  };

  let curStart = 0;
  let curSum = items[0].value;
  let bestStart = 0;
  let bestEnd = 0;
  let bestSum = items[0].value;

  push(
    { ...rangeMarks(0, 0, "found"), [0]: "active" },
    `Start at index 0. Current sum = ${curSum}, best sum = ${bestSum}.`,
    { i: 0 },
  );

  for (let i = 1; i < n; i++) {
    const v = items[i].value;

    if (curSum < 0) {
      curStart = i;
      curSum = v;
      push(
        { ...rangeMarks(bestStart, bestEnd, "found"), [i]: "active" },
        `Running sum went negative, so restart the window at index ${i}. Current sum = ${curSum}.`,
        { i },
      );
    } else {
      const prev = curSum;
      curSum += v;
      push(
        {
          ...rangeMarks(bestStart, bestEnd, "found"),
          ...rangeMarks(curStart, i, "range"),
          [i]: "active",
        },
        `Extend the window to index ${i}: ${prev} + ${v} = ${curSum}.`,
        { i },
      );
    }

    if (curSum > bestSum) {
      bestSum = curSum;
      bestStart = curStart;
      bestEnd = i;
      push(
        { ...rangeMarks(bestStart, bestEnd, "found"), [i]: "active" },
        `New best! Subarray [${bestStart}..${bestEnd}] has sum ${bestSum}.`,
        { i },
      );
    }
  }

  push(
    rangeMarks(bestStart, bestEnd, "found"),
    `Done. Maximum subarray sum is ${bestSum} — indices ${bestStart}..${bestEnd}. 🎉`,
  );

  return steps;
}
