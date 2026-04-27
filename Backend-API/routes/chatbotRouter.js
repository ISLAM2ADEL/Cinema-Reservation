import express from 'express';
import { handleCinemaChat } from '../controllers/chatbot.controller.js';

const router = express.Router();

router.post('/', handleCinemaChat);

export default router;