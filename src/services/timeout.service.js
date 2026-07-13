const Ride = require("../models/Ride");
const { redis } = require("../config/redis");
const { notifyDrivers } = require("./notification.service");
const { findNearbyDrivers } = require("./geo.service");
const { getAvailableDrivers } = require("./driver.service");

async function retryRideAllocation(rideId) {
  const ride = await Ride.findById(rideId);

  if (!ride) return;

  if (ride.state === "ASSIGNED") return;

  const notifiedKey = `ride:${rideId}:candidates`;

  const notifiedDrivers = await redis.sMembers(notifiedKey);

  const nearby = await findNearbyDrivers(
    ride.pickup.lat,
    ride.pickup.lng,
    5
  );

  const available = await getAvailableDrivers(nearby);

  const remaining = available.filter(
    (driver) =>
      !notifiedDrivers.includes(driver._id.toString())
  );

  const nextDrivers = remaining
    .slice(0, 5)
    .map((driver) => driver._id.toString());

  if (nextDrivers.length === 0) {
    ride.state = "TIMEOUT";
    await ride.save();

    await redis.hSet(`ride:${rideId}`, {
      status: "TIMEOUT",
    });

    console.log("Ride timeout");

    return;
  }

  console.log("Retry allocation:", nextDrivers);

  await notifyDrivers(rideId, nextDrivers);

  setTimeout(() => {
    retryRideAllocation(rideId);
  }, 60000);
}

async function startRideTimeout(rideId) {
  setTimeout(() => {
    retryRideAllocation(rideId);
  }, 15000);
}

module.exports = {
  startRideTimeout,
};