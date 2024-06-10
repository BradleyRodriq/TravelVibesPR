import React, { useState, useEffect, useContext } from 'react';
import ExperienceDetails from '../components/experienceDetails';
import { AuthContext } from '../context/authContext';

const matchVibes = (userVibes, experienceVibes) => {
    return experienceVibes.some(experienceVibe => userVibes.includes(experienceVibe));
};

const Home = () => {
    const [reload, setReload] = useState(false);
    const [experiences, setExperiences] = useState([]);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="experiences">
                {experiences && experiences.map((experience) => (
                    <ExperienceDetails
                        experience={experience}
                        vibes={experience.vibes}
                        key={experience._id}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
