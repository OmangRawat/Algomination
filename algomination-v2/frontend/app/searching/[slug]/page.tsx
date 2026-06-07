import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { algosByCategory, getAlgo } from "@/lib/algorithms/registry";
import { AlgorithmVisualizer } from "@/components/viz/AlgorithmVisualizer";
import { AlgoSeoText } from "@/components/viz/AlgoSeoText";
import { Container } from "@/components/ui/Container";

const CATEGORY = "searching" as const;

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
  if (!algo) return { title: "Searching" };
  const description = `${algo.blurb} Interactive, animated, step-by-step visualization.`;
  return {
    title: algo.title,
    description,
    openGraph: { title: `${algo.title} · Algomination`, description },
  };
}

export default async function SearchingAlgorithmPage({
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
          href="/searching"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ChevronLeft size={16} /> All searching algorithms
        </Link>
        <AlgorithmVisualizer category={CATEGORY} slug={slug} />
        <AlgoSeoText category={CATEGORY} slug={slug} />
      </Container>
    </main>
  );
}
