import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

app.post('/try-on', (req, res) => {
  // TODO: Possibly use this for Redis job queue ID in the future
  const jobId = Date.now().toString();

  const { avatar, clothing } = req.body;

  res.json({
    jobId,
    avatar,
    clothing
  });
});

app.listen(3001, () => console.log('Server running on port 3001'));