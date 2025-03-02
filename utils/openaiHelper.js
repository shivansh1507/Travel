const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate destinations using OpenAI API
 * @param {number} count - Number of destinations to generate
 * @returns {Array} Array of destination objects
 */
async function generateDestinations(count = 10) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not found. Skipping destination generation.');
      return [];
    }

    console.log(`Generating ${count} destinations using OpenAI...`);
    
    const prompt = `Generate ${count} unique travel destinations as a valid JSON array. Each destination should include:
    1. city (string): Name of the city
    2. country (string): Country where the city is located
    3. clues (array of strings): 2-3 cryptic clues about the destination
    4. fun_fact (array of strings): 2-3 interesting facts about the destination
    5. trivia (array of strings): 2-3 trivia items about the destination
    
    Make the clues challenging but fair. Ensure global diversity in the destinations.
    Format as a valid JSON array that can be parsed directly.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates travel destination data in valid JSON format." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content.trim();
    
    // Extract JSON array from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Failed to extract JSON from OpenAI response');
      return [];
    }
    
    const destinations = JSON.parse(jsonMatch[0]);
    console.log(`Successfully generated ${destinations.length} destinations`);
    return destinations;
  } catch (error) {
    console.error('Error generating destinations with OpenAI:', error);
    return [];
  }
}

module.exports = {
  generateDestinations
};