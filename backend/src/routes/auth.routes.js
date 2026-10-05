import { asyncRouter } from '../utils/asyncRouter.js';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { signToken } from '../middleware/auth.js';
import { mapUserProfile } from '../utils/mappers.js';

const router = asyncRouter();

const ROLE_MAP = { customer: 'Customer', staff: 'Staff', driver: 'DeliveryPartner', admin: 'Admin' };

// POST /api/auth/login  { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const { rows } = await query('SELECT * FROM app_user WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

  const profile = await loadProfile(user);
  const token = signToken({ userId: user.user_id, role: user.role });
  res.json({ token, user: profile });
});

// POST /api/auth/register  { name, email, phone, password, role }
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role = 'customer' } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  const dbRole = ROLE_MAP[role] || 'Customer';

  const existing = await query('SELECT 1 FROM app_user WHERE email = $1', [email]);
  if (existing.rows.length) return res.status(409).json({ error: 'An account with this email already exists' });

  const passwordHash = bcrypt.hashSync(password, 10);

  const { rows } = await query(
    `INSERT INTO app_user (name, email, phone, password_hash, role) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, email, phone || '', passwordHash, dbRole]
  );
  const user = rows[0];

  if (dbRole === 'Customer') {
    await query('INSERT INTO customer (user_id) VALUES ($1)', [user.user_id]);
  } else if (dbRole === 'DeliveryPartner') {
    await query('INSERT INTO delivery_partner (user_id) VALUES ($1)', [user.user_id]);
  } else if (dbRole === 'Admin') {
    await query('INSERT INTO admin_user (user_id) VALUES ($1)', [user.user_id]);
  }
  // Staff requires a restaurant_id — left to an admin to assign for now.

  const profile = await loadProfile(user);
  const token = signToken({ userId: user.user_id, role: user.role });
  res.status(201).json({ token, user: profile });
});

async function loadProfile(user) {
  let addresses = [];
  let walletBalance = 0;
  if (user.role === 'Customer') {
    const cust = await query('SELECT wallet_balance FROM customer WHERE user_id=$1', [user.user_id]);
    walletBalance = cust.rows[0]?.wallet_balance ?? 0;
    const addr = await query('SELECT * FROM customer_address WHERE customer_id=$1 ORDER BY is_default DESC', [user.user_id]);
    addresses = addr.rows;
  }
  return mapUserProfile({ ...user, wallet_balance: walletBalance }, addresses);
}

export default router;
