const { createRide } = require("../services/ride.service");
const { redis } = require("../config/redis");

const {
    findNearbyDrivers,
} = require("../services/geo.service");
const {
    startRideTimeout
} = require("../services/timeout.service");
const {
    getAvailableDrivers,
} = require("../services/driver.service");

const {
    notifyDrivers,
} = require("../services/notification.service");

exports.requestRide = async (req, res) => {

    try {

        const { riderId, lat, lng } = req.body;


        const ride = await createRide(
            riderId,
            { lat, lng }
        );
        await redis.hSet(`ride:${ride._id}`, {
            status: "SEARCHING",
            assignedDriver: ""
        });
        await redis.expire(`ride:${ride._id}`, 300);

        const nearbyDriverIds =
            await findNearbyDrivers(lat, lng, 5);
console.log("Nearby Drivers:", nearbyDriverIds);

        const availableDrivers =
            await getAvailableDrivers(
                nearbyDriverIds
            );
console.log("Nearby Drivers:", nearbyDriverIds);

        const selectedDrivers =
            availableDrivers
                .slice(0, 5)
                .map(d => d._id.toString());

        await notifyDrivers(
            ride._id.toString(),
            selectedDrivers
        );
        await startRideTimeout(
            ride._id,
            ride.pickup
        );

        res.status(201).json({

            message: "Searching Drivers",

            ride,

            notifiedDrivers: selectedDrivers

        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};