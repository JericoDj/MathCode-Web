import Hero from "./Hero/HeroSection.jsx";
import Highlights from "./Highlights/HighlightSection.jsx"; // ← your “Program”
import PricingSection from "./Pricing/PricingSection.jsx";
import ContactSection from "./Contact/ContactSection.jsx";
import MiniFaq from "./MiniFaq/MiniFaq.jsx";
import SingaportMaths from "../SingaporeMaths/SingaporeMathsPage.jsx";
import KidsCoding from "../KidsCoding/KidsCoding.jsx";
import "./HomePage.css";



export default function HomePage() {
  return (
    <main className="homepage">
      <br />
      <br />
      <section id="home" tabIndex={-1}><Hero /></section>
      <section id="singapore-maths" tabIndex={-1}><SingaportMaths /></section>
      {/* <section id="pricing" tabIndex={-1}><PricingSection /></section> */}
      <section id="kids-coding" tabIndex={-1}><KidsCoding /></section>
      {/* <section id="program" tabIndex={-1}><Highlights /></section> */}
      <section id="contact" tabIndex={-1}><ContactSection /></section>
      {/* <section id="faq" tabIndex={-1}><MiniFaq /></section> */}
    </main>
  );
}
