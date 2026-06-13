import { getAlgo, type Category } from "@/lib/algorithms/registry";

/**
 * Server-rendered descriptive text for a visualizer page. Gives crawlers (and
 * users) real, unique content about the algorithm — independent of the
 * client-side animation.
 */
export function AlgoSeoText({
  category,
  slug,
}: {
  category: Category;
  slug: string;
}) {
  const algo = getAlgo(category, slug);
  if (!algo) return null;

  return (
    <section className="flex flex-col gap-3 border-t border-border pt-8 text-muted">
      <h2 className="text-xl font-semibold text-foreground">
        About {algo.title}
      </h2>
      <p>{algo.blurb}</p>
      {algo.complexity && (
        <p>
          Time complexity:{" "}
          <span className="text-foreground">{algo.complexity.time}</span>. Space
          complexity:{" "}
          <span className="text-foreground">{algo.complexity.space}</span>.
        </p>
      )}

      {algo.insight && (
        <div className="mt-2 flex flex-col gap-3 rounded-2xl border border-border bg-surface/60 p-5">
          <h3 className="text-base font-semibold text-foreground">
            How it works, step by step
          </h3>
          <p>
            <span className="font-medium text-foreground">Core idea — </span>
            {algo.insight.idea}
          </p>
          <p>
            <span className="font-medium text-foreground">
              What each pass accomplishes —{" "}
            </span>
            {algo.insight.eachPass}
          </p>
        </div>
      )}
      <p>
        Use the interactive visualizer above to run {algo.title} on your own
        input and watch every comparison, swap, and operation animate step by
        step — pause, scrub, or replay at any speed.
      </p>
    </section>
  );
}
