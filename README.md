# try-on-editor-ai

Still a work in progress, version 2 will be more private :)!

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

2. Start the server:

   - Ensure that Redis server is up and running in Docker
     - To turn the redis server on, you must go to the throwing-fits repository and run the docker-compose file.
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

Now your local environment should be up and running. The client will be available at `http://localhost:3000`, and the server will be running on `http://localhost:3001`.
