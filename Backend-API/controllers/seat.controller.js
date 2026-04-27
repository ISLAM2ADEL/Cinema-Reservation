import { seatModel } from "../models/seatModel";

const getAvailableSeats = async (req, res) => {
    try {
        // needing showtime api
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export { getAvailableSeats };