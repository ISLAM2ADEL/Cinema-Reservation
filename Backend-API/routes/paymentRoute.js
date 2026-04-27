import express from "express";
import paymentController from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/pay", protect, paymentController.createPaymentIntent);
router.post("/confirm", protect, paymentController.confirmPayment);

export default router;
