import { Router } from 'express';
import { getDb, mapProductRow } from '../db/database.js';

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const { category, search, light, petFriendly, sort } = req.query;

  const conditions = [];
  const params = [];

  if (category && category !== 'all') {
    conditions.push('category_slug = ?');
    params.push(String(category));
  }
  if (search && String(search).trim()) {
    const q = `%${String(search).trim().toLowerCase()}%`;
    conditions.push('(LOWER(name) LIKE ? OR LOWER(botanical_name) LIKE ? OR LOWER(short_description) LIKE ?)');
    params.push(q, q, q);
  }
  if (light && light !== 'any') {
    conditions.push('LOWER(light_level) LIKE ?');
    params.push(`%${String(light).toLowerCase()}%`);
  }
  if (petFriendly === 'true') {
    conditions.push('pet_friendly = 1');
  }

  let orderBy = 'is_featured_deal DESC, is_bestseller DESC, id ASC';
  if (sort === 'price-asc') orderBy = 'price ASC';
  else if (sort === 'price-desc') orderBy = 'price DESC';
  else if (sort === 'rating') orderBy = 'rating DESC, review_count DESC';

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = db.prepare(`SELECT * FROM products ${whereClause} ORDER BY ${orderBy}`).all(...params);

  res.json({ products: rows.map(mapProductRow) });
});

router.get('/:slug', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE slug = ?').get(req.params.slug);
  if (!row) {
    return res.status(404).json({ error: 'Plant not found' });
  }
  const product = mapProductRow(row);
  const related = db
    .prepare('SELECT * FROM products WHERE slug != ? ORDER BY is_bestseller DESC LIMIT 4')
    .all(req.params.slug)
    .map(mapProductRow);

  res.json({ product, related });
});

export default router;
