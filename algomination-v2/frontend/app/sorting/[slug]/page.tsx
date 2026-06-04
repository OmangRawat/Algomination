import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { algosByCategory, getAlgo } from "@/lib/algorithms/registry";
import { AlgorithmVisualizer } from "@/components/viz/AlgorithmVisualizer";
import { Container } from "@/components/ui/Container";

const CATEGORY = "sorting" as const;

/** Pre-render the live sorters at build time. */
export function generateStaticParams() {
  return algosByCategory(CATEGORY)
    .filter((a) => a.status === "live")
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const algo = getAlgo(CATEGORY, slug);
  return { title: algo ? algo.title : "Sorting" };
}

export default async function SortingAlgorithmPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const algo = getAlgo(CATEGORY, slug);

  if (!algo || algo.status !== "live") notFound();

  return (
    <main className="flex flex-1 flex-col py-12">
      <Container className="flex flex-col gap-8">
        <Link
          href="/sorting"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ChevronLeft size={16} /> All sorting algorithms
        </Link>
        <AlgorithmVisualizer category={CATEGORY} slug={slug} />
      </Container>
    </main>
  );
}
