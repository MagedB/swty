
import fs from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sql = fs.readFileSync(new URL('../seeds.sql', import.meta.url));
  try {
    await pool.query(sql.toString());
    console.log('Database seeded 🌱');
  } catch (err) {
    console.error('DB seed error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
