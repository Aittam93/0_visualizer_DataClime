/**
 * File: chart.js
 * Description: Funzioni per la gestione dei grafici con Chart.js.
 * Author: Mattia Scalas
 * Date: Dicembre 2024
 */

/**
 * Aggiorna un grafico a torta con i dati forniti.
 * @param {Chart|null} pieChart - Il grafico a torta esistente o null.
 * @param {CanvasRenderingContext2D} ctxPie - Il contesto canvas per il grafico a torta.
 * @param {Object} feature - La feature con proprietà da visualizzare.
 * @param {Object} variableNames - I nomi delle variabili.
 * @returns {Chart} Il nuovo grafico a torta.
 */
export function updatePieChart(pieChart, ctxPie, feature, variableNames) {
  if (pieChart) {
    pieChart.destroy();
  }
  return new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: [variableNames.htot, variableNames.etot, variableNames.vtot],
      datasets: [
        {
          data: [
            feature.properties.htot,
            feature.properties.etot,
            feature.properties.vtot,
          ],
          backgroundColor: [
            "rgba(255, 46, 20, 0.6)",
            "rgba(251, 184, 43, 0.6)",
            "rgba(34, 75, 157, 0.6)",
          ],
          borderColor: [
            "rgba(255, 46, 20, 1)",
            "rgba(251, 184, 43, 1)",
            "rgba(34, 75, 157, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "left",
        },
      },
    },
  });
}

/**
 * Aggiorna un grafico a barre con i dati forniti.
 *
 * @param {Chart|null} barChart - Il grafico a barre esistente o null.
 * @param {CanvasRenderingContext2D} ctxBar - Il contesto canvas per il grafico a barre.
 * @param {Object} feature - Le feature (con properties) da visualizzare.
 * @param {Array} barChartColumns - Le colonne da visualizzare sul grafico.
 * @param {Object} variableNames - I nomi "umani" delle variabili (etichette).
 * @param {Object} columnGroups - I gruppi di colonne (per i colori).
 * @param {Object} labelColors - I colori associati ai gruppi di colonne.
 *
 * @param {L.Map} [map] - (Opzionale) L'istanza Leaflet, se vuoi fare toggle di layer.
 * @param {Object} [overlays] - (Opzionale) Oggetto per layer di overlay, { colKey: L.layer }.
 *
 * @returns {Chart} Il nuovo grafico a barre.
 */
export function updateBarChart(
  barChart,
  ctxBar,
  feature,
  barChartColumns,
  variableNames,
  columnGroups,
  labelColors,
  map,
  overlays
) {
  // 1. Distruge il grafico precedente
  if (barChart) {
    barChart.destroy();
  }

  // 2. Prepara i dati
  const properties = barChartColumns.filter(
    (key) => feature.properties[key] !== undefined
  );
  const values = properties.map((key) => feature.properties[key]);
  const labels = properties.map((key) => variableNames[key]);
  const backgroundColors = properties.map((key) => {
    const group = columnGroups[key];
    return labelColors[group] || "#999999";
  });

  // 3. Crea il nuovo chart
  return new Chart(ctxBar, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors,
          borderWidth: 1,
          colKeys: properties,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 45,
            font: {
              size: 11,
            },
          },
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            generateLabels: (chart) => {
              const groups = [...new Set(Object.values(columnGroups))];
              return groups.map((group) => ({
                text: group,
                fillStyle: labelColors[group],
              }));
            },
          },
        },
      },
      /**
       * 4. onClick per gestire il toggle su Leaflet
       */
      onClick: function (evt, elements) {
        if (!elements.length) return;

        const chartInstance = this;
        const elem = elements[0];
        const datasetIndex = elem.datasetIndex;
        const index = elem.index;

        // Otteniamo il "vero" nome della colonna
        const colKey = chartInstance.data.datasets[datasetIndex].colKeys[index];
        console.log("Cliccato su colKey =", colKey);

        // Se la mappa e gli overlays sono definiti, fa il toggle
        if (map && overlays && overlays[colKey]) {
          if (map.hasLayer(overlays[colKey])) {
            map.removeLayer(overlays[colKey]);
            console.log(`Rimosso layer ${colKey}`);
          } else {
            map.addLayer(overlays[colKey]);
            console.log(`Aggiunto layer ${colKey}`);
          }
        }
      },
    },
  });
}
