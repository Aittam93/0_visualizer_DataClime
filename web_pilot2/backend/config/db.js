/**
 * File: db.js
 * Description: Configurazione del pool di connessioni a PostgreSQL utilizzando il modulo 'pg'.
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 *
 * Variabili d'ambiente richieste:
 * - DB_USER: Nome utente del database.
 * - DB_HOST: Indirizzo host del database.
 * - DB_NAME: Nome del database.
 * - DB_PASS: Password del database.
 * - DB_PORT: Porta del database (default: 5433).
 */

const { Pool } = require("pg");

// Configura il pool di connessioni al database
const pool = new Pool({
  user: process.env.DB_USER, // Nome utente per il database
  host: process.env.DB_HOST, // Indirizzo host del database (es. localhost)
  database: process.env.DB_NAME, // Nome del database
  password: process.env.DB_PASS, // Password per il database
  port: process.env.DB_PORT || 5433, // Porta del database, default: 5433
});

module.exports = pool;
