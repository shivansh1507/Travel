import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <h1>Globetrotter</h1>
        </Link>
        <div className="user-info">
          {user && (
            <div className="score-display">
              <span className="username">{user.username}</span>
              <div className="score">
                <span className="correct">✓ {user.score.correct}</span>
                <span className="incorrect">✗ {user.score.incorrect}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;