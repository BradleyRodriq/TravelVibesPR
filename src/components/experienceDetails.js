import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useExperienceContext } from "../hooks/useExperienceContext";
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/ExperienceDetails.css';

const vibeNameCache = new Map();
const VIBE_CACHE_MAX_SIZE = 100;

const getVibeNames = async (vibeIds) => {
    try {
        const cacheKey = JSON.stringify(vibeIds);
        
        // Check cache first
        if (vibeNameCache.has(cacheKey)) {
            return vibeNameCache.get(cacheKey);
        }

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
        const result = vibeNames || ['Unknown Vibe'];
        
        // Cache the result
        if (vibeNameCache.size >= VIBE_CACHE_MAX_SIZE) {
            // Remove oldest entry (simple FIFO)
            const firstKey = vibeNameCache.keys().next().value;
            vibeNameCache.delete(firstKey);
        }
        vibeNameCache.set(cacheKey, result);
        
        return result;
    } catch (error) {
        console.error('Failed to fetch vibes:', error);
        return ['Unknown Vibe'];
    }
};

const ExperienceDetails = ({ experience, vibes, onDelete }) => {
    const { dispatch } = useExperienceContext();
    const { user } = useAuthContext();
    const [vibeNames, setVibeNames] = useState([]);

    useEffect(() => {
        const fetchVibeNames = async () => {
            const names = await getVibeNames(vibes);
            setVibeNames(names);
        };

        fetchVibeNames();
    }, [vibes]);

    // Memoize municipalities array to avoid creating it on every render
    const municipalities = useMemo(() => [
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
    ], []);

    const municipality = useMemo(() => {
        return municipalities.find(m => experience.location.includes(m)) || experience.location;
    }, [municipalities, experience.location]);

    // Calculate average rating from reviews - memoized for performance
    const averageRating = useMemo(() => {
        if (!experience.reviews || experience.reviews.length === 0) return null;
        return experience.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / experience.reviews.length;
    }, [experience.reviews]);

    // Render star rating with half-star support
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

    return (
        <Link to={`/experience/${experience._id}`} className="experience-link">
            <div className="experience-item">
                <div className="experience-image-container">
                    <img 
                        src={experience.pictureUrl} 
                        alt={experience.name} 
                        className="experience-image"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop';
                        }}
                    />
                    <div className="experience-overlay"></div>
                </div>
                <div className="experience-content">
                    <h4>{experience.name}</h4>
                    <div className="experience-meta">
                        <div className="meta-item location">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2"/>
                                <circle cx="12" cy="10" r="3" strokeWidth="2"/>
                            </svg>
                            <span>{municipality || experience.location}</span>
                        </div>
                        {vibeNames.length > 0 && (
                            <div className="meta-item vibes">
                                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2"/>
                                </svg>
                                <span>{vibeNames.slice(0, 3).join(' • ')}</span>
                            </div>
                        )}
                        {averageRating !== null && (
                            <div className="meta-item rating">
                                <svg className="icon" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                <span>{averageRating.toFixed(1)} ({experience.reviews.length})</span>
                                {renderStars(averageRating)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ExperienceDetails;
