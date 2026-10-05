// Creates the hungryhub database (if missing) and runs schema.sql + seed.sql.
// Usage:  npm run db:setup
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbName = process.env.PGDATABASE || 'hungryhub';

const adminConfig = {
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: 'postgres', // connect to the default db first to (maybe) create ours
};

async function main() {
  const adminClient = new Client(adminConfig);
  await adminClient.connect();
  const { rows } = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
  if (rows.length === 0) {
    console.log(`Creating database "${dbName}"...`);
    await adminClient.query(`CREATE DATABASE ${dbName}`);
  } else {
    console.log(`Database "${dbName}" already exists.`);
  }
  await adminClient.end();

  const dbClient = new Client({ ...adminConfig, database: dbName });
  await dbClient.connect();

  const schemaSql = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf8');
  console.log('Applying schema.sql...');
  await dbClient.query(schemaSql);

  const seedSql = fs.readFileSync(path.join(__dirname, '../../database/seed.sql'), 'utf8');
  console.log('Applying seed.sql...');
  await dbClient.query(seedSql);

  await dbClient.end();
  console.log('✅ Database ready. Demo login password for all seeded accounts: demo1234');
}

main().catch((err) => {
  console.error('❌ Database setup failed:', err.message);
  process.exit(1);
});
