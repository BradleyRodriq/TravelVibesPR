import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import ExperienceDetails from '../components/experienceDetails';
import { AuthContext } from '../context/authContext';
import "../styles/Home.css";

// Memoize the match function
const matchVibes = (userVibes, experienceVibes) => {
    // Check if all userVibes are included in experienceVibes
    return userVibes.every(userVibe => experienceVibes.includes(userVibe));
};

const LOADING_MESSAGES = [
    "🎯 Searching for exact matches...",
    "✨ Finding perfect experiences...",
    "🔍 Matching your vibes...",
    "💫 Discovering your perfect trip..."
];

const ExactMatch = () => {
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
                    <p>Please wait while we search for your perfect matches...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <div className="home-header">
                <h1>Exact Matches</h1>
                <p>Experiences that match all your vibes</p>
            </div>

            {experiences.length === 0 ? (
                <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <h2>No Matches Found</h2>
                    <p>We couldn't find any experiences that match all your vibes.</p>
                    <p>Try adjusting your vibes or explore other experiences!</p>
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

export default ExactMatch;
