import express from 'express';
import { nlpChatWithAI, nlpGetRecommendations, nlpClearHistory } from '../controllers/nlpChatbot.js';

const router = express.Router();

// Chat endpoint
router.post('/chat', nlpChatWithAI);

// Recommendations endpoint
router.get('/recommendations', nlpGetRecommendations);

// Clear history endpoint
router.post('/clear-history', nlpClearHistory);

export default router;
