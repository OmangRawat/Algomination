"use client";

import { getAlgo } from "@/lib/algorithms/registry";
import { StackVisualizer } from "./StackVisualizer";
import { QueueVisualizer } from "./QueueVisualizer";
import { LinkedListVisualizer } from "./LinkedListVisualizer";
import { TreeVisualizer } from "./TreeVisualizer";
import { HashTableVisualizer } from "./HashTableVisualizer";
import { GraphVisualizer } from "./GraphVisualizer";
import { HeapVisualizer } from "./HeapVisualizer";
import { TrieVisualizer } from "./TrieVisualizer";
import { AVLVisualizer } from "./AVLVisualizer";
import { UnionFindVisualizer } from "./UnionFindVisualizer";

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
    case "linked-list":
      return (
        <LinkedListVisualizer
          title={meta.title}
          description={meta.blurb}
          complexity={meta.complexity}
        />
      );
    case "doubly-linked-list":
      return (
        <LinkedListVisualizer
          title={meta.title}
          description={meta.blurb}
          complexity={meta.complexity}
          doubly
        />
      );
    case "binary-search-tree":
      return (
        <TreeVisualizer
          title={meta.title}
          description={meta.blurb}
          complexity={meta.complexity}
        />
      );
    case "hash-table":
      return (
        <HashTableVisualizer
          title={meta.title}
          description={meta.blurb}
          complexity={meta.complexity}
        />
      );
    case "graph-traversal":
      return (
        <GraphVisualizer
          title={meta.title}
          description={meta.blurb}
          complexity={meta.complexity}
        />
      );
    case "priority-queue":
      return (
        <HeapVisualizer
          title={meta.title}
          description={meta.blurb}
          complexity={meta.complexity}
        />
      );
    case "trie":
      return (
        <TrieVisualizer
          title={meta.title}
          description={meta.blurb}
          complexity={meta.complexity}
        />
      );
    case "avl-tree":
      return (
        <AVLVisualizer
          title={meta.title}
          description={meta.blurb}
          complexity={meta.complexity}
        />
      );
    case "union-find":
      return (
        <UnionFindVisualizer
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
