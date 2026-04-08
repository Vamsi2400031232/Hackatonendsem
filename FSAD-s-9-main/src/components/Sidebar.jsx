import React from 'react';
import { LayoutDashboard, FilePlus, BookOpen, Clock, CheckCircle, ChevronRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ onNavigate, currentView }) => {
    const { user } = useAuth();

    if (!user) return null;

    const teacherLinks = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'create', name: 'Create Assignment', icon: FilePlus },
        { id: 'profile', name: 'Profile Details', icon: User },
    ];

    const studentLinks = [
        { id: 'dashboard', name: 'Assignments', icon: BookOpen },
        { id: 'grades', name: 'Grades & Feedback', icon: CheckCircle },
        { id: 'profile', name: 'Profile Details', icon: User },
    ];

    const links = user.role === 'teacher' ? teacherLinks : studentLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-group">
                <h3 className="sidebar-title">Menu</h3>
                <nav className="sidebar-nav">
                    {links.map((link) => (
                        <button
                            key={link.id}
                            className={`sidebar-link ${currentView === link.id ? 'active' : ''}`}
                            onClick={() => onNavigate(link.id)}
                        >
                            <link.icon size={20} />
                            <span>{link.name}</span>
                            <ChevronRight size={16} className={`chevron ${currentView === link.id ? 'visible' : ''}`} />
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
