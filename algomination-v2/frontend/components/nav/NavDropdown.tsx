"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { isNodeActive, type NavNode } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** A single column of leaf links, optionally headed by a hub link. */
function Column({
  heading,
  href,
  items,
  pathname,
  onPick,
}: {
  heading: string;
  href?: string;
  items: NavNode[];
  pathname: string;
  onPick: () => void;
}) {
  return (
    <div className="flex min-w-[150px] flex-col gap-0.5">
      {href ? (
        <Link
          href={href}
          onClick={onPick}
          className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-muted transition-colors hover:text-brand"
        >
          {heading}
        </Link>
      ) : (
        <span className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-muted">
          {heading}
        </span>
      )}
      {items.map((leaf) => {
        const active = !!leaf.href && pathname === leaf.href;
        return (
          <Link
            key={leaf.label}
            href={leaf.href ?? "#"}
            onClick={onPick}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-surface font-medium text-brand"
                : "text-muted hover:bg-surface hover:text-foreground",
            )}
          >
            {leaf.label}
          </Link>
        );
      })}
    </div>
  );
}

/** Hover/focus dropdown for a top-level nav group in the desktop header. */
export function NavDropdown({ node }: { node: NavNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // Small grace period so moving from button to panel doesn't close it.
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const active = isNodeActive(node, pathname);
  const children = node.children ?? [];
  const groups = children.filter((c) => c.children?.length);
  const directLeaves = children.filter((c) => !c.children?.length);

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {node.href ? (
        <Link
          href={node.href}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            active || open ? "text-brand" : "text-muted hover:text-foreground",
          )}
        >
          {node.label}
          <ChevronDown
            size={14}
            className={cn("transition-transform", open && "rotate-180")}
          />
        </Link>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={cn(
            "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            active || open ? "text-brand" : "text-muted hover:text-foreground",
          )}
        >
          {node.label}
          <ChevronDown
            size={14}
            className={cn("transition-transform", open && "rotate-180")}
          />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1 flex gap-6 rounded-2xl border border-border bg-surface p-4 shadow-2xl"
          >
            {groups.map((g) => (
              <Column
                key={g.label}
                heading={g.label}
                href={g.href}
                items={g.children ?? []}
                pathname={pathname}
                onPick={() => setOpen(false)}
              />
            ))}
            {directLeaves.length > 0 && (
              <Column
                heading={node.label}
                href={node.href}
                items={directLeaves}
                pathname={pathname}
                onPick={() => setOpen(false)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
