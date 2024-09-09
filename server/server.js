const express = require('express');
const multer = require('multer');
const Redis = require('redis');
const { promisify } = require('util');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const redisClient = Redis.createClient();
const rpush = promisify(redisClient.rpush).bind(redisClient);
const blpop = promisify(redisClient.blpop).bind(redisClient);

app.post('/try-on', upload.fields([{ name: 'avatar' }, { name: 'clothing' }]), async (req, res) => {
  const jobId = Date.now().toString();
  const avatarBuffer = req.files.avatar[0].buffer;
  const clothingBuffer = req.files.clothing[0].buffer;

  await rpush('ml_jobs', JSON.stringify({
    jobId,
    avatar: avatarBuffer.toString('base64'),
    clothing: clothingBuffer.toString('base64')
  }));

  res.json({ jobId });
});

app.get('/result/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const result = await blpop(`result:${jobId}`, 30);
    
    if (result) {
      res.json({ result: JSON.parse(result[1]) });
    } else {
      res.status(404).json({ error: 'Result not found or processing timeout' });
    }
  });
  
  app.listen(3000, () => console.log('Server running on port 3000'));