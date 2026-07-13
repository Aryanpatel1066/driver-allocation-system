const { redis } = require("../config/redis");

const GEO_KEY = "drivers:geo";

async function updateDriverLocation(driverId, lng, lat) {
  await redis.geoAdd(GEO_KEY, {
    longitude: lng,
    latitude: lat,
    member: driverId.toString(),
  });
}

async function findNearbyDrivers(lat, lng, radius = 5) {
  return await redis.geoSearch(
    GEO_KEY,
    {
      longitude: lng,
      latitude: lat,
    },
    {
      radius,
      unit: "km",
    }
  );
}

module.exports = {
  updateDriverLocation,
  findNearbyDrivers,
};