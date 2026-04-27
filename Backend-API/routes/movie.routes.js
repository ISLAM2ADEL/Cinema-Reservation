import express from "express";
import { addMovie, deleteMovie, getAllMovies, getMovieById, updateMovie } from "../controllers/movie.controller";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:movieId", getMovieById);
router.post("/", addMovie);
router.put("/:movieId", updateMovie);
router.delete("/:movieId", deleteMovie);

export { router };