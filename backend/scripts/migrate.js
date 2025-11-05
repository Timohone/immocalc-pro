import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const migrate = async () => {
  console.log('🚀 Starte Datenbank-Migration...');
  console.log('');

  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    await client.connect();
    console.log('📡 Verbunden mit Datenbank');

    // 1. Notizen Spalte hinzufügen
    try {
      await client.query(`
        ALTER TABLE immobilien 
        ADD COLUMN IF NOT EXISTS notizen TEXT;
      `);
      console.log('✅ Notizen Spalte hinzugefügt');
    } catch (err) {
      console.log('ℹ️  Notizen Spalte existiert bereits');
    }

    // 2. Steuerliche Daten hinzufügen
    try {
      await client.query(`
        ALTER TABLE immobilien 
        ADD COLUMN IF NOT EXISTS steuersatz DECIMAL(5, 2),
        ADD COLUMN IF NOT EXISTS abschreibung_prozent DECIMAL(5, 2),
        ADD COLUMN IF NOT EXISTS abschreibung_jahre INTEGER;
      `);
      console.log('✅ Steuerliche Spalten hinzugefügt');
    } catch (err) {
      console.log('ℹ️  Steuerliche Spalten existieren bereits');
    }

    // 3. Tags/Kategorien
    try {
      await client.query(`
        ALTER TABLE immobilien 
        ADD COLUMN IF NOT EXISTS tags TEXT[];
      `);
      console.log('✅ Tags Spalte hinzugefügt');
    } catch (err) {
      console.log('ℹ️  Tags Spalte existiert bereits');
    }

    // 4. Historische Daten Tabelle
    await client.query(`
      CREATE TABLE IF NOT EXISTS immobilie_historie (
        id SERIAL PRIMARY KEY,
        immobilie_id VARCHAR(255) REFERENCES immobilien(id) ON DELETE CASCADE,
        datum DATE NOT NULL,
        marktwert DECIMAL(15, 2),
        miete DECIMAL(15, 2),
        notizen TEXT,
        erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Historie Tabelle erstellt');

    // 5. Szenarien Tabelle
    await client.query(`
      CREATE TABLE IF NOT EXISTS szenarien (
        id SERIAL PRIMARY KEY,
        immobilie_id VARCHAR(255) REFERENCES immobilien(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        beschreibung TEXT,
        parameter JSONB NOT NULL,
        erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Szenarien Tabelle erstellt');

    // 6. Marktdaten Tabelle
    await client.query(`
      CREATE TABLE IF NOT EXISTS marktdaten (
        id SERIAL PRIMARY KEY,
        region VARCHAR(255) NOT NULL,
        plz VARCHAR(10),
        durchschnittspreis DECIMAL(15, 2),
        durchschnittsmiete DECIMAL(15, 2),
        mietrendite DECIMAL(5, 2),
        datum DATE NOT NULL,
        quelle VARCHAR(255),
        erstellt_am TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Marktdaten Tabelle erstellt');

    // 7. Indizes erstellen
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_historie_immobilie ON immobilie_historie(immobilie_id);
      CREATE INDEX IF NOT EXISTS idx_historie_datum ON immobilie_historie(datum);
      CREATE INDEX IF NOT EXISTS idx_szenarien_immobilie ON szenarien(immobilie_id);
      CREATE INDEX IF NOT EXISTS idx_marktdaten_region ON marktdaten(region);
      CREATE INDEX IF NOT EXISTS idx_marktdaten_plz ON marktdaten(plz);
    `);
    console.log('✅ Indizes erstellt');

    await client.end();
    
    console.log('');
    console.log('🎉 Migration erfolgreich abgeschlossen!');
    console.log('');
    console.log('📊 Neue Features verfügbar:');
    console.log('   ✅ Notizen für Immobilien');
    console.log('   ✅ Steuerberechnung');
    console.log('   ✅ Historische Daten');
    console.log('   ✅ Was-wäre-wenn Szenarien');
    console.log('   ✅ Marktdaten-Vergleich');
    console.log('');
    
    process.exit(0);

  } catch (err) {
    console.error('');
    console.error('❌ Fehler bei der Migration:', err.message);
    console.error('');
    process.exit(1);
  }
};

migrate();