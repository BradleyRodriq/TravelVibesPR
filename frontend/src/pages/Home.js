import React, { useState, useEffect, useContext } from 'react';
import ExperienceDetails from '../components/experienceDetails'; // Update the path to your ExperienceDetails component
import { AuthContext } from '../context/authContext'; // Update the path to your AuthContext

const Home = () => {
    const [experiences, setExperiences] = useState([]);
    const { user } = useContext(AuthContext); // Access user from the AuthContext

    const fetchExperiences = async () => {
        try {
            let url = '/api/experiences';
            const headers = {};

            if (user) {
                headers['Authorization'] = `Bearer ${user.token}`;
            }

            const response = await fetch(url, { headers });

            if (!response.ok) {
                throw new Error('Failed to fetch experiences');
            }

            const data = await response.json();
            setExperiences(data); // Assuming the response is an array of experiences
        } catch (error) {
            console.error('Error fetching experiences:', error);
            setExperiences([]); // Set experiences to an empty array on error
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, [user]); // Fetch experiences whenever the user changes

    return (
        <div className="home">
            <div className="experiences">
                {experiences && experiences.map((experience) => (
                    <ExperienceDetails experience={experience} key={experience._id} />
                ))}
            </div>
        </div>
    );
};

export default Home;
