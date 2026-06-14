"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, PanelLeft } from "lucide-react";
import { NAV_TREE, SECONDARY_LINKS } from "@/lib/nav";
import { buttonVariants, Button } from "@/components/ui/Button";
import { NavDropdown } from "@/components/nav/NavDropdown";
import { SideNav } from "@/components/nav/SideNav";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const { user, status, logout } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const firstName = user?.name?.split(" ")[0] || user?.email.split("@")[0];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawer(true)}
              aria-label="Open navigation"
              className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <PanelLeft size={20} />
            </button>
            <Link
              href="/"
              className="font-[family-name:var(--font-display)] text-2xl text-foreground"
            >
              Algomination
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden items-center gap-1.5 md:flex">
            {NAV_TREE.map((node) => (
              <NavDropdown key={node.label} node={node} />
            ))}
            <span
              aria-hidden
              className="mx-1.5 h-5 w-px bg-border/70"
            />
            {SECONDARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href ?? "#"}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  link.href && isActive(link.href)
                    ? "text-brand"
                    : "text-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            {status === "authed" ? (
              <div className="ml-2 flex items-center gap-2">
                <span className="text-sm text-muted">Hi, {firstName}</span>
                <Button size="sm" variant="ghost" onClick={logout} aria-label="Log out">
                  <LogOut size={16} /> Logout
                </Button>
              </div>
            ) : status === "guest" ? (
              <Link
                href="/login"
                className={buttonVariants({ size: "sm", className: "ml-2" })}
              >
                Login
              </Link>
            ) : null}
          </div>

          {/* Mobile: auth shortcut (full nav lives in the drawer) */}
          <div className="flex items-center md:hidden">
            {status === "authed" ? (
              <Button size="sm" variant="ghost" onClick={logout} aria-label="Log out">
                <LogOut size={16} />
              </Button>
            ) : status === "guest" ? (
              <Link href="/login" className={buttonVariants({ size: "sm" })}>
                Login
              </Link>
            ) : null}
          </div>
        </nav>
      </header>

      <SideNav open={drawer} onClose={() => setDrawer(false)} />
    </>
  );
}
