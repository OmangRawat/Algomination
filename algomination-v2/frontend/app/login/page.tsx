import { Reveal } from "@/components/Reveal";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { AuthForms } from "@/components/auth/AuthForms";

export const metadata = {
  title: "Login",
  // Auth pages add no search value — keep them out of the index.
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="bg-grid-glow flex flex-1 items-center justify-center py-20">
      <Container className="max-w-md">
        <Reveal className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Badge tone="brand">Account</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome to Algomination
            </h1>
            <p className="text-muted">
              Log in or create an account to join the community.
            </p>
          </div>
          <AuthForms />
        </Reveal>
      </Container>
    </main>
  );
}
