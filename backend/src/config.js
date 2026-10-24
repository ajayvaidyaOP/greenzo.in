import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: Number(process.env.PORT || 4000),
  host: process.env.HOST || '0.0.0.0',
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../data/greenzo.sqlite'),
  uploadsDir: process.env.UPLOADS_DIR || path.resolve(__dirname, '../uploads'),
  jwtSecret: process.env.JWT_SECRET || 'greenzo-pune-nursery-hmac-secret-2026',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  freeShippingThreshold: 499,
  standardShippingFee: 69,
  comboBundlePrice: 999,
  comboBundleSize: 4
};
