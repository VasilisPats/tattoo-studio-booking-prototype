import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import StatsBar from "@/components/StatsBar";
import Artists from "@/components/Artists";
import Process from "@/components/Process";
import Safety from "@/components/Safety";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import SectionIndicator from "@/components/SectionIndicator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Process />
      <Gallery />
      <StatsBar />
      <Artists />
      <Safety />
      <Reviews />
      <Footer />
      <FloatingCTA />
      <SectionIndicator />
    </div>
  );
};

export default Index;
