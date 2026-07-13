const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema(
  {
    riderId: {
      type: String,
      required: true,
    },

    pickup: {
      lat: Number,
      lng: Number,
    },

    assignedDriverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    state: {
      type: String,
      enum: [
        "REQUESTED",
        "SEARCHING",
        "ASSIGNED",
        "TIMEOUT",
        "CANCELLED"
      ],
      default: "REQUESTED",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ride", RideSchema);