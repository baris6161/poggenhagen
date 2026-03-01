import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/sections/HeroSection";
import NextMatchSection from "@/sections/NextMatchSection";
import ResultsSection from "@/sections/ResultsSection";
import ScheduleSection from "@/sections/ScheduleSection";
import TableSection from "@/sections/TableSection";
import SquadSection from "@/sections/SquadSection";
import StaffSection from "@/sections/StaffSection";
import InstagramSection from "@/sections/InstagramSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <NextMatchSection />
        <ResultsSection />
        <ScheduleSection />
        <TableSection />
        <SquadSection />
        <StaffSection />
        <InstagramSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
