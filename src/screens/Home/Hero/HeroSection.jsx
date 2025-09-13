import { Link } from "react-router-dom";
import styles from "./HeroSection.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Master Math Through Code</h1>
      <p className={styles.subtitle}>Bite-sized problems. Instant feedback. Learn by building.</p>
      <div className={styles.actions}>
        <Link to="/register" className={`${styles.btn} ${styles.primary}`}>Get Started</Link>
        <Link to="/about" className={`${styles.btn} ${styles.secondary}`}>Learn More</Link>
      </div>
    </section>
  );
}
