import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { config } from '../config.js';
import {
  CATEGORIES,
  PRODUCTS,
  BLOGS,
  REVIEWS,
  SEED_ORDERS,
  SEED_COUPONS,
  SEED_GALLERY_PHOTOS,
  DEFAULT_STORE_SETTINGS
} from './seedData.js';

let dbInstance = null;

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function getDb() {
  if (dbInstance) return dbInstance;

  fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
  fs.mkdirSync(config.uploadsDir, { recursive: true });

  const db = new DatabaseSync(config.dbPath);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec('PRAGMA synchronous = NORMAL;');

  initializeSchema(db);
  seedIfEmpty(db);

  dbInstance = db;
  return db;
}

function initializeSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT DEFAULT '',
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'CUSTOMER',
      default_address TEXT DEFAULT '',
      default_city TEXT DEFAULT 'Pune',
      default_pincode TEXT DEFAULT '411001',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS store_settings (
      setting_key TEXT PRIMARY KEY,
      setting_value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL DEFAULT 'percent',
      value INTEGER NOT NULL,
      min_subtotal INTEGER DEFAULT 0,
      label TEXT NOT NULL,
      description TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      show_in_banner INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS gallery_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL,
      caption TEXT NOT NULL,
      span_class TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      accent_gradient TEXT NOT NULL,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      botanical_name TEXT NOT NULL,
      category_slug TEXT NOT NULL,
      price INTEGER NOT NULL,
      max_price INTEGER NOT NULL,
      original_price INTEGER NOT NULL,
      badge TEXT,
      rating REAL DEFAULT 4.9,
      review_count INTEGER DEFAULT 0,
      image_url TEXT NOT NULL,
      gallery_json TEXT NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      light_level TEXT NOT NULL,
      water_schedule TEXT NOT NULL,
      pet_friendly INTEGER DEFAULT 0,
      air_purifying INTEGER DEFAULT 1,
      pot_colors_json TEXT NOT NULL,
      features_json TEXT NOT NULL,
      in_stock INTEGER DEFAULT 1,
      stock_qty INTEGER DEFAULT 50,
      is_bestseller INTEGER DEFAULT 0,
      is_featured_deal INTEGER DEFAULT 0,
      bundle_eligible INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_slug) REFERENCES categories(slug)
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
    CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller);

    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      read_time TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      image_url TEXT NOT NULL,
      author TEXT NOT NULL,
      published_at TEXT NOT NULL,
      content_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      city TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      plant_purchased TEXT NOT NULL,
      verified INTEGER DEFAULT 1,
      avatar_initials TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      shipping_address TEXT NOT NULL,
      city TEXT NOT NULL,
      pincode TEXT NOT NULL,
      payment_method TEXT DEFAULT 'RAZORPAY',
      payment_status TEXT DEFAULT 'PENDING',
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      razorpay_signature TEXT,
      coupon_code TEXT,
      subtotal INTEGER NOT NULL,
      discount_amount INTEGER DEFAULT 0,
      shipping_fee INTEGER DEFAULT 0,
      total_amount INTEGER NOT NULL,
      status TEXT DEFAULT 'CONFIRMED',
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      pot_color TEXT DEFAULT 'Matte Ivory',
      pot_size TEXT DEFAULT 'Medium (5 inch Self-Watering)',
      unit_price INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      is_bundle INTEGER DEFAULT 0,
      bundle_items_json TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS consultations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      space_type TEXT NOT NULL,
      light_condition TEXT NOT NULL,
      message TEXT,
      preferred_slot TEXT NOT NULL,
      status TEXT DEFAULT 'SCHEDULED',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export function getStoreSettings(db = getDb()) {
  const rows = db.prepare('SELECT setting_key, setting_value FROM store_settings').all();
  const merged = { ...DEFAULT_STORE_SETTINGS };
  for (const r of rows) {
    try {
      merged[r.setting_key] = JSON.parse(r.setting_value);
    } catch {
      merged[r.setting_key] = r.setting_value;
    }
  }
  if (!merged.razorpayKeyId && config.razorpayKeyId) {
    merged.razorpayKeyId = config.razorpayKeyId;
  }
  if (!merged.razorpayKeySecret && config.razorpayKeySecret) {
    merged.razorpayKeySecret = config.razorpayKeySecret;
  }
  return merged;
}

export function updateStoreSettings(db, patch = {}) {
  const upsert = db.prepare(`
    INSERT INTO store_settings (setting_key, setting_value)
    VALUES (?, ?)
    ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value
  `);
  db.exec('BEGIN');
  try {
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) continue;
      upsert.run(k, JSON.stringify(v));
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
  return getStoreSettings(db);
}

export function seedIfEmpty(db, forceReset = false) {
  if (forceReset) {
    db.exec(`
      DELETE FROM order_items;
      DELETE FROM orders;
      DELETE FROM reviews;
      DELETE FROM blogs;
      DELETE FROM products;
      DELETE FROM categories;
      DELETE FROM coupons;
      DELETE FROM gallery_photos;
      DELETE FROM store_settings;
      DELETE FROM users;
    `);
  }

  const countRow = db.prepare('SELECT COUNT(*) AS count FROM products').get();
  if (countRow.count > 0) return { seeded: false, productCount: countRow.count };

  db.exec('BEGIN');
  try {
    // 1. Seed Admin & Customer Accounts
    const insertUser = db.prepare(`
      INSERT INTO users (name, email, phone, password_hash, role, default_address, default_city, default_pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(
      'Ajay • Greenzo Admin',
      'admin@greenzo.in',
      '+91 8883639639',
      createPasswordHash('Admin@123'),
      'ADMIN',
      'Empire Agro, Tar Mala Road, Theur, Haveli',
      'Pune',
      '412110'
    );
    const custRes = insertUser.run(
      'Rahul Verma',
      'rahul@greenzo.in',
      '+91 98220 44119',
      createPasswordHash('Customer@123'),
      'CUSTOMER',
      'Flat 402, Koregaon Park Lane 7',
      'Pune',
      '411001'
    );
    const demoCustomerId = Number(custRes.lastInsertRowid);

    // 2. Seed Store Settings
    const insertSetting = db.prepare(`
      INSERT INTO store_settings (setting_key, setting_value) VALUES (?, ?)
    `);
    for (const [k, v] of Object.entries(DEFAULT_STORE_SETTINGS)) {
      insertSetting.run(k, JSON.stringify(v));
    }

    // 3. Seed Coupons / Offers
    const insertCoupon = db.prepare(`
      INSERT INTO coupons (code, type, value, min_subtotal, label, description, is_active, show_in_banner)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of SEED_COUPONS) {
      insertCoupon.run(
        c.code,
        c.type,
        c.value,
        c.minSubtotal,
        c.label,
        c.description,
        c.isActive ? 1 : 0,
        c.showInBanner ? 1 : 0
      );
    }

    // 4. Seed Gallery Photos
    const insertGallery = db.prepare(`
      INSERT INTO gallery_photos (image_url, caption, span_class, sort_order)
      VALUES (?, ?, ?, ?)
    `);
    for (const g of SEED_GALLERY_PHOTOS) {
      insertGallery.run(g.imageUrl, g.caption, g.spanClass, g.sortOrder);
    }

    // 5. Seed Categories
    const insertCategory = db.prepare(`
      INSERT INTO categories (slug, name, subtitle, accent_gradient, image_url, sort_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const c of CATEGORIES) {
      insertCategory.run(c.slug, c.name, c.subtitle, c.accentGradient, c.imageUrl, c.sortOrder);
    }

    // 6. Seed Products
    const insertProduct = db.prepare(`
      INSERT INTO products (
        slug, name, botanical_name, category_slug, price, max_price, original_price,
        badge, rating, review_count, image_url, gallery_json, short_description,
        description, light_level, water_schedule, pet_friendly, air_purifying,
        pot_colors_json, features_json, in_stock, stock_qty, is_bestseller,
        is_featured_deal, bundle_eligible
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of PRODUCTS) {
      insertProduct.run(
        p.slug,
        p.name,
        p.botanicalName,
        p.categorySlug,
        p.price,
        p.maxPrice,
        p.originalPrice,
        p.badge,
        p.rating,
        p.reviewCount,
        p.imageUrl,
        JSON.stringify(p.gallery),
        p.shortDescription,
        p.description,
        p.lightLevel,
        p.waterSchedule,
        p.petFriendly ? 1 : 0,
        p.airPurifying ? 1 : 0,
        JSON.stringify(p.potColors),
        JSON.stringify(p.features),
        p.inStock ? 1 : 0,
        p.stockQty,
        p.isBestseller ? 1 : 0,
        p.isFeaturedDeal ? 1 : 0,
        p.bundleEligible ? 1 : 0
      );
    }

    // 7. Seed Blogs
    const insertBlog = db.prepare(`
      INSERT INTO blogs (slug, title, category, read_time, excerpt, image_url, author, published_at, content_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const b of BLOGS) {
      insertBlog.run(
        b.slug,
        b.title,
        b.category,
        b.readTime,
        b.excerpt,
        b.imageUrl,
        b.author,
        b.publishedAt,
        JSON.stringify(b.content)
      );
    }

    // 8. Seed Reviews
    const insertReview = db.prepare(`
      INSERT INTO reviews (customer_name, city, rating, comment, plant_purchased, verified, avatar_initials)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const r of REVIEWS) {
      insertReview.run(
        r.customerName,
        r.city,
        r.rating,
        r.comment,
        r.plantPurchased,
        r.verified ? 1 : 0,
        r.avatarInitials
      );
    }

    // 9. Seed Orders (including Razorpay Paid order linked to demo customer)
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_phone, customer_email, shipping_address,
        city, pincode, payment_method, payment_status, razorpay_order_id, razorpay_payment_id,
        coupon_code, subtotal, discount_amount, shipping_fee, total_amount, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertOrderItem = db.prepare(`
      INSERT INTO order_items (
        order_id, product_id, product_name, pot_color, pot_size, unit_price,
        quantity, is_bundle, bundle_items_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    SEED_ORDERS.forEach((o, idx) => {
      const isRazorpay = o.paymentMethod !== 'COD';
      const res = insertOrder.run(
        o.orderNumber,
        idx === 0 ? demoCustomerId : null,
        idx === 0 ? 'Rahul Verma' : o.customerName,
        o.customerPhone,
        idx === 0 ? 'rahul@greenzo.in' : o.customerEmail,
        o.shippingAddress,
        o.city,
        o.pincode,
        isRazorpay ? 'RAZORPAY' : 'COD',
        isRazorpay ? 'PAID' : 'PENDING',
        isRazorpay ? 'order_grz_seed9912' : null,
        isRazorpay ? 'pay_grz_seed8841' : null,
        o.couponCode,
        o.subtotal,
        o.discountAmount,
        o.shippingFee,
        o.totalAmount,
        o.status,
        o.notes
      );
      const orderId = Number(res.lastInsertRowid);
      for (const item of o.items) {
        insertOrderItem.run(
          orderId,
          null,
          item.productName,
          item.potColor,
          item.potSize,
          item.unitPrice,
          item.quantity,
          item.isBundle ? 1 : 0,
          item.bundleItems ? JSON.stringify(item.bundleItems) : null
        );
      }
    });

    db.prepare(`INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)`).run(
      'plantlovers.pune@greenzo.in'
    );
    db.prepare(`
      INSERT INTO consultations (name, phone, email, space_type, light_condition, message, preferred_slot, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Nikhil Kulkarni',
      '+91 98501 23780',
      'nikhil.k@example.com',
      'Living Room & Balcony',
      'Medium Indirect Light',
      'Looking to set up 8 self-watering indoor plants for our Viman Nagar apartment.',
      'Tomorrow • 11:00 AM – 1:00 PM',
      'SCHEDULED'
    );

    db.exec('COMMIT');
    return { seeded: true, productCount: PRODUCTS.length };
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

export function mapProductRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    botanicalName: row.botanical_name,
    categorySlug: row.category_slug,
    price: row.price,
    maxPrice: row.max_price,
    originalPrice: row.original_price,
    badge: row.badge,
    rating: row.rating,
    reviewCount: row.review_count,
    imageUrl: row.image_url,
    gallery: JSON.parse(row.gallery_json || '[]'),
    shortDescription: row.short_description,
    description: row.description,
    lightLevel: row.light_level,
    waterSchedule: row.water_schedule,
    petFriendly: Boolean(row.pet_friendly),
    airPurifying: Boolean(row.air_purifying),
    potColors: JSON.parse(row.pot_colors_json || '[]'),
    features: JSON.parse(row.features_json || '[]'),
    inStock: Boolean(row.in_stock),
    stockQty: row.stock_qty,
    isBestseller: Boolean(row.is_bestseller),
    isFeaturedDeal: Boolean(row.is_featured_deal),
    bundleEligible: Boolean(row.bundle_eligible)
  };
}
