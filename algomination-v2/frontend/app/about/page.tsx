import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";

export const metadata = {
  title: "About",
  description:
    "What Algomination is, how its algorithm visualizations work, and how to contribute your own animated algorithm to the collection.",
  alternates: { canonical: "/about" },
};

const STEPS = [
  "Check the algorithm you want to build hasn't already been added.",
  "Build it as a small project and push it to a public GitHub repo.",
  "Share the repo link and your details through the contact form.",
  "Once reviewed, it's added to the collection with full credit to you.",
];

const CREATORS = [
  {
    name: "Omang Rawat",
    github: "https://github.com/OmangRawat",
    linkedin: "https://in.linkedin.com/in/omang-rawat-b397a01b6",
  },
  {
    name: "Rahul Soni",
    github: "https://github.com/rahultg2",
    linkedin: "https://www.linkedin.com/in/rahul-soni-8891521ab/",
  },
];

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col py-16">
      <Container className="flex flex-col gap-16">
        {/* Intro */}
        <Reveal className="flex flex-col gap-4">
          <Badge tone="brand" className="w-fit">
            About
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Algorithms, with animation.
          </h1>
          <p className="max-w-3xl text-lg text-muted">
            Algomination turns abstract algorithms into something you can watch
            and play with. Instead of tracing code by hand, you see each
            comparison, swap, and step unfold — and you can pause, scrub, and
            replay until it clicks.
          </p>
        </Reveal>

        {/* Purpose */}
        <Reveal className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-foreground">The purpose</h2>
          <p className="max-w-3xl text-muted">
            This project started as a bit of tinkering with web development and
            animation libraries, and grew into something with two goals: give
            creators a place to showcase their visualization work as a
            collection, and give learners a fun, intuitive way to understand how
            algorithms actually behave. It&apos;s meant to be a shared, growing
            library — built by and for a community of developers and learners.
          </p>
        </Reveal>

        {/* How an algorithm is visualized */}
        <Reveal>
          <Card className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              How a visualization works
            </h2>
            <p className="max-w-3xl text-muted">
              Each algorithm runs in your browser as a pure function that emits a
              sequence of <span className="text-foreground">frames</span> — every
              comparison, swap, or pointer move is one frame. A player then walks
              those frames and animates them with spring physics, so you get a
              smooth, scrubbable timeline you can step through at any speed.
            </p>
          </Card>
        </Reveal>

        {/* Contribute */}
        <Reveal className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-foreground">
            How to contribute
          </h2>
          <ol className="flex flex-col gap-4">
            {STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand">
                  {i + 1}
                </span>
                <span className="pt-1 text-muted">{step}</span>
              </li>
            ))}
          </ol>
          <Link
            href="/contact"
            className={buttonVariants({ size: "lg", className: "w-fit" })}
          >
            Submit your project <ArrowRight size={18} />
          </Link>
        </Reveal>

        {/* Creators */}
        <Reveal className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-foreground">The creators</h2>
          <p className="max-w-3xl text-muted">
            Algomination was designed and built by Omang Rawat and Rahul Soni.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {CREATORS.map((c) => (
              <Card key={c.name} className="flex flex-col gap-2">
                <span className="text-lg font-semibold text-foreground">
                  {c.name}
                </span>
                <div className="flex gap-4 text-sm">
                  <a
                    href={c.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand transition-colors hover:text-brand-2"
                  >
                    GitHub
                  </a>
                  <a
                    href={c.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand transition-colors hover:text-brand-2"
                  >
                    LinkedIn
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
