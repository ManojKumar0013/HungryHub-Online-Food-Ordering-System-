import { asyncRouter } from '../utils/asyncRouter.js';
import { query } from '../db.js';
import { mapRestaurant } from '../utils/mappers.js';

const router = asyncRouter();

// GET /api/restaurants
router.get('/', async (_req, res) => {
  const { rows } = await query('SELECT * FROM restaurant WHERE is_active = TRUE ORDER BY restaurant_id');
  res.json(rows.map(mapRestaurant));
});

// GET /api/restaurants/:id
router.get('/:id', async (req, res) => {
  const { rows } = await query('SELECT * FROM restaurant WHERE restaurant_id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Restaurant not found' });
  res.json(mapRestaurant(rows[0]));
});

// POST /api/restaurants  (Admin: register a new restaurant)
router.post('/', async (req, res) => {
  const r = req.body;
  // The frontend's Restaurant type has no separate "city" field (just a full
  // address string), so we derive a reasonable default: text after the last
  // comma in the address, or "Hyderabad" if that can't be determined.
  const derivedCity = r.city || (r.address || '').split(',').pop()?.trim() || 'Hyderabad';
  const { rows } = await query(
    `INSERT INTO restaurant
      (name, cuisine_types, rating, review_count, delivery_time_text, distance_text, price_for_two,
       image_url, banner_image_url, is_free_delivery, discount_badge, is_open, address, city, contact_number, tags)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
    [
      r.name, r.cuisine || [], r.rating || 0, r.reviewCount || 0, r.deliveryTime || '30-40 min',
      r.distance || '—', r.priceForTwo || 0, r.image || '', r.bannerImage || '',
      r.isFreeDelivery ?? false, r.discountBadge || null, r.isOpen ?? true, r.address, derivedCity, r.phone || '', r.tags || [],
    ]
  );
  res.status(201).json(mapRestaurant(rows[0]));
});

export default router;
