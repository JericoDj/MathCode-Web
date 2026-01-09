import { useState } from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css";
import PricingDialog from "../../../components/PricingDialog/PricingDialog.jsx";

import HoverVideoChip from "./helpers/HoverVideoChip";
import barModelVideo from "../../../assets/BarModel.mp4";
import wordProblemVideo from "../../../assets/WordProblems.mp4";
import problemVariationVideo from "../../../assets/ProblemVariation.mp4";

export default function Hero() {
  const [openPricing, setOpenPricing] = useState(false);

  return (
    <>
      <section className="hero hero--sg">
        <div className="hero-inner">
          <h1 className="title">Singapore Math, Supercharged by Code</h1>
          <p className="subtitle">
            Master bar models, and problem-solving — then bring it to life with code.
          </p>

          <ul className="chips">
            <HoverVideoChip label="Bar Models" videoSrc={barModelVideo} />
            <HoverVideoChip label="Word Problems" videoSrc={wordProblemVideo} />
            <HoverVideoChip label="Problem Variations" videoSrc={problemVariationVideo} />
          </ul>

          <div className="actions">
            <button className="btn primary" onClick={() => setOpenPricing(true)}>
              Singapore Maths
            </button>

            <Link
              to="#"
              className="btn tertiary"
              onClick={(e) => e.preventDefault()}
            >
              Kids Coding <span className="soon-pill">Soon</span>
            </Link>
          </div>
        </div>

        <span className="scroll-hint">▼</span>
      </section>

      {/* Dialog Controlled Here */}
      <PricingDialog
        open={openPricing}
        onClose={() => setOpenPricing(false)}
      />
    </>
  );
}
