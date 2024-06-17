import React, { useState, useEffect, useContext } from 'react';
import ExperienceDetails from '../components/experienceDetails';
import { AuthContext } from '../context/authContext';

const matchVibes = (userVibes, experienceVibes) => {
    return experienceVibes.some(experienceVibe => userVibes.includes(experienceVibe));
};

const Home = () => {
    const [reload, setReload] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [experiencesPerPage] = useState(6); // Number of experiences per page
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
            if (userVibes) {
                url += `?vibes=${userVibes.join(',')}`;
            } else {
                console.log('No valid user vibes found or user vibes array is empty.');
            }

            const headers = {};

            const experiencesResponse = await fetch(url, { headers });

            if (!experiencesResponse.ok) {
                throw new Error('Failed to fetch experiences');
            }

            const data = await experiencesResponse.json();

            // Filter experiences based on user vibes
            const filteredExperiences = data.filter(experience =>
                matchVibes(userVibes, experience.vibes)
            );

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
    }, [user, loading]);

    useEffect(() => {
        if (!loading) {
            fetchExperiences();
        }
    }, [reload, loading]);

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
        <div>
            <div className="experiences">
                {currentExperiences && currentExperiences.map((experience) => (
                    <ExperienceDetails
                        experience={experience}
                        vibes={experience.vibes}
                        key={experience._id}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
            <div className="pagination">
                {Array.from({ length: Math.ceil(experiences.length / experiencesPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

        </div>
    );
};

export default Home;
