import express from 'express';
import { chatWithAI, getRecommendations, clearChatHistory } from '../controllers/aicontroller.js';

const aiRouter = express.Router();

aiRouter.post('/chat', chatWithAI);
aiRouter.get('/recommendations', getRecommendations);
aiRouter.post('/clear-history', clearChatHistory);

export default aiRouter;
