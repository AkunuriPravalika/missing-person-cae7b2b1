import { MissingPerson } from "@/lib/types";
import { generateSeedData } from "@/lib/seedData";

const DB_KEY = "missing_persons_db";
const SEED_KEY = "missing_persons_seeded_v2";

function ensureSeeded(): void {
  if (!localStorage.getItem(SEED_KEY)) {
    const existing = getAllPersonsRaw();
    if (existing.length === 0) {
      const seed = generateSeedData();
      localStorage.setItem(DB_KEY, JSON.stringify(seed));
    }
    localStorage.setItem(SEED_KEY, "true");
  }
}

function getAllPersonsRaw(): MissingPerson[] {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
}

export function getAllPersons(): MissingPerson[] {
  ensureSeeded();
  return getAllPersonsRaw();
}

export function addPerson(person: MissingPerson): void {
  const persons = getAllPersons();
  persons.push(person);
  localStorage.setItem(DB_KEY, JSON.stringify(persons));
}

export function deletePerson(id: string): void {
  const persons = getAllPersons().filter((p) => p.id !== id);
  localStorage.setItem(DB_KEY, JSON.stringify(persons));
}

export function getPersonById(id: string): MissingPerson | undefined {
  return getAllPersons().find((p) => p.id === id);
}

export function updatePersonStatus(id: string, status: MissingPerson["status"]): void {
  const persons = getAllPersons().map((p) =>
    p.id === id ? { ...p, status } : p
  );
  localStorage.setItem(DB_KEY, JSON.stringify(persons));
}
