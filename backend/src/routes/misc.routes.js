import { asyncRouter } from '../utils/asyncRouter.js';
import { query } from '../db.js';
import { mapCoupon, mapReview } from '../utils/mappers.js';

const router = asyncRouter();

// GET /api/categories
router.get('/categories', async (_req, res) => {
  const { rows } = await query('SELECT * FROM category ORDER BY category_id');
  res.json(rows.map((c) => ({ id: `cat-${c.category_id}`, name: c.name, icon: c.icon })));
});

// GET /api/coupons
router.get('/coupons', async (_req, res) => {
  const { rows } = await query('SELECT * FROM coupon');
  res.json(rows.map(mapCoupon));
});

// GET /api/reviews?restaurantId=
router.get('/reviews', async (req, res) => {
  const { restaurantId } = req.query;
  const { rows } = await query(
    restaurantId
      ? 'SELECT r.*, m.name AS food_item_name FROM review r LEFT JOIN menu_item m ON m.item_id = r.food_item_id WHERE r.restaurant_id = $1 ORDER BY r.review_id DESC'
      : 'SELECT r.*, m.name AS food_item_name FROM review r LEFT JOIN menu_item m ON m.item_id = r.food_item_id ORDER BY r.review_id DESC',
    restaurantId ? [restaurantId] : []
  );
  res.json(rows.map(mapReview));
});

// POST /api/reviews
router.post('/reviews', async (req, res) => {
  const r = req.body;
  const { rows } = await query(
    `INSERT INTO review (restaurant_id, food_item_id, user_name, user_avatar, rating, comment, likes)
     VALUES ($1,$2,$3,$4,$5,$6,0) RETURNING *`,
    [r.restaurantId, r.foodItemId || null, r.userName, r.userAvatar || null, r.rating, r.comment]
  );
  res.status(201).json(mapReview(rows[0]));
});

export default router;
