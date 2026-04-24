import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dns from "dns";
import authRoutes from "./routes/auth.routes.js";
import hallRoutes from "./routes/hall.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to Cinema Reservation API");
});
app.use("/api/v1/halls", hallRoutes);


app.use("/api/v1/users", userRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
