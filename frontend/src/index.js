import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ExperienceContextProvider } from './context/experienceContext';
import { AutContextProvider } from './context/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AutContextProvider>
    <ExperienceContextProvider>
      <App />
    </ExperienceContextProvider>
    </AutContextProvider>
  </React.StrictMode>
);
