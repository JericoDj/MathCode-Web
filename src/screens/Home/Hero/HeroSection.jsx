import { Link } from "react-router-dom";
import "./HeroSection.css";

import HoverVideoChip from "./helpers/HoverVideoChip";

import barModelVideo from "../../../assets/BarModel.mp4";
import wordProblemVideo from "../../../assets/WordProblems.mp4";
import problemVariationVideo from "../../../assets/ProblemVariation.mp4";

export default function Hero() {
  return (
    <section className="hero hero--sg">
      <div className="hero-inner">
        <h1 className="title">Singapore Math, Supercharged by Code</h1>
        <p className="subtitle">
          Master bar models, and problem-solving — then bring it to life with code.
        </p>

        <ul className="chips" aria-label="Curriculum highlights">
          <HoverVideoChip label="Bar Models" videoSrc={barModelVideo} />
          {/* <HoverVideoChip label="Heuristics" /> */}
          <HoverVideoChip label="Word Problems" videoSrc={wordProblemVideo} />
          <HoverVideoChip
            label="Problem Variations"
            videoSrc={problemVariationVideo}
          />
        </ul>

        <div className="actions">
          <Link to="/singapore-maths" className="btn primary">
  Singapore Maths
</Link>
          {/* <Link to="/about" className="btn secondary">
            See the Method
          </Link> */}
          <Link
            to="/kids"
            className="btn tertiary"
            aria-disabled="true"
            onClick={(e) => e.preventDefault()}
          >
            Kids Coding <span className="soon-pill">Soon</span>
          </Link>
        </div>
      </div>

      <span className="scroll-hint" aria-hidden="true">▼</span>
    </section>
  );
}
