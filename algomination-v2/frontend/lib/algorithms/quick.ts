import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Quick sort (Lomuto partition) as a pure step generator. Picks the last
 * element as the pivot, partitions smaller elements to its left, then recurses
 * on each side. Highlights the pivot and the i/j scan pointers.
 */
export function quickSort(values: number[]): Step[] {
  const items = makeItems(values);
  const n = items.length;
  const steps: Step[] = [];
  const sorted = new Set<number>();

  const sortedMarks = (): Record<number, HighlightKind> => {
    const marks: Record<number, HighlightKind> = {};
    sorted.forEach((p) => (marks[p] = "sorted"));
    return marks;
  };

  const push = (
    highlights: Record<number, HighlightKind>,
    caption: string,
    pointers?: Record<string, number>,
  ) => {
    steps.push({
      items: items.map((it) => ({ ...it })),
      highlights: { ...sortedMarks(), ...highlights },
      pointers,
      caption,
    });
  };

  push({}, "Starting Quick Sort.");

  function partition(lo: number, hi: number): number {
    const pivot = items[hi].value;
    push(
      { [hi]: "pivot" },
      `Partition [${lo}..${hi}] with pivot ${pivot}.`,
      { pivot: hi },
    );

    let i = lo;
    for (let j = lo; j < hi; j++) {
      push(
        { [hi]: "pivot", [j]: "compare" },
        `Is ${items[j].value} < pivot ${pivot}?`,
        { i, j, pivot: hi },
      );
      if (items[j].value < pivot) {
        if (i !== j) {
          const a = items[i].value;
          const b = items[j].value;
          [items[i], items[j]] = [items[j], items[i]];
          push(
            { [hi]: "pivot", [i]: "swap", [j]: "swap" },
            `Yes → swap ${b} left (past ${a}).`,
            { i, j, pivot: hi },
          );
        }
        i++;
      }
    }

    if (i !== hi) {
      [items[i], items[hi]] = [items[hi], items[i]];
      push(
        { [i]: "swap", [hi]: "swap" },
        `Move pivot ${pivot} into position ${i}.`,
        { pivot: i },
      );
    }
    return i;
  }

  function qs(lo: number, hi: number) {
    if (lo > hi) return;
    if (lo === hi) {
      sorted.add(lo);
      return;
    }
    const p = partition(lo, hi);
    sorted.add(p);
    push({}, `${items[p].value} is in its final position.`);
    qs(lo, p - 1);
    qs(p + 1, hi);
  }

  qs(0, n - 1);

  const allSorted: Record<number, HighlightKind> = {};
  for (let p = 0; p < n; p++) allSorted[p] = "sorted";
  push(allSorted, "Array is fully sorted! 🎉");

  return steps;
}
