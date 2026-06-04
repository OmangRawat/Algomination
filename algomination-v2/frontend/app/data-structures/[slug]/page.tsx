import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { algosByCategory, getAlgo } from "@/lib/algorithms/registry";
import { DataStructureVisualizer } from "@/components/viz/DataStructureVisualizer";
import { Container } from "@/components/ui/Container";

const CATEGORY = "data-structures" as const;

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
  const meta = getAlgo(CATEGORY, slug);
  return { title: meta ? meta.title : "Data Structures" };
}

export default async function DataStructurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getAlgo(CATEGORY, slug);

  if (!meta || meta.status !== "live") notFound();

  return (
    <main className="flex flex-1 flex-col py-12">
      <Container className="flex flex-col gap-8">
        <Link
          href="/data-structures"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ChevronLeft size={16} /> All data structures
        </Link>
        <DataStructureVisualizer slug={slug} />
      </Container>
    </main>
  );
}
