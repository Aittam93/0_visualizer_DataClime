/**
 * File: fetchGeoJson.js
 * Description: esegue la chiamata al server per ottenere i dati GeoJSON.
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 *
 * @param {string} url - L'URL da cui recuperare i dati GeoJSON.
 * @returns {Promise<Object>} - Ritorna il contenuto JSON se la chiamata va a buon fine.
 */
export async function fetchGeoJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Errore nella richiesta GeoJSON: ${response.statusText}`);
  }
  return await response.json();
}
