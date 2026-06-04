"use client";

import { motion } from "framer-motion";
import type { Step } from "@/lib/engine/types";
import { HIGHLIGHT_FILL, IDLE_FILL } from "@/lib/engine/highlight";
import { cn } from "@/lib/utils";

const MAX_BAR_PX = 240;

export function ArrayBars({ step }: { step: Step }) {
  const max = Math.max(...step.items.map((i) => i.value), 1);

  return (
    <div className="flex h-[300px] items-end justify-center gap-1.5 px-2 sm:gap-2">
      {step.items.map((item, pos) => {
        const kind = step.highlights[pos];
        const fill = kind ? HIGHLIGHT_FILL[kind] : IDLE_FILL;
        const height = Math.max(8, (item.value / max) * MAX_BAR_PX);
        const pointerLabels = step.pointers
          ? Object.entries(step.pointers)
              .filter(([, p]) => p === pos)
              .map(([label]) => label)
          : [];

        return (
          <motion.div
            key={item.id}
            layout
            transition={{ type: "spring", stiffness: 520, damping: 38 }}
            className="flex h-full flex-1 flex-col items-center justify-end"
            style={{ maxWidth: 64 }}
          >
            {pointerLabels.length > 0 && (
              <span className="mb-1 rounded bg-brand/15 px-1.5 text-[10px] font-semibold text-brand">
                {pointerLabels.join(",")}
              </span>
            )}
            <motion.div
              layout
              animate={{ height, backgroundColor: fill }}
              transition={{
                height: { type: "spring", stiffness: 300, damping: 30 },
                backgroundColor: { duration: 0.2 },
              }}
              className={cn(
                "w-full rounded-t-md",
                kind && "shadow-lg",
              )}
              style={{ height }}
            />
            <span className="mt-1.5 text-xs font-medium tabular-nums text-muted">
              {item.value}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
