/**
 * File: geoJsonLoader.js
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 * orchestra mappe e grafici
 */

import { updatePieChart, updateBarChart } from "./chart.js";

import { loadGeoJson } from "./geoJsonLoader.js";

import {
  mapConfig,
  barChartColumns,
  variableNames,
  labelColors,
  columnGroups,
  styleRanges,
  geoJsonAttributes,
} from "./config.js";

import { neighbourhoods } from "./turin_neighbourhoods.js";
import { circo } from "./turin_circoscrizioni.js";
import { healthDistricts } from "./turin_healthDistricts.js";

// Centroid where put the label
function getCentroid(feature) {
  var bounds = L.geoJSON(feature).getBounds();
  return bounds.getCenter();
}

document.addEventListener("DOMContentLoaded", function () {
  // 1. Inizializzazione della mappa
  //const map = L.map("map").setView(mapConfig.center, mapConfig.zoom);
  //L.tileLayer(mapConfig.tileLayerUrl, mapConfig.tileLayerOptions).addTo(map);

  // 1.1. For multiple layers 
  // Open street map
  var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Carto DB
  var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });

  // ESRI Imagery 
  var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
  });

  const map = L.map('map', 
    {
      center: mapConfig.center,
      zoom: mapConfig.zoom,
      layers: [OpenStreetMap_Mapnik]
    });

    // Create panes for the neightbourhoods and circoscrizioni
    map.createPane("neighbourhoods_pane");
    map.getPane("neighbourhoods_pane").style.zIndex = "400";   
    map.createPane("circo_pane");
    map.getPane("circo_pane").style.zIndex = "500";
    map.createPane("healthDistricts_pane");
    map.getPane("healthDistricts_pane").style.zIndex = "600";

  var baseMaps = {
    "OpenStreetMap": OpenStreetMap_Mapnik,
    "CartoDB Dark Matter": CartoDB_DarkMatter, 
    "ESRI Imagery": Esri_WorldImagery,
  };

  // GeoJSON layer for the neighbourhoods
  var neighbourhoods_geoJSON = L.geoJSON(neighbourhoods, {
    pane: "neighbourhoods_pane", 
    style: function (feature) {
      return {color: 'red', weight: 2, fill: false, opacity: 1};
    },
    onEachFeature(feature, layer) {
      let label;
      layer.on('mouseover', function () {
        let centroid = getCentroid(feature);
        label = L.marker(centroid, {
          icon: L.divIcon({
            className: 'neighbourhood-label',
            html: `<div class='neighbourhood-label'>${feature.properties.DESCR}</div>`, // Text to display
          })
        }).addTo(map);
      });
      layer.on('mouseout', function () {
        if (label) {
          map.removeLayer(label);
        }
      });
    },
  });

  // GeoJSON layer for the circoscrizioni
  var circo_geoJSON = L.geoJSON(circo, {
    pane: "circo_pane",
    style: function (feature) {
      return {color: 'green', weight: 2, fill: false, opacity: 1};
    },
    onEachFeature(feature, layer) {
      let label;
      layer.on('mouseover', function () {
        let centroid = getCentroid(feature);
        label = L.marker(centroid, {
          icon: L.divIcon({
            className: 'circo-label',
            html: `<div class='circo-label'>${feature.properties.DENOM}</div>`, // Text to display
          })
        }).addTo(map);
      });
      layer.on('mouseout', function () {
        if (label) {
          map.removeLayer(label);
        }
      });
    },
  }); 

  // GeoJSON layer for the health districts
  var healthDistricts_geoJSON = L.geoJSON(healthDistricts, {
    pane: "healthDistricts_pane",
    style: function (feature) {
      return {color: 'blue', weight:3, fill: false, fillOpacity: 0.5};
    },
    onEachFeature(feature, layer) {
      let label;
      layer.on('mouseover', function () {
        let centroid = getCentroid(feature);
        label = L.marker(centroid, {
          icon: L.divIcon({
            className: 'heath-district-label',
            html: `<div class='heath-district-label'>${feature.properties.distrett_1}</div>`, // Text to display
          })
        }).addTo(map);
      });
      layer.on('mouseout', function () {
        if (label) {
          map.removeLayer(label);
        }
      });
    },
  });

  // Turin overlays - neightbourhoods, circoscrizioni and health districts
  var turin_overlays = {
    "Quartieri": neighbourhoods_geoJSON,
    "Circoscrizioni": circo_geoJSON, 
    "Distretti Sanitari": healthDistricts_geoJSON
  };

  // Add the basemaps and the overlays to the map
  L.control.layers(baseMaps, turin_overlays).addTo(map);

  // 2. Variabili globali e configurazioni
  let pieChart = null; // Variabile per il grafico a torta
  let barChart = null; // Variabile per il grafico a barre
  let customControl = null; // Variabile per il controllo personalizzato
  const overlays = {}; // Oggetto per memorizzare i layer delle sovrapposizioni
  let geoJsonLayer = null; // Variabile per il layer GeoJSON
  const breaksByAttribute = {}; // Oggetto per memorizzare i breakpoints degli attributi

  // 3. Gestione del click sulle feature della mappa
  function handleFeatureClick(feature) {
    const pieChartCanvas = document.getElementById("pieChart");
    const barChartCanvas = document.getElementById("barChart");
    const pieChartPlaceholder = document.getElementById("pieChart-placeholder");
    const barChartPlaceholder = document.getElementById("barChart-placeholder");

    // Mostra i canvas, nasconde i placeholder
    pieChartPlaceholder.hidden = true;
    barChartPlaceholder.hidden = true;
    pieChartCanvas.hidden = false;
    barChartCanvas.hidden = false;

    // Aggiorna o crea il pie chart
    pieChart = updatePieChart(
      pieChart,
      pieChartCanvas.getContext("2d"),
      feature,
      variableNames
    );

    // Aggiorna o crea il bar chart
    barChart = updateBarChart(
      barChart,
      barChartCanvas.getContext("2d"),
      feature,
      barChartColumns,
      variableNames,
      columnGroups,
      labelColors,
      map,
      overlays
    );

    // Get the container that has the pie and bar chart
    const id_info_container = document.getElementById("info-container");
    if (id_info_container.hidden){
      // Now set the style to flex and flex direction to column
      id_info_container.style.display = "flex";
      id_info_container.style.flexDirection = "column"; 
      id_info_container.hidden = false;
      
      // Change the view of the existing map instance
      const newLat = 45.062; // Update with the feature's latitude
      const newLng = 7.767; // Update with the feature's longitude
      const newZoom = 12; // Update with the desired zoom level
      map.setView([newLat, newLng], newZoom);
    }          
  }

  /*
  // 4. Event listener per il selettore della tabella
  const tableSelector = document.getElementById("tableSelector");
  tableSelector.addEventListener("change", () => {
    const tableName = tableSelector.value;
    loadGeoJson({
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
    });
  });
  */

  // 4.1 Add event listener to the radion buttons dangerType
  const dangerTypeSelectors = document.getElementsByName("dangerType");

  // Loop through each radio button and add an event listener
  dangerTypeSelectors.forEach(radio => {
    radio.addEventListener("change", () => {
      // Get the selected value
      const dangerType = radio.value;

      // Call a function to update the map based on the selected dangerType
      loadGeoJson({
        tableName: dangerType,
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
      });
  });
});

  // 5. Carica i dati iniziali
  const initialTable = tableSelector.value;
  if (initialTable) {
    loadGeoJson({
      tableName: initialTable,
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
    });
  }
});
