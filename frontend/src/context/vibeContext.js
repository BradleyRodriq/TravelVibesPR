import React, { createContext, useContext, useState, useEffect } from 'react';

const VibesContext = createContext();

export const useVibesContext = () => useContext(VibesContext);

export const VibesProvider = ({ children }) => {
    const [vibes, setVibes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('/api/vibes')
            .then(response => response.json())
            .then(data => setVibes(data))
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <VibesContext.Provider value={{ vibes, setVibes, loading, error }}>
            {children}
        </VibesContext.Provider>
    );
};
