import Car from '../models/Car.js';
import { pipeline } from '@xenova/transformers';

// Initialize ML pipelines (lazy loaded on first use)
let textClassifier = null;
let zeroShotClassifier = null;
let summarizer = null;

const conversationHistory = new Map();

// Initialize pipelines on demand
const initializePipelines = async () => {
  try {
    if (!textClassifier) {
      console.log('Loading text classification model...');
      textClassifier = await pipeline('zero-shot-classification', 'Xenova/distilbert-base-uncased-mnli');
    }
    if (!summarizer) {
      console.log('Loading summarization model...');
      summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
    }
  } catch (error) {
    console.warn('ML models initialization warning:', error.message);
  }
};

// Classify user intent using zero-shot classification
const classifyIntent = async (message) => {
  try {
    await initializePipelines();
    if (!textClassifier) return ['general'];

    const candidateLabels = [
      'budget inquiry',
      'family car request',
      'luxury car request',
      'sports car request',
      'fuel efficiency inquiry',
      'booking question',
      'feature inquiry',
      'price comparison'
    ];

    const result = await textClassifier(message, candidateLabels, {
      multi_class: true
    });

    // Return top intent
    return [result.labels[0]];
  } catch (error) {
    console.warn('Intent classification error:', error.message);
    return ['general'];
  }
};

// Generate intelligent responses based on classified intent
const generateMLResponse = async (message, cars, intent) => {
  const userQuery = message.toLowerCase();

  // Extract numbers (prices, seats)
  const numbers = message.match(/\d+/g) || [];
  const maxPrice = numbers[0] ? parseInt(numbers[0]) : null;
  const minSeats = numbers[1] ? parseInt(numbers[1]) : null;

  try {
    // Budget intent
    if (intent.includes('budget')) {
      const budgetCars = cars.filter(car => 
        !maxPrice || car.price_pday <= maxPrice
      );
      
      if (budgetCars.length > 0) {
        const carNames = budgetCars.slice(0, 3).map(c => `${c.brand} ${c.model}`).join(', ');
        return `Perfect! I found ${budgetCars.length} affordable options ${maxPrice ? `under $${maxPrice}/day` : 'in our budget range'}. Top recommendations: ${carNames}. These are reliable, fuel-efficient choices perfect for budget-conscious travelers. Would you like more details about any of these?`;
      }
      return 'We have several budget-friendly options starting from $30/day. I recommend checking our vehicle catalog to find the perfect match for your budget!';
    }

    // Family car intent
    if (intent.includes('family')) {
      const familyCars = cars.filter(car => 
        car.category === 'SUV' || car.category === 'Van' || car.seating_capacity >= 7
      );
      
      if (familyCars.length > 0) {
        return `Excellent for family travel! The ${familyCars[0].brand} ${familyCars[0].model} offers ${familyCars[0].seating_capacity} seats and is priced at $${familyCars[0].price_pday}/day in ${familyCars[0].location}. It provides ample space, comfort, and safety features perfect for family road trips. Shall I help you book it?`;
      }
      return 'For family trips, I recommend our SUVs and vans which offer maximum space and comfort. Browse our collection to find the ideal family vehicle!';
    }

    // Luxury intent
    if (intent.includes('luxury')) {
      const luxuryCars = cars.filter(car => car.price_pday >= 100);
      
      if (luxuryCars.length > 0) {
        return `Outstanding choice! Our premium collection features the ${luxuryCars[0].brand} ${luxuryCars[0].model} at $${luxuryCars[0].price_pday}/day. This luxury sedan delivers exceptional comfort, advanced features, and elegant styling. Perfect for special occasions and business travel. Ready to experience luxury?`;
      }
      return 'Our premium vehicles offer unmatched luxury and performance. Explore our high-end collection for an exceptional driving experience!';
    }

    // Sports car intent
    if (intent.includes('sports')) {
      const sportsCars = cars.filter(car => 
        car.price_pday >= 120 || car.category.toLowerCase().includes('sport')
      );
      
      if (sportsCars.length > 0) {
        return `Fantastic! For performance enthusiasts, the ${sportsCars[0].brand} ${sportsCars[0].model} delivers thrilling performance at $${sportsCars[0].price_pday}/day. Ready to hit the road with power and style!`;
      }
      return 'We have powerful performance vehicles available. Contact us for our latest sports car options!';
    }

    // Fuel efficiency intent
    if (intent.includes('fuel')) {
      const efficientCars = cars.filter(car => car.fuel_type === 'Petrol' || car.fuel_type === 'Hybrid');
      
      if (efficientCars.length > 0) {
        return `Great choice for eco-conscious travel! The ${efficientCars[0].brand} ${efficientCars[0].model} is ${efficientCars[0].fuel_type}-powered and costs just $${efficientCars[0].price_pday}/day. It's both fuel-efficient and economical. Perfect for reducing your carbon footprint!`;
      }
      return 'Our fuel-efficient vehicles offer great mileage and help you save on gas. Browse our eco-friendly options!';
    }

    // Feature inquiry intent
    if (intent.includes('feature')) {
      if (cars.length > 0) {
        const car = cars[0];
        return `The ${car.brand} ${car.model} is a ${car.year} ${car.category} featuring:\n• Seating: ${car.seating_capacity} passengers\n• Fuel: ${car.fuel_type}\n• Transmission: ${car.transmission_type}\n• Location: ${car.location}\n• Price: $${car.price_pday}/day\n\nThis vehicle combines reliability with comfort. Interested in booking?`;
      }
    }

    // Price comparison intent
    if (intent.includes('price')) {
      const sortedCars = cars.sort((a, b) => a.price_pday - b.price_pday);
      if (sortedCars.length >= 2) {
        return `Here's our price range:\n• Budget: ${sortedCars[0].brand} ${sortedCars[0].model} - $${sortedCars[0].price_pday}/day\n• Mid-range: ${sortedCars[Math.floor(sortedCars.length / 2)].brand} ${sortedCars[Math.floor(sortedCars.length / 2)].model} - $${sortedCars[Math.floor(sortedCars.length / 2)].price_pday}/day\n• Premium: ${sortedCars[sortedCars.length - 1].brand} ${sortedCars[sortedCars.length - 1].model} - $${sortedCars[sortedCars.length - 1].price_pday}/day\n\nWhich range interests you?`;
      }
    }

    // Default response
    if (userQuery.includes('hello') || userQuery.includes('hi') || userQuery.includes('help')) {
      return `👋 Welcome to our AI-powered car rental assistant! I use advanced machine learning to understand your needs. I can help with:\n\n🏆 Budget-conscious rentals\n👨‍👩‍👧‍👦 Family vehicles with space\n💎 Luxury car recommendations\n⚡ Performance & sports cars\n♻️ Fuel-efficient options\n\nWhat kind of car are you looking for today?`;
    }

    // Intelligent fallback
    const randomCar = cars[Math.floor(Math.random() * cars.length)];
    return `Based on your query, I'd recommend the ${randomCar.brand} ${randomCar.model} - a ${randomCar.category} available at $${randomCar.price_pday}/day. This vehicle offers excellent value and reliability. Would you like to explore other options?`;

  } catch (error) {
    console.error('Response generation error:', error);
    return 'I understand you\'re looking for a car. Let me help you find the perfect match from our inventory!';
  }
};

export const mlChatWithAI = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ success: false, message: 'Message and userId required' });
    }

    // Initialize conversation history
    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }
    const history = conversationHistory.get(userId);

    // Add user message
    history.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    try {
      // Fetch cars for context
      const cars = await Car.find().lean();

      // Use ML to classify intent
      const intents = await classifyIntent(message);

      // Generate response based on intent
      const assistantMessage = await generateMLResponse(message, cars, intents);

      // Add response to history
      history.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
        intent: intents[0]
      });

      // Keep last 20 messages
      if (history.length > 20) {
        history.shift();
      }

      res.json({
        success: true,
        message: assistantMessage,
        conversationId: userId,
        detectedIntent: intents[0],
        usingML: true,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('ML Chat Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process your message',
        error: error.message
      });
    }

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
};

export const mlGetRecommendations = async (req, res) => {
  try {
    const { budget, category, seats, location } = req.query;

    // Build filter
    let query = {};
    if (budget) query.price_pday = { $lte: parseInt(budget) };
    if (category) query.category = category;
    if (seats) query.seating_capacity = { $gte: parseInt(seats) };
    if (location) query.location = location;

    const recommendedCars = await Car.find(query).limit(5).lean();

    if (recommendedCars.length === 0) {
      return res.json({
        success: true,
        cars: [],
        message: 'No vehicles match your criteria. Try adjusting your filters.',
        usingML: true
      });
    }

    // Generate smart recommendation message
    let recommendationMessage = `I found ${recommendedCars.length} perfect matches for you! `;
    
    if (budget) {
      recommendationMessage += `All within your $${budget}/day budget. `;
    }
    if (category) {
      recommendationMessage += `These are all ${category}s matching your preference. `;
    }
    if (seats) {
      recommendationMessage += `Each offers at least ${seats} seats. `;
    }

    recommendationMessage += `The top choice is the ${recommendedCars[0].brand} ${recommendedCars[0].model} at $${recommendedCars[0].price_pday}/day in ${recommendedCars[0].location}. Would you like to book one of these vehicles?`;

    res.json({
      success: true,
      cars: recommendedCars,
      recommendationMessage,
      count: recommendedCars.length,
      usingML: true,
      filters: { budget, category, seats, location }
    });

  } catch (error) {
    console.error('Recommendation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: error.message
    });
  }
};

export const mlClearHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    if (userId) {
      conversationHistory.delete(userId);
    }
    res.json({ success: true, message: 'Chat history cleared', usingML: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
