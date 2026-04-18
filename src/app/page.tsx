import dynamic from "next/dynamic";
import HeroSection from "@/sections/HeroSection";
import NextMatchSection from "@/sections/NextMatchSection";
import StaffSection from "@/sections/StaffSection";
import ScheduleSection from "@/sections/ScheduleSection";
import ResultsSection from "@/sections/ResultsSection";
import TableSection from "@/sections/TableSection";
import {
  SquadSectionSkeleton,
  InstagramSectionSkeleton,
} from "@/components/perf/BelowFoldPlaceholders";
import { getCachedPoggeMatchBundle } from "@/lib/pogge-live-match-bundle";
import { getPlayersFromImages } from "@/lib/getPlayersFromImages";
import { getInstagramImages } from "@/lib/getInstagramImages";

const SquadSection = dynamic(() => import("@/sections/SquadSection"), {
  loading: () => <SquadSectionSkeleton />,
});

const InstagramSection = dynamic(() => import("@/sections/InstagramSection"), {
  loading: () => <InstagramSectionSkeleton />,
});

export default async function Home() {
  const [bundle, players, instagramImages] = await Promise.all([
    getCachedPoggeMatchBundle(),
    getPlayersFromImages(),
    getInstagramImages(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <NextMatchSection match={bundle.nextMatch} />
      <ScheduleSection upcomingFixtures={bundle.scheduleUpcoming} />
      <ResultsSection
        recentResults={bundle.lastResultsMerged.slice(0, 5)}
        dataSource={bundle.source}
      />
      <TableSection tableData={bundle.tableData} />
      <SquadSection players={players} />
      <StaffSection />
      <InstagramSection images={instagramImages} />
    </main>
  );
}
