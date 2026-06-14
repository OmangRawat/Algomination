"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { isNodeActive, type NavNode } from "@/lib/nav";
import { cn } from "@/lib/utils";

const itemClass = (active: boolean) =>
  cn(
    "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
    active
      ? "bg-surface-2 font-medium text-brand"
      : "text-muted hover:bg-surface-2 hover:text-foreground",
  );

/**
 * Hover/focus dropdown for a top-level nav group in the desktop header.
 *
 * - Grouped nodes (e.g. "Algorithms", whose children are categories) render a
 *   **two-pane mega-menu**: categories on the left, and the hovered category's
 *   algorithms on the right. The left list never grows beyond the category
 *   count and the right pane scrolls, so it stays tidy as the catalog grows.
 * - Flat nodes (e.g. "Data Structures") render a single column of links.
 *
 * Deep navigation also lives in the slide-in side drawer.
 */
export function NavDropdown({ node }: { node: NavNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const children = node.children ?? [];
  const isGrouped = children.some((c) => c.children?.length);

  // Which category's items show in the right pane (grouped menus only).
  const [activeCat, setActiveCat] = useState(0);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // When opening, focus the category matching the current route (else the first).
  useEffect(() => {
    if (!open || !isGrouped) return;
    const idx = children.findIndex((c) => isNodeActive(c, pathname));
    setActiveCat(idx >= 0 ? idx : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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
  const close = () => setOpen(false);

  const activeCategory = children[activeCat];
  const activeItems = activeCategory?.children ?? [];

  const triggerClass = cn(
    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    active || open ? "text-brand" : "text-muted hover:text-foreground",
  );
  const chevron = (
    <ChevronDown
      size={14}
      className={cn("transition-transform", open && "rotate-180")}
    />
  );

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {node.href ? (
        <Link href={node.href} onClick={close} className={triggerClass}>
          {node.label}
          {chevron}
        </Link>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={triggerClass}
        >
          {node.label}
          {chevron}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1 rounded-2xl border border-border bg-surface p-2 shadow-2xl"
          >
            {isGrouped ? (
              <div className="flex">
                {/* Left: categories */}
                <ul className="flex w-52 flex-col gap-0.5 pr-2">
                  {children.map((cat, i) => {
                    const onRoute = isNodeActive(cat, pathname);
                    const Icon = cat.icon;
                    return (
                      <li key={cat.label}>
                        <Link
                          href={cat.href ?? "#"}
                          onClick={close}
                          onMouseEnter={() => setActiveCat(i)}
                          onFocus={() => setActiveCat(i)}
                          className={cn(
                            "flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                            i === activeCat
                              ? "bg-surface-2 text-foreground"
                              : "text-muted hover:bg-surface-2 hover:text-foreground",
                            onRoute && "text-brand",
                          )}
                        >
                          {Icon && <Icon size={16} className="shrink-0" />}
                          <span className="flex-1">{cat.label}</span>
                          <ChevronRight
                            size={14}
                            className={cn(
                              "shrink-0 transition-opacity",
                              i === activeCat ? "opacity-100" : "opacity-30",
                            )}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="w-px self-stretch bg-border/70" />

                {/* Right: items of the hovered category */}
                <div className="w-56 pl-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCat}
                      initial={{ opacity: 0, x: 4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className="flex max-h-[340px] flex-col gap-0.5 overflow-y-auto"
                    >
                      {activeCategory?.href && (
                        <Link
                          href={activeCategory.href}
                          onClick={close}
                          className="mb-0.5 px-3 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted transition-colors hover:text-brand"
                        >
                          All {activeCategory.label}
                        </Link>
                      )}
                      {activeItems.map((leaf) => (
                        <Link
                          key={leaf.label}
                          href={leaf.href ?? "#"}
                          onClick={close}
                          className={itemClass(
                            !!leaf.href && pathname === leaf.href,
                          )}
                        >
                          {leaf.label}
                        </Link>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex min-w-[200px] flex-col gap-0.5">
                {children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href ?? "#"}
                    onClick={close}
                    className={itemClass(isNodeActive(child, pathname))}
                  >
                    {child.icon && (
                      <child.icon size={16} className="shrink-0" />
                    )}
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
