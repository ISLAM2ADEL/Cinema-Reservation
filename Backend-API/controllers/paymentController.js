const stripe = require("../config/stripe");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const payment = await Payment.findOne({ booking: bookingId });
    if (!payment)
      return res.status(404).json({ message: "Payment record not found" });
    if (payment.status === "paid")
      return res.status(400).json({ message: "Already paid" });

    const booking = await Booking.findById(bookingId);
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(payment.amount * 100),
      currency: payment.currency.toLowerCase(),
      metadata: {
        bookingId: bookingId.toString(),
        paymentId: payment._id.toString(),
      },
    });

    payment.stripePaymentIntentId = paymentIntent.id;
    payment.stripeClientSecret = paymentIntent.client_secret;
    await payment.save();

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res
        .status(400)
        .json({
          message: "Payment not succeeded",
          status: paymentIntent.status,
        });
    }

    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
    });
    if (!payment)
      return res.status(404).json({ message: "Payment record not found" });

    payment.status = "paid";
    await payment.save();

    const booking = await Booking.findById(payment.booking);
    booking.status = "confirmed";
    await booking.save();

    res.json({ message: "Payment confirmed", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
