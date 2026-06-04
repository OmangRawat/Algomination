import { cn } from "@/lib/utils";

/** Centered, max-width page container with responsive horizontal padding. */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-6", className)}
      {...props}
    />
  );
}
