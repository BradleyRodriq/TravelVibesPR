import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const location = useLocation();

    const handleClick = () => {
        logout();
    };

    const showMapView = location.pathname === '/' || location.pathname === '/experience/:id"';

    return (
        <header>
          <div className="container">
            <Link to='/'>
              <h1>TravelVibesPR</h1>
            </Link>
            <nav>
              {user && (
                <div>
                  <span>{user.email}</span>
                  <button onClick={handleClick}>
                    Log out
                  </button>
                  <Link to='/select-vibes'>Select Vibes</Link>
                  <Link to='/add-experience'>Add Experience</Link>
                </div>
              )}
              {!user && (
                <div>
                  <Link to='/login'>Log In</Link>
                  <Link to='/signup'>Sign Up</Link>
                </div>
              )}
            </nav>
          </div>
          { showMapView && (
          <div className="map-view-container">
            <Link className="map-view" to='/ExperienceMap'>Map View</Link>
          </div>
          )}
        </header>
      );
    };

export default Navbar;
