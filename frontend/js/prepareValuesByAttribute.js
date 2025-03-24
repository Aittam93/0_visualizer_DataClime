// prepareValuesByAttribute.js

/**
 * Prepara un oggetto contenente gli array di valori per ciascun attributo. Usato in geoJsonLoader.js
 *
 * @param {Object} geoJson - Il GeoJSON contenente le feature.
 * @param {Array<string>} geoJsonAttributes - Gli attributi da analizzare.
 * @returns {Object} - Un oggetto con chiave = attributo, valore = array di valori.
 *
 */

export function prepareValuesByAttribute(geoJson, geoJsonAttributes) {
  // Inizializziamo un array vuoto per ciascun attributo
  const valuesByAttribute = {};

  geoJsonAttributes.forEach((attr) => {
    valuesByAttribute[attr] = [];
  });

  // Popoliamo l'oggetto con i valori estratti da ogni feature
  geoJson.features.forEach((feature) => {
    geoJsonAttributes.forEach((attr) => {
      if (feature.properties[attr] !== undefined) {
        valuesByAttribute[attr].push(feature.properties[attr]);
      }
    });
  });

  return valuesByAttribute;
}
