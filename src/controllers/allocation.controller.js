const Ride = require("../models/Ride");
const Driver = require("../models/Driver");
const { assignRide } = require("../services/allocation.service");

exports.acceptRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { driverId } = req.body;

    const result = await assignRide(rideId, driverId);

    switch (result.status) {
      case "SUCCESS": {
        await Promise.all([
          Ride.findByIdAndUpdate(rideId, {
            assignedDriverId: driverId,
            state: "ASSIGNED",
          }),

          Driver.findByIdAndUpdate(driverId, {
            status: "BUSY",
            currentRideId: rideId,
          }),
        ]);

        return res.status(200).json({
          success: true,
          message: "Ride Assigned Successfully",
          driverId,
        });
      }

      case "ALREADY_ASSIGNED_SELF":
        return res.status(200).json({
          success: true,
          message: "Ride already assigned to you",
          driverId,
        });

      case "ALREADY_ASSIGNED_OTHER":
        return res.status(409).json({
          success: false,
          message: "Ride already assigned",
          assignedDriver: result.driverId,
        });

      case "TIMEOUT":
        return res.status(409).json({
          success: false,
          message: "Ride expired",
        });

      default:
        return res.status(400).json({
          success: false,
          message: "Unable to assign ride",
        });
    }
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};