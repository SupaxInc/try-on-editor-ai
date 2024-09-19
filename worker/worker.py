import os
import time
import json
import base64
import redis
from dotenv import load_dotenv
from pathlib import Path

# TODO: Import your inference function (replace 'inferenceScript' with your actual script)
# from inferenceScript import runInference

# Load .env file from the root folder
rootDir = Path(__file__).parent.parent
dotenvPath = rootDir / '.env'
load_dotenv(dotenvPath)

# Set up Redis connection
redisHost = 'localhost' if os.environ.get('NODE_ENV') != 'production' else os.environ.get('REDIS_HOST', 'redis')
redisPort = int(os.environ.get('REDIS_PORT', 6379))
redisClient = redis.Redis(host=redisHost, port=redisPort, db=0) # Connect to the first redis DB (0th index)

try:
    print(f"Connecting to Redis at {redisHost}:{redisPort}")
    redisClient.ping()
    print("Connected to Redis")
except redis.exceptions.ConnectionError as e:
    print("Cannot connect to Redis:", e)
    exit(1)

def runInference(avatarImageBytes, clothingImageBytes):
    # TODO: Implement ML model inference logic here
    # For example:
    # - Load the images from bytes
    # - Process them with your ML model
    # - Return the result image as bytes

    # Placeholder implementation (just returns the avatar image)
    print('successful inference!')
    return avatarImageBytes

def processJob(jobData):
    job = json.loads(jobData)
    jobId = job['jobId']
    avatarBase64 = job['avatar']
    clothingBase64 = job['clothing']
    
    print(f"Processing job {jobId}")
    
    # Decode base64 images
    avatarImageBytes = base64.b64decode(avatarBase64)
    clothingImageBytes = base64.b64decode(clothingBase64)
    
    # Run the ML inference (modify 'runInference' according to your implementation)
    resultImageBytes = runInference(avatarImageBytes, clothingImageBytes)
    
    # Encode the result image back to base64
    resultBase64 = base64.b64encode(resultImageBytes).decode('utf-8')
    resultBase64 = 'test' # TODO: Remove this test when proper inference has been placed
    
    # Update job status and result in Redis
    jobResult = {
        'status': 'completed',
        'result': resultBase64
    }
    redisClient.set(os.environ.get('JOB_KEY_PREFIX') + jobId, json.dumps(jobResult))
    print(f"Job {jobId} completed")

if __name__ == '__main__':
    print("Worker started. Waiting for jobs...")
    while True:
        try:
            # Blocking operation to wait for a job, only returns a job if it finds one or else it times out
            jobEntry = redisClient.blpop(os.environ.get('TRY_ON_QUEUE_NAME'), timeout=5)
            if jobEntry:
                _, jobData = jobEntry
                processJob(jobData)
            else:
                print('No job found! Sleeping...')
                # No job found within the timeout period
                time.sleep(1)
        except Exception as e:
            print("Error processing job:", e)
            time.sleep(5)