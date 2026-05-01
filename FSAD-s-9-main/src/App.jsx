import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import AssignmentList from './components/AssignmentList';
import AssignmentDetail from './components/AssignmentDetail';
import AssignmentCreator from './components/AssignmentCreator';
import GradingPortal from './components/GradingPortal';
import Profile from './pages/Profile';

import './App.css';

const AppContent = () => {
    const { user, loading } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [isLandingView, setIsLandingView] = useState(true);
    
    useEffect(() => {
        fetch('http://localhost:8080/api/assignments')
            .then(res => res.json())
            .then(data => setAssignments(data))
            .catch(err => console.error("Error fetching assignments:", err));
    }, []);
    const [view, setView] = useState('dashboard'); // dashboard, detail, create, grade
    const [selectedAssignment, setSelectedAssignment] = useState(null);

    if (loading) {
        return <div className="loading-screen">Loading EduLink...</div>;
    }

    if (!user) {
        if (isLandingView) {
            return <LandingPage onEnter={() => setIsLandingView(false)} />;
        }
        return <Login />;
    }

    const handleSelectAssignment = (assignment) => {
        setSelectedAssignment(assignment);
        setView(user.role === 'teacher' ? 'grade' : 'detail');
    };

    const handleSaveAssignment = async (assignmentData) => {
        const isEdit = !!assignmentData.id;
        const url = isEdit 
            ? `http://localhost:8080/api/assignments/${assignmentData.id}` 
            : 'http://localhost:8080/api/assignments';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assignmentData)
            });
            if (response.ok) {
                const savedAssignment = await response.json();
                if (isEdit) {
                    setAssignments(assignments.map(a => a.id === savedAssignment.id ? savedAssignment : a));
                } else {
                    setAssignments([savedAssignment, ...assignments]);
                }
                setView('dashboard');
            } else {
                alert(`Failed to ${isEdit ? 'update' : 'create'} assignment on server`);
            }
        } catch (error) {
            console.error(`Error ${isEdit ? 'updating' : 'creating'} assignment:`, error);
            alert("Error connecting to server");
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/assignments/${assignmentId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setAssignments(assignments.filter(a => a.id !== assignmentId));
            } else {
                alert("Failed to delete assignment on server");
            }
        } catch (error) {
            console.error("Error deleting assignment:", error);
            alert("Error connecting to server");
        }
    };

    return (
        <div className="layout">
            <Navbar />
            <div className="main-content container">
                <Sidebar onNavigate={(v) => setView(v)} currentView={view} />
                <main className="content-area">
                    {view === 'profile' ? (
                        <Profile />
                    ) : user.role === 'student' ? (
                        <StudentPortal
                            view={view}
                            setView={setView}
                            assignments={assignments}
                            selectedAssignment={selectedAssignment}
                            onSelect={handleSelectAssignment}
                        />
                    ) : (
                        <TeacherPortal
                            view={view}
                            setView={setView}
                            assignments={assignments}
                            selectedAssignment={selectedAssignment}
                            onSelect={handleSelectAssignment}
                            onEdit={(a) => { setSelectedAssignment(a); setView('edit'); }}
                            onSave={handleSaveAssignment}
                            onDelete={handleDeleteAssignment}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

const StudentPortal = ({ view, setView, assignments, selectedAssignment, onSelect }) => {
    const { user } = useAuth();
    const [mySubmissions, setMySubmissions] = useState([]);
    
    useEffect(() => {
        if (user) {
            fetch(`http://localhost:8080/api/submissions/student/${user.id}`)
                .then(res => {
                    if (!res.ok) throw new Error("API error");
                    return res.json();
                })
                .then(data => {
                    if (Array.isArray(data)) {
                        setMySubmissions(data);
                    } else {
                        setMySubmissions([]);
                    }
                })
                .catch(err => {
                    console.error("Fetch submissions error:", err);
                    setMySubmissions([]);
                });
        }
    }, [user, view]); // Refresh submissions when returning to dashboard

    const enrichedAssignments = Array.isArray(assignments) ? assignments.map(a => {
        const sub = mySubmissions.find(s => s.assignmentId === a.id);
        if (sub) {
            if (sub.grade !== null && sub.grade !== undefined) {
                return { ...a, status: 'graded', grade: sub.grade, feedback: sub.feedback };
            }
            return { ...a, status: 'submitted' };
        }
        return a; // default from DB (pending)
    }) : [];

    if (view === 'detail') {
        return <AssignmentDetail assignment={selectedAssignment} onBack={() => setView('dashboard')} />;
    }

    return (
        <div className="dashboard-view">
            <header className="page-header">
                <h1>{view === 'grades' ? 'Grades & Feedback' : 'Student Dashboard'}</h1>
                <p>{view === 'grades' ? 'Review your scores and teacher comments.' : 'Manage your assignments and track your performance.'}</p>
            </header>
            <AssignmentList
                assignments={enrichedAssignments}
                onSelect={onSelect}
                initialFilter={view === 'grades' ? 'graded' : 'all'}
            />
        </div>
    );
};

const TeacherPortal = ({ view, setView, assignments, selectedAssignment, onSelect, onSave, onDelete, onEdit }) => {
    if (view === 'create' || view === 'edit') {
        return <AssignmentCreator 
            onCancel={() => setView('dashboard')} 
            onSave={onSave} 
            assignment={view === 'edit' ? selectedAssignment : null} 
        />;
    }

    if (view === 'grade') {
        return <GradingPortal assignment={selectedAssignment} onBack={() => setView('dashboard')} />;
    }

    return (
        <div className="dashboard-view">
            <header className="page-header">
                <div className="header-with-action">
                    <div>
                        <h1>Teacher Dashboard</h1>
                        <p>Monitor submissions and publish new assignments.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setView('create')}>+ Create Assignment</button>
                </div>
            </header>
            <AssignmentList
                assignments={assignments}
                onSelect={onSelect}
                onDelete={onDelete}
                onEdit={onEdit}
            />
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
