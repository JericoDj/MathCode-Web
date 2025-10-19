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
    
    const upcomingPackages = [
        {
            id: 1,
            date: "Sept 20",
            time: "5:00 PM",
            topic: "Singapore Math: Fractions",
            instructor: "Ms. Baldevarona",
            img: "https://picsum.photos/seed/jane/80/80",
            link: "#",
            status: "scheduled",
            packageType: "1-1 Private",
            remainingSessions: 5
        },
        {
            id: 2,
            date: "Sept 27",
            time: "5:00 PM",
            topic: "Coding: Python Basics",
            instructor: "Mr. De Jesus",
            img: "https://picsum.photos/seed/paul/80/80",
            link: "#",
            status: "approved",
            packageType: "1-2 Small Group",
            remainingSessions: 8
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
        { label: "Packages Completed", value: "3", icon: "📦", color: "#4caf50" },
        { label: "Active Packages", value: "2", icon: "⚡", color: "#ff9800" },
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
                        📦 Book New Package
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

                {/* Middle Column - Packages & Profile */}
                <div className="col-middle">
                    {/* Upcoming Packages */}
                    <div className="card packages-card">
                        <div className="card-header">
                            <h3>Active Packages</h3>
                            <button className="btn-text">View All</button>
                        </div>
                        <div className="packages-list">
                            {upcomingPackages.map((pkg) => (
                                <div key={pkg.id} className="package-item">
                                    <img 
                                        src={pkg.img} 
                                        alt={pkg.instructor}
                                        className="instructor-avatar"
                                    />
                                    <div className="package-details">
                                        <h4>{pkg.topic}</h4>
                                        <div className="package-meta">
                                            <span className="instructor">{pkg.instructor}</span>
                                            <span className="package-type">{pkg.packageType}</span>
                                            <span className="datetime">
                                                {pkg.date} • {pkg.time}
                                            </span>
                                            <span className="sessions-left">
                                                {pkg.remainingSessions} sessions left
                                            </span>
                                        </div>
                                    </div>
                                    <div className="package-actions">
                                        <span className={`status-tag ${pkg.status}`}>
                                            {pkg.status === 'scheduled' ? '🎯 Ready' : '✅ Confirmed'}
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
                                <span className="action-icon">📦</span>
                                <span>View Packages</span>
                            </button>
                            <button className="action-btn secondary">
                                <span className="action-icon">📚</span>
                                <span>Book New</span>
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
                                <p>Get 20% off when booking quarterly packages!</p>
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