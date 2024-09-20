import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "redis";

// Load .env file from the root folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Setup Redis
const REDIS_HOST =
  process.env.NODE_ENV === "production" ? process.env.REDIS_HOST : "localhost";
const redisClient = createClient({
  host: REDIS_HOST,
  port: process.env.REDIS_PORT,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Setup express with middleware
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

const startServer = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");

    app.post("/try-on", async (req, res) => {
      const jobId = Date.now().toString();
      const { avatar, clothing } = req.body;

      // Add new job to Redis queue with name "try_on_queue", allows for FIFO
      console.log(
        "Adding new job to Redis queue: ",
        `${process.env.TRY_ON_QUEUE_NAME}`
      );
      await redisClient.rPush(
        `${process.env.TRY_ON_QUEUE_NAME}`,
        JSON.stringify({ jobId, avatar, clothing })
      );

      // Sets a key-value pair in redis of, key: job:{jobId} and value: {"status": "pending"}
      // Setting the initial status of the recently added job in a separate key-value table
      await redisClient.set(
        `${process.env.JOB_KEY_PREFIX}${jobId}`,
        JSON.stringify({ status: "pending" })
      );

      res.json({ jobId });
    });

    // Used to poll async Redis job queue tasks
    app.get("/job/:jobId", async (req, res) => {
      const { jobId } = req.params;
      const jobValue = await redisClient.get(
        `${process.env.JOB_KEY_PREFIX}${jobId}`
      );

      if (!jobValue) {
        return res.status(404).json({ error: "Job not found" });
      }

      const job = JSON.parse(jobValue);

      if (job.status === "completed") {
        res.json({ status: "completed", result: job.result });
      } else {
        res.json({ status: "pending" });
      }
    });

    app.listen(3001, () => console.log("Server running on port 3001"));
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown when node is interrupted (CTRL+C in terminal)
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully");
  await redisClient.quit();
  process.exit(0);
});

// Start the server
startServer();
