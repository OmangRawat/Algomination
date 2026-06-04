import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Merge sort as a pure step generator. Recursively splits the array, then
 * merges sorted sub-arrays back together by repeatedly placing the smaller
 * front element. Item identities are preserved so placements animate.
 */
export function mergeSort(values: number[]): Step[] {
  const items = makeItems(values);
  const n = items.length;
  const steps: Step[] = [];

  const rangeMarks = (
    lo: number,
    hi: number,
    kind: HighlightKind = "range",
  ): Record<number, HighlightKind> => {
    const marks: Record<number, HighlightKind> = {};
    for (let p = lo; p <= hi; p++) marks[p] = kind;
    return marks;
  };

  const push = (
    highlights: Record<number, HighlightKind>,
    caption: string,
  ) => {
    steps.push({
      items: items.map((it) => ({ ...it })),
      highlights: { ...highlights },
      caption,
    });
  };

  push({}, "Starting Merge Sort.");

  function merge(lo: number, mid: number, hi: number) {
    const left = items.slice(lo, mid + 1);
    const right = items.slice(mid + 1, hi + 1);
    push(rangeMarks(lo, hi), `Merge [${lo}..${mid}] and [${mid + 1}..${hi}].`);

    // Compute the merged order of the two (already sorted) halves.
    const merged = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      merged.push(left[i].value <= right[j].value ? left[i++] : right[j++]);
    }
    while (i < left.length) merged.push(left[i++]);
    while (j < right.length) merged.push(right[j++]);

    // Realize that order in-place via swaps, so every frame stays a valid
    // permutation (no transient duplicates) while items animate into place.
    for (let k = lo; k <= hi; k++) {
      const target = merged[k - lo];
      if (items[k].id !== target.id) {
        let idx = k;
        while (items[idx].id !== target.id) idx++;
        [items[k], items[idx]] = [items[idx], items[k]];
      }
      push(
        { ...rangeMarks(lo, hi), [k]: "swap" },
        `Place ${target.value} into position ${k}.`,
      );
    }
    push(rangeMarks(lo, hi, "sorted"), `Sub-array [${lo}..${hi}] is merged.`);
  }

  function sort(lo: number, hi: number) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    push(
      rangeMarks(lo, hi),
      `Split [${lo}..${hi}] at ${mid}.`,
    );
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  sort(0, n - 1);

  const allSorted: Record<number, HighlightKind> = {};
  for (let p = 0; p < n; p++) allSorted[p] = "sorted";
  push(allSorted, "Array is fully sorted! 🎉");

  return steps;
}
