import { Router } from 'express';
import { getDb } from '../db/database.js';
import { evaluateCouponFromDb } from './orders.js';

const router = Router();

function formatAddDays(minDays, maxDays) {
  const fmt = (d) =>
    d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const d1 = new Date(Date.now() + minDays * 86400000);
  if (!maxDays || maxDays === minDays) return fmt(d1);
  const d2 = new Date(Date.now() + maxDays * 86400000);
  return `${fmt(d1)} – ${fmt(d2)}`;
}

router.get('/serviceability/:pincode', (req, res) => {
  const pin = String(req.params.pincode || '').replace(/\D/g, '');
  if (!/^[1-8][0-9]{5}$/.test(pin)) {
    return res.status(400).json({
      serviceable: false,
      error: 'Please enter a valid 6-digit Indian pincode (e.g. 411001).'
    });
  }

  const p3 = pin.slice(0, 3);
  const p2 = Number(pin.slice(0, 2));

  let city = 'India';
  let zone = 'Pan-India Safe Pod';
  let dispatchBadge = 'Ventilated Honeycomb Pod';
  let minDays = 4;
  let maxDays = 6;

  if (p3 === '411' || p3 === '412') {
    city = 'Pune / PCMC';
    zone = 'Pune Nursery Direct';
    dispatchBadge = 'Same-Day Dispatch from Theur';
    minDays = 1;
    maxDays = 1;
  } else if (['400', '401', '410'].includes(p3)) {
    city = 'Mumbai / Thane / Navi Mumbai';
    zone = 'Western Express Corridor';
    dispatchBadge = 'Next-Day Express Transit';
    minDays = 1;
    maxDays = 2;
  } else if (p2 >= 41 && p2 <= 44) {
    city = 'Maharashtra';
    zone = 'Maharashtra Priority';
    dispatchBadge = 'Direct Road-Pod Transit';
    minDays = 2;
    maxDays = 3;
  } else if (
    ['110', '122', '201', '560', '500', '600', '380', '395', '302', '700', '452', '226', '682'].includes(p3)
  ) {
    const metroMap = {
      '110': 'New Delhi',
      '122': 'Gurugram',
      '201': 'Noida / NCR',
      '560': 'Bengaluru',
      '500': 'Hyderabad',
      '600': 'Chennai',
      '380': 'Ahmedabad',
      '395': 'Surat',
      '302': 'Jaipur',
      '700': 'Kolkata',
      '452': 'Indore',
      '226': 'Lucknow',
      '682': 'Kochi'
    };
    city = metroMap[p3] || 'Metro City';
    zone = 'Metro Air-Corridor';
    dispatchBadge = 'Air-Express Honeycomb Pod';
    minDays = 3;
    maxDays = 4;
  }

  res.json({
    serviceable: true,
    pincode: pin,
    city,
    zone,
    dispatchBadge,
    minDays,
    maxDays,
    etaRange: formatAddDays(minDays, maxDays),
    etaLabel:
      minDays === 1 && maxDays === 1
        ? `Tomorrow (${formatAddDays(1, 1)})`
        : `${minDays}–${maxDays} Days (${formatAddDays(minDays, maxDays)})`,
    codAvailable: true,
    freeAbove: 499,
    livePhotoProof: true
  });
});

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
