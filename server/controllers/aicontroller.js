import Anthropic from '@anthropic-ai/sdk';
import Car from '../models/Car.js';

const client = new Anthropic();

// Store conversation history for context
const conversationHistory = new Map();

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

        // Get system prompt with car data context
        const cars = await Car.find().lean();
        const carContext = cars.map(car => 
            `${car.brand} ${car.model} (${car.year}) - ${car.category} - $${car.price_pday}/day - ${car.location}`
        ).join('\n');

        const systemPrompt = `You are a helpful car rental assistant. You help customers find the perfect car for their needs.
Available cars:
${carContext}

Help customers by:
1. Recommending cars based on their budget, needs, and preferences
2. Answering questions about car features, pricing, and availability
3. Suggesting the best car for their use case

Be conversational and helpful. When recommending cars, always mention the price, location, and key features.`;

        // Call Claude API
        const response = await client.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: systemPrompt,
            messages: history
        });

        const assistantMessage = response.content[0].text;

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
            conversationId: userId
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

        // Use Claude to create personalized recommendation message
        const carDescriptions = recommendedCars.map((car, idx) => 
            `${idx + 1}. ${car.brand} ${car.model} (${car.year}) - ${car.category} - $${car.price_pday}/day - Seats: ${car.seating_capacity} - Location: ${car.location}`
        ).join('\n');

        const response = await client.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
            messages: [{
                role: 'user',
                content: `Based on these car rental options, provide a brief personalized recommendation message:\n${carDescriptions}`
            }]
        });

        const recommendationMessage = response.content[0].text;

        res.json({
            success: true,
            cars: recommendedCars,
            recommendationMessage,
            count: recommendedCars.length
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
