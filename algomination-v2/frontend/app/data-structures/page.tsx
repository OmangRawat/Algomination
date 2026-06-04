import { CategoryHub } from "@/components/CategoryHub";

export const metadata = { title: "Data Structures" };

export default function DataStructuresPage() {
  return (
    <CategoryHub
      category="data-structures"
      title="Data Structure Visualizers"
      description="Interact with classic data structures. Run operations and watch the structure respond in real time."
    />
  );
}
