import type { Step } from "../engine/types";
import { bubbleSort } from "./bubble";
import { selectionSort } from "./selection";
import { insertionSort } from "./insertion";
import { mergeSort } from "./merge";
import { quickSort } from "./quick";
import { linearSearch } from "./linear-search";
import { binarySearch } from "./binary-search";

export type Category = "sorting" | "searching" | "data-structures";

export interface AlgoMeta {
  slug: string;
  title: string;
  blurb: string;
  category: Category;
  complexity?: { time: string; space: string };
  defaultInput?: string;
  /** Pure step generator. Present only for shipped ("live") algorithms. */
  generate?: (values: number[], target?: number) => Step[];
  status: "live" | "soon";
  /** Search algorithms: prompt for a target value. */
  needsTarget?: boolean;
  defaultTarget?: number;
  /** Binary search: input is sorted automatically. */
  requiresSorted?: boolean;
}

/**
 * Single source of truth for every visualizer. Category hubs read this to build
 * their card grids; the [slug] route looks up `generate` to render the player.
 * New algorithms are added here as they ship.
 */
export const ALGORITHMS: AlgoMeta[] = [
  {
    slug: "bubble",
    title: "Bubble Sort",
    blurb:
      "Repeatedly swaps adjacent out-of-order pairs; the largest value bubbles to the end each pass.",
    category: "sorting",
    complexity: { time: "O(n²)", space: "O(1)" },
    defaultInput: "5 3 8 1 9 2 7",
    generate: bubbleSort,
    status: "live",
  },
  {
    slug: "selection",
    title: "Selection Sort",
    blurb:
      "Selects the smallest remaining element each pass and moves it into place.",
    category: "sorting",
    complexity: { time: "O(n²)", space: "O(1)" },
    defaultInput: "8 4 1 6 3 9 2",
    generate: selectionSort,
    status: "live",
  },
  {
    slug: "insertion",
    title: "Insertion Sort",
    blurb:
      "Builds a sorted prefix by inserting each new element into its correct spot.",
    category: "sorting",
    complexity: { time: "O(n²)", space: "O(1)" },
    defaultInput: "6 2 9 1 7 3 8",
    generate: insertionSort,
    status: "live",
  },
  {
    slug: "merge",
    title: "Merge Sort",
    blurb:
      "Recursively splits the array, then merges sorted halves back together. Stable, O(n log n).",
    category: "sorting",
    complexity: { time: "O(n log n)", space: "O(n)" },
    defaultInput: "8 3 5 1 9 2 7 4",
    generate: mergeSort,
    status: "live",
  },
  {
    slug: "quick",
    title: "Quick Sort",
    blurb:
      "Partitions around a pivot so smaller elements move left, then recurses on each side.",
    category: "sorting",
    complexity: { time: "O(n log n)", space: "O(log n)" },
    defaultInput: "8 3 5 1 9 2 7 4",
    generate: quickSort,
    status: "live",
  },

  {
    slug: "linear",
    title: "Linear Search",
    blurb:
      "Scans the array left to right, comparing each element to the target until it's found.",
    category: "searching",
    complexity: { time: "O(n)", space: "O(1)" },
    defaultInput: "7 2 9 4 5 1 8",
    defaultTarget: 5,
    needsTarget: true,
    generate: linearSearch,
    status: "live",
  },
  {
    slug: "binary",
    title: "Binary Search",
    blurb:
      "Repeatedly halves a sorted range, checking the middle element against the target.",
    category: "searching",
    complexity: { time: "O(log n)", space: "O(1)" },
    defaultInput: "1 3 5 7 9 11 13 15",
    defaultTarget: 9,
    needsTarget: true,
    requiresSorted: true,
    generate: binarySearch,
    status: "live",
  },

  {
    slug: "stack",
    title: "Stack",
    blurb:
      "A LIFO structure — push adds to the top, pop removes the top, peek inspects it. All O(1).",
    category: "data-structures",
    complexity: { time: "O(1)", space: "O(n)" },
    status: "live",
  },
  {
    slug: "queue",
    title: "Queue",
    blurb:
      "A FIFO structure — enqueue adds to the rear, dequeue removes from the front, peek inspects it. All O(1).",
    category: "data-structures",
    complexity: { time: "O(1)", space: "O(n)" },
    status: "live",
  },
];

export function getAlgo(category: Category, slug: string): AlgoMeta | undefined {
  return ALGORITHMS.find((a) => a.category === category && a.slug === slug);
}

export function algosByCategory(category: Category): AlgoMeta[] {
  return ALGORITHMS.filter((a) => a.category === category);
}
