import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ExperienceDetails from '../components/experienceDetails';
import { AuthContext } from '../context/authContext';
import "../styles/Home.css";

// Memoize the match function
const matchVibes = (userVibes, experienceVibes) => {
    return experienceVibes.some(experienceVibe => userVibes.includes(experienceVibe));
};

const LOADING_MESSAGES = [
    "🌴 Exploring Puerto Rico...",
    "🗺️ Finding amazing experiences...",
    "✨ Discovering your next adventure...",
    "🏖️ Loading experiences..."
];

const Home = () => {
    const [reload, setReload] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [experiencesPerPage] = useState(10); // Number of experiences per page
    const [loadingMessage, setLoadingMessage] = useState(0);
    const { user, loading } = useContext(AuthContext);

    // Memoize fetchExperiences to avoid unnecessary re-creations
    const fetchExperiences = useCallback(async () => {
        setFetching(true);
        try {
            let url = '/api/experiences';
            let userVibes = [];

            // Get user vibes from local storage
            const storedUserVibes = localStorage.getItem('userVibes');
            if (storedUserVibes) {
                userVibes = JSON.parse(storedUserVibes);
            }

            // Prepare URL with user vibe IDs as query parameters
            if (userVibes.length > 0) {
                url += `?vibes=${userVibes.join(',')}`;
            }

            const experiencesResponse = await fetch(url);

            if (!experiencesResponse.ok) {
                throw new Error('Failed to fetch experiences');
            }

            const data = await experiencesResponse.json();

            // Filter experiences based on user vibes if user vibes are present
            const filteredExperiences = userVibes.length > 0 ? data.filter(experience =>
                matchVibes(userVibes, experience.vibes)
            ) : data;

            setExperiences(filteredExperiences);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            setExperiences([]);
        } finally {
            setFetching(false);
        }
    }, []); // Empty dependency array since we use localStorage which doesn't change

    const handleDelete = useCallback(() => {
        setReload(prevState => !prevState);
    }, []);

    // Combine both effects into one
    useEffect(() => {
        if (!loading) {
            fetchExperiences();
        }
    }, [loading, reload, fetchExperiences]);

    // Animate loading messages
    useEffect(() => {
        if (fetching) {
            const interval = setInterval(() => {
                setLoadingMessage(prev => (prev + 1) % LOADING_MESSAGES.length);
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [fetching]);

    // Memoize pagination calculations
    const currentExperiences = useMemo(() => {
        const indexOfLastExperience = currentPage * experiencesPerPage;
        const indexOfFirstExperience = indexOfLastExperience - experiencesPerPage;
        return experiences.slice(indexOfFirstExperience, indexOfLastExperience);
    }, [experiences, currentPage, experiencesPerPage]);

    // Memoize total pages calculation
    const totalPages = useMemo(() => {
        return Math.ceil(experiences.length / experiencesPerPage);
    }, [experiences.length, experiencesPerPage]);

    // Memoize pagination button array
    const paginationButtons = useMemo(() => {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }, [totalPages]);

    // Memoize change page function
    const paginate = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    if (loading || fetching) {
        return (
            <div className="home-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h2>{LOADING_MESSAGES[loadingMessage]}</h2>
                    <p>Please wait while we fetch your experiences...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <div className="home-header">
                <h1>Discover Your Journey</h1>
                <p>Find amazing experiences across Puerto Rico</p>
            </div>

            <div className="filter-navigation">
                {!user && (
                    <div className="nav-links">
                        <Link to='/ExperienceMap' className="nav-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            Map View
                        </Link>
                        <Link to='/random' className="nav-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                <line x1="9" y1="9" x2="9.01" y2="9"/>
                                <line x1="15" y1="9" x2="15.01" y2="9"/>
                            </svg>
                            Feeling Lucky
                        </Link>
                    </div>
                )}
                {user && (
                    <div className="nav-links">
                        <Link to='/ExperienceMap' className="nav-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            Map View
                        </Link>
                        <Link to='/exact-match' className="nav-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            Exact Match
                        </Link>
                        <Link to='/random' className="nav-link">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                                <line x1="9" y1="9" x2="9.01" y2="9"/>
                                <line x1="15" y1="9" x2="15.01" y2="9"/>
                            </svg>
                            Feeling Lucky
                        </Link>
                    </div>
                )}
            </div>

            {experiences.length === 0 ? (
                <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <h2>No Experiences Found</h2>
                    <p>We couldn't find any experiences matching your preferences.</p>
                    <p>Try selecting different vibes or add your own experience!</p>
                </div>
            ) : (
                <>
                    {totalPages > 1 && (
                        <div className="pagination">
                            {paginationButtons.map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => paginate(pageNum)}
                                    className={currentPage === pageNum ? "pagination__button active" : "pagination__button"}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="experience-grid">
                        {currentExperiences.map((experience) => (
                            <ExperienceDetails
                                experience={experience}
                                vibes={experience.vibes}
                                key={experience._id}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            {paginationButtons.map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => paginate(pageNum)}
                                    className={currentPage === pageNum ? "pagination__button active" : "pagination__button"}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
export default Home;

