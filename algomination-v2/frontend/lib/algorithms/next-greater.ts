/**
 * Next Greater Element using a monotonic stack. The stack holds indices that
 * are still waiting for a larger value to their right. When a new element is
 * bigger than the value on top of the stack, it is that element's answer — pop
 * and record it. Each index is pushed and popped at most once, so it's O(n).
 */
export interface NgeStep {
  values: number[];
  /** Index currently being processed, or -1 before the scan / when done. */
  current: number;
  /** Indices waiting on the stack, bottom → top. */
  stack: number[];
  /** Answer per index; null until resolved (stays null = no greater element). */
  result: (number | null)[];
  /** Index resolved on this frame (for a highlight flash), else null. */
  resolved: number | null;
  caption: string;
}

export function nextGreaterElement(values: number[]): NgeStep[] {
  const n = values.length;
  const result: (number | null)[] = new Array(n).fill(null);
  const stack: number[] = [];
  const steps: NgeStep[] = [];

  const snap = (
    current: number,
    resolved: number | null,
    caption: string,
  ) =>
    steps.push({
      values: [...values],
      current,
      stack: [...stack],
      result: [...result],
      resolved,
      caption,
    });

  snap(
    -1,
    null,
    "Keep a stack of indices still waiting for a greater element to their right.",
  );

  for (let i = 0; i < n; i++) {
    snap(i, null, `Look at ${values[i]} (index ${i}).`);
    while (stack.length && values[stack[stack.length - 1]] < values[i]) {
      const idx = stack.pop()!;
      result[idx] = values[i];
      snap(
        i,
        idx,
        `${values[i]} > ${values[idx]} → the next greater element of ${values[idx]} (index ${idx}) is ${values[i]}. Pop it.`,
      );
    }
    stack.push(i);
    snap(
      i,
      null,
      `Push index ${i} (${values[i]}) — it now waits for its own next greater element.`,
    );
  }

  if (stack.length) {
    snap(
      -1,
      null,
      `Indices still on the stack have no greater element to their right → -1.`,
    );
  }
  snap(-1, null, "Done. 🎉");

  return steps;
}
