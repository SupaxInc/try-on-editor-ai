import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || "redis";

const redisClient = createClient({
  host: REDIS_HOST,
  port: process.env.REDIS_PORT,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
await redisClient.connect();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.post("/try-on", (req, res) => {
  // TODO: Possibly use this for Redis job queue ID in the future
  const jobId = Date.now().toString();

  const { avatar, clothing } = req.body;

  res.json({
    jobId,
    avatar,
    clothing,
  });
});

await redisClient.disconnect();
app.listen(3001, () => console.log("Server running on port 3001"));
