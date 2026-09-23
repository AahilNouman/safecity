const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setup() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false } // Required for Supabase
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase!');

    console.log('Running schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('✅ Schema created successfully!');

    console.log('Running seed.sql...');
    const seedSql = fs.readFileSync(path.join(__dirname, '../database/seed.sql'), 'utf8');
    await client.query(seedSql);
    console.log('✅ Demo data loaded successfully!');

  } catch (err) {
    console.error('❌ Error during setup:', err);
  } finally {
    await client.end();
  }
}

setup();
