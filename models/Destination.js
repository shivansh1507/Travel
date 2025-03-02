const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String,
    required: true
  },
  clues: {
    type: [String],
    required: true
  },
  fun_fact: {
    type: [String],
    required: true
  },
  trivia: {
    type: [String],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Destination', DestinationSchema);