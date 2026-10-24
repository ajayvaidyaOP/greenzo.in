import { Router } from 'express';
import { getDb, getStoreSettings } from '../db/database.js';
import { extractUserFromRequest } from '../utils/authCrypto.js';

const router = Router();

export function evaluateCouponFromDb(rawCode, subtotal, db = getDb()) {
  if (!rawCode || !String(rawCode).trim()) {
    return { valid: false, discount: 0, coupon: null };
  }
  const code = String(rawCode).trim().toUpperCase();
  const row = db
    .prepare('SELECT * FROM coupons WHERE UPPER(code) = ? AND is_active = 1')
    .get(code);

  if (!row) {
    return { valid: false, discount: 0, error: `Offer code "${code}" is invalid or expired.` };
  }
  if (subtotal < row.min_subtotal) {
    return {
      valid: false,
      discount: 0,
      error: `Add ₹${row.min_subtotal - subtotal} more to unlock ${row.code} (Min ₹${row.min_subtotal}).`
    };
  }
  const discount =
    row.type === 'percent'
      ? Math.round((subtotal * Number(row.value)) / 100)
      : Math.min(subtotal, Number(row.value));

  return {
    valid: true,
    discount,
    coupon: {
      id: row.id,
      code: row.code,
      type: row.type,
      value: row.value,
      minSubtotal: row.min_subtotal,
      label: row.label
    }
  };
}

export function calculateCartPricing(items = [], couponCode = '', db = getDb()) {
  const settings = getStoreSettings(db);
  const comboPrice = Number(settings.comboBundlePrice || 999);
  const comboSize = Number(settings.comboBundleSize || 4);
  const freeShipAt = Number(settings.freeShippingThreshold || 499);
  const stdShip = Number(settings.standardShippingFee || 69);

  let subtotal = 0;
  const normalizedItems = [];

  for (const item of items) {
    const qty = Math.max(1, Math.min(20, Number(item.quantity || 1)));

    if (item.isBundle) {
      const unitPrice = comboPrice;
      subtotal += unitPrice * qty;
      normalizedItems.push({
        productId: null,
        productName:
          item.productName || `${comboSize}-Plant Self-Watering Sanctuary Box (@ ₹${comboPrice})`,
        potColor: item.potColor || 'Matte Ivory',
        potSize: `Set of ${comboSize} Self-Watering Pots`,
        unitPrice,
        quantity: qty,
        isBundle: true,
        bundleItems: Array.isArray(item.bundleItems) ? item.bundleItems : []
      });
    } else {
      const productRow = item.slug
        ? db.prepare('SELECT * FROM products WHERE slug = ?').get(item.slug)
        : db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);

      const unitPrice = productRow
        ? String(item.potSize || '').includes('Large')
          ? productRow.max_price
          : productRow.price
        : Number(item.unitPrice || 269);

      subtotal += unitPrice * qty;
      normalizedItems.push({
        productId: productRow ? productRow.id : null,
        productName: productRow
          ? productRow.name
          : String(item.productName || 'Greenzo Indoor Plant'),
        potColor: item.potColor || 'Matte Ivory',
        potSize: item.potSize || 'Medium (5 inch Self-Watering)',
        unitPrice,
        quantity: qty,
        isBundle: false,
        bundleItems: null
      });
    }
  }

  const couponEval = couponCode
    ? evaluateCouponFromDb(couponCode, subtotal, db)
    : { valid: false, discount: 0, coupon: null };

  const discountAmount = couponEval.valid ? couponEval.discount : 0;
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingFee = afterDiscount >= freeShipAt || subtotal === 0 ? 0 : stdShip;
  const totalAmount = afterDiscount + shippingFee;

  return {
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    appliedCouponCode: couponEval.valid ? couponEval.coupon.code : null,
    normalizedItems
  };
}

export function persistOrderInDb({
  db = getDb(),
  userId = null,
  customerName,
  customerPhone,
  customerEmail = '',
  shippingAddress,
  city = 'Pune',
  pincode,
  paymentMethod = 'COD',
  paymentStatus = 'PENDING',
  razorpayOrderId = null,
  razorpayPaymentId = null,
  razorpaySignature = null,
  notes = '',
  pricing
}) {
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `GRZ-2610-${randSuffix}`;

  db.exec('BEGIN');
  try {
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_phone, customer_email, shipping_address,
        city, pincode, payment_method, payment_status, razorpay_order_id, razorpay_payment_id,
        razorpay_signature, coupon_code, subtotal, discount_amount, shipping_fee, total_amount,
        status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', ?)
    `);

    const orderResult = insertOrder.run(
      orderNumber,
      userId,
      String(customerName).trim(),
      String(customerPhone).trim(),
      String(customerEmail || '').trim(),
      String(shippingAddress).trim(),
      String(city).trim(),
      String(pincode).trim(),
      String(paymentMethod).trim(),
      String(paymentStatus).trim(),
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      pricing.appliedCouponCode,
      pricing.subtotal,
      pricing.discountAmount,
      pricing.shippingFee,
      pricing.totalAmount,
      String(notes || '').trim()
    );

    const orderId = Number(orderResult.lastInsertRowid);

    const insertItem = db.prepare(`
      INSERT INTO order_items (
        order_id, product_id, product_name, pot_color, pot_size, unit_price,
        quantity, is_bundle, bundle_items_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const decrementStock = db.prepare(`
      UPDATE products SET stock_qty = MAX(0, stock_qty - ?) WHERE id = ?
    `);

    for (const ni of pricing.normalizedItems) {
      insertItem.run(
        orderId,
        ni.productId,
        ni.productName,
        ni.potColor,
        ni.potSize,
        ni.unitPrice,
        ni.quantity,
        ni.isBundle ? 1 : 0,
        ni.bundleItems ? JSON.stringify(ni.bundleItems) : null
      );
      if (ni.productId) {
        decrementStock.run(ni.quantity, ni.productId);
      }
    }

    db.exec('COMMIT');

    return {
      id: orderId,
      orderNumber,
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      city: String(city).trim(),
      pincode: String(pincode).trim(),
      paymentMethod,
      paymentStatus,
      razorpayPaymentId,
      subtotal: pricing.subtotal,
      discountAmount: pricing.discountAmount,
      shippingFee: pricing.shippingFee,
      totalAmount: pricing.totalAmount,
      status: 'CONFIRMED',
      estimatedDelivery: String(city).toLowerCase().includes('pune')
        ? 'Express Nursery Dispatch • 24–48 Hours'
        : 'Safe Eco-Box Delivery • 3–5 Business Days',
      items: pricing.normalizedItems
    };
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

router.post('/', (req, res) => {
  const db = getDb();
  const authUser = extractUserFromRequest(req);
  const {
    customerName,
    customerPhone,
    customerEmail = '',
    shippingAddress,
    city = 'Pune',
    pincode,
    paymentMethod = 'COD',
    couponCode = '',
    notes = '',
    items = []
  } = req.body || {};

  if (!customerName || !customerPhone || !shippingAddress || !pincode) {
    return res.status(400).json({
      error: 'Please fill in your name, phone number, delivery address, and pincode.'
    });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty.' });
  }

  try {
    const pricing = calculateCartPricing(items, couponCode, db);
    const order = persistOrderInDb({
      db,
      userId: authUser?.id || null,
      customerName,
      customerPhone,
      customerEmail: customerEmail || authUser?.email || '',
      shippingAddress,
      city,
      pincode,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: 'PENDING',
      notes,
      pricing
    });

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Unable to place order right now.', details: err.message });
  }
});

router.get('/track/:query', (req, res) => {
  const db = getDb();
  const q = String(req.params.query || '').trim();
  if (!q) {
    return res.status(400).json({ error: 'Enter an Order ID (e.g. GRZ-2610-4821) or Phone Number.' });
  }

  const order = db
    .prepare(
      `SELECT * FROM orders WHERE UPPER(order_number) = UPPER(?) OR customer_phone LIKE ? ORDER BY id DESC LIMIT 1`
    )
    .get(q, `%${q.slice(-8)}%`);

  if (!order) {
    return res.status(404).json({ error: 'No order found matching that Order ID or phone number.' });
  }

  const items = db
    .prepare('SELECT * FROM order_items WHERE order_id = ?')
    .all(order.id)
    .map((item) => ({
      id: item.id,
      productName: item.product_name,
      potColor: item.pot_color,
      potSize: item.pot_size,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      isBundle: Boolean(item.is_bundle),
      bundleItems: item.bundle_items_json ? JSON.parse(item.bundle_items_json) : null
    }));

  res.json({
    order: {
      orderNumber: order.order_number,
      customerName: order.customer_name,
      city: order.city,
      pincode: order.pincode,
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      razorpayPaymentId: order.razorpay_payment_id,
      subtotal: order.subtotal,
      discountAmount: order.discount_amount,
      shippingFee: order.shipping_fee,
      totalAmount: order.total_amount,
      status: order.status,
      createdAt: order.created_at,
      items
    }
  });
});

export default router;
