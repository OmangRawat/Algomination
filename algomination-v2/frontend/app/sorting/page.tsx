import { CategoryHub } from "@/components/CategoryHub";

export const metadata = {
  title: "Sorting Algorithm Visualizers",
  description:
    "Interactive, animated visualizations of sorting algorithms — Bubble, Selection, Insertion, Merge, and Quick sort. Step through each comparison and swap at your own pace.",
  alternates: { canonical: "/sorting" },
};

export default function SortingPage() {
  return (
    <CategoryHub
      category="sorting"
      title="Sorting Visualizers"
      description="Watch sorting algorithms rearrange an array step by step. Scrub, step, and replay at your own pace."
    />
  );
}
