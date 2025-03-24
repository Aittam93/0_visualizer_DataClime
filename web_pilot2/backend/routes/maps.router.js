/**
 * File: maps.router.js
 * Description: crea le route. Al momento una per ogni tabella con tutte le colonne.
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 */

const express = require("express");
const router = express.Router();

// Middleware per validare il nome della tabella
const validateTable = require("../middlewares/validateTable");

// Controller per recuperare i dati GeoJSON
const { getGeoJsonByTableName } = require("../controllers/maps.controller");

/**
 * Rotta: GET /maps/layers/:tableName
 * Description: Restituisce tutti i dati della tabella specificata. ---> Dovrebbe essere ottimizzato (tempi lenti nel caricamento)
 * Middleware: validateTable - Valida il nome della tabella richiesto. --> non del tutto necessario al momento ma in futuro con le tabelle "pesate" sì
 * Controller: getGeoJsonByTableName - Esegue la query e restituisce i dati.
 */
router.get("/layers/:tableName", validateTable, getGeoJsonByTableName);

module.exports = router;
