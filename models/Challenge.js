const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: String,
    required: true,
    unique: true
  },
  destinations: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Destination',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);