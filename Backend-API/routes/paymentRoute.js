const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/pay", protect, paymentController.createPaymentIntent);
router.post("/confirm", protect, paymentController.confirmPayment);

module.exports = router;
