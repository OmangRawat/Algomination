"use client";

import { getAlgo } from "@/lib/algorithms/registry";
import type { Step } from "@/lib/engine/types";
import { VisualizerShell } from "./VisualizerShell";
import { TrappingRainVisualizer } from "./TrappingRainVisualizer";
import { NextGreaterVisualizer } from "./NextGreaterVisualizer";
import { SlidingWindowBars, PartitionBars } from "./ArrayOverlayBars";

/**
 * Client bridge for the array-techniques category. Most algorithms run on the
 * shared array step player; the two that need a bespoke canvas (water levels, a
 * live stack) map to their own component.
 */
export function ArrayAlgorithmVisualizer({ slug }: { slug: string }) {
  const algo = getAlgo("array", slug);
  if (!algo) {
    return <p className="text-muted">This visualizer isn&apos;t available yet.</p>;
  }

  if (slug === "trapping-rain-water") {
    return (
      <TrappingRainVisualizer
        title={algo.title}
        description={algo.blurb}
        complexity={algo.complexity}
      />
    );
  }
  if (slug === "next-greater-element") {
    return (
      <NextGreaterVisualizer
        title={algo.title}
        description={algo.blurb}
        complexity={algo.complexity}
      />
    );
  }

  if (!algo.generate) {
    return <p className="text-muted">This visualizer isn&apos;t available yet.</p>;
  }

  const renderStep =
    slug === "sliding-window-max-sum"
      ? (step: Step) => <SlidingWindowBars step={step} />
      : slug === "dutch-national-flag"
        ? (step: Step) => <PartitionBars step={step} />
        : undefined;

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
      targetLabel={slug === "sliding-window-max-sum" ? "window size K" : undefined}
      allowNegative={slug === "kadane"}
      renderStep={renderStep}
      hideLegend={!!renderStep}
    />
  );
}
