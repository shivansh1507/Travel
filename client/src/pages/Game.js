import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ChallengeShare from '../components/ChallengeShare';
import DestinationCard from '../components/DestinationCard';
import FeedbackCard from '../components/FeedbackCard';
import './Game.css';

const Game = ({ user, setUser }) => {
  const [destination, setDestination] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [fact, setFact] = useState('');
  const [challengeId, setChallengeId] = useState(null);
  const [showChallenge, setShowChallenge] = useState(false);

  const fetchRandomDestination = async () => {
    setLoading(true);
    setAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(false);
    setFact('');
    
    try {
      // const response = await axios.get('/api/destinations/random');
      const response = await axios.get('http://localhost:5001/api/destinations/random');

      setDestination(response.data.destination);
      setOptions(response.data.options);
      setError('');
    } catch (err) {
      console.error('Error fetching destination:', err);
      setError('Failed to load destination. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Seed the database on first load
    const seedDatabase = async () => {
      try {
        await axios.post('http://localhost:5001/api/destinations/seed');
      } catch (err) {
        console.error('Error seeding database:', err);
      }
    };
    
    seedDatabase();
    fetchRandomDestination();
  }, []);

  const handleAnswer = async (index, correct) => {
    setAnswered(true);
    setSelectedAnswer(index);
    setIsCorrect(correct);
    
    // Select a random fun fact or trivia
    if (destination) {
      const facts = [...destination.fun_fact, ...destination.trivia];
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      setFact(randomFact);
    }
    
    // Update user score
    try {
      const response = await axios.put(`http://localhost:5001/api/users/score/${user.username}`, {
        correct
      });
      
      // Update local user state
      setUser(response.data);
      
      // Update localStorage
      localStorage.setItem('globetrotter_user', JSON.stringify(response.data));
    } catch (err) {
      console.error('Error updating score:', err);
    }
  };

  const handleNextDestination = () => {
    fetchRandomDestination();
  };

  const createChallenge = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/challenges/create', {
        username: user.username
      });
      
      setChallengeId(response.data.challengeId);
      setShowChallenge(true);
    } catch (err) {
      console.error('Error creating challenge:', err);
      alert('Failed to create challenge. Please try again.');
    }
  };

  if (loading && !destination) {
    return <div className="loading-container">Loading destinations...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchRandomDestination}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Globetrotter Challenge</h1>
        <p>Guess the destination based on the clues!</p>
      </div>
      
      {!showChallenge ? (
        <>
          {!answered ? (
            destination && (
              <DestinationCard
                clues={destination.clues}
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
          
          <div className="challenge-button-container">
            <button className="challenge-btn" onClick={createChallenge}>
              Challenge a Friend
            </button>
          </div>
        </>
      ) : (
        <ChallengeShare user={user} challengeId={challengeId} />
      )}
    </div>
  );
};

export default Game;