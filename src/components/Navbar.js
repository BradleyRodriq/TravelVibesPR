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
                      </div>
                  )}
                  {!user && (
                      <div className="navbar__guest">
                          <Link to='/login' className="navbar_link">Log In</Link>
                          <Link to='/signup' className="navbar_link">Sign Up</Link>
                      </div>
                  )}
              </nav>
          </div>
      </header>
  );
};

export default Navbar;

