import Link from "next/link";
import {
  BarChart3,
  Search,
  Layers,
  SlidersHorizontal,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { StaggerHero } from "@/components/StaggerHero";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/ui/Container";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";

const CATEGORIES = [
  {
    href: "/sorting",
    title: "Sorting",
    icon: BarChart3,
    desc: "Bubble, Selection & Insertion — watch arrays rearrange step by step.",
  },
  {
    href: "/searching",
    title: "Searching",
    icon: Search,
    desc: "Linear & Binary search — follow the pointers as they close in on a target.",
  },
  {
    href: "/data-structures",
    title: "Data Structures",
    icon: Layers,
    desc: "Interactive Stack — push, pop and peek with live animations.",
  },
];

const FEATURES = [
  {
    icon: SlidersHorizontal,
    title: "Step, scrub & replay",
    desc: "Every algorithm runs as discrete frames. Play it, pause it, or scrub the timeline to any moment.",
  },
  {
    icon: Sparkles,
    title: "Smooth animations",
    desc: "Elements physically move and settle with spring physics — not abrupt redraws.",
  },
  {
    icon: GraduationCap,
    title: "Learn by doing",
    desc: "Use your own input, read the running commentary, and build real intuition.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-grid-glow px-6 pt-10">
        <StaggerHero />
      </section>

      {/* Intro + CTA */}
      <Container className="flex flex-col items-center gap-6 py-12 text-center">
        <Reveal className="flex flex-col items-center gap-6">
          <p className="max-w-xl text-lg text-muted">
            Learn algorithms and data structures through smooth, interactive
            visualizations — at your own pace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/sorting" className={buttonVariants({ size: "lg" })}>
              Start with Sorting <ArrowRight size={18} />
            </Link>
            <Link
              href="/about"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              How it works
            </Link>
          </div>
        </Reveal>
      </Container>

      {/* Categories */}
      <Container className="py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.href} delay={i * 0.08}>
              <Link href={cat.href} className="group block h-full">
                <Card interactive className="h-full">
                  <div className="flex h-full flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                        <cat.icon size={22} />
                      </span>
                      <ArrowRight
                        size={18}
                        className="text-muted transition-transform group-hover:translate-x-1"
                      />
                    </div>
                    <CardTitle>{cat.title}</CardTitle>
                    <CardDescription>{cat.desc}</CardDescription>
                  </div>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Features */}
      <Container className="py-12">
        <Reveal className="mb-10 flex flex-col gap-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Built for understanding
          </h2>
          <p className="mx-auto max-w-2xl text-muted">
            Not just pretty motion — a visualization engine designed to make each
            step legible.
          </p>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="flex flex-col gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <f.icon size={22} />
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Contribute CTA */}
      <Container className="py-16">
        <Reveal>
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-surface/60 px-6 py-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Made something cool?
            </h2>
            <p className="max-w-xl text-muted">
              Algomination is a community project. Built your own animated
              algorithm? Share it and get credited.
            </p>
            <Link href="/contact" className={buttonVariants({ size: "lg" })}>
              Submit a project <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
