import { cn } from "@/lib/utils";

type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  error?: string;
};

/**
 * Labelled text input. Forwards ref so it plugs into react-hook-form's
 * `register()` in later phases.
 */
export function Input({
  className,
  label,
  error,
  id,
  ref,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-surface-2 px-4 text-sm text-foreground",
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
