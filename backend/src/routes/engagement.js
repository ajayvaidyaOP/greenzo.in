import { Router } from 'express';
import { getDb } from '../db/database.js';
import { evaluateCouponFromDb } from './orders.js';

const router = Router();

router.post('/coupons/validate', (req, res) => {
  const db = getDb();
  const { code, subtotal = 0 } = req.body || {};
  const result = evaluateCouponFromDb(code, Number(subtotal), db);
  if (!result.valid) {
    return res.status(400).json({ valid: false, error: result.error || 'Invalid coupon code' });
  }
  res.json({
    valid: true,
    code: result.coupon.code,
    label: result.coupon.label,
    discount: result.discount
  });
});

router.post('/consultations', (req, res) => {
  const db = getDb();
  const {
    name,
    phone,
    email = '',
    spaceType = 'Living Room',
    lightCondition = 'Medium Indirect Light',
    preferredSlot = 'Tomorrow • 11:00 AM – 1:00 PM',
    message = ''
  } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: 'Please share your name and WhatsApp / phone number.' });
  }

  const stmt = db.prepare(`
    INSERT INTO consultations (name, phone, email, space_type, light_condition, message, preferred_slot)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    String(name).trim(),
    String(phone).trim(),
    String(email).trim(),
    String(spaceType).trim(),
    String(lightCondition).trim(),
    String(message).trim(),
    String(preferredSlot).trim()
  );

  res.status(201).json({
    booking: {
      id: Number(result.lastInsertRowid),
      reference: `CONS-${1000 + Number(result.lastInsertRowid)}`,
      name: String(name).trim(),
      preferredSlot
    }
  });
});

router.post('/newsletter', (req, res) => {
  const db = getDb();
  const { email } = req.body || {};
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  const cleanEmail = String(email).trim().toLowerCase();
  db.prepare('INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)').run(cleanEmail);
  res.status(201).json({
    subscribed: true,
    email: cleanEmail,
    welcomeCoupon: 'GREENZO10'
  });
});

router.post('/reviews', (req, res) => {
  const db = getDb();
  const {
    customerName,
    city = 'Pune',
    rating = 5,
    comment,
    plantPurchased = 'Zamia Green (ZZ Plant)'
  } = req.body || {};
  if (!customerName || !comment) {
    return res.status(400).json({ error: 'Name and review comment are required.' });
  }
  const cleanName = String(customerName).trim();
  const initials = cleanName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || 'G')
    .join('');

  const safeRating = Math.max(1, Math.min(5, Number(rating || 5)));

  const info = db
    .prepare(`
      INSERT INTO reviews (customer_name, city, rating, comment, plant_purchased, verified, avatar_initials)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `)
    .run(
      cleanName,
      String(city).trim(),
      safeRating,
      String(comment).trim(),
      String(plantPurchased).trim(),
      initials
    );

  res.status(201).json({
    review: {
      id: Number(info.lastInsertRowid),
      customerName: cleanName,
      city: String(city).trim(),
      rating: safeRating,
      comment: String(comment).trim(),
      plantPurchased: String(plantPurchased).trim(),
      verified: true,
      avatarInitials: initials
    }
  });
});

export default router;
