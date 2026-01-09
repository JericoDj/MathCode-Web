import { Link } from "react-router-dom";
import { useState } from "react";
import "./SingaporeMaths.css";

import concreteImage from "../../assets/CoreConcepts/SingaporeMath/jar3d.png";
import barModelImage from "../../assets/CoreConcepts/SingaporeMath/BarModel.png";
import heuristicsImage from "../../assets/CoreConcepts/SingaporeMath/heuristics.png";
import variationsImage from "../../assets/CoreConcepts/SingaporeMath/problem_variation.png";

import SingaporeMathVideo1 from "../../assets/BarModel.mp4";
import SingaporeMathVideo2 from "../../assets/WordProblems.mp4";
import SingaporeMathVideo3 from "../../assets/ProblemVariation.mp4"

import FreeAssessmentDialog from "../../components/FreeAssessmentDialog/FreeaAssessmentDialog.jsx";


export default function SingaporeMaths() {
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  return (
    <main className="sg-page">
       <br />
       <br />
       
       

      {/* HERO */}
      <section className="sg-hero">
        <h1>Singapore Maths</h1>
        <p>
          A world-renowned approach that builds deep understanding, 
          problem-solving skills, and mathematical confidence.
        </p>
      </section>

      {/* VIDEO SHOWCASE */}
{/* VIDEO SHOWCASE */}
<section className="sg-showcase">
  <video src={SingaporeMathVideo1} autoPlay loop muted playsInline className="sg-showcase-video" />
  <video src={SingaporeMathVideo2} autoPlay loop muted playsInline className="sg-showcase-video" />
  <video src={SingaporeMathVideo3} autoPlay loop muted playsInline className="sg-showcase-video" />
</section>

<div className="center-row">
  <button className="btn primary" onClick={() => setAssessmentOpen(true)}>
    Book Free Assessment
  </button>
</div>

      {/* CORE PRINCIPLES */}
      <section className="sg-section">
        <h2>The Core Principles</h2>

        <div className="sg-grid">
          <div className="sg-card">
            <img src={concreteImage} alt="Concrete to Abstract" className="sg-card-img" />
            <h3>Concrete → Pictorial → Abstract</h3>
            <p>
              Students begin with hands-on understanding, move to visual models, 
              and finally master symbols and equations.
            </p>
          </div>

          <div className="sg-card">
            <img src={barModelImage} alt="Bar Models" className="sg-card-img" />
            <h3>Bar Models</h3>
            <p>
              Visual representations that help learners break down complex word 
              problems logically and systematically.
            </p>
          </div>

          <div className="sg-card">
            <img src={heuristicsImage} alt="Heuristics" className="sg-card-img" />
            <h3>Heuristics</h3>
            <p>
              Students learn structured strategies for solving non-routine problems.
            </p>
          </div>

          <div className="sg-card">
            <img src={variationsImage} alt="Problem Variations" className="sg-card-img" />
            <h3>Problem Variations</h3>
            <p>
              By changing conditions, students deepen mastery and flexibility in thinking.
            </p>
          </div>
        </div>

        <br />

        {/* CTA AFTER PRINCIPLES */}
        <div className="sg-actions center mt-32">

        </div>
      </section>

      {/* WHY IT WORKS */}
      {/* <section className="sg-section muted-bg">
        <h2>Why Singapore Maths Works</h2>
        <ul className="sg-list">
          <li>✔ Develops strong number sense</li>
          <li>✔ Encourages logical thinking</li>
          <li>✔ Builds confidence through understanding</li>
          <li>✔ Proven success in global assessments</li>
        </ul>
      </section> */}

      {/* VIDEO + SUPERCHARGED */}
      {/* <section className="sg-section"> */}
        
        {/* VIDEO CLIP */}
        {/* <video 
          src={codeVideo}
          className="sg-video"
          autoPlay
          loop
          muted
          playsInline
        />

        <h2>Supercharged by Code</h2>
        <p className="centered">
          At MathCode, students don’t just solve problems —
          they bring them to life using code, strengthening logic,
          sequencing, and computational thinking.
        </p> */}
      {/* </section> */}

      {/* DIALOG */}
          <FreeAssessmentDialog
        open={assessmentOpen}
        onClose={() => setAssessmentOpen(false)}
      />
    </main>
  );
}
