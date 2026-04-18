import HeroSection from "@/sections/HeroSection";
import NextMatchSection from "@/sections/NextMatchSection";
import SquadSectionWrapper from "@/sections/SquadSectionWrapper";
import StaffSection from "@/sections/StaffSection";
import ScheduleSection from "@/sections/ScheduleSection";
import ResultsSection from "@/sections/ResultsSection";
import TableSection from "@/sections/TableSection";
import InstagramSectionWrapper from "@/sections/InstagramSectionWrapper";
import { getCachedPoggeMatchBundle } from "@/lib/pogge-live-match-bundle";

export default async function Home() {
  const bundle = await getCachedPoggeMatchBundle();

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <NextMatchSection match={bundle.nextMatch} />
      <ScheduleSection upcomingFixtures={bundle.scheduleUpcoming} />
      <ResultsSection
        recentResults={bundle.lastResultsMerged.slice(0, 5)}
        dataSource={bundle.source}
      />
      <SquadSectionWrapper />
      <StaffSection />
      <TableSection tableData={bundle.tableData} />
      <InstagramSectionWrapper />
    </main>
  );
}
