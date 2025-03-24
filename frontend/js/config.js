/**
 * File: config.js
 * Description: contiene le costanti usate nel visualizzatore (mappatura delle colonne delle tabelle del db).
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 */

export const mapConfig = {
  center: [45.0703, 7.6869],
  zoom: 12,
  tileLayerUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  tileLayerOptions: {
    maxZoom: 17,
    attribution: "© OpenStreetMap contributors",
  },
};

// le colonne sono comuni a tutte le tabelle
export const barChartColumns = [
  "v01n",
  "v02n",
  "v03n",
  "v04n",
  "v05n",
  "v06n",
  "v07n",
  "v08n",
  "v09n",
  "v10n",
  "v11n",
  "v12n",
  "v13n",
  "v14n",
  "v15n",
  "v16n",
  "v17n",
  "v18n",
  "v19n",
  "v20n",
  "v21n",
  "v22n",
];

// mappa il nome esteso per ogni colonna
export const variableNames = {
  htot: "Pericolo",
  etot: "Esposizione (popolazione over 65)",
  vtot: "Vulnerabilità",
  rn: "Rischio",
  v01n: "Donne over65",
  v02n: "Anziani over85",
  v03n: "Isolamento sociale",
  v04n: "Stranieri",
  v05n: "Affollamento",
  v06n: "Istruzione",
  v07n: "<=1 patologia",
  v08n: ">1 patologia",
  v09n: "Cro bpco",
  v10n: "Cardiopatia ischemica",
  v11n: "Diabete",
  v12n: "Scompenso",
  v13n: "Vasculopatie cerebrali",
  v14n: "Stato edifici",
  v15n: "Densità edilizia",
  v16n: "Densità di popolazione",
  v17n: "Vicinanza a corpi idrici",
  v18n: "Perc aree",
  v19n: "100pres_SS",
  v20n: "Area_apert",
  v21n: "Media piani",
  v22n: "200_Lfresch",
};

// i colori attribuiti ai gruppi di colonne del barchart

export const labelColors = {
  demografia: "#224F9D",
  societa: "#239AD7",
  economia: "#C8EAD3",
  salute: "#396E2D",
  contesto: "#3DA635",
};

// mappa le colonne del barchart per raggruppare. In futuro inserire le label nella tabella direttamente sul db?

export const columnGroups = {
  v01n: "demografia",
  v02n: "demografia",
  v03n: "societa",
  v04n: "societa",
  v05n: "societa",
  v06n: "economia",
  v07n: "salute",
  v08n: "salute",
  v09n: "salute",
  v10n: "salute",
  v11n: "salute",
  v12n: "salute",
  v13n: "salute",
  v14n: "contesto",
  v15n: "contesto",
  v16n: "contesto",
  v17n: "contesto",
  v18n: "contesto",
  v19n: "contesto",
  v20n: "contesto",
  v21n: "contesto",
  v22n: "contesto",
};

// colori usati per le mappe htot etot vtot rn e per tutte le variabili al click sulla colonna (vAll)

export const styleRanges = {
  htot: {
    colors: ["#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#BD0026", "#800026"],
    fillOpacity: 0.7,
    weight: 1,
  },
  etot: {
    colors: ["#FFD700", "#FFC200", "#FFAD00", "#FF9800", "#FF7300", "#FF4D00"],
    fillOpacity: 0.8,
    weight: 1,
  },
  vtot: {
    colors: ["#9ECAE1", "#6BAED6", "#4292C6", "#2171B5", "#08519C", "#08306B"],
    fillOpacity: 0.8,
    weight: 1,
  },
  rn: {
    colors: ["#008000", "#ADFF2F", "#FFFF00", "#FFA500", "#FF4500", "#FF0000"],
    fillOpacity: 0.8,
    weight: 1,
  },

  // "vAll" -> Un'unica scala di 6 colori per TUTTI i vXXn
  vAll: {
    colors: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd"],
    fillOpacity: 0.8,
    weight: 1,
  },
};

export const geoJsonAttributes = ["htot", "etot", "vtot", "rn"];
