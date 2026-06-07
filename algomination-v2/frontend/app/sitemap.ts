import type { MetadataRoute } from "next";
import { ALGORITHMS } from "@/lib/algorithms/registry";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "",
    "/sorting",
    "/searching",
    "/data-structures",
    "/about",
    "/contact",
  ];

  const algoPaths = ALGORITHMS.filter((a) => a.status === "live").map(
    (a) => `/${a.category}/${a.slug}`,
  );

  return [...staticPaths, ...algoPaths].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
