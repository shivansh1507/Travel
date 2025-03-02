const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  score: {
    correct: {
      type: Number,
      default: 0
    },
    incorrect: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);