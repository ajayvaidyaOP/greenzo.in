import { Router } from 'express';
import { getDb, getStoreSettings, mapProductRow } from '../db/database.js';
import { HERO_REELS } from '../db/seedData.js';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const settings = getStoreSettings(db);

  const categories = db
    .prepare(`
      SELECT
        c.id,
        c.slug,
        c.name,
        c.subtitle,
        c.accent_gradient AS accentGradient,
        c.image_url AS imageUrl,
        c.sort_order AS sortOrder,
        COUNT(p.id) AS productCount
      FROM categories c
      LEFT JOIN products p ON p.category_slug = c.slug
      GROUP BY c.id
      ORDER BY c.sort_order ASC, c.id ASC
    `)
    .all();

  const productRows = db
    .prepare('SELECT * FROM products ORDER BY is_featured_deal DESC, is_bestseller DESC, id DESC')
    .all();
  const products = productRows.map(mapProductRow);

  const featuredDeal = products.find((p) => p.isFeaturedDeal) || products[0] || null;

  const activeOffers = db
    .prepare('SELECT id, code, type, value, min_subtotal AS minSubtotal, label, description, show_in_banner AS showInBanner FROM coupons WHERE is_active = 1 ORDER BY show_in_banner DESC, id DESC')
    .all()
    .map((c) => ({
      ...c,
      showInBanner: Boolean(c.showInBanner)
    }));

  const galleryPhotos = db
    .prepare('SELECT id, image_url AS src, caption, span_class AS span, sort_order AS sortOrder FROM gallery_photos ORDER BY sort_order ASC, id DESC')
    .all();

  const blogRows = db.prepare('SELECT * FROM blogs ORDER BY published_at DESC').all();
  const blogs = blogRows.map((b) => ({
    id: b.id,
    slug: b.slug,
    title: b.title,
    category: b.category,
    readTime: b.read_time,
    excerpt: b.excerpt,
    imageUrl: b.image_url,
    author: b.author,
    publishedAt: b.published_at,
    content: JSON.parse(b.content_json || '[]')
  }));

  const reviewRows = db.prepare('SELECT * FROM reviews ORDER BY id DESC LIMIT 8').all();
  const reviews = reviewRows.map((r) => ({
    id: r.id,
    customerName: r.customer_name,
    city: r.city,
    rating: r.rating,
    comment: r.comment,
    plantPurchased: r.plant_purchased,
    verified: Boolean(r.verified),
    avatarInitials: r.avatar_initials,
    createdAt: r.created_at
  }));

  res.json({
    storeConfig: {
      announcementText: settings.announcementText,
      heroBadge: settings.heroBadge,
      heroSubheading: settings.heroSubheading,
      comboBundlePrice: Number(settings.comboBundlePrice || 999),
      comboBundleSize: Number(settings.comboBundleSize || 4),
      freeShippingThreshold: Number(settings.freeShippingThreshold || 499),
      standardShippingFee: Number(settings.standardShippingFee || 69),
      phone: settings.phone,
      whatsappNumber: settings.whatsappNumber,
      email: settings.email,
      address: settings.address,
      razorpayEnabled: Boolean(settings.razorpayEnabled),
      codEnabled: Boolean(settings.codEnabled),
      razorpayMode: settings.razorpayKeyId && settings.razorpayKeySecret ? 'live' : 'sandbox'
    },
    heroReels: HERO_REELS,
    activeOffers,
    galleryPhotos,
    categories,
    products,
    featuredDeal,
    blogs,
    reviews
  });
});

export default router;
