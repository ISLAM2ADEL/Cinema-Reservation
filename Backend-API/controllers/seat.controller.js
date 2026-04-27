import { seatModel } from "../models/seat.model.js";
import Booking from "../models/bookingModel.js";

const getAvailableSeats = async (req, res) => {
  try {
    const { showTimeId } = req.params;
    const { hallId } = req.query;

    if (!hallId)
      return res
        .status(400)
        .json({ message: "hallId query param is required" });

    const allSeats = await seatModel.find({ hallId });

    const bookings = await Booking.find({
      showtime: showTimeId,
      status: { $ne: "cancelled" },
    }).select("seats");

    const takenSeatNumbers = bookings.flatMap((b) => b.seats);

    const result = allSeats.map((seat) => ({
      seatNumber: seat.seatNumber,
      seatType: seat.seatType,
      isAvailable: !takenSeatNumbers.includes(seat.seatNumber),
    }));

    return res.status(200).json({ count: result.length, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getAvailableSeats };
