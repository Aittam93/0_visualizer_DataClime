/**
 * File: createCustomControl.js
 * Description: crea il radio button per fare il toggle tra etot vtot htot e run.
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 *
 * @param {Object} params - Parametri per la creazione del controllo.
 * @param {Array} params.geoJsonAttributes - Lista degli attributi da analizzare.
 * @param {Object} params.variableNames - Mappa di nomi delle variabili.
 * @param {Object} params.overlays - Oggetto che contiene i layer di overlay.
 * @param {Object} params.map - Istanza della mappa Leaflet.
 *
 * @returns {L.Control} - Il controllo personalizzato pronto da aggiungere alla mappa.
 */
export function createCustomControl({
  geoJsonAttributes,
  variableNames,
  overlays,
  map,
}) {
  // Container principale
  const controlContainer = L.DomUtil.create(
    "div",
    "leaflet-bar leaflet-control leaflet-control-custom"
  );
  controlContainer.style.backgroundColor = "white";
  controlContainer.style.padding = "10px";

  // Creazione dei radio button
  geoJsonAttributes.forEach((attr) => {
    const label = L.DomUtil.create("label", "", controlContainer);
    const radio = L.DomUtil.create("input", "", label);
    radio.type = "radio";
    radio.name = "layerRadio";
    radio.value = attr;

    // Se vogliamo di default "rn" selezionato
    if (attr === "rn") {
      radio.checked = true;
    }

    radio.addEventListener("change", function () {
      geoJsonAttributes.forEach((a) => {
        if (a === this.value) {
          map.addLayer(overlays[a]);
        } else {
          map.removeLayer(overlays[a]);
        }
      });
    });

    const text = document.createTextNode(variableNames[attr]);
    label.appendChild(radio);
    label.appendChild(text);
    controlContainer.appendChild(L.DomUtil.create("br", "", controlContainer));
  });

  // Creiamo il controllo Leaflet
  const customControl = L.control({ position: "topright" });
  customControl.onAdd = function () {
    return controlContainer;
  };

  return customControl;
}
