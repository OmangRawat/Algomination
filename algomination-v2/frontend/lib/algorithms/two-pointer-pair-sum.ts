import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Two-pointer pair sum. On a sorted array, a pointer starts at each end. If the
 * pair's sum is too small the left pointer moves right (to increase it); if it's
 * too big the right pointer moves left (to decrease it). Each step rules out at
 * least one element, so the whole array is scanned once — O(n) after sorting.
 */
export function twoPointerPairSum(values: number[], target?: number): Step[] {
  const sorted = [...values].sort((a, b) => a - b);
  const items = makeItems(sorted);
  const n = items.length;
  const t = target ?? NaN;
  const steps: Step[] = [];

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

  push({}, `Array sorted. Looking for two values that add up to ${t}.`, {});

  let lo = 0;
  let hi = n - 1;
  let found = false;

  while (lo < hi) {
    const a = items[lo].value;
    const b = items[hi].value;
    const sum = a + b;

    if (sum === t) {
      push(
        { [lo]: "found", [hi]: "found" },
        `Found it! ${a} + ${b} = ${t}. 🎉`,
        { L: lo, R: hi },
      );
      found = true;
      break;
    } else if (sum < t) {
      push(
        { [lo]: "compare", [hi]: "compare" },
        `${a} + ${b} = ${sum} < ${t} → move the left pointer right to increase the sum.`,
        { L: lo, R: hi },
      );
      lo++;
    } else {
      push(
        { [lo]: "compare", [hi]: "compare" },
        `${a} + ${b} = ${sum} > ${t} → move the right pointer left to decrease the sum.`,
        { L: lo, R: hi },
      );
      hi--;
    }
  }

  if (!found) push({}, `The pointers met — no pair adds up to ${t}.`);

  return steps;
}
