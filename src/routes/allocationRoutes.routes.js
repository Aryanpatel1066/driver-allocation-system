const router = require("express").Router();

const {
    acceptRide
} = require("../controllers/allocation.controller");

router.post("/:rideId/accept", acceptRide);

module.exports = router;