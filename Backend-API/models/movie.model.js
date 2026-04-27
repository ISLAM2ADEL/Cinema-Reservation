import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        genre: {
            type: [String],
            required: true,
            enum: {
                values: ['Action', 'Drama', 'Comedy', 'Horror', 'Thriller', 'Sci-Fi', 'Romance', 'Animation', 'Documentary', 'Adventure', 'Fantasy', 'Mystery', 'Crime',]
            }
        },
        rating: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        poster: {
            type: String,
            required: true,
        },
        releaseDate: {
            type: Date,
            required: true,
        },
        isNowShowing: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const movieModel = mongoose.model("Movie", movieSchema);

export { movieModel };