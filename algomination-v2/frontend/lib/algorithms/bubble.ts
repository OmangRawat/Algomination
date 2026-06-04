import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Bubble sort as a pure step generator. Repeatedly compares adjacent pairs and
 * swaps them if out of order; after each pass the largest remaining element
 * "bubbles" to its final position at the end.
 */
export function bubbleSort(values: number[]): Step[] {
  const items = makeItems(values);
  const n = items.length;
  const steps: Step[] = [];
  const sorted = new Set<number>(); // positions known to be in final place

  const sortedMarks = (): Record<number, HighlightKind> => {
    const marks: Record<number, HighlightKind> = {};
    sorted.forEach((p) => (marks[p] = "sorted"));
    return marks;
  };

  const push = (
    highlights: Record<number, HighlightKind>,
    caption: string,
  ) => {
    steps.push({
      items: items.map((it) => ({ ...it })),
      highlights: { ...sortedMarks(), ...highlights },
      caption,
    });
  };

  push({}, "Starting Bubble Sort.");

  for (let i = 0; i < n - 1; i++) {
    let swappedAny = false;

    for (let j = 0; j < n - i - 1; j++) {
      push(
        { [j]: "compare", [j + 1]: "compare" },
        `Comparing ${items[j].value} and ${items[j + 1].value}.`,
      );

      if (items[j].value > items[j + 1].value) {
        const a = items[j].value;
        const b = items[j + 1].value;
        [items[j], items[j + 1]] = [items[j + 1], items[j]];
        swappedAny = true;
        push(
          { [j]: "swap", [j + 1]: "swap" },
          `${a} > ${b}, so swap them.`,
        );
      }
    }

    sorted.add(n - i - 1);
    push({}, `${items[n - i - 1].value} is now in its final position.`);

    if (!swappedAny) {
      for (let k = 0; k < n; k++) sorted.add(k);
      break;
    }
  }

  for (let k = 0; k < n; k++) sorted.add(k);
  push({}, "Array is fully sorted! 🎉");

  return steps;
}
