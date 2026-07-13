const Ride = require("../models/Ride");

async function createRide(riderId, pickup) {

    return Ride.create({
        riderId,
        pickup,
        state: "SEARCHING"
    });

}

module.exports = {
    createRide
};