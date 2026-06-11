import {
  ArrowDownUp,
  Binary,
  Boxes,
  Info,
  Mail,
  Search,
  type LucideIcon,
} from "lucide-react";
import { algosByCategory, type Category } from "./algorithms/registry";

export interface NavNode {
  label: string;
  /** Optional destination. Group nodes without an href only expand. */
  href?: string;
  /** Leading icon shown on top-level rows (children render as plain text). */
  icon?: LucideIcon;
  children?: NavNode[];
}

/** Live algorithms in a category as leaf links. */
const leaves = (category: Category): NavNode[] =>
  algosByCategory(category)
    .filter((a) => a.status === "live")
    .map((a) => ({ label: a.title, href: `/${category}/${a.slug}` }));

/**
 * Hierarchical navigation shared by the header dropdowns and the side drawer.
 * "Algorithms" is a presentational umbrella over Sorting + Searching — the
 * underlying routes stay flat (/sorting, /searching, /data-structures).
 */
export const NAV_TREE: NavNode[] = [
  {
    label: "Algorithms",
    icon: Binary,
    children: [
      {
        label: "Sorting",
        href: "/sorting",
        icon: ArrowDownUp,
        children: leaves("sorting"),
      },
      {
        label: "Searching",
        href: "/searching",
        icon: Search,
        children: leaves("searching"),
      },
    ],
  },
  {
    label: "Data Structures",
    href: "/data-structures",
    icon: Boxes,
    children: leaves("data-structures"),
  },
];

/** Standalone pages shown after the tree (no children). */
export const SECONDARY_LINKS: NavNode[] = [
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

/** Flat link list for the footer. */
export const NAV_LINKS = [
  { href: "/sorting", label: "Sorting" },
  { href: "/searching", label: "Searching" },
  { href: "/data-structures", label: "Data Structures" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** True when `pathname` is the node's href or any descendant's href. */
export function isNodeActive(node: NavNode, pathname: string): boolean {
  if (node.href && (pathname === node.href || pathname.startsWith(node.href + "/"))) {
    return true;
  }
  return node.children?.some((c) => isNodeActive(c, pathname)) ?? false;
}
