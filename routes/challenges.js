const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Destination = require('../models/Destination');
const crypto = require('crypto');

// Create a new challenge
router.post('/create', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get 5 random destinations for the challenge
    const randomDestinations = await Destination.aggregate([
      { $sample: { size: 5 } },
      { $project: { _id: 1 } }
    ]);
    
    const destinationIds = randomDestinations.map(dest => dest._id);
    
    // Generate unique challenge ID
    const challengeId = crypto.randomBytes(4).toString('hex');
    
    // Create challenge
    const newChallenge = new Challenge({
      creator: user._id,
      challengeId,
      destinations: destinationIds
    });
    
    const savedChallenge = await newChallenge.save();
    
    res.status(201).json({
      challengeId,
      creatorUsername: username,
      creatorScore: user.score
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get challenge by ID
router.get('/:challengeId', async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ 
      challengeId: req.params.challengeId,
      active: true
    }).populate('creator');
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found or inactive' });
    }
    
    // Get creator info
    const creator = await User.findById(challenge.creator);
    
    res.json({
      challengeId: challenge.challengeId,
      creatorUsername: creator.username,
      creatorScore: creator.score,
      destinationIds: challenge.destinations
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;