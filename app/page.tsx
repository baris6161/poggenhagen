import HeroSection from "@/sections/HeroSection";
import NextMatchSection from "@/sections/NextMatchSection";
import SquadSectionWrapper from "@/sections/SquadSectionWrapper";
import StaffSection from "@/sections/StaffSection";
import ScheduleSection from "@/sections/ScheduleSection";
import ResultsSection from "@/sections/ResultsSection";
import TableSection from "@/sections/TableSection";
import InstagramSectionWrapper from "@/sections/InstagramSectionWrapper";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <NextMatchSection />
      <SquadSectionWrapper />
      <StaffSection />
      <ScheduleSection />
      <ResultsSection />
      <TableSection />
      <InstagramSectionWrapper />
    </main>
  );
}
