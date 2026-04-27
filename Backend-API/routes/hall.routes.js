import express from "express";
import {
  createHall,
  getAllHalls,
  deleteHall,
} from "../controllers/hall.controller.js";

import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Halls
 *   description: Hall management APIs
 */

/**
 * @swagger
 * /api/v1/halls:
 *   post:
 *     summary: Create a new hall (Admin only)
 *     tags: [Halls]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, totalSeats]
 *             properties:
 *               name:
 *                 type: string
 *               totalSeats:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [Standard, VIP, 3D]
 *     responses:
 *       201:
 *         description: Hall created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post("/", protect, authorize("admin"), createHall);

/**
 * @swagger
 * /api/v1/halls:
 *   get:
 *     summary: Get all halls
 *     tags: [Halls]
 *     responses:
 *       200:
 *         description: List of halls
 */
router.get("/", getAllHalls);

/**
 * @swagger
 * /api/v1/halls/{id}:
 *   delete:
 *     summary: Delete a hall by ID (Admin only)
 *     tags: [Halls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hall deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Hall not found
 */
router.delete("/:id", protect, authorize("admin"), deleteHall);
export default router;
