import React from "react";
import "./AboutPage.css";

export default function AboutPage({
    companyName = "MathCode",
    companyDescription = "MathCode is dedicated to empowering young learners through coding and math programs. We provide interactive, hands-on experiences to help children build skills for the future.",
    mission = "To inspire curiosity and a love for learning by providing engaging educational programs that develop critical thinking and problem-solving skills.",
    vision = "To be a leading platform for innovative education, nurturing the next generation of creators and innovators.",
    team = [
        { name: "Jane Doe", role: "CEO & Founder", img: "https://picsum.photos/seed/jane/150/150" },
        { name: "John Smith", role: "Lead Instructor", img: "https://picsum.photos/seed/john/150/150" },
        { name: "Emily Lee", role: "Curriculum Designer", img: "https://picsum.photos/seed/emily/150/150" },
    ],
}) {
    return (
        <main className="about-page">
            <article className="about-article">
                {/* Header */}
                <header className="about-header">
                    <h1>About {companyName}</h1>
                    <p>{companyDescription}</p>
                </header>

                {/* Mission & Vision */}
                <section className="about-mv">
                    <div className="about-mission">
                        <h2>Our Mission</h2>
                        <p>{mission}</p>
                    </div>
                    <div className="about-vision">
                        <h2>Our Vision</h2>
                        <p>{vision}</p>
                    </div>
                </section>

                {/* Team Section */}
                <section className="about-team">
                    <h2>Meet Our Team</h2>
                    <div className="team-grid">
                        {team.map((member, idx) => (
                            <div key={idx} className="team-card">
                                <img src={member.img} alt={member.name} />
                                <h3>{member.name}</h3>
                                <p>{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </article>
        </main>
    );
}
