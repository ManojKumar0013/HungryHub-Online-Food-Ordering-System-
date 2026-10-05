import { asyncRouter } from '../utils/asyncRouter.js';
import { query } from '../db.js';
import { mapUserProfile } from '../utils/mappers.js';

const router = asyncRouter();

// GET /api/users/customers   — Admin dashboard customer table
router.get('/customers', async (_req, res) => {
  const { rows: users } = await query(
    `SELECT u.*, c.wallet_balance FROM app_user u JOIN customer c ON c.user_id = u.user_id ORDER BY u.user_id`
  );
  const { rows: addresses } = await query('SELECT * FROM customer_address');
  const profiles = users.map((u) => mapUserProfile(u, addresses.filter((a) => a.customer_id === u.user_id)));
  res.json(profiles);
});

// DELETE /api/users/customers/:id   — Admin: deactivate/remove a customer
router.delete('/customers/:id', async (req, res) => {
  const { rowCount } = await query('DELETE FROM app_user WHERE user_id = $1 AND role = $2', [req.params.id, 'Customer']);
  if (!rowCount) return res.status(404).json({ error: 'Customer not found' });
  res.status(204).end();
});

// GET /api/users/:id/addresses
router.get('/:id/addresses', async (req, res) => {
  const { rows } = await query('SELECT * FROM customer_address WHERE customer_id = $1 ORDER BY is_default DESC', [req.params.id]);
  res.json(rows.map((a) => ({
    id: String(a.address_id), title: a.title, addressLine: a.address_line, city: a.city, zipCode: a.zip_code, isDefault: a.is_default,
  })));
});

export default router;
