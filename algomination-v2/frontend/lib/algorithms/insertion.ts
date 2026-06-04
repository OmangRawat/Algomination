import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Insertion sort as a pure step generator. Grows a sorted prefix on the left by
 * taking each next element ("the key") and sliding it left past larger
 * neighbours until it sits in the right spot.
 */
export function insertionSort(values: number[]): Step[] {
  const items = makeItems(values);
  const n = items.length;
  const steps: Step[] = [];

  // Positions [0..prefix-1] are the sorted region.
  let prefix = 1;
  const prefixMarks = (): Record<number, HighlightKind> => {
    const marks: Record<number, HighlightKind> = {};
    for (let p = 0; p < prefix; p++) marks[p] = "sorted";
    return marks;
  };

  const push = (
    highlights: Record<number, HighlightKind>,
    caption: string,
  ) => {
    steps.push({
      items: items.map((it) => ({ ...it })),
      highlights: { ...prefixMarks(), ...highlights },
      caption,
    });
  };

  push({}, "Starting Insertion Sort. The first element is a sorted prefix.");

  for (let i = 1; i < n; i++) {
    const key = items[i].value;
    push({ [i]: "active" }, `Take ${key} as the key to insert.`);

    let j = i;
    while (j > 0 && items[j - 1].value > items[j].value) {
      push(
        { [j - 1]: "compare", [j]: "active" },
        `${items[j - 1].value} > ${key}, shift it right.`,
      );
      [items[j - 1], items[j]] = [items[j], items[j - 1]];
      push({ [j - 1]: "active", [j]: "swap" }, `Move ${key} left.`);
      j--;
    }

    if (j > 0) {
      push(
        { [j - 1]: "compare", [j]: "active" },
        `${items[j - 1].value} ≤ ${key}, ${key} is in place.`,
      );
    }

    prefix = i + 1;
    push({}, `Sorted prefix now has ${prefix} element${prefix > 1 ? "s" : ""}.`);
  }

  push({}, "Array is fully sorted! 🎉");

  return steps;
}
