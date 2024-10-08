import React, { useState, useEffect, useContext } from 'react';
import ExperienceDetails from '../components/experienceDetails';
import { AuthContext } from '../context/authContext';
import "../styles/Home.css";

const matchVibes = (userVibes, experienceVibes) => {
    // Check if all userVibes are included in experienceVibes
    return userVibes.every(userVibe => experienceVibes.includes(userVibe));
};

const ExactMatch = () => {
    const [reload, setReload] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [experiencesPerPage] = useState(10); // Number of experiences per page
    const { user, loading } = useContext(AuthContext);

    const fetchExperiences = async () => {
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

            const headers = {};

            const experiencesResponse = await fetch(url, { headers });

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
        }
    };

    const handleDelete = async () => {
        setReload(prevState => !prevState);
    };

    useEffect(() => {
        if (!loading) {
            fetchExperiences();
        }
    }, [user, loading, reload]);

    // Get current experiences for the current page
    const indexOfLastExperience = currentPage * experiencesPerPage;
    const indexOfFirstExperience = indexOfLastExperience - experiencesPerPage;
    const currentExperiences = experiences.slice(indexOfFirstExperience, indexOfLastExperience);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="experience-list">
            {/* Pagination buttons */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(experiences.length / experiencesPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? "pagination__button active" : "pagination__button"}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            {/* List of experience details */}
            <div className="experience-details-list">
                {currentExperiences && currentExperiences.map((experience) => (
                    <ExperienceDetails
                        experience={experience}
                        vibes={experience.vibes}
                        key={experience._id}
                        onDelete={handleDelete}
                        className="experience-details"
                    />
                ))}
            </div>
            {/* Pagination buttons (repeated for bottom navigation) */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(experiences.length / experiencesPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? "pagination__button active" : "pagination__button"}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExactMatch;
