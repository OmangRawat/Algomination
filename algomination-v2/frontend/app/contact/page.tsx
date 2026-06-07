import { Mail } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ContactForms } from "@/components/contact/ContactForms";

export const metadata = {
  title: "Contact",
  description:
    "Send feedback, submit your own animated algorithm project, or get in touch with the Algomination team.",
};

export default function ContactPage() {
  return (
    <main className="flex flex-1 flex-col py-16">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: intro */}
        <Reveal className="flex flex-col gap-4">
          <Badge tone="brand" className="w-fit">
            Get in touch
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Let&apos;s talk
          </h1>
          <p className="max-w-md text-muted">
            Share feedback, submit your own animated algorithm, or just say hello.
            Pick a tab and send it over.
          </p>
          <a
            href="mailto:algominationalgorithms@gmail.com"
            className="flex w-fit items-center gap-2 text-sm text-brand transition-colors hover:text-brand-2"
          >
            <Mail size={16} /> algominationalgorithms@gmail.com
          </a>
        </Reveal>

        {/* Right: forms */}
        <Reveal delay={0.1}>
          <ContactForms />
        </Reveal>
      </Container>
    </main>
  );
}
