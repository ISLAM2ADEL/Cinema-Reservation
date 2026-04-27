import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    hallId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hall",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    seatType: {
      type: String,
      required: true,
      enum: {
        values: ["Standard", "VIP"],
      },
      default: "Standard",
    },
  },
  {
    timestamps: true,
  },
);

const seatModel = mongoose.model("seat", seatSchema);

export { seatModel };
