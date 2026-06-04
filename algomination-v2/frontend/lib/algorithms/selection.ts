import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Selection sort as a pure step generator. Each pass scans the unsorted region
 * for the smallest element and swaps it into the boundary position.
 */
export function selectionSort(values: number[]): Step[] {
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
  ) => {
    steps.push({
      items: items.map((it) => ({ ...it })),
      highlights: { ...sortedMarks(), ...highlights },
      caption,
    });
  };

  push({}, "Starting Selection Sort.");

  for (let i = 0; i < n - 1; i++) {
    let minPos = i;
    push(
      { [minPos]: "min" },
      `Pass ${i + 1}: assume ${items[i].value} is the minimum.`,
    );

    for (let j = i + 1; j < n; j++) {
      push(
        { [minPos]: "min", [j]: "compare" },
        `Comparing ${items[j].value} with current minimum ${items[minPos].value}.`,
      );
      if (items[j].value < items[minPos].value) {
        minPos = j;
        push(
          { [minPos]: "min" },
          `${items[minPos].value} is the new minimum.`,
        );
      }
    }

    if (minPos !== i) {
      const a = items[i].value;
      const b = items[minPos].value;
      [items[i], items[minPos]] = [items[minPos], items[i]];
      push(
        { [i]: "swap", [minPos]: "swap" },
        `Swap minimum ${b} into position ${i + 1} (was ${a}).`,
      );
    } else {
      push({ [i]: "min" }, `${items[i].value} is already the minimum.`);
    }

    sorted.add(i);
    push({}, `${items[i].value} is now in its final position.`);
  }

  for (let k = 0; k < n; k++) sorted.add(k);
  push({}, "Array is fully sorted! 🎉");

  return steps;
}
