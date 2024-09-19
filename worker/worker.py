import os
import time
import json
import base64
import redis
from dotenv import load_dotenv
from pathlib import Path

# Import your inference function (replace 'inference_script' with your actual script)
# from inference_script import run_inference

# Load .env file from the root folder
root_dir = Path(__file__).parent.parent
dotenv_path = root_dir / '.env'
load_dotenv(dotenv_path)

# Set up Redis connection
redis_host = 'localhost' if os.environ.get('NODE_ENV') != 'production' else os.environ.get('REDIS_HOST', 'redis')
redis_port = int(os.environ.get('REDIS_PORT', 6379))
redis_client = redis.Redis(host=redis_host, port=redis_port, db=0) # Connect to the first redis DB (0th index)

try:
    print(f"Connecting to Redis at {redis_host}:{redis_port}")
    redis_client.ping()
    print("Connected to Redis")
except redis.exceptions.ConnectionError as e:
    print("Cannot connect to Redis:", e)
    exit(1)

def run_inference(avatar_image_bytes, clothing_image_bytes):
    # TODO: Implement ML model inference logic here
    # For example:
    # - Load the images from bytes
    # - Process them with your ML model
    # - Return the result image as bytes

    # Placeholder implementation (just returns the avatar image)
    print('successful inference!')
    return avatar_image_bytes

def process_job(job_data):
    job = json.loads(job_data)
    job_id = job['jobId']
    avatar_base64 = job['avatar']
    clothing_base64 = job['clothing']
    
    print(f"Processing job {job_id}")
    
    # Decode base64 images
    avatar_image_bytes = base64.b64decode(avatar_base64)
    clothing_image_bytes = base64.b64decode(clothing_base64)
    
    # Run the ML inference (modify 'run_inference' according to your implementation)
    result_image_bytes = run_inference(avatar_image_bytes, clothing_image_bytes)
    
    # Encode the result image back to base64
    result_base64 = base64.b64encode(result_image_bytes).decode('utf-8')
    
    # Update job status and result in Redis
    job_result = {
        'status': 'completed',
        'result': result_base64
    }
    redis_client.set(os.environ.get('JOB_KEY_PREFIX') + job_id, json.dumps(job_result))
    print(f"Job {job_id} completed")

if __name__ == '__main__':
    print("Worker started. Waiting for jobs...")
    while True:
        try:
            # Wait for a job (blocking call with timeout)
            job_entry = redis_client.blpop(os.environ.get('TRY_ON_QUEUE_NAME'), timeout=5)
            if job_entry:
                _, job_data = job_entry
                process_job(job_data)
            else:
                # No job found within the timeout period
                time.sleep(1)
        except Exception as e:
            print("Error processing job:", e)
            time.sleep(5)