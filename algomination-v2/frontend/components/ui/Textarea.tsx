import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentProps<"textarea"> & {
  label?: string;
  error?: string;
};

export function Textarea({
  className,
  label,
  error,
  id,
  ref,
  ...props
}: TextareaProps) {
  const fieldId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        id={fieldId}
        ref={ref}
        className={cn(
          "min-h-24 w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-foreground",
          "placeholder:text-muted/60 transition-colors",
          "focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          error && "border-danger focus-visible:border-danger focus-visible:ring-danger/40",
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
