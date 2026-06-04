import { cn } from "@/lib/utils";

type Tone = "brand" | "accent" | "muted" | "success";

const tones: Record<Tone, string> = {
  brand: "border-brand/40 bg-brand/10 text-brand",
  accent: "border-accent/40 bg-accent/10 text-accent",
  muted: "border-border bg-surface text-muted",
  success: "border-success/40 bg-success/10 text-success",
};

export function Badge({
  className,
  tone = "muted",
  ...props
}: React.ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
