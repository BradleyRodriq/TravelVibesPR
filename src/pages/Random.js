import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Random = () => {
    const navigate = useNavigate(); // for navigation
    const [randomExperienceId, setRandomExperienceId] = useState(null);

    useEffect(() => {
        const fetchRandomExperiences = async () => {
            try {
                const userVibes = JSON.parse(localStorage.getItem('userVibes')) || [];

                const response = await fetch("/api/experiences");
                const data = await response.json(); // array of experiences

                let experiences;
                if (userVibes.length === 0) {
                    experiences = data.map((exp) => exp._id);
                } else {
                    experiences = data
                        .filter(exp => exp.vibes.some(vibe => userVibes.includes(vibe)))
                        .map(exp => exp._id);
                }

                // Choose a random experience ID
                const randomIndex = Math.floor(Math.random() * experiences.length);
                const randomId = experiences[randomIndex];
                setRandomExperienceId(randomId); // Store the random ID in state
            }
            catch (error) {
                console.error("Error fetching experiences:", error);
            }
        };

        fetchRandomExperiences();
    }, []); // Empty dependency array to fetch once on component mount

    // Use navigate when randomExperienceId changes
    useEffect(() => {
        if (randomExperienceId) {
            navigate(`/experience/${randomExperienceId}`);
        }
    }, [randomExperienceId, navigate]); // Navigate when randomExperienceId or navigate changes

    // No need to render anything since navigation happens automatically
    return null;
};

export default Random;
