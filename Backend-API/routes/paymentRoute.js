import express from "express";
import paymentController from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Stripe payment integration for bookings
 */

/**
 * @swagger
 * /api/v1/payments/pay:
 *   post:
 *     summary: Create a Stripe payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, currency, bookingId]
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               bookingId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       400:
 *         description: Invalid amount or booking not found
 *       401:
 *         description: Unauthorized
 */
router.post("/pay", protect, paymentController.createPaymentIntent);

/**
 * @swagger
 * /api/v1/payments/confirm:
 *   post:
 *     summary: Confirm a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentId, bookingId, amount, currency]
 *             properties:
 *               paymentId:
 *                 type: string
 *               bookingId:
 *                 type: string
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       400:
 *         description: Invalid payment details
 *       401:
 *         description: Unauthorized
 */
router.post("/confirm", protect, paymentController.confirmPayment);

export default router;
