/**
 * File: validateTable.js
 * Description: Middleware per validare il nome delle tabelle richieste nelle API. Importato da maps.router
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 */

const validTables = [
    'sdgeyes_hw_filtered',
    'sdgeyes_su_filtered',
    'sdgeyes_tappmax_filtered',
    'sdgeyes_tr_filtered'
];

/**
 * Middleware per validare il nome della tabella richiesto.
 * @param {object} req - Oggetto della richiesta HTTP.
 * @param {object} res - Oggetto della risposta HTTP.
 * @param {function} next - Funzione per passare al middleware successivo.
 */
module.exports = function validateTable(req, res, next) {
    const { tableName } = req.params; // Nome della tabella richiesto nella route

    // Controlla se il nome della tabella è valido
    if (!validTables.includes(tableName)) {
        console.warn(`Tabella non valida richiesta: ${tableName}`);
        return res.status(400).json({ error: `Invalid table name: ${tableName}` });
    }

    console.log(`Tabella valida richiesta: ${tableName}`);
    next(); // Passa al middleware successivo
};
