import React, { useState, useEffect } from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import '../styles/ExperienceDetailsPage.css';

const getVibeNames = async (vibeIds) => {
    try {
        const response = await fetch('/api/vibes/batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vibeIds }),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const vibeNames = await response.json();
        return vibeNames || ['Unknown Vibe'];
    } catch (error) {
        console.error('Failed to fetch vibes:', error);
        return ['Unknown Vibe'];
    }
};

const Modal = ({ show, onClose, reviews }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Reviews</h2>
                <button className="close-button" onClick={onClose}>X</button>
                <div className="modal-content">
                    <ul>
                        {reviews.map((review, index) => (
                            <li key={index}>
                                <p><strong>{review.reviewer}</strong>: {review.text} (Rating: {review.rating})</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const Random = () => {
    const [experience, setExperience] = useState(null);
    const [vibeNames, setVibeNames] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchRandomExperience = async () => {
            try {
                const response = await fetch('/api/random');
                if (!response.ok) {
                    throw new Error('Failed to fetch experience details');
                }
                const data = await response.json();
                setExperience(data);

                // Fetch vibe names
                if (data.vibes && data.vibes.length > 0) {
                    const names = await getVibeNames(data.vibes);
                    setVibeNames(names);
                }
            } catch (error) {
                console.error('Error fetching experience details:', error);
            }
        };

        fetchRandomExperience();
    }, []);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const remainder = rating - fullStars;
        const hasHalfStar = remainder >= 0.3 && remainder < 0.8;
        const stars = [];

        for (let i = 1; i <= fullStars; i++) {
            stars.push(
                <span key={i} className="star filled"></span>
            );
        }

        if (hasHalfStar) {
            stars.push(
                <span key="half" className="star half-filled"></span>
            );
        }

        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <span key={`empty${i}`} className="star"></span>
            );
        }

        return stars;
    };

    if (!experience) {
        return <div>Loading...</div>;
    }

    return (
        <div className="experience-detail-container">
            <div className="experience-info">
                <h1>{experience.name}</h1>
                <img src={experience.pictureUrl} alt={experience.name} className="experience-image" />
                <div>
                    <p><strong>Location:</strong> {experience.location}</p>
                    <p><strong>Rating:</strong> {renderStars(experience.rating)}</p>
                    <p><strong>Vibes:</strong></p>
                    <div className="vibes-container">
                        {vibeNames.map((vibe, index) => (
                            <span key={index} className="vibe">{vibe}</span>
                        ))}
                    </div>
                    <p><strong>Created:</strong> {formatDistanceToNow(new Date(experience.createdAt))} ago</p>
                    <div className="reviews-button-container">
                        <button className="reviews-button" onClick={() => setShowModal(true)}>View Reviews</button>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} reviews={experience.reviews} />
        </div>
    );
};

export default Random;
