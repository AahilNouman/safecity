const { Pool } = require('pg');
const config = require('./index');

// Use discrete parameters to avoid ERR_INVALID_URL caused by special characters like '%' in passwords
const rawHost = process.env.DB_HOST || config.db.host;
const isSupabaseDirect = rawHost && rawHost.includes('db.zdnrrzgwstnpbadgpbtq.supabase.co');

const host = (isSupabaseDirect || !rawHost || rawHost === 'localhost')
  ? 'aws-0-ap-south-1.pooler.supabase.com'
  : rawHost;

const port = host.includes('pooler.supabase.com')
  ? 6543
  : parseInt(process.env.DB_PORT || config.db.port || '5432', 10);

const rawUser = process.env.DB_USER || config.db.user || 'postgres';
const user = (host.includes('pooler.supabase.com') && !rawUser.includes('.'))
  ? 'postgres.zdnrrzgwstnpbadgpbtq'
  : rawUser;

const pool = new Pool({
  host: host,
  port: port,
  database: process.env.DB_NAME || config.db.name || 'postgres',
  user: user,
  password: process.env.DB_PASSWORD || config.db.password || '%7jS4JHq-u.!z?W',
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
