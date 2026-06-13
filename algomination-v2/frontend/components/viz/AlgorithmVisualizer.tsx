"use client";

import { getAlgo, type Category } from "@/lib/algorithms/registry";
import { VisualizerShell } from "./VisualizerShell";
import { MergeSortVisualizer } from "./MergeSortVisualizer";
import { HeapSortVisualizer } from "./HeapSortVisualizer";

/**
 * Client bridge: looks up an algorithm's step generator from the registry and
 * renders the shared visualizer. Server pages pass plain strings (slug,
 * category) so no non-serializable function crosses the boundary.
 */
export function AlgorithmVisualizer({
  category,
  slug,
}: {
  category: Category;
  slug: string;
}) {
  const algo = getAlgo(category, slug);

  if (!algo?.generate) {
    return (
      <p className="text-muted">This visualizer isn&apos;t available yet.</p>
    );
  }

  // Sorts with a structure worth showing get a bespoke renderer.
  if (category === "sorting" && slug === "merge") {
    return (
      <MergeSortVisualizer
        title={algo.title}
        description={algo.blurb}
        complexity={algo.complexity}
        defaultInput={algo.defaultInput}
      />
    );
  }
  if (category === "sorting" && slug === "heap") {
    return (
      <HeapSortVisualizer
        title={algo.title}
        description={algo.blurb}
        complexity={algo.complexity}
        defaultInput={algo.defaultInput}
      />
    );
  }

  return (
    <VisualizerShell
      title={algo.title}
      description={algo.blurb}
      generate={algo.generate}
      defaultInput={algo.defaultInput}
      complexity={algo.complexity}
      needsTarget={algo.needsTarget}
      defaultTarget={algo.defaultTarget}
      requiresSorted={algo.requiresSorted}
    />
  );
}
