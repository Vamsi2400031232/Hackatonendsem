import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onEnter }) => {
    return (
        <div className="landing-container">
            <div className="background-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
            <div className="landing-content">
                <h1 className="landing-title">
                    Online Assignment Submission & Grading System
                </h1>
                <p className="landing-subtitle">
                    Empowering students and teachers with a seamless grading experience.
                </p>
                <div className="enter-box" onClick={onEnter}>
                    <span className="enter-text">Enter</span>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
