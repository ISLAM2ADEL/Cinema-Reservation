import express from "express";
import bookingController from "../controllers/bookingController.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, bookingController.createBooking);

export default router;
