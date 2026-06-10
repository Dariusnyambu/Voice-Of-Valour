import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import CountdownSection from "@/components/sections/CountdownSection";
import AboutSection from "@/components/sections/AboutSection";
import MinistersSection from "@/components/sections/MinistersSection";
import RegistrationSection from "@/components/sections/RegistrationSection";
import PartnershipSection from "@/components/sections/PartnershipSection";
import StatisticsSection from "@/components/sections/StatisticsSection";
import DirectionsSection from "@/components/sections/DirectionsSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <CountdownSection />
      <AboutSection />
      <MinistersSection />
      <RegistrationSection />
      <PartnershipSection />
      <StatisticsSection />
      <DirectionsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
