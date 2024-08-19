import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ExperienceContextProvider } from './context/experienceContext';
import { AuthContextProvider } from './context/authContext';
import { VibesProvider } from './context/vibeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
    <ExperienceContextProvider>
    <VibesProvider>
        <App />
    </VibesProvider>
    </ExperienceContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
