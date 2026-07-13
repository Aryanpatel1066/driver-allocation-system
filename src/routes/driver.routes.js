const router = require("express").Router();

const {
  createDriver,
  updateLocation,
} = require("../controllers/driver.controller");

router.post("/", createDriver);

router.put("/:id/location", updateLocation);

module.exports = router;