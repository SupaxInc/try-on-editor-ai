import express from 'express';
import multer from 'multer';
// import Redis from 'redis';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// const redisClient = Redis.createClient();

// (async () => {
//   await redisClient.connect();
// })();

app.post('/try-on', upload.fields([{ name: 'avatar' }, { name: 'clothing' }]), async (req, res) => {
  const jobId = Date.now().toString();
  const avatarBuffer = req.files.avatar[0].buffer;
  const clothingBuffer = req.files.clothing[0].buffer;

  // await redisClient.rPush('ml_jobs', JSON.stringify({
  //   jobId,
  //   avatar: avatarBuffer.toString('base64'),
  //   clothing: clothingBuffer.toString('base64')
  // }));

  // res.json({ jobId });

  res.json({
    jobId,
    avatar: avatarBuffer.toString('base64'),
    clothing: clothingBuffer.toString('base64')
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