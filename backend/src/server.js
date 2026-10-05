import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { optionalAuth } from './middleware/auth.js';
import authRoutes from './routes/auth.routes.js';
import restaurantRoutes from './routes/restaurants.routes.js';
import foodItemRoutes from './routes/foodItems.routes.js';
import orderRoutes from './routes/orders.routes.js';
import userRoutes from './routes/users.routes.js';
import miscRoutes from './routes/misc.routes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(optionalAuth);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/food-items', foodItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api', miscRoutes);

// Centralized error handler so a thrown/rejected error in any route
// doesn't crash the process — it comes back as a normal 500 JSON response.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error', detail: err.message });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled DB/route error:', err);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`HungryHub API listening on http://localhost:${PORT}`);
});
