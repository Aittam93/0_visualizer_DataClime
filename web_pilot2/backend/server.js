/**
 * File: server.js
 * Description: Punto di ingresso principale dell'applicazione. Configura e avvia il server.
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 * Usage: Avvia il server utilizzando `node server.js` o tramite script npm.
 */

require("dotenv").config();
const http = require("http");
const app = require("./app");

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
