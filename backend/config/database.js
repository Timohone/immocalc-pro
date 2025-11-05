import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'immocalc_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum Anzahl Connections im Pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Event Listeners
pool.on('connect', () => {
  console.log('📡 Neue Datenbankverbindung erstellt');
});

pool.on('error', (err) => {
  console.error('❌ Unerwarteter Datenbankfehler:', err);
  process.exit(-1);
});

// Test Connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Datenbankverbindung erfolgreich:', result.rows[0].now);
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Datenbankverbindung fehlgeschlagen:', err);
    return false;
  }
};

export default pool;