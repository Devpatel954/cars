import Car from '../models/Car.js';

// Simple local NLP chatbot - no API keys required
// Uses pattern matching and keyword analysis for car rental assistance

const conversationHistory = new Map();

// Define car rental patterns and responses
const carRentalPatterns = {
  budget: {
    keywords: ['budget', 'cheap', 'affordable', 'cost', 'price', 'expensive', 'under', 'within', '$'],
    response: 'budget'
  },
  family: {
    keywords: ['family', 'kids', 'children', 'spacious', 'large', 'seats', 'space'],
    response: 'family'
  },
  luxury: {
    keywords: ['luxury', 'premium', 'high-end', 'elegant', 'comfortable', 'best'],
    response: 'luxury'
  },
  sports: {
    keywords: ['sports', 'fast', 'speed', 'performance', 'powerful', 'fun', 'drive'],
    response: 'sports'
  },
  economy: {
    keywords: ['economy', 'fuel', 'efficient', 'small', 'compact', 'gas'],
    response: 'economy'
  },
  availability: {
    keywords: ['available', 'rent', 'book', 'reserve', 'when', 'date'],
    response: 'availability'
  },
  features: {
    keywords: ['feature', 'specs', 'details', 'engine', 'capacity', 'what'],
    response: 'features'
  }
};

// Extract keywords from user message
const extractKeywords = (message) => {
  const lowerMessage = message.toLowerCase();
  const keywords = [];
  
  for (const [category, pattern] of Object.entries(carRentalPatterns)) {
    for (const keyword of pattern.keywords) {
      if (lowerMessage.includes(keyword)) {
        keywords.push(category);
        break;
      }
    }
  }
  
  return keywords;
};

// Extract numbers (like prices or seating capacity)
const extractNumbers = (message) => {
  const numbers = message.match(/\d+/g);
  return numbers ? numbers.map(Number) : [];
};

// Generate intelligent response based on context
const generateResponse = (message, cars, keywords, numbers) => {
  const userQuery = message.toLowerCase();
  
  // Budget-related queries
  if (keywords.includes('budget')) {
    const maxPrice = numbers[0] || 50;
    const budgetCars = cars.filter(car => car.price_pday <= maxPrice);
    if (budgetCars.length > 0) {
      return `Great! I found ${budgetCars.length} budget-friendly options for you under $${maxPrice}/day. Here are my top recommendations: ${budgetCars.slice(0, 2).map(c => `${c.brand} ${c.model} ($${c.price_pday}/day)`).join(', ')}. Would you like more details about any of these?`;
    }
    return "Let me show you our most affordable options! Our budget cars start from $30/day. Try browsing our vehicle list.";
  }
  
  // Family-related queries
  if (keywords.includes('family')) {
    const familyCars = cars.filter(car => car.category === 'SUV' || car.category === 'Van' || car.seating_capacity >= 7);
    if (familyCars.length > 0) {
      return `Perfect for families! I'd recommend our spacious vehicles. The ${familyCars[0].brand} ${familyCars[0].model} is excellent for family trips with ${familyCars[0].seating_capacity} seats and costs $${familyCars[0].price_pday}/day. We also have other great options!`;
    }
    return "For family trips, I recommend SUVs or vans for maximum space and comfort. Check our vehicle catalog for family-friendly options!";
  }
  
  // Luxury queries
  if (keywords.includes('luxury')) {
    const luxuryCars = cars.filter(car => car.price_pday >= 80 || car.category === 'Luxury');
    if (luxuryCars.length > 0) {
      return `Excellent choice! Our premium selection includes the ${luxuryCars[0].brand} ${luxuryCars[0].model} at $${luxuryCars[0].price_pday}/day. It offers premium comfort and style. Would you like to book it?`;
    }
    return "We have premium luxury vehicles available. Our high-end options offer exceptional comfort and elegance. Browse our collection!";
  }
  
  // Features/specs queries
  if (keywords.includes('features')) {
    const targetCar = cars[0];
    return `The ${targetCar.brand} ${targetCar.model} (${targetCar.year}) is a ${targetCar.category} with ${targetCar.seating_capacity} seats. It's priced at $${targetCar.price_pday}/day in ${targetCar.location}. It's a reliable choice for most travel needs. Interested in booking?`;
  }
  
  // General greeting/help
  if (userQuery.includes('hello') || userQuery.includes('hi') || userQuery.includes('help')) {
    return `Hello! 👋 I'm your AI car rental assistant. I can help you find the perfect car by your budget, preferences, and needs. You can ask me about:\n• Budget-friendly options\n• Family cars with lots of space\n• Luxury vehicles\n• Specific car details\n\nWhat are you looking for today?`;
  }
  
  // Default recommendation
  if (cars.length > 0) {
    const randomCar = cars[Math.floor(Math.random() * cars.length)];
    return `Looking for a great car? Check out the ${randomCar.brand} ${randomCar.model} - it's available at $${randomCar.price_pday}/day in ${randomCar.location}. It's a popular choice among our customers! Would you like to know more or book it?`;
  }
  
  return "I'm here to help you find the perfect rental car! Feel free to ask about our available vehicles, pricing, or features. What interests you?";
};

export const nlpChatWithAI = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ success: false, message: 'Message and userId required' });
    }

    // Get conversation history
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
      // Fetch available cars
      const cars = await Car.find().lean();

      // Analyze user message using NLP patterns
      const keywords = extractKeywords(message);
      const numbers = extractNumbers(message);

      // Generate intelligent response
      const assistantMessage = generateResponse(message, cars, keywords, numbers);

      // Add response to history
      history.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
      });

      // Keep last 20 messages
      if (history.length > 20) {
        history.shift();
      }

      res.json({
        success: true,
        message: assistantMessage,
        conversationId: userId,
        usingMockAI: false,
        isLocalNLP: true,
        keywords: keywords,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('NLP Processing Error:', error);
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

export const nlpGetRecommendations = async (req, res) => {
  try {
    const { budget, category, seats, location } = req.query;

    // Build filter query
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
        message: 'No cars match your criteria. Try adjusting your filters.',
        isLocalNLP: true
      });
    }

    // Generate NLP-based recommendation message
    let recommendationMessage = '';
    
    if (budget) {
      recommendationMessage = `Great! I found ${recommendedCars.length} cars within your $${budget}/day budget. `;
    }
    if (category) {
      recommendationMessage += `These are all ${category}s, perfect for your needs. `;
    }
    if (seats) {
      recommendationMessage += `Each has at least ${seats} seats for comfortable travel. `;
    }
    
    recommendationMessage += `The top recommendation is the ${recommendedCars[0].brand} ${recommendedCars[0].model} at $${recommendedCars[0].price_pday}/day in ${recommendedCars[0].location}. Ready to book?`;

    res.json({
      success: true,
      cars: recommendedCars,
      recommendationMessage,
      count: recommendedCars.length,
      isLocalNLP: true,
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

export const nlpClearHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    if (userId) {
      conversationHistory.delete(userId);
    }
    res.json({ success: true, message: 'Chat history cleared', isLocalNLP: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
