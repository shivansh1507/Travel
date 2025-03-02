import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DestinationCard from '../components/DestinationCard';
import FeedbackCard from '../components/FeedbackCard';
import './Challenge.css';

const Challenge = ({ setUser }) => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [creator, setCreator] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [fact, setFact] = useState('');
  const [score, setScore] = useState({ correct: 0, incorrect: 0, total: 0 });
  const [username, setUsername] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await axios.get(`/api/challenges/${challengeId}`);
        setChallenge(response.data);
        setCreator({
          username: response.data.creatorUsername,
          score: response.data.creatorScore
        });
        
        // Fetch destinations for this challenge
        const destinationsResponse = await axios.post('/api/destinations/specific', {
          destinationIds: response.data.destinationIds
        });
        
        setDestinations(destinationsResponse.data);
        
        // Check if user is already logged in
        const storedUser = localStorage.getItem('globetrotter_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUsername(userData.username);
          setIsRegistered(true);
        }
        
        setError('');
      } catch (err) {
        console.error('Error fetching challenge:', err);
        setError('Challenge not found or has expired.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallenge();
  }, [challengeId]);

  useEffect(() => {
    if (destinations.length > 0 && currentIndex < destinations.length) {
      prepareQuestion();
    }
  }, [destinations, currentIndex]);

  const prepareQuestion = async () => {
    const currentDestination = destinations[currentIndex];
    
    try {
      // Get other random destinations for options
      const response = await axios.get('/api/destinations/random');
      const otherOptions = response.data.options.filter(opt => 
        opt.city !== currentDestination.city
      ).slice(0, 3);
      
      // Add correct answer and shuffle
      const allOptions = [
        { city: currentDestination.city, country: currentDestination.country, correct: true },
        ...otherOptions.map(opt => ({ ...opt, correct: false }))
      ];
      
      // Fisher-Yates shuffle
      for (let i = allOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
      }
      
      // Select 1-2 random clues
      const cluesCount = Math.floor(Math.random() * 2) + 1; // 1 or 2
      const randomClues = currentDestination.clues
        .sort(() => 0.5 - Math.random())
        .slice(0, cluesCount);
      
      // Update state
      setOptions(allOptions);
      
      // Update current destination with selected clues
      setDestinations(prev => {
        const updated = [...prev];
        updated[currentIndex] = {
          ...updated[currentIndex],
          selectedClues: randomClues
        };
        return updated;
      });
      
    } catch (err) {
      console.error('Error preparing question:', err);
      setError('Failed to prepare question. Please try again.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }
    
    try {
      const response = await axios.post('/api/users/register', { username });
      setUser(response.data);
      localStorage.setItem('globetrotter_user', JSON.stringify(response.data));
      setIsRegistered(true);
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };

  const handleAnswer = async (index, correct) => {
    setAnswered(true);
    setSelectedAnswer(index);
    setIsCorrect(correct);
    
    // Select a random fun fact or trivia
    const currentDestination = destinations[currentIndex];
    if (currentDestination) {
      const facts = [...currentDestination.fun_fact, ...currentDestination.trivia];
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      setFact(randomFact);
    }
    
    // Update score
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
      total: prev.total + 1
    }));
    
    // Update user score if registered
    if (isRegistered) {
      try {
        const response = await axios.put(`/api/users/score/${username}`, {
          correct
        });
        
        // Update localStorage
        localStorage.setItem('globetrotter_user', JSON.stringify(response.data));
        setUser(response.data);
      } catch (err) {
        console.error('Error updating score:', err);
      }
    }
  };

  const handleNextDestination = () => {
    if (currentIndex < destinations.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setIsCorrect(false);
      setFact('');
    } else {
      // Challenge completed
      setGameCompleted(true);
    }
  };

  const handlePlayAgain = () => {
    navigate('/game');
  };

  if (loading) {
    return <div className="loading-container">Loading challenge...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="challenge-container">
        <div className="challenge-intro">
          <h1>You've been challenged!</h1>
          <div className="creator-info">
            <p><strong>{creator.username}</strong> has challenged you to beat their score:</p>
            <div className="creator-score">
              <div className="score-item">
                <span className="score-value">{creator.score.correct}</span>
                <span className="score-label">Correct</span>
              </div>
              <div className="score-item">
                <span className="score-value">{creator.score.incorrect}</span>
                <span className="score-label">Incorrect</span>
              </div>
              <div className="score-item">
                <span className="score-value">{creator.score.total}</span>
                <span className="score-label">Total</span>
              </div>
            </div>
          </div>
          
          <form className="register-form" onSubmit={handleRegister}>
            <h2>Enter a username to start the challenge</h2>
            <div className="form-group">
              <input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button type="submit" className="start-btn">
              Start Challenge
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="challenge-container">
        <div className="challenge-complete">
          <h1>Challenge Complete!</h1>
          
          <div className="final-score">
            <h2>Your Score</h2>
            <div className="score-display">
              <div className="score-item">
                <span className="score-value">{score.correct}</span>
                <span className="score-label">Correct</span>
              </div>
              <div className="score-item">
                <span className="score-value">{score.incorrect}</span>
                <span className="score-label">Incorrect</span>
              </div>
              <div className="score-item">
                <span className="score-value">{score.total}</span>
                <span className="score-label">Total</span>
              </div>
            </div>
          </div>
          
          <div className="vs-container">
            <div className="player-score">
              <h3>You</h3>
              <div className="score-value">{score.correct}</div>
            </div>
            <div className="vs">VS</div>
            <div className="player-score">
              <h3>{creator.username}</h3>
              <div className="score-value">{creator.score.correct}</div>
            </div>
          </div>
          
          <div className="result-message">
            {score.correct > creator.score.correct ? (
              <h2 className="win">You Won! 🎉</h2>
            ) : score.correct < creator.score.correct ? (
              <h2 className="lose">You Lost! 😢</h2>
            ) : (
              <h2 className="tie">It's a Tie! 🤝</h2>
            )}
          </div>
          
          <button className="play-again-btn" onClick={handlePlayAgain}>
            Play New Game
          </button>
        </div>
      </div>
    );
  }

  const currentDestination = destinations[currentIndex];
  
  return (
    <div className="challenge-container">
      <div className="challenge-header">
        <h1>Challenge from {creator.username}</h1>
        <div className="challenge-progress">
          <p>Question {currentIndex + 1} of {destinations.length}</p>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentIndex) / destinations.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="score-display">
          <div className="score-item">
            <span className="score-value">{score.correct}</span>
            <span className="score-label">Correct</span>
          </div>
          <div className="score-item">
            <span className="score-value">{score.incorrect}</span>
            <span className="score-label">Incorrect</span>
          </div>
        </div>
      </div>
      
      {!answered ? (
        currentDestination && currentDestination.selectedClues && (
          <DestinationCard
            clues={currentDestination.selectedClues}
            options={options}
            onAnswer={handleAnswer}
            answered={answered}
            correctAnswer={options.findIndex(opt => opt.correct)}
            selectedAnswer={selectedAnswer}
          />
        )
      ) : (
        <FeedbackCard
          isCorrect={isCorrect}
          fact={fact}
          onNext={handleNextDestination}
        />
      )}
    </div>
  );
};

export default Challenge;