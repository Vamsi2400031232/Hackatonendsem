import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, MapPin, Phone, GraduationCap, Briefcase, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [activeSetting, setActiveSetting] = useState(null);

    if (!user) return null;

    const handleSave = (e) => {
        e.preventDefault();
        alert(`${activeSetting} updated successfully!`);
        setActiveSetting(null);
    };

    const renderSettingModal = () => {
        if (!activeSetting) return null;

        return (
            <div className="setting-modal-overlay">
                <div className="setting-modal-card">
                    <div className="setting-modal-header">
                        <h3>{activeSetting}</h3>
                        <button className="icon-btn close-btn" onClick={() => setActiveSetting(null)}>
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSave} className="setting-form">
                        {activeSetting === 'Change Password' && (
                            <>
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input type="password" required className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input type="password" required className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input type="password" required className="form-control" />
                                </div>
                            </>
                        )}
                        {activeSetting === 'Notification Preferences' && (
                            <>
                                <div className="checkbox-group">
                                    <input type="checkbox" id="emailNotif" defaultChecked />
                                    <label htmlFor="emailNotif">Email Notifications</label>
                                </div>
                                <div className="checkbox-group">
                                    <input type="checkbox" id="pushNotif" defaultChecked />
                                    <label htmlFor="pushNotif">Push Notifications</label>
                                </div>
                                <div className="checkbox-group">
                                    <input type="checkbox" id="smsNotif" />
                                    <label htmlFor="smsNotif">SMS Notifications</label>
                                </div>
                            </>
                        )}
                        {activeSetting === 'Privacy Settings' && (
                            <>
                                <div className="form-group">
                                    <label>Profile Visibility</label>
                                    <select defaultValue="public" className="form-control">
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="contacts">Contacts Only</option>
                                    </select>
                                </div>
                                <div className="checkbox-group mt-4">
                                    <input type="checkbox" id="showEmail" />
                                    <label htmlFor="showEmail">Show email on profile</label>
                                </div>
                            </>
                        )}
                        {activeSetting === 'Deactivate Account' && (
                            <div className="danger-zone">
                                <p>Are you sure you want to deactivate your account? This action cannot be undone immediately. All your data will be suspended.</p>
                            </div>
                        )}
                        
                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => setActiveSetting(null)}>
                                Cancel
                            </button>
                            <button type="submit" className={`btn-primary ${activeSetting === 'Deactivate Account' ? 'btn-danger' : ''}`}>
                                {activeSetting === 'Deactivate Account' ? 'Deactivate' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="profile-container">
            <header className="page-header">
                <h1>Profile Details</h1>
                <p>Manage your account settings and personal information.</p>
            </header>

            <div className="profile-grid">
                <div className="profile-card card">
                    <div className="profile-hero">
                        <div className="profile-avatar">
                            <User size={64} />
                        </div>
                        <div className="profile-main-info">
                            <h2>{user.name}</h2>
                            <span className="profile-role-badge">
                                {user.role === 'teacher' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        </div>
                    </div>

                    <div className="profile-details-list">
                        <div className="detail-item">
                            <Mail size={18} className="detail-icon" />
                            <div className="detail-content">
                                <label>Email Address</label>
                                <p>{user.email}</p>
                            </div>
                        </div>

                        <div className="detail-item">
                            <Shield size={18} className="detail-icon" />
                            <div className="detail-content">
                                <label>User ID</label>
                                <p>{user.id}</p>
                            </div>
                        </div>

                        <div className="detail-item">
                            <Calendar size={18} className="detail-icon" />
                            <div className="detail-content">
                                <label>Joined Date</label>
                                <p>February 2026</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-actions-column">
                    <div className="card settings-card">
                        <h3>Account Settings</h3>
                        <div className="settings-list">
                            <button className="settings-btn" onClick={() => setActiveSetting('Change Password')}>Change Password</button>
                            <button className="settings-btn" onClick={() => setActiveSetting('Notification Preferences')}>Notification Preferences</button>
                            <button className="settings-btn" onClick={() => setActiveSetting('Privacy Settings')}>Privacy Settings</button>
                            <button className="settings-btn danger" onClick={() => setActiveSetting('Deactivate Account')}>Deactivate Account</button>
                        </div>
                    </div>
                </div>
            </div>
            {renderSettingModal()}
        </div>
    );
};

export default Profile;
