const Driver = require("../models/Driver");

async function createDriver(name) {
  return Driver.create({
    name,
  });
}

async function getDriver(driverId) {
  return Driver.findById(driverId);
}

async function getAvailableDrivers(driverIds) {
  return Driver.find({
    _id: { $in: driverIds },
    status: "AVAILABLE",
  });
}

module.exports = {
  createDriver,
  getDriver,
  getAvailableDrivers,
};