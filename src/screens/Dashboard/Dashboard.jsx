import { useContext } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import ChildProfile from "../../components/ChildProfile/ChildProfile.jsx";
import "./Dashboard.css";

export default function Dashboard() {
    const { user } = useContext(UserContext);

    const parentName = user?.firstName || "Parent";
    const childName = "Luna";
    const completedSessions = 7;
    const programName = "Beginner Scratch Coding";
    const progress = (7 / 20) * 100;
    
    const accomplishments = [
        "Completed Lesson 7: Loops",
        "Earned Scratch Basics Badge",
        "Built first interactive game",
    ];
    
    const upcomingSessions = [
        {
            id: 1,
            date: "Sept 20",
            time: "5:00 PM",
            topic: "Singapore Math: Fractions",
            instructor: "Ms. Baldevarona",
            img: "https://picsum.photos/seed/jane/80/80",
            link: "#",
            status: "scheduled"
        },
        {
            id: 2,
            date: "Sept 27",
            time: "5:00 PM",
            topic: "Coding: Python Basics",
            instructor: "Mr. De Jesus",
            img: "https://picsum.photos/seed/paul/80/80",
            link: "#",
            status: "approved"
        },
    ];

    const announcements = [
        { 
            id: 1, 
            type: "success", 
            message: "🎉 New Python Advanced Course is Now Available!", 
            date: "2 days ago" 
        },
        { 
            id: 2, 
            type: "info", 
            message: "📅 Workshop: Intro to Robotics on Sept 25", 
            date: "1 week ago" 
        },
        { 
            id: 3, 
            type: "warning", 
            message: "💳 Next billing cycle: Oct 1", 
            date: "3 days ago" 
        },
    ];

    const quickStats = [
        { label: "Sessions Completed", value: completedSessions, icon: "✅", color: "#4caf50" },
        { label: "Current Streak", value: "3 weeks", icon: "🔥", color: "#ff9800" },
        { label: "Program Progress", value: `${Math.round(progress)}%`, icon: "📈", color: "#2196f3" },
        { label: "Next Session", value: "Tomorrow", icon: "⏰", color: "#9c27b0" },
    ];

    return (
        <div className="dashboard-page">
            {/* Welcome Header */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Welcome back, {parentName}! 👋</h1>
                    <p>Here's what's happening with {childName}'s learning journey today</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary">
                        📚 Book New Session
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid">
                {quickStats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div 
                            className="stat-icon"
                            style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                        >
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Left Column - Progress & Achievements */}
                <div className="col-left">
                    {/* Progress Card */}
                    <div className="card progress-card">
                        <div className="card-header">
                            <h3>Learning Progress</h3>
                            <span className="progress-badge">{Math.round(progress)}%</span>
                        </div>
                        <div className="progress-section">
                            <div className="program-info">
                                <h4>{programName}</h4>
                                <p>{completedSessions} of 20 sessions completed</p>
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill" 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    <br />

                    {/* Accomplishments */}
                    <div className="card accomplishments-card">
                        <div className="card-header">
                            <h3>Recent Achievements</h3>
                        </div>
                        <div className="accomplishments-list">
                            {accomplishments.map((item, index) => (
                                <div key={index} className="accomplishment-item">
                                    <span className="accomplishment-icon">🏆</span>
                                    <span className="accomplishment-text">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle Column - Sessions & Profile */}
                <div className="col-middle">
                    {/* Upcoming Sessions */}
                    <div className="card sessions-card">
                        <div className="card-header">
                            <h3>Upcoming Sessions</h3>
                            <button className="btn-text">View All</button>
                        </div>
                        <div className="sessions-list">
                            {upcomingSessions.map((session) => (
                                <div key={session.id} className="session-item">
                                    <img 
                                        src={session.img} 
                                        alt={session.instructor}
                                        className="instructor-avatar"
                                    />
                                    <div className="session-details">
                                        <h4>{session.topic}</h4>
                                        <div className="session-meta">
                                            <span className="instructor">{session.instructor}</span>
                                            <span className="datetime">
                                                {session.date} • {session.time}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="session-actions">
                                        <span className={`status-tag ${session.status}`}>
                                            {session.status === 'scheduled' ? '🎯 Ready' : '✅ Confirmed'}
                                        </span>
                                        <button className="btn-join">
                                            Join
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Child Profile */}
                    <ChildProfile
                        childName={childName}
                        programName={programName}
                        completedSessions={completedSessions}
                    />
                </div>

                {/* Right Column - Announcements & Actions */}
                <div className="col-right">
                    {/* Announcements */}
                    <div className="card announcements-card">
                        <div className="card-header">
                            <h3>Announcements</h3>
                        </div>
                        <div className="announcements-list">
                            {announcements.map((announcement) => (
                                <div key={announcement.id} className="announcement-item">
                                    <div className="announcement-content">
                                        <p>{announcement.message}</p>
                                        <span className="announcement-date">{announcement.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                           <br />

                    {/* Quick Actions */}
                    <div className="card actions-card">
                        <div className="card-header">
                            <h3>Quick Actions</h3>
                        </div>
                        <div className="actions-grid">
                            <button className="action-btn primary">
                                <span className="action-icon">📚</span>
                                <span>Book Math</span>
                            </button>
                            <button className="action-btn secondary">
                                <span className="action-icon">💻</span>
                                <span>Book Coding</span>
                            </button>
                            <button className="action-btn outline">
                                <span className="action-icon">📋</span>
                                <span>View Progress</span>
                            </button>
                            <button className="action-btn outline">
                                <span className="action-icon">👥</span>
                                <span>Refer Friend</span>
                            </button>
                        </div>
                    </div>
                           <br />
                    {/* Promotions */}
                    <div className="card promo-card">
                        <div className="promo-content">
                            <div className="promo-icon"></div>
                            <div className="promo-text mx-auto">
                                <h4>Special Offer</h4>
                                <p>Get 20% off when booking 5 sessions!</p>
                            </div>
                        </div>
                        <button className="btn-outline promo-btn">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}