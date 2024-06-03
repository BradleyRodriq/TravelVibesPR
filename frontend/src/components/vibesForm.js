import React, { useState } from 'react';

const VibesForm = ({ onSubmit }) => {
    const [vibes, setVibes] = useState('');

    const handleChange = (e) => {
        setVibes(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(vibes);
        setVibes('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Vibes:
                <input type="text" value={vibes} onChange={handleChange} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default VibesForm;
