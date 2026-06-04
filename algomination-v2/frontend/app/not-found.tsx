import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="bg-grid-glow flex flex-1 items-center justify-center py-24">
      <Container className="flex flex-col items-center gap-5 text-center">
        <p className="font-[family-name:var(--font-display)] text-7xl text-brand">
          404
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="max-w-md text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={buttonVariants()}>
            Back home
          </Link>
          <Link
            href="/sorting"
            className={buttonVariants({ variant: "outline" })}
          >
            Explore visualizers
          </Link>
        </div>
      </Container>
    </main>
  );
}
