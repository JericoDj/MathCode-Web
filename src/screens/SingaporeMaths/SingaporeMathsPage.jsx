import { Link } from "react-router-dom";
import { useState } from "react";
import "./SingaporeMaths.css";

import concreteImage from "../../assets/CoreConcepts/jar3d.png";
import barModelImage from "../../assets/CoreConcepts/jar3d.png";
import heuristicsImage from "../../assets/CoreConcepts/jar3d.png";
import variationsImage from "../../assets/CoreConcepts/jar3d.png";

import codeVideo from "../../assets/CoreConcepts/CodingVideo.mp4"; // your video

export default function SingaporeMaths() {
  const [demoOpen, setDemoOpen] = useState(false);

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

        {/* CTA AFTER PRINCIPLES */}
        <div className="sg-actions center mt-32">
          <button className="btn primary" onClick={() => setDemoOpen(true)}>
            Book a Demo
          </button>
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
      <section className="sg-section">
        
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
      </section>

      {/* DIALOG */}
      {demoOpen && (
        <div className="demo-dialog-overlay" onClick={() => setDemoOpen(false)}>
          <div className="demo-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Book a Demo</h3>
            <p>Walk through MathCode and see the platform in action.</p>

            {/* Placeholder — can integrate Calendly or form */}
            <button className="btn primary mt-16">
              Continue
            </button>
            <button className="btn secondary mt-8" onClick={() => setDemoOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
