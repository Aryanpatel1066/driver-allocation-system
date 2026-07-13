require("dotenv").config();

const app = require("./app");

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 5000;

async function start() {
    await connectDB();

    await connectRedis();

    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
}

start();