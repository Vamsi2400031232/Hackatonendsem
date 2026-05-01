import React, { useState, useEffect } from 'react';
import { Plus, Edit3, X, Calendar, FileText, Target } from 'lucide-react';
import './AssignmentCreator.css';

const AssignmentCreator = ({ onCancel, onSave, assignment }) => {
    const [formData, setFormData] = useState({
        title: '',
        course: '',
        dueDate: '',
        points: 100,
        description: ''
    });

    useEffect(() => {
        if (assignment) {
            setFormData({
                title: assignment.title || '',
                course: assignment.course || '',
                dueDate: assignment.dueDate || '',
                points: assignment.points || 100,
                description: assignment.description || ''
            });
        }
    }, [assignment]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, id: assignment?.id, status: assignment?.status || 'pending' });
    };

    return (
        <div className="creator-container card">
            <div className="creator-header">
                <h2>{assignment ? 'Edit Assignment' : 'Create New Assignment'}</h2>
                <button className="close-btn" onClick={onCancel}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="creator-form">
                <div className="form-row">
                    <div className="form-group flex-2">
                        <label>Assignment Title</label>
                        <div className="input-with-icon">
                            {assignment ? <Edit3 size={18} /> : <Plus size={18} />}
                            <input
                                type="text"
                                required
                                placeholder="e.g., Final Research Project"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group flex-1">
                        <label>Course</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., CS101"
                            value={formData.course}
                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Due Date</label>
                        <div className="input-with-icon">
                            <Calendar size={18} />
                            <input
                                type="datetime-local"
                                required
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Max Points</label>
                        <div className="input-with-icon">
                            <Target size={18} />
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Assignment Description / Instructions</label>
                    <textarea
                        required
                        placeholder="Outline the requirements and objectives..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn-primary">
                        {assignment ? 'Update Assignment' : 'Create Assignment'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssignmentCreator;
