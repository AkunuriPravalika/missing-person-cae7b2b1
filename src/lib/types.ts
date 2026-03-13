export interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastSeen: string;
  description: string;
  imageDataUrl: string;
  faceDescriptor: number[] | null;
  dateReported: string;
  status: "missing" | "found" | "investigating";
  contactInfo: string;
}

export interface MatchResult {
  person: MissingPerson;
  distance: number;
  similarity: number;
}
