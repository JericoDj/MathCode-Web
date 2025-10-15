import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import "./ProfileSettings.css";

export default function ProfileSettings() {
    const { user } = useContext(UserContext);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        password: "",
        confirmPassword: "",
    });

    const [children, setChildren] = useState([
        {
            id: 1,
            name: "Luna",
            avatar: "https://picsum.photos/seed/luna/80",
            school: "Sunshine Academy",
            gradeLevel: "Grade 3",
            address: "Manila, Philippines",
            emergencyContact: "+63 912 345 6789",
            parentGuardian: "Maria Santos",
            parentEmail: "parent@email.com",
            parentPhone: "+63 987 654 3210"
        }
    ]);

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [childForm, setChildForm] = useState({
        name: "",
        school: "",
        gradeLevel: "",
        address: "",
        emergencyContact: "",
        parentGuardian: "",
        parentEmail: "",
        parentPhone: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleChildChange = (e) => {
        const { name, value } = e.target;
        setChildForm({
            ...childForm,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Save updates to backend
        console.log("Updated profile:", formData);
        alert("Profile updated successfully!");
    };

    const openAddDialog = () => {
        setChildForm({
            name: "",
            school: "",
            gradeLevel: "",
            address: "",
            emergencyContact: "",
            parentGuardian: "",
            parentEmail: "",
            parentPhone: ""
        });
        setShowAddDialog(true);
    };

    const openEditDialog = (childId) => {
        const child = children.find(c => c.id === childId);
        if (child) {
            setSelectedChild(childId);
            setChildForm({
                name: child.name,
                school: child.school,
                gradeLevel: child.gradeLevel,
                address: child.address,
                emergencyContact: child.emergencyContact,
                parentGuardian: child.parentGuardian,
                parentEmail: child.parentEmail,
                parentPhone: child.parentPhone
            });
            setShowEditDialog(true);
        }
    };

    const openDeleteDialog = (childId) => {
        setSelectedChild(childId);
        setShowDeleteDialog(true);
    };

    const handleAddChild = (e) => {
        e.preventDefault();
        if (childForm.name.trim() === "") {
            alert("Please enter child's name");
            return;
        }

        const child = {
            id: Date.now(),
            ...childForm,
            avatar: `https://picsum.photos/seed/${childForm.name.toLowerCase()}/80`
        };

        setChildren([...children, child]);
        setShowAddDialog(false);
        alert("Child profile added successfully!");
    };

    const handleUpdateChild = (e) => {
        e.preventDefault();
        if (childForm.name.trim() === "") {
            alert("Please enter child's name");
            return;
        }

        setChildren(children.map(child => 
            child.id === selectedChild 
                ? { ...child, ...childForm }
                : child
        ));
        
        setShowEditDialog(false);
        setSelectedChild(null);
        alert("Child profile updated successfully!");
    };

    const handleRemoveChild = () => {
        setChildren(children.filter(child => child.id !== selectedChild));
        setShowDeleteDialog(false);
        setSelectedChild(null);
        alert("Child profile removed successfully!");
    };

    const closeDialogs = () => {
        setShowAddDialog(false);
        setShowEditDialog(false);
        setShowDeleteDialog(false);
        setSelectedChild(null);
    };

    return (
        <>
       
            <br />

            <div className="profile-settings">
                <h2>Profile & Settings</h2>
                <p className="me-auto justify-content-start">Manage your account details and child profiles</p>

                <div className="settings-row">
                    {/* LEFT: Account Information */}
                    <div className="settings-main">
                        <section className="card">
                            <h3>Account Information</h3>
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+63 912 345 6789"
                                    />
                                </div>

                                <div className="password-section">
                                    <h4>Change Password</h4>
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

                                    <div className="form-group">
                                        <label>Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn-primary full">
                                    Save Changes
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* RIGHT: Child Profiles */}
                    <div className="settings-side">
                        <section className="card">
                            <div className="card-header">
                                <h3>Child Profiles</h3>
                                <button 
                                    className="btn-primary small"
                                    onClick={openAddDialog}
                                >
                                    + Add Child
                                </button>
                            </div>
                            <p className="muted">
                                Manage your child's profiles and enrolled programs
                            </p>

                            <div className="child-list">
                                {children.map((child) => (
                                    <div key={child.id} className="child-item detailed">
                                        <div className="child-header">
                                            <img
                                                src={child.avatar}
                                                alt={`${child.name} Avatar`}
                                                className="child-avatar large"
                                            />
                                            <div className="child-info">
                                                <p className="child-name">{child.name}</p>
                                                <span className="child-grade">{child.gradeLevel}</span>
                                            </div>
                                        </div>
                                        <div className="child-details">
                                            <p><strong>School:</strong> {child.school || "Not specified"}</p>
                                            <p><strong>Address:</strong> {child.address || "Not specified"}</p>
                                            <p><strong>Emergency Contact:</strong> {child.emergencyContact || "Not specified"}</p>
                                            <p><strong>Parent/Guardian:</strong> {child.parentGuardian || "Not specified"}</p>
                                            <p><strong>Contact:</strong> {child.parentPhone || "Not specified"}</p>
                                        </div>
                                        <div className="child-actions">
                                            <button 
                                                className="btn-outline small"
                                                onClick={() => openEditDialog(child.id)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="btn-danger small"
                                                onClick={() => openDeleteDialog(child.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                {children.length === 0 && (
                                    <div className="empty-state">
                                        <p>No child profiles added yet.</p>
                                        <button 
                                            className="btn-primary"
                                            onClick={openAddDialog}
                                        >
                                            Add Your First Child
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Add Child Dialog */}
                {showAddDialog && (
                    <div className="dialog-backdrop">
                        <div className="dialog">
                            <div className="dialog-header">
                                <h3>Add New Child</h3>
                                <button className="btn-close" onClick={closeDialogs}>✕</button>
                            </div>
                            <form onSubmit={handleAddChild} className="dialog-form">
                                <div className="form-group">
                                    <label>Child's Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={childForm.name}
                                        onChange={handleChildChange}
                                        placeholder="Enter child's full name"
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>School</label>
                                        <input
                                            type="text"
                                            name="school"
                                            value={childForm.school}
                                            onChange={handleChildChange}
                                            placeholder="School name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Grade Level</label>
                                        <input
                                            type="text"
                                            name="gradeLevel"
                                            value={childForm.gradeLevel}
                                            onChange={handleChildChange}
                                            placeholder="Grade 3"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={childForm.address}
                                        onChange={handleChildChange}
                                        placeholder="Full address"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Emergency Contact</label>
                                    <input
                                        type="tel"
                                        name="emergencyContact"
                                        value={childForm.emergencyContact}
                                        onChange={handleChildChange}
                                        placeholder="+63 912 345 6789"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Parent/Guardian</label>
                                    <input
                                        type="text"
                                        name="parentGuardian"
                                        value={childForm.parentGuardian}
                                        onChange={handleChildChange}
                                        placeholder="Guardian's full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Parent Email</label>
                                    <input
                                        type="email"
                                        name="parentEmail"
                                        value={childForm.parentEmail}
                                        onChange={handleChildChange}
                                        placeholder="parent@email.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Parent Phone</label>
                                    <input
                                        type="tel"
                                        name="parentPhone"
                                        value={childForm.parentPhone}
                                        onChange={handleChildChange}
                                        placeholder="+63 987 654 3210"
                                    />
                                </div>
                                <div className="dialog-actions">
                                    <button type="submit" className="btn-primary">
                                        Add Child
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-outline"
                                        onClick={closeDialogs}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Child Dialog */}
                {showEditDialog && (
                    <div className="dialog-backdrop">
                        <div className="dialog">
                            <div className="dialog-header">
                                <h3>Edit Child Profile</h3>
                                <button className="btn-close" onClick={closeDialogs}>✕</button>
                            </div>
                            <form onSubmit={handleUpdateChild} className="dialog-form">
                                <div className="form-group">
                                    <label>Child's Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={childForm.name}
                                        onChange={handleChildChange}
                                        placeholder="Enter child's full name"
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>School</label>
                                        <input
                                            type="text"
                                            name="school"
                                            value={childForm.school}
                                            onChange={handleChildChange}
                                            placeholder="School name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Grade Level</label>
                                        <input
                                            type="text"
                                            name="gradeLevel"
                                            value={childForm.gradeLevel}
                                            onChange={handleChildChange}
                                            placeholder="Grade 3"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={childForm.address}
                                        onChange={handleChildChange}
                                        placeholder="Full address"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Emergency Contact</label>
                                    <input
                                        type="tel"
                                        name="emergencyContact"
                                        value={childForm.emergencyContact}
                                        onChange={handleChildChange}
                                        placeholder="+63 912 345 6789"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Parent/Guardian</label>
                                    <input
                                        type="text"
                                        name="parentGuardian"
                                        value={childForm.parentGuardian}
                                        onChange={handleChildChange}
                                        placeholder="Guardian's full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Parent Email</label>
                                    <input
                                        type="email"
                                        name="parentEmail"
                                        value={childForm.parentEmail}
                                        onChange={handleChildChange}
                                        placeholder="parent@email.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Parent Phone</label>
                                    <input
                                        type="tel"
                                        name="parentPhone"
                                        value={childForm.parentPhone}
                                        onChange={handleChildChange}
                                        placeholder="+63 987 654 3210"
                                    />
                                </div>
                                <div className="dialog-actions">
                                    <button type="submit" className="btn-primary">
                                        Update Child
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-outline"
                                        onClick={closeDialogs}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                    <div className="dialog-backdrop">
                        <div className="dialog confirmation-dialog">
                            <div className="dialog-header">
                                <h3>Remove Child Profile</h3>
                                <button className="btn-close" onClick={closeDialogs}>✕</button>
                            </div>
                            <div className="dialog-content">
                                <div className="warning-icon">⚠️</div>
                                <p>Are you sure you want to remove this child profile? This action cannot be undone.</p>
                                <p className="warning-text">All session history and progress data for this child will be permanently deleted.</p>
                            </div>
                            <div className="dialog-actions">
                                <button 
                                    className="btn-danger"
                                    onClick={handleRemoveChild}
                                >
                                    Yes, Remove
                                </button>
                                <button 
                                    className="btn-outline"
                                    onClick={closeDialogs}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}