/**
 * File: app.js
 * Description: Configurazione dell'applicazione Express. Importato in server.js per avviare il server.
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 */

const express = require("express");
const path = require("path");
const compression = require("compression"); // package compression per cercare di ridurre il caricamento delle tabelle
const mapsRouter = require("./routes/maps.router");

const app = express();

app.use(compression());

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/maps", mapsRouter);

module.exports = app;
