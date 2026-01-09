import { useState } from "react";
import "./KidsCoding.css";

import ComingSoonDialog from "../../components/ComingSoon/ComingSoonDialog.jsx";

import beginnerIcon from "../../assets/CoreConcepts/KidsCoding/Beginner.png";
import logicIcon from "../../assets/CoreConcepts/KidsCoding/Builder.png";
import gameIcon from "../../assets/CoreConcepts/KidsCoding/GameDev.png";
import roboticsIcon from "../../assets/CoreConcepts/KidsCoding/Robotics.png";
import appIcon from "../../assets/CoreConcepts/KidsCoding/Creator.png";

export default function KidsCoding() {
  const [comingSoon, setComingSoon] = useState(false);

  const journey = [
    {
      title: "Beginner",
      icon: beginnerIcon,
      desc: "Learn basic commands and problem solving",
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


        <div className="coding-actions center mt-32">
          <button className="btn primary" onClick={() => setComingSoon(true)}>
            Start Coding Journey
          </button>
        </div>

      <section className="coding-journey">
        <h2>Coding Journey</h2>

        <div className="coding-carousel">
          <div className="coding-track">
            {journey.map((stage, i) => (
              <div key={i} className="coding-item">
                <img src={stage.icon} alt={stage.title} />
                <h3 className="coding-title">{stage.title}</h3>
                <p className="coding-desc">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>

      
      </section>

      <ComingSoonDialog
        open={comingSoon}
        onClose={() => setComingSoon(false)}
        title="Kids Coding"
        message="Our Coding Program is launching soon — featuring Scratch, Game Development, Python & Robotics!"
      />
    </main>
  );
}
