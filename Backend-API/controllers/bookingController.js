import Booking from "../models/bookingModel.js";
import Payment from "../models/paymentModel.js";
import Showtime from "../models/ShowtimeModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function checkSeatAvailability(showtimeId, desiredSeats) {
  const showtimeData = await Showtime.findById(showtimeId);
  if (!showtimeData) throw new Error("Showtime not found");
  
  const existingSeatIds = showtimeData.seats.map(seat => seat.id);
  const invalidSeats = desiredSeats.filter(id => !existingSeatIds.includes(id));
  
  if (invalidSeats.length > 0) {
      throw new Error(`Invalid seat selection: ${invalidSeats.join(', ')}`);
  }
  
  const takenSeats = showtimeData.seats
    .filter(seat => seat.isReserved && desiredSeats.includes(seat.id))
    .map(seat => seat.id);
    
  return takenSeats;
}

const createBooking = async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;
    const userId = req.user.id;

    const showtimeData = await Showtime.findById(showtimeId).populate("movie");
    if (!showtimeData)
      return res.status(404).json({ message: "Showtime not found" });

    const alreadyTaken = await checkSeatAvailability(showtimeId, seats);
    if (alreadyTaken.length > 0) {
      return res.status(409).json({
        message: "Some seats are already taken",
        takenSeats: alreadyTaken,
      });
    }

    showtimeData.seats.forEach(seat => {
      if (seats.includes(seat.id)) {
        seat.isReserved = true;
      }
    });
    await showtimeData.save();

    const totalPrice = seats.length * showtimeData.price;

    const booking = await Booking.create({
      user: userId,
      showtime: showtimeId,
      seats,
      totalPrice,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: "egp",
    });

    const payment = await Payment.create({
      booking: booking._id,
      amount: totalPrice,
      method: req.body.method || "card",
      status: "pending",
      stripePaymentIntentId: paymentIntent.id,
      stripeClientSecret: paymentIntent.client_secret
    });

    booking.payment = payment._id;
    await booking.save();

    res.status(201).json({
      message: "Booking created. Proceed to payment.",
      booking,
      paymentId: payment._id,
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const bookingData = await Booking.findById(id);
    if (!bookingData) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const showtimeData = await Showtime.findById(bookingData.showtime);
    if (showtimeData) {
      showtimeData.seats.forEach(seat => {
        if (bookingData.seats.includes(seat.id)) {
          seat.isReserved = false;
        }
      });
      await showtimeData.save();
    }

    const paymentData = await Payment.findOne({ booking: id });
    if (paymentData && paymentData.stripePaymentIntentId) {
      await stripe.refunds.create({
        payment_intent: paymentData.stripePaymentIntentId
      });
      paymentData.status = "refunded";
      await paymentData.save();
    }

    bookingData.status = "cancelled";
    await bookingData.save();

    res.status(200).json({ message: "Booking cancelled and refunded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { createBooking, deleteBooking };
