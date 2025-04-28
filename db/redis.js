const Redis = require("redis");
require("dotenv").config();

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis...");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
})();

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

module.exports = redisClient;
