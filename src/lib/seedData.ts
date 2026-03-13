import { MissingPerson } from "@/lib/types";

const firstNamesMale = ["James","Robert","John","Michael","David","William","Richard","Joseph","Thomas","Charles","Christopher","Daniel","Matthew","Anthony","Mark","Steven","Andrew","Paul","Joshua","Kenneth","Kevin","Brian","George","Timothy","Ronald","Edward","Jason","Jeffrey","Ryan","Jacob"];
const firstNamesFemale = ["Mary","Patricia","Jennifer","Linda","Barbara","Elizabeth","Susan","Jessica","Sarah","Karen","Lisa","Nancy","Betty","Margaret","Sandra","Ashley","Dorothy","Kimberly","Emily","Donna","Michelle","Carol","Amanda","Melissa","Deborah","Stephanie","Rebecca","Sharon","Laura","Cynthia"];
const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts"];

const locations = ["Central Park, New York","Downtown LA, California","Michigan Ave, Chicago","Market St, San Francisco","Main St, Houston","Peachtree St, Atlanta","Broadway, Nashville","Ocean Drive, Miami","Pike Place, Seattle","Bourbon St, New Orleans","Freedom Trail, Boston","Las Vegas Blvd, Nevada","Liberty Bell, Philadelphia","National Mall, Washington DC","Beale St, Memphis"];
const descriptions = ["Wearing a blue jacket and jeans","Last seen in a red hoodie","Had a black backpack","Wearing glasses and a cap","Had a distinctive tattoo on left arm","Was wearing work uniform","Carrying a brown leather bag","Wearing a green coat","Had short hair and a beard","Was seen near bus station","Wearing a white t-shirt and shorts","Had a small dog with them","Was riding a bicycle","Carrying a guitar case","Wearing a yellow raincoat"];
const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split("T")[0];
}

export function generateSeedData(): MissingPerson[] {
  const persons: MissingPerson[] = [];
  const statuses: MissingPerson["status"][] = ["missing", "found", "investigating"];

  for (let i = 0; i < 100; i++) {
    const isMale = i < 50;
    const firstName = isMale ? firstNamesMale[i % firstNamesMale.length] : firstNamesFemale[i % firstNamesFemale.length];
    const lastName = lastNames[i % lastNames.length];
    const gender = isMale ? "male" : "female";
    const age = 5 + Math.floor(Math.random() * 70);
    const portraitIndex = (i % 50) + 1; // randomuser portraits go 0-99
    const folder = isMale ? "men" : "women";
    const imageUrl = `https://randomuser.me/api/portraits/${folder}/${portraitIndex}.jpg`;

    // Distribute statuses: ~50 missing, ~25 found, ~25 investigating
    let status: MissingPerson["status"];
    if (i < 50) status = "missing";
    else if (i < 75) status = "found";
    else status = "investigating";

    const height = `${150 + Math.floor(Math.random() * 40)} cm`;
    const weight = `${45 + Math.floor(Math.random() * 50)} kg`;

    persons.push({
      id: `seed-${i + 1}`,
      name: `${firstName} ${lastName}`,
      age,
      gender,
      lastSeen: randomItem(locations),
      lastSeenDate: randomDate(new Date("2023-01-01"), new Date("2025-12-31")),
      description: randomItem(descriptions),
      imageDataUrl: imageUrl,
      faceDescriptor: null,
      dateReported: randomDate(new Date("2023-01-01"), new Date("2026-03-01")),
      status,
      contactInfo: `+1-${Math.floor(200 + Math.random() * 800)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      bloodGroup: randomItem(bloodGroups),
      height,
      weight,
    });
  }

  return persons;
}
