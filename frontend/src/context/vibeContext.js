import React, { createContext, useContext, useState } from 'react';

const VibeContext = createContext();

export const useVibeContext = () => useContext(VibeContext);

export const VibeProvider = ({ children }) => {
    const [vibes, setVibes] = useState([]);

    const addVibe = (newVibe) => {
        setVibes([...vibes, newVibe]);
    };

    const removeVibe = (vibeToRemove) => {
        setVibes(vibes.filter((vibe) => vibe !== vibeToRemove));
    };

    const clearVibes = () => {
        setVibes([]);
    };

    return (
        <VibeContext.Provider value={{ vibes, addVibe, removeVibe, clearVibes }}>
            {children}
        </VibeContext.Provider>
    );
};
