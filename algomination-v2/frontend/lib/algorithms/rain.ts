/**
 * Trapping Rain Water (two-pointer). Water above any bar is bounded by the
 * shorter of the tallest wall to its left and the tallest wall to its right.
 * Two pointers walk inward from both ends; whichever side is shorter is safe to
 * resolve, because its limiting wall is already known. Each frame is a snapshot.
 */
export interface RainStep {
  /** Bar heights (unchanged across the run). */
  heights: number[];
  /** Trapped water units sitting on top of each bar, settled so far. */
  water: number[];
  left: number;
  right: number;
  leftMax: number;
  rightMax: number;
  total: number;
  caption: string;
}

export function trapRainWater(heights: number[]): RainStep[] {
  const n = heights.length;
  const water = new Array(n).fill(0);
  const steps: RainStep[] = [];

  let left = 0;
  let right = n - 1;
  let leftMax = 0;
  let rightMax = 0;
  let total = 0;

  const snap = (caption: string) =>
    steps.push({
      heights: [...heights],
      water: [...water],
      left,
      right,
      leftMax,
      rightMax,
      total,
      caption,
    });

  snap(
    "Two pointers start at both ends. The water over each bar is capped by the shorter surrounding wall.",
  );

  while (left < right) {
    if (heights[left] <= heights[right]) {
      if (heights[left] >= leftMax) {
        leftMax = heights[left];
        snap(
          `Left bar ${heights[left]} is a new left-max wall — it holds no water itself.`,
        );
      } else {
        const w = leftMax - heights[left];
        water[left] = w;
        total += w;
        snap(
          `Left bar ${heights[left]} < left-max ${leftMax} → trap ${w} unit(s) here. Total = ${total}.`,
        );
      }
      left++;
    } else {
      if (heights[right] >= rightMax) {
        rightMax = heights[right];
        snap(
          `Right bar ${heights[right]} is a new right-max wall — it holds no water itself.`,
        );
      } else {
        const w = rightMax - heights[right];
        water[right] = w;
        total += w;
        snap(
          `Right bar ${heights[right]} < right-max ${rightMax} → trap ${w} unit(s) here. Total = ${total}.`,
        );
      }
      right--;
    }
  }

  snap(`Done. Total trapped water = ${total} unit(s). 🎉`);

  return steps;
}
