import { Link } from "react-router-dom";
import styles from "./HighlightSection.css";

const items = [
  {
    title: "Practice",
    text: "Solve curated math + coding challenges from basics to advanced.",
    to: "/practice",
    linkText: "Browse Problems →",
  },
  {
    title: "Progress",
    text: "Track your streaks, badges, and proficiency across topics.",
    to: "/dashboard",
    linkText: "View Dashboard →",
  },
  {
    title: "Explain",
    text: "See step-by-step breakdowns and hints when you get stuck.",
    to: "/about",
    linkText: "How It Works →",
  },
];

export default function Highlights() {
  return (
    <section className={styles.grid}>
      {items.map(({ title, text, to, linkText }) => (
        <article className={styles.card} key={title}>
          <h3>{title}</h3>
          <p>{text}</p>
          <Link to={to} className={styles.link}>{linkText}</Link>
        </article>
      ))}
    </section>
  );
}
