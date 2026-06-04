import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-2 hover:shadow-brand-2/30",
  secondary: "bg-surface-2 text-foreground hover:bg-surface-2/70",
  outline:
    "border border-border bg-transparent text-foreground hover:border-brand hover:text-brand",
  ghost: "bg-transparent text-muted hover:bg-surface hover:text-foreground",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

/** Shared class string for button-styled elements (e.g. on a <Link>). */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props} />
  );
}
