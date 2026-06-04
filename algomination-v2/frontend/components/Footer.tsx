import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";
import { Container } from "@/components/ui/Container";

/** The two creators of Algomination. */
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
] as const;

/** Inline GitHub mark (lucide deprecated its brand icons). */
function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

/** Inline LinkedIn mark (lucide deprecated its brand icons). */
function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-surface/40">
      <Container className="flex flex-col gap-8 py-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <p className="font-[family-name:var(--font-display)] text-2xl text-foreground">
              Algomination
            </p>
            <p className="mt-2 text-sm text-muted">
              Learn algorithms and data structures through smooth, interactive
              visualizations.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-6 border-t border-border/60 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Algomination. Created by Omang Rawat
            &amp; Rahul Soni.
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {CREATORS.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-sm text-foreground">{c.name}</span>
                <a
                  href={c.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${c.name} on GitHub`}
                  className="text-muted transition-colors hover:text-foreground"
                >
                  <GithubIcon size={16} />
                </a>
                <a
                  href={c.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${c.name} on LinkedIn`}
                  className="text-muted transition-colors hover:text-foreground"
                >
                  <LinkedinIcon size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
