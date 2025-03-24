/**
 * File: createOverlayLayers.js
 * Description: gestisce le mappe dei layer di overlay .
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 */

import { getStyleByAttribute } from "./getStyleByAttribute.js";

/**
 * Crea o aggiorna i layer di overlay (uno per ogni attributo),
 * li assegna all'oggetto `overlays` e, se indicato, aggiunge il layer
 * di default ("rn") alla mappa.
 *
 * @param {Object} params - Parametri per la creazione degli overlay.
 * @param {Object} params.geoJson - I dati GeoJSON.
 * @param {Array} params.geoJsonAttributes - Lista di attributi da analizzare.
 * @param {Object} params.variableNames - Mappa di nomi delle variabili.
 * @param {Object} params.breaksByAttribute - Breakpoints per gli attributi.
 * @param {Object} params.styleRanges - Stili per gli attributi.
 * @param {Function} params.handleFeatureClick - Callback per il click sulle feature.
 * @param {Object} params.overlays - Oggetto che conterrà i layer di overlay.
 * @param {Object} params.map - Istanza della mappa Leaflet.
 */
export function createOverlayLayers({
  geoJson,
  geoJsonAttributes,
  variableNames,
  breaksByAttribute,
  styleRanges,
  handleFeatureClick,
  overlays,
  map,
}) {
  geoJsonAttributes.forEach((attr) => {
    // Rimuove l'overlay precedente se presente
    if (overlays[attr]) {
      map.removeLayer(overlays[attr]);
    }

    // Crea un nuovo overlay basato sullo stesso GeoJSON
    overlays[attr] = L.geoJSON(geoJson, {
      filter: (feature) => feature.properties[attr] !== undefined,
      style: (feature) =>
        getStyleByAttribute(
          attr,
          feature.properties[attr],
          breaksByAttribute[attr],
          styleRanges
        ),
      onEachFeature: (feature, layer) => {
        layer.on("click", () => handleFeatureClick(feature));
        layer.bindTooltip(
          `${variableNames[attr]}: ${feature.properties[attr]}`,
          { sticky: true }
        );
      },
    });

    // Mostra di default il layer "rn"
    if (attr === "rn") {
      overlays[attr].addTo(map);
    }
  });
}
