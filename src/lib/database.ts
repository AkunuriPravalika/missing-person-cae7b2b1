import { MissingPerson } from "@/lib/types";

const DB_KEY = "missing_persons_db";

export function getAllPersons(): MissingPerson[] {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
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
