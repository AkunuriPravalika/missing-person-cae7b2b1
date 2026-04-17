import { MissingPerson } from "@/lib/types";
import seedPersons from "@/data/seedPersons.json";

// Seed data is pre-generated and bundled with the project (see scripts/generateSeed.mjs).
// This guarantees the same 100 records on every fresh install — no first-load randomization.
export function generateSeedData(): MissingPerson[] {
  return seedPersons as MissingPerson[];
}
