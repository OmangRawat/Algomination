"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronsUpDown, Home, X } from "lucide-react";
import { NAV_TREE, SECONDARY_LINKS, isNodeActive, type NavNode } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Cascade the nav rows in when the drawer opens. */
const NAV_LIST = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.12 } },
};
const NAV_ITEM = {
  hidden: { opacity: 0, x: -14 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 500, damping: 34 },
  },
} as const;

/** One row of the accordion tree. Recurses for nested groups. */
function NavBranch({
  node,
  depth,
  pathname,
  onNavigate,
}: {
  node: NavNode;
  depth: number;
  pathname: string;
  onNavigate: () => void;
}) {
  const hasChildren = !!node.children?.length;
  const active =
    !!node.href &&
    (pathname === node.href || pathname.startsWith(node.href + "/"));
  const [open, setOpen] = useState(() => isNodeActive(node, pathname));
  const Icon = node.icon;

  // Leaf link.
  if (!hasChildren) {
    return (
      <Link
        href={node.href ?? "#"}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-2.5 rounded-lg py-2 pl-3 pr-3 text-sm transition-colors",
          active
            ? "bg-surface font-medium text-foreground"
            : "text-muted hover:bg-surface/70 hover:text-foreground",
        )}
      >
        {Icon ? <Icon size={16} className="shrink-0" /> : null}
        <span className="truncate">{node.label}</span>
      </Link>
    );
  }

  // Expandable group (Algorithms, Sorting, Searching, Data Structures).
  return (
    <div>
      <div
        className={cn(
          "group/row flex items-center rounded-lg transition-colors",
          active ? "text-foreground" : "text-muted hover:bg-surface/70",
        )}
      >
        {node.href ? (
          <Link
            href={node.href}
            onClick={onNavigate}
            className={cn(
              "flex flex-1 items-center gap-2.5 py-2 pl-3 text-sm font-medium transition-colors",
              active ? "text-foreground" : "group-hover/row:text-foreground",
            )}
          >
            {Icon ? <Icon size={16} className="shrink-0" /> : null}
            <span className="truncate">{node.label}</span>
          </Link>
        ) : (
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex flex-1 items-center gap-2.5 py-2 pl-3 text-left text-sm font-medium"
          >
            {Icon ? <Icon size={16} className="shrink-0" /> : null}
            <span className="truncate">{node.label}</span>
          </button>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? `Collapse ${node.label}` : `Expand ${node.label}`}
          aria-expanded={open}
          className="flex items-center justify-center p-2"
        >
          {open ? (
            <span className="rounded-md bg-surface-2 p-0.5 text-foreground">
              <ChevronUp size={14} />
            </span>
          ) : (
            <ChevronDown size={14} className="text-muted" />
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-[1.55rem] flex flex-col border-l border-border/60 pl-2">
              {node.children!.map((child) => (
                <NavBranch
                  key={child.label}
                  node={child}
                  depth={depth + 1}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Slide-in navigation drawer styled as a grouped sidebar. */
export function SideNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const homeActive = pathname === "/";

  // Close whenever the route changes (e.g. after tapping a link).
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-label="Site navigation"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="fixed inset-y-0 left-0 z-[70] flex w-[290px] max-w-[85vw] flex-col border-r border-border bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <Link
                href="/"
                onClick={onClose}
                className="font-[family-name:var(--font-display)] text-xl text-foreground"
              >
                Algomination
              </Link>
              <button
                onClick={onClose}
                aria-label="Close navigation"
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <motion.nav
              variants={NAV_LIST}
              initial="hidden"
              animate="show"
              className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3"
            >
              {/* Primary single link */}
              <motion.div variants={NAV_ITEM}>
                <Link
                  href="/"
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg py-2 pl-3 pr-3 text-sm transition-colors",
                    homeActive
                      ? "bg-surface font-medium text-foreground"
                      : "text-muted hover:bg-surface/70 hover:text-foreground",
                  )}
                >
                  <Home size={16} className="shrink-0" />
                  Home
                </Link>
              </motion.div>

              {/* Section header */}
              <motion.div
                variants={NAV_ITEM}
                className="mt-3 mb-1 flex items-center justify-between px-3"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted/80">
                  Visualizers
                </span>
                <ChevronsUpDown size={14} className="text-muted/50" />
              </motion.div>

              {NAV_TREE.map((node) => (
                <motion.div key={node.label} variants={NAV_ITEM}>
                  <NavBranch
                    node={node}
                    depth={0}
                    pathname={pathname}
                    onNavigate={onClose}
                  />
                </motion.div>
              ))}

              <motion.div
                variants={NAV_ITEM}
                className="my-2 border-t border-border/60"
              />

              {SECONDARY_LINKS.map((link) => (
                <motion.div key={link.href} variants={NAV_ITEM}>
                  <NavBranch
                    node={link}
                    depth={0}
                    pathname={pathname}
                    onNavigate={onClose}
                  />
                </motion.div>
              ))}
            </motion.nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
