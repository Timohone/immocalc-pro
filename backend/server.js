import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testConnection } from './config/database.js';
import immobilienRoutes from './routes/immobilien.js';

// Konfiguration laden
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// API Routes
app.use('/api/immobilien', immobilienRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route nicht gefunden' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Interner Server-Fehler',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server starten
const startServer = async () => {
  try {
    // Datenbankverbindung testen
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Kann nicht mit der Datenbank verbinden');
      process.exit(1);
    }
    
    // Server starten
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ImmoCal Pro Backend gestartet!');
      console.log(`📡 Server läuft auf: http://localhost:${PORT}`);
      console.log(`🗄️  Datenbank: PostgreSQL (${process.env.DB_NAME})`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log('');
      console.log('📋 Verfügbare Endpoints:');
      console.log(`   GET    http://localhost:${PORT}/health`);
      console.log(`   GET    http://localhost:${PORT}/api/immobilien`);
      console.log(`   POST   http://localhost:${PORT}/api/immobilien`);
      console.log(`   PUT    http://localhost:${PORT}/api/immobilien/:id`);
      console.log(`   DELETE http://localhost:${PORT}/api/immobilien/:id`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Fehler beim Starten des Servers:', error);
    process.exit(1);
  }
};

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM empfangen. Fahre Server herunter...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT empfangen. Fahre Server herunter...');
  await pool.end();
  process.exit(0);
});

// Server starten
startServer();