import { getPlayersFromImages } from "@/lib/getPlayersFromImages";
import SquadSection from "./SquadSection";

export default async function SquadSectionWrapper() {
  const players = await getPlayersFromImages();
  return <SquadSection players={players} />;
}
