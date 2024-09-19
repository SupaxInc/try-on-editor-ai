# try-on-editor-ai

# Starting Local Environment

To start the local environment, follow these steps:

1. Start the client:

   - Navigate to the client directory:
     ```
     cd client/my-app
     ```
   - Install dependencies (if not already done):
     ```
     npm install
     ```
   - Start the development server:
     ```
     npm run dev
     ```

2. Start the Docker containers:

   - From the root directory of the project, run:
     ```
     docker compose up -d
     ```
     This will start the necessary containers (like Redis) in detached mode.

3. Start the server:

   - Navigate to the server directory:
     ```
     cd server
     ```
   - Install dependencies (if not already done):
     ```
     npm install
     ```
   - Start the server:
     ```
     node server.js
     ```

4. Start the worker:
   - Navigate to the worker directory:
     ```
     cd worker
     ```
   - If the virtual environment doesn't exist, create it and install dependencies:
     ```
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     pip install -r requirements.txt
     ```
   - If the virtual environment already exists, just activate it:
     ```
     source venv/Scripts/activate
     ```
   - Start the worker:
     ```
     python worker.py
     ```

Now your local environment should be up and running. The client will be available at `http://localhost:3000`, and the server will be running on `http://localhost:3001`.
