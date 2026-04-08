import React, { useState, useEffect } from 'react';
import { X, FileUp, Info, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AssignmentDetail.css';

const AssignmentDetail = ({ assignment, onBack }) => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [comments, setComments] = useState('');
    const [file, setFile] = useState(null);
    const [submission, setSubmission] = useState(null);

    useEffect(() => {
        if (user && assignment) {
            fetch(`http://localhost:8080/api/submissions/student/${user.id}`)
                .then(res => {
                    if (!res.ok) throw new Error("API error");
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        const found = data.find(sub => sub.assignmentId === assignment.id);
                        if (found) {
                            setSubmission(found);
                        }
                    }
                })
                .catch(err => console.error("Error fetching submission:", err));
        }
    }, [user, assignment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('assignmentId', assignment.id);
        formData.append('studentId', user.id);
        formData.append('studentName', user.name);
        formData.append('comments', comments);
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch('http://localhost:8080/api/submissions', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setSubmission(data);
                setSubmissionSuccess(true);
            } else {
                alert('Submission failed!');
            }
        } catch (error) {
            console.error('Error submitting:', error);
            alert('An error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submissionSuccess) {
        return (
            <div className="success-view card">
                <CheckCircle size={64} className="success-icon" />
                <h2>Assignment Submitted!</h2>
                <p>Your work for "{assignment.title}" has been successfully uploaded.</p>
                <button onClick={onBack} className="btn-primary">Back to Dashboard</button>
            </div>
        );
    }

    // Determine effective status
    let effectiveStatus = assignment.status;
    if (submission) {
        if (submission.grade !== null && submission.grade !== undefined) {
            effectiveStatus = 'graded';
        } else {
            effectiveStatus = 'submitted';
        }
    }

    return (
        <div className="detail-container">
            <button className="back-btn" onClick={onBack}>
                <ArrowLeft size={18} />
                <span>Back to List</span>
            </button>

            <div className="detail-grid">
                <div className="assignment-info card">
                    <div className="info-header">
                        <span className="course-tag">{assignment.course}</span>
                        <span className={`badge ${effectiveStatus === 'graded' ? 'badge-success' : effectiveStatus === 'submitted' ? 'badge-primary' : 'badge-warning'}`}>
                            {effectiveStatus}
                        </span>
                    </div>
                    <h1>{assignment.title}</h1>
                    <p className="description">{assignment.description}</p>

                    <div className="meta-info">
                        <div className="meta-item">
                            <span className="meta-label">Due Date</span>
                            <span className="meta-value">{new Date(assignment.dueDate).toLocaleString()}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Total Points</span>
                            <span className="meta-value">{assignment.points}</span>
                        </div>
                    </div>

                    {submission && submission.grade !== null && submission.grade !== undefined && (
                        <div className="grade-box">
                            <h3>Grade Received</h3>
                            <div className="grade-display">
                                <span className="grade-score">{submission.grade}</span>
                                <span className="grade-total">/ {assignment.points}</span>
                            </div>
                            <div className="feedback-section">
                                <h4>Teacher's Feedback:</h4>
                                <p>{submission.feedback}</p>
                            </div>
                        </div>
                    )}
                </div>

                {!submission && effectiveStatus === 'pending' && (
                    <div className="submission-section card">
                        <h2>Submit Assignment</h2>
                        <form onSubmit={handleSubmit} className="submission-form">
                            <div className="file-upload-area">
                                <FileUp size={32} />
                                <p>Click to upload or drag and drop</p>
                                <span className="file-hint">PDF, DOCX or ZIP (max. 10MB)</span>
                                <input type="file" className="file-input" required onChange={(e) => setFile(e.target.files[0])} />
                            </div>

                            <div className="form-group">
                                <label>Comments for Teacher</label>
                                <textarea
                                    placeholder="Add any notes about your submission..."
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Uploading...' : 'Submit Work'}
                            </button>
                        </form>
                    </div>
                )}
                
                {submission && !submissionSuccess && (
                     <div className="submission-section card">
                        <h2>Your Submission</h2>
                        <div className="success-view card" style={{padding: '20px', textAlign: 'left', marginTop: 0}}>
                            <p><strong>Submitted on:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                            {submission.fileName && <p><strong>File:</strong> {submission.fileName}</p>}
                            {submission.comments && <p><strong>Comments:</strong> {submission.comments}</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentDetail;
