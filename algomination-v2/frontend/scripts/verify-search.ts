// Throwaway correctness check for the search step generators.
// Run with: npx tsx scripts/verify-search.ts
import { linearSearch } from "../lib/algorithms/linear-search";
import { binarySearch } from "../lib/algorithms/binary-search";

function randomArray() {
  const len = 2 + Math.floor(Math.random() * 12);
  return Array.from({ length: len }, () => Math.floor(Math.random() * 30));
}

/** Returns the value at the "found" highlight, or null if none. */
function foundValue(steps: ReturnType<typeof linearSearch>): number | null {
  for (const s of steps) {
    for (const [pos, kind] of Object.entries(s.highlights)) {
      if (kind === "found") return s.items[Number(pos)].value;
    }
  }
  return null;
}

let failures = 0;

for (const [name, gen] of [
  ["linearSearch", linearSearch],
  ["binarySearch", binarySearch],
] as const) {
  for (let t = 0; t < 1000; t++) {
    const input = randomArray();
    // Bias toward present targets so we exercise the "found" path often.
    const target =
      Math.random() < 0.6
        ? input[Math.floor(Math.random() * input.length)]
        : Math.floor(Math.random() * 30);

    const steps = gen(input, target);
    const found = foundValue(steps);
    const present = input.includes(target);

    if (present && found !== target) {
      failures++;
      console.error(`❌ ${name}: target ${target} present but found=${found}`, input);
      break;
    }
    if (!present && found !== null) {
      failures++;
      console.error(`❌ ${name}: target ${target} absent but reported found`, input);
      break;
    }
  }
  if (failures === 0) console.log(`✅ ${name}: 1000 cases correct (found & not-found)`);
}

process.exit(failures === 0 ? 0 : 1);
