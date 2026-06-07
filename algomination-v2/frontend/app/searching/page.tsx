import { CategoryHub } from "@/components/CategoryHub";

export const metadata = {
  title: "Searching Algorithm Visualizers",
  description:
    "Interactive, animated visualizations of Linear Search and Binary Search. Follow the pointers and watch the search range shrink toward the target.",
  alternates: { canonical: "/searching" },
};

export default function SearchingPage() {
  return (
    <CategoryHub
      category="searching"
      title="Searching Visualizers"
      description="Watch search algorithms hunt for a target value. Follow the pointers and the shrinking search range."
    />
  );
}
