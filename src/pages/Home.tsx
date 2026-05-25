import "./Home.css";
import Hero from "@/components/Hero";
import MapsSection from "@/components/MapsSection";
import EducationSection from "@/components/EducationSection";
import WasteGuideSection from "@/components/WasteGuideSection";
import Footer  from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <div className="home-page">
      <Navigation />
      <Hero />
      <MapsSection />
      <EducationSection />
      <WasteGuideSection />
      <Footer />
    </div>
  );
}
