import express from 'express';
import Immobilie from '../models/Immobilie.js';

const router = express.Router();

/**
 * POST /api/immobilien/import
 * Importiert mehrere Immobilien
 * WICHTIG: Muss VOR /:id Route kommen!
 */
router.post('/import', async (req, res) => {
  try {
    const { immobilien } = req.body;
    
    if (!Array.isArray(immobilien)) {
      return res.status(400).json({ error: 'Immobilien muss ein Array sein' });
    }
    
    const created = [];
    for (const immoData of immobilien) {
      const immobilie = await Immobilie.create(immoData);
      created.push(immobilie);
    }
    
    res.status(201).json({ 
      message: `${created.length} Immobilien erfolgreich importiert`,
      immobilien: created
    });
  } catch (error) {
    console.error('Fehler beim Importieren:', error);
    res.status(500).json({ error: 'Fehler beim Importieren der Immobilien' });
  }
});

/**
 * GET /api/immobilien
 * Holt alle Immobilien
 */
router.get('/', async (req, res) => {
  try {
    const immobilien = await Immobilie.findAll();
    res.json(immobilien);
  } catch (error) {
    console.error('Fehler beim Laden der Immobilien:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Immobilien' });
  }
});

/**
 * DELETE /api/immobilien
 * Löscht alle Immobilien
 */
router.delete('/', async (req, res) => {
  try {
    await Immobilie.deleteAll();
    res.json({ message: 'Alle Immobilien erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen aller Immobilien:', error);
    res.status(500).json({ error: 'Fehler beim Löschen aller Immobilien' });
  }
});

/**
 * GET /api/immobilien/:id
 * Holt eine einzelne Immobilie
 */
router.get('/:id', async (req, res) => {
  try {
    const immobilie = await Immobilie.findById(req.params.id);
    
    if (!immobilie) {
      return res.status(404).json({ error: 'Immobilie nicht gefunden' });
    }
    
    res.json(immobilie);
  } catch (error) {
    console.error('Fehler beim Laden der Immobilie:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Immobilie' });
  }
});

/**
 * POST /api/immobilien
 * Erstellt eine neue Immobilie
 */
router.post('/', async (req, res) => {
  try {
    console.log('POST - Erstelle neue Immobilie:', req.body.name);
    const immobilie = await Immobilie.create(req.body);
    res.status(201).json(immobilie);
  } catch (error) {
    console.error('Fehler beim Erstellen der Immobilie:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen der Immobilie' });
  }
});

/**
 * PUT /api/immobilien/:id
 * Aktualisiert eine Immobilie
 */
router.put('/:id', async (req, res) => {
  try {
    console.log('PUT - Aktualisiere Immobilie:', req.params.id);
    const immobilie = await Immobilie.update(req.params.id, req.body);
    
    if (!immobilie) {
      console.log('PUT - Immobilie nicht gefunden:', req.params.id);
      return res.status(404).json({ error: 'Immobilie nicht gefunden' });
    }
    
    console.log('PUT - Erfolgreich aktualisiert:', immobilie.name);
    res.json(immobilie);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Immobilie:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Immobilie' });
  }
});

/**
 * DELETE /api/immobilien/:id
 * Löscht eine Immobilie
 */
router.delete('/:id', async (req, res) => {
  try {
    const success = await Immobilie.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Immobilie nicht gefunden' });
    }
    
    res.json({ message: 'Immobilie erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen der Immobilie:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Immobilie' });
  }
});

export default router;