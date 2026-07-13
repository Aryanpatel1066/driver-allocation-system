const { redis } = require("../config/redis");

async function notifyDrivers(rideId, driverIds) {
  const key = `ride:${rideId}:candidates`;

  if (driverIds.length) {
    await redis.sAdd(key, driverIds);
  }

  await redis.expire(key, 300);

  console.log("Drivers notified:", driverIds);
}

module.exports = {
  notifyDrivers,
};