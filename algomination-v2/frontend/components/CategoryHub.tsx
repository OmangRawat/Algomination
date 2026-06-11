import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { algosByCategory, type Category } from "@/lib/algorithms/registry";
import { Container } from "@/components/ui/Container";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/Reveal";

/** Grid of algorithm cards for a category landing page (sorting/searching/…). */
export function CategoryHub({
  category,
  title,
  description,
}: {
  category: Category;
  title: string;
  description: string;
}) {
  const algos = algosByCategory(category);

  return (
    <main className="flex flex-1 flex-col py-16">
      <Container className="flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="max-w-2xl text-lg text-muted">{description}</p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {algos.map((algo, i) => {
            const live = algo.status === "live";
            const inner = (
              <Card
                interactive={live}
                className={
                  live
                    ? "h-full"
                    : "h-full opacity-60"
                }
              >
                <div className="flex h-full flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle>{algo.title}</CardTitle>
                    {live ? (
                      <ArrowRight
                        size={18}
                        className="text-muted transition-transform group-hover:translate-x-1"
                      />
                    ) : (
                      <Badge tone="muted">Soon</Badge>
                    )}
                  </div>
                  <CardDescription className="flex-1">
                    {algo.blurb}
                  </CardDescription>
                  {algo.complexity && (
                    <div className="flex gap-2">
                      <Badge tone="brand">Time {algo.complexity.time}</Badge>
                      <Badge tone="muted">Space {algo.complexity.space}</Badge>
                    </div>
                  )}
                </div>
              </Card>
            );

            return (
              <Reveal key={algo.slug} delay={i * 0.06} className="h-full">
                {live ? (
                  <Link
                    href={`/${category}/${algo.slug}`}
                    className="group block h-full"
                  >
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
