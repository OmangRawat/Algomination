import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Heap sort as a pure step generator. First builds a max-heap in place, then
 * repeatedly swaps the root (largest) to the end of the unsorted region and
 * sifts the new root down to restore the heap property.
 *
 * Highlight legend used here:
 *   range   → still part of the active (unsorted) heap
 *   active  → the node currently being sifted down
 *   compare → children being compared against the parent
 *   swap    → the two nodes exchanged this frame
 *   sorted  → settled in final position
 */
export function heapSort(values: number[]): Step[] {
  const items = makeItems(values);
  const n = items.length;
  const steps: Step[] = [];
  const sorted = new Set<number>();

  const push = (
    highlights: Record<number, HighlightKind>,
    caption: string,
    heapSize?: number,
  ) => {
    const marks: Record<number, HighlightKind> = {};
    // Everything inside the current heap reads as the active range...
    if (heapSize !== undefined) {
      for (let p = 0; p < heapSize; p++) marks[p] = "range";
    }
    // ...then sorted positions and the frame's specific highlights win.
    sorted.forEach((p) => (marks[p] = "sorted"));
    Object.assign(marks, highlights);
    steps.push({
      items: items.map((it) => ({ ...it })),
      highlights: marks,
      caption,
    });
  };

  push({}, "Starting Heap Sort. First, build a max-heap.");

  // Sift `i` down within the heap of size `size`.
  const siftDown = (i: number, size: number) => {
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;

      if (left < size) {
        push(
          { [largest]: "active", [left]: "compare" },
          `Compare parent ${items[i].value} with left child ${items[left].value}.`,
          size,
        );
        if (items[left].value > items[largest].value) largest = left;
      }
      if (right < size) {
        push(
          { [largest]: "active", [right]: "compare" },
          `Compare current largest ${items[largest].value} with right child ${items[right].value}.`,
          size,
        );
        if (items[right].value > items[largest].value) largest = right;
      }

      if (largest === i) {
        push(
          { [i]: "active" },
          `${items[i].value} is larger than its children — heap property holds.`,
          size,
        );
        return;
      }

      const a = items[i].value;
      const b = items[largest].value;
      [items[i], items[largest]] = [items[largest], items[i]];
      push(
        { [i]: "swap", [largest]: "swap" },
        `Swap ${a} with larger child ${b} to restore the heap.`,
        size,
      );
      i = largest;
    }
  };

  // Build the max-heap (bottom-up over internal nodes).
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    push(
      { [i]: "active" },
      `Heapify subtree rooted at index ${i} (${items[i].value}).`,
      n,
    );
    siftDown(i, n);
  }

  push({}, "Max-heap built — the largest value is at the root.", n);

  // Repeatedly extract the max.
  for (let end = n - 1; end > 0; end--) {
    const rootVal = items[0].value;
    const lastVal = items[end].value;
    [items[0], items[end]] = [items[end], items[0]];
    push(
      { 0: "swap", [end]: "swap" },
      `Move max ${rootVal} to position ${end + 1}; ${lastVal} becomes the new root.`,
      end,
    );
    sorted.add(end);
    push({}, `${rootVal} is now in its final position.`, end);
    siftDown(0, end);
  }

  sorted.add(0);
  push({}, "Array is fully sorted! 🎉");

  return steps;
}
