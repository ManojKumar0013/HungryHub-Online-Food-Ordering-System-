import { asyncRouter } from '../utils/asyncRouter.js';
import { query } from '../db.js';
import { mapFoodItem } from '../utils/mappers.js';

const router = asyncRouter();

const BASE_SELECT = `
  SELECT m.*, r.name AS restaurant_name
  FROM menu_item m
  JOIN restaurant r ON r.restaurant_id = m.restaurant_id
`;

async function attachVariantsAndToppings(items) {
  if (!items.length) return [];
  const ids = items.map((i) => i.item_id);
  const [variants, toppings] = await Promise.all([
    query('SELECT * FROM food_variant WHERE item_id = ANY($1::int[])', [ids]),
    query('SELECT * FROM food_topping WHERE item_id = ANY($1::int[])', [ids]),
  ]);
  return items.map((item) =>
    mapFoodItem(
      item,
      variants.rows.filter((v) => v.item_id === item.item_id),
      toppings.rows.filter((t) => t.item_id === item.item_id)
    )
  );
}

// GET /api/food-items?restaurantId=1
router.get('/', async (req, res) => {
  const { restaurantId } = req.query;
  const sql = restaurantId ? `${BASE_SELECT} WHERE m.restaurant_id = $1 ORDER BY m.item_id` : `${BASE_SELECT} ORDER BY m.item_id`;
  const { rows } = await query(sql, restaurantId ? [restaurantId] : []);
  res.json(await attachVariantsAndToppings(rows));
});

// GET /api/food-items/:id
router.get('/:id', async (req, res) => {
  const { rows } = await query(`${BASE_SELECT} WHERE m.item_id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Food item not found' });
  const [mapped] = await attachVariantsAndToppings(rows);
  res.json(mapped);
});

// POST /api/food-items  (Staff: add a new dish to the menu)
router.post('/', async (req, res) => {
  const f = req.body;
  const { rows } = await query(
    `INSERT INTO menu_item
      (restaurant_id, name, category, price, original_price, description, image_url, is_veg, rating,
       review_count, calories, protein, prep_time_minutes, ingredients, is_available, is_popular, is_bestseller)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
    [
      f.restaurantId, f.name, f.category, f.price, f.originalPrice || null, f.description || '', f.image || '',
      f.isVeg ?? true, f.rating || 0, f.reviewCount || 0, f.calories || null, f.protein || null,
      f.prepTimeMinutes || 15, f.ingredients || [], f.isAvailable ?? true, f.isPopular ?? false, f.isBestseller ?? false,
    ]
  );
  const withRestaurant = await query(`${BASE_SELECT} WHERE m.item_id = $1`, [rows[0].item_id]);
  const [mapped] = await attachVariantsAndToppings(withRestaurant.rows);
  res.status(201).json(mapped);
});

// PATCH /api/food-items/:id/availability   { isAvailable }
router.patch('/:id/availability', async (req, res) => {
  const { rows } = await query(
    'UPDATE menu_item SET is_available = COALESCE($2, NOT is_available) WHERE item_id = $1 RETURNING *',
    [req.params.id, req.body?.isAvailable]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Food item not found' });
  res.json({ id: String(rows[0].item_id), isAvailable: rows[0].is_available });
});

// DELETE /api/food-items/:id
router.delete('/:id', async (req, res) => {
  const { rowCount } = await query('DELETE FROM menu_item WHERE item_id = $1', [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: 'Food item not found' });
  res.status(204).end();
});

export default router;
