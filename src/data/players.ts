export type Position = "Tor" | "Abwehr" | "Mittelfeld" | "Sturm";

export interface Player {
  id: string;
  name: string;
  position: Position;
  number?: number;
  birthYear?: number;
  image?: string;
  previousClubs?: string[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  image?: string;
}

// Diese Liste wird nicht mehr verwendet - Spieler werden automatisch aus /public/bilder/ generiert
export const players: Player[] = [];

export const staff: StaffMember[] = [
  { 
    id: "s1", 
    name: "Andreas Kögler", 
    role: "Trainer",
    image: "/bilder/Andreas-Kögler.png"
  },
  { 
    id: "s2", 
    name: "David Bindhak", 
    role: "Trainer",
    image: "/bilder/David-Bindhak.webp"
  },
  { 
    id: "s3", 
    name: "Sven Potornyai", 
    role: "Torwarttrainer/Betreuer",
    image: "/bilder/Sven-Potornyai.png"
  },
];
