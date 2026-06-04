"use client";

import { getAlgo } from "@/lib/algorithms/registry";
import { StackVisualizer } from "./StackVisualizer";
import { QueueVisualizer } from "./QueueVisualizer";

/**
 * Client bridge for data-structure visualizers. Data structures are interactive
 * (operations build on live state) rather than one-shot step runs, so each maps
 * to its own component instead of the array step player.
 */
export function DataStructureVisualizer({ slug }: { slug: string }) {
  const meta = getAlgo("data-structures", slug);
  if (!meta) {
    return <p className="text-muted">This visualizer isn&apos;t available yet.</p>;
  }

  switch (slug) {
    case "stack":
      return (
        <StackVisualizer
          title={meta.title}
          description={meta.blurb}
          complexity={meta.complexity}
        />
      );
    case "queue":
      return (
        <QueueVisualizer
          title={meta.title}
          description={meta.blurb}
          complexity={meta.complexity}
        />
      );
    default:
      return (
        <p className="text-muted">This visualizer isn&apos;t available yet.</p>
      );
  }
}
