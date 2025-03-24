/**
 * File: maps.controller.js
 * Description: Query dei dati e generazione dell'array.
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 */

const pool = require("../config/db");

/**
 * Recupera i dati GeoJSON per una tabella specificata e li restituisce come FeatureCollection.
 * @param {object} req - Oggetto della richiesta HTTP. Contiene i parametri della richiesta.
 * @param {object} res - Oggetto della risposta HTTP. Utilizzato per inviare i risultati.
 */
async function getGeoJsonByTableName(req, res) {
  const { tableName } = req.params; // Nome della tabella specificato nella route

  try {
    // Query SQL per selezionare tutte le righe e convertire la geometria in formato GeoJSON.
    const query = `
            SELECT *, ST_AsGeoJSON(geom)::json AS geometry
            FROM "${tableName}";
        `;

    // Esegue la query utilizzando il pool di connessioni
    const result = await pool.query(query);

    // Trasforma i risultati in un array di feature GeoJSON
    const features = result.rows.map((row) => ({
      type: "Feature",
      properties: { ...row, geom: undefined }, // Esclude il campo 'geom' dalle proprietà
      geometry: row.geometry, // Usa il campo GeoJSON convertito
    }));

    // Costruisce l'oggetto GeoJSON FeatureCollection
    const geoJson = {
      type: "FeatureCollection",
      features,
    };

    // Invia la risposta come JSON
    res.json(geoJson);
  } catch (err) {
    // Logga l'errore nel server e invia una risposta di errore generica al client
    console.error("Errore nell'esecuzione della query:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Esporta la funzione come modulo
module.exports = {
  getGeoJsonByTableName,
};
