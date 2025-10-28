import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Random.css';

const LOADING_TEXTS = [
    "🎲 Rolling the dice...",
    "✨ Finding you something amazing...",
    "🎯 Searching for the perfect match...",
    "🚀 Discovering adventures...",
    "🎉 Your next experience awaits...",
    "🌈 Mixing the perfect vibes...",
    "🎪 Picking something fun...",
    "🌺 Exploring Puerto Rico..."
];

const Random = () => {
    const navigate = useNavigate();
    const [currentText, setCurrentText] = useState(0);
    const [dots, setDots] = useState('');
    const startTimeRef = useRef(Date.now());

    // Memoize fetch function
    const fetchRandomExperience = useCallback(async () => {
        try {
            // First fetch the random experience ID
            const randomResponse = await fetch("/api/random");
            
            if (!randomResponse.ok) {
                throw new Error('Failed to fetch random experience');
            }
            
            const randomExperience = await randomResponse.json();
            
            // Now fetch the full experience data
            const experienceResponse = await fetch(`/api/experiences/${randomExperience._id}`);
            
            if (!experienceResponse.ok) {
                throw new Error('Failed to fetch experience details');
            }
            
            const fullExperience = await experienceResponse.json();
            
            // Ensure minimum 2 seconds display time
            const elapsedTime = Date.now() - startTimeRef.current;
            const remainingTime = Math.max(0, 2000 - elapsedTime);
            
            // Wait for remaining time if needed, then navigate
            setTimeout(() => {
                navigate(`/experience/${randomExperience._id}`, { 
                    state: { preloadedExperience: fullExperience } 
                });
            }, remainingTime);
        }
        catch (error) {
            console.error("Error fetching random experience:", error);
            navigate('/home');
        }
    }, [navigate]);

    useEffect(() => {
        startTimeRef.current = Date.now();
        fetchRandomExperience();
    }, [fetchRandomExperience]);

    // Memoize text animation logic
    const animatingText = useMemo(() => {
        return LOADING_TEXTS[currentText];
    }, [currentText]);

    // Combine text and dots in one effect
    useEffect(() => {
        const textInterval = setInterval(() => {
            setCurrentText(prev => (prev + 1) % LOADING_TEXTS.length);
        }, 1000);

        const dotsInterval = setInterval(() => {
            setDots(prev => prev.length >= 2 ? '' : prev + '.');
        }, 300);

        return () => {
            clearInterval(textInterval);
            clearInterval(dotsInterval);
        };
    }, []);

    return (
        <div className="random-loading-container">
            <div className="random-content">
                <h1>🎲 Feeling Lucky? 🎲</h1>
                <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <p className="loading-text">{animatingText}{dots}</p>
            </div>
        </div>
    );
};

export default Random;
