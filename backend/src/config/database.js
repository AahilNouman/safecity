const { Pool } = require('pg');
const config = require('./index');

const poolConfig = (process.env.DATABASE_URL || config.db.url)
  ? {
      connectionString: process.env.DATABASE_URL || config.db.url,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    }
  : {
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
      user: config.db.user,
      password: config.db.password,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err.message);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
};
