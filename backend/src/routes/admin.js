import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Router } from 'express';
import { config } from '../config.js';
import { getDb, getStoreSettings, updateStoreSettings, mapProductRow } from '../db/database.js';
import { requireAdmin } from '../utils/authCrypto.js';

const router = Router();

router.use(requireAdmin);

function slugify(str) {
  return String(str || 'plant')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// 1. Complete Admin Control Center Bootstrap
router.get('/dashboard', (_req, res) => {
  const db = getDb();
  const settings = getStoreSettings(db);

  const metrics = db
    .prepare(`
      SELECT
        (SELECT COUNT(*) FROM orders) AS totalOrders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'CANCELLED') AS totalRevenue,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE payment_status = 'PAID' AND status != 'CANCELLED') AS razorpayRevenue,
        (SELECT COUNT(*) FROM products) AS totalProducts,
        (SELECT COALESCE(SUM(stock_qty), 0) FROM products) AS totalStock,
        (SELECT COUNT(*) FROM coupons WHERE is_active = 1) AS activeCoupons,
        (SELECT COUNT(*) FROM consultations) AS totalConsultations,
        (SELECT COUNT(*) FROM newsletter_subscribers) AS totalSubscribers,
        (SELECT COUNT(*) FROM users WHERE role = 'CUSTOMER') AS totalCustomers
    `)
    .get();

  const products = db
    .prepare('SELECT * FROM products ORDER BY is_featured_deal DESC, id DESC')
    .all()
    .map(mapProductRow);

  const categories = db
    .prepare('SELECT id, slug, name, subtitle, accent_gradient AS accentGradient, image_url AS imageUrl, sort_order AS sortOrder FROM categories ORDER BY sort_order ASC, id ASC')
    .all();

  const coupons = db
    .prepare('SELECT id, code, type, value, min_subtotal AS minSubtotal, label, description, is_active AS isActive, show_in_banner AS showInBanner, created_at AS createdAt FROM coupons ORDER BY id DESC')
    .all()
    .map((c) => ({
      ...c,
      isActive: Boolean(c.isActive),
      showInBanner: Boolean(c.showInBanner)
    }));

  const galleryPhotos = db
    .prepare('SELECT id, image_url AS imageUrl, caption, span_class AS spanClass, sort_order AS sortOrder FROM gallery_photos ORDER BY sort_order ASC, id DESC')
    .all();

  const orders = db
    .prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 50')
    .all()
    .map((o) => {
      const items = db
        .prepare('SELECT product_name AS productName, pot_color AS potColor, pot_size AS potSize, quantity, unit_price AS unitPrice, is_bundle AS isBundle, bundle_items_json AS bundleItemsJson FROM order_items WHERE order_id = ?')
        .all(o.id)
        .map((it) => ({
          ...it,
          isBundle: Boolean(it.isBundle),
          bundleItems: it.bundleItemsJson ? JSON.parse(it.bundleItemsJson) : null
        }));
      return {
        id: o.id,
        orderNumber: o.order_number,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        customerEmail: o.customer_email,
        shippingAddress: o.shipping_address,
        city: o.city,
        pincode: o.pincode,
        paymentMethod: o.payment_method,
        paymentStatus: o.payment_status,
        razorpayOrderId: o.razorpay_order_id,
        razorpayPaymentId: o.razorpay_payment_id,
        couponCode: o.coupon_code,
        subtotal: o.subtotal,
        discountAmount: o.discount_amount,
        shippingFee: o.shipping_fee,
        totalAmount: o.total_amount,
        status: o.status,
        isGift: Boolean(o.is_gift),
        giftRecipient: o.gift_recipient || '',
        giftOccasion: o.gift_occasion || '',
        giftMessage: o.gift_message || '',
        giftSender: o.gift_sender || '',
        createdAt: o.created_at,
        items
      };
    });

  const consultations = db
    .prepare('SELECT id, name, phone, email, space_type AS spaceType, light_condition AS lightCondition, message, preferred_slot AS preferredSlot, status, created_at AS createdAt FROM consultations ORDER BY id DESC LIMIT 30')
    .all();

  res.json({
    metrics,
    products,
    categories,
    coupons,
    galleryPhotos,
    orders,
    consultations,
    settings: {
      ...settings,
      razorpayKeySecret: settings.razorpayKeySecret ? '••••••••••••' : '',
      hasRazorpaySecret: Boolean(settings.razorpayKeySecret)
    }
  });
});

// 2. Photo Upload Endpoint (saves image to backend/uploads and serves at /uploads/<file>)
router.post('/upload', (req, res) => {
  const { filename = 'photo.jpg', dataUrl } = req.body || {};
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Please select a valid image file (JPG, PNG, WEBP).' });
  }

  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) {
    return res.status(400).json({ error: 'Malformed image upload payload.' });
  }

  let ext = match[1].toLowerCase();
  if (ext === 'jpeg') ext = 'jpg';
  if (ext === 'svg+xml') ext = 'svg';
  const allowed = ['jpg', 'png', 'webp', 'gif', 'svg'];
  if (!allowed.includes(ext)) {
    return res.status(400).json({ error: `Unsupported image type: ${ext}` });
  }

  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 8 * 1024 * 1024) {
    return res.status(400).json({ error: 'Image size must be under 8 MB.' });
  }

  fs.mkdirSync(config.uploadsDir, { recursive: true });
  const baseSlug = slugify(path.basename(filename, path.extname(filename))).slice(0, 32) || 'plant';
  const uniqueName = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}-${baseSlug}.${ext}`;
  const fullPath = path.join(config.uploadsDir, uniqueName);

  fs.writeFileSync(fullPath, buffer);

  res.status(201).json({
    url: `/uploads/${uniqueName}`,
    sizeBytes: buffer.length
  });
});

// 3. Create New Product
router.post('/products', (req, res) => {
  const db = getDb();
  const {
    name,
    botanicalName = 'Botanical Cultivar',
    categorySlug = 'indoor-plants',
    price,
    maxPrice,
    originalPrice,
    badge = 'New Arrival',
    imageUrl = '/images/zamia-green.jpg',
    gallery = [],
    shortDescription = '',
    description = '',
    lightLevel = 'Medium Indirect Light',
    waterSchedule = 'Refill reservoir every 10 days',
    petFriendly = false,
    airPurifying = true,
    potColors = ['Matte Ivory', 'Forest Sage', 'Terracotta Sand'],
    features = ['14-day self-watering pot', 'Nursery acclimatized', '7-day healthy guarantee'],
    stockQty = 50,
    isBestseller = true,
    isFeaturedDeal = false,
    bundleEligible = true
  } = req.body || {};

  if (!name || price === undefined || Number(price) <= 0) {
    return res.status(400).json({ error: 'Plant name and valid selling price are required.' });
  }

  const numPrice = Math.round(Number(price));
  const numMax = Math.round(Number(maxPrice || numPrice + 50));
  const numOrig = Math.round(Number(originalPrice || Math.max(numMax, Math.round(numPrice * 1.25))));
  const baseSlug = slugify(name);
  const exists = db.prepare('SELECT id FROM products WHERE slug = ?').get(baseSlug);
  const finalSlug = exists ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

  const cleanGallery = Array.isArray(gallery) && gallery.length ? gallery : [imageUrl];

  db.exec('BEGIN');
  try {
    if (isFeaturedDeal) {
      db.prepare('UPDATE products SET is_featured_deal = 0').run();
    }

    const result = db
      .prepare(`
        INSERT INTO products (
          slug, name, botanical_name, category_slug, price, max_price, original_price,
          badge, rating, review_count, image_url, gallery_json, short_description,
          description, light_level, water_schedule, pet_friendly, air_purifying,
          pot_colors_json, features_json, in_stock, stock_qty, is_bestseller,
          is_featured_deal, bundle_eligible
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 4.9, 18, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        finalSlug,
        String(name).trim(),
        String(botanicalName).trim(),
        String(categorySlug).trim(),
        numPrice,
        numMax,
        numOrig,
        badge ? String(badge).trim() : null,
        String(imageUrl).trim(),
        JSON.stringify(cleanGallery),
        String(shortDescription || `${name} in signature self-watering planter.`).trim(),
        String(description || shortDescription || `${name} grown sustainably at Greenzo Pune nursery.`).trim(),
        String(lightLevel).trim(),
        String(waterSchedule).trim(),
        petFriendly ? 1 : 0,
        airPurifying ? 1 : 0,
        JSON.stringify(potColors),
        JSON.stringify(features),
        Number(stockQty) > 0 ? 1 : 0,
        Math.max(0, Number(stockQty)),
        isBestseller ? 1 : 0,
        isFeaturedDeal ? 1 : 0,
        bundleEligible ? 1 : 0
      );

    db.exec('COMMIT');
    const created = db
      .prepare('SELECT * FROM products WHERE id = ?')
      .get(Number(result.lastInsertRowid));
    res.status(201).json({ product: mapProductRow(created) });
  } catch (err) {
    db.exec('ROLLBACK');
    res.status(500).json({ error: 'Could not save product.', details: err.message });
  }
});

// 4. Full Update Product
router.put('/products/:id', (req, res) => {
  const db = getDb();
  const productId = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const current = mapProductRow(existing);
  const b = req.body || {};

  const numPrice = Math.round(Number(b.price ?? current.price));
  const numMax = Math.round(Number(b.maxPrice ?? current.maxPrice));
  const numOrig = Math.round(Number(b.originalPrice ?? current.originalPrice));
  const nextImage = String(b.imageUrl || current.imageUrl).trim();
  const nextGallery =
    Array.isArray(b.gallery) && b.gallery.length
      ? b.gallery
      : [nextImage, ...current.gallery.filter((g) => g !== nextImage)].slice(0, 5);
  const nextDeal = b.isFeaturedDeal !== undefined ? Boolean(b.isFeaturedDeal) : current.isFeaturedDeal;
  const nextStock = Math.max(0, Number(b.stockQty ?? current.stockQty));

  db.exec('BEGIN');
  try {
    if (nextDeal) {
      db.prepare('UPDATE products SET is_featured_deal = 0 WHERE id != ?').run(productId);
    }

    db.prepare(`
      UPDATE products SET
        name = ?,
        botanical_name = ?,
        category_slug = ?,
        price = ?,
        max_price = ?,
        original_price = ?,
        badge = ?,
        image_url = ?,
        gallery_json = ?,
        short_description = ?,
        description = ?,
        light_level = ?,
        water_schedule = ?,
        pet_friendly = ?,
        air_purifying = ?,
        pot_colors_json = ?,
        features_json = ?,
        in_stock = ?,
        stock_qty = ?,
        is_bestseller = ?,
        is_featured_deal = ?,
        bundle_eligible = ?
      WHERE id = ?
    `).run(
      String(b.name ?? current.name).trim(),
      String(b.botanicalName ?? current.botanicalName).trim(),
      String(b.categorySlug ?? current.categorySlug).trim(),
      numPrice,
      numMax,
      numOrig,
      b.badge !== undefined ? (b.badge ? String(b.badge).trim() : null) : current.badge,
      nextImage,
      JSON.stringify(nextGallery),
      String(b.shortDescription ?? current.shortDescription).trim(),
      String(b.description ?? current.description).trim(),
      String(b.lightLevel ?? current.lightLevel).trim(),
      String(b.waterSchedule ?? current.waterSchedule).trim(),
      (b.petFriendly ?? current.petFriendly) ? 1 : 0,
      (b.airPurifying ?? current.airPurifying) ? 1 : 0,
      JSON.stringify(b.potColors ?? current.potColors),
      JSON.stringify(b.features ?? current.features),
      nextStock > 0 ? 1 : 0,
      nextStock,
      (b.isBestseller ?? current.isBestseller) ? 1 : 0,
      nextDeal ? 1 : 0,
      (b.bundleEligible ?? current.bundleEligible) ? 1 : 0,
      productId
    );

    db.exec('COMMIT');
    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    res.json({ product: mapProductRow(updated) });
  } catch (err) {
    db.exec('ROLLBACK');
    res.status(500).json({ error: 'Failed to update product.', details: err.message });
  }
});

// 5. Quick Inline Price / Stock / Deal Toggle
router.patch('/products/:id/quick', (req, res) => {
  const db = getDb();
  const productId = Number(req.params.id);
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!row) return res.status(404).json({ error: 'Product not found.' });

  const { price, maxPrice, originalPrice, stockQty, badge, isFeaturedDeal } = req.body || {};

  db.exec('BEGIN');
  try {
    if (isFeaturedDeal === true) {
      db.prepare('UPDATE products SET is_featured_deal = 0').run();
    }
    const nextPrice = price !== undefined ? Math.round(Number(price)) : row.price;
    const nextMax = maxPrice !== undefined ? Math.round(Number(maxPrice)) : row.max_price;
    const nextOrig =
      originalPrice !== undefined ? Math.round(Number(originalPrice)) : row.original_price;
    const nextStock = stockQty !== undefined ? Math.max(0, Number(stockQty)) : row.stock_qty;
    const nextBadge = badge !== undefined ? (badge ? String(badge).trim() : null) : row.badge;
    const nextDeal =
      isFeaturedDeal !== undefined ? (isFeaturedDeal ? 1 : 0) : row.is_featured_deal;

    db.prepare(`
      UPDATE products
      SET price = ?, max_price = ?, original_price = ?, stock_qty = ?, in_stock = ?, badge = ?, is_featured_deal = ?
      WHERE id = ?
    `).run(nextPrice, nextMax, nextOrig, nextStock, nextStock > 0 ? 1 : 0, nextBadge, nextDeal, productId);

    db.exec('COMMIT');
    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
    res.json({ product: mapProductRow(updated) });
  } catch (err) {
    db.exec('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

// 6. Delete Product
router.delete('/products/:id', (req, res) => {
  const db = getDb();
  const productId = Number(req.params.id);
  db.prepare('UPDATE order_items SET product_id = NULL WHERE product_id = ?').run(productId);
  db.prepare('DELETE FROM products WHERE id = ?').run(productId);
  res.json({ deleted: true, id: productId });
});

// 7. Create Category
router.post('/categories', (req, res) => {
  const db = getDb();
  const {
    name,
    subtitle = 'Curated Greenzo Collection',
    accentGradient = 'linear-gradient(135deg, #ECF7F0 0%, #C4E7D0 100%)',
    imageUrl = '/images/zamia-green.jpg'
  } = req.body || {};

  if (!name) return res.status(400).json({ error: 'Category name is required.' });
  const slug = slugify(name);
  db.prepare(`
    INSERT OR REPLACE INTO categories (slug, name, subtitle, accent_gradient, image_url, sort_order)
    VALUES (?, ?, ?, ?, ?, 10)
  `).run(slug, String(name).trim(), String(subtitle).trim(), accentGradient, imageUrl);

  res.status(201).json({ category: { slug, name: String(name).trim(), subtitle, accentGradient, imageUrl } });
});

// 8. Coupons & Offers CRUD
router.post('/coupons', (req, res) => {
  const db = getDb();
  const {
    code,
    type = 'percent',
    value = 10,
    minSubtotal = 399,
    label,
    description = '',
    isActive = true,
    showInBanner = true
  } = req.body || {};

  if (!code || !value) {
    return res.status(400).json({ error: 'Offer code and discount value are required.' });
  }
  const cleanCode = String(code).trim().toUpperCase().replace(/\s+/g, '');
  const cleanLabel =
    label ||
    (type === 'percent' ? `${value}% OFF Special Offer` : `₹${value} OFF Instant Savings`);

  try {
    const info = db
      .prepare(`
        INSERT INTO coupons (code, type, value, min_subtotal, label, description, is_active, show_in_banner)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        cleanCode,
        type === 'flat' ? 'flat' : 'percent',
        Math.max(1, Number(value)),
        Math.max(0, Number(minSubtotal || 0)),
        String(cleanLabel).trim(),
        String(description).trim(),
        isActive ? 1 : 0,
        showInBanner ? 1 : 0
      );

    res.status(201).json({
      coupon: {
        id: Number(info.lastInsertRowid),
        code: cleanCode,
        type: type === 'flat' ? 'flat' : 'percent',
        value: Number(value),
        minSubtotal: Number(minSubtotal || 0),
        label: String(cleanLabel).trim(),
        description: String(description).trim(),
        isActive: Boolean(isActive),
        showInBanner: Boolean(showInBanner)
      }
    });
  } catch (err) {
    res.status(400).json({ error: `Coupon code "${cleanCode}" already exists.` });
  }
});

router.put('/coupons/:id', (req, res) => {
  const db = getDb();
  const id = Number(req.params.id);
  const row = db.prepare('SELECT * FROM coupons WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Coupon not found.' });

  const b = req.body || {};
  const nextActive = b.isActive !== undefined ? (b.isActive ? 1 : 0) : row.is_active;
  const nextBanner = b.showInBanner !== undefined ? (b.showInBanner ? 1 : 0) : row.show_in_banner;
  const nextVal = b.value !== undefined ? Number(b.value) : row.value;
  const nextMin = b.minSubtotal !== undefined ? Number(b.minSubtotal) : row.min_subtotal;
  const nextLabel = b.label !== undefined ? String(b.label).trim() : row.label;

  db.prepare(`
    UPDATE coupons SET value = ?, min_subtotal = ?, label = ?, is_active = ?, show_in_banner = ?
    WHERE id = ?
  `).run(nextVal, nextMin, nextLabel, nextActive, nextBanner, id);

  res.json({ updated: true });
});

router.delete('/coupons/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM coupons WHERE id = ?').run(Number(req.params.id));
  res.json({ deleted: true });
});

// 9. Gallery Photos Manager
router.post('/gallery', (req, res) => {
  const db = getDb();
  const { imageUrl, caption = 'Greenzo Pune Sanctuary', spanClass = '' } = req.body || {};
  if (!imageUrl) return res.status(400).json({ error: 'Please upload or provide an image URL.' });

  const info = db
    .prepare('INSERT INTO gallery_photos (image_url, caption, span_class, sort_order) VALUES (?, ?, ?, 0)')
    .run(String(imageUrl).trim(), String(caption).trim(), String(spanClass));

  res.status(201).json({
    photo: {
      id: Number(info.lastInsertRowid),
      imageUrl: String(imageUrl).trim(),
      caption: String(caption).trim(),
      spanClass: String(spanClass)
    }
  });
});

router.delete('/gallery/:id', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM gallery_photos WHERE id = ?').run(Number(req.params.id));
  res.json({ deleted: true });
});

// 10. Store Settings & Razorpay Credentials Configurator
router.put('/settings', (req, res) => {
  const db = getDb();
  const incoming = { ...(req.body || {}) };
  delete incoming.hasRazorpaySecret;
  // Do not overwrite secret if masked placeholder is sent back unchanged
  if (incoming.razorpayKeySecret && String(incoming.razorpayKeySecret).includes('••')) {
    delete incoming.razorpayKeySecret;
  }

  const updated = updateStoreSettings(db, incoming);
  res.json({
    settings: {
      ...updated,
      razorpayKeySecret: updated.razorpayKeySecret ? '••••••••••••' : '',
      hasRazorpaySecret: Boolean(updated.razorpayKeySecret)
    }
  });
});

// 11. Order & Consultation Status Updates
router.patch('/orders/:id/status', (req, res) => {
  const db = getDb();
  const { status, paymentStatus } = req.body || {};
  const id = Number(req.params.id);
  const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Order not found.' });

  db.prepare('UPDATE orders SET status = ?, payment_status = ? WHERE id = ?').run(
    status || existing.status,
    paymentStatus || existing.payment_status,
    id
  );
  res.json({ updated: true });
});

router.patch('/consultations/:id/status', (req, res) => {
  const db = getDb();
  const { status = 'COMPLETED' } = req.body || {};
  db.prepare('UPDATE consultations SET status = ? WHERE id = ?').run(
    status,
    Number(req.params.id)
  );
  res.json({ updated: true });
});

export default router;
