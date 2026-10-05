import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || 'hungryhub',
  user: process.env.PGUSER || 'postgres',
  password:process.env.PGPASSWORD || 'Manoj@123',
});

export const query = (text, params) => pool.query(text, params);
