import express from "express";
import bookingController from "../controllers/bookingController.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Seat reservation and booking
 */

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [showtimeId, seats]
 *             properties:
 *               showtimeId:
 *                 type: string
 *               seats:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid input or seats unavailable
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Showtime not found
 */
router.post("/", protect, bookingController.createBooking);

export default router;
