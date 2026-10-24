import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { config } from './config.js';
import { getDb } from './db/database.js';
import authRouter from './routes/auth.js';
import catalogRouter from './routes/catalog.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import paymentsRouter from './routes/payments.js';
import adminRouter from './routes/admin.js';
import engagementRouter from './routes/engagement.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Initialize SQLite database, uploads folder & seed data immediately on startup
const db = getDb();
fs.mkdirSync(config.uploadsDir, { recursive: true });

app.use(cors());
app.use(compression());
// 12 MB JSON payload limit to support smooth base64 photo uploads from Admin Panel
app.use(express.json({ limit: '12mb' }));

// Serve admin-uploaded product & gallery photos
app.use(
  '/uploads',
  express.static(config.uploadsDir, {
    maxAge: '7d'
  })
);

// Health check
app.get('/api/health', (_req, res) => {
  const count = db.prepare('SELECT COUNT(*) AS count FROM products').get();
  res.json({
    status: 'ok',
    service: 'greenzo-backend',
    database: 'sqlite-wal',
    catalogCount: count.count,
    timestamp: new Date().toISOString()
  });
});

// Core API routes
app.use('/api/auth', authRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api', engagementRouter);

// Serve built frontend in production if dist exists
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(
    express.static(frontendDist, {
      maxAge: '1h',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.mp4') || filePath.endsWith('.jpg')) {
          res.setHeader('Cache-Control', 'public, max-age=86400');
        }
      }
    })
  );
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error('[Greenzo API Error]', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(config.port, config.host, () => {
  console.log(`🌿 Greenzo.in Backend API listening on http://${config.host}:${config.port}`);
});
