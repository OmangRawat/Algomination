import { describe, it, expect } from "vitest";
import type { Step } from "../../engine/types";
import { kadaneMaxSubarray } from "../kadane";
import { twoPointerPairSum } from "../two-pointer-pair-sum";
import { slidingWindowMaxSum } from "../sliding-window";
import { dutchNationalFlag } from "../dutch-flag";
import { trapRainWater } from "../rain";
import { nextGreaterElement } from "../next-greater";

const randomArray = (n: number, max = 99, min = 0) =>
  Array.from({ length: n }, () => min + Math.floor(Math.random() * (max - min)));

const multiset = (a: number[]) => [...a].sort((x, y) => x - y).join(",");
const values = (s: Step) => s.items.map((it) => it.value);
const last = <T>(a: T[]) => a[a.length - 1];

/** Positions carrying the `found` highlight in a step. */
const foundPositions = (step: Step) =>
  Object.entries(step.highlights)
    .filter(([, k]) => k === "found")
    .map(([p]) => Number(p));

// ── Kadane ────────────────────────────────────────────────────────────────
const bruteMaxSubarray = (a: number[]) => {
  let best = -Infinity;
  for (let i = 0; i < a.length; i++) {
    let cur = 0;
    for (let j = i; j < a.length; j++) {
      cur += a[j];
      if (cur > best) best = cur;
    }
  }
  return best;
};

describe("Kadane's maximum subarray", () => {
  it("the highlighted result window sums to the true maximum", () => {
    for (let t = 0; t < 1500; t++) {
      const input = randomArray(1 + Math.floor(Math.random() * 10), 50, -50);
      const steps = kadaneMaxSubarray(input);
      const positions = foundPositions(last(steps)).sort((x, y) => x - y);
      const finalValues = values(last(steps));
      const sum = positions.reduce((s, p) => s + finalValues[p], 0);
      // Result window must be contiguous and sum to the brute-force maximum.
      expect(positions[positions.length - 1] - positions[0]).toBe(
        positions.length - 1,
      );
      expect(sum).toBe(bruteMaxSubarray(input));
    }
  });
});

// ── Two-pointer pair sum ────────────────────────────────────────────────────
describe("two-pointer pair sum", () => {
  it("finds a valid pair when one exists, and reports none otherwise", () => {
    for (let t = 0; t < 1500; t++) {
      const input = randomArray(2 + Math.floor(Math.random() * 9), 40);
      const sorted = [...input].sort((a, b) => a - b);
      // Half the time pick a guaranteed-present sum.
      let target: number;
      if (Math.random() < 0.6 && sorted.length >= 2) {
        const i = Math.floor(Math.random() * sorted.length);
        let j = Math.floor(Math.random() * sorted.length);
        if (j === i) j = (j + 1) % sorted.length;
        target = sorted[i] + sorted[j];
      } else {
        target = Math.floor(Math.random() * 90);
      }

      const exists = (() => {
        let lo = 0,
          hi = sorted.length - 1;
        while (lo < hi) {
          const s = sorted[lo] + sorted[hi];
          if (s === target) return true;
          if (s < target) lo++;
          else hi--;
        }
        return false;
      })();

      const steps = twoPointerPairSum(input, target);
      const found = foundPositions(last(steps));
      if (exists) {
        expect(found.length).toBe(2);
        const fv = values(last(steps));
        expect(fv[found[0]] + fv[found[1]]).toBe(target);
      } else {
        expect(found.length).toBe(0);
      }
    }
  });
});

// ── Sliding window ──────────────────────────────────────────────────────────
const bruteWindowMax = (a: number[], k: number) => {
  let best = -Infinity;
  for (let i = 0; i + k <= a.length; i++) {
    let s = 0;
    for (let j = i; j < i + k; j++) s += a[j];
    if (s > best) best = s;
  }
  return best;
};

describe("sliding window max sum", () => {
  it("the highlighted window sums to the best K-window sum", () => {
    for (let t = 0; t < 1500; t++) {
      const n = 2 + Math.floor(Math.random() * 10);
      const input = randomArray(n, 40);
      const rawK = 1 + Math.floor(Math.random() * (n + 2)); // sometimes > n
      const k = Math.min(rawK, n);
      const steps = slidingWindowMaxSum(input, rawK);
      const positions = foundPositions(last(steps));
      const fv = values(last(steps));
      const sum = positions.reduce((s, p) => s + fv[p], 0);
      expect(positions.length).toBe(k);
      expect(sum).toBe(bruteWindowMax(input, k));
    }
  });
});

// ── Dutch National Flag ─────────────────────────────────────────────────────
describe("Dutch National Flag three-way partition", () => {
  it("groups values < = > pivot and preserves the multiset", () => {
    for (let t = 0; t < 1500; t++) {
      const input = randomArray(1 + Math.floor(Math.random() * 11), 12);
      const pivot = [...input].sort((a, b) => a - b)[
        Math.floor((input.length - 1) / 2)
      ];
      const steps = dutchNationalFlag(input);
      const out = values(last(steps));
      expect(multiset(out)).toBe(multiset(input));
      // Region codes must be non-decreasing: 0 (<), 1 (=), 2 (>).
      const codes = out.map((v) => (v < pivot ? 0 : v === pivot ? 1 : 2));
      for (let i = 1; i < codes.length; i++) {
        expect(codes[i]).toBeGreaterThanOrEqual(codes[i - 1]);
      }
    }
  });
});

// ── Trapping Rain Water ─────────────────────────────────────────────────────
const bruteTrap = (h: number[]) => {
  let total = 0;
  for (let i = 0; i < h.length; i++) {
    let l = 0,
      r = 0;
    for (let j = 0; j <= i; j++) l = Math.max(l, h[j]);
    for (let j = i; j < h.length; j++) r = Math.max(r, h[j]);
    total += Math.max(0, Math.min(l, r) - h[i]);
  }
  return total;
};

describe("trapping rain water", () => {
  it("the reported total matches the brute-force amount", () => {
    for (let t = 0; t < 1500; t++) {
      const input = randomArray(3 + Math.floor(Math.random() * 12), 10);
      const frames = trapRainWater(input);
      expect(last(frames).total).toBe(bruteTrap(input));
    }
  });
});

// ── Next Greater Element ────────────────────────────────────────────────────
const bruteNge = (a: number[]) =>
  a.map((v, i) => {
    for (let j = i + 1; j < a.length; j++) if (a[j] > v) return a[j];
    return null;
  });

describe("next greater element", () => {
  it("the final result matches the brute-force answer", () => {
    for (let t = 0; t < 1500; t++) {
      const input = randomArray(1 + Math.floor(Math.random() * 10), 30);
      const frames = nextGreaterElement(input);
      expect(last(frames).result).toEqual(bruteNge(input));
    }
  });
});
