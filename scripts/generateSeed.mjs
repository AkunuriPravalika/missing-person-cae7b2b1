// Standalone seed generator. Produces src/data/seedPersons.json with a fixed deterministic dataset.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const firstNamesMale = ["James","Robert","John","Michael","David","William","Richard","Joseph","Thomas","Charles","Christopher","Daniel","Matthew","Anthony","Mark","Steven","Andrew","Paul","Joshua","Kenneth","Kevin","Brian","George","Timothy","Ronald","Edward","Jason","Jeffrey","Ryan","Jacob"];
const firstNamesFemale = ["Mary","Patricia","Jennifer","Linda","Barbara","Elizabeth","Susan","Jessica","Sarah","Karen","Lisa","Nancy","Betty","Margaret","Sandra","Ashley","Dorothy","Kimberly","Emily","Donna","Michelle","Carol","Amanda","Melissa","Deborah","Stephanie","Rebecca","Sharon","Laura","Cynthia"];
const lastNames = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts"];
const locations = ["Central Park, New York","Downtown LA, California","Michigan Ave, Chicago","Market St, San Francisco","Main St, Houston","Peachtree St, Atlanta","Broadway, Nashville","Ocean Drive, Miami","Pike Place, Seattle","Bourbon St, New Orleans","Freedom Trail, Boston","Las Vegas Blvd, Nevada","Liberty Bell, Philadelphia","National Mall, Washington DC","Beale St, Memphis"];
const descriptions = ["Wearing a blue jacket and jeans","Last seen in a red hoodie","Had a black backpack","Wearing glasses and a cap","Had a distinctive tattoo on left arm","Was wearing work uniform","Carrying a brown leather bag","Wearing a green coat","Had short hair and a beard","Was seen near bus station","Wearing a white t-shirt and shorts","Had a small dog with them","Was riding a bicycle","Carrying a guitar case","Wearing a yellow raincoat"];
const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

// Deterministic PRNG (mulberry32)
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const randDate = (start, end) => {
  const d = new Date(start.getTime() + rand() * (end.getTime() - start.getTime()));
  return d.toISOString().split("T")[0];
};

const agePool = [5,7,8,10,12,14,16,18,20,22,24,25,27,28,30,32,34,35,37,38,40,42,44,45,47,48,50,52,55,58,60,62,65,68,70,72,74,6,9,11,13,15,17,19,21,23,26,29,31,33,36,39,41,43,46,49,51,53,54,56,57,59,61,63,64,66,67,69,71,73,75,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,55,35,25,45,15,65,10,50,30,70,22,42];

const persons = [];
for (let i = 0; i < 100; i++) {
  const isMale = i < 50;
  const firstName = isMale ? firstNamesMale[i % firstNamesMale.length] : firstNamesFemale[i % firstNamesFemale.length];
  const lastName = lastNames[i % lastNames.length];
  const gender = isMale ? "male" : "female";
  const age = agePool[i];
  const portraitIndex = i % 100;
  const folder = isMale ? "men" : "women";
  const imageUrl = age < 18
    ? `https://randomuser.me/api/portraits/lego/${portraitIndex}.jpg`
    : `https://randomuser.me/api/portraits/${folder}/${portraitIndex}.jpg`;

  let status;
  if (i < 50) status = "missing";
  else if (i < 75) status = "found";
  else status = "investigating";

  const height = `${150 + Math.floor(rand() * 40)} cm`;
  const weight = `${45 + Math.floor(rand() * 50)} kg`;

  persons.push({
    id: `seed-${i + 1}`,
    name: `${firstName} ${lastName}`,
    age,
    gender,
    lastSeen: pick(locations),
    lastSeenDate: randDate(new Date("2023-01-01"), new Date("2025-12-31")),
    description: pick(descriptions),
    imageDataUrl: imageUrl,
    faceDescriptor: null,
    dateReported: randDate(new Date("2023-01-01"), new Date("2026-03-01")),
    status,
    contactInfo: `+1-${200 + Math.floor(rand() * 800)}-${100 + Math.floor(rand() * 900)}-${1000 + Math.floor(rand() * 9000)}`,
    bloodGroup: pick(bloodGroups),
    height,
    weight,
  });
}

const outPath = resolve(__dirname, "../src/data/seedPersons.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(persons, null, 2));
console.log(`Wrote ${persons.length} records to ${outPath}`);
