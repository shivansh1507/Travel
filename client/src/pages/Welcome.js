import axios from 'axios';
import React, { useState } from 'react';
import './Welcome.css';

const Welcome = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Register user
      // const response = await axios.post('/api/users/register', { username });
      const response = await axios.post('http://localhost:5001/api/users/register', { username });

      
      // Login successful
      onLogin(response.data);
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1>Welcome to Globetrotter Challenge!</h1>
        <p className="welcome-description">
          Test your knowledge of famous destinations around the world.
          Guess correctly to earn points and challenge your friends!
        </p>
        
        <div className="features">
          <div className="feature">
            <div className="feature-icon">🌍</div>
            <h3>Explore the World</h3>
            <p>Discover fascinating destinations through cryptic clues</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🧠</div>
            <h3>Test Your Knowledge</h3>
            <p>Challenge yourself with tricky questions about famous places</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🏆</div>
            <h3>Compete with Friends</h3>
            <p>Share your score and challenge friends to beat it</p>
          </div>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Enter a Username to Start</h2>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            className="start-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Start Playing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;