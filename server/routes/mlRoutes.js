import express from 'express';
import { mlChatWithAI, mlGetRecommendations, mlClearHistory } from '../controllers/mlChatbot.js';

const router = express.Router();

// Chat endpoint with Hugging Face ML
router.post('/chat', mlChatWithAI);

// Recommendations endpoint with ML
router.get('/recommendations', mlGetRecommendations);

// Clear history endpoint
router.post('/clear-history', mlClearHistory);

export default router;
