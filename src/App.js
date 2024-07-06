import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './src/hooks/useAuthContext';
import Home from './src/pages/Home';
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';
import UserVibes from './src/pages/UserVibes';
import Navbar from './src/components/Navbar';
import CreateExperience from './src/pages/ExperienceManager';
import ExperienceDetailsPage from './src/pages/ExperienceDetailsPage';
import SignupThanks from './src/pages/SignupThanks';
import MapPage from './src/pages/MapPage';
import { LoadScript } from '@react-google-maps/api';
import Landing from './src/pages/Landing';
import './styles/App.css';

function App() {
  const { user } = useAuthContext();
  const [redirectedToLogin, setRedirectedToLogin] = useState(false);

  if (!user && !redirectedToLogin) {
    setRedirectedToLogin(true);
    return <Navigate to="/login" />;
  }
  

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyDP8zkTwAzKinxwNbrxis42EyX5dCkece4">
        <BrowserRouter>
          <Navbar className="App"/>
          <div>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/select-vibes" element={<UserVibes />} />
              <Route path="/add-experience" element={<CreateExperience />} />
              <Route path="/experience/:id" element={<ExperienceDetailsPage />} />
              <Route path="/signupthanks" element={<SignupThanks/>} />
              <Route path="/ExperienceMap" element={<MapPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </LoadScript>
    </div>
  );
}

export default App;
