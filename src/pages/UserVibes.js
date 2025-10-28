import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/authContext'; // Update the path to your AuthContext
import { Link } from 'react-router-dom';
import '../styles/UserVibes.css';

const UserVibes = () => {
    const [userVibes, setUserVibes] = useState([]);
    const [availableVibes, setAvailableVibes] = useState({});
    const [selectedVibesToAdd, setSelectedVibesToAdd] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext); // Access user from the AuthContext

    const fetchUserVibes = useCallback(async () => {
        if (!user) return; // Return early if user is null

        try {
            console.log('Fetching user vibes');
            const response = await fetch(`/api/user/vibes`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user vibes');
            }

            const data = await response.json();
            setUserVibes(data.vibes); // Assuming the response contains a 'vibes' array

            const vibeIds = data.vibes.map(vibe => vibe._id);
            localStorage.setItem('userVibes', JSON.stringify(vibeIds));
        } catch (error) {
            console.error('Error fetching user vibes:', error);
            setUserVibes([]); // Set userVibes to empty array on error
        }
    }, [user]);

    const fetchAvailableVibes = useCallback(async () => {
        try {
            console.log('Fetching available vibes');
            const response = await fetch('/api/vibes');
            if (!response.ok) {
                throw new Error('Failed to fetch available vibes');
            }
            const data = await response.json();
            // Convert the array of vibes into a dictionary for quick lookup
            const vibesDict = data.reduce((acc, vibe) => {
                acc[vibe._id] = vibe.name;
                return acc;
            }, {});
            setAvailableVibes(vibesDict);
        } catch (error) {
            console.error('Error fetching available vibes:', error);
            setAvailableVibes({}); // Set availableVibes to empty dictionary on error
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (user) {
                await Promise.all([fetchUserVibes(), fetchAvailableVibes()]);
            }
            setLoading(false);
        };
        fetchData();
    }, [user, fetchUserVibes, fetchAvailableVibes]);

    const handleVibeSelection = (vibeId) => {
        const storedVibes = JSON.parse(localStorage.getItem('userVibes')) || [];
        if (storedVibes.includes(vibeId) || selectedVibesToAdd.includes(vibeId)) {
            return;
        }
        setSelectedVibesToAdd([...selectedVibesToAdd, vibeId]);
    };

    const handleDeleteVibe = async (vibeId) => {
        const token = user.token;

        try {
            const response = await fetch(`/api/user/deleteVibe/${vibeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed response from server.');
            }

            console.log('Vibe deleted successfully!');
            fetchUserVibes(); // Refresh user vibes

            const updatedVibes = userVibes.filter(vibe => vibe._id !== vibeId);
            const vibeIds = updatedVibes.map(vibe => vibe._id);
            localStorage.setItem('userVibes', JSON.stringify(vibeIds));
        } catch (error) {
            console.error('Error deleting vibe:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = user.token;

        console.log('Selected Vibes:', selectedVibesToAdd);

        try {
            const response = await fetch('/api/user/addVibes', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ vibes: selectedVibesToAdd })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed response from server.');
            }

            const updatedUser = await response.json();
            console.log('Updated User:', updatedUser);

            setUserVibes(updatedUser.vibes); // Update userVibes with the server response

            console.log('Vibes added successfully!');
            setSelectedVibesToAdd([]);

            fetchUserVibes(); // Refresh user vibes

            const vibeIds = updatedUser.vibes.map(vibe => vibe._id);
            localStorage.setItem('userVibes', JSON.stringify(vibeIds));
        } catch (error) {
            console.error('Error adding vibes:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-vibes-page">
            <div className="user-vibes-container">
                <div className="vibes-header">
                    <h1>Select Your Vibes</h1>
                    <p>Personalize your experience recommendations</p>
                </div>

                <div className="current-vibes-section">
                    <h3>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                            <line x1="7" y1="7" x2="7.01" y2="7"/>
                        </svg>
                        Your Vibes ({userVibes.length})
                    </h3>
                    {userVibes.length === 0 ? (
                        <div className="empty-vibes">
                            <p>No vibes selected yet</p>
                        </div>
                    ) : (
                        <div className="vibes-grid">
                            {userVibes.map(vibe => (
                                <div key={vibe._id} className="vibe-card current">
                                    <span>{availableVibes[vibe._id] || 'Unknown Vibe'}</span>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDeleteVibe(vibe._id)}
                                        aria-label="Delete vibe"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18"/>
                                            <line x1="6" y1="6" x2="18" y2="18"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="available-vibes-section">
                    <h3>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        Available Vibes
                    </h3>
                    <div className="vibes-grid">
                        {Object.entries(availableVibes).map(([vibeId, vibeName]) => (
                            <button
                                key={vibeId}
                                className={`vibe-card available ${selectedVibesToAdd.includes(vibeId) ? 'selected' : ''}`}
                                onClick={() => handleVibeSelection(vibeId)}
                                disabled={userVibes.some(v => v._id === vibeId)}
                            >
                                {selectedVibesToAdd.includes(vibeId) && (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="check-icon">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                )}
                                <span>{vibeName}</span>
                            </button>
                        ))}
                    </div>
                    <button 
                        type="submit" 
                        onClick={handleSubmit}
                        className="add-btn"
                        disabled={selectedVibesToAdd.length === 0}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Add Selected Vibes
                    </button>
                </div>

                <Link to="/home" className="continue-link">
                    Continue to Experiences
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default UserVibes;

