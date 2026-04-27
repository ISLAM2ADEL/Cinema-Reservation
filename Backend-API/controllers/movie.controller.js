import { movieModel } from "../models/movieModel";

const getAllMovies = async (req, res) => {
    try {
        const { nowShowing } = req.query;

        const filters = {};

        if (nowShowing !== undefined) {
            filters.isNowShowing = nowShowing === "true";
        }

        const movies = await movieModel.find(filters);

        return res.status(200).json({
            count: movies.length,
            data: movies,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, });
    }
};

const getMovieById = async (req, res) => {
    try {
        const { movieId } = req.params;

        const movie = await movieModel.findById(movieId);

        if (!movie) {
            return res.status(404).json({
                message: "movie not found.",
            });
        }

        return res.status(200).json({
            data: movie,
        })
    } catch (error) {
        return res.status(500).json({ message: error.message, });
    }
};

const addMovie = async (req, res) => {
    try {
        const { title, description, duration, genre, rating, language, poster, releaseDate, isNowShowing, } = req.body;

        const existingMovie = await movieModel.findOne({ title: title });

        if (existingMovie) { return res.status(404).json({ message: "a movie with the same title already exists." }) };

        const movie = await Movie.create({ title, description, duration, genre, rating, language, poster, releaseDate, isNowShowing: isNowShowing || false, });

        return res.status(200).json({
            message: "movie created successfully.",
            data: movie
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        const updatedData = { ...req.body };
        delete updatedData._id;

        const movie = await movieModel.findByIdAndUpdate(movieId, updatedData, { new: true, runValidators: true });

        if (!movie) { return res.status(404).json({ message: "movie not found." }); }

        return res.status(200).json({
            message: "movie updated successfully.",
            data: movie,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        const movie = await movieModel.findByIdAndDelete(movieId);

        if (!movie) {
            return res.status(404).json({ message: "movie not found." });
        }

        return res.status(200).json({
            message: "movie deleted successfully."
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { addMovie, deleteMovie, getAllMovies, getMovieById, updateMovie };