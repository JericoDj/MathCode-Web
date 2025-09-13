import Hero from "./Hero/HeroSection.jsx";
import Highlights from "./Highlights/HighlightSection.jsx";
import CtaStrip from "./CtaStrip/CtaStrip.jsx";
import MiniFaq from "./MiniFaq/MiniFaq.jsx";
import styles from "./HomePage.css";

export default function HomePage() {
  return (
    <main className={styles.homepage}>
      <Hero />
      <Highlights />
      <CtaStrip />
      <MiniFaq />
    </main>
  );
}