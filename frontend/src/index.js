import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ExperienceContextProvider } from './context/experienceContext';
import { AuthContextProvider } from './context/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
    <ExperienceContextProvider>
      <App />
    </ExperienceContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
