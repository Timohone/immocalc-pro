import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const initDatabase = async () => {
  // Verbindung zu PostgreSQL Server als Superuser
  const superClient = new Client({
    user: 'postgres', // Superuser
    host: process.env.DB_HOST || 'localhost',
    password: 'postgres', // Dein PostgreSQL Superuser Passwort
    port: process.env.DB_PORT || 5432,
  });

  try {
    await superClient.connect();
    console.log('📡 Verbunden mit PostgreSQL Server als Superuser');

    // 1. User erstellen falls nicht existiert
    try {
      await superClient.query(`
        CREATE USER ${process.env.DB_USER} WITH PASSWORD '${process.env.DB_PASSWORD}';
      `);
      console.log(`✅ User ${process.env.DB_USER} erstellt`);
    } catch (err) {
      if (err.code === '42710') {
        console.log(`ℹ️  User ${process.env.DB_USER} existiert bereits`);
      } else {
        throw err;
      }
    }

    // 2. Datenbank erstellen falls nicht existiert
    try {
      await superClient.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Datenbank ${process.env.DB_NAME} erstellt`);
    } catch (err) {
      if (err.code === '42P04') {
        console.log(`ℹ️  Datenbank ${process.env.DB_NAME} existiert bereits`);
      } else {
        throw err;
      }
    }

    // 3. Rechte vergeben
    await superClient.query(`
      GRANT ALL PRIVILEGES ON DATABASE ${process.env.DB_NAME} TO ${process.env.DB_USER};
    `);
    console.log(`✅ Rechte für ${process.env.DB_USER} vergeben`);

    await superClient.end();

    // 4. Verbindung zur neuen Datenbank mit dem neuen User
    const dbClient = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    });

    await dbClient.connect();

    // Tabelle erstellen
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS immobilien (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        adresse TEXT,
        kaufpreis DECIMAL(15, 2),
        nebenkosten DECIMAL(15, 2),
        eigenkapital DECIMAL(15, 2),
        zinssatz DECIMAL(5, 2),
        jahresmiete DECIMAL(15, 2),
        monatliche_bruttomiete DECIMAL(15, 2),
        laufende_kosten DECIMAL(15, 2),
        verwaltung DECIMAL(15, 2),
        ruecklagen DECIMAL(15, 2),
        leerstand DECIMAL(5, 2),
        tilgung DECIMAL(5, 2),
        erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        aktualisiert_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await dbClient.query(createTableQuery);
    console.log('✅ Tabelle "immobilien" erstellt');

    // Index erstellen für bessere Performance
    await dbClient.query(`
      CREATE INDEX IF NOT EXISTS idx_immobilien_name ON immobilien(name);
    `);
    console.log('✅ Index erstellt');

    // Schema-Rechte vergeben
    await dbClient.query(`
      GRANT ALL ON SCHEMA public TO ${process.env.DB_USER};
      GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${process.env.DB_USER};
      GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${process.env.DB_USER};
    `);
    console.log('✅ Schema-Rechte vergeben');

    await dbClient.end();
    console.log('🎉 Datenbank erfolgreich initialisiert!');
    console.log('');
    console.log('📊 Datenbank-Info:');
    console.log(`   Datenbank: ${process.env.DB_NAME}`);
    console.log(`   User: ${process.env.DB_USER}`);
    console.log(`   Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    console.log('');
    process.exit(0);

  } catch (err) {
    console.error('❌ Fehler bei der Initialisierung:', err);
    process.exit(1);
  }
};

initDatabase();