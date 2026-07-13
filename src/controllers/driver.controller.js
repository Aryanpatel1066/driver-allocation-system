const Driver = require("../models/Driver");
const { updateDriverLocation } = require("../services/geo.service");

exports.createDriver = async (req, res) => {
  try {
    const { name } = req.body;

    const driver = await Driver.create({ name });

    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;

    const driver = await Driver.findById(id);

    if (!driver) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }

    await updateDriverLocation(id, lng, lat);

    res.json({
      success: true,
      driverId: id,
      location: {
        lat,
        lng,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};