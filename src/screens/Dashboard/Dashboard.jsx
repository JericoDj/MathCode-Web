import { useContext } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import ChildProfile from "../../components/ChildProfile/ChildProfile.jsx";

import "./Dashboard.css";

export default function Dashboard() {
    const { user } = useContext(UserContext);


    const parentName = user?.firstName || "Parent";
    const childName = "Luna"; // Replace with API data
    const completedSessions = 7;
    const programName = "Beginner Scratch Coding";
    const nextSession = { date: "Sept 20", time: "5:00 PM" };

    const progress = (7 / 20) * 100;
    const accomplishments = [
        "Completed Lesson 7: Loops",
        "Earned Scratch Basics Badge",
    ];
    const upcomingSessions = [
        {
            date: "Sept 20",
            time: "5:00 PM",
            topic: "Singapore Math: Fractions",
            instructor: "Ms. Baldevarona",
            img: "https://picsum.photos/seed/jane/80/80",
            link: "#",
        },
        {
            date: "Sept 27",
            time: "5:00 PM",
            topic: "Coding: Python Basics",
            instructor: "Mr. De Jesus",
            img: "https://picsum.photos/seed/paul/80/80",
            link: "#",
        },
    ];
    const projects = [
        { title: "Space Invaders", img: "https://picsum.photos/seed/space/200/150" },
        { title: "Piano App", img: "https://picsum.photos/seed/piano/200/150" },
        { title: "Maze Game", img: "https://picsum.photos/seed/maze/200/150" },
    ];

    return (
        <>
   
       
            <br />
            <div className="dashboard-grid">
                {/* LEFT COLUMN */}
                <div className="col-left">
                    <section className="card snapshot">
                        <h2>Welcome, {parentName}!</h2>
                        <p>
                            Your child, <strong>{childName}</strong>, has completed{" "}
                            <strong>{completedSessions}</strong> sessions and is currently enrolled in{" "}
                            <strong>{programName}</strong>.
                        </p>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <p>{Math.round(progress)}% completed (7/20 lessons)</p>
                    </section>

                    <br />

                    <section className="card accomplishments">
                        <h3>Recent Accomplishments</h3>
                        <ul>
                            {accomplishments.map((a, i) => (
                                <li key={i}>{a}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* MIDDLE COLUMN */}
                <div className="col-middle">
                    <section className="card sessions">
                        <h3>Upcoming Sessions</h3>
                        <ul className="session-list">
                            {upcomingSessions.map((s, i) => (
                                <li key={i} className="session-item">
                                    <img src={s.img} alt={s.instructor} className="instructor-img" />
                                    <div>
                                        <p>
                                            <strong>
                                                {s.date} – {s.time}
                                            </strong>
                                        </p>
                                        <p>{s.topic}</p>
                                        <small>Instructor: {s.instructor}</small>
                                    </div>
                                    <div className="session-actions">
                                        <a href={s.link} className="btn-primary">Join</a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                          <br />
                             <br />

                    {/* <section className="card projects">
                        <h3>Achievements & Projects</h3>
                        <div className="project-gallery">
                            {projects.map((p, i) => (
                                <div key={i} className="project-card">
                                    <img src={p.img} alt={p.title} />
                                    <p>{p.title}</p>
                                </div>
                            ))}
                        </div>
                    </section> */}
{/* 
                          <br /> */}

                    {/* Child Profile Snapshot */}
                    <ChildProfile
                        childName={childName}
                        programName={programName}
                        completedSessions={completedSessions}
                    />





                </div>

                {/* RIGHT COLUMN */}
                <div className="col-right">
                    
                    <section className="card announcements">
                        <h3>Announcements</h3>
                        <ul>
                            <li>🎉 New Python Advanced Course is Now Available!</li>
                            <li>📅 Workshop: Intro to Robotics on Sept 25</li>
                            <li>💳 Next billing cycle: Oct 1</li>
                        </ul>
                    </section>
                          <br />

                    <section className="card promos">
                        <h3>Promotions</h3>
                        <p>🔥 Get 20% off when booking 5 sessions at once!</p>
                        <p>⭐ Refer a friend and earn free credits.</p>
                    </section>

                          <br />

                    <section className="card cta">
                        <h3>Book a Session</h3>
                        <button className="btn-primary full">Book Singapore Math</button>
                        <button className="btn-primary full">Book Coding</button>
                    </section>
                    

                </div>
            </div>
               <br />
        </>
    );
}
