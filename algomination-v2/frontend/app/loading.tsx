/** Global navigation/suspense fallback. */
export default function Loading() {
  return (
    <main className="flex flex-1 items-center justify-center py-32">
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-brand"
        role="status"
        aria-label="Loading"
      />
    </main>
  );
}
