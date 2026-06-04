// Throwaway correctness check for the sort step generators.
// Run with: npx tsx scripts/verify-sorts.ts
import { bubbleSort } from "../lib/algorithms/bubble";
import { selectionSort } from "../lib/algorithms/selection";
import { insertionSort } from "../lib/algorithms/insertion";
import { mergeSort } from "../lib/algorithms/merge";
import { quickSort } from "../lib/algorithms/quick";

const gens = { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort };

function randomArray() {
  const len = 2 + Math.floor(Math.random() * 12);
  return Array.from({ length: len }, () => Math.floor(Math.random() * 100));
}

let failures = 0;
for (const [name, gen] of Object.entries(gens)) {
  for (let t = 0; t < 500; t++) {
    const input = randomArray();
    const steps = gen(input);
    const final = steps[steps.length - 1].items.map((i) => i.value);
    const expected = [...input].sort((a, b) => a - b);
    const ok =
      final.length === expected.length &&
      final.every((v, i) => v === expected[i]);
    if (!ok) {
      failures++;
      console.error(`❌ ${name} failed`, { input, final, expected });
      break;
    }
    // Every frame must be a permutation of the input (no values lost/created).
    for (const s of steps) {
      const vals = s.items.map((i) => i.value).sort((a, b) => a - b);
      if (vals.length !== expected.length || vals.some((v, i) => v !== expected[i])) {
        failures++;
        console.error(`❌ ${name} frame not a permutation`, { input, frame: s.items.map((i) => i.value) });
        break;
      }
    }
  }
  if (failures === 0) console.log(`✅ ${name}: 500 random arrays sorted correctly`);
}

process.exit(failures === 0 ? 0 : 1);
