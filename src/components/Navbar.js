import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        logout();
        navigate('/login');
    };

    const showMapView = location.pathname === '/home' || location.pathname === '/exact-match' || location.pathname === '/Home' || location.pathname === '/select-vibes';
    const showExactMatch = location.pathname === '/home' || location.pathname === '/ExperienceMap' || location.pathname === '/Home' || location.pathname === '/select-vibes' || location.pathname.startsWith ('/experience') || location.pathname === '/random';
    const showHome = location.pathname === '/exact-match' || location.pathname === '/ExperienceMap' || location.pathname === '/Home' || location.pathname.startsWith ('/experience') || location.pathname === '/random';
    const showRandom = location.pathname === '/exact-match' || location.pathname === '/ExperienceMap' || location.pathname === '/home' || location.pathname.startsWith ('/experience') || location.pathname === '/Home' || location.pathname === '/random' || location.pathname === '/select-vibes';

    return (
      <header className="navbar">
          <div className="navbar__container">
              <Link to='/home' className="navbar__logo">
                  <h1>TravelVibesPR</h1>
              </Link>
              <nav className="navbar__nav">
                  {user && (
                      <div className="navbar__user">
                          <span className="navbar__user-email">{user.email}</span>
                          <button className="navbar__logout-btn" onClick={handleClick}>Log out</button>
                          <Link to='/select-vibes' className="navbar__link">Select Vibes</Link>
                          <Link to='/add-experience' className="navbar__link">Add Experience</Link>
                      </div>
                  )}
                  {!user && (
                      <div className="navbar__guest">
                          <Link to='/login' className="navbar__link">Log In</Link>
                          <Link to='/signup' className="navbar__link">Sign Up</Link>
                      </div>
                  )}
              </nav>
          </div>
          <div className="link_container">
          {showMapView && (
              <div className='navbar__map-view'>
                  <Link to='/ExperienceMap' className="navbar__map-link">Map Experience!</Link>
              </div>
          )}
          {showExactMatch && (
            <div className='navbar__exact-match'>
                <Link to='/exact-match' className="navbar__exact-match-link">Exact Matching!</Link>
            </div>
          )}
          {showHome && (
            <div className='navbar__home'>
                <Link to='/home' className="navbar__home-link">All Matches!</Link>
            </div>
          )}
          {showRandom && (
          <div className='navbar__random'>
                <Link to='/random' className="navbar__random-link">I'm Feeling Lucky!</Link>
            </div>
            )}
          </div>
      </header>
  );
};

export default Navbar;
