const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const { generateDestinations } = require('../utils/openaiHelper');

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get random destination
router.get('/random', async (req, res) => {
  try {
    const count = await Destination.countDocuments();
    const random = Math.floor(Math.random() * count);
    const destination = await Destination.findOne().skip(random);
    
    // Get 3 more random destinations for multiple choice
    const otherDestinations = await Destination.aggregate([
      { $match: { _id: { $ne: destination._id } } },
      { $sample: { size: 3 } },
      { $project: { city: 1, country: 1 } }
    ]);
    
    // Combine correct answer with other options and shuffle
    const options = [
      { city: destination.city, country: destination.country, correct: true },
      ...otherDestinations.map(dest => ({ 
        city: dest.city, 
        country: dest.country, 
        correct: false 
      }))
    ];
    
    // Fisher-Yates shuffle algorithm
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    // Select 1-2 random clues
    const cluesCount = Math.floor(Math.random() * 2) + 1; // 1 or 2
    const randomClues = destination.clues
      .sort(() => 0.5 - Math.random())
      .slice(0, cluesCount);
    
    res.json({
      destination: {
        id: destination._id,
        clues: randomClues,
        fun_fact: destination.fun_fact,
        trivia: destination.trivia
      },
      options
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get specific destinations by IDs (for challenges)
router.post('/specific', async (req, res) => {
  try {
    const { destinationIds } = req.body;
    if (!destinationIds || !Array.isArray(destinationIds)) {
      return res.status(400).json({ message: 'Destination IDs array is required' });
    }
    
    const destinations = await Destination.find({
      _id: { $in: destinationIds }
    });
    
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed database with initial destinations
router.post('/seed', async (req, res) => {
  try {
    const initialData = [
      {
        city: "Paris",
        country: "France",
        clues: [
          "This city is home to a famous tower that sparkles every night.",
          "Known as the 'City of Love' and a hub for fashion and art."
        ],
        fun_fact: [
          "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
          "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules."
        ],
        trivia: [
          "This city is famous for its croissants and macarons. Bon appétit!",
          "Paris was originally a Roman city called Lutetia."
        ]
      },
      {
        city: "Tokyo",
        country: "Japan",
        clues: [
          "This city has the busiest pedestrian crossing in the world.",
          "You can visit an entire district dedicated to anime, manga, and gaming."
        ],
        fun_fact: [
          "Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!",
          "More than 14 million people live in Tokyo, making it one of the most populous cities in the world."
        ],
        trivia: [
          "The city has over 160,000 restaurants, more than any other city in the world.",
          "Tokyo's subway system is so efficient that train delays of just a few minutes come with formal apologies."
        ]
      },
      {
        city: "New York",
        country: "USA",
        clues: [
          "Home to a green statue gifted by France in the 1800s.",
          "Nicknamed 'The Big Apple' and known for its Broadway theaters."
        ],
        fun_fact: [
          "The Statue of Liberty was originally a copper color before oxidizing to its iconic green patina.",
          "Times Square was once called Longacre Square before being renamed in 1904."
        ],
        trivia: [
          "New York City has 468 subway stations, making it one of the most complex transit systems in the world.",
          "The Empire State Building has its own zip code: 10118."
        ]
      }
    ];

    // Check if we already have destinations
    const count = await Destination.countDocuments();
    if (count === 0) {
      await Destination.insertMany(initialData);
      
      // Generate more destinations using OpenAI if API key is available
      if (process.env.OPENAI_API_KEY) {
        const generatedDestinations = await generateDestinations(97); // Generate 97 more to reach 100+
        if (generatedDestinations && generatedDestinations.length > 0) {
          await Destination.insertMany(generatedDestinations);
        }
      }
      
      res.status(201).json({ message: 'Destinations seeded successfully' });
    } else {
      res.json({ message: 'Database already contains destinations' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;