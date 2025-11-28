import { GoogleGenAI } from '@google/genai';
import Car from '../models/Car.js';

const apiKey = process.env.GEMINI_API_KEY;
const client = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Store conversation history for context
const conversationHistory = new Map();

// Mock AI response for testing without API key
const getMockAIResponse = (message) => {
  const responses = [
    "I'd recommend checking our featured vehicles section! We have great options for budget-conscious travelers.",
    "Based on your needs, a Toyota Camry would be perfect - it's reliable, comfortable, and great on fuel!",
    "Our luxury sedans like the Mercedes C-Class offer premium comfort for special occasions.",
    "For family trips, our SUVs like the BMW X5 provide excellent space and safety features.",
    "I can help you find the perfect car! What's your budget and preferred vehicle type?",
    "Looking for something specific? Tell me about your travel plans and I'll suggest the best options."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

export const chatWithAI = async (req, res) => {
    try {
        const { message, userId } = req.body;

        if (!message || !userId) {
            return res.status(400).json({ success: false, message: 'Message and userId required' });
        }

        // Get conversation history for this user
        if (!conversationHistory.has(userId)) {
            conversationHistory.set(userId, []);
        }
        const history = conversationHistory.get(userId);

        // Add user message to history
        history.push({
            role: 'user',
            content: message
        });

        let assistantMessage;

        // Use Gemini if API key is available, otherwise use mock response
        if (client && apiKey && apiKey !== 'your_gemini_api_key_here') {
            try {
                const cars = await Car.find().lean();
                const carContext = cars.map(car => 
                    `${car.brand} ${car.model} (${car.year}) - ${car.category} - $${car.price_pday}/day - Seats: ${car.seating_capacity} - Location: ${car.location}`
                ).join('\n');

                const systemPrompt = `You are a helpful car rental assistant. You help customers find the perfect car for their needs.

AVAILABLE CARS:
${carContext}

INSTRUCTIONS:
1. Recommend cars based on budget, needs, and preferences
2. Always mention the price, location, and key features when recommending
3. Be conversational and helpful
4. If asked about specific cars, provide accurate details from the list above
5. Help with booking inquiries and answer questions about car features

Always respond in a friendly, professional manner.`;

                const fullMessage = `${systemPrompt}\n\nCustomer Question: ${message}`;

                const response = await client.models.generateContent({
                    model: 'gemini-1.5-flash',
                    contents: {
                        parts: [{ text: fullMessage }]
                    }
                });

                assistantMessage = response.response.text();
            } catch (apiError) {
                console.error('Gemini API error:', apiError.message);
                assistantMessage = getMockAIResponse(message);
            }
        } else {
            assistantMessage = getMockAIResponse(message);
        }

        // Add assistant response to history
        history.push({
            role: 'assistant',
            content: assistantMessage
        });

        // Keep only last 10 messages for context window
        if (history.length > 10) {
            history.shift();
        }

        res.json({
            success: true,
            message: assistantMessage,
            conversationId: userId,
            usingMockAI: !client || !apiKey || apiKey === 'your_gemini_api_key_here'
        });

    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process chat message',
            error: error.message
        });
    }
};

export const getRecommendations = async (req, res) => {
    try {
        const { budget, category, seats, location } = req.query;

        // Filter cars based on criteria
        let query = {};
        if (budget) query.price_pday = { $lte: parseInt(budget) };
        if (category) query.category = category;
        if (seats) query.seating_capacity = { $gte: parseInt(seats) };
        if (location) query.location = location;

        const recommendedCars = await Car.find(query)
            .limit(5)
            .lean();

        if (recommendedCars.length === 0) {
            return res.json({
                success: true,
                cars: [],
                message: 'No cars match your criteria. Try adjusting your filters.'
            });
        }

        let recommendationMessage;

        // Use Gemini if API key is available, otherwise use simple message
        if (client && apiKey && apiKey !== 'your_gemini_api_key_here') {
            try {
                const carDescriptions = recommendedCars.map((car, idx) => 
                    `${idx + 1}. ${car.brand} ${car.model} (${car.year}) - ${car.category} - $${car.price_pday}/day - Seats: ${car.seating_capacity} - Location: ${car.location}`
                ).join('\n');

                const prompt = `You are a car rental recommendation assistant. Based on these car rental options, provide a brief personalized recommendation message (2-3 sentences) that highlights why these cars are great choices:\n\nCARS:\n${carDescriptions}`;

                const response = await client.models.generateContent({
                    model: 'gemini-1.5-flash',
                    contents: {
                        parts: [{ text: prompt }]
                    }
                });

                recommendationMessage = response.response.text();
            } catch (apiError) {
                console.error('Gemini API error:', apiError.message);
                recommendationMessage = `Found ${recommendedCars.length} great cars matching your criteria!`;
            }
        } else {
            recommendationMessage = `Found ${recommendedCars.length} great cars matching your criteria! Check them out below.`;
        }

        res.json({
            success: true,
            cars: recommendedCars,
            recommendationMessage,
            count: recommendedCars.length,
            usingMockAI: !client || !apiKey || apiKey === 'your_gemini_api_key_here'
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

export const clearChatHistory = async (req, res) => {
    try {
        const { userId } = req.body;
        if (userId) {
            conversationHistory.delete(userId);
        }
        res.json({ success: true, message: 'Chat history cleared' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
