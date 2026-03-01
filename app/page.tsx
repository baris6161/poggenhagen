import HeroSection from "@/sections/HeroSection";
import NextMatchSection from "@/sections/NextMatchSection";
import ResultsSection from "@/sections/ResultsSection";
import ScheduleSection from "@/sections/ScheduleSection";
import TableSection from "@/sections/TableSection";
import SquadSectionWrapper from "@/sections/SquadSectionWrapper";
import StaffSection from "@/sections/StaffSection";
import InstagramSectionWrapper from "@/sections/InstagramSectionWrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <NextMatchSection />
      <ResultsSection />
      <ScheduleSection />
      <TableSection />
      <SquadSectionWrapper />
      <StaffSection />
      <InstagramSectionWrapper />
    </main>
  );
}
