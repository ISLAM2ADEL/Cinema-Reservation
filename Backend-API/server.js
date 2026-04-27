import "dotenv/config";
import express from "express";
import cors from "cors";
import dns from "node:dns/promises";
import { connectDB } from "./config/dbConfig.js";
import { setupSwagger } from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import hallRoutes from "./routes/hall.routes.js";
import seatRoutes from "./routes/seat.routes.js";
import bookingRoutes from "./routes/bookingRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/halls", hallRoutes);
app.use("/api/v1/seats", seatRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("🎬 Cinema Reservation API — docs at /api-docs");
});

setupSwagger(app);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
