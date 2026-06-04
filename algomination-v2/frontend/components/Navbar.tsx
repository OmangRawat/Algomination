"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { buttonVariants, Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, status, logout } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const firstName = user?.name?.split(" ")[0] || user?.email.split("@")[0];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl text-foreground"
          onClick={() => setOpen(false)}
        >
          Algomination
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
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

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/60 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-surface text-brand"
                      : "text-muted hover:bg-surface hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {status === "authed" ? (
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-2"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  <LogOut size={16} /> Logout ({firstName})
                </Button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ size: "sm", className: "mt-2" })}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
