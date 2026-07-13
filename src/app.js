
const express = require("express");

const driverRoutes = require("./routes/driver.routes");
const rideRoutes = require("./routes/ride.routes")
const allocationRoutes = require("./routes/allocationRoutes.routes");

const app = express();
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
app.use(express.json());

app.use("/api/drivers", driverRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/rides", allocationRoutes);

module.exports = app;