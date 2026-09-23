const { Pool } = require('pg');

// Prevent pg from automatically picking up broken or unescaped DATABASE_URL
delete process.env.DATABASE_URL;
delete process.env.PGUSER;
delete process.env.PGHOST;
delete process.env.PGPORT;
delete process.env.PGDATABASE;
delete process.env.PGPASSWORD;

// Hardened connection config for Supabase Pooler (IPv4 compatible for Vercel/serverless)
const pool = new Pool({
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.zdnrrzgwstnpbadgpbtq',
  password: '%7jS4JHq-u.!z?W',
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err.message);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
