import React from 'react';
import { BookOpen, LogOut, User, LayoutDashboard, FilePlus, CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                <div className="navbar-brand">
                    <BookOpen className="brand-icon" size={24} />
                    <span></span>
                </div>

                <div className="navbar-links">
                    {user ? (
                        <>
                            <div className="user-info">
                                <User size={18} />
                                <span>{user.name}</span>
                                <span className="user-role">({user.role})</span>
                            </div>
                            <button onClick={logout} className="logout-btn">
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <span className="guest-msg">Welcome to Online Assignment System</span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
