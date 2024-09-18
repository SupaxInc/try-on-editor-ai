import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

// Setup Redis
const REDIS_HOST = process.env.REDIS_HOST || "redis";
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
      await redisClient.rPush(
        "try_on_queue",
        JSON.stringify({ jobId, avatar, clothing })
      );

      // Sets a key-value pair in redis of, key: job:{jobId} and value: {"status": "pending"}
      // Setting the initial status of the recently added job in a separate key-value table
      await redisClient.set(
        `job:${jobId}`,
        JSON.stringify({ status: "pending" })
      );

      res.json({
        jobId,
        avatar,
        clothing,
      });
    });

    // Used to poll async Redis job queue tasks
    app.get("/job/:jobId", async (req, res) => {
      const { jobId } = req.params;
      const newAvatarImage = await redisClient.get(`job:${jobId}`); // Grab the value of the job ID key
      console.log(newAvatarImage);
      if (!newAvatarImage) {
        return res.status(404).json({ error: "Job not found" });
      }

      const job = JSON.parse(newAvatarImage);

      if (job.status === "completed") {
        res.json({ status: "completed", result: job.result });
      } else {
        res.json({ status: "pending" });
      }
    });

    app.listen(3001, () => console.log("Server running on port 3001"));

    // Start processing jobs
    processJobs();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
};

// This function simulates processing jobs from the queue
// TODO: Replace this with a python worker
const processJobs = async () => {
  while (true) {
    try {
      // Removes the first job that was in from queue "try_on_queue"
      const job = await redisClient.lPop("try_on_queue");

      if (job) {
        const { jobId } = JSON.parse(job);
        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Update job status to completed with a mock result
        await redisClient.set(
          `job:${jobId}`,
          JSON.stringify({
            status: "completed",
            result: "https://example.com/processed-image.jpg",
          })
        );
      } else {
        // If no jobs in queue, wait before checking again
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Error processing job:", error);
      // Wait a bit before trying again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
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
