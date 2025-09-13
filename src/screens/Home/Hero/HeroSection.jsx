import { Link } from "react-router-dom";
import "./HeroSection.css";

export default function Hero() {
  return (
    <section className="hero hero--sg">
      <div className="hero-inner">
        <h1 className="title">Singapore Math, Supercharged by Code</h1>
        <p className="subtitle">
          Master bar models, heuristics, and problem-solving — then bring it to life with code.
        </p>

        {/* Curriculum chips */}
        <ul className="chips" aria-label="Curriculum highlights">
          <li className="chip">Bar Models</li>
          <li className="chip">Heuristics</li>
          <li className="chip">Word Problems</li>
          <li className="chip">Problem Variations</li>
        </ul>

        <div className="actions">
          <Link to="/practice/sample" className="btn primary">Try a Sample</Link>
          <Link to="/about" className="btn secondary">See the Method</Link>

          {/* Kids coding: coming soon */}
          <Link to="/kids" className="btn tertiary" aria-disabled="true" onClick={(e)=>e.preventDefault()}>
            Kids Coding <span className="soon-pill">Soon</span>
          </Link>
        </div>
      </div>

      {/* tiny scroll hint */}
      <span className="scroll-hint" aria-hidden="true">▼</span>
    </section>
  );
}
