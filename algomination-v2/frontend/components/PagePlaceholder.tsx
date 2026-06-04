import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

/** Polished "coming soon" stub used for routes built in later phases. */
export function PagePlaceholder({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <main className="bg-grid-glow flex flex-1 items-center justify-center py-24">
      <Container className="flex flex-col items-center gap-5 text-center">
        <Badge tone="brand">{phase}</Badge>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-xl text-lg text-muted">{description}</p>
      </Container>
    </main>
  );
}
