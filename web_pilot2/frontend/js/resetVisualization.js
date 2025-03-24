export function resetVisualization(pieChart, barChart) {
  if (pieChart) {
    pieChart.destroy();
    pieChart = null;
  }
  if (barChart) {
    barChart.destroy();
    barChart = null;
  }
  document.getElementById("pieChart").hidden = true;
  document.getElementById("barChart").hidden = true;
  document.getElementById("pieChart-placeholder").hidden = false;
  document.getElementById("barChart-placeholder").hidden = false;
}
