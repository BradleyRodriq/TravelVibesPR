import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleClick = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="navbar">
            <div className="navbar__container">
                <Link to='/home' className="navbar__logo">
                    <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2"/>
                        <circle cx="12" cy="10" r="3" strokeWidth="2"/>
                    </svg>
                    <span>TravelVibesPR</span>
                </Link>

                {user && (
                    <nav className="navbar__nav">
                        <Link 
                            to='/settings' 
                            className={`navbar__link ${isActive('/settings') ? 'active' : ''}`}
                            title="Settings"
                        >
                            <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"/>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                            </svg>
                        </Link>
                        <button 
                            className="navbar__logout-btn" 
                            onClick={handleClick}
                            title="Log out"
                        >
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2"/>
                                <polyline points="16 17 21 12 16 7" strokeWidth="2"/>
                                <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2"/>
                            </svg>
                            <span>Logout</span>
                        </button>
                    </nav>
                )}

                {!user && (
                    <nav className="navbar__nav">
                        <Link 
                            to='/login' 
                            className={`navbar__link ${isActive('/login') ? 'active' : ''}`}
                        >
                            Log In
                        </Link>
                        <Link 
                            to='/signup' 
                            className="navbar__link navbar__link--primary"
                        >
                            Sign Up
                        </Link>
                    </nav>
                )}

                {/* Mobile Menu Toggle */}
                <button 
                    className="navbar__menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="navbar__mobile-menu">
                    {user ? (
                        <>
                            <Link 
                                to='/settings' 
                                className={`navbar__mobile-link ${isActive('/settings') ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Settings
                            </Link>
                            <button 
                                className="navbar__mobile-logout" 
                                onClick={() => {
                                    handleClick();
                                    setIsMenuOpen(false);
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to='/login' 
                                className={`navbar__mobile-link ${isActive('/login') ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Log In
                            </Link>
                            <Link 
                                to='/signup' 
                                className="navbar__mobile-link navbar__mobile-link--primary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;
