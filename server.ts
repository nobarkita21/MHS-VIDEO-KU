import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
const PORT = 3000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Proxy for Telegram Upload
app.post('/api/upload', async (req, res) => {
  try {
    const { fileData, fileName, isVideo } = req.body;
    const buffer = Buffer.from(fileData.split(',')[1], 'base64');
    
    // Create form data manually for Telegram
    const formData = new FormData();
    const blob = new Blob([buffer], { type: isVideo ? 'video/mp4' : 'image/jpeg' });
    formData.append(isVideo ? 'video' : 'photo', blob, fileName);
    formData.append('chat_id', TELEGRAM_CHAT_ID!);

    const method = isVideo ? 'sendVideo' : 'sendPhoto';
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    const result = response.data.result;
    const fileId = isVideo ? result.video.file_id : result.photo[result.photo.length - 1].file_id;

    // Get file path for direct URL (optional, or just return fileId)
    const pathResponse = await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`);
    const filePath = pathResponse.data.result.file_path;
    const directUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;

    res.json({ success: true, fileId, directUrl });
  } catch (error: any) {
    console.error('Telegram Upload Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sitemap generator
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${process.env.APP_URL}</loc></url>
</urlset>`);
});

// Ads.txt
app.get('/ads.txt', (req, res) => {
  res.send('google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0');
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Basic OG injection would happen here by reading index.html and replacing tags
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
