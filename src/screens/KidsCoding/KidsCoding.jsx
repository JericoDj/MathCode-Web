import { useState } from "react";
import "./KidsCoding.css";


import beginnerIcon from "../../assets/CoreConcepts/KidsCoding/Beginner.png";
import logicIcon from "../../assets/CoreConcepts/KidsCoding/Builder.png";
import gameIcon from "../../assets/CoreConcepts/KidsCoding/GameDev.png";
import roboticsIcon from "../../assets/CoreConcepts/KidsCoding/Robotics.png";
import appIcon from "../../assets/CoreConcepts/KidsCoding/Creator.png";

export default function KidsCoding() {
  const [demoOpen, setDemoOpen] = useState(false);

  const journey = [
    {
      title: "Beginner",
      icon: beginnerIcon,
      desc: "Learn basic commands, sequences, and problem solving",
      skills: ["Logic", "Sequencing", "Patterns"],
    },
    {
      title: "Builder",
      icon: logicIcon,
      desc: "Build simple programs and animations",
      skills: ["Variables", "Loops", "Events"],
    },
    {
      title: "Creator",
      icon: gameIcon,
      desc: "Design interactive projects and games",
      skills: ["Game Logic", "Debugging", "Flow Control"],
    },
    {
      title: "Game Dev",
      icon: appIcon,
      desc: "Publish playable game projects",
      skills: ["Physics", "UX", "Level Design"],
    },
    {
      title: "Robotics",
      icon: roboticsIcon,
      desc: "Control hardware and sensors in real-world tasks",
      skills: ["Hardware", "Automation", "IoT"],
    },
  ];

  return (
    <main className="coding-page">
      <section className="coding-hero">
        <h1>Kids Coding</h1>
        <p>
          Empowering kids to think logically, create boldly,
          and solve problems like programmers.
        </p>
      </section>

      <section className="coding-journey">
        <h2>The Coding Journey</h2>

        <div className="coding-carousel">
  <div className="coding-track">
    {journey.map((stage, i) => (
      <div key={i} className="coding-item">
        <img src={stage.icon} alt={stage.title} />
      </div>
    ))}
  </div>
</div>

        <div className="coding-actions center mt-32">
          <button className="btn primary" onClick={() => setDemoOpen(true)}>
            Start Coding Journey
          </button>
        </div>
      </section>

      {demoOpen && (
        <div className="coding-dialog-overlay" onClick={() => setDemoOpen(false)}>
          <div className="coding-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Book a Demo</h3>
            <p>See how we teach kids to code through play, logic, and creativity.</p>
            <button className="btn primary mt-16">Continue</button>
            <button className="btn secondary mt-8" onClick={() => setDemoOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
