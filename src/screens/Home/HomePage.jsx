import Hero from "./Hero/HeroSection.jsx";
import Highlights from "./Highlights/HighlightSection.jsx";
import PricingSection from "./Pricing/PricingSection.jsx";
import ContactSection from "./Contact/ContactSection.jsx";
import MiniFaq from "./MiniFaq/MiniFaq.jsx";

import "./HomePage.css";

export default function HomePage() {
  return (
    <main className="homepage">
      <Hero />
      <PricingSection />
      <Highlights />
      <ContactSection />
      <MiniFaq />
   
    </main>
  );
}