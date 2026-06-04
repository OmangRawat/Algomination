import { CategoryHub } from "@/components/CategoryHub";

export const metadata = { title: "Sorting" };

export default function SortingPage() {
  return (
    <CategoryHub
      category="sorting"
      title="Sorting Visualizers"
      description="Watch sorting algorithms rearrange an array step by step. Scrub, step, and replay at your own pace."
    />
  );
}
