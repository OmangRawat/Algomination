"use client";

import { motion } from "framer-motion";
import type { Step } from "@/lib/engine/types";
import { HIGHLIGHT_FILL, IDLE_FILL } from "@/lib/engine/highlight";
import { cn } from "@/lib/utils";

const MAX_BAR_PX = 240;

export function ArrayBars({ step }: { step: Step }) {
  // Arrays with negatives (e.g. Kadane) draw around a zero baseline instead.
  if (step.items.some((i) => i.value < 0)) {
    return <SignedBars step={step} />;
  }

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

const HALF_PX = 120;

/** Bar chart with a centred zero line — positive bars rise, negatives drop. */
function SignedBars({ step }: { step: Step }) {
  const maxAbs = Math.max(...step.items.map((i) => Math.abs(i.value)), 1);

  return (
    <div className="flex justify-center gap-1.5 px-2 sm:gap-2">
      {step.items.map((item, pos) => {
        const kind = step.highlights[pos];
        const fill = kind ? HIGHLIGHT_FILL[kind] : IDLE_FILL;
        const px = Math.max(6, (Math.abs(item.value) / maxAbs) * HALF_PX);
        const positive = item.value >= 0;
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
            className="flex flex-1 flex-col items-center"
            style={{ maxWidth: 64 }}
          >
            <span className="flex h-5 items-end text-[10px] font-semibold text-brand">
              {pointerLabels.join(",")}
            </span>
            <div
              className="flex w-full flex-col"
              style={{ height: HALF_PX * 2 }}
            >
              <div className="flex flex-1 flex-col justify-end">
                {positive && (
                  <motion.div
                    layout
                    animate={{ height: px, backgroundColor: fill }}
                    transition={{
                      height: { type: "spring", stiffness: 300, damping: 30 },
                      backgroundColor: { duration: 0.2 },
                    }}
                    className={cn("w-full rounded-t-md", kind && "shadow-lg")}
                    style={{ height: px }}
                  />
                )}
              </div>
              <div className="h-px w-full bg-border/80" />
              <div className="flex flex-1 flex-col justify-start">
                {!positive && (
                  <motion.div
                    layout
                    animate={{ height: px, backgroundColor: fill }}
                    transition={{
                      height: { type: "spring", stiffness: 300, damping: 30 },
                      backgroundColor: { duration: 0.2 },
                    }}
                    className={cn("w-full rounded-b-md", kind && "shadow-lg")}
                    style={{ height: px }}
                  />
                )}
              </div>
            </div>
            <span className="mt-1.5 text-xs font-medium tabular-nums text-muted">
              {item.value}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
