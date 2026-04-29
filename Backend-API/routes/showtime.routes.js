import express from "express";
import {
  createShowtime,
  getAllShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
} from "../controllers/showtime.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Showtimes
 *   description: Showtime scheduling and management
 */

/**
 * @swagger
 * /showtimes:
 *   post:
 *     summary: Create a new showtime
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movie
 *               - hall
 *               - startTime
 *               - endTime
 *             properties:
 *               movie:
 *                 type: string
 *                 description: The MongoDB ID of the movie
 *               hall:
 *                 type: string
 *                 description: The MongoDB ID of the hall
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Example 2026-05-10T18:00:00Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Example 2026-05-10T20:30:00Z
 *               price:
 *                 type: number
 *                 description: Ticket price
 *     responses:
 *       201:
 *         description: Showtime created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", protect, authorize("admin"), createShowtime);

/**
 * @swagger
 * /showtimes:
 *   get:
 *     summary: Get all showtimes
 *     tags: [Showtimes]
 *     responses:
 *       200:
 *         description: List of showtimes
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllShowtimes);

/**
 * @swagger
 * /showtimes/{id}:
 *   get:
 *     summary: get showtime by id
 *     tags: [Showtimes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: showtime id
 *     responses:
 *       200:
 *         description: showtime retrieved successfully, including the complete array of seats and their isreserved status.
 *       404:
 *         description: showtime not found
 */
router.get("/:id", getShowtimeById);

/**
 * @swagger
 * /showtimes/{id}:
 *   put:
 *     summary: Update showtime
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Showtime ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Showtime updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Showtime not found
 */
router.put("/:id", protect, authorize("admin"), updateShowtime);

/**
 * @swagger
 * /showtimes/{id}:
 *   delete:
 *     summary: Delete showtime
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Showtime ID
 *     responses:
 *       200:
 *         description: Showtime deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Showtime not found
 */
router.delete("/:id", protect, authorize("admin"), deleteShowtime);

export default router;