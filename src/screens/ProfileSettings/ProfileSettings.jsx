import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import "./ProfileSettings.css";

export default function ProfileSettings() {
    const { user } = useContext(UserContext);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        password: "",
        notifications: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Save updates to backend
        console.log("Updated profile:", formData);
    };

    return (
        <>
            <br />
            <br />
            <br />

            <div className="profile-settings">
                <h2>Profile & Settings</h2>
                <p className="intro">Manage your account details and preferences</p>

                <div className="settings-row">
                    {/* LEFT: Account + Preferences */}
                    <div className="settings-main">
                        <section className="card">
                            <h3>Account Information</h3>
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button type="submit" className="btn-primary full">
                                    Save Changes
                                </button>
                            </form>
                        </section>

                        <section className="card">
                            <h3>Preferences</h3>
                            <div className="form-group checkbox">
                                <input
                                    type="checkbox"
                                    id="notifications"
                                    name="notifications"
                                    checked={formData.notifications}
                                    onChange={handleChange}
                                />
                                <label htmlFor="notifications">
                                    Enable Email Notifications
                                </label>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT: Child Profiles */}
                    <div className="settings-side">
                        <section className="card">
                            <h3>Child Profiles</h3>
                            <p className="muted">
                                Manage your child’s profiles and enrolled programs
                            </p>
                            <div className="child-list">
                                <div className="child-item detailed">
                                    <img
                                        src="https://picsum.photos/seed/luna/80"
                                        alt="Child Avatar"
                                        className="child-avatar large"
                                    />
                                    <div className="child-details">
                                        <p><strong>Luna</strong></p>
                                        <p><small>School: Sunshine Academy</small></p>
                                        <p><small>Grade Level: Grade 3</small></p>
                                        <p><small>Address: Manila, Philippines</small></p>
                                        <p><small>Emergency Contact: +63 912 345 6789</small></p>
                                        <p><small>Parent/Guardian: Maria Santos</small></p>
                                        <p><small>Email: parent@email.com</small></p>
                                        <p><small>Contact: +63 987 654 3210</small></p>
                                    </div>
                                    <button className="btn-outline small">Edit</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
