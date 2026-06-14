import { CategoryHub } from "@/components/CategoryHub";

export const metadata = {
  title: "Array Algorithm Visualizers",
  description:
    "Interactive, animated visualizations of essential array algorithms — Kadane's maximum subarray, two-pointer pair sum, sliding window, Dutch National Flag, trapping rain water, and next greater element. Step through each pointer move at your own pace.",
  alternates: { canonical: "/array" },
};

export default function ArrayPage() {
  return (
    <CategoryHub
      category="array"
      title="Array Algorithm Visualizers"
      description="The patterns behind countless interview problems — two pointers, sliding windows, monotonic stacks and more — animated step by step."
    />
  );
}
