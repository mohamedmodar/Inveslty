import express from 'express';
import { handleChat } from '../controllers/chatbotController';

export default (router: express.Router) => {
    router.post('/chatbot', handleChat);
}; 