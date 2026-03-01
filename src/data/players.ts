export type Position = "Tor" | "Abwehr" | "Mittelfeld" | "Sturm";

export interface Player {
  id: string;
  name: string;
  position: Position;
  number?: number;
  birthYear: number;
  image?: string;
  previousClubs?: string[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  image?: string;
}

export const players: Player[] = [
  { id: "p1", name: "Niklas Hartmann", position: "Tor", number: 1, birthYear: 1998, previousClubs: ["SC Wunstorf", "TuS Schneeren"] },
  { id: "p2", name: "Leon Brinkmann", position: "Tor", number: 22, birthYear: 2002 },
  { id: "p3", name: "Marvin Schäfer", position: "Abwehr", number: 3, birthYear: 1997, previousClubs: ["SV Bordenau"] },
  { id: "p4", name: "Jonas Keller", position: "Abwehr", number: 4, birthYear: 1999, previousClubs: ["MTV Mandelsloh"] },
  { id: "p5", name: "Tim Krüger", position: "Abwehr", number: 5, birthYear: 2000 },
  { id: "p6", name: "Finn Bergmann", position: "Abwehr", number: 2, birthYear: 2001, previousClubs: ["Jugend TSV Poggenhagen"] },
  { id: "p7", name: "Lukas Richter", position: "Abwehr", number: 15, birthYear: 1996, previousClubs: ["SG Engelbostel", "TuS Haste"] },
  { id: "p8", name: "Paul Neumann", position: "Mittelfeld", number: 6, birthYear: 1998, previousClubs: ["TSV Bordenau"] },
  { id: "p9", name: "Jannik Meier", position: "Mittelfeld", number: 8, birthYear: 2000 },
  { id: "p10", name: "Max Hoffmann", position: "Mittelfeld", number: 10, birthYear: 1999, previousClubs: ["SC Wunstorf II"] },
  { id: "p11", name: "Erik Wolf", position: "Mittelfeld", number: 7, birthYear: 2001 },
  { id: "p12", name: "David Zimmermann", position: "Mittelfeld", number: 14, birthYear: 2003 },
  { id: "p13", name: "Ben Fischer", position: "Mittelfeld", number: 16, birthYear: 1997, previousClubs: ["SV Dudensen"] },
  { id: "p14", name: "Timo Schulz", position: "Sturm", number: 9, birthYear: 1998, previousClubs: ["FC Mardorf", "TSV Hagenburg"] },
  { id: "p15", name: "Nico Wagner", position: "Sturm", number: 11, birthYear: 2000 },
  { id: "p16", name: "Felix Becker", position: "Sturm", number: 17, birthYear: 2002, previousClubs: ["Jugend TSV Poggenhagen"] },
  { id: "p17", name: "Moritz Klein", position: "Sturm", number: 20, birthYear: 2004 },
];

export const staff: StaffMember[] = [
  { id: "s1", name: "Andreas Müller", role: "Trainer" },
  { id: "s2", name: "Stefan Weber", role: "Co-Trainer" },
  { id: "s3", name: "Ralf Behrens", role: "Torwarttrainer" },
  { id: "s4", name: "Marco Lange", role: "Teammanager" },
  { id: "s5", name: "Dirk Schröder", role: "Betreuer" },
];
