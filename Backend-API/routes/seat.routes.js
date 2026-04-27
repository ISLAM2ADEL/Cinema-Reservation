import express from "express";
import { getAvailableSeats } from "../controllers/seat.controller";

const router = express.Router();

router.get("/:showTimeId", getAvailableSeats);

export { router };