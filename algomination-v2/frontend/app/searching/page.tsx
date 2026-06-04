import { CategoryHub } from "@/components/CategoryHub";

export const metadata = { title: "Searching" };

export default function SearchingPage() {
  return (
    <CategoryHub
      category="searching"
      title="Searching Visualizers"
      description="Watch search algorithms hunt for a target value. Follow the pointers and the shrinking search range."
    />
  );
}
