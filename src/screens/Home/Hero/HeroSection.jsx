import { useState } from "react";
import "./HeroSection.css";
import { Link } from "react-router-dom";

import PricingDialog from "../../../components/PricingDialog/PricingDialog.jsx";
import KidsCodingPricingDialog from "../../../components/KidsCodingDialog/KidsCodingDialogPrice.jsx";
import ComingSoonDialog from "../../../components/ComingSoon/ComingSoonDialog.jsx";

import HoverVideoChip from "./helpers/HoverVideoChip";
import barModelVideo from "../../../assets/BarModel.mp4";
import wordProblemVideo from "../../../assets/WordProblems.mp4";
import problemVariationVideo from "../../../assets/ProblemVariation.mp4";


export default function Hero() {
  const [openMathPricing, setOpenMathPricing] = useState(false);
  // const [openCodingPricing, setOpenCodingPricing] = useState(false);
  const [comingSoon, setComingSoon] = useState(false);

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
            <button
              className="btn primary"
              onClick={() => setOpenMathPricing(true)}
            >
              Singapore Maths
            </button>

            <button
  className="btn tertiary"
  onClick={() => setComingSoon(true)}
>
  Kids Coding
</button>
          </div>
        </div>

        <span className="scroll-hint">▼</span>
      </section>

      {/* SG Math Pricing Dialog */}
      <PricingDialog
        open={openMathPricing}
        onClose={() => setOpenMathPricing(false)}
      />

      {/* Kids Coding Pricing Dialog
      <KidsCodingPricingDialog
        open={openCodingPricing}
        onClose={() => setOpenCodingPricing(false)}
      /> */}


      <ComingSoonDialog
  open={comingSoon}
  onClose={() => setComingSoon(false)}
  title="Kids Coding"
  message="Our coding program is launching soon with tracks like Scratch, Game Dev, Python, AI, and Robotics!"
/>
    </>
  );
}
