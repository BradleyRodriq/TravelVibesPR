import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = () => {
        logout();
        navigate('/login');
    };

    const showMapView = location.pathname === '/';

    return (
        <header>
            <div>
                <Link to='/'>
                    <h1>TravelVibesPR</h1>
                </Link>
                <nav>
                    {user && (
                        <div>
                            <span>{user.email}</span>
                            <button onClick={handleClick}>Log out</button>
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
            {showMapView && (
                <div>
                    <Link to='/ExperienceMap'>Map View</Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;
