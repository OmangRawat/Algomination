import { makeItems, type HighlightKind, type Step } from "../engine/types";

/**
 * Linear search as a pure step generator. Scans left to right, comparing each
 * element to the target until a match is found (or the array ends).
 */
export function linearSearch(values: number[], target?: number): Step[] {
  const items = makeItems(values);
  const steps: Step[] = [];
  const t = target ?? NaN;

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

  push({}, `Searching for ${t} with Linear Search.`);

  let found = -1;
  for (let i = 0; i < items.length; i++) {
    push(
      { [i]: "compare" },
      `Index ${i}: is ${items[i].value} equal to ${t}?`,
      { i },
    );
    if (items[i].value === t) {
      found = i;
      push({ [i]: "found" }, `Found ${t} at index ${i}! 🎉`, { i });
      break;
    }
  }

  if (found === -1) push({}, `${t} is not in the array.`);

  return steps;
}
