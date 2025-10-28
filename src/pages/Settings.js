import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/Settings.css';

const Settings = () => {
    const { user } = useAuthContext();

    return (
        <div className="settings-page">
            <div className="settings-container">
                <div className="settings-header">
                    <h1>Settings</h1>
                    <p>Manage your account preferences</p>
                </div>

                <div className="settings-section">
                    <h2>Account Information</h2>
                    <div className="settings-item">
                        <div className="settings-label">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            <span>Email</span>
                        </div>
                        <div className="settings-value">{user?.email || 'N/A'}</div>
                    </div>

                    <div className="settings-item">
                        <div className="settings-label">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="8.5" cy="7" r="4"/>
                                <line x1="20" y1="8" x2="20" y2="14"/>
                                <line x1="23" y1="11" x2="17" y2="11"/>
                            </svg>
                            <span>Username</span>
                        </div>
                        <div className="settings-value">{user?.email?.split('@')[0] || 'N/A'}</div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>Quick Actions</h2>
                    <div className="settings-actions">
                        <Link to="/select-vibes" className="action-button primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                                <line x1="7" y1="7" x2="7.01" y2="7"/>
                            </svg>
                            My Vibes
                        </Link>
                        <Link to="/add-experience" className="action-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Add Experience
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

