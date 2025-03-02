import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import Game from './pages/Game';
import Challenge from './pages/Challenge';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('globetrotter_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('globetrotter_user', JSON.stringify(userData));
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <Header user={user} />
      <main className="container">
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/game" /> : <Welcome onLogin={handleLogin} />} 
          />
          <Route 
            path="/game" 
            element={user ? <Game user={user} setUser={setUser} /> : <Navigate to="/" />} 
          />
          <Route path="/challenge/:challengeId" element={<Challenge setUser={setUser} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Globetrotter Challenge - The Ultimate Travel Guessing Game</p>
        </div>
      </footer>
    </div>
  );
}

export default App;