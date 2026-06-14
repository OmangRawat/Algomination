import type { Step } from "../engine/types";
import { bubbleSort } from "./bubble";
import { selectionSort } from "./selection";
import { insertionSort } from "./insertion";
import { mergeSort } from "./merge";
import { quickSort } from "./quick";
import { heapSort } from "./heap";
import { linearSearch } from "./linear-search";
import { binarySearch } from "./binary-search";
import { kadaneMaxSubarray } from "./kadane";
import { twoPointerPairSum } from "./two-pointer-pair-sum";
import { slidingWindowMaxSum } from "./sliding-window";
import { dutchNationalFlag } from "./dutch-flag";

export type Category = "sorting" | "searching" | "array" | "data-structures";

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
  /** Plain-English explanation of the core mechanic and the per-pass invariant. */
  insight?: { idea: string; eachPass: string };
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
    insight: {
      idea: "Repeatedly walk the array swapping any adjacent pair that's out of order.",
      eachPass:
        "After each full pass the largest value still unsorted has 'bubbled' all the way to its final place at the end — so the sorted region grows by one from the right every pass.",
    },
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
    insight: {
      idea: "Each pass scans the unsorted region for the smallest element and swaps it into place.",
      eachPass:
        "After pass k the k smallest elements are locked into their final positions at the front — the sorted region grows by one from the left each pass.",
    },
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
    insight: {
      idea: "Take each new element and slide it left into its correct spot among the already-sorted prefix.",
      eachPass:
        "After inserting the k-th element the first k+1 elements are sorted relative to each other — that sorted prefix grows by one each step (its values may still shift once later elements arrive).",
    },
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
    insight: {
      idea: "Recursively split the array in half until each piece is a single element, then merge halves back together in order.",
      eachPass:
        "Each merge fuses two already-sorted sub-arrays into one bigger sorted sub-array. Working up the tree, the sorted runs double in size every level until the whole array is one sorted run.",
    },
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
    insight: {
      idea: "Pick a pivot and partition the sub-array so smaller values move left and larger move right, then recurse on each side.",
      eachPass:
        "After each partition the pivot lands in its final sorted position — everything to its left is smaller and everything to its right is larger — so every partition permanently places at least one element. The two sides are then sorted the same way.",
    },
    status: "live",
  },
  {
    slug: "heap",
    title: "Heap Sort",
    blurb:
      "Builds a max-heap, then repeatedly swaps the largest element to the end and sifts the root down. In-place, O(n log n).",
    category: "sorting",
    complexity: { time: "O(n log n)", space: "O(1)" },
    defaultInput: "4 10 3 5 1 8 2 7",
    generate: heapSort,
    insight: {
      idea: "First rearrange the array into a max-heap (every parent ≥ its children), then repeatedly pull out the largest element.",
      eachPass:
        "Once the heap is built, each iteration swaps the root (the current maximum) to the end of the heap, shrinks the heap by one, and sifts the new root down to restore the heap. So the array fills with the largest values from the back forward.",
    },
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
    insight: {
      idea: "Check elements one by one from left to right until the target turns up.",
      eachPass:
        "Each step compares exactly one element to the target: a match ends the search, otherwise you move one position right. After k steps you know the target isn't in the first k elements.",
    },
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
    insight: {
      idea: "On sorted data, compare the target to the middle element and throw away the half it can't be in.",
      eachPass:
        "Each step checks the middle of the current range and discards half the remaining elements, so the search space halves every iteration — n elements are exhausted in about log₂(n) steps.",
    },
    status: "live",
  },

  {
    slug: "kadane",
    title: "Kadane's Algorithm (Maximum Subarray)",
    blurb:
      "Finds the contiguous subarray with the largest sum in a single pass. Works with negative numbers by restarting the running window whenever it would only drag the total down.",
    category: "array",
    complexity: { time: "O(n)", space: "O(1)" },
    defaultInput: "-2 1 -3 4 -1 2 1 -5 4",
    generate: kadaneMaxSubarray,
    insight: {
      idea: "Sweep left to right keeping the best sum of a subarray that ends at the current element; whenever that running sum turns negative, start a fresh window here.",
      eachPass:
        "At each index you decide to either extend the current window or restart it, then compare against the best total seen so far. After visiting index i you know the maximum subarray sum within the first i+1 elements — so one full pass settles the whole array.",
    },
    status: "live",
  },
  {
    slug: "two-pointer-pair-sum",
    title: "Two-Pointer Pair Sum",
    blurb:
      "On a sorted array, finds two values that add up to a target using a pointer at each end — moving them inward based on whether the current sum is too small or too large.",
    category: "array",
    complexity: { time: "O(n)", space: "O(1)" },
    defaultInput: "1 2 3 4 6 8 9 11",
    defaultTarget: 10,
    needsTarget: true,
    requiresSorted: true,
    generate: twoPointerPairSum,
    insight: {
      idea: "With the array sorted, one pointer starts at the smallest value and one at the largest; their sum tells you exactly which pointer to move.",
      eachPass:
        "If the pair sums too low, the left pointer steps right to a bigger value; if too high, the right pointer steps left to a smaller one. Every step permanently rules out one element, so the two pointers meet after at most n steps.",
    },
    status: "live",
  },
  {
    slug: "sliding-window-max-sum",
    title: "Sliding Window (Max Sum of K)",
    blurb:
      "Finds the maximum sum of any K consecutive elements. Instead of re-adding the whole window each time, it slides one step — subtracting the element that leaves and adding the one that enters.",
    category: "array",
    complexity: { time: "O(n)", space: "O(1)" },
    defaultInput: "2 1 5 1 3 2 8 1",
    defaultTarget: 3,
    needsTarget: true,
    generate: slidingWindowMaxSum,
    insight: {
      idea: "Sum the first K elements once, then reuse that sum: each slide drops the leftmost element and adds the next one on the right.",
      eachPass:
        "Every slide costs just one subtraction and one addition to get the new window's sum, which is compared against the best so far. The window visits each element once, so the whole array is scanned in O(n) rather than O(n·K).",
    },
    status: "live",
  },
  {
    slug: "dutch-national-flag",
    title: "Dutch National Flag (3-Way Partition)",
    blurb:
      "Partitions an array into three regions — less than, equal to, and greater than a pivot — in one pass with three pointers. The classic problem of sorting an array of 0s, 1s, and 2s.",
    category: "array",
    complexity: { time: "O(n)", space: "O(1)" },
    defaultInput: "9 4 7 4 2 4 8 1 4 6",
    generate: dutchNationalFlag,
    insight: {
      idea: "Three pointers (low, mid, high) carve the array into a smaller-than region on the left, an equal region in the middle, and a greater-than region on the right.",
      eachPass:
        "Each step inspects the value at mid: smaller values swap left and both low and mid advance; larger values swap to the right and high retreats (mid stays to re-check the value that came back); equal values just advance mid. One pass fully partitions the array.",
    },
    status: "live",
  },
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    blurb:
      "Computes how much water is trapped between bars of an elevation map. Two pointers walk inward from both ends, resolving the shorter side first since its limiting wall is already known.",
    category: "array",
    complexity: { time: "O(n)", space: "O(1)" },
    defaultInput: "0 1 0 2 1 0 1 3 2 1 2 1",
    insight: {
      idea: "Water above a bar is capped by the shorter of the tallest wall to its left and the tallest to its right. Two pointers track those running maxima from each end.",
      eachPass:
        "Whichever side currently has the shorter bar is safe to settle: its bounding wall on that side is already final. Add (sideMax − barHeight) units of water there and move that pointer inward. Each bar is resolved exactly once.",
    },
    status: "live",
  },
  {
    slug: "next-greater-element",
    title: "Next Greater Element",
    blurb:
      "For each element, finds the first larger value to its right using a monotonic stack of indices that are still waiting for their answer. Each index is pushed and popped at most once.",
    category: "array",
    complexity: { time: "O(n)", space: "O(n)" },
    defaultInput: "4 5 2 25 7 8",
    insight: {
      idea: "Keep a stack of indices whose next-greater element hasn't been found yet, ordered so their values decrease from bottom to top.",
      eachPass:
        "When a new value is larger than the value on top of the stack, it is that index's next greater element — pop and record it, repeating until the top is bigger. Then push the new index. Every index enters and leaves the stack once, giving O(n).",
    },
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
  {
    slug: "linked-list",
    title: "Linked List",
    blurb:
      "A chain of nodes where each points to the next. Insert/delete at the ends in O(1); search is O(n).",
    category: "data-structures",
    complexity: { time: "O(n)", space: "O(n)" },
    status: "live",
  },
  {
    slug: "doubly-linked-list",
    title: "Doubly Linked List",
    blurb:
      "Like a linked list, but each node also points to the previous one — enabling traversal in both directions.",
    category: "data-structures",
    complexity: { time: "O(n)", space: "O(n)" },
    status: "live",
  },
  {
    slug: "binary-search-tree",
    title: "Binary Search Tree",
    blurb:
      "An ordered tree where every left child is smaller and every right child larger. Insert, search, and delete in O(log n) on average, and traverse it breadth-first (level-order) or depth-first (pre-, in-, and post-order).",
    category: "data-structures",
    complexity: { time: "O(log n)", space: "O(n)" },
    status: "live",
  },
  {
    slug: "hash-table",
    title: "Hash Table",
    blurb:
      "Maps keys to buckets with a hash function for O(1) average lookup. Collisions are handled by chaining entries within a bucket.",
    category: "data-structures",
    complexity: { time: "O(1)", space: "O(n)" },
    status: "live",
  },
  {
    slug: "graph-traversal",
    title: "Graph Traversal (BFS & DFS)",
    blurb:
      "Explore a graph from a start node. Breadth-first search fans out level by level using a queue; depth-first search dives deep using a stack.",
    category: "data-structures",
    complexity: { time: "O(V + E)", space: "O(V)" },
    status: "live",
  },
  {
    slug: "priority-queue",
    title: "Priority Queue (Heap)",
    blurb:
      "A binary heap that always serves the highest-priority element first. Insert sifts up and extract sifts down in O(log n); peek is O(1). Switch between a min-heap and a max-heap.",
    category: "data-structures",
    complexity: { time: "O(log n)", space: "O(n)" },
    status: "live",
  },
  {
    slug: "trie",
    title: "Trie (Prefix Tree)",
    blurb:
      "Stores strings character by character so words with shared prefixes share a path. Insert, search, and prefix-match all run in O(L) for a word of length L.",
    category: "data-structures",
    complexity: { time: "O(L)", space: "O(n)" },
    status: "live",
  },
  {
    slug: "avl-tree",
    title: "AVL Tree (Self-Balancing BST)",
    blurb:
      "A binary search tree that rotates after every insert and delete to keep itself balanced, guaranteeing O(log n) operations. Each node's balance factor stays within {-1, 0, 1}.",
    category: "data-structures",
    complexity: { time: "O(log n)", space: "O(n)" },
    status: "live",
  },
  {
    slug: "union-find",
    title: "Union-Find (Disjoint Set)",
    blurb:
      "Tracks a partition of elements into disjoint sets. Union merges two sets by rank and Find locates a set's root with path compression, giving near-constant amortized time.",
    category: "data-structures",
    complexity: { time: "O(α(n))", space: "O(n)" },
    status: "live",
  },
];

export function getAlgo(category: Category, slug: string): AlgoMeta | undefined {
  return ALGORITHMS.find((a) => a.category === category && a.slug === slug);
}

export function algosByCategory(category: Category): AlgoMeta[] {
  return ALGORITHMS.filter((a) => a.category === category);
}
