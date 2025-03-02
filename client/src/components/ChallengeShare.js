import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './ChallengeShare.css';

const ChallengeShare = ({ user, challengeId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const shareCardRef = useRef(null);
  
  const generateShareImage = async () => {
    if (!shareCardRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      setImageUrl(dataUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const shareToWhatsApp = () => {
    if (!challengeId) return;
    
    const challengeUrl = `${window.location.origin}/challenge/${challengeId}`;
    const message = `Hey! I challenge you to beat my score in Globetrotter! Play here: ${challengeUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };
  
  const copyLinkToClipboard = () => {
    if (!challengeId) return;
    
    const challengeUrl = `${window.location.origin}/challenge/${challengeId}`;
    navigator.clipboard.writeText(challengeUrl)
      .then(() => {
        alert('Challenge link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };

  return (
    <div className="challenge-share">
      <h2>Challenge a Friend</h2>
      
      <div className="share-card-container">
        <div className="share-card" ref={shareCardRef}>
          <div className="share-header">
            <h3>Globetrotter Challenge</h3>
          </div>
          <div className="share-content">
            <p className="share-message">
              I've scored {user.score.correct} correct answers in Globetrotter!
            </p>
            <p className="share-challenge">Can you beat my score?</p>
            <div className="share-score">
              <div className="score-item">
                <span className="score-value">{user.score.correct}</span>
                <span className="score-label">Correct</span>
              </div>
              <div className="score-item">
                <span className="score-value">{user.score.incorrect}</span>
                <span className="score-label">Incorrect</span>
              </div>
              <div className="score-item">
                <span className="score-value">{user.score.total}</span>
                <span className="score-label">Total</span>
              </div>
            </div>
          </div>
          <div className="share-footer">
            <p>Play at: globetrotter-challenge.com</p>
          </div>
        </div>
      </div>
      
      {!imageUrl && (
        <button 
          className="generate-btn"
          onClick={generateShareImage}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Share Image'}
        </button>
      )}
      
      {imageUrl && (
        <div className="share-image-container">
          <img src={imageUrl} alt="Challenge share" className="share-image" />
          
          <div className="share-buttons">
            <button className="whatsapp-btn" onClick={shareToWhatsApp}>
              Share on WhatsApp
            </button>
            <button className="copy-btn" onClick={copyLinkToClipboard}>
              Copy Challenge Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeShare;