import express from "express";
import { getAvailableSeats } from "../controllers/seat.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Seats
 *   description: Seat availability per showtime
 */

/**
 * @swagger
 * /api/v1/seats/{showTimeId}:
 *   get:
 *     summary: Get available seats for a showtime
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: showTimeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The showtime ID
 *       - in: query
 *         name: hallId
 *         required: true
 *         schema:
 *           type: string
 *         description: The hall ID to fetch seats from
 *     responses:
 *       200:
 *         description: Seat availability list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       seatNumber:
 *                         type: string
 *                       seatType:
 *                         type: string
 *                       isAvailable:
 *                         type: boolean
 */
router.get("/:showTimeId", getAvailableSeats);

export default router;
