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

    const showMapView = location.pathname === '/home';

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
          {showMapView && (
              <div className='navbar__map-view'>
                  <Link to='/ExperienceMap' className="navbar__map-link">Map View</Link>
              </div>
          )}
      </header>
  );
};

export default Navbar;
