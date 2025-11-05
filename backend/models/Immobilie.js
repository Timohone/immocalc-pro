import pool from '../config/database.js';

class Immobilie {
  static async findAll() {
    const query = `
      SELECT 
        id, name, adresse, 
        kaufpreis, nebenkosten, eigenkapital,
        zinssatz, jahresmiete, monatliche_bruttomiete,
        laufende_kosten, verwaltung, ruecklagen,
        leerstand, tilgung,
        steuersatz, abschreibung_prozent, abschreibung_jahre,
        notizen, tags,
        erstellt_am, aktualisiert_am
      FROM immobilien
      ORDER BY erstellt_am DESC
    `;
    
    const result = await pool.query(query);
    return result.rows.map(row => this.mapRowToObject(row));
  }

  static async findById(id) {
    const query = `SELECT * FROM immobilien WHERE id = $1`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToObject(result.rows[0]);
  }

  static async create(data) {
    const id = data.id || `immo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO immobilien (
        id, name, adresse,
        kaufpreis, nebenkosten, eigenkapital,
        zinssatz, jahresmiete, monatliche_bruttomiete,
        laufende_kosten, verwaltung, ruecklagen,
        leerstand, tilgung,
        steuersatz, abschreibung_prozent, abschreibung_jahre,
        notizen, tags,
        erstellt_am, aktualisiert_am
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      RETURNING *
    `;
    
    const values = [
      id,
      data.name,
      data.adresse || null,
      this.parseDecimal(data.kaufpreis),
      this.parseDecimal(data.nebenkosten),
      this.parseDecimal(data.eigenkapital),
      this.parseDecimal(data.zinssatz),
      this.parseDecimal(data.jahresmiete),
      this.parseDecimal(data.monatlicheBruttomiete),
      this.parseDecimal(data.laufendeKosten),
      this.parseDecimal(data.verwaltung),
      this.parseDecimal(data.ruecklagen),
      this.parseDecimal(data.leerstand),
      this.parseDecimal(data.tilgung),
      this.parseDecimal(data.steuersatz),
      this.parseDecimal(data.abschreibungProzent) || 2.5,
      parseInt(data.abschreibungJahre) || 40,
      data.notizen || null,
      data.tags || null
    ];
    
    const result = await pool.query(query, values);
    return this.mapRowToObject(result.rows[0]);
  }

  static async update(id, data) {
    const query = `
      UPDATE immobilien SET
        name = $2,
        adresse = $3,
        kaufpreis = $4,
        nebenkosten = $5,
        eigenkapital = $6,
        zinssatz = $7,
        jahresmiete = $8,
        monatliche_bruttomiete = $9,
        laufende_kosten = $10,
        verwaltung = $11,
        ruecklagen = $12,
        leerstand = $13,
        tilgung = $14,
        steuersatz = $15,
        abschreibung_prozent = $16,
        abschreibung_jahre = $17,
        notizen = $18,
        tags = $19,
        aktualisiert_am = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [
      id,
      data.name,
      data.adresse || null,
      this.parseDecimal(data.kaufpreis),
      this.parseDecimal(data.nebenkosten),
      this.parseDecimal(data.eigenkapital),
      this.parseDecimal(data.zinssatz),
      this.parseDecimal(data.jahresmiete),
      this.parseDecimal(data.monatlicheBruttomiete),
      this.parseDecimal(data.laufendeKosten),
      this.parseDecimal(data.verwaltung),
      this.parseDecimal(data.ruecklagen),
      this.parseDecimal(data.leerstand),
      this.parseDecimal(data.tilgung),
      this.parseDecimal(data.steuersatz),
      this.parseDecimal(data.abschreibungProzent) || 2.5,
      parseInt(data.abschreibungJahre) || 40,
      data.notizen || null,
      data.tags || null
    ];
    
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return null;
    return this.mapRowToObject(result.rows[0]);
  }

  static async delete(id) {
    const query = `DELETE FROM immobilien WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  static async deleteAll() {
    const query = `DELETE FROM immobilien`;
    await pool.query(query);
    return true;
  }

  static mapRowToObject(row) {
    return {
      id: row.id,
      name: row.name,
      adresse: row.adresse,
      kaufpreis: row.kaufpreis ? row.kaufpreis.toString() : '',
      nebenkosten: row.nebenkosten ? row.nebenkosten.toString() : '',
      eigenkapital: row.eigenkapital ? row.eigenkapital.toString() : '',
      zinssatz: row.zinssatz ? row.zinssatz.toString() : '',
      jahresmiete: row.jahresmiete ? row.jahresmiete.toString() : '',
      monatlicheBruttomiete: row.monatliche_bruttomiete ? row.monatliche_bruttomiete.toString() : '',
      laufendeKosten: row.laufende_kosten ? row.laufende_kosten.toString() : '',
      verwaltung: row.verwaltung ? row.verwaltung.toString() : '',
      ruecklagen: row.ruecklagen ? row.ruecklagen.toString() : '',
      leerstand: row.leerstand ? row.leerstand.toString() : '',
      tilgung: row.tilgung ? row.tilgung.toString() : '',
      steuersatz: row.steuersatz ? row.steuersatz.toString() : '',
      abschreibungProzent: row.abschreibung_prozent ? row.abschreibung_prozent.toString() : '2.5',
      abschreibungJahre: row.abschreibung_jahre || 40,
      notizen: row.notizen || '',
      tags: row.tags || [],
      erstelltAm: row.erstellt_am,
      aktualisiertAm: row.aktualisiert_am
    };
  }

  static parseDecimal(value) {
    if (value === null || value === undefined || value === '') return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
}

export default Immobilie;