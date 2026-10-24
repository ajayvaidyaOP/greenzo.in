import { Router } from 'express';
import { getDb } from '../db/database.js';
import {
  hashPassword,
  verifyPassword,
  signToken,
  requireAuth
} from '../utils/authCrypto.js';

const router = Router();

router.post('/login', (req, res) => {
  const db = getDb();
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const userRow = db.prepare('SELECT * FROM users WHERE LOWER(email) = ?').get(cleanEmail);

  if (!userRow || !verifyPassword(password, userRow.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = signToken({ userId: userRow.id, role: userRow.role });
  res.json({
    token,
    user: {
      id: userRow.id,
      name: userRow.name,
      email: userRow.email,
      phone: userRow.phone,
      role: userRow.role,
      defaultAddress: userRow.default_address || '',
      defaultCity: userRow.default_city || 'Pune',
      defaultPincode: userRow.default_pincode || '411001'
    }
  });
});

router.post('/register', (req, res) => {
  const db = getDb();
  const {
    name,
    email,
    phone = '',
    password,
    defaultAddress = '',
    defaultCity = 'Pune',
    defaultPincode = '411001'
  } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(cleanEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
  }

  const passHash = hashPassword(password);
  const info = db
    .prepare(`
      INSERT INTO users (name, email, phone, password_hash, role, default_address, default_city, default_pincode)
      VALUES (?, ?, ?, ?, 'CUSTOMER', ?, ?, ?)
    `)
    .run(
      String(name).trim(),
      cleanEmail,
      String(phone).trim(),
      passHash,
      String(defaultAddress).trim(),
      String(defaultCity).trim(),
      String(defaultPincode).trim()
    );

  const userId = Number(info.lastInsertRowid);
  const token = signToken({ userId, role: 'CUSTOMER' });

  res.status(201).json({
    token,
    user: {
      id: userId,
      name: String(name).trim(),
      email: cleanEmail,
      phone: String(phone).trim(),
      role: 'CUSTOMER',
      defaultAddress: String(defaultAddress).trim(),
      defaultCity: String(defaultCity).trim(),
      defaultPincode: String(defaultPincode).trim()
    }
  });
});

router.get('/me', requireAuth, (req, res) => {
  const db = getDb();
  const orders = db
    .prepare(`
      SELECT * FROM orders
      WHERE user_id = ? OR (LOWER(customer_email) = LOWER(?) AND customer_email != '')
      ORDER BY id DESC
    `)
    .all(req.user.id, req.user.email)
    .map((o) => {
      const items = db
        .prepare('SELECT * FROM order_items WHERE order_id = ?')
        .all(o.id)
        .map((it) => ({
          id: it.id,
          productName: it.product_name,
          potColor: it.pot_color,
          potSize: it.pot_size,
          unitPrice: it.unit_price,
          quantity: it.quantity,
          isBundle: Boolean(it.is_bundle),
          bundleItems: it.bundle_items_json ? JSON.parse(it.bundle_items_json) : null
        }));
      return {
        id: o.id,
        orderNumber: o.order_number,
        totalAmount: o.total_amount,
        subtotal: o.subtotal,
        discountAmount: o.discount_amount,
        shippingFee: o.shipping_fee,
        paymentMethod: o.payment_method,
        paymentStatus: o.payment_status,
        razorpayPaymentId: o.razorpay_payment_id,
        status: o.status,
        city: o.city,
        pincode: o.pincode,
        shippingAddress: o.shipping_address,
        createdAt: o.created_at,
        items
      };
    });

  res.json({ user: req.user, orders });
});

router.put('/profile', requireAuth, (req, res) => {
  const db = getDb();
  const {
    name = req.user.name,
    phone = req.user.phone,
    defaultAddress = req.user.defaultAddress,
    defaultCity = req.user.defaultCity,
    defaultPincode = req.user.defaultPincode
  } = req.body || {};

  db.prepare(`
    UPDATE users
    SET name = ?, phone = ?, default_address = ?, default_city = ?, default_pincode = ?
    WHERE id = ?
  `).run(
    String(name).trim(),
    String(phone).trim(),
    String(defaultAddress).trim(),
    String(defaultCity).trim(),
    String(defaultPincode).trim(),
    req.user.id
  );

  res.json({
    user: {
      ...req.user,
      name: String(name).trim(),
      phone: String(phone).trim(),
      defaultAddress: String(defaultAddress).trim(),
      defaultCity: String(defaultCity).trim(),
      defaultPincode: String(defaultPincode).trim()
    }
  });
});

export default router;
