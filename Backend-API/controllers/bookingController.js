import Booking from "../models/bookingModel.js";
import Payment from "../models/paymentModel.js";

async function checkSeatAvailability(showtimeId, desiredSeats) {
  const bookings = await Booking.find({
    showtime: showtimeId,
    status: { $ne: "cancelled" },
  }).select("seats");

  const takenSeats = bookings.flatMap((b) => b.seats);
  return desiredSeats.filter((seat) => takenSeats.includes(seat));
}

const createBooking = async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;
    const userId = req.user.id;

    const showtime = await Showtime.findById(showtimeId).populate("movie");
    if (!showtime)
      return res.status(404).json({ message: "Showtime not found" });

    const alreadyTaken = await checkSeatAvailability(showtimeId, seats);
    if (alreadyTaken.length > 0) {
      return res.status(409).json({
        message: "Some seats are already taken",
        takenSeats: alreadyTaken,
      });
    }

    const totalPrice = seats.length * showtime.price;

    const booking = await Booking.create({
      user: userId,
      showtime: showtimeId,
      seats,
      totalPrice,
    });

    const payment = await Payment.create({
      booking: booking._id,
      amount: totalPrice,
      method: req.body.method || "card",
      status: "pending",
    });

    booking.payment = payment._id;
    await booking.save();

    res.status(201).json({
      message: "Booking created. Proceed to payment.",
      booking,
      paymentId: payment._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { createBooking };
