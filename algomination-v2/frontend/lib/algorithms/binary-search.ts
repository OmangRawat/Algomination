import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Binary search as a pure step generator. Requires sorted input, so it sorts a
 * copy first, then repeatedly halves the search range around the middle.
 */
export function binarySearch(values: number[], target?: number): Step[] {
  const sorted = [...values].sort((a, b) => a - b);
  const items = makeItems(sorted);
  const steps: Step[] = [];
  const t = target ?? NaN;

  const rangeMarks = (lo: number, hi: number): Record<number, HighlightKind> => {
    const marks: Record<number, HighlightKind> = {};
    for (let p = lo; p <= hi; p++) marks[p] = "range";
    return marks;
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

  push({}, `Binary Search needs sorted data — array sorted. Searching for ${t}.`);

  let lo = 0;
  let hi = items.length - 1;
  let found = -1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    push(
      { ...rangeMarks(lo, hi), [mid]: "compare" },
      `Range [${lo}..${hi}] — check middle index ${mid} = ${items[mid].value}.`,
      { low: lo, mid, high: hi },
    );

    if (items[mid].value === t) {
      found = mid;
      push(
        { ...rangeMarks(lo, hi), [mid]: "found" },
        `Found ${t} at index ${mid}! 🎉`,
        { low: lo, mid, high: hi },
      );
      break;
    } else if (items[mid].value < t) {
      push(
        { ...rangeMarks(lo, hi), [mid]: "compare" },
        `${items[mid].value} < ${t}, discard the left half.`,
        { low: lo, mid, high: hi },
      );
      lo = mid + 1;
    } else {
      push(
        { ...rangeMarks(lo, hi), [mid]: "compare" },
        `${items[mid].value} > ${t}, discard the right half.`,
        { low: lo, mid, high: hi },
      );
      hi = mid - 1;
    }
  }

  if (found === -1) push({}, `${t} is not in the array.`);

  return steps;
}
