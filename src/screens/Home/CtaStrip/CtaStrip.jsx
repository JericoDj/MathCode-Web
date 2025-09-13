import { Link } from "react-router-dom";
import styles from "./CtaStrip.css";

export default function CtaStrip() {
  return (
    <section className={styles.strip}>
      <p>Try a sample challenge — no signup required.</p>
      <Link to="/practice/sample" className={styles.btn}>Try a Sample</Link>
    </section>
  );
}
