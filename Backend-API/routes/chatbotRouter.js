import express from "express";
import { handleCinemaChat } from "../controllers/chatbot.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: AI Cinema Assistant powered by OpenAI
 */

/**
 * @swagger
 * /chatbot:
 *   post:
 *     summary: Chat with the cinema AI assistant
 *     description: Send a message to the AI to ask about movies, showtimes, or bookings.
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's chat message
 *                 example: "What action movies are showing today?"
 *     responses:
 *       200:
 *         description: AI responded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reply:
 *                   type: string
 *                   description: The AI's response text
 *       400:
 *         description: Bad request (Missing message)
 *       500:
 *         description: Internal server error
 */
router.post("/", handleCinemaChat);

export default router;