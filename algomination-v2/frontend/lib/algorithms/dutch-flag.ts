import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Dutch National Flag — three-way partition around a pivot in a single pass.
 * Three pointers carve the array into three regions: values smaller than the
 * pivot on the left, equal in the middle, and larger on the right. Classic with
 * 0/1/2 "colours"; here it generalises to any input by pivoting on the median.
 *
 * The three settled regions are colour-coded every frame so the partition is
 * always visible:  [0, low) < pivot · [low, mid) = pivot · (high, n) > pivot.
 * Positions [mid, high] are still unprocessed (plain).
 */
export function dutchNationalFlag(values: number[]): Step[] {
  const items = makeItems(values);
  const n = items.length;
  const pivot = [...values].sort((a, b) => a - b)[Math.floor((n - 1) / 2)];
  const steps: Step[] = [];

  /** Colour the three settled regions for the current pointer positions. */
  const regions = (
    low: number,
    mid: number,
    high: number,
  ): Record<number, HighlightKind> => {
    const m: Record<number, HighlightKind> = {};
    for (let p = 0; p < low; p++) m[p] = "less";
    for (let p = low; p < mid; p++) m[p] = "equal";
    for (let p = high + 1; p < n; p++) m[p] = "greater";
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

  push(
    {},
    `Three-way partition around pivot ${pivot}: smaller values go left, equal stay in the middle, larger go right.`,
    {},
  );

  let low = 0;
  let mid = 0;
  let high = n - 1;

  while (mid <= high) {
    const v = items[mid].value;
    const base = regions(low, mid, high);

    if (v < pivot) {
      if (low !== mid) {
        [items[low], items[mid]] = [items[mid], items[low]];
        push(
          { ...base, [low]: "swap", [mid]: "swap" },
          `${v} < ${pivot} → swap it into the left (“< pivot”) region.`,
          { low, mid, high },
        );
      } else {
        push(
          { ...base, [mid]: "less" },
          `${v} < ${pivot} → it's already in the left (“< pivot”) region.`,
          { low, mid, high },
        );
      }
      low++;
      mid++;
    } else if (v > pivot) {
      [items[mid], items[high]] = [items[high], items[mid]];
      push(
        { ...base, [mid]: "swap", [high]: "swap" },
        `${v} > ${pivot} → swap it to the right (“> pivot”) region. Mid stays put to re-check what came back.`,
        { low, mid, high },
      );
      high--;
    } else {
      push(
        { ...base, [mid]: "equal" },
        `${v} = ${pivot} → leave it in the middle (“= pivot”) region.`,
        { low, mid, high },
      );
      mid++;
    }
  }

  push(
    regions(low, mid, high),
    `Done — fully partitioned:  < ${pivot}  |  = ${pivot}  |  > ${pivot}. 🎉`,
    { low, mid, high },
  );

  return steps;
}
