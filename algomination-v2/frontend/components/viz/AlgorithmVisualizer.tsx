"use client";

import { getAlgo, type Category } from "@/lib/algorithms/registry";
import { VisualizerShell } from "./VisualizerShell";

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
