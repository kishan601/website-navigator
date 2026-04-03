const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');

const createApp = () => {
  const app = express();
  const corsOrigin = process.env.CORS_ORIGIN;

  app.use(
    cors({
      origin: corsOrigin ? corsOrigin.split(',').map((origin) => origin.trim()) : '*',
    })
  );
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api', apiRoutes);

  const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
  if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));

    app.use((req, res, next) => {
      if (req.method !== 'GET') {
        return next();
      }

      if (req.path.startsWith('/api') || req.path === '/health') {
        return next();
      }

      return res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  }

  return app;
};

module.exports = {
  createApp,
};
