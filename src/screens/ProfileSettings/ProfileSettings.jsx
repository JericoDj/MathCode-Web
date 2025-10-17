import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import { StudentContext } from "../../context/StudentContext.jsx";
import "./ProfileSettings.css";

export default function ProfileSettings() {
    const { user } = useContext(UserContext);
    const { students, loading, error, addStudent, updateStudent, deleteStudent } = useContext(StudentContext);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        password: "",
        confirmPassword: "",
    });

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentForm, setStudentForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gradeLevel: "",
        school: "",
        address: "",
        // emergencyContact is removed since we'll use phone
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleStudentFormChange = (e) => {
        const { name, value } = e.target;
        setStudentForm({
            ...studentForm,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Save updates to backend
        console.log("Updated profile:", formData);
 
    };

    const openAddDialog = () => {
        setStudentForm({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            gradeLevel: "",
            school: "",
            address: "",
            // emergencyContact is removed
        });
        setShowAddDialog(true);
    };

    const openEditDialog = (studentId) => {
        const student = students.find(s => s.id === studentId);
        if (student) {
            setSelectedStudent(studentId);
            setStudentForm({
                firstName: student.firstName || "",
                lastName: student.lastName || "",
                email: student.email || "",
                phone: student.phone || "",
                gradeLevel: student.gradeLevel || "",
                school: student.school || "",
                address: student.address || "",
                // emergencyContact is removed - using phone instead
            });
            setShowEditDialog(true);
        }
    };

    const openDeleteDialog = (studentId) => {
        setSelectedStudent(studentId);
        setShowDeleteDialog(true);
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (studentForm.firstName.trim() === "" || studentForm.lastName.trim() === "") {
            alert("Please enter child's first and last name");
            return;
        }

        try {
            await addStudent(studentForm);
            setShowAddDialog(false);
            alert("Child profile added successfully!");
        } catch (error) {
            alert(`Failed to add child: ${error.message}`);
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        if (studentForm.firstName.trim() === "" || studentForm.lastName.trim() === "") {
            alert("Please enter child's first and last name");
            return;
        }

        try {
            await updateStudent(selectedStudent, studentForm);
            setShowEditDialog(false);
            setSelectedStudent(null);
          
        } catch (error) {
            alert(`Failed to update child: ${error.message}`);
        }
    };

    const handleRemoveStudent = async () => {
        try {
            await deleteStudent(selectedStudent);
            setShowDeleteDialog(false);
            setSelectedStudent(null);
            alert("Child profile removed successfully!");
        } catch (error) {
            alert(`Failed to remove child: ${error.message}`);
        }
    };

    const closeDialogs = () => {
        setShowAddDialog(false);
        setShowEditDialog(false);
        setShowDeleteDialog(false);
        setSelectedStudent(null);
    };

    return (
        <>
            <br />
            <div className="profile-settings">
                <h2>Profile & Settings</h2>
                <p className="me-auto justify-content-start">Manage your account details and child profiles</p>

                {error && (
                    <div className="error-banner">
                        <strong>Error:</strong> {error}
                    </div>
                )}

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

                                <button type="submit" className="btn-primary full" disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* RIGHT: Child Profiles */}
                    <div className="settings-side">
                        <section className="card">
                            <div className="card-header">
                                <h3>Child Profiles</h3>
                                {/* <button 
                                    className="btn-primary small"
                                    onClick={openAddDialog}
                                    disabled={loading}
                                >
                                    + Add Child
                                </button> */}
                            </div>
                            <p className="muted">
                                Manage your child's profiles and enrolled programs
                            </p>

                            <div className="child-list">
                                {students.map((student) => (
                                    <div key={student.id} className="child-item detailed">
                                        <div className="child-header">
                                            <img
                                                src={student.avatar}
                                                alt={`${student.fullName} Avatar`}
                                                className="child-avatar large"
                                            />
                                            <div className="child-info">
                                                <p className="child-name">{student.fullName}</p>
                                                <div className="child-badges">
                                                    {student.school && (
                                                        <span className="child-badge school-badge">
                                                            {student.school}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="child-details">
                                            <p><strong>Grade Level:</strong> {student.gradeLevel || "Not specified"}</p>
                                            <p><strong>School:</strong> {student.school || "Not specified"}</p>
                                            <p><strong>Email:</strong> {student.email || "Not specified"}</p>
                                            <p><strong>Phone/Emergency Contact:</strong> {student.phone || "Not specified"}</p>
                                            <p><strong>Address:</strong> {student.address || "Not specified"}</p>
                                        </div>
                                        <div className="child-actions">
                                            <button 
                                                className="btn-outline small"
                                                onClick={() => openEditDialog(student.id)}
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            {/* <button 
                                                className="btn-danger small"
                                                onClick={() => openDeleteDialog(student.id)}
                                                disabled={loading}
                                            >
                                                Remove
                                            </button> */}
                                        </div>
                                    </div>
                                ))}
                                
                                {students.length === 0 && (
                                    <div className="empty-state">
                                        <p>No child profiles added yet.</p>
                                        <button 
                                            className="btn-primary"
                                            onClick={openAddDialog}
                                            disabled={loading}
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
                            <form onSubmit={handleAddStudent} className="dialog-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={studentForm.firstName}
                                            onChange={handleStudentFormChange}
                                            placeholder="Child's first name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={studentForm.lastName}
                                            onChange={handleStudentFormChange}
                                            placeholder="Child's last name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Grade Level</label>
                                        <input
                                            type="text"
                                            name="gradeLevel"
                                            value={studentForm.gradeLevel}
                                            onChange={handleStudentFormChange}
                                            placeholder="Grade 3"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>School</label>
                                        <input
                                            type="text"
                                            name="school"
                                            value={studentForm.school}
                                            onChange={handleStudentFormChange}
                                            placeholder="School name"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={studentForm.email}
                                            onChange={handleStudentFormChange}
                                            placeholder="child@email.com"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone/Emergency Contact *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={studentForm.phone}
                                            onChange={handleStudentFormChange}
                                            placeholder="+63 912 345 6789"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={studentForm.address}
                                        onChange={handleStudentFormChange}
                                        placeholder="Full address"
                                    />
                                </div>
                                <div className="dialog-actions">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? "Adding..." : "Add Child"}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-outline"
                                        onClick={closeDialogs}
                                        disabled={loading}
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
                            <form onSubmit={handleUpdateStudent} className="dialog-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={studentForm.firstName}
                                            onChange={handleStudentFormChange}
                                            placeholder="Child's first name"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={studentForm.lastName}
                                            onChange={handleStudentFormChange}
                                            placeholder="Child's last name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Grade Level</label>
                                        <input
                                            type="text"
                                            name="gradeLevel"
                                            value={studentForm.gradeLevel}
                                            onChange={handleStudentFormChange}
                                            placeholder="Grade 3"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>School</label>
                                        <input
                                            type="text"
                                            name="school"
                                            value={studentForm.school}
                                            onChange={handleStudentFormChange}
                                            placeholder="School name"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={studentForm.email}
                                            onChange={handleStudentFormChange}
                                            placeholder="child@email.com"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone/Emergency Contact *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={studentForm.phone}
                                            onChange={handleStudentFormChange}
                                            placeholder="+63 912 345 6789"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={studentForm.address}
                                        onChange={handleStudentFormChange}
                                        placeholder="Full address"
                                    />
                                </div>
                                <div className="dialog-actions">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? "Updating..." : "Update Child"}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-outline"
                                        onClick={closeDialogs}
                                        disabled={loading}
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
                                    onClick={handleRemoveStudent}
                                    disabled={loading}
                                >
                                    {loading ? "Removing..." : "Yes, Remove"}
                                </button>
                                <button 
                                    className="btn-outline"
                                    onClick={closeDialogs}
                                    disabled={loading}
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