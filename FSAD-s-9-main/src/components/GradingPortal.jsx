import React, { useState, useEffect } from 'react';
import { Check, ClipboardList, User, Calendar, FileText, Send } from 'lucide-react';
import './GradingPortal.css';

const GradingPortal = ({ assignment, onBack }) => {
    const [submissionsList, setSubmissionsList] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradingData, setGradingData] = useState({ score: '', feedback: '' });
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch(`http://localhost:8080/api/submissions/assignment/${assignment.id}`)
            .then(res => {
                if (!res.ok) throw new Error("API error");
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setSubmissionsList(data);
                    if (data.length > 0) {
                        setSelectedSubmission(data[0]);
                        setGradingData({
                            score: data[0].grade !== null && data[0].grade !== undefined ? data[0].grade : '',
                            feedback: data[0].feedback || ''
                        });
                    }
                } else {
                    setSubmissionsList([]);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching submissions:", err);
                setSubmissionsList([]);
                setIsLoading(false);
            });
    }, [assignment.id]);

    const handleSelectSubmission = (sub) => {
        setSelectedSubmission(sub);
        setGradingData({
            score: sub.grade !== null && sub.grade !== undefined ? sub.grade : '',
            feedback: sub.feedback || ''
        });
        setIsSaved(false);
    };

    const handleGrade = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:8080/api/submissions/${selectedSubmission.id}/grade`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    grade: parseInt(gradingData.score),
                    feedback: gradingData.feedback
                })
            });

            if (response.ok) {
                const updated = await response.json();
                
                // Update in our list
                setSubmissionsList(prev => prev.map(s => s.id === updated.id ? updated : s));
                setSelectedSubmission(updated);
                
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
            } else {
                alert("Failed to save grade");
            }
        } catch (error) {
            console.error("Error saving grade:", error);
            alert("Network error while saving grade");
        }
    };

    const downloadFile = () => {
        if (!selectedSubmission) return;
        window.open(`http://localhost:8080/api/submissions/${selectedSubmission.id}/download`, '_blank');
    };

    if (isLoading) {
        return <div className="grading-portal"><div className="portal-header"><h2>Loading submissions...</h2></div></div>;
    }

    return (
        <div className="grading-portal">
            <div className="portal-header">
                <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>
                <h1>Grading: {assignment.title}</h1>
            </div>

            <div className="portal-grid">
                <aside className="submission-list">
                    <h3>Submissions ({submissionsList.length})</h3>
                    {submissionsList.length === 0 ? (
                        <p style={{padding: '1rem', color: '#666'}}>No submissions yet.</p>
                    ) : (
                        submissionsList.map(sub => (
                            <div 
                                key={sub.id} 
                                className={`submission-item ${selectedSubmission?.id === sub.id ? 'active' : ''}`}
                                onClick={() => handleSelectSubmission(sub)}
                                style={{cursor: 'pointer'}}
                            >
                                <div className="stu-avatar"><User size={18} /></div>
                                <div className="stu-info">
                                    <span className="stu-name">{sub.studentName} {sub.grade !== null ? `(${sub.grade}/${assignment.points})` : ''}</span>
                                    <span className="stu-date">Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </aside>

                <section className="review-area">
                    {selectedSubmission ? (
                        <>
                            <div className="file-preview-card card">
                                <div className="file-header">
                                    <FileText size={24} className="file-icon" />
                                    <div className="file-info">
                                        <h4>{selectedSubmission.fileName || "No File Attached"}</h4>
                                        <span>Student: {selectedSubmission.studentName}</span>
                                    </div>
                                    {selectedSubmission.fileName && (
                                        <button className="btn-secondary" onClick={downloadFile}>Download File</button>
                                    )}
                                </div>
                                <div className="mock-file-content" style={{padding: '20px', textAlign: 'left'}}>
                                    {selectedSubmission.comments ? (
                                        <>
                                            <strong>Student Comments:</strong>
                                            <p style={{marginTop: '10px'}}>{selectedSubmission.comments}</p>
                                        </>
                                    ) : (
                                        <span style={{color: '#888'}}>No additional comments provided by the student.</span>
                                    )}
                                </div>
                            </div>

                            <div className="grading-form-card card">
                                <h3>Grade & Feedback</h3>
                                <form onSubmit={handleGrade}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Score (max {assignment.points})</label>
                                            <input
                                                type="number"
                                                placeholder="Enter score"
                                                max={assignment.points}
                                                required
                                                value={gradingData.score}
                                                onChange={(e) => setGradingData({ ...gradingData, score: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Feedback for Student</label>
                                        <textarea
                                            placeholder="Share your thoughts on the submission..."
                                            value={gradingData.feedback}
                                            onChange={(e) => setGradingData({ ...gradingData, feedback: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="btn-primary submit-grade">
                                        {isSaved ? <><Check size={18} /> Saved</> : <><Send size={18} /> Submit Grade</>}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="card" style={{padding: '2rem', textAlign: 'center'}}>
                            <ClipboardList size={48} style={{color: '#ccc', margin: '0 auto'}} />
                            <h3 style={{marginTop: '1rem'}}>No Submission Selected</h3>
                            <p style={{color: '#666'}}>Select a student from the list to begin grading.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default GradingPortal;
