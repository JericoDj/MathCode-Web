import styles from "./MiniFaq.css";

export default function MiniFaq() {
  return (
    <section className={styles.faq}>
      <details>
        <summary>Do I need prior coding experience?</summary>
        <p>No. We start with gentle problems and explain the code you write.</p>
      </details>
      <details>
        <summary>Is MathCode free?</summary>
        <p>Yes, core practice is free. Premium adds advanced sets and insights.</p>
      </details>
      <details>
        <summary>Which languages are supported?</summary>
        <p>Start with JavaScript, with Python coming soon.</p>
      </details>
    </section>
  );
}
