import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import './FeedbackCard.css';

const FeedbackCard = ({ isCorrect, fact, onNext }) => {
  const confettiRef = useRef(null);
  
  useEffect(() => {
    if (isCorrect && confettiRef.current) {
      const canvas = confettiRef.current;
      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
      });
      
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isCorrect]);

  return (
    <div className={`feedback-card ${isCorrect ? 'correct' : 'incorrect'}`}>
      {isCorrect ? (
        <>
          <canvas ref={confettiRef} className="confetti-canvas"></canvas>
          <h2>Correct! 🎉</h2>
        </>
      ) : (
        <>
          <h2>Oops! Wrong answer 😢</h2>
          <div className="sad-face">😢</div>
        </>
      )}
      
      <div className="fact-container">
        <h3>Fun Fact:</h3>
        <p>{fact}</p>
      </div>
      
      <button className="next-btn" onClick={onNext}>
        Next Destination
      </button>
    </div>
  );
};

export default FeedbackCard;