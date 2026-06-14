import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Fixed-size sliding window: the maximum sum of any K consecutive elements.
 * Builds the first window once, then slides it one step at a time — dropping the
 * element that leaves and adding the one that enters — so each move costs O(1)
 * instead of re-summing the whole window. `target` carries the window size K.
 */
export function slidingWindowMaxSum(values: number[], target?: number): Step[] {
  const items = makeItems(values);
  const n = items.length;

  let k = Math.floor(target ?? 3);
  if (!Number.isFinite(k) || k < 1) k = 1;
  if (k > n) k = n;

  const steps: Step[] = [];

  const fill = (
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

  // Build the first window.
  let sum = 0;
  for (let i = 0; i < k; i++) {
    sum += items[i].value;
    push(
      { ...fill(0, i, "window"), [i]: "compare" },
      `Build the first window of size ${k}: add ${items[i].value}. Window sum = ${sum}.`,
      { "start": 0, "end": i },
    );
  }

  let bestSum = sum;
  let bestStart = 0;
  push(
    fill(0, k - 1, "found"),
    `First window covers indices [0..${k - 1}], sum = ${sum}. That's the best so far.`,
    { "start": 0, "end": k - 1 },
  );

  for (let end = k; end < n; end++) {
    const start = end - k + 1;
    const leaving = end - k;
    const out = items[leaving].value;
    const inn = items[end].value;

    // Show the window about to slide: highlight who leaves and who joins.
    push(
      { ...fill(start, end - 1, "window"), [leaving]: "swap", [end]: "compare" },
      `Slide right → drop ${out} (leaves on the left), add ${inn} (joins on the right).`,
      { out: leaving, in: end },
    );

    sum += inn - out;
    push(
      fill(start, end, "window"),
      `New window [${start}..${end}]: sum ${sum - inn + out} − ${out} + ${inn} = ${sum}.`,
      { "start": start, "end": end },
    );

    if (sum > bestSum) {
      bestSum = sum;
      bestStart = start;
      push(
        fill(start, end, "found"),
        `New best! Window [${start}..${end}] has the largest sum yet: ${bestSum}.`,
        { "start": start, "end": end },
      );
    }
  }

  push(
    fill(bestStart, bestStart + k - 1, "found"),
    `Done. The best ${k}-element window is [${bestStart}..${bestStart + k - 1}] with sum ${bestSum}. 🎉`,
  );

  return steps;
}
