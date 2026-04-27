import express from "express";
import {
  addMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
} from "../controllers/movie.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management
 */

/**
 * @swagger
 * /api/v1/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: nowShowing
 *         schema:
 *           type: boolean
 *         description: Filter by now-showing status
 *     responses:
 *       200:
 *         description: List of movies
 */
router.get("/", getAllMovies);

/**
 * @swagger
 * /api/v1/movies/{movieId}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie data
 *       404:
 *         description: Not found
 */
router.get("/:movieId", getMovieById);

/**
 * @swagger
 * /api/v1/movies:
 *   post:
 *     summary: Add a movie (Admin only)
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, duration, genre, rating, language, poster, releaseDate]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *               rating:
 *                 type: string
 *               language:
 *                 type: string
 *               poster:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               isNowShowing:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Movie created
 */
router.post("/", protect, authorize("admin"), addMovie);

router.put("/:movieId", protect, authorize("admin"), updateMovie);
router.delete("/:movieId", protect, authorize("admin"), deleteMovie);

export default router;
