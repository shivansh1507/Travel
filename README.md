# Globetrotter Challenge - Full Stack Travel Guessing Game

## Overview
The **Globetrotter Challenge** is an interactive travel guessing game that allows users to test their geography knowledge by guessing destinations based on clues. It features a full-stack architecture with a **React.js frontend** and an **Express.js backend** connected to a **MongoDB database**. The game includes OpenAI-powered data expansion, animated feedback, and a challenge system for users to compete with friends.

## Live Demo
Check out the live game here: [Globetrotter Challenge](https://headout-wc6w.onrender.com/game)

## Features

### Backend
- **MongoDB Integration**: Stores destinations, users, and challenge data.
- **RESTful API**: Handles game functionality and user interactions.
- **OpenAI API Integration**: Expands the dataset to over 100+ destinations.
- **User Authentication**: Allows users to register and track scores.
- **Challenge System**: Users can create and share game challenges.

### Frontend
- **Modern UI with Animations**: Smooth user experience with interactive elements.
- **Game Interface**: Provides clues and multiple-choice answers for destination guessing.
- **Feedback System**: Uses confetti for correct answers and sad-face animation for incorrect ones.
- **Challenge Sharing**: Generates dynamic images for WhatsApp sharing using `html2canvas`.
- **Score Tracking**: Allows players to compare their performance.

## How to Play
1. **User Registration**: Players register with a username.
2. **Guess the Destination**: Receive clues and select the correct destination.
3. **Receive Feedback**: Animated response with fun facts.
4. **Challenge Friends**: Generate a unique challenge link and share via WhatsApp.
5. **Compare Scores**: Friends can attempt the same challenge and view comparative results.

## Project Structure
models/
  ├── Challenge.js
routes/
  ├── destinations.js
  ├── users.js
  ├── challenges.js
utils/
  ├── openaiHelper.js
client/
  ├── package.json
  ├── public/
  │   ├── index.html
  │   ├── manifest.json
  ├── src/
  │   ├── index.js
  │   ├── index.css
  │   ├── App.js
  │   ├── App.css
  │   ├── components/
  │   │   ├── Header.js
  │   │   ├── Header.css
  │   │   ├── DestinationCard.js
  │   │   ├── DestinationCard.css
  │   │   ├── FeedbackCard.js
  │   │   ├── FeedbackCard.css
  │   │   ├── ChallengeShare.js
  │   │   ├── ChallengeShare.css
  │   ├── pages/
  │   │   ├── Welcome.js
  │   │   ├── Welcome.css
  │   │   ├── Game.js
  │   │   ├── Game.css
  │   │   ├── Challenge.js
  │   │   ├── Challenge.css
  │   │   ├── NotFound.js
  │   │   ├── NotFound.css



## Setup Instructions

### Prerequisites
Ensure you have **Node.js** and **MongoDB** installed on your system.

### Installation
1. Clone the repository:
  
   git clone https://github.com/shivansh1507/Travel.git
   cd Travel

2.Install dependencies for the backend:
 ```sh
npm install

Navigate to the frontend folder and install dependencies:
 ```sh
cd client
npm install



Running the Application
Start the backend server:npm run dev
Start the frontend development server:
 ```sh
cd client
npm start

-------

### Technical Stack
Frontend: React.js, React Router, CSS Animations
Backend: Express.js, Node.js
Database: MongoDB
APIs: OpenAI API for dataset expansion
Libraries: html2canvas for image generation, canvas-confetti for animations


### Future Enhancements
Leaderboard system for global ranking
Additional question difficulty levels
Enhanced personalization with user preferences
Multi-language support
