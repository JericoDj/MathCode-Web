import React, { useState } from "react";
import "./BookingDialog.css";

export default function BookingDialog({ onClose }) {
  const [formData, setFormData] = useState({
    studentName: '',
    subject: '',
    grade: '',
    preferredDate: '',
    preferredTime: '',
    duration: '60',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle booking logic here
    console.log('Booking session:', formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog-box booking-dialog">
        <div className="dialog-header">
          <h2>📚 Book New Session</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Student Name *</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter student's name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Subject *</label>
              <select 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="Singapore Math">Singapore Math</option>
                <option value="Scratch Coding">Scratch Coding</option>
                <option value="Python Basics">Python Basics</option>
                <option value="Python Advanced">Python Advanced</option>
                <option value="Robotics">Robotics</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
              </select>
            </div>
            <div className="form-group">
              <label>Grade Level</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g., Grade 3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Preferred Date *</label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Preferred Time *</label>
              <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Duration</label>
            <select 
              name="duration" 
              value={formData.duration} 
              onChange={handleChange}
            >
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </select>
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any specific topics, learning goals, or requirements..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Book Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}