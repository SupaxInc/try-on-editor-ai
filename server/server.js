import express from 'express';
import cors from 'cors';
import multer from 'multer';
// import Redis from 'redis';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

//const upload = multer({ storage: multer.memoryStorage() });
// const redisClient = Redis.createClient();

// (async () => {
//   await redisClient.connect();
// })();

app.post('/try-on', (req, res) => {
  const jobId = Date.now().toString();
  const { avatar, clothing } = req.body;

  // await redisClient.rPush('ml_jobs', JSON.stringify({
  //   jobId,
  //   avatar,
  //   clothing
  // }));

  // res.json({ jobId });

  res.json({
    jobId,
    avatar,
    clothing
  });
});

// app.get('/result/:jobId', async (req, res) => {
//   const { jobId } = req.params;
//   const result = await redisClient.blPop(`result:${jobId}`, 30);
  
//   if (result) {
//     res.json({ result: JSON.parse(result.element) });
//   } else {
//     res.status(404).json({ error: 'Result not found or processing timeout' });
//   }
// });

app.listen(3001, () => console.log('Server running on port 3001'));