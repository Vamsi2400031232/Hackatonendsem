import React from 'react';
import { GraduationCap, Briefcase, BookOpen, User, Lock, CheckCircle2, ShieldCheck, Mail, Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = React.useState(true);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [role, setRole] = React.useState('student');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                const result = await signup(name, email, password, role);
                if (result) {
                    alert("Account created successfully! Please sign in.");
                    setIsLogin(true);
                    setPassword('');
                }
            }
        } catch (error) {
            console.error("Auth error:", error);
            alert("Authentication failed. Please check your credentials.");
        }
    };

    return (
        <div className="login-container">
            {/* Background Animations */}
            <div className="bg-stars"></div>
            <div className="floating-icons">
                <GraduationCap className="icon float-1" size={40} />
                <BookOpen className="icon float-2" size={32} />
                <Pencil className="icon float-3" size={36} />
                <BookOpen className="icon float-4" size={28} />
                <Pencil className="icon float-5" size={34} />
            </div>

            <div className="login-card-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <BookOpen className="header-logo" size={40} />
                        <h2 className="header-text">Online Assignment & Grading System</h2>
                    </div>

                    <div className="auth-tab-group">
                        <button 
                            className={`auth-tab ${isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(true)}
                        >
                            Sign in
                        </button>
                        <button 
                            className={`auth-tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form className="login-form-content" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-input-group">
                                <label>Full Name</label>
                                <div className="glass-input-wrapper">
                                    <User className="input-icon" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="form-input-group">
                            <label>Email Address</label>
                            <div className="glass-input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    placeholder="dvamsikrishna5848@gmail.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-input-group">
                            <label>Password</label>
                            <div className="glass-input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    placeholder="•••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="teal-gradient-btn">
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </button>

                        <div className="forgot-password">
                            <a href="#">Forgot Password?</a>
                        </div>
                    </form>

                    {/* Role Selection Cards */}
                    <div className="role-card-grid">
                        <div 
                            className={`role-item-card ${role === 'teacher' ? 'active' : ''}`}
                            onClick={() => setRole('teacher')}
                        >
                            <Briefcase className="role-icon" size={24} />
                            <span>Teacher Login</span>
                        </div>
                        <div 
                            className={`role-item-card ${role === 'student' ? 'active' : ''}`}
                            onClick={() => setRole('student')}
                        >
                            <GraduationCap className="role-icon" size={24} />
                            <span>Student Login</span>
                        </div>
                        <div 
                            className={`role-item-card ${role === 'admin' ? 'active' : ''}`}
                            onClick={() => setRole('admin')}
                        >
                            <ShieldCheck className="role-icon" size={24} />
                            <span>Admin Login</span>
                        </div>
                    </div>

                    {/* Feature Highlights */}
                    <div className="feature-footer">
                        <div className="feature-row">
                            <div className="feature-item">
                                <CheckCircle2 className="check-icon" size={14} />
                                <span>Submit Assignments</span>
                            </div>
                            <div className="feature-item">
                                <CheckCircle2 className="check-icon" size={14} />
                                <span>View Grades</span>
                            </div>
                        </div>
                        <div className="feature-row">
                            <div className="feature-item">
                                <CheckCircle2 className="check-icon" size={14} />
                                <span>Teacher Feedback</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
