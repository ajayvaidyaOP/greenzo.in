import crypto from 'node:crypto';
import { config } from '../config.js';
import { getDb } from '../db/database.js';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, keyHex] = storedHash.split(':');
  const keyBuf = Buffer.from(keyHex, 'hex');
  const derived = crypto.scryptSync(String(password), salt, 64);
  if (keyBuf.length !== derived.length) return false;
  return crypto.timingSafeEqual(keyBuf, derived);
}

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str) {
  let pad = str.replace(/-/g, '+').replace(/_/g, '/');
  while (pad.length % 4) pad += '=';
  return Buffer.from(pad, 'base64').toString('utf8');
}

export function signToken(payload, expiresInSeconds = 7 * 86400) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const body = base64UrlEncode(JSON.stringify({ ...payload, exp }));
  const sig = crypto
    .createHmac('sha256', config.jwtSecret)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', config.jwtSecret)
    .update(`${header}.${body}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const decoded = JSON.parse(base64UrlDecode(body));
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function extractUserFromRequest(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  const payload = verifyToken(token);
  if (!payload?.userId) return null;
  const db = getDb();
  const row = db
    .prepare(
      'SELECT id, name, email, phone, role, default_address, default_city, default_pincode, created_at FROM users WHERE id = ?'
    )
    .get(payload.userId);
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    defaultAddress: row.default_address || '',
    defaultCity: row.default_city || 'Pune',
    defaultPincode: row.default_pincode || '411001',
    createdAt: row.created_at
  };
}

export function requireAuth(req, res, next) {
  const user = extractUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Please sign in to continue.' });
  }
  req.user = user;
  next();
}

export function requireAdmin(req, res, next) {
  const user = extractUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ error: 'Admin login required.' });
  }
  if (user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Administrator privileges required.' });
  }
  req.user = user;
  next();
}
