/**
 * File: geoJsonLoader.js
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 * Carica i dati GeoJSON, aggiorna la mappa e gestisce i controlli.
 */

import { resetVisualization } from "./resetVisualization.js";
import { removeOldControl } from "./removeOldControl.js";
import { getStyleByAttribute } from "./getStyleByAttribute.js";
import { fetchGeoJson } from "./fetchGeoJson.js";
import { calculateBreaks } from "./calculateBreaks.js";
import { prepareValuesByAttribute } from "./prepareValuesByAttribute.js";

export function loadGeoJson({
  tableName,
  map,
  geoJsonLayer,
  geoJsonAttributes,
  variableNames,
  styleRanges,
  overlays,
  customControl,
  breaksByAttribute,
  handleFeatureClick,
  pieChart,
  barChart,
}) {
  // 1. Resetta i grafici e rimuove il vecchio controllo
  resetVisualization(pieChart, barChart);
  customControl = removeOldControl(customControl, map);

  // 2. Scarica i dati GeoJSON
  // Get the current URL of the page 
  const currentURL = window.location.href
  console.log("Current URL :", currentURL);
  fetchGeoJson(`${currentURL}maps/layers/${tableName}`)
    .then((geoJson) => {
      if (geoJsonLayer) {
        map.removeLayer(geoJsonLayer);
      }

      // 3. Elenco di attributi "vXXn" generati dinamicamente
      const vKeys = Array.from(
        { length: 22 },
        (_, i) => `v${String(i + 1).padStart(2, "0")}n`
      );

      // 4. Calcola i breaks per gli attributi base
      const valuesByAttribute = prepareValuesByAttribute(
        geoJson,
        geoJsonAttributes
      );
      geoJsonAttributes.forEach((attr) => {
        const values = valuesByAttribute[attr];
        breaksByAttribute[attr] = calculateBreaks(values);
      });

      // 5. Calcola un unico set di break globale per i vXXn
      const combinedValues = [];
      geoJson.features.forEach((feature) => {
        vKeys.forEach((col) => {
          if (feature.properties[col] !== undefined) {
            combinedValues.push(feature.properties[col]);
          }
        });
      });
      // Evita errori se non ci sono valori
      breaksByAttribute["vAll"] = calculateBreaks(combinedValues);

      // Create a pane for the geoJsonLayer and set it's z-index value to be less than the one of the neighbourhoods_pane
      // and circoscrizioni pane
      map.createPane("geojson_pane");
      map.getPane("geojson_pane").style.zIndex = "200";    
      map.createPane("overlay_pane");
      map.getPane("overlay_pane").style.zIndex = "300";

      // 6. Crea il layer da visualizzare
      geoJsonLayer = L.geoJSON(geoJson, {
        pane: "geojson_pane",
        onEachFeature: (feature, layer) => {
          layer.on("click", () => handleFeatureClick(feature));
          layer.bindTooltip(
            () => {
              let tooltipContent = "";
              geoJsonAttributes.forEach((attr) => {
                if (feature.properties[attr] !== undefined) {
                  tooltipContent += `${variableNames[attr]}: ${feature.properties[attr]}<br>`;
                }
              });
              return tooltipContent;
            },
            { sticky: true }
          );
        },
        style: (feature) => {
          // Determina lo stile "principale"
          const attribute = geoJsonAttributes.find(
            (a) => feature.properties[a] !== undefined
          );
          if (!attribute) return {};
          return getStyleByAttribute(
            attribute,
            feature.properties[attribute],
            breaksByAttribute[attribute],
            styleRanges
          );
        }
      }).addTo(map);

      // Get the transparency slider
      const transparencySlider = document.getElementById("transparencySlider");
      // Set the opacity of the layer to the value of the slider
      var opacity = transparencySlider.value;
      geoJsonLayer.setStyle({fillOpacity: opacity, weight: opacity, opacity: opacity});
      // Add event listener to the transparency slider
      transparencySlider.addEventListener("input", function () {
        var opacity = transparencySlider.value;
        geoJsonLayer.setStyle({fillOpacity: opacity, weight: opacity, opacity: opacity});
      }); 

      // 7. Crea overlay unificati per gli attributi
      const allAttributes = [...geoJsonAttributes, ...vKeys];

      allAttributes.forEach((attr) => {
        // Se l'overlay per questo attributo esiste già, lo rimuovo
        if (overlays[attr]) {
          map.removeLayer(overlays[attr]);
        }

        // Se è un attributo vXXn, useremo i breaks di "vAll"
        // altrimenti usiamo i breaks specifici di quell'attributo
        const breakKey = vKeys.includes(attr) ? "vAll" : attr;

        overlays[attr] = L.geoJSON(geoJson, {
          pane: "overlay_pane",
          filter: (f) => f.properties[attr] !== undefined,
          style: (f) =>
            getStyleByAttribute(
              breakKey,
              f.properties[attr],
              breaksByAttribute[breakKey],
              styleRanges
            ),
          onEachFeature: (feature, layer) => {
            layer.on("click", () => handleFeatureClick(feature));
            layer.bindTooltip(
              `${variableNames[attr]}: ${feature.properties[attr]}`,
              { sticky: true }
            );
          }
        });

        // Get the transparency slider
        const transparencySlider = document.getElementById("transparencySlider");
        // Set the opacity of the layer to the value of the slider
        var opacity = transparencySlider.value;
        overlays[attr] .setStyle({fillOpacity: opacity, weight: opacity, opacity: opacity});
        // Add event listener to the transparency slider
        transparencySlider.addEventListener("input", function () {
          var opacity = transparencySlider.value;
          overlays[attr] .setStyle({fillOpacity: opacity, weight: opacity, opacity: opacity});
        }); 
      });

      // 8. Mostra di default l'overlay "rn"
      overlays["rn"]?.addTo(map);     

      // 9. Creazione del controllo per htot/etot/vtot/rb
      const controlContainer = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-custom"
      );
      controlContainer.style.backgroundColor = "white";
      controlContainer.style.padding = "10px";

      geoJsonAttributes.forEach((attr) => {
        const label = L.DomUtil.create("label", "", controlContainer);
        const radio = L.DomUtil.create("input", "", label);
        radio.type = "radio";
        radio.name = "layerRadio";
        radio.value = attr;

        // "rn" è selezionato di default
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

        const text = document.createTextNode(variableNames[attr] || attr);
        label.appendChild(radio);
        label.appendChild(text);
        controlContainer.appendChild(
          L.DomUtil.create("br", "", controlContainer)
        );
      });

      customControl = L.control({ position: "topright" });
      customControl.onAdd = function () {
        return controlContainer;
      };
      map.addControl(customControl); 
    })
    .catch((error) => console.error("Error loading GeoJSON data:", error));
}
