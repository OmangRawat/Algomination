import { describe, it, expect } from "vitest";
import type { Step } from "../../engine/types";
import { bubbleSort } from "../bubble";
import { selectionSort } from "../selection";
import { insertionSort } from "../insertion";
import { mergeSort } from "../merge";
import { quickSort } from "../quick";
import { heapSort } from "../heap";
import { linearSearch } from "../linear-search";
import { binarySearch } from "../binary-search";

const randomArray = (n: number, max = 99) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * max));

const multiset = (a: number[]) => [...a].sort((x, y) => x - y).join(",");
const isSorted = (a: number[]) => a.every((v, i) => i === 0 || a[i - 1] <= v);
const values = (s: Step) => s.items.map((it) => it.value);

const SORTS = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
} as const;

describe("sorting generators", () => {
  for (const [name, sort] of Object.entries(SORTS)) {
    it(`${name}: final frame is sorted and every frame is a permutation`, () => {
      for (let t = 0; t < 800; t++) {
        const input = randomArray(1 + Math.floor(Math.random() * 10));
        const expectedMs = multiset(input);
        const steps = sort(input);

        // Every frame must remain a permutation of the input (no value lost/dup).
        for (const step of steps) {
          expect(multiset(values(step))).toBe(expectedMs);
        }
        // The last frame must be fully sorted.
        const last = values(steps[steps.length - 1]);
        expect(isSorted(last)).toBe(true);
        expect(multiset(last)).toBe(expectedMs);
      }
    });
  }

  it("handles already-sorted and reverse-sorted inputs", () => {
    const asc = [1, 2, 3, 4, 5, 6];
    const desc = [6, 5, 4, 3, 2, 1];
    for (const sort of Object.values(SORTS)) {
      for (const input of [asc, desc]) {
        const steps = sort(input);
        const last = values(steps[steps.length - 1]);
        expect(last).toEqual([1, 2, 3, 4, 5, 6]);
      }
    }
  });
});

/** Position carrying the `found` highlight in the last matching frame, or -1. */
function foundIndex(steps: Step[]): number {
  for (let i = steps.length - 1; i >= 0; i--) {
    for (const [pos, kind] of Object.entries(steps[i].highlights)) {
      if (kind === "found") return Number(pos);
    }
  }
  return -1;
}

describe("linear search", () => {
  it("finds present targets and reports absent ones", () => {
    for (let t = 0; t < 1000; t++) {
      const input = randomArray(1 + Math.floor(Math.random() * 10), 20);
      const target = Math.floor(Math.random() * 25); // sometimes absent
      const steps = linearSearch(input, target);
      const fi = foundIndex(steps);
      if (input.includes(target)) {
        expect(fi).toBeGreaterThanOrEqual(0);
        expect(steps[steps.length - 1].items[fi].value).toBe(target);
      } else {
        expect(fi).toBe(-1);
      }
    }
  });
});

describe("binary search", () => {
  it("finds present targets in the sorted copy and reports absent ones", () => {
    for (let t = 0; t < 1000; t++) {
      const input = randomArray(1 + Math.floor(Math.random() * 12), 30);
      const target = Math.floor(Math.random() * 35);
      const steps = binarySearch(input, target);
      const fi = foundIndex(steps);
      if (input.includes(target)) {
        expect(fi).toBeGreaterThanOrEqual(0);
        // binary search sorts a copy, so the matched cell holds the target.
        expect(steps[steps.length - 1].items[fi].value).toBe(target);
      } else {
        expect(fi).toBe(-1);
      }
    }
  });
});
