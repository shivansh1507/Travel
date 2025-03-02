import React from 'react';
import './DestinationCard.css';

const DestinationCard = ({ clues, options, onAnswer, answered, correctAnswer, selectedAnswer }) => {
  return (
    <div className="destination-card">
      <div className="clues-container">
        <h2>Where am I?</h2>
        {clues.map((clue, index) => (
          <div key={index} className="clue">
            <span className="clue-number">{index + 1}</span>
            <p>{clue}</p>
          </div>
        ))}
      </div>
      
      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${
              answered && option.correct ? 'correct' : ''
            } ${
              answered && selectedAnswer === index && !option.correct ? 'incorrect' : ''
            } ${
              answered && !option.correct ? 'disabled' : ''
            }`}
            onClick={() => !answered && onAnswer(index, option.correct)}
            disabled={answered}
          >
            {option.city}, {option.country}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DestinationCard;