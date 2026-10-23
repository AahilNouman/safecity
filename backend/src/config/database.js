const { Pool } = require('pg');
const config = require('./index');

const poolConfig = {
  host: process.env.DB_HOST || config.db.host || 'localhost',
  port: parseInt(process.env.DB_PORT || config.db.port || '5432', 10),
  database: process.env.DB_NAME || config.db.name || 'safecity_db',
  user: process.env.DB_USER || config.db.user || 'safecity_user',
  password: process.env.DB_PASSWORD || config.db.password || 'safecity_pass',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
};

if (process.env.DB_SSL === 'true') {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err.message);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
