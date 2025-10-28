import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useExperienceContext } from '../hooks/useExperienceContext';
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

const ExperienceDetailsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const { user } = useAuthContext();
    const { dispatch } = useExperienceContext();
    const [experience, setExperience] = useState(null);
    const [vibeNames, setVibeNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviews, setShowReviews] = useState(false);

    // Helper function to render star rating with half-star support
    const renderStars = (rating) => {
        const numRating = Number(rating) || 0;
        const fullStars = Math.floor(numRating);
        const remainder = numRating - fullStars;
        let stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push({ type: 'full', index: i });
        }

        // Handle half stars between 0.3 and 0.7
        if (remainder >= 0.3 && remainder <= 0.7) {
            stars.push({ type: 'half', index: fullStars });
            for (let i = fullStars + 1; i < 5; i++) {
                stars.push({ type: 'empty', index: i });
            }
        } else if (remainder > 0.7) {
            // Round up
            stars.push({ type: 'full', index: fullStars });
            for (let i = fullStars + 1; i < 5; i++) {
                stars.push({ type: 'empty', index: i });
            }
        } else {
            // No half star
            for (let i = fullStars; i < 5; i++) {
                stars.push({ type: 'empty', index: i });
            }
        }

        return (
            <div className="review-rating">
                {stars.map((star) => (
                    <span 
                        key={star.index} 
                        className={star.type}
                        style={{ 
                            color: star.type !== 'empty' ? '#FBBF24' : '#6B7280',
                            opacity: star.type === 'empty' ? 0.3 : 1
                        }}
                    >
                        {star.type === 'half' ? '☆' : '★'}
                    </span>
                ))}
            </div>
        );
    };

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                // Check if data was pre-loaded from Random page
                const preloadedData = location.state?.preloadedExperience;
                
                if (preloadedData) {
                    // Use pre-loaded data
                    setExperience(preloadedData);
                    
                    // Fetch vibe names
                    if (preloadedData.vibes && preloadedData.vibes.length > 0) {
                        const names = await getVibeNames(preloadedData.vibes);
                        setVibeNames(names);
                    }
                    
                    setLoading(false);
                } else {
                    // Fetch data normally
                    const response = await fetch(`/api/experiences/${id}`);
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
                    
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching experience details:', error);
                setLoading(false);
            }
        };

        fetchExperience();
    }, [id, location.state]);

    const handleDelete = async () => {
        if (!user || !window.confirm('Are you sure you want to delete this experience?')) {
            return;
        }

        try {
            const response = await fetch(`/api/experiences/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                dispatch({ type: 'DELETE_EXPERIENCE', payload: { _id: id } });
                window.location.href = '/home';
            }
        } catch (error) {
            console.error('Error deleting experience:', error);
        }
    };

    const municipalities = [
        'Adjuntas', 'Aguada', 'Aguadilla', 'Aguas Buenas', 'Aibonito', 'Añasco', 'Arecibo',
        'Arroyo', 'Barceloneta', 'Barranquitas', 'Bayamón', 'Cabo Rojo', 'Caguas', 'Camuy',
        'Canóvanas', 'Carolina', 'Cataño', 'Cayey', 'Ceiba', 'Ciales', 'Cidra', 'Coamo',
        'Comerío', 'Corozal', 'Culebra', 'Dorado', 'Fajardo', 'Florida', 'Guánica', 'Guayama',
        'Guayanilla', 'Guaynabo', 'Gurabo', 'Hatillo', 'Hormigueros', 'Humacao', 'Isabela',
        'Jayuya', 'Juana Díaz', 'Juncos', 'Lajas', 'Lares', 'Las Marías', 'Las Piedras',
        'Loíza', 'Luquillo', 'Manatí', 'Maricao', 'Maunabo', 'Mayagüez', 'Moca', 'Morovis',
        'Naguabo', 'Naranjito', 'Orocovis', 'Patillas', 'Peñuelas', 'Ponce', 'Quebradillas',
        'Rincón', 'Río Grande', 'Sabana Grande', 'Salinas', 'San Germán', 'San Juan', 'San Lorenzo',
        'San Sebastián', 'Santa Isabel', 'Toa Alta', 'Toa Baja', 'Trujillo Alto', 'Utuado', 'Vega Alta',
        'Vega Baja', 'Vieques', 'Villalba', 'Yabucoa', 'Yauco',
    ];

    if (loading) {
        return null;
    }

    if (!experience) {
        return (
            <div className="experience-details-page">
                <div className="error-container">
                    <h2>Experience not found</h2>
                    <p>Sorry, this experience doesn't exist.</p>
                    <Link to="/home" className="back-button">Back to Home</Link>
                </div>
            </div>
        );
    }

    const municipality = municipalities.find(m => experience.location.includes(m)) || experience.location;
    const averageRating = experience.reviews && experience.reviews.length > 0
        ? experience.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / experience.reviews.length
        : null;

    return (
        <div className="experience-details-page">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-image">
                    <img 
                        src={experience.pictureUrl} 
                        alt={experience.name} 
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop';
                        }}
                    />
                </div>
                <div className="hero-content">
                    <h1>{experience.name}</h1>
                    <div className="hero-meta">
                        <div className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round"/>
                                <circle cx="12" cy="10" r="3" strokeLinecap="round"/>
                            </svg>
                            <span>{municipality}</span>
                        </div>
                        {averageRating !== null && (
                            <div className="meta-item rating">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                <span>{averageRating.toFixed(1)}</span>
                                <div className="stars-inline">{renderStars(averageRating)}</div>
                            </div>
                        )}
                        <div className="meta-item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeLinecap="round"/>
                                <polyline points="17 21 17 13 7 13 7 21" strokeLinecap="round"/>
                                <polyline points="7 3 7 8 15 8" strokeLinecap="round"/>
                            </svg>
                            <span>{formatDistanceToNow(new Date(experience.createdAt))} ago</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Vibes Section */}
                {vibeNames.length > 0 && (
                    <div className="content-card">
                        <h2>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round"/>
                            </svg>
                            Related Vibes
                        </h2>
                        <div className="vibes-grid">
                            {vibeNames.map((vibe, index) => (
                                <span key={index} className="vibe-tag-large">{vibe}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                {experience.reviews && experience.reviews.length > 0 ? (
                    <div className="content-card">
                        <div className="reviews-header">
                            <h2>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round"/>
                                </svg>
                                Reviews & Ratings
                                <span className="review-count">({experience.reviews.length})</span>
                            </h2>
                            {experience.reviews.length > 2 && (
                                <button className="view-all-btn" onClick={() => setShowReviews(true)}>
                                    View All
                                </button>
                            )}
                        </div>
                        
                        <div className="reviews-preview">
                            {experience.reviews.slice(0, 2).map((review, index) => (
                                <div key={index} className="review-card">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <span className="reviewer-name">{review.reviewer || 'Anonymous'}</span>
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <p className="review-text">{review.text || 'No review text provided.'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="content-card">
                        <h2>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            Reviews & Ratings
                        </h2>
                        <p className="no-reviews">No reviews yet. Be the first to review this experience!</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="actions-section">
                    <Link to="/home" className="action-btn secondary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="19 12 5 12M12 19l-7-7 7-7" strokeLinecap="round"/>
                        </svg>
                        Back to Home
                    </Link>
                    {user && experience.user === user.email && (
                        <button className="action-btn danger" onClick={handleDelete}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" strokeLinecap="round"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round"/>
                            </svg>
                            Delete Experience
                        </button>
                    )}
                </div>
            </div>

            {/* Reviews Modal */}
            {showReviews && (
                <div className="modal-overlay" onClick={() => setShowReviews(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                All Reviews ({experience.reviews.length})
                            </h2>
                            <button className="modal-close" onClick={() => setShowReviews(false)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
                                    <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                        <div className="modal-reviews">
                            {experience.reviews.map((review, index) => (
                                <div key={index} className="review-card-modal">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <span className="reviewer-name">{review.reviewer || 'Anonymous'}</span>
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <p className="review-text">{review.text || 'No review text provided.'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperienceDetailsPage;
